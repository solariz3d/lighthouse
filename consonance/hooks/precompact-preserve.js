#!/usr/bin/env node
/* precompact-preserve.js - shape what a compaction summary keeps.
 *
 * WHY THIS EXISTS, and it is a measurement rather than a hunch.
 *
 * Pane B compared all seven of Main's compaction summaries against the rows each one replaced,
 * with the definition and falsifier fixed in PREREG.md before a single row was read. Survival:
 *
 *     file / instrument names          110/325   33.8%
 *     commit shas                        25/244   10.2%
 *     numbers with structure             30/322    9.3%
 *     registered predictions/falsifiers  14/400    3.5%
 *
 * The summarizer keeps STORY and loses VERIFICATION, and the class this room actually runs on is
 * the class it keeps least - one registered prediction in twenty-five. Concretely: the 08-17
 * summary dropped `2aa0b84`, the resolution of the previous night's "number that would not
 * square", one compaction after it was found.
 *
 * This hook aims at exactly that gradient. It does not summarise; it tells the summarizer which
 * classes must survive.
 *
 * THE SHAPE IS LOAD-BEARING AND THE DOCUMENTED-LOOKING ONE IS WRONG (pane A, 2026-08-18):
 * `additionalContext` reaches the summarizer ONLY as a ROOT-LEVEL field. The
 * `hookSpecificOutput.additionalContext` shape is rejected by the harness's own schema validator,
 * the rejection is NON-FATAL and INVISIBLE (it surfaces only in the ctrl+o display), compaction
 * proceeds normally, and the summary is simply unshaped. A hook written the way the event docs
 * gesture at is the exact fired-and-did-nothing failure. Proven by run: the hookSpecificOutput
 * attempt carried neither canary token into the summary; the root-level attempts carried both,
 * on manual AND auto triggers.
 *
 * PreCompact stdin: { session_id, transcript_path, cwd, prompt_id, trigger, custom_instructions }.
 * No summary is available here - PostCompact receives that.
 *
 * FIRING IS NOT COMPLETING (A's canary law): PreCompact also fires on aborted attempts, e.g. the
 * "not enough messages" case, with no compaction after it. So this ledger records ATTEMPTS. Count
 * completions from the transcript's own `compact_boundary` record, which needs no hook at all.
 */
'use strict';

const fs = require('fs');
const path = require('path');

// THE DREAM GATE, same rule as every hook here: the gap-dream is an anti-instruction and gets no
// instrumentation. This one is worth stating rather than copying, because the exemption argument
// is available and wrong: the directive goes to the SUMMARIZER, not to the dreaming instance's
// prompt, so it looks like it escapes the rule. It does not - the summary BECOMES the dreamer's
// context, so a preservation directive imports task-shaped instruction into the one place the
// room deliberately keeps taskless. Caught by dream-gate.test.js, which derives its roster from
// install.ps1's manifest precisely so a hook added later cannot skip the invariant by being new.
if (process.env.CONSONANCE_DREAM) process.exit(0);

const LEDGER = process.env.CONSONANCE_PRECOMPACT_LOG ||
  'C:\\Consonance\\data\\precompact.jsonl';

/* The canary is a fixed, distinctive token. Its whole job is to make the difference between
 * "the hook never fired" and "the hook fired and the summarizer ignored it" READABLE, because
 * from outside those two are identical and this repo keeps mistaking one for the other. Find it
 * with: grep PRECOMPACT-PRESERVE-V1 on the post-compaction transcript. */
const CANARY = 'PRECOMPACT-PRESERVE-V1';

function instruction(trigger) {
  return [
    `[${CANARY}] Preservation directive for this summary, from a measurement of the previous`,
    `seven summaries of this conversation (trigger: ${trigger || 'unknown'}).`,
    '',
    'Those summaries kept narrative and dropped verification. Measured survival: file and',
    'instrument names 33.8%, commit shas 10.2%, structured numbers 9.3%, and registered',
    'predictions or falsifiers 3.5% - the last being the class this project runs on.',
    '',
    'Therefore, when writing the summary, carry forward VERBATIM and in full:',
    '',
    '1. Every commit sha mentioned, with the one-line reason it mattered. A sha without its',
    '   reason is not preservation; a reason without its sha cannot be checked.',
    '2. Every number that carries a unit, a ratio, or a denominator (N%, N/M, N of M), together',
    '   with the command or file that produced it. A number whose source is gone becomes a',
    '   hand-made figure the next session will quote and cannot re-derive.',
    '3. Every REGISTERED PREDICTION, FALSIFIER, STOP RULE or ABUSE CONDITION, in its original',
    '   wording. These are worthless if paraphrased: a falsifier restated loosely stops being',
    '   able to fire, which is the exact failure it exists to prevent.',
    '4. Every named instrument or file path, with the command that runs it.',
    '5. Every correction anyone made, including corrections the assistant made to itself, and',
    '   what the corrected claim had been. A record of only the surviving claims reads as though',
    '   nothing was ever wrong.',
    '',
    'Prefer dropping narrative, atmosphere and restatement over dropping any of the five above.',
    'If length forces a choice, a summary that is a bare list of checkable items is more useful',
    'here than a readable account with the checkable items removed.',
  ].join('\n');
}

function readStdin() {
  try { return fs.readFileSync(0, 'utf8'); } catch (_) { return ''; }
}

function main() {
  const raw = readStdin();
  let payload = {};
  try { payload = JSON.parse(raw || '{}'); } catch (_) { /* keep going: a bad payload must not block a compaction */ }

  const text = instruction(payload.trigger);

  /* ROOT-LEVEL. Not hookSpecificOutput - see the header. */
  process.stdout.write(JSON.stringify({ additionalContext: text, suppressOutput: true }));

  try {
    fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
    fs.appendFileSync(LEDGER, JSON.stringify({
      ts: new Date().toISOString(),
      event: 'precompact-attempt',      // an ATTEMPT: PreCompact fires on aborted compactions too
      trigger: payload.trigger || null,
      session_id: payload.session_id || null,
      custom_instructions: payload.custom_instructions || null,
      canary: CANARY,
      chars: text.length,
    }) + '\n');
  } catch (_) { /* never block a compaction over a ledger write */ }
}

module.exports = { instruction, CANARY, LEDGER };

if (require.main === module) main();
