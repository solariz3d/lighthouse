// LAP 4: what the knots added before refusing let through. Over the drawn lists (seed 11, 5 m and 20 m floors), split into lists that laid on 15b1306 (the pins) and
// lists that lay only with knots added: the steepest roll rate on the document (°/m, read every 0.25 m) and the built road's worst miss at a mark (the second reader's
// q5 read, finding 1, item e, HELD). Tree argv[2].
'use strict';
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const path = require('path'), R = path.resolve(process.argv[2]);
const D = require(path.join(R, 'src/core/document.js')), { extend } = require(path.join(R, 'src/core/extend.js')), RP = require(path.join(R, 'test/roll_profile.js'));
const PINS = require(path.join(__dirname, '../../o-smooth-t180/test/core_bank_flow_lap4.pins.json'));
const DEG = Math.PI / 180, LEN = 300, lead = extend(D.createDoc('p'), { length: 300, family: 'bowl', first: { w: 33 } });
function drawn(gap, count, seed = 11) { const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648), out = [];
  for (let k = 0; k < count; k++) { const tr = +(20 + rnd() * 80).toFixed(1), nm = 1 + Math.floor(rnd() * 3), marks = []; let at = tr;
    for (let i = 0; i < nm; i++) { at = +(at + gap + rnd() * 40).toFixed(1); if (at > LEN) break; marks.push({ at, target: (rnd() * 60 - 30) * DEG }); }
    out.push({ first: { at: tr, target: (rnd() * 60 - 30) * DEG }, marks }); } return out; }
const q = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? `median ${s[s.length >> 1].toFixed(2)}, max ${s[s.length - 1].toFixed(2)}` : '-'; };
for (const gap of [5, 20]) {
  const g = { old: { rate: [], miss: [] }, knotted: { rate: [], miss: [] } };
  drawn(gap, 160).forEach((L, i) => {
    let doc; try { doc = extend(lead, { length: LEN, targets: { phi: L.first.target }, transition: { phi: L.first.at }, bankShape: 'flow', through: { phi: L.marks } }); } catch (e) { return; }
    const P = doc.pieces[doc.pieces.length - 1]; let rate = 0; for (let s = 0; s <= P.length; s += 0.25) rate = Math.max(rate, Math.abs(D.channelAt(P, 'phi', s).d1) / DEG);
    const B = RP.builtBank(doc, 0.5); let worst = 0; for (const m of [L.first, ...L.marks]) worst = Math.max(worst, Math.abs(RP.near(B, 300 + m.at).v - m.target / DEG));
    const k = i in PINS.drawn[gap].laid ? 'old' : 'knotted'; g[k].rate.push(rate); g[k].miss.push(worst);
  });
  for (const k of ['old', 'knotted']) console.log(`gap ${gap} ${k}: ${g[k].rate.length} lists; steepest roll on the document °/m ${q(g[k].rate)}; built road's worst miss at a mark ° ${q(g[k].miss)}, > 10° in ${g[k].miss.filter((x) => x > 10).length}`);
}
