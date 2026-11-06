# Menu page + photo hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/menu` page (matchmaker + full menu + pick-and-send WhatsApp order), replace the homepage "Mi horno" rail with a small matchmaker teaser, and build the parked full-bleed kitchen-photo hero, all to launch together.

**Architecture:** Menu content and all order/suggestion maths live in two plain TypeScript modules (`menu/items.ts`, `menu/logic.ts`) that `node --test` can import directly, as `tests/promo.test.mjs` already does with `data.ts`. `/menu` is a server page wrapping one client component that holds the matchmaker answers and the order state. The homepage teaser shares the yellow-pill picker and hands its answers to `/menu` through query params.

**Tech Stack:** Next.js 16.2.9 (App Router, read `site/node_modules/next/dist/docs/` before writing code; `site/AGENTS.md` warns APIs differ), React 19, Tailwind 4 (`@theme` tokens in `globals.css`), `node --test`, puppeteer-core `shots.mjs`, Python + Pillow + pillow-heif for photos.

**Spec:** `docs/superpowers/specs/2026-11-06-menu-page-design.md` (primary) and `docs/superpowers/specs/2026-10-21-photo-hero-design.md` (hero, with its §4 superseded as the menu spec says). Read both.

## Global Constraints

- All customer-facing copy in Argentine Spanish, exactly as in the spec tables; prices formatted `$17.000` (dot thousands, no decimals); portions marked "aprox."
- Headings: Fraunces with `"SOFT" 100, "WONK" 1` (existing `.font-display`), weight 900; body DM Sans; only the `globals.css` palette (forest `#34503f`, cream `#f6ebd9`, sheet `#fff7ec`, manteca `#ffd164`, terracotta `#d9663b`, ink-soft `#5b4a3a`).
- Never type "Dulce Kiwi" as text in a font; the name appears only as the logo image (alt text is fine).
- Menu page photos: full photos with their real backgrounds, never cutouts.
- No pre-selected order items; no on-page preview of the WhatsApp message.
- WhatsApp only through `whatsappLink()` in `site/src/components/data.ts` (number `5491122411701`). Plain message: `¡Hola Ellie! Me gustaría hacerte un pedido.`
- Phone first: no horizontal scroll at 320–390px; tap targets ≥ 44px.
- Do **not** deploy. Do not push. Ellie checks locally first.
- Work on branch `homepage` in `C:\Users\elise\dulce-kiwi`; site code in `site/`. Run commands from `site/`.

## Review Focus

1. **Big groups** (20–30 people, e.g. cumple 30): quantities multiply (2 rogels, 3 docenas) and the label/message stay grammatical ("2 budines normales", "3 docenas de afghans"). Test in Task 1.
2. **Same item from a suggestion and from the menu grid**: one line, both cards show "✓ Agregado", tapping either removes it. Test in Task 1 (`addOrToggle`) and checked by hand in Task 3.
3. **Garbage query params** (`/menu?ocasion=pizza&personas=-3`) fall back to merienda / 6 and are not "chosen". Test in Task 1.
4. **Order bar vs floating WhatsApp pill and the closing card on phones**: nothing overlaps; the bar never hides the last menu card (page gets bottom padding while the bar shows). Checked in Task 5 shots.
5. **Outlined white header on the cream `/menu` page** must still be readable (variant), and header anchors from `/menu` go to `/#historia`, `/#pedidos`. Checked in Task 4/5.

---

### Task 1: Menu data and order logic

**Files:**
- Create: `site/src/components/menu/items.ts`
- Create: `site/src/components/menu/logic.ts`
- Test: `site/tests/menu.test.mjs`

**Interfaces:**
- Produces (`items.ts`):
  ```ts
  export type Size = { label: string; serves: number; price: number };
  export type Kind = "budin" | "scone" | "roll" | "cookie" | "rogel" | "minirogel" | "tarta";
  export type MenuItem = {
    id: string; group: "merienda" | "tortas"; kind: Kind; name: string; desc: string;
    photo: string | null;            // "/menu/<id>.webp" or null (text-only card)
    photoAlt: string;
    unit?: "docena";
    sizes: Size[];                   // first = default shown on the card
    choice?: { label: string; options: string[] };  // banana only
  };
  export type OccasionId = "merienda" | "postre" | "juntada" | "cumple";
  export const ITEMS: MenuItem[];
  export const OCCASIONS: Record<OccasionId, { label: string; article: "una" | "un"; order: string[] }>;
  export const PEOPLE: number[];     // [2, 4, 6, 8, 10, 12, 15, 20, 30]
  export const GROUPS: { id: "merienda" | "tortas"; title: string; eyebrow: string }[];
  ```
