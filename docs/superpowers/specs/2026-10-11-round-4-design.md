# Round 4: logo-left header, scroll drum story, pantry shelf contact, phone pass

Date: 2026-10-11
Branch: `homepage`
Builds on round 3 (`2026-10-09-round-3-design.md`) and the follow-up commit `3b605bb`.

Ellie picked each change below from mockups in the brainstorm companion (`.superpowers/brainstorm/3739-*/content/`, local only). Copy doesn't change anywhere unless stated.

## 1. Header

- **Desktop (md and up):** one row in three columns (`1fr auto 1fr`).
  - **Left:** the stacked wordmark (`/brand/wordmark-stacked-green.png`, linking to `#inicio`), aligned with the hero headline's left edge.
  - **Centre:** the three links ("Esta semana", "Mi historia", "Cómo pedir"), centred on the page.
  - **Right:** the terracotta "Pedir" pill, aligned with the hero photo's right edge.
- **Phone:** one row: the stacked logo on the left (about 50px tall) and the three links on the right at 13px. There's no ruled row and no Pedir pill (the floating pill covers ordering, see §6).

## 2. Hero and Special photos: the wobbly shape everywhere

The arch is retired from the hero and the Special, on every screen size, so the site uses one shape language. (`shape-arch` stays in the CSS only if something else still uses it; otherwise remove it.)

- **Hero photo:** a `shape-blob` photo, square, with the 6–8px `sheet` border and a soft shadow, tilted +3°.
  - **Desktop:** the kiwi badge overlaps the lower left edge, tilted −10°. The "Siempre casero. Nunca apurado." manteca sticker overlaps the upper right edge.
- **Special photo:** the same treatment, tilted −3°, with the price sticker ("$40.000 / la caja") on the lower right edge.

## 3. About Me ("Hola, soy Ellie"): the vertical drum

### Behaviour

- When the section reaches the top of the screen it **pins** (sticky stage, one screen tall). The page keeps scrolling for about **1.4 screens** while the stage plays, then the section unpins and the page carries on.
- The eyebrow ("Dos casas, una cocina") and the heading ("Hola, soy Ellie.") stay fixed at the top of the stage.
- Below them, a **reel** of three slides rolls **up**. Each slide pairs one photo with its paragraph:
  1. 3 años · Kumeu, NZ, with paragraph 1 (the farm).
  2. 8 años · mis primeros muffins, with paragraph 2 (cuidar a la gente, crucé el mundo).
  3. hoy · Acassuso, with paragraph 3 (ingredients), plus the manteca quote and "Con cariño, Ellie".
- **Scroll-linked and stepped:** the reel position follows scroll progress, but each slide rests while you scroll a short way (about a quarter of each step) and then moves quickly to the next with an ease-in-out. There's no bounce.
- **Drum feel:** the current slide is full size. The previous slide shrinks (to about 0.8) and fades (to about 25%) as it rolls off the top, and the next one waits small and faded below. The window fades out at its top and bottom edges.
- **Swing:** each photo has a resting tilt (−4°, +3.5°, −2.5°) and rotates further in proportion to its distance from centre while moving (about 14° per slide of distance), so the photos swing as they roll.
- **Doodles:** two hand-drawn line doodles per photo, in forest, spring out (scale 0 → 1 with a slight overshoot, the second delayed by 0.1s) when that slide becomes current:
  - 3 años: a sun and a sheep.
  - 8 años: a whisk and a muffin.
  - hoy: a mate (with bombilla) and a heart.

  They're drawn as inline SVG components with round line caps and joins, and should look properly hand-drawn (the mockup ones were placeholders).

### Look

- The background is **cream** (not sheet), so the borders read.
- The photos are `shape-blob` squares with an **8px white border** and a soft shadow. There are no coloured rings and no colour blocks.
- The manteca tag on each photo is a tilted pill, e.g. "**3 años** · Kumeu, NZ".
- Desktop slide layout: photo on the left (about 340px max), paragraph on the right.

### Phone

- The same drum and pin. Each slide stacks the photo (about 210px) **above** its paragraph.
- The quote and "Con cariño, Ellie" are **not** in the last slide. They follow the drum as normal content.

### Reduced motion

No pin and no reel. The three photo and paragraph pairs stack normally, with the photos at their resting tilt and the doodles shown statically. The quote and sign-off come after.

### Build notes

- Make it a client component. Use `motion` (already a dependency): `useScroll` on the section's target with `useTransform`, or a passive scroll listener driving CSS transforms. Don't animate layout properties.
- On phones, measure the stage with `100svh` (or the visual viewport) so the browser's address bar collapsing doesn't make the pinned stage jump.

## 4. Contact: the pantry shelf

### Layout

The layout is unchanged: the headline with the squiggle, the lead text, the three solid stickers, the wavy top edge and the round-badge footer. The gap above the footer grows (to about 130px on desktop) to make room for the shelf.

### The shelf

- A wooden shelf (a plank in `#9a6a40` with a lighter top edge, two small brackets and a soft shadow) runs along the bottom of the section, just above the footer. The footer's top border line is dropped, because the shelf replaces it.
- **Desktop:** twelve **different** packaged ingredients stand on it, evenly spaced, with no duplicates and nothing loose. Each has a Spanish label: harina integral (paper bag), esencia de vainilla (amber bottle), dulce de leche (jar with a gingham lid), huevos (half-dozen carton), cacao amargo (tin), leche (carton), canela (spice jar), azúcar (bag), miel (jar), polvo de hornear (tin), nueces (kraft bag with a window) and avena (box).
- **Phone:** one shelf with six items: harina, vainilla, dulce de leche, huevos, cacao and leche.

