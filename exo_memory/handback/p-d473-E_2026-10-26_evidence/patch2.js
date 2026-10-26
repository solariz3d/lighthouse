// patch2.js (D473): row 2 asserts its control; the Track menu row amended by name; CRLF kept
'use strict';
const fs = require('fs'), W = 'C:/Users/nname/Downloads/t180-wt-e473/';
function patch(rel, edits, crlf) {
  const f = W + rel, raw = fs.readFileSync(f, 'utf8'); let s = raw.split('\r\n').join('\n');
  for (const [from, to] of edits) { if (s.split(from).length !== 2) throw new Error(rel + ': not exactly one of: ' + from.slice(0, 80)); s = s.replace(from, () => to); }
  fs.writeFileSync(f, (crlf || raw.includes('\r\n')) ? s.split('\n').join('\r\n') : s); console.log('patched', rel);
}
patch('app/test/core-bank-lap.test.js', [[
  "  assert.deepEqual(present(s).pieces[3].channels.phi, before.pieces[3].channels.phi, 'the loop keeps its bank channel');\n",
  "  assert.deepEqual(present(s).pieces[3].channels.phi, before.pieces[3].channels.phi, 'the loop keeps its bank channel');\n  assert.ok(present(s).pieces[1].channels.phi.some((x, j) => Math.abs(x - before.pieces[1].channels.phi[j]) > 10 * DEG), 'control: the level curve before it is banked');\n"]], true);
patch('app/test/core-trackmenu.test.js', [
  ["// D465 amended this row by name: it read \"and nothing that is a command\"; Track ▸ Smooth ramps is the menu's first command (0.4.20), after a separator\ntest('the Track menu lists Start & grid…, Pit lane… and Road surface ▸ as panels, in that order, then a separator and Smooth ramps, its one command', async () => {",
   "// D465 amended this row by name: it read \"and nothing that is a command\"; Track ▸ Smooth ramps is the menu's first command (0.4.20), after a separator\n// AMENDED (D473): it read \"then a separator and Smooth ramps, its one command\"; Bank the lap is its second command, enabled on a closed lap only\ntest('the Track menu lists Start & grid…, Pit lane… and Road surface ▸ as panels, in that order, then a separator and its two commands, Smooth ramps and Bank the lap', async () => {"],
  ["    assert.deepEqual(M.track.map((i) => i.label || (i.separator ? '—' : '?')), ['Start & grid…', 'Pit lane…', 'Road surface ▸', '—', 'Smooth ramps']);\n",
   "    assert.deepEqual(M.track.map((i) => i.label || (i.separator ? '—' : '?')), ['Start & grid…', 'Pit lane…', 'Road surface ▸', '—', 'Smooth ramps', 'Bank the lap']);\n"],
  ["    assert.equal(M.item('Smooth ramps').panel, undefined);\n  } finally { M.done(); }\n});\n",
   "    assert.equal(M.item('Smooth ramps').panel, undefined);\n    assert.equal(typeof M.item('Bank the lap').run, 'function', 'Bank the lap is a command');\n    assert.equal(!!M.item('Bank the lap').disabled, false, 'enabled on this closed lap');\n    M.shell.newDoc();\n    assert.equal(TM.items(M.ctx).find((i) => i.label === 'Bank the lap').disabled, true, 'disabled on a lap that is not closed');\n  } finally { M.done(); }\n});\n"],
]);
