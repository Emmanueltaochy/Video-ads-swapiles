import React from "react";
import { Html5Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Capture, CornerLogo, Decor, EndCard, Frame, Highlight, MUSIC_VOLUME, PhotoCard, Pill, PROTECTION_LINES, SAFE, ScreenWindow, Shot, Subtitle, Title } from "./kit";
import { RECTS } from "./rects";

const WIN = { x: 100, y: 612, w: 800, h: 468 };
const S = WIN.w / 1170;

/** Angle B — Achète sans te faire avoir (15 s). Script : section « Angle B » du document de campagne. */
export const AdB: React.FC<{ qa?: boolean }> = ({ qa }) => {
  const f = useCurrentFrame();
  const pay = RECTS.paiement;
  // défilement : récapitulatif du prix, puis encadré « paiement protégé »
  const SCROLL0 = 560; // cadré sur le détail du prix
  const scroll = interpolate(f, [176, 196], [SCROLL0, pay.h - WIN.h / S], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Frame qa={qa}>
      <Decor />
      <CornerLogo until={386} />

      {/* 0-3 s : colis à la réception */}
      <Shot from={0} to={88}>
        <Title lines={["Payée à la réception"]} at={0} />
        <PhotoCard src="meta/photos/reception.jpg" x={SAFE.left + 2} y={470} w={874} h={610} at={0} objectPosition="62% 50%" zoom={[1.1, 1]} dur={100} />
      </Shot>

      {/* 3-9 s : paiement protégé + détail du prix */}
      <Shot from={90} to={268}>
        <Title lines={["Paiement protégé"]} at={92} />
        <Pill text={PROTECTION_LINES} x={SAFE.left} y={452} at={98} size={38} strong />
        <ScreenWindow {...WIN} at={100}>
          <Capture src="meta/ui/paiement.png" width={WIN.w} scrollY={scroll * S} />
        </ScreenWindow>
        {f < 176 && (
          <Highlight
            x={WIN.x + pay.protection.x * S}
            y={WIN.y + (pay.protection.y - SCROLL0) * S}
            w={pay.protection.w * S}
            h={pay.protection.h * S}
            at={122}
            radius={14}
          />
        )}
        {f >= 196 && (
          <Highlight
            x={WIN.x + pay.note.x * S}
            y={WIN.y + (pay.note.y - (pay.h - WIN.h / S)) * S}
            w={pay.note.w * S}
            h={pay.note.h * S}
            at={200}
          />
        )}
      </Shot>

      {/* 9-13 s : colis ouvert, vêtement déplié */}
      <Shot from={270} to={388}>
        <Title lines={["Remboursée si non reçu", "ou non conforme"]} at={272} />
        <PhotoCard src="meta/photos/carton-ouvert.jpg" x={SAFE.left} y={560} w={500} h={500} at={274} rotate={-3} zoom={[1.06, 1]} />
        <PhotoCard src="meta/photos/plies.jpg" x={410} y={600} w={500} h={460} at={286} rotate={3} zoom={[1.08, 1]} />
      </Shot>

      {/* 13-15 s : fin, avec la mention de protection */}
      <Shot from={390} to={450} last>
        <EndCard
          at={390}
          title={["Protection acheteur : 10 % du prix", "(0,50 € min, 15 € max)"]}
          titleSize={44}
          mention="Conditions sur swapiles.com"
        />
      </Shot>

      <Subtitle
        cues={[
          { from: 0, to: 90, lines: ["Sur Swap’Îles, la vendeuse est payée", "quand j’ai reçu mon colis."] },
          { from: 90, to: 170, lines: ["Je paie en ligne."] },
          { from: 170, to: 270, lines: ["L’argent reste bloqué jusqu’à ce que", "je reçoive l’article."] },
          { from: 270, to: 390, lines: ["S’il n’arrive pas ou ne correspond pas", "à l’annonce, je suis remboursée."] },
          { from: 390, to: 450, lines: ["Swap’Îles. Lien en dessous."] },
        ]}
      />
      {!qa && <Html5Audio src={staticFile("meta/audio/music-B.wav")} volume={MUSIC_VOLUME} />}
    </Frame>
  );
};
