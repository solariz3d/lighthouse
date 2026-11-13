// compare.js (O): file by file, landed-live --all's state beside install.ps1 -Check's state, keyed by the file's leaf name.
// node compare.js <landed-live-all.txt> <check-after.txt>
'use strict';
const fs = require('fs'), path = require('path');
const [LL, CK] = process.argv.slice(2);
const read = (p) => fs.readFileSync(p, 'utf8').replace(/^﻿/, '').replace(/\x1b\[[0-9;]*m/g, '').split(/\r?\n/);
const leaf = (s) => path.win32.basename(s.replace(/:$/, ''));
const LLSTATES = ['EXCLUDED BUT LIVE', 'NOT RUN HERE', 'RUNS FROM REPO', 'HOLD EXPIRED', 'LOCAL EDIT', 'EXCLUDED', 'LIVE', 'OWED', 'NEW', 'HELD'];
const ll = new Map();
for (const l of read(LL)) {
  if (/^LIVE-HERE/.test(l)) continue;
  const st = LLSTATES.find((s) => l.startsWith(s + ' '));
  if (st) ll.set(leaf(l.slice(st.length).trim().split(/\s+/)[0]), st);
}
const ck = new Map();
for (const l of read(CK)) {
  const m = l.match(/^(ok|DRIFT|ABSENT|HELD|MISSING|LOCAL)\s+(\S+)/);
  if (m) { const k = leaf(m[2]); if (!ck.has(k)) ck.set(k, m[1]); }
}
const keys = [...new Set([...ll.keys(), ...ck.keys()])];
// Agreement: a bytes-equal -Check state (OK/IN SYNC/EQUAL...) beside LIVE, NOT RUN HERE, EXCLUDED; a bytes-differ state (DRIFT/ABSENT) beside OWED/NEW/EXCLUDED/NOT RUN HERE; HELD beside HELD.
const bytesEqual = (s) => !/DRIFT|ABSENT|MISSING|HELD|LOCAL/.test(s || '');
const agree = (a, c) => {
  if (!a || !c) return 'ONE SIDE ONLY';
  if (a === 'HELD' || c === 'HELD') return a === c ? 'agree' : 'DIFFER';
  if (a === 'LIVE' || a === 'EXCLUDED BUT LIVE') return bytesEqual(c) ? 'agree' : 'DIFFER';
  if (a === 'OWED' || a === 'NEW' || a === 'LOCAL EDIT') return bytesEqual(c) ? 'DIFFER' : 'agree';
  return 'no claim (' + a + ')';
};
let n = 0, ag = 0;
for (const k of keys) {
  const a = ll.get(k), c = ck.get(k), v = agree(a, c);
  n++; if (v === 'agree' || v.startsWith('no claim')) ag++;
  console.log(`${k.padEnd(28)} landed-live ${String(a || '-').padEnd(18)} -Check ${String(c || '-').padEnd(10)} ${v}`);
}
console.log(`${n} files; ${ag} agree or carry no byte claim; ${n - ag} differ or are on one side only`);
