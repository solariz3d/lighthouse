// analyse266.js (pane B, L266): the registered verdicts, from the session's own files. Exact one-sided Mann-Whitney (rank sums with mid-ranks for ties, the exact
// distribution by counting every subset, so ties are handled exactly), the medians, the bars, and the sign test across sculpt-frame's nine cases. Each verdict is
// read twice, with every run and with only the quiet runs (none of his app, his game, nor another seat's slot or hold).
// usage: node analyse266.js <out dir>
'use strict';
const fs = require('fs'), path = require('path');
const dir = process.argv[2];
const med = (a) => { const s = [...a].sort((x, y) => x - y), n = s.length; return n ? (n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2) : null; };
/** exact P(rank sum of y >= observed) under H0, mid-ranks for ties: y above x is the alternative */
function mwuGreater(x, y) {
  const all = [...x.map((v) => ({ v, g: 0 })), ...y.map((v) => ({ v, g: 1 }))].sort((a, b) => a.v - b.v), N = all.length;
  const r2 = new Array(N); for (let i = 0; i < N;) { let j = i; while (j + 1 < N && all[j + 1].v === all[i].v) j++; for (let k = i; k <= j; k++) r2[k] = i + j + 2; i = j + 1; }   // twice the mid-rank
  const obs = all.reduce((s, a, i) => s + (a.g ? r2[i] : 0), 0), m = y.length, max = r2.reduce((a, b) => a + b, 0);
  let f = Array.from({ length: m + 1 }, () => new Float64Array(max + 1)); f[0][0] = 1;
  for (const r of r2) for (let k = m; k >= 1; k--) { const a = f[k], b = f[k - 1]; for (let s = max; s >= r; s--) if (b[s - r]) a[s] += b[s - r]; }
  let tot = 0, ge = 0; for (let s = 0; s <= max; s++) { tot += f[m][s]; if (s >= obs) ge += f[m][s]; }
  const U = obs / 2 - (m * (m + 1)) / 2;   // pairs (x, y) with y > x, ties half
  return { p: ge / tot, U, pairs: x.length * y.length };
}
const binomGE = (k, n) => { let s = 0; for (let i = k; i <= n; i++) { let c = 1; for (let j = 0; j < i; j++) c = (c * (n - j)) / (j + 1); s += c; } return s / 2 ** n; };
const quiet = (snap) => snap && !snap.hisApp.length && !snap.game.length && Object.values(snap.locks).every((l) => !l || (/^B L266/.test(l.cmd || '')));
const out = [];
const say = (s) => { out.push(s); console.log(s); };

