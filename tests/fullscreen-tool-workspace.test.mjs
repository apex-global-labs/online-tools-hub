import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, css, html] = await Promise.all([
  readFile(new URL("../app.js", import.meta.url), "utf8"),
  readFile(new URL("../css/workspace-grid-layout.css", import.meta.url), "utf8"),
  readFile(new URL("../index.html", import.meta.url), "utf8")
]);

test("opening a tool enables the in-flow workspace without locking the document", () => {
  assert.match(app, /document\.body\.classList\.add\("tool-open"\)/);
  assert.doesNotMatch(app, /document\.body\.style\.overflow\s*=\s*["']hidden["']/);
  assert.doesNotMatch(css, /body\.tool-open\s*\{\s*overflow:\s*hidden/);
});

test("workspace uses a normal-flow desktop grid and natural page scrolling", () => {
  assert.match(css, /grid-template-columns:\s*minmax\(16rem, 20rem\) minmax\(0, 1fr\)/);
  assert.match(css, /min-height:\s*calc\(100dvh - 5rem\)/);
  assert.match(css, /overflow:\s*visible/);
  const container = css.match(/body\.tool-open\s*>\s*#workspace\s*\{([^}]*)\}/)?.[1] || "";
});

test("the site header remains visible and the workspace is not an overlay", () => {
  assert.doesNotMatch(css, /body\.tool-open\s*>\s*header/);
  assert.match(css, /body\.tool-open\s*>\s*header\.sticky\s*\{\s*top:\s*0/);
  assert.match(html, /<section id="workspace"/);
});

test("mobile layout stacks sidebar and tool content", () => {
  assert.match(css, /@media\s*\(max-width:\s*760px\)[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\)/);
});

test("closing a tool restores the homepage state", () => {
  assert.match(app, /document\.body\.classList\.remove\("tool-open"\)/);
  assert.match(app, /workspace\.classList\.add\("hidden"\)/);
});