- Produces (`logic.ts`):
  ```ts
  export const HELLO_MESSAGE = "¡Hola Ellie! Me gustaría hacerte un pedido.";
  export function formatPrice(n: number): string;
  export function planFor(item: MenuItem, people: number): { size: Size; qty: number; total: number };
  export function suggest(occasion: OccasionId, people: number): MenuItem[];
  export function quantityLabel(item: MenuItem, size: Size, qty: number): string;
  export type OrderLine = { key: string; itemId: string; sizeLabel: string; choice?: string; qty: number };
  export function lineKey(itemId: string, sizeLabel: string, choice?: string): string;
  export function addOrToggle(lines: OrderLine[], line: Omit<OrderLine, "key">): OrderLine[];
  export function changeQty(lines: OrderLine[], key: string, delta: number): OrderLine[];
  export function orderTotal(lines: OrderLine[]): number;
  export function lineText(line: OrderLine): string;
  export function orderMessage(lines: OrderLine[], context: { occasion: OccasionId; people: number } | null): string;
  export function parseMatchQuery(q: { ocasion?: string; personas?: string }): { occasion: OccasionId; people: number; chosen: boolean };
  ```

Data values: the spec's two menu tables are the source of truth (names, descriptions, prices, sizes). Item ids: `banana, limon, brownie, zanahoria, scones-queso, scones-simples, scones-datiles, cinnamon-rolls, afghans, lamingtons, rogel, mini-rogel, lemon-pie, frutillas`. Size labels: budines `Normal`(serves 8)/`Mini`(5); dozens `Docena` (serves 8 for scones and afghans, 12 for lamingtons and cinnamon rolls); mini rogel `2 unidades`(2)/`Caja de 12`(12); rogel `Entero`(15); lemon pie and frutillas `Entera`(10). Banana `choice: { label: "Frosting", options: ["Chocolate", "Vainilla"] }`. Occasion orders and labels from the spec's "Matchmaker logic" (`postre` label `"postre para un almuerzo"`, article `"un"`; `cumple` article `"un"`). `photo: null` for `scones-simples` and `cinnamon-rolls`. GROUPS: `{merienda, "Para la merienda", "Lo más pedido"}`, `{tortas, "Tortas y tartas", "Para la mesa grande"}`.

- [ ] **Step 1: Write the failing tests** in `site/tests/menu.test.mjs` (import from `../src/components/menu/logic.ts` and `items.ts`):

