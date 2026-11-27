const fs=require('fs');const L=fs.readFileSync('passes.csv','utf8').trim().split(/\r?\n/);const H=L[0].split(',');
const num=v=>v===''?NaN:+v;
const rows=L.slice(1).map(l=>{const c=l.split(',');const r={};H.forEach((h,i)=>r[h]=c[i]);return r}).filter(r=>r.split==='train');
for(const r of rows){for(const h of H){if(!['replay_id','track_tag','car','outcome','how_broke','split','kind'].includes(h))r[h]=num(r[h]);}
 r.absu=Math.abs(r.u_m);r.ufrac=r.absu/r.half_width_m;r.absroll=Math.abs(r.road_roll_deg);r.b=r.outcome==='broke'?1:0;}
const feats=['speed_kmh','sink_rate_at_11cm','sink_rate_1frame','max_sink_rate_5_to_16cm','peak_load_g','absu','ufrac','absroll','roll_load_g','near_edge_m','half_width_m','air_before_s','up_dot_normal','cfm','roll_rate_deg_per_m','roll_acc_deg_per_m2'];
function conds(set){const out=[];for(const f of feats){const vs=[...new Set(set.map(r=>r[f]).filter(v=>!isNaN(v)))].sort((a,b)=>a-b);for(let i=0;i<vs.length-1;i++){const t=(vs[i]+vs[i+1])/2;out.push({f,op:'>',t,fn:r=>r[f]>t});out.push({f,op:'<',t,fn:r=>r[f]<t});}}return out;}
function score(set,fn){let tp=0,fp=0,fn_=0,tn=0;for(const r of set){const p=fn(r)?1:0;if(p&&r.b)tp++;else if(p)fp++;else if(r.b)fn_++;else tn++;}return{tp,fp,fn:fn_,tn,err:fp+fn_};}
const which=process.argv[2]||'all';
const set=which==='cross'?rows.filter(r=>r.crosses_11cm===1):which==='road'?rows.filter(r=>r.kind==='road'):which==='roadcross'?rows.filter(r=>r.kind==='road'&&r.crosses_11cm===1):rows;
console.log(which,set.length,'broke',set.filter(r=>r.b).length);
const C=conds(set);
let s1=C.map(c=>({d:`${c.f}${c.op}${c.t.toFixed(4)}`,...score(set,c.fn)})).sort((a,b)=>a.err-b.err).slice(0,12);console.log('ONE');s1.forEach(x=>console.log(JSON.stringify(x)));
let best=[];for(let i=0;i<C.length;i++)for(let j=i+1;j<C.length;j++){if(C[i].f===C[j].f)continue;const a=C[i],b=C[j];const s=score(set,r=>a.fn(r)&&b.fn(r));if(s.err<=3)best.push({d:`${a.f}${a.op}${a.t.toFixed(4)} && ${b.f}${b.op}${b.t.toFixed(4)}`,...s});}
best.sort((a,b)=>a.err-b.err);console.log('TWO (AND)',best.length);best.slice(0,25).forEach(x=>console.log(JSON.stringify(x)));
// OR pairs
let bo=[];for(let i=0;i<C.length;i++)for(let j=i+1;j<C.length;j++){const a=C[i],b=C[j];const s=score(set,r=>a.fn(r)||b.fn(r));if(s.err<=3)bo.push({d:`${a.f}${a.op}${a.t.toFixed(4)} || ${b.f}${b.op}${b.t.toFixed(4)}`,...s});}
bo.sort((a,b)=>a.err-b.err);console.log('TWO (OR)',bo.length);bo.slice(0,15).forEach(x=>console.log(JSON.stringify(x)));
