// GROOVE — how a performance sits against the grid, and mostly: when that cannot be answered.
//
// THE INVERSION THIS RESTS ON, and it is the keeper's. A track's BPM is published metadata.
// Computing it from audio is hard work for a worse copy of a known fact. What is NOT published is
// the FEEL — quantised or human, pushing or laying back, how much the tempo breathes. Given a
// tempo, measuring deviation from the grid it implies is a far easier problem than finding the
// tempo. Detection becomes alignment. That inversion already works for lyrics.
//
// WHAT THE MEASUREMENT PASS ESTABLISHED BEFORE ANY OF THIS WAS BUILT — the full arithmetic and
// citations are in groove-FINDINGS.md, and the short version decides the shape of this file:
//
//   · Per-onset microtiming (the 5-50 ms band where push, drag and swing live) is OUT OF REACH
//     for both fixtures we own. Not because frames are 85 ms — that reasoning is wrong, and
//     partial-frame energy recovers a SHARP onset from these same frames to 0.2 ms RMS. It is out
//     of reach because a bowed attack spans 171 ms (measured p50) and 0.07% of Adagio frames hold
//     a >6 dB jump. There is no onset time to 10 ms in this material. The limit is the ATTACK.
//   · The DISTRIBUTION of deviation is reachable at 85 ms — the frame-index estimator's scatter is
//     exactly T/sqrt(12) = 24.63 ms and material-independent, so it subtracts. But that needs
//     ~100+ sharp onsets and no fixture we own has any.
//
// So this tool does not measure microtiming, and it will not be talked into it. It asks two
// questions in order, and either can refuse:
//
//   1. IS THERE A PULSE AT ALL — windowed phase coherence against a pipeline-matched Poisson null.
//   2. IS THE TEMPO FIXED OR MOVING — one period for the whole recording versus a period free to
//      change every window, scored with the same statistic and compared. Small gap and a fixed
//      period that stands up on its own => STEADY. Gap like the rubato control's => ELASTIC.
//      Between those two calibrated regions => UNCLASSIFIED, because no verdict is earned there.
//
// Only then is a tempo CV reported. ON EVERY REAL FIXTURE WE OWN, INCLUDING A PERCUSSIVE ONE, IT
// REFUSES — and the refusals carry their numbers, which is the deliverable rather than a
// consolation prize. groove-FINDINGS.md §7 has the table and the reason for each.
//
// WHY THE GATE IS A NULL MODEL AND NOT A THRESHOLD. The tempo detector refused on 2026-07-29
// (f07dd7e) failed for a specific reason worth not repeating: it selected estimates near the
// median and then reported how tightly that subset clustered, so its confidence could not come
// out low. Here the coherence is scored against a POISSON NULL built from the file's own onset
// count and mean spacing — onsets with no pulse whatsoever, snapped to the same 85 ms grid, thinned
// by the same refractory rule, and put through the same ~360-candidate search so the
// multiple-comparison cost is priced in rather than ignored. The number the real data has to beat
// is computed from the data, not chosen by me. A Poisson process scores what it scores; if the
// music cannot beat it, the music has no pulse this instrument can see.
//
// FOUR OF MY OWN MEASURES FAILED THEIR CONTROLS before this shipped, and each failure is written at
// the function it killed: an IOI-multiple statistic that called a Poisson process a pulse; beat-
// counted windows that made a 120 bpm click track read 235; one global period that put a genuine
// rubato BELOW the pulseless null; and a confident fix that was provably a no-op. The self-test is
// what caught all four, which is why it ships as a subcommand rather than as a note.
//
// WHAT IT CANNOT DO, stated plainly because the whole point is not overselling:
//   · It cannot see swing, push or drag. Those are per-onset and they are gone. See the findings.
//   · Onset RATE IS NOT TEMPO. In music where note density is a compositional variable — both
//     fixtures — spacing that lengthens over a piece is a composer's choice, not a slowing. The
//     spacing trend is reported and explicitly NOT called tempo drift.
//   · A supplied --bpm is an INITIALISER for the pulse search, never the grid. A rounded metadata
//     BPM carries no phase and accumulates ~1.25 ms/beat at 0.3 BPM of rounding error, which is
//     larger than most of the effects anyone would want.
//   · It cannot tell a performance from a recording of one. Nothing here reaches the room.
//
//   node consonance/tools/groove.js --file <fixture.jsonl> [--bpm 120] [--gate 3.0]
//   node consonance/tools/groove.js --fixtures          both orchestral fixtures
//   node consonance/tools/groove.js --selftest          synthetic controls, incl. the ones that fail
//   node consonance/tools/groove.js --file <f> --json
'use strict';

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Pipeline geometry. These are not tunables — they are what cochlea.rs does.
// ---------------------------------------------------------------------------
const SR = 48000;
const FRAME = 4096;
const T = FRAME / SR;              // 0.08533333 s
const TMS = T * 1000;              // 85.3333 ms
const QUANT_SD_MS = TMS / Math.sqrt(12);  // 24.63 ms — the frame-index estimator's scatter

// A 3 dB rise is a DOUBLING of energy inside one frame. Chosen as a physical criterion rather
// than a tuned number, and its percentile in each fixture is reported so the choice stays
// checkable. `--gate` overrides it and `report()` sweeps neighbours to show whether the verdict
// depends on it. If a verdict moves with the gate, that is printed, not hidden.
const DEFAULT_GATE_DB = 3.0;

// Two onsets closer than this are one attack seen twice. 171 ms is the measured p50 attack span
// of the fixtures (probe: attack frames p50 = 2), so anything inside 1.5 frames is not a second
// event. Expressed in frames because that is the unit the ambiguity actually lives in.
const REFRACTORY_FRAMES = 1.5;

const FIXTURE_DIR = path.resolve(__dirname, '..', 'src-tauri', 'tests');
const FIXTURES = ['fixture-adagio-op11-956.jsonl', 'fixture-partt-fratres.jsonl'];

// ---------------------------------------------------------------------------
// Reading
// ---------------------------------------------------------------------------

// A frame whose `db` is absent is UNKNOWN, never zero and never silent. fixtures-adagio-op11.jsonl
// has no db field at all, and treating that as -inf would invent a silent piece.
function parseFixture(text) {
  const frames = [];
  let malformed = 0, missingDb = 0;
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    let o;
    try { o = JSON.parse(line); } catch { malformed++; continue; }
    if (typeof o.t !== 'number') { malformed++; continue; }
    const hasDb = typeof o.db === 'number';
    if (!hasDb) missingDb++;
    frames.push({ t: o.t, db: hasDb ? o.db : null, peaks: Array.isArray(o.peaks) ? o.peaks : [] });
  }
  return { frames, malformed, missingDb };
}

function loadFixture(file) {
  const p = path.isAbsolute(file) ? file
    : (fs.existsSync(file) ? file : path.join(FIXTURE_DIR, file));
  return Object.assign(parseFixture(fs.readFileSync(p, 'utf8')), { path: p });
}

// ---------------------------------------------------------------------------
// Format audit — the timing axis, measured rather than assumed
// ---------------------------------------------------------------------------

