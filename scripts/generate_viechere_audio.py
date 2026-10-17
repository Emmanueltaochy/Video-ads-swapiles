"""
Reel « La vie lé chèr » (27 s) : voix off + musique + bruitages, mixés à -14 LUFS.

- Voix : edge-tts « Vivienne » (gratuite), posée et dynamique (+5 %), une phrase par scène ;
  accélérée (1,1× max) seulement si le tout dépasse.
- Musique : synthèse par code (scripts/generate_music.py) : tension 0-3 s, groove sobre ensuite
  (sans mélodie), transitions discrètes, accord final à 25 s. Libre de droits.
- Bruitages synthétisés et calés sur l'image (temps identiques à src/viechere/timing.ts).
- Musique abaissée sous la voix (env. -16 dB), remontée entre les phrases et à la fin.

Sorties : public/viechere/mix.wav et src/viechere/voiceCues.ts
Usage : python3 scripts/generate_viechere_audio.py
"""
import certifi

certifi.where = lambda: "/root/.ccr/ca-bundle.crt"  # proxy de l'environnement (vérification TLS conservée)

import asyncio  # noqa: E402
import json  # noqa: E402
import os  # noqa: E402
import sys  # noqa: E402

import numpy as np  # noqa: E402
import pyloudnorm as pyln  # noqa: E402
import soundfile as sf  # noqa: E402

sys.path.insert(0, os.path.dirname(__file__))
import generate_music as gm  # noqa: E402
import generate_voice_meta as gv  # noqa: E402  (synthèse, alignement, découpe des sous-titres)

ROOT = os.path.join(os.path.dirname(__file__), "..")
OUT = os.path.join(ROOT, "public", "viechere")
TMP = os.path.join(OUT, "_tmp")
SR = 44100
FPS = 30
TOTAL = 27.0
gv.RATE = "+5%"

# (début de scène, texte dit). Orthographe phonétique pour la voix ; affichage via display().
LINES = [
    (0.0, "À La Réunion, la vie lé chère !"),
    (3.0, "Et pendant ce temps, nos armoires débordent de linge qu'on ne met plus."),
    (7.0, "Swape-île. La seconde main pensée pour les îles."),  # « Swape-île » : « souap-île » net en début de phrase
    (10.0, "Vendre, c'est gratuit. Le prix que tu fixes, tu le gardes."),
    (14.0, "Tu récupères en main propre ? C'est gratuit pour tout le monde."),
    (18.0, "Tu préfères l'envoi ? Ton paiement est protégé jusqu'à la réception."),
    (22.0, "Le linge change de main, et il reste sur l'île. Inscris-toi, c'est en dessous !"),
]


def display(text):
    return text.replace("lé chère", "lé chèr").replace("Swape-île", "Swap'Îles").replace("Swap-îles", "Swap'Îles").replace("'", "’")


def tokens(text):
    """Mots séparés par des espaces ; « ? » et « ! » restent collés au mot précédent (espace insécable)."""
    out = []
    for t in text.split():
        if t in ("?", "!", ":", ";") and out:
            out[-1] += " " + t
        else:
            out.append(t)
    return out


def sentence_cues(toks):
    """Un sous-titre par phrase ; deux phrases courtes partagent un sous-titre (une par ligne)."""
    sents, cur = [], []
    for i, t in enumerate(toks):
        cur.append(i)
        if t[-1] in ".!?":
            sents.append(cur)
            cur = []
    if cur:
        sents.append(cur)
    out, i = [], 0
    while i < len(sents):
        a = " ".join(toks[j] for j in sents[i])
        if i + 1 < len(sents):
            b = " ".join(toks[j] for j in sents[i + 1])
            if gv.width(a) <= gv.SUB_MAX_W and gv.width(b) <= gv.SUB_MAX_W and len(a) + len(b) < 46:
                out.append((sents[i][0], [a, b]))
                i += 2
                continue
        out += [(sents[i][0] + k, lines) for k, lines in gv.chunks([toks[j] for j in sents[i]])]
        i += 1
    return out


# ---------------------------------------------------------------- bruitages
rng = np.random.default_rng(974)


def noise_burst(dur, lo, hi, attack, decay, gain):
    n = int(dur * SR)
    return gm.bandpass(rng.standard_normal(n), lo, hi) * gm.env(n, attack, decay) * gain


def whoosh(dur=0.6, gain=0.9):
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise, w = rng.standard_normal(n), np.zeros(n)
    for i in range(0, n, 1024):
        c = 300 + 3800 * np.sin(np.pi * i / n)
        w[i: i + 1024] = gm.bandpass(noise[i: i + 1024], c * 0.6, c * 1.4)
    return w * np.sin(np.pi * t / t[-1]) ** 2 * gain


