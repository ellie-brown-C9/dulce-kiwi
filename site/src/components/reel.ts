// Maths for the About Me drum (see Story.tsx). Plain functions so they can be unit tested.

/** Extra screens of scrolling the drum holds the page for (3 photos). */
export const PIN_SCREENS = 1.4;
/** Below this viewport height (px) a slide doesn't fit, so the section stays a plain stack.
 *  Low enough for an iPhone SE in Safari with its toolbars showing (~548px). */
export const MIN_DRUM_HEIGHT = 500;
/** Share of each step the reel rests on a photo before rolling to the next. */
export const HOLD = 0.24;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Scroll progress through the pinned stretch (0–1) → reel position (0 … count−1).
 * It rests on each photo for part of each step, then rolls quickly to the next.
 */
export function reelPosition(progress: number, count = 3, hold = HOLD): number {
  const steps = count - 1;
  const x = clamp01(progress) * steps;
  if (x >= steps) return steps;
  const i = Math.floor(x);
  return i + easeInOut(clamp01((x - i - hold / 2) / (1 - hold)));
}

/** How slide `i` looks when the reel is at `pos`: neighbours shrink, fade and swing. */
export function slideLook(i: number, pos: number, restTilt: number) {
  const delta = i - pos;
  const dist = Math.min(1, Math.abs(delta));
  return {
    scale: 1 - 0.2 * dist,
    opacity: 1 - 0.75 * dist,
    tilt: restTilt + delta * 14,
    current: Math.abs(delta) < 0.25,
    origin: (delta < 0 ? "center bottom" : "center top") as "center top" | "center bottom",
  };
}

/** The drum needs motion allowed and enough height for a photo and its paragraph. */
export const drumAllowed = (o: { reducedMotion: boolean; viewportHeight: number }) =>
  !o.reducedMotion && o.viewportHeight >= MIN_DRUM_HEIGHT;

/** Phones resize the viewport height as the address bar slides away; only a new width (or rotation) re-decides the drum. */
export const viewportChanged = (prev: { w: number; h: number }, next: { w: number; h: number }) => prev.w !== next.w;