// The `t` field is a reported wall-clock time and it jitters (measured ~2.5 ms RMS, bimodal
// 80/90 ms). The underlying grid is regular to 0.000 ms of the nominal period over 646 s, so
// frame time is RECONSTRUCTED FROM INDEX and the jitter is simply not inherited. That is 2.5 ms
// of error removed by arithmetic. If a file's mean spacing does NOT match nominal, this says so
// instead of silently reconstructing onto a wrong grid.
function auditFrames(frames) {
  if (frames.length < 3) return { ok: false, reason: 'fewer than 3 frames' };
  const dt = [];
  for (let i = 1; i < frames.length; i++) dt.push((frames[i].t - frames[i - 1].t) * 1000);
  const meanDt = dt.reduce((p, c) => p + c, 0) / dt.length;
  const sdDt = Math.sqrt(dt.reduce((p, c) => p + (c - meanDt) ** 2, 0) / dt.length);

  // least squares t against index — slope is the true period, residual is the jitter
  const n = frames.length;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sx += i; sy += frames[i].t; sxx += i * i; sxy += i * frames[i].t; }
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const icept = (sy - slope * sx) / n;
  let s2 = 0, maxAbs = 0;
  for (let i = 0; i < n; i++) {
    const r = (frames[i].t - (icept + slope * i)) * 1000;
    s2 += r * r; maxAbs = Math.max(maxAbs, Math.abs(r));
  }
  const jitterRms = Math.sqrt(s2 / n);

  const driftMs = slope * 1000 - TMS;
  const gaps = dt.filter(d => d > meanDt * 1.8).length;
  return {
    ok: true, meanDt, sdDt, jitterRms, jitterMax: maxAbs,
    slopeMs: slope * 1000, driftMs, gaps,
    matchesNominal: Math.abs(driftMs) < 1.0,
    span: frames[frames.length - 1].t - frames[0].t,
    // reconstructed frame times: index-derived, jitter-free
    times: frames.map((_, i) => icept + slope * i),
  };
}

// ---------------------------------------------------------------------------
// Onsets
// ---------------------------------------------------------------------------

// Rise in dB frame to frame, half-wave rectified, local maxima only, refractory-limited.
// Onset time is the START of the frame carrying the rise: the onset is somewhere inside that
// frame, so the frame start is early by f*T with f~U(0,1) — a constant -T/2 bias and a scatter
// of exactly T/sqrt(12). The bias cancels in intervals; only the scatter costs anything, and it
// is material-independent, which is why this crude estimator is the honest one to build on.
function detectOnsets(frames, times, gateDb) {
  const usable = [];
  for (let i = 0; i < frames.length; i++) {
    if (frames[i].db === null) continue;
    if (frames[i].db <= -99.9) continue;      // the -100 floor is silence, not level
    usable.push({ i, t: times[i], db: frames[i].db });
  }
  const onsets = [];
  const rises = [];
  for (let k = 1; k < usable.length; k++) {
    if (usable[k].i !== usable[k - 1].i + 1) continue;   // don't rise across a silence gap
    rises.push({ k, t: usable[k].t, rise: usable[k].db - usable[k - 1].db });
  }
  for (let j = 0; j < rises.length; j++) {
    const r = rises[j];
    if (r.rise < gateDb) continue;
    if (j + 1 < rises.length && rises[j + 1].rise > r.rise) continue;  // local max of the rise
    if (onsets.length && r.t - onsets[onsets.length - 1] < REFRACTORY_FRAMES * T) continue;
    onsets.push(r.t);
  }
  const allRises = rises.map(r => r.rise).filter(v => v > 0).sort((a, b) => a - b);
  const pct = allRises.length
    ? 100 * allRises.filter(v => v < gateDb).length / allRises.length : null;
  return { onsets, nUsable: usable.length, gatePercentile: pct };
}

// ---------------------------------------------------------------------------
// The pulse gate — the part that has to be able to say no
// ---------------------------------------------------------------------------

// THE STATISTIC: windowed phase coherence (Rayleigh R).
//
// The first version of this scored IOIs against integer multiples of a candidate period, and the
// self-test killed it — a Poisson process with no pulse at all scored 0.408 against its own null's
// 0.327 and was called PULSE. The reason is worth keeping written down: an onset time carries
// 24.63 ms of scatter, so at a 451 ms beat the honest tolerance is +/-14% of a beat, and every
// frame-quantised interval is ALREADY an exact multiple of 85.33 ms. Commensurability came free
// from the grid, so the measure could not tell a pulse from a lattice.
//
// Phase coherence does not have that failure. Map each onset onto the candidate period's circle
// and take the resultant length: R = |mean(exp(2*pi*i*t/p))|. A real pulse puts every onset near
// one phase and R goes to 1. Onsets with no relationship to p spread around the circle and R
// falls to ~1/sqrt(n). Frame quantisation costs almost nothing here — 24.63 ms at a 451 ms beat is
// 0.055 cycles, which attenuates R by exp(-2*pi^2*0.055^2) = 0.94. Six percent, against a
// statistic that separates 0.9 from 0.3.
// Referenced to the window's own first onset. This is numerical hygiene only — R is the magnitude
// of a mean phasor, so a common time offset rotates every term alike and leaves R unchanged. Worth
// writing down because I first "fixed" the rubato failure here and the output came back
// byte-identical, which is what a no-op looks like when you were sure it was the bug.
function coherenceAt(onsetsSec, periodMs) {
  const p = periodMs / 1000;
  const n = onsetsSec.length;
  if (p <= 0 || n < 2) return 0;
  const t0 = onsetsSec[0];
  let sc = 0, ss = 0;
  for (const t of onsetsSec) {
    const a = 2 * Math.PI * ((t - t0) / p);
    sc += Math.cos(a); ss += Math.sin(a);
  }
  return Math.sqrt(sc * sc + ss * ss) / n;
}

// WHY WINDOWED. A global R demands one phase for the whole piece, so a genuine rubato — a pulse
// that breathes — decoheres and reads as pulseless. That would throw away the exact case this
// tool exists for. Coherence is therefore local, and the MEDIAN across windows is taken: a pulse
// that drifts stays locally coherent, while noise is incoherent everywhere. Median not mean, so a
// couple of lucky windows cannot carry a verdict.
//
// WHY WINDOWS ARE COUNTED IN ONSETS, NOT BEATS — the second thing the self-test killed. With
// windows of 8 BEATS, a short candidate period makes a short window holding fewer onsets, and R
// is upward-biased at small n (E[R] ~ 0.83/sqrt(n) under the null). The search then wins by
// choosing the period with the fewest onsets per window: the 120 bpm click track reported 235 bpm
// at R=0.998, and the Poisson null's median sat at 0.55. Fixing n across every candidate removes
// that bias entirely and makes R comparable between periods, which is the whole point of a search.
//
// n=12: the null expectation is 0.83/sqrt(12) = 0.24, well clear of a coherent ~0.9, and 12
// consecutive onsets is a short enough span that a breathing tempo barely drifts inside one.
const ONSETS_PER_WINDOW = 12;
const MIN_ONSETS_PER_WINDOW = 8;

// Search step 5 ms: well under the 24.63 ms scatter, so the candidate grid is not what limits the
// answer. Range 200-2000 ms covers 30-300 bpm. Half and double a true period score alike — they
// are the same pulse heard differently, as the refused detector already established — so a
// reported period is "a" period of the pulse, not "the" tempo.
const SEARCH_LO_MS = 200, SEARCH_HI_MS = 2000, SEARCH_STEP_MS = 5;

// THE PERIOD IS SOLVED PER WINDOW, and this is the third thing the self-test forced. Scoring every
// window against ONE global period is what a global grid does, and it destroyed the rubato control:
// on a 60->90 bpm ramp the best global period was 805 ms, so the opening windows (1000 ms beats)
// were scored against a period they never had, drifting ~2.9 whole cycles inside a single window.
// R fell to 0.230 — beneath a pulseless process. A breathing tempo has no global period BY
// DEFINITION, so asking for one guarantees the answer "no pulse" for exactly the music this tool
// is for. Each window gets its own period, which is the local re-anchoring the literature uses
// (Carter & von Appen anchor to the previous bar) and it hands back the local tempo series free.
function windowBestPeriod(win) {
  let best = { period: null, r: -1 };
  for (let p = SEARCH_LO_MS; p <= SEARCH_HI_MS; p += SEARCH_STEP_MS) {
    const r = coherenceAt(win, p);
    if (r > best.r) best = { period: p, r };
  }
  return best;
}

