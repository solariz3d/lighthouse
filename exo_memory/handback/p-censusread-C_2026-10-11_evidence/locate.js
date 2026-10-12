// D301 wave 4, step 4: find the erring turn when A's fields did not locate it.
//   node locate.js <transcript dir> <phrase> <from ISO> <to ISO>
// Prints the timestamp and file of every ASSISTANT record (text or tool_use input) containing the phrase
// (case-insensitive) inside the window, with 100 chars around the match. It reads no Third Place folder.
const fs = require('fs'), path = require('path');
const [dir, phrase, from, to] = process.argv.slice(2);
if (/third/i.test(dir)) throw new Error('refusing a Third Place folder');
const P = phrase.toLowerCase();
for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.jsonl'))) {
  for (const line of fs.readFileSync(path.join(dir, f), 'utf8').split('\n')) {
    if (!line || !line.toLowerCase().includes(P)) continue;
    let r; try { r = JSON.parse(line); } catch { continue; }
    if (r.type !== 'assistant' || !r.timestamp || r.timestamp < from || r.timestamp > to) continue;
    for (const c of r.message.content || []) {
      const s = c.type === 'text' ? c.text : c.type === 'tool_use' ? JSON.stringify(c.input) : '';
      const k = s.toLowerCase().indexOf(P);
      if (k >= 0) console.log(`${r.timestamp} ${f} ${c.type}: …${s.slice(Math.max(0, k - 100), k + 100).replace(/\s+/g, ' ')}…`);
    }
  }
}
