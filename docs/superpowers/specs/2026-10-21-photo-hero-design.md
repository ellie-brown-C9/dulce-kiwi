# Round 5: full-bleed kitchen photo hero

Date: 2026-10-21
Branch: `homepage`
Builds on round 4 (`2026-10-11-round-4-design.md`).

**Status (2026-10-21): saved, not built, not launched.** Ellie approved the photo, header and hero from `final-preview-d3.html`, then asked to park it and come back later. What sits under the photo (§4) is a **stand-in**: she isn't sure about it, and it gets its own round together with the post-Mother's Day tidy-up.

## Why

The big, well-known bakery sites open on a large photo of the bakery (Levain, Lune, Mah-Ze-Dahr, The Model Bakery): you land and feel dropped into the kitchen. Ellie now has a candid kitchen shot and wants that feel. The photo isn't a styled product shot; it's a warm, low-light table mid-bake. It has to sit naturally with the site's graphic, funky look and never look like it came from another website. The photo is a background *for* the headline. It's not a random decorative image, and nothing should compete with it.

Ellie picked each piece below from mockups in the brainstorm companion (`.superpowers/brainstorm/262-1792612555/content/`, local only): `header-outlines-v2.html` (A1), `header-mobile.html` (M1), `hero-h2-v2.html`, `photo-edge-v2.html` (E1) and `open-questions.html` (1A), `darken.html` (D3) and `final-preview.html` (everything together, before D3). Copy doesn't change anywhere unless stated.

### Goals
- The first screen is the kitchen photo, edge to edge, with the header and headline laid over it.
- The header and headline get punchier (outlined letters) so they hold up over a busy photo.
- The photo's bottom edge looks deliberate and on-brand.

### Non-goals (this round)
- The post-Mother's Day tidy-up: the promo strip that used to sit above the header, and the About Me transition that feels too blended now that the Special is gone. Ellie wants to see how the page feels with the photo first, then do those as small changes.
- The menu page / occasion matcher (framework still being worked out; nothing built yet). A "Menú" link will join the header later.
- Video backgrounds.

### Anti-goals
- A solid colour band behind the header.
- Anything else on the photo competing with it: no buttons, circle stickers or badges.
- Text that gets lost on the bright glaze and meringue.

## 1. The photo