### Behaviour

- **The opening knock:** the first time the shelf scrolls into view, a block of **manteca** and a punnet of **arándanos** (neither of which is on the shelf) drop from above onto two tall items. On desktop that's the vainilla and the leche. On phones it's two items in the row. Their impact topples what they hit, which can knock into its neighbour. This happens once per page view.
- **Pushing (mouse):** after that, the cursor pushes things over as it moves through them. The pointer's push speed is capped so that a fast swipe nudges items but doesn't bulldoze the shelf. Items stay where they end up; there's no auto-tidy.
- **Tapping (touch):** a tap on an item flicks it over, away from the tap point. Touch never blocks page scrolling (no `touch-action: none`, no drag capture).
- **Flour puff:** a click or tap makes a small puff of flour at that point, and hard impacts make a little dust.
- **Settling:** once items come to rest they go to sleep and stay perfectly still. No jitter.

### Rules

- The canvas sits **behind** the content with `pointer-events: none`. Mouse moves are read from the section, so the stickers and every link always work.
- The pantry is decorative: the canvas is `aria-hidden`, and the section reads exactly as it does today.
- It pauses when the section is off screen and rebuilds on a width change.
- **Reduced motion:** the shelf and items are drawn standing still. There's no drop, and no push or tap physics.

### Build notes

- **Physics:** add `matter-js` as a dependency. Load it with a dynamic `import()` only when the contact section comes within about one screen of the viewport, so it never affects first load. Use rectangles (chamfered) for the packages, sleeping enabled, and a kinematic circle for the pointer.
- **Sprites:** draw them once to offscreen canvases at device pixel ratio, after `document.fonts.ready`, so the labels use Fraunces and DM Sans. They should match the approved mockup (`contact-pantry-5.html`), polished.

## 5. Phone pass (below md unless noted)

### Hero (option F)

1. Header (§1).
2. A big wobbly-circle photo, tilted +3°, with a white border, inset about 30px from each side. The "Siempre casero" sticker overlaps its upper right.
3. A **cream rounded sticker** (radius about 30px, tilted −2°, manteca offset shadow) holding the eyebrow and headline. It overlaps the photo's bottom edge by about 70px.
4. The two buttons ("Pedime algo rico", "Qué hay esta semana ↓"). Then the intro paragraph.

The headline and the "Pedime algo rico" button must be visible on the first screen of a 375×667 phone. The kiwi badge isn't shown in the phone hero.

### Special (option B)

- The forest card, with the wobbly photo (about 230px, tilted −3°, white border) popping out over its top edge by about 100px. The price sticker overlaps the photo's lower right.
- Then the eyebrow, title, tagline, list, scarcity pill and "Encargar la caja", unchanged.
- **The full list stays.** The two long items split into a name plus a small italic line:
  - "2 Afghans" / "galletitas neozelandesas con ganache de chocolate"
  - "2 lamingtons" / "bizcocho neozelandés bañado en chocolate y coco rallado, con dulce de leche"

  To do this, give each `Promo.items` entry an optional detail (e.g. `{ name, detail? }`). Desktop keeps reading as it does today, as "name (detail)" on one line.

### Bakes rail

The current design is unchanged, except that on phones the cards widen so the next card shows only as a **thin sliver (about 20–25px)**. For example, `flex-basis: calc(100vw - var(--gutter) - 24px - gap)`, with the gap reduced to about 16px on phones.

### Cómo pedir (option A)

- Left-aligned, numbered path. Each 56px forest number circle sits to the left of its title and text, and a dotted forest line joins the three circles.
- The closing italic line is left-aligned under the steps. Desktop is unchanged (three centred columns).

### About Me and Contact

See §3 (Phone) and §4 (Phone).

### Floating "Escribime" pill

It's hidden while the hero's "Pedime algo rico" button is on screen, and from the moment the contact section enters the viewport. It fades and slides out (instantly under reduced motion) and is visible everywhere in between. Its behaviour is otherwise unchanged (phones only).

## Unchanged

Promo strip, ticker, Special's desktop text column, bakes on desktop, Cómo pedir on desktop, footer content, colours, fonts and all copy except the Special item split in §5.

## Done when

- `npm test`, `npm run lint` and `npm run build` pass. New or updated tests cover:
  - the header: logo in the left column and the links in the centre column;
  - no `shape-arch` left in the Hero, Special or Story;
  - Story uses blob photos with white borders and no colour blocks;
  - the stepped reel easing (rests on each slide, reaches 0 / 1 / 2 at the right progress);
  - the pantry's shelf rows have no duplicate items and the six phone items are a subset of the twelve;
  - `matter-js` is only imported dynamically.
- The `shots.mjs` checks pass on desktop, phone and reduced motion, including:
  - the story mid-drum;
  - the contact shelf after the knock;
  - the phone hero, with the headline and button above the 667px fold.
- The physics runs smoothly in a real browser (Chrome desktop, iPhone Safari): items settle and stop, and links stay clickable over the shelf.
- Ellie has looked at it locally and said go. Then it's published and checked live.
