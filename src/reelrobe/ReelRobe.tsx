/**
 * Reel Swap'Îles « robe jaune » — version DYNAMIQUE (22,4 s, 1080×1920).
 * Plans Kling 3.0 (cascade Langevin, armoire, photo, carte holographique, plage, sac, colis, robe),
 * coupes toutes les 1,2 à 2,6 s calées sur la voix, transitions whip / zoom-punch / flash,
 * mouvement de caméra permanent (push-in numérique), textes animés et carte de fin.
 * Textes dans la zone utile Reels : 250 → 1250 px de haut, 60 → 940 px de large.
 * L'audio (voix + musique + bruitages) est mixé à part (scripts/reel-robe/montage_v2.py).
 */
import React from "react";
import { AbsoluteFill, Easing, Html5Audio, interpolate, OffthreadVideo, random, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { Logo } from "../components/Logo";

export const RR_FPS = 30;
export const RR_DURATION = Math.round(22.4 * RR_FPS);

const FONT = "Poppins, 'Noto Color Emoji', sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const s = (sec: number) => Math.round(sec * RR_FPS);

type Enter = "cut" | "whipL" | "whipR" | "punch" | "flash";
export type ShotDef = {
  src: string;
  from: number; // s (timeline)
  to: number; // s (timeline)
  srcStart: number; // s (dans le clip)
  rate: number; // vitesse de lecture
  zoom?: [number, number]; // push-in numérique
  origin?: string;
  enter?: Enter;
};

/** Timeline : coupes calées sur le début des répliques de la voix (voix posée à 0,6 s). */
export const SHOTS: ShotDef[] = [
  { src: "ouverture.mp4", from: 0, to: 1.5, srcStart: 0, rate: 2.0, zoom: [1.0, 1.12] },
  { src: "plan1.mp4", from: 1.5, to: 2.8, srcStart: 0.3, rate: 1.3, zoom: [1.06, 1.16], origin: "50% 40%", enter: "punch" },
  { src: "plan2.mp4", from: 2.8, to: 4.0, srcStart: 0.4, rate: 1.3, zoom: [1.05, 1.15], origin: "45% 35%", enter: "whipL" },
  { src: "holo.mp4", from: 4.0, to: 6.6, srcStart: 0.6, rate: 0.94, zoom: [1.0, 1.08], origin: "50% 45%", enter: "whipL" },
  { src: "plan3.mp4", from: 6.6, to: 8.9, srcStart: 0.2, rate: 1.3, zoom: [1.04, 1.14], origin: "50% 45%", enter: "whipR" },
  { src: "plan4.mp4", from: 8.9, to: 11.4, srcStart: 0.0, rate: 1.2, zoom: [1.04, 1.14], origin: "50% 40%", enter: "whipL" },
  { src: "plan5.mp4", from: 11.4, to: 13.8, srcStart: 0.0, rate: 1.3, zoom: [1.02, 1.12], origin: "50% 55%", enter: "whipR" },
  { src: "plan5.mp4", from: 13.8, to: 15.2, srcStart: 3.1, rate: 1.3, zoom: [1.25, 1.35], origin: "45% 60%", enter: "punch" },
  { src: "plan6.mp4", from: 15.2, to: 17.0, srcStart: 0.0, rate: 1.25, zoom: [1.06, 1.14], origin: "50% 50%", enter: "whipL" },
  { src: "plan6.mp4", from: 17.0, to: 18.6, srcStart: 3.1, rate: 1.15, zoom: [1.0, 1.06], origin: "50% 60%", enter: "punch" },
];
export const END_CARD = 18.6;
/** Instants de transition (s) — pour les bruitages. */
export const CUTS = [...SHOTS.slice(1).map((x) => ({ t: x.from, kind: x.enter ?? "cut" })), { t: END_CARD, kind: "punch" as Enter }];

export const Shot: React.FC<{ d: ShotDef }> = ({ d }) => {
  const f = useCurrentFrame();
  const len = s(d.to - d.from);
  const [z0, z1] = d.zoom ?? [1, 1.08];
  const z = interpolate(f, [0, len], [z0, z1], clamp);
  const e = d.enter ?? "cut";
  const k = interpolate(f, [0, 6], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) }); // entrée
  const out = interpolate(f, [len - 4, len], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) }); // sortie
  let tx = 0;
  let extra = 1;
  let blur = 0;
  if (e === "whipL" || e === "whipR") {
    tx = (e === "whipL" ? 1 : -1) * 900 * k;
    blur = 26 * k;
  }
  if (e === "punch") {
    extra = 1 + 0.3 * k;
    blur = 10 * k;
  }
  blur += 14 * out;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `translateX(${tx}px) scale(${z * extra})`, transformOrigin: d.origin ?? "50% 50%", filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
        <OffthreadVideo src={staticFile(`reelrobe/${d.src}`)} startFrom={Math.round(d.srcStart * RR_FPS)} playbackRate={d.rate} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {e === "flash" && <AbsoluteFill style={{ background: "#fff", opacity: interpolate(f, [0, 2, 7], [1, 0.9, 0], clamp) }} />}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ textes animés */
