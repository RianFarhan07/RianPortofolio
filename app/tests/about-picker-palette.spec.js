import { test, expect } from "@playwright/test";

// The About picker once kept a cool grey-green surface (#edf2f0) that no longer matched the beige palette.
for (const [theme, page_bg, panel_bg] of [
  ["light", "rgb(226, 214, 198)", "rgb(235, 225, 211)"],
  ["dark", "rgb(24, 30, 22)", "rgb(32, 39, 29)"],
]) {
  test(`about picker uses the earth palette in ${theme} mode`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
    await page.goto("/about");

    const main = page.locator("main.pk");
    await expect(main).toBeVisible();
    await expect(main).toHaveCSS("background-color", page_bg);
    await expect(page.locator(".pk-frame")).toHaveCSS("background-color", panel_bg);
  });
}
