import Image from "next/image";
import Link from "next/link";
import { ChatIcon } from "./icons";
import { WA_HELLO } from "./data";

type Props = {
  /** "photo": cream outlined letters laid over the homepage photo. "plain": forest letters for cream pages (/menu). */
  variant?: "photo" | "plain";
};

/**
 * Logo far left, the three links centred and the Pedir pill on the right (desktop).
 * Phones: the logo centred on top and the links on one row underneath, no Pedir.
 * It scrolls away with the page (never pinned). Links point at "/…" so they work from every page.
 */
export default function Header({ variant = "photo" }: Props) {
  const photo = variant === "photo";
  const link = photo
    ? "nav-pop text-outline [--outline:4.5px] md:[--outline:6px]"
    : "nav-pop text-forest";

  return (
    <header className={photo ? "absolute inset-x-0 top-0 z-20" : "relative"}>
      <nav
        aria-label="Principal"
        className="mx-auto flex max-w-[1440px] flex-col items-center gap-1 px-3 pt-3.5 whitespace-nowrap md:grid md:grid-cols-[1fr_auto_1fr] md:gap-5 md:px-[26px] md:py-4"
      >
        <Link href="/" className="flex-none transition-transform duration-300 hover:scale-[1.06] md:justify-self-start">
          <Image
            src={photo ? "/brand/wordmark-stacked-cream.png" : "/brand/wordmark-stacked-green.png"}
            alt="Dulce Kiwi"
            width={1200}
            height={874}
            className={`h-[60px] w-auto md:h-[78px] ${photo ? "logo-outline" : "logo-drop"}`}
            loading="eager"
          />
        </Link>

        <div className="flex gap-4 font-display text-[16px] font-black max-[359px]:gap-3 max-[359px]:text-[15px] md:gap-7 md:justify-self-center md:text-[22px] lg:text-[23px]">
          <Link href="/menu" className={link}>
            Menú
          </Link>
          <Link href="/#historia" className={link}>
            Mi historia
          </Link>
          <Link href="/#pedidos" className={link}>
            Cómo pedir
          </Link>
        </div>

        <a
          href={WA_HELLO}
          className="hidden min-h-11 items-center gap-2 rounded-full border-[3px] border-forest bg-terracotta px-5 text-[15px] font-bold text-sheet shadow-[3px_3px_0_var(--color-forest)] transition-transform duration-300 hover:scale-[1.08] md:inline-flex md:justify-self-end"
        >
          <ChatIcon size={18} />
          Pedir
        </a>
      </nav>
    </header>
  );
}
