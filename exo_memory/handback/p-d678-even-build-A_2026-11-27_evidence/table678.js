// table678.js (pane A, D678 item 2): cand678.js's rows scored against the failing results registered in the hand-back's 4.1 BEFORE the run, as one markdown table.
//   node table678.js cand.out > table678.md
//   node table678.js cand.out --compact   (the same rows, one short cell per candidate, for the hand-back)
// Every candidate fails a row on: the run's width spread over 0.01 m; the margins' width off by more than 0.01 m; anything outside its own window changed; a joint
// step; a red in the window the start lacks. Each fails its own claim where it misses it by more than 0.01 m:
//   A0  the kept edge on the road before any grab (keptRoad, over the run)
//   A   the road before any grab where it read one at rest at both ends, else where it is now (keptNow, over the window). WHICH applied is not in cand.out; it is
//       INFERRED here: A's kept edge equal to B's (keptNow and keptRoad within 0.0001 m) is the "where it is now" branch (A then lays the edge as B does), else "road"
//   B   where it is now (keptNow over the window); with the middle kept, the middle's l and h over the run
//   C   on an UNTOUCHED road only (the start run untouched, WC0..WC4): the kept edge on that road (keptRoad); elsewhere C's claim registered no bar
// Middle-kept rows (the hill and the swerve): A0, A and C lay the middle as built (no claim scored); B is scored as above.
// Each cell: road = the kept edge's most from the road before any grab, over the run; now = its most from where it is now, over the window, and (run) over the
// run only, so the margins' miss (item 4, every candidate alike) is not read as the candidate's; moves = the largest move of either edge over the window.
'use strict';
const fs = require('fs');
const lines = fs.readFileSync(process.argv[2], 'utf8').split(/\r?\n/).filter((l) => l.startsWith('{"cand"'));
const rows = lines.map((l) => JSON.parse(l));
const BAR = 0.01, f2 = (x) => (x === undefined || x === null ? '-' : x < 0.01 && x > 0 ? x.toFixed(4) : x.toFixed(2));
const UNTOUCHED = (c) => /untouched/.test(c) || /^WC\d$/.test(c);
const key = (r) => `${r.case}|${r.fx}|${r.hold}`;
const groups = new Map(); for (const r of rows) { if (!groups.has(key(r))) groups.set(key(r), {}); groups.get(key(r))[r.cand] = r; }
const common = (r) => { const f = []; if (r.refused) return [`refused ${r.refused}`]; if (r.wRun > BAR) f.push('width spread'); if (r.wMar.m > BAR) f.push('margin width'); if (r.outside > 0) f.push(`outside ${r.outside}`); if (r.joints > 0) f.push(`joints ${r.joints}`); if (r.redsNew > 0) f.push(`reds ${r.redsNew}`); return f; };
function own(c, r, g) {
  if (r.refused) return { claim: '-', miss: null };
  if (r.hold === 'centre') { if (c !== 'B') return { claim: 'as built', miss: null }; return { claim: 'middle now', miss: Math.max(r.mid.l.m, r.mid.h.m) }; }
  if (c === 'A0') return { claim: 'road', miss: r.keptRoad.m };
  if (c === 'A') { const b = g.B, now = b && !b.refused && Math.abs(r.keptNow.m - b.keptNow.m) < 1e-4 && Math.abs(r.keptRoad.m - b.keptRoad.m) < 1e-4; return now ? { claim: 'now (inferred)', miss: r.keptNow.m } : { claim: 'road (inferred)', miss: r.keptRoad.m }; }
  if (c === 'B') return { claim: 'now', miss: r.keptNow.m };
  if (c === 'C') return UNTOUCHED(r.case) ? { claim: 'road (untouched)', miss: r.keptRoad.m } : { claim: 'no bar', miss: null };
  return { claim: '?', miss: null };
}
const C4 = ['A0', 'A', 'B', 'C'], tally = Object.fromEntries(C4.map((c) => [c, { scored: 0, failOwn: 0, worst: 0, worstAt: '', failCommon: 0, reasons: {} }]));
const out = [], compact = ['| case | road | kept | margins: width off (m, all) | A0 | A | B | C |', '|---|---|---|---|---|---|---|---|'];
out.push(`rows read: ${rows.length}; case x hold groups: ${groups.size}`, '');
out.push('| case | road | kept | width: run spread / margins off (all candidates) | A0 | A | B | C |', '|---|---|---|---|---|---|---|---|');
for (const g of groups.values()) {
  const any = g.A0 || g.A || g.B || g.C, cells = [];
  for (const c of C4) {
    const r = g[c]; if (!r) { cells.push('(not run)'); continue; }
    const o = own(c, r, g), cm = common(r), t = tally[c];
    if (o.miss !== null) { t.scored++; if (o.miss > BAR) { t.failOwn++; } if (o.miss > t.worst) { t.worst = o.miss; t.worstAt = `${r.case} (${r.fx}, ${r.hold})`; } }
    if (cm.length) { t.failCommon++; for (const x of cm) { const k = x.replace(/ \d+$/, ''); t.reasons[k] = (t.reasons[k] || 0) + 1; } }
    const fig = r.refused ? `refused ${r.refused}` : r.hold === 'centre' ? `mid l ${f2(r.mid.l.m)} h ${f2(r.mid.h.m)}` : `road ${f2(r.keptRoad.m)} · now ${f2(r.keptNow.m)} (run ${f2(r.keptNowRun.m)}) · moves ${f2(r.moveMax.m)}`;
    const verdict = o.miss === null ? '' : o.miss > BAR ? ` **✗ ${o.claim}**` : ` ✓ ${o.claim}`;
    cells.push(`${fig}${verdict}${cm.filter((x) => !/^margin width$/.test(x)).length ? ` (${cm.filter((x) => !/^margin width$/.test(x)).join(', ')})` : ''}`);
  }
  const w = any.refused ? '-' : `${f2(any.wRun)} / ${f2(any.wMar.m)} at ${any.wMar.at}`;
  out.push(`| ${any.case} | ${any.fx} | ${any.hold} | ${w} | ${cells.join(' | ')} |`);
  // the compact form (node table678.js cand.out --compact): per candidate "from the road before any grab · from where it is now, over the run", the registered
  // verdict, and any common bar other than the margins' width
  compact.push(`| ${any.case} | ${any.fx} | ${any.hold} | ${any.refused ? '-' : f2(any.wMar.m)} | ${C4.map((c) => { const r = g[c]; if (!r) return '-'; if (r.refused) return `refused`; const o = own(c, r, g), cm = common(r).filter((x) => !/^margin width$/.test(x)); const fig = r.hold === 'centre' ? `l ${f2(r.mid.l.m)} h ${f2(r.mid.h.m)}` : `${f2(r.keptRoad.m)} · ${f2(r.keptNowRun.m)}`; return `${fig}${o.miss === null ? '' : o.miss > BAR ? ' ✗' : ' ✓'}${cm.length ? ` (${cm.join(', ')})` : ''}`; }).join(' | ')} |`);
}
out.push('', '| candidate | rows scored on its own claim | of them missed by more than 0.01 m | worst miss (m), where | rows failing a common bar | the common bars failed (rows) |', '|---|---|---|---|---|---|');
for (const c of C4) { const t = tally[c]; out.push(`| ${c} | ${t.scored} | ${t.failOwn} | ${f2(t.worst)}, ${t.worstAt} | ${t.failCommon} | ${Object.entries(t.reasons).map(([k, v]) => `${k} ${v}`).join(', ')} |`); }

