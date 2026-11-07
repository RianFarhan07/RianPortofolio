import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

// Page-wide motion budget for the home page.
// 1) Decorative loops never animate layout properties (that dirtied layout every frame, so every
//    scroll-position read — GSAP ScrollTrigger, the navbar — had to run a synchronous layout).
// 2) Sections pause their CSS loops while off-screen.
// 3) Result: scrolling no longer forces a layout on every scroll step.

const HOME_COMPONENTS = ["Hero3", "AboutPreview", "ProjectPreview", "CertificatesPreview", "ContactPreview2", "Footer", "Navbar"];
const LAYOUT_PROPERTY = /(^|[{;\s])(top|left|right|bottom|inset|width|height|min-height|max-height|margin(-[a-z]+)?|padding(-[a-z]+)?)\s*:/;

function keyframeBlocks(source) {
  const text = source.replace(/\$\{[^}]*\}/g, "X"); // template expressions would break brace matching
  const blocks = [];
  let at = text.indexOf("@keyframes");
  while (at !== -1) {
    const open = text.indexOf("{", at);
    let depth = 0;
    let end = open;
    for (; end < text.length; end += 1) {
      if (text[end] === "{") depth += 1;
      if (text[end] === "}" && --depth === 0) break;
    }
    blocks.push({ name: text.slice(at + "@keyframes".length, open).trim(), body: text.slice(open, end + 1) });
    at = text.indexOf("@keyframes", end);
  }
  return blocks;
}

test("home components never animate layout properties in CSS keyframes", () => {
  const offenders = [];
  for (const name of HOME_COMPONENTS) {
    const source = readFileSync(fileURLToPath(new URL(`../src/components/${name}.jsx`, import.meta.url)), "utf8");
    for (const block of keyframeBlocks(source)) {
      if (LAYOUT_PROPERTY.test(block.body)) offenders.push(`${name}: @keyframes ${block.name}`);
    }
  }
  expect(offenders, "keyframes that move layout properties (use transform instead)").toEqual([]);
});

async function openHome(page) {
  await page.addInitScript(() => {
    sessionStorage.setItem("rian-landing-intro-seen", "1");
    localStorage.setItem("theme", "dark");
  });
  await page.goto("/");
  await page.locator(".oj-story").waitFor({ state: "attached" });
  await page.evaluate(() => document.fonts.ready);
}

async function scrollToY(page, top) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), top);
  // let IntersectionObserver callbacks run
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 50)))));
}

const runningCssAnimations = (page, selector) =>
  page.evaluate(
    (sel) =>
      [...document.querySelectorAll(sel)]
        .flatMap((el) => el.getAnimations({ subtree: true }))
        .filter((a) => a instanceof CSSAnimation && a.playState === "running").length,
    selector,
  );

test("sections pause their CSS loops while off-screen and resume when they come back", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openHome(page);

  // middle of the orbit journey: hero, projects, certificates and footer are all off-screen
  const middle = await page.evaluate(() => {
    const story = document.querySelector(".oj-story");
    return story.getBoundingClientRect().top + window.scrollY + story.offsetHeight / 2;
  });
  await scrollToY(page, middle);
  await expect.poll(() => runningCssAnimations(page, "#home")).toBe(0);
  await expect.poll(() => runningCssAnimations(page, "#projects")).toBe(0);
  await expect.poll(() => runningCssAnimations(page, "#certificates")).toBe(0);
  await expect.poll(() => runningCssAnimations(page, "footer")).toBe(0);

  await scrollToY(page, 0);
  await expect.poll(() => runningCssAnimations(page, "#home")).toBeGreaterThan(0);

  await scrollToY(page, await page.evaluate(() => document.documentElement.scrollHeight));
  await expect.poll(() => runningCssAnimations(page, "footer")).toBeGreaterThan(0);
});

test("scrolling the home page no longer forces a synchronous layout on every step", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openHome(page);
  // the hero stats count up once after load (text changes every frame for ~2s); measure the steady state
  await expect(page.locator("#home")).toContainText("20+", { timeout: 10_000 });
  await expect(page.locator("#home")).toContainText("4+");
  await page.waitForTimeout(300);
  const client = await page.context().newCDPSession(page);
  const STEPS = 120;

  const forcedLayoutsWhileScrolling = async (from, to) => {
    await scrollToY(page, from);
    await page.waitForTimeout(300);
    const events = [];
    const collect = (e) => events.push(...e.value);
    client.on("Tracing.dataCollected", collect);
    const complete = new Promise((resolve) => client.once("Tracing.tracingComplete", resolve));
    await client.send("Tracing.start", {
      categories: "devtools.timeline,disabled-by-default-devtools.timeline.stack",
      transferMode: "ReportEvents",
    });
    await page.evaluate(
      async ({ start, end, steps }) => {
        for (let i = 1; i <= steps; i += 1) {
          window.scrollTo({ top: start + ((end - start) * i) / steps, behavior: "instant" });
          await new Promise((r) => requestAnimationFrame(r));
        }
      },
      { start: from, end: to, steps: STEPS },
    );
    await page.waitForTimeout(300);
    await client.send("Tracing.end");
    await complete;
    client.off("Tracing.dataCollected", collect);
    return events.filter((e) => e.name === "Layout" && e.args?.beginData?.stackTrace?.length).length;
  };

  const marks = await page.evaluate(() => {
    const top = (sel) => document.querySelector(sel).getBoundingClientRect().top + window.scrollY;
    return { story: top(".oj-story"), certificates: top("#certificates"), vh: window.innerHeight };
  });

  const hero = await forcedLayoutsWhileScrolling(0, Math.max(10, marks.story - marks.vh * 1.2));
  const certificates = await forcedLayoutsWhileScrolling(marks.certificates - marks.vh, marks.certificates + marks.vh);

  expect(hero, "forced layouts while scrolling the hero").toBeLessThanOrEqual(STEPS * 0.05);
  expect(certificates, "forced layouts while scrolling into the certificates").toBeLessThanOrEqual(STEPS * 0.05);
});
