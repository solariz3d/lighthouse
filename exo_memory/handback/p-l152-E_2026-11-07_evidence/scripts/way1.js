// way1.js <tree> <saves dir>: pane E, L152 review of l151-way1 (read-only).
// (1) His S through the panel's extendOptions (corner −90, bank 17.39 and 30, extra turn +180 with a blank from, extra bank to −34.78 with a blank from):
//     the marks laid, and my L150 measure (loop/l150_registration_2026-11-07.md): κ_x = the piece less the same piece with no extra turn (the bank mark TYPED to
//     the same metre, so the reference keeps it), φ_x = the piece less the same with no extra bank; the 5 % and 50 % points every 1 m; λ_doc, λ_onset; the bank at 579 m
//     (document and built), where the built bank crosses 0.
// (2) His good save: p2 rebuilt through extendOptions on the error save's p1 (nextId 2), the whole serialized file against his file, byte for byte.
// (3) Both orders through the REAL panel (fake DOM, the real core shell): turn → extra turn → extra bank, and turn → extra bank → extra turn; plus a slid and a typed
//     mark kept; the marks, and whether the two documents are byte-equal.
'use strict';
const path = require('path'), fs = require('fs'), crypto = require('crypto');
const W = path.resolve(process.argv[2]), SAVES = path.resolve(process.argv[3]), q = (m) => require(path.join(W, m));
require('C:/Consonance/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'pane E L152: way-1 review measure (BelowNormal; not a timing session)' });
try { require('os').setPriority(require('os').constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) {}
const D = q('src/core/document.js'), X = q('src/core/extend.js'), A = q('src/core/adapter.js'), TB = q('src/core/turnby.js');
const { extendOptions } = q('app/core/panel.js');
const DEG = Math.PI / 180, h16 = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
const err = D.parse(fs.readFileSync(path.join(SAVES, 'error.t180track'), 'utf8'));
const goodTxt = fs.readFileSync(path.join(SAVES, 'good.t180track'), 'utf8');
const cmin = (deg) => TB.cornerChangeMinM(err, {}, deg);
const fields = (f) => ({ length: '1000', turn: '', climb: '', bank: '', width: '', cup: '', edge: '', start: '', tube: '', atStart: {}, turnAs: 'corner', ...f, secondMinM: X.secondMinM, cornerChangeMinM: cmin, secondFloorM: 20 });
const lay = (o) => TB.extendCorner(err, o);
const out = { tree: path.basename(W), S: {}, good: null, orders: null };
// (1)
for (const b1 of [17.39, 30]) {
  const o = extendOptions(fields({ turn: '-90', bank: String(b1), changes: { turn: [{ then: '180', from: '' }], bank: [{ then: '-34.78', from: process.env.BANKFROM || '' }] } }));
  const turnFrom = o.changes.turnDeg[0].from, bankFrom = o.changes.phi[0].from;
  const d = lay(o), P = d.pieces[1];
  const oNoTurn = extendOptions(fields({ turn: '-90', bank: String(b1), changes: { bank: [{ then: '-34.78', from: String(bankFrom) }] } })), Pt = lay(oNoTurn).pieces[1];
  const oNoBank = extendOptions(fields({ turn: '-90', bank: String(b1), changes: { turn: [{ then: '180', from: String(turnFrom) }] } })), Pb = lay(oNoBank).pieces[1];
  const S = A.toPath(d).path.samples, roll = (s) => { let lo = 0, hi = S.length - 1; const t = 1000 + s; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (S[m].s <= t) lo = m; else hi = m; } return S[lo].roll / DEG; };
  const Sb = A.toPath(lay(oNoBank)).path.samples, rollB = (s) => { let lo = 0, hi = Sb.length - 1; const t = 1000 + s; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (Sb[m].s <= t) lo = m; else hi = m; } return Sb[lo].roll / DEG; };
  const kx = (s) => D.channelAt(P, 'kh', s).v - D.channelAt(Pt, 'kh', s).v, px = (s) => D.channelAt(P, 'phi', s).v / DEG - D.channelAt(Pb, 'phi', s).v / DEG, pxb = (s) => roll(s) - rollB(s);
  const a = Math.min(turnFrom, bankFrom); let kpk = 0; for (let s = a; s <= 1000; s += 1) kpk = Math.max(kpk, Math.abs(kx(s)));
  const tot = px(1000), first = (f, frac, ref) => { for (let s = a; s <= 1000; s += 1) if (Math.abs(f(s)) >= frac * ref) return s; return null; };
  const k5 = first(kx, 0.05, kpk), k50 = first(kx, 0.5, kpk), p5 = first(px, 0.05, Math.abs(tot)), p50 = first(px, 0.5, Math.abs(tot)), b5 = first(pxb, 0.05, Math.abs(tot)), b50 = first(pxb, 0.5, Math.abs(tot));
  let cross = null; for (let s = a; s <= 1000; s += 1) if (roll(s) <= 0) { cross = s; break; }
  out.S[`first bank ${b1}`] = { turnFrom, bankFrom, k5, k50, phiDoc5: p5, phiDoc50: p50, phiBuilt5: b5, phiBuilt50: b50, lamDoc: p50 - k50, lamBuilt: b50 - p50, lamOnset: b5 - k5,
    bankAt579doc: +(D.channelAt(P, 'phi', 579).v / DEG).toFixed(2), bankAt579built: +roll(579).toFixed(2), builtCrossesZeroAt: cross, docHash: h16(D.serialize(d)) };
}
// (2)
{ const o = extendOptions(fields({ turn: '-90', bank: '50', changes: { bank: [{ then: '0', from: '500' }] } })); const txt = D.serialize(lay(o));
  out.good = { bankFrom: o.changes.phi[0].from, equal: txt === goodTxt || txt === goodTxt.replace(/\r?\n$/, '') || txt + '\n' === goodTxt, bytes: [Buffer.byteLength(txt), Buffer.byteLength(goodTxt)], rebuilt: h16(txt), his: h16(goodTxt) }; }
