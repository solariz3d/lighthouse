// BALANCE-CHECK — how much of the diversity-3 result was a property of the ARMS, not the minds?
//
// WHY THIS EXISTS. `agreement-spread.js` measured referent overlap on two arms and reported a
// separation of -0.0999: one mind cut in two shared MORE of its referents with itself than two
// real panes in one lap shared with each other. The registered explanation was topic persistence
// (one mind on one task cites the same files repeatedly), and it is real. The chair pointed out,
// within the hour, a SECOND property the two arms differ in, which was never registered:
//
//   NEGATIVES: contiguousBlocks() cuts one lap into k equal-RECORD blocks -> balanced by construction
//   POSITIVES: real multi-pane laps -> whatever balance the room happened to have
//
// referent_overlap counts referents touched by >= 2 distinct sources, so a source holding a
// sliver of the lap caps the achievable fraction MECHANICALLY, whether or not the two panes were
// in conversation. On the scored set the asymmetry is large: positives have a median top-source
// char share of 89.1%, negatives 58.7%. So the headline had two explanations pushing one way and
// the registration named only one.
//
// THIS IS A DIAGNOSTIC OF THE RUN, NOT A PATCH TO THE MEASURE. The stop rule bound after P2
// failed says no tuning the gauge to make it pass. Nothing here changes `agreement-spread.js`;
// it is imported unchanged and asked a question about its own arms.
//
// THE DECISIVE TEST is a BALANCE-MATCHED negative arm: cut one mind's lap into contiguous blocks
// with the SAME character proportions as a real positive lap, so the two arms differ only in how
// many minds produced them. `proportionalBlocks` achieves its target within ~1 point at every
// imbalance in the set, including 99%, so the matched arm is honest rather than nominal.
//
// WHAT IT FOUND (2026-08-09, board.jsonl at 15617 assistant records):
//   - the chair's mechanism is real and VISIBLE: one mind's overlap tracks imbalance
//     monotonically, 0.039 at 99% top-share up to 0.151 at 70%
//   - it accounts for 59% of the registered gap. Negatives fall 0.1482 -> 0.0896 when matched
//   - the residual separation is -0.0415, still inverted, sign test p=0.049, bootstrap 95% CI
//     [-0.0815, +0.0009] — the direction survives correction, the MAGNITUDE does not, and the
//     residual is marginal rather than established
//   - the chair's own proposed cheap test came back against the chair: across positives,
//     spearman(overlap, top-share) = +0.196, and restricting to the most balanced positives
//     makes separation WORSE (-0.1432 at top-share < 0.8), not better
//
//   node consonance/tools/balance-check.js
//   node consonance/tools/balance-check.js --board <file>
'use strict';

const fs = require('fs');
const T = require('./agreement-spread.js');

const BOOTSTRAP_SEED = 20260809;   // fixed so every number below re-derives from one run

// ---------------------------------------------------------------- helpers

function readRecords(file) {
  const recs = [];
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!line) continue;
    let r; try { r = JSON.parse(line); } catch { continue; }
    if (r.role !== 'assistant' || !r.ts || !r.pane || !r.text) continue;
    recs.push(r);
  }
  return recs.sort((a, b) => a.ts - b.ts);
}

const paneCount = lap => new Set(lap.recs.map(r => r.pane)).size;
const chars = group => group.reduce((s, t) => s + t.length, 0);
const mean = v => (v.length ? v.reduce((s, x) => s + x, 0) / v.length : NaN);
const median = v => { const s = [...v].sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : NaN; };

// Share of the lap's characters held by its largest source. 1.0 means one source holds everything.
function topShare(groups) {
  const cs = groups.map(chars);
  const total = cs.reduce((s, x) => s + x, 0);
  return total === 0 ? 1 : Math.max(...cs) / total;
}

function groupByPane(lap) {
  const m = new Map();
  for (const r of lap.recs) {
    if (!m.has(r.pane)) m.set(r.pane, []);
    m.get(r.pane).push(r.text);
  }
  return [...m.values()];
}