```js
test("prices are written the Argentine way", () => {
  assert.equal(formatPrice(55000), "$55.000");
  assert.equal(formatPrice(10000), "$10.000");
});
test("every item has a price and a description; only plain scones and cinnamon rolls lack a photo", () => {
  assert.equal(ITEMS.length, 14);
  assert.deepEqual(ITEMS.filter((i) => !i.photo).map((i) => i.id).sort(), ["cinnamon-rolls", "scones-simples"]);
  assert.ok(ITEMS.every((i) => i.desc && i.sizes.every((s) => s.price > 0)));
});
test("merienda comes first and holds the budines, scones, rolls, afghans and lamingtons", () => {
  assert.equal(GROUPS[0].id, "merienda");
  assert.equal(ITEMS.filter((i) => i.group === "merienda").length, 10);
});
test("sizes follow the people", () => {
  const b = ITEMS.find((i) => i.id === "banana");
  assert.deepEqual(planFor(b, 4), { size: b.sizes.find((s) => s.label === "Mini"), qty: 1, total: 10000 });
  assert.equal(planFor(b, 6).size.label, "Normal");
  assert.deepEqual([planFor(b, 20).qty, planFor(b, 20).total], [3, 51000]);
  const pie = ITEMS.find((i) => i.id === "lemon-pie");
  assert.deepEqual([planFor(pie, 15).qty, planFor(pie, 15).total], [2, 110000]);
  const mini = ITEMS.find((i) => i.id === "mini-rogel");
  assert.equal(planFor(mini, 2).size.label, "2 unidades");
  assert.equal(planFor(mini, 8).size.label, "Caja de 12");
});
test("three suggestions, one per kind", () => {
  assert.deepEqual(suggest("merienda", 6).map((i) => i.id), ["banana", "scones-queso", "cinnamon-rolls"]);
  assert.deepEqual(suggest("postre", 10).map((i) => i.id), ["lemon-pie", "rogel", "brownie"]);
  assert.deepEqual(suggest("cumple", 15).map((i) => i.id), ["rogel", "lemon-pie", "mini-rogel"]);
});
test("quantity labels read naturally", () => {
  const by = (id) => ITEMS.find((i) => i.id === id);
  const b = by("banana");
  assert.equal(quantityLabel(b, b.sizes[0], 1), "1 budín normal");
  assert.equal(quantityLabel(b, b.sizes[0], 3), "3 budines normales");
  assert.equal(quantityLabel(b, b.sizes[1], 2), "2 budines mini");
  assert.equal(quantityLabel(by("afghans"), by("afghans").sizes[0], 3), "3 docenas");
  assert.equal(quantityLabel(by("mini-rogel"), by("mini-rogel").sizes[1], 1), "1 caja de 12");
});
test("adding the same item and size twice removes it; another size or frosting is its own line", () => {
  let o = addOrToggle([], { itemId: "banana", sizeLabel: "Normal", choice: "Chocolate", qty: 1 });
  o = addOrToggle(o, { itemId: "banana", sizeLabel: "Normal", choice: "Vainilla", qty: 1 });
  assert.equal(o.length, 2);
  o = addOrToggle(o, { itemId: "banana", sizeLabel: "Normal", choice: "Chocolate", qty: 2 });
  assert.equal(o.length, 1);
  assert.equal(changeQty(o, o[0].key, -1).length, 0);
});
test("order message lists only the picked items", () => {
  const o = [
    { key: lineKey("banana", "Normal", "Vainilla"), itemId: "banana", sizeLabel: "Normal", choice: "Vainilla", qty: 1 },
    { key: lineKey("scones-simples", "Docena"), itemId: "scones-simples", sizeLabel: "Docena", qty: 1 },
  ];
  assert.equal(orderTotal(o), 29000);
  assert.equal(
    orderMessage(o, { occasion: "merienda", people: 6 }),
    "¡Hola Ellie! Vi el menú y quiero pedirte:\n• 1 budín de banana (normal, frosting de vainilla)\n• 1 docena de scones simples\nEs para una merienda de unas 6 personas. ¿Lo coordinamos?",
  );
  assert.equal(
    orderMessage(o, null),
    "¡Hola Ellie! Vi el menú y quiero pedirte:\n• 1 budín de banana (normal, frosting de vainilla)\n• 1 docena de scones simples\n¿Lo coordinamos?",
  );
  assert.equal(orderMessage([], null), HELLO_MESSAGE);
});
test("line texts for the odd sizes", () => {
  const line = (itemId, sizeLabel, qty) => ({ key: lineKey(itemId, sizeLabel), itemId, sizeLabel, qty });
  assert.equal(lineText(line("mini-rogel", "2 unidades", 1)), "2 mini rogels");
  assert.equal(lineText(line("mini-rogel", "Caja de 12", 2)), "2 cajas de 12 mini rogels");
  assert.equal(lineText(line("afghans", "Docena", 3)), "3 docenas de afghans");
  assert.equal(lineText(line("lemon-pie", "Entera", 1)), "1 lemon pie");
  assert.equal(lineText(line("rogel", "Entero", 1)), "1 rogel de 14 capas");
  assert.equal(lineText(line("rogel", "Entero", 2)), "2 rogels de 14 capas");
  assert.equal(lineText(line("brownie", "Mini", 2)), "2 budines brownie de chocolate amargo y nueces (mini)");
});
test("query params from the homepage teaser, with fallbacks", () => {
  assert.deepEqual(parseMatchQuery({ ocasion: "cumple", personas: "15" }), { occasion: "cumple", people: 15, chosen: true });
  assert.deepEqual(parseMatchQuery({ ocasion: "pizza", personas: "-3" }), { occasion: "merienda", people: 6, chosen: false });
  assert.deepEqual(parseMatchQuery({}), { occasion: "merienda", people: 6, chosen: false });
});
```

- [ ] **Step 2: Run to verify it fails**
Run: `npm test` — Expected: FAIL, cannot find `menu/logic.ts`.

- [ ] **Step 3: Implement `items.ts`** with the spec's data and the values above.

