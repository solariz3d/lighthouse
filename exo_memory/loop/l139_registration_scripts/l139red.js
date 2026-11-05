'use strict';
const path=require('path'),W=process.argv[2];
const D=require(path.join(W,'src/core/document.js')),X=require(path.join(W,'src/core/extend.js')),A=require(path.join(W,'src/core/adapter.js')),V=require(path.join(W,'src/validate/index.js'));
const {extend,channelFn,fitWithHold}=X;
const flat=()=>extend(D.createDoc('e'),{length:1000,family:'bowl'});
function withSecond(prefix,opts,ch,F,T2){const plain=extend(prefix,opts),P=plain.pieces[plain.pieces.length-1],L=P.length,st=D.endState(prefix)[ch];
const f1=channelFn(st,opts.targets[ch],opts.transition,ch,null),f2=channelFn({v:opts.targets[ch],m:0},T2,L-F,ch,null);const ts=[];for(let j=0;j<8;j++)ts.push(+(F+((L-F)*j)/8).toFixed(4));
const add=[...new Set(ts)].filter(k=>k>0.5&&k<L-0.5&&P.knots.every(h=>Math.abs(h-k)>1e-3));const out=D.insertKnots(P,add),U=D.knotVector(out),n=out.channels[ch].length,keep=new Set();for(let i=0;i<n;i++)if(U[i+4]<=F+1e-9)keep.add(i);
fitWithHold(out,ch,s=>s<F?f1(s):f2(s-F),Infinity,T2,keep);return{plain,doc:D.appendPiece(prefix,out)};}
for(const L2 of [20,300]){const r=withSecond(flat(),{length:1000,targets:{kh:1/150},transition:120},'kh',1000-L2,0);
for(const [n,d] of [['with',r.doc],['plain',r.plain]]){const t=A.toPath(extend(d,{length:200}));const v=V.validate(t.path,t.segments);console.log(L2,n,v.red.length,JSON.stringify(v.red.slice(0,2)).slice(0,400));}}
