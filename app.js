
let qrLibraryPromise = null;
function loadQrLibrary(){
 if(typeof QRCodeStyling==="function")return Promise.resolve();
 if(qrLibraryPromise)return qrLibraryPromise;
 qrLibraryPromise=new Promise((resolve,reject)=>{
  const script=document.createElement("script");
  script.src="https://unpkg.com/qr-code-styling@1.9.2/lib/qr-code-styling.js";
  script.async=true;
  script.onload=()=>{
   if(typeof QRCodeStyling==="function")resolve();
   else{qrLibraryPromise=null;reject(new Error("QR library did not initialize. Check your connection and reload."));}
  };
  script.onerror=()=>{qrLibraryPromise=null;reject(new Error("QR library could not be downloaded. Check your connection and try again."));};
  document.head.appendChild(script);
 });
 return qrLibraryPromise;
}

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
{id:"imagecrop",name:"Image Cropper",category:"Image",icon:"✂",description:"Crop a local image using precise pixel coordinates."},
{id:"imageformat",name:"Image Format Converter",category:"Image",icon:"⇄",description:"Convert PNG, JPEG and WebP images in your browser."},
{id:"base64image",name:"Base64 to Image",category:"Image",icon:"▧",description:"Preview and download an image from Base64 data."},
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
{id:"loremipsum",name:"Lorem Ipsum Generator",category:"Text",icon:"¶",description:"Generate placeholder Lorem Ipsum text with adjustable paragraphs and sentences."},
{id:"area",name:"Area Converter",category:"Calculators",icon:"▱",description:"Convert square metres, square feet, acres, hectares and other area units."},
{id:"land",name:"Bangladesh Land Unit Converter",category:"Calculators",icon:"৳",description:"Convert common Bangladesh land units including shotok, katha, bigha, acre and square feet."},
{id:"timezone",name:"Time Zone Converter",category:"Utilities",icon:"◷",description:"Convert a date and time between UTC and popular international time zones."},
{id:"numberwords",name:"Number to Words Converter",category:"Utilities",icon:"১",description:"Convert numbers into words in English or Bangla."},
{id:"robots",name:"Robots.txt Generator",category:"Developer",icon:"🤖",description:"Create a robots.txt file with crawler rules and a sitemap location."},
{id:"sitemap",name:"XML Sitemap Generator",category:"Developer",icon:"🗺",description:"Build an XML sitemap from a list of website URLs."},
{id:"gradient",name:"CSS Gradient Generator",category:"Developer",icon:"🎨",description:"Create reusable linear and radial CSS gradient backgrounds."},
{id:"pdfmerge",name:"Advanced PDF Merger",category:"Utilities",icon:"📄",description:"Combine PDFs, select and reorder pages, rotate pages and download a custom merged PDF."},
{id:"pdfsplitter",name:"PDF Splitter",category:"Utilities",icon:"✂️",description:"Split a PDF into separate page files, select page ranges and download multiple pages as a ZIP archive."},
{id:"imagepdf",name:"Image to PDF",category:"Utilities",icon:"🖼️",description:"Convert multiple JPG, JPEG and PNG images into one PDF with page settings."},
{id:"pdftoimage",name:"PDF to JPG / PNG",category:"Utilities",icon:"🖼️",description:"Convert selected PDF pages into high-quality JPG or PNG images."},
{id:"pdftext",name:"PDF Text Extractor",category:"Utilities",icon:"📝",description:"Extract selectable text from PDF pages and save it as a text file."},
{id:"pdfmark",name:"PDF Watermark & Page Number",category:"Utilities",icon:"🔖",description:"Add a custom text watermark, logo and page numbers to PDF documents."},
{id:"iptools",name:"IP Address Finder & Lookup",category:"Utilities",icon:"◎",description:"Find your public IP or look up public IP geolocation and network details."},
{id:"urlshortener",name:"URL Shortener",category:"Utilities",icon:"🔗",description:"Turn long website addresses into short, shareable links with an optional custom alias."},
{id:"zipmanager",name:"ZIP File Manager",category:"Utilities",icon:"▤",description:"Create ZIP archives from files or inspect and extract selected files in your browser."},
{id:"favicongenerator",name:"Favicon Generator",category:"Image",icon:"◈",description:"Create common website favicon sizes, an ICO file and HTML icon tags from an image."},
{id:"pdforganizer",name:"PDF Page Organizer",category:"Utilities",icon:"▤",description:"Reorder PDF pages and rotate pages locally in your browser."},
{id:"textsorter",name:"Text Sorter",category:"Text",icon:"↕",description:"Sort lines alphabetically or numerically while controlling blank lines and letter case."},
{id:"findreplace",name:"Find & Replace",category:"Text",icon:"⌕",description:"Find text and replace one or all matches with optional case and whole-word matching."},
{id:"jwtdecoder",name:"JWT Decoder",category:"Developer",icon:"🔐",description:"Decode JWT header and payload locally without sending tokens to a server."},
{id:"xmlformatter",name:"XML Formatter",category:"Developer",icon:"⌘",description:"Validate and format XML into readable, indented markup in your browser."}
];

// Curated general-demand order (not first-party usage analytics).
const popularityOrder=["qr","pdfmerge","pdfsplitter","pdftoimage","pdftext","pdfmark","imagepdf","imagecompress","imageresize","counter","json","password","imagecrop","imageformat","base64","urlshortener","url","unit","percentage","age","color","case","slug","markdown","csvjson","uuid","image64","base64image","forexcalc","emi","compound","timezone","iptools","diff","meta","sha256","duplines","whitespace","timestamp","htmlentities","loremipsum","area","land","numberwords","robots","sitemap","gradient"];
const popularityTierById=Object.fromEntries(popularityOrder.map((id,index)=>[id,index<7?"Hot":index<17?"High":index<30?"Medium":"Normal"]));
tools.sort((a,b)=>popularityOrder.indexOf(a.id)-popularityOrder.indexOf(b.id));
function getPopularityTier(id){return popularityTierById[id]||"Normal";}

const $ = (s,root=document)=>root.querySelector(s);
let cardTools = tools;
const grid=$("#toolGrid"), panel=$("#toolPanel"), workspace=$("#workspace");
const featuredGrid=$("#featuredToolGrid");
const featuredToolIds=["qr","pdfmerge","pdfsplitter","imagecompress","imageresize","counter","json"];
let activeCategory="All", activeTool=null;
$("#year").textContent=new Date().getFullYear();

const cardTaglines={
 pdfmerge:"Merge PDFs and control every page",
 pdfsplitter:"Extract pages into separate PDF files",
 pdftoimage:"Turn PDF pages into image files",
 pdftext:"Extract selectable PDF text to TXT",
 pdfmark:"Add watermarks and page numbers to PDFs",
 imagepdf:"Turn pictures into a single PDF",
 urlshortener:"Turn long URLs into easy-to-share short links",
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

function renderFeaturedCards(){
 if(!featuredGrid)return;
 const featured=featuredToolIds.map(id=>cardTools.find(t=>t.id===id)).filter(Boolean);
 featuredGrid.innerHTML=featured.map(t=>'<button class="featured-tool-card" type="button" data-tool="' + escapeHtml(t.id) + '" aria-label="Open ' + escapeHtml(t.name) + '"><span class="popularity-badge popularity-' + getPopularityTier(t.id).toLowerCase() + '">' + getPopularityTier(t.id) + '</span><span class="featured-tool-icon" aria-hidden="true">' + escapeHtml(t.icon) + '</span><span class="featured-tool-copy"><strong>' + escapeHtml(t.name) + '</strong><small>' + escapeHtml(t.description) + '</small></span><span class="featured-tool-arrow" aria-hidden="true">→</span></button>').join("");
}

function renderCards(){
 const q=$("#toolSearch").value.trim().toLowerCase();
 const filtered=cardTools.filter(t=>(activeCategory==="All"||t.category===activeCategory)&&`${t.name} ${t.description} ${t.category}`.toLowerCase().includes(q));
 grid.innerHTML=filtered.map(t=>`<button class="tool-card" type="button" data-tool="${t.id}" aria-label="Open ${escapeHtml(t.name)}"><span class="popularity-badge popularity-${getPopularityTier(t.id).toLowerCase()}">${getPopularityTier(t.id)}</span><span class="iconbox" aria-hidden="true">${escapeHtml(t.icon)}</span><span class="category mt-3">${escapeHtml(t.category==="Image"?"Images":t.category==="Developer"?"Dev Tools":t.category)}</span><h3>${escapeHtml(t.name)}</h3><p>${escapeHtml(t.description)}</p><span class="card-tagline">${escapeHtml(t.tagline||cardTaglines[t.id]||"Simple tools for everyday tasks")}</span><span class="launch">Open tool <span aria-hidden="true">→</span></span></button>`).join("");
 $("#resultsCount").textContent=`Showing ${filtered.length} of ${cardTools.length} tools`;
 $("#noResults").classList.toggle("hidden",filtered.length!==0);
}

function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

$("#categoryFilters").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;activeCategory=b.dataset.category;document.querySelectorAll(".filter-chip").forEach(x=>{const selected=x===b;x.classList.toggle("active",selected);x.setAttribute("aria-pressed",String(selected));});renderCards();});
$("#toolSearch").addEventListener("input",renderCards);
grid.addEventListener("click",e=>{const b=e.target.closest("[data-tool]");if(b)openTool(b.dataset.tool);});
featuredGrid?.addEventListener("click",e=>{const b=e.target.closest("[data-tool]");if(b)openTool(b.dataset.tool);});

renderFeaturedCards();

