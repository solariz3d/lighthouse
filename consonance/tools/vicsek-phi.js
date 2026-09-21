/* vicsek-phi.js — the TRUE Vicsek order parameter over the board, one scalar per session.
 *
 *     phi = | (1/N) * SUM of the unit vectors |            0 = no common direction, 1 = perfect alignment
 *
 * WHY THIS EXISTS BESIDE order-parameter.js, AND NOT INSTEAD OF IT. The row that asks for this instrument
 * (exo_memory/third_place/DIVERSITY_COLLAPSE_INSIGHTS_2026-09-14.md:60-61) cites Vicsek AND specifies a running-centroid
 * cosine. Those are different objects: the citation is a population statistic with no sequence in it, the formula is a
 * sequential estimate. C built what the row specified; this builds what the row cited. The ruling that forces the
 * split is exo_memory/loop/c3_ruling_order_parameter_2026-09-20.md §2.
 *
 * THE ONE FACT A READER MUST HAVE BEFORE ANY NUMBER: phi IS ORDER-INVARIANT BY CONSTRUCTION. A sum does not care
 * what order it is taken in, so shuffling a session's turns leaves phi unchanged (to floating-point round-off).
 * That is asserted in the test rather than trusted here. It has two consequences and both are load-bearing:
 *   1. phi CANNOT be shuffle-tested the way r was. A shuffle control on phi is a control on the embedding
 *      DISTRIBUTION, never on order — it asks "would N vectors drawn from this board's own population be this
 *      aligned?", which is a different and still useful question, and it is what --pool-reps computes.
 *   2. phi answers a different question than r. r asks whether a session TIGHTENS as it goes; phi asks whether the
 *      session HAS a common direction at all. A session can be high on one and low on the other.
 *
 * THE NULL, MEASURED NOT ASSERTED, AND REGISTERED BEFORE ANY BOARD NUMBER: on structureless data phi falls as
 * 1/sqrt(N) — with N vectors pointing in independent directions the walk of their sum is a random walk of length
 * sqrt(N), so |mean| ~ 1/sqrt(N). It is dimension-independent above d ~ 3 and it is NOWHERE NEAR ZERO: a 20-turn
 * session reads ~0.22 with no structure whatsoever. A raw phi compared across sessions of different length is a
 * measurement of length. `--null-table` re-derives the table with a proper RNG (mulberry32 + Box-Muller, so the
 * directions are uniform on the sphere) rather than the cheap LCG whose agreement the ruling says degrades past
 * N = 100; that limit was the generator's, and this re-derivation is how the room finds out.
 *
 * ONE MACHINE'S BOARD. Everything printed reaches no further than the file named in the universe block, which is
 * printed first, with its row count, its torn rows and its day gaps. The other machine's rows are on the other
 * machine's disk.
 *
 * THE ENCODER IS T1'S, borrowed from order-parameter.js so there is exactly one copy of that path in the repo: the
 * same ONNX file by sha256, the same windowing and pooling. A different encoder would make this incomparable with
 * both T1 and C's r, which is the whole point of computing it over the same embeddings.
 *
 * Read-only. Writes only the --out file it is given.
 *   node consonance/tools/vicsek-phi.js --null-table                        (no encoder needed)
 *   node consonance/tools/vicsek-phi.js --deps <dir> [--board <path>] [--out <json>] [--min N]
 *        [--max-sessions N] [--pool-reps N]
 */
'use strict';
const fs = require('fs');

const MIN_CONTRIB = 20;        // the same floor C's registered run used, so the session sets line up
const POOL_REPS = 200;         // draws per session for the distribution control
const NULL_REPS = 200;         // replicates per cell in the null table, as the ruling measured it

/* ---- pure core ---- */

/** L2 norm. */
function norm(v) { let s = 0; for (let i = 0; i < v.length; i++) s += v[i] * v[i]; return Math.sqrt(s); }

