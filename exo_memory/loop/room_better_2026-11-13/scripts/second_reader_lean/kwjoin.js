// kwjoin.js <endISO>: join each keep-warm ping row to the first call in that seat's transcript at or after the ping
// (within 15 min) and sum what that call actually read and wrote. Numbers only.
const fs=require('fs');const END=Date.parse(process.argv[2]);
const map={'6fe15f0a':'x_3d57124e.json','0845a868':'x_0845a868.json','a2122153':'x_07b8a48f.json','12fb81f6':'x_5bf9d657.json','0c0c0c0a':'x_main.json','0c0c0c0b':'x_librarian.json','fbf98f8e':'x_372c8abc.json','c88002b1':'x_36313935.json'};
const rows=JSON.parse(fs.readFileSync('kw_rows.json'));const W={fable:{cr:.025,cw:2,out:5,in:1},opus:{cr:.025,cw:1,out:2.5,in:.5}};
const res={};
for(const [id,f] of Object.entries(map)){const calls=JSON.parse(fs.readFileSync(f)).calls.map(c=>({...c,t:Date.parse(c.ts)}));
 for(const win of['all','7d']){const k=win;const R=res[k]||(res[k]={pings:0,joined:0,cr:0,cw:0,out:0,units:0,writeUnits:0,coldJoined:0,coldCw:0,pingsIdleGe60:0,ge60Cw:0});
  for(const p of rows.filter(x=>x.id===id&&(win==='all'||(x.t>END-7*864e5&&x.t<=END)))){R.pings++;if(p.idle>=60)R.pingsIdleGe60++;
   let lo=0,hi=calls.length;while(lo<hi){const m=(lo+hi)>>1;if(calls[m].t<p.t)lo=m+1;else hi=m}
   const c=calls[lo];if(!c||c.t-p.t>15*60e3)continue;R.joined++;const w=W[/fable/i.test(c.model)?'fable':'opus'];
   R.cr+=c.cr;R.cw+=c.cw;R.out+=c.out;R.units+=c.cr*w.cr+c.cw*w.cw+c.out*w.out+c.in*w.in;R.writeUnits+=c.cw*w.cw;
   if(c.cw>50000){R.coldJoined++;R.coldCw+=c.cw}if(p.idle>=60)R.ge60Cw+=c.cw;}}}
for(const k in res){const R=res[k];R.unitsM=+(R.units/1e6).toFixed(2);R.writeUnitsM=+(R.writeUnits/1e6).toFixed(2);delete R.units;delete R.writeUnits}
console.log(JSON.stringify(res,null,1));
