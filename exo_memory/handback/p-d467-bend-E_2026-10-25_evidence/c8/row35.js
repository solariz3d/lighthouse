// row35.js (D467, C's §8.2, pane E): row 35, part 3 counts the window's pieces too. CRLF kept.
'use strict';
const fs = require('fs');
const f = 'C:/Users/nname/Downloads/t180-wt-e467/app/test/sculpt-tools.test.js';
const raw = fs.readFileSync(f, 'utf8'); let s = raw.split('\r\n').join('\n');
s = s.replace(/\n*$/, '\n') + `
// D467, C's re-read §8.2: PART 3 COUNTS THE WINDOW'S PIECES TOO. They carry the first start piece's new end, so they can be the lap's largest move; a bar that left them
// out would pass a result whose only large move is in the window. Built from whole laps the shell made: two laps that share their start straight and differ in their
// turns (180 m against 200 m), the turns given as the window, and an open lap (182 m turns) that moved the track 8.2 m.
test('row 35 (D467 bar): part 3 counts the window\\'s pieces too: a result that moves only the window further than the drag moved the track misses', async () => {
  const lapOf = async (Rq) => { const t = await createCoreShell({ autosaveMs: 0 }), q = (Math.PI * Rq) / 2; t.extend({ length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) t.extend({ length: q, transition: 40, targets: { kh: 1 / Rq } }); t.extend({ length: 60, transition: 40, targets: { kh: 0 } }); t.close(); return t.getState().history.present; };
  const base = await lapOf(180), result = await lapOf(200), near = await lapOf(182), win = base.pieces.map((_, i) => i).filter((i) => i > 0);
  const moves = CJ.displacementOf(base, result), drag = Math.max(...CJ.displacementOf(base, { ...near, closed: false }).map((x) => x.maxM));
  assert.ok(moves[0].maxM < drag && Math.max(...moves.slice(1).map((x) => x.maxM)) > drag, \`control: outside the window the result moves \${moves[0].maxM.toFixed(2)} m, inside it more than the drag's \${drag.toFixed(2)} m\`);
  assert.match(CJ.barMiss({ ...near, closed: false }, result, { base, edited: win }) || '', /^move the track up to /);
});
`;
fs.writeFileSync(f, raw.includes('\r\n') ? s.split('\n').join('\r\n') : s);
console.log('row 35 added');
