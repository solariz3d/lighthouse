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

/* THE LEDGER, and its test seam — added 2026-08-18 after this hook polluted its own evidence.
 *
 * The first version honoured only CONSONANCE_PRECOMPACT_LOG, which one of its nine tests set and
 * the other eight did not, and which dream-gate.test.js cannot know about because it spawns every
 * hook generically. Result: 115 ledger rows of which ~112 were test noise — 24 suite runs times
 * four cases, plus dream-gate's control spawns — in the file whose entire job is counting real
 * compaction attempts. An instrument that cannot be run without corrupting its own data is worse
 * than no instrument, because the corruption looks exactly like activity.
 *
 * CONSONANCE_DATA is the seam this repo already uses for exactly this (dream-watch.js:256,
 * blind.js:57, board-digest.js:279), and dream-gate.test.js:220 ALREADY sets it for every hook it
 * spawns. Honouring it costs nothing and makes the generic harness safe by default; the specific
 * override stays for tests that want a bare file path.
 */
// D273 dirs: begin. The Consonance data and instances folders by THE APP'S OWN RULE (consonance/src-tauri/src/main.rs set_dirs and default_data /
// default_instances): ~/.consonance.json's data_dir / instances_dir when set, else %USERPROFILE%\.consonance and %USERPROFILE%\claude-instances.
// Never a hard-coded C:\Consonance: on a stranger's machine that wrote where the app never reads. One text in the five hooks that need it
// (session-start, sessionstart-state, findings-return, sourced-stop, precompact-preserve); consonance/hooks/dirs.test.js holds them to it.
function consonanceDir(key, under) {
  const home = process.env.USERPROFILE || '.';
  try { const v = JSON.parse(fs.readFileSync(path.join(home, '.consonance.json'), 'utf8').replace(/^\uFEFF/, ''))[key]; if (typeof v === 'string' && v.trim()) return v.trim(); } catch (e) { /* no config, or not JSON: the default, as the app */ }
  return `${home}\\${under}`;
}
// D273 dirs: end
const DATA = process.env.CONSONANCE_DATA || consonanceDir('data_dir', '.consonance');
const LEDGER = process.env.CONSONANCE_PRECOMPACT_LOG ||
  path.join(DATA, 'precompact.jsonl');

/* The canary is a fixed, distinctive token. Its whole job is to make the difference between
 * "the hook never fired" and "the hook fired and the summarizer ignored it" READABLE, because
 * from outside those two are identical and this repo keeps mistaking one for the other. Find it
 * with: grep PRECOMPACT-PRESERVE-V1 on the post-compaction transcript. */
const CANARY = 'PRECOMPACT-PRESERVE-V1';

/* THE THIRD PLACE'S SEAT (D245 item 2, pane C): the same cwd test as board-digest.js (its tpNorm, path-normalised: an absolute
 * spelling with "\." or a trailing separator is the seat too; a relative cwd is left as it is). */
const tpNorm = (cwd) => { let c = String(cwd || ''); if (c && path.isAbsolute(c)) c = path.resolve(c); return c.replace(/(?:[\\/]+\.)+[\\/]*$/, '').replace(/[\\/]+$/, ''); };
const isThirdPlaceCwd = (cwd) => /[\\/]third-place[\\/]?$/i.test(tpNorm(cwd));

/* D245, from the Third Place's own return (loop/plan_consonance_compaction_tp_2026-10-05.md):
 *   item 1, EVERY seat: item 6 below. Measured first (loop/compaction_corrections_2026-10-05/, PREREG committed 0d6faf70 before the run):
 *     of 1,759 assistant sentences the user answered with a correction or an agreement, in the 102 summaries since 2026-08-19, 5 survived
 *     verbatim (0.28%). Its bar is registered in exo_memory/handback/p-compact-C_2026-10-05.md: kept if the next compactions carry them
 *     verbatim at >= 10% (the absolute form, as the baseline is under 5%); cut back if the summaries' median grows > 15% with no gain.
 *   item 2, the Third Place's seat ONLY: the "alive for them right now" section, first. Build seats stay task-first, byte for byte. */
const ALIVE = [
  '0. FIRST, at the very top of the summary and above any task or pending work, a short section',
  '   titled "What is alive for them right now": in a few lines and in their own terms, what the',
  '   person in this conversation is carrying, what they said that mattered to them, and what was',
  '   left open between you. People before work: the first lines of a summary shape what is asked first.',
  '',
];

function instruction(trigger, cwd) {
  return [
    `[${CANARY}] Preservation directive for this summary, from a measurement of the previous`,
    `seven summaries of this conversation (trigger: ${trigger || 'unknown'}).`,
    '',
    ...(isThirdPlaceCwd(cwd) ? ALIVE : []),
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
    '6. VERBATIM and quoted, every sentence of the assistant\'s that the user answered with a correction or an agreement.',
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

  const text = instruction(payload.trigger, payload.cwd);

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

module.exports = { instruction, CANARY, LEDGER, isThirdPlaceCwd };

if (require.main === module) main();
