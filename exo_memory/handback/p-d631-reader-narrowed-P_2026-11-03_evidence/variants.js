// variants.js <evidence-dir>: POST-HOC alternatives to the registered class, on the same 80 rings. Not registered before they met the sample.
'use strict';
const fs = require('fs'), path = require('path');
const ev = process.argv[2];
const verdict = {};
for (const l of fs.readFileSync(path.join(ev, 'table.md'), 'utf8').split('\n')) { const m = l.match(/^\| (\d{4}) \| [^|]+ \| (ERROR-MISSED|ERROR-CAUGHT-ANYWAY|NO-ERROR|UNDECIDABLE) \|/); if (m) verdict[m[1]] = m[2]; }
const rings = fs.readdirSync(path.join(ev, 'rows')).sort().map((f) => { const s = fs.readFileSync(path.join(ev, 'rows', f), 'utf8'), at = s.indexOf('## the message as sent');
  return { id: f.slice(0, 4), tool: (s.match(/· (mcp__consonance__call_\w+)/) || [])[1], text: s.slice(s.indexOf('\n\n', at) + 2) }; });
const PHRASE = /\ball green\b|\bstill (?:runs?|running|works?)\b|\brefuses?\b|\brefused\b/i;
const V = {
  'V1 call_chair only (the librarian relaying the panes)': (r) => r.tool === 'mcp__consonance__call_chair',
  'V2 the ruling\'s own phrases only ("all green", "still runs", "refuses")': (r) => PHRASE.test(r.text),
  'V3 ring length over 1,500 characters': (r) => r.text.length > 1500,
};
for (const [k, f] of Object.entries(V)) { const inc = rings.filter(f), err = inc.filter((r) => /^ERROR/.test(verdict[r.id]));
  console.log(`${k}: calls ${inc.length} of 80 (saved ${80 - inc.length}); real errors kept ${err.length} of 8 [${err.map((r) => r.id).join(' ')}]`); }
