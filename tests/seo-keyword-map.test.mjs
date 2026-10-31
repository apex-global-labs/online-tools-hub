import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const map = readFileSync(new URL("../SEO_KEYWORD_MAP.md", import.meta.url), "utf8");
const tools = JSON.parse(readFileSync(new URL("../js/tools-data.json", import.meta.url), "utf8"));
const site = "https://apex-global-labs.github.io/online-tools-hub/";

test("Phase 5 map assigns one unique primary keyword and exact guide URL to all 54 tools", () => {
  const rows = [...map.matchAll(/^\| (\d+) \| ([^|]+) \| \*\*([^*]+)\*\* \|.*?\| \[([^\]]+)\]\(([^)]+)\) \|$/gm)];
  assert.equal(tools.length, 54);
  assert.equal(rows.length, 54, "keyword map must contain exactly 54 tool rows");
  assert.equal(new Set(rows.map((row) => row[3].trim().toLowerCase())).size, 54,
    "each tool must have a distinct primary keyword");
  assert.equal(new Set(rows.map((row) => row[5])).size, 54,
    "each tool must own a unique target URL");
  for (const row of rows) {
    const tool = tools.find((item) => item.title === row[2].trim());
    assert.ok(tool, "unknown tool in keyword map: " + row[2]);
    assert.equal(row[5], site + "tools/" + tool.slug + "/",
      "target URL mismatch for " + tool.id);
  }
});

test("Phase 5 map records research limits, intent, priorities and cannibalization boundaries", () => {
  assert.match(map, /Search intent/i);
  assert.match(map, /Search volume:\*\* not measured/);
  assert.match(map, /Keyword difficulty:\*\* not measured/);
  assert.match(map, /Keyword cannibalization rules/);
  assert.match(map, /Keyword ownership and page-boundary checks/);
  assert.match(map, /Google Search Central/);
});
