import { mkdir, writeFile } from "node:fs/promises";

const fonts = [
  [
    "https://fonts.gstatic.com/s/dmsans/v17/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu0-K4.woff2",
    "public/fonts/dm-sans-latin.woff2",
  ],
  [
    "https://fonts.gstatic.com/s/syne/v24/8vIH7w4qzmVxm2BL9A.woff2",
    "public/fonts/syne-latin.woff2",
  ],
];

await mkdir("public/fonts", { recursive: true });

for (const [url, output] of fonts) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Unable to download ${url}: ${response.status}`);
  }
  await writeFile(output, Buffer.from(await response.arrayBuffer()));
  console.log(`${url} -> ${output}`);
}
