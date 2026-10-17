"""
Voix off des pubs Meta (angles A, B, C) — versions « -voix ».

Pour chaque angle :
  1. synthèse edge-tts (voix gratuite Microsoft « Vivienne ») en un seul passage, précédée
     d'une phrase d'échauffement jetée ensuite (la voix multilingue part ainsi en français) ;
  2. découpe en phrases grâce aux horodatages mot à mot ;
  3. chaque phrase est posée au début de sa scène (ou juste après la précédente) ; si le tout
     dépasse, la voix est accélérée (atempo, 1,1× maximum) ;
  4. sous-titres recalculés sur les mots réellement dits (2 lignes max, largeur mesurée) ;
  5. mixage : musique ~20 dB sous la voix pendant qu'elle parle, remontée à la fin,
     normalisation finale à -14 LUFS.

Sorties : public/meta/voice/mix-<X>.wav et src/meta/voiceCues.ts.
Usage : python3 scripts/generate_voice_meta.py
"""
import asyncio
import json
import os
import re
import subprocess
import unicodedata

import edge_tts
import numpy as np
import pyloudnorm as pyln
import soundfile as sf
from PIL import ImageFont

ROOT = os.path.join(os.path.dirname(__file__), "..")
OUT = os.path.join(ROOT, "public", "meta", "voice")
TMP = os.path.join(OUT, "_tmp")
FONT = os.environ.get("SUB_FONT", os.path.join(ROOT, "meta-campaign", "fonts", "InstrumentSans-600.ttf"))
VOICE = "fr-FR-VivienneMultilingualNeural"
RATE = "+0%"
SR = 44100
FPS = 30
TOTAL = 15.0
END_MARGIN = 0.35  # la dernière syllabe se termine au plus tard à 15 s - marge
MAX_TEMPO = 1.10
SUB_SIZE = 47
SUB_MAX_W = 828  # largeur intérieure du bandeau de sous-titre (880 - 2 × 26)

WARMUP = "Bonjour à toutes et à tous, voici une nouvelle publicité en français pour La Réunion."

# (début de scène en s, texte dit). « Swap-îles » : orthographe phonétique pour la voix ;
# les sous-titres affichent « Swap’Îles ».
SCRIPTS = {
    "A": [
        (0.0, "Tout ça, je l'ai mis en vente ce matin."),
        (3.0, "Une photo, un prix, c'est en ligne. Le dépôt est gratuit."),
        (8.0, "Je remets en main propre ou en point relais, près de chez moi."),
        (12.0, "Inscris-toi sur Swap-îles, le lien est juste en dessous."),
    ],
    "B": [
        (0.0, "Sur Swap-îles, la vendeuse est payée quand j'ai reçu mon colis."),
        (3.0, "Je paie en ligne, l'argent reste bloqué jusqu'à ce que je reçoive l'article."),
        (9.0, "S'il n'arrive pas ou ne correspond pas à l'annonce, je suis remboursée."),
        (13.0, "Swap-îles, lien en dessous."),
    ],
    "C": [
        (0.0, "Une appli de seconde main pensée pour les îles."),
        (3.0, "Les annonces sont ici, à La Réunion."),
        (8.0, "Je récupère en main propre, en point relais chez un commerçant, ou par Colissimo."),
        (12.0, "Inscris-toi sur Swap-îles, le lien est juste en dessous."),
    ],
}


def display(text):
    """Texte affiché : typographie française (apostrophe courbe, nom de marque)."""
    return text.replace("Swap-îles", "Swap'Îles").replace("'", "’")


def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    return re.sub(r"[^a-z0-9]", "", "".join(c for c in s if unicodedata.category(c) != "Mn"))


async def synth(text, path):
    com = edge_tts.Communicate(text, VOICE, rate=RATE, boundary="WordBoundary")
    words = []
    with open(path, "wb") as f:
        async for chunk in com.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                s = chunk["offset"] / 1e7
                words.append([s, s + chunk["duration"] / 1e7, chunk["text"]])
    return words


def align(tokens, words, wi):
    """Horodate chaque jeton affiché (séparé par des espaces) avec les mots de la synthèse."""
    out = []
    for tok in tokens:
        target, acc, first = norm(tok), "", None
        if not target:  # ponctuation isolée
            out.append(out[-1] if out else None)
            continue
        while len(acc) < len(target):
            w = norm(words[wi][2])
            if w and first is None:
                first = wi
            acc += w
            wi += 1
        if acc != target:
            raise RuntimeError(f"alignement impossible : {acc!r} != {target!r}")
        out.append((words[first][0], words[wi - 1][1]))
    return out, wi


