import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SCENES_30S, VOICE_30S } from "./config";
import { Sfx, Soundtrack } from "./components/Soundtrack";
import { WaveReveal } from "./components/Wave";
import { BENEFIT_TIMES, BenefitsScene, MONEY_DING } from "./scenes/BenefitsScene";
import { CtaScene } from "./scenes/CtaScene";
import { HOOK_REVEAL, HookScene } from "./scenes/HookScene";
import { STEP_LEN, StepsScene } from "./scenes/StepsScene";

const { hook, steps, benefits, cta } = SCENES_30S;
const OVERLAP = 16; // durée de la vague de transition

const SFX: Sfx[] = [
  { name: "thud", at: hook.from + 60, volume: 0.9 },
  { name: "whoosh", at: hook.from + HOOK_REVEAL - 8 },
  { name: "whoosh", at: steps.from, volume: 0.8 },
  { name: "shutter", at: steps.from + 58, volume: 1 },
  { name: "pop", at: steps.from + 74 },
  { name: "whoosh", at: steps.from + STEP_LEN, volume: 0.6 },
  { name: "notif", at: steps.from + STEP_LEN + 30 },
  ...[0, 1, 2, 3].map((i) => ({ name: "pop" as const, at: steps.from + STEP_LEN + 40 + i * 9, volume: 0.8 })),
  { name: "whoosh", at: steps.from + STEP_LEN + 86, volume: 0.5 },
  { name: "whoosh", at: steps.from + 2 * STEP_LEN, volume: 0.6 },
  { name: "pop", at: steps.from + 2 * STEP_LEN + 30 },
  ...[0, 1, 2, 3].map((i) => ({ name: "pop" as const, at: steps.from + 2 * STEP_LEN + 50 + i * 10, volume: 0.7 })),
  { name: "whoosh", at: benefits.from - 4 },
  ...BENEFIT_TIMES.map((t) => ({ name: "pop" as const, at: benefits.from + t })),
  { name: "ding", at: benefits.from + MONEY_DING },
  { name: "whoosh", at: cta.from - 4 },
  { name: "pop", at: cta.from + 16 },
];

/** Pub YouTube in-stream 30 s (désactivable après 5 s). */
export const Ad30s: React.FC = () => (
  <AbsoluteFill style={{ background: "#0a3f37" }}>
    <Sequence from={hook.from} durationInFrames={hook.duration} name="0-5 s · Accroche">
      <HookScene />
    </Sequence>
    <Sequence from={steps.from} durationInFrames={steps.duration + OVERLAP} name="5-20 s · 3 étapes">
      <StepsScene />
    </Sequence>
    <Sequence from={benefits.from} durationInFrames={benefits.duration + OVERLAP} name="20-25 s · Bénéfices">
      <WaveReveal start={0} duration={OVERLAP}>
        <BenefitsScene />
      </WaveReveal>
    </Sequence>
    <Sequence from={cta.from} durationInFrames={cta.duration} name="25-30 s · Appel à l'action">
      <WaveReveal start={0} duration={OVERLAP}>
        <CtaScene />
      </WaveReveal>
    </Sequence>
    <Soundtrack music="audio/music-30s.wav" voice={VOICE_30S} sfx={SFX} />
  </AbsoluteFill>
);
