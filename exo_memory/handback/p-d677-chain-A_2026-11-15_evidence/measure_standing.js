// D677 A: quiet standing measured from dos Santos et al. 2017 (PeerJ 5:e3626; Figshare 4525082, data CC0 1.0): the young adults,
// eyes open, rigid surface. Reads the data as text only.   node measure_standing.js <data dir> <trial> [<trial> ...]
// Columns (the files' own headers): grf RGRF_Y / LGRF_Y (N, vertical), COPNET_X / _Z (m; X ahead, Z to the right: R and L COP_Z sit
// at +-0.09); ang <seg>_Lab_Angle_X / _Y / _Z (deg; Z the flexion axis, as the spine's FE_Z columns are named: Z = fore-aft tilt,
// X = side tilt, Y = turn; the R-prefixed set); mkr <marker>_X/_Y/_Z (lab, Y up).
const fs = require('fs');
const path = require('path');
const [dir, ...trials] = process.argv.slice(2);
if (!dir || trials.length === 0) throw new Error('usage: node measure_standing.js <dir> <trial>...');

function table(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter((l) => l.trim());
  const head = lines[0].split('\t');
  const cols = {};
  head.forEach((h, i) => (cols[h.trim()] = i));
  const rows = lines.slice(1).map((l) => l.split('\t').map(Number));
  const col = (name) => {
    if (!(name in cols)) throw new Error(path.basename(file) + ': no column ' + name);
    return rows.map((r) => r[cols[name]]);
  };
  return { col, n: rows.length, has: (name) => name in cols };
}
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const sd = (a) => { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
const pct = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.max(0, Math.round(p * (s.length - 1))))]; };
const range90 = (a) => pct(a, 0.95) - pct(a, 0.05);
const movavg = (a, w) => { const h = Math.floor(w / 2); const c = [0]; for (const x of a) c.push(c[c.length - 1] + x); return a.map((_, i) => { const lo = Math.max(0, i - h), hi = Math.min(a.length, i + h + 1); return (c[hi] - c[lo]) / (hi - lo); }); };
// Peaks of a detrended signal at least `gap` samples apart, each standing at least `prom` above the lowest point since the last peak.
function peaks(a, gap, prom) {
  const out = [];
  let low = Infinity;
  for (let i = 1; i < a.length - 1; ++i) {
    low = Math.min(low, a[i]);
    if (a[i] >= a[i - 1] && a[i] > a[i + 1] && a[i] - low >= prom && (out.length === 0 || i - out[out.length - 1] >= gap)) out.push(i), (low = a[i]);
  }
  return out;
}

