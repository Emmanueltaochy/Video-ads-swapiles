import React from "react";
import { COLORS, FONT } from "../config";
import { Icon, IconName } from "./Icons";

const APPLE =
  "M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z";

const badgeBase = (h: number): React.CSSProperties => ({
  height: h,
  borderRadius: h * 0.2,
  background: "#000",
  border: `${Math.max(1.5, h * 0.025)}px solid #a6a6a6`,
  display: "flex",
  alignItems: "center",
  gap: h * 0.16,
  padding: `0 ${h * 0.3}px 0 ${h * 0.22}px`,
  color: "#fff",
  fontFamily: FONT,
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
});

export const AppStoreBadge: React.FC<{ height?: number }> = ({ height = 80 }) => (
  <div style={badgeBase(height)}>
    <svg width={height * 0.5} height={height * 0.6} viewBox="0 0 384 512">
      <path d={APPLE} fill="#fff" />
    </svg>
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
      <span style={{ fontSize: height * 0.19, fontWeight: 500 }}>Télécharger dans</span>
      <span style={{ fontSize: height * 0.4, fontWeight: 600, letterSpacing: -0.5, marginTop: height * 0.03 }}>l'App Store</span>
    </div>
  </div>
);

export const GooglePlayBadge: React.FC<{ height?: number }> = ({ height = 80 }) => (
  <div style={badgeBase(height)}>
    <svg width={height * 0.5} height={height * 0.55} viewBox="0 0 40 44">
      <path d="M2 2 L23 22 L2 42 C1 41.5 0.5 40.5 0.5 39.3 V4.7 C0.5 3.5 1 2.5 2 2Z" fill="#00d7fe" />
      <path d="M2 2 C3 1.4 4.3 1.5 5.6 2.2 L30 16 L23 22 Z" fill="#32a350" />
      <path d="M2 42 C3 42.6 4.3 42.5 5.6 41.8 L30 28 L23 22 Z" fill="#f5304f" />
      <path d="M30 16 L37.3 20.1 C39.5 21.4 39.5 22.6 37.3 23.9 L30 28 L23 22 Z" fill="#ffd400" />
    </svg>
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
      <span style={{ fontSize: height * 0.17, fontWeight: 500, letterSpacing: 1 }}>DISPONIBLE SUR</span>
      <span style={{ fontSize: height * 0.38, fontWeight: 600, letterSpacing: -0.5, marginTop: height * 0.04 }}>Google Play</span>
    </div>
  </div>
);

/* ------------------------------------------------------------------ réseaux */
const FB = "M15.12 5.32H17V2.14A26.11 26.11 0 0 0 14.26 2c-2.72 0-4.58 1.66-4.58 4.7v2.62H6.61v3.56h3.07V22h3.68v-9.12h3.06l.46-3.56h-3.52V7.05c0-1.03.28-1.73 1.76-1.73z";
const TIKTOK =
  "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z";

export const SocialIcon: React.FC<{ network: "facebook" | "instagram" | "tiktok"; size?: number }> = ({
  network,
  size = 64,
}) => {
  const r = size * 0.26;
  if (network === "facebook") {
    return (
      <div style={{ width: size, height: size, borderRadius: r, background: "#1877f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24">
          <path d={FB} fill="#fff" />
        </svg>
      </div>
    );
  }
  if (network === "instagram") {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: r,
          background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2}>
          <rect x="3" y="3" width="18" height="18" rx="5.5" />
          <circle cx="12" cy="12" r="4.3" />
          <circle cx="17.4" cy="6.6" r="1.1" fill="#fff" stroke="none" />
        </svg>
      </div>
    );
  }
  return (
    <div style={{ width: size, height: size, borderRadius: r, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" style={{ position: "absolute", transform: `translate(${-size * 0.025}px, ${-size * 0.02}px)` }}>
        <path d={TIKTOK} fill="#25f4ee" />
      </svg>
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" style={{ position: "absolute", transform: `translate(${size * 0.025}px, ${size * 0.02}px)` }}>
        <path d={TIKTOK} fill="#fe2c55" />
      </svg>
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" style={{ position: "absolute" }}>
        <path d={TIKTOK} fill="#fff" />
      </svg>
    </div>
  );
};

/* ------------------------------------------------------------------ pastille */
export const Chip: React.FC<{
  icon?: IconName;
  label: string;
  size?: number;
  variant?: "light" | "dark" | "outline";
  style?: React.CSSProperties;
}> = ({ icon, label, size = 34, variant = "light", style }) => {
  const bg = variant === "light" ? "#fff" : variant === "dark" ? COLORS.primary : "rgba(255,255,255,0.12)";
  const fg = variant === "light" ? COLORS.primary : "#fff";
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.35,
        padding: `${size * 0.32}px ${size * 0.7}px ${size * 0.32}px ${size * 0.45}px`,
        borderRadius: size,
        background: bg,
        border: variant === "outline" ? "2px solid rgba(255,255,255,0.6)" : "none",
        color: fg,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.1,
        boxShadow: variant === "light" ? "0 10px 25px rgba(0,30,25,0.25)" : "none",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {icon && (
        <div
          style={{
            width: size * 1.35,
            height: size * 1.35,
            borderRadius: "50%",
            background: variant === "light" ? "rgba(19,106,93,0.12)" : "rgba(255,255,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name={icon} size={size * 0.85} color={fg} strokeWidth={2.4} />
        </div>
      )}
      {label}
    </div>
  );
};
