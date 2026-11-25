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
const meas = JSON.parse(fs.readFileSync(path.join(__dirname, "out/measpos2.json"), "utf8")).filter((x) => x.d >= 336 && x.d <= 724);   // the CENTRE-POSITION read (measpos.js, k = 2)

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
// THE CORRECTED STRETCHES (from the centre positions, not the walker's forward vector): ramp 340..462 (bank 2 -> 24), turn A 462..520 about 85°, between 520..550
// (bank through level at 528), turn B 550..606 about 80° back, eased out 606..712. Local metres from 340.
const TURNS2 = [{ from: 122, deg: -85 }, { from: 180, deg: 0 }, { from: 210, deg: 80 }, { from: 266, deg: 0.001 }];
const PHI2 = [[144, -26], [232, -26.5], [260, 0]];   // the first ramp runs straight to the peak, 27 at measured 484 (as the read does); ONE crossing to -26 by 572; out
const one2 = (phi) => ({ length: 372, bankShape: 'rounded', targets: { phi: r(27) }, transition: { phi: 144 }, turnDeg: 0, changes: { turnDeg: TURNS2, ...(phi.length ? { phi: phi.map(([f, t]) => ({ from: f, target: r(t) })) } : {}) } });
{ // one piece through the core, as-is, relaxed refusal by refusal
  const phi = PHI2.slice(), log = [];
  for (;;) {
    try { const doc = extendCorner(lead(), one2(phi)); log.push({ label: `laid with bank changes ${JSON.stringify(phi)}`, laid: true }); attempts.push({ name: 'one piece, core lists (as-is)', log, doc, prof: builtProfile(doc, LEAD) }); break; }
    catch (e) { log.push({ label: `bank changes ${JSON.stringify(phi)}`, refused: `${e.code || ''} ${e.message}`.trim() }); if (e.channel !== 'phi' || !Number.isInteger(e.change)) { attempts.push({ name: 'one piece, core lists (as-is)', log, doc: null }); break; } phi.splice(e.change, 1); }
  }
}
{ // the same one piece with the as-built check skipped (an untracked scratch copy of turnby.js)
  const NC = R('src/core/turnby_nocheck.scratch.js'), doc = NC.extendCorner(lead(), one2(PHI2));
  attempts.push({ name: 'one piece, core lists, as-built check SKIPPED', log: [{ label: 'whole shape', laid: true }], doc, prof: builtProfile(doc, LEAD) });
}
if (0) attempt('one piece, the panel (one extra per field)', [
  ['ramp on the straight, 122 m, bank 24', (d) => panelOpts(d, { length: '122', bank: '24' })],
  ['the turn pair, 144 m: turn −85, extra +80 from 88; bank 27, extra −27 at the panel default', (d) => panelOpts(d, { length: '144', turn: '-85', bank: '27', changes: { turn: [{ then: '80', from: '88' }], bank: [{ then: '-27', from: '' }] } })],
  ['ease out, 106 m, bank 0', (d) => panelOpts(d, { length: '106', bank: '0' })],
]);
if (0) attempt('pieces, one per stretch', [
  ['ramp on the straight, 122 m, bank 24', (d) => panelOpts(d, { length: '122', bank: '24' })],
  ['turn A, 58 m: turn −85, bank 27, extra bank 8 from 18', (d) => panelOpts(d, { length: '58', turn: '-85', bank: '27', changes: { bank: [{ then: '8', from: '18' }] } })],
  ['across, 30 m straight: bank −20', (d) => panelOpts(d, { length: '30', bank: '-20' })],
  ['turn B, 56 m: turn +80, bank −27', (d) => panelOpts(d, { length: '56', turn: '80', bank: '-27' })],
  ['ease out, 106 m straight: bank 0', (d) => panelOpts(d, { length: '106', bank: '0' })],
]);
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'profiles.json'), JSON.stringify({ meas, attempts: attempts.map((a) => ({ name: a.name, log: a.log, prof: a.prof || null })) }));
for (const a of attempts) { console.log(`== ${a.name}`); for (const l of a.log) console.log(`  ${l.label}: ${l.laid ? 'LAID' : 'REFUSED ' + l.refused}`); }
fs.writeFileSync(path.join(outDir, 'docs.json'), JSON.stringify(attempts.filter((a) => a.doc).map((a) => ({ name: a.name, doc: a.doc }))));
{
  const V = R('src/validate/index.js'), rows = [];
  for (const a of attempts.filter((x) => x.doc)) {
    const { segments, path: P } = A.toPath(a.doc, { step: 0.5 }), v = V.validate(P, segments, {});
    const pick = (list) => (list || []).filter((x) => x.s1 >= LEAD - 4 && x.s0 <= LEAD + 384).map((x) => `${x.reason} ${Math.round(340 + x.s0 - LEAD)}..${Math.round(340 + x.s1 - LEAD)} worst ${+x.worst.toFixed(3)}`);
    rows.push({ name: a.name, red: pick(v.red), amber: pick(v.amber) });
  }
  fs.writeFileSync(path.join(outDir, 'check.json'), JSON.stringify(rows, null, 1));
  for (const x of rows) console.log(`check ${x.name}: red [${x.red.join('; ')}] amber [${x.amber.join('; ')}]`);
}
