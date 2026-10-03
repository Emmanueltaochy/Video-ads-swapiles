import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS, COPY, FONT } from "../config";
import { clamp, ease, out, pop, smooth } from "../components/anim";
import { TropicalBackground } from "../components/Background";
import { Chip } from "../components/Badges";
import { Icon, IconName } from "../components/Icons";
import { Logo } from "../components/Logo";
import { Phone, Screenshot } from "../components/Phone";

export const STEP_LEN = 150;
const PHONE_W = 380;

/* ------------------------------------------------------------ écrans du téléphone */

/** Étape 1 : appareil photo (interface redessinée) sur la photo d'un article réel. */
const CameraScreen: React.FC<{ f: number }> = ({ f }) => {
  const zoom = interpolate(f, [0, 60], [1.25, 1.1], clamp);
  const flash = interpolate(f, [58, 60, 70], [0, 1, 0], clamp);
  const focus = pop(f, 22, 10);
  const published = pop(f, 74, 12);
  const shot = f >= 60;
  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: FONT }}>
      <div style={{ position: "absolute", top: 40, left: 0, right: 0, height: 470, overflow: "hidden" }}>
        <Img
          src={staticFile("screens/photo-jean.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${shot ? 1 : zoom})` }}
        />
        {/* grille */}
        {!shot && (
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }} viewBox="0 0 300 300" preserveAspectRatio="none">
            <path d="M100 0V300M200 0V300M0 100H300M0 200H300" stroke="rgba(255,255,255,0.35)" strokeWidth={0.8} />
          </svg>
        )}
        {!shot && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 130,
              height: 130,
              border: `3px solid ${COLORS.sun}`,
              borderRadius: 10,
              transform: `translate(-50%, -50%) scale(${interpolate(focus, [0, 1], [1.6, 1])})`,
              opacity: focus,
            }}
          />
        )}
      </div>
      <div style={{ position: "absolute", top: 8, width: "100%", textAlign: "center", color: COLORS.sun, fontSize: 15, fontWeight: 700, letterSpacing: 2 }}>
        PHOTO
      </div>
      {/* déclencheur */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: "50%",
          width: 84,
          height: 84,
          marginLeft: -42,
          borderRadius: "50%",
          border: "5px solid #fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#fff",
            transform: `scale(${f > 54 && f < 62 ? 0.82 : 1})`,
          }}
        />
      </div>
      {/* vignette de la photo prise */}
      {shot && (
        <div
          style={{
            position: "absolute",
            bottom: 62,
            left: 30,
            width: 60,
            height: 60,
            borderRadius: 10,
            overflow: "hidden",
            border: "2px solid #fff",
            transform: `scale(${pop(f, 62)})`,
          }}
        >
          <Img src={staticFile("screens/photo-jean.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}
      {/* annonce publiée */}
      <div
        style={{
          position: "absolute",
          left: 18,
          right: 18,
          top: 380,
          borderRadius: 22,
          background: "#fff",
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          transform: `translateY(${(1 - published) * 60}px) scale(${0.8 + 0.2 * published})`,
          opacity: published,
          boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: COLORS.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="check" size={30} color="#fff" strokeWidth={3.2} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: 800, fontSize: 21, color: COLORS.ink }}>Annonce en ligne !</span>
          <span style={{ fontWeight: 500, fontSize: 16, color: "#5d6b67" }}>Jean Levi's · 25 €</span>
        </div>
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};

/** Notification qui tombe du haut de l'écran. */
const Notification: React.FC<{ f: number; start: number; end: number }> = ({ f, start, end }) => {
  const inP = smooth(f, start, 14);
  const outP = 1 - smooth(f, end, 12);
  const p = Math.min(inP, outP);
  if (p <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 8,
        left: 12,
        right: 12,
        borderRadius: 22,
        background: "rgba(255,255,255,0.97)",
        boxShadow: "0 14px 36px rgba(0,0,0,0.28)",
        padding: "12px 14px",
        display: "flex",
        gap: 12,
        alignItems: "center",
        transform: `translateY(${(p - 1) * 140}px)`,
        fontFamily: FONT,
        zIndex: 20,
      }}
    >
      <div style={{ width: 46, height: 46, borderRadius: 12, background: COLORS.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="palm" size={30} color="#fff" strokeWidth={2.2} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: COLORS.ink }}>{COPY.notification.title}</span>
        <span style={{ fontSize: 15, fontWeight: 500, color: "#3d4a46" }}>{COPY.notification.body}</span>
      </div>
    </div>
  );
};

/** En-tête produit (redessiné) au-dessus de l'écran de paiement. */
const ProductHeader: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 18px 14px", background: "#fff", borderBottom: "1px solid #e8ecea", fontFamily: FONT }}>
    <Img src={staticFile("screens/photo-jean.png")} style={{ width: 74, height: 74, borderRadius: 14, objectFit: "cover" }} />
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
      <span style={{ fontWeight: 700, fontSize: 19, color: COLORS.ink }}>Jean levis ribcage femme</span>
      <span style={{ fontWeight: 800, fontSize: 26, color: COLORS.primary }}>25 €</span>
      <span style={{ fontWeight: 500, fontSize: 14, color: "#5d6b67" }}>La Réunion · il y a 5 jours</span>
    </div>
  </div>
);

