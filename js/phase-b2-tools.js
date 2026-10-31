const MAX_PDF_BYTES=30*1024*1024,MAX_PDF_PAGES=300;
export function sortLines(text,mode="az",ignoreCase=true,keepBlank=true){
 const lines=String(text).replace(/\r\n?/g,"\n").split("\n");
 const blanks=keepBlank?lines.filter(x=>!x.trim()):[];
 const values=lines.filter(x=>x.trim());
 const collator=new Intl.Collator(undefined,{numeric:mode==="numeric"||mode==="numeric-desc",sensitivity:ignoreCase?"base":"variant"});
 if(mode==="za"||mode==="numeric-desc")values.sort((a,b)=>-collator.compare(a,b));
 else values.sort((a,b)=>collator.compare(a,b));
 if(keepBlank){let i=0;return lines.map(x=>x.trim()?values.shift():x).join("\n");}
 return values.join("\n");
}
export function replaceText(text,find,replacement,{caseSensitive=false,wholeWord=false,all=true}={}){
 if(!find)throw new Error("Enter text to find.");
 const escaped=find.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
 const pattern=wholeWord?"(?<![\\p{L}\\p{N}_])"+escaped+"(?![\\p{L}\\p{N}_])":escaped;
 const re=new RegExp(pattern,caseSensitive?"gu":"giu");
 let count=0;const output=String(text).replace(re,match=>{count++;return all?replacement:count===1?replacement:match;});
 return {output,count};
}
export function decodeJwt(token){
 const parts=String(token).trim().split(".");
 if(parts.length!==3||!parts[0]||!parts[1])throw new Error("A JWT must contain three non-empty dot-separated parts.");
 const decode=part=>{let raw=part.replace(/-/g,"+").replace(/_/g,"/");raw+="=".repeat((4-raw.length%4)%4);let binary;try{binary=atob(raw);}catch{throw new Error("The JWT contains invalid Base64URL data.");}const bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));let text;try{text=new TextDecoder("utf-8",{fatal:true}).decode(bytes);}catch{throw new Error("The JWT payload is not valid UTF-8.");}try{return JSON.parse(text);}catch{throw new Error("The JWT header or payload is not valid JSON.");}};
 const header=decode(parts[0]),payload=decode(parts[1]);
 return {header,payload,signaturePresent:parts[2].length>0,expiration:Number.isFinite(payload.exp)?{timestamp:payload.exp,date:new Date(payload.exp*1000).toISOString(),expired:payload.exp*1000<Date.now()}:null};
}
export function formatXml(source){
 const parser=new DOMParser(),doc=parser.parseFromString(String(source),"application/xml");
 if(doc.querySelector("parsererror"))throw new Error("Invalid XML. Check the tags, nesting and attributes.");
 const xml=new XMLSerializer().serializeToString(doc).replace(/>\s*</g,"><").trim();
 const tokens=xml.match(/<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<!\[CDATA\[[\s\S]*?\]\]>|<[^>]+>|[^<]+/g)||[];
 let depth=0,out=[];
 for(const token of tokens){if(!token.trim())continue;
  if(/^<\//.test(token))depth=Math.max(0,depth-1);
  out.push("  ".repeat(depth)+token.trim());
  if(/^<(?![!?/])[^>]*[^/]?>$/.test(token)&&!/^<[^>]+\/>$/.test(token)&&!/<\//.test(token))depth++;
 }
 return out.join("\n");
}
function loadPdfLib(){
 if(window.PDFLib?.PDFDocument)return Promise.resolve(window.PDFLib);
 return new Promise((resolve,reject)=>{const script=document.createElement("script");script.src="https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js";script.async=true;script.onload=()=>window.PDFLib?.PDFDocument?resolve(window.PDFLib):reject(new Error("PDF editing engine did not initialize."));script.onerror=()=>reject(new Error("Could not load the PDF engine. Check your connection and retry."));document.head.appendChild(script);});
}
function downloadBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);}
export function parsePageOrder(raw,count){
 const values=String(raw).split(",").map(x=>x.trim());
 if(values.some(x=>!/^\d+$/.test(x)))throw new Error("Enter a comma-separated list containing every page number once (example: 3,1,2).");
 const nums=values.map(Number);
 if(nums.length!==count||new Set(nums).size!==count||nums.some(n=>n<1||n>count))throw new Error("The order must contain each page number from 1 to "+count+" exactly once.");
 return nums.map(n=>n-1);
}
function initPdfOrganizer(){
 const file=document.getElementById("pdfOrganizeFile"),order=document.getElementById("pdfPageOrder"),rotation=document.getElementById("pdfRotateAll"),status=document.getElementById("pdfOrganizeStatus"),run=document.getElementById("organizePdf"),clear=document.getElementById("clearPdfOrganizer");
 if(!file||!order||!status||!run||!clear)return;
 let count=0,sourceName="document.pdf";
 const say=(s,error=false)=>{status.textContent=s;status.classList.toggle("is-error",error);};
 file.addEventListener("change",async()=>{count=0;const f=file.files?.[0];if(!f){say("Choose a PDF file.");return;}if(f.size>MAX_PDF_BYTES){say("PDF must be 30 MB or smaller.",true);return;}if(f.type!=="application/pdf"&&!f.name.toLowerCase().endsWith(".pdf")){say("Choose a valid PDF file.",true);return;}run.disabled=true;say("Reading PDF pages…");try{const lib=await loadPdfLib(),doc=await lib.PDFDocument.load(await f.arrayBuffer(),{ignoreEncryption:false});count=doc.getPageCount();if(!count||count>MAX_PDF_PAGES)throw new Error("PDF must contain 1–300 pages.");order.value=Array.from({length:count},(_,i)=>i+1).join(",");sourceName=f.name.replace(/\\.pdf$/i,"")||"document";say(count+" page(s) ready. Edit the comma-separated order to rearrange pages.");}catch(e){count=0;say(e.message||"Could not read this PDF.",true);}finally{run.disabled=false;}});
 run.addEventListener("click",async()=>{const f=file.files?.[0];if(!f||!count){say("Choose a valid PDF first.",true);return;}run.disabled=true;try{const indices=parsePageOrder(order.value,count),angle=Number(rotation.value);if(![0,90,180,270].includes(angle))throw new Error("Choose a rotation of 0°, 90°, 180° or 270°.");const lib=await loadPdfLib(),src=await lib.PDFDocument.load(await f.arrayBuffer()),dest=await lib.PDFDocument.create(),pages=await dest.copyPages(src,indices);pages.forEach(page=>{if(angle)page.setRotation(lib.degrees((page.getRotation().angle+angle)%360));dest.addPage(page);});const bytes=await dest.save(),blob=new Blob([bytes],{type:"application/pdf"});downloadBlob(blob,sourceName+"-organized.pdf");say("PDF created successfully. Download started.");}catch(e){say(e.message||"Could not organize this PDF.",true);}finally{run.disabled=false;}});
 clear.addEventListener("click",()=>{file.value="";order.value="";rotation.value="0";count=0;say("Ready. Choose a PDF file.");});
}
export function init(id){
 const $=id=>document.getElementById(id),say=(s,error=false)=>{const el=$("b2Status");if(el){el.textContent=s;el.classList.toggle("is-error",error);}};
 if(id==="pdforganizer"){initPdfOrganizer();return;}
 if(id==="textsorter"){
  $("sortText")?.addEventListener("click",()=>{try{const text=$("b2Input").value;if(!text.trim())throw new Error("Enter some lines to sort.");$("output").textContent=sortLines(text,$("sortMode").value,$("sortIgnoreCase").checked,$("sortKeepBlank").checked);say("Lines sorted successfully.");}catch(e){say(e.message,true);}});
 }else if(id==="findreplace"){
  $("replaceText")?.addEventListener("click",()=>{try{const source=$("b2Input").value;if(!source)throw new Error("Enter source text.");const result=replaceText(source,$("findValue").value,$("replaceValue").value,{caseSensitive:$("replaceCase").checked,wholeWord:$("replaceWhole").checked,all:$("replaceAll").checked});$("output").textContent=result.output;say(result.count+" replacement(s) made.");}catch(e){say(e.message,true);}});
 }else if(id==="jwtdecoder"){
  $("decodeJwt")?.addEventListener("click",()=>{try{const result=decodeJwt($("b2Input").value);let text="HEADER\\n"+JSON.stringify(result.header,null,2)+"\\n\\nPAYLOAD\\n"+JSON.stringify(result.payload,null,2);if(result.expiration)text+="\\n\\nEXPIRATION\\n"+result.expiration.date+" — "+(result.expiration.expired?"Expired":"Not expired");else text+="\\n\\nNo numeric exp claim was found.";text+="\\n\\nSignature: present but NOT verified. This tool only decodes the token locally."; $("output").textContent=text;say("JWT decoded locally. Signature was not verified.");}catch(e){$("output").textContent="";say(e.message,true);}});
 }else if(id==="xmlformatter"){
  $("formatXml")?.addEventListener("click",()=>{try{const source=$("b2Input").value;if(!source.trim())throw new Error("Paste XML to format.");$("output").textContent=formatXml(source);say("XML validated and formatted.");}catch(e){$("output").textContent="";say(e.message,true);}});
 }
}
if(typeof window!=="undefined")window.ToolNestB2={init};
