'use strict';
// D161 — the scorer for Q3's two-reader agreement test (loop/plan_q3_agreement_2026-09-27.md, e9cb884, "Registered before
// any unit exists"). Reads the two readers' files, prints Cohen's kappa over the three answers, raw agreement, each
// reader's CAN'T TELL rate, and the verdict against the registered bars. Written by pane A; the librarian runs it.
//
// Usage: node score_q3.js <q3_read_B.md> <q3_read_C.md> [--n 40]
//
// READER FILE FORMAT (the plan names the answers, not the line shape; this is the shape, and anything else that looks
// like an answer row is REFUSED, never guessed):
//   one row per unit:   <unit id> : <answer>      or a table row   | <unit id> | <answer> | ...
//   <unit id> is a token containing a digit (U01, Q3-07, 12); <answer> is YES, NO or CAN'T TELL (case-insensitive,
//   ' or ’); optional **bold** and a leading list marker are allowed; text after the answer is ignored if it is
//   separated by whitespace, | or a dash. Lines that are not answer rows (prose, headings, a table header) are ignored.
// FAILS LOUDLY (exit 2, no score) on: a row whose answer is not one of the three; a unit id twice in one file; a unit in
// one file and not the other; no units; a unit count other than --n when --n is given (the CLI defaults to the plan's 40).
//
// KAPPA (Cohen 1960), computed in INTEGERS so the bars compare exactly:
//   n units, a = units where both readers gave the same answer, b_k / c_k = how many times B / C answered category k.
//   p_o = a / n,  p_e = sum_k (b_k / n)(c_k / n),  kappa = (p_o - p_e) / (1 - p_e)
//       = (n*a - S) / (n*n - S)   with  S = sum_k b_k * c_k.
//   When n*n == S (p_e = 1: both readers gave ONE and the same answer to every unit) kappa is UNDEFINED: reported as
//   such, and no kappa bar is applied. The CAN'T TELL bar still is.
// BARS (registered): either reader's CAN'T TELL rate ABOVE 25% -> NOT ANSWERABLE AS POSED, whatever kappa says;
//   else kappa >= 0.60 USABLE; 0.40 <= kappa < 0.60 BORDERLINE; kappa < 0.40 FAILS.
const fs = require('fs');

const CATS = ['YES', 'NO', "CAN'T TELL"];
const ID = String.raw`[A-Za-z0-9_.-]*\d[A-Za-z0-9_.-]*`;
const ROW_START = new RegExp(String.raw`^\s*(?:[-*+]\s+|\|\s*)?\**(${ID})\**\s*(?::|\|)\s*(.*)$`);
const ANSWER = /^\**\s*(YES|NO|CAN['’]?T\s+TELL)\s*\**(?=$|[\s|—–.,;)-])/i;

function parseReader(text, label) {
  const answers = new Map();
  text.split(/\r?\n/).forEach((line, i) => {
    const m = ROW_START.exec(line);
    if (!m) return;
    const [, id, rest] = m;
    const a = ANSWER.exec(rest.trim());
    if (!a) throw new Error(`${label}:${i + 1}: unit ${id} has no answer of YES / NO / CAN'T TELL: ${JSON.stringify(line.trim())}`);
    if (answers.has(id)) throw new Error(`${label}:${i + 1}: unit ${id} is answered twice`);
    const word = a[1].toUpperCase().replace(/\s+/g, ' ');
    answers.set(id, word.startsWith('CAN') ? "CAN'T TELL" : word);
  });
  if (answers.size === 0) throw new Error(`${label}: no answer rows found`);
  return answers;
}

function pair(b, c, n) {
  const onlyB = [...b.keys()].filter((k) => !c.has(k)), onlyC = [...c.keys()].filter((k) => !b.has(k));
  if (onlyB.length || onlyC.length) throw new Error(`unmatched units — only in B: [${onlyB.join(', ')}] · only in C: [${onlyC.join(', ')}]`);
  if (n !== undefined && b.size !== n) throw new Error(`expected ${n} units, found ${b.size}`);
  return [...b.keys()].map((id) => [id, b.get(id), c.get(id)]);
}

// kappa as an exact fraction {num, den}; den 0 means undefined.
function score(pairs) {
  const n = pairs.length;
  const bc = Object.fromEntries(CATS.map((k) => [k, 0])), cc = Object.fromEntries(CATS.map((k) => [k, 0]));
  let a = 0;
  for (const [, x, y] of pairs) { bc[x]++; cc[y]++; if (x === y) a++; }
  const S = CATS.reduce((s, k) => s + bc[k] * cc[k], 0);
  const num = n * a - S, den = n * n - S;
  const ctB = bc["CAN'T TELL"], ctC = cc["CAN'T TELL"];
  let verdict;
  if (ctB * 4 > n || ctC * 4 > n) verdict = 'NOT ANSWERABLE AS POSED';
  else if (den === 0) verdict = 'KAPPA UNDEFINED — no bar applies';
  else if (5 * num >= 3 * den) verdict = 'USABLE';
  else if (5 * num >= 2 * den) verdict = 'BORDERLINE';
  else verdict = 'FAILS';
  return { n, agree: a, S, kappa: den === 0 ? null : { num, den, value: num / den }, ctB, ctC, countsB: bc, countsC: cc, verdict };
}

function report(r) {
  const pct = (x) => `${x}/${r.n} = ${(100 * x / r.n).toFixed(1)}%`;
  return [
    `units ${r.n}`,
    `B answers ${CATS.map((k) => `${k} ${r.countsB[k]}`).join(' · ')}`,
    `C answers ${CATS.map((k) => `${k} ${r.countsC[k]}`).join(' · ')}`,
    `raw agreement ${pct(r.agree)}`,
    r.kappa ? `kappa (n*a - S)/(n*n - S) = (${r.n}*${r.agree} - ${r.S})/(${r.n * r.n} - ${r.S}) = ${r.kappa.num}/${r.kappa.den} = ${r.kappa.value.toFixed(4)}`
      : `kappa UNDEFINED (n*n = S = ${r.S}: both readers gave one and the same answer to every unit)`,
    `CAN'T TELL rate B ${pct(r.ctB)} · C ${pct(r.ctC)} (bar: above 25%)`,
    `VERDICT ${r.verdict}`,
  ].join('\n');
}

module.exports = { parseReader, pair, score, report, CATS };

if (require.main === module) {
  const args = process.argv.slice(2);
  const ni = args.indexOf('--n');
  const n = ni >= 0 ? Number(args.splice(ni, 2)[1]) : 40;
  if (!Number.isInteger(n) || n <= 0 || args.length !== 2) { console.error('usage: node score_q3.js <q3_read_B.md> <q3_read_C.md> [--n 40]'); process.exit(2); }
  try {
    const b = parseReader(fs.readFileSync(args[0], 'utf8'), 'B'), c = parseReader(fs.readFileSync(args[1], 'utf8'), 'C');
    console.log(report(score(pair(b, c, n))));
  } catch (e) { console.error('REFUSED: ' + e.message); process.exit(2); }
}
