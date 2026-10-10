const T='C:/Users/nname/Desktop/a-d188-wt/';const D=require(T+'src/core/document.js'),{extend}=require(T+'src/core/extend.js');
for (const [len,tr,tg] of [[200,40,90],[100,40,150],[30,10,150],[60,20,150]]) {
 let d=extend(D.createDoc('r'),{length:60}); const raw=extend(d,{length:len,transition:tr,targets:{c:tg}}); const P=raw.pieces[1];
 let mx=-1e9,mn=1e9; for(let s=0;s<=P.length;s+=0.25){const v=D.channelAt(P,'c',s).v; mx=Math.max(mx,v); mn=Math.min(mn,v);}
 console.log('len',len,'trans',tr,'target',tg,'| max ctrl',Math.max(...P.channels.c).toFixed(3),'| curve max',mx.toFixed(3),'min',mn.toFixed(3),'| end',D.channelAt(P,'c',P.length).v.toFixed(3));
}
