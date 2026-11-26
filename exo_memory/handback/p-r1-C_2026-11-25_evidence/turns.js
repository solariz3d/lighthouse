'use strict';
// turns.js: the last N flagged sentences of the librarian seat's second-reader rows, each with the tool calls of the turn that rang (from the transcript)
const fs = require('fs'), path = require('path');
const N = +process.argv[2] || 20, SEAT = '0c0c0c0b-0000-4000-8000-00000000115b';
const rows = fs.readFileSync('C:/Consonance/data/second-reader.jsonl', 'utf8').trim().split('\n').map((l) => { try { return JSON.parse(l); } catch (e) { return null; } })
  .filter((r) => r && r.seat === SEAT && r.status === 'ok' && Array.isArray(r.flags) && r.flags.length);
const flags = []; for (let i = rows.length - 1; i >= 0 && flags.length < N; i--) { const r = rows[i]; for (let j = r.flags.length - 1; j >= 0 && flags.length < N; j--) flags.push({ r, f: r.flags[j], j }); }
const FP = 'C:/Users/nname/.claude/projects/C--Consonance-instances-librarian/' + SEAT + '.jsonl', SZ = fs.statSync(FP).size, TAIL = Math.min(SZ, 300e6), fd = fs.openSync(FP, 'r'), buf = Buffer.alloc(TAIL); fs.readSync(fd, buf, 0, TAIL, SZ - TAIL);
const T = buf.toString('utf8').split('\n').slice(1).filter(Boolean).map((l) => { try { return JSON.parse(l); } catch (e) { return null; } }).filter(Boolean);
const isPrompt = (e) => e.type === 'user' && e.message && (typeof e.message.content === 'string' || (Array.isArray(e.message.content) && e.message.content.some((c) => c.type === 'text') && !e.message.content.some((c) => c.type === 'tool_result'))) && !e.isMeta && !e.isCompactSummary;
const turnOf = {};
for (const { r } of flags) {
  if (turnOf[r.toolUseId]) continue;
  const k = T.findIndex((e) => e.type === 'assistant' && Array.isArray(e.message.content) && e.message.content.some((c) => c.type === 'tool_use' && c.id === r.toolUseId));
  if (k < 0) { turnOf[r.toolUseId] = null; continue; }
  let s = k; while (s > 0 && !isPrompt(T[s])) s--;
  const calls = [], results = {};
  for (let i = s; i <= k; i++) { const e = T[i]; if (!Array.isArray(e.message && e.message.content)) continue;
    for (const c of e.message.content) { if (c.type === 'tool_use') calls.push({ id: c.id, name: c.name, input: JSON.stringify(c.input) });
      if (c.type === 'tool_result') { const t = typeof c.content === 'string' ? c.content : (c.content || []).map((x) => x.text || '').join(' '); results[c.tool_use_id] = t; } } }
  const prompt = typeof T[s].message.content === 'string' ? T[s].message.content : T[s].message.content.filter((c) => c.type === 'text').map((c) => c.text).join(' ');
  turnOf[r.toolUseId] = { start: T[s].timestamp, prompt: prompt.slice(0, 300), calls: calls.map((c) => ({ ...c, out: (results[c.id] || '').length })), results };
}
let n = 0;
for (const { r, f } of flags) {
  n++; const t = turnOf[r.toolUseId];
  console.log(`\n=== #${n} ring ${r.ts} ${r.toolUseId}\nQUOTE: ${f.quote}\nNAMES: ${f.names}`);
  if (!t) { console.log('  (turn not found in transcript)'); continue; }
  console.log(`  turn from ${t.start}; prompt: ${t.prompt.replace(/\s+/g, ' ').slice(0, 200)}`);
  for (const c of t.calls) console.log(`  - ${c.name} ${c.input.slice(0, 400)} [out ${c.out} ch]`);
}
fs.writeFileSync('turn_results.json', JSON.stringify(turnOf));
