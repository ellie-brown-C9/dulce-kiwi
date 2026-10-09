import Image from "next/image";
import { ChatIcon } from "./icons";
import { CONTACT, WA_HELLO } from "./data";

const ROWS = [
  { label: "WhatsApp", value: CONTACT.whatsappLabel, href: WA_HELLO },
  {
    label: "Instagram",
    value: `@${CONTACT.instagram}`,
    href: `https://instagram.com/${CONTACT.instagram}`,
  },
  { label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
];

export default function Contact() {
  return (
    <section id="contacto" className="bg-walnut px-6 pt-24 text-paper">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-start gap-x-24 gap-y-14">
        <div className="min-w-0 flex-[1_1_400px]">
          <p className="font-hand text-[22px] text-butter">¿se te antojó algo?</p>
          <h2 className="mt-2.5 font-serif text-[clamp(38px,4.4vw,60px)] leading-[1.08] font-normal tracking-[-0.03em] text-cream">
            Escribime, te leo con el <em className="text-butter">mate en la mano.</em>
          </h2>
          <p className="mt-[22px] max-w-[420px] text-[17px] leading-[1.7] text-paper/80">
            Contame qué tenés ganas de comer y para cuándo. Te contesto yo, casi
            siempre en el día.
          </p>
          <a
            href={WA_HELLO}
            className="mt-8 inline-flex min-h-14 items-center gap-2.5 rounded-full bg-cream px-7 font-semibold text-ink-deep hover:bg-butter"
          >
            <ChatIcon filled />
            Escribime por WhatsApp
          </a>
        </div>

        <ul className="min-w-0 flex-[1_1_400px] border-t border-paper/20">
          {ROWS.map((r) => (
            <li key={r.label} className="border-b border-paper/20">
              <a
                href={r.href}
                className="flex min-h-[76px] items-center justify-between gap-4 text-cream hover:text-butter"
              >
                <span className="text-xs font-semibold tracking-[0.2em] text-paper/65 uppercase">
                  {r.label}
                </span>
                <span className="font-serif text-xl">{r.value} ↗</span>
              </a>
            </li>
          ))}
          <li className="pt-[22px] text-sm text-paper/70">
            Acassuso · San Isidro · Zona Norte, Buenos Aires
          </li>
        </ul>
      </div>

      <div className="mt-[88px] flex justify-center">
        <Image
          src="/brand/logo-stacked-cream.png"
          alt="Dulce Kiwi"
          width={782}
          height={989}
          className="h-[180px] w-auto md:h-[220px]"
        />
      </div>

      <footer className="mx-auto mt-14 flex max-w-[1180px] flex-wrap items-center justify-between gap-3 border-t border-paper/15 pt-[26px] pb-[30px]">
        <span className="font-serif text-[17px] text-paper/85 italic">
          Un poquito de allá, un poquito de acá.
        </span>
        <span className="text-[13px] text-paper/60">
          © 2026 Dulce Kiwi · Repostería casera en Acassuso
        </span>
      </footer>
    </section>
  );
}
