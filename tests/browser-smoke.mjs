import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.TOOLNEST_BASE_URL || "https://apex-global-labs.github.io/online-tools-hub/";
const origin = new URL(baseUrl).origin;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitForCurrentBundle() {
  for (let attempt = 0; attempt < 36; attempt++) {
    try {
      const response = await fetch(new URL("app.js", baseUrl));
      const source = await response.text();
      if (response.ok && source.includes("below absolute zero") &&
          source.includes("valid HTTP or HTTPS canonical URL") &&
          source.includes("Please choose an image smaller than 10 MB.")) return;
    } catch (_) {}
    await sleep(5000);
  }
  throw new Error("The expected ToolNest bundle was not available after waiting for deployment.");
}
await waitForCurrentBundle();

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, permissions: ["clipboard-read", "clipboard-write"] });
await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin });
const page = await context.newPage();
page.setDefaultTimeout(15000);
const pageErrors = [];
page.on("pageerror", error => pageErrors.push(error.message));

try {
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.locator("#toolGrid .tool-card").first().waitFor();
  assert.equal(await page.locator("#toolGrid .tool-card").count(), 20, "home should show 20 tools");

  await page.locator('#categoryFilters [data-category="Text"]').click();
  assert.equal(await page.locator("#toolGrid .tool-card").count(), 6, "Text filter should show six text tools");
  await page.locator('#categoryFilters [data-category="All"]').click();
  assert.equal(await page.locator("#toolGrid .tool-card").count(), 20, "All filter should restore all tools");

  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator("#themeToggle").click();
  assert.equal(await page.locator("html").evaluate(el => el.classList.contains("dark")), true, "Night mode should activate");
  await page.reload({ waitUntil: "domcontentloaded" });
  assert.equal(await page.locator("html").evaluate(el => el.classList.contains("dark")), true, "Night mode should persist");
  await page.locator("#themeToggle").click();
  await page.reload({ waitUntil: "domcontentloaded" });
  assert.equal(await page.locator("html").evaluate(el => el.classList.contains("dark")), false, "Day mode should persist");

  const search = page.locator("#toolSearch");
  await search.fill("json");
  await page.locator(".search-suggestion").first().waitFor();
  await search.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.locator("#workspace").waitFor({ state: "visible" });
  assert.equal((await page.locator("#workspaceTitle").textContent()).trim(), "JSON Formatter & Validator");
  await page.locator("#sourceText").fill('{"ok":true}');
  await page.locator("#format").click();
  await page.locator("#copy").click();
  await page.waitForFunction(() => document.querySelector("#toolMessage")?.textContent === "Copied to clipboard.");
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), '{\n  "ok": true\n}');

  await page.goto(new URL("#/tools/json-formatter", baseUrl).href, { waitUntil: "domcontentloaded" });
  await page.locator("#workspace").waitFor({ state: "visible" });
  assert.equal((await page.locator("#workspaceTitle").textContent()).trim(), "JSON Formatter & Validator");

  await page.goto(new URL("#tool/json", baseUrl).href, { waitUntil: "domcontentloaded" });
  await page.locator("#workspace").waitFor({ state: "visible" });
  assert.equal((await page.locator("#workspaceTitle").textContent()).trim(), "JSON Formatter & Validator");

  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.locator('[data-tool="unit"]').click();
  await page.locator("#unitType").selectOption("temperature");
  await page.locator("#unitValue").fill("-300");
  await page.waitForFunction(() => document.querySelector("#toolMessage")?.textContent.includes("below absolute zero"));

  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.locator('[data-tool="age"]').click();
  await page.locator("#dateA").fill("2099-01-01");
  await page.locator("#calculate").click();
  await page.waitForFunction(() => document.querySelector("#toolMessage")?.textContent.includes("cannot be in the future"));

  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.locator('[data-tool="meta"]').click();
  await page.locator("#pageTitle").fill("Example title");
  await page.locator("#pageDescription").fill("Example description");
  await page.locator("#pageUrl").fill("javascript:alert(1)");
  await page.locator("#generate").click();
  await page.waitForFunction(() => document.querySelector("#toolMessage")?.textContent.includes("valid HTTP or HTTPS canonical URL"));

  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.locator('[data-tool="image64"]').click();
  await page.locator("#imageFile").setInputFiles({ name: "large.png", mimeType: "image/png", buffer: Buffer.alloc(10 * 1024 * 1024 + 1) });
  await page.waitForFunction(() => document.querySelector("#toolMessage")?.textContent.includes("smaller than 10 MB"));

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.locator("#toolGrid .tool-card").first().waitFor();
  const widths = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  assert.ok(widths.content <= widths.viewport + 1, "mobile page overflow: " + JSON.stringify(widths));
  assert.deepEqual(pageErrors, [], "unexpected browser page errors: " + pageErrors.join("; "));
  console.log("ToolNest browser smoke checks passed.");
} finally {
  await context.close();
  await browser.close();
}
