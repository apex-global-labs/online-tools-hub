import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import Zip from "../js/zip-manager.js";
import Favicon from "../js/favicon-generator.js";
const app=readFileSync(new URL("../app.js",import.meta.url),"utf8");
const index=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const css=readFileSync(new URL("../css/phase-b1-file-tools.css",import.meta.url),"utf8");
const data=JSON.parse(readFileSync(new URL("../js/tools-data.json",import.meta.url),"utf8"));
const sitemap=readFileSync(new URL("../sitemap.xml",import.meta.url),"utf8");
const directory=readFileSync(new URL("../tools/index.html",import.meta.url),"utf8");
const zipGuide=readFileSync(new URL("../tools/zip-file-manager/index.html",import.meta.url),"utf8");
const faviconGuide=readFileSync(new URL("../tools/favicon-generator/index.html",import.meta.url),"utf8");

test("Phase B1 registers exactly two unique tools",()=>{
 assert.equal(data.length,49);
 assert.equal(new Set(data.map(x=>x.id)).size,49);
 assert.equal(new Set(data.map(x=>x.slug)).size,49);
 for(const id of ["zipmanager","favicongenerator"])assert.equal(data.filter(x=>x.id===id).length,1);
});
test("both Phase B1 tools are wired into the workspace and loaded",()=>{
 for(const id of ["zipmanager","favicongenerator"])assert.match(app,new RegExp('case "'+id+'"'));
 assert.match(index,/js\/zip-manager\.js/);
 assert.match(index,/js\/favicon-generator\.js/);
 assert.match(index,/phase-b1-file-tools\.css/);
});
test("ZIP path validation rejects traversal and absolute paths",()=>{
 assert.equal(Zip.safePath("docs/readme.txt"),"docs/readme.txt");
 for(const path of ["../escape.txt","folder/../../escape.txt","/absolute.txt","C:\\temp\\file.txt","folder\\..\\escape.txt"])assert.throws(()=>Zip.safePath(path));
});
test("ZIP input validation enforces file count and byte limits",()=>{
 assert.deepEqual(Zip.validateFiles([{name:"a.txt",size:12},{name:"b.txt",size:20}]),{count:2,totalBytes:32});
 assert.throws(()=>Zip.validateFiles([]),/at least one file/i);
 assert.throws(()=>Zip.validateFiles([{name:"large.bin",size:Zip.limits.MAX_FILE_BYTES+1}]),/25 MB/i);
 assert.throws(()=>Zip.validateFiles(Array.from({length:101},(_,i)=>({name:i+".txt",size:1}))),/100 files/i);
});
test("favicon generator accepts only supported image formats and size limits",()=>{
 assert.equal(Favicon.validateImage({type:"image/png",size:100}).type,"image/png");
 assert.throws(()=>Favicon.validateImage({type:"image/svg+xml",size:100}),/PNG, JPEG or WebP/i);
 assert.throws(()=>Favicon.validateImage({type:"image/png",size:10*1024*1024+1}),/10 MB/i);
 assert.throws(()=>Favicon.validateImage(null),/Choose an image/i);
});
test("ICO output has a valid single-entry header and embedded PNG payload",async()=>{
 const png=new Uint8Array([137,80,78,71,13,10,26,10]);
 const blob=Favicon.makeIco(png,48),bytes=new Uint8Array(await blob.arrayBuffer());
 assert.equal(blob.type,"image/x-icon");
 assert.equal(bytes[0],0);assert.equal(bytes[1],0);assert.equal(bytes[2],1);assert.equal(bytes[3],0);
 assert.equal(bytes[4],1);assert.equal(bytes[5],0);assert.equal(bytes[6],48);assert.equal(bytes[7],48);
 assert.equal(new DataView(bytes.buffer).getUint32(14,true),png.length);
 assert.deepEqual([...bytes.slice(22)],[...png]);
});
test("Phase B1 SEO guides, directory and sitemap are synchronized",()=>{
 for(const slug of ["zip-file-manager","favicon-generator"]){
  assert.match(sitemap,new RegExp("/tools/"+slug+"/"));
  assert.match(directory,new RegExp("/tools/"+slug+"/"));
  assert.ok(readFileSync(new URL("../tools/"+slug+"/index.html",import.meta.url),"utf8").includes("rel=\"canonical\""));
 }
 assert.equal((sitemap.match(/<loc>/g)||[]).length,51);
 assert.match(zipGuide,/ZIP File Manager/);
 assert.match(faviconGuide,/Favicon Generator/);
 assert.ok(css.includes(".zip-manager")&&css.includes(".favicon-tool"));
});
