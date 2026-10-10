import Image from "next/image";
import { ChatIcon, InstagramIcon, MailIcon } from "./icons";
import { CONTACT, WA_HELLO } from "./data";
import Wave from "./Wave";

// Each contact is a solid sticker in its own colour, only as long as its words
const STICKERS = [
  {
    say: "escribime por WhatsApp",
    value: CONTACT.whatsappLabel,
    href: WA_HELLO,
    icon: <ChatIcon filled size={24} />,
    sticker: "bg-manteca text-forest",
    ico: "bg-forest text-manteca",
    tilt: "-rotate-3",
    offset: "",
  },
  {
    say: "seguime en Instagram",
    value: `@${CONTACT.instagram}`,
    href: `https://instagram.com/${CONTACT.instagram}`,
    icon: <InstagramIcon size={24} />,
    sticker: "bg-terracotta text-sheet",
    ico: "bg-sheet text-terracotta",
    tilt: "rotate-2",
    offset: "sm:ml-[60px]",
  },
  {
    say: "o mandame un mail",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    icon: <MailIcon size={24} />,
    sticker: "bg-sheet text-forest",
    ico: "bg-manteca text-forest",
    tilt: "-rotate-[1.5deg]",
    offset: "sm:ml-5",
  },
];

export default function Contact() {
  return (
    <>
      {/* Wavy edge rising out of the manteca Cómo pedir band */}
      <div className="bg-manteca text-forest">
        <Wave className="-mb-px" />
      </div>

      <section id="contacto" className="bg-forest px-6 pt-16 text-cream md:pt-20">
        <div className="reveal mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-24 gap-y-14">
          <div className="min-w-0 flex-[1_1_400px]">
            <p className="eyebrow text-manteca">¿Se te antojó algo?</p>
            <h2 className="mt-3 font-display text-[clamp(40px,4.6vw,62px)] leading-none font-black tracking-[-0.02em] text-sheet">
              Escribime, te leo con el{" "}
              <em className="relative font-extrabold whitespace-nowrap text-manteca">
                mate en la mano.
                <svg
                  aria-hidden="true"
                  viewBox="0 0 300 16"
                  preserveAspectRatio="none"
                  className="absolute inset-x-0 -bottom-3.5 h-4 w-full"
                >
                  <path
                    d="M3 10 Q 25 2 50 9 T 100 9 T 150 9 T 200 9 T 250 9 T 297 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </em>
            </h2>
            <p className="mt-8 max-w-[420px] text-[17px] leading-[1.7] text-cream/80">
              Contame qué tenés ganas de comer y para cuándo. Te contesto yo, casi
              siempre en el día.
            </p>
          </div>

          <ul className="flex min-w-0 flex-[1_1_400px] flex-col items-start gap-[18px]">
            {STICKERS.map((l) => (
              <li key={l.href} className={`max-w-full ${l.offset}`}>
                <a
                  href={l.href}
                  className={`group inline-flex max-w-full items-center gap-3.5 rounded-full py-3.5 pr-6 pl-4 shadow-[5px_5px_0_rgba(0,0,0,0.15)] transition-transform duration-300 ease-[cubic-bezier(0.3,1.5,0.5,1)] hover:rotate-0 hover:scale-105 ${l.sticker} ${l.tilt}`}
                >
                  <span className={`flex size-[46px] flex-none items-center justify-center rounded-full ${l.ico}`}>
                    {l.icon}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="font-display text-sm italic opacity-80">{l.say}</span>
                    <span className="font-display text-lg font-extrabold break-words sm:text-[23px]">
                      {l.value}
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-lg transition-transform duration-300 group-hover:rotate-45">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Extra bottom padding on phones so the floating WhatsApp pill doesn't cover the footer */}
        <footer className="mx-auto mt-20 flex max-w-[1180px] flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-cream/20 pt-6 pb-24 md:pb-8">
          <div className="flex items-center gap-4">
            <Image
              src="/brand/badge-kiwi.png"
              alt="Dulce Kiwi"
              width={1200}
              height={1200}
              className="size-[72px] -rotate-[8deg] rounded-full ring-3 ring-manteca"
            />
            <span className="font-display text-lg text-manteca italic">
              Un poquito de allá, un poquito de acá.
            </span>
          </div>
          <span className="text-[13px] text-cream/60">
            Acassuso · San Isidro · Zona Norte · © 2026 Dulce Kiwi
          </span>
        </footer>
      </section>
    </>
  );
}
