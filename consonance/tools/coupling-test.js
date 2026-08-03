// coupling-test.js — does a catch in one arm make another catch in the SAME arm more likely soon?
//
// Track 2 has predicted since 2026-07-27 that catches couple within the flinch system along
// shared roots and do NOT couple across into the blind-spot system. The map has never measured
// it. This is the instrument, committed before the corpus exists, on the pattern that worked
// twice today: build it, anchor it on arithmetic done by hand, and let anyone re-run it.
//
// THE TEST. Entries are grouped into sessions and ordered in time. Every consecutive pair within
// a session is same-arm or cross-arm. Under coupling, same-arm firings sit closer together than
// cross-arm ones. The null shuffles the ARM LABELS within each session and asks how often chance
// produces what was observed.
//
// WHY PERMUTING WITHIN SESSION IS THE RIGHT NULL, and it answers the base-rate worry directly:
// a permutation reuses the same multiset of labels the session actually had, so if one arm has
// three times the entries, EVERY REPLICATE HAS THAT SAME IMBALANCE. Session membership, entry
// times, session lengths and per-arm counts are all preserved exactly. Only the assignment of
// labels to time-points moves. An imbalance cannot manufacture a result it is also present in
// under the null.
//
// COROLLARY WORTH KNOWING BEFORE YOU CHOOSE A SESSION BOUNDARY: any preprocessing computed from
// TIMESTAMPS ALONE — session cuts, filters, weighting — is identical in the observed data and in
// every replicate, so it cannot inflate the false-positive rate. It is only label-aware choices
// that can. That is what licenses fitting a session boundary to the gap distribution: do it
// blind to the arm column and the test stays honest.
//
// THE STATISTICS, and the first is primary for a reason.
//
//   ADJACENCY   the fraction of consecutive pairs that are same-arm. Scale-free, robust, and
//               ALWAYS DEFINED. Coupling predicts it HIGH.
//   MEDIAN GAP  median(same-arm gaps) - median(cross-arm gaps). Coupling predicts NEGATIVE.
//   LOG GAP     mean of log(1+gap), same minus cross. Coupling predicts NEGATIVE.
//   MEAN GAP    the obvious statistic, and reported LAST on purpose.
//
// WHY MEAN GAP IS NOT PRIMARY. Timestamp gaps are heavy-tailed — one long pause dominates a
// mean. Worse, in this corpus the largest gaps are BY CONSTRUCTION the ones nearest the session
// boundary, so a mean-based statistic is maximally sensitive to exactly the parameter that was
// picked by feel. Median and log-gap decouple the statistic from that choice; the adjacency rate
// removes gap magnitudes from the question altogether. Mean gap is computed and printed so the
// registered statistic is available, not because it is the best one.
//
// AND THE DEFINEDNESS PROBLEM, which is the second reason adjacency leads: a replicate that
// happens to place all of one arm's labels together can produce NO cross-arm pairs, and then the
// gap difference is undefined. Dropping those replicates conditions the null on a property of
// the statistic itself. The adjacency rate never goes undefined, so it needs no such conditioning.
// The count of undefined replicates is printed for every gap statistic; if it is not near zero,
// prefer adjacency and say so in the write-up.
//
// DETERMINISTIC. A seeded xorshift, written out below rather than Math.random, so the same corpus
// and the same seed give byte-identical output on any machine. Where the number of distinct label
// arrangements is small the test ENUMERATES THEM EXHAUSTIVELY instead of sampling, so small cases
// have exact p-values that can be checked by hand — and the tests do check them by hand.
//
//   node coupling-test.js corpus.tsv
//   node coupling-test.js corpus.tsv --reps 10000 --seed 1 --json
//   node coupling-test.js corpus.tsv --strata actor     also hold `actor` constant in the null
//
// Corpus format — TSV, header exactly:
//   session  t  arm  actor
//     session  any string; entries sharing it are one session
//     t        integer or float, monotonically meaningful within a session (epoch ms is fine)
//     arm      the label under test — typically `flinch` or `blindspot`
//     actor    optional stratum; with --strata actor, labels are permuted within session x actor
'use strict';

const fs = require('fs');

/* ------------------------------------------------------------------ *
 * 1. a deterministic generator, written out so a result is reproducible
 * ------------------------------------------------------------------ */

/* xorshift32. Not cryptographic and does not need to be — it needs to be the SAME everywhere,
 * which Math.random explicitly is not. A permutation test whose p-value moves between machines
 * is not a test, it is a mood. */
