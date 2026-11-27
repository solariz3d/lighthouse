// brief678.js: print wash678 output compactly (ghost piece lists as first..last and count)
'use strict';
const fs = require('fs');
for (const f of process.argv.slice(2)) {
  for (const line of fs.readFileSync(f, 'utf8').split(/\r?\n/)) {
    if (!line.trim()) continue;
    const o = JSON.parse(line), parts = [`${o.tree} ${o.doc}`];
    if (o.error) { parts.push(`ERROR ${o.error.slice(0, 90)}`); console.log(parts.join(' | ')); continue; }
    if (o.said) parts.push(`said "${o.said}"`);
    for (const k of ['fields', 'bare']) {
      const c = o[k]; if (!c) continue;
      if (c.error) { parts.push(`${k}: ERROR ${c.error}`); continue; }
      const g = c.ghostPieces;
      parts.push(`${k}: relaid ${c.relaid} segs ${g[0]}..${g[g.length - 1]} (${g.length}) batches ${c.batches} win h ${c.win150to490.horizM}@${c.win150to490.at} v ${c.win150to490.vertM}`);
    }
    console.log(parts.join(' | '));
  }
}
