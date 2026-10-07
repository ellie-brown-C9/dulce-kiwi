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
    <section id="pedidos" className="mx-auto max-w-[1180px] px-6 py-24 text-center">
      <p className="text-xs font-semibold tracking-[0.22em] text-moss uppercase">
        Cómo pedir
      </p>
      <h2 className="mt-3.5 font-serif text-[clamp(34px,3.8vw,50px)] leading-[1.12] font-normal tracking-[-0.03em] text-ink-deep">
        Todo empieza con <em className="text-moss">un mensaje.</em>
      </h2>

      <ol className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-10 text-left">
        {STEPS.map((s, i) => (
          <li key={s.title} className="border-t border-rule-deep pt-[22px]">
            <span className="font-serif text-[28px] text-nutmeg italic">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-2 font-serif text-2xl font-medium text-ink-deep">
              {s.title}
            </h3>
            <p className="mt-2.5 text-[15px] leading-[1.65] text-ink-soft">{s.body}</p>
          </li>
        ))}
      </ol>

      <p className="mt-[52px] font-hand text-[22px] text-honey">
        Sin carrito, sin precios fijos: cada horneada es distinta. Preguntame
        sin compromiso.
      </p>
    </section>
  );
}
