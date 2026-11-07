import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import { NODE_PATHS, chapterScrollProgress, getOrbitState } from "../src/lib/orbitJourneyModel.js";

// Home page "About" section: scroll-driven orbit journey (replaces the portrait card).
// Assertions read what the browser actually renders (computed opacity / transform),
// and wait for the eased motion to come to rest before measuring.

const CHAPTERS = ["Interface", "Systems", "Resilience", "Ecosystem"];

async function openHome(page, { theme, reducedMotion } = {}) {
  if (reducedMotion) await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript((savedTheme) => {
    sessionStorage.setItem("rian-landing-intro-seen", "1");
    if (savedTheme) localStorage.setItem("theme", savedTheme);
  }, theme);
  await page.goto("/");
  await page.locator(".oj-story").waitFor({ state: "attached" });
}

const frames = (page, n = 2) =>
  page.evaluate(
    (count) =>
      new Promise((resolve) => {
        let left = count;
        const step = () => (--left <= 0 ? resolve() : requestAnimationFrame(step));
        requestAnimationFrame(step);
      }),
    n,
  );

async function settle(page) {
  await page.waitForFunction(() => document.querySelector(".oj-story")?.dataset.motion === "idle", null, {
    timeout: 6_000,
  });
}

/* Scroll so the pinned story is at `progress` (0..1), then let the motion rest. */
async function scrollStory(page, progress) {
  await page.evaluate((p) => {
    const story = document.querySelector(".oj-story");
    const range = story.offsetHeight - window.innerHeight;
    window.scrollTo({ top: story.getBoundingClientRect().top + window.scrollY + range * p, behavior: "instant" });
  }, progress);
  await frames(page);
  await settle(page);
}

/* Scroll so the story is rising into view: approach 0 = its top at the viewport bottom, 1 = pinned. */
async function scrollApproach(page, approach) {
  await page.evaluate((a) => {
    const story = document.querySelector(".oj-story");
    const top = story.getBoundingClientRect().top + window.scrollY - (1 - a) * window.innerHeight;
    window.scrollTo({ top, behavior: "instant" });
  }, approach);
  await frames(page);
  await settle(page);
}

const rendered = (page, selector, index = 0) =>
  page
    .locator(selector)
    .nth(index)
    .evaluate((el) => {
      const cs = getComputedStyle(el);
      const m = new DOMMatrixReadOnly(cs.transform === "none" ? undefined : cs.transform);
      return {
        opacity: Number(cs.opacity),
        angle: (Math.atan2(m.b, m.a) * 180) / Math.PI,
        scale: Math.hypot(m.a, m.b),
        tx: m.e,
        ty: m.f,
        transform: cs.transform,
      };
    });

const wordOpacities = (page) =>
  page.locator(".oj-word").evaluateAll((words) => words.map((w) => Number(getComputedStyle(w).opacity)));

const normalizeAngle = (deg) => ((((deg % 360) + 540) % 360) - 180);

test("component stylesheet is well formed (balanced braces, nothing nested deeper than @media)", () => {
  const source = readFileSync(fileURLToPath(new URL("../src/components/AboutPreview.jsx", import.meta.url)), "utf8");
  const css = source.match(/const css = `([\s\S]*?)`;/)?.[1];
  expect(css, "stylesheet constant found").toBeTruthy();
  let depth = 0;
  let deepest = 0;
  for (const char of css) {
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    expect(depth, "closing brace without an opening one").toBeGreaterThanOrEqual(0);
    deepest = Math.max(deepest, depth);
  }
  expect(depth, "unclosed rule").toBe(0);
  expect(deepest, "a rule is nested inside another rule").toBeLessThanOrEqual(2);
});

test("portrait card is replaced by the orbit journey inside #about", async ({ page }) => {
  await openHome(page);
  const about = page.locator("section#about");

  await expect(about).toHaveAttribute("aria-labelledby", "about-preview-title");
  await expect(about.locator('img[src*="foto-nobg-editorial-natural"]')).toHaveCount(0);
  await expect(about.locator("img")).toHaveCount(0);

  const title = about.locator("#about-preview-title");
  await expect(title).toHaveText("I build from the interface to the system behind it.");
  await expect(title.locator(".oj-word")).toHaveCount(10);
  await expect(about.locator("[data-node]")).toHaveCount(4);
  // the nav is visibility:hidden until the orbit has formed, so role queries would skip it here
  await expect(about.locator(".oj-nav button")).toHaveText(CHAPTERS);
});

