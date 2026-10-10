// D186 (pane E): the SHARP brush's spill, measured to DECLARE its bound (the chair's ruling 2). On tree2 (A's h/l channels +
// refineKnots). For every channel brushed sharp at r = 20 m at 25/50/75% of track 0 (open): outside W⁺ (W ± 2 ORIGINAL spans),
// the largest change of EVERY channel's value in units of that channel's quantum, and the largest move of the path past W⁺.
// Also the refinement alone: the largest channel change anywhere, in quanta.
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'pane E: D186 sharp spill measurement' });
const path = require('path'), T = path.join(__dirname, 'tree2');
const D = require(path.join(T, 'src/core/document.js')), S = require(path.join(T, 'src/core/sculpt.js')), { toPath } = require(path.join(T, 'src/core/adapter.js'));
const H = require(path.join(T, 'test/core_helpers.js'));
const BASE = H.docFrom(H.gen()[0]), OLD = toPath(BASE).path.samples, LEN = OLD.at(-1).s, OFF0 = S.pieceOffsets(BASE);
const SPAN = Math.max(...BASE.pieces.map((P) => { const t = [0, ...P.knots, P.length]; return Math.max(...t.slice(1).map((x, k) => x - t[k])); }));
const DELTA = { kh: 0.002, kv: 0.001, phi: 0.17453292519943295, w: 5, r: 0.5, h: 2, l: 2 };
const q = (c) => 10 ** -D.DEC[c];
function chAt(doc, off, c, s) { let p = off.findIndex((o, i) => s >= o && (i === off.length - 1 || s < off[i + 1])); if (p < 0) p = 0; return D.channelAt(doc.pieces[p], c, Math.min(s - off[p], doc.pieces[p].length)).v; }
const worstQ = Object.fromEntries(D.CHANNELS.map((c) => [c, 0])); let worstPos = 0; const rows = [];
for (const ch of Object.keys(DELTA)) for (const frac of [0.25, 0.5, 0.75]) {
  const s0 = frac * LEN, r = 20, loP = s0 - r - 2 * SPAN, hiP = s0 + r + 2 * SPAN;
  const mode = ch === 'kh' || ch === 'kv' ? 'rate' : 'value', res = S.brush(BASE, { mode, channel: ch, s0, r, delta: DELTA[ch], sharp: true });
  const off = S.pieceOffsets(res.doc), NEW = toPath(res.doc).path.samples; const here = {};
  for (const x of NEW) if (x.s < loP || x.s > hiP) for (const c of D.CHANNELS) { const d = Math.abs(chAt(res.doc, off, c, x.s) - chAt(BASE, OFF0, c, x.s)) / q(c); here[c] = Math.max(here[c] || 0, d); worstQ[c] = Math.max(worstQ[c], d); }
  let dpos = 0; if (mode === 'value') NEW.forEach((x, i) => { if (x.s > hiP) dpos = Math.max(dpos, Math.hypot(...[0, 1, 2].map((k) => x.pos[k] - OLD[i].pos[k]))); }); worstPos = Math.max(worstPos, dpos);
  rows.push(`${ch.padEnd(3)} ${frac * 100}%: radius ${res.radiusUsed.toFixed(4)}; outside W⁺ in quanta ${D.CHANNELS.map((c) => `${c} ${(here[c] || 0).toFixed(3)}`).join(', ')}; path past W⁺ ${dpos.toExponential(2)} m`);
}
let alone = {}; BASE.pieces.forEach((P, p) => { if (P.type !== 'road') return; const R = D.refineKnots(BASE, P.id, 0, P.length, 5).doc.pieces[p];
  for (const c of D.CHANNELS) for (let k = 0; k <= 400; k++) { const s = (k * P.length) / 400, d = Math.abs(D.channelAt(R, c, s).v - D.channelAt(P, c, s).v) / q(c); alone[c] = Math.max(alone[c] || 0, d); } });
rows.push(`WORST outside W⁺, in quanta: ${D.CHANNELS.map((c) => `${c} ${worstQ[c].toFixed(3)}`).join(', ')}; path past W⁺ (value brushes) ${worstPos.toExponential(2)} m`);
rows.push(`REFINEMENT ALONE (every piece to 5 m spans), worst change anywhere, in quanta: ${D.CHANNELS.map((c) => `${c} ${(alone[c] || 0).toFixed(3)}`).join(', ')}`);
console.log(rows.join('\n'));
