// truth.js <tree> <saves>: every "from at least X" the new message stated in my sample (and his mirrored case): lay at X (must be laid) and at X − 1 (must be refused)
'use strict';
const path = require('path'), fs = require('fs'), W = path.resolve(process.argv[2]), SAVES = path.resolve(process.argv[3]), q = (m) => require(path.join(W, m));
require('C:/Consonance/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'pane E L152: mirror message truth (BelowNormal; not a timing session)' });
const D = q('src/core/document.js'), X = q('src/core/extend.js'), TB = q('src/core/turnby.js'), { extendOptions } = q('app/core/panel.js');
const err = D.parse(fs.readFileSync(path.join(SAVES, 'error.t180track'), 'utf8')), cmin = (deg) => TB.cornerChangeMinM(err, {}, deg);
const fields = (f) => ({ turn: '', climb: '', bank: '', width: '', cup: '', edge: '', start: '', tube: '', atStart: {}, turnAs: 'corner', ...f, secondMinM: X.secondMinM, cornerChangeMinM: cmin, secondFloorM: 20 });
const S = JSON.parse(fs.readFileSync(path.join(__dirname, 'mirror-mirror.json'), 'utf8'));
const full = (r, F) => { const ch = { bank: [{ then: String(r.xb), from: String(F) }] }; if (r.xt !== null) ch.turn = [{ then: String(r.xt), from: String(Math.round(r.L * 0.5)) }]; try { TB.extendCorner(err, extendOptions(fields({ length: String(r.L), turn: String(r.turn), bank: String(r.bank), atStart: r.early ? { bank: true } : {}, changes: ch }))); return ''; } catch (e) { return String(e.message); } };
const cases = S.sample.filter((r) => r.refused && /is laid over the bar/.test(r.msg)).map((r) => ({ id: '#' + r.i, mk: (F) => { const ch = { bank: [{ then: String(r.xb), from: String(F) }] }; if (r.xt !== null) ch.turn = [{ then: String(r.xt), from: String(Math.round(r.L * 0.5)) }]; return fields({ length: String(r.L), turn: String(r.turn), bank: String(r.bank), atStart: r.early ? { bank: true } : {}, changes: ch }); }, x: +full(r, r.from).match(/from at least ([\d.]+)/)[1] }));
cases.push({ id: 'his mirrored case', x: 553, mk: (F) => fields({ length: '1000', turn: '-90', bank: '34.78', changes: { turn: [{ then: '180', from: '500' }], bank: [{ then: '-34.78', from: String(F) }] } }) });
const lay = (f) => { try { TB.extendCorner(err, extendOptions(f)); return 'laid'; } catch (e) { return 'refused ' + e.code; } };
let ok = 0;
for (const c of cases) { const at = lay(c.mk(c.x)), before = lay(c.mk(+(c.x - 1).toFixed(2))); const good = at === 'laid' && before !== 'laid'; if (good) ok++; console.log(c.id, 'from at least', c.x, '→ at X:', at, '| at X − 1:', before, good ? 'TRUE' : 'NOT TRUE'); }
for (const F of [552, 553, 554]) console.log('his case from', F, lay(cases[cases.length - 1].mk(F)));
console.log('true', ok, 'of', cases.length);