- **Source:** `instagram/shoot-oct17/raw/2026-10-17_16-59-09_IMG_1177.HEIC` (also in Downloads) (3024×4032, portrait, needs EXIF rotation). Convert to webp in `public/home/` like the other home photos, for example `kitchen-table.webp`. Builder decides the export sizes and quality; keep the files light.
- **Phones:** the full portrait shot, positioned at about `center 30%`.
- **Desktop:** the photo fills the width, cropped to a horizontal strip. The mockups used the band from 12% down the photo, 0.6× the width tall: the wooden boards on top, then the scones, alfajores and glaze drips. Whether that's a separate cropped export or `object-position` on the one image is the builder's call; the scones and alfajores must stay in view at common desktop sizes.
- **Height:** about one screen tall on phones and desktop (the mockups were viewport height). Builder settles exact min and max heights so the headline never collides with the header on short screens.
- **Darkening (Ellie and Martin picked D3 in `darken.html`):** a strong, even dim over the whole photo, `rgba(20,14,8,.42)`, so the header and headline stand out clearly. Keep the soft extra gradient at the top as well (about `rgba(20,16,10,.38)` fading to transparent at 32% down). The rounded corners must clip the dim too.
- **Bottom edge (E1):** big rounded bottom corners (56px desktop, about 36px phone) and a solid manteca drop underneath (`0 10px 0` desktop, `0 7px 0` phone), so the whole photo sits on the page like a giant sticker, matching the headline stickers and buttons. The top corners are square, flush with the top of the screen.
- Use `next/image` with `priority` (it's the LCP image) and a real Spanish alt text describing the table, in the style of the current hero alt.

## 2. Header over the photo (A1 desktop, M1 phones)

The header is laid over the top of the photo (not above it): no background, no band. It **scrolls away** with the page; it's not pinned. The structure (logo / three links / Pedir) and link targets stay as they are.

- **Logo:** `/brand/wordmark-stacked-cream.png` with a 2px forest outline traced around it and a manteca drop shadow offset about 3px right and 4px down (the mockups did this with stacked `drop-shadow` filters). Hover: scale about 1.06.
- **Links ("Mi horno · Mi historia · Cómo pedir"):** Fraunces 900 (SOFT 100, WONK 1), cream (`sheet`) fill with a thick forest outline traced around the letters (`-webkit-text-stroke` with `paint-order: stroke fill`, so the outline sits outside the fill and doesn't thin the letters). The links have **no shadow**, because Ellie found the yellow drop on the links unclear. They sit **dead straight** at rest. On hover/focus they grow (about 1.16×) with a very slight lean (about −1.2°) and a springy ease. Ellie said the lean must be "really, really subtle".
  - **Desktop sizes:** about 22–23px, stroke about 6px.
  - **Phones:** about 16px, stroke about 4.5px. The stroke scales down with the letters so small text stays crisp; this was the main problem in the first phone mockup.
- **Pedir (desktop only, as now):** terracotta pill with a 3px forest border and a `3px 3px 0` forest shadow. Hover: scale about 1.08.
- **Desktop layout:** the same three columns as round 4 (`1fr auto 1fr`).
- **Phone layout (M1):** the logo **centred** at the top (about 58–66px tall), and the three links on **one centred row** underneath. No Pedir in the header (unchanged from today).
- Keyboard focus must be visible on the outlined links (the hover growth can double as the focus style, plus an outline ring).
- Check `-webkit-text-stroke` + `paint-order` rendering in Safari/iOS and Firefox. If an engine paints the stroke over the fill, fall back to a stacked `text-shadow` outline.

## 3. What sits on the photo (H2, stripped back)

Only two things, low on the left (about 34px from the left edge, clear of the rounded corner):

- The eyebrow "Hecho a mano en Acassuso" in cream with a soft dark shadow so it reads.
- The headline "Repostería casera, como la de *antes.*" set big (about 66px desktop, 44px phone) in the same cream-fill, forest-outline style as the links (stroke about 9px desktop, 7px phone). "antes." is italic in **manteca** (not terracotta). Keep the existing word-by-word pop-in animation.

Removed from the hero: the "Pedime algo rico" button, the "Mirá lo que hago ↓" link, the "Siempre casero. Nunca apurado." circle and the blob-framed rogel photo.

## 4. Right under the photo

- Ellie's farm paragraph ("Soy Ellie. De chica vendía…", unchanged copy) on cream, with the bobbing kiwi badge (`/brand/badge-kiwi.png`, existing `animate-bob`) beside it on desktop and above it on phones.
- **My call:** a "— Ellie" sign-off under the paragraph in Fraunces italic, terracotta, so the paragraph reads as a note from her rather than leftover text. Easy to drop.
- Then the green Ticker, then Mi horno, as today.

## 5. Knock-on effects in the code

- **Floating WhatsApp pill on phones (Ellie picked 1A in `open-questions.html`):** it shows **from the start**, bottom-right over the photo, so phones can order from the first screen. Drop the `[data-hero-cta]` target and keep hiding it from `#contacto` down. Its existing look (forest pill, manteca shadow) stays.
- `shots.mjs` check 6: the h1 must be on the first 375×667 screen, and the floating pill must be **visible** there (the reverse of today's check). Remove the `[data-hero-cta]` part.
- **Promo strip:** Ellie said to leave it until there's another promo. Don't touch `PromoStrip` or its spot in `page.tsx` this round. Known consequence: if a promo goes live before it's redesigned, the yellow strip will sit above the photo and push it down.
- `Special` stays in the code (date-driven). If a promo is active it renders straight under the photo; it should still look sensible there.
- `/home/bake-crepe.webp` stays in use elsewhere if it's referenced elsewhere; otherwise leave the file, don't delete assets this round.

## Left to the builder

Exact image export sizes, breakpoints between the mockup sizes, the hero's min/max height, animation timing, and how the outline is implemented, as long as it looks like the A1 mockup in Chrome, Safari and Firefox.
