import type { Promo } from "./data";

/** Slim butter bar above the header while a special is on; jumps to the Special section. */
export default function PromoStrip({ promo }: { promo: Promo }) {
  return (
    <a
      href="#especial"
      className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 bg-butter px-4 py-2.5 text-center text-sm font-bold text-forest"
    >
      <span className="font-display text-base font-extrabold">{promo.name}</span>
      <span aria-hidden="true">·</span>
      <span>{promo.stripLine}</span>
      <span aria-hidden="true">·</span>
      <span className="underline decoration-2 underline-offset-4">Encargala ↓</span>
    </a>
  );
}