/** Glissement horizontal entre deux écrans. */
const Slide: React.FC<{ f: number; at: number; children: React.ReactNode; first?: boolean }> = ({ f, at, children, first }) => {
  const p = first ? 1 : smooth(f, at, 16);
  return <AbsoluteFill style={{ transform: `translateX(${(1 - p) * 100}%)`, background: "#f6f8f7" }}>{children}</AbsoluteFill>;
};

const PhoneScreens: React.FC<{ f: number }> = ({ f }) => {
  const s2 = f - STEP_LEN;
  const s3 = f - 2 * STEP_LEN;
  return (
    <AbsoluteFill>
      <Slide f={f} at={0} first>
        <CameraScreen f={f} />
      </Slide>
      {s2 >= -1 && (
        <Slide f={s2} at={0}>
          <Screenshot src="screens/annonce.png" scrollY={interpolate(s2, [10, 80], [0, 14], clamp)} />
        </Slide>
      )}
      {s2 >= 85 && (
        <Slide f={s2} at={86}>
          <ProductHeader />
          <Screenshot src="screens/paiement.png" />
        </Slide>
      )}
      {s3 >= -1 && (
        <Slide f={s3} at={0}>
          <Screenshot src="screens/remise.png" />
        </Slide>
      )}
      <Notification f={s2} start={28} end={78} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ colonne de gauche */

const StepText: React.FC<{ index: number; f: number; children?: React.ReactNode }> = ({ index, f, children }) => {
  const step = COPY.steps[index];
  const enter = ease(f, 2, 20);
  const leave = index < 2 ? out(f, STEP_LEN - 10, STEP_LEN) : 1;
  const num = pop(f, 2, 10);
  return (
    <div
      style={{
        position: "absolute",
        left: 150,
        top: 300,
        width: 900,
        fontFamily: FONT,
        opacity: Math.min(enter, leave),
        transform: `translateX(${(1 - enter) * -60 + (1 - leave) * -40}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: "50%",
            background: COLORS.sun,
            color: COLORS.deep,
            fontWeight: 900,
            fontSize: 66,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${num})`,
            boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
            flexShrink: 0,
          }}
        >
          {index + 1}
        </div>
        <div style={{ fontWeight: 800, fontSize: 78, color: "#fff", lineHeight: 1.05, letterSpacing: -1.5, whiteSpace: "pre-line", textShadow: "0 6px 24px rgba(0,0,0,0.25)" }}>
          {step.title}
        </div>
      </div>
      <div
        style={{
          marginTop: 28,
          marginLeft: 140,
          fontWeight: 500,
          fontSize: 38,
          color: COLORS.lagoonLight,
          lineHeight: 1.3,
          whiteSpace: "pre-line",
          opacity: ease(f, 12, 28),
        }}
      >
        {step.sub}
      </div>
      {children}
    </div>
  );
};

const Progress: React.FC<{ f: number }> = ({ f }) => {
  const active = Math.min(2, Math.floor(f / STEP_LEN));
  const appear = ease(f, 0, 16);
  return (
    <div style={{ position: "absolute", left: 150, top: 175, display: "flex", gap: 14, opacity: appear, fontFamily: FONT }}>
      {COPY.stepLabels.map((label, i) => {
        const on = i === active;
        const done = i < active;
        return (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 22px 10px 12px",
              borderRadius: 40,
              background: on ? "#fff" : "rgba(255,255,255,0.12)",
              color: on ? COLORS.primary : "rgba(255,255,255,0.85)",
              fontWeight: 700,
              fontSize: 26,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: on ? COLORS.primary : done ? COLORS.lagoon : "rgba(255,255,255,0.2)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              {done ? <Icon name="check" size={22} color="#fff" strokeWidth={3.4} /> : i + 1}
            </div>
            {label}
          </div>
        );
      })}
    </div>
  );
};

const PayChips: React.FC<{ f: number }> = ({ f }) => {
  const icons: IconName[] = ["card", "cash", "swap", "gift"];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginTop: 44, marginLeft: 140, width: 640 }}>
      {COPY.payChips.map((label, i) => (
        <div key={label} style={{ transform: `scale(${pop(f, 40 + i * 9)})` }}>
          <Chip icon={icons[i]} label={label} size={32} />
        </div>
      ))}
    </div>
  );
};

