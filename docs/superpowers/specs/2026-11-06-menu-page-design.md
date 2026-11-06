# Menu page + homepage menu teaser: design

Date: 2026-11-06 · Branch: `homepage` · Site: `site/` (Next.js, see `site/AGENTS.md`: read `node_modules/next/dist/docs/` before writing code).

## Intent

Ellie (Dulce Kiwi) gets orders by WhatsApp. Customers don't know what to order or how much to get ("dessert for a family lunch of 10", "something for merienda"). The site needs a real **menu page** with prices, plus a **matchmaker** that turns "what's it for + how many people" into fitting suggestions in the right size, and lets people pick items and send a pre-written WhatsApp order. The menu is framed as *ideas, not a fixed list*: she bakes anything on request.

Success: people arrive at WhatsApp already knowing what they want, with item, size and quantity written out; fewer "¿cuánto sale?" back-and-forths.

## Goals

- New page `/menu`: matchmaker at the top, full menu below (merienda first), pick-and-send ordering to WhatsApp.
- Homepage: replace the current "Para inspirarte / Lo que sale de mi horno" rail (`Bakes.tsx`) with a small teaser that starts the matchmaker and links to `/menu`.
- Every menu photo shown **with its real background** (no cutouts on the menu page).
- Menu content (items, prices, photos) easy to edit in one data file.

## Non-goals

- No payments, no checkout, no accounts, no stored orders. WhatsApp is the only order channel.
- No CMS. Edits happen in code.
- No "caja de merienda" product (bulk/special order only; covered by the closing card).
- Not deploying as part of this work; Ellie decides when it goes live (deploys are manual, `vercel deploy --prod` in `site/`).

## Anti-goals (a failure even if it works)

- Looks rustic, doodly or "template-y". Ellie wants polished editorial: Fraunces (`"SOFT" 100, "WONK" 1`, heavy weights) for headings, DM Sans body, brand palette from `globals.css` (forest, cream, sheet, manteca, terracotta).
- Showing a draft of the WhatsApp message on the page (she found it tacky).
- Pre-selecting items. Nothing is in the order until the customer adds it.
- Typing the "Dulce Kiwi" name in a font. The name only appears as the real logo file.
- Cutout product images on the menu page, or photos that look like they're from different worlds without at least a consistent grade.

## Approved look (mockups)

All in `.superpowers/brainstorm/975-1793972726/content/` (open the HTML in a browser; images load from `/files/` = that folder when served by the companion; otherwise open with that folder as root):

- **Menu page = `menu-a-select-2.html`** (the approved interaction). Background on picker style: `menu-a-pickers.html` option 1.
- **Homepage teaser = `home-menu-1.html` option 1** "La pregunta, en chiquito".
- Rejected for reference: B "panel" and C "carta" in `menu-page-1.html`; homepage options 2–4.

The mockups use cutouts in the cards; the build must use full photos with backgrounds instead (see Photos).

## Menu page (`/menu`), top to bottom

1. **Site header** (existing `Header`), with nav updated (see Homepage).
2. **Matchmaker sentence**, centred, big Fraunces 900: *"Es para una [merienda ▾] de [6 personas ▾]"*. Each bracket is a **yellow (manteca) pill** with a small round forest-green chevron, clearly tappable, opening a native select. Article switches "una/un" with the occasion. Under it: *"Contame y te digo qué llevar."*
   - Occasions: `merienda` (default), `postre para un almuerzo` (article "un"), `juntada`, `cumple` (article "un").
   - People: 2, 4, 6 (default), 8, 10, 12, 15, 20, 30.
   - Pre-fill from URL query (`?ocasion=…&personas=…`) so the homepage teaser can hand over the answers.
