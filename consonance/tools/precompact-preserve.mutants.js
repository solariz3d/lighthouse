#!/usr/bin/env node
'use strict';
// precompact-preserve.mutants.js - run with: node consonance/tools/precompact-preserve.mutants.js [--only <n>]     (Lap W, W2; holds the heavy-run lock itself)
//
// A GREEN SUITE IS A CLAIM ABOUT THE TESTS, NOT ABOUT THE CODE. This breaks the compaction directive one line at a time and requires
// precompact-preserve.test.js to go RED for each. A wrong directive is invisible: it lands in every compaction summary of a seat and nobody reads
// it until a lesson is missing (the spec's tier: prove it, "with the hook's mutation run", 00_lap_w_spec.md:300-305). No harness named this
// file before Lap W; this one copies sources-gate.mutants.js's shape.
//
// (Lives in consonance/tools, not consonance/hooks: install.ps1 audits every non-test file in a manifest directory, and a mutants harness is not a hook.)
// THE TRACKED SOURCES ARE NEVER WRITTEN. A temp tree mirrors what the suite reads (the hook, its test, scratch.js); the copy is mutated, the copy's
// suite runs, the tree is removed. Every anchor must occur EXACTLY ONCE or the row is NOT APPLIED (counted as such, never as a catch).
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const HERE = path.join(__dirname, '..', 'hooks');
const HOOK = 'precompact-preserve.js', SUITE = 'precompact-preserve.test.js';

const MUTANTS = [
  // ---- Lap W, W2: the librarian's room side ----
  ['room: the librarian never gets the room section', HOOK, '...(isLibrarianCwd(cwd) ? ROOM : []),', '...([]),'],
  ['room: every seat gets the room section', HOOK, '...(isLibrarianCwd(cwd) ? ROOM : []),', '...(true ? ROOM : []),'],
  ['room: the section goes below the task items, not first', HOOK, "    ...(isLibrarianCwd(cwd) ? ROOM : []),\n", ''],
  ['room: a session opened in exo_memory\\librarian is taken for the seat', HOOK, ' && !/[\\\\/]exo_memory[\\\\/]librarian$/i.test(c)', ''],
  ['room: the cwd is not normalised (a trailing separator or "\\." misses the seat)', HOOK, 'const c = tpNorm(cwd); return /[\\\\/]librarian$/i', "const c = String(cwd || ''); return /[\\\\/]librarian$/i"],
  ['room: any folder ending in "librarian" is the seat (librarian-old too)', HOOK, 'return /[\\\\/]librarian$/i.test(c)', 'return /librarian/i.test(c)'],
  ['room: the Third Place letters bullet dropped', HOOK, "  '- letters to or from the Third Place (exo_memory/third_place/);',\n", ''],
  ['room: the letter to the next instance dropped', HOOK, "  '- the librarian\\'s letter to its next instance (exo_memory/librarian/TO_THE_NEXT_ONE_*.md);',\n", ''],
  ['room: the catches bullet loses map/M.md', HOOK, '(exo_memory/librarian/<date>.md, exo_memory/map/M.md)', '(exo_memory/librarian/<date>.md)'],
  ['room: an empty kind is left out instead of said', HOOK, "  '   Where the window held none of a kind, write \"none in this window\" for that kind.',\n", ''],
  ['room: the section has no title', HOOK, '   "Room side, with paths". Carry VERBATIM', '   Carry VERBATIM'],
  // ---- Lap W, W2: the stale lines ----
  ['stale: the count comes back ("any of the five above")', HOOK, 'over dropping any numbered item above.', 'over dropping any of the five above.'],
  ['stale: the re-measure line dropped', HOOK, "    'it (2026-09-19): falsifiers 6.4%, still the class kept least; names 31.0%, not risen.',\n", "    'it.',\n"],
  ['stale: the header claims this conversation\'s own seven summaries again', HOOK, '`compaction summaries in this project (trigger:', '`seven summaries of this conversation (trigger:'],
  // ---- the hook as it was before Lap W ----
  ['guard: the dream gate removed', HOOK, 'if (process.env.CONSONANCE_DREAM) process.exit(0);', ''],
  ['shape: the directive goes under hookSpecificOutput (rejected by the harness, invisibly)', HOOK, 'process.stdout.write(JSON.stringify({ additionalContext: text, suppressOutput: true }));', "process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreCompact', additionalContext: text } }));"],
  ['canary: the token left out of the directive', HOOK, '`[${CANARY}] Preservation directive', '`Preservation directive'],
  ['item 6: the correction-adjacent line dropped', HOOK, "    '6. VERBATIM and quoted, every sentence of the assistant\\'s that the user answered with a correction or an agreement.',\n", ''],
  ['third place: every seat gets "alive for them"', HOOK, '...(isThirdPlaceCwd(cwd) ? ALIVE : []),', '...(true ? ALIVE : []),'],
  ['falsifiers: the original wording is no longer demanded', HOOK, 'in its original', 'from its original'],
  ['trigger: not carried into the directive', HOOK, "(trigger: ${trigger || 'unknown'})", "(trigger: manual)"],
  ['payload: a malformed one throws (a compaction blocked)', HOOK, "try { payload = JSON.parse(raw || '{}'); } catch (_) { /* keep going: a bad payload must not block a compaction */ }", "payload = JSON.parse(raw || '{}');"],
  ['ledger: CONSONANCE_DATA is not honoured (tests pollute production)', HOOK, 'const DATA = process.env.CONSONANCE_DATA || consonanceDir', 'const DATA = consonanceDir'],
  ['ledger: an attempt is recorded as a compaction', HOOK, "event: 'precompact-attempt',", "event: 'compaction',"],
];

