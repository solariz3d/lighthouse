// mutate250.js (L250): each mutant of the L250 code applied in place (one file at a time), both row files run, the file put back byte for byte.
// A mutant is caught when a row fails. Run nothing else in the worktree meanwhile, and no picture run (the page is served from it): L243's lesson.
const fs = require('fs'), { execFileSync } = require('child_process');
const T = 'C:/Consonance/t180-wt-l243';
const RIB = 'src/reference/ribbon.js', ROAD = 'src/reference/road.js', PAN = 'app/reference/panel.js', REN = 'app/preview/renderer.js';
const M = [
  [PAN, 'a refused line leaves the last one drawn', 'ref = null; shownKey = null; timing = null; error = `${nameOf(l)}: ${words}`;', 'shownKey = null; timing = null; error = `${nameOf(l)}: ${words}`;'],
  [PAN, 'a refused entry is not marked', "${!l.hasAi ? ' (no AI line)' : bad ? ' (cannot be read)' :", "${!l.hasAi ? ' (no AI line)' : false ? ' (cannot be read)' :"],
  [PAN, 'Show off still draws', 'detail: { ribbon: shown ? ref : null,', 'detail: { ribbon: ref,'],
  [PAN, 'Clear keeps the nudge', 'notes = []; nudge = { ...ZERO };', 'notes = [];'],
  [PAN, 'a stale pick is not dropped', '    if (my !== seq) return null;\r\n    ref = next;', '    ref = next;'],
  [PAN, 'a borrowed line is not marked in the list', 'if (same.length || samePath.length) borrowed.add(keyOf(l));', ''],
  [PAN, 'the ui length is not read', 'uiM: uiLengthM(l.uiLength)', 'uiM: null'],
  [PAN, 'a road refusal refuses the line too', "refused.set(rk(key, lineOk ? m : 'line'), words);", "refused.set(rk(key, 'line'), words);"],
  [PAN, 'Road mode draws the line', "next = m === 'road' ? roadReference(decodeRoad(roadBytes), line) : line;", 'next = line;'],
  [RIB, 'sameLine ignores the widths', 'if (sides && !(Math.abs(', 'if (false && !(Math.abs('],
  [RIB, 'sameLine ignores the points', 'if (!(Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) <= tolM)) return no;', ''],
  [RIB, 'a line 50 % off is the first said', 'if (Math.abs(off) > 0.05)', 'if (Math.abs(off) > 0.5)'],
  [RIB, 'a bare number is always metres', '(!m[2] && v < 100) ? v * 1000 : v', 'false ? v * 1000 : v'],
  [RIB, 'the code shown, not its words', 'const why = code && REFUSED[code] ? `${REFUSED[code]} (${detail})` : detail;', 'const why = msg;'],
  [ROAD, "a road's normals keep the kn5's winding", 'if (ny < 0) { nx = -nx; ny = -ny; nz = -nz; }', ''],
  [ROAD, 'bytes after the last batch allowed', "if (o !== end) throw new RefTrackError('BAD_ROAD'", "if (false) throw new RefTrackError('BAD_ROAD'"],
  [ROAD, 'an index past its vertices allowed', 'if (v >= V) throw', 'if (false) throw'],
  [ROAD, "the header's triangles not checked", 'if (Number.isFinite(meta.triangles) && meta.triangles !== triangles) throw', 'if (false) throw'],
  [ROAD, 'the magic not checked', 'if (magic !== MAGIC) throw', 'if (false) throw'],
  [ROAD, 'the road placed by its own origin', 'start: line.start, lengthM', 'start: { pos: [0, 0, 0], T: [0, 0, 1] }, lengthM'],
  [REN, 'the reference after his road', '      if (extras.reference && extras.reference.batches && extras.reference.batches.length) drawReference(extras.reference, vp);\r\n      let chunks;', '      let chunks;'],
  [REN, 'the reference writes depth', 'gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false);\r\n    // no fog on the shadow', 'gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(true);\r\n    // no fog on the shadow'],
  [REN, 'the token is not read', 'c = ref.colour || referenceColour;', 'c = ref.colour || REFERENCE.colour;'],
];
const run = () => { for (const f of ['test/reference_ribbon.test.js', 'app/test/reference-panel.test.js']) { try { execFileSync(process.execPath, ['--test', f], { cwd: T, stdio: 'pipe', timeout: 240000 }); } catch (e) { return true; } } return false; };
const res = [], origs = new Map();
try {
  for (const [file, name, a, b] of M) {
    const F = `${T}/${file}`; if (!origs.has(F)) origs.set(F, fs.readFileSync(F));
    const s = origs.get(F).toString('utf8'); if (s.split(a).length !== 2) { res.push([name, 'NOT APPLIED']); continue; }
    fs.writeFileSync(F, s.replace(a, () => b));
    const caught = run(); fs.writeFileSync(F, origs.get(F));
    res.push([name, caught ? 'caught' : 'SURVIVED']);
  }
} finally { for (const [F, o] of origs) fs.writeFileSync(F, o); }
for (const r of res) console.log(r.join(': '));
const exact = [...origs].every(([F, o]) => Buffer.compare(fs.readFileSync(F), o) === 0);
console.log(`${res.filter((r) => r[1] === 'caught').length} of ${res.length} caught; restored ${exact ? 'byte for byte' : 'NOT EXACTLY'}`);
