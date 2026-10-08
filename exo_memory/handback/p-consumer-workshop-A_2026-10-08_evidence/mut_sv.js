// node mut_sv.js : each mutant of second-vantage.js's world check must turn the history twin red; the unmutated tool must stay green.
const fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process');
const W = 'C:/Users/nname/Desktop/worktrees/a-l3-wt/consonance/tools/';
const tool = fs.readFileSync(W + 'second-vantage.js', 'utf8').replace(/\r\n/g, '\n'), test = fs.readFileSync(W + 'second-vantage.history.test.js', 'utf8');
const MUT = [
  ['S1 a DISAGREE surfaces without the claim-time check (moved is never set)', "moved = then.verdict !== 'DISAGREE'; // must disagree in BOTH worlds to surface", 'moved = false;'],
  ['S2 an unrebuildable claim-time tree lets the DISAGREE through', "return { checked: false, moved: true, claimHead: row.head, currentHead: cur,\n               note: 'claim-time tree unavailable; DISAGREE withheld' };", "return { checked: false, moved: false, claimHead: row.head, currentHead: cur,\n               note: 'claim-time tree unavailable; DISAGREE withheld' };"],
  ['S3 the claim-time worktree is never removed', "cp.spawnSync('git', ['worktree', 'remove', '--force', wt], { cwd: repoRoot, encoding: 'utf8' });", ''],
  ['S4 the claim-time reader is handed the CURRENT tree', 'const then = parseReader(spawner(brief(row, tier, wt), wt).raw || \'\');', 'const then = parseReader(spawner(brief(row, tier, repoRoot), repoRoot).raw || \'\');'],
  ['S5 equal heads still run the world check', 'if (!row.head || !cur || row.head === cur) {', 'if (!row.head || !cur) {'],
];
function run(label, body) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'mut-sv-')); fs.writeFileSync(path.join(d, 'second-vantage.js'), body); fs.writeFileSync(path.join(d, 'second-vantage.history.test.js'), test);
  const r = cp.spawnSync(process.execPath, ['--test', path.join(d, 'second-vantage.history.test.js')], { encoding: 'utf8' });
  fs.rmSync(d, { recursive: true, force: true });
  const out = (r.stdout || '').replace(/\x1b\[[0-9;]*m/g, ''); const fails = (out.match(/^✖ \d+:/gm) || []).map((s) => s.slice(2, -1));
  return { label, status: r.status, failedRows: [...new Set(fails)] };
}
const rows = [run('UNMUTATED', tool)];
for (const [label, a, b] of MUT) { const i = tool.indexOf(a); if (i < 0) { rows.push({ label, error: 'anchor not found' }); continue; } rows.push(run(label, tool.replace(a, () => b))); }
for (const r of rows) console.log(r.error ? `${r.label}: ${r.error}` : `${r.label}: exit ${r.status} ${r.status === 0 ? '(GREEN)' : 'CAUGHT by rows ' + r.failedRows.join(',')}`);
const survived = rows.slice(1).filter((r) => r.error || r.status === 0);
console.log(survived.length ? 'SURVIVED/ERROR: ' + survived.map((r) => r.label).join(' | ') : 'all mutants caught');
