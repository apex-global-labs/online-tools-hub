(function (root) {
  "use strict";
  const API_URL = "https://spoo.me/api/v1/shorten";
  const DEFAULT_STATUS = "Ready. Paste a website address, with or without https://, to create a short link.";

  function normalizeUrl(value) {
    const raw = String(value || "").trim();
    if (!raw) throw new Error("Enter a website URL first.");
    // Accept ordinary domains and www links without requiring visitors to type a scheme.
    // Explicit non-HTTP schemes remain rejected instead of being silently rewritten.
    const candidate = /^https?:\/\//i.test(raw) || /^[a-z][a-z0-9+.-]*:\/\//i.test(raw)
      ? raw
      : "https://" + raw;
    let parsed;
    try { parsed = new URL(candidate); } catch (_) { throw new Error("Enter a valid website address, such as example.com or https://example.com."); }
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error("Only HTTP and HTTPS website links can be shortened.");
    if (!parsed.hostname || parsed.username || parsed.password) throw new Error("Enter a valid public website URL without embedded login details.");
    const host = parsed.hostname.toLowerCase();
    const isIpv4 = /^(?:\\d{1,3}\\.){3}\\d{1,3}$/.test(host);
    if (!isIpv4 && !host.includes(".")) throw new Error("Enter a valid public domain name, such as example.com.");
    if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host === "0.0.0.0" || host === "::1" || /^127\\./.test(host) || /^10\\./.test(host) || /^192\\.168\\./.test(host) || /^172\\.(1[6-9]|2[0-9]|3[01])\\./.test(host)) throw new Error("Local and private network addresses cannot be shortened.");
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
    const url = normalizeUrl(longUrl);
    const customAlias = validateAlias(alias);
    const body = { long_url:url };
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
