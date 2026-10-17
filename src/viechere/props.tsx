/** Objets illustrés (vectoriels, dessinés en code) du Reel « La vie lé chèr ». */
import React from "react";
import { AbsoluteFill, random } from "remotion";
import { Logo } from "../components/Logo";

export const PAL = {
  teal: "#0f766e",
  tealLight: "#5eead4",
  ink: "#134e4a",
  lava: "#ff7a1a",
  lavaHot: "#ffd27a",
  night: "#020b12",
  cream: "#fbf8f2",
};
export const CLOTH_COLORS = ["#f97316", "#facc15", "#22c55e", "#0ea5e9", "#e11d48", "#a855f7", "#f472b6", "#14b8a6", "#ffffff", "#fb7185"];

/* ------------------------------------------------------------------ vêtements */
export type ClothType = "tee" | "dress" | "pants" | "shirt";
export const CLOTH_TYPES: ClothType[] = ["tee", "dress", "pants", "shirt"];
const CLOTH_PATH: Record<ClothType, string> = {
  tee: "M30 12 L44 18 Q50 24 56 18 L70 12 L92 30 L80 44 L72 38 L72 92 L28 92 L28 38 L20 44 L8 30 Z",
  dress: "M40 6 L44 6 L46 16 Q50 20 54 16 L56 6 L60 6 L62 30 L84 94 L16 94 L38 30 Z",
  pants: "M24 8 L76 8 L84 94 L58 94 L50 42 L42 94 L16 94 Z",
  shirt: "M32 10 L44 14 L50 26 L56 14 L68 10 L94 30 L84 46 L74 40 L74 92 L26 92 L26 40 L16 46 L6 30 Z",
};
export const Cloth: React.FC<{ type: ClothType; color: string; size: number; style?: React.CSSProperties }> = ({ type, color, size, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <path d={CLOTH_PATH[type]} fill={color} stroke="rgba(0,0,0,0.25)" strokeWidth={2} strokeLinejoin="round" />
    {type === "shirt" && <path d="M50 26 L50 92" stroke="rgba(0,0,0,0.2)" strokeWidth={2} />}
    {type === "dress" && <path d="M38 32 Q50 38 62 32" stroke="rgba(255,255,255,0.5)" strokeWidth={3} fill="none" />}
  </svg>
);

/* ------------------------------------------------------------------ étiquette de prix */
export const PriceTag: React.FC<{ label: string; bg: string; fg: string; w: number }> = ({ label, bg, fg, w }) => (
  <svg width={w} height={w * 0.62} viewBox="0 0 130 80">
    <path d="M6 40 L36 8 L118 8 Q124 8 124 14 L124 66 Q124 72 118 72 L36 72 Z" fill={bg} stroke="rgba(0,0,0,0.35)" strokeWidth={3} strokeLinejoin="round" />
    <circle cx={30} cy={40} r={7} fill="#0b1220" opacity={0.85} />
    <text x={80} y={53} textAnchor="middle" fontFamily="Instrument Sans" fontWeight={700} fontSize={label.length > 2 ? 30 : 38} fill={fg}>
      {label}
    </text>
  </svg>
);

/* ------------------------------------------------------------------ cirque + case créole */
export const Ridges: React.FC<{ t: number }> = ({ t }) => {
  // t : 0 -> 1, la caméra plonge dans le cirque (chaque crête grossit à son rythme)
  const layers = [
    { base: 700, amp: 260, color: "#8db8b0", z: 0.4 },
    { base: 820, amp: 300, color: "#5f9a86", z: 0.8 },
    { base: 960, amp: 320, color: "#2f7a5c", z: 1.4 },
    { base: 1120, amp: 340, color: "#1b5e43", z: 2.4 },
  ];
  return (
    <AbsoluteFill>
      {layers.map((L, li) => {
        const s = 1 + t * t * L.z * 2.2;
        let d = `M -300 2300 L -300 ${L.base}`;
        for (let i = 0; i <= 34; i++) {
          const x = -300 + i * 50;
          const y = L.base - L.amp * (0.35 + 0.65 * random(`ridge-${li}-${i}`)) * Math.sin((i / 34) * Math.PI * (li % 2 ? 1 : 1.0)) ** 0.6;
          d += ` L ${x} ${y}`;
        }
        d += " L 1400 2300 Z";
        return (
          <svg key={li} width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, transformOrigin: "540px 1150px", transform: `scale(${s})`, opacity: 1 - Math.max(0, t - 0.75) * 2 * (li < 2 ? 1 : 0) }}>
            <path d={d} fill={L.color} />
          </svg>
        );
      })}
    </AbsoluteFill>
  );
};

