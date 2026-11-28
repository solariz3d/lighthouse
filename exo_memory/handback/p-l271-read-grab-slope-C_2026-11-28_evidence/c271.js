// c271.js <tree> <label> <out.json>: pane C, L271 read of l271-grab-slope. Every case is a grab made through the tree's own core shell as the zonegrab rows make it
// (adopt, setSculpt, zoneInfo, frameAt, follow, beginFollow, brushTo, endBrush), on roads I build myself through the tree's own core (D.roadPiece; the even fixtures by
// test/even_fixtures.js build() at 6aaec86, copied). Run once on c522ea6 (today) and once on cc4fa71 (the branch); cmp271.js compares the two outputs.
// Read per case: follow's channel set d; the saved text's sha256; at the press: the bank, the width, the middle (h, l); the most the bank moves over the window
// (every 1 m, s0-r-5 .. s0+r+5); the far rim's move; where the pressed point ends against the pointer (across along R, and up along world y).
'use strict';
const path = require('path'), fs = require('fs'), crypto = require('crypto');
const T = path.resolve(process.argv[2]), LABEL = process.argv[3], OUT = process.argv[4];
const D = require(path.join(T, 'src/core/document.js')), ZG = require(path.join(T, 'app/core/zonegrab.js')), AD = require(path.join(T, 'src/core/adapter.js'));
const TB = require(path.join(T, 'src/core/turnby.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
const DEG = Math.PI / 180, sha = (t) => crypto.createHash('sha256').update(t).digest('hex');
const gap = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]), dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const surface = (doc, u, s) => { const { path: p, segments } = AD.toPath(doc), m = p.samples.find((x) => Math.abs(x.s - s) < 1e-9); return ZG.acrossAt(p, segments, m, u).pos; };
const at = (doc, ch, s) => { let a = 0; for (const P of doc.pieces) { if (P.type === 'road' && s >= a - 1e-9 && s <= a + P.length + 1e-9) return D.channelAt(P, ch, Math.min(P.length, Math.max(0, s - a))).v; a += P.length; } return NaN; };
// one 200 m road piece; o: phi (deg), kh, family, cup (deg), edge {e, er, s} (deg, share), tube t (deg), r (rise rate)
function road(o = {}) {
  const ch = { kh: () => o.kh || 0, kv: () => 0, phi: () => (o.phi || 0) * DEG, w: () => o.w || 32, r: () => o.r || 0 };
  const flags = {};
  if (o.cup !== undefined) { flags.cup = true; ch.c = () => o.cup; }
  if (o.edge) { flags.edge = true; ch.e = () => o.edge.e; ch.er = () => o.edge.er; ch.s = () => o.edge.s; }
  if (o.tube !== undefined) { flags.tube = true; ch.t = () => o.tube; }
  return D.appendPiece(D.createDoc('p'), D.roadPiece({ length: 200, family: o.family || 'flat', ...flags, channels: ch }));
}
// B's fixtures, as even_fixtures.js build() (6aaec86): 'plan' banks the turn's four pieces
const PLAN = (b) => [{ length: 100, turn: 0, bank: 0 }, { length: 100, turn: 0, bank: 0 }, ...[1, 2, 3, 4].map(() => ({ length: 60, turn: 30, bank: b })), { length: 150, turn: 0, bank: 0 }];
function build(list, cup) { let d = D.createDoc('even'); for (const p of list) d = TB.extendCorner(d, extendOptions({ length: p.length, turn: p.turn, climb: 0, bank: p.bank, width: 12, turnAs: 'corner', ...(cup === undefined ? {} : { cup }) })); return d; }
async function grab(doc, s0, r, u, deltaOf) {
  const sh = await createCoreShell({ autosaveMs: 0 }); sh.adopt(doc); sh.setSculpt(true);
  const { path: p, segments } = AD.toPath(doc), F = ZG.frameAt(p, segments, s0, u);
  if (!F) return { err: 'no frame' };
  const delta = deltaOf(F), info = sh.zoneInfo(s0, u);
  let d; try { d = ZG.follow(delta, F, info); } catch (e) { return { err: `follow threw: ${e.message}` }; }
  if (!d) return { err: 'follow null' };
  sh.beginFollow({ s0, r }); if (!sh.getState().brush) return { err: `no follow: ${sh.getState().message}` };
  sh.brushTo(d); const out = sh.getState().history.present, msg = sh.getState().message; sh.endBrush();
  if (out === doc) return { err: `unchanged: ${msg}`, d };
  const fu = u < 0 ? 1 : -1, p0 = surface(doc, u, s0), p1 = surface(out, u, s0);
  const want = p0.map((x, k) => x + delta[k] - dot(delta, F.T) * F.T[k]), off = p1.map((x, k) => x - want[k]);
  let bankMove = 0, bankAt = null;
  for (let s = Math.max(0, s0 - r - 5); s <= s0 + r + 5; s += 1) { const dd = Math.abs(at(out, 'phi', s) - at(doc, 'phi', s)) / DEG; if (dd > bankMove) { bankMove = dd; bankAt = s; } }
  const fin = [d.h, d.l, d.w, d.phi].filter((x) => x !== undefined).every(Number.isFinite) && [p1, ...[0, 1, 2].map(() => p1)].every((q) => q.every(Number.isFinite));
  return {
    d, text: sha(D.serialize(out)), finite: fin, msg: msg || null,
    bank: { before: at(doc, 'phi', s0) / DEG, after: at(out, 'phi', s0) / DEG }, bankMoveMaxDeg: bankMove, bankMoveAt: bankAt,
    width: { before: at(doc, 'w', s0), after: at(out, 'w', s0) }, mid: { dh: at(out, 'h', s0) - at(doc, 'h', s0), dl: at(out, 'l', s0) - at(doc, 'l', s0) },
    far: gap(surface(out, fu, s0), surface(doc, fu, s0)), fromPointer: { across: dot(off, F.R), up: off[1], total: Math.hypot(...off) },
    chord: (() => { const c = p0.map((x, k) => x - surface(doc, fu, s0)[k]); return { slopeDeg: Math.atan2(dot(c, F.U0), Math.abs(dot(c, F.R))) / DEG }; })(),
  };
}
const H = (e) => (F) => F.R.map((x) => x * e);           // a horizontal pull along R (left +)
const OUTP = (e, u) => H(e * (u < 0 ? -1 : 1));         // a pull OUT from the pressed side by e m (in if e < 0)
const LIFT = (up) => () => [0, up, 0];
const DIAG = (e, up, u) => (F) => F.R.map((x, k) => x * e * (u < 0 ? -1 : 1) + (k === 1 ? up : 0));
(async () => {
  const cases = [];
  const add = async (group, name, doc, s0, r, u, g, gname) => cases.push({ group, name, u, gesture: gname, ...(await grab(doc, s0, r, u, g)) });
  const US = [1, -1, 0.95, -0.95, 0.5, -0.5, 0.25, -1.2];
  const GEST = (u) => [['out 3', OUTP(3, u)], ['in 2', OUTP(-2, u)], ['lift 1.5', LIFT(1.5)], ['sink 1', LIFT(-1)], ['diag 2,1', DIAG(2, 1, u)]];
  // C2: flat roads with no cup: straight, turning, and narrow
  for (const [nm, o] of [['flat straight 32', {}], ['flat turn kh 1/150', { kh: 1 / 150 }], ['flat narrow 12', { w: 12 }]]) for (const u of US) for (const [gn, g] of GEST(u)) await add('C2 flat no cup', nm, road(o), 100, 30, u, g, gn);
  // C2 control: a cupped road, a pull pressed inside the rim (B's R2 mechanism)
  for (const u of [0.95, 0.5, -0.5]) for (const [gn, g] of GEST(u)) await add('C2 control cup 30', 'bowl cup 30', road({ family: 'bowl', cup: 30 }), 100, 30, u, g, gn);
  // C3: banked roads, a horizontal pull out and in; my roads (straight and turning, +-20, +-45) and B's fixture B- / B+ (T1: s 320, the right rim pulled 4 m out, r 30)
  for (const phi of [20, -20, 45, -45]) for (const kh of [0, 1 / 150]) for (const u of [1, -1, 0.95, 0.5]) for (const [gn, g] of [['out 4', OUTP(4, u)], ['in 2', OUTP(-2, u)]]) await add('C3 banked', `phi ${phi} kh ${kh ? '1/150' : 0}`, road({ phi, kh }), 100, 30, u, g, gn);
  for (const [nm, b] of [['B- (plan -20)', -20], ['B+ (plan 20)', 20]]) await add('C3 fixture', nm, build(PLAN(b)), 320, 30, -1, OUTP(4, -1), 'T1: out 4 at the right rim');
  for (const u of [0.95, 0.5, 1]) await add('C3 fixture F (cup default)', 'F (plan 0, default cup)', build(PLAN(0)), 320, 30, -u, OUTP(4, -u), 'out 4');
  // C4: lifts on every road kind (filled below with the C5 roads too)
  // C5: the untested three
  const EDGES = [['edge e 30 er 0 s 0.64, flat', { family: 'bowl', cup: 10, edge: { e: 30, er: 0, s: 0.64 } }], ['edge e 0 er 40 s 0.5, flat', { family: 'bowl', cup: 10, edge: { e: 0, er: 40, s: 0.5 } }],
    ['edge e 30 er 30 s 0.64, flat (symmetric)', { family: 'bowl', cup: 10, edge: { e: 30, er: 30, s: 0.64 } }], ['edge e 30 er 0 s 0.64, bank 20', { family: 'bowl', cup: 10, phi: 20, edge: { e: 30, er: 0, s: 0.64 } }]];
  const TUBES = [['tube t 200', { family: 'bowl', tube: 200 }], ['tube t 300', { family: 'bowl', tube: 300 }], ['tube t 200, bank 20', { family: 'bowl', tube: 200, phi: 20 }]];
  const PIPES = [['half-pipe r 0.3', { family: 'half-pipe', r: 0.3 }], ['half-pipe r 0.6', { family: 'half-pipe', r: 0.6 }], ['half-pipe r 0.3, bank 20', { family: 'half-pipe', r: 0.3, phi: 20 }]];
  for (const [grp, list] of [['C5 edge', EDGES], ['C5 tube', TUBES], ['C5 half-pipe wall', PIPES]]) for (const [nm, o] of list) {
    let doc; try { doc = road(o); } catch (e) { cases.push({ group: grp, name: nm, err: `road refused: ${e.code || ''} ${e.message}` }); continue; }
    for (const u of [1, -1, 0.95, -0.95, 0.7, -0.7, 0.5, -0.5]) for (const [gn, g] of GEST(u)) await add(grp, nm, doc, 100, 30, u, g, gn);
  }
  // C4 on the plain roads too: a lift on banked and cupped roads
  for (const o of [{ phi: 20 }, { phi: -45, kh: 1 / 150 }, { family: 'bowl', cup: 30 }]) for (const u of [1, -0.95, 0.5]) for (const up of [1.5, -1, 2.5]) await add('C4 lift', JSON.stringify(o), road(o), 100, 30, u, LIFT(up), `lift ${up}`);
  fs.writeFileSync(OUT, JSON.stringify({ tree: LABEL, cases }, null, 0));
  console.log(LABEL, 'cases', cases.length, 'errors', cases.filter((c) => c.err).length);
})().catch((e) => { console.error('FATAL', e && e.stack || e); process.exitCode = 1; });
