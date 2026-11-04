// usage (from the checkout): node zg.js — zonegrab row 14m's grab, measured: the reach of a move over 0.1 mm for the centre line and for the rims, the channels
// the grab changed, and whether the bank plan touched the grabbed piece
(async () => {
const path = require('path'), R = process.cwd();
const ZG = require(path.join(R, 'app/core/zonegrab.js')), D = require(path.join(R, 'src/core/document.js')), { toPath, bankPlan } = require(path.join(R, 'src/core/adapter.js')), { createCoreShell } = require(path.join(R, 'app/core/coreshell.js'));
const S0 = 100, DEGR = Math.PI / 180;
const road = (phiDeg) => D.appendPiece(D.createDoc('p'), D.roadPiece({ length: 200, family: 'flat', channels: { kh: () => 0, kv: () => 0, phi: () => phiDeg * DEGR, w: () => 32, r: () => 0 } }));   // zonegrab.test.js's road(), without the options row 14m does not pass
const gap = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const along = (doc) => { const { path: p, segments } = toPath(doc); return p.samples.filter((m) => Math.abs(m.s * 2 - Math.round(m.s * 2)) < 1e-9).map((m) => ({ s: m.s, p: [-1, 0, 1].map((u) => ZG.acrossAt(p, segments, m, u).pos) })); };
const doc = road(60), before = along(doc), { path: p, segments } = toPath(doc), F = ZG.frameAt(p, segments, S0, 0.5), d = ZG.follow([0, 1.5, 0], F, {});
const sh = await createCoreShell({ autosaveMs: 0 }); sh.adopt(doc); sh.setSculpt(true); sh.beginFollow({ s0: S0, r: 30 }); sh.brushTo(d);
const after = sh.getState().history.present, aa = along(after); sh.endBrush();
const reach = (k) => Math.max(0, ...aa.filter((x, i) => gap(x.p[k], before[i].p[k]) > 1e-4).map((x) => Math.abs(x.s - S0)));
const ch = Object.keys(doc.pieces[0].channels).filter((c) => JSON.stringify(doc.pieces[0].channels[c]) !== JSON.stringify(after.pieces[0].channels[c]));
console.log(`reach over 0.1 mm: left rim ${reach(0)} m, centre ${reach(1)} m, right rim ${reach(2)} m; channels the grab changed: ${ch.join(', ')}; the plan rounds this piece: ${!!bankPlan(after)[0].fn}`);
{ const rb = toPath(doc).path.samples, ra = toPath(after).path.samples; let m = 0, rim = 0; ra.forEach((x, i) => { if (Math.abs(x.s - S0) > 30) m = Math.max(m, Math.abs(x.roll - rb[i].roll)); }); aa.forEach((x, i) => { if (Math.abs(x.s - S0) > 30) rim = Math.max(rim, gap(x.p[0], before[i].p[0]), gap(x.p[2], before[i].p[2])); }); console.log(`beyond 30 m: the roll moves at most ${(m / DEGR).toFixed(4)} deg, a rim at most ${(rim * 1000).toFixed(2)} mm`); }
process.exit(0);
})();
