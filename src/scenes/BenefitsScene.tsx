import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, COPY, CUES_30S, FONT, FPS, GROOVE_START_30S, T30 } from "../config";
import { clamp, formatNumber, out, pop } from "../components/anim";
import { TropicalBackground } from "../components/Background";
import { Camera, Confetti } from "../components/Fx";
import { Icon, IconName } from "../components/Icons";
import { Logo } from "../components/Logo";

const L = (abs: number) => abs - T30.benefits;
export const BENEFITS_DURATION = L(T30.cta);
/** Frames (dans la scène) où chaque carte apparaît, calées sur la voix off. */
export const BENEFIT_TIMES = [L(CUES_30S.money), L(CUES_30S.local), L(CUES_30S.eco)];
export const MONEY_DING = BENEFIT_TIMES[0] + 24;
const STATS = L(T30.stats);
const STAT_TIMES = [L(CUES_30S.ads), L(CUES_30S.users)];

const ICONS: IconName[] = ["coins", "palm", "recycle"];
const ICON_BG = [COLORS.sun, COLORS.lagoon, "#7cc576"];

const Card: React.FC<{ i: number; f: number }> = ({ i, f }) => {
  const b = COPY.benefits[i];
  const s = pop(f, BENEFIT_TIMES[i], 10, 170);
  const float = Math.sin((f + i * 20) / 16) * 6;
  const money = Math.round(interpolate(f, [BENEFIT_TIMES[0] + 4, MONEY_DING], [0, COPY.moneyCounter], clamp));
  const iconSpin = pop(f, BENEFIT_TIMES[i] + 4, 8, 200);
  return (
    <div
      style={{
        width: 470,
        height: 440,
        borderRadius: 44,
        background: "#fff",
        boxShadow: "0 30px 70px rgba(0,30,25,0.30)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "44px 30px 0",
        transform: `translateY(${(1 - s) * 260 + float}px) rotate(${(1 - s) * (i - 1) * 25}deg) scale(${0.5 + 0.5 * s})`,
        opacity: Math.min(1, s * 1.6),
        fontFamily: FONT,
        position: "relative",
      }}
    >
      <div
        style={{
          width: 140,
          height: 140,
          borderRadius: 42,
          background: ICON_BG[i],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `rotate(${(1 - iconSpin) * -90}deg) scale(${0.6 + 0.4 * iconSpin})`,
          boxShadow: "0 14px 30px rgba(0,0,0,0.15)",
        }}
      >
        <Icon name={ICONS[i]} size={88} color={i === 0 ? COLORS.deep : "#fff"} strokeWidth={2} />
      </div>
      <div style={{ marginTop: 34, fontWeight: 800, fontSize: 50, color: COLORS.deep, letterSpacing: -1, textAlign: "center", lineHeight: 1.05 }}>{b.title}</div>
      <div style={{ marginTop: 14, fontWeight: 500, fontSize: 30, color: "#4d625d", textAlign: "center", lineHeight: 1.3, whiteSpace: "pre-line" }}>{b.sub}</div>
      {i === 0 && (
        <div
          style={{
            position: "absolute",
            top: -34,
            right: -26,
            padding: "12px 26px",
            borderRadius: 40,
            background: COLORS.coral,
            color: "#fff",
            fontWeight: 900,
            fontSize: 44,
            transform: `rotate(8deg) scale(${pop(f, BENEFIT_TIMES[0] + 4) * (f >= MONEY_DING && f < MONEY_DING + 8 ? 1.15 : 1)})`,
            boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
          }}
        >
          +{money} €
        </div>
      )}
    </div>
  );
};

export const BenefitsScene: React.FC = () => {
  const f = useCurrentFrame();
  const toStats = pop(f, STATS, 14, 120);
  const leave = out(f, BENEFITS_DURATION - 4, BENEFITS_DURATION);
  const groove = Math.round(GROOVE_START_30S * FPS) - T30.benefits;
  return (
    <AbsoluteFill>
      <TropicalBackground variant="lagoon" />
      <Camera duration={BENEFITS_DURATION} zoom={[1.03, 1]} punches={[...BENEFIT_TIMES, ...STAT_TIMES]} pulse={groove}>
        <div style={{ position: "absolute", left: 150, top: 62 }}>
          <Logo width={250} color="#fff" />
        </div>
        <AbsoluteFill style={{ alignItems: "center", fontFamily: FONT, opacity: leave }}>
          <div
            style={{
              display: "flex",
              gap: 56,
              marginTop: 200,
              transform: `translateY(${toStats * -50}px) scale(${1 - 0.22 * toStats})`,
              transformOrigin: "50% 0%",
            }}
          >
            {[0, 1, 2].map((i) => (
              <Card key={i} i={i} f={f} />
            ))}
          </div>
          <div style={{ position: "absolute", top: 600, display: "flex", gap: 40 }}>
            {COPY.stats.map((st, i) => {
              const start = STAT_TIMES[i];
              const v = interpolate(f, [start, start + 18], [0, st.value], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
              const s = pop(f, start - 2, 9, 200);
              return (
                <div
                  key={st.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    padding: "18px 46px 18px 22px",
                    borderRadius: 80,
                    background: COLORS.deep,
                    color: "#fff",
                    transform: `scale(${s}) rotate(${(1 - s) * (i ? 10 : -10)}deg)`,
                    opacity: Math.min(1, s * 2),
                    boxShadow: "0 18px 40px rgba(0,0,0,0.3)",
                  }}
                >
                  <div style={{ width: 84, height: 84, borderRadius: "50%", background: "rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={i === 0 ? "tag" : "users"} size={50} color={COLORS.sun} strokeWidth={2.3} />
                  </div>
                  <span style={{ fontWeight: 900, fontSize: 76, color: COLORS.sun, letterSpacing: -1 }}>
                    {st.prefix}
                    {formatNumber(v)}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: 50 }}>{st.label}</span>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
        <Confetti at={MONEY_DING} x={720} y={230} count={40} seed="money" spread={0.6} />
        <Confetti at={STAT_TIMES[1] + 16} x={960} y={680} count={80} seed="stats" />
      </Camera>
    </AbsoluteFill>
  );
};
