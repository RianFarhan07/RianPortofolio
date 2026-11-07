import { expect, test } from "@playwright/test";

const openProjects = async (page) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("rian-landing-intro-seen", "1"),
  );
  await page.goto("/projects");
};

test("project cards hide source and live links when neither URL exists", async ({
  page,
}) => {
  await openProjects(page);

  const card = page.locator("article, [data-project-card]").filter({
    hasText: "CarbonEthics Internal Dashboard",
  });
  const resolvedCard = (await card.count())
    ? card.first()
    : page.getByText("CarbonEthics Internal Dashboard").locator("xpath=ancestor::*[self::div or self::article][.//button[contains(., 'Details')]][1]");

  await expect(resolvedCard.getByLabel("View source code")).toHaveCount(0);
  await expect(resolvedCard.getByLabel("View live demo")).toHaveCount(0);
  await expect(resolvedCard.getByRole("button", { name: /details/i })).toBeVisible();
});

test("project cards render only the link types that exist", async ({ page }) => {
  await openProjects(page);

  const liveOnlyCard = page
    .getByText("CarbonEthics Website Revamp")
    .locator("xpath=ancestor::*[self::div or self::article][.//button[contains(., 'Details')]][1]");

  await expect(liveOnlyCard.getByLabel("View source code")).toHaveCount(0);
  await expect(liveOnlyCard.getByLabel("View live demo")).toHaveAttribute(
    "href",
    "https://www.carbonethics.co",
  );
});