function rng(seed) {
  let x = (seed | 0) || 0x9e3779b9;
  return () => {
    x ^= x << 13; x |= 0;
    x ^= x >>> 17;
    x ^= x << 5; x |= 0;
    return ((x >>> 0) / 4294967296);
  };
}

/** Fisher-Yates, in place, from a supplied generator. */
function shuffle(arr, rand) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}

/* ------------------------------------------------------------------ *
 * 2. the corpus
 * ------------------------------------------------------------------ */

const COLUMNS = ['session', 't', 'arm', 'actor'];

function parseCorpus(text) {
  const lines = String(text).split(/\r?\n/).filter(l => l.trim() !== '');
  if (!lines.length) throw new Error('empty corpus');
  const header = lines[0].split('\t').map(s => s.trim());
  const need = COLUMNS.slice(0, 3);
  if (need.some((c, i) => header[i] !== c)) {
    throw new Error(`header must begin: ${need.join(' ')} — got: ${header.join(' ')}`);
  }
  const hasActor = header[3] === 'actor';
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const f = lines[i].split('\t').map(s => s.trim());
    if (f.length < 3) throw new Error(`row ${i}: ${f.length} fields, need at least 3`);
    const t = Number(f[1]);
    if (!Number.isFinite(t)) throw new Error(`row ${i}: t must be a number, got "${f[1]}"`);
    if (!f[0]) throw new Error(`row ${i}: empty session`);
    if (!f[2]) throw new Error(`row ${i}: empty arm`);
    rows.push({ session: f[0], t, arm: f[2], actor: hasActor ? (f[3] || '') : '' });
  }
  return rows;
}

/* Sessions, each sorted in time. Ties broken by original file order, stated because a tie makes
 * "consecutive" ambiguous and an unstated tiebreak is a silent degree of freedom. */
function toSessions(rows) {
  const by = new Map();
  rows.forEach((r, i) => {
    if (!by.has(r.session)) by.set(r.session, []);
    by.get(r.session).push({ ...r, ord: i });
  });
  for (const list of by.values()) list.sort((a, b) => (a.t - b.t) || (a.ord - b.ord));
  return [...by.values()];
}

/* ------------------------------------------------------------------ *
 * 3. the statistics
 * ------------------------------------------------------------------ */

const median = (xs) => {
  if (!xs.length) return NaN;
  const s = [...xs].sort((a, b) => a - b), m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);

/** Every consecutive within-session pair, as {gap, same}. */
function pairs(sessions, labels) {
  const out = [];
  let k = 0;
  for (const sess of sessions) {
    for (let i = 0; i < sess.length; i++, k++) {
      if (i === 0) continue;
      out.push({ gap: sess[i].t - sess[i - 1].t, same: labels[k - 1] === labels[k] });
    }
  }
  return out;
}

/** Flat label array in the same order `pairs` walks. */
const flatLabels = (sessions) => sessions.flatMap(s => s.map(e => e.arm));

/* Coupling predicts adjacency HIGH and every gap difference NEGATIVE, so `dir` records which
 * tail each one is tested in. Registered here rather than chosen when the numbers arrive. */
const STATS = {
  adjacency:  { dir: 'high', of: (p) => (p.length ? p.filter(x => x.same).length / p.length : NaN) },
  medianGap:  { dir: 'low',  of: (p) => median(p.filter(x => x.same).map(x => x.gap)) -
                                        median(p.filter(x => !x.same).map(x => x.gap)) },
  logGap:     { dir: 'low',  of: (p) => mean(p.filter(x => x.same).map(x => Math.log1p(x.gap))) -
                                        mean(p.filter(x => !x.same).map(x => Math.log1p(x.gap))) },
  meanGap:    { dir: 'low',  of: (p) => mean(p.filter(x => x.same).map(x => x.gap)) -
                                        mean(p.filter(x => !x.same).map(x => x.gap)) },
};

/* ------------------------------------------------------------------ *
 * 4. the null
 * ------------------------------------------------------------------ */

/* Strata: labels are exchangeable only WITHIN a stratum. Session is always a stratum; --strata
 * actor adds it, which is how a "whose turn is it" confound gets held constant rather than
 * argued about. Every stratum you add makes a positive result mean more and makes it rarer. */
