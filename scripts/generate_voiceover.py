"""Génère la voix off (TTS) des deux pubs.

Chaque pub est synthétisée EN UNE SEULE FOIS (texte complet) : la voix
multilingue détecte ainsi correctement le français dès la première phrase
(sur une phrase courte isolée, elle peut prendre un accent étranger).
Le fichier est ensuite découpé phrase par phrase grâce aux horodatages des
mots, puis chaque segment est normalisé et placé dans la timeline Remotion
(voir src/config.ts -> VOICE_30S / VOICE_6S).

Sorties : public/audio/voice/<id>.mp3 + public/audio/voice/timings.json

Usage : python3 scripts/generate_voiceover.py
Dépendances : pip install edge-tts ; ffmpeg
"""
import asyncio
import json
import os
import re
import subprocess
import unicodedata

try:  # Derrière un proxy TLS, utilise le bundle CA de l'environnement s'il existe
    import certifi

    if os.path.exists("/root/.ccr/ca-bundle.crt"):
        certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
except ImportError:
    pass

import edge_tts

VOICE = os.environ.get("SWAPILES_VOICE", "fr-FR-VivienneMultilingualNeural")
RATE = "+12%"
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "voice")

# "Swap-îles" est écrit ainsi pour une bonne prononciation.
SCRIPTS = {
    "ad30": [
        ("ad30-01", "Commander depuis la métropole ? Des frais de port, des délais… la galère !"),
        ("ad30-02", "Avec Swap-îles, tout est déjà sur l'île !"),
        ("ad30-03", "Un : prends ton article en photo… et hop, il est en ligne !"),
        ("ad30-04", "Deux : vends-le, échange-le, ou donne-le ! Paiement par carte, ou en espèces."),
        ("ad30-05", "Trois : remets-le en main propre, ou en point relais, chez un commerçant près de chez toi."),
        ("ad30-06", "Gagne de l'argent, consomme local, et donne une seconde vie à tes affaires !"),
        ("ad30-07", "Déjà plus de deux mille annonces, et mille utilisateurs !"),
        ("ad30-08", "Télécharge Swap-îles gratuitement, sur l'App Store et Google Play !"),
    ],
    "bump": [
        ("bump-01", "Des frais de port ? Des délais ? Oublie ça !"),
        ("bump-02", "Achète, vends et donne à La Réunion, avec Swap-îles !"),
    ],
}


# Phrase d'échauffement lue AVANT le script puis jetée : la voix multilingue
# choisit sa langue sur les premiers mots, elle est ainsi déjà en français
# quand arrive la phrase d'accroche.
WARMUP = ("_warmup", "Bonjour à toutes et à tous, voici une nouvelle publicité en français pour La Réunion.")


def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    return re.sub(r"[^a-z0-9]", "", "".join(c for c in s if unicodedata.category(c) != "Mn"))


async def synth(text, mp3_path):
    com = edge_tts.Communicate(text, VOICE, rate=RATE, boundary="WordBoundary")
    words = []
    with open(mp3_path, "wb") as f:
        async for chunk in com.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                start = chunk["offset"] / 1e7
                words.append((start, start + chunk["duration"] / 1e7, chunk["text"]))
    return words


def split_segments(segments, words):
    """Associe les mots horodatés à chaque segment (par correspondance de texte)."""
    spans, wi = [], 0
    for seg_id, text in segments:
        target, acc, first = norm(text), "", None
        while wi < len(words) and len(acc) < len(target):
            w = norm(words[wi][2])
            if w:
                if first is None:
                    first = wi
                acc += w
            wi += 1
        if acc != target:
            raise RuntimeError(f"Découpage impossible pour {seg_id}: {acc!r} != {target!r}")
        spans.append((seg_id, words[first][0], words[wi - 1][1], words[first:wi]))
    return spans


async def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    timings = {}
    # Tout est synthétisé en un seul passage : plus il y a de texte français,
    # plus la détection de langue de la voix multilingue est fiable.
    for name, segments in {"all": [WARMUP] + SCRIPTS["ad30"] + SCRIPTS["bump"]}.items():
        full_text = " ".join(t for _, t in segments)
        full_mp3 = os.path.join(OUT_DIR, f"_{name}-full.mp3")
        words = await synth(full_text, full_mp3)
        spans = split_segments(segments, words)
        for i, (seg_id, start, end, seg_words) in enumerate(spans):
            if seg_id == WARMUP[0]:
                continue
            a = max(0.0, start - 0.06)
            nxt = spans[i + 1][1] if i + 1 < len(spans) else end + 0.6
            b = min(end + 0.18, nxt - 0.02)
            out = os.path.join(OUT_DIR, f"{seg_id}.mp3")
            subprocess.run(
                [
                    "ffmpeg", "-loglevel", "error", "-y", "-i", full_mp3,
                    "-af", f"atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,"
                    "afade=t=in:d=0.02,areverse,afade=t=in:d=0.06,areverse,"
                    # resserre les pauses internes (rythme pub plus dynamique)
                    "silenceremove=stop_periods=-1:stop_duration=0.18:stop_threshold=-42dB:stop_silence=0.14,"
                    "equalizer=f=180:t=q:w=1:g=2,loudnorm=I=-16:TP=-1.5:LRA=7",
                    "-ar", "44100", "-b:a", "192k", out,
                ],
                check=True,
            )
            dur = float(
                subprocess.run(
                    ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out],
                    capture_output=True, text=True, check=True,
                ).stdout
            )
            timings[seg_id] = {
                "duration": round(dur, 2),
                # début de chaque mot, relatif au segment (avant resserrage des pauses)
                "words": [[w[2], round(w[0] - a, 2)] for w in seg_words],
            }
            print(f"ok {seg_id} {dur:.2f}s")
        os.remove(full_mp3)
    with open(os.path.join(OUT_DIR, "timings.json"), "w") as f:
        json.dump(timings, f, indent=2)


if __name__ == "__main__":
    asyncio.run(main())