// Slice into fixed-onset-count windows and solve each independently. Returns the median coherence
// (the gate statistic) and the per-window periods (the local tempo series).
function windowedCoherence(onsetsSec) {
  const n = onsetsSec.length;
  const W = ONSETS_PER_WINDOW;
  if (n < MIN_ONSETS_PER_WINDOW) return { median: 0, windows: 0, periods: [], rs: [] };
  const step = Math.max(1, Math.floor(W / 2));   // 50% overlap
  const rs = [], periods = [];
  for (let a = 0; a + W <= n; a += step) {
    const b = windowBestPeriod(onsetsSec.slice(a, a + W));
    rs.push(b.r); periods.push(b.period);
  }
  if (!rs.length) {
    const b = windowBestPeriod(onsetsSec);
    return { median: b.r, windows: 0, periods: [b.period], rs: [b.r] };
  }
  const sorted = [...rs].sort((a, b) => a - b);
  return { median: sorted[Math.floor(sorted.length / 2)], windows: rs.length, periods, rs };
}

// A GLOBAL METRICAL ANCHOR, then a band-limited re-solve. The fourth thing measurement forced, and
// the first real percussive fixture is what exposed it.
//
// An unconstrained per-window search is free to jump metrical level, and it does: in Nero the search
// picked ~70 bpm in sparse intro windows and ~140 in dense drop windows, walking smoothly between
// them as the arrangement thickened. Consecutive windows agreed (drift 0.015) so nothing looked
// wrong, yet the folded range spanned 96.8-190.5 bpm — a ratio of 1.97. Octave folding cannot repair
// that, because folding maps into a window exactly ONE OCTAVE wide, so residual scatter can saturate
// the CV at ~16% by construction. The reported 16.1% for a machine-quantised dubstep track was
// measuring which metrical level the search had locked onto, i.e. arrangement density, NOT tempo.
//
// So: solve once unconstrained to find the modal period, then re-solve every window restricted to a
// band around it. A window can then express a tempo CHANGE but not a metrical JUMP, which is what
// makes the resulting CV a tempo statistic. Windows pinned to the band edge are counted and reported
// — that is the honest signal that the band, not the music, produced the answer.
const ANCHOR_BAND = 1.30;   // +/-30%: ratio 1.69, wide enough for the 60->90bpm (1.5) rubato control

function solveInBand(onsetsSec, anchorMs) {
  const lo = Math.max(SEARCH_LO_MS, anchorMs / ANCHOR_BAND);
  const hi = Math.min(SEARCH_HI_MS, anchorMs * ANCHOR_BAND);
  const W = ONSETS_PER_WINDOW;
  const step = Math.max(1, Math.floor(W / 2));
  const periods = [], rs = [];
  let clipped = 0;
  for (let a = 0; a + W <= onsetsSec.length; a += step) {
    const win = onsetsSec.slice(a, a + W);
    let best = { period: null, r: -1 };
    for (let p = lo; p <= hi; p += SEARCH_STEP_MS) {
      const r = coherenceAt(win, p);
      if (r > best.r) best = { period: p, r };
    }
    if (best.period === null) continue;
    if (best.period <= lo + SEARCH_STEP_MS || best.period >= hi - SEARCH_STEP_MS) clipped++;
    periods.push(best.period); rs.push(best.r);
  }
  return { periods, rs, clipped, clippedFrac: periods.length ? clipped / periods.length : 0, lo, hi };
}

// THE MODEL COMPARISON, and this is what actually answers "quantised or elastic".
//
// Two competing accounts of the same onsets: ONE fixed period for the whole recording, versus a
// period free to change in every window. Score both with the same windowed statistic and compare.
//   · fixed ~ free   -> a single tempo explains everything; the per-window wobble is estimator
//                       noise or changing note patterns, NOT the tempo moving. Quantised.
//   · free >> fixed  -> no single period accounts for the piece; the tempo genuinely moves. Elastic.
//
// Needed because the per-window CV alone cannot tell those apart. Nero — a produced, rigidly
// quantised dubstep track — reported CV 9.5% over a 102-164 bpm range with beautifully stable
// neighbours (drift 0.016), because the coherence-maximising period for a SYNCOPATED 12-onset window
// is not the beat, and it shifts as the arrangement changes. The wobble was real; it just was not
// tempo. A fixed-period model exposes that directly.
function globalCoherence(onsetsSec) {
  const W = ONSETS_PER_WINDOW;
  const step = Math.max(1, Math.floor(W / 2));
  if (onsetsSec.length < W) return { period: null, score: 0 };
  let best = { period: null, score: -1 };
  for (let p = SEARCH_LO_MS; p <= SEARCH_HI_MS; p += SEARCH_STEP_MS) {
    const rs = [];
    for (let a = 0; a + W <= onsetsSec.length; a += step) {
      rs.push(coherenceAt(onsetsSec.slice(a, a + W), p));
    }
    if (!rs.length) continue;
    rs.sort((x, y) => x - y);
    const med = rs[Math.floor(rs.length / 2)];
    if (med > best.score) best = { period: p, score: med };
  }
  return best;
}

function bestPulse(onsetsSec, initMs) {
  if (onsetsSec.length < MIN_ONSETS_PER_WINDOW) return null;
  const w = windowedCoherence(onsetsSec);
  // the anchor is the median of the FOLDED unconstrained solutions — a global metrical level
  const folded = foldOctaves(w.periods.filter(p => p !== null)).sort((a, b) => a - b);
  const medPeriod = folded.length ? folded[Math.floor(folded.length / 2)] : null;
  const best = { period: medPeriod, score: w.median, windows: w.windows };
  // band-limited re-solve gives the tempo series the CV is computed from
  const banded = medPeriod ? solveInBand(onsetsSec, medPeriod) : null;

  // A supplied BPM is scored — as a FIXED period across the same windows, which is what treating
  // metadata as the grid would actually do — and reported beside the search, never substituted for
  // it. If it scores far below the locally-solved answer, that gap IS the cost of trusting a
  // rounded BPM with no phase.
  let supplied = null;
  if (initMs) {
    const cands = [initMs / 2, initMs, initMs * 2].map(p => {
      const rs = [];
      const step = Math.max(1, Math.floor(ONSETS_PER_WINDOW / 2));
      for (let a = 0; a + ONSETS_PER_WINDOW <= onsetsSec.length; a += step) {
        rs.push(coherenceAt(onsetsSec.slice(a, a + ONSETS_PER_WINDOW), p));
      }
      if (!rs.length) return { period: p, score: coherenceAt(onsetsSec, p) };
      rs.sort((x, y) => x - y);
      return { period: p, score: rs[Math.floor(rs.length / 2)] };
    });
    supplied = cands.sort((a, b) => b.score - a.score)[0];
  }
  return {
    best, supplied,
    periods: w.periods, rs: w.rs,               // unconstrained: used for the metrical-ambiguity read
    banded,                                      // band-limited: used for the tempo CV
    global: globalCoherence(onsetsSec),         // the fixed-tempo rival model
  };
}

// deterministic PRNG — no Math.random, so every number this tool prints is reproducible
function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
}

// THE NULL, and it has to be PIPELINE-MATCHED or it is worse than useless. A Poisson onset
// process has no pulse by construction. It is given the same onset count and the same mean
// spacing as the real data, and then it is put through the same two distortions the detector
// imposes — snapped to the 85 ms frame grid, and thinned by the same refractory rule. The first
// version skipped the refractory step, which truncates the short end of the interval
// distribution and thereby MANUFACTURES structure; the null came out too easy and the negative
// control passed. That is the whole reason this function renders the handicap explicitly.
//
// The search over ~360 candidate periods inflates the best-of statistic, so the null runs the
// identical search. The multiple-comparison cost is therefore priced in rather than ignored.
function nullTimes(n, meanIoiMs, rng) {
  const times = [];
  let acc = 0;
  for (let i = 0; i < n; i++) {
    let u = rng(); if (u < 1e-12) u = 1e-12;
    acc += -Math.log(u) * meanIoiMs / 1000;
    times.push(acc);
  }
  // snap to the frame grid — a detected onset is always a frame start
  const snapped = times.map(t => Math.round(t / T) * T);
  // and thin by the refractory rule, exactly as detectOnsets does
  const out = [];
  for (const t of snapped) {
    if (out.length && t - out[out.length - 1] < REFRACTORY_FRAMES * T) continue;
    out.push(t);
  }
  return out;
}

