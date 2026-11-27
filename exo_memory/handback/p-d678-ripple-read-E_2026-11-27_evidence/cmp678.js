// cmp678.js (pane E, D678): d678.js's rows on both trees, joined by (case, caller): before (e112a14) and after (c2591bf). Prints the table and the counts the
// hand-back quotes, so every figure in it re-derives from one run. usage: node cmp678.js <before.json> <after.json>
'use strict';
const [B, A] = process.argv.slice(2).map((f) => require(require('path').resolve(f)));
const key = (r) => `${r.case} | ${r.caller}`, mapB = new Map(B.rows.map((r) => [key(r), r]));
const held = (r) => !r.refused && r.head && r.head.m !== 0;
const mm = (x) => (1000 * x).toFixed(1);
const lines = [], count = {};
const bump = (k, n = 1) => { count[k] = (count[k] || 0) + n; };
for (const a of A.rows) {
  const b = mapB.get(key(a));
  if (!b) { lines.push(`${key(a)}: NOT IN BEFORE`); bump('unmatched'); continue; }
  if (a.refused || b.refused) { lines.push(`${key(a)}: before ${b.refused ? `REFUSED ${b.refused.slice(0, 70)}` : 'laid'}; after ${a.refused ? `REFUSED ${a.refused.slice(0, 70)}` : 'laid'}`); bump(a.refused && b.refused ? 'refused both' : 'refused one'); continue; }
  const caller = a.caller.split(' ')[0];
  bump(`laid ${caller}`);
  if (!held(a)) { bump('level head rows'); bump(a.piece === b.piece ? 'level head: bytes same' : 'level head: bytes DIFFER'); lines.push(`${key(a)}: level head, bytes ${a.piece === b.piece ? 'same' : 'DIFFER'}`); continue; }
  bump('held rows'); bump(`held ${caller}`);
  if (a.joint !== null) bump('after joint problem'); if (b.joint !== null) bump('before joint problem');
  if (!(a.end.v === a.head.v && a.end.m === 0)) bump('after end not head level');
  if (!a.placedSame) bump('after placed moved');
  if (a.over1mmUntil > 20) bump(`after over 1 mm past 20 m (${caller})`);
  if (Math.sign(a.swing) !== Math.sign(a.head.m) || a.swing === 0) bump('after swing not the head way');
  if (a.over1mmUntil > 0.75 * 20 + 1e-9 && caller !== 'sharp') bump('after over 1 mm past 15 m');
  lines.push(`${key(a)}: slope ${a.head.m.toExponential(2)} | swing ${mm(b.swing)} -> ${mm(a.swing)} mm at ${b.swingAt} -> ${a.swingAt} (x ${b.factor} -> ${a.factor}) | >1 mm until ${b.over1mmUntil} -> ${a.over1mmUntil} | >1e-9 until ${b.over1e9Until} -> ${a.over1e9Until} | |w''| ${b.w2B} -> ${a.w2B} (fine ${a.w2fine} at ${a.w2fineAt}), brushed piece's own ${a.brushedOwnW2B}, ratio ${(b.w2B / b.brushedOwnW2B).toFixed(2)} -> ${(a.w2B / a.brushedOwnW2B).toFixed(2)} | joint ${a.joint === null ? 'ok' : a.joint} | end ${a.end.v === a.head.v && a.end.m === 0 ? 'head, level' : JSON.stringify(a.end)} | placed ${a.placedSame ? 'same' : 'MOVED'} | first knots ${a.firstKnots.slice(0, 5).join(',')}`);
}
// per caller: the range of the factor, the settle and the bend ratio over the held rows
const by = {};
for (const a of A.rows) { if (!held(a)) continue; const b = mapB.get(key(a)); if (!b || b.refused) continue; const c = a.caller; (by[c] = by[c] || []).push({ a, b }); }
const rng = (xs) => `${Math.min(...xs).toPrecision(3)} to ${Math.max(...xs).toPrecision(3)}`;
const summary = Object.entries(by).map(([c, xs]) => `${c}: ${xs.length} held | factor ${rng(xs.map((x) => x.a.factor))} (before ${rng(xs.map((x) => x.b.factor))}) | swing at ${rng(xs.map((x) => x.a.swingAt))} m | >1 mm until ${rng(xs.map((x) => x.a.over1mmUntil))} (before ${rng(xs.map((x) => x.b.over1mmUntil))}) | >1e-9 until ${rng(xs.map((x) => x.a.over1e9Until))} | |w''| ${rng(xs.map((x) => x.a.w2B))} (before ${rng(xs.map((x) => x.b.w2B))}) | ratio to brushed ${rng(xs.map((x) => x.a.w2B / x.a.brushedOwnW2B))} (before ${rng(xs.map((x) => x.b.w2B / x.b.brushedOwnW2B))}) | largest swing ${rng(xs.map((x) => Math.abs(1000 * x.a.swing)))} mm`);
// the held piece the same across callers that lay it by extend (w channel): compare each caller's w to Extend's from the same head
const sameAsExtend = {};
for (const a of A.rows) { if (!held(a) || a.caller === 'extend') continue; const e = A.rows.find((r) => r.case === a.case && r.caller === 'extend'); if (!e || e.refused) continue; const same = a.swing === e.swing && a.over1mmUntil === e.over1mmUntil && a.w2B === e.w2B; const c = a.caller; sameAsExtend[c] = sameAsExtend[c] || { same: 0, differ: 0 }; sameAsExtend[c][same ? 'same' : 'differ']++; }
console.log(lines.join('\n')); console.log('\n== per caller (after; before in brackets)\n' + summary.join('\n'));
console.log('\n== the held width as Extend lays it from the same head (swing, settle, bend identical)\n' + JSON.stringify(sameAsExtend));
console.log('\n== counts\n' + JSON.stringify(count, null, 1));
console.log('\n== Finish');
for (const t of [['before', B], ['after', A]]) for (const f of t[1].finish) console.log(`${t[0]} ${f.head}: ${f.refused ? `REFUSED ${f.refused}` : `closed ${f.closed}, ${f.plan}, placed ${f.placedSame ? 'same' : 'MOVED'}; pieces ${f.pieces.map((p) => `${p.length} m ${p.w0}->${p.w1} |w''| ${p.w2B}`).join(' ; ')} | first: slope ${f.first.head.m.toExponential(2)}, swing ${mm(f.first.swing)} mm at ${f.first.swingAt} (x ${f.first.factor}), >1 mm until ${f.first.over1mmUntil}, >1e-9 ${f.first.over1e9Until}, |w''| ${f.first.w2B} (own ${f.first.brushedOwnW2B}), joint ${f.first.joint === null ? 'ok' : f.first.joint}, knots ${f.first.firstKnots.slice(0, 5).join(',')}`}`);
console.log('\n== right width (after)'); for (const r of A.rightWidth) console.log(`${r.path} on ${r.ch}: ${r.threw ? `THREW ${r.threw}` : (r.msg || '').slice(0, 110)} | head w ${r.headW.v} (${r.headW.m}) wd ${JSON.stringify(r.headWd)}`);
console.log('\n== right width (before)'); for (const r of B.rightWidth) console.log(`${r.path} on ${r.ch}: ${r.threw ? `THREW ${r.threw}` : (r.msg || '').slice(0, 110)}`);
