(function (root) {
  "use strict";
  const API_URL = "https://spoo.me/";
  const DEFAULT_STATUS = "Ready. Paste a complete website URL to create a short link.";

  function normalizeUrl(value) {
    const raw = String(value || "").trim();
    if (!raw) throw new Error("Enter a website URL first.");
    let parsed;
    try { parsed = new URL(raw); } catch (_) { throw new Error("Enter a complete URL, including https:// or http://."); }
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error("Only HTTP and HTTPS website links can be shortened.");
    if (!parsed.hostname || parsed.username || parsed.password) throw new Error("Enter a valid public website URL without embedded login details.");
    const host = parsed.hostname.toLowerCase();
    if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host === "0.0.0.0" || host === "::1" || /^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) || /^172\.(1[6-9]|2[0-9]|3[01])\./.test(host)) throw new Error("Local and private network addresses cannot be shortened.");
    return parsed.href;
  }

  function validateAlias(value) {
    const alias = String(value || "").trim();
    if (!alias) return "";
    if (!/^[a-zA-Z0-9]{1,16}$/.test(alias)) throw new Error("Custom alias must contain 1–16 letters or numbers only.");
    return alias;
  }

  async function createShortUrl(longUrl, alias = "", fetchImpl = root.fetch) {
    if (typeof fetchImpl !== "function") throw new Error("Your browser does not support the required network request.");
    const url = normalizeUrl(longUrl);
    const customAlias = validateAlias(alias);
    const body = new URLSearchParams({ url });
    if (customAlias) body.set("alias", customAlias);
    const response = await fetchImpl(API_URL, { method:"POST", headers:{ "Accept":"application/json", "Content-Type":"application/x-www-form-urlencoded" }, body });
    let data = {};
    try { data = await response.json(); } catch (_) {}
    if (response.status === 429) throw new Error("The free shortening service is temporarily rate-limited. Please try again later.");
    if (!response.ok) throw new Error(data.message || data.error || "The shortening service could not create this link. Check the URL and try again.");
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
