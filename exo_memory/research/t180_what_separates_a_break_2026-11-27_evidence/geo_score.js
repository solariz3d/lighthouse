const {rows}=require('./geo_explore.js');
const rules={
 A_final:r=>(r.near_edge_m<=4.1&&Math.abs(r.road_roll_deg)>=15&&Math.abs(r.road_roll_deg)<=90&&r.up_dot_normal>=0.5&&r.speed_kmh>=600)||Math.abs(r.roll_acc_deg_per_m2)>=0.03,
 B_nospeed:r=>(r.near_edge_m<=4.1&&Math.abs(r.road_roll_deg)>=15&&Math.abs(r.road_roll_deg)<=90&&r.up_dot_normal>=0.5)||Math.abs(r.roll_acc_deg_per_m2)>=0.03,
 C_edgeonly:r=>(r.near_edge_m<=4.1&&Math.abs(r.road_roll_deg)>=15&&Math.abs(r.road_roll_deg)<=90&&r.up_dot_normal>=0.5&&r.speed_kmh>=600),
 D_rollload:r=>r.roll_load_g>=6,
 E_rollrate:r=>Math.abs(r.roll_rate_deg_per_m)>=0.3,
 F_frac:r=>(Math.abs(r.u_m)/r.half_width_m>=0.765&&Math.abs(r.road_roll_deg)>=15&&Math.abs(r.road_roll_deg)<=90&&r.up_dot_normal>=0.5&&r.speed_kmh>=600)||Math.abs(r.roll_acc_deg_per_m2)>=0.03,
};
for(const [k,f] of Object.entries(rules)){let tp=0,fp=0,fn=0,tn=0,w=[];for(const r of rows){const p=!!f(r),b=r.outcome==='broke';if(p&&b)tp++;else if(p)(fp++,w.push('FP '+r.replay_id+' '+r.t_start+' '+r.kind));else if(b)(fn++,w.push('FN '+r.replay_id+' '+r.t_start+' '+r.kind));else tn++;}
 console.log(k,'broke&pred',tp,'broke&not',fn,'held&pred',fp,'held&not',tn);if(k[0]<'D'||k[0]=='F')console.log('  '+w.join('\n  '));}
