#!/usr/bin/env node
'use strict';
/* union-at-launch.mutants.js — D114. The two the packet names by hand are rows 1 and 2:
 *   1. PHASE 2 turned back into a SET test (A's FATAL-1)
 *   2. a keyless line dropped from PHASE 2(b) (A's FATAL-2)
 * Both MUST go red, and so must every other guard the design argued for.
 *
 * The tracked sources are never written: consonance/tools is copied to a temp dir at the repo's own depth, the copy is
 * mutated, and the file's own suite is run against it. Three results are kept apart and printed as such:
 *   NOT APPLIED  the anchor is not in the source exactly once
 *   NO RESULT    the mutant does not compile (`node --check`)
 *   CAUGHT (hung) a suite that could not finish
 *
 * state-sync.test.js is a HAND-ROLLED runner that prints "N passed, M failed" and exits — it is not node:test — so the
 * score reads its summary line. (Its own L071 lesson: anything appended below that summary never runs.)
 *
 *   node consonance/tools/union-at-launch.mutants.js
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const TOOLS = __dirname;
const HANG_MS = 600000;

const MUTANTS = [
  // ── the two the packet names ──
  ['SET TEST: PHASE 2(a) asks presence, not counts (A\'s FATAL-1)', 'state-sync.js',
    'const have = lc.get(key) || 0;\n    if (have < need) {', 'const have = lc.get(key) ? need : 0;\n    if (have < need) {'],
  ['KEYLESS DROPPED: PHASE 2(b) stops looking at the arriving copy\'s unparseable lines (A\'s FATAL-2)', 'state-sync.js',
    'const orphan = A.invalid.filter((x) => !here.has(x.hash));', 'const orphan = [];'],
  // ── the rest of the design's guards ──
  ['the switch turns on for any truthy value, not only `on`', 'state-sync.js',
    "String(env.CONSONANCE_UNION_AT_LAUNCH || '').trim().toLowerCase() === 'on'", '!!env.CONSONANCE_UNION_AT_LAUNCH'],
  ['countsByKey counts DISTINCT keys instead of rows', 'state-sync.js',
    'for (const r of rows) m.set(r.key, (m.get(r.key) || 0) + 1);', 'for (const r of rows) m.set(r.key, 1);'],
  ['§7.3: a row with no parseable time no longer refuses the file', 'state-sync.js',
    "return n ? `${n} row(s) of the ${side} copy have no parseable time field", 'return false ? `${n} row(s) of the ${side} copy have no parseable time field'],
  ['§4: a dangling `started` receipt no longer refuses the install', 'state-sync.js',
    'if (dangling.length) {', 'if (false) {'],
  ['a merged file is counted as INSTALLED (the word the design forbids)', 'state-sync.js',
    "union.merged.push({ path: x.path, action: 'INSTALLED-BY-UNION'", "wrote++; union.merged.push({ path: x.path, action: 'installed'"],
  ['a file that fails PHASE 2 is treated as merged anyway', 'state-sync.js',
    'if (!verdict.ok) { union.failed.push(', 'if (false) { union.failed.push('],
  ['an unverified union is accepted (survived its first run: no test could reach the branch)', 'state-sync.js',
    "if (!r.verified) {\n    return { ok: false, stage: 'verify',", "if (false) {\n    return { ok: false, stage: 'verify',"],
  ['the merged file is still installed over by the write loop', 'state-sync.js',
    'if (mergedPaths.has(f.path)) continue;', 'if (false) continue;'],
  ['the reconcile hashes a merged file like any other (the SHORTFALL on every success)', 'state-sync.js',
    'if (over && over.merged && over.merged.has(f.path)) {', 'if (false) {'],
  ['the receipt\'s `started` line is written AFTER the freeze, so the crash window is silent again', 'ledger-union.js',
    // The ORDER of the receipt lines is pinned by state-sync's end-to-end test, not by ledger-union's own suite, so
    // this row names the suite that can catch it. A mutant scored against a suite that cannot see it is a false pass.
    "state: 'started',", "state: 'started-after',", 'state-sync.test.js'],
  ['the lock lets a second union in while one is running', 'ledger-union.js',
    'if (held && held.pid && alive(held.pid)) {', 'if (false) {'],
];

const SUITES = { 'state-sync.js': 'state-sync.test.js', 'ledger-union.js': 'ledger-union.test.js' };

function score(file, text, suiteOverride) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ual-mut-'));
  try {
    const tools = path.join(root, 'consonance', 'tools');
    fs.mkdirSync(tools, { recursive: true });
    for (const f of fs.readdirSync(TOOLS)) if (f.endsWith('.js') || f.endsWith('.json')) fs.copyFileSync(path.join(TOOLS, f), path.join(tools, f));
    // The suite reads the SHIPPED manifest one level above tools/ (consonance/state-manifest.json). Without it the
    // control is 86/31 and every mutant row below it is meaningless — the copy must carry every file the suite opens.
    for (const f of fs.readdirSync(path.join(TOOLS, '..')).filter((x) => x.endsWith('.json'))) {
      fs.copyFileSync(path.join(TOOLS, '..', f), path.join(root, 'consonance', f));
    }
    if (text != null) fs.writeFileSync(path.join(tools, file), text);
    if (spawnSync(process.execPath, ['--check', path.join(tools, file)]).status !== 0) return { noResult: true };
    const suite = path.join(tools, suiteOverride || SUITES[file]);
    const env = { ...process.env, STATE_SYNC_UNDER_TEST: path.join(tools, 'state-sync.js') };
    const r = spawnSync(process.execPath, [suite], { encoding: 'utf8', timeout: HANG_MS, env });
    if (r.error && r.error.code === 'ETIMEDOUT') return { hung: true };
    const o = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, '');
    const hand = /(\d+) passed, (\d+) failed/.exec(o);                       // state-sync.test.js's own runner
    if (hand) return { pass: Number(hand[1]), fail: Number(hand[2]) };
    const n = (k) => Number((o.match(new RegExp(`^ℹ ${k} (\\d+)`, 'm')) || [])[1] || 0);  // node:test
    return { pass: n('pass'), fail: n('fail') + n('cancelled') };
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
}

function main() {
  const controls = {};
  for (const f of Object.keys(SUITES)) {
    const c = score(f, null);
    controls[f] = c;
    console.log(`control ${f.padEnd(16)} ${JSON.stringify(c)}`);
    if (c.noResult || c.hung || c.fail !== 0 || !(c.pass > 0)) { console.log('CONTROL NOT GREEN — no mutant result means anything'); process.exitCode = 1; return; }
  }
  const src = Object.fromEntries(Object.keys(SUITES).map((f) => [f, fs.readFileSync(path.join(TOOLS, f), 'utf8')]));
  let applied = 0, caught = 0, hung = 0, noResult = 0, notApplied = 0;
  MUTANTS.forEach(([name, file, anchor, repl, suiteOverride], i) => {
    const label = `${String(i + 1).padStart(2)} [${file.replace('.js', '')}] ${name}`.padEnd(96);
    const hits = src[file].split(anchor).length - 1;
    if (hits !== 1) { notApplied++; console.log(`${label} NOT APPLIED (anchor found ${hits} times)`); return; }
    const r = score(file, src[file].replace(anchor, repl), suiteOverride);
    if (r.noResult) { noResult++; console.log(`${label} NO RESULT (does not compile)`); return; }
    applied++;
    if (r.hung) { hung++; caught++; console.log(`${label} CAUGHT (hung)`); return; }
    const ok = r.fail > 0;
    if (ok) caught++;
    console.log(`${label} pass ${r.pass} fail ${r.fail}  ${ok ? 'CAUGHT' : 'SURVIVED'}`);
  });
  console.log(`\n${applied} applied · ${caught} caught (${hung} by hanging) · ${applied - caught} survived · ${noResult} no result · ${notApplied} NOT APPLIED`);
  if (applied - caught > 0 || noResult > 0) process.exitCode = 1;
}

main();
