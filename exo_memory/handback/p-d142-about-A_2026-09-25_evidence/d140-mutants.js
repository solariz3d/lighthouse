// D140 mutants for consonance/ui/about-readme.test.js, each on COPIES of README.md + consonance/ui/index.html.
// MUTANTS must turn the test red; CONTROLS (formatting only) must keep it green.
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const REPO = 'C:/Users/nname/Desktop/lighthouse';
const LIVE = [REPO + '/README.md', REPO + '/consonance/ui/index.html'];
const before = LIVE.map((f) => fs.readFileSync(f, 'utf8'));
const R = 'README.md', H = 'consonance/ui/index.html';
const lf = (s) => s.replace(/\r\n/g, '\n');
const M = [
  // [name, file, from, to, expect: 'red' | 'green']
  ['M1 one README word changed', R, 'Each conversation starts as a stranger', 'Each conversation starts as a visitor', 'red'],
  ['M2 one About word changed', H, 'Each conversation starts as a stranger', 'Each conversation starts as a newcomer', 'red'],
  ['M3 one About word dropped', H, 'It hedges so it sounds careful.', 'It hedges so it sounds.', 'red'],
  ['M4 one README word added', R, 'It builds what you would want', 'It builds what you would really want', 'red'],
  ['M5 two About words swapped', H, 'how long it was gone.', 'how long was it gone.', 'red'],
  ['M6 one About punctuation mark changed', H, 'agreed with 8.', 'agreed with 8,', 'red'],
  ['M7 a whole About list item dropped', H, /\n\s*<li><b>Notes you don't have to keep\.<\/b>[^\n]*<\/li>/, '', 'red'],
  ['M8 the About end marker removed', H, '<!-- about:end -->', '', 'red'],
  ['M9 a live link in the About block', H, '<span class="aboutlink" title="https://github.com/solariz3d/lighthouse">', '<span class="aboutlink" href="https://github.com/solariz3d/lighthouse">', 'red'],
  ['M11 D142: the About tagline changed', H, '<p class="tagline">Instances, in concert.</p>', '<p class="tagline">Instances, together.</p>', 'red'],
  ['M12 D142: one word of the About lead line changed', H, 'instead of echoing one voice.</p>', 'instead of repeating one voice.</p>', 'red'],
  ['M13 D142: one word of the README lead line changed', R, 'instead of echoing one voice.**', 'instead of copying one voice.**', 'red'],
  ['M10 a README heading renamed', R, '## What it does for you', '## What it does', 'red'],
  ['K1 CONTROL: the README in CRLF', R, null, 'CRLF', 'green'],
  ['K2 CONTROL: an About paragraph re-wrapped', H, 'It settles questions that are still open.', 'It settles questions\n              that are still open.', 'green'],
  ['K3 CONTROL: index.html in CRLF', H, null, 'CRLF', 'green'],
];
const t = { listed: M.length, applied: 0, caught: 0, survived: [], na: [], nr: [], controlsOk: 0, controlsBad: [] };
for (const [name, file, from, to, expect] of M) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'd140m-'));
  fs.mkdirSync(path.join(root, 'consonance/ui'), { recursive: true });
  fs.copyFileSync(LIVE[0], path.join(root, R));
  fs.copyFileSync(LIVE[1], path.join(root, H));
  fs.copyFileSync(REPO + '/consonance/ui/about-readme.test.js', path.join(root, 'consonance/ui/about-readme.test.js'));
  const f = path.join(root, file);
  let src = lf(fs.readFileSync(f, 'utf8'));
  if (to === 'CRLF') src = src.replace(/\n/g, '\r\n');
  else {
    const hits = typeof from === 'string' ? src.split(from).length - 1 : (src.match(new RegExp(from.source, 'g')) || []).length;
    if (hits < 1) { t.na.push(name); console.log('NOT APPLIED', name); continue; }
    src = src.replace(from, to);
  }
  fs.writeFileSync(f, src); t.applied++;
  const r = spawnSync(process.execPath, [path.join(root, 'consonance/ui/about-readme.test.js')], { encoding: 'utf8' });
  const m = /(\d+) passed, (\d+) failed/.exec(r.stdout || '');
  if (!m) { t.nr.push(name); console.log('NO RESULT', name, (r.stderr || '').slice(-200)); continue; }
  const red = +m[2] > 0;
  if (expect === 'red') { if (red) { t.caught++; console.log('caught  ', name, `(${m[2]} red)`); } else { t.survived.push(name); console.log('SURVIVED', name); } }
  else if (!red) { t.controlsOk++; console.log('green   ', name); } else { t.controlsBad.push(name); console.log('CONTROL RED', name, (r.stdout.match(/FAIL[^\n]*\n[^\n]*/) || [''])[0]); }
}
const mut = M.filter((x) => x[4] === 'red').length;
console.log(`mutants: ${mut} listed · ${t.caught + t.survived.length} applied · ${t.caught} caught · ${t.survived.length} survived · ` +
  `${t.na.length} NOT APPLIED · ${t.nr.length} NO RESULT | controls: ${M.length - mut} listed · ${t.controlsOk} green · ${t.controlsBad.length} red | ` +
  `live files ${LIVE.every((p, i) => fs.readFileSync(p, 'utf8') === before[i]) ? 'unchanged' : 'CHANGED'}`);
