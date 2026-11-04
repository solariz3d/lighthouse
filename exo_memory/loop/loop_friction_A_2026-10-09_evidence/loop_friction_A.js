// loop_friction_A.js - D276 item 3 + H2, seat A. READ-ONLY: reads C:\Consonance\data\lap.jsonl, writes only to stdout.
//   node loop_friction_A.js [--lap path]        (default C:/Consonance/data/lap.jsonl)
// Every number in loop_friction_A_2026-10-09.md is a line of this program's output.
const fs = require('fs');
const argv = process.argv.slice(2);
const LAP = argv.includes('--lap') ? argv[argv.indexOf('--lap') + 1] : 'C:/Consonance/data/lap.jsonl';
const rows = fs.readFileSync(LAP, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));

// CUTOFFS. C1 = the first row in sources-gate.jsonl (a live probe, 2026-10-02T19:58:12Z). C2 = the commit that made the
// reply slot LIVE (783d5905, 2026-10-03 06:02:32 -0600 = 12:02:32Z). The span between is "transition" and is reported apart.
const C1 = Date.parse('2026-10-02T19:58:12Z'), C2 = Date.parse('2026-10-03T12:02:32Z');
const era = (t) => (t < C1 ? 'before' : t < C2 ? 'transition' : 'after');

const min = (ms) => ms / 60000;
const q = (a, p) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); const i = (s.length - 1) * p; const lo = Math.floor(i), hi = Math.ceil(i); return s[lo] + (s[hi] - s[lo]) * (i - lo); };
const med = (a) => q(a, 0.5);
const f1 = (x) => (x === null || x === undefined ? 'n/a' : x.toFixed(1));
const fmt = (a) => (a.length ? `n=${a.length} median ${f1(med(a))} (IQR ${f1(q(a, 0.25))}-${f1(q(a, 0.75))}) min` : 'n=0');

// seeded bootstrap of (median(a) - median(b)), 95% interval
let seed = 12345; const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
function bootDiff(a, b, B = 5000) {
  if (a.length < 2 || b.length < 2) return null;
  const d = [];
  for (let i = 0; i < B; i++) {
    const sa = Array.from({ length: a.length }, () => a[Math.floor(rnd() * a.length)]);
    const sb = Array.from({ length: b.length }, () => b[Math.floor(rnd() * b.length)]);
    d.push(med(sa) - med(sb));
  }
  return [q(d, 0.025), q(d, 0.975)];
}

// ---- group chain rows per lap id, file order (verified in-order: no adjacent at-inversions) ----
const byLap = {};
for (const r of rows) if (r.stage === 'chain') (byLap[r.lap] = byLap[r.lap] || []).push(r);
const isPane = (p) => typeof p === 'string' && /^[A-Z]$/.test(p);

// ---- ROUNDS: a maximal run of consecutive `dispatched` rows in one lap = one round; panes = union of their `to` letters ----
const rounds = [];
for (const id of Object.keys(byLap)) {
  const a = byLap[id];
  for (let i = 0; i < a.length; i++) {
    if (a[i].chain !== 'dispatched') continue;
    if (i > 0 && a[i - 1].chain === 'dispatched') continue; // not the start of a run
    let j = i; const panes = new Set();
    while (j < a.length && a[j].chain === 'dispatched') { (Array.isArray(a[j].to) ? a[j].to : []).filter(isPane).forEach((p) => panes.add(p)); j++; }
    // j = first row that is not `dispatched`
    const t0 = a[i].at;
    const next = j < a.length ? a[j] : null;
    // E2 strict: the first `handbacks-in` row after t0 and before the next dispatched run begins
    let k = j, hb = null;
    while (k < a.length && a[k].chain !== 'dispatched') { if (a[k].chain === 'handbacks-in') { hb = a[k]; break; } k++; }
    rounds.push({ lap: id, t0, panes: [...panes].sort(), nrun: j - i, e1: next ? next.at - t0 : null, e1type: next ? next.chain + '/' + next.holder : null, e2: hb ? hb.at - t0 : null });
  }
}

