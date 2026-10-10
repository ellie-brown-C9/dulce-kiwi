"use client";

import { useRef, type PointerEvent, type ReactNode, type MouseEvent } from "react";
import { isDrag } from "./drag";

/**
 * A horizontal scroller you can also click-and-drag with a mouse.
 * Touch and trackpad keep their native scrolling; a drag never counts as a click.
 */
export default function DragScroll({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false });

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !ref.current) return;
    drag.current = { down: true, startX: e.clientX, startLeft: ref.current.scrollLeft, moved: false };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!drag.current.down || !el) return;
    const dx = e.clientX - drag.current.startX;
    if (!drag.current.moved && isDrag(dx)) {
      drag.current.moved = true;
      el.setPointerCapture(e.pointerId);
      el.dataset.dragging = "true"; // pauses scroll-snap and shows the grabbing cursor
    }
    if (drag.current.moved) el.scrollLeft = drag.current.startLeft - dx;
  };

  const end = () => {
    drag.current.down = false;
    if (ref.current) delete ref.current.dataset.dragging; // snap settles on the nearest card
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
