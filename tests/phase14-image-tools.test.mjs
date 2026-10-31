import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const app=readFileSync(new URL("../app.js",import.meta.url),"utf8");
const metadata=JSON.parse(readFileSync(new URL("../js/tools-data.json",import.meta.url),"utf8"));
const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
test("Phase 14 adds three unique image tools with complete SEO metadata",()=>{
 for(const id of ["imagecrop","imageformat","base64image"]){
  assert.ok(metadata.some(tool=>tool.id===id),id+" metadata exists");
  const tool=metadata.find(item=>item.id===id);
  assert.ok(tool.slug&&tool.seo.description.length>=80);
  assert.equal(tool.seo.steps.length,3);assert.equal(tool.seo.features.length,3);assert.equal(tool.seo.faqs.length,3);
  assert.match(app,new RegExp('id:"'+id+'"'));
  assert.ok(app.includes('case "'+id+'":'),id+" markup and wiring exist");
 }
 assert.equal(metadata.length, 55);
});
test("Image Cropper validates crop bounds and exports only browser-supported formats",()=>{
 assert.match(app,/crop rectangle must fit inside the source image/);
 assert.match(app,/w>4096\|\|h>4096/);
 assert.match(app,/blob\.type!==format/);
 assert.match(app,/createObjectURL\(file\)/);
});
test("Image Format Converter handles JPEG transparency and verifies export MIME",()=>{
 assert.match(app,/targetFormat/);
 assert.match(app,/ctx\.fillStyle="#fff"/);
 assert.match(app,/blob\.type!==format/);
 assert.match(app,/canvas\.toBlob/);
 assert.match(app,/formatSourceUrl=null;\$\("#formatFile"\)\.value=""/);
});
test("Base64 to Image checks encoded size and actual image signatures",()=>{
 assert.match(app,/15\*1024\*1024/);
 assert.match(app,/10\*1024\*1024/);
 assert.match(app,/0x89,0x50,0x4e,0x47/);
 assert.match(app,/0xff,0xd8,0xff/);
 assert.match(app,/0x57&&bytes\[9\]===0x45/);
 assert.match(app,/0x47,0x49,0x46,0x38/);
 assert.ok(app.includes('decodedDataUrl="data:"+mime+";base64,"'));
 assert.match(app,/Decoded image exceeds the safe 40-megapixel limit/);
});
test("Phase 14 assets are linked and browser processing remains local",()=>{
 assert.match(html,/phase14-image-tools\.css/);
 assert.match(app,/Images are processed locally/);
});
