// Convert PNG/JPG -> WebP (compress + safe resize). Keeps originals; reports savings.
// Usage: node scripts/to-webp.mjs            (dry-ish: just generates .webp)
import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const ROOTS = ["src/assets", "public"];
const MAXW = 1600;   // cap width — tetap tajam buat tampilan apa pun di situs
const QUALITY = 82;
const EXTS = new Set([".png", ".jpg", ".jpeg"]);

async function walk(dir, acc = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, acc);
    else if (EXTS.has(extname(e.name).toLowerCase())) acc.push(p);
  }
  return acc;
}

const kb = (b) => Math.round(b / 1024);

const files = (await Promise.all(ROOTS.map((r) => walk(r)))).flat();
let totalOld = 0,
  totalNew = 0;
const rows = [];

for (const f of files) {
  const out = f.replace(/\.(png|jpe?g)$/i, ".webp");
  try {
    const before = (await stat(f)).size;
    await sharp(f)
      .rotate()
      .resize({ width: MAXW, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(out);
    const after = (await stat(out)).size;
    totalOld += before;
    totalNew += after;
    rows.push({
      file: f.replace(/\\/g, "/"),
      oldKB: kb(before),
      newKB: kb(after),
      saved: Math.round((1 - after / before) * 100) + "%",
    });
  } catch (err) {
    rows.push({ file: f.replace(/\\/g, "/"), oldKB: 0, newKB: 0, saved: "ERR: " + err.message });
  }
}

rows.sort((a, b) => b.oldKB - a.oldKB);
console.table(rows);
console.log(
  `\nTOTAL: ${kb(totalOld)} KB -> ${kb(totalNew)} KB  | saved ${Math.round(
    (1 - totalNew / totalOld) * 100
  )}% (${kb(totalOld - totalNew)} KB), ${files.length} files`
);
