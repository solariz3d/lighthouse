// h6check.js (pane B, L264): one candidate mutant read against the hold's rows on a temporary copy (src/, tools/, app/ without tests, plus the row file), to see
// whether it is caught or is equivalent before it goes into the harness. Never edits the tree. usage: node h6check.js <tree> <file> <from> <to>
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const [tree, file, from, to] = process.argv.slice(2), T = path.resolve(tree);
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 't180-l264-h6-'));
try {
  for (const d of ['src', 'tools']) fs.cpSync(path.join(T, d), path.join(dir, d), { recursive: true });
  fs.cpSync(path.join(T, 'app'), path.join(dir, 'app'), { recursive: true, filter: (p) => !/[\\/]app[\\/](test|node_modules)([\\/]|$)/.test(p) });
  fs.mkdirSync(path.join(dir, 'app/test'), { recursive: true }); fs.copyFileSync(path.join(T, 'app/test/core-width-hold.test.js'), path.join(dir, 'app/test/core-width-hold.test.js'));
  const f = path.join(dir, file), s = fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n'), n = s.split(from).length - 1;
  if (n !== 1) throw new Error(`NOT APPLIED: ${n} times`);
  fs.writeFileSync(f, s.replace(from, () => to));
  const r = spawnSync(process.execPath, ['--test', path.join(dir, 'app/test/core-width-hold.test.js')], { cwd: dir, encoding: 'utf8' });
  const out = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, ''), k = (x) => (out.match(new RegExp(`ℹ ${x} (\\d+)`)) || [])[1];
  console.log(`applied; tests ${k('tests')}, pass ${k('pass')}, fail ${k('fail')}`);
  for (const l of out.split('\n').filter((l) => /^not ok|✖/.test(l.trim())).slice(0, 6)) console.log('  ' + l.trim().slice(0, 160));
} finally { fs.rmSync(dir, { recursive: true, force: true }); }
