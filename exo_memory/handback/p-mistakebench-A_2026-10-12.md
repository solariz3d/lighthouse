# p-mistakebench-A — D311 part 2 (ledger D312): the replay bench, dry-run on 3 dev units; seat A, 2026-10-12

**Result: the bench exists and ran. 3 dev units, baseline, 1 regeneration each: 3 of 3 returned a reply, 0 errors. Nothing was judged and no reply was read for its claim.** Branch `d311-a` (worktree `G:\consonance-worktrees\a-d311-wt`, from main `d99a6d80`); commit `39d14992`; local, named paths, not pushed. Files: `consonance/tools/mistake-bench.js`, `consonance/tools/mistake-bench.test.js`, and `exo_memory/handback/p-mistakebench-A_2026-10-12_evidence/dry/` = `runs.jsonl` (the 3 runs), `blind.json` + `key.json` (the shuffled set and its key), `context-sizes-census.json` (the context built for all 22 located dev units, no model call).

## What it does
- `node consonance/tools/mistake-bench.js pick --seed S --n 3` picks dev units by `sha256(seed|id)`, skipping an unlocated one. **Seed `d311-dry-2026-10-12` picked W054, W084, W021** (all librarian seat).
- `context <id>` rebuilds the erring turn's context from the seat's transcript and prints its sizes (no model call).
- `run --units … [--arm-file f --arm-label F1] [--run n] --out dir` takes the heavy-run lock, builds each context, regenerates with `claude -p`, and appends one row per run to `runs.jsonl`: unit, arm label, run number, model, prompt sha256 and size, context stats, reply, api time, wall time, tokens. An arm text, if given, is added once as a labelled block just before the closing instruction. A baseline has none.
- `blind --runs … --seed S --out dir` writes `blind.json` (id `R001`…, unit, the correction text as "wrongClaim", the reply: **no arm, no run number**) and `key.json` (id → unit, arm, run; errored runs listed apart). The runner keeps `key.json`; C reads only `blind.json`.
- Reused: the census list and its digest check (`units.json` `3e910cb0…`), `origin-read.js`'s event reader (copied, with the model kept per message), `claim-replay.js`'s `clean()` (Third Place lines out, key shapes and `"token"` fields redacted; E's `turn.js` uses the same shapes) on **every** line that goes into a prompt and on every reply. **No held-out unit is loadable**: the held-out list is not wired in.

## Approximation of the context — the bench's main weakness, said plainly
What the model sees in `claude -p` is a text rendering of the transcript, not the session the seat had. Checked where marked.
1. **The shelf is absent, not "as it stood".** The seat's standing context is its shell `CLAUDE.md` (librarian: 141,257 characters today; main: 72,464; checked: `ls -la`), which holds the room's master frame, the committee practice, the topic map and the seat's own map tail. **A transcript does not store it** (checked: the librarian's first 3 MB holds 0 copies of the master-frame heading). Only today's shell exists on disk, and it is not the one of the erring day. The replay's system prompt is two sentences (`SYSTEM_BASE`). Rebuilding the shell as of a date would mean running the shell generator at the commit of that date; I did not try it. Every dry-run reply was produced WITHOUT the shell, so a reply that differs from the original may differ for that reason alone.
2. **The harness's own system prompt and tools are absent.** `claude -p` runs with `--tools ""`, `--system-prompt`, `--setting-sources ""`, `--strict-mcp-config`, `--disable-slash-commands`, in an empty temp folder, with every `CONSONANCE_*` variable removed. checked: a smoke call on both models asked what instructions they could see beyond the system prompt and got "an account email note and an environment block, no CLAUDE.md, pulse, hook or shell context" from each. So the replay is clean of the room's hooks, but it still carries those two items, which the original also had in some form.
3. **No real tool results to act on, and no tools.** The model cannot run a check; the tool calls and results of the erring turn are shown as text up to the claim. **13 of the 22 located dev units stop at a tool CALL, not a text message** (checked: `context-sizes-census.json`, `stopKind`): the claim was written into a file or a ring by a Bash command. The replay asks for the next message in prose, so for those 13 the regenerated reply is a different medium from the original claim. That is a bigger gap than the others and C should know it.
4. **Truncation.** Per event (chars): history prompt 1,500, text 1,500, call 200, result 600, attachment 400; erring turn prompt 12,000, text 12,000, call 1,000, result 2,500, attachment 1,500; the compaction summary 30,000. Budgets: history 60,000 chars (newest kept, a marker says how many older events were left out), turn 60,000 (prompt first, newest events after). On the 22 located units: erring turn never over budget (0 events dropped); history dropped events on most (W054 74 of 235, W084 637 of 795, W021 657 of 806). A fact the seat read 200 events ago and the replay dropped is missing; a fact shown only in a result's tail past 2,500 chars is missing.
5. **Thinking is left out** (a model does not see its earlier thinking). Third Place lines are removed by `clean()`, as in every other lap; where a seat's call was wholly redacted in the transcript copy (the Third Place case), the replay cannot show it.
6. **Compaction.** The context starts at the last compaction summary before the erring turn (4 of the 22 have none and start at the session start). The summary is what the seat carried; it is cut at 30,000 chars.
7. **Model.** The seat's model at the claim, read from the transcript: 9 units `claude-fable-5-1`, 8 `claude-opus-5-5`, 4 `claude-opus-5`, 1 `claude-fable-5`. Only `claude-fable-5-1` and `claude-opus-5-5` have run through `claude -p` so far; the other two ids are untried. Sampling settings and the original's extended-thinking budget are not known.
8. **5 of the 27 dev units have no located claim second** (W012, W028, W082, W090, W096) and cannot be replayed until someone places the claim; the bench skips them.

