// Strict re-entry scan: after each boundary, first tool_use whose TARGET fields
// (file_path / command / path / pattern / notebook_path) reference exo_memory or the
// room file (instances/main/CLAUDE.md, BOOT.md). Write-content and MCP message text excluded.
const fs = require('fs');
const readline = require('readline');
const FILE = 'C:/Users/zackn/.claude/projects/C--Consonance-instances-main/0c0c0c0a-0000-4000-8000-000000000a01.jsonl';
const TARGET_FIELDS = ['file_path', 'command', 'path', 'pattern', 'notebook_path'];
const ROOM_RE = /exo_memory|BOOT\.md|instances[\\\/\\\\]+main[\\\/\\\\]+CLAUDE\.md/i;

(async () => {
  const rl = readline.createInterface({ input: fs.createReadStream(FILE), crlfDelay: Infinity });
  const rows = [];
  for await (const line of rl) {
    if (!line.trim()) { rows.push(null); continue; }
    try { rows.push(JSON.parse(line)); } catch { rows.push(null); }
  }
  const bIdx = [];
  rows.forEach((r, i) => { if (r && r.type === 'system' && r.subtype === 'compact_boundary') bIdx.push(i); });
  for (const bi of bIdx) {
    const b = rows[bi];
    const bt = Date.parse(b.timestamp);
    let hit = null;
    for (let j = bi + 1; j < rows.length && !hit; j++) {
      const r = rows[j];
      if (!r || r.type !== 'assistant' || !r.message || !Array.isArray(r.message.content)) continue;
      for (const part of r.message.content) {
        if (part.type !== 'tool_use') continue;
        for (const f of TARGET_FIELDS) {
          const v = part.input && part.input[f];
          if (typeof v === 'string' && ROOM_RE.test(v)) {
            hit = { row: j + 1, ts: r.timestamp, mins: ((Date.parse(r.timestamp) - bt) / 60000).toFixed(1), tool: part.name, field: f, val: v.slice(0, 160) };
            break;
          }
        }
        if (hit) break;
      }
    }
    console.log(b.timestamp, '->', JSON.stringify(hit));
  }
})();
