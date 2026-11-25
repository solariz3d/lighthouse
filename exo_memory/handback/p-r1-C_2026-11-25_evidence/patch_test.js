// patch_test.js: adds the R1 fixture seam and the R1 exclusion row to install-only.test.js (run from the worktree root)
const fs = require('fs'), f = 'consonance/tools/install-only.test.js';
let s = fs.readFileSync(f, 'utf8');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
const L = (lines) => lines.join(nl);
function once(anchor, repl) {
  const i = s.indexOf(anchor);
  if (i < 0 || s.indexOf(anchor, i + 1) >= 0) throw new Error('anchor not unique: ' + anchor);
  s = s.slice(0, i) + repl + s.slice(i + anchor.length);
}
once('function mkRepo(mutate) {', L([
  "// R1 (2026-11-25, pane C): the keeper's green light took the second reader and its note off, as `Excluded` entries. Some thirty rows below use the",
  '// reader as their FIXTURE for -Only and matcher-group mechanics, not as the thing under test, so the copy drops that one exclusion unless a row',
  '// asks to keep it (`keepR1`). The exclusion itself is asserted by the R1 row at the end, which keeps it.',
  "const R1_EXCLUSION = /;\\s*Excluded = 'R1 2026-11-25[^']*'/g;",
  'function mkRepo(mutate, { keepR1 = false } = {}) {',
]));
once('  if (mutate) body = mutate(body);', L([
  "  if (!keepR1) body = body.replace(R1_EXCLUSION, '');",
  '  if (mutate) body = mutate(body);',
]));
once('console.log(`\\n${pass} passed, ${fail} failed`);', L([
  '// R1 (2026-11-25): the second reader and its note are Excluded (the keeper, 09:33: "if you want to fix all those I give the green light fully";',
  '// exo_memory/handback/p-r1-C_2026-11-25.md). No run registers them, bare or -Only, and the run says so. Red before the two entries were marked.',
  "test('R1: the second reader and its note are excluded: a bare run and an -Only run of all three register neither, and say so', () => {",
  "  const real = fs.readFileSync(path.join(REPO, 'dev', 'shell', 'install.ps1'), 'utf8');",
  "  assert.strictEqual((real.match(R1_EXCLUSION) || []).length, 2, 'install.ps1 must carry the R1 exclusion on exactly the two entries');",
  '  const repo = mkRepo(null, { keepR1: true });',
  "  for (const args of [[], ['-Only', 'second-reader.js,second-reader-worker.js,second-reader-note.js']]) {",
  '    const home = mkHome(), r = run(repo, home, args);',
  "    assert.strictEqual(count(home, 'second-reader.js'), 0, JSON.stringify(args) + ' registered the second reader: ' + JSON.stringify(commands(home)));",
  "    assert.strictEqual(count(home, 'second-reader-note.js'), 0, JSON.stringify(args) + ' registered the note: ' + JSON.stringify(commands(home)));",
  "    assert.ok(/(EXCLUDED|SKIPPED)[^\\n]*second-reader\\.js/.test(r.out) && /(EXCLUDED|SKIPPED)[^\\n]*second-reader-note\\.js/.test(r.out), 'the run must say it skipped them:\\n' + r.out);",
  '  }',
  '});',
  '',
  'console.log(`\\n${pass} passed, ${fail} failed`);',
]));
fs.writeFileSync(f, s);
console.log('patched');
