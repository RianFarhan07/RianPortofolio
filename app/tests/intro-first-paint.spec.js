import { expect, test } from "@playwright/test";

// The deployed HTML is prerendered AFTER the landing intro has finished, so it already contains the
// finished hero, portrait included. On a first visit the browser paints that HTML before the JS
// bundle boots and starts the intro, which flashed Rian's face before the intro could play.
// index.html now covers the page (and keeps every portrait hidden) from the very first paint until
// the intro has played; PageTransition6Clean releases it.

const INTRO_SEEN = "rian-landing-intro-seen";

// Stand-in for the prerendered markup: a visible portrait already inside #root.
const PRERENDERED_ROOT =
  '<div id="root"><div data-intro-portrait style="opacity:1"><img alt="Rian Farhan" width="10" height="10" ' +
  'src="data:image/gif;base64,R0lGODlhAQABAAAAACw="></div><h1>SOFTWARE ENGINEER</h1></div>';

async function openPrerenderedWithoutApp(page) {
  await page.route(/\/src\/main\.jsx/, (route) => route.abort()); // dev serves it as main.jsx?t=…
  await page.route(/\/$/, async (route) => {
    const response = await route.fetch();
    const html = (await response.text()).replace('<div id="root"></div>', PRERENDERED_ROOT);
    await route.fulfill({ response, body: html });
  });
  await page.goto("/");
}

const coverState = (page) =>
  page.evaluate(() => {
    const cover = getComputedStyle(document.body, "::before");
    const portrait = document.querySelector("[data-intro-portrait]");
    return {
      intro: document.documentElement.getAttribute("data-intro"),
      cover: cover.content !== "none" && cover.visibility === "visible" ? cover.backgroundColor : null,
      coverOpacity: Number(cover.opacity),
      portraitOpacity: portrait ? Number(getComputedStyle(portrait).opacity) : null,
    };
  });

test("a first visit covers the prerendered page and hides the portrait before the app boots", async ({ page }) => {
  await openPrerenderedWithoutApp(page);
  expect(await coverState(page)).toEqual({
    intro: "pending",
    cover: "rgb(13, 21, 32)",
    coverOpacity: 1,
    portraitOpacity: 0,
  });
});

test("the first-paint cover follows the saved light theme", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  await openPrerenderedWithoutApp(page);
  expect((await coverState(page)).cover).toBe("rgb(242, 244, 247)");
});

test("returning visitors in the same session see the page straight away", async ({ page }) => {
  await page.addInitScript((key) => sessionStorage.setItem(key, "1"), INTRO_SEEN);
  await openPrerenderedWithoutApp(page);
  expect(await coverState(page)).toEqual({ intro: null, cover: null, coverOpacity: 1, portraitOpacity: 1 });
});

test("if the app never boots, the cover releases itself but the portrait stays hidden", async ({ page }) => {
  await openPrerenderedWithoutApp(page);
  await expect.poll(async () => (await coverState(page)).cover, { timeout: 8_000 }).toBeNull();
  expect((await coverState(page)).portraitOpacity).toBe(0);
});

test("once the app boots the cover hands over to the intro, which keeps the portrait hidden until it exits", async ({ page }) => {
  await page.goto("/");
  const intro = page.getByRole("status", { name: "Portfolio introduction" });
  await expect(intro).toBeVisible();

  // The intro sits inside the app's stacking context, under the cover, so the cover must be gone
  // while the intro is still playing (it runs 1.8s), not after it.
  await expect.poll(async () => (await coverState(page)).cover, { timeout: 1_000 }).toBeNull();
  await expect(intro).toBeVisible();
  expect((await coverState(page)).portraitOpacity).toBe(0);

  await expect(intro).toBeHidden({ timeout: 3_000 });
  await expect.poll(async () => (await coverState(page)).portraitOpacity).toBe(1);
  expect((await coverState(page)).intro).toBeNull();
});

for (const { name, width } of [
  { name: "desktop", width: 1440 },
  { name: "mobile", width: 390 },
]) {
  test(`the ${name} hero portrait is marked so the first-paint cover can hide it`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript((key) => sessionStorage.setItem(key, "1"), INTRO_SEEN);
    await page.goto("/");
    await expect(page.locator('#home [data-intro-portrait] img[alt="Rian Farhan"]')).toHaveCount(1);
  });
}

test("the about page portrait is marked so the first-paint cover can hide it", async ({ page }) => {
  await page.addInitScript((key) => sessionStorage.setItem(key, "1"), INTRO_SEEN);
  await page.goto("/about");
  await expect(page.locator(".pk-portrait-wrap[data-intro-portrait] img")).toHaveCount(1);
});
