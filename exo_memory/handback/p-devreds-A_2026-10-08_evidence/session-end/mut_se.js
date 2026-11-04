// node mut_se.js : each mutant of session-end.js's reader must turn the rows red (rows 1-3 and 5 only; the 560 MB rows are not re-run per mutant); the unmutated hook stays green.
const fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process');
const W = 'C:/Users/nname/Desktop/worktrees/a-se-wt/dev/shell/hooks/';
const hook = fs.readFileSync(W + 'session-end.js', 'utf8').replace(/\r\n/g, '\n'), test = fs.readFileSync(W + 'session-end.test.js', 'utf8');
const MUT = [
  ['E1 the newline is searched in the whole buffer (stale bytes past the read)', 'const nl = view.indexOf(0x0a, start);', 'const nl = buf.indexOf(0x0a, start);'],
  ['E2 the last line without a newline is dropped', '    if (!stop && carry.length) emit(Buffer.concat(carry));\n', ''],
  ['E3 reading never stops at the first human line', "      found = flat.length > 160 ? flat.slice(0, 160) + '...' : flat;\n      return true;", "      found = found || (flat.length > 160 ? flat.slice(0, 160) + '...' : flat);\n      return false;"],
  ['E4 the unfinished tail is aliased, not copied', 'carry.push(Buffer.from(view.subarray(start)));', 'carry.push(view.subarray(start));'],
  ['E5 a split line is decoded piece by piece', 'emit(carry.length === 1 ? carry[0] : Buffer.concat(carry)); carry = [];', 'if (carry.length === 1) emit(carry[0]); else { const t = carry.map((b) => b.toString("utf8")).join(""); if (fn(t) === true) stop = true; } carry = [];'],
  ['E6 the whole file is read again as one string', "    eachLine(transcriptPath, (line) => {", "    fs.readFileSync(transcriptPath, 'utf8').split('\\n').some((line) => {"],
  ['E7 the dream anti-instruction no longer ends the search', "if (text.startsWith('This is a gap-dream cycle')) return true;", "if (text.startsWith('This is a gap-dream cycle')) return false;"],
  ['E8 tag machinery is no longer skipped', "if (text.startsWith('<')) return false; ", "if (false) return false; "],
  ['E9 a missing file throws out of the hook', "if (!transcriptPath || !fs.existsSync(transcriptPath)) return null;", "if (!transcriptPath) return null;"],
];
function run(label, body, pattern) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'mut-se-')); fs.writeFileSync(path.join(d, 'session-end.js'), body); fs.writeFileSync(path.join(d, 'session-end.test.js'), test);
  const args = ['--test', ...(pattern ? ['--test-name-pattern=' + pattern] : []), path.join(d, 'session-end.test.js')];
  const r = cp.spawnSync(process.execPath, args, { encoding: 'utf8', timeout: 240000 });
  fs.rmSync(d, { recursive: true, force: true });
  const out = (r.stdout || '').replace(/\x1b\[[0-9;]*m/g, ''); const fails = (out.match(/^✖ [^\n]{0,60}/gm) || []).filter((x) => !/failing tests/.test(x));
  return { label, status: r.status, failed: [...new Set(fails)].map((x) => x.slice(2, 6)) };
}
const rows = [run('UNMUTATED (all rows incl. the 560 MB ones)', hook, null)];
const FAST = '^(1|1e|2|2b|3|5):';
for (const [label, a, b] of MUT) { const i = hook.indexOf(a); if (i < 0) { rows.push({ label, error: 'anchor not found' }); continue; } rows.push(run(label, hook.replace(a, () => b), FAST)); }
for (const r of rows) console.log(r.error ? `${r.label}: ${r.error}` : `${r.label}: exit ${r.status} ${r.status === 0 ? '(GREEN)' : 'CAUGHT by rows ' + r.failed.join(' ')}`);
const survived = rows.slice(1).filter((r) => r.error || r.status === 0);
console.log(survived.length ? 'SURVIVED/ERROR: ' + survived.map((r) => r.label).join(' | ') : 'all mutants caught');
