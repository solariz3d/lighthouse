# W2, level two: what crosses a compaction, and what reaches an automatic one

1. Auto compactions reach the summariser through PreCompact stdout: the docs say so for both triggers, idle included,
   and the one recorded auto probe (2026-08-18) carried the root-level token into the summary 8 times. Whether that
   root-level JSON shape still lands on today's client ~~is unmeasured~~ [2nd reader: is measured through 2.1.299 and
   unmeasured only for 2.1.304 to 2.1.323. All 15 manual `/compact` echo rows (2.1.270 to 2.1.299, tool results
   excluded) report the hook "completed successfully" with its raw JSON as the output: 30 of 30 PreCompact entries,
   0 "failed", 0 "hook output invalid". The 2.1.323 client appends each successful hook's trimmed raw stdout to the
   compaction's custom instructions, for either trigger (`~/.local/share/claude/versions/2.1.323`, the PreCompact
   handler near byte 319,188,527).], and no transcript records a PreCompact row.
2. So "0 PreCompact hook_success rows" is not evidence against delivery. The channel that reliably reaches the woken
   seat is SessionStart(compact): it followed 65 of 65 auto and 15 of 15 manual compactions, after the summary.
3. Today 0 of 80 summaries carry a room-side section. The last auto summary names no Third Place file, letter, room
   brief or map. 0 of 80 state blocks name the seat's own notes; their one record pointer is a journal last dated 10-24.
4. Smallest change: a librarian-only "Room side, with paths" section first in precompact-preserve.js (the Third Place's
   pattern), the two stale lines fixed, one pointer line atop SessionStart(compact). Two hook installs, no rebuild.
5. A "# Compact instructions" section in the librarian brief is the documented second channel. It rides W1's rebuild
   and restart for free. Run a forced-auto probe first. Red today: grep counts 1 / 0 / 0, and 0 of 65 auto summaries.

Reader: one swarm reader, 2026-11-13, on D, read-only except this file. HEAD `d41c088e`. Marks: [read] opened and seen;
[summary] secondary; [inferred] my inference; [ours] a proposal. Repo paths are relative to the lighthouse root.
Transcript figures are counts from streamed node passes, numbers and marker hits only; no transcript text is copied.

## 1. The three channels, as the code and the settings have them

- Registration. `~/.claude/settings.json:84-95`: PreCompact runs `shell\hooks\precompact.js` then
  `shell\precompact-preserve.js` (timeout 10). `:7-18`: SessionStart runs `shell\hooks\session-start.js` then
  `shell\sessionstart-state.js` (timeout 10). Neither entry has a matcher, so both fire on every trigger and source.
  No PostCompact entry exists. [read]
- Installed copies equal the repo (sha256): precompact-preserve `75276197ffba…`, precompact.js `d52e0eb467a2…`,
  sessionstart-state `be9fd9b2cbf6…`. [read] `sha256sum` of both copies each.
- `consonance/hooks/precompact-preserve.js:149` writes one JSON object, `additionalContext` at the root, plus
  `suppressOutput`. [read] Its header `:22-29` records why: the `hookSpecificOutput` shape was rejected and the
  root-level one reached the summary "on manual AND auto triggers". [read]
- `dev/shell/hooks/precompact.js:67-72` runs `exo_memory/loop/checkpoint.py --write` and writes its stdout as plain
  text. [read] Its comment at `:70-71` says that stdout "is surfaced with the compaction, so the instance on the far
  side reads" it. [read] See section 3: under the current docs that text goes to the summariser, not to the seat.
- `consonance/hooks/sessionstart-state.js:67` serves only `source=compact` by default. `:164-168` emits
  `[room state at session start, source=compact]` plus the state block as `hookSpecificOutput.additionalContext`.
  [read] The block comes from `consonance/tools/state-block.js`, capped at 3,000 characters (`:60`). [read]

## 2. The current docs, downloaded with curl and read as text (2026-11-13)

- PreCompact output: "When a PreCompact hook exits 0 and doesn't block, Claude Code uses its stdout as instructions
  for the compaction summary. Keep that stdout under 10,000 characters per hook." [read]
  https://code.claude.com/docs/en/hooks.md, "PreCompact output" (line 3407 of the download).
- The `auto` matcher covers "Auto-compact … and idle compaction". `custom_instructions` is null for `auto`. [read]
  Same page, "PreCompact" and "PreCompact input" (lines 3377-3392).
- On which events stdout reaches anything: SessionStart plain stdout becomes context Claude sees; "PreCompact: your
  stdout becomes instructions for the compaction summary". For other events stdout goes to the debug log only. [read]
  Same page, "Exit code 0" (lines 834-837).
