// build.js: lay the double-banked 90 headless through the t180 core (worktree at 3b33b38), read heading and bank along the BUILT road, and the measured read the same way.
// usage: node build.js <t180 tree> <read.json> <out dir>
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
'use strict';
const path = require('path'), fs = require('fs');
const [tree, readFile, outDir] = process.argv.slice(2);
const R = (p) => require(path.join(tree, p));
const D = R('src/core/document.js'), { extend } = R('src/core/extend.js'), { extendCorner } = R('src/core/turnby.js'), A = R('src/core/adapter.js');
const { extendOptions } = R('app/core/panel.js');
const DEG = Math.PI / 180;

// ── one reader for both roads: per station {d, f (forward), n (road up)}; heading accumulated (+ = the formula's left), bank = the normal's lean toward that left
function profile(st) {
  const out = []; let acc = 0, prev = null;
  for (const x of st) {
    const f = x.f, n = x.n;
    if (prev) {
      const h0 = [prev[0], 0, prev[2]], h1 = [f[0], 0, f[2]];
      acc += Math.atan2(h0[2] * h1[0] - h0[0] * h1[2], h0[0] * h1[0] + h0[2] * h1[2]);   // (h0 × h1)·y
    }
    prev = f;
    const left = [f[2], 0, -f[0]], ll = Math.hypot(left[0], left[2]) || 1; left[0] /= ll; left[2] /= ll;   // y × f
    const u2 = [left[1] * f[2] - left[2] * f[1], left[2] * f[0] - left[0] * f[2], left[0] * f[1] - left[1] * f[0]];   // left × f: the unrolled up
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    out.push({ d: x.d, h: acc / DEG, bank: Math.atan2(dot(n, left), -dot(n, u2)) / DEG, y: x.y });
  }
  return out;
}
// turn A's way +: heading and bank both flipped by turn A's sign in that frame, so "bank +" is "leaning into turn A" whatever the frame's handedness
function normalise(p, aFrom, aTo) {
  const at = (d) => p.reduce((b, x) => (Math.abs(x.d - d) < Math.abs(b.d - d) ? x : b));
  const sg = Math.sign(at(aTo).h - at(aFrom).h) || 1, h0 = at(aFrom).h;
  return p.map((x) => ({ d: x.d, h: (x.h - h0) * sg, bank: x.bank * sg, y: x.y }));
}

// ── the measured read (reference track A): stations 340..720
const read = require(path.resolve(readFile));
const meas = normalise(profile(read.stations.filter((s) => s.f && s.n && s.d >= 336 && s.d <= 724).map((s) => ({ d: s.d, f: s.f, n: s.n, y: s.c[1] }))), 452, 516);

// ── the built road: the path's samples, (T, U); d = 340 + (s − s0), s0 where the attempt starts after the lead straight
function builtProfile(doc, s0) {
  const { path: P } = A.toPath(doc, { step: 0.5 });
  const st = P.samples.filter((x) => x.s >= s0 - 4 && x.s <= s0 + 384).map((x) => ({ d: 340 + (x.s - s0), f: x.T, n: x.U, y: x.pos[1] }));
  return normalise(profile(st), 452, 516);
}

const LEAD = 300, W = 33;
const lead = () => extend(D.createDoc('dbl90'), { length: LEAD, family: 'bowl', first: { w: W } });
// the panel's options for one piece, as typed (bank +: into turn A, which is turn −78 here, a right turn: left side up)
const panelOpts = (doc, fields) => {
  const P = doc.pieces[doc.pieces.length - 1], head = D.valuesAt(P, P.length);
  return extendOptions({ turnAs: 'corner', head, ...fields });
};
const attempts = [];
function attempt(name, steps) {
  let doc = lead(); const log = [];
  for (const [label, mk] of steps) {
    let opts; try { opts = mk(doc); } catch (e) { log.push({ label, refused: `panel: ${e.message}` }); return attempts.push({ name, log, doc: null }); }
    try { doc = opts.turnDeg !== undefined || opts.climbDeg !== undefined ? extendCorner(doc, opts) : extend(doc, opts); log.push({ label, opts: JSON.stringify(opts), laid: true }); }
    catch (e) { log.push({ label, opts: JSON.stringify(opts), refused: `${e.code || ''} ${e.message}`.trim(), needM: e.needM }); return attempts.push({ name, log, doc: null }); }
  }
  attempts.push({ name, log, doc, prof: builtProfile(doc, LEAD) });
}
const r = (deg) => deg * DEG;

