
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
{id:"unit",name:"Unit Converter",category:"Calculators",icon:"↔",description:"Convert length, weight and temperature units."},
{id:"age",name:"Age & Date Difference",category:"Calculators",icon:"▦",description:"Calculate age or the days between two dates."},
{id:"counter",name:"Word & Character Counter",category:"Text",icon:"¶",description:"Count words, characters, sentences and paragraphs."},
{id:"duplines",name:"Duplicate Lines Remover",category:"Text",icon:"≡",description:"Remove repeated lines while preserving the first occurrence and original order."}
];

const $ = (s,root=document)=>root.querySelector(s);
const grid=$("#toolGrid"), panel=$("#toolPanel"), workspace=$("#workspace");
let activeCategory="All", activeTool=null;
$("#year").textContent=new Date().getFullYear();

function renderCards(){
 const q=$("#toolSearch").value.trim().toLowerCase();
 const filtered=tools.filter(t=>(activeCategory==="All"||t.category===activeCategory)&&`${t.name} ${t.description} ${t.category}`.toLowerCase().includes(q));
 grid.innerHTML=filtered.map(t=>`<button class="tool-card" type="button" data-tool="${t.id}"><span class="iconbox">${escapeHtml(t.icon)}</span><span class="category mt-3">${escapeHtml(t.category)}</span><h3>${escapeHtml(t.name)}</h3><p>${escapeHtml(t.description)}</p><span class="launch">Open tool →</span></button>`).join("");
 $("#resultsCount").textContent=`Showing ${filtered.length} of ${tools.length} tools`;
 $("#noResults").classList.toggle("hidden",filtered.length!==0);
}

function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

$("#categoryFilters").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;activeCategory=b.dataset.category;document.querySelectorAll(".filter-chip").forEach(x=>x.classList.toggle("active",x===b));renderCards();});
$("#toolSearch").addEventListener("input",renderCards);
grid.addEventListener("click",e=>{const b=e.target.closest("[data-tool]");if(b)openTool(b.dataset.tool);});

function closeTool(){
 workspace.classList.add("hidden");
 document.body.classList.remove("tool-open");
 activeTool=null;
 if(location.hash.startsWith("#tool/")) history.pushState(null,"",location.pathname+location.search);
 window.scrollTo({top:0,behavior:"smooth"});
}

$("#closeWorkspace").addEventListener("click",closeTool);

window.addEventListener("popstate",()=>{
 const id=location.hash.startsWith("#tool/")?location.hash.slice(6):"";
 if(id&&tools.some(t=>t.id===id))openTool(id,false);
 else closeTool();
});

document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("#toolSearch").focus();}});

$("#themeToggle").addEventListener("click",()=>{document.documentElement.classList.toggle("dark");const dark=document.documentElement.classList.contains("dark");$("#themeToggle").textContent=dark?"☀ Light":"☾ Theme";document.querySelector('meta[name="theme-color"]').content=dark?"#020617":"#ffffff";});

renderCards();

const input=(id,label,placeholder="",type="text")=>`<div><label class="field-label" for="${id}">${label}</label><input class="field" id="${id}" type="${type}" placeholder="${placeholder}"></div>`;
const textarea=(id,label,placeholder="Enter text here...")=>`<div><label class="field-label" for="${id}">${label}</label><textarea id="${id}" class="field" placeholder="${placeholder}"></textarea></div>`;
const select=(id,label,options)=>`<div><label class="field-label" for="${id}">${label}</label><select id="${id}" class="field">${options.map(o=>`<option value="${o[0]}">${o[1]}</option>`).join("")}</select></div>`;
const btn=(id,label,primary=true)=>`<button id="${id}" type="button" class="${primary?"btn-primary":"btn-secondary"}">${label}</button>`;
const out=(id="output")=>`<div><label class="field-label">Result</label><div id="${id}" class="output"></div></div>`;
const form=(content)=>`<div class="tool-form">${content}</div>`;

function message(text,type="success"){$("#toolMessage").textContent=text;$("#toolMessage").className=`mt-4 text-sm ${type}`;}
function setOutput(text,id="output"){const el=$("#"+id);if(el)el.textContent=text;}

