"""
Voix off du script v3 (voix féminine gratuite edge-tts, en attendant Mylène).
Génère la voix, resserre les pauses (≤ 0,32 s) et écrit out/reel-robe/v3/audio/voix-serree.wav,
puis voix-finale.wav (« Swap, île » enchaîné).
"""
import asyncio
import os
import subprocess

try:  # derrière le proxy TLS de l'environnement
    import certifi

    if os.path.exists("/root/.ccr/ca-bundle.crt"):
        certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
except ImportError:
    pass
import edge_tts  # noqa: E402
import numpy as np  # noqa: E402
import soundfile as sf  # noqa: E402

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
A = os.path.join(ROOT, "out", "reel-robe", "v3", "audio")
VOICE = "fr-FR-VivienneMultilingualNeural"
RATE = "-2%"
TEXT = (
    "Cette robe que tu ne mets plus… quelqu'un sur l'île la cherche. "
    "Une photo, ton prix : elle est en ligne ! "
    "Une acheteuse la trouve près de chez elle, et te fait une offre. "
    "Vous vous retrouvez en main propre… ou chez un commerçant point relais du quartier. "
    "Le paiement reste bloqué jusqu'à la réception : plus de faux rendez-vous ! "
    "Swap, île, la seconde main pensée pour les îles. Télécharge l'appli !"
)


async def main():
    os.makedirs(A, exist_ok=True)
    raw = os.path.join(A, "voix-brute.mp3")
    for k in range(5):
        try:
            await edge_tts.Communicate(TEXT, VOICE, rate=RATE).save(raw)
            break
        except edge_tts.exceptions.NoAudioReceived:
            await asyncio.sleep(2 ** k)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af",
                    "silenceremove=start_periods=1:start_threshold=-45dB:stop_periods=-1:stop_duration=0.32:stop_threshold=-45dB",
                    "-ar", "48000", os.path.join(A, "voix-serree.wav")], check=True)


if not os.path.exists(os.path.join(A, "voix-serree.wav")):
    asyncio.run(main())

# Resserre « Swap, île » : la virgule laisse ~0,35 s entre « Swap » et « île », puis ~0,25 s avant « la seconde main ».
# Repères mesurés sur l'enveloppe de cette prise (s, dans voix-serree.wav) ; à revérifier si la voix est régénérée.
CUTS = [(15.94, 16.24), (16.64, 16.79)]
FADE = 0.01
y, sr = sf.read(os.path.join(A, "voix-serree.wav"))
f = int(FADE * sr)
parts, last = [], 0
for a, b in CUTS:
    parts.append(y[last:int(a * sr)].copy())
    last = int(b * sr)
parts.append(y[last:].copy())
for k, p in enumerate(parts):
    if k > 0:
        p[:f] *= np.linspace(0, 1, f)[:, None] if p.ndim > 1 else np.linspace(0, 1, f)
    if k < len(parts) - 1:
        p[-f:] *= np.linspace(1, 0, f)[:, None] if p.ndim > 1 else np.linspace(1, 0, f)
sf.write(os.path.join(A, "voix-finale.wav"), np.concatenate(parts), sr, subtype="PCM_24")
