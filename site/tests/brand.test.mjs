import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

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

test("header is the split menu: logo centred between the links, no masthead stars", () => {
  assert.match(header, /md:grid-cols-\[1fr_auto_1fr\]/);
  assert.doesNotMatch(header, /✺/);
});

test("story photos are three equal arches on colour blocks", () => {
  for (const block of ["bg-manteca", "bg-terracotta", "bg-forest"]) {
    assert.ok(story.includes(`block: "${block}"`), `missing ${block} block`);
  }
  assert.doesNotMatch(story, /strokeDasharray/);
});

test("contacts are solid stickers, not cream labels with an overlapping disc", () => {
  assert.doesNotMatch(contact, /-left-7/);
  assert.match(contact, /bg-terracotta text-sheet/);
});

test("buttons speak as Ellie (first person), never about Ellie", () => {
  assert.doesNotMatch(components, /Pedíselo a Ellie|Escribile a Ellie/);
  assert.match(read("../src/components/Bakes.tsx"), /Pedímelo/);
});
