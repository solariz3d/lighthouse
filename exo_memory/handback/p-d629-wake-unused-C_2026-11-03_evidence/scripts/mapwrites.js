// mapwrites.js <jsonl> <fromISO> <toISO> <needle>: streams a transcript one line at a time and prints, for each tool_use
// whose input mentions <needle> inside the window, its timestamp, tool name and the command/file (first 220 chars).
// Never prints tool results or message text. READ-ONLY.
'use strict';
const fs = require('fs'), readline = require('readline');
const [file, from, to, needle] = process.argv.slice(2);
const rl = readline.createInterface({ input: fs.createReadStream(file, { encoding: 'utf8' }), crlfDelay: Infinity });
let n = 0, first = null, last = null;
rl.on('line', (line) => {
  n++;
  const m = /"timestamp":"([^"]+)"/.exec(line); if (!m) return;
  const ts = m[1]; if (!first) first = ts; last = ts;
  if (ts < from || ts > to) return;
  if (!line.includes('"tool_use"')) return;
  let j; try { j = JSON.parse(line); } catch (_) { return; }
  for (const c of (j.message && j.message.content) || []) {
    if (c.type !== 'tool_use') continue;
    const s = JSON.stringify(c.input);
    if (!s.includes(needle)) continue;
    const brief = c.input.command || c.input.file_path || '';
    console.log(ts, c.name, String(brief).replace(/\s+/g, ' ').slice(0, 220), c.name === 'Edit' ? '| old ' + String(c.input.old_string).length + ' new ' + String(c.input.new_string).length : c.name === 'Write' ? '| content ' + String(c.input.content).length : '');
  }
});
rl.on('close', () => console.log('lines', n, 'first', first, 'last', last));
