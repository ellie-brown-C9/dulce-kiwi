# Round 3: split header, calmer bakes rail with drag, colour-block story photos, solid sticker contacts

Date: 2026-10-09
Branch: `homepage`
Builds on round 2 (`2026-10-09-round-2-design.md`), which is live.

Ellie picked each change below from mockups in the brainstorm companion (`.superpowers/brainstorm/3359-*/content/`, local only).

## 0. Yellow: no change

Stays **manteca `#ffd164`**. Ellie compared it with paler butter tones and picked it again. The live site was checked and shows `#ffd164`.

## 1. Header: back to "split menu" (round 2 option A)

- **Desktop (md and up):** one row, three columns.
  - **Left:** "Esta semana", "Mi historia".
  - **Centre:** the stacked wordmark without the kiwi (`/brand/wordmark-stacked-green.png`), linking to `#inicio`.
  - **Right:** "Cómo pedir" and the terracotta "Pedir" pill (WhatsApp).
  - The two outer columns take equal width, so the logo sits exactly in the middle.
- No ruled lines and no ✺ separators. The masthead treatment is removed.
- **Phone:** keep what works today, with no hamburger: the logo centred and the three links in one row underneath, with the Pedir pill hidden (the floating WhatsApp pill covers it). The thin rules above and below the phone link row stay, so the links read as a row.

## 2. Bakes rail ("Lo que salió del horno")

- **Only the photo tilts.** The blob photo and its manteca note pill tilt (odd cards −2.5°, even cards +2° and nudged down 10px) and straighten with a slight scale-up on hover, as now. The name, description and "Pedíselo a Ellie →" link underneath stay straight and don't move.
- The special-order card ("¿No está lo que buscás?") stays straight.
- **Click-and-drag scrolling (mouse):**
  - Press on the rail and drag sideways to scroll it.
  - Normal scrolling still works: trackpad, mouse wheel with shift, and touch swipe on phones.
  - While dragging, the cursor is `grabbing` and scroll-snap is paused. When you let go, it snaps to the nearest card again.
  - A drag doesn't count as a click, so letting go after dragging over a "Pedíselo a Ellie" link doesn't open WhatsApp. A plain click still works.
  - Touch input keeps native scrolling. The drag handling applies to mouse pointers only.

## 3. Story photos: "arches with a colour block" (option H)

- Replaces the round 2 timeline. There are **three arches at the same size** side by side, in age order: 3 años → 8 años → hoy.
  - The arch shape is the same as the hero (`shape-arch`), with an aspect ratio of about 3:4.2.
  - Behind each arch, a solid block of one brand colour in the same shape is offset 12px right and 12px down: 3 años **manteca**, 8 años **terracotta**, hoy **forest**.
- Under each photo: the forest age pill (manteca Fraunces text) and the small Fraunces italic caption ("Kumeu, NZ" / "mis primeros muffins" / "Acassuso"). There's no dotted connecting line.
- **Hover (gentle):** the photo lifts 6px up and left off its colour block, and the image inside eases in to scale 1.04. Both return on leave. Nothing is draggable or clickable, and both effects are off under reduced motion.
- The photos column is wider than before (column flex about 1.3 : 1 against the text), so the photos fill the left side.
- **Phone:** the three arches stay in one row with smaller pills, and captions wrap.

## 4. Contact: "solid colour stickers" (option 4)

- The cream jar labels are replaced by three solid stickers, each **only as wide as its content** (no empty space):
  - **WhatsApp:** manteca sticker, with the icon in a forest circle in manteca.
  - **Instagram:** terracotta sticker with sheet text, and the icon in a sheet circle in terracotta.
  - **Mail:** sheet sticker with forest text, and the icon in a manteca circle in forest.
- Inside each sticker: the icon circle (46px), then the small Fraunces italic voice line ("escribime por WhatsApp" / "seguime en Instagram" / "o mandame un mail") above the bold Fraunces detail, then a ↗ arrow.
- The stickers are tilted −3°, +2° (pushed 60px right) and −1.5° (pushed 20px right), stacked with an 18px gap, each with an offset shadow. The right-hand pushes apply only from `sm` up, so phones don't overflow.
- **Hover:** the sticker straightens and scales to 1.05, and the arrow turns 45°.
- Each sticker links straight to WhatsApp, Instagram or mailto.
- Unchanged: the headline with the squiggle, the lead text, the wavy top edge, and the round-badge footer.

## Unchanged

Promo strip, hero, Special, ticker, Cómo pedir, footer, motion level, and all copy.

## Done when

- `npm test`, `npm run lint` and `npm run build` pass. New tests cover:
  - the header layout (no masthead rules or stars on desktop);
  - the drag helper (a drag past the threshold suppresses the click);
  - the story using three equal arches with colour blocks.
- The `shots.mjs` checks pass on desktop, phone and reduced motion.
- Ellie has looked at it locally and said go, then it's published and checked live.