- [ ] **Step 4: Implement `logic.ts`.** `planFor`: sizes sorted by `serves`; smallest with `serves >= people`, else largest × `Math.ceil(people / serves)`. `suggest`: walk `OCCASIONS[o].order`, skip a kind already taken, stop at 3. `parseMatchQuery`: unknown occasion or people not in `PEOPLE` → defaults and `chosen: false` (chosen only when both are valid). Budín line: `"<qty> budín|budines " + name minus "Budín " + " (" + size.toLowerCase() + (choice ? ", frosting de " + choice.toLowerCase() : "") + ")"`; "budines" plural as in the tests; prices for a line = size price × qty. Context sentence uses `article + " " + label` ("una merienda", "un postre para un almuerzo").

- [ ] **Step 5: Run tests**
Run: `npm test` — Expected: all menu tests PASS, existing tests still PASS.

- [ ] **Step 6: Commit**
```bash
git add site/src/components/menu/items.ts site/src/components/menu/logic.ts site/tests/menu.test.mjs
git commit -m "Menu data and order logic: suggestions, sizes, WhatsApp message"
```

### Task 2: Menu and hero photos

**Files:**
- Create: `site/scripts/menu_photos.py`
- Create: `site/public/menu/<id>.webp` for the 12 items with photos
- Create: `site/public/home/kitchen-wide.webp`, `site/public/home/kitchen-tall.webp`

**Interfaces:**
- Produces: files at exactly `/menu/<item id>.webp` (matches `ITEMS[].photo`) and `/home/kitchen-wide.webp`, `/home/kitchen-tall.webp`.

Sources are in the spec's Photos table (shoot HEICs are in `C:\Users\elise\dulce-kiwi\instagram\shoot-oct17\raw\`, named `2026-10-1x_..._IMG_NNNN.HEIC`; previews in `..\preview\NNNN.jpg` for choosing). Brownie: `C:\Users\elise\Downloads\Dulce Kiwi - Menu fotos\budin-brownie-frame-original.jpg`. Banana and zanahoria both use `instagram/hero/zanahoria-foto.jpg`. Kitchen hero: `instagram/shoot-oct17/raw/2026-10-17_16-59-09_IMG_1177.HEIC` (crops as in the hero spec §1; the approved mockup crops are `.superpowers/brainstorm/262-1792612555/content/kitchen-wide.jpg` / `kitchen-tall.jpg`).

- [ ] **Step 1: Pick frames.** For each shoot range, choose the sharpest, best-framed frame from the previews (Afghans 1075–1093, scones de queso 1090–1103, limón 1113–1124, mini rogel 1125–1133, lamingtons 1148 preferred). Record the chosen source path per id in a `SOURCES` dict at the top of the script.

- [ ] **Step 2: Write `menu_photos.py`**: open (pillow-heif registered, `ImageOps.exif_transpose`), crop to 4:5 around the bake (per-id crop box in `SOURCES`, fractions of the image), resize to 1200×1500, apply one shared grade (warm: R×1.03, B×0.95; gentle S-curve; keep backgrounds), save webp quality 80. Kitchen: wide 2400px long edge strip, tall 1200×1600, same grade, quality 78.

- [ ] **Step 3: Run and check**
Run: `python -I scripts/menu_photos.py` — Expected: 12 menu webps + 2 kitchen webps, each < 350 KB. Make a contact sheet (`scripts` may write it to the scratchpad) and look at it: every bake centred, uncut, backgrounds visible, colours consistent.

- [ ] **Step 4: Commit**
```bash
git add site/scripts/menu_photos.py site/public/menu site/public/home/kitchen-wide.webp site/public/home/kitchen-tall.webp
git commit -m "Menu and kitchen hero photos, one shared grade"
```

### Task 3: `/menu` page

**Files:**
- Create: `site/src/components/menu/Picker.tsx` (yellow pill select, shared)
- Create: `site/src/components/menu/MenuCard.tsx`
- Create: `site/src/components/menu/OrderBar.tsx`
- Create: `site/src/components/menu/MenuClient.tsx` (`"use client"`)
- Create: `site/src/app/menu/page.tsx`
- Modify: `site/tests/brand.test.mjs` (add menu checks)

**Interfaces:**
- Consumes: everything from Task 1; photos from Task 2.
- Produces:
  ```ts
  // Picker.tsx
  export default function Picker<T extends string | number>(props: {
    value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; ariaLabel: string;
  }): JSX.Element;   // native <select> stretched invisibly over a manteca pill with a round forest chevron
  // MenuClient.tsx
  export default function MenuClient(props: { initial: { occasion: OccasionId; people: number; chosen: boolean } }): JSX.Element;
  // page.tsx: async server component reading searchParams (check the Next 16 docs for the searchParams shape), calls parseMatchQuery, renders <Header variant="plain" />, <MenuClient />, <FloatingWhatsApp />.
  ```
