// g2_reasons.js: the words the user would see on G2's three false positives (uses the dirs g2.js planted; plants nothing, deletes nothing)
const { hook, bash, BASE, path } = require('./lib.js');
const fw = (p) => p.replace(/\\/g, '/');
const projA = path.join(BASE, 'cdtest', 'A'), projB = path.join(BASE, 'cdtest', 'B');
const cases = [
  ['5b  cd <clean A> && rm -rf build   (session cwd = B)', `cd ${fw(projA)} && rm -rf build`, projB],
  ['6a  rm -rf logs/*.log', 'rm -rf logs/*.log', path.join(BASE, 'globtest')],
  ['7a  heredoc body', `cat > f.sh <<'EOF'\nrm -rf ${fw(path.join(projB, 'build'))}\nEOF`, BASE],
];
for (const [label, cmd, cwd] of cases) {
  const h = hook('delete-gate', bash(cmd, cwd));
  const r = (h.reason || '').split('\n');
  console.log(`${label}\n   decision: ${h.deny ? 'deny' : 'allow'}\n   reason line 1: ${r[0].slice(0, 160)}...\n   link named: ${(r[1] || '').trim().slice(0, 200)}\n`);
}
