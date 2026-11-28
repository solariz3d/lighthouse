// probe271.js (pane B, L271 role 2): the grab along the slope against today's grab and D's literal followChord. Rows registered in
// handback/p-l271-grab-slope-B_2026-11-28.md (4febfd3b) before this was written. The fixtures and D's grab are even678.js's (D678 probe 2), copied unchanged.
//   node probe271.js <worktree on l271-grab-slope> <base sha> <out.json>
// TODAY is the base's app/core/zonegrab.js (git show), compiled beside the worktree's so its relative requires resolve; SLOPE is the worktree's; LITERAL is D's followChord.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), crypto = require('crypto'), Module = require('module'), { execFileSync } = require('child_process');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const [T0, BASE, OUT] = process.argv.slice(2), T = path.resolve(T0);
const D = require(path.join(T, 'src/core/document.js')), SC = require(path.join(T, 'src/core/sculpt.js')), TB = require(path.join(T, 'src/core/turnby.js'));
const G = require(path.join(T, 'src/geom/index.js')), ZG = require(path.join(T, 'app/core/zonegrab.js')), { toPath } = require(path.join(T, 'src/core/adapter.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const todaySrc = execFileSync('git', ['-C', T, 'show', `${BASE}:app/core/zonegrab.js`], { encoding: 'utf8' });
const ZT = (() => { const fn = path.join(T, 'app/core/zonegrab.today.js'), m = new Module(fn, module); m.filename = fn; m.paths = Module._nodeModulePaths(path.dirname(fn)); m._compile(todaySrc, fn); return m.exports; })();
const R4 = (x) => Math.round(x * 1e4) / 1e4, DEGR = 180 / Math.PI;
const sha = (d) => crypto.createHash('sha256').update(D.serialize(d)).digest('hex').slice(0, 16);
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const out = { started: new Date().toISOString(), tree: T, base: BASE, node: process.version, sameSourceAsBase: todaySrc === fs.readFileSync(path.join(T, 'app/core/zonegrab.js'), 'utf8'), K: {}, R1: [], R2: [], R3: [], R5: [], item3: [], errors: [] };

// ── even678.js's fixtures, copied unchanged ──
const LAYOUT = {
  plan: (b) => [{ length: 100, turn: 0, bank: 0 }, { length: 100, turn: 0, bank: 0 }, ...[1, 2, 3, 4].map(() => ({ length: 60, turn: 30, bank: b })), { length: 150, turn: 0, bank: 0 }],
  hold: (b) => [{ length: 80, turn: 0, bank: 0 }, { length: 60, turn: 0, bank: b }, { length: 60, turn: 0, bank: b }, ...[1, 2, 3, 4].map(() => ({ length: 60, turn: 30, bank: b })), { length: 60, turn: 0, bank: b }, { length: 90, turn: 0, bank: 0 }],
};
function makeBase(layout, bank, cup) {
  let b = D.createDoc('even');
  for (const p of LAYOUT[layout](bank)) b = TB.extendCorner(b, extendOptions({ length: p.length, turn: p.turn, climb: 0, bank: p.bank, width: 12, turnAs: 'corner', ...(cup === undefined ? {} : { cup }) }));
  return Object.freeze(b);
}
const LO = 200, HI = 440, MID = 320;
const at = (doc, ch, s) => { const off = SC.pieceOffsets(doc); for (let i = 0; i < doc.pieces.length; i++) { const P = doc.pieces[i]; if (P.type === 'road' && s >= off[i] - 1e-9 && s <= off[i] + P.length + 1e-9) return D.channelAt(P, ch, Math.min(P.length, Math.max(0, s - off[i]))).v; } return NaN; };
async function shellOn(doc) { const sh = await createCoreShell({}); sh.commitDoc(doc); sh.setSculpt(true); return sh; }
const msg = (sh) => sh.getState().message;
// D's followChord, copied from even678.js:44-61 (D678 (3) marked there)
function followChord(delta, frame) {
  if (!frame || !Array.isArray(delta) || delta.length !== 3 || !delta.every(Number.isFinite)) return null;
  const { T: Tn, R, U0, cos, sin, w, oP, oF } = frame, upY = U0[1];
  if (!(upY > ZG.UP_MIN)) return null;
  const f = dot3(delta, Tn), p = [0, 1, 2].map((k) => delta[k] - f * Tn[k]); let e = dot3(p, R), v = dot3(p, U0);
  const rot = (a, b, c = cos, s = sin) => [a * c - b * s, a * s + b * c];
  const slide = (dR, dU) => ({ h: dU / upY, l: dR });
  if (!(Math.abs(frame.u) >= ZG.HINGE_U)) return slide(e, v);
  const v0 = rot(oP[0] - oF[0], oP[1] - oF[1]), n0 = Math.hypot(v0[0], v0[1]);
  if (!(n0 > 1e-9)) return slide(e, v);
  { const t = (e * v0[0] + v * v0[1]) / (n0 * n0); e = t * v0[0]; v = t * v0[1]; }
  const v1 = [v0[0] + e, v0[1] + v], short = Math.max(0, ZG.SQUEEZE_MIN * n0 * n0 - (v1[0] * v0[0] + v1[1] * v0[1])) / (n0 * n0);
  v1[0] += short * v0[0]; v1[1] += short * v0[1];
  const k = Math.hypot(v1[0], v1[1]) / n0, dphi = Math.atan2(v0[0] * v1[1] - v0[1] * v1[0], v0[0] * v1[0] + v0[1] * v1[1]);
  const c1 = Math.cos(dphi) * cos - Math.sin(dphi) * sin, s1 = Math.sin(dphi) * cos + Math.cos(dphi) * sin;
  const F0 = rot(oF[0], oF[1]), F1 = rot(oF[0] * k, oF[1] * k, c1, s1);
  return { ...slide(F0[0] - F1[0], F0[1] - F1[1]), w: w * (k - 1), phi: dphi };
}
const FOLLOW = { today: ZT.follow, slope: ZG.follow, literal: followChord };

// D's gesture (even678.js grab, unchanged but for the follow passed by name): the outer (right) rim at s, pulled straight out by want - w
const pathOf = (sh) => { const rs = sh.getState().resolved; return { rs, pathB: G.buildPath(rs.segments, { step: 1, closed: false, ...(rs.start ? { start: rs.start } : {}) }) }; };
function grab(sh, s, want, r = 30, followFn) {
  const d = sh.getState().history.present, { rs, pathB } = pathOf(sh);
  const fr = ZG.frameAt(pathB, rs.segments, s, -1); if (!fr) throw new Error(`no frame at ${s}`);
  const e = want - at(d, 'w', s), push = fr.R.map((k) => -k * e);
  const delta = followFn(push, fr, {}); if (!delta) throw new Error(`no follow at ${s}`);
  sh.beginFollow({ s0: fr.s, r }); if (!sh.getState().brush) throw new Error(`beginFollow at ${s}: ${msg(sh)}`);
  sh.brushTo(delta); sh.endBrush();
  return Object.fromEntries(Object.entries(delta).map(([k, v]) => [k, R4(v)]));
}
// one grab at (s, u) by a WORLD delta built from the frame: out (along the press's outward R), up (world up), fwd (along T)
function grabAt(sh, s, u, mv, followFn, r = 30) {
  const { rs, pathB } = pathOf(sh), fr = ZG.frameAt(pathB, rs.segments, s, u); if (!fr) return { refused: 'no frame' };
  const side = u < 0 ? -1 : 1, delta = [0, 1, 2].map((k) => (mv.out || 0) * side * fr.R[k] + (mv.up || 0) * [0, 1, 0][k] + (mv.fwd || 0) * fr.T[k]);
  const d = followFn(delta, fr, {}); if (!d) return { refused: 'no follow' };
  sh.beginFollow({ s0: fr.s, r }); if (!sh.getState().brush) return { refused: msg(sh) };
  sh.brushTo(d); sh.endBrush();
  return { follow: Object.fromEntries(Object.entries(d).map(([k, v]) => [k, R4(v)])), dphiDeg: R4((d.phi || 0) * DEGR), frame: fr, delta };
}
const endOf = (d) => { const o = SC.pieceOffsets(d); return o[o.length - 1] + d.pieces[d.pieces.length - 1].length; };
const maxDiff = (a, b) => { let mx = 0; const end = endOf(a); for (let s = 0; s <= end + 1e-9; s += 1) for (const c of ['w', 'l', 'h', 'phi', 'c']) { const x = at(a, c, s), y = at(b, c, s); if (Number.isFinite(x) || Number.isFinite(y)) mx = Math.max(mx, Math.abs(x - y)); } return mx; };
const CASES = [['out 4', { out: 4 }], ['in 2', { out: -2 }], ['up 1.5', { up: 1.5 }], ['down 1', { up: -1 }], ['diagonal out 2 up 1.5 fwd 0.7', { out: 2, up: 1.5, fwd: 0.7 }]];
const US = [-1, 1, -0.95, 0.95, -0.5, 0.5, 1.2];

(async () => {
  const bases = { F: makeBase('plan', 0), F0: makeBase('plan', 0, 0), Bminus: makeBase('plan', -20), Bplus: makeBase('plan', 20), Bhold: makeBase('hold', -20) };
  // ── K2: the T1 follow of each, as D's run.log has them ──
  for (const [fx, base] of Object.entries(bases)) for (const [name, fn] of Object.entries(FOLLOW)) { const sh = await shellOn(base); out.K[`${fx} ${name}`] = grab(sh, MID, 16, 30, fn); }
  const want = { 'Bminus slope': { h: 0.4306, l: -1.8433, w: 3.7956, phi: 0 }, 'Bhold slope': { h: 0.4306, l: -1.8433, w: 3.7956, phi: 0 }, 'Bplus slope': { h: -0.855, l: -1.6888, w: 3.7956, phi: 0 },
    'Bminus today': { h: -0.2403, l: -2, w: 3.8559, phi: 0.0872 }, 'Bplus today': { h: -0.2403, l: -2, w: 3.8559, phi: -0.0872 }, 'F today': { h: -0.2403, l: -2, w: 4.0392, phi: 0 }, 'F0 today': { h: 0, l: -2, w: 4, phi: 0 } };
  out.K.check = Object.fromEntries(Object.entries(want).map(([k, v]) => [k, Object.keys(v).every((c) => Math.abs((out.K[k][c] || 0) - v[c]) < 1e-9 || (Math.abs(v[c]) === 0 && Math.abs(out.K[k][c] || 0) === 0))]));
  out.K.pass = Object.values(out.K.check).every(Boolean);
  console.log('K', out.K.pass, JSON.stringify(out.K.check));
  if (!out.K.pass) { fs.writeFileSync(OUT, JSON.stringify(out, null, 1)); console.log('CONTROL FAILED: stop'); return; }

  if (process.env.ITEM3) { out.K = { pass: out.K.pass }; }
  // ── R1 (F0) and R2 (F): D's T1 and T2b, then one grab a case at s 320 ──
  for (const fx of process.env.ITEM3 ? [] : ['F0', 'F']) {
    const base = bases[fx], rowsOut = fx === 'F0' ? out.R1 : out.R2;
    for (const [name, mk] of [['T1', async (fn) => { const sh = await shellOn(base); grab(sh, MID, 16, 30, fn); return sh; }], ['T2b', async (fn) => { const sh = await shellOn(base); for (let s = LO + 15; s < HI; s += 30) grab(sh, s, 16, 30, fn); return sh; }]]) {
      const res = {}; for (const k of ['today', 'slope', 'literal']) res[k] = (await mk(FOLLOW[k])).getState().history.present;
      rowsOut.push({ fx, gesture: name, same: sha(res.today) === sha(res.slope), literalSame: sha(res.today) === sha(res.literal), today: sha(res.today), slope: sha(res.slope), maxChannelDiff: maxDiff(res.today, res.slope) });
    }
    for (const u of US) for (const [cname, mv] of CASES) {
      const r = {}; for (const k of ['today', 'slope', 'literal']) { const sh = await shellOn(base); const g = grabAt(sh, MID, u, mv, FOLLOW[k]); r[k] = { g, doc: sh.getState().history.present }; }
      if (r.today.g.refused) { rowsOut.push({ fx, u, gesture: cname, refused: r.today.g.refused }); continue; }
      rowsOut.push({ fx, u, gesture: cname, same: sha(r.today.doc) === sha(r.slope.doc), literalSame: sha(r.today.doc) === sha(r.literal.doc), maxChannelDiff: R4(maxDiff(r.today.doc, r.slope.doc)),
        follow: { today: r.today.g.follow, slope: r.slope.g.follow, literal: r.literal.g.follow }, bankAtPressDeg: { today: r.today.g.dphiDeg, slope: r.slope.g.dphiDeg, literal: r.literal.g.dphiDeg } });
    }
    console.log(fx, 'same', rowsOut.filter((x) => x.same).length, 'of', rowsOut.filter((x) => x.same !== undefined).length, '; literal same', rowsOut.filter((x) => x.literalSame).length);
  }

  // ── R3: the banked turns, T1 and T2b made with the slope grab: the bank against the turn before any grab, every 1 m over 150..490 ──
  for (const fx of process.env.ITEM3 ? [] : ['Bminus', 'Bhold', 'Bplus']) {
    const base = bases[fx];
    for (const [name, mk] of [['T1', async (fn) => { const sh = await shellOn(base); grab(sh, MID, 16, 30, fn); return sh; }], ['T2b', async (fn) => { const sh = await shellOn(base); for (let s = LO + 15; s < HI; s += 30) grab(sh, s, 16, 30, fn); return sh; }]]) {
      for (const k of ['today', 'slope', 'literal']) {
        const d = (await mk(FOLLOW[k])).getState().history.present; let worst = 0, wAt = null, wd = 0;
        for (let s = 150; s <= 490; s += 1) { const x = Math.abs(at(d, 'phi', s) - at(base, 'phi', s)) * DEGR; if (x > worst) { worst = x; wAt = s; } wd = Math.max(wd, at(d, 'w', s)); }
        out.R3.push({ fx, gesture: name, follow: k, bankOffDeg: R4(worst), at: wAt, widest: R4(wd), sha: sha(d) });
      }
    }
  }
  console.log('R3', JSON.stringify(out.R3.map((x) => [x.fx, x.gesture, x.follow, x.bankOffDeg])));

  // ── R5: a straight lift, follow against follow (no shell) ──
  for (const fx of process.env.ITEM3 ? [] : ['F0', 'F', 'Bminus', 'Bplus']) {
    const sh = await shellOn(bases[fx]), { rs, pathB } = pathOf(sh);
    for (const u of [-1, 1, -0.95, 0.95, -0.5, 0.5]) for (const up of [1, -1, 2.5]) {
      const fr = ZG.frameAt(pathB, rs.segments, MID, u), delta = [0, up, 0], t = ZT.follow(delta, fr, {}), s = ZG.follow(delta, fr, {}), l = followChord(delta, fr);
      const off = (a) => Math.max(...Object.keys(t).map((c) => Math.abs((a[c] || 0) - t[c])));
      out.R5.push({ fx, u, up, slopeOff: off(s), literalOff: off(l), todayBankDeg: R4((t.phi || 0) * DEGR), literalBankDeg: R4((l.phi || 0) * DEGR) });
    }
  }
  console.log('R5 slope worst', Math.max(...out.R5.map((x) => x.slopeOff)), 'literal worst', Math.max(...out.R5.map((x) => x.literalOff)));

  // ── item 3, in node: where the pressed point goes against where the pointer went (the grab plane's point), after D's 4 m pull, at s 320 (a piece joint, D's MID) and at s 330 (inside a piece); the centre read off the surface (u 0), which carries h and l ──
  for (const S3 of [MID, 330]) for (const fx of ['F', 'F0', 'Bminus', 'Bplus', 'Bhold']) for (const k of ['today', 'slope']) {
    // read through the adapter (src/core/adapter.js toPath), as zonegrab.test.js's rows read the road: it carries h and l, which the resolved segments' buildPath does not
    const sh = await shellOn(bases[fx]), A0 = toPath(bases[fx]), fr = ZG.frameAt(A0.path, A0.segments, S3, -1), m0 = A0.path.samples.reduce((a, x) => (Math.abs(x.s - S3) < Math.abs(a.s - S3) ? x : a));
    const p0 = ZG.acrossAt(A0.path, A0.segments, m0, -1).pos, c0 = ZG.acrossAt(A0.path, A0.segments, m0, 0).pos;
    const e = 16 - at(bases[fx], 'w', S3), push = fr.R.map((x) => -x * e); grab(sh, S3, 16, 30, FOLLOW[k]);
    const A1 = toPath(sh.getState().history.present), m1 = A1.path.samples.reduce((a, x) => (Math.abs(x.s - m0.s) < Math.abs(a.s - m0.s) ? x : a)), p1 = ZG.acrossAt(A1.path, A1.segments, m1, -1).pos, c1 = ZG.acrossAt(A1.path, A1.segments, m1, 0).pos;
    const pointer = p0.map((x, i) => x + push[i]), miss = p1.map((x, i) => x - pointer[i]);
    out.item3.push({ s: S3, fx, follow: k, pullM: R4(e), pointMovedUp: R4(p1[1] - p0[1]), pointMovedOut: R4(-dot3(p1.map((x, i) => x - p0[i]), fr.R)), missUp: R4(miss[1]), missAcross: R4(-dot3(miss, fr.R)), missTotal: R4(Math.hypot(...miss)), centreUp: R4(c1[1] - c0[1]), centreAcross: R4(-dot3(c1.map((x, i) => x - c0[i]), fr.R)) });
  }
  console.log('item3', JSON.stringify(out.item3.map((x) => [x.fx, x.follow, x.missAcross, x.missUp, x.centreUp])));
  out.ended = new Date().toISOString();
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
})().catch((e) => { out.errors.push(String(e && e.stack || e)); fs.writeFileSync(OUT, JSON.stringify(out, null, 1)); console.error(e); process.exit(1); });
