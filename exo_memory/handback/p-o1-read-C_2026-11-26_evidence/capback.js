// capback.js: removes the two O1 branches (secondMinM's and spanHolds' kh/kv lines), restoring ceb21f5's capped ceiling for the turn and the climb
const fs=require('fs'),f='src/core/extend.js',L=fs.readFileSync(f,'utf8').split('\n');
const hit=L.map((l,i)=>[l,i]).filter(([l])=>l.trimStart().startsWith("if ((ch === 'kh' || ch === 'kv') && share > 0) return "));
if(hit.length!==2)throw new Error('expected 2 O1 branch lines, found '+hit.length);
fs.writeFileSync(f,L.filter((_,i)=>!hit.some(([,j])=>j===i)).join('\n'));console.log('removed lines',hit.map(([,i])=>i+1).join(', '));
