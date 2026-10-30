import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const require=createRequire(import.meta.url);
const ip=require("../js/ip-tools.js");
const data=JSON.parse(readFileSync(new URL("../js/tools-data.json",import.meta.url),"utf8"));
const app=readFileSync(new URL("../app.js",import.meta.url),"utf8");

test("validates IPv4 and IPv6 addresses",()=>{
 for(const value of ["8.8.8.8","1.1.1.1","2001:4860:4860::8888","::1","2001:db8::1","::ffff:192.0.2.1"])assert.equal(ip.isValidIpAddress(value),true,value);
});
test("rejects malformed IPs and hostnames",()=>{
 for(const value of ["256.1.1.1","1.2.3","01.2.3.4","example.com","1.1.1.1/path","2001:::1",""])assert.equal(ip.isValidIpAddress(value),false,value);
});
test("classifies common private and special-use IPv4 ranges",()=>{
 for(const value of ["10.0.0.1","172.16.0.1","192.168.1.1","127.0.0.1","169.254.0.1"])assert.equal(ip.classifyIpAddress(value),"Private / special-use",value);
 assert.equal(ip.classifyIpAddress("8.8.8.8"),"IPv4");
});
test("classifies IPv6 private and special-use examples",()=>{
 for(const value of ["::1","fc00::1","fd12::1","fe80::1"])assert.equal(ip.classifyIpAddress(value),"Private / special-use",value);
 assert.equal(ip.classifyIpAddress("2001:4860:4860::8888"),"IPv6");
});
test("registers exactly one IP tools catalog record with privacy notes",()=>{
 const records=data.filter(item=>item.id==="iptools"||item.slug==="ip-tools");
 assert.equal(records.length,1);
 assert.equal(records[0].category,"Utilities");
 assert.equal(records[0].seo.faqs.length,3);
 assert.match(records[0].seo.description,/approximate/i);
});
test("connects IP lookup UI, API, and privacy notice",()=>{
 assert.match(app,/case "iptools"/);
 assert.match(app,/https:\/\/ipwho\.is\//);
 assert.match(app,/ToolNest does not route it through its own server/);
 assert.match(app,/ToolNestIP\.isValidIpAddress/);
});