## Measured per regeneration (3 runs; checked: `dry/runs.jsonl`)
| unit | model | prompt chars | input tokens | output tokens (of which thinking) | api time |
|---|---|---:|---:|---:|---:|
| W054 | claude-fable-5-1 | 69,284 | 31,350 | 3,405 (2,223) | 57.6 s |
| W084 | claude-fable-5-1 | 85,220 | 38,830 | 2,534 (1,576) | 38.8 s |
| W021 | claude-opus-5-5 | 86,250 | 39,465 | 1,205 (518) | 14.7 s |
Mean: 36.5k input tokens (all cache-creation, none read), 2.4k output, 37 s api / 38 s wall. The wall time for the three together was 1 m 56 s. n = 3, so the two models' times are from 2 and 1 runs. Replies were 3,048, 2,923 and 1,905 characters.

## Projected size of wave 2 (calls and time; an assumption, B's count is not sealed)
Assumption, stated: **k = 3 regenerations per unit per arm** (B's number replaces this). Per-regeneration mean from the model mix of the 22 located dev units (fable-class 10, opus-class 12), taking the fable-class at the fable-5-1 mean (48 s) and the opus-class at the one opus-5-5 run (16 s): **30 s per regeneration**.
- baseline, 22 units × k=3 = 66 regenerations ≈ **33 min**
- the 3 arms on dev, 3 × 22 × 3 = 198 regenerations ≈ **99 min** (an arm adds a few hundred to a few thousand characters; not counted)
- held-out 15: the baseline plus up to 3 passing arms, 4 × 15 × 3 = 180 regenerations ≈ **90 min** (the held-out contexts were not built, so their sizes are taken to equal the dev mean)
- **total 444 regenerations, about 3.7 hours serial.** In general 148·k regenerations. Runs go one at a time under the lock, so wall time is the sum.
- **Not measured, and could move this a lot:** (a) whether repeated regenerations of one unit within the cache window read the prompt from cache (the dry run read none); (b) a bench with the shelf (point 1 above) adds about 140,000 characters, roughly 35k tokens, to every prompt, about doubling the input; (c) the other two model ids.
*Dollar figures removed at the keeper's ruling, 10-12 (`loop/plan_mistake_bench_d311_2026-10-12.md:54`); they stay in git history.*

## Tests (consonance/tools/mistake-bench.test.js)
13 rows. **Red first:** all failed with `Cannot find module './mistake-bench.js'` before the module existed (checked). After: `13 pass / 0 fail` under the heavy-run lock. One row was wrong on its first run (it compared blind ids, which run R001… by design; it now compares the reply order, and that change is mine, not a rule change). The claim-in-a-tool-call row was added after the first real dry run found the claim sitting in a Bash call. Behaviours covered: context stops before the claim and holds nothing after it; starts at the last compaction; Third Place lines and a token field never reach the prompt; long results cut with a marker and an over-budget history drops oldest first; the unit's model is the last assistant model; an arm is placed once, labelled, before the instruction, and the baseline has none; the seeded pick; the `claude -p` arguments and the parse of reply and usage; a failed call is an error with NO reply, never an empty one; replies are cleaned; the blind set has no arm or run and a working key; errored runs are left out of the blind set. **No mutation run** (as asked). The real `claude -p` runner is not under test; it is exercised by the dry run and the smoke call.
portable-paths green (391 files, 0 new). carrier-drift GREEN.

## What you must know
- **I judged no reply.** I looked at lengths and the first words of each reply to see that each is a message and not an error. **Correction:** my read-back of `runs.jsonl` line 1 then printed W054's whole reply and its correction text to me; I did not compare them or form a view, but I have seen that one reply (W084 and W021 only by length and first words). The correction text is also in `blind.json`, as C is meant to have it.
- The blind set carries the correction text as "wrongClaim" so C can see what the claim was; it names the seat's own erring claim, so a reader who knows the room can recognise the unit. The arm and run are not in it.
- The prompts themselves are not committed (a prompt is up to 98,000 characters of cleaned transcript); each run row holds the prompt's sha256 and size, and the prompt can be rebuilt with `context <id> --out dir`.
- `runs.jsonl` holds the 64-hex prompt hashes; no key, token or Third Place text is in any output (checked: the only long hex strings in `dry/` are those hashes; the redaction shapes are the ones E's `turn.js` uses).

(Wave 1) NEXT: librarian dispatches B's sealed registration to A for the baseline replay of the 22 located dev units once B's regeneration count is in; E's arm texts go into `--arm-file` after that

## Baseline run (D311 wave 2 step 4, ledger D312; seat A, 2026-10-12)

**Result: 110 regenerations made, 110 returned a reply, 0 errored.** The 22 located dev units (the census's 27 minus W012, W028, W082, W090, W096, which have no located claim second) × k = 5, no arm, baseline only. E's held-out 15 were not touched. Nothing was judged and no reply was compared with its wrong claim. Branch `d311-a2` (worktree `G:\consonance-worktrees\a-d311a2-wt`, from main `f51fc8b0`), commit `f9db6bba`; local, named paths, not pushed. The dollar-figure scrub of the sections above is the two commits before it (`bd120a89`, `01ce6d76`).

### What was run, and the numbers (checked: `node` over `baseline/runs.jsonl`)
| | |
|---|---|
| calls made | **110** (22 units × 5 runs; each unit has exactly 5 rows) |
| calls errored | **0** (so no reason to give) |
| empty replies | 0; reply length 765 to 3,820 characters, median 2,283 |
| wall time of the whole run | **15 min 32 s** (`started.txt` 12:50:17Z, `finished.txt` 13:05:49Z), 4 calls at a time under one heavy-run hold |
| per call | mean 31.2 s api, 32.6 s wall, longest 90 s wall |
| by model (mean wall per call) | claude-opus-5-5 40 calls 15.9 s; claude-opus-5 20 calls 38.5 s; claude-fable-5-1 45 calls 42.2 s; claude-fable-5 5 calls 56.3 s |
| mean prompt size | **35,962 input tokens** per call (the CLI's count, cache reads included); 78,828 characters of rendered prompt; mean output 2,029 tokens |
Both previously untried ids, `claude-opus-5` and `claude-fable-5`, ran without error. The section above projects 30 s per regeneration, about 55 minutes for 110 run one at a time; four at a time took 15 min 32 s, and the measured mean was 32.6 s per call. Cache: 71 of the 110 calls read part of their prompt from cache (66% of all input tokens were cache reads), because five runs of one unit overlap in time; the dry run read none.

### The blind set, and where the key is
- `exo_memory/handback/p-mistakebench-A_2026-10-12_evidence/baseline/blind/blind.json` — **110 replies**, ids `R001`…`R110`, each with `unit`, `wrongClaim` (the correction text) and `reply`; no arm and no run number. Seed `d311-baseline-blind-2026-10-12`. sha256 of the file `5e7b84fb8685b87b99f41b3c3e2028e9613d21df4813a4b0d86ffbcd62aae419`.
- **The key is not in the repo or any path C reads**: `G:\consonance-worktrees\a-d311a2-key\key.json` (sha256 `34973110f59d41fb6fd7510671878b70ba58e076ec933095a46ab2e08edeeca5`), outside every worktree. It maps id → unit, arm, run. Because every run here is the baseline, the only thing it hides is the run number (1 to 5) within a unit; the unit is in the blind set.
- The word "baseline" appears 5 times inside reply texts (the models' own words); it is not an arm label.

### What to know about the run
- **The two named gaps stand and are all in this data:** the seat's shell is absent from every replay, and 13 of the 22 units have their claim in a tool call rather than in prose, so the regenerated text is a different medium from the original for those 13. These are the first suspects if validity fails (plan, §6).
- **Context built at run time, not frozen:** each call rebuilt its context from the live transcript. The transcripts are append-only and the contexts end at the claim second, so a rerun rebuilds the same context; each row's `promptSha256` lets anyone check (checked: all 5 rows of each of the dry-run units W054, W084 and W021 carry the same prompt hash as the dry run).
- **Output hygiene:** no `"token"` field, no key-shaped string and no Third Place line is in `runs.jsonl` (checked by grep; the redaction is the shared `clean()`). My additional check against actual secret values was vacuous: the config holds no value I could compare (0 values checked), so the protection is the redaction shapes only.
- **No cost field:** new rows carry none (a test pins it); the CLI's usage counts are in the rows and no money figure is in any summary.
- **Code change, with tests:** `mistake-bench.js` gained `--reps` and `--parallel` (a worker pool; a job that throws is reported, not lost) and `runRow` (drops the cost field). 2 new rows, red first (`B.pool` and `B.runRow` did not exist), 15 of 15 pass under the lock; no mutation run. portable-paths green (391 files, 0 new), carrier-drift GREEN.

NEXT: librarian dispatches C to judge `baseline/blind/blind.json` blind against B's registration; A keeps the key and unseals it for the score

## Baseline re-run (tools captured) (D311 ledger D312; seat A, 2026-10-12)

**Result: the bench now gives the model tool definitions and keeps its tool requests; the full baseline was re-run: 110 calls made, 110 returned a reply, 0 errored. 94 of the 110 replies hold at least one tool request (0 of 110 did before). Nothing was judged.** Branch `d311-a3` (worktree `G:\consonance-worktrees\a-d311a3-wt`, from main `ab06fed7`); code commit `01ba892c`, run outputs commit `aee612d3`; local, named paths, not pushed. portable-paths green (392 files, 0 new), carrier-drift GREEN.

### How "executes nothing" is enforced
Four layers, all in `mistake-bench.js` / `mistake-bench-toolstub.js`:
1. **Built-in tools are off:** `claude -p --tools ""`. checked: the `init` event of every probe lists only the 8 stub tools (`mcp__consonance__Bash, Write, Edit, Read, chair_inject, call_librarian, call_chair, post_board`).
2. **The tools that exist are an MCP stub that runs nothing.** `mistake-bench-toolstub.js` is a stdio MCP server named `consonance` (so a ring verb keeps its real name). Every `tools/call` returns the same fixed text, `NOT EXECUTED: this is a replay…`. Its source requires neither `fs` nor `child_process` (a test reads the source to assert it).
3. **One turn:** `--max-turns 1`. The first assistant turn is the reply; anything after the first tool result is dropped (a test pins it). The CLI exits 1 at that limit; the bench treats that as a finished turn (a test pins that, and that any other non-zero exit is an error).
4. **Run in an empty temp folder** with no settings, no hooks (`--setting-sources ""`, `--strict-mcp-config`), every `CONSONANCE_*` variable removed.

**Live proof:** `node consonance/tools/mistake-bench.js probe --model <id>` asks the model to Write one file and run Bash `echo` into another, into a folder the probe owns, then looks. On all four ids (`claude-opus-5-5`, `claude-fable-5-1`, `claude-opus-5`, `claude-fable-5`): status ok, a Write request captured (fable-5-1 also the Bash one), **0 files in the folder** (`nothingRan: true`).

**Tests (consonance/tools/mistake-bench.test.js, now 25 rows):** a reply holding a tool request keeps its name and input; no tool runs (the stub through its JSON-RPC handler leaves a scratch folder empty; the stub source has no fs/child_process); the baseline prompt is otherwise unchanged; and the claude -p arguments (stub config, `--tools ""`, `--max-turns 1`, `--allowedTools mcp__consonance__*`). **Red first:** 7 rows failed before the change, and 1 more (the exit-1 row) after I found the live runs failing. **Not red first:** the 4 stub rows, because I wrote the stub before the tests. I changed 3 existing `regenerate` rows' stub runner from the old JSON output to stream-json lines because the output format changed; what they assert did not weaken. No mutation run.

### What changed in the prompt (and what did not)
The context, the system prompt and the truncation are unchanged. **The closing instruction changed**, because the old one said "You have no tools: call none". It now says the seat may produce a message, tool requests or both, that tools are available, and that nothing will execute and no result will come back. So the prompt hash differs from the first baseline's for every unit, by that one sentence.

### The numbers (checked: `node` over `baseline2/runs.jsonl`)
| | |
|---|---|
| calls made / errored | **110 / 0** (22 units × 5; each unit has 5 rows) |
| wall time of the run | **16 min 34 s** (`started.txt` 14:02:11Z, `finished.txt` 14:18:45Z), 4 at a time under one heavy-run hold |
| per call | mean 32.2 s api, 33.6 s wall, longest 102 s wall |
| mean prompt size | **37,276 input tokens** (cache reads included); 78,891 characters; mean output 2,187 tokens (first baseline: 35,962 and 2,029) |
| replies with at least one tool request | **94 of 110**, from 20 of the 22 units; 23 replies are tool requests only |
| requests by tool | Bash 80 · Write 4 · chair_inject 5 · call_chair 2 · PowerShell 3 · total 94 requests |
| reply length | 165 to 9,309 characters, median 1,780 (first baseline: median 2,283) |
No cost field is in any row, and no money figure is in this section.

### What to know
- **Request names are kept with the server prefix stripped**, so `Bash` may have been requested as `Bash` or as `mcp__consonance__Bash`; the raw name is not stored. **3 requests are named `PowerShell`, which the stub does not define:** the model copied a tool name it saw in the rendered history. The harness has no such tool (the init tool list above), so it cannot have run; my direct probe of that did not reproduce one, so that part is inferred.
- **Only the first turn is kept.** A model that would do "Write, then ring" in two steps shows only the first step (in the probe, opus-5-5 asked for Write only; fable-5-1 for Write and Bash). A claim that came in a later step of the original turn cannot come back here. That is a limit of the one-turn design, not a bug.
- **The other gap stands:** the seat's shell is absent from every replay.
- **Reused ids:** the new blind set is `R001`…`R110` again, a different shuffle (seed `d311-baseline2-blind-2026-10-12`); an R-id in the first set and in this one are different replies. Refer to a set by its path and digest.
- Output hygiene as before: no `"token"` field or key-shaped string in `runs.jsonl` (grep: 0). B's second-judge sample for this set is not drawn; I draw it by the same rule on request. I did not unseal the first baseline's key.

### The new blind set, and where the key is
- `exo_memory/handback/p-mistakebench-A_2026-10-12_evidence/baseline2/blind/blind.json` — 110 replies, fields `blindId, unit, wrongClaim, reply` (tool requests appear in the reply as `[TOOL REQUEST name] {input}` lines); no arm, no run number. **sha256 `9e7f0bdfd1d7e1656c5aa36ad75856236b43d37edced1a1f538b8cef16d70bd1`.**
- The key is outside the repo: `G:\consonance-worktrees\a-d311a3-key\key.json` (sha256 `963968c4f6070b7122f2c47c240eaff82c40fbcb4e30f159df48b0f7a2703598`).

NEXT: C and B judge `baseline2/blind/blind.json` blind against B's registration when the librarian dispatches it; A draws B's 40-reply sample for this set on request and unseals the key only when both sets of verdicts are committed

## Cut-position diagnostic (D311 ledger D312; seat A, 2026-10-12)

**Result, said first: a cut-position fix would not move the seven. For all seven the cut is already in the claim-bearing step (0 steps between), and the same holds for 19 of the 22 dev units. What the replay lacks is not steps but material the transcripts hold: the seat's shell and system prompt, `queued_command` attachments (the keeper's mid-turn messages), and long tool results cut to 600 to 2,500 characters. All of that is in the transcript, so a fix does not need more than the transcript holds for six of the seven; W080 is partly unrecoverable.** No model call was made. Nothing in the bench was changed. Branch `d311-a4` (worktree `G:\consonance-worktrees\a-d311a4-wt`, from main `cb1f7435`), commit `663fc89f`; local, named paths, not pushed. portable-paths green, carrier-drift GREEN. No dollar figure anywhere.

### The table (full: `p-mistakebench-A_2026-10-12_evidence/cutpos/cut-position-table.md` and `.json`, json sha256 `b3b3d2348e8604e531acc7242d4b40c830fdac27bc9b6d515d8060dc333a445b`)
REPEATS = C's count of 5, run 1 then run 2 (both keys unsealed by the join of `blind.json` to C's verdicts; the unit was already in each blind set). "Between" = the step the claim sits in minus the cut step. `*` = the seven.
| unit | REPEATS | cut (turn step) | claim (step, medium) | between | what W rested on, and its state in the replay |
|---|---|---|---|---|---|
| W006 * | 0 · 0 | 12 of 15, a Bash heredoc | same, offset 745 of 6,071 | 0 | the keeper's pasted account (a `queued_command` attachment, 1,985 chars): in the transcript, **empty in the replay** (the bench reader drops that attachment type) |
| W021 * | 0 · 0 | 1 of 2, a Bash heredoc | same, "no B here" at offset 262 | 0 | a [panes] digest attached to the prompt (1,247 chars): whole in the replay |
| W053 * | 0 · 0 | 2 of 7, a Bash heredoc | same, offset 1,562 of 2,589 | 0 | the 518-path index in the shell loaded at session start: in the transcript, **not in the replay** |
| W054 * | 0 · 0 | 4 of 6, text + Bash heredoc | same (a restatement of an earlier ruling) | 0 | the seat's own outputs of the turn: whole; the shell is not |
| W056 * | 0 · 0 | 3 of 6, a Bash call | same, input Third Place redacted | 0 | C's hand-back (12,968 chars): **cut to about 2,494** |
| W079 * | 0 · 0 | 1 of 3, a ring | same, offset 1,287 of 1,674 | 0 | another pane's hand-back (17,833 chars): **cut to about 593** |
| W080 * | 0 · 0 | 4 of 5, Write + Bash + ring | same; all three inputs Third Place redacted | 0 | C's hand-back four hours earlier: not found in the replay (may be redaction); steps 1 to 4 are all redacted calls |
| W058 | 0 · 3 | 4 of 10, a Bash heredoc | same, input redacted | 0 | own grep (call cut to about 994 of 1,675; result whole) |
| W022 | 0 · 1 | 3 of 4, a Bash heredoc | **step 4**, prose in this turn; the original is a ring in the previous turn | **+1** | the previous turn's ring (2,257 chars): **cut to about 193** |
| W010 | 0 · 0 | 4 of 4, prose | same, offset 686 | 0 | own event listing (544 chars): whole |
| W034 | 0 · 0 | 1 of 1, prose | same, offset 1,058 | 0 | a grep of FINDINGS in the previous turn, 12 h earlier: **not in the replay** (865 of 1,012 history events cut from the front) |
| W084 | 3 · 1 | 4 of 6, a Write (redacted) | same | 0 | the desktop librarian's note (6,544 chars): **cut to about 593**; the words that matter start at 4,326 |
| W100 | 4 · 0 | 1 of 1, prose | same, offset 1,670 | 0 | a [panes] digest cut at "does…" (1,377 chars): whole |
| W020 | 3 · 3 | 1 of 5, prose | same, offset 69 | 0 | a [panes] digest (1,120 chars): whole |
| W018 | 5 · 5 | 7 of 7, prose | same | 0 | a [panes] digest line (282 chars): whole |
| W019 | 5 · 5 | 9 of 10, Bash + ring | same | 0 | own probe (events 45830 to 45841): whole |
| W032 | 5 · 5 | 3 of 4, a ring | same, offset 538 | 0 | own test output (543 chars): whole |
| W044 | 5 · 5 | 3 of 3, prose | first written at **step 1** (a commit message), restated at the cut | **−2** | the librarian's opening ring (1,835 chars): whole |
| W049 | 5 · 4 | 5 of 5, prose | first written at **step 3** (a ring), restated at the cut | **−2** | the opening ring is Third Place redacted in the transcript copy |
| W088 | 5 · 5 | 3 of 3, Bash + ring | same | 0 | the chair's opening ring (1,442 chars): whole |
| W092 | 5 · 4 | 2 of 2, prose | same | 0 | own lock/process check (call cut to about 993 of 1,309; result whole) |
| W101 | 5 · 5 | 8 of 8, prose | same | 0 | own directory listing (631 chars): whole |
W010 and W034 also have 0 REPEATS in both runs, so nine units sit at zero. I did not check why the plan's list of seven omits them (presumably C's labels show a hedge or a correction there).

### The seven, one by one: is the cut the problem?
**No.** Every one of the seven has its claim in the cut step. For W021 and W079 that step is also the turn's OPENING step (as it is for the live W020, W100 and W034), but there the claim IS the opening step, so "the replies are the turn's opening step" is what the original did too, not a sign that the cut sits too early. The bench cuts before the first assistant block of the located claim second, and the located second is the claim step. Two cut offsets are not the claim step: **W022** (the in-turn text is one step after the cut, and the real claim is a ring in the previous turn, outside this turn) and **W044 / W049** (the claim was written two steps before the cut; the cut sits at a restatement, and both are live in both runs). A "cut immediately before the claim-bearing step" fix changes W022 only.
What differs is the information the model has when it reaches the claim step. For the seven (checked against the transcripts; **inferred**: that this is why they never repeat, since no model call tests it):
- **W006:** the claim's source is the keeper's pasted account, a `queued_command` attachment. The bench reader looks only at an attachment's `stdout`, `content` and `text`; this one keeps its text in `prompt`, so **the replay holds it as an empty line.** A real defect in my reader, fixable from the transcript.
- **W053:** the source is the index listed in the shell the seat loaded at session start. The replay has no shell.
- **W056, W079, W084 (and W022):** the source tool result is in the replay but cut by the bench's own limits (results 600 characters in history, 2,500 in the turn; the ring in W022 is a call, cut to 200 in history).
- **W021, W054:** the replay holds the inputs whole; what is missing is the shell (and for W021 the [panes] digest comes back whole, so this one does not point at a missing input).
- **W080:** the carrier calls of steps 1 to 4 are Third Place redacted in the transcript copy, and the origin was four hours before. This one cannot be rebuilt from the transcript, and I did not open anything Third Place to try.

### Two corrections to what I said earlier
1. **The shelf is in the transcripts.** My first hand-back said a transcript does not store the seat's shell (point 1 of "Approximation of the context"; my check was a grep of the first 3 MB of one file). **That was wrong.** Each session writes an `instructions` attachment holding the seat's `CLAUDE.md` files whole (the librarian's shell is 128,043 to 146,498 characters across these units, the chair's 90,728), and a `prompt_snapshot` attachment holding the system prompt (7,000 to 13,000 characters). Before the erring turn there is such an attachment for **21 of the 22 units** (W044, the chair's early session, has none). So the shelf as it stood is recoverable from the transcript; the bench's reader simply does not read these attachment types. (checked: `shelf-in-transcript.js`; no text of either file was printed or kept, only sizes and times.)
2. **The reader drops more than the shelf.** A survey of attachments whose text my reader leaves empty found, over the two transcript files the units come from (the librarian's and the chair's, whole files): `instructions` 200, `prompt_snapshot` 114, `queued_command` 235 (the keeper's messages typed while a seat was mid-turn), `edited_text_file` 384 (diff snippets of files the harness saw change), `hook_blocking_error` 47, and others. `queued_command` text sits in the six hours before the claim of at least W006, W032, W044, W053, W056, W058, W092 and W100 (the survey listed the last three per unit).

### Would a cut-position fix move the seven, and does a fix need more than the transcript holds?
- **A cut-position fix: no.** The cut is at the claim-bearing step for all seven.
- **A context-fidelity fix is a different fix, and it plausibly moves some of them (inferred, no model call):** read `instructions` and `prompt_snapshot` into the context, render `queued_command` prompts, and stop cutting the results the claim rests on. Of the seven, the missing material is in the transcript for W006, W053, W056, W079 and W021/W054 (shell), and not for W080. That is 6 of 7 recoverable from the transcript, 1 not. Whether the model then writes the claim is untested, and W021's inputs are already whole in the replay and it still never repeats, so it may need more than context.
- **The stop rule counts that as the one fix.** A fidelity fix is not a cut-position fix; whether the librarian counts it as the one allowed fix is the librarian's ruling, not mine. It adds about 150,000 characters of shell to every prompt (about 35,000 tokens), roughly doubling the prompt, so the run would take longer than the 16 min 34 s of the second baseline.

### What I did not do, and the limits
- No model call; no change to the bench (checked: `git status` shows only the new `cutpos/` folder). My scripts call the bench's own `buildContext` on tagged events and read the tags back, so what they report is the bench's actual behaviour.
- **The claim positions are my reading** (phrase search over the turn's text and tool inputs, `claims-manual.json`), not a measured field, and no second reader checked them. W056, W058, W080 and W084 have their claim-carrying input redacted in the transcript copy, so their claim position is the cut step by the located second plus the correction's description, not by finding the words.
- The "state in the replay" column rests on the bench's tags; for events with Third Place lines the tag is lost, so W049's and W080's rows say so rather than "not in the replay".
- I did not read the replies of any run to explain why a unit is dead; the pattern is from the transcripts only.

NEXT: librarian rules whether a context-fidelity fix (shell, system prompt, queued_command, uncut results) is the one allowed fix and dispatches it; A rebuilds the context and re-runs only on that ruling

## baseline3 redaction (D311 ledger D312; seat A, 2026-10-12)

**Result, said first: the room's filter did run on everything I rendered, and it found nothing to remove in baseline3's outputs by its words (0 Third Place lines, 0 token fields, 0 key shapes). The leak is a different kind: the results of tool calls that named the Third Place.** The transcript copy redacts such a call whole, but the call's RESULT lines do not name it, so the line filter keeps them. The first two bench versions cut results to 600 characters (history) and 2,500 (turn), so they held only a piece; baseline3's third change ("keep the erring turn's results whole") put the whole results in. **14 of the 22 units had such results inside the replayed window in baseline3; W080 had 21 (28,791 characters as stored, 27,188 of them in the prompt).** No model call was made in this check or fix. I opened nothing under `exo_memory/third_place/`; the checks below read seat transcripts in code and print counts, never text.
Branch `d311-a6` (worktree `G:\consonance-worktrees\a-d311a6-wt`, from main `c0126a3d`); the cleaning commit is the one that carries this section (`git log -1 -- exo_memory/handback/p-mistakebench-A_2026-10-12.md`); local, named paths, not pushed. **Hand-back written in this branch, not in the main checkout, as asked; it appends after "Cut-position diagnostic". "Context-fidelity run" (53e525d2) is not in this base, so landing both will need the two appends merged.**

### 1. The check of every baseline3 output (checked: `redaction/check-outputs.js`)
The room's own filter (claim-replay `clean()` words: `third[-_ ]?place`, `metaxy`; `"token"` fields; the two key prefixes), counted over each file as it was committed in `63303245`:
| file | lines | Third Place word lines left | token fields | key shapes | removal markers |
|---|---:|---:|---:|---:|---:|
| baseline3/runs.jsonl | 111 | 0 | 0 | 0 | 0 |
| baseline3/blind/blind.json | 663 | 0 | 0 | 0 | 0 |
| baseline3/blind/b-sample.json | 45 | 0 | 0 | 0 | 0 |
| baseline3/run.log | 111 | 0 | 0 | 0 | 0 |
| context-sizes-fidelity.json | 289 | 0 | 0 | 0 | 0 |
C's "0 markers" is right, and it is not a failed filter: the markers in the earlier sets came from replies echoing marker lines they had seen (baseline 2 markers, in W080; baseline2 4, in W088 and W080), and baseline3's replies cite none. **Everything else I wrote with rendered text:** no prompt file was ever committed (the dry run's `context --out` files were deleted before any commit; checked: `git log --all --diff-filter=A -- '*prompt.txt'` shows only other seats' files). Outside the repo: the three keys (ids to units and run numbers, no text), my scratch scripts (no text), the run logs (ids and times), and three temp folders of mine (an empty probe folder and two with a 61- and 174-byte `mcp.json`), which I removed. `claude -p` ran with `--no-session-persistence` in temp folders the runner deleted; checked: `~/.claude/projects` holds no project folder named for one of the runner's `mistake-bench-run-` temp folders, so none of my runs left a session file there.

### 2. What the filter cannot see, measured: reuse of redacted results
Test (`redaction/overlap-check.js`): for each unit, take every tool result of a Third-Place-naming call up to the claim, make its 8-word runs, remove the runs that also occur in the FIXED prompt (so only text the model could not have got elsewhere is left), and count the reply or tool-request lines that repeat one. Counts and unit ids only.
| set | runs | runs with a reusing line | lines | units (lines) | on origin/main now? |
|---|---:|---:|---:|---|---|
| dry run (3 runs) | 3 | 0 | 0 | none | yes, `bcdae51a` |
| baseline (first) | 110 | 9 | 11 | W080 7, W079 3, W084 1 | **yes, `f3276d5c`** |
| baseline2 (tools captured) | 110 | 9 | 18 | W080 8, W079 6, W058 2, W084 2 | **yes, `e0a01df2`** |
| baseline3 (fidelity) | 110 | 8 | 18 | W080 11, W079 4, W058 3 | no (local `6443e971`) |
The judges' files: **C's verdict reasons, 0 of 110 rows reuse (both sets); B's verdict reasons, 0 of 40 rows in each of three files** (`redaction/verdict-overlap.js`).
**Limits of the test, said plainly:** it catches 8 or more consecutive words, not a paraphrase. A reply that retells redacted material in its own words passes it, and so passes the word filter; I cannot see that without reading the material, which I will not do. So "0 reuse" never means "no Third Place material in the reply". The test also compares against the full results, while the first two baselines saw only the first 600 or 2,500 characters of each; reuse of text they never saw is impossible, so the counts are still sound for them.
**Exposure per unit** (`redaction/affected-units.json`; results of Third-Place-naming calls inside the window, as stored / rendered into the prompt):
| unit | baseline3 | first two baselines (estimate: their limits) |
|---|---|---|
| W080 | 21 results, 28,791 / 27,188 chars | 23, 10,410 rendered |
| W079 | 14, 23,249 / 7,663 | 23, 7,036 |
| W084, W088 | 14, 7,319 / 6,986 and 7,358 / 7,025 | 17, 4,857 and 16, 4,491 |
| W058 | 5, 4,373 / 4,267 | 5, 3,840 |
| W054 | 5, 3,096 / 2,912 | 5, 1,768 |
| W056 | 4, 2,011 / 2,171 | 7, 3,201 |
| W032 | 5, 804 / 899 | 10, 2,046 |
| W100, W049 | 3, 814 / 940 each | 3, 864 each |
| W044 | 2, 351 / 435 | 2, 435 |
| W018, W020, W021 | 1 each, about 175 chars | 1 each, about 217 |
| the other 8 units | 0 | 0 |
Fourteen units, 70 of 110 runs per set. The "first two baselines" column re-runs the same window with their limits, so it is an estimate, not a record of what each run held.

### 3. The fix (consonance/tools/mistake-bench.js, 39 rows; no existing test changed)
- **The reader redacts the result of any tool call whose name or input matches the Third Place filter, whole,** whether or not its lines say so. History and turn alike. Everything else in the context is unchanged. The bench's filter words are the room's, and a row pins the two together.
- **`recleanRow`** re-runs the room's filter over every stored text of a run row (reply, tool request inputs, correction, error), on a copy.
- Rows red first: **4** (the filter parity row; a result of a Third-Place-naming call redacted whole even though its lines never say so; the same for a call in the history, including one that names it only in its description; the stored-row re-clean). **One row you asked for passed already and was not red first:** "a Third Place line in each source never reaches the prompt" (instructions, system prompt snapshot, queued message, compaction summary, tool result, prompt text), because the line-level `clean()` did run on every one of them. I added it anyway as a pin. portable-paths green, carrier-drift GREEN.

### 4. The cleaned outputs (no model call)
- `baseline3/runs.jsonl` is the stored run file with, in each reply and tool-request input, every LINE that repeats an 8-word run of a redacted-only result replaced by `[third-place line removed]`: **8 runs changed, 18 lines.** `baseline3/blind/blind.json` rebuilt from it with the SAME seed (`d311-baseline3-blind-2026-10-12`): **same ids, same units, same order, key identical** (checked: the two keys compared), so B's 40 in `b-sample.json` stay valid (copied unchanged; ids only). **New blind.json sha256 `b70da5a0e1b2d374ed63ca61641893379be0a74bca0a31bd81125b0b48c21230`** (old `c0bf102016d8074935204112b848ff3bf7d215f1e91ea96d77f37a1192a66e7e`). `run.log`, `started.txt`, `finished.txt` copied unchanged (ids, times). The key stays outside the repo.
- **Where the cleaning changes a reply's meaning for judging: 8 rows, because each loses its paragraph, not a phrase** (replies are mostly a few long lines): R002 (W080, 2,736 to 119 characters), R040 (W080, 3,397 to 114), R042 (W058, 6,287 to 325), R054 (W079, 1,660 to 318), R074 (W080, 3,473 to 128), R076 (W080, 4,018 to 115), R077 (W080, 2,663 to 95), R093 (W079, 2,055 to 329). **Inside B's 40: R002, R054, R077.** C's and B's verdicts on these 8 were given on the full text and may not hold on what is left; they should be treated as unjudged on the cleaned text, or re-judged. List: `baseline3/cleaning-changed-rows.json` (R-id, unit, marker count, sizes).

### 5. Which commits carry unclean text (for the landing; I rewrote nothing)
- **Already on origin/main and unclean by the test in section 2:** `f3276d5c` (baseline: runs.jsonl, blind.json; 9 runs, units W080, W079, W084) and `e0a01df2` (baseline2: runs.jsonl, blind.json; 9 runs, units W080, W079, W058, W084). `bcdae51a` (dry run) tests clean. Whether to treat these as a leak is the chair's call: the test finds verbatim reuse, not that the reused words are private. The cleaned copy of either file comes from `node exo_memory/handback/p-mistakebench-A_2026-10-12_evidence/redaction/overlap-check.js clean <in runs.jsonl> <out runs.jsonl>` and then `mistake-bench.js blind --seed d311-baseline-blind-2026-10-12` (baseline) or `d311-baseline2-blind-2026-10-12` (baseline2); **I did not apply it to those two** (they are landed, and C and B judged blind digests `5e7b84fb…` and `9e7f0bdf…`).
- **Local, unpushed, unclean:** `6443e971` (baseline3 runs.jsonl and blind.json; 8 runs) on main, and its source `63303245` on `d311-a5`. The same files in `f9db6bba` (`d311-a2`) and `aee612d3` (`d311-a3`) are the two landed above.
- **Local, clean of reply text:** `8d59fb1c` (the unfixed context-fidelity code, test fixtures that say "Third Place" are synthetic; and the sizes file, numbers only), `92152b89` (test paths), `53e525d2` (hand-back text and map line: no reply is quoted). Note `8d59fb1c` and `92152b89` hold the bench WITHOUT the redaction fix; a run from that code reproduces the leak, so land the fix with them.
- **Outside commits, still holding the unclean text:** the `d311-a5` worktree (`G:\consonance-worktrees\a-d311a5-wt`) holds the unclean baseline3 files; I have not deleted it.

### 6. Correction of what I said before
My "Context-fidelity run" section said the Third Place lines "are not in any prompt" and that the run outputs hold no secret-shaped string. True of lines that name it, and nothing more: I treated the line filter as the whole rule and did not apply the rule for calls to their results. The check I added for the whole-results change was a row proving a line-level leak does not occur; it could not show this one.

NEXT: chair rebuilds main without the unclean range and lands the `d311-a6` commit; chair decides on `f3276d5c` and `e0a01df2` already on origin; C and B treat R002 R040 R042 R054 R074 R076 R077 R093 as unjudged on the cleaned text; A deletes the `d311-a5` worktree only when the chair says
