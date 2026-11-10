import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 1366, height: 768 } });

// The home certificates card no longer shows a cropped image. The certificate appears, uncropped, in a card that
// follows the cursor while a list item is hovered (pointer devices only).
test("hovering a certificate previews it next to the cursor and the detail card holds no image", async ({ page }) => {
  await page.goto("/");
  const item = page.locator(".cp-list-item").nth(2);
  await expect(item).toBeAttached();

  await expect(page.locator('[data-scroll="cert-details"] img')).toHaveCount(0);
  await expect(page.locator(".cp-peek")).toHaveCount(0);

  const fire = (type, y, extra = {}) =>
    item.evaluate((el, a) => el.dispatchEvent(new MouseEvent(a.type, { bubbles: true, clientX: 900, clientY: a.y, ...a.extra })), { type, y, extra });
  // the pinned section may not be on screen: a synthetic cursor position is enough for placement logic
  await fire("mouseover", 400);
  const peek = page.locator(".cp-peek");
  await expect(peek).toBeVisible();
  await expect(peek.locator("img")).toHaveAttribute("src", /images\/certificates\/previews\//);

  await expect.poll(async () => (await peek.boundingBox()).y, { message: "preview placed" }).toBeGreaterThan(0);
  const first = await peek.boundingBox();
  await fire("mousemove", 520);
  await expect.poll(async () => (await peek.boundingBox()).y, { message: "preview follows the cursor" }).toBeGreaterThan(first.y);

  const box = await peek.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y + box.height).toBeLessThanOrEqual(768);
  expect(box.x + box.width).toBeLessThanOrEqual(1366);

  await fire("mouseout", 520, { relatedTarget: null });
  await expect(peek).toHaveCount(0);
});

// Hovering the detail card previews the certificate it is showing, on the right of the cursor so the text stays readable.
test("hovering the detail card previews the active certificate to the right of the cursor", async ({ page }) => {
  await page.goto("/");
  const card = page.locator('[data-cert-card="detail"]');
  await expect(card).toBeAttached();

  await card.evaluate((el) => el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, clientX: 300, clientY: 400 })));
  const peek = page.locator(".cp-peek");
  await expect(peek).toBeVisible();
  await expect(peek.locator("img")).toHaveAttribute("src", /previews\/hacktiv8/i);
  await expect.poll(async () => (await peek.boundingBox()).x).toBeGreaterThan(300);

  await card.evaluate((el) => el.dispatchEvent(new MouseEvent("mouseout", { bubbles: true, relatedTarget: null })));
  await expect(peek).toHaveCount(0);
});
