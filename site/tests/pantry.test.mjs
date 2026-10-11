import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DESKTOP_ROW, PHONE_ROW, KNOCK_TARGETS, SIZES, MIN_GAP,
  rowFor, fitRow, layoutRow, capPush, MAX_PUSH, shelfWalls,
} from "../src/components/pantry/shelf.ts";

test("every shelf item is different", () => {
  assert.equal(new Set(DESKTOP_ROW).size, 12);
  assert.equal(new Set(PHONE_ROW).size, PHONE_ROW.length);
});

test("the phone shelf is six of the desktop twelve", () => {
  assert.equal(PHONE_ROW.length, 6);
  assert.ok(PHONE_ROW.every((k) => DESKTOP_ROW.includes(k)));
});

test("the things that fall are never on the shelf, and what they hit always is", () => {
  for (const row of [DESKTOP_ROW, PHONE_ROW]) {
    assert.ok(!row.includes("manteca") && !row.includes("punnet"));
    for (const t of KNOCK_TARGETS) assert.ok(row.includes(t), `${t} missing`);
  }
});

test("phones get the short row, wider screens the full one", () => {
  assert.equal(rowFor(390), PHONE_ROW);
  assert.equal(rowFor(1200), DESKTOP_ROW);
});

test("on a 320px phone the row still fits on the shelf", () => {
  // contact section is 320 wide with 24px padding; plank overhangs 8, items inset 10
  const x0 = 24 - 8 + 10, x1 = 320 - 24 + 8 - 10;
  const row = fitRow(PHONE_ROW, x0, x1);
  const used = row.reduce((t, k) => t + SIZES[k].w, 0) + MIN_GAP * (row.length - 1);
  assert.ok(used <= x1 - x0, `needs ${used}px, has ${x1 - x0}px`);
  for (const t of KNOCK_TARGETS) assert.ok(row.includes(t));
});

test("a row that already fits is left alone", () => {
  assert.deepEqual(fitRow(DESKTOP_ROW, 100, 1300), DESKTOP_ROW);
});

test("items spread from one end of the shelf to the other with equal gaps", () => {
  const row = ["harina", "vainilla", "ddl"];
  const c = layoutRow(row, 100, 400);
  assert.equal(c[0] - SIZES.harina.w / 2, 100);
  assert.ok(Math.abs(c[2] + SIZES.ddl.w / 2 - 400) < 1e-9);
  const gap1 = c[1] - SIZES.vainilla.w / 2 - (c[0] + SIZES.harina.w / 2);
  const gap2 = c[2] - SIZES.ddl.w / 2 - (c[1] + SIZES.vainilla.w / 2);
  assert.ok(Math.abs(gap1 - gap2) < 1e-9);
});

test("invisible walls stand exactly at the plank ends, so nothing can be pushed off into mid-air", () => {
  const [left, right] = shelfWalls(100, 900);
  assert.equal(left.x + left.w / 2, 100); // inner face of the left wall
  assert.equal(right.x - right.w / 2, 900); // inner face of the right wall
});

test("a fast swipe pushes no harder than the cap", () => {
  assert.equal(capPush(80), MAX_PUSH);
  assert.equal(capPush(-80), -MAX_PUSH);
  assert.equal(capPush(3), 3);
});