- Emits a `window` CustomEvent `"dk:order"` with `detail: { count: number }` whenever the order changes (FloatingWhatsApp uses it in Task 5).

Layout, copy and behaviour follow the spec sections "Menu page", "Ordering" and the order-state rules; look at `.superpowers/brainstorm/975-1793972726/content/menu-a-select-2.html` for the approved look (but full photos, not cutouts, on cards). Full-menu wrapper gets `id="todo"`. Text-only card: sheet panel, the item name large in Fraunces 900 forest, a small "foto pronto" eyebrow is **not** wanted; just name + description, same height as photo cards. While the bar shows, the page gets bottom padding equal to the bar height. Bar: `aria-live="polite"` count text. Selecting an occasion/people sets `chosen = true`.

- [ ] **Step 1: Add failing source checks** to `tests/brand.test.mjs`:
```js
test("menu page sends orders through whatsappLink and never previews the message", () => {
  const client = read("../src/components/menu/MenuClient.tsx") + read("../src/components/menu/OrderBar.tsx");
  assert.match(client, /orderMessage\(/);
  assert.match(client, /whatsappLink\(/);
  assert.doesNotMatch(client, /bubble|preview/i);
});
test("menu cards use full photos, never cutouts", () => {
  assert.doesNotMatch(read("../src/components/menu/MenuCard.tsx"), /object-contain|drop-shadow/);
});
```
- [ ] **Step 2: Run** `npm test` — Expected: FAIL (files missing).
- [ ] **Step 3: Build Picker, MenuCard, OrderBar, MenuClient, page.tsx.**
- [ ] **Step 4: Run** `npm test` — Expected: PASS. Run `npm run dev`, open `http://localhost:3000/menu?ocasion=cumple&personas=15` at 390px and 1440px: sentence shows "Es para un cumple de 15 personas", suggestions rogel / lemon pie / mini rogel; add from a suggestion and the grid, change frosting, −/+ in "Ver pedido", press "Pedir por WhatsApp" and confirm the `wa.me` URL decodes to the expected message (log `decodeURIComponent` of the href); no horizontal scroll at 320px (`WIDTH=320 MOBILE=1`).
- [ ] **Step 5: Commit**
```bash
git add site/src/components/menu site/src/app/menu site/tests/brand.test.mjs
git commit -m "Menu page: matchmaker, full menu, pick-and-send WhatsApp order"
```

### Task 4: Homepage teaser replaces the bakes rail

**Files:**
- Create: `site/src/components/MenuTeaser.tsx` (`"use client"`)
- Modify: `site/src/app/page.tsx` (order: Hero, Special?, Ticker, MenuTeaser, Story, HowToOrder, Contact)
- Delete: `site/src/components/Bakes.tsx`; remove `BAKES` from `data.ts` if unused
- Modify: `site/tests/brand.test.mjs:73` and `:148` (Bakes checks), `site/shots.mjs` (section ids)
- Modify: `site/src/components/data.ts` (`WA_HELLO` text → `HELLO_MESSAGE`)

**Interfaces:**
- Consumes: `Picker`, `OCCASIONS`, `PEOPLE` (Tasks 1, 3).
- Produces: section `id="menu"`; button href `/menu?ocasion=<id>&personas=<n>`, link href `/menu#todo`.

Look: mockup `.superpowers/brainstorm/975-1793972726/content/hero-plus-menu.html` (below the ticker). Eyebrow "El menú", sentence with two Pickers (article una/un), three bakes in a row (cutouts allowed here: `instagram/hero/nz-scones.png`, `lemon2.png`, `nz-lamington.png` → export to `public/home/teaser-*.webp`), button "Ver qué te sugiero →", link "o mirá todo el menú".

