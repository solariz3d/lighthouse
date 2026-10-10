// D100 mutants (pane E): mutate a COPY of second-vantage.js beside a copy of its test, run the D100 tests.
// (The copy sits outside the repo, so the three tests that need git history in REPO cannot run here; the D100
//  tests are the ones that pin this change, and they are location-independent.)
const fs = require('fs'), path = require('path'), cp = require('child_process');
const F = path.join(__dirname, 'w', 'consonance', 'tools', 'second-vantage.js');
const T = F.replace(/\.js$/, '.test.js');
const live = fs.readFileSync(F, 'utf8');
const NL = live.includes('\r\n') ? '\r\n' : '\n';
const rows = [
  ['pre-flight', null],
  ['default cell back inside the data dir', ["const DEFAULT_CELL = path.join(require('os').tmpdir(), 'consonance', 'vantage_cell');", "const DEFAULT_CELL = path.join(DATA, 'vantage_cell');"]],
  ['the default cell is no longer emptied', ['      fs.rmSync(CELL, { recursive: true, force: true });\n', '']],
  ['an operator-chosen cell is emptied too', ['    if (path.resolve(CELL) === path.resolve(DEFAULT_CELL)) {\n      fs.rmSync', '    if (true) {\n      fs.rmSync']],
  ['the VANTAGE_CELL override is ignored', ['const CELL = process.env.VANTAGE_CELL || DEFAULT_CELL;', 'const CELL = DEFAULT_CELL;']],
  ['EXPECTED SURVIVOR: the still-not-empty refusal removed', ['&& fs.readdirSync(CELL).length) {', '&& false) {']],
  ['EXPECTED SURVIVOR: spawnReaderReal ignores a failed prepare', ['  if (!cell.ok) return { failed: true,', '  if (false) return { failed: true,']],
];
let n = 0, k = 0;
for (const [name, m] of rows) {
  let src = live;
  if (m) {
    const a = m[0].split('\n').join(NL), b = m[1].split('\n').join(NL);
    if (src.split(a).length !== 2) { fs.writeFileSync(F, live); console.log('ANCHOR NOT UNIQUE:', name); process.exit(2); }
    src = src.replace(a, b); n++;
  }
  fs.writeFileSync(F, src);
  const o = cp.spawnSync(process.execPath, ['--test', '--test-name-pattern=D100', T], { encoding: 'utf8' }).stdout.replace(/\x1b\[[0-9;]*m/g, '');
  const p = (o.match(/pass (\d+)/) || [])[1], f = (o.match(/fail (\d+)/) || [])[1];
  const v = !m ? (f === '0' ? 'GREEN ' : 'PREFLIGHT-RED') : (f && f !== '0' ? 'KILLED' : 'SURVIVED');
  if (m && v === 'KILLED') k++;
  console.log(`${v}  ${p}/${f}  ${name}`);
}
fs.writeFileSync(F, live);
console.log(`${n} listed · ${k} killed · ${n - k} survived`);