function strataOf(sessions, useActor) {
  const groups = [];
  let k = 0;
  for (const sess of sessions) {
    const by = new Map();
    for (const e of sess) {
      const key = useActor ? e.actor : '';
      if (!by.has(key)) by.set(key, []);
      by.get(key).push(k++);
    }
    for (const idx of by.values()) groups.push(idx);
  }
  return groups;
}

/** One permuted label array: within each stratum, the same labels, reassigned. */
function permute(labels, groups, rand) {
  const out = labels.slice();
  for (const idx of groups) {
    const vals = shuffle(idx.map(i => labels[i]), rand);
    idx.forEach((i, j) => { out[i] = vals[j]; });
  }
  return out;
}

/** Distinct arrangements across all strata, for deciding exact vs sampled. */
function arrangementCount(labels, groups) {
  let total = 1;
  for (const idx of groups) {
    const counts = new Map();
    for (const i of idx) counts.set(labels[i], (counts.get(labels[i]) || 0) + 1);
    let n = idx.length, ways = 1;
    for (let i = 2; i <= n; i++) ways *= i;
    for (const c of counts.values()) { let f = 1; for (let i = 2; i <= c; i++) f *= i; ways /= f; }
    total *= ways;
    if (!Number.isFinite(total) || total > 1e7) return Infinity;
  }
  return total;
}

/** Every distinct arrangement, for small corpora — the exact reference set, no sampling. */
function* allArrangements(labels, groups) {
  const perGroup = groups.map(idx => {
    const vals = idx.map(i => labels[i]);
    const seen = new Set(), out = [];
    const rec = (cur, rest) => {
      if (!rest.length) { const k = cur.join(' '); if (!seen.has(k)) { seen.add(k); out.push(cur.slice()); } return; }
      const used = new Set();
      for (let i = 0; i < rest.length; i++) {
        if (used.has(rest[i])) continue;
        used.add(rest[i]);
        rec(cur.concat(rest[i]), rest.slice(0, i).concat(rest.slice(i + 1)));
      }
    };
    rec([], vals);
    return out;
  });
  const idxs = new Array(groups.length).fill(0);
  for (;;) {
    const out = labels.slice();
    groups.forEach((idx, g) => idx.forEach((i, j) => { out[i] = perGroup[g][idxs[g]][j]; }));
    yield out;
    let g = groups.length - 1;
    while (g >= 0 && ++idxs[g] >= perGroup[g].length) { idxs[g] = 0; g--; }
    if (g < 0) return;
  }
}

/* ------------------------------------------------------------------ *
 * 5. the run
 * ------------------------------------------------------------------ */

const EXACT_LIMIT = 50000;

function run(rows, opt = {}) {
  const reps = opt.reps || 10000;
  const sessions = toSessions(rows);
  const labels = flatLabels(sessions);
  const groups = strataOf(sessions, !!opt.strataActor);
  const arms = [...new Set(labels)];
  if (arms.length < 2) throw new Error(`only one arm present (${arms[0]}) — nothing to permute`);

  const observedPairs = pairs(sessions, labels);
  if (!observedPairs.length) throw new Error('no consecutive within-session pairs — every session has one entry');

  const nArr = arrangementCount(labels, groups);
  /* THERE ARE TWO IMPLEMENTATIONS OF THE SAME NULL — exhaustive enumeration for small corpora
   * and seeded sampling for large ones — and only one of them runs on any given input. Every
   * small hand-checkable case therefore exercises `allArrangements` and NEVER `permute`, so the
   * sampled path was untested by construction: a deliberate break of the stratum logic inside
   * `permute` left the whole suite green. `forceSample` exists so the tests can point at the
   * other implementation, and so the two can be required to agree on the same corpus. */
  const exact = opt.forceSample ? false : nArr <= EXACT_LIMIT;

  const results = {};
  for (const name of Object.keys(STATS)) results[name] = { observed: STATS[name].of(observedPairs), null: [], undef: 0 };

  const consider = (perm) => {
    const p = pairs(sessions, perm);
    for (const name of Object.keys(STATS)) {
      const v = STATS[name].of(p);
      if (Number.isNaN(v)) results[name].undef++;
      else results[name].null.push(v);
    }
  };

  if (exact) {
    for (const perm of allArrangements(labels, groups)) consider(perm);
  } else {
    const rand = rng(opt.seed === undefined ? 1 : opt.seed);
    for (let i = 0; i < reps; i++) consider(permute(labels, groups, rand));
  }

  for (const name of Object.keys(STATS)) {
    const r = results[name], dir = STATS[name].dir;
    if (Number.isNaN(r.observed) || !r.null.length) { r.p = NaN; continue; }
    /* The observed arrangement is one of the arrangements, so it is counted in its own tail.
     * Omitting it is the standard way to report a permutation p below its own resolution. */
    const extreme = r.null.filter(v => (dir === 'low' ? v <= r.observed : v >= r.observed)).length;
    r.p = exact ? extreme / r.null.length : (extreme + 1) / (r.null.length + 1);
    r.reference = r.null.length;
  }

  return {
    sessions: sessions.length,
    entries: rows.length,
    pairsN: observedPairs.length,
    arms,
    perArm: Object.fromEntries(arms.map(a => [a, labels.filter(l => l === a).length])),
    strata: groups.length,
    mode: exact ? `exact — all ${nArr} arrangements enumerated` : `sampled — ${reps} replicates, seed ${opt.seed === undefined ? 1 : opt.seed}`,
    exact,
    results,
  };
}

