'use strict';
// D160 manual locate helper — searches ONLY the blind text-only extract (d160.js index output: assistant text and text
// written through tools; no tool calls, no tool results), within a row's registered window [date-1d, date+2d).
//   node d160-find.js <extractDir> <seat> <YYYY-MM-DD> <regex> [maxHits]
// Prints each matching block's header (<transcript>:<line> [timestamp] kind) and a snippet around the match.
const fs = require('fs'), path = require('path');
const [dir, seat, date, pattern, max = '12'] = process.argv.slice(2);
const d = Date.parse(date + 'T00:00:00Z');
const days = [-1, 0, 1].map((k) => new Date(d + k * 864e5).toISOString().slice(0, 10));
const re = new RegExp(pattern, 'i');
let hits = 0;
const present = [];
for (const day of days) {
  const f = path.join(dir, `${seat}-${day}.txt`);
  if (!fs.existsSync(f)) continue;
  present.push(day);
  const blocks = fs.readFileSync(f, 'utf8').split(/\n(?==== )/);
  for (const b of blocks) {
    const nl = b.indexOf('\n'), head = b.slice(0, nl), body = b.slice(nl + 1);
    const m = re.exec(body);
    if (!m) continue;
    if (++hits > +max) continue;
    const at = m.index;
    console.log(`${head}\n    …${body.slice(Math.max(0, at - 160), at + 200).replace(/\s+/g, ' ')}…`);
  }
}
console.log(`-- ${hits} block(s) in ${seat} days present: ${present.join(', ') || 'NONE'} (window ${days[0]}..${days[2]})`);
