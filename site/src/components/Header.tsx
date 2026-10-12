import Image from "next/image";
import { ChatIcon } from "./icons";
import { WA_HELLO } from "./data";

const LINK = "decoration-manteca decoration-[3px] underline-offset-[6px] hover:underline";

/** Logo far left, the three links centred on the page, and the Pedir pill on the right. Phones: logo left, links beside it. */
export default function Header() {
  return (
    <header className="mx-auto max-w-[1280px] px-6 py-3 max-[359px]:px-5 md:py-5">
      <nav
        aria-label="Principal"
        className="flex items-center justify-between gap-3 text-[13px] font-semibold max-[359px]:gap-2 max-[359px]:text-[12px] whitespace-nowrap text-forest md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8 md:text-[15px]"
      >
        <a href="#inicio" className="flex-none md:justify-self-start">
          <Image
            src="/brand/wordmark-stacked-green.png"
            alt="Dulce Kiwi"
            width={1200}
            height={874}
            className="h-[50px] w-auto max-[359px]:h-[42px] md:h-24"
            priority
          />
        </a>

        <div className="flex gap-3 max-[359px]:gap-2 md:gap-8 md:justify-self-center">
          <a href="#horno" className={LINK}>
            Mi horno
          </a>
          <a href="#historia" className={LINK}>
            Mi historia
          </a>
          <a href="#pedidos" className={LINK}>
            Cómo pedir
          </a>
        </div>

        <a
          href={WA_HELLO}
          className="hidden min-h-11 items-center gap-2 rounded-full bg-terracotta px-5 font-bold text-sheet transition-colors hover:bg-terracotta-dark md:inline-flex md:justify-self-end"
        >
          <ChatIcon size={18} />
          Pedir
        </a>
      </nav>
    </header>
  );
}