const pop = (f: number, at: number) => spring({ frame: f - at, fps: RR_FPS, config: { damping: 9, stiffness: 220, mass: 0.6 } });

export const PopText: React.FC<{
  lines: { text: React.ReactNode; size?: number; color?: string; bg?: string }[];
  from: number;
  to: number;
  top: number;
  tilt?: number;
  left?: number;
  width?: number;
  align?: "center" | "flex-start";
}> = ({ lines, from, to, top, tilt = -3, left = 60, width = 880, align = "center" }) => {
  const f = useCurrentFrame();
  const a = s(from);
  const b = s(to);
  if (f < a || f >= b) return null;
  const outP = interpolate(f, [b - 5, b], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left, width, top, display: "flex", flexDirection: "column", alignItems: align, gap: 14 }}>
      {lines.map((l, i) => {
        const p = pop(f, a + i * 4);
        return (
          <div
            key={i}
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: l.size ?? 76,
              lineHeight: 1.08,
              color: l.color ?? "#ffffff",
              background: l.bg ?? "#0f766e",
              padding: "10px 26px 14px",
              borderRadius: 22,
              whiteSpace: "nowrap",
              textAlign: "center",
              boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
              transform: `rotate(${tilt}deg) scale(${Math.max(0, p) * outP})`,
              opacity: Math.min(1, p * 2) * outP,
            }}
          >
            {l.text}
          </div>
        );
      })}
    </div>
  );
};
export const Emo: React.FC<{ c: string }> = ({ c }) => <span style={{ fontFamily: "'Noto Color Emoji'", fontWeight: 400 }}>{c}</span>;

/* ------------------------------------------------------------------ carte holographique : logo, prix, coche, confettis */
// carte holographique : flash à 1,5 s du clip (≈ 4,96 s), carte visible dès 2,0 s (≈ 5,5 s), côté droit
export const HOLO = { at: 5.45, x: 720, y: 770, w: 440 };
export const HoloOverlay: React.FC<{ at?: number; until?: number }> = ({ at = HOLO.at, until = 6.6 }) => {
  const f = useCurrentFrame();
  const a = s(at);
  if (f < a || f >= s(until)) return null;
  const p1 = pop(f, a);
  const p2 = pop(f, a + 6);
  const p3 = pop(f, a + 12);
  const float = Math.sin((f - a) / 6) * 6;
  return (
    <>
      <div style={{ position: "absolute", left: HOLO.x - HOLO.w / 2, width: HOLO.w, top: 945 + float, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ padding: "8px 18px", borderRadius: 16, background: "rgba(255,255,255,0.94)", transform: `scale(${Math.max(0, p1)})`, boxShadow: "0 0 30px rgba(94,234,212,0.8)" }}>
          <Logo width={190} color="#0f766e" />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 76, lineHeight: 1, color: "#ffffff", textShadow: "0 0 24px rgba(20,184,166,0.9), 0 6px 18px rgba(0,0,0,0.5)", transform: `scale(${Math.max(0, p2)})` }}>15 €</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: "#ffffff", background: "#16a34a", borderRadius: 999, padding: "6px 26px", transform: `scale(${Math.max(0, p3)})`, boxShadow: "0 10px 24px rgba(0,0,0,0.35)" }}>Publié ✓</div>
      </div>
      {Array.from({ length: 46 }, (_, i) => {
        const dt = f - (a + 12);
        if (dt < 0 || dt > 40) return null;
        const ang = random(`ca-${i}`) * Math.PI * 2;
        const v = 14 + random(`cv-${i}`) * 18;
        const x = HOLO.x + Math.cos(ang) * v * dt;
        const y = HOLO.y + 40 + Math.sin(ang) * v * dt * 0.8 + 0.7 * dt * dt;
        const col = ["#facc15", "#14b8a6", "#ffffff", "#f97316", "#5eead4", "#f472b6"][i % 6];
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 16, height: 10, background: col, borderRadius: 2, opacity: 1 - dt / 40, transform: `rotate(${dt * 25 + i * 30}deg)` }} />;
      })}
    </>
  );
};

