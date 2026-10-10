"use client";

import { useEffect, useRef, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { glideStep, isDrag } from "./drag";

/**
 * A horizontal scroller you can also click-and-drag with a mouse. It follows the mouse
 * 1:1 and glides to a stop when you let go. Touch and trackpad keep their native
 * scrolling; a drag never counts as a click.
 */
export default function DragScroll({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, moved: false, startX: 0, startLeft: 0, lastX: 0, lastT: 0, speed: 0 });
  const glide = useRef(0);

  const stopGlide = () => cancelAnimationFrame(glide.current);
  useEffect(() => stopGlide, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !ref.current) return;
    stopGlide();
    drag.current = {
      down: true,
      moved: false,
      startX: e.clientX,
      startLeft: ref.current.scrollLeft,
      lastX: e.clientX,
      lastT: e.timeStamp,
      speed: 0,
    };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    const d = drag.current;
    if (!d.down || !el) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && isDrag(dx)) {
      d.moved = true;
      el.setPointerCapture(e.pointerId);
      el.dataset.dragging = "true";
    }
    if (!d.moved) return;
    el.scrollLeft = d.startLeft - dx;
    // Track speed in px per ~16ms frame so the glide continues at the same pace
    const dt = Math.max(1, e.timeStamp - d.lastT);
    d.speed = ((d.lastX - e.clientX) / dt) * 16;
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
  };

  const end = () => {
    const el = ref.current;
    const d = drag.current;
    if (!d.down) return;
    d.down = false;
    if (!el || !d.moved) return;
    delete el.dataset.dragging;
    let speed = d.speed;
    const step = () => {
      speed = glideStep(speed);
      if (speed === 0) return;
      el.scrollLeft += speed;
      glide.current = requestAnimationFrame(step);
    };
    glide.current = requestAnimationFrame(step);
  };

  // Swallow the click that follows a drag, so letting go over a link doesn't open it
  const onClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <div
      ref={ref}
      className={`drag-scroll ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={end}
      onPointerCancel={end}
      onClickCapture={onClickCapture}
      onDragStart={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}
