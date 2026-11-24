'use strict';
const D = require('./t/src/core/document.js'), { extend } = require('./t/src/core/extend.js');
const DEG = Math.PI / 180;
const lead = extend(D.createDoc('p'), { length: 300, family: 'bowl', first: { w: 33 } });
for (const minGap of [5, 20, 40, 60]) {
  let seed = 11; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
  const t = { n: 0, singular: 0, past2: 0, past10: 0, wrongSign: 0 };
  for (let k = 0; k < 400; k++) {
    const tr = +(20 + rnd() * 80).toFixed(1), nm = 1 + Math.floor(rnd() * 3), marks = []; let at = tr;
    for (let i = 0; i < nm; i++) { at = +(at + minGap + rnd() * 40).toFixed(1); if (at > 300) break; marks.push({ at, target: (rnd() * 60 - 30) * DEG }); }
    const first = (rnd() * 60 - 30) * DEG; t.n++;
    try {
      const P = extend(lead, { length: 300, targets: { phi: first }, transition: { phi: tr }, bankShape: 'flow', through: { phi: marks } }).pieces[1];
      const all = [{ at: 0, target: 0 }, { at: tr, target: first }, ...marks], top = Math.max(...all.map((m) => Math.abs(m.target))) / DEG; let worst = 0, wrong = false;
      for (let s = 0; s <= 300; s += 0.5) {
        const v = D.channelValue(P, 'phi', s) / DEG; worst = Math.max(worst, Math.abs(v) - top);
        const j = all.findIndex((m) => m.at > s); if (j > 0) { const a = all[j - 1].target / DEG, b = all[j].target / DEG; if (Math.abs(a) > 1 && Math.abs(b) > 1 && Math.sign(a) === Math.sign(b) && Math.sign(v) === -Math.sign(a) && Math.abs(v) > 2) wrong = true; }
      }
      if (worst > 2) t.past2++; if (worst > 10) t.past10++; if (wrong) t.wrongSign++;
    } catch (e) { if (/singular/.test(e.message)) t.singular++; else throw e; }
  }
  console.log(`marks >= ${minGap} m apart:`, JSON.stringify(t));
}
