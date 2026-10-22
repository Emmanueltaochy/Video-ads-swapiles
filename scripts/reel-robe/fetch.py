"""Télécharge les générations ElevenLabs terminées à partir d'un résultat creative_get_flow_run_status (JSON)."""
import json, os, subprocess, sys
NAMES = {
    "B6KX9u64RxrXDOMTseQb": "clips/plan0.mp4", "tzZBgGyd2O2x8y4WV7rT": "clips/plan1.mp4", "0FeGeOyNPtuPcA4xHW13": "clips/plan2.mp4",
    "VgQ7CcBe33vRezUNpR7S": "clips/plan3.mp4", "PtIeG8YVcxz1eQPKgQvk": "clips/plan4.mp4", "Vkzxf9ELi8q3pgdWg0Rc": "clips/plan5.mp4",
    "byfsF28B65hkSvH8fQqC": "clips/plan6.mp4", "IogAPTLFMcY6NfrpN1nV": "audio/musique.mp3", "uFQObdAKViTLR4WnH6HT": "audio/sfx-01.mp3",
    "JrbEN6pUN0tX4Q2JdPBf": "audio/sfx-2.mp3", "aeYQm0KUJTNL7ph2Ivx6": "audio/sfx-3.mp3", "QRDKoJzrGvCVh736UIo0": "audio/sfx-4.mp3",
    "aEktbbCaAmbyRS3TNtVh": "audio/sfx-5.mp3", "zLcZYEpFJeolBK2MHoFp": "audio/sfx-6.mp3", "sxSZF41o6iL8jL0388mg": "audio/fin-a.mp3",
    "RUZ5uIskEX9KvA465utY": "audio/fin-b.mp3",
}
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data = json.load(open(sys.argv[1]))
for g in data["generations"]:
    name = NAMES.get(g["id"], g["id"])
    dst = os.path.join(root, name)
    if g["status"] == "completed" and not os.path.exists(dst):
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        subprocess.run(["curl", "-sSL", "-m", "180", "-o", dst, g["content_url"]], check=True)
    print(f'{name:22s} {g["status"]:11s} {g.get("width","")}x{g.get("height","")} {g.get("duration_secs","")}')
