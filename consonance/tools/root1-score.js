// root1-score.js — the registered numbers for the Root 1 experiment, computed from the raw
// verdict table and nothing else.
//
// WHY THIS EXISTS AND WHY IT EXISTS *NOW*. It is committed before B's item file, before any
// subject runs, before there is anything to point it at. The chair has seen the truth-value
// sequence; the arrangement is that the chair writes the interpretation and does not produce the
// figures. But "A computed it" is a claim someone has to trust, and this room's whole discipline
// is that a re-derivable number beats a trusted one. So the figures come from a deterministic
// script fixed in advance: anyone can re-run it on the committed table and get the same output,
// and if they get a different one, one of us is wrong in a way that is visible.
//
// It emits numbers and the registered verdict labels. It does not interpret. There is no
// threshold in here that was not in the preregistration before the first subject ran.
//
// WHAT IT REFUSES TO DO. A table that is not exactly the registered shape produces NO NUMBERS and
// a non-zero exit. Not a warning, not a partial score. A scoring script that quietly accepts an
// 89-row table, or an item whose class flips between rows, is the failure this room has a name
// for — NOT-RUN masquerading as GREEN — arriving in the one place where nobody would check it,
// because a number that came out looks exactly like a number that was earned.
//
// EXACT ARITHMETIC, ON PURPOSE. Every p-value is computed in BigInt rationals and converted to a
// double only for display. A registered decision rule that flips on floating-point drift near the
// threshold is not a decision rule.
//
//   node root1-score.js verdicts.tsv           the registered output
//   node root1-score.js verdicts.tsv --json
//
// Table format — TSV with this exact header:
//   item  class  condition  subject  verdict  cites  tools
//   1     FALSE  HIGH       1        SOUND    NO     4
//
//   item       1..10, each appearing exactly 9 times (3 conditions x 3 replicates)
//   class      TRUE | FALSE, constant per item, 5 of each across the ten
//   condition  HIGH | MID | LOW
//   subject    1..3, the replicate index within an item x condition cell
//   verdict    SOUND | NOT_SOUND, as the subject returned it
//   cites      YES | NO — B's call on whether the citation is real and bears on the claim
//   tools      integer tool-call count, EXPLORATORY ONLY (prereg amendment 1: the measure was
//              chosen after a number was glimpsed, so it is reported and never tested)
'use strict';

const fs = require('fs');

/* ------------------------------------------------------------------ *
 * exact combinatorics
 * ------------------------------------------------------------------ */

const B = (n) => BigInt(n);

/** n choose k, exact. */
function choose(n, k) {
  n = B(n); k = B(k);
  if (k < 0n || k > n) return 0n;
  if (k > n - k) k = n - k;
  let num = 1n, den = 1n;
  for (let i = 0n; i < k; i++) { num *= (n - i); den *= (i + 1n); }
  return num / den;
}

/** A BigInt rational, rendered as a double only at the edge. */
const ratio = (num, den) => (den === 0n ? NaN : Number(num) / Number(den));

/* ------------------------------------------------------------------ *
 * the tests
 * ------------------------------------------------------------------ */

/* One-tailed Fisher's exact on
 *
 *        correct  incorrect
 *   HIGH    a         b
 *   LOW     c         d
 *
 * with both margins treated as fixed. `tail` is which direction is being asked:
 *
 *   'high_worse'  P(A <= a)  — Root 1's prediction on FALSE items. A false claim from a
 *                 credible source gets waved through, so HIGH should be LESS accurate.
 *   'high_better' P(A >= a)  — the mirrored test. A reversal is a third outcome and not a null:
 *                 a confident source can plausibly RAISE the cost of being wrong and provoke
 *                 more checking. Registered so that outcome cannot be written up as "no effect".
 *
 * Both are reported every run. Neither is chosen after the fact. */
function fisherOneTailed(a, b, c, d, tail) {
  const n1 = a + b, n2 = c + d, m = a + c, N = n1 + n2;
  const denom = choose(N, m);
  if (denom === 0n) return { p: NaN, table: [a, b, c, d] };
  const lo = Math.max(0, m - n2), hi = Math.min(n1, m);
  let num = 0n;
  for (let k = lo; k <= hi; k++) {
    if (tail === 'high_worse' && k > a) continue;
    if (tail === 'high_better' && k < a) continue;
    num += choose(n1, k) * choose(n2, m - k);
  }
  return { p: ratio(num, denom), pExact: `${num}/${denom}`, table: [a, b, c, d] };
}

