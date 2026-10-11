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
  assert.match(read("../src/components/Bakes.tsx"), /Pedímelo/);
});

const hero = read("../src/components/Hero.tsx");

test("hero photo is the wobbly blob, not an arch", () => {
  assert.match(hero, /shape-blob/);
  assert.doesNotMatch(hero, /shape-arch/);
});

test("hero main button is marked for the floating pill", () => {
  assert.match(hero, /data-hero-cta/);
});

test("phone hero: headline sits on a cream sticker over the photo", () => {
  assert.match(hero, /-mt-\[70px\]/);
  assert.match(hero, /bg-sheet/);
  assert.match(hero, /md:bg-transparent/);
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

test("phone bakes rail shows only a thin sliver of the next card", () => {
  const bakes = read("../src/components/Bakes.tsx");
  assert.match(bakes, /basis-\[calc\(100vw-var\(--gutter\)-40px\)\]/);
  assert.match(bakes, /gap-4 sm:gap-8/);
});

test("Cómo pedir is a left-aligned numbered path on phones, centred columns on desktop", () => {
  const how = read("../src/components/HowToOrder.tsx");
  assert.match(how, /before:border-dotted/);
  assert.match(how, /md:text-center/);
  assert.doesNotMatch(how, /className="bg-manteca px-6 py-24 text-center"/);
});
