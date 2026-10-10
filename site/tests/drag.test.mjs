import { test } from "node:test";
import assert from "node:assert/strict";
import { isDrag } from "../src/components/drag.ts";

test("small wobbles of the mouse still count as a click", () => {
  assert.equal(isDrag(0), false);
  assert.equal(isDrag(4), false);
  assert.equal(isDrag(-4), false);
});

test("moving past the threshold either way is a drag", () => {
  assert.equal(isDrag(12), true);
  assert.equal(isDrag(-12), true);
});
