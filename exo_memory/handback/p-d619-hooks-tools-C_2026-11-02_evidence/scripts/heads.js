const fs=require('fs'),T='C:/Users/nname/Desktop/lighthouse/consonance/tools/';const s=require('./toolscan.json');
for(const t of s.filter(x=>x.kind==='tool')){const src=fs.readFileSync(T+t.name,'utf8').split(/\r?\n/);const h=src.find(l=>/^\s*(\/\/|#)\s*\S/.test(l)&&!/^#!/.test(l)&&!/use strict/.test(l))||'';
console.log(`${t.name} | f${t.files} ${t.newest} | used ${t.usedBy.slice(0,4).join(',')} | ${h.replace(/^\s*(\/\/|#)\s*/,'').slice(0,150)}`)}