test("the stage stays pinned while the page scrolls through the journey", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openHome(page);

  for (const p of [0.05, 0.3, 0.6, 0.95]) {
    await scrollStory(page, p);
    const top = await page.locator(".oj-stage").evaluate((el) => Math.round(el.getBoundingClientRect().top));
    expect(top, `stage top at progress ${p}`).toBe(0);
  }
  await page.evaluate(() => {
    const closing = document.querySelector(".oj-closing");
    window.scrollTo({ top: closing.getBoundingClientRect().top + window.scrollY + 1, behavior: "instant" });
  });
  await frames(page);
  const released = await page.locator(".oj-stage").evaluate((el) => el.getBoundingClientRect().bottom);
  expect(released).toBeLessThanOrEqual(0);
});

test("headline flies in while the section rises into view, so the entrance is always seen", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openHome(page);

  await scrollApproach(page, 0.1); // the stage has barely appeared
  expect((await wordOpacities(page)).every((o) => o === 0)).toBe(true);

  await scrollApproach(page, 0.6); // headline is crossing into the viewport
  const mid = await wordOpacities(page);
  expect(mid[0]).toBeGreaterThan(0);
  expect(mid[9]).toBeLessThan(1);
  const titleTop = await page.locator(".oj-title").evaluate((el) => el.getBoundingClientRect().top);
  expect(titleTop, "the words are moving while the title is on screen").toBeLessThan(900);
  const midTransform = (await rendered(page, ".oj-word", 4)).transform;
  expect(midTransform).not.toBe("none");

  await scrollStory(page, 0); // pinned: fully assembled, at rest
  expect((await wordOpacities(page)).every((o) => o === 1)).toBe(true);
  const assembled = await rendered(page, ".oj-word", 4);
  expect(Math.abs(assembled.tx) + Math.abs(assembled.ty)).toBeLessThan(0.5);
  expect(assembled.scale).toBeCloseTo(1, 3);

  // scrolling back up sends the words back out along the same path
  await scrollApproach(page, 0.6);
  expect((await rendered(page, ".oj-word", 4)).transform).toBe(midTransform);
});

test("headline holds, then disperses with scroll and returns on the way back", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openHome(page);

  await scrollStory(page, 0.02); // hold
  expect((await rendered(page, ".oj-word")).opacity).toBe(1);

  await scrollStory(page, 0.12);
  const half = await rendered(page, ".oj-word");
  expect(half.opacity).toBeGreaterThan(0.05);
  expect(half.opacity).toBeLessThan(0.95);

  await scrollStory(page, 0.3);
  expect((await rendered(page, ".oj-word")).opacity).toBe(0);

  await scrollStory(page, 0.12);
  expect((await rendered(page, ".oj-word")).transform).toBe(half.transform); // reversible, exact
});

test("centre point, rings and nodes appear in order", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openHome(page);

  await scrollStory(page, 0.255);
  expect((await rendered(page, ".oj-seed")).opacity).toBeGreaterThan(0.9);
  expect((await rendered(page, ".oj-core-label")).opacity).toBe(0); // no text under the pulsing dot
  expect((await rendered(page, ".oj-r1")).opacity).toBe(0);

  await scrollStory(page, 0.4); // inner ring done, nodes not started
  expect((await rendered(page, ".oj-core")).opacity).toBe(1);
  expect((await rendered(page, ".oj-r1")).opacity).toBe(1);
  const before = await page.locator("[data-node]").evaluateAll((nodes) => nodes.map((n) => Number(getComputedStyle(n).opacity)));
  expect(before).toEqual([0, 0, 0, 0]);

  await scrollStory(page, 0.5); // nodes arrive one after another
  const arriving = await page.locator("[data-node]").evaluateAll((nodes) => nodes.map((n) => Number(getComputedStyle(n).opacity)));
  expect(arriving[0]).toBeGreaterThan(0);
  expect(arriving[0]).toBeGreaterThan(arriving[3]);

  await scrollStory(page, 0.62);
  for (let i = 0; i < 4; i += 1) {
    const node = await rendered(page, "[data-node]", i);
    expect(node.opacity).toBe(1);
    expect(node.scale).toBeCloseTo(1, 3);
  }
});

