#!/usr/bin/env node
/* imprint-measure — do a set of images made under one process differ measurably from
 * same-generator images made from ordinary prompts?
 *
 * ── WHAT THIS IS AND WHAT IT IS NOT ─────────────────────────────────────────────────────────────
 *
 * This is the measurement harness for P-FIC (`exo_memory/librarian/2026-08-30.md:97`). It takes two
 * directories of PNGs, scores four standard image statistics on each, and asks whether the smaller
 * set's MEDIAN sits outside what the larger set's spread produces by chance. It answers nothing
 * about what the images are, and the builder deliberately has not read the transcript that says.
 *
 * IT IMPLEMENTS THE AMENDED PREREG, NOT THE ORIGINAL. As first registered, FAIL required the test
 * images inside the middle 80% of the control spread ON EVERY MEASURE — so the claim SUCCEEDED the
 * moment one measure separated. Seven images against a 10th–90th band puts ~1.4 outside per measure
 * by chance; ~5.6 out-of-band scores across four measures before any real effect exists. The seat
 * caught that and amended before a pixel was touched:
 *
 *     GROUP-LEVEL statistic — the test set's median per measure against a permutation null drawn
 *     from the controls — with a correction across the four measures. FAIL = no measure's corrected
 *     group statistic clears the registered threshold (alpha = 0.05, family-wise).
 *
 * ── THE FOUR MEASURES (all on one normalised image, so they are correlated by construction) ──────
 *
 * Every image is decoded, converted to Rec.601 luma, centre-cropped to a square (so aspect ratio
 * cannot masquerade as spectral anisotropy), and area-averaged to SIZE x SIZE (default 512, a power
 * of two because the spectrum needs radix-2). All four numbers come off that one array.
 *
 *   fractal_dimension   Sobel gradient magnitude, thresholded at its own 90th percentile so the
 *                       edge FRACTION is fixed at 10% and the measure sees spatial ARRANGEMENT
 *                       rather than contrast. Box-counting over s in {2,4,8,16,32,64}; slope of
 *                       log N(s) against log(1/s). A line scores ~1, a space-filling scatter ~2.
 *   spectral_slope      Hann-windowed, mean-subtracted 2D FFT; power radially averaged into integer
 *                       radius bins; least-squares slope of log10 P against log10 f over
 *                       f in [4, SIZE/8]. Synthetic f^-beta noise recovers ~ -beta (asserted in the
 *                       test file, not assumed here).
 *   ms_entropy          Per-image z-score, clipped to [-3,3]; block-mean coarse-grained at scales
 *                       {1,2,4,8}; 64-bin Shannon entropy at each; the mean of the four. It mixes
 *                       the LEVEL of entropy with the RATE it falls under coarse-graining — a known
 *                       conflation, stated because an unnamed one is worse.
 *   compression         zlib deflate level 9 of the uint8 normalised array, length / (SIZE*SIZE).
 *                       Depends on the zlib build, which is recorded in the report; only WITHIN-run
 *                       comparison is meaningful.
 *
 * ── BLINDING, STRUCTURAL RATHER THAN CONVENTIONAL ───────────────────────────────────────────────
 *
 * Three independent mechanisms, because a convention is a promise and this had to be a wall:
 *
 *   1. `measureImage()` is a pure function of ONE image's bytes. There is no argument, field or
 *      global through which a group label could reach it. It cannot condition on group because the
 *      group is not in its universe.
 *   2. The measuring stage runs in a SEPARATE PROCESS whose argv is built by `buildMeasureArgv()`
 *      and validated by `assertBlindArgv()` — every non-flag element must be one of exactly three
 *      allowed paths — and whose environment is built by `buildMeasureEnv()`, an explicit four-key
 *      whitelist rather than a filtered copy of this one. Its corpus contains only hash-named
 *      files; `assertBlindCorpus()` refuses anything that is not /^[0-9a-f]{16}\.png$/.
 *   3. An ORDER INTERLOCK: `loadKeySealed()` throws unless the measurement digest has already been
 *      recorded. Labels are physically unreadable until the numbers are frozen on disk and hashed.
 *
 * ── TWO NULLS, ONE DECISION ─────────────────────────────────────────────────────────────────────
 *
 * The registered wording is "the test set's MEDIAN per measure against a permutation null drawn
 * from the controls", so `control-subset` is the DEFAULT and the DECIDING rule: draw n_test values
 * from the controls without replacement, take the median, repeat; two-sided p against that null's
 * own centre.
 *
 * `pooled` — the ordinary label permutation over the union, statistic median(test) - median(control)
 * — is computed and printed alongside because it is exact under exchangeability and has far finer
 * resolution. IT IS DESCRIPTIVE. It never enters the decision unless `--rule pooled` is passed
 * deliberately, because choosing the rule after seeing both is the forking path this whole file
 * exists to close.
 *
 * ── AND THE REGISTERED RULE IS MISCALIBRATED. MEASURED, NOT ARGUED. ─────────────────────────────
 *
 * The builder ran the null-split validation the packet asked for, and it came back a false positive.
 * Isolated with NO IMAGE CODE AT ALL — 27 iid standard normals, split 7/20 at random, 3000 times:
 *
 *     rule             fires at alpha=0.05      fires at alpha=0.0125 (Holm's operating point)
 *     control-subset   0.1820                   0.0960
 *     pooled           0.0460                   0.0120
 *     nominal          0.0500                   0.0125
 *
 * The registered rule is wrong by ~7.7x at the threshold Holm actually uses. The cause is structural
 * and was foreseeable: a subset median drawn WITHOUT replacement from a finite control pool is less
 * variable than a fresh sample of the same size, AND the null is centred on the control pool's own
 * sampling error while the observed test median carries its own — so the null is too narrow and
 * mis-centred at once. Holm cannot rescue it; Holm assumes the p-values it corrects are valid.
 *
 * THIS IS NOT TUNED AROUND. The default stays `control-subset`, because changing a registered
 * decision rule is the registering seat's call and not the builder's. What the builder did instead:
 *
 *   * `calibrationCheck()` runs on EVERY real run, at that run's OWN n, on two distributions
 *     (Gaussian and a skewed exponential), and asks the only correlation-free question there is —
 *     does a rule that promises p <= x deliver p <= x at rate x?
 *   * If the deciding rule fails, preflight REFUSES and names `--accept-miscalibrated-rule`. A
 *     p-value known to be wrong by 7.7x is not a number this tool will print a decision from
 *     without someone typing that they want it anyway.
 *   * `--rule pooled` passes calibration and is the builder's recommendation to the seat that
 *     registered the other one. That recommendation is not a change; it is a hand-back.
 *
 * A rule that FAILS on Gaussians has failed. A rule that PASSES is necessary, not sufficient — the
 * pooled permutation's exactness under exchangeability is a theorem, the calibration is a check.
 *
 * ── THE CORRECTION: HOLM–BONFERRONI, AND WHY ────────────────────────────────────────────────────
 *
 * The claim is confirmatory — one claim, four probes — so the thing to control is the FAMILY-WISE
 * error rate, not the false-discovery rate: a single spurious measure would be reported as "the
 * imprints separate". Holm is valid under ARBITRARY dependence, which matters because all four
 * measures are functions of the same pixels and are certainly correlated; Benjamini–Hochberg's
 * standard proof wants positive regression dependence nobody here has established. Holm uniformly
 * dominates plain Bonferroni, so there is no reason to use the weaker one. The cost is real and is
 * stated: with correlated measures Holm is conservative, so this errs toward FAIL — the right
 * direction for a claim, the wrong one for a null, and the reason `--validate` also prints power.
 *
 * ── REFUSALS BUILT IN ───────────────────────────────────────────────────────────────────────────
 *
 *   * If 4 x the smallest attainable p exceeds alpha, the design CANNOT return a positive at these
 *     n regardless of effect size, and preflight refuses rather than running something decorative.
 *   * If the two sets differ in file-format composition or bit depth, preflight refuses: a codec
 *     boundary between the groups means the spectrum measure detects the encoder, not the image.
 *   * If any two files hash identically, preflight refuses; a duplicate across sets is not a datum.
 *   * A grep, a run and a green are not the same thing. Acceptance for this tool is mutation
 *     (`imprint-measure.test.js`), reported as applied / caught / NOT APPLIED.
 *
 * NO NETWORK. Nothing here opens a socket; the only I/O is the paths named on the command line.
 *
 * ── USAGE ───────────────────────────────────────────────────────────────────────────────────────
 *
 *   node imprint-measure.js --test <dir> --control <dir> --out <dir> [--size 512] [--iters 20000]
 *                           [--seed 1] [--alpha 0.05] [--rule control-subset|pooled]
 *   node imprint-measure.js --validate --out <dir>          synthetic validation, no real images
 *   node imprint-measure.js --measure-only --corpus <dir> --measures-out <file> --size <n>
 *                                                          the blind child stage; not for humans
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const MEASURES = ['fractal_dimension', 'spectral_slope', 'ms_entropy', 'compression'];

// ── deterministic randomness ────────────────────────────────────────────────────────────────────
// Every random number in this file comes from here, seeded from the command line and printed in
// the report, so a permutation p-value is re-derivable to the bit.

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Sub-streams: derived so that changing one stage's iteration count cannot move another's numbers.
function subSeed(seed, tag) {
  const h = crypto.createHash('sha256').update(String(seed) + '/' + tag).digest();
  return h.readUInt32BE(0);
}

function shuffleInPlace(arr, rng) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}

// ── small statistics ────────────────────────────────────────────────────────────────────────────

function median(values) {
  const a = Array.prototype.slice.call(values).sort((x, y) => x - y);
  if (a.length === 0) return NaN;
  const m = a.length >> 1;
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}

function mean(values) {
  let s = 0;
  for (let i = 0; i < values.length; i++) s += values[i];
  return s / values.length;
}

function stdev(values) {
  const m = mean(values);
  let s = 0;
  for (let i = 0; i < values.length; i++) s += (values[i] - m) * (values[i] - m);
  return Math.sqrt(s / Math.max(1, values.length - 1));
}

function quantile(sorted, q) {
  if (sorted.length === 0) return NaN;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos), hi = Math.ceil(pos);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

// Holm–Bonferroni step-down. Returns adjusted p-values in the INPUT order.
// The running max is not decoration: without it a later hypothesis can be declared significant
// while an earlier, smaller one is not, which is not a valid step-down procedure.
function holmAdjust(pvals) {
  const m = pvals.length;
  const order = pvals.map((p, i) => [p, i]).sort((a, b) => a[0] - b[0]);
  const out = new Array(m);
  let running = 0;
  for (let r = 0; r < m; r++) {
    const adj = Math.min(1, order[r][0] * (m - r));
    running = Math.max(running, adj);
    out[order[r][1]] = running;
  }
  return out;
}

function chooseCapped(n, k) {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 0; i < k; i++) {
    r = r * (n - i) / (i + 1);
    if (!isFinite(r) || r > 1e15) return 1e15;
  }
  return Math.round(r);
}

// ── the two nulls ───────────────────────────────────────────────────────────────────────────────

// Registered rule. Statistic: median of the test set. Null: medians of size-n_test subsets drawn
// from the controls WITHOUT replacement. Two-sided about the null's own centre.
function controlSubsetTest(testVals, controlVals, iters, rng) {
  const nt = testVals.length, nc = controlVals.length;
  if (nc < nt) throw new Error('control-subset null needs at least as many controls as test images');
  const obs = median(testVals);
  const idx = new Array(nc);
  for (let i = 0; i < nc; i++) idx[i] = i;
  const nulls = new Float64Array(iters);
  const draw = new Array(nt);
  for (let it = 0; it < iters; it++) {
    for (let i = 0; i < nt; i++) {
      const j = i + Math.floor(rng() * (nc - i));
      const t = idx[i]; idx[i] = idx[j]; idx[j] = t;
      draw[i] = controlVals[idx[i]];
    }
    nulls[it] = median(draw);
  }
  const centre = median(nulls);
  const d = Math.abs(obs - centre);
  let ge = 0;
  for (let i = 0; i < iters; i++) if (Math.abs(nulls[i] - centre) >= d - 1e-12) ge++;
  // The +1 in both places is not cosmetic: it is what keeps p from ever being 0, which no finite
  // permutation test is entitled to report.
  return { statistic: obs, centre, p: (ge + 1) / (iters + 1), nulls: Array.from(nulls) };
}

// Descriptive rule. Statistic: median(test) - median(control). Null: label permutation over the
// union. Exact under exchangeability; far finer resolution than the subset null.
function pooledPermutationTest(testVals, controlVals, iters, rng) {
  const nt = testVals.length;
  const all = testVals.concat(controlVals);
  const N = all.length;
  const obs = median(testVals) - median(controlVals);
  const idx = new Array(N);
  for (let i = 0; i < N; i++) idx[i] = i;
  const nulls = new Float64Array(iters);
  const a = new Array(nt), b = new Array(N - nt);
  for (let it = 0; it < iters; it++) {
    shuffleInPlace(idx, rng);
    for (let i = 0; i < nt; i++) a[i] = all[idx[i]];
    for (let i = nt; i < N; i++) b[i - nt] = all[idx[i]];
    nulls[it] = median(a) - median(b);
  }
  const d = Math.abs(obs);
  let ge = 0;
  for (let i = 0; i < iters; i++) if (Math.abs(nulls[i]) >= d - 1e-12) ge++;
  return { statistic: obs, centre: 0, p: (ge + 1) / (iters + 1), nulls: Array.from(nulls) };
}

const RULES = { 'control-subset': controlSubsetTest, 'pooled': pooledPermutationTest };

// ── calibration: does a rule that promises p <= x deliver p <= x at rate x? ──────────────────────
//
// This is the only question about a decision rule that can be asked WITHOUT knowing how the four
// measures correlate, and it is asked at the run's own n on data with no effect in it. Two
// distributions, because a rule can be accidentally right on one shape: standard normal, and a
// deliberately skewed, heavy-right exponential. The pooled permutation is exact for BOTH by
// theorem; the registered control-subset rule is exact for neither, and the number below is how
// far off it is at the n in front of us.

function drawGaussian(rng) {
  let u = 0, v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
function drawExponential(rng) {
  let u = 0;
  while (u === 0) u = rng();
  return -Math.log(u);
}
const CALIBRATION_DISTRIBUTIONS = { gaussian: drawGaussian, exponential: drawExponential };

function calibrationCheck(nt, nc, opts) {
  const N = nt + nc;
  const trials = opts.calTrials, iters = opts.calIters;
  // Holm's most stringent operating point is alpha / m; the plain alpha is reported alongside.
  const points = [opts.alpha / MEASURES.length, opts.alpha];
  const out = { n_test: nt, n_control: nc, trials, iters, points, rules: {} };
  for (const ruleName of Object.keys(RULES)) {
    const rule = RULES[ruleName];
    out.rules[ruleName] = { distributions: {} };
    for (const dName of Object.keys(CALIBRATION_DISTRIBUTIONS)) {
      const draw = CALIBRATION_DISTRIBUTIONS[dName];
      const R = mulberry32(subSeed(opts.seed, 'calibrate/' + ruleName + '/' + dName + '/' + nt + '/' + nc));
      const hits = points.map(() => 0);
      for (let k = 0; k < trials; k++) {
        const all = new Array(N);
        for (let i = 0; i < N; i++) all[i] = draw(R);
        const idx = new Array(N);
        for (let i = 0; i < N; i++) idx[i] = i;
        shuffleInPlace(idx, R);
        const t = idx.slice(0, nt).map((i) => all[i]);
        const c = idx.slice(nt).map((i) => all[i]);
        const p = rule(t, c, iters, mulberry32(subSeed(opts.seed, 'cal/' + ruleName + '/' + dName + '/' + k))).p;
        for (let j = 0; j < points.length; j++) if (p <= points[j]) hits[j]++;
      }
      const realised = hits.map((h) => h / trials);
      // 95% lower bound on the realised rate (normal approximation, floored at 0). A rule is called
      // miscalibrated only when the LOWER bound is above nominal, so sampling noise cannot condemn
      // a rule that is actually fine.
      const lower = realised.map((r) => Math.max(0, r - 1.96 * Math.sqrt(Math.max(r, 1 / trials) * (1 - r) / trials)));
      const fails = points.map((pt, j) => lower[j] > pt);
      out.rules[ruleName].distributions[dName] = { realised, lower95: lower, fails };
    }
    out.rules[ruleName].miscalibrated = Object.values(out.rules[ruleName].distributions)
      .some((d) => d.fails.some(Boolean));
  }
  return out;
}

// ── PNG ─────────────────────────────────────────────────────────────────────────────────────────
// Written here rather than pulled in, because the packet forbids network and the repo has no
// dependency tree. JPEG is deliberately NOT supported: there is no decoder here, and more to the
// point a codec boundary between the two groups would let the spectrum measure detect the encoder.

let CRC_TABLE = null;
function crc32(buf) {
  if (!CRC_TABLE) {
    CRC_TABLE = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      CRC_TABLE[n] = c;
    }
  }
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function decodePng(buf) {
  if (buf.length < 8 || buf.readUInt32BE(0) !== 0x89504E47 || buf.readUInt32BE(4) !== 0x0D0A1A0A) {
    throw new Error('not a PNG (only PNG is supported; convert losslessly and say so in the report)');
  }
  let pos = 8, ihdr = null, plte = null;
  const idat = [];
  while (pos + 8 <= buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.slice(pos + 8, pos + 8 + len);
    pos += 12 + len;
    if (type === 'IHDR') {
      ihdr = {
        width: data.readUInt32BE(0), height: data.readUInt32BE(4),
        bitDepth: data[8], colorType: data[9],
        compression: data[10], filter: data[11], interlace: data[12],
      };
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'PLTE') plte = data;
    else if (type === 'IEND') break;
  }
  if (!ihdr) throw new Error('PNG has no IHDR');
  if (ihdr.interlace !== 0) throw new Error('interlaced PNG not supported — re-save non-interlaced');
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ihdr.colorType];
  if (channels === undefined) throw new Error('unsupported PNG colour type ' + ihdr.colorType);
  if (ihdr.colorType === 3 && ihdr.bitDepth !== 8) throw new Error('only 8-bit palette PNG supported');
  if (ihdr.colorType !== 3 && ihdr.bitDepth !== 8 && ihdr.bitDepth !== 16) {
    throw new Error('only 8- or 16-bit PNG supported, got ' + ihdr.bitDepth);
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const bytesPerSample = ihdr.bitDepth === 16 ? 2 : 1;
  const bpp = channels * bytesPerSample;
  const rowBytes = ihdr.width * bpp;
  const out = Buffer.alloc(ihdr.height * rowBytes);
  let rp = 0;
  for (let y = 0; y < ihdr.height; y++) {
    const filter = raw[rp++];
    const row = raw.slice(rp, rp + rowBytes); rp += rowBytes;
    const cur = out.slice(y * rowBytes, (y + 1) * rowBytes);
    const prev = y > 0 ? out.slice((y - 1) * rowBytes, y * rowBytes) : null;
    for (let x = 0; x < rowBytes; x++) {
      const a = x >= bpp ? cur[x - bpp] : 0;
      const b = prev ? prev[x] : 0;
      const c = (prev && x >= bpp) ? prev[x - bpp] : 0;
      let v = row[x];
      if (filter === 1) v = (v + a) & 0xFF;
      else if (filter === 2) v = (v + b) & 0xFF;
      else if (filter === 3) v = (v + ((a + b) >> 1)) & 0xFF;
      else if (filter === 4) v = (v + paeth(a, b, c)) & 0xFF;
      else if (filter !== 0) throw new Error('unknown PNG filter ' + filter);
      cur[x] = v;
    }
  }
  // to Rec.601 luma, 0..255. Alpha is IGNORED rather than composited: a transparent region reads
  // as its stored colour. Stated because it is a choice, not a law.
  const gray = new Float64Array(ihdr.width * ihdr.height);
  const s16 = ihdr.bitDepth === 16;
  const rd = (o) => s16 ? out.readUInt16BE(o) / 257 : out[o];
  for (let i = 0; i < gray.length; i++) {
    const o = i * bpp;
    if (ihdr.colorType === 0 || ihdr.colorType === 4) gray[i] = rd(o);
    else if (ihdr.colorType === 2 || ihdr.colorType === 6) {
      gray[i] = 0.299 * rd(o) + 0.587 * rd(o + bytesPerSample) + 0.114 * rd(o + 2 * bytesPerSample);
    } else {
      const pi = out[o] * 3;
      if (!plte || pi + 2 >= plte.length) throw new Error('palette PNG with bad or missing PLTE');
      gray[i] = 0.299 * plte[pi] + 0.587 * plte[pi + 1] + 0.114 * plte[pi + 2];
    }
  }
  return { width: ihdr.width, height: ihdr.height, gray, colorType: ihdr.colorType, bitDepth: ihdr.bitDepth };
}

function encodeGrayPng(gray8, width, height) {
  const rows = Buffer.alloc(height * (width + 1));
  for (let y = 0; y < height; y++) {
    rows[y * (width + 1)] = 0;
    for (let x = 0; x < width; x++) rows[y * (width + 1) + 1 + x] = gray8[y * width + x];
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
    const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td), 0);
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 0; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(rows, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ── image normalisation ─────────────────────────────────────────────────────────────────────────

function centreCropSquare(gray, w, h) {
  const s = Math.min(w, h);
  const x0 = (w - s) >> 1, y0 = (h - s) >> 1;
  const out = new Float64Array(s * s);
  for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) out[y * s + x] = gray[(y0 + y) * w + x0 + x];
  return { gray: out, size: s };
}

function resizeBox(src, sw, sh, dw, dh) {
  const out = new Float64Array(dw * dh);
  for (let y = 0; y < dh; y++) {
    const y0 = y * sh / dh, y1 = (y + 1) * sh / dh;
    const sy0 = Math.floor(y0), sy1 = Math.min(sh, Math.ceil(y1));
    for (let x = 0; x < dw; x++) {
      const x0 = x * sw / dw, x1 = (x + 1) * sw / dw;
      const sx0 = Math.floor(x0), sx1 = Math.min(sw, Math.ceil(x1));
      let sum = 0, wsum = 0;
      for (let sy = sy0; sy < sy1; sy++) {
        const wy = Math.min(y1, sy + 1) - Math.max(y0, sy);
        if (wy <= 0) continue;
        for (let sx = sx0; sx < sx1; sx++) {
          const wx = Math.min(x1, sx + 1) - Math.max(x0, sx);
          if (wx <= 0) continue;
          sum += src[sy * sw + sx] * wy * wx;
          wsum += wy * wx;
        }
      }
      out[y * dw + x] = wsum > 0 ? sum / wsum : 0;
    }
  }
  return out;
}

function normalise(decoded, size) {
  const sq = centreCropSquare(decoded.gray, decoded.width, decoded.height);
  const gray = sq.size === size ? sq.gray : resizeBox(sq.gray, sq.size, sq.size, size, size);
  return { gray, size, nativeWidth: decoded.width, nativeHeight: decoded.height, upscaled: sq.size < size };
}

// ── FFT (radix-2, in place) ─────────────────────────────────────────────────────────────────────

function fft(re, im, inverse) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      let t = re[i]; re[i] = re[j]; re[j] = t;
      t = im[i]; im[i] = im[j]; im[j] = t;
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = 2 * Math.PI / len * (inverse ? 1 : -1);
    const wr = Math.cos(ang), wi = Math.sin(ang);
    const half = len >> 1;
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < half; k++) {
        const ur = re[i + k], ui = im[i + k];
        const xr = re[i + k + half], xi = im[i + k + half];
        const vr = xr * cr - xi * ci;
        const vi = xr * ci + xi * cr;
        re[i + k] = ur + vr; im[i + k] = ui + vi;
        re[i + k + half] = ur - vr; im[i + k + half] = ui - vi;
        const ncr = cr * wr - ci * wi;
        ci = cr * wi + ci * wr;
        cr = ncr;
      }
    }
  }
  if (inverse) for (let i = 0; i < n; i++) { re[i] /= n; im[i] /= n; }
}

function fft2(re, im, n, inverse) {
  const rr = new Float64Array(n), ri = new Float64Array(n);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) { rr[x] = re[y * n + x]; ri[x] = im[y * n + x]; }
    fft(rr, ri, inverse);
    for (let x = 0; x < n; x++) { re[y * n + x] = rr[x]; im[y * n + x] = ri[x]; }
  }
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) { rr[y] = re[y * n + x]; ri[y] = im[y * n + x]; }
    fft(rr, ri, inverse);
    for (let y = 0; y < n; y++) { re[y * n + x] = rr[y]; im[y * n + x] = ri[y]; }
  }
}

function leastSquaresSlope(xs, ys) {
  const n = xs.length;
  const mx = mean(xs), my = mean(ys);
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) { num += (xs[i] - mx) * (ys[i] - my); den += (xs[i] - mx) * (xs[i] - mx); }
  return den === 0 ? NaN : num / den;
}

// ── the four measures ───────────────────────────────────────────────────────────────────────────

function sobelMagnitude(gray, n) {
  const mag = new Float64Array(n * n);
  const at = (y, x) => gray[Math.min(n - 1, Math.max(0, y)) * n + Math.min(n - 1, Math.max(0, x))];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const gx = -at(y - 1, x - 1) - 2 * at(y, x - 1) - at(y + 1, x - 1)
                 + at(y - 1, x + 1) + 2 * at(y, x + 1) + at(y + 1, x + 1);
      const gy = -at(y - 1, x - 1) - 2 * at(y - 1, x) - at(y - 1, x + 1)
                 + at(y + 1, x - 1) + 2 * at(y + 1, x) + at(y + 1, x + 1);
      mag[y * n + x] = Math.sqrt(gx * gx + gy * gy);
    }
  }
  return mag;
}

function edgeMap(gray, n, keepFraction) {
  const mag = sobelMagnitude(gray, n);
  const sorted = Float64Array.from(mag).sort();
  const thr = quantile(sorted, 1 - keepFraction);
  const edge = new Uint8Array(n * n);
  for (let i = 0; i < edge.length; i++) edge[i] = mag[i] > thr ? 1 : 0;
  return edge;
}

function boxCountDimension(edge, n, sizes) {
  const xs = [], ys = [];
  for (const s of sizes) {
    if (s >= n) continue;
    const nb = Math.ceil(n / s);
    const occupied = new Uint8Array(nb * nb);
    for (let y = 0; y < n; y++) {
      const by = (y / s) | 0;
      for (let x = 0; x < n; x++) {
        if (edge[y * n + x]) occupied[by * nb + ((x / s) | 0)] = 1;
      }
    }
    let count = 0;
    for (let i = 0; i < occupied.length; i++) count += occupied[i];
    if (count === 0) continue;
    xs.push(Math.log(1 / s));
    ys.push(Math.log(count));
  }
  if (xs.length < 3) return NaN;
  return leastSquaresSlope(xs, ys);
}

function spectralSlope(gray, n, fMin, fMax) {
  const re = new Float64Array(n * n), im = new Float64Array(n * n);
  const m = mean(gray);
  const win = new Float64Array(n);
  for (let i = 0; i < n; i++) win[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (n - 1)));
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) re[y * n + x] = (gray[y * n + x] - m) * win[y] * win[x];
  fft2(re, im, n, false);
  const maxR = Math.ceil(Math.SQRT2 * n / 2) + 1;
  const sum = new Float64Array(maxR), cnt = new Float64Array(maxR);
  for (let y = 0; y < n; y++) {
    const fy = y <= n / 2 ? y : y - n;
    for (let x = 0; x < n; x++) {
      const fx = x <= n / 2 ? x : x - n;
      const r = Math.round(Math.sqrt(fx * fx + fy * fy));
      if (r >= maxR) continue;
      const i = y * n + x;
      sum[r] += re[i] * re[i] + im[i] * im[i];
      cnt[r] += 1;
    }
  }
  const xs = [], ys = [];
  for (let r = fMin; r <= fMax && r < maxR; r++) {
    if (cnt[r] === 0) continue;
    const p = sum[r] / cnt[r];
    if (!(p > 0)) continue;
    xs.push(Math.log10(r));
    ys.push(Math.log10(p));
  }
  if (xs.length < 4) return NaN;
  return leastSquaresSlope(xs, ys);
}

function multiscaleEntropy(gray, n, scales, bins) {
  const m = mean(gray), sd = stdev(gray);
  const z = new Float64Array(n * n);
  for (let i = 0; i < z.length; i++) {
    const v = sd > 0 ? (gray[i] - m) / sd : 0;
    z[i] = Math.max(-3, Math.min(3, v));
  }
  const hs = [];
  for (const s of scales) {
    const nb = Math.floor(n / s);
    if (nb < 2) continue;
    const hist = new Float64Array(bins);
    let total = 0;
    for (let by = 0; by < nb; by++) {
      for (let bx = 0; bx < nb; bx++) {
        let acc = 0;
        for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) acc += z[(by * s + y) * n + bx * s + x];
        const v = acc / (s * s);
        let b = Math.floor((v + 3) / 6 * bins);
        if (b < 0) b = 0; if (b >= bins) b = bins - 1;
        hist[b] += 1; total += 1;
      }
    }
    let h = 0;
    for (let b = 0; b < bins; b++) {
      if (hist[b] === 0) continue;
      const p = hist[b] / total;
      h -= p * Math.log2(p);
    }
    hs.push(h);
  }
  return hs.length ? mean(hs) : NaN;
}

function compressionRatio(gray, n) {
  const buf = Buffer.alloc(n * n);
  for (let i = 0; i < buf.length; i++) {
    let v = Math.round(gray[i]);
    if (v < 0) v = 0; if (v > 255) v = 255;
    buf[i] = v;
  }
  return zlib.deflateSync(buf, { level: 9 }).length / (n * n);
}

// THE BLIND CORE. One image's bytes in, four numbers out. There is no parameter here through which
// a group label could arrive, which is what makes the blinding structural rather than promised.
function measureImage(fileBytes, size) {
  const decoded = decodePng(fileBytes);
  const norm = normalise(decoded, size);
  const g = norm.gray;
  const sizes = [2, 4, 8, 16, 32, 64].filter((s) => s < size);
  return {
    measures: {
      fractal_dimension: boxCountDimension(edgeMap(g, size, 0.10), size, sizes),
      spectral_slope: spectralSlope(g, size, 4, Math.max(8, Math.floor(size / 8))),
      ms_entropy: multiscaleEntropy(g, size, [1, 2, 4, 8], 64),
      compression: compressionRatio(g, size),
    },
    native: {
      width: decoded.width, height: decoded.height,
      colorType: decoded.colorType, bitDepth: decoded.bitDepth,
      upscaled: norm.upscaled,
    },
  };
}

// ── blinding machinery ──────────────────────────────────────────────────────────────────────────

const BLIND_NAME = /^[0-9a-f]{16}\.png$/;

function assertBlindCorpus(dir) {
  const entries = fs.readdirSync(dir);
  for (const e of entries) {
    if (!BLIND_NAME.test(e)) {
      throw new Error('BLIND VIOLATION: corpus contains a file that is not hash-named: ' + e);
    }
  }
  if (entries.length === 0) throw new Error('blind corpus is empty');
  return entries.sort();
}

function buildMeasureArgv(selfPath, blindDir, measuresOut, size) {
  return [selfPath, '--measure-only', '--corpus', blindDir, '--measures-out', measuresOut,
          '--size', String(size)];
}

// Every non-flag, non-numeric element of the child's argv must be one of exactly three paths.
// A mutant that slips the key file in as an extra argument dies here.
function assertBlindArgv(argv, allowed) {
  const ok = new Set([allowed.self, allowed.blindDir, allowed.measuresOut].map((p) => path.resolve(p)));
  for (const a of argv) {
    if (a.startsWith('--')) continue;
    if (/^\d+$/.test(a)) continue;
    if (!ok.has(path.resolve(a))) {
      throw new Error('BLIND VIOLATION: the measuring stage was handed an argument outside the ' +
                      'blind set: ' + a);
    }
  }
  return argv;
}

// An explicit whitelist, not a filtered copy: a filter has to think of everything, a whitelist does
// not. Nothing here can carry a label.
function buildMeasureEnv() {
  const keep = ['PATH', 'Path', 'SystemRoot', 'TEMP', 'TMP', 'HOME', 'USERPROFILE', 'COMSPEC'];
  const env = {};
  for (const k of keep) if (process.env[k] !== undefined) env[k] = process.env[k];
  return env;
}

// The order interlock. `state.measuresDigest` is set only after the measurement file exists and has
// been hashed. Until then the labels are not readable, by construction rather than by discipline.
function loadKeySealed(keyPath, state) {
  if (!state || !state.measuresDigest) {
    throw new Error('BLIND VIOLATION: labels requested before the measurements were frozen and ' +
                    'hashed. The key is not readable until measurement is complete.');
  }
  return JSON.parse(fs.readFileSync(keyPath, 'utf8'));
}

function sha256File(p) {
  return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
}

function enroll(testDir, controlDir, outDir) {
  const blindDir = path.join(outDir, 'blind');
  fs.mkdirSync(blindDir, { recursive: true });
  const key = {}, provenance = {};
  const seen = new Map();
  const groups = [['test', testDir], ['control', controlDir]];
  for (const [group, dir] of groups) {
    const files = fs.readdirSync(dir).filter((f) => !fs.statSync(path.join(dir, f)).isDirectory()).sort();
    if (files.length === 0) throw new Error('no files in ' + dir);
    for (const f of files) {
      const full = path.join(dir, f);
      const ext = path.extname(f).toLowerCase();
      if (ext !== '.png') {
        throw new Error('only PNG is accepted (' + full + '). JPEG is refused on purpose: there is ' +
                        'no decoder here, and a codec boundary between the groups would let the ' +
                        'spectrum measure detect the encoder instead of the image.');
      }
      const bytes = fs.readFileSync(full);
      const id = crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 16);
      if (seen.has(id)) {
        throw new Error('duplicate image: ' + full + ' is byte-identical to ' + seen.get(id) +
                        '. A duplicate across sets is not a datum.');
      }
      seen.set(id, full);
      // The blinded name is the content hash and nothing else. This is mechanism 1 of the blinding.
      fs.writeFileSync(path.join(blindDir, id + '.png'), bytes);
      key[id] = group;
      provenance[id] = { group, path: full, bytes: bytes.length };
    }
  }
  const keyPath = path.join(outDir, 'key.json');
  fs.writeFileSync(keyPath, JSON.stringify(key, null, 2));
  fs.writeFileSync(path.join(outDir, 'provenance.json'), JSON.stringify(provenance, null, 2));
  return { blindDir, keyPath, key, provenance };
}

// ── preflight ───────────────────────────────────────────────────────────────────────────────────

function preflight(provenance, opts) {
  const notes = [];
  const ids = Object.keys(provenance);
  const nt = ids.filter((i) => provenance[i].group === 'test').length;
  const nc = ids.length - nt;
  if (nt < 3) throw new Error('REFUSED: ' + nt + ' test images. A group median over fewer than 3 is not a group.');
  if (nc < nt) throw new Error('REFUSED: ' + nc + ' controls for ' + nt + ' test images. The registered null draws subsets of size n_test from the controls; it needs at least that many.');

  // Can this design produce a positive AT ALL? If 4 x the smallest attainable p exceeds alpha, no
  // effect size whatsoever can clear the bar, and running it would be decorative.
  const subsetSpace = chooseCapped(nc, nt);
  const floor = Math.max(1 / (opts.iters + 1), 1 / subsetSpace);
  const minCorrected = floor * MEASURES.length;
  if (minCorrected > opts.alpha) {
    throw new Error('REFUSED — THE DESIGN CANNOT RETURN A POSITIVE AT THESE n.\n' +
      '  n_test=' + nt + ' n_control=' + nc + ' gives C(' + nc + ',' + nt + ')=' + subsetSpace +
      ' distinct subsets, so the smallest attainable p is ' + floor.toFixed(5) + ';\n' +
      '  Holm across ' + MEASURES.length + ' measures makes the smallest attainable CORRECTED p ' +
      minCorrected.toFixed(4) + ', above alpha=' + opts.alpha + '.\n' +
      '  No effect of any size could clear this bar. More controls, or fewer measures.');
  }
  notes.push('resolution: C(' + nc + ',' + nt + ')=' + subsetSpace + ' subsets, ' + opts.iters +
             ' draws; smallest attainable corrected p = ' + minCorrected.toFixed(5));

  // Is the DECIDING rule entitled to the p-values it is about to print, at this n?
  const calibration = calibrationCheck(nt, nc, opts);
  const bad = calibration.rules[opts.rule].miscalibrated;
  const at = (r, d, j) => calibration.rules[r].distributions[d].realised[j].toFixed(4);
  for (const r of Object.keys(calibration.rules)) {
    notes.push('calibration ' + r + ': at nominal ' + (opts.alpha / MEASURES.length).toFixed(4) +
               ' fires gaussian=' + at(r, 'gaussian', 0) + ' exponential=' + at(r, 'exponential', 0) +
               '; at nominal ' + opts.alpha + ' fires gaussian=' + at(r, 'gaussian', 1) +
               ' exponential=' + at(r, 'exponential', 1) +
               (calibration.rules[r].miscalibrated ? '   MISCALIBRATED' : '   ok'));
  }
  if (bad && !opts.acceptMiscalibrated) {
    throw new Error('REFUSED — THE DECIDING RULE IS MISCALIBRATED AT THIS n.\n' +
      '  --rule ' + opts.rule + ' was run on ' + calibration.trials + ' null datasets with no effect ' +
      'in them, at n_test=' + nt + ' n_control=' + nc + ', and fired at\n' +
      '    gaussian    ' + at(opts.rule, 'gaussian', 0) + ' where it promises ' + (opts.alpha / MEASURES.length).toFixed(4) + '\n' +
      '    exponential ' + at(opts.rule, 'exponential', 0) + ' where it promises ' + (opts.alpha / MEASURES.length).toFixed(4) + '\n' +
      '  Holm corrects p-values; it does not repair them. A decision from this rule would be a\n' +
      '  number that does not mean what it says.\n' +
      '  --rule pooled is calibrated at this n (see the note above) and is the recommended fix.\n' +
      '  To run it anyway, and to have that choice recorded in report.json: --accept-miscalibrated-rule');
  }
  if (bad) notes.push('ACKNOWLEDGED: running a miscalibrated deciding rule at the operator\'s explicit request');
  return { nt, nc, subsetSpace, floor, minCorrected, calibration, notes };
}

// The provenance guard: if the groups differ in encoding, a difference is guaranteed and means
// nothing about the images.
function provenanceGuard(provenance, measures, allowMismatch) {
  const sig = { test: new Map(), control: new Map() };
  for (const m of measures.files) {
    const g = provenance[m.id].group;
    const k = 'colorType=' + m.native.colorType + ' bitDepth=' + m.native.bitDepth;
    sig[g].set(k, (sig[g].get(k) || 0) + 1);
  }
  const tk = new Set(sig.test.keys()), ck = new Set(sig.control.keys());
  const shared = [...tk].filter((k) => ck.has(k));
  const problem = shared.length === 0;
  const report = {
    test: Object.fromEntries(sig.test), control: Object.fromEntries(sig.control),
    disjoint: problem,
  };
  if (problem && !allowMismatch) {
    throw new Error('REFUSED: the two sets share no encoding signature (' +
      JSON.stringify(report.test) + ' vs ' + JSON.stringify(report.control) + ').\n' +
      '  A codec or bit-depth boundary between the groups means the measures detect the encoder.\n' +
      '  Re-export both sets through the same path, or pass --allow-provenance-mismatch and say so.');
  }
  // Native size is a softer confound: it changes what the resize throws away.
  const sizes = { test: [], control: [] };
  for (const m of measures.files) sizes[provenance[m.id].group].push(Math.min(m.native.width, m.native.height));
  report.native_short_side_median = { test: median(sizes.test), control: median(sizes.control) };
  const r = report.native_short_side_median.test / report.native_short_side_median.control;
  report.native_size_ratio = r;
  report.native_size_warning = (r > 2 || r < 0.5)
    ? 'the two sets differ by more than 2x in native short side; the resize is throwing away a different amount from each and every measure below is confounded with it'
    : null;
  return report;
}

// ── the measuring stage (child process) ─────────────────────────────────────────────────────────

function runMeasureOnly(corpusDir, measuresOut, size) {
  const files = assertBlindCorpus(corpusDir);
  const out = { size, node: process.version, zlib: process.versions.zlib, files: [] };
  for (const f of files) {
    const bytes = fs.readFileSync(path.join(corpusDir, f));
    const m = measureImage(bytes, size);
    out.files.push({ id: f.replace(/\.png$/, ''), measures: m.measures, native: m.native });
  }
  out.files.sort((a, b) => (a.id < b.id ? -1 : 1));
  fs.writeFileSync(measuresOut, JSON.stringify(out, null, 2));
  return out;
}

function runMeasureStage(blindDir, measuresOut, size) {
  const argv = buildMeasureArgv(__filename, blindDir, measuresOut, size);
  assertBlindArgv(argv, { self: __filename, blindDir, measuresOut });
  const r = spawnSync(process.execPath, argv, {
    encoding: 'utf8', env: buildMeasureEnv(), stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (r.status !== 0) {
    throw new Error('measuring stage failed (exit ' + r.status + '):\n' + (r.stderr || r.stdout || ''));
  }
  return JSON.parse(fs.readFileSync(measuresOut, 'utf8'));
}

// ── analysis ────────────────────────────────────────────────────────────────────────────────────

function analyse(measures, key, opts) {
  const byGroup = { test: {}, control: {} };
  for (const m of MEASURES) { byGroup.test[m] = []; byGroup.control[m] = []; }
  for (const f of measures.files) {
    const g = key[f.id];
    if (!g) throw new Error('measured image ' + f.id + ' has no group in the key');
    for (const m of MEASURES) {
      const v = f.measures[m];
      if (!isFinite(v)) throw new Error('measure ' + m + ' is not finite for ' + f.id);
      byGroup[g][m].push(v);
    }
  }
  const results = {};
  for (const m of MEASURES) {
    const t = byGroup.test[m], c = byGroup.control[m];
    const r = {};
    for (const ruleName of Object.keys(RULES)) {
      const rng = mulberry32(subSeed(opts.seed, ruleName + '/' + m));
      r[ruleName] = RULES[ruleName](t, c, opts.iters, rng);
    }
    const cs = Array.prototype.slice.call(c).sort((a, b) => a - b);
    results[m] = {
      test_values: t, control_values: c,
      test_median: median(t), control_median: median(c),
      control_p10: quantile(cs, 0.10), control_p90: quantile(cs, 0.90),
      control_sd: stdev(c),
      effect_in_control_sd: stdev(c) > 0 ? (median(t) - median(c)) / stdev(c) : NaN,
      rules: r,
    };
  }
  const decidingRule = opts.rule;
  const raw = MEASURES.map((m) => results[m].rules[decidingRule].p);
  const adj = holmAdjust(raw);
  MEASURES.forEach((m, i) => {
    results[m].p_raw = raw[i];
    results[m].p_holm = adj[i];
    results[m].separates = adj[i] <= opts.alpha;
  });
  // The descriptive rule is corrected too, so that reading it is not accidentally reading an
  // uncorrected result.
  const otherRule = decidingRule === 'control-subset' ? 'pooled' : 'control-subset';
  const rawOther = MEASURES.map((m) => results[m].rules[otherRule].p);
  const adjOther = holmAdjust(rawOther);
  MEASURES.forEach((m, i) => {
    results[m].descriptive_rule = otherRule;
    results[m].descriptive_p_raw = rawOther[i];
    results[m].descriptive_p_holm = adjOther[i];
  });
  const minAdj = Math.min.apply(null, adj);
  return {
    deciding_rule: decidingRule,
    descriptive_rule: otherRule,
    alpha: opts.alpha,
    correction: 'holm-bonferroni across ' + MEASURES.length + ' measures, family-wise',
    min_corrected_p: minAdj,
    decision: minAdj <= opts.alpha ? 'SEPARATES' : 'FAIL',
    measures: results,
  };
}

// ── plot ────────────────────────────────────────────────────────────────────────────────────────

function svgPlot(analysis) {
  const W = 900, rowH = 150, pad = 70;
  const H = pad + MEASURES.length * rowH + 40;
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const parts = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="ui-monospace,Menlo,Consolas,monospace">`);
  parts.push(`<rect width="${W}" height="${H}" fill="#ffffff"/>`);
  parts.push(`<text x="${pad}" y="30" font-size="16" fill="#111">imprint-measure — ${esc(analysis.decision)} · deciding rule ${esc(analysis.deciding_rule)} · Holm across ${MEASURES.length} measures · alpha ${analysis.alpha}</text>`);
  parts.push(`<text x="${pad}" y="50" font-size="11" fill="#666">circles = control images · triangles = test images · grey bars = permutation null of the group statistic · red line = observed</text>`);

  MEASURES.forEach((m, mi) => {
    const r = analysis.measures[m];
    const y0 = pad + mi * rowH;
    const all = r.control_values.concat(r.test_values);
    let lo = Math.min.apply(null, all), hi = Math.max.apply(null, all);
    if (hi === lo) { hi = lo + 1; }
    const span = hi - lo; lo -= span * 0.08; hi += span * 0.08;
    const X = (v) => pad + (v - lo) / (hi - lo) * (W - pad - 40);

    parts.push(`<text x="${pad}" y="${y0 + 14}" font-size="13" fill="#111">${esc(m)}</text>`);
    parts.push(`<text x="${pad + 220}" y="${y0 + 14}" font-size="11" fill="${r.separates ? '#b00' : '#666'}">p=${r.p_raw.toFixed(5)} · Holm ${r.p_holm.toFixed(5)}${r.separates ? '  SEPARATES' : ''} · effect ${isFinite(r.effect_in_control_sd) ? r.effect_in_control_sd.toFixed(2) : 'na'} control-SD</text>`);

    // null distribution of the deciding rule, as a histogram strip
    const nulls = r.rules[analysis.deciding_rule].nulls;
    const centre = r.rules[analysis.deciding_rule].centre;
    const nb = 60;
    const hist = new Array(nb).fill(0);
    for (const v of nulls) {
      // for the pooled rule the null is a DIFFERENCE; shift it to the control median so both rules
      // draw on the same axis as the raw values
      const shown = analysis.deciding_rule === 'pooled' ? v + r.control_median : v;
      const b = Math.floor((shown - lo) / (hi - lo) * nb);
      if (b >= 0 && b < nb) hist[b]++;
    }
    const hmax = Math.max.apply(null, hist) || 1;
    const bw = (W - pad - 40) / nb;
    for (let b = 0; b < nb; b++) {
      if (!hist[b]) continue;
      const h = hist[b] / hmax * 48;
      parts.push(`<rect x="${(pad + b * bw).toFixed(1)}" y="${(y0 + 100 - h).toFixed(1)}" width="${(bw - 0.5).toFixed(1)}" height="${h.toFixed(1)}" fill="#d8d8d8"/>`);
    }
    parts.push(`<line x1="${pad}" y1="${y0 + 100}" x2="${W - 40}" y2="${y0 + 100}" stroke="#999" stroke-width="1"/>`);

    for (const v of r.control_values) {
      parts.push(`<circle cx="${X(v).toFixed(1)}" cy="${y0 + 38}" r="3.5" fill="none" stroke="#3366aa" stroke-width="1.2"/>`);
    }
    for (const v of r.test_values) {
      const x = X(v);
      parts.push(`<polygon points="${x.toFixed(1)},${y0 + 56} ${(x - 5).toFixed(1)},${y0 + 66} ${(x + 5).toFixed(1)},${y0 + 66}" fill="#cc2222"/>`);
    }
    const obsX = X(analysis.deciding_rule === 'pooled' ? r.rules.pooled.statistic + r.control_median : r.test_median);
    parts.push(`<line x1="${obsX.toFixed(1)}" y1="${y0 + 30}" x2="${obsX.toFixed(1)}" y2="${y0 + 104}" stroke="#cc2222" stroke-width="1.5" stroke-dasharray="3,2"/>`);
    const cX = X(analysis.deciding_rule === 'pooled' ? r.control_median : centre);
    parts.push(`<line x1="${cX.toFixed(1)}" y1="${y0 + 92}" x2="${cX.toFixed(1)}" y2="${y0 + 108}" stroke="#333" stroke-width="1.2"/>`);
    parts.push(`<text x="${pad}" y="${y0 + 122}" font-size="10" fill="#666">${lo.toFixed(4)}</text>`);
    parts.push(`<text x="${W - 100}" y="${y0 + 122}" font-size="10" fill="#666">${hi.toFixed(4)}</text>`);
  });
  parts.push('</svg>');
  return parts.join('\n');
}

// ── report ──────────────────────────────────────────────────────────────────────────────────────

function renderText(report) {
  const L = [];
  const a = report.analysis;
  L.push('imprint-measure — ' + report.run.started);
  L.push('command: ' + report.run.command);
  L.push('');
  L.push('n_test=' + report.preflight.nt + '  n_control=' + report.preflight.nc +
         '  size=' + report.run.size + '  iters=' + report.run.iters + '  seed=' + report.run.seed);
  L.push('deciding rule: ' + a.deciding_rule + '   correction: ' + a.correction + '   alpha=' + a.alpha);
  if (report.preflight.calibration && report.preflight.calibration.rules[a.deciding_rule].miscalibrated) {
    L.push('*** THE DECIDING RULE IS MISCALIBRATED AT THIS n AND WAS RUN ANYWAY ON AN EXPLICIT FLAG.');
    L.push('*** Every p-value below is smaller than the truth. Read the calibration line.');
  }
  L.push('measurements digest (sha256 of measures.json, taken BEFORE the key was read): ' + report.run.measures_digest);
  L.push('');
  for (const n of report.preflight.notes) L.push('  · ' + n);
  if (report.provenance_guard.native_size_warning) L.push('  · WARNING: ' + report.provenance_guard.native_size_warning);
  L.push('');
  const pad = (s, n) => String(s).padEnd(n);
  L.push(pad('measure', 20) + pad('test med', 12) + pad('ctrl med', 12) + pad('ctrl 10-90', 20) +
         pad('effect(SD)', 12) + pad('p', 10) + pad('p Holm', 10) + 'verdict');
  for (const m of MEASURES) {
    const r = a.measures[m];
    L.push(pad(m, 20) + pad(r.test_median.toFixed(4), 12) + pad(r.control_median.toFixed(4), 12) +
           pad(r.control_p10.toFixed(3) + '..' + r.control_p90.toFixed(3), 20) +
           pad(isFinite(r.effect_in_control_sd) ? r.effect_in_control_sd.toFixed(2) : 'na', 12) +
           pad(r.p_raw.toFixed(5), 10) + pad(r.p_holm.toFixed(5), 10) +
           (r.separates ? 'SEPARATES' : '-'));
  }
  L.push('');
  L.push('DECISION: ' + a.decision + '   (min corrected p = ' + a.min_corrected_p.toFixed(5) + ')');
  L.push('');
  L.push('descriptive only — ' + a.descriptive_rule + ' rule, same Holm correction, NOT part of the decision:');
  for (const m of MEASURES) {
    const r = a.measures[m];
    L.push('  ' + pad(m, 20) + 'p=' + r.descriptive_p_raw.toFixed(5) + '  Holm=' + r.descriptive_p_holm.toFixed(5));
  }
  L.push('');
  L.push('Every number above re-derives from: ' + report.run.command);
  L.push('Per-image values are in report.json under analysis.measures.<measure>.{test,control}_values,');
  L.push('keyed to hashes in provenance.json. Null distributions are regenerable from seed ' + report.run.seed + '.');
  return L.join('\n');
}

// ── the run ─────────────────────────────────────────────────────────────────────────────────────

function runPipeline(opts) {
  fs.mkdirSync(opts.out, { recursive: true });
  const state = { measuresDigest: null };

  const { blindDir, keyPath, provenance } = enroll(opts.test, opts.control, opts.out);
  const pre = preflight(provenance, opts);

  const measuresPath = path.join(opts.out, 'measures.json');
  const measures = runMeasureStage(blindDir, measuresPath, opts.size);

  // Freeze, THEN unlock the labels. Not the other way round, and the interlock enforces it.
  state.measuresDigest = sha256File(measuresPath);
  const key = loadKeySealed(keyPath, state);

  const guard = provenanceGuard(provenance, measures, opts.allowProvenanceMismatch);
  const analysis = analyse(measures, key, opts);

  const report = {
    run: {
      started: new Date().toISOString(),
      command: opts.command,
      node: process.version, zlib: process.versions.zlib,
      size: opts.size, iters: opts.iters, seed: opts.seed, alpha: opts.alpha,
      measures_digest: state.measuresDigest,
      blinding: [
        'measureImage() is a pure function of one image; no label can reach it',
        'measured in a separate process, argv whitelisted by assertBlindArgv, env by buildMeasureEnv',
        'corpus is hash-named only, enforced by assertBlindCorpus',
        'key.json unreadable until measures.json was written and hashed (loadKeySealed interlock)',
      ],
    },
    preflight: pre,
    provenance_guard: guard,
    analysis,
  };
  fs.writeFileSync(path.join(opts.out, 'report.json'), JSON.stringify(report, null, 2));
  const txt = renderText(report);
  fs.writeFileSync(path.join(opts.out, 'report.txt'), txt);
  fs.writeFileSync(path.join(opts.out, 'plot.svg'), svgPlot(analysis));
  return { report, text: txt };
}

// ── synthetic images, for validation only ───────────────────────────────────────────────────────
// NO REAL IMAGE EVER ENTERS THIS REPO. These are the only images the tool is validated on.

function gaussian(rng) {
  let u = 0, v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// A field whose power spectrum is proportional to f^-beta: white noise in the Fourier domain,
// scaled by f^(-beta/2), transformed back.
function syntheticField(n, beta, rng) {
  const re = new Float64Array(n * n), im = new Float64Array(n * n);
  for (let i = 0; i < re.length; i++) re[i] = gaussian(rng);
  fft2(re, im, n, false);
  for (let y = 0; y < n; y++) {
    const fy = y <= n / 2 ? y : y - n;
    for (let x = 0; x < n; x++) {
      const fx = x <= n / 2 ? x : x - n;
      const f = Math.sqrt(fx * fx + fy * fy);
      const s = f === 0 ? 0 : Math.pow(f, -beta / 2);
      const i = y * n + x;
      re[i] *= s; im[i] *= s;
    }
  }
  fft2(re, im, n, true);
  let lo = Infinity, hi = -Infinity;
  for (let i = 0; i < re.length; i++) { if (re[i] < lo) lo = re[i]; if (re[i] > hi) hi = re[i]; }
  const out = new Uint8Array(n * n);
  for (let i = 0; i < re.length; i++) out[i] = Math.round((re[i] - lo) / (hi - lo) * 255);
  return out;
}

function writeSyntheticPng(file, n, beta, rng) {
  fs.writeFileSync(file, encodeGrayPng(syntheticField(n, beta, rng), n, n));
}

// Statistics-only re-run: measure once, then split many ways. This is what makes a false-positive
// RATE affordable — a single null split that happens to come back clean proves very little.
function decideFromValues(valuesByMeasure, testIdx, controlIdx, opts) {
  const raws = {};
  for (const rule of Object.keys(RULES)) {
    const ps = MEASURES.map((m) => {
      const t = testIdx.map((i) => valuesByMeasure[m][i]);
      const c = controlIdx.map((i) => valuesByMeasure[m][i]);
      const rng = mulberry32(subSeed(opts.seed, rule + '/' + m + '/' + testIdx.join(',')));
      return RULES[rule](t, c, opts.iters, rng).p;
    });
    raws[rule] = { raw: ps, holm: holmAdjust(ps) };
  }
  const out = {};
  for (const rule of Object.keys(raws)) {
    out[rule] = {
      min_holm: Math.min.apply(null, raws[rule].holm),
      positive: Math.min.apply(null, raws[rule].holm) <= opts.alpha,
      per_measure_holm: raws[rule].holm,
    };
  }
  return out;
}

function validate(opts) {
  const out = opts.out;
  fs.mkdirSync(out, { recursive: true });
  const size = opts.size;
  const nT = opts.vTest, nC = opts.vControl;
  const log = [];
  const say = (s) => { log.push(s); console.log(s); };

  say('imprint-measure --validate   (synthetic images only; no real image is read or written)');
  say('size=' + size + ' n_test=' + nT + ' n_control=' + nC + ' iters=' + opts.iters +
      ' splits=' + opts.vSplits + ' seed=' + opts.seed + ' alpha=' + opts.alpha);
  say('');

  // ── A. a set that genuinely differs. The instrument must find it. ──────────────────────────────
  const aDir = path.join(out, 'synthetic-A');
  const aT = path.join(aDir, 'test'), aC = path.join(aDir, 'control');
  fs.rmSync(aDir, { recursive: true, force: true });
  fs.mkdirSync(aT, { recursive: true }); fs.mkdirSync(aC, { recursive: true });
  let rng = mulberry32(subSeed(opts.seed, 'synthA'));
  for (let i = 0; i < nT; i++) writeSyntheticPng(path.join(aT, 't' + i + '.png'), size, opts.vBetaTest, rng);
  for (let i = 0; i < nC; i++) writeSyntheticPng(path.join(aC, 'c' + i + '.png'), size, opts.vBetaControl, rng);
  // A0. The calibration gate must FIRE on the registered rule before anything else is believed.
  let gateFired = false, gateMessage = '';
  try {
    runPipeline(Object.assign({}, opts, {
      rule: 'control-subset', acceptMiscalibrated: false,
      test: aT, control: aC, out: path.join(aDir, 'gate'),
      command: 'node imprint-measure.js --validate (calibration gate)',
    }));
  } catch (e) {
    gateFired = /MISCALIBRATED/.test(String(e.message));
    gateMessage = String(e.message).split('\n')[0];
  }
  say('A0 · CALIBRATION GATE on the registered rule: ' +
      (gateFired ? 'FIRED — ' + gateMessage : 'DID NOT FIRE (the rule calibrated at this n)'));
  say('');

  const aRun = runPipeline(Object.assign({}, opts, {
    rule: 'pooled',
    test: aT, control: aC, out: path.join(aDir, 'run'),
    command: 'node imprint-measure.js --validate (case A)',
  }));
  say('A · TRUE DIFFERENCE  (test beta=' + opts.vBetaTest + ' vs control beta=' + opts.vBetaControl +
      ', deciding rule pooled — the one that passes calibration)');
  say('   decision = ' + aRun.report.analysis.decision + '   min corrected p = ' +
      aRun.report.analysis.min_corrected_p.toFixed(5));
  for (const m of MEASURES) {
    const r = aRun.report.analysis.measures[m];
    say('     ' + m.padEnd(20) + 'Holm ' + r.p_holm.toFixed(5) + '  effect ' +
        (isFinite(r.effect_in_control_sd) ? r.effect_in_control_sd.toFixed(2) : 'na') + ' SD');
  }
  say('');

  // ── B. one distribution split at random. The instrument must find NOTHING — and the number that
  //      matters is the RATE over many splits, not one anecdote. ─────────────────────────────────
  const bDir = path.join(out, 'synthetic-B');
  const bAll = path.join(bDir, 'all');
  fs.rmSync(bDir, { recursive: true, force: true });
  fs.mkdirSync(bAll, { recursive: true });
  const N = nT + nC;
  rng = mulberry32(subSeed(opts.seed, 'synthB'));
  for (let i = 0; i < N; i++) writeSyntheticPng(path.join(bAll, 'x' + i + '.png'), size, opts.vBetaControl, rng);
  const bMeasureDir = path.join(bDir, 'blind');
  fs.mkdirSync(bMeasureDir, { recursive: true });
  const idOf = [];
  for (let i = 0; i < N; i++) {
    const bytes = fs.readFileSync(path.join(bAll, 'x' + i + '.png'));
    const id = crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 16);
    idOf.push(id);
    fs.writeFileSync(path.join(bMeasureDir, id + '.png'), bytes);
  }
  const bMeasures = runMeasureStage(bMeasureDir, path.join(bDir, 'measures.json'), size);
  const byId = new Map(bMeasures.files.map((f) => [f.id, f.measures]));
  const values = {};
  for (const m of MEASURES) values[m] = idOf.map((id) => byId.get(id)[m]);

  let firstSplitLine = '';
  const hits = { 'control-subset': 0, 'pooled': 0 };
  const splitRng = mulberry32(subSeed(opts.seed, 'splits'));
  for (let s = 0; s < opts.vSplits; s++) {
    const idx = []; for (let i = 0; i < N; i++) idx.push(i);
    shuffleInPlace(idx, splitRng);
    const t = idx.slice(0, nT), c = idx.slice(nT);
    const d = decideFromValues(values, t, c, opts);
    for (const rule of Object.keys(hits)) if (d[rule].positive) hits[rule]++;
    if (s === 0) {
      firstSplitLine = '   first split: control-subset min Holm p = ' + d['control-subset'].min_holm.toFixed(5) +
                       ' (' + (d['control-subset'].positive ? 'FALSE POSITIVE' : 'nothing') + ')' +
                       ', pooled ' + d.pooled.min_holm.toFixed(5) +
                       ' (' + (d.pooled.positive ? 'FALSE POSITIVE' : 'nothing') + ')';
    }
  }
  say('B · NULL SPLIT  (all ' + N + ' images from one distribution, split ' + nT + '/' + nC +
      ' at random, ' + opts.vSplits + ' times)');
  say(firstSplitLine);
  const se = (p) => Math.sqrt(p * (1 - p) / opts.vSplits);
  for (const rule of ['control-subset', 'pooled']) {
    const fpr = hits[rule] / opts.vSplits;
    const hi = fpr + 1.96 * se(Math.max(fpr, 1 / opts.vSplits));
    say('   ' + rule.padEnd(16) + 'family-wise false-positive rate = ' + hits[rule] + '/' + opts.vSplits +
        ' = ' + fpr.toFixed(4) + '   (95% upper ~ ' + hi.toFixed(4) + ', nominal ' + opts.alpha + ')');
  }
  say('');
  say('   Read this and not the single split: a rate materially above alpha means the rule is');
  say('   anti-conservative at these n and its p-values are not what they claim.');
  say('');

  // ── C. power. The honest answer to "can four measures separate anything at n=7". ──────────────
  say('C · POWER at these n, spectral_slope only, by true difference in beta');
  say('   Reported for the POOLED rule. A power number from a rule that fires at 38% under the null');
  say('   is not power, it is the same miscalibration measured from the other side.');
  const powerRows = [];
  for (const dBeta of opts.vPower) {
    let pos = 0;
    const trials = opts.vPowerTrials;
    for (let k = 0; k < trials; k++) {
      const r2 = mulberry32(subSeed(opts.seed, 'power/' + dBeta + '/' + k));
      const tv = [], cv = [];
      const tmp = path.join(bDir, 'pw');
      fs.mkdirSync(tmp, { recursive: true });
      for (let i = 0; i < nT; i++) {
        const f = path.join(tmp, 'p.png');
        writeSyntheticPng(f, size, opts.vBetaControl + dBeta, r2);
        tv.push(measureImage(fs.readFileSync(f), size).measures.spectral_slope);
      }
      for (let i = 0; i < nC; i++) {
        const f = path.join(tmp, 'p.png');
        writeSyntheticPng(f, size, opts.vBetaControl, r2);
        cv.push(measureImage(fs.readFileSync(f), size).measures.spectral_slope);
      }
      const rng3 = mulberry32(subSeed(opts.seed, 'powtest/' + dBeta + '/' + k));
      const p = pooledPermutationTest(tv, cv, opts.iters, rng3).p;
      // one measure, but corrected as it would be in the real run
      if (Math.min(1, p * MEASURES.length) <= opts.alpha) pos++;
    }
    powerRows.push([dBeta, pos, trials]);
    say('   d(beta)=' + dBeta.toFixed(2) + '   detected ' + pos + '/' + trials +
        ' = ' + (pos / trials).toFixed(2));
  }
  say('');
  say('   Power is reported for the ONE measure with a controllable ground truth. It is an upper');
  say('   bound on what the other three can do at these n, not a claim about them.');

  fs.writeFileSync(path.join(out, 'validation.txt'), log.join('\n') + '\n');
  return {
    caseA: aRun.report.analysis,
    fpr: { 'control-subset': hits['control-subset'] / opts.vSplits, pooled: hits.pooled / opts.vSplits },
    splits: opts.vSplits,
    power: powerRows,
  };
}

// ── CLI ─────────────────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const o = {
    size: 512, iters: 20000, seed: 1, alpha: 0.05, rule: 'control-subset',
    allowProvenanceMismatch: false, acceptMiscalibrated: false,
    calTrials: 2000, calIters: 999, sizeExplicit: false,
    vTest: 7, vControl: 20, vSplits: 200, vBetaControl: 2.6, vBetaTest: 3.4,
    vPower: [0.2, 0.4, 0.8], vPowerTrials: 20,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === '--test') o.test = next();
    else if (a === '--control') o.control = next();
    else if (a === '--out') o.out = next();
    else if (a === '--size') { o.size = parseInt(next(), 10); o.sizeExplicit = true; }
    else if (a === '--iters') o.iters = parseInt(next(), 10);
    else if (a === '--seed') o.seed = parseInt(next(), 10);
    else if (a === '--alpha') o.alpha = parseFloat(next());
    else if (a === '--rule') o.rule = next();
    else if (a === '--allow-provenance-mismatch') o.allowProvenanceMismatch = true;
    else if (a === '--accept-miscalibrated-rule') o.acceptMiscalibrated = true;
    else if (a === '--cal-trials') o.calTrials = parseInt(next(), 10);
    else if (a === '--cal-iters') o.calIters = parseInt(next(), 10);
    else if (a === '--validate') o.validate = true;
    else if (a === '--splits') o.vSplits = parseInt(next(), 10);
    else if (a === '--measure-only') o.measureOnly = true;
    else if (a === '--corpus') o.corpus = next();
    else if (a === '--measures-out') o.measuresOut = next();
    else if (a === '--help' || a === '-h') o.help = true;
    else throw new Error('unknown argument: ' + a);
  }
  if (!RULES[o.rule]) throw new Error('--rule must be control-subset or pooled');
  if ((o.size & (o.size - 1)) !== 0) throw new Error('--size must be a power of two (the spectrum is radix-2)');
  return o;
}

function main(argv) {
  const opts = parseArgs(argv);
  opts.command = 'node ' + path.relative(process.cwd(), __filename).replace(/\\/g, '/') + ' ' + argv.join(' ');
  if (opts.help) {
    console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0]);
    return 0;
  }
  if (opts.measureOnly) {
    if (!opts.corpus || !opts.measuresOut) throw new Error('--measure-only needs --corpus and --measures-out');
    runMeasureOnly(opts.corpus, opts.measuresOut, opts.size);
    return 0;
  }
  if (opts.validate) {
    if (!opts.out) throw new Error('--validate needs --out');
    if (!opts.sizeExplicit) opts.size = 256;
    validate(opts);
    return 0;
  }
  if (!opts.test || !opts.control || !opts.out) {
    console.error('usage: node imprint-measure.js --test <dir> --control <dir> --out <dir>');
    console.error('       node imprint-measure.js --validate --out <dir>');
    return 2;
  }
  const r = runPipeline(opts);
  console.log(r.text);
  console.log('\nwritten: ' + path.join(opts.out, 'report.json') + ', report.txt, plot.svg, measures.json');
  return r.report.analysis.decision === 'SEPARATES' ? 0 : 0;
}

if (require.main === module) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (e) {
    console.error(String(e.message || e));
    process.exit(1);
  }
}

module.exports = {
  MEASURES,
  mulberry32, subSeed, shuffleInPlace,
  median, mean, stdev, quantile, holmAdjust, chooseCapped, leastSquaresSlope,
  controlSubsetTest, pooledPermutationTest, RULES,
  crc32, decodePng, encodeGrayPng,
  centreCropSquare, resizeBox, normalise,
  fft, fft2, sobelMagnitude, edgeMap, boxCountDimension, spectralSlope, multiscaleEntropy,
  compressionRatio, measureImage,
  BLIND_NAME, assertBlindCorpus, buildMeasureArgv, assertBlindArgv, buildMeasureEnv,
  loadKeySealed, sha256File, enroll,
  preflight, provenanceGuard, runMeasureOnly, runMeasureStage, analyse, svgPlot, renderText,
  runPipeline, syntheticField, writeSyntheticPng, decideFromValues, validate,
  parseArgs, main,
};