// ADDED AFTER THE RUN (22:2xZ), not registered: the registration scored A0's claim over the RUN and B's (and A's "now") over the WINDOW, so the margins' miss
// (item 4, every candidate alike) fails B and A on every row and never A0, which is mine. This tally scores every claim over the run only, the same span for all.
const run = Object.fromEntries(C4.map((c) => [c, { scored: 0, fail: 0, worst: 0, worstAt: '' }]));
for (const g of groups.values()) for (const c of C4) {
  const r = g[c]; if (!r || r.refused || r.hold === 'centre') continue;
  const o = own(c, r, g); if (o.miss === null) continue;
  const m = /now/.test(o.claim) ? r.keptNowRun.m : o.miss, t = run[c];
  t.scored++; if (m > BAR) t.fail++; if (m > t.worst) { t.worst = m; t.worstAt = `${r.case} (${r.fx}, ${r.hold})`; }
}
out.push('', 'The same claims scored over the run only (added after the run; see the script):', '', '| candidate | rows scored | missed by more than 0.01 m over the run | worst miss (m), where |', '|---|---|---|---|');
for (const c of C4) { const t = run[c]; out.push(`| ${c} | ${t.scored} | ${t.fail} | ${f2(t.worst)}, ${t.worstAt} |`); }

// Where the kept edge is itself uneven (over 0.5 m: below that, B's ripK is B's own miss, e.g. 0.10 on the untouched start): B keeps it where it is, so B's ripK (the kept edge after, less the untouched road's, max - min over the run) is how uneven
// it was given (INFERRED from B's claim, within B's own miss). Each candidate's ripK / ripO on those rows: how uneven it leaves the kept edge and the other one.
out.push('', 'Where the kept edge is given uneven (B\'s ripK over 0.5 m: a grab, a stroke or a row of grabs on it): how uneven each candidate leaves the kept edge / the other edge, over the run (m):', '', '| case | road | kept | A0 | A | B | C |', '|---|---|---|---|---|---|---|');
for (const g of groups.values()) {
  const b = g.B; if (!b || b.refused || b.hold === 'centre' || !(b.ripK > 0.5)) continue;
  out.push(`| ${b.case} | ${b.fx} | ${b.hold} | ${C4.map((c) => (g[c] && !g[c].refused ? `${f2(g[c].ripK)} / ${f2(g[c].ripO)}` : '-')).join(' | ')} |`);
}
console.log(process.argv.includes('--compact') ? compact.join('\n') : out.join('\n'));
