import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { COLORS, FONT } from "../config";
import { clamp, out, pop } from "../components/anim";
import { beatPulse, Camera, KineticText, Sticker } from "../components/Fx";
import { Icon, IconName } from "../components/Icons";
import { CP, PARENTS_COPY as COPY, RECEIPT, TP } from "./config";
import { Badge974, ReunionBackground, WavingFlag } from "./Reunion";

const euro = (n: number) => `${n.toFixed(2).replace(".", ",")} €`;

/* ================================================================== 1. ACCROCHE */

/** Étiquettes de prix qui tombent : la vie chère. */
const PriceRain: React.FC<{ f: number; at: number; until: number }> = ({ f, at, until }) => {
  const labels = ["€€€", "+ cher", "€€", "€€€€", "+ cher", "€€€", "€", "€€"];
  const leave = out(f, until - 4, until + 4);
  return (
    <>
      {labels.map((l, i) => {
        const t0 = at + i * 2;
        const k = f - t0;
        if (k < 0) return null;
        const x = 90 + random(`px${i}`) * 820;
        const y1 = 660 + random(`py${i}`) * 480;
        // les étiquettes tombent sous le titre (jamais par-dessus)
        const y = interpolate(k, [0, 10], [y1 - 260, y1], { ...clamp, easing: (v) => 1 - (1 - v) ** 3 });
        const sIn = interpolate(k, [0, 6], [0, 1], clamp);
        const rot = (random(`pr${i}`) - 0.5) * 50 + Math.sin((f + i * 7) / 3) * 4;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${leave * sIn})`,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 26px 14px 16px",
              borderRadius: 16,
              background: "#fff",
              border: `4px solid ${COLORS.coral}`,
              boxShadow: "0 16px 30px rgba(0,0,0,0.3)",
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 48,
              color: COLORS.coral,
            }}
          >
            <Icon name="tag" size={40} color={COLORS.coral} strokeWidth={2.6} />
            {l}
          </div>
        );
      })}
    </>
  );
};

export const HookP: React.FC = () => {
  const f = useCurrentFrame();
  const kids: { icon: IconName; at: number; size: number }[] = [
    { icon: "onesie", at: CP.grow, size: 150 },
    { icon: "shoe", at: CP.grow + 7, size: 200 },
    { icon: "bike", at: CP.grow + 14, size: 260 },
  ];
  return (
    <AbsoluteFill>
      <ReunionBackground variant="sunset" />
      <Camera duration={TP.cost} zoom={[1.16, 1]} punches={[CP.reunion, CP.expensive, CP.kids]} shakeAt={[CP.expensive]}>
        {/* « À La Réunion » : le drapeau apparaît et flotte, puis file (derrière le texte) se ranger dans le badge */}
        {f < CP.expensive + 6 && (
          <div
            style={{
              position: "absolute",
              left: 540,
              top: interpolate(f, [CP.expensive - 6, CP.expensive + 6], [790, 280], { ...clamp, easing: (v) => v * v }),
              transform: `translate(-50%, -50%) scale(${pop(f, CP.reunion - 6, 9, 170) * interpolate(f, [CP.expensive - 6, CP.expensive + 6], [1, 0.12], clamp)}) rotate(${(1 - pop(f, CP.reunion - 6, 9, 170)) * -25}deg)`,
              filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.35))",
            }}
          >
            <WavingFlag width={420} />
          </div>
        )}
        <AbsoluteFill style={{ alignItems: "center" }}>
          <div style={{ marginTop: 262, transform: `scale(${pop(f, CP.reunion - 4)})` }}>
            <Badge974 />
          </div>
          <KineticText
            text={COPY.hookLine1}
            at={[2, 5, CP.reunion, 32, 35, 38, CP.expensive]}
            highlight={["chère"]}
            highlightColor={COLORS.coral}
            style={{ marginTop: 30, fontWeight: 900, fontSize: 98, lineHeight: 1.05, color: "#fff", textAlign: "center", letterSpacing: -2, textShadow: "0 8px 30px rgba(60,20,20,0.45)" }}
          />
        </AbsoluteFill>
        <PriceRain f={f} at={CP.expensive} until={CP.kids - 2} />
        <AbsoluteFill style={{ alignItems: "center" }}>
          <KineticText
            text={COPY.hookLine2}
            at={[CP.kids - 4, CP.kids - 2, CP.kids, CP.grow, CP.grow + 3, CP.grow + 5, CP.grow + 7]}
            highlight={["marmailles"]}
            highlightColor={COLORS.sun}
            style={{ marginTop: 690, fontWeight: 800, fontSize: 74, lineHeight: 1.08, color: "#fff", textAlign: "center", letterSpacing: -1, textShadow: "0 8px 30px rgba(60,20,20,0.45)" }}
          />
        </AbsoluteFill>
        {/* les marmailles grandissent : body -> chaussure -> vélo */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 920, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 40 }}>
          {kids.map((k) => {
            const s = pop(f, k.at, 9, 220);
            return (
              <div
                key={k.icon}
                style={{
                  width: k.size,
                  height: k.size,
                  borderRadius: k.size * 0.28,
                  background: "#fff",
                  boxShadow: "0 18px 40px rgba(0,0,0,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${s}) translateY(${Math.sin((f + k.size) / 9) * 6}px)`,
                  opacity: Math.min(1, s * 2),
                }}
              >
                <Icon name={k.icon} size={k.size * 0.62} color={COLORS.primary} strokeWidth={1.8} />
              </div>
            );
          })}
        </div>
      </Camera>
    </AbsoluteFill>
  );
};

