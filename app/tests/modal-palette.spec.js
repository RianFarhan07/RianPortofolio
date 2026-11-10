import { test, expect } from "@playwright/test";

// Modals once used pure white (bg-white) in light mode, which looked like a leftover next to the beige pages.
const LIGHT_PANEL = "rgb(243, 236, 225)"; // tailwind gray-50 in this palette
const DARK_PANEL = "rgb(27, 33, 25)"; // gray-900

for (const [theme, panel] of [["light", LIGHT_PANEL], ["dark", DARK_PANEL]]) {
  test.describe(`${theme} mode`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
    });

    test("project modal uses the palette panel and the thin scrollbar", async ({ page }) => {
      await page.goto("/projects");
      await page.locator("[data-project-card]").first().click();
      const box = page.locator(".fixed.inset-0 > .rounded-2xl").first();
      await expect(box).toBeVisible();
      await expect(box).toHaveCSS("background-color", panel);
      await expect(box).toHaveClass(/thin-scroll/);
    });

    test("certificate modal uses the palette panel", async ({ page }) => {
      await page.goto("/certificates");
      await page.locator("div.grid.grid-cols-1 button").first().click();
      const box = page.locator(".fixed.inset-0 > .rounded-2xl").first();
      await expect(box).toBeVisible();
      await expect(box).toHaveCSS("background-color", panel);
    });
  });
}

test("the floating theme button on mobile is not pure white in light mode", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  await page.goto("/");
  const toggle = page.locator('button[aria-label="Toggle theme"]:visible').first();
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveCSS("background-color", LIGHT_PANEL);
});
