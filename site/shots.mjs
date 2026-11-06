// Visual + layout check of the homepage (and, with URL=…/menu, the menu page).
// Usage: node shots.mjs            (desktop 1440x900)
//        MOBILE=1 node shots.mjs   (phone 390x844)
//        REDUCED=1 node shots.mjs  (prefers-reduced-motion)
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const CHROME =
  process.env.CHROME ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
const URL = process.env.URL || "http://localhost:3000";
const MOBILE = process.env.MOBILE === "1";
const REDUCED = process.env.REDUCED === "1";
const WIDTH = Number(process.env.WIDTH) || (MOBILE ? 390 : 1440);
const OUT =
  process.env.OUT ||
  `shots/${MOBILE ? "phone" : "desktop"}${process.env.WIDTH ? `-${WIDTH}` : ""}${REDUCED ? "-reduced" : ""}`;
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  defaultViewport: MOBILE
    ? { width: WIDTH, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
    : { width: WIDTH, height: 900, deviceScaleFactor: 1 },
  args: ["--hide-scrollbars", "--force-color-profile=srgb"],
});
const page = await browser.newPage();
if (REDUCED) {
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
}
await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });

// Slow scroll so reveals and lazy images run, then back to top
await page.evaluate(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  for (let y = 0; y <= document.body.scrollHeight; y += 300) {
    window.scrollTo({ top: y, behavior: "instant" });
    await sleep(60);
  }
  window.scrollTo({ top: 0, behavior: "instant" });
  await sleep(800);
});

const problems = [];
// Checks 3–5 are about homepage sections; the menu page only gets the shared ones
const HOME = await page.evaluate(() => Boolean(document.getElementById("inicio")));

// 1. No sideways scrolling
// (compare with the set width: on phones the layout viewport widens to fit the page)
const sw = await page.evaluate(() => document.documentElement.scrollWidth);
if (sw > WIDTH) problems.push(`page scrolls sideways: scrollWidth ${sw} > ${WIDTH}`);

// 2a. At rest (top of page), sections further down are not left invisible,
//     so link previews, full-page captures and stalled timelines still show them
const hiddenAtRest = await page.evaluate(() =>
  [...document.querySelectorAll(".reveal")]
    .filter((el) => el.getBoundingClientRect().top > window.innerHeight)
    .filter((el) => Number(getComputedStyle(el).opacity) < 0.99)
    .map((el) => `hidden below the fold at rest: ${el.className.slice(0, 40)}…`),
);
problems.push(...hiddenAtRest);

// 2b. Every reveal ends fully visible once scrolled into view
const hidden = await page.evaluate(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const bad = [];
  for (const el of document.querySelectorAll(".reveal")) {
    el.scrollIntoView({ behavior: "instant", block: "center" });
    await sleep(250);
    const o = Number(getComputedStyle(el).opacity);
    if (o < 0.99) bad.push(`${el.className.slice(0, 40)}… opacity ${o}`);
  }
  window.scrollTo({ top: 0, behavior: "instant" });
  return bad;
});
problems.push(...hidden);

// 3. Motion: animates normally, and nothing animates with reduced motion
const animated = await page.evaluate(() =>
  [...document.querySelectorAll(".animate-tick, .animate-bob, .animate-pop")]
    .filter((el) => getComputedStyle(el).animationName !== "none")
    .map((el) => el.className.slice(0, 40)),
);
if (REDUCED && animated.length) {
  problems.push(`still animating with reduced motion: ${animated.join(", ")}`);
}
if (HOME && !REDUCED && !animated.length) {
  problems.push("no animations running (styles missing or stale?)");
}

// 4. Story drum: pinned with motion, a plain stack with reduced motion
const drum = await page.evaluate(() => Boolean(document.querySelector("#historia[data-drum]")));
if (REDUCED && drum) problems.push("story drum is pinned despite reduced motion");
if (HOME && !REDUCED && !drum) problems.push("story drum did not start");

