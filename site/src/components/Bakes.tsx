import Image from "next/image";
import { BAKES, WA_SPECIAL, whatsappLink } from "./data";

const CARD = "flex-[0_0_clamp(260px,26vw,340px)] snap-start";

export default function Bakes() {
  return (
    <section id="horno" className="pt-20 pb-24">
      <div className="reveal mx-auto flex max-w-[1280px] flex-wrap items-end justify-between gap-x-12 gap-y-4 px-6">
        <div className="flex-[1_1_420px]">
          <p className="eyebrow">Esta semana en el horno</p>
          <h2 className="mt-3 font-display text-[clamp(38px,4.6vw,60px)] leading-none font-black tracking-[-0.02em] text-forest">
            Lo que salió <em className="font-extrabold text-terracotta">del horno</em>
          </h2>
        </div>
        <p className="flex-[0_1_380px] leading-[1.65] text-ink-soft">
          No es un menú fijo: cambia con la estación y con lo que encuentro en
          la verdulería. Si algo te tienta, escribime y te lo guardo.
        </p>
      </div>

      <div className="no-scrollbar rail-gutter tilt-rail mt-10 flex snap-x snap-mandatory items-start gap-8 overflow-x-auto pt-6 pb-8">
        {BAKES.map((b) => (
          <article key={b.name} className={CARD}>
            <div className="relative">
              <div className="shape-blob relative aspect-square overflow-hidden border-[6px] border-sheet">
                <Image
                  src={b.img}
                  alt={b.alt}
                  fill
                  sizes="(min-width: 1308px) 340px, (min-width: 1000px) 26vw, 260px"
                  className="object-cover"
                />
              </div>
              <span className="absolute bottom-3 left-0 -rotate-6 rounded-full bg-manteca px-3.5 py-1 font-display text-[15px] font-bold text-forest italic">
                {b.note}
              </span>
            </div>
            <h3 className="mt-5 font-display text-[23px] leading-tight font-extrabold text-forest">
              {b.name}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{b.detail}</p>
            <a
              href={whatsappLink(
                `¡Hola Ellie! Me gustaría encargarte ${b.name.toLowerCase()}.`,
              )}
              className="mt-1 inline-flex min-h-11 items-center text-[15px] font-bold text-forest underline decoration-manteca decoration-[3px] underline-offset-[6px] hover:text-forest-dark"
            >
              Pedíselo a Ellie →
            </a>
          </article>
        ))}

        <article
          className={`${CARD} flex aspect-square flex-col justify-end rounded-[28px] bg-forest px-7 py-8 text-cream`}
        >
          <h3 className="font-display text-[28px] leading-[1.1] font-extrabold text-sheet">
            ¿No está lo que buscás?
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-cream/85">
            Un cumpleaños, una mesa dulce, algo para el mate… Contame qué tenés
            ganas de comer y lo armamos juntos.
          </p>
          <a
            href={WA_SPECIAL}
            className="btn-pop mt-6 inline-flex min-h-12 items-center self-start rounded-full bg-manteca px-6 text-[15px] font-bold text-forest [--btn-shadow:var(--color-sheet)]"
          >
            Contame
          </a>
        </article>
      </div>
    </section>
  );
}
