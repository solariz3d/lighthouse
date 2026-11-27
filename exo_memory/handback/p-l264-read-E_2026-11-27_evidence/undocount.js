// undocount.js (pane E, L264 read, item 2): count the undo sidecars of three COPY sets of his tracks folder, in every unit the file carries.
// usage: node undocount.js <label>=<copies dir> ...   Files are numbered by name order within the union of all sets; no name is printed.
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const sets = process.argv.slice(2).map((a) => { const i = a.indexOf('='); return { label: a.slice(0, i), dir: a.slice(i + 1) }; });
const names = [...new Set(sets.flatMap((s) => fs.readdirSync(s.dir).filter((f) => f.endsWith('.t180undo'))))].sort();
const h8 = (t) => crypto.createHash('sha256').update(t).digest('hex').slice(0, 8);
const rows = [];
for (const s of sets) {
  const tot = { files: 0, present: 0, past: 0, future: 0, strings: 0, nonString: 0 };
  for (const f of names) {
    const p = path.join(s.dir, f); if (!fs.existsSync(p)) continue;
    const raw = fs.readFileSync(p, 'utf8'); let u; try { u = JSON.parse(raw); } catch (e) { rows.push({ set: s.label, n: names.indexOf(f) + 1, bad: 'not JSON' }); continue; }
    const past = u.past || [], fut = u.future || [], all = [u.present, ...past, ...fut];
    const r = { set: s.label, n: names.indexOf(f) + 1, sha: h8(raw), keys: Object.keys(u).join(','), present: typeof u.present === 'string' ? 1 : 0, past: past.length, future: fut.length,
      strings: all.filter((x) => typeof x === 'string').length, nonString: all.filter((x) => x !== undefined && typeof x !== 'string').length, mtime: fs.statSync(p).mtime.toISOString().slice(0, 19) + 'Z' };
    rows.push(r); tot.files++; for (const k of ['present', 'past', 'future', 'strings', 'nonString']) tot[k] += r[k];
  }
  rows.push({ set: s.label, TOTAL: tot });
}
for (const r of rows) console.log(JSON.stringify(r));
