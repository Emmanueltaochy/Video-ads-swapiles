"""Compose et synthétise la musique + les bruitages des pubs Swap'Îles.

Tout est généré par code (synthèse additive avec numpy) : aucune
bibliothèque sonore externe, donc 100 % libre de droits.

Sorties (public/audio/) :
  music-30s.wav, music-6s.wav            -> musique tropicale (steel pan, marimba, groove afro)
  sfx/whoosh.wav, sfx/thud.wav, sfx/pop.wav, sfx/shutter.wav, sfx/ding.wav, sfx/notif.wav

Usage : python3 scripts/generate_music.py
Dépendances : pip install numpy scipy
"""
import os

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 44100
BPM = 104
STEP = 60 / BPM / 4  # durée d'une double-croche
BAR = STEP * 16
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
rng = np.random.default_rng(974)  # 974 = indicatif de La Réunion :)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def env(n, attack, decay):
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    return a * np.exp(-t / decay)


def place(buf, sig, t, gain=1.0, pan=0.0):
    if t < 0:  # l'intro peut commencer avant 0 : on tronque le début
        cut = int(-t * SR)
        if cut >= len(sig):
            return
        sig, t = sig[cut:], 0.0
    i = int(t * SR)
    if i >= len(buf):
        return
    sig = sig[: len(buf) - i]
    l, r = np.sqrt(0.5 * (1 - pan)), np.sqrt(0.5 * (1 + pan))
    buf[i : i + len(sig), 0] += sig * gain * l
    buf[i : i + len(sig), 1] += sig * gain * r


def lowpass(x, fc, order=2):
    return sosfilt(butter(order, fc, "low", fs=SR, output="sos"), x)


def highpass(x, fc, order=2):
    return sosfilt(butter(order, fc, "high", fs=SR, output="sos"), x)


def bandpass(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


# ---------------------------------------------------------------- instruments
def steelpan(note, dur=0.9):
    f = midi(note)
    n = int(dur * SR)
    t = np.arange(n) / SR
    partials = [(1, 1.0, 0.55), (2, 0.55, 0.35), (3.01, 0.25, 0.22), (4.2, 0.12, 0.12), (5.4, 0.05, 0.08)]
    s = sum(a * np.sin(2 * np.pi * f * k * t) * env(n, 0.003, d) for k, a, d in partials)
    return s * 0.5


def marimba(note, dur=0.6):
    f = midi(note)
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) * env(n, 0.002, 0.28)
    s += 0.35 * np.sin(2 * np.pi * f * 3.93 * t) * env(n, 0.001, 0.05)
    s += 0.15 * np.sin(2 * np.pi * f * 9.2 * t) * env(n, 0.001, 0.02)
    return s * 0.6


def bass(note, dur):
    f = midi(note)
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t) + 0.1 * np.sin(2 * np.pi * 3 * f * t)
    e = env(n, 0.005, dur * 0.9)
    e[-int(0.02 * SR) :] *= np.linspace(1, 0, int(0.02 * SR))
    return lowpass(s * e, 900) * 0.8


def pad(notes, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for note in notes:
        for det in (-0.12, 0.12):
            f = midi(note + det)
            s += np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)
    a = np.clip(t / 0.35, 0, 1) * np.clip((dur - t) / 0.35, 0, 1)
    return lowpass(s * a, 1800) * 0.07


def kick():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 48 + 90 * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env(n, 0.001, 0.13) * 1.1


def clap():
    n = int(0.25 * SR)
    noise = rng.standard_normal(n)
    e = np.zeros(n)
    for off in (0, 0.011, 0.022):
        i = int(off * SR)
        e[i:] += env(n - i, 0.001, 0.012 if off < 0.02 else 0.09)
    return bandpass(noise * e, 900, 5000) * 0.55


def rim():
    n = int(0.08 * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * 1700 * t) * env(n, 0.0005, 0.012) + 0.4 * rng.standard_normal(n) * env(n, 0.0005, 0.006)
    return highpass(s, 600) * 0.35


def shaker(accent):
    n = int(0.09 * SR)
    s = highpass(rng.standard_normal(n), 6000) * env(n, 0.012, 0.025)
    return s * (0.22 if accent else 0.11)


