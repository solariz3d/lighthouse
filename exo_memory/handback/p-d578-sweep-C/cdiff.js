// cdiff.js <repo> <rev> <dir> [--suspect]: the comments that changed between <rev> and the working tree, as before/after pairs (comment text only), in
// order. --suspect: only the pairs whose AFTER text holds a new short parenthesis ("(placement)", "(follow-up)") or opens on a dangling word.
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { comments } = require('./jsscan.js');
const [, , repo, rev, dir, flag] = process.argv;
const files = execFileSync('git', ['-C', repo, 'diff', '--name-only', rev, '--', dir], { encoding: 'utf8' }).trim().split('\n').filter((f) => /\.c?js$/.test(f));
const SHORT = /\((?:[A-Za-z-]+(?: [A-Za-z-]+)?)\)/g, DANGLE = /^(?:\/\/|\/\*\*?|\*)\s*(?:'s|,|;|and |or |the [a-z]+'s\b|of |by |in )/;
let n = 0;
for (const f of files) {
  const a = execFileSync('git', ['-C', repo, 'show', `${rev}:${f}`], { encoding: 'utf8', maxBuffer: 1 << 26 }), b = fs.readFileSync(path.join(repo, f), 'utf8');
  const ca = comments(a).map((c) => a.slice(c.start, c.end)), cb = comments(b).map((c) => b.slice(c.start, c.end));
  if (ca.length !== cb.length) { console.log(`!! ${f}: comment count ${ca.length} -> ${cb.length}`); continue; }
  for (let i = 0; i < ca.length; i++) if (ca[i] !== cb[i]) {
    const newShort = (cb[i].match(SHORT) || []).filter((m) => !ca[i].includes(m)), dangle = cb[i].split('\n').some((l) => DANGLE.test(l.trim()));
    if (flag === '--suspect' && !newShort.length && !dangle) continue;
    n++; console.log(`-- ${f} #${i}${newShort.length ? ' NEW ' + newShort.join(' ') : ''}${dangle ? ' DANGLE' : ''}\n   - ${ca[i].replace(/\s+/g, ' ').slice(0, 260)}\n   + ${cb[i].replace(/\s+/g, ' ').slice(0, 260)}`);
  }
}
console.log(`${n} pair(s)`);
