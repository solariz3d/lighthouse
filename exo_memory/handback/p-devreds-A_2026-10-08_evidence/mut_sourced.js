// node mut_sourced.js : each mutant of sourced.js's chunked reader must turn the new rows red; the unmutated tool stays green. (The live-transcript row is skipped via --test-name-pattern.)
const fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process');
const W = 'C:/Users/nname/Desktop/worktrees/a-dr-wt/consonance/tools/';
const tool = fs.readFileSync(W + 'sourced.js', 'utf8').replace(/\r\n/g, '\n'), test = fs.readFileSync(W + 'sourced.test.js', 'utf8');
const MUT = [
  ['Z1 the newline is searched in the whole buffer (stale bytes past the read)', 'const nl = view.indexOf(0x0a, start);', 'const nl = buf.indexOf(0x0a, start);'],
  ['Z2 the last line without a newline is dropped', '    if (carry.length) emit(Buffer.concat(carry));\n', ''],
  ['Z3 a line split across chunks keeps only its first piece', 'emit(carry.length === 1 ? carry[0] : Buffer.concat(carry)); carry = [];', 'emit(carry[0]); carry = [];'],
  ['Z4 the unfinished tail is aliased, not copied (overwritten by the next read)', 'carry.push(Buffer.from(view.subarray(start)));', 'carry.push(view.subarray(start));'],
  ['Z5 a line split across chunks is decoded piece by piece (a character cut in half)', 'emit(carry.length === 1 ? carry[0] : Buffer.concat(carry)); carry = [];', 'if (carry.length === 1) emit(carry[0]); else fn(carry.map((b) => b.toString("utf8")).join("")); carry = [];'],
  ['Z6 CRLF is not tolerated (a trailing \\r reaches JSON.parse as a non-space)', 'let r; try { r = JSON.parse(line); } catch { return; }', 'let r; try { r = JSON.parse(line.replace(/\\r$/, "#")); } catch { return; }'],
];
function run(label, body) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'mut-src-')); fs.writeFileSync(path.join(d, 'sourced.js'), body); fs.writeFileSync(path.join(d, 'sourced.test.js'), test);
  const r = cp.spawnSync(process.execPath, ['--test', '--test-name-pattern=turns\\(\\) agrees|an empty file|eachLine', path.join(d, 'sourced.test.js')], { encoding: 'utf8' });
  fs.rmSync(d, { recursive: true, force: true });
  const out = (r.stdout || '').replace(/\x1b\[[0-9;]*m/g, ''); const fails = (out.match(/^✖ [^\n]{0,70}/gm) || []).filter((x) => !/failing tests/.test(x));
  return { label, status: r.status, failed: [...new Set(fails)].map((x) => x.slice(2)) };
}
const rows = [run('UNMUTATED', tool)];
for (const [label, a, b] of MUT) { const i = tool.indexOf(a); if (i < 0) { rows.push({ label, error: 'anchor not found' }); continue; } rows.push(run(label, tool.replace(a, () => b))); }
for (const r of rows) console.log(r.error ? `${r.label}: ${r.error}` : `${r.label}: exit ${r.status} ${r.status === 0 ? '(GREEN)' : 'CAUGHT by ' + r.failed.length + ' row(s)'}`);
const survived = rows.slice(1).filter((r) => r.error || r.status === 0);
console.log(survived.length ? 'SURVIVED/ERROR: ' + survived.map((r) => r.label).join(' | ') : 'all mutants caught');
