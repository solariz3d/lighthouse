// prep.js (D450 part 2 step 2, pane E): B's PASS list joined to B's walk rows, so each item carries what B saw (files, bytes, newest).
// Writes items.json. Reads only.
'use strict';
const fs = require('fs');
const EV = 'C:/Users/nname/Desktop/lighthouse/exo_memory/handback/p-d450-verify-B_2026-10-24_evidence/';
const norm = (p) => p.replace(/^~/, 'C:/Users/nname').split('\\').join('/').toLowerCase();
const rows = fs.readFileSync(EV + 'walk.out', 'utf8').trim().split('\n').map((l) => JSON.parse(l)).filter((r) => r.root);
const walk = new Map(rows.map((r) => [norm(r.root), r]));
const checks = JSON.parse(fs.readFileSync(EV + 'checks.json', 'utf8'));
const lists = JSON.parse(fs.readFileSync('C:/Users/nname/Downloads/t180-d450-e/lists.json', 'utf8'));
const items = [];
for (const x of lists.PASS) {
  const full = x.p.replace(/^~/, 'C:/Users/nname');
  const w = walk.get(norm(x.p)) || null;
  items.push({ g: x.g, path: full, bytesB: Number(x.b.replace(/,/g, '')), reason: x.r.replace(/\s*\|\s*$/, ''), walkB: w && { files: w.files, bytes: w.bytes, newest: w.newest, links: w.links.length } });
}
const noWalk = items.filter((i) => !i.walkB && i.g !== 'branch');
fs.writeFileSync('C:/Users/nname/Downloads/t180-d450-e/items.json', JSON.stringify(items, null, 1));
console.log('items', items.length, 'without a walk row', noWalk.length, noWalk.map((i) => i.path));
console.log('checks keys g1 sample', JSON.stringify((checks.g1 || [])[0]).slice(0, 600));
console.log('released FAIL rows', lists.FAIL.filter((f) => /wt-(a3[4-7]|e27|e28|o2|o12|o14|o16|o17)$|t180-d358$|t180-d364$/.test(f.p)).map((f) => f.p + ' :: ' + f.r.slice(0, 160)).join('\n'));

// part 2: the kind of each item, the repo of each worktree, and what B recorded, so the deleter re-checks against B's run
const g1 = new Map(checks.g1.map((r) => [norm(r.path), r]));
const dw = new Map(((checks.his && checks.his.desktopWorktrees) || []).map((r) => [norm(r.path), r]));
const released = lists.FAIL.filter((f) => /wt-(a3[4-7]|e27|e28|o2|o12|o14|o16|o17)$|t180-d358$|t180-d364$/.test(f.p));
for (const f of released) {
  const w = walk.get(norm(f.p));
  items.push({ g: 'released', path: f.p.replace(/^~/, 'C:/Users/nname'), bytesB: Number(f.b.replace(/,/g, '')), reason: f.r.replace(/\s*\|\s*$/, ''), walkB: w && { files: w.files, bytes: w.bytes, newest: w.newest, links: w.links.length } });
}
for (const i of items) {
  const k = norm(i.path);
  const row = g1.get(k) || dw.get(k);
  if (i.g === 'branch') { i.kind = 'branch'; i.name = 'land-0.4.8'; i.sha = checks.branches.find((b) => b.branch === 'land-0.4.8').sha; continue; }
  if (row) { i.kind = 'worktree'; i.head = row.head; i.untracked = (row.dirty || []).filter((d) => d.startsWith('?? ')).map((d) => d.slice(3)); i.otherDirt = (row.dirty || []).filter((d) => !d.startsWith('?? ')); }
  else i.kind = fs.existsSync(i.path) && fs.statSync(i.path).isDirectory() ? 'dir' : 'file';
  i.whole = i.g === 'his';
  i.phase = (i.kind === 'worktree' && !/t180-wt-e(19|2[0-4])$/.test(i.path)) || i.kind === 'branch' ? 'B' : 'A';
}
fs.writeFileSync('C:/Users/nname/Downloads/t180-d450-e/items.json', JSON.stringify(items, null, 1));
const c = {}; for (const i of items) { const key = i.phase + ' ' + i.g + ' ' + i.kind; c[key] = (c[key] || 0) + 1; }
console.log('total', items.length, c);
console.log('worktrees without a head', items.filter((i) => i.kind === 'worktree' && !i.head).map((i) => i.path));
console.log('worktrees with other dirt', items.filter((i) => i.otherDirt && i.otherDirt.length).map((i) => i.path));
