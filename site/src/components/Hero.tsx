import Image from "next/image";
import { Fragment } from "react";
import { ChatIcon } from "./icons";
import { WA_HELLO } from "./data";

// Headline words pop in one after another
const WORDS = ["Repostería", "casera,", "como", "la", "de"];
const STAGGER_MS = 80;

/**
 * Phones: the wobbly photo comes first and the headline sits on a cream sticker that
 * overlaps its bottom edge, then the buttons, then the intro.
 * Desktop: headline, intro and buttons on the left, photo on the right.
 */
export default function Hero() {
  return (
    <section
      id="inicio"
      className="mx-auto grid max-w-[1280px] items-center px-6 pt-4 pb-20 md:grid-cols-[1.1fr_1fr] md:gap-x-16 md:pt-6"
    >
      <figure className="relative m-0 mx-auto w-full max-w-[300px] min-w-0 md:col-start-2 md:row-span-2 md:row-start-1 md:max-w-[520px]">
        <div className="shape-blob relative aspect-square w-full rotate-3 overflow-hidden border-[7px] border-sheet shadow-[0_12px_30px_rgba(52,80,63,0.18)] md:border-8">
          <Image
            src="/home/bake-crepe.webp"
            alt="Rogel casero, capa por capa, con dulce de leche y merengue tostado, sobre una mesa de madera enharinada"
            fill
            priority
            sizes="(min-width: 1280px) 520px, (min-width: 768px) 42vw, 300px"
            className="object-cover object-[center_55%]"
          />
        </div>
        <Image
          src="/brand/badge-kiwi.png"
          alt=""
          width={1200}
          height={1200}
          className="absolute bottom-[2%] -left-[6%] hidden w-[26%] max-w-[150px] animate-bob [--tilt:-10deg] md:block"
        />
        <p className="absolute -top-2 -right-3 flex aspect-square w-[92px] rotate-[8deg] items-center justify-center rounded-full bg-manteca p-2.5 text-center font-display text-[13px] leading-tight font-bold text-forest italic md:-top-[2%] md:-right-[4%] md:w-[27%] md:max-w-[150px] md:p-3 md:text-[clamp(13px,1.6vw,18px)]">
          Siempre casero. Nunca apurado.
        </p>
      </figure>

      {/* Phones: a cream sticker overlapping the photo. Desktop: plain text in the left column. */}
      <div className="relative z-10 -mt-[70px] -rotate-2 rounded-[30px] bg-sheet px-5 pt-[18px] pb-5 shadow-[0_6px_0_var(--color-manteca)] md:col-start-1 md:row-start-1 md:mt-0 md:rotate-0 md:self-end md:rounded-none md:bg-transparent md:p-0 md:shadow-none">
        <p className="eyebrow">Hecho a mano en Acassuso</p>
        <h1 className="mt-2.5 font-display text-[36px] leading-[0.96] font-black tracking-[-0.02em] text-forest md:mt-4 md:text-[clamp(46px,6vw,84px)]">
          {WORDS.map((w, i) => (
            <Fragment key={w}>
              <span
                className="inline-block animate-pop"
                style={{ animationDelay: `${i * STAGGER_MS}ms` }}
              >
                {w}
              </span>{" "}
            </Fragment>
          ))}
          <em
            className="inline-block animate-pop font-extrabold text-terracotta"
            style={{ animationDelay: `${WORDS.length * STAGGER_MS}ms` }}
          >
            antes.
          </em>
        </h1>
      </div>

      {/* Phones show the buttons before the intro; desktop the intro first */}
      <div className="flex min-w-0 flex-col items-start md:col-start-1 md:row-start-2 md:self-start">
        <p className="order-2 mt-6 max-w-[460px] text-base leading-[1.6] text-ink-soft md:order-1 md:text-lg md:leading-[1.65]">
          Soy Ellie. Crecí en una granja en Nueva Zelanda y ahora horneo cada
          semana en mi cocina, con ingredientes de verdad: nueces, dátiles,
          fruta y harinas integrales.
        </p>
        <div className="order-1 mt-6 flex flex-wrap items-center gap-x-7 gap-y-4 md:order-2 md:mt-9">
          <a
            href={WA_HELLO}
            data-hero-cta=""
            className="btn-pop inline-flex min-h-[54px] items-center gap-2.5 rounded-full bg-forest px-7 font-bold text-cream hover:bg-forest-dark"
          >
            <ChatIcon filled />
            Pedime algo rico
          </a>
          <a
            href="#horno"
            className="font-bold text-forest underline decoration-manteca decoration-[3px] underline-offset-[7px]"
          >
            Qué hay esta semana ↓
          </a>
        </div>
      </div>
    </section>
  );
}
