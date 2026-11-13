// race.js: (1) for each compact_boundary paired with an idle notice, minutes from the previous call to the boundary;
// (2) for each keep-warm ping, whether a compact_boundary falls between the ping row and its reply call. Numbers only.
const fs=require('fs');
const map={'6fe15f0a':'x_3d57124e.json','0845a868':'x_0845a868.json','a2122153':'x_07b8a48f.json','12fb81f6':'x_5bf9d657.json','0c0c0c0a':'x_main.json','0c0c0c0b':'x_librarian.json','fbf98f8e':'x_372c8abc.json','c88002b1':'x_36313935.json'};
const rows=JSON.parse(fs.readFileSync('kw_rows.json'));const gaps=[];let pingWithCompact=0,pingWithCompactCw=0,pings=0,cmpOnPing=0;
const med=a=>{const s=[...a].sort((x,y)=>x-y);return s[Math.floor(s.length/2)]};
for(const f of fs.readdirSync('.').filter(f=>/^x_.*\.json$/.test(f))){const s=JSON.parse(fs.readFileSync(f));const calls=s.calls.map(c=>Date.parse(c.ts));
 const idleTs=s.idle.map(Date.parse);
 for(const c of s.compacts){const t=Date.parse(c.ts);if(!idleTs.some(x=>x>=t&&x-t<5*60e3))continue;let i=calls.findIndex(x=>x>t);const prev=i<0?calls[calls.length-1]:calls[i-1];if(prev)gaps.push((t-prev)/60e3)}}
for(const [id,f] of Object.entries(map)){const s=JSON.parse(fs.readFileSync(f));const calls=s.calls.map(c=>({t:Date.parse(c.ts),cw:c.cw}));const cts=s.compacts.map(c=>Date.parse(c.ts));
 for(const p of rows.filter(x=>x.id===id)){pings++;const c=calls.find(x=>x.t>=p.t);if(!c)continue;if(cts.some(x=>x>=p.t-120e3&&x<=c.t)){pingWithCompact++;pingWithCompactCw+=c.cw}}}
gaps.sort((a,b)=>a-b);
console.log(JSON.stringify({idlePairedCompactions:gaps.length,minFromPrevCallToIdleCompaction:{min:+gaps[0].toFixed(1),p10:+gaps[Math.floor(gaps.length*.1)].toFixed(1),median:+med(gaps).toFixed(1),p90:+gaps[Math.floor(gaps.length*.9)].toFixed(1)},
 pings,pingsWithCompactionBetweenRowAndReply:pingWithCompact,theirReplyCacheWrite:pingWithCompactCw}));
