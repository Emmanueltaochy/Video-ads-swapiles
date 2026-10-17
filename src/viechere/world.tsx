/**
 * Décor 3D du Reel « La vie lé chèr » : île de La Réunion extrudée (contour IGN réel),
 * océan de nuit, repères géographiques à leurs coordonnées GPS réelles.
 */
import React from "react";
import { AbsoluteFill, random } from "remotion";
import { CITIES, REUNION_PATH, REUNION_VIEWBOX } from "../meta/reunionGeo";

export const ISLE = REUNION_VIEWBOX;

/** Projection GPS -> repère du contour (même formule que reunionGeo.ts). */
export const geo = (lon: number, lat: number) => ({ x: ((lon - 55.21653) / 0.62015) * 1000, y: (-20.87174 - lat) * 1729 });
export const FOURNAISE = geo(55.7139, -21.2444);
export const PITON_NEIGES = geo(55.4783, -21.0989);
export const CITY = Object.fromEntries(CITIES.map((c) => [c.name, c])) as Record<string, { x: number; y: number }>;
/** Route des Tamarins (Saint-Paul -> Étang-Salé) puis RN1 jusqu'à Saint-Pierre. */
export const ROUTE = [
  [55.2703, -21.0097],
  [55.262, -21.06],
  [55.284, -21.128],
  [55.31, -21.19],
  [55.345, -21.243],
  [55.4, -21.283],
  [55.478, -21.3393],
].map(([lon, lat]) => geo(lon, lat));

/** Contour en points, pour tirer des positions à l'intérieur de l'île. */
const POLY = (REUNION_PATH.match(/-?\d+\.?\d*,-?\d+\.?\d*/g) ?? []).map((s) => s.split(",").map(Number) as [number, number]);
export const insideIsland = (x: number, y: number) => {
  let c = false;
  for (let i = 0, j = POLY.length - 1; i < POLY.length; j = i++) {
    const [xi, yi] = POLY[i];
    const [xj, yj] = POLY[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
/** n points pseudo-aléatoires (déterministes) à l'intérieur de l'île, à distance de la côte. */
export const islandPoints = (n: number, seed: string) => {
  const out: { x: number; y: number }[] = [];
  let k = 0;
  while (out.length < n && k < n * 50) {
    const x = random(`${seed}-x-${k}`) * ISLE.w;
    const y = random(`${seed}-y-${k}`) * ISLE.h;
    k++;
    if (insideIsland(x, y) && insideIsland(x + 25, y) && insideIsland(x - 25, y) && insideIsland(x, y + 25) && insideIsland(x, y - 25)) out.push({ x, y });
  }
  return out;
};

const lerpColor = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(",")})`;
};

/**
 * Île extrudée en 3D CSS (couches empilées en profondeur) vue en perspective.
 * Les enfants sont posés sur la surface, en px de l'île (x_contour × w / 1000).
 */
export const Island3D: React.FC<{
  id: string;
  cx: number;
  cy: number;
  w: number;
  tilt: number;
  rotZ?: number;
  depth?: number;
  layers?: number;
  persp?: number;
  style?: React.CSSProperties;
  inner?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ id, cx, cy, w, tilt, rotZ = 0, depth = 60, layers = 14, persp = 1600, style, inner, children }) => {
  const k = w / ISLE.w;
  const h = ISLE.h * k;
  const vb = `0 0 ${ISLE.w} ${ISLE.h}`;
  return (
    <AbsoluteFill style={{ perspective: persp, perspectiveOrigin: `${cx}px ${cy - 420}px`, ...style }}>
      <div
        style={{
          position: "absolute",
          left: cx - w / 2,
          top: cy - h / 2,
          width: w,
          height: h,
          transformStyle: "preserve-3d",
          transform: `rotateX(${tilt}deg) rotateZ(${rotZ}deg)`,
          ...inner,
        }}
      >
        {Array.from({ length: layers }, (_, i) => (
          <svg key={i} viewBox={vb} width={w} height={h} style={{ position: "absolute", left: 0, top: 0, transform: `translateZ(${-((i + 1) * depth) / layers}px)` }}>
            <path d={REUNION_PATH} fill={lerpColor("#0f5a46", "#04201b", i / layers)} />
          </svg>
        ))}
        <svg viewBox={vb} width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#3dbb7c" />
              <stop offset="0.55" stopColor="#1f8a5c" />
              <stop offset="1" stopColor="#11634a" />
            </linearGradient>
            <radialGradient id={`${id}-hi`}>
              <stop offset="0" stopColor="#8a8a4e" stopOpacity="0.95" />
              <stop offset="0.5" stopColor="#5f7a43" stopOpacity="0.55" />
              <stop offset="1" stopColor="#3a6b40" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`${id}-vol`}>
              <stop offset="0" stopColor="#4a2a1e" stopOpacity="1" />
              <stop offset="0.45" stopColor="#7a4a2a" stopOpacity="0.8" />
              <stop offset="1" stopColor="#7a4a2a" stopOpacity="0" />
            </radialGradient>
            <clipPath id={`${id}-c`}>
              <path d={REUNION_PATH} />
            </clipPath>
            <filter id={`${id}-b`}>
              <feGaussianBlur stdDeviation="14" />
            </filter>
          </defs>
          <path d={REUNION_PATH} fill={`url(#${id}-g)`} />
          <g clipPath={`url(#${id}-c)`}>
            <circle cx={PITON_NEIGES.x} cy={PITON_NEIGES.y} r={270} fill={`url(#${id}-hi)`} />
            <circle cx={FOURNAISE.x} cy={FOURNAISE.y} r={175} fill={`url(#${id}-vol)`} />
            <g filter={`url(#${id}-b)`} fill="#0a4a33" opacity={0.75}>
              <ellipse cx={330} cy={326} rx={72} ry={60} />
              <ellipse cx={492} cy={276} rx={78} ry={62} />
              <ellipse cx={412} cy={447} rx={70} ry={58} />
            </g>
            <path d={REUNION_PATH} fill="none" stroke="#f1dfae" strokeWidth={18} opacity={0.45} />
          </g>
          <path d={REUNION_PATH} fill="none" stroke="#8ef0dc" strokeWidth={4} opacity={0.9} />
        </svg>
        <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transformStyle: "preserve-3d", transform: "translateZ(1px)" }}>{children}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Élément « debout » sur la surface de l'île (annule l'inclinaison), ancré par sa base. */
