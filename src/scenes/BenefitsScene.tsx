import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, COPY, FONT } from "../config";
import { clamp, ease, formatNumber, pop } from "../components/anim";
import { TropicalBackground } from "../components/Background";
import { Icon, IconName } from "../components/Icons";
import { Logo } from "../components/Logo";

/** Frames (dans la scène) où chaque carte apparaît, calées sur la voix off. */
export const BENEFIT_TIMES = [8, 42, 72];
export const MONEY_DING = 36;

const ICONS: IconName[] = ["coins", "palm", "recycle"];
const ICON_BG = [COLORS.sun, COLORS.lagoon, "#7cc576"];

const Card: React.FC<{ i: number; f: number }> = ({ i, f }) => {
  const b = COPY.benefits[i];
  const s = pop(f, BENEFIT_TIMES[i], 11, 150);
  const float = Math.sin((f + i * 20) / 18) * 6;
  const money = Math.round(interpolate(f, [BENEFIT_TIMES[0] + 6, MONEY_DING], [0, COPY.moneyCounter], clamp));
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
        transform: `translateY(${(1 - s) * 120 + float}px) scale(${0.6 + 0.4 * s})`,
        opacity: Math.min(1, s * 1.4),
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
          transform: `rotate(${(1 - s) * -30}deg)`,
          boxShadow: "0 14px 30px rgba(0,0,0,0.15)",
        }}
      >
        <Icon name={ICONS[i]} size={88} color={i === 0 ? COLORS.deep : "#fff"} strokeWidth={2} />
      </div>
      <div style={{ marginTop: 34, fontWeight: 800, fontSize: 50, color: COLORS.deep, letterSpacing: -1, textAlign: "center", lineHeight: 1.05 }}>
        {b.title}
      </div>
      <div style={{ marginTop: 14, fontWeight: 500, fontSize: 30, color: "#4d625d", textAlign: "center", lineHeight: 1.3, whiteSpace: "pre-line" }}>
        {b.sub}
      </div>
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
            transform: `rotate(8deg) scale(${pop(f, BENEFIT_TIMES[0] + 6)})`,
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
  const title = ease(f, 0, 16);
  return (
    <AbsoluteFill>
      <TropicalBackground variant="lagoon" />
      <div style={{ position: "absolute", left: 150, top: 62, opacity: title }}>
        <Logo width={250} color="#fff" />
      </div>
      <AbsoluteFill style={{ alignItems: "center", fontFamily: FONT }}>
        <div style={{ display: "flex", gap: 56, marginTop: 200 }}>
          {[0, 1, 2].map((i) => (
            <Card key={i} i={i} f={f} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 30, marginTop: 50 }}>
          {COPY.stats.map((st, i) => {
            const start = 92 + i * 8;
            const v = interpolate(f, [start, start + 26], [0, st.value], clamp);
            const s = pop(f, start);
            return (
              <div
                key={st.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "14px 36px 14px 18px",
                  borderRadius: 60,
                  background: COLORS.deep,
                  color: "#fff",
                  transform: `scale(${s})`,
                  boxShadow: "0 14px 34px rgba(0,0,0,0.25)",
                }}
              >
                <div style={{ width: 58, height: 58, borderRadius: "50%", background: "rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={i === 0 ? "tag" : "users"} size={34} color={COLORS.sun} strokeWidth={2.3} />
                </div>
                <span style={{ fontWeight: 900, fontSize: 46, color: COLORS.sun }}>
                  {st.prefix}
                  {formatNumber(v)}
                </span>
                <span style={{ fontWeight: 600, fontSize: 36 }}>{st.label}</span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
