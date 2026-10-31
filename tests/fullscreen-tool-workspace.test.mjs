import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, css, html] = await Promise.all([
  readFile(new URL("../app.js", import.meta.url), "utf8"),
  readFile(new URL("../css/workspace-grid-layout.css", import.meta.url), "utf8"),
  readFile(new URL("../index.html", import.meta.url), "utf8")
]);

test("opening a tool locks the background page and enables the dedicated view", () => {
  assert.match(app, /document\.body\.classList\.add\("tool-open"\)/);
  assert.match(app, /document\.body\.style\.overflow="hidden"/);
  assert.match(css, /body\.tool-open\s*\{\s*overflow:\s*hidden;/);
});

test("the tool workspace covers the full viewport and scrolls independently", () => {
  assert.match(css, /body\.tool-open > #workspace\s*\{[\s\S]*?position:\s*relative/);
  assert.match(css, /grid-template-columns:\s*minmax\(15rem, 19rem\) minmax\(0, 1fr\)/);
  assert.match(css, /height:\s*100dvh/);
  assert.match(css, /overflow:\s*hidden/);
  assert.doesNotMatch(css, /position:\s*fixed/);
});

test("the previous page chrome is hidden while a tool is active", () => {
  assert.match(css, /body\.tool-open > \.welcome-marquee,[\s\S]*?body\.tool-open > header,[\s\S]*?body\.tool-open > main,[\s\S]*?body\.tool-open > footer\s*\{\s*display:\s*none\s*!important/);
  assert.match(html, /id="workspace"/);
});

test("closing a tool restores normal page scrolling", () => {
  assert.match(app, /document\.body\.classList\.remove\("tool-open"\)/);
  assert.match(app, /document\.body\.style\.removeProperty\("overflow"\)/);
});
