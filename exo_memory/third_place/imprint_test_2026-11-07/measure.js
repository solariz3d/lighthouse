// The imprint test (registered before running): do the imprints have the highest statistical complexity of the set?
// Measures, all on 512x512 grayscale (centre crop):
//  - Bandt-Pompe 2D ordinal patterns, 2x2 windows (24 patterns): normalized permutation entropy H (0..1) and
//    Jensen-Shannon statistical complexity C (Ribeiro et al. 2012). Noise: H=1, C=0. Smooth/regular: low H, low C.
//    Ties are broken by position (stable order), the usual convention; the share of tied windows is reported.
//  - Box-counting dimension of the edge map (Sobel magnitude above its 90th percentile), boxes 2..128.
//  - Power-spectrum slope: radially averaged |FFT|^2 against frequency, log-log fit over frequencies 4..128.
const fs = require('fs'), path = require('path');
const dir = process.argv[2];
const N = 512;

function load(name) {
  const b = fs.readFileSync(path.join(dir, name + '.raw'));
  const w = b.readInt32LE(0), h = b.readInt32LE(4);
  const ox = Math.floor((w - N) / 2), oy = Math.floor((h - N) / 2);
  const a = new Float64Array(N * N);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) a[y * N + x] = b[8 + (y + oy) * w + (x + ox)];
  return a;
}

// controls
let seed = 12345;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const noise = Float64Array.from({ length: N * N }, () => Math.floor(rand() * 256));
const gradient = Float64Array.from({ length: N * N }, (_, i) => Math.round(((i % N) + Math.floor(i / N)) / (2 * N - 2) * 255));
const e = Math.E, phi = (1 + Math.sqrt(5)) / 2, g = 1 / phi, d = 0.5;
const fic = new Float64Array(N * N);
{
  let lo = Infinity, hi = -Infinity;
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const x = -2 * Math.PI + (4 * Math.PI * i) / (N - 1), y = -2 * Math.PI + (4 * Math.PI * j) / (N - 1), t = 0;
    const v = Math.sin(e * x) * Math.cos(phi * y) * Math.exp(-g * t) + Math.cos(e * y) * Math.sin(phi * x) * Math.exp(-g * t)
      + d * Math.sin(g * x * y) * Math.cos(d * e * y * t) * Math.exp(-g * Math.sqrt(x * x + y * y));
    fic[j * N + i] = v; lo = Math.min(lo, v); hi = Math.max(hi, v);
  }
  for (let k = 0; k < fic.length; k++) fic[k] = Math.round((fic[k] - lo) / (hi - lo) * 255);
}

function ordinal(a) {
  const counts = new Float64Array(24);
  const perms = [];
  (function gen(p, rest) { if (!rest.length) { perms.push(p.join('')); return; } rest.forEach((r, k) => gen([...p, r], rest.filter((_, m) => m !== k))); })([], [0, 1, 2, 3]);
  const index = Object.fromEntries(perms.map((p, k) => [p, k]));
  let ties = 0, total = 0;
  for (let y = 0; y < N - 1; y++) for (let x = 0; x < N - 1; x++) {
    const v = [a[y * N + x], a[y * N + x + 1], a[(y + 1) * N + x], a[(y + 1) * N + x + 1]];
    if (new Set(v).size < 4) ties++;
    const order = [0, 1, 2, 3].sort((p, q) => v[p] - v[q] || p - q);
    counts[index[order.join('')]]++; total++;
  }
  const P = Array.from(counts, c => c / total);
  const S = q => -q.reduce((s, x) => s + (x > 0 ? x * Math.log(x) : 0), 0);
  const M = 24, Pe = Array(M).fill(1 / M);
  const H = S(P) / Math.log(M);
  const J = S(P.map((p, k) => (p + Pe[k]) / 2)) - S(P) / 2 - S(Pe) / 2;
  const Q0 = -2 / (((M + 1) / M) * Math.log(M + 1) - 2 * Math.log(2 * M) + Math.log(M));
  return { H, C: Q0 * J * H, ties: ties / total };
}

