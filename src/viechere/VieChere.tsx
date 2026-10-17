/**
 * Reel « La vie lé chèr » (27 s, 1080×1920) — motion design.
 * 7 scènes : accroche volcan + pluie d'étiquettes, armoire qui explose, révélation du logo,
 * vente gratuite, main propre gratuite, paiement protégé, appel à l'action.
 * Textes à l'écran dans la zone utile Reels (250 → 1250 px de haut, 60 → 940 px de large).
 */
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Easing, Html5Audio, interpolate, random, spring, staticFile, useCurrentFrame } from "remotion";
import { Logo } from "../components/Logo";
import { Subtitle } from "../meta/kit";
import { Armoire, CaseCreole, Cloth, CLOTH_COLORS, CLOTH_TYPES, DressPhoto, PAL, Parcel, Phone, PriceTag, Ridges, ShieldHalf } from "./props";
import { VC_CUES } from "./voiceCues";
import { CITY, FOURNAISE, Island3D, islandPoints, ISLE, Ocean, ROUTE, Stand } from "./world";

export const VC_FPS = 30;
export const VC_DURATION = 27 * VC_FPS;
/** Débuts de scène (images) — doivent suivre LINES dans scripts/generate_viechere_audio.py. */
const SC = [0, 90, 210, 300, 420, 540, 660, 810];

const FONT = "'Instrument Sans', ui-sans-serif, sans-serif";
const QA = createContext(false);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (f: number, a: number, b: number, e = Easing.bezier(0.65, 0, 0.35, 1)) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: e });
const pop = (f: number, at: number, stiff = 160) => spring({ frame: f - at, fps: VC_FPS, config: { damping: 22, stiffness: stiff, mass: 0.8 } });

/** Visuel (masqué en mode contrôle : seul le texte reste, sur fond noir). */
const Vis: React.FC<{ children: React.ReactNode }> = ({ children }) => (useContext(QA) ? null : <>{children}</>);

/** Une scène : visible de from à to (+ 5 images de fondu enchaîné par-dessus la précédente). */
const Scene: React.FC<{ from: number; to: number; children: (t: number) => React.ReactNode }> = ({ from, to, children }) => {
  const f = useCurrentFrame();
  if (f < from || f >= to + 5) return null;
  const o = from === 0 ? 1 : interpolate(f, [from, from + 5], [0, 1], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children(f - from)}</AbsoluteFill>;
};

/** Grand titre : apparition sobre (fondu + légère montée), centré dans la zone utile. */
const Big: React.FC<{
  lines: { text: React.ReactNode; color?: string; at?: number; size?: number }[];
  t: number;
  at: number;
  size: number;
  top?: number;
  backing?: boolean;
}> = ({ lines, t, at, size, top = 285, backing }) => (
  <div style={{ position: "absolute", left: 60, width: 880, top, textAlign: "center" }}>
    {backing && (
      <Vis>
        <div style={{ position: "absolute", left: -10, right: -10, top: -22, bottom: -26, borderRadius: 32, background: "rgba(12,10,8,0.62)", opacity: ease(t, at, at + 10) }} />
      </Vis>
    )}
    {lines.map((l, i) => {
      const p = ease(t, l.at ?? at + i * 5, (l.at ?? at + i * 5) + 14, Easing.bezier(0.2, 0.8, 0.2, 1));
      return (
        <div
          key={i}
          style={{
            position: "relative",
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: l.size ?? size,
            lineHeight: 1.06,
            letterSpacing: -1.5,
            color: l.color ?? "#ffffff",
            whiteSpace: "nowrap",
            textShadow: "0 4px 28px rgba(0,0,0,0.55)",
            opacity: p,
            transform: `translateY(${(1 - p) * 28}px)`,
          }}
        >
          {l.text}
        </div>
      );
    })}
  </div>
);

