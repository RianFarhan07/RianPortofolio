import { expect, test } from "@playwright/test";

const readBadgeReveal = async (badge) =>
  badge.evaluate((element) => {
    const style = getComputedStyle(element);
    const rightInset = style.clipPath.match(
      /inset\([^ ]+\s+([\d.]+)(?:px|%)?/,
    );

    return {
      opacity: Number(style.opacity),
      rightInset: rightInset ? Number(rightInset[1]) : null,
    };
  });

const expectBadgeWipe = async ({ page, sectionId, badgeText }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");
  await page.waitForTimeout(3800);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
  });
  await page.waitForTimeout(250);

  const section = page.locator(sectionId);
  const badgeLabel = section.getByText(badgeText, { exact: true });
  await expect(badgeLabel).toHaveCount(1);
  const badge = badgeLabel.locator("..");
  const metrics = await section.evaluate((element) => ({
    top: element.getBoundingClientRect().top + window.scrollY,
    travel: element.offsetHeight - window.innerHeight,
  }));

  await page.evaluate((top) => window.scrollTo(0, top - 200), metrics.top);
  await page.waitForTimeout(750);

  await expect
    .poll(() => readBadgeReveal(badge))
    .toMatchObject({ opacity: 0, rightInset: 100 });

  await page.evaluate(({ top }) => window.scrollTo(0, top), metrics);
  await page.waitForTimeout(750);

  const duringReveal = await readBadgeReveal(badge);
  expect(duringReveal.opacity).toBeGreaterThan(0);
  expect(duringReveal.opacity).toBeLessThan(1);
  expect(duringReveal.rightInset).toBeGreaterThan(0);
  expect(duringReveal.rightInset).toBeLessThan(100);

  await page.evaluate(
    ({ top, travel }) => window.scrollTo(0, top + travel * 0.25),
    metrics,
  );
  await page.waitForTimeout(750);

  await expect
    .poll(() => readBadgeReveal(badge))
    .toMatchObject({ opacity: 1, rightInset: 0 });
};

test("certificates description badge reveals from left to right", async ({
  page,
}) => {
  await expectBadgeWipe({
    page,
    sectionId: "#certificates",
    badgeText: "Proof Behind the Practice",
  });
});

test("selected works description badge reveals from left to right", async ({
  page,
}) => {
  await expectBadgeWipe({
    page,
    sectionId: "#projects",
    badgeText: "Built for Real Use",
  });
});
