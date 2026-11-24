// how far laid flowing banks miss their marks on the document (degrees), on tree argv[2]: the drawn lists at 5 and 20 m (seed 11), split into lists that lay
// without knots added (those pinned on 15b1306) and those that lay only with them
'use strict';
const path = require('path'), R = path.resolve(process.argv[2]);
const D = require(path.join(R, 'src/core/document.js')), { extend } = require(path.join(R, 'src/core/extend.js')), PINS = require(path.join(__dirname, '../../o-smooth-t180/test/core_bank_flow_lap4.pins.json'));
const DEG = Math.PI / 180, LEN = 300, lead = extend(D.createDoc('drawn'), { length: 300, family: 'bowl', first: { w: 33 } });
function drawn(gap, count, seed = 11) { const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648), out = [];
  for (let k = 0; k < count; k++) { const tr = +(20 + rnd() * 80).toFixed(1), nm = 1 + Math.floor(rnd() * 3), marks = []; let at = tr;
    for (let i = 0; i < nm; i++) { at = +(at + gap + rnd() * 40).toFixed(1); if (at > LEN) break; marks.push({ at, target: (rnd() * 60 - 30) * DEG }); }
    out.push({ first: { at: tr, target: (rnd() * 60 - 30) * DEG }, marks }); } return out; }
console.log('DEC.phi', D.DEC.phi);
for (const gap of [5, 20]) { const m = { old: [], knotted: [] };
  drawn(gap, 160).forEach((L, i) => { let d; try { d = extend(lead, { length: LEN, targets: { phi: L.first.target }, transition: { phi: L.first.at }, bankShape: 'flow', through: { phi: L.marks } }); } catch (e) { return; }
    const P = d.pieces[d.pieces.length - 1], worst = Math.max(...[L.first, ...L.marks].map((x) => Math.abs(D.channelValue(P, 'phi', Math.min(x.at, P.length)) - x.target) / DEG));
    m[i in PINS.drawn[gap].laid ? 'old' : 'knotted'].push(worst); });
  for (const k of ['old', 'knotted']) { const a = m[k].sort((x, y) => x - y); console.log(`gap ${gap} ${k}: ${a.length} lists, worst mark miss median ${a.length ? a[a.length >> 1].toExponential(2) : '-'}°, max ${a.length ? a[a.length - 1].toExponential(2) : '-'}°, over 1e-6°: ${a.filter((x) => x > 1e-6).length}`); }
}
