const fs=require('fs');const L=fs.readFileSync('passes.csv','utf8').trim().split(/\r?\n/);const H=L[0].split(',');
const S=['replay_id','track_tag','car','outcome','how_broke','split','kind'];
const rows=L.slice(1).map(l=>{const c=l.split(',');const r={};H.forEach((h,i)=>r[h]=S.includes(h)?c[i]:(c[i]===''?NaN:+c[i]));return r}).filter(r=>r.split==='train');
const rule=r=>Math.abs(r.u_m)>13.44&&Math.abs(r.road_roll_deg)>21.5;
let o='';const p=s=>{o+=s+'\n'};
const sc=(set,f)=>{const m={tp:0,fp:0,fn:0,tn:0};for(const r of set){const k=(f(r)?(r.outcome==='broke'?'tp':'fp'):(r.outcome==='broke'?'fn':'tn'));m[k]++}return m};
p('rule: Math.abs(r.u_m)>13.44 && Math.abs(r.road_roll_deg)>21.5');p('train rows '+rows.length+' '+JSON.stringify(sc(rows,rule)));
p('wrong:');for(const r of rows){const pr=rule(r),b=r.outcome==='broke';if(pr!==b)p(`  ${pr?'FALSE ALARM':'MISSED'} ${r.replay_id} t_start ${r.t_start} ${r.car} ${r.track_tag} kind ${r.kind} |u| ${Math.abs(r.u_m)} roll ${r.road_roll_deg} speed ${r.speed_kmh} g ${r.peak_load_g} sink ${r.sink_rate_at_11cm}`)}
p('flagged:');for(const r of rows)if(rule(r))p(`  ${r.replay_id} ${r.t_start} ${r.car} ${r.track_tag} ${r.kind} |u| ${Math.abs(r.u_m)} roll ${r.road_roll_deg} hw ${r.half_width_m} edge ${r.near_edge_m} cfm ${r.cfm} ${r.outcome}`);
p('nearest unflagged rows (|u|>11):');for(const r of rows)if(!rule(r)&&Math.abs(r.u_m)>11)p(`  ${r.replay_id} ${r.t_start} ${r.car} ${r.track_tag} ${r.kind} |u| ${Math.abs(r.u_m)} roll ${r.road_roll_deg} edge ${r.near_edge_m} cross ${r.crosses_11cm} ${r.outcome} ${r.how_broke}`);
// by kind
for(const k of ['road','landing','edge','aftermath'])p(k+' '+JSON.stringify(sc(rows.filter(r=>r.kind===k),rule)));
// P1 on train road crossers; sink-only alternatives
p('alt crosses_11cm only '+JSON.stringify(sc(rows,r=>r.crosses_11cm===1)));
p('alt sink_rate_at_11cm>=1.66 '+JSON.stringify(sc(rows,r=>r.sink_rate_at_11cm>=1.66)));
p('alt road-kind sink>=1.66 '+JSON.stringify(sc(rows.filter(r=>r.kind==='road'),r=>r.sink_rate_at_11cm>=1.66)));
p('alt car!=mach6 '+JSON.stringify(sc(rows,r=>r.car!=='mach6')));
p('alt cfm<0.0001 '+JSON.stringify(sc(rows,r=>r.cfm<0.0001)));
// elysium helix rows
p('elysium helix rows (roll 60-70), sorted by |u|:');rows.filter(r=>r.track_tag.startsWith('t180b_elysium')&&Math.abs(r.road_roll_deg)>60&&Math.abs(r.road_roll_deg)<70).sort((a,b)=>Math.abs(a.u_m)-Math.abs(b.u_m)).forEach(r=>p(`  |u| ${Math.abs(r.u_m)} edge ${r.near_edge_m} speed ${r.speed_kmh} g ${r.peak_load_g} rollload ${r.roll_load_g} deepest ${r.deepest_cm} ${r.car} ${r.outcome}`));
// leave-one-replay-out: refit best 2-AND over a fixed feature set, score the left-out replay
const F={absu:r=>Math.abs(r.u_m),absroll:r=>Math.abs(r.road_roll_deg),speed:r=>r.speed_kmh,sink:r=>r.sink_rate_at_11cm,g:r=>r.peak_load_g,rl:r=>r.roll_load_g,edge:r=>r.near_edge_m,hw:r=>r.half_width_m,air:r=>r.air_before_s};
function fit(set){const C=[];for(const f in F){const vs=[...new Set(set.map(F[f]).filter(v=>!isNaN(v)))].sort((a,b)=>a-b);for(let i=0;i<vs.length-1;i++){const t=(vs[i]+vs[i+1])/2;C.push({d:f+'>'+t.toFixed(2),fn:r=>F[f](r)>t},{d:f+'<'+t.toFixed(2),fn:r=>F[f](r)<t})}}let best=null;for(let i=0;i<C.length;i++)for(let j=i;j<C.length;j++){const f=r=>C[i].fn(r)&&C[j].fn(r);const m=sc(set,f);const e=m.fp+m.fn;if(!best||e<best.e)best={e,f,d:C[i].d+' && '+C[j].d}}return best}
const ids=[...new Set(rows.map(r=>r.replay_id))];const tot={tp:0,fp:0,fn:0,tn:0};p('leave-one-replay-out (refit best 2-AND each time):');
for(const id of ids){const b=fit(rows.filter(r=>r.replay_id!==id));const m=sc(rows.filter(r=>r.replay_id===id),b.f);for(const k in m)tot[k]+=m[k];p(`  out ${id}: fitted ${b.d} (train err ${b.e}) -> ${JSON.stringify(m)}`)}
p('LORO total '+JSON.stringify(tot));
fs.writeFileSync('open_score.txt',o);console.log(o);