function copyOutput(id="output"){
 const el=$("#"+id);
 if(!el||!el.textContent){message("There is no result to copy yet.","error");return;}
 navigator.clipboard.writeText(el.textContent).then(()=>message("Copied to clipboard.")).catch(()=>message("Clipboard access was blocked. Select and copy the result manually.","error"));
}

function bind(id,fn){
 const el=$("#"+id);
 if(el)el.addEventListener("click",()=>{try{fn();}catch(e){message(e.message||"Something went wrong.","error");}});
}

function openTool(id,updateHistory=true){
 activeTool=tools.find(t=>t.id===id);
 if(!activeTool)return;
 document.body.classList.add("tool-open");
 $("#workspaceTitle").textContent=activeTool.name;
 $("#workspaceDescription").textContent=activeTool.description;
 $("#toolMessage").textContent="";
 $("#toolMessage").className="mt-4 text-sm";
 workspace.classList.remove("hidden");
 panel.innerHTML=toolMarkup(id);
 wireTool(id);
 if(updateHistory&&location.hash!==`#tool/${id}`)history.pushState({tool:id},"",`#tool/${id}`);
 window.scrollTo({top:0,behavior:"instant"});
 // Automatic focus disabled to avoid unwanted scrolling.
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
 case "diff":return form(`<div class="grid gap-4 md:grid-cols-2">${textarea("leftText","Original text")}${textarea("rightText","New text")}</div><div class="actions">${btn("compare","Compare text")}</div>${out()}`);
 case "markdown":return form(`${textarea("sourceText","Markdown input","# Hello\\n\\nWrite **bold** text, *italic* text, and a [link](https://example.com).")}<div class="actions">${btn("preview","Preview Markdown")}</div><div><label class="field-label">Preview</label><div id="markdownPreview"></div></div>`);
 case "image64":return form(`<div><label class="field-label" for="imageFile">Choose an image</label><input class="field" id="imageFile" type="file" accept="image/*"></div><div id="imagePreview"></div>${out()}<div class="actions">${btn("copy","Copy data URL",false)}</div><p class="muted text-sm">Large images create very long strings. Conversion stays in this browser.</p>`);
 case "qr":return form(`${input("qrText","Text or URL","https://example.com")}<div class="actions">${btn("generate","Generate QR code")}${btn("downloadQR","Download PNG",false)}</div><div id="qrOutput" class="pt-2"></div>`);
 case "meta":return form(`${input("pageTitle","Page title","My useful website")}${textarea("pageDescription","Meta description","A short and helpful description of this page.")}${input("pageUrl","Canonical URL","https://example.com","url")}<div class="actions">${btn("generate","Generate tags")}${btn("copy","Copy tags",false)}</div>${out()}`);
 case "color":return form(`<div class="grid gap-4 sm:grid-cols-2">${input("hex","HEX color","#6366f1")}<div><label class="field-label" for="colorPicker">Pick a color</label><input class="field h-12" id="colorPicker" type="color" value="#6366f1"></div></div><div class="actions">${btn("convert","Convert color")}${btn("copy","Copy values",false)}</div><div id="colorSwatch" class="h-16 rounded-xl border border-slate-200"></div>${out()}`);
 case "forexcalc":return form(`${input("forexAmount","Amount","100","number")}<div class="grid gap-4 sm:grid-cols-2">${select("forexFrom","From currency",[["USD","USD — US Dollar"],["BDT","BDT — Bangladeshi Taka"],["EUR","EUR — Euro"],["GBP","GBP — British Pound"],["JPY","JPY — Japanese Yen"],["AUD","AUD — Australian Dollar"],["CAD","CAD — Canadian Dollar"],["CHF","CHF — Swiss Franc"],["NZD","NZD — New Zealand Dollar"],["INR","INR — Indian Rupee"],["SGD","SGD — Singapore Dollar"],["CNY","CNY — Chinese Yuan"],["PKR","PKR — Pakistani Rupee"],["AED","AED — UAE Dirham"],["SAR","SAR — Saudi Riyal"],["MYR","MYR — Malaysian Ringgit"],["THB","THB — Thai Baht"],["TRY","TRY — Turkish Lira"],["ZAR","ZAR — South African Rand"],["HKD","HKD — Hong Kong Dollar"]])}${select("forexTo","To currency",[["USD","USD — US Dollar"],["BDT","BDT — Bangladeshi Taka"],["EUR","EUR — Euro"],["GBP","GBP — British Pound"],["JPY","JPY — Japanese Yen"],["AUD","AUD — Australian Dollar"],["CAD","CAD — Canadian Dollar"],["CHF","CHF — Swiss Franc"],["NZD","NZD — New Zealand Dollar"],["INR","INR — Indian Rupee"],["SGD","SGD — Singapore Dollar"],["CNY","CNY — Chinese Yuan"],["PKR","PKR — Pakistani Rupee"],["AED","AED — UAE Dirham"],["SAR","SAR — Saudi Riyal"],["MYR","MYR — Malaysian Ringgit"],["THB","THB — Thai Baht"],["TRY","TRY — Turkish Lira"],["ZAR","ZAR — South African Rand"],["HKD","HKD — Hong Kong Dollar"]])}</div><div class="actions">${btn("convertCurrency","Convert currency")}${btn("swapCurrencies","Swap currencies",false)}</div>${out()}<p class="muted text-sm">Uses reference exchange rates retrieved online; rates are generally updated daily and may differ from your broker's executable Forex quotes. For information only, not trading advice. Rate source: <a href="https://www.exchangerate-api.com/docs/free" target="_blank" rel="noopener noreferrer">ExchangeRate-API</a>.</p>`);
 case "unit":return form(`${select("unitType","Conversion type",[["length","Length"],["weight","Weight"],["temperature","Temperature"]])}<div class="grid gap-4 sm:grid-cols-3">${input("unitValue","Value","1","number")}${select("unitFrom","From",[])}${select("unitTo","To",[])}</div><div class="actions">${btn("convert","Convert")}</div>${out()}`);
 case "age":return form(`<div class="grid gap-4 sm:grid-cols-2">${input("dateA","Date of birth / start date","","date")}${input("dateB","End date (blank = today)","","date")}</div><div class="actions">${btn("calculate","Calculate")}</div>${out()}`);
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
 case "case":
 bind("upper",()=>setOutput(src().toUpperCase()));
 bind("lower",()=>setOutput(src().toLowerCase()));
 bind("sentence",()=>setOutput(src().toLowerCase().replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu,m=>m.toUpperCase())));
 bind("title",()=>setOutput(src().toLowerCase().replace(/\b\p{L}/gu,m=>m.toUpperCase())));
 bind("copy",()=>copyOutput());
 $("#sourceText").addEventListener("input",()=>{const s=src();$("#stats").textContent=`${s.trim()?s.trim().split(/\s+/).length:0} words · ${s.length} characters · ${s.length?s.split(/\n/).length:0} lines`;});
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
 const count=()=>{const s=src(),trim=s.trim();const summary=`Words: ${trim?trim.split(/\s+/).length:0}\nCharacters (with spaces): ${s.length}\nCharacters (without spaces): ${s.replace(/\s/g,"").length}\nSentences: ${(s.match(/[.!?]+(?=\s|$)/g)||[]).length}\nParagraphs: ${trim?trim.split(/\n\s*\n/).length:0}`;setOutput(summary);$("#stats").textContent=summary.replace(/\n/g," · ");};
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
 bind("compare",compareText);
 $("#leftText").addEventListener("input",compareText);
 $("#rightText").addEventListener("input",compareText);
 break;

 case "markdown":
 const renderMarkdown=()=>{const s=src();let safe=escapeHtml(s);safe=safe.replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h2>$1</h2>").replace(/^# (.*)$/gm,"<h1>$1</h1>").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/\x60([^\x60]+)\x60/g,"<code>$1</code>").replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>').replace(/\n/g,"<br>");$("#markdownPreview").innerHTML=safe;};
 bind("preview",renderMarkdown);
 $("#sourceText").addEventListener("input",renderMarkdown);
 renderMarkdown();
 break;

 case "image64":
 $("#imageFile").addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;if(!f.type.startsWith("image/")){message("Please choose an image file.","error");return;}const r=new FileReader();r.onload=()=>{setOutput(String(r.result));$("#imagePreview").innerHTML=`<img class="mb-4 max-h-64 rounded-xl border border-slate-200 object-contain" alt="Selected image preview" src="${r.result}">`;message("Image converted.");};r.onerror=()=>message("Could not read this image.","error");r.readAsDataURL(f);});
 bind("copy",()=>copyOutput());
 break;

 case "qr":
 let qr=null;
 bind("generate",()=>{if(!$("#qrText").value.trim()){message("Enter text or a URL first.","error");return;}if(typeof QRious==="undefined"){message("QR library did not load. Check your internet connection.","error");return;}$("#qrOutput").innerHTML='<canvas id="qrCanvas" aria-label="Generated QR code"></canvas>';qr=new QRious({element:$("#qrCanvas"),value:$("#qrText").value.trim(),size:240,level:"H",background:"white",foreground:"black"});message("QR code generated.");});
 bind("downloadQR",()=>{const c=$("#qrCanvas");if(!c){message("Generate a QR code first.","error");return;}const a=document.createElement("a");a.href=c.toDataURL("image/png");a.download="toolnest-qr.png";a.click();});
 break;

 case "meta":
 bind("generate",()=>{const title=$("#pageTitle").value.trim(),desc=$("#pageDescription").value.trim(),url=$("#pageUrl").value.trim();if(!title||!desc){message("Enter both a title and description.","error");return;}const safe=s=>s.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");setOutput(`<title>${safe(title)}</title>\n<meta name="description" content="${safe(desc)}">`+(url?`\n<link rel="canonical" href="${safe(url)}">`:""));});
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
 bind("swapCurrencies",()=>{
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
 const fill=()=>{const type=$("#unitType").value,opts=units[type];$("#unitFrom").innerHTML=opts.map(u=>`<option value="${u[0]}">${u[1]}</option>`).join("");$("#unitTo").innerHTML=opts.map(u=>`<option value="${u[0]}">${u[1]}</option>`).join("");if(opts.length>1)$("#unitTo").selectedIndex=1;};
 $("#unitType").addEventListener("change",fill);
 fill();
 bind("convert",()=>{const type=$("#unitType").value,v=Number($("#unitValue").value),from=$("#unitFrom").value,to=$("#unitTo").value;if(!Number.isFinite(v)){message("Enter a valid number.","error");return;}let result;if(type==="temperature"){let c=from==="C"?v:from==="F"?(v-32)*5/9:v-273.15;result=to==="C"?c:to==="F"?c*9/5+32:c+273.15;}else{const us=units[type],a=us.find(x=>x[0]===from),b=us.find(x=>x[0]===to);result=v*a[2]/b[2];}setOutput(`${v} ${from} = ${Number(result.toPrecision(10))} ${to}`);});
 break;

 case "age":
 const today=new Date();
 $("#dateA").max=today.toISOString().slice(0,10);
 $("#dateB").value=today.toISOString().slice(0,10);
 bind("calculate",()=>{const a=$("#dateA").value,b=$("#dateB").value||today.toISOString().slice(0,10);if(!a){message("Choose a start date.","error");return;}const da=new Date(a+"T00:00:00Z"),db=new Date(b+"T00:00:00Z");if(Number.isNaN(+da)||Number.isNaN(+db)){message("Enter valid dates.","error");return;}if(db<da){message("End date must be on or after the start date.","error");return;}const days=Math.round((db-da)/86400000);let years=db.getUTCFullYear()-da.getUTCFullYear(),months=db.getUTCMonth()-da.getUTCMonth(),d=db.getUTCDate()-da.getUTCDate();if(d<0){months--;d+=new Date(Date.UTC(db.getUTCFullYear(),db.getUTCMonth(),0)).getUTCDate();}if(months<0){years--;months+=12;}setOutput(`Difference: ${years} years, ${months} months, ${d} days\nTotal days: ${days.toLocaleString()}`);});
 break;
 }
}
