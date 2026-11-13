// sr.js: ok model reads of call_librarian rings in second-reader.jsonl after 2026-11-03T15:25Z; tokens all kinds. Numbers only.
const fs=require('fs');const L=fs.readFileSync('C:/Consonance/data/second-reader.jsonl','utf8').split('\n').filter(Boolean).map(l=>JSON.parse(l));
const T=Date.parse('2026-11-03T15:25:00Z');const f=(rows)=>{let n=0,tok=0,flagged=0,cr=0,cc=0,io=0;for(const o of rows){if(o.status!=='ok'||!/call_librarian/.test(o.tool)||Date.parse(o.ts)<=T)continue;n++;const t=o.tokens||{};tok+=(t.in||0)+(t.out||0)+(t.cacheRead||0)+(t.cacheCreate||0);cr+=t.cacheRead||0;cc+=t.cacheCreate||0;io+=(t.in||0)+(t.out||0);if((o.flags||[]).length)flagged++}return{n,tokens:tok,flagged,cacheRead:cr,cacheCreate:cc,inOut:io}};
console.log('first3940',JSON.stringify(f(L.slice(0,3940))));console.log('all'+L.length,JSON.stringify(f(L)));
const okAll=L.filter(o=>o.status==='ok');let cc=0,cr=0,out=0;for(const o of okAll){cc+=o.tokens?.cacheCreate||0;cr+=o.tokens?.cacheRead||0;out+=o.tokens?.out||0}console.log('allOk',okAll.length,'cacheCreate',cc,'cacheRead',cr,'out',out);
const first=L.find(o=>Date.parse(o.ts)>T);console.log("lastTs",L[L.length-1].ts);
