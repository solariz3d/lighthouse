// B, L221 R4: pictures of the run's screen, mid-run and at its end, before any install. The ledgers below go through the REAL
// close_small::progress/to_json (the scratch crate's print row), and the REAL ui/close-small.js and ui/app.css draw them in Edge headless.
//   node pictures.js <worktree>
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const WT = process.argv[2], HERE = __dirname, OUT = path.join(HERE, 'pictures');
fs.mkdirSync(OUT, { recursive: true });
const iso = (msAgo) => new Date(Date.now() - msAgo).toISOString();
const names = { a: 'A', b: 'B', lib: 'librarian', main: 'main', tp: 'Third Place' };
const click = (cut) => ({ event: 'click', cut, dropped: [], names, t: iso(300000) });
const stage = (pane, s, ago, detail) => ({ event: 'stage', pane, stage: s, detail: detail || '', t: iso(ago) });
const seat = (pane, outcome, ago) => ({ event: 'seat', pane, outcome, t: iso(ago) });
const mid = [
  click(['a', 'b', 'lib', 'main', 'tp']),
  stage('a', 'asked', 299000), stage('b', 'asked', 299000), stage('lib', 'asked', 299000, 'queued behind its current turn or his typing'),
  stage('main', 'asked', 299000), stage('tp', 'asked', 299000),
  stage('a', 'answering', 290000), stage('a', 'compacting', 250000),
  seat('a', 'cut: the transcript records the manual compaction, 412k before, 18k after', 160000),
  stage('main', 'answering', 280000), stage('main', 'compacting', 200000),
  seat('main', 'cut: the transcript records the manual compaction, 503k before, 21k after', 60000),
  stage('b', 'answering', 270000), stage('b', 'compacting', 41000),
  stage('tp', 'answering', 30000),
];
const end = [
  ...mid.slice(0, -2),
  stage('b', 'compacting', 120000),
  seat('b', 'cut: the transcript records the manual compaction, 406k before, 17k after', 20000),
  stage('tp', 'answering', 100000), stage('tp', 'compacting', 60000),
  seat('tp', 'cut: the transcript records the manual compaction, 331k before, 15k after', 10000),
  seat('lib', 'NOT cut: its turn after the ask did not end within 20 min', 5000),
  { event: 'done', t: iso(4900) },
];
function viaRust(rows) {
  const f = path.join(HERE, 'fixture.jsonl');
  fs.writeFileSync(f, rows.map((r) => JSON.stringify(r)).join('\n'));
  const r = spawnSync('cargo', ['test', '--lib', '--offline', 'print_progress', '--', '--nocapture'], { cwd: path.join(HERE, 'mini'), env: { ...process.env, CARGO_TARGET_DIR: 'C:/build/b-mini-target', L221_FIXTURE: f }, encoding: 'utf8' });
  const m = (r.stdout || '').match(/^PROGRESS (.*)$/m);
  if (!m) throw new Error('no PROGRESS line:\n' + r.stdout + r.stderr);
  return JSON.parse(m[1]);
}
const term = fs.readFileSync(path.join(WT, 'consonance/ui/term.js'), 'utf8');
const escapeSrc = term.match(/function escapeHtml\(s\) \{[^\n]*\}/)[0];
const css = fs.readFileSync(path.join(WT, 'consonance/ui/app.css'), 'utf8');
const js = fs.readFileSync(path.join(WT, 'consonance/ui/close-small.js'), 'utf8');
function picture(name, progress, how) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body style="background:#0B0E14">
<button id="closesmall">Compact warm seats</button>
<div id="close-small" hidden><div class="stick-body"></div></div>
<script>${escapeSrc}
const P = ${JSON.stringify(progress)};
let H = null;
window.__TAURI__ = { event: { listen: (n, fn) => { if (n === 'close-small') H = fn; } } };
async function inv(cmd) { if (cmd === 'close_small_progress') return P; throw 'not in this picture'; }
</script>
<script>${js}</script>
<script>${how === 'event' ? 'H({ payload: P });' : "document.getElementById('closesmall').click();"}</script>
</body></html>`;
  const page = path.join(OUT, name + '.html');
  fs.writeFileSync(page, html);
  const png = path.join(OUT, name + '.png');
  const r = spawnSync('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', ['--headless', '--disable-gpu', '--hide-scrollbars', '--window-size=1100,520', '--virtual-time-budget=2000', `--screenshot=${png}`, 'file:///' + page.replace(/\\/g, '/')], { encoding: 'utf8', timeout: 60000 });
  console.log(name + ': ' + (fs.existsSync(png) ? png : 'NO PICTURE ' + r.stderr));
}
// mid-run is a run not finished: the button opens the run (close_small_progress), never a new list
picture('l221_mid_run', viaRust(mid));
// the end: the run's done row; the button shows it too (the event would have shown it with root unhidden)
const done = viaRust(end);
picture('l221_end', done, 'event');
fs.writeFileSync(path.join(OUT, 'payloads.json'), JSON.stringify({ mid: viaRust(mid), end: done }, null, 2));
