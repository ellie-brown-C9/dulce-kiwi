import Image from "next/image";

// Then and now, in age order
const MOMENTS = [
  {
    src: "/home/ellie-farm.webp",
    alt: "Ellie de chiquita, con una galletita en la mano, en la granja de Kumeu",
    age: "3 años",
    caption: "Kumeu, NZ",
    arch: false,
  },
  {
    src: "/home/ellie-baking.webp",
    alt: "Ellie a los ocho años con delantal, preparando muffins en la cocina de su casa",
    age: "8 años",
    caption: "mis primeros muffins",
    arch: false,
  },
  {
    src: "/home/ellie.webp",
    alt: "Ellie sonriendo en su cocina, con un café sobre la mesa",
    age: "hoy",
    caption: "Acassuso",
    arch: true,
  },
];

const COLS = "grid grid-cols-[1fr_1fr_1.4fr] gap-3 sm:gap-5";

/** Three photos left to right (3 → 8 → today), joined by a dotted wavy line. */
function Timeline() {
  return (
    <div className="reveal min-w-0 flex-[1_1_380px]">
      <div className={`${COLS} items-end`}>
        {MOMENTS.map((m) => (
          <div
            key={m.age}
            className={`relative overflow-hidden shadow-[0_14px_28px_-16px_rgba(40,26,12,0.55)] ${
              m.arch ? "shape-arch aspect-[4/5.4]" : "aspect-square rounded-full"
            }`}
          >
            <Image
              src={m.src}
              alt={m.alt}
              fill
              sizes={m.arch ? "(min-width: 900px) 240px, 38vw" : "(min-width: 900px) 170px, 27vw"}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className={`${COLS} relative mt-4 text-center`}>
        <svg
          aria-hidden="true"
          viewBox="0 0 400 12"
          preserveAspectRatio="none"
          className="absolute top-2 left-[12%] h-3 w-[76%] text-forest/45"
        >
          <path
            d="M0 6 Q25 0 50 6 T100 6 T150 6 T200 6 T250 6 T300 6 T350 6 T400 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeDasharray="6 7"
          />
        </svg>
        {MOMENTS.map((m) => (
          <div key={m.age} className="relative min-w-0">
            <span className="inline-block rounded-full bg-forest px-3 py-0.5 font-display text-sm font-black text-manteca sm:text-base">
              {m.age}
            </span>
            <span className="mt-1.5 block font-display text-xs leading-tight font-semibold text-ink-soft italic sm:text-sm">
              {m.caption}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Story() {
  return (
    <section id="historia" className="bg-sheet px-6 py-24">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-24 gap-y-16">
        <Timeline />

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
