// boardctx.js (D450 verify, B): for each G1/G2 path a board line of an open lap names, print the newest 3 such lines with the text around the
// name, so the verdict reads HOW the open lap names it (its live tree, or a passing mention). Read-only; board read in 8 MB pieces with pauses.
//   node boardctx.js checks.json > boardctx.out
'use strict';
const fs = require('fs'), os = require('os');
os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL);
const nap = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const readPaced = (f) => { const fd = fs.openSync(f, 'r'), parts = [], b = Buffer.alloc(8 << 20); let n; while ((n = fs.readSync(fd, b, 0, b.length, null)) > 0) { parts.push(Buffer.from(b.subarray(0, n))); nap(40); } fs.closeSync(fd); return Buffer.concat(parts); };
const j = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const OPEN = j.openLaps.map((o) => o.lap), openRe = new RegExp(`\\b(${OPEN.join('|')})\\b`, 'g');
const tokRe = (t) => new RegExp(`(^|[^A-Za-z0-9_.-])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![A-Za-z0-9_-])`, 'i');
const rows = [...j.g1, ...j.g2, ...j.his.desktopWorktrees].filter((r) => r.named && r.named.board > 0);
const B = readPaced('C:/Consonance/data/board.jsonl').toString('utf8').split('\n').filter((l) => openRe.test(l) && !(openRe.lastIndex = 0));
for (const r of rows) {
  const t = r.path.split('/').pop(), re = tokRe(t), hits = [];
  for (const l of B) { openRe.lastIndex = 0; if (!re.test(l)) continue; let o; try { o = JSON.parse(l); } catch (e) { o = {}; } hits.push({ l, o }); }
  console.log(`== ${t}  (${hits.length} line(s))`);
  for (const { l, o } of hits.slice(-3)) {
    const text = String(o.text || o.msg || o.body || l).replace(/\\n|\n/g, ' '), i = text.search(re);
    console.log(`  ${o.ts || o.at || '?'} ${o.from || o.seat || o.tag || '?'} laps=${[...new Set(text.match(openRe) || [])].join('+')} :: …${text.slice(Math.max(0, i - 160), i + 140)}…`);
  }
}
