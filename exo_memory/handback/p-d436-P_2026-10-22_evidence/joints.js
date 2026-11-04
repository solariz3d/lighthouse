// joints.js: at every joint of a save (and the lap seam), every channel's value from the piece before (at its end) and the piece after (at 0), the cup and edge fields, and the top-level keys that differ between two saves.
const fs=require('fs'),path=require('path'); const [T,A,B]=process.argv.slice(2);
const D=require(path.join(T,'src/core/document.js'));
const a=D.parse(fs.readFileSync(A,'utf8'));
if(B){ const ra=JSON.parse(fs.readFileSync(A,'utf8')), rb=JSON.parse(fs.readFileSync(B,'utf8')); for(const k of new Set([...Object.keys(ra),...Object.keys(rb)])) if(JSON.stringify(ra[k])!==JSON.stringify(rb[k])) console.log('top-level differs:',k, String(JSON.stringify(ra[k])).slice(0,300),'| B:',String(JSON.stringify(rb[k])).slice(0,300)); }
const P=a.pieces, chans=Object.keys(P[0].channels);
console.log('piece  cup edge  family | knots');
for(const p of P) console.log(p.id.padEnd(5),String(p.cup).padStart(4),String(p.edge).padStart(5),String(p.family).padEnd(8),'|',JSON.stringify(p.knots).slice(0,80));
console.log('\njoint       '+chans.map(c=>c.padStart(9)).join(''));
for(let i=0;i<P.length;i++){ const p=P[i], q=P[(i+1)%P.length]; const va=D.valuesAt(p,p.length), vb=D.valuesAt(q,0);
 console.log((p.id+'|'+q.id).padEnd(9),'end '+chans.map(c=>va[c].toFixed(4).padStart(9)).join(''));
 console.log(''.padEnd(9),'next'+chans.map(c=>vb[c].toFixed(4).padStart(9)).join(''));
 const d=chans.filter(c=>Math.abs(va[c]-vb[c])>1e-6); if(d.length) console.log(''.padEnd(9),'STEP in',d.join(' ')); }
