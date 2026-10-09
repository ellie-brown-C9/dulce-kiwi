# Homepage restyle: "Retro-playful" direction

Date: 2026-10-09
Branch: `homepage`

## Goal

Make the Dulce Kiwi homepage look professionally designed, with a rustic feel and some funky, fresh modern touches, built around the new hand-lettered logo. This is a restyle, not a rebuild. The sections, copy, photos and WhatsApp ordering stay as they are.

Inspiration: fabrique.co.uk. We take its restraint (one big statement per section, a small palette, confident type), not its layout. Fabrique relies on film and photography, which Dulce Kiwi doesn't have much of yet, so here the personality comes from type, colour, shapes and the brand assets.

Ellie and her husband reviewed three mood sketches and both chose direction A ("Retro-playful"). Each decision below was picked from visual options in the brainstorm companion. The mood sketches are at https://claude.ai/artifact/62GHCAQRCJ1co9XswFYMy6.

## Decisions

### Colour: four colours, each with one job

| Token | Hex | Job |
|---|---|---|
| `forest` | `#34503f` | Main colour: headings, body text on light grounds, buttons, the ticker band, the contact section, the "¿No está lo que buscás?" card, small eyebrow labels and links |
| `cream` | `#f6ebd9` | Page background |
| `sheet` | `#fff7ec` | Lighter cream for the story section, photo borders and text on green |
| `butter` | `#f2c14e` | The "sunshine": stickers, ticker text, button shadows, link underlines, the Cómo pedir section, the quote card |
| `terracotta` | `#d9663b` | Used sparingly: only the italic highlight words in headlines and the header "Pedir" pill |

Supporting tones: `forest-dark` `#2a4033` for hover, and `ink-soft` `#5b4a3a` for secondary body text on cream.

These replace the current ~15 beige and brown tokens in `globals.css`. Walnut brown, honey, nutmeg, wheat, oat and linen all go.

### Type

- **Headlines:** Fraunces, with soft (`SOFT 100`) and wonky (`WONK 1`) axes, weights 800–900. Italic is used for highlight words.
- **Body:** DM Sans (already in use).
- **Remove Kalam (handwriting).** The logo is the only hand-lettered element. Every current Kalam use (notes, captions, the "Con cariño, Ellie" sign-off, small asides) moves to Fraunces italic.
- **Lora is replaced** by Fraunces.

### Motion: "Playful" level

- Hero headline words pop in with a small bounce, staggered, once on load.
- Kiwi badge sticker in the hero bobs gently on a loop.
- Ticker band scrolls continuously and slowly (~30s per loop).
- Bake cards sit slightly tilted, alternating, and straighten and scale up a little on hover.
- Buttons lift on hover and squish on press, using the offset butter shadow.
- Sections ease in once as they scroll into view. Content is visible at rest. Nothing waits at `opacity: 0` if JS fails.
- With `prefers-reduced-motion`, all of the above is disabled.

Ellie may want this toned down after living with it, so the motion settings should be easy to adjust in one place.

## Section by section

Mockup reference: `.superpowers/brainstorm/*/content/homepage-colours.html`, right-hand "Calmer colour roles" version. This file is local and not committed.

1. **Header:** horizontal wordmark (`/brand/wordmark-horizontal-green.png`) replaces the tall stacked logo. Nav links are in DM Sans semibold, with the terracotta "Pedir" pill on the right.
2. **Hero:**
   - Eyebrow "Hecho a mano en Acassuso" in small caps, forest.
   - Fraunces headline with "antes." in terracotta italic.
   - Intro paragraph, then a green button with butter shadow ("Pedime algo rico") and a butter-underlined link ("Qué hay esta semana ↓").
   - Rogel photo in an arch shape.
   - Kiwi circle badge (`/brand/badge-kiwi.png`) as a bobbing sticker overlapping the photo's lower-left edge.
   - "Siempre casero. Nunca apurado." on a round butter "sun" sticker at the photo's upper-right.
   - **Promo variant (Mother's Day etc.):** same layout. The promo photo goes in the arch and the price goes on the butter sun. The item list and scarcity line are restyled to match. The existing `getActivePromo()` date logic is unchanged.
3. **Ticker** (replaces `PromiseStrip`): a green band with wavy top and bottom edges. The four promises scroll in Fraunces italic butter, separated by cream ✺.
4. **Esta semana (bakes):**
   - Eyebrow, plus the Fraunces headline "Lo que salió *del horno*".
   - Horizontal rail of cards. Photos are in organic round "blob" shapes with sheet-coloured borders.
   - The `note` becomes a butter pill sticker.
   - Product names are in Fraunces. The links are forest with a butter underline.
   - The special-order card is a forest block with a butter "Contame" button.
5. **Mi historia:** sheet background. The three photo prints stay, with captions in Fraunces italic. The quote goes on a butter card, slightly rotated. The "Con cariño, Ellie" sign-off is in Fraunces italic, forest.
6. **Cómo pedir:** full butter section. The three steps get big forest numbered circles. Numbering is meaningful here because it's a real sequence. The footer line is in Fraunces italic.
7. **Contacto and footer:** forest background instead of walnut. The eyebrow is butter here, since forest on forest wouldn't show. Headline in sheet with a butter italic highlight, a sheet button and contact rows. Footer has the cream stacked logo and the "Un poquito de allá, un poquito de acá." line.
8. **Floating WhatsApp pill (phones):** forest with a butter offset shadow, matching the buttons.

## Responsive

The mockups are desktop. On phones:
- The hero stacks with the photo above the text, as today.
- The bakes rail stays horizontally scrollable.
- Story prints stack above the text.
- Steps stack into one column.
- Contact stacks.
- Sticker sizes scale down, and stickers must not cover faces or key text.

## Implementation notes

- Next.js 16 in this repo differs from older versions. Read `site/node_modules/next/dist/docs/` before changing fonts or metadata (per `site/AGENTS.md`).
- Load fonts with `next/font/google`: Fraunces with the `SOFT` and `WONK` axes plus italic, and DM Sans. Remove Lora and Kalam.
- Define colour and font tokens in `globals.css` `@theme`, and change components to use them. No hard-coded hex values in components.
- Arch, blob, wave and sticker shapes: reusable CSS utilities or small components (for example `Wave`, `Sticker`). Don't copy them into each section.
- Motion: CSS keyframes for the looping effects (ticker, bob). Scroll-in and the headline pop can use the already-installed `motion` package, or CSS plus `IntersectionObserver`. Choose whichever keeps components simplest.
- Keep all copy and data in `data.ts` and the components as they are. This is a styling change.
- Remove old brand files that are no longer used (`logo.svg`, `logo-green.svg`, `kiwi.svg`, with the old right-facing kiwi) once nothing references them.

## Also shipping with this work (already done, uncommitted)

- Favicon and Apple icon flipped so the kiwi faces left.
- New social preview image: forest panel with the cream stacked logo, and the rogel photo.
- Logo variants cut from the brand sheet into `site/public/brand/`: horizontal and stacked wordmarks, kiwi alone, and two circle badges.

## Out of scope

- New pages, online ordering or a cart, new copy, new photography.
- Deploying. Nothing goes live until Ellie has reviewed the restyled site locally and says so.

## Done when

- The homepage on the local dev server matches the agreed mockup direction at desktop and phone widths.
- `npm run build` and `npm run lint` pass.
- Ellie has reviewed it in the browser and approved it.