def crash():
    n = int(2.2 * SR)
    s = highpass(rng.standard_normal(n), 4500) * env(n, 0.002, 0.6)
    return s * 0.28


def riser(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    # balayage d'un filtre passe-bande via fenêtres successives
    out = np.zeros(n)
    win = 2048
    for i in range(0, n, win):
        p = i / n
        lo = 300 + 5000 * p**2
        seg = noise[i : i + win]
        out[i : i + win] = bandpass(seg, lo, lo * 1.8 + 200)
    return out * (t / dur) ** 2 * 0.35


# ---------------------------------------------------------------- composition
# Progression I - vi - IV - V en sol majeur (lumineuse et chaleureuse)
CHORDS = [
    (43, [55, 59, 62, 67]),  # G
    (40, [52, 55, 59, 64]),  # Em
    (36, [48, 52, 55, 60]),  # C
    (38, [50, 54, 57, 62]),  # D
]
# Mélodie steel pan (pentatonique de sol), rythme 3-3-2 "tropical"
MELODY = [
    [(0, 74), (3, 71), (6, 74), (8, 76), (11, 74), (14, 71)],
    [(0, 71), (3, 67), (6, 71), (8, 74), (11, 71), (14, 69)],
    [(0, 72), (3, 76), (6, 79), (8, 76), (11, 74), (14, 72)],
    [(0, 74), (3, 78), (6, 81), (8, 79), (10, 78), (12, 74), (14, 76)],
]
TRESILLO = [0, 3, 6, 8, 11, 14]


def groove_bar(buf, t0, bar_idx, full=True, melody=True):
    root, chord = CHORDS[bar_idx % 4]
    place(buf, pad(chord, BAR), t0, 1.0)
    for s in range(16):
        t = t0 + s * STEP
        place(buf, shaker(s % 2 == 1), t, 1.0, pan=0.35)
        if not full:
            continue
        if s in (0, 7, 8):
            place(buf, kick(), t, 1.0 if s != 7 else 0.6)
        if s in (4, 12):
            place(buf, clap(), t, 1.0, pan=-0.1)
        if s in (3, 6, 10, 14):
            place(buf, rim(), t, 1.0, pan=-0.4)
    if full:
        for i, s in enumerate((0, 3, 6, 8, 11, 14)):
            nxt = (3, 6, 8, 11, 14, 16)[i]
            note = root if s not in (6, 14) else root + 12
            place(buf, bass(note, (nxt - s) * STEP * 0.92), t0 + s * STEP, 0.9)
    # marimba : arpège en doubles-croches impaires
    for k, s in enumerate((2, 5, 9, 13)):
        place(buf, marimba(chord[k % 4] + 12), t0 + s * STEP, 0.55 if full else 0.4, pan=-0.3)
    if melody:
        for s, note in MELODY[bar_idx % 4]:
            place(buf, steelpan(note), t0 + s * STEP, 0.75, pan=0.2)


def final_hit(buf, t):
    root, chord = CHORDS[0]
    place(buf, kick(), t, 1.1)
    place(buf, crash(), t, 1.0)
    place(buf, bass(root, 1.6), t, 1.0)
    for i, note in enumerate([67, 71, 74, 79]):
        place(buf, steelpan(note, 2.5), t + i * 0.025, 0.6, pan=0.15)
    place(buf, pad(chord, 2.2), t, 1.5)


def master(buf, fade_out=0.6):
    buf = buf.copy()
    n = int(fade_out * SR)
    buf[-n:] *= np.linspace(1, 0, n)[:, None]
    buf = np.tanh(buf * 1.1) / np.tanh(1.1)  # légère saturation douce
    peak = np.max(np.abs(buf))
    return (buf / peak * 0.89).astype(np.float32)


def render_30s():
    dur = 30.0
    buf = np.zeros((int(dur * SR), 2))
    # 0 -> 3.3 s : intro "problème" (pad + marimba seuls, plus sobre)
    drop = 3.3
    intro_start = drop - 2 * BAR
    for b in range(2):
        groove_bar(buf, intro_start + b * BAR, b + 2, full=False, melody=False)
    place(buf, riser(1.1), drop - 1.1, 1.0)
    place(buf, crash(), drop, 1.0)
    # 3.3 -> 29.2 s : groove complet
    end_hit = 28.9
    b = 0
    t = drop
    while t + BAR <= end_hit + 0.01:
        groove_bar(buf, t, b, full=True, melody=True)
        t += BAR
        b += 1
    # remplissage jusqu'au coup final
    rest = end_hit - t
    if rest > 0.05:
        tmp = np.zeros((int(BAR * SR) + 10, 2))
        groove_bar(tmp, 0, b, full=True, melody=True)
        n = int(rest * SR)
        buf[int(t * SR) : int(t * SR) + n] += tmp[:n]
    final_hit(buf, end_hit)
    # l'intro démarre avant 0 : on ne garde que [0, 30]
    return master(buf, fade_out=0.5)


def render_6s():
    dur = 6.0
    buf = np.zeros((int(dur * SR), 2))
    place(buf, crash(), 0.0, 0.7)
    t = 0.0
    for b in range(2):
        groove_bar(buf, t, b, full=True, melody=True)
        t += BAR
    final_hit(buf, 5.0)
    return master(buf, fade_out=0.25)


# ---------------------------------------------------------------- bruitages
def sfx():
    out = {}
    # whoosh : bruit filtré qui monte puis descend
    n = int(0.55 * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    w = np.zeros(n)
    win = 1024
    for i in range(0, n, win):
        p = i / n
        c = 400 + 3500 * np.sin(np.pi * p)
        w[i : i + win] = bandpass(noise[i : i + win], c * 0.6, c * 1.4)
    out["whoosh"] = w * np.sin(np.pi * t / t[-1]) ** 2 * 0.9
    # thud : coup de tampon
    n = int(0.4 * SR)
    t = np.arange(n) / SR
    f = 55 + 70 * np.exp(-t / 0.03)
    th = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.001, 0.12)
    th += lowpass(rng.standard_normal(n), 1200) * env(n, 0.001, 0.03) * 0.6
    out["thud"] = th * 0.95
    # pop : petite bulle
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    f = 300 + 900 * np.exp(-t / 0.02)
    out["pop"] = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.001, 0.04) * 0.9
    # déclencheur photo : deux clics
    n = int(0.25 * SR)
    s = np.zeros(n)
    for off, g in ((0, 1.0), (0.09, 0.7)):
        i = int(off * SR)
        m = int(0.05 * SR)
        s[i : i + m] += highpass(rng.standard_normal(m), 1500) * env(m, 0.0005, 0.008) * g
    out["shutter"] = s * 0.9
    # ding (caisse / argent)
    n = int(1.2 * SR)
    t = np.arange(n) / SR
    d = np.sin(2 * np.pi * 1318.5 * t) * env(n, 0.002, 0.35) + 0.6 * np.sin(2 * np.pi * 1975.5 * t) * env(n, 0.002, 0.25)
    d[int(0.09 * SR) :] += (np.sin(2 * np.pi * 1760 * t) * env(n, 0.002, 0.4))[: n - int(0.09 * SR)]
    out["ding"] = d * 0.35
    # notification message
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    a = np.sin(2 * np.pi * 987.8 * t) * env(n, 0.002, 0.08)
    b = np.zeros(n)
    k = int(0.11 * SR)
    b[k:] = (np.sin(2 * np.pi * 1318.5 * t) * env(n, 0.002, 0.15))[: n - k]
    out["notif"] = (a + b) * 0.45
    return out


def write(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if data.ndim == 1:
        data = np.stack([data, data], axis=1)
    wavfile.write(path, SR, (np.clip(data, -1, 1) * 32767).astype(np.int16))
    print("ok", os.path.relpath(path))


if __name__ == "__main__":
    write(os.path.join(OUT, "music-30s.wav"), render_30s())
    write(os.path.join(OUT, "music-6s.wav"), render_6s())
    for name, sig in sfx().items():
        write(os.path.join(OUT, "sfx", f"{name}.wav"), sig.astype(np.float32))
