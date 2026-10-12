// D309 part 1: mutants on the STAMP only, on a COPY tree (G:/worktrees/c-d309-base at 6af6d01c with this build's two files copied in).
const fs = require('fs'), cp = require('child_process'), path = require('path');
const W = 'G:/worktrees/c-d309-wt', B = 'G:/worktrees/c-d309-base';
const FILES = ['consonance/tools/state-block.js', 'consonance/tools/state-block.test.js'];
for (const f of FILES) fs.copyFileSync(path.join(W, f), path.join(B, f));
const SB = 'consonance/tools/state-block.js';
const M = [
  ['C0 control', null, null],
  ['M1 the stamp line is not in the header', 'parts.push(st.line);', ''],
  ['M2 the UTC time ignores the injected clock', "'generated ' + t.toISOString().replace('.000Z', 'Z')", "'generated ' + new Date().toISOString().replace(/\\.\\d+Z$/, 'Z')"],
  ['M3 AM and PM swapped in the local time', "(h < 12 ? 'AM' : 'PM')", "(h < 12 ? 'PM' : 'AM')"],
  ['M4 the offset sign flipped', "(off < 0 ? '-' : '+')", "(off < 0 ? '+' : '-')"],
  ['M5 no section says as of', "(AS_OF.has(s.title) ? '  as of ' + st.hhmm : '')", "''"],
  ['M6 the section time is local, not UTC', "pad2(t.getUTCHours()) + ':' + pad2(t.getUTCMinutes())", "pad2(t.getHours()) + ':' + pad2(t.getMinutes())"],
  ['M7 render ignores opts.now', 'stampOf(opts.now || clock())', 'stampOf(clock())'],
  ['M8 the CLI ignores STATE_BLOCK_NOW', 'const t = e ? new Date(e) : new Date();', 'const t = new Date();'],
  ['M9 the name line is stamped too', "new Set(['repo', 'journal', 'instruments', 'triggers', 'live'])", "new Set(['repo', 'journal', 'instruments', 'triggers', 'live', 'name'])"],
  ['M10 the LIVE section is not stamped', "new Set(['repo', 'journal', 'instruments', 'triggers', 'live'])", "new Set(['repo', 'journal', 'instruments', 'triggers'])"],
];
const orig = fs.readFileSync(path.join(B, SB), 'utf8');
let applied = 0, caught = 0, na = 0;
for (const [name, from, to] of M) {
  if (from) { const n = orig.split(from).length - 1; if (n !== 1) { na++; console.log(`${name}: NOT APPLIED (anchor x${n})`); continue; } fs.writeFileSync(path.join(B, SB), orig.replace(from, () => to)); }
  const r = cp.spawnSync(process.execPath, ['--test', '--test-reporter=tap', 'consonance/tools/state-block.test.js'], { cwd: B, encoding: 'utf8', maxBuffer: 1 << 26 });
  const failed = [...String(r.stdout).matchAll(/^not ok (\d+) - (.{0,60})/gm)].map((m) => m[1]);
  if (from) { fs.writeFileSync(path.join(B, SB), orig); applied++; if (failed.length) caught++; }
  console.log(`${name}: ${failed.length ? 'caught by rows ' + failed.join(',') : 'SURVIVED'}`);
}
cp.execSync('git -C ' + B + ' checkout -q -- ' + FILES.join(' '));
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${na}; base dirty after: ${cp.execSync('git -C ' + B + ' status --short', { encoding: 'utf8' }).trim().split('\n').filter(Boolean).length}`);
