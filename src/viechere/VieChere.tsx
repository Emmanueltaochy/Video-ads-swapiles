/**
 * Reel « La vie lé chèr » (27 s, 1080×1920) — motion design.
 * 7 scènes : accroche volcan + pluie d'étiquettes, armoire qui explose, révélation du logo,
 * vente gratuite (0 % commission), main propre gratuite, paiement protégé, appel à l'action.
 * Textes à l'écran dans la zone utile Reels (250 → 1250 px de haut, 60 → 940 px de large).
 */
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Easing, Html5Audio, interpolate, random, spring, staticFile, useCurrentFrame } from "remotion";
import { Logo } from "../components/Logo";
import { Subtitle } from "../meta/kit";
import { Armoire, CaseCreole, Cloth, CLOTH_COLORS, CLOTH_TYPES, DressPhoto, Hands, PAL, Parcel, Phone, PriceTag, Ridges, ShieldHalf } from "./props";
import { VC_CUES } from "./voiceCues";
import { CITY, FOURNAISE, Island3D, islandPoints, ISLE, Ocean, ROUTE, Stand } from "./world";

export const VC_FPS = 30;
export const VC_DURATION = 27 * VC_FPS;
/** Débuts de scène (images) — doivent suivre LINES dans scripts/generate_viechere_audio.py. */
const SC = [0, 90, 210, 300, 420, 540, 660, 810];
/** Impacts des étiquettes (mêmes temps que les bruitages : 1,15 s + i × 0,1 s). */
const TAGS = Array.from({ length: 14 }, (_, i) => Math.round((1.15 + i * 0.1) * VC_FPS));

const FONT = "'Instrument Sans', 'Noto Color Emoji', ui-sans-serif, sans-serif";
const QA = createContext(false);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (f: number, a: number, b: number, e = Easing.bezier(0.65, 0, 0.35, 1)) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: e });
const pop = (f: number, at: number, stiff = 160) => spring({ frame: f - at, fps: VC_FPS, config: { damping: 13, stiffness: stiff, mass: 0.7 } });

/** Visuel (masqué en mode contrôle : seul le texte reste, sur fond noir). */
const Vis: React.FC<{ children: React.ReactNode }> = ({ children }) => (useContext(QA) ? null : <>{children}</>);

/** Une scène : visible de from à to (+ 5 images de fondu enchaîné par-dessus la précédente). */
const Scene: React.FC<{ from: number; to: number; children: (t: number) => React.ReactNode }> = ({ from, to, children }) => {
  const f = useCurrentFrame();
  if (f < from || f >= to + 5) return null;
  const o = from === 0 ? 1 : interpolate(f, [from, from + 5], [0, 1], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children(f - from)}</AbsoluteFill>;
};

/** Tremblement : léger en continu + secousses aux impacts. */
const shake = (f: number, base: number, hits: number[] = [], amp = 12) => {
  let a = base;
  for (const h of hits) if (f >= h) a += amp * Math.exp(-(f - h) / 4);
  return { x: (random(`sx-${f}`) - 0.5) * 2 * a, y: (random(`sy-${f}`) - 0.5) * 2 * a };
};

/** Grand titre (lignes centrées, apparition « pop »), dans la zone utile. */
const Big: React.FC<{
  lines: { text: React.ReactNode; color?: string; at?: number }[];
  t: number;
  at: number;
  size: number;
  top?: number;
  jitter?: { x: number; y: number };
  backing?: boolean;
}> = ({ lines, t, at, size, top = 285, jitter = { x: 0, y: 0 }, backing }) => (
  <div style={{ position: "absolute", left: 60, width: 880, top, textAlign: "center", transform: `translate(${jitter.x}px, ${jitter.y}px)` }}>
    {backing && <Vis><div style={{ position: "absolute", left: -10, right: -10, top: -20, bottom: -24, borderRadius: 40, background: "rgba(20,12,6,0.72)", opacity: Math.min(1, pop(t, at) * 1.5) }} /></Vis>}
    {lines.map((l, i) => {
      const p = pop(t, l.at ?? at + i * 4);
      return (
        <div
          key={i}
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: size,
            lineHeight: 1.02,
            letterSpacing: -2,
            color: l.color ?? "#ffffff",
            whiteSpace: "nowrap",
            textShadow: `0 6px 0 rgba(4,32,27,0.85), 0 0 40px rgba(0,0,0,0.55)`,
            opacity: Math.min(1, p * 1.6),
            transform: `scale(${0.55 + 0.45 * Math.min(p, 1.02)})`,
          }}
        >
          {l.text}
        </div>
      );
    })}
  </div>
);
const Emoji: React.FC<{ c: string }> = ({ c }) => <span style={{ textShadow: "none", fontFamily: "'Noto Color Emoji'" }}>{c}</span>;