const rows = [];
for (const t of trials) {
  const g = table(path.join(dir, t + 'grf.txt')), an = table(path.join(dir, t + 'ang.txt')), m = table(path.join(dir, t + 'mkr.txt'));
  const time = g.col('Time');
  const hz = Math.round(1 / (time[1] - time[0]));
  const R = g.col('RGRF_Y'), L = g.col('LGRF_Y');
  const share = movavg(R.map((r, i) => r / (r + L[i])), hz);   // the right foot's share of the weight, 1 s smoothed
  // A weight shift: the 1 s share moving from below its trial mean - 1 sd to above its mean + 1 sd, or back (hysteresis).
  const sm = mean(share), ss = sd(share);
  let state = 0, shifts = 0;
  for (const x of share) {
    const s = x > sm + ss ? 1 : x < sm - ss ? -1 : 0;
    if (s !== 0 && s !== state) { if (state !== 0) ++shifts; state = s; }
  }
  const seconds = (time[time.length - 1] - time[0]);
  const copAP = g.col('COPNET_X').map((x) => x * 1000), copML = g.col('COPNET_Z').map((x) => x * 1000);
  const ang = (seg, ax) => { const a = an.col(`R${seg}_Lab_Angle_${ax}`); const mm = mean(a); return a.map((x) => x - mm); };
  // The breath: the chest's depth (PX to T7) and the sternum's rise (IJ over L3), detrended over 10 s and smoothed over 0.3 s.
  const mk = (name) => [m.col(name + '_X'), m.col(name + '_Y'), m.col(name + '_Z')];
  const [pxX, pxY, pxZ] = mk('PX'), [t7X, t7Y, t7Z] = mk('T7'), ijY = m.col('IJ_Y'), l3Y = m.col('L3_Y');
  const scale = mean(ijY) > 10 ? 1 : 1000;   // the markers in mm or in m: to mm
  const depth = pxX.map((_, i) => Math.hypot(pxX[i] - t7X[i], pxY[i] - t7Y[i], pxZ[i] - t7Z[i]) * scale);
  const rise = ijY.map((y, i) => (y - l3Y[i]) * scale);
  const breathOf = (sig) => {
    const d = movavg(sig.map((x, i) => x - movavg(sig, 10 * hz)[i]), Math.round(0.3 * hz));
    const p = peaks(d, Math.round(1.5 * hz), 0.5);   // at least 1.5 s apart (under 40 a minute), 0.5 mm above the last trough
    const exc = [];
    for (let k = 1; k < p.length; ++k) exc.push(d[p[k]] - Math.min(...d.slice(p[k - 1], p[k])));
    return { per_min: p.length > 1 ? (60 * (p.length - 1)) / ((p[p.length - 1] - p[0]) / hz) : NaN, mm: exc.length ? pct(exc, 0.5) : NaN, n: p.length };
  };
  const dDepth = breathOf(depth), dRise = breathOf(rise);
  const head = an.col('RHe_Th_Angle_Y'), hm = mean(head);
  rows.push({
    t, hz, seconds,
    share_mean: sm, share_sd: ss, share_r90: range90(share), shifts_per_min: (shifts * 60) / seconds,
    cop_ap_sd: sd(copAP), cop_ml_sd: sd(copML),
    th_fa: range90(ang('Th', 'Z')), th_side: range90(ang('Th', 'X')), th_turn: range90(ang('Th', 'Y')),
    pel_fa: range90(ang('Pel', 'Z')), pel_side: range90(ang('Pel', 'X')),
    he_fa: range90(ang('He', 'Z')), he_side: range90(ang('He', 'X')), he_turn: range90(ang('He', 'Y')),
    head_on_th_turn: range90(head.map((x) => x - hm)),
    th_on_pel_fa: range90((() => { const a = an.col('RTh_Pel_Angle_Z'), mm = mean(a); return a.map((x) => x - mm); })()),
    th_on_pel_side: range90((() => { const a = an.col('RTh_Pel_Angle_X'), mm = mean(a); return a.map((x) => x - mm); })()),
    th_on_pel_turn: range90((() => { const a = an.col('RTh_Pel_Angle_Y'), mm = mean(a); return a.map((x) => x - mm); })()),
    breath_depth_per_min: dDepth.per_min, breath_depth_mm: dDepth.mm, breath_rise_per_min: dRise.per_min, breath_rise_mm: dRise.mm,
  });
}
const keys = Object.keys(rows[0]).filter((k) => !['t', 'hz', 'seconds'].includes(k));
if (trials.length <= 3) for (const r of rows) console.log(JSON.stringify(r, (k, v) => (typeof v === 'number' ? Number(v.toFixed(3)) : v)));
console.log(`${rows.length} trials (${[...new Set(rows.map((r) => r.hz))].join(',')} Hz, ${mean(rows.map((r) => r.seconds)).toFixed(1)} s each): median [25th..75th percentile] over trials`);
for (const k of keys) {
  const v = rows.map((r) => r[k]).filter(Number.isFinite);
  console.log(`  ${k.padEnd(22)} ${pct(v, 0.5).toFixed(3)} [${pct(v, 0.25).toFixed(3)} .. ${pct(v, 0.75).toFixed(3)}]  (n ${v.length})`);
}
