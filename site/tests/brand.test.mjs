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
