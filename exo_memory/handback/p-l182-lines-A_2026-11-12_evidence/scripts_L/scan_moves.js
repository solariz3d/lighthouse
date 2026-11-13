// A: scans EVERY 8 s window of a replay (whatever the hunter was doing) for his two named moves: a CIRCLE (speed over 5 m/s, at least 0.75 of a lap of net turning inside a small area) and a LINE SHUTTLE
// (speed over 5 m/s, at least 2 reversals of direction, the path a thin line: long axis over 8 m, short axis under 6 m). Reports merged windows with the hunter's distance and speed in them.
// usage: node scan_moves.js <prefix> [win_s=8]
const fs = require('fs');
const prefix = process.argv[2];
const WIN = +(process.argv[3] || 8);
function csv(f) {
  const L = fs.readFileSync(f, 'utf8').trim().split(/\r?\n/);
  const h = L[0].split(',');
  return L.slice(1).map(l => { const c = l.split(','); const o = {}; h.forEach((k, i) => o[k] = (c[i] !== '' && !isNaN(+c[i])) ? +c[i] : c[i]); return o; });
}
const P = csv(prefix + '_player.csv'), C = csv(prefix + '_chasers.csv');
const hun = new Map();
for (const r of C) if (r.kind === 'hunter') hun.set(r.t.toFixed(3), r);
const rows = P.map(p => { const h = hun.get(p.t.toFixed(3)); return { ...p, h, d: h ? Math.hypot(h.x - p.x, h.z - p.z) : null }; });
for (let i = 1; i < rows.length; i++) {
  const a = rows[i - 1], b = rows[i], dt = b.t - a.t;
  b.vx = (b.x - a.x) / dt; b.vz = (b.z - a.z) / dt; b.sp = Math.hypot(b.vx, b.vz); b.hd = Math.atan2(b.vx, b.vz);
}
const wrap = a => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
const med = a => { const s = a.filter(Number.isFinite).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : NaN; };
const f1 = x => (Number.isFinite(x) ? x.toFixed(1) : '-');
const step = Math.round(1 / (rows[1].t - rows[0].t)), n = Math.round(WIN / (rows[1].t - rows[0].t));
const found = [];
for (let i = 1; i + n < rows.length; i += step) {
  const seg = rows.slice(i, i + n);
  const sp = med(seg.map(r => r.sp));
  if (!(sp > 5)) continue;
  let turn = 0, rev = 0, lastRev = -9;
  for (let k = 7; k < seg.length; k++) {
    if (seg[k].sp > 2 && seg[k - 1].sp > 2) turn += wrap(seg[k].hd - seg[k - 1].hd);
    if (seg[k - 6].sp > 3 && seg[k].sp > 3 && Math.abs(wrap(seg[k].hd - seg[k - 6].hd)) > 2.1 && seg[k].t - lastRev > 1.0) { rev++; lastRev = seg[k].t; }
  }
  const xs = seg.map(r => r.x), zs = seg.map(r => r.z);
  const ex = Math.max(...xs) - Math.min(...xs), ez = Math.max(...zs) - Math.min(...zs);
  const long = Math.max(ex, ez), short = Math.min(ex, ez), diag = Math.hypot(ex, ez);
  const laps = turn / (2 * Math.PI);
  let kind = '';
  if (Math.abs(laps) >= 0.75 && diag < 22) kind = 'CIRCLE';
  else if (rev >= 2 && long > 8 && short < 6) kind = 'SHUTTLE';
  if (kind) found.push({ t0: seg[0].t, t1: seg[seg.length - 1].t, kind, sp, laps, rev, long, short, d: med(seg.map(r => r.d)), dmin: Math.min(...seg.map(r => r.d).filter(Number.isFinite)) });
}
// merge adjacent windows of the same kind
const merged = [];
for (const f of found) {
  const last = merged[merged.length - 1];
  if (last && last.kind === f.kind && f.t0 <= last.t1 + 0.5) { last.t1 = f.t1; last.n++; last.laps = Math.max(Math.abs(last.laps), Math.abs(f.laps)); last.rev = Math.max(last.rev, f.rev); last.dmin = Math.min(last.dmin, f.dmin); last.dmed = Math.min(last.dmed, f.d); }
  else merged.push({ ...f, n: 1, dmed: f.d });
}
console.log(`${prefix.split(/[\\/]/).pop()}: ${rows.length} rows over ${f1(rows[rows.length - 1].t)} s; windows of ${WIN} s moving over 5 m/s: ${merged.filter(m => m.kind === 'CIRCLE').length} circle stretch(es), ${merged.filter(m => m.kind === 'SHUTTLE').length} shuttle stretch(es)`);
for (const m of merged) console.log(`  ${m.kind.padEnd(7)} t ${f1(m.t0)}-${f1(m.t1)} s (${f1(m.t1 - m.t0)} s): speed ${f1(m.sp)} m/s, turning ${f1(Math.abs(m.laps))} lap(s), reversals ${m.rev}, path ${f1(m.long)} x ${f1(m.short)} m; hunter nearest ${f1(m.dmin)} m, median-distance ${f1(m.dmed)} m`);
