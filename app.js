
const tools = [
{id:"case",name:"Text Case Converter",category:"Text",icon:"Aa",description:"Convert text case and count words, characters and lines."},
{id:"slug",name:"Slug Generator",category:"Text",icon:"🔗",description:"Create clean, URL-friendly slugs from text."},
{id:"diff",name:"Text Diff Checker",category:"Text",icon:"⇄",description:"Compare two text blocks and identify changed lines."},
{id:"markdown",name:"Markdown Previewer",category:"Text",icon:"M↓",description:"Preview basic Markdown safely as formatted text."},
{id:"base64",name:"Base64 Encoder / Decoder",category:"Developer",icon:"64",description:"Encode or decode text with UTF-8 support."},
{id:"json",name:"JSON Formatter & Validator",category:"Developer",icon:"{}",description:"Validate JSON and format or minify it."},
{id:"url",name:"URL Encode / Decode",category:"Developer",icon:"％",description:"Encode or decode URL components."},
{id:"meta",name:"Meta Tag Generator",category:"Developer",icon:"⌘",description:"Generate copy-ready SEO meta tag markup."},
{id:"csvjson",name:"CSV ↔ JSON Converter",category:"Developer",icon:"⇄",description:"Convert CSV data to JSON and JSON arrays to CSV."},
{id:"uuid",name:"UUID Generator",category:"Developer",icon:"🆔",description:"Generate random version 4 UUIDs in your browser."},
{id:"sha256",name:"SHA-256 Hash Generator",category:"Developer",icon:"#️⃣",description:"Create a SHA-256 hash from text in your browser."},
{id:"password",name:"Password Generator",category:"Utilities",icon:"✳",description:"Create a random password with character options."},
{id:"image64",name:"Image to Base64",category:"Image",icon:"▧",description:"Convert a local image into a Base64 data URL."},
{id:"qr",name:"QR Code Generator",category:"Image",icon:"▦",description:"Generate a QR code for text or a URL."},
{id:"color",name:"Color Converter",category:"Image",icon:"◉",description:"Convert HEX colors into RGB and HSL values."},
{id:"forexcalc",name:"Forex Currency Converter",category:"Calculators",icon:"💱",description:"Convert major currencies using automatically retrieved reference exchange rates."},
{id:"percentage",name:"Percentage Calculator",category:"Calculators",icon:"％",description:"Calculate percentages, find what percent one value is of another, and compare percentage changes."},
{id:"compound",name:"Compound Interest Calculator",category:"Calculators",icon:"∑",description:"Estimate compound growth using principal, annual rate, time and compounding frequency."},
{id:"emi",name:"EMI / Loan Calculator",category:"Calculators",icon:"৳",description:"Estimate monthly loan instalments, total repayment and total interest from loan terms."},
{id:"unit",name:"Unit Converter",category:"Calculators",icon:"↔",description:"Convert length, weight and temperature units."},
{id:"age",name:"Age & Date Difference",category:"Calculators",icon:"▦",description:"Calculate age or the days between two dates."},
{id:"counter",name:"Word & Character Counter",category:"Text",icon:"¶",description:"Count words, characters, sentences and paragraphs."},
{id:"duplines",name:"Duplicate Lines Remover",category:"Text",icon:"≡",description:"Remove repeated lines while preserving the first occurrence and original order."},
{id:"timestamp",name:"Unix Timestamp Converter",category:"Calculators",icon:"◷",description:"Convert Unix timestamps to dates and dates to Unix time."},
{id:"whitespace",name:"Extra Spaces Remover",category:"Text",icon:"↔",description:"Clean repeated spaces and unwanted blank lines from text."},
{id:"htmlentities",name:"HTML Entity Encoder / Decoder",category:"Developer",icon:"</>",description:"Encode special characters as HTML entities or decode entities to text."},
{id:"imageresize",name:"Image Resizer",category:"Image",icon:"↗",description:"Resize a local image to custom pixel dimensions."},
{id:"imagecompress",name:"Image Compressor",category:"Image",icon:"▤",description:"Reduce image file size with adjustable quality settings."},
{id:"loremipsum",name:"Lorem Ipsum Generator",category:"Text",icon:"¶",description:"Generate placeholder Lorem Ipsum text with adjustable paragraphs and sentences."}
];

const $ = (s,root=document)=>root.querySelector(s);
let cardTools = tools;
const grid=$("#toolGrid"), panel=$("#toolPanel"), workspace=$("#workspace");
let activeCategory="All", activeTool=null;
$("#year").textContent=new Date().getFullYear();

const cardTaglines={
 case:"Make every word fit your style",
 slug:"Turn titles into clean URLs",
 diff:"Spot changes between two texts",
 markdown:"Write and preview Markdown",
 base64:"Encode and decode text quickly",
 json:"Format, minify and validate JSON",
 url:"Safely encode URL components",
 meta:"Create SEO-ready meta markup",
 csvjson:"Move data between CSV and JSON",
 uuid:"Generate unique IDs instantly",
 sha256:"Create a SHA-256 text hash",
 password:"Build a password to your needs",
 image64:"Convert images into data URLs",
 qr:"Turn text or links into QR codes",
 color:"Explore HEX, RGB and HSL",
 forexcalc:"Convert currencies with reference rates",
 unit:"Convert common measurement units",
 age:"Find ages and date differences",
 counter:"Count words and characters",
 duplines:"Clean repeated lines from text",
 timestamp:"Translate timestamps into readable dates",
 whitespace:"Tidy spacing in seconds",
 htmlentities:"Convert special characters safely",
 imageresize:"Set image dimensions in pixels",
 imagecompress:"Make image files lighter",
 loremipsum:"Create realistic placeholder paragraphs",
 percentage:"Work out percentages and percentage changes",
 compound:"Estimate how savings grow with compounding",
 emi:"Understand monthly instalments and loan cost"
};

function renderCards(){
 const q=$("#toolSearch").value.trim().toLowerCase();
 const filtered=cardTools.filter(t=>(activeCategory==="All"||t.category===activeCategory)&&`${t.name} ${t.description} ${t.category}`.toLowerCase().includes(q));
 grid.innerHTML=filtered.map(t=>`<button class="tool-card" type="button" data-tool="${t.id}" aria-label="Open ${escapeHtml(t.name)}"><span class="iconbox" aria-hidden="true">${escapeHtml(t.icon)}</span><span class="category mt-3">${escapeHtml(t.category==="Image"?"Images":t.category==="Developer"?"Dev Tools":t.category)}</span><h3>${escapeHtml(t.name)}</h3><p>${escapeHtml(t.description)}</p><span class="card-tagline">${escapeHtml(t.tagline||cardTaglines[t.id]||"Simple tools for everyday tasks")}</span><span class="launch">Open tool <span aria-hidden="true">→</span></span></button>`).join("");
 $("#resultsCount").textContent=`Showing ${filtered.length} of ${cardTools.length} tools`;
 $("#noResults").classList.toggle("hidden",filtered.length!==0);
}

function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

$("#categoryFilters").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;activeCategory=b.dataset.category;document.querySelectorAll(".filter-chip").forEach(x=>{const selected=x===b;x.classList.toggle("active",selected);x.setAttribute("aria-pressed",String(selected));});renderCards();});
$("#toolSearch").addEventListener("input",renderCards);
grid.addEventListener("click",e=>{const b=e.target.closest("[data-tool]");if(b)openTool(b.dataset.tool);});

function closeTool(updateHistory=true){
 workspace.classList.add("hidden");
 document.body.classList.remove("tool-open");
 activeTool=null;
 if(updateHistory&&(location.hash.startsWith("#tool/")||location.hash.startsWith("#/tools/"))) history.pushState(null,"",location.pathname+location.search);
 window.scrollTo({top:0,behavior:"smooth"});
}

function showToolNotFound(slug=""){
 activeTool=null;
 document.body.classList.add("tool-open");
 workspace.classList.remove("hidden");
 $("#workspaceTitle").textContent="404 — Tool Not Found";
 $("#workspaceDescription").textContent="We couldn’t find that tool. It may have moved or the URL may be incorrect.";
 $("#workspaceBreadcrumb").innerHTML='<button type="button" class="breadcrumb-home" data-workspace-home>Home</button><span aria-hidden="true">›</span><span aria-current="page">Tool not found</span>';
 $("#toolMessage").textContent="";
 $("#toolPanel").innerHTML='<div class="workspace-main-card workspace-not-found"><span class="not-found-code">404</span><h2>Tool not found</h2><p class="muted">The requested tool '+(slug?'<code>'+escapeHtml(slug)+'</code>':'')+' isn’t available in ToolNest.</p><button type="button" class="btn-primary" data-workspace-home>Back to all tools</button></div>';
 $("#toolPanel").querySelectorAll("[data-workspace-home]").forEach(button=>button.addEventListener("click",()=>closeTool()));
 window.scrollTo({top:0,behavior:"smooth"});
}

window.openTool=openTool;
window.showToolNotFound=showToolNotFound;
$("#closeWorkspace").addEventListener("click",closeTool);

window.addEventListener("popstate",()=>{
 const hash=location.hash;
 if(hash.startsWith("#tool/")){
  const id=hash.slice(6);
  if(tools.some(t=>t.id===id))openTool(id,false);else showToolNotFound(id);
  return;
 }
 if(hash.startsWith("#/tools/")){
  const slug=hash.slice(8).replace(/\/$/,"").toLowerCase();
  const item=cardTools.find(t=>t.slug===slug);
  if(item&&tools.some(t=>t.id===item.id))openTool(item.id,false);else showToolNotFound(slug);
  return;
 }
 closeTool(false);
});

document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("#toolSearch").focus();}});

// Restore the visitor's last selected theme, when storage is available.
try {
 const savedTheme = localStorage.getItem("toolnest-theme");
 if (savedTheme === "dark") document.documentElement.classList.add("dark");
 if (savedTheme === "light") document.documentElement.classList.remove("dark");
} catch (_) { /* Private browsing or storage restrictions: use the default theme. */ }

