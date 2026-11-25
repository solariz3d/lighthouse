// Records row 2's pins (app/test/core-bank-flow-panel.test.js) on the tree it is run in: the matrix is the test's, copied; the test checks one pin per row by id.
// Run in the t180 worktree at 57e4b1c, BEFORE the box: node G:/consonance-scratch/o-smooth-work/flow_panel_pins.js <tree> > pins.json
'use strict';
const T = process.argv[2], crypto = require('crypto');
(async () => {
const D = require(T + '/src/core/document.js'), TB = require(T + '/src/core/turnby.js'), { extend } = require(T + '/src/core/extend.js'), { extendOptions } = require(T + '/app/core/panel.js');
const LEAD = 300, LEAD_DOC = extend(D.createDoc('unmoved'), { length: LEAD, family: 'bowl', first: { w: 33 } });
const HEAD = { phi: 0, c: D.endState(LEAD_DOC).c.v, e: 0, er: 0 };
// the core's minimums, through a shell on the lead, as the panel's opts() passes them
const sh = await require(T + '/app/core/coreshell.js').createCoreShell({ brushFn: null }); sh.commitDoc(LEAD_DOC);
const MINS = { secondMinM: sh.secondMinM, cornerChangeMinM: (deg, baseDeg, L) => sh.cornerChangeMinM(LEAD_DOC, { length: L }, deg, baseDeg), secondFloorM: sh.secondFloorM(), bankFloorM: sh.bankFitFloorM(), bankRefusal: (o) => !!sh.changeRefusal(o, 'phi', null) };
const MATRIX = [];
for (const L of ['300', '1000']) for (const bank of ['', '30', '-41.38']) for (const early of [false, true]) for (const rows of [[], [{ then: '0', from: '' }], [{ then: '10', from: '' }, { then: '-5', from: '' }]]) for (const turn of ['', '90']) {
  if (bank === '' && (early || rows.length)) continue;
  MATRIX.push({ id: `L ${L} · bank ${bank || 'shown'}${early ? ' early' : ''} · ${rows.length} row(s)${turn ? ` · turn ${turn}° as a corner` : ''}`, f: { length: L, bank, turn, turnAs: turn ? 'corner' : 'rate', atStart: { bank: early }, head: HEAD, changes: rows.length ? { bank: rows } : null, ...MINS } });
}
const layHash = (o) => { let text; try { text = D.serialize(TB.extendCorner(LEAD_DOC, o)); } catch (e) { if (e.name !== 'CoreError') throw e; text = `refused ${e.code}: ${e.message}`; } return { h: crypto.createHash('sha256').update(text).digest('hex'), refused: text.startsWith('refused') ? text : null }; };
const out = {}; let refused = 0;
for (const { id, f } of MATRIX) { const r = layHash(extendOptions(f)); out[id] = r.h; if (r.refused) { refused++; console.error(id, '->', r.refused.slice(0, 160)); } }
console.error(MATRIX.length, 'rows,', refused, 'refused');
process.stdout.write(JSON.stringify(out, null, 2) + '\n');
})();
