'use strict';
// L119 (pane E), READ-ONLY, COUNTS ONLY: the sampling frame on L. For each seat's MAIN session transcript, count distinct
// assistant messages (message.id) per UTC day whose claim-bearing text (arm-1 §1 rule: text blocks + written text of
// Write/Edit/MultiEdit + Bash heredoc bodies, else nothing from Bash) is >= 200 characters, split by the machine the row
// was written on (the nearest preceding hook row's command path: \Users\zackn\ = L, \Users\nname\ = D). Prints no content.
const fs = require('fs'), path = require('path'), os = require('os');
const P = path.join(os.homedir(), '.claude', 'projects');
const SEATS = {
  librarian: ['C--Consonance-instances-librarian', '0c0c0c0b-0000-4000-8000-00000000115b'],
  chair: ['C--Consonance-instances-main', '0c0c0c0a-0000-4000-8000-000000000a01'],
  A: ['C--Consonance-instances-sibling-3d57124e', '6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f'],
  B: ['C--Consonance-instances-sibling-5bf9d657', '12fb81f6-f4c0-4ef8-aad8-f0cdce091925'],
  C: ['C--Consonance-instances-sibling-0845a868', '0845a868-38f2-4cc2-b45a-431e0c088fb1'],
  E: ['C--Consonance-instances-sibling-07b8a48f', 'a2122153-a37e-41a6-a86f-534267ec0565'],
};
const heredocs = (cmd) => [...String(cmd).matchAll(/<<\s*'?(\w+)'?[^\n]*\n([\s\S]*?)\n\1\b/g)].map((m) => m[2]);
const out = {};
for (const [seat, [dir, sid]] of Object.entries(SEATS)) {
  const f = path.join(P, dir, sid + '.jsonl');
  let text;
  try { text = fs.readFileSync(f, 'utf8'); } catch (e) { out[seat] = { missing: f }; continue; }
  const msgs = new Map(); let here = '?';
  for (const line of text.split('\n')) {
    const mk = line.includes('"attachment"') && /Users\\\\(zackn|nname)\\\\\.claude/.exec(line);
    if (mk) { here = mk[1] === 'zackn' ? 'L' : 'D'; continue; }
    if (!line.startsWith('{"') || !line.includes('"assistant"')) continue;
    let o; try { o = JSON.parse(line); } catch (_) { continue; }
    if (o.type !== 'assistant' || !o.message || !o.message.id || !Array.isArray(o.message.content)) continue;
    let n = 0;
    for (const b of o.message.content) {
      if (b.type === 'text') n += b.text.length;
      else if (b.type === 'tool_use' && b.input) {
        if (b.name === 'Write') n += String(b.input.content || '').length;
        else if (b.name === 'Edit') n += String(b.input.new_string || '').length;
        else if (b.name === 'MultiEdit') n += (b.input.edits || []).reduce((a, e) => a + String(e.new_string || '').length, 0);
        else if (b.name === 'Bash') n += heredocs(b.input.command).join('').length;
      }
    }
    const m = msgs.get(o.message.id) || { ts: o.timestamp, n: 0, machine: here };
    m.n += n; msgs.set(o.message.id, m);
  }
  const days = {};
  for (const m of msgs.values()) {
    if (m.n < 200) continue;
    const d = String(m.ts).slice(0, 10);
    const k = d + ' ' + m.machine;
    days[k] = (days[k] || 0) + 1;
  }
  out[seat] = days;
}
const allDays = [...new Set(Object.values(out).flatMap((d) => Object.keys(d).map((k) => k.slice(0, 10))))].sort();
console.log('day        ' + Object.keys(SEATS).map((s) => s.padStart(12)).join(''));
for (const day of allDays) console.log(day + ' ' + Object.keys(SEATS).map((s) => { const d = out[s] || {}; const L = d[day + ' L'] || 0, D = d[day + ' D'] || 0, Q = d[day + ' ?'] || 0; return `${L}L/${D}D${Q ? '/' + Q + '?' : ''}`.padStart(12); }).join(''));
