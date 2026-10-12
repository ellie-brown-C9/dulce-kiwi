"use client";

import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore, type CSSProperties, type Ref } from "react";
import { Doodle, type DoodleName } from "./Doodles";
import { PIN_SCREENS, drumAllowed, reelPosition, routeLook, slideLook, viewportChanged } from "./reel";

type Moment = {
  src: string;
  alt: string;
  age: string; // big route label
  place: string; // small route label
  note: string; // sticker on the photo
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
    place: "la granja, Kumeu",
    note: "control de calidad",
    tilt: -4,
    doodles: ["sun", "sheep"],
    text: "Crecí en una granja en Kumeu, al oeste de Auckland. Todavía no horneaba, pero como ves, ya tenía clarísimas mis prioridades.",
  },
  {
    src: "/home/ellie-baking.webp",
    alt: "Ellie a los ocho años con delantal, preparando muffins en la cocina de su casa",
    age: "8 años",
    place: "la puerta de casa",
    note: "con delantal y todo",
    tilt: 3.5,
    doodles: ["whisk", "muffin"],
    text: "A los ocho ya armaba puestitos en la puerta de casa, vendiéndole muffins y otras cosas que horneaba a la gente que pasaba. Y lo que hacía lo llevaba a la escuela para compartir con mis compañeros.",
  },
  {
    src: "/home/ellie.webp",
    alt: "Ellie sonriendo en su cocina, con un café sobre la mesa",
    age: "hoy",
    place: "Acassuso, Argentina",
    note: "lista para tu pedido",
    tilt: -2.5,
    doodles: ["mate", "heart"],
    text: "De grande trabajé en restaurantes, pero siempre quise volver a la repostería. Terminé siendo pastelera y barista en varios cafés de Nueva Zelanda, donde descubrí cuánto disfruto experimentar: probar, cambiar, volver a probar. Después crucé el mundo hasta Acassuso, y extrañaba compartir lo que horneo. Así nació Dulce Kiwi.",
  },
];

// Where the two doodles sit around each photo
const DOODLE_SPOTS: CSSProperties[] = [
  { right: "-16%", top: "-4%", ["--r" as string]: "-10deg" },
  { right: "-22%", bottom: "6%", ["--r" as string]: "8deg" },
];

// Off until the hand-drawn set arrives; the spots and pop-in animation are kept for it
const SHOW_DOODLES = false;

const REDUCE = "(prefers-reduced-motion: reduce)";
// Decided once and kept until the width changes, so the address bar sliding away mid-scroll can't flip it
let drumDecision: boolean | null = null;
let decidedAt = { w: 0, h: 0 };
const decide = () => {
  decidedAt = { w: window.innerWidth, h: window.innerHeight };
  drumDecision = drumAllowed({ reducedMotion: window.matchMedia(REDUCE).matches, viewportHeight: window.innerHeight });
};
const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(REDUCE);
  const onMotion = () => {
    decide();
    onChange();
  };
  const onResize = () => {
    if (!viewportChanged(decidedAt, { w: window.innerWidth, h: window.innerHeight })) return;
    decide();
    onChange();
  };
  mq.addEventListener("change", onMotion);
  window.addEventListener("resize", onResize);
  return () => {
    mq.removeEventListener("change", onMotion);
    window.removeEventListener("resize", onResize);
  };
};
const drumNow = () => {
  if (drumDecision === null) decide();
  return drumDecision as boolean;
};

function Heading() {
  return (
    <>
      <p className="eyebrow">De Auckland a Acassuso</p>
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
        “Kiwi de nacimiento, argentina por elección. Y repostera desde siempre.”
      </blockquote>
      <p className="mt-5 font-display text-[28px] font-extrabold text-forest italic">Con cariño, Ellie</p>
    </div>
  );
}