/* ------------------------------------------------------------------ *
 * 6. report
 * ------------------------------------------------------------------ */

const CONTRACT = [
  'WHAT A LOW p MEANS   same-arm firings sit closer together than the label-shuffled null, given',
  '                     the strata held constant. That is a NECESSARY condition for coupling and',
  '                     not evidence of it: any shared upstream cause that persists in blocks —',
  '                     task type, fatigue, whose turn it is — produces the same clustering.',
  'WHAT A HIGH p MEANS  more, not less. Track 2 predicts same-arm clustering; if the observed',
  '                     value sits inside the null, the prediction FAILED. This design refutes',
  '                     better than it confirms, and that asymmetry should be stated as a result.',
  'STRATA               a confound is answered by adding it to the strata, never by argument.',
  '                     Whatever is not a stratum is not controlled.',
  'ARM LABELS           are a measurement, not a given. If they were assigned by a party who',
  '                     could see the timing, this measures that party as much as the corpus.',
];

const f = (x, n = 4) => (Number.isNaN(x) ? 'n/a' : Number(x).toPrecision(n));

function report(r) {
  const L = [];
  L.push('coupling-test — same-arm clustering against a within-session label permutation');
  L.push(`  ${r.entries} entries · ${r.sessions} sessions · ${r.pairsN} consecutive pairs · ${r.strata} strata`);
  L.push(`  arms: ${r.arms.map(a => `${a}=${r.perArm[a]}`).join('  ')}`);
  L.push(`  ${r.mode}`);
  L.push('');
  const order = ['adjacency', 'medianGap', 'logGap', 'meanGap'];
  const note = { adjacency: 'PRIMARY — scale-free, always defined', medianGap: 'robust to the tail',
                 logGap: 'robust to the tail', meanGap: 'registered, tail-sensitive, reported last' };
  for (const name of order) {
    const s = r.results[name];
    L.push(`  ${name.padEnd(11)} observed ${String(f(s.observed)).padStart(11)}   p = ${String(f(s.p)).padStart(9)}` +
           (s.undef ? `   [${s.undef} replicates undefined]` : '') + `   ${note[name]}`);
  }
  L.push('');
  L.push('  ' + CONTRACT.join('\n  '));
  return L.join('\n');
}

function parseArgv(argv) {
  const num = (flag, dflt) => { const i = argv.indexOf(flag); return i >= 0 ? Number(argv[i + 1]) : dflt; };
  return {
    file: argv.find(a => !a.startsWith('--') && !/^\d+$/.test(a)),
    reps: num('--reps', 10000),
    seed: num('--seed', 1),
    json: argv.includes('--json'),
    strataActor: argv.includes('--strata') && argv[argv.indexOf('--strata') + 1] === 'actor',
  };
}

function main(argv) {
  const opt = parseArgv(argv);
  if (!opt.file) { console.error('usage: node coupling-test.js corpus.tsv [--reps N] [--seed N] [--strata actor] [--json]'); process.exit(2); }
  try {
    const r = run(parseCorpus(fs.readFileSync(opt.file, 'utf8')), opt);
    console.log(opt.json ? JSON.stringify(r, null, 2) : report(r));
    process.exit(0);
  } catch (e) {
    console.error('REFUSED — no numbers produced.\n  ' + e.message);
    process.exit(1);
  }
}

if (require.main === module) main(process.argv.slice(2));

module.exports = { rng, shuffle, parseCorpus, toSessions, pairs, flatLabels, STATS, strataOf,
                   permute, arrangementCount, allArrangements, run, report, CONTRACT, median, mean };