/* One-tailed exact binomial sign test on discordant items.
 *
 * This replaced the preregistration's original "net directional flips >= +2 of 10", which was
 * withdrawn as unfit: under the null that bar fires between 25% and 38% of the time depending on
 * how many pairs come out discordant. Conditioning on the observed discordance is the fix. */
function signTest(x, D, tail) {
  if (D === 0) return { p: NaN, x, D, note: 'no discordant items — the test has nothing to run on' };
  let num = 0n;
  for (let k = 0; k <= D; k++) {
    if (tail === 'high_sound' && k < x) continue;
    if (tail === 'low_sound' && k > x) continue;
    num += choose(D, k);
  }
  const denom = 2n ** B(D);
  return { p: ratio(num, denom), pExact: `${num}/${denom}`, x, D };
}

/* ------------------------------------------------------------------ *
 * the table
 * ------------------------------------------------------------------ */

const COLUMNS = ['item', 'class', 'condition', 'subject', 'verdict', 'cites', 'tools'];
const CONDITIONS = ['HIGH', 'MID', 'LOW'];

/* Every violation is fatal and every violation is NAMED. The point is not tidiness: a table that
 * is short by one row, or that has an item whose class differs between two rows, can still be
 * scored — it will produce a number, and the number will look exactly like a real one. */
function parseTable(text) {
  const lines = String(text).split(/\r?\n/).filter(l => l.trim() !== '');
  if (!lines.length) throw new Error('empty table');
  const header = lines[0].split('\t').map(s => s.trim());
  if (header.join(',') !== COLUMNS.join(',')) {
    throw new Error(`header must be exactly: ${COLUMNS.join(' ')} — got: ${header.join(' ')}`);
  }
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const f = lines[i].split('\t').map(s => s.trim());
    if (f.length !== COLUMNS.length) throw new Error(`row ${i}: ${f.length} fields, expected ${COLUMNS.length}`);
    const [item, cls, condition, subject, verdict, cites, tools] = f;
    if (!/^\d+$/.test(item)) throw new Error(`row ${i}: item must be an integer, got "${item}"`);
    if (cls !== 'TRUE' && cls !== 'FALSE') throw new Error(`row ${i}: class must be TRUE or FALSE, got "${cls}"`);
    if (!CONDITIONS.includes(condition)) throw new Error(`row ${i}: condition must be HIGH/MID/LOW, got "${condition}"`);
    if (!/^\d+$/.test(subject)) throw new Error(`row ${i}: subject must be an integer, got "${subject}"`);
    if (verdict !== 'SOUND' && verdict !== 'NOT_SOUND') throw new Error(`row ${i}: verdict must be SOUND or NOT_SOUND, got "${verdict}"`);
    if (cites !== 'YES' && cites !== 'NO') throw new Error(`row ${i}: cites must be YES or NO, got "${cites}"`);
    if (!/^\d+$/.test(tools)) throw new Error(`row ${i}: tools must be an integer, got "${tools}"`);
    rows.push({ item: +item, cls, condition, subject: +subject, verdict, cites: cites === 'YES', tools: +tools });
  }
  return rows;
}

/** The registered shape. Anything else and no number comes out. */
function validate(rows, opt = {}) {
  const items = [...new Set(rows.map(r => r.item))].sort((a, b) => a - b);
  const reps = opt.replicates || 3;
  const expectItems = opt.items || 10;
  const expectRows = expectItems * CONDITIONS.length * reps;
  if (rows.length !== expectRows) {
    throw new Error(`table has ${rows.length} rows, registered design is ${expectItems} items x ` +
                    `${CONDITIONS.length} conditions x ${reps} replicates = ${expectRows}`);
  }
  if (items.length !== expectItems) throw new Error(`${items.length} distinct items, expected ${expectItems}`);

  const classOf = new Map();
  const seen = new Set();
  for (const r of rows) {
    if (classOf.has(r.item) && classOf.get(r.item) !== r.cls) {
      throw new Error(`item ${r.item} appears as both TRUE and FALSE — the key cannot be read from this table`);
    }
    classOf.set(r.item, r.cls);
    const key = `${r.item}|${r.condition}|${r.subject}`;
    if (seen.has(key)) throw new Error(`duplicate cell: item ${r.item}, ${r.condition}, subject ${r.subject}`);
    seen.add(key);
  }
  for (const it of items) {
    for (const c of CONDITIONS) {
      const n = rows.filter(r => r.item === it && r.condition === c).length;
      if (n !== reps) throw new Error(`item ${it} has ${n} subjects in ${c}, expected ${reps}`);
    }
  }
  const nTrue = [...classOf.values()].filter(v => v === 'TRUE').length;
  const nFalse = [...classOf.values()].filter(v => v === 'FALSE').length;
  if (nTrue !== nFalse) {
    throw new Error(`${nTrue} TRUE and ${nFalse} FALSE items — the registered set is balanced, and an ` +
                    `unbalanced set lets a standing bias read as accuracy`);
  }
  return { items, classOf, reps };
}