function tree() {
  const dir = require('./scratch.js').mkdtemp('pp-mut-');
  fs.mkdirSync(path.join(dir, 'consonance', 'hooks'), { recursive: true });
  for (const f of [HOOK, SUITE]) fs.copyFileSync(path.join(HERE, f), path.join(dir, 'consonance', 'hooks', f));
  // scratch.js: the suite makes its temp folders through it (D287 part 1)
  fs.mkdirSync(path.join(dir, 'consonance', 'tools'), { recursive: true }); fs.copyFileSync(path.join(HERE, '..', 'tools', 'scratch.js'), path.join(dir, 'consonance', 'tools', 'scratch.js'));
  return dir;
}
function run(dir) {
  const env = { ...process.env }; for (const k of Object.keys(env)) if (/^CONSONANCE_/.test(k)) delete env[k];
  const r = spawnSync(process.execPath, ['--test', '--test-concurrency=1', path.join(dir, 'consonance', 'hooks', SUITE)], { encoding: 'utf8', env, timeout: 15 * 60 * 1000, windowsHide: true });
  const o = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, ''), n = (k) => Number((o.match(new RegExp(`^ℹ ${k} (\\d+)`, 'm')) || [])[1]);
  return { pass: n('pass'), fail: n('fail') };
}

function main() {
  require('./heavy-run.js').hold({ cmd: 'precompact-preserve.mutants' });   // ONE HEAVY RUNNER PER TREE
  const onlyAt = process.argv.indexOf('--only'), only = onlyAt > 0 ? Number(process.argv[onlyAt + 1]) : null;
  const read = (f) => fs.readFileSync(path.join(HERE, f), 'utf8').replace(/\r\n/g, '\n');
  const control = (() => { const d = tree(); try { return run(d); } finally { fs.rmSync(d, { recursive: true, force: true }); } })();
  console.log(`control (unmutated copy)                              pass ${control.pass} fail ${control.fail}`);
  if (!(control.fail === 0 && control.pass > 0)) { console.log('CONTROL NOT GREEN - no mutant result means anything'); process.exitCode = 1; return; }
  let applied = 0, caught = 0, notApplied = 0;
  MUTANTS.forEach(([name, file, anchor, repl], i) => {
    if (only != null && only !== i + 1) return;
    const src = read(file), hits = src.split(anchor).length - 1, label = `${String(i + 1).padStart(2)} ${name}`.padEnd(96);
    if (hits !== 1) { notApplied++; console.log(`${label} NOT APPLIED (anchor found ${hits} times)`); return; }
    applied++;
    const d = tree();
    try {
      fs.writeFileSync(path.join(d, 'consonance', 'hooks', file), src.replace(anchor, () => repl));
      const r = run(d), ok = r.fail > 0; if (ok) caught++;
      console.log(`${label} pass ${r.pass} fail ${r.fail}  ${ok ? 'CAUGHT' : 'SURVIVED'}`);
    } finally { fs.rmSync(d, { recursive: true, force: true }); }
  });
  console.log(`\n${applied} applied · ${caught} caught · ${applied - caught} survived · ${notApplied} NOT APPLIED`);
  if (applied - caught > 0 || notApplied > 0) process.exitCode = 1;
}

main();
