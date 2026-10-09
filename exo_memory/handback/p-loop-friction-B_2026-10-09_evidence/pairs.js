// pairs.js (pane B, D276 item 5): for every sources-gate DENY since 2026-10-08, the refused ring text and the accepted re-send, from the SENDER's
// transcript (refused rings never reach the board). Prints, per pair, whether the CONTENT changed once the gate's own lines are stripped.
'use strict';
const fs = require('fs'), path = require('path'), readline = require('readline');
const DATA = 'C:/Consonance/data', PROJ = 'C:/Users/nname/.claude/projects';
const T0 = '2026-10-08';
const SEATS = {
  '0c0c0c0b': 'C--Consonance-instances-librarian/0c0c0c0b-0000-4000-8000-00000000115b.jsonl',
  '0c0c0c0a': 'C--Consonance-instances-main/0c0c0c0a-0000-4000-8000-000000000a01.jsonl',
  '12fb81f6': 'C--Consonance-instances-sibling-5bf9d657/12fb81f6-f4c0-4ef8-aad8-f0cdce091925.jsonl',
  '6fe15f0a': 'C--Consonance-instances-sibling-3d57124e/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f.jsonl',
  'a2122153': 'C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565.jsonl',
};
const TOOLS = /mcp__consonance__(call_chair|call_librarian|chair_inject)$/;
const gate = fs.readFileSync(path.join(DATA, 'sources-gate.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch (_) { return null; } })
  .filter((r) => r && r.ts >= T0);
const strip = (t) => String(t || '').split('\n').filter((l) => !/^\s*(SOURCES|NEXT|OUTPUT)\s*:/i.test(l)).join('\n').replace(/\s+/g, ' ').trim();
const textOf = (input) => input.text || input.message || input.body || JSON.stringify(input);

async function calls(file) {
  const out = [];
  const rl = readline.createInterface({ input: fs.createReadStream(path.join(PROJ, file)), crlfDelay: Infinity });
  for await (const line of rl) {
    if (line.indexOf('mcp__consonance__') < 0 || line.indexOf('"tool_use"') < 0) continue;
    let r; try { r = JSON.parse(line); } catch (_) { continue; }
    if (!r.timestamp || r.timestamp < T0) continue;
    for (const c of (r.message && r.message.content) || []) if (c.type === 'tool_use' && TOOLS.test(c.name)) out.push({ ts: r.timestamp, tool: c.name.replace('mcp__consonance__', ''), text: textOf(c.input || {}) });
  }
  return out;
}

(async () => {
  const bySeat = {};
  for (const [s, f] of Object.entries(SEATS)) bySeat[s] = await calls(f);
  const rows = [];
  gate.forEach((g, i) => {
    if (g.decision !== 'deny') return;
    const seat = g.seat.slice(0, 8), tool = g.tool.replace('mcp__consonance__', ''), list = bySeat[seat] || [];
    const t = Date.parse(g.ts);
    const refused = list.filter((c) => c.tool === tool && Math.abs(Date.parse(c.ts) - t) < 120000).sort((a, b) => Math.abs(Date.parse(a.ts) - t) - Math.abs(Date.parse(b.ts) - t))[0];
    const next = gate.slice(i + 1).find((x) => x.seat === g.seat && x.decision === 'allow');
    const tn = next ? Date.parse(next.ts) : null;
    const accepted = next ? list.filter((c) => Math.abs(Date.parse(c.ts) - tn) < 120000).sort((a, b) => Math.abs(Date.parse(a.ts) - tn) - Math.abs(Date.parse(b.ts) - tn))[0] : null;
    const a = refused ? strip(refused.text) : null, b = accepted ? strip(accepted.text) : null;
    rows.push({ ts: g.ts, seat, tool, unmatched: g.unmatched, dt: tn ? Math.round((tn - t) / 1000) : null, found: !!refused && !!accepted,
      contentChanged: a != null && b != null ? a !== b : null, refusedText: refused && refused.text, acceptedText: accepted && accepted.text });
  });
  fs.writeFileSync(path.join(__dirname, 'pairs.json'), JSON.stringify(rows, null, 1));
  const f = rows.filter((r) => r.found);
  console.log('denies', rows.length, 'paired', f.length, 'content changed', f.filter((r) => r.contentChanged).length, 'unchanged', f.filter((r) => !r.contentChanged).length);
  for (const r of rows) console.log(r.ts, r.seat, r.tool, r.found ? (r.contentChanged ? 'CHANGED' : 'same') : 'UNPAIRED', r.dt + 's');
})();
