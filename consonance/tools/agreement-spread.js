// AGREEMENT-SPREAD — is this lap a conversation, or several monologues in one room?
//
// WHY THE SHIPPED GAUGE HAD TO BE REPLACED RATHER THAN TUNED. `tether.rs::vantage_spread` is
// average pairwise word-overlap distance. Measured 2026-08-06 against a controlled set — six
// instances answering one prompt versus six equal-length slices of one of those instances —
// it scored SIX MINDS 0.8201 and ONE MIND 0.9162. It rates one mind as more diverse than six.
// The cause is structural: six minds on one question converge in wording because they are on
// the same question, while one mind moving through its own argument ranges further because it
// changes subject. The measure rewards TOPIC DRIFT and punishes ENGAGEMENT WITH A SHARED
// QUESTION, and a committee doing its job is the second thing. A second lexical design — strip
// the room's shared vocabulary, normalise for length — was preregistered as the fix, built, and
// moved the separation from -0.096 to -0.075, still inverted.
//
// THE 2x2 THAT EXPLAINS THE FAILURE. A single scalar collapsed two different states:
//
//                          conclusions agree   conclusions diverge
//     shared referents     collapse / echo     real diversity
//     no shared referents  parallel monologue  parallel monologue
//
// `vantage_spread` scores the BOTTOM ROW highest. Panes not talking to each other read as
// maximum health, which is the one reading a diversity gauge must never give.
//
// WHAT THIS MEASURES, AND WHAT IT DOES NOT. Only the vertical axis: do the contributions touch
// the same evidence at all. That is deterministic and needs no judge. It CANNOT tell echo from
// real disagreement — that is the horizontal axis, it needs stance extracted from free text,
// and it is not attempted here. A high number from this tool means "in the same conversation",
// never "healthily diverse". Registered in `exo_memory/loop/diversity3_preregistration.md`
// before it was run, including the failure mode most likely to sink it: one mind sustained on
// one task cites the same files over and over, so this could measure topic persistence rather
// than shared conversation.
//
// REGISTERED DECISIONS, fixed before the first run and not to be quietly re-tuned:
//   1. Identity classes are url, path, backticked code, #nnn citation. BARE NUMBERS ARE
//      EXCLUDED — they are most of the raw referent count and every `3` collides with every
//      other `3`. `count_referents` in tether.rs includes them; this deliberately does not.
//   2. Path identity is FILE-LEVEL: lowercased, line suffix stripped, so `listen.rs:19` and
//      `listen.rs:22` are one referent. Basename-only identity (which would merge `a/x.rs` with
//      `b/x.rs`) is the untested alternative and is NOT used, because it was not registered.
//   3. A lap needs >= 5 distinct identity-bearing referents to be scoreable. Laps below the
//      floor are excluded and COUNTED in the output, never silently dropped.
//
// One deliberate deviation from the Rust: backticked spans are extracted with a regex over the
// whole text rather than per-whitespace-token, because the token form misses any span with a
// space in it. Decided before results were seen; recorded here rather than left to be found.
//
//   node consonance/tools/agreement-spread.js              positives vs one-mind negatives
//   node consonance/tools/agreement-spread.js --board <f>
//   node consonance/tools/agreement-spread.js --laps       per-lap table
'use strict';

const fs = require('fs');

const GAP_MS = 15 * 60 * 1000;   // a lap is assistant records within this of each other
const FLOOR = 5;                 // distinct identity-bearing referents needed to score a lap

// ---------------------------------------------------------------- referents

