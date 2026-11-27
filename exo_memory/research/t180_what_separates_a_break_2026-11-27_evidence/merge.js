// merge.js: out/*.json -> passes.csv, heads.json, summary.txt, coverage.txt, dropped_duplicates.txt
const fs=require('fs');const list=require('./replays.json');const NL=String.fromCharCode(10);
let rows=[];const heads=[];
for(const f of fs.readdirSync('out')){const o=JSON.parse(fs.readFileSync('out/'+f));const r=list.find(x=>x.sha===o.head.id)||{};const drv=((r.cars||[''])[0].match(/"driver":"([^"]*)"/)||[])[1]||'';o.head.driver_is_keeper=drv==='sol'?1:0;heads.push(o.head);for(const p of o.passes){p.own_driving=o.head.driver_is_keeper;rows.push(p);}}
const cols=['replay_id','track_tag','own_track','car','cfm','t_start','t_end','speed_kmh','deepest_cm','crosses_11cm','sink_rate_at_11cm','max_sink_rate_5_to_16cm','peak_load_g','u_m','road_roll_deg','roll_rate_deg_per_m','roll_acc_deg_per_m2','roll_load_g','wheel_under','near_edge_m','outcome','how_broke','split','sink_rate_1frame','half_width_m','min_wheel_cm','closed_section','up_dot_normal','dur_s','max_1frame_speed_loss_kmh','air_before_s','after_break','own_driving','kind'];
// two saves of one session hold the same event: keep the one from the smaller replay_id
rows.sort((a,b)=>a.replay_id<b.replay_id?-1:a.replay_id>b.replay_id?1:a.t_start-b.t_start);
{const seen=new Map(),keep=[],dropped=[];for(const r of rows){const k=[r.car,r.track_tag,r.speed_kmh,r.deepest_cm,r.peak_load_g].join('|');if(seen.has(k)&&seen.get(k)!==r.replay_id){dropped.push(r.replay_id+' t '+r.t_start+' is the same event as one in '+seen.get(k));continue;}seen.set(k,r.replay_id);keep.push(r);}rows=keep;fs.writeFileSync('dropped_duplicates.txt',dropped.join(NL)+NL);}
fs.writeFileSync('passes.csv',cols.join(',')+NL+rows.map(r=>cols.map(c=>r[c]===undefined?'':String(r[c])).join(',')).join(NL)+NL);
fs.writeFileSync('heads.json',JSON.stringify(heads,null,1));
const cnt=(k,flt=()=>true)=>{const c={};for(const r of rows.filter(flt)){const key=typeof k==='function'?k(r):r[k];c[key]=c[key]||{held:0,broke:0};c[key][r.outcome]++;}return c;};
const out=[];const P=x=>out.push(x);const road=r=>r.kind==='road';
P('rows '+rows.length+' held '+rows.filter(r=>r.outcome==='held').length+' broke '+rows.filter(r=>r.outcome==='broke').length);
P('by split '+JSON.stringify(cnt('split')));P('by kind '+JSON.stringify(cnt('kind')));P('by car '+JSON.stringify(cnt('car')));P('by track '+JSON.stringify(cnt('track_tag')));P('by own_track '+JSON.stringify(cnt('own_track')));P('by cfm '+JSON.stringify(cnt('cfm')));P('by own_driving '+JSON.stringify(cnt('own_driving')));
P('crossers of 11 cm, all kinds '+JSON.stringify(cnt('split',r=>r.crosses_11cm==1)));
P('road-kind '+JSON.stringify(cnt('split',road)));
P('road-kind by car '+JSON.stringify(cnt('car',road)));P('road-kind by track '+JSON.stringify(cnt('track_tag',road)));
P('road-kind crossers of 11 cm '+JSON.stringify(cnt('split',r=>road(r)&&r.crosses_11cm==1)));
P('road-kind crossers: rate at 11 cm, outcome, replay, car, track, cfm, peak g, near edge');
for(const r of rows.filter(r=>road(r)&&r.crosses_11cm==1).sort((a,b)=>a.sink_rate_at_11cm-b.sink_rate_at_11cm))P('  '+[r.sink_rate_at_11cm,'(1-frame '+r.sink_rate_1frame+')',r.outcome,r.replay_id,r.car,r.track_tag,r.cfm,r.peak_load_g+' g','edge '+r.near_edge_m,'roll_load '+r.roll_load_g,r.split].join('  '));
const ok=heads.filter(h=>!h.left_out);P('replays covered '+ok.length+' left out '+heads.filter(h=>h.left_out).length+'; km '+ok.reduce((a,h)=>a+(h.km||0),0).toFixed(0)+'; seconds on a road above 80 km/h '+ok.reduce((a,h)=>a+(h.onroad_s||0),0).toFixed(0));
P('km, keeper driving a T-180, covered replays '+ok.filter(h=>h.driver_is_keeper&&!/audi|nsx/.test(h.car)).reduce((a,h)=>a+(h.km||0),0).toFixed(0));
fs.writeFileSync('summary.txt',out.join(NL)+NL);console.log(out.join(NL));
