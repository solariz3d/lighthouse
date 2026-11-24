// read_both.js: the built bank of the two exported layouts through the S (track 300..750): stops against the marks' linear rate, roll-rate peaks on 30/20/8 m chords
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const T = 'G:/consonance-scratch/o-smooth-t180', fs = require('fs');
const D = require(T + '/src/core/document.js'), RP = require(T + '/test/roll_profile.js');
const MK = [[300, 0], [380, -20], [445, -27], [500, 0], [555, 25], [600, 26], [750, 0]];   // track metres: the lead's end, then the marks, then the ease-out's end
const ref = (s) => { for (let k = 1; k < MK.length; k++) if (s <= MK[k][0]) { const [a, va] = MK[k - 1], [b, vb] = MK[k]; const turn = MK.some(([m], j) => j > 0 && j < MK.length - 1 && Math.abs(s - m) < 10 && (MK[j][1] - MK[j - 1][1]) * (MK[j + 1][1] - MK[j][1]) < 0); return turn ? 0 : Math.abs((vb - va) / (b - a)); } return 0; };
const out = {};
for (const k of ['today', 'flow']) {
  const d = D.parse(fs.readFileSync(`ac/${k}.t180track`, 'utf8'));
  const b = RP.builtBank(d).filter((x) => x.s >= 300 && x.s <= 750);
  const st = RP.stops(b, ref), peak = (c) => Math.max(...RP.rateOn(b, c).map((x) => Math.abs(x.r)));
  const acc = []; for (let i = 2; i < b.length - 2; i++) acc.push(Math.abs(b[i + 2].v - 2 * b[i].v + b[i - 2].v));   // samples 0.5 m apart, so i±2 is ±1 m: h = 1, no division   // 1 m step second difference, °/m²
  out[k] = { stops: st.map((x) => `${x.s}-${x.e}`), r30: +peak(30).toFixed(3), r20: +peak(20).toFixed(3), r8: +peak(8).toFixed(3), r4: +peak(4).toFixed(3), accMax: +Math.max(...acc).toFixed(4), min: +Math.min(...b.map((x) => x.v)).toFixed(2), max: +Math.max(...b.map((x) => x.v)).toFixed(2) };
  fs.writeFileSync(`ac/${k}_bank.json`, JSON.stringify(b.map((x) => [x.s, +x.v.toFixed(4)])));
}
console.log(JSON.stringify(out, null, 1));
