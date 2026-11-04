// kn5grid.js: the kn5's road triangles in an xz grid, with a ray cast (Möller–Trumbore) that reports the hit's mesh name and barycentric point.
const path=require('path');
module.exports=function(T,K){
 const { readKn5 }=require(path.join(T,'tools/kn5.cjs')); const kn=readKn5(K);
 const road=kn.meshes.filter(m=>/^1ROAD|^1GRIP/i.test(m.name)&&!/WALL|catch|CATCH/i.test(m.name));
 const G=10, grid=new Map(), tris=[];
 for(const m of road){for(let k=0;k<m.idx.length;k+=3){const t=[m.idx[k],m.idx[k+1],m.idx[k+2]].map(i=>[m.pos[i*3],m.pos[i*3+1],m.pos[i*3+2]]); const id=tris.push({t,name:m.name})-1; const xs=t.map(p=>p[0]),zs=t.map(p=>p[2]);
  for(let gx=Math.floor(Math.min(...xs)/G);gx<=Math.floor(Math.max(...xs)/G);gx++)for(let gz=Math.floor(Math.min(...zs)/G);gz<=Math.floor(Math.max(...zs)/G);gz++){const k2=gx+','+gz; if(!grid.has(k2)) grid.set(k2,[]); grid.get(k2).push(id);}}}
 const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],cr=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
 // nearest hit along d from o, over the cells the ray's xz footprint touches up to maxT
 function ray(o,d,maxT=50){let best=null; const cells=new Set(); for(let t=0;t<=maxT;t+=G/2){cells.add(Math.floor((o[0]+d[0]*t)/G)+','+Math.floor((o[2]+d[2]*t)/G));}
  for(const c of cells){const L=grid.get(c)||[]; for(const id of L){const [a,b,cc]=tris[id].t;const e1=sub(b,a),e2=sub(cc,a),p=cr(d,e2),det=dot(e1,p);if(Math.abs(det)<1e-12)continue;const iv=1/det,tv=sub(o,a),u=dot(tv,p)*iv;if(u<0||u>1)continue;const q=cr(tv,e1),v=dot(d,q)*iv;if(v<0||u+v>1)continue;const t=dot(e2,q)*iv;if(t>0&&t<=maxT&&(!best||t<best.t))best={t,name:tris[id].name,id};}}
  return best;}
 return { kn, road, tris, grid, ray, G };
};
