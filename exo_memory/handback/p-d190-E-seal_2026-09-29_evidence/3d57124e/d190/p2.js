const T='C:/Users/nname/Desktop/a-d188-wt/';const D=require(T+'src/core/document.js'),{extend}=require(T+'src/core/extend.js'),{close}=require(T+'src/core/close.js'),A=require(T+'src/core/adapter.js');
const P=require(T+'src/geom/profile.js');
const Rr=180,Q=Math.PI*Rr/2;
for (const tailLen of [8, 12, 30]) for (const [fam,w] of [['half-pipe',24],['bowl',16]]) {
 let d=extend(D.createDoc('s'),{length:300,family:fam,first:{w}});const edge=D.legacyEdgeDeg(fam,w,D.channelAt(d.pieces[0],'r',300).v);
 for(let i=0;i<4;i++)d=extend(d,{length:Q,transition:40,targets:{kh:1/Rr}});   // legacy turns
 d=extend(d,{length:tailLen,transition:Math.min(6,tailLen),targets:{kh:0,c:edge}});
 try{const r=close(d,{edited:[0]});const st=P.jointSteps(A.toSegments(r.doc),true).filter(x=>x.lap||x.m>1e-3).map(x=>[x.j,x.lap,+(x.m*1000).toFixed(2)]);console.log(fam,w,tailLen,'converged',r.converged,r.report.slice(0,90),JSON.stringify(st));}catch(e){console.log(fam,w,tailLen,'THROWS',e.code,e.message.slice(0,140));}
}
