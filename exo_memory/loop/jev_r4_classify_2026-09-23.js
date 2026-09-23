#!/usr/bin/env node
// jev_r4_classify_2026-09-23.js — L109 (pane A). READ-ONLY. What the "user" in each L2 view actually is, by its opening
// text (a PREFIX HEURISTIC, not a reading of every row), plus the user-message cap savings in jev_r4_cost_input §5.
//   node exo_memory/loop/jev_r4_classify_2026-09-23.js
'use strict';
const fs = require('fs');
const path = require('path');
const d = path.join(process.env.LOCALAPPDATA || '', 'consonance', 'jev-shadow');
const rows = fs.readFileSync(path.join(d, 'jev_judge.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)).filter((r) => r.level === 'l2' && r.status === 'ok');
const caps = new Map();
for (const f of fs.readdirSync(path.join(d, 'judge-captures'))) { try { const c = JSON.parse(fs.readFileSync(path.join(d, 'judge-captures', f), 'utf8')); caps.set(`${c.session_id}|${c.turn_uuid}`, c); } catch {} }
const B = (s) => Buffer.byteLength(s, 'utf8');
const kind = (u) => /keep-warm|Reply with exactly: ok/.test(u) ? 'keep-warm ping'
  : /^\s*(<pasted_content|\[chair:|\[librarian:|\[pane:|CHECK-IN)/.test(u) ? 'machine packet (chair/librarian/pane)'
  : /^\s*\(no user context/.test(u) ? 'no user context' : 'other (a person, or tool text)';
const out = {};
let cap1k = 0, cap2k = 0, n = 0, missing = 0;
for (const r of rows) {
  const c = caps.get(`${r.session_id}|${r.turn_uuid}`);
  if (!c || !c.l2) { missing++; continue; }
  const p = c.l2.prompt, a = 'Most recent user message:\n';
  const u = p.slice(p.indexOf(a) + a.length, p.indexOf('\n\nAssistant move to judge:\n'));
  const k = kind(u);
  const o = out[k] || (out[k] = { calls: 0, inputTokens: 0, verdicts: {} });
  o.calls++; o.inputTokens += r.usage.inputTokens;
  const v = r.jev.verdict.choice; o.verdicts[v] = (o.verdicts[v] || 0) + 1;
  cap1k += Math.max(0, B(u) - 1000); cap2k += Math.max(0, B(u) - 2000); n++;
}
console.log(JSON.stringify({ rows: n, missing, byKind: out, userCapSavesMeanBytes: { at1000: Math.round(cap1k / n), at2000: Math.round(cap2k / n) } }, null, 1));
