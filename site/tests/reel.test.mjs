import { test } from "node:test";
import assert from "node:assert/strict";
import { reelPosition, slideLook, drumAllowed, MIN_DRUM_HEIGHT } from "../src/components/reel.ts";

test("the reel starts on the first photo, ends on the last, and passes the middle at half way", () => {
  assert.equal(reelPosition(0), 0);
  assert.equal(reelPosition(0.5), 1);
  assert.equal(reelPosition(1), 2);
});

test("scroll outside the pinned stretch stays on the first or last photo", () => {
  assert.equal(reelPosition(-0.3), 0);
  assert.equal(reelPosition(1.7), 2);
});

test("the reel rests on each photo for a moment before moving on", () => {
  assert.equal(reelPosition(0.05), 0); // still resting on the first
  assert.equal(reelPosition(0.47), 1); // already settled on the second
  assert.equal(reelPosition(0.53), 1); // still resting on the second
});

test("the reel only ever moves forward as you scroll down", () => {
  let last = -1;
  for (let p = 0; p <= 1.0001; p += 0.01) {
    const pos = reelPosition(p);
    assert.ok(pos >= last, `went backwards at ${p.toFixed(2)}`);
    last = pos;
  }
});

test("the current slide is full size and straight at its resting tilt", () => {
  const look = slideLook(1, 1, 3.5);
  assert.deepEqual([look.scale, look.opacity, look.tilt, look.current], [1, 1, 3.5, true]);
});

test("a neighbouring slide is smaller, faded and swung further", () => {
  const prev = slideLook(0, 1, -4);
  assert.ok(Math.abs(prev.scale - 0.8) < 1e-9);
  assert.ok(Math.abs(prev.opacity - 0.25) < 1e-9);
  assert.equal(prev.tilt, -4 - 14);
  assert.equal(prev.current, false);
  assert.equal(prev.origin, "center bottom"); // shrinks towards the top as it leaves
  assert.equal(slideLook(2, 1, -2.5).origin, "center top");
});

test("the drum runs only with motion allowed and a tall enough screen", () => {
  assert.equal(drumAllowed({ reducedMotion: false, viewportHeight: 844 }), true);
  assert.equal(drumAllowed({ reducedMotion: true, viewportHeight: 844 }), false);
  assert.equal(drumAllowed({ reducedMotion: false, viewportHeight: 390 }), false); // landscape phone
  assert.equal(drumAllowed({ reducedMotion: false, viewportHeight: MIN_DRUM_HEIGHT }), true);
});