test("chapters follow scroll in both directions and expose aria-current", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openHome(page);
  const copy = page.locator(".oj-copy");

  const visit = async (order) => {
    for (const i of order) {
      await scrollStory(page, chapterScrollProgress(i));
      await expect(copy).toContainText(`Chapter 0${i + 1}`);
      await expect(page.locator("[data-node]").nth(i)).toHaveClass(/is-active/);
      await expect(page.locator(".oj-nav button").nth(i)).toHaveAttribute("aria-current", "step");
      await expect(page.locator(".oj-nav button[aria-current]")).toHaveCount(1);
      const angle = (await rendered(page, ".oj-system")).angle;
      const expected = getOrbitState(chapterScrollProgress(i)).rotation;
      expect(normalizeAngle(angle)).toBeCloseTo(normalizeAngle(expected), 1);
    }
  };
  await visit([0, 1, 2, 3]);
  await visit([3, 2, 1, 0]);

  for (const p of [0.9, 0.2, 0.75, 0.05, 0.85]) await scrollStory(page, p);
  await scrollStory(page, chapterScrollProgress(1));
  await expect(copy).toContainText("Chapter 02");
  await expect(page.locator("[data-node].is-active")).toHaveCount(1);
});

test("chapter navigation jumps to the chosen chapter", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openHome(page);
  await scrollStory(page, 0.7);

  await page.getByRole("button", { name: "Resilience", exact: true }).click();
  await expect(page.locator(".oj-copy")).toContainText("Chapter 03", { timeout: 6_000 });
  await expect(page.getByRole("button", { name: "Resilience", exact: true })).toHaveAttribute("aria-current", "step");
});

test("motion eases into a new position instead of jumping, then comes to rest", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openHome(page);
  await scrollStory(page, 0.29);

  const sample = await page.evaluate(async () => {
    const story = document.querySelector(".oj-story");
    const range = story.offsetHeight - window.innerHeight;
    window.scrollTo({ top: story.getBoundingClientRect().top + window.scrollY + range * 0.48, behavior: "instant" });
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    return {
      motion: story.dataset.motion,
      ring: Number(getComputedStyle(document.querySelector(".oj-r1")).opacity),
    };
  });
  expect(sample.motion).toBe("moving");
  expect(sample.ring).toBeLessThan(1); // still easing toward its target

  await settle(page);
  expect((await rendered(page, ".oj-r1")).opacity).toBe(1);
  expect((await rendered(page, ".oj-r3")).opacity).toBe(1);
});

test("scrolling through the journey never forces a layout and restyles only the moving elements", async ({ page }) => {
  // Durations are noisy on a shared machine, so this counts deterministic work from a DevTools trace:
  // synchronous layouts forced by the journey's own code, and elements restyled per scroll step,
  // compared with a control (same number of steps in the hero, where the journey is off-screen).
  // Other sections (GSAP ScrollTrigger) force one layout per scroll event page-wide; that is not counted here.
  await page.setViewportSize({ width: 1440, height: 900 });
  await openHome(page);
  await page.evaluate(() => document.fonts.ready);

  const client = await page.context().newCDPSession(page);
  const STEPS = 160;

  // "hero": top of the page up to just before the journey; "journey": from its approach to its end
  const regionOf = (region) =>
    page.evaluate((name) => {
      const story = document.querySelector(".oj-story");
      const top = story.getBoundingClientRect().top + window.scrollY;
      return name === "hero"
        ? [0, Math.max(10, top - window.innerHeight * 1.2)]
        : [top - window.innerHeight, top + story.offsetHeight - window.innerHeight];
    }, region);

  const measure = async (region) => {
    const [start, end] = await regionOf(region);
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), start);
    await frames(page, 4);
    await settle(page);
    const events = [];
    const collect = (e) => events.push(...e.value);
    client.on("Tracing.dataCollected", collect);
    const complete = new Promise((resolve) => client.once("Tracing.tracingComplete", resolve));
    await client.send("Tracing.start", {
      categories: "devtools.timeline,disabled-by-default-devtools.timeline,disabled-by-default-devtools.timeline.stack",
      transferMode: "ReportEvents",
    });
    await page.evaluate(
      async ({ start: from, end: to, steps }) => {
        for (let i = 1; i <= steps; i += 1) {
          window.scrollTo({ top: from + ((to - from) * i) / steps, behavior: "instant" });
          await new Promise((r) => requestAnimationFrame(r));
        }
      },
      { start, end, steps: STEPS },
    );
    await settle(page);
    await client.send("Tracing.end");
    await complete;
    client.off("Tracing.dataCollected", collect);

    const ours = (frame) => /AboutPreview|orbitJourneyModel/.test(frame?.url || "");
    return {
      forcedLayoutsByJourney: events.filter((e) => e.name === "Layout" && e.args?.beginData?.stackTrace?.some(ours)).length,
      restyled: events.filter((e) => e.name === "UpdateLayoutTree").reduce((sum, e) => sum + (e.args?.elementCount || 0), 0),
    };
  };

  const control = await measure("hero");
  const journey = await measure("journey");

  expect(journey.forcedLayoutsByJourney, "synchronous layouts forced by the journey's code").toBe(0);
  expect((journey.restyled - control.restyled) / STEPS, "extra elements restyled per scroll step").toBeLessThan(30);
});

