# Homepage Restyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the Dulce Kiwi homepage in the agreed "Retro-playful" direction (forest/cream/butter/terracotta, Fraunces Soft + DM Sans, playful motion). Give specials their own section with a top strip, and publish it to dulcekiwi.com today.

**Architecture:**
- **Tokens and motion:** colour, font and motion tokens live in `site/src/app/globals.css` (Tailwind v4 `@theme`), plus a small set of hand-written component classes (`btn-pop`, `shape-arch`, `shape-blob`, `tilt-rail`, `reveal`, `eyebrow`). All motion is CSS.
  - Load-time and looping effects use keyframes.
  - Scroll-in uses `animation-timeline: view()` inside `@supports`, so browsers without it simply show the content.
  - Every effect is off under `prefers-reduced-motion`.
- **Components:** each section component is restyled in place. Two new components, `PromoStrip` and `Special`, render only when `getActivePromo()` returns a promo. `PromiseStrip` becomes `Ticker`, built on a shared `Wave` SVG.
- **Promo dates:** the page gets `revalidate = 3600` so the date check runs hourly in production instead of being frozen at build time.

**Tech Stack:** Next.js 16.2.9 (App Router, classic caching model, no `cacheComponents`), React 19, Tailwind CSS v4, `next/font/google`, Node 25 built-in test runner (`node --test`, native TS type stripping), puppeteer-core with local Chrome for visual checks, Vercel CLI 54 for deploys.

**Spec:** `docs/superpowers/specs/2026-10-09-homepage-restyle-design.md`

## Global Constraints

- **Colours:**
  - Main palette: forest `#34503f`, cream `#f6ebd9` (page background), sheet `#fff7ec`, butter `#f2c14e`, terracotta `#d9663b`.
  - Support tones: forest-dark `#2a4033`, ink-soft `#5b4a3a`, terracotta-dark `#b04527` (hover only).
  - No hex values in components except the token definitions in `globals.css`.
- **Terracotta use:** only the italic highlight words in headlines, the header "Pedir" pill, and the scarcity pill in the Special section. Never as text on butter, because the contrast is 2.1:1. On the butter "Cómo pedir" section, the highlight word stays forest italic.
- **Fonts:** Fraunces (axes `SOFT`, `WONK`, `opsz`; normal and italic) for headings, DM Sans for body.
  - Headings use `font-variation-settings: "SOFT" 100, "WONK" 1`.
  - Lora and Kalam are removed entirely.
- **Copy:** no copy changes. Every word on the page comes from the current components or `data.ts`. The only new strings are the specials labels from the spec: "Edición especial · hasta el {date}", "la caja", "Encargala ↓", and the strip line.
- **Motion:** "Playful" level, all defined in one commented "Motion" block in `globals.css`. Everything is disabled under `prefers-reduced-motion: reduce`. Content is visible at rest, and nothing depends on JS to become visible.
- **Mother's Day promo dates stay `2026-10-07` → `2026-10-15`.**
- **Next.js 16:** read `site/node_modules/next/dist/docs/` for any API you touch (per `site/AGENTS.md`).
- **Deploy:** run `vercel --prod` from `site/`, only after Ellie has looked at the local site and said go.

## Review Focus

1. **Promo past its end date.** On 2026-10-16 the strip and the Special section must disappear without a redeploy. Covered by the boundary tests in Task 1 and by checking the build output shows `/` revalidating every 1h (Task 9).
2. **Phone width (390px).** Rotated stickers, the bobbing badge and the ticker must not cause sideways scrolling. Covered by the `scrollWidth` assertion in the check script (Task 9).
3. **Reduced motion.** With `prefers-reduced-motion: reduce`, the ticker and headline must not animate, and all text must be fully visible. Covered by the reduced-motion pass in the check script (Task 9).
4. **Scroll-in reveals.** Sections must never be stuck invisible, including in browsers without scroll-driven animations (Firefox) and in full-page screenshots. Covered by the `@supports` guard in Task 1 and the "every `.reveal` ends at opacity 1" assertion in Task 9.
5. **No active promo.** The page must render cleanly with no strip, no Special section and no dangling `#especial` link. Covered by the `getActivePromo` "outside dates → undefined" tests (Task 1) and the gating in `page.tsx` (Task 3).

---

### Task 1: Foundation (tokens, fonts, motion, promo helpers, tests)

**Files:**
- Modify: `site/src/app/globals.css` (full rewrite)
- Modify: `site/src/app/layout.tsx:1-27` (font imports), `:52-56` (html/body classes)
- Modify: `site/src/components/data.ts` (Promo type, PROMOS entry, `getActivePromo`, new `formatPromoEnd`)
- Modify: `site/package.json` (add `test` script)
- Create: `site/tests/promo.test.mjs`
- Create: `site/src/components/Wave.tsx`

**Interfaces:**
- Produces, as CSS utilities and classes (component classes sit in `@layer components`, so Tailwind utilities like `text-butter` override them):
  - Colours: `bg-/text-/border-` + `forest`, `forest-dark`, `cream`, `sheet`, `butter`, `terracotta`, `terracotta-dark`, `ink-soft`.
  - Fonts: `font-display`, `font-sans`.
  - Animations: `animate-tick`, `animate-bob`, `animate-pop`.
  - Component classes: `btn-pop` (reads `--btn-shadow`, default butter), `shape-arch`, `shape-blob`, `tilt-rail`, `reveal`, `eyebrow`. Kept from before: `no-scrollbar`, `rail-gutter`.
  - `animate-bob` reads `--tilt` (default `-12deg`).
