// refusals.js (pane B, D276 item 5): every REFUSED result of a consonance ring/dispatch tool since 2026-10-08, from the five seats' transcripts,
// classified by the refusal's own first words; for trailer refusals, the refused call's text and the next accepted call of the same tool.
'use strict';
const fs = require('fs'), path = require('path'), readline = require('readline');
const PROJ = 'C:/Users/nname/.claude/projects';
const SEATS = {
  librarian: 'C--Consonance-instances-librarian/0c0c0c0b-0000-4000-8000-00000000115b.jsonl',
  chair: 'C--Consonance-instances-main/0c0c0c0a-0000-4000-8000-000000000a01.jsonl',
  B: 'C--Consonance-instances-sibling-5bf9d657/12fb81f6-f4c0-4ef8-aad8-f0cdce091925.jsonl',
  A: 'C--Consonance-instances-sibling-3d57124e/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f.jsonl',
  E: 'C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565.jsonl',
};
const TOOLS = /mcp__consonance__(call_chair|call_librarian|chair_inject|chair_decide|chair_phase|post_board)$/;
const strip = (t) => String(t || '').split('\n').filter((l) => !/^\s*(SOURCES|NEXT|OUTPUT)\b/i.test(l)).join('\n').replace(/\s+/g, ' ').trim();
const resText = (c) => (typeof c.content === 'string' ? c.content : (c.content || []).map((x) => x.text || '').join(' '));
(async () => {
  const all = [];
  for (const [seat, f] of Object.entries(SEATS)) {
    const uses = new Map(), events = [];
    const rl = readline.createInterface({ input: fs.createReadStream(path.join(PROJ, f)), crlfDelay: Infinity });
    for await (const line of rl) {
      if (line.indexOf('mcp__consonance__') < 0 && line.indexOf('tool_result') < 0) continue;
      let r; try { r = JSON.parse(line); } catch (_) { continue; }
      if (!r.timestamp || r.timestamp < '2026-10-08') continue;
      for (const c of (r.message && Array.isArray(r.message.content) && r.message.content) || []) {
        if (c.type === 'tool_use' && TOOLS.test(c.name)) { const u = { id: c.id, ts: r.timestamp, tool: c.name.replace('mcp__consonance__', ''), text: (c.input && (c.input.text || c.input.message)) || JSON.stringify(c.input || {}) }; uses.set(c.id, u); events.push(u); }
        if (c.type === 'tool_result' && uses.has(c.tool_use_id)) { const u = uses.get(c.tool_use_id); u.result = resText(c); u.refused = !!c.is_error || /^\s*refused/i.test(u.result); }
      }
    }
    for (const u of events) if (u.refused) {
      const cls = /SOURCES gate/.test(u.result) ? 'SOURCES' : /NEXT-trailer gate/.test(u.result) ? 'NEXT-TRAILER' : /OUT OF TURN/.test(u.result) ? 'OUT-OF-TURN' : 'OTHER';
      const next = events.find((x) => x.ts > u.ts && x.tool === u.tool && !x.refused);
      all.push({ seat, ts: u.ts, tool: u.tool, cls, why: u.result.slice(0, 220).replace(/\s+/g, ' '), changed: next ? strip(next.text) !== strip(u.text) : null, dt: next ? Math.round((Date.parse(next.ts) - Date.parse(u.ts)) / 1000) : null, refusedText: u.text, nextText: next && next.text });
    }
  }
  fs.writeFileSync(path.join(__dirname, 'refusals.json'), JSON.stringify(all, null, 1));
  const by = {}; for (const r of all) { by[r.cls] = by[r.cls] || { n: 0, changed: 0 }; by[r.cls].n++; if (r.changed) by[r.cls].changed++; }
  console.log(JSON.stringify(by));
  for (const r of all) if (r.cls !== 'SOURCES') console.log(r.ts, r.seat, r.tool, r.cls, r.changed ? 'CHANGED' : 'same', r.dt + 's', '|', r.why.slice(0, 150));
})();