/** Caméra 2D : rapproche un point (fx, fy) vers (tx, ty) avec un zoom z. */
const Cam: React.FC<{ fx: number; fy: number; tx: number; ty: number; z: number; p: number; children: React.ReactNode }> = ({ fx, fy, tx, ty, z, p, children }) => (
  <AbsoluteFill style={{ transformOrigin: `${fx}px ${fy}px`, transform: `translate(${(tx - fx) * p}px, ${(ty - fy) * p}px) scale(${1 + (z - 1) * p})` }}>{children}</AbsoluteFill>
);

const ACCENT = "#f5b971"; // sable chaud (vie chère)
const MINT = "#5eead4";

/* ================================================================== scène 1 : l'accroche */
const TAG_COUNT = 7;
const S1: React.FC<{ t: number }> = ({ t }) => {
  const rise = ease(t, 4, 40, Easing.bezier(0.2, 0.9, 0.3, 1));
  const cam = ease(t, 42, 76);
  const W = 960;
  const k = W / ISLE.w;
  const glow = 0.75 + 0.25 * Math.sin(t / 4);
  const lava = interpolate(t, [24, 44], [0, 1], clamp);
  return (
    <>
      <Vis>
        <Cam fx={859} fy={1231} tx={560} ty={1010} z={2.1} p={cam}>
          <Ocean f={t} glow={lava * 0.8} />
          {(() => {
            const q = interpolate(t, [10, 50], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
            const rx = 320 + 700 * q;
            return q > 0 && q < 1 ? <div style={{ position: "absolute", left: 540 - rx, top: 1040 - rx * 0.42, width: rx * 2, height: rx * 0.84, borderRadius: "50%", border: `3px solid rgba(190,255,245,${0.5 * (1 - q)})` }} /> : null;
          })()}
          <Island3D
            id="s1"
            cx={540}
            cy={1040}
            w={W}
            tilt={48}
            style={{ transform: `translateY(${(1 - rise) * 760}px) scale(${0.78 + 0.22 * rise})`, filter: `brightness(${0.35 + 0.55 * rise}) saturate(${0.7 + 0.3 * rise})`, opacity: Math.min(1, rise * 3) }}
          >
            <div style={{ position: "absolute", left: FOURNAISE.x * k - 110, top: FOURNAISE.y * k - 110, width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,200,120,${0.9 * lava}) 0%, rgba(255,120,30,${0.6 * lava * glow}) 35%, rgba(255,80,0,0) 70%)` }} />
            <Stand x={FOURNAISE.x * k} y={FOURNAISE.y * k + 10} tilt={48}>
              <div style={{ position: "relative", width: 240, height: 300 }}>
                <div style={{ position: "absolute", left: -30, right: -30, bottom: 70, height: 230, background: `radial-gradient(ellipse at 50% 100%, rgba(255,180,90,${0.85 * lava}) 0%, rgba(255,110,30,${0.45 * lava * glow}) 32%, rgba(255,60,0,0) 68%)`, filter: "blur(10px)" }} />
                <svg width={240} height={110} viewBox="0 0 240 110" style={{ position: "absolute", left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cone" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#2b221c" />
                      <stop offset="0.5" stopColor="#4a3a2e" />
                      <stop offset="1" stopColor="#211a15" />
                    </linearGradient>
                  </defs>
                  <path d="M0 110 Q60 82 94 22 L146 22 Q180 82 240 110 Z" fill="url(#cone)" />
                  <ellipse cx={120} cy={23} rx={28} ry={7} fill={`rgba(255,${160 + 50 * glow},80,${0.3 + 0.6 * lava})`} />
                </svg>
                {Array.from({ length: 10 }, (_, i) => {
                  const life = ((t * (1.1 + random(`sp-${i}`) * 0.8) + i * 9) % 44) / 44;
                  return <div key={i} style={{ position: "absolute", left: 120 + (random(`spx-${i}`) - 0.5) * 90 * (0.2 + life), bottom: 95 + life * 200, width: 7 - 4 * life, height: 7 - 4 * life, borderRadius: "50%", background: PAL.lavaHot, opacity: lava * (0.8 - 0.8 * life), boxShadow: `0 0 10px ${PAL.lava}` }} />;
                })}
              </div>
            </Stand>
          </Island3D>
        </Cam>
        {/* étiquettes de prix qui tombent sur l'île (sobres, sans montant) */}
        {Array.from({ length: TAG_COUNT }, (_, i) => {
          const land = 34 + i * 6;
          const s0 = land - 20;
          if (t < s0) return null;
          const q = ease(t, s0, land, Easing.bezier(0.5, 0, 0.75, 0.4));
          const ang = (i / TAG_COUNT) * Math.PI * 2 + 0.6;
          const x = Math.min(880, Math.max(170, 560 + Math.cos(ang) * 330));
          const yT = Math.min(1480, Math.max(780, 1050 + Math.sin(ang) * 300));
          const w = 140;
          const y = -200 + (yT + 200) * q;
          return (
            <div key={i} style={{ position: "absolute", left: x - w / 2, top: y - 44, transform: `rotate(${(random(`tr-${i}`) - 0.5) * 24}deg)`, filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.45))", opacity: Math.min(1, q * 3) }}>
              <PriceTag label={["€", "€€", "€€€"][i % 3]} bg="#f8f5ef" fg="#7c2d12" w={w} />
            </div>
          );
        })}
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(2,11,18,0.8) 0%, rgba(2,11,18,0) 32%)" }} />
      </Vis>
      <Big t={t} at={6} size={140} top={290} lines={[{ text: "La vie" }, { text: "lé chèr.", color: ACCENT }]} />
    </>
  );
};

/* ================================================================== scène 2 : l'armoire */
const S2: React.FC<{ t: number }> = ({ t }) => {
  const dive = t / 62;
  const ridgeT = interpolate(t, [14, 62], [0, 1], clamp);
  const house = interpolate(t, [28, 62], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const inside = t >= 62;
  const open = inside ? ease(t, 70, 86, Easing.bezier(0.3, 0, 0.2, 1)) : 0;
  return (
    <>
      <Vis>
        {!inside && (
          <AbsoluteFill style={{ background: "linear-gradient(180deg, #0d2f45 0%, #2f6f86 55%, #9cc9c2 100%)" }}>
            <Ridges t={ridgeT} />
            <div style={{ position: "absolute", left: 540 - 300, top: 980 - 140, width: 600, transformOrigin: "300px 140px", transform: `scale(${0.18 * Math.pow(60, house)})`, opacity: Math.min(1, house * 4) }}>
              <CaseCreole w={600} />
            </div>
            {Array.from({ length: 16 }, (_, i) => {
              const z = 0.25 + random(`cz-${i}`) * 0.6;
              const s = z * Math.exp(dive * 3.4 * (0.8 + random(`cs-${i}`) * 0.5));
              const ax = (random(`cx-${i}`) - 0.5) * 900;
              const ay = (random(`cy-${i}`) - 0.5) * 1400;
              const o = interpolate(s, [0.2, 1.2, 3.5, 5], [0, 0.9, 0.85, 0], clamp);
              return <div key={i} style={{ position: "absolute", left: 540 + ax * s - 260 * s, top: 900 + ay * s - 150 * s, width: 520 * s, height: 300 * s, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,0.9) 0%, rgba(240,248,250,0.65) 45%, rgba(255,255,255,0) 70%)", opacity: o }} />;
            })}
          </AbsoluteFill>
        )}
        {inside && (
          <AbsoluteFill>
            <AbsoluteFill style={{ background: "linear-gradient(180deg, #3a2a1e 0%, #241a12 70%, #17110c 100%)" }} />
            <div style={{ position: "absolute", left: -200, top: -200, width: 900, height: 2400, background: "linear-gradient(100deg, rgba(255,230,170,0) 30%, rgba(255,230,170,0.12) 50%, rgba(255,230,170,0) 70%)", transform: "rotate(-18deg)" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 1150, bottom: 0, background: "#2e1f14" }} />
            <div style={{ position: "absolute", left: 280, top: 500, transform: `scale(${interpolate(t, [62, 120], [1.02, 1.08], clamp)})`, transformOrigin: "260px 680px" }}>
              <Armoire open={open} />
            </div>
            {/* le linge glisse hors de l'armoire */}
            {Array.from({ length: 14 }, (_, i) => {
              const p = ease(t, 80 + i * 1.5, 104 + i * 1.5, Easing.bezier(0.2, 0.7, 0.3, 1));
              if (p <= 0) return null;
              const side = i % 2 ? 1 : -1;
              const tx = side * (240 + random(`gx-${i}`) * 260);
              const ty = (random(`gy-${i}`) - 0.3) * 520;
              const size = 120 + random(`gs-${i}`) * 50;
              return (
                <div key={i} style={{ position: "absolute", left: 540 + tx * p - size / 2, top: 860 + ty * p - size / 2, opacity: Math.min(1, p * 3) * interpolate(t, [108, 120], [1, 0.85], clamp), transform: `rotate(${side * 10 * p}deg) scale(${0.6 + 0.4 * p})`, filter: "drop-shadow(0 12px 18px rgba(0,0,0,0.4))" }}>
                  <Cloth type={CLOTH_TYPES[i % 4]} color={CLOTH_COLORS[i % CLOTH_COLORS.length]} size={size} />
                </div>
              );
            })}
          </AbsoluteFill>
        )}
        <AbsoluteFill style={{ background: "#ffffff", opacity: interpolate(t, [56, 62, 70], [0, 0.85, 0], clamp) }} />
      </Vis>
      {inside && <Big t={t} at={66} size={120} top={290} backing lines={[{ text: "Et ton" }, { text: "armoire ?", color: MINT }]} />}
    </>
  );
};

/* ================================================================== scène 3 : la révélation */
const S3: React.FC<{ t: number }> = ({ t }) => {
  const conv = interpolate(t, [0, 44], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const logo = ease(t, 44, 60, Easing.bezier(0.2, 0.8, 0.2, 1));
  return (
    <>
      <Vis>
        <Ocean f={t + 200} tint="#06303a" />
        <Island3D id="s3" cx={540} cy={1090} w={720} tilt={52} style={{ filter: `brightness(${0.85 - 0.35 * logo})` }} />
        {t < 48 &&
          Array.from({ length: 18 }, (_, i) => {
            const a = (i / 18) * Math.PI * 2 + t * 0.12 + conv * 2.5;
            const R = 600 * (1 - conv);
            const size = 56 + 50 * (1 - conv);
            return (
              <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * R - size / 2, top: 740 + Math.sin(a) * R * 0.5 - size / 2, opacity: interpolate(t, [0, 8, 40, 46], [0, 0.95, 0.95, 0], clamp), filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.35))" }}>
                <Cloth type={CLOTH_TYPES[i % 4]} color={CLOTH_COLORS[i % CLOTH_COLORS.length]} size={size} />
              </div>
            );
          })}
        {(() => {
          const q = interpolate(t, [46, 86], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          const rx = 120 + 1300 * q;
          return q > 0 && q < 1 ? <div style={{ position: "absolute", left: 540 - rx, top: 1090 - rx * 0.36, width: rx * 2, height: rx * 0.72, borderRadius: "50%", border: `${5 - 3 * q}px solid rgba(167,243,208,${0.7 * (1 - q)})` }} /> : null;
        })()}
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 35%, rgba(255,255,255,0) 70%)", opacity: interpolate(t, [42, 46, 62], [0, 0.7, 0], clamp) }} />
      </Vis>
      <div style={{ position: "absolute", left: 180, top: 560, width: 720, opacity: logo, transform: `translateY(${(1 - logo) * 24}px)`, filter: "drop-shadow(0 0 24px rgba(94,234,212,0.35))" }}>
        <Logo width={720} color="#ffffff" />
      </div>
      <Big t={t} at={54} size={64} top={870} lines={[{ text: "La seconde main" }, { text: "pensée pour les îles", color: MINT }]} />
    </>
  );
};

/* ================================================================== scène 4 : vendre = gratuit */
const S4: React.FC<{ t: number }> = ({ t }) => {
  const W = 1500;
  const k = W / ISLE.w;
  const ph = ease(t, 2, 18, Easing.bezier(0.2, 0.8, 0.2, 1));
  const slide = interpolate(t, [16, 34], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const listing = interpolate(t, [34, 42], [0, 1], clamp);
  const pressed = t >= 54 && t < 60;
  const online = ease(t, 58, 66);
  const bob = Math.sin(t / 14) * 8;
  return (
    <>
      <Vis>
        <Ocean f={t + 300} />
        <Island3D id="s4" cx={540 + (500 - CITY["Saint-Denis"].x) * k} cy={1420} w={W} tilt={60} rotZ={interpolate(t, [0, 120], [-3, 3])}>
          <div style={{ position: "absolute", left: CITY["Saint-Denis"].x * k - 30, top: CITY["Saint-Denis"].y * k + 10, width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle, #ffffff 0%, #5eead4 40%, rgba(94,234,212,0) 70%)" }} />
          <Stand x={CITY["Saint-Denis"].x * k} y={CITY["Saint-Denis"].y * k + 40} tilt={60}>
            <div style={{ width: 18, height: 560, background: "linear-gradient(0deg, rgba(94,234,212,0.6), rgba(94,234,212,0))", filter: "blur(3px)", opacity: ph }} />
          </Stand>
        </Island3D>
        <div style={{ position: "absolute", left: 380, top: 490 + bob, opacity: ph, transform: `translateY(${(1 - ph) * 40}px)` }}>
          <Phone w={320} h={600} ry={Math.sin(t / 22) * 8} rx={5}>
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
                    {online > 0 && <div style={{ position: "absolute", right: 8, top: 8, padding: "6px 12px", borderRadius: 999, background: "#0f766e", color: "#fff", fontWeight: 700, fontSize: 16, opacity: online }}>✓ En ligne</div>}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 24, color: PAL.ink, marginTop: 12 }}>Robe d’été</div>
                  <div style={{ fontWeight: 500, fontSize: 16, color: "#4b6461", marginTop: 4 }}>Taille M · Très bon état</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    {["Vente", "Main propre"].map((c) => (
                      <div key={c} style={{ padding: "5px 12px", borderRadius: 999, background: "#ccfbf1", color: PAL.ink, fontWeight: 600, fontSize: 15 }}>{c}</div>
                    ))}
                  </div>
                  <div style={{ marginTop: 16, height: 52, borderRadius: 14, background: pressed ? "#0b5d57" : "#0d9488", color: "#fff", fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>Publier mon annonce</div>
                </div>
              )}
            </div>
          </Phone>
        </div>
        {t >= 14 && listing < 1 && (
          <div style={{ position: "absolute", left: interpolate(slide, [0, 1], [-340, 404]), top: interpolate(slide, [0, 1], [640, 600]) + bob, transform: `rotate(${interpolate(slide, [0, 1], [-8, 0])}deg)`, opacity: 1 - listing }}>
            <DressPhoto w={272} h={210} radius={14} />
          </div>
        )}
      </Vis>
      <Big t={t} at={4} size={96} top={278} lines={[{ text: "Vendre = gratuit" }, { text: "Ton prix, tu le gardes.", color: MINT, size: 58, at: 54 }]} />
    </>
  );
};

/* ================================================================== scène 5 : main propre = gratuit */
const S5: React.FC<{ t: number }> = ({ t }) => {
  const W = 1180;
  const k = W / ISLE.w;
  const route = interpolate(t, [16, 50], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const dim = interpolate(t, [50, 60], [0, 0.65], clamp);
  const meet = ease(t, 52, 68, Easing.bezier(0.6, 0, 0.3, 1));
  const badge = ease(t, 64, 78, Easing.bezier(0.2, 0.8, 0.2, 1));
  const pts = ROUTE.map((p) => [p.x, p.y]);
  const d = "M " + pts.map((p) => p.join(" ")).join(" L ");
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
    const p = ease(t, at, at + 12);
    return (
      <React.Fragment key={name}>
        <div style={{ position: "absolute", left: c.x * k - 40, top: c.y * k - 40, width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle, #fff7d6 0%, #fde68a 35%, rgba(253,230,138,0) 70%)", opacity: p }} />
        <Stand x={c.x * k} y={c.y * k} tilt={42}>
          <div style={{ width: 14, height: 300 * p, background: "linear-gradient(0deg, rgba(253,230,138,0.75), rgba(253,230,138,0))", filter: "blur(2px)" }} />
        </Stand>
      </React.Fragment>
    );
  };
  const CY = 830;
  return (
    <>
      <Vis>
        <Ocean f={t + 420} />
        <Island3D id="s5" cx={560} cy={1010} w={W} tilt={42} rotZ={-8}>
          <svg viewBox={`0 0 ${ISLE.w} ${ISLE.h}`} width={W} height={ISLE.h * k} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <path d={d} fill="none" stroke="rgba(253,230,138,0.3)" strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - route} />
            <path d={d} fill="none" stroke="#fff3c4" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - route} />
            {route > 0 && route < 1 && <circle cx={head[0]} cy={head[1]} r={16} fill="#ffffff" style={{ filter: "drop-shadow(0 0 14px #fde68a)" }} />}
          </svg>
          {pin("Saint-Paul", 4)}
          {pin("Saint-Pierre", 10)}
        </Island3D>
        <AbsoluteFill style={{ background: "#020b12", opacity: dim }} />
        {/* deux points qui se rejoignent autour d'un sac : la remise en main propre */}
        {t >= 50 && (
          <>
            {[-1, 1].map((s) => (
              <React.Fragment key={s}>
                <div style={{ position: "absolute", left: 540 + s * 400 * (1 - meet) - (s > 0 ? 0 : 400 * (1 - meet)), top: CY - 2, width: 400 * (1 - meet), height: 4, background: `linear-gradient(${s > 0 ? 270 : 90}deg, rgba(253,230,138,0), rgba(253,230,138,0.8))`, opacity: 1 - badge }} />
                <div style={{ position: "absolute", left: 540 + s * (400 * (1 - meet) + 130 * meet) - 14, top: CY - 14, width: 28, height: 28, borderRadius: "50%", background: "#fff7d6", boxShadow: "0 0 24px 8px rgba(253,230,138,0.7)" }} />
              </React.Fragment>
            ))}
            <div style={{ position: "absolute", left: 540 - 130, top: CY - 130, width: 260, height: 260, borderRadius: "50%", border: "4px solid rgba(255,255,255,0.9)", background: "rgba(15,118,110,0.35)", opacity: badge, transform: `scale(${0.85 + 0.15 * badge})`, boxShadow: "0 0 50px rgba(94,234,212,0.35)" }}>
              <svg viewBox="0 0 100 100" width={256} height={256}>
                <path d="M30 40 L70 40 L74 78 L26 78 Z" fill="none" stroke="#ffffff" strokeWidth={4} strokeLinejoin="round" />
                <path d="M40 40 Q40 26 50 26 Q60 26 60 40" fill="none" stroke="#ffffff" strokeWidth={4} strokeLinecap="round" />
              </svg>
            </div>
          </>
        )}
      </Vis>
      <Big t={t} at={4} size={104} top={280} lines={[{ text: "Main propre" }, { text: "= gratuit", color: "#fde68a" }]} />
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
          <Parcel size={180} ry={t * 1.6} rx={-16} />
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
      <Big t={t} at={4} size={104} top={272} lines={[{ text: "Paiement" }, { text: "protégé", color: MINT }]} />
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
