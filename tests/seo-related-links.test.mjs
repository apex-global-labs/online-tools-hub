import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const catalogue = JSON.parse(await readFile(new URL("../js/tools-data.json", import.meta.url), "utf8"));
const known = new Set(catalogue.map(tool => tool.slug));
const pages = {
  "pdf-page-organizer": ["advanced-pdf-merger", "pdf-splitter", "pdf-images-extractor"],
  "text-sorter": ["duplicate-lines-remover", "find-replace", "word-character-counter"],
  "find-replace": ["text-sorter", "text-case-converter", "text-diff-checker"],
  "jwt-decoder": ["json-formatter", "base64-encoder-decoder", "xml-formatter"],
  "xml-formatter": ["json-formatter", "html-entity-encoder-decoder", "jwt-decoder"],
  "pdf-images-extractor": ["pdf-to-image", "pdf-text-extractor", "image-to-pdf"],
  "zip-file-manager": ["pdf-splitter", "pdf-images-extractor", "image-to-pdf"],
  "favicon-generator": ["image-resizer", "image-format-converter", "image-cropper"],
  "url-shortener": ["qr-generator", "slug-generator", "url-encode-decode"],
  "advanced-pdf-merger": ["pdf-splitter", "pdf-page-organizer", "pdf-images-extractor"]
};

for (const [slug, expected] of Object.entries(pages)) {
  test(slug + " guide has three relevant internal tool links", async () => {
    const html = await readFile(new URL("../tools/" + slug + "/index.html", import.meta.url), "utf8");
    const section = html.match(/<section class="panel" aria-labelledby="related-tools">([\s\S]*?)<\/section>/);
    assert.ok(section, "related tools section must exist");
    const links = [...section[1].matchAll(/href="https:\/\/apex-global-labs\.github\.io\/online-tools-hub\/tools\/([a-z0-9-]+)\//g)].map(match => match[1]);
    assert.deepEqual(links, expected);
    assert.equal(new Set(links).size, 3, "links must be unique");
    for (const target of links) assert.ok(known.has(target), "target must exist in catalogue: " + target);
  });
}
