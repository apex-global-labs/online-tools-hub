import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import "../js/advanced-converters.js";

const tools = globalThis.ToolNestAdvanced;

test("area converter uses standard square-metre factors", () => {
  assert.ok(Math.abs(tools.convertArea(1, "sqm", "sqft") - 10.7639104167) < 1e-8);
  assert.equal(tools.convertArea(1, "acre", "sqft"), 43560);
  assert.equal(tools.convertArea(10000, "sqm", "hectare"), 1);
});

test("area converter rejects invalid values and unsupported units", () => {
  assert.throws(() => tools.convertArea(-1, "sqm", "sqft"), /non-negative/);
  assert.throws(() => tools.convertArea("not-a-number", "sqm", "sqft"), /valid non-negative/);
  assert.throws(() => tools.convertArea(1, "unknown", "sqft"), /supported area units/);
});

test("Bangladesh land converter follows documented conventional factors", () => {
  assert.equal(tools.convertLand(1, "acre", "shotok"), 100);
  assert.equal(tools.convertLand(1, "bigha", "katha"), 20);
  assert.equal(tools.convertLand(1, "katha", "sqft"), 720);
  assert.equal(tools.convertLand(1, "shotok", "sqft"), 435.6);
});

test("Bangladesh land converter rejects invalid values and unit keys", () => {
  assert.throws(() => tools.convertLand(-0.1, "shotok", "sqft"), /non-negative/);
  assert.throws(() => tools.convertLand(1, "decimal-acre", "sqft"), /supported Bangladesh land units/);
});

test("English number words cover zero, compound numbers, scales and decimals", () => {
  assert.equal(tools.numberToWords("0", "en"), "zero");
  assert.equal(tools.numberToWords("21", "en"), "twenty-one");
  assert.equal(tools.numberToWords("1001", "en"), "one thousand one");
  assert.equal(tools.numberToWords("1234567", "en"), "one million two hundred thirty-four thousand five hundred sixty-seven");
  assert.equal(tools.numberToWords("-12.05", "en"), "minus twelve point zero five");
});

test("Bangla number words cover common values, crore scale and decimals", () => {
  assert.equal(tools.numberToWords("0", "bn"), "শূন্য");
  assert.equal(tools.numberToWords("21", "bn"), "একুশ");
  assert.equal(tools.numberToWords("12345", "bn"), "বারো হাজার তিন শত পঁয়তাল্লিশ");
  assert.equal(tools.numberToWords("10000000", "bn"), "এক কোটি");
  assert.equal(tools.numberToWords("-1.5", "bn"), "ঋণাত্মক এক দশমিক পাঁচ");
});

test("number-to-words validates range, precision and language", () => {
  assert.throws(() => tools.numberToWords("1.234", "en"), /up to 2 decimal places/);
  assert.throws(() => tools.numberToWords("1000000000000", "en"), /between/);
  assert.throws(() => tools.numberToWords("1e6", "en"), /up to 2 decimal places/);
  assert.throws(() => tools.numberToWords("5", "xx"), /valid language/);
});

test("time-zone converter applies the source offset and formats the destination", () => {
  const result = tools.convertTimeZone("2026-01-15T12:00", "Asia/Dhaka", "UTC");
  assert.equal(result.utc, "2026-01-15T06:00:00.000Z");
  assert.match(result.display, /15 January 2026/);
  assert.equal(result.ambiguous, false);
});

test("time-zone converter detects skipped and repeated daylight-saving local times", () => {
  assert.throws(
    () => tools.convertTimeZone("2026-03-08T02:30", "America/New_York", "UTC"),
    /does not exist/
  );
  const repeated = tools.convertTimeZone("2026-11-01T01:30", "America/New_York", "UTC");
  assert.equal(repeated.utc, "2026-11-01T05:30:00.000Z");
  assert.equal(repeated.ambiguous, true);
});

test("time-zone converter rejects malformed dates and unknown zones", () => {
  assert.throws(() => tools.convertTimeZone("2026-02-30T10:00", "UTC", "Asia/Dhaka"), /valid date/);
  assert.throws(() => tools.convertTimeZone("2026-01-01T10:00", "Not/AZone", "UTC"), RangeError);
});

test("all four new tools are registered with unique slugs and complete SEO metadata", () => {
  const metadata = JSON.parse(readFileSync(new URL("../js/tools-data.json", import.meta.url), "utf8"));
  const app = readFileSync(new URL("../app.js", import.meta.url), "utf8");
  assert.equal(metadata.length, 49);
  for (const id of ["area", "land", "timezone", "numberwords"]) {
    const tool = metadata.find(item => item.id === id);
    assert.ok(tool, "missing metadata for " + id);
    assert.ok(tool.seo.description.length >= 80);
    assert.equal(tool.seo.steps.length, 3);
    assert.ok(tool.seo.features.length >= 3);
    assert.equal(tool.seo.faqs.length, 3);
    assert.match(app, new RegExp('case "' + id + '":return'));
    assert.match(app, new RegExp('case "' + id + '": \\{'));
  }
  assert.equal(new Set(metadata.map(item => item.id)).size, 49);
  assert.equal(new Set(metadata.map(item => item.slug)).size, 49);
});

test("Phase 13 helper and stylesheet are loaded before app interactions", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  assert.match(html, /css\/phase13-converters\.css/);
  assert.match(html, /js\/advanced-converters\.js[^\n]*defer/);
  assert.match(html, /Search 49 free tools/);
  assert.ok(html.indexOf("js/advanced-converters.js") < html.indexOf("app.js"));
});
