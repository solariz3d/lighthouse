// pieces.js: the save's pieces (id, length, s0..s1, kind), and which differ between two saves (by JSON of the piece).
const fs=require('fs'),path=require('path'); const [T,A,B]=process.argv.slice(2);
const D=require(path.join(T,'src/core/document.js'));
const load=(f)=>D.parse(fs.readFileSync(f,'utf8'));
const a=load(A), b=B?load(B):null;
console.log('keys',Object.keys(a).join(' '),'closed',a.closed,'pieces',a.pieces.length,'channels',Object.keys(a.pieces[0].channels||{}).join(' '), 'pieceKeys', Object.keys(a.pieces[0]).join(' '));
let s=0; for(const [i,p] of a.pieces.entries()){ const same = b && b.pieces[i] ? (JSON.stringify(b.pieces[i])===JSON.stringify(p) ? 'same' : 'DIFF') : (b?'absent-in-B':''); console.log(String(i).padStart(3),p.id.padEnd(5),'len',p.length.toFixed(1).padStart(8),'s',s.toFixed(1).padStart(8),'..',(s+p.length).toFixed(1).padStart(8),p.kind||'',p.role||'',p.from||'',same); s+=p.length; }
console.log('total',s.toFixed(2)); if(b){let t=0; for(const p of b.pieces) t+=p.length; console.log('B pieces',b.pieces.length,'total',t.toFixed(2));}
