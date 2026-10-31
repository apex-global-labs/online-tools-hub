import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const metadata = JSON.parse(readFileSync(new URL("../js/tools-data.json", import.meta.url), "utf8"));
const app = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const renderer = readFileSync(new URL("../js/seo-content.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../css/phase6-seo-content.css", import.meta.url), "utf8");

test("all 49 tools have complete, tool-specific SEO content", () => {
  assert.equal(metadata.length, 49);
  const catalogueStart = app.indexOf("const tools = [");
  const catalogueEnd = app.indexOf("\n];", catalogueStart);
  const catalogue = [...app.slice(catalogueStart, catalogueEnd).matchAll(/\{id:"([^"]+)",name:"([^"]+)"/g)];
  assert.equal(catalogue.length, metadata.length);
  for (const tool of metadata) {
    const catalogueEntry = catalogue.find((entry) => entry[1] === tool.id);
    assert.ok(catalogueEntry, `missing catalogue entry for ${tool.id}`);
    assert.equal(tool.title, catalogueEntry[2], `title mismatch for ${tool.id}`);
    assert.ok(tool.seo, `missing SEO content for ${tool.id}`);
    assert.ok(tool.seo.description.length >= 80, `SEO description too short for ${tool.id}`);
    assert.equal(tool.seo.steps.length, 3, `expected 3 steps for ${tool.id}`);
    assert.equal(new Set(tool.seo.steps).size, tool.seo.steps.length, `duplicate steps for ${tool.id}`);
    assert.ok(tool.seo.features.length >= 3, `expected at least 3 features for ${tool.id}`);
    assert.equal(tool.seo.faqs.length, 3, `expected 3 FAQs for ${tool.id}`);
    assert.equal(new Set(tool.seo.faqs.map((faq) => faq.question)).size, 3, `duplicate FAQ question for ${tool.id}`);
    for (const faq of tool.seo.faqs) {
      assert.ok(faq.question.trim(), `empty FAQ question for ${tool.id}`);
      assert.ok(faq.answer.trim(), `empty FAQ answer for ${tool.id}`);
      assert.notEqual(faq.question.trim().toLowerCase(), faq.answer.trim().toLowerCase());
    }
  }
});

test("SEO renderer is loaded with its stylesheet and uses the shared tool metadata", () => {
  assert.match(html, /css\/phase6-seo-content\.css/);
  assert.match(html, /js\/seo-content\.js/);
  assert.match(renderer, /tools-data\.json/);
  assert.match(renderer, /How to Use/);
  assert.match(renderer, /Key Features & Benefits/);
  assert.match(renderer, /Frequently Asked Questions/);
});

test("FAQ accordion is semantic and JSON-LD is generated from visible FAQ data", () => {
  assert.match(renderer, /document\.createElement\("details"\)/);
  assert.match(renderer, /makeElement\("summary"/);
  assert.match(renderer, /"@type": "FAQPage"/);
  assert.match(renderer, /"@type": "Question"/);
  assert.match(renderer, /"@type": "Answer"/);
  assert.match(renderer, /tool\.seo\.faqs/);
});

test("SEO content is inserted as text rather than untrusted HTML", () => {
  assert.match(renderer, /element\.textContent = text/);
  assert.doesNotMatch(renderer, /innerHTML\s*=/);
});

test("SEO accordion styles include responsive and dark-mode support", () => {
  assert.match(css, /\.tool-seo-faq-item/);
  assert.match(css, /\.dark \.tool-seo-content/);
  assert.match(css, /@media \(max-width: 640px\)/);
});
