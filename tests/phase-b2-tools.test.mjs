import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { sortLines, replaceText, decodeJwt, parsePageOrder } from "../js/phase-b2-tools.js";
const root=new URL("../",import.meta.url);
const data=JSON.parse(readFileSync(new URL("../js/tools-data.json",import.meta.url),"utf8"));
const app=readFileSync(new URL("../app.js",import.meta.url),"utf8");
const index=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const sitemap=readFileSync(new URL("../sitemap.xml",import.meta.url),"utf8");
const directory=readFileSync(new URL("../tools/index.html",import.meta.url),"utf8");
const ids=["pdforganizer","textsorter","findreplace","jwtdecoder","xmlformatter"];
const slugs=["pdf-page-organizer","text-sorter","find-replace","jwt-decoder","xml-formatter"];

test("Phase B2 registers five unique tools with synchronized workspace wiring",()=>{
 assert.equal(data.length,54);
 assert.equal(new Set(data.map(x=>x.id)).size,54);
 assert.equal(new Set(data.map(x=>x.slug)).size,54);
 for(let i=0;i<ids.length;i++){
  assert.equal(data.filter(x=>x.id===ids[i]).length,1);
  assert.match(app,new RegExp('case "'+ids[i]+'"'));
  assert.ok(readFileSync(new URL("../tools/"+slugs[i]+"/index.html",import.meta.url),"utf8").includes('rel="canonical"'));
  assert.match(sitemap,new RegExp("/tools/"+slugs[i]+"/"));
  assert.match(directory,new RegExp("/tools/"+slugs[i]+"/"));
 }
 assert.match(index,/js\/phase-b2-tools\.js/);
 assert.match(index,/phase-b2-tools\.css/);
 assert.equal((sitemap.match(/<loc>/g)||[]).length,56);
});

test("Text Sorter handles alphabetical, numeric and blank-line cases",()=>{
 assert.equal(sortLines("Banana\nApple\nOrange","az"),"Apple\nBanana\nOrange");
 assert.equal(sortLines("10\n2\n1","numeric"),"1\n2\n10");
 assert.equal(sortLines("Banana\n\nApple","az",true,true),"Apple\n\nBanana");
 assert.equal(sortLines("Banana\nApple","za"),"Banana\nApple");
});

test("Find & Replace safely handles literal characters, options and counts",()=>{
 assert.deepEqual(replaceText("cat cat CAT","cat","dog"),{output:"dog dog dog",count:3});
 assert.deepEqual(replaceText("cat CAT","cat","dog",{caseSensitive:true}),{output:"dog CAT",count:1});
 assert.deepEqual(replaceText("concatenate cat","cat","dog",{wholeWord:true}),{output:"concatenate dog",count:1});
 assert.deepEqual(replaceText("a.b aXb","a.b","x"),{output:"x aXb",count:1});
 assert.throws(()=>replaceText("abc","","x"),/Enter text to find/);
});

test("JWT decoder decodes header and payload without claiming signature verification",()=>{
 const enc=value=>Buffer.from(JSON.stringify(value)).toString("base64url");
 const token=enc({alg:"HS256",typ:"JWT"})+"."+enc({sub:"user-1",role:"reader"})+".signature";
 const result=decodeJwt(token);
 assert.deepEqual(result.header,{alg:"HS256",typ:"JWT"});
 assert.deepEqual(result.payload,{sub:"user-1",role:"reader"});
 assert.equal(result.signaturePresent,true);
 assert.equal(result.expiration,null);
 assert.throws(()=>decodeJwt("not-a-jwt"),/three non-empty/);
 assert.throws(()=>decodeJwt("%%%."+enc({})+".sig"),/invalid Base64URL/);
});

test("PDF page order must be a complete unique in-range permutation",()=>{
 assert.deepEqual(parsePageOrder("3,1,2",3),[2,0,1]);
 assert.throws(()=>parsePageOrder("1,2",3),/each page number/);
 assert.throws(()=>parsePageOrder("1,1,3",3),/each page number/);
 assert.throws(()=>parsePageOrder("1,2,4",3),/each page number/);
 assert.throws(()=>parsePageOrder("1,x,3",3),/comma-separated/);
});
