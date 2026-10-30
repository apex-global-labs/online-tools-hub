(() => {
  "use strict";
  function validateHttpUrl(value, label) {
    let url;
    try { url = new URL(String(value).trim()); }
    catch { throw new Error(label + " must be a complete HTTP or HTTPS URL."); }
    if (!["http:", "https:"].includes(url.protocol) || !url.hostname || url.username || url.password) {
      throw new Error(label + " must be a valid HTTP or HTTPS URL without credentials.");
    }
    return url;
  }
  function buildRobotsTxt({ sitemap = "", disallow = "" } = {}) {
    const paths = String(disallow).split(/\r?\n/).map(value => value.trim()).filter(Boolean);
    if (paths.length > 20) throw new Error("Use no more than 20 disallow paths.");
    for (const path of paths) {
      if (!path.startsWith("/") || path.length > 2048 || /[\r\n\u0000-\u001f]/.test(path)) {
        throw new Error("Each disallow rule must be a path beginning with / and contain no control characters.");
      }
    }
    const lines = ["User-agent: *"];
    if (paths.length) paths.forEach(path => lines.push("Disallow: " + path));
    else lines.push("Disallow:");
    const sitemapValue = String(sitemap).trim();
    if (sitemapValue) lines.push("Sitemap: " + validateHttpUrl(sitemapValue, "Sitemap URL").href);
    return lines.join("\n");
  }
  function escapeXml(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  }
  function buildSitemapXml(input) {
    const raw = String(input ?? "");
    if (raw.length > 300000) throw new Error("URL input is too large. Keep it under 300 KB.");
    const entries = raw.split(/\r?\n/).map(value => value.trim()).filter(Boolean);
    if (!entries.length) throw new Error("Enter at least one website URL.");
    if (entries.length > 500) throw new Error("A sitemap can contain up to 500 URLs in this tool.");
    const urls = [], seen = new Set();
    for (const entry of entries) {
      const url = validateHttpUrl(entry, "Each sitemap entry");
      if (url.hash) throw new Error("Remove URL fragments (#...) from sitemap entries.");
      if (!seen.has(url.href)) { seen.add(url.href); urls.push(url.href); }
    }
    const body = urls.map(url => "  <url>\n    <loc>" + escapeXml(url) + "</loc>\n  </url>").join("\n");
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + body + "\n</urlset>";
  }
  function buildCssGradient({ type = "linear", angle = 135, colorA = "#6366f1", colorB = "#06b6d4" } = {}) {
    const first = String(colorA).trim(), second = String(colorB).trim();
    if (!/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(first) || !/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(second)) {
      throw new Error("Choose two valid HEX colors.");
    }
    if (!["linear", "radial"].includes(type)) throw new Error("Choose a linear or radial gradient.");
    const degrees = Number(angle);
    if (!Number.isInteger(degrees) || degrees < 0 || degrees > 360) throw new Error("Gradient angle must be a whole number from 0 to 360.");
    const a = first.toUpperCase(), b = second.toUpperCase();
    return type === "linear" ? "linear-gradient(" + degrees + "deg, " + a + ", " + b + ")" : "radial-gradient(circle, " + a + ", " + b + ")";
  }
  globalThis.ToolNestPhase15 = Object.freeze({ buildRobotsTxt, buildSitemapXml, buildCssGradient });
})();
