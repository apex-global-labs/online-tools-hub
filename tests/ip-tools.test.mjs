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
 for(const value of ["256.1.1.1","1.2.3","01.2.3.4","example.com","1.1.1.1/path","2001:::1","2001:::",""])assert.equal(ip.isValidIpAddress(value),false,value);
});
test("classifies common private and special-use IPv4 ranges",()=>{
 for(const value of ["10.0.0.1","172.16.0.1","192.168.1.1","127.0.0.1","169.254.0.1"])assert.equal(ip.classifyIpAddress(value),"Private / special-use",value);
 assert.equal(ip.classifyIpAddress("8.8.8.8"),"Public IPv4");
});
test("classifies IPv4 special-use blocks by their exact CIDR boundaries",()=>{
 for(const value of ["192.0.2.1","192.88.99.1","192.175.48.1","198.18.0.1","198.51.100.1","203.0.113.1","224.0.0.1","240.0.0.1"])assert.equal(ip.classifyIpAddress(value),"Private / special-use",value);
 for(const value of ["192.2.1.1","192.88.98.1","198.20.0.1","203.0.112.1"])assert.equal(ip.classifyIpAddress(value),"Public IPv4",value);
});
test("classifies IPv6 private and special-use examples",()=>{
 for(const value of ["::1","fc00::1","fd12::1","fe80::1","ff02::1","2001:db8::1","100::1"])assert.equal(ip.classifyIpAddress(value),"Private / special-use",value);
 assert.equal(ip.classifyIpAddress("2001:4860:4860::8888"),"Public IPv6");
});
test("IPv4-mapped IPv6 inherits the embedded IPv4 special-use classification",()=>{
 assert.equal(ip.classifyIpAddress("::ffff:192.0.2.1"),"Private / special-use");
 assert.equal(ip.classifyIpAddress("::ffff:8.8.8.8"),"Public IPv6");
 assert.equal(ip.classifyIpAddress("::ffff:c000:0201"),"Private / special-use");
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
