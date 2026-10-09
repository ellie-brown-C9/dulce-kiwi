import Image from "next/image";
import { ChatIcon } from "./icons";
import { type Promo, formatPromoEnd, whatsappLink } from "./data";

/** Promo name with its highlight words in butter italic. */
function PromoName({ name, highlight }: { name: string; highlight?: string }) {
  const at = highlight ? name.indexOf(highlight) : -1;
  if (!highlight || at < 0) return <>{name}</>;
  return (
    <>
      {name.slice(0, at)}
      <em className="font-extrabold text-butter">{highlight}</em>
      {name.slice(at + highlight.length)}
    </>
  );
}

/** The current special, right under the hero. Only rendered while a promo is active. */
export default function Special({ promo }: { promo: Promo }) {
  return (
    <section id="especial" className="scroll-mt-6 px-6 pb-20">
      <div className="reveal mx-auto grid max-w-[1180px] items-center gap-10 rounded-[28px] bg-forest p-6 text-cream sm:p-10 md:grid-cols-[1fr_1.15fr] md:gap-14 md:p-12">
        <figure className="relative m-0">
          <div className="shape-arch relative aspect-[10/11] overflow-hidden border-[6px] border-sheet">
            <Image
              src={promo.photoSrc}
              alt={promo.photoAlt}
              fill
              sizes="(min-width: 768px) 480px, 90vw"
              className="object-cover"
            />
          </div>
          <p className="absolute bottom-[8%] left-0 flex aspect-square w-[34%] max-w-[150px] -rotate-[8deg] flex-col items-center justify-center rounded-full bg-butter text-center text-forest">
            <span className="font-display text-[clamp(20px,2.6vw,30px)] leading-none font-black">
              ${promo.price.toLocaleString("es-AR")}
            </span>
            <span className="mt-1 text-[11px] font-bold tracking-[0.12em] uppercase">
              la caja
            </span>
          </p>
        </figure>

        <div className="min-w-0">
          <p className="eyebrow text-butter">
            Edición especial · hasta el {formatPromoEnd(promo.endDate)}
          </p>
          <h2 className="mt-3 font-display text-[clamp(38px,4.6vw,60px)] leading-[0.98] font-black tracking-[-0.02em] text-sheet">
            <PromoName name={promo.name} highlight={promo.nameHighlight} />
          </h2>
          <p className="mt-3 font-display text-xl text-butter italic">{promo.tagline}</p>
          <ul className="mt-6 grid gap-2 text-[15px] leading-relaxed text-cream/90">
            {promo.items.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span aria-hidden="true" className="text-butter">
                  ✺
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 inline-block -rotate-2 rounded-full bg-terracotta px-4 py-1.5 text-sm font-bold text-sheet">
            {promo.scarcityLine}
          </p>
          <div className="mt-6">
            <a
              href={whatsappLink(promo.whatsappMessage)}
              className="btn-pop inline-flex min-h-[54px] items-center gap-2.5 rounded-full bg-butter px-7 font-bold text-forest [--btn-shadow:var(--color-sheet)]"
            >
              <ChatIcon filled />
              Encargar la caja
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