/** A unit copy of v. Throws on a zero vector: a direction that does not exist must not be averaged as if it did. */
function unit(v) {
  const n = norm(v);
  if (!(n > 0) || !Number.isFinite(n)) throw new Error('cannot take the direction of a zero or non-finite vector');
  const out = new Float64Array(v.length);
  for (let i = 0; i < v.length; i++) out[i] = v[i] / n;
  return out;
}

/**
 * phi = |mean of the unit vectors|. The vectors are re-normalised here rather than assumed unit, because a caller
 * that passes raw embeddings would otherwise get a magnitude-weighted average and not this quantity at all.
 * ORDER-INVARIANT: see the header. Dimension mismatch throws rather than silently truncating.
 */
function phi(vectors) {
  if (!vectors || vectors.length === 0) return null;         // no population, no order parameter
  const D = vectors[0].length;
  const sum = new Float64Array(D);
  for (const v of vectors) {
    if (v.length !== D) throw new Error(`dimension mismatch: ${v.length} against ${D}`);
    const u = unit(v);
    for (let d = 0; d < D; d++) sum[d] += u[d];
  }
  return norm(sum) / vectors.length;
}

/** The disordered value at this N: what phi reads with no structure at all. This is the REGISTERED null. */
const baseline = (n) => (n > 0 ? 1 / Math.sqrt(n) : null);

