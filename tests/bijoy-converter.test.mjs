import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Bijoy converter is registered separately from text cleanup", async () => {
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  assert.match(app, /id:"bijoyunicode",name:"Unicode ⇄ Bijoy Converter"/);
  assert.match(app, /case "bijoyunicode"/);
  const docfix = app.slice(app.indexOf('case "docfix":return form'), app.indexOf('case "bijoyunicode":return form'));
  assert.doesNotMatch(docfix, /docFixEncoding|bijoy-to-unicode|unicode-to-bijoy/);
});
test("Bijoy converter exposes two editors and both conversion directions", async () => {
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  const module = await readFile(new URL("../js/bijoy-converter.js", import.meta.url), "utf8");
  for (const id of ["bijoyUnicodeInput","bijoyAnsiInput","convertUnicodeToBijoy","convertBijoyToUnicode","swapBijoyText","copyUnicode","copyBijoy","clearBothBijoy"]) assert.ok(app.includes(id), id);
  assert.match(module, /convertText\(source\.value, direction\)/);
  assert.match(module, /toolnest-unicode\.txt/);
  assert.match(module, /toolnest-bijoy-ansi\.txt/);
});
test("new converter metadata is valid and uses a unique tool id and slug", async () => {
  const tools = JSON.parse(await readFile(new URL("../js/tools-data.json", import.meta.url), "utf8"));
  const matches = tools.filter((tool) => tool.id === "bijoyunicode" || tool.slug === "unicode-bijoy-converter");
  assert.equal(matches.length, 1);
  assert.equal(matches[0].id, "bijoyunicode");
  assert.equal(matches[0].category, "Text");
});
