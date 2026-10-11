import type { CSSProperties, ReactNode } from "react";

export type DoodleName = "sun" | "sheep" | "whisk" | "muffin" | "mate" | "heart";

// Simple line drawings on a 64×64 grid, stroked in currentColor
const PATHS: Record<DoodleName, ReactNode> = {
  sun: (
    <>
      <circle cx="32" cy="32" r="10" />
      <path d="M32 8v8M32 48v8M8 32h8M48 32h8M15 15l6 6M43 43l6 6M15 49l6-6M43 21l6-6" />
    </>
  ),
  sheep: (
    <>
      <path d="M16 34c-4-6 2-12 7-9 1-6 10-7 12-1 5-4 12 0 10 6 5 2 4 10-2 10-1 5-9 6-12 2-4 4-12 2-12-3-5 0-7-4-3-5z" />
      <path d="M45 27c3-1 6 1 6 4s-3 4-5 3" />
      <circle cx="48" cy="30" r="1.2" fill="currentColor" />
      <path d="M24 42v8M30 43v7M38 43v7M42 42v8" />
    </>
  ),
  whisk: (
    <>
      <path d="M32 6v20" />
      <path d="M32 26c-9 0-13 10-11 18 2 9 20 9 22 0 2-8-2-18-11-18z" />
      <path d="M27 30c-1 8 1 15 5 18M37 30c1 8-1 15-5 18M32 27v21" />
    </>
  ),
  muffin: (
    <>
      <path d="M14 30c0-10 8-16 18-16s18 6 18 16z" />
      <path d="M14 30l5 22h26l5-22" />
      <path d="M24 30l2 22M32 30v22M40 30l-2 22" />
      <circle cx="26" cy="22" r="1.3" fill="currentColor" />
      <circle cx="36" cy="20" r="1.3" fill="currentColor" />
      <circle cx="31" cy="25" r="1.3" fill="currentColor" />
    </>
  ),
  mate: (
    <>
      <path d="M20 26h24c0 14-2 26-12 26s-12-12-12-26z" />
      <path d="M36 26l10-20M44 6h5" />
      <path d="M22 34c4 2 16 2 20 0" />
    </>
  ),
  heart: (
    <path d="M32 52S10 38 10 24c0-8 6-12 11-12 5 0 9 4 11 8 2-4 6-8 11-8 5 0 11 4 11 12 0 14-22 28-22 28z" />
  ),
};

/** A little hand-drawn line doodle (decorative). */
export function Doodle({
  name,
  className = "",
  style,
}: {
  name: DoodleName;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={`doodle ${className}`}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name]}
    </svg>
  );
}
