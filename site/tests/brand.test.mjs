import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";

const read = (rel) => readFileSync(new URL(rel, import.meta.url), "utf8");
const css = read("../src/app/globals.css");
const components = readdirSync(new URL("../src/components/", import.meta.url))
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => read(`../src/components/${f}`))
  .join("\n");

test("the yellow is manteca #ffd164", () => {
  assert.match(css, /--color-manteca:\s*#ffd164/i);
});

test("no butter token or classes are left", () => {
  assert.doesNotMatch(css + components, /butter/);
});

const contact = read("../src/components/Contact.tsx");

test("footer does not repeat the menu", () => {
  assert.doesNotMatch(contact, /#horno|#historia|#pedidos/);
});

test("footer uses the round kiwi badge, not the stacked logo", () => {
  assert.match(contact, /\/brand\/badge-kiwi\.png/);
  assert.doesNotMatch(contact, /logo-stacked/);
});

test("contact labels speak in Ellie's voice", () => {
  for (const line of ["escribime por WhatsApp", "seguime en Instagram", "o mandame un mail"]) {
    assert.ok(contact.includes(line), `missing "${line}"`);
  }
});

const header = read("../src/components/Header.tsx");
const story = read("../src/components/Story.tsx");

test("header: logo far left, links centred, Pedir on the right", () => {
  assert.match(header, /md:grid-cols-\[1fr_auto_1fr\]/);
  assert.match(header, /md:justify-self-start/); // logo column
  assert.match(header, /md:justify-self-center/); // links column
  assert.match(header, /md:justify-self-end/); // Pedir pill
  assert.doesNotMatch(header, /col-span-3|border-y-2|✺/); // no phone ruled row, no stars
});

test("header links work from every page", () => {
  assert.match(header, /href="\/menu"/);
  assert.match(header, /href="\/#historia"/);
  assert.match(header, /href="\/#pedidos"/);
  assert.match(header, /href="\/"/);
  assert.doesNotMatch(header, /href="#/);
  assert.match(header, /WA_HELLO/);
});

test("header comes as the outlined photo version and a plain one for cream pages", () => {
  assert.match(header, /variant\?: "photo" \| "plain"/);
  assert.match(header, /wordmark-stacked-cream\.png/);
  assert.match(header, /wordmark-stacked-green\.png/);
  assert.match(header, /text-outline/);
  assert.match(read("../src/app/menu/page.tsx"), /<Header variant="plain" \/>/);
});

test("story photos are wobbly blobs with white borders, no colour blocks", () => {
  assert.match(story, /shape-blob/);
  assert.match(story, /border-white/);
  assert.doesNotMatch(story, /shape-arch|block:/);
});

test("story pins only while the drum runs and pops the six doodles", () => {
  assert.match(story, /data-drum/);
  assert.match(story, /useSyncExternalStore/);
  for (const name of ["sun", "sheep", "whisk", "muffin", "mate", "heart"]) {
    assert.ok(story.includes(`"${name}"`), `missing ${name}`);
  }
});

test("no arch shape is left anywhere", () => {
  assert.doesNotMatch(css + components, /shape-arch/);
});

test("contacts are solid stickers, not cream labels with an overlapping disc", () => {
  assert.doesNotMatch(contact, /-left-7/);
  assert.match(contact, /bg-terracotta text-sheet/);
});

test("buttons speak as Ellie (first person), never about Ellie", () => {
  assert.doesNotMatch(components, /Pedíselo a Ellie|Escribile a Ellie/);
  assert.match(read("../src/components/MenuTeaser.tsx"), /Ver más recomendaciones y el menú completo →/);
  assert.match(read("../src/components/data.ts"), /Me gustaría hacerte un pedido|HELLO_MESSAGE/);
});

const hero = read("../src/components/Hero.tsx");

test("hero is the full-bleed kitchen photo, loaded first, with phone and desktop crops", () => {
  assert.match(hero, /\/home\/kitchen-wide\.webp/);
  assert.match(hero, /\/home\/kitchen-tall\.webp/);
  assert.match(hero, /fetchPriority: "high"|priority|preload/);
  assert.doesNotMatch(hero, /shape-blob|shape-arch|bake-crepe/);
});

test("nothing competes with the photo: no buttons or links on it", () => {
  assert.doesNotMatch(hero, /<a[\s>]|<Link|<button|data-hero-cta/);
  assert.doesNotMatch(hero, /Pedime algo rico|Mirá lo que hago|Siempre casero/);
});

test("hero headline ends on a manteca 'antes.' in the outlined style", () => {
  const h1 = hero.slice(hero.indexOf("<h1"), hero.indexOf("</h1>"));
  assert.match(h1, /antes\./);
  assert.match(h1, /text-manteca/);
  assert.match(h1, /text-outline/);
});

test("photo dim, rounded bottom and manteca drop come from the approved look", () => {
  assert.match(hero, /rgba\(20,14,8,\.42\)|rgba\(20,\s*14,\s*8,\s*0?\.42\)/);
  assert.match(hero, /rounded-b-\[36px\]/);
  assert.match(hero, /md:rounded-b-\[56px\]/);
  assert.match(hero, /0_7px_0_var\(--color-manteca\)/);
  assert.match(hero, /md:shadow-\[0_10px_0_var\(--color-manteca\)\]/);
});

test("outlined letters keep their fill: the stroke is painted under it", () => {
  assert.match(css, /\.text-outline\s*\{[^}]*-webkit-text-stroke[^}]*paint-order:\s*stroke fill/);
});

const special = read("../src/components/Special.tsx");

test("special photo is the wobbly blob, popping out of the card on phones", () => {
  assert.match(special, /shape-blob/);
  assert.doesNotMatch(special, /shape-arch/);
  assert.match(special, /-mt-\[100px\]/);
});

test("special shows item details inline on desktop and as a small line on phones", () => {
  assert.match(special, /hidden md:inline/);
  assert.match(special, /md:hidden/);
});

test("all six About Me doodles exist", () => {
  const doodles = read("../src/components/Doodles.tsx");
  for (const name of ["sun", "sheep", "whisk", "muffin", "mate", "heart"]) {
    assert.match(doodles, new RegExp(`\\b${name}:`), `missing ${name}`);
  }
  assert.match(doodles, /aria-hidden="true"/);
});

test("contact has the pantry shelf behind it, on the footer line", () => {
  assert.match(contact, /<Pantry \/>/);
  assert.match(contact, /data-shelf/);
  assert.doesNotMatch(contact, /border-t border-cream\/20/); // the shelf replaces the line
});

test("pantry canvas never takes clicks and waits for the fonts", () => {
  const pantry = read("../src/components/Pantry.tsx");
  assert.match(pantry, /pointer-events-none/);
  assert.match(pantry, /aria-hidden="true"/);
  assert.match(pantry, /document\.fonts\.ready/);
});

// Every source file under src/, recursively
const allSource = (dir = new URL("../src/", import.meta.url)) =>
  readdirSync(dir).flatMap((f) => {
    const u = new URL(f, dir);
    if (statSync(u).isDirectory()) return allSource(new URL(`${f}/`, dir));
    return /\.(ts|tsx)$/.test(f) ? [readFileSync(u, "utf8")] : [];
  });

test("matter-js is only ever loaded on demand", () => {
  const src = allSource().join("\n");
  assert.doesNotMatch(src, /^import (?!type)[^\n]*from "matter-js"/m);
  assert.match(read("../src/components/Pantry.tsx"), /import\("matter-js"\)/);
});

test("pantry rebuilds for a new size and stays still with reduced motion", () => {
  const pantry = read("../src/components/Pantry.tsx");
  assert.match(pantry, /ResizeObserver/);
  assert.match(pantry, /prefers-reduced-motion: reduce/);
});

test("homepage teaser (version B) asks with chips and hands its answers to /menu", () => {
  const teaser = read("../src/components/MenuTeaser.tsx");
  assert.match(teaser, /^"use client"/);
  assert.match(teaser, /¿Qué estás <em[^>]*>armando\?<\/em>/);
  assert.match(teaser, /Ver más recomendaciones y el menú completo →/);
  assert.match(teaser, /href=\{href\}/);
  assert.match(teaser, /const href = `\/menu\?ocasion=\$\{occasion\}&personas=\$\{people\}`/);
  // four people chips, each a size the menu page understands
  for (const [label, n] of [["2 a 4", 4], ["5 a 8", 8], ["9 a 15", 15], ["16 o más", 20]]) {
    assert.ok(teaser.includes(`{ value: ${n}, label: "${label}" }`), `people chip ${label} → ${n}`);
  }
  assert.match(teaser, /aria-pressed=\{on\}/);
  assert.match(teaser, /min-h-11/);
  assert.match(teaser, /suggest\(occasion, people\)\.slice\(0, 2\)/);
  // the old sentence, cutouts and secondary link are gone
  assert.doesNotMatch(teaser, /Picker|o mirá todo el menú|teaser-.*\.webp|object-contain|drop-shadow/);
});

test("Cómo pedir is a left-aligned numbered path on phones, centred columns on desktop", () => {
  const how = read("../src/components/HowToOrder.tsx");
  assert.match(how, /before:border-dotted/);
  assert.match(how, /md:text-center/);
  assert.doesNotMatch(how, /className="bg-manteca px-6 py-24 text-center"/);
});

test("floating pill shows from the start and steps aside at contact and for the order bar", () => {
  const pill = read("../src/components/FloatingWhatsApp.tsx");
  assert.doesNotMatch(pill, /data-hero-cta/);
  assert.match(pill, /contacto/);
  assert.match(pill, /"dk:order"/);
  assert.match(pill, /data-floating-wa/);
  assert.match(pill, /useState\(false\)/); // visible at first
  assert.doesNotMatch(pill, /z-50/); // never above the order bar (z-40)
});

test("menu page sends orders through whatsappLink and never previews the message", () => {
  const client = read("../src/components/menu/MenuClient.tsx") + read("../src/components/menu/OrderBar.tsx");
  assert.match(client, /orderMessage\(/);
  assert.match(client, /whatsappLink\(/);
  assert.doesNotMatch(client, /bubble|preview/i);
});

test("menu cards use full photos, never cutouts", () => {
  assert.doesNotMatch(read("../src/components/menu/MenuCard.tsx"), /object-contain|drop-shadow/);
});

test("matchmaker pills are at least a 44px tap target", () => {
  const picker = read("../src/components/menu/Picker.tsx");
  assert.match(picker, /group relative inline-flex min-h-11/);
  assert.match(picker, /absolute inset-0 h-full w-full/);
});