// ---- CYCLES: from the first dispatched row after a `filed` (or lap start) to the next `filed` row ----
const cycles = [];
for (const id of Object.keys(byLap)) {
  const a = byLap[id]; let i = 0;
  while (i < a.length) {
    // find first dispatch
    let s = i; while (s < a.length && a[s].chain !== 'dispatched') { if (a[s].chain === 'filed') { s++; i = s; continue; } s++; }
    if (s >= a.length) break;
    // find the filed that closes it
    let e = s; while (e < a.length && a[e].chain !== 'filed') e++;
    if (e >= a.length) break; // still open: excluded
    const seg = a.slice(s, e + 1);
    // runs inside the segment
    const runs = []; for (let x = 0; x < seg.length; x++) { if (seg[x].chain !== 'dispatched') continue; if (x > 0 && seg[x - 1].chain === 'dispatched') { const r = runs[runs.length - 1]; (Array.isArray(seg[x].to) ? seg[x].to : []).filter(isPane).forEach((p) => r.panes.add(p)); r.end = x; continue; } runs.push({ start: x, end: x, panes: new Set((Array.isArray(seg[x].to) ? seg[x].to : []).filter(isPane)) }); }
    const union = new Set(); let maxK = 0; for (const r of runs) { r.panes.forEach((p) => union.add(p)); maxK = Math.max(maxK, r.panes.size); }
    const lastRun = runs[runs.length - 1];
    const afterLast = seg[lastRun.end + 1]; // first non-dispatched row after the last dispatch run (the chair taking the chain back)
    const t0 = seg[0].at, tc = seg[seg.length - 1].at;
    cycles.push({ lap: id, t0, tc, dur: tc - t0, nrounds: runs.length, union: union.size, maxK, tail: afterLast ? tc - afterLast.at : null, head: afterLast ? afterLast.at - t0 : null, closer: seg[seg.length - 1].holder });
    i = e + 1;
  }
}

const out = [];
const P = (s = '') => out.push(s);
P(`# raw measurement output of loop_friction_A.js on ${LAP}`);
P(`rows ${rows.length}; chain rows ${rows.filter((r) => r.stage === 'chain').length}; laps with chain rows ${Object.keys(byLap).length}; rounds ${rounds.length}; closed cycles with a dispatch ${cycles.length}`);
P(`first row ${new Date(rows[0].at).toISOString()}  last row ${new Date(rows[rows.length - 1].at).toISOString()}`);
P(`C1 ${new Date(C1).toISOString()} (first sources-gate.jsonl row)  C2 ${new Date(C2).toISOString()} (reply slot live, commit 783d5905)`);

P('\n## ITEM 3a - rounds (dispatched run -> next chain row), by era, minutes');
for (const e of ['before', 'transition', 'after']) {
  const r = rounds.filter((x) => era(x.t0) === e);
  P(`${e}: rounds ${r.length}; E1 ${fmt(r.filter((x) => x.e1 !== null).map((x) => min(x.e1)))}; E2(handbacks-in recorded) ${fmt(r.filter((x) => x.e2 !== null).map((x) => min(x.e2)))}`);
}
P('\nE1 target row type, by era (count of rounds):');
for (const e of ['before', 'transition', 'after']) { const c = {}; for (const x of rounds.filter((y) => era(y.t0) === e)) c[x.e1type] = (c[x.e1type] || 0) + 1; P(`${e}: ${JSON.stringify(c)}`); }
{ const b = rounds.filter((x) => era(x.t0) === 'before' && x.e1 !== null).map((x) => min(x.e1)); const a = rounds.filter((x) => era(x.t0) === 'after' && x.e1 !== null).map((x) => min(x.e1)); const ci = bootDiff(a, b); P(`E1 median after - before = ${f1(med(a) - med(b))} min; bootstrap 95% [${ci ? f1(ci[0]) + ', ' + f1(ci[1]) : 'n/a'}]`); }
{ const b = rounds.filter((x) => era(x.t0) === 'before' && x.e2 !== null).map((x) => min(x.e2)); const a = rounds.filter((x) => era(x.t0) === 'after' && x.e2 !== null).map((x) => min(x.e2)); const ci = bootDiff(a, b); P(`E2 median after - before = ${f1(med(a) - med(b))} min; bootstrap 95% [${ci ? f1(ci[0]) + ', ' + f1(ci[1]) : 'n/a'}]`); }

