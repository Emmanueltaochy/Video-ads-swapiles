/**
 * Reel Swap'Îles — script v3 (« le parcours de la robe », 22,4 s, 1080×1920).
 * Mêmes plans Kling que la version dynamique, remontés sur la voix du script v3
 * (exports/script-pub-swapiles-v3.md) : un atout réel de la plateforme par étape, « gratuit » une seule fois, à l'écran.
 * Textes dans la zone utile Reels : 250 → 1250 px de haut, 60 → 940 px de large.
 * L'audio est mixé à part (scripts/reel-robe/mix_v3.py).
 */
import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile } from "remotion";
import { Emo, EndCard, HoloOverlay, PopText, RR_FPS, Shot, ShotDef } from "./ReelRobe";

export const V3_DURATION = Math.round(22.4 * RR_FPS);
const s = (sec: number) => Math.round(sec * RR_FPS);

/** Timeline : coupes calées sur le début des répliques (voix posée à 1,1 s). */
export const V3_SHOTS: ShotDef[] = [
  { src: "ouverture.mp4", from: 0, to: 1.0, srcStart: 0, rate: 2.0, zoom: [1.0, 1.1] },
  { src: "plan1.mp4", from: 1.0, to: 2.65, srcStart: 0.3, rate: 1.2, zoom: [1.06, 1.16], origin: "50% 40%", enter: "punch" },
  { src: "plan3.mp4", from: 2.65, to: 4.2, srcStart: 0.2, rate: 1.2, zoom: [1.04, 1.12], origin: "50% 45%", enter: "whipL" },
  { src: "plan2.mp4", from: 4.2, to: 4.85, srcStart: 0.6, rate: 1.3, zoom: [1.08, 1.14], origin: "45% 35%", enter: "whipR" },
  { src: "holo.mp4", from: 4.85, to: 7.0, srcStart: 0.9, rate: 0.94, zoom: [1.0, 1.08], origin: "50% 45%", enter: "flash" },
  { src: "plan3.mp4", from: 7.0, to: 9.6, srcStart: 2.2, rate: 1.0, zoom: [1.12, 1.22], origin: "55% 35%", enter: "whipL" },
  { src: "plan4.mp4", from: 9.6, to: 11.2, srcStart: 0.0, rate: 1.2, zoom: [1.04, 1.12], origin: "50% 40%", enter: "whipR" },
  { src: "plan5.mp4", from: 11.2, to: 13.1, srcStart: 0.0, rate: 1.3, zoom: [1.02, 1.12], origin: "50% 55%", enter: "whipL" },
  { src: "plan5.mp4", from: 13.1, to: 14.9, srcStart: 3.1, rate: 1.3, zoom: [1.25, 1.35], origin: "45% 60%", enter: "punch" },
  { src: "plan4.mp4", from: 14.9, to: 16.8, srcStart: 2.6, rate: 1.1, zoom: [1.14, 1.22], origin: "50% 45%", enter: "whipR" },
  { src: "plan6.mp4", from: 16.8, to: 18.3, srcStart: 0.0, rate: 1.25, zoom: [1.06, 1.14], origin: "50% 50%", enter: "whipL" },
  { src: "plan6.mp4", from: 18.3, to: 19.7, srcStart: 3.1, rate: 1.15, zoom: [1.0, 1.06], origin: "50% 60%", enter: "punch" },
];
export const V3_END = 19.7;
/** Carte holographique : flash à 1,5 s du clip (≈ 5,5 s), carte visible dès 2,0 s du clip (≈ 6,0 s). */
const HOLO_AT = 6.0;

export const ReelRobeV3: React.FC<{ withAudio?: boolean }> = ({ withAudio = true }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    {V3_SHOTS.map((d, i) => (
      <Sequence key={i} from={s(d.from)} durationInFrames={s(d.to - d.from)}>
        <Shot d={d} />
      </Sequence>
    ))}
    <HoloOverlay at={HOLO_AT} until={7.0} />
    <PopText
      from={1.1}
      to={2.65}
      top={960}
      lines={[
        { text: "ELLE DORT DANS", size: 76 },
        {
          text: (
            <>
              TON ARMOIRE ? <Emo c="👀" />
            </>
          ),
          size: 76,
          bg: "#f97316",
        },
      ]}
    />
    <PopText
      from={2.75}
      to={4.2}
      top={1000}
      lines={[
        { text: "QUELQU'UN", size: 80 },
        {
          text: (
            <>
              LA CHERCHE, ICI <Emo c="📍" />
            </>
          ),
          size: 72,
          bg: "#f97316",
        },
      ]}
    />
    <PopText
      from={5.2}
      to={7.0}
      top={720}
      left={60}
      width={440}
      align="flex-start"
      lines={[
        { text: "TU FIXES", size: 76 },
        { text: "TON PRIX", size: 76, bg: "#f97316" },
        { text: "Dépôt gratuit", size: 40, bg: "rgba(2,11,18,0.78)" },
      ]}
    />
    <PopText
      from={7.2}
      to={9.6}
      top={1000}
      lines={[
        {
          text: (
            <>
              FAIS UNE OFFRE <Emo c="💬" />
            </>
          ),
          size: 76,
          bg: "#f97316",
        },
      ]}
    />
    <PopText
      from={9.7}
      to={11.2}
      top={1000}
      lines={[
        {
          text: (
            <>
              MAIN PROPRE <Emo c="🤝" />
            </>
          ),
          size: 80,
          bg: "#f97316",
        },
      ]}
    />
    <PopText
      from={11.3}
      to={13.1}
      top={680}
      lines={[
        { text: "POINT RELAIS", size: 80 },
        {
          text: (
            <>
              CHEZ TON COMMERÇANT <Emo c="🏪" />
            </>
          ),
          size: 54,
          bg: "#f97316",
        },
      ]}
    />
    <PopText
      from={13.2}
      to={16.8}
      top={760}
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
    <Sequence from={s(13.4)} durationInFrames={s(16.8 - 13.4)}>
      <div style={{ position: "absolute", left: 60, width: 880, top: 1040, display: "flex", justifyContent: "center" }}>
        <div style={{ padding: "12px 22px", borderRadius: 16, background: "rgba(2,11,18,0.78)", fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 30, lineHeight: 1.3, color: "#fff", textAlign: "center" }}>
          <div style={{ whiteSpace: "nowrap" }}>Paiement par carte bloqué jusqu'à la réception.</div>
          <div style={{ whiteSpace: "nowrap" }}>Protection acheteur : 10 % du prix</div>
          <div style={{ whiteSpace: "nowrap" }}>(0,50 € min, 15 € max).</div>
          <div style={{ whiteSpace: "nowrap", color: "#99f6e4" }}>Conditions sur swapiles.com</div>
        </div>
      </div>
    </Sequence>
    <EndCard at={V3_END} cta="Télécharge l'appli" />
    {withAudio && <Html5Audio src={staticFile("reelrobe/mix-v3.wav")} />}
  </AbsoluteFill>
);
