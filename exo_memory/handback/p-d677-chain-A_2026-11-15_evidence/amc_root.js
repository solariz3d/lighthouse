// For a CMU AMC clip: frames, the root's horizontal travel (m), and its vertical bobs (each step lifts the root once), so the step
// length in metres can be read without trusting the frame rate.   node amc_root.js <file.amc> [...]
const fs = require('fs');
const kM = (1.0 / 0.45) * 2.54 / 100;   // CMU units to metres (acclaim.h:10, CMU's FAQ)
for (const f of process.argv.slice(2)) {
  const roots = fs.readFileSync(f, 'utf8').split(/\r?\n/).filter((l) => /^root\s/.test(l)).map((l) => l.trim().split(/\s+/).slice(1, 4).map(Number));
  if (roots.length < 3) { console.log(f, 'no root lines'); continue; }
  const x = roots.map((r) => r[0] * kM), y = roots.map((r) => r[1] * kM), z = roots.map((r) => r[2] * kM);
  const travel = Math.hypot(x[x.length - 1] - x[0], z[z.length - 1] - z[0]);
  // bobs: local maxima of the root's height, smoothed over 5 frames, at least 1 cm above the neighbouring minima
  const s = y.map((_, i) => { let a = 0, n = 0; for (let k = -2; k <= 2; ++k) if (y[i + k] !== undefined) a += y[i + k], ++n; return a / n; });
  const peaks = [];
  for (let i = 3; i < s.length - 3; ++i) if (s[i] > s[i - 1] && s[i] >= s[i + 1] && s[i] - Math.min(...s.slice(Math.max(0, i - 40), i)) > 0.01) peaks.push(i);
  const pathLen = x.reduce((acc, _, i) => (i ? acc + Math.hypot(x[i] - x[i - 1], z[i] - z[i - 1]) : 0), 0);
  const between = peaks.length > 1 ? Math.hypot(x[peaks[peaks.length - 1]] - x[peaks[0]], z[peaks[peaks.length - 1]] - z[peaks[0]]) / (peaks.length - 1) : NaN;
  console.log(`${f.split(/[\\/]/).pop()}: ${roots.length} frames, travel ${travel.toFixed(2)} m (path ${pathLen.toFixed(2)} m), ${peaks.length} root bobs, ${between.toFixed(2)} m between bobs (one step), ${peaks.length > 1 ? ((peaks[peaks.length - 1] - peaks[0]) / (peaks.length - 1)).toFixed(1) : '-'} frames a step`);
}
