const T='C:/Users/nname/Desktop/a-d188-wt/';const D=require(T+'src/core/document.js'),{extend}=require(T+'src/core/extend.js'),{close}=require(T+'src/core/close.js');
const Rr=180,Q=Math.PI*Rr/2;
for(const tail of [40,12,8,6,4,3,2]){let d=extend(D.createDoc('s'),{length:300,family:'bowl'});for(let i=0;i<4;i++)d=extend(d,{length:Q,transition:40,targets:{kh:1/Rr,c:150}});d=extend(d,{length:tail,transition:Math.min(40,tail),targets:{kh:0}});
 try{const r=close(d,{edited:[0]});console.log(tail,'converged',r.converged,r.report.slice(0,70));}catch(e){console.log(tail,'THROWS',e.code,e.message.slice(0,110));}}
