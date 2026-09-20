/* order-parameter.js — C3, the Vicsek order parameter over the board: how aligned is each contribution with what
 * the session has already said?
 *
 * THE DESIGN IS THE THIRD PLACE'S (DIVERSITY_COLLAPSE_INSIGHTS_2026-09-14.md §C item 3): "mean cosine of each
 * contribution to the running centroid… the scalar for the thing the room calls phase-lock. Watch it climb toward 1
 * inside a session." The prediction and the falsifier were REGISTERED BEFORE THIS RAN, in
 * exo_memory/handback/p-order-parameter-C_2026-09-20.md §1 and §1b, together with the session rule, the contribution
 * rule and the scoring bars, so no bar could be chosen after seeing a curve.
 *
 * THE ENCODER IS T1'S, NOT A NEW ONE: Alibaba-NLP/gte-base-en-v1.5 q8, the same ONNX file by sha256, CLS pooling,
 * L2, 1,800-id windows, token-weighted across windows — the path dev/diversity/score-portable.mjs uses. A different
 * encoder would make this incomparable with T1, which is why the row names it. The model is hash-checked before load
 * and remote fetching is off.
 *
 * WHAT ITS NUMBER MUST NEVER BE QUOTED PAST:
 *   ONE MACHINE'S BOARD, and it prints the row count, the torn rows and the day gaps first. The other machine's rows
 *   are on the other machine's disk.
 *   r IS A SIMILARITY, NOT AN AGREEMENT. Two turns about the same subject score high whether they agree or fight;
 *   that is exactly what the registered falsifier is for.
 *
 * Read-only.
 *   node consonance/tools/order-parameter.js --deps <dir with node_modules + models> [--board <path>]
 *        [--out <json>] [--max-sessions N] [--min N]
 */
'use strict';
const fs = require('fs');
const path = require('path');

const GAP_MS = 60 * 60 * 1000;   // the registered session gap
const MIN_CONTRIB = 20;          // the registered floor for the slope test
const WIN = 1800;                // T1's window, in tokens

/* ---- pure core ---- */

/** Sessions of CONTRIBUTIONS (assistant rows), per pane, split at a gap. Rows may arrive in any order. */
function sessionsOf(rows, gapMs = GAP_MS) {
  const byPane = new Map();
  for (const r of rows) {
    if (!r || r.role !== 'assistant') continue;
    if (!byPane.has(r.pane)) byPane.set(r.pane, []);
    byPane.get(r.pane).push(r);
  }
  const out = [];
  for (const [pane, st] of byPane) {
    st.sort((a, b) => (a.ts - b.ts) || (a.line - b.line));
    let cur = [st[0]];
    for (let i = 1; i < st.length; i++) {
      if (st[i].ts - st[i - 1].ts <= gapMs) cur.push(st[i]);
      else { out.push({ pane, rows: cur }); cur = [st[i]]; }
    }
    out.push({ pane, rows: cur });
  }
  return out;
}

const dot = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; };

/** r_k = cos(v_k, centroid(v_1..v_{k-1})), k >= 2. The centroid is RUNNING: that is the instrument. */
function orderCurve(vectors) {
  const r = [];
  if (!vectors || vectors.length < 2) return r;
  const D = vectors[0].length;
  const sum = new Float64Array(D);
  for (let d = 0; d < D; d++) sum[d] = vectors[0][d];
  for (let k = 1; k < vectors.length; k++) {
    let n = 0; for (let d = 0; d < D; d++) n += sum[d] * sum[d];
    n = Math.sqrt(n) || 1;
    const c = new Float64Array(D);
    for (let d = 0; d < D; d++) c[d] = sum[d] / n;
    r.push(dot(vectors[k], c));
    for (let d = 0; d < D; d++) sum[d] += vectors[k][d];
  }
  return r;
}

/** OLS slope of y on its index. null for fewer than two points: one point makes no claim. */
function slope(ys) {
  if (!ys || ys.length < 2) return null;
  const n = ys.length;
  const mx = (n - 1) / 2;
  let my = 0; for (const y of ys) my += y; my /= n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) { num += (i - mx) * (ys[i] - my); den += (i - mx) * (i - mx); }
  return den === 0 ? null : num / den;
}

/** Last fifth minus first fifth; null under five points. */
function quintileGap(rs) {
  if (!rs || rs.length < 5) return null;
  const q = Math.max(1, Math.floor(rs.length / 5));
  const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
  return mean(rs.slice(-q)) - mean(rs.slice(0, q));
}

const quantile = (a, p) => {
  const s = [...a].sort((x, y) => x - y);
  const h = (s.length - 1) * p, lo = Math.floor(h);
  return s[lo] + (h - lo) * ((s[lo + 1] ?? s[lo]) - s[lo]);
};

