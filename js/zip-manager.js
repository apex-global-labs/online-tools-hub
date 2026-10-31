(function(root){
"use strict";
const MAX_ZIP_BYTES=50*1024*1024,MAX_FILES=100,MAX_FILE_BYTES=25*1024*1024,MAX_TOTAL_BYTES=50*1024*1024,MAX_ENTRIES=1000;
function safePath(path){
 const value=String(path||"").replace(/\\/g,"/");
 if(!value||value.startsWith("/")||/^[a-zA-Z]:/.test(value)||value.split("/").some(part=>part===".."||part==="."))throw new Error("The archive contains an unsafe file path.");
 if(/[\u0000-\u001f]/.test(value))throw new Error("The archive contains an invalid file name.");
 return value;
}
function validateFiles(files){
 if(!files.length)throw new Error("Choose at least one file.");
 if(files.length>MAX_FILES)throw new Error("Choose no more than 100 files per ZIP.");
 let total=0;
 for(const file of files){if(file.size>MAX_FILE_BYTES)throw new Error(file.name+" exceeds the 25 MB per-file limit.");total+=file.size;}
 if(total>MAX_TOTAL_BYTES)throw new Error("The selected files exceed the 100 MB total limit.");
 return {count:files.length,totalBytes:total};
}
function formatBytes(n){if(n<1024)return n+" B";const u=["KB","MB","GB"];let v=n/1024,i=0;while(v>=1024&&i<u.length-1){v/=1024;i++;}return v.toFixed(v>=10?1:2)+" "+u[i];}
let zipPromise;
function loadZip(){if(root.JSZip)return Promise.resolve(root.JSZip);if(zipPromise)return zipPromise;zipPromise=new Promise((resolve,reject)=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";s.async=true;s.onload=()=>root.JSZip?resolve(root.JSZip):reject(new Error("ZIP library failed to initialize."));s.onerror=()=>{zipPromise=null;reject(new Error("Could not load ZIP support. Check your connection and retry."));};document.head.appendChild(s);});return zipPromise;}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);}
function init(){
 const $=id=>document.getElementById(id),status=$("zipStatus"),files=$("zipFiles"),zipBtn=$("zipCreate"),archive=$("zipArchive"),extractBtn=$("zipExtract"),list=$("zipEntryList");
 if(!status||!files||!zipBtn||!archive||!extractBtn||!list)return;
 const say=(s,error=false)=>{status.textContent=s;status.classList.toggle("is-error",error);};
 files.addEventListener("change",()=>{try{const info=validateFiles([...files.files]);say(info.count+" file(s) selected · "+formatBytes(info.totalBytes));}catch(e){say(e.message,true);}});
 zipBtn.addEventListener("click",async()=>{try{const selected=[...files.files];const info=validateFiles(selected);zipBtn.disabled=true;say("Loading ZIP support…");const JSZip=await loadZip(),zip=new JSZip();for(const file of selected){const name=safePath(file.webkitRelativePath||file.name);if(name.endsWith("/"))continue;zip.file(name,file);}say("Creating archive…");const blob=await zip.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:6}});if(blob.size>MAX_ZIP_BYTES)throw new Error("The generated ZIP exceeds the 50 MB download limit.");download(blob,"toolnest-archive.zip");say("ZIP created: "+formatBytes(blob.size)+" from "+info.count+" file(s).");}catch(e){say(e.message||"Could not create the ZIP archive.",true);}finally{zipBtn.disabled=false;}});
 archive.addEventListener("change",()=>{list.replaceChildren();extractBtn.disabled=true;$("zipDownloadSelected").disabled=true;window.__toolNestCurrentZip=null;const f=archive.files?.[0];if(!f)return;if(f.size>MAX_ZIP_BYTES){say("ZIP file exceeds the 50 MB limit.",true);archive.value="";return;}extractBtn.disabled=false;say("ZIP selected. Choose Extract to inspect its contents.");});
 extractBtn.addEventListener("click",async()=>{const f=archive.files?.[0];if(!f){say("Choose a ZIP file first.",true);return;}extractBtn.disabled=true;list.replaceChildren();try{const JSZip=await loadZip(),zip=await JSZip.loadAsync(f);window.__toolNestCurrentZip=zip;const entries=Object.values(zip.files).filter(x=>!x.dir);if(entries.length>MAX_ENTRIES)throw new Error("Archive contains more than 1,000 files.");let total=0;for(const entry of entries){safePath(entry.name);const size=entry._data?.uncompressedSize;if(Number.isFinite(size)){if(size>MAX_FILE_BYTES)throw new Error("An archive entry exceeds the 25 MB per-file extraction limit.");total+=size;if(total>MAX_TOTAL_BYTES)throw new Error("Expanded archive exceeds the 100 MB extraction limit.");}}
 if(!entries.length)throw new Error("The ZIP archive contains no files.");const fragment=document.createDocumentFragment();for(const entry of entries){const row=document.createElement("label");row.className="zip-entry";const check=document.createElement("input");check.type="checkbox";check.checked=true;check.dataset.entry=entry.name;const name=document.createElement("span");name.textContent=entry.name;const size=document.createElement("small");size.textContent=Number.isFinite(entry._data?.uncompressedSize)?formatBytes(entry._data.uncompressedSize):"File";row.append(check,name,size);fragment.append(row);}list.append(fragment);list.hidden=false;$("zipDownloadSelected").disabled=false;say(entries.length+" file(s) found · estimated expanded size "+formatBytes(total)+". Select files and download.");}catch(e){say(e.message||"Could not read this ZIP file.",true);}finally{extractBtn.disabled=false;}});
 $("zipDownloadSelected").addEventListener("click",async()=>{try{const checks=[...list.querySelectorAll("input:checked")];if(!checks.length)throw new Error("Select at least one file to extract.");const JSZip=await loadZip(),out=new JSZip();for(const c of checks){const entry=zipEntry(c.dataset.entry);if(!entry)throw new Error("An archive entry could not be found.");const blob=await entry.async("blob");out.file(c.dataset.entry,blob);}const blob=await out.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:4}});if(blob.size>MAX_ZIP_BYTES)throw new Error("The extracted archive exceeds the 50 MB download limit. Select fewer or smaller files.");download(blob,"toolnest-extracted-files.zip");say(checks.length+" file(s) extracted into a new ZIP.");}catch(e){say(e.message||"Extraction failed.",true);}});
 function zipEntry(name){return window.__toolNestCurrentZip?.file(name)||null;}
 const clear=$("zipClear");clear.addEventListener("click",()=>{files.value="";archive.value="";list.replaceChildren();list.hidden=true;extractBtn.disabled=true;$("zipDownloadSelected").disabled=true;window.__toolNestCurrentZip=null;say("Ready. Choose files to create a ZIP or select an archive to extract.");});
}
const api={safePath,validateFiles,formatBytes,init,limits:{MAX_ZIP_BYTES,MAX_FILES,MAX_FILE_BYTES,MAX_TOTAL_BYTES,MAX_ENTRIES}};
root.ToolNestZip=api;if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof globalThis!=="undefined"?globalThis:this);
