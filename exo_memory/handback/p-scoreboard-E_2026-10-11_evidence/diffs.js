// diffs.js (pane E, D294): for every CHANGED gate pair in <scratch>/pairs.json, the words the re-send removed and added (common prefix and suffix
// trimmed, SOURCES/NEXT/OUTPUT lines stripped as in scoreboard.js), so each can be read and adjudicated. Output goes to the scratch folder only:
// it quotes other seats' message text.  Run: node diffs.js <scratch>/pairs.json > <scratch>/diffs.txt
'use strict';
const fs = require('fs');
const pairs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const strip = (t) => String(t || '').split('\n').filter((l) => !/^\s*\**\s*(SOURCES|NEXT|OUTPUT|Sources)\s*:/i.test(l)).join('\n').replace(/\s+/g, ' ').trim();
let n = 0;
for (const p of pairs) {
  if (!p.changed) continue;
  const A = strip(p.refusedText).split(' '), B = strip(p.nextText).split(' ');
  let s = 0; while (s < A.length && s < B.length && A[s] === B[s]) s++;
  let ea = A.length, eb = B.length; while (ea > s && eb > s && A[ea - 1] === B[eb - 1]) { ea--; eb--; }
  const del = A.slice(s, ea).join(' '), add = B.slice(s, eb).join(' ');
  n++;
  console.log(`#${n} ${p.session} ${p.ts} ${p.cls} ${p.tool} dt=${p.dt}s sim=${p.sim} len ${A.length}->${B.length} | why: ${String(p.why).slice(0, 110)}`);
  console.log(`   - ${del.length > 360 ? del.slice(0, 180) + ' […' + (del.length - 360) + ' chars…] ' + del.slice(-180) : del}`);
  console.log(`   + ${add.length > 360 ? add.slice(0, 180) + ' […' + (add.length - 360) + ' chars…] ' + add.slice(-180) : add}`);
}
