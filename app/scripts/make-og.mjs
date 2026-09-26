// Generate the Open Graph image (1200x630) from the hero portrait.
// Usage: node scripts/make-og.mjs
import sharp from "sharp";
import { stat } from "node:fs/promises";

const W = 1200;
const H = 630;
const BG = "#0d1520";
const AC = "#e0a83a";
const SRC = "src/assets/foto_rian_nobg3.webp";
const OUT_JPG = "public/og-image.jpg";
const OUT_WEBP = "public/og-image.webp";

const kb = (b) => Math.round(b / 1024);

// Crop the transparent padding so the subject can be placed precisely.
const portrait = await sharp(SRC)
  .trim({ threshold: 1 })
  .resize({ height: Math.round(H * 0.96), withoutEnlargement: false })
  .toBuffer();
const pm = await sharp(portrait).metadata();

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const FONT = "Syne, Segoe UI, Helvetica Neue, Arial, sans-serif";

const layer = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${AC}" stop-opacity="0.16"/>
      <stop offset="60%" stop-color="${AC}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${BG}" stop-opacity="1"/>
      <stop offset="55%" stop-color="${BG}" stop-opacity="0.92"/>
      <stop offset="100%" stop-color="${BG}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- scan lines: the site's identity -->
  <g opacity="0.05">
    ${Array.from({ length: Math.ceil(H / 4) }, (_, i) => `<rect x="0" y="${i * 4}" width="${W}" height="1" fill="#ffffff"/>`).join("")}
  </g>

  <!-- corner brackets -->
  <path d="M48 48 h54 M48 48 v54" stroke="${AC}" stroke-width="3" fill="none" opacity="0.85"/>
  <path d="M${W - 48} ${H - 48} h-54 M${W - 48} ${H - 48} v-54" stroke="${AC}" stroke-width="3" fill="none" opacity="0.85"/>
</svg>`);

const textLayer = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${Math.round(W * 0.66)}" height="${H}" fill="url(#f2)"/>
  <defs>
    <linearGradient id="f2" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${BG}" stop-opacity="0.96"/>
      <stop offset="70%" stop-color="${BG}" stop-opacity="0.86"/>
      <stop offset="100%" stop-color="${BG}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <text x="96" y="214" font-family="${FONT}" font-size="26" font-weight="600"
        letter-spacing="7" fill="${AC}">${esc("BASO RIAN FARHAN MALLANTI")}</text>

  <text x="96" y="306" font-family="${FONT}" font-size="72" font-weight="800"
        letter-spacing="-1.5" fill="#e7edf5">${esc("Full Stack &")}</text>
  <text x="96" y="386" font-family="${FONT}" font-size="72" font-weight="800"
        letter-spacing="-1.5" fill="#e7edf5">${esc("Android Developer")}</text>

  <rect x="96" y="424" width="72" height="3" fill="${AC}"/>

  <text x="96" y="482" font-family="${FONT}" font-size="30" font-weight="400"
        fill="#9fb0c4">${esc("20+ apps shipped end-to-end")}</text>
  <text x="96" y="528" font-family="${FONT}" font-size="26" font-weight="400"
        fill="#6d7f93">${esc("Makassar, Indonesia  ·  rianfarhan.my.id")}</text>
</svg>`);

const canvas = sharp(layer)
  .composite([
    { input: portrait, top: Math.round((H - pm.height) / 2), left: W - pm.width - 24 },
    { input: textLayer, top: 0, left: 0 },
  ])
  .flatten({ background: BG });

await canvas.clone().jpeg({ quality: 86, mozjpeg: true }).toFile(OUT_JPG);
await canvas.clone().webp({ quality: 86 }).toFile(OUT_WEBP);

for (const f of [OUT_JPG, OUT_WEBP]) {
  console.log(`${f}  ${kb((await stat(f)).size)} KB`);
}