/** Caméra 2D : rapproche un point (fx, fy) vers (tx, ty) avec un zoom z. */
const Cam: React.FC<{ fx: number; fy: number; tx: number; ty: number; z: number; p: number; extra?: string; children: React.ReactNode }> = ({ fx, fy, tx, ty, z, p, extra = "", children }) => (
  <AbsoluteFill style={{ transformOrigin: `${fx}px ${fy}px`, transform: `translate(${(tx - fx) * p}px, ${(ty - fy) * p}px) scale(${1 + (z - 1) * p}) ${extra}` }}>{children}</AbsoluteFill>
);

/* ================================================================== scène 1 : l'accroche */
const S1: React.FC<{ t: number }> = ({ t }) => {
  const rise = ease(t, 4, 40, Easing.bezier(0.2, 0.9, 0.3, 1));
  const cam = ease(t, 42, 72);
  const W = 960;
  const k = W / ISLE.w;
  const glow = 0.6 + 0.4 * Math.sin(t / 3);
  const lava = interpolate(t, [24, 40], [0, 1], clamp);
  const j = shake(t, 3, TAGS, 9);
  return (
    <>
      <Vis>
        <Cam fx={859} fy={1231} tx={560} ty={1010} z={2.2} p={cam} extra={`translate(${j.x * 0.6}px, ${j.y * 0.6}px)`}>
          <Ocean f={t} glow={lava} />
          {/* gerbes d'eau quand l'île surgit */}
          {[0, 7].map((d) => {
            const q = interpolate(t, [10 + d, 46 + d], [0, 1], clamp);
            return q > 0 && q < 1 ? (
              <div key={d} style={{ position: "absolute", left: 540 - (300 + 700 * q), top: 1040 - (300 + 700 * q) * 0.42, width: (300 + 700 * q) * 2, height: (300 + 700 * q) * 0.84, borderRadius: "50%", border: `${6 - 4 * q}px solid rgba(190,255,245,${0.7 * (1 - q)})` }} />
            ) : null;
          })}
          <Island3D
            id="s1"
            cx={540}
            cy={1040}
            w={W}
            tilt={48}
            style={{ transform: `translateY(${(1 - rise) * 760}px) scale(${0.78 + 0.22 * rise})`, filter: `brightness(${0.35 + 0.55 * rise}) saturate(${0.7 + 0.3 * rise})`, opacity: Math.min(1, rise * 3) }}
          >
            {/* lueur du Piton de la Fournaise */}
            <div style={{ position: "absolute", left: FOURNAISE.x * k - 110, top: FOURNAISE.y * k - 110, width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,210,122,${lava}) 0%, rgba(255,122,26,${0.8 * lava * glow}) 35%, rgba(255,80,0,0) 70%)` }} />
            <div style={{ position: "absolute", left: FOURNAISE.x * k - 22, top: FOURNAISE.y * k - 14, width: 44, height: 28, borderRadius: "50%", background: "#2a0f05", boxShadow: `0 0 ${30 * lava}px ${10 * lava}px rgba(255,140,40,${lava})` }} />
            <Stand x={FOURNAISE.x * k} y={FOURNAISE.y * k + 10} tilt={48}>
              <div style={{ position: "relative", width: 240, height: 330 }}>
                {/* panache de lave et de lueur */}
                <div style={{ position: "absolute", left: -40, right: -40, bottom: 70, height: 280, background: `radial-gradient(ellipse at 50% 100%, rgba(255,190,90,${0.95 * lava}) 0%, rgba(255,110,20,${0.6 * lava * glow}) 30%, rgba(255,60,0,0) 68%)`, filter: "blur(8px)" }} />
                {/* cône volcanique */}
                <svg width={240} height={110} viewBox="0 0 240 110" style={{ position: "absolute", left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cone" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#3b2417" />
                      <stop offset="0.5" stopColor="#6b3f24" />
                      <stop offset="1" stopColor="#2a1810" />
                    </linearGradient>
                  </defs>
                  <path d="M0 110 Q60 80 92 20 L148 20 Q180 80 240 110 Z" fill="url(#cone)" />
                  <ellipse cx={120} cy={21} rx={30} ry={8} fill={`rgba(255,${150 + 60 * glow},60,${0.4 + 0.6 * lava})`} />
                  {[0, 1, 2].map((i) => (
                    <path key={i} d={`M${108 + i * 10} 26 Q${100 + i * 14} 60 ${90 + i * 22} ${92 + i * 6}`} stroke="#ff7a1a" strokeWidth={4} fill="none" opacity={lava * (0.6 + 0.4 * Math.sin(t / 3 + i))} />
                  ))}
                </svg>
                {Array.from({ length: 26 }, (_, i) => {
                  const life = ((t * (1.4 + random(`sp-${i}`) * 1.2) + i * 7) % 40) / 40;
                  return (
                    <div key={i} style={{ position: "absolute", left: 120 + (random(`spx-${i}`) - 0.5) * 120 * (0.2 + life), bottom: 95 + life * 220, width: 11 - 7 * life, height: 11 - 7 * life, borderRadius: "50%", background: i % 3 ? PAL.lava : PAL.lavaHot, opacity: lava * (1 - life), boxShadow: `0 0 12px ${PAL.lava}` }} />
                  );
                })}
              </div>
            </Stand>
          </Island3D>
          {/* gouttes */}
          {Array.from({ length: 26 }, (_, i) => {
            const dt = t - 12 - (i % 5);
            if (dt < 0 || dt > 26) return null;
            const vx = (random(`dx-${i}`) - 0.5) * 30;
            const vy = -14 - random(`dy-${i}`) * 16;
            return <div key={i} style={{ position: "absolute", left: 540 + (random(`d0-${i}`) - 0.5) * 700 + vx * dt, top: 1060 + vy * dt + 0.9 * dt * dt, width: 12, height: 12, borderRadius: "50%", background: "rgba(220,255,250,0.85)", opacity: 1 - dt / 26 }} />;
          })}
        </Cam>
        {/* pluie d'étiquettes de prix (s'écrasent sur l'île) */}
        {TAGS.map((land, i) => {
          const fall = 16;
          const s0 = land - fall;
          if (t < s0) return null;
          const ang = (i / TAGS.length) * Math.PI * 2 + random(`ta-${i}`) * 0.5;
          const rad = 250 + random(`tr0-${i}`) * 170;
          const x = Math.min(900, Math.max(150, 560 + Math.cos(ang) * rad * 1.1));
          const yT = Math.min(1500, Math.max(760, 1030 + Math.sin(ang) * rad * 0.8));
          const w = 130 + random(`tw-${i}`) * 70;
          const q = Math.min(1, (t - s0) / fall);
          const after = Math.max(0, t - land);
          const bounce = after > 0 ? -34 * Math.exp(-after / 4) * Math.abs(Math.sin(after / 2.2)) : 0;
          const squash = after > 0 && after < 4 ? 1 - 0.25 * Math.sin((after / 4) * Math.PI) : 1;
          const y = -260 + (yT + 260) * q * q + bounce;
          const rot = (random(`tr-${i}`) - 0.5) * 70 * (1 - Math.min(1, after / 6)) + (random(`tr2-${i}`) - 0.5) * 30;
          const look = [
            { bg: "#fde047", fg: "#1f2937" },
            { bg: "#ef4444", fg: "#ffffff" },
            { bg: "#ffffff", fg: "#b91c1c" },
            { bg: "#fb923c", fg: "#1f2937" },
          ][i % 4];
          return (
            <div key={i} style={{ position: "absolute", left: x - w / 2, top: y - w * 0.31, transform: `rotate(${rot}deg) scale(${1 / squash}, ${squash})`, filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.5))" }}>
              <PriceTag label={["€", "€€", "€€€"][i % 3]} bg={look.bg} fg={look.fg} w={w} />
              {after > 0 && after < 10 && (
                <div style={{ position: "absolute", left: w / 2 - 60, top: w * 0.31 - 20, width: 120, height: 40, borderRadius: "50%", border: `3px solid rgba(255,255,255,${0.6 * (1 - after / 10)})`, transform: `scale(${1 + after / 4})` }} />
              )}
            </div>
          );
        })}
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(2,11,18,0.75) 0%, rgba(2,11,18,0) 30%)" }} />
      </Vis>
      <Big
        t={t}
        at={6}
        size={150}
        top={290}
        jitter={j}
        lines={[
          { text: "LA VIE" },
          {
            text: (
              <>
                LÉ CHÈR <Emoji c="🔥" />
              </>
            ),
            color: "#ff9a3c",
          },
        ]}
      />
    </>
  );
};

/* ================================================================== scène 2 : l'armoire */
const S2: React.FC<{ t: number }> = ({ t }) => {
  const dive = t / 62;
  const ridgeT = interpolate(t, [14, 62], [0, 1], clamp);
  const house = interpolate(t, [28, 62], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const inside = t >= 62;
  const open = inside ? Math.min(1, spring({ frame: t - 72, fps: VC_FPS, config: { damping: 9, stiffness: 120 } })) : 0;
  const j = shake(t, 0, [72], 16);
  return (
    <>
      <Vis>
        {!inside && (
          <AbsoluteFill style={{ background: "linear-gradient(180deg, #0d2f45 0%, #2f6f86 55%, #9cc9c2 100%)" }}>
            <Ridges t={ridgeT} />
            <div style={{ position: "absolute", left: 540 - 300, top: 980 - 140, width: 600, transformOrigin: "300px 140px", transform: `scale(${0.18 * Math.pow(60, house)})`, opacity: Math.min(1, house * 4) }}>
              <CaseCreole w={600} />
            </div>
            {/* nuages traversés en piqué */}
            {Array.from({ length: 18 }, (_, i) => {
              const z = 0.25 + random(`cz-${i}`) * 0.6;
              const s = z * Math.exp(dive * 3.4 * (0.8 + random(`cs-${i}`) * 0.5));
              const ax = (random(`cx-${i}`) - 0.5) * 900;
              const ay = (random(`cy-${i}`) - 0.5) * 1400;
              const o = interpolate(s, [0.2, 1.2, 3.5, 5], [0, 0.95, 0.9, 0], clamp);
              return (
                <div key={i} style={{ position: "absolute", left: 540 + ax * s - 260 * s, top: 900 + ay * s - 150 * s, width: 520 * s, height: 300 * s, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,0.95) 0%, rgba(240,248,250,0.7) 45%, rgba(255,255,255,0) 70%)", opacity: o }} />
              );
            })}
          </AbsoluteFill>
        )}
        {inside && (
          <AbsoluteFill style={{ transform: `translate(${j.x}px, ${j.y}px)` }}>
            <AbsoluteFill style={{ background: "linear-gradient(180deg, #4a2f1c 0%, #2c1b10 70%, #1c120a 100%)" }} />
            <div style={{ position: "absolute", left: -200, top: -200, width: 900, height: 2400, background: "linear-gradient(100deg, rgba(255,230,170,0) 30%, rgba(255,230,170,0.16) 50%, rgba(255,230,170,0) 70%)", transform: "rotate(-18deg)" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 1150, bottom: 0, background: "#3a2414" }} />
            <div style={{ position: "absolute", left: 280, top: 500, transform: `scale(${interpolate(t, [62, 120], [1.04, 1.12], clamp)})`, transformOrigin: "260px 680px" }}>
              <Armoire open={open} />
            </div>
            {/* explosion de vêtements */}
            {Array.from({ length: 38 }, (_, i) => {
              const dt = t - 74 - (i % 4) * 0.6;
              if (dt < 0) return null;
              const side = i % 2 ? 1 : -1;
              const vx = side * (14 + random(`bx-${i}`) * 34);
              const vy = -8 - random(`by-${i}`) * 18;
              const g = 1.05;
              const x = 540 + vx * dt;
              const y = 860 + vy * dt + 0.5 * g * dt * dt;
              const s = 1 + dt * 0.035;
              const size = 110 + random(`bs-${i}`) * 90;
              return (
                <div key={i} style={{ position: "absolute", left: x - size / 2, top: y - size / 2, opacity: interpolate(dt, [24, 36], [1, 0], clamp), transform: `rotate(${(random(`br-${i}`) - 0.5) * 30 * dt}deg) scale(${s})`, filter: "drop-shadow(0 12px 16px rgba(0,0,0,0.45))" }}>
                  <Cloth type={CLOTH_TYPES[i % 4]} color={CLOTH_COLORS[i % CLOTH_COLORS.length]} size={size} />
                </div>
              );
            })}
            {Array.from({ length: 30 }, (_, i) => {
              const dt = t - 74;
              if (dt < 0 || dt > 22) return null;
              const a = random(`pa-${i}`) * Math.PI * 2;
              const r = dt * (14 + random(`pr-${i}`) * 22);
              return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * r, top: 860 + Math.sin(a) * r, width: 10, height: 10, borderRadius: "50%", background: PAL.lavaHot, opacity: 1 - dt / 22, boxShadow: `0 0 12px ${PAL.lavaHot}` }} />;
            })}
          </AbsoluteFill>
        )}
        <AbsoluteFill style={{ background: "#ffffff", opacity: interpolate(t, [56, 62, 68], [0, 1, 0], clamp) }} />
      </Vis>
      {inside && (
        <Big
          t={t}
          at={64}
          size={124}
          top={290}
          backing
          jitter={{ x: j.x * 0.4, y: j.y * 0.4 }}
          lines={[
            { text: "Et ton" },
            {
              text: (
                <>
                  armoire ? <Emoji c="👀" />
                </>
              ),
              color: "#5eead4",
            },
          ]}
        />
      )}
    </>
  );
};

/* ================================================================== scène 3 : la révélation */
const S3: React.FC<{ t: number }> = ({ t }) => {
  const conv = interpolate(t, [0, 44], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const logo = pop(t, 46, 120);
  return (
    <>
      <Vis>
        <Ocean f={t + 200} tint="#06303a" />
        <Island3D id="s3" cx={540} cy={1090} w={720} tilt={52} style={{ filter: `brightness(${0.85 - 0.35 * logo})` }} />
        {/* les vêtements tourbillonnent autour de l'île et convergent */}
        {t < 48 &&
          Array.from({ length: 28 }, (_, i) => {
            const a = (i / 28) * Math.PI * 2 + t * 0.17 + conv * 3;
            const R = 640 * (1 - conv);
            const size = 70 + 70 * (1 - conv);
            return (
              <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * R - size / 2, top: 740 + Math.sin(a) * R * 0.55 - size / 2, transform: `rotate(${a * 60}deg)`, opacity: interpolate(t, [0, 6, 42, 47], [0, 1, 1, 0], clamp) }}>
                <Cloth type={CLOTH_TYPES[i % 4]} color={CLOTH_COLORS[i % CLOTH_COLORS.length]} size={size} />
              </div>
            );
          })}
        {/* onde de choc sur l'océan */}
        {[0, 7].map((d) => {
          const q = interpolate(t, [46 + d, 84 + d], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          const rx = 120 + 1300 * q;
          return q > 0 && q < 1 ? <div key={d} style={{ position: "absolute", left: 540 - rx, top: 1090 - rx * 0.36, width: rx * 2, height: rx * 0.72, borderRadius: "50%", border: `${12 - 9 * q}px solid rgba(167,243,208,${0.85 * (1 - q)})`, boxShadow: `0 0 40px rgba(94,234,212,${0.6 * (1 - q)})` }} /> : null;
        })}
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, #ffffff 0%, rgba(255,255,255,0.85) 40%, rgba(255,255,255,0) 75%)", opacity: interpolate(t, [43, 46, 62], [0, 1, 0], clamp) }} />
      </Vis>
      <div style={{ position: "absolute", left: 180, top: 560, width: 720, opacity: Math.min(1, logo * 1.5), transform: `scale(${0.6 + 0.4 * Math.min(logo, 1.04)})`, filter: "drop-shadow(0 0 30px rgba(94,234,212,0.55))" }}>
        <Logo width={720} color="#ffffff" />
      </div>
      <Big t={t} at={54} size={64} top={870} lines={[{ text: "La seconde main" }, { text: "pensée pour les îles", color: "#5eead4" }]} />
    </>
  );
};

/* ================================================================== scène 4 : vendre = gratuit */
const S4: React.FC<{ t: number }> = ({ t }) => {
  const W = 1500;
  const k = W / ISLE.w;
  const ph = pop(t, 4, 120);
  const slide = interpolate(t, [16, 34], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const listing = interpolate(t, [34, 42], [0, 1], clamp);
  const pressed = t >= 54 && t < 60;
  const online = pop(t, 58);
  const stamp = spring({ frame: t - 68, fps: VC_FPS, config: { damping: 11, stiffness: 260, mass: 0.6 } });
  const j = shake(t, 0, [70], 14);
  const bob = Math.sin(t / 11) * 10;
  return (
    <>
      <Vis>
        <AbsoluteFill style={{ transform: `translate(${j.x}px, ${j.y}px)` }}>
          <Ocean f={t + 300} />
          <Island3D id="s4" cx={540 + (500 - CITY["Saint-Denis"].x) * k} cy={1420} w={W} tilt={60} rotZ={interpolate(t, [0, 120], [-3, 3])}>
            <div style={{ position: "absolute", left: CITY["Saint-Denis"].x * k - 30, top: CITY["Saint-Denis"].y * k + 10, width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle, #ffffff 0%, #5eead4 40%, rgba(94,234,212,0) 70%)" }} />
            <Stand x={CITY["Saint-Denis"].x * k} y={CITY["Saint-Denis"].y * k + 40} tilt={60}>
              <div style={{ width: 26, height: 560, background: "linear-gradient(0deg, rgba(94,234,212,0.75), rgba(94,234,212,0))", filter: "blur(3px)", opacity: ph }} />
            </Stand>
          </Island3D>
          {/* téléphone qui flotte au-dessus de Saint-Denis */}
          <div style={{ position: "absolute", left: 380, top: 490 + bob, opacity: Math.min(1, ph * 1.5), transform: `scale(${0.7 + 0.3 * Math.min(ph, 1.02)})` }}>
            <Phone w={320} h={600} ry={Math.sin(t / 18) * 10} rx={6}>
              <div style={{ padding: 12, fontFamily: FONT }}>
                {listing < 1 && (
                  <div style={{ opacity: 1 - listing }}>
                    <div style={{ fontWeight: 700, fontSize: 22, color: PAL.ink, margin: "6px 4px 12px" }}>Nouvelle annonce</div>
                    <div style={{ height: 220, borderRadius: 16, border: "3px dashed #99d5cc", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f766e", fontWeight: 600, fontSize: 18 }}>Ajoute une photo</div>
                  </div>
                )}
                {listing > 0 && (
                  <div style={{ position: "absolute", left: 12, right: 12, top: 96, opacity: listing }}>
                    <div style={{ position: "relative" }}>
                      <DressPhoto w={272} h={210} radius={14} />
                      {online > 0 && (
                        <div style={{ position: "absolute", right: 8, top: 8, padding: "6px 12px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 16, transform: `scale(${Math.min(online, 1.05)})` }}>✓ En ligne</div>
                      )}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 24, color: PAL.ink, marginTop: 12 }}>Robe d’été</div>
                    <div style={{ fontWeight: 500, fontSize: 16, color: "#4b6461", marginTop: 4 }}>Taille M · Très bon état</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      {["Vente", "Main propre"].map((c) => (
                        <div key={c} style={{ padding: "5px 12px", borderRadius: 999, background: "#ccfbf1", color: PAL.ink, fontWeight: 600, fontSize: 15 }}>{c}</div>
                      ))}
                    </div>
                    <div style={{ marginTop: 16, height: 52, borderRadius: 14, background: pressed ? "#0b5d57" : "#0d9488", color: "#fff", fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pressed ? 0.95 : 1})` }}>Publier mon annonce</div>
                  </div>
                )}
              </div>
            </Phone>
          </div>
          {/* la photo de robe glisse dans le téléphone */}
          {t >= 14 && listing < 1 && (
            <div style={{ position: "absolute", left: interpolate(slide, [0, 1], [-340, 404]), top: interpolate(slide, [0, 1], [640, 600]) + bob, transform: `rotate(${interpolate(slide, [0, 1], [-18, 0])}deg) scale(${interpolate(slide, [0, 1], [1.25, 1])})`, opacity: 1 - listing }}>
              <DressPhoto w={272} h={210} radius={14} />
            </div>
          )}
          {/* tampon « 0 % » */}
          {t >= 68 && (
            <div style={{ position: "absolute", left: 540 - 165, top: 690 + bob, width: 330, transform: `rotate(-12deg) scale(${3 - 2 * Math.min(stamp, 1.05)})`, opacity: Math.min(1, stamp * 2) }}>
              <div style={{ border: "12px solid #ea580c", borderRadius: 28, padding: "6px 0 14px", textAlign: "center", color: "#ea580c", background: "rgba(255,247,237,0.88)", fontFamily: FONT, boxShadow: "0 20px 50px rgba(0,0,0,0.45)" }}>
                <div style={{ fontWeight: 700, fontSize: 128, lineHeight: 1.05, letterSpacing: -4 }}>0 %</div>
                <div style={{ fontWeight: 700, fontSize: 30, letterSpacing: 6 }}>COMMISSION</div>
              </div>
            </div>
          )}
          {t >= 70 && t < 84 && <div style={{ position: "absolute", left: 540 - (t - 70) * 40, top: 820 - (t - 70) * 14, width: (t - 70) * 80, height: (t - 70) * 28, borderRadius: "50%", border: `6px solid rgba(251,146,60,${1 - (t - 70) / 14})` }} />}
        </AbsoluteFill>
      </Vis>
      <Big t={t} at={4} size={88} top={278} jitter={{ x: j.x * 0.3, y: j.y * 0.3 }} lines={[{ text: "VENDRE = GRATUIT" }, { text: "0 % COMMISSION", color: "#ff9a3c", at: 70 }]} />
    </>
  );
};