function boxDim(a) {
  const mag = new Float64Array(N * N);
  for (let y = 1; y < N - 1; y++) for (let x = 1; x < N - 1; x++) {
    const p = (dx, dy) => a[(y + dy) * N + (x + dx)];
    const gx = -p(-1, -1) - 2 * p(-1, 0) - p(-1, 1) + p(1, -1) + 2 * p(1, 0) + p(1, 1);
    const gy = -p(-1, -1) - 2 * p(0, -1) - p(1, -1) + p(-1, 1) + 2 * p(0, 1) + p(1, 1);
    mag[y * N + x] = Math.hypot(gx, gy);
  }
  const sorted = Array.from(mag).sort((p, q) => p - q);
  const thr = sorted[Math.floor(0.9 * sorted.length)];
  const pts = [];
  for (let s = 2; s <= 128; s *= 2) {
    let n = 0;
    for (let by = 0; by < N; by += s) for (let bx = 0; bx < N; bx += s) {
      let hit = false;
      for (let y = by; y < by + s && !hit; y++) for (let x = bx; x < bx + s; x++) if (mag[y * N + x] > thr) { hit = true; break; }
      if (hit) n++;
    }
    pts.push([Math.log(1 / s), Math.log(Math.max(n, 1))]);
  }
  return slope(pts);
}

function slope(pts) {
  const n = pts.length, mx = pts.reduce((s, p) => s + p[0], 0) / n, my = pts.reduce((s, p) => s + p[1], 0) / n;
  let sxy = 0, sxx = 0;
  for (const [x, y] of pts) { sxy += (x - mx) * (y - my); sxx += (x - mx) ** 2; }
  return sxy / sxx;
}

function fft1(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = -2 * Math.PI / len;
    for (let i = 0; i < n; i += len) for (let k = 0; k < len / 2; k++) {
      const wr = Math.cos(ang * k), wi = Math.sin(ang * k);
      const ur = re[i + k], ui = im[i + k];
      const vr = re[i + k + len / 2] * wr - im[i + k + len / 2] * wi, vi = re[i + k + len / 2] * wi + im[i + k + len / 2] * wr;
      re[i + k] = ur + vr; im[i + k] = ui + vi; re[i + k + len / 2] = ur - vr; im[i + k + len / 2] = ui - vi;
    }
  }
}

function spectrumSlope(a) {
  const mean = a.reduce((s, x) => s + x, 0) / a.length;
  const re = Array.from({ length: N }, (_, y) => Float64Array.from({ length: N }, (_, x) => a[y * N + x] - mean));
  const im = Array.from({ length: N }, () => new Float64Array(N));
  for (let y = 0; y < N; y++) fft1(re[y], im[y]);
  for (let x = 0; x < N; x++) {
    const cr = Float64Array.from({ length: N }, (_, y) => re[y][x]), ci = Float64Array.from({ length: N }, (_, y) => im[y][x]);
    fft1(cr, ci);
    for (let y = 0; y < N; y++) { re[y][x] = cr[y]; im[y][x] = ci[y]; }
  }
  const sum = new Float64Array(N), cnt = new Float64Array(N);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const fy = y < N / 2 ? y : y - N, fx = x < N / 2 ? x : x - N;
    const r = Math.round(Math.hypot(fx, fy));
    if (r > 0 && r < N / 2) { sum[r] += re[y][x] ** 2 + im[y][x] ** 2; cnt[r]++; }
  }
  const pts = [];
  for (let r = 4; r <= 128; r++) if (cnt[r] && sum[r] > 0) pts.push([Math.log(r), Math.log(sum[r] / cnt[r])]);
  return slope(pts);
}

const set = [
  ['imprint: spiral (image4.webp)', load('imprint_spiral')],
  ['imprint: DALL-E 2025-03-16', load('imprint_dalle')],
  ['photo: the card', load('photo_card')],
  ['control: your FIC field', fic],
  ['control: noise', noise],
  ['control: smooth gradient', gradient],
];
console.log('image'.padEnd(32), 'entropy H', ' complexity C', ' ties', ' edge dim', ' spectrum slope');
for (const [name, a] of set) {
  const o = ordinal(a);
  console.log(name.padEnd(32), o.H.toFixed(3).padStart(9), o.C.toFixed(4).padStart(13), o.ties.toFixed(2).padStart(5), boxDim(a).toFixed(3).padStart(9), spectrumSlope(a).toFixed(2).padStart(15));
}
