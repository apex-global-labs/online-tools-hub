import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
const map = read("../SEO_KEYWORD_MAP.md");
const llms = read("../llms.txt");
const tools = JSON.parse(read("../js/tools-data.json"));
const site = "https://apex-global-labs.github.io/online-tools-hub/";

const rows = [...map.matchAll(/^\\| (\\d+) \\| ([^|]+) \\| \\*\\*([^*]+)\\*\\* \\| ([^|]+) \\| ([^|]+) \\| ([^|]+) \\| ([^|]+) \\| ([^|]+) \\| \\[([^\\]]+)\\]\\(([^)]+)\\) \\|$/gm)];

test("G3 keyword map has 55 complete, unambiguous rows", () => {
  assert.equal(rows.length, tools.length, "every map row must have all ten columns, including a long-tail query");
  assert.equal(new Set(rows.map(row => row[3].trim().toLowerCase())).size, tools.length,
    "primary search topics must be unique");
  assert.equal(new Set(rows.map(row => row[10])).size, tools.length,
    "each tool must own one unique canonical guide URL");
  for (const row of rows) {
    const tool = tools.find(item => item.title === row[2].trim());
    assert.ok(tool, "unknown tool in keyword map: " + row[2]);
    assert.equal(row[10], site + "tools/" + tool.slug + "/");
    assert.ok(row[5].trim().length >= 12, "meaningful long-tail query missing for " + tool.slug);
    assert.ok(row[4].trim().length >= 5, "related search variants missing for " + tool.slug);
  }
});

test("AI-readable search intent index links every query cluster to its canonical guide", () => {
  assert.ok(llms.includes("## Search intent index"));
  for (const row of rows) {
    const tool = tools.find(item => item.title === row[2].trim());
    const url = site + "tools/" + tool.slug + "/";
    assert.ok(llms.includes("](" + url + ")"), "llms search index link missing for " + tool.slug);
    assert.ok(llms.includes("Primary topic: " + row[3].trim()),
      "primary topic missing from llms index for " + tool.slug);
    assert.ok(llms.includes("Related searches: " + row[4].trim()),
      "related search variants missing from llms index for " + tool.slug);
    assert.ok(llms.includes("Common task: " + row[5].trim()),
      "long-tail task phrase missing from llms index for " + tool.slug);
  }
  assert.match(llms, /not search-volume claims/i);
  assert.match(llms, /cannot guarantee crawling, indexing, search ranking or AI citations/i);
});
