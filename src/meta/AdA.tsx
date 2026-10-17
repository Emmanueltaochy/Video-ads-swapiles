import React from "react";
import { Html5Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Capture, CornerLogo, Decor, EndCard, Frame, Highlight, MUSIC_VOLUME, PhotoCard, Pill, SAFE, ScreenWindow, Shot, Subtitle, Tap, Title } from "./kit";
import { RECTS } from "./rects";

/** Fenêtre d'interface commune (px de la vidéo). */
const WIN = { x: 100, y: 528, w: 800, h: 552 };
const S = WIN.w / 1170; // échelle capture -> vidéo

/** Angle A — Vide ton dressing (15 s). Script : section « Angle A » du document de campagne. */
export const AdA: React.FC<{ qa?: boolean }> = ({ qa }) => {
  const f = useCurrentFrame();

  // 3-8 s : dépôt d'annonce animé (photo -> prix -> Publier)
  const add = RECTS["depot-photos-vide"]["add-photos"];
  const prix = RECTS["depot-prix"].prix;
  const scrollPhotos = 380;
  const tapAdd = 116;
  const prixH = RECTS["depot-prix"].h; // la capture « Publier » est empilée sous celle du prix
  const scrollPrix = interpolate(f, [186, 200], [0, prixH + 264 - WIN.h / S], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tapPublish = 212;
  const prixImg = f < 158 ? "depot-prix-vide" : f < 166 ? "depot-prix-2" : "depot-prix";

  // 8-12 s : mode de remise
  const remise = RECTS.remise;
  const scrollRemise = 290;

  return (
    <Frame qa={qa}>
      <Decor />
      <CornerLogo until={356} />

      {/* 0-3 s : l'armoire pleine */}
      <Shot from={0} to={88}>
        <Title lines={["Tout ça,", "en vente ce matin"]} at={0} />
        <PhotoCard src="meta/photos/armoire.jpg" x={SAFE.left} y={WIN.y} w={880} h={WIN.h} at={0} zoom={[1.12, 1]} dur={100} />
      </Shot>

      {/* 3-8 s : dépôt d'annonce */}
      <Shot from={90} to={238}>
        <Title lines={["Dépôt d’annonce", "gratuit"]} at={92} />
        <ScreenWindow {...WIN} at={92}>
          {f < 150 && (
            <>
              <Capture src={`meta/ui/${f < 122 ? "depot-photos-vide" : "depot-photos-ok"}.png`} width={WIN.w} scrollY={scrollPhotos * S} />
            </>
          )}
          {f >= 150 && (
            <>
              <Capture src={`meta/ui/${prixImg}.png`} width={WIN.w} scrollY={scrollPrix * S} />
              <div style={{ position: "absolute", left: 0, top: (prixH - scrollPrix) * S, width: WIN.w }}>
                <Capture src={`meta/ui/${f >= tapPublish && f < tapPublish + 8 ? "depot-publier-presse" : "depot-publier"}.png`} width={WIN.w} />
              </div>
            </>
          )}
        </ScreenWindow>
        <Tap x={WIN.x + (add.x + add.w / 2) * S} y={WIN.y + (add.y + add.h / 2 - scrollPhotos) * S} at={tapAdd} />
        {f >= 150 && f < 186 && (
          <Highlight x={WIN.x + prix.x * S} y={WIN.y + prix.y * S} w={prix.w * S} h={prix.h * S} at={168} radius={18} />
        )}
        <Tap x={WIN.x + 585 * S} y={WIN.y + (prixH + 132 - (prixH + 264 - WIN.h / S)) * S} at={tapPublish} />
        {f >= tapPublish + 6 && <Pill text="✓ Annonce en ligne" x={322} y={436} at={tapPublish + 6} size={34} strong />}
      </Shot>

      {/* 8-12 s : main propre ou point relais */}
      <Shot from={240} to={358}>
        <Title lines={["Main propre", "ou point relais"]} at={242} />
        <ScreenWindow {...WIN} at={242}>
          <Capture src="meta/ui/remise.png" width={WIN.w} scrollY={scrollRemise * S} />
        </ScreenWindow>
        <Highlight
          x={WIN.x + remise["main-propre"].x * S}
          y={WIN.y + (remise["main-propre"].y - scrollRemise) * S}
          w={remise["main-propre"].w * S}
          h={remise["main-propre"].h * S}
          at={258}
        />
        <Highlight
          x={WIN.x + remise.relais.x * S}
          y={WIN.y + (remise.relais.y - scrollRemise) * S}
          w={remise.relais.w * S}
          h={remise.relais.h * S}
          at={290}
        />
      </Shot>

      {/* 12-15 s : fin */}
      <Shot from={360} to={450} last>
        <EndCard at={362} />
      </Shot>

      <Subtitle
        cues={[
          { from: 0, to: 90, lines: ["Tout ça, je l’ai mis en vente ce matin."] },
          { from: 90, to: 240, lines: ["Une photo, un prix, c’est en ligne.", "Le dépôt est gratuit."] },
          { from: 240, to: 360, lines: ["Je remets en main propre", "ou en point relais, près de chez moi."] },
          { from: 360, to: 450, lines: ["Inscris-toi sur Swap’Îles.", "Lien juste en dessous."] },
        ]}
      />
      {!qa && <Html5Audio src={staticFile("meta/audio/music-A.wav")} volume={MUSIC_VOLUME} />}
    </Frame>
  );
};
