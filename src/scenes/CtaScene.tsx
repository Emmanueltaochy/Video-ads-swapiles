import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, COPY, FONT } from "../config";
import { ease, pop } from "../components/anim";
import { TropicalBackground } from "../components/Background";
import { AppStoreBadge, GooglePlayBadge, SocialIcon } from "../components/Badges";
import { Logo } from "../components/Logo";

/** Bouton d'appel à l'action qui "respire". */
export const CtaButton: React.FC<{ f: number; delay: number; fontSize?: number }> = ({ f, delay, fontSize = 54 }) => {
  const s = pop(f, delay, 10);
  const pulse = 1 + Math.max(0, Math.sin((f - delay - 15) / 7)) * 0.035;
  const shine = ((f - delay) * 28) % 1800;
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        transform: `scale(${s * pulse})`,
        padding: `${fontSize * 0.42}px ${fontSize * 1.1}px`,
        borderRadius: 100,
        background: COLORS.sun,
        color: COLORS.deep,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize,
        letterSpacing: -0.5,
        boxShadow: "0 18px 45px rgba(0,0,0,0.3), inset 0 -6px 0 rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        gap: fontSize * 0.4,
        whiteSpace: "nowrap",
      }}
    >
      <svg width={fontSize * 0.9} height={fontSize * 0.9} viewBox="0 0 24 24" fill="none" stroke={COLORS.deep} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v12M6.5 10 12 15.5 17.5 10M4 20h16" />
      </svg>
      {COPY.cta}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: shine - 300,
          width: 120,
          background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)",
          transform: "skewX(-20deg)",
        }}
      />
    </div>
  );
};

export const StoreBadges: React.FC<{ f: number; delay: number; height?: number }> = ({ f, delay, height = 92 }) => (
  <div style={{ display: "flex", gap: 28 }}>
    <div style={{ transform: `scale(${pop(f, delay)})` }}>
      <AppStoreBadge height={height} />
    </div>
    <div style={{ transform: `scale(${pop(f, delay + 6)})` }}>
      <GooglePlayBadge height={height} />
    </div>
  </div>
);

export const SocialRow: React.FC<{ f: number; delay: number; size?: number }> = ({ f, delay, size = 56 }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: size * 0.32,
      fontFamily: FONT,
      color: "#fff",
      opacity: ease(f, delay, delay + 12),
    }}
  >
    <span style={{ fontWeight: 600, fontSize: size * 0.5, opacity: 0.9, marginRight: size * 0.1 }}>{COPY.followUs}</span>
    {(["facebook", "instagram", "tiktok"] as const).map((n, i) => (
      <div key={n} style={{ transform: `scale(${pop(f, delay + 3 + i * 4)})` }}>
        <SocialIcon network={n} size={size} />
      </div>
    ))}
    <div style={{ width: 2, height: size * 0.7, background: "rgba(255,255,255,0.35)", margin: `0 ${size * 0.25}px` }} />
    <span style={{ fontWeight: 600, fontSize: size * 0.5 }}>{COPY.site}</span>
  </div>
);

export const CtaScene: React.FC = () => {
  const f = useCurrentFrame();
  const logo = pop(f, 0, 11, 120);
  const tagline = ease(f, 10, 24);
  return (
    <AbsoluteFill>
      <TropicalBackground variant="deep" />
      <AbsoluteFill style={{ alignItems: "center", fontFamily: FONT }}>
        <div style={{ marginTop: 80, transform: `scale(${logo})`, filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.3))" }}>
          <Logo width={760} color="#fff" />
        </div>
        <div
          style={{
            marginTop: 6,
            fontWeight: 600,
            fontSize: 44,
            color: COLORS.lagoonLight,
            opacity: tagline,
            transform: `translateY(${(1 - tagline) * 20}px)`,
          }}
        >
          {COPY.tagline}
        </div>
        <div style={{ marginTop: 44 }}>
          <CtaButton f={f} delay={16} />
        </div>
        <div style={{ marginTop: 44 }}>
          <StoreBadges f={f} delay={26} />
        </div>
        <div style={{ marginTop: 40 }}>
          <SocialRow f={f} delay={36} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
