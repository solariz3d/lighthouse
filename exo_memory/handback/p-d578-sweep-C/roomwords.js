// roomwords.js <repo> <rev|WORKTREE> <dirs>...: room words left INSIDE COMMENTS (seat possessives, hand-back, ledger, packet, lap, ruling, the chair, librarian, plan_ files, p-dNNN), per kind, with the lines.
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { comments } = require('./jsscan.js');
const [, , repo, rev, ...dirs] = process.argv;
const K = { 'seat possessive': /\b[A-Z]'s\b/g, 'hand-back': /hand-?back/gi, ledger: /\bledger\b/gi, packet: /\bpacket\b/gi, lap: /\blaps?\b/gi, ruling: /\bruling\b/gi, chair: /\bthe chair\b/gi, librarian: /librarian/gi, 'plan_ file': /\bplan_[a-z0-9_]+/g, 'p-d file': /\bp-d\d+/g };
const read = (f) => rev === 'WORKTREE' ? fs.readFileSync(path.join(repo, f), 'utf8') : execFileSync('git', ['-C', repo, 'show', `${rev}:${f}`], { encoding: 'utf8', maxBuffer: 1 << 26 });
for (const dir of dirs) {
  const files = execFileSync('git', ['-C', repo, 'ls-files', dir], { encoding: 'utf8' }).trim().split('\n').filter((f) => /\.c?js$/.test(f));
  const n = {}; for (const k of Object.keys(K)) n[k] = 0; const hits = [];
  for (const f of files) {
    const src = read(f);
    for (const c of comments(src)) {
      const t = src.slice(c.start, c.end), line0 = src.slice(0, c.start).split('\n').length;
      t.split('\n').forEach((l, i) => { for (const [k, re] of Object.entries(K)) { const m = l.match(re); if (m) { n[k] += m.length; hits.push(`${k}\t${f}:${line0 + i}\t${l.trim().slice(0, 150)}`); } } });
    }
  }
  console.log(`${dir} @ ${rev}: ${JSON.stringify(n)}`);
  if (process.env.SHOW) hits.forEach((h) => console.log('  ' + h));
}
