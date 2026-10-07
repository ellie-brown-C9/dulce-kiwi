import Image from "next/image";
import { ChatIcon } from "./icons";
import { WA_HELLO } from "./data";

export default function Hero() {
  return (
    // On phones the photo wraps ABOVE the text (wrap-reverse)
    <section
      id="inicio"
      className="mx-auto flex max-w-[1280px] flex-wrap-reverse items-center gap-x-16 gap-y-10 px-6 pt-2 pb-16"
    >
      <div className="flex min-w-0 flex-[1_1_400px] flex-col items-start">
        <p className="-rotate-2 font-hand text-[21px] text-honey">
          hecho a mano en Acassuso
        </p>
        <h1 className="mt-3.5 font-serif text-[clamp(44px,5.4vw,76px)] leading-[1.04] font-normal tracking-[-0.035em] text-ink-deep">
          Repostería casera, como la de <em className="text-moss">antes.</em>
        </h1>
        <p className="mt-[22px] max-w-[440px] text-lg leading-[1.65] text-ink-soft">
          Soy Ellie. Crecí en una granja en Nueva Zelanda y ahora horneo cada
          semana en mi cocina, con ingredientes de verdad: nueces, dátiles,
          fruta y harinas integrales.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={WA_HELLO}
            className="inline-flex min-h-[54px] items-center gap-2.5 rounded-full bg-moss px-[26px] font-semibold text-cream shadow-[0_10px_22px_-12px_rgba(52,80,63,0.9)] transition-colors hover:bg-moss-dark"
          >
            <ChatIcon filled />
            Pedime algo rico
          </a>
          <a
            href="#horno"
            className="font-semibold text-ink underline decoration-honey/45 decoration-2 underline-offset-[6px]"
          >
            Qué hay esta semana ↓
          </a>
        </div>
      </div>

      <figure className="relative m-0 min-w-0 flex-[1_1_440px]">
        <div className="relative h-[clamp(340px,46vw,640px)] overflow-hidden rounded">
          <Image
            src="/home/bake-crepe.webp"
            alt="Torta alta de panqueques con dulce de leche y merengue tostado, sobre una mesa de madera enharinada"
            fill
            priority
            sizes="(min-width: 1280px) 600px, (min-width: 900px) 50vw, 100vw"
            className="object-cover object-[center_60%]"
          />
        </div>
        <p className="absolute -top-3.5 right-[18px] w-[150px] rotate-[5deg] bg-cream px-3.5 py-[18px] text-center font-hand text-[19px] leading-tight text-ink shadow-[0_12px_24px_-12px_rgba(40,26,12,0.5)]">
          Siempre casero. Nunca apurado.
        </p>
        <figcaption className="absolute bottom-4 left-[18px] rounded-sm bg-cream/90 px-3 py-1.5 text-[13px] text-ink">
          Torta de panqueques con dulce de leche
        </figcaption>
      </figure>
    </section>
  );
}