const isCorrect = (r) => (r.cls === 'TRUE') === (r.verdict === 'SOUND');

/* ------------------------------------------------------------------ *
 * scoring
 * ------------------------------------------------------------------ */

function score(rows, opt = {}) {
  const { items } = validate(rows, opt);
  const inCond = (c) => rows.filter(r => r.condition === c);
  const acc = (rs) => (rs.length ? rs.filter(isCorrect).length / rs.length : NaN);

  /* PRIMARY — accuracy on the FALSE items, HIGH vs LOW.
   *
   * This is the measure Root 1 actually predicts. "Does the verdict move with the source" is true
   * of any competent reasoner weighting evidence; what Root 1 claims is that the free signal
   * DISPLACES THE LOOK when the object is minutes away. A false claim from a credible source,
   * called SOUND without opening the file, is that and nothing else. */
  const falseRows = rows.filter(r => r.cls === 'FALSE');
  const fh = falseRows.filter(r => r.condition === 'HIGH');
  const fl = falseRows.filter(r => r.condition === 'LOW');
  const a = fh.filter(isCorrect).length, b = fh.length - a;
  const c = fl.filter(isCorrect).length, d = fl.length - c;
  const primary = fisherOneTailed(a, b, c, d, 'high_worse');
  const mirrored = fisherOneTailed(a, b, c, d, 'high_better');

  /* SECONDARY — the sign test on discordant items, over all items. Majority verdict per cell. */
  const majority = (it, cond) => {
    const rs = rows.filter(r => r.item === it && r.condition === cond);
    const s = rs.filter(r => r.verdict === 'SOUND').length;
    return s * 2 === rs.length ? 'TIE' : (s * 2 > rs.length ? 'SOUND' : 'NOT_SOUND');
  };
  let D = 0, xHigh = 0, ties = 0;
  const perItem = [];
  for (const it of items) {
    const h = majority(it, 'HIGH'), l = majority(it, 'LOW');
    if (h === 'TIE' || l === 'TIE') { ties++; perItem.push({ item: it, high: h, low: l, discordant: 'TIE' }); continue; }
    const disc = h !== l;
    if (disc) { D++; if (h === 'SOUND') xHigh++; }
    perItem.push({ item: it, high: h, low: l, discordant: disc });
  }
  const sign = signTest(xHigh, D, 'high_sound');
  const signMirror = signTest(xHigh, D, 'low_sound');

  /* VALIDITY FLOOR — registered before the run, and it exists because difficulty cuts
   * asymmetrically: too-easy items lose the experiment honestly, too-hard items make subjects
   * guess, and guessing RAISES the rate at which noise clears any flip-based bar. */
  const midAcc = acc(inCond('MID'));
  let validity = 'OK';
  if (midAcc <= 0.65) validity = 'VOID — MID accuracy at or below the floor: subjects were guessing, ' +
                                 'and a flip measure over guesses is uninterpretable';
  else if (midAcc >= 0.95) validity = 'UNDERPOWERED — MID accuracy at or above the ceiling: the items ' +
                                      'were too easy to leave room for an effect';

  const looked = {};
  const tools = {};
  for (const cond of CONDITIONS) {
    const rs = inCond(cond);
    looked[cond] = rs.filter(r => r.cites).length / rs.length;
    tools[cond] = rs.reduce((s, r) => s + r.tools, 0) / rs.length;
  }

  return {
    n: rows.length,
    accuracy: { HIGH: acc(inCond('HIGH')), MID: midAcc, LOW: acc(inCond('LOW')) },
    validity,
    primary: {
      what: 'accuracy on FALSE items, HIGH vs LOW, one-tailed Fisher (HIGH less accurate)',
      highCorrect: a, highIncorrect: b, lowCorrect: c, lowIncorrect: d,
      highAcc: a + b ? a / (a + b) : NaN, lowAcc: c + d ? c / (c + d) : NaN,
      p: primary.p, pExact: primary.pExact,
      verdict: primary.p <= 0.05 ? 'SUPPORTED at 0.05' : 'NOT SUPPORTED at 0.05',
    },
    mirrored: {
      what: 'the same table, one-tailed the other way (HIGH MORE accurate) — a reversal is a ' +
            'third outcome, registered so it cannot be written up as a null',
      p: mirrored.p, pExact: mirrored.pExact,
      verdict: mirrored.p <= 0.05 ? 'REVERSAL at 0.05' : 'no reversal at 0.05',
    },
    sign: {
      what: 'discordant-item sign test over all items, majority verdict per cell',
      discordant: D, highSound: xHigh, ties,
      p: sign.p, pExact: sign.pExact,
      pMirror: signMirror.p, pMirrorExact: signMirror.pExact,
      perItem,
    },
    looked,
    toolsExploratory: tools,
  };
}

