import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, css, html] = await Promise.all([
  readFile(new URL("../app.js", import.meta.url), "utf8"),
  readFile(new URL("../style.css", import.meta.url), "utf8"),
  readFile(new URL("../index.html", import.meta.url), "utf8")
]);

test("opening a tool locks the background page and enables the dedicated view", () => {
  assert.match(app, /document\.body\.classList\.add\("tool-open"\)/);
  assert.match(app, /document\.body\.style\.overflow="hidden"/);
  assert.match(css, /body\.tool-open\s*\{\s*overflow:\s*hidden;/);
});

test("the tool workspace covers the full viewport and scrolls independently", () => {
  assert.match(css, /body\.tool-open #workspace\s*\{[\s\S]*?position:\s*fixed\s*!important/);
  assert.match(css, /inset:\s*0\s*!important/);
  assert.match(css, /width:\s*100%\s*!important/);
  assert.match(css, /height:\s*100dvh\s*!important/);
  assert.match(css, /overflow-y:\s*auto\s*!important/);
  assert.match(css, /background:\s*var\(--bg\)\s*!important/);
});

test("the previous page chrome is hidden while a tool is active", () => {
  assert.match(css, /body\.tool-open > \.welcome-marquee,[\s\S]*?body\.tool-open > header,[\s\S]*?body\.tool-open > footer\s*\{\s*display:\s*none\s*!important/);
  assert.match(html, /id="workspace"/);
});

test("closing a tool restores normal page scrolling", () => {
  assert.match(app, /document\.body\.classList\.remove\("tool-open"\)/);
  assert.match(app, /document\.body\.style\.removeProperty\("overflow"\)/);
});
