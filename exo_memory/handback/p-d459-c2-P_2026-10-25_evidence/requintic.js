// requintic.js (D459 3b, P; a scratch tool, not shipped): what the C2 ease would make of a SAVED document's existing ramps. For every road piece and every
// cross-section channel (phi, c, e, er) whose value differs between the piece's start and end, with the first two and last two control points each level
// (a whole-piece ramp from rest to rest, as extend lays one), the channel is refitted from the quintic blend over the piece's length on the piece's own knots,
// the start held (document.js fitChannel), then its ends pinned C2 (extend.js c2Ends). Everything else is kept. Writes the new document and lists what moved.
//   node requintic.js <tree> <save> <out.t180track>
'use strict';
const fs = require('fs'), path = require('path'); const [T, F, OUT] = process.argv.slice(2);
const D = require(path.join(T, 'src/core/document.js')), X = require(path.join(T, 'src/core/extend.js'));
const doc = D.parse(fs.readFileSync(F, 'utf8')); const CH = ['phi', 'c', 'e', 'er']; const moved = [];
const pieces = doc.pieces.map((P) => {
  if (P.type !== 'road') return P; let Q = P;
  for (const ch of CH) { const c = P.channels[ch]; if (!c) continue; const n = c.length, v0 = c[0], v1 = c[n - 1];
    if (Math.abs(v1 - v0) < 1e-9 || Math.abs(c[1] - c[0]) > 1e-9 || Math.abs(c[n - 2] - c[n - 1]) > 1e-9) continue;
    const f = X.channelFn({ v: v0, m: 0 }, v1, P.length, ch), K = P.knots.map((t) => +t);
    const fit = D.fitChannel(f, P.length, K, { v: v0, m: 0 }).map((x) => Number(x.toFixed(D.DEC[ch])) + 0); fit[n - 1] = v1; fit[n - 2] = v1;   // the end as stored: the next piece continues it
    Q = { ...Q, channels: { ...Q.channels, [ch]: fit } }; X.c2Ends(Q, ch);
    const was = c.map((x) => +x.toFixed(4)).join(','), now = Q.channels[ch].map((x) => +x.toFixed(4)).join(',');
    moved.push(`${P.id} ${ch}: ${v0.toFixed(3)} -> ${v1.toFixed(3)} over ${P.length} m; points ${was} => ${now}`); }
  return Q;
});
const out = D.checkDoc({ ...doc, pieces }); fs.writeFileSync(OUT, D.serialize(out)); console.log(moved.join('\n')); console.log('pieces moved:', new Set(moved.map((m) => m.split(' ')[0])).size, 'channels moved:', moved.length);