function poissonNull(nOnsets, meanIoiMs, trials, seed) {
  const rng = makeRng(seed);
  const scores = [];
  for (let tr = 0; tr < trials; tr++) {
    const times = nullTimes(nOnsets, meanIoiMs, rng);
    if (times.length < MIN_ONSETS_PER_WINDOW * 2) continue;
    const r = bestPulse(times, null);
    if (r) scores.push(r.best.score);
  }
  if (!scores.length) return { n: 0, mean: null, p50: null, p95: null, p99: null, max: null };
  scores.sort((a, b) => a - b);
  const q = f => scores[Math.min(scores.length - 1, Math.floor(f * scores.length))];
  return {
    n: scores.length, mean: scores.reduce((p, c) => p + c, 0) / scores.length,
    p50: q(0.5), p95: q(0.95), p99: q(0.99), max: scores[scores.length - 1],
    scores,
  };
}

function pulseGate(onsets, opts) {
  const o = opts || {};
  const initMs = o.bpm ? 60000 / o.bpm : null;
  const trials = o.trials || 200;
  const seed = o.seed || 20260729;
  if (onsets.length < MIN_ONSETS_PER_WINDOW * 2) {
    return { verdict: 'NO DATA', onsets: onsets.length,
             reason: 'need >=' + (MIN_ONSETS_PER_WINDOW * 2) + ' onsets, have ' + onsets.length };
  }
  const iois = [];
  for (let i = 1; i < onsets.length; i++) iois.push((onsets[i] - onsets[i - 1]) * 1000);
  const meanIoi = iois.reduce((p, c) => p + c, 0) / iois.length;
  const sorted = [...iois].sort((a, b) => a - b);
  const medianIoi = sorted[Math.floor(sorted.length / 2)];

  const found = bestPulse(onsets, initMs);
  const nul = poissonNull(onsets.length, meanIoi, trials, seed);

  // The bar is the null's 99th percentile, not its 95th: with ~360 candidate periods searched and
  // a best-of statistic, p95 leaves a 1-in-20 pass rate on pure noise, and the first version of
  // this file failed exactly there. p99 with the empirical p-value printed beside it, so a
  // marginal pass is legible as marginal instead of being rounded up to a verdict.
  const bar = nul.p99;
  const passes = bar !== null && found.best.score > bar;
  const above = nul.scores ? nul.scores.filter(s => s >= found.best.score).length : null;
  const pValue = nul.scores ? (above + 1) / (nul.scores.length + 1) : null;
  return {
    verdict: passes ? 'PULSE' : 'NO PULSE',
    onsets: onsets.length, iois: iois.length, medianIoi, meanIoi,
    period: found.best.period, score: found.best.score, windows: found.best.windows,
    impliedBpm: found.best.period ? 60000 / found.best.period : null,
    supplied: found.supplied,
    null: { n: nul.n, mean: nul.mean, p50: nul.p50, p95: nul.p95, p99: nul.p99, max: nul.max },
    bar, margin: bar === null ? null : found.best.score - bar, pValue,
    localPeriods: found.periods, windowRs: found.rs, banded: found.banded,
    global: found.global,
    freeMinusFixed: found.global && found.global.score >= 0 ? found.best.score - found.global.score : null,
  };
}

// ---------------------------------------------------------------------------
// Tempo CV — only reached when the gate passes
// ---------------------------------------------------------------------------

// Local tempo re-anchored locally rather than against a global grid, because a rounded BPM has no
// phase and drifts ~1.25 ms/beat. Each window of W consecutive beats gives one tempo estimate;
// CV is the spread of those over their mean.
//
// The format's own contribution to that spread is known and reported next to it: each beat time
// carries 24.63 ms of scatter, so a W-beat window's tempo carries a floor which the CV cannot see
// beneath. A CV at or below that floor means "as steady as this instrument can resolve", NOT
// "machine-quantised" — the two are different claims and only the first is ours to make.
// OCTAVE FOLDING, and without it the CV is meaningless. A pulse and its half and its double all
// score alike — they are the same pulse heard differently — so each window's independent search
// picks whichever of them happens to win by a hair, and those choices FLIP between windows. The
// result reads as a tempo leaping between 44 and 300 bpm when the performance did nothing of the
// kind. Fratres measured CV = 0.526 that way, its local periods piled against the search rails,
// which is the same signature the refused tempo detector had (17-21 confident tempos spanning the
// whole allowed range). Folding every period into a common octave around the median separates
// metrical ambiguity from actual tempo change.
function foldOctaves(periodsMs) {
  const ps = periodsMs.filter(p => typeof p === 'number' && p > 0);
  if (!ps.length) return [];
  const sorted = [...ps].sort((a, b) => a - b);
  const ref = sorted[Math.floor(sorted.length / 2)];
  const SQRT2 = Math.SQRT2;
  return ps.map(p => {
    let v = p;
    // guard the loops: a period can be at most a few octaves from the median inside the search range
    for (let i = 0; i < 8 && v / ref > SQRT2; i++) v /= 2;
    for (let i = 0; i < 8 && ref / v > SQRT2; i++) v *= 2;
    return v;
  });
}

// RELIABILITY, measured from the estimator against itself. Consecutive windows overlap by 50% —
// they share six of their twelve onsets — so if the period estimate means anything they cannot
// disagree much. The median absolute log2 ratio between neighbours is therefore a reliability
// figure the data supplies rather than one I pick: 0 is perfect agreement, 1.0 is a neighbour
// landing an octave away. Calibrated on the synthetic controls, printed always, and used to
// withhold the CV when the series is wandering rather than tracking.
function neighbourDrift(periodsMs) {
  if (periodsMs.length < 3) return null;
  const d = [];
  for (let i = 1; i < periodsMs.length; i++) {
    if (periodsMs[i] > 0 && periodsMs[i - 1] > 0) {
      d.push(Math.abs(Math.log2(periodsMs[i] / periodsMs[i - 1])));
    }
  }
  if (!d.length) return null;
  d.sort((a, b) => a - b);
  return d[Math.floor(d.length / 2)];
}

// `bandedPeriodsMs` are the band-limited solutions the CV is computed from; `unconstrained` are the
// free solutions, used only to read off how metrically ambiguous the music is. Keeping them separate
// is the whole point: ambiguity is a property of the material and gets reported, while the CV must
// come from a series that could not jump metrical level.
function tempoCV(bandedPeriodsMs, unconstrained, clippedFrac) {
  const ps = (bandedPeriodsMs || []).filter(p => typeof p === 'number' && p > 0);
  if (ps.length < 3) return null;
  // how many windows solved to the edge of the global search range? A pile-up at a rail means the
  // estimator ran out of room rather than found something.
  const atRail = ps.filter(p => p <= SEARCH_LO_MS + SEARCH_STEP_MS
    || p >= SEARCH_HI_MS - SEARCH_STEP_MS).length;
  const railFrac = atRail / ps.length;
  // metrical ambiguity, read off the FREE solutions rather than the banded ones
  let octaveFlips = 0;
  if (unconstrained && unconstrained.length) {
    const raw = unconstrained.filter(p => typeof p === 'number' && p > 0);
    const folded = foldOctaves(raw);
    octaveFlips = raw.length
      ? raw.filter((p, i) => Math.abs(p - folded[i]) > 1e-9).length / raw.length : 0;
  }
  const drift = neighbourDrift(ps);
  const tempos = ps.map(p => 60000 / p);
  const mean = tempos.reduce((p, c) => p + c, 0) / tempos.length;
  const sd = Math.sqrt(tempos.reduce((p, c) => p + (c - mean) ** 2, 0) / (tempos.length - 1));

  // THE RESOLUTION FLOOR, derived rather than guessed. A window's period comes from
  // ONSETS_PER_WINDOW onset times each carrying the frame-index scatter of 24.63 ms. For a
  // straight-line fit of time against beat index, sd(period) = sigma / sqrt(Sxx) with
  // Sxx = W(W^2-1)/12; the 5 ms search step contributes its own uniform quantisation on top.
  const W = ONSETS_PER_WINDOW;
  const Sxx = W * (W * W - 1) / 12;
  const sdPeriod = Math.sqrt((QUANT_SD_MS * QUANT_SD_MS) / Sxx
    + (SEARCH_STEP_MS * SEARCH_STEP_MS) / 12);
  const sorted = [...ps].sort((a, b) => a - b);
  const medPeriod = sorted[Math.floor(sorted.length / 2)];
  const cvFloor = sdPeriod / medPeriod;

  return {
    n: tempos.length, meanBpm: mean, sdBpm: sd,
    cv: sd / mean, cvPct: 100 * sd / mean,
    sdPeriodMs: sdPeriod, cvFloor, cvFloorPct: 100 * cvFloor,
    resolvable: (sd / mean) > 2 * cvFloor,
    window: W,
    minBpm: Math.min(...tempos), maxBpm: Math.max(...tempos),
    railFrac, octaveFlips, drift,
    clippedFrac: typeof clippedFrac === 'number' ? clippedFrac : 0,
  };
}

