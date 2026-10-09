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
    <header className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-6 py-[18px]">
      <a href="#inicio" className="flex items-center">
        <Image
          src="/brand/logo-stacked.png"
          alt="Dulce Kiwi"
          width={782}
          height={989}
          className="h-[76px] w-auto"
          priority
        />
      </a>

      <nav aria-label="Principal" className="hidden items-center gap-8 text-[15px] md:flex">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="text-ink hover:text-moss">
            {l.label}
          </a>
        ))}
      </nav>

      <a
        href={WA_HELLO}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border-[1.5px] border-moss px-[18px] text-[15px] font-semibold text-moss transition-colors hover:bg-moss hover:text-cream"
      >
        <ChatIcon size={18} />
        Escribime
      </a>
    </header>
  );
}
