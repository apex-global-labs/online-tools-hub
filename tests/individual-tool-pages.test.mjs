import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const tools = JSON.parse(read("../js/tools-data.json"));
const site = "https://apex-global-labs.github.io/online-tools-hub/";

test("all 40 tools have a unique, crawlable static HTML guide", () => {
  assert.equal(tools.length, 40);
  assert.equal(new Set(tools.map((tool) => tool.slug)).size, 40);
  for (const tool of tools) {
    const html = read("../tools/" + tool.slug + "/index.html");
    const url = site + "tools/" + tool.slug + "/";
    assert.match(html, new RegExp('<title>' + tool.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ' - Free Online Tool \\| ToolNest</title>'));
    assert.ok(html.includes('<link rel="canonical" href="' + url + '">'), "canonical missing for " + tool.id);
    assert.ok(html.includes('<h1>' + tool.title + '</h1>'), "H1 missing for " + tool.id);
    assert.ok(html.includes('name="description" content="'), "description missing for " + tool.id);
    assert.ok(html.includes('href="' + site + '#/tools/' + tool.slug + '"'), "interactive tool link missing for " + tool.id);
    assert.ok(html.includes("How to Use " + tool.title), "instructions missing for " + tool.id);
    assert.ok(html.includes("Frequently Asked Questions"), "FAQ content missing for " + tool.id);
    assert.match(html, /"@type":"WebApplication"/);
    assert.match(html, /"@type":"BreadcrumbList"/);
    assert.match(html, /"@type":"FAQPage"/);
  }
});

test("tool guide directory links to all 40 unique guide pages", () => {
  const directory = read("../tools/index.html");
  assert.match(directory, /<title>All ToolNest Tool Guides - 40 Free Online Tools<\\/title>/);
  for (const tool of tools) assert.ok(directory.includes('href="' + site + "tools/" + tool.slug + '/"'), "directory link missing for " + tool.id);
});

test("homepage links visitors and crawlers to the tool guide directory", () => {
  const html = read("../index.html");
  assert.match(html, /id="tool-guides"/);
  assert.match(html, /href="tools\/">Browse all 40 tool guides/);
});
