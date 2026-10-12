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