P('\n## ITEM 3b - per pane: SINGLE-pane rounds only (the cleanest per-pane read), E1 and E2, by era');
const letters = [...new Set(rounds.flatMap((r) => r.panes))].sort();
for (const L of letters) {
  const single = rounds.filter((x) => x.panes.length === 1 && x.panes[0] === L);
  if (!single.length) continue;
  P(`pane ${L}:`);
  for (const e of ['before', 'transition', 'after']) { const r = single.filter((x) => era(x.t0) === e); P(`  ${e}: E1 ${fmt(r.filter((x) => x.e1 !== null).map((x) => min(x.e1)))}; E2 ${fmt(r.filter((x) => x.e2 !== null).map((x) => min(x.e2)))}`); }
}
P('\n## ITEM 3c - per pane: ANY round the pane was in (co-dispatch included), E1, by era');
for (const L of letters) {
  const any = rounds.filter((x) => x.panes.includes(L));
  if (any.length < 5) continue;
  P(`pane ${L}: ` + ['before', 'transition', 'after'].map((e) => `${e} ${fmt(any.filter((x) => era(x.t0) === e && x.e1 !== null).map((x) => min(x.e1)))}`).join(' | '));
}
P('\n## ITEM 3d - weekly medians of E1 (week starts Monday UTC), all rounds, with n and the share of rounds that were multi-pane');
{
  const wk = (t) => { const d = new Date(t); const dow = (d.getUTCDay() + 6) % 7; return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - dow)).toISOString().slice(0, 10); };
  const w = {}; for (const r of rounds) (w[wk(r.t0)] = w[wk(r.t0)] || []).push(r);
  for (const k of Object.keys(w).sort()) { const a = w[k]; P(`${k}  rounds ${String(a.length).padStart(3)}  E1 median ${f1(med(a.filter((x) => x.e1 !== null).map((x) => min(x.e1))))}  multi-pane share ${(a.filter((x) => x.panes.length >= 2).length / a.length * 100).toFixed(0)}%`); }
}

P('\n## ITEM 3e - cycles (first dispatch -> filed), by era of the first dispatch');
for (const e of ['before', 'transition', 'after']) { const c = cycles.filter((x) => era(x.t0) === e); P(`${e}: ${fmt(c.map((x) => min(x.dur)))}`); }
{ const b = cycles.filter((x) => era(x.t0) === 'before').map((x) => min(x.dur)); const a = cycles.filter((x) => era(x.t0) === 'after').map((x) => min(x.dur)); const ci = bootDiff(a, b); P(`cycle median after - before = ${f1(med(a) - med(b))} min; bootstrap 95% [${ci ? f1(ci[0]) + ', ' + f1(ci[1]) : 'n/a'}]`); }
P('cycle size by era (rounds per cycle, median / mean): ' + ['before', 'transition', 'after'].map((e) => { const c = cycles.filter((x) => era(x.t0) === e).map((x) => x.nrounds); return `${e} ${f1(med(c))}/${f1(c.reduce((a, b) => a + b, 0) / (c.length || 1))}`; }).join(' | '));

