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
    <section id="contacto" className="bg-forest px-6 pt-24 text-cream">
      <div className="reveal mx-auto flex max-w-[1180px] flex-wrap items-start gap-x-24 gap-y-14">
        <div className="min-w-0 flex-[1_1_400px]">
          <p className="eyebrow text-butter">¿Se te antojó algo?</p>
          <h2 className="mt-3 font-display text-[clamp(40px,4.6vw,62px)] leading-none font-black tracking-[-0.02em] text-sheet">
            Escribime, te leo con el{" "}
            <em className="font-extrabold text-butter">mate en la mano.</em>
          </h2>
          <p className="mt-6 max-w-[420px] text-[17px] leading-[1.7] text-cream/80">
            Contame qué tenés ganas de comer y para cuándo. Te contesto yo, casi
            siempre en el día.
          </p>
          <a
            href={WA_HELLO}
            className="btn-pop mt-8 inline-flex min-h-14 items-center gap-2.5 rounded-full bg-sheet px-7 font-bold text-forest"
          >
            <ChatIcon filled />
            Escribime por WhatsApp
          </a>
        </div>

        <ul className="min-w-0 flex-[1_1_400px] border-t border-cream/20">
          {ROWS.map((r) => (
            <li key={r.label} className="border-b border-cream/20">
              <a
                href={r.href}
                className="flex min-h-[76px] items-center justify-between gap-4 text-sheet hover:text-butter"
              >
                <span className="text-xs font-bold tracking-[0.18em] text-cream/65 uppercase">
                  {r.label}
                </span>
                <span className="font-display text-xl">{r.value} ↗</span>
              </a>
            </li>
          ))}
          <li className="pt-[22px] text-sm text-cream/70">
            Acassuso · San Isidro · Zona Norte, Buenos Aires
          </li>
        </ul>
      </div>

      {/* Extra bottom padding on phones so the floating WhatsApp pill doesn't cover the footer */}
      <footer className="mx-auto mt-20 flex max-w-[1180px] flex-wrap items-end justify-between gap-6 border-t border-cream/20 pt-8 pb-24 md:pb-10">
        <Image
          src="/brand/logo-stacked-cream.png"
          alt="Dulce Kiwi"
          width={782}
          height={989}
          className="h-[120px] w-auto md:h-[150px]"
        />
        <div className="flex flex-col items-start gap-1.5 md:items-end">
          <span className="font-display text-xl text-butter italic">
            Un poquito de allá, un poquito de acá.
          </span>
          <span className="text-[13px] text-cream/60">
            © 2026 Dulce Kiwi · Repostería casera en Acassuso
          </span>
        </div>
      </footer>
    </section>
  );
}
