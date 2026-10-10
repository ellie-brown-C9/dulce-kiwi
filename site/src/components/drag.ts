/** How far (px) the mouse must move before a press becomes a drag instead of a click. */
export const DRAG_THRESHOLD = 6;

export const isDrag = (dx: number) => Math.abs(dx) > DRAG_THRESHOLD;

/** How much speed the rail keeps each frame after you let go (closer to 1 = longer glide). */
export const GLIDE_FRICTION = 0.94;
const GLIDE_MIN_SPEED = 0.3; // px per frame; below this it stops

/** Speed for the next animation frame of the glide; 0 means stop. */
export const glideStep = (speed: number) => {
  const next = speed * GLIDE_FRICTION;
  return Math.abs(next) < GLIDE_MIN_SPEED ? 0 : next;
};
