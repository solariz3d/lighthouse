const path=require('path'),fs=require('fs'),R=process.argv[2],D=require(R+'/src/core/document.js'),{extend}=require(R+'/src/core/extend.js'),DEG=Math.PI/180;
const dir=R+'/test/fixtures',f=D.parse(fs.readFileSync(path.join(dir,fs.readdirSync(dir).find(n=>n.startsWith('F5-'))),'utf8'));
try{const d=extend(f,{length:300,targets:{phi:10*DEG},transition:15,bankShape:'flow'});const P0=f.pieces[f.pieces.length-1],P=d.pieces[d.pieces.length-1];
const a=D.channelAt(P0,'phi',P0.length),b=D.channelAt(P,'phi',0);console.log('LAID joint before',JSON.stringify(a),'after',JSON.stringify(b),'knots',P.knots.length);
let mx=0;for(let s=0;s<=P.length;s+=0.25)mx=Math.max(mx,Math.abs(D.channelAt(P,'phi',s).d1)/DEG);console.log('max roll rate deg/m',mx.toFixed(2),'at 15 m',(D.channelAt(P,'phi',15).v/DEG).toFixed(3));
}catch(e){console.log('REFUSED',e.message)}
