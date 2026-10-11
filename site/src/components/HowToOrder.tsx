const STEPS = [
  {
    title: "Charlamos",
    body: "Escribime por WhatsApp, Instagram o mail. Te cuento qué estoy horneando esta semana.",
  },
  {
    title: "Prendo el horno",
    body: "Elegís lo que te tienta y lo preparo a pedido, con dos o tres días de anticipación.",
  },
  {
    title: "A compartir",
    body: "Lo retirás por Acassuso, o vemos cómo te lo acerco en Zona Norte. Vos ponés el mate.",
  },
];

export default function HowToOrder() {
  return (
    <section id="pedidos" className="bg-manteca px-6 py-20 md:py-24 md:text-center">
      <div className="mx-auto max-w-[1180px]">
        <p className="eyebrow reveal">Cómo pedir</p>
        {/* No terracotta on manteca (contrast): the highlight stays forest italic */}
        <h2 className="reveal mt-3 font-display text-[clamp(38px,4.4vw,58px)] leading-none font-black tracking-[-0.02em] text-forest">
          Todo empieza con <em className="font-extrabold">un mensaje.</em>
        </h2>

        {/* Phones: a dotted line joins the number circles down the left */}
        <ol className="relative mt-10 grid gap-7 before:absolute before:top-10 before:bottom-14 before:left-[26.5px] before:border-l-[3px] before:border-dotted before:border-forest/40 md:mt-14 md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] md:gap-12 md:before:hidden">
          {STEPS.map((s, i) => (
            <li key={s.title} className="reveal relative flex items-start gap-4 md:block">
              <span className="flex size-14 flex-none items-center justify-center rounded-full bg-forest font-display text-[26px] font-black text-manteca md:mx-auto md:size-[72px] md:text-[34px]">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-[21px] leading-tight font-extrabold text-forest md:mt-5 md:text-2xl">
                  {s.title}
                </h3>
                <p className="mt-1 max-w-[300px] text-[15px] leading-[1.6] text-ink-soft md:mx-auto md:mt-2.5 md:leading-[1.65]">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="reveal mt-10 font-display text-lg font-semibold text-forest italic md:mt-14 md:text-xl">
          Sin carrito, sin precios fijos: cada horneada es distinta. Preguntame
          sin compromiso.
        </p>
      </div>
    </section>
  );
}
