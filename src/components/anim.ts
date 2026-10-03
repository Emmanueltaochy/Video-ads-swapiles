import { Easing, interpolate, spring } from "remotion";
import { FPS } from "../config";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Ressort "pop" standard (0 -> 1) qui démarre à `delay` frames. */
export const pop = (frame: number, delay = 0, damping = 12, stiffness = 140) =>
  spring({ frame: frame - delay, fps: FPS, config: { damping, stiffness, mass: 0.8 } });

/** Ressort doux sans dépassement. */
export const smooth = (frame: number, delay = 0, durationInFrames = 20) =>
  spring({ frame: frame - delay, fps: FPS, config: { damping: 200 }, durationInFrames });

/** Fondu + glissement d'entrée (0 -> 1) entre deux frames. */
export const ease = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], { ...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1) });

/** Sortie (1 -> 0) entre deux frames. */
export const out = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [1, 0], { ...clamp, easing: Easing.bezier(0.55, 0, 0.75, 0) });

export const formatNumber = (n: number) => Math.round(n).toLocaleString("fr-FR").replace(/ | /g, " ");
