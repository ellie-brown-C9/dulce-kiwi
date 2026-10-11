"use client";

import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore, type CSSProperties, type Ref } from "react";
import { Doodle, type DoodleName } from "./Doodles";
import { PIN_SCREENS, drumAllowed, reelPosition, slideLook } from "./reel";

type Moment = {
  src: string;
  alt: string;
  age: string;
  caption: string;
  tilt: number; // resting tilt in degrees
  doodles: [DoodleName, DoodleName];
  text: string;
};

// Then and now, in age order; each photo carries its own paragraph
const MOMENTS: Moment[] = [
  {
    src: "/home/ellie-farm.webp",
    alt: "Ellie de chiquita, con una galletita en la mano, en la granja de Kumeu",
    age: "3 años",
    caption: "Kumeu, NZ",
    tilt: -4,
    doodles: ["sun", "sheep"],
    text: "Crecí en una granja en Kumeu, al oeste de Auckland. Entre el campo, hornos calientes, manteca y harina, con las manos en la masa desde que tengo memoria.",
  },
  {
    src: "/home/ellie-baking.webp",
    alt: "Ellie a los ocho años con delantal, preparando muffins en la cocina de su casa",
    age: "8 años",
    caption: "mis primeros muffins",
    tilt: 3.5,
    doodles: ["whisk", "muffin"],
    text: "Hornear nunca fue un negocio para mí: era mi forma de cuidar a la gente que quiero. Hace poco crucé el mundo y me enamoré del mate, de los bizcochitos y de la vida tranquila de Acassuso.",
  },
  {
    src: "/home/ellie.webp",
    alt: "Ellie sonriendo en su cocina, con un café sobre la mesa",
    age: "hoy",
    caption: "Acassuso",
    tilt: -2.5,
    doodles: ["mate", "heart"],
    text: "Uso manteca, fruta, nueces, dátiles y harinas integrales. No uso premezclas, ni nada refinado, ni atajos. Horneo yo, en casa, a pedido. Como aprendí de chica.",
  },
];

// Where the two doodles sit around each photo
const DOODLE_SPOTS: CSSProperties[] = [
  { right: "-16%", top: "-4%", ["--r" as string]: "-10deg" },
  { right: "-22%", bottom: "6%", ["--r" as string]: "8deg" },
];

const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", onChange);
  window.addEventListener("resize", onChange);
  return () => {
    mq.removeEventListener("change", onChange);
    window.removeEventListener("resize", onChange);
  };
};
const drumNow = () =>
  drumAllowed({ reducedMotion: window.matchMedia(REDUCE).matches, viewportHeight: window.innerHeight });

function Heading() {
  return (
    <>
      <p className="eyebrow">Dos casas, una cocina</p>
      <h2 className="mt-2 font-display text-[36px] leading-none font-black tracking-[-0.02em] text-forest md:mt-3 md:text-[clamp(40px,4.6vw,62px)]">
        Hola, <em className="font-extrabold text-terracotta">soy Ellie.</em>
      </h2>
    </>
  );
}

function SignOff({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <blockquote className="-rotate-1 rounded-2xl bg-manteca px-6 py-5 font-display text-lg leading-[1.4] font-semibold text-forest italic md:text-[22px]">
        “Kiwi por de dónde vengo. Dulce por lo que hago, y por este lugar que también es casa.”
      </blockquote>
      <p className="mt-5 font-display text-[28px] font-extrabold text-forest italic">Con cariño, Ellie</p>
    </div>
  );
}

function Photo({ m, ref }: { m: Moment; ref?: Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className="relative aspect-square w-[min(210px,34svh)] flex-none md:w-[min(340px,56svh)]"
      style={{ transform: `rotate(${m.tilt}deg)` }}
    >
      <div className="shape-blob relative h-full w-full overflow-hidden border-[7px] border-white shadow-[0_10px_30px_rgba(52,80,63,0.16)] md:border-8">
        <Image src={m.src} alt={m.alt} fill sizes="(min-width: 768px) 340px, 210px" className="object-cover" />
      </div>
      <span className="absolute bottom-[6%] -left-1.5 z-10 -rotate-[7deg] rounded-full bg-manteca px-3 py-1.5 font-display text-[13px] font-bold whitespace-nowrap text-forest italic shadow-[0_3px_0_rgba(0,0,0,0.1)] md:text-[15px]">
        <b className="font-black not-italic">{m.age}</b> · {m.caption}
      </span>
      {m.doodles.map((d, i) => (
        <Doodle key={d} name={d} className="absolute z-10 size-[54px] text-forest md:size-[74px]" style={DOODLE_SPOTS[i]} />
      ))}
    </div>
  );
}

