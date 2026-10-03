import { useVideoConfig } from "remotion";

/**
 * Format courant : les scènes adaptent leur mise en page selon que la
 * composition est horizontale (YouTube 1920×1080) ou verticale (Reels 1080×1920).
 */
export const useLayout = () => {
  const { width, height } = useVideoConfig();
  return { W: width, H: height, vertical: height > width };
};

/**
 * Zones sûres Instagram Reels (1080×1920) : l'interface recouvre le haut
 * (compte, « Reels »), le bas (légende, bouton d'action, musique) et la
 * colonne d'icônes à droite. Textes et éléments clés restent dans ce cadre.
 */
export const REEL_SAFE = { top: 250, bottom: 1300, left: 60, right: 940 };
