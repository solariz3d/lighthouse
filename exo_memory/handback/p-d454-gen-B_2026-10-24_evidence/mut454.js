// mut454.js (D454 part 1, B): break each new EXCLUDE decision in gen-consumer.js one at a time and require the D454 row to go red. Restores the file
// byte for byte after every mutant and checks its sha256. Run from the d454-b worktree root: node <this>
'use strict';
const fs = require('fs'), crypto = require('crypto'), { spawnSync } = require('child_process');
const F = 'consonance/tools/gen-consumer.js', orig = fs.readFileSync(F), sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const H0 = sha(orig), src = orig.toString('utf8');
const row = (k) => new RegExp(`\\n  '${k.replace(/[.]/g, '\\.')}':\\n    '[^\\n]*',`);
const M = [
  ['M1 the d423-letters-swap.js row dropped (a workshop tool ships)', (s) => s.replace(row('consonance/tools/d423-letters-swap.js'), '')],
  ['M2 the mistake-bench-toolstub.js row dropped', (s) => s.replace(row('consonance/tools/mistake-bench-toolstub.js'), '')],
  ['M3 the worktree-sweep.test.js row dropped', (s) => s.replace(row('consonance/tools/worktree-sweep.test.js'), '')],
  ['M4 janitor-task.ps1 loses its UNREACHABLE: declaration', (s) => s.replace("'UNREACHABLE: no rule reaches .ps1 under tools/", "'no rule reaches .ps1 under tools/")],
  ['M5 the janitor-task.ps1 row dropped (absent, undecided)', (s) => s.replace(row('consonance/tools/janitor-task.ps1'), '')],
  ['M6 leftovers.js withheld (a product file excluded)', (s) => s.replace("  'consonance/tools/d423-letters-swap.js':", "  'consonance/tools/leftovers.js': 'x',\n  'consonance/tools/d423-letters-swap.js':")],
  ['M7 the claim-replay.js row reason emptied (excluded with no reason)', (s) => s.replace(/'the claim-check replay harness freezes[^\n]*',/, "'',")],
  ['M8 HANDLE_RE back to its 0.1.1 form (1C.1 unfixed)', (s) => s.replace(/const HANDLE_RE = \/[^\n]*\/gi;/, 'const HANDLE_RE = /(?<!github\\.com\\/)solariz3d|solariz3d(?!\\/[A-Za-z0-9_.-])/gi;')],
  ['M9 HANDLE_RE keeps ANY bare owner/repo, not only the project\'s own two', (s) => s.replace('(?!\\/(?:consonance|lighthouse)(?![A-Za-z0-9_-]))', '(?!\\/[A-Za-z0-9_-])')],
  ['M10 HANDLE_RE loses its profile-URL branch (github.com/solariz3d kept)', (s) => s.replace('|(?<=github\\.com\\/)solariz3d(?!\\/[A-Za-z0-9_.-])/gi', '/gi')],
  ['M11 a t180 research row dropped', (s) => s.replace(row('exo_memory/research/t180_math_tools_2026-09-28.md'), '')],
  ['M12 the units.js MANIFEST row dropped', (s) => s.replace("  { from: 'exo_memory/loop/claimrec/units.js', to: 'exo_memory/loop/claimrec/units.js', kind: 'code' },\n", '')],
  ['M13 the units.js SHIPS_FROM_PRIVATE row dropped (the whole file)', (s) => s.replace(/\n  'exo_memory\/loop\/claimrec\/units\.js': 'consonance\/hooks\/claim-check\.js loads[^\n]*/, ''), 'ALL'],
  ['M14 the janitor WORKSHOP row dropped', (s) => s.replace(/\n    'consonance\/tools\/janitor\.test\.js': \[\["test\('the prefixes[^\n]*/, '')],
  ['M15 a PRIVATE hit carries the matched line', (s) => s.replace("text: '(withheld: the line names what PRIV_PATTERN guards)'", 'text: lines[i]')],
  ['M16 privPattern never reads the variable', (s) => s.replace("const v = process.env.PRIV_PATTERN;", 'const v = null;')],
  ['M17 the dry-run refusal removed', (s) => s.replace("if (opts.dry && opts.requirePriv && !privPattern()) { report.refused = PRIV_UNSET; return report; }", '')],
  ['M18 the real-run refusal removed', (s) => s.replace("  if (opts.requirePriv && !privPattern()) { report.refused = PRIV_UNSET; return report; }\n", '')],
  ['M19 the command line stops requiring the guard', (s) => s.replace('{ dry, allowDirty, measured, requirePriv: true }', '{ dry, allowDirty, measured }')],
];
let applied = 0, caught = 0, notApplied = 0;
try {
  for (const [name, f, scope] of M.filter(([n]) => !process.env.MUT_ONLY || process.env.MUT_ONLY.split(',').includes(n.split(' ')[0]))) {
    const m = f(src);
    if (m === src) { notApplied++; console.log('NOT APPLIED  ' + name); continue; }
    applied++; fs.writeFileSync(F, m);
    const env = { ...process.env }; delete env.PRIV_PATTERN;
    const args = scope === 'ALL' ? ['--test', 'consonance/tools/gen-consumer.test.js'] : ['--test', '--test-name-pattern=D454', 'consonance/tools/gen-consumer.test.js'];
    const r = spawnSync(process.execPath, args, { encoding: 'utf8', env, maxBuffer: 1 << 26 });
    const red = r.status !== 0;
    if (red) caught++;
    console.log((red ? 'caught       ' : 'NOT CAUGHT   ') + name);
    fs.writeFileSync(F, orig);
  }
} finally { fs.writeFileSync(F, orig); }
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${notApplied}; restored sha256 ${sha(fs.readFileSync(F)) === H0 ? 'equal' : 'DIFFERS'}`);
