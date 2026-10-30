import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const html = read("../index.html");
const css = read("../style.css");
const app = read("../app.js");

test("QR Code Styling is not downloaded on the initial page load", () => {
  assert.doesNotMatch(html, /<script[^>]+src=["']https:\/\/unpkg\.com\/qr-code-styling/i);
  assert.match(app, /function loadQrLibrary\(\)/);
  assert.match(app, /script\.async\s*=\s*true/);
  assert.match(app, /script\.src\s*=\s*["']https:\/\/unpkg\.com\/qr-code-styling@1\.9\.2\/lib\/qr-code-styling\.js["']/);
  assert.match(app, /if\(typeof QRCodeStyling!=="function"\)await loadQrLibrary\(\)/);
});

test("QR lazy loader reuses an in-flight request and can retry after a network failure", () => {
  assert.match(app, /if\(qrLibraryPromise\)return qrLibraryPromise/);
  assert.match(app, /script\.onerror=\(\)=>\{qrLibraryPromise=null/);
  assert.match(app, /script\.onload=\(\)=>\{/);
});

test("homepage does not import a remote Google Font from the main CSS", () => {
  assert.doesNotMatch(css, /@import\s+url\(["']https:\/\/fonts\.googleapis\.com/i);
});
