const fs=require('fs'),path=require('path');const T='C:/Users/nname/Downloads/t180-wt-land413';
const D=require(path.join(T,'src/core/document.js')), AD=require(path.join(T,'src/core/adapter.js'));
const doc=D.parse(fs.readFileSync('eq-TEST 10.t180track','utf8')); const { segments, path: p }=AD.toPath(doc,{step:0.25});
const P6=doc.pieces.find(x=>x.id==='p6'), P5=doc.pieces.find(x=>x.id==='p5');
console.log('p5 phi channel (deg)',P5.channels.phi.map(x=>(x*180/Math.PI).toFixed(3)).join(' '));
console.log('p6 phi channel (deg)',P6.channels.phi.map(x=>(x*180/Math.PI).toFixed(3)).join(' '));
console.log('p6 kh channel',P6.channels.kh.map(x=>x.toFixed(5)).join(' '));
console.log('p5 end',JSON.stringify(D.pieceEnd(P5)).slice(0,400));
console.log('s        roll(deg)    roll0     roll1   rate0  bankG(deg)  seg');
for(const sm of p.samples){ if(sm.s<3296||sm.s>3312) continue; const seg=segments[sm.seg];
 console.log(sm.s.toFixed(2).padStart(8),(sm.roll*180/Math.PI).toFixed(5).padStart(10),(seg.roll0*180/Math.PI).toFixed(4).padStart(9),(seg.roll1*180/Math.PI).toFixed(4).padStart(9),String(seg.rollRate0).padStart(6),(sm.bankG*180/Math.PI).toFixed(5).padStart(10),seg.id); }
// the ripple at u = 8.4: height of the surface point relative to the linear-in-s roll, over 3300-3320 at 0.25 m
console.log('ripple: s, y(u=8.4) - straight line through the 2 m boundaries (mm)');
const S=p.samples.filter(s=>s.s>=3300&&s.s<=3320); const y=(sm)=>sm.pos[1]+8.4*sm.L[1];
for(let i=0;i<S.length;i++){const sm=S[i]; const a=S[Math.floor(i/8)*8], b=S[Math.min(S.length-1,Math.floor(i/8)*8+8)]; const t=(sm.s-a.s)/(b.s-a.s||1); const lin=y(a)+(y(b)-y(a))*t; console.log(sm.s.toFixed(2).padStart(8),((y(sm)-lin)*1000).toFixed(2).padStart(8));}