- [ ] **Step 1: Update tests**: replace the `Bakes.tsx` "Pedímelo" assertion with `assert.match(read("../src/components/MenuTeaser.tsx"), /Ver qué te sugiero/)`; replace the phone rail test with `test("homepage teaser hands its answers to /menu", …)` asserting MenuTeaser matches `/\/menu\?ocasion=/` and `/\/menu#todo/`; add `assert.equal(WA_HELLO_TEXT, "¡Hola Ellie! Me gustaría hacerte un pedido.")` style check on `data.ts` (`/Me gustaría hacerte un pedido/`).
- [ ] **Step 2: Run** `npm test` — Expected: FAIL.
- [ ] **Step 3: Build MenuTeaser, wire page.tsx, delete Bakes, update WA_HELLO, update shots.mjs ids (`horno` → `menu`).**
- [ ] **Step 4: Run** `npm test` and `npm run lint` — Expected: PASS, no lint errors. Check in the browser that choosing "cumple / 15" then the button lands on `/menu` with those answers.
- [ ] **Step 5: Commit**
```bash
git add -A site/src site/tests site/shots.mjs site/public/home
git commit -m "Homepage: menu teaser replaces the bakes rail; plain hello message"
```

### Task 5: Photo hero, outlined header, floating pill

**Files:**
- Modify: `site/src/components/Hero.tsx` (rewrite per hero spec §1, §3)
- Modify: `site/src/components/Header.tsx` (add `variant: "photo" | "plain"`, default `"photo"`)
- Modify: `site/src/components/FloatingWhatsApp.tsx`
- Modify: `site/src/app/globals.css` (outline utility for text/logo)
- Modify: `site/tests/brand.test.mjs` (hero checks), `site/shots.mjs` (check 6)

**Interfaces:**
- Consumes: `/home/kitchen-wide.webp`, `/home/kitchen-tall.webp` (Task 2); `"dk:order"` event (Task 3).
- Produces: `<Header variant="photo" />` absolutely layered over the hero on `/`; `<Header variant="plain" />` on `/menu` (same structure, forest logo `/brand/wordmark-stacked-green.png`, forest outlined-style links readable on cream). Links: `Menú` → `/menu`, `Mi historia` → `/#historia`, `Cómo pedir` → `/#pedidos`; Pedir pill uses `whatsappLink(HELLO_MESSAGE)`.

Everything visual comes from the hero spec §1–§3 and §5 (dim `rgba(20,14,8,.42)` + top gradient, rounded bottom 56/36px with manteca drop 10/7px, outlined links 22–23px/6px stroke desktop and 16px/4.5px phone, headline 66/44px with 9/7px stroke, "antes." manteca, keep word pop-in; phone logo centred over one row of links; no buttons on the photo). Approved mockup: `.superpowers/brainstorm/975-1793972726/content/hero-plus-menu.html`. Image via `next/image` with `priority`; Spanish alt describing the table. FloatingWhatsApp: visible from the start on phones; hidden from `#contacto` down (as now) and while `dk:order` count > 0; drop `[data-hero-cta]`.

- [ ] **Step 1: Update tests**: replace "hero photo is the wobbly blob" with checks that Hero uses `kitchen-` images with `priority`, has no `<a` buttons, and the h1 contains "antes."; FloatingWhatsApp no longer references `data-hero-cta` and listens for `dk:order`.
- [ ] **Step 2: Run** `npm test` — Expected: FAIL.
- [ ] **Step 3: Implement Hero, Header variants, globals.css outline, FloatingWhatsApp.** If `paint-order` stroke renders over the fill in an engine, use the stacked `text-shadow` fallback from the hero spec §2.
- [ ] **Step 4: Update `shots.mjs` check 6** (h1 on first 375×667 screen; floating pill visible there) and run `npm run build`, then `npm start` and `node shots.mjs`, `MOBILE=1 node shots.mjs`, `WIDTH=320 MOBILE=1 node shots.mjs`, `URL=http://localhost:3000/menu MOBILE=1 node shots.mjs` — Expected: all checks pass, no sideways scroll; look at every screenshot (header readable on photo and on cream, order bar and pill never overlap).
- [ ] **Step 5: Commit**
```bash
git add -A site/src site/tests site/shots.mjs
git commit -m "Full-bleed kitchen photo hero with outlined header; Menú link; floating pill from the start"
```

### Task 6: Final check with Ellie (no deploy)

- [ ] **Step 1:** `npm test && npm run lint && npm run build` — Expected: all pass.
- [ ] **Step 2:** Run `npm start`, open `http://localhost:3000` and `/menu` for Ellie on her machine (desktop + phone width), and list every copy line Claude wrote that she hasn't signed off (spec "Copy written by Claude" list).
- [ ] **Step 3:** Stop. Deploy (`vercel deploy --prod` in `site/`) only after Ellie explicitly says to launch.
