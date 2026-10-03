# Swap'Îles — Pubs YouTube (Remotion)

Deux publicités YouTube pour **Swap'Îles**, la seconde main des îles (version La Réunion) :

| Composition | Format | Durée | Usage |
|---|---|---|---|
| `SwapilesAd30s` | 1920×1080, 30 fps | 30 s | In-stream désactivable après 5 s |
| `SwapilesBumper6s` | 1920×1080, 30 fps | 6 s | Bumper non désactivable |

## Démarrer

```bash
npm install
npm run dev            # Remotion Studio (prévisualisation) -> http://localhost:3000
npm run render:all     # exporte out/swapiles-ad-30s.mp4 et out/swapiles-bumper-6s.mp4
```

## Storyboard (30 s)

| Temps | Scène | Voix off |
|---|---|---|
| 0–3,3 s | Problème : colis métropole → Réunion, compteurs frais de port / délai, tampon « Trop cher. Trop long. » | « Commander en métropole ? Frais de port, délais… galère ! » |
| 3,3–5 s | Vague → logo Swap'Îles + « Tout est déjà sur l'île ! » | « Avec Swap'Îles, tout est déjà sur l'île ! » |
| 5–10 s | ① Photographie : appareil photo dans le téléphone, flash, « Annonce en ligne ! » | « Un : prends ton article en photo. » |
| 10–15 s | ② Vends / échange / donne : fiche annonce, notification, écran paiement + pastilles CB · Espèces · Échange · Don | « Deux : vends-le, échange-le, ou donne-le… » |
| 15–20 s | ③ Rencontre l'acheteur : écran remise/livraison + carte des points relais | « Trois : remets-le en main propre, ou en point relais… » |
| 20–25 s | Bénéfices : gagner de l'argent (+125 €), consommer local, écologique + « +2 000 annonces · +1 000 utilisateurs » | « Gagne de l'argent, consomme local… » |
| 25–30 s | Logo + « Télécharge Swap'Îles gratuitement » + App Store / Google Play + Facebook · Instagram · TikTok + swapiles.com | « Télécharge Swap'Îles gratuitement… » |

Le bas de l'écran (210 px, `SAFE_BOTTOM`) reste libre pour les boutons YouTube.

## Modifier la pub

- **Textes, chiffres, couleurs, timings voix** : `src/config.ts`
- **Scènes** : `src/scenes/*` · **compositions** : `src/Ad30s.tsx`, `src/Bumper6s.tsx`
- **Captures de l'app** : `public/screens/` (découpées des visuels du Drive)
- **Logo** : `public/brand/` (version vectorielle dans `src/components/logoPath.ts`)

## Audio

- **Musique** : composée et synthétisée par code (`scripts/generate_music.py`, numpy) → aucune bibliothèque externe, 100 % libre de droits. Pour une autre ambiance, remplace `public/audio/music-30s.wav` / `music-6s.wav`.
- **Bruitages** : générés par le même script (`public/audio/sfx/`).
- **Voix off** : synthèse vocale (`scripts/generate_voiceover.py`, voix `fr-FR-VivienneMultilingualNeural` via edge-tts), normalisée à −16 LUFS. La musique baisse automatiquement sous la voix (ducking).
  ⚠️ C'est une **voix de maquette** : pour la diffusion payante, remplace les fichiers `public/audio/voice/*.mp3` par une voix off professionnelle ou un service TTS sous licence commerciale (mêmes noms de fichiers ; ajuste `start`/`duration` dans `src/config.ts` si besoin).

```bash
pip install numpy scipy edge-tts
npm run audio:music
npm run audio:voice
```
