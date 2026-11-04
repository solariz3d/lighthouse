const T='C:/Users/nname/Desktop/a-d195-wt/';const D=require(T+'src/core/document.js'),{extend}=require(T+'src/core/extend.js'),A=require(T+'src/core/adapter.js'),PF=require(T+'src/geom/profile.js');
const ch=Object.fromEntries(D.CHANNELS.map((c)=>[c,c==='w'?(s)=>4+0.25*s:c==='r'?()=>2:()=>0]));
const legacy=D.appendPiece(D.createDoc('s'),D.roadPiece({length:20,family:'bowl',from:null,channels:ch}));
// (a) legacy then cup
let d=extend(legacy,{length:80,transition:40,targets:{c:60}});let segs=A.toSegments(d);const li=segs.findIndex((g)=>g.id==='p2')-1;
console.log('legacy->cup step mm',(PF.stepBetween(PF.readAt(segs[li],segs[li].length),PF.readAt(segs[li+1],0))*1000).toFixed(3),'chord',!!segs[li].chord);
// (b) lap: cup first, legacy last  (built through extend first piece cup then hand legacy)
try{let e=extend(D.createDoc('m'),{length:60,family:'bowl',first:{w:4,c:20}});console.log('cup first ok');}catch(x){console.log('ERR',x.code,x.message)}
