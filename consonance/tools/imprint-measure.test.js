// imprint-measure.test.js — acceptance for imprint-measure.js, and acceptance here is MUTATION.
//
// WHY NOT GREEN. A passing suite over a tool nobody has broken on purpose is the same evidence as a
// tool that cannot fire: `universe-print.test.js` and `forget-rate.test.js` both exist in this repo
// because a green run proved nothing about a check that was structurally incapable of failing. So
// this file does two things, in this order:
//
//   PART 1  ordinary assertions, every one of them against a value known INDEPENDENTLY of this
//           implementation — a straight line has box dimension 1, a Sierpinski gasket 1.585, an
//           f^-beta field has spectral slope -beta, a constant image has zero entropy, a
//           permutation p-value can never be 0. No golden numbers copied out of a first run; a
//           golden pinned from the code under test only asserts that the code has not changed.
//
//   PART 2  MUTATION. The source is copied, one construct is broken, and a probe must notice. Every
//           probe is FIRST run against the unmutated module and must come back clean — a probe that
//           reports "caught" on healthy code catches nothing. Reported as:
//
//               applied N / caught N / NOT APPLIED N
//
//           NOT APPLIED means the substitution did not land — the string was absent, or ambiguous —
//           and it proves NOTHING about the guard it was aimed at. It is printed as its own column
//           rather than folded into either of the others, because a mutant that never ran reads
//           exactly like a mutant that was survived if you let the buckets merge.
//
// THE THREE THE PACKET NAMED are all here and all die: the blinding (6 mutants), the permutation
// shuffle (4), and the multiple-comparison correction (3). If breaking the correction had not turned
// anything red, the correction would be decorative and this file would say so in those words.
//
// AND THE FINDING IS PINNED AS A TEST, not left in prose. `calibration_registered_rule_is_broken`
// asserts that the REGISTERED decision rule fires far above nominal at n=7/20. If someone repairs
// the rule, that test goes red and tells them to update the finding — which is the only way a
// measured defect stays measured.
//
// No real image is read, written, or referred to anywhere in this file. Every pixel is synthesised.