// Whether the local tempo series is stable enough for its CV to mean anything. Every bar below is
// the measured envelope of the SEVEN genuine positive controls plus a margin — not a number chosen
// to make anything in particular pass or fail. What those controls actually did:
//
//   control                              at-rail   octave-folded   neighbour drift
//   click 120, 0ms jitter                   0%           0%            0.000
//   human 120, 30ms jitter                  0%           0%            0.000
//   rubato ramp 60->90                      0%           0%            0.023
//   small drift 118->122                    0%           0%            0.000
//   commensurate 117.1875                   0%           0%            0.000
//   subdivided, eighths every 2nd beat      0%           0%            0.000
//   subdivided, eighths every beat          0%           0%            0.058
//
// The subdivided controls are the load-bearing ones. I expected a real pulse carrying offbeat notes
// to need heavy octave folding, and it needs NONE: it locks the same period in every window. So
// heavy folding is not the ordinary cost of subdivision — it is the signature of a search with no
// single pulse to find, which is what makes it usable as a disqualifier.
// REVISED 2026-07-29 after the first REAL percussive fixture arrived
// (fixture-beat-nero-reaching-out.jsonl), which showed the bar above was calibrated on an
// unrepresentative envelope. Every synthetic control is metrically UNAMBIGUOUS — none of them has a
// half-time feel — so "genuine controls need 0% folding" was a fact about my synthesiser, not about
// music. The Nero fixture folds 35.3% of windows and yet its post-fold neighbour drift is 0.015,
// better than any synthetic control: the folding is real metrical ambiguity (a dubstep kick at
// half the hat rate) and folding REPAIRED it, which is what folding is for.
//
// So the two quantities measure different things and only one of them is a reliability failure:
//   · octave folding  = how metrically ambiguous the MUSIC is. A property of the material. Reported.
//   · neighbour drift = whether the ESTIMATOR is stable once folded. A property of the answer. Gated.
// Folding is withheld-on only past 50%, where the majority of windows disagree with the median
// octave and there is no majority pulse left to speak of.
//
// This does NOT weaken the guard against the failure it exists for: Fratres is withheld by the
// drift gate alone (0.094 > 0.08), independently of any octave criterion. Verified after the change.
const MAX_RAIL_FRAC = 0.05;
const MAX_CLIPPED_FRAC = 0.25;      // a quarter of windows pinned to the band edge and it is the band talking
const MAX_OCTAVE_FLIPS = 0.50;      // past half, "which pulse" has no majority answer
const MAX_NEIGHBOUR_DRIFT = 0.08;   // 1.4x the worst genuine control (0.058)

// THE CLASSIFICATION, and it only speaks inside the range the controls actually cover.
//
// Measured free-minus-fixed gaps (see groove-FINDINGS.md §7):
//   click 120 exact 0.000 | +30ms jitter 0.006 | drift 118->122 0.014 | subdivided 0.027
//   rubato 60->90bpm 0.750
//   (poisson, no pulse at all, 0.190 — so a large gap is NOT specific to rubato, which is exactly
//    why this runs only AFTER the pulse gate has already rejected pulseless material)
//
// STEADY needs the fixed-tempo model to actually stand up — to beat the pulseless null itself —
// because naming a tempo is a claim about a global period. ELASTIC needs the free model to win by
// something like the margin the rubato control won by. Between 0.05 and 0.50 there is no calibration
// and therefore no verdict: that band is reported as UNCLASSIFIED rather than rounded to the nearer
// label. Every real fixture we own lands there or below the pulse gate, and that is the finding.
const GAP_STEADY_MAX = 0.05;    // ~2x the worst steady control (0.027)
const GAP_ELASTIC_MIN = 0.50;   // 2/3 of the rubato control (0.750)

function classifyTempo(pulse) {
  if (!pulse || pulse.verdict !== 'PULSE') return { label: 'NO PULSE', ok: false };
  const gap = pulse.freeMinusFixed;
  const fixedBeatsNull = pulse.global && pulse.bar !== null && pulse.global.score > pulse.bar;
  if (gap === null) return { label: 'UNCLASSIFIED', ok: false, why: 'no fixed-model score' };
  if (gap <= GAP_STEADY_MAX && fixedBeatsNull) {
    return { label: 'STEADY', ok: true,
      why: 'one fixed period explains every window as well as a free per-window search '
        + '(gap ' + f3(gap) + ' <= ' + GAP_STEADY_MAX + '), and that fixed period beats the '
        + 'pulseless null on its own' };
  }
  if (gap >= GAP_ELASTIC_MIN) {
    return { label: 'ELASTIC', ok: true,
      why: 'no single period accounts for the piece — the free model wins by ' + f3(gap)
        + ', comparable to the 60->90bpm rubato control (0.750)' };
  }
  if (!fixedBeatsNull) {
    return { label: 'UNCLASSIFIED', ok: false,
      why: 'no single period beats the pulseless null (fixed ' + f3(pulse.global.score)
        + ' vs null p99 ' + f3(pulse.bar) + '), so no tempo can be named; and the free-minus-fixed '
        + 'gap ' + f3(gap) + ' sits in the uncalibrated middle between the steady controls '
        + '(<=0.027) and the rubato control (0.750)' };
  }
  return { label: 'UNCLASSIFIED', ok: false,
    why: 'free-minus-fixed gap ' + f3(gap) + ' falls between the steady controls (<=0.027) and the '
      + 'rubato control (0.750) — no calibrated verdict exists for this region' };
}