/* ================================================================== scène 5 : main propre = gratuit */
const S5: React.FC<{ t: number }> = ({ t }) => {
  const W = 1180;
  const k = W / ISLE.w;
  const route = interpolate(t, [16, 50], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const dim = interpolate(t, [50, 60], [0, 0.6], clamp);
  const L = pop(t, 52, 90);
  const R = pop(t, 58, 90);
  const pts = ROUTE.map((p) => [p.x, p.y]);
  const d = "M " + pts.map((p) => p.join(" ")).join(" L ");
  // tête de la comète : interpolation le long des points de la route
  const segs = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const tot = segs.reduce((a, b) => a + b, 0);
  let rem = route * tot;
  let head = pts[0];
  for (let i = 0; i < segs.length; i++) {
    if (rem <= segs[i]) {
      const u = rem / segs[i];
      head = [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u];
      break;
    }
    rem -= segs[i];
    head = pts[i + 1];
  }
  const pin = (name: string, at: number) => {
    const c = CITY[name];
    const p = pop(t, at);
    return (
      <React.Fragment key={name}>
        <div style={{ position: "absolute", left: c.x * k - 40, top: c.y * k - 40, width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle, #fff7d6 0%, #fde68a 35%, rgba(253,230,138,0) 70%)", transform: `scale(${p})` }} />
        <Stand x={c.x * k} y={c.y * k} tilt={42}>
          <div style={{ width: 18, height: 300 * Math.min(p, 1), background: "linear-gradient(0deg, rgba(253,230,138,0.85), rgba(253,230,138,0))", filter: "blur(2px)" }} />
        </Stand>
      </React.Fragment>
    );
  };
  return (
    <>
      <Vis>
        <Ocean f={t + 420} />
        <Island3D id="s5" cx={560} cy={1010} w={W} tilt={42} rotZ={-8}>
          <svg viewBox={`0 0 ${ISLE.w} ${ISLE.h}`} width={W} height={ISLE.h * k} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <path d={d} fill="none" stroke="rgba(253,230,138,0.35)" strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - route} />
            <path d={d} fill="none" stroke="#fff3c4" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - route} />
            {route > 0 && route < 1 && <circle cx={head[0]} cy={head[1]} r={18} fill="#ffffff" style={{ filter: "drop-shadow(0 0 14px #fde68a)" }} />}
          </svg>
          {pin("Saint-Paul", 4)}
          {pin("Saint-Pierre", 10)}
        </Island3D>
        <AbsoluteFill style={{ background: "#020b12", opacity: dim }} />
        {t >= 50 && (
          <div style={{ position: "absolute", left: 0, top: 500 }}>
            <Hands left={Math.min(L, 1)} right={Math.min(R, 1)} />
          </div>
        )}
        {Array.from({ length: 16 }, (_, i) => {
          const dt = t - 72;
          if (dt < 0 || dt > 18) return null;
          const a = (i / 16) * Math.PI * 2;
          const r = 40 + dt * 12;
          return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * r - 6, top: 840 + Math.sin(a) * r - 6, width: 12, height: 12, borderRadius: "50%", background: "#fde68a", opacity: 1 - dt / 18, boxShadow: "0 0 10px #fde68a" }} />;
        })}
      </Vis>
      <Big t={t} at={4} size={104} top={280} lines={[{ text: "MAIN PROPRE" }, { text: "= GRATUIT", color: "#fde68a" }]} />
    </>
  );
};