// Cut a lap contiguously so block i holds about props[i] of the lap's CHARACTERS. Contiguous for
// the same reason `contiguousBlocks` is: interleaving would manufacture the overlap being tested.
// Every block is guaranteed non-empty or the cut is refused, so a sliver block is a real record.
function proportionalBlocks(lap, props) {
  const texts = lap.recs.map(r => r.text);
  const total = texts.reduce((s, t) => s + t.length, 0);
  if (total === 0 || texts.length < props.length) return null;

  const out = [];
  let i = 0;
  for (let b = 0; b < props.length; b++) {
    const target = total * props[b];
    const remainingBlocks = props.length - b - 1;
    const block = [];
    let acc = 0;
    while (i < texts.length && (texts.length - i) > remainingBlocks &&
           (block.length === 0 || acc < target)) {
      block.push(texts[i]); acc += texts[i].length; i++;
    }
    out.push(block);
  }
  while (i < texts.length) out[out.length - 1].push(texts[i]);
  return out.every(b => b.length > 0) ? out : null;
}

// Exact two-sided sign test. Reported instead of a t-test because n is 17 and the differences
// are not remotely normal.
function signTestP(diffs) {
  const n = diffs.length;
  const above = diffs.filter(d => d > 0).length;
  const choose = (nn, k) => { let r = 1; for (let i = 0; i < k; i++) r = r * (nn - i) / (i + 1); return r; };
  let tail = 0;
  for (let i = 0; i <= Math.min(above, n - above); i++) tail += choose(n, i);
  return Math.min(1, 2 * tail / Math.pow(2, n));
}

// Seeded bootstrap so the interval is a fact about the data, not about the run.
function bootstrapCI(diffs, iterations = 10000) {
  let seed = BOOTSTRAP_SEED;
  const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const means = [];
  for (let b = 0; b < iterations; b++) {
    let s = 0;
    for (let i = 0; i < diffs.length; i++) s += diffs[Math.floor(rnd() * diffs.length)];
    means.push(s / diffs.length);
  }
  means.sort((a, b) => a - b);
  return [means[Math.floor(iterations * 0.025)], means[Math.floor(iterations * 0.975)]];
}

// ---------------------------------------------------------------- analysis

function analyse(file) {
  const laps = T.buildLaps(readRecords(file));
  const positives = laps.filter(l => paneCount(l) >= 2);
  const singles = laps.filter(l => paneCount(l) === 1);
  const k = positives.length ? median(positives.map(paneCount)) : 2;

  const pos = [];
  for (const l of positives) {
    const groups = groupByPane(l);
    const ro = T.referentOverlap(groups);
    if (!ro.scoreable) continue;
    const cs = groups.map(chars);
    const total = cs.reduce((s, x) => s + x, 0);
    pos.push({
      overlap: ro.overlap,
      top: topShare(groups),
      props: cs.map(c => c / total).sort((a, b) => b - a),
    });
  }

  const neg = [];
  for (const l of singles) {
    const groups = T.contiguousBlocks(l, k);
    if (!groups) continue;
    const ro = T.referentOverlap(groups);
    if (!ro.scoreable) continue;
    neg.push({ lap: l, overlap: ro.overlap, top: topShare(groups) });
  }

  // Balance-matched arm: every scoreable one-mind lap re-cut to each positive's proportions.
  const matched = [];
  for (const p of pos) {
    const scores = [], achieved = [];
    for (const n of neg) {
      const groups = proportionalBlocks(n.lap, p.props);
      if (!groups) continue;
      const ro = T.referentOverlap(groups);
      if (!ro.scoreable) continue;
      scores.push(ro.overlap);
      achieved.push(topShare(groups));
    }
    if (scores.length) {
      matched.push({ top: p.top, achievedTop: median(achieved), pos: p.overlap, neg: mean(scores), n: scores.length });
    }
  }

  const diffs = matched.map(m => m.pos - m.neg);
  return {
    k, pos, neg, matched, diffs,
    posMean: mean(pos.map(x => x.overlap)),
    negMean: mean(neg.map(x => x.overlap)),
    matchedNegMean: mean(matched.map(m => m.neg)),
    rhoPos: T.spearman(pos.map(x => x.overlap), pos.map(x => x.top)),
    rhoNeg: T.spearman(neg.map(x => x.overlap), neg.map(x => x.top)),
    signP: diffs.length ? signTestP(diffs) : NaN,
    ci: diffs.length ? bootstrapCI(diffs) : [NaN, NaN],
  };
}

