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

/**
 * Voix off : fichiers dans public/audio/voice (générés par scripts/generate_voiceover.py).
 * start/duration en secondes. Les timings des mots sont dans public/audio/voice/timings.json.
 */
export const VOICE_30S = [
  { id: "ad30-01", start: 0.05, duration: 3.89 },
  { id: "ad30-02", start: 3.75, duration: 2.22 },
  { id: "ad30-03", start: 5.98, duration: 3.06 },
  { id: "ad30-04", start: 9.05, duration: 4.91 },
  { id: "ad30-05", start: 14.0, duration: 4.05 },
  { id: "ad30-06", start: 18.1, duration: 3.6 },
  { id: "ad30-07", start: 21.72, duration: 2.64 },
  { id: "ad30-08", start: 24.4, duration: 3.21 },
];

export const VOICE_6S = [
  { id: "bump-01", start: 0.05, duration: 2.61 },
  { id: "bump-02", start: 2.55, duration: 2.93 },
];

/** Volume musique hors voix / pendant la voix off (ducking automatique). */
export const MUSIC_VOLUME = 0.3;
export const MUSIC_DUCKED_VOLUME = 0.11;
export const VOICE_VOLUME = 1;
export const SFX_VOLUME = 0.35;

/** Tempo de la musique (sert aussi aux "pulsations" visuelles sur le temps). */
export const BPM = 112;
/** Instant (s) où le groove démarre dans la pub 30 s : les pulsations s'alignent dessus. */
export const GROOVE_START_30S = 3.6;

/**
 * Timeline de la pub 30 s, en frames (30 fps), calée sur la voix off :
 * chaque scène démarre dès que la phrase précédente se termine.
 */
export const T30 = {
  hook: 0,
  reveal: 108, // 3,6 s : vague + logo
  step1: 179, // 6,0 s
  step2: 271, // 9,0 s
  step3: 419, // 14,0 s
  benefits: 541, // 18,0 s
  stats: 651, // 21,7 s
  cta: 730, // 24,3 s
  end: 900,
};

/** Repères (frames absolues) = mots clés de la voix off. */
export const CUES_30S = {
  shipping: 51, // « Frais de port »
  delay: 77, // « délais »
  stamp: 99, // « la galère »
  brand: 123, // « Swap'Îles »
  island: 145, // « tout est déjà sur l'île »
  shoot: 212, // « photo » -> déclencheur
  online: 233, // « et hop » -> annonce en ligne
  sell: 294, // « vends-le »
  swap: 314, // « échange-le »
  give: 341, // « donne-le »
  pay: 363, // « Paiement »
  card: 376, // « carte »
  cash: 398, // « espèces »
  handover: 441, // « remets-le en main propre »
  relay: 473, // « point relais »
  shop: 504, // « commerçant »
  sold: 528, // fin de phrase -> VENDU !
  money: 545, // « Gagne de l'argent »
  local: 574, // « consomme local »
  eco: 605, // « donne une seconde vie »
  ads: 670, // « deux mille annonces »
  users: 696, // « mille utilisateurs »
  download: 734, // « Télécharge »
  appStore: 789, // « App Store »
  googlePlay: 803, // « Google Play »
};

/** Timeline du bumper 6 s (frames). */
export const T6 = { pitch: 76, cta: 138, end: 180 };
export const CUES_6S = {
  delays: 44, // « Délais ? »
  forget: 64, // « Oublie ! »
  buy: 78, // « Achète »
  sell: 101, // « vends »
  give: 107, // « et donne »
  reunion: 115, // « à La Réunion »
  brand: 142, // « Swap'Îles »
};
