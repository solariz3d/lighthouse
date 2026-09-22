#!/usr/bin/env node
// tool_audit_tally.js — the tally behind `tool_audit_draft_2026-09-07.md`.
//
// WHY THIS IS A SCRIPT AND NOT A PARAGRAPH. Every figure in the draft beside it is supposed to
// re-derive from one run of a visible instrument (BOOT, the curated-auditor amendment: "an
// instrument's number is reproducible by re-running it; the chair's summary of that number is
// hand-made every time and has no test"). A tool inventory counted by hand is exactly the class
// of figure that has gone wrong here before — "234 assertions" quoted for weeks across three
// units 2-18x apart — so the count lives in code and the prose cites it.
//
// WHAT IT COUNTS
//   · every .js under consonance/tools, split into INSTRUMENTS and TESTS
//   · instruments with no sibling <name>.test.js         ("untested")
//   · test files whose subject instrument does not exist  ("orphan")
//   · a coverage rate, with its denominator printed beside it rather than implied
//
// SELF-CHECK. The tally recomputes its own totals a second way and exits non-zero if the two
// disagree. A count with no second derivation is a hand-made figure wearing a shell prompt.
//
//   node exo_memory/review/tool_audit_tally.js
//   node exo_memory/review/tool_audit_tally.js --json
'use strict';

const fs = require('fs');
const path = require('path');

// Derived from the file's own location so the script moves with the repo. The literal below is a
// last resort for the case where this file is run from outside a checkout.
const FALLBACK_ROOT = 'C:\Users\zackn\Consonance\lighthouse';
const REPO = process.env.TOOL_AUDIT_ROOT || path.resolve(__dirname, '..', '..') || FALLBACK_ROOT;
const TOOLS = path.join(REPO, 'consonance', 'tools');

function listJs(dir) {
  return fs.readdirSync(dir).filter((n) => n.endsWith('.js')).sort();
}

const all = listJs(TOOLS);

// An INSTRUMENT is a .js that is not itself a test.
const tests = all.filter((n) => n.endsWith('.test.js'));
const instruments = all.filter((n) => !n.includes('test'));

// Instruments carrying no sibling test. EXEMPT holds the ones that are entry points rather than
// instruments and are exercised through the suite indirectly.
const EXEMPT = new Set(['curate.js', 'pane-status.js']);
const untested = instruments.filter(
  (n) => !EXEMPT.has(n) && !tests.includes(n.replace(/\.js$/, '.test.js')),
);

// A test whose subject instrument is not on disk. This is the class that killed guard-census's
// test for longer than a day — it died ENOENT on load and the suite read the silence as green.
const orphans = tests.filter((n) => !instruments.includes(n.replace(/\.test\.js$/, '.js')));

const tested = instruments.length - untested.length;
const coverage = Math.round((100 * tested) / all.length);

const report = {
  files_total: all.length,
  instruments: instruments.length,
  tests: tests.length,
  untested: untested,
  orphans: orphans,
  coverage_pct: coverage,
};

if (process.argv.includes('--json')) {
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
} else {
  console.log(`consonance/tools — ${all.length} .js files`);
  console.log(`  instruments        ${instruments.length}`);
  console.log(`  tests              ${tests.length}`);
  console.log(`  untested           ${untested.length}  ${untested.join(' ') || '—'}`);
  console.log(`  orphan tests       ${orphans.length}  ${orphans.join(' ') || '—'}`);
  console.log(`  coverage           ${coverage}%  (${tested} of ${instruments.length} instruments)`);
}

// ── SELF-CHECK ───────────────────────────────────────────────────────────────────────────────
// Each of these recomputes something above by a different route. A disagreement is a bug in this
// file, never a fact about the repo, so it exits non-zero and says which one failed.
const failures = [];

if (instruments.length + tests.length !== all.length) {
  failures.push(
    `partition: instruments(${instruments.length}) + tests(${tests.length}) ` +
    `!= files(${all.length})`,
  );
}

const coverageSecondWay = Math.round((100 * (instruments.length - untested.length)) / instruments.length);
if (coverageSecondWay !== coverage) {
  failures.push(`coverage: ${coverage}% by one route, ${coverageSecondWay}% by the other`);
}

if (failures.length) {
  console.error('\nSELF-CHECK FAILED');
  for (const f of failures) console.error('  · ' + f);
  process.exit(1);
}
