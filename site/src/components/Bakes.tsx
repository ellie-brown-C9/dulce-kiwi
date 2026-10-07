import Image from "next/image";
import { BAKES, WA_SPECIAL, whatsappLink } from "./data";

const CARD = "flex-[0_0_clamp(272px,27vw,360px)] snap-start";

export default function Bakes() {
  return (
    <section id="horno" className="pt-[88px] pb-24">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-end justify-between gap-x-12 gap-y-4 px-6">
        <div className="flex-[1_1_420px]">
          <p className="text-xs font-semibold tracking-[0.22em] text-moss uppercase">
            Esta semana en el horno
          </p>
          <h2 className="mt-3.5 font-serif text-[clamp(36px,4vw,54px)] leading-[1.1] font-normal tracking-[-0.03em] text-ink-deep">
            Lo que salió del horno
          </h2>
        </div>
        <p className="flex-[0_1_380px] leading-[1.65] text-ink-soft">
          No es un menú fijo: cambia con la estación y con lo que encuentro en
          la verdulería. Si algo te tienta, escribime y te lo guardo.
        </p>
      </div>

      <div className="no-scrollbar rail-gutter mt-12 flex snap-x snap-mandatory gap-7 overflow-x-auto pt-2 pb-4">
        {BAKES.map((b) => (
          <article key={b.name} className={CARD}>
            <div className="relative aspect-[4/5] overflow-hidden rounded">
              <Image
                src={b.img}
                alt={b.alt}
                fill
                sizes="(min-width: 1333px) 360px, (min-width: 1008px) 27vw, 272px"
                className="object-cover"
              />
              <span className="absolute bottom-3.5 left-3.5 -rotate-3 bg-cream px-3 py-1 font-hand text-[17px] text-ink shadow-[0_6px_12px_-6px_rgba(40,26,12,0.45)]">
                {b.note}
              </span>
            </div>
            <h3 className="mt-5 font-serif text-[23px] leading-tight font-medium text-ink-deep">
              {b.name}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{b.detail}</p>
            <a
              href={whatsappLink(
                `¡Hola Ellie! Me gustaría encargarte ${b.name.toLowerCase()}.`,
              )}
              className="mt-1 inline-flex min-h-11 items-center text-[15px] font-semibold text-moss underline decoration-[1.5px] underline-offset-[5px] hover:text-moss-dark"
            >
              Pedíselo a Ellie →
            </a>
          </article>
        ))}

        <article
          className={`${CARD} flex aspect-[4/5] flex-col justify-end rounded bg-oat px-7 py-8`}
        >
          <p className="font-hand text-[19px] text-honey">¿no está lo que buscás?</p>
          <p className="mt-2 font-serif text-[27px] leading-[1.2] text-ink-deep">
            Un cumpleaños, una mesa dulce, algo para el mate…
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
            Contame qué tenés ganas de comer y lo armamos juntos.
          </p>
          <a
            href={WA_SPECIAL}
            className="mt-[22px] inline-flex min-h-[46px] items-center self-start rounded-full bg-moss px-5 text-[15px] font-semibold text-cream hover:bg-moss-dark"
          >
            Contame
          </a>
        </article>
      </div>
    </section>
  );
}