font = ImageFont.truetype(FONT, SUB_SIZE)


def width(s):
    return font.getlength(s)


WEAK = {"en", "ou", "de", "la", "le", "les", "a", "est", "que", "ce", "je", "un", "une", "sur", "pas", "ne", "et", "par", "chez"}


NOBREAK = {("seconde", "main"), ("main", "propre"), ("point", "relais"), ("correspond", "pas"), ("en", "dessous")}
BEFORE = {"quand", "a", "ou", "jusqua", "pensee"}


def best_two_lines(toks):
    """Meilleure coupure en 2 lignes (ou 1) : tout tient, coupure après ponctuation, équilibre."""
    one = " ".join(toks)
    if width(one) <= SUB_MAX_W:
        return [one]
    best = None
    for k in range(1, len(toks)):
        a, b = " ".join(toks[:k]), " ".join(toks[k:])
        wa, wb = width(a), width(b)
        if max(wa, wb) > SUB_MAX_W:
            continue
        score = abs(wa - wb) - (600 if re.search(r"[,.;:]$", toks[k - 1]) else 0)
        if norm(toks[k - 1]) in WEAK:  # pas de ligne qui finit sur un petit mot
            score += 400
        if (norm(toks[k - 1]), norm(toks[k])) in NOBREAK:  # groupes inséparables
            score += 1000
        if norm(toks[k]) in BEFORE:  # coupure naturelle avant une conjonction
            score -= 200
        if best is None or score < best[0]:
            best = (score, [a, b])
    return best[1] if best else None


def chunks(toks):
    """Découpe une phrase en sous-titres de 2 lignes max (coupure de préférence sur ponctuation)."""
    lines = best_two_lines(toks)
    if lines:
        return [(0, lines)]
    best = None
    for k in range(1, len(toks)):
        if best_two_lines(toks[:k]) and best_two_lines(toks[k:]):
            score = abs(k - len(toks) / 2) - (100 if re.search(r"[,.;:]$", toks[k - 1]) else 0)
            if best is None or score < best[0]:
                best = (score, k)
    k = best[1]
    return [(0, best_two_lines(toks[:k]))] + [(k + i, l) for i, l in chunks(toks[k:])]


def ffmpeg(*args):
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *args], check=True)


def load(path):
    y, sr = sf.read(path, always_2d=True)
    y = y.mean(axis=1)
    assert sr == SR, (path, sr)
    return y


