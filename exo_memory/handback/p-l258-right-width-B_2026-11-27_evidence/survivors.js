// survivors.js (pane B, L258): the right-width harness's surviving mutants (R6, R7, R18-R22), each read against the unmutated tree on candidate scenarios, to
// design a row that sees it (or to show it changes nothing). Each mutant is applied to a COPY of src/ in a temp folder (the harness's own strings, from
// test/core_right_width_mutation.test.js MUTANTS), never to the tree. Prints one line a scenario: original | mutant. usage: node survivors.js <tree>
'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const T = path.resolve(process.argv[2]);
// the seven survivors' edits, copied from test/core_right_width_mutation.test.js MUTANTS (the same strings)
const DOC = 'src/core/document.js', EX = 'src/core/extend.js', CL = 'src/core/close.js';
const MUTANTS = [
  { id: 'R6 x', edits: [[DOC, "(OFFSETS.includes(ch) || ch === 'wd')", 'OFFSETS.includes(ch)']] },
  { id: 'R7 x', edits: [[DOC, '  if (!P.split) out.wd = { v: 0, m: 0 };', '']] },
  { id: 'R18 x', edits: [[EX, 'er: 26, wd: 40 });', 'er: 26, wd: 1 });']] },
  { id: 'R19 x', edits: [[EX, 'if (startShapes.w && !startShapes.wd)', 'if (false)']] },
  { id: 'R20 x', edits: [[EX, "(C2_CHANNELS.has(ch) || ch === 'w' || ch === 'wd') && isShares(shape)", "(C2_CHANNELS.has(ch) || ch === 'w') && isShares(shape)"]] },
  { id: 'R21 x', edits: [[EX, 'if (split && tube) throw', 'if (false) throw']] },
  { id: 'R22 x', edits: [[CL, ", ...(sm.splitBoth ? ['wd'] : [])];", '];']] },
];
function copyWith(id) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 't180-l258-surv-'));
  for (const d of ['src', 'tools']) fs.cpSync(path.join(T, d), path.join(dir, d), { recursive: true });
  if (id) { const m = MUTANTS.find((x) => x.id.startsWith(id + ' ')); for (const [file, from, to] of m.edits) { const f = path.join(dir, file), s = fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n'); if (s.split(from).length !== 2) throw new Error(`${id}: not applied in ${file}`); fs.writeFileSync(f, s.replace(from, () => to)); } }
  return dir;
}
const load = (dir) => ({ D: require(path.join(dir, 'src/core/document.js')), X: require(path.join(dir, 'src/core/extend.js')), CL: require(path.join(dir, 'src/core/close.js')) });
const W = 19.1, WR = 22.6, STEP = WR - W;
const tryv = (f) => { try { return f(); } catch (e) { return `THROWS ${e.code || ''} ${String(e.message).slice(0, 110)}`; } };
const r4 = (x) => (typeof x === 'number' ? Math.round(x * 1e4) / 1e4 : x);
const SCEN = {
  R6: ({ D, X }) => { const d = X.extend(X.extend(D.createDoc('r'), { length: 120, first: { w: W }, targets: { kh: 0 } }), { length: 100, targets: { wd: STEP } }), P = d.pieces[1];
    const ch = Object.fromEntries(Object.entries(P.channels).filter(([k]) => k !== 'wd'));
    // (corrected: a first version gave a 60 m piece the 100 m piece's control points, and both trees refused it BAD_CHANNEL; now the piece's own length and knots)
    return tryv(() => { const Q = D.roadPiece({ id: 'x', length: P.length, family: P.family, from: D.pieceEnd(P), channels: ch, knots: P.knots, split: true }); return `wd start ${r4(D.channelValue(Q, 'wd', 0))} end ${r4(D.pieceEnd(Q).wd.v)}`; }); },
  R7: ({ D, X }) => { const d = X.extend(D.createDoc('r'), { length: 120, first: { w: W }, targets: { kh: 0 } }), P = d.pieces[0]; const { wd, ...rest } = P.channels;
    return tryv(() => JSON.stringify(D.pieceEnd({ ...P, channels: rest }).wd)); },
  R18: ({ D, X }) => [tryv(() => r4(X.secondMinM('wd', 0, STEP))), tryv(() => r4(X.secondMinM('w', W, WR))),
    tryv(() => { const m = X.extend(X.extend(D.createDoc('r'), { length: 120, first: { w: W }, targets: { kh: 0 } }), { length: 200, targets: { wd: STEP }, changes: { wd: [{ from: 190, target: 0 }] } }); return 'laid, end ' + r4(D.pieceEnd(m.pieces[1]).wd.v); })].join(' ; '),
  R19: ({ D, X }) => tryv(() => { const sh = { rise: 0.2, fall: 0.8 }; const m = X.extend(X.extend(D.createDoc('r'), { length: 120, first: { w: W }, targets: { kh: 0 } }), { length: 200, targets: { w: WR, wd: STEP }, transition: { w: 'start', wd: 'start' }, startShapes: { w: sh } }), P = m.pieces[1];
    return [5, 10, 15].map((s) => `${s}: w ${r4((D.channelValue(P, 'w', s) - W) / (WR - W))} wd ${r4(D.channelValue(P, 'wd', s) / STEP)}`).join(', '); }),
  R20: ({ D, X }) => tryv(() => { const sh = { rise: 0.2, fall: 0.8 }; const m = X.extend(X.extend(D.createDoc('r'), { length: 120, first: { w: W }, targets: { kh: 0 } }), { length: 200, targets: { w: WR, wd: STEP }, transition: { w: 'start', wd: 'start' }, startShapes: { w: sh, wd: sh } }), P = m.pieces[1];
    return [5, 10, 15].map((s) => `${s}: w ${r4((D.channelValue(P, 'w', s) - W) / (WR - W))} wd ${r4(D.channelValue(P, 'wd', s) / STEP)}`).join(', '); }),
  R21: ({ D, X }) => tryv(() => { const t = X.extend(D.createDoc('tube'), { length: 120, first: { w: W, t: 200 }, targets: { kh: 0 } }); const n = X.extend(t, { length: 100, targets: { wd: STEP } }); return `laid: tube ${!!n.pieces[1].tube} split ${!!n.pieces[1].split}`; }),
  R22: ({ D, X, CL }) => tryv(() => { const Q = (Math.PI * 180) / 2;
    let d = X.extend(D.createDoc('lap'), { length: 300, first: { w: W }, targets: { kh: 0, wd: STEP } });
    for (let i = 0; i < 4; i++) d = X.extend(d, { length: Q, transition: 40, targets: { kh: 1 / 180 } });
    d = X.extend(d, { length: 60, transition: 40, targets: { kh: 0, wd: 2 } });
    const r = CL.close(d, { edited: [0] }), last = r.doc.pieces[r.doc.pieces.length - 1];
    return `converged ${r.converged}; wd at the start ${r4(D.channelValue(r.doc.pieces[0], 'wd', 0))}, at the end ${r4(D.pieceEnd(last).wd.v)}; first piece split ${!!r.doc.pieces[0].split}`; }),
};
const only = process.argv.slice(3);
const orig = load(copyWith(null));
for (const id of Object.keys(SCEN).filter((k) => !only.length || only.includes(k))) {
  const mut = load(copyWith(id));
  console.log(`${id}\n  original: ${SCEN[id](orig)}\n  mutant:   ${SCEN[id](mut)}`);
}
