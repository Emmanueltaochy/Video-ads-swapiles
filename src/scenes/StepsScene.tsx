import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS, COPY, CUES_30S, FONT, GROOVE_START_30S, FPS, T30 } from "../config";
import { clamp, out, pop, smooth } from "../components/anim";
import { TropicalBackground } from "../components/Background";
import { Chip } from "../components/Badges";
import { Camera, Confetti, KineticText, Sticker } from "../components/Fx";
import { Icon, IconName } from "../components/Icons";
import { Logo } from "../components/Logo";
import { Phone, Screenshot } from "../components/Phone";
import { useLayout } from "../layout";

/* Repères en frames locales (0 = début de la scène) */
const L = (abs: number) => abs - T30.step1;
const S2 = L(T30.step2);
const S3 = L(T30.step3);
export const STEPS_DURATION = L(T30.benefits);
const C = Object.fromEntries(Object.entries(CUES_30S).map(([k, v]) => [k, L(v)])) as Record<keyof typeof CUES_30S, number>;

const PHONE_W = 380;

/** Positions des éléments selon le format (YouTube horizontal / Reels vertical). */
const LAYOUTS = {
  landscape: {
    phone: { x: 1290, y: 50, scale: 1 },
    phoneCenter: { x: 1480, y: 450 },
    logo: true,
    progress: { left: 150, top: 175, justify: "flex-start" as const, font: 26 },
    header: { left: 150, top: 300, width: 1000, num: 110, title: 78, subIndent: 140, sub: 38 },
    chips: [],
    chipSize: 34,
    map: { left: 975, top: 560, scale: 1 },
    stamp: { x: 1480, y: 430, font: 82 },
    stickers: {
      likes: { x: 1230, y: 260 },
      views: { x: 1770, y: 560 },
      dispo: { x: 1760, y: 250 },
      protect: { x: 1230, y: 720 },
      near: { x: 1745, y: 300 },
      money: { x: 1770, y: 600 },
    },
  },
  vertical: {
    phone: { x: 350, y: 660, scale: 0.9 },
    phoneCenter: { x: 540, y: 980 },
    logo: false,
    progress: { left: 0, top: 262, justify: "center" as const, font: 24 },
    header: { left: 60, top: 345, width: 960, num: 92, title: 62, subIndent: 116, sub: 32 },
    chips: [
      { x: 50, y: 760 },
      { x: 50, y: 850 },
      { x: 715, y: 760 },
      { x: 735, y: 850 },
    ],
    chipSize: 28,
    map: { left: 40, top: 930, scale: 0.85 },
    stamp: { x: 540, y: 980, font: 70 },
    stickers: {
      likes: { x: 220, y: 820 },
      views: { x: 860, y: 1000 },
      dispo: { x: 860, y: 1060 },
      protect: { x: 230, y: 1080 },
      near: { x: 850, y: 800 },
      money: { x: 850, y: 1160 },
    },
  },
};
const useSteps = () => (useLayout().vertical ? LAYOUTS.vertical : LAYOUTS.landscape);

/* ------------------------------------------------------------ écrans du téléphone */

