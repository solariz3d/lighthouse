// bump.js: the road's WORLD height along lines of constant lateral u through the joint, two ways: (a) the core's own geometry, pos + X(u)·L + Y(u)·U at a 0.5 m path (the designed surface); (b) a vertical ray onto the kn5 at the same x,z. Then the second difference along s (the vertical acceleration the car would feel at speed v: a = v² · y'').
const fs=require('fs'),path=require('path');const [T,F,K,A,B,US]=process.argv.slice(2);
const D=require(path.join(T,'src/core/document.js')), AD=require(path.join(T,'src/core/adapter.js')), Prof=require(path.join(T,'src/geom/profile.js'));
const doc=D.parse(fs.readFileSync(F,'utf8')); const { segments, path: p }=AD.toPath(doc,{step:0.5}); const S=p.samples;
const g=require('./kn5grid.js')(T,K);
const add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],mul=(a,k)=>[a[0]*k,a[1]*k,a[2]*k];
const segS0=[]; {let a=S[0].s; for(const gg of segments){segS0.push(a); a+=gg.length;}}
const us=US.split(',').map(Number);
const rows=[];
for(const sm of S){ if(sm.s<+A||sm.s>+B) continue; const seg=segments[sm.seg], P=Prof.readAt(seg, sm.s-segS0[sm.seg]); const r={s:sm.s,seg:seg.id,core:[],kn5:[],names:[]};
 for(const u of us){const [X,Y]=Prof.offsetAt(P,u); const w=add(sm.pos,add(mul(sm.L,X),mul(sm.U,Y))); r.core.push(w[1]); const h=g.ray([w[0],w[1]+5,w[2]],[0,-1,0],60); r.kn5.push(h?w[1]+5-h.t:NaN); r.names.push(h?h.name.replace('1ROAD_',''):'-');}
 rows.push(r);}
const f=(x)=>x.toFixed(3).padStart(8);
console.log('u list:',us.join(' '));
console.log('s      seg  | core y at each u | kn5 y at each u | kn5-core (mm) | d2y/ds2 core (1/m, x1000) at each u');
for(let i=0;i<rows.length;i++){const r=rows[i]; const d2=us.map((u,k)=> i>0&&i<rows.length-1&&rows[i+1].s-rows[i-1].s<1.01 ? (rows[i+1].core[k]-2*r.core[k]+rows[i-1].core[k])/0.25 : NaN);
 console.log(r.s.toFixed(1).padStart(7),r.seg.padEnd(4),'|',r.core.map(f).join(''),'|',r.kn5.map(f).join(''),'|',r.kn5.map((y,k)=>((y-r.core[k])*1000).toFixed(0).padStart(6)).join(''),'|',d2.map(x=>(x*1000).toFixed(2).padStart(8)).join(''),'|',r.names.join(' '));}
fs.writeFileSync('bump.json',JSON.stringify({us,rows}));
