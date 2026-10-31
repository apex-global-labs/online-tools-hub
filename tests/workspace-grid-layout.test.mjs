import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [html, css, app, legacyCss, phase4Css] = await Promise.all([
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../css/workspace-grid-layout.css", import.meta.url), "utf8"),
  readFile(new URL("../app.js", import.meta.url), "utf8"),
  readFile(new URL("../style.css", import.meta.url), "utf8"),
  readFile(new URL("../css/phase4-workspace.css", import.meta.url), "utf8")
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


test("workspace grid stylesheet is the final layout authority", () => {
  const stylesheetLinks = [...html.matchAll(/<link\\b[^>]*rel=["']stylesheet["'][^>]*>/gi)].map(match => match[0]);
  const gridIndex = stylesheetLinks.findIndex(link => /href=["']css\\/workspace-grid-layout\\.css(?:\\?[^"']*)?["']/.test(link));
  assert.ok(gridIndex >= 0, "workspace grid stylesheet must be linked");
  assert.equal(gridIndex, stylesheetLinks.length - 1, "workspace grid stylesheet must load after all other stylesheets");
  assert.doesNotMatch(legacyCss, /body\\.tool-open\\s+#workspace\\s*\\{/,
    "legacy stylesheet must not redefine the workspace container");
  assert.doesNotMatch(legacyCss, /position:\\s*fixed\\s*!important/,
    "legacy fixed overlay declarations must be removed");
  assert.doesNotMatch(phase4Css, /\\.tool-open\\s+#(?:hero|tools|about)/,
    "homepage visibility belongs to the grid layout stylesheet");
});

test("workspace container owns its viewport grid geometry without !important overrides", () => {
  const containerRule = css.match(/body\\.tool-open\\s*>\\s*#workspace\\s*\\{([^}]*)\\}/);
  assert.ok(containerRule, "direct-child workspace container rule must exist");
  assert.match(containerRule[1], /position:\\s*relative/);
  assert.match(containerRule[1], /display:\\s*grid\\s*!important/);
  assert.match(containerRule[1], /height:\\s*100dvh/);
  assert.match(containerRule[1], /overflow:\\s*hidden/);
  assert.doesNotMatch(containerRule[1], /position:\\s*fixed/);
});
