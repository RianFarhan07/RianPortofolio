import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 1366, height: 768 } });

// Card content that can overflow scrolls inside the card with a thin scrollbar that blends into the theme.
// The certificate detail card is the exception: it never scrolls (its preview image shrinks instead).
test("card scroll areas use the thin scrollbar and the certificate detail card does not scroll", async ({ page }) => {
  await page.goto("/");

  for (const key of ["project-details", "cert-list"]) {
    const area = page.locator(`[data-scroll="${key}"]`).first();
    await expect(area, `${key} exists`).toBeAttached();
    await expect(area).toHaveClass(/thin-scroll/);
    await expect(area).toHaveCSS("overflow-y", "auto");
    const width = await area.evaluate((node) => getComputedStyle(node, "::-webkit-scrollbar").width);
    expect(width, `${key} scrollbar width`).toBe("4px");
  }

  const details = page.locator('[data-scroll="cert-details"]').first();
  await expect(details).toBeAttached();
  await expect(details).toHaveCSS("overflow-y", "hidden");
  await expect(details).not.toHaveClass(/thin-scroll/);
});
