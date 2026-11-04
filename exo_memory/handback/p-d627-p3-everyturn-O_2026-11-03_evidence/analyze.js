// analyze.js (D627 part 3, O): READ ONLY, over scan.js's prompts.jsonl. Counts each every-turn item's FIRES, and the turns in which the seat's own
// output (its text, its commands, its rings) names the thing the item names: a CANDIDATE change, written out whole to candidates.jsonl for reading.
// node analyze.js <prompts.jsonl> <out dir>
'use strict';
const fs = require('fs');
const [, , IN, OUT] = process.argv;
const R = fs.readFileSync(IN, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const P = R.filter((r) => r.kind !== 'state-block'), SB = R.filter((r) => r.kind === 'state-block');
const did = (r) => [r.text, ...(r.cmds || []), ...(r.rings || []).map((x) => x.text)].join('\n');
const typeOf = (it) => /^STALE /.test(it) ? 'STALE' : /^chain:/.test(it) ? 'chain' : /^dirty /.test(it) ? 'dirty' : /^\d+[smh]$|^\d+m$/.test(it) ? 'age' : /^\+\d+ more open/.test(it) ? 'more-open'
  : /unwitnessed/.test(it) ? 'unwitnessed' : /older beyond/.test(it) ? 'older' : /^QUEUED/.test(it) ? 'QUEUED' : /^HANDBACKS IN/.test(it) ? 'HANDBACKS-IN' : /^handbacks /.test(it) ? 'handbacks-owed'
  : /delivery-unconfirmed/.test(it) ? 'unconfirmed' : /^NOT in sync/.test(it) ? 'not-in-sync' : /^rows only/.test(it) ? 'rows-only' : /^UNRECEIVED/.test(it) ? 'UNRECEIVED' : /board line\(s\) fused/.test(it) ? 'fused' : /^holder /.test(it) ? 'holder' : /^L behind/.test(it) ? 'L-behind' : /^\[pulse\]/.test(it) ? 'header' : 'other:' + it.slice(0, 30);
// what counts as the seat's own output naming the item (a candidate, to be READ, not a verdict)
const NAMES = {
  STALE: (it, t) => { const lap = (it.match(/STALE (\S+)/) || [])[1]; return lap && new RegExp('\\b' + lap + '\\b').test(t) && /stale/i.test(t); },
  'handbacks-owed': (it, t) => /owing|owed|owe /i.test(t),
  'HANDBACKS-IN': (it, t) => /not collated|collate/i.test(t),
  QUEUED: (it, t) => /queued/i.test(t),
  unconfirmed: (it, t) => /unconfirmed/i.test(t),
  'not-in-sync': (it, t) => /in sync|state-sync|L behind|79e3c01/i.test(t),
  dirty: (it, t) => /\bdirty\b/i.test(t) && /repo-wide|hand-backs uncommitted/i.test(t),
  unwitnessed: (it, t) => /unwitnessed/i.test(t),
  older: (it, t) => /older beyond|10-lap window/i.test(t),
  'more-open': (it, t) => /more open/i.test(t),
  chain: (it, t) => /\bchain:|holder (panes|chair|librarian)/i.test(t),
  'rows-only': (it, t) => /rows only/i.test(t),
  UNRECEIVED: (it, t) => /unreceived/i.test(t),
  fused: (it, t) => /fused/i.test(t),
  'L-behind': (it, t) => /L behind|9486b30/i.test(t),
};
const fires = {}, named = {}, cands = [];
for (const r of P) {
  if (!r.pulse) continue; const t = did(r);
  for (const it of r.pulse) { const k = typeOf(it); fires[k] = (fires[k] || 0) + 1; const f = NAMES[k]; if (f && f(it, t)) { named[k] = (named[k] || 0) + 1; cands.push({ item: k, seat: r.seat, ts: r.ts, kind: r.kind, pulseItem: it, head: r.head, text: r.text.slice(0, 900), rings: (r.rings || []).map((x) => x.text.slice(0, 300)) }); } }
}
// STALE: which laps, how long, how many prompts
const stale = {}; for (const r of P) for (const it of r.pulse || []) { const m = /^STALE (\S+) (\d+)h/.exec(it); if (m) { const s = (stale[m[1]] = stale[m[1]] || { fires: 0, first: r.ts, last: r.ts, maxH: 0, seats: {} }); s.fires++; s.last = r.ts; s.maxH = Math.max(s.maxH, +m[2]); s.seats[r.seat] = (s.seats[r.seat] || 0) + 1; } }
// owed: a seat named in "owing" in its OWN pulse — did that turn ring the librarian? and the episode latency (first owed fire to the ring)
const owed = { fires: 0, ownFires: 0, ownTurnRang: 0, episodes: [] }; const open = {};
for (const r of [...P].sort((a, b) => Date.parse(a.ts) - Date.parse(b.ts))) {
  const it = (r.pulse || []).find((x) => /^handbacks .*owing/.test(x)); const owing = it ? (it.match(/owing ([A-Z,]+)/) || [])[1].split(',') : [];
  if (it) owed.fires++;
  const rang = (r.rings || []).some((x) => x.tool === 'call_librarian');
  if (owing.includes(r.seat)) { owed.ownFires++; if (rang) owed.ownTurnRang++; if (!open[r.seat]) open[r.seat] = { seat: r.seat, firstOwed: r.ts, prompts: 0, kinds: {} }; open[r.seat].prompts++; open[r.seat].kinds[r.kind] = (open[r.seat].kinds[r.kind] || 0) + 1; }
  if (open[r.seat] && (rang || !owing.includes(r.seat))) { const e = open[r.seat]; e.closedAt = r.ts; e.closedBy = rang ? 'ring in that turn' : 'no longer owed'; e.minutes = Math.round((Date.parse(r.ts) - Date.parse(e.firstOwed)) / 6e4); owed.episodes.push(e); delete open[r.seat]; }
}
owed.stillOpen = Object.values(open);
// HANDBACKS IN, NOT COLLATED: on whose pulse, and did the librarian collate (call_chair) in that turn; and the longest runs
const hin = { fires: 0, bySeat: {}, mTurns: 0, mCollatedSameTurn: 0, runs: [] }; let run = null;
for (const r of [...P].sort((a, b) => Date.parse(a.ts) - Date.parse(b.ts))) {
  const it = (r.pulse || []).find((x) => /^HANDBACKS IN/.test(x));
  if (it) { hin.fires++; hin.bySeat[r.seat] = (hin.bySeat[r.seat] || 0) + 1; if (r.seat === 'M') { hin.mTurns++; if ((r.rings || []).some((x) => x.tool === 'call_chair')) hin.mCollatedSameTurn++; } const ago = (it.match(/last (\S+ ago)/) || [])[1]; if (!run) run = { start: r.ts, firstItem: it, n: 0, seats: {} }; run.n++; run.end = r.ts; run.lastItem = it; run.seats[r.seat] = (run.seats[r.seat] || 0) + 1; }
  else if (run && r.pulse) { run.minutes = Math.round((Date.parse(run.end) - Date.parse(run.start)) / 6e4); hin.runs.push(run); run = null; }
}
hin.runs.sort((a, b) => b.minutes - a.minutes); hin.runs = hin.runs.slice(0, 8);
// keep-warm: replies
const kw = P.filter((r) => r.kind === 'keep-warm'), kwOk = kw.filter((r) => /^ok\.?$/i.test(r.text.trim())), kwOther = kw.filter((r) => !/^ok\.?$/i.test(r.text.trim()));
// trailer note: received, and turns whose output names the trailer
const tn = P.filter((r) => r.trailerNote), tnNamed = tn.filter((r) => /trailer|when <condition>|when clause|`when`/i.test(did(r)));
// pulse bytes
const pc = P.filter((r) => r.pulseChars).map((r) => r.pulseChars); const mean = (a) => Math.round(a.reduce((s, x) => s + x, 0) / a.length);
const bySeat = {}; for (const r of P) { if (!r.pulseChars) continue; (bySeat[r.seat] = bySeat[r.seat] || []).push(r.pulseChars); }
// board tool use
const board = {}; for (const r of P) for (const t of r.tools || []) if (/read_board|post_board/.test(t)) { const k = r.seat + ' ' + t.replace('mcp__consonance__', ''); board[k] = (board[k] || 0) + 1; }
const gateRes = P.filter((r) => r.gateResults).map((r) => ({ seat: r.seat, ts: r.ts, g: r.gateResults }));
const res = {
  prompts: P.length, withPulse: P.filter((r) => r.pulse).length, from: P.map((r) => r.ts).sort()[0], to: P.map((r) => r.ts).sort().slice(-1)[0],
  pulseItemFires: fires, pulseItemNamedInSameTurn: named, stale,
  owed: { ...owed, episodes: owed.episodes.sort((a, b) => b.minutes - a.minutes).slice(0, 12), nEpisodes: owed.episodes.length },
  handbacksIn: hin,
  keepWarm: { n: kw.length, ok: kwOk.length, other: kwOther.length, otherReplies: kwOther.map((r) => ({ seat: r.seat, ts: r.ts, text: r.text.trim().slice(0, 300) })) },
  trailerNote: { received: tn.length, bySeat: tn.reduce((o, r) => ((o[r.seat] = (o[r.seat] || 0) + 1), o), {}), turnsNamingTrailer: tnNamed.map((r) => ({ seat: r.seat, ts: r.ts, text: did(r).match(/.{0,200}(trailer|when <condition>|when clause).{0,200}/is)?.[0] })) },
  stateBlocks: { n: SB.length, meanChars: SB.length ? mean(SB.map((r) => r.chars)) : 0, bySeat: SB.reduce((o, r) => ((o[r.seat] = (o[r.seat] || 0) + 1), o), {}), turnsNamingIt: P.filter((r) => /state.block/i.test(did(r))).map((r) => ({ seat: r.seat, ts: r.ts })) },
  pulseChars: { meanPerPrompt: mean(pc), bySeat: Object.fromEntries(Object.entries(bySeat).map(([k, v]) => [k, { n: v.length, mean: mean(v) }])) },
  boardTools: board, gateResultsInTurn: gateRes.slice(0, 30), nGateResults: gateRes.length,
};
fs.writeFileSync(OUT + '/analysis.json', JSON.stringify(res, null, 1));
fs.writeFileSync(OUT + '/candidates.jsonl', cands.map((c) => JSON.stringify(c)).join('\n') + '\n');
console.log(JSON.stringify({ fires, named, kw: res.keepWarm.n, kwOther: res.keepWarm.other, tn: tn.length, tnNamed: tnNamed.length, sb: SB.length, owedEpisodes: owed.episodes.length, gate: gateRes.length }, null, 0));
