import { test } from "node:test";
import assert from "node:assert/strict";
import { getActivePromo, formatPromoEnd } from "../src/components/data.ts";

test("Mother's Day box is active on its first and last day", () => {
  assert.equal(getActivePromo("2026-10-07")?.id, "dia-de-la-madre-2026");
  assert.equal(getActivePromo("2026-10-15")?.id, "dia-de-la-madre-2026");
});

test("no promo outside the dates", () => {
  assert.equal(getActivePromo("2026-10-06"), undefined);
  assert.equal(getActivePromo("2026-10-16"), undefined);
});

test("active promo has the strip fields the new design needs", () => {
  const p = getActivePromo("2026-10-10");
  assert.equal(p?.stripLine, "solo 20 cajas");
  assert.equal(p?.nameHighlight, "de la Madre");
  assert.ok(p?.name.includes(p.nameHighlight));
});

test("end date is written the Argentine way", () => {
  assert.equal(formatPromoEnd("2026-10-15"), "15 de octubre");
  assert.equal(formatPromoEnd("2026-12-01"), "1 de diciembre");
});
