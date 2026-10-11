"use client";

import { useEffect, useRef } from "react";
import { ITEM_INSET, PLANK_OVERHANG, SIZES, fitRow, layoutRow, rowFor, type Kind } from "./pantry/shelf";
import { drawShelf, drawSprite, makeSprites, type ShelfLayout, type Sprite } from "./pantry/art";

/** The pantry shelf drawn behind the contact section. Decorative: it never takes clicks. */
export default function Pantry() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.parentElement;
    const shelfLine = section?.querySelector<HTMLElement>("[data-shelf]");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !section || !shelfLine || !ctx) return;

    let sprites: Record<Kind, Sprite> | null = null;
    let layout: ShelfLayout | null = null;
    let cancelled = false;

    const measure = (): ShelfLayout => {
      const s = section.getBoundingClientRect();
      const f = shelfLine.getBoundingClientRect();
      const plankX0 = f.left - s.left - PLANK_OVERHANG;
      const plankX1 = f.right - s.left + PLANK_OVERHANG;
      const x0 = plankX0 + ITEM_INSET;
      const x1 = plankX1 - ITEM_INSET;
      const row = fitRow(rowFor(s.width), x0, x1);
      return { width: s.width, height: s.height, floor: f.top - s.top + 4, plankX0, plankX1, row, centres: layoutRow(row, x0, x1) };
    };

    const drawStill = () => {
      if (!sprites || !layout) return;
      ctx.clearRect(0, 0, layout.width, layout.height);
      drawShelf(ctx, layout.plankX0, layout.plankX1, layout.floor);
      layout.row.forEach((k, i) => drawSprite(ctx, sprites![k], layout!.centres[i], layout!.floor - SIZES[k].h / 2, 0));
    };

    const build = () => {
      layout = measure();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(layout.width * dpr);
      canvas.height = Math.round(layout.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawStill();
    };

    // Labels use the site fonts, so draw only once they're loaded
    document.fonts.ready.then(() => {
      if (cancelled) return;
      const css = getComputedStyle(document.documentElement);
      sprites = makeSprites(
        {
          display: css.getPropertyValue("--font-fraunces").trim() || "Georgia, serif",
          sans: css.getPropertyValue("--font-dm-sans").trim() || "system-ui, sans-serif",
        },
        Math.min(2, window.devicePixelRatio || 1),
      );
      build();
    });

    const resize = new ResizeObserver(() => {
      if (sprites) build();
    });
    resize.observe(section);

    return () => {
      cancelled = true;
      resize.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}
