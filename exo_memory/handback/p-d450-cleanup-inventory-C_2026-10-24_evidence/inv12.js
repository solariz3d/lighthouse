// inv12.js: items 1, 2 and 8 of D450, read-only. git commands used: worktree list, status, rev-parse, merge-base, for-each-ref, log. Nothing is written but the output json.
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { walk } = require('./walk.js');
const DL = 'C:/Users/nname/Downloads', REPO = DL + '/t180-track-builder';
const git = (cwd, ...a) => { try { return execFileSync('git', ['--no-optional-locks', ...a], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 26 }).trim(); } catch (e) { return { err: String(e.stderr || e.message).trim().split('\n')[0] }; } };
const isAnc = (a, b) => { try { execFileSync('git', ['merge-base', '--is-ancestor', a, b], { cwd: REPO, stdio: 'ignore' }); return true; } catch { return false; } };
const BASES = ['refs/heads/local-0.4.17', 'refs/heads/local-0.4.18'];   // "merged into local-0.4.17 1e436f6 or later"
const merged = (sha) => BASES.find((b) => isAnc(sha, b)) || '';
const out = { at: new Date().toISOString(), bases: BASES.map((b) => b + ' ' + git(REPO, 'rev-parse', '--short', b)) };

// item 1
const wt = [];
let cur = null;
for (const l of git(REPO, 'worktree', 'list', '--porcelain').split('\n')) {
  if (l.startsWith('worktree ')) { cur = { path: l.slice(9) }; wt.push(cur); }
  else if (l.startsWith('HEAD ')) cur.head = l.slice(5, 12);
  else if (l.startsWith('branch ')) cur.branch = l.slice(18);
  else if (l === 'detached') cur.branch = '(detached)';
  else if (l.startsWith('prunable')) cur.prunable = l;
  else if (l.startsWith('locked')) cur.locked = l;
}
for (const w of wt) {
  const exists = fs.existsSync(w.path);
  w.exists = exists;
  w.mergedInto = merged(w.head);
  if (exists) {
    const st = git(w.path, 'status', '--porcelain', '--untracked-files=normal');
    w.dirty = typeof st === 'string' ? st.split('\n').filter(Boolean).length : st.err;
    Object.assign(w, walk(w.path, { skip: ['.git'] }));
    w.headDate = git(w.path, 'log', '-1', '--format=%cI');
  }
}
out.worktrees = wt;

// item 2: t180-* in Downloads that are not worktrees
const wtSet = new Set(wt.map((w) => path.resolve(w.path).toLowerCase()));
const other = [];
for (const n of fs.readdirSync(DL)) {
  if (!/^t180-/i.test(n)) continue;
  const p = path.join(DL, n);
  if (wtSet.has(path.resolve(p).toLowerCase())) continue;
  const st = fs.lstatSync(p), o = { name: n, kind: st.isSymbolicLink() ? 'LINK' : st.isDirectory() ? 'dir' : 'file' };
  if (o.kind === 'dir') {
    const g = path.join(p, '.git');
    o.git = fs.existsSync(g) ? (fs.statSync(g).isDirectory() ? 'clone' : 'gitfile:' + fs.readFileSync(g, 'utf8').trim().slice(8)) : '';
    if (o.git) { o.head = git(p, 'log', '-1', '--format=%h %cI %s'); o.branch = git(p, 'rev-parse', '--abbrev-ref', 'HEAD'); const s = git(p, 'status', '--porcelain'); o.dirty = typeof s === 'string' ? s.split('\n').filter(Boolean).length : s.err; const h = git(p, 'rev-parse', 'HEAD'); o.inMain = typeof h === 'string' ? (git(REPO, 'cat-file', '-t', h) === 'commit' ? (merged(h) || 'in repo, unmerged') : 'NOT in main repo') : ''; }
    o.top = fs.readdirSync(p).slice(0, 12).join(' ');
    Object.assign(o, walk(p));
  } else { o.bytes = st.size; o.newest = new Date(st.mtimeMs).toISOString().slice(0, 16) + 'Z'; o.links = []; }
  other.push(o);
}
out.others = other;

// item 8: merged branches with no worktree
const used = new Set(wt.map((w) => w.branch));
const br = git(REPO, 'for-each-ref', '--format=%(refname:short)|%(objectname:short)|%(committerdate:iso-strict)', 'refs/heads').split('\n').map((l) => { const [name, sha, date] = l.split('|'); return { name, sha, date }; });
out.branches = br.map((b) => ({ ...b, worktree: used.has(b.name), mergedInto: merged(b.sha) }));
fs.writeFileSync(path.join(__dirname, 'inv12.json'), JSON.stringify(out, null, 1));
console.log(`worktrees ${wt.length}; others ${other.length}; branches ${br.length}`);
