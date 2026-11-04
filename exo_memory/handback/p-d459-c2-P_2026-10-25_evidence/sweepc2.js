// sweepc2.js (D459 3b, P): C's sweep generator (test/sweep_joints.test.js trackOf, copied verbatim from t180-wt-c460 at 16:5x) run on a tree, with the C2 check of
// src/core/continuity.js (taken from the d459-p tree, so the old tree reads with the same instrument) on every seed.   node sweepc2.js <tree> <seeds>
'use strict';
const path = require('path'); const T = path.resolve(process.argv[2]), N = Number(process.argv[3] || 6);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js')), { close } = require(path.join(T, 'src/core/close.js'));
const C = require('C:/Users/nname/Downloads/t180-wt-p459/src/core/continuity.js'); const DEG = Math.PI / 180;
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function trackOf(seed) {
  const r = rng(seed), pick = (a) => a[Math.floor(r() * a.length)], between = (a, b) => a + (b - a) * r();
  const firstKind = pick(['plain', 'cup', 'edge', 'tube']);
  const first = firstKind === 'cup' ? { c: Math.round(between(5, 30)) } : firstKind === 'edge' ? { e: Math.round(between(5, 30)) } : firstKind === 'tube' ? { t: Math.round(between(60, 200)) } : {};
  let doc = extend(D.createDoc(`sweep ${seed}`), { length: 300, first }); const words = [{ length: 300, first }];
  const n = 5 + Math.floor(r() * 4);
  for (let k = 0; k < n; k++) {
    for (let tries = 0; tries < 6; tries++) {
      const t = {};
      if (r() < 0.6) t.kh = (r() < 0.5 ? -1 : 1) / between(250, 900);
      else if (r() < 0.5) t.kh = 0;
      if (r() < 0.3) t.kv = (r() < 0.5 ? -1 : 1) / between(2000, 6000);
      if (r() < 0.35) t.phi = (r() < 0.5 ? -1 : 1) * between(0, 20) * DEG;
      if (firstKind === 'cup' && r() < 0.5) t.c = Math.round(between(0, 35));
      if (firstKind === 'edge' && r() < 0.6) { if (r() < 0.5) t.e = Math.round(between(-10, 30)); else t.er = Math.round(between(0, 35)); }
      if (firstKind === 'tube' && r() < 0.5) t.t = Math.round(between(30, 240));
      const w = { length: Math.round(between(40, 260)), transition: 40, targets: t };
      try { doc = extend(doc, w); words.push(w); break; } catch (e) { /* redraw */ }
    }
  }
  let closed = false;
  if (seed % 2 === 0) { try { const c = close(doc, { edited: [0] }); if (c.converged) { doc = c.doc; closed = true; } } catch (e) { /* open */ } }
  return { doc, closed, words, firstKind };
}
let seedsRed = 0, joints = 0, breaks = 0; const worst = [];
for (let seed = 1; seed <= N; seed++) { const { doc, closed, firstKind } = trackOf(seed); const b = C.c2Breaks(doc); const nj = C.jointSteps(doc, { channels: ['phi'] }).length; joints += nj; breaks += b.length; if (b.length) seedsRed++;
  const w = b.reduce((m, e) => Math.max(m, Math.abs(e.dkDeg)), 0);
  console.log(`seed ${String(seed).padStart(3)} ${firstKind.padEnd(5)} ${closed ? 'closed' : 'open  '} pieces ${doc.pieces.length} joints ${nj} C2 breaks ${b.length}${b.length ? ' worst ' + w.toFixed(4) + ' deg/m2 (' + b.slice(0, 3).map((e) => e.joint + ' ' + e.ch).join(', ') + (b.length > 3 ? ', …' : '') + ')' : ''}`); }
console.log(`seeds ${N}: ${seedsRed} with a C2 break, ${breaks} breaking joint-channels of ${joints} joints`);
