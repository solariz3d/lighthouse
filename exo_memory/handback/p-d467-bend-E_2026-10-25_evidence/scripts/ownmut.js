// ownmut.js (D467, pane E): each part of the change put back or bent, one at a time, and the rows run. A mutant whose anchor is not found once is NOT APPLIED.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const root = 'C:/Users/nname/Downloads/t180-wt-e467';
const ST = 'app/test/sculpt-tools.test.js', WASH = 'app/test/sculpt-wash.test.js';
const M = [
  ['M1 no start-pieces try', 'app/core/coreshell.js', "const startTry = firstR !== lastR && !win.includes(firstR) && !win.includes(lastR) ? [firstR, lastR] : null;", 'const startTry = null;', ST, 'row (21|25|26)\\b'],
  ['M2 the start-pieces try also at the seam', 'app/core/coreshell.js', "const startTry = firstR !== lastR && !win.includes(firstR) && !win.includes(lastR) ? [firstR, lastR] : null;", 'const startTry = firstR !== lastR ? [firstR, lastR] : null;', ST, 'row (22|27)\\b'],
  ['M3 the start pieces tried after the window', 'app/core/coreshell.js', "const tries = [...(startTry ? [startTry] : []), ...[win, withSeam(lastR), withSeam(lastR, firstR)].filter((w, k, all) => !k || w.length !== all[k - 1].length)];", "const tries = [...[win, withSeam(lastR), withSeam(lastR, firstR)].filter((w, k, all) => !k || w.length !== all[k - 1].length), ...(startTry ? [startTry] : [])];", ST, 'row (6|20|21|25)\\b'],
  ['M4 a start close is not told apart', 'app/core/coreshell.js', 'const byStart = !!startTry && r.tried === startTry;', 'const byStart = false;', ST, 'row (26)\\b'],
  ['M5 the kept bend not named', 'app/core/coreshell.js', 'const keptBend = byStart ? Object.freeze({ doc: closed, pieces: Object.freeze([...startTry]) }) : null;', 'const keptBend = null;', ST, 'row (26)\\b'],
  ['M6 the kept bend outlives its document', 'app/preview/preview.js', 'return !!(st && st.keptBend && st.history && st.keptBend.doc === st.history.present);', 'return !!(st && st.keptBend);', ST, 'row (26)\\b'],
  ['M7 the cues ignore a moved start', 'app/preview/preview.js', 'kept = !!startMoved && !!track.path.closed;', 'kept = false;', WASH, 'D467'],
  ['M8 the moved first piece drawn light', 'app/preview/preview.js', 'alpha: kept ? HATCH_ALPHA : HATCH_FIRST_ALPHA', 'alpha: HATCH_FIRST_ALPHA', WASH, 'D467'],
  ['M9 the frame does not pass the moved start', 'app/preview/preview.js', 'sculptCues(track, hoverNow(), startMovedOf(shell.getState()))', 'sculptCues(track, hoverNow())', WASH, 'D467 frame'],
  ['M10 the start words say only closed again', 'app/core/coreshell.js', 'return `the lap is closed again: to keep your ${word}, the start of the lap moved (${report})`;', 'return `the lap is closed again: ${report}`;', ST, 'row (26)\\b'],
];
let applied = 0, caught = 0, notApplied = 0;
for (const [name, rel, from, to, test, pat] of M) {
  const f = path.join(root, rel), orig = fs.readFileSync(f, 'utf8'), lf = orig.split('\r\n').join('\n');
  if (lf.split(from).length !== 2) { notApplied++; console.log('NOT APPLIED', name); continue; }
  const mut = lf.replace(from, () => to); fs.writeFileSync(f, orig.includes('\r\n') ? mut.split('\n').join('\r\n') : mut);
  try {
    const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', ...(pat ? ['--test-name-pattern=' + pat] : []), path.join(root, test)], { cwd: root, encoding: 'utf8', timeout: 300000 });
    const failed = r.status !== 0 && /^# fail [1-9]/m.test(r.stdout);
    applied++; if (failed) caught++;
    console.log((failed ? 'caught     ' : 'NOT CAUGHT ') + name + '  (' + ((/^# fail \d+/m.exec(r.stdout) || ['?'])[0]) + ')');
  } finally { fs.writeFileSync(f, orig); }
}
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${notApplied}`);
