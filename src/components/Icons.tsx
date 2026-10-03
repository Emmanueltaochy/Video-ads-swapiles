import React from "react";

/** Petites icônes en SVG (trait), pour ne dépendre d'aucune police d'emoji. */
type IconName =
  | "camera"
  | "card"
  | "cash"
  | "swap"
  | "gift"
  | "store"
  | "pin"
  | "coins"
  | "leaf"
  | "recycle"
  | "heart"
  | "check"
  | "message"
  | "home"
  | "search"
  | "user"
  | "plus"
  | "box"
  | "clock"
  | "euro"
  | "palm"
  | "users"
  | "tag";

const PATHS: Record<IconName, React.ReactNode> = {
  camera: (
    <>
      <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13.5" r="3.8" />
    </>
  ),
  card: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
      <path d="M2.5 10h19M6 15h4" />
    </>
  ),
  cash: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.8" />
      <path d="M6 9.5v5M18 9.5v5" />
    </>
  ),
  swap: (
    <>
      <path d="M4 8h14l-3.5-3.5" />
      <path d="M20 16H6l3.5 3.5" />
    </>
  ),
  gift: (
    <>
      <rect x="3.5" y="9" width="17" height="11" rx="1.5" />
      <path d="M2.5 9h19M12 9v11" />
      <path d="M12 9c-2-4-6-4-6-1.5S10 9 12 9c2 0 6 1 6-1.5S14 5 12 9z" />
    </>
  ),
  store: (
    <>
      <path d="M3.5 9.5 5 4.5h14l1.5 5" />
      <path d="M3.5 9.5c0 1.5 1.2 2.5 2.8 2.5s2.8-1 2.8-2.5c0 1.5 1.2 2.5 2.9 2.5s2.9-1 2.9-2.5c0 1.5 1.2 2.5 2.8 2.5s2.8-1 2.8-2.5" />
      <path d="M5 12v8h14v-8M10 20v-5h4v5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="9" cy="7" rx="6" ry="2.5" />
      <path d="M3 7v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V7" />
      <path d="M9 13.5v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4c0-1.4-2.7-2.5-6-2.5" />
      <path d="M9 17.5c0 .2 0 0 0 0" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19C5 10 10 4.5 20 4c0 10-5.5 15-14 15z" />
      <path d="M5 19 13 11" />
    </>
  ),
  recycle: (
    <>
      <path d="M7.5 9.5 10 5.3a2 2 0 0 1 3.4 0l1.8 3" />
      <path d="M13.5 8.5l1.8.4.6-1.8" />
      <path d="M17.5 12.5l2.3 4a2 2 0 0 1-1.7 3H14" />
      <path d="M15.5 21l-1.6-1.5 1.4-1.4" />
      <path d="M10 19.5H5.9a2 2 0 0 1-1.7-3l2.1-3.6" />
      <path d="M4.4 13.7l1.9-.8.8 1.9" />
    </>
  ),
  heart: <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  message: <path d="M4 5.5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-9l-4.5 3.5V17.5H4a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1z" />,
  home: <path d="M3.5 11 12 4l8.5 7M5.5 9.5V20h5v-5h3v5h5V9.5" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5 5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  box: (
    <>
      <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z" />
      <path d="M3.5 7.5 12 12l8.5-4.5M12 12v9M7.8 5.3l8.5 4.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  euro: (
    <>
      <path d="M17.5 6.5A7 7 0 1 0 17.5 17.5" />
      <path d="M4.5 10.5h9M4.5 13.5h9" />
    </>
  ),
  palm: (
    <>
      <path d="M12 21c0-5 .5-8 1-10" />
      <path d="M13 11c-2-3-5.5-3.5-8-2 2.5-.2 4.8.8 6 2.3" />
      <path d="M13 11c2-3 5.5-3.5 8-2-2.5-.2-4.8.8-6 2.3" />
      <path d="M13 11c-.5-3.5-3-6-6.5-6 2.5 1 4.3 3 5 5.5" />
      <path d="M13 11c1-3.5 3.5-5.5 7-5.3-2.6.9-4.6 2.7-5.6 5.3" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.5" />
      <path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5" />
      <circle cx="17" cy="9" r="2.8" />
      <path d="M16.5 14.2c2.6.2 4.4 2 5 4.8" />
    </>
  ),
  tag: (
    <>
      <path d="M3.5 12.5V4.5a1 1 0 0 1 1-1h8l8 8-9 9z" />
      <circle cx="8.5" cy="8.5" r="1.6" />
    </>
  ),
};

export const Icon: React.FC<{
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}> = ({ name, size = 32, color = "currentColor", strokeWidth = 2, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block", flexShrink: 0, ...style }}
  >
    {PATHS[name]}
  </svg>
);

export type { IconName };
