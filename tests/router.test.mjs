import test from "node:test";
import assert from "node:assert/strict";
import { parseRoute, resolveRoute } from "../js/router.js";

const fixture = [
  { id: "json", title: "JSON Formatter & Validator", slug: "json-formatter" },
  { id: "qr", title: "QR Code Generator", slug: "qr-generator" }
];

function mockMetadata(t, data = fixture, options = {}) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    if (options.fail) return { ok: false, status: 503 };
    return { ok: true, json: async () => data };
  };
  t.after(() => { globalThis.fetch = originalFetch; });
}

test("empty hash resolves to home", () => {
  assert.deepEqual(parseRoute(""), { name: "home" });
});

test("root hash resolves to home", () => {
  assert.deepEqual(parseRoute("#/"), { name: "home" });
});

test("valid tool route extracts its slug", () => {
  assert.deepEqual(parseRoute("#/tools/json-formatter"), {
    name: "tool",
    slug: "json-formatter"
  });
});

test("route parsing accepts uppercase slug characters", () => {
  assert.deepEqual(parseRoute("#/tools/JSON-Formatter"), {
    name: "tool",
    slug: "JSON-Formatter"
  });
});

test("malformed and legacy hashes are not mistaken for modern routes", () => {
  assert.deepEqual(parseRoute("#tool/json"), { name: "not-found" });
  assert.deepEqual(parseRoute("#/tools/invalid_slug"), { name: "not-found" });
  assert.deepEqual(parseRoute("#/unknown/path"), { name: "not-found" });
});

test("trailing slash is accepted for a tool route", () => {
  assert.deepEqual(parseRoute("#/tools/qr-generator/"), {
    name: "tool",
    slug: "qr-generator"
  });
});

test("resolveRoute finds an existing slug", async (t) => {
  mockMetadata(t);
  const route = await resolveRoute("#/tools/json-formatter");
  assert.equal(route.name, "tool");
  assert.equal(route.tool.id, "json");
});

test("resolveRoute normalizes slug case before lookup", async (t) => {
  mockMetadata(t);
  const route = await resolveRoute("#/tools/JSON-FORMATTER");
  assert.equal(route.name, "tool");
  assert.equal(route.tool.id, "json");
});

test("unknown slug resolves to not-found", async (t) => {
  mockMetadata(t);
  assert.deepEqual(await resolveRoute("#/tools/no-such-tool"), {
    name: "not-found",
    slug: "no-such-tool"
  });
});

test("metadata HTTP errors reject route resolution", async (t) => {
  mockMetadata(t, fixture, { fail: true });
  await assert.rejects(resolveRoute("#/tools/json-formatter"), /HTTP 503/);
});


test("retired tool routes resolve to the standard not-found state", async (t) => {
  mockMetadata(t);
  for (const slug of ["docfix-pro", "unicode-bijoy-converter"]) {
    const route = await resolveRoute("#/tools/" + slug);
    assert.equal(route.name, "not-found");
    assert.equal(route.slug, slug);
  }
});
