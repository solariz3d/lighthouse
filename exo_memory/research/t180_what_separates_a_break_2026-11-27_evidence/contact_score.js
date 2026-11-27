const {rows}=require('./contact_train.js');
const rule=r=>r.crosses_11cm===1&&r.sink_rate_at_11cm>=1.7&&r.peak_load_g>=50;
let tp=0,fp=0,fn=0,tn=0;const wrong=[];
for(const r of rows){const b=r.outcome==='broke',q=!!rule(r);b?(q?tp++:fn++):(q?fp++:tn++);if(b!==q)wrong.push([r.replay_id,r.t_start,r.kind,r.car,r.outcome,'s11',r.sink_rate_at_11cm,'g',r.peak_load_g,'kmh',r.speed_kmh].join(' '))}
console.log(JSON.stringify({tp,fp,fn,tn}));console.log(wrong.join('\n'));
const x=rows.filter(r=>r.crosses_11cm===1&&r.peak_load_g>=50);console.log('crossers at >=50 g:');for(const r of x)console.log(r.replay_id,r.t_start,r.kind,r.outcome,r.sink_rate_at_11cm,r.peak_load_g,(r.speed_kmh/3.6/333*100).toFixed(0)+'cm/tick');
const y=rows.filter(r=>r.sink_rate_at_11cm>=1.7&&!(r.peak_load_g>=50));console.log('fast sinkers under 50 g:',y.length,'broke',y.filter(r=>r.outcome==='broke').length,'max held g',Math.max(...y.filter(r=>r.outcome==='held').map(r=>r.peak_load_g)));