$("#themeToggle").addEventListener("click",()=>{
 document.documentElement.classList.toggle("dark");
 const dark=document.documentElement.classList.contains("dark");
 $("#themeToggle").textContent=dark?"☀ Day":"☾ Night";
 $("#themeToggle").setAttribute("aria-label",dark?"Switch to light mode":"Switch to night mode");
 $("#themeToggle").setAttribute("aria-pressed",String(dark));
 document.querySelector('meta[name="theme-color"]').content=dark?"#020617":"#ffffff";
 try { localStorage.setItem("toolnest-theme", dark ? "dark" : "light"); } catch (_) { /* Theme still works for this visit. */ }
});
$("#themeToggle").textContent=document.documentElement.classList.contains("dark")?"☀ Day":"☾ Night";
$("#themeToggle").setAttribute("aria-label",document.documentElement.classList.contains("dark")?"Switch to light mode":"Switch to night mode");
$("#themeToggle").setAttribute("aria-pressed",String(document.documentElement.classList.contains("dark")));

renderCards();

// Load display metadata from JSON. The built-in catalogue remains a fallback.
fetch("js/tools-data.json")
  .then(response => {
    if (!response.ok) throw new Error("Tool metadata could not be loaded.");
    return response.json();
  })
  .then(metadata => {
    if (!Array.isArray(metadata) || metadata.length !== tools.length) {
      throw new Error("Tool metadata is incomplete.");
    }
    const nextCards = metadata.map(item => {
      const implementation = tools.find(tool => tool.id === item.id);
      if (!implementation) throw new Error("Unknown tool metadata: " + item.id);
      return {
        ...implementation,
        name: item.title || implementation.name,
        category: item.category || implementation.category,
        icon: item.icon || implementation.icon,
        slug: item.slug || "",
        description: item.description || implementation.description,
        tagline: item.tagline || cardTaglines[item.id] || "Simple tools for everyday tasks"
      };
    });
    cardTools = nextCards;
    renderCards();
  })
  .catch(error => {
    console.warn("ToolNest: using built-in card data.", error);
  });

const input=(id,label,placeholder="",type="text")=>`<div><label class="field-label" for="${id}">${label}</label><input class="field" id="${id}" type="${type}" placeholder="${placeholder}"></div>`;
const textarea=(id,label,placeholder="Enter text here...")=>`<div><label class="field-label" for="${id}">${label}</label><textarea id="${id}" class="field" placeholder="${placeholder}"></textarea></div>`;
const select=(id,label,options)=>`<div><label class="field-label" for="${id}">${label}</label><select id="${id}" class="field">${options.map(o=>`<option value="${o[0]}">${o[1]}</option>`).join("")}</select></div>`;
const btn=(id,label,primary=true)=>`<button id="${id}" type="button" class="${primary?"btn-primary":"btn-secondary"}">${label}</button>`;
const out=(id="output")=>`<div class="result-section"><label class="field-label" for="${id}">Result</label><div id="${id}" class="output" role="region" aria-live="polite" tabindex="0"></div></div>`;
const form=(content)=>`<div class="tool-form">${content}</div>`;
const financeForm=(content)=>`<div class="tool-form finance-calculator">${content}</div>`;

let toastTimer;
function showToast(text,type="success"){
 const toast=$("#toastNotice");
 if(!toast)return;
 toast.textContent=text;
 toast.className=`toolnest-toast is-visible ${type==="error"?"is-error":"is-success"}`;
 clearTimeout(toastTimer);
 toastTimer=setTimeout(()=>toast.classList.remove("is-visible"),2600);
}
function message(text,type="success"){
 $("#toolMessage").textContent=text;
 $("#toolMessage").className=`mt-4 text-sm ${type}`;
 if(text)showToast(text,type);
}
function setOutput(text,id="output"){const el=$("#"+id);if(el)el.textContent=text;}

function copyOutput(id="output"){
 const el=$("#"+id);
 const text = id === "markdownPreview" ? (el?.innerText ?? el?.textContent ?? "") : (el?.textContent ?? "");
 if(!el||!text.trim()){message("There is no result to copy yet.","error");return;}
 if(!navigator.clipboard?.writeText){message("Clipboard access is unavailable. Select and copy the result manually.","error");return;}
 navigator.clipboard.writeText(text).then(()=>message("Copied to clipboard.")).catch(()=>message("Clipboard access was blocked. Select and copy the result manually.","error"));
}

function bind(id,fn){
 const el=$("#"+id);
 if(el)el.addEventListener("click",()=>{try{fn();}catch(e){message(e.message||"Something went wrong.","error");}});
}

function openTool(id,updateHistory=true){
 activeTool=tools.find(t=>t.id===id);
 if(!activeTool){showToolNotFound(id);return;}
 document.body.classList.add("tool-open");
 $("#workspaceTitle").textContent=activeTool.name;
 $("#workspaceDescription").textContent=activeTool.description;
 $("#toolMessage").textContent="";
 $("#toolMessage").className="mt-4 text-sm";
 const meta=cardTools.find(t=>t.id===id)||activeTool;
 const category=meta.category==="Developer"?"Dev Tools":meta.category==="Image"?"Image Tools":meta.category||"Tools";
 $("#workspaceBreadcrumb").innerHTML='<button type="button" class="breadcrumb-home" data-workspace-home>Home</button><span aria-hidden="true">›</span><span>'+escapeHtml(category)+'</span><span aria-hidden="true">›</span><span aria-current="page">'+escapeHtml(activeTool.name)+'</span>';
 $("#workspaceBreadcrumb").querySelector("[data-workspace-home]").addEventListener("click",()=>closeTool());
 workspace.classList.remove("hidden");
 panel.innerHTML='<div class="workspace-main-card">'+toolMarkup(id)+'<div class="actions universal-tool-actions" aria-label="Common tool actions"><button id="universalCopy" type="button" class="btn-secondary">Copy result</button><button id="universalDownload" type="button" class="btn-secondary">Download result</button><button id="universalClear" type="button" class="btn-secondary">Clear</button></div></div>';
 wireTool(id);
 wireUniversalActions(id);
 if(updateHistory){
  const slug=meta.slug;
  const nextHash=slug?`#/tools/${slug}`:`#tool/${id}`;
  if(location.hash!==nextHash)history.pushState({tool:id},"",nextHash);
 }
 window.scrollTo({top:0,behavior:"instant"});
 // Automatic focus disabled to avoid unwanted scrolling.
}

