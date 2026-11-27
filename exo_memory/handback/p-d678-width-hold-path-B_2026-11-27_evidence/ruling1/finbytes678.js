// finbytes678.js (pane B, D678 ruling 1, F-3 as registered in §3.0): Finish at each open head of his copies (numbered, never named), on tree X against tree R:
// the same bytes (the closed document's serialisation, hashed), or the same refusal (its code and message). The head's width slope and the time on each tree printed.
// usage: node finbytes678.js <tree X> <tree R> <copies dir>
'use strict';
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const path = require('path'), fs = require('fs'), crypto = require('crypto');
const load = (T) => { T = path.resolve(T); return { D: require(path.join(T, 'src/core/document.js')), F: require(path.join(T, 'src/core/finish.js')) }; };
const X = load(process.argv[2]), R = load(process.argv[3]), COPIES = process.argv[4];
const h = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
const fin = (t, d) => { const t0 = Date.now(); let out; try { out = h(t.D.serialize(t.F.finishToStart(d).doc)); } catch (e) { if (e.name !== 'CoreError') throw e; out = `refused ${e.code}: ${h(String(e.message))}`; } return { out, ms: Date.now() - t0 }; };
let open = 0, same = 0, held = 0, closed = 0, refused = 0, skipped = 0;
const files = fs.readdirSync(COPIES).filter((f) => /^t\d\d\.t180track$/.test(f)).sort();
for (const f of files) {
  const text = fs.readFileSync(path.join(COPIES, f), 'utf8'); let dx, dr;
  try { dx = X.D.parse(text); dr = R.D.parse(text); } catch (e) { refused++; console.log(`${f.slice(0, 3)}: refused on parse (${e.code || e.name})`); continue; }
  if (dx.closed) { closed++; continue; }
  if (!dx.pieces.length || dx.pieces[dx.pieces.length - 1].type !== 'road') { skipped++; console.log(`${f.slice(0, 3)}: open, its head is not a road piece; skipped`); continue; }
  const slope = X.D.endState(dx).w.m; open++; if (slope !== 0) held++;
  const a = fin(X, dx), b = fin(R, dr); if (a.out === b.out) same++;
  console.log(`${f.slice(0, 3)}: open, head width slope ${slope} per m: ${a.out === b.out ? 'same' : 'DIFFER'} (${a.out} / ${b.out}); ${a.ms} ms / ${b.ms} ms`);
}
console.log(`FINISH ON HIS COPIES: ${files.length} tracks, ${refused} refused on parse, ${closed} closed, ${skipped} open with no road head, ${open} open (${held} with a width still changing at the head); ${same} of ${open} the same bytes or the same refusal`);
