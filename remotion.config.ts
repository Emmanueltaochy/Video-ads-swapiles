import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// Qualité élevée pour l'upload YouTube
Config.setCrf(16);
