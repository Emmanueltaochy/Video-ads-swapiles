/**
 * Kit graphique de la campagne Meta Swap'Îles (angles A, B, C).
 * Charte : teal #0f766e, texte #134e4a, fond crème, police Instrument Sans.
 * Sobre et crédible : pas de tropical criard, emojis rares.
 */
import "@fontsource/instrument-sans/400.css";
import "@fontsource/instrument-sans/500.css";
import "@fontsource/instrument-sans/600.css";
import "@fontsource/instrument-sans/700.css";
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AppStoreBadge, GooglePlayBadge } from "../components/Badges";
import { Logo } from "../components/Logo";

export const M = {
  teal: "#0f766e",
  tealLight: "#ccfbf1",
  tealSoft: "#e6f4f1",
  ink: "#134e4a",
  logo: "#2f8f88", // couleur du logo officiel (public/images/logo.png)
  cream: "#fbf8f2",
  white: "#ffffff",
  muted: "#4b6461",
  font: "'Instrument Sans', ui-sans-serif, system-ui, sans-serif",
};

/** Zones sûres Instagram (1080×1920) : 250 px en haut, 670 px en bas, 140 px à droite. */
export const SAFE = { top: 250, bottom: 1920 - 670, left: 60, right: 1080 - 140 };
export const SAFE_W = SAFE.right - SAFE.left; // 880

/**
 * Mise en page verticale (toute la zone autorisée 250 → 1250 px) :
 * logo 284, titre 372, visuel jusqu'en bas (1245), sous-titre par-dessus le bas du visuel.
 */
export const LAY = { logoTop: 284, titleTop: 372, vis1: 470, vis2: 532, bottom: SAFE.bottom - 5 };

/**
 * Écrans d'interface agrandis (~ +35 %) : la capture (1170 px de large) est rendue à
 * l'échelle UI.s et recadrée de UI.cropX px de chaque côté (marges du site).
 */
export const UI = { s: 0.92, cropX: 107 };

/** Volume de la musique (discrète, ~ −24 LUFS). */
export const MUSIC_VOLUME = 0.22;

const NBSP = " ";
/** Mention obligatoire (angle B), avec espaces insécables. */
export const PROTECTION = `Protection acheteur${NBSP}: 10${NBSP}% du prix (0,50${NBSP}€ min, 15${NBSP}€ max)`;

/* ------------------------------------------------------------------ mode contrôle */

/**
 * Mode QA : le décor plein cadre est masqué et le fond passe au noir. Tout pixel
 * non noir restant est donc du « contenu » (texte, logo, cartes, badges) et doit
 * se trouver dans la zone sûre — vérifié automatiquement par scripts/qa_meta.py.
 */
export const QaContext = createContext(false);
export const useQa = () => useContext(QaContext);

export const Frame: React.FC<{ qa?: boolean; children: React.ReactNode }> = ({ qa = false, children }) => (
  <QaContext.Provider value={qa}>
    <AbsoluteFill style={{ background: qa ? "#000" : M.cream, fontFamily: M.font, color: M.ink }}>{children}</AbsoluteFill>
  </QaContext.Provider>
);

