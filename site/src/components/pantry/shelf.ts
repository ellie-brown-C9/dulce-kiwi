// What stands on the contact-section pantry shelf and where. Plain data and maths (unit tested).

export type ItemKind =
  | "harina" | "vainilla" | "ddl" | "huevos" | "cacao" | "leche"
  | "canela" | "azucar" | "miel" | "polvo" | "nueces" | "avena";
/** The two things that drop in at the start. Never on the shelf. */
export type DropKind = "manteca" | "punnet";
export type Kind = ItemKind | DropKind;

/** Drawn size of each package in CSS px (also its physics box). */
export const SIZES: Record<Kind, { w: number; h: number }> = {
  harina: { w: 54, h: 80 },
  vainilla: { w: 24, h: 64 },
  ddl: { w: 46, h: 56 },
  huevos: { w: 72, h: 32 },
  cacao: { w: 46, h: 58 },
  leche: { w: 42, h: 76 },
  canela: { w: 30, h: 54 },
  azucar: { w: 56, h: 68 },
  miel: { w: 46, h: 52 },
  polvo: { w: 38, h: 46 },
  nueces: { w: 52, h: 64 },
  avena: { w: 48, h: 72 },
  manteca: { w: 76, h: 36 },
  punnet: { w: 58, h: 34 },
};

/** Twelve different ingredients, left to right. */
export const DESKTOP_ROW: ItemKind[] = [
  "harina", "vainilla", "ddl", "huevos", "cacao", "leche",
  "canela", "azucar", "miel", "polvo", "nueces", "avena",
];
/** Phones: one shelf of six. */
export const PHONE_ROW: ItemKind[] = ["harina", "vainilla", "ddl", "huevos", "cacao", "leche"];

/** Below this section width the phone row is used. */
export const PHONE_MAX_WIDTH = 640;
export const rowFor = (width: number) => (width < PHONE_MAX_WIDTH ? PHONE_ROW : DESKTOP_ROW);

/** The manteca lands on the first, the punnet on the second. Both rows include them. */
export const KNOCK_TARGETS = ["vainilla", "leche"] as const satisfies readonly [ItemKind, ItemKind];

export const MIN_GAP = 8; // px between packages, at the tightest
export const ITEM_INSET = 10; // px from each end of the plank to the first and last package
export const PLANK_OVERHANG = 8; // px the plank sticks out past the content column

const widthOf = (row: ItemKind[]) =>
  row.reduce((t, k) => t + SIZES[k].w, 0) + MIN_GAP * Math.max(0, row.length - 1);

/** Drops items from the right until the row fits between x0 and x1. The knock targets always stay. */
export function fitRow(row: ItemKind[], x0: number, x1: number): ItemKind[] {
  const out = [...row];
  for (let i = out.length - 1; i >= 0 && widthOf(out) > x1 - x0; i--) {
    if (!(KNOCK_TARGETS as readonly ItemKind[]).includes(out[i])) out.splice(i, 1);
  }
  return out;
}

/** Centre x of each item, spread from x0 to x1 with equal gaps. */
export function layoutRow(row: ItemKind[], x0: number, x1: number): number[] {
  const total = row.reduce((t, k) => t + SIZES[k].w, 0);
  const gap = row.length > 1 ? (x1 - x0 - total) / (row.length - 1) : 0;
  let x = x0;
  return row.map((k) => {
    const c = x + SIZES[k].w / 2;
    x += SIZES[k].w + gap;
    return c;
  });
}

/** px per frame. The pointer pushes no harder than this, so a fast swipe nudges instead of bulldozing. */
export const MAX_PUSH = 10;
export const capPush = (v: number) => Math.max(-MAX_PUSH, Math.min(MAX_PUSH, v));
