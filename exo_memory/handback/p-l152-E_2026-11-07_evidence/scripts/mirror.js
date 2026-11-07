// mirror.js <tree> <saves dir> <out.json>: pane E, L152 review of l151-mirror-refusal (read-only).
// (1) MY OWN SAMPLE, not A's grid: a seeded random draw (mulberry32, seed 152) of 400 pieces through the panel's extendOptions on his error save's p1:
//     length 600/800/1000/1500, turn as a corner (−120..120) or none, a first bank (−90..90, or blank), a first bank "early" or not, one extra bank with a random
//     target (−90..90) and a random mark (0.15–0.92 of L), and on a third of them an extra turn too; the panel's own rounded bank shape (extendOptions' default).
//     For each: sha256 of D.serialize(extendCorner(...)), or the refusal's code and text.
// (2) THE NEW MESSAGE'S LIMIT on B's mirrored case (his S: −90 corner, bank +34.78, extra turn +180 from 500, extra bank to −34.78 from 500), mark by mark from
//     480 to 760: laid or refused, and for laid ones the built roll's peak acceleration ÷ BANK_BAR (2 m second differences of the adapter's roll, piece and 20 m on).
'use strict';
const path = require('path'), fs = require('fs'), crypto = require('crypto');
const W = path.resolve(process.argv[2]), SAVES = path.resolve(process.argv[3]), OUT = process.argv[4], q = (m) => require(path.join(W, m));
require('C:/Consonance/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'pane E L152: mirror review sample (BelowNormal; not a timing session)' });
try { require('os').setPriority(require('os').constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) {}
const D = q('src/core/document.js'), X = q('src/core/extend.js'), A = q('src/core/adapter.js'), TB = q('src/core/turnby.js');
const { extendOptions } = q('app/core/panel.js');
const BAR = 29.4 / (10 * 170 * 170), h16 = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
const err = D.parse(fs.readFileSync(path.join(SAVES, 'error.t180track'), 'utf8'));
const cmin = (deg) => TB.cornerChangeMinM(err, {}, deg);
const fields = (f) => ({ turn: '', climb: '', bank: '', width: '', cup: '', edge: '', start: '', tube: '', atStart: {}, turnAs: 'corner', ...f, secondMinM: X.secondMinM, cornerChangeMinM: cmin, secondFloorM: 20 });
let seed = 152; const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const pick = (a) => a[Math.floor(rnd() * a.length)], r1 = (lo, hi) => Math.round((lo + rnd() * (hi - lo)) * 100) / 100;
const out = { tree: path.basename(W), sample: [], limit: [] };
for (let i = 0; i < 400; i++) {
  const L = pick([600, 800, 1000, 1500]), corner = rnd() < 0.7, turn = corner ? r1(-120, 120) : '', bank = rnd() < 0.1 ? '' : r1(-90, 90), early = rnd() < 0.3;
  const xb = r1(-90, 90), from = Math.round(r1(0.15, 0.92) * L * 100) / 100, xt = corner && rnd() < 0.33 ? r1(-150, 150) : null;
  const changes = { bank: [{ then: String(xb), from: String(from) }] }; if (xt !== null) changes.turn = [{ then: String(xt), from: String(Math.round(L * 0.5)) }];
  const f = fields({ length: String(L), turn: String(turn), bank: String(bank), atStart: early ? { bank: true } : {}, changes });
  let row = { i, L, turn, bank, early, xb, from, xt };
  try { const o = extendOptions(f); const d = TB.extendCorner(err, o); row.hash = h16(D.serialize(d)); }
  catch (e) { row.refused = `${e.code}`; row.msg = String(e.message).slice(0, 220); }
  out.sample.push(row);
}
// (2)
for (let F = 480; F <= 760; F += (F < 540 || F > 720 ? 1 : 5)) {
  const o = extendOptions(fields({ length: '1000', turn: '-90', bank: '34.78', changes: { turn: [{ then: '180', from: '500' }], bank: [{ then: '-34.78', from: String(F) }] } }));
  const row = { from: F };
  try { const d = TB.extendCorner(TB.extendCorner(err, o), { length: 200 }); const S = A.toPath(d).path.samples;
    const r = (s) => { let lo = 0, hi = S.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (S[m].s <= s) lo = m; else hi = m; } return S[lo].roll; };
    let m = 0; for (let s = 1002; s <= 2020; s += 0.5) m = Math.max(m, Math.abs(r(s + 2) - 2 * r(s) + r(s - 2)) / 4); row.peak = +(m / BAR).toFixed(4); }
  catch (e) { row.refused = e.code; row.msg = String(e.message).slice(0, 240); }
  out.limit.push(row);
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 1)); console.log('wrote', OUT);
