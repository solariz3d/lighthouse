// live-cmd.js (O, D675): is every entry landed-live prints LIVE run by a command in settings.json? A hook entry must appear as a command's script
// path; a Lib entry (install.ps1 `Lib = $true`) counts when at least one hook in its `By` list does. Prints entry names and verdicts only.
// node live-cmd.js <landed-live --all output> <settings.json> <install.ps1>
'use strict';
const fs = require('fs'), path = require('path');
const [LL, SETTINGS, INSTALL] = process.argv.slice(2);
const read = (p) => fs.readFileSync(p, 'utf8').replace(/^﻿/, '');
const leaf = (s) => path.win32.basename(s);
// every command string in settings.json, and the script leaf each one runs (the last quoted or bare *.js / *.py token)
const s = JSON.parse(read(SETTINGS));
const cmds = [];
for (const groups of Object.values(s.hooks || {})) for (const g of groups) for (const h of g.hooks || []) if (h.command) cmds.push(h.command);
const runs = new Set(cmds.flatMap((c) => (c.match(/[^"\s\\/]+\.(js|py)\b/g) || []).map((x) => x.toLowerCase())));
// install.ps1 rows: To leaf -> { lib, by[] }
const rows = new Map();
for (const l of read(INSTALL).split(/\r?\n/)) {
  const to = l.match(/To\s*=\s*'([^']+)'/);
  if (!to) continue;
  const by = l.match(/By\s*=\s*'([^']+)'/);
  rows.set(leaf(to[1]).toLowerCase(), { to: to[1], lib: /Lib\s*=\s*\$true/.test(l), by: by ? by[1].split(',').map((x) => x.trim().toLowerCase()) : [] });
}
const live = read(LL).split(/\r?\n/).filter((l) => /^LIVE\s/.test(l)).map((l) => l.trim().split(/\s+/)[1]);
let matched = 0;
for (const e of live) {
  const k = e.toLowerCase(), r = rows.get(k) || { lib: false, by: [] };
  let v;
  // strict: the command's script path must be the INSTALLED copy, <home>/.claude/shell/<To>, not a same-named file elsewhere
  const norm = (x) => x.replace(/\\/g, '/').toLowerCase();
  const strict = r.to && cmds.some((c) => norm(c).includes('/.claude/shell/' + norm(r.to) + '"') || norm(c).endsWith('/.claude/shell/' + norm(r.to)));
  if (runs.has(k) && strict) v = `run by a settings.json command, at the installed path shell/${r.to.replace(/\\/g, '/')}`;
  else if (runs.has(k)) v = 'a command runs a file of this NAME, but NOT at the installed path';
  else if (r.lib) { const hit = r.by.filter((b) => runs.has(b)); v = hit.length ? `Lib, required by ${hit.join(', ')} (run by a command)` : `Lib, and NONE of its By hooks (${r.by.join(', ')}) is run by a command`; }
  else v = 'NOT run by any settings.json command';
  if (!/NOT|NONE/.test(v)) matched++;
  console.log(`${e.padEnd(24)} ${v}`);
}
console.log(`${live.length} LIVE entries; ${matched} matched to a settings.json command (directly, or as a Lib through its By hooks); ${live.length - matched} not`);
