'use strict';
const D = require('./t/src/core/document.js'), { extend } = require('./t/src/core/extend.js');
const DEG = Math.PI / 180;
const lead = extend(D.createDoc('p'), { length: 300, family: 'bowl', first: { w: 33 } });
let seed = 7; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const tally = { ok: 0, singular: 0, otherThrow: {}, missed: 0, overshoot: 0 }, ex = { singular: [], missed: [], overshoot: [] };
for (let t = 0; t < 600; t++) {
  const L = 300, tr = +(20 + rnd() * 100).toFixed(1), k = 1 + Math.floor(rnd() * 3), marks = []; let at = tr;
  for (let i = 0; i < k; i++) { at = +(at + 5 + rnd() * 50).toFixed(1); if (at > L) break; marks.push({ at, target: (rnd() * 60 - 30) * DEG }); }
  const first = (rnd() * 60 - 30) * DEG, opts = { length: L, targets: { phi: first }, transition: { phi: tr }, bankShape: 'flow', through: { phi: marks } };
  const all = [{ at: tr, target: first }, ...marks], desc = all.map((m) => `${m.at}:${(m.target / DEG).toFixed(1)}`).join(' ');
  try {
    const d = extend(lead, opts), P = d.pieces[1];
    const miss = Math.max(...all.map((m) => Math.abs(D.channelValue(P, 'phi', m.at) - m.target) / DEG));
    if (miss > 0.05) { tally.missed++; ex.missed.push(`${desc} miss ${miss.toFixed(3)}`); }
    const top = Math.max(0, ...all.map((m) => Math.abs(m.target))) / DEG; let worst = 0;
    for (let s = 0; s <= L; s += 0.5) worst = Math.max(worst, Math.abs(D.channelValue(P, 'phi', s)) / DEG - top);
    if (worst > 0.5) { tally.overshoot++; ex.overshoot.push(`${desc} past ${worst.toFixed(2)}`); }
    tally.ok++;
  } catch (e) {
    if (/singular/.test(e.message)) { tally.singular++; ex.singular.push(desc); }
    else { const c = e.code || e.message.slice(0, 60); tally.otherThrow[c] = (tally.otherThrow[c] || 0) + 1; }
  }
}
console.log(JSON.stringify(tally));
for (const k of Object.keys(ex)) console.log(k, ex[k].length, '\n  ' + ex[k].slice(0, 6).join('\n  '));
