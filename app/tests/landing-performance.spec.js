import { expect, test } from "@playwright/test";

test("landing intro hides the hero portrait, then plays only once per browser session", async ({
  page,
}) => {
  await page.goto("/");

  const intro = page.getByRole("status", { name: "Portfolio introduction" });
  await expect(intro).toBeVisible();

  const portrait = page.locator('#home img[alt="Rian Farhan"]').first();
  await expect
    .poll(() =>
      portrait.evaluate((image) =>
        Number(getComputedStyle(image.closest("div")).opacity),
      ),
    )
    .toBe(0);

  await expect(intro).toBeHidden({ timeout: 3_000 });
  await expect
    .poll(() =>
      portrait.evaluate((image) =>
        Number(getComputedStyle(image.closest("div")).opacity),
      ),
    )
    .toBe(1);

  await page.reload();
  await page.waitForTimeout(300);
  await expect(intro).toHaveCount(0);
});

test("landing self-hosts its fonts without an external render-blocking stylesheet", async ({
  page,
}) => {
  const fontStylesheets = new Set();
  const localFonts = new Set();
  page.on("request", (request) => {
    const url = request.url();
    if (url.startsWith("https://fonts.googleapis.com/css2")) {
      fontStylesheets.add(url);
    }
    const pathname = new URL(url).pathname;
    if (request.resourceType() === "font" && pathname.startsWith("/fonts/")) {
      localFonts.add(pathname);
    }
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);

  expect([...fontStylesheets]).toHaveLength(0);
  expect([...localFonts]).toEqual(
    expect.arrayContaining(["/fonts/dm-sans-latin.woff2", "/fonts/syne-latin.woff2"]),
  );
});

test("landing defers route-only modules until their route is opened", async ({
  page,
}) => {
  const requestedPaths = [];
  page.on("request", (request) => {
    requestedPaths.push(new URL(request.url()).pathname);
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });

  expect(requestedPaths).not.toContain("/src/components/About.jsx");
  expect(requestedPaths).not.toContain("/src/components/Projects.jsx");
  expect(requestedPaths).not.toContain("/src/components/Certificates.jsx");
  expect(requestedPaths).not.toContain("/src/components/Contact.jsx");
  expect(requestedPaths).not.toContain("/src/components/NotFound.jsx");

  await page.goto("/about", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#about-view-picker")).toBeVisible();
  expect(requestedPaths).toContain("/src/components/About.jsx");
});

test("below-fold carousels stay idle until the visitor reaches them", async ({
  page,
}) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("rian-landing-intro-seen", "1"),
  );
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const projectImage = page.locator("#projects img[alt]").first();
  // the certificate card shows the active certificate as text (its image is a hover preview), so watch the title
  const certificateTitle = page.locator("#certificates [data-scroll=\"cert-details\"] h3").first();
  await expect(projectImage).toHaveAttribute("alt", "Finlog");
  await expect(certificateTitle).toHaveText("Hacktiv8 Fullstack JavaScript Bootcamp");

  await page.waitForTimeout(5_300);

  await expect(projectImage).toHaveAttribute("alt", "Finlog");
  await expect(certificateTitle).toHaveText("Hacktiv8 Fullstack JavaScript Bootcamp");
});

test("landing prioritizes a responsive hero and lazy-loads below-fold imagery", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const portrait = page.locator('#home img[alt="Rian Farhan"]').first();
  await expect(portrait).toHaveAttribute("fetchpriority", "high");
  await expect(portrait).toHaveAttribute("loading", "eager");
  await expect(portrait).toHaveAttribute("width", "1672");
  await expect(portrait).toHaveAttribute("height", "941");
  await expect
    .poll(() => portrait.evaluate((image) => image.naturalWidth))
    .toBeGreaterThan(0);
  expect(await portrait.evaluate((image) => image.naturalWidth)).toBeLessThanOrEqual(
    960,
  );

  const belowFoldImages = page.locator(
    "#about img, #projects img, #certificates img",
  );
  expect(await belowFoldImages.count()).toBeGreaterThan(0);
  expect(
    await belowFoldImages.evaluateAll((images) =>
      images.every((image) => image.loading === "lazy"),
    ),
  ).toBe(true);
});
