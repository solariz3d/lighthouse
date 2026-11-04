// For stations in [A,B] (document s): the road's lean toward the curve's centre, deg = asin(U · k̂), + = leaning INTO the curve (supports the car).
const fs=require('fs'),path=require('path');const [T,F,A,B]=process.argv.slice(2);
const D=require(path.join(T,'src/core/document.js'));const J=require(path.join(T,'app/core/overlapjob.js'));const G=require(path.join(T,'src/geom/index.js'));
const doc=D.parse(fs.readFileSync(F,'utf8'));const r=J.resolveDoc(doc);let p=G.buildPath(r.segments,{step:2,closed:r.closed,start:r.start}); if(r.lift) p=r.lift(p);
let n=0,into=0,out=0,sum=0,rows=[];
for(const q of p.samples){ if(q.s<+A||q.s>+B) continue; const k=q.kvec, km=Math.hypot(...k); if(km<1/600) continue; const kh=k.map(x=>x/km); const lean=Math.asin(Math.max(-1,Math.min(1,q.U[0]*kh[0]+q.U[1]*kh[1]+q.U[2]*kh[2])))*180/Math.PI; n++; sum+=lean; if(lean>5) into++; if(lean<-5) out++; if(n%40===0) rows.push(q.s.toFixed(0)+':R'+(1/km).toFixed(0)+':'+lean.toFixed(0)); }
console.log(path.basename(F),'curved stations',n,'mean lean into',(sum/n).toFixed(1),'deg; >5 into',into,'; >5 OUT',out); console.log(rows.join(' '));