function cvIsTrustworthy(t) {
  if (!t) return { ok: false, why: 'no tempo series' };
  if (t.railFrac > MAX_RAIL_FRAC) {
    return { ok: false, why: f1(100 * t.railFrac) + '% of windows solved to the edge of the '
      + SEARCH_LO_MS + '-' + SEARCH_HI_MS + 'ms search range — the estimator ran out of room, it '
      + 'did not find a tempo' };
  }
  if (t.octaveFlips > MAX_OCTAVE_FLIPS) {
    return { ok: false, why: f1(100 * t.octaveFlips) + '% of windows disagreed by a whole octave '
      + 'before folding (bar ' + Math.round(100 * MAX_OCTAVE_FLIPS) + '%) — past half, the majority '
      + 'of windows dissent from the median octave, so there is no majority pulse to report a '
      + 'tempo for' };
  }
  if (t.clippedFrac > MAX_CLIPPED_FRAC) {
    return { ok: false, why: f1(100 * t.clippedFrac) + '% of windows solved to the edge of the '
      + '+/-' + Math.round(100 * (ANCHOR_BAND - 1)) + '% anchor band — the band produced the answer, '
      + 'not the music, so the spread is a floor on the tempo range rather than a measurement of it' };
  }
  if (t.drift !== null && t.drift > MAX_NEIGHBOUR_DRIFT) {
    return { ok: false, why: 'neighbouring windows share half their onsets yet disagree by a median '
      + f3(t.drift) + ' octaves (bar ' + MAX_NEIGHBOUR_DRIFT + ', worst genuine control 0.058) — '
      + 'the series is wandering, not tracking' };
  }
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Onset-spacing trend — reported, and deliberately NOT called tempo
// ---------------------------------------------------------------------------

// Does spacing between onsets lengthen or shorten across the piece? This is computable and it is
// NOT tempo drift: in music where note density is a compositional variable, spacing changes
// because the composer wrote fewer notes. The level correlation is reported beside it because a
// diminuendo alone lengthens measured spacing through a fixed dB gate — the confound has to be
// visible or the number is misleading.
function spacingTrend(onsets, frames, times) {
  if (onsets.length < 10) return null;
  const ioi = [], mid = [];
  for (let i = 1; i < onsets.length; i++) {
    ioi.push((onsets[i] - onsets[i - 1]) * 1000);
    mid.push((onsets[i] + onsets[i - 1]) / 2);
  }
  const n = ioi.length;
  const mx = mid.reduce((p, c) => p + c, 0) / n, my = ioi.reduce((p, c) => p + c, 0) / n;
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    num += (mid[i] - mx) * (ioi[i] - my); dx += (mid[i] - mx) ** 2; dy += (ioi[i] - my) ** 2;
  }
  const slope = num / dx;                 // ms of spacing per second elapsed
  const r = num / Math.sqrt(dx * dy);
  const h = Math.floor(n / 2);
  const firstHalf = ioi.slice(0, h).reduce((p, c) => p + c, 0) / h;
  const secondHalf = ioi.slice(h).reduce((p, c) => p + c, 0) / (n - h);

  // the confound: onset rate against level, in windows
  let levelCorr = null;
  const lvl = [], rate = [];
  const t0 = times[0], t1 = times[times.length - 1], NB = 20, span = (t1 - t0) / NB;
  if (span > 0) {
    for (let b = 0; b < NB; b++) {
      const a = t0 + b * span, z = a + span;
      let sum = 0, cnt = 0;
      for (let i = 0; i < frames.length; i++) {
        if (times[i] < a || times[i] >= z) continue;
        if (frames[i].db === null || frames[i].db <= -99.9) continue;
        sum += frames[i].db; cnt++;
      }
      if (!cnt) continue;
      lvl.push(sum / cnt);
      rate.push(onsets.filter(o => o >= a && o < z).length / span);
    }
    if (lvl.length > 3) {
      const ml = lvl.reduce((p, c) => p + c, 0) / lvl.length;
      const mr = rate.reduce((p, c) => p + c, 0) / rate.length;
      let nu = 0, dl = 0, dr = 0;
      for (let i = 0; i < lvl.length; i++) {
        nu += (lvl[i] - ml) * (rate[i] - mr); dl += (lvl[i] - ml) ** 2; dr += (rate[i] - mr) ** 2;
      }
      levelCorr = nu / Math.sqrt(dl * dr);
    }
  }
  return { n, slope, r, firstHalf, secondHalf, meanIoi: my, levelCorr };
}

// ---------------------------------------------------------------------------
// Synthesis — for the self-test and the unit tests. Renders real audio through the real
// pipeline geometry so the controls suffer exactly the handicap the fixtures do.
// ---------------------------------------------------------------------------

function rmsDb(buf) {
  if (!buf.length) return -100;
  let s = 0;
  for (const v of buf) s += v * v;
  const rms = Math.sqrt(s / buf.length);
  if (rms <= 1e-9) return -100;
  return Math.max(-100, 20 * Math.log10(rms));
}

// times in seconds; each hit is an instant attack with exponential decay
function renderHits(times, opts) {
  const { decayMs = 150, amp = 0.5, durPad = 1.0, attackMs = 0.1 } = opts || {};
  const last = times.length ? times[times.length - 1] : 0;
  const total = Math.floor((last + durPad) * SR);
  const x = new Float64Array(total);
  const dec = (decayMs / 1000) * SR;
  const atk = Math.max(1, (attackMs / 1000) * SR);
  for (const tt of times) {
    const on = Math.round(tt * SR);
    if (on < 0) continue;
    for (let d = 0; d < dec * 6 && on + d < total; d++) {
      const env = Math.min(1, d / atk) * Math.exp(-d / dec);
      x[on + d] += amp * env * Math.sin(2 * Math.PI * 180 * d / SR);
    }
  }
  const frames = [], ts = [];
  for (let k = 0; (k + 1) * FRAME <= total; k++) {
    frames.push({ t: k * T, db: rmsDb(x.subarray(k * FRAME, (k + 1) * FRAME)), peaks: [] });
    ts.push(k * T);
  }
  return { frames, times: ts };
}

function synthClicks(bpm, nBeats, jitterMs, seed) {
  const rng = makeRng(seed || 1);
  const period = 60 / bpm;
  const out = [];
  for (let k = 0; k < nBeats; k++) {
    let j = 0;
    if (jitterMs) {
      let u = rng(); if (u < 1e-12) u = 1e-12;
      j = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng()) * (jitterMs / 1000);
    }
    out.push(1.0 + k * period + j);
  }
  return out;
}

// tempo ramps linearly from bpmA to bpmB — a real rubato, not jitter
function synthRamp(bpmA, bpmB, nBeats) {
  const out = []; let t = 1.0;
  for (let k = 0; k < nBeats; k++) {
    out.push(t);
    const bpm = bpmA + (bpmB - bpmA) * (k / Math.max(1, nBeats - 1));
    t += 60 / bpm;
  }
  return out;
}

// A genuine pulse carrying SUBDIVISIONS — quarters with offbeat eighths on some beats. This is the
// fair positive control for octave folding: real music puts notes between beats, and if that alone
// drives heavy folding then folding is normal and cannot be used to disqualify anything.
function synthSubdivided(bpm, nBeats, everyNth) {
  const period = 60 / bpm;
  const out = [];
  for (let k = 0; k < nBeats; k++) {
    out.push(1.0 + k * period);
    if (everyNth && k % everyNth === 0) out.push(1.0 + (k + 0.5) * period);
  }
  return out.sort((a, b) => a - b);
}

