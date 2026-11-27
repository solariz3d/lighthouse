const {rows}=require('./contact_train.js');
const cols=['speed_kmh','sink_rate_at_11cm','sink_rate_1frame','max_sink_rate_5_to_16cm','peak_load_g','near_edge_m','air_before_s','up_dot_normal'];
const sc=(p)=>{let tp=0,fp=0,fn=0,tn=0;for(const r of rows){const b=r.outcome==='broke',q=!!p(r);b?(q?tp++:fn++):(q?fp++:tn++)}return{tp,fp,fn,tn,f1:2*tp/(2*tp+fp+fn||1)}};
const vals=c=>[...new Set(rows.map(r=>r[c]).filter(Number.isFinite))].sort((a,b)=>a-b);
const out=[];
// single
for(const c of cols)for(const v of vals(c))for(const d of [1,-1]){const s=sc(r=>d>0?r[c]>=v:r[c]<=v);out.push({rule:`${c}${d>0?'>=':'<='}${v}`,...s})}
for(const c1 of cols)for(const v1 of vals(c1))for(const d1 of [1,-1])for(const c2 of cols){if(c2<=c1)continue;for(const v2 of vals(c2))for(const d2 of [1,-1]){const s=sc(r=>(d1>0?r[c1]>=v1:r[c1]<=v1)&&(d2>0?r[c2]>=v2:r[c2]<=v2));if(s.f1>=0.6)out.push({rule:`${c1}${d1>0?'>=':'<='}${v1} && ${c2}${d2>0?'>=':'<='}${v2}`,...s})}}
out.sort((a,b)=>b.f1-a.f1);
console.log('rules tried',out.length);
for(const o of out.slice(0,25))console.log(o.f1.toFixed(2),o.tp,o.fp,o.fn,o.tn,o.rule);
console.log('--- named candidates');
const C={
 A:r=>r.crosses_11cm===1&&r.sink_rate_at_11cm>=1.7,
 B:r=>r.crosses_11cm===1&&r.sink_rate_at_11cm>=1.7&&r.air_before_s<0.1&&r.near_edge_m>=1&&r.peak_load_g>=20,
 C:r=>r.crosses_11cm===1&&r.sink_rate_at_11cm>=1.7&&r.near_edge_m>=1&&!(r.peak_load_g>=20&&r.air_before_s>=0.1),
 D:r=>r.sink_rate_at_11cm>=1.7&&r.near_edge_m>=1&&((r.air_before_s<0.1&&r.peak_load_g>=20)||(r.peak_load_g<=15.2)||r.up_dot_normal<0.99),
};
for(const k in C){const s=sc(C[k]);console.log(k,JSON.stringify(s));for(const r of rows){const b=r.outcome==='broke',q=!!C[k](r);if(b!==q)console.log('   wrong',r.replay_id,r.t_start,r.kind,r.outcome,'pred',q?'broke':'held')}}