/* ================================================================== 2. TOUT RACHETER */

const L2 = (abs: number) => abs - TP.cost;

/** Toise : l'enfant grandit, les âges défilent. */
const Toise: React.FC<{ f: number; dur: number }> = ({ f, dur }) => {
  const p = interpolate(f, [4, dur - 10], [0.12, 0.95], clamp);
  const ageIdx = Math.min(COPY.ages.length - 1, Math.floor(p * COPY.ages.length));
  const H = 720;
  const enter = pop(f, 0, 12, 160);
  return (
    <div style={{ position: "absolute", left: 70, top: 500, width: 200, height: H, transform: `translateX(${(1 - enter) * -300}px)` }}>
      <div style={{ position: "absolute", left: 60, top: 0, width: 80, height: H, borderRadius: 16, background: "#fff", boxShadow: "0 18px 40px rgba(0,0,0,0.3)", overflow: "hidden" }}>
        {new Array(13).fill(0).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 0, top: 20 + i * 54, width: i % 2 ? 26 : 44, height: 4, background: "#c9d6d2" }} />
        ))}
        <div style={{ position: "absolute", left: 50, right: 0, bottom: 0, height: `${p * 100}%`, background: `linear-gradient(180deg, ${COLORS.sun}, #ffad3b)` }} />
      </div>
      {/* bulle d'âge qui suit la hauteur */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: H * (1 - p) - 34,
          transform: `scale(${pop(f, Math.floor((ageIdx / COPY.ages.length) * (dur - 14)) + 4, 8, 260)})`,
          padding: "10px 18px",
          borderRadius: 30,
          background: COLORS.coral,
          color: "#fff",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 30,
          whiteSpace: "nowrap",
          boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
        }}
      >
        {COPY.ages[ageIdx]}
      </div>
    </div>
  );
};

const Receipt: React.FC<{ f: number }> = ({ f }) => {
  const enter = pop(f, 0, 12, 140);
  const shown = RECEIPT.filter((r) => f >= L2(r.at));
  const total = RECEIPT.reduce((a, r) => a + r.price, 0);
  const totalAt = L2(CP.always);
  const totalCount = interpolate(f, [totalAt, totalAt + 14], [0, total], clamp);
  const shake = f >= totalAt && f < totalAt + 12 ? Math.sin(f * 2.4) * 6 : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 320,
        top: 500,
        width: 690,
        transform: `translateY(${(1 - enter) * 900}px) rotate(${2 + shake * 0.3}deg) translateX(${shake}px)`,
        background: "#fffdf7",
        borderRadius: "10px 10px 0 0",
        boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
        fontFamily: "'Courier New', monospace",
        color: COLORS.ink,
        padding: "26px 34px 30px",
      }}
    >
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 34, letterSpacing: 3 }}>{COPY.receiptTitle}</div>
      <div style={{ borderTop: "3px dashed #b9c4c0", margin: "18px 0 8px" }} />
      {shown.map((r) => {
        const s = pop(f, L2(r.at), 9, 220);
        return (
          <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 16, height: 92, transform: `translateX(${(1 - s) * 120}px)`, opacity: Math.min(1, s * 2) }}>
            <Icon name={r.icon} size={52} color={COLORS.primary} strokeWidth={2} />
            <span style={{ flex: 1, fontWeight: 700, fontSize: 36 }}>{r.label}</span>
            <span style={{ fontWeight: 900, fontSize: 38 }}>{euro(r.price)}</span>
          </div>
        );
      })}
      {f >= totalAt && (
        <>
          <div style={{ borderTop: "3px dashed #b9c4c0", margin: "8px 0 14px" }} />
          <div style={{ display: "flex", alignItems: "center", transform: `scale(${pop(f, totalAt, 8, 240)})` }}>
            <span style={{ flex: 1, fontWeight: 900, fontSize: 44 }}>TOTAL</span>
            <span style={{ fontWeight: 900, fontSize: 56, color: COLORS.coral }}>{euro(Math.round(totalCount))}</span>
          </div>
        </>
      )}
      {/* bord dentelé du ticket */}
      <svg width="100%" height={24} viewBox="0 0 690 24" preserveAspectRatio="none" style={{ position: "absolute", left: 0, bottom: -23 }}>
        <path d={`M0 0 ${new Array(24).fill(0).map((_, i) => `L${i * 30 + 15} 22 L${(i + 1) * 30} 0`).join(" ")} Z`} fill="#fffdf7" />
      </svg>
    </div>
  );
};