'use strict';
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const SRC = path.join(__dirname, 'imprint-measure.js');
const M = require(SRC);

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e.message}`); fail++; }
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'imprint-measure-'));
function near(a, b, tol, what) {
  assert.ok(Math.abs(a - b) <= tol, `${what}: ${a} is not within ${tol} of ${b}`);
}

// ── PART 1a — the measures, against independently known answers ─────────────────────────────────

console.log('\n-- measures (values known independently of this implementation) --');

test('PNG encode/decode round-trips exactly', () => {
  const n = 32;
  const g = new Uint8Array(n * n);
  for (let i = 0; i < g.length; i++) g[i] = (i * 7 + (i >> 5) * 13) & 0xFF;
  const dec = M.decodePng(M.encodeGrayPng(g, n, n));
  assert.strictEqual(dec.width, n);
  assert.strictEqual(dec.height, n);
  for (let i = 0; i < g.length; i++) assert.strictEqual(dec.gray[i], g[i], 'pixel ' + i);
});

test('box-counting: a line is 1.0, a filled plane is 2.0, a Sierpinski gasket is 1.585', () => {
  const n = 256, sizes = [2, 4, 8, 16, 32, 64];
  let e = new Uint8Array(n * n);
  for (let i = 0; i < n; i++) e[i * n + i] = 1;
  near(M.boxCountDimension(e, n, sizes), 1.0, 0.10, 'line');
  e = new Uint8Array(n * n).fill(1);
  near(M.boxCountDimension(e, n, sizes), 2.0, 0.10, 'plane');
  e = new Uint8Array(n * n);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if ((x & y) === 0) e[y * n + x] = 1;
  near(M.boxCountDimension(e, n, sizes), 1.585, 0.10, 'sierpinski');
});

test('spectral slope recovers -beta on synthetic f^-beta noise', () => {
  const n = 256;
  for (const beta of [2.0, 3.0]) {
    const rng = M.mulberry32(1000 + Math.round(beta * 10));
    const png = M.encodeGrayPng(M.syntheticField(n, beta, rng), n, n);
    const s = M.measureImage(png, n).measures.spectral_slope;
    near(s, -beta, 0.4, 'beta=' + beta);
  }
});

test('entropy is 0 on a constant image and large on noise; compression tracks the same way', () => {
  const n = 128;
  const flat = new Float64Array(n * n).fill(128);
  near(M.multiscaleEntropy(flat, n, [1, 2, 4, 8], 64), 0, 1e-9, 'flat entropy');
  assert.ok(M.compressionRatio(flat, n) < 0.02, 'a constant image must compress to almost nothing');
  const rng = M.mulberry32(5);
  const noise = new Float64Array(n * n);
  for (let i = 0; i < noise.length; i++) noise[i] = rng() * 255;
  assert.ok(M.multiscaleEntropy(noise, n, [1, 2, 4, 8], 64) > 3, 'noise entropy must be well above 0');
  assert.ok(M.compressionRatio(noise, n) > 0.9, 'incompressible noise must score near 1');
});

test('centre-crop takes a square from a non-square image', () => {
  const w = 6, h = 4;
  const g = new Float64Array(w * h);
  for (let i = 0; i < g.length; i++) g[i] = i;
  const c = M.centreCropSquare(g, w, h);
  assert.strictEqual(c.size, 4);
  assert.strictEqual(c.gray.length, 16);
  assert.strictEqual(c.gray[0], 1, 'the crop must start one column in, not at the origin');
});

// ── PART 1b — the statistics ────────────────────────────────────────────────────────────────────

console.log('\n-- statistics --');

test('Holm is a step-down: monotone, and it is NOT Bonferroni', () => {
  const adj = M.holmAdjust([0.01, 0.016, 0.5, 0.9]);
  near(adj[0], 0.04, 1e-12, 'smallest x m');
  near(adj[1], 0.048, 1e-12, 'second x (m-1) — Bonferroni would give 0.064');
  assert.ok(adj[1] <= 0.05 && 0.016 * 4 > 0.05,
            'this is exactly the case where Holm and Bonferroni disagree on the verdict');
  const nm = M.holmAdjust([0.013, 0.014, 0.9, 0.9]);
  assert.ok(nm[1] >= nm[0], 'adjusted p must be non-decreasing in sorted order');
});

test('the correction is load-bearing: it flips a verdict', () => {
  const raw = [0.02, 0.4, 0.6, 0.9];
  assert.ok(Math.min.apply(null, raw) <= 0.05, 'uncorrected, this set is a finding');
  assert.ok(Math.min.apply(null, M.holmAdjust(raw)) > 0.05, 'corrected, it is not');
});

test('a permutation p-value can never be 0 and never exceeds 1', () => {
  const t = [100, 101, 102, 103, 104, 105, 106];
  const c = []; for (let i = 0; i < 20; i++) c.push(i * 0.01);
  for (const rule of Object.keys(M.RULES)) {
    const r = M.RULES[rule](t, c, 999, M.mulberry32(3));
    assert.ok(r.p >= 1 / 1000 - 1e-12, rule + ' returned ' + r.p + ', below the 1/(iters+1) floor');
    assert.ok(r.p <= 1, rule + ' returned ' + r.p);
  }
});

test('both rules are two-sided: a shift DOWNWARD is detected too', () => {
  const c = []; for (let i = 0; i < 20; i++) c.push(i / 20);
  const t = [-5, -5.1, -5.2, -4.9, -5.05, -5.15, -4.95];
  for (const rule of Object.keys(M.RULES)) {
    const r = M.RULES[rule](t, c, 999, M.mulberry32(4));
    assert.ok(r.p < 0.01, rule + ' missed a large negative shift (p=' + r.p + ')');
  }
});

test('the shuffle actually shuffles', () => {
  const seen = [];
  for (let i = 0; i < 10; i++) seen.push(new Set());
  const rng = M.mulberry32(11);
  for (let k = 0; k < 200; k++) {
    const a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    M.shuffleInPlace(a, rng);
    a.forEach((v, pos) => seen[v].add(pos));
  }
  for (let v = 0; v < 10; v++) {
    assert.ok(seen[v].size >= 5, 'element ' + v + ' only ever reached ' + seen[v].size + ' positions');
  }
});

test('the control-subset null is a distribution, not a point', () => {
  const c = []; for (let i = 0; i < 20; i++) c.push(i);
  const r = M.controlSubsetTest([1, 2, 3, 4, 5, 6, 7], c, 2000, M.mulberry32(6));
  assert.ok(new Set(r.nulls).size > 5, 'the null took only ' + new Set(r.nulls).size + ' distinct values');
});

// ── PART 1c — THE FINDING, pinned as a test ─────────────────────────────────────────────────────

console.log('\n-- calibration: does a rule that promises p<=x deliver p<=x at rate x --');

const CAL_OPTS = { alpha: 0.05, seed: 99, calTrials: 400, calIters: 399 };

test('the POOLED rule is calibrated at n_test=7, n_control=20', () => {
  const cal = M.calibrationCheck(7, 20, CAL_OPTS);
  assert.strictEqual(cal.rules.pooled.miscalibrated, false,
    'pooled came back miscalibrated: ' + JSON.stringify(cal.rules.pooled.distributions));
});

test('calibration_registered_rule_is_broken — the control-subset rule fires far above nominal', () => {
  const cal = M.calibrationCheck(7, 20, CAL_OPTS);
  const g = cal.rules['control-subset'].distributions.gaussian.realised;
  assert.strictEqual(cal.rules['control-subset'].miscalibrated, true,
    'the registered rule now calibrates. If it was repaired, this is GOOD NEWS and the finding in\n' +
    'imprint-measure.js and in the hand-back must be updated — do not just delete this assertion.');
  assert.ok(g[0] > 0.03,
    'at the Holm operating point (' + (0.05 / 4).toFixed(4) + ') the registered rule fired at ' +
    g[0].toFixed(4) + '; the recorded finding is ~0.096 and this test exists to notice if that moves');
});

// ── PART 1d — blinding, as units ────────────────────────────────────────────────────────────────

console.log('\n-- blinding --');

test('a corpus with a labelled filename is refused', () => {
  const d = path.join(tmp, 'labelled'); fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, 'test-01.png'), 'x');
  assert.throws(() => M.assertBlindCorpus(d), /BLIND VIOLATION/);
});

test('a hash-named corpus is accepted, and an empty one is not', () => {
  const d = path.join(tmp, 'blindok'); fs.mkdirSync(d, { recursive: true });
  assert.throws(() => M.assertBlindCorpus(d), /empty/);
  fs.writeFileSync(path.join(d, '0123456789abcdef.png'), 'x');
  assert.deepStrictEqual(M.assertBlindCorpus(d), ['0123456789abcdef.png']);
});

test('the measuring stage cannot be handed a path outside the blind set', () => {
  const allowed = { self: '/a/self.js', blindDir: '/a/blind', measuresOut: '/a/measures.json' };
  const clean = M.buildMeasureArgv(allowed.self, allowed.blindDir, allowed.measuresOut, 256);
  assert.doesNotThrow(() => M.assertBlindArgv(clean, allowed));
  assert.throws(() => M.assertBlindArgv(clean.concat(['--key', '/a/key.json']), allowed),
                /BLIND VIOLATION/);
});

test('the child environment is a whitelist and carries nothing about groups', () => {
  process.env.IMPRINT_LEAKED_KEY = '/somewhere/key.json';
  try {
    const env = M.buildMeasureEnv();
    assert.ok(!('IMPRINT_LEAKED_KEY' in env), 'the environment leaked a variable this run set');
    for (const [k, v] of Object.entries(env)) {
      assert.ok(!/key\.json|imprint/i.test(String(v)), 'env var ' + k + ' names ' + v);
    }
  } finally { delete process.env.IMPRINT_LEAKED_KEY; }
});

test('the labels are unreadable until the measurements are frozen and hashed', () => {
  const kp = path.join(tmp, 'k.json');
  fs.writeFileSync(kp, JSON.stringify({ abc: 'test' }));
  assert.throws(() => M.loadKeySealed(kp, { measuresDigest: null }), /BLIND VIOLATION/);
  assert.throws(() => M.loadKeySealed(kp, null), /BLIND VIOLATION/);
  assert.deepStrictEqual(M.loadKeySealed(kp, { measuresDigest: 'deadbeef' }), { abc: 'test' });
});

// ── PART 1e — end to end on synthetic images ────────────────────────────────────────────────────

console.log('\n-- end to end (synthetic images only) --');

const FIX = path.join(tmp, 'fixtures');
const SIZE = 64;
function makeSet(dir, count, beta, seedTag) {
  fs.mkdirSync(dir, { recursive: true });
  const rng = M.mulberry32(M.subSeed(7, seedTag));
  for (let i = 0; i < count; i++) M.writeSyntheticPng(path.join(dir, 'i' + i + '.png'), SIZE, beta, rng);
  return dir;
}
const DIFF_T = makeSet(path.join(FIX, 'diff-test'), 7, 3.6, 'dt');
const DIFF_C = makeSet(path.join(FIX, 'diff-ctrl'), 20, 2.4, 'dc');
const SAME_ALL = makeSet(path.join(FIX, 'same'), 27, 2.6, 'same');

const RUN = {
  size: SIZE, iters: 2000, seed: 5, alpha: 0.05, rule: 'pooled',
  allowProvenanceMismatch: false, acceptMiscalibrated: false,
  calTrials: 300, calIters: 299, command: 'test',
};

let diffRun = null;
test('a set that genuinely differs is FOUND', () => {
  diffRun = M.runPipeline(Object.assign({}, RUN, {
    test: DIFF_T, control: DIFF_C, out: path.join(tmp, 'run-diff'),
  }));
  assert.strictEqual(diffRun.report.analysis.decision, 'SEPARATES',
    'the instrument missed a real difference:\n' + diffRun.text);
  assert.ok(diffRun.report.analysis.measures.spectral_slope.separates,
    'spectral_slope should be the measure that fires when beta differs');
});

test('the blinded corpus contains hash names and nothing else; measures.json carries no labels', () => {
  const blind = fs.readdirSync(path.join(tmp, 'run-diff', 'blind'));
  assert.strictEqual(blind.length, 27);
  for (const f of blind) assert.ok(M.BLIND_NAME.test(f), 'not hash-named: ' + f);
  const raw = fs.readFileSync(path.join(tmp, 'run-diff', 'measures.json'), 'utf8');
  assert.ok(!/"group"|"test"|"control"/.test(raw), 'measures.json mentions a group');
});

test('the measurement digest is recorded and matches the file on disk', () => {
  const d = M.sha256File(path.join(tmp, 'run-diff', 'measures.json'));
  assert.strictEqual(diffRun.report.run.measures_digest, d);
});

test('one distribution split at random finds NOTHING', () => {
  const t = path.join(tmp, 'null-test'), c = path.join(tmp, 'null-ctrl');
  fs.mkdirSync(t, { recursive: true }); fs.mkdirSync(c, { recursive: true });
  const files = fs.readdirSync(SAME_ALL).sort();
  const idx = files.map((_, i) => i);
  M.shuffleInPlace(idx, M.mulberry32(21));
  idx.slice(0, 7).forEach((i) => fs.copyFileSync(path.join(SAME_ALL, files[i]), path.join(t, files[i])));
  idx.slice(7).forEach((i) => fs.copyFileSync(path.join(SAME_ALL, files[i]), path.join(c, files[i])));
  const r = M.runPipeline(Object.assign({}, RUN, { test: t, control: c, out: path.join(tmp, 'run-null') }));
  assert.strictEqual(r.report.analysis.decision, 'FAIL',
    'FALSE POSITIVE on a random split of one distribution:\n' + r.text);
});

test('and the false-positive RATE over 200 splits sits at nominal, which the single split cannot show', () => {
  // Measure once, split many times. A single clean split is an anecdote; the rate is the check.
  const blind = path.join(tmp, 'fpr-blind'); fs.mkdirSync(blind, { recursive: true });
  const files = fs.readdirSync(SAME_ALL).sort();
  const ids = files.map((f) => {
    const b = fs.readFileSync(path.join(SAME_ALL, f));
    const id = crypto.createHash('sha256').update(b).digest('hex').slice(0, 16);
    fs.writeFileSync(path.join(blind, id + '.png'), b);
    return id;
  });
  const meas = M.runMeasureOnly(blind, path.join(tmp, 'fpr-measures.json'), SIZE);
  const byId = new Map(meas.files.map((f) => [f.id, f.measures]));
  const values = {};
  for (const m of M.MEASURES) values[m] = ids.map((id) => byId.get(id)[m]);
  const splits = 200;
  const hits = { pooled: 0, 'control-subset': 0 };
  const rng = M.mulberry32(31);
  for (let s = 0; s < splits; s++) {
    const idx = ids.map((_, i) => i);
    M.shuffleInPlace(idx, rng);
    const d = M.decideFromValues(values, idx.slice(0, 7), idx.slice(7),
      { seed: 1000 + s, iters: 999, alpha: 0.05 });
    for (const k of Object.keys(hits)) if (d[k].positive) hits[k]++;
  }
  const fpr = hits.pooled / splits;
  assert.ok(fpr <= 0.10,
    'the pooled rule false-positived on ' + hits.pooled + '/' + splits + ' null splits (' +
    fpr.toFixed(3) + '); nominal is 0.05 and the 95% upper bound at this many splits is ~0.08');
  assert.ok(hits['control-subset'] > hits.pooled,
    'the registered rule is supposed to be the WORSE one here; it scored ' +
    hits['control-subset'] + '/' + splits + ' against pooled ' + hits.pooled);
  console.log('       (rates: pooled ' + hits.pooled + '/' + splits +
              ', control-subset ' + hits['control-subset'] + '/' + splits + ')');
});

// ── PART 1f — the refusals ──────────────────────────────────────────────────────────────────────

console.log('\n-- refusals --');

test('a design that cannot produce a positive at these n is refused before it runs', () => {
  const c8 = makeSet(path.join(FIX, 'ctrl8'), 8, 2.6, 'c8');
  assert.throws(
    () => M.runPipeline(Object.assign({}, RUN, { test: DIFF_T, control: c8, out: path.join(tmp, 'run-floor') })),
    /CANNOT RETURN A POSITIVE/);
});

test('the registered rule is refused as miscalibrated unless the operator says otherwise', () => {
  const opts = Object.assign({}, RUN, {
    rule: 'control-subset', test: DIFF_T, control: DIFF_C, out: path.join(tmp, 'run-mis'),
  });
  assert.throws(() => M.runPipeline(opts), /MISCALIBRATED/);
  const forced = M.runPipeline(Object.assign({}, opts, {
    acceptMiscalibrated: true, out: path.join(tmp, 'run-mis-forced'),
  }));
  assert.ok(/MISCALIBRATED AT THIS n AND WAS RUN ANYWAY/.test(forced.text),
    'a forced run must say so in its own report');
});

test('a duplicate image across the sets is refused', () => {
  const t = path.join(tmp, 'dup-t'), c = path.join(tmp, 'dup-c');
  fs.mkdirSync(t, { recursive: true }); fs.mkdirSync(c, { recursive: true });
  const files = fs.readdirSync(DIFF_C).sort();
  files.slice(0, 7).forEach((f) => fs.copyFileSync(path.join(DIFF_C, f), path.join(t, f)));
  files.forEach((f) => fs.copyFileSync(path.join(DIFF_C, f), path.join(c, f)));
  assert.throws(
    () => M.runPipeline(Object.assign({}, RUN, { test: t, control: c, out: path.join(tmp, 'run-dup') })),
    /duplicate image/);
});

test('a non-PNG is refused with the reason, not silently skipped', () => {
  const t = path.join(tmp, 'jpg-t'); fs.mkdirSync(t, { recursive: true });
  fs.writeFileSync(path.join(t, 'a.jpg'), 'not really a jpeg');
  assert.throws(
    () => M.runPipeline(Object.assign({}, RUN, { test: t, control: DIFF_C, out: path.join(tmp, 'run-jpg') })),
    /only PNG is accepted/);
});

test('a plot and a machine-readable report are written', () => {
  const svg = fs.readFileSync(path.join(tmp, 'run-diff', 'plot.svg'), 'utf8');
  assert.ok(/^<svg /.test(svg) && /<\/svg>$/.test(svg.trim()), 'plot.svg is not an SVG document');
  for (const m of M.MEASURES) assert.ok(svg.includes(m), 'plot omits ' + m);
  const rep = JSON.parse(fs.readFileSync(path.join(tmp, 'run-diff', 'report.json'), 'utf8'));
  assert.strictEqual(rep.analysis.measures.spectral_slope.test_values.length, 7);
  assert.strictEqual(rep.analysis.measures.spectral_slope.control_values.length, 20);
  assert.ok(rep.run.blinding.length >= 4, 'the report must state how the blinding was enforced');
});

// ── PART 2 — MUTATION ───────────────────────────────────────────────────────────────────────────
//
// A probe returns TRUE when it observes the mutant's misbehaviour. Every probe is run against the
// unmutated module first and must return FALSE there; a probe that fires on healthy code is not
// evidence and is reported as a broken probe rather than as a catch.

console.log('\n-- mutation --');

const SOURCE = fs.readFileSync(SRC, 'utf8');
const MUT_DIR = path.join(tmp, 'mutants');
fs.mkdirSync(MUT_DIR, { recursive: true });

function loadMutant(id, find, replace) {
  const occurrences = SOURCE.split(find).length - 1;
  if (occurrences !== 1) return { applied: false, why: occurrences === 0 ? 'string not found' : occurrences + ' occurrences, ambiguous' };
  const mutated = SOURCE.replace(find, replace);
  if (mutated === SOURCE) return { applied: false, why: 'replacement was a no-op' };
  const p = path.join(MUT_DIR, id.replace(/[^a-z0-9]/gi, '_') + '.js');
  fs.writeFileSync(p, mutated);
  let mod;
  try { mod = require(p); }
  catch (e) { return { applied: true, module: null, loadError: e }; }
  return { applied: true, module: mod };
}

function threw(fn, re) {
  try { fn(); return false; } catch (e) { return re ? re.test(String(e.message)) : true; }
}

// Shared fixtures for the pipeline-level probes, small and fast.
const MUT_RUN = Object.assign({}, RUN, { calTrials: 120, calIters: 199, iters: 500 });
let mutRunCounter = 0;
function pipeOut() { return path.join(tmp, 'mut-run-' + (mutRunCounter++)); }

const MUTANTS = [
  // ── the blinding ──────────────────────────────────────────────────────────────────────────────
  {
    id: 'blinding/enroll-writes-labelled-filenames',
    find: "      fs.writeFileSync(path.join(blindDir, id + '.png'), bytes);",
    replace: "      fs.writeFileSync(path.join(blindDir, group + '-' + id + '.png'), bytes);",
    probe: (mod) => threw(() => mod.runPipeline(Object.assign({}, MUT_RUN, {
      test: DIFF_T, control: DIFF_C, out: pipeOut() })), /BLIND VIOLATION/),
  },
  {
    id: 'blinding/corpus-name-guard-disabled',
    find: '    if (!BLIND_NAME.test(e)) {',
    replace: '    if (false) {',
    probe: (mod) => {
      const d = path.join(tmp, 'mut-labelled'); fs.mkdirSync(d, { recursive: true });
      fs.writeFileSync(path.join(d, 'test-01.png'), 'x');
      return !threw(() => mod.assertBlindCorpus(d));
    },
  },
  {
    id: 'blinding/argv-guard-disabled',
    find: '    if (!ok.has(path.resolve(a))) {',
    replace: '    if (false) {',
    probe: (mod) => {
      const allowed = { self: '/a/self.js', blindDir: '/a/blind', measuresOut: '/a/m.json' };
      const argv = mod.buildMeasureArgv(allowed.self, allowed.blindDir, allowed.measuresOut, 64);
      return !threw(() => mod.assertBlindArgv(argv.concat(['--key', '/a/key.json']), allowed));
    },
  },
  {
    id: 'blinding/argv-carries-the-key-to-the-child',
    find: "  return [selfPath, '--measure-only', '--corpus', blindDir, '--measures-out', measuresOut,\n          '--size', String(size)];",
    replace: "  return [selfPath, '--measure-only', '--corpus', blindDir, '--measures-out', measuresOut,\n          '--key', path.join(path.dirname(blindDir), 'key.json'), '--size', String(size)];",
    probe: (mod) => threw(() => mod.runPipeline(Object.assign({}, MUT_RUN, {
      test: DIFF_T, control: DIFF_C, out: pipeOut() })), /BLIND VIOLATION/),
  },
  {
    id: 'blinding/child-env-is-a-copy-not-a-whitelist',
    find: "  const keep = ['PATH', 'Path', 'SystemRoot', 'TEMP', 'TMP', 'HOME', 'USERPROFILE', 'COMSPEC'];\n  const env = {};",
    replace: "  const keep = ['PATH', 'Path', 'SystemRoot', 'TEMP', 'TMP', 'HOME', 'USERPROFILE', 'COMSPEC'];\n  const env = Object.assign({}, process.env);",
    probe: (mod) => {
      process.env.IMPRINT_LEAKED_KEY = '/somewhere/key.json';
      try { return 'IMPRINT_LEAKED_KEY' in mod.buildMeasureEnv(); }
      finally { delete process.env.IMPRINT_LEAKED_KEY; }
    },
  },
  {
    id: 'blinding/order-interlock-disabled',
    find: '  if (!state || !state.measuresDigest) {',
    replace: '  if (false) {',
    probe: (mod) => {
      const kp = path.join(tmp, 'mut-key.json');
      fs.writeFileSync(kp, JSON.stringify({ a: 'test' }));
      return !threw(() => mod.loadKeySealed(kp, { measuresDigest: null }));
    },
  },

  // ── the permutation shuffle ───────────────────────────────────────────────────────────────────
  {
    id: 'permutation/control-subset-draw-does-not-shuffle',
    find: '      const j = i + Math.floor(rng() * (nc - i));',
    replace: '      const j = i;',
    probe: (mod) => {
      const c = []; for (let i = 0; i < 20; i++) c.push(i);
      const r = mod.controlSubsetTest([1, 2, 3, 4, 5, 6, 7], c, 500, mod.mulberry32(6));
      return new Set(r.nulls).size <= 5;
    },
  },
  {
    id: 'permutation/fisher-yates-does-not-shuffle',
    find: '    const j = Math.floor(rng() * (i + 1));',
    replace: '    const j = i;',
    probe: (mod) => {
      const seen = []; for (let i = 0; i < 10; i++) seen.push(new Set());
      const rng = mod.mulberry32(11);
      for (let k = 0; k < 200; k++) {
        const a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        mod.shuffleInPlace(a, rng);
        a.forEach((v, pos) => seen[v].add(pos));
      }
      return seen.some((s) => s.size < 5);
    },
  },
  {
    id: 'permutation/p-value-loses-its-plus-one',
    find: '  return { statistic: obs, centre, p: (ge + 1) / (iters + 1), nulls: Array.from(nulls) };',
    replace: '  return { statistic: obs, centre, p: ge / iters, nulls: Array.from(nulls) };',
    probe: (mod) => {
      const c = []; for (let i = 0; i < 20; i++) c.push(i * 0.01);
      const r = mod.controlSubsetTest([100, 101, 102, 103, 104, 105, 106], c, 999, mod.mulberry32(3));
      return r.p < 1 / 1000;
    },
  },
  {
    id: 'permutation/two-sided-becomes-one-sided',
    find: '  for (let i = 0; i < iters; i++) if (Math.abs(nulls[i] - centre) >= d - 1e-12) ge++;',
    replace: '  for (let i = 0; i < iters; i++) if ((nulls[i] - centre) >= (obs - centre) - 1e-12) ge++;',
    probe: (mod) => {
      const c = []; for (let i = 0; i < 20; i++) c.push(i / 20);
      const t = [-5, -5.1, -5.2, -4.9, -5.05, -5.15, -4.95];
      return mod.controlSubsetTest(t, c, 999, mod.mulberry32(4)).p > 0.5;
    },
  },

  // ── the multiple-comparison correction ────────────────────────────────────────────────────────
  {
    id: 'correction/holm-removed-entirely',
    find: 'function holmAdjust(pvals) {\n  const m = pvals.length;',
    replace: 'function holmAdjust(pvals) {\n  return pvals.slice();\n  const m = pvals.length;',
    probe: (mod) => Math.min.apply(null, mod.holmAdjust([0.02, 0.4, 0.6, 0.9])) <= 0.05,
  },
  {
    id: 'correction/holm-degraded-to-bonferroni',
    find: '    const adj = Math.min(1, order[r][0] * (m - r));',
    replace: '    const adj = Math.min(1, order[r][0] * m);',
    probe: (mod) => mod.holmAdjust([0.01, 0.016, 0.5, 0.9])[1] > 0.05,
  },
  {
    id: 'correction/step-down-monotonicity-removed',
    find: '    running = Math.max(running, adj);',
    replace: '    running = adj;',
    probe: (mod) => {
      const a = mod.holmAdjust([0.013, 0.014, 0.9, 0.9]);
      return a[1] < a[0];
    },
  },

  // ── the measures and the gates ────────────────────────────────────────────────────────────────
  {
    id: 'measure/box-counting-slope-inverted',
    find: '    xs.push(Math.log(1 / s));',
    replace: '    xs.push(Math.log(s));',
    probe: (mod) => {
      const n = 256; const e = new Uint8Array(n * n);
      for (let i = 0; i < n; i++) e[i * n + i] = 1;
      return Math.abs(mod.boxCountDimension(e, n, [2, 4, 8, 16, 32, 64]) - 1.0) > 0.1;
    },
  },
  {
    // AN EQUIVALENT MUTANT, AND IT IS REPORTED RATHER THAN EXEMPTED. Widening the spectral fit band
    // to the aliasing corner does not change the answer on the only images this tool can be
    // validated against, because a synthetic f^-beta field is a power law at EVERY frequency — so
    // every band recovers the same exponent. The worst-case shift across four alternative bands and
    // two exponents is re-measured on every run and PRINTED beside the mutant, rather than quoted
    // here from a run nobody can re-do; at the time of writing it was under 0.1 against a 0.4
    // tolerance.
    //
    // No test on synthetic power-law noise can kill this mutant. That is a real limit of the
    // VALIDATION, not a hole in the tool, and it matters: real images are not power laws, so the
    // band may well be load-bearing there and nothing here can say. The exemption is not a
    // permission slip — `equivalent.verify` re-measures the equivalence on every run, so the moment
    // the band starts to matter this mutant goes back on the kill list by itself.
    id: 'measure/spectral-fit-band-widened-to-the-aliasing-corner',
    find: '  for (let r = fMin; r <= fMax && r < maxR; r++) {',
    replace: '  for (let r = fMin; r < maxR; r++) {',
    probe: (mod) => {
      const n = 256; const rng = mod.mulberry32(1030);
      const png = mod.encodeGrayPng(mod.syntheticField(n, 3.0, rng), n, n);
      return Math.abs(mod.measureImage(png, n).measures.spectral_slope + 3.0) > 0.4;
    },
    equivalent: {
      reason: 'on f^-beta fields every fit band recovers the same exponent; the re-measured worst-case shift is printed beside this line rather than quoted from a past run',
      verify: () => {
        const n = 256;
        let worst = 0;
        for (const beta of [2.0, 3.0]) {
          const rng = M.mulberry32(1030 + beta * 10);
          const gray = M.decodePng(M.encodeGrayPng(M.syntheticField(n, beta, rng), n, n)).gray;
          const narrow = M.spectralSlope(gray, n, 4, 32);
          for (const band of [[4, 180], [1, 32], [1, 180], [32, 180]]) {
            worst = Math.max(worst, Math.abs(M.spectralSlope(gray, n, band[0], band[1]) - narrow));
          }
        }
        assert.ok(worst < 0.15,
          'the fit band now shifts the slope by ' + worst.toFixed(3) + ', so this mutant is NO ' +
          'LONGER EQUIVALENT: move it back to the kill list and give it a probe');
        return worst;
      },
    },
  },
  {
    id: 'measure/centre-crop-does-not-crop',
    find: '  const s = Math.min(w, h);',
    replace: '  const s = Math.max(1, Math.min(w, h));\n  if (w !== h) return { gray, size: Math.min(w, h) };',
    probe: (mod) => {
      const w = 6, h = 4; const g = new Float64Array(w * h);
      for (let i = 0; i < g.length; i++) g[i] = i;
      const c = mod.centreCropSquare(g, w, h);
      return c.gray.length !== 16 || c.gray[0] !== 1;
    },
  },
  {
    id: 'gate/calibration-gate-disabled',
    find: '  if (bad && !opts.acceptMiscalibrated) {',
    replace: '  if (false) {',
    probe: (mod) => !threw(() => mod.runPipeline(Object.assign({}, MUT_RUN, {
      rule: 'control-subset', test: DIFF_T, control: DIFF_C, out: pipeOut() })), /MISCALIBRATED/),
  },
  {
    id: 'gate/resolution-floor-refusal-disabled',
    find: '  if (minCorrected > opts.alpha) {',
    replace: '  if (false) {',
    probe: (mod) => {
      const c8 = path.join(FIX, 'ctrl8');
      return !threw(() => mod.runPipeline(Object.assign({}, MUT_RUN, {
        test: DIFF_T, control: c8, out: pipeOut() })), /CANNOT RETURN A POSITIVE/);
    },
  },
  {
    id: 'gate/duplicate-image-guard-disabled',
    find: '      if (seen.has(id)) {',
    replace: '      if (false) {',
    probe: (mod) => !threw(() => mod.runPipeline(Object.assign({}, MUT_RUN, {
      test: path.join(tmp, 'dup-t'), control: path.join(tmp, 'dup-c'), out: pipeOut() })),
      /duplicate image/),
  },
];

let applied = 0, caught = 0, notApplied = 0, brokenProbe = 0, equivalent = 0;
const survivors = [], skipped = [], broken = [], equivalents = [];

for (const mut of MUTANTS) {
  // 1. the probe must be clean on healthy code, or it is not evidence.
  let baseline;
  try { baseline = mut.probe(M); }
  catch (e) { baseline = 'threw: ' + e.message; }
  if (baseline !== false) {
    brokenProbe++; broken.push(mut.id + '  (baseline returned ' + JSON.stringify(baseline) + ')');
    continue;
  }
  // 2. apply.
  const m = loadMutant(mut.id, mut.find, mut.replace);
  if (!m.applied) { notApplied++; skipped.push(mut.id + '  (' + m.why + ')'); continue; }
  applied++;
  let got;
  if (!m.module) got = true;                       // the mutant would not even load: caught
  else { try { got = mut.probe(m.module); } catch (e) { got = true; } }
  if (got) { caught++; console.log('  killed     ' + mut.id); continue; }
  // 3. a survivor is a survivor UNLESS it carries a re-measured proof that it changes nothing.
  //    The proof is re-run here, every time; it is not a note in a comment.
  if (mut.equivalent) {
    let worst = null, ok = true;
    try { worst = mut.equivalent.verify(); } catch (e) { ok = false; broken.push(mut.id + ' equivalence proof FAILED: ' + e.message); }
    if (ok) {
      equivalent++;
      equivalents.push(mut.id + '  (' + mut.equivalent.reason + '; re-measured ' +
                       (typeof worst === 'number' ? worst.toFixed(4) : String(worst)) + ')');
      console.log('  EQUIVALENT ' + mut.id);
      continue;
    }
  }
  survivors.push(mut.id); console.log('  SURVIVED   ' + mut.id);
}

console.log('\nMUTATION: applied ' + applied + ' / caught ' + caught + ' / NOT APPLIED ' + notApplied +
            ' / EQUIVALENT ' + equivalent +
            (brokenProbe ? ' / BROKEN PROBE ' + brokenProbe : ''));
if (equivalents.length) {
  console.log('  EQUIVALENT — applied, survived, and PROVED to change nothing measurable. These are');
  console.log('  NOT catches. They mark constructs no test on synthetic images can pin:');
  for (const s of equivalents) console.log('    ' + s);
}
if (skipped.length) {
  console.log('  NOT APPLIED (these prove NOTHING about the guard they were aimed at):');
  for (const s of skipped) console.log('    ' + s);
}
if (broken.length) {
  console.log('  BROKEN PROBE (fired on healthy code, so its catch would be meaningless):');
  for (const s of broken) console.log('    ' + s);
}
if (survivors.length) {
  console.log('  SURVIVED — the construct was broken and nothing noticed:');
  for (const s of survivors) console.log('    ' + s);
}

test('every mutant that was applied was caught or proved equivalent', () => {
  assert.strictEqual(survivors.length, 0, 'survivors: ' + survivors.join(', '));
});
test('the mutation buckets sum to the mutant roster', () => {
  // js-suite's own rule, applied to this file's arithmetic: a summary that does not reconcile is a
  // summary reporting a coverage nobody measured.
  assert.strictEqual(caught + equivalent + survivors.length + notApplied + brokenProbe,
                     MUTANTS.length,
                     'some mutant is in no bucket or in two: ' + caught + '+' + equivalent + '+' +
                     survivors.length + '+' + notApplied + '+' + brokenProbe + ' != ' + MUTANTS.length);
});
test('no mutant was skipped — a NOT APPLIED mutant is not evidence of anything', () => {
  assert.strictEqual(notApplied, 0, 'not applied: ' + skipped.join(', '));
});
test('no probe fired on healthy code', () => {
  assert.strictEqual(brokenProbe, 0, 'broken probes: ' + broken.join(', '));
});
test('the correction is not decorative — breaking it turns something red', () => {
  const corr = MUTANTS.filter((x) => x.id.startsWith('correction/')).map((x) => x.id);
  assert.ok(corr.length >= 3, 'fewer than three correction mutants exist');
  for (const id of corr) {
    assert.ok(!survivors.includes(id) && !skipped.some((s) => s.startsWith(id)),
      'the correction mutant ' + id + ' did not turn anything red, so the correction is decorative');
  }
});

console.log(`\n${pass} passed, ${fail} failed`);
try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (_) {}
process.exit(fail ? 1 : 0);