export const CaseCreole: React.FC<{ w: number }> = ({ w }) => (
  <svg width={w} height={w * 0.85} viewBox="0 0 600 510">
    <ellipse cx={300} cy={492} rx={300} ry={18} fill="rgba(0,0,0,0.25)" />
    <rect x={80} y={205} width={440} height={280} fill="#f2c14e" />
    <rect x={80} y={205} width={440} height={40} fill="#e5ab33" />
    {/* toit en tôle */}
    <polygon points="30,215 300,60 570,215" fill="#b23a2b" />
    {Array.from({ length: 20 }, (_, i) => (
      <line key={i} x1={300 + (i - 9.5) * 2} y1={64} x2={45 + i * 27} y2={213} stroke="#8f2a1f" strokeWidth={3} />
    ))}
    {/* lambrequins */}
    {Array.from({ length: 27 }, (_, i) => (
      <path key={i} d={`M ${32 + i * 20} 215 l 10 18 l 10 -18 z`} fill="#ffffff" />
    ))}
    {/* varangue */}
    {[100, 220, 380, 500].map((x) => (
      <rect key={x} x={x - 6} y={240} width={12} height={245} fill="#ffffff" />
    ))}
    <rect x={80} y={430} width={440} height={10} fill="#ffffff" />
    <rect x={262} y={300} width={76} height={185} fill="#0f766e" rx={4} />
    {[140, 420].map((x) => (
      <g key={x}>
        <rect x={x - 34} y={290} width={68} height={90} fill="#1e3a5f" />
        <rect x={x - 66} y={290} width={30} height={90} fill="#38bdf8" />
        <rect x={x + 36} y={290} width={30} height={90} fill="#38bdf8" />
      </g>
    ))}
    <circle cx={40} cy={455} r={46} fill="#15803d" />
    <circle cx={570} cy={450} r={52} fill="#166534" />
    <circle cx={548} cy={420} r={34} fill="#e11d48" opacity={0.9} />
  </svg>
);

/* ------------------------------------------------------------------ armoire */
export const Armoire: React.FC<{ open: number; w?: number; h?: number }> = ({ open, w = 520, h = 680 }) => {
  const door = (side: "l" | "r") => (
    <div
      style={{
        position: "absolute",
        top: 70,
        [side === "l" ? "left" : "right"]: 24,
        width: (w - 48) / 2,
        height: h - 120,
        transformOrigin: side === "l" ? "0 50%" : "100% 50%",
        transform: `rotateY(${(side === "l" ? -1 : 1) * open * 118}deg)`,
        background: "linear-gradient(90deg, #9a5f2c, #b87638 50%, #9a5f2c)",
        borderRadius: 10,
        boxShadow: "inset 0 0 0 6px #7a4520",
        backfaceVisibility: "visible",
      }}
    >
      <div style={{ position: "absolute", inset: "40px 30px 300px", border: "5px solid #7a4520", borderRadius: 12 }} />
      <div style={{ position: "absolute", inset: "300px 30px 40px", border: "5px solid #7a4520", borderRadius: 12 }} />
      <div style={{ position: "absolute", top: "48%", [side === "l" ? "right" : "left"]: 18, width: 18, height: 18, borderRadius: "50%", background: "#f2c14e" }} />
    </div>
  );
  return (
    <div style={{ position: "relative", width: w, height: h, perspective: 1300 }}>
      <div style={{ position: "absolute", left: -20, right: -20, top: 0, height: 60, background: "#6b3b18", borderRadius: "14px 14px 4px 4px" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 56, bottom: 30, background: "#7a4520", borderRadius: 8 }} />
      {/* intérieur : linge empilé et suspendu */}
      <div style={{ position: "absolute", left: 24, right: 24, top: 70, bottom: 50, background: "#2b1a0f", borderRadius: 6, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 10, right: 10, top: 30, height: 6, background: "#c9a26b" }} />
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} style={{ position: "absolute", top: 36, left: 20 + i * 54, width: 46, height: 200 + (i % 3) * 40, background: CLOTH_COLORS[i % CLOTH_COLORS.length], borderRadius: "6px 6px 10px 10px", opacity: 0.95 }} />
        ))}
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} style={{ position: "absolute", bottom: 20 + i * 34, left: 40, right: 40, height: 30, background: CLOTH_COLORS[(i + 3) % CLOTH_COLORS.length], borderRadius: 8 }} />
        ))}
      </div>
      {door("l")}
      {door("r")}
      <div style={{ position: "absolute", left: 10, right: 10, bottom: 0, height: 34, background: "#5b3315", borderRadius: 6 }} />
    </div>
  );
};

