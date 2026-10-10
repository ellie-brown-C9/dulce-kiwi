import Image from "next/image";

// Then and now, in age order; each arch sits on a block of one brand colour
const MOMENTS = [
  {
    src: "/home/ellie-farm.webp",
    alt: "Ellie de chiquita, con una galletita en la mano, en la granja de Kumeu",
    age: "3 años",
    caption: "Kumeu, NZ",
    block: "bg-manteca",
  },
  {
    src: "/home/ellie-baking.webp",
    alt: "Ellie a los ocho años con delantal, preparando muffins en la cocina de su casa",
    age: "8 años",
    caption: "mis primeros muffins",
    block: "bg-terracotta",
  },
  {
    src: "/home/ellie.webp",
    alt: "Ellie sonriendo en su cocina, con un café sobre la mesa",
    age: "hoy",
    caption: "Acassuso",
    block: "bg-forest",
  },
];

/** Three equal arches (3 → 8 → today); on hover a photo lifts gently off its colour block. */
function Photos() {
  return (
    <ul className="reveal grid min-w-0 flex-[1.6_1_520px] grid-cols-3 items-end gap-4 pr-3 pb-3 sm:gap-7">
      {MOMENTS.map((m) => (
        <li key={m.age} className="group text-center">
          <div className="relative">
            <div aria-hidden="true" className={`shape-arch absolute inset-0 translate-x-3 translate-y-3 ${m.block}`} />
            <div className="shape-arch relative aspect-[3/4.2] overflow-hidden transition-transform duration-[450ms] ease-[cubic-bezier(0.3,1.4,0.5,1)] group-hover:-translate-x-1.5 group-hover:-translate-y-1.5">
              <Image
                src={m.src}
                alt={m.alt}
                fill
                sizes="(min-width: 1100px) 230px, (min-width: 640px) 30vw, 32vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </div>
          </div>
          <span className="mt-6 inline-block rounded-full bg-forest px-3 py-0.5 font-display text-sm font-black text-manteca sm:text-base">
            {m.age}
          </span>
          <span className="mt-1.5 block font-display text-xs leading-tight font-semibold text-ink-soft italic sm:text-sm">
            {m.caption}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function Story() {
  return (
    <section id="historia" className="bg-sheet px-6 py-24">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-14 gap-y-16">
        <Photos />

        <div className="reveal min-w-0 flex-[1_1_420px]">
          <p className="eyebrow">Dos casas, una cocina</p>
          <h2 className="mt-3 font-display text-[clamp(40px,4.6vw,62px)] leading-none font-black tracking-[-0.02em] text-forest">
            Hola, <em className="font-extrabold text-terracotta">soy Ellie.</em>
          </h2>
          <div className="mt-[26px] flex flex-col gap-4 text-[17px] leading-[1.8] text-ink-soft">
            <p>
              Crecí en una granja en Kumeu, al oeste de Auckland. Entre el
              campo, hornos calientes, manteca y harina, con las manos en la
              masa desde que tengo memoria.
            </p>
            <p>
              Hornear nunca fue un negocio para mí: era mi forma de cuidar a la
              gente que quiero. Hace poco crucé el mundo y me enamoré del mate,
              de los bizcochitos y de la vida tranquila de Acassuso.
            </p>
            <p>
              Uso manteca, fruta, nueces, dátiles y harinas integrales. No uso
              premezclas, ni nada refinado, ni atajos. Horneo yo, en casa, a
              pedido. Como aprendí de chica.
            </p>
          </div>
          <blockquote className="mt-[30px] -rotate-1 rounded-2xl bg-manteca px-6 py-5 font-display text-[22px] leading-[1.4] font-semibold text-forest italic">
            “Kiwi por de dónde vengo. Dulce por lo que hago, y por este lugar
            que también es casa.”
          </blockquote>
          <p className="mt-5 font-display text-[28px] font-extrabold text-forest italic">
            Con cariño, Ellie
          </p>
        </div>
      </div>
    </section>
  );
}
