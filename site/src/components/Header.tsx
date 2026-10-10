import Image from "next/image";
import { ChatIcon } from "./icons";
import { WA_HELLO } from "./data";

// On phones each link is a cell of a ruled row under the logo; on desktop they sit beside it
const LINK =
  "mt-4 border-y-2 border-forest/15 py-3 text-center decoration-manteca decoration-[3px] underline-offset-[6px] hover:underline md:mt-0 md:border-0 md:p-0";

/** Split menu: stacked wordmark in the middle, two links on the left, "Cómo pedir" + Pedir on the right. */
export default function Header() {
  return (
    <header className="mx-auto max-w-[1280px] px-6 pt-5 md:py-5">
      <nav
        aria-label="Principal"
        className="grid grid-cols-3 items-center text-[14px] font-semibold text-forest md:grid-cols-[1fr_auto_1fr] md:gap-x-10 md:text-[15px]"
      >
        <a
          href="#inicio"
          className="col-span-3 justify-self-center md:col-span-1 md:col-start-2 md:row-start-1"
        >
          <Image
            src="/brand/wordmark-stacked-green.png"
            alt="Dulce Kiwi"
            width={1200}
            height={874}
            className="h-20 w-auto md:h-24"
            priority
          />
        </a>

        <div className="contents md:col-start-1 md:row-start-1 md:flex md:gap-8">
          <a href="#horno" className={LINK}>
            Esta semana
          </a>
          <a href="#historia" className={LINK}>
            Mi historia
          </a>
        </div>

        <div className="contents md:col-start-3 md:row-start-1 md:flex md:items-center md:justify-self-end md:gap-8">
          <a href="#pedidos" className={LINK}>
            Cómo pedir
          </a>
          <a
            href={WA_HELLO}
            className="hidden min-h-11 items-center gap-2 rounded-full bg-terracotta px-5 font-bold text-sheet transition-colors hover:bg-terracotta-dark md:inline-flex"
          >
            <ChatIcon size={18} />
            Pedir
          </a>
        </div>
      </nav>
    </header>
  );
}
