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
    <section id="pedidos" className="bg-manteca px-6 py-24 text-center">
      <div className="mx-auto max-w-[1180px]">
        <p className="eyebrow reveal">Cómo pedir</p>
        {/* No terracotta on manteca (contrast): the highlight stays forest italic */}
        <h2 className="reveal mt-3 font-display text-[clamp(38px,4.4vw,58px)] leading-none font-black tracking-[-0.02em] text-forest">
          Todo empieza con <em className="font-extrabold">un mensaje.</em>
        </h2>

        <ol className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-12">
          {STEPS.map((s, i) => (
            <li key={s.title} className="reveal">
              <span className="mx-auto flex size-[72px] items-center justify-center rounded-full bg-forest font-display text-[34px] font-black text-manteca">
                {i + 1}
              </span>
              <h3 className="mt-5 font-display text-2xl font-extrabold text-forest">
                {s.title}
              </h3>
              <p className="mx-auto mt-2.5 max-w-[300px] text-[15px] leading-[1.65] text-ink-soft">
                {s.body}
              </p>
            </li>
          ))}
        </ol>

        <p className="reveal mt-14 font-display text-xl font-semibold text-forest italic">
          Sin carrito, sin precios fijos: cada horneada es distinta. Preguntame
          sin compromiso.
        </p>
      </div>
    </section>
  );
}
