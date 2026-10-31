import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const site = "https://apex-global-labs.github.io/online-tools-hub/";
const tools = JSON.parse(read("../js/tools-data.json"));
const sitemap = read("../sitemap.xml");
const directory = read("../tools/index.html");
const homepage = read("../index.html");

const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const expectedUrls = [
  site,
  site + "tools/",
  ...tools.map((tool) => site + "tools/" + tool.slug + "/")
];

test("sitemap is validly structured for the complete canonical page set", () => {
  assert.ok(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
  assert.ok(sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'));
  assert.equal((sitemap.match(/<url>/g) || []).length, 56);
  assert.equal(locs.length, 56, "each sitemap URL must have exactly one loc element");
  assert.equal(new Set(locs).size, locs.length, "sitemap URLs must be unique");
  assert.deepEqual([...locs].sort(), [...expectedUrls].sort(),
    "sitemap must contain only the canonical homepage, directory and 54 guide URLs");
  for (const url of locs) {
    assert.ok(url.startsWith(site), "URL must use the production project-site origin and path");
    assert.equal(new URL(url).search, "", "sitemap URLs must not contain query strings");
    assert.equal(new URL(url).hash, "", "sitemap URLs must not contain fragments");
  }
});

test("every sitemap URL maps to a real, canonical repository page", () => {
  assert.ok(existsSync(new URL("../index.html", import.meta.url)));
  assert.ok(existsSync(new URL("../tools/index.html", import.meta.url)));
  assert.equal(directory.match(/<link rel="canonical" href="([^"]+)"/)?.[1], site + "tools/");
  assert.match(directory, /<meta name="robots" content="index,follow">/i);
  for (const tool of tools) {
    const path = "../tools/" + tool.slug + "/index.html";
    assert.ok(existsSync(new URL(path, import.meta.url)), "missing guide file for " + tool.slug);
    const guide = read(path);
    const canonical = site + "tools/" + tool.slug + "/";
    assert.ok(guide.includes('<link rel="canonical" href="' + canonical + '">'),
      "guide canonical does not match its sitemap URL: " + tool.slug);
    assert.match(guide, /<meta name="robots" content="index,follow">/i,
      "guide must not be blocked by a noindex directive: " + tool.slug);
    assert.equal((guide.match(/<h1\b/gi) || []).length, 1,
      "guide must have exactly one H1: " + tool.slug);
    assert.ok(guide.includes(site), "guide must link to the canonical site: " + tool.slug);
  }
});

test("homepage and tool directory provide crawlable discovery links to all guides", () => {
  assert.ok(homepage.includes('href="tools/"'), "homepage must link to the tool-guide directory");
  for (const tool of tools) {
    const guideUrl = site + "tools/" + tool.slug + "/";
    assert.ok(directory.includes('href="' + guideUrl + '"'),
      "directory is missing a crawlable link to " + tool.slug);
  }
  assert.ok(directory.includes('<a href="' + site + '">Home</a>'));
});

test("each guide links back to the directory and its matching interactive workspace", () => {
  for (const tool of tools) {
    const guide = read("../tools/" + tool.slug + "/index.html");
    assert.ok(guide.includes('href="' + site + 'tools/"'),
      "guide is missing its directory breadcrumb/navigation link: " + tool.slug);
    assert.ok(guide.includes(site + "#/tools/" + tool.slug),
      "guide is missing the matching interactive workspace link: " + tool.slug);
  }
});
