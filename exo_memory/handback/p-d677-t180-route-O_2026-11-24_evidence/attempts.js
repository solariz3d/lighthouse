// The attempts, each typed into the panel and read on the built road beside the S he drove (laid through the core: core_bank_flow.test.js S_OPTS + EASE_OUT).
'use strict';
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const { mountPanel, piece, shape, LEAD, DEG, D, TB, extend } = require('./route.js');
const M = (pairs) => [{ s: LEAD, deg: 0 }, ...pairs.map(([at, deg]) => ({ s: LEAD + at, deg }))];
const ATTEMPTS = [
  { id: 'P (pane P\'s, one piece)', marks: M([[112, -27], [165, 0], [215, 26]]), pieces: [
    { L: 330, turn: 90, bank: -27, flow: true, at: 112, rows: [['turn', -90, 165], ['bank', 0, 165], ['bank', 26, 215]] }] },
  { id: '1a two corners, the crossing at their joint, then an ease-out', marks: M([[55, -27], [110, 0], [155, 26], [200, 26], [300, 0]]), pieces: [
    { L: 110, turn: 90, bank: -27, flow: true, at: 55, rows: [['bank', 0, 110]] },
    { L: 90, turn: -90, bank: 26, flow: true, at: 45 },
    { L: 150, bank: 0, flow: true, at: 100 }] },
  { id: '1b two corners, the bank held into turn B and crossed inside it', marks: M([[55, -27], [110, -27], [120, 0], [155, 26], [200, 26], [300, 0]]), pieces: [
    { L: 110, turn: 90, bank: -27, flow: true, at: 55 },
    { L: 90, turn: -90, bank: 0, flow: true, at: 10, rows: [['bank', 26, 45]] },
    { L: 150, bank: 0, flow: true, at: 100 }] },
  { id: '2z one piece: turn 0 as a corner, two extra turns, the S marks; then the ease-out', marks: M([[80, -20], [145, -27], [200, 0], [255, 25], [300, 26], [400, 0]]), pieces: [
    { L: 300, turn: 0, bank: -20, flow: true, at: 80, rows: [['turn', 92, 80], ['turn', -91, 200], ['bank', -27, 145], ['bank', 0, 200], ['bank', 25, 255], ['bank', 26, 300]] },
    { L: 150, bank: 0, flow: true, at: 100 }] },
];
(async () => {
  // the S he drove, through the core
  const lead = () => extend(D.createDoc('flow'), { length: LEAD, family: 'bowl', first: { w: 33 } });
  const MARKS = [{ at: 145, deg: -27 }, { at: 200, deg: 0 }, { at: 255, deg: 25 }, { at: 300, deg: 26 }];
  const S_OPTS = { length: 300, turnDeg: 0, changes: { turnDeg: [{ from: 80, deg: 92 }, { from: 200, deg: -91 }] }, targets: { phi: -20 * DEG }, transition: { phi: 80 }, bankShape: 'flow', through: { phi: MARKS.map((m) => ({ at: m.at, target: m.deg * DEG })) } };
  const S = extend(TB.extendCorner(lead(), S_OPTS), { length: 150, targets: { phi: 0 }, transition: { phi: 100 }, bankShape: 'flow' });
  const out = (id, doc, marks) => { const r = shape(doc, marks); console.log(`${id}\n  turn A ${r.turnA}\n  turn B ${r.turnB}\n  bank ${r.bank}; range ${r.range}\n  halts in the roll: ${r.halts}`); };
  out('S (the core, as he drove it)', S, M([[80, -20], [145, -27], [200, 0], [255, 25], [300, 26], [400, 0]]));
  const only = process.argv[2];
  for (const a of ATTEMPTS.filter((x) => !only || x.id.startsWith(only))) {
    const p = await mountPanel(); let ok = true;
    for (const [k, s] of a.pieces.entries()) { const r = await piece(p, s); if (!r.laid) { console.log(`${a.id}: piece ${k + 1} REFUSED: ${r.msg}`); ok = false; break; } if (process.env.SENT) console.log(`  piece ${k + 1} sent ${JSON.stringify(r.sent)}`); }
    if (ok) out(a.id, D.parse(p.shell.text()), a.marks);
  }
})().catch((e) => { console.error(e); process.exit(1); });
