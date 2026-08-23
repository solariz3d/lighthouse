#!/usr/bin/env node
/* mutate-shelf-recursion — prove shelf-recursion.test.js can actually fail.
 *
 * The defect it guards was invisible for its entire life: the shelf printed "0 indexed by path",
 * which is what a COMPLETE shelf looks like, while 12 files had never been opened. A guard against
 * an invisible defect that is itself silently passing is worse than no guard at all, so every
 * mutation here reintroduces the exact regression rather than a synthetic one.
 *
 * A mutation reported NOT APPLIED proves nothing and is called out loudly instead of counted.
 *
 * Run: node dev/mutation/mutate-shelf-recursion.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const TEST = path.join(REPO, 'consonance', 'tools', 'shelf-recursion.test.js');
const MAIN_RS = path.join(REPO, 'consonance', 'src-tauri', 'src', 'main.rs');
const AGE = path.join(REPO, 'consonance', 'tools', 'corpus-age.js');

const MUTANTS = [
  {
    name: 'corpus_shelf() reverts to the flat read_dir (the original 12-file blind spot)',
    file: MAIN_RS,
    apply: (s) => s.replace(
      '        let mut files: Vec<PathBuf> = Vec::new();\r\n        collect_md(&d, !dir.is_empty(), &mut files);',
      '        let Ok(rd) = fs::read_dir(&d) else { continue };\r\n        let mut files: Vec<PathBuf> = rd.flatten().map(|e| e.path())\r\n            .filter(|q| q.is_file() && q.extension().and_then(|x| x.to_str()) == Some("md"))\r\n            .collect();'),
  },
  {
    name: 'the root of exo_memory gets recursed too (double-counts, drags attic in)',
    file: MAIN_RS,
    apply: (s) => s.replace('collect_md(&d, !dir.is_empty(), &mut files);',
                            'collect_md(&d, true, &mut files);'),
  },
  {
    name: 'attic/ stops being skipped by name — law 3 left resting on being unlisted',
    file: MAIN_RS,
    apply: (s) => s.replace(
      '            if q.file_name().and_then(|x| x.to_str()) == Some("attic") { continue; }\r\n', ''),
  },
  {
    name: 'corpus-age.js walk goes flat again (capacity gauge blind to the same 12)',
    file: AGE,
    apply: (s) => s.replace('  walk(d, Boolean(dir));', '  walk(d, false);'),
  },
  {
    name: 'rel rebuilt by joining dir+name (nested paths resolve to nothing, silently)',
    file: AGE,
    apply: (s) => s.replace("    const rel = 'exo_memory/' + f.rel;",
                            "    const rel = path.posix.join('exo_memory', dir, f.name);"),
  },
  {
    name: 'the tool walks INTO attic/ (law 3 broken in the gauge)',
    file: AGE,
    apply: (s) => s.replace("        if (!recurse || e.name === 'attic') continue;",
                            '        if (!recurse) continue;'),
  },
];

let applied = 0, caught = 0, notApplied = 0;
for (const m of MUTANTS) {
  const orig = fs.readFileSync(m.file, 'utf8');
  const mutated = m.apply(orig);
  if (mutated === orig) {
    notApplied++;
    console.log('  NOT APPLIED  ' + m.name);
    console.log('               (anchor did not match — this mutation proves NOTHING)');
    continue;
  }
  applied++;
  fs.writeFileSync(m.file, mutated);
  const r = spawnSync(process.execPath, [TEST], { encoding: 'utf8' });
  fs.writeFileSync(m.file, orig);
  const red = r.status !== 0;
  if (red) caught++;
  console.log('  ' + (red ? 'CAUGHT      ' : 'SURVIVED    ') + m.name);
  if (!red) console.log('               the test passed over a real defect — it is not guarding this');
}

console.log('');
console.log('  applied ' + applied + ' · caught ' + caught + ' · NOT APPLIED ' + notApplied +
  '  (of ' + MUTANTS.length + ')');
if (notApplied) console.log('  a NOT APPLIED mutant is not a pass: the harness never reached the code.');
process.exit(caught === applied && notApplied === 0 ? 0 : 1);