- Produces, as TS:
  - `type Promo` gains `nameHighlight?: string` and `stripLine: string`.
  - `getActivePromo(today?: string): Promo | undefined`
  - `formatPromoEnd(endDate: string): string` (for example `"15 de octubre"`)
  - `Wave({ flip?: boolean; className?: string })`, which draws in `currentColor`.

- [ ] **Step 1: Write the failing tests**

Create `site/tests/promo.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { getActivePromo, formatPromoEnd } from "../src/components/data.ts";

test("Mother's Day box is active on its first and last day", () => {
  assert.equal(getActivePromo("2026-10-07")?.id, "dia-de-la-madre-2026");
  assert.equal(getActivePromo("2026-10-15")?.id, "dia-de-la-madre-2026");
});

test("no promo outside the dates", () => {
  assert.equal(getActivePromo("2026-10-06"), undefined);
  assert.equal(getActivePromo("2026-10-16"), undefined);
});

test("active promo has the strip fields the new design needs", () => {
  const p = getActivePromo("2026-10-10");
  assert.equal(p?.stripLine, "solo 20 cajas");
  assert.equal(p?.nameHighlight, "de la Madre");
  assert.ok(p?.name.includes(p.nameHighlight));
});

test("end date is written the Argentine way", () => {
  assert.equal(formatPromoEnd("2026-10-15"), "15 de octubre");
  assert.equal(formatPromoEnd("2026-12-01"), "1 de diciembre");
});
```

Add to `site/package.json` `scripts`: `"test": "node --test tests/"`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd site && npm test`
Expected: FAIL. `formatPromoEnd` isn't exported, `stripLine` is undefined, and `getActivePromo("2026-10-06")` ignores its argument.

- [ ] **Step 3: Update `data.ts`**

In the `Promo` type, add after `name: string;`:

```ts
  nameHighlight?: string; // part of `name` set in italic highlight colour
  stripLine: string; // short line for the top strip, e.g. "solo 20 cajas"
```

In the Mother's Day entry, add after `name: "Caja Día de la Madre",`:

```ts
    nameHighlight: "de la Madre",
    stripLine: "solo 20 cajas",
```

Replace `getActivePromo` with:

```ts
export const getActivePromo = (today: string = buenosAiresToday()): Promo | undefined =>
  PROMOS.find((p) => today >= p.startDate && today <= p.endDate);

/** "2026-10-15" → "15 de octubre" */
export const formatPromoEnd = (endDate: string) =>
  new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${endDate}T12:00:00Z`));
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd site && npm test`
Expected: 4 tests pass.

- [ ] **Step 5: Rewrite `globals.css`**

```css
@import "tailwindcss";

@theme {
  /* Brand palette: each colour has one job (see design brief) */
  --color-forest: #34503f; /* main: text, buttons, big bands */
  --color-forest-dark: #2a4033; /* hover */
  --color-cream: #f6ebd9; /* page background */
  --color-sheet: #fff7ec; /* lighter cream: story band, photo borders, text on green */
  --color-butter: #f2c14e; /* sunshine: stickers, ticker, Cómo pedir band */
  --color-terracotta: #d9663b; /* sparingly: headline highlight words, Pedir pill */
  --color-terracotta-dark: #b04527; /* hover */
  --color-ink-soft: #5b4a3a; /* secondary body text */

  --font-display: var(--font-fraunces), Georgia, serif;
  --font-sans: var(--font-dm-sans), system-ui, sans-serif;

  /* ---------- Motion ("Playful"): tune or remove effects here ---------- */
  --animate-tick: tick 32s linear infinite; /* ticker band speed */
  --animate-bob: bob 4s ease-in-out infinite; /* hero kiwi sticker */
  --animate-pop: pop 0.6s cubic-bezier(0.3, 1.5, 0.5, 1) both; /* hero words */

  @keyframes tick {
    to {
      transform: translateX(-50%);
    }
  }
  @keyframes bob {
    0%,
    100% {
      transform: rotate(var(--tilt, -12deg));
    }
    50% {
      transform: rotate(calc(var(--tilt, -12deg) + 8deg)) translateY(-6px);
    }
  }
  @keyframes pop {
    from {
      opacity: 0;
      transform: translateY(14px) rotate(4deg) scale(0.9);
    }
  }
}

:root {
  color-scheme: light;
}

html {
  scroll-behavior: smooth;
}

body {
  overflow-x: clip;
}

/* Fraunces' soft, slightly wonky cut, used for every heading */
.font-display {
  font-variation-settings:
    "SOFT" 100,
    "WONK" 1;
}

@layer components {
  /* Small caps label above headings */
  .eyebrow {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--color-forest) 80%, transparent);
  }

  /* Photo shapes */
  .shape-arch {
    border-radius: 999px 999px 1.25rem 1.25rem;
  }
  .shape-blob {
    border-radius: 46% 54% 48% 52% / 52% 46% 54% 48%;
  }

  /* Buttons with an offset shadow: lift on hover, squish on press */
  .btn-pop {
    --btn-shadow-color: var(--btn-shadow, var(--color-butter));
    box-shadow: 5px 5px 0 var(--btn-shadow-color);
    transition:
      transform 0.15s,
      box-shadow 0.15s,
      background-color 0.2s;
  }
  .btn-pop:hover {
    transform: translate(-2px, -2px);
    box-shadow: 7px 7px 0 var(--btn-shadow-color);
  }
  .btn-pop:active {
    transform: translate(4px, 4px);
    box-shadow: 0 0 0 var(--btn-shadow-color);
  }

  /* Bake cards sit tilted and straighten on hover */
  .tilt-rail > * {
    transition: transform 0.35s cubic-bezier(0.3, 1.5, 0.5, 1);
  }
  .tilt-rail > :nth-child(odd) {
    transform: rotate(-2.5deg);
  }
  .tilt-rail > :nth-child(even) {
    transform: rotate(2deg) translateY(10px);
  }
  .tilt-rail > :hover {
    transform: rotate(0deg) scale(1.03);
  }
}

/* Sections ease in as they scroll into view. Browsers without
   scroll-driven animations just show them. */
@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
}
@supports (animation-timeline: view()) {
  .reveal {
    animation: reveal linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 35%;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
  }
}

/* Horizontal bakes rail: scrollable but without a visible scrollbar */
.no-scrollbar {
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Same outer margins as the 1232px content column */
.rail-gutter {
  --gutter: max(24px, calc((100% - 1232px) / 2));
  padding-inline: var(--gutter);
  scroll-padding-inline: var(--gutter);
}
```

