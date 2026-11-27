// tapfails.js (pane B, L258): the failing rows of a node --test TAP file (top-level "not ok" not marked # TODO), each with its file, line and the first
// lines of its error and diagnostics. usage: node tapfails.js <file.tap> [maxLines]
'use strict';
const fs = require('fs');
const [file, maxArg] = process.argv.slice(2), max = Number(maxArg) || 6;
const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
let n = 0;
for (let i = 0; i < lines.length; i++) {
  const m = /^not ok (\d+) - (.*)$/.exec(lines[i]);
  if (!m || /# TODO/.test(m[2]) || /# SKIP/.test(m[2])) continue;
  n++;
  const block = [];
  for (let j = i + 1; j < lines.length && !/^(not )?ok \d+ - /.test(lines[j]) && !/^# Subtest/.test(lines[j]); j++) block.push(lines[j]);
  const loc = (block.find((l) => /^\s+location:/.test(l)) || '').replace(/^\s+location:\s*/, '').replace(/^'|'$/g, '');
  const errAt = block.findIndex((l) => /^\s+error:/.test(l));
  const err = errAt >= 0 ? block.slice(errAt, errAt + max).map((l) => l.trim()).join(' | ') : '(no error line)';
  const diag = lines.slice(Math.max(0, i - 40), i).filter((l) => /^# /.test(l) && !/^# Subtest/.test(l)).slice(-2).join(' | ');
  console.log(`#${m[1]} ${m[2].slice(0, 140)}\n   at ${loc.replace(/\\\\/g, '\\').replace(/^.*?[\\/](app[\\/]test|test)[\\/]/, (x, d) => d.replace(/\\/g, '/') + '/')}\n   ${err.slice(0, 700)}${diag ? `\n   diag: ${diag.slice(0, 300)}` : ''}`);
}
console.log(`failing rows: ${n}`);
