// chunks.js: every road mesh in the kn5 with its vertex count and the document s-range its vertices cover (nearest core station), and at the p5->p6 joint whether two rows sit at one station.
const fs=require('fs'),path=require('path');const [T,F,K]=process.argv.slice(2);
const D=require(path.join(T,'src/core/document.js')), AD=require(path.join(T,'src/core/adapter.js'));
const doc=D.parse(fs.readFileSync(F,'utf8')); const { segments, path: p }=AD.toPath(doc,{step:2}); const S=p.samples;
const { readKn5 }=require(path.join(T,'tools/kn5.cjs')); const kn=readKn5(K);
const G=10, sg=new Map(); S.forEach((sm,i)=>{const k=Math.floor(sm.pos[0]/G)+','+Math.floor(sm.pos[2]/G); if(!sg.has(k)) sg.set(k,[]); sg.get(k).push(i);});
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
function station(x){let best=1e18,bi=-1;const gx=Math.floor(x[0]/G),gz=Math.floor(x[2]/G);for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const L=sg.get((gx+a)+','+(gz+b));if(!L)continue;for(const j of L){const d=sub(S[j].pos,x);const q=dot(d,d);if(q<best){best=q;bi=j;}}} if(bi<0) return null; const sm=S[bi], d=sub(x,sm.pos); return { s: sm.s+dot(d,sm.T), u: dot(d,sm.L), v: dot(d,sm.U), along: dot(d,sm.T) }; }
console.log('meshes',kn.meshes.length,'materials',kn.materials.map(m=>m.name).join(' '));
for(const m of kn.meshes){ if(!/^1ROAD|^1GRIP/.test(m.name)) continue; let lo=1e9,hi=-1e9; const n=m.pos.length/3; for(let i=0;i<n;i+=7){const st=station([m.pos[i*3],m.pos[i*3+1],m.pos[i*3+2]]); if(!st) continue; if(Math.abs(st.u)>20||Math.abs(st.v)>10) continue; lo=Math.min(lo,st.s); hi=Math.max(hi,st.s);} console.log(m.name.padEnd(24),String(n).padStart(6),'verts',String(m.idx.length/3).padStart(6),'tris  s',lo.toFixed(1).padStart(8),'..',hi.toFixed(1).padStart(8), m.material);}
// rows near the joint: the along-coordinate of every vertex within 3 m of s=3300, grouped by along (to 1 mm) and mesh
const seen=new Map();
for(const m of kn.meshes){ if(!/^1ROAD/.test(m.name)) continue; const n=m.pos.length/3; for(let i=0;i<n;i++){const x=[m.pos[i*3],m.pos[i*3+1],m.pos[i*3+2]]; const st=station(x); if(!st||Math.abs(st.s-3300)>6||Math.abs(st.u)>14||Math.abs(st.v)>5) continue; const k=m.name+' s='+st.s.toFixed(3); seen.set(k,(seen.get(k)||0)+1);} }
console.log('rows within 6 m of s=3300 (mesh, station, vertex count):'); for(const [k,v] of [...seen].sort()) console.log('  ',k,v);
