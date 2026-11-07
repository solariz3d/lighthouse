// one streaming pass: list compaction summaries (line, timestamp, length) and save each 11-02/11-03 summary's text
const fs=require('fs'),rl=require('readline');const [,,F,OUT]=process.argv;let n=0;
const r=rl.createInterface({input:fs.createReadStream(F),crlfDelay:Infinity});
r.on('line',l=>{n++;if(!l.includes('"isCompactSummary":true'))return;let o;try{o=JSON.parse(l)}catch{return}
 const c=o.message&&o.message.content;const t=typeof c==='string'?c:(c||[]).map(x=>x.text||'').join('');
 console.log(n,o.timestamp,t.length,o.uuid);if(/^2026-11-0[23]/.test(o.timestamp))fs.writeFileSync(`${OUT}/sum_${n}.txt`,t);});
r.on('close',()=>console.log('lines',n));
