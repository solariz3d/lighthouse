// semdiff.js (O): a SEMANTIC diff of two Claude Code settings.json files. Lists every hook group as "<event> [<matcher>] <command>",
// and every other top-level key by its JSON, then prints what was ADDED and REMOVED. Prints commands (paths), never env values.
// node semdiff.js <before.json> <after.json>
'use strict';
const fs = require('fs');
const [A, B] = process.argv.slice(2);
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^﻿/, ''));
const items = (s) => {
  const out = [];
  for (const [ev, groups] of Object.entries(s.hooks || {})) for (const g of groups) {
    const cmds = (g.hooks || []).map((h) => `${h.type || '?'}:${h.command || ''}${h.timeout ? ' t=' + h.timeout : ''}`).join(' + ');
    out.push(`hooks.${ev} [${g.matcher || ''}] ${cmds}`);
  }
  for (const [k, v] of Object.entries(s)) if (k !== 'hooks') out.push(`${k} = ${k === 'env' ? '(' + Object.keys(v || {}).length + ' keys, values not printed)' : JSON.stringify(v)}`);
  return out;
};
const a = items(read(A)), b = items(read(B));
const added = b.filter((x) => !a.includes(x)), removed = a.filter((x) => !b.includes(x));
const groups = (s) => Object.values(s.hooks || {}).reduce((n, g) => n + g.length, 0);
console.log(`before: ${groups(read(A))} hook groups; after: ${groups(read(B))}`);
console.log(`ADDED (${added.length}):`); added.forEach((x) => console.log('  + ' + x));
console.log(`REMOVED (${removed.length}):`); removed.forEach((x) => console.log('  - ' + x));