function Photo({ m, ref }: { m: Moment; ref?: Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className="relative aspect-square w-[min(210px,25svh)] flex-none md:w-[min(340px,56svh)]"
      style={{ transform: `rotate(${m.tilt}deg)` }}
    >
      <div className="shape-blob relative h-full w-full overflow-hidden border-[7px] border-white shadow-[0_10px_30px_rgba(52,80,63,0.16)] md:border-8">
        <Image src={m.src} alt={m.alt} fill sizes="(min-width: 768px) 340px, 210px" className="object-cover" />
      </div>
      <span className="absolute bottom-[6%] -left-1.5 z-10 -rotate-[7deg] rounded-full bg-manteca px-3 py-1.5 font-display text-[13px] font-bold whitespace-nowrap text-forest italic shadow-[0_3px_0_rgba(0,0,0,0.1)] md:text-[15px]">
        {m.note}
      </span>
      {SHOW_DOODLES &&
        m.doodles.map((d, i) => (
          <Doodle key={d} name={d} className="absolute z-10 size-[54px] text-forest md:size-[74px]" style={DOODLE_SPOTS[i]} />
        ))}
    </div>
  );
}

/** Where each photo was taken: tall beside the drum on wide screens, a short row under the heading below that.
 *  The drum lights the current stop (data-current) and fills the line (--fill) as you scroll. */
function Route({ vertical }: { vertical?: boolean }) {
  if (vertical) {
    return (
      <div className="hidden w-[250px] flex-none items-center pl-10 lg:flex">
        <ol className="route relative grid gap-12" aria-label="Mi recorrido">
          <span aria-hidden className="absolute inset-y-6 left-[7px] border-l-2 border-dotted border-forest/35" />
          <span aria-hidden className="route-fill absolute inset-y-6 left-[7px] w-0.5 origin-top bg-terracotta" />
          {MOMENTS.map((m) => (
            <li key={m.age} data-route-stop className="route-stop relative flex items-center gap-4">
              <span className="route-dot size-4 flex-none rounded-full border-2" />
              <span className="text-forest">
                <b className="block font-display text-[26px] leading-tight font-black">{m.age}</b>
                <span className="font-display text-[15px] font-semibold italic">{m.place}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    );
  }
  return (
    <ol className="route relative mx-auto mt-4 grid w-full max-w-[420px] grid-cols-3 lg:hidden" aria-label="Mi recorrido">
      <span aria-hidden className="absolute inset-x-[16.67%] top-[7px] border-t-2 border-dotted border-forest/35" />
      <span aria-hidden className="route-fill route-fill-x absolute inset-x-[16.67%] top-[7px] h-0.5 origin-left bg-terracotta" />
      {MOMENTS.map((m) => (
        <li key={m.age} data-route-stop className="route-stop relative flex flex-col items-center gap-1.5 text-center">
          <span className="route-dot size-4 rounded-full border-2" />
          <b className="font-display text-[15px] leading-tight font-black text-forest">{m.age}</b>
        </li>
      ))}
    </ol>
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
              <div className="max-w-[480px]">
                <p className="font-display text-lg font-black text-forest">
                  {m.age} <span className="font-semibold italic">· {m.place}</span>
                </p>
                <p className="mt-2 text-[15px] leading-[1.6] text-ink-soft md:text-[17px] md:leading-[1.8]">{m.text}</p>
              </div>
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
      const route = routeLook(pos, MOMENTS.length);
      el.style.setProperty("--fill", String(route.fill));
      el.querySelectorAll("[data-route-stop]").forEach((li, i) => li.toggleAttribute("data-current", i % MOMENTS.length === route.stop));
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
            <Route />
          </div>
          <div className="mx-auto mt-2 flex min-h-0 w-full max-w-[1180px] flex-1">
            {/* 40px wider than the column on the left, with the reel inset to match, so the photo's shadow isn't clipped */}
            <div className="drum-window relative flex-1 overflow-hidden md:-ml-10">
              {/* Each slide is 80% of the window (88% on phones), so the neighbours peek in above and below */}
              <div ref={reel} className="absolute inset-x-0 top-[6%] h-[88%] will-change-transform md:top-[10%] md:left-10 md:h-[80%]">
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
            <Route vertical />
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