def rumble(dur=1.6, gain=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = gm.lowpass(rng.standard_normal(n), 140, 4) * 6
    s += 0.5 * np.sin(2 * np.pi * (38 + 10 * t / dur) * t)
    return s * np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.5 * gain


def boom(gain=1.0):
    n = int(1.4 * SR)
    t = np.arange(n) / SR
    f = 40 + 80 * np.exp(-t / 0.06)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * gm.env(n, 0.002, 0.45)
    s += gm.lowpass(rng.standard_normal(n), 900) * gm.env(n, 0.001, 0.12) * 0.5
    return s * gain


def clang(gain=0.5):
    n = int(1.2 * SR)
    t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * t) * gm.env(n, 0.001, d) * a for f, d, a in ((523, 0.5, 1), (1046, 0.35, 0.5), (1568, 0.25, 0.35), (2349, 0.18, 0.2)))
    return s * gain


def sparkle(gain=0.25):
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for k, f in enumerate((2093, 2637, 3136)):
        i = int(k * 0.05 * SR)
        s[i:] += (np.sin(2 * np.pi * f * t) * gm.env(n, 0.001, 0.12))[: n - i]
    return s * gain


SFX = gm.sfx()  # whoosh, thud, pop, shutter, ding, notif


def sfx_track():
    buf = np.zeros(int(TOTAL * SR))

    def at(t, sig, g=1.0):
        i = int(t * SR)
        sig = sig[: len(buf) - i]
        buf[i: i + len(sig)] += sig * g

    # 1 — l'île surgit, la Fournaise gronde
    at(0.0, rumble(1.8), 0.7)
    at(0.55, noise_burst(0.9, 250, 2600, 0.01, 0.25, 0.35))  # houle
    at(1.3, rumble(1.4), 0.4)
    # 2 — piqué dans les nuages, intérieur de la case
    at(2.95, whoosh(0.8), 0.7)
    at(3.7, whoosh(0.6), 0.45)
    at(5.4, whoosh(0.7), 0.35)  # le linge glisse hors de l'armoire
    # 3 — tourbillon puis logo
    at(7.0, gm.riser(1.2), 0.9)
    at(8.25, boom(0.5))
    at(8.25, sparkle(0.2))
    # 4 — la robe glisse dans le téléphone, annonce en ligne
    at(10.6, whoosh(0.45), 0.5)
    at(11.95, SFX["ding"], 0.4)
    # 5 — trajectoire, rencontre
    at(14.55, whoosh(0.9), 0.45)
    at(16.2, sparkle(0.18))
    # 6 — tunnel de lumière, bouclier
    at(18.0, gm.riser(1.2), 0.7)
    at(19.65, clang(0.3))
    # 7 — l'île s'illumine, recul jusqu'au logo
    at(24.3, whoosh(0.8), 0.45)
    at(25.0, sparkle(0.22))
    return buf




def music():
    dur = TOTAL
    buf = np.zeros((int(dur * SR), 2))
    gm.section(buf, 0.0, 3.0, bar0=2, full=False, melody=False, tension=True)
    gm.place(buf, gm.riser(0.9), 3.0 - 0.9, 1.0)
    gm.place(buf, gm.crash(), 3.0, 0.8)
    gm.section(buf, 3.0, 25.0, bar0=0, full=True, melody=False)  # groove sans mélodie : plus sobre
    for t in (7.0, 14.0, 22.0):
        gm.place(buf, gm.riser(0.45), t - 0.45, 0.5)
    gm.final_hit(buf, 25.0)
    return gm.master(buf, fade_out=0.8).mean(axis=1)


async def synth_sentences(text, path):
    """Synthèse + horodatage par phrase, avec nouvelles tentatives (service parfois indisponible)."""
    for attempt in range(8):
        try:
            return await _synth_sentences(text, path)
        except gv.edge_tts.exceptions.NoAudioReceived:
            print(f"service TTS indisponible, nouvel essai dans {2 ** attempt} s")
            await asyncio.sleep(2 ** attempt)
    raise RuntimeError("synthèse vocale impossible")


async def _synth_sentences(text, path):
    com = gv.edge_tts.Communicate(text, gv.VOICE, rate=gv.RATE)
    sents = []
    with open(path, "wb") as f:
        async for chunk in com.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "SentenceBoundary":
                s = chunk["offset"] / 1e7
                sents.append((s, s + chunk["duration"] / 1e7, chunk["text"]))
    return sents


