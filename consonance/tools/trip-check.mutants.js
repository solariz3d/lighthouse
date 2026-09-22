#!/usr/bin/env node
'use strict';
/* trip-check.mutants.js — a checker that cannot say NOT CLEAN is decoration, so the first row here is the one the D112
 * packet asked for by name: a checker that ALWAYS says clean must go RED.
 *
 * The tracked source is never written: the tools dir is copied to a temp dir at the repo's own depth, the copy is
 * mutated, the suite runs against it, the dir is removed. Three results are kept apart and printed as such:
 *   NOT APPLIED  the anchor is not in the source exactly once
 *   NO RESULT    the mutant does not compile (`node --check`) — a syntax error is not a test catching anything
 *   CAUGHT (hung) a suite that cannot finish is failing, and the row says which way
 *
 *   node consonance/tools/trip-check.mutants.js
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const TOOLS = __dirname;
const SRC = path.join(TOOLS, 'trip-check.js');
const SUITE = 'trip-check.test.js';
const HANG_MS = 120000;

const MUTANTS = [
  ['ALWAYS CLEAN — the packet\'s named mutant: the checker can never fail', '    r.not_clean = why;\n    r.clean = why.length === 0;', '    r.not_clean = [];\n    r.clean = true;'],
  ['a lost row is not counted', 'for (const k of beforeSet) if (!afterSet.has(k)) lost++;', 'for (const k of beforeSet) if (false) lost++;'],
  ['a REPLACED file (lines dropped, row set intact) is tolerated', 'if (r.lines_after < r.lines_before) why.push(', 'if (false) why.push('],
  ['an unresolved refusal is not reported', 'for (const p of r.refusals_unresolved) why.push(', 'for (const p of []) why.push('],
  ['a union BEFORE the refusal counts as the repair (the order dropped)', 'u.file === x.path && u.at > r.at', 'u.file === x.path'],
  ['installed-and-refused no longer contradicts', 'if (r.installed && r.refused.length) {', 'if (false) {'],
  ['an unresolvable head is accepted', "if (r.kind === 'close' && !r.head_resolves) why.push(", "if (false) why.push("],
  ['row identity becomes the raw line (key order starts to matter)', 'const keyOf = (line) => { try { return canon(JSON.parse(line)); } catch (_) { return \'RAW:\' + line; } };', 'const keyOf = (line) => line;'],
  ['the union row claims its counts came from a tool', 'counts_from_tool: false,', 'counts_from_tool: true,'],
  ['one not-clean trip no longer restarts the week', 'clean: bad.length === 0 && days.size >= 7,', 'clean: days.size >= 7,'],
  ['the data-dir guard stops refusing', "return !rel.startsWith('..') && !path.isAbsolute(rel);", 'return false;'],
];

function score(text) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'trip-check-mut-'));
  try {
    const tools = path.join(root, 'consonance', 'tools');
    fs.mkdirSync(tools, { recursive: true });
    for (const f of fs.readdirSync(TOOLS)) if (f.endsWith('.js') || f.endsWith('.json')) fs.copyFileSync(path.join(TOOLS, f), path.join(tools, f));
    if (text != null) fs.writeFileSync(path.join(tools, 'trip-check.js'), text);
    if (spawnSync(process.execPath, ['--check', path.join(tools, 'trip-check.js')]).status !== 0) return { noResult: true };
    const r = spawnSync(process.execPath, ['--test', path.join(tools, SUITE)], { encoding: 'utf8', timeout: HANG_MS });
    if (r.error && r.error.code === 'ETIMEDOUT') return { hung: true };
    const o = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, '');
    const n = (k) => Number((o.match(new RegExp(`^ℹ ${k} (\\d+)`, 'm')) || [])[1] || 0);
    return { pass: n('pass'), fail: n('fail') + n('cancelled') };   // a cancelled test timed out; it did not pass
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
}

function main() {
  const src = fs.readFileSync(SRC, 'utf8');
  const c = score(null);
  console.log('control', JSON.stringify(c));
  if (c.noResult || c.hung || c.fail !== 0 || !(c.pass > 0)) { console.log('CONTROL NOT GREEN — no mutant result means anything'); process.exitCode = 1; return; }
  let applied = 0, caught = 0, hung = 0, noResult = 0, notApplied = 0;
  MUTANTS.forEach(([name, anchor, repl], i) => {
    const label = `${String(i + 1).padStart(2)} ${name}`.padEnd(72);
    const hits = src.split(anchor).length - 1;
    if (hits !== 1) { notApplied++; console.log(`${label} NOT APPLIED (anchor found ${hits} times)`); return; }
    const r = score(src.replace(anchor, repl));
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
