import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

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

test("catalogue and router metadata contain the same 20 unique tool IDs", () => {
  assert.equal(catalogIds.length, 20);
  assert.equal(new Set(catalogIds).size, catalogIds.length);
  assert.equal(metadata.length, 20);
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
  const copyTools = ["case", "slug", "diff", "markdown", "base64", "json", "url", "meta", "csvjson", "uuid", "sha256", "password", "image64", "color", "forexcalc", "unit", "age", "counter", "duplines"];
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

test("premium QR Studio exposes custom controls, presets and guarded downloads", () => {
  assert.match(markup, /id="qrForeground"/);
  assert.match(markup, /id="qrBackground"/);
  assert.match(markup, /id="qrDotStyle"/);
  assert.match(markup, /id="qrLogoFile"/);
  assert.match(markup, /id="qrArtFile"/);
  assert.match(markup, /data-qr-preset="default"/);
  assert.match(markup, /data-qr-preset="blue"/);
  assert.match(markup, /data-qr-preset="gradient"/);
  assert.match(markup, /id="generate"[^>]*>Generate QR/);
  assert.match(wiring, /let qr=null/);
  assert.match(wiring, /if\(!qr\)\{qr=new QRCodeStyling\(config\);qr\.append\(qrOutput\);\}/);
  assert.match(markup, /id="qrDownloadPng"/);
  assert.match(markup, /id="qrDownloadSvg"/);
  assert.match(wiring, /qrDownloadPng.*download\("png"\)/);
  assert.match(wiring, /qrDownloadSvg.*download\("svg"\)/);
  assert.match(wiring, /if\(!\$\("#qrText"\)\.value\.trim\(\)\)/);
  assert.match(wiring, /a\.download="toolnest-qr\.png"/);
  assert.match(wiring, /getRawData\("svg"\)/);
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
