"""
Montage final du Reel Swap'Îles « robe jaune » (plans Kling + voix Mylène + musique + ambiances ElevenLabs).

Vidéo : 7 plans enchaînés en fondus courts (0,4 s), 1080×1920, 24 i/s ; plan 0 (carré) recadré en 9:16 ;
        dernière image tenue 0,8 s pour laisser finir la voix.
Audio : voix au premier plan (chaque réplique 0,35 s après le début de son plan), musique abaissée
        sous la voix et remontée entre les répliques et à la fin, ambiances nature discrètes ;
        mixage normalisé à -14 LUFS (crête -1,5 dBFS).
Usage : python3 tools/montage.py  (depuis out/reel-robe)
"""
import os
import subprocess

import numpy as np
import pyloudnorm as pyln
import soundfile as sf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "export")
TMP = os.path.join(ROOT, "tmp")
SR = 48000
XF = 0.4  # durée des fondus entre plans
HOLD = 0.8  # maintien de la dernière image


def run(*a):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *a], check=True)


def dur(p):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], capture_output=True, text=True).stdout)


def load(p):
    y = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(y, np.float32).astype(np.float64)


os.makedirs(OUT, exist_ok=True)
os.makedirs(TMP, exist_ok=True)

# ------------------------------------------------------------------ vidéo
clips = [os.path.join(ROOT, "clips", f"plan{i}.mp4") for i in range(7)]
durs = [dur(c) for c in clips]
starts = [0.0]
for d in durs[:-1]:
    starts.append(starts[-1] + d - XF)
total = starts[-1] + durs[-1] + HOLD

inputs, chains = [], []
for i, c in enumerate(clips):
    inputs += ["-i", c]
    if i == 0:  # carré 1440×1440 -> centre en 9:16
        f = "crop=ih*9/16:ih:(iw-ih*9/16)/2:0,scale=1080:1920:flags=lanczos"
    else:
        f = "scale=1080:1920:flags=lanczos"
    f += ",setsar=1,fps=24,format=yuv420p,settb=AVTB"
    if i == 6:
        f += f",tpad=stop_mode=clone:stop_duration={HOLD}"
    chains.append(f"[{i}:v]{f}[v{i}]")
prev = "v0"
for i in range(1, 7):
    chains.append(f"[{prev}][v{i}]xfade=transition=fade:duration={XF}:offset={starts[i]:.3f}[x{i}]")
    prev = f"x{i}"
video = os.path.join(TMP, "video.mp4")
run(*inputs, "-filter_complex", ";".join(chains), "-map", f"[{prev}]", "-an", "-c:v", "libx264", "-crf", "17", "-preset", "slow", "-pix_fmt", "yuv420p", "-r", "24", video)

# ------------------------------------------------------------------ voix
n = int(round(total * SR))
take = load(os.path.join(ROOT, "audio", "voix-prise2.mp3"))
fin = load(os.path.join(ROOT, "audio", "fin-b.mp3"))
# répliques découpées dans les silences de la prise 2 (secondes), la dernière vient de la prise « fin-b »
CUTS = [(0.00, 1.85), (2.01, 6.45), (7.06, 9.47), (9.93, 12.40), (12.84, 16.03)]
lines = [take[int(a * SR): int(b * SR)] for a, b in CUTS]
act = np.nonzero(np.abs(fin) > 10 ** (-50 / 20))[0]
lines.append(fin[max(0, act[0] - int(0.02 * SR)): act[-1] + int(0.15 * SR)])
voice = np.zeros(n)
placed = []
for k, l in enumerate(lines):
    l = l.copy()
    a, b = int(0.01 * SR), int(0.05 * SR)
    l[:a] *= np.linspace(0, 1, a)
    l[-b:] *= np.linspace(1, 0, b)
    t0 = starts[k + 1] + (0.35 if k < 5 else 0.2)
    i = int(t0 * SR)
    voice[i: i + len(l)] += l[: n - i]
    placed.append((round(t0, 2), round(t0 + len(l) / SR, 2)))

meter = pyln.Meter(SR)
v_lufs = meter.integrated_loudness(voice[voice != 0] if np.any(voice) else voice)

# ------------------------------------------------------------------ ambiances
amb = np.zeros(n)
for k, (name, t0) in enumerate([("sfx-01", 0.0), ("sfx-2", starts[2]), ("sfx-3", starts[3]), ("sfx-4", starts[4]), ("sfx-5", starts[5]), ("sfx-6", starts[6])]):
    s = load(os.path.join(ROOT, "audio", f"{name}.mp3"))
    s = s * 10 ** ((-23 - meter.integrated_loudness(s)) / 20)  # niveau commun avant mixage
    fi, fo = int(0.3 * SR), int(0.5 * SR)
    s[:fi] *= np.linspace(0, 1, fi)
    s[-fo:] *= np.linspace(1, 0, fo)
    i = int(t0 * SR)
    amb[i: i + len(s)] += s[: n - i]

# ------------------------------------------------------------------ musique (abaissée sous la voix)
mus = load(os.path.join(ROOT, "audio", "musique.mp3"))[:n]
mus = np.pad(mus, (0, n - len(mus)))
fo = int(1.2 * SR)
mus[-fo:] *= np.linspace(1, 0, fo)
m_lufs = meter.integrated_loudness(mus)
win = int(0.05 * SR)
rms = np.sqrt(np.convolve(voice**2, np.ones(win) / win, mode="same"))
active = np.convolve((rms > 10 ** (-42 / 20)).astype(float), np.ones(int(0.3 * SR)), mode="same") > 0
smooth = np.convolve(active.astype(float), np.ones(int(0.15 * SR)) / int(0.15 * SR), mode="same")
low, high = v_lufs - 17 - m_lufs, v_lufs - 8 - m_lufs  # sous la voix / entre les répliques et à la fin
gain = 10 ** ((low + (high - low) * (1 - smooth)) / 20)

a_lufs = meter.integrated_loudness(amb)
mix = voice + mus * gain + amb * 10 ** ((v_lufs - 21 - a_lufs) / 20)

# ------------------------------------------------------------------ normalisation -14 LUFS + limiteur
src, dst = os.path.join(TMP, "mix-f.wav"), os.path.join(TMP, "mix.wav")
for _ in range(2):
    mix = mix * 10 ** ((-14.0 - meter.integrated_loudness(np.stack([mix, mix], 1))) / 20)
    sf.write(src, np.stack([mix, mix], 1), SR, subtype="FLOAT")
    run("-i", src, "-af", "alimiter=limit=0.84:attack=3:release=60:level=disabled", "-ar", str(SR), "-c:a", "pcm_s24le", dst)
    mix = load(dst)
# pistes séparées (pour un éventuel remontage)
for name, sig in (("voix", voice), ("musique-sous-voix", mus * gain), ("ambiances", amb)):
    sf.write(os.path.join(OUT, f"piste-{name}.wav"), sig / max(1e-9, np.max(np.abs(sig))) * 0.89, SR, subtype="PCM_24")

final = os.path.join(OUT, "swapiles-reel-robe-jaune.mp4")
run("-i", video, "-i", dst, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", f"{total:.3f}", "-movflags", "+faststart", final)
print("plans (début s) :", [round(s, 2) for s in starts])
print("répliques (début-fin s) :", placed)
print("durée totale :", round(total, 2))
