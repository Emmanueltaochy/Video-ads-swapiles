import React from "react";
import { Html5Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Capture, CornerLogo, Decor, EndCard, Frame, Highlight, LAY, MUSIC_VOLUME, PhotoCard, Pill, PROTECTION_LINES, SAFE, SAFE_W, ScreenWindow, Shot, Subtitle, Title, UI_BOTTOM, uiRect } from "./kit";
import { VOICE_CUES } from "./voiceCues";
import { RECTS } from "./rects";

const WIN = { x: SAFE.left, y: 600, w: SAFE_W, h: UI_BOTTOM - 600 };

/** Angle B — Achète sans te faire avoir (15 s). Script : section « Angle B » du document de campagne. */
export const AdB: React.FC<{ qa?: boolean; voice?: boolean }> = ({ qa, voice }) => {
  const f = useCurrentFrame();
  const pay = RECTS.paiement;
  // défilement : récapitulatif du prix, puis encadré « paiement protégé »
  const SCROLL0 = 560; // cadré sur le détail du prix
  const SCROLL1 = 1090; // cadré sur l'encadré « paiement protégé »
  const scroll = interpolate(f, [176, 196], [SCROLL0, SCROLL1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Frame qa={qa}>
      <Decor />
      <CornerLogo until={386} />

      {/* 0-3 s : colis à la réception */}
      <Shot from={0} to={88}>
        <Title lines={["Payée à la réception"]} at={0} />
        <PhotoCard src="meta/photos/reception.jpg" x={SAFE.left + 2} y={LAY.vis1} w={SAFE_W - 6} h={LAY.bottom - LAY.vis1} at={0} objectPosition="62% 50%" zoom={[1.1, 1]} dur={100} />
      </Shot>

      {/* 3-9 s : paiement protégé + détail du prix */}
      <Shot from={90} to={268}>
        <Title lines={["Paiement protégé"]} at={92} />
        <Pill text={PROTECTION_LINES} x={SAFE.left} y={458} at={98} size={38} strong />
        <ScreenWindow {...WIN} at={100}>
          <Capture src="meta/ui/paiement.png" scrollY={scroll} />
        </ScreenWindow>
        {f < 176 && <Highlight {...uiRect(WIN, pay.protection, SCROLL0)} at={122} radius={14} />}
        {f >= 196 && <Highlight {...uiRect(WIN, pay.note, SCROLL1)} at={200} />}
      </Shot>

      {/* 9-13 s : colis ouvert, vêtement déplié */}
      <Shot from={270} to={388}>
        <Title lines={["Remboursée si non reçu", "ou non conforme"]} at={272} />
        <PhotoCard src="meta/photos/carton-ouvert.jpg" x={SAFE.left + 12} y={548} w={560} h={600} at={274} rotate={-3} zoom={[1.06, 1]} />
        <PhotoCard src="meta/photos/plies.jpg" x={356} y={600} w={560} h={560} at={286} rotate={3} zoom={[1.08, 1]} />
      </Shot>

      {/* 13-15 s : fin, avec la mention de protection */}
      <Shot from={390} to={450} last>
        <EndCard
          at={390}
          title={["Protection acheteur : 10 % du prix", "(0,50 € min, 15 € max)"]}
          titleSize={50}
          mention="Conditions sur swapiles.com"
        />
      </Shot>

      <Subtitle
        cues={voice ? VOICE_CUES.B : [
          { from: 0, to: 90, lines: ["Sur Swap’Îles, la vendeuse est payée", "quand j’ai reçu mon colis."] },
          { from: 90, to: 170, lines: ["Je paie en ligne."] },
          { from: 170, to: 270, lines: ["L’argent reste bloqué jusqu’à ce que", "je reçoive l’article."] },
          { from: 270, to: 390, lines: ["S’il n’arrive pas ou ne correspond pas", "à l’annonce, je suis remboursée."] },
          { from: 390, to: 450, lines: ["Swap’Îles. Lien en dessous."] },
        ]}
      />
      {!qa && <Html5Audio src={staticFile(voice ? "meta/voice/mix-B.wav" : "meta/audio/music-B.wav")} volume={voice ? 1 : MUSIC_VOLUME} />}
    </Frame>
  );
};
