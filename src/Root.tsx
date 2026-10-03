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

export const RemotionRoot: React.FC = () => (
  <Folder name="YouTube-Ads">
    <Composition id="SwapilesAd30s" component={Ad30s} durationInFrames={30 * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="SwapilesBumper6s" component={Bumper6s} durationInFrames={6 * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />
  </Folder>
);
