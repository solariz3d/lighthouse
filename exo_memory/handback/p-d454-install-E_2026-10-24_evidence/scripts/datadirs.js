// datadirs.js (D454 part 3, pane E): for each hook, which data dir it reached in each scratch config. The app's rule (main.rs data_dir): data_dir from
// ~/.consonance.json when set, else %USERPROFILE%\.consonance. So with no config or an empty data_dir every hook that keeps a record must reach
// <home>/.consonance, and with data_dir set it must reach that folder. A hook that reaches the custom folder but nothing at all without it has no third step.
'use strict';
const fs = require('fs');
const H = (process.env.PROBE_HOME || 'c:/users/nname/downloads/cons-d454-e/home').split(String.fromCharCode(92)).join('/').toLowerCase();
const TAG = process.env.PROBE_TAG || '';   // scratch-<variant><TAG>.jsonl
const where = (p) => {
  p = String(p || '').toLowerCase();
  if (p.startsWith(H + '/.consonance/') || p === H + '/.consonance') return 'default';
  if (p.startsWith(H + '/custom-data')) return 'custom';
  if (p.startsWith(H + '/.claude/shell')) return null;   // the shell dir, its own rule (CONSONANCE_SHELL_DIR, else ~/.claude/shell)
  return null;
};
const per = {};
for (const v of ['none', 'empty', 'custom']) {
  for (const r of fs.readFileSync(__dirname + '/scratch-' + v + TAG + '.jsonl', 'utf8').trim().split('\n').map((l) => JSON.parse(l))) {
    const k = r.script.split(/[\\/]/).slice(-2).join('/') + (r.tool ? ' ' + r.tool : '') + ' [' + r.event + ']';
    per[k] = per[k] || { none: new Set(), empty: new Set(), custom: new Set(), files: { none: new Set(), empty: new Set(), custom: new Set() } };
    for (const x of r.rows) { const w = where(x.path); if (w) { per[k][v].add(w); per[k].files[v].add(String(x.path).toLowerCase().replace(H, '~').replace(/.*\/(\.consonance|custom-data)\//, '<data>/')); } }
  }
}
const s = (set) => [...set].join(',') || '-';
for (const [k, o] of Object.entries(per)) {
  const ok = s(o.custom) === '-' || (o.none.has('default') && o.empty.has('default') && o.custom.has('custom') && !o.custom.has('default'));
  console.log((ok ? 'ok   ' : 'GAP  ') + k.padEnd(62) + ' none:' + s(o.none).padEnd(8) + ' empty:' + s(o.empty).padEnd(8) + ' custom:' + s(o.custom).padEnd(8) + ' files(custom): ' + [...o.files.custom].slice(0, 4).join(' '));
}