function closeTool(updateHistory=true){
 window.__toolNestCurrentZip=null;
 workspace.classList.add("hidden");
 document.body.classList.remove("tool-open");
 document.body.style.removeProperty("overflow");
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

document.addEventListener("keydown",e=>{
 if(e.key==="Escape"&&document.body.classList.contains("tool-open")){
  e.preventDefault();
  closeTool();
  return;
 }
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){
  e.preventDefault();
  $("#toolSearch").focus();
 }
});

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
 window.__toolNestCurrentZip=null;
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
  if(id==="zipmanager"||id==="favicongenerator"){message("Use the tool-specific controls to create or download your files.");return;}
  if(id==="pdfmerge"){message("PDF files are documents; use the Download Merged PDF button after merging.");return;}
  if(id==="pdfsplitter"){message("Select pages and split them before downloading PDF files.");return;}
  if(id==="pdftoimage"){message("Convert selected PDF pages, then use Download Images / ZIP.");return;}
  if(id==="pdftext"){window.ToolNestPdfText?.copy();return;}
  if(id==="pdfmark"){message("Apply your watermark or page numbers before downloading.");return;}
  if(id==="imagepdf"){message("Image to PDF creates a document; use Download PDF after creating it.");return;}
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
  if(id==="zipmanager"){const selected=$("#zipFiles")?.files?.length;const checked=$("#zipEntryList")?.querySelectorAll("input:checked").length;if(selected)$("#zipCreate")?.click();else if(checked)$("#zipDownloadSelected")?.click();else message("Choose source files or inspect a ZIP archive first.");return;}
  if(id==="favicongenerator"){ $("#faviconGenerate")?.click(); return; }
  if(id==="pdfmerge"){ $("#pdfMergeDownload")?.click(); return; }
  if(id==="pdfsplitter"){ $("#pdfSplitDownload")?.click(); return; }
  if(id==="pdftoimage"){window.ToolNestPdfToImage?.download();return;}
  if(id==="pdftext"){window.ToolNestPdfText?.download();return;}
  if(id==="pdfmark"){window.ToolNestPdfMark?.download();return;}
  if(id==="imagepdf"){ $("#imagePdfDownload")?.click(); return; }
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
  const downloadType=id==="sitemap"?"application/xml;charset=utf-8":"text/plain;charset=utf-8";
  const blob=new Blob([text],{type:downloadType});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download=id==="robots"?"robots.txt":id==="sitemap"?"sitemap.xml":"toolnest-"+id+"-result.txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  message("Result downloaded as a text file.");
 });
 bind("universalClear",()=>{
  if(id==="zipmanager"){ $("#zipClear")?.click(); return; }
  if(id==="favicongenerator"){ $("#faviconClear")?.click(); return; }
  // QR Studio keeps artwork and render state in local variables; use its own reset handler.
  if(id==="pdfmerge"){ $("#pdfMergeClear")?.click(); return; }
  if(id==="pdfsplitter"){ $("#pdfSplitClear")?.click(); return; }
  if(id==="pdftoimage"){window.ToolNestPdfToImage?.clear();return;}
  if(id==="pdftext"){window.ToolNestPdfText?.clear();return;}
  if(id==="pdfmark"){window.ToolNestPdfMark?.clear();return;}
  if(id==="imagepdf"){ $("#imagePdfClear")?.click(); return; }
  if(id==="urlshortener"){ window.ToolNestUrlShortener?.clear(); message("Tool cleared."); return; }
  if(id==="qr"){ $("#qrClear")?.click(); return; }
  if(id==="imageresize"||id==="imagecompress"){ $("#clearImage")?.click(); return; }
  if(id==="imagecrop"){ $("#clearCrop")?.click(); return; }
  if(id==="imageformat"){ $("#clearFormat")?.click(); return; }
  if(id==="base64image"){ $("#clearBase64Image")?.click(); return; }
  panel.querySelectorAll("input,textarea").forEach(el=>{
   if(el.type==="checkbox"||el.type==="radio")el.checked=el.defaultChecked;
   else if(el.type==="file")el.value="";
   else if(el.type!=="button"&&el.type!=="submit")el.value="";
  });
  panel.querySelectorAll("select").forEach(el=>{el.selectedIndex=0;});
  if(id==="percentage")$("#percentageMode")?.dispatchEvent(new Event("change"));
  if(id==="gradient"&&$("#gradientPreview"))$("#gradientPreview").style.background="";
  panel.querySelectorAll(".output").forEach(el=>{if(el.dataset.downloadUrl)URL.revokeObjectURL(el.dataset.downloadUrl);delete el.dataset.downloadUrl;delete el.dataset.downloadName;el.textContent="";});
  if(id==="iptools"){const results=$("#ipLookupResults");if(results){results.replaceChildren();results.hidden=true;}const status=$("#ipLookupStatus");if(status){status.textContent="Ready. Enter a public IP address or choose Find My IP.";status.className="ip-lookup-status muted";}}
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
 case "zipmanager":return form(`
<div class="zip-manager">
 <div class="zip-manager-intro"><span class="eyebrow">TOOLNEST FILE UTILITIES</span><h3>ZIP File Manager</h3><p>Create a ZIP archive from local files or inspect and extract selected files from an existing ZIP. Processing stays in this browser.</p></div>
 <section class="zip-panel"><h4>Create a ZIP archive</h4><label class="field-label" for="zipFiles">Choose files</label><input class="field" id="zipFiles" type="file" multiple><p class="zip-note">Up to 100 files · 25 MB per file · 50 MB total source size · 50 MB generated archive.</p><button class="btn-primary" id="zipCreate" type="button">Create ZIP</button></section>
 <section class="zip-panel"><h4>Extract a ZIP archive</h4><label class="field-label" for="zipArchive">Choose ZIP file</label><input class="field" id="zipArchive" type="file" accept=".zip,application/zip,application/x-zip-compressed"><p class="zip-note">Maximum archive size 50 MB · up to 1,000 entries · 25 MB per extracted file · 50 MB expanded total.</p><button class="btn-primary" id="zipExtract" type="button" disabled>Inspect ZIP contents</button><div id="zipEntryList" class="zip-entry-list" hidden></div><button class="btn-secondary" id="zipDownloadSelected" type="button" disabled>Download selected files as ZIP</button></section>
 <div class="actions"><button class="btn-secondary" id="zipClear" type="button">Clear</button></div>
 <p id="zipStatus" class="zip-status" role="status" aria-live="polite">Ready. Choose files to create a ZIP or select an archive to extract.</p>
 <p class="zip-note"><strong>Privacy:</strong> Files are processed locally in your browser. ZIP support is loaded from a public CDN when needed. Password-protected ZIP archives are not supported.</p>
</div>`);
 case "favicongenerator":return form(`
<div class="favicon-tool">
 <div class="favicon-intro"><span class="eyebrow">TOOLNEST IMAGE UTILITIES</span><h3>Favicon Generator</h3><p>Turn a PNG, JPEG or WebP image into common website icon sizes, an ICO file and ready-to-copy HTML tags.</p></div>
 <div class="field-group"><label class="field-label" for="faviconFile">Choose source image</label><input class="field" id="faviconFile" type="file" accept="image/png,image/jpeg,image/webp"><p class="zip-note">Maximum 10 MB and 4,096 pixels per side. Square images are recommended.</p></div>
 <div class="favicon-controls"><div class="field-group"><label class="field-label" for="faviconBg">Background color</label><input class="field" id="faviconBg" type="color" value="#ffffff"></div><div class="field-group"><label class="field-label" for="faviconPadding">Image padding</label><input class="field" id="faviconPadding" type="range" min="0" max="30" value="8"><output id="faviconPaddingValue">8%</output></div></div>
 <div class="field-group"><label class="field-label">Preview</label><div id="faviconPreview" class="favicon-preview"><span class="muted text-sm">Your preview will appear here.</span></div></div>
 <div class="actions"><button class="btn-primary" id="faviconGenerate" type="button">Generate & Download Icon Pack</button><button class="btn-secondary" id="faviconClear" type="button">Clear</button></div>
 <p id="faviconStatus" class="favicon-status" role="status" aria-live="polite">Ready. Choose a PNG, JPEG or WebP image.</p>
 <p class="favicon-note"><strong>Included:</strong> 16, 32, 48, 180, 192 and 512 pixel PNG icons, a 48×48 ICO file and an HTML snippet. ICO embeds PNG data; very old systems may not support it. Files are generated locally using Canvas and JSZip.</p>
</div>`);
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

 case "urlshortener":return form(`
<div class="url-shortener-tool">
 <div class="url-shortener-intro"><span class="url-shortener-kicker">FREE LINK TOOL</span><h3>Shorten a long URL</h3><p>Create a shareable short link using a free external service. ToolNest does not host the redirect.</p></div>
 <div class="url-shortener-fields">${input("shortUrlInput","Long website URL","https://example.com/your/very/long/link","url")}${input("shortUrlAlias","Custom alias (optional)","myLink")}</div>
 <div class="actions">${btn("shortenUrl","Shorten URL")}${btn("copy","Copy short link",false)}</div>
 ${out()}
 <div id="shortUrlResultLink" class="url-shortener-result-link" hidden></div>
 <p id="shortUrlStatus" class="url-shortener-status" role="status" aria-live="polite">Ready. Paste a complete website URL to create a short link.</p>
 <p class="url-shortener-note"><strong>Privacy:</strong> The destination URL is sent directly to Spoo.me to create the redirect. ToolNest does not store it. Anonymous use is currently limited by the provider (published anonymous limit: 20 requests per minute and 1,000 per day); availability and terms may change. Only shorten links you trust.</p>
</div>`);
 case "imagepdf":return form(`
<div class="image-pdf-tool">
 <div class="image-pdf-intro"><span class="image-pdf-kicker">TOOLNEST DOCUMENT STUDIO</span><h3>Image to PDF</h3><p>Combine PNG and JPEG images into one PDF. Arrange the page order, choose paper size, orientation and margins, then preview and download. Images are processed locally in your browser.</p></div>
 <div class="image-pdf-drop" id="imagePdfDrop"><label class="field-label" for="imagePdfFiles">Choose images (PNG, JPG or JPEG)</label><input class="field" id="imagePdfFiles" type="file" accept="image/png,image/jpeg,.png,.jpg,.jpeg" multiple><p class="muted text-sm">You can also drag images here. Up to 20 images · 15 MB each · 60 MB total. PNG and JPEG only.</p></div>
 <div class="image-pdf-summary" id="imagePdfSummary" role="status" aria-live="polite">No images selected.</div>
 <div class="image-pdf-settings">
  <div class="image-pdf-setting"><label for="imagePdfPageSize">Page size</label><select class="field" id="imagePdfPageSize"><option value="a4">A4</option><option value="letter">US Letter</option><option value="legal">US Legal</option></select></div>
  <div class="image-pdf-setting"><label for="imagePdfOrientation">Orientation</label><select class="field" id="imagePdfOrientation"><option value="auto">Automatic (match image)</option><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></div>
  <div class="image-pdf-setting"><label for="imagePdfMargin">Page margin</label><select class="field" id="imagePdfMargin"><option value="0">No margin</option><option value="10" selected>10 mm</option><option value="20">20 mm</option></select></div>
 </div>
 <div class="image-pdf-list" id="imagePdfList"><div class="image-pdf-empty">Your selected images and page order will appear here.</div></div>
 <div class="image-pdf-actions actions"><button type="button" class="btn-primary" id="imagePdfCreate" disabled>Create PDF</button><button type="button" class="btn-secondary" id="imagePdfDownload" disabled>Download PDF</button><button type="button" class="btn-secondary" id="imagePdfClear">Clear All</button></div>
 <p class="image-pdf-status" id="imagePdfStatus" role="status" aria-live="polite">Ready. Add PNG or JPEG images to begin.</p>
 <div class="image-pdf-preview-wrap"><strong>PDF Preview</strong><iframe id="imagePdfPreview" title="Generated PDF preview" hidden></iframe></div>
 <div class="image-pdf-privacy"><strong>Privacy:</strong> Images are processed locally in this browser and are not uploaded to ToolNest. The PDF library loads from a public CDN when needed. Each image is limited to 40 megapixels and each job to 100 megapixels total; very large jobs may be limited by device memory.</div>
</div>`);
 case "pdftoimage":return form("<div class=\"pdf-phase-tool\"><div class=\"pdf-phase-intro\"><span class=\"pdf-phase-kicker\">TOOLNEST PDF IMAGE STUDIO</span><h3>PDF to JPG / PNG</h3><p>Preview PDF pages, choose exactly which pages to export, set image format and resolution, then download one image or a ZIP. Files stay in your browser.</p></div><div class=\"pdf-phase-upload\"><label class=\"field-label\" for=\"pdfImageFiles\">Choose one PDF file</label><input class=\"field\" id=\"pdfImageFiles\" type=\"file\" accept=\"application/pdf,.pdf\"><p class=\"muted text-sm\">Maximum 30 MB · 120 pages · 40 exported pages per job.</p></div><p class=\"pdf-phase-summary\" id=\"pdfImageSummary\">No PDF selected.</p><div class=\"pdf-phase-grid\"><div class=\"pdf-phase-field\"><label for=\"pdfImageFormat\">Image format</label><select class=\"field\" id=\"pdfImageFormat\"><option value=\"png\">PNG (lossless)</option><option value=\"jpg\">JPG (smaller files)</option></select></div><div class=\"pdf-phase-field\"><label for=\"pdfImageScale\">Resolution</label><select class=\"field\" id=\"pdfImageScale\"><option value=\"1\">Standard (1×)</option><option value=\"1.5\" selected>High (1.5×)</option><option value=\"2\">Very high (2×)</option></select></div><div class=\"pdf-phase-field\"><label for=\"pdfImageQuality\">JPG quality <output id=\"pdfImageQualityValue\">88%</output></label><input class=\"field\" id=\"pdfImageQuality\" type=\"range\" min=\"55\" max=\"100\" value=\"88\"></div></div><div class=\"pdf-phase-range\"><label for=\"pdfImageRange\">Select page range (optional)</label><input class=\"field\" id=\"pdfImageRange\" placeholder=\"Example: 1-3,5\"><button class=\"btn-secondary\" type=\"button\" id=\"pdfImageApplyRange\" disabled>Apply</button><button class=\"btn-secondary\" type=\"button\" id=\"pdfImageSelectAll\" disabled>All</button><button class=\"btn-secondary\" type=\"button\" id=\"pdfImageSelectNone\" disabled>None</button></div><div class=\"pdf-phase-pages\" id=\"pdfImagePages\"><p class=\"pdf-phase-empty\">Upload a PDF to see page previews.</p></div><div class=\"pdf-phase-actions actions\"><button class=\"btn-primary\" type=\"button\" id=\"pdfImageRun\" disabled>Convert Selected Pages</button><button class=\"btn-secondary\" type=\"button\" id=\"pdfImageDownload\" disabled>Download Images / ZIP</button><button class=\"btn-secondary\" type=\"button\" id=\"pdfImageClear\">Clear</button></div><p class=\"pdf-phase-status\" id=\"pdfImageStatus\" role=\"status\" aria-live=\"polite\">Ready. Add a PDF to begin.</p><p class=\"pdf-phase-privacy\"><strong>Privacy:</strong> PDF pages are rendered locally using PDF.js. The PDF is not uploaded to ToolNest. PDF.js and ZIP support load from public CDNs when needed.</p></div>");
 case "pdftext":return form("<div class=\"pdf-phase-tool\"><div class=\"pdf-phase-intro\"><span class=\"pdf-phase-kicker\">TOOLNEST PDF TEXT STUDIO</span><h3>PDF Text Extractor</h3><p>Extract selectable text from every page or a custom page range. Copy the result or download a TXT file. Scanned-image OCR is not included.</p></div><div class=\"pdf-phase-upload\"><label class=\"field-label\" for=\"pdfTextFiles\">Choose a PDF file</label><input class=\"field\" id=\"pdfTextFiles\" type=\"file\" accept=\"application/pdf,.pdf\"><p class=\"muted text-sm\">Maximum 25 MB · 200 pages. Text-based PDFs only; image-only scans require OCR.</p></div><div class=\"pdf-phase-field\"><label for=\"pdfTextRange\">Page range (optional)</label><input class=\"field\" id=\"pdfTextRange\" placeholder=\"Example: 1-5,8\"></div><div class=\"pdf-phase-actions actions\"><button class=\"btn-primary\" type=\"button\" id=\"pdfTextRun\" disabled>Extract Text</button><button class=\"btn-secondary\" type=\"button\" id=\"pdfTextCopy\">Copy Text</button><button class=\"btn-secondary\" type=\"button\" id=\"pdfTextDownload\">Download TXT</button><button class=\"btn-secondary\" type=\"button\" id=\"pdfTextClear\">Clear</button></div><p class=\"pdf-phase-status\" id=\"pdfTextStatus\" role=\"status\" aria-live=\"polite\">Ready. Add a text-based PDF to begin.</p><label class=\"field-label\" for=\"pdfTextResult\">Extracted text</label><textarea class=\"field pdf-phase-result\" id=\"pdfTextResult\" rows=\"14\" placeholder=\"Extracted text will appear here…\" spellcheck=\"false\"></textarea><p class=\"pdf-phase-privacy\"><strong>Privacy:</strong> PDF text is extracted locally using PDF.js. Your document is not uploaded. Scanned PDFs with no text layer are not OCR-processed.</p></div>");
 case "pdfmark":return form("<div class=\"pdf-phase-tool\"><div class=\"pdf-phase-intro\"><span class=\"pdf-phase-kicker\">TOOLNEST PDF DOCUMENT STUDIO</span><h3>PDF Watermark &amp; Page Number</h3><p>Add a readable text watermark, optional logo and page numbers. Choose the pages and style, preview the updated PDF, then download.</p></div><div class=\"pdf-phase-upload\"><label class=\"field-label\" for=\"pdfMarkFiles\">Choose a PDF file</label><input class=\"field\" id=\"pdfMarkFiles\" type=\"file\" accept=\"application/pdf,.pdf\"><p class=\"muted text-sm\">Maximum 30 MB · 150 pages. Password-protected PDFs are not supported.</p></div><div class=\"pdf-phase-grid\"><div class=\"pdf-phase-field\"><label for=\"pdfMarkText\">Watermark text</label><input class=\"field\" id=\"pdfMarkText\" maxlength=\"100\" placeholder=\"CONFIDENTIAL\"></div><div class=\"pdf-phase-field\"><label for=\"pdfMarkColor\">Text color</label><input class=\"field\" id=\"pdfMarkColor\" type=\"color\" value=\"#64748b\"></div><div class=\"pdf-phase-field\"><label for=\"pdfMarkOpacity\">Opacity <output id=\"pdfMarkOpacityValue\">22%</output></label><input class=\"field\" id=\"pdfMarkOpacity\" type=\"range\" min=\"5\" max=\"70\" value=\"22\"></div><div class=\"pdf-phase-field\"><label for=\"pdfMarkSize\">Text size <output id=\"pdfMarkSizeValue\">42 px</output></label><input class=\"field\" id=\"pdfMarkSize\" type=\"range\" min=\"14\" max=\"90\" value=\"42\"></div><div class=\"pdf-phase-field\"><label for=\"pdfMarkStyle\">Watermark style</label><select class=\"field\" id=\"pdfMarkStyle\"><option value=\"diagonal\">Diagonal</option><option value=\"center\">Centered</option></select></div><div class=\"pdf-phase-field\"><label for=\"pdfMarkRange\">Pages (optional)</label><input class=\"field\" id=\"pdfMarkRange\" placeholder=\"All pages or 1-3,5\"></div></div><div class=\"pdf-phase-settings\"><div class=\"pdf-phase-checks\"><label><input type=\"checkbox\" id=\"pdfMarkNumbers\"> Add page numbers</label></div><div class=\"pdf-phase-grid\"><div class=\"pdf-phase-field\"><label for=\"pdfMarkStart\">Starting number</label><input class=\"field\" id=\"pdfMarkStart\" type=\"number\" min=\"1\" max=\"99999\" value=\"1\"></div><div class=\"pdf-phase-field\"><label for=\"pdfMarkNumberPosition\">Number position</label><select class=\"field\" id=\"pdfMarkNumberPosition\"><option value=\"center\">Bottom center</option><option value=\"left\">Bottom left</option><option value=\"right\">Bottom right</option></select></div></div><div class=\"pdf-phase-field\"><label for=\"pdfMarkLogo\">Optional logo (PNG/JPG, max 5 MB)</label><input class=\"field\" id=\"pdfMarkLogo\" type=\"file\" accept=\"image/png,image/jpeg\"><label for=\"pdfMarkLogoOpacity\">Logo opacity <output id=\"pdfMarkLogoOpacityValue\">80%</output></label><input class=\"field\" id=\"pdfMarkLogoOpacity\" type=\"range\" min=\"10\" max=\"100\" value=\"80\"></div></div><div class=\"pdf-phase-actions actions\"><button class=\"btn-primary\" type=\"button\" id=\"pdfMarkRun\">Apply to PDF</button><button class=\"btn-secondary\" type=\"button\" id=\"pdfMarkDownload\" disabled>Download PDF</button><button class=\"btn-secondary\" type=\"button\" id=\"pdfMarkClear\">Clear</button></div><p class=\"pdf-phase-status\" id=\"pdfMarkStatus\" role=\"status\" aria-live=\"polite\">Ready. Add a PDF to begin.</p><iframe class=\"pdf-phase-preview\" id=\"pdfMarkPreview\" title=\"Updated PDF preview\" hidden></iframe><p class=\"pdf-phase-privacy\"><strong>Privacy:</strong> PDF editing and watermark rendering happen locally in your browser using pdf-lib and the browser canvas. Your document is not uploaded to ToolNest.</p></div>");
 case "pdfsplitter":return form(`
<div class="pdf-split-tool">
 <div class="pdf-split-intro"><span class="pdf-split-kicker">TOOLNEST DOCUMENT STUDIO</span><h3>PDF Splitter</h3><p>Export each selected page as a separate PDF. Choose individual pages or enter a page range. Files are processed locally in your browser.</p></div>
 <div class="pdf-split-upload"><label class="field-label" for="pdfSplitFiles">Choose one PDF file</label><input class="field" id="pdfSplitFiles" type="file" accept="application/pdf,.pdf"><p class="muted text-sm">Maximum 30 MB and 300 pages per PDF. Damaged or password-protected files may not open.</p></div>
 <div class="pdf-split-summary" id="pdfSplitSummary" role="status" aria-live="polite">No PDF selected.</div>
 <div class="pdf-split-range"><label for="pdfSplitRange">Page range (example: 1-3,5)</label><input class="field" id="pdfSplitRange" type="text" placeholder="1-3,5" disabled><button type="button" class="btn-secondary" id="pdfSplitApplyRange" disabled>Apply Range</button><button type="button" class="btn-secondary" id="pdfSplitSelectAll" disabled>Select All</button><button type="button" class="btn-secondary" id="pdfSplitSelectNone" disabled>Select None</button></div>
 <div class="pdf-split-pages" id="pdfSplitPages"><div class="pdf-split-empty">Upload a PDF to view its pages.</div></div>
 <div class="pdf-split-actions actions"><button type="button" class="btn-primary" id="pdfSplitRun" disabled>Split Selected Pages</button><button type="button" class="btn-secondary" id="pdfSplitDownload" disabled>Download PDF / ZIP</button><button type="button" class="btn-secondary" id="pdfSplitClear">Clear All</button></div>
 <p class="pdf-split-status" id="pdfSplitStatus" role="status" aria-live="polite">Ready. Add a PDF file to begin.</p>
 <div class="pdf-split-privacy"><strong>Privacy:</strong> PDF files are processed locally in this browser and are not uploaded to ToolNest. PDF and ZIP libraries load from public CDNs when needed.</div>
</div>`);
 case "pdfmerge":return form(`
<div class="pdf-merge-tool">
 <div class="pdf-merge-intro"><span class="pdf-merge-kicker">TOOLNEST DOCUMENT STUDIO</span><h3>Advanced PDF Merger</h3><p>Add multiple PDF files, arrange their order, choose individual pages, rotate pages and create one custom PDF. Files are processed locally in your browser.</p></div>
 <div class="pdf-merge-upload" id="pdfMergeUpload"><label class="field-label" for="pdfMergeFiles">Choose PDF files</label><input class="field" id="pdfMergeFiles" type="file" accept="application/pdf,.pdf" multiple><p class="muted text-sm">Up to 20 files · 50 MB per file · 200 MB total. Password-protected or damaged PDFs may not open.</p></div>
 <div class="pdf-merge-summary" id="pdfMergeSummary" role="status" aria-live="polite">No PDF files added yet.</div>
 <div class="pdf-merge-list" id="pdfMergeList"><div class="pdf-merge-empty">Your PDF files and page controls will appear here.</div></div>
 <div class="pdf-merge-actions actions"><button type="button" class="btn-primary" id="pdfMergeRun" disabled>Merge Selected Pages</button><button type="button" class="btn-secondary" id="pdfMergeDownload" disabled>Download Merged PDF</button><button type="button" class="btn-secondary" id="pdfMergeClear">Clear All</button></div>
 <p class="pdf-merge-status" id="pdfMergeStatus" role="status" aria-live="polite">Ready. Add at least one PDF file to begin.</p>
 <div class="pdf-merge-privacy"><strong>Privacy:</strong> PDF files are read and processed in this browser. ToolNest does not upload them to its own server. Your device's available memory may limit very large jobs.</div>
</div>`);
 case "iptools":return form('<p class="muted text-sm">Look up a public IPv4 or IPv6 address, or check the public IP seen by the lookup provider. Location results are approximate, never an exact home or GPS location.</p>'+input("ipAddress","IP address to look up","8.8.8.8")+'<div class="actions">'+btn("lookupIp","Look Up IP") + btn("myIp","Find My IP",false)+'</div><div hidden>'+out()+'</div><div id="ipLookupStatus" class="ip-lookup-status muted text-sm" role="status" aria-live="polite">Ready. Enter a public IP address or choose Find My IP.</div><section id="ipLookupResults" class="ip-lookup-results" aria-live="polite" hidden></section><p class="muted text-sm">Privacy: the IP address is sent directly from your browser to IPWHOIS.io to provide the lookup. ToolNest does not route it through its own server. The provider may process request data under its own policy. VPN/proxy detection is not included in this free endpoint.</p><p class="muted text-sm">Accuracy: city, postal area and coordinates are estimates associated with the network IP. They cannot identify a person, home, street or exact GPS location.</p>');
 case "meta":return form(`${input("pageTitle","Page title","My useful website")}${textarea("pageDescription","Meta description","A short and helpful description of this page.")}${input("pageUrl","Canonical URL","https://example.com","url")}<div class="actions">${btn("generate","Generate tags")}${btn("copy","Copy tags",false)}</div>${out()}`);
 case "robots":return form('<p class="muted text-sm">Create a plain-text robots.txt file. Add one path per line; rules apply to all crawlers.</p>'+textarea("robotsDisallow","Disallow paths (one per line)","/private/\n/admin/")+input("robotsSitemap","Sitemap URL (optional)","https://example.com/sitemap.xml","url") + '<div class="actions">'+btn("generateRobots","Generate robots.txt")+btn("copy","Copy result",false)+'</div>'+out()+'<p class="muted text-sm">This creates text only; save it as robots.txt at your website root. Robots.txt is not access control.</p>');
 case "sitemap":return form('<p class="muted text-sm">Enter one complete public page URL per line. URLs are validated and duplicates removed.</p>'+textarea("sitemapUrls","Website URLs (one per line)","https://example.com/\nhttps://example.com/about") + '<div class="actions">'+btn("generateSitemap","Generate XML sitemap")+btn("copy","Copy XML",false)+'</div>'+out()+'<p class="muted text-sm">Up to 500 URLs. Save the output as sitemap.xml and publish it on your website.</p>');
 case "gradient":return form('<div class="grid gap-4 sm:grid-cols-2">'+select("gradientType","Gradient type",[["linear","Linear"],["radial","Radial"]])+input("gradientAngle","Angle (linear only; 0–360°)","135","number")+'</div><div class="grid gap-4 sm:grid-cols-2">'+input("gradientColorA","First color","#6366f1","color")+input("gradientColorB","Second color","#06b6d4","color")+'</div><div id="gradientPreview" class="phase15-gradient-preview" aria-label="CSS gradient preview"></div><div class="actions">'+btn("generateGradient","Generate CSS")+btn("copy","Copy CSS",false)+'</div>'+out()+'<p class="muted text-sm">Preview and CSS are generated locally.</p>');
 case "color":return form(`<div class="grid gap-4 sm:grid-cols-2">${input("hex","HEX color","#6366f1")}<div><label class="field-label" for="colorPicker">Pick a color</label><input class="field h-12" id="colorPicker" type="color" value="#6366f1"></div></div><div class="actions">${btn("convert","Convert color")}${btn("copy","Copy values",false)}</div><div id="colorSwatch" class="h-16 rounded-xl border border-slate-200"></div>${out()}`);
 case "forexcalc":return form(`${input("forexAmount","Amount","100","number")}<div class="grid gap-4 sm:grid-cols-2">${select("forexFrom","From currency",[["USD","USD — US Dollar"],["BDT","BDT — Bangladeshi Taka"],["EUR","EUR — Euro"],["GBP","GBP — British Pound"],["JPY","JPY — Japanese Yen"],["AUD","AUD — Australian Dollar"],["CAD","CAD — Canadian Dollar"],["CHF","CHF — Swiss Franc"],["NZD","NZD — New Zealand Dollar"],["INR","INR — Indian Rupee"],["SGD","SGD — Singapore Dollar"],["CNY","CNY — Chinese Yuan"],["PKR","PKR — Pakistani Rupee"],["AED","AED — UAE Dirham"],["SAR","SAR — Saudi Riyal"],["MYR","MYR — Malaysian Ringgit"],["THB","THB — Thai Baht"],["TRY","TRY — Turkish Lira"],["ZAR","ZAR — South African Rand"],["HKD","HKD — Hong Kong Dollar"]])}${select("forexTo","To currency",[["USD","USD — US Dollar"],["BDT","BDT — Bangladeshi Taka"],["EUR","EUR — Euro"],["GBP","GBP — British Pound"],["JPY","JPY — Japanese Yen"],["AUD","AUD — Australian Dollar"],["CAD","CAD — Canadian Dollar"],["CHF","CHF — Swiss Franc"],["NZD","NZD — New Zealand Dollar"],["INR","INR — Indian Rupee"],["SGD","SGD — Singapore Dollar"],["CNY","CNY — Chinese Yuan"],["PKR","PKR — Pakistani Rupee"],["AED","AED — UAE Dirham"],["SAR","SAR — Saudi Riyal"],["MYR","MYR — Malaysian Ringgit"],["THB","THB — Thai Baht"],["TRY","TRY — Turkish Lira"],["ZAR","ZAR — South African Rand"],["HKD","HKD — Hong Kong Dollar"]])}</div><div class="actions">${btn("convertCurrency","Convert currency")}${btn("swapCurrencies","Swap currencies",false)}${btn("copy","Copy result",false)}</div>${out()}<p class="muted text-sm">Uses reference exchange rates retrieved online; rates are generally updated daily and may differ from your broker's executable Forex quotes. For information only, not trading advice. Rate source: <a href="https://www.exchangerate-api.com/docs/free" target="_blank" rel="noopener noreferrer">ExchangeRate-API</a>.</p>`);
 case "unit":return form(`${select("unitType","Conversion type",[["length","Length"],["weight","Weight"],["temperature","Temperature"]])}<div class="grid gap-4 sm:grid-cols-3">${input("unitValue","Value","1","number")}${select("unitFrom","From",[])}${select("unitTo","To",[])}</div><div class="actions">${btn("convert","Convert")}${btn("copy","Copy result",false)}</div>${out()}`);

 case "age":return form(`<div class="grid gap-4 sm:grid-cols-2">${input("dateA","Date of birth / start date","","date")}${input("dateB","End date (blank = today)","","date")}</div><div class="actions">${btn("calculate","Calculate")}${btn("copy","Copy result",false)}</div>${out()}`);
 case "percentage":return financeForm('<div><label class="field-label" for="percentageMode">Calculation type</label><select class="field" id="percentageMode"><option value="of">What is X% of Y?</option><option value="what">X is what percent of Y?</option><option value="change">Percentage increase or decrease</option></select></div><div class="grid gap-4 sm:grid-cols-2"><div><label class="field-label" id="percentageFirstLabel" for="percentageFirst">Percentage (%)</label><input class="field" id="percentageFirst" type="number" step="any" inputmode="decimal" placeholder="15"></div><div><label class="field-label" id="percentageSecondLabel" for="percentageSecond">Number</label><input class="field" id="percentageSecond" type="number" step="any" inputmode="decimal" placeholder="200"></div></div><div class="actions">'+btn("calculatePercentage","Calculate")+btn("copy","Copy result",false)+'</div>'+out()+'<p class="muted text-sm">Supports positive and negative values where mathematically valid. A zero denominator or zero original value is not allowed for percentage ratios.</p>');
 case "compound":return financeForm('<div class="grid gap-4 sm:grid-cols-2">'+input("compoundPrincipal","Initial principal","100000","number")+select("compoundCurrency","Currency",[["BDT","BDT — Bangladeshi Taka"],["USD","USD — US Dollar"],["EUR","EUR — Euro"],["GBP","GBP — British Pound"],["INR","INR — Indian Rupee"],["SAR","SAR — Saudi Riyal"],["AED","AED — UAE Dirham"]])+'</div><div class="grid gap-4 sm:grid-cols-2">'+input("compoundRate","Annual interest rate (%)","8","number")+input("compoundYears","Time (years)","5","number")+'</div>'+select("compoundFrequency","Compounding frequency",[["1","Annually"],["2","Semi-annually"],["4","Quarterly"],["12","Monthly"],["365","Daily"]])+'<div class="actions">'+btn("calculateCompound","Calculate compound interest")+btn("copy","Copy result",false)+'</div>'+out()+'<p class="muted text-sm">Assumes a fixed annual nominal rate, constant compounding frequency and no deposits, withdrawals, fees or taxes. Results are estimates, not a bank quote.</p>');
 case "emi":return financeForm('<div class="grid gap-4 sm:grid-cols-2">'+input("emiPrincipal","Loan amount","1000000","number")+select("emiCurrency","Currency",[["BDT","BDT — Bangladeshi Taka"],["USD","USD — US Dollar"],["EUR","EUR — Euro"],["GBP","GBP — British Pound"],["INR","INR — Indian Rupee"],["SAR","SAR — Saudi Riyal"],["AED","AED — UAE Dirham"]])+'</div><div class="grid gap-4 sm:grid-cols-2">'+input("emiRate","Annual interest rate (%)","10","number")+input("emiMonths","Loan tenure (months)","120","number")+'</div><div class="actions">'+btn("calculateEmi","Calculate monthly EMI")+btn("copy","Copy result",false)+'</div>'+out()+'<p class="muted text-sm">Uses a fixed-rate reducing-balance EMI formula with monthly payments. Excludes fees, insurance, variable rates and lender-specific rounding. Estimate only, not a loan offer.</p>');
 case "area":return '<div class="advanced-converter">'+form(input("areaValue","Area value","1","number")+select("areaFrom","From", [["sqm","Square metres (m²)"],["sqft","Square feet (ft²)"],["sqyd","Square yards (yd²)"],["acre","Acres"],["hectare","Hectares"],["sqkm","Square kilometres (km²)"]])+select("areaTo","To",[["sqft","Square feet (ft²)"],["sqm","Square metres (m²)"],["sqyd","Square yards (yd²)"],["acre","Acres"],["hectare","Hectares"],["sqkm","Square kilometres (km²)"]])+'<div class="actions">'+btn("convertArea","Convert") + btn("copy","Copy result",false)+'</div>'+out())+'</div>';
 case "land":return '<div class="advanced-converter">'+form(input("landValue","Land area","1","number")+select("landFrom","From",[["shotok","Shotok / Decimal"],["katha","Katha (Dhaka convention)"],["bigha","Bigha (20 katha)"],["acre","Acre"],["sqft","Square feet"]])+select("landTo","To",[["shotok","Shotok / Decimal"],["katha","Katha"],["bigha","Bigha"],["acre","Acre"],["sqft","Square feet"]])+'<div class="actions">'+btn("convertLand","Convert") + btn("copy","Copy result",false)+'</div>'+out()+'<p class="muted text-sm">Assumptions: 1 shotok = 435.6 ft²; 1 katha = 720 ft²; 1 bigha = 20 katha = 14,400 ft²; 1 acre = 100 shotok = 43,560 ft². Local land units can vary by area and deed; verify the applicable local standard before relying on a measurement.</p>')+'</div>';
 case "timezone":return '<div class="advanced-converter">'+form(input("timezoneDateTime","Date and time in the source zone","","datetime-local")+select("timezoneFrom","Source time zone",[["Asia/Dhaka","Asia/Dhaka (Bangladesh)"],["UTC","UTC"],["Asia/Kolkata","Asia/Kolkata (India)"],["Asia/Dubai","Asia/Dubai (UAE)"],["Asia/Tokyo","Asia/Tokyo"],["Europe/London","Europe/London"],["Europe/Paris","Europe/Paris"],["America/New_York","America/New_York"],["America/Los_Angeles","America/Los_Angeles"],["Australia/Sydney","Australia/Sydney"]])+select("timezoneTo","Convert to",[["UTC","UTC"],["Asia/Dhaka","Asia/Dhaka (Bangladesh)"],["Asia/Kolkata","Asia/Kolkata (India)"],["Asia/Dubai","Asia/Dubai (UAE)"],["Asia/Tokyo","Asia/Tokyo"],["Europe/London","Europe/London"],["Europe/Paris","Europe/Paris"],["America/New_York","America/New_York"],["America/Los_Angeles","America/Los_Angeles"],["Australia/Sydney","Australia/Sydney"]])+'<div class="actions">'+btn("convertTimezone","Convert time") + btn("copy","Copy result",false)+'</div>'+out()+'<p class="muted text-sm">Uses IANA time-zone rules, including daylight-saving changes. During a repeated clock hour the earlier occurrence is selected; a local time skipped by a clock change is rejected.</p>')+'</div>';
 case "numberwords":return '<div class="advanced-converter">'+form(input("numberWordsValue","Number","12345.67","number")+select("numberWordsLanguage","Output language",[["en","English"],["bn","বাংলা"]])+'<div class="actions">'+btn("convertNumberWords","Convert to words") + btn("copy","Copy result",false)+'</div>'+out()+'<p class="muted text-sm">Supports values from −999,999,999,999 to 999,999,999,999 and up to two decimal places.</p>')+'</div>';
 case "timestamp":return form(input("timestampValue","Unix timestamp","1760000000")+select("timestampUnit","Timestamp unit",[["seconds","Seconds"],["milliseconds","Milliseconds"]])+input("localDateTime","Local date and time","","datetime-local") + '<div class="actions">' + btn("convertTimestamp","Convert timestamp") + btn("convertDate","Convert date",false) + btn("copy","Copy result",false) + '</div>' + out() + '<p class="muted text-sm">Unix timestamps represent UTC time. Local date conversion uses your browser time zone.</p>');
 case "loremipsum":return form('<div class="grid gap-4 sm:grid-cols-2"><div><label class="field-label" for="loremParagraphs">Paragraphs (1–10)</label><input class="field" id="loremParagraphs" type="number" min="1" max="10" step="1" placeholder="3"></div>'+select("loremSentences","Sentences per paragraph",[["3","3 sentences"],["1","1 sentence"],["2","2 sentences"],["4","4 sentences"],["5","5 sentences"],["6","6 sentences"],["7","7 sentences"],["8","8 sentences"]])+'</div><div class="checkrow"><label><input id="loremStartStandard" type="checkbox" checked> Start with the classic Lorem ipsum opening</label></div><div class="actions">'+btn("generateLorem","Generate Lorem Ipsum")+btn("copy","Copy result",false)+'</div>'+out()+'<p class="muted text-sm">Generate up to 10 paragraphs with 1–8 sentences per paragraph. Text is created locally in your browser.</p>');
 case "whitespace":return form(textarea("sourceText","Text to clean")+'<div class="checkrow"><label><input id="trimWhitespaceLines" type="checkbox" checked> Trim each line</label><label><input id="removeBlankWhitespaceLines" type="checkbox"> Remove blank lines</label></div><div class="actions">' + btn("cleanWhitespace","Clean text") + btn("copy","Copy result",false) + '</div>' + out());
 case "htmlentities":return form(textarea("sourceText","Text or HTML entities")+'<div class="actions">' + btn("encodeEntities","Encode HTML") + btn("decodeEntities","Decode HTML",false) + btn("copy","Copy result",false) + '</div>' + out() + '<p class="muted text-sm">Decoded content is returned as plain text; it is not executed as HTML.</p>');

 case "imagecrop":return form('<div><label class="field-label" for="cropFile">Choose image (PNG, JPEG or WebP; max 10 MB)</label><input class="field" id="cropFile" type="file" accept="image/png,image/jpeg,image/webp"></div><div id="cropSourcePreview" class="image-tool-preview" hidden></div><p id="cropDimensions" class="muted text-sm">Choose an image to see its dimensions.</p><div class="grid gap-4 sm:grid-cols-2">'+input("cropX","Left (X px)","0","number")+input("cropY","Top (Y px)","0","number")+input("cropWidth","Crop width (px)","400","number")+input("cropHeight","Crop height (px)","300","number")+'</div>'+select("cropFormat","Output format",[["image/png","PNG"],["image/jpeg","JPEG"],["image/webp","WebP"]])+'<div class="actions">'+btn("cropImage","Crop image")+btn("clearCrop","Clear image",false)+'</div>'+out()+'<div id="cropPreview" class="image-tool-preview" hidden></div><p class="muted text-sm">Set the crop rectangle in pixels. The selected area must fit inside the source image; output is limited to 4096 × 4096 pixels.</p>');
 case "imageformat":return form('<div><label class="field-label" for="formatFile">Choose image (PNG, JPEG or WebP; max 10 MB)</label><input class="field" id="formatFile" type="file" accept="image/png,image/jpeg,image/webp"></div><div id="formatSourcePreview" class="image-tool-preview" hidden></div>'+select("targetFormat","Convert to",[["image/png","PNG"],["image/jpeg","JPEG"],["image/webp","WebP"]])+'<label class="field-label" for="formatQuality">Quality for JPEG / WebP: <output id="formatQualityValue">90%</output></label><input class="field" id="formatQuality" type="range" min="10" max="100" value="90"><div class="actions">'+btn("convertFormat","Convert image")+btn("clearFormat","Clear image",false)+'</div>'+out()+'<div id="formatPreview" class="image-tool-preview" hidden></div><p class="muted text-sm">Transparent areas become white when converting to JPEG. Maximum source dimensions: 4096 × 4096 pixels.</p>');
 case "base64image":return form('<p class="muted text-sm">Paste an image data URL (data:image/...) or raw Base64. The tool checks the actual image file signature before displaying it.</p>'+textarea("base64Input","Paste image data URL or Base64")+'<div class="actions">'+btn("decodeImage","Decode image")+btn("copyImageData","Copy data URL",false)+btn("clearBase64Image","Clear",false)+'</div>'+out()+'<div id="base64ImagePreview" class="image-tool-preview" hidden></div><p class="muted text-sm">For safety, only PNG, JPEG, WebP and GIF image data are accepted. Maximum decoded size: 10 MB. Processing stays in this browser.</p>');

 case "imageresize":return form('<div><label class="field-label" for="resizeFile">Choose image (PNG, JPEG or WebP; max 10 MB)</label><input class="field" id="resizeFile" type="file" accept="image/png,image/jpeg,image/webp"></div><div class="grid gap-4 sm:grid-cols-2">' + input("resizeWidth","Width (px)","800","number") + input("resizeHeight","Height (px)","600","number") + '</div><label><input id="resizeKeepRatio" type="checkbox" checked> Keep aspect ratio</label>' + select("resizeFormat","Output format",[["image/png","PNG"],["image/jpeg","JPEG"],["image/webp","WebP"]]) + '<div class="actions">' + btn("resizeImage","Resize image") + btn("clearImage","Clear image",false) + '</div>' + out() + '<div id="imageResultPreview" class="image-tool-preview" hidden></div><p class="muted text-sm">Images are processed locally. Maximum output dimension: 4096 × 4096 pixels.</p>');
 case "imagecompress":return form('<div><label class="field-label" for="compressFile">Choose image (PNG, JPEG or WebP; max 10 MB)</label><input class="field" id="compressFile" type="file" accept="image/png,image/jpeg,image/webp"></div>' + select("compressFormat","Output format",[["image/webp","WebP"],["image/jpeg","JPEG"]]) + '<label class="field-label" for="compressQuality">Quality: <output id="compressQualityValue">75%</output></label><input class="field" id="compressQuality" type="range" min="10" max="95" value="75"><div class="actions">' + btn("compressImage","Compress image") + btn("clearImage","Clear image",false) + '</div>' + out() + '<div id="imageResultPreview" class="image-tool-preview" hidden></div><p class="muted text-sm">Lower quality can reduce file size but may reduce image detail. Review the preview before downloading.</p>');

 case "pdforganizer":return form(`
 <div class="b2-tool"><p class="muted text-sm">Reorder pages by entering a complete page sequence, then optionally rotate every page. Processing stays in your browser.</p>
 <label class="field-label" for="pdfOrganizeFile">Choose PDF (max 30 MB, 300 pages)</label><input class="field" id="pdfOrganizeFile" type="file" accept="application/pdf,.pdf">
 <label class="field-label" for="pdfPageOrder">New page order (comma-separated)</label><input class="field" id="pdfPageOrder" type="text" placeholder="Example: 3,1,2">
 <label class="field-label" for="pdfRotateAll">Rotate every page</label><select class="field" id="pdfRotateAll"><option value="0">No rotation</option><option value="90">90° clockwise</option><option value="180">180°</option><option value="270">270° clockwise</option></select>
 <div class="actions">${btn("organizePdf","Organize & Download PDF")}${btn("clearPdfOrganizer","Clear",false)}</div><p id="pdfOrganizeStatus" class="b2-status" role="status" aria-live="polite">Choose a PDF to inspect its page count.</p></div>`);
 case "textsorter":return form(`
 ${textarea("b2Input","Lines to sort","Banana\\nApple\\nOrange")}
 ${select("sortMode","Sort order",[["az","A → Z"],["za","Z → A"],["numeric","Numeric ascending"],["numeric-desc","Numeric descending"]])}
 <div class="checkrow"><label><input id="sortIgnoreCase" type="checkbox" checked> Ignore letter case</label><label><input id="sortKeepBlank" type="checkbox" checked> Keep blank lines in place</label></div>
 <div class="actions">${btn("sortText","Sort lines")}${btn("copy","Copy result",false)}</div>${out()}<p id="b2Status" class="b2-status" role="status" aria-live="polite"></p>`);
 case "findreplace":return form(`
 ${textarea("b2Input","Text to edit")}
 ${input("findValue","Find","Text to find")}${input("replaceValue","Replace with","Replacement text")}
 <div class="checkrow"><label><input id="replaceCase" type="checkbox"> Match case</label><label><input id="replaceWhole" type="checkbox"> Whole words only</label><label><input id="replaceAll" type="checkbox" checked> Replace all matches</label></div>
 <div class="actions">${btn("replaceText","Find & Replace")}${btn("copy","Copy result",false)}</div>${out()}<p id="b2Status" class="b2-status" role="status" aria-live="polite"></p>`);
 case "jwtdecoder":return form(`
 ${textarea("b2Input","Paste JWT token here")}
 <div class="actions">${btn("decodeJwt","Decode JWT")}${btn("copy","Copy decoded data",false)}</div>${out()}<p id="b2Status" class="b2-status" role="status" aria-live="polite"></p><p class="muted text-sm">Privacy: decoding happens locally. No token or secret is sent to a server. This tool does not verify the token signature or establish that its claims are trustworthy. Do not share sensitive tokens.</p>`);
 case "xmlformatter":return form(`
 ${textarea("b2Input","Paste XML here","<root><item>Example</item></root>")}
 <div class="actions">${btn("formatXml","Format XML")}${btn("copy","Copy formatted XML",false)}</div>${out()}<p id="b2Status" class="b2-status" role="status" aria-live="polite"></p><p class="muted text-sm">XML is parsed and formatted locally in your browser. Formatting does not change the meaning of valid XML.</p>`);
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
 case "zipmanager": { window.ToolNestZip?.init(); break; }
 case "favicongenerator": { window.ToolNestFavicon?.init(); const slider=$("#faviconPadding");slider?.addEventListener("input",()=>{const out=$("#faviconPaddingValue");if(out)out.textContent=slider.value+"%";});break; }
 case "urlshortener": {
  window.ToolNestUrlShortener?.init();
  bind("copy",()=>copyOutput());
  break;
 }
 case "pdftoimage": { window.ToolNestPdfToImage?.init(); break; }
 case "pdftext": { window.ToolNestPdfText?.init(); break; }
 case "pdfmark": { window.ToolNestPdfMark?.init(); break; }
 case "pdfsplitter": {
  window.ToolNestPdfSplitter?.init();
  break;
 }
 case "imagepdf": {
  window.ToolNestImageToPdf?.init();
  break;
 }
 case "pdfmerge": {
  window.ToolNestPdfMerge?.init();
  break;
 }
 case "iptools": {
  const status=$("#ipLookupStatus"),results=$("#ipLookupResults"),lookupButton=$("#lookupIp"),myButton=$("#myIp");
  const render=(data)=>{
   const rows=[["IP address",data.ip],["IP version",data.type],["Address type",ToolNestIP.classifyIpAddress(data.ip)],["Continent",data.continent],["Country",(data.flag?.emoji?data.flag.emoji+" ":"")+(data.country||"")],["Region / State",data.region],["City",data.city],["Postal area",data.postal],["Approximate coordinates",Number.isFinite(data.latitude)&&Number.isFinite(data.longitude)?data.latitude.toFixed(4)+", "+data.longitude.toFixed(4):""],["ISP",data.connection?.isp],["Organization",data.connection?.org],["ASN",data.connection?.asn?"AS"+data.connection.asn:""],["Network domain",data.connection?.domain],["Time zone",data.timezone?.id],["UTC offset",data.timezone?.utc]];
   results.replaceChildren();
   const heading=document.createElement("h3");heading.className="ip-lookup-heading";heading.textContent="IP lookup results";results.append(heading);
   const grid=document.createElement("dl");grid.className="ip-lookup-grid";
   rows.forEach(([label,value])=>{const wrap=document.createElement("div");wrap.className="ip-lookup-item";const dt=document.createElement("dt");dt.textContent=label;const dd=document.createElement("dd");dd.textContent=value===null||value===undefined||value===""?"Not available":String(value);wrap.append(dt,dd);grid.append(wrap);});
   results.append(grid);
   setOutput(rows.map(([label,value])=>label+": "+(value===null||value===undefined||value===""?"Not available":String(value))).join("\n")+"\n\nLocation and coordinates are approximate network estimates.");
   const note=document.createElement("p");note.className="ip-lookup-note";note.textContent="Location and coordinates are approximate network estimates, not a person's physical location.";results.append(note);
   results.hidden=false;
  };
  const lookup=async(value,own=false)=>{
   const ip=value.trim();
   if(!own&&!ip){status.textContent="Enter an IP address to look it up, or choose Find My IP.";status.className="ip-lookup-status is-error";return;}
   if(ip&&!ToolNestIP.isValidIpAddress(ip)){status.textContent="Enter a valid IPv4 or IPv6 address.";status.className="ip-lookup-status is-error";return;}
   if(ip&&ToolNestIP.classifyIpAddress(ip)==="Private / special-use"){status.textContent="This is a private or special-use IP address. It is not publicly geolocatable, so no external lookup was sent.";status.className="ip-lookup-status is-error";setOutput("IP address: "+ip+"\nAddress type: Private / special-use\nPublic geolocation: Not available.");results.hidden=true;return;}
   lookupButton.disabled=true;myButton.disabled=true;status.textContent=ip?"Looking up "+ip+"…":"Checking the public IP address…";status.className="ip-lookup-status muted";results.hidden=true;results.replaceChildren();
   try{
    const fields="ip,type,continent,country,country_code,region,region_code,city,postal,latitude,longitude,flag.emoji,connection.isp,connection.org,connection.asn,connection.domain,timezone.id,timezone.utc";
    const url="https://ipwho.is/"+(ip?encodeURIComponent(ip):"")+"?fields="+encodeURIComponent(fields);
    const response=await fetch(url,{headers:{Accept:"application/json"},cache:"no-store"});
    if(response.status===429)throw new Error("The free lookup service has reached its daily request limit. Please try again later.");
    if(!response.ok)throw new Error("The lookup service returned HTTP "+response.status+". Please try again later.");
    const data=await response.json();
    if(!data||data.success!==true){const reason=data?.message||"This address could not be looked up.";throw new Error(reason+" Private, reserved or unsupported IP ranges may not have public geolocation.");}
    render(data);$("#ipAddress").value=data.ip||ip;status.textContent="Lookup complete. Location data is approximate and supplied by IPWHOIS.io.";status.className="ip-lookup-status is-success";
   }catch(error){status.textContent=error.message||"Could not complete the lookup. Check your connection and try again.";status.className="ip-lookup-status is-error";}
   finally{lookupButton.disabled=false;myButton.disabled=false;}
  };
  bind("lookupIp",()=>lookup($("#ipAddress").value));
  bind("myIp",()=>{ $("#ipAddress").value=""; lookup("",true); });
  bind("copy",()=>copyOutput());
  break;
 }
 case "area": {
  bind("convertArea",()=>{const raw=$("#areaValue").value.trim();if(!raw){message("Enter an area value first.","error");return;}const result=ToolNestAdvanced.convertArea(raw,$("#areaFrom").value,$("#areaTo").value);setOutput(Number(result.toPrecision(12)).toLocaleString(undefined,{maximumFractionDigits:8})+" "+$("#areaTo").selectedOptions[0].text);});
  bind("copy",()=>copyOutput());break;
 }
 case "land": {
  bind("convertLand",()=>{const raw=$("#landValue").value.trim();if(!raw){message("Enter a land area first.","error");return;}const result=ToolNestAdvanced.convertLand(raw,$("#landFrom").value,$("#landTo").value);setOutput(Number(result.toPrecision(12)).toLocaleString(undefined,{maximumFractionDigits:8})+" "+$("#landTo").selectedOptions[0].text);});
  bind("copy",()=>copyOutput());break;
 }
 case "timezone": {
  bind("convertTimezone",()=>{const result=ToolNestAdvanced.convertTimeZone($("#timezoneDateTime").value,$("#timezoneFrom").value,$("#timezoneTo").value);const source=$("#timezoneFrom").value;setOutput("Source: "+$("#timezoneDateTime").value+" ("+source+")\nUTC: "+result.utc+"\nConverted: "+result.display+(result.ambiguous?"\nNote: This local time occurs twice due to a daylight-saving clock change; the earlier occurrence was selected.":""));message(result.ambiguous?"Converted; earlier daylight-saving occurrence selected.":"Time converted successfully.");});
  bind("copy",()=>copyOutput());break;
 }
 case "numberwords": {
  bind("convertNumberWords",()=>{const raw=$("#numberWordsValue").value.trim();if(!raw){message("Enter a number first.","error");return;}setOutput(ToolNestAdvanced.numberToWords(raw,$("#numberWordsLanguage").value));});
  bind("copy",()=>copyOutput());break;
 }
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


 case "imagecrop": {
  let cropSourceUrl=null,cropOutputUrl=null;
  const clearCrop=()=>{
   if(cropSourceUrl)URL.revokeObjectURL(cropSourceUrl);
   if(cropOutputUrl)URL.revokeObjectURL(cropOutputUrl);
   cropSourceUrl=cropOutputUrl=null;
   $("#cropFile").value="";
   $("#cropSourcePreview").replaceChildren();$("#cropSourcePreview").hidden=true;
   $("#cropPreview").replaceChildren();$("#cropPreview").hidden=true;
   $("#cropDimensions").textContent="Choose an image to see its dimensions.";
   ["cropX","cropY"].forEach(id=>$("#"+id).value="0");
   $("#cropWidth").value="400";$("#cropHeight").value="300";$("#cropFormat").value="image/png";
   const output=$("#output");output.textContent="";delete output.dataset.downloadUrl;delete output.dataset.downloadName;
   message("Image cropper cleared.");
  };
  $("#cropFile").addEventListener("change",()=>{
   if(cropOutputUrl)URL.revokeObjectURL(cropOutputUrl);cropOutputUrl=null;
   const oldOutput=$("#output");oldOutput.textContent="";delete oldOutput.dataset.downloadUrl;delete oldOutput.dataset.downloadName;
   $("#cropPreview").replaceChildren();$("#cropPreview").hidden=true;
   const file=$("#cropFile").files[0];if(!file)return;
   if(!["image/png","image/jpeg","image/webp"].includes(file.type)||file.size>10*1024*1024){if(cropSourceUrl)URL.revokeObjectURL(cropSourceUrl);cropSourceUrl=null;$("#cropSourcePreview").replaceChildren();$("#cropSourcePreview").hidden=true;message("Choose a PNG, JPEG or WebP image smaller than 10 MB.","error");$("#cropFile").value="";return;}
   if(cropSourceUrl)URL.revokeObjectURL(cropSourceUrl);
   cropSourceUrl=URL.createObjectURL(file);
   const img=new Image();
   img.onload=()=>{
    if(img.naturalWidth>12000||img.naturalHeight>12000||img.naturalWidth*img.naturalHeight>40000000){URL.revokeObjectURL(cropSourceUrl);cropSourceUrl=null;$("#cropFile").value="";message("Source image exceeds the safe 40-megapixel limit.","error");return;}
    $("#cropDimensions").textContent="Source: "+img.naturalWidth+" × "+img.naturalHeight+" px";
    $("#cropWidth").value=Math.min(400,img.naturalWidth);$("#cropHeight").value=Math.min(300,img.naturalHeight);
    const preview=$("#cropSourcePreview");preview.replaceChildren();const image=document.createElement("img");image.src=cropSourceUrl;image.alt="Source image for cropping";preview.append(image);preview.hidden=false;
   };
   img.onerror=()=>message("Could not read this image file.","error");img.src=cropSourceUrl;
  });
  bind("cropImage",()=>{
   const file=$("#cropFile").files[0];if(!file||!cropSourceUrl){message("Choose an image first.","error");return;}
   const x=Number($("#cropX").value),y=Number($("#cropY").value),w=Number($("#cropWidth").value),h=Number($("#cropHeight").value);
   if(![x,y,w,h].every(Number.isInteger)||x<0||y<0||w<1||h<1||w>4096||h>4096){message("Enter whole pixel values; crop width and height must be 1–4096.","error");return;}
   const img=new Image();
   img.onload=()=>{
    if(x+w>img.naturalWidth||y+h>img.naturalHeight){message("The crop rectangle must fit inside the source image.","error");return;}
    const canvas=document.createElement("canvas");canvas.width=w;canvas.height=h;const ctx=canvas.getContext("2d");
    if(!ctx){message("Canvas is unavailable in this browser.","error");return;}
    const format=$("#cropFormat").value;if(format==="image/jpeg"){ctx.fillStyle="#fff";ctx.fillRect(0,0,w,h);}
    ctx.drawImage(img,x,y,w,h,0,0,w,h);
    canvas.toBlob(blob=>{
     if(!blob||blob.type!==format){message("This image format is not supported by your browser.","error");return;}
     if(cropOutputUrl)URL.revokeObjectURL(cropOutputUrl);cropOutputUrl=URL.createObjectURL(blob);
     const ext=format==="image/jpeg"?"jpg":format==="image/webp"?"webp":"png",output=$("#output");
     output.dataset.downloadUrl=cropOutputUrl;output.dataset.downloadName="toolnest-cropped-image."+ext;
     setOutput("Cropped image: "+w+" × "+h+" px\nFile size: "+(blob.size/1024).toFixed(1)+" KB");
     const preview=$("#cropPreview");preview.replaceChildren();const image=document.createElement("img");image.src=cropOutputUrl;image.alt="Cropped image preview";preview.append(image);preview.hidden=false;
     message("Image cropped. Use Download result to save it.");
    },format,0.92);
   };
   img.onerror=()=>message("Could not load the selected image.","error");img.src=cropSourceUrl;
  });
  bind("clearCrop",clearCrop);bind("copy",()=>copyOutput());break;
 }
 case "imageformat": {
  let formatSourceUrl=null,formatOutputUrl=null;
  const clearFormat=()=>{
   if(formatSourceUrl)URL.revokeObjectURL(formatSourceUrl);if(formatOutputUrl)URL.revokeObjectURL(formatOutputUrl);
   formatSourceUrl=formatOutputUrl=null;$("#formatFile").value="";$("#targetFormat").value="image/png";$("#formatQuality").value="90";$("#formatQualityValue").textContent="90%";
   $("#formatSourcePreview").replaceChildren();$("#formatSourcePreview").hidden=true;$("#formatPreview").replaceChildren();$("#formatPreview").hidden=true;
   const output=$("#output");output.textContent="";delete output.dataset.downloadUrl;delete output.dataset.downloadName;message("Image converter cleared.");
  };
  $("#formatQuality").addEventListener("input",()=>{$("#formatQualityValue").textContent=$("#formatQuality").value+"%";});
  $("#formatFile").addEventListener("change",()=>{
   if(formatOutputUrl)URL.revokeObjectURL(formatOutputUrl);formatOutputUrl=null;
   const oldOutput=$("#output");oldOutput.textContent="";delete oldOutput.dataset.downloadUrl;delete oldOutput.dataset.downloadName;
   $("#formatPreview").replaceChildren();$("#formatPreview").hidden=true;
   const file=$("#formatFile").files[0];if(!file)return;
   if(!["image/png","image/jpeg","image/webp"].includes(file.type)||file.size>10*1024*1024){if(formatSourceUrl)URL.revokeObjectURL(formatSourceUrl);formatSourceUrl=null;$("#formatSourcePreview").replaceChildren();$("#formatSourcePreview").hidden=true;message("Choose a PNG, JPEG or WebP image smaller than 10 MB.","error");$("#formatFile").value="";return;}
   if(formatSourceUrl)URL.revokeObjectURL(formatSourceUrl);formatSourceUrl=URL.createObjectURL(file);
   const img=new Image();img.onload=()=>{
    if(img.naturalWidth>4096||img.naturalHeight>4096||img.naturalWidth*img.naturalHeight>40000000){URL.revokeObjectURL(formatSourceUrl);formatSourceUrl=null;$("#formatFile").value="";$("#formatSourcePreview").replaceChildren();$("#formatSourcePreview").hidden=true;message("Image dimensions must not exceed 4096 pixels per side or 40 megapixels.","error");return;}
    const preview=$("#formatSourcePreview");preview.replaceChildren();const image=document.createElement("img");image.src=formatSourceUrl;image.alt="Original image preview";preview.append(image);preview.hidden=false;
   };img.onerror=()=>message("Could not read this image file.","error");img.src=formatSourceUrl;
  });
  bind("convertFormat",()=>{
   const file=$("#formatFile").files[0];if(!file||!formatSourceUrl){message("Choose an image first.","error");return;}
   const img=new Image();img.onload=()=>{
    const format=$("#targetFormat").value,canvas=document.createElement("canvas");canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
    const ctx=canvas.getContext("2d");if(!ctx){message("Canvas is unavailable in this browser.","error");return;}
    if(format==="image/jpeg"){ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);}
    ctx.drawImage(img,0,0);
    canvas.toBlob(blob=>{
     if(!blob||blob.type!==format){message("Your browser could not export this format. Try PNG or JPEG.","error");return;}
     if(formatOutputUrl)URL.revokeObjectURL(formatOutputUrl);formatOutputUrl=URL.createObjectURL(blob);
     const ext=format==="image/jpeg"?"jpg":format==="image/webp"?"webp":"png",output=$("#output");
     output.dataset.downloadUrl=formatOutputUrl;output.dataset.downloadName="toolnest-converted-image."+ext;
     setOutput("Converted to "+ext.toUpperCase()+"\nDimensions: "+canvas.width+" × "+canvas.height+" px\nOriginal: "+(file.size/1024).toFixed(1)+" KB\nConverted: "+(blob.size/1024).toFixed(1)+" KB");
     const preview=$("#formatPreview");preview.replaceChildren();const image=document.createElement("img");image.src=formatOutputUrl;image.alt="Converted image preview";preview.append(image);preview.hidden=false;message("Image converted. Use Download result to save it.");
    },format,Number($("#formatQuality").value)/100);
   };img.onerror=()=>message("Could not load the selected image.","error");img.src=formatSourceUrl;
  });
  bind("clearFormat",clearFormat);bind("copy",()=>copyOutput());break;
 }
 case "base64image": {
  let imageObjectUrl=null,decodedDataUrl="";
  const clearBase64Image=()=>{
   if(imageObjectUrl)URL.revokeObjectURL(imageObjectUrl);imageObjectUrl=null;decodedDataUrl="";
   $("#base64Input").value="";$("#base64ImagePreview").replaceChildren();$("#base64ImagePreview").hidden=true;
   const output=$("#output");output.textContent="";delete output.dataset.downloadUrl;delete output.dataset.downloadName;message("Base64 to Image cleared.");
  };
  bind("decodeImage",()=>{
   if(imageObjectUrl)URL.revokeObjectURL(imageObjectUrl);imageObjectUrl=null;decodedDataUrl="";
   const oldOutput=$("#output");oldOutput.textContent="";delete oldOutput.dataset.downloadUrl;delete oldOutput.dataset.downloadName;
   $("#base64ImagePreview").replaceChildren();$("#base64ImagePreview").hidden=true;
   const raw=$("#base64Input").value.trim();if(!raw){message("Paste an image data URL or Base64 first.","error");return;}
   if(raw.length>15*1024*1024){message("Encoded image data is too large (maximum 15 MB).","error");return;}
   const match=raw.match(/^data:(image\/(?:png|jpeg|webp|gif));base64,([\s\S]*)$/i);
   const payload=(match?match[2]:raw).replace(/\s/g,"");
   if(!payload||payload.length%4===1||!/^[A-Za-z0-9+/]*={0,2}$/.test(payload)){message("Invalid Base64 data. Check the pasted content.","error");return;}
   let bytes;try{const binary=atob(payload);bytes=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);}catch{message("Could not decode this Base64 data.","error");return;}
   if(bytes.length>10*1024*1024){message("Decoded image must be 10 MB or smaller.","error");return;}
   const starts=(...values)=>values.every((v,i)=>bytes[i]===v);
   let mime="";
   if(starts(0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a))mime="image/png";
   else if(starts(0xff,0xd8,0xff))mime="image/jpeg";
   else if(starts(0x47,0x49,0x46,0x38,0x37,0x61)||starts(0x47,0x49,0x46,0x38,0x39,0x61))mime="image/gif";
   else if(starts(0x52,0x49,0x46,0x46)&&bytes[8]===0x57&&bytes[9]===0x45&&bytes[10]===0x42&&bytes[11]===0x50)mime="image/webp";
   if(!mime){message("The data does not contain a supported PNG, JPEG, WebP or GIF image.","error");return;}
   if(match&&match[1].toLowerCase()!==mime){message("The data URL type does not match the image content.","error");return;}
   const blob=new Blob([bytes],{type:mime});if(imageObjectUrl)URL.revokeObjectURL(imageObjectUrl);imageObjectUrl=URL.createObjectURL(blob);
   const img=new Image();img.onload=()=>{
    if(img.naturalWidth>12000||img.naturalHeight>12000||img.naturalWidth*img.naturalHeight>40000000){URL.revokeObjectURL(imageObjectUrl);imageObjectUrl=null;message("Decoded image exceeds the safe 40-megapixel limit.","error");return;}
    decodedDataUrl="data:"+mime+";base64,"+payload;
    const output=$("#output");output.dataset.downloadUrl=imageObjectUrl;output.dataset.downloadName="toolnest-decoded-image."+(mime==="image/jpeg"?"jpg":mime==="image/webp"?"webp":mime==="image/gif"?"gif":"png");
    setOutput("Image decoded successfully.\nType: "+mime+"\nDimensions: "+img.naturalWidth+" × "+img.naturalHeight+" px\nSize: "+(bytes.length/1024).toFixed(1)+" KB");
    const preview=$("#base64ImagePreview");preview.replaceChildren();const image=document.createElement("img");image.src=imageObjectUrl;image.alt="Decoded Base64 image preview";preview.append(image);preview.hidden=false;message("Image decoded. Use Download result to save it.");
   };img.onerror=()=>{if(imageObjectUrl)URL.revokeObjectURL(imageObjectUrl);imageObjectUrl=null;message("Decoded data could not be displayed as an image.","error");};img.src=imageObjectUrl;
  });
  bind("copyImageData",()=>{
   if(!decodedDataUrl){message("Decode an image first.","error");return;}
   if(!navigator.clipboard?.writeText){message("Clipboard access is unavailable in this browser.","error");return;}
   navigator.clipboard.writeText(decodedDataUrl).then(()=>message("Image data URL copied.")).catch(()=>message("Clipboard access was blocked.","error"));
  });
  bind("copy",()=>copyOutput());bind("clearBase64Image",clearBase64Image);break;
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
  try{
   if(typeof QRCodeStyling!=="function")await loadQrLibrary();
   if(token!==renderToken)return false;
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
 case "robots": {
  bind("generateRobots",()=>{try{setOutput(ToolNestPhase15.buildRobotsTxt({sitemap:$("#robotsSitemap").value,disallow:$("#robotsDisallow").value}));}catch(error){message(error.message,"error");}});
  bind("copy",()=>copyOutput());break;
 }
 case "sitemap": {
  bind("generateSitemap",()=>{try{setOutput(ToolNestPhase15.buildSitemapXml($("#sitemapUrls").value));}catch(error){message(error.message,"error");}});
  bind("copy",()=>copyOutput());break;
 }
 case "gradient": {
  bind("generateGradient",()=>{try{const gradient=ToolNestPhase15.buildCssGradient({type:$("#gradientType").value,angle:$("#gradientAngle").value,colorA:$("#gradientColorA").value,colorB:$("#gradientColorB").value});$("#gradientPreview").style.background=gradient;setOutput("background: "+gradient+";");}catch(error){message(error.message,"error");}});
  bind("copy",()=>copyOutput());break;
 }

 case "color":
 const sync=()=>{const v=$("#colorPicker").value;$("#hex").value=v;};
 $("#colorPicker").addEventListener("input",sync);
 bind("convert",()=>{let h=$("#hex").value.trim();if(!/^#?(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(h)){message("Enter a valid 3- or 6-digit HEX color.","error");return;}h=h.replace("#","");if(h.length===3)h=h.split("").map(x=>x+x).join("");const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);const R=r/255,G=g/255,B=b/255,max=Math.max(R,G,B),min=Math.min(R,G,B),d=max-min;let hue=0,sat=0,l=(max+min)/2;if(d){sat=d/(1-Math.abs(2*l-1));switch(max){case R:hue=((G-B)/d)%6;break;case G:hue=(B-R)/d+2;break;default:hue=(R-G)/d+4;}hue*=60;if(hue<0)hue+=360;}const result=`HEX: #${h.toUpperCase()}\nRGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${Math.round(hue)}, ${Math.round(sat*100)}%, ${Math.round(l*100)}%)`;setOutput(result);$("#colorSwatch").style.background="#"+h;$("#colorPicker").value="#"+h;});
 bind("copy",()=>copyOutput());
 break;

 case "percentage": {
 bind("copy",()=>copyOutput());
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
 bind("copy",()=>copyOutput());
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
 bind("copy",()=>copyOutput());
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

 case "pdforganizer": { window.ToolNestB2?.init(id); bind("copy",()=>copyOutput()); break; }
 case "textsorter": { window.ToolNestB2?.init(id); bind("copy",()=>copyOutput()); break; }
 case "findreplace": { window.ToolNestB2?.init(id); bind("copy",()=>copyOutput()); break; }
 case "jwtdecoder": { window.ToolNestB2?.init(id); bind("copy",()=>copyOutput()); break; }
 case "xmlformatter": { window.ToolNestB2?.init(id); bind("copy",()=>copyOutput()); break; }
 case "age":
 const today=new Date();
 $("#dateA").max=today.toISOString().slice(0,10);
 $("#dateB").value=today.toISOString().slice(0,10);
 bind("copy",()=>copyOutput()); bind("calculate",()=>{const a=$("#dateA").value,b=$("#dateB").value||today.toISOString().slice(0,10);if(!a){message("Choose a start date.","error");return;}const da=new Date(a+"T00:00:00Z"),db=new Date(b+"T00:00:00Z");if(Number.isNaN(+da)||Number.isNaN(+db)){message("Enter valid dates.","error");return;}if(da>new Date(today.toISOString().slice(0,10)+"T00:00:00Z")){message("Start date cannot be in the future.","error");return;}if(db<da){message("End date must be on or after the start date.","error");return;}const days=Math.round((db-da)/86400000);let years=db.getUTCFullYear()-da.getUTCFullYear(),months=db.getUTCMonth()-da.getUTCMonth(),d=db.getUTCDate()-da.getUTCDate();if(d<0){months--;d+=new Date(Date.UTC(db.getUTCFullYear(),db.getUTCMonth(),0)).getUTCDate();}if(months<0){years--;months+=12;}setOutput(`Difference: ${years} years, ${months} months, ${d} days\nTotal days: ${days.toLocaleString()}`);});
 break;
 }
}