// ---------------------------------------------------------------- cli

if (require.main === module) {
  const argv = process.argv.slice(2);
  const file = argv.includes('--board') ? argv[argv.indexOf('--board') + 1] : 'C:/Consonance/data/board.jsonl';
  const r = analyse(file);
  const pct = x => (x * 100).toFixed(1) + '%';
  const f = x => (Number.isNaN(x) ? ' n/a' : (x >= 0 ? '+' : '') + x.toFixed(4));

  console.log(`scoreable: ${r.pos.length} positives, ${r.neg.length} negatives (k=${r.k})\n`);

  console.log('--- 1. DO THE ARMS DIFFER IN BALANCE, ON THE SCORED SET? ---');
  console.log(`  positives (by pane)          median top-source share ${pct(median(r.pos.map(x => x.top)))}   >=90%: ${r.pos.filter(x => x.top >= 0.9).length}/${r.pos.length}`);
  console.log(`  negatives (equal-record cut) median top-block  share ${pct(median(r.neg.map(x => x.top)))}   >=90%: ${r.neg.filter(x => x.top >= 0.9).length}/${r.neg.length}`);

  console.log('\n--- 2. DOES OVERLAP TRACK BALANCE WITHIN AN ARM? ---');
  console.log(`  spearman(overlap, top-share), positives only : ${f(r.rhoPos)}  (n=${r.pos.length})`);
  console.log(`  spearman(overlap, top-share), negatives only : ${f(r.rhoNeg)}  (n=${r.neg.length})`);

  console.log('\n--- 3. BALANCE-MATCHED NEGATIVES: one mind, cut to each positive\'s imbalance ---');
  console.log('  target   achieved   positive overlap   one-mind overlap at the same imbalance');
  for (const m of [...r.matched].sort((a, b) => b.top - a.top)) {
    console.log(`  ${pct(m.top).padStart(6)}   ${pct(m.achievedTop).padStart(6)}     ${m.pos.toFixed(4).padStart(10)}       ${m.neg.toFixed(4).padStart(10)}   (over ${m.n} laps)`);
  }

  console.log('\n--- 4. DECOMPOSITION OF THE REGISTERED SEPARATION ---');
  console.log(`  positives                        ${r.posMean.toFixed(4)}`);
  console.log(`  negatives, equal-record blocks   ${r.negMean.toFixed(4)}   <- as registered`);
  console.log(`  negatives, balance-matched       ${r.matchedNegMean.toFixed(4)}   <- arms differ only in mind count`);
  console.log(`  construction accounts for        ${(r.negMean - r.matchedNegMean).toFixed(4)} of ${(r.negMean - r.posMean).toFixed(4)} = ` +
              `${(100 * (r.negMean - r.matchedNegMean) / (r.negMean - r.posMean)).toFixed(0)}%`);
  console.log(`  residual separation              ${f(r.posMean - r.matchedNegMean)}   positives higher in ${r.diffs.filter(d => d > 0).length}/${r.diffs.length} laps`);
  console.log(`  exact sign test p                ${r.signP.toFixed(4)}`);
  console.log(`  bootstrap 95% CI (seeded)        [${r.ci[0].toFixed(4)}, ${r.ci[1].toFixed(4)}]`);
}

module.exports = { proportionalBlocks, topShare, groupByPane, signTestP, bootstrapCI, analyse };