/** Plain stacked layout: no JS yet, reduced motion, or a screen too short for the drum. */
function StaticStory() {
  return (
    <section id="historia" className="bg-cream px-6 py-20 md:py-24">
      <div className="mx-auto max-w-[1180px]">
        <Heading />
        <ol className="mt-12 grid gap-14">
          {MOMENTS.map((m) => (
            <li key={m.age} className="flex flex-col items-center gap-6 md:flex-row md:gap-14">
              <Photo m={m} />
              <p className="max-w-[480px] text-[15px] leading-[1.6] text-ink-soft md:text-[17px] md:leading-[1.8]">{m.text}</p>
            </li>
          ))}
        </ol>
        <SignOff className="mx-auto mt-12 max-w-[480px] md:mr-0" />
      </div>
    </section>
  );
}

/**
 * About Me as a vertical drum: the section pins while each photo rolls up with its
 * paragraph, rests, and rolls on. Falls back to StaticStory when the drum can't run.
 */
export default function Story() {
  const drum = useSyncExternalStore(subscribe, drumNow, () => false);
  const section = useRef<HTMLElement>(null);
  const reel = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLDivElement | null)[]>([]);
  const photos = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!drum) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = section.current;
      if (!el || !reel.current) return;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const pos = reelPosition(travel > 0 ? -rect.top / travel : 0, MOMENTS.length);
      reel.current.style.transform = `translateY(${-pos * 100}%)`;
      MOMENTS.forEach((m, i) => {
        const look = slideLook(i, pos, m.tilt);
        const s = slides.current[i];
        const p = photos.current[i];
        if (s) {
          s.style.transform = `scale(${look.scale})`;
          s.style.opacity = String(look.opacity);
          s.style.transformOrigin = look.origin;
          s.toggleAttribute("data-current", look.current);
        }
        if (p) p.style.transform = `rotate(${look.tilt}deg)`;
      });
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [drum]);

  if (!drum) return <StaticStory />;

  return (
    <>
      <section
        id="historia"
        ref={section}
        data-drum=""
        className="relative bg-cream"
        style={{ height: `${(1 + PIN_SCREENS) * 100}svh` }}
      >
        <div className="sticky top-0 flex h-svh flex-col overflow-hidden px-6 pt-[clamp(24px,5svh,64px)] pb-4">
          <div className="mx-auto w-full max-w-[1180px]">
            <Heading />
          </div>
          <div className="drum-window relative mx-auto mt-2 w-full max-w-[1180px] flex-1 overflow-hidden">
            {/* Each slide is 80% of the window, so the neighbours peek in above and below */}
            <div ref={reel} className="absolute inset-x-0 top-[10%] h-[80%] will-change-transform">
              {MOMENTS.map((m, i) => (
                <div
                  key={m.age}
                  ref={(el) => {
                    slides.current[i] = el;
                  }}
                  className="drum-slide flex h-full flex-col items-center justify-center gap-4 md:flex-row md:justify-start md:gap-14"
                >
                  <Photo
                    m={m}
                    ref={(el) => {
                      photos.current[i] = el;
                    }}
                  />
                  <div className="max-w-[480px]">
                    <p className="text-[15px] leading-[1.6] text-ink-soft md:text-[17px] md:leading-[1.8]">{m.text}</p>
                    {i === MOMENTS.length - 1 && <SignOff className="mt-5 hidden md:block" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Phones: the quote and sign-off follow the drum instead of squeezing into the last slide */}
      <div className="bg-cream px-6 pb-20 md:hidden">
        <SignOff />
      </div>
    </>
  );
}
