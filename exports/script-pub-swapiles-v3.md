# Swap'Îles — script publicitaire Reel/TikTok (v3)

Format : 9:16, 22 à 24 s, voix off féminine (Mylène), musique séga/maloya 110 BPM.
Objectif : installations de l'appli / inscriptions, audience La Réunion.

## 1. Ce que l'analyse de la plateforme change

La version précédente répétait « gratuit » quatre fois. C'est un argument, pas une histoire, et c'est aussi ce que disent toutes les applis de seconde main.

Ce qui distingue vraiment Swap'Îles (vérifié dans le code du site) :

| Atout réel | Où dans le produit |
|---|---|
| Les annonces sont **près de chez toi, sur ton île** (Réunion, Martinique, Guadeloupe, Guyane, Mayotte) | choix du territoire à l'accueil |
| **Points relais = commerçants du quartier** : le vendeur dépose, l'acheteur récupère avec un code | pilote La Réunion, +3 € payés par l'acheteur |
| **Paiement bloqué jusqu'à la réception**, même en main propre : « fini les faux rendez-vous » | paiement en ligne, protection acheteur 10 % (0,50 € min, 15 € max) |
| **Faire une offre**, messagerie intégrée | fiche annonce |
| Dépôt d'annonce gratuit, le vendeur garde le prix qu'il fixe | pas de commission vendeur dans la config |
| Vente, **échange** et **don** | types d'annonce |

Le script raconte donc **le parcours d'un objet** (l'armoire → l'acheteuse → la remise) et donne **un bénéfice différent à chaque étape**. « Gratuit » n'apparaît qu'une fois, à l'écran.

## 2. Script (voix off + images + textes)

| Temps | Image (clips existants) | Voix off | Texte à l'écran |
|---|---|---|---|
| 0–1,5 s | Cascade Langevin, plongée rapide | *(musique, whoosh)* | — |
| 1,5–3,5 s | Elle sort la robe de l'armoire | « Cette robe que tu ne mets plus… » | **ELLE DORT DANS TON ARMOIRE ?** |
| 3,5–5,5 s | Plage, la jeune femme regarde son téléphone | « …quelqu'un sur l'île la cherche. » | **QUELQU'UN LA CHERCHE, ICI 📍** |
| 5,5–8 s | Photo de la robe → carte holographique (logo, 15 €, Publié ✓) | « Une photo, ton prix : elle est en ligne. » | **DÉPÔT GRATUIT · TU FIXES TON PRIX** |
| 8–10,5 s | Plage, sourire au téléphone (autre cadrage) | « Une acheteuse la trouve près de chez elle et te fait une offre. » | **FAIS UNE OFFRE 💬** |
| 10,5–13 s | Remise du sac au bord de mer | « Vous vous retrouvez en main propre… » | **MAIN PROPRE 🤝** |
| 13–15,5 s | Le commerçant reçoit le colis | « …ou chez un commerçant point relais du quartier. » | **POINT RELAIS CHEZ TON COMMERÇANT 🏪** |
| 15,5–18,5 s | Le commerçant sourit (zoom) | « Le paiement reste bloqué jusqu'à la réception : fini les faux rendez-vous. » | **PAIEMENT PROTÉGÉ 🛡️** + mention : « Protection acheteur : 10 % du prix (0,50 € min, 15 € max). Conditions sur swapiles.com » |
| 18,5–21 s | La robe virevolte sur la falaise, recul | « Swap'Îles, la seconde main pensée pour les îles. » | — |
| 21–24 s | Carte de fin | « Télécharge l'appli ! » | logo + swapiles.com + bouton **Télécharge l'appli** |

Voix off complète (71 mots, environ 23 s, « gratuit » : 0 fois) :

> Cette robe que tu ne mets plus… quelqu'un sur l'île la cherche. Une photo, ton prix : elle est en ligne. Une acheteuse la trouve près de chez elle et te fait une offre. Vous vous retrouvez en main propre… ou chez un commerçant point relais du quartier. Le paiement reste bloqué jusqu'à la réception : fini les faux rendez-vous. Swape-île, la seconde main pensée pour les îles. Télécharge l'appli !

(« Swape-île » = orthographe phonétique pour la voix ; les textes affichent « Swap'Îles ».)

**Version montée (exports/swapiles-reel-v3-parcours.mp4)** : voix féminine gratuite (edge-tts, Vivienne). La voix Mylène d'ElevenLabs coûterait 900 crédits, plus que le solde actuel. Deux ajustements de prononciation pour cette voix : « plus de faux rendez-vous » (« fini les faux » était entendu « fini l'effort ») et « Swap, île ». Les coupes sont à 1,0 / 2,65 / 4,2 / 4,85 / 7,0 / 9,6 / 11,2 / 13,1 / 14,9 / 16,8 / 18,3 s et la carte de fin à 19,7 s. Le bouton de fin affiche « Télécharge l'appli ».

Narration à la 2ᵉ personne : aucun personnage n'est présenté comme une vraie cliente.

## 3. Accroches alternatives (A/B test, 0–3 s)

1. « Cette robe que tu ne mets plus… quelqu'un sur l'île la cherche. » *(version du script, curiosité)*
2. « Fini les faux rendez-vous pour vendre tes affaires. » *(douleur : les acheteurs qui ne viennent pas)*
3. « À La Réunion, ta boutique du quartier peut devenir ton point relais. » *(nouveauté locale)*

## 4. Textes Meta

| Champ | Texte | Car. |
|---|---|---|
| Texte principal (court) | Ce que tu ne mets plus, quelqu'un sur l'île le cherche. Une photo, ton prix, et c'est en ligne. | 95 |
| Texte principal (long) | Ce que tu ne mets plus, quelqu'un sur l'île le cherche. Une photo, ton prix, et c'est en ligne. Remise en main propre ou chez un commerçant point relais, paiement bloqué jusqu'à la réception : fini les faux rendez-vous. | 219 |
| Titre | La seconde main pensée pour les îles | 36 |
| Description | Fini les faux rendez-vous | 25 |
| Bouton | Installer / S'inscrire | — |

## 5. Points de vigilance avant diffusion

- **CGV à mettre à jour.** Les conditions générales de vente du site mentionnent encore « Commission : 10 %… minimum de 1 € » et « Frais de protection acheteur : 1 € ». Ça contredit la config actuelle (0 commission, protection 10 % entre 0,50 € et 15 €), alors que les pubs promettent « tu gardes ton prix ».
- **Paiement bloqué :** vrai seulement pour le paiement par carte. En main propre, le paiement en espèces reste possible et n'est pas protégé.
- **Points relais :** il s'agit d'un pilote, à La Réunion seulement. Ne pas diffuser cette version sur les autres îles.
- **Pas de chiffres :** ne pas citer de nombre d'annonces ou de membres, car ces compteurs bougent en direct.
- **Badge « Membre vérifié » :** il est affiché sur tous les profils, sans vérification. Ne pas en faire un argument.
