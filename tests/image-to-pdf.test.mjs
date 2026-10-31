import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const moduleSource = readFileSync(new URL("../js/image-to-pdf.js", import.meta.url), "utf8");
const metadata = JSON.parse(readFileSync(new URL("../js/tools-data.json", import.meta.url), "utf8"));
const guide = readFileSync(new URL("../tools/image-to-pdf/index.html", import.meta.url), "utf8");
const directory = readFileSync(new URL("../tools/index.html", import.meta.url), "utf8");
const sitemap = readFileSync(new URL("../sitemap.xml", import.meta.url), "utf8");
const keywordMap = readFileSync(new URL("../SEO_KEYWORD_MAP.md", import.meta.url), "utf8");
const homepage = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const workflow = readFileSync(new URL("../.github/workflows/tests.yml", import.meta.url), "utf8");

test("Image to PDF is registered once in the application catalogue and router metadata", () => {
  const catalogue = app.slice(app.indexOf("const tools = ["), app.indexOf("\n];", app.indexOf("const tools = [")));
  assert.equal((catalogue.match(/id:"imagepdf"/g) || []).length, 1);
  assert.equal(metadata.filter(tool => tool.id === "imagepdf").length, 1);
  assert.equal(metadata.find(tool => tool.id === "imagepdf").slug, "image-to-pdf");
  assert.equal(metadata.length, 45);
});

test("Image to PDF workspace exposes upload, settings, ordering, preview, download and clear controls", () => {
  assert.match(app, /case "imagepdf":return form/);
  for (const id of ["imagePdfFiles", "imagePdfDrop", "imagePdfList", "imagePdfSummary", "imagePdfPageSize", "imagePdfOrientation", "imagePdfMargin", "imagePdfCreate", "imagePdfPreview", "imagePdfDownload", "imagePdfClear", "imagePdfStatus"]) {
    assert.ok(app.includes('id="' + id + '"'), "missing workspace control " + id);
  }
  assert.match(app, /window\.ToolNestImageToPdf\?\.init\(\)/);
  assert.match(app, /if\(id==="imagepdf"\)\{message\("Image to PDF creates a document/);
  assert.match(app, /if\(id==="imagepdf"\)\{ \$\("#imagePdfDownload"\)\?\.click\(\); return; \}/);
});

test("Image to PDF uses existing pdf-lib lazily and supports PNG and JPEG page embedding", () => {
  assert.match(moduleSource, /https:\/\/unpkg\.com\/pdf-lib@1\.17\.1/);
  assert.match(moduleSource, /output\.embedPng\(item\.bytes\)/);
  assert.match(moduleSource, /output\.embedJpg\(item\.bytes\)/);
  assert.match(moduleSource, /output\.addPage\(\[pageWidth, pageHeight\]\)/);
  assert.match(moduleSource, /page\.drawImage\(embedded/);
  assert.match(moduleSource, /if \(preview && state\.resultUrl\)/);
  assert.match(moduleSource, /download\.disabled = state\.busy \|\| !state\.resultUrl/);
  assert.match(moduleSource, /application\/pdf/);
});

test("Image to PDF validates image signatures, file count, bytes and pixel limits", () => {
  assert.match(moduleSource, /MAX_FILES = 20/);
  assert.match(moduleSource, /MAX_FILE_BYTES = 15 \* 1024 \* 1024/);
  assert.match(moduleSource, /MAX_TOTAL_BYTES = 60 \* 1024 \* 1024/);
  assert.match(moduleSource, /MAX_IMAGE_PIXELS = 40_000_000/);
  assert.match(moduleSource, /validSignature\(bytes, file\.type\)/);
  assert.match(moduleSource, /MAX_TOTAL_PIXELS = 100_000_000/);
});

test("Image to PDF supports A4, Letter, Legal, orientation and margins", () => {
  assert.match(app, /<option value="a4">A4/);
  assert.match(app, /<option value="letter">US Letter/);
  assert.match(app, /<option value="legal">US Legal/);
  assert.match(moduleSource, /orientation === "landscape"/);
  assert.match(moduleSource, /marginMm \* 72 \/ 25\.4/);
});

test("Image to PDF processes files locally without uploading image bytes", () => {
  assert.doesNotMatch(moduleSource, /fetch\s*\(|XMLHttpRequest|navigator\.sendBeacon/);
  assert.match(app, /Images are processed locally in this browser and are not uploaded to ToolNest/);
});

test("Image to PDF guide, directory, sitemap, homepage and keyword map are synchronized", () => {
  assert.match(guide, /<title>Image to PDF - Free Online Tool \| ToolNest<\/title>/);
  assert.match(guide, /rel="canonical"[^>]+tools\/image-to-pdf\//);
  assert.match(guide, /"@type":"FAQPage"/);
  assert.match(guide, /How to Use Image to PDF/);
  assert.match(directory, /tools\/image-to-pdf\//);
  assert.match(sitemap, /tools\/image-to-pdf\//);
  assert.equal((sitemap.match(/<url>/g) || []).length, 46);
  assert.match(keywordMap, /\| 44 \| Image to PDF \| \*\*image to PDF converter\*\*/);
  assert.match(homepage, /js\/image-to-pdf\.js/);
  assert.match(homepage, /css\/image-to-pdf\.css/);
  assert.match(workflow, /node --check js\/image-to-pdf\.js/);
});
