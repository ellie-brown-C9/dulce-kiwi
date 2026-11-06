"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { OCCASIONS, PEOPLE, type OccasionId } from "./menu/items.ts";
import Picker from "./menu/Picker";

const OCCASION_OPTIONS = (Object.keys(OCCASIONS) as OccasionId[]).map((id) => ({
  value: id,
  label: OCCASIONS[id].label,
}));
const PEOPLE_OPTIONS = PEOPLE.map((n) => ({ value: n, label: `${n} personas` }));

const BAKES = [
  { src: "/home/teaser-scones.webp", w: 600, h: 404, alt: "Scones" },
  { src: "/home/teaser-lemon-pie.webp", w: 600, h: 339, alt: "Lemon pie" },
  { src: "/home/teaser-lamington.webp", w: 600, h: 536, alt: "Lamingtons" },
];

/** Homepage menu teaser: the same matchmaker sentence as /menu, handing its answers over via the URL. */
export default function MenuTeaser() {
  const [occasion, setOccasion] = useState<OccasionId>("merienda");
  const [people, setPeople] = useState(6);

  return (
    <section id="menu" className="px-5 pt-16 pb-20 text-center sm:px-6 md:pt-24 md:pb-28">
      <div className="eyebrow">El menú</div>
      <h2 className="font-display mx-auto mt-3 max-w-[900px] text-[clamp(28px,8.2vw,62px)] leading-[1.18] font-black tracking-[-0.01em] text-balance">
        Es para {OCCASIONS[occasion].article}{" "}
        <Picker ariaLabel="Para qué es" value={occasion} options={OCCASION_OPTIONS} onChange={setOccasion} /> de{" "}
        <Picker ariaLabel="Cuántas personas" value={people} options={PEOPLE_OPTIONS} onChange={setPeople} />
      </h2>

      <div className="mx-auto mt-8 mb-8 flex max-w-[760px] items-end justify-center gap-3 sm:gap-10">
        {BAKES.map((b, i) => (
          <Image
            key={b.src}
            src={b.src}
            width={b.w}
            height={b.h}
            alt={b.alt}
            sizes="(min-width: 640px) 240px, 30vw"
            className={`h-auto max-h-[96px] w-auto max-w-[30%] object-contain drop-shadow-[0_10px_12px_rgba(60,40,20,0.22)] sm:max-h-[160px] ${
              i === 1 ? "-translate-y-3 sm:-translate-y-4" : ""
            }`}
          />
        ))}
      </div>

      <Link
        href={`/menu?ocasion=${occasion}&personas=${people}`}
        className="btn-pop inline-flex min-h-12 items-center rounded-full bg-forest px-6 text-[15px] font-bold whitespace-nowrap text-sheet"
      >
        Ver qué te sugiero →
      </Link>
      <Link
        href="/menu#todo"
        className="mx-auto mt-4 flex min-h-11 w-fit items-center text-[14px] font-bold text-forest underline decoration-manteca decoration-[3px] underline-offset-[6px]"
      >
        o mirá todo el menú
      </Link>
    </section>
  );
}
