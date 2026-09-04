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

  /* ── D009 P3, THE RE-POINT ────────────────────────────────────────────────────────────────────
   * Both directions. Some mutants reopen a gap the widening closed; some ship something the seed
   * and the exclusions withhold. The second kind is the expensive one. */

  { name: 'RE-POINT: the tools predicate reverts, reopening three gaps and disarming entry 1',
    // String.raw throughout this block: these anchors are REGEX SOURCE, and a plain quoted string
    // eats the backslashes, which makes the mutant report NOT APPLIED — an outcome that looks like
    // a harness problem and is indistinguishable, at a glance, from a mutant that proved something.
    from: String.raw`{ dir: 'consonance/tools', to: 'consonance/tools', match: /\.(js|json|md)$/, kind: 'code' }`,
    to:   String.raw`{ dir: 'consonance/tools', to: 'consonance/tools', match: /\.js$/, kind: 'code' }` },

  { name: 'RE-POINT: entry 1 declares itself UNREACHABLE again while a rule reaches it',
    from: "  'consonance/tools/portable-paths.baseline.json':\n    'the ratchet",
    to:   "  'consonance/tools/portable-paths.baseline.json':\n    'UNREACHABLE: the ratchet" },

  { name: 'RE-POINT: entry 6 goes back to naming the crash instead of its subject',
    from: "'its SUBJECT is the generator, which is a property of the private tree and does not ship; the load crash is a consequence of that, not the reason'",
    to:   "'requires gen-consumer.js, which does not ship; it would crash on load in a consumer tree'" },

  { name: 'SEED: the private registry is read instead of the seed — 38 KB of this record ships',
    from: "      body = SEEDED[f.from];",
    to:   "      body = fs.readFileSync(src, 'utf8');" },

  { name: 'SEED: the key becomes `withdrawn`, so the tool is inert by the WRONG route',
    from: "    withdrawals: [],",
    to:   "    withdrawn: []," },

  { name: 'SEED: ch4_corpus is shipped present-and-empty, flooding a stranger with CH4-ADDED',
    from: "    withdrawals: [],\n  }, null, 2)",
    to:   "    withdrawals: [],\n    ch4_corpus: { files: [] },\n  }, null, 2)" },

  { name: 'SEED: a seed reaching NO manifest rule stops refusing — it protects nothing and reads as if it does',
    from: "        report.seedDrift.push({ rel,",
    to:   "        void ({ rel,"  },

  { name: 'SEED: seed drift is collected but never refuses the build',
    from: "  if (report.seedDrift.length) {",
    to:   "  if (false && report.seedDrift.length) {" },

  /* DELETED: 'SEED: the on-disk existence check is skipped'. That check no longer exists — its own
   * test failed and the test was right (for a `dir` rule the check was unreachable by
   * construction), so it was replaced by the seed-drift guard the two mutants above cover. A mutant
   * whose anchor has been legitimately removed must be deleted rather than left reporting NOT
   * APPLIED forever: a standing NOT APPLIED is indistinguishable at a glance from a harness
   * problem, and it trains the reader to skim past the line that says a mutation proved nothing. */

  { name: 'DEBT: the counter uses a frozen list instead of Object.keys(EXCLUDE) — a 7th entry is free',
    from: "    const bases = Object.keys(EXCLUDE).map((k) => path.basename(k, path.extname(k)));",
    to:   "    const bases = ['catch-ledger', 'gen-consumer', 'portable-paths.baseline'];" },

  { name: 'DEBT: .md drops out of the scanned extensions, so shipped prose owes nothing',
    from: String.raw`      if (!/\.(js|md|rs|html|json|toml)$/.test(rel)) continue;`,
    to:   String.raw`      if (!/\.(js|rs|html|json|toml)$/.test(rel)) continue;` },

  { name: 'RESIDUAL: the templated private-tree path stops being rewritten',
    from: String.raw`  rep(/\{sysdrive\}\\{1,4}Consonance\\{1,4}lighthouse\\{0,4}/g, '%CONSONANCE_HOME%\\');`,
    to:   '' },

  { name: 'RESIDUAL: the templated form drops out of the MACHINE leak class',
    from: String.raw`  { cls: 'MACHINE', pat: /\{sysdrive\}[\\/]{1,4}Consonance[\\/]{1,4}lighthouse/gi,`,
    to:   String.raw`  { cls: 'MACHINE', pat: /\{sysdrive\}ZZZ[\\/]{1,4}Consonance[\\/]{1,4}lighthouse/gi,` },
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
