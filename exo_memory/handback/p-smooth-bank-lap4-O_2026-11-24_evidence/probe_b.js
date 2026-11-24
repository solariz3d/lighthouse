// LAP 4 probe (b and c), on a COPY of the tip with flowBank patched by environment (never the worktree): over the second reader's drawn lists (q1's generator,
// seed 11: 160 at a 5 m floor and 160 at 20 m), how many of today's refusals lay with knots added between the marks, per variant; the knots and the saved bytes it
// costs; the time; and, for what is still refused, the room today's search names against the least that lays by the metre.
// usage: node probe_b.js   (copies the tip's src and tools into ../tmp/probe-b first)
'use strict';
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const fs = require('fs'), path = require('path');
const T = 'G:/consonance-scratch/o-smooth-t180', P = path.join(__dirname, '../tmp/probe-b');
fs.rmSync(P, { recursive: true, force: true });
for (const d of ['src', 'tools']) fs.cpSync(path.join(T, d), path.join(P, d), { recursive: true });
const f = path.join(P, 'src/core/extend.js'); let t = fs.readFileSync(f, 'utf8');
const a = `  const r = flowSolve(piece, marks, v0, m0, a0);\n  if (r.piece) return r.piece;\n`;
const NL = t.includes('\r\n') ? '\r\n' : '\n'; const a2 = a.replace(/\n/g, NL); if (t.split(a2).length !== 2) throw new Error('flowBank not found');
t = t.replace(a2, () => a2 + `  const V = process.env.FLOW_REFINE; if (V) for (const h of [10, 5, 2.5]) { const P2 = probeRefine(piece, marks, h, V, r.fail); if (!P2) continue; const r2 = flowSolve(P2, marks, v0, m0, a0); if (r2.piece) { probeRefine.used = h; return r2.piece; } }\n`);
t += `\nfunction probeRefine(piece, marks, h, V, fail) {
  const last = marks[marks.length - 1].at, k = Math.min(fail.k, marks.length - 1);
  const lo = V === 'local' ? (k ? marks[k - 1].at : 0) : 0, hi = V === 'local' ? (k + 1 < marks.length ? marks[k + 1].at : last) : last;
  const B = [...new Set([0, ...piece.knots.filter((x) => x > 0 && x < last), ...marks.map((m) => m.at), last].map((x) => +x.toFixed(4)))].sort((x, y) => x - y);
  const add = [];
  for (let i = 1; i < B.length; i++) { const x0 = B[i - 1], x1 = B[i]; if (x1 <= lo + 1e-9 || x0 >= hi - 1e-9) continue; const n = Math.ceil((x1 - x0) / h - 1e-9); for (let j = 1; j < n; j++) add.push(+(x0 + ((x1 - x0) * j) / n).toFixed(4)); }
  return add.length ? D.insertKnots(piece, add.filter((x) => x > 0.5 && x < piece.length - 0.5)) : null;
}\nmodule.exports.probeRefine = probeRefine;\n`;
fs.writeFileSync(f, t);
const D = require(path.join(P, 'src/core/document.js')), EX = require(f), { extend } = EX;
const DEG = Math.PI / 180, LEN = 300;
const lead = extend(D.createDoc('p'), { length: 300, family: 'bowl', first: { w: 33 } });
function drawn(gap, count, seed = 11) {
  const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648), out = [];
  for (let k = 0; k < count; k++) {
    const tr = +(20 + rnd() * 80).toFixed(1), nm = 1 + Math.floor(rnd() * 3), marks = []; let at = tr;
    for (let i = 0; i < nm; i++) { at = +(at + gap + rnd() * 40).toFixed(1); if (at > LEN) break; marks.push({ at, target: (rnd() * 60 - 30) * DEG }); }
    out.push({ first: { at: tr, target: (rnd() * 60 - 30) * DEG }, marks });
  }
  return out;
}
const opts = (L, extra = {}) => ({ length: LEN, targets: { phi: L.first.target }, transition: { phi: L.first.at }, bankShape: 'flow', through: { phi: L.marks }, ...extra });
const run = (L, extra) => { const t0 = process.hrtime.bigint(); try { const d = extend(lead, opts(L, extra)); return { ok: true, ms: Number(process.hrtime.bigint() - t0) / 1e6, bytes: D.serialize(d).length, knots: d.pieces[d.pieces.length - 1].knots.length }; } catch (e) { if (!(e instanceof D.CoreError)) throw e; return { ok: false, ms: Number(process.hrtime.bigint() - t0) / 1e6, msg: e.message }; } };
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? +s[Math.floor(s.length / 2)].toFixed(1) : null; }, mx = (a) => (a.length ? +Math.max(...a).toFixed(1) : null);
for (const gap of [5, 20]) {
  const lists = drawn(gap, 160);
  const base = lists.map((L) => { delete process.env.FLOW_REFINE; return run(L, { roomSearch: false }); });
  const refused = lists.filter((_, i) => !base[i].ok);
  console.log(`gap ${gap}: ${lists.length} lists, ${refused.length} refused today (bare, no room search)`);
  for (const V of ['uniform', 'local']) {
    process.env.FLOW_REFINE = V; const hs = {}, dk = [], db = [], ms = [], bare = [];
    let lays = 0;
    refused.forEach((L) => { probeRefine_reset(); const r = run(L, { roomSearch: false }); bare.push(r.ms); if (r.ok) { lays++; hs[EX.probeRefine.used] = (hs[EX.probeRefine.used] || 0) + 1; delete process.env.FLOW_REFINE; process.env.FLOW_REFINE = V; } });
    // knots and bytes against the same list laid with no refinement is impossible (it was refused): compare with the plain bank laid on the same piece
    refused.forEach((L) => { const r = run(L, { roomSearch: false }); if (r.ok) { const plain = (() => { const o = opts(L); delete o.bankShape; delete o.through; return extend(lead, o); })(); const pp = plain.pieces[plain.pieces.length - 1]; dk.push(r.knots - pp.knots.length); db.push(r.bytes - D.serialize(plain).length); } });
    const stillMs = []; refused.forEach((L) => { const r = run(L, { roomSearch: false }); if (!r.ok) stillMs.push(r.ms); });
    console.log(`  ${V}: ${lays} of ${refused.length} lay (at h ${JSON.stringify(hs)}); knots added over the plain bank's piece: median ${med(dk)}, max ${mx(dk)}; saved bytes added: median ${med(db)}, max ${mx(db)}; bare call on a still-refused list: median ${med(stillMs)} ms, max ${mx(stillMs)}`);
  }
  // today's bare and whole cost on the refused lists, for the record
  delete process.env.FLOW_REFINE;
  console.log(`  today: bare refused median ${med(refused.map((L) => run(L, { roomSearch: false }).ms))} ms; whole refused median ${med(refused.map((L) => run(L).ms))} ms, max ${mx(refused.map((L) => run(L).ms))}`);
}
function probeRefine_reset() { EX.probeRefine.used = null; }