export const Stand: React.FC<{ x: number; y: number; tilt: number; w?: number; children: React.ReactNode }> = ({ x, y, tilt, w = 300, children }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: 0, transformStyle: "preserve-3d" }}>
    <div style={{ position: "absolute", left: 0, bottom: 0, width: w, display: "flex", justifyContent: "center", alignItems: "flex-end", transformOrigin: "50% 100%", transform: `rotateX(${-tilt}deg)` }}>{children}</div>
  </div>
);

/** Océan de nuit vu de haut : dégradé profond + houle animée. */
export const Ocean: React.FC<{ f: number; glow?: number; tint?: string }> = ({ f, glow = 0, tint = "#04202b" }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 62%, ${tint} 0%, #020b12 72%)` }}>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 34 }, (_, j) => {
        const y = 120 + j * 54 + Math.sin(j) * 8;
        const amp = 6 + j * 0.5;
        const ph = f * 0.06 * (1 + (j % 5) * 0.12) + j;
        let d = `M -20 ${y}`;
        for (let x = -20; x <= 1100; x += 40) d += ` L ${x} ${y + Math.sin(x / 90 + ph) * amp}`;
        return <path key={j} d={d} stroke="#5eead4" strokeOpacity={0.05 + (j / 34) * 0.07} strokeWidth={2} fill="none" />;
      })}
    </svg>
    {glow > 0 && <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 55%, rgba(255,140,40,${0.25 * glow}) 0%, rgba(0,0,0,0) 55%)` }} />}
  </AbsoluteFill>
);
