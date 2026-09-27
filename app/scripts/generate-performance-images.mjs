import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const variants = [
  ["src/assets/foto_rian_nobg3.webp", "src/assets/foto_rian_nobg3-960.webp", 960, 80],
  ["src/assets/foto_rian_putih.webp", "src/assets/foto_rian_putih-960.webp", 960, 80],
  ["src/assets/foto-nobg-editorial-natural.webp", "src/assets/foto-nobg-editorial-natural-480.webp", 480, 78],
  ["src/assets/foto-nobg-editorial-natural.webp", "src/assets/foto-nobg-editorial-natural-768.webp", 768, 80],
  ...["kelompro", "kostHuntMern", "artelux", "bukukita", "recipedia"].map(
    (name) => [
      `public/images/${name}.webp`,
      `public/images/thumbs/${name}.webp`,
      320,
      74,
    ],
  ),
  ...["hacktiv8", "kompetensi1", "udemy_web", "udemy_kotlin"].map(
    (name) => [
      `public/images/certificates/${name}.webp`,
      `public/images/certificates/previews/${name}.webp`,
      960,
      80,
    ],
  ),
];

for (const [input, output, width, quality] of variants) {
  await mkdir(dirname(output), { recursive: true });
  await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(output);
  console.log(`${input} -> ${output}`);
}
