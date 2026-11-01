import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const tools = JSON.parse(read("../js/tools-data.json"));
const site = "https://apex-global-labs.github.io/online-tools-hub/";
const decodeXml = (value) => value
  .replaceAll("&amp;", "&")
  .replaceAll("&lt;", "<")
  .replaceAll("&gt;", ">")
  .replaceAll("&quot;", '"')
  .replaceAll("&apos;", "'");

test("sitemap exactly matches the current 55-tool static page inventory", () => {
  assert.equal(tools.length, 55);
  assert.equal(new Set(tools.map((tool) => tool.slug)).size, 55);

  const xml = read("../sitemap.xml");
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.ok(xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'));
  assert.match(xml, /<urlset[\s\S]*<\/urlset>\s*$/);

  const urls = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/g)]
    .map((match) => decodeXml(match[1].trim()));
  const expected = [
    site,
    site + "tools/",
    site + "about/",
    site + "contact/",
    site + "privacy/",
    site + "terms/",
    ...tools.map((tool) => site + "tools/" + tool.slug + "/")
  ];

  assert.equal(expected.length, 61);
  assert.equal(urls.length, expected.length, "unexpected sitemap URL count");
  assert.equal(new Set(urls).size, urls.length, "duplicate sitemap URL");
  assert.deepEqual([...urls].sort(), [...expected].sort(), "sitemap differs from active canonical inventory");

  for (const url of urls) {
    assert.ok(url.startsWith(site), "URL is outside the GitHub Pages project path: " + url);
    assert.ok(!/[?#]/.test(url), "query/hash URL must not be in sitemap: " + url);
    assert.ok(url.endsWith("/"), "static canonical URLs must end with slash: " + url);
  }
});

test("every sitemap lastmod value is a valid W3C calendar date", () => {
  const xml = read("../sitemap.xml");
  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);
  assert.equal(entries.length, 61);
  for (const entry of entries) {
    const loc = entry.match(/<loc>([\s\S]*?)<\/loc>/);
    const lastmod = entry.match(/<lastmod>([\s\S]*?)<\/lastmod>/);
    assert.ok(loc, "sitemap entry is missing loc");
    assert.ok(lastmod, "sitemap entry is missing lastmod for " + loc[1]);
    assert.match(lastmod[1].trim(), /^\d{4}-\d{2}-\d{2}$/);
    const parsed = new Date(lastmod[1].trim() + "T00:00:00Z");
    assert.ok(!Number.isNaN(parsed.getTime()), "invalid lastmod date for " + loc[1]);
    assert.equal(parsed.toISOString().slice(0, 10), lastmod[1].trim(), "impossible calendar date for " + loc[1]);
  }
});

test("homepage, directory and information pages match their sitemap canonicals", () => {
  const pages = [
    ["../index.html", site],
    ["../tools/index.html", site + "tools/"],
    ["../about/index.html", site + "about/"],
    ["../contact/index.html", site + "contact/"],
    ["../privacy/index.html", site + "privacy/"],
    ["../terms/index.html", site + "terms/"]
  ];
  for (const [path, canonical] of pages) {
    const html = read(path);
    assert.ok(html.includes('<link rel="canonical" href="' + canonical + '">'), "canonical mismatch: " + path);
    assert.match(html, /<meta name="robots" content="index,follow">/i, "page should remain indexable: " + path);
  }
  const homepage = read("../index.html");
  const directory = read("../tools/index.html");
  assert.ok(homepage.includes('rel="sitemap"') && homepage.includes(site + "sitemap.xml"));
  assert.ok(directory.includes('rel="sitemap"') && directory.includes(site + "sitemap.xml"));
});

test("the tool directory exposes crawlable links to all 55 guide URLs", () => {
  const directory = read("../tools/index.html");
  for (const tool of tools) {
    const url = site + "tools/" + tool.slug + "/";
    assert.ok(directory.includes('href="' + url + '"'), "directory link missing: " + tool.slug);
  }
});
