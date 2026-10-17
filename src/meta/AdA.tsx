import React from "react";
import { Html5Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Capture, CornerLogo, Decor, EndCard, Frame, Highlight, LAY, MUSIC_VOLUME, PhotoCard, Pill, SAFE, SAFE_W, ScreenWindow, Shot, Subtitle, Tap, Title, UI_BOTTOM, uiRect } from "./kit";
import { RECTS } from "./rects";

/** Fenêtre d'interface commune (px de la vidéo) : toute la largeur autorisée, jusqu'au sous-titre. */
const WIN = { x: SAFE.left, y: LAY.vis2, w: SAFE_W, h: UI_BOTTOM - LAY.vis2 };

/** Angle A — Vide ton dressing (15 s). Script : section « Angle A » du document de campagne. */
export const AdA: React.FC<{ qa?: boolean }> = ({ qa }) => {
  const f = useCurrentFrame();

  // 3-8 s : dépôt d'annonce animé (photo -> prix -> Publier)
  const add = RECTS["depot-photos-vide"]["add-photos"];
  const prix = RECTS["depot-prix"].prix;
  const scrollPhotos = 440;
  const tapAdd = 116;
  const prixH = RECTS["depot-prix"].h; // la capture « Publier » est empilée sous celle du prix
  const scrollPrix = interpolate(f, [186, 200], [300, 560], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tapPublish = 212;
  const prixImg = f < 158 ? "depot-prix-vide" : f < 166 ? "depot-prix-2" : "depot-prix";
  const addR = uiRect(WIN, add, scrollPhotos);
  const pubR = uiRect(WIN, { x: 585, y: prixH + 132, w: 0, h: 0 }, 560);

  // 8-12 s : mode de remise (main propre, puis défilement vers les points relais)
  const remise = RECTS.remise;
  const scrollRemise = interpolate(f, [278, 292], [300, 560], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Frame qa={qa}>
      <Decor />
      <CornerLogo until={356} />

      {/* 0-3 s : l'armoire pleine */}
      <Shot from={0} to={88}>
        <Title lines={["Tout ça,", "en vente ce matin"]} at={0} />
        <PhotoCard src="meta/photos/armoire.jpg" x={WIN.x} y={WIN.y} w={WIN.w} h={LAY.bottom - WIN.y} at={0} zoom={[1.12, 1]} dur={100} />
      </Shot>

      {/* 3-8 s : dépôt d'annonce */}
      <Shot from={90} to={238}>
        <Title lines={["Dépôt d’annonce", "gratuit"]} at={92} />
        <ScreenWindow {...WIN} at={92}>
          {f < 150 && <Capture src={`meta/ui/${f < 122 ? "depot-photos-vide" : "depot-photos-ok"}.png`} scrollY={scrollPhotos} />}
          {f >= 150 && (
            <>
              <Capture src={`meta/ui/${prixImg}.png`} scrollY={scrollPrix} />
              <Capture src={`meta/ui/${f >= tapPublish && f < tapPublish + 8 ? "depot-publier-presse" : "depot-publier"}.png`} top={prixH} scrollY={scrollPrix} />
            </>
          )}
        </ScreenWindow>
        <Tap x={addR.x + addR.w / 2} y={addR.y + addR.h / 2} at={tapAdd} />
        {f >= 150 && f < 186 && <Highlight {...uiRect(WIN, prix, 300)} at={168} radius={18} />}
        <Tap x={pubR.x} y={pubR.y} at={tapPublish} />
        {f >= tapPublish + 6 && <Pill text="✓ Annonce en ligne" x={322} y={LAY.titleTop + 76} at={tapPublish + 6} size={34} strong />}
      </Shot>

      {/* 8-12 s : main propre ou point relais */}
      <Shot from={240} to={358}>
        <Title lines={["Main propre", "ou point relais"]} at={242} />
        <ScreenWindow {...WIN} at={242}>
          <Capture src="meta/ui/remise.png" scrollY={scrollRemise} />
        </ScreenWindow>
        {f < 278 && <Highlight {...uiRect(WIN, remise["main-propre"], 300)} at={258} />}
        {f >= 292 && <Highlight {...uiRect(WIN, remise.relais, 560)} at={294} />}
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
