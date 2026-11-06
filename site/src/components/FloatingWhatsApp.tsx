"use client";

import { useEffect, useState } from "react";
import { ChatIcon } from "./icons";
import { WA_HELLO } from "./data";

/**
 * Always-in-reach WhatsApp pill, phones only. It shows from the first screen (over the photo),
 * steps aside from the contact section down, where the stickers are, and while the /menu
 * order bar is up (MenuClient sends "dk:order" with the order count). It sits below the
 * order bar (z-30 vs z-40), so it can never cover it.
 */
export default function FloatingWhatsApp() {
  const [atContact, setAtContact] = useState(false);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    const contact = document.getElementById("contacto");
    const io = new IntersectionObserver(([e]) => setAtContact(e.isIntersecting));
    if (contact) io.observe(contact);

    const onOrder = (e: Event) => setOrdering(((e as CustomEvent<{ count: number }>).detail?.count ?? 0) > 0);
    window.addEventListener("dk:order", onOrder);
    return () => {
      io.disconnect();
      window.removeEventListener("dk:order", onOrder);
    };
  }, []);

  const hidden = atContact || ordering;

  return (
    <a
      href={WA_HELLO}
      data-floating-wa=""
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : undefined}
      className={`btn-pop fixed right-4 bottom-5 z-30 inline-flex min-h-[52px] items-center gap-2 rounded-full bg-forest pr-5 pl-4 text-[15px] font-bold text-cream transition-[opacity,transform,translate] duration-300 md:hidden ${
        hidden ? "pointer-events-none translate-y-6 opacity-0" : ""
      }`}
    >
      <ChatIcon filled />
      Escribime
    </a>
  );
}