/* ------------------------------------------------------------------ robe (« photo ») */
export const DressPhoto: React.FC<{ w: number; h: number; radius?: number }> = ({ w, h, radius = 18 }) => (
  <div style={{ width: w, height: h, borderRadius: radius, overflow: "hidden", background: "linear-gradient(160deg, #fde7d9 0%, #f9c9b6 100%)", position: "relative", boxShadow: "0 18px 40px rgba(0,0,0,0.35)" }}>
    <svg viewBox="0 0 100 110" width={w} height={h} preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", inset: 0 }}>
      <path d="M50 8 Q50 3 54 4" stroke="#7a5a3a" strokeWidth={1.5} fill="none" />
      <path d="M30 18 L50 10 L70 18" stroke="#7a5a3a" strokeWidth={2} fill="none" />
      <path d="M40 16 L44 16 L46 24 Q50 27 54 24 L56 16 L60 16 L62 38 L84 100 L16 100 L38 38 Z" fill="#e11d48" />
      {Array.from({ length: 22 }, (_, i) => (
        <circle key={i} cx={24 + ((i * 37) % 52)} cy={42 + ((i * 23) % 54)} r={1.8} fill="#fff" opacity={0.9} />
      ))}
      <path d="M38 38 Q50 44 62 38" stroke="#fff" strokeWidth={2.2} fill="none" opacity={0.8} />
    </svg>
  </div>
);