/** Étape 1 : appareil photo (interface redessinée) sur la photo d'un article réel. */
const CameraScreen: React.FC<{ f: number }> = ({ f }) => {
  const shotAt = C.shoot;
  const zoom = interpolate(f, [0, shotAt], [1.3, 1.08], clamp);
  const flash = interpolate(f, [shotAt - 1, shotAt, shotAt + 9], [0, 1, 0], clamp);
  const focus = pop(f, 8, 10);
  const published = pop(f, C.online, 10, 170);
  const shot = f >= shotAt;
  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: FONT }}>
      <div style={{ position: "absolute", top: 40, left: 0, right: 0, height: 470, overflow: "hidden" }}>
        <Img src={staticFile("screens/photo-jean.png")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${shot ? 1 : zoom})` }} />
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
              transform: `translate(-50%, -50%) scale(${interpolate(focus, [0, 1], [1.7, 1])})`,
              opacity: focus,
            }}
          />
        )}
      </div>
      <div style={{ position: "absolute", top: 8, width: "100%", textAlign: "center", color: COLORS.sun, fontSize: 15, fontWeight: 700, letterSpacing: 2 }}>PHOTO</div>
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
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#fff", transform: `scale(${f > shotAt - 4 && f < shotAt + 3 ? 0.8 : 1})` }} />
      </div>
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
            transform: `scale(${pop(f, shotAt + 2)})`,
          }}
        >
          <Img src={staticFile("screens/photo-jean.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}
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
          transform: `translateY(${(1 - published) * 60}px) scale(${0.7 + 0.3 * published})`,
          opacity: Math.min(1, published * 1.5),
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
  const p = Math.min(smooth(f, start, 10), 1 - smooth(f, end, 10));
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
  const p = first ? 1 : smooth(f, at, 12);
  return <AbsoluteFill style={{ transform: `translateX(${(1 - p) * 100}%)`, background: "#f6f8f7" }}>{children}</AbsoluteFill>;
};

const PhoneScreens: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill>
    <Slide f={f} at={0} first>
      <CameraScreen f={f} />
    </Slide>
    {f >= S2 - 1 && (
      <Slide f={f} at={S2}>
        <Screenshot src="screens/annonce.png" scrollY={interpolate(f, [S2 + 10, S2 + 60], [0, 14], clamp)} />
      </Slide>
    )}
    {f >= C.pay - 1 && (
      <Slide f={f} at={C.pay}>
        <ProductHeader />
        <Screenshot src="screens/paiement.png" />
      </Slide>
    )}
    {f >= S3 - 1 && (
      <Slide f={f} at={S3}>
        <Screenshot src="screens/remise.png" />
      </Slide>
    )}
    <Notification f={f} start={C.sell} end={C.pay - 8} />
  </AbsoluteFill>
);

/* ------------------------------------------------------------ colonne de gauche */

const StepHeader: React.FC<{ index: number; f: number; start: number; end: number; titleAt: number | number[]; subAt: number | number[] }> = ({
  index,
  f,
  start,
  end,
  titleAt,
  subAt,
}) => {
  const Lay = useSteps().header;
  if (f < start - 1 || f > end) return null;
  const step = COPY.steps[index];
  const leave = index < 2 ? out(f, end - 6, end) : out(f, end - 8, end);
  const num = pop(f, start, 8, 200);
  return (
    <div
      style={{
        position: "absolute",
        left: Lay.left,
        top: Lay.top,
        width: Lay.width,
        fontFamily: FONT,
        opacity: leave,
        transform: `translateX(${(1 - leave) * -80}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: Lay.num * 0.27 }}>
        <div
          style={{
            width: Lay.num,
            height: Lay.num,
            borderRadius: "50%",
            background: COLORS.sun,
            color: COLORS.deep,
            fontWeight: 900,
            fontSize: Lay.num * 0.6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${num}) rotate(${(1 - num) * 180}deg)`,
            boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
            flexShrink: 0,
          }}
        >
          {index + 1}
        </div>
        <KineticText
          text={step.title}
          at={titleAt}
          style={{ fontWeight: 800, fontSize: Lay.title, color: "#fff", lineHeight: 1.05, letterSpacing: -1.5, textShadow: "0 6px 24px rgba(0,0,0,0.25)" }}
        />
      </div>
      <KineticText
        text={step.sub}
        at={subAt}
        stagger={2}
        style={{ marginTop: Lay.sub * 0.68, marginLeft: Lay.subIndent, fontWeight: 600, fontSize: Lay.sub, color: COLORS.lagoonLight, lineHeight: 1.3 }}
      />
    </div>
  );
};

const Progress: React.FC<{ f: number }> = ({ f }) => {
  const active = f < S2 ? 0 : f < S3 ? 1 : 2;
  const appear = pop(f, 2, 14);
  const Lay = useSteps().progress;
  return (
    <div
      style={{
        position: "absolute",
        left: Lay.left,
        right: Lay.justify === "center" ? 0 : undefined,
        top: Lay.top,
        display: "flex",
        justifyContent: Lay.justify,
        gap: 14,
        transform: `translateY(${(1 - appear) * -30}px)`,
        opacity: appear,
        fontFamily: FONT,
      }}
    >
      {COPY.stepLabels.map((label, i) => {
        const on = i === active;
        const done = i < active;
        const bump = on ? pop(f, [0, S2, S3][i], 8, 220) : 1;
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
              fontSize: Lay.font,
              transform: `scale(${0.85 + 0.15 * bump})`,
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
  const items: { label: string; icon: IconName; at: number }[] = [
    { label: COPY.payChips[2], icon: "swap", at: C.swap },
    { label: COPY.payChips[3], icon: "gift", at: C.give },
    { label: COPY.payChips[0], icon: "card", at: C.card },
    { label: COPY.payChips[1], icon: "cash", at: C.cash },
  ];
  const { vertical } = useLayout();
  const Lay = useSteps();
  if (f < S2 || f > S3) return null;
  const leave = out(f, S3 - 6, S3);
  const chip = (it: (typeof items)[number], i: number, style?: React.CSSProperties) => {
    const s = pop(f, it.at, 9, 200);
    return (
      <div key={it.label} style={{ transform: `scale(${s}) rotate(${(1 - s) * -15 + (vertical ? (i % 2 ? 4 : -4) : 0)}deg)`, ...style }}>
        <Chip icon={it.icon} label={it.label} size={Lay.chipSize} />
      </div>
    );
  };
  if (vertical) {
    // Format vertical : pastilles de part et d'autre du téléphone
    return (
      <div style={{ position: "absolute", inset: 0, opacity: leave, zIndex: 25 }}>
        {items.map((it, i) => chip(it, i, { position: "absolute", left: Lay.chips[i].x, top: Lay.chips[i].y }))}
      </div>
    );
  }
  return (
    <div style={{ position: "absolute", left: 290, top: 640, display: "flex", flexWrap: "wrap", gap: 18, width: 700, opacity: leave }}>
      {items.map((it, i) => chip(it, i))}
    </div>
  );
};

/** Mini-carte de La Réunion avec des points relais qui apparaissent. */
const RelayMap: React.FC<{ f: number }> = ({ f }) => {
  const Lay = useSteps().map;
  if (f < S3) return null;
  const card = pop(f, C.relay, 10, 170);
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
        left: Lay.left,
        top: Lay.top,
        width: 330,
        height: 300,
        borderRadius: 34,
        background: "#fff",
        boxShadow: "0 25px 60px rgba(0,20,15,0.35)",
        transform: `scale(${card * Lay.scale}) rotate(${-4 - (1 - card) * 20}deg)`,
        transformOrigin: Lay.scale === 1 ? undefined : "0 0",
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
        <path
          d="M70 40 C110 15 175 18 215 40 C255 60 285 105 282 150 C279 195 240 225 185 228 C130 231 70 215 40 180 C10 145 18 75 70 40 Z"
          fill="rgba(43,179,163,0.18)"
          stroke={COLORS.lagoon}
          strokeWidth={3}
        />
        <path d="M120 95 C140 80 165 85 175 105 C185 125 165 145 145 140 C125 135 110 112 120 95 Z" fill="rgba(19,106,93,0.18)" />
        {pins.map((p, i) => {
          const s = pop(f, C.relay + 6 + i * 7, 8, 220);
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

/** Tampon « VENDU ! » posé sur le téléphone à la fin de l'étape 3. */
const SoldStamp: React.FC<{ f: number }> = ({ f }) => {
  const Lay = useSteps().stamp;
  if (f < C.sold) return null;
  const s = pop(f, C.sold, 9, 260);
  return (
    <div
      style={{
        position: "absolute",
        left: Lay.x,
        top: Lay.y,
        transform: `translate(-50%, -50%) rotate(-12deg) scale(${interpolate(s, [0, 1], [2.4, 1])})`,
        opacity: Math.min(1, s * 1.6),
        padding: "16px 40px",
        borderRadius: 24,
        border: `9px solid ${COLORS.coral}`,
        background: "rgba(255,255,255,0.95)",
        color: COLORS.coral,
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: Lay.font,
        letterSpacing: 2,
        whiteSpace: "nowrap",
        boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
        zIndex: 30,
      }}
    >
      VENDU !
    </div>
  );
};

/* ------------------------------------------------------------ scène */

export const StepsScene: React.FC = () => {
  const f = useCurrentFrame();
  const enter = pop(f, 0, 12, 120);
  const bob = Math.sin(f / 18) * 10;
  // le téléphone "pivote" à chaque changement d'écran
  const swing = [S2, C.pay, S3].reduce((acc, t) => acc + Math.sin(Math.min(1, Math.max(0, (f - t) / 14)) * Math.PI) * 14, 0);
  const rotY = -12 + swing * -1;
  const step = f < S2 ? 0 : f < S3 ? 1 : 2;
  const groove = Math.round(GROOVE_START_30S * FPS) - T30.step1;
  const Lay = useSteps();
  const { vertical } = useLayout();
  const st = Lay.stickers;
  const pc = Lay.phoneCenter;

  return (
    <AbsoluteFill>
      <TropicalBackground variant="deep" />
      <Camera duration={STEPS_DURATION} zoom={[1, 1.04]} punches={[S2, S3, C.shoot, C.online, C.sold]} pulse={groove}>
        {Lay.logo && (
          <div style={{ position: "absolute", left: 150, top: 62 }}>
            <Logo width={250} color="#fff" />
          </div>
        )}
        <Progress f={f} />
        <StepHeader index={0} f={f} start={0} end={S2} titleAt={[3, 6, 9, 12, 14]} subAt={C.online - 4} />
        <StepHeader index={1} f={f} start={S2} end={S3} titleAt={[C.sell, C.swap, C.give, C.give + 2]} subAt={[C.pay, C.pay + 3, C.card, C.cash, C.cash + 2, C.cash + 4]} />
        <StepHeader index={2} f={f} start={S3} end={STEPS_DURATION} titleAt={[S3 + 3, C.handover]} subAt={[C.handover, C.handover + 2, C.handover + 4, C.relay - 4, C.relay - 2, C.relay, C.relay + 2, C.shop - 4, C.shop - 2, C.shop, C.shop + 10, C.shop + 12, C.shop + 14, C.shop + 16]} />
        <PayChips f={f} />
        <RelayMap f={f} />
        <div
          style={{
            position: "absolute",
            left: Lay.phone.x,
            top: Lay.phone.y,
            perspective: 1600,
            transformOrigin: "50% 0",
            transform: vertical
              ? `translateY(${(1 - enter) * 1200 + bob}px) scale(${Lay.phone.scale})`
              : `translateX(${(1 - enter) * 900}px) translateY(${bob}px)`,
          }}
        >
          <div style={{ transform: `rotateY(${vertical ? rotY * 0.6 : rotY}deg) rotateZ(${(vertical ? 0 : 2) + (1 - enter) * 20}deg)` }}>
            <Phone width={PHONE_W} navActive={step === 0 ? 2 : step === 1 ? 3 : 0} nav={step !== 0}>
              <PhoneScreens f={f} />
            </Phone>
          </div>
        </div>
        {/* stickers autour du téléphone */}
        <Sticker {...st.likes} at={C.online + 8} until={S2 - 4} icon="heart" label="12 favoris" tilt={-6} />
        <Sticker {...st.views} at={C.online + 16} until={S2 - 2} icon="search" label="48 vues" color={COLORS.lagoon} tilt={5} />
        <Sticker {...st.dispo} at={C.sell + 10} until={C.pay} icon="message" label="Dispo ?" color={COLORS.primary} tilt={6} />
        <Sticker {...st.protect} at={C.card + 4} until={S3 - 2} icon="check" label="Paiement protégé" color={COLORS.primary} tilt={-4} />
        <Sticker {...st.near} at={C.handover + 6} until={C.sold} icon="users" label="Près de chez toi" color={COLORS.lagoon} tilt={4} />
        <SoldStamp f={f} />
        <Sticker {...st.money} at={C.sold + 6} icon="coins" label="+25 €" color={COLORS.sun} tilt={-6} />
        <Confetti at={C.online} x={pc.x} y={pc.y} count={50} seed="online" spread={0.8} />
        <Confetti at={C.sold} x={pc.x} y={pc.y - 20} count={70} seed="sold" />
      </Camera>
    </AbsoluteFill>
  );
};
