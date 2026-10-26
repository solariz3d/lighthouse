// stats.js (D475, pane E): counts only over the lineage month files; never prints a message's text
'use strict';
const fs = require('fs'), path = require('path');
const D = 'C:/Consonance/private/third_place/lineage';
const HDR = /^### (\S*) · (.+) · (\d+) chars$/;
let total = 0, minLen = Infinity, seats = new Map(), chairLike = 0, bad = 0;
for (const f of fs.readdirSync(D).filter((x) => /^keeper_.*\.md$/.test(x))) {
  const s = fs.readFileSync(path.join(D, f), 'utf8');
  const head = s.indexOf('\n\n') + 2; let i = head, n = 0, rebuilt = s.slice(0, head);
  const parts = [];
  while (i < s.length) {
    const e = s.indexOf('\n', i), line = s.slice(i, e), m = HDR.exec(line);
    if (!m) { bad++; break; }
    const len = +m[3], t = s.substr(e + 2, len);
    parts.push(`${line}\n\n${t}\n`); n++; total++; minLen = Math.min(minLen, len);
    seats.set(m[2], (seats.get(m[2]) || 0) + 1);
    if (/^\[chair:/.test(t)) chairLike++;
    i = e + 2 + len + 2;
  }
  rebuilt += parts.join('\n');
  console.log(f, 'entries', n, 'reparse byte-equal', rebuilt === s, 'bytes', Buffer.byteLength(s));
}
console.log('total', total, 'min chars', minLen, 'unparsed', bad, 'starting [chair:', chairLike);
console.log('seats', JSON.stringify([...seats]));