def word_starts(clip, toks):
    """Début (s) de chaque jeton dans un extrait, via les horodatages mot à mot de Whisper."""
    from faster_whisper import WhisperModel

    global _WM
    if "_WM" not in globals():
        _WM = WhisperModel("medium", compute_type="int8")
    path = os.path.join(TMP, "w.wav")
    sf.write(path, clip, SR)
    segs, _ = _WM.transcribe(path, language="fr", word_timestamps=True)
    heard = [(gv.norm(w.word), w.start) for sg in segs for w in sg.words if gv.norm(w.word)]
    exp = [gv.norm(t) for t in toks]
    # alignement séquentiel texte attendu <-> mots entendus (tolère les variantes : « Swapil »…)
    import difflib

    sm = difflib.SequenceMatcher(a=exp, b=[h[0] for h in heard], autojunk=False)
    starts = [None] * len(exp)
    for blk in sm.get_matching_blocks():
        for d in range(blk.size):
            starts[blk.a + d] = heard[blk.b + d][1]
    # mots non reconnus : interpolation entre voisins reconnus (au prorata des caractères)
    known = [i for i, v in enumerate(starts) if v is not None]
    end = len(clip) / SR
    for i in range(len(exp)):
        if starts[i] is None:
            lo = max([j for j in known if j < i], default=None)
            hi = min([j for j in known if j > i], default=None)
            t0 = starts[lo] if lo is not None else 0.0
            t1 = starts[hi] if hi is not None else end
            a0 = lo if lo is not None else 0
            span = sum(len(e) for e in exp[a0:(hi if hi is not None else len(exp))]) or 1
            starts[i] = t0 + (t1 - t0) * sum(len(e) for e in exp[a0:i]) / span
    starts[0] = 0.0
    return starts


