// wheels.js: run 2's car over AI 3,150-3,350: each frame's four wheel centres and body position against the kn5 road under them (a ray straight down from 3 m above each wheel), the car's station s and lateral u in the core path's frame, and the surface height under the body along the car's own path.
const fs=require('fs'),path=require('path');const [T,F,K,RP,A,B,TA,TB]=process.argv.slice(2);
const { parseReplay, extractCar }=require('C:/Users/nname/Desktop/blackbox/ui/acreplay.js');
const D=require(path.join(T,'src/core/document.js')), AD=require(path.join(T,'src/core/adapter.js'));
const doc=D.parse(fs.readFileSync(F,'utf8')); const { segments, path: p }=AD.toPath(doc,{step:2}); const S=p.samples;
const g=require('./kn5grid.js')(T,K);
const buf=fs.readFileSync(RP), rep=parseReplay(buf.buffer.slice(buf.byteOffset,buf.byteOffset+buf.byteLength)); const ex=extractCar(rep,0);
const G=10, sg=new Map(); S.forEach((sm,i)=>{const k=Math.floor(sm.pos[0]/G)+','+Math.floor(sm.pos[2]/G); if(!sg.has(k)) sg.set(k,[]); sg.get(k).push(i);});
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
function station(x){let best=1e18,bi=-1;const gx=Math.floor(x[0]/G),gz=Math.floor(x[2]/G);for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const L=sg.get((gx+a)+','+(gz+b));if(!L)continue;for(const j of L){const d=sub(S[j].pos,x);const q=dot(d,d);if(q<best){best=q;bi=j;}}}
 const sm=S[bi], d=sub(x,sm.pos); return { s: sm.s+dot(d,sm.T), u: dot(d,sm.L), v: dot(d,sm.U), sm }; }
const under=(w)=>{const r=g.ray([w[0],w[1]+3,w[2]],[0,-1,0],60); return r?{h:3-r.t,name:r.name}:null;};
const out=[]; console.log('t      s(doc)   u      v     kph   | body-road | wheel centre heights FL FR RL RR | mesh');
for(let i=0;i<ex.N;i++){const t=i*ex.dt; if(t<+TA||t>+TB) continue; const x=[ex.pos[i*3],ex.pos[i*3+1],ex.pos[i*3+2]]; const st=station(x); if(st.s<+A||st.s>+B) continue;
 const v=i>0?Math.hypot(ex.pos[i*3]-ex.pos[i*3-3],ex.pos[i*3+1]-ex.pos[i*3-2],ex.pos[i*3+2]-ex.pos[i*3-1])/ex.dt*3.6:0;
 const bu=under(x); const ws=[]; for(let k=0;k<4;k++){ if(!ex.wheelsOk[i]) { ws.push(null); continue; } const w=[ex.wheels[i*12+k*3],ex.wheels[i*12+k*3+1],ex.wheels[i*12+k*3+2]]; ws.push(under(w)); }
 const row={t,s:st.s,u:st.u,v:st.v,kph:v,body:bu?bu.h:NaN,wh:ws.map(w=>w?w.h:NaN),mesh:bu?bu.name:'-',wok:ex.wheelsOk[i]};
 out.push(row);
 console.log(t.toFixed(3),st.s.toFixed(1).padStart(8),st.u.toFixed(2).padStart(6),st.v.toFixed(2).padStart(6),v.toFixed(0).padStart(5),' |',(bu?bu.h:NaN).toFixed(3).padStart(8),' |',ws.map(w=>w?w.h.toFixed(3).padStart(7):'    nan').join(' '),' |',bu?bu.name:'-');}
fs.writeFileSync('wheels.json',JSON.stringify(out));
