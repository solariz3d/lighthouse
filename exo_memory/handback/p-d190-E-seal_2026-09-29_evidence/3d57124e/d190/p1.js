const T='C:/Users/nname/Desktop/a-d188-wt/';const D=require(T+'src/core/document.js'),{extend}=require(T+'src/core/extend.js'),{close}=require(T+'src/core/close.js'),A=require(T+'src/core/adapter.js'),V=require(T+'src/validate/index.js');
const Rr=180,Q=Math.PI*Rr/2;let d=extend(D.createDoc('s'),{length:300,family:'half-pipe',first:{w:24}});const edge=D.legacyEdgeDeg('half-pipe',24,D.channelAt(d.pieces[0],'r',300).v);
for(let i=0;i<4;i++)d=extend(d,{length:Q,transition:40,targets:{kh:1/Rr,c:i===3?edge:90}});d=extend(d,{length:60,transition:40,targets:{kh:0}});
const r=close(d,{edited:[0]});const b=A.toPath(r.doc,{cupRuns:false});const res=V.validate(b.path,b.segments,{designSpeed:100});
console.log(JSON.stringify(res.red.filter(x=>x.reason==='joint-step')), require(T+'src/geom/profile.js').jointSteps(b.segments,true).filter(x=>x.m>1e-3).map(x=>[x.j,x.lap,x.m]).slice(0,8));
