"use client";

import { useEffect, useRef } from "react";
import type MatterJS from "matter-js";
import { ITEM_INSET, PLANK_OVERHANG, SIZES, fitRow, layoutRow, rowFor, type Kind } from "./pantry/shelf";
import { drawShelf, drawSprite, makeSprites, type ShelfLayout, type Sprite } from "./pantry/art";
import { createPantry, type PantryWorld } from "./pantry/world";

/**
 * The pantry shelf behind the contact section. Decorative: the canvas never takes clicks.
 * It's drawn standing still at first (and always with reduced motion). The physics loads
 * only when the section gets near, and the opening knock plays the first time the shelf is seen.
 */
export default function Pantry() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.parentElement;
    const shelfLine = section?.querySelector<HTMLElement>("[data-shelf]");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !section || !shelfLine || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let sprites: Record<Kind, Sprite> | null = null;
    let layout: ShelfLayout | null = null;
    let Matter: typeof MatterJS | null = null;
    let world: PantryWorld | null = null;
    let shelfSeen = false;
    let dropped = false;
    let onScreen = false;
    let frame = 0;
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

    /** (Re)measure, size the canvas, and start a fresh world if physics is ready. */
    const build = () => {
      if (!sprites) return;
      layout = measure();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(layout.width * dpr);
      canvas.height = Math.round(layout.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      world?.destroy();
      world = Matter && !reduced ? createPantry(Matter, sprites, layout) : null;
      if (world) world.draw(ctx);
      else drawStill();
    };

    const loop = () => {
      frame = 0;
      if (!world || !onScreen) return;
      world.step();
      world.draw(ctx);
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!frame && world && onScreen) frame = requestAnimationFrame(loop);
    };
    const maybeDrop = () => {
      if (dropped || !shelfSeen || !world) return;
      dropped = true;
      world.drop();
      start();
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
      maybeDrop();
      start();
    });

    // Load the physics only when the section is within a screen of the viewport
    const near = new IntersectionObserver(
      (entries) => {
        if (reduced || Matter || !entries.some((e) => e.isIntersecting)) return;
        near.disconnect();
        import("matter-js").then((mod) => {
          if (cancelled) return;
          Matter = mod.default;
          build();
          maybeDrop();
          start();
        });
      },
      { rootMargin: "100% 0px 100% 0px" },
    );
    near.observe(section);

    // Only animate while the section is on screen
    const visible = new IntersectionObserver((entries) => {
      onScreen = entries.some((e) => e.isIntersecting);
      start();
    });
    visible.observe(section);

    // The knock plays the first time the shelf itself scrolls into view
    const seen = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      shelfSeen = true;
      seen.disconnect();
      maybeDrop();
    });
    seen.observe(shelfLine);

    // A new width or height (rotation, fonts, images) re-lays out the shelf
    let lastW = 0;
    let lastH = 0;
    const resize = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (Math.abs(width - lastW) < 1 && Math.abs(height - lastH) < 1) return;
      lastW = width;
      lastH = height;
      build();
      start();
    });
    resize.observe(section);

    const rel = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top] as const;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !world) return;
      world.pointer(...rel(e));
      start();
    };
    const onLeave = () => world?.pointer(null);
    // Taps and clicks on anything but a link flick what's under them. Never blocks scrolling.
    const onClick = (e: MouseEvent) => {
      if (!world || (e.target as Element).closest("a")) return;
      world.tap(...rel(e));
      start();
    };
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    section.addEventListener("click", onClick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      near.disconnect();
      visible.disconnect();
      seen.disconnect();
      resize.disconnect();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      section.removeEventListener("click", onClick);
      world?.destroy();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}
