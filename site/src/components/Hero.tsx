import Image from "next/image";
import { ChatIcon } from "./icons";
import { WA_HELLO, getActivePromo, whatsappLink } from "./data";

function PromoHero({ promo }: { promo: NonNullable<ReturnType<typeof getActivePromo>> }) {
  return (
    <section
      id="inicio"
      className="mx-auto flex max-w-[1280px] flex-wrap-reverse items-center gap-x-16 gap-y-10 px-6 pt-2 pb-16"
    >
      <div className="flex min-w-0 flex-[1_1_400px] flex-col items-start">
        <p className="-rotate-2 font-hand text-[21px] text-honey">
          {promo.tagline}
        </p>
        <h1 className="mt-3.5 font-serif text-[clamp(40px,5vw,68px)] leading-[1.06] font-normal tracking-[-0.035em] text-ink-deep">
          {promo.name}
        </h1>
        <ul className="mt-[22px] max-w-[440px] list-disc space-y-1.5 pl-5 text-[17px] leading-[1.6] text-ink-soft">
          {promo.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-5 font-serif text-[28px] text-ink-deep">
          ${promo.price.toLocaleString("es-AR")}
        </p>
        <p className="mt-1 font-hand text-[17px] text-honey">
          {promo.scarcityLine}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={whatsappLink(promo.whatsappMessage)}
            className="inline-flex min-h-[54px] items-center gap-2.5 rounded-full bg-moss px-[26px] font-semibold text-cream shadow-[0_10px_22px_-12px_rgba(52,80,63,0.9)] transition-colors hover:bg-moss-dark"
          >
            <ChatIcon filled />
            Encargar la caja
          </a>
        </div>
      </div>

      <figure className="relative m-0 min-w-0 flex-[1_1_440px]">
        <div className="relative h-[clamp(340px,46vw,640px)] overflow-hidden rounded">
          <Image
            src={promo.photoSrc}
            alt={promo.photoAlt}
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
          {promo.name}
        </figcaption>
      </figure>
    </section>
  );
}

export default function Hero() {
  const promo = getActivePromo();
  if (promo) return <PromoHero promo={promo} />;

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
            alt="Rogel casero, capa por capa, con dulce de leche y merengue tostado, sobre una mesa de madera enharinada"
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
          Rogel casero, merengue bien tostado
        </figcaption>
      </figure>
    </section>
  );
}
