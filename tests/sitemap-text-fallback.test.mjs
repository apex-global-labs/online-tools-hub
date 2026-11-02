import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const xml = readFileSync(new URL('../sitemap.xml', import.meta.url), 'utf8');
const text = readFileSync(new URL('../sitemap.txt', import.meta.url), 'utf8');
const xmlUrls = [...xml.matchAll(/<loc>([^<]+)<\\/loc>/g)].map((match) => match[1]);
const textUrls = text.trim().split(/\\r?\\n/);
const base = 'https://apex-global-labs.github.io/online-tools-hub/';

test('plain-text sitemap mirrors the canonical XML sitemap exactly', () => {
  assert.equal(xmlUrls.length, 61);
  assert.equal(new Set(xmlUrls).size, xmlUrls.length);
  assert.deepEqual(textUrls, xmlUrls);
});

test('all sitemap entries are absolute canonical ToolNest project URLs', () => {
  for (const url of textUrls) {
    assert.ok(url.startsWith(base), `Unexpected sitemap URL: ${url}`);
    assert.equal(url.includes('#'), false, `Hash route must not be indexed separately: ${url}`);
    assert.equal(url.includes('?'), false, `Query URL must not be in sitemap: ${url}`);
  }
});