// 5. Every visible contact link is really clickable (the pantry canvas must not cover them)
const blocked = await page.evaluate(async () => {
  document.getElementById("contacto")?.scrollIntoView({ behavior: "instant", block: "end" });
  await new Promise((r) => setTimeout(r, 400));
  return [...document.querySelectorAll("#contacto a")]
    .filter((a) => {
      const r = a.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) return false;
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return !(hit && a.contains(hit));
    })
    .map((a) => a.getAttribute("href"));
});
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await new Promise((r) => setTimeout(r, 600));
if (blocked.length) problems.push(`contact links covered: ${blocked.join(", ")}`);

// 6. Phones: the headline is on a 375x667 first screen, and the floating pill shows there
//    from the start (over the photo), so phones can order straight away
if (MOBILE) {
  const small = await browser.newPage();
  await small.setViewport({ width: 375, height: 667, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await small.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1500));
  const fold = await small.evaluate(() => ({
    h1: document.querySelector("#inicio h1")?.getBoundingClientRect().bottom ?? null,
    pill: Number(getComputedStyle(document.querySelector("[data-floating-wa]")).opacity),
  }));
  if (HOME && (fold.h1 === null || fold.h1 > 667)) problems.push(`headline not on the first screen: h1 bottom ${fold.h1}`);
  if (fold.pill < 0.99) problems.push(`floating pill not visible on the first screen (opacity ${fold.pill})`);
  await small.close();
}

// 7. Menu page on phones: once something is in the order, the pill steps aside and never overlaps the bar
if (MOBILE && !HOME) {
  const added = await page.evaluate(async () => {
    const btn = [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Agregar"));
    if (!btn) return false;
    btn.click();
    await new Promise((r) => setTimeout(r, 900));
    return true;
  });
  if (!added) problems.push("no '+ Agregar' button found on the menu page");
  const clash = await page.evaluate(() => {
    const pill = document.querySelector("[data-floating-wa]");
    const visible = Number(getComputedStyle(pill).opacity) > 0.01;
    const bar = document.querySelector("[data-order-bar]");
    const p = pill.getBoundingClientRect();
    const b = bar?.getBoundingClientRect();
    const overlap = b && p.bottom > b.top && p.top < b.bottom && p.right > b.left && p.left < b.right;
    return { visible, overlap: Boolean(overlap) };
  });
  if (clash.visible) problems.push("floating pill still shows while the order bar is up");
  if (clash.visible && clash.overlap) problems.push("floating pill overlaps the order bar");
  await page.screenshot({ path: `${OUT}/menu-order-bar.png` });
  // Empty the order again so the remaining screenshots are the plain page
  await page.evaluate(async () => {
    [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Agregado"))?.click();
    await new Promise((r) => setTimeout(r, 900));
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  const back = await page.evaluate(() => Number(getComputedStyle(document.querySelector("[data-floating-wa]")).opacity));
  if (back < 0.99) problems.push(`floating pill did not come back after emptying the order (opacity ${back})`);
}

// Screenshots: top of page, each section, full page
await new Promise((r) => setTimeout(r, 1200)); // let the hero pop-in finish
await page.screenshot({ path: `${OUT}/00-top.png` });
for (const id of ["inicio", "especial", "menu", "historia", "pedidos", "contacto"]) {
  const found = await page.evaluate((id) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "instant", block: "start" });
    return Boolean(el);
  }, id);
  if (!found) continue;
  // the contact shelf needs a moment for the opening knock to land
  await new Promise((r) => setTimeout(r, id === "contacto" ? 3500 : 700));
  await page.screenshot({ path: `${OUT}/sec-${id}.png` });
}
// The story half way through the drum
if (HOME && !REDUCED) {
  await page.evaluate(() => {
    const s = document.getElementById("historia");
    const top = s.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (s.offsetHeight - window.innerHeight) * 0.5, behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: `${OUT}/sec-historia-mid.png` });
}
await page.screenshot({ path: `${OUT}/full.png`, fullPage: true });
await browser.close();

if (problems.length) {
  console.error("PROBLEMS:\n- " + problems.join("\n- "));
  process.exit(1);
}
console.log("OK, no problems. Screenshots in", OUT);
