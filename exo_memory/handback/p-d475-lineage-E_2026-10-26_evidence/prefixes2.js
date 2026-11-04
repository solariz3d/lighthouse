// prefixes2.js (D475, pane E): the bracketed head form of machine-looking rows (up to its first ']' or 12 chars), counted; no message text past it
'use strict';
const fs = require('fs'), path = require('path'), D = 'C:/Consonance/private/third_place/lineage', HDR = /^### (\S*) · (.+) · (\d+) chars$/, c = new Map();
for (const f of fs.readdirSync(D).filter((x) => /^keeper_.*\.md$/.test(x))) {
  const s = fs.readFileSync(path.join(D, f), 'utf8'); let i = s.indexOf('\n\n') + 2;
  while (i < s.length) {
    const e = s.indexOf('\n', i), m = HDR.exec(s.slice(i, e)), len = +m[3], t = s.substr(e + 2, len);
    const p = /^\[(pane|librarian|committee|chair|duration|RESPONSE|SYSTEM)[^\]\n]{0,12}\]?/.exec(t);
    if (p) { const k = p[0].replace(/:[A-Z]\]/, ':X]'); c.set(k, (c.get(k) || 0) + 1); }
    i = e + 4 + len;
  }
}
console.log(JSON.stringify([...c].sort((a, b) => b[1] - a[1])));
