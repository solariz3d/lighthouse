const T='C:/Users/nname/Desktop/a-d188-wt/';const D=require(T+'src/core/document.js'),{extend,channelFn}=require(T+'src/core/extend.js'),{close}=require(T+'src/core/close.js'),A=require(T+'src/core/adapter.js'),{buildMesh}=require(T+'src/geom/mesh.js'),PF=require(T+'src/geom/profile.js');
const Rr=180,Q=Math.PI*Rr/2;
function mirror(fam,w,tailLen){
 let d=extend(D.createDoc('m'),{length:60,family:fam,first:{w,c:60}});
 d=extend(d,{length:Q,transition:40,targets:{kh:1/Rr,c:60}});d=extend(d,{length:Q,transition:40,targets:{kh:1/Rr,c:60}});
 const P=d.pieces[d.pieces.length-1];
 const e=D.legacyEdgeDeg(fam,D.channelAt(P,'w',P.length).v,D.channelAt(P,'r',P.length).v);
 d=extend(d,{length:Q,transition:40,targets:{kh:1/Rr,c:e}});
 const from=D.endState(d),ch=Object.fromEntries(D.CHANNELS.map(c=>[c,channelFn(from[c],c==='kh'?1/Rr:undefined,40)]));
 const piece=D.roadPiece({length:tailLen,family:fam,from,channels:ch,knotM:undefined,cup:false});
 return D.appendPiece(d,piece);}
for(const [fam,w] of [['half-pipe',24],['bowl',16]]){
 try{const d=mirror(fam,w,Q);console.log(fam,'built',d.pieces.map(p=>!!p.cup).join(','));
  const r=close(d,{edited:[d.pieces.length-1]});const segs=A.toSegments(r.doc);console.log(' converged',r.converged,r.report.slice(0,80),'lap steps',JSON.stringify(PF.jointSteps(segs,true).filter(x=>x.lap||x.m>1e-3).map(x=>[x.j,x.lap,+(x.m*1000).toFixed(3)])));
 }catch(e){console.log(fam,'ERR',e.code,e.message.slice(0,200));}}
