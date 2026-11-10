import { test, expect } from "@playwright/test";

// Secondary text (card descriptions, footer links, footer note) sat at about 2.4:1 on the beige cards, which read as
// "washed out". WCAG asks for 4.5:1 for small text. The ratio is measured from the real computed colours, composited
// over the nearest opaque background.
const contrastOf = (locator) =>
  locator.evaluate((el) => {
    const parse = (c) => {
      const m = c.match(/rgba?\(([^)]+)\)/);
      const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
      return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] };
    };
    const mix = (fg, bg, a) => ({ r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a) });
    const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);

    // static colours only: entrance animations fade ancestors in from opacity 0, which says nothing about the design
    const layers = [];
    for (let n = el; n; n = n.parentElement) {
      const bg = parse(getComputedStyle(n).backgroundColor);
      if (bg.a > 0) layers.push(bg);
      if (bg.a >= 1) break;
    }
    let base = { r: 255, g: 255, b: 255 };
    for (const l of layers.reverse()) base = mix(l, base, l.a);
    const color = parse(getComputedStyle(el).color);
    const fg = mix(color, base, color.a);
    const [hi, lo] = [lum(fg), lum(base)].sort((a, b) => b - a);
    return (hi + 0.05) / (lo + 0.05);
  });

for (const theme of ["light", "dark"]) {
  test(`secondary text stays readable in ${theme} mode`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
    await page.goto("/projects");

    const checks = {
      "project card description": page.locator("[data-project-card] p").first(),
      "footer link": page.locator("footer a").first(),
      "footer note": page.locator("footer p").first(),
    };
    for (const [name, locator] of Object.entries(checks)) {
      await expect(locator, name).toBeAttached();
      const ratio = await contrastOf(locator);
      expect(ratio, `${name} contrast in ${theme} mode`).toBeGreaterThanOrEqual(4.5);
    }

    // the title sits on the image, whose bottom fades into the card colour: ink on beige in light mode, white on dark green
    await expect(page.locator("[data-project-card] h3").first()).toHaveCSS("color", theme === "light" ? "rgb(35, 43, 32)" : "rgb(255, 255, 255)");
  });
}
