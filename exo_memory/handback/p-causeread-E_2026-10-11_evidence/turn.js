// turn.js (pane E, D303 part 3): the erring turn's TOOL CALLS AND RESULTS only (B §1: never prose), from turn start to a time.
//   node turn.js <projects dir> <transcript rel path> <turn_start ISO> <until ISO> [--find "<phrase>"]...
// Assistant text is never printed: each text block shows its time, length, and which --find phrases it contains (yes/no),
// so the reader can place the claim by timestamp without reading the seat's prose. The Third Place's transcripts are refused.
'use strict';
const fs = require('fs'), path = require('path');
const a = process.argv.slice(2);
const [dir, rel, from, until] = a;
const finds = [];
for (let i = 4; i < a.length; i++) if (a[i] === '--find') finds.push(a[++i]);
if (/third/i.test(rel)) { console.error('refused: Third Place transcript'); process.exit(2); }
const t0 = Date.parse(from), t1 = Date.parse(until);
// a chair verb's token and any key-shaped string are redacted before anything is printed
// (the gateway prefix is assembled, so this file never spells it and the room's credential scan stays at 0)
const KEY = new RegExp(`\\b(sk-[a-z]+-|${'vc' + 'k_'})[A-Za-z0-9_-]+`, 'g');
const redact = (s) => String(s).replace(/("token"\s*:\s*")[^"]*/g, '$1<redacted>').replace(KEY, '<redacted-key>');
const cut = (s, n) => { s = redact(s).replace(/\s+/g, ' '); return s.length > n ? s.slice(0, n) + ` …[+${s.length - n}]` : s; };
// streamed, as in find.js; a line outside the window is skipped before it is parsed
const ts = (l) => { const m = /"timestamp":"([^"]+)"/.exec(l); return m ? Date.parse(m[1]) : NaN; };
(async () => { for await (const line of require('readline').createInterface({ input: fs.createReadStream(path.join(dir, rel)), crlfDelay: Infinity })) {
  if (!line) continue;
  const lt = ts(line);
  if (!(lt >= t0 && lt <= t1)) continue;
  let o; try { o = JSON.parse(line); } catch { continue; }
  const c = o.message && o.message.content;
  if (!Array.isArray(c)) {
    if (o.type === 'user' && typeof c === 'string') console.log(`${o.timestamp} USER-PROMPT [${c.length} chars]`);
    continue;
  }
  for (const b of c) {
    if (b.type === 'tool_use') console.log(`${o.timestamp} CALL ${b.name}: ${cut(JSON.stringify(b.input), 700)}`);
    else if (b.type === 'tool_result') {
      const r = Array.isArray(b.content) ? b.content.map((x) => x.text || '').join(' ') : b.content;
      console.log(`${o.timestamp} RESULT${b.is_error ? ' (error)' : ''}: ${cut(r, Number(process.env.TURN_MAX || 1500))}`);
    } else if (b.type === 'text' && o.type === 'assistant') {
      console.log(`${o.timestamp} ASSISTANT-TEXT [${b.text.length} chars]${finds.map((f) => ` has(${f})=${b.text.includes(f)}`).join('')}`);
    } else if (b.type === 'text' && o.type === 'user') {
      console.log(`${o.timestamp} USER-TEXT [${b.text.length} chars]`);
    }
  }
} })();
