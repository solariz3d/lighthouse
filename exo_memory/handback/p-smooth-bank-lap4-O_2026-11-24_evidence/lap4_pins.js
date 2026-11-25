// LAP 4 pins, taken on a tree BEFORE lap 4's core change (argv[2], an export of 15b1306): the banked S's saved bytes, and for the reader's drawn lists (seed 11,
// 160 at a 5 m floor, 160 at 20 m) the sha256 of every one that lays, by index. Written to argv[3].
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const R = path.resolve(process.argv[2]);
const D = require(path.join(R, 'src/core/document.js')), { extend } = require(path.join(R, 'src/core/extend.js')), TB = require(path.join(R, 'src/core/turnby.js'));
const DEG = Math.PI / 180, LEN = 300, sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const lead = () => extend(D.createDoc('drawn'), { length: 300, family: 'bowl', first: { w: 33 } });
function drawn(gap, count, seed = 11) {
  const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648), out = [];
  for (let k = 0; k < count; k++) {
    const tr = +(20 + rnd() * 80).toFixed(1), nm = 1 + Math.floor(rnd() * 3), marks = []; let at = tr;
    for (let i = 0; i < nm; i++) { at = +(at + gap + rnd() * 40).toFixed(1); if (at > LEN) break; marks.push({ at, target: (rnd() * 60 - 30) * DEG }); }
    out.push({ first: { at: tr, target: (rnd() * 60 - 30) * DEG }, marks });
  }
  return out;
}
const optsOf = (L) => ({ length: LEN, targets: { phi: L.first.target }, transition: { phi: L.first.at }, bankShape: 'flow', through: { phi: L.marks } });
const MARKS = [{ at: 145, deg: -27 }, { at: 200, deg: 0 }, { at: 255, deg: 25 }, { at: 300, deg: 26 }];
const S_OPTS = { length: 300, turnDeg: 0, changes: { turnDeg: [{ from: 80, deg: 92 }, { from: 200, deg: -91 }] }, targets: { phi: -20 * DEG }, transition: { phi: 80 }, bankShape: 'flow', through: { phi: MARKS.map((m) => ({ at: m.at, target: m.deg * DEG })) } };
const S = extend(TB.extendCorner(lead(), S_OPTS), { length: 150, targets: { phi: 0 }, transition: { phi: 100 }, bankShape: 'flow' });
const out = { base: process.argv[4] || '', bankedS: { sha256: sha(D.serialize(S)), bytes: D.serialize(S).length }, drawn: {} };
const base = lead();
for (const gap of [5, 20]) {
  const laid = {}; let refused = 0;
  drawn(gap, 160).forEach((L, i) => { try { laid[i] = sha(D.serialize(extend(base, optsOf(L)))); } catch (e) { if (!(e instanceof D.CoreError)) throw e; refused++; } });
  out.drawn[gap] = { laid, refused };
}
fs.writeFileSync(process.argv[3], JSON.stringify(out, null, 1) + '\n');
console.log(`banked S ${out.bankedS.bytes} bytes; gap 5: ${Object.keys(out.drawn[5].laid).length} laid, ${out.drawn[5].refused} refused; gap 20: ${Object.keys(out.drawn[20].laid).length} laid, ${out.drawn[20].refused} refused`);