// Normalised referent IDENTITIES, not a count. Identity is the whole point: two sources
// "touching the same referent" is undefined if you only have how many each of them had.
function referentIdentities(text) {
  const out = new Set();

  for (const m of text.matchAll(/`([^`\n]{1,80})`/g)) {
    const v = m[1].trim().toLowerCase();
    if (v) out.add('code:' + v);
  }

  for (const raw of text.split(/\s+/)) {
    const t = raw.replace(/^[^A-Za-z0-9/\\.:#]+/, '').replace(/[^A-Za-z0-9/\\.:#]+$/, '');
    if (!t) continue;
    const lower = t.toLowerCase();

    if (lower.startsWith('http') || lower.startsWith('www.')) { out.add('url:' + lower); continue; }

    if ((t.includes('/') || t.includes('\\')) && t.length > 2) {
      // file-level: drop a :123 or :12-34 line suffix so two lines of one file are one referent
      const file = lower.replace(/[\\]/g, '/').replace(/:\d+(?:-\d+)?$/, '');
      if (file.length > 2) out.add('path:' + file);
      continue;
    }
    // bare numbers deliberately not an identity class — see registered decision 1
    if (t.startsWith('#') && t.length > 1 && /\d/.test(t)) out.add('cite:' + lower);
  }
  return out;
}

// Fraction of the lap's distinct referents that at least two DIFFERENT sources touched.
// `groups` is one entry per source (a pane, or a contiguous block of one pane's work).
function referentOverlap(groups) {
  const sets = groups.map(texts => {
    const s = new Set();
    for (const t of texts) for (const r of referentIdentities(t)) s.add(r);
    return s;
  });
  const seenBy = new Map();
  for (const s of sets) for (const r of s) seenBy.set(r, (seenBy.get(r) || 0) + 1);
  const distinct = seenBy.size;
  let shared = 0;
  for (const n of seenBy.values()) if (n >= 2) shared++;
  return { overlap: distinct === 0 ? 0 : shared / distinct, distinct, shared, scoreable: distinct >= FLOOR };
}

// ---------------------------------------------------------------- the old gauge, for comparison

// Port of tether.rs::vantage_spread, kept here so the head-to-head runs on identical grouping.
// Not an endorsement — it is the thing being compared against.
function vantageSpread(texts) {
  if (texts.length < 2) return 1.0;
  const sets = texts.map(t => new Set(
    t.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 3)));
  let total = 0, pairs = 0;
  for (let i = 0; i < sets.length; i++) {
    for (let j = i + 1; j < sets.length; j++) {
      const a = sets[i], b = sets[j];
      const union = new Set([...a, ...b]).size;
      let inter = 0;
      for (const w of a) if (b.has(w)) inter++;
      total += 1 - (union === 0 ? 0 : inter / union);
      pairs++;
    }
  }
  return pairs === 0 ? 1.0 : total / pairs;
}

// ---------------------------------------------------------------- laps

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

function buildLaps(recs, gap = GAP_MS) {
  const laps = [];
  let cur = null;
  for (const r of recs) {
    if (!cur || r.ts - cur.last > gap) { cur = { start: r.ts, last: r.ts, recs: [] }; laps.push(cur); }
    cur.last = r.ts;
    cur.recs.push(r);
  }
  return laps;
}

const paneCount = lap => new Set(lap.recs.map(r => r.pane)).size;

// POSITIVE: group a real multi-pane lap by pane.
function groupByPane(lap) {
  const m = new Map();
  for (const r of lap.recs) {
    if (!m.has(r.pane)) m.set(r.pane, []);
    m.get(r.pane).push(r.text);
  }
  return [...m.values()];
}

// NEGATIVE: one mind, cut into contiguous blocks. Contiguous rather than interleaved because
// that is what one instance moving through its own work looks like; interleaving would
// manufacture the overlap this tool is trying to detect.
function contiguousBlocks(lap, k) {
  const texts = lap.recs.map(r => r.text);
  if (texts.length < k) return null;
  const size = Math.floor(texts.length / k);
  const out = [];
  for (let i = 0; i < k; i++) {
    out.push(texts.slice(i * size, i === k - 1 ? texts.length : (i + 1) * size));
  }
  return out;
}

// ---------------------------------------------------------------- stats

function spearman(xs, ys) {
  const rank = v => {
    const idx = v.map((x, i) => [x, i]).sort((a, b) => a[0] - b[0]);
    const r = new Array(v.length);
    let i = 0;
    while (i < idx.length) {
      let j = i;
      while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++;
      const avg = (i + j) / 2 + 1;
      for (let k = i; k <= j; k++) r[idx[k][1]] = avg;
      i = j + 1;
    }
    return r;
  };
  const a = rank(xs), b = rank(ys), n = xs.length;
  if (n < 3) return NaN;
  const ma = a.reduce((s, x) => s + x, 0) / n, mb = b.reduce((s, x) => s + x, 0) / n;
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < n; i++) {
    num += (a[i] - ma) * (b[i] - mb);
    da += (a[i] - ma) ** 2;
    db += (b[i] - mb) ** 2;
  }
  return da === 0 || db === 0 ? NaN : num / Math.sqrt(da * db);
}

const mean = v => v.reduce((s, x) => s + x, 0) / v.length;
const median = v => { const s = [...v].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };

// ---------------------------------------------------------------- scoring

function score(file) {
  const laps = buildLaps(readRecords(file));
  const positives = laps.filter(l => paneCount(l) >= 2);
  const singles = laps.filter(l => paneCount(l) === 1);
  const k = positives.length ? median(positives.map(paneCount)) : 2;

  const measure = (groups) => {
    const joined = groups.map(g => g.join('\n'));
    const ro = referentOverlap(groups);
    return { ...ro, spread: vantageSpread(joined), meanLen: mean(joined.map(t => t.length)) };
  };

  const pos = [], neg = [];
  let posBelowFloor = 0, negBelowFloor = 0, negUnbuildable = 0;

  for (const l of positives) {
    const m = measure(groupByPane(l));
    if (!m.scoreable) { posBelowFloor++; continue; }
    pos.push({ start: l.start, panes: paneCount(l), n: l.recs.length, ...m });
  }
  for (const l of singles) {
    const g = contiguousBlocks(l, k);
    if (!g) { negUnbuildable++; continue; }
    const m = measure(g);
    if (!m.scoreable) { negBelowFloor++; continue; }
    neg.push({ start: l.start, panes: 1, n: l.recs.length, ...m });
  }

  const all = [...pos, ...neg];
  return {
    k, pos, neg, posBelowFloor, negBelowFloor, negUnbuildable,
    posOverlap: mean(pos.map(x => x.overlap)),
    negOverlap: mean(neg.map(x => x.overlap)),
    posSpread: mean(pos.map(x => x.spread)),
    negSpread: mean(neg.map(x => x.spread)),
    rhoWithSpread: spearman(all.map(x => x.overlap), all.map(x => x.spread)),
    rhoWithLength: spearman(all.map(x => x.overlap), all.map(x => x.meanLen)),
  };
}

// ---------------------------------------------------------------- cli

if (require.main === module) {
  const argv = process.argv.slice(2);
  const file = argv.includes('--board') ? argv[argv.indexOf('--board') + 1] : 'C:/Consonance/data/board.jsonl';
  const r = score(file);
  const f = x => (Number.isNaN(x) ? '  n/a ' : (x >= 0 ? ' ' : '') + x.toFixed(4));

  if (argv.includes('--laps')) {
    console.log('lap                 src  recs  distinct  shared  overlap   spread');
    for (const x of [...r.pos, ...r.neg].sort((a, b) => a.start - b.start)) {
      console.log(new Date(x.start).toISOString().slice(0, 16),
        String(x.panes).padStart(4), String(x.n).padStart(5), String(x.distinct).padStart(9),
        String(x.shared).padStart(7), f(x.overlap), f(x.spread));
    }
    console.log('');
  }

  console.log(`blocks per negative (median positive pane count): ${r.k}`);
  console.log(`scoreable: ${r.pos.length} positives (${r.posBelowFloor} below floor), ` +
              `${r.neg.length} negatives (${r.negBelowFloor} below floor, ${r.negUnbuildable} too few records)`);
  console.log('');
  console.log('                      many minds    one mind    separation');
  console.log(`referent_overlap       ${f(r.posOverlap)}     ${f(r.negOverlap)}     ${f(r.posOverlap - r.negOverlap)}`);
  console.log(`vantage_spread (old)   ${f(r.posSpread)}     ${f(r.negSpread)}     ${f(r.posSpread - r.negSpread)}`);
  console.log('');
  console.log(`spearman(overlap, vantage_spread) = ${f(r.rhoWithSpread)}   [P3 wants |rho| < 0.5]`);
  console.log(`spearman(overlap, mean length)    = ${f(r.rhoWithLength)}   [P4 wants |rho| < 0.25]`);
}

module.exports = { referentIdentities, referentOverlap, vantageSpread, buildLaps, contiguousBlocks, spearman, score, FLOOR, GAP_MS };
