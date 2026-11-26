// mutate.js (pane A, L254): each of the left column's behaviours taken out once, in a scratch worktree of the committed branch, and the page rows that must go red
// for it run against the mutant. A mutant whose rows stay green is a behaviour no row guards. The file is restored after each.
// usage: node mutate.js <scratch tree> <out dir> [mutant id ...]   (under heavy-run.js at BelowNormal)
'use strict';
const { spawnSync } = require('child_process'), fs = require('fs'), path = require('path');
const [tree, out, ...only] = process.argv.slice(2);
const LC = 'app/leftcolumn.js', IX = 'app/index.html', VO = 'app/core/valuesoverlay.js', TEST = 'app/test/leftcolumn-page.test.js';
const M = [
  { id: 'M1 no swallow in the fade', file: LC, from: 'swallow = pressed && now() - shownAt < fadeMs();', to: 'swallow = false;', rows: '^row 5:' },
  { id: 'M2 keyboard focus does not hold', file: LC, from: 'keyboard = inside(e.target) && visibleFocus(e.target);', to: 'keyboard = false;', rows: '^row (6|8):' },
  { id: 'M3 a press does not hold', file: LC, from: 'pressed = inside(e.target); swallow', to: 'pressed = false; swallow', rows: '^row 6:' },
  { id: 'M4 the ghost row does not hold', file: IX, from: 'return !!(st.pieceGhost && st.pieceGhost.base === st.history.present && !st.sculpt);', to: 'return false;', rows: '^row 7:' },
  { id: 'M5 no return strip', file: LC, from: 'const back = (e) => { if (!cleared', to: 'const back = (e) => { return; if (!cleared', rows: '^row (3|4):' },
  { id: 'M6 a cleared column still takes clicks', file: IX, from: '  #left.cleared, #left.cleared * { pointer-events: none !important; }', to: '', rows: '^row 4:' },
  { id: 'M7 no delay', file: LC, from: 'delayMs = CLEAR_DELAY_MS,', to: 'delayMs = 0,', rows: '^row 3:' },
  { id: 'M8 a fast cross is not cancelled', file: LC, edits: [['if (holds()) { if (timer !== null) { clearTimer(timer); timer = null; } show(); return; }', 'if (holds()) { show(); return; }'], ['if (holds() || left.matches(\':hover\')) return; cleared = true;', 'cleared = true;']], rows: '^row 3:' },
  { id: 'M8b M8 and no class observer', file: LC, edits: [['if (holds()) { if (timer !== null) { clearTimer(timer); timer = null; } show(); return; }', 'if (holds()) { show(); return; }'], ['if (holds() || left.matches(\':hover\')) return; cleared = true;', 'cleared = true;'], ["if (win && typeof win.MutationObserver === 'function') new win.MutationObserver(update).observe(left, { attributes: true, attributeFilter: ['class'], subtree: true });", '']], rows: '^row 3:' },
  { id: 'M9 a fade under reduced motion', file: IX, from: '  @media (prefers-reduced-motion: reduce) { #left { transition: none; } }', to: '', rows: '^row 9:' },
  { id: 'M10 the view tag left where it was', file: IX, from: '.preview-hud { z-index: 2; left: 262px !important;', to: '.preview-hud { z-index: 2; left: 274px !important;', rows: '^row 2:' },
  { id: 'M11 the view tag level with the docked top', file: VO, from: 'c.top - box.top + HUD_TOP_PX', to: 'c.top - box.top', rows: '^row 2:' },
  { id: 'M12 the column still 12 px in', file: IX, from: 'margin: 0; align-self: stretch;', to: 'margin: 12px 0 12px 12px; align-self: stretch;', rows: '^row 1:' },
  { id: 'M13 cleared from the first move (not armed)', file: LC, from: 'if (armed && !cleared && timer === null)', to: 'if (!cleared && timer === null)', rows: '^row 10:' },
  { id: 'M14 the guide does not hold', file: LC, from: " || !!left.querySelector('.guide-target');", to: ';', rows: '^row 11:' },
];
fs.mkdirSync(out, { recursive: true });
const res = [];
for (const m of M) {
  if (only.length && !only.some((o) => m.id.startsWith(o + ' '))) continue;
  const p = path.join(tree, m.file), orig = fs.readFileSync(p, 'utf8');
  let s = orig;
  for (const [a, b] of m.edits || [[m.from, m.to]]) { const n = s.split(a).length - 1; if (n !== 1) throw new Error(`${m.id}: ${n} matches for ${JSON.stringify(a)}`); s = s.replace(a, () => b); }
  fs.writeFileSync(p, s);
  try {
    const t0 = Date.now();
    const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', `--test-name-pattern=${m.rows}`, TEST], { cwd: tree, encoding: 'utf8', maxBuffer: 1 << 26 });
    const tap = r.stdout || '';
    fs.writeFileSync(path.join(out, m.id.split(' ')[0] + '.tap'), tap + (r.stderr ? `\n# STDERR\n${r.stderr}` : ''));
    const red = [...tap.matchAll(/^not ok \d+ - (row \d+)/gm)].map((x) => x[1]), green = [...tap.matchAll(/^ok \d+ - (row \d+)(?!.*# SKIP).*$/gm)].map((x) => x[1]);
    const row = { mutant: m.id, red, green, caught: red.length > 0, s: Math.round((Date.now() - t0) / 1000) };
    res.push(row); console.log(JSON.stringify(row));
  } finally { fs.writeFileSync(p, orig); }
}
fs.writeFileSync(path.join(out, 'mutants.json'), JSON.stringify(res, null, 1));
console.log(`${res.filter((r) => r.caught).length} of ${res.length} mutants caught`);