/** The REGISTERED bars, applied. Sessions: [{slope, gap, mean, n}]. */
function classify(sessions) {
  if (!sessions || sessions.length < 3) return { verdict: 'NOT ENOUGH SESSIONS', n: sessions ? sessions.length : 0 };
  const means = sessions.map((s) => s.mean);
  const iqr = quantile(means, 0.75) - quantile(means, 0.25);      // the between-session spread, the bar for both tests
  const positiveSlopes = sessions.filter((s) => s.slope > 0).length;
  const majority = positiveSlopes > sessions.length / 2;
  const gaps = sessions.map((s) => s.gap).filter((g) => g !== null);
  const medianGap = gaps.length ? quantile(gaps, 0.5) : 0;
  const climbs = majority && medianGap > iqr;
  const flatWithin = sessions.filter((s) => Math.abs(s.gap ?? 0) <= iqr).length > sessions.length / 2;
  const differsBetween = iqr > 0 && (Math.max(...means) - Math.min(...means)) > iqr;
  let verdict = 'NEITHER', why = '';
  if (climbs) { verdict = 'CLIMBS'; why = 'a majority of sessions have a positive slope and the median quintile gap exceeds the between-session IQR'; }
  else if (flatWithin && differsBetween) { verdict = 'MEASURES THE TOPIC'; why = 'most sessions are flat within (|gap| <= IQR) while the session means differ by more than the IQR — the registered falsifier'; }
  else why = 'neither registered outcome holds; reported as itself rather than rounded';
  return { verdict, why, sessions: sessions.length, positiveSlopes, iqrOfSessionMeans: iqr, medianQuintileGap: medianGap,
    meanOfSessionMeans: means.reduce((s, x) => s + x, 0) / means.length };
}

/* ---- the shuffle control (added AFTER run 1, post-hoc and labelled as such in the hand-back) ----
 * A running centroid is a MEAN ESTIMATE, and an estimate gets less noisy as k grows. So a session of i.i.d.
 * contributions with no temporal structure whatsoever still yields a RISING r: the curve climbs toward the
 * population's own coherence simply because the centroid stops wobbling. The registered bars cannot see that.
 * The control: recompute the curve over the SAME vectors in a shuffled order. Under the artifact alone, order
 * carries no information and the shuffled climb equals the real one. A real within-session lock must beat it. */

/** Mulberry32 — a seeded RNG, so a control run is reproducible from its seed. */
function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** Fisher-Yates over a COPY, so the caller's order is never disturbed. */
function shuffled(arr, rand) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}

/** Mean slope and mean quintile gap over N shuffles of the same vectors: what the climb is worth. */
function shuffleControl(vectors, n = 20, seed = 20260920) {
  if (!vectors || vectors.length < 2 || n < 1) return null;
  const rand = rng(seed);
  let sSlope = 0, sGap = 0, kSlope = 0, kGap = 0;
  for (let i = 0; i < n; i++) {
    const rs = orderCurve(shuffled(vectors, rand));
    const sl = slope(rs), gp = quintileGap(rs);
    if (sl !== null) { sSlope += sl; kSlope++; }
    if (gp !== null) { sGap += gp; kGap++; }
  }
  return { shuffles: n, slope: kSlope ? sSlope / kSlope : null, gap: kGap ? sGap / kGap : null };
}

/* ---- the encoder side: T1's, hash-checked ---- */

const ONNX_SHA = 'e7f6af7a9457d4fdd3af220c68e9a37325aad7c2d306bbc855fe0d019c326509';   // T1's frozen model

/** The hash gate, BEFORE the library is even imported: a wrong model must fail as a wrong model, not later and not
 * as something else. Split out so it is testable without the encoder present (mutant #12 survived while it was not). */
function checkEncoderFile(deps) {
  const ONNX = path.join(deps, 'models', 'Alibaba-NLP/gte-base-en-v1.5/onnx/model_quantized.onnx');
  const got = require('crypto').createHash('sha256').update(fs.readFileSync(ONNX)).digest('hex');
  if (got !== ONNX_SHA) throw new Error(`encoder file does not hash to T1's frozen model: ${got}`);
  return got;
}

