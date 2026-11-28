// mut271.js (pane B, L271): each mutant of the slope grab's line in app/core/zonegrab.js, applied to the worktree's file, app/test/zonegrab.test.js run (BelowNormal),
// then the file restored byte for byte (checked). usage: node mut271.js <tree> <out.txt>
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), { spawnSync } = require('child_process');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const [tree, out] = process.argv.slice(2), F = path.join(tree, 'app/core/zonegrab.js'), orig = fs.readFileSync(F);
const SLOPE = 'const v1 = [v0[0] + e * cx * cx, v0[1] + e * cx * cy + v], short =';
const M = [
  ['BASE c522ea6 (the drag whole, as today)', SLOPE, 'const v1 = [v0[0] + e, v0[1] + v], short ='],
  ['LITERAL D followChord (the whole drag projected onto the chord)', SLOPE, 'const tt = e * cx + v * cy, v1 = [v0[0] + tt * cx, v0[1] + tt * cy], short ='],
  ['M1 no rise along the slope', 'e * cx * cy + v]', 'v]'],
  ['M2 the pull whole across', 'v0[0] + e * cx * cx,', 'v0[0] + e,'],
  ['M3 the lift dropped', 'e * cx * cy + v]', 'e * cx * cy]'],
  ['M5 the share not squared', 'v0[0] + e * cx * cx,', 'v0[0] + e * cx,'],
];
const lines = [];
try {
  for (const [name, a, b] of M) {
    const t = orig.toString('utf8'); if (t.split(a).length !== 2) { lines.push(`${name}: NOT APPLIED`); continue; }
    fs.writeFileSync(F, t.replace(a, b));
    const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', 'app/test/zonegrab.test.js'], { cwd: tree, encoding: 'utf8' });
    const fails = (r.stdout.match(/^not ok \d+ - (row \S+)/gm) || []).map((x) => x.replace(/^not ok \d+ - /, ''));
    lines.push(`${name}: ${fails.length ? `CAUGHT by ${fails.join(', ')}` : 'NOT CAUGHT'}`);
  }
} finally { fs.writeFileSync(F, orig); }
lines.push(`restored: ${Buffer.compare(fs.readFileSync(F), orig) === 0}`);
fs.writeFileSync(out, lines.join('\n') + '\n'); console.log(lines.join('\n'));
