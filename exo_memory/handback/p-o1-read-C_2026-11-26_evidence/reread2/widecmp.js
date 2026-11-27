'use strict';
// widecmp.js: case by case, wide.js at 0eb3448 against eee621f and ceb21f5: which placed-then-refused cases are new at the tip, and does any laid case stop laying.
const fs=require('fs'),rd=f=>{const m=new Map();for(const l of fs.readFileSync(f,'utf8').split('\n'))if(l.startsWith('PLACED')){const o=JSON.parse(l.slice(l.indexOf('{')));m.set(`${o.ch} ${o.first} ${o.L} [${o.ts}]`,o)}return m};
const tip=rd('rr2/wide_0eb3448.txt');for(const t of ['t180-o1-eee','t180-o1-base']){const o=rd(`rr2/wide_${t}.txt`),newAt=[...tip.keys()].filter(k=>!o.has(k)),fixed=[...o.keys()].filter(k=>!tip.has(k));
 const sameMsg=[...tip.keys()].filter(k=>o.has(k)&&o.get(k).why.slice(0,60)===tip.get(k).why.slice(0,60)).length;
 console.log(`${t}: refused there ${o.size}; refused at the tip and NOT there: ${newAt.length}${newAt.length?' ('+newAt.join('; ')+')':''}; refused there and laid at the tip: ${fixed.length}; refused at both with the same reason: ${sameMsg}`)}
