import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import "../js/phase15-developer-seo.js";
const app = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const metadata = JSON.parse(readFileSync(new URL("../js/tools-data.json", import.meta.url), "utf8"));
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const tools = globalThis.ToolNestPhase15;

test("robots.txt generator creates allow-all defaults and valid disallow rules", () => {
  assert.equal(tools.buildRobotsTxt(), "User-agent: *\nDisallow:");
  assert.equal(tools.buildRobotsTxt({disallow:"/private/\n/admin/",sitemap:"https://example.com/sitemap.xml"}), "User-agent: *\nDisallow: /private/\nDisallow: /admin/\nSitemap: https://example.com/sitemap.xml");
});
test("robots.txt generator rejects malformed paths, excessive rules and unsafe sitemap URLs", () => {
  assert.throws(() => tools.buildRobotsTxt({disallow:"private/"}), /beginning with/);
  assert.throws(() => tools.buildRobotsTxt({disallow:Array(21).fill("/x/").join("\n")}), /no more than 20/);
  assert.throws(() => tools.buildRobotsTxt({sitemap:"javascript:alert(1)"}), /HTTP or HTTPS/);
});
test("XML sitemap generator validates, normalizes, deduplicates and escapes URLs", () => {
  const xml = tools.buildSitemapXml("https://example.com/a?x=1&y=2\nhttps://example.com/a?x=1&y=2\nhttps://example.com/about");
  assert.equal((xml.match(/<url>/g) || []).length, 2);
  assert.match(xml, /x=1&amp;y=2/);
  assert.match(xml, /sitemaps.org\/schemas\/sitemap\/0.9/);
});
test("XML sitemap generator rejects empty, unsafe, fragmented and oversized input", () => {
  assert.throws(() => tools.buildSitemapXml("  "), /at least one/);
  assert.throws(() => tools.buildSitemapXml("javascript:alert(1)"), /HTTP or HTTPS/);
  assert.throws(() => tools.buildSitemapXml("https://example.com/#section"), /fragments/);
  assert.throws(() => tools.buildSitemapXml(Array(501).fill("https://example.com/").join("\n")), /up to 500/);
});
test("CSS gradient generator creates valid linear and radial declarations", () => {
  assert.equal(tools.buildCssGradient({type:"linear",angle:45,colorA:"#abc",colorB:"#123456"}), "linear-gradient(45deg, #ABC, #123456)");
  assert.equal(tools.buildCssGradient({type:"radial",colorA:"#fff",colorB:"#000"}), "radial-gradient(circle, #FFF, #000)");
});
test("CSS gradient generator rejects unsupported types, invalid colors and angles", () => {
  assert.throws(() => tools.buildCssGradient({type:"conic"}), /linear or radial/);
  assert.throws(() => tools.buildCssGradient({colorA:"red"}), /HEX colors/);
  assert.throws(() => tools.buildCssGradient({angle:361}), /0 to 360/);
  assert.throws(() => tools.buildCssGradient({angle:1.5}), /whole number/);
});

test("Phase 15 tools are registered with complete metadata, UI wiring and local assets", () => {
  for (const id of ["robots", "sitemap", "gradient"]) {
    const tool = metadata.find(item => item.id === id);
    assert.ok(tool, id + " metadata exists");
    assert.equal(tool.seo.steps.length, 3);
    assert.equal(tool.seo.features.length, 3);
    assert.equal(tool.seo.faqs.length, 3);
    assert.match(app, new RegExp('id:"' + id + '"'));
    assert.ok(app.includes('case "' + id + '":'));
  }
  assert.equal(metadata.length, 44);
  assert.match(html, /phase15-developer-seo\.js/);
  assert.match(html, /phase15-developer-seo\.css/);
});
