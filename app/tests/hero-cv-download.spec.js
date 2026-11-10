import { test, expect } from "@playwright/test";

// The home hero offers the CV next to "Contact Me". The About page already links the same file.
for (const [name, size] of [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 390, height: 844 }],
]) {
  test(`hero offers the CV download on ${name}`, async ({ page }) => {
    await page.setViewportSize(size);
    await page.goto("/");

    const link = page.locator('a[aria-label="Download CV"]:visible');
    await expect(link).toHaveCount(1);
    await expect(link).toHaveAttribute("href", "/rianCV.pdf");
    await expect(link).toHaveAttribute("download", /CV/);

    const res = await page.request.get("/rianCV.pdf");
    expect(res.ok()).toBe(true);
    expect(res.headers()["content-type"]).toContain("pdf");
  });
}

test("the CV button never sits under the floating theme toggle on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const link = await page.locator('a[aria-label="Download CV"]:visible').boundingBox();
  const toggle = await page.locator('button[aria-label="Toggle theme"]:visible').first().boundingBox();
  expect(link).not.toBeNull();
  expect(toggle).not.toBeNull();

  const overlaps =
    link.x < toggle.x + toggle.width &&
    link.x + link.width > toggle.x &&
    link.y < toggle.y + toggle.height &&
    link.y + link.height > toggle.y;
  expect(overlaps, "Download CV overlaps the theme toggle").toBe(false);
});
