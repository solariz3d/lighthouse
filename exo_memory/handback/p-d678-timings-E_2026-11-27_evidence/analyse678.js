// analyse678.js (pane E, D678 N3): B's analyse266.js (handback/p-l266-timings-B_2026-11-27_evidence/), generalised to one session of one pair and to drag-frame.
// The same exact one-sided Mann-Whitney (mid-ranks for ties, the exact distribution by counting every subset), the medians, the bars, and the sign test across cases.
// THE RULES (B's as registered; drag-frame's "the same way", registered in my registration before any session):
//   d642: the ratio a run (rolling p95 / early p95); label2 SLOWER if one-sided p < 0.05 AND its median exceeds label1's by more than 0.10 (5 % of the 2x bar); FASTER
//         the mirror; else not told. Secondary: the rolling p95 alone.
//   sf  : nine cases (row 1's five looks, rows 2, 3, 4a, 4b), the first attempt's work-frame p95; SLOWER in a case if p < 0.01 AND the median exceeds by more than 0.3 ms;
//         ACROSS THE BOARD if label2's median is the higher in at least the smallest count whose one-sided sign p <= 0.02 (8 of 9).
//   df  : seventeen cases (row 1's and row 2's five looks, row 3 at 1,000 and 2,000 m, rows 4, 6, 7, 8: the first attempt's p95; row 9: the first attempt's rolling / flat
//         p95 ratio); p < 0.01 AND the median exceeds by more than 5 % of the case's bar (6.0 ms: 0.3; row 4, 40 ms: 2.0; row 6, 13.4 ms: 0.67; rows 7 and 8, 6.9 ms: 0.345;
//         row 9, 2 x: 0.10); across the board as sf (14 of 17).
// A/A (both labels one sha): the rule must say "not told" both ways (the NULL control), and WHAT D RESOLVES: the smallest uniform shift (0.01 grid) added to one side's real
// samples that the rule tells as slower, each way, the larger reported; "cannot fire at this n" where even full separation gives p >= alpha. Also the smallest uniform shift
// on every case at once that the sign test tells. Each verdict is read with every run and with the quiet runs only (no game, no app of his, no lock but mine).
// usage: node analyse678.js <session dir> <d642|sf|df>
'use strict';
const fs = require('fs'), path = require('path');
const [dir, kind] = process.argv.slice(2);
const med = (a) => { const s = [...a].sort((x, y) => x - y), n = s.length; return n ? (n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2) : null; };
function mwuGreater(x, y) {   // exact P(rank sum of y >= observed) under H0: y above x is the alternative (B's, unchanged)
  const all = [...x.map((v) => ({ v, g: 0 })), ...y.map((v) => ({ v, g: 1 }))].sort((a, b) => a.v - b.v), N = all.length;
  const r2 = new Array(N); for (let i = 0; i < N;) { let j = i; while (j + 1 < N && all[j + 1].v === all[i].v) j++; for (let k = i; k <= j; k++) r2[k] = i + j + 2; i = j + 1; }
  const obs = all.reduce((s, a, i) => s + (a.g ? r2[i] : 0), 0), m = y.length, max = r2.reduce((a, b) => a + b, 0);
  let f = Array.from({ length: m + 1 }, () => new Float64Array(max + 1)); f[0][0] = 1;
  for (const r of r2) for (let k = m; k >= 1; k--) { const a = f[k], b = f[k - 1]; for (let s = max; s >= r; s--) if (b[s - r]) a[s] += b[s - r]; }
  let tot = 0, ge = 0; for (let s = 0; s <= max; s++) { tot += f[m][s]; if (s >= obs) ge += f[m][s]; }
  return { p: ge / tot, U: obs / 2 - (m * (m + 1)) / 2, pairs: x.length * y.length };
}
const binomGE = (k, n) => { let s = 0; for (let i = k; i <= n; i++) { let c = 1; for (let j = 0; j < i; j++) c = (c * (n - j)) / (j + 1); s += c; } return s / 2 ** n; };
const signK = (n) => { for (let k = 0; k <= n; k++) if (binomGE(k, n) <= 0.02) return k; return Infinity; };
const choose = (n, k) => { let c = 1; for (let j = 0; j < k; j++) c = (c * (n - j)) / (j + 1); return c; };
const verdict = (x, y, alpha, margin) => { const up = mwuGreater(x, y), dn = mwuGreater(y, x), dm = med(y) - med(x); return { up: up.p, dn: dn.p, U: up.U, pairs: up.pairs, dm, v: up.p < alpha && dm > margin ? 'SLOWER' : dn.p < alpha && -dm > margin ? 'FASTER' : 'not told' }; };
/** the smallest d on a 0.01 grid with rule(x, y + d) SLOWER; null when even full separation cannot fire */
function smallestTold(x, y, alpha, margin) {
  if (1 / choose(x.length + y.length, y.length) >= alpha) return null;
  const span = Math.max(...x, ...y) - Math.min(...x, ...y) + margin + 1;
  let lo = 0, hi = Math.ceil(span * 100);
  if (verdict(x, y.map((v) => v + hi / 100), alpha, margin).v !== 'SLOWER') return null;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (verdict(x, y.map((v) => v + mid / 100), alpha, margin).v === 'SLOWER') hi = mid; else lo = mid + 1; }
  return lo / 100;
}
const out = []; const say = (s) => { out.push(s); console.log(s); };
const kept = fs.readFileSync(path.join(dir, `${kind}.jsonl`), 'utf8').trim().split(/\r?\n/).map((l) => JSON.parse(l));
const runs = kept.filter((r) => !r.game);
const [L1, L2] = [...new Set(runs.map((r) => r.label))], shaOf = (l) => runs.find((r) => r.label === l).sha, AA = shaOf(L1) === shaOf(L2);
const quiet = (s) => s && s.gameReadable && !s.game.length && !s.hisApp && Object.values(s.locks).every((l) => !l || /^E D678 N3/.test(l.cmd || ''));
say(`${kind}: ${L1} (${shaOf(L1)}) against ${L2} (${shaOf(L2)})${AA ? ' — ONE COMMIT, run twice: the A/A' : ''}; ${runs.length} runs kept (${runs.filter((r) => r.label === L1).length} / ${runs.filter((r) => r.label === L2).length}; ${kept.length - runs.length} ended by a game); quiet by the record: ${runs.filter((r) => quiet(r.snap)).length} of ${runs.length}; busy before each run ${Math.min(...runs.map((r) => r.snap.busyPct))}-${Math.max(...runs.map((r) => r.snap.busyPct))} %`);

