// map.js: AI s -> document s, exactly, by the core's own path. Reads the track with src/core, builds the path as the export does (toPath step 2), reads fast_lane.ai, and for every AI point finds the nearest path sample.
const fs=require('fs'),path=require('path');const [T,F,AI]=process.argv.slice(2);
const D=require(path.join(T,'src/core/document.js')), AD=require(path.join(T,'src/core/adapter.js')); const { readAiLine }=require(path.join(T,'src/export/ailine.js'));
const doc=D.parse(fs.readFileSync(F,'utf8'));
const { segments, path: p }=AD.toPath(doc,{step:2});
console.log('path lengthM',p.lengthM.toFixed(3),'samples',p.samples.length,'closed',p.closed,'segments',segments.length);
const ai=readAiLine(fs.readFileSync(AI)).points; console.log('ai points',ai.length,'ai len',ai[ai.length-1].length.toFixed(2));
const S=p.samples; const G=10, grid=new Map(); const key=(x,z)=>Math.floor(x/G)+','+Math.floor(z/G);
S.forEach((sm,i)=>{const k=key(sm.pos[0],sm.pos[2]); if(!grid.has(k)) grid.set(k,[]); grid.get(k).push(i);});
const rows=[]; let worst=0;
for(let k=0;k<ai.length;k++){const q=ai[k].pos; let best=1e18,bi=-1; const gx=Math.floor(q[0]/G),gz=Math.floor(q[2]/G);
 for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const L=grid.get((gx+a)+','+(gz+b)); if(!L) continue; for(const j of L){const s=S[j].pos; const d=(s[0]-q[0])**2+(s[1]-q[1])**2+(s[2]-q[2])**2; if(d<best){best=d;bi=j;}}}
 const dist=Math.sqrt(best); worst=Math.max(worst,dist); rows.push({k,ai:ai[k].length,doc:S[bi].s,seg:S[bi].seg,id:segments[S[bi].seg].id,dist});}
console.log('worst distance AI point to nearest path sample (m)',worst.toFixed(4));
// the offset doc - ai, its spread
const offs=rows.map(r=>((r.doc-r.ai)%p.lengthM+p.lengthM)%p.lengthM);
const srt=offs.slice().sort((a,b)=>a-b); console.log('doc-ai offset: min',srt[0].toFixed(3),'median',srt[srt.length>>1].toFixed(3),'max',srt[srt.length-1].toFixed(3));
console.log('AI point 0 at',ai[0].pos.map(x=>x.toFixed(3)).join(','),'-> doc s',rows[0].doc.toFixed(2),rows[0].id);
for(const r of rows) if((r.ai>=3100&&r.ai<=3460)||r.k<3||r.k>ai.length-3) console.log('ai',r.ai.toFixed(1).padStart(8),'doc',r.doc.toFixed(1).padStart(8),r.id.padEnd(4),'d',r.dist.toFixed(3));
fs.writeFileSync('map.json',JSON.stringify(rows));