async function loadEncoder(deps) {
  const got = checkEncoderFile(deps);
  const { env, AutoTokenizer, AutoModel, Tensor } = await import(
    require('url').pathToFileURL(path.join(deps, 'node_modules/@huggingface/transformers/dist/transformers.node.mjs')).href);
  const MODELS = path.join(deps, 'models');
  env.allowRemoteModels = false; env.localModelPath = MODELS; env.cacheDir = MODELS;
  const ID = 'Alibaba-NLP/gte-base-en-v1.5';
  const tok = await AutoTokenizer.from_pretrained(ID);
  const model = await AutoModel.from_pretrained(ID, { dtype: 'q8' });
  const special = Array.from(tok('', { add_special_tokens: true }).input_ids.data, Number);
  const CLS = special[0], SEP = special[special.length - 1];
  const version = JSON.parse(fs.readFileSync(path.join(deps, 'node_modules/@huggingface/transformers/package.json'), 'utf8')).version;
  /** T1's embedding: 1,800-id windows, CLS pooling, L2, token-weighted mean across windows, renormalised. */
  async function embed(text) {
    const ids = Array.from(tok(String(text || ' '), { add_special_tokens: false }).input_ids.data, Number);
    const chunks = [];
    for (let i = 0; i < Math.max(1, ids.length); i += WIN) chunks.push(ids.slice(i, i + WIN));
    let acc = null, tot = 0, D = 0;
    for (const body of chunks) {
      const seq = [CLS, ...body, SEP], L = seq.length;
      const out = await model({
        input_ids: new Tensor('int64', BigInt64Array.from(seq.map(BigInt)), [1, L]),
        attention_mask: new Tensor('int64', new BigInt64Array(L).fill(1n), [1, L]),
        token_type_ids: new Tensor('int64', new BigInt64Array(L), [1, L]),
      });
      D = out.last_hidden_state.dims[2];
      const v = Float64Array.from(out.last_hidden_state.data.slice(0, D));
      let n = 0; for (const x of v) n += x * x; n = Math.sqrt(n) || 1;
      for (let d = 0; d < D; d++) v[d] /= n;
      const w = Math.max(1, body.length);
      if (!acc) acc = new Float64Array(D);
      for (let d = 0; d < D; d++) acc[d] += v[d] * w;
      tot += w;
    }
    let n = 0; for (const x of acc) n += x * x; n = Math.sqrt(n) || 1;
    const v = new Float64Array(D);
    for (let d = 0; d < D; d++) v[d] = acc[d] / n;
    return { v, tokens: ids.length };
  }
  return { embed, version, onnxSha: got };
}

/* ---- THE CONTROL GATE (L061) — no shuffle control, no verdict ---------------------------------
 * Run 1 printed CLIMBS, passing its registered bars by 0.0022, while `--shuffles` sat at its default of 0 and the
 * control this file exports was never called. The control is the only thing that separates a real within-session
 * lock from the estimator's own climb, and C measured that artifact near +0.09 on i.i.d. vectors at this board's
 * dispersion (`handback/p-order-parameter-C_2026-09-20.md` §9; the two tests above at `:142` and `:150` are it in
 * miniature). A margin of 0.0022 against an artifact of that size is not a verdict; it is a number waiting for its
 * control.
 *
 * So the gate is on the VERDICT and on nothing else. Every measurement still prints and is still written: the
 * universe, the per-session curve, the slopes, the gaps, the IQR, the medians. What is withheld is the ruling —
 * in the log AND in the JSON, because a verdict that escapes to disk is quoted later exactly as one that was
 * printed. The estimator, the bars and every number are untouched; this decides nothing about the measurement and
 * only refuses to name a result the run cannot yet support. */
const WITHHELD = 'WITHHELD — the registered shuffle control did not run';
const WITHHELD_WHY = 'the running-centroid estimator climbs on shuffled order too, so without the control a climb '
  + 'cannot be told from the artifact; re-run with --shuffles to get a ruling';

/** The verdict as it may be WRITTEN: the ruling withheld when the control did not run, every measured field kept. */
function gateVerdict(verdict, shuffles) {
  if (shuffles) return verdict;
  return { ...verdict, verdict: WITHHELD, why: WITHHELD_WHY, controlRan: false };
}

/** The verdict as it may be PRINTED. Refusing, it names the flag first — a re-runner needs the next command, not
 *  a complaint — and then prints the same measured line it would have printed anyway. */
function verdictReport(verdict, shuffles) {
  const measured = `  sessions ${verdict.sessions} · positive slopes ${verdict.positiveSlopes} · median quintile gap `
    + `${verdict.medianQuintileGap?.toFixed(4)} · IQR of session means ${verdict.iqrOfSessionMeans?.toFixed(4)} · `
    + `mean r ${verdict.meanOfSessionMeans?.toFixed(4)}`;
  if (!shuffles) {
    return `\nNO RULING — this run did not run its own control.\n`
      + `  Re-run with --shuffles 20 (any n > 0) and the ruling prints.\n`
      + `  Why: ${WITHHELD_WHY}.\n`
      + `  The measurement below stands and is unchanged by this refusal:\n${measured}`;
  }
  return `\nVERDICT (registered bars): ${verdict.verdict}\n  ${verdict.why}\n${measured}`;
}

