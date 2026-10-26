// today.js (D479, pane E): READ-ONLY. Each tail on the stick written on a given date, against the same byte range of the
// local transcript (append-only, so the range still holds what was exported): sha256 of both, EQUAL or not. Also one ledger-named
// 10-21 tail and one older (09-29) tail as controls.
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const dir = 'D:/consonance-L-20260911/consonance-tails', proj = 'C:/Users/nname/.claude/projects';
const where = {}; for (const d of fs.readdirSync(proj)) { const p = path.join(proj, d); try { for (const f of fs.readdirSync(p)) if (f.endsWith('.jsonl')) where[f.slice(0, -6)] = path.join(p, f); } catch (_) {} }
const hashRange = (p, a, b) => new Promise((res, rej) => { const h = crypto.createHash('sha256'); fs.createReadStream(p, { start: a, end: b - 1, highWaterMark: 4 << 20 }).on('data', (x) => h.update(x)).on('end', () => res(h.digest('hex'))).on('error', rej); });
(async () => {
  const pick = process.argv.slice(2);
  for (const n of fs.readdirSync(dir).sort()) {
    const m = /^([0-9a-f-]{36})\.(\d+)-(\d+)\.tail$/.exec(n); if (!m || !pick.some((x) => n.includes(x))) continue;
    const st = fs.statSync(path.join(dir, n)), src = where[m[1]];
    if (!src) { console.log(n, 'no local transcript'); continue; }
    const a = await hashRange(path.join(dir, n), 0, st.size), b = await hashRange(src, +m[2], +m[3]);
    console.log(`${st.mtime.toISOString().slice(0, 16)} ${n.slice(0, 8)} ${m[2]}-${m[3]} stick ${a.slice(0, 12)}… local range ${b.slice(0, 12)}… ${a === b ? 'EQUAL' : 'DIFFERENT'}`);
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