async def build(angle):
    segs = SCRIPTS[angle]
    full = os.path.join(TMP, f"{angle}-full.mp3")
    words = await synth(" ".join([WARMUP] + [t for _, t in segs]), full)
    full_wav = os.path.join(TMP, f"{angle}-full.wav")
    # nettoyage : passe-haut (souffle / grave inutile), léger désessage, mono 44,1 kHz
    ffmpeg("-i", full, "-af", "highpass=f=80,lowpass=f=15000,deesser=i=0.3", "-ar", str(SR), "-ac", "1", full_wav)
    voice_src = load(full_wav)

    _, wi = align(WARMUP.split(), words, 0)
    parts = []
    for scene, text in segs:
        toks = display(text).split()
        times, wi = align(text.split(), words, wi)
        a, b = times[0][0], times[-1][1]
        a0, b0 = max(0, a - 0.03), b + 0.12
        clip = voice_src[int(a0 * SR): int(b0 * SR)].copy()
        n = int(0.012 * SR)
        clip[:n] *= np.linspace(0, 1, n)
        clip[-int(0.06 * SR):] *= np.linspace(1, 0, int(0.06 * SR))
        parts.append({"scene": scene, "clip": clip, "toks": toks, "times": [(s - a0, e - a0) for s, e in times]})

    def place(tempo):
        t, out = 0.0, []
        for i, p in enumerate(parts):
            start = 0.0 if i == 0 else max(p["scene"] - 0.15, t + 0.28)
            dur = len(p["clip"]) / SR / tempo
            out.append(start)
            t = start + dur
        return out, t

    tempo = 1.0
    starts, end = place(tempo)
    while end > TOTAL - END_MARGIN and tempo < MAX_TEMPO:
        tempo = round(tempo + 0.01, 2)
        starts, end = place(tempo)
    if end > TOTAL - END_MARGIN:
        raise RuntimeError(f"{angle} : la voix dépasse même à {MAX_TEMPO}× ({end:.2f} s)")

    if tempo > 1.0:
        for p in parts:
            src, dst = os.path.join(TMP, "seg.wav"), os.path.join(TMP, "seg-t.wav")
            sf.write(src, p["clip"], SR)
            ffmpeg("-i", src, "-af", f"atempo={tempo}", "-ar", str(SR), dst)
            p["clip"] = load(dst)
            p["times"] = [(s / tempo, e / tempo) for s, e in p["times"]]

    voice = np.zeros(int(TOTAL * SR))
    for p, st in zip(parts, starts):
        i = int(st * SR)
        c = p["clip"][: len(voice) - i]
        voice[i: i + len(c)] += c
    # compression douce de la voix (niveau régulier, crêtes maîtrisées)
    raw, comp = os.path.join(TMP, "v.wav"), os.path.join(TMP, "v-c.wav")
    sf.write(raw, voice, SR)
    ffmpeg("-i", raw, "-af", "acompressor=threshold=-24dB:ratio=3:attack=4:release=90:makeup=2", "-ar", str(SR), comp)
    voice = load(comp)[: int(TOTAL * SR)]

    # sous-titres : mots exacts, apparition au début de chaque phrase / morceau dit
    cues = []
    for p, st in zip(parts, starts):
        for k, lines in chunks(p["toks"]):
            cues.append({"from": max(0, round((st + p["times"][k][0]) * FPS) - (1 if not cues else 0)), "lines": lines})
    for i, c in enumerate(cues):
        c["to"] = cues[i + 1]["from"] if i + 1 < len(cues) else int(TOTAL * FPS)

    # mixage : musique ~20 dB sous la voix, remontée après le dernier mot
    meter = pyln.Meter(SR)
    music = load(os.path.join(ROOT, "public", "meta", "audio", f"music-{angle}.wav"))[: len(voice)]
    music = np.pad(music, (0, len(voice) - len(music)))
    v_end = starts[-1] + parts[-1]["times"][-1][1]
    v_lufs = meter.integrated_loudness(voice[: int(v_end * SR)])
    m_lufs = meter.integrated_loudness(music)
    duck = 10 ** ((v_lufs - 20 - m_lufs) / 20)
    up = 10 ** ((v_lufs - 8 - m_lufs) / 20)
    t = np.arange(len(voice)) / SR
    gain = np.where(t < v_end + 0.05, duck, duck + (up - duck) * np.clip((t - v_end - 0.05) / 0.5, 0, 1))
    mix = voice + music * gain
    # normalisation -14 LUFS puis limiteur (crête -1,5 dBFS) ; deux passes pour viser juste
    src, dst = os.path.join(TMP, "m.wav"), os.path.join(OUT, f"mix-{angle}.wav")
    for _ in range(2):
        mix = mix * 10 ** ((-14.0 - meter.integrated_loudness(np.stack([mix, mix], axis=1))) / 20)
        sf.write(src, np.stack([mix, mix], axis=1), SR, subtype="FLOAT")
        ffmpeg("-i", src, "-af", "alimiter=limit=0.84:attack=3:release=60:level=disabled", "-ar", str(SR), "-c:a", "pcm_s24le", dst)
        mix = load(dst)
    sf.write(os.path.join(TMP, f"voice-{angle}.wav"), voice, SR)
    first_word = starts[0] + parts[0]["times"][0][0]
    info = {
        "tempo": tempo,
        "first_word": round(first_word, 3),
        "voice_end": round(v_end, 2),
        "music_vs_voice_db": round(m_lufs + 20 * np.log10(duck) - v_lufs, 1),
        "lufs": round(meter.integrated_loudness(np.stack([mix, mix], axis=1)), 1),
    }
    print(angle, info)
    return cues, info


async def main():
    os.makedirs(TMP, exist_ok=True)
    all_cues, report = {}, {}
    for angle in SCRIPTS:
        all_cues[angle], report[angle] = await build(angle)
    with open(os.path.join(ROOT, "src", "meta", "voiceCues.ts"), "w") as f:
        f.write("// Généré par scripts/generate_voice_meta.py — sous-titres calés sur la voix off.\n")
        f.write("export const VOICE_CUES: Record<\"A\" | \"B\" | \"C\", { from: number; to: number; lines: string[] }[]> = ")
        f.write(json.dumps(all_cues, ensure_ascii=False, indent=2))
        f.write(";\n")
    with open(os.path.join(OUT, "report.json"), "w") as f:
        json.dump(report, f, indent=2)


if __name__ == "__main__":
    asyncio.run(main())
