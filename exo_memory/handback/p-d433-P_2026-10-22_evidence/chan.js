// chan.js: the document's channels and the core path's frame along s over a window: what the core says the road is there.
const fs=require('fs'),path=require('path');const [T,F,A,B]=process.argv.slice(2);
const D=require(path.join(T,'src/core/document.js')), AD=require(path.join(T,'src/core/adapter.js'));
const doc=D.parse(fs.readFileSync(F,'utf8')); const { segments, path: p }=AD.toPath(doc,{step:2});
let s0=0; const starts=[]; for(const P of doc.pieces){starts.push([P.id,s0,P]); s0+=P.length;}
const pieceAt=(s)=>{let r=starts[0]; for(const x of starts) if(x[1]<=s) r=x; return r;};
console.log('s      piece  d      kh        kv        phi(deg)  w     r      c      e      er     s(frac) | path: bankG(deg) grade  pos.y   |kvec|   roll(deg)');
for(const sm of p.samples){ if(sm.s<+A||sm.s>+B) continue; const [id,ps,P]=pieceAt(sm.s); const d=Math.min(sm.s-ps,P.length); const ch=(c)=>D.channelAt(P,c,d).v;
 console.log(sm.s.toFixed(0).padStart(6),id.padEnd(5),d.toFixed(0).padStart(5),ch('kh').toFixed(5).padStart(9),ch('kv').toFixed(5).padStart(9),(ch('phi')*180/Math.PI).toFixed(2).padStart(9),ch('w').toFixed(1).padStart(6),ch('r').toFixed(2).padStart(6),ch('c').toFixed(2).padStart(6),ch('e').toFixed(2).padStart(6),ch('er').toFixed(2).padStart(6),ch('s').toFixed(2).padStart(6),' |',(sm.bankG*180/Math.PI).toFixed(2).padStart(8),sm.grade.toFixed(4).padStart(8),sm.pos[1].toFixed(3).padStart(8),Math.hypot(...sm.kvec).toFixed(5).padStart(8),(sm.roll*180/Math.PI).toFixed(2).padStart(8), segments[sm.seg].id, segments[sm.seg].blend?'blend':'', segments[sm.seg].profile?segments[sm.seg].profile.font:'');}