async def main():
    os.makedirs(TMP, exist_ok=True)
    full = os.path.join(TMP, "full.mp3")
    sents = await synth_sentences(" ".join([gv.WARMUP] + [t for _, t in LINES]), full)
    full_wav = os.path.join(TMP, "full.wav")
    gv.ffmpeg("-i", full, "-af", "highpass=f=80,lowpass=f=15000,deesser=i=0.3", "-ar", str(SR), "-ac", "1", full_wav)
    src = gv.load(full_wav)
    # regroupe les phrases synthétisées par réplique (par correspondance de texte)
    si = 0
    acc = ""
    while gv.norm(acc) != gv.norm(gv.WARMUP):
        acc += sents[si][2]
        si += 1

    parts = []
    for scene, text in LINES:
        target, acc, first = gv.norm(text), "", si
        while len(gv.norm(acc)) < len(target):
            acc += sents[si][2]
            si += 1
        if gv.norm(acc) != target:
            raise RuntimeError(f"découpage impossible : {acc!r}")
        a0, b0 = max(0, sents[first][0] - 0.03), sents[si - 1][1] + 0.12
        clip = src[int(a0 * SR): int(b0 * SR)].copy()
        # coupe les silences de bord (la frontière de phrase inclut parfois la pause)
        act = np.nonzero(np.abs(clip) > 10 ** (-45 / 20))[0]
        clip = clip[max(0, act[0] - int(0.02 * SR)): act[-1] + int(0.1 * SR)]
        # resserre les pauses entre phrases (> 0,22 s ramenées à 0,18 s) : rythme Reel
        a, b = os.path.join(TMP, "c.wav"), os.path.join(TMP, "c-s.wav")
        sf.write(a, clip, SR)
        gv.ffmpeg("-i", a, "-af", "silenceremove=stop_periods=-1:stop_duration=0.22:stop_threshold=-45dB:stop_silence=0.18", "-ar", str(SR), b)
        clip = gv.load(b)
        n = int(0.012 * SR)
        clip[:n] *= np.linspace(0, 1, n)
        clip[-int(0.06 * SR):] *= np.linspace(1, 0, int(0.06 * SR))
        shown = tokens(display(text))
        ws = word_starts(clip, tokens(text))
        dur = len(clip) / SR
        parts.append({"scene": scene, "clip": clip, "toks": shown, "times": [(w, dur) for w in ws[:-1]] + [(ws[-1], dur - 0.1)]})

    def place(tempo):
        t, starts = 0.0, []
        for i, p in enumerate(parts):
            st = 0.0 if i == 0 else max(p["scene"] + 0.05, t + 0.2)
            starts.append(st)
            t = st + len(p["clip"]) / SR / tempo
        return starts, t

    tempo = 1.0
    starts, end = place(tempo)
    def late(st):  # retard maximal d'une réplique sur le début de sa scène
        return max(st0 - p["scene"] for st0, p in zip(st, parts))

    while (end > 26.4 or late(starts) > 0.9) and tempo < 1.10:
        tempo = round(tempo + 0.01, 2)
        starts, end = place(tempo)
    if tempo > 1.0:
        for p in parts:
            a, b = os.path.join(TMP, "s.wav"), os.path.join(TMP, "s-t.wav")
            sf.write(a, p["clip"], SR)
            gv.ffmpeg("-i", a, "-af", f"atempo={tempo}", "-ar", str(SR), b)
            p["clip"] = gv.load(b)
            p["times"] = [(s / tempo, e / tempo) for s, e in p["times"]]

    voice = np.zeros(int(TOTAL * SR))
    for p, st in zip(parts, starts):
        i = int(st * SR)
        voice[i: i + len(p["clip"])] += p["clip"][: len(voice) - i]
    raw, comp = os.path.join(TMP, "v.wav"), os.path.join(TMP, "v-c.wav")
    sf.write(raw, voice, SR)
    gv.ffmpeg("-i", raw, "-af", "acompressor=threshold=-24dB:ratio=3:attack=4:release=90:makeup=2", "-ar", str(SR), comp)
    voice = gv.load(comp)[: int(TOTAL * SR)]

    # sous-titres : mots exacts, au moment où ils sont dits
    cues = []
    for p, st in zip(parts, starts):
        for k, lines in sentence_cues(p["toks"]):
            cues.append({"from": max(0, round((st + p["times"][k][0]) * FPS)), "lines": lines})
    for i, c in enumerate(cues):
        nxt = cues[i + 1]["from"] if i + 1 < len(cues) else int(TOTAL * FPS)
        c["to"] = nxt
    # le dernier sous-titre reste jusqu'à la fin de la voix + 1 s
    cues[-1]["to"] = min(int(TOTAL * FPS), round((starts[-1] + parts[-1]["times"][-1][1] + 1.0) * FPS))

    # mixage
    meter = pyln.Meter(SR)
    v_lufs = meter.integrated_loudness(voice)
    mus = music()[: len(voice)]
    mus = np.pad(mus, (0, len(voice) - len(mus)))
    m_lufs = meter.integrated_loudness(mus)
    # enveloppe d'activité de la voix (lissée) -> gain de la musique
    win = int(0.05 * SR)
    rms = np.sqrt(np.convolve(voice**2, np.ones(win) / win, mode="same"))
    active = (rms > 10 ** (-40 / 20)).astype(float)
    hold = int(0.25 * SR)
    active = np.convolve(active, np.ones(hold), mode="same") > 0
    k = int(0.12 * SR)
    smooth = np.convolve(active.astype(float), np.ones(k) / k, mode="same")
    low, high = v_lufs - 16 - m_lufs, v_lufs - 7 - m_lufs
    gain = 10 ** ((low + (high - low) * (1 - smooth)) / 20)
    sfx = sfx_track()
    s_lufs = meter.integrated_loudness(sfx)
    sfx *= 10 ** ((v_lufs - 12 - s_lufs) / 20)
    mix = voice + mus * gain + sfx

    dst, tmpf = os.path.join(OUT, "mix.wav"), os.path.join(TMP, "m.wav")
    for _ in range(2):
        mix = mix * 10 ** ((-14.0 - meter.integrated_loudness(np.stack([mix, mix], 1))) / 20)
        sf.write(tmpf, np.stack([mix, mix], 1), SR, subtype="FLOAT")
        gv.ffmpeg("-i", tmpf, "-af", "alimiter=limit=0.84:attack=3:release=60:level=disabled", "-ar", str(SR), "-c:a", "pcm_s24le", dst)
        mix = gv.load(dst)
    sf.write(os.path.join(TMP, "voice.wav"), voice, SR)

    with open(os.path.join(ROOT, "src", "viechere", "voiceCues.ts"), "w") as f:
        f.write("// Généré par scripts/generate_viechere_audio.py — sous-titres calés sur la voix off.\n")
        f.write("export const VC_CUES: { from: number; to: number; lines: string[] }[] = ")
        f.write(json.dumps(cues, ensure_ascii=False, indent=2) + ";\n")
    print(json.dumps({
        "tempo": tempo,
        "starts": [round(s, 2) for s in starts],
        "ends": [round(s + p["times"][-1][1], 2) for s, p in zip(starts, parts)],
        "lufs": round(meter.integrated_loudness(np.stack([mix, mix], 1)), 1),
    }))


if __name__ == "__main__":
    asyncio.run(main())
