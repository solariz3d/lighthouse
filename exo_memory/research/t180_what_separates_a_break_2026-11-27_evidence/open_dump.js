const fs=require('fs');const L=fs.readFileSync('passes.csv','utf8').trim().split(/\r?\n/);const H=L[0].split(',');
const rows=L.slice(1).map(l=>{const c=l.split(',');const r={};H.forEach((h,i)=>r[h]=c[i]);return r}).filter(r=>r.split==='train');
const cols=['replay_id','track_tag','car','cfm','t_start','speed_kmh','deepest_cm','crosses_11cm','sink_rate_at_11cm','max_sink_rate_5_to_16cm','peak_load_g','u_m','road_roll_deg','roll_load_g','near_edge_m','half_width_m','up_dot_normal','air_before_s','kind','outcome','how_broke'];
console.log(cols.join('\t'));
rows.sort((a,b)=>a.outcome.localeCompare(b.outcome)||a.kind.localeCompare(b.kind));
for(const r of rows)console.log(cols.map(c=>{const v=r[c];return c==='replay_id'?v.slice(0,6):c==='track_tag'?v.slice(0,14):(v!==''&&!isNaN(+v)&&c!=='cfm')?(+(+v).toFixed(2)):v}).join('\t'));
console.log(rows.length);
