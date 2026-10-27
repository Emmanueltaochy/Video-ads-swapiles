"""
Voix off du script v3 (voix féminine gratuite edge-tts, en attendant Mylène).
Génère la voix, resserre les pauses (≤ 0,32 s) et écrit out/reel-robe/v3/audio/voix-serree.wav.
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


asyncio.run(main())
