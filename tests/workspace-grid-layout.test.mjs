import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [html, css, app] = await Promise.all([
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../css/workspace-grid-layout.css", import.meta.url), "utf8"),
  readFile(new URL("../app.js", import.meta.url), "utf8")
]);

test("workspace is a direct body child with semantic sidebar and main content", () => {
  const mainEnd = html.indexOf("</main>");
  const workspaceStart = html.indexOf('<section id="workspace"');
  assert.ok(mainEnd > -1 && workspaceStart > mainEnd, "workspace must sit outside the constrained homepage main");
  assert.match(html, /<aside class="workspace-sidebar"/);
  assert.match(html, /<main class="workspace-content"/);
  assert.match(html, /id="toolPanel"/);
  assert.match(html, /id="closeWorkspace"/);
});

test("desktop workspace uses a two-column grid without fixed-position overlap", () => {
  assert.match(css, /grid-template-columns:\s*minmax\(15rem, 19rem\) minmax\(0, 1fr\)/);
  assert.match(css, /body\.tool-open > #workspace\s*\{[\s\S]*?display:\s*grid\s*!important/);
  assert.match(css, /body\.tool-open > \.welcome-marquee,[\s\S]*?body\.tool-open > main,[\s\S]*?display:\s*none\s*!important/);
  assert.doesNotMatch(css, /position:\s*fixed/);
});

test("workspace panes constrain overflow and allow independent scrolling", () => {
  assert.match(css, /\.workspace-sidebar\s*\{[\s\S]*?overflow-y:\s*auto/);
  assert.match(css, /\.workspace-content\s*\{[\s\S]*?overflow-y:\s*auto/);
  assert.match(css, /min-width:\s*0/);
  assert.match(css, /min-height:\s*0/);
});

test("mobile workspace switches to a stacked single-column layout", () => {
  assert.match(css, /@media\s*\(max-width:\s*760px\)[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(css, /@media\s*\(max-width:\s*380px\)/);
});

test("opening and closing a tool continue to toggle the workspace state", () => {
  assert.match(app, /document\.body\.classList\.add\("tool-open"\)/);
  assert.match(app, /document\.body\.classList\.remove\("tool-open"\)/);
  assert.match(app, /workspace\.classList\.remove\("hidden"\)/);
  assert.match(app, /workspace\.classList\.add\("hidden"\)/);
});
