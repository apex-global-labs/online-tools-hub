const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizeUrl, validateAlias, createShortUrl } = require("../js/url-shortener.js");

test("accepts only complete public HTTP and HTTPS URLs", () => {
  assert.equal(normalizeUrl("https://example.com/path?q=1"), "https://example.com/path?q=1");
  assert.equal(normalizeUrl("http://example.com"), "http://example.com/");
  for (const value of ["", "example.com", "javascript:alert(1)", "file:///tmp/test", "http://localhost", "http://127.0.0.1", "http://192.168.1.1", "http://10.0.0.2", "http://172.16.0.1", "https://user:pass@example.com"]) assert.throws(() => normalizeUrl(value));
});

test("custom aliases are optional and limited to 1–16 alphanumeric characters", () => {
  assert.equal(validateAlias(""), "");
  assert.equal(validateAlias("ToolNest42"), "ToolNest42");
  for (const value of ["has space", "a-b", "alias_name", "a".repeat(17), "বাংলা"]) assert.throws(() => validateAlias(value));
});

test("uses the documented free provider form endpoint and returns HTTPS links", async () => {
  let captured;
  const result = await createShortUrl("https://example.com/long", "sample42", async (url, options) => {
    captured = { url, options };
    return { ok:true, status:200, json:async()=>({short_url:"https://spoo.me/sample42",original_url:"https://example.com/long"}) };
  });
  assert.equal(captured.url,"https://spoo.me/");
  assert.equal(captured.options.method,"POST");
  assert.equal(captured.options.body.get("url"),"https://example.com/long");
  assert.equal(captured.options.body.get("alias"),"sample42");
  assert.equal(result.shortUrl,"https://spoo.me/sample42");
});

test("reports provider rate limits and rejects malformed API responses", async () => {
  await assert.rejects(createShortUrl("https://example.com","",async()=>({ok:false,status:429,json:async()=>({})})),/rate-limited/);
  await assert.rejects(createShortUrl("https://example.com","",async()=>({ok:true,status:200,json:async()=>({short_url:"javascript:alert(1)"})})),/invalid link/);
});
