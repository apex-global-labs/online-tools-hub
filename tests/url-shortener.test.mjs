import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { normalizeUrl, validateAlias, createShortUrl } = require("../js/url-shortener.js");

test("accepts public HTTP and HTTPS URLs, adding HTTPS when a scheme is omitted", () => {
  assert.equal(normalizeUrl("https://example.com/path?q=1"), "https://example.com/path?q=1");
  assert.equal(normalizeUrl("http://example.com"), "http://example.com/");
  assert.equal(normalizeUrl("example.com"), "https://example.com/");
  assert.equal(normalizeUrl("www.example.com/long/path?x=1"), "https://www.example.com/long/path?x=1");
  assert.equal(normalizeUrl("example.com:8080/path"), "https://example.com:8080/path");
  assert.equal(normalizeUrl("http://8.8.8.8"), "http://8.8.8.8/");
  assert.equal(normalizeUrl("http://198.51.200.1"), "http://198.51.200.1/");
  assert.equal(normalizeUrl("http://192.0.1.1"), "http://192.0.1.1/");
  assert.throws(() => normalizeUrl("http://localhost."));
  assert.equal(normalizeUrl("https://[2606:4700:4700::1111]/"), "https://[2606:4700:4700::1111]/");
  assert.equal(normalizeUrl("https://[2001:4860::1]/"), "https://[2001:4860::1]/");
  for (const value of ["", "javascript:alert(1)", "file:///tmp/test", "ftp://example.com", "localhost", "http://localhost", "http://127.0.0.1", "http://192.168.1.1", "http://10.0.0.2", "http://172.16.0.1", "https://user:pass@example.com"]) assert.throws(() => normalizeUrl(value));
});

test("blocks IPv4 private, loopback, link-local, CGNAT and special-use ranges", () => {
  const blocked = ["0.1.2.3", "10.0.0.1", "100.64.0.1", "100.127.255.254", "127.0.0.1", "169.254.1.1", "172.16.0.1", "172.31.255.254", "192.0.0.8", "192.0.2.1", "192.88.99.1", "192.168.1.1", "198.18.0.1", "198.51.100.1", "203.0.113.1", "224.0.0.1", "240.0.0.1"];
  for (const address of blocked) assert.throws(() => normalizeUrl(`http://${address}`), undefined, address);
});

test("blocks IPv6 loopback, unique-local, link-local, mapped and special-use addresses", () => {
  const blocked = ["[::]", "[::1]", "[fc00::1]", "[fd12:3456:789a::1]", "[fe80::1]", "[febf::1]", "[::ffff:127.0.0.1]", "[::ffff:192.168.1.1]", "[::ffff:169.254.1.1]", "[2001:db8::1]", "[ff02::1]", "[64:ff9b::a00:1]", "[64:ff9b:1::a00:1]", "[100::1]", "[2002::1]"];
  for (const address of blocked) assert.throws(() => normalizeUrl(`http://${address}`), undefined, address);
});

test("custom aliases are optional and limited to 3–16 letters, numbers, hyphens or underscores", () => {
  assert.equal(validateAlias(""), "");
  assert.equal(validateAlias("ToolNest42"), "ToolNest42");
  for (const value of ["ab", "has space", "a.b", "a".repeat(17), "বাংলা"]) assert.throws(() => validateAlias(value));
  assert.equal(validateAlias("a-b"), "a-b");
  assert.equal(validateAlias("alias_name"), "alias_name");
});

test("uses the documented free Spoo.me API v1 endpoint and returns HTTPS links", async () => {
  let captured;
  const result = await createShortUrl("https://example.com/long", "sample42", async (url, options) => {
    captured = { url, options };
    return { ok:true, status:201, json:async()=>({short_url:"https://spoo.me/sample42",original_url:"https://example.com/long"}) };
  });
  assert.equal(captured.url,"https://spoo.me/api/v1/shorten");
  assert.equal(captured.options.method,"POST");
  assert.equal(captured.options.headers["Content-Type"],"application/json");
  assert.deepEqual(JSON.parse(captured.options.body),{long_url:"https://example.com/long",alias:"sample42"});
  assert.equal(result.shortUrl,"https://spoo.me/sample42");
});

test("reports provider rate limits and rejects malformed API responses", async () => {
  await assert.rejects(createShortUrl("https://example.com","",async()=>({ok:false,status:429,json:async()=>({})})),/rate-limited/);
  await assert.rejects(createShortUrl("https://example.com","",async()=>({ok:true,status:201,json:async()=>({short_url:"javascript:alert(1)"})})),/invalid link/);
});
