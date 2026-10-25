// mut-relabel.js: drop each D454 row / revert each D454 pin in consumer-relabel.js, IN PLACE in pane C's own worktree (the test reads the
// real dev briefs through gen-consumer, so a copy would need the whole tree), run consumer-relabel.test.js, restore. The file's sha256 is
// checked before and after; reports applied / caught / NOT APPLIED.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), crypto = require('crypto'), { spawnSync } = require('child_process');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (_) {}
const W = 'C:/Users/nname/Desktop/worktrees/lh-d454-c', F = path.join(W, 'consonance/tools/consumer-relabel.js');
const orig = fs.readFileSync(F, 'utf8'), sha = (t) => crypto.createHash('sha256').update(t).digest('hex');
const before = sha(orig);
const rowStart = (s) => orig.indexOf(s);
// cut a whole row: from its leading "  [" to the "], 1],\n" that ends it
const cutRow = (needle) => { const i = orig.indexOf(needle); if (i < 0) return null; const a = orig.lastIndexOf('\n  [', i) + 1; const b = orig.indexOf(', 1],\n', i) + ', 1],\n'.length; return [orig.slice(a, b), '']; };
const M = [
  ['row: the machine is the person\'s', cutRow("['The keeper uses this machine while we work")],
  ['row: the Streamlabs incident', cutRow('["Why: on 2026-10-24 the keeper found Streamlabs')],
  ['row: whatever they run comes first', cutRow("['Whatever the keeper is running comes first.'")],
  ['row: the game crash incident', cutRow("['Why: on 2026-10-24 at 08:32 his game crashed")],
  ['row: fake AC roots', cutRow("['Fixture copies, fake AC roots")],
  ['row: the Downloads strays', cutRow("['A folder in Downloads that is no longer")],
  ['row: this room\'s invocation', cutRow("[' In this room\\n")],
  ['row: their things are not cleaned', cutRow(`["- **The keeper's own things are never cleaned`)],
  ['row: LIBRARIAN fact fix', ["\n  // D454 part 2: a fact fix about the keeper's machine (machine-specific), said of that machine\n  ['does not exist on this machine. The notes live in', 'did not exist on the machine this room was built on. The notes live in', 1]]", ']']],
  ['row: COMMITTEE junction', [",\n  // D454 part 2: the junction incident was the keeper's product's folder (machine-specific); the rule's Why stays, said of that room\n  [\"t180's `reads/` was emptied that way, cause inferred\", \"in the keeper's room a product repository's shared `reads/` folder was emptied that way, cause inferred\", 1]];", '];']],
  ['pin: BUILDING back to 22', ["'consonance/src-tauri/brief/BUILDING.md': 25,", "'consonance/src-tauri/brief/BUILDING.md': 22,"]],
  ['pin: COMMITTEE back to 5', ["'consonance/src-tauri/brief/COMMITTEE.md': 6,", "'consonance/src-tauri/brief/COMMITTEE.md': 5,"]],
  ['the person\'s things keep "his word"', ['are never cleaned without their word.**', 'are never cleaned without his word.**']],
  ['README row dropped', ["  'README.md': { rows: README_D454 },\n", '']],
  ['README pin moved', ["  'README.md': 1,", "  'README.md': 0,"]],
  ['README row loses inheritance/', ['"- [`exo_memory/inheritance/`](exo_memory/inheritance/) — the keeper', '"- [`exo_memory/inheritance`](exo_memory/) — the keeper']],
  ['the incident loses its room label', ["\"Why: in the keeper's room, on 2026-10-24 at 08:32, the keeper's game crashed mid-stream,\"", "\"Why: on 2026-10-24 at 08:32, the keeper's game crashed mid-stream,\""]],
];
let applied = 0, caught = 0, notApplied = 0;
const t = () => spawnSync(process.execPath, ['--test', 'consonance/tools/consumer-relabel.test.js'], { cwd: W, encoding: 'utf8', windowsHide: true });
try {
  for (const [name, pair] of M) {
    if (!pair || !pair[0] || orig.split(pair[0]).length !== 2) { notApplied++; console.log(`NOT APPLIED  ${name}`); continue; }
    applied++;
    fs.writeFileSync(F, orig.replace(pair[0], pair[1]));
    const r = t(); const killed = r.status !== 0; if (killed) caught++;
    console.log(`${killed ? 'caught      ' : 'SURVIVED    '} ${name}`);
  }
} finally { fs.writeFileSync(F, orig); }
const after = sha(fs.readFileSync(F, 'utf8'));
const base = t();
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${notApplied}; restored ${after === before ? 'byte-identical' : 'DIFFERENT'}; unmutated ${base.status === 0 ? 'green' : 'RED'}`);
