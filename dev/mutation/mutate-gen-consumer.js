#!/usr/bin/env node
/* mutate-gen-consumer — prove gen-consumer.test.js can fail.
 *
 * This generator writes a PUBLIC tree from a PRIVATE one. A test here that passes over a real
 * defect is not a weak test, it is a leak waiting for someone to trust it. Every mutation below
 * reintroduces something that actually happened during the build, not a synthetic break.
 *
 * The harness normalises line endings before anchoring. The first run of this file reported
 * 3 NOT APPLIED against a CRLF source -- the fifth such miss this week -- and a NOT APPLIED
 * mutant proves nothing, so it is reported loudly rather than counted.
 *
 * Run: node dev/mutation/mutate-gen-consumer.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const GC = path.join(REPO, 'consonance', 'tools', 'gen-consumer.js');
const TEST = path.join(REPO, 'consonance', 'tools', 'gen-consumer.test.js');

const MUTANTS = [
  { name: 'tauri.conf reverts to kind:code, so prose rules corrupt the bundle identifier',
    from: "to: 'consonance/src-tauri/tauri.conf.json', kind: 'config'",
    to:   "to: 'consonance/src-tauri/tauri.conf.json', kind: 'code'" },

  { name: 'build.rs drops out of the manifest (generated tree cannot compile)',
    from: "  { from: 'consonance/src-tauri/build.rs', to: 'consonance/src-tauri/build.rs', kind: 'code' },\n",
    to: '' },

  { name: 'spread/ drops out (a declared glob resource; the build script fails)',
    from: "  { dir: 'exo_memory/spread', to: 'exo_memory/spread', match: /\\.md$/, kind: 'prose' },\n",
    to: '' },

  { name: 'room-settings.json drops out (declared resource; build script fails)',
    from: "  { from: 'consonance/src-tauri/brief/room-settings.json', to: 'consonance/src-tauri/brief/room-settings.json', kind: 'config' },\n",
    to: '' },

  { name: 'icons become kind:prose, so a .png is read as utf8 and silently corrupted',
    from: "match: /\\.(png|ico|icns)$/, kind: 'binary'",
    to:   "match: /\\.(png|ico|icns)$/, kind: 'prose'" },

  { name: 'a bare directory counts as dangling again (would rewrite working constants)',
    from: "{ cls: 'DANGLING', pat: /exo_memory\\/journal\\/\\d{4}-\\d{2}-\\d{2}/g",
    to:   "{ cls: 'DANGLING', pat: /exo_memory\\/journal\\//g" },

  { name: 'the named identifier replacement is removed (leak returns to a parsed field)',
    from: "  rep('\"com.solariz3d.consonance\"', '\"com.consonance.app\"');",
    to:   '' },

  { name: 'the generator ships itself, exclusion list and all',
    from: "  'consonance/tools/gen-consumer.js':\n    'the generator does not ship itself; it is a property of the private tree',\n",
    to: '' },

  { name: 'the identifier shape check stops running',
    from: '    const bad = validIdentifier(body);',
    to:   '    const bad = null;' },

  { name: 'a LEAK pattern is broadened until it collides with a synthetic fixture',
    from: "  { cls: 'MACHINE', pat: /OneDrive/g, why: 'the keeper\\'s personal sync directory' },",
    to:   "  { cls: 'MACHINE', pat: /C:[\\\\/]/g, why: 'broadened' },\n  { cls: 'MACHINE', pat: /OneDrive/g, why: 'the keeper\\'s personal sync directory' }," },

  { name: 'fixtures lose their exemption — DANGLING/MACHINE rewrite test data again',
    from: "  if (kind === 'fixture') {",
    to:   "  if (false) {" },

  { name: 'fixtures get the full deidentify, restructuring paths a test keys on',
    from: '    const b = deidentifyTokens(body);',
    to:   '    const b = deidentify(body);' },

  { name: 'the coordinate substitution is removed (latitude ships)',
    from: "  rep(/50\\.4452/g, '12.3456');",
    to:   '' },

  { name: 'unportable fixtures stop being reported (silent again)',
    from: '      if (refs.length) report.unportable.push(',
    to:   '      if (false) report.unportable.push(' },
];

const raw = fs.readFileSync(GC, 'utf8');
const wasCRLF = raw.includes('\r\n');
const norm = raw.split('\r\n').join('\n');
const restore = (s) => (wasCRLF ? s.split('\n').join('\r\n') : s);

let applied = 0, caught = 0, notApplied = 0;
for (const m of MUTANTS) {
  if (!norm.includes(m.from)) {
    notApplied++;
    console.log('  NOT APPLIED  ' + m.name);
    console.log('               (anchor did not match — this mutation proves NOTHING)');
    continue;
  }
  applied++;
  fs.writeFileSync(GC, restore(norm.replace(m.from, m.to)));
  const r = spawnSync(process.execPath, [TEST], { encoding: 'utf8' });
  fs.writeFileSync(GC, raw);
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