test("resize and pageshow re-render the current scroll position without resetting it", async ({ page }) => {
  // (App-level ScrollToTop returns to the top on every mount, so mid-journey reloads do not exist here.)
  await page.setViewportSize({ width: 1440, height: 900 });
  await openHome(page);
  await scrollStory(page, chapterScrollProgress(2));
  await expect(page.locator(".oj-copy")).toContainText("Chapter 03");
  const before = (await rendered(page, ".oj-system")).transform;

  await page.evaluate(() => {
    window.dispatchEvent(new Event("pageshow"));
    window.dispatchEvent(new Event("resize"));
  });
  await frames(page);
  await settle(page);
  await expect(page.locator(".oj-copy")).toContainText("Chapter 03");
  expect((await rendered(page, ".oj-system")).transform).toBe(before);
  expect((await rendered(page, ".oj-copy")).opacity).toBe(1);
});

test("screen readers get every chapter, not only the active one", async ({ page }) => {
  await openHome(page);
  const list = page.locator("#about .oj-sr");
  await expect(list).toBeAttached();
  for (const text of [
    "Making ideas tangible",
    "Thinking beyond the interface",
    "Designing for imperfect conditions",
    "Connecting the whole product range",
  ]) {
    await expect(list).toContainText(text);
  }
});

test("closing keeps the primary calls to action and the proof", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openHome(page);
  await page.locator(".oj-closing").scrollIntoViewIfNeeded();
  const closing = page.locator(".oj-closing");

  await expect(closing.getByRole("link", { name: /Explore Projects/ })).toHaveAttribute("href", "/projects");
  await expect(closing.getByRole("link", { name: "About Me" })).toHaveAttribute("href", "/about");
  await expect(closing).toContainText("CarbonEthics");
  await expect(closing).toContainText("Fullstack Developer Associate Manager");
  await expect(closing.getByText("Projects shipped")).toBeVisible();
  await expect(closing.locator(".oj-stat strong").first()).toContainText("20");
});

test("a skip link jumps past the journey to the projects", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openHome(page);
  await scrollStory(page, 0.3);

  const skip = page.getByRole("link", { name: "Skip to projects" });
  await expect(skip).toBeVisible();
  await skip.click();
  await expect
    .poll(() => page.evaluate(() => document.querySelector("#projects").getBoundingClientRect().top), {
      timeout: 6_000,
    })
    .toBeLessThan(400);
});

test("uses the repo theme tokens: dark and light grounds", async ({ page }) => {
  await openHome(page, { theme: "dark" });
  await expect(page.locator(".oj-stage")).toHaveCSS("background-color", "rgb(8, 18, 31)");

  const light = await page.context().newPage();
  await light.addInitScript(() => {
    sessionStorage.setItem("rian-landing-intro-seen", "1");
    localStorage.setItem("theme", "light");
  });
  await light.goto("/");
  await expect(light.locator(".oj-stage")).toHaveCSS("background-color", "rgb(238, 242, 246)");
  await scrollStory(light, 0.7);
  await expect(light.locator(".oj-copy h3")).toHaveCSS("color", "rgb(16, 35, 63)");
  await light.close();
});

test("motion stays on even when the OS asks for reduced motion (site-wide product decision)", async ({ page }) => {
  // PRODUCT.md / DESIGN.md: animations always run regardless of prefers-reduced-motion,
  // like the rest of the site. Windows with "Animation effects" off reports `reduce`.
  await page.setViewportSize({ width: 1440, height: 900 });
  await openHome(page, { reducedMotion: true });
  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);

  await scrollApproach(page, 0.6);
  const flying = await rendered(page, ".oj-word", 9);
  expect(Math.abs(flying.tx) + Math.abs(flying.ty), "words still fly in").toBeGreaterThan(20);

  await scrollStory(page, 0.12);
  const dispersing = await rendered(page, ".oj-word");
  expect(Math.abs(dispersing.tx) + Math.abs(dispersing.ty), "words still fly apart").toBeGreaterThan(20);

  await scrollStory(page, 0.5);
  const arriving = await page.evaluate(() => {
    const system = document.querySelector(".oj-system").getBoundingClientRect();
    const node = document.querySelector('[data-node="1"]').getBoundingClientRect();
    return ((node.left + node.width / 2 - (system.left + system.width / 2)) / system.width) * 100 + 50;
  });
  expect(Math.abs(arriving - NODE_PATHS[1].end.x), "nodes still travel on their curves").toBeGreaterThan(1);

  await scrollStory(page, chapterScrollProgress(2));
  expect(normalizeAngle((await rendered(page, ".oj-system")).angle)).toBeCloseTo(normalizeAngle(-180), 1);
  await expect(page.locator(".oj-copy")).toContainText("Chapter 03");
  await expect
    .poll(() => page.locator(".oj-scan").evaluate((el) => el.getAnimations().some((a) => a.playState === "running")))
    .toBe(true);
});

