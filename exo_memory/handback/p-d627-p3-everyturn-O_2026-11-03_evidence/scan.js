// scan.js (D627 part 3, O): READ ONLY. One streaming pass over each seat's transcripts written since FROM; one JSONL record per PROMPT (a user
// message with text, not a tool result): seat, ts, kind (keep-warm / dispatch / ring / other), whether it carries the NEXT-trailer note, the pulse
// items injected with it (hook_additional_context), the state block if any, and what the seat did in that turn: its text (clipped), the tools it
// called, the ring texts it sent (call_librarian / call_chair / chair_inject), and the Bash/PowerShell commands it ran (clipped).
// node scan.js <out.jsonl> [FROM ISO]
'use strict';
require('C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-36313935/c88002b1-74d8-4036-8cc0-f64aefbeabff/scratchpad/winhide.js');
const fs = require('fs'), path = require('path'), readline = require('readline');
const [, , OUT, FROM = '2026-10-20T06:00:00Z'] = process.argv, from = Date.parse(FROM);
const P = 'C:/Users/nname/.claude/projects/';
const SEATS = { D: 'main', M: 'librarian', N: 'third-place', A: 'sibling-3d57124e', B: 'sibling-5bf9d657', C: 'sibling-0845a868', E: 'sibling-07b8a48f', O: 'sibling-36313935', P: 'sibling-372c8abc' };
const out = fs.createWriteStream(OUT);
const clip = (s, n) => (s.length > n ? s.slice(0, n) + '…' : s);
async function scan(letter, file) {
  let cur = null, n = 0;
  const flush = () => { if (cur) { out.write(JSON.stringify(cur) + '\n'); n++; } cur = null; };
  const rl = readline.createInterface({ input: fs.createReadStream(file, { highWaterMark: 1 << 20 }), crlfDelay: Infinity });
  for await (const l of rl) {
    const head = l.slice(0, 200);
    if (head.startsWith('{"type":"api-request') || head.startsWith('{"type":"file-history') || head.startsWith('{"type":"queue-operation')) continue;
    if (!(l.includes('"type":"user"') || l.includes('"type":"assistant"') || l.includes('"type":"attachment"'))) continue;
    let o; try { o = JSON.parse(l); } catch (e) { continue; }
    const t = Date.parse(o.timestamp || ''); if (!(t >= from)) continue;
    if (o.type === 'attachment') {
      const a = o.attachment || {}; if (a.type !== 'hook_additional_context') continue;
      const items = (Array.isArray(a.content) ? a.content : [String(a.content || '')]).map(String);
      for (const s of items) {
        const x = s.trimStart();
        if (x.startsWith('[pulse]') && cur) { const line = x.split('\n')[1] || ''; cur.pulse = line.split(' · ').map((q) => q.trim()).filter(Boolean); cur.pulseChars = (cur.pulseChars || 0) + s.length; }
        else if (/state-block|\[room state/.test(x.slice(0, 200))) { out.write(JSON.stringify({ seat: letter, ts: o.timestamp, kind: 'state-block', chars: s.length }) + '\n'); }
      }
      continue;
    }
    if (o.type === 'user' && o.message && !o.isMeta) {
      const c = o.message.content;
      if (Array.isArray(c) && c.some((x) => x && x.type === 'tool_result')) {
        // a hook denial or a gate reply lands as a tool result: keep the gate lines only
        if (cur) for (const x of c) { const txt = typeof x.content === 'string' ? x.content : Array.isArray(x.content) ? x.content.map((y) => y.text || '').join('') : '';
          if (/SOURCES gate|NEXT-trailer gate|refused by|REFUSED/.test(txt)) (cur.gateResults = cur.gateResults || []).push(clip(txt, 300)); }
        continue;
      }
      const text = typeof c === 'string' ? c : Array.isArray(c) ? c.filter((x) => x && x.type === 'text').map((x) => x.text).join('\n') : '';
      if (!text || /^<(command-|local-command|task-notification)/.test(text.trim())) continue;
      flush();
      const tt = text.trim();
      const kind = /^\[keep-warm visit/.test(tt) ? 'keep-warm' : /\[chair:MAIN\]/.test(tt.slice(0, 400)) ? 'dispatch' : /^\[pane:|\[librarian\]|^\[lib/.test(tt) ? 'ring' : 'other';
      cur = { seat: letter, ts: o.timestamp, kind, head: clip(tt.replace(/\s+/g, ' '), 160), trailerNote: tt.includes('[NEXT-trailer gate — delivered anyway'), nextLine: (tt.match(/^NEXT:.*$/m) || [null])[0], text: '', tools: [], rings: [], cmds: [] };
      continue;
    }
    if (o.type === 'assistant' && cur && o.message && Array.isArray(o.message.content)) {
      for (const b of o.message.content) {
        if (b.type === 'text' && cur.text.length < 3000) cur.text += b.text + '\n';
        if (b.type === 'tool_use') {
          cur.tools.push(b.name);
          const inp = b.input || {};
          if (/call_librarian|call_chair|chair_inject|post_board/.test(b.name)) cur.rings.push({ tool: b.name.replace('mcp__consonance__', ''), target: inp.target || null, text: clip(String(inp.text || ''), 1500) });
          if ((b.name === 'Bash' || b.name === 'PowerShell') && cur.cmds.length < 40) cur.cmds.push(clip(String(inp.command || ''), 300));
        }
      }
    }
  }
  flush();
  return n;
}
(async () => {
  for (const [letter, dir] of Object.entries(SEATS)) {
    const d = P + 'C--Consonance-instances-' + dir;
    if (!fs.existsSync(d)) continue;
    const files = fs.readdirSync(d).filter((f) => f.endsWith('.jsonl')).map((f) => path.join(d, f)).filter((f) => fs.statSync(f).mtimeMs >= from);
    for (const f of files) { const t0 = Date.now(); const n = await scan(letter, f); console.log(letter, path.basename(f), n, 'prompts', ((Date.now() - t0) / 1000).toFixed(0) + ' s'); }
  }
  out.end();
})();
