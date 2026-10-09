# Round 2: manteca yellow, masthead header, story timeline, jar-label contact

Date: 2026-10-09
Branch: `homepage`
Builds on: `docs/superpowers/specs/2026-10-09-homepage-restyle-design.md` (live on dulcekiwi.com)

## Goal

Four refinements Ellie asked for after the first restyle went live. Each choice was picked from visual mockups in the brainstorm companion (`.superpowers/brainstorm/2814-*/content/`, local and not committed). The overall direction stays the same: rustic with a funky, fresh modern touch, on-brand, and less "templatey".

## 1. Yellow → manteca `#ffd164`

- Replace butter `#f2c14e` with **manteca `#ffd164`** everywhere. Rename the token from `butter` to `manteca` (`--color-manteca`, so `bg-manteca`, `text-manteca`, etc.) to match Ellie's name for it. No `butter` class names remain.
- This covers the promo strip, stickers, ticker text, the Cómo pedir band, button shadows, link underlines, the quote card and the Special section accents.
- Contrast stays fine. Forest text on manteca is about 6:1. The existing rule still applies: never terracotta text on yellow.

## 2. Header: "shop-front masthead" (option C)

- The stacked wordmark **without the kiwi** (`/brand/wordmark-stacked-green.png`) sits centred on its own row, like a sign over a shop door. It replaces the horizontal wordmark in the header.
- Underneath, a centred menu row runs between two thin forest rules at 16% opacity: Esta semana ✺ Mi historia ✺ Cómo pedir ✺ [Pedir pill]. The ✺ separators are terracotta and decorative (`aria-hidden`).
- **Phone:** the logo is centred on top, and the three links share one row underneath (the row's width is split evenly between them), between the same rules. The Pedir pill is hidden on phones because the floating WhatsApp pill already covers it. No hamburger menu.
- The promo strip stays above the header while a promo is active.

## 3. Story photos: "then & now timeline" (option B)

- Replaces the Polaroid prints. The three photos run left to right in age order: **3 años** (Kumeu, NZ) → **8 años** (mis primeros muffins) → **hoy** (Acassuso).
  - The two childhood photos are circles with sheet-coloured borders. Today's photo is an arch (the same shape as the hero) and is wider (column ratio 1 : 1 : 1.4).
  - Under each photo: a forest pill with a manteca Fraunces label ("3 años" / "8 años" / "hoy"), and below it a small Fraunces italic caption.
  - A dotted wavy forest line at about 45% opacity runs behind the photos, linking them.
- The text column (eyebrow, heading, body, quote card, sign-off) is unchanged.
- **Phone:** the timeline stays one row of three, smaller, above the text. Captions wrap.
- Alt texts stay as they are.

## 4. Contact + footer: "jar labels" with the badge footer

- Keeps the current two-column layout: headline left, contacts right. It must not get taller than the current section.
- **Wavy top edge:** the section opens with the `Wave` shape in forest, rising out of the manteca Cómo pedir band, instead of a straight edge.
- **Headline:** unchanged copy. A hand-drawn manteca squiggle (SVG) underlines "mate en la mano."
- **Contacts become three "jar labels":** cream (`sheet`) pill-shaped cards, each slightly tilted (−2°, +1.5° with an 18px nudge right, −1°) with a small offset shadow.
  - Each label has a round icon sticker overlapping its left edge, with a forest ring: WhatsApp on manteca, Instagram on terracotta, mail on manteca.
  - Inside each label: a small Fraunces italic line in Ellie's voice, then the detail in bold Fraunces:
    - "escribime por WhatsApp" / "+54 9 11 2241-1701"
    - "seguime en Instagram" / "@dulce__kiwi"
    - "o mandame un mail" / "hola@dulcekiwi.com"
  - A small round forest arrow button (↗ in manteca) sits on the right of each label.
  - Each label links straight to WhatsApp / Instagram / mailto. The whole label is the link.
  - **Hover:** the label straightens and grows slightly, and the arrow turns 45°.
- The "Escribime por WhatsApp" button and the area line ("Acassuso · San Isidro · Zona Norte, Buenos Aires") are dropped, since the labels replace them.
- **Footer:** one slim row under a faint rule.
  - **Left:** the round **kiwi badge** (`/brand/badge-kiwi.png`, 72px, with a 3px manteca ring and tilted −8°) next to the "Un poquito de allá, un poquito de acá." tagline in manteca Fraunces italic.
  - **Right:** "Acassuso · San Isidro · Zona Norte · © 2026 Dulce Kiwi".
  - **No menu links in the footer.** The big stacked logo is removed from the footer. Its shorter replacement fixes the empty space on the right.
- **Phone:** the columns stack and the labels go full width. The footer row stacks, with the badge and tagline on top and the location and © underneath. It keeps the extra bottom padding for the floating WhatsApp pill.

## Unchanged

Hero, Special section, ticker, bakes, Cómo pedir content, the motion level, the promo logic, and all other copy.

## Done when

- `npm test`, `npm run lint` and `npm run build` pass.
- The `shots.mjs` checks pass on desktop, phone and reduced motion: no sideways scroll, nothing hidden at rest, animations off with reduced motion.
- No `butter` token or class names remain.
- Ellie has looked at it locally and said go. Then it's published to dulcekiwi.com and checked live.
