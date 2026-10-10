// m6flight.test.js (pane B; written on L for L130-R and never run there; re-created on D for D187): M6's headless half. A flight piece
// draws no label and throws nothing; a document with no pieces draws nothing. labels.js is mounted over a minimal fake DOM that keeps
// every listener; the view and the track are answered the way app/preview/index.js answers them, from the adapter's own path.
'use strict';
const test = require('node:test'), assert = require('node:assert/strict'), path = require('path'), WT = process.env.WT;
const D = require(path.join(WT, 'src/core/document.js')), { extend } = require(path.join(WT, 'src/core/extend.js')), { toPath } = require(path.join(WT, 'src/core/adapter.js'));
const RD = require(path.join(WT, 'src/core/readout.js')), LB = require(path.join(WT, 'app/core/labels.js'));

function fakeDom() {
  const L = {}; let q = [];
  const mk = () => { const e = { children: [], style: {}, dataset: {}, textContent: '', isConnected: true, offsetWidth: 180, offsetHeight: 40, setAttribute() {}, append(...k) { e.children.push(...k); }, remove() { e.isConnected = false; } }; return e; };
  const doc = { createElement: mk, addEventListener: (t, f) => (L[t] = L[t] || []).push(f), removeEventListener: (t, f) => { L[t] = (L[t] || []).filter((g) => g !== f); }, dispatchEvent: (ev) => { (L[ev.type] || []).forEach((f) => f(ev)); return true; } };
  const win = { CustomEvent: class { constructor(type, o) { this.type = type; this.detail = o && o.detail; } }, requestAnimationFrame: (f) => { q.push(f); return q.length; }, cancelAnimationFrame() {}, step() { const f = q; q = []; f.forEach((g) => g(0)); } };
  const stage = { ownerDocument: doc, clientWidth: 800, clientHeight: 500, append() {} };
  return { doc, win, stage };
}
function run(d) {
  const { doc, win, stage } = fakeDom();
  const { segments, path: p } = d.pieces.length ? toPath(d) : { segments: [], path: null };
  const head = p ? p.head : null;
  doc.addEventListener('t180:view', (e) => e.detail.reply(head ? { mode: 'overhead', pose: { eye: [head.pos[0], head.pos[1] + 800, head.pos[2]], target: head.pos.slice(), up: [0, 0, 1], fov: 1 }, head: { pos: head.pos.slice(), T: head.T.slice() } } : { mode: 'build', pose: null, head: null }));
  doc.addEventListener('t180:track-request', (e) => e.detail.reply(p ? { path: p, segments } : null));
  const shell = { getState: () => ({ history: { present: d } }), pieceReadouts: () => d.pieces.map((_, i) => RD.pieceReadout(d, i)) };
  let m, threw = null;
  try { m = LB.mount(stage, shell, win); for (let i = 0; i < 3; i++) win.step(); } catch (e) { threw = e; }
  return { threw, drawn: m ? m.labels() : [], culled: m ? m.culled() : [] };
}

test('M6: a track with a flight between two roads labels the roads only and throws nothing', () => {
  let d = extend(D.createDoc('f'), { length: 200 });
  d = D.appendPiece(d, D.flightPiece({ gap: 30, drop: 2, land: -0.05 }));
  d = extend(d, { length: 200 });
  const flightId = d.pieces.find((P) => P.type === 'flight').id, r = run(d);
  console.log('M6 flight', JSON.stringify({ pieces: d.pieces.map((P) => `${P.id}:${P.type}`), drawn: r.drawn.map((x) => x.piece), culled: r.culled, threw: r.threw && r.threw.message }));
  assert.equal(r.threw, null);
  assert.ok(!r.drawn.some((x) => x.piece === flightId) && !r.culled.includes(flightId), 'the flight has no label, drawn or culled');
  assert.equal(r.drawn.length + r.culled.length, 2, 'both roads were considered');
});
test('M6: a document with no pieces draws nothing and throws nothing', () => {
  const r = run(D.createDoc('empty'));
  assert.equal(r.threw, null); assert.deepEqual([r.drawn.length, r.culled.length], [0, 0]);
});
test('M6: a track that ENDS in a flight (the head is a flight): nothing thrown, the flight unlabelled', () => {
  let d = extend(D.createDoc('f2'), { length: 200 }); d = D.appendPiece(d, D.flightPiece({ gap: 30, drop: 2, land: -0.05 }));
  const r = run(d);
  console.log('M6 flight-head', JSON.stringify({ drawn: r.drawn.map((x) => x.piece), culled: r.culled, threw: r.threw && r.threw.message }));
  assert.equal(r.threw, null); assert.ok(!r.drawn.some((x) => x.piece === d.pieces[1].id));
});