export const CostP: React.FC = () => {
  const f = useCurrentFrame();
  const dur = TP.heart - TP.cost;
  const again = L2(CP.always) + 8;
  return (
    <AbsoluteFill>
      <ReunionBackground variant="night" sun={false} />
      <Camera duration={dur} zoom={[1, 1.05]} punches={RECEIPT.map((r) => L2(r.at)).concat(L2(CP.always))}>
        <AbsoluteFill style={{ alignItems: "center" }}>
          <KineticText
            text={COPY.costTitle}
            at={2}
            stagger={3}
            highlight={["tout"]}
            highlightColor={COLORS.sun}
            style={{ marginTop: 280, fontWeight: 900, fontSize: 84, lineHeight: 1.05, color: "#fff", textAlign: "center", letterSpacing: -1.5 }}
          />
        </AbsoluteFill>
        <Toise f={f} dur={dur} />
        <Receipt f={f} />
        <Sticker x={720} y={1250} at={again} icon="refresh" label="Et ça recommence…" color={COLORS.coral} tilt={-5} />
      </Camera>
    </AbsoluteFill>
  );
};

/* ================================================================== 3. LE CŒUR */

const HEART = "M12 21s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 11c0 5.4-7.5 10-7.5 10z";

export const HeartP: React.FC = () => {
  const f = useCurrentFrame();
  const L = (abs: number) => abs - TP.heart;
  const s = pop(f, 0, 8, 160);
  const beat = beatPulse(f, 0, 0.06);
  return (
    <AbsoluteFill>
      <ReunionBackground variant="sand" />
      <Camera duration={TP.solution - TP.heart} zoom={[1, 1.06]} punches={[L(CP.child), L(CP.nothing)]}>
        <AbsoluteFill style={{ alignItems: "center" }}>
          <KineticText
            text={COPY.heart}
            at={[L(222), L(CP.child), L(248), L(250), L(255), L(262), L(CP.nothing)]}
            highlight={["rien"]}
            highlightColor={COLORS.coral}
            style={{ marginTop: 300, fontWeight: 900, fontSize: 82, lineHeight: 1.08, color: COLORS.deep, textAlign: "center", letterSpacing: -1.5 }}
          />
        </AbsoluteFill>
        {/* petits cœurs qui montent */}
        {new Array(10).fill(0).map((_, i) => {
          const k = f - i * 4;
          if (k < 0) return null;
          const x = 140 + random(`hx${i}`) * 800;
          const y = 1250 - k * (9 + random(`hv${i}`) * 6);
          return (
            <svg key={i} width={60} height={60} viewBox="0 0 24 24" style={{ position: "absolute", left: x, top: y, opacity: interpolate(k, [0, 6, 50, 64], [0, 0.8, 0.8, 0], clamp) }}>
              <path d={HEART} fill={i % 2 ? COLORS.coral : COLORS.sun} />
            </svg>
          );
        })}
        <div style={{ position: "absolute", left: 540 - 230, top: 620, width: 460, height: 460, transform: `scale(${s * beat})` }}>
          <svg width={460} height={460} viewBox="0 0 24 24" style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 20px 30px rgba(255,111,89,0.45))" }}>
            <path d={HEART} fill={COLORS.coral} />
          </svg>
          <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", transform: `scale(${pop(f, L(CP.child), 9, 200)})` }}>
            <Icon name="teddy" size={190} color="#fff" strokeWidth={1.6} />
          </div>
        </div>
      </Camera>
    </AbsoluteFill>
  );
};
