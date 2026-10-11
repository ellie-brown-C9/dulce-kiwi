// Drawing for the pantry shelf: package sprites (drawn once), the plank and flour dust.
import type { ItemKind, Kind } from "./shelf";
import { SIZES } from "./shelf";

export type Sprite = { img: HTMLCanvasElement; w: number; h: number };
export type Dust = { x: number; y: number; vx: number; vy: number; r: number; a: number };
export type ShelfLayout = {
  width: number;
  height: number;
  floor: number; // y of the shelf top, relative to the section
  plankX0: number;
  plankX1: number;
  row: ItemKind[];
  centres: number[];
};

const F = "#34503f", Y = "#ffd164", T = "#d9663b", C = "#fff7ec";
type Ctx = CanvasRenderingContext2D;
type Fonts = { display: string; sans: string };

function berry(x: Ctx, r: number) {
  const g = x.createRadialGradient(-r * 0.35, -r * 0.35, 1, 0, 0, r);
  g.addColorStop(0, "#6d7db3");
  g.addColorStop(1, "#2a3260");
  x.fillStyle = g;
  x.beginPath(); x.arc(0, 0, r, 0, 7); x.fill();
  x.fillStyle = "rgba(205,215,240,.22)";
  x.beginPath(); x.arc(0, 0, r, 0, 7); x.fill();
  x.strokeStyle = "#1b2245"; x.lineWidth = 1.3; x.beginPath();
  for (let k = 0; k < 5; k++) {
    const t = (k / 5) * Math.PI * 2;
    x.moveTo(r * 0.3, -r * 0.3);
    x.lineTo(r * 0.3 + Math.cos(t) * r * 0.28, -r * 0.3 + Math.sin(t) * r * 0.28);
  }
  x.stroke();
}