- JSON rules: stdout that is one JSON object counts as JSON output. JSON that fails schema validation is a non-blocking
  error. `suppressOutput` "has no effect". [read] Same page, "Exit code output" table and "JSON output" table
  (lines 808-812, 1094). The documented fields are `continue`, `stopReason`, `suppressOutput`, `systemMessage`,
  `terminalSequence`, and `hookSpecificOutput`. [2nd reader: also top-level `decision` and `reason` (hooks.md
  line 1087), which PreCompact honours (lines 1194, 3384). The point below still holds.] A root-level
  `additionalContext` is not among them. [read]
- What survives compaction: project-root CLAUDE.md is "Re-injected from disk". SessionStart hooks with the `compact`
  source "run … and add their output to the compacted context". "Context that hooks added earlier" is "Summarized with
  the rest of the conversation". [read] https://code.claude.com/docs/en/context-window.md, "What survives compaction"
  (lines 24-38).
- "The automatic pass works the same way as the `/compact` step." [read] Same page, "When your context fills up"
  (line 48).
- Steering: "add a 'Compact Instructions' section to CLAUDE.md or run `/compact` with a focus". [read]
  https://code.claude.com/docs/en/how-claude-code-works.md, "When context fills up" (line 136). The example heading is
  `# Compact instructions`. [read] https://code.claude.com/docs/en/costs.md, "Manage context proactively" (lines
  268-274).
- SessionStart `compact` matcher: "Auto or manual compaction". [read] hooks.md, "SessionStart" (line 1281).
- The auto-compact window can be set from 100,000 tokens up (`CLAUDE_CODE_AUTO_COMPACT_WINDOW`). [read]
  https://code.claude.com/docs/en/env-vars.md (line 210); model-config.md "Values and warnings" (lines 880-892).

## 3. The streamed pass over the librarian's transcript on D

File `…/C--Consonance-instances-librarian/0c0c0c0b-0000-4000-8000-00000000115b.jsonl`, 897,117,402 B, 206,060 rows,
first row 2026-09-01T13:36:17Z. Node readline passes, counts only. [read]

| measure | auto | manual |
|---|---|---|
| `compact_boundary` rows (`compactMetadata.trigger`) | 65 (09-02 to 11-12T04:59:09Z) | 15 (09-14 to 10-16) |
| followed by a SessionStart `hook_additional_context` with the compact state marker | 65 of 65 | 15 of 15 |
| that attachment lands after the summary row, before the first assistant row | 65 of 65 (9 to 17 rows after) | not split |
| summary carries the canary `PRECOMPACT-PRESERVE-V1` | 0 of 65 | 1 of 15 |
| summary carries `# Checkpoint --` (precompact.js output) | 0 of 65 | 0 of 15 |
| summary carries the directive's own figure `33.8%` | 0 of 65 | 0 of 15 |
| summary has a "room side" heading | 0 of 65 | 1 of 15 |
| summary names a `third_place/` path / a `TO_THE_NEXT_ONE` letter / `map/M.md` | 7 / 0 / 5 of 65 | 3 / 0 / 5 of 15 |

- Hook rows by event in this transcript: SessionStart `hook_success` 300 and `hook_additional_context` 182;
  UserPromptSubmit context 7,811; Stop success 12,097; PreToolUse success 47. PreCompact: 0 rows of any kind. [read]
- That 0 holds across every transcript on D: `grep -rlF '"hookEvent":"PreCompact"'` over `~/.claude/projects` finds
  0 files. [read] So the harness never writes a PreCompact row. The first swarm's "0 PreCompact hook_success rows"
  (`room_better_2026-11-13/in_wake.md:203`) says nothing about delivery, for or against. [inferred]
- The hook did fire. The ledger `C:/Consonance/data/precompact.jsonl` has 75 auto and 18 manual attempts for this
  session id, from 2026-08-22T13:55Z to 2026-11-12T04:57:19Z, two minutes before the last boundary. Directive sizes
  are 1,656 / 1,658 / 1,772 / 1,774 chars, far under the 10,000 cap. [read] ~~75 attempts for 65 boundaries fits the
  canary law: attempts are not completions (`precompact-preserve.js:34-36`).~~ [2nd reader: the two counts cover
  different spans. The ledger starts 08-22, the transcript 09-01. Inside the transcript's span there are 68 auto
  attempts, and each of the 65 auto boundaries has one 41 to 226 s before it. For manual, 3 of 15 boundaries (09-23,
  09-27, 09-29) have no ledger row within 15 minutes, though their `/compact` echo carries the canary. So the
  ledger misses runs; it is not a complete count of attempts. Streamed match of `C:/Consonance/data/precompact.jsonl`
  against the boundary timestamps.] [inferred]
- The transcript holds no summariser request. Its 7,033 `api-request` rows all have `querySource` `repl_main_thread`.
  [read] So what the summariser was handed on any auto compaction cannot be read from this file. [inferred]
