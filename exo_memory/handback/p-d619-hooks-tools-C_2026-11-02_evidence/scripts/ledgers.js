// ledgers.js: per hook ledger, rows, first and last time, and the rows that are a CATCH (a refusal, block, warning or flag: the hook changed or
// questioned an outcome) by that ledger's own fields, with the last catch's time and a short label of what it was. Counts and field values only.
'use strict';
const fs = require('fs');
const D = 'C:/Consonance/data/', SH = 'C:/Users/nname/.claude/shell/';
const iso = (o) => { const v = o.ts || o.t || o.at || o.time || o.ferried_at; if (typeof v === 'number') return new Date(v).toISOString(); return v ? String(v) : ''; };
const L = [
  ['push-gate', D + 'push-gate.jsonl', (o) => o.decision && o.decision !== 'allow', (o) => `${o.decision}: ${(o.reason || o.why || JSON.stringify(o.hits || o.found || '')).toString().slice(0, 90)}`],
  ['delete-gate', D + 'delete-gate.jsonl', (o) => o.decision && o.decision !== 'allow', (o) => `${o.decision}: ${(o.reason || '').toString().slice(0, 60)} ${JSON.stringify((o.checked || []).map((c) => [c.how, c.missing, c.unfinished, c.links])).slice(0, 80)}`],
  ['sources-gate', D + 'sources-gate.jsonl', (o) => o.decision && !/^(allow|pass|ok)$/.test(o.decision), (o) => `${o.decision} ${o.kind || ''} ${o.mode || ''}`],
  ['second-reader', D + 'second-reader.jsonl', (o) => Array.isArray(o.flags) && o.flags.length > 0, (o) => `${o.status} ${o.flags.length} flag(s)`],
  ['reply-slot', D + 'reply-slot.jsonl', (o) => o.blocked || o.wouldBlock, (o) => `${o.blocked ? 'BLOCKED' : 'wouldBlock'} ${o.kind || ''} shadow=${o.shadow}`],
  ['ask-ending', D + 'ask-ending.jsonl', (o) => o.matched === true, (o) => `matched mode=${o.mode} ${o.promptKind || ''}`],
  ['release-chime', D + 'release-chime.jsonl', (o) => o.decision && !/debounced|skip/.test(o.decision), (o) => `${o.decision} ${o.kind || ''} ${o.repo || ''}`],
  ['sourced-stop', D + 'sourced_ledger.jsonl', (o) => o.sourced === false, (o) => `unsourced: ${(o.values || []).length} value(s), ${(o.claims || []).length} claim(s)`],
  ['findings-return', D + 'return_ledger.jsonl', (o) => (o.surfaced || []).length > 0, (o) => `surfaced ${(o.surfaced || []).length}, misses ${(o.misses || []).length}`],
  ['second-vantage findings', D + 'vantage_findings.jsonl', () => true, (o) => `${o.kind || o.type || ''} ${(o.finding || o.text || o.claim || '').toString().slice(0, 70)}`],
  ['precompact-preserve', D + 'precompact.jsonl', (o) => /fail|error/i.test(o.event || ''), (o) => `${o.event}`],
  ['sessionstart-state', D + 'sessionstart-state.jsonl', (o) => o.failed === true, (o) => `${o.event} failed`],
  ['carrier-drift-watch', D + 'carrier-drift.jsonl', (o) => o.verdict && o.verdict !== 'GREEN', (o) => `${o.verdict} findings ${o.findings} spoke=${o.spoke}`],
  ['dispatch-gate', D + 'dispatch-gate.jsonl', (o) => o.outcome && o.outcome !== 'allowed', (o) => `${o.outcome} ${o.verb || ''} ${(o.reason || '').toString().slice(0, 60)}`],
  ['ferry-watch', D + 'ferry.jsonl', () => true, (o) => `ferried ${o.sha} to ${(o.panes || []).join(',')}`],
  ['janitor (tool)', D + 'janitor.jsonl', (o) => o.apply && o.freed_gb > 0, (o) => `freed ${o.freed_gb} GB, strays ${o.strays}`],
  ['lap gates', D + 'lap.jsonl', (o) => o.gate != null, (o) => `${o.lap} ${o.stage} gate=${JSON.stringify(o.gate).slice(0, 80)}`],
  ['l2-overseer', SH + 'l2_overseer.jsonl', (o) => /flag|drift|warn|fail/i.test(JSON.stringify(o.verdict || o.result || o.kind || '')), (o) => `${JSON.stringify(o.verdict || o.result || o.kind || '').slice(0, 80)}`],
  ['l3-overseer', SH + 'l3_overseer.jsonl', (o) => /flag|drift|warn|spiral|fail/i.test(JSON.stringify(o.verdict || o.result || o.kind || o.pattern || '')), (o) => `${JSON.stringify(o.verdict || o.result || o.kind || o.pattern || '').slice(0, 80)}`],
  ['shell event_log (session-start/stop/end/userprompt)', SH + 'event_log.jsonl', (o) => /error|fail/i.test(String(o.event || o.kind || '')), (o) => `${o.event || o.kind}`],
];
for (const [name, f, catchP, label] of L) {
  if (!fs.existsSync(f)) { console.log(`${name}: ledger ${f} ABSENT`); continue; }
  const rows = fs.readFileSync(f, 'utf8').split(/\r?\n/).filter(Boolean); let first = '', last = '', n = 0, c = 0, lastC = '', lastCL = ''; const kinds = new Map();
  for (const l of rows) { let o; try { o = JSON.parse(l); } catch (e) { continue; } n++; const t = iso(o); if (!first || t < first) first = t; if (t > last) last = t;
    let hit = false; try { hit = !!catchP(o); } catch (e) {} if (hit) { c++; const lb = label(o); const k = lb.replace(/[0-9a-f]{8,}|\d+(\.\d+)?/g, '#').slice(0, 60); kinds.set(k, (kinds.get(k) || 0) + 1); if (t >= lastC) { lastC = t; lastCL = lb; } } }
  console.log(`${name}: rows ${n}, ${first.slice(0, 16)} .. ${last.slice(0, 16)}; catches ${c}; last catch ${lastC.slice(0, 16)} ${lastCL.slice(0, 120)}`);
  for (const [k, v] of [...kinds].sort((a, b) => b[1] - a[1]).slice(0, 5)) console.log(`     ${v} x ${k}`);
}
