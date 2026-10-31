import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const html = read("../index.html");
const sitemap = read("../sitemap.xml");
const workflow = read("../.github/workflows/tests.yml");
const readme = read("../README.md");
const siteUrl = "https://apex-global-labs.github.io/online-tools-hub/";

test("homepage has useful title, description, canonical URL and social metadata", () => {
  assert.match(html, /<title>ToolNest — 55 Free Online Tools<\/title>/);
  assert.match(html, /<meta name="description" content="[^"]{100,170}">/);
  assert.ok(html.includes('<link rel="canonical" href="' + siteUrl + '">'));
  for (const field of ["og:type", "og:site_name", "og:title", "og:description", "og:url", "twitter:card", "twitter:title", "twitter:description"]) {
    assert.ok(html.includes('property="' + field + '"') || html.includes('name="' + field + '"'), "missing social metadata: " + field);
  }
});

test("XML sitemap lists the homepage, directory and all 55 canonical tool guide pages", () => {
  assert.match(sitemap, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.ok(sitemap.includes("<loc>" + siteUrl + "</loc>"));
  assert.ok(sitemap.includes("<loc>" + siteUrl + "tools/</loc>"));
  assert.equal((sitemap.match(/<url>/g) || []).length, 57);
  assert.doesNotMatch(sitemap, /#\/tools\//);
  for (const tool of JSON.parse(read("../js/tools-data.json"))) {
    assert.ok(sitemap.includes("<loc>" + siteUrl + "tools/" + tool.slug + "/</loc>"), "missing sitemap URL for " + tool.id);
  }
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

test("crawl documentation accurately describes the project-site sitemap and robots.txt limitation", () => {
  assert.equal((readme.match(/^## Search engine crawl files$/gm) || []).length, 1);
  assert.match(readme, /sitemap\.xml` lists the canonical homepage, the tool-guide directory and 55 individual static tool-guide URLs/);
  assert.match(readme, /No repository-level `robots\.txt` is provided/);
  assert.doesNotMatch(readme, /- `robots\.txt` allows public crawling/);
  assert.match(readme, /A social preview image is not yet configured/);
});


test("tool-guide directory contains exactly one link for every active tool slug", () => {
  const directory = read("../tools/index.html");
  const tools = JSON.parse(read("../js/tools-data.json"));
  const links = [...directory.matchAll(/href="https:\/\/apex-global-labs\.github\.io\/online-tools-hub\/tools\/([^/"]+)\//g)].map((match) => match[1]);
  assert.equal(links.length, tools.length, "directory must have exactly one guide link per active tool");
  assert.equal(new Set(links).size, links.length, "directory must not contain duplicate guide links");
  assert.deepEqual([...links].sort(), tools.map((tool) => tool.slug).sort(), "directory slugs must match the active catalogue");
});

test("README does not advertise permanently retired tools", () => {
  assert.doesNotMatch(readme, /Universal Doc Formatter|DocFix Pro|Unicode.*Bijoy/i);
  assert.match(readme, /PDF Page Organizer/);
  assert.match(readme, /55 tools/);
});


test("README assigns the Phase C PDF utilities to the correct release phase", () => {
  const b2 = readme.split("### Phase B2 additions")[1].split("## Search engine crawl files")[0];
  const c = readme.split("### Phase C1 / C2 — PDF utilities")[1].split("## Search engine crawl files")[0];
  assert.doesNotMatch(b2, /PDF Page Organizer|PDF Images Extractor/);
  assert.match(c, /PDF Page Organizer/);
  assert.match(c, /PDF Images Extractor/);
  assert.match(readme, /js\/phase-c-pdf-tools\.js/);
});
