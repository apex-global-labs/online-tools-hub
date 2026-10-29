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

test("input handlers reject invalid edge cases", () => {
  assert.match(getBranch(wiring, "unit"), /below absolute zero/);
  assert.match(getBranch(wiring, "age"), /Start date cannot be in the future/);
  assert.match(getBranch(wiring, "meta"), /valid HTTP or HTTPS canonical URL/);
  assert.match(getBranch(wiring, "image64"), /10 MB/);
});
