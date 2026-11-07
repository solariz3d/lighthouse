'use strict';
const fs = require('fs'), readline = require('readline');
const [file, ...ts] = process.argv.slice(2);
const rl = readline.createInterface({ input: fs.createReadStream(file, { encoding: 'utf8' }), crlfDelay: Infinity });
rl.on('line', (line) => { if (!ts.some((t) => line.includes('"timestamp":"' + t))) return; let j; try { j = JSON.parse(line); } catch (_) { return; }
  for (const c of (j.message && j.message.content) || []) if (c.type === 'tool_use') { const s = String(c.input.command || ''); console.log('==', j.timestamp, 'len', s.length); console.log(s.replace(/"- 2026[^"]*"/g, (m) => '"<LINE ' + m.length + ' chars>"')); } });
