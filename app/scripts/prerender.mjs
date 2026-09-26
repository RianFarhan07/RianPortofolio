// Prerender every route to static HTML after `vite build`.
//
// Why: this is a client-rendered SPA, so without this every URL ships the same
// empty shell — identical <title>/<canonical> on all five routes, and no
// content at all for crawlers that don't execute JavaScript.
//
// How: boot `vite preview` over dist/, let React render each route for real,
// then write the resulting document back to disk. SeoManager has already
// rewritten the head by then, so per-route metadata gets baked in for free.
//
// Routes come from src/seo/seoConfig.js — ADD NEW ROUTES THERE. A route that
// exists in App.jsx but not in seoConfig will 404 on direct navigation.

import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const PORT = 4193;
const ORIGIN = `http://localhost:${PORT}`;
const DIST = "dist";
const SETTLE_MS = 5000;

const { ROUTE_SEO } = await import(
  pathToFileURL(join(process.cwd(), "src/seo/seoConfig.js")).href
);

// "/" -> dist/index.html, "/projects" -> dist/projects.html (Firebase cleanUrls).
const targets = [
  ...Object.keys(ROUTE_SEO).map((route) => ({
    route,
    file: route === "/" ? "index.html" : `${route.slice(1)}.html`,
  })),
  // Firebase serves this with a real 404 status when nothing else matches.
  { route: "/__not-found__", file: "404.html" },
];

const server = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["vite", "preview", "--port", String(PORT), "--strictPort"],
  { stdio: "ignore", shell: process.platform === "win32" }
);

async function waitForServer(timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(ORIGIN);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`vite preview did not come up on ${ORIGIN}`);
}

// GSAP and framer-motion park off-screen elements at opacity:0 / visibility:hidden
// until they scroll into view. Snapshotting that state would ship hidden text —
// worse than no prerender at all — so force them visible.
//
// Only opacity and visibility. Transforms are deliberately left alone: the hero
// centers itself with translateX(-50%), and clearing that shoves the layout
// sideways in the pre-hydration paint. Reveal offsets are a few px of y and
// cost far less than breaking real positioning.
function revealAll() {
  for (const el of document.querySelectorAll("#root [style]")) {
    const s = el.style;
    if (s.opacity !== "" && Number(s.opacity) < 1) s.opacity = "1";
    if (s.visibility === "hidden") s.visibility = "visible";
  }
}

let browser;
try {
  await waitForServer();
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  for (const { route, file } of targets) {
    await page.goto(`${ORIGIN}${route}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready.then(() => true));
    await page.waitForTimeout(SETTLE_MS);

    // Walk the page so scroll-triggered sections actually mount and render.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 220));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);

    await page.evaluate(revealAll);

    // 404.html is served at whatever URL missed, so a canonical baked from the
    // placeholder route would point somewhere meaningless. noindex carries it.
    if (file === "404.html") {
      await page.evaluate(() =>
        document.head.querySelector('link[rel="canonical"]')?.remove()
      );
    }

    const html = await page.content();
    const out = join(DIST, file);
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, html, "utf8");

    const kb = Math.round(Buffer.byteLength(html) / 1024);
    const title = await page.title();
    console.log(`  ${route.padEnd(18)} -> ${file.padEnd(18)} ${String(kb).padStart(4)} KB  "${title}"`);
  }
} finally {
  await browser?.close();
  server.kill();
}

console.log(`\nPrerendered ${targets.length} routes into ${DIST}/`);
