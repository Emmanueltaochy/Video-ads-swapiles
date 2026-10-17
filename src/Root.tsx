import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "@fontsource/poppins/900.css";
import React from "react";
import { Composition, Folder } from "remotion";
import { Ad30s } from "./Ad30s";
import { Bumper6s } from "./Bumper6s";
import { FPS, HEIGHT, WIDTH } from "./config";
import { ParentsReel } from "./parents/ParentsReel";
import { PARENTS_DURATION } from "./parents/config";
import { AdA } from "./meta/AdA";
import { AdB } from "./meta/AdB";
import { AdC } from "./meta/AdC";
import { Poster } from "./meta/Posters";
import { VC_DURATION, VC_FPS, VieChere } from "./viechere/VieChere";

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="YouTube-Ads">
      <Composition id="SwapilesAd30s" component={Ad30s} durationInFrames={30 * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="SwapilesBumper6s" component={Bumper6s} durationInFrames={6 * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />
    </Folder>
    <Folder name="Instagram-Reels">
      {/* Même pub (voix, musique, timeline), mise en page verticale adaptée aux zones sûres Reels */}
      <Composition id="SwapilesReel30s" component={Ad30s} durationInFrames={30 * FPS} fps={FPS} width={HEIGHT} height={WIDTH} />
      {/* Reel dédié aux parents : vie chère + articles enfant / bébé */}
      <Composition id="SwapilesReelParents" component={ParentsReel} durationInFrames={PARENTS_DURATION} fps={FPS} width={HEIGHT} height={WIDTH} />
    </Folder>
    {/* Campagne Meta (angles A, B, C) : vidéos 15 s 9:16 + affiches 1080×1350 et 1080×1920 */}
    <Folder name="Reels">
      <Composition id="Reel-VieLeCher" component={VieChere} durationInFrames={VC_DURATION} fps={VC_FPS} width={1080} height={1920} defaultProps={{ qa: false }} />
    </Folder>
    <Folder name="Meta-Campagne">
      <Composition id="Meta-A" component={AdA} durationInFrames={15 * FPS} fps={FPS} width={1080} height={1920} defaultProps={{ qa: false }} />
      <Composition id="Meta-A-voix" component={AdA} durationInFrames={15 * FPS} fps={FPS} width={1080} height={1920} defaultProps={{ qa: false, voice: true }} />
      <Composition id="Meta-B" component={AdB} durationInFrames={15 * FPS} fps={FPS} width={1080} height={1920} defaultProps={{ qa: false }} />
      <Composition id="Meta-B-voix" component={AdB} durationInFrames={15 * FPS} fps={FPS} width={1080} height={1920} defaultProps={{ qa: false, voice: true }} />
      <Composition id="Meta-C" component={AdC} durationInFrames={15 * FPS} fps={FPS} width={1080} height={1920} defaultProps={{ qa: false }} />
      <Composition id="Meta-C-voix" component={AdC} durationInFrames={15 * FPS} fps={FPS} width={1080} height={1920} defaultProps={{ qa: false, voice: true }} />
      {(["A", "B", "C"] as const).map((angle) => (
        <React.Fragment key={angle}>
          <Composition id={`Affiche-${angle}-1080x1350`} component={Poster} durationInFrames={1} fps={FPS} width={1080} height={1350} defaultProps={{ angle, fmt: "feed" as const, qa: false }} />
          <Composition id={`Affiche-${angle}-1080x1920`} component={Poster} durationInFrames={1} fps={FPS} width={1080} height={1920} defaultProps={{ angle, fmt: "story" as const, qa: false }} />
        </React.Fragment>
      ))}
    </Folder>
  </>
);
