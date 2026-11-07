import { expect, test } from "@playwright/test";

const customCursorCount = (page) =>
  page.evaluate(
    () =>
      [...document.querySelectorAll("div")].filter(
        (element) =>
          element.style.position === "fixed" &&
          ["99999", "100000"].includes(element.style.zIndex),
      ).length,
  );

test("touch-only devices do not render the custom cursor", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.addInitScript(() =>
    sessionStorage.setItem("rian-landing-intro-seen", "1"),
  );

  await page.goto("/projects");
  await page.tap("body", { position: { x: 200, y: 300 } });

  await expect.poll(() => customCursorCount(page)).toBe(0);
  await context.close();
});

test("mouse devices still render the custom cursor", async ({ page }) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("rian-landing-intro-seen", "1"),
  );
  await page.goto("/projects");

  await page.mouse.move(200, 300);

  await expect.poll(() => customCursorCount(page)).toBe(2);
});
