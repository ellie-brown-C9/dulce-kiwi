import { test } from "node:test";
import assert from "node:assert/strict";
import { ITEMS, GROUPS } from "../src/components/menu/items.ts";
import {
  HELLO_MESSAGE, formatPrice, planFor, suggest, quantityLabel, lineKey, addOrToggle, changeQty,
  orderTotal, lineText, orderMessage, parseMatchQuery, servingsNote,
} from "../src/components/menu/logic.ts";

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

test("every homepage people chip (4, 8, 15, 20) is a size the menu page accepts", () => {
  for (const n of [4, 8, 15, 20]) {
    assert.equal(parseMatchQuery({ ocasion: "merienda", personas: String(n) }).chosen, true);
  }
});

test("servings notes are marked approximate (aprox.)", () => {
  const by = (id) => ITEMS.find((i) => i.id === id);
  const banana = by("banana");
  assert.equal(servingsNote(banana, banana.sizes[0]), "rinde 8 aprox.");
  assert.equal(servingsNote(banana, banana.sizes[1]), "rinde 5 aprox.");
  assert.equal(servingsNote(by("lemon-pie"), by("lemon-pie").sizes[0]), "rinde 10 aprox.");
  assert.equal(servingsNote(by("rogel"), by("rogel").sizes[0]), "rinde 12 a 15 aprox.");
  assert.equal(servingsNote(by("afghans"), by("afghans").sizes[0]), "12 unidades");
  assert.equal(servingsNote(by("mini-rogel"), by("mini-rogel").sizes[0]), null);
});
