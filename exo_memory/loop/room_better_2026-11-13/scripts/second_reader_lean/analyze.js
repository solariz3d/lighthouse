// analyze.js <endISO|now> ; reads x_*.json written by extract.js; prints numbers only.
// ASSUMPTION about relative cost (not any plan's accounting): units = Fable 5.2 input-token equivalents,
// the in_cost table: Fable in 1, read .025, write(1h) 2, out 5; Opus 5.5 in .5, read .025, write(1h) 1, out 2.5.
const fs=require('fs');
const arg=process.argv[2]||'now';const END=arg==='now'?Date.now():Date.parse(arg);
const files=fs.readdirSync('.').filter(f=>/^x_.*\.json$/.test(f));
const W={fable:{in:1,cr:.025,cw:2,out:5},opus:{in:.5,cr:.025,cw:1,out:2.5}};
const fam=m=>/fable/i.test(m||'')?'fable':'opus';
const units=c=>{const w=W[fam(c.model)];return{in:c.in*w.in,cr:c.cr*w.cr,cw:c.cw*w.cw,out:c.out*w.out}};
const med=a=>{if(!a.length)return null;const s=[...a].sort((x,y)=>x-y);const n=s.length;return n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2};
const pct=(a,p)=>{if(!a.length)return null;const s=[...a].sort((x,y)=>x-y);return s[Math.min(s.length-1,Math.ceil(p*s.length)-1)]};
const seats=files.map(f=>JSON.parse(fs.readFileSync(f)));
const out={end:new Date(END).toISOString(),windows:{}};
for(const H of[24,48]){const S=END-H*3600e3;const rows=[];const tot={calls:0,cr:0,cw:0,out:0,in:0,cr250:0,above250:0,above150:0,coldCw:0,modelCw:0,coldOrModelCw:0,u:{in:0,cr:0,cw:0,out:0},uColdOrModel:0,ctxAll:[]};
 for(const s of seats){const all=s.calls;const r={seat:s.seat,calls:0,cr:0,cw:0,out:0,in:0,ctx:[],cr250:0,above250:0,coldCw:0,coldN:0,modelCw:0,modelN:0,models:{},u:0,uw:0};
  for(let i=0;i<all.length;i++){const c=all[i];const t=Date.parse(c.ts);if(t<S||t>END)continue;
   const ctx=c.in+c.cr+c.cw;r.calls++;r.cr+=c.cr;r.cw+=c.cw;r.out+=c.out;r.in+=c.in;r.ctx.push(ctx);
   r.models[fam(c.model)]=(r.models[fam(c.model)]||0)+1;
   if(ctx>250000)r.cr250+=c.cr; r.above250+=Math.max(0,ctx-250000); tot.above150+=Math.max(0,ctx-150000);
   const p=all[i-1];const gap=p?(t-Date.parse(p.ts))/60000:Infinity;const cold=gap>60;const mch=p&&fam(p.model)!==fam(c.model);
   if(cold){r.coldCw+=c.cw;r.coldN++} if(mch){r.modelCw+=c.cw;r.modelN++}
   const u=units(c);r.u+=u.in+u.cr+u.cw+u.out;r.uw+=u.cw;for(const k in u)tot.u[k]+=u[k];
   if(cold||mch)tot.uColdOrModel+=u.cw, tot.coldOrModelCw+=c.cw;
   tot.ctxAll.push(ctx);}
  for(const k of['calls','cr','cw','out','in','cr250','above250','coldCw','modelCw'])tot[k]+=r[k];
  rows.push({seat:r.seat,calls:r.calls,ctxMed:med(r.ctx),ctxP90:pct(r.ctx,.9),ctxMax:r.ctx.length?Math.max(...r.ctx):null,
   cacheRead:r.cr,cacheWrite:r.cw,output:r.out,uncached:r.in,shareCRfromCtxGt250k:r.cr?+(r.cr250/r.cr*100).toFixed(1):null,
   coldWakeCalls:r.coldN,coldWakeCw:r.coldCw,modelChangeCalls:r.modelN,modelChangeCw:r.modelCw,models:r.models,units:+(r.u/1e6).toFixed(3),writeUnits:+(r.uw/1e6).toFixed(3)});}
 const U=tot.u.in+tot.u.cr+tot.u.cw+tot.u.out;
 out.windows[H+'h']={start:new Date(S).toISOString(),rows,total:{calls:tot.calls,cacheRead:tot.cr,cacheWrite:tot.cw,output:tot.out,uncached:tot.in,
  ctxMedianAllCalls:med(tot.ctxAll),
  shareCRfromCallsCtxGt250k_pct:+(tot.cr250/tot.cr*100).toFixed(1),
  partAbove250k_overCR_pct:+(tot.above250/tot.cr*100).toFixed(1),partAbove250k:tot.above250,partAbove150k_overCR_pct:+(tot.above150/tot.cr*100).toFixed(1),
  coldWakeCw:tot.coldCw,coldWakeShareOfCw_pct:+(tot.coldCw/tot.cw*100).toFixed(1),modelChangeCw:tot.modelCw,
  coldOrModelCw:tot.coldOrModelCw,coldOrModelShareOfCw_pct:+(tot.coldOrModelCw/tot.cw*100).toFixed(1),
  unitsM:{in:+(tot.u.in/1e6).toFixed(3),cr:+(tot.u.cr/1e6).toFixed(2),cw:+(tot.u.cw/1e6).toFixed(2),out:+(tot.u.out/1e6).toFixed(2),total:+(U/1e6).toFixed(2)},
  writeShareOfUnits_pct:+(tot.u.cw/U*100).toFixed(1),coldOrModelWriteShareOfUnits_pct:+(tot.uColdOrModel/U*100).toFixed(1),
  above250kReadUnitsM:+(tot.above250*.025/1e6).toFixed(2),above250kReadUnitsShareOfAll_pct:+(tot.above250*.025/U*100).toFixed(1)}};}
// post-compaction first call, whole file
out.postCompact=seats.map(s=>{const first=[];let zeros=0;let trig={};let idleAfter=0;let preOfIdle=[];
 for(const c of s.compacts){trig[c.trigger]=(trig[c.trigger]||0)+1;const n=s.calls.find(x=>x.ts>c.ts);if(n){const ctx=n.in+n.cr+n.cw;if(ctx===0)zeros++;else first.push(ctx)}}
 // pair each idle notice with the latest compact boundary at or before it
 for(const t of s.idle){let b=null;for(const c of s.compacts){if(c.ts<=t)b=c}if(b){preOfIdle.push(b.pre)}}
 const posts=s.compacts.map(c=>c.post).filter(x=>x!=null);
 return{seat:s.seat,compactions:s.compacts.length,triggers:trig,firstCallN:first.length,zeros,firstCallMedian:med(first),firstCallMin:first.length?Math.min(...first):null,firstCallMax:first.length?Math.max(...first):null,
  postTokensMedian:med(posts),idleNotices:s.idle.length,minPreOfIdlePaired:preOfIdle.length?Math.min(...preOfIdle):null,maxPreOfIdlePaired:preOfIdle.length?Math.max(...preOfIdle):null,
  preTokensMin:s.compacts.length?Math.min(...s.compacts.map(c=>c.pre)):null};});
console.log(JSON.stringify(out,null,1));