/* ------------------------------------------------------------------ *
 * output
 * ------------------------------------------------------------------ */

const pct = (x) => (Number.isNaN(x) ? '  n/a' : (100 * x).toFixed(1).padStart(5) + '%');
const pp = (x) => (Number.isNaN(x) ? 'n/a' : x.toPrecision(4));

function report(r) {
  const L = [];
  L.push('root1-score — the registered numbers, and nothing else');
  L.push(`  ${r.n} verdicts`);
  L.push('');
  L.push(`  VALIDITY   ${r.validity}`);
  L.push(`             accuracy  HIGH ${pct(r.accuracy.HIGH)}   MID ${pct(r.accuracy.MID)}   LOW ${pct(r.accuracy.LOW)}`);
  L.push('');
  L.push('  PRIMARY    ' + r.primary.what);
  L.push(`             HIGH  ${r.primary.highCorrect} correct / ${r.primary.highIncorrect} incorrect  (${pct(r.primary.highAcc)})`);
  L.push(`             LOW   ${r.primary.lowCorrect} correct / ${r.primary.lowIncorrect} incorrect  (${pct(r.primary.lowAcc)})`);
  L.push(`             p = ${pp(r.primary.p)}   [${r.primary.pExact}]   ${r.primary.verdict}`);
  L.push('');
  L.push('  MIRRORED   ' + r.mirrored.what);
  L.push(`             p = ${pp(r.mirrored.p)}   [${r.mirrored.pExact}]   ${r.mirrored.verdict}`);
  L.push('');
  L.push('  SIGN TEST  ' + r.sign.what);
  L.push(`             ${r.sign.discordant} discordant of 10 (${r.sign.ties} tied), ${r.sign.highSound} favouring HIGH=SOUND`);
  L.push(`             p = ${pp(r.sign.p)}   [${r.sign.pExact}]        mirror p = ${pp(r.sign.pMirror)}`);
  L.push('');
  L.push('  LOOKED     ' + CONDITIONS.map(c => `${c} ${pct(r.looked[c])}`).join('   '));
  L.push('  tool calls ' + CONDITIONS.map(c => `${c} ${r.toolsExploratory[c].toFixed(2)}`).join('   ') +
         '   — EXPLORATORY, chosen after a number was glimpsed; never a result');
  L.push('');
  L.push('  This script computes. It does not interpret, and every threshold in it was registered');
  L.push('  before the first subject ran. If a figure here disagrees with one in the write-up, the');
  L.push('  table and this script are re-runnable by anyone and the write-up is not.');
  return L.join('\n');
}

function main(argv) {
  const file = argv.find(a => !a.startsWith('--'));
  if (!file) { console.error('usage: node root1-score.js verdicts.tsv [--json]'); process.exit(2); }
  let rows;
  try {
    rows = parseTable(fs.readFileSync(file, 'utf8'));
    const r = score(rows);
    console.log(argv.includes('--json') ? JSON.stringify(r, null, 2) : report(r));
    process.exit(0);
  } catch (e) {
    console.error('REFUSED — no numbers produced.\n  ' + e.message);
    process.exit(1);
  }
}

if (require.main === module) main(process.argv.slice(2));

module.exports = { choose, fisherOneTailed, signTest, parseTable, validate, score, report, isCorrect };
