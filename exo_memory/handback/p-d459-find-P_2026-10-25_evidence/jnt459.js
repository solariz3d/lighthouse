// jnt459.js (D459, P): at EVERY joint of the lap, the jump in the centre line's position (C0), heading and pitch (C1), horizontal and vertical curvature (C2),
// and in the roll and cross-section channels (value and slope), from the core's own path samples and channels.   node jnt459.js <tree> <save> [step=0.5]
'use strict';
const fs = require('fs'), path = require('path'); const [T, F, ST] = process.argv.slice(2); const step = ST ? +ST : 0.5;
const D = require(path.join(T, 'src/core/document.js')), AD = require(path.join(T, 'src/core/adapter.js'));
const doc = D.parse(fs.readFileSync(F, 'utf8')); const { segments, path: p } = AD.toPath(doc, { step }); const S = p.samples, LAP = doc.pieces.reduce((a, q) => a + q.length, 0);
console.log('pieces', doc.pieces.length, 'lap', LAP, 'samples', S.length, 's range', S[0].s, '..', S[S.length - 1].s, 'closed', doc.closed, 'segments', segments.length);
const s0 = []; { let a = 0; for (const P of doc.pieces) { s0.push(a); a += P.length; } }
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], norm = (a) => Math.hypot(a[0], a[1], a[2]);
const deg = (r) => r * 180 / Math.PI, p100 = (k) => deg(k) * 100;
// nearest sample index at s (samples are step apart from S[0].s)
const idx = (s) => { let i = Math.round((s - S[0].s) / step); i = Math.max(0, Math.min(S.length - 1, i)); while (i + 1 < S.length && S[i + 1].s <= s + 1e-9) i++; while (i > 0 && S[i].s > s + 1e-9) i--; return i; };
const headingOf = (Tv) => Math.atan2(Tv[0], Tv[2]), pitchOf = (Tv) => Math.asin(Math.max(-1, Math.min(1, Tv[1])));
// curvature from the samples: second difference over 2 m, projected on L (horizontal-ish) and U
const NB = Math.round(2 / step); const kap = (i) => { if (i - NB < 0 || i + NB >= S.length) return null; const d2 = sub(sub(S[i + NB].pos, S[i].pos), sub(S[i].pos, S[i - NB].pos)); const hh = NB * step; return { kL: dot(d2, S[i].L) / (hh * hh), kU: dot(d2, S[i].U) / (hh * hh) }; };
const CH = ['kh', 'kv', 'phi', 'w', 'r', 'h', 'l', 'c', 'e', 's', 't', 'er'];
const slopeAt = (P, s, h = 0.01) => { const a = D.valuesAt(P, Math.max(0, s - h)), b = D.valuesAt(P, Math.min(P.length, s + h)); const o = {}; for (const ch of CH) o[ch] = (b[ch] - a[ch]) / (Math.min(P.length, s + h) - Math.max(0, s - h)); return o; };
const rows = [];
for (let k = 0; k < doc.pieces.length; k++) {
  const P = doc.pieces[k], Q = doc.pieces[(k + 1) % doc.pieces.length], sJ = (s0[k] + P.length) % LAP, seam = k === doc.pieces.length - 1;
  // samples: the last before the joint and the first after (for the seam: the last sample of the lap vs the first)
  let iA, iB; if (!seam) { iA = idx(sJ - step / 2); iB = iA + 1; } else { iA = S.length - 1; iB = 0; }
  const A = S[iA], B = S[iB];
  // C0: B.pos against A.pos advanced along A.T by the s gap
  const ds = seam ? (LAP - A.s) + (B.s - 0) : (B.s - A.s);
  const pred = [A.pos[0] + A.T[0] * ds, A.pos[1] + A.T[1] * ds, A.pos[2] + A.T[2] * ds]; const gap = sub(B.pos, pred);
  const c0 = { along: dot(gap, A.T), side: dot(gap, A.L), up: dot(gap, A.U), abs: norm(gap) };
  // C1: heading and pitch of T across the joint, and the roll (U about T) — compare the sample frames
  let dHead = headingOf(B.T) - headingOf(A.T); dHead = Math.atan2(Math.sin(dHead), Math.cos(dHead)); const dPitch = pitchOf(B.T) - pitchOf(A.T);
  const dRollFrame = Math.asin(Math.max(-1, Math.min(1, dot(B.U, A.L)))); // U of B seen in A's L: a roll step between the frames
  // C2 from the channels: end of P vs start of Q (value and slope)
  const vA = D.valuesAt(P, P.length), vB = D.valuesAt(Q, 0), mA = slopeAt(P, P.length), mB = slopeAt(Q, 0);
  // C2 from the samples: curvature 2 m before and 2 m after
  const kA = kap(seam ? iA - NB : iA - NB), kB = kap(seam ? iB + NB : iB + NB);
  rows.push({ k, name: P.id + '|' + Q.id, s: sJ, c0, dHead, dPitch, dRollFrame, vA, vB, mA, mB, kA, kB });
}
console.log('\nC0 (mm) and C1 (deg) across every joint, from the path samples ' + step + ' m apart (the sample before the joint, advanced along its own tangent, against the sample after):');
console.log('joint      s        along    side      up    |gap|   dHeading  dPitch  dRoll(frame)');
for (const r of rows) console.log(r.name.padEnd(8), String(r.s).padStart(6), (r.c0.along * 1000).toFixed(2).padStart(8), (r.c0.side * 1000).toFixed(2).padStart(8), (r.c0.up * 1000).toFixed(2).padStart(8), (r.c0.abs * 1000).toFixed(2).padStart(8), deg(r.dHead).toFixed(4).padStart(9), deg(r.dPitch).toFixed(4).padStart(8), deg(r.dRollFrame).toFixed(4).padStart(9));
console.log('\nC2: the channels at the end of the piece before and the start of the piece after (value; slope per m), kh/kv in deg/100 m, phi/c/e/er in deg:');
console.log('joint      s      kh end->start   kv end->start   phi end->start      c end->start     e end->start    er end->start   w     s-ch     | slopes: kh kv phi c e er (per m, end -> start)');
const f = (x, n = 3) => (+x).toFixed(n);
for (const r of rows) { const a = r.vA, b = r.vB, ma = r.mA, mb = r.mB;
  console.log(r.name.padEnd(8), String(r.s).padStart(6), `${f(p100(a.kh), 2)}->${f(p100(b.kh), 2)}`.padStart(15), `${f(p100(a.kv), 2)}->${f(p100(b.kv), 2)}`.padStart(15), `${f(deg(a.phi), 2)}->${f(deg(b.phi), 2)}`.padStart(16), `${f(a.c, 2)}->${f(b.c, 2)}`.padStart(14), `${f(a.e, 2)}->${f(b.e, 2)}`.padStart(14), `${f(a.er, 2)}->${f(b.er, 2)}`.padStart(14), `${f(a.w, 1)}->${f(b.w, 1)}`, `${f(a.s, 2)}->${f(b.s, 2)}`, '|', `${f(p100(ma.kh), 3)}->${f(p100(mb.kh), 3)}`, `${f(p100(ma.kv), 3)}->${f(p100(mb.kv), 3)}`, `${f(deg(ma.phi), 3)}->${f(deg(mb.phi), 3)}`, `${f(ma.c, 3)}->${f(mb.c, 3)}`, `${f(ma.e, 3)}->${f(mb.e, 3)}`, `${f(ma.er, 3)}->${f(mb.er, 3)}`); }
console.log('\nC2 from the samples (deg/100 m), 2 m before and 2 m after the joint: kL (toward L) and kU (toward U):');
for (const r of rows) console.log(r.name.padEnd(8), String(r.s).padStart(6), r.kA ? `kL ${f(p100(r.kA.kL), 3)} -> ${f(p100(r.kB.kL), 3)}   kU ${f(p100(r.kA.kU), 3)} -> ${f(p100(r.kB.kU), 3)}` : 'n/a');
// also the frame's own roll: angle of L against the horizontal, before and after
console.log('\nframe roll (deg; angle of L below the horizontal) 1 m before and after each joint, and the segment index change:');
for (const r of rows) { const i = r.k === doc.pieces.length - 1 ? [S.length - 1 - NB / 2 | 0, NB / 2 | 0] : [idx(r.s - 1), idx(r.s + 1)]; const rl = (sm) => deg(Math.atan2(-sm.L[1], Math.hypot(sm.L[0], sm.L[2]))); console.log(r.name.padEnd(8), String(r.s).padStart(6), f(rl(S[i[0]]), 4), '->', f(rl(S[i[1]]), 4), ' seg', S[i[0]].seg, '->', S[i[1]].seg); }
