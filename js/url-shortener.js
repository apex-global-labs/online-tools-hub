(function (root) {
  "use strict";
  const API_URL = "https://spoo.me/api/v1/shorten";
  const DEFAULT_STATUS = "Ready. Paste a website address, with or without https://, to create a short link.";

  function isBlockedIpv4(address) {
    const parts = address.split(".").map(Number);
    if (parts.length !== 4 || parts.some(part => !Number.isInteger(part) || part < 0 || part > 255)) return true;
    const [a, b, c] = parts;
    return a === 0 || a === 10 || a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && ((b === 0 && (c === 0 || c === 2)) || (b === 88 && c === 99) || b === 168)) ||
      (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) ||
      (a === 203 && b === 0 && c === 113) || a >= 224;
  }

  function parseIpv6(hostname) {
    const host = hostname.startsWith("[") && hostname.endsWith("]")
      ? hostname.slice(1, -1).toLowerCase()
      : hostname.toLowerCase();
    if (!host.includes(":") || (host.match(/::/g) || []).length > 1) return null;
    let input = host;
    if (input.includes(".")) {
      const lastColon = input.lastIndexOf(":");
      if (lastColon < 0) return null;
      const ipv4 = input.slice(lastColon + 1), octets = ipv4.split(".").map(Number);
      if (octets.length !== 4 || octets.some((n, i) => !/^\d{1,3}$/.test(ipv4.split(".")[i]) || n < 0 || n > 255)) return null;
      input = input.slice(0, lastColon + 1) + ((octets[0] << 8) | octets[1]).toString(16) + ":" + ((octets[2] << 8) | octets[3]).toString(16);
    }
    const halves = input.split("::");
    const left = halves[0] ? halves[0].split(":") : [];
    const right = halves.length === 2 && halves[1] ? halves[1].split(":") : [];
    if (halves.length === 1 && left.length !== 8) return null;
    const missing = 8 - left.length - right.length;
    if ((halves.length === 2 && missing < 1) || missing < 0) return null;
    const groups = [...left, ...Array(missing).fill("0"), ...right];
    if (groups.length !== 8 || groups.some(group => !/^[0-9a-f]{1,4}$/.test(group))) return null;
    return groups.map(group => parseInt(group, 16));
  }

  function isBlockedIpv6(hostname) {
    const groups = parseIpv6(hostname);
    if (!groups) return true;
    if (groups.every(group => group === 0) || groups.slice(0, 6).every(group => group === 0)) return true; // unspecified, loopback and deprecated IPv4-compatible forms
    // Block all IPv4-mapped IPv6 addresses, including mapped private/local IPv4.
    if (groups.slice(0, 5).every(group => group === 0) && groups[5] === 0xffff) return true;
    const first = groups[0], second = groups[1];
    return (first & 0xfe00) === 0xfc00 || // fc00::/7 unique-local
      (first & 0xffc0) === 0xfe80 ||      // fe80::/10 link-local
      (first & 0xffc0) === 0xfec0 ||      // fec0::/10 deprecated site-local
      (first & 0xff00) === 0xff00 ||      // ff00::/8 multicast
      (first === 0x2001 && second <= 0x01ff) || // IETF protocol/special assignments
      first === 0x2002 ||                // 6to4
      (first === 0x0064 && second === 0xff9b && groups[2] === 0 && groups[3] === 0 && groups[4] === 0 && groups[5] === 0) || // NAT64 well-known /96
      (first === 0x0064 && second === 0xff9b && groups[2] === 1) || // local-use NAT64 /48
      (first === 0x0100 && groups.slice(1, 4).every(group => group === 0)) || // 100::/64 discard-only
      (first === 0x2001 && second === 0x0db8) || // 2001:db8::/32 documentation
      (first === 0x3fff && second <= 0x0fff); // 3fff::/20 documentation
  }

  function normalizeUrl(value) {
    const raw = String(value || "").trim();
    if (!raw) throw new Error("Enter a website URL first.");
    // Accept ordinary domains and www links without requiring visitors to type a scheme.
    // Explicit non-HTTP schemes remain rejected instead of being silently rewritten.
    const candidate = /^https?:\/\//i.test(raw) || /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : "https://" + raw;
    let parsed;
    try { parsed = new URL(candidate); } catch (_) { throw new Error("Enter a valid website address, such as example.com or https://example.com."); }
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error("Only HTTP and HTTPS website links can be shortened.");
    if (!parsed.hostname || parsed.username || parsed.password) throw new Error("Enter a valid public website URL without embedded login details.");
    const host = parsed.hostname.toLowerCase();
    const domainHost = host.endsWith(".") ? host.slice(0, -1) : host;
    const isIpv6 = host.startsWith("[") && host.endsWith("]");
    const isIpv4 = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(domainHost);
    if (isIpv6) {
      if (isBlockedIpv6(host)) throw new Error("Local, private and special-use network addresses cannot be shortened.");
    } else if (isIpv4) {
      if (isBlockedIpv4(domainHost)) throw new Error("Local, private and special-use network addresses cannot be shortened.");
    } else if (!domainHost.includes(".") || domainHost === "localhost" || domainHost.endsWith(".localhost") || domainHost.endsWith(".local")) {
      throw new Error("Enter a valid public domain name, such as example.com.");
    }
    return parsed.href;
  }

  function validateAlias(value) {
    const alias = String(value || "").trim();
    if (!alias) return "";
    if (!/^[a-zA-Z0-9_-]{3,16}$/.test(alias)) throw new Error("Custom alias must contain 3–16 letters, numbers, hyphens or underscores.");
    return alias;
  }

  async function createShortUrl(longUrl, alias = "", fetchImpl = root.fetch) {
    if (typeof fetchImpl !== "function") throw new Error("Your browser does not support the required network request.");
    const url = normalizeUrl(longUrl), customAlias = validateAlias(alias), body = { long_url:url };
    if (customAlias) body.alias = customAlias;
    const response = await fetchImpl(API_URL, { method:"POST", headers:{ "Accept":"application/json", "Content-Type":"application/json" }, body:JSON.stringify(body) });
    let data = {};
    try { data = await response.json(); } catch (_) {}
    if (response.status === 429) throw new Error("The free shortening service is temporarily rate-limited. Please try again later.");
    if (!response.ok) throw new Error(data.error || data.message || data.code || "The shortening service could not create this link. Check the URL and try again.");
    const shortUrl = String(data.short_url || data.shortUrl || "").trim();
    let parsedShort;
    try { parsedShort = new URL(shortUrl); } catch (_) {}
    if (!parsedShort || parsedShort.protocol !== "https:" || !parsedShort.hostname) throw new Error("The shortening service returned an invalid link. Please try again later.");
    return { shortUrl:parsedShort.href, originalUrl:url, domain:data.domain || parsedShort.hostname };
  }

  function setStatus(text, type) {
    const status = root.document && root.document.getElementById("shortUrlStatus");
    if (!status) return;
    status.textContent = text;
    status.className = "url-shortener-status" + (type ? " is-" + type : "");
  }

  function clear() {
    const doc=root.document; if(!doc)return;
    const input=doc.getElementById("shortUrlInput"),alias=doc.getElementById("shortUrlAlias"),output=doc.getElementById("output"),box=doc.getElementById("shortUrlResultLink"),button=doc.getElementById("shortenUrl");
    if(input)input.value=""; if(alias)alias.value=""; if(output)output.textContent="";
    if(box){box.replaceChildren();box.hidden=true;} if(button)button.disabled=false;
    setStatus(DEFAULT_STATUS,"");
  }

  function init() {
    const doc=root.document; if(!doc)return;
    const button=doc.getElementById("shortenUrl");
    if(!button || button.dataset.urlShortenerReady==="true")return;
    button.dataset.urlShortenerReady="true";
    button.addEventListener("click",async()=>{
      const urlInput=doc.getElementById("shortUrlInput"),aliasInput=doc.getElementById("shortUrlAlias"),output=doc.getElementById("output"),box=doc.getElementById("shortUrlResultLink");
      button.disabled=true; if(output)output.textContent=""; if(box){box.replaceChildren();box.hidden=true;}
      setStatus("Creating your short link…","");
      try{
        const result=await createShortUrl(urlInput&&urlInput.value,aliasInput&&aliasInput.value);
        if(output)output.textContent=result.shortUrl;
        if(box){const a=doc.createElement("a");a.href=result.shortUrl;a.target="_blank";a.rel="noopener noreferrer";a.textContent="Open short link in a new tab";box.append(a);box.hidden=false;}
        setStatus("Short link created successfully. Copy it and share it.","success");
      }catch(error){setStatus(error&&error.message?error.message:"Could not create the short link. Check your connection and try again.","error");}
      finally{button.disabled=false;}
    });
  }
  const api={normalizeUrl,validateAlias,createShortUrl,init,clear};
  if(root)root.ToolNestUrlShortener=api;
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:globalThis);
