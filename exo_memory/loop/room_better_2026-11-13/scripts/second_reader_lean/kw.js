// kw.js <board.jsonl> <endISO> : keep-warm PING rows (the keep_warm_row shape, main.rs:13266-13276). Numbers only.
// Finds the string field holding "keep-warm -> <id> (<role>)... · N min since its last request started · context C tokens".
const fs=require('fs'),rl=require('readline');const END=Date.parse(process.argv[3]);
const re=/^keep-warm -> (\S+) \((\w+)\)( \[WRITE FAILED\])? · (\d+) min since its last request started · (?:context (\d+) tokens|context unknown)/;
let raw=0,dup=0;const seen=new Set();const rows=[];let fieldNames={};let tsField={};
const r=rl.createInterface({input:fs.createReadStream(process.argv[2]),crlfDelay:Infinity});
r.on('line',l=>{if(!l.includes('min since its last request started'))return;let o;try{o=JSON.parse(l)}catch(e){return}
 let m=null,fk=null;for(const k of Object.keys(o)){if(typeof o[k]==='string'){const mm=o[k].match(re);if(mm){m=mm;fk=k;break}}}
 if(!m)return;raw++;fieldNames[fk]=(fieldNames[fk]||0)+1;
 const t=o.ts||o.time||o.timestamp;tsField[o.ts?'ts':o.time?'time':'timestamp']=(tsField[o.ts?'ts':'other']||0)+1;
 const key=t+'|'+m[0];if(seen.has(key)){dup++;return}seen.add(key);
 rows.push({t:(typeof t==="number"?t:Date.parse(t)),id:m[1],role:m[2],failed:!!m[3],idle:+m[4],ctx:m[5]?+m[5]:null});});
r.on('close',()=>{fs.writeFileSync('kw_rows.json',JSON.stringify(rows));const sized=rows.filter(x=>x.ctx!=null);const med=a=>{const s=[...a].sort((x,y)=>x-y);return s.length%2?s[(s.length-1)/2]:(s[s.length/2-1]+s[s.length/2])/2};
 const sum=a=>a.reduce((x,y)=>x+y,0);const d7=sized.filter(x=>x.t>END-7*864e5&&x.t<=END);
 const per={};for(const x of sized){const p=per[x.id]||(per[x.id]={role:x.role,n:0,ctx:0,n7:0,ctx7:0,idleGe60:0,ctxIdleGe60:0});p.n++;p.ctx+=x.ctx;if(x.t>END-7*864e5&&x.t<=END){p.n7++;p.ctx7+=x.ctx}if(x.idle>=60){p.idleGe60++;p.ctxIdleGe60+=x.ctx}}
 const ge60=sized.filter(x=>x.idle>=60),ge60_7=d7.filter(x=>x.idle>=60);
 const sorted=[...sized].sort((a,b)=>a.ctx-b.ctx);
 console.log(JSON.stringify({fieldNames,tsField,rawMatches:raw,dupDropped:dup,rows:rows.length,sized:sized.length,unsized:rows.length-sized.length,
  first:new Date(Math.min(...rows.map(x=>x.t))).toISOString(),last:new Date(Math.max(...rows.map(x=>x.t))).toISOString(),
  ctxMedian:med(sized.map(x=>x.ctx)),ctxP90:sorted[Math.ceil(.9*sorted.length)-1].ctx,ctxSum:sum(sized.map(x=>x.ctx)),
  last7:{n:d7.length,ctxSum:sum(d7.map(x=>x.ctx)),idleGe60:ge60_7.length,ctxIdleGe60:sum(ge60_7.map(x=>x.ctx))},
  allIdleGe60:{n:ge60.length,ctxSum:sum(ge60.map(x=>x.ctx))},perSeat:per},null,1));});