/** Décor de fond (formes teal discrètes) — masqué en mode QA. */
export const Decor: React.FC<{ variant?: "light" | "teal" }> = ({ variant = "light" }) => {
  const qa = useQa();
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  if (qa) return null;
  const drift = Math.sin(f / 60) * 12;
  if (variant === "teal") {
    return (
      <AbsoluteFill style={{ background: `linear-gradient(170deg, ${M.teal} 0%, #0b5f58 100%)` }}>
        <div style={{ position: "absolute", right: -260, top: -220 + drift, width: 760, height: 760, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", left: -300, bottom: -260 - drift, width: 820, height: 820, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: M.cream }}>
      <div style={{ position: "absolute", right: -240, top: -200 + drift, width: 700, height: 700, borderRadius: "50%", background: M.tealSoft }} />
      <div style={{ position: "absolute", left: -260, top: height - 520 - drift, width: 760, height: 760, borderRadius: "50%", background: "#f1ebe0" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, background: M.teal, width }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ animations */

export const enter = (f: number, at: number, dur = 14) =>
  interpolate(f, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) });
export const leave = (f: number, at: number, dur = 10) =>
  interpolate(f, [at, at + dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.55, 0, 0.75, 0) });
export const springIn = (f: number, at: number) => {
  const { fps } = { fps: 30 };
  return spring({ frame: f - at, fps, config: { damping: 16, stiffness: 140, mass: 0.8 } });
};

/** Apparition d'un plan (fondu + léger glissé) entre deux frames. */
export const Shot: React.FC<{ from: number; to: number; children: React.ReactNode; last?: boolean }> = ({ from, to, children, last }) => {
  const f = useCurrentFrame();
  if (f < from - 1 || f >= to + 10) return null;
  const a = enter(f, from, 12);
  const b = last ? 1 : leave(f, to, 10);
  const o = from === 0 ? b : Math.min(a, b);
  return <AbsoluteFill style={{ opacity: o, transform: `translateY(${(1 - (from === 0 ? 1 : a)) * 40}px)` }}>{children}</AbsoluteFill>;
};

/* ------------------------------------------------------------------ éléments */

/** Petit logo en haut à gauche, dans la zone autorisée, visible dès la 1re image. */
export const CornerLogo: React.FC<{ until?: number; onTeal?: boolean }> = ({ until = 100000, onTeal }) => {
  const f = useCurrentFrame();
  if (f >= until + 10) return null;
  return (
    <div style={{ position: "absolute", left: SAFE.left, top: LAY.logoTop, opacity: leave(f, until, 10) }}>
      <Logo width={196} color={onTeal ? M.white : M.logo} />
    </div>
  );
};

/** Grand titre (2 lignes max). */
export const Title: React.FC<{ lines: string[]; at: number; top?: number; size?: number; color?: string }> = ({
  lines,
  at,
  top = LAY.titleTop,
  size = 66,
  color = M.ink,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: SAFE.left, top, width: SAFE_W }}>
      {lines.map((l, i) => {
        const p = enter(f, at + i * 4, 14);
        return (
          <div
            key={i}
            style={{
              fontWeight: 700,
              fontSize: size,
              lineHeight: 1.08,
              letterSpacing: -1.2,
              color,
              whiteSpace: "nowrap",
              opacity: p,
              transform: `translateY(${(1 - p) * 26}px)`,
            }}
          >
            {l}
          </div>
        );
      })}
    </div>
  );
};

/**
 * Sous-titre incrusté : gros, contrasté (blanc sur teal foncé), 2 lignes max,
 * calé en bas de la zone centrale (bord bas à 1 245 px).
 */
export const Subtitle: React.FC<{ cues: { from: number; to: number; lines: string[] }[] }> = ({ cues }) => {
  const f = useCurrentFrame();
  const cue = cues.find((c) => f >= c.from && f < c.to);
  if (!cue) return null;
  if (cue.lines.length > 2) throw new Error("Sous-titre de plus de 2 lignes : " + cue.lines.join(" / "));
  const p = enter(f, cue.from, 6);
  return (
    <div style={{ position: "absolute", left: SAFE.left, width: SAFE_W, bottom: 1920 - (SAFE.bottom - 5), display: "flex", justifyContent: "center" }}>
      <div
        style={{
          background: "rgba(19,78,74,0.94)",
          borderRadius: 22,
          padding: "16px 26px 18px",
          opacity: p,
          transform: `translateY(${(1 - p) * 10}px)`,
        }}
      >
        {cue.lines.map((l, i) => (
          <div key={i} style={{ color: M.white, fontWeight: 600, fontSize: 47, lineHeight: 1.2, textAlign: "center", whiteSpace: "nowrap" }}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
};

/** Carte photo arrondie avec léger zoom lent (Ken Burns). */
export const PhotoCard: React.FC<{
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  at: number;
  objectPosition?: string;
  rotate?: number;
  zoom?: [number, number];
  dur?: number;
}> = ({ src, x, y, w, h, at, objectPosition = "50% 50%", rotate = 0, zoom = [1.08, 1], dur = 120 }) => {
  const f = useCurrentFrame();
  const p = springIn(f, at);
  const z = interpolate(f, [at, at + dur], zoom, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 36,
        overflow: "hidden",
        boxShadow: "0 24px 60px rgba(19,78,74,0.18)",
        transform: `scale(${0.92 + 0.08 * Math.min(1, p)}) rotate(${rotate}deg)`,
        opacity: Math.min(1, p * 1.5),
        background: M.white,
      }}
    >
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition, transform: `scale(${z})` }} />
    </div>
  );
};

/**
 * Fenêtre d'écran d'interface : affiche une capture réelle (largeur 1170 px = mobile x3)
 * à l'échelle voulue, avec défilement vertical (scrollY en px de la capture).
 */
export const ScreenWindow: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  children: React.ReactNode;
  at?: number;
}> = ({ x, y, w, h, children, at = 0 }) => {
  const f = useCurrentFrame();
  const p = springIn(f, at);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 34,
        overflow: "hidden",
        background: "#f9fafb",
        border: "2px solid #e5e7eb",
        boxShadow: "0 24px 60px rgba(19,78,74,0.16)",
        transform: `scale(${0.94 + 0.06 * Math.min(1, p)})`,
        opacity: Math.min(1, p * 1.5),
      }}
    >
      {children}
    </div>
  );
};

/** Capture positionnée dans une ScreenWindow (largeur de rendu = largeur de la fenêtre). */
export const Capture: React.FC<{ src: string; scrollY?: number; top?: number; opacity?: number }> = ({ src, scrollY = 0, top = 0, opacity = 1 }) => (
  <Img
    src={staticFile(src)}
    style={{ position: "absolute", left: -UI.cropX * UI.s, top: top * UI.s, width: 1170 * UI.s, transform: `translateY(${-scrollY * UI.s}px)`, opacity }}
  />
);