/* ───────── geometry against the real fixed chrome (navbar / tab bar / theme toggle) ───────── */

const DESKTOP = [
  [1521, 918],
  [1440, 900],
  [1366, 650],
  [1280, 720],
  [1920, 1080],
  [820, 1180],
  [768, 1024],
];
const MOBILE = [
  [360, 640],
  [375, 667],
  [390, 844],
  [412, 915],
  [430, 932],
];

async function measureLayout(page) {
  return page.evaluate(() => {
    const rect = (el) => {
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
    };
    const visible = (el) => el && getComputedStyle(el).display !== "none";
    const header = document.querySelector("header.fixed");
    const tabBar = document.querySelector("nav.fixed.bottom-0");
    const toggle = document.querySelector('button[aria-label="Toggle theme"].fixed');
    const copyEl = document.querySelector(".oj-copy");
    return {
      layoutWidth: document.documentElement.clientWidth,
      viewportHeight: window.innerHeight,
      header: visible(header) ? rect(header) : null,
      tabBar: visible(tabBar) ? rect(tabBar) : null,
      toggle: visible(toggle) ? rect(toggle) : null,
      copy: rect(copyEl),
      copyOverflows: copyEl.scrollHeight > copyEl.clientHeight + 1,
      nodes: [...document.querySelectorAll("[data-node]")].map((n) => ({ name: n.textContent.trim().slice(0, 12), ...rect(n) })),
    };
  });
}

const intersects = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

for (const [width, height] of [...DESKTOP, ...MOBILE]) {
  test(`orbit fits without collisions at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await openHome(page);

    for (let chapter = 0; chapter < 4; chapter += 1) {
      for (const extra of [0, 0.02]) {
        await scrollStory(page, chapterScrollProgress(chapter) + extra);
        const m = await measureLayout(page);
        const label = `${width}x${height} chapter ${chapter + 1}${extra ? " (turning)" : ""}`;

        expect(m.copyOverflows, `${label}: chapter text overflows its panel`).toBe(false);
        for (const node of m.nodes) {
          expect(node.left, `${label}: ${node.name} left edge`).toBeGreaterThanOrEqual(0);
          expect(node.right, `${label}: ${node.name} right edge`).toBeLessThanOrEqual(m.layoutWidth);
          expect(node.top, `${label}: ${node.name} top edge`).toBeGreaterThanOrEqual(0);
          expect(node.bottom, `${label}: ${node.name} bottom edge`).toBeLessThanOrEqual(m.viewportHeight);
          // On desktop the panel sits above the orbit in z-order, so a node may sweep beneath its text
          // for a moment while turning; at rest, and always on mobile (panel outside the orbit zone), no overlap.
          if (!extra || width < 768) {
            expect(intersects(node, m.copy), `${label}: ${node.name} overlaps the chapter panel`).toBe(false);
          }
          if (m.header) expect(node.top, `${label}: ${node.name} under the navbar`).toBeGreaterThanOrEqual(m.header.bottom);
          if (m.tabBar) expect(node.bottom, `${label}: ${node.name} behind the tab bar`).toBeLessThanOrEqual(m.tabBar.top);
          if (m.toggle) expect(intersects(node, m.toggle), `${label}: ${node.name} behind the theme toggle`).toBe(false);
        }
        if (m.tabBar) expect(m.copy.bottom, `${label}: panel behind the tab bar`).toBeLessThanOrEqual(m.tabBar.top);
        if (m.toggle) expect(intersects(m.copy, m.toggle), `${label}: panel behind the theme toggle`).toBe(false);
      }
    }
  });
}

test("no horizontal overflow on the home page at 360px and 1440px", async ({ page }) => {
  for (const [width, height] of [[360, 640], [1440, 900]]) {
    await page.setViewportSize({ width, height });
    await openHome(page);
    for (const p of [0, 0.3, 0.6, 1]) {
      await scrollStory(page, p);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${width}px at ${p}`).toBeLessThanOrEqual(0);
    }
  }
});
