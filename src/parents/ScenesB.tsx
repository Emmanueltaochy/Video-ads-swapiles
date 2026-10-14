import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT } from "../config";
import { clamp, pop } from "../components/anim";
import { Chip } from "../components/Badges";
import { Camera, Confetti, KineticText, Sticker, TapHand } from "../components/Fx";
import { Icon } from "../components/Icons";
import { Logo } from "../components/Logo";
import { Phone, Screenshot } from "../components/Phone";
import { CtaButton, SocialRow, StoreBadges } from "../scenes/CtaScene";
import { COMPARE, CP, PARENTS_COPY as COPY, TP } from "./config";
import { Badge974, ReunionBackground, ReunionFlag } from "./Reunion";

/* ================================================================== 4. LA SOLUTION */

/** Vraies captures de l'app (filtre Enfant, noms des vendeurs masqués) qui défilent. */
const KidsScreens: React.FC<{ f: number; L: (n: number) => number }> = ({ f, L }) => {
  const switchAt = L(CP.baby) - 4;
  const p = interpolate(f, [switchAt, switchAt + 10], [0, 1], { ...clamp, easing: (v) => 1 - (1 - v) ** 3 });
  return (
    <AbsoluteFill style={{ background: "#f9fafb" }}>
      <AbsoluteFill style={{ transform: `translateX(${-p * 100}%)` }}>
        <Screenshot src="screens/enfant-1.png" scrollY={interpolate(f, [L(CP.cheap), switchAt], [0, 26], clamp)} />
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${(1 - p) * 100}%)` }}>
        <Screenshot src="screens/enfant-2.png" scrollY={interpolate(f, [switchAt, L(TP.compare)], [0, 20], clamp)} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const SolutionP: React.FC = () => {
  const f = useCurrentFrame();
  const L = (abs: number) => abs - TP.solution;
  const logo = pop(f, L(CP.brand) - 4, 9, 150);
  const phone = pop(f, L(CP.cheap) - 10, 12, 140);
  return (
    <AbsoluteFill>
      <ReunionBackground variant="lagoon" />
      <Camera duration={TP.compare - TP.solution} zoom={[1.05, 1]} punches={[L(CP.brand), L(CP.cheap), L(CP.baby)]}>
        <AbsoluteFill style={{ alignItems: "center" }}>
          <div style={{ marginTop: 270, transform: `scale(${logo}) rotate(${(1 - logo) * -12}deg)`, filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.3))" }}>
            <Logo width={640} color="#fff" />
          </div>
          <KineticText
            text={COPY.solution}
            at={[L(311), L(CP.parents), L(318), L(325), L(335), L(CP.cheap), L(CP.cheap + 2)]}
            highlight={["petit", "prix"]}
            highlightColor={COLORS.sun}
            style={{ marginTop: 20, fontWeight: 800, fontSize: 58, lineHeight: 1.1, color: "#fff", textAlign: "center", letterSpacing: -1, textShadow: "0 6px 24px rgba(0,0,0,0.25)" }}
          />
        </AbsoluteFill>
        <div style={{ position: "absolute", left: 350, top: 665, transformOrigin: "50% 0", transform: `translateY(${(1 - phone) * 1100 + Math.sin(f / 9) * 10}px) scale(0.92)` }}>
          <div style={{ perspective: 1600 }}>
            <div style={{ transform: `rotateY(-8deg) rotateZ(${(1 - phone) * 15}deg)` }}>
              <Phone width={380} navActive={1}>
                <KidsScreens f={f} L={L} />
              </Phone>
            </div>
          </div>
        </div>
        <Sticker x={870} y={900} at={L(CP.kidStuff)} icon="teddy" label="Enfant" color={COLORS.sun} tilt={6} />
        <Sticker x={210} y={830} at={L(CP.baby)} icon="bottle" label="Bébé" color={COLORS.lagoon} tilt={-6} />
        <Sticker x={225} y={1110} at={L(CP.unused)} icon="check" label="Presque neuf" color={COLORS.primary} tilt={-4} />
        <Sticker x={540} y={1285} at={L(CP.cheap) + 8} icon="teddy" label="+400 articles enfant" color={COLORS.coral} tilt={-3} />
        <Confetti at={L(CP.brand)} x={540} y={380} count={60} seed="pbrand" />
      </Camera>
    </AbsoluteFill>
  );
};

/* ================================================================== 5. LE COMPARATIF */

export const CompareP: React.FC = () => {
  const f = useCurrentFrame();
  const L = (abs: number) => abs - TP.compare;
  const card = pop(f, 0, 12, 150);
  const neufTotal = COMPARE.reduce((a, r) => a + r.neuf, 0);
  const swapTotal = COMPARE.reduce((a, r) => a + r.swap, 0);
  const totalAt = L(CP.likeNew);
  const saved = Math.round(interpolate(f, [totalAt + 4, totalAt + 22], [0, neufTotal - swapTotal], clamp));
  const stamp = pop(f, L(CP.pei), 8, 260);
  return (
    <AbsoluteFill>
      <ReunionBackground variant="night" sun={false} />
      <Camera duration={TP.sell - TP.compare} zoom={[1, 1.04]} punches={[...COMPARE.map((c) => L(c.at)), totalAt, L(CP.pei)]} shakeAt={[L(CP.pei)]}>
        <AbsoluteFill style={{ alignItems: "center" }}>
          <KineticText
            text={COPY.compareTitle}
            at={2}
            stagger={4}
            highlight={["Swap'Îles"]}
            highlightColor={COLORS.sun}
            style={{ marginTop: 280, fontWeight: 900, fontSize: 80, color: "#fff", textAlign: "center", letterSpacing: -1.5, opacity: 1 - stamp }}
          />
        </AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 420,
            width: 960,
            borderRadius: 40,
            background: "#fff",
            boxShadow: "0 30px 70px rgba(0,0,0,0.35)",
            padding: "26px 36px 30px",
            fontFamily: FONT,
            transform: `translateY(${(1 - card) * 1000}px)`,
          }}
        >
          <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: "#8a9692", paddingBottom: 10, borderBottom: "2px solid #eef2f1" }}>
            <span style={{ flex: 1 }}>Article</span>
            <span style={{ width: 170, textAlign: "right" }}>Neuf</span>
            <span style={{ width: 200, textAlign: "right", color: COLORS.primary }}>Swap'Îles</span>
          </div>
          {COMPARE.map((r) => {
            const s = pop(f, L(r.at), 9, 220);
            const strike = interpolate(f, [L(r.at) + 6, L(r.at) + 12], [0, 1], clamp);
            const newP = pop(f, L(r.at) + 10, 8, 240);
            return (
              <div key={r.label} style={{ display: "flex", alignItems: "center", height: 124, borderBottom: "2px solid #f2f5f4", transform: `translateX(${(1 - s) * -200}px)`, opacity: Math.min(1, s * 2) }}>
                <div style={{ width: 84, height: 84, borderRadius: 24, background: "#eaf6f3", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 20 }}>
                  <Icon name={r.icon} size={56} color={COLORS.primary} strokeWidth={1.9} />
                </div>
                <span style={{ flex: 1, fontSize: 38, fontWeight: 800, color: COLORS.ink }}>{r.label}</span>
                <span style={{ width: 170, textAlign: "right", fontSize: 36, fontWeight: 700, color: "#9aa5a1", position: "relative" }}>
                  {r.neuf} €
                  <span style={{ position: "absolute", right: 0, top: "52%", height: 5, width: `${strike * 100}%`, background: COLORS.coral, borderRadius: 3 }} />
                </span>
                <span style={{ width: 200, textAlign: "right", fontSize: 54, fontWeight: 900, color: COLORS.primary, transform: `scale(${newP})`, transformOrigin: "100% 50%" }}>
                  {r.swap} €
                </span>
              </div>
            );
          })}
          {f >= totalAt && (
            <div style={{ display: "flex", alignItems: "center", marginTop: 22, transform: `scale(${pop(f, totalAt, 9, 220)})` }}>
              <span style={{ flex: 1, fontSize: 40, fontWeight: 900, color: COLORS.ink }}>Total</span>
              <span style={{ width: 170, textAlign: "right", fontSize: 36, fontWeight: 700, color: "#9aa5a1", textDecoration: "line-through", textDecorationColor: COLORS.coral }}>
                {neufTotal} €
              </span>
              <span style={{ width: 200, textAlign: "right", fontSize: 60, fontWeight: 900, color: COLORS.primary }}>{swapTotal} €</span>
            </div>
          )}
          {f >= totalAt + 4 && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
              <div style={{ padding: "12px 30px", borderRadius: 40, background: COLORS.sun, color: COLORS.deep, fontSize: 40, fontWeight: 900, transform: `scale(${pop(f, totalAt + 4, 8, 240)})` }}>
                {saved} € économisés
              </div>
            </div>
          )}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1240, textAlign: "center", fontFamily: FONT, fontSize: 24, color: "rgba(255,255,255,0.75)" }}>
          {COPY.disclaimer}
        </div>
        {f >= L(CP.pei) && (
          <div
            style={{
              position: "absolute",
              left: 540,
              top: 335,
              transform: `translate(-50%, -50%) rotate(-10deg) scale(${interpolate(stamp, [0, 1], [2.4, 1])})`,
              opacity: Math.min(1, stamp * 1.6),
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 30px",
              borderRadius: 24,
              border: `8px solid ${COLORS.sun}`,
              background: COLORS.deep,
              color: COLORS.sun,
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 64,
              boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
              whiteSpace: "nowrap",
            }}
          >
            <ReunionFlag size={44} />
            {COPY.pei}
          </div>
        )}
        <Confetti at={L(CP.pei)} x={540} y={340} count={70} seed="pei" />
      </Camera>
    </AbsoluteFill>
  );
};

/* ================================================================== 6. VENDS À TON TOUR */

export const SellP: React.FC = () => {
  const f = useCurrentFrame();
  const L = (abs: number) => abs - TP.sell;
  const card = pop(f, 0, 10, 170);
  const shoot = L(CP.sellIt);
  const flash = interpolate(f, [shoot, shoot + 1, shoot + 8], [0, 1, 0], clamp);
  const sold = f >= shoot + 2;
  const tagShake = f >= L(CP.tooSmall) && f < shoot ? Math.sin(f * 1.6) * 8 : 0;
  return (
    <AbsoluteFill>
      <ReunionBackground variant="sand" />
      <Camera duration={TP.cta - TP.sell} zoom={[1, 1.06]} punches={[L(CP.tooSmall), shoot]}>
        <AbsoluteFill style={{ alignItems: "center" }}>
          <KineticText
            text={COPY.tooSmall}
            at={[L(CP.tooSmall), L(CP.tooSmall) + 3, L(CP.tooSmall) + 6]}
            highlight={["petit"]}
            highlightColor={COLORS.coral}
            style={{ marginTop: 290, fontWeight: 900, fontSize: 104, color: COLORS.deep, textAlign: "center", letterSpacing: -2 }}
          />
        </AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: 540 - 230,
            top: 480,
            width: 460,
            height: 520,
            borderRadius: 44,
            background: "#fff",
            boxShadow: "0 30px 70px rgba(0,40,30,0.25)",
            transform: `scale(${card}) rotate(${-3 + (1 - card) * 20}deg)`,
            fontFamily: FONT,
            overflow: "hidden",
          }}
        >
          <div style={{ height: 340, background: "#d8f3ee", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="onesie" size={240} color={COLORS.primary} strokeWidth={1.5} />
          </div>
          <div style={{ padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 34, fontWeight: 800, color: COLORS.ink }}>Body 6 mois</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: "#6b7a76" }}>Très bon état</div>
            </div>
            {sold && <div style={{ fontSize: 56, fontWeight: 900, color: COLORS.primary, transform: `scale(${pop(f, shoot + 2, 8, 240)})` }}>8 €</div>}
          </div>
          <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
        </div>
        {!sold && f >= L(CP.tooSmall) && (
          <div style={{ position: "absolute", left: 640, top: 500, transform: `scale(${pop(f, L(CP.tooSmall), 8, 240)}) rotate(${12 + tagShake}deg)` }}>
            <Chip icon="ruler" label="Trop petit !" size={36} variant="dark" style={{ background: COLORS.coral }} />
          </div>
        )}
        {sold && (
          <div
            style={{
              position: "absolute",
              left: 540,
              top: 650,
              transform: `translate(-50%, -50%) rotate(-12deg) scale(${interpolate(pop(f, shoot + 8, 8, 260), [0, 1], [2.2, 1])})`,
              opacity: Math.min(1, pop(f, shoot + 8, 8, 260) * 1.6),
              padding: "12px 36px",
              borderRadius: 22,
              border: `8px solid ${COLORS.coral}`,
              background: "rgba(255,255,255,0.95)",
              color: COLORS.coral,
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 76,
            }}
          >
            VENDU !
          </div>
        )}
        <AbsoluteFill style={{ alignItems: "center" }}>
          <KineticText
            text={COPY.sellIt}
            at={[shoot, shoot + 3, shoot + 5, shoot + 8, shoot + 11]}
            highlight={["Vends-le"]}
            highlightColor={COLORS.coral}
            style={{ marginTop: 1060, fontWeight: 900, fontSize: 72, color: COLORS.primary, textAlign: "center", letterSpacing: -1 }}
          />
        </AbsoluteFill>
        <Sticker x={830} y={1190} at={shoot + 14} icon="coins" label="+8 €" color={COLORS.sun} tilt={-6} />
        <Confetti at={shoot + 8} x={540} y={650} count={60} seed="sold-p" />
      </Camera>
    </AbsoluteFill>
  );
};

/* ================================================================== 7. APPEL À L'ACTION */

export const CtaP: React.FC = () => {
  const f = useCurrentFrame();
  const L = (abs: number) => abs - TP.cta;
  const logo = pop(f, 0, 9, 150);
  const tap = 38;
  return (
    <AbsoluteFill>
      <ReunionBackground variant="lagoon" />
      <Camera duration={TP.end - TP.cta} zoom={[1.06, 1]} punches={[0, tap, L(CP.together), L(CP.help)]}>
        <AbsoluteFill style={{ alignItems: "center", fontFamily: FONT }}>
          <div style={{ marginTop: 290, transform: `scale(${logo}) rotate(${(1 - logo) * 12}deg)`, filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.3))" }}>
            <Logo width={800} color="#fff" />
          </div>
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 14 }}>
            <svg width={52} height={52} viewBox="0 0 24 24" style={{ transform: `scale(${pop(f, L(CP.help), 8, 240)})` }}>
              <path d="M12 21s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 11c0 5.4-7.5 10-7.5 10z" fill={COLORS.coral} />
            </svg>
            <KineticText
              text={COPY.together}
              at={[L(CP.together), L(CP.together) + 3, L(CP.help), L(CP.help) + 2]}
              style={{ fontWeight: 800, fontSize: 50, color: "#fff", textShadow: "0 6px 20px rgba(0,0,0,0.25)" }}
            />
          </div>
          <div style={{ marginTop: 50 }}>
            <CtaButton f={f} delay={2} fontSize={38} tapAt={tap} />
          </div>
          <div style={{ marginTop: 50 }}>
            <StoreBadges f={f} delay={14} height={92} />
          </div>
          <div style={{ marginTop: 46 }}>
            <SocialRow f={f} delay={L(CP.help) + 4} size={56} />
          </div>
          <div style={{ marginTop: 40, transform: `scale(${pop(f, L(CP.help) + 12)})` }}>
            <Badge974 scale={0.9} />
          </div>
        </AbsoluteFill>
        <TapHand x={870} y={745} at={tap} />
        <Confetti at={1} x={540} y={420} count={80} seed="pcta" />
        <Confetti at={tap + 2} x={870} y={725} count={40} seed="ptap" spread={0.6} />
      </Camera>
    </AbsoluteFill>
  );
};