// TIMING 1
const d = fs.readFileSync(path.join(dir, 'd642.jsonl'), 'utf8').trim().split(/\r?\n/).map((l) => JSON.parse(l));
const [A, B] = [...new Set(d.map((r) => r.sha))];
say(`D642 row 1, every sample in run order (ratio, rolling/early p95 ms, the row's verdict): ${d.map((r) => `${r.k}${r.sha.slice(0, 2)} ${r.ratio} (${r.rolling}/${r.early}) ${r.verdict}`).join('; ')}`);
say(`  the row's own verdicts: ${A} ${d.filter((r) => r.sha === A && r.verdict === 'fail').length} fail of ${d.filter((r) => r.sha === A).length}, ${B} ${d.filter((r) => r.sha === B && r.verdict === 'fail').length} fail of ${d.filter((r) => r.sha === B).length}; a game waited for: ${d.some((r) => r.waitedGameS > 5) ? 'yes' : 'never'}; busy before each run ${Math.min(...d.map((r) => r.snap.busyPct))} to ${Math.max(...d.map((r) => r.snap.busyPct))} %`);
for (const which of ['every run', 'quiet runs only']) {
  const rows = d.filter((r) => which === 'every run' || quiet(r.snap)), a = rows.filter((r) => r.sha === A), b = rows.filter((r) => r.sha === B);
  const ra = a.map((r) => r.ratio), rb = b.map((r) => r.ratio), up = mwuGreater(ra, rb), down = mwuGreater(rb, ra), dm = med(rb) - med(ra);
  const lu = mwuGreater(a.map((r) => r.rolling), b.map((r) => r.rolling)), ld = mwuGreater(b.map((r) => r.rolling), a.map((r) => r.rolling));
  say(`D642 row 1 (${which}): ${A} n ${a.length}, median ratio ${med(ra).toFixed(3)}, ${ra.filter((x) => x > 2).length} of ${ra.length} over the 2x bar; ${B} n ${b.length}, median ${med(rb).toFixed(3)}, ${rb.filter((x) => x > 2).length} of ${rb.length} over`);
  say(`  ${B} above ${A}: U ${up.U} of ${up.pairs}, exact one-sided p ${up.p.toFixed(4)}; below: p ${down.p.toFixed(4)}; median difference ${dm >= 0 ? '+' : ''}${dm.toFixed(3)} (rule: p < 0.05 AND more than 0.10)`);
  say(`  verdict: ${up.p < 0.05 && dm > 0.10 ? `${B} SLOWER` : down.p < 0.05 && -dm > 0.10 ? `${B} FASTER` : 'not told from noise at this n'}; the row at its bar: ${ra.some((x) => x > 2) && ra.some((x) => x <= 2) ? `${A}'s own runs both pass and fail at 2x, so the row's red is noise on L` : 'not both ways at ' + A}`);
  say(`  secondary, the rolling p95 alone: ${A} median ${med(a.map((r) => r.rolling))} ms, ${B} ${med(b.map((r) => r.rolling))} ms; ${B} above p ${lu.p.toFixed(4)}, below p ${ld.p.toFixed(4)}; the early p95: ${A} median ${med(a.map((r) => r.early))}, ${B} ${med(b.map((r) => r.early))}`);
}

