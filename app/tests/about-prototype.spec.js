import { expect, test } from "@playwright/test";
import sharp from "sharp";

test("about picker remembers the selected view for one browser session", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => sessionStorage.clear());
  await page.goto("/about");

  const picker = page.locator("#about-view-picker");
  await expect(picker).toBeVisible({ timeout: 6_000 });
  await expect(page.getByRole("button", { name: "Visual Journey" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Terminal Mode" })).toBeVisible();
  await expect(picker.getByText("Available · Jakarta / Makassar")).toBeVisible();
  await expect(picker.locator('img[src*="rian-animate-editorial.webp"]')).toBeVisible();

  await page.getByRole("button", { name: "Visual Journey" }).click();
  await expect(page.locator("#visual-journey")).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => sessionStorage.getItem("rian-about-view")))
    .toBe("page");

  await page.reload();
  await expect(picker).toBeHidden();
  await expect(page.locator("#visual-journey")).toBeVisible();

  await page.getByRole("button", { name: "Switch view" }).click();
  await expect(picker).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => sessionStorage.getItem("rian-about-view")))
    .toBeNull();

  await page.getByRole("button", { name: "Terminal Mode" }).click();
  await expect(page.locator("#terminal-view")).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => sessionStorage.getItem("rian-about-view")))
    .toBe("terminal");
});

test("academic achievements form a separate chapter before the career journey", async ({
  page,
}) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("rian-about-view", "page"),
  );
  await page.goto("/about");

  const education = page.locator("#education-journey");
  const career = page.locator("#career-journey");

  await expect(education).toBeVisible();
  await expect(education.getByText("3.86", { exact: true })).toBeVisible();
  await expect(education.getByText("/4.00", { exact: true })).toBeVisible();
  await expect(education.getByText("99", { exact: true })).toBeVisible();
  await expect(education.getByText("/100", { exact: true })).toBeVisible();
  await expect(education.getByText("Teacher's Award", { exact: true })).toBeVisible();

  await expect(career.getByText("CarbonEthics", { exact: true })).toBeVisible();
  await expect(career.getByText("99", { exact: true })).toHaveCount(0);
  await expect(career.getByText("3.86", { exact: true })).toHaveCount(0);
  await expect(page.locator('img[src*="foto-nobg-editorial-natural"]')).toHaveCount(0);
});

test("CarbonEthics experience shows end-to-end product and leadership impact", async ({
  page,
}) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("rian-about-view", "page"),
  );
  await page.goto("/about");

  const career = page.locator("#career-journey");
  await expect(career.getByText("2025 → 2026", { exact: true })).toBeVisible();
  await expect(career.getByText("Latest role", { exact: true })).toBeVisible();
  await expect(career.getByText("SMAN 4 Jeneponto", { exact: true })).toBeVisible();
  await expect(career.getByText("IT Support Intern", { exact: true })).toBeVisible();
  await expect(career.getByText(/multi-role Internal Dashboard/)).toBeVisible();
  await expect(career.getByText(/offline-first Field Monitoring App/)).toBeVisible();
  await expect(career.getByText(/corporate website migration from Wix/)).toBeVisible();
  await expect(career.getByText(/B2B Client Dashboard/)).toBeVisible();
  await expect(career.getByText(/team of 2 development interns/)).toBeVisible();
});

test("page view shares the same desktop content rails as the navbar", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1728, height: 1000 });
  await page.addInitScript(() =>
    sessionStorage.setItem("rian-about-view", "page"),
  );
  await page.goto("/about");

  const pageView = page.locator("#visual-journey");
  await expect(pageView).toBeVisible();

  const rails = await page.evaluate(() => {
    const nav = document.querySelector("nav");
    const about = document.querySelector("#visual-journey");
    const hero = document.querySelector(".bp-hero");
    const rect = (element) => element.getBoundingClientRect();
    const navRect = rect(nav);
    const aboutRect = rect(about);
    const heroRect = rect(hero);
    const navStyles = getComputedStyle(nav);
    const aboutStyles = getComputedStyle(about);

    return {
      navLeft: navRect.left,
      aboutLeft: aboutRect.left,
      aboutWidth: aboutRect.width,
      heroLeft: heroRect.left,
      navContentLeft: navRect.left + parseFloat(navStyles.paddingLeft),
      aboutPaddingLeft: parseFloat(aboutStyles.paddingLeft),
    };
  });

  expect(rails.aboutWidth).toBe(1200);
  expect(rails.aboutPaddingLeft).toBe(24);
  expect(rails.aboutLeft).toBeCloseTo(rails.navLeft, 0);
  expect(rails.heroLeft).toBeCloseTo(rails.navContentLeft, 0);
});

test("page view explains working principles and uses one capability toolbox", async ({
  page,
}) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("rian-about-view", "page"),
  );
  await page.goto("/about");

  const principles = page.locator("#work-principles");
  const toolbox = page.locator("#capabilities-toolbox");

  await expect(principles).toBeVisible();
  await expect(principles.getByText("Think in Systems", { exact: true })).toBeVisible();
  await expect(principles.getByText("Own It End-to-End", { exact: true })).toBeVisible();
  await expect(principles.getByText("Ship With Clarity", { exact: true })).toBeVisible();

  await expect(toolbox).toBeVisible();
  await expect(toolbox.getByText("Frontend / Product UI", { exact: true })).toBeVisible();
  await expect(toolbox.getByText("Backend / Systems", { exact: true })).toBeVisible();
  await expect(toolbox.getByText("Mobile Delivery", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Skills", exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Tech Stack", exact: true })).toHaveCount(0);
});

test("favicon uses the current deep-navy and ochre palette", async ({ request }) => {
  const response = await request.get("/favicon-192.png");
  expect(response.status()).toBe(200);

  const { data, info } = await sharp(await response.body())
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const pixel = (x, y) => {
    const index = (y * info.width + x) * info.channels;
    return Array.from(data.subarray(index, index + 3));
  };

  expect(pixel(2, 2)).toEqual([8, 17, 31]);
  expect(pixel(50, 60)).toEqual([224, 168, 58]);
});
