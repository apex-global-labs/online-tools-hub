import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
const site = "https://apex-global-labs.github.io/online-tools-hub/";
const tools = JSON.parse(read("../js/tools-data.json"));
const homepage = read("../index.html");
const directory = read("../tools/index.html");
const about = read("../about/index.html");
const sitemap = read("../sitemap.xml");
const llms = read("../llms.txt");
const known = new Set(tools.map(tool => tool.slug));

function jsonLd(html, label) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)]
    .map((match, index) => {
      try { return JSON.parse(match[1]); }
      catch (error) { assert.fail(label + " JSON-LD block " + (index + 1) + " is invalid: " + error.message); }
    });
}

test("homepage exposes canonical site identity and machine-readable discovery links", () => {
  assert.ok(homepage.includes('<link rel="canonical" href="' + site + '">'));
  assert.match(homepage, /<meta name="robots" content="index,follow">/i);
  assert.ok(homepage.includes('href="' + site + 'sitemap.xml"'));
  assert.ok(homepage.includes('href="' + site + 'llms.txt"'));
  const schemas = jsonLd(homepage, "homepage");
  assert.ok(schemas.some(schema => schema["@type"] === "Organization" && schema.name === "ToolNest"));
  assert.ok(schemas.some(schema => schema["@type"] === "WebSite" && schema.url === site));
});

test("tool directory structured data lists every canonical guide exactly once", () => {
  assert.ok(directory.includes('href="' + site + 'sitemap.xml"'));
  assert.ok(directory.includes('href="' + site + 'llms.txt"'));
  const schema = jsonLd(directory, "directory").find(item => item["@type"] === "CollectionPage");
  assert.ok(schema, "directory CollectionPage schema is required");
  assert.equal(schema.mainEntity.numberOfItems, tools.length);
  const items = schema.mainEntity.itemListElement;
  assert.equal(items.length, tools.length);
  assert.deepEqual(items.map(item => item.item.url), tools.map(tool => site + "tools/" + tool.slug + "/"));
  assert.deepEqual(items.map(item => item.position), tools.map((tool, index) => index + 1));
});

test("AI-readable catalogue accurately links to all 55 guides and key policy pages", () => {
  assert.ok(llms.startsWith("# ToolNest"));
  assert.ok(llms.includes(site + "privacy/"));
  assert.ok(llms.includes(site + "terms/"));
  assert.ok(llms.includes(site + "sitemap.xml"));
  for (const tool of tools) {
    const url = site + "tools/" + tool.slug + "/";
    assert.ok(llms.includes("[" + tool.title + "](" + url + ")"), "llms.txt missing " + tool.slug);
    assert.ok(llms.includes(tool.seo.description), "llms.txt description mismatch for " + tool.slug);
  }
  assert.match(llms, /cannot guarantee crawling, indexing, search ranking or AI citations/i);
  assert.ok(about.includes('href="' + site + 'llms.txt"'));
});

test("every tool guide has valid JSON-LD matching its canonical application and FAQs", () => {
  for (const tool of tools) {
    const html = read("../tools/" + tool.slug + "/index.html");
    const schemas = jsonLd(html, tool.slug);
    const app = schemas.find(schema => schema["@type"] === "WebApplication");
    const breadcrumb = schemas.find(schema => schema["@type"] === "BreadcrumbList");
    const faq = schemas.find(schema => schema["@type"] === "FAQPage");
    assert.ok(app, "WebApplication schema missing for " + tool.slug);
    assert.equal(app.url, site + "tools/" + tool.slug + "/");
    assert.ok(breadcrumb, "BreadcrumbList schema missing for " + tool.slug);
    assert.ok(faq, "FAQPage schema missing for " + tool.slug);
    assert.ok(faq.mainEntity.length >= 3, "FAQ schema should include visible useful FAQs for " + tool.slug);
  }
});

test("all 55 guides have at least three unique, valid, contextual related-tool links", () => {
  for (const tool of tools) {
    const html = read("../tools/" + tool.slug + "/index.html");
    const sections = [...html.matchAll(/<section\b[^>]*>([\s\S]*?)<\/section>/gi)];
    const related = sections.find(match => /<h2\b[^>]*>[^<]*Related[^<]*<\/h2>/i.test(match[1]));
    assert.ok(related, "related-tools section missing for " + tool.slug);
    const links = [...related[1].matchAll(/<a\b[^>]*href="https:\/\/apex-global-labs\.github\.io\/online-tools-hub\/tools\/([a-z0-9-]+)\/"[^>]*>([\s\S]*?)<\/a>/gi)]
      .map(match => ({ slug: match[1], label: match[2].replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim() }));
    assert.ok(links.length >= 3 && links.length <= 5, "expected three to five contextual related links for " + tool.slug);
    assert.equal(new Set(links.map(link => link.slug)).size, links.length, "related links must be unique for " + tool.slug);
    for (const link of links) {
      assert.ok(known.has(link.slug), "related link target is not an active tool: " + link.slug);
      assert.notEqual(link.slug, tool.slug, "guide must not link to itself: " + tool.slug);
      assert.ok(link.label.length >= 3, "related link needs descriptive anchor text: " + tool.slug);
    }
  }
});

test("sitemap lastmod reflects the latest edits to directory and updated guide pages", () => {
  const expected = [
    "advanced-pdf-merger", "pdf-page-organizer", "text-sorter", "find-replace", "jwt-decoder",
    "xml-formatter", "pdf-images-extractor", "zip-file-manager", "favicon-generator", "url-shortener",
    "pdf-splitter", "image-to-pdf", "pdf-to-image", "pdf-text-extractor", "pdf-watermark-page-number"
  ];
  for (const slug of expected) {
    const url = site + "tools/" + slug + "/";
    const block = sitemap.split("<url>").find(entry => entry.includes("<loc>" + url + "</loc>"));
    assert.ok(block, "sitemap entry missing for " + slug);
    assert.match(block, /<lastmod>2026-11-01<\/lastmod>/, "lastmod is stale for " + slug);
  }
  const directoryBlock = sitemap.split("<url>").find(entry => entry.includes("<loc>" + site + "tools/</loc>"));
  assert.match(directoryBlock || "", /<lastmod>2026-11-01<\/lastmod>/);
  assert.equal((sitemap.match(/<loc>/g) || []).length, 61);
  assert.equal(new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1])).size, 61);
  assert.equal(existsSync(new URL("../robots.txt", import.meta.url)), false,
    "do not add a misleading project-path robots.txt for the shared github.io origin");
});
