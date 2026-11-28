// bytes270.js <mergedTree> <baseTree> <copiesDir> <out.json>: pane C, L270 role 2. P's L262 bytes.js rule (handback/p-l263-test-install-P_2026-11-27.md:170),
// on COPIES of his saved tracks: every *.t180track and every document step (present, past, future) of every *.t180undo goes through
// D.serialize(D.parse(text)) on the merged tree (9de0b18) and on c522ea6; equal = the same sha256 of the saved text, or both refuse with the same code.
// Changed from bytes.js: the full sha256 (not its first 8), no core/7 step (not asked here). No file name is written out: files are numbered.
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const [, , MT, BT, DIR, OUT] = process.argv;
const M = require(path.join(MT, 'src', 'core', 'document.js')), B = require(path.join(BT, 'src', 'core', 'document.js'));
const sha = (t) => crypto.createHash('sha256').update(t).digest('hex');
const round = (D, t) => { try { const s = D.serialize(D.parse(t)); return { ok: true, sha: sha(s), own: s === t }; } catch (e) { return { ok: false, code: e.code || null, msg: String(e.message).slice(0, 120) }; } };
const judge = (t) => { const m = round(M, t), b = round(B, t); return { in: sha(t), merged: m, base: b, equal: m.ok && b.ok ? m.sha === b.sha : (!m.ok && !b.ok && m.code === b.code) }; };
const files = fs.readdirSync(DIR).sort();
const out = { tracks: [], undo: [] };
let n = 0;
for (const f of files.filter((x) => x.endsWith('.t180track'))) out.tracks.push({ n: ++n, ...judge(fs.readFileSync(path.join(DIR, f), 'utf8')) });
n = 0;
for (const f of files.filter((x) => x.endsWith('.t180undo'))) {
  const raw = fs.readFileSync(path.join(DIR, f), 'utf8'); let u;
  try { u = JSON.parse(raw); } catch (e) { out.undo.push({ n: ++n, parse: 'BAD JSON', equal: 0, steps: 0 }); continue; }
  const steps = [u.present, ...(u.past || []), ...(u.future || [])].filter((x) => typeof x === 'string').map(judge);
  out.undo.push({ n: ++n, in: sha(raw), steps: steps.length, past: (u.past || []).length, future: (u.future || []).length, equal: steps.filter((s) => s.equal).length,
    refusedBoth: steps.filter((s) => !s.merged.ok && !s.base.ok).length, own: steps.filter((s) => s.merged.ok && s.merged.own).length, differ: steps.map((s, i) => s.equal ? null : i).filter((i) => i !== null) });
}
const T = out.tracks, U = out.undo;
out.totals = { tracks: T.length, tracksEqual: T.filter((t) => t.equal).length, tracksRefusedBoth: T.filter((t) => !t.merged.ok && !t.base.ok).map((t) => ({ n: t.n, code: t.merged.code })),
  tracksOwnText: T.filter((t) => t.merged.ok && t.merged.own).length, tracksDiffer: T.filter((t) => !t.equal).map((t) => t.n),
  undoFiles: U.length, undoSteps: U.reduce((a, u) => a + u.steps, 0), undoEqual: U.reduce((a, u) => a + u.equal, 0), undoRefusedBoth: U.reduce((a, u) => a + (u.refusedBoth || 0), 0),
  undoDiffer: U.filter((u) => u.steps !== u.equal).map((u) => ({ n: u.n, differ: u.differ })) };
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out.totals, null, 1));
