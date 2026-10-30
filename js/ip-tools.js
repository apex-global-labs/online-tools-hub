/* ToolNest IP Tools — input validation and display helpers. No IP data is stored here. */
(function(root){
 "use strict";
 function isIPv4(value){
  const parts=value.split(".");
  return parts.length===4&&parts.every(part=>/^\\d{1,3}$/.test(part)&&Number(part)>=0&&Number(part)<=255&&(part==="0"||!part.startsWith("0")));
 }
 function isIPv6(value){
  if(!value||value.includes("%")||!value.includes(":")||value.includes(":::"))return false;
  if((value.match(/::/g)||[]).length>1)return false;
  let source=value;
  if(source.includes(".")){
   const lastColon=source.lastIndexOf(":");
   const tail=source.slice(lastColon+1);
   if(!isIPv4(tail))return false;
   const p=tail.split(".").map(Number);
   source=source.slice(0,lastColon)+":"+((p[0]<<8)|p[1]).toString(16)+":"+((p[2]<<8)|p[3]).toString(16);
  }
  const compressed=source.includes("::");
  const parts=source.split(":").filter(Boolean);
  if(parts.some(part=>!/^[0-9a-fA-F]{1,4}$/.test(part)))return false;
  return compressed?parts.length<8:parts.length===8;
 }
 function isValidIpAddress(value){
  if(typeof value!=="string"||value.trim()!==value||!value)return false;
  return isIPv4(value)||isIPv6(value);
 }
 function ipv4Number(value){
  return value.split(".").reduce((n,part)=>(n*256)+Number(part),0);
 }
 const specialIPv4Ranges=[
  ["0.0.0.0",8],["10.0.0.0",8],["100.64.0.0",10],["127.0.0.0",8],
  ["169.254.0.0",16],["172.16.0.0",12],["192.0.0.0",24],
  ["192.0.2.0",24],["192.88.99.0",24],["192.168.0.0",16],
  ["192.175.48.0",24],["198.18.0.0",15],["198.51.100.0",24],
  ["203.0.113.0",24],["224.0.0.0",4],["240.0.0.0",4]
 ];
 function isSpecialIPv4(value){
  const address=ipv4Number(value);
  return specialIPv4Ranges.some(([base,prefix])=>{
   const divisor=2**(32-prefix);
   return Math.floor(address/divisor)===Math.floor(ipv4Number(base)/divisor);
  });
 }
 function ipv6Groups(value){
  let source=value.toLowerCase();
  if(source.includes(".")){
   const lastColon=source.lastIndexOf(":");
   const tail=source.slice(lastColon+1);
   if(!isIPv4(tail))return null;
   const p=tail.split(".").map(Number);
   source=source.slice(0,lastColon)+":"+((p[0]<<8)|p[1]).toString(16)+":"+((p[2]<<8)|p[3]).toString(16);
  }
  const halves=source.split("::");
  if(halves.length>2)return null;
  const left=halves[0]?halves[0].split(":"):[];
  const right=halves.length===2&&halves[1]?halves[1].split(":"):[];
  const missing=8-left.length-right.length;
  if(halves.length===2&&missing<1)return null;
  if(halves.length===1&&missing!==0)return null;
  const parts=halves.length===2?[...left,...Array(missing).fill("0"),...right]:left;
  if(parts.length!==8||parts.some(part=>!/^[0-9a-f]{1,4}$/.test(part)))return null;
  return parts.map(part=>parseInt(part,16));
 }
 function classifyIpAddress(value){
  if(!isValidIpAddress(value))return "Invalid";
  if(!value.includes(":"))return isSpecialIPv4(value)?"Private / special-use":"Public IPv4";
  const groups=ipv6Groups(value);
  if(!groups)return "Invalid";
  if(groups.slice(0,5).every(group=>group===0)&&groups[5]===0xffff){
   const mapped=[groups[6]>>8,groups[6]&255,groups[7]>>8,groups[7]&255].join(".");
   return isSpecialIPv4(mapped)?"Private / special-use":"Public IPv6";
  }
  const first=groups[0];
  if(groups.every(group=>group===0)||groups.slice(0,7).every(group=>group===0)&&groups[7]===1)return "Private / special-use";
  if((first&0xfe00)===0xfc00||(first&0xffc0)===0xfe80||(first&0xff00)===0xff00)return "Private / special-use";
  if(first===0x2001&&groups[1]===0x0db8)return "Private / special-use";
  if(first===0x0100&&groups.slice(1,4).every(group=>group===0))return "Private / special-use";
  return "Public IPv6";
 }
 const api={isIPv4,isIPv6,isValidIpAddress,classifyIpAddress};
 root.ToolNestIP=api;
 if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof globalThis!=="undefined"?globalThis:this);
