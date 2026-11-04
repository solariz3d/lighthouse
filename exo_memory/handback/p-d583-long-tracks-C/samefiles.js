// samefiles.js <dirA> <dirB>: every file under both, by relative path: sha256 equal or not (the builder's marker file compared without its "written" time).
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const list = (d) => { const r = new Map(); const walk = (p) => { for (const f of fs.readdirSync(p)) { const q = path.join(p, f); if (fs.statSync(q).isDirectory()) walk(q); else r.set(path.relative(d, q), q); } }; walk(d); return r; };
const hash = (q) => { let b = fs.readFileSync(q); if (/\.t180b-builder\.json$/.test(q)) b = Buffer.from(b.toString('utf8').replace(/"written": "[^"]*"/, '"written": "-"')); return crypto.createHash('sha256').update(b).digest('hex').slice(0, 16); };
const [A, B] = process.argv.slice(2).map(list); let same = 0, diff = 0;
for (const k of new Set([...A.keys(), ...B.keys()])) {
  const a = A.has(k) ? hash(A.get(k)) : 'MISSING', b = B.has(k) ? hash(B.get(k)) : 'MISSING';
  if (a === b) same++; else { diff++; console.log(`DIFFERS ${k}: ${a} vs ${b}`); }
}
console.log(`${same} same, ${diff} differ`);