/** Mini-carte de La Réunion avec des points relais qui apparaissent. */
const RelayMap: React.FC<{ f: number }> = ({ f }) => {
  const card = pop(f, 30, 13);
  const pins = [
    { x: 92, y: 62 },
    { x: 200, y: 110 },
    { x: 140, y: 176 },
    { x: 238, y: 196 },
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: 975,
        top: 560,
        width: 330,
        height: 300,
        borderRadius: 34,
        background: "#fff",
        boxShadow: "0 25px 60px rgba(0,20,15,0.35)",
        transform: `scale(${card}) rotate(-4deg)`,
        fontFamily: FONT,
        padding: 18,
        zIndex: 3,
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 22, color: COLORS.primary, display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="store" size={26} color={COLORS.primary} strokeWidth={2.4} />
        Points relais
      </div>
      <svg width={294} height={230} viewBox="0 0 300 240" style={{ marginTop: 4 }}>
        {/* silhouette stylisée de La Réunion */}
        <path
          d="M70 40 C110 15 175 18 215 40 C255 60 285 105 282 150 C279 195 240 225 185 228 C130 231 70 215 40 180 C10 145 18 75 70 40 Z"
          fill="rgba(43,179,163,0.18)"
          stroke={COLORS.lagoon}
          strokeWidth={3}
        />
        <path d="M120 95 C140 80 165 85 175 105 C185 125 165 145 145 140 C125 135 110 112 120 95 Z" fill="rgba(19,106,93,0.18)" />
        {pins.map((p, i) => {
          const s = pop(f, 50 + i * 10, 9);
          return (
            <g key={i} transform={`translate(${p.x} ${p.y}) scale(${s})`}>
              <circle r={22} fill={COLORS.primary} opacity={0.18 * s} />
              <path d="M0 6 C-8 -2 -12 -6 -12 -12 A12 12 0 0 1 12 -12 C12 -6 8 -2 0 6 Z" fill={i === 1 ? COLORS.coral : COLORS.primary} transform="translate(0 -6)" />
              <circle cy={-18} r={4.5} fill="#fff" />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/* ------------------------------------------------------------ scène */

export const StepsScene: React.FC = () => {
  const f = useCurrentFrame();
  // Téléphone : entrée par la droite + flottement + légère rotation 3D
  const enter = pop(f, 0, 14, 90);
  const bob = Math.sin(f / 22) * 10;
  const rotY = interpolate(f, [0, 450], [-14, -6]);
  const exit = interpolate(f, [440, 450], [0, 1], clamp);
  const step = Math.min(2, Math.floor(f / STEP_LEN));
  const logoIn = ease(f, 0, 18);

  return (
    <AbsoluteFill>
      <TropicalBackground variant="deep" />
      <div style={{ position: "absolute", left: 150, top: 62, opacity: logoIn }}>
        <Logo width={250} color="#fff" />
      </div>
      <Progress f={f} />
      {step === 0 && <StepText index={0} f={f} />}
      {step === 1 && (
        <StepText index={1} f={f - STEP_LEN}>
          <PayChips f={f - STEP_LEN} />
        </StepText>
      )}
      {step === 2 && <StepText index={2} f={f - 2 * STEP_LEN} />}
      {step === 2 && <RelayMap f={f - 2 * STEP_LEN} />}
      <div
        style={{
          position: "absolute",
          left: 1290,
          top: 50,
          perspective: 1600,
          transform: `translateX(${(1 - enter) * 900 + exit * 200}px) translateY(${bob}px)`,
          opacity: 1 - exit,
        }}
      >
        <div style={{ transform: `rotateY(${rotY}deg) rotateZ(${3 - enter * 1}deg)` }}>
          <Phone width={PHONE_W} navActive={step === 0 ? 2 : step === 1 ? 3 : 0} nav={step !== 0}>
            <PhoneScreens f={f} />
          </Phone>
        </div>
      </div>
    </AbsoluteFill>
  );
};
