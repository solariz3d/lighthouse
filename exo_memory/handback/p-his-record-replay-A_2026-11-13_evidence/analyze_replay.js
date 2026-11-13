// A: reads replay_dump's CSVs (player and chasers, one row every 0.1 s) of HIS run and reports the stretches where the hunter was near and did not catch him:
// for each, how he moved (reversals along a line = a shuttle; total turning in a small area = a circle) and what the hunter did (distance, speed, snags, modes).
// usage: node analyze_replay.js <prefix> [near_m=12] [min_s=5]
const fs = require('fs');
const prefix = process.argv[2];
const NEAR = +(process.argv[3] || 12), MIN_S = +(process.argv[4] || 5);
function csv(f) {
  const L = fs.readFileSync(f, 'utf8').trim().split(/\r?\n/);
  const h = L[0].split(',');
  return L.slice(1).map(l => { const c = l.split(','); const o = {}; h.forEach((k, i) => o[k] = (c[i] !== '' && !isNaN(+c[i])) ? +c[i] : c[i]); return o; });
}
const P = csv(prefix + '_player.csv'), C = csv(prefix + '_chasers.csv');
const byT = new Map();
for (const r of C) { const k = r.t.toFixed(3); if (!byT.has(k)) byT.set(k, []); byT.get(k).push(r); }
const rows = P.map(p => {
  const cs = byT.get(p.t.toFixed(3)) || [];
  const h = cs.find(r => r.kind === 'hunter');
  return { ...p, h, d: h ? Math.hypot(h.x - p.x, h.z - p.z) : null, others: cs.filter(r => r.kind !== 'hunter') };
});
for (let i = 1; i < rows.length; i++) {
  const a = rows[i - 1], b = rows[i], dt = b.t - a.t;
  b.vx = (b.x - a.x) / dt; b.vz = (b.z - a.z) / dt; b.sp = Math.hypot(b.vx, b.vz); b.hd = Math.atan2(b.vx, b.vz);
  if (a.h && b.h) { const hv = [(b.h.x - a.h.x) / dt, (b.h.z - a.h.z) / dt]; b.hh = Math.atan2(hv[0], hv[1]); b.hsp = Math.hypot(hv[0], hv[1]); }
}
const wrap = a => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
const med = a => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : NaN; };
const f1 = x => (Number.isFinite(x) ? x.toFixed(1) : '-');

// contact stretches: consecutive rows with the hunter within NEAR metres; gaps under 1 s are bridged
const stretches = [];
let cur = null;
for (let i = 0; i < rows.length; i++) {
  const near = rows[i].d !== null && rows[i].d < NEAR;
  if (near) { if (!cur) cur = { i0: i, i1: i }; else cur.i1 = i; }
  else if (cur && rows[i].t - rows[cur.i1].t > 1.0) { stretches.push(cur); cur = null; }
}
if (cur) stretches.push(cur);
const kept = stretches.filter(s => rows[s.i1].t - rows[s.i0].t >= MIN_S);

console.log(`run: ${rows.length} rows over ${f1(rows[rows.length - 1].t)} s; hunter within ${NEAR} m for at least ${MIN_S} s in ${kept.length} stretch(es) (of ${stretches.length} contacts)`);
let n = 0;
for (const s of kept) {
  n++;
  const seg = rows.slice(s.i0, s.i1 + 1);
  const t0 = seg[0].t, t1 = seg[seg.length - 1].t;
  const ds = seg.map(r => r.d).filter(x => x !== null);
  const sp = seg.map(r => r.sp).filter(x => x !== undefined);
  const hsp = seg.map(r => r.hsp).filter(x => x !== undefined);
  // the player's moves: reversals (heading flips by more than 120 degrees within 0.6 s at over 3 m/s) and total signed turning
  let rev = 0, turn = 0, absTurn = 0, lastRev = -9;
  for (let i = 7; i < seg.length; i++) {
    const a = seg[i - 6], b = seg[i];
    if (a.sp > 3 && b.sp > 3 && Math.abs(wrap(b.hd - a.hd)) > 2.1 && b.t - lastRev > 1.0) { rev++; lastRev = b.t; }
    if (seg[i].hd !== undefined && seg[i - 1].hd !== undefined && seg[i].sp > 2) { const w = wrap(seg[i].hd - seg[i - 1].hd); turn += w; absTurn += Math.abs(w); }
  }
  const xs = seg.map(r => r.x), zs = seg.map(r => r.z);
  const ext = [Math.max(...xs) - Math.min(...xs), Math.max(...zs) - Math.min(...zs)];
  // the hunter: snags (slow while near), its own reversals of heading (an overshoot), the modes it was in
  let snag = 0, hrev = 0, hlast = -9;
  const modes = {};
  for (let i = 7; i < seg.length; i++) {
    const r = seg[i];
    if (r.h) modes[r.h.mode] = (modes[r.h.mode] || 0) + 1;
    if (r.hsp !== undefined && r.hsp < 2.0 && r.d < NEAR) snag++;
    const a = seg[i - 6];
    if (a.hh !== undefined && r.hh !== undefined && a.hsp > 3 && r.hsp > 3 && Math.abs(wrap(r.hh - a.hh)) > 2.1 && r.t - hlast > 1.0) { hrev++; hlast = r.t; }
  }
  const shape = rev >= 3 && absTurn < 2 * Math.PI * (1 + rev) ? 'SHUTTLE-like' : (Math.abs(turn) > 4.5 && Math.max(...ext) < 22 ? 'CIRCLE-like' : '');
  console.log(`#${n} t ${f1(t0)}-${f1(t1)} s (${f1(t1 - t0)} s): hunter dist min ${f1(Math.min(...ds))} median ${f1(med(ds))} max ${f1(Math.max(...ds))} m; hunter speed median ${f1(med(hsp))} m/s, snags(<2 m/s) ${snag} ticks of 0.1 s, its own about-turns ${hrev}; modes ${JSON.stringify(modes)}`);
  console.log(`    player speed median ${f1(med(sp))} m/s; reversals ${rev}; net turning ${f1(turn / (2 * Math.PI))} laps, total turning ${f1(absTurn / (2 * Math.PI))} laps; extent ${f1(ext[0])} x ${f1(ext[1])} m; others near: ${[...new Set(seg.flatMap(r => r.others.map(o => o.kind + '#' + o.id)))].join(',') || 'none'}   ${shape}`);
}
