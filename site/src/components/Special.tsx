import Image from "next/image";
import { ChatIcon } from "./icons";
import { type Promo, formatPromoEnd, whatsappLink } from "./data";

/** Promo name with its highlight words in manteca italic. */
function PromoName({ name, highlight }: { name: string; highlight?: string }) {
  const at = highlight ? name.indexOf(highlight) : -1;
  if (!highlight || at < 0) return <>{name}</>;
  return (
    <>
      {name.slice(0, at)}
      <em className="font-extrabold text-manteca">{highlight}</em>
      {name.slice(at + highlight.length)}
    </>
  );
}

/** The current special, right under the hero. Only rendered while a promo is active. */
export default function Special({ promo }: { promo: Promo }) {
  return (
    <section id="especial" className="scroll-mt-6 px-6 pb-20">
      {/* Phones: the photo pops out over the card's top edge, hence the top margin */}
      <div className="reveal mx-auto mt-[100px] grid max-w-[1180px] items-center gap-8 rounded-[28px] bg-forest px-6 pt-0 pb-7 text-cream sm:px-10 md:mt-0 md:grid-cols-[1fr_1.15fr] md:gap-14 md:p-12">
        <figure className="relative m-0 mx-auto -mt-[100px] w-[230px] md:mt-0 md:w-full md:max-w-[480px]">
          <div className="shape-blob relative aspect-square -rotate-3 overflow-hidden border-[6px] border-sheet shadow-[0_10px_26px_rgba(0,0,0,0.2)] md:border-8">
            <Image
              src={promo.photoSrc}
              alt={promo.photoAlt}
              fill
              sizes="(min-width: 768px) 480px, 230px"
              className="object-cover"
            />
          </div>
          <p className="absolute -right-6 bottom-2 flex aspect-square w-[92px] -rotate-[8deg] flex-col items-center justify-center rounded-full bg-manteca text-center text-forest md:-right-[4%] md:bottom-[4%] md:w-[30%] md:max-w-[150px]">
            <span className="font-display text-[18px] leading-none font-black md:text-[clamp(20px,2.6vw,30px)]">
              ${promo.price.toLocaleString("es-AR")}
            </span>
            <span className="mt-1 text-[9px] font-bold tracking-[0.12em] uppercase md:text-[11px]">
              la caja
            </span>
          </p>
        </figure>

        <div className="min-w-0">
          <p className="eyebrow text-manteca">
            Edición especial · hasta el {formatPromoEnd(promo.endDate)}
          </p>
          <h2 className="mt-3 font-display text-[clamp(38px,4.6vw,60px)] leading-[0.98] font-black tracking-[-0.02em] text-sheet">
            <PromoName name={promo.name} highlight={promo.nameHighlight} />
          </h2>
          <p className="mt-3 font-display text-xl text-manteca italic">{promo.tagline}</p>
          <ul className="mt-6 grid gap-2 text-[15px] leading-relaxed text-cream/90">
            {promo.items.map((item) => (
              <li key={item.name} className="flex gap-2.5">
                <span aria-hidden="true" className="text-manteca">
                  ✺
                </span>
                <span>
                  {item.name}
                  {item.detail && (
                    <>
                      <span className="hidden md:inline"> ({item.detail})</span>
                      <span className="block font-display text-[13px] leading-snug text-cream/60 italic md:hidden">
                        {item.detail}
                      </span>
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 inline-block -rotate-2 rounded-full bg-terracotta px-4 py-1.5 text-sm font-bold text-sheet">
            {promo.scarcityLine}
          </p>
          <div className="mt-6">
            <a
              href={whatsappLink(promo.whatsappMessage)}
              className="btn-pop inline-flex min-h-[54px] items-center gap-2.5 rounded-full bg-manteca px-7 font-bold text-forest [--btn-shadow:var(--color-sheet)]"
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