// THE SAMPLES: case -> label -> [ { k, v, all, quiet } ]
const CASES = [], BAR = {}, MARGIN = {}; let ALPHA;
const S = {}; const put = (c, r, v, all) => { (S[c] ||= {}); (S[c][r.label] ||= []).push({ k: r.k, v, all, quiet: quiet(r.snap) }); };
const tapOf = (r) => fs.readFileSync(path.join(dir, `${kind}-${String(r.k).padStart(2, '0')}-${r.label}.tap`), 'utf8');
const nums = (s) => s.split(' / ').map(Number);
const LOOKS = ['aqua', 'skyline', 'glass', 'aurora', 'sigil'];
if (kind === 'd642') {
  CASES.push('ratio'); BAR.ratio = 2; MARGIN.ratio = 0.10; ALPHA = 0.05;
  for (const r of runs) if (r.ratio != null) { put('ratio', r, r.ratio, [r.ratio]); put('rolling p95 (secondary)', r, r.rolling, [r.rolling]); put('early p95', r, r.early, [r.early]); }
} else if (kind === 'sf') {
  ALPHA = 0.01;
  for (const c of [...LOOKS.map((l) => `row 1 ${l}`), 'row 2', 'row 3', 'row 4a', 'row 4b']) { CASES.push(c); BAR[c] = 6.0; MARGIN[c] = 0.3; }
  const ATT = /p95 ([\d.]+) \(median ([\d.]+), (\d+) work frames\), release ([\d.-]+), longest (\d+), whole after (\w+)/g;
  const att = (s) => [...(s || '').matchAll(ATT)].map((m) => ({ p95: +m[1], release: m[4] === '-' ? null : +m[4], longest: +m[5], whole: m[6] === 'never' ? null : +m[6] }));
  for (const r of runs) {
    const t = tapOf(r), byLook = t.match(/# p95 ms by look: (\{[^\n]*\})/);
    if (byLook) { const g = JSON.parse(byLook[1]); for (const l of LOOKS) if (g[l]) put(`row 1 ${l}`, r, g[l][0], g[l]); }
    else { const f = t.match(/(aqua|skyline|glass|aurora|sigil), Twist on one piece of 12: ([^\n]*?), over 6 ms/); if (f) { const a = att(f[2]); put(`row 1 ${f[1]}`, r, a[0].p95, a.map((x) => x.p95)); } }
    for (const [c, re] of [['row 2', /# 10 km open, Grab r 200: ([^\n]*)/], ['row 3', /# 10 km closed, Bend r 200: ([^\n]*)/], ['row 4a', /# tube360, grab r 60: ([^\n]*)/], ['row 4b', /# tube280, twist r 60: ([^\n]*)/]]) {
      const m = t.match(re); if (m) { const a = att(m[1]); put(c, r, a[0].p95, a.map((x) => x.p95)); r[`${c} other`] = a[0]; }
    }
  }
} else if (kind === 'df') {
  ALPHA = 0.01;
  for (const c of [...LOOKS.map((l) => `row 1 ${l}`), ...LOOKS.map((l) => `row 2 ${l}`), 'row 3 1000', 'row 3 2000', 'row 4', 'row 6', 'row 7', 'row 8', 'row 9 ratio']) CASES.push(c);
  for (const c of CASES) { BAR[c] = /^row [123] /.test(c) ? 6.0 : c === 'row 4' ? 40 : c === 'row 6' ? 13.4 : c === 'row 9 ratio' ? 2 : 6.9; MARGIN[c] = c === 'row 9 ratio' ? 0.10 : +(BAR[c] * 0.05).toFixed(3); }
  const LIST = '((?:[\\d.]+)(?: / [\\d.]+)*)';
  for (const r of runs) {
    const blocks = {}; for (const b of tapOf(r).split(/^# Subtest: /m).slice(1)) { const m = b.match(/^row (\w+):/); if (m) blocks[m[1]] = b; }
    for (const row of ['1', '2']) {
      const b = blocks[row] || '', d = b.match(/# p95 ms by look: (\{[^\n]*\})/);
      if (d) { const g = JSON.parse(d[1]); for (const l of LOOKS) if (g[l]) put(`row ${row} ${l}`, r, g[l][0], g[l]); }
      else { const f = b.match(new RegExp(`(aqua|skyline|glass|aurora|sigil), a (?:1000|2000) m turn drag: p95 ${LIST} ms`)); if (f) put(`row ${row} ${f[1]}`, r, nums(f[2])[0], nums(f[2])); }
    }
    { const b = blocks['3'] || '', d = b.match(/# p95 ms by length: (\{[^\n]*\})/);
      if (d) { const g = JSON.parse(d[1]); for (const L of ['1000', '2000']) if (g[L]) put(`row 3 ${L}`, r, g[L][0], g[L]); }
      else { const f = b.match(new RegExp(`aqua, a (1000|2000) m stretch drag: p95 ${LIST} ms`)); if (f) put(`row 3 ${f[1]}`, r, nums(f[2])[0], nums(f[2])); } }
    { const m = (blocks['4'] || '').match(new RegExp(`# 20,000 m: p95 ${LIST} ms`)); if (m) put('row 4', r, nums(m[1])[0], nums(m[1])); }
    for (const row of ['6', '7', '8']) { const m = (blocks[row] || '').match(new RegExp(`# p95 ${LIST} ms`)); if (m) put(`row ${row}`, r, nums(m[1])[0], nums(m[1])); }
    { const m = (blocks['9'] || '').match(new RegExp(`# p95 rolling ${LIST} ms, flat ${LIST} ms`));
      if (m) { const ro = nums(m[1]), fl = nums(m[2]); put('row 9 ratio', r, +(ro[0] / fl[0]).toFixed(3), ro.map((x, i) => +(x / fl[i]).toFixed(3))); put('row 9 rolling p95 (secondary)', r, ro[0], ro); put('row 9 flat p95 (secondary)', r, fl[0], fl); } }
  }
}
say('\nEVERY SAMPLE (the first attempt; a retry after it in brackets; - none):');
const order = (c) => (CASES.indexOf(c) + 1) || 99;
for (const c of Object.keys(S).sort((a, b) => order(a) - order(b))) {
  const cells = (l) => { const byK = new Map((S[c][l] || []).map((x) => [x.k, x])); const ks = [...new Set(runs.filter((r) => r.label === l).map((r) => r.k))].sort((a, b) => a - b); return ks.map((k) => { const x = byK.get(k); return x ? `${x.v}${x.all.length > 1 ? ` [${x.all.slice(1).join(', ')}]` : ''}${x.quiet ? '' : '*'}` : '-'; }).join('  '); };
  say(`  ${c.padEnd(30)} ${L1}: ${cells(L1)}   |   ${L2}: ${cells(L2)}`);
}
say('  (* a run not quiet by the record)');
if (kind === 'sf') for (const c of ['row 3', 'row 4a', 'row 4b']) say(`  ${c} other bars, first attempt (release ms / longest ms / whole after ms): ${[L1, L2].map((l) => `${l}: ${runs.filter((r) => r.label === l).map((r) => { const a = r[`${c} other`]; return a ? `${a.release ?? '-'}/${a.longest}/${a.whole ?? 'never'}` : '-'; }).join('; ')}`).join('  |  ')}`);
if (kind === 'd642') say(`  the row's own verdicts at 2x: ${[L1, L2].map((l) => `${l} ${runs.filter((r) => r.label === l && r.verdict === 'fail').length} fail of ${runs.filter((r) => r.label === l).length}`).join(', ')}`);

for (const which of ['every run', 'quiet runs only']) {
  const pick = (c, l) => ((S[c] || {})[l] || []).filter((x) => which === 'every run' || x.quiet).map((x) => x.v);
  if (which === 'quiet runs only' && runs.every((r) => quiet(r.snap))) { say('\nquiet runs only: every run was quiet by the record, so this reading is the one above'); break; }
  say(`\nVERDICTS (${which}; ${L2} against ${L1}; rule: one-sided p < ${ALPHA} AND the median more than the margin):`);
  let higher = 0, lower = 0, counted = 0; const xs = {}, ys = {};
  for (const c of CASES) {
    const x = pick(c, L1), y = pick(c, L2);
    if (!x.length || !y.length) { say(`  ${c}: no samples on one side (${x.length} / ${y.length})`); continue; }
    const V = verdict(x, y, ALPHA, MARGIN[c]); counted++; if (V.dm > 0) higher++; if (V.dm < 0) lower++; xs[c] = x; ys[c] = y;
    const minP = 1 / choose(x.length + y.length, y.length);
    const atBar = x.some((v) => v > BAR[c]) && x.some((v) => v <= BAR[c]) ? ` — ${L1} SITS AT ITS BAR (its own runs both pass and fail)` : x.every((v) => v > BAR[c]) ? ` — ${L1} is over its bar in every run` : '';
    say(`  ${c.padEnd(16)} ${L1} median ${med(x).toFixed(3)} (n ${x.length}), ${L2} ${med(y).toFixed(3)} (n ${y.length}); diff ${V.dm >= 0 ? '+' : ''}${V.dm.toFixed(3)} (margin ${MARGIN[c]}); above p ${V.up.toFixed(4)}, below p ${V.dn.toFixed(4)}${minP >= ALPHA ? ` (CANNOT FIRE at this n: the smallest p is ${minP.toFixed(4)})` : ''} -> ${V.v}; over the bar ${BAR[c]}: ${x.filter((v) => v > BAR[c]).length}/${x.length} and ${y.filter((v) => v > BAR[c]).length}/${y.length}${atBar}`);
  }
  if (kind !== 'd642') say(`  across the cases: ${L2}'s median higher in ${higher}, lower in ${lower}, of ${counted} (one-sided sign p ${binomGE(higher, counted).toFixed(4)}; told at ${signK(counted)} of ${counted}) -> ${higher >= signK(counted) ? 'SLOWER ACROSS THE BOARD' : lower >= signK(counted) ? 'FASTER ACROSS THE BOARD' : 'not told'}`);
  const secondary = kind === 'd642' ? ['rolling p95 (secondary)', 'early p95'] : kind === 'df' ? ['row 9 rolling p95 (secondary)', 'row 9 flat p95 (secondary)'] : [];
  for (const c of secondary) { const x = pick(c, L1), y = pick(c, L2); if (x.length && y.length) { const V = verdict(x, y, 1, Infinity); say(`  secondary, ${c}: ${L1} median ${med(x)}, ${L2} ${med(y)}; above p ${V.up.toFixed(4)}, below p ${V.dn.toFixed(4)}`); } }
  if (AA) {
    const nullMet = Object.keys(xs).every((c) => verdict(xs[c], ys[c], ALPHA, MARGIN[c]).v === 'not told');
    say(`\n  THE A/A (${which}): the NULL control is ${nullMet ? 'MET: no case told either way' : 'BROKEN: a case is told on one commit against itself'}; WHAT D RESOLVES, the smallest uniform shift the rule tells (each way, the larger):`);
    for (const c of Object.keys(xs)) {
      const a = smallestTold(xs[c], ys[c], ALPHA, MARGIN[c]), b = smallestTold(ys[c], xs[c], ALPHA, MARGIN[c]), all = [...xs[c], ...ys[c]];
      say(`    ${c.padEnd(16)} ${a == null || b == null ? 'cannot fire at this n' : `${Math.max(a, b).toFixed(2)} (${L2} up ${a}, ${L1} up ${b})`}; spread at this commit ${Math.min(...all)} to ${Math.max(...all)} (n ${all.length}), the margin ${MARGIN[c]}`);
    }
    if (kind !== 'd642') {
      const cs = Object.keys(xs), k = signK(cs.length);
      const hi = (sh) => cs.filter((c) => med(ys[c].map((v) => v + sh)) > med(xs[c])).length, lo = (sh) => cs.filter((c) => med(xs[c].map((v) => v + sh)) > med(ys[c])).length;
      let a = 0; while (hi(a / 100) < k && a < 100000) a++; let b = 0; while (lo(b / 100) < k && b < 100000) b++;
      say(`    across the board: a uniform cost on every case of ${(Math.max(a, b) / 100).toFixed(2)} or more is told by the sign test (${k} of ${cs.length}) here (${L2} up ${a / 100}, ${L1} up ${b / 100})`);
    }
  }
}
fs.writeFileSync(path.join(dir, 'analysis.txt'), out.join('\n') + '\n');
