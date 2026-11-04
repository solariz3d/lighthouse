// b-reuse.test.js (pane B, D236 non-author): copied into a temp copy of the tree at app/test/ and run there.
//   F  FUZZ through the track model (reuseMesh's only caller), ONE model kept across a whole sequence so both detail slots go stale: closed cup / tube / plain laps;
//      brushes at the joint (s0 0 and near the end) on phi, w, c, kh, kv in rate and value modes; undo PAST the close and redo; a piece REMOVED (undo past the close,
//      then undo an extend) and the lap re-extended with ANOTHER family (a type change) and re-closed; edits between two drags. After every step, at detail 6 and
//      detail 1: equal to a fresh full build (A's own standard: indices exact, matrices 1e-9, positions/normals/uvs 1e-5).
//   V  valuesAt against channelAt, written here: every piece of several documents, s at 0, L, every knot, inside, BEYOND both ends (the clamp), Object.is per channel.
//   C  the same[] contract, direct: reuseMesh with an all-true same[] for a document whose handles changed (the start unchanged) returns a WRONG mesh, silently.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('../../src/core/document.js');
const G = require('../../src/geom/index.js');
const { createCoreShell } = require('../core/coreshell.js');
const { createTrackModel } = require('../preview/trackmodel.js');
const { batchesOf } = require('../preview/batches.js');
const { coarsen, FACTOR } = require('../preview/coarse.js');

const gq = Math.PI * 180 / 2;
async function closedLap(first, len0 = 300) {
  const s = await createCoreShell({ brushFn: null });
  s.extend({ length: len0, ...(first ? { first } : { family: 'bowl' }) });
  for (let i = 0; i < 4; i++) s.extend({ length: gq, transition: 40, targets: { kh: 1 / 180 } });
  s.extend({ length: 60, transition: 40, targets: { kh: 0 } });
  assert.equal(s.getState().message, null, s.getState().message); s.close(); assert.equal(s.getState().history.present.closed, true, s.getState().message); return s;
}
function sameAsFull(a, b, what) {
  assert.deepEqual(a.map((x) => x.key), b.map((x) => x.key), `${what}: the same nodes`); let worst = 0;
  for (let i = 0; i < a.length; i++) {
    assert.deepEqual(Array.from(a[i].indices), Array.from(b[i].indices), `${what}: ${a[i].key} indices`); assert.equal(a[i].positions.length, b[i].positions.length, `${what}: ${a[i].key} size`);
    for (let k = 0; k < 16; k++) assert.ok(Math.abs(a[i].model[k] - b[i].model[k]) <= 1e-9, `${what}: ${a[i].key} matrix`);
    for (let k = 0; k < a[i].positions.length; k++) { const dp = Math.abs(a[i].positions[k] - b[i].positions[k]); worst = Math.max(worst, dp); assert.ok(dp <= 1e-5 && Math.abs(a[i].normals[k] - b[i].normals[k]) <= 1e-5, `${what}: ${a[i].key} vertex ${k} (${dp})`); }
    for (let k = 0; k < a[i].uvs.length; k++) assert.ok(Math.abs(a[i].uvs[k] - b[i].uvs[k]) <= 1e-5, `${what}: ${a[i].key} uv`);
  }
  return worst;
}
const freshOf = (resolved, detail) => {
  const segs = detail > 1 ? coarsen(resolved.segments, detail) : resolved.segments, p = G.buildPath(segs, { step: 2, closed: !!resolved.closed, start: resolved.start });
  return batchesOf(G.buildMesh(typeof resolved.lift === 'function' ? resolved.lift(p) : p, segs, {}));
};

test('F: one track model through a long sequence of edits on closed laps equals a fresh full build after EVERY step, at detail 6 and detail 1', async () => {
  const stats = { checks: 0, reusedSteps: 0, worst: 0, refused: [] };
  for (const [name, first] of Object.entries({ cup: { c: 60 }, tube: { w: 31, t: 360 }, plain: null })) {
    const s = await closedLap(first), tm = createTrackModel();
    const check = (label) => {
      for (const d of [FACTOR, 1]) {
        tm.setDetail(d); const st = s.getState(), got = tm.update(st.resolved);
        if (got.mesh && got.mesh.stats && got.mesh.stats.reused > 0) stats.reusedSteps++;
        stats.worst = Math.max(stats.worst, sameAsFull(got.batches, freshOf(st.resolved, d), `${name} · ${label} · detail ${d}`)); stats.checks++;
      }
    };
    const brush = (label, mode, channel, s0, r, steps) => {
      s.beginBrush({ mode, channel, s0, r }); if (!s.getState().brush) { stats.refused.push(`${name} ${label}: ${s.getState().message}`); return; }
      for (const d of steps) { s.brushTo(d); check(`${label} drag ${d}`); }
      s.endBrush(); check(`${label} release`);
    };
    check('start');
    const len = s.getState().resolved.segments.reduce((a, g) => a + g.length, 0);
    brush('phi at the joint (s0 0)', 'rate', 'phi', 0, 40, [0.01, 0.02]);
    brush('w near the end', 'rate', 'w', len - 10, 30, [1, 2]);
    brush('w at the joint (s0 2)', 'rate', 'w', 2, 30, [1.5]);
    brush('phi right at the lap end (s0 len-1)', 'rate', 'phi', len - 1, 30, [0.015]);
    if (name === 'cup') brush('c (the cup) at the joint', 'rate', 'c', len - 3, 25, [5]);
    // undo past the close: the loop opens; redo closes it again
    s.undo(); check('undo'); s.undo(); check('undo 2'); s.undo(); check('undo 3'); s.undo(); check('undo 4'); s.undo(); check('undo 5');
    let opened = false; for (let i = 0; i < 4 && s.getState().history.present.closed; i++) { s.undo(); check(`undo past close ${i}`); } opened = !s.getState().history.present.closed;
    assert.ok(opened, `${name}: control: undo opened the loop`);
    s.redo(); check('redo (re-close)');
    // a piece removed and the lap re-extended with ANOTHER family (a type change), then re-closed
    while (s.getState().history.present.closed) { s.undo(); }
    const before = s.getState().history.present.pieces.length; s.undo(); check('a piece removed (undo an extend)');
    assert.ok(s.getState().history.present.pieces.length < before, `${name}: control: a piece was removed`);
    s.extend({ length: 60, transition: 40, family: first && first.c ? 'half-pipe' : 'flat', targets: { kh: 0 } });
    if (s.getState().message) stats.refused.push(`${name} family extend: ${s.getState().message}`); else check('re-extended with another family');
    s.close(); if (!s.getState().history.present.closed) stats.refused.push(`${name} re-close: ${s.getState().message}`); check('re-closed');
    brush('phi after the re-close', 'rate', 'phi', 200, 40, [0.01]);
  }
  console.log(`# F checks ${stats.checks}, steps that reused pieces ${stats.reusedSteps}, worst position error ${stats.worst}, refused: ${stats.refused.length ? stats.refused.join(' | ') : 'none'}`);
  assert.ok(stats.reusedSteps > 10, `control: reuse actually ran (${stats.reusedSteps})`);
});

