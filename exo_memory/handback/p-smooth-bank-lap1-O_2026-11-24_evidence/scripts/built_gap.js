require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const T = process.argv[2], D = require(T + '/src/core/document.js'), { extend } = require(T + '/src/core/extend.js'), TB = require(T + '/src/core/turnby.js'), RP = require(T + '/test/roll_profile.js'), A = require(T + '/src/core/adapter.js'), DEG = Math.PI / 180;
const lead = () => extend(D.createDoc('flow'), { length: 300, family: 'bowl', first: { w: 33 } });
const M = [{ at: 145, deg: -27 }, { at: 200, deg: 0 }, { at: 255, deg: 25 }, { at: 300, deg: 26 }].map((m) => ({ at: m.at, target: m.deg * DEG }));
const d = extend(TB.extendCorner(lead(), { length: 300, turnDeg: 0, changes: { turnDeg: [{ from: 80, deg: 92 }, { from: 200, deg: -91 }] }, targets: { phi: -20 * DEG }, transition: { phi: 80 }, bankShape: 'flow', through: { phi: M } }), { length: 150, targets: { phi: 0 }, transition: { phi: 100 }, bankShape: 'flow' });
const b = RP.builtBank(d), S = A.toPath(d, { step: 0.5 }).path.samples;
const docAt = (s) => { let a = 0; for (const P of d.pieces) { if (s <= a + P.length) return D.channelValue(P, 'phi', s - a) / DEG; a += P.length; } return 0; };
console.log('track m | piece m | document ° | built ° | built - document');
for (let s = 300; s <= 750; s += 10) { const x = b.find((y) => Math.abs(y.s - s) < 0.26); console.log(s, '|', s < 600 ? `S ${s - 300}` : `out ${s - 600}`, '|', docAt(s).toFixed(2), '|', x.v.toFixed(2), '|', (x.v - docAt(s)).toFixed(2)); }
const bands = [[300, 380, 'run-in (straight)'], [380, 500, 'turn A'], [500, 600, 'turn B'], [600, 750, 'ease-out (straight)']];
for (const [a, z, w] of bands) { let g = 0; for (const x of b) if (x.s >= a && x.s <= z) g = Math.max(g, Math.abs(x.v - docAt(x.s))); console.log(w, 'worst', g.toFixed(2), '°'); }