- [ ] **Step 6: Swap the fonts in `layout.tsx`**

Replace the three font imports and declarations (lines 1–27) with:

```tsx
import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

// Soft, slightly wonky display serif for headings (SOFT/WONK set in globals.css)
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

// Clean, friendly sans for body copy
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});
```

Replace the `<html>` and `<body>` opening tags with:

```tsx
    <html lang="es" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="bg-cream font-sans text-forest antialiased">
```

- [ ] **Step 7: Create `Wave.tsx`**

```tsx
/** Wavy edge for colour bands. Draws in currentColor; `flip` points the waves down. */
export default function Wave({
  flip = false,
  className = "",
}: {
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      className={`block h-5 w-full md:h-8 ${flip ? "-scale-y-100" : ""} ${className}`}
    >
      <path
        d="M0 40V20Q75 0 150 20T300 20T450 20T600 20T750 20T900 20T1050 20T1200 20V40Z"
        fill="currentColor"
      />
    </svg>
  );
}
```

- [ ] **Step 8: Verify types, lint and build**

Run: `cd site && npx tsc --noEmit && npm run lint && npm run build`
Expected: no errors. Components still use old token names (`text-moss` etc.) and will look unstyled until later tasks. That's expected and nothing is deployed in between.

- [ ] **Step 9: Commit**

```bash
git add site/src/app/globals.css site/src/app/layout.tsx site/src/components/data.ts site/src/components/Wave.tsx site/tests/promo.test.mjs site/package.json
git commit -m "Restyle foundation: brand tokens, Fraunces + DM Sans, motion, promo helpers"
```

---

### Task 2: Header and promo strip

**Files:**
- Modify: `site/src/components/Header.tsx` (full rewrite)
- Create: `site/src/components/PromoStrip.tsx`

**Interfaces:**
- Consumes: `Promo` (`name`, `stripLine`) from `data.ts`, plus the tokens from Task 1.
- Produces: `PromoStrip({ promo }: { promo: Promo })`, a link to `#especial`.

- [ ] **Step 1: Rewrite `Header.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `PromoStrip.tsx`**

```tsx
import type { Promo } from "./data";

/** Slim butter bar above the header while a special is on; jumps to the Special section. */
export default function PromoStrip({ promo }: { promo: Promo }) {
  return (
    <a
      href="#especial"
      className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 bg-butter px-4 py-2.5 text-center text-sm font-bold text-forest"
    >
      <span className="font-display text-base font-extrabold">{promo.name}</span>
      <span aria-hidden="true">·</span>
      <span>{promo.stripLine}</span>
      <span aria-hidden="true">·</span>
      <span className="underline decoration-2 underline-offset-4">Encargala ↓</span>
    </a>
  );
}
```

- [ ] **Step 3: Type-check and lint**

Run: `cd site && npx tsc --noEmit && npm run lint`
Expected: no errors. `PromoStrip` isn't on the page until Task 3.

- [ ] **Step 4: Commit**

```bash
git add site/src/components/Header.tsx site/src/components/PromoStrip.tsx
git commit -m "Header with horizontal wordmark and Pedir pill; promo top strip"
```

---

### Task 3: Hero, Special section, Ticker, and page wiring

**Files:**
- Modify: `site/src/components/Hero.tsx` (full rewrite; the promo branch is removed)
- Create: `site/src/components/Special.tsx`
- Create: `site/src/components/Ticker.tsx`
- Delete: `site/src/components/PromiseStrip.tsx`
- Modify: `site/src/app/page.tsx` (full rewrite)

**Interfaces:**
- Consumes: `getActivePromo`, `formatPromoEnd`, `whatsappLink`, `WA_HELLO` and `Promo` from `data.ts`; `Wave`; `PromoStrip`; `ChatIcon`; and the CSS classes from Task 1.
- Produces: `Hero()`, `Special({ promo }: { promo: Promo })` with `id="especial"`, `Ticker()`, and a page with `export const revalidate = 3600`.

- [ ] **Step 1: Rewrite `Hero.tsx`**

```tsx
import Image from "next/image";
import { Fragment } from "react";
import { ChatIcon } from "./icons";
import { WA_HELLO } from "./data";

