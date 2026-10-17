import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { AppStoreBadge, GooglePlayBadge } from "../components/Badges";
import { Icon, IconName } from "../components/Icons";
import { Logo } from "../components/Logo";
import { Decor, Frame, M, PROTECTION } from "./kit";
import { CITIES, REUNION_PATH, REUNION_VIEWBOX } from "./reunionGeo";

type Fmt = "feed" | "story";
type Angle = "A" | "B" | "C";

/**
 * Zones de contenu.
 * - story (1080×1920) : zones à éviter Instagram (250 px haut, 670 px bas, 140 px droite).
 * - feed (1080×1350) : marges de 60 px.
 */
const BOX: Record<Fmt, { x: number; y: number; w: number; h: number }> = {
  feed: { x: 60, y: 60, w: 960, h: 1230 },
  story: { x: 60, y: 264, w: 880, h: 982 },
};

const COPY: Record<Angle, { title: string[]; sub: string[]; cta: string }> = {
  A: { title: ["Ton placard peut", "te rapporter."], sub: ["Dépôt d’annonce gratuit.", "Tu gardes le prix que tu fixes."], cta: "Vends gratuitement" },
  B: { title: ["Ton argent attend", "ton colis."], sub: [PROTECTION, "Conditions sur swapiles.com"], cta: "Télécharge l’appli" },
  C: { title: ["La seconde main", "pensée pour les îles."], sub: ["Main propre, point relais ou Colissimo."], cta: "Télécharge l’appli" },
};

const Cta: React.FC<{ text: string; size: number }> = ({ text, size }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: `${size * 0.5}px ${size * 1.1}px`, borderRadius: 999, background: M.teal, color: M.white, fontWeight: 700, fontSize: size, whiteSpace: "nowrap" }}>
    {text}
    <span style={{ fontSize: size * 1.05 }}>→</span>
  </div>
);

/** Visuel B : schéma en 3 cases. */
const Steps: React.FC<{ w: number; compact?: boolean }> = ({ w, compact }) => {
  const steps: { icon: IconName; label: string[] }[] = [
    { icon: "card", label: ["Tu paies"] },
    { icon: "clock", label: ["L’argent", "attend"] },
    { icon: "check", label: ["Tu reçois,", "la vendeuse", "est payée"] },
  ];
  const gap = 22;
  const cw = (w - gap * 2 - 44 * 2) / 3;
  const h = compact ? 300 : 360;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, width: w }}>
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div style={{ width: cw, height: h, borderRadius: 30, background: i === 2 ? M.teal : M.white, border: `2px solid ${i === 2 ? M.teal : M.tealLight}`, boxShadow: "0 16px 40px rgba(19,78,74,0.10)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, padding: 14, boxSizing: "border-box" }}>
            <div style={{ width: 84, height: 84, borderRadius: "50%", background: i === 2 ? "rgba(255,255,255,0.18)" : M.tealSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={s.icon} size={50} color={i === 2 ? M.white : M.teal} strokeWidth={2.2} />
            </div>
            <div style={{ textAlign: "center" }}>
              {s.label.map((l, k) => (
                <div key={k} style={{ fontWeight: 700, fontSize: 30, lineHeight: 1.15, color: i === 2 ? M.white : M.ink, whiteSpace: "nowrap" }}>{l}</div>
              ))}
            </div>
          </div>
          {i < 2 && (
            <div style={{ width: 44 + gap, display: "flex", justifyContent: "center", color: M.teal, fontSize: 44, fontWeight: 700 }}>→</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

/** Visuel C : silhouette de l'île avec repères des villes. */
const IslandMap: React.FC<{ w: number }> = ({ w }) => {
  const k = w / REUNION_VIEWBOX.w;
  const h = REUNION_VIEWBOX.h * k;
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      <svg width={w} height={h} viewBox={`0 0 ${REUNION_VIEWBOX.w} ${REUNION_VIEWBOX.h}`} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={REUNION_PATH} fill={M.teal} />
      </svg>
      {CITIES.map((c) => (
        <div key={c.name} style={{ position: "absolute", left: c.x * k - 11, top: c.y * k - 11, width: 22, height: 22, borderRadius: "50%", background: M.white, border: `5px solid ${M.ink}` }} />
      ))}
    </div>
  );
};

export const Poster: React.FC<{ angle: Angle; fmt: Fmt; qa?: boolean }> = ({ angle, fmt, qa }) => {
  const b = BOX[fmt];
  const story = fmt === "story";
  const c = COPY[angle];
  const titleSize = 76;
  const visualH = story ? { A: 410, B: 420, C: 440 }[angle] : 560;

  const visual =
    angle === "A" ? (
      <div style={{ width: b.w, height: visualH, borderRadius: 36, overflow: "hidden", boxShadow: "0 24px 60px rgba(19,78,74,0.18)" }}>
        <Img src={staticFile("meta/photos/armoire.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    ) : angle === "B" ? (
      <div style={{ height: visualH, display: "flex", alignItems: "center" }}>
        <Steps w={b.w} compact={story} />
      </div>
    ) : (
      <div style={{ height: visualH, width: b.w, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <IslandMap w={visualH * (REUNION_VIEWBOX.w / REUNION_VIEWBOX.h) * 0.98} />
      </div>
    );

  return (
    <Frame qa={qa}>
      <Decor />
      <AbsoluteFill>
        <div style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, display: "flex", flexDirection: "column" }}>
          <Logo width={story ? 180 : 220} color={M.logo} style={{ flexShrink: 0 }} />
          <div style={{ flexShrink: 0, marginTop: story ? 22 : 34 }}>
            {c.title.map((l, i) => (
              <div key={i} style={{ fontWeight: 700, fontSize: titleSize, lineHeight: 1.06, letterSpacing: -1.5, color: M.ink, whiteSpace: "nowrap" }}>{l}</div>
            ))}
          </div>
          <div style={{ flexShrink: 0, marginTop: story ? 24 : 34 }}>{visual}</div>
          <div style={{ flexShrink: 0, marginTop: story ? 20 : 34 }}>
            {c.sub.map((l, i) => (
              <div key={i} style={{ fontWeight: i === 0 ? 600 : 500, fontSize: angle === "B" ? (story ? 30 : 34) : story ? 34 : 38, lineHeight: 1.3, color: i === 0 ? M.ink : M.muted, whiteSpace: "nowrap" }}>{l}</div>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Cta text={c.cta} size={story ? 44 : 40} />
            <div style={{ fontWeight: 700, fontSize: story ? 34 : 34, color: M.teal, whiteSpace: "nowrap" }}>swapiles.com</div>
          </div>
          <div style={{ flexShrink: 0, display: "flex", gap: 18, marginTop: story ? 20 : 26 }}>
            <AppStoreBadge height={story ? 72 : 70} />
            <GooglePlayBadge height={story ? 72 : 70} />
          </div>
        </div>
      </AbsoluteFill>
    </Frame>
  );
};
