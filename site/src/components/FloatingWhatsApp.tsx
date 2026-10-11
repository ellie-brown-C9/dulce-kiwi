"use client";

import { useEffect, useState } from "react";
import { ChatIcon } from "./icons";
import { WA_HELLO } from "./data";

/**
 * Always-in-reach WhatsApp pill, phones only. It steps aside while the hero's own
 * button is on screen and from the contact section down, where the stickers are.
 */
export default function FloatingWhatsApp() {
  // Hidden at first: the page opens with the hero button in view
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const targets = [document.querySelector("[data-hero-cta]"), document.getElementById("contacto")].filter(
      (el): el is Element => el !== null,
    );
    const onScreen = new Map<Element, boolean>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) onScreen.set(e.target, e.isIntersecting);
      setHidden([...onScreen.values()].some(Boolean));
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <a
      href={WA_HELLO}
      data-floating-wa=""
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : undefined}
      className={`btn-pop fixed right-4 bottom-5 z-50 inline-flex min-h-[52px] items-center gap-2 rounded-full bg-forest pr-5 pl-4 text-[15px] font-bold text-cream transition-[opacity,transform,translate] duration-300 md:hidden ${
        hidden ? "pointer-events-none translate-y-6 opacity-0" : ""
      }`}
    >
      <ChatIcon filled />
      Escribime
    </a>
  );
}
