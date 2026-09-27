import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("prerendered landing keeps content but excludes transient third-party embeds", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");

  assert.match(html, /id="home"/);
  assert.match(html, /id="contact"/);
  assert.doesNotMatch(html, /id="giscus-script"/);
  assert.doesNotMatch(html, /class="giscus-frame"/);
  assert.doesNotMatch(html, /localhost:4193/);
});