/** Conversion d'un rectangle de capture (px capture) en px vidéo, pour une fenêtre et un défilement donnés. */
export const uiRect = (win: { x: number; y: number }, r: { x: number; y: number; w: number; h: number }, scrollY: number) => {
  // bornes horizontales : le cadre de mise en évidence (+8 px) reste dans la zone autorisée
  const x0 = Math.max(win.x + (r.x - UI.cropX) * UI.s, SAFE.left + 10);
  const x1 = Math.min(win.x + (r.x + r.w - UI.cropX) * UI.s, SAFE.right - 10);
  return { x: x0, y: win.y + (r.y - scrollY) * UI.s, w: x1 - x0, h: r.h * UI.s };
};
/** Bas des fenêtres d'interface : juste au-dessus du sous-titre. */
export const UI_BOTTOM = 1084;

/** Onde de « tap » (doigt qui appuie) — repère visuel sur l'interface. */
export const Tap: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const f = useCurrentFrame() - at;
  if (f < 0 || f > 22) return null;
  const r = interpolate(f, [0, 22], [18, 70]);
  const o = interpolate(f, [0, 4, 22], [0, 0.9, 0]);
  return (
    <>
      <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", border: `5px solid ${M.teal}`, opacity: o }} />
      <div style={{ position: "absolute", left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: "50%", background: "rgba(15,118,110,0.35)", opacity: interpolate(f, [0, 3, 12], [0, 1, 0], { extrapolateRight: "clamp" }) }} />
    </>
  );
};

/** Cadre de mise en évidence (anneau teal) qui apparaît autour d'une zone. */
export const Highlight: React.FC<{ x: number; y: number; w: number; h: number; at: number; radius?: number }> = ({ x, y, w, h, at, radius = 20 }) => {
  const f = useCurrentFrame();
  const p = enter(f, at, 10);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 8,
        top: y - 8,
        width: w + 16,
        height: h + 16,
        borderRadius: radius,
        border: `5px solid ${M.teal}`,
        opacity: p,
        transform: `scale(${0.94 + 0.06 * p})`, // grossit vers sa taille finale : ne déborde jamais de la zone
      }}
    />
  );
};

/** Pastille d'information (fond teal clair). */
export const Pill: React.FC<{ text: string | string[]; x: number; y: number; at: number; size?: number; strong?: boolean; maxWidth?: number }> = ({
  text,
  x,
  y,
  at,
  size = 34,
  strong,
  maxWidth = SAFE_W,
}) => {
  const f = useCurrentFrame();
  const p = springIn(f, at);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        maxWidth,
        padding: "14px 24px",
        borderRadius: 22,
        background: strong ? M.teal : M.tealLight,
        color: strong ? M.white : M.ink,
        fontWeight: 600,
        fontSize: size,
        lineHeight: 1.25,
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${(1 - p) * 16}px)`,
      }}
    >
      {Array.isArray(text) ? text.map((l, i) => <div key={i} style={{ whiteSpace: "nowrap" }}>{l}</div>) : text}
    </div>
  );
};

/** Mention de protection sur 2 lignes (coupure propre). */
export const PROTECTION_LINES = [`Protection acheteur${NBSP}: 10${NBSP}% du prix`, `(0,50${NBSP}€ min, 15${NBSP}€ max)`];

/** Carte de fin commune : logo, titre (swapiles.com), badges stores — centrée au-dessus du sous-titre. */
export const EndCard: React.FC<{ at: number; title?: string[]; titleSize?: number; mention?: string }> = ({ at, title = ["swapiles.com"], titleSize = 80, mention }) => {
  const f = useCurrentFrame();
  const logo = springIn(f, at);
  const t = enter(f, at + 6, 14);
  const b = springIn(f, at + 14);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: SAFE.left, width: SAFE_W, top: LAY.logoTop, height: 1100 - LAY.logoTop, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `scale(${0.9 + 0.1 * logo})`, opacity: Math.min(1, logo * 1.5) }}>
          <Logo width={720} color={M.logo} />
        </div>
        <div style={{ marginTop: 40, textAlign: "center", opacity: t, transform: `translateY(${(1 - t) * 20}px)` }}>
          {title.map((l, i) => (
            <div key={i} style={{ fontWeight: 700, fontSize: titleSize, lineHeight: 1.1, letterSpacing: -1, color: M.ink, whiteSpace: "nowrap" }}>
              {l}
            </div>
          ))}
        </div>
        {mention && (
          <div style={{ marginTop: 18, fontWeight: 600, fontSize: 36, color: M.teal, opacity: t, whiteSpace: "nowrap" }}>{mention}</div>
        )}
        <div style={{ marginTop: 48, display: "flex", gap: 28, transform: `scale(${0.9 + 0.1 * b})`, opacity: Math.min(1, b * 1.5) }}>
          <AppStoreBadge height={104} />
          <GooglePlayBadge height={104} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
