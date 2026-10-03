import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useLayout } from "../layout";
import { COLORS } from "../config";

/** Génère le tracé d'une palme de cocotier (tige + folioles). */
const frondPath = (length: number, bend: number, count: number, leafLen: number) => {
  const stem = (t: number) => {
    // Bézier quadratique (0,0) -> (length, 0), contrôle (length/2, -bend)
    const x = length * t;
    const y = -2 * bend * t * (1 - t);
    const dx = length;
    const dy = -2 * bend * (1 - 2 * t);
    const n = Math.hypot(dx, dy);
    return { x, y, tx: dx / n, ty: dy / n };
  };
  let d = "";
  // tige
  d += `M0,0 Q${length / 2},${-bend} ${length},0 L${length},4 Q${length / 2},${-bend + 8} 0,10 Z `;
  for (let i = 0; i < count; i++) {
    const t = 0.08 + (0.9 * i) / (count - 1);
    const p = stem(t);
    const L = leafLen * (0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, t * 1.1)));
    const w = L * 0.11;
    for (const side of [-1, 1]) {
      const a = Math.atan2(p.ty, p.tx) + side * (1.0 - 0.45 * t);
      // la gravité fait retomber les folioles
      const ex = p.x + Math.cos(a) * L;
      const ey = p.y + Math.sin(a) * L + L * 0.35;
      const mx = (p.x + ex) / 2;
      const my = (p.y + ey) / 2 - L * 0.12;
      const nx = -(ey - p.y) / L;
      const ny = (ex - p.x) / L;
      d += `M${p.x},${p.y} Q${mx + nx * w},${my + ny * w} ${ex},${ey} Q${mx - nx * w},${my - ny * w} ${p.x},${p.y} Z `;
    }
  }
  return d;
};

const Frond: React.FC<{
  x: number;
  y: number;
  rotate: number;
  scale: number;
  color: string;
  phase: number;
  flip?: boolean;
}> = ({ x, y, rotate, scale, color, phase, flip }) => {
  const frame = useCurrentFrame();
  const d = useMemo(() => frondPath(620, 120, 22, 230), []);
  const sway = Math.sin(frame / 38 + phase) * 3 + Math.sin(frame / 17 + phase * 2) * 0.8;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale}) rotate(${rotate + sway})`}>
      <path d={d} fill={color} />
    </g>
  );
};

/**
 * Fond tropical : dégradé lagon, reflets de lumière qui ondulent,
 * palmes en silhouette sur les côtés.
 */
export const TropicalBackground: React.FC<{
  variant?: "deep" | "lagoon" | "light";
  fronds?: boolean;
}> = ({ variant = "deep", fronds = true }) => {
  const frame = useCurrentFrame();
  const bg =
    variant === "deep"
      ? `radial-gradient(120% 90% at 70% 15%, ${COLORS.lagoon} 0%, ${COLORS.primary} 38%, ${COLORS.deep} 75%, ${COLORS.deeper} 100%)`
      : variant === "lagoon"
        ? `radial-gradient(110% 100% at 50% 0%, ${COLORS.lagoonLight} 0%, ${COLORS.lagoon} 30%, ${COLORS.primary} 70%, ${COLORS.deep} 100%)`
        : `radial-gradient(120% 100% at 50% 0%, #ffffff 0%, ${COLORS.sand} 60%, #f4e3c4 100%)`;
  const frondColor = variant === "light" ? "rgba(19,106,93,0.16)" : "rgba(3,30,26,0.55)";
  const frondColor2 = variant === "light" ? "rgba(19,106,93,0.10)" : "rgba(3,30,26,0.35)";
  const { W, H, vertical } = useLayout();
  const sunX = interpolate(frame, [0, 900], [W * 0.755, W * 0.807]);
  const waveTop = H * 0.59;
  const waveGap = vertical ? 110 : 70;

  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      {/* halo de soleil */}
      <div
        style={{
          position: "absolute",
          left: sunX - 500,
          top: -520,
          width: 1000,
          height: 1000,
          borderRadius: "50%",
          background:
            variant === "light"
              ? "radial-gradient(circle, rgba(255,201,74,0.35) 0%, rgba(255,201,74,0) 60%)"
              : "radial-gradient(circle, rgba(255,226,150,0.35) 0%, rgba(255,226,150,0) 60%)",
        }}
      />
      {/* reflets d'eau qui ondulent */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: variant === "light" ? 0.35 : 0.18 }}>
        {new Array(7).fill(0).map((_, i) => {
          const y = waveTop + i * waveGap;
          const amp = 14 + i * 3;
          const ph = frame / (24 + i * 3) + i;
          let d = `M -20 ${y}`;
          for (let x = 0; x <= W + 40; x += 40) {
            d += ` L ${x} ${y + Math.sin(x / (140 + i * 25) + ph) * amp}`;
          }
          return (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={variant === "light" ? COLORS.lagoon : "#bff5ec"}
              strokeWidth={2 + i * 0.6}
              strokeLinecap="round"
              opacity={0.25 + i * 0.08}
            />
          );
        })}
      </svg>
      {fronds && (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
          <Frond x={-90} y={-40} rotate={28} scale={vertical ? 0.7 : 0.95} color={frondColor2} phase={0.3} />
          <Frond x={-60} y={60} rotate={8} scale={vertical ? 0.6 : 0.8} color={frondColor} phase={1.4} />
          <Frond x={W + 90} y={-60} rotate={30} scale={vertical ? 0.72 : 1} color={frondColor2} phase={2.1} flip />
          <Frond x={W + 70} y={40} rotate={12} scale={vertical ? 0.55 : 0.75} color={frondColor} phase={0.9} flip />
          {vertical && (
            <>
              {/* palmes qui remontent du bas pour habiller le format vertical */}
              <Frond x={-80} y={H + 40} rotate={-40} scale={0.75} color={frondColor2} phase={1.1} />
              <Frond x={W + 80} y={H + 60} rotate={-38} scale={0.7} color={frondColor2} phase={2.6} flip />
            </>
          )}
        </svg>
      )}
    </AbsoluteFill>
  );
};
