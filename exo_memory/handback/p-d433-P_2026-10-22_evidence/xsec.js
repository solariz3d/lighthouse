// xsec.js: at every core station over a window, the kn5's cross-section in the station's own frame (L across, U up): the road vertices within +-0.05 m of the station plane, their extreme u (the edges), the centre vertex's distance from the core's centreline, the horizontal midpoint of the edges, what the core's profile predicts for the same edges (offsetAt), and the mesh names present.
const fs=require('fs'),path=require('path');const [T,F,K,A,B]=process.argv.slice(2);
const D=require(path.join(T,'src/core/document.js')), AD=require(path.join(T,'src/core/adapter.js')), Prof=require(path.join(T,'src/geom/profile.js'));
const doc=D.parse(fs.readFileSync(F,'utf8')); const { segments, path: p }=AD.toPath(doc,{step:2}); const S=p.samples;
const g=require('./kn5grid.js')(T,K);
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],mul=(a,k)=>[a[0]*k,a[1]*k,a[2]*k];
// every road vertex once, in a grid
const V=[]; for(const m of g.road){const seen=new Set(); for(let i=0;i<m.pos.length/3;i++){V.push({p:[m.pos[i*3],m.pos[i*3+1],m.pos[i*3+2]],name:m.name});}}
const G=10, vg=new Map(); V.forEach((v,i)=>{const k=Math.floor(v.p[0]/G)+','+Math.floor(v.p[2]/G); if(!vg.has(k)) vg.set(k,[]); vg.get(k).push(i);});
const segS0=[]; {let a=S[0].s; for(const gg of segments){segS0.push(a); a+=gg.length;}}
console.log('s      seg   | kn5 row: n  uR      uL      ctr|dist  midX    yR      yL    | profile: uR_pred  uL_pred  midX_pred | names');
const rows=[];
for(const sm of S){ if(sm.s<+A||sm.s>+B) continue;
 const near=new Set(); const gx=Math.floor(sm.pos[0]/G),gz=Math.floor(sm.pos[2]/G); for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++){const L=vg.get((gx+a)+','+(gz+b)); if(L) for(const i of L) near.add(i);}
 const row=[]; let ctr=1e9; const names=new Set();
 for(const i of near){const d=sub(V[i].p,sm.pos); const along=dot(d,sm.T); if(Math.abs(along)>0.05) continue; const x=dot(d,sm.L), y=dot(d,sm.U); if(Math.abs(x)>40||Math.abs(y)>40) continue; row.push({x,y,name:V[i].name}); names.add(V[i].name); const dd=Math.hypot(x,y,along); if(dd<ctr) ctr=dd;}
 row.sort((a,b)=>a.x-b.x); if(!row.length){console.log(sm.s.toFixed(0),'no row'); continue;}
 const seg=segments[sm.seg], P=Prof.readAt(seg, sm.s-segS0[sm.seg]); const uR=P.u[0], uL=P.u[P.u.length-1]; const oR=Prof.offsetAt(P,uR), oL=Prof.offsetAt(P,uL);
 const r={s:sm.s,seg:seg.id,n:row.length,uR:row[0].x,uL:row[row.length-1].x,yR:row[0].y,yL:row[row.length-1].y,ctr,midX:(row[0].x+row[row.length-1].x)/2,pR:oR[0],pL:oL[0],pMid:(oR[0]+oL[0])/2,names:[...names].join(' ')};
 rows.push(r);
 console.log(sm.s.toFixed(0).padStart(6),seg.id.padEnd(5),'|',String(r.n).padStart(4),r.uR.toFixed(3).padStart(8),r.uL.toFixed(3).padStart(8),r.ctr.toExponential(1).padStart(9),r.midX.toFixed(3).padStart(7),r.yR.toFixed(3).padStart(7),r.yL.toFixed(3).padStart(7),' |',r.pR.toFixed(3).padStart(8),r.pL.toFixed(3).padStart(8),r.pMid.toFixed(3).padStart(9),' |',r.names);}
fs.writeFileSync('xsec.json',JSON.stringify(rows));
