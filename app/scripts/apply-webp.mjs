// Rewrite image refs (.png/.jpg/.jpeg -> .webp) in source code, then delete originals that have a .webp twin.
import { readFile, writeFile, readdir, unlink, access } from "node:fs/promises";
import { join, extname } from "node:path";

const CODE_ROOT = "src";
const CODE_EXT = new Set([".js", ".jsx", ".ts", ".tsx", ".css", ".scss"]);
const DEL_ROOTS = ["src/assets", "public/images"];
const IMG_EXT = new Set([".png", ".jpg", ".jpeg"]);

async function walk(dir, test, acc = []) {
  let es;
  try {
    es = await readdir(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of es) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, test, acc);
    else if (test(e.name)) acc.push(p);
  }
  return acc;
}
const exists = async (p) => {
  try { await access(p); return true; } catch { return false; }
};

// 1) rewrite references in code
const codeFiles = await walk(CODE_ROOT, (n) => CODE_EXT.has(extname(n).toLowerCase()));
let changed = 0;
for (const f of codeFiles) {
  if (f.replace(/\\/g, "/").includes("/scripts/")) continue;
  const src = await readFile(f, "utf8");
  const out = src.replace(/\.(jpe?g|png)\b/gi, ".webp");
  if (out !== src) { await writeFile(f, out); changed++; console.log("  ref:", f.replace(/\\/g, "/")); }
}
console.log(`rewrote refs in ${changed} files`);

// 2) delete originals that have a .webp twin
const imgs = (await Promise.all(DEL_ROOTS.map((r) => walk(r, (n) => IMG_EXT.has(extname(n).toLowerCase()))))).flat();
let del = 0, kept = 0;
for (const f of imgs) {
  const twin = f.replace(/\.(png|jpe?g)$/i, ".webp");
  if (await exists(twin)) { await unlink(f); del++; } else { kept++; console.log("  kept (no twin):", f); }
}
console.log(`deleted ${del} originals, kept ${kept}`);
