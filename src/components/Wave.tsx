import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../config";
import { useLayout } from "../layout";

/**
 * Transition "vague" : une vague verte monte du bas et recouvre l'écran,
 * révélant la scène `children` (qui est clippée par la vague).
 */
export const WaveReveal: React.FC<{
  start: number;
  duration?: number;
  children: React.ReactNode;
}> = ({ start, duration = 16, children }) => {
  const frame = useCurrentFrame();
  const { W, H } = useLayout();
  const p = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  if (p <= 0) return null;
  const amp = 60 * Math.sin(Math.PI * p);
  const level = (H + 140) * (1 - p) - 70;
  const mk = (offset: number, lvl: number) => {
    let d = `M 0 ${H} L 0 ${lvl}`;
    for (let x = 0; x <= W; x += 40) {
      d += ` L ${x} ${lvl + Math.sin(x / 190 + frame / 4 + offset) * amp}`;
    }
    return d + ` L ${W} ${H} Z`;
  };
  const id = `wave-${start}`;
  return (
    <>
      {/* écume devant la vague */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <svg width={W} height={H}>
          <path d={mk(1.3, level - 26)} fill={COLORS.lagoonLight} opacity={p < 1 ? 0.9 : 0} />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill>
        <svg width={0} height={0} style={{ position: "absolute" }}>
          <defs>
            <clipPath id={id}>
              <path d={mk(0, level)} />
            </clipPath>
          </defs>
        </svg>
        <AbsoluteFill style={{ clipPath: p >= 1 ? undefined : `url(#${id})` }}>{children}</AbsoluteFill>
      </AbsoluteFill>
    </>
  );
};
