const fs=require('fs');
const L=fs.readFileSync('passes.csv','utf8').trim().split(/\r?\n/);
const H=L[0].split(',');
const S=new Set(['replay_id','track_tag','car','outcome','how_broke','split','kind']);
const rows=L.slice(1).map(l=>{const c=l.split(',');const r={};H.forEach((h,i)=>{r[h]=S.has(h)?c[i]:(c[i]===''||c[i]===undefined?NaN:Number(c[i]))});return r}).filter(r=>r.split==='train');
module.exports={rows,H};
if(require.main===module){
 const f=(x,n=2)=>Number.isFinite(x)?x.toFixed(n):'-';
 console.log('train',rows.length);
 rows.sort((a,b)=>(a.outcome<b.outcome?-1:a.outcome>b.outcome?1:0)||(b.max_sink_rate_5_to_16cm-a.max_sink_rate_5_to_16cm));
 console.log('id t kind car out | v dep x11 s11 s1f smax g wund minwh edge dur loss air tick_cm updn how');
 for(const r of rows)console.log(r.replay_id.slice(0,6),f(r.t_start,1),r.kind,r.car,r.outcome,'|',f(r.speed_kmh,0),f(r.deepest_cm,1),r.crosses_11cm,f(r.sink_rate_at_11cm),f(r.sink_rate_1frame),f(r.max_sink_rate_5_to_16cm),f(r.peak_load_g,1),r.wheel_under,f(r.min_wheel_cm,1),f(r.near_edge_m,1),f(r.dur_s,2),f(r.max_1frame_speed_loss_kmh,1),f(r.air_before_s,2),f(r.speed_kmh/3.6/333*100,0),f(r.up_dot_normal,3),r.cfm,r.how_broke);
}