// TIMING 2
const sfl = path.join(dir, 'sf.jsonl');
if (!fs.existsSync(sfl)) { say('sculpt-frame: no runs'); }
else {
  const runs = fs.readFileSync(sfl, 'utf8').trim().split(/\r?\n/).map((l) => JSON.parse(l));
  const ATT = /p95 ([\d.]+) \(median ([\d.]+), (\d+) work frames\), release ([\d.-]+), longest (\d+), whole after (\w+)/g;
  const att = (s) => [...(s || '').matchAll(ATT)].map((m) => ({ p95: +m[1], median: +m[2], frames: +m[3], release: m[4] === '-' ? null : +m[4], longest: +m[5], whole: m[6] === 'never' ? null : +m[6] }));
  const LOOKS = ['aqua', 'skyline', 'glass', 'aurora', 'sigil'];
  for (const r of runs) {
    const t = fs.readFileSync(path.join(dir, `sf-${String(r.k).padStart(2, '0')}-${r.sha}.tap`), 'utf8');
    r.cases = {};
    const byLook = t.match(/# p95 ms by look: (\{[^\n]*\})/);
    if (byLook) { const g = JSON.parse(byLook[1]); for (const l of LOOKS) if (g[l]) r.cases[`row 1 ${l}`] = { first: g[l][0], all: g[l] }; }
    else { const f = t.match(/(aqua|skyline|glass|aurora|sigil), Twist on one piece of 12: ([^\n]*?), over 6 ms/); if (f) { const a = att(f[2]); r.cases[`row 1 ${f[1]}`] = { first: a[0] && a[0].p95, all: a.map((x) => x.p95), failed: true, attempts: a }; r.row1StoppedAt = f[1]; } }
    for (const [c, re] of [['row 2', /# 10 km open, Grab r 200: ([^\n]*)/], ['row 3', /# 10 km closed, Bend r 200: ([^\n]*)/], ['row 4a', /# tube360, grab r 60: ([^\n]*)/], ['row 4b', /# tube280, twist r 60: ([^\n]*)/]]) {
      const m = t.match(re); if (m) { const a = att(m[1]); r.cases[c] = { first: a[0] && a[0].p95, all: a.map((x) => x.p95), attempts: a }; }
    }
  }
  const [F, C] = [...new Set(runs.map((r) => r.sha))];
  const CASES = [...LOOKS.map((l) => `row 1 ${l}`), 'row 2', 'row 3', 'row 4a', 'row 4b'];
  say(`\nsculpt-frame: ${runs.length} runs (${runs.filter((r) => r.sha === F).length} at ${F}, ${runs.filter((r) => r.sha === C).length} at ${C}); every sample, the first attempt's p95 in ms, run by run (a retry after it in brackets):`);
  for (const c of CASES) {
    const cell = (r) => { const x = r.cases[c]; return x ? `${x.first}${x.all.length > 1 ? ` [${x.all.slice(1).join(', ')}]` : ''}` : '-'; };
    say(`  ${c.padEnd(13)} ${F}: ${runs.filter((r) => r.sha === F).map(cell).join('  ')}   |   ${C}: ${runs.filter((r) => r.sha === C).map(cell).join('  ')}`);
  }
  for (const c of ['row 3', 'row 4a', 'row 4b']) {
    const cell = (r) => { const x = r.cases[c]; return x && x.attempts && x.attempts[0] ? `rel ${x.attempts[0].release ?? '-'} long ${x.attempts[0].longest} whole ${x.attempts[0].whole ?? 'never'}` : '-'; };
    say(`  ${c} other bars (first attempt): ${F}: ${runs.filter((r) => r.sha === F).map(cell).join('; ')}  |  ${C}: ${runs.filter((r) => r.sha === C).map(cell).join('; ')}`);
  }
  for (const which of ['every run', 'without run 1 (the runs the librarian workflow overlapped, 11:57Z to 12:15Z: the amendment verdict set)']) {
    const rs = runs.filter((r) => which === 'every run' || r.k > 1); let higher = 0, counted = 0;
    say(`\n  verdicts (${which}):`);
    for (const c of CASES) {
      const f = rs.filter((r) => r.sha === F && r.cases[c] && r.cases[c].first != null).map((r) => r.cases[c].first), g = rs.filter((r) => r.sha === C && r.cases[c] && r.cases[c].first != null).map((r) => r.cases[c].first);
      if (!f.length || !g.length) { say(`    ${c}: no samples on one side (${f.length} / ${g.length})`); continue; }
      const up = mwuGreater(f, g), down = mwuGreater(g, f), dm = med(g) - med(f); counted++; if (dm > 0) higher++;
      say(`    ${c.padEnd(13)} ${F} median ${med(f).toFixed(2)} (n ${f.length}), ${C} ${med(g).toFixed(2)} (n ${g.length}); diff ${dm >= 0 ? '+' : ''}${dm.toFixed(2)}; above p ${up.p.toFixed(4)}, below p ${down.p.toFixed(4)} -> ${up.p < 0.01 && dm > 0.3 ? 'SLOWER' : down.p < 0.01 && -dm > 0.3 ? 'FASTER' : 'not told'}; over 6.0: ${f.filter((x) => x > 6).length}/${f.length} and ${g.filter((x) => x > 6).length}/${g.length}`);
    }
    say(`    across the cases: ${C}'s median higher in ${higher} of ${counted} (sign test, one-sided p ${binomGE(higher, counted).toFixed(4)}; registered: at least 8 of 9)`);
  }
  say(`\n  machine per run: ${runs.map((r) => `${r.k}${r.sha.slice(0, 2)} busy ${r.snap.busyPct}% ${quiet(r.snap) ? 'quiet' : 'NOT QUIET'}${r.waitedGameS > 5 ? ` waited ${r.waitedGameS} s for his game` : ''}`).join('; ')}`);
}
fs.writeFileSync(path.join(dir, 'analysis266.txt'), out.join('\n') + '\n');
