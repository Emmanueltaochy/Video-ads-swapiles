"""
Mixage audio du Reel « robe jaune » script v3 (22,4 s).

- Voix du script v3 (scripts/reel-robe/voix_v3.py), posée à 1,1 s.
- Musique 110 BPM continue, abaissée sous la voix (~13 dB), remontée à la fin.
- Un whoosh (whip) ou un impact (punch / carte de fin) à chaque coupe, déclic + pop magique au flash.
- Vagues et oiseaux discrets sur l'ouverture, la plage et la remise en main propre.
- Normalisation -14 LUFS, crête -1,5 dBFS.
Sorties : public/reelrobe/mix-v3.wav + pistes séparées dans out/reel-robe/v3/export/.
"""
import os
import subprocess

import numpy as np
import pyloudnorm as pyln
import soundfile as sf

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
A2 = os.path.join(ROOT, "out", "reel-robe", "v2", "audio")  # musique et bruitages
A = os.path.join(ROOT, "out", "reel-robe", "v3", "audio")
EXP = os.path.join(ROOT, "out", "reel-robe", "v3", "export")
SR = 48000
TOTAL = 22.4
VOICE_AT = 1.1
# coupes (s) et type de transition — doivent suivre V3_SHOTS / V3_END dans src/reelrobe/ReelRobeV3.tsx
CUTS = [(1.0, "punch"), (2.65, "whip"), (4.2, "whip"), (4.85, "punch"), (7.0, "whip"), (9.6, "whip"), (11.2, "whip"), (13.1, "punch"), (14.9, "whip"), (16.8, "whip"), (18.3, "punch"), (19.7, "impact")]
FLASH = 5.5  # flash de l'appareil photo dans la carte holographique
AMB = [(0.0, 1.1), (2.65, 4.2), (7.0, 11.2), (14.9, 16.8)]


def load(p):
    y = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(y, np.float32).astype(np.float64)


def run(*a):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *a], check=True)


os.makedirs(EXP, exist_ok=True)
n = int(TOTAL * SR)
meter = pyln.Meter(SR)

voice = np.zeros(n)
v = load(os.path.join(A, "voix-serree.wav"))
i = int(VOICE_AT * SR)
voice[i: i + len(v)] = v[: n - i]
v_lufs = meter.integrated_loudness(v)

mus = load(os.path.join(A2, "musique.mp3"))[:n]
mus = np.pad(mus, (0, n - len(mus)))
fo = int(0.6 * SR)
mus[-fo:] *= np.linspace(1, 0, fo)
m_lufs = meter.integrated_loudness(mus)
win = int(0.05 * SR)
rms = np.sqrt(np.convolve(voice**2, np.ones(win) / win, mode="same"))
act = np.convolve((rms > 10 ** (-42 / 20)).astype(float), np.ones(int(0.35 * SR)), mode="same") > 0
sm = np.convolve(act.astype(float), np.ones(int(0.12 * SR)) / int(0.12 * SR), mode="same")
low, high = v_lufs - 13 - m_lufs, v_lufs - 5 - m_lufs
mus_g = mus * 10 ** ((low + (high - low) * (1 - sm)) / 20)

sfx = np.zeros(n)
wh, im, dp = (load(os.path.join(A2, f)) for f in ("whoosh.mp3", "impact.mp3", "declic-pop.mp3"))


def put(sig, t, g):
    j = int(t * SR)
    sig = sig[: n - j]
    sfx[j: j + len(sig)] += sig * g


for t, kind in CUTS:
    if kind == "whip":
        put(wh, t - 0.25, 0.9)
    elif kind == "punch":
        put(wh, t - 0.2, 0.6)
        put(im, t, 0.5)
    else:
        put(im, t, 1.0)
put(dp, FLASH - 0.05, 1.0)
s_lufs = meter.integrated_loudness(sfx[sfx != 0]) if np.any(sfx) else -70
sfx *= 10 ** ((v_lufs - 9 - s_lufs) / 20)

amb = np.zeros(n)
w = load(os.path.join(A2, "vagues-oiseaux.mp3"))
w *= 10 ** ((v_lufs - 20 - meter.integrated_loudness(w)) / 20)
k = 0
for a, b in AMB:
    seg = w[k: k + int((b - a) * SR)].copy()
    k += len(seg)
    f = int(0.25 * SR)
    seg[:f] *= np.linspace(0, 1, f)
    seg[-f:] *= np.linspace(1, 0, f)
    j = int(a * SR)
    amb[j: j + len(seg)] += seg

mix = voice + mus_g + sfx + amb
tmp, dst = os.path.join(EXP, "_mix.wav"), os.path.join(ROOT, "public", "reelrobe", "mix-v3.wav")
for _ in range(2):
    mix = mix * 10 ** ((-14.0 - meter.integrated_loudness(np.stack([mix, mix], 1))) / 20)
    sf.write(tmp, np.stack([mix, mix], 1), SR, subtype="FLOAT")
    run("-i", tmp, "-af", "alimiter=limit=0.84:attack=3:release=60:level=disabled", "-ar", str(SR), "-c:a", "pcm_s24le", dst)
    mix = load(dst)
os.remove(tmp)
for name, sig in (("voix-off", voice), ("musique", mus), ("bruitages-ambiances", sfx + amb)):
    sf.write(os.path.join(EXP, f"piste-{name}.wav"), np.stack([sig, sig], 1) / max(1e-9, np.max(np.abs(sig))) * 0.89, SR, subtype="PCM_24")
print("LUFS final :", round(meter.integrated_loudness(np.stack([mix, mix], 1)), 1), "| voix :", VOICE_AT, "->", round(VOICE_AT + len(v) / SR, 2), "s")
