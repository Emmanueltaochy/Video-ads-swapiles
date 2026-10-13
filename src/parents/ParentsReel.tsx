import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { Sfx, Soundtrack } from "../components/Soundtrack";
import { WaveReveal } from "../components/Wave";
import { COMPARE, CP, RECEIPT, TP, VOICE_PARENTS } from "./config";
import { CostP, HeartP, HookP } from "./ScenesA";
import { CompareP, CtaP, SellP, SolutionP } from "./ScenesB";

const T = 10; // durée des transitions (frames)

/** Transition « whip » : la scène suivante arrive d'en bas en pivotant. */
const Whip: React.FC<{ children: React.ReactNode; dir?: 1 | -1 }> = ({ children, dir = 1 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, T], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 0.9, 0.3, 1) });
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - p) * 110}%) rotate(${(1 - p) * 8 * dir}deg) scale(${0.9 + 0.1 * p})`, transformOrigin: "50% 100%" }}>
      {children}
    </AbsoluteFill>
  );
};

const SFX: Sfx[] = [
  { name: "pop", at: CP.reunion },
  { name: "thud", at: CP.expensive, volume: 0.9 },
  ...[0, 2, 4, 6, 8].map((i) => ({ name: "pop" as const, at: CP.expensive + i * 2, volume: 0.45 })),
  ...[0, 7, 14].map((i) => ({ name: "pop" as const, at: CP.grow + i, volume: 0.7 })),
  { name: "whoosh", at: TP.cost - 4 },
  ...RECEIPT.map((r) => ({ name: "pop" as const, at: r.at, volume: 0.7 })),
  { name: "ding", at: CP.always + 2, volume: 0.8 },
  { name: "whoosh", at: TP.heart - 4, volume: 0.7 },
  { name: "pop", at: CP.child, volume: 0.7 },
  { name: "whoosh", at: TP.solution - 6 },
  { name: "pop", at: CP.brand },
  ...[CP.cheap, CP.kidStuff, CP.baby].map((at) => ({ name: "pop" as const, at, volume: 0.6 })),
  { name: "whoosh", at: TP.compare - 4, volume: 0.7 },
  ...COMPARE.map((c) => ({ name: "pop" as const, at: c.at + 10, volume: 0.7 })),
  { name: "ding", at: CP.likeNew + 6 },
  { name: "thud", at: CP.pei, volume: 0.8 },
  { name: "whoosh", at: TP.sell - 4, volume: 0.7 },
  { name: "pop", at: CP.tooSmall },
  { name: "shutter", at: CP.sellIt },
  { name: "ding", at: CP.sellIt + 10 },
  { name: "whoosh", at: TP.cta - 6 },
  { name: "pop", at: TP.cta + 38 },
  { name: "pop", at: TP.cta + 14, volume: 0.6 },
];

/** Reel vertical « Parents » : vie chère + articles enfant / bébé à petit prix. */
export const ParentsReel: React.FC = () => (
  <AbsoluteFill style={{ background: "#0a3f37" }}>
    <Sequence from={TP.hook} durationInFrames={TP.cost - TP.hook + T} name="Accroche · vie chère">
      <HookP />
    </Sequence>
    <Sequence from={TP.cost} durationInFrames={TP.heart - TP.cost + T} name="Tout racheter">
      <Whip>
        <CostP />
      </Whip>
    </Sequence>
    <Sequence from={TP.heart} durationInFrames={TP.solution - TP.heart + T} name="Ton enfant">
      <Whip dir={-1}>
        <HeartP />
      </Whip>
    </Sequence>
    <Sequence from={TP.solution} durationInFrames={TP.compare - TP.solution + T} name="Swap'Îles">
      <WaveReveal start={0} duration={12}>
        <SolutionP />
      </WaveReveal>
    </Sequence>
    <Sequence from={TP.compare} durationInFrames={TP.sell - TP.compare + T} name="Neuf vs Swap'Îles">
      <Whip>
        <CompareP />
      </Whip>
    </Sequence>
    <Sequence from={TP.sell} durationInFrames={TP.cta - TP.sell + T} name="Vends à ton tour">
      <Whip dir={-1}>
        <SellP />
      </Whip>
    </Sequence>
    <Sequence from={TP.cta} durationInFrames={TP.end - TP.cta} name="Appel à l'action">
      <WaveReveal start={0} duration={12}>
        <CtaP />
      </WaveReveal>
    </Sequence>
    <Soundtrack music="audio/music-parents.wav" voice={VOICE_PARENTS} sfx={SFX} />
  </AbsoluteFill>
);
