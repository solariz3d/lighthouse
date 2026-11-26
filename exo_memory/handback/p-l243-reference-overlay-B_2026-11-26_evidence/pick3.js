// choose a tight, a fast and a banked track by the numbers in their AI lines; write the key (alias -> folder, layout) to the builder's gitignored out/
const fs=require('fs'),path=require('path');const {readAiShape,ribbonOf}=require('C:/Consonance/t180-wt-l243/src/reference/ribbon.js');
const root='C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/tracks';const rows=require('./survey.json');
const seen=new Set(),cands=[];
for(const x of rows.filter(r=>r.ai)){let s;try{s=readAiShape(fs.readFileSync(path.join(root,x.track,x.layout,'ai','fast_lane.ai')))}catch(e){continue}
 const r=ribbonOf(s);if(!r.closed)continue;const sig=r.points+':'+Math.round(r.lengthM);if(seen.has(sig))continue;seen.add(sig);
 const P=s.points.map(p=>p.pos),n=P.length;let turn=0;for(let k=0;k<n;k++){const a=P[(k-1+n)%n],b=P[k],c=P[(k+1)%n];const h1=Math.atan2(b[2]-a[2],b[0]-a[0]),h2=Math.atan2(c[2]-b[2],c[0]-b[0]);let d=h2-h1;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;turn+=Math.abs(d)}
 const spd=s.extra.map(e=>e.speed).sort((a,b)=>a-b),cam=s.extra.map(e=>Math.abs(e.camber)).sort((a,b)=>a-b);
 cands.push({x,lengthM:r.lengthM,turnPerKm:turn*180/Math.PI/(r.lengthM/1000),speedMed:spd[n>>1],camP95:cam[Math.floor(n*0.95)]*180/Math.PI,width:r.width.median});}
const tight=cands.slice().sort((a,b)=>b.turnPerKm-a.turnPerKm)[0];
const banked=cands.filter(c=>c!==tight).sort((a,b)=>b.camP95-a.camP95)[0];
const fast=cands.filter(c=>c!==tight&&c!==banked).sort((a,b)=>a.turnPerKm-b.turnPerKm)[0];
const key={written:new Date().toISOString(),note:'L243 local key: never commit. reference track N -> its folder and layout under content/tracks.',
 'reference track 1':{kind:'tight',track:tight.x.track,layout:tight.x.layout},'reference track 2':{kind:'fast',track:fast.x.track,layout:fast.x.layout},'reference track 3':{kind:'banked',track:banked.x.track,layout:banked.x.layout}};
fs.mkdirSync('C:/Consonance/t180-wt-l243/out',{recursive:true});fs.writeFileSync('C:/Consonance/t180-wt-l243/out/reference-key.json',JSON.stringify(key,null,1));
for(const [i,c] of [[1,tight],[2,fast],[3,banked]])console.log(`reference track ${i} (${['','tight','fast','banked'][i]}): ${c.lengthM.toFixed(0)} m, ${c.turnPerKm.toFixed(0)} deg/km turned, width ${c.width.toFixed(1)} m, camber p95 ${c.camP95.toFixed(1)} deg, uiLength ${c.x.uiLen}`);
console.log('closed distinct lines:',cands.length);
