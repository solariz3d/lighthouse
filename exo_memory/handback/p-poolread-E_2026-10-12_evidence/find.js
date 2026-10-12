// find.js (pane E, D303 part 3): where in a transcript a phrase first appears in the seat's OWN output (assistant text or a tool
// call's input), within a time window, with the start of the turn it is in. Prints times and the matching block's kind only.
//   node find.js <projects dir> <transcript rel path> <from ISO> <to ISO> "<phrase>" ["<phrase>"...]
'use strict';
const fs = require('fs'), path = require('path');
const [dir, rel, from, to, ...phrases] = process.argv.slice(2);
if (/third/i.test(rel)) { console.error('refused: Third Place transcript'); process.exit(2); }
const t0 = Date.parse(from), t1 = Date.parse(to);
let turnStart = null;
// streamed: the chair's transcript is larger than one string can hold. A line whose own timestamp is outside the window
// (padded a day back, so a turn's start is seen) is skipped before it is parsed.
const ts = (l) => { const m = /"timestamp":"([^"]+)"/.exec(l); return m ? Date.parse(m[1]) : NaN; };
(async () => { for await (const line of require('readline').createInterface({ input: fs.createReadStream(path.join(dir, rel)), crlfDelay: Infinity })) {
  if (!line) continue;
  const lt = ts(line);
  if (!(lt >= t0 - 86400000 && lt <= t1)) continue;
  let o; try { o = JSON.parse(line); } catch { continue; }
  const c = o.message && o.message.content;
  // a turn starts at a user record that is not a tool result
  if (o.type === 'user' && (typeof c === 'string' || (Array.isArray(c) && !c.some((b) => b.type === 'tool_result')))) turnStart = o.timestamp;
  const t = Date.parse(o.timestamp || '');
  if (!(t >= t0 && t <= t1) || o.type !== 'assistant' || !Array.isArray(c)) continue;
  for (const b of c) {
    const s = b.type === 'text' ? b.text : b.type === 'tool_use' ? JSON.stringify(b.input) : '';
    const hit = phrases.filter((p) => s.includes(p));
    if (hit.length) console.log(`${o.timestamp} turn_start ${turnStart} ${b.type}${b.name ? ' ' + b.name : ''} hits: ${hit.join(' | ')}`);
  }
} })();