3. **Three suggestion cards** (photo, name, short description, quantity pill like "1 budín normal" / "2 docenas", price, "+ Agregar" button; banana card also shows its frosting choice). Below: *"Agregá lo que te guste y pedilo todo junto por WhatsApp."* and an underlined "Ver todo el menú ↓" anchor.
4. **Full menu**, grouped: **"Para la merienda"** (eyebrow "Lo más pedido") first, then **"Tortas y tartas"**. Card grid (3 cols desktop, 2 on phone). Each card: photo, name, description, price, Normal/Mini toggle where applicable (switches price), frosting choice where applicable, "+ Agregar".
5. **Closing card** (forest): *"¿No ves lo que buscás?"* / *"Este menú es para darte ideas. Puedo hacerte lo que se te antoje: escribime y lo armamos juntos."* / button *"Escribime por WhatsApp →"*.
6. **Order bar** (sticky bottom, see Ordering).

The existing floating WhatsApp button must not collide with the order bar (hide it on `/menu` while the bar is visible, or move it; builder's call).

## Matchmaker logic

- For an occasion, walk its priority list and take the first 3 items, **max one per kind** (kinds: budín, scone, roll, cookie [afghans/lamingtons], rogel, mini rogel, tarta).
  - merienda: banana, scones de queso, limón, cinnamon rolls, afghans, zanahoria, lamingtons, brownie
  - postre: lemon pie, frutillas, rogel, brownie, mini rogel
  - juntada: lamingtons, brownie, mini rogel, cinnamon rolls, scones de queso, afghans
  - cumple: rogel, lemon pie, mini rogel, frutillas, lamingtons
- Quantity: choose the smallest size whose servings ≥ people; if none, the largest size × ceil(people / servings).
- Servings used for matching: budín normal 8, mini 5; dozens of scones/afghans 8 (≈ 2 each for merienda); lamingtons and cinnamon rolls 12; mini rogel pair 2, box 12; rogel 15; lemon pie / frutillas 10.
- These lists and numbers are a first pass (Claude's call, not Ellie's); keep them in the data file so they're easy to tune.

## Ordering (pick and send)

- Nothing selected initially. "+ Agregar" on a suggestion adds it with the suggested size and quantity; on a menu card adds 1 of the currently toggled size with the current frosting choice. Added state: button reads "✓ Agregado" and the card gets a forest outline. Tapping again removes it.
- Same item + same size is one line; a different size is a separate line.
- When ≥1 thing is picked, a **forest order bar slides up**: "N cosas · Ver pedido" + total in manteca + manteca button "Pedir por WhatsApp →". "Ver pedido" expands a cream list above the bar: each line with −/+ quantity (− at 1 removes) and its price, then *"Las porciones y el total son aproximados. Lo confirmamos por WhatsApp."*
- Changing a frosting choice on a picked banana updates that line.
- **WhatsApp message** (number `CONTACT.whatsapp` in `data.ts`, via `whatsappLink`), opened only on button press, never previewed:
  ```
  ¡Hola Ellie! Vi el menú y quiero pedirte:
  • 1 budín de banana (normal, frosting de vainilla)
  • 1 docena de scones simples
  Es para una merienda de unas 6 personas. ¿Lo coordinamos?
  ```
  The last line uses the current matchmaker answers.
- **Nothing picked** (header "Pedir", closing card button): `¡Hola Ellie! Me gustaría hacerte un pedido.`
- Persisting the order across reloads is not required (builder may use sessionStorage if trivial).

**Order-state rules (Claude's calls after the builder check; Ellie didn't decide these):**
- Line key = item + size + frosting choice. One chocolate and one vanilla banana loaf are two lines. Changing the frosting toggle only affects what the *next* "+ Agregar" adds.
- Suggestion cards and menu cards share state: a card shows "✓ Agregado" whenever a line for that item + its currently shown size (+ choice) exists; tapping it removes that line.
- Adding from a suggestion uses the suggested quantity; if the line already exists, it's the same line (tap = remove). Changing the matchmaker answers later does **not** change quantities already in the order.
- The "Es para … de unas N personas" line goes in the message **only if the customer chose an occasion/people** (touched a select or arrived with the homepage query params). Otherwise the message is just the greeting + list + "¿Lo coordinamos?".
- Header "Pedir", the floating WhatsApp button and the closing card always send the plain message (`¡Hola Ellie! Me gustaría hacerte un pedido.`), on every page; the order bar is the only way to send a picked order. Order state stays local to `/menu`. Replace the current `WA_HELLO` text with this message.
- Tests: `tests/brand.test.mjs` checks that read `Bakes.tsx` may be rewritten to target the new teaser/menu components (keep the first-person-voice check), or removed where they test the old rail layout.

## Menu content (prices confirmed by Ellie, 2026-11-06; all portions approximate, mark "aprox.")

Argentine Spanish throughout. Prices formatted `$17.000`.

**Para la merienda**

| Item | Description (Spanish copy) | Sizes / price |
|---|---|---|
| Budín de banana | Con frosting de queso crema, de chocolate o de vainilla. Choice **Frosting: Chocolate / Vainilla** (Ellie: "chocolate cream cheese frosting or vanilla cream cheese frosting") | Normal (~8) $17.000 · Mini (~5) $10.000 |
| Budín de limón | Con glaseado de limón. | Normal $17.000 · Mini $10.000 |
| Budín brownie de chocolate amargo y nueces | Textura de brownie, con frosting de chocolate. ("brownie" is the flavour; never in brackets) | Normal $20.000 · Mini $11.000 |
| Budín de zanahoria | Con frosting de queso crema y nueces arriba. | Normal $17.000 · Mini $10.000 |
| Scones de queso | Bien queso, para comer calentitos con manteca. | Docena $15.000 |
| Scones simples | Como en Nueva Zelanda: para comer calentitos, con mermelada y crema. | Docena $12.000 |
| Scones de dátiles | Con dátiles, para comer calentitos con manteca. | Docena $15.000 |
| Cinnamon rolls | Masa tierna, canela y glaseado. | Docena $24.000 |
| Afghans | Un clásico de Nueva Zelanda: galletitas de chocolate con copos de maíz, glaseado de chocolate y una nuez arriba. Nadie sabe bien de dónde viene el nombre, pero allá no falta en ninguna lata de galletitas. | Docena $15.000 |
| Lamingtons con dulce de leche | Casi una tortita: bizcochuelo relleno de dulce de leche, bañado y cubierto de coco. Un clásico de Nueva Zelanda y Australia, con un toque argentino. | Docena $25.000 |

**Tortas y tartas**

| Item | Description | Sizes / price |
|---|---|---|
| Rogel de 14 capas | Catorce capas finitas con dulce de leche y merengue. Para 12 a 15 porciones grandes. ("14 capas" must be prominent) | Entero $60.000 |
| Mini rogel | Todo el rogel, en chiquito. | 2 unidades $10.000 · Caja de 12 $40.000 |
| Lemon pie | Base crocante, crema de limón y merengue. | Entera (~10) $55.000 |
| Tarta de frutillas | Con frutillas frescas. | Entera (~10, assumed) $50.000 |

Copy written by Claude and not yet signed off by Ellie: scone queso/dátiles lines, cinnamon rolls, mini rogel, lemon pie, frutillas, lamington wording (she wasn't sure if they're chocolate-dipped; current copy avoids saying). Keep all copy in the data file so she can tweak it.

## Photos (menu page: full photos, real backgrounds, no cutouts)

Ellie's rule: use the **board + plaster wall** shots wherever they exist; otherwise the existing nice photos, still with their backgrounds. Grade them to look like one set (warm, gentle contrast; prior grade approach in `instagram/` ffmpeg/`grade.py`). Source HEICs need converting (pillow-heif is available in Python).

| Item | Source |
|---|---|
| Afghans | shoot `instagram/shoot-oct17/raw` IMG_1075–1093 (board) |
| Scones de queso | IMG_1090–1103 (board) |
| Budín de limón | IMG_1113–1124 (board, glazed loaf) |
| Mini rogel | IMG_1125–1133 (board, meringue stacks) |
| Lamingtons | IMG_1134–1153 (board; IMG_1148 is her favourite) |
| Lemon pie | `~/Downloads/2026-10-31_14-07-04_IMG_1797.HEIC` (board; also `instagram/hero/lemon2-src.jpg`) |
| Budín de banana **and** Budín de zanahoria | `instagram/hero/zanahoria-foto.jpg` (two loaves on dark wood) — Ellie's explicit choice for both |
| Scones de dátiles | `instagram/hero/scones-foto.jpg` (tray, date + spoon) |
| Rogel de 14 capas | `instagram/graded2/IMG_4268.jpg` (alt `IMG_4407.jpg`) |
| Tarta de frutillas | `instagram/graded2/IMG_2134.jpg` |
| Budín brownie | Freeze frame from Ellie's video `~/Downloads/IMG_6785.MOV` at ~2.03 s (the loaf in its white box, from above). Saved as `~/Downloads/Dulce Kiwi - Menu fotos/budin-brownie-frame-original.jpg` (2160×3840). Ellie chose this over board composites. Crop to the loaf; grade lightly to match. |
| Scones simples, cinnamon rolls | **no photo yet**: text-only card that still looks finished (e.g. a cream panel with the name in Fraunces), easy to swap when photos arrive |

Pick the best frame in each range (sharp, well framed); Ellie may swap later. Export optimised web images into `site/public/menu/`.

## Launches together with the photo hero

Ellie wants this built and launched together with the parked **round 5 photo hero** (`docs/superpowers/specs/2026-10-21-photo-hero-design.md`), with these changes to that spec, approved 2026-11-06 from `.superpowers/brainstorm/975-1793972726/content/hero-plus-menu.html`:

- **§4 "Right under the photo" is replaced.** Under the photo comes the green Ticker, then the menu teaser below. The farm paragraph, kiwi badge and "— Ellie" sign-off are **not** added under the photo (her story stays in "Mi historia" as now).
- The first header link "Mi horno" becomes **"Menú" → `/menu`** in the outlined-link style.
- The hero has no buttons (as in round 5), so "Mirá lo que hago" goes away with the old hero; the menu entry points are the header link and the teaser.
- On `/menu` the header should still be readable: the outlined cream links are designed for the dark photo. On the cream menu page use a variant that reads on cream (e.g. forest letters, or the round 4 header styling) — builder's call, but it must look like the same family.

## Homepage changes

- Replace `Bakes` ("Para inspirarte") on the homepage with the **teaser** (mockup `home-menu-1.html` option 1): eyebrow "El menú", the same sentence with yellow-pill selects (*"Es para una [merienda] de [6 personas]"*), three bakes in a row (mockup used cutouts of scones, lemon pie, lamington; on the homepage cutouts are acceptable as in the mockup, but builder may use the photos if it looks better), primary button *"Ver qué te sugiero →"* → `/menu?ocasion=…&personas=…`, and a small underlined link *"o mirá todo el menú"* → `/menu#todo`.
- Page order: photo hero → Ticker → menu teaser → Story → HowToOrder → Contact (Special still renders under the photo when a promo is active).
- Header nav: the link that pointed to `#horno` becomes "Menú" → `/menu`. Header links to homepage anchors (`#historia`, `#pedidos`) must work from `/menu` too (`/#historia`).
- Already done (uncommitted): removed the line *"Sin carrito, sin precios fijos…"* from `HowToOrder.tsx`.
- `Bakes.tsx` / `BAKES` data can be deleted once nothing uses it.

## Constraints

- Phone first: most customers are on phones. Must work at 375px with no horizontal scroll; tap targets ≥ 44px.
- Existing tests in `site/tests/*.test.mjs` keep passing; add tests for the pure logic (suggestion picking, quantity maths, message text) in the same style.
- Accessible: selects are real `<select>`s (styled), buttons are buttons, order bar announced politely (aria-live) when it appears.

## Left to the builder

Component structure, client/server split, URL param names, animation details, how the floating WhatsApp button coexists with the order bar, image sizes/format, the text-only card styling, exact grade.
