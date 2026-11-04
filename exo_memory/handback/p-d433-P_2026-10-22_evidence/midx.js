// midx.js: along the whole lap every 50 m: the profile's horizontal edges (X of the right and left edge in the station frame), their midpoint (the visual centre of the road's span against the centreline u = 0), and the preview centre line's vertex (look.js linesFor: the row vertex with the smallest |u|) from the mesh's own row samples.
const fs=require('fs'),path=require('path');const T='C:/Users/nname/Downloads/t180-wt-land413';
const D=require(path.join(T,'src/core/document.js')), AD=require(path.join(T,'src/core/adapter.js')), Prof=require(path.join(T,'src/geom/profile.js'));
const doc=D.parse(fs.readFileSync('eq-TEST 10.t180track','utf8')); const { segments, path: p }=AD.toPath(doc,{step:2});
const segS0=[]; {let a=p.samples[0].s; for(const g of segments){segS0.push(a); a+=g.length;}}
console.log('s      piece  c      e     er   | XR       XL      midX   | nearest-to-0 vertex u (mesh samples)  K');
for(const sm of p.samples){ if(sm.s%50!==0) continue; const seg=segments[sm.seg]; const P=Prof.readAt(seg, sm.s-segS0[sm.seg]); const uR=P.u[0], uL=P.u[P.u.length-1]; const XR=Prof.offsetAt(P,uR)[0], XL=Prof.offsetAt(P,uL)[0];
 let Us; if(seg.blend){ const A=Prof.normalize(seg.blend.from); const fr=Array.isArray(seg.fractions)&&seg.fractions.length>=2?seg.fractions:Prof.blendSamples(A,Prof.normalize(seg.profile)); Us=Prof.usOf(Prof.normalize(seg.profile),fr);} else Us=Prof.samplesAcrossFor(Prof.normalize(seg.profile)).u;
 let kc=0; for(let k=1;k<Us.length;k++) if(Math.abs(Us[k])<Math.abs(Us[kc])) kc=k;
 const pc=doc.pieces.find(x=>x.id===seg.id); const d=Math.min(sm.s-segS0.find((v,i)=>segments[i].id===seg.id),pc.length);
 console.log(sm.s.toFixed(0).padStart(6),seg.id.padEnd(5),D.channelAt(pc,'c',d).v.toFixed(1).padStart(5),D.channelAt(pc,'e',d).v.toFixed(0).padStart(4),D.channelAt(pc,'er',d).v.toFixed(0).padStart(4),' |',XR.toFixed(3).padStart(8),XL.toFixed(3).padStart(8),((XR+XL)/2).toFixed(3).padStart(8),' |',Us[kc].toFixed(3).padStart(8),String(Us.length).padStart(5), seg.blend?'blend':'', P.font);}
