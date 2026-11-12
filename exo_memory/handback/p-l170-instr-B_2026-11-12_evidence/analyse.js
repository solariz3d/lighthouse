const fs=require('fs');
const rd=f=>fs.readFileSync(f,'utf8').trim().split(/\r?\n/).slice(1).map(l=>l.split(','));
const med=v=>{v=[...v].sort((a,b)=>a-b);return v.length?v[Math.floor(v.length/2)]:NaN;};
const q=(v,p)=>{v=[...v].sort((a,b)=>a-b);return v[Math.min(v.length-1,Math.floor(p*v.length))];};
for(const b of ['first1','first151']){
 const R=rd(`l170_ctl_${b}_runs.csv`),P=rd(`l170_ctl_${b}_pairs.csv`);
 const pol=(s,lo,hi)=>R.filter(r=>r[1]==s&&+r[0]>=lo&&+r[0]<=hi);
 const sets=b=='first1'?[[1,96],[1,150]]:[[151,300]];
 for(const [lo,hi] of sets){
  const L=pol('line',lo,hi),F=pol('flee',lo,hi),C=pol('cutback',lo,hi);
  const nc=F.filter(r=>r[3]=='0').length;
  const lm={};L.forEach(r=>lm[r[0]]=+r[2]);const rat=C.filter(r=>lm[r[0]]>0).map(r=>+r[2]/lm[r[0]]);
  console.log(`${b} seeds ${lo}-${hi}: line median ${med(L.map(r=>+r[2])).toFixed(1)} s; flee never caught ${nc} of ${F.length} (${(100*nc/F.length).toFixed(1)}%); cutback median ${med(C.map(r=>+r[2])).toFixed(1)} s; paired cutback/line median ${med(rat).toFixed(2)} (n ${rat.length})`);
 }
 const all=P;const by={};
 for(const p of all){(by[p[2]]=by[p[2]]||[]).push(p);}
 const line=(name,v)=>console.log(`  ${b} ${name.padEnd(12)} pairs ${String(v.length).padStart(5)}  overshoot med ${med(v.map(p=>+p[5])).toFixed(2)} p25 ${q(v.map(p=>+p[5]),.25).toFixed(2)} p75 ${q(v.map(p=>+p[5]),.75).toFixed(2)}  screen med ${(100*med(v.map(p=>+p[7]))).toFixed(2)}%  seen ${(100*v.filter(p=>p[9]=='1').length/v.length).toFixed(1)}%  slip med ${med(v.map(p=>+p[8])).toFixed(1)} p90 ${q(v.map(p=>+p[8]),.9).toFixed(1)}  dist-at-corner med ${med(v.map(p=>+p[4])).toFixed(1)}  neg ${v.filter(p=>+p[5]<0).length}`);
 line('ALL',all); for(const k of Object.keys(by).sort()) line(k,by[k]);
}
