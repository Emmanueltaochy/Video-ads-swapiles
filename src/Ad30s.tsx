import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { CUES_30S as C, T30, VOICE_30S } from "./config";
import { Sfx, Soundtrack } from "./components/Soundtrack";
import { WaveReveal } from "./components/Wave";
import { BENEFIT_TIMES, BenefitsScene, MONEY_DING } from "./scenes/BenefitsScene";
import { CTA_TAP, CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { StepsScene } from "./scenes/StepsScene";

const WAVE = 12; // durée de la vague de transition

const SFX: Sfx[] = [
  { name: "pop", at: C.shipping, volume: 0.7 },
  { name: "pop", at: C.delay, volume: 0.7 },
  { name: "thud", at: C.stamp, volume: 0.9 },
  { name: "whoosh", at: T30.reveal - 6 },
  { name: "whoosh", at: T30.step1 - 4, volume: 0.8 },
  { name: "shutter", at: C.shoot },
  { name: "pop", at: C.online },
  { name: "whoosh", at: T30.step2 - 4, volume: 0.6 },
  { name: "notif", at: C.sell },
  ...[C.swap, C.give, C.card, C.cash].map((at) => ({ name: "pop" as const, at, volume: 0.8 })),
  { name: "whoosh", at: C.pay - 3, volume: 0.5 },
  { name: "whoosh", at: T30.step3 - 4, volume: 0.6 },
  { name: "pop", at: C.relay },
  ...[0, 1, 2, 3].map((i) => ({ name: "pop" as const, at: C.relay + 6 + i * 7, volume: 0.6 })),
  { name: "thud", at: C.sold, volume: 0.8 },
  { name: "ding", at: C.sold + 4 },
  { name: "whoosh", at: T30.benefits - 4 },
  ...BENEFIT_TIMES.map((t) => ({ name: "pop" as const, at: T30.benefits + t })),
  { name: "ding", at: T30.benefits + MONEY_DING },
  { name: "whoosh", at: T30.stats - 2, volume: 0.6 },
  { name: "pop", at: C.ads },
  { name: "pop", at: C.users },
  { name: "whoosh", at: T30.cta - 4 },
  { name: "pop", at: T30.cta + CTA_TAP, volume: 1 },
  { name: "pop", at: C.appStore, volume: 0.7 },
  { name: "pop", at: C.googlePlay, volume: 0.7 },
];

/** Pub YouTube in-stream 30 s (désactivable après 5 s). */
export const Ad30s: React.FC = () => (
  <AbsoluteFill style={{ background: "#0a3f37" }}>
    <Sequence from={T30.hook} durationInFrames={T30.step1 - T30.hook} name="Accroche + logo">
      <HookScene />
    </Sequence>
    <Sequence from={T30.step1} durationInFrames={T30.benefits - T30.step1 + WAVE} name="3 étapes">
      <StepsScene />
    </Sequence>
    <Sequence from={T30.benefits} durationInFrames={T30.cta - T30.benefits + WAVE} name="Bénéfices + chiffres">
      <WaveReveal start={0} duration={WAVE}>
        <BenefitsScene />
      </WaveReveal>
    </Sequence>
    <Sequence from={T30.cta} durationInFrames={T30.end - T30.cta} name="Appel à l'action">
      <WaveReveal start={0} duration={WAVE}>
        <CtaScene />
      </WaveReveal>
    </Sequence>
    <Soundtrack music="audio/music-30s.wav" voice={VOICE_30S} sfx={SFX} />
  </AbsoluteFill>
);
