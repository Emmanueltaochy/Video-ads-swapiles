import React from "react";
import { Html5Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Icon, IconName } from "../components/Icons";
import { CornerLogo, Decor, EndCard, enter, Frame, M, MUSIC_VOLUME, PhotoCard, SAFE, Shot, springIn, Subtitle, Title } from "./kit";
import { CITIES, REUNION_PATH, REUNION_VIEWBOX } from "./reunionGeo";

/** Silhouette de La Réunion (contour réel), tracé puis rempli. */
const Island: React.FC<{ x: number; y: number; w: number; at: number; fill: string; stroke: string; draw?: boolean }> = ({ x, y, w, at, fill, stroke, draw }) => {
  const f = useCurrentFrame();
  const k = w / REUNION_VIEWBOX.w;
  const line = draw ? interpolate(f, [at, at + 30], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const fillO = draw ? enter(f, at + 18, 20) : enter(f, at, 12);
  return (
    <svg
      width={w}
      height={REUNION_VIEWBOX.h * k}
      viewBox={`0 0 ${REUNION_VIEWBOX.w} ${REUNION_VIEWBOX.h}`}
      style={{ position: "absolute", left: x, top: y, overflow: "visible" }}
    >
      <path d={REUNION_PATH} fill={fill} fillOpacity={fillO} stroke={stroke} strokeWidth={6} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={line} />
    </svg>
  );
};

/** Repère de ville (position GPS réelle projetée). */
const CityPin: React.FC<{ x: number; y: number; name: string; at: number; side: "left" | "right" | "below" }> = ({ x, y, name, at, side }) => {
  const f = useCurrentFrame();
  const p = springIn(f, at);
  const ring = interpolate(f - at, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const label: React.CSSProperties =
    side === "right"
      ? { left: x + 22, top: y - 21 }
      : side === "left"
        ? { right: 1080 - (x - 22), top: y - 21 }
        : { left: x - 100, width: 200, top: y + 18, textAlign: "center" };
  return (
    <>
      <div style={{ position: "absolute", left: x - 30 * ring, top: y - 30 * ring, width: 60 * ring, height: 60 * ring, borderRadius: "50%", border: `3px solid ${M.teal}`, opacity: 1 - ring }} />
      <div
        style={{
          position: "absolute",
          left: x - 13,
          top: y - 13,
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: M.teal,
          border: "4px solid #fff",
          boxShadow: "0 4px 10px rgba(19,78,74,0.3)",
          transform: `scale(${p})`,
        }}
      />
      <div style={{ position: "absolute", ...label, fontWeight: 700, fontSize: 30, color: M.ink, whiteSpace: "nowrap", opacity: Math.min(1, p * 1.5) }}>{name}</div>
    </>
  );
};

const CATS: IconName[] = ["onesie", "shoe", "teddy", "home", "bike"];

/** Angle C — Tout est déjà sur l'île (15 s). Script : section « Angle C » du document de campagne. */
export const AdC: React.FC<{ qa?: boolean }> = ({ qa }) => {
  const f = useCurrentFrame();
  const W2 = 560;
  const X2 = (1080 - 140 - W2) / 2 + 30; // centré dans la zone sûre
  const Y2 = 572;
  const k = W2 / REUNION_VIEWBOX.w;
  const side: Record<string, "left" | "right" | "below"> = {
    "Saint-Denis": "right",
    "Saint-Paul": "left",
    "Saint-Pierre": "below",
    "Le Tampon": "right",
    "Saint-André": "right",
    "Saint-Benoît": "right",
  };
  return (
    <Frame qa={qa}>
      <Decor />
      <CornerLogo until={356} />

      {/* 0-3 s : silhouette de La Réunion en aplat teal */}
      <Shot from={0} to={88}>
        <Title lines={["Pensée pour les îles"]} at={0} />
        <Island x={SAFE.left + 140} y={500} w={600} at={2} fill={M.teal} stroke={M.teal} draw />
      </Shot>

      {/* 3-8 s : annonces à La Réunion — repères sur les villes + icônes de catégories */}
      <Shot from={90} to={238}>
        <Title lines={["Annonces à La Réunion"]} at={92} />
        <div style={{ position: "absolute", left: SAFE.left, top: 456, display: "flex", gap: 18 }}>
          {CATS.map((c, i) => {
            const p = springIn(f, 100 + i * 6);
            return (
              <div
                key={c}
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: 22,
                  background: M.white,
                  border: `2px solid ${M.tealLight}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${p})`,
                  boxShadow: "0 8px 20px rgba(19,78,74,0.10)",
                }}
              >
                <Icon name={c} size={46} color={M.teal} strokeWidth={1.9} />
              </div>
            );
          })}
        </div>
        <Island x={X2} y={Y2} w={W2} at={92} fill="#d7eeea" stroke={M.teal} />
        {CITIES.map((c, i) => (
          <CityPin key={c.name} x={X2 + c.x * k} y={Y2 + c.y * k} name={c.name} at={118 + i * 14} side={side[c.name]} />
        ))}
      </Shot>

      {/* 8-12 s : remise / point relais chez un commerçant */}
      <Shot from={240} to={358}>
        <Title lines={["Main propre, point relais,", "Colissimo"]} at={242} size={58} />
        <PhotoCard src="meta/photos/devanture.jpg" x={SAFE.left} y={528} w={880} h={552} at={244} zoom={[1.1, 1]} />
      </Shot>

      {/* 12-15 s : fin */}
      <Shot from={360} to={450} last>
        <EndCard at={362} />
      </Shot>

      <Subtitle
        cues={[
          { from: 0, to: 90, lines: ["Une appli de seconde main", "pensée pour les îles."] },
          { from: 90, to: 240, lines: ["Les annonces sont ici, à La Réunion."] },
          { from: 240, to: 305, lines: ["Je récupère en main propre,", "en point relais chez un commerçant,"] },
          { from: 305, to: 360, lines: ["ou par Colissimo."] },
          { from: 360, to: 450, lines: ["Inscris-toi sur Swap’Îles.", "Lien juste en dessous."] },
        ]}
      />
      {!qa && <Html5Audio src={staticFile("meta/audio/music-C.wav")} volume={MUSIC_VOLUME} />}
    </Frame>
  );
};
