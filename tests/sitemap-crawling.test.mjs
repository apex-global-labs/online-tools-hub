import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const tools = JSON.parse(read("../js/tools-data.json"));
const site = "https://apex-global-labs.github.io/online-tools-hub/";
const sitemapNamespace = "http://www.sitemaps.org/schemas/sitemap/0.9";

const decodeXml = (value) => value
  .replaceAll("&amp;", "&")
  .replaceAll("&lt;", "<")
  .replaceAll("&gt;", ">")
  .replaceAll("&quot;", '"')
  .replaceAll("&apos;", "'");

test("XML sitemap is well-formed and contains exactly the canonical public pages", () => {
  const xml = read("../sitemap.xml");
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.ok(xml.includes('xmlns="' + sitemapNamespace + '"'));
  assert.match(xml, /<urlset[\s\S]*<\/urlset>$/);

  const urls = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map((match) => decodeXml(match[1].trim()));
  const expected = [
    site,
    site + "tools/",
    ...tools.map((tool) => site + "tools/" + tool.slug + "/")
  ];

  assert.equal(tools.length, 40, "catalogue must contain 40 tools");
  assert.equal(urls.length, 42, "sitemap must contain homepage, directory and 40 guide pages");
  assert.equal(new Set(urls).size, urls.length, "sitemap URLs must be unique");
  assert.deepEqual([...urls].sort(), [...expected].sort(), "sitemap must contain exactly the intended canonical pages");

  for (const value of urls) {
    const url = new URL(value);
    assert.equal(url.origin, new URL(site).origin, "sitemap URL must use the production origin");
    assert.ok(url.pathname.startsWith("/online-tools-hub/"), "sitemap URL must stay under the GitHub Pages project path");
    assert.equal(url.search, "", "sitemap URLs must not contain query parameters");
    assert.equal(url.hash, "", "hash-based app routes must not be listed as separate crawlable pages");
    assert.ok(value.endsWith("/"), "directory-style canonical URLs must keep their trailing slash");
  }
});

test("sitemap lastmod values use valid W3C calendar dates", () => {
  const xml = read("../sitemap.xml");
  const dates = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((match) => match[1].trim());
  assert.equal(dates.length, 42, "every sitemap URL currently has a lastmod value");
  for (const date of dates) {
    assert.match(date, /^\d{4}-\d{2}-\d{2}$/, "lastmod must be a W3C date");
    const parsed = new Date(date + "T00:00:00Z");
    assert.ok(!Number.isNaN(parsed.getTime()), "lastmod must be a real calendar date");
    assert.equal(parsed.toISOString().slice(0, 10), date, "lastmod date must round-trip");
  }
});

test("homepage, directory and every guide use the matching canonical URL", () => {
  const homepage = read("../index.html");
  const directory = read("../tools/index.html");
  assert.ok(homepage.includes('<link rel="canonical" href="' + site + '">'));
  assert.ok(directory.includes('<link rel="canonical" href="' + site + 'tools/">'));

  for (const tool of tools) {
    const url = site + "tools/" + tool.slug + "/";
    const html = read("../tools/" + tool.slug + "/index.html");
    assert.ok(html.includes('<link rel="canonical" href="' + url + '">'), "canonical mismatch for " + tool.id);
    assert.match(html, /<meta name="robots" content="index,follow">/i, "guide should not accidentally be noindexed: " + tool.id);
    assert.ok(html.includes('href="' + site + 'tools/"'), "guide should link to the directory: " + tool.id);
    assert.ok(html.includes('href="' + site + '"'), "guide should link to the homepage: " + tool.id);
    assert.ok(html.includes('href="' + site + '#/tools/' + tool.slug + '"'), "guide should link to its interactive tool: " + tool.id);
  }
});

test("guide directory provides crawlable internal discovery links to all 40 pages", () => {
  const directory = read("../tools/index.html");
  const links = [...directory.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
  const guideLinks = links.filter((href) => href.startsWith(site + "tools/") && href !== site + "tools/");
  assert.equal(guideLinks.length, 40);
  assert.equal(new Set(guideLinks).size, 40);
  for (const tool of tools) {
    assert.ok(guideLinks.includes(site + "tools/" + tool.slug + "/"), "directory link missing for " + tool.id);
  }
});

test("crawl policy documentation explains the project-site robots.txt limitation", () => {
  const readme = read("../README.md");
  assert.ok(readme.includes("project site published under `/online-tools-hub/`"));
  assert.ok(readme.includes("origin root (`https://apex-global-labs.github.io/robots.txt`)"));
  assert.ok(readme.includes("No repository-level `robots.txt` is provided"));
  assert.ok(!readme.includes("A repository-level `robots.txt` is available"));
});
