// D300 part 2: run one built test binary repeatedly and count the dirs_guard rows.
//   node runs.js <test exe> <cwd (src-tauri)> <full|module> <N> [extra args...]
// full   = the whole parallel binary (default threads, ignored rows excluded), as cargo test runs it
// module = only dirs_guard_tests (its three rows in parallel: the row's only competitor for TEST_SLOT)
// Prints one line per run and a tally. A run counts for the row only if the row's own line appears.
const { spawnSync } = require('child_process');
const [exe, cwd, mode, nStr, ...extra] = process.argv.slice(2);
const N = +nStr;
const ROW = 'dirs_guard_tests::a_panicking_writer_still_puts_dirs_back';
const SIB = 'dirs_guard_tests::a_writer_puts_dirs_back_when_it_finishes';
const args = (mode === 'module' ? ['dirs_guard_tests'] : []).concat(extra);
const t = { runs: 0, rowOk: 0, rowRed: 0, rowMissing: 0, sibRed: 0, otherRed: {} };
const t0 = Date.now();
for (let i = 1; i <= N; i++) {
  const s = Date.now();
  const r = spawnSync(exe, args, { cwd, encoding: 'utf8', maxBuffer: 1 << 28, timeout: 20 * 60 * 1000 });
  const out = (r.stdout || '') + (r.stderr || '');
  const res = (name) => { const m = out.match(new RegExp('^test ' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ' \\.\\.\\. (\\w+)', 'm')); return m ? m[1] : null; };
  const row = res(ROW), sib = res(SIB);
  const failed = [...out.matchAll(/^test (\S+) \.\.\. FAILED/gm)].map((m) => m[1]);
  t.runs++;
  if (row === 'ok') t.rowOk++; else if (row === 'FAILED') t.rowRed++; else t.rowMissing++;
  if (sib === 'FAILED') t.sibRed++;
  for (const f of failed) if (f !== ROW && f !== SIB) t.otherRed[f] = (t.otherRed[f] || 0) + 1;
  const summary = (out.match(/^test result: .*$/m) || ['(no result line)'])[0];
  console.log(`run ${i}: row ${row} sib ${sib} exit ${r.status}${r.signal ? ' ' + r.signal : ''} ${Date.now() - s} ms | ${summary}${failed.length ? ' | FAILED ' + failed.join(',') : ''}`);
  if (row === 'FAILED') console.log(out.split('\n').filter((l) => /panicked|slot set|a_panicking/.test(l)).slice(0, 6).join('\n'));
}
console.log(`TALLY ${mode} exe=${exe} args=${JSON.stringify(args)} runs ${t.runs}: row ok ${t.rowOk} / red ${t.rowRed} / missing ${t.rowMissing}; sibling red ${t.sibRed}; other reds ${JSON.stringify(t.otherRed)}; ${((Date.now() - t0) / 1000).toFixed(0)} s`);
