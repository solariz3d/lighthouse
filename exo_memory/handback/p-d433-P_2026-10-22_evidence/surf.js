const fs=require('fs'),path=require('path');const [T,K,AI,A,B]=process.argv.slice(2);
const { readKn5 }=require(path.join(T,'tools/kn5.cjs')); const { readAiLine }=require(path.join(T,'src/export/ailine.js'));
const kn=readKn5(K); const ai=readAiLine(fs.readFileSync(AI)).points;
const names=[...new Set(kn.meshes.map(m=>m.name.replace(/_p\d+.*$/,'').replace(/\d+$/,'')))].slice(0,12); console.log('mesh kinds',names.join(' '));
const road=kn.meshes.filter(m=>/ROAD|body/i.test(m.name)&&!/WALL|catch/i.test(m.name));
// triangles into a grid (xz)
const G=10, grid=new Map(); const tris=[];
for(const m of road){for(let k=0;k<m.idx.length;k+=3){const t=[m.idx[k],m.idx[k+1],m.idx[k+2]].map(i=>[m.pos[i*3],m.pos[i*3+1],m.pos[i*3+2]]); const id=tris.push({t,name:m.name})-1; const xs=t.map(p=>p[0]),zs=t.map(p=>p[2]);
 for(let gx=Math.floor(Math.min(...xs)/G);gx<=Math.floor(Math.max(...xs)/G);gx++)for(let gz=Math.floor(Math.min(...zs)/G);gz<=Math.floor(Math.max(...zs)/G);gz++){const k2=gx+','+gz; if(!grid.has(k2)) grid.set(k2,[]); grid.get(k2).push(id);}}}
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],cr=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
function ray(o,d){let best=null;const L=grid.get(Math.floor(o[0]/G)+','+Math.floor(o[2]/G))||[];for(const id of L){const [a,b,c]=tris[id].t;const e1=sub(b,a),e2=sub(c,a),p=cr(d,e2),det=dot(e1,p);if(Math.abs(det)<1e-12)continue;const iv=1/det,tv=sub(o,a),u=dot(tv,p)*iv;if(u<0||u>1)continue;const q=cr(tv,e1),v=dot(d,q)*iv;if(v<0||u+v>1)continue;const t=dot(e2,q)*iv;if(t>0&&(!best||t<best.t))best={t,name:tris[id].name};}return best;}
for(let i=0;i<ai.length;i++){const p=ai[i]; if(p.length<+A||p.length>+B) continue; const q=ai[(i+1)%ai.length].pos; let f=sub(q,p.pos); const fl=Math.hypot(...f); f=f.map(x=>x/fl);
 let lat=cr([0,1,0],f); const ll=Math.hypot(...lat); lat=lat.map(x=>x/ll);
 const down=ray([p.pos[0],p.pos[1]+5,p.pos[2]],[0,-1,0]); const h=down?5-down.t:NaN;
 // lateral extent of surface at 3 m above
 let lo=null,hi=null; for(let u=-25;u<=25;u+=0.25){const o=[p.pos[0]+lat[0]*u,p.pos[1]+8,p.pos[2]+lat[2]*u]; const r=ray(o,[0,-1,0]); if(r&&r.t<16){ if(lo===null) lo=u; hi=u; }}
 console.log(p.length.toFixed(0).padStart(6),'surf-ai',isNaN(h)?' none':h.toFixed(3).padStart(7),'extent',lo===null?'-':lo.toFixed(2)+'..'+hi.toFixed(2),'centre',lo===null?'-':((lo+hi)/2).toFixed(2), down?down.name:'');}
