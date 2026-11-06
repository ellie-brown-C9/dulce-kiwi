"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { MenuItem, OccasionId } from "./menu/items.ts";
import { formatPrice, planFor, quantityLabel, suggest } from "./menu/logic.ts";

const OCCASION_CHIPS: { value: OccasionId; label: string }[] = [
  { value: "merienda", label: "Merienda" },
  { value: "postre", label: "Postre" },
  { value: "juntada", label: "Juntada" },
  { value: "cumple", label: "Cumple" },
];

// Four "how many" ranges; each value is a PEOPLE size the menu page understands
const PEOPLE_CHIPS: { value: number; label: string }[] = [
  { value: 4, label: "2 a 4" },
  { value: 8, label: "5 a 8" },
  { value: 15, label: "9 a 15" },
  { value: 20, label: "16 o más" },
];

function Chips<T extends string | number>({
  id,
  label,
  options,
  value,
  onChange,
}: {
  id: string;
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <>
      <p id={id} className="mt-4 mb-2 text-[12px] font-bold tracking-[0.1em] text-ink-soft uppercase">
        {label}
      </p>
      <div role="group" aria-labelledby={id} className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(o.value)}
              className={`min-h-11 rounded-full border-[1.5px] border-forest px-4 text-[14px] font-bold whitespace-nowrap transition-colors ${
                on ? "bg-forest text-sheet" : "text-forest hover:bg-forest/10"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </>
  );
}

function SuggestionCard({ item, people, href }: { item: MenuItem; people: number; href: string }) {
  const plan = planFor(item, people);
  return (
    <Link
      href={href}
      className="flex min-w-0 flex-col rounded-[24px] bg-sheet p-2.5 pb-3.5 transition-transform hover:-translate-y-0.5"
    >
      {item.photo ? (
        <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] bg-cream">
          <Image
            src={item.photo}
            alt={item.photoAlt}
            fill
            sizes="(min-width: 768px) 280px, 45vw"
            className="object-cover"
          />
        </div>
      ) : (
        // Text-only panel, as on the menu page, the same size as a photo
        <div className="flex aspect-[4/5] flex-col items-center justify-center rounded-[16px] bg-cream px-2.5 py-4 text-center sm:px-5">
          <span className="max-w-full font-display text-[20px] leading-[0.95] font-black tracking-[-0.01em] break-words hyphens-auto text-forest min-[390px]:text-[24px] sm:text-[30px]">
            {item.name}
          </span>
          <span className="mt-2.5 max-w-[24ch] text-[12.5px] leading-[1.4] text-ink-soft sm:mt-4 sm:text-[14px]">
            {item.desc}
          </span>
        </div>
      )}
      <h3 className={`mx-1.5 mt-2.5 mb-1.5 font-display text-[15px] leading-[1.1] font-extrabold md:text-[18px] ${item.photo ? "" : "sr-only"}`}>
        {item.name}
      </h3>
      <div className="mx-1.5 mt-auto flex flex-wrap items-center justify-between gap-1.5">
        <span className="inline-block rounded-full bg-manteca px-[11px] py-[3px] text-[12px] font-bold whitespace-nowrap max-[389px]:max-w-full max-[389px]:rounded-[12px] max-[389px]:px-2 max-[389px]:text-[11px] max-[389px]:leading-[1.25] max-[389px]:whitespace-normal">
          {quantityLabel(item, plan.size, plan.qty)}
        </span>
        <span className="font-display font-extrabold">{formatPrice(plan.total)}</span>
      </div>
    </Link>
  );
}

/**
 * Homepage menu section (version B): "¿Qué estás armando?" with tap chips for the occasion and the
 * group size on the left, the first two suggestions on the right, and one button that opens /menu
 * with the same answers.
 */
export default function MenuTeaser() {
  const [occasion, setOccasion] = useState<OccasionId>("merienda");
  const [people, setPeople] = useState(8);
  const href = `/menu?ocasion=${occasion}&personas=${people}`;
  const picks = suggest(occasion, people).slice(0, 2);

  return (
    <section id="menu" className="px-4 pt-12 pb-14 md:px-[30px] md:pt-[60px] md:pb-[66px]">
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-6 md:grid-cols-[0.95fr_1.05fr] md:gap-10">
        <div>
          <div className="eyebrow">El menú</div>
          <h2 className="mt-2 mb-[22px] font-display text-[34px] leading-none font-black text-forest md:text-[clamp(40px,3.6vw,52px)]">
            ¿Qué estás <em className="text-terracotta">armando?</em>
          </h2>
          <Chips id="teaser-ocasion" label="¿Para qué es?" options={OCCASION_CHIPS} value={occasion} onChange={setOccasion} />
          <Chips id="teaser-personas" label="¿Cuántos son?" options={PEOPLE_CHIPS} value={people} onChange={setPeople} />
        </div>

        <div>
          <div className="grid grid-cols-2 gap-3.5" aria-live="polite">
            {picks.map((item) => (
              <SuggestionCard key={item.id} item={item} people={people} href={href} />
            ))}
          </div>
          <Link
            href={href}
            className="btn-pop mt-[22px] flex min-h-[52px] w-full items-center justify-center rounded-full bg-forest px-4 text-center text-[14px] font-bold text-balance text-sheet md:px-[26px] md:text-[15px]"
          >
            Ver más recomendaciones y el menú completo →
          </Link>
        </div>
      </div>
    </section>
  );
}
