import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { COLORS, COPY, FONT, VOICE_6S } from "./config";
import { clamp, ease, out, pop } from "./components/anim";
import { TropicalBackground } from "./components/Background";
import { Chip } from "./components/Badges";
import { Icon, IconName } from "./components/Icons";
import { Logo } from "./components/Logo";
import { Phone, Screenshot } from "./components/Phone";
import { Sfx, Soundtrack } from "./components/Soundtrack";
import { WaveReveal } from "./components/Wave";
import { CtaButton, SocialRow, StoreBadges } from "./scenes/CtaScene";

const PITCH_AT = 62; // 2,07 s
const CTA_AT = 122; // 4,07 s

/** 0 – 2 s : le problème, balayé d'un "Oublie !" */
const Problem: React.FC = () => {
  const f = useCurrentFrame();
  const t = ease(f, 0, 10);
  const strike = interpolate(f, [34, 44], [0, 1], clamp);
  const forget = pop(f, 40, 9, 200);
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(110% 90% at 50% 20%, #1d3b45 0%, #10242c 55%, #08151a 100%)",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT,
      }}
    >
      <div style={{ position: "absolute", left: 150, top: 62 }}>
        <Logo width={250} color="#fff" />
      </div>
      <div style={{ display: "flex", gap: 40, marginTop: -140, opacity: t }}>
        {(["box", "euro", "clock"] as IconName[]).map((n, i) => (
          <div
            key={n}
            style={{
              width: 130,
              height: 130,
              borderRadius: 36,
              background: i === 0 ? "#d39b5b" : COLORS.coral,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${pop(f, i * 4)}) rotate(${Math.sin(f / 4 + i) * 5}deg)`,
            }}
          >
            <Icon name={n} size={84} color={i === 0 ? "#5a3410" : "#fff"} strokeWidth={2} />
          </div>
        ))}
      </div>
      <div style={{ position: "relative", marginTop: 60 }}>
        <div
          style={{
            fontWeight: 800,
            fontSize: 104,
            color: "#fff",
            letterSpacing: -2,
            opacity: t,
            transform: `translateY(${(1 - t) * 30}px)`,
          }}
        >
          {COPY.bumperHook}
        </div>
        <div
          style={{
            position: "absolute",
            left: -20,
            top: "52%",
            height: 14,
            width: `calc((100% + 40px) * ${strike})`,
            opacity: strike > 0 ? 1 : 0,
            background: COLORS.coral,
            borderRadius: 10,
            transform: "rotate(-3deg)",
          }}
        />
      </div>
      <div
        style={{
          marginTop: 30,
          fontWeight: 900,
          fontSize: 110,
          color: COLORS.sun,
          transform: `scale(${forget}) rotate(-4deg)`,
          textShadow: "0 10px 30px rgba(0,0,0,0.35)",
        }}
      >
        {COPY.bumperForget}
      </div>
    </AbsoluteFill>
  );
};

/** 2 – 4 s : l'app + le pitch */
const Pitch: React.FC = () => {
  const f = useCurrentFrame();
  const phone = pop(f, 0, 14, 110);
  const text = ease(f, 6, 22);
  const chips: IconName[] = ["card", "store", "palm"];
  return (
    <AbsoluteFill>
      <TropicalBackground variant="deep" />
      <div style={{ position: "absolute", left: 150, top: 62 }}>
        <Logo width={250} color="#fff" />
      </div>
      <div
        style={{
          position: "absolute",
          left: 1330,
          top: 60,
          perspective: 1600,
          transform: `translateY(${(1 - phone) * 700 + Math.sin(f / 15) * 8}px)`,
        }}
      >
        <div style={{ transform: "rotateY(-12deg) rotateZ(3deg)" }}>
          <Phone width={370} navActive={0}>
            <Screenshot src="screens/annonce.png" />
          </Phone>
        </div>
      </div>
      <div style={{ position: "absolute", left: 150, top: 290, fontFamily: FONT }}>
        <div
          style={{
            fontWeight: 800,
            fontSize: 92,
            color: "#fff",
            lineHeight: 1.05,
            letterSpacing: -2,
            whiteSpace: "pre-line",
            opacity: text,
            transform: `translateX(${(1 - text) * -50}px)`,
          }}
        >
          {COPY.bumperPitch}
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 50 }}>
          {COPY.bumperChips.map((c, i) => (
            <div key={c} style={{ transform: `scale(${pop(f, 18 + i * 7)})` }}>
              <Chip icon={chips[i]} label={c} size={32} />
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** 4 – 6 s : logo + appel à l'action */
const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const logo = pop(f, 0, 11, 130);
  return (
    <AbsoluteFill>
      <TropicalBackground variant="deep" />
      <AbsoluteFill style={{ alignItems: "center", fontFamily: FONT }}>
        <div style={{ marginTop: 95, transform: `scale(${logo})` }}>
          <Logo width={680} color="#fff" />
        </div>
        <div style={{ marginTop: 40 }}>
          <CtaButton f={f} delay={4} fontSize={52} />
        </div>
        <div style={{ marginTop: 44 }}>
          <StoreBadges f={f} delay={10} height={88} />
        </div>
        <div style={{ marginTop: 38 }}>
          <SocialRow f={f} delay={14} size={52} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SFX: Sfx[] = [
  { name: "thud", at: 40, volume: 1.1 },
  { name: "whoosh", at: PITCH_AT - 6 },
  ...[0, 1, 2].map((i) => ({ name: "pop" as const, at: PITCH_AT + 18 + i * 7, volume: 0.7 })),
  { name: "whoosh", at: CTA_AT - 6 },
  { name: "pop", at: CTA_AT + 4 },
];

/** Bumper YouTube 6 s (non désactivable). */
export const Bumper6s: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0a3f37" }}>
      <Sequence durationInFrames={PITCH_AT + 16} name="0-2 s · Problème">
        <AbsoluteFill style={{ opacity: out(f, PITCH_AT + 12, PITCH_AT + 16) }}>
          <Problem />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={PITCH_AT} durationInFrames={CTA_AT - PITCH_AT + 16} name="2-4 s · Pitch">
        <WaveReveal start={0} duration={14}>
          <Pitch />
        </WaveReveal>
      </Sequence>
      <Sequence from={CTA_AT} name="4-6 s · Appel à l'action">
        <WaveReveal start={0} duration={14}>
          <Cta />
        </WaveReveal>
      </Sequence>
      <Soundtrack music="audio/music-6s.wav" voice={VOICE_6S} sfx={SFX} />
    </AbsoluteFill>
  );
};
