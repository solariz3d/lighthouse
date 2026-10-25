// show.js <inv.json> <fileRegex> [catRegex]: print flagged rows for matching files.
'use strict';
const fs = require('fs');
const [J, F, C] = process.argv.slice(2);
const inv = JSON.parse(fs.readFileSync(J, 'utf8'));
const fr = new RegExp(F), cr = C ? new RegExp(C) : null;
for (const r of inv.rows) if (fr.test(r.file) && (!cr || r.cats.some((c) => cr.test(c)))) console.log(`${r.file}:${r.line} [${r.cats.join(',')}] ${r.text.slice(0, 330)}`);
