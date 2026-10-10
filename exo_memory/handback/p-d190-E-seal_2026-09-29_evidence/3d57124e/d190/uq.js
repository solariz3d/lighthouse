const T='C:/Users/nname/Desktop/a-d188-wt/';const D=require(T+'src/core/document.js'),{extend}=require(T+'src/core/extend.js'),A=require(T+'src/core/adapter.js');
for(const [f,w] of [['bowl',12],['half-pipe',24],['bowl',18],['flat',20],['bowl',31],['half-pipe',31.5],['flat',45],['half-pipe',12],['bowl',8]]){
 let d=extend(D.createDoc('j'),{length:100,family:f,first:{w}});d=extend(d,{length:120,transition:60,targets:{c:60}});
 const s=A.toSegments(d),g=s.findIndex(x=>x.id==='p2');const L=s[g-1].profile,C=A.cupProfile(f,w,D.channelAt(d.pieces[1],'c',0).v);
 const nz=(a,b)=>Math.max(...a.map((x,i)=>Math.abs(x-b[i])));
 console.log(f,w,'du',nz(L.u,C.u).toExponential(2),'dpsi deg',(nz(L.psi,C.psi)*180/Math.PI).toFixed(3));}