/** log Gamma (Lanczos, g = 7). Used only for the exact null below. */
function lgamma(x) {
  const g = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x);
  x -= 1;
  let a = g[0];
  const t = x + 7.5;
  for (let i = 1; i < 9; i++) a += g[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

/**
 * The EXACT disordered value, and why it is here rather than instead of `baseline`.
 * For N independent directions in d dimensions, E|sum| = sqrt(N) * c_d with
 *     c_d = sqrt(2/d) * Gamma((d+1)/2) / Gamma(d/2),
 * so the null is c_d / sqrt(N), not 1 / sqrt(N). c_d -> 1 as d grows: 0.9213 at d = 3, 0.9961 at d = 64,
 * 0.99967 at d = 768. The board's embeddings are d = 768, so the registered 1/sqrt(N) is right there to 0.03% and
 * NOTHING in this run turns on the difference. It matters at small d, and it is the reason the re-derived table
 * reads ~7% under 1/sqrt(N) in its d = 3 column while the ruling's LCG table read ~2% under: a generator that is
 * not uniform on the sphere hides the correction. Kept beside the registered null, never in place of it.
 */
const dimFactor = (d) => Math.sqrt(2 / d) * Math.exp(lgamma((d + 1) / 2) - lgamma(d / 2));
const baselineExact = (n, d) => (n > 0 && d > 0 ? dimFactor(d) / Math.sqrt(n) : null);

/** Mulberry32 — seeded, so every control in the hand-back is reproducible from its seed. */
function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** A standard normal pair (Box-Muller). Gaussian coordinates are what make the direction uniform on the sphere;
 * a cube of uniforms is not uniform on the sphere and biases towards the corners. */
function gauss2(rand) {
  let u = rand(); while (u <= 0) u = rand();
  const r = Math.sqrt(-2 * Math.log(u)), t = 2 * Math.PI * rand();
  return [r * Math.cos(t), r * Math.sin(t)];
}

/** One random unit vector in d dimensions, uniform on the sphere. */
function randomUnit(d, rand) {
  const v = new Float64Array(d);
  for (let i = 0; i < d; i += 2) { const [a, b] = gauss2(rand); v[i] = a; if (i + 1 < d) v[i + 1] = b; }
  return unit(v);
}

/** Mean phi over `reps` populations of N independent random directions: the null, measured. */
function nullPhi(n, d, reps = NULL_REPS, seed = 20260920) {
  const rand = rng(seed);
  let s = 0;
  for (let r = 0; r < reps; r++) {
    const vs = []; for (let i = 0; i < n; i++) vs.push(randomUnit(d, rand));
    s += phi(vs);
  }
  return s / reps;
}

/**
 * The DISTRIBUTION control (not an order control — phi has none). Draw N vectors at random, without replacement,
 * from the pooled population of every embedded contribution on the board, and take phi. Repeat. This holds the
 * board's own embedding distribution fixed and destroys only session membership, so it answers: is this session
 * more aligned than N contributions drawn from the board at large? A real common direction must beat it.
 */
function poolControl(pool, n, reps = POOL_REPS, seed = 20260920) {
  if (!pool || pool.length < n || n < 1 || reps < 1) return null;
  const rand = rng(seed);
  const idx = new Int32Array(pool.length);
  const out = [];
  for (let r = 0; r < reps; r++) {
    for (let i = 0; i < pool.length; i++) idx[i] = i;
    const pick = [];
    for (let k = 0; k < n; k++) {                       // partial Fisher-Yates: an unbiased draw without replacement
      const j = k + Math.floor(rand() * (pool.length - k));
      const t = idx[k]; idx[k] = idx[j]; idx[j] = t;
      pick.push(pool[idx[k]]);
    }
    out.push(phi(pick));
  }
  out.sort((a, b) => a - b);
  const q = (p) => { const h = (out.length - 1) * p, lo = Math.floor(h); return out[lo] + (h - lo) * ((out[lo + 1] ?? out[lo]) - out[lo]); };
  return { reps, mean: out.reduce((s, x) => s + x, 0) / out.length, p05: q(0.05), median: q(0.5), p95: q(0.95) };
}

const quantile = (a, p) => {
  const s = [...a].sort((x, y) => x - y);
  const h = (s.length - 1) * p, lo = Math.floor(h);
  return s[lo] + (h - lo) * ((s[lo + 1] ?? s[lo]) - s[lo]);
};

/**
 * THE SAME-PANE-SAME-ERA CONTROL (L064), the one this tool's own §5.2 registered against its own result.
 *
 * The whole-board pool mixes every pane across 40 days, so a session can beat it for being one pane, on one
 * night, about one thing. This holds pane and era fixed and destroys only session membership: draw N from the
 * contributions the SAME pane made within +/-`eraHours` of this session's span, EXCLUDING the session's own —
 * so it is never a self-comparison.
 *
 * Returns null when the era pool is smaller than N: that session is UNTESTABLE and must be reported as such,
 * never counted as a pass or a fail. `fake` is the null: one extra draw from the same pool, which is
 * era-typical by construction and should clear p95 about 5% of the time. `spread` is p95 - p05; at ~0 the pool
 * cannot discriminate and the cell is vacuous however the comparison lands.
 */
function eraControl(pool, session, eraHours = 24, reps = POOL_REPS, seed = 20260920) {
  const own = new Set(session.lines);
  const lo = session.t0 - eraHours * 3600e3, hi = session.t1 + eraHours * 3600e3;
  const era = pool.filter((p) => p.pane === session.pane && !own.has(p.line) && p.ts >= lo && p.ts <= hi);
  if (era.length < session.n) return { eligible: false, eraPool: era.length, need: session.n };
  const vecs = era.map((p) => p.v);
  const c = poolControl(vecs, session.n, reps, seed + session.n);
  const fake = poolControl(vecs, session.n, 1, seed + 977 + session.n);
  return { eligible: true, eraPool: era.length, ...c, spread: c.p95 - c.p05, fakePhi: fake.median,
    fakeBeats: fake.median > c.p95 };
}

/**
 * The registered reading, applied to the session set. The prediction under test
 * (c3_ruling_order_parameter_2026-09-20.md §5): phi sits AT OR BELOW its 1/sqrt(N) baseline.
 * The falsifier: materially ABOVE it while r-corrected says drift suspends BOTH readings.
 * "Materially" is fixed here, before any board number, as a ratio of 1.10 — ten percent above the disordered
 * value — and the count of sessions above it is reported beside the median so the bar can be argued with.
 */
function classify(sessions, materialRatio = 1.10) {
  const rs = sessions.map((s) => s.ratio).filter((x) => x !== null && Number.isFinite(x));
  if (rs.length === 0) return { verdict: 'NO SESSIONS', n: 0 };
  const medianRatio = quantile(rs, 0.5);
  const above = rs.filter((x) => x > materialRatio).length;
  const atOrBelow = rs.filter((x) => x <= 1).length;
  const verdict = medianRatio > materialRatio ? 'ABOVE THE NULL (falsifier condition on this scalar)'
    : medianRatio <= 1 ? 'AT OR BELOW THE NULL (as predicted)'
      : 'BETWEEN: above 1 but not materially so';
  return { verdict, materialRatio, sessions: rs.length, medianRatio, meanRatio: rs.reduce((s, x) => s + x, 0) / rs.length,
    q1Ratio: quantile(rs, 0.25), q3Ratio: quantile(rs, 0.75), minRatio: Math.min(...rs), maxRatio: Math.max(...rs),
    sessionsAboveMaterial: above, sessionsAtOrBelowNull: atOrBelow };
}

/* ---- CLI ---- */

function printNullTable(reps = NULL_REPS, seed = 20260920) {
  const Ns = [5, 10, 20, 50, 100, 200, 500, 1000];
  const Ds = [3, 64, 768];
  console.log(`THE NULL, RE-DERIVED — mean phi over ${reps} replicates of N independent random directions.`);
  console.log('RNG: mulberry32 + Box-Muller (uniform on the sphere), seed ' + seed + '. The ruling\'s table used an LCG');
  console.log('and stated that its agreement degrades past N = 100; this re-derivation is the check on that limit.\n');
  console.log('    N |    d = 3 |   d = 64 |  d = 768 |   1/sqrt(N) | worst dev vs 1/sqrt(N) | worst dev vs exact c_d/sqrt(N)');
  const rows = [];
  for (const n of Ns) {
    const cells = Ds.map((d) => nullPhi(n, d, reps, seed + n * 31 + d));
    const b = baseline(n);
    const dev = Math.max(...cells.map((c) => Math.abs(c - b) / b));
    const devExact = Math.max(...cells.map((c, i) => Math.abs(c - baselineExact(n, Ds[i])) / baselineExact(n, Ds[i])));
    rows.push({ n, d3: cells[0], d64: cells[1], d768: cells[2], baseline: b, worstRelDev: dev, worstRelDevExact: devExact });
    console.log(`  ${String(n).padStart(4)} | ${cells.map((c) => c.toFixed(4).padStart(8)).join(' | ')} | ${b.toFixed(4).padStart(11)} | ${(100 * dev).toFixed(1).padStart(21)}% | ${(100 * devExact).toFixed(1).padStart(28)}%`);
  }
  return rows;
}

async function main(argv) {
  const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
  const has = (k) => argv.includes(k);
  const seed = Number(arg('--seed', '20260920')) || 20260920;

  if (has('--null-table')) { printNullTable(Number(arg('--null-reps', String(NULL_REPS))) || NULL_REPS, seed); return 0; }

  const deps = arg('--deps', null);
  if (!deps) { console.error('--deps <dir> is required (node_modules/@huggingface/transformers + models/), or use --null-table'); return 2; }
  const { resolveBoard, NO_BOARD } = require('./deference-unit.js');
  const board = resolveBoard(arg('--board', null));
  if (!board) { console.error('vicsek-phi: ' + NO_BOARD); return 2; }
  const out = arg('--out', null);
  const min = Number(arg('--min', String(MIN_CONTRIB))) || MIN_CONTRIB;
  const maxSessions = Number(arg('--max-sessions', '0')) || 0;
  const poolReps = Number(arg('--pool-reps', String(POOL_REPS))) || POOL_REPS;
  const eraHours = Number(arg('--era-hours', '24')) || 24;

  // The universe, the session rule and the encoder all come from the tools that already own them: one copy each.
  const { readBoard, dedupeRows, universe } = require('./deference-unit.js');
  const { sessionsOf, loadEncoder } = require('./order-parameter.js');

  const b = readBoard(board);
  const u = universe(b);
  const rows = dedupeRows(b.rows);
  console.log('THE UNIVERSE FIRST — one machine\'s board; the figures reach no further.');
  console.log(`  ${u.file}`);
  console.log(`  ${u.total} rows, ${u.torn} unparseable/unstamped, ${u.kept} usable, ${u.kept - rows.length} duplicate rows dropped`);
  console.log(`  ${u.from} -> ${u.to} · ${u.days} days with rows`);
  for (const g of u.gaps) console.log(`  GAP ${g}`);

  const all = sessionsOf(rows).sort((a, b2) => b2.rows[0].ts - a.rows[0].ts);
  const eligible = all.filter((s) => s.rows.length >= min);
  const picked = maxSessions ? eligible.slice(0, maxSessions) : eligible;
  console.log(`\nsessions ${all.length} · with >= ${min} contributions ${eligible.length} · embedding ${picked.length}`);
  console.log('phi is ORDER-INVARIANT: the shuffle below is a control on the embedding DISTRIBUTION, not on order.\n');

  const enc = await loadEncoder(deps);
  console.log(`encoder: T1's — gte-base-en-v1.5 q8, onnx sha256 ${enc.onnxSha.slice(0, 16)}…, @huggingface/transformers ${enc.version}, remote fetching off\n`);

  const sessions = [];
  const pool = [];        // vectors only, for the whole-board control
  const entries = [];     // the same vectors WITH pane and ts, for the same-era control
  let done = 0; const t0 = Date.now();
  for (const s of picked) {
    const vecs = [];
    for (const r of s.rows) vecs.push((await enc.embed(r.text)).v);
    for (let i = 0; i < vecs.length; i++) { pool.push(vecs[i]); entries.push({ pane: s.pane, ts: s.rows[i].ts, line: s.rows[i].line, v: vecs[i] }); }
    const p = phi(vecs), base = baseline(vecs.length);
    sessions.push({ pane: s.pane, from: new Date(s.rows[0].ts).toISOString(), to: new Date(s.rows[s.rows.length - 1].ts).toISOString(),
      t0: s.rows[0].ts, t1: s.rows[s.rows.length - 1].ts, lines: s.rows.map((r) => r.line),
      n: vecs.length, phi: p, baseline: base, ratio: p / base, vectors: vecs });
    done++;
    if (done % 10 === 0 || done === picked.length) console.log(`  ${done}/${picked.length} sessions · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }

  // Both distribution controls need the whole pool, so they run after every session is embedded.
  for (const s of sessions) {
    s.control = poolControl(pool, s.n, poolReps, seed + s.n);
    s.beatsPool = s.control ? s.phi > s.control.p95 : null;
    s.era = eraControl(entries, s, eraHours, poolReps, seed);
    s.beatsEra = s.era.eligible ? s.phi > s.era.p95 : null;
    delete s.vectors;
  }
  const verdict = classify(sessions);
  const beats = sessions.filter((s) => s.beatsPool).length;

  console.log(`\nPER SESSION: phi vs its own 1/sqrt(N) and vs ${poolReps} draws of N from the board's pooled contributions`);
  console.log('  pane                          N |    phi | 1/sqrt(N) | ratio | pool p95 | beats pool');
  for (const s of sessions.slice().sort((a, c) => c.ratio - a.ratio)) {
    console.log(`  ${String(s.pane).slice(0, 28).padEnd(28)} ${String(s.n).padStart(3)} | ${s.phi.toFixed(4)} |    ${s.baseline.toFixed(4)} | ${s.ratio.toFixed(3).padStart(5)} |   ${s.control ? s.control.p95.toFixed(4) : '  n/a '} | ${s.beatsPool ? 'YES' : 'no'}`);
  }
  // THE SAME-PANE-SAME-ERA CONTROL (L064) — the control this tool's own §5.2 registered against its own result.
  const elig = sessions.filter((s) => s.era.eligible);
  const wasPassing = elig.filter((s) => s.beatsPool);
  const survived = wasPassing.filter((s) => s.beatsEra).length;
  const nullFires = elig.filter((s) => s.era.fakeBeats).length;
  const vacuous = elig.filter((s) => s.era.spread < 1e-6).length;
  console.log(`\nSAME-PANE-SAME-ERA CONTROL (±${eraHours}h, the session's own contributions excluded)`);
  console.log(`  eligible (era pool >= N) ${elig.length}/${sessions.length} · UNTESTABLE ${sessions.length - elig.length} — era pool too small; never a pass or a fail`);
  console.log(`  NULL: era-typical fake sessions clearing their own p95 ${nullFires}/${elig.length} (${(100 * nullFires / (elig.length || 1)).toFixed(1)}%; ~5% expected) · degenerate pools (p95-p05 < 1e-6) ${vacuous}`);
  console.log(`  beat the WHOLE-BOARD p95 and eligible here: ${wasPassing.length} · of those, also beat their SAME-ERA p95: ${survived} (${(100 * survived / (wasPassing.length || 1)).toFixed(1)}%)`);
  console.log('  pane                          N | era pool |    phi | era p95 | spread | beats era | beat board');
  for (const s of elig.slice().sort((a, c) => (c.phi - c.era.p95) - (a.phi - a.era.p95))) {
    console.log(`  ${String(s.pane).slice(0, 28).padEnd(28)} ${String(s.n).padStart(3)} | ${String(s.era.eraPool).padStart(8)} | ${s.phi.toFixed(4)} |  ${s.era.p95.toFixed(4)} | ${s.era.spread.toFixed(4)} | ${s.beatsEra ? 'YES' : 'no '}       | ${s.beatsPool ? 'yes' : 'no'}`);
  }

  console.log(`\nVERDICT (registered before the run, §5 of the ruling): ${verdict.verdict}`);
  console.log(`  median ratio phi/(1/sqrt(N)) ${verdict.medianRatio.toFixed(3)} · Q1 ${verdict.q1Ratio.toFixed(3)} · Q3 ${verdict.q3Ratio.toFixed(3)} · min ${verdict.minRatio.toFixed(3)} · max ${verdict.maxRatio.toFixed(3)}`);
  console.log(`  sessions at or below the null ${verdict.sessionsAtOrBelowNull}/${verdict.sessions} · materially above (>${verdict.materialRatio}) ${verdict.sessionsAboveMaterial}/${verdict.sessions}`);
  console.log(`  sessions beating their own pooled-draw p95 ${beats}/${sessions.length}`);

  if (out) {
    fs.writeFileSync(out, JSON.stringify({ tool: 'vicsek-phi', generated: new Date().toISOString(), board,
      universe: u, encoder: { id: 'Alibaba-NLP/gte-base-en-v1.5', dtype: 'q8', onnxSha: enc.onnxSha, transformers: enc.version },
      method: { formula: 'phi = |mean of unit vectors|', orderInvariant: true, controlIsDistributionNotOrder: true,
        minContributions: min, poolReps, seed, eraHours, nullForm: '1/sqrt(N) at the session\'s own N',
        eraRule: 'same pane, ±eraHours of the session span, the session\'s own contributions excluded, drawn from the embedded set; eligible when the era pool >= N' },
      sessionsTotal: all.length, sessionsEligible: eligible.length, sessionsEmbedded: picked.length,
      poolSize: pool.length, verdict, sessions }, null, 1));
    console.log(`\nwritten to ${out}`);
  }
  return 0;
}

module.exports = { phi, unit, norm, baseline, baselineExact, dimFactor, lgamma, nullPhi, eraControl, poolControl, classify, rng, randomUnit, printNullTable,
  MIN_CONTRIB, POOL_REPS, NULL_REPS };
if (require.main === module) main(process.argv.slice(2)).then((c) => process.exit(c)).catch((e) => { console.error(e); process.exit(3); });
