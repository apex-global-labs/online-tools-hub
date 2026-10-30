import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const app = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const metadata = JSON.parse(readFileSync(new URL("../js/tools-data.json", import.meta.url), "utf8"));

const catalogStart = app.indexOf("const tools = [");
const catalogEnd = app.indexOf("\n];", catalogStart);
assert.notEqual(catalogStart, -1, "app.js should declare the tool catalogue");
assert.notEqual(catalogEnd, -1, "app.js tool catalogue should be closed");
const catalog = app.slice(catalogStart, catalogEnd);
const catalogIds = [...catalog.matchAll(/\{id:"([^"]+)",name:"([^"]+)"/g)].map((match) => match[1]);

const markupStart = app.indexOf("function toolMarkup(id)");
const markupEnd = app.indexOf("// CSV parser", markupStart);
const markup = app.slice(markupStart, markupEnd);
const wireStart = app.indexOf("function wireTool(id)");
const wiring = app.slice(wireStart);

function getBranch(source, id) {
  const marker = `case "${id}":`;
  const start = source.indexOf(marker);
  if (start < 0) return "";
  const rest = source.slice(start + marker.length);
  const next = rest.search(/\s+case "[a-z0-9]+":|\s+default:/);
  return source.slice(start, next < 0 ? source.length : start + marker.length + next);
}

test("catalogue and router metadata contain the same 43 unique tool IDs", () => {
  assert.equal(catalogIds.length, 43);
  assert.equal(new Set(catalogIds).size, catalogIds.length);
  assert.equal(metadata.length, 43);
  assert.equal(new Set(metadata.map((tool) => tool.id)).size, metadata.length);
  assert.deepEqual([...metadata.map((tool) => tool.id)].sort(), [...catalogIds].sort());
  assert.equal(new Set(metadata.map((tool) => tool.slug)).size, metadata.length);
  assert.ok(metadata.every((tool) => /^[a-z0-9-]+$/.test(tool.slug)));
});

test("every catalogue tool has markup and an event-wiring branch", () => {
  for (const id of catalogIds) {
    assert.ok(markup.includes(`case "${id}":`), `missing markup for ${id}`);
    assert.ok(wiring.includes(`case "${id}":`), `missing event wiring for ${id}`);
  }
});

test("all text-result tools expose a wired Copy action", () => {
  const copyTools = ["case", "slug", "diff", "markdown", "base64", "json", "url", "meta", "csvjson", "uuid", "sha256", "password", "image64", "color", "forexcalc", "unit", "age", "counter", "duplines", "timestamp", "whitespace", "htmlentities", "loremipsum", "percentage", "compound", "emi", "area", "land", "timezone", "numberwords", "robots", "sitemap", "gradient"];
  for (const id of copyTools) {
    assert.match(getBranch(markup, id), /btn\("copy"/, `${id} should show a Copy button`);
    assert.match(getBranch(wiring, id), /bind\("copy"/, `${id} should wire its Copy button`);
  }
  assert.match(getBranch(markup, "markdown"), /btn\("copy","Copy preview text",false\)/);
  assert.match(getBranch(wiring, "markdown"), /bind\("copy",\(\)=>copyOutput\("markdownPreview"\)\)/);
  for (const id of ["diff", "forexcalc", "unit", "age"]) {
    assert.match(getBranch(markup, id), /btn\("copy","Copy result",false\)/);
  }
});

test("every tool workspace receives universal Copy, Download and Clear actions", () => {
  assert.match(app, /universal-tool-actions/);
  assert.match(app, /id="universalCopy"/);
  assert.match(app, /id="universalDownload"/);
  assert.match(app, /id="universalClear"/);
  assert.match(app, /function wireUniversalActions\(id\)/);
  assert.match(app, /bind\("universalCopy"/);
  assert.match(app, /bind\("universalDownload"/);
  assert.match(app, /bind\("universalClear"/);
  assert.match(app, /toolnest-"\+id\+"-result\.txt/);
  assert.match(app, /a\.download="toolnest-qr\.png"/);
  assert.match(app, /panel\.querySelectorAll\("input,textarea"\)/);
});

test("QR Studio supports default/custom modes, five palettes, five shapes, high correction and image blending", () => {
  assert.match(markup, /id="qrDefaultMode"/);
  assert.match(markup, /id="qrCustomMode"/);
  assert.match(markup, /id="qrCustomPanel"/);
  assert.match(markup, /input\("qrText","Text or URL"/);
  assert.match(markup, /data-qr-palette="classic"/);
  assert.match(markup, /data-qr-palette="ocean"/);
  assert.match(markup, /data-qr-palette="emerald"/);
  assert.match(markup, /data-qr-palette="sunset"/);
  assert.match(markup, /data-qr-palette="royal"/);
  for (const shape of ["square","dots","rounded","classy","extra-rounded"]) assert.ok(markup.includes('value="'+shape+'"'));
  assert.match(markup, /id="qrBlendFile"/);
  assert.match(markup, /id="qrBlendOpacity"[^>]*min="20" max="60" value="50"/);
  assert.match(markup, /qrBlendValue">50%/);
  assert.match(wiring, /qrBlendOpacity.*value="50"/);
  assert.match(markup, /id="qrCanvas"/);
  assert.match(markup, /id="generate"[^>]*>Generate QR/);
  assert.match(markup, /id="qrDownloadPng"/);
  assert.match(markup, /id="qrDownloadSvg"/);
  assert.match(wiring, /errorCorrectionLevel:"H"/);
  assert.match(wiring, /QRCodeStyling/);
  assert.match(wiring, /ctx\.drawImage\(art/);
  assert.match(wiring, /ctx\.globalAlpha=opacity/);
  assert.match(wiring, /qr\.download\(\{name:"toolnest-qr",extension:"svg"\}\)/);
  assert.match(wiring, /canvas\.toBlob/);
  assert.match(wiring, /function\s+drawCanvas|const drawCanvas=/);
});
test("universal Clear delegates QR Studio to its state-aware reset handler", () => {
  assert.match(app, /if\(id===\"qr\"\)\{\s*\$\(\"#qrClear\"\)\?\.click\(\);\s*return;\s*\}/);
  assert.match(getBranch(wiring, "qr"), /\$\(\"#qrClear\"\)\.addEventListener\(\"click\"/);
});

test("clipboard helper handles unavailable clipboard APIs and empty results", () => {
  assert.match(app, /if\(!el\|\|!text\.trim\(\)\)/);
  assert.match(app, /if\(!navigator\.clipboard\?\.writeText\)/);
  assert.match(app, /Clipboard access is unavailable/);
});

test("input handlers reject invalid edge cases", () => {
  assert.match(getBranch(wiring, "unit"), /below absolute zero/);
  assert.match(getBranch(wiring, "age"), /Start date cannot be in the future/);
  assert.match(getBranch(wiring, "meta"), /valid HTTP or HTTPS canonical URL/);
  assert.match(getBranch(wiring, "image64"), /10 MB/);
});

test("category cards use JSON metadata with a safe local fallback", () => {
  assert.match(app, /fetch\("js\/tools-data\.json"\)/);
  assert.match(app, /cardTools = nextCards/);
  assert.match(app, /\.catch\(error => \{/);
  assert.ok(metadata.every((tool) => typeof tool.description === "string" && tool.description.length > 0));
  assert.ok(metadata.every((tool) => typeof tool.tagline === "string" && tool.tagline.length > 0));
});

test("category labels and responsive grid match the Phase 3 layout", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const css = readFileSync(new URL("../css/phase3-category-grid.css", import.meta.url), "utf8");
  for (const category of ["All Tools", "Text Utilities", "Image Tools", "Dev Tools", "Calculators", "Utilities"]) {
    assert.ok(html.includes(category), `missing category label: ${category}`);
  }
  assert.match(css, /justify-content: center/);
  assert.match(css, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
});

test("Phase 4 workspace template includes breadcrumb, status toast and dedicated workspace styling", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const css = readFileSync(new URL("../css/phase4-workspace.css", import.meta.url), "utf8");
  assert.match(html, /id="workspaceBreadcrumb"/);
  assert.match(html, /id="toastNotice"/);
  assert.match(html, /aria-label="Breadcrumb"/);
  assert.match(css, /\.workspace-main-card/);
  assert.match(css, /\.toolnest-toast/);
  assert.match(css, /prefers-reduced-motion/);
});

test("workspace supports slug routes, legacy ID routes and a visible 404 state", () => {
  assert.match(app, /window\.showToolNotFound=showToolNotFound/);
  assert.match(app, /404 — Tool Not Found/);
  assert.match(app, /#\/tools\/\$\{slug\}/);
  assert.match(app, /#tool\/\$\{id\}/);
  assert.match(app, /function showToast\(/);
  assert.match(app, /toastTimer=setTimeout/);
});

test("Phase 10 tools remain complete after Phase 11 adds a new text utility", () => {
  const newIds = ["timestamp", "whitespace", "htmlentities", "imageresize", "imagecompress", "pdfsplitter"];
  assert.equal(catalogIds.length, 43);
  assert.equal(metadata.length, 43);
  for (const id of newIds) {
    assert.ok(catalogIds.includes(id), "catalogue should include " + id);
    assert.ok(markup.includes('case "' + id + '":'), "markup should include " + id);
    assert.ok(wiring.includes('case "' + id + '":'), "event wiring should include " + id);
    assert.ok(metadata.some(tool => tool.id === id && tool.seo?.faqs?.length >= 3), "SEO metadata should include " + id);
  }
  assert.equal(new Set(metadata.map(tool => tool.slug)).size, 42);
});

test("Phase 10 image tools validate local file type and size and support downloadable output", () => {
  for (const id of ["imageresize", "imagecompress"]) {
    assert.match(getBranch(wiring, id), /10 MB/);
    assert.match(getBranch(wiring, id), /image\/png/);
    assert.match(getBranch(wiring, id), /toBlob/);
    assert.match(getBranch(wiring, id), /URL\.revokeObjectURL/);
    assert.match(getBranch(wiring, id), /clearImage/);
    assert.match(getBranch(markup, id), /btn\("clearImage"/);
  }
  assert.match(app, /output\?\.dataset\.downloadUrl/);
  assert.match(app, /Image download started/);
});

test("Phase 10 text utilities provide guarded timestamp, whitespace and HTML entity actions", () => {
  assert.match(getBranch(wiring, "timestamp"), /supported date range/);
  assert.match(getBranch(wiring, "imageresize"), /40 megapixels/);
  assert.match(getBranch(wiring, "whitespace"), /removeBlankWhitespaceLines/);
  assert.match(getBranch(wiring, "htmlentities"), /createElement\("textarea"\)/);
});

test("app.js passes the Node JavaScript syntax check", () => {
  const file = new URL("../app.js", import.meta.url).pathname;
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout || "app.js syntax check failed");
});

test("Phase 11 Lorem Ipsum Generator is registered, validated and wired for copy", () => {
  assert.ok(catalogIds.includes("loremipsum"));
  assert.match(getBranch(markup, "loremipsum"), /id="loremParagraphs"/);
  assert.match(getBranch(markup, "loremipsum"), /select\("loremSentences"/);
  assert.match(getBranch(markup, "loremipsum"), /id="loremStartStandard"/);
  assert.match(getBranch(wiring, "loremipsum"), /paragraphs<1\|\|paragraphs>10/);
  assert.match(getBranch(wiring, "loremipsum"), /sentences<1\|\|sentences>8/);
  assert.match(getBranch(wiring, "loremipsum"), /bind\("generateLorem"/);
  assert.match(getBranch(wiring, "loremipsum"), /bind\("copy"/);
  assert.ok(metadata.some(tool => tool.id === "loremipsum" && tool.seo?.faqs?.length === 3));
});

test("text counters count Unicode code points and whitespace cleaner accepts whitespace-only input", () => {
  assert.match(getBranch(wiring, "counter"), /Array\.from\(s\)\.length/);
  assert.match(getBranch(wiring, "counter"), /Array\.from\(s\.replace/);
  assert.match(getBranch(wiring, "case"), /Array\.from\(s\)\.length/);
  assert.match(getBranch(wiring, "whitespace"), /if\(!source\.length\)/);
});

test("Phase 12 finance calculators are registered, have markup and safe event wiring", () => {
  for (const id of ["percentage", "compound", "emi"]) {
    assert.ok(catalogIds.includes(id), "catalogue should include " + id);
    assert.match(getBranch(markup, id), /btn\(/);
    assert.ok(wiring.includes('case "' + id + '":'), "wiring should include " + id);
    assert.ok(metadata.some(tool => tool.id === id && tool.seo?.faqs?.length === 3), "SEO metadata should include " + id);
  }
  assert.match(getBranch(markup, "percentage"), /percentageMode/);
  assert.match(getBranch(markup, "compound"), /compoundFrequency/);
  assert.match(getBranch(markup, "emi"), /emiMonths/);
  assert.match(getBranch(wiring, "percentage"), /ToolNestFinance\.calculatePercentage/);
  assert.match(getBranch(wiring, "compound"), /ToolNestFinance\.calculateCompoundInterest/);
  assert.match(getBranch(wiring, "emi"), /ToolNestFinance\.calculateEmi/);
  const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  assert.match(indexHtml, /js\/finance-calculators\.js/);
});

test("Advanced PDF Merger is registered with browser-side page controls and guarded file handling", () => {
  assert.ok(catalogIds.includes("pdfmerge"));
  assert.match(getBranch(markup, "pdfmerge"), /id="pdfMergeFiles"/);
  assert.match(getBranch(markup, "pdfmerge"), /id="pdfMergeUpload"/);
  assert.match(getBranch(markup, "pdfmerge"), /id="pdfMergeRun"/);
  assert.match(getBranch(markup, "pdfmerge"), /id="pdfMergeDownload"/);
  assert.match(getBranch(markup, "pdfmerge"), /id="pdfMergeClear"/);
  assert.match(getBranch(wiring, "pdfmerge"), /ToolNestPdfMerge\?\.init\(\)/);
  const module = readFileSync(new URL("../js/pdf-merge.js", import.meta.url), "utf8");
  assert.match(module, /pdf-lib@1\.17\.1/);
  assert.match(module, /MAX_FILES = 20/);
  assert.match(module, /MAX_FILE_BYTES = 50 \* 1024 \* 1024/);
  assert.match(module, /MAX_TOTAL_BYTES = 200 \* 1024 \* 1024/);
  assert.match(module, /parsePageRange/);
  assert.match(module, /rotate-page/);
  assert.match(module, /page-up/);
  assert.match(module, /file-up/);
  assert.match(module, /dataTransfer\?\.files/);
  assert.match(module, /MAX_PAGES_PER_FILE = 500/);
  assert.match(module, /MAX_TOTAL_PAGES = 2000/);
  assert.match(module, /application\/pdf/);
  assert.doesNotMatch(module, /\bfetch\s*\(/, "PDF files must not be sent to a server from this module");
  assert.match(getBranch(markup, "pdfmerge"), /Files are processed locally in your browser/);
  assert.ok(metadata.some(tool => tool.id === "pdfmerge" && tool.seo?.faqs?.length === 3));
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  assert.match(html, /js\/pdf-merge\.js/);
  assert.match(html, /css\/pdf-merge\.css/);
});

test("PDF merger module passes the Node JavaScript syntax check", () => {
  const file = new URL("../js/pdf-merge.js", import.meta.url).pathname;
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout || "PDF merger syntax check failed");
});
