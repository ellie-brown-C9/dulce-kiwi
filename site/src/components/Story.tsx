import Image from "next/image";

type PrintProps = {
  src: string;
  alt: string;
  caption: string;
  className: string;
  small?: boolean;
};

/** A little photo print with a white border and italic caption. */
function Print({ src, alt, caption, className, small = false }: PrintProps) {
  return (
    <figure
      className={`m-0 bg-white ${
        small
          ? "p-2 pb-[34px] shadow-[0_18px_30px_-16px_rgba(40,26,12,0.55)]"
          : "p-3 pb-11 shadow-[0_24px_40px_-22px_rgba(40,26,12,0.55)]"
      } ${className}`}
    >
      <div className="relative aspect-[4/5]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={small ? "200px" : "(min-width: 900px) 480px, 90vw"}
          className="object-cover"
        />
      </div>
      <figcaption
        className={`absolute inset-x-0 text-center font-display font-semibold text-ink-soft italic ${
          small ? "bottom-1.5 text-[15px]" : "bottom-2.5 text-[19px]"
        }`}
      >
        {caption}
      </figcaption>
    </figure>
  );
}

export default function Story() {
  return (
    <section id="historia" className="bg-sheet px-6 py-24">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-24 gap-y-16">
        <div className="reveal relative min-w-0 flex-[1_1_380px] pr-[10%] pb-[90px]">
          <Print
            src="/home/ellie.webp"
            alt="Ellie sonriendo en su cocina, con un café sobre la mesa"
            caption="yo, hoy · Acassuso"
            className="relative -rotate-[2.5deg]"
          />
          <Print
            small
            src="/home/ellie-farm.webp"
            alt="Ellie de chiquita, con una galletita en la mano, en la granja de Kumeu"
            caption="3 años, Kumeu"
            className="absolute right-0 bottom-0 w-[38%] rotate-6"
          />
          <Print
            small
            src="/home/ellie-baking.webp"
            alt="Ellie a los ocho años con delantal, preparando muffins en la cocina de su casa"
            caption="8 años, mis primeros muffins"
            className="absolute bottom-3.5 -left-[2%] w-[33%] -rotate-[7deg]"
          />
        </div>

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
          <blockquote className="mt-[30px] -rotate-1 rounded-2xl bg-butter px-6 py-5 font-display text-[22px] leading-[1.4] font-semibold text-forest italic">
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
