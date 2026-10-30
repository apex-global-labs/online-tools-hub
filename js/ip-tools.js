/* ToolNest IP Tools — input validation and display helpers. No IP data is stored here. */
(function(root){
 "use strict";
 function isIPv4(value){
  const parts=value.split(".");
  return parts.length===4&&parts.every(part=>/^\d{1,3}$/.test(part)&&Number(part)>=0&&Number(part)<=255&&(part==="0"||!part.startsWith("0")));
 }
 function isIPv6(value){
  if(!value||value.includes("%")||!value.includes(":")||value.includes(":::"))return false;
  if((value.match(/::/g)||[]).length>1)return false;
  let source=value;
  let ipv4Groups=0;
  const lastColon=source.lastIndexOf(":");
  const tail=source.slice(lastColon+1);
  if(tail.includes(".")){
   if(!isIPv4(tail))return false;
   ipv4Groups=2;
   source=source.slice(0,lastColon)+":v4";
  }
  const compressed=source.includes("::");
  const parts=source.split(":").filter(Boolean);
  if(parts.some(part=>part!=="v4"&&!/^[0-9a-fA-F]{1,4}$/.test(part)))return false;
  const count=parts.length- (ipv4Groups?1:0)+ipv4Groups;
  return compressed?count<8:count===8;
 }
 function isValidIpAddress(value){
  if(typeof value!=="string"||value.trim()!==value||!value)return false;
  return isIPv4(value)||isIPv6(value);
 }
 function classifyIpAddress(value){
  if(!isValidIpAddress(value))return "Invalid";
  if(value.includes(":")){
   const ip=value.toLowerCase();
   if(ip==="::"||ip==="::1"||ip.startsWith("fc")||ip.startsWith("fd")||ip.startsWith("ff")||ip.startsWith("2001:db8:")||/^fe[89ab]/.test(ip))return "Private / special-use";
   return "Public IPv6";
  }
  const p=value.split(".").map(Number),a=p[0],b=p[1];
  if(a===10||a===127||a===0||(a===169&&b===254)||(a===172&&b>=16&&b<=31)||(a===192&&(b===168||b===0||b===2))||(a===100&&b>=64&&b<=127)||(a===198&&((b===18||b===19)||(b===51&&p[2]===100)))||(a===203&&b===0&&p[2]===113)||a>=224)return "Private / special-use";
  return "Public IPv4";
 }
 const api={isIPv4,isIPv6,isValidIpAddress,classifyIpAddress};
 root.ToolNestIP=api;
 if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof globalThis!=="undefined"?globalThis:this);
