// B, L233 R5: pictures of the top bar in each situation, for his eye before any build he runs. The page is the app's own: the
// top bar's markup cut whole from ui/index.html, ui/app.css, term.js's escapeHtml, and ui/next-move.js run for real (its start()
// polls next_move_facts, answered here by a stub with the situation's facts). Edge headless draws it.
//   node pictures.js <worktree>
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const WT = process.argv[2], OUT = path.join(__dirname, 'pictures');
fs.mkdirSync(OUT, { recursive: true });
const ui = (f) => fs.readFileSync(path.join(WT, 'consonance/ui', f), 'utf8');
const index = ui('index.html');
const from = index.indexOf('  <div id="topbar">'), to = index.indexOf('\n  </div>\n', from) + '\n  </div>\n'.length;
if (from < 0 || to < from) throw new Error('the top bar was not found in index.html');
const topbar = index.slice(from, to);
const escapeSrc = ui('term.js').match(/function escapeHtml\(s\) \{[^\n]*\}/)[0];
const css = ui('app.css'), js = ui('next-move.js');
const base = { builtAt: '02:38', big: 300000, warmMin: 50, newerBuild: false, working: [], compactList: [] };
const SITUATIONS = [
  ['1_nothing_owed', {}],
  ['2_compact', { compactList: ['A', 'chair'] }],
  ['3_restart', { newerBuild: true }],
  ['4_restart_waiting', { newerBuild: true, working: ['A'] }],
  ['5_both_owed', { newerBuild: true, compactList: ['A', 'chair'] }],
  // the click with a pane working: restart_app answers { asked, working } and the page asks in the app (its own panel)
  ['6_restart_clicked_while_A_works', { newerBuild: true, working: ['A'] }, true],
];
for (const [name, over, click] of SITUATIONS) {
  const facts = Object.assign({}, base, over);
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body style="background:#0B0E14;padding:14px 10px 0">
${topbar}
<div id="restart-ask" hidden><div class="stick-body"></div></div>
<p id="caption" style="color:#8b95a7;font:12px Consolas,monospace;margin:18px 4px 0"></p>
<script>${escapeSrc}
window.__TAURI__ = { core: { invoke: async (cmd) => { if (cmd === 'next_move_facts') return ${JSON.stringify(facts)}; if (cmd === 'restart_app') return { asked: true, working: [{ label: 'A', gate: 'working' }] }; throw 'not in this picture'; } } };
</script>
<script>${js}</script>
<script>setTimeout(() => {
  const r = document.getElementById('restartbtn'), c = document.getElementById('closesmall');
  document.getElementById('caption').textContent = ${JSON.stringify(name)} + ' | move: ' + NextMove.nextMove(NextMove.decisionFacts(${JSON.stringify(facts)})) +
    ' | Compact title: ' + c.title.slice(0, 90) + (r.hidden ? ' | Restart hidden' : ' | Restart title: ' + r.title);
  ${click ? "r.click();" : ''}
}, 200);</script>
</body></html>`;
  const page = path.join(OUT, name + '.html');
  fs.writeFileSync(page, html);
  const png = path.join(OUT, name + '.png');
  const r = spawnSync('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', ['--headless', '--disable-gpu', '--hide-scrollbars',
    click ? '--window-size=1400,260' : '--window-size=1400,130', '--virtual-time-budget=2000', `--screenshot=${png}`, 'file:///' + page.replace(/\\/g, '/')], { encoding: 'utf8', timeout: 60000 });
  console.log(name + ': ' + (fs.existsSync(png) ? path.basename(png) : 'NO PICTURE ' + r.stderr));
}
