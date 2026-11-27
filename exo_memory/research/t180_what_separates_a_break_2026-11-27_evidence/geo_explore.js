const fs=require('fs');
const L=fs.readFileSync('passes.csv','utf8').trim().split(/\r?\n/);
const H=L[0].split(',');
const rows=L.slice(1).map(l=>{const c=l.split(',');const r={};H.forEach((h,i)=>{const v=c[i];const n=v===''?NaN:Number(v);r[h]=(v!==''&&!isNaN(n)&&!['replay_id','track_tag','car','outcome','how_broke','split','kind'].includes(h))?n:(['replay_id','track_tag','car','outcome','how_broke','split','kind'].includes(h)?v:NaN);});return r;}).filter(r=>r.split==='train');
module.exports={rows,H};
if(require.main===module){
const cols=['kind','car','track_tag','cfm','speed_kmh','deepest_cm','u_m','half_width_m','near_edge_m','road_roll_deg','roll_rate_deg_per_m','roll_acc_deg_per_m2','roll_load_g','up_dot_normal','closed_section','peak_load_g','air_before_s','sink_rate_at_11cm','after_break','how_broke'];
console.log('n',rows.length);
console.log(['id','t',...cols].join('\t'));
rows.sort((a,b)=>(a.outcome<b.outcome?-1:1)||0);
for(const r of rows)console.log([r.outcome[0]+' '+r.replay_id.slice(0,6),r.t_start,...cols.map(c=>typeof r[c]==='number'?(Number.isNaN(r[c])?'-':+r[c].toFixed(3)):String(r[c]).slice(0,14))].join('\t'));
}
