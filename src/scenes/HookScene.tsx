import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, COPY, CUES_30S as C, FONT, T30 } from "../config";
import { clamp, out, pop } from "../components/anim";
import { TropicalBackground } from "../components/Background";
import { Chip } from "../components/Badges";
import { Camera, Confetti, KineticText } from "../components/Fx";
import { Icon } from "../components/Icons";
import { Logo } from "../components/Logo";
import { WaveReveal } from "../components/Wave";

const DURATION = T30.step1 - T30.hook;

const A = { x: 330, y: 560 }; // Métropole
const B = { x: 1590, y: 600 }; // La Réunion
const CTRL = { x: 960, y: 230 };
const arc = (t: number) => ({
  x: (1 - t) ** 2 * A.x + 2 * (1 - t) * t * CTRL.x + t ** 2 * B.x,
  y: (1 - t) ** 2 * A.y + 2 * (1 - t) * t * CTRL.y + t ** 2 * B.y,
});

const Place: React.FC<{ x: number; y: number; label: string; delay: number; color: string }> = ({ x, y, label, delay, color }) => {
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

const CounterCard: React.FC<{ x: number; icon: "euro" | "clock"; label: string; value: string; delay: number }> = ({
  x,
  icon,
  label,
  value,
  delay,
}) => {
  const frame = useCurrentFrame();
  const s = pop(frame, delay, 9, 200);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 690,
        width: 500,
        height: 150,
        borderRadius: 32,
        background: "rgba(255,255,255,0.08)",
        border: "2px solid rgba(255,255,255,0.18)",
        display: "flex",
        alignItems: "center",
        gap: 26,
        padding: "0 34px",
        transform: `scale(${s}) rotate(${(1 - s) * 8}deg)`,
        fontFamily: FONT,
      }}
    >
      <div style={{ width: 88, height: 88, borderRadius: 26, background: COLORS.coral, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
  // Le colis avance... beaucoup trop lentement (et ralentit encore)
  const t = interpolate(frame, [4, 100], [0.02, 0.42], { ...clamp, easing: (x) => 1 - (1 - x) ** 2 });
  const p = arc(t);
  const p2 = arc(t + 0.01);
  const angle = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;
  const shipping = Math.round(interpolate(frame, [C.shipping, C.shipping + 22], [0, 25], clamp));
  const days = Math.round(interpolate(frame, [C.delay, C.delay + 18], [1, 21], clamp));
  const stamp = pop(frame, C.stamp, 9, 240);
  const stampScale = interpolate(stamp, [0, 1], [2.6, 1]);

  let dash = `M ${A.x} ${A.y}`;
  for (let i = 1; i <= 60; i++) {
    const q = arc(i / 60);
    dash += ` L ${q.x} ${q.y}`;
  }

  return (
    <AbsoluteFill style={{ background: "radial-gradient(110% 90% at 50% 20%, #1d3b45 0%, #10242c 55%, #08151a 100%)" }}>
      <Camera duration={110} zoom={[1.08, 1]} punches={[C.shipping, C.delay]} shakeAt={[C.stamp]}>
        <KineticText
          text={COPY.hookQuestion}
          at={[1, 4, 7, 12]}
          highlight={["métropole"]}
          highlightColor={COLORS.coral}
          style={{
            position: "absolute",
            top: 90,
            width: "100%",
            textAlign: "center",
            fontWeight: 800,
            fontSize: 92,
            color: "#fff",
            letterSpacing: -1.5,
            textShadow: "0 8px 30px rgba(0,0,0,0.35)",
          }}
        />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path d={dash} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={5} strokeDasharray="4 22" strokeLinecap="round" strokeDashoffset={-frame * 2} />
        </svg>
        <Place x={A.x} y={A.y} label="Métropole" delay={2} color="#9fb3bb" />
        <Place x={B.x} y={B.y} label={COPY.territory} delay={6} color={COLORS.lagoon} />
        <div
          style={{
            position: "absolute",
            left: p.x - 60,
            top: p.y - 60 + Math.sin(frame / 4) * 6,
            width: 120,
            height: 120,
            borderRadius: 30,
            background: "#d39b5b",
            boxShadow: "0 15px 30px rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `rotate(${angle * 0.3 + (frame > C.stamp ? Math.sin(frame * 1.7) * 10 : 0)}deg) scale(${pop(frame, 3)})`,
          }}
        >
          <Icon name="box" size={84} color="#5a3410" strokeWidth={1.8} />
        </div>
        <CounterCard x={400} icon="euro" label={COPY.hookShipping} value={`+${shipping} €`} delay={C.shipping} />
        <CounterCard x={1020} icon="clock" label={COPY.hookDelay} value={days >= 21 ? COPY.hookDelayValue : `${days} jour${days > 1 ? "s" : ""}`} delay={C.delay} />
        {frame >= C.stamp && (
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
              background: "rgba(16,36,44,0.9)",
              whiteSpace: "nowrap",
              boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
            }}
          >
            {COPY.hookStamp}
          </div>
        )}
      </Camera>
    </AbsoluteFill>
  );
};

const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = pop(frame, C.brand - 4, 9, 150);
  const chip = pop(frame, C.island + 12);
  const leave = out(frame, DURATION - 7, DURATION);
  return (
    <AbsoluteFill>
      <TropicalBackground variant="deep" />
      <Camera duration={DURATION} zoom={[1.06, 1]} punches={[C.brand]} pulse={T30.reveal}>
        <AbsoluteFill style={{ alignItems: "center", fontFamily: FONT, opacity: leave, transform: `scale(${0.85 + 0.15 * leave})` }}>
          <div style={{ marginTop: 170, transform: `scale(${logo}) rotate(${(1 - logo) * -10}deg)`, filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.3))" }}>
            <Logo width={900} color="#fff" />
          </div>
          <KineticText
            text={COPY.hookAnswer}
            at={C.island}
            stagger={3}
            highlight={["l'île"]}
            style={{ marginTop: 40, fontWeight: 800, fontSize: 84, color: "#fff", letterSpacing: -1, textShadow: "0 8px 30px rgba(0,0,0,0.3)" }}
          />
          <div style={{ marginTop: 34, transform: `scale(${chip})` }}>
            <Chip icon="pin" label={COPY.territory} size={38} />
          </div>
        </AbsoluteFill>
        <Confetti at={C.brand} x={960} y={330} count={70} seed="reveal" />
      </Camera>
    </AbsoluteFill>
  );
};

export const HookScene: React.FC = () => (
  <AbsoluteFill>
    <Problem />
    <WaveReveal start={T30.reveal} duration={12}>
      <Reveal />
    </WaveReveal>
  </AbsoluteFill>
);
