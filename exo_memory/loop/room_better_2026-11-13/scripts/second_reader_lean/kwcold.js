// kwcold.js <endISO> <days>: for ping replies that wrote >50k to cache, print numbers only:
// date, seat short id, idle minutes on the row, row context, reply cache read/write, 1h-write share, model family,
// minutes from the seat's previous call (any call) to the reply.
const fs=require('fs');const END=Date.parse(process.argv[2]),D=+process.argv[3];
const map={'6fe15f0a':'x_3d57124e.json','0845a868':'x_0845a868.json','a2122153':'x_07b8a48f.json','12fb81f6':'x_5bf9d657.json','0c0c0c0a':'x_main.json','0c0c0c0b':'x_librarian.json','fbf98f8e':'x_372c8abc.json','c88002b1':'x_36313935.json'};
const rows=JSON.parse(fs.readFileSync('kw_rows.json'));const out=[];
for(const [id,f] of Object.entries(map)){const calls=JSON.parse(fs.readFileSync(f)).calls.map(c=>({...c,t:Date.parse(c.ts)}));
 for(const p of rows.filter(x=>x.id===id&&x.t>END-D*864e5&&x.t<=END)){let lo=0,hi=calls.length;while(lo<hi){const m=(lo+hi)>>1;if(calls[m].t<p.t)lo=m+1;else hi=m}
  const c=calls[lo];if(!c||c.t-p.t>15*60e3||c.cw<=50000)continue;const prev=calls[lo-1];
  out.push([new Date(p.t).toISOString().slice(0,16),id,p.idle,p.ctx,c.cr,c.cw,c.cw?+(c.cw1h/c.cw).toFixed(2):0,/fable/i.test(c.model)?'F':'O',prev?Math.round((c.t-prev.t)/60e3):null].join(' '))}}
out.sort();console.log(out.join('\n'));console.log('n',out.length);
