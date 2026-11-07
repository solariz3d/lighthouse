// denies.js: delete-gate's deny rows (time, seat dir, each target's how / missing / unfinished / links), and l3 / l2 overseer verdict fields counted
'use strict';
const fs = require('fs');
for (const l of fs.readFileSync('C:/Consonance/data/delete-gate.jsonl', 'utf8').split('\n')) {
  if (!l.includes('"decision":"deny"')) continue; const o = JSON.parse(l);
  console.log(o.t, o.cwd.split('\\').pop(), o.reason || '', JSON.stringify((o.checked || []).map((c) => [c.how, String(c.target).replace(/^.*\\(Desktop|Temp|Downloads)\\/, '$1\\'), c.missing, c.unfinished, c.links])).slice(0, 300));
}
for (const f of ['l2_overseer', 'l3_overseer']) {
  const m = new Map(); let first = '', last = '';
  for (const l of fs.readFileSync(`C:/Users/nname/.claude/shell/${f}.jsonl`, 'utf8').split('\n')) { if (!l) continue; let o; try { o = JSON.parse(l); } catch (e) { continue; }
    const t = o.timestamp || o.ts || ''; if (t && (!first || t < first)) first = t; if (t > last) last = t;
    const k = `${o.type || '?'} | ${o.trajectory || o.verdict || o.drift || o.status || ''}`.slice(0, 70); m.set(k, (m.get(k) || 0) + 1); }
  console.log(f, first.slice(0, 16), '..', last.slice(0, 16)); for (const [k, v] of [...m].sort((a, b) => b[1] - a[1]).slice(0, 8)) console.log('   ', v, k);
}
