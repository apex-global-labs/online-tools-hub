import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [catalogueText, guide, app, sitemap] = await Promise.all([
  readFile(new URL("../js/tools-data.json", import.meta.url), "utf8"),
  readFile(new URL("../tools/qr-generator/index.html", import.meta.url), "utf8"),
  readFile(new URL("../app.js", import.meta.url), "utf8"),
  readFile(new URL("../sitemap.xml", import.meta.url), "utf8")
]);
const catalogue = JSON.parse(catalogueText);
const qr = catalogue.find(tool => tool.slug === "qr-generator");

test("QR guide only claims payloads and design features implemented by the tool", () => {
  assert.ok(qr, "QR tool must exist in the catalogue");
  assert.match(qr.seo.description, /plain text or website links/i);
  assert.doesNotMatch(qr.seo.description + " " + qr.seo.features.join(" "), /contact details|vcard|wifi qr/i);
  assert.match(qr.seo.features.join(" "), /background image/i);
  assert.match(qr.seo.features.join(" "), /PNG or SVG/i);
  assert.match(app, /case "qr":/);
  assert.match(app, /qrBlendFile/);
  assert.match(app, /qrDotStyle/);
  assert.match(app, /qrDownloadPng/);
  assert.match(app, /qrDownloadSvg/);
});

test("static QR guide metadata, visible copy and FAQ schema match the catalogue", () => {
  assert.match(guide, /<link rel="canonical" href="https:\/\/apex-global-labs\.github\.io\/online-tools-hub\/tools\/qr-generator\/">/);
  assert.ok(guide.includes(qr.seo.description));
  assert.doesNotMatch(guide, /contact details/i);
  for (const faq of qr.seo.faqs) {
    assert.ok(guide.includes(faq.question), "missing visible/schema FAQ question: " + faq.question);
    assert.ok(guide.includes(faq.answer), "missing visible/schema FAQ answer: " + faq.answer);
  }
  assert.match(guide, /<h1>QR Code Generator<\/h1>/);
});

test("sitemap lastmod is updated for the homepage share feature and revised QR guide", () => {
  assert.match(sitemap, /<loc>https:\/\/apex-global-labs\.github\.io\/online-tools-hub\/<\/loc>\s*<lastmod>2026-11-01<\/lastmod>/);
  assert.match(sitemap, /<loc>https:\/\/apex-global-labs\.github\.io\/online-tools-hub\/tools\/qr-generator\/<\/loc>\s*<lastmod>2026-11-01<\/lastmod>/);
});
