import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT } from "../config";
import { Frond } from "../components/Background";

const W = 1080;
const H = 1920;

/** Ligne de crêtes (inspirée des pitons et remparts réunionnais). */
const ridge = (base: number, peaks: [number, number][]) => {
  let d = `M 0 ${H} L 0 ${base}`;
  for (const [x, y] of peaks) d += ` L ${x} ${y}`;
  return d + ` L ${W} ${base} L ${W} ${H} Z`;
};

const BACK = ridge(1380, [
  [90, 1330],
  [200, 1250],
  [290, 1290],
  [400, 1170], // Piton des Neiges
  [470, 1215],
  [560, 1260],
  [660, 1230],
  [760, 1290],
  [860, 1240],
  [980, 1310],
]);
const FRONT = ridge(1470, [
  [60, 1420],
  [170, 1380],
  [280, 1430],
  [420, 1360],
  [540, 1410],
  [650, 1350],
  [740, 1385],
  [830, 1330], // Piton de la Fournaise
  [880, 1345],
  [960, 1400],
]);

type Variant = "sunset" | "lagoon" | "sand" | "night";

const SKY: Record<Variant, string> = {
  // coucher de soleil sur l'océan Indien
  sunset: `linear-gradient(180deg, #1c4b5a 0%, #ff8a5b 48%, #ffc56b 70%, #ffd98f 100%)`,
  lagoon: `radial-gradient(110% 80% at 50% 0%, ${COLORS.lagoonLight} 0%, ${COLORS.lagoon} 35%, ${COLORS.primary} 75%, ${COLORS.deep} 100%)`,
  sand: `radial-gradient(120% 90% at 50% 10%, #ffffff 0%, ${COLORS.sand} 55%, #ffe1b8 100%)`,
  night: `radial-gradient(120% 90% at 50% 15%, #2a5a63 0%, #123a40 55%, #0a2226 100%)`,
};

/**
 * Décor « péi » : ciel, soleil, montagnes en silhouette, lagon qui scintille
 * et palmes. Le bas de l'écran (sous la légende Reels) est occupé par le décor.
 */
export const ReunionBackground: React.FC<{ variant?: Variant; sun?: boolean }> = ({ variant = "lagoon", sun = true }) => {
  const f = useCurrentFrame();
  const light = variant === "sand";
  const back = light ? "rgba(19,106,93,0.28)" : variant === "sunset" ? "#7a3f4f" : "rgba(6,42,37,0.75)";
  const front = light ? "rgba(19,106,93,0.45)" : variant === "sunset" ? "#4a2c3e" : "#062a25";
  const sea = light ? "#7fd8cb" : variant === "sunset" ? "#2c6f7a" : "#0b4d45";
  const frondC = light ? "rgba(19,106,93,0.18)" : "rgba(3,30,26,0.5)";
  const drift = interpolate(f, [0, 780], [0, -40]);
  return (
    <AbsoluteFill style={{ background: SKY[variant], overflow: "hidden" }}>
      {sun && (
        <div
          style={{
            position: "absolute",
            left: 640 + drift * 0.5,
            top: variant === "sunset" ? 980 : 120,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              variant === "sunset"
                ? "radial-gradient(circle, #fff3c4 0%, #ffd27a 35%, rgba(255,180,90,0) 70%)"
                : "radial-gradient(circle, rgba(255,236,170,0.55) 0%, rgba(255,236,170,0) 65%)",
          }}
        />
      )}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${drift * 0.4} 0)`}>
          <path d={BACK} fill={back} />
        </g>
        <g transform={`translate(${drift} 0)`}>
          <path d={FRONT} fill={front} />
        </g>
        {/* lagon */}
        <rect x={0} y={1540} width={W} height={H - 1540} fill={sea} />
        {new Array(6).fill(0).map((_, i) => {
          const y = 1570 + i * 55;
          let d = `M -20 ${y}`;
          for (let x = 0; x <= W + 40; x += 40) d += ` L ${x} ${y + Math.sin(x / 120 + f / (16 + i * 2) + i) * (5 + i * 2)}`;
          return <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={2 + i * 0.5} opacity={0.4 + i * 0.08} />;
        })}
        <Frond x={-90} y={-40} rotate={28} scale={0.7} color={frondC} phase={0.3} />
        <Frond x={W + 90} y={-60} rotate={30} scale={0.72} color={frondC} phase={2.1} flip />
        <Frond x={-70} y={H - 380} rotate={-30} scale={0.6} color={frondC} phase={1.1} />
        <Frond x={W + 70} y={H - 360} rotate={-28} scale={0.58} color={frondC} phase={2.6} flip />
      </svg>
    </AbsoluteFill>
  );
};

/** Drapeau « Lo Mahavéli » stylisé (drapeau populaire de La Réunion). */
export const ReunionFlag: React.FC<{ size?: number; square?: boolean }> = ({ size = 40, square }) => (
  <svg width={size * 1.5} height={size} viewBox="0 0 60 40" style={{ borderRadius: square ? 0 : size * 0.12, display: "block" }}>
    <rect width={60} height={40} fill="#1d5fb4" />
    {[-60, -30, 0, 30, 60].map((a) => (
      <path key={a} d="M30 26 L27.2 -10 L32.8 -10 Z" fill="#ffd400" transform={`rotate(${a} 30 26)`} />
    ))}
    <path d="M30 26 L12 40 L48 40 Z" fill="#e3242b" />
  </svg>
);

/**
 * Grand drapeau qui flotte au vent : le drapeau est découpé en bandes
 * verticales décalées par une onde (plus forte loin du mât) et ombrées.
 */
export const WavingFlag: React.FC<{ width?: number }> = ({ width = 360 }) => {
  const f = useCurrentFrame();
  const h = (width * 2) / 3;
  const strips = 60;
  const sw = width / strips;
  const amp = width * 0.035;
  return (
    <div style={{ position: "relative", width: width + 24, height: h + amp * 2 + 60 }}>
      {/* mât */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 12, height: h + amp * 2 + 60, borderRadius: 6, background: "linear-gradient(90deg, #d9dde0, #8b9196)" }} />
      <div style={{ position: "absolute", left: -4, top: -10, width: 20, height: 20, borderRadius: "50%", background: "#ffd400" }} />
      {new Array(strips).fill(0).map((_, i) => {
        const k = i / strips;
        const phase = i * 0.42 - f * 0.32;
        const dy = Math.sin(phase) * amp * (0.25 + k);
        const shade = Math.cos(phase) * 0.18 * (0.3 + k);
        return (
          <div key={i} style={{ position: "absolute", left: 12 + i * sw, top: amp + dy, width: sw + 0.6, height: h, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: -i * sw, top: 0 }}>
              <ReunionFlag size={h} square />
            </div>
            <div style={{ position: "absolute", inset: 0, background: shade > 0 ? `rgba(255,255,255,${shade})` : `rgba(0,0,0,${-shade})` }} />
          </div>
        );
      })}
    </div>
  );
};

/** Pastille « 974 » avec drapeau. */
export const Badge974: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12 * scale,
      padding: `${10 * scale}px ${22 * scale}px ${10 * scale}px ${12 * scale}px`,
      borderRadius: 40 * scale,
      background: "#fff",
      boxShadow: "0 10px 25px rgba(0,30,25,0.25)",
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: 30 * scale,
      color: COLORS.primary,
    }}
  >
    <ReunionFlag size={30 * scale} />
    La Réunion · 974
  </div>
);
