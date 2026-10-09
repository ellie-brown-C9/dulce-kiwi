import Image from "next/image";
import { ChatIcon } from "./icons";
import { WA_HELLO } from "./data";

const LINKS = [
  { href: "#horno", label: "Esta semana" },
  { href: "#historia", label: "Mi historia" },
  { href: "#pedidos", label: "Cómo pedir" },
];

export default function Header() {
  return (
    <header className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-6 py-5">
      <a href="#inicio" className="flex items-center">
        <Image
          src="/brand/wordmark-horizontal-green.png"
          alt="Dulce Kiwi"
          width={1600}
          height={441}
          className="h-9 w-auto md:h-11"
          priority
        />
      </a>

      <nav
        aria-label="Principal"
        className="hidden items-center gap-8 text-[15px] font-semibold text-forest md:flex"
      >
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="decoration-butter decoration-[3px] underline-offset-[6px] hover:underline"
          >
            {l.label}
          </a>
        ))}
      </nav>

      <a
        href={WA_HELLO}
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-terracotta px-5 text-[15px] font-bold text-sheet transition-colors hover:bg-terracotta-dark"
      >
        <ChatIcon size={18} />
        Pedir
      </a>
    </header>
  );
}
