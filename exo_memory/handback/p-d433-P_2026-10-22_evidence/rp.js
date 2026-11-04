const fs=require('fs'),path=require('path');const [T,RP,AI]=process.argv.slice(2);
const { parseReplay, extractCar }=require('C:/Users/nname/Desktop/blackbox/ui/acreplay.js');
const { readAiLine }=require(path.join(T,'src/export/ailine.js'));
const ai=readAiLine(fs.readFileSync(AI)).points; const n=ai.length;
const buf=fs.readFileSync(RP), rep=parseReplay(buf.buffer.slice(buf.byteOffset,buf.byteOffset+buf.byteLength)); const ex=extractCar(rep,0), N=ex.N, dt=ex.dt, P=ex.pos;
console.log('frames',N,'dt',dt.toFixed(4),'s',(N*dt).toFixed(1),'ai pts',n,'ai len',ai[n-1].length.toFixed(0));
// grid index of ai points
const G=20, grid=new Map(); const key=(x,z)=>Math.floor(x/G)+','+Math.floor(z/G);
ai.forEach((p,i)=>{const k=key(p.pos[0],p.pos[2]); if(!grid.has(k)) grid.set(k,[]); grid.get(k).push(i);});
let prev=-1; const out=[];
for(let i=0;i<N;i+=1){const x=P[i*3],y=P[i*3+1],z=P[i*3+2]; let best=1e18,bi=-1; const gx=Math.floor(x/G),gz=Math.floor(z/G);
 for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++){const L=grid.get((gx+a)+','+(gz+b)); if(!L) continue; for(const j of L){const q=ai[j].pos; const d=(q[0]-x)**2+(q[1]-y)**2+(q[2]-z)**2; if(d<best){best=d;bi=j;}}}
 const v=i>0?Math.hypot(P[i*3]-P[i*3-3],P[i*3+1]-P[i*3-2],P[i*3+2]-P[i*3-1])/dt*3.6:0;
 out.push({t:i*dt,s:bi>=0?ai[bi].length:NaN,d:bi>=0?Math.sqrt(best):NaN,dy:bi>=0?y-ai[bi].pos[1]:NaN,kph:v});}
// print every 0.5 s, flag d > 15
const [A,B]=(process.env.WIN||"0,999").split(",").map(Number); for(const r of out){ if(r.t>=A&&r.t<=B&&Math.round(r.t/dt)%7==0) console.log(r.t.toFixed(2),r.s.toFixed(0),r.d.toFixed(1),r.dy.toFixed(2),r.kph.toFixed(0)); }