// no pulse at all — the input every measure here must fail on
function synthPoisson(meanIoiMs, n, seed) {
  const rng = makeRng(seed || 7);
  const out = []; let t = 1.0;
  for (let i = 0; i < n; i++) {
    out.push(t);
    let u = rng(); if (u < 1e-12) u = 1e-12;
    t += -Math.log(u) * meanIoiMs / 1000;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Analysis of one frame series
// ---------------------------------------------------------------------------

function analyze(frames, opts) {
  const o = opts || {};
  const gate = o.gate === undefined ? DEFAULT_GATE_DB : o.gate;
  const audit = auditFrames(frames);
  if (!audit.ok) return { audit, error: audit.reason };
  const times = o.times || audit.times;
  const det = detectOnsets(frames, times, gate);
  const gateRes = pulseGate(det.onsets, o);
  const cv = gateRes.verdict === 'PULSE' && gateRes.banded
    ? tempoCV(gateRes.banded.periods, gateRes.localPeriods, gateRes.banded.clippedFrac)
    : null;
  const trend = spacingTrend(det.onsets, frames, times);
  return { audit, gate, detection: det, pulse: gateRes, tempo: cv, trend };
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

const f1 = x => (x === null || x === undefined || Number.isNaN(x) ? 'n/a' : x.toFixed(1));
const f2 = x => (x === null || x === undefined || Number.isNaN(x) ? 'n/a' : x.toFixed(2));
const f3 = x => (x === null || x === undefined || Number.isNaN(x) ? 'n/a' : x.toFixed(3));

function report(label, frames, opts) {
  const r = analyze(frames, opts);
  console.log('\n=== ' + label);
  if (r.error) { console.log('  cannot analyse: ' + r.error); return r; }

  const a = r.audit;
  console.log('  frames ' + frames.length + '   span ' + f1(a.span) + 's'
    + '   period ' + f3(a.slopeMs) + 'ms (nominal ' + f3(TMS) + ')'
    + (a.matchesNominal ? '' : '  <-- DOES NOT MATCH NOMINAL'));
  console.log('  timestamp jitter removed by index-reconstruction: '
    + f2(a.jitterRms) + 'ms rms, ' + f1(a.jitterMax) + 'ms max');

  const d = r.detection;
  console.log('  onsets: ' + d.onsets.length + ' at gate ' + f1(r.gate) + 'dB'
    + (d.gatePercentile === null ? '' : '  (gate sits at the '
      + f1(d.gatePercentile) + 'th percentile of frame-to-frame rises)'));

  // GATE SENSITIVITY. The onset gate is the one number here with any freedom in it, so the verdict
  // is re-derived at +/-1 dB and the answers printed side by side. A verdict that moves with the
  // gate is a verdict about the gate, and this is the only way to see that from the outside.
  if (!(opts && opts.noSweep)) {
    const sweep = [];
    for (const g of [r.gate - 1, r.gate, r.gate + 1]) {
      if (g <= 0) continue;
      const alt = analyze(frames, Object.assign({}, opts, { gate: g, trials: 60 }));
      const t = alt.tempo, trust = t ? cvIsTrustworthy(t) : { ok: false };
      sweep.push(f1(g) + 'dB:' + (alt.detection ? alt.detection.onsets.length : 0) + 'on/'
        + (alt.pulse ? alt.pulse.verdict.replace('NO PULSE', 'none').replace('PULSE', 'pulse')
                       .replace('NO DATA', 'nodata') : '?')
        + (t ? '/cv' + (trust.ok ? f3(t.cv) : 'withheld') : ''));
    }
    console.log('  gate sensitivity (60-trial nulls): ' + sweep.join('   '));
  }

  const p = r.pulse;
  console.log('  PULSE GATE: ' + p.verdict);
  if (p.verdict === 'NO DATA') {
    console.log('    ' + p.reason);
  } else {
    console.log('    best period ' + f1(p.period) + 'ms (' + f1(p.impliedBpm) + ' bpm'
      + ', half/double are the same pulse)   coherence R ' + f3(p.score)
      + ' over ' + p.windows + ' windows of ' + ONSETS_PER_WINDOW + " onsets");
    console.log('    poisson null, pipeline-matched (same count/mean, 85ms grid, same refractory,'
      + ' same search): p50 ' + f3(p.null.p50) + '  p95 ' + f3(p.null.p95)
      + '  p99 ' + f3(p.null.p99) + '  max ' + f3(p.null.max));
    console.log('    margin over null p99: ' + (p.margin >= 0 ? '+' : '') + f3(p.margin)
      + '   empirical p = ' + f3(p.pValue)
      + (p.verdict === 'PULSE' ? '' : '   <-- does not beat a pulseless process'));
    if (p.supplied) {
      console.log('    supplied --bpm scored ' + f3(p.supplied.score)
        + ' at ' + f1(p.supplied.period) + 'ms (initialiser only, never the grid)');
    }
  }

  if (r.pulse && r.pulse.verdict === 'PULSE' && r.pulse.global) {
    const cls = classifyTempo(r.pulse);
    console.log('  FIXED vs FREE tempo model: free ' + f3(r.pulse.score)
      + '   one-fixed-period ' + f3(r.pulse.global.score)
      + ' (at ' + f1(r.pulse.global.period) + 'ms)'
      + '   gap ' + f3(r.pulse.freeMinusFixed));
    console.log('  VERDICT: ' + cls.label + ' — ' + cls.why + '.');
  }

  if (r.tempo) {
    const t = r.tempo;
    const cls = classifyTempo(r.pulse);
    const trust = cls.ok ? cvIsTrustworthy(t)
      : { ok: false, why: 'tempo is ' + cls.label + ' — ' + cls.why };
    console.log('  LOCAL TEMPO SERIES: ' + t.n + ' windows of ' + t.window + ' onsets'
      + '   at-rail ' + f1(100 * t.railFrac) + '%'
      + '   octave-folded ' + f1(100 * t.octaveFlips) + '%'
      + '   band-clipped ' + f1(100 * t.clippedFrac) + '%'
      + '   neighbour drift ' + f3(t.drift) + ' oct');
    if (!trust.ok) {
      console.log('  TEMPO CV: WITHHELD — ' + trust.why + '.');
      console.log('    (it would have read CV ' + f3(t.cv) + ', range ' + f1(t.minBpm) + '-'
        + f1(t.maxBpm) + ' bpm. Printing that as a result is the failure this repo already shipped'
        + ' once: a spread across the whole allowed range, reported as rubato.)');
    } else {
      console.log('  TEMPO CV: mean ' + f1(t.meanBpm) + ' bpm   sd ' + f2(t.sdBpm) + ' bpm'
        + '   range ' + f1(t.minBpm) + '-' + f1(t.maxBpm));
      if (t.octaveFlips > 0.1) {
        console.log('    NOTE: ' + f1(100 * t.octaveFlips) + '% of windows were octave-folded, so '
          + 'the music is metrically ambiguous — the CV is trustworthy (neighbour drift '
          + f3(t.drift) + ') but WHICH pulse ' + f1(t.meanBpm) + ' bpm names is a half/double '
          + 'choice this cannot make.');
      }
      console.log('    CV = ' + f3(t.cv) + '  (' + f2(t.cvPct) + '%)');
      console.log('    resolution floor from 85ms frames: CV ' + f3(t.cvFloor)
        + ' (' + f2(t.cvFloorPct) + '%)  [sd(period) ' + f2(t.sdPeriodMs) + 'ms]');
      console.log('    ' + (t.resolvable
        ? 'above the floor — this variation is real'
        : 'AT OR BELOW THE FLOOR — "as steady as this instrument can resolve", NOT "quantised"'));
    }
  } else if (r.pulse.verdict === 'PULSE') {
    console.log('  TEMPO CV: not computable (too few usable beats)');
  } else {
    console.log('  TEMPO CV: withheld — no pulse to have a tempo of.');
  }

  if (r.trend) {
    const s = r.trend;
    console.log('  onset-spacing trend (NOT tempo): mean ' + f1(s.meanIoi) + 'ms'
      + '   slope ' + f3(s.slope) + ' ms/s   r ' + f3(s.r));
    console.log('    halves ' + f1(s.firstHalf) + ' -> ' + f1(s.secondHalf) + 'ms'
      + '   corr(level, onset rate) ' + f2(s.levelCorr));
    console.log('    spacing is note density x tempo and this cannot separate them.');
  }
  return r;
}

// ---------------------------------------------------------------------------
// Self-test — synthetic controls, including the ones that must FAIL
// ---------------------------------------------------------------------------

function selftest() {
  console.log('GROOVE SELF-TEST — every measure here must be capable of coming out low or null.\n');
  console.log('frame period ' + f3(TMS) + 'ms   frame-index scatter T/sqrt(12) = '
    + f2(QUANT_SD_MS) + 'ms');

  const cases = [
    { name: 'CLICK TRACK 120bpm, 0ms jitter (must PULSE, CV at floor)',
      times: synthClicks(120, 150, 0, 11), pulse: true, cv: 'floor', bpm: 120, verdict: 'STEADY' },
    // 30 ms of PER-ONSET jitter must NOT raise the tempo CV, and that is the point rather than a
    // shortfall: a window's period is fit over 12 onsets, so jitter averages down by sqrt(Sxx) —
    // 30/11.96 = 2.5 ms, which is 0.5% at a 500 ms beat and sits exactly on the format's own floor.
    // Tempo CV is a TEMPO statistic and is blind to microtiming by construction. That blindness is
    // the same wall the resolution finding hit, showing up here as a measured number.
    { name: 'HUMAN 120bpm, 30ms per-onset jitter (must PULSE; CV must stay AT floor — CV cannot see jitter)',
      times: synthClicks(120, 150, 30, 12), pulse: true, cv: 'floor', bpm: 120, verdict: 'STEADY' },
    { name: 'RUBATO ramp 60->90bpm (must PULSE, CV far above floor, must recover the range)',
      times: synthRamp(60, 90, 150), pulse: true, cv: 'above', verdict: 'ELASTIC' },
    { name: 'SMALL DRIFT 118->122bpm (must PULSE, CV above floor — the sensitivity edge)',
      times: synthRamp(118, 122, 150), pulse: true, cv: 'above', bpm: 120, verdict: 'STEADY' },
    // 117.1875 bpm = 703.125/6, so a beat is EXACTLY 6 frames. Every onset then lands on the same
    // frame phase and coherence saturates at 1.0 whatever the performance did. Documented as a
    // control because this is the family of tempos (703.125/n: 175.78, 140.63, 117.19, 100.45,
    // 87.89, 78.13, 70.31) where a microtiming claim would be fabricated — measured on the
    // discarded variance-subtraction approach, a planted 12 ms jitter there reported 0.0 ms.
    // Nothing here claims "quantised", which is what keeps that hazard defused rather than hidden.
    { name: 'COMMENSURATE 117.1875bpm = exactly 6 frames/beat (must PULSE; coherence saturates)',
      times: synthClicks(117.1875, 150, 0, 15), pulse: true, cv: 'floor', verdict: 'STEADY' },
    { name: 'SUBDIVIDED 120bpm, offbeat eighths every 2nd beat (must PULSE — the fair octave control)',
      times: synthSubdivided(120, 150, 2), pulse: true, verdict: 'STEADY' },
    { name: 'SUBDIVIDED 120bpm, offbeat eighths on every beat (must PULSE)',
      times: synthSubdivided(120, 150, 1), pulse: true, verdict: 'STEADY' },
    { name: 'POISSON, no pulse (must be NO PULSE — the negative control)',
      times: synthPoisson(500, 150, 13), pulse: false },
    { name: 'POISSON, sparse (must be NO PULSE)',
      times: synthPoisson(1500, 120, 14), pulse: false },
  ];
  let failures = 0;
  const fail = m => { console.log('  *** SELF-TEST FAILURE: ' + m); failures++; };
  for (const c of cases) {
    const { frames, times } = renderHits(c.times, { decayMs: 150 });
    const r = report(c.name, frames, { times });
    const got = r.pulse.verdict === 'PULSE';
    if (c.pulse !== got) {
      fail('expected ' + (c.pulse ? 'PULSE' : 'NO PULSE') + ', got ' + r.pulse.verdict);
      continue;
    }
    if (!c.pulse) continue;
    if (c.verdict) {
      const got2 = classifyTempo(r.pulse).label;
      if (got2 !== c.verdict) fail('expected verdict ' + c.verdict + ', got ' + got2);
    }
    if (c.bpm && Math.abs(r.pulse.impliedBpm - c.bpm) > 2) {
      fail('expected ~' + c.bpm + ' bpm, got ' + f1(r.pulse.impliedBpm));
    }
    if (c.cv && !r.tempo) fail('expected a tempo CV, got none');
    else if (c.cv === 'floor' && r.tempo.resolvable) {
      fail('CV ' + f3(r.tempo.cv) + ' rose above the floor ' + f3(r.tempo.cvFloor)
        + ' on material that has no tempo variation');
    } else if (c.cv === 'above' && !r.tempo.resolvable) {
      fail('CV ' + f3(r.tempo.cv) + ' did not clear the floor ' + f3(r.tempo.cvFloor)
        + ' on material with a planted tempo change');
    }
  }
  console.log('\nself-test failures: ' + failures);
  return failures;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const o = { files: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    // Take the next token as a value only if it is not itself a flag — a flag that swallows the
    // following flag's name is a bug this repo has already shipped once.
    const val = () => {
      const nx = argv[i + 1];
      if (nx === undefined || /^--/.test(nx)) return null;
      i++; return nx;
    };
    if (a === '--file') { const v = val(); if (v) o.files.push(v); }
    else if (a === '--bpm') { const v = val(); o.bpm = v === null ? null : Number(v); }
    else if (a === '--gate') { const v = val(); o.gate = v === null ? null : Number(v); }
    // No --window flag on purpose: ONSETS_PER_WINDOW is what the trust-gate bars in section 7 of
    // groove-FINDINGS.md were calibrated against, so exposing it would let a caller move the
    // window and silently invalidate every threshold. Change it in the source and re-run --selftest.
    else if (a === '--fixtures') o.fixtures = true;
    else if (a === '--selftest') o.selftest = true;
    else if (a === '--json') o.json = true;
    else if (a === '--help' || a === '-h') o.help = true;
    else if (/^--/.test(a)) o.unknown = (o.unknown || []).concat(a);
    else o.files.push(a);
  }
  return o;
}

function main(argv) {
  const o = parseArgs(argv);
  if (o.help) {
    console.log('groove.js — how a performance sits against the grid, and when it cannot be said.');
    console.log('  --file <jsonl>   fixture (repeatable)      --bpm <n>   initialiser only');
    console.log('  --gate <db>      onset gate (default 3.0)  --json      machine-readable output');
    console.log('  --fixtures       both orchestral fixtures  --selftest  synthetic controls');
    return 0;
  }
  if (o.unknown) { console.error('unknown flag: ' + o.unknown.join(' ')); return 2; }
  if (o.gate !== undefined && (o.gate === null || Number.isNaN(o.gate))) {
    console.error('--gate needs a number'); return 2;
  }
  if (o.bpm !== undefined && (o.bpm === null || Number.isNaN(o.bpm) || o.bpm <= 0)) {
    console.error('--bpm needs a positive number'); return 2;
  }
  if (o.selftest) return selftest() === 0 ? 0 : 1;

  let files = o.files;
  if (o.fixtures || !files.length) files = FIXTURES.slice();

  const results = [];
  for (const f of files) {
    let fx;
    try { fx = loadFixture(f); }
    catch (e) { console.error('cannot read ' + f + ': ' + e.message); return 2; }
    if (fx.missingDb === fx.frames.length && fx.frames.length) {
      console.log('\n=== ' + path.basename(fx.path));
      console.log('  ' + fx.frames.length + ' frames, NONE carrying a db field.');
      console.log('  Level is UNKNOWN here, not zero and not silence. Onsets need level, so this');
      console.log('  file cannot be analysed rather than analysing to a confident nothing.');
      results.push({ file: fx.path, skipped: 'no db field' });
      continue;
    }
    const r = report(path.basename(fx.path) + (fx.missingDb
      ? '  (' + fx.missingDb + ' frames missing db, treated as unknown)' : ''), fx.frames, o);
    results.push(Object.assign({ file: fx.path }, r, { detection: undefined,
      onsetCount: r.detection ? r.detection.onsets.length : null, audit: undefined }));
  }
  if (o.json) console.log('\n' + JSON.stringify(results, null, 2));
  return 0;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));

module.exports = {
  T, TMS, QUANT_SD_MS, DEFAULT_GATE_DB, FIXTURES, FIXTURE_DIR,
  ONSETS_PER_WINDOW, MIN_ONSETS_PER_WINDOW, REFRACTORY_FRAMES,
  parseFixture, loadFixture, auditFrames, detectOnsets,
  coherenceAt, windowedCoherence, windowBestPeriod, globalCoherence, bestPulse, nullTimes, poissonNull, pulseGate,
  tempoCV, foldOctaves, neighbourDrift, cvIsTrustworthy,
  classifyTempo, GAP_STEADY_MAX, GAP_ELASTIC_MIN,
  MAX_NEIGHBOUR_DRIFT, MAX_RAIL_FRAC, MAX_OCTAVE_FLIPS, MAX_CLIPPED_FRAC, ANCHOR_BAND, solveInBand,
  SEARCH_LO_MS, SEARCH_HI_MS, SEARCH_STEP_MS,
  spacingTrend, analyze, report,
  rmsDb, renderHits, synthClicks, synthRamp, synthSubdivided, synthPoisson, makeRng,
  parseArgs, selftest, main,
};
