import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, css, html, legacyCss, phase4Css] = await Promise.all([
  readFile(new URL("../app.js", import.meta.url), "utf8"),
  readFile(new URL("../css/workspace-grid-layout.css", import.meta.url), "utf8"),
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../style.css", import.meta.url), "utf8"),
  readFile(new URL("../css/phase4-workspace.css", import.meta.url), "utf8")
]);

test("workspace is a direct body child with semantic sidebar and main content", () => {
  const mainEnd = html.indexOf("</main>");
  const workspaceStart = html.indexOf('<section id="workspace"');
  assert.ok(mainEnd > -1 && workspaceStart > mainEnd, "workspace must sit outside the homepage main");
  assert.match(html, /<aside class="workspace-sidebar"/);
  assert.match(html, /<main class="workspace-content"/);
  assert.match(html, /id="closeWorkspace"/);
});

test("outer workspace is a one-column flex container with a nested sidebar/tool row", () => {
  assert.match(css, /body\\.tool-open\\s*>\\s*#workspace\\s*\\{[\\s\\S]*?display:\\s*flex\\s*!important/);
  assert.match(css, /flex-direction:\\s*column/);
  assert.match(css, /\\.workspace-main-row\\s*\\{[\\s\\S]*?display:\\s*grid/);
  assert.match(css, /grid-template-columns:\\s*minmax\\(16rem, 20rem\\) minmax\\(0, 1fr\\)/);
  const outer = css.match(/body\\.tool-open\\s*>\\s*#workspace\\s*\\{([^}]*)\\}/)?.[1] || "";
  assert.doesNotMatch(outer, /grid-template-columns|position:\\s*fixed|height:\\s*100dvh|overflow:\\s*hidden/);
});

test("workspace does not lock body scrolling or create a fullscreen overlay", () => {
  assert.doesNotMatch(css, /body\.tool-open\s*\{[^}]*overflow:\s*hidden/);
  assert.doesNotMatch(app, /document\.body\.style\.overflow\s*=\s*["']hidden["']/);
  assert.doesNotMatch(css, /position:\s*absolute|position:\s*fixed/);
});

test("site header remains visible while homepage content is hidden", () => {
  assert.match(css, /body\.tool-open\s*>\s*\.welcome-marquee,[\s\S]*?body\.tool-open\s*>\s*main,[\s\S]*?body\.tool-open\s*>\s*footer/);
  assert.doesNotMatch(css, /body\.tool-open\s*>\s*header\s*,/);
  assert.match(css, /body\.tool-open\s*>\s*header\.sticky\s*\{\s*top:\s*0/);
});

test("sidebar and tool controls share only the nested row", () => {
  assert.match(html, /<div class="workspace-main-row">\\s*<aside class="workspace-sidebar"/);
  assert.match(html, /<main class="workspace-content"/);
  assert.match(css, /\\.workspace-sidebar\\s*\\{[\\s\\S]*?border-right:\\s*1px solid/);
  assert.match(css, /\\.workspace-content\\s*\\{[\\s\\S]*?overflow:\\s*visible/);
});

test("mobile workspace stacks the nested sidebar/tool row in one column", () => {
  assert.match(css, /@media\\s*\\(max-width:\\s*760px\\)[\\s\\S]*?\\.workspace-main-row\\s*\\{\\s*grid-template-columns:\\s*minmax\\(0, 1fr\\)/);
  assert.match(css, /@media\\s*\\(max-width:\\s*760px\\)[\\s\\S]*?\\.workspace-content\\s*\\{\\s*padding:\\s*1rem;\\s*overflow:\\s*visible/);
});

test("workspace grid stylesheet is the final layout authority", () => {
  const stylesheetLinks = [...html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)/gi)].map(match => match[1]);
  const gridIndex = stylesheetLinks.findIndex(link => /^css\/workspace-grid-layout\.css(?:\?.*)?$/.test(link));
  assert.ok(gridIndex >= 0, "workspace grid stylesheet must be linked");
  assert.equal(gridIndex, stylesheetLinks.length - 1, "workspace grid stylesheet must load after all other stylesheets");
  assert.doesNotMatch(legacyCss, /body\.tool-open\s+#workspace\s*\{/);
  assert.doesNotMatch(legacyCss, /position:\s*fixed\s*!important/);
  assert.doesNotMatch(phase4Css, /\.tool-open\s+#(?:hero|tools|about)/);
});

test("opening and closing a tool toggle workspace visibility without inline scroll locks", () => {
  assert.match(app, /document\.body\.classList\.add\("tool-open"\)/);
  assert.match(app, /document\.body\.classList\.remove\("tool-open"\)/);
  assert.match(app, /workspace\.classList\.remove\("hidden"\)/);
  assert.match(app, /workspace\.classList\.add\("hidden"\)/);
  assert.doesNotMatch(app, /document\.body\.style\.overflow\s*=\s*["']hidden["']/);
});

test("SEO guide is a sibling below the nested sidebar/tool row", async () => {
  const seoScript = await readFile(new URL("../js/seo-content.js", import.meta.url), "utf8");
  assert.match(seoScript, /workspace\\.appendChild\\(section\\)/);
  assert.match(seoScript, /workspace\\.appendChild\\(section\\)/);
  assert.match(css, /body\\.tool-open\\s*>\\s*#workspace\\s*>\\s*#toolSeoContent/);
  assert.match(css, /body\\.tool-open\\s*>\\s*#workspace\\s*>\\.workspace-main-row/);
  assert.match(html, /<\\/div>\\s*<\\/section>\\s*<div id="toastNotice"/);
});