// ---- H2 ----
const NOPANE = "no lettered pane (dispatch named a non-pane seat only)";
const cls = (c) => (c.union === 0 ? NOPANE : c.maxK >= 3 ? 'split>=3 (some round had 3+ panes)' : c.maxK === 2 ? 'split=2 (some round had 2 panes)' : c.union >= 2 ? 'serial (one pane per round, 2+ different panes over the cycle)' : 'single (one pane for the whole cycle)');
const classes = [NOPANE, 'single (one pane for the whole cycle)', 'serial (one pane per round, 2+ different panes over the cycle)', 'split=2 (some round had 2 panes)', 'split>=3 (some round had 3+ panes)'];
function h2(label, set) {
  P(`\n### ${label}: ${set.length} closed cycles`);
  for (const k of classes) { const c = set.filter((x) => cls(x) === k); P(`${k}: ${fmt(c.map((x) => min(x.dur)))}; tail(last panes-round -> filed) ${fmt(c.filter((x) => x.tail !== null).map((x) => min(x.tail)))}; rounds/cycle median ${f1(med(c.map((x) => x.nrounds)))}`); }
  const single = set.filter((x) => x.maxK === 1 && x.union === 1).map((x) => min(x.dur));
  const split = set.filter((x) => x.maxK >= 2).map((x) => min(x.dur));
  const split3 = set.filter((x) => x.maxK >= 3).map((x) => min(x.dur));
  const ci = bootDiff(split, single); const ci3 = bootDiff(split3, single);
  P(`H2 test (all strata pooled): split(maxK>=2) ${fmt(split)} vs single ${fmt(single)}: median diff ${f1(med(split) - med(single))} min; bootstrap 95% [${ci ? f1(ci[0]) + ', ' + f1(ci[1]) : 'n/a'}]`);
  P(`                           split(maxK>=3) ${fmt(split3)} vs single: median diff ${f1(med(split3) - med(single))} min; bootstrap 95% [${ci3 ? f1(ci3[0]) + ', ' + f1(ci3[1]) : 'n/a'}]`);
  P('stratified by size proxy = rounds per cycle (the only size the ledger records):');
  for (const [lab, lo, hi] of [['1 round', 1, 1], ['2-3 rounds', 2, 3], ['4+ rounds', 4, 1e9]]) {
    const s = set.filter((x) => x.nrounds >= lo && x.nrounds <= hi);
    const a = s.filter((x) => x.maxK >= 2).map((x) => min(x.dur)); const b = s.filter((x) => x.maxK === 1 && x.union === 1).map((x) => min(x.dur)); const sr = s.filter((x) => x.maxK === 1 && x.union >= 2).map((x) => min(x.dur));
    const cd = bootDiff(a, b);
    P(`  ${lab}: split ${fmt(a)} | single ${fmt(b)} | serial ${fmt(sr)} | split-single median diff ${a.length && b.length ? f1(med(a) - med(b)) : 'n/a'}${cd ? ' [95% ' + f1(cd[0]) + ', ' + f1(cd[1]) + ']' : ''}`);
  }
}
P('\n## H2 - single-pane vs split cycles, merge included (dispatch -> filed)');
h2('ALL ERAS', cycles);
h2('BEFORE the paperwork gates', cycles.filter((x) => era(x.t0) === 'before'));
h2('AFTER the paperwork gates', cycles.filter((x) => era(x.t0) === 'after'));
P('\n## H2 - the merge alone: tail = (chair takes the chain back after the LAST panes round) -> filed');
for (const k of classes) { const c = cycles.filter((x) => cls(x) === k && x.tail !== null); P(`${k}: ${fmt(c.map((x) => min(x.tail)))}`); }
P('\n## Who closes the cycle (holder on the filed row), by class: ' + JSON.stringify(Object.fromEntries(classes.map((k) => { const c = {}; cycles.filter((x) => cls(x) === k).forEach((x) => (c[x.closer] = (c[x.closer] || 0) + 1)); return [k, c]; }))));
P('\n## Hours the cycles span in the data, by class (is a cycle one task? duration > 8h):');
for (const k of classes) { const c = cycles.filter((x) => cls(x) === k); P(`${k}: cycles over 8h ${c.filter((x) => x.dur > 8 * 3600e3).length} of ${c.length}`); }
// ================= E3: dispatch -> LAST HAND-BACK, from board.jsonl, by chain-status.js's own rule =================
// A pane stops OWING when it makes its first committee post after the dispatch (chain-status.js header, "A pane OWES while its
// newest dispatch has no committee post from it afterwards"). So E3 = max over the round's panes of (first committee post by that pane
// after t0) - t0, counted only if every pane in the round posted before the round's end (the next dispatch run in the lap, or `filed`).
// A round where some pane never posted in time is CENSORED and counted, not dropped silently.
const BOARD = argv.includes('--board') ? argv[argv.indexOf('--board') + 1] : 'C:/Consonance/data/board.jsonl';
const posts = {}; let bad = 0, nPosts = 0;
for (const l of fs.readFileSync(BOARD, 'utf8').split('\n')) {
  if (!l.includes('"role":"committee"')) continue;
  let r; try { r = JSON.parse(l); } catch { bad++; continue; }
  if (r.role !== 'committee' || !isPane(r.pane)) continue;
  const t = typeof r.ts === 'number' ? r.ts : Date.parse(r.ts); if (!Number.isFinite(t)) continue;
  (posts[r.pane] = posts[r.pane] || []).push(t); nPosts++;
}
for (const p in posts) posts[p].sort((a, b) => a - b);
const firstAfter = (p, t) => { const a = posts[p] || []; let lo = 0, hi = a.length; while (lo < hi) { const m = (lo + hi) >> 1; if (a[m] > t) hi = m; else lo = m + 1; } return lo < a.length ? a[lo] : null; };
// round end bound = the next dispatched-run start or the next filed row in the same lap
for (const r of rounds) {
  const a = byLap[r.lap]; let i = a.findIndex((x) => x.at === r.t0 && x.chain === 'dispatched'); let j = i; while (j < a.length && a[j].chain === 'dispatched') j++;
  let k = j; while (k < a.length && a[k].chain !== 'dispatched' && a[k].chain !== 'filed') k++;
  r.endBound = k < a.length ? a[k].at : Infinity;
  let worst = 0, ok = r.panes.length > 0;
  for (const p of r.panes) { const t = firstAfter(p, r.t0); if (t === null || t > r.endBound) { ok = false; break; } worst = Math.max(worst, t - r.t0); }
  r.e3 = ok ? worst : null;
}
P(`\n## E3 - dispatch -> last hand-back (board.jsonl committee posts, chain-status's rule). board committee posts read ${nPosts} (unparseable lines skipped: ${bad})`);
for (const e of ['before', 'transition', 'after']) {
  const r = rounds.filter((x) => era(x.t0) === e && x.panes.length > 0);
  P(`${e}: rounds with panes ${r.length}; E3 ${fmt(r.filter((x) => x.e3 !== null).map((x) => min(x.e3)))}; censored (a pane had not posted by the round's end) ${r.filter((x) => x.e3 === null).length}`);
}
{ const b = rounds.filter((x) => era(x.t0) === 'before' && x.e3 !== null).map((x) => min(x.e3)); const a = rounds.filter((x) => era(x.t0) === 'after' && x.e3 !== null).map((x) => min(x.e3)); const ci = bootDiff(a, b); P(`E3 median after - before = ${f1(med(a) - med(b))} min; bootstrap 95% [${ci ? f1(ci[0]) + ', ' + f1(ci[1]) : 'n/a'}]`); }
P('\nE3 per pane, SINGLE-pane rounds:');
for (const L of ['A', 'B', 'C', 'E']) {
  const s = rounds.filter((x) => x.panes.length === 1 && x.panes[0] === L);
  P(`pane ${L}: ` + ['before', 'transition', 'after'].map((e) => `${e} ${fmt(s.filter((x) => era(x.t0) === e && x.e3 !== null).map((x) => min(x.e3)))}`).join(' | '));
}
P('\n## ROUND TIME BY NUMBER OF PANES DISPATCHED IN THE ROUND (K) - the elapsed price of adding a pane to one round');
for (const [lab, filt] of [['ALL ERAS', () => true], ['BEFORE', (x) => era(x.t0) === 'before'], ['AFTER', (x) => era(x.t0) === 'after']]) {
  P(lab + ':');
  for (const K of [1, 2, 3, 4]) {
    const s = rounds.filter((x) => x.panes.length === K && filt(x));
    P(`  K=${K}: E1 ${fmt(s.filter((x) => x.e1 !== null).map((x) => min(x.e1)))} | E3 ${fmt(s.filter((x) => x.e3 !== null).map((x) => min(x.e3)))} | E3 censored ${s.filter((x) => x.e3 === null).length}`);
  }
}
{
  const m = {}; for (const K of [1, 2, 3, 4]) m[K] = med(rounds.filter((x) => x.panes.length === K && x.e3 !== null).map((x) => min(x.e3)));
  P(`E3 ratio to K=1 (all eras): K=2 ${f1(m[2] / m[1])}x, K=3 ${f1(m[3] / m[1])}x, K=4 ${f1(m[4] / m[1])}x  (serial work by K single panes would be ~K x, ASSUMING equal-size parts - which the ledger cannot confirm)`);
}
// sensitivity: before = the 14 days before C1 only
P('\n## SENSITIVITY - "before" = only the 14 days before the SOURCES gate (2026-09-18 .. 10-02), vs after');
{
  const B0 = C1 - 14 * 86400e3; const bf = rounds.filter((x) => x.t0 >= B0 && x.t0 < C1), af = rounds.filter((x) => era(x.t0) === 'after');
  const sets = [['E1', (x) => x.e1], ['E3', (x) => x.e3]];
  for (const [n, g] of sets) { const b = bf.filter((x) => g(x) !== null).map((x) => min(g(x))), a = af.filter((x) => g(x) !== null).map((x) => min(g(x))); const ci = bootDiff(a, b); P(`${n}: before14 ${fmt(b)} | after ${fmt(a)} | diff ${f1(med(a) - med(b))} [95% ${ci ? f1(ci[0]) + ', ' + f1(ci[1]) : 'n/a'}]`); }
  P(`multi-pane share of rounds: before14 ${(bf.filter((x) => x.panes.length >= 2).length / bf.length * 100).toFixed(0)}% | after ${(af.filter((x) => x.panes.length >= 2).length / af.length * 100).toFixed(0)}%`);
  P(`panes per round, mean: before14 ${(bf.reduce((s, x) => s + x.panes.length, 0) / bf.length).toFixed(2)} | after ${(af.reduce((s, x) => s + x.panes.length, 0) / af.length).toFixed(2)}`);
  P(`rounds per day: before14 ${(bf.length / 14).toFixed(1)} | after ${(af.length / ((rows[rows.length - 1].at - C2) / 86400e3)).toFixed(1)}`);
}
console.log(out.join('\n'));
// ---- how well does E1 (chair retakes the chain) track the last hand-back? only possible where both exist (before 2026-09-28) ----
{
  const both = rounds.filter((x) => x.e1 !== null && x.e3 !== null);
  const d = both.map((x) => min(x.e1 - x.e3));
  console.log(`\n## E1 vs E3 on the ${both.length} rounds that have both: E1 - E3 ${fmt(d)}; E1 earlier than E3 in ${both.filter((x) => x.e1 < x.e3).length}; E1 within 2 min of E3 in ${both.filter((x) => Math.abs(x.e1 - x.e3) <= 120000).length}`);
  const lastLetter = Math.max(...Object.values(posts).map((a) => a[a.length - 1]));
  console.log(`last letter-attributed committee post on the board: ${new Date(lastLetter).toISOString()}; last handbacks-in row in lap.jsonl: ${new Date(Math.max(...rows.filter((r) => r.chain === 'handbacks-in').map((r) => r.at))).toISOString()}`);
}