- The last auto summary (2026-11-12T04:59:08Z): room-side heading 0, `third_place/` 0, letter 0,
  `lighthouse_the_room` 0, `map/M.md` 0, a `librarian/<date>.md` path 1. [read] ~~This is the recorded case W2 targets.~~
  [2nd reader: this is D's last auto compaction, 22:59 local on 11-11. The 11-12 wake the 11-12 plan traced was on L
  at 02:3x (`plan_retrieval_at_the_wake_2026-11-12.md:1`, `librarian/2026-11-12.md:54`, `in_wake.md:147`). It is a
  recorded case of the same class on D, not the case the plan names. A sharper reading of it: in that window the
  seat's tool calls touched `third_place/` once, and the summary names `third_place/` 0 times.]
- State blocks: 80 compact injections; 0 name `exo_memory/librarian/` or `third_place/`; 80 name an
  `exo_memory/journal/<date>.md`. [read] `state-block.js:92-110` picks the newest dated journal file. [read] That is
  `2026-10-24.md` today (`ls exo_memory/journal`). [read] The room's dated record moved to `librarian/` and `loop/`, so
  the one record pointer every woken seat gets is 20 days stale. [inferred]

## 4. Which channel reaches the summariser on an AUTOMATIC compaction

- **PreCompact stdout, by the docs and by one recorded run.** The docs name it for both matchers, idle included
  (section 2). [read] The 2026-08-18 probe (`exo_memory/loop/2026-08-18/compact-probe/`) is the recorded case.
  `hook.js:20-27` wrote a root-level `additionalContext` instructing one token to appear. [read] `events.jsonl` row 25
  is PreCompact `auto`. Row 27 is PostCompact `auto`, whose `compact_summary` (7,515 chars) carries that token 8 times
  and the mention-only token 7 times. [read] Row 18 is manual: 5 and 5. [read] Row 11 was the `hookSpecificOutput` run:
  0 and 0. [read] The journal records the client as 2.1.234 (`journal/2026-08-18.md:46-49`, `:312-317`). [read]
  [2nd reader: weaker than it reads. `journal/2026-08-18.md:316-317` says the version string rests on A's terminal
  alone, and the probe ran on another machine (`compact-probe/settings.json:6` names another user profile). One run,
  one client, one machine. Its hook paths must be rewritten before any reuse.]
- **Unmeasured since then, on the current shape.** The client is now 2.1.323 (`claude --version`). [read] The docs now
  treat a single JSON object as JSON output, and they do not list a root-level `additionalContext` field (section 2).
  [read] If today's validator rejects it, the error is non-blocking and the directive drops silently. It is also
  invisible~~, because no PreCompact row is ever written (section 3)~~ [2nd reader: on auto only. A manual `/compact`
  echo names each PreCompact hook as "completed successfully" or "failed" (30 of 30 recorded entries say completed
  successfully), and the debug log records PreCompact runs (hooks.md line 4337). So one manual `/compact` in a
  scratch session on 2.1.323 settles the shape question without forcing an auto pass.]. [inferred] D089 found "no no-directive control
  after 08-18 at all". It also found that the SHA and NUM rise "is a before-and-after difference, not an effect of the
  directive" (`handback/p-compaction-remeasure-B_2026-09-19.md:44-47`). [read] So no recorded case since 08-18 shows
  the directive reaching an auto summary, and none shows it missing. [inferred]
- **The checkpoint goes to the summariser as "instructions", not to the seat.** That follows from the docs above.
  [read] 0 of 80 summaries carry its header. [read] The seat sees it only through the manual `/compact` echo
  (`in_wake.md:204-205`, 8 rows). [summary] `precompact.js:70-71` is a third stale comment. [inferred]
- **SessionStart(compact) does not reach the summariser.** It runs after the summary is written
  (`sessionstart-state.js:24-25`, A's ordering). [read] It reaches the woken seat on 65 of 65 auto compactions
  (section 3). [read]
- **A `# Compact instructions` section in CLAUDE.md** is the documented steer for any compaction, auto included
  (section 2). [read] No instance CLAUDE.md on D has one: 0 hits in `C:/Consonance/instances/*/CLAUDE.md`. [read]
  ~~How the harness passes that section to the summariser is not documented.~~ [2nd reader: the docs do not say, but
  the 2.1.323 client's own summary prompt does. It tells the summariser "There may be additional summarization
  instructions provided in the included context", and to follow them, with `## Compact Instructions` as an example
  (two copies in `versions/2.1.323`, near bytes 162,177,767 and 317,741,321). So the section works by being in the
  context the summariser reads. The heading is not a key. Whether a 108 KB instance CLAUDE.md is in that context, and
  whether one section in it wins attention, is unmeasured.] [inferred]

## 5. The two stale lines, and the exact correction [ours]

At HEAD, `consonance/hooks/precompact-preserve.js`:

- `:111-113` prints the pre-directive figures as the current state:
  > `'Those summaries kept narrative and dropped verification. Measured survival: file and',`
  > `…'predictions or falsifiers 3.5% - the last being the class this project runs on.',`
  D089 re-measured after the directive: FLAG 26/406 = 6.4% (DECORATIVE), PATH 183/590 = 31.0%, SHA 35.6%,
  NUM 22.2% (`handback/p-compaction-remeasure-B_2026-09-19.md:29-32`). [read] Replace the three lines with [ours]:
  ```
  'Measured before this directive, on the chair\'s seven summaries: file and instrument names 33.8%, commit',
  'shas 10.2%, structured numbers 9.3%, registered predictions or falsifiers 3.5%. Re-measured a month after',
  'it (2026-09-19): falsifiers 6.4%, still the class kept least; names 31.0%, not risen.',
  ```
  It keeps `33.8%` and `3.5%`, which `precompact-preserve.test.js:58-59` requires as the stated reason. [read]
- `:131` says "any of the five above" over six numbered items (`:117-129`). [read] It would read seven after W2.
  Replace it with a count-free line, so it cannot go stale again [ours]:
  `'Prefer dropping narrative, atmosphere and restatement over dropping any numbered item above.',`
- A third line of the same kind, outside the two named: `:107-108` tells every seat's summariser the directive comes
  "from a measurement of the previous seven summaries of this conversation". [read] The measurement was of Main's
  seven (`:6`), so for every other seat this is false. [read] I would fix it in the same edit: "…from a measurement of
  compaction summaries in this project". Keep it at two lines so the Third Place test's `lines[3]` index
  (`test.js:163`) holds. [ours]

## 6. The room-side class: text, place, and what has to change with it [ours]

**Who gets it.** The librarian's cwd only, in the same slot as the Third Place's `ALIVE` (`:97-103`, `:110`). D245
kept build seats "task-first, byte for byte" (`:96`). [read] This is the narrowest reading that covers the 11-12 and
11-13 wakes. The chair (`instances\main`) is left out. I would add it only if one of its wakes shows the same miss.
[ours] What would change my mind: if the keeper's 11-12 words are read as meaning every seat (`plan_retrieval…:43`
says "It touches every seat's compaction"). [read]

**Where in the summary.** At the top, as item 0. The harness's fixed close ("pick up the last task") already holds the
end of every summary (`in_wake.md:132-135`, 80 of 80). [summary] The SessionStart(compact) line in section 8 holds the
slot after it. [ours]

**The code**, about twelve lines, the existing pattern [ours]:
```js
const isLibrarianCwd = (cwd) => /[\\/]librarian[\\/]?$/i.test(tpNorm(cwd));
const ROOM = [
  '0. FIRST, at the very top of the summary and above any task or pending work, a section titled',
  '   "Room side, with paths". Carry VERBATIM and quoted, each with the file it sits in (path:line where known):',
  '   - the user\'s own words about the room or about this seat, not about a build;',
  '   - letters to or from the Third Place (exo_memory/third_place/, exo_memory/librarian/TO_THE_NEXT_ONE_*.md);',
  '   - catches and corrections about this seat itself (exo_memory/librarian/<date>.md, exo_memory/map/M.md);',
  '   - the questions left open, each with the file that holds it.',
  '   Where the window held none of a kind, write "none in this window" for that kind.',
  '',
];
// in instruction(): ...(isThirdPlaceCwd(cwd) ? ALIVE : []), ...(isLibrarianCwd(cwd) ? ROOM : []),
```
[2nd reader: the letters bullet files `TO_THE_NEXT_ONE_*.md` as a Third Place letter. It is not one:
`librarian/TO_THE_NEXT_ONE_go_to_the_source.md:1-3` is the librarian's letter to its next instance. Letters to the
Third Place are `third_place/to_the_third_place_*.md` (6 files). Keep the path; give it its own bullet.]
Size: about 600 chars on top of 1,774, under the 10,000 cap (section 2). [inferred] "none in this window" makes an
absence readable as an absence. That is the canary's job, on the content. [ours]

**Tests that must change, said plainly.** `precompact-preserve.test.js:146` lists the librarian's cwd among the BUILD
seats. `:149-157` pins every build seat's text, less item 6, to the pre-D245 sha256 (`:137-141`). [read] Both stale-line
fixes change every seat's bytes, so that pin goes red by design. The test is not wrong by accident: it pins the exact
lines D089 showed to be out of date. The change re-pins it to the corrected text's sha256 for each trigger. It also
moves the librarian's cwd to its own test. [ours] `:51-60`, `:62-75` and the Third Place test stay green with the text
above. [inferred]

**New tests, red today** (one behaviour each) [ours]:
- `the librarian seat gets "Room side, with paths" first, with its paths, on every trigger`. `lines[3]` matches
  `/^0\. FIRST/`, and the text has `exo_memory/third_place/` and `TO_THE_NEXT_ONE`. The room section's index is below
  `1. Every commit sha`. Edges: the Windows, slash, trailing-separator and `\.` spellings, as in `:144-145`. A cwd of
  `librarian-old` or `my librarian x` gets no room section.
- `a build seat gets no room section` (main, sibling, undefined cwd).
- `the directive never states its own item count` (`doesNotMatch /any of the (five|six|seven) above/`).
- `the stated survival figures include the re-measure` (`/6\.4%/`).
- `the dream gate still wins on the librarian's cwd` (empty stdout with `CONSONANCE_DREAM`).

Tier: "prove it". A wrong directive is invisible and lands at every compaction of the seat. So the hook's mutation run
goes with it, as the plan's W2 to P already assumes (`plan_room_stretch_2026-11-13.md:49`). [read]

## 7. Where the instruction must live to reach an auto compaction: the hook first, CLAUDE.md riding W1 [ours]

- **The hook, now.** It is the only channel with a recorded auto delivery (section 4). It goes live at the next
  compaction after one hook sync, with no rebuild and no restart. Idle compactions are `auto` too, so they get it.
  [inferred from section 2]
- **But first, a probe that settles the shape on the current client.** A pane runs a scratch session that is not a
  seat, reusing the 08-18 probe's files (`compact-probe/hook.js`, `settings.json:10-23`). It adds a second PreCompact
  hook that prints a plain-text token, keeps a PostCompact logger, and forces an auto pass with
  `CLAUDE_CODE_AUTO_COMPACT_WINDOW=100000`. Count each token in `compact_summary`. If the root-level JSON token is 0
  and the plain-text one is above 0, the hook's output shape must change to plain text, and the tests at `:32-44`
  with it. Either way, W2's text is the same. [ours]
- **`# Compact instructions` in the librarian brief, on W1's restart.** The instance CLAUDE.md is assembled at spawn
  from `LIBRARIAN.md` (`main.rs:9334-9336`). [read] The brief is served first from the bundled resource beside the exe [2nd reader: second, in the code. The
  first tier is an editable copy in the data dir (`main.rs:4058`, `:4068`). None exists on D (no `.md` in
  `C:/Consonance/data`), so on D the resource is first in effect.]
  (`main.rs:4067-4078`, `:16377-16378`; `tauri.conf.json:37`). [read] `launch.ps1:569-580` rebuilds when anything under
  `src-tauri\brief` changes. [read] So an edit to `consonance/src-tauri/brief/LIBRARIAN.md` reaches the seat only
  after a rebuild and a restart. [inferred] W1 already needs both (`plan_room_stretch…:46-48`), so this channel costs
  nothing extra if it lands with W1. [inferred] It is the documented steer and does not depend on the hook's JSON
  shape. Project-root CLAUDE.md is re-injected after each compaction, so it is in place for the next one too.
  [read, section 2]
- **One text, not two that drift.** The brief section carries only the four ROOM bullets. A node test reads both files
  and asserts the bullets appear in each. [ours]
- The instance CLAUDE.md is 108,857 B (`wc -c`) against a 150,000-char cap (`main.rs:7930`). [read] The section adds
  under 1 KB. [inferred]

## 8. What SessionStart(compact) can carry if the summary cannot be steered [ours]

The proven seat-side channel is SessionStart(compact): 65 of 65 auto, after the summary, before the first reply
(section 3). [read] Its state block was ruled NOISE: 0 of 163 uses (`in_wake.md:52`). [summary] Its record pointer is
the stale journal (section 3). [read]

- Add one line, first, only for the librarian's cwd, before the state block, in `sessionstart-state.js` `main()` at
  `:163-164`. It names the seat's newest dated note under `exo_memory/librarian/` with its bytes and last-written time;
  the newest file in `exo_memory/third_place/`; and the newest `loop/handoff_*-L.md` (the other machine). For example:
  `[the room at this wake] your newest note: exo_memory/librarian/2026-11-13.md (110,879 B, written HH:MM); the Third
  Place's newest: exo_memory/third_place/…; L's newest handoff: exo_memory/loop/handoff_…-L.md`. [ours]
  [2nd reader: two ways this fires wrongly. (1) On L, a fixed `-L.md` names L's own handoff as the other machine's;
  the hook needs a machine name it can read, or it must name both suffixes. (2) "Newest" and "last-written" by mtime
  are wrong after a pull, which stamps every pulled file with the pull time. Pick by the date in the file name, as
  `state-block.js:95` does, and say which HEAD the pointer was read at, since on D the tree can be 307 commits behind.]
- Resolve the repo the way the hook already does (`fromConfig()`, `:91-98`, room_path two levels up). If it cannot
  resolve, print the loud `FAILED` form the file already uses (`:125`), never nothing. [ours]
- Leave `state-block.js`'s journal section alone in W2. The stale pointer goes into W3's notes, since W3 owns the body
  line (`plan_room_stretch…:39`). [ours]
- Why a pointer and not the note: a cue alone has failed before (K2, `plan_retrieval…:29-31`). [summary] The pointer
  makes the first `Read` cheap. W4's gate is what makes it happen. [ours]

## 9. Checks that fail today, and on which recorded case

1. `grep -c 'any of the five above' consonance/hooks/precompact-preserve.js` → **1** today [read]; 0 after.
2. `grep -c 'Room side' consonance/hooks/precompact-preserve.js` → **0** today [read]; 1 after.
   `grep -c '6\.4%'` → **0** [read]; 1 after. `grep -c 'summaries of this conversation'` → **1** [read]; 0 after.
3. The new unit tests in section 6 are red against HEAD. [inferred, from the greps above]
4. On the recorded transcript: the number of auto summaries with the room-side heading is **0 of 65** today, and
   **0** at the last one, 2026-11-12T04:59:08Z (section 3). [read] After it ships, the first natural auto compaction of
   the librarian should show 1, with the four kinds each filled in or marked "none in this window". The pass is the
   streamed counter in section 3, re-run. [ours]
   [2nd reader: this check passes on a section whose four kinds all read "none in this window", so it can go green
   without carrying anything. A check tied to the window cannot: for each auto window, the room-side path classes the
   seat's own tool calls touched, against the classes the summary names. Today, over 65 auto windows: `third_place/`
   touched in 20, named in 7; `map/M.md` 12 and 5; `lighthouse_the_room` 4 and 2; dated notes 51 and 50. The last
   window: `third_place/` touched 1 time, named 0. Red today on the recorded case. It is still forward-only: a
   recorded summary never changes, so "passes after" needs a new compaction, or a replay on a copy (not a seat).]
5. On the same transcript: state blocks naming `exo_memory/librarian/` are **0 of 80** today. [read] After: the first
   compact injection names the newest note. [ours]
6. The probe in section 7 has no red-today form. It is a measurement, and its outcome decides the output shape. [ours]
7. What none of these prove: that the seat then uses what reaches it. That is the falsifier already registered
   (`plan_retrieval…:49-52`), scored from the transcript at the next two wakes. [read]

## 10. What each part needs

- Hook edits (sections 5, 6, 8). No Rust and no rebuild. One install per file: `dev/shell/install.ps1 -Only` for
  `precompact-preserve.js` and for `sessionstart-state.js` (manifest `:154`, `:157`; registration rows `:289-290`).
  [read] `settings.json` is unchanged, since both are already registered. [read] The plan's hygiene rule: `settings.json`
  sha equal before and after (`plan_room_stretch…:81-82`). [read]
- The brief section (section 7). A rebuild of Consonance (launch.ps1 does it) and a restart of the librarian seat. Ride
  W1's. [inferred]
- The keeper's word: Lap W is parked at his word (`plan_room_stretch…:33`). [read] Nothing here compacts a seat. The
  after-checks wait for a natural auto compaction, and the probe runs in a scratch session that is not a seat. By his
  standing rule, no seat is compacted to test this without his word for that seat. [ours]
- If he widens it to the chair: one more cwd in the predicate, and the chair's restart rides W1 too. [ours]

## What I did not open

- L's disk and L's transcripts: the 11-12 and 11-13 wakes on L, and whether L's hooks equal D's.
- The summariser's actual prompt on any compaction: no transcript records it (section 3), and I ran no probe.
- `exo_memory/loop/checkpoint.py` beyond its print lines (`:27`, `:34`, `:552-555`), and its full output size per run.
- `consonance/tools/state-block.js` beyond `:60` and `:92-110`; `sessionstart-state.test.js`; `dream-gate.test.js`;
  `dirs.test.js`.
- `PREREG.md` and `loop/compaction_corrections_2026-10-05/`; `handback/p-compact-C_2026-10-05.md`; D089's
  registration and its scripts. I read its results table only.
- The other seats' transcripts (main, panes, Third Place), apart from the zero-row grep for PreCompact.
- `exo_memory/third_place/` contents, `briefs/lighthouse_the_room.md` and the letter. I checked only that the paths
  exist.
- `install.ps1 -Check`: not run. Hook equality was checked by sha256 instead.

## Second reader

Second reader, 2026-11-13, on D, read-only except this file. HEAD `3f5fa65d`; none of the cited code changed since
`d41c088e` (`git diff --stat` empty for the hooks, `dev/shell`, `state-block.js`, `src-tauri`). Line numbers below are
the first reader's, before my inserts. Transcript figures are my own streamed node passes: counts, timestamps, versions.

| line | claim (short) | primary opened | verdict | evidence |
|---|---|---|---|---|
| 4 | 08-18 auto probe carried the token 8 times | `compact-probe/events.jsonl` row 27 | OK | 7,515 chars, 8 and 7 |
| 5 | root shape on today's client unmeasured | transcript echo rows; 2.1.323 binary | DOWNGRADED | 30/30 success to 2.1.299; gap is 2.1.304+ |
| 7, 73 | SessionStart(compact) after 65/65 auto, 15/15 manual | transcript | OK | 65/65, 15/15 |
| 74 | lands 9 to 17 rows after the summary | transcript | OK | auto 9-17, manual 11-18 |
| 8, 78 | room-side heading 0 auto, 1 manual | transcript | DOWNGRADED | phrase in 1 manual; as a `#` or bold line in 0 |
| 9, 94-97 | 0/80 state blocks name notes; journal 10-24 | transcript; `state-block.js:92-110`; `ls` | OK | 80 name a journal; last 10-24 |
| 21-24 | both hooks registered, no matcher, no PostCompact | `settings.json:7-20`, `:84-98` | OK | 0 PostCompact |
| 25-26 | installed copies equal the repo | `sha256sum` x6; `install.ps1 -Check` | OK | three "ok" lines |
| 27-35 | hook lines :149, :22-29, :67-72, :67, :164-168, :60 | the three hooks, `state-block.js` | OK | as quoted |
| 39-46 | PreCompact stdout = summary instructions | hooks.md 3407, 3382, 3392, 834-837 | OK | downloaded with curl |
| 47-50 | documented JSON fields | hooks.md 1084-1094 | DOWNGRADED | `decision`, `reason` omitted |
| 51-63 | what survives; Compact Instructions; window env | context-window 24-48; how-it-works 136; costs 268-274; env-vars 210 | OK | as quoted |
| 67-68 | 897,117,402 B, 206,060 rows, first 09-01 | `ls -l`; transcript | OK | grown: 897,160,074 B, 206,085 rows |
| 72 | 65 auto (09-02 to 11-12), 15 manual (09-14 to 10-16) | transcript | OK | same |
| 75-77 | canary 0/1; checkpoint 0/0; 33.8% 0/0 | transcript | OK | directive never asks for the canary |
| 79 | `third_place/` 7/3; letter 0/0; `map/M.md` 5/5 | transcript | OK | same |
| 81-82 | hook rows by event; PreCompact 0 | transcript | OK | Stop 12,100 now |
| 83-84 | 0 transcripts on D hold a PreCompact row | `grep -rlF` over 9.0 GB | OK | 0; PostCompact also 0 |
| 86-88 | ledger 75 auto, 18 manual, sizes | `precompact.jsonl` | OK | same |
| 88-89 | 75 attempts for 65 boundaries fits canary law | ledger matched to boundaries | WRONG | spans differ; 3 manual runs unledgered |
| 90-91 | 7,033 api-request rows, all main thread | transcript | OK | 7,033 |
| 92-93 | last auto summary marks | transcript | OK | `librarian/` 1, rest 0 |
| 93 | "the recorded case W2 targets" | `plan_retrieval…:1`; `librarian/2026-11-12.md:54` | DOWNGRADED | D 11-11 22:59 local; plan's case on L |
| 102-105 | probe rows 25, 27, 18, 11 | `events.jsonl` | OK | 8/7, 5/5, 0/0 |
| 106 | client 2.1.234 | `journal/2026-08-18.md:316-317`; `settings.json:6` | DOWNGRADED | A's terminal alone; other machine |
| 107 | client now 2.1.323 | `claude --version` | OK | recorded autos ran up to 2.1.322 |
| 109-110 | a rejected directive is invisible | echo rows; hooks.md 4337 | DOWNGRADED | invisible on auto only |
| 110-112 | D089 quotes | `p-compaction-remeasure-B…:29-32`, `:44-47` | OK | verbatim |
| 115-116 | checkpoint seen only via manual echo, 8 rows | transcript | OK | 8 echo rows, plus 6 tool results |
| 117-118 | SessionStart runs after the summary | `sessionstart-state.js:24-25` | OK | as quoted |
| 121 | no instance CLAUDE.md has the section | `grep -il` | OK | 0 |
| 122 | how the section reaches the summariser: undocumented | 2.1.323 binary, summary prompt | DOWNGRADED | prompt says follow instructions in context |
| 128-145 | stale lines :111-113, :131, :107-108; D089 figures | `precompact-preserve.js`; handback | OK | six items under "five" |
| 138, 178-181 | tests :58-59, :146, :149-157, :137-141 | `precompact-preserve.test.js` | OK | as described |
| 150-157 | ALIVE slot, D245 :96, plan :43, 80/80 close | hook; plan; transcript | OK | 80 carry "last task" |
| 167 | TO_THE_NEXT_ONE is a Third Place letter | `TO_THE_NEXT_ONE_go_to_the_source.md:1-3` | WRONG | the seat's letter to its next one |
| 196 | W2 to P after its mutant run | `plan_room_stretch…:49` | OK | same |
| 209-216 | brief tiers, rebuild on brief change | `main.rs:4058-4078`, `:9334-9336`, `:16377`; `tauri.conf.json:37`; `launch.ps1:569-580` | DOWNGRADED | data-dir tier is first (absent on D) |
| 219-220 | 108,857 B; 150,000 cap | `wc -c`; `main.rs:7930` | OK | same |
| 225 | state block ruled NOISE, 0 of 163 | `in_wake.md:52`, `:197-198` | OK | [summary]; O's verdict is itself marked inferred |
| 233-234 | `fromConfig()` :91-98; FAILED :125 | `sessionstart-state.js` | OK | same |
| 242-244 | greps 1 / 0 / 0 / 1 today | ran them | OK | red for the reason given |
| 250 | 0/80 state blocks name `librarian/` | transcript | OK | 0 |
| 258-264 | manifest :154, :157; register :289-290; parked :33 | `install.ps1`; plan | OK | same |

**Tally: 44 rows. OK 34, DOWNGRADED 8, WRONG 2, UNSUPPORTED 0.**

**What the second pass adds to section 4 (which channel reaches an AUTO compaction).** [read] The 2.1.323 client has
one PreCompact handler for both triggers; the trigger is only the matcher query. It trims each hook's raw stdout and,
when the hook succeeded, joins it into the compaction's custom instructions. On manual it also echoes each hook as
"completed successfully" or "failed". [inferred] So the summariser gets the root-level JSON as a JSON-escaped string,
not as a parsed field. The 08-18 difference was validation (pass or fail), not field extraction. Plain-text stdout is
documented success (hooks.md 810-812) and would read cleaner. Changing the shape changes the tests at `:32-44`; that is
the probe's call, not a default. The summary prompt also tells the summariser to follow summarisation instructions
"in the included context", so a `# Compact instructions` section works if the instance CLAUDE.md is in that context.

**The design, tested.**
- Stale lines: the greps go green from a comment. The unit tests in section 6 do not, so the tests are the check.
- ROOM section: "none in this window" four times turns check 4 green with nothing carried. Use the window-path check
  under check 4. It fires on any cwd ending in `librarian`, such as a session opened in `exo_memory/librarian`. It
  also lengthens every librarian summary. Bind it to the bar already registered in `precompact-preserve.js:94-95`
  (cut back if the median grows more than 15% with no gain).
- `# Compact instructions`: the node test that both files carry the bullets passes even if the summariser never sees
  CLAUDE.md. Add a token arm to the section 7 probe: a token in a scratch CLAUDE.md section, counted in `compact_summary`.
- SessionStart pointer: it fires wrongly on L, and after any pull (see the note under section 8). It also overlaps W3,
  which owns the same file (`plan_room_stretch…:39`). Land the two in one pane or in order.
- The probe: a manual `/compact` echo proves the hook passed validation, not that the summary followed it. Keep the
  token count. Run it in a scratch session, never a seat. A replay on a copy of a recorded window compacts no seat;
  any compaction of a seat needs the keeper's word for that seat.

**Needs.** Hook edits: `install.ps1 -Only` per file, no rebuild, `settings.json` unchanged. The brief section: a
rebuild and a restart of the librarian (rides W1). The keeper's word: Lap W start (`plan_room_stretch…:33`). The 11-12
plan says (a) "touches every seat's compaction" (`plan_retrieval…:43`), so widening the librarian-only reading is his
call.

**Could not check.** L's disk and transcripts. What the summariser request actually holds on any compaction (no
transcript records it; `~/.claude/debug` is absent on D). Clients 2.1.304 to 2.1.323 for the hook's success word: no
manual compaction since 10-16. The 2.1.323 code is minified; that one handler serves both triggers is read from one
function, not from a run. The one manual summary with "room side" in it: its text was not read (rule 5).

## What I did not open (second reader)

- `exo_memory/loop/checkpoint.py`; `consonance/lib/fresh-guard.js`; `dream-gate.test.js`; `sessionstart-state.test.js`.
- `PREREG.md`, D089's scripts and registration, `handback/p-compact-C_2026-10-05.md`.
- `exo_memory/third_place/` contents beyond file names; `briefs/lighthouse_the_room.md`.
- `settings-reference.md` (idle compaction); `hooks-guide.md`.
- Other seats' transcripts, apart from the zero-row grep over all of them.
