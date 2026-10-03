import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, COPY, FONT } from "../config";
import { clamp, ease, out, pop } from "../components/anim";
import { TropicalBackground } from "../components/Background";
import { Chip } from "../components/Badges";
import { Icon } from "../components/Icons";
import { Logo } from "../components/Logo";
import { WaveReveal } from "../components/Wave";

/** Moment où la vague révèle Swap'Îles (en frames, dans la scène). */
export const HOOK_REVEAL = 97;

const A = { x: 330, y: 560 }; // Métropole
const B = { x: 1590, y: 600 }; // La Réunion
const C = { x: 960, y: 230 }; // point de contrôle de l'arc
const arc = (t: number) => ({
  x: (1 - t) ** 2 * A.x + 2 * (1 - t) * t * C.x + t ** 2 * B.x,
  y: (1 - t) ** 2 * A.y + 2 * (1 - t) * t * C.y + t ** 2 * B.y,
});

const Place: React.FC<{ x: number; y: number; label: string; delay: number; color: string }> = ({
  x,
  y,
  label,
  delay,
  color,
}) => {
  const frame = useCurrentFrame();
  const s = pop(frame, delay);
  return (
    <div
      style={{
        position: "absolute",
        left: x - 150,
        top: y - 70,
        width: 300,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `scale(${s})`,
        transformOrigin: "50% 70px",
      }}
    >
      <Icon name="pin" size={70} color={color} strokeWidth={2.4} />
      <div style={{ marginTop: 14, fontFamily: FONT, fontWeight: 700, fontSize: 34, color: "#fff" }}>{label}</div>
    </div>
  );
};

const CounterCard: React.FC<{
  x: number;
  icon: "euro" | "clock";
  label: string;
  value: string;
  delay: number;
}> = ({ x, icon, label, value, delay }) => {
  const frame = useCurrentFrame();
  const s = pop(frame, delay, 11);
  const shake = frame > 62 && frame < 80 ? Math.sin(frame * 2.2) * 6 * (1 - (frame - 62) / 18) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 680,
        width: 500,
        height: 150,
        borderRadius: 32,
        background: "rgba(255,255,255,0.08)",
        border: "2px solid rgba(255,255,255,0.18)",
        display: "flex",
        alignItems: "center",
        gap: 26,
        padding: "0 34px",
        transform: `scale(${s}) translateX(${shake}px)`,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 26,
          background: COLORS.coral,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={icon} size={54} color="#fff" strokeWidth={2.6} />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 30, fontWeight: 500 }}>{label}</span>
        <span style={{ color: "#fff", fontSize: 54, fontWeight: 800, lineHeight: 1.05, whiteSpace: "nowrap" }}>{value}</span>
      </div>
    </div>
  );
};

const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const title = ease(frame, 2, 14);
  // Le colis avance... beaucoup trop lentement
  const t = interpolate(frame, [8, 100], [0.02, 0.5], clamp);
  const p = arc(t);
  const p2 = arc(t + 0.01);
  const angle = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;
  const shipping = Math.round(interpolate(frame, [18, 52], [0, 25], clamp));
  const days = Math.round(interpolate(frame, [26, 60], [1, 21], clamp));
  const stamp = pop(frame, 60, 9, 220);
  const stampScale = interpolate(stamp, [0, 1], [2.4, 1]);

  let dash = `M ${A.x} ${A.y}`;
  for (let i = 1; i <= 60; i++) {
    const q = arc(i / 60);
    dash += ` L ${q.x} ${q.y}`;
  }

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(110% 90% at 50% 20%, #1d3b45 0%, #10242c 55%, #08151a 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 90,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 92,
          color: "#fff",
          letterSpacing: -1.5,
          opacity: title,
          transform: `translateY(${(1 - title) * 40}px)`,
          textShadow: "0 8px 30px rgba(0,0,0,0.35)",
        }}
      >
        {COPY.hookQuestion}
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path
          d={dash}
          fill="none"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth={5}
          strokeDasharray="4 22"
          strokeLinecap="round"
          strokeDashoffset={-frame * 1.5}
        />
      </svg>
      <Place x={A.x} y={A.y} label="Métropole" delay={4} color="#9fb3bb" />
      <Place x={B.x} y={B.y} label={COPY.territory} delay={8} color={COLORS.lagoon} />
      {/* colis */}
      <div
        style={{
          position: "absolute",
          left: p.x - 60,
          top: p.y - 60 + Math.sin(frame / 5) * 5,
          width: 120,
          height: 120,
          borderRadius: 30,
          background: "#d39b5b",
          boxShadow: "0 15px 30px rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `rotate(${angle * 0.3 + (frame > 62 ? Math.sin(frame * 1.7) * 8 : 0)}deg) scale(${pop(frame, 6)})`,
        }}
      >
        <Icon name="box" size={84} color="#5a3410" strokeWidth={1.8} />
      </div>
      <CounterCard x={400} icon="euro" label={COPY.hookShipping} value={`+${shipping} €`} delay={16} />
      <CounterCard x={1020} icon="clock" label={COPY.hookDelay} value={days >= 21 ? COPY.hookDelayValue : `${days} jour${days > 1 ? "s" : ""}`} delay={24} />
      {/* tampon */}
      {frame >= 60 && (
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 445,
            transform: `translate(-50%, -50%) rotate(-8deg) scale(${stampScale})`,
            opacity: Math.min(1, stamp * 1.5),
            border: `10px solid ${COLORS.coral}`,
            borderRadius: 26,
            padding: "14px 46px",
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 76,
            color: COLORS.coral,
            textTransform: "uppercase",
            letterSpacing: 2,
            background: "rgba(16,36,44,0.85)",
            whiteSpace: "nowrap",
            boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
          }}
        >
          {COPY.hookStamp}
        </div>
      )}
    </AbsoluteFill>
  );
};

const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const f = frame - HOOK_REVEAL;
  const logo = pop(f, 6, 10, 120);
  const answer = ease(f, 18, 32);
  const chip = pop(f, 28);
  const leave = out(frame, 140, 150);
  return (
    <AbsoluteFill>
      <TropicalBackground variant="deep" />
      <AbsoluteFill style={{ alignItems: "center", fontFamily: FONT, opacity: leave, transform: `scale(${0.9 + 0.1 * leave})` }}>
        <div style={{ marginTop: 170, transform: `scale(${logo})`, filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.3))" }}>
          <Logo width={900} color="#fff" />
        </div>
        <div
          style={{
            marginTop: 40,
            fontWeight: 800,
            fontSize: 84,
            color: "#fff",
            letterSpacing: -1,
            opacity: answer,
            transform: `translateY(${(1 - answer) * 40}px)`,
            textShadow: "0 8px 30px rgba(0,0,0,0.3)",
          }}
        >
          {COPY.hookAnswer}
        </div>
        <div style={{ marginTop: 34, transform: `scale(${chip})` }}>
          <Chip icon="pin" label={COPY.territory} size={38} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const HookScene: React.FC = () => (
  <AbsoluteFill>
    <Problem />
    <WaveReveal start={HOOK_REVEAL - 6} duration={16}>
      <Reveal />
    </WaveReveal>
  </AbsoluteFill>
);
