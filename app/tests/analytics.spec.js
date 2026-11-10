import { test, expect } from "@playwright/test";
import { linkEvent, slugify } from "../src/lib/analytics.js";

const ORIGIN = "https://rianfarhan.my.id";

test("links map to the analytics events Rian reads in Clarity", () => {
  expect(linkEvent("/rianCV.pdf", ORIGIN)).toBe("cv_download");
  expect(linkEvent("mailto:rian.mallanti@gmail.com", ORIGIN)).toBe("contact_email");
  expect(linkEvent("https://wa.me/6282280372670", ORIGIN)).toBe("contact_whatsapp");
  expect(linkEvent("https://www.linkedin.com/in/baso-rian-farhan-82bb73245/", ORIGIN)).toBe("contact_linkedin");
  expect(linkEvent("https://github.com/RianFarhan07", ORIGIN)).toBe("contact_github");
  expect(linkEvent("https://www.instagram.com/rianfarhan/", ORIGIN)).toBe("contact_instagram");
  expect(linkEvent("https://finlog.my.id/", ORIGIN)).toBe("outbound_finlog.my.id");
  expect(linkEvent("https://www.carbonethics.co", ORIGIN)).toBe("outbound_carbonethics.co");
  expect(linkEvent("/projects", ORIGIN)).toBeNull();
  expect(linkEvent("#projects", ORIGIN)).toBeNull();
  expect(linkEvent(`${ORIGIN}/contact`, ORIGIN)).toBeNull();
  expect(slugify("CarbonEthics Petani App")).toBe("carbonethics-petani-app");
});

async function stubClarity(page) {
  await page.addInitScript(() => {
    sessionStorage.setItem("rian-landing-intro-seen", "1");
    window.__clarityCalls = [];
    window.clarity = (...args) => window.__clarityCalls.push(args);
    // Keep the test on the page: log the click, skip the navigation.
    window.addEventListener("click", (e) => e.target.closest?.("a[href]") && e.preventDefault(), true);
  });
}

const events = (page) =>
  page.evaluate(() => window.__clarityCalls.filter(([kind]) => kind === "event").map(([, name]) => name));

test("CV and social clicks are logged, and dev never loads the Clarity script", async ({ page }) => {
  await stubClarity(page);
  await page.goto("/");
  await page.locator('a[href="/rianCV.pdf"]').first().click();
  await page.locator('footer a[aria-label="LinkedIn"]').click();
  await expect.poll(() => events(page)).toEqual(["cv_download", "contact_linkedin"]);
  await expect(page.locator('script[src*="clarity.ms"]')).toHaveCount(0);
});

test("opening a project logs which one", async ({ page }) => {
  await stubClarity(page);
  await page.goto("/projects");
  const title = (await page.locator("#projects h3").first().textContent()).trim();
  await page.locator("#projects h3").first().click();
  await expect.poll(() => events(page)).toContain(`project_view_${slugify(title)}`);
});
