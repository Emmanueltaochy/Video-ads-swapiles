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

## Storyboard (30 s) — V2 dynamique

La timeline est **calée sur la voix off** (repères au mot près dans `src/config.ts` → `T30` / `CUES_30S`) : jamais plus de 0,2 s de blanc entre deux phrases, et chaque élément apparaît sur le mot prononcé.

| Temps | Scène | Voix off |
|---|---|---|
| 0–3,7 s | Problème : colis métropole → Réunion, compteurs frais de port / délai, tampon « Trop cher. Trop long. » (secousse caméra) | « Commander depuis la métropole ? Des frais de port, des délais… la galère ! » |
| 3,7–6,2 s | Vague → logo Swap'Îles + confettis + « Tout est déjà sur l'île ! » | « Avec Swap'Îles, tout est déjà sur l'île ! » |
| 6,2–9,2 s | ① Photo : déclencheur, flash, « Annonce en ligne ! » + confettis, stickers favoris / vues | « Un : prends ton article en photo… et hop, il est en ligne ! » |
| 9,2–14,2 s | ② Notification, écran paiement, pastilles Échange · Don · CB · Espèces sur chaque mot | « Deux : vends-le, échange-le, ou donne-le ! Paiement par carte, ou en espèces. » |
| 14,2–18,2 s | ③ Écran remise, carte des points relais, tampon « VENDU ! » + « +25 € » | « Trois : remets-le en main propre, ou en point relais… » |
| 18,2–21,8 s | Cartes bénéfices (gagner de l'argent +125 €, consommer local, écologique) | « Gagne de l'argent, consomme local… » |
| 21,8–24,4 s | Grands compteurs « +2 000 annonces » / « +1 000 utilisateurs » + confettis | « Déjà plus de deux mille annonces, et mille utilisateurs ! » |
| 24,4–30 s | Logo + bouton « Télécharge Swap'Îles gratuitement » (tapé par une main) + App Store / Google Play + réseaux + swapiles.com | « Télécharge Swap'Îles gratuitement, sur l'App Store et Google Play ! » |

Le bas de l'écran (210 px, `SAFE_BOTTOM`) reste libre pour les boutons YouTube.

## Modifier la pub

- **Textes, chiffres, couleurs, timings voix** : `src/config.ts`
- **Scènes** : `src/scenes/*` · **compositions** : `src/Ad30s.tsx`, `src/Bumper6s.tsx`
- **Captures de l'app** : `public/screens/` (découpées des visuels du Drive)
- **Logo** : `public/brand/` (version vectorielle dans `src/components/logoPath.ts`)

## Audio

- **Musique** : composée et synthétisée par code (`scripts/generate_music.py`, numpy) → aucune bibliothèque externe, 100 % libre de droits. Pour une autre ambiance, remplace `public/audio/music-30s.wav` / `music-6s.wav`.
- **Bruitages** : générés par le même script (`public/audio/sfx/`).
- **Voix off** : synthèse vocale (`scripts/generate_voiceover.py`, voix `fr-FR-VivienneMultilingualNeural` via edge-tts), normalisée à −16 LUFS. Tout le texte est synthétisé **en un seul passage**, précédé d'une phrase française d'« échauffement » qui est jetée (la voix multilingue choisit sa langue sur les premiers mots : sans ça, l'accroche prenait un accent étranger), puis découpé phrase par phrase ; `public/audio/voice/timings.json` donne l'horodatage de chaque mot. La musique baisse automatiquement sous la voix (ducking).
  Si tu régénères la voix, réécoute-la (la synthèse varie légèrement) puis reporte les nouveaux temps dans `src/config.ts`.
  ⚠️ C'est une **voix de maquette** : pour la diffusion payante, remplace les fichiers `public/audio/voice/*.mp3` par une voix off professionnelle ou un service TTS sous licence commerciale (mêmes noms de fichiers ; ajuste `start`/`duration` dans `src/config.ts` si besoin).

```bash
pip install numpy scipy edge-tts
npm run audio:music
npm run audio:voice
```
