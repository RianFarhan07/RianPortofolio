// Add loading="lazy" decoding="async" to below-the-fold <img> tags (skips hero/LCP images).
import { readFile, writeFile } from "node:fs/promises";

const FILES = [
  "src/components/CertificateModal.jsx",
  "src/components/CardRotate.jsx",
  "src/components/About.jsx",
  "src/components/AboutPreview.jsx",
  "src/components/ProjectCard.jsx",
  "src/components/ProjectModal.jsx",
  "src/components/ProjectPreview.jsx",
  "src/components/TechScroll.jsx",
  "src/components/BounceCards.jsx",
];

let total = 0;
for (const f of FILES) {
  let s;
  try { s = await readFile(f, "utf8"); } catch { console.log("skip (missing):", f); continue; }
  const before = (s.match(/loading="lazy"/g) || []).length;
  const out = s.replace(/<img(?![^>]*\bloading=)/g, '<img loading="lazy" decoding="async"');
  if (out !== s) {
    await writeFile(f, out);
    const added = (out.match(/loading="lazy"/g) || []).length - before;
    total += added;
    console.log(`  +${added}  ${f}`);
  }
}
console.log(`added lazy/async to ${total} <img> tags`);
