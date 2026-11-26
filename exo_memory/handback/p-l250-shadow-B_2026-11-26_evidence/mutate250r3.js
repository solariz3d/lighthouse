// mutate250r3.js (L250 second repair): mutants of the change to Line on a layout with no AI line (app/reference/panel.js), the set-down with a line and
// groundUnder at or below (src/reference/road.js), and the words (road.js, src/reference/ribbon.js). Each is applied in place, both row files are run,
// and the file is put back byte for byte. A mutant is caught when a row fails. Run nothing else in the worktree meanwhile.
const fs = require('fs'), { execFileSync } = require('child_process');
const T = 'C:/Consonance/t180-wt-l243', PAN = 'app/reference/panel.js', ROAD = 'src/reference/road.js', RIB = 'src/reference/ribbon.js';
const M = [
  [PAN, 'Line asks for a line it does not have (no guard)', "if (m === 'line' && !l.hasAi) {", 'if (false) {'],
  [PAN, 'the pick is not kept in Line', '{ reading = null; held = l; ref = null;', '{ reading = null; held = null; ref = null;'],
  [PAN, 'what was shown stays drawn in Line', 'held = l; ref = null; shownKey = null;', 'held = l; shownKey = null;'],
  [PAN, 'the road still reading stays "reading" in Line', '{ reading = null; held = l;', '{ held = l;'],
  [PAN, 'a change to Road does not re-read the kept pick', "layouts.find((x) => keyOf(x) === shownKey)) || held;", 'layouts.find((x) => keyOf(x) === shownKey));'],
  [PAN, 'the select does not name the kept pick', "pickEl.value = shownKey || (held ? keyOf(held) : '');", "pickEl.value = shownKey || '';"],
  [PAN, 'the state names no pick while it is kept', 'picked: shownKey || (held ? keyOf(held) : null),', 'picked: shownKey,'],
  [PAN, 'Line says nothing of the kept pick', '      if (held) { readout.textContent', '      if (false) { readout.textContent'],
  [PAN, 'Clear keeps the kept pick', 'seq++; reading = null; held = null;', 'seq++; reading = null;'],
  [PAN, 'another pick keeps the kept one', 'error = null; notes = []; reading = l; held = null;', 'error = null; notes = []; reading = l;'],
  [ROAD, 'Road with a line is not set down (the one-line undo)', '...setDown(line.start), lengthM', 'start: line.start, lengthM'],
  [ROAD, 'a start with no line is not set down', '{ ...common, ...setDown(s), lengthM: null', '{ ...common, start: { pos: s.pos.slice(), T: s.T.slice() }, startAbove: null, lengthM: null'],
  [ROAD, 'no road under it: height 0, not its own', 'y === null ? s.pos[1] : y', 'y === null ? 0 : y'],
  [ROAD, 'groundUnder reaches 2 m above (as at b26db76)', 'top = pos[1]; let best', 'top = pos[1] + 2; let best'],
  [ROAD, 'groundUnder takes any surface, a deck too', 'if (y <= top && (best === null || y > best)) best = y;', 'if (best === null || y > best) best = y;'],
  [ROAD, 'groundUnder takes the lowest road', 'if (y <= top && (best === null || y > best)) best = y;', 'if (y <= top && (best === null || y < best)) best = y;'],
  [ROAD, 'the readout says AC_START_0 again', "'its first grid slot'", "'AC_START_0'"],
  [RIB, 'an absent start ends as a damaged read', "return code === 'NO_START' ?", 'return false ?'],
  [RIB, 'every refusal loses its ending', "return code === 'NO_START' ?", 'return true ?'],
];
const run = () => { for (const f of ['app/test/reference-panel.test.js', 'test/reference_ribbon.test.js']) { try { execFileSync(process.execPath, ['--test', f], { cwd: T, stdio: 'pipe', timeout: 240000 }); } catch (e) { return true; } } return false; };
const res = [], origs = new Map();
try {
  for (const [file, name, a, b] of M) {
    const F = `${T}/${file}`; if (!origs.has(F)) origs.set(F, fs.readFileSync(F));
    const s = origs.get(F).toString('utf8'); if (s.split(a).length !== 2) { res.push([name, 'NOT APPLIED']); continue; }
    fs.writeFileSync(F, s.replace(a, () => b));
    const caught = run(); fs.writeFileSync(F, origs.get(F));
    res.push([name, caught ? 'caught' : 'SURVIVED']);
  }
} finally { for (const [F, b] of origs) fs.writeFileSync(F, b); }
for (const [n, r] of res) console.log(`${r.padEnd(11)} ${n}`);
console.log(`${res.filter((x) => x[1] === 'caught').length} of ${res.length} caught; restored byte for byte: ${[...origs].every(([F, b]) => fs.readFileSync(F).equals(b))}`);
