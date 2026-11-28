// r25.js (pane B, L271 amendment): row 25 of core-pieces-ui on the branch, then under each mutant of follow's line (applied to zonegrab.js, restored byte for byte).
// usage: node r25.js <tree> <out.txt>
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), { spawnSync } = require('child_process');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const [tree, out] = process.argv.slice(2), F = path.join(tree, 'app/core/zonegrab.js'), orig = fs.readFileSync(F);
const SLOPE = 'const v1 = [v0[0] + e * cx * cx, v0[1] + e * cx * cy + v], short =';
const M = [
  ['BRANCH (no mutant)', null, null],
  ['M2 the pull whole across (rise kept)', 'v0[0] + e * cx * cx,', 'v0[0] + e,'],
  ['BASE c522ea6 line (the drag whole)', SLOPE, 'const v1 = [v0[0] + e, v0[1] + v], short ='],
  ['M1 no rise along the slope', 'e * cx * cy + v]', 'v]'],
  ['M5 the share not squared', 'v0[0] + e * cx * cx,', 'v0[0] + e * cx,'],
  ['M7 down the slope instead of up', 'e * cx * cy + v]', '-e * cx * cy + v]'],
  ['LITERAL D followChord', SLOPE, 'const tt = e * cx + v * cy, v1 = [v0[0] + tt * cx, v0[1] + tt * cy], short ='],
];
const lines = [];
try {
  for (const [name, a, b] of M) {
    const t = orig.toString('utf8');
    if (a) { if (t.split(a).length !== 2) { lines.push(`${name}: NOT APPLIED`); continue; } fs.writeFileSync(F, t.replace(a, b)); }
    const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', '--test-name-pattern=row 25 ', 'app/test/core-pieces-ui.test.js'], { cwd: tree, encoding: 'utf8' });
    const counts = (r.stdout.match(/^# (pass|fail) \d+/gm) || []).join(' '), err = (r.stdout.match(/^\s+error: (.*)$/m) || ['', ''])[1];
    lines.push(`${name}: ${counts}${err ? ` | ${err}` : ''}`);
    if (a) fs.writeFileSync(F, orig);
  }
} finally { fs.writeFileSync(F, orig); }
lines.push(`restored: ${Buffer.compare(fs.readFileSync(F), orig) === 0}`);
fs.writeFileSync(out, lines.join('\n') + '\n'); console.log(lines.join('\n'));
