// D098 mutants, on a SCRATCH COPY of dev/shell (hooks + lib) - the live hooks are never mutated,
// and the installed ones are not these files anyway. Plus the null for the residue check, run with
// HOME/USERPROFILE pointed at a temp dir so "the real shell" it could pollute is a throwaway one.
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const R = 'C:/Users/nname/Desktop/lighthouse';
const W = path.join(__dirname, 'mut');
const run = (file, env) => {
  const r = spawnSync(process.execPath, ['--test', file], { encoding: 'utf8', env: { ...process.env, ...env } });
  const o = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, '');
  const n = (k) => Number((o.match(new RegExp(`^ℹ ${k} (\\d+)`, 'm')) || [])[1]);
  return { pass: n('pass'), fail: n('fail'), out: o };
};
function stage() {
  fs.rmSync(W, { recursive: true, force: true });
  fs.cpSync(`${R}/dev/shell/hooks`, `${W}/dev/shell/hooks`, { recursive: true });
  fs.cpSync(`${R}/dev/shell/lib`, `${W}/dev/shell/lib`, { recursive: true });
}
const T = () => `${W}/dev/shell/hooks/shell-dir-seam.test.js`;
function mutate(file, a, b) {
  const p = `${W}/dev/shell/hooks/${file}`; const s = fs.readFileSync(p, 'utf8');
  if (s.split(a).length !== 2) throw new Error(`anchor not once in ${file}: ${a}`);
  fs.writeFileSync(p, s.replace(a, b));
}
const NEW = 'process.env.CONSONANCE_SHELL_DIR ||', OLD = 'process.env.CONSONANCE_DATA ||';
stage(); console.log('control (scratch copy, unmutated)          ', JSON.stringify((({ pass, fail }) => ({ pass, fail }))(run(T()))));
const M = [
  ['M1 ready-stop back on CONSONANCE_DATA', () => mutate('ready-stop.js', NEW, OLD)],
  ['M2 ready-prompt back on CONSONANCE_DATA', () => mutate('ready-prompt.js', NEW, OLD)],
  ['M3 userprompt-submit back on CONSONANCE_DATA', () => mutate('userprompt-submit.js', NEW, OLD)],
  ['M4 session-end back (an UNEXECUTED hook)', () => mutate('session-end.js', NEW, OLD)],
  ['M5 l3-overseer keeps DATA as a fallback', () => mutate('l3-overseer.js', NEW, `${NEW} ${OLD}`)],
  ['M6 a hook file gone (sweep must notice)', () => fs.rmSync(`${W}/dev/shell/hooks/stop.js`)],
];
for (const [name, fn] of M) {
  stage(); fn();
  const r = run(T());
  console.log(`${name.padEnd(46)} ${JSON.stringify({ pass: r.pass, fail: r.fail })}  ${r.fail > 0 ? 'CAUGHT' : 'SURVIVED'}`);
}
// THE NULL for "residue stayed 26": dream-gate.test.js WITHOUT its new CONSONANCE_SHELL_DIR key must
// pollute the shell dir it believes is real. HOME is a temp dir, so the pollution lands there.
const home = fs.mkdtempSync(path.join(os.tmpdir(), 'd098-home-'));
const count = () => { const d = path.join(home, '.claude', 'shell'); if (!fs.existsSync(d)) return 0;
  return fs.readdirSync(d).filter((f) => /\.jsonl?$/.test(f))
    .reduce((n, f) => n + (fs.readFileSync(path.join(d, f), 'utf8').match(/sibling-gate-test/g) || []).length, 0); };
const dg = fs.readFileSync(`${R}/consonance/hooks/dream-gate.test.js`, 'utf8');
const key = '    CONSONANCE_SHELL_DIR: dataDir,\n';
if (dg.split(key).length !== 2) throw new Error('dream-gate key not once');
const dgDir = `${W}/consonance/hooks`; fs.mkdirSync(dgDir, { recursive: true });
// dream-gate resolves hooks relative to the repo; run the REAL file vs a copy with the key removed, both from the repo dir.
const dgMut = `${R}/consonance/hooks/.d098-null.dream-gate.test.js`;
try {
  for (const [label, text] of [['dream-gate WITH the key   ', dg], ['dream-gate WITHOUT the key', dg.replace(key, '')]]) {
    fs.writeFileSync(dgMut, text);
    const before = count();
    const r = run(dgMut, { HOME: home, USERPROFILE: home });
    console.log(`null: ${label}  test ${JSON.stringify({ pass: r.pass, fail: r.fail })}  residue rows in the temp HOME's shell: ${before} -> ${count()}`);
  }
} finally { fs.rmSync(dgMut, { force: true }); console.log('temp copy removed:', !fs.existsSync(dgMut)); }