// 1. ONE piece through the core, as many changes as the core takes (the panel offers one per field: his 11-05 limit). 356 m from measured 340: ramp to 112, turn A 112..176,
//    across 176..224, turn B 224..256, eased out 256..356. The trailing straight of the turn needs a last extra (cornerLists drops a trailing 0), so it is 0.001°.
attempt('one piece, core lists', [
  ['the whole shape', () => ({ length: 356, bankShape: 'rounded', targets: { phi: r(22) }, transition: { phi: 112 }, turnDeg: 0,
    changes: { turnDeg: [{ from: 112, deg: -78 }, { from: 176, deg: 0 }, { from: 224, deg: 67 }, { from: 256, deg: 0.001 }],
      phi: [{ from: 112, target: r(27) }, { from: 144, target: r(9) }, { from: 176, target: r(-20) }, { from: 224, target: r(-26) }, { from: 256, target: r(0) }] } })],
]);
// 1b. the same with a plain base corner of −11 (the net), extras +... is not the shape; kept out. 1c: the same as 1 without the 0.001 tail (what cornerLists does with a 0)
attempt('one piece, core lists, trailing 0 (dropped)', [
  ['the whole shape, tail 0', () => ({ length: 356, bankShape: 'rounded', targets: { phi: r(22) }, transition: { phi: 112 }, turnDeg: 0,
    changes: { turnDeg: [{ from: 112, deg: -78 }, { from: 176, deg: 0 }, { from: 224, deg: 67 }, { from: 256, deg: 0 }],
      phi: [{ from: 112, target: r(27) }, { from: 144, target: r(9) }, { from: 176, target: r(-20) }, { from: 224, target: r(-26) }, { from: 256, target: r(0) }] } })],
]);
// 2. ONE piece as the PANEL can make it today: one extra per field. The turns: first corner −78, extra +67 from turn B's start; the bank: first 27 (over the piece), extra −26.
//    The lead-in bank and the ease-out are other pieces (straights), so this is the turn pair alone, 144 m (measured 452..596).
attempt('one piece, the panel (one extra per field)', [
  ['ramp on the straight, 112 m, bank 22', (d) => panelOpts(d, { length: '112', bank: '22' })],
  ['the turn pair, 144 m: turn −78, extra +67 from 112; bank 27, extra −26 from the panel default', (d) => panelOpts(d, { length: '144', turn: '-78', bank: '27', changes: { turn: [{ then: '67', from: '112' }], bank: [{ then: '-26', from: '' }] } })],
  ['ease out, 100 m, bank 0', (d) => panelOpts(d, { length: '100', bank: '0' })],
]);
// 3. the PIECES a user would lay today: five, one per stretch (bank as typed, no extras but turn A's peak)
attempt('pieces, one per stretch', [
  ['ramp on the straight, 112 m, bank 22', (d) => panelOpts(d, { length: '112', bank: '22' })],
  ['turn A, 64 m: turn −78, bank 27, extra bank 9 from 32', (d) => panelOpts(d, { length: '64', turn: '-78', bank: '27', changes: { bank: [{ then: '9', from: '32' }] } })],
  ['across, 48 m straight: bank −20', (d) => panelOpts(d, { length: '48', bank: '-20' })],
  ['turn B, 32 m: turn +67, bank −26', (d) => panelOpts(d, { length: '32', turn: '67', bank: '-26' })],
  ['ease out, 100 m straight: bank 0', (d) => panelOpts(d, { length: '100', bank: '0' })],
]);

