// The physics side of the pantry. Receives Matter as an argument, so it's never bundled up front.
import type MatterJS from "matter-js";
import { KNOCK_TARGETS, SIZES, capPush, shelfWalls, type ItemKind, type Kind } from "./shelf";
import { addDust, drawShelf, drawSprite, stepAndDrawDust, type Dust, type ShelfLayout, type Sprite } from "./art";

type Item = MatterJS.Body & { kind: Kind; home?: boolean; dropper?: boolean; hitDone?: boolean };

export function createPantry(M: typeof MatterJS, sprites: Record<Kind, Sprite>, layout: ShelfLayout) {
  const { Engine, Bodies, Body, Composite, Sleeping, Events, Query } = M;
  const engine = Engine.create({ enableSleeping: true });
  const items: Item[] = [];
  const dust: Dust[] = [];
  const pointer = { x: 0, y: 0, px: 0, py: 0, on: false };

  // Shelf top, plus invisible walls at the plank ends so nothing ends up floating past them
  const wall = { isStatic: true, friction: 0.8 };
  Composite.add(engine.world, [
    Bodies.rectangle(layout.width / 2, layout.floor + 50, layout.width * 2, 100, wall),
    ...shelfWalls(layout.plankX0, layout.plankX1).map((s) =>
      Bodies.rectangle(s.x, layout.height / 2, s.w, layout.height * 3, wall),
    ),
  ]);

  // The mouse is a small invisible ball that follows the pointer
  const hand = Bodies.circle(-500, -500, 18, { frictionAir: 0, inertia: Infinity, density: 0.005 });
  hand.sleepThreshold = Infinity;
  Composite.add(engine.world, hand);

  const add = (kind: Kind, x: number, y: number, angle = 0) => {
    const { w, h } = SIZES[kind];
    const b = Bodies.rectangle(x, y, w, h, {
      chamfer: { radius: 3 },
      friction: 0.7,
      frictionStatic: 0.9,
      restitution: 0.08,
      density: 0.0016,
    }) as Item;
    b.kind = kind;
    Body.setAngle(b, angle);
    Composite.add(engine.world, b);
    items.push(b);
    return b;
  };

  layout.row.forEach((k, i) => {
    const b = add(k, layout.centres[i], layout.floor - SIZES[k].h / 2);
    b.home = true;
    Sleeping.set(b, true);
  });

  // Whatever a drop hits first gets tipped over, so the opening knock always reads
  Events.on(engine, "collisionStart", (ev) => {
    for (const pair of ev.pairs) {
      const a = pair.bodyA as Item;
      const b = pair.bodyB as Item;
      const [d, o] = a.dropper ? [a, b] : b.dropper ? [b, a] : [null, null];
      if (!d || !o || d.hitDone || !o.home) continue;
      d.hitDone = true;
      Sleeping.set(o, false);
      Body.setAngularVelocity(o, 0.2);
      Body.setVelocity(o, { x: 4.5, y: -2.5 });
    }
  });

  const xOf = (k: ItemKind) => items.find((b) => b.kind === k)?.position.x ?? layout.width / 2;

  return {
    /** The opening knock: the manteca and the arándanos punnet fall onto the two tall targets. */
    drop() {
      const [first, second] = KNOCK_TARGETS;
      const butter = add("manteca", xOf(first) - 6, -40, -0.3);
      butter.dropper = true;
      Body.setVelocity(butter, { x: 1, y: 8 });
      const punnet = add("punnet", xOf(second) - 8, -260, 0.4);
      punnet.dropper = true;
      Body.setVelocity(punnet, { x: 1, y: 8 });
    },
    /** Mouse position relative to the section, or null when it leaves. */
    pointer(x: number | null, y = 0) {
      if (x === null) {
        pointer.on = false;
        return;
      }
      if (!pointer.on) {
        pointer.px = x;
        pointer.py = y;
      }
      pointer.x = x;
      pointer.y = y;
      pointer.on = true;
    },
    /** A tap or click flicks the item under it over, with a little puff of flour. */
    tap(x: number, y: number) {
      const hit = Query.point(items, { x, y })[0] as Item | undefined;
      if (hit) {
        const dir = x < hit.position.x ? 1 : -1;
        Sleeping.set(hit, false);
        Body.setAngularVelocity(hit, 0.22 * dir);
        Body.setVelocity(hit, { x: 4 * dir, y: -5 });
      }
      addDust(dust, x, y, hit ? 8 : 14, 2.2);
    },
    step() {
      if (pointer.on) {
        Body.setPosition(hand, { x: pointer.x, y: pointer.y });
        Body.setVelocity(hand, { x: capPush(pointer.x - pointer.px), y: capPush(pointer.y - pointer.py) });
      } else {
        Body.setPosition(hand, { x: -500, y: -500 });
        Body.setVelocity(hand, { x: 0, y: 0 });
      }
      pointer.px = pointer.x;
      pointer.py = pointer.y;
      Engine.update(engine, 1000 / 60);
      for (const b of items) {
        // Anything that somehow escapes drops back in from the top
        if (b.position.y > layout.height + 200) {
          Body.setPosition(b, { x: layout.width / 2, y: -60 });
          Body.setVelocity(b, { x: 0, y: 0 });
        }
        if (b.speed > 6 && Math.random() < 0.05) addDust(dust, b.position.x, b.position.y, 2, 1.2);
      }
    },
    draw(ctx: CanvasRenderingContext2D) {
      ctx.clearRect(0, 0, layout.width, layout.height);
      drawShelf(ctx, layout.plankX0, layout.plankX1, layout.floor);
      for (const b of items) drawSprite(ctx, sprites[b.kind], b.position.x, b.position.y, b.angle);
      stepAndDrawDust(ctx, dust);
    },
    destroy() {
      Events.off(engine, "collisionStart");
      Engine.clear(engine);
    },
  };
}

export type PantryWorld = ReturnType<typeof createPantry>;