// Headline words pop in one after another
const WORDS = ["Repostería", "casera,", "como", "la", "de"];
const STAGGER_MS = 80;

export default function Hero() {
  return (
    // On phones the photo wraps ABOVE the text (wrap-reverse)
    <section
      id="inicio"
      className="mx-auto flex max-w-[1280px] flex-wrap-reverse items-center gap-x-16 gap-y-12 px-6 pt-4 pb-20"
    >
      <div className="flex min-w-0 flex-[1_1_400px] flex-col items-start">
        <p className="eyebrow">Hecho a mano en Acassuso</p>
        <h1 className="mt-4 font-display text-[clamp(46px,6vw,84px)] leading-[0.96] font-black tracking-[-0.02em] text-forest">
          {WORDS.map((w, i) => (
            <Fragment key={w}>
              <span
                className="inline-block animate-pop"
                style={{ animationDelay: `${i * STAGGER_MS}ms` }}
              >
                {w}
              </span>{" "}
            </Fragment>
          ))}
          <em
            className="inline-block animate-pop font-extrabold text-terracotta"
            style={{ animationDelay: `${WORDS.length * STAGGER_MS}ms` }}
          >
            antes.
          </em>
        </h1>
        <p className="mt-6 max-w-[460px] text-lg leading-[1.65] text-ink-soft">
          Soy Ellie. Crecí en una granja en Nueva Zelanda y ahora horneo cada
          semana en mi cocina, con ingredientes de verdad: nueces, dátiles,
          fruta y harinas integrales.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
          <a
            href={WA_HELLO}
            className="btn-pop inline-flex min-h-[54px] items-center gap-2.5 rounded-full bg-forest px-7 font-bold text-cream hover:bg-forest-dark"
          >
            <ChatIcon filled />
            Pedime algo rico
          </a>
          <a
            href="#horno"
            className="font-bold text-forest underline decoration-butter decoration-[3px] underline-offset-[7px]"
          >
            Qué hay esta semana ↓
          </a>
        </div>
      </div>

      <figure className="relative m-0 min-w-0 flex-[1_1_420px]">
        <div className="shape-arch relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden">
          <Image
            src="/home/bake-crepe.webp"
            alt="Rogel casero, capa por capa, con dulce de leche y merengue tostado, sobre una mesa de madera enharinada"
            fill
            priority
            sizes="(min-width: 1280px) 520px, (min-width: 900px) 45vw, 90vw"
            className="object-cover object-[center_55%]"
          />
        </div>
        <Image
          src="/brand/badge-kiwi.png"
          alt=""
          width={1200}
          height={1200}
          className="absolute bottom-[8%] left-0 w-[26%] max-w-[150px] animate-bob"
        />
        <p className="absolute top-[7%] right-0 flex aspect-square w-[27%] max-w-[150px] rotate-[8deg] items-center justify-center rounded-full bg-butter p-3 text-center font-display text-[clamp(13px,1.6vw,18px)] leading-tight font-bold text-forest italic">
          Siempre casero. Nunca apurado.
        </p>
      </figure>
    </section>
  );
}
```

- [ ] **Step 2: Create `Special.tsx`**

```tsx
import Image from "next/image";
import { ChatIcon } from "./icons";
import { type Promo, formatPromoEnd, whatsappLink } from "./data";

/** Promo name with its highlight words in butter italic. */
function PromoName({ name, highlight }: { name: string; highlight?: string }) {
  const at = highlight ? name.indexOf(highlight) : -1;
  if (!highlight || at < 0) return <>{name}</>;
  return (
    <>
      {name.slice(0, at)}
      <em className="font-extrabold text-butter">{highlight}</em>
      {name.slice(at + highlight.length)}
    </>
  );
}

