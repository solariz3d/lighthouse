// live_roles.js (pane C, L247 read): his kept panes on this machine, each through 72d88e09's role rule as written in main.rs
// (builder = is_managed_cwd: the path starts with instances_dir, component-wise and case as written; AND is_builder_dir_name: the
// folder name starts "sibling-"). READ ONLY: his ~/.consonance.json (instances_dir, seat_models, run_preset), panes.json, letters.json.
// Prints no other config value. A mirror of the rule, not the rule: K3c runs is_builder_dir_name itself.
// usage: node live_roles.js
'use strict';
const fs = require('fs'), path = require('path');
const cfgPath = path.join(process.env.USERPROFILE, '.consonance.json');
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8').replace(/^\uFEFF/, ''));
const data = cfg.data_dir || 'C:\\Consonance\\data';
const kept = JSON.parse(fs.readFileSync(path.join(data, 'panes.json'), 'utf8'));
const letters = JSON.parse(fs.readFileSync(path.join(data, 'letters.json'), 'utf8'));
const root = path.win32.normalize(cfg.instances_dir).split('\\').filter(Boolean);
const under = (cwd) => { const c = path.win32.normalize(cwd).split('\\').filter(Boolean); return root.every((x, i) => c[i] === x); };
const sm = cfg.seat_models || {};
console.log(`config ${cfgPath} mtime ${fs.statSync(cfgPath).mtime.toISOString()}; run_preset ${JSON.stringify(cfg.run_preset)}; seat_models ${JSON.stringify(sm)}`);
for (const k of kept) {
  const L = letters[k.pane];
  const builder = under(k.cwd) && path.win32.basename(k.cwd).startsWith('sibling-');
  const normal = sm[k.pane] || sm[L] || '(none)';
  const turbo = builder ? 'opus xhigh (the table)' : `${normal}, no effort (no turbo role)`;
  console.log(`${L || '-'} ${k.pane.slice(0, 8)} ${path.win32.basename(k.cwd)} managed=${under(k.cwd)} builder=${builder}  normal: --model ${normal}  turbo: ${turbo}`);
}
console.log(`fixed seats under turbo: main opus xhigh (seat_models main ${JSON.stringify(sm.main)}); librarian fable high (seat_models librarian ${JSON.stringify(sm.librarian)}); third_place ${JSON.stringify(sm.third_place)} high`);
