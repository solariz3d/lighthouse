// usage: node hash5.js <t180 tree> <saves dir>   D643: a byte-hash of what each fork BUILDS, the recipe of L141's samebuild.js (pane B, p-l141-B :52): the adapter's toPath sampled
// road (s, pos, T, L, U, roll of every sample, as doubles) plus its segments (JSON), sha256. Tracks: the 10-22 fixture in the tree's test/fixtures, his three saves of
// 2026-11-06 (copies in the lighthouse brief folder, read only), and his p2 piece (1,000 m straight; 1,000 m, −90 corner, bank 88.45 rounded, cup 15.5, width 31, extra turn
// +180 and extra bank −88.45 from 500). Also the core's answers: secondMinM over a 28-case grid and spanHolds over 4 first ramps × 10 changes × spans every 7 m.
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const R = path.resolve(process.argv[2]), SAVES = path.resolve(process.argv[3]), q = (m) => require(path.join(R, m));
const D = q('src/core/document.js'), A = q('src/core/adapter.js'), X = q('src/core/extend.js'), TB = q('src/core/turnby.js');
const DEG = Math.PI / 180;
function hashDoc(doc) {
  const h = crypto.createHash('sha256'), b = Buffer.alloc(8), num = (x) => { b.writeDoubleBE(x); h.update(b); };
  const segs = A.toSegments(doc); h.update(JSON.stringify(segs));
  const P = A.toPath(doc, { step: 2 }).path; let n = 0;
  for (const s of P.samples) { num(s.s); for (const k of ['pos', 'T', 'L', 'U']) for (const x of s[k]) num(x); num(s.roll); n++; }
  return { samples: n, segments: segs.length, sha256: h.digest('hex').slice(0, 16) };
}
const out = { tree: R, tracks: {} };
const fx = path.join(R, 'test/fixtures/elysium-2026-10-22.t180track');
out.tracks['fixture 10-22 (test/fixtures)'] = hashDoc(D.parse(fs.readFileSync(fx, 'utf8')));
for (const f of fs.readdirSync(SAVES).filter((x) => x.endsWith('.t180track')).sort()) out.tracks[`his save ${f.replace(/^eq-|\.t180track$/g, '')}`] = hashDoc(D.parse(fs.readFileSync(path.join(SAVES, f), 'utf8')));
{ const flat = X.extend(D.createDoc('g'), { length: 1000, family: 'bowl' });
  const d = TB.extendCorner(flat, { length: 1000, turnDeg: -90, targets: { phi: 88.45 * DEG, c: 15.5, w: 31 }, bankShape: 'rounded', changes: { turnDeg: [{ from: 500, deg: 180 }], phi: [{ from: 500, target: -88.45 * DEG }] } });
  out.tracks['his p2 piece (rounded, extra turn +180, extra bank −88.45 from 500)'] = hashDoc(d); }
{ const h = crypto.createHash('sha256'), b = Buffer.alloc(8); let n = 0, holds = 0;
  for (const [st, L] of [[88.45, 1000], [66.14, 750], [30, 750], [60, 600]]) for (const t of [-88.45, -60, -30.3, -10, 0, 12.7, 45.5]) { b.writeDoubleBE(X.secondMinM('phi', st * DEG, t * DEG, { step: st * DEG, length: L })); h.update(b); n++; }
  for (const [st, L] of [[88.45, 1000], [66.14, 750], [30, 750], [60, 600]]) for (const t of [-88.45, -60, -30.3, -10, 0, 12.7, 45.5, 70, 100, -120]) for (let span = 40; span <= L - 1; span += 7) { const v = X.spanHolds('phi', st * DEG, t * DEG, { step: st * DEG, length: L }, span); h.update(v ? '1' : '0'); n++; if (v) holds++; }
  out.coreAnswers = { asks: n, spanHoldsTrue: holds, sha256: h.digest('hex').slice(0, 16) }; }
console.log(JSON.stringify(out, null, 1));
