"""Génère la voix off (TTS) des deux pubs, segment par segment.

Chaque segment devient public/audio/voice/<id>.mp3 et est placé dans la
timeline Remotion (voir src/config.ts -> VOICE_30S / VOICE_6S).

Usage : python3 scripts/generate_voiceover.py
Dépendance : pip install edge-tts
"""
import asyncio
import os
import subprocess
import sys

try:  # Derrière un proxy TLS, utilise le bundle CA de l'environnement s'il existe
    import certifi

    if os.path.exists("/root/.ccr/ca-bundle.crt"):
        certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
except ImportError:
    pass

import edge_tts

VOICE = os.environ.get("SWAPILES_VOICE", "fr-FR-VivienneMultilingualNeural")
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "voice")

# (id, texte, débit). "Swap-îles" est écrit ainsi pour une bonne prononciation.
SEGMENTS = [
    # --- Pub 30 s ---
    ("ad30-01", "Commander en métropole ? Frais de port, délais… galère !", "+12%"),
    ("ad30-02", "Avec Swap-îles, tout est déjà sur l'île !", "+5%"),
    ("ad30-03", "Un : prends ton article en photo.", "+0%"),
    ("ad30-04", "Deux : vends-le, échange-le, ou donne-le. Paiement par carte ou en espèces.", "+5%"),
    ("ad30-05", "Trois : remets-le en main propre, ou en point relais, chez un commerçant près de chez toi.", "+8%"),
    ("ad30-06", "Gagne de l'argent, consomme local, et donne une seconde vie à tes affaires !", "+5%"),
    ("ad30-07", "Télécharge Swap-îles gratuitement, sur l'App Store et Google Play !", "+0%"),
    # --- Bumper 6 s ---
    ("bump-01", "Frais de port ? Délais ? Oublie !", "+10%"),
    ("bump-02", "Achète, vends et donne à La Réunion, avec Swap-îles !", "+12%"),
]


async def main(only):
    os.makedirs(OUT_DIR, exist_ok=True)
    for seg_id, text, rate in SEGMENTS:
        if only and seg_id not in only:
            continue
        out = os.path.join(OUT_DIR, f"{seg_id}.mp3")
        raw = out.replace(".mp3", ".raw.mp3")
        await edge_tts.Communicate(text, VOICE, rate=rate).save(raw)
        # Normalisation à -16 LUFS + petit bas de chaleur, sans silence final
        subprocess.run(
            [
                "ffmpeg", "-loglevel", "error", "-y", "-i", raw,
                "-af", "areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
                "equalizer=f=180:t=q:w=1:g=2,loudnorm=I=-16:TP=-1.5:LRA=7",
                "-ar", "44100", "-b:a", "192k", out,
            ],
            check=True,
        )
        os.remove(raw)
        print("ok", seg_id)


if __name__ == "__main__":
    asyncio.run(main(set(sys.argv[1:])))
