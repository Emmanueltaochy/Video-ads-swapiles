import React from "react";
import { Img, staticFile } from "remotion";
import { COLORS, FONT } from "../config";
import { Icon } from "./Icons";

export const PHONE_RATIO = 2.08;

/** Barre de navigation de l'app Swap'Îles (redessinée pour rester nette). */
const NavBar: React.FC<{ s: number; active?: number }> = ({ s, active = 0 }) => {
  const items = [
    { icon: "home", label: "Accueil" },
    { icon: "search", label: "Produits" },
    { icon: "plus", label: "Déposer" },
    { icon: "message", label: "Messages" },
    { icon: "user", label: "Compte" },
  ] as const;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 92 * s,
        background: "#fff",
        borderTop: `${1 * s}px solid #e8ecea`,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-start",
        paddingTop: 12 * s,
        fontFamily: FONT,
      }}
    >
      {items.map((it, i) =>
        it.icon === "plus" ? (
          <div key={it.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -30 * s }}>
            <div
              style={{
                width: 58 * s,
                height: 58 * s,
                borderRadius: "50%",
                background: COLORS.primary,
                border: `${4 * s}px solid #fff`,
                boxShadow: `0 ${4 * s}px ${12 * s}px rgba(19,106,93,0.4)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="plus" size={28 * s} color="#fff" strokeWidth={3} />
            </div>
            <div style={{ fontSize: 13 * s, color: COLORS.primary, fontWeight: 700, marginTop: 2 * s }}>{it.label}</div>
          </div>
        ) : (
          <div key={it.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 * s }}>
            <Icon name={it.icon} size={26 * s} color={i === active ? COLORS.primary : "#8a9692"} strokeWidth={2.2} />
            <div style={{ fontSize: 13 * s, color: i === active ? COLORS.primary : "#8a9692", fontWeight: 600 }}>{it.label}</div>
          </div>
        ),
      )}
    </div>
  );
};

const StatusBar: React.FC<{ s: number; dark?: boolean }> = ({ s, dark }) => {
  const c = dark ? "#fff" : "#111";
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 54 * s,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `${6 * s}px ${34 * s}px 0`,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 17 * s,
        color: c,
        zIndex: 5,
      }}
    >
      <span>15:41</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 * s }}>
        {/* réseau */}
        <svg width={18 * s} height={12 * s} viewBox="0 0 18 12">
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={i * 4.7} y={9 - i * 3} width={3.4} height={3 + i * 3} rx={0.8} fill={c} />
          ))}
        </svg>
        {/* batterie */}
        <svg width={27 * s} height={13 * s} viewBox="0 0 27 13">
          <rect x={0.5} y={0.5} width={23} height={12} rx={3.5} fill="none" stroke={c} opacity={0.5} />
          <rect x={2.5} y={2.5} width={17} height={8} rx={2} fill={c} />
          <rect x={24.5} y={4} width={2} height={5} rx={1} fill={c} opacity={0.5} />
        </svg>
      </div>
    </div>
  );
};

/**
 * Mockup de téléphone (type iPhone). L'écran reçoit des `children`
 * (captures de l'app ou interface redessinée).
 */
export const Phone: React.FC<{
  width?: number;
  children?: React.ReactNode;
  nav?: boolean;
  navActive?: number;
  darkStatus?: boolean;
  style?: React.CSSProperties;
}> = ({ width = 440, children, nav = true, navActive, darkStatus, style }) => {
  const s = width / 440;
  const height = width * PHONE_RATIO;
  const bezel = 14 * s;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 70 * s,
        background: "linear-gradient(145deg, #e9ecef 0%, #9aa1a6 30%, #f5f7f8 55%, #8b9196 80%, #d9dde0 100%)",
        padding: 4 * s,
        boxShadow: `0 ${50 * s}px ${90 * s}px rgba(0,20,15,0.45), 0 ${12 * s}px ${30 * s}px rgba(0,20,15,0.3)`,
        position: "relative",
        ...style,
      }}
    >
      {/* boutons latéraux */}
      <div style={{ position: "absolute", left: -4 * s, top: 190 * s, width: 5 * s, height: 70 * s, borderRadius: 3 * s, background: "#9aa1a6" }} />
      <div style={{ position: "absolute", left: -4 * s, top: 280 * s, width: 5 * s, height: 70 * s, borderRadius: 3 * s, background: "#9aa1a6" }} />
      <div style={{ position: "absolute", right: -4 * s, top: 230 * s, width: 5 * s, height: 110 * s, borderRadius: 3 * s, background: "#9aa1a6" }} />
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 66 * s,
          background: "#0d0d0f",
          padding: bezel,
          position: "relative",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 54 * s,
            overflow: "hidden",
            position: "relative",
            background: "#f6f8f7",
          }}
        >
          <StatusBar s={s} dark={darkStatus} />
          {/* Dynamic Island */}
          <div
            style={{
              position: "absolute",
              top: 12 * s,
              left: "50%",
              transform: "translateX(-50%)",
              width: 120 * s,
              height: 34 * s,
              borderRadius: 20 * s,
              background: "#000",
              zIndex: 6,
            }}
          />
          <div style={{ position: "absolute", top: 54 * s, left: 0, right: 0, bottom: nav ? 92 * s : 0, overflow: "hidden" }}>
            {children}
          </div>
          {nav && <NavBar s={s} active={navActive} />}
          {/* reflet vitre */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 35%)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          />
        </div>
      </div>
    </div>
  );
};

/** Capture d'écran de l'app, calée en largeur, avec défilement vertical optionnel. */
export const Screenshot: React.FC<{ src: string; scrollY?: number; style?: React.CSSProperties }> = ({
  src,
  scrollY = 0,
  style,
}) => (
  <Img
    src={staticFile(src)}
    style={{ width: "100%", display: "block", transform: `translateY(${-scrollY}px)`, ...style }}
  />
);
