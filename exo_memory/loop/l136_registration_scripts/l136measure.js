// L136 registration (pane E): the built bank against the document at each ramp's end, on a given tree (read-only).
//   node l136measure.js <worktree> <label>
// For every road piece whose document bank changes (|end − start| > 0.05°) or that holds a bank reached inside it:
//   arrive = the document's ramp end: the first s after which the document's bank stays within 0.05° of the piece's end value;
//   built@arrive = the adapter path's roll at arrive (nearest sample, path step 0.5 m); off = |built@arrive − target|;
//   startBuilt = the first s (track metres, from the piece's start, negative = in the piece before) where the built roll has left the
//     bank it had at the piece's start by > 0.5° (how early the road leans in);
//   settle = from arrive, the distance until the built roll stays within 0.5° of the target (to the piece's end; "beyond" if never);
//   peak = the built roll's peak acceleration over the piece ± 50 m, read as BANK_DS-step second differences of the path's roll (°/m²),
//     against BANK_BAR = 29.4 / (10·170²) rad/m² = 0.005829 °/m².
'use strict';
const path = require('path'), W = process.argv[2], LABEL = process.argv[3] || '';
require('C:/Consonance/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: `pane E: L136 registration measure (${LABEL})` });
try { require('os').setPriority(require('os').constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) {}
const fs = require('fs');
const D = require(path.join(W, 'src/core/document.js')), { extend } = require(path.join(W, 'src/core/extend.js')), A = require(path.join(W, 'src/core/adapter.js'));
const { extendTurnBy, extendCorner } = require(path.join(W, 'src/core/turnby.js')), { extendOptions } = require(path.join(W, 'app/core/panel.js'));
const DEG = Math.PI / 180, BAR = 29.4 / (10 * 170 * 170) / DEG;
const flat = () => extend(D.createDoc('e'), { length: 1000, family: 'bowl' });

function measure(doc, only = null) {
  const S = A.toPath(doc).path.samples, offs = []; let o = 0; for (const P of doc.pieces) { offs.push(o); o += P.type === 'road' ? P.length : 0; }
  const rollAt = (s) => { let lo = 0, hi = S.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (S[m].s <= s) lo = m; else hi = m; } return (Math.abs(S[lo].s - s) <= Math.abs(S[hi].s - s) ? S[lo] : S[hi]).roll / DEG; };
  const rows = [];
  doc.pieces.forEach((P, i) => {
    if (P.type !== 'road' || (only && !only.includes(i))) return;
    const a = offs[i], L = P.length, b0 = D.channelAt(P, 'phi', 0).v / DEG, b1 = D.channelAt(P, 'phi', L).v / DEG;
    if (Math.abs(b1 - b0) <= 0.05) return;
    let arrive = L; for (let s = L; s >= 0; s -= 0.25) { if (Math.abs(D.channelAt(P, 'phi', s).v / DEG - b1) > 0.05) break; arrive = s; }
    const built = rollAt(a + arrive), off = Math.abs(built - b1);
    const b0built = rollAt(a); let startBuilt = null; for (let s = a - 300; s <= a + L; s += 0.5) { if (s < 0) continue; if (Math.abs(rollAt(s) - rollAt(Math.max(0, a - 300))) > 0.5) { startBuilt = s - a; break; } }
    let settle = null; for (let s = a + arrive; s <= a + L; s += 0.5) { if (Math.abs(rollAt(s) - b1) <= 0.5) { if (settle === null) settle = s - a - arrive; } else settle = null; }
    let peak = 0; for (let s = Math.max(2, a - 50); s <= Math.min(o - 2, a + L + 50); s += 2) peak = Math.max(peak, Math.abs(rollAt(s + 2) - 2 * rollAt(s) + rollAt(s - 2)) / 4);
    rows.push({ i, L: +L.toFixed(1), from: +b0.toFixed(2), to: +b1.toFixed(2), arrive: +arrive.toFixed(2), built: +built.toFixed(2), off: +off.toFixed(2), startBuilt: startBuilt === null ? null : +startBuilt.toFixed(1), settle: settle === null ? 'beyond' : +settle.toFixed(1), peak: +peak.toFixed(5), overBar: peak > BAR * 1.0001 });
  });
  return rows;
}
const out = { label: LABEL, tree: W, BAR_deg_m2: BAR, table: [], shapes: {} };
// 1 · the settle table (l135settle.js's 18 cases), one 1,000 m piece after a 1,000 m flat, then a 200 m straight
for (const shape of [null, 'rounded']) for (const d of [10, 30, 60]) for (const T of [60, 120, 300]) {
  const doc = extend(extend(flat(), { length: 1000, targets: { phi: d * DEG }, transition: T, ...(shape ? { bankShape: shape } : {}) }), { length: 200 });
  out.table.push({ case: `${shape || 'ease'} ${d}° over ${T} m`, ...measure(doc, [1])[0] });
}
// 2 · the keeper's shapes
const opts = (length, bank, early) => extendOptions({ length: String(length), turn: '', climb: '', bank: bank === null ? '' : String(bank), width: '', cup: '', edge: '', start: '', tube: '', atStart: early ? { bank: true } : {}, turnAs: 'rate' });
const HIS = [[750, -28.47, 1], [750, 12.01, 1], [750, 55, 0], [350, null, 0], [350, null, 0], [350, 0, 0], [750, -7, 1], [250, -90, 0], [250, -180, 0], [250, -270, 0], [250, -359.99, 0]];
{ let d = extend(D.createDoc('ribbon'), { length: 1000, family: 'bowl' }); for (const [L, b, e] of HIS) d = extend(d, opts(L, b, e)); out.shapes['his RIBBON CORKSCREW (core_joint_feel HIS)'] = measure(d); }
{ const d = D.parse(fs.readFileSync(path.join(W, 'test/fixtures/elysium-2026-10-22.t180track'), 'utf8')); out.shapes['ELYSIUM fixture (elysium-2026-10-22.t180track)'] = measure(d); }
{ const Q = (300 * Math.PI) / 2; let d = D.createDoc('lap');
  d = extend(d, { length: 100, family: 'bowl' }); d = extendTurnBy(d, { length: Q }, 90 * DEG);
  d = extend(d, { length: 100 }); d = extend(d, { length: Q / 2, targets: { kh: 1 / 300 } }); d = extendTurnBy(d, { length: Q / 2 }, 67.5 * DEG);
  d = extend(d, { length: 100, targets: { phi: -20 * DEG } }); d = extendTurnBy(d, { length: Q }, 90 * DEG);
  d = extend(d, { length: 100, targets: { phi: 0 } }); d = extendTurnBy(d, { length: Q }, 90 * DEG);
  out.shapes['the close-banks lap, open (core_close_banks_lap lap(): corner 3 banked by hand to −20° over 100 m)'] = measure(d); }
// 3 · his sketch piece: 750 m, turn 270° as a corner, climb −6°, bank −28.47° early, cup 15° early, width 30, then bank 0 (default from)
{ const o = extendOptions({ length: '750', turn: '270', climb: '-6', bank: '-28.47', width: '30', cup: '15', edge: '', start: '', tube: '', atStart: { bank: true, cup: true }, turnAs: 'corner', thenBank: '0', bankFrom: '' });
  let d = extend(D.createDoc('sketch'), { length: 1000, family: 'bowl' }); d = ('turnDeg' in o || 'climbDeg' in o) ? extendCorner(d, o) : extend(d, o); d = extend(d, { length: 200 });
  const P = d.pieces[1]; out.sketchOptions = { second: o.second, length: P.length };
  out.shapes['his sketch piece (750 m, 270° corner, −28.47° early, second bank to 0)'] = measure(d, [1]);
  // the second ramp of the sketch: the built bank at from and at the end
  const S = A.toPath(d).path.samples, r = (s) => { let b = S[0]; for (const x of S) if (Math.abs(x.s - s) < Math.abs(b.s - s)) b = x; return b.roll / DEG; };
  const F = o.second.phi.from; out.sketchSecond = { from: F, docAtFrom: +(D.channelAt(P, 'phi', F).v / DEG).toFixed(3), builtAtFrom: +r(1000 + F).toFixed(3), docAtEnd: +(D.channelAt(P, 'phi', P.length).v / DEG).toFixed(3), builtAtEnd: +r(1000 + P.length).toFixed(3) };
  // its early first ramp: where the document holds −28.47
  let hold = null; for (let s = 0; s <= F; s += 0.25) if (Math.abs(D.channelAt(P, 'phi', s).v / DEG + 28.47) <= 0.05) { hold = s; break; }
  out.sketchSecond.docReachesHoldAt = hold; out.sketchSecond.builtAtThatPoint = hold === null ? null : +r(1000 + hold).toFixed(3);
  let settle = null; if (hold !== null) for (let s = hold; s <= F; s += 0.5) { if (Math.abs(r(1000 + s) + 28.47) <= 0.5) { if (settle === null) settle = s - hold; } else settle = null; }
  out.sketchSecond.builtSettlesAfter = settle;
}
const file = path.join(__dirname, `l136measure-${LABEL.replace(/[^a-z0-9]/gi, '')}.json`); fs.writeFileSync(file, JSON.stringify(out, null, 1));
console.log(file);
