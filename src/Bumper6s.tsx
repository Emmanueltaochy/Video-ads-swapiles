import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { COLORS, COPY, CUES_6S as C, FONT, T6, VOICE_6S } from "./config";
import { clamp, out, pop } from "./components/anim";
import { TropicalBackground } from "./components/Background";
import { Chip } from "./components/Badges";
import { Camera, Confetti, KineticText, TapHand } from "./components/Fx";
import { Icon, IconName } from "./components/Icons";
import { Logo } from "./components/Logo";
import { Phone, Screenshot } from "./components/Phone";
import { Sfx, Soundtrack } from "./components/Soundtrack";
import { WaveReveal } from "./components/Wave";
import { CtaButton, SocialRow, StoreBadges } from "./scenes/CtaScene";

const WAVE = 10;

/** 0 – 2,3 s : le problème, balayé d'un « Oublie ! » */
const Problem: React.FC = () => {
  const f = useCurrentFrame();
  const strike = interpolate(f, [C.forget - 8, C.forget], [0, 1], clamp);
  const forget = pop(f, C.forget, 8, 240);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(110% 90% at 50% 20%, #1d3b45 0%, #10242c 55%, #08151a 100%)" }}>
      <Camera duration={T6.pitch} zoom={[1.1, 1]} punches={[C.delays]} shakeAt={[C.forget]}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
          <div style={{ position: "absolute", left: 150, top: 62 }}>
            <Logo width={250} color="#fff" />
          </div>
          <div style={{ display: "flex", gap: 40, marginTop: -140 }}>
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
                  transform: `scale(${pop(f, [0, 4, C.delays][i], 9, 200)}) rotate(${Math.sin(f / 3 + i) * 7}deg)`,
                }}
              >
                <Icon name={n} size={84} color={i === 0 ? "#5a3410" : "#fff"} strokeWidth={2} />
              </div>
            ))}
          </div>
          <div style={{ position: "relative", marginTop: 60 }}>
            <KineticText
              text={COPY.bumperHook}
              at={[0, 3, 6, 9, C.delays, C.delays + 3]}
              style={{ fontWeight: 800, fontSize: 104, color: "#fff", letterSpacing: -2 }}
            />
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
              fontSize: 120,
              color: COLORS.sun,
              transform: `scale(${forget}) rotate(${-4 + (1 - forget) * -20}deg)`,
              textShadow: "0 10px 30px rgba(0,0,0,0.35)",
            }}
          >
            {COPY.bumperForget}
          </div>
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};

/** 2,3 – 4,4 s : l'app + le pitch */
const Pitch: React.FC = () => {
  const f = useCurrentFrame();
  const L = (abs: number) => abs - T6.pitch;
  const phone = pop(f, 0, 12, 140);
  const chips: IconName[] = ["card", "store", "palm"];
  return (
    <AbsoluteFill>
      <TropicalBackground variant="deep" />
      <Camera duration={T6.cta - T6.pitch + WAVE} zoom={[1, 1.06]} punches={[L(C.sell), L(C.reunion)]}>
        <div style={{ position: "absolute", left: 150, top: 62 }}>
          <Logo width={250} color="#fff" />
        </div>
        <div
          style={{
            position: "absolute",
            left: 1330,
            top: 60,
            perspective: 1600,
            transform: `translateY(${(1 - phone) * 700 + Math.sin(f / 10) * 8}px)`,
          }}
        >
          <div style={{ transform: `rotateY(-12deg) rotateZ(${3 + (1 - phone) * 25}deg)` }}>
            <Phone width={370} navActive={0}>
              <Screenshot src="screens/annonce.png" />
            </Phone>
          </div>
        </div>
        <div style={{ position: "absolute", left: 150, top: 290 }}>
          <KineticText
            text={COPY.bumperPitch}
            at={[L(C.buy), L(C.sell), L(C.give), L(C.give) + 2, L(C.reunion) - 2, L(C.reunion), L(C.reunion) + 2]}
            highlight={["Réunion"]}
            style={{ fontWeight: 800, fontSize: 92, color: "#fff", lineHeight: 1.05, letterSpacing: -2 }}
          />
          <div style={{ display: "flex", gap: 18, marginTop: 50 }}>
            {COPY.bumperChips.map((c, i) => {
              const s = pop(f, L(C.reunion) + 4 + i * 5, 8, 220);
              return (
                <div key={c} style={{ transform: `scale(${s}) rotate(${(1 - s) * -15}deg)` }}>
                  <Chip icon={chips[i]} label={c} size={32} />
                </div>
              );
            })}
          </div>
        </div>
      </Camera>
    </AbsoluteFill>
  );
};

/** 4,4 – 6 s : logo + appel à l'action */
const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const logo = pop(f, C.brand - T6.cta - 4, 9, 160);
  return (
    <AbsoluteFill>
      <TropicalBackground variant="deep" />
      <Camera duration={T6.end - T6.cta} zoom={[1.05, 1]} punches={[C.brand - T6.cta]}>
        <AbsoluteFill style={{ alignItems: "center", fontFamily: FONT }}>
          <div style={{ marginTop: 95, transform: `scale(${logo}) rotate(${(1 - logo) * 12}deg)` }}>
            <Logo width={680} color="#fff" />
          </div>
          <div style={{ marginTop: 40 }}>
            <CtaButton f={f} delay={4} fontSize={52} tapAt={26} />
          </div>
          <div style={{ marginTop: 44 }}>
            <StoreBadges f={f} delay={10} height={88} />
          </div>
          <div style={{ marginTop: 38 }}>
            <SocialRow f={f} delay={16} size={52} />
          </div>
        </AbsoluteFill>
        <TapHand x={1360} y={470} at={26} />
        <Confetti at={C.brand - T6.cta} x={960} y={220} count={70} seed="bcta" />
      </Camera>
    </AbsoluteFill>
  );
};

const SFX: Sfx[] = [
  { name: "pop", at: 2, volume: 0.6 },
  { name: "pop", at: C.delays, volume: 0.7 },
  { name: "thud", at: C.forget, volume: 0.9 },
  { name: "whoosh", at: T6.pitch - 6 },
  { name: "pop", at: C.sell, volume: 0.6 },
  ...[0, 1, 2].map((i) => ({ name: "pop" as const, at: C.reunion + 4 + i * 5, volume: 0.6 })),
  { name: "whoosh", at: T6.cta - 6 },
  { name: "pop", at: C.brand },
  { name: "pop", at: T6.cta + 26, volume: 0.8 },
];

/** Bumper YouTube 6 s (non désactivable). */
export const Bumper6s: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0a3f37" }}>
      <Sequence durationInFrames={T6.pitch + WAVE} name="Problème">
        <AbsoluteFill style={{ opacity: out(f, T6.pitch + WAVE - 3, T6.pitch + WAVE) }}>
          <Problem />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={T6.pitch} durationInFrames={T6.cta - T6.pitch + WAVE} name="Pitch">
        <WaveReveal start={0} duration={WAVE}>
          <Pitch />
        </WaveReveal>
      </Sequence>
      <Sequence from={T6.cta} name="Appel à l'action">
        <WaveReveal start={0} duration={WAVE}>
          <Cta />
        </WaveReveal>
      </Sequence>
      <Soundtrack music="audio/music-6s.wav" voice={VOICE_6S} sfx={SFX} />
    </AbsoluteFill>
  );
};
