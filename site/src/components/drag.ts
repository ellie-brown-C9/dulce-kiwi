/** How far (px) the mouse must move before a press becomes a drag instead of a click. */
export const DRAG_THRESHOLD = 6;

export const isDrag = (dx: number) => Math.abs(dx) > DRAG_THRESHOLD;
