import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const tools = JSON.parse(read("../js/tools-data.json"));
const site = "https://apex-global-labs.github.io/online-tools-hub/";
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));

test("all 54 tools have a unique, crawlable static HTML guide", () => {
  assert.equal(tools.length, 54);
  assert.equal(new Set(tools.map((tool) => tool.slug)).size, 54);
  for (const tool of tools) {
    const html = read("../tools/" + tool.slug + "/index.html");
    const url = site + "tools/" + tool.slug + "/";
    const title = escapeHtml(tool.title) + " - Free Online Tool | ToolNest";
    assert.ok(html.includes("<title>" + title + "</title>"), "title missing for " + tool.id);
    assert.ok(html.includes('<link rel="canonical" href="' + url + '">'), "canonical missing for " + tool.id);
    assert.ok(html.includes("<h1>" + escapeHtml(tool.title) + "</h1>"), "H1 missing for " + tool.id);
    assert.ok(html.includes('name="description" content="'), "description missing for " + tool.id);
    assert.ok(html.includes('href="' + site + '#/tools/' + tool.slug + '"'), "interactive tool link missing for " + tool.id);
    assert.ok(html.includes("How to Use " + escapeHtml(tool.title)), "instructions missing for " + tool.id);
    assert.ok(html.includes("Frequently Asked Questions"), "FAQ content missing for " + tool.id);
    assert.ok(html.includes('"@type":"WebApplication"'));
    assert.ok(html.includes('"@type":"BreadcrumbList"'));
    assert.ok(html.includes('"@type":"FAQPage"'));
  }
});

test("tool guide directory links to all 54 unique guide pages", () => {
  const directory = read("../tools/index.html");
  assert.ok(directory.includes("<title>All ToolNest Tool Guides - 54 Free Online Tools</title>"));
  for (const tool of tools) {
    assert.ok(directory.includes('href="' + site + "tools/" + tool.slug + '/"'), "directory link missing for " + tool.id);
  }
});

test("homepage links visitors and crawlers to the tool guide directory", () => {
  const html = read("../index.html");
  assert.ok(html.includes('id="tool-guides"'));
  assert.ok(html.includes('href="tools/">Browse all 54 tool guides'));
});

test("all tool guides use unique concise metadata and practical tool-specific tips", () => {
  const descriptions = tools.map((tool) => tool.seo.description);
  assert.equal(new Set(descriptions).size, tools.length, "meta descriptions must be unique");
  for (const tool of tools) {
    const html = read("../tools/" + tool.slug + "/index.html");
    const description = escapeHtml(tool.seo.description);
    assert.ok(tool.seo.description.length >= 110 && tool.seo.description.length <= 160,
      "meta description should be concise for " + tool.id);
    assert.ok(html.includes('name="description" content="' + description + '"'),
      "meta description does not match source data for " + tool.id);
    assert.ok(html.includes('property="og:description" content="' + description + '"'),
      "Open Graph description missing for " + tool.id);
    assert.ok(html.includes('name="twitter:description" content="' + description + '"'),
      "Twitter description missing for " + tool.id);
    assert.ok(!html.includes("Use this free browser-based"),
      "generic boilerplate description remains for " + tool.id);
    assert.ok(typeof tool.seo.tips === "string" && tool.seo.tips.length > 30,
      "practical tip missing from source data for " + tool.id);
    assert.ok(html.includes(escapeHtml(tool.seo.tips)),
      "visible practical tip missing for " + tool.id);
    assert.equal((html.match(/<h1\b/gi) || []).length, 1,
      "guide should contain exactly one H1 for " + tool.id);
    for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
      assert.match(match[1], /\balt=/i, "image needs alt text on " + tool.id);
    }
    for (const faq of tool.seo.faqs) {
      assert.ok(html.includes(escapeHtml(faq.question)), "visible FAQ question missing for " + tool.id);
      assert.ok(html.includes(escapeHtml(faq.answer)), "visible FAQ answer missing for " + tool.id);
    }
  }
});

test("homepage has one primary H1 and a properly nested workspace heading", () => {
  const html = read("../index.html");
  assert.equal((html.match(/<h1\b/gi) || []).length, 1);
  assert.match(html, /<h2 id="workspaceTitle"/);
});

test("tool directory exposes complete social metadata", () => {
  const html = read("../tools/index.html");
  assert.ok(html.includes('property="og:type" content="website"'));
  assert.ok(html.includes('property="og:site_name" content="ToolNest"'));
  assert.ok(html.includes('name="twitter:card" content="summary"'));
  assert.ok(html.includes('name="twitter:description" content="'));
});