/** The current special, right under the hero. Only rendered while a promo is active. */
export default function Special({ promo }: { promo: Promo }) {
  return (
    <section id="especial" className="scroll-mt-6 px-6 pb-20">
      <div className="reveal mx-auto grid max-w-[1180px] items-center gap-10 rounded-[28px] bg-forest p-6 text-cream sm:p-10 md:grid-cols-[1fr_1.15fr] md:gap-14 md:p-12">
        <figure className="relative m-0">
          <div className="shape-arch relative aspect-[10/11] overflow-hidden border-[6px] border-sheet">
            <Image
              src={promo.photoSrc}
              alt={promo.photoAlt}
              fill
              sizes="(min-width: 768px) 480px, 90vw"
              className="object-cover"
            />
          </div>
          <p className="absolute bottom-[8%] left-0 flex aspect-square w-[34%] max-w-[150px] -rotate-[8deg] flex-col items-center justify-center rounded-full bg-butter text-center text-forest">
            <span className="font-display text-[clamp(20px,2.6vw,30px)] leading-none font-black">
              ${promo.price.toLocaleString("es-AR")}
            </span>
            <span className="mt-1 text-[11px] font-bold tracking-[0.12em] uppercase">
              la caja
            </span>
          </p>
        </figure>

        <div className="min-w-0">
          <p className="eyebrow text-butter">
            Edición especial · hasta el {formatPromoEnd(promo.endDate)}
          </p>
          <h2 className="mt-3 font-display text-[clamp(38px,4.6vw,60px)] leading-[0.98] font-black tracking-[-0.02em] text-sheet">
            <PromoName name={promo.name} highlight={promo.nameHighlight} />
          </h2>
          <p className="mt-3 font-display text-xl text-butter italic">{promo.tagline}</p>
          <ul className="mt-6 grid gap-2 text-[15px] leading-relaxed text-cream/90">
            {promo.items.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span aria-hidden="true" className="text-butter">
                  ✺
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 inline-block -rotate-2 rounded-full bg-terracotta px-4 py-1.5 text-sm font-bold text-sheet">
            {promo.scarcityLine}
          </p>
          <div className="mt-6">
            <a
              href={whatsappLink(promo.whatsappMessage)}
              className="btn-pop inline-flex min-h-[54px] items-center gap-2.5 rounded-full bg-butter px-7 font-bold text-forest [--btn-shadow:var(--color-sheet)]"
            >
              <ChatIcon filled />
              Encargar la caja
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `Ticker.tsx` and delete `PromiseStrip.tsx`**

```tsx
import Wave from "./Wave";

const PROMISES = [
  "Ingredientes reales",
  "Hecho por mí",
  "A pedido, cada semana",
  "Sin nada refinado",
];

// Four copies: the band slides by half its width, and each half must be wider than any screen
const LOOP = [...PROMISES, ...PROMISES, ...PROMISES, ...PROMISES];

/** Green band with wavy edges and the promises scrolling across in butter. */
export default function Ticker() {
  return (
    <div className="text-forest">
      <Wave className="-mb-px" />
      <div className="overflow-hidden bg-forest py-3 md:py-4">
        <p className="sr-only">{PROMISES.join(" · ")}</p>
        <div
          aria-hidden="true"
          className="flex w-max animate-tick font-display text-[clamp(22px,3vw,36px)] font-bold whitespace-nowrap text-butter italic"
        >
          {LOOP.map((p, i) => (
            <span key={i} className="px-5">
              {p} <span className="text-cream not-italic">✺</span>
            </span>
          ))}
        </div>
      </div>
      <Wave flip className="-mt-px" />
    </div>
  );
}
```

Run: `git rm site/src/components/PromiseStrip.tsx`

- [ ] **Step 4: Rewrite `page.tsx`**

```tsx
import Header from "@/components/Header";
import PromoStrip from "@/components/PromoStrip";
import Hero from "@/components/Hero";
import Special from "@/components/Special";
import Ticker from "@/components/Ticker";
import Bakes from "@/components/Bakes";
import Story from "@/components/Story";
import HowToOrder from "@/components/HowToOrder";
import Contact from "@/components/Contact";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getActivePromo } from "@/components/data";

// Re-check promo dates hourly so specials appear and end without a redeploy
export const revalidate = 3600;

export default function Home() {
  const promo = getActivePromo();

  return (
    <>
      {promo && <PromoStrip promo={promo} />}
      <Header />
      <main>
        <Hero />
        {promo && <Special promo={promo} />}
        <Ticker />
        <Bakes />
        <Story />
        <HowToOrder />
        <Contact />
      </main>
      <FloatingWhatsApp />
    </>
  );
}
```

- [ ] **Step 5: Verify**

Run: `cd site && npx tsc --noEmit && npm run lint && npm test`
Expected: no errors; 4 tests pass.

Then, with the dev server running (`npm run dev`), run:
`curl -s localhost:3000 | grep -o 'id="especial"\|Encargala\|Siempre casero\|Ingredientes reales' | sort -u`
Expected: all four strings (the promo is active on 2026-10-09).

- [ ] **Step 6: Commit**

```bash
git add -A site/src/components site/src/app/page.tsx
git commit -m "Hero, Special section under the hero, wavy ticker; page revalidates hourly"
```

---

### Task 4: Bakes ("Esta semana")

**Files:**
- Modify: `site/src/components/Bakes.tsx` (full rewrite)

**Interfaces:**
- Consumes: `BAKES`, `WA_SPECIAL` and `whatsappLink` from `data.ts`, plus the `tilt-rail`, `shape-blob`, `btn-pop`, `eyebrow` and `reveal` classes.

- [ ] **Step 1: Rewrite `Bakes.tsx`**

```tsx
import Image from "next/image";
import { BAKES, WA_SPECIAL, whatsappLink } from "./data";

const CARD = "flex-[0_0_clamp(260px,26vw,340px)] snap-start";

export default function Bakes() {
  return (
    <section id="horno" className="pt-20 pb-24">
      <div className="reveal mx-auto flex max-w-[1280px] flex-wrap items-end justify-between gap-x-12 gap-y-4 px-6">
        <div className="flex-[1_1_420px]">
          <p className="eyebrow">Esta semana en el horno</p>
          <h2 className="mt-3 font-display text-[clamp(38px,4.6vw,60px)] leading-none font-black tracking-[-0.02em] text-forest">
            Lo que salió <em className="font-extrabold text-terracotta">del horno</em>
          </h2>
        </div>
        <p className="flex-[0_1_380px] leading-[1.65] text-ink-soft">
          No es un menú fijo: cambia con la estación y con lo que encuentro en
          la verdulería. Si algo te tienta, escribime y te lo guardo.
        </p>
      </div>

      <div className="no-scrollbar rail-gutter tilt-rail mt-10 flex snap-x snap-mandatory items-start gap-8 overflow-x-auto pt-6 pb-8">
        {BAKES.map((b) => (
          <article key={b.name} className={CARD}>
            <div className="relative">
              <div className="shape-blob relative aspect-square overflow-hidden border-[6px] border-sheet">
                <Image
                  src={b.img}
                  alt={b.alt}
                  fill
                  sizes="(min-width: 1308px) 340px, (min-width: 1000px) 26vw, 260px"
                  className="object-cover"
                />
              </div>
              <span className="absolute bottom-3 left-0 -rotate-6 rounded-full bg-butter px-3.5 py-1 font-display text-[15px] font-bold text-forest italic">
                {b.note}
              </span>
            </div>
            <h3 className="mt-5 font-display text-[23px] leading-tight font-extrabold text-forest">
              {b.name}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{b.detail}</p>
            <a
              href={whatsappLink(
                `¡Hola Ellie! Me gustaría encargarte ${b.name.toLowerCase()}.`,
              )}
              className="mt-1 inline-flex min-h-11 items-center text-[15px] font-bold text-forest underline decoration-butter decoration-[3px] underline-offset-[6px] hover:text-forest-dark"
            >
              Pedíselo a Ellie →
            </a>
          </article>
        ))}

        <article
          className={`${CARD} flex aspect-square flex-col justify-end rounded-[28px] bg-forest px-7 py-8 text-cream`}
        >
          <h3 className="font-display text-[28px] leading-[1.1] font-extrabold text-sheet">
            ¿No está lo que buscás?
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-cream/85">
            Un cumpleaños, una mesa dulce, algo para el mate… Contame qué tenés
            ganas de comer y lo armamos juntos.
          </p>
          <a
            href={WA_SPECIAL}
            className="btn-pop mt-6 inline-flex min-h-12 items-center self-start rounded-full bg-butter px-6 text-[15px] font-bold text-forest [--btn-shadow:var(--color-sheet)]"
          >
            Contame
          </a>
        </article>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify and commit**

Run: `cd site && npx tsc --noEmit && npm run lint`
Expected: no errors.

```bash
git add site/src/components/Bakes.tsx
git commit -m "Bakes: blob photos, butter note stickers, tilted rail, green special-order card"
```

---

### Task 5: Story ("Mi historia")

**Files:**
- Modify: `site/src/components/Story.tsx` (class changes only; copy unchanged)

- [ ] **Step 1: Restyle `Story.tsx`**

Apply these exact edits:
- In `Print`, change the figure's `bg-cream` to `bg-white`.
- Change the figcaption's `font-hand text-ink` to `font-display font-semibold text-ink-soft italic`.
- Section: change `bg-linen px-6 py-24` to `bg-sheet px-6 py-24`.
- Prints column: add `reveal` to the `relative min-w-0 flex-[1_1_380px] …` div. Text column: add `reveal` to the `min-w-0 flex-[1_1_420px]` div.
- Eyebrow: replace `text-xs font-semibold tracking-[0.22em] text-moss uppercase` with `eyebrow`.
- H2: replace its className with `mt-3 font-display text-[clamp(40px,4.6vw,62px)] leading-none font-black tracking-[-0.02em] text-forest`. Make the `<em>` className `font-extrabold text-terracotta`.
- Body wrapper: change `text-ink-warm` to `text-ink-soft`.
- Blockquote: replace its className with `mt-[30px] -rotate-1 rounded-2xl bg-butter px-6 py-5 font-display text-[22px] leading-[1.4] font-semibold text-forest italic`.
- Sign-off: replace `font-hand text-[28px] text-moss` with `font-display text-[28px] font-extrabold text-forest italic`.

- [ ] **Step 2: Verify and commit**

Run: `cd site && npx tsc --noEmit && npm run lint && grep -n "font-hand\|moss\|linen\|ink-warm" src/components/Story.tsx`
Expected: no errors and no grep output.

```bash
git add site/src/components/Story.tsx
git commit -m "Story: sheet band, Fraunces captions, butter quote card"
```

---

### Task 6: How to order ("Cómo pedir")

**Files:**
- Modify: `site/src/components/HowToOrder.tsx` (the `HowToOrder` function; `STEPS` unchanged)

- [ ] **Step 1: Replace the `HowToOrder` function**

```tsx
export default function HowToOrder() {
  return (
    <section id="pedidos" className="bg-butter px-6 py-24 text-center">
      <div className="mx-auto max-w-[1180px]">
        <p className="eyebrow reveal">Cómo pedir</p>
        {/* No terracotta on butter (contrast): the highlight stays forest italic */}
        <h2 className="reveal mt-3 font-display text-[clamp(38px,4.4vw,58px)] leading-none font-black tracking-[-0.02em] text-forest">
          Todo empieza con <em className="font-extrabold">un mensaje.</em>
        </h2>

        <ol className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-12">
          {STEPS.map((s, i) => (
            <li key={s.title} className="reveal">
              <span className="mx-auto flex size-[72px] items-center justify-center rounded-full bg-forest font-display text-[34px] font-black text-butter">
                {i + 1}
              </span>
              <h3 className="mt-5 font-display text-2xl font-extrabold text-forest">
                {s.title}
              </h3>
              <p className="mx-auto mt-2.5 max-w-[300px] text-[15px] leading-[1.65] text-ink-soft">
                {s.body}
              </p>
            </li>
          ))}
        </ol>

        <p className="reveal mt-14 font-display text-xl font-semibold text-forest italic">
          Sin carrito, sin precios fijos: cada horneada es distinta. Preguntame
          sin compromiso.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify and commit**

Run: `cd site && npx tsc --noEmit && npm run lint`
Expected: no errors.

```bash
git add site/src/components/HowToOrder.tsx
git commit -m "Cómo pedir: butter band with numbered green circles"
```

---

### Task 7: Contact, footer and floating WhatsApp

**Files:**
- Modify: `site/src/components/Contact.tsx` (the `Contact` function; `ROWS` unchanged)
- Modify: `site/src/components/FloatingWhatsApp.tsx` (className only)

- [ ] **Step 1: Replace the `Contact` function**

```tsx
export default function Contact() {
  return (
    <section id="contacto" className="bg-forest px-6 pt-24 text-cream">
      <div className="reveal mx-auto flex max-w-[1180px] flex-wrap items-start gap-x-24 gap-y-14">
        <div className="min-w-0 flex-[1_1_400px]">
          <p className="eyebrow text-butter">¿Se te antojó algo?</p>
          <h2 className="mt-3 font-display text-[clamp(40px,4.6vw,62px)] leading-none font-black tracking-[-0.02em] text-sheet">
            Escribime, te leo con el{" "}
            <em className="font-extrabold text-butter">mate en la mano.</em>
          </h2>
          <p className="mt-6 max-w-[420px] text-[17px] leading-[1.7] text-cream/80">
            Contame qué tenés ganas de comer y para cuándo. Te contesto yo, casi
            siempre en el día.
          </p>
          <a
            href={WA_HELLO}
            className="btn-pop mt-8 inline-flex min-h-14 items-center gap-2.5 rounded-full bg-sheet px-7 font-bold text-forest"
          >
            <ChatIcon filled />
            Escribime por WhatsApp
          </a>
        </div>

        <ul className="min-w-0 flex-[1_1_400px] border-t border-cream/20">
          {ROWS.map((r) => (
            <li key={r.label} className="border-b border-cream/20">
              <a
                href={r.href}
                className="flex min-h-[76px] items-center justify-between gap-4 text-sheet hover:text-butter"
              >
                <span className="text-xs font-bold tracking-[0.18em] text-cream/65 uppercase">
                  {r.label}
                </span>
                <span className="font-display text-xl">{r.value} ↗</span>
              </a>
            </li>
          ))}
          <li className="pt-[22px] text-sm text-cream/70">
            Acassuso · San Isidro · Zona Norte, Buenos Aires
          </li>
        </ul>
      </div>

      {/* Extra bottom padding on phones so the floating WhatsApp pill doesn't cover the footer */}
      <footer className="mx-auto mt-20 flex max-w-[1180px] flex-wrap items-end justify-between gap-6 border-t border-cream/20 pt-8 pb-24 md:pb-10">
        <Image
          src="/brand/logo-stacked-cream.png"
          alt="Dulce Kiwi"
          width={782}
          height={989}
          className="h-[120px] w-auto md:h-[150px]"
        />
        <div className="flex flex-col items-start gap-1.5 md:items-end">
          <span className="font-display text-xl text-butter italic">
            Un poquito de allá, un poquito de acá.
          </span>
          <span className="text-[13px] text-cream/60">
            © 2026 Dulce Kiwi · Repostería casera en Acassuso
          </span>
        </div>
      </footer>
    </section>
  );
}
```

The copy "¿Se te antojó algo?" is unchanged apart from sentence-case capitalisation, now that it's an eyebrow label instead of handwriting.

- [ ] **Step 2: Restyle `FloatingWhatsApp.tsx`**

Replace the anchor's className with:
`btn-pop fixed right-4 bottom-5 z-50 inline-flex min-h-[52px] items-center gap-2 rounded-full bg-forest pr-5 pl-4 text-[15px] font-bold text-cream md:hidden`

- [ ] **Step 3: Verify and commit**

Run: `cd site && npx tsc --noEmit && npm run lint`
Expected: no errors.

```bash
git add site/src/components/Contact.tsx site/src/components/FloatingWhatsApp.tsx
git commit -m "Contact + footer on forest with cream logo; floating WhatsApp matches buttons"
```

---

### Task 8: Remove leftovers

**Files:**
- Delete: `site/public/brand/logo.svg`, `site/public/brand/logo-green.svg`, `site/public/brand/kiwi.svg` (old right-facing stamp; nothing references them)

- [ ] **Step 1: Prove nothing uses old tokens, fonts or files**

Run: `cd site && grep -rnE "font-hand|font-serif|\b(text|bg|border|decoration)-(moss|moss-dark|paper|linen|oat|rule|rule-deep|ink|ink-deep|ink-warm|honey|nutmeg|wheat|walnut)\b|logo\.svg|logo-green\.svg|kiwi\.svg|PromiseStrip" src`
Expected: no output. If anything prints, restyle that line using the Task 1 tokens before continuing.

- [ ] **Step 2: Delete the old files, then build**

Run: `git rm site/public/brand/logo.svg site/public/brand/logo-green.svg site/public/brand/kiwi.svg && cd site && npm run build`
Expected: build succeeds. The route table shows `/` with a 1h revalidate.

- [ ] **Step 3: Commit**

```bash
git commit -m "Remove old stamp logo files"
```

---

### Task 9: Check desktop, phone and reduced motion

**Files:**
- Modify: `site/shots.mjs` (full rewrite: Windows Chrome path, section ids, phone mode, assertions)

- [ ] **Step 1: Rewrite `shots.mjs`**

```js
// Visual + layout check of the homepage.
// Usage: node shots.mjs            (desktop 1440x900)
//        MOBILE=1 node shots.mjs   (phone 390x844)
//        REDUCED=1 node shots.mjs  (prefers-reduced-motion)
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const CHROME =
  process.env.CHROME ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
const URL = process.env.URL || "http://localhost:3000";
const MOBILE = process.env.MOBILE === "1";
const REDUCED = process.env.REDUCED === "1";
const OUT =
  process.env.OUT ||
  `shots/${MOBILE ? "phone" : "desktop"}${REDUCED ? "-reduced" : ""}`;
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  defaultViewport: MOBILE
    ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
    : { width: 1440, height: 900, deviceScaleFactor: 1 },
  args: ["--hide-scrollbars", "--force-color-profile=srgb"],
});
const page = await browser.newPage();
if (REDUCED) {
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
}
await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });

// Slow scroll so reveals and lazy images run, then back to top
await page.evaluate(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  for (let y = 0; y <= document.body.scrollHeight; y += 300) {
    window.scrollTo(0, y);
    await sleep(60);
  }
  window.scrollTo(0, 0);
  await sleep(800);
});

const problems = [];

// 1. No sideways scrolling
const { sw, iw } = await page.evaluate(() => ({
  sw: document.documentElement.scrollWidth,
  iw: window.innerWidth,
}));
if (sw > iw) problems.push(`page scrolls sideways: scrollWidth ${sw} > ${iw}`);

// 2. Every reveal ends fully visible once scrolled into view
const hidden = await page.evaluate(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const bad = [];
  for (const el of document.querySelectorAll(".reveal")) {
    el.scrollIntoView({ behavior: "instant", block: "center" });
    await sleep(250);
    const o = Number(getComputedStyle(el).opacity);
    if (o < 0.99) bad.push(`${el.className.slice(0, 40)}… opacity ${o}`);
  }
  window.scrollTo(0, 0);
  return bad;
});
problems.push(...hidden);

// 3. Reduced motion: nothing animates
if (REDUCED) {
  const animated = await page.evaluate(() =>
    [...document.querySelectorAll(".animate-tick, .animate-bob, .animate-pop")]
      .filter((el) => getComputedStyle(el).animationName !== "none")
      .map((el) => el.className.slice(0, 40)),
  );
  if (animated.length) problems.push(`still animating with reduced motion: ${animated.join(", ")}`);
}

// Screenshots: top of page, each section, full page
await page.screenshot({ path: `${OUT}/00-top.png` });
for (const id of ["inicio", "especial", "horno", "historia", "pedidos", "contacto"]) {
  const found = await page.evaluate((id) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "instant", block: "start" });
    return Boolean(el);
  }, id);
  if (!found) continue;
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: `${OUT}/sec-${id}.png` });
}
await page.screenshot({ path: `${OUT}/full.png`, fullPage: true });
await browser.close();

if (problems.length) {
  console.error("PROBLEMS:\n- " + problems.join("\n- "));
  process.exit(1);
}
console.log("OK, no problems. Screenshots in", OUT);
```

Add `shots/` to `site/.gitignore`.

- [ ] **Step 2: Run all three passes against the dev server**

Run (dev server on :3000): `cd site && node shots.mjs && MOBILE=1 node shots.mjs && REDUCED=1 node shots.mjs`
Expected: three "OK, no problems" lines.

- [ ] **Step 3: Look at the screenshots**

Open `shots/desktop/*.png` and `shots/phone/*.png`. Compare against the mockups (`homepage-colours.html` right side, `specials-v2.html`). Check specifically:
- Stickers don't cover the rogel or faces in the story prints.
- The headline doesn't break awkwardly at 390px.
- The ticker band has no gap.
- Footer text isn't hidden by the floating WhatsApp pill.

Fix anything off, rerun step 2, then commit:

```bash
git add site/shots.mjs site/.gitignore site/src
git commit -m "Layout check script for desktop, phone and reduced motion; visual fixes"
```

---

### Task 10: Ellie's look, then publish

- [ ] **Step 1: Ellie reviews locally.** Restart `npm run dev` if needed and ask Ellie to open http://localhost:3000 on desktop and phone (phone: `http://<LAN-IP>:3000` from the dev server output, same Wi-Fi). Wait for her go-ahead. Apply and commit any small fixes she asks for.

- [ ] **Step 2: Commit the pending brand files** (from earlier today, still uncommitted):

```bash
git add site/src/app/icon.png site/src/app/apple-icon.png site/src/app/opengraph-image.jpg site/public/brand/
git commit -m "Left-facing kiwi icons, rogel social preview, logo variants cut from the brand sheet"
```

- [ ] **Step 3: Final checks:** `cd site && npm test && npm run lint && npm run build`. All must pass.

- [ ] **Step 4: Deploy:** `cd site && vercel --prod`
Expected: "Production: https://dulce-kiwi-….vercel.app" and the alias `dulcekiwi.com`.

- [ ] **Step 5: Verify live**

Run:
```bash
curl -s https://dulcekiwi.com/ | grep -o 'Encargala\|id="especial"\|wordmark-horizontal-green\|Siempre casero' | sort -u
curl -s https://dulcekiwi.com/ | grep -o '<link rel="icon"[^>]*>'
```
Expected: the four strings. The icon `href` hash differs from the old `icon.3yrcypdi17l46.png`.
Then run `URL=https://dulcekiwi.com MOBILE=1 node shots.mjs` and expect "OK, no problems".
