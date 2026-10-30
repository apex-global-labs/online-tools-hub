import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const html = read("../index.html");
const robots = read("../robots.txt");
const sitemap = read("../sitemap.xml");
const workflow = read("../.github/workflows/tests.yml");
const siteUrl = "https://apex-global-labs.github.io/online-tools-hub/";

test("homepage has useful title, description, canonical URL and social metadata", () => {
  assert.match(html, /<title>ToolNest — 40 Free Online Tools<\/title>/);
  assert.match(html, /<meta name="description" content="[^"]{100,170}">/);
  assert.ok(html.includes('<link rel="canonical" href="' + siteUrl + '">'));
  for (const field of ["og:type", "og:site_name", "og:title", "og:description", "og:url", "twitter:card", "twitter:title", "twitter:description"]) {
    assert.ok(html.includes('property="' + field + '"') || html.includes('name="' + field + '"'), "missing social metadata: " + field);
  }
});

test("robots.txt permits public crawling and declares the published sitemap", () => {
  assert.match(robots, /^User-agent: \*\s*$/m);
  assert.match(robots, /^Allow: \/\s*$/m);
  assert.ok(robots.includes("Sitemap: " + siteUrl + "sitemap.xml"));
});

test("XML sitemap contains only the canonical static homepage URL", () => {
  assert.match(sitemap, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.ok(sitemap.includes("<loc>" + siteUrl + "</loc>"));
  assert.match(sitemap, /<lastmod>2026-10-30<\/lastmod>/);
  assert.doesNotMatch(sitemap, /#\/tools\//);
  assert.equal((sitemap.match(/<url>/g) || []).length, 1);
});

test("CI regression suite runs syntax checks for IP and router bridge runtime files", () => {
  const checks = [
    [process.execPath, ["--check", fileURLToPath(new URL("../js/ip-tools.js", import.meta.url))]],
    [process.execPath, ["--experimental-default-type=module", "--check", fileURLToPath(new URL("../js/router-bridge.js", import.meta.url))]]
  ];
  for (const [command, args] of checks) {
    const result = spawnSync(command, args, { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr || result.stdout || "runtime JavaScript syntax check failed");
  }
  assert.match(workflow, /node --experimental-default-type=module --test tests\/\*\.test\.mjs/);
});
