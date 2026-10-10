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

import { glideStep } from "../src/components/drag.ts";

test("after letting go, the rail keeps gliding but slows down", () => {
  const next = glideStep(20);
  assert.ok(next > 0 && next < 20, `expected a smaller speed, got ${next}`);
  assert.equal(glideStep(-20) < 0, true);
});

test("the glide comes to a full stop instead of creeping forever", () => {
  let v = 30;
  let steps = 0;
  while (v !== 0 && steps < 500) { v = glideStep(v); steps++; }
  assert.equal(v, 0);
  assert.ok(steps < 200, `took ${steps} frames to stop`);
});