/** Draws every package once to its own small canvas, at device pixel ratio. Call after the fonts load. */
export function makeSprites(fonts: Fonts, dpr: number): Record<Kind, Sprite> {
  const label = (x: Ctx, s: string, px: number, y: number, style: string, col: string, cx: number, fam = fonts.display) => {
    x.font = `${style} ${px}px ${fam}`;
    x.fillStyle = col; x.textAlign = "center"; x.textBaseline = "middle";
    x.fillText(s, cx, y);
  };
  const make = (kind: Kind, draw: (x: Ctx, w: number, h: number) => void): Sprite => {
    const { w, h } = SIZES[kind];
    const img = document.createElement("canvas");
    img.width = Math.ceil(w * dpr); img.height = Math.ceil(h * dpr);
    const x = img.getContext("2d")!;
    x.scale(dpr, dpr);
    draw(x, w, h);
    return { img, w, h };
  };

  return {
    manteca: make("manteca", (x, w, h) => {
      x.fillStyle = "#fff3c9"; x.beginPath(); x.roundRect(0, 0, w, h, 4); x.fill();
      x.fillStyle = Y; x.fillRect(0, 0, 10, h); x.fillRect(w - 10, 0, 10, h);
      label(x, "MANTECA", 12, h / 2 - 2, "900", F, w / 2);
      label(x, "200 g", 7, h / 2 + 10, "700", T, w / 2, fonts.sans);
    }),
    harina: make("harina", (x, w, h) => {
      x.fillStyle = "#e9dcc3"; x.beginPath(); x.moveTo(6, 12); x.lineTo(10, 0); x.lineTo(w - 10, 0); x.lineTo(w - 6, 12); x.fill();
      x.fillStyle = "#f8f1e3"; x.beginPath(); x.roundRect(0, 10, w, h - 10, 4); x.fill();
      x.fillStyle = F; x.fillRect(0, 32, w, 28);
      label(x, "HARINA", 11, 42, "900", Y, w / 2);
      label(x, "integral", 9, 53, "italic 700", C, w / 2);
      x.fillStyle = "rgba(255,255,255,.7)";
      for (let i = 0; i < 14; i++) { x.beginPath(); x.arc(4 + ((i * 37) % (w - 8)), 64 + ((i * 13) % 12), 1, 0, 7); x.fill(); }
    }),
    vainilla: make("vainilla", (x, w, h) => {
      x.fillStyle = "#1f1a17"; x.beginPath(); x.roundRect(6, 0, 12, 11, 2); x.fill();
      x.fillStyle = "#5e2b0c"; x.fillRect(8.5, 10, 7, 9);
      x.fillStyle = "#6f340f"; x.beginPath(); x.roundRect(1, 18, w - 2, h - 18, 6); x.fill();
      x.fillStyle = "rgba(255,255,255,.2)"; x.fillRect(4, 22, 3, h - 28);
      x.fillStyle = C; x.fillRect(1, 28, w - 2, 28);
      x.save(); x.translate(w / 2, 42); x.rotate(-Math.PI / 2); label(x, "VAINILLA", 7.5, 0, "900", F, 0); x.restore();
    }),
    ddl: make("ddl", (x, w, h) => {
      x.fillStyle = "#9a5a2a"; x.beginPath(); x.roundRect(3, 11, w - 6, h - 11, 9); x.fill();
      x.fillStyle = "rgba(255,255,255,.22)"; x.beginPath(); x.roundRect(7, 15, 5, h - 22, 3); x.fill();
      for (let i = 0; i < 8; i++) for (let j = 0; j < 2; j++) { x.fillStyle = (i + j) % 2 ? "#ffffff" : T; x.fillRect(i * (w / 8), j * 6, w / 8 + 0.5, 6.5); }
      x.fillStyle = C; x.beginPath(); x.roundRect(6, 24, w - 12, 22, 3); x.fill();
      label(x, "Dulce", 9, 31, "italic 800", F, w / 2);
      label(x, "de leche", 8, 40, "italic 800", T, w / 2);
    }),
    huevos: make("huevos", (x, w, h) => {
      x.fillStyle = "#d8ccb6"; x.beginPath(); x.moveTo(0, h); x.lineTo(0, 12);
      for (let i = 0; i < 3; i++) { const cx = 12 + i * 24; x.quadraticCurveTo(cx - 12, 0, cx, 0); x.quadraticCurveTo(cx + 12, 0, cx + 12, 12); }
      x.lineTo(w, 12); x.lineTo(w, h); x.fill();
      x.fillStyle = "#c4b69c"; x.fillRect(0, 12, w, 3);
      x.fillStyle = C; x.beginPath(); x.roundRect(10, 16, w - 20, 13, 3); x.fill();
      label(x, "HUEVOS", 9, 23, "900", T, w / 2);
    }),
    cacao: make("cacao", (x, w, h) => {
      x.fillStyle = "#4a2a1a"; x.beginPath(); x.roundRect(0, 6, w, h - 6, 4); x.fill();
      x.fillStyle = "#6e4329"; x.beginPath(); x.roundRect(0, 0, w, 11, 3); x.fill();
      label(x, "CACAO", 11, 30, "900", Y, w / 2);
      label(x, "amargo", 8.5, 42, "italic 700", C, w / 2);
    }),
    leche: make("leche", (x, w, h) => {
      x.fillStyle = "#e8e1d4"; x.beginPath(); x.moveTo(0, 18); x.lineTo(w / 2, 4); x.lineTo(w, 18); x.fill();
      x.fillStyle = "#d6cdbd"; x.fillRect(w / 2 - 12, 0, 24, 6);
      x.fillStyle = "#ffffff"; x.beginPath(); x.roundRect(0, 18, w, h - 18, 3); x.fill();
      x.fillStyle = "#5b7fa6"; x.fillRect(0, 34, w, 22);
      label(x, "LECHE", 10, 45, "900", "#ffffff", w / 2);
      label(x, "entera", 7.5, 64, "italic 700", "#5b7fa6", w / 2);
    }),
    canela: make("canela", (x, w, h) => {
      x.fillStyle = T; x.beginPath(); x.roundRect(1, 0, w - 2, 11, 3); x.fill();
      x.fillStyle = "rgba(255,255,255,.35)"; x.beginPath(); x.roundRect(0, 10, w, h - 10, 4); x.fill();
      x.fillStyle = "#9a5428"; x.beginPath(); x.roundRect(2, 14, w - 4, h - 16, 3); x.fill();
      x.fillStyle = C; x.fillRect(2, 22, w - 4, 24);
      x.save(); x.translate(w / 2, 34); x.rotate(-Math.PI / 2); label(x, "CANELA", 8, 0, "900", F, 0); x.restore();
    }),
    azucar: make("azucar", (x, w, h) => {
      x.fillStyle = "#ffffff"; x.beginPath(); x.roundRect(0, 6, w, h - 6, 4); x.fill();
      x.fillStyle = "#eeeeee"; x.beginPath(); x.moveTo(4, 8); x.lineTo(8, 0); x.lineTo(w - 8, 0); x.lineTo(w - 4, 8); x.fill();
      x.fillStyle = T; x.beginPath(); x.roundRect(5, 24, w - 10, 24, 12); x.fill();
      label(x, "AZÚCAR", 8.5, 36, "900", C, w / 2);
      label(x, "1 kg", 7, 56, "700", T, w / 2, fonts.sans);
    }),
    miel: make("miel", (x, w, h) => {
      x.fillStyle = "#f6efe2"; x.beginPath(); x.moveTo(2, 12); x.quadraticCurveTo(w / 2, -4, w - 2, 12); x.lineTo(w - 4, 14); x.lineTo(4, 14); x.fill();
      x.strokeStyle = T; x.lineWidth = 2; x.beginPath(); x.moveTo(5, 12); x.lineTo(w - 5, 12); x.stroke();
      x.fillStyle = "#e3a12c"; x.beginPath(); x.roundRect(3, 14, w - 6, h - 14, [4, 4, 12, 12]); x.fill();
      x.fillStyle = "rgba(255,255,255,.28)"; x.beginPath(); x.roundRect(7, 18, 4, h - 26, 2); x.fill();
      x.fillStyle = F; x.beginPath(); x.ellipse(w / 2, 34, 14, 9, 0, 0, 7); x.fill();
      label(x, "MIEL", 9, 34, "900", Y, w / 2);
    }),
    polvo: make("polvo", (x, w, h) => {
      x.fillStyle = "#b8b2a6"; x.beginPath(); x.roundRect(0, 0, w, 8, 2); x.fill();
      x.fillStyle = "#c4452c"; x.beginPath(); x.roundRect(0, 6, w, h - 6, 3); x.fill();
      x.fillStyle = C; x.fillRect(0, 16, w, 20);
      label(x, "POLVO", 8, 23, "900", "#c4452c", w / 2);
      label(x, "de hornear", 6, 31, "italic 700", F, w / 2);
    }),
    nueces: make("nueces", (x, w, h) => {
      x.fillStyle = "#c99a62"; x.beginPath(); x.roundRect(0, 0, w, h, [2, 2, 4, 4]); x.fill();
      x.strokeStyle = "rgba(0,0,0,.15)"; x.beginPath(); for (let i = 0; i < 6; i++) { x.moveTo(4 + i * 8, 1); x.lineTo(4 + i * 8, 6); } x.stroke();
      x.fillStyle = "#efe3cf"; x.beginPath(); x.ellipse(w / 2, 40, 17, 12, 0, 0, 7); x.fill();
      x.fillStyle = "#8a5a30";
      for (const [dx, dy] of [[-7, -2], [5, -4], [-1, 5], [9, 4]]) { x.beginPath(); x.ellipse(w / 2 + dx, 40 + dy, 5, 4, dx * 0.1, 0, 7); x.fill(); }
      label(x, "NUECES", 10, 18, "900", F, w / 2);
    }),
    avena: make("avena", (x, w, h) => {
      x.fillStyle = "#f0d699"; x.beginPath(); x.roundRect(0, 0, w, h, 3); x.fill();
      x.fillStyle = "rgba(0,0,0,.08)"; x.fillRect(0, 0, w, 7);
      x.fillStyle = F; x.beginPath(); x.roundRect(4, 18, w - 8, 22, 4); x.fill();
      label(x, "AVENA", 10, 29, "900", Y, w / 2);
      x.fillStyle = "#d9b46a";
      for (let i = 0; i < 9; i++) { x.beginPath(); x.ellipse(8 + (i % 3) * 16, 49 + Math.floor(i / 3) * 7, 4.5, 2.6, (i % 2) * 0.6, 0, 7); x.fill(); }
    }),
    punnet: make("punnet", (x, w, h) => {
      for (let i = 0; i < 9; i++) { x.save(); x.translate(8 + (i % 5) * 10.5 + (i > 4 ? 5 : 0), i > 4 ? 6 : 11); berry(x, 6); x.restore(); }
      x.fillStyle = "rgba(190,210,235,.75)"; x.beginPath(); x.moveTo(0, 12); x.lineTo(w, 12); x.lineTo(w - 4, h); x.lineTo(4, h); x.fill();
      x.strokeStyle = "rgba(255,255,255,.7)"; x.lineWidth = 1; x.beginPath(); for (let i = 1; i < 6; i++) { x.moveTo((i * w) / 6, 13); x.lineTo((i * w) / 6, h - 1); } x.stroke();
      x.fillStyle = C; x.fillRect(8, 18, w - 16, 10);
      label(x, "ARÁNDANOS", 6.8, 23.5, "900", "#2a3260", w / 2);
    }),
  };
}

