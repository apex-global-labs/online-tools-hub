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

test("text-result tools expose a wired Copy action", () => {
  for (const id of ["case", "slug", "diff", "markdown", "base64", "json", "url", "meta", "csvjson", "uuid", "sha256", "password", "image64", "color", "forexcalc", "unit", "age", "counter", "duplines"]) {
    assert.ok(markup.includes(`case "${id}":`), `missing markup branch for ${id}`);
    assert.ok(wiring.includes(`case "${id}":`), `missing wiring branch for ${id}`);
  }
  for (const id of ["diff", "forexcalc", "unit", "age"]) {
    const at = markup.indexOf(`case "${id}":`);
    const next = markup.slice(at).search(/\n\s*case "|\n\s*default:/);
    const body = markup.slice(at, next < 0 ? undefined : at + next);
    assert.match(body, /btn\("copy","Copy result",false\)/, `${id} should offer Copy result`);
  }
  assert.match(markup, /btn\("copy","Copy preview text",false\)/, "Markdown preview should offer Copy preview text");
  assert.match(wiring, /bind\("copy",\(\)=>copyOutput\("markdownPreview"\)\)/, "Markdown Copy should target the rendered preview");
});

test("QR download action is wired and guards against missing output", () => {
  assert.match(markup, /btn\("downloadQR","Download PNG",false\)/);
  assert.match(wiring, /bind\("downloadQR",\(\)=>\{const c=\$\("#qrCanvas"\);if\(!c\)/);
  assert.match(wiring, /a\.download="toolnest-qr\.png"/);
});

test("clipboard helper handles unavailable clipboard APIs and empty results", () => {
  assert.match(app, /if\(!el\|\|!text\.trim\(\)\)/);
  assert.match(app, /if\(!navigator\.clipboard\?\.writeText\)/);
  assert.match(app, /Clipboard access is unavailable/);
});
