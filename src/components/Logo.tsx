import React from "react";
import { COLORS } from "../config";
import { LOGO_PATH, LOGO_VIEWBOX } from "./logoPath";

/** Logo Swap'Îles vectoriel (net à toutes les tailles). */
export const Logo: React.FC<{ width: number; color?: string; style?: React.CSSProperties }> = ({
  width,
  color = COLORS.primary,
  style,
}) => (
  <svg width={width} height={(width * 96) / 288} viewBox={LOGO_VIEWBOX} style={{ display: "block", ...style }}>
    <path d={LOGO_PATH} fill={color} fillRule="evenodd" />
  </svg>
);