async function main(argv) {
  const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
  const deps = arg('--deps', null);
  if (!deps) { console.error('--deps <dir> is required: the directory holding node_modules/@huggingface/transformers and models/'); return 2; }
  const board = arg('--board', 'C:/Consonance/data/board.jsonl');
  const out = arg('--out', null);
  const maxSessions = Number(arg('--max-sessions', '0')) || 0;
  const min = Number(arg('--min', String(MIN_CONTRIB))) || MIN_CONTRIB;
  const shuffles = Number(arg('--shuffles', '0')) || 0;   // the post-hoc control; 0 = the registered run exactly
  const { readBoard, dedupeRows, universe } = require('./deference-unit.js');
  const b = readBoard(board);
  const u = universe(b);
  const rows = dedupeRows(b.rows);
  console.log('THE UNIVERSE FIRST — one machine\'s board; the figures reach no further.');
  console.log(`  ${u.file}`);
  console.log(`  ${u.total} rows, ${u.torn} unparseable/unstamped, ${u.kept} usable, ${u.kept - rows.length} duplicate rows dropped`);
  console.log(`  ${u.from} -> ${u.to} · ${u.days} days with rows`);
  for (const g of u.gaps) console.log(`  GAP ${g}`);
  const all = sessionsOf(rows).sort((a, b2) => b2.rows[0].ts - a.rows[0].ts);   // reverse chronological, as registered
  const eligible = all.filter((s) => s.rows.length >= min);
  const picked = maxSessions ? eligible.slice(0, maxSessions) : eligible;
  console.log(`\nsessions ${all.length} · with >= ${min} contributions ${eligible.length} · embedding ${picked.length} (reverse chronological, as registered)`);
  const enc = await loadEncoder(deps);
  console.log(`encoder: T1's — gte-base-en-v1.5 q8, onnx sha256 ${enc.onnxSha.slice(0, 16)}…, @huggingface/transformers ${enc.version}, remote fetching off\n`);
  const results = [];
  let done = 0, t0 = Date.now();
  for (const s of picked) {
    const vecs = [];
    for (const r of s.rows) vecs.push((await enc.embed(r.text)).v);
    const rs = orderCurve(vecs);
    const ctl = shuffles ? shuffleControl(vecs, shuffles) : null;
    const mean = rs.reduce((x, y) => x + y, 0) / rs.length;
    results.push({ pane: s.pane, from: new Date(s.rows[0].ts).toISOString(), to: new Date(s.rows[s.rows.length - 1].ts).toISOString(),
      n: s.rows.length, mean, slope: slope(rs), gap: quintileGap(rs), first: rs[0], last: rs[rs.length - 1], control: ctl, r: rs.map((x) => +x.toFixed(4)) });
    done++;
    if (done % 5 === 0 || done === picked.length) console.log(`  ${done}/${picked.length} sessions · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  if (shuffles) {
    const real = results.map((x) => x.gap).filter((g) => g !== null);
    const sham = results.map((x) => x.control && x.control.gap).filter((g) => g !== null && g !== undefined);
    const beats = results.filter((x) => x.control && x.gap !== null && x.control.gap !== null && x.gap > x.control.gap).length;
    const med = (a) => quantile(a, 0.5);
    console.log(`
SHUFFLE CONTROL (post-hoc, ${shuffles} shuffles/session): median real quintile gap ${med(real).toFixed(4)} vs shuffled ${med(sham).toFixed(4)} · sessions where real beats its own shuffle ${beats}/${results.length}`);
  }
  const verdict = classify(results.map((x) => ({ slope: x.slope, gap: x.gap, mean: x.mean, n: x.n })));
  console.log(verdictReport(verdict, shuffles));
  if (out) {
    fs.writeFileSync(out, JSON.stringify({ tool: 'order-parameter', generated: new Date().toISOString(), board,
      universe: u, encoder: { id: 'Alibaba-NLP/gte-base-en-v1.5', dtype: 'q8', onnxSha: enc.onnxSha, transformers: enc.version },
      method: { gapMs: GAP_MS, minContributions: min, window: WIN, pooling: 'CLS+L2, token-weighted across windows', contribution: 'assistant rows' },
      sessionsTotal: all.length, sessionsEligible: eligible.length, sessionsEmbedded: picked.length,
      verdict: gateVerdict(verdict, shuffles), sessions: results }, null, 1));
    console.log(`\nwritten to ${out}`);
  }
  return 0;
}

module.exports = { sessionsOf, orderCurve, slope, quintileGap, classify, shuffleControl, shuffled, rng, loadEncoder, checkEncoderFile, gateVerdict, verdictReport, GAP_MS, MIN_CONTRIB };
if (require.main === module) main(process.argv.slice(2)).then((c) => process.exit(c)).catch((e) => { console.error(e); process.exit(3); });
