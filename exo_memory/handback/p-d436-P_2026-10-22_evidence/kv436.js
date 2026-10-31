// kv436.js (D436, P): what the driver's seat feels at the closer's joints: the core's vertical curvature kv (deg per 100 m), pitch and height along s through each joint,
// and the vertical acceleration v^2*kv at a given speed; the largest |kv| in each new piece.   node kv436.js <tree> <save> <jointsCSV> <kmh> [every=10] [span=100]
const fs=require('fs'),path=require('path'); const [T,F,J,KMH,EV,SPAN]=process.argv.slice(2); const every=EV?+EV:10, span=SPAN?+SPAN:100, v=(+KMH)/3.6;
const D=require(path.join(T,'src/core/document.js')), AD=require(path.join(T,'src/core/adapter.js'));
const doc=D.parse(fs.readFileSync(F,'utf8')); const { path: p }=AD.toPath(doc,{step:2}); const S=p.samples, LAP=doc.pieces.reduce((a,q)=>a+q.length,0);
const s0=[]; { let a=0; for(const P of doc.pieces){ s0.push(a); a+=P.length; } }
const at=(s)=>{ s=((s%LAP)+LAP)%LAP; let i=doc.pieces.findIndex((P,k)=>s>=s0[k]&&s<s0[k]+P.length); if(i<0) i=doc.pieces.length-1; const P=doc.pieces[i]; const V=D.valuesAt(P, Math.max(0,Math.min(P.length,s-s0[i]))); let j=Math.min(S.length-1,Math.max(0,Math.round(s/2))); return { piece:P.id, kv:V.kv, kh:V.kh, phi:V.phi, y:S[j].pos[1], pitch:Math.asin(Math.max(-1,Math.min(1,S[j].T[1]))) }; };
const p100=(k)=>k*100*180/Math.PI;
for(const j of J.split(',').map(Number)){ console.log(`\njoint s ${j}: s, piece, kv deg/100m, pitch deg, height m, vertical g at ${KMH} km/h (+ pushes the car into the road)`);
 for(let s=j-span; s<=j+span; s+=every){ const r=at(s); console.log(String(s).padStart(7), r.piece.padEnd(4), p100(r.kv).toFixed(3).padStart(8), (r.pitch*180/Math.PI).toFixed(3).padStart(8), r.y.toFixed(3).padStart(9), (v*v*r.kv/9.81).toFixed(3).padStart(8)); } }
console.log('\nper piece: largest |kv| (deg/100 m) and where, net climb (m):');
for(const [i,P] of doc.pieces.entries()){ if(i<19) continue; let m=0,ms=0; for(let s=0;s<=P.length;s+=1){ const k=Math.abs(D.valuesAt(P,s).kv); if(k>m){m=k;ms=s;} } const ya=at(s0[i]).y, yb=at(s0[i]+P.length-0.001).y; console.log(P.id.padEnd(4),'len',P.length.toFixed(0).padStart(5),'max|kv|',p100(m).toFixed(3).padStart(7),'at s',(s0[i]+ms).toFixed(0).padStart(6),'climb',(yb-ya).toFixed(2).padStart(8),'m', 'vertical g at',KMH,'km/h:',(v*v*m/9.81).toFixed(2)); }