/* ------------------------------------------------------------------ carte de fin */
export const EndCard: React.FC<{ at?: number; cta?: string }> = ({ at = END_CARD, cta = "Inscris-toi" }) => {
  const f = useCurrentFrame() - s(at);
  if (f < 0) return null;
  const l = pop(f, 2);
  const w = pop(f, 10);
  const b = pop(f, 18);
  const pulse = 1 + 0.04 * Math.sin(f / 4) * (f > 30 ? 1 : 0);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: "blur(18px) brightness(0.55)", transform: "scale(1.15)" }}>
        <OffthreadVideo src={staticFile("reelrobe/plan6.mp4")} startFrom={s(4.6)} playbackRate={0.25} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(15,118,110,0.55), rgba(2,11,18,0.65))" }} />
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(f, [0, 3, 9], [0.8, 0.5, 0], clamp) }} />
      <div style={{ position: "absolute", left: 60, width: 880, top: 430, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ transform: `scale(${Math.max(0, l)})` }}>
          <Logo width={680} color="#ffffff" />
        </div>
        <div style={{ marginTop: 40, fontFamily: FONT, fontWeight: 800, fontSize: 70, color: "#ffffff", transform: `scale(${Math.max(0, w)})` }}>swapiles.com</div>
        <div style={{ marginTop: 48, padding: "26px 80px", borderRadius: 999, background: "#f97316", fontFamily: FONT, fontWeight: 900, fontSize: 66, color: "#ffffff", boxShadow: "0 0 50px rgba(249,115,22,0.6), 0 14px 30px rgba(0,0,0,0.35)", transform: `scale(${Math.max(0, b) * pulse})`, whiteSpace: "nowrap" }}>
          {cta}
        </div>
        {f > 30 && <div style={{ marginTop: 26, fontFamily: FONT, fontWeight: 800, fontSize: 64, color: "#ffffff", transform: `translateY(${Math.abs(Math.sin(f / 5)) * 16}px)` }}>↓</div>}
      </div>
    </AbsoluteFill>
  );
};

export const ReelRobe: React.FC<{ withAudio?: boolean }> = ({ withAudio = true }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    {SHOTS.map((d, i) => (
      <Sequence key={i} from={s(d.from)} durationInFrames={s(d.to - d.from)}>
        <Shot d={d} />
      </Sequence>
    ))}
    <HoloOverlay />
    <PopText
      from={1.6}
      to={3.9}
      top={960}
      lines={[
        {
          text: (
            <>
              TON ARMOIRE
            </>
          ),
          size: 80,
        },
        {
          text: (
            <>
              DÉBORDE ? <Emo c="👀" />
            </>
          ),
          size: 80,
          bg: "#f97316",
        },
      ]}
    />
    <PopText from={5.3} to={6.6} top={760} left={60} width={460} align="flex-start" lines={[{ text: "VENDRE", size: 80 }, { text: "= GRATUIT", size: 80, bg: "#f97316" }]} />
    <PopText
      from={9.1}
      to={11.4}
      top={1000}
      lines={[
        { text: "MAIN PROPRE", size: 80 },
        {
          text: (
            <>
              = GRATUIT <Emo c="🤝" />
            </>
          ),
          size: 80,
          bg: "#f97316",
        },
      ]}
    />
    <PopText
      from={11.6}
      to={15.2}
      top={640}
      lines={[
        { text: "PAIEMENT", size: 80 },
        {
          text: (
            <>
              PROTÉGÉ <Emo c="🛡️" />
            </>
          ),
          size: 80,
          bg: "#f97316",
        },
      ]}
    />
    {/* mention obligatoire, petite mais lisible */}
    <Sequence from={s(11.9)} durationInFrames={s(15.2 - 11.9)}>
      <div style={{ position: "absolute", left: 60, width: 880, top: 1040, display: "flex", justifyContent: "center" }}>
        <div style={{ padding: "12px 22px", borderRadius: 16, background: "rgba(2,11,18,0.78)", fontFamily: FONT, fontWeight: 600, fontSize: 30, lineHeight: 1.3, color: "#fff", textAlign: "center" }}>
          <div style={{ whiteSpace: "nowrap" }}>Protection acheteur : 10 % du prix</div>
          <div style={{ whiteSpace: "nowrap" }}>(0,50 € min, 15 € max).</div>
          <div style={{ whiteSpace: "nowrap", color: "#99f6e4" }}>Conditions sur swapiles.com</div>
        </div>
      </div>
    </Sequence>
    <EndCard />
    {withAudio && <Html5Audio src={staticFile("reelrobe/mix.wav")} />}
  </AbsoluteFill>
);