/* ================================================================== scène 6 : paiement protégé */
const S6: React.FC<{ t: number }> = ({ t }) => {
  const shield = spring({ frame: t - 44, fps: VC_FPS, config: { damping: 14, stiffness: 140 } });
  const locked = t >= 56;
  const check = interpolate(t, [58, 70], [0, 1], clamp);
  const SW = 380;
  return (
    <>
      <Vis>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #06303a 0%, #020b12 70%)" }} />
        {/* tunnel de lumière */}
        {Array.from({ length: 12 }, (_, i) => {
          const q = ((t * 0.022 + i / 12) % 1 + 1) % 1;
          const s = 0.06 + Math.pow(q, 2.3) * 3.4;
          return <div key={i} style={{ position: "absolute", left: 540 - 300 * s, top: 715 - 380 * s, width: 600 * s, height: 760 * s, borderRadius: 120 * s, border: `${Math.max(2, 5 * s)}px solid rgba(45,212,191,${Math.min(1, q * 6) * (1 - q) * 0.9})`, boxShadow: `0 0 ${30 * s}px rgba(45,212,191,${0.4 * (1 - q)})` }} />;
        })}
        {Array.from({ length: 36 }, (_, i) => {
          const a = random(`la-${i}`) * Math.PI * 2;
          const q = ((t * 0.04 + random(`lq-${i}`)) % 1 + 1) % 1;
          const r0 = 80 + q * q * 1300;
          return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * r0, top: 715 + Math.sin(a) * r0, width: 10 + q * 160, height: 4, background: "linear-gradient(90deg, rgba(167,243,208,0), rgba(167,243,208,0.9))", transformOrigin: "0 50%", transform: `rotate(${(a * 180) / Math.PI}deg)`, opacity: q }} />;
        })}
        {/* colis */}
        <div style={{ position: "absolute", left: 540 - 90, top: 640 + Math.sin(t / 8) * 10 }}>
          <Parcel size={180} ry={t * 4} rx={-18} />
        </div>
        {/* bouclier qui se referme */}
        <div style={{ position: "absolute", left: 540 - SW / 2, top: 495, width: SW, height: SW * 1.16, filter: locked ? `drop-shadow(0 0 ${20 + 14 * Math.sin(t / 3)}px rgba(94,234,212,0.9))` : undefined }}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${-640 * (1 - Math.min(shield, 1))}px)`, opacity: interpolate(t, [40, 46], [0, 1], clamp) }}>
            <ShieldHalf side="l" w={SW} />
          </div>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${640 * (1 - Math.min(shield, 1))}px)`, opacity: interpolate(t, [40, 46], [0, 1], clamp) }}>
            <ShieldHalf side="r" w={SW} />
          </div>
          <svg width={SW} height={SW * 1.16} viewBox="0 0 200 232" style={{ position: "absolute", inset: 0 }}>
            <path d="M62 118 L90 146 L142 90" stroke="#ffffff" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - check} />
          </svg>
        </div>
        {locked && t < 72 && <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 38%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 45%)", opacity: interpolate(t, [56, 72], [1, 0], clamp) }} />}
      </Vis>
      <Big t={t} at={4} size={104} top={272} lines={[{ text: "PAIEMENT" }, { text: "PROTÉGÉ", color: "#5eead4" }]} />
      <div style={{ position: "absolute", left: 60, width: 880, top: 948, display: "flex", justifyContent: "center", opacity: interpolate(t, [18, 26], [0, 1], clamp) }}>
        <div style={{ padding: "10px 22px", borderRadius: 18, background: "rgba(2,11,18,0.78)", textAlign: "center", fontFamily: FONT, color: "#ffffff", fontWeight: 600, fontSize: 34, lineHeight: 1.22 }}>
          <div style={{ whiteSpace: "nowrap" }}>Protection acheteur : 10 % du prix</div>
          <div style={{ whiteSpace: "nowrap" }}>(0,50 € min, 15 € max)</div>
          <div style={{ whiteSpace: "nowrap", color: "#99f6e4" }}>Conditions sur swapiles.com</div>
        </div>
      </div>
    </>
  );
};