/** The wooden plank, its shadow and two brackets, with its top edge at y. */
export function drawShelf(ctx: Ctx, x0: number, x1: number, y: number) {
  const w = x1 - x0;
  ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.fillRect(x0 + 6, y + 14, w - 12, 6);
  ctx.fillStyle = "#9a6a40"; ctx.fillRect(x0, y, w, 14);
  ctx.fillStyle = "#b8834f"; ctx.fillRect(x0, y, w, 4);
  ctx.fillStyle = "#7d532f";
  for (const bx of [x0 + 66, x1 - 66]) {
    ctx.beginPath(); ctx.moveTo(bx - 6, y + 14); ctx.lineTo(bx + 6, y + 14); ctx.lineTo(bx + 6, y + 30); ctx.lineTo(bx - 6, y + 20); ctx.fill();
  }
}

/** One package centred at (x, y), rotated by angle (radians). */
export function drawSprite(ctx: Ctx, s: Sprite, x: number, y: number, angle: number) {
  ctx.save();
  ctx.translate(x, y); ctx.rotate(angle);
  ctx.shadowColor = "rgba(0,0,0,.18)"; ctx.shadowOffsetY = 2; ctx.shadowBlur = 3;
  ctx.drawImage(s.img, -s.w / 2, -s.h / 2, s.w, s.h);
  ctx.restore();
}

export function addDust(dust: Dust[], x: number, y: number, n: number, spread: number) {
  for (let i = 0; i < n; i++) {
    dust.push({
      x, y,
      vx: (Math.random() * 2 - 1) * spread,
      vy: (Math.random() * 1.3 - 1) * spread - 0.3,
      r: 2 + Math.random() * 4,
      a: 0.3 + Math.random() * 0.3,
    });
  }
}

/** Moves each flour puff on a frame, draws it, and drops the faded ones. */
export function stepAndDrawDust(ctx: Ctx, dust: Dust[]) {
  for (let i = dust.length - 1; i >= 0; i--) {
    const p = dust[i];
    p.x += p.vx; p.y += p.vy; p.vx *= 0.93; p.vy = p.vy * 0.93 - 0.01; p.r += 0.1; p.a -= 0.007;
    if (p.a <= 0) { dust.splice(i, 1); continue; }
    ctx.fillStyle = `rgba(255,250,240,${p.a})`;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
  }
}
