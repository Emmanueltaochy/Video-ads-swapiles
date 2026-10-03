/**
 * Toute la "copie" et la charte de la pub sont ici :
 * modifie ce fichier pour changer textes, couleurs, chiffres ou timings.
 */
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** Zone réservée en bas de l'écran pour les boutons YouTube (Passer l'annonce, barre, etc.) */
export const SAFE_BOTTOM = 210;

export const COLORS = {
  primary: "#136a5d", // vert Swap'Îles
  deep: "#0a3f37",
  deeper: "#062a25",
  lagoon: "#2bb3a3",
  lagoonLight: "#7fe0d2",
  sand: "#fff6e6",
  sun: "#ffc94a",
  coral: "#ff6f59",
  white: "#ffffff",
  ink: "#10231f",
};

export const FONT = "Poppins, 'Helvetica Neue', Arial, sans-serif";

export const COPY = {
  brand: "Swap'Îles",
  tagline: "La seconde main des îles",
  territory: "La Réunion",
  site: "swapiles.com",
  hookQuestion: "Commander depuis la métropole ?",
  hookShipping: "Frais de port",
  hookShippingValue: "+25 €",
  hookDelay: "Délai",
  hookDelayValue: "3 semaines",
  hookStamp: "Trop cher. Trop long.",
  hookAnswer: "Tout est déjà sur l'île !",
  steps: [
    {
      title: "Prends ton article\nen photo",
      sub: "En quelques secondes,\nton annonce est en ligne",
    },
    {
      title: "Vends, échange\nou donne",
      sub: "Paiement par carte\nou en espèces",
    },
    {
      title: "Rencontre\nl'acheteur",
      sub: "En main propre ou en point relais,\nchez un commerçant\nprès de chez toi",
    },
  ],
  stepLabels: ["Photographie", "Vends", "Rencontre"],
  payChips: ["CB sécurisée", "Espèces", "Échange", "Don"],
  notification: { title: "Nouveau message", body: "Je le prends à 25 € !" },
  benefitsTitle: "Avec Swap'Îles…",
  benefits: [
    { title: "Gagne de l'argent", sub: "Vends ce qui dort\ndans tes placards" },
    { title: "Consomme local", sub: "100 % péi,\nentre Réunionnais" },
    { title: "Écologique", sub: "Donne une 2ᵉ vie\nà tes affaires" },
  ],
  moneyCounter: 125,
  stats: [
    { value: 2000, prefix: "+", label: "annonces" },
    { value: 1000, prefix: "+", label: "utilisateurs" },
  ],
  cta: "Télécharge Swap'Îles gratuitement",
  followUs: "Suis-nous",
  bumperHook: "Frais de port ? Délais ?",
  bumperForget: "Oublie !",
  bumperPitch: "Achète, vends et donne\nà La Réunion",
  bumperChips: ["CB ou espèces", "Point relais", "100 % local"],
};

/** Voix off : fichiers dans public/audio/voice, start/duration en secondes */
export const VOICE_30S = [
  { id: "ad30-01", start: 0.1, duration: 3.42 },
  { id: "ad30-02", start: 3.3, duration: 2.09 },
  { id: "ad30-03", start: 5.6, duration: 1.72 },
  { id: "ad30-04", start: 10.15, duration: 4.99 },
  { id: "ad30-05", start: 15.2, duration: 4.0 },
  { id: "ad30-06", start: 20.25, duration: 3.58 },
  { id: "ad30-07", start: 25.35, duration: 3.29 },
];

export const VOICE_6S = [
  { id: "bump-01", start: 0.05, duration: 2.35 },
  { id: "bump-02", start: 2.45, duration: 2.85 },
];

/** Volume musique hors voix / pendant la voix off (ducking automatique). */
export const MUSIC_VOLUME = 0.3;
export const MUSIC_DUCKED_VOLUME = 0.1;
export const VOICE_VOLUME = 1;
export const SFX_VOLUME = 0.35;

/** Découpage des scènes de la pub 30 s (en frames) */
export const SCENES_30S = {
  hook: { from: 0, duration: 150 }, // 0 – 5 s
  steps: { from: 150, duration: 450 }, // 5 – 20 s
  benefits: { from: 600, duration: 150 }, // 20 – 25 s
  cta: { from: 750, duration: 150 }, // 25 – 30 s
};
