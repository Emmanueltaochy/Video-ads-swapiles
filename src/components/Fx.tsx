import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame } from "remotion";
import { BPM, COLORS, FONT, FPS } from "../config";
import { clamp } from "./anim";
import { Icon, IconName } from "./Icons";

/* ------------------------------------------------------------------ tempo */

/**
 * Pulsation sur le temps de la musique : 1 au repos, monte brièvement à
 * 1 + amount sur chaque temps (kick). `grooveStart` = frame de départ du groove.
 */
export const beatPulse = (frame: number, grooveStart: number, amount = 0.012) => {
  if (frame < grooveStart) return 1;
  const beat = (60 / BPM) * FPS;
  const phase = ((frame - grooveStart) % beat) / beat;
  return 1 + amount * Math.exp(-phase * 7);
};

/* ------------------------------------------------------------------ caméra */

/**
 * Mouvement de caméra : léger zoom continu + "punch" (zoom bref) sur des repères.
 */
export const Camera: React.FC<{
  children: React.ReactNode;
  duration: number;
  zoom?: [number, number];
  punches?: number[];
  shakeAt?: number[];
  pulse?: number; // frame de départ du groove (en frames locales) pour la pulsation
}> = ({ children, duration, zoom = [1, 1.05], punches = [], shakeAt = [], pulse }) => {
  const f = useCurrentFrame();
  let s = interpolate(f, [0, duration], zoom, clamp);
  for (const p of punches) {
    s += 0.035 * Math.max(0, 1 - Math.abs(f - p - 2) / 6) * (f >= p ? 1 : 0);
  }
  if (pulse !== undefined) s *= beatPulse(f, pulse, 0.006);
  let x = 0;
  let y = 0;
  for (const t of shakeAt) {
    const k = f - t;
    if (k >= 0 && k < 14) {
      const amp = 14 * (1 - k / 14);
      x += Math.sin(k * 2.7) * amp;
      y += Math.cos(k * 3.3) * amp * 0.7;
    }
  }
  return <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(${s})` }}>{children}</AbsoluteFill>;
};

/* ------------------------------------------------------------------ texte cinétique */

/**
 * Texte qui apparaît mot par mot (chaque mot "saute" en place).
 * `at` : frame d'apparition de chaque mot (même longueur que les mots),
 * ou un nombre (début) + `stagger`.
 */
export const KineticText: React.FC<{
  text: string;
  at: number | number[];
  stagger?: number;
  style?: React.CSSProperties;
  highlight?: string[]; // mots à colorer
  highlightColor?: string;
}> = ({ text, at, stagger = 3, style, highlight = [], highlightColor = COLORS.sun }) => {
  const f = useCurrentFrame();
  const lines = text.split("\n");
  let idx = 0;
  return (
    <div style={{ fontFamily: FONT, ...style }}>
      {lines.map((line, li) => (
        <div key={li} style={{ display: "block", whiteSpace: "nowrap" }}>
          {line.split(" ").map((w, wi) => {
            const i = idx++;
            const t = Array.isArray(at) ? at[Math.min(i, at.length - 1)] : at + i * stagger;
            const s = spring({ frame: f - t, fps: FPS, config: { damping: 11, stiffness: 180, mass: 0.6 } });
            const hl = highlight.some((h) => w.toLowerCase().includes(h.toLowerCase()));
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  marginRight: "0.25em",
                  opacity: Math.min(1, s * 2),
                  transform: `translateY(${(1 - s) * 45}px) scale(${0.6 + 0.4 * s}) rotate(${(1 - s) * -6}deg)`,
                  color: hl ? highlightColor : undefined,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ confettis */

const CONFETTI_COLORS = [COLORS.sun, COLORS.coral, COLORS.lagoonLight, "#ffffff", COLORS.lagoon];

/** Explosion de confettis (déterministe) à la frame `at`, depuis (x, y). */
export const Confetti: React.FC<{ at: number; x: number; y: number; count?: number; spread?: number; seed?: string }> = ({
  at,
  x,
  y,
  count = 60,
  spread = 1,
  seed = "c",
}) => {
  const f = useCurrentFrame() - at;
  if (f < 0 || f > 75) return null;
  const t = f / FPS;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(count).fill(0).map((_, i) => {
        const a = random(`${seed}a${i}`) * Math.PI * 2;
        const v = (500 + random(`${seed}v${i}`) * 900) * spread;
        const px = x + Math.cos(a) * v * t;
        const py = y + Math.sin(a) * v * t * 0.8 - 300 * t + 1100 * t * t;
        const rot = random(`${seed}r${i}`) * 720 * t + random(`${seed}r0${i}`) * 360;
        const size = 10 + random(`${seed}s${i}`) * 14;
        const op = interpolate(f, [0, 3, 55, 75], [0, 1, 1, 0], clamp);
        const round = random(`${seed}k${i}`) > 0.6;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: size,
              height: round ? size : size * 0.45,
              borderRadius: round ? "50%" : 2,
              background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              transform: `rotate(${rot}deg) rotateX(${rot * 1.3}deg)`,
              opacity: op,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ stickers */

/** Petite bulle flottante (like, message, prix…) qui apparaît puis disparaît. */
export const Sticker: React.FC<{
  x: number;
  y: number;
  at: number;
  until?: number;
  icon: IconName;
  label: string;
  color?: string;
  tilt?: number;
}> = ({ x, y, at, until = 100000, icon, label, color = COLORS.coral, tilt = 0 }) => {
  const f = useCurrentFrame();
  const inS = spring({ frame: f - at, fps: FPS, config: { damping: 10, stiffness: 170, mass: 0.6 } });
  const outS = spring({ frame: f - until, fps: FPS, config: { damping: 200 }, durationInFrames: 8 });
  const s = inS * (1 - outS);
  if (s <= 0.01) return null;
  const bob = Math.sin((f + x) / 14) * 6;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + bob,
        transform: `translate(-50%, -50%) scale(${s}) rotate(${tilt}deg)`,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 20px 10px 10px",
        borderRadius: 40,
        background: "#fff",
        boxShadow: "0 14px 30px rgba(0,25,20,0.3)",
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 26,
        color: COLORS.ink,
        whiteSpace: "nowrap",
        zIndex: 20,
      }}
    >
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={24} color="#fff" strokeWidth={2.6} />
      </div>
      {label}
    </div>
  );
};

/* ------------------------------------------------------------------ main qui tape */

/** Main (pointeur) qui vient taper sur un bouton, avec onde. */
export const TapHand: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const f = useCurrentFrame() - at;
  if (f < -12 || f > 40) return null;
  const enter = interpolate(f, [-12, 0], [1, 0], clamp);
  const press = f >= 0 && f < 6 ? 0.85 : 1;
  const leave = interpolate(f, [26, 40], [0, 1], clamp);
  const ripple = interpolate(f, [0, 18], [0, 1], clamp);
  return (
    <>
      {f >= 0 && (
        <div
          style={{
            position: "absolute",
            left: x - 80 * ripple,
            top: y - 80 * ripple,
            width: 160 * ripple,
            height: 160 * ripple,
            borderRadius: "50%",
            border: `6px solid rgba(255,255,255,${1 - ripple})`,
          }}
        />
      )}
      <svg
        width={110}
        height={110}
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          left: x - 30 + enter * 140,
          top: y - 12 + enter * 160 + leave * 120,
          transform: `scale(${press}) rotate(-10deg)`,
          opacity: 1 - leave,
          filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.35))",
        }}
      >
        <path
          d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4.5c0 3.6-2.4 6.5-6 6.5-2.4 0-3.8-1-5.2-2.8L4.3 14.4a1.5 1.5 0 0 1 2.3-1.9L9 15"
          fill="#fff"
          stroke={COLORS.deep}
          strokeWidth={1.3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};
