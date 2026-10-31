// patch437.js (P): fills §3 of the D437 hand-back from sec3.md, adds the §8 correction, fixes the §9 lock sentence and the SOURCES line. Every anchor must match or nothing is written.
const fs = require('fs');
const f = 'C:/Users/nname/Desktop/lighthouse/exo_memory/handback/p-d437-P_2026-10-22.md';
let s = fs.readFileSync(f, 'utf8');
const rep = (a, b, what) => { if (!s.includes(a)) throw new Error(what + ' anchor missing'); if (s.split(a).length !== 2) throw new Error(what + ' anchor not unique'); s = s.replace(a, b); };
rep("## 3. The page's own Export, headless\n\n(filled in from the second headless pass; see below)\n", fs.readFileSync(__dirname + '/sec3.md', 'utf8'), '§3');
const c8 = '- The 10-15 dumps\' "where" is inferred, said so in §1.\n';
rep(c8, c8 + '- The headless runs\' own RESULT lines are wrong. `run-export-437.js` reports "neither finished nor crashed within the wait" for every run, because its `Inspector.targetCrashed` listener never fired (I do not know why) and a `Runtime.evaluate` against the dead renderer never answers, so the run read as "page busy" for 80 minutes; the renderer memory log and the Crashpad dumps are the record (§3), not those lines. Its "up to 20 min" comment is also wrong: 2,400 polls at ~2 s each is 82 min. And the script deletes the profile folder at a normal exit, which cost pass 3\'s b6969da dump; passes 1–2 kept theirs only because I stopped them.\n', '§8');
rep('Headless Chrome 155.0.8059.85 with `--headless=new --mute-audio`, under the heavy-run lock (`cmd: P d437 headless Chrome export …`, no timing session held).',
  'Headless Chrome 155.0.8059.85 with `--headless=new --mute-audio`; passes 1–2 under the heavy-run lock (`cmd: P d437 headless Chrome export …`, no timing session held), pass 3 WITHOUT it: both slots were held by O\'s D421 mutation runs (no timing session), the run writes to no checkout, and it is one headless Chrome, which is what the lock had been taken for before.', '§9');
rep('`chrome-run1/`, `chrome/` logs;', '`chrome-run1/`, `chrome-run2/`, `chrome-run3/` logs and `memtl.js`; the five headless dumps (copies) via cdbX64 and `annot.js` → `dumps-headless/`;', 'SOURCES');
fs.writeFileSync(f, s);
console.log('written', s.length, 'chars');