/* ================================================================== scène 7 : appel à l'action */
const LIGHTS = islandPoints(80, "lights");
const S7: React.FC<{ t: number }> = ({ t }) => {
  const W = 920;
  const k = W / ISLE.w;
  const back = ease(t, 62, 96);
  const logo = pop(t, 76, 110);
  const site = pop(t, 86);
  const btn = pop(t, 94, 120);
  return (
    <>
      <Vis>
        <Ocean f={t + 660} />
        <Island3D id="s7" cx={540} cy={880} w={W} tilt={30} style={{ transform: `translateY(${-120 * back}px) scale(${1 - 0.5 * back})`, opacity: 1 - 0.7 * back }}>
          {LIGHTS.map((p, i) => {
            const on = pop(t, 4 + random(`lo-${i}`) * 50, 200);
            if (on <= 0.01) return null;
            const tw = 0.75 + 0.25 * Math.sin(t / 4 + i);
            const warm = i % 3 !== 0;
            return <div key={i} style={{ position: "absolute", left: p.x * k - 9, top: p.y * k - 9, width: 18, height: 18, borderRadius: "50%", background: warm ? "#fde68a" : "#99f6e4", opacity: tw, transform: `scale(${on})`, boxShadow: `0 0 18px 6px ${warm ? "rgba(253,230,138,0.7)" : "rgba(153,246,228,0.7)"}` }} />;
          })}
        </Island3D>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(15,118,110,0.35) 0%, rgba(0,0,0,0) 60%)", opacity: back }} />
      </Vis>
      <div style={{ position: "absolute", left: 200, top: 470, width: 680, opacity: Math.min(1, logo * 1.5), transform: `scale(${0.6 + 0.4 * Math.min(logo, 1.03)})`, filter: "drop-shadow(0 0 26px rgba(94,234,212,0.5))" }}>
        <Logo width={680} color="#ffffff" />
      </div>
      <div style={{ position: "absolute", left: 60, width: 880, top: 735, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 76, color: "#ffffff", opacity: Math.min(1, site * 1.5), transform: `translateY(${(1 - Math.min(site, 1)) * 30}px)` }}>swapiles.com</div>
      <div style={{ position: "absolute", left: 60, width: 880, top: 860, display: "flex", justifyContent: "center", opacity: Math.min(1, btn * 1.5), transform: `scale(${(0.6 + 0.4 * Math.min(btn, 1.03)) * (1 + 0.03 * Math.sin(t / 5) * (t > 110 ? 1 : 0))})` }}>
        <div style={{ padding: "22px 70px", borderRadius: 999, background: "#14b8a6", color: "#ffffff", fontFamily: FONT, fontWeight: 700, fontSize: 60, boxShadow: "0 0 40px rgba(20,184,166,0.7), 0 12px 30px rgba(0,0,0,0.4)", whiteSpace: "nowrap" }}>S’inscrire</div>
      </div>
      <Vis>
        {t > 100 && <div style={{ position: "absolute", left: 540 - 30, top: 1000 + Math.abs(Math.sin(t / 5)) * 18, fontSize: 60, color: "#99f6e4", fontFamily: FONT, fontWeight: 700 }}>↓</div>}
      </Vis>
    </>
  );
};

/* ================================================================== composition */
export const VieChere: React.FC<{ qa?: boolean }> = ({ qa = false }) => (
  <QA.Provider value={qa}>
    <AbsoluteFill style={{ background: qa ? "#000" : PAL.night, fontFamily: FONT }}>
      <Scene from={SC[0]} to={SC[1]}>{(t) => <S1 t={t} />}</Scene>
      <Scene from={SC[1]} to={SC[2]}>{(t) => <S2 t={t} />}</Scene>
      <Scene from={SC[2]} to={SC[3]}>{(t) => <S3 t={t} />}</Scene>
      <Scene from={SC[3]} to={SC[4]}>{(t) => <S4 t={t} />}</Scene>
      <Scene from={SC[4]} to={SC[5]}>{(t) => <S5 t={t} />}</Scene>
      <Scene from={SC[5]} to={SC[6]}>{(t) => <S6 t={t} />}</Scene>
      <Scene from={SC[6]} to={SC[7]}>{(t) => <S7 t={t} />}</Scene>
      <Subtitle cues={VC_CUES} />
      {!qa && <Html5Audio src={staticFile("viechere/mix.wav")} />}
    </AbsoluteFill>
  </QA.Provider>
);