// (3) the real panel, both orders
(async () => {
  process.argv[2] = W; const { mount } = require(path.join(__dirname, 'mount.js'));
  const run = async (order, pre) => {
    const p = await mount(1000, err); p.type('length m', 1000); p.type('turn °', -90); p.type('bank °', 17.39);
    if (pre) pre(p);
    for (const k of order) { const kind = k === 'turn' ? 'extra:turnDeg:0' : 'extra:bank:0'; p.panel.secondExtra(kind, k === 'turn' ? 180 : -34.78); p.tick(); }
    const o = p.panel.options(), ch = o.changes || {}; let doc = null, ref = null; try { doc = D.serialize(TB.extendCorner(p.shell.getState().history.present, o)); } catch (e) { ref = `${e.code}: ${String(e.message).slice(0, 120)}`; }
    const r = { order: order.join(' > '), turnFrom: ch.turnDeg && ch.turnDeg[0] && ch.turnDeg[0].from, turnDeg: ch.turnDeg && ch.turnDeg[0] && ch.turnDeg[0].deg, bankFrom: ch.phi && ch.phi[0] && ch.phi[0].from, bankTarget: ch.phi && ch.phi[0] && +(ch.phi[0].target / DEG).toFixed(2), refused: ref, docHash: doc ? h16(doc) : null };
    p.panel.unmount(); return r;
  };
  const o = {};
  o.A = await run(['turn', 'bank']);
  o.B = await run(['bank', 'turn']);
  o.slidThenTurn = await run(['bank', 'turn'], (p) => { p.panel.secondSlide('extra:bank:0', 450); p.tick(); });
  o.equalAB = o.A.docHash !== null && o.A.docHash === o.B.docHash;
  out.orders = o;
  console.log(JSON.stringify(out, null, 1));
})().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
