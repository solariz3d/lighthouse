#!/usr/bin/env node
'use strict';
// origin-in-context.js (seat A, D311 cut-position diagnostic): for each dev unit, was the event the claim came from (the origin event of my D307 table) inside the context the
// bench replays, and was its text whole? It runs the bench's own buildContext over the unit's events with each event's text tagged by its line number, and reads the tags back.
// No model call. The bench is not modified.  node origin-in-context.js   (prints JSON)
const fs = require('fs');
const os = require('os');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const B = require(path.join(ROOT, 'consonance', 'tools', 'mistake-bench.js'));
const R = require(path.join(ROOT, 'consonance', 'tools', 'claim-replay.js'));
const PROJ = process.env.PROJECTS || path.join(os.homedir(), '.claude', 'projects');
const table = fs.readFileSync(path.join(__dirname, '..', '..', 'p-originread-A_2026-10-12_evidence', 'table.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const machine = JSON.parse(fs.readFileSync(path.join(__dirname, 'machine.json'), 'utf8'));
const MARK = (n) => `§${n}§`;

function analyse(u) {
  const file = path.join(PROJ, u.transcript);
  const ev = B.readEvents(file, u.claimMs + 1500);
  const tagged = ev.map((e) => ({ ...e, text: MARK(e.n) + String(e.text) }));
  const ctx = B.buildContext(tagged, u);
  const lines = [ctx.summary || '', ...ctx.history, ...ctx.turn];
  const inCtx = new Map();   // line n -> the rendered strings that carry its tag
  for (const s of lines) for (const m of String(s).matchAll(/§(\d+)§/g)) { const n = Number(m[1]); if (!inCtx.has(n)) inCtx.set(n, []); inCtx.get(n).push(s); }
  const row = table.find((r) => r.id === u.id);
  const where = String(row.earliest.where), quote = String(row.earliest.quote || '');
  const nums = [...where.matchAll(/\b(\d{3,6})\b/g)].map((m) => Number(m[1])).filter((n) => ev.some((e) => e.n === n));
  const cutN = ctx.stop.n;
  const outs = [];
  for (const n of [...new Set(nums)].slice(0, 3)) {
    const evs = ev.filter((e) => e.n === n);
    const first = evs[0];
    const rendered = inCtx.get(n);
    let status, detail = '';
    if (n >= cutN) status = 'at or after the cut (not replayed as history)';
    else if (rendered) {
      const orig = R.clean(first.text), q = quote.replace(/\s+/g, ' ').slice(0, 30);
      const flat = orig.replace(/\s+/g, ' ');
      const off = q ? flat.toLowerCase().indexOf(q.toLowerCase()) : -1;
      const m = /…\[\+(\d+) chars cut\]/.exec(rendered.join('\n'));
      const kept = m ? Math.max(0, orig.length - Number(m[1])) : orig.length;
      status = m ? 'in the replay, CUT' : 'in the replay, whole';
      detail = `original ${orig.length} chars, kept about ${kept}` + (off >= 0 ? `; the quoted words start at offset ${off} -> ${off <= kept ? 'inside the kept part' : 'in the cut-off part'}` : '; quote not matched in the event text');
    } else if (ctx.summary && first.ts < (ctx.stats.compactionAt || '')) status = 'before the compaction (only the summary carries it)';
    else status = `not in the replay (older history dropped: ${ctx.stats.historyDropped} of ${ctx.stats.historyEvents} events cut from the front)`;
    outs.push({ n, kind: first.kind, ts: first.ts, status, detail });
  }
  return { id: u.id, originClass: row.class, originWhere: where.slice(0, 200), compactionAt: ctx.stats.compactionAt, historyEvents: ctx.stats.historyEvents, historyDropped: ctx.stats.historyDropped, cutN, candidates: outs };
}

const units = B.loadUnits().filter((u) => u.claimMs);
const result = units.map(analyse);
fs.writeFileSync(path.join(__dirname, 'origin-in-context.json'), JSON.stringify(result, null, 1) + '\n');
for (const r of result) {
  console.log(`${r.id} [${r.originClass}] compaction ${r.compactionAt ? r.compactionAt.slice(0, 16) : 'none'}, history ${r.historyEvents - r.historyDropped} of ${r.historyEvents} kept`);
  for (const c of r.candidates) console.log(`    event ${c.n} ${c.kind} ${c.ts ? c.ts.slice(11, 19) : ''}: ${c.status}${c.detail ? ' (' + c.detail + ')' : ''}`);
  if (!r.candidates.length) console.log('    (no event number in the origin text: ' + r.originWhere.slice(0, 120) + ')');
}
