import { ChatIcon } from "./icons";
import { WA_HELLO } from "./data";

/** Always-in-reach WhatsApp pill, phones only. */
export default function FloatingWhatsApp() {
  return (
    <a
      href={WA_HELLO}
      className="btn-pop fixed right-4 bottom-5 z-50 inline-flex min-h-[52px] items-center gap-2 rounded-full bg-forest pr-5 pl-4 text-[15px] font-bold text-cream md:hidden"
    >
      <ChatIcon filled />
      Escribile a Ellie
    </a>
  );
}
