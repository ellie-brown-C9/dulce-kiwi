import Image from "next/image";
import { Fragment } from "react";
import { ChatIcon } from "./icons";
import { WA_HELLO } from "./data";

// Headline words pop in one after another
const WORDS = ["Repostería", "casera,", "como", "la", "de"];
const STAGGER_MS = 80;

export default function Hero() {
  return (
    // On phones the photo wraps ABOVE the text (wrap-reverse)
    <section
      id="inicio"
      className="mx-auto flex max-w-[1280px] flex-wrap-reverse items-center gap-x-16 gap-y-12 px-6 pt-4 pb-20"
    >
      <div className="flex min-w-0 flex-[1_1_400px] flex-col items-start">
        <p className="eyebrow">Hecho a mano en Acassuso</p>
        <h1 className="mt-4 font-display text-[clamp(46px,6vw,84px)] leading-[0.96] font-black tracking-[-0.02em] text-forest">
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
        <p className="mt-6 max-w-[460px] text-lg leading-[1.65] text-ink-soft">
          Soy Ellie. Crecí en una granja en Nueva Zelanda y ahora horneo cada
          semana en mi cocina, con ingredientes de verdad: nueces, dátiles,
          fruta y harinas integrales.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
          <a
            href={WA_HELLO}
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

      <figure className="relative m-0 min-w-0 flex-[1_1_420px]">
        <div className="shape-arch relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden">
          <Image
            src="/home/bake-crepe.webp"
            alt="Rogel casero, capa por capa, con dulce de leche y merengue tostado, sobre una mesa de madera enharinada"
            fill
            priority
            sizes="(min-width: 1280px) 520px, (min-width: 900px) 45vw, 90vw"
            className="object-cover object-[center_55%]"
          />
        </div>
        <Image
          src="/brand/badge-kiwi.png"
          alt=""
          width={1200}
          height={1200}
          className="absolute bottom-[8%] left-0 w-[26%] max-w-[150px] animate-bob"
        />
        <p className="absolute top-[7%] right-0 flex aspect-square w-[27%] max-w-[150px] rotate-[8deg] items-center justify-center rounded-full bg-manteca p-3 text-center font-display text-[clamp(13px,1.6vw,18px)] leading-tight font-bold text-forest italic">
          Siempre casero. Nunca apurado.
        </p>
      </figure>
    </section>
  );
}