// 1x. ONE piece through the core, relaxed one refusal at a time: a refused bank change k is dropped (the change before it runs on to the next mark); each refusal is kept
function relax(name, base) {
  const phi = base.phi.slice(), refusals = [];
  for (let i = 0; i < 8; i++) {
    const opts = { length: base.length, bankShape: 'rounded', targets: { phi: r(base.first) }, transition: { phi: base.firstTo }, turnDeg: base.turnDeg,
      changes: { turnDeg: base.turns, ...(phi.length ? { phi: phi.map(([f, t]) => ({ from: f, target: r(t) })) } : {}) } };
    try { const doc = extendCorner(lead(), opts); attempts.push({ name, log: [...refusals, { label: `laid with bank changes ${JSON.stringify(phi)}`, opts: JSON.stringify(opts), laid: true }], doc, prof: builtProfile(doc, LEAD) }); return; }
    catch (e) {
      refusals.push({ label: `bank changes ${JSON.stringify(phi)}`, refused: `${e.code || ''} ${e.message}`.trim(), needM: e.needM });
      if (e.channel !== 'phi' || !Number.isInteger(e.change)) { attempts.push({ name, log: refusals, doc: null }); return; }
      phi.splice(e.change, 1);
    }
  }
  attempts.push({ name, log: refusals, doc: null });
}
const TURNS = [{ from: 112, deg: -78 }, { from: 176, deg: 0 }, { from: 224, deg: 67 }, { from: 256, deg: 0.001 }];
relax('one piece, core lists, relaxed', { length: 356, first: 22, firstTo: 112, turnDeg: 0, turns: TURNS, phi: [[112, 27], [144, 9], [176, -20], [224, -26], [256, 0]] });
attempt('one piece, core lists, turn only', [['turns', () => ({ length: 356, turnDeg: 0, changes: { turnDeg: TURNS } })]]);
// the full one piece with the as-built check skipped (an untracked scratch copy of turnby.js, never committed): what the road would build if the refusal were lifted
{
  const NC = R('src/core/turnby_nocheck.scratch.js');
  const opts = { length: 356, bankShape: 'rounded', targets: { phi: r(22) }, transition: { phi: 112 }, turnDeg: 0,
    changes: { turnDeg: TURNS, phi: [{ from: 112, target: r(27) }, { from: 144, target: r(9) }, { from: 176, target: r(-20) }, { from: 224, target: r(-26) }, { from: 256, target: r(0) }] } };
  try { const doc = NC.extendCorner(lead(), opts); attempts.push({ name: 'one piece, core lists, as-built check SKIPPED (scratch)', log: [{ label: 'whole shape', laid: true, opts: JSON.stringify(opts) }], doc, prof: builtProfile(doc, LEAD) }); }
  catch (e) { attempts.push({ name: 'one piece, check skipped', log: [{ label: 'whole shape', refused: `${e.code} ${e.message}` }], doc: null }); }
}
// the measured bank never holds at 9: it runs 27 -> -20 in one go (484..564). The same one piece with four bank changes, as-is (relaxed) and with the check skipped
relax('one piece, four bank changes, relaxed', { length: 356, first: 22, firstTo: 112, turnDeg: 0, turns: TURNS, phi: [[112, 27], [144, -20], [224, -26], [256, 0]] });
{
  const NC = R('src/core/turnby_nocheck.scratch.js');
  const opts = { length: 356, bankShape: 'rounded', targets: { phi: r(22) }, transition: { phi: 112 }, turnDeg: 0,
    changes: { turnDeg: TURNS, phi: [{ from: 112, target: r(27) }, { from: 144, target: r(-20) }, { from: 224, target: r(-26) }, { from: 256, target: r(0) }] } };
  const doc = NC.extendCorner(lead(), opts); attempts.push({ name: 'one piece, four bank changes, as-built check SKIPPED (scratch)', log: [{ label: 'whole shape', laid: true, opts: JSON.stringify(opts) }], doc, prof: builtProfile(doc, LEAD) });
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'profiles.json'), JSON.stringify({ meas, attempts: attempts.map((a) => ({ name: a.name, log: a.log, prof: a.prof || null })) }));
for (const a of attempts) { console.log(`== ${a.name}`); for (const l of a.log) console.log(`  ${l.label}: ${l.laid ? 'LAID' : 'REFUSED ' + l.refused}`); }
// the docs, for the render
fs.writeFileSync(path.join(outDir, 'docs.json'), JSON.stringify(attempts.filter((a) => a.doc).map((a) => ({ name: a.name, doc: D.serialize ? JSON.parse(D.serialize(a.doc)) : a.doc }))));
// the builder's own checker on each laid attempt: red and amber inside the shape (measured 340..720), by kind
{
  const V = R('src/validate/index.js'), rows = [];
  for (const a of attempts.filter((x) => x.doc)) {
    const { segments, path: P } = A.toPath(a.doc, { step: 0.5 }), v = V.validate(P, segments, {});
    const inShape = (x) => { const s = x.s0 !== undefined ? x.s0 : x.s !== undefined ? x.s : x.from; return s === undefined || (s >= LEAD - 4 && s <= LEAD + 384); };
    const kinds = (list) => { const m = {}; for (const x of list || []) if (inShape(x)) m[x.kind || x.code || x.rule || 'item'] = (m[x.kind || x.code || x.rule || 'item'] || 0) + 1; return m; };
    rows.push({ name: a.name, red: kinds(v.red), amber: kinds(v.amber), sample: (v.red || []).concat(v.amber || []).slice(0, 2) });
  }
  fs.writeFileSync(path.join(outDir, 'check.json'), JSON.stringify(rows, null, 1));
  for (const x of rows) console.log(`check ${x.name}: red ${JSON.stringify(x.red)} amber ${JSON.stringify(x.amber)}`);
}