function wireUniversalActions(id){
 const resultText=()=>{
  const output=$("#output");
  if(output?.textContent.trim())return output.textContent;
  const preview=$("#markdownPreview");
  if(preview?.innerText?.trim())return preview.innerText;
  return "";
 };
 bind("universalCopy",()=>{
  const canvas=$("#qrCanvas");
  if(canvas){
   const value=$("#qrText")?.value.trim()||"";
   if(!value){message("Generate a QR code first.","error");return;}
   if(!navigator.clipboard?.writeText){message("Clipboard access is unavailable. Select and copy the QR text manually.","error");return;}
   navigator.clipboard.writeText(value).then(()=>message("QR content copied.")).catch(()=>message("Clipboard access was blocked. Copy the QR text manually.","error"));
   return;
  }
  const text=resultText();
  if(!text.trim()){message("There is no result to copy yet.","error");return;}
  if(!navigator.clipboard?.writeText){message("Clipboard access is unavailable. Select and copy the result manually.","error");return;}
  navigator.clipboard.writeText(text).then(()=>message("Copied to clipboard.")).catch(()=>message("Clipboard access was blocked. Select and copy the result manually.","error"));
 });
 bind("universalDownload",()=>{
  const canvas=$("#qrCanvas");
  if(canvas){
   try{const a=document.createElement("a");a.href=canvas.toDataURL("image/png");a.download="toolnest-qr.png";a.click();message("QR code downloaded.");}
   catch{message("Could not download the QR image.","error");}
   return;
  }
  const output=$("#output");
  if(output?.dataset.downloadUrl){const a=document.createElement("a");a.href=output.dataset.downloadUrl;a.download=output.dataset.downloadName||"toolnest-image.png";a.click();message("Image download started.");return;}
  const text=resultText();
  if(!text.trim()){message("Generate a result before downloading.","error");return;}
  const blob=new Blob([text],{type:"text/plain;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download="toolnest-"+id+"-result.txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  message("Result downloaded as a text file.");
 });
 bind("universalClear",()=>{
  // QR Studio keeps artwork and render state in local variables; use its own reset handler.
  if(id==="qr"){ $("#qrClear")?.click(); return; }
  if(id==="imageresize"||id==="imagecompress"){ $("#clearImage")?.click(); return; }
  panel.querySelectorAll("input,textarea").forEach(el=>{
   if(el.type==="checkbox"||el.type==="radio")el.checked=el.defaultChecked;
   else if(el.type==="file")el.value="";
   else if(el.type!=="button"&&el.type!=="submit")el.value="";
  });
  panel.querySelectorAll("select").forEach(el=>{el.selectedIndex=0;});
  panel.querySelectorAll(".output").forEach(el=>{if(el.dataset.downloadUrl)URL.revokeObjectURL(el.dataset.downloadUrl);delete el.dataset.downloadUrl;delete el.dataset.downloadName;el.textContent="";});
  const preview=$("#markdownPreview");if(preview)preview.innerHTML="";
  ["imagePreview","qrOutput"].forEach(selector=>{const el=$("#"+selector);if(el)el.innerHTML="";});
  const swatch=$("#colorSwatch");if(swatch)swatch.style.background="";
  const stats=$("#stats");if(stats)stats.textContent="";
  $("#toolMessage").textContent="";
  $("#toolMessage").className="mt-4 text-sm";
  message("Tool cleared.");
 });
}

function toolMarkup(id){
 switch(id){
 case "case":return form(`${textarea("sourceText","Your text")}<div class="actions">${btn("upper","UPPERCASE")}${btn("lower","lowercase",false)}${btn("sentence","Sentence case",false)}${btn("title","Title Case",false)}${btn("copy","Copy result",false)}</div>${out()}<p id="stats" class="muted text-sm"></p>`);
 case "duplines":return form(`${textarea("sourceText","Paste text with repeated lines")}<div class="actions">${btn("removeDuplicates","Remove duplicate lines")}${btn("copy","Copy result",false)}</div>${out()}<p class="muted text-sm">Keeps the first occurrence of each exact non-empty line and preserves line order. Blank lines are left unchanged.</p>`);
 case "counter":return form(`${textarea("sourceText","Your text")}<div class="actions">${btn("count","Count text")}${btn("copy","Copy summary",false)}</div>${out()}<p id="stats" class="muted text-sm"></p>`);
 case "base64":return form(`${textarea("sourceText","Text to encode or decode")}<div class="actions">${btn("encode","Encode Base64")}${btn("decode","Decode Base64",false)}${btn("copy","Copy result",false)}</div>${out()}`);
 case "json":return form(`${textarea("sourceText","JSON input",'{"hello":"world"}')}<div class="actions">${btn("format","Format JSON")}${btn("minify","Minify JSON",false)}${btn("copy","Copy result",false)}</div>${out()}`);
 case "url":return form(`${textarea("sourceText","Text or URL")}<div class="actions">${btn("encode","Encode component")}${btn("decode","Decode component",false)}${btn("copy","Copy result",false)}</div>${out()}`);

 case "uuid":return form(`${input("uuidCount","Number of UUIDs (1–100)","1","number")}<div class="actions">${btn("generate","Generate UUIDs")}${btn("copy","Copy result",false)}</div>${out()}<p class="muted text-sm">Creates random version 4 UUIDs locally in your browser.</p>`);
 case "csvjson":return form(`
 <p class="muted text-sm">Convert CSV data to JSON or a JSON array to CSV. All conversion happens in your browser.</p>
 ${textarea("sourceText","Paste CSV or JSON",'name,age,city\\nAlice,25,Dhaka\\nBob,30,Chattogram')}
 <div class="actions">
 ${btn("csvToJson","CSV → JSON")}
 ${btn("jsonToCsv","JSON → CSV",false)}
 ${btn("copy","Copy result",false)}
 </div>
 ${out()}
 <p class="muted text-sm">CSV → JSON uses the first row as column headers. JSON → CSV expects an array of objects.</p>
 `);
 case "sha256":return form(`${textarea("sourceText","Text to hash")}<div class="actions">${btn("generate","Generate SHA-256")}${btn("copy","Copy result",false)}</div>${out()}<p class="muted text-sm">Creates a SHA-256 hash locally in your browser using the Web Crypto API. The same text produces the same hash.</p>`);
 case "password":return form(`<div class="grid gap-4 sm:grid-cols-2">${input("length","Password length (8–128)","16","number")}</div><div class="checkrow"><label><input id="upperOpt" type="checkbox" checked> Uppercase</label><label><input id="lowerOpt" type="checkbox" checked> Lowercase</label><label><input id="numberOpt" type="checkbox" checked> Numbers</label><label><input id="symbolOpt" type="checkbox" checked> Symbols</label></div><div class="actions">${btn("generate","Generate password")}${btn("copy","Copy password",false)}</div>${out()}`);
 case "slug":return form(`${input("sourceText","Text to convert","My Awesome Page Title")}<div class="actions">${btn("generate","Generate slug")}${btn("copy","Copy slug",false)}</div>${out()}`);
 case "diff":return form(`<div class="grid gap-4 md:grid-cols-2">${textarea("leftText","Original text")}${textarea("rightText","New text")}</div><div class="actions">${btn("compare","Compare text")}${btn("copy","Copy result",false)}</div>${out()}`);
 case "markdown":return form(`${textarea("sourceText","Markdown input","# Hello\\n\\nWrite **bold** text, *italic* text, and a [link](https://example.com).")}<div class="actions">${btn("preview","Preview Markdown")}${btn("copy","Copy preview text",false)}</div><div><label class="field-label">Preview</label><div id="markdownPreview"></div></div>`);
 case "image64":return form(`<div><label class="field-label" for="imageFile">Choose an image</label><input class="field" id="imageFile" type="file" accept="image/*"></div><div id="imagePreview"></div>${out()}<div class="actions">${btn("copy","Copy data URL",false)}</div><p class="muted text-sm">Large images create very long strings. Conversion stays in this browser.</p>`);
 case "qr":return form(`
<div class="qr-studio">
 <div class="qr-studio-intro"><span class="qr-studio-kicker">TOOLNEST QR STUDIO</span><h3>Make your QR code</h3><p>Start with a clean black-and-white QR, or switch to Custom Mode for colors, patterns and image blending. Processing stays in your browser.</p></div>
 <div class="qr-mode-switch" role="group" aria-label="QR design mode"><button type="button" class="btn-primary" id="qrDefaultMode" aria-pressed="true">Default Mode</button><button type="button" class="btn-secondary" id="qrCustomMode" aria-pressed="false">Custom Mode</button></div>
 <div class="field-group">${input("qrText","Text or URL","https://example.com")}</div>
 <div id="qrCustomPanel" hidden>
  <div class="field-group"><label class="field-label">Color palettes</label><div class="qr-presets">
   <button type="button" class="qr-palette" data-qr-palette="classic"><span style="background:#111827"></span>Classic Dark</button>
   <button type="button" class="qr-palette" data-qr-palette="ocean"><span style="background:#1d4ed8"></span>Ocean Blue</button>
   <button type="button" class="qr-palette" data-qr-palette="emerald"><span style="background:#047857"></span>Emerald Green</button>
   <button type="button" class="qr-palette" data-qr-palette="sunset"><span style="background:#c2410c"></span>Sunset Orange</button>
   <button type="button" class="qr-palette" data-qr-palette="royal"><span style="background:#6d28d9"></span>Royal Purple</button>
  </div></div>
  <div class="qr-fields-grid">
   <div class="field-group"><label class="field-label" for="qrForeground">QR color</label><div class="qr-color-control"><input id="qrForeground" type="color" value="#111827"><span>Foreground</span></div></div>
   <div class="field-group"><label class="field-label" for="qrBackground">Background color</label><div class="qr-color-control"><input id="qrBackground" type="color" value="#ffffff"><span>Background</span></div></div>
  </div>
  <div class="field-group"><label class="field-label" for="qrDotStyle">QR dot shape</label><select class="field" id="qrDotStyle"><option value="square">Square</option><option value="dots">Dots</option><option value="rounded">Rounded</option><option value="classy">Classy</option><option value="extra-rounded">Extra-Rounded</option></select></div>
  <div class="field-group"><label class="field-label" for="qrBlendFile">Image-to-QR Blend <span class="qr-optional">Optional</span></label><input class="field" id="qrBlendFile" type="file" accept="image/png,image/jpeg,image/webp"><p class="muted text-sm">Upload artwork or a logo. It is softly blended beneath the QR pattern in the PNG preview/export.</p><div id="qrBlendPreview" class="qr-upload-preview" hidden></div><label class="qr-range-label" for="qrBlendOpacity">Image visibility <output id="qrBlendValue">50%</output></label><input class="field" id="qrBlendOpacity" type="range" min="20" max="60" value="50"><p class="muted text-sm">Higher visibility makes the artwork clearer but can reduce scan reliability. Test the downloaded PNG with a phone camera before sharing.</p></div>
 </div>
 <div class="qr-preview-panel"><div class="qr-preview-heading"><div><h4>QR preview</h4><p class="muted text-sm">Generate after entering your text or URL.</p></div><span class="qr-live-indicator">READY</span></div><div id="qrPreviewStage" class="qr-preview-stage"><canvas id="qrCanvas" width="1200" height="1200" aria-label="Generated QR code preview"></canvas><div id="qrOutput" hidden></div></div><p class="muted text-sm qr-scan-note">High error correction (H) is enabled. Image blending is intentionally subtle; always scan-test before sharing or printing.</p></div>
 <div class="actions qr-download-actions"><button type="button" class="btn-primary" id="generate">Generate QR</button><button type="button" class="btn-primary" id="qrDownloadPng">Download PNG</button><button type="button" class="btn-secondary" id="qrDownloadSvg">Download SVG</button><button type="button" class="btn-secondary" id="qrClear">Clear</button></div><p id="qrStatus" class="qr-status" role="status" aria-live="polite"></p>
</div>`);

 case "meta":return form(`${input("pageTitle","Page title","My useful website")}${textarea("pageDescription","Meta description","A short and helpful description of this page.")}${input("pageUrl","Canonical URL","https://example.com","url")}<div class="actions">${btn("generate","Generate tags")}${btn("copy","Copy tags",false)}</div>${out()}`);
 case "color":return form(`<div class="grid gap-4 sm:grid-cols-2">${input("hex","HEX color","#6366f1")}<div><label class="field-label" for="colorPicker">Pick a color</label><input class="field h-12" id="colorPicker" type="color" value="#6366f1"></div></div><div class="actions">${btn("convert","Convert color")}${btn("copy","Copy values",false)}</div><div id="colorSwatch" class="h-16 rounded-xl border border-slate-200"></div>${out()}`);
 case "percentage": {
 const mode=$("#percentageMode"),firstLabel=$("#percentageFirstLabel"),secondLabel=$("#percentageSecondLabel");
 const updateLabels=()=>{
  const labels={
   of:["Percentage (%)","Number"],
   what:["Part","Whole"],
   change:["Original value","New value"]
  }[mode.value];
  firstLabel.textContent=labels[0];secondLabel.textContent=labels[1];
  $("#percentageFirst").placeholder=mode.value==="of"?"15":mode.value==="what"?"45":"100";
  $("#percentageSecond").placeholder=mode.value==="of"?"200":mode.value==="what"?"300":"120";
 };
 mode.addEventListener("change",updateLabels);updateLabels();
 bind("calculatePercentage",()=>{
  const rawA=$("#percentageFirst").value.trim(),rawB=$("#percentageSecond").value.trim();
  if(rawA===""||rawB===""){message("Enter both values before calculating.","error");return;}
  try{
   const result=ToolNestFinance.calculatePercentage(mode.value,Number(rawA),Number(rawB));
   const fmt=value=>Number(value.toFixed(8)).toLocaleString("en-US");
   if(result.mode==="of")setOutput(fmt(result.percentage)+"% of "+fmt(result.base)+" = "+fmt(result.result));
   else if(result.mode==="what")setOutput(fmt(result.part)+" is "+fmt(result.result)+"% of "+fmt(result.whole));
   else{
    const direction=result.result>0?"increase":result.result<0?"decrease":"no change";
    setOutput("Original value: "+fmt(result.original)+"\nNew value: "+fmt(result.current)+"\nDifference: "+fmt(result.difference)+"\nPercentage change: "+fmt(Math.abs(result.result))+"% "+direction);
   }
   message("Percentage calculated.");
  }catch(error){message(error.message,"error");}
 });
 break;
 }
 case "compound": {
 bind("calculateCompound",()=>{
  const raw=$("#compoundPrincipal").value.trim(),rate=$("#compoundRate").value.trim(),years=$("#compoundYears").value.trim();
  if(!raw||!rate||!years){message("Enter principal, annual rate and time.","error");return;}
  try{
   const result=ToolNestFinance.calculateCompoundInterest(Number(raw),Number(rate),Number(years),$("#compoundFrequency").value);
   const currency=$("#compoundCurrency").value;
   const fmt=value=>new Intl.NumberFormat("en-US",{style:"currency",currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(value);
   setOutput("Future value: "+fmt(result.amount)+"\nInitial principal: "+fmt(result.principal)+"\nCompound interest earned: "+fmt(result.interest)+"\nAnnual interest rate: "+result.annualRate+"%\nTime: "+result.years+" years\nCompounding: "+$("#compoundFrequency").selectedOptions[0].textContent);
   message("Compound interest calculated.");
  }catch(error){message(error.message,"error");}
 });
 break;
 }
 case "emi": {
 bind("calculateEmi",()=>{
  const raw=$("#emiPrincipal").value.trim(),rate=$("#emiRate").value.trim(),months=$("#emiMonths").value.trim();
  if(!raw||!rate||!months){message("Enter loan amount, annual rate and tenure.","error");return;}
  try{
   const result=ToolNestFinance.calculateEmi(Number(raw),Number(rate),Number(months));
   const currency=$("#emiCurrency").value;
   const fmt=value=>new Intl.NumberFormat("en-US",{style:"currency",currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(value);
   setOutput("Monthly EMI: "+fmt(result.monthlyPayment)+"\nLoan amount: "+fmt(result.principal)+"\nTotal interest: "+fmt(result.totalInterest)+"\nTotal repayment: "+fmt(result.totalPayment)+"\nTenure: "+result.months+" months\nAnnual interest rate: "+result.annualRate+"%");
   message("EMI calculated.");
  }catch(error){message(error.message,"error");}
 });
 break;
 }
 case "forexcalc":return form(`${input("forexAmount","Amount","100","number")}<div class="grid gap-4 sm:grid-cols-2">${select("forexFrom","From currency",[["USD","USD — US Dollar"],["BDT","BDT — Bangladeshi Taka"],["EUR","EUR — Euro"],["GBP","GBP — British Pound"],["JPY","JPY — Japanese Yen"],["AUD","AUD — Australian Dollar"],["CAD","CAD — Canadian Dollar"],["CHF","CHF — Swiss Franc"],["NZD","NZD — New Zealand Dollar"],["INR","INR — Indian Rupee"],["SGD","SGD — Singapore Dollar"],["CNY","CNY — Chinese Yuan"],["PKR","PKR — Pakistani Rupee"],["AED","AED — UAE Dirham"],["SAR","SAR — Saudi Riyal"],["MYR","MYR — Malaysian Ringgit"],["THB","THB — Thai Baht"],["TRY","TRY — Turkish Lira"],["ZAR","ZAR — South African Rand"],["HKD","HKD — Hong Kong Dollar"]])}${select("forexTo","To currency",[["USD","USD — US Dollar"],["BDT","BDT — Bangladeshi Taka"],["EUR","EUR — Euro"],["GBP","GBP — British Pound"],["JPY","JPY — Japanese Yen"],["AUD","AUD — Australian Dollar"],["CAD","CAD — Canadian Dollar"],["CHF","CHF — Swiss Franc"],["NZD","NZD — New Zealand Dollar"],["INR","INR — Indian Rupee"],["SGD","SGD — Singapore Dollar"],["CNY","CNY — Chinese Yuan"],["PKR","PKR — Pakistani Rupee"],["AED","AED — UAE Dirham"],["SAR","SAR — Saudi Riyal"],["MYR","MYR — Malaysian Ringgit"],["THB","THB — Thai Baht"],["TRY","TRY — Turkish Lira"],["ZAR","ZAR — South African Rand"],["HKD","HKD — Hong Kong Dollar"]])}</div><div class="actions">${btn("convertCurrency","Convert currency")}${btn("swapCurrencies","Swap currencies",false)}${btn("copy","Copy result",false)}</div>${out()}<p class="muted text-sm">Uses reference exchange rates retrieved online; rates are generally updated daily and may differ from your broker's executable Forex quotes. For information only, not trading advice. Rate source: <a href="https://www.exchangerate-api.com/docs/free" target="_blank" rel="noopener noreferrer">ExchangeRate-API</a>.</p>`);
 case "unit":return form(`${select("unitType","Conversion type",[["length","Length"],["weight","Weight"],["temperature","Temperature"]])}<div class="grid gap-4 sm:grid-cols-3">${input("unitValue","Value","1","number")}${select("unitFrom","From",[])}${select("unitTo","To",[])}</div><div class="actions">${btn("convert","Convert")}${btn("copy","Copy result",false)}</div>${out()}`);
 case "age":return form(`<div class="grid gap-4 sm:grid-cols-2">${input("dateA","Date of birth / start date","","date")}${input("dateB","End date (blank = today)","","date")}</div><div class="actions">${btn("calculate","Calculate")}${btn("copy","Copy result",false)}</div>${out()}`);
 case "percentage":return financeForm('<div><label class="field-label" for="percentageMode">Calculation type</label><select class="field" id="percentageMode"><option value="of">What is X% of Y?</option><option value="what">X is what percent of Y?</option><option value="change">Percentage increase or decrease</option></select></div><div class="grid gap-4 sm:grid-cols-2"><div><label class="field-label" id="percentageFirstLabel" for="percentageFirst">Percentage (%)</label><input class="field" id="percentageFirst" type="number" step="any" inputmode="decimal" placeholder="15"></div><div><label class="field-label" id="percentageSecondLabel" for="percentageSecond">Number</label><input class="field" id="percentageSecond" type="number" step="any" inputmode="decimal" placeholder="200"></div></div><div class="actions">'+btn("calculatePercentage","Calculate")+'</div>'+out()+'<p class="muted text-sm">Supports positive and negative values where mathematically valid. A zero denominator or zero original value is not allowed for percentage ratios.</p>');
 case "compound":return financeForm('<div class="grid gap-4 sm:grid-cols-2">'+input("compoundPrincipal","Initial principal","100000","number")+select("compoundCurrency","Currency",[["BDT","BDT — Bangladeshi Taka"],["USD","USD — US Dollar"],["EUR","EUR — Euro"],["GBP","GBP — British Pound"],["INR","INR — Indian Rupee"],["SAR","SAR — Saudi Riyal"],["AED","AED — UAE Dirham"]])+'</div><div class="grid gap-4 sm:grid-cols-2">'+input("compoundRate","Annual interest rate (%)","8","number")+input("compoundYears","Time (years)","5","number")+'</div>'+select("compoundFrequency","Compounding frequency",[["1","Annually"],["2","Semi-annually"],["4","Quarterly"],["12","Monthly"],["365","Daily"]])+'<div class="actions">'+btn("calculateCompound","Calculate compound interest")+'</div>'+out()+'<p class="muted text-sm">Assumes a fixed annual nominal rate, constant compounding frequency and no deposits, withdrawals, fees or taxes. Results are estimates, not a bank quote.</p>');
 case "emi":return financeForm('<div class="grid gap-4 sm:grid-cols-2">'+input("emiPrincipal","Loan amount","1000000","number")+select("emiCurrency","Currency",[["BDT","BDT — Bangladeshi Taka"],["USD","USD — US Dollar"],["EUR","EUR — Euro"],["GBP","GBP — British Pound"],["INR","INR — Indian Rupee"],["SAR","SAR — Saudi Riyal"],["AED","AED — UAE Dirham"]])+'</div><div class="grid gap-4 sm:grid-cols-2">'+input("emiRate","Annual interest rate (%)","10","number")+input("emiMonths","Loan tenure (months)","120","number")+'</div><div class="actions">'+btn("calculateEmi","Calculate monthly EMI")+'</div>'+out()+'<p class="muted text-sm">Uses a fixed-rate reducing-balance EMI formula with monthly payments. Excludes fees, insurance, variable rates and lender-specific rounding. Estimate only, not a loan offer.</p>');
 case "timestamp":return form(input("timestampValue","Unix timestamp","1760000000")+select("timestampUnit","Timestamp unit",[["seconds","Seconds"],["milliseconds","Milliseconds"]])+input("localDateTime","Local date and time","","datetime-local") + '<div class="actions">' + btn("convertTimestamp","Convert timestamp") + btn("convertDate","Convert date",false) + btn("copy","Copy result",false) + '</div>' + out() + '<p class="muted text-sm">Unix timestamps represent UTC time. Local date conversion uses your browser time zone.</p>');
 case "loremipsum":return form('<div class="grid gap-4 sm:grid-cols-2"><div><label class="field-label" for="loremParagraphs">Paragraphs (1–10)</label><input class="field" id="loremParagraphs" type="number" min="1" max="10" step="1" placeholder="3"></div>'+select("loremSentences","Sentences per paragraph",[["3","3 sentences"],["1","1 sentence"],["2","2 sentences"],["4","4 sentences"],["5","5 sentences"],["6","6 sentences"],["7","7 sentences"],["8","8 sentences"]])+'</div><div class="checkrow"><label><input id="loremStartStandard" type="checkbox" checked> Start with the classic Lorem ipsum opening</label></div><div class="actions">'+btn("generateLorem","Generate Lorem Ipsum")+btn("copy","Copy result",false)+'</div>'+out()+'<p class="muted text-sm">Generate up to 10 paragraphs with 1–8 sentences per paragraph. Text is created locally in your browser.</p>');
 case "whitespace":return form(textarea("sourceText","Text to clean")+'<div class="checkrow"><label><input id="trimWhitespaceLines" type="checkbox" checked> Trim each line</label><label><input id="removeBlankWhitespaceLines" type="checkbox"> Remove blank lines</label></div><div class="actions">' + btn("cleanWhitespace","Clean text") + btn("copy","Copy result",false) + '</div>' + out());
 case "htmlentities":return form(textarea("sourceText","Text or HTML entities")+'<div class="actions">' + btn("encodeEntities","Encode HTML") + btn("decodeEntities","Decode HTML",false) + btn("copy","Copy result",false) + '</div>' + out() + '<p class="muted text-sm">Decoded content is returned as plain text; it is not executed as HTML.</p>');
 case "imageresize":return form('<div><label class="field-label" for="resizeFile">Choose image (PNG, JPEG or WebP; max 10 MB)</label><input class="field" id="resizeFile" type="file" accept="image/png,image/jpeg,image/webp"></div><div class="grid gap-4 sm:grid-cols-2">' + input("resizeWidth","Width (px)","800","number") + input("resizeHeight","Height (px)","600","number") + '</div><label><input id="resizeKeepRatio" type="checkbox" checked> Keep aspect ratio</label>' + select("resizeFormat","Output format",[["image/png","PNG"],["image/jpeg","JPEG"],["image/webp","WebP"]]) + '<div class="actions">' + btn("resizeImage","Resize image") + btn("clearImage","Clear image",false) + '</div>' + out() + '<div id="imageResultPreview" class="image-tool-preview" hidden></div><p class="muted text-sm">Images are processed locally. Maximum output dimension: 4096 × 4096 pixels.</p>');
 case "imagecompress":return form('<div><label class="field-label" for="compressFile">Choose image (PNG, JPEG or WebP; max 10 MB)</label><input class="field" id="compressFile" type="file" accept="image/png,image/jpeg,image/webp"></div>' + select("compressFormat","Output format",[["image/webp","WebP"],["image/jpeg","JPEG"]]) + '<label class="field-label" for="compressQuality">Quality: <output id="compressQualityValue">75%</output></label><input class="field" id="compressQuality" type="range" min="10" max="95" value="75"><div class="actions">' + btn("compressImage","Compress image") + btn("clearImage","Clear image",false) + '</div>' + out() + '<div id="imageResultPreview" class="image-tool-preview" hidden></div><p class="muted text-sm">Lower quality can reduce file size but may reduce image detail. Review the preview before downloading.</p>');
 default:return `<p class="muted">Tool not found.</p>`;
 }
}

// CSV parser: supports quoted cells, commas and newlines inside quoted cells.
function parseCSV(text){
 const rows=[];
 let row=[],cell="",quoted=false;
 const s=text.replace(/^\uFEFF/,"");

 for(let i=0;i<s.length;i++){
  const ch=s[i];

  if(quoted){
   if(ch==='"'&&s[i+1]==='"'){cell+='"';i++;}
   else if(ch==='"'){quoted=false;}
   else{cell+=ch;}
  }else{
   if(ch==='"'&&cell===""){quoted=true;}
   else if(ch===","){row.push(cell);cell="";}
   else if(ch==="\n"){
    row.push(cell);rows.push(row);row=[];cell="";
   }else if(ch==="\r"){
    if(s[i+1]==="\n")i++;
    row.push(cell);rows.push(row);row=[];cell="";
   }else{cell+=ch;}
  }
 }

 if(quoted)throw new Error("CSV contains an unclosed quotation mark.");
 if(cell!==""||row.length>0){row.push(cell);rows.push(row);}

 while(rows.length&&rows[rows.length-1].every(v=>v.trim()===""))rows.pop();
 return rows;
}

function csvCell(value){
 const s=value===null||value===undefined?"":String(value);
 return /[",\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;
}

function wireTool(id){
 const src=()=>$("#sourceText")?.value??"";
 switch(id){

 case "loremipsum": {
 const words="lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure dolor reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");
 const opening="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
 bind("generateLorem",()=>{
  const rawParagraphs=$("#loremParagraphs").value.trim();
  const paragraphs=rawParagraphs?Number(rawParagraphs):3;
  const sentences=Number($("#loremSentences").value);
  if(!Number.isInteger(paragraphs)||paragraphs<1||paragraphs>10){message("Choose between 1 and 10 paragraphs.","error");return;}
  if(!Number.isInteger(sentences)||sentences<1||sentences>8){message("Choose between 1 and 8 sentences per paragraph.","error");return;}
  const useOpening=$("#loremStartStandard").checked;
  const makeSentence=()=>{
   const length=8+Math.floor(Math.random()*9);
   const phrase=Array.from({length},()=>words[Math.floor(Math.random()*words.length)]).join(" ");
   return phrase.charAt(0).toUpperCase()+phrase.slice(1)+".";
  };
  const result=Array.from({length:paragraphs},(_,paragraphIndex)=>Array.from({length:sentences},(_,sentenceIndex)=>useOpening&&paragraphIndex===0&&sentenceIndex===0?opening:makeSentence()).join(" ")).join("\n\n");
  setOutput(result);
  message("Generated "+paragraphs+" paragraph(s).");
 });
 bind("copy",()=>copyOutput());
 break;
 }

 case "timestamp": {
 const timestampDate=ms=>new Date(ms);
 bind("convertTimestamp",()=>{
  const raw=$("#timestampValue").value.trim(),value=Number(raw),unit=$("#timestampUnit").value;
  if(!raw||!Number.isFinite(value)){message("Enter a valid numeric timestamp.","error");return;}
  const ms=unit==="seconds"?value*1000:value;
  if(!Number.isFinite(ms)||Math.abs(ms)>8640000000000000){message("Timestamp is outside the supported date range.","error");return;}
  const date=timestampDate(ms);
  if(Number.isNaN(date.getTime())){message("Could not interpret this timestamp.","error");return;}
  setOutput("UTC: "+date.toISOString()+"\nLocal time: "+date.toLocaleString()+"\nUnix seconds: "+Math.floor(ms/1000)+"\nUnix milliseconds: "+ms);
 });
 bind("convertDate",()=>{
  const raw=$("#localDateTime").value;
  if(!raw){message("Choose a local date and time first.","error");return;}
  const ms=new Date(raw).getTime();
  if(!Number.isFinite(ms)){message("Enter a valid local date and time.","error");return;}
  $("#timestampValue").value=String(Math.floor(ms/1000));
  $("#timestampUnit").value="seconds";
  setOutput("UTC: "+new Date(ms).toISOString()+"\nLocal time: "+new Date(ms).toLocaleString()+"\nUnix seconds: "+Math.floor(ms/1000)+"\nUnix milliseconds: "+ms);
 });
 bind("copy",()=>copyOutput());
 break;
 }

 case "whitespace": {
 const cleanWhitespace=()=>{
  const source=src();
  if(!source.length){setOutput("");message("Enter some text to clean.","error");return;}
  let lines=source.split(/\r?\n/);
  if($("#trimWhitespaceLines").checked)lines=lines.map(line=>line.replace(/[ \t]+/g," ").trim());
  else lines=lines.map(line=>line.replace(/[ \t]{2,}/g," "));
  if($("#removeBlankWhitespaceLines").checked)lines=lines.filter(line=>line.trim()!=="");
  setOutput(lines.join("\n"));
  message("Text spacing cleaned.");
 };
 bind("cleanWhitespace",cleanWhitespace);
 bind("copy",()=>copyOutput());
 break;
 }

 case "htmlentities": {
 bind("encodeEntities",()=>{
  if(!src()){setOutput("");message("Enter text to encode.","error");return;}
  const area=document.createElement("textarea");
  area.textContent=src();
  setOutput(area.innerHTML);
 });
 bind("decodeEntities",()=>{
  if(!src()){setOutput("");message("Enter HTML entities to decode.","error");return;}
  const area=document.createElement("textarea");
  area.innerHTML=src();
  setOutput(area.value);
 });
 bind("copy",()=>copyOutput());
 break;
 }

 case "imageresize": {
 let resizeUrl=null;
 const clearResize=()=>{
  if(resizeUrl)URL.revokeObjectURL(resizeUrl);
  resizeUrl=null;
  const output=$("#output");if(output){output.textContent="";delete output.dataset.downloadUrl;delete output.dataset.downloadName;}
  $("#imageResultPreview").replaceChildren();$("#imageResultPreview").hidden=true;
  $("#resizeFile").value="";$("#resizeWidth").value="800";$("#resizeHeight").value="600";$("#resizeKeepRatio").checked=true;$("#resizeFormat").value="image/png";
  message("Image resizer cleared.");
 };
 bind("resizeImage",()=>{
  const file=$("#resizeFile").files[0];
  if(!file){message("Choose an image first.","error");return;}
  if(!["image/png","image/jpeg","image/webp"].includes(file.type)){message("Choose a PNG, JPEG or WebP image.","error");return;}
  if(file.size>10*1024*1024){message("Image must be smaller than 10 MB.","error");return;}
  let width=Number($("#resizeWidth").value),height=Number($("#resizeHeight").value);
  if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width>4096||height>4096){message("Width and height must be whole numbers from 1 to 4096.","error");return;}
  const sourceUrl=URL.createObjectURL(file),img=new Image();
  img.onload=()=>{
   URL.revokeObjectURL(sourceUrl);
   const ratio=img.naturalWidth/img.naturalHeight;
   if(img.naturalWidth>12000||img.naturalHeight>12000||img.naturalWidth*img.naturalHeight>40000000){message("Source image dimensions are too large to process safely (maximum 40 megapixels).","error");return;}
   if($("#resizeKeepRatio").checked){
    if(width/height>ratio)width=Math.max(1,Math.round(height*ratio));
    else height=Math.max(1,Math.round(width/ratio));
   }
   if(width>4096||height>4096){message("Result dimensions cannot exceed 4096 pixels.","error");return;}
   const canvas=document.createElement("canvas");canvas.width=width;canvas.height=height;
   const ctx=canvas.getContext("2d");
   if(!ctx){message("Canvas is unavailable in this browser.","error");return;}
   const format=$("#resizeFormat").value;
   if(format==="image/jpeg"){ctx.fillStyle="#ffffff";ctx.fillRect(0,0,width,height);}
   ctx.drawImage(img,0,0,width,height);
   canvas.toBlob(blob=>{
    if(!blob){message("Could not create the resized image.","error");return;}
    if(resizeUrl)URL.revokeObjectURL(resizeUrl);
    resizeUrl=URL.createObjectURL(blob);
    const output=$("#output");output.dataset.downloadUrl=resizeUrl;output.dataset.downloadName="toolnest-resized-image."+(blob.type==="image/png"?"png":blob.type==="image/jpeg"?"jpg":"webp");
    setOutput("Resized image: "+width+" × "+height+" px\nOriginal size: "+(file.size/1024).toFixed(1)+" KB\nNew size: "+(blob.size/1024).toFixed(1)+" KB");
    const preview=$("#imageResultPreview");preview.replaceChildren();const image=document.createElement("img");image.src=resizeUrl;image.alt="Resized image preview";preview.append(image);preview.hidden=false;
    message("Image resized. Use Download result to save it.");
   },format,0.92);
  };
  img.onerror=()=>{URL.revokeObjectURL(sourceUrl);message("Could not read this image file.","error");};
  img.src=sourceUrl;
 });
 bind("copy",()=>copyOutput());
 bind("clearImage",clearResize);
 break;
 }

 case "imagecompress": {
 let compressedUrl=null;
 const clearCompress=()=>{
  if(compressedUrl)URL.revokeObjectURL(compressedUrl);
  compressedUrl=null;
  const output=$("#output");if(output){output.textContent="";delete output.dataset.downloadUrl;delete output.dataset.downloadName;}
  $("#imageResultPreview").replaceChildren();$("#imageResultPreview").hidden=true;
  $("#compressFile").value="";$("#compressFormat").value="image/webp";$("#compressQuality").value="75";$("#compressQualityValue").textContent="75%";
  message("Image compressor cleared.");
 };
 $("#compressQuality").addEventListener("input",()=>{$("#compressQualityValue").textContent=$("#compressQuality").value+"%";});
 bind("compressImage",()=>{
  const file=$("#compressFile").files[0];
  if(!file){message("Choose an image first.","error");return;}
  if(!["image/png","image/jpeg","image/webp"].includes(file.type)){message("Choose a PNG, JPEG or WebP image.","error");return;}
  if(file.size>10*1024*1024){message("Image must be smaller than 10 MB.","error");return;}
  const sourceUrl=URL.createObjectURL(file),img=new Image();
  img.onload=()=>{
   URL.revokeObjectURL(sourceUrl);
   if(img.naturalWidth>4096||img.naturalHeight>4096){message("Image dimensions must not exceed 4096 pixels per side.","error");return;}
   const format=$("#compressFormat").value,quality=Number($("#compressQuality").value)/100;
   const canvas=document.createElement("canvas");canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
   const ctx=canvas.getContext("2d");
   if(!ctx){message("Canvas is unavailable in this browser.","error");return;}
   if(format==="image/jpeg"){ctx.fillStyle="#ffffff";ctx.fillRect(0,0,canvas.width,canvas.height);}
   ctx.drawImage(img,0,0);
   canvas.toBlob(blob=>{
    if(!blob){message("Could not compress this image.","error");return;}
    if(compressedUrl)URL.revokeObjectURL(compressedUrl);
    compressedUrl=URL.createObjectURL(blob);
    const output=$("#output");output.dataset.downloadUrl=compressedUrl;output.dataset.downloadName="toolnest-compressed-image."+(blob.type==="image/webp"?"webp":blob.type==="image/jpeg"?"jpg":"png");
    const saved=((file.size-blob.size)/file.size*100);
    setOutput("Original: "+(file.size/1024).toFixed(1)+" KB\nCompressed: "+(blob.size/1024).toFixed(1)+" KB\nSize change: "+(saved>=0?saved.toFixed(1)+"% smaller":Math.abs(saved).toFixed(1)+"% larger")+"\nDimensions: "+img.naturalWidth+" × "+img.naturalHeight+" px");
    const preview=$("#imageResultPreview");preview.replaceChildren();const image=document.createElement("img");image.src=compressedUrl;image.alt="Compressed image preview";preview.append(image);preview.hidden=false;
    message("Image compressed. Review the preview before downloading.");
   },format,quality);
  };
  img.onerror=()=>{URL.revokeObjectURL(sourceUrl);message("Could not read this image file.","error");};
  img.src=sourceUrl;
 });
 bind("copy",()=>copyOutput());
 bind("clearImage",clearCompress);
 break;
 }

 case "case":
 bind("upper",()=>setOutput(src().toUpperCase()));
 bind("lower",()=>setOutput(src().toLowerCase()));
 bind("sentence",()=>setOutput(src().toLowerCase().replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu,m=>m.toUpperCase())));
 bind("title",()=>setOutput(src().toLowerCase().replace(/\b\p{L}/gu,m=>m.toUpperCase())));
 bind("copy",()=>copyOutput());
 const updateCaseStats=()=>{const s=src(),trimmed=s.trim();$("#stats").textContent=(trimmed?trimmed.split(/\s+/).length:0)+" words · "+Array.from(s).length+" characters · "+(s?s.split(/\r?\n/).length:0)+" lines";};
 $("#sourceText").addEventListener("input",updateCaseStats);
 updateCaseStats();
 break;

 case "duplines":
 const removeDuplicates=()=>{
  const lines=src().split(/\r?\n/);
  const seen=new Set();
  let removed=0;
  const result=lines.filter(line=>{
   if(line.trim()==="")return true;
   if(seen.has(line)){removed++;return false;}
   seen.add(line);
   return true;
  });
  setOutput(result.join("\n"));
  message("Removed "+removed+" duplicate line(s).");
 };
 bind("removeDuplicates",removeDuplicates);
 $("#sourceText").addEventListener("input",removeDuplicates);
 bind("copy",()=>copyOutput());
 break;

 case "counter":
 const count=()=>{const s=src(),trim=s.trim();const summary="Words: "+(trim?trim.split(/\s+/).length:0)+"\nCharacters (with spaces): "+Array.from(s).length+"\nCharacters (without spaces): "+Array.from(s.replace(/\s/g,"")).length+"\nSentences: "+(s.match(/[.!?]+(?=\s|$)/g)||[]).length+"\nParagraphs: "+(trim?trim.split(/\n\s*\n/).length:0);setOutput(summary);$("#stats").textContent=summary.replace(/\n/g," · ");};
 bind("count",count);
 bind("copy",()=>copyOutput());
 $("#sourceText").addEventListener("input",count);
 count();
 break;
 case "base64":
 bind("encode",()=>setOutput(btoa(unescape(encodeURIComponent(src())))));
 bind("decode",()=>{try{setOutput(decodeURIComponent(escape(atob(src().trim()))));message("Decoded successfully.");}catch{message("Invalid Base64 input or unsupported data.","error");}});
 bind("copy",()=>copyOutput());
 break;

 case "json":
 bind("format",()=>{try{setOutput(JSON.stringify(JSON.parse(src()),null,2));message("Valid JSON.");}catch(e){message("Invalid JSON: "+e.message,"error");}});
 bind("minify",()=>{try{setOutput(JSON.stringify(JSON.parse(src())));message("Valid JSON.");}catch(e){message("Invalid JSON: "+e.message,"error");}});
 bind("copy",()=>copyOutput());
 break;

 case "url":
 bind("encode",()=>setOutput(encodeURIComponent(src())));
 bind("decode",()=>{try{setOutput(decodeURIComponent(src().replace(/\+/g," ")));}catch{message("Invalid encoded URL text.","error");}});
 bind("copy",()=>copyOutput());
 break;

 case "uuid":
 bind("generate",()=>{
  const raw=$("#uuidCount").value.trim();
  const count=Number(raw);
  if(!raw||!Number.isInteger(count)||count<1||count>100){message("Enter a whole number from 1 to 100.","error");return;}
  const makeUuid=()=>{
   if(typeof crypto.randomUUID==="function")return crypto.randomUUID();
   const bytes=new Uint8Array(16);
   crypto.getRandomValues(bytes);
   bytes[6]=(bytes[6]&0x0f)|0x40;
   bytes[8]=(bytes[8]&0x3f)|0x80;
   const hex=Array.from(bytes,b=>b.toString(16).padStart(2,"0")).join("");
   return hex.slice(0,8)+"-"+hex.slice(8,12)+"-"+hex.slice(12,16)+"-"+hex.slice(16,20)+"-"+hex.slice(20);
  };
  setOutput(Array.from({length:count},makeUuid).join("\n"));
  message("Generated "+count+" UUID(s).");
 });
 bind("copy",()=>copyOutput());
 break;

 case "csvjson":
 bind("csvToJson",()=>{
  const raw=src();
  if(!raw.trim()){message("Paste CSV data first.","error");return;}

  try{
   const rows=parseCSV(raw);
   if(rows.length<2){message("CSV needs a header row and at least one data row.","error");return;}

   const headers=rows[0].map((h,i)=>i===0?h.replace(/^\uFEFF/,"").trim():h.trim());
   if(headers.some(h=>!h)){message("Every CSV column must have a header.","error");return;}
   if(new Set(headers).size!==headers.length){message("Column headers must be unique.","error");return;}

   const data=rows.slice(1).filter(row=>row.some(v=>v!=="")).map((row,index)=>{
    if(row.length!==headers.length){
     throw new Error(`Row ${index+2} has ${row.length} columns; expected ${headers.length}.`);
    }
    const obj={};
    headers.forEach((header,i)=>obj[header]=row[i]);
    return obj;
   });

   setOutput(JSON.stringify(data,null,2));
   message(`Converted ${data.length} CSV row(s) to JSON.`);
  }catch(e){
   message("CSV conversion failed: "+e.message,"error");
  }
 });

 bind("jsonToCsv",()=>{
  const raw=src();
  if(!raw.trim()){message("Paste JSON data first.","error");return;}

  try{
   const data=JSON.parse(raw);
   if(!Array.isArray(data)){message("JSON must be an array of objects.","error");return;}
   if(data.length===0){message("The JSON array is empty.","error");return;}
   if(data.some(item=>item===null||typeof item!=="object"||Array.isArray(item))){
    message("Every array item must be a JSON object.","error");return;
   }

   const headers=[...new Set(data.flatMap(item=>Object.keys(item)))];
   if(headers.length===0){message("The JSON objects have no fields to convert.","error");return;}

   const rows=[
    headers.map(csvCell).join(","),
    ...data.map(item=>headers.map(key=>{
     const value=item[key];
     return csvCell(value!==null&&typeof value==="object"?JSON.stringify(value):value);
    }).join(","))
   ];

   setOutput(rows.join("\r\n"));
   message(`Converted ${data.length} JSON object(s) to CSV.`);
  }catch(e){
   message("JSON conversion failed: "+e.message,"error");
  }
 });

 bind("copy",()=>copyOutput());
 break;

 case "sha256":
 bind("generate",async()=>{
  const text=$("#sourceText").value;
  if(!globalThis.crypto?.subtle||typeof TextEncoder==="undefined"){message("SHA-256 requires a modern browser secure context. Open the HTTPS website and try again.","error");return;}
  try{
   const bytes=new TextEncoder().encode(text);
   const digest=await crypto.subtle.digest("SHA-256",bytes);
   const hash=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,"0")).join("");
   setOutput(hash);
   message("SHA-256 hash generated.");
  }catch(e){message("Could not generate the hash. Please try again.","error");}
 });
 bind("copy",()=>copyOutput());
 break;
 case "password":
 bind("generate",()=>{const n=Math.max(8,Math.min(128,Number($("#length").value)||16));$("#length").value=n;let pool="";if($("#upperOpt").checked)pool+="ABCDEFGHIJKLMNOPQRSTUVWXYZ";if($("#lowerOpt").checked)pool+="abcdefghijklmnopqrstuvwxyz";if($("#numberOpt").checked)pool+="0123456789";if($("#symbolOpt").checked)pool+="!@#$%^&*()-_=+[]{};:,.?";if(!pool){message("Choose at least one character set.","error");return;}const bytes=new Uint32Array(n);crypto.getRandomValues(bytes);setOutput(Array.from(bytes,x=>pool[x%pool.length]).join(""));});
 bind("copy",()=>copyOutput());
 break;

 case "slug":
 const makeSlug=()=>setOutput($("#sourceText").value.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,""));
 bind("generate",makeSlug);
 $("#sourceText").addEventListener("input",makeSlug);
 bind("copy",()=>copyOutput());
 break;

 case "diff":
 const compareText=()=>{const a=$("#leftText").value.split("\n"),b=$("#rightText").value.split("\n"),n=Math.max(a.length,b.length),lines=[];for(let i=0;i<n;i++){if(a[i]===b[i])lines.push("  "+(a[i]??""));else{if(a[i]!==undefined)lines.push("- "+a[i]);if(b[i]!==undefined)lines.push("+ "+b[i]);}}setOutput(lines.join("\n"));};
 bind("compare",compareText); bind("copy",()=>copyOutput());
 $("#leftText").addEventListener("input",compareText);
 $("#rightText").addEventListener("input",compareText);
 break;

 case "markdown":
 const renderMarkdown=()=>{const s=src();let safe=escapeHtml(s);safe=safe.replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h2>$1</h2>").replace(/^# (.*)$/gm,"<h1>$1</h1>").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/\x60([^\x60]+)\x60/g,"<code>$1</code>").replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>').replace(/\n/g,"<br>");$("#markdownPreview").innerHTML=safe;};
 bind("preview",renderMarkdown); bind("copy",()=>copyOutput("markdownPreview"));
 $("#sourceText").addEventListener("input",renderMarkdown);
 renderMarkdown();
 break;

 case "image64":
 $("#imageFile").addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;if(!f.type.startsWith("image/")){message("Please choose an image file.","error");return;}if(f.size>10*1024*1024){message("Please choose an image smaller than 10 MB.","error");e.target.value="";return;}const r=new FileReader();r.onload=()=>{setOutput(String(r.result));$("#imagePreview").innerHTML=`<img class="mb-4 max-h-64 rounded-xl border border-slate-200 object-contain" alt="Selected image preview" src="${r.result}">`;message("Image converted.");};r.onerror=()=>message("Could not read this image.","error");r.readAsDataURL(f);});
 bind("copy",()=>copyOutput());
 break;

 case "qr": {
 const status=$("#qrStatus"),canvas=$("#qrCanvas"),ctx=canvas.getContext("2d"),customPanel=$("#qrCustomPanel");
 const palettes={
  classic:{fg:"#111827",bg:"#ffffff"},ocean:{fg:"#1d4ed8",bg:"#eff6ff"},emerald:{fg:"#047857",bg:"#ecfdf5"},sunset:{fg:"#c2410c",bg:"#fff7ed"},royal:{fg:"#6d28d9",bg:"#f5f3ff"}
 };
 let customMode=false,blendData=null,qr=null,renderToken=0;
 const say=(text,error=false)=>{status.textContent=text;status.classList.toggle("is-error",error);};
 const readImage=file=>new Promise((resolve,reject)=>{
  if(!file)return resolve(null);
  if(!/^image\/(png|jpeg|webp)$/.test(file.type))return reject(new Error("Choose a PNG, JPG or WebP image."));
  if(file.size>5*1024*1024)return reject(new Error("Image must be smaller than 5 MB."));
  const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(new Error("Could not read the image."));reader.readAsDataURL(file);
 });
 const config=()=>({
  width:1200,height:1200,type:"svg",data:$("#qrText").value.trim(),margin:48,
  qrOptions:{errorCorrectionLevel:"H"},
  dotsOptions:{type:customMode?$("#qrDotStyle").value:"square",color:customMode?$("#qrForeground").value:"#111111"},
  backgroundOptions:{color:blendData&&customMode?"rgba(255,255,255,0)":(customMode?$("#qrBackground").value:"#ffffff")},
  cornersSquareOptions:{type:customMode?"extra-rounded":"square",color:customMode?$("#qrForeground").value:"#111111"},
  cornersDotOptions:{type:"square",color:customMode?$("#qrForeground").value:"#111111"}
 });
 const imageFromData=data=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error("Could not prepare the QR artwork."));img.src=data;});
 const drawCanvas=async()=>{
  const token=++renderToken;
  if(!$("#qrText").value.trim()){say("Enter text or a URL first.",true);return false;}
  if(typeof QRCodeStyling!=="function"){say("QR library did not load. Check your connection and reload.",true);return false;}
  try{
   const settings=config();
   if(!qr){qr=new QRCodeStyling(settings);}else{qr.update(settings);}
   const svgBlob=await qr.getRawData("svg");
   const svgUrl=URL.createObjectURL(svgBlob);
   try{
    const qrImg=await imageFromData(svgUrl);
    if(token!==renderToken)return false;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle=customMode?$("#qrBackground").value:"#ffffff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    if(blendData&&customMode){
     const art=await imageFromData(blendData);
     if(token!==renderToken)return false;
     const opacity=Number($("#qrBlendOpacity").value)/100;
     ctx.globalAlpha=opacity;
     const scale=Math.max(canvas.width/art.width,canvas.height/art.height);
     const w=art.width*scale,h=art.height*scale;
     ctx.drawImage(art,(canvas.width-w)/2,(canvas.height-h)/2,w,h);
     ctx.globalAlpha=1;
    }
    ctx.drawImage(qrImg,0,0,canvas.width,canvas.height);
   }finally{URL.revokeObjectURL(svgUrl);}
   say("QR code generated. Scan-test it before use.");
   return true;
  }catch(error){ctx.globalAlpha=1;console.error("ToolNest QR error:",error);say(error.message||"QR generation failed.",true);return false;}
 };
 const setMode=mode=>{
  customMode=mode;customPanel.hidden=!mode;
  $("#qrDefaultMode").className=mode?"btn-secondary":"btn-primary";
  $("#qrCustomMode").className=mode?"btn-primary":"btn-secondary";
  $("#qrDefaultMode").setAttribute("aria-pressed",String(!mode));
  $("#qrCustomMode").setAttribute("aria-pressed",String(mode));
  drawCanvas();
 };
 $("#qrDefaultMode").addEventListener("click",()=>setMode(false));
 $("#qrCustomMode").addEventListener("click",()=>setMode(true));
 $("#generate").addEventListener("click",drawCanvas);
 $("#qrText").addEventListener("input",()=>{if($("#qrText").value.trim())drawCanvas();});
 ["qrForeground","qrBackground","qrDotStyle","qrBlendOpacity"].forEach(id=>$("#"+id).addEventListener("input",()=>{
  if(id==="qrBlendOpacity")$("#qrBlendValue").textContent=$("#qrBlendOpacity").value+"%";
  if(customMode)drawCanvas();
 }));
 document.querySelectorAll("[data-qr-palette]").forEach(button=>button.addEventListener("click",()=>{
  const palette=palettes[button.dataset.qrPalette];if(!palette)return;
  $("#qrForeground").value=palette.fg;$("#qrBackground").value=palette.bg;drawCanvas();
 }));
 $("#qrBlendFile").addEventListener("change",async()=>{
  try{
   blendData=await readImage($("#qrBlendFile").files[0]);
   const box=$("#qrBlendPreview");box.replaceChildren();box.hidden=!blendData;
   if(blendData){const img=document.createElement("img");img.src=blendData;img.alt="Selected QR blend artwork";box.append(img);}
   if(customMode)drawCanvas();else say("Image selected. Switch to Custom Mode to blend it into your QR.");
  }catch(error){$("#qrBlendFile").value="";blendData=null;say(error.message,true);}
 });
 const download=async extension=>{
  if(!$("#qrText").value.trim()){say("Enter text or a URL before downloading.",true);return;}
  const ready=await drawCanvas();if(!ready)return;
  try{
   if(extension==="png"){
    const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error("PNG export failed.")),"image/png"));
    const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="toolnest-qr.png";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
   }else{
    qr.update(config());
    await qr.download({name:"toolnest-qr",extension:"svg"});
   }
   say(extension.toUpperCase()+" download started.");
  }catch(error){say(error.message||"Download failed.",true);}
 };
 $("#qrDownloadPng").addEventListener("click",()=>download("png"));
 $("#qrDownloadSvg").addEventListener("click",()=>download("svg"));
 $("#qrClear").addEventListener("click",()=>{
  $("#qrText").value="";$("#qrBlendFile").value="";blendData=null;customMode=false;
  $("#qrForeground").value="#111827";$("#qrBackground").value="#ffffff";$("#qrDotStyle").value="square";$("#qrBlendOpacity").value="50";$("#qrBlendValue").textContent="50%";
  $("#qrBlendPreview").replaceChildren();$("#qrBlendPreview").hidden=true;
  ctx.clearRect(0,0,canvas.width,canvas.height);setMode(false);say("QR Studio cleared.");
 });
 say("Enter text or a URL, then select Generate QR.");
 break;
 }

 case "meta":
 bind("generate",()=>{const title=$("#pageTitle").value.trim(),desc=$("#pageDescription").value.trim(),url=$("#pageUrl").value.trim();if(!title||!desc){message("Enter both a title and description.","error");return;}let canonical="";if(url){try{const parsed=new URL(url);if(!["http:","https:"].includes(parsed.protocol)||!parsed.hostname)throw new Error("invalid URL");canonical=parsed.href;}catch{message("Enter a valid HTTP or HTTPS canonical URL.","error");return;}}const safe=s=>s.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");setOutput(`<title>${safe(title)}</title>\n<meta name="description" content="${safe(desc)}">`+(canonical?`\n<link rel="canonical" href="${safe(canonical)}">`:""));});
 bind("copy",()=>copyOutput());
 break;

 case "color":
 const sync=()=>{const v=$("#colorPicker").value;$("#hex").value=v;};
 $("#colorPicker").addEventListener("input",sync);
 bind("convert",()=>{let h=$("#hex").value.trim();if(!/^#?(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(h)){message("Enter a valid 3- or 6-digit HEX color.","error");return;}h=h.replace("#","");if(h.length===3)h=h.split("").map(x=>x+x).join("");const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);const R=r/255,G=g/255,B=b/255,max=Math.max(R,G,B),min=Math.min(R,G,B),d=max-min;let hue=0,sat=0,l=(max+min)/2;if(d){sat=d/(1-Math.abs(2*l-1));switch(max){case R:hue=((G-B)/d)%6;break;case G:hue=(B-R)/d+2;break;default:hue=(R-G)/d+4;}hue*=60;if(hue<0)hue+=360;}const result=`HEX: #${h.toUpperCase()}\nRGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${Math.round(hue)}, ${Math.round(sat*100)}%, ${Math.round(l*100)}%)`;setOutput(result);$("#colorSwatch").style.background="#"+h;$("#colorPicker").value="#"+h;});
 bind("copy",()=>copyOutput());
 break;

 case "forexcalc":
 $("#forexTo").value="BDT";
 bind("copy",()=>copyOutput()); bind("swapCurrencies",()=>{
  const from=$("#forexFrom"),to=$("#forexTo");
  const previous=from.value;
  from.value=to.value;
  to.value=previous;
 });
 bind("convertCurrency",async()=>{
  const raw=$("#forexAmount").value.trim();
  const amount=Number(raw),from=$("#forexFrom").value,to=$("#forexTo").value;
  if(raw===""||!Number.isFinite(amount)||amount<0){message("Enter a valid amount (zero or greater).","error");return;}
  if(from===to){setOutput(`${amount} ${from} = ${amount} ${to}\nExchange rate: 1 ${from} = 1 ${to}`);message("Conversion complete.");return;}
  const button=$("#convertCurrency");
  button.disabled=true;
  button.textContent="Getting rate…";
  try{
   const response=await fetch(`https://open.er-api.com/v6/latest/${encodeURIComponent(from)}`);
   if(!response.ok)throw new Error("Rate service returned HTTP "+response.status);
   const data=await response.json();
   const rate=data?.rates?.[to];
   if(data?.result!=="success"||!Number.isFinite(rate))throw new Error("This currency pair is not available right now.");
   const converted=amount*rate;
   const fmt=n=>new Intl.NumberFormat("en-US",{maximumFractionDigits:6}).format(n);
   const updated=data.time_last_update_utc||"date not provided";
   setOutput(`${fmt(amount)} ${from} = ${fmt(converted)} ${to}\nExchange rate: 1 ${from} = ${fmt(rate)} ${to}\nRate last updated: ${updated}`);
   message("Currency converted using the available reference rate.");
  }catch(e){message("Could not load the exchange rate. Check your internet connection and try again.","error");}
  finally{button.disabled=false;button.textContent="Convert currency";}
 });
 break;
 case "unit":
 const units={length:[["m","Meters",1],["km","Kilometers",1000],["cm","Centimeters",.01],["mm","Millimeters",.001],["mi","Miles",1609.344],["ft","Feet",.3048],["in","Inches",.0254]],weight:[["kg","Kilograms",1],["g","Grams",.001],["mg","Milligrams",.000001],["lb","Pounds",.45359237],["oz","Ounces",.028349523125]],temperature:[["C","Celsius"],["F","Fahrenheit"],["K","Kelvin"]]};
 const convertUnit=()=>{
  const raw=$("#unitValue").value.trim();
  if(raw===""){setOutput("");return;}
  const type=$("#unitType").value,v=Number(raw),from=$("#unitFrom").value,to=$("#unitTo").value;
  if(!Number.isFinite(v)){message("Enter a valid number.","error");return;}
  let result;
  if(type==="temperature"){
   const c=from==="C"?v:from==="F"?(v-32)*5/9:v-273.15;
   if(c < -273.15){message("Temperature cannot be below absolute zero (-273.15 °C).","error");return;}result=to==="C"?c:to==="F"?c*9/5+32:c+273.15;
  }else{
   const us=units[type],a=us.find(x=>x[0]===from),b=us.find(x=>x[0]===to);
   result=v*a[2]/b[2];
  }
  setOutput(`${v} ${from} = ${Number(result.toPrecision(10))} ${to}`);
 };
 const fill=()=>{
  const type=$("#unitType").value,opts=units[type];
  $("#unitFrom").innerHTML=opts.map(u=>`<option value="${u[0]}">${u[1]}</option>`).join("");
  $("#unitTo").innerHTML=opts.map(u=>`<option value="${u[0]}">${u[1]}</option>`).join("");
  if(opts.length>1)$("#unitTo").selectedIndex=1;
  convertUnit();
 };
 $("#unitType").addEventListener("change",fill);
 $("#unitValue").addEventListener("input",convertUnit);
 $("#unitFrom").addEventListener("change",convertUnit);
 $("#unitTo").addEventListener("change",convertUnit);
 fill();
 bind("convert",convertUnit); bind("copy",()=>copyOutput());
 break;

 case "age":
 const today=new Date();
 $("#dateA").max=today.toISOString().slice(0,10);
 $("#dateB").value=today.toISOString().slice(0,10);
 bind("copy",()=>copyOutput()); bind("calculate",()=>{const a=$("#dateA").value,b=$("#dateB").value||today.toISOString().slice(0,10);if(!a){message("Choose a start date.","error");return;}const da=new Date(a+"T00:00:00Z"),db=new Date(b+"T00:00:00Z");if(Number.isNaN(+da)||Number.isNaN(+db)){message("Enter valid dates.","error");return;}if(da>new Date(today.toISOString().slice(0,10)+"T00:00:00Z")){message("Start date cannot be in the future.","error");return;}if(db<da){message("End date must be on or after the start date.","error");return;}const days=Math.round((db-da)/86400000);let years=db.getUTCFullYear()-da.getUTCFullYear(),months=db.getUTCMonth()-da.getUTCMonth(),d=db.getUTCDate()-da.getUTCDate();if(d<0){months--;d+=new Date(Date.UTC(db.getUTCFullYear(),db.getUTCMonth(),0)).getUTCDate();}if(months<0){years--;months+=12;}setOutput(`Difference: ${years} years, ${months} months, ${d} days\nTotal days: ${days.toLocaleString()}`);});
 break;
 }
}
