import Image from "next/image";
import { Fragment } from "react";
import { ChatIcon } from "./icons";
import { WA_HELLO } from "./data";

const LINKS = [
  { href: "#horno", label: "Esta semana" },
  { href: "#historia", label: "Mi historia" },
  { href: "#pedidos", label: "Cómo pedir" },
];

const STAR = (
  <span aria-hidden="true" className="hidden text-xs text-terracotta md:inline">
    ✺
  </span>
);

/** Shop-front masthead: the stacked wordmark centred, the menu on a ruled row below. */
export default function Header() {
  return (
    <header className="mx-auto max-w-[1280px] px-6 pt-5">
      <a href="#inicio" className="mx-auto block w-fit">
        <Image
          src="/brand/wordmark-stacked-green.png"
          alt="Dulce Kiwi"
          width={1200}
          height={874}
          className="h-20 w-auto md:h-24"
          priority
        />
      </a>

      <nav
        aria-label="Principal"
        className="mt-4 flex items-center justify-center gap-x-3 border-y-2 border-forest/15 py-3 text-[14px] font-semibold text-forest md:gap-x-7 md:text-[15px]"
      >
        {LINKS.map((l, i) => (
          <Fragment key={l.href}>
            {i > 0 && STAR}
            <a
              href={l.href}
              className="flex-1 text-center decoration-manteca decoration-[3px] underline-offset-[6px] hover:underline md:flex-none"
            >
              {l.label}
            </a>
          </Fragment>
        ))}
        {STAR}
        <a
          href={WA_HELLO}
          className="hidden min-h-11 items-center gap-2 rounded-full bg-terracotta px-5 font-bold text-sheet transition-colors hover:bg-terracotta-dark md:inline-flex"
        >
          <ChatIcon size={18} />
          Pedir
        </a>
      </nav>
    </header>
  );
}
