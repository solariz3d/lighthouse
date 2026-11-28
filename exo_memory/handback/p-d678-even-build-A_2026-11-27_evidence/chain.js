// D678's verification chain, run under one heavy-run hold: each GROUP is one `node --test` call in the worktree; its whole output goes to OUTDIR/<name>.out and
// one summary line per group to stdout (tests, pass, fail, skipped, todo; for a mutation harness the mutant tests' verdicts by kind).
// usage: node chain.js <tree> <outdir> <group> [<group> ...]   where a group is  name=file1,file2,...  or  name=@listfile
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const [TREE, OUT, ...groups] = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });
for (const g of groups) {
  const i = g.indexOf('='), name = g.slice(0, i), spec = g.slice(i + 1);
  const files = spec.startsWith('@') ? fs.readFileSync(spec.slice(1), 'utf8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : spec.split(',');
  const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_TEST_CONTEXT'));
  const t0 = new Date().toISOString();
  const r = spawnSync(process.execPath, ['--max-old-space-size=4096', '--test', ...files], { cwd: TREE, env, encoding: 'utf8', maxBuffer: 1 << 30, windowsHide: true });
  const out = ((r.stdout || '') + (r.stderr || '')).replace(/\x1b\[[0-9;]*m/g, '');
  fs.writeFileSync(path.join(OUT, name + '.out'), out);
  const n = (k) => Number((out.match(new RegExp(`ℹ ${k} (\\d+)`, 'g')) || []).map((x) => x.split(' ').pop()).pop());
  const mut = out.split('\n').filter((l) => /^[✔✖] mutant /.test(l));
  const notApplied = (out.match(/NOT APPLIED/g) || []).length, notCaught = (out.match(/NOT CAUGHT/g) || []).length;
  console.log(JSON.stringify({ name, files: files.length, started: t0, ended: new Date().toISOString(), exit: r.status, tests: n('tests'), pass: n('pass'), fail: n('fail'), skipped: n('skipped'), todo: n('todo'),
    ...(mut.length ? { mutantTests: mut.length, mutantPass: mut.filter((l) => l.startsWith('✔')).length, notAppliedMentions: notApplied, notCaughtMentions: notCaught } : {}) }));
}
