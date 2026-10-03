import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, COPY, CUES_30S, FONT, FPS, GROOVE_START_30S, T30 } from "../config";
import { ease, pop } from "../components/anim";
import { TropicalBackground } from "../components/Background";
import { Camera, Confetti, Sticker, TapHand } from "../components/Fx";
import { AppStoreBadge, GooglePlayBadge, SocialIcon } from "../components/Badges";
import { Logo } from "../components/Logo";

/** Bouton d'appel à l'action qui "respire". */
export const CtaButton: React.FC<{ f: number; delay: number; fontSize?: number; tapAt?: number }> = ({ f, delay, fontSize = 54, tapAt }) => {
  const s = pop(f, delay, 9, 180);
  const pressed = tapAt !== undefined && f >= tapAt && f < tapAt + 5 ? 0.92 : 1;
  const pulse = (1 + Math.max(0, Math.sin((f - delay - 15) / 6)) * 0.045) * pressed;
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

export const StoreBadges: React.FC<{ f: number; delay: number; delay2?: number; height?: number }> = ({ f, delay, delay2, height = 92 }) => (
  <div style={{ display: "flex", gap: 28 }}>
    <div style={{ transform: `scale(${pop(f, delay, 8, 200)}) rotate(${(1 - pop(f, delay, 8, 200)) * -12}deg)` }}>
      <AppStoreBadge height={height} />
    </div>
    <div style={{ transform: `scale(${pop(f, delay2 ?? delay + 6, 8, 200)}) rotate(${(1 - pop(f, delay2 ?? delay + 6, 8, 200)) * 12}deg)` }}>
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

const L = (abs: number) => abs - T30.cta;
export const CTA_TAP = 30;

export const CtaScene: React.FC = () => {
  const f = useCurrentFrame();
  const logo = pop(f, 0, 9, 150);
  const tagline = ease(f, 8, 20);
  const groove = Math.round(GROOVE_START_30S * FPS) - T30.cta;
  return (
    <AbsoluteFill>
      <TropicalBackground variant="deep" />
      <Camera duration={T30.end - T30.cta} zoom={[1.06, 1]} punches={[0, CTA_TAP, L(CUES_30S.appStore), L(CUES_30S.googlePlay)]} pulse={groove}>
        <AbsoluteFill style={{ alignItems: "center", fontFamily: FONT }}>
          <div style={{ marginTop: 80, transform: `scale(${logo}) rotate(${(1 - logo) * 12}deg)`, filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.3))" }}>
            <Logo width={760} color="#fff" />
          </div>
          <div style={{ marginTop: 6, fontWeight: 600, fontSize: 44, color: COLORS.lagoonLight, opacity: tagline, transform: `translateY(${(1 - tagline) * 20}px)` }}>
            {COPY.tagline}
          </div>
          <div style={{ marginTop: 44 }}>
            <CtaButton f={f} delay={L(CUES_30S.download)} tapAt={CTA_TAP} />
          </div>
          <div style={{ marginTop: 44 }}>
            <StoreBadges f={f} delay={L(CUES_30S.appStore)} delay2={L(CUES_30S.googlePlay)} />
          </div>
          <div style={{ marginTop: 40 }}>
            <SocialRow f={f} delay={L(CUES_30S.googlePlay) + 12} />
          </div>
        </AbsoluteFill>
        <TapHand x={1380} y={520} at={CTA_TAP} />
        <Sticker x={250} y={560} at={L(CUES_30S.googlePlay) + 20} icon="gift" label="100 % gratuit" color={COLORS.coral} tilt={-8} />
        <Sticker x={1680} y={330} at={L(CUES_30S.googlePlay) + 26} icon="palm" label="100 % péi" color={COLORS.lagoon} tilt={7} />
        <Confetti at={2} x={960} y={200} count={80} seed="cta" />
        <Confetti at={CTA_TAP + 2} x={1380} y={500} count={40} seed="tap" spread={0.6} />
      </Camera>
    </AbsoluteFill>
  );
};
