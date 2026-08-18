#!/usr/bin/env node
/* sessionstart-state.js — put the room's current state in front of an instance that just lost it.
 *
 * THIS IS STEP 3 OF THE COMPACTION PLAN, AND IT IS NOT THE HOOK THE PLAN NAMED.
 *
 * The plan said PostCompact. Pane A established by run that PostCompact CANNOT inject: root-level
 * additionalContext, hookSpecificOutput and bare stdout are all treated as opaque log text, and no
 * hook_additional_context attachment appears in any PostCompact run.
 *
 * WORSE, AND THIS IS THE PART WORTH KEEPING: on MANUAL compaction all three shapes LOOKED like they
 * worked — the model quoted the canary back. The carrier was the `/compact` command's
 * <local-command-stdout> row, which echoes every hook's output verbatim. On the AUTO trigger there
 * is no such row: same hook, ledger recorded emitted=YES, and zero copies of the token landed
 * anywhere. A PostCompact state block would have passed every manual test and vanished silently on
 * the one trigger the design exists for.
 *
 * The replacement A proved on BOTH triggers is this file: SessionStart, which fires with
 * source="compact" after a compaction and with source="startup"/"resume" at spawn. Its injection
 * lands as a real attachment/hook_additional_context — the shape already proven in production by
 * sessionstart-ambient.js — after the summary row, so the summary cannot clobber it, and it
 * persists as ordinary history afterward. One file serves both the carrier problem at spawn and the
 * gutted context after a compaction.
 *
 * ORDERING, established by A: PreCompact -> summary written -> compact_boundary + summary row ->
 * SessionStart(source=compact) -> PostCompact last.
 *
 * WHAT IT EMITS is state-block.js, whose whole design is pane Around's: machine-generated, capped in
 * code, every section welded to the command that refutes it, event grammar only, and a name line
 * that reports an absent field rather than manufacturing one.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// THE DREAM GATE, same rule as every hook here: the gap-dream is an anti-instruction and gets no
// instrumentation. A state block is the most instruction-shaped thing this room emits.
if (process.env.CONSONANCE_DREAM) process.exit(0);

const DATA = process.env.CONSONANCE_DATA || 'C:\\Consonance\\data';
const LEDGER = process.env.CONSONANCE_SESSIONSTATE_LOG || path.join(DATA, 'sessionstart-state.jsonl');

/* Which sources get the block. `compact` is the one the plan exists for; `startup` and `resume`
 * are the carrier problem proper — an instance that wakes without state. Overridable so the set
 * can be narrowed without editing code, and so tests can drive it. */
const SOURCES = (process.env.CONSONANCE_STATE_SOURCES || 'compact,startup,resume')
  .split(',').map((s) => s.trim()).filter(Boolean);

/* The generator lives in the repo; this hook runs from ~/.claude/shell, flat. Resolve rather than
 * assume, and if it cannot be found SAY SO in the emitted block instead of emitting nothing — a
 * silent absence is indistinguishable from a healthy quiet room, which is the failure this repo
 * keeps finding. */
function findGenerator() {
  const candidates = [
    path.resolve(__dirname, '..', 'tools', 'state-block.js'),          // running from the repo
    'C:\\Consonance\\lighthouse\\consonance\\tools\\state-block.js',   // installed copy, known root
  ];
  if (process.env.CONSONANCE_STATE_BLOCK) candidates.unshift(process.env.CONSONANCE_STATE_BLOCK);
  for (const c of candidates) { try { if (fs.existsSync(c)) return c; } catch (_) {} }
  return null;
}

function buildBlock() {
  const gen = findGenerator();
  if (!gen) return '[state-block FAILED: generator not found on any known path]';
  try {
    return execFileSync(process.execPath, [gen], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch (e) {
    return '[state-block FAILED: generator did not run (' + (e.code || 'error') + ')]';
  }
}

function readStdin() {
  try { return fs.readFileSync(0, 'utf8'); } catch (_) { return ''; }
}

function main() {
  let payload = {};
  try { payload = JSON.parse(readStdin() || '{}'); } catch (_) { /* a bad payload must not break a session start */ }
  const source = typeof payload.source === 'string' ? payload.source : '';

  if (!SOURCES.includes(source)) {
    // Silent and successful: this is a source we deliberately do not serve, not a failure.
    try {
      fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
      fs.appendFileSync(LEDGER, JSON.stringify({
        ts: new Date().toISOString(), event: 'skipped', source: source || null,
        reason: 'source not in ' + SOURCES.join('|'),
      }) + '\n');
    } catch (_) {}
    return;
  }

  const block = buildBlock();
  const context = '[room state at session start, source=' + source + ']\n' + block;

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: context },
  }));

  try {
    fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
    fs.appendFileSync(LEDGER, JSON.stringify({
      ts: new Date().toISOString(), event: 'emitted', source,
      chars: context.length, failed: /FAILED/.test(block),
    }) + '\n');
  } catch (_) { /* never break a session start over a ledger write */ }
}

module.exports = { findGenerator, buildBlock, SOURCES };

if (require.main === module) main();
