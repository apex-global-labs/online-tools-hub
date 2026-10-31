import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const moduleSource = readFileSync(new URL("../js/pdf-splitter.js", import.meta.url), "utf8");
const metadata = JSON.parse(readFileSync(new URL("../js/tools-data.json", import.meta.url), "utf8"));
const guide = readFileSync(new URL("../tools/pdf-splitter/index.html", import.meta.url), "utf8");
const directory = readFileSync(new URL("../tools/index.html", import.meta.url), "utf8");
const sitemap = readFileSync(new URL("../sitemap.xml", import.meta.url), "utf8");
const keywordMap = readFileSync(new URL("../SEO_KEYWORD_MAP.md", import.meta.url), "utf8");

test("PDF Splitter is registered once in the application catalogue and router metadata", () => {
  const catalogue = app.slice(app.indexOf("const tools = ["), app.indexOf("\n];", app.indexOf("const tools = [")));
  assert.equal((catalogue.match(/id:"pdfsplitter"/g) || []).length, 1);
  assert.equal(metadata.filter(tool => tool.id === "pdfsplitter").length, 1);
  assert.equal(metadata.find(tool => tool.id === "pdfsplitter").slug, "pdf-splitter");
  assert.equal(metadata.length, 49);
});

test("PDF Splitter workspace exposes upload, page selection, range, split, download and clear controls", () => {
  assert.match(app, /case "pdfsplitter":return form/);
  for (const id of ["pdfSplitFiles", "pdfSplitPages", "pdfSplitRange", "pdfSplitApplyRange", "pdfSplitSelectAll", "pdfSplitSelectNone", "pdfSplitRun", "pdfSplitDownload", "pdfSplitClear", "pdfSplitStatus"]) {
    assert.ok(app.includes('id="' + id + '"'), "missing workspace control " + id);
  }
  assert.match(app, /window\.ToolNestPdfSplitter\?\.init\(\)/);
});

test("PDF Splitter loads pdf-lib and JSZip lazily and performs browser-side page copying", () => {
  assert.match(moduleSource, /https:\/\/unpkg\.com\/pdf-lib@1\.17\.1/);
  assert.match(moduleSource, /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/jszip\/3\.10\.1/);
  assert.match(moduleSource, /await output\.copyPages\(source, \[page\.index\]\)/);
  assert.match(moduleSource, /new Blob\(\[bytes\], \{ type: "application\/pdf" \}\)/);
  assert.match(moduleSource, /zip\.file\(item\.name, item\.blob\)/);
  assert.match(moduleSource, /state\.outputs\.length === 1/);
});

test("PDF Splitter validates file signatures, file size and page count before processing", () => {
  assert.match(moduleSource, /30 \* 1024 \* 1024/);
  assert.match(moduleSource, /MAX_PAGES = 300/);
  assert.match(moduleSource, /!== "%PDF-"/);
  assert.match(moduleSource, /count > MAX_PAGES/);
  assert.match(moduleSource, /ignoreEncryption: false/);
});

test("PDF Splitter supports range syntax and rejects out-of-range page numbers", () => {
  assert.match(moduleSource, /function parseRange\(value, count\)/);
  assert.match(moduleSource, /\(\\d\+\)\(\?:\\s\*-\\s\*\(\\d\+\)\)\?/);
  assert.match(moduleSource, /end > count/);
  assert.match(moduleSource, /window\.ToolNestPdfSplitter = \{ init, clear, split, download, parseRange \}/);
});

test("PDF Splitter has no upload endpoint and does not send PDF bytes to a server", () => {
  assert.doesNotMatch(moduleSource, /fetch\s*\(|XMLHttpRequest|navigator\.sendBeacon/);
  assert.match(app, /PDF files are processed locally in this browser and are not uploaded to ToolNest/);
});

test("PDF Splitter guide includes unique metadata, instructions, FAQs and related PDF links", () => {
  assert.match(guide, /<title>PDF Splitter - Free Online Tool \| ToolNest<\/title>/);
  assert.match(guide, /rel="canonical"[^>]+tools\/pdf-splitter\//);
  assert.match(guide, /"@type":"FAQPage"/);
  assert.match(guide, /How to Use PDF Splitter/);
  assert.match(guide, /advanced-pdf-merger/);
  assert.match(guide, /#/);
  assert.match(directory, /tools\/pdf-splitter\//);
});

test("PDF Splitter is represented in the canonical sitemap and keyword map", () => {
  assert.match(sitemap, /tools\/pdf-splitter\//);
  assert.equal((sitemap.match(/<url>/g) || []).length, 51);
  assert.match(keywordMap, /\| 42 \| PDF Splitter \| \*\*split PDF pages\*\*/);
});
