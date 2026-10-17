"""Musique discrète (15 s) des 3 vidéos de la campagne Meta (angles A, B, C).

Synthèse par code (aucune bibliothèque sonore externe) : libre de droits.
Ambiance sobre : nappe douce + arpège de marimba feutré + shaker très léger,
pas de grosse caisse ni de steel pan (pas de « tropical criard »).

Sorties : public/meta/audio/music-A.wav, music-B.wav, music-C.wav
Usage : python3 scripts/generate_music_meta.py
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import generate_music as gm  # noqa: E402  (réutilise instruments, place(), master())

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "meta", "audio")
DUR = 15.0
BPM = 96
STEP = 60 / BPM / 4
BAR = STEP * 16

# Progressions (fondamentale basse, accord) — une couleur par angle
PROGS = {
    "A": [(43, [55, 59, 62, 66]), (40, [52, 55, 59, 62]), (36, [48, 52, 55, 59]), (38, [50, 54, 57, 60])],  # Gmaj7 Em7 Cmaj7 D7
    "B": [(36, [48, 52, 55, 59]), (43, [55, 59, 62, 66]), (45, [57, 60, 64, 67]), (41, [53, 57, 60, 64])],  # Cmaj7 Gmaj7 Am7 Fmaj7
    "C": [(38, [50, 54, 57, 61]), (45, [57, 61, 64, 66]), (47, [59, 62, 66, 69]), (43, [55, 59, 62, 66])],  # Dmaj7 A6 Bm7 Gmaj7
}


def soft_bass(note, dur):
    f = gm.midi(note)
    n = int(dur * gm.SR)
    t = np.arange(n) / gm.SR
    s = np.sin(2 * np.pi * f * t) * gm.env(n, 0.03, dur * 0.8)
    return gm.lowpass(s, 400) * 0.5


def render(angle):
    buf = np.zeros((int(DUR * gm.SR), 2))
    prog = PROGS[angle]
    t, b = 0.0, 0
    while t < DUR:
        root, chord = prog[b % 4]
        gm.place(buf, gm.pad(chord, BAR), t, 1.3)
        gm.place(buf, soft_bass(root, BAR * 0.95), t, 0.9)
        for k, s in enumerate((0, 3, 6, 8, 10, 13)):
            note = chord[k % 4] + (12 if k % 3 == 2 else 0)
            gm.place(buf, gm.marimba(note, 0.5), t + s * STEP, 0.32, pan=(-0.25 if k % 2 else 0.25))
        for s in range(0, 16, 2):
            gm.place(buf, gm.shaker(s % 4 == 2), t + s * STEP, 0.35, pan=0.3)
        t += BAR
        b += 1
    # résolution douce sur la carte de fin
    root, chord = prog[0]
    for i, note in enumerate(chord):
        gm.place(buf, gm.marimba(note + 12, 1.6), 13.6 + i * 0.06, 0.4)
    return gm.master(buf, fade_out=1.2)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for a in ("A", "B", "C"):
        gm.write(os.path.join(OUT, f"music-{a}.wav"), render(a))
