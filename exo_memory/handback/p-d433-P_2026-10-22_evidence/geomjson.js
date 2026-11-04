// geomjson.js: the kn5's road triangles within R m of the station at s=S0 (world), the core centreline, the left/right edge polylines and the preview's centre-vertex line (u of the nearest-to-0 vertex), run 2's body path, as JSON for the kn5 shot page.
const fs=require('fs'),path=require('path');const T='C:/Users/nname/Downloads/t180-wt-land413';
const D=require(path.join(T,'src/core/document.js')), AD=require(path.join(T,'src/core/adapter.js')), Prof=require(path.join(T,'src/geom/profile.js'));
const { parseReplay, extractCar }=require('C:/Users/nname/Desktop/blackbox/ui/acreplay.js');
const doc=D.parse(fs.readFileSync('eq-TEST 10.t180track','utf8')); const { segments, path: p }=AD.toPath(doc,{step:2}); const S=p.samples;
const g=require('./kn5grid.js')(T,'out/t180b_test_10/t180b_test_10.kn5');
const S0=3300, R=120; const c0=S.find(s=>s.s===S0).pos;
const tri=[]; for(const t of g.tris){const m=t.t; if(Math.hypot(m[0][0]-c0[0],m[0][2]-c0[2])>R) continue; for(const v of m) tri.push(v[0],v[1],v[2]);}
const add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],mul=(a,k)=>[a[0]*k,a[1]*k,a[2]*k];
const segS0=[]; {let a=S[0].s; for(const gg of segments){segS0.push(a); a+=gg.length;}}
const lines={centre:[],left:[],right:[],drawn:[],u84:[],frames:[]};
for(const sm of S){ if(Math.abs(sm.s-S0)>R+20) continue; const seg=segments[sm.seg], P=Prof.readAt(seg, sm.s-segS0[sm.seg]); const at=(u)=>{const [X,Y]=Prof.offsetAt(P,u); return add(sm.pos,add(mul(sm.L,X),mul(sm.U,Y)));};
 lines.centre.push(at(0)); lines.left.push(at(P.u[P.u.length-1])); lines.right.push(at(P.u[0])); lines.drawn.push(at(0.095)); lines.u84.push(at(8.4)); lines.frames.push({s:sm.s,pos:sm.pos,T:sm.T,L:sm.L,U:sm.U});}
const buf=fs.readFileSync('r.acreplay'), rep=parseReplay(buf.buffer.slice(buf.byteOffset,buf.byteOffset+buf.byteLength)); const ex=extractCar(rep,0);
const car=[]; for(let i=0;i<ex.N;i++){const t=i*ex.dt; if(t<56||t>58.6) continue; car.push([ex.pos[i*3],ex.pos[i*3+1],ex.pos[i*3+2]]);}
fs.writeFileSync('shot/geom.json',JSON.stringify({tri,lines,car,S0}));
console.log('tris',tri.length/9,'centre pts',lines.centre.length,'car pts',car.length);