test('V: valuesAt equals channelAt(P, ch, s).v bit for bit, written independently: s at 0, L, every knot, inside and beyond both ends', async () => {
  const docs = [];
  for (const first of [{ c: 60 }, { w: 31, t: 360 }, null]) { const s = await closedLap(first); docs.push(s.getState().history.present); }
  const s2 = await createCoreShell({ brushFn: null }); s2.extend({ length: 200, family: 'half-pipe', first: { w: 20 } }); s2.extend({ length: 150, transition: 60, targets: { kh: 1 / 90, phi: 0.4, kv: 0.002 } }); s2.extend({ length: 100, transition: { e: 'start' }, targets: { e: 10 } }); docs.push(s2.getState().history.present);
  let n = 0, pieces = 0, optionalDefaults = 0;
  // the optional-default branch: copies of real pieces with an optional channel (c, e, s, t) removed and its flag off (cup, edge, tube), as an unflagged piece is built
  const OPT = { c: 'cup', e: 'edge', s: 'edge', t: 'tube' };
  for (const doc of docs.slice()) { const extra = []; for (const P of doc.pieces) { if (P.type !== 'road') continue; for (const [ch, flag] of Object.entries(OPT)) { const ch2 = { ...P.channels }; delete ch2[ch]; extra.push({ ...P, channels: ch2, [flag]: undefined }); } } docs.push({ pieces: extra }); }
  for (const doc of docs) for (const P of doc.pieces) {
    if (P.type !== 'road') continue; pieces++;
    const ss = [0, P.length, ...P.knots, P.length / 3, P.length * 0.5, P.length * 0.999, -5, -1e-12, P.length + 1e-12, P.length + 7, P.knots[0] ? P.knots[0] - 1e-9 : 0.1];
    for (const sv of ss) { const v = D.valuesAt(P, sv); assert.deepEqual(Object.keys(v), [...D.CHANNELS], 'every channel, in CHANNELS order');
      for (const ch of D.CHANNELS) { const want = D.channelAt(P, ch, sv).v; assert.ok(Object.is(v[ch], want), `${ch} at ${sv}: ${v[ch]} vs ${want}`); n++; if (P.channels[ch] === undefined) optionalDefaults++; } }
  }
  console.log(`# V ${n} comparisons over ${pieces} pieces, ${optionalDefaults} of them an optional channel's default`);
  assert.ok(pieces > 10 && optionalDefaults > 0, 'control: real pieces, and the optional-default branch was exercised');
});

test('C: reuseMesh trusts same[]: an all-true same[] for a document whose handles changed (start unchanged) returns a WRONG mesh and no error', async () => {
  const s = await closedLap({ c: 60 }), r0 = s.getState().resolved;
  const p0 = G.buildPath(r0.segments, { step: 2, closed: true, start: r0.start }), m0 = G.buildMesh(p0, r0.segments, {});
  s.beginBrush({ mode: 'rate', channel: 'w', s0: 400, r: 40 }); s.brushTo(3); s.endBrush(); const r1 = s.getState().resolved;
  assert.equal(r1.segments.length, r0.segments.length, 'control: the same number of segments');
  const p1 = G.buildPath(r1.segments, { step: 2, closed: true, start: r1.start });
  const lie = G.reuseMesh(m0, p1, r1.segments, r1.segments.map(() => true)), truth = G.buildMesh(p1, r1.segments, {});
  const a = batchesOf(lie), b = batchesOf(truth); let differs = false;
  try { sameAsFull(a, b, 'lie'); } catch (e) { differs = true; }
  assert.ok(differs, 'a stale same[] gives a mesh that differs from the truth (the contract is the caller\'s, and nothing inside reuseMesh notices)');
});
