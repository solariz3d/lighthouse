// count.js <repo> <rev|WORKTREE> <dir>...: pointer counts INSIDE COMMENTS ONLY (jsscan.comments), and separately inside code (strings), per kind.
// Kinds: decision numbers (D + 2-4 digits), exo_memory/ and docs/research/ paths, seat words (pane X, seat X, librarian, the chair, sibling-), the word.
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { comments } = require('./jsscan.js');
const [, , repo, rev, ...dirs] = process.argv;
const K = { 'decision numbers': /\bD\d{2,4}[a-z]?\b/g, 'room paths': /exo_memory\/|docs\/research\//g, 'seat words': /\bpane [A-Z]\b|\bseat [A-Z]\b|librarian|\bthe chair\b|sibling-/gi, keeper: /keeper/gi };
const read = (f) => rev === 'WORKTREE' ? fs.readFileSync(path.join(repo, f), 'utf8') : execFileSync('git', ['-C', repo, 'show', `${rev}:${f}`], { encoding: 'utf8', maxBuffer: 1 << 26 });
for (const dir of dirs) {
  const files = execFileSync('git', ['-C', repo, 'ls-files', dir], { encoding: 'utf8' }).trim().split('\n').filter((f) => /\.c?js$/.test(f));
  const inC = {}, inCode = {}; for (const k of Object.keys(K)) { inC[k] = 0; inCode[k] = 0; }
  for (const f of files) {
    const src = read(f); let code = '', at = 0, com = '';
    for (const c of comments(src)) { code += src.slice(at, c.start); com += src.slice(c.start, c.end) + '\n'; at = c.end; } code += src.slice(at);
    for (const [k, re] of Object.entries(K)) { inC[k] += (com.match(re) || []).length; inCode[k] += (code.match(re) || []).length; }
  }
  console.log(`${dir} @ ${rev}: in comments ${JSON.stringify(inC)}; in code (strings) ${JSON.stringify(inCode)}`);
}