/* ------------------------------------------------------------------ téléphone */
export const Phone: React.FC<{ w: number; h: number; ry: number; rx: number; children: React.ReactNode }> = ({ w, h, ry, rx, children }) => (
  <div style={{ perspective: 1400 }}>
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 52,
        background: "linear-gradient(145deg, #1f2937, #0b1220)",
        padding: 12,
        boxSizing: "border-box",
        transform: `rotateY(${ry}deg) rotateX(${rx}deg)`,
        boxShadow: "0 40px 80px rgba(0,0,0,0.55), 0 0 60px rgba(94,234,212,0.25)",
      }}
    >
      <div style={{ width: "100%", height: "100%", borderRadius: 40, overflow: "hidden", background: "#f8fafc", position: "relative" }}>
        <div style={{ height: 84, background: PAL.teal, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 14, boxSizing: "border-box" }}>
          <Logo width={150} color="#ffffff" />
        </div>
        {children}
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ mains + sac */
export const Hands: React.FC<{ left: number; right: number }> = ({ left, right }) => (
  <svg width={1080} height={700} viewBox="0 0 1080 700" style={{ overflow: "visible" }}>
    <g transform={`translate(${-640 * (1 - left)} 0)`}>
      {/* bras gauche + sac */}
      <path d="M -120 420 L 330 330 L 352 420 L -120 520 Z" fill="#0e7490" />
      <rect x={300} y={318} width={60} height={112} rx={20} fill="#0b5f75" />
      <path d="M 352 330 Q 420 320 452 348 Q 470 372 448 392 Q 410 410 352 410 Z" fill="#8d5524" />
      <ellipse cx={430} cy={330} rx={26} ry={16} fill="#7a4a20" />
      {/* sac */}
      <path d="M 455 360 Q 470 250 540 250 Q 610 250 625 360" stroke="#7c4a1e" strokeWidth={14} fill="none" />
      <path d="M 390 360 L 690 360 L 660 640 L 420 640 Z" fill="#d6a86b" />
      <path d="M 390 360 L 690 360 L 686 392 L 394 392 Z" fill="#c4945a" />
    </g>
    <g transform={`translate(${640 * (1 - right)} 0)`}>
      {/* bras droit, main qui saisit la anse */}
      <path d="M 1200 410 L 760 330 L 738 420 L 1200 510 Z" fill="#f97316" />
      <rect x={728} y={318} width={60} height={112} rx={20} fill="#ea580c" />
      <path d="M 738 330 Q 668 318 636 346 Q 618 372 640 392 Q 680 410 738 410 Z" fill="#c68642" />
      <ellipse cx={656} cy={330} rx={26} ry={16} fill="#b07335" />
    </g>
  </svg>
);

/* ------------------------------------------------------------------ bouclier */
export const SHIELD = "M100 6 L188 38 L188 112 C188 170 150 206 100 226 C50 206 12 170 12 112 L12 38 Z";
export const ShieldHalf: React.FC<{ side: "l" | "r"; w: number }> = ({ side, w }) => (
  <svg width={w} height={w * 1.16} viewBox="0 0 200 232" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    <defs>
      <linearGradient id={`sh-${side}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#2dd4bf" stopOpacity="0.95" />
        <stop offset="1" stopColor="#0f766e" stopOpacity="0.95" />
      </linearGradient>
      <clipPath id={`shc-${side}`}>
        <rect x={side === "l" ? 0 : 100} y={0} width={100} height={232} />
      </clipPath>
    </defs>
    <g clipPath={`url(#shc-${side})`}>
      <path d={SHIELD} fill={`url(#sh-${side})`} stroke="#99f6e4" strokeWidth={6} strokeLinejoin="round" />
      <path d="M100 30 L164 54 L164 112 C164 156 136 184 100 200 C64 184 36 156 36 112 L36 54 Z" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={3} />
    </g>
  </svg>
);

/* ------------------------------------------------------------------ colis 3D */
export const Parcel: React.FC<{ size: number; ry: number; rx: number }> = ({ size, ry, rx }) => {
  const s = size;
  const face = (t: string, bg: string, tape = true): React.ReactNode => (
    <div style={{ position: "absolute", width: s, height: s, transform: t, background: bg, boxShadow: "inset 0 0 0 3px rgba(0,0,0,0.18)" }}>
      {tape && <div style={{ position: "absolute", left: s * 0.42, top: 0, width: s * 0.16, height: s, background: "#e9c88f" }} />}
    </div>
  );
  return (
    <div style={{ perspective: 1200, width: s, height: s }}>
      <div style={{ position: "relative", width: s, height: s, transformStyle: "preserve-3d", transform: `rotateX(${rx}deg) rotateY(${ry}deg)` }}>
        {face(`translateZ(${s / 2}px)`, "#c8955c")}
        {face(`rotateY(180deg) translateZ(${s / 2}px)`, "#b9874f")}
        {face(`rotateY(90deg) translateZ(${s / 2}px)`, "#b07c45", false)}
        {face(`rotateY(-90deg) translateZ(${s / 2}px)`, "#b07c45", false)}
        {face(`rotateX(90deg) translateZ(${s / 2}px)`, "#d8a66b")}
        {face(`rotateX(-90deg) translateZ(${s / 2}px)`, "#8f6236", false)}
      </div>
    </div>
  );
};
