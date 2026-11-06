import { getImageProps } from "next/image";
import { Fragment } from "react";

// Headline words pop in one after another
const WORDS = ["Repostería", "casera,", "como", "la", "de"];
const STAGGER_MS = 80;

const ALT =
  "La mesa de la cocina en plena horneada: scones, afghans de chocolate con nuez, un rogel con merengue tostado y un budín glaseado sobre tablas de madera";

// Ellie's own crops (docs/superpowers/notes/2026-11-06-hero-crop.json), natural colour.
// Desktop: 1.6:1 strip (scones, the stacked rogel and the cake slice). Phones: 1:2, the right-hand side.
// Each export has its editor frame's aspect, so object-cover + centre shows the chosen area.
const DESKTOP_MEDIA = "(min-width: 768px)";
const common = { alt: ALT, sizes: "100vw", fetchPriority: "high", loading: "eager" } as const;
const {
  props: { srcSet: wideSrcSet },
} = getImageProps({ ...common, src: "/home/kitchen-wide.webp", width: 2400, height: 1500 });
const {
  props: { srcSet: tallSrcSet, ...tallImg },
} = getImageProps({ ...common, src: "/home/kitchen-tall.webp", width: 1200, height: 2400 });

/**
 * The kitchen photo, edge to edge and about one screen tall, with the header (laid over it
 * from page.tsx) and the headline on it. Darkened evenly so the outlined letters stand out;
 * rounded bottom corners with a manteca drop, like a giant sticker. No buttons on the photo.
 */
export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative isolate mb-[34px] h-[100svh] max-h-[900px] min-h-[560px] overflow-hidden rounded-b-[36px] bg-forest shadow-[0_7px_0_var(--color-manteca)] md:mb-11 md:h-[clamp(560px,100svh,62.5vw)] md:max-h-none md:rounded-b-[56px] md:shadow-[0_10px_0_var(--color-manteca)]"
    >
      <picture>
        <source media={DESKTOP_MEDIA} srcSet={wideSrcSet} sizes="100vw" />
        <img
          {...tallImg}
          srcSet={tallSrcSet}
          alt={ALT}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </picture>

      {/* Even dim (D3) plus a soft extra shade at the top for the header */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[rgba(20,14,8,.42)]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(20,16,10,.38),rgba(20,16,10,0)_32%)]"
      />

      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1440px] px-4 pb-[84px] md:px-[34px] md:pb-[70px]">
        <div className="max-w-[620px]">
          <p className="eyebrow text-sheet [text-shadow:0_1px_6px_rgba(0,0,0,.6)]">Hecho a mano en Acassuso</p>
          <h1 className="text-outline mt-2 font-display text-[clamp(36px,11.3vw,44px)] leading-[0.92] font-black tracking-[-0.02em] [--outline:7px] md:text-[clamp(52px,5vw,66px)] md:[--outline:9px]">
            {WORDS.map((w, i) => (
              <Fragment key={w}>
                <span className="inline-block animate-pop" style={{ animationDelay: `${i * STAGGER_MS}ms` }}>
                  {w}
                </span>{" "}
              </Fragment>
            ))}
            <em
              className="inline-block animate-pop text-manteca"
              style={{ animationDelay: `${WORDS.length * STAGGER_MS}ms` }}
            >
              antes.
            </em>
          </h1>
        </div>
      </div>
    </section>
  );
}
