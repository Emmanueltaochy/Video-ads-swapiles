/**
 * Reel « Parents » (1080×1920) — vie chère à La Réunion + articles enfant / bébé.
 * Textes, prix d'exemple et timeline calée sur la voix off (voir
 * public/audio/voice/timings-parents.json pour l'horodatage des mots).
 */
import { IconName } from "../components/Icons";

export const PARENTS_DURATION = 780; // 26 s à 30 fps

export const VOICE_PARENTS = [
  { id: "par-01", start: 0.05, duration: 3.45 },
  { id: "par-02", start: 3.4, duration: 3.84 },
  { id: "par-03", start: 7.25, duration: 2.14 },
  { id: "par-04", start: 9.4, duration: 4.28 },
  { id: "par-05", start: 13.7, duration: 4.26 },
  { id: "par-06", start: 18.0, duration: 2.56 },
  { id: "par-07", start: 20.6, duration: 3.81 },
];

/** Début de chaque scène (frames). */
export const TP = {
  hook: 0,
  cost: 102, // 3,4 s — tout racheter
  heart: 217, // 7,25 s — ton enfant ne doit manquer de rien
  solution: 282, // 9,4 s — Swap'Îles
  compare: 411, // 13,7 s — neuf vs Swap'Îles
  sell: 540, // 18 s — vends à ton tour
  cta: 618, // 20,6 s — appel à l'action
  end: PARENTS_DURATION,
};

/** Repères (frames absolues) = mots clés de la voix off. */
export const CP = {
  reunion: 9, // « À La Réunion »
  expensive: 40, // « la vie est chère »
  kids: 62, // « nos marmailles »
  grow: 72, // « grandissent si vite »
  stroller: 108, // « une poussette »
  clothes: 131, // « des habits »
  shoes: 152, // « des chaussures »
  rebuy: 179, // « tout racheter »
  always: 198, // « tout le temps »
  child: 242, // « ton enfant »
  nothing: 265, // « manquer de rien »
  brand: 290, // « Swap'Îles »
  parents: 313, // « des parents d'ici »
  cheap: 337, // « à petit prix »
  kidStuff: 359, // « d'enfant »
  baby: 374, // « et de bébé »
  unused: 387, // « qui ne servent plus »
  cStroller: 413, // « Poussette »
  cBodies: 433, // « bodies »
  cToys: 451, // « jouets »
  cBike: 471, // « vélo »
  likeNew: 489, // « presque neufs »
  pei: 517, // « à prix péi »
  tooSmall: 563, // « trop petit »
  sellIt: 589, // « Vends-le »
  download: 620, // « Télécharge »
  ctaBrand: 638, // « Swap'Îles »
  together: 683, // « Entre parents »
  help: 711, // « on s'entraide »
};

export const PARENTS_COPY = {
  hookLine1: "À La Réunion,\nla vie est chère…",
  hookLine2: "…et nos marmailles\ngrandissent si vite !",
  costTitle: "Tout racheter,\ntout le temps !",
  ages: ["0-3 mois", "6 mois", "1 an", "2 ans", "4 ans", "6 ans"],
  receiptTitle: "TICKET · NEUF",
  heart: "Ton enfant ne doit\nmanquer de rien.",
  solution: "Des parents d'ici revendent\nà petit prix",
  compareTitle: "Neuf ou Swap'Îles ?",
  pei: "Prix péi !",
  disclaimer: "Exemples de prix",
  tooSmall: "Trop petit ?",
  sellIt: "Vends-le à ton tour !",
  together: "Entre parents, on s'entraide",
};

/** Ticket de caisse « neuf » (scène 2) — prix d'exemple. */
export const RECEIPT: { label: string; icon: IconName; price: number; at: number }[] = [
  { label: "Poussette", icon: "stroller", price: 349, at: CP.stroller },
  { label: "Lot de bodies", icon: "onesie", price: 45, at: CP.clothes },
  { label: "Chaussures", icon: "shoe", price: 59, at: CP.shoes },
  { label: "Jouets", icon: "teddy", price: 89, at: CP.rebuy },
];

/** Comparatif neuf / Swap'Îles (scène 5) — prix d'exemple. */
export const COMPARE: { label: string; icon: IconName; neuf: number; swap: number; at: number }[] = [
  { label: "Poussette", icon: "stroller", neuf: 349, swap: 90, at: CP.cStroller },
  { label: "Lot de bodies", icon: "onesie", neuf: 45, swap: 8, at: CP.cBodies },
  { label: "Jouets", icon: "teddy", neuf: 89, swap: 15, at: CP.cToys },
  { label: "Vélo enfant", icon: "bike", neuf: 119, swap: 25, at: CP.cBike },
];
