# The unattended run of 2026-09-19 — report. Librarian (the lineage, on D). Written at the stop.

*Plan and pre-registration: `loop/plan_night_run_2026-09-19.md`. Log, row by row: `loop/night_log_2026-09-19.md`. Every entry of the day: `librarian/2026-09-16.md` (09-19 entries). Start row 10:23; tenth lap filed 13:48. **Stop rule met: ten laps filed.** Nothing is in flight; no seat opens anything until the keeper speaks.*

## 1 · What ran — ten laps, each opened here, dispatched by the chair, built or measured by panes, re-derived here, landed by the chair

| lap | what | filed at | one line |
|---|---|---|---|
| D080 | flush before DONE | e12acc4 | the stick export fsyncs every file and flushes its directories before it may say DONE; a failed flush is NOT DONE (code 1). 163/0. **Live at tonight's close — it is a script.** |
| D081 | two tool repairs | 5602507 | a portable copy of the diversity scorer (byte-identical result, the hashed original untouched); the mutant harness is now a tracked tool, 12/0 |
| D082 | six red suites classed; `--carry-dir` flush | 7cd3715 | B: 4 machine-bound causes, 3 stale, 1 instrument-working, and real defects found; C: the hand-run folder carry flushes too, 169/0 |
| D083 | three of those defects repaired | af2f716 | the path scanner read a `}` inside a string as code (it had been hiding ~2,500 live lines of `main.rs` from the guard); forget-rate's bytes 10,383 → 172,048; the state-sync test race |
| D084 | T1 step 1 | 6843d61 (+9248ee2) | **m = 0.2952 over 19 rows**, 2 VOID as the registration predicted; B's non-author read holds it; the chair marked T1 READY TO REGISTER, header not flipped |
| D085 | T3 readiness + attack | 485d8d7 | a truly cold reader IS reachable from inside the app, by one route only; B: run with seven amendments |
| D086 | **the T3 run** | 0c5800d | **not fired — and no power to fire** (§3 below) |
| D087 | T2 arm (c) feasibility | 94a6425 | five Claude models reachable, no silent remap; two limits for the registration (§4) |
| D088 | battery run 2, design | 1833834 | B's draft; E's attack: twelve amendments, five blocking |
| D089 | **my own experiment** | 9ccc041 | **VOID AS WRITTEN — my filter matched nothing** (§3 below) |

Baseline held: `node consonance/tools/js-suite.js` at the start 95 green · 6 failed of 102; at the stop 97 green · 6 failed of 104, **the same six files** (`diff` of the two FAILED lists: empty). The crate: 782 passed · 1 failed (the known composer red) · 4 ignored at D078; no lap touched the crate after that.

## 2 · The run's own falsifier, arm by arm (plan §0)

1. **A human turn inside the window** — my count, by a script of mine over every transcript on D touched since 10:23 (a regex classifier: anything not a paste, a ring, a watchdog firing, a task notification or a hook block counts as human): **0 in each of the six seats** (librarian, chair, A, B, C, E). *Not mine to score finally — the instrument is mine and the keeper's two mid-turn messages at 10:08 and 10:09 fall before the start row by design.* The Third Place seat was not in the run.
2. **A landed change broke a green test** — no: the same six red files at start and stop.
3. **The chain stopped with a seat waiting and no row saying why** — no: it stopped on its ceiling, logged.
4. **A forbidden act** — none that I know of: no rebuild, no stick write, no deletion outside scratch, nothing on L, no settings edit, no new pane, no dependency. *One act to weigh: D086 and D087 spawned 22 one-shot `claude -p --restricted` processes (9 subjects, 1 scorer, 12 probes). They are not panes and carry no room, and the plan's list does not name them; they spent the keeper's usage — about 290k tokens in D086 and US$1.38 by list price in D087's probes. If he reads the list as forbidding them, arm 4 fired.*
5. **Nothing landed that the keeper later opens and uses** — his to score. The likeliest candidates: tonight's close runs on D080's flush; D083's scanner fix changes what the path guard can see.

**Degenerating clause** (the report is mostly about the run's own machinery): no. One nudge-free run, no stall, no refusal; the machinery takes this section and nothing else.

## 3 · The two results that came back unwanted — and why that is the run's best output

**T3, the seed vs the intake (D086):** both scorers gave 9 of 9 STANCE. The task prompts ASK for "one further example" and "one objection to your own reading", which is the test's add-and-hold; a reader given nothing passes 3 of 3. The reader holding no room caught it; B's attack and my registration did not. Descriptively, scored before the key: the only two room-like ideas in nine outputs both came from intake-arm readers (2 of 3), used as working steps, never quoted; the 68-word seed left no trace in 3 of 3. `loop/t3_run_result_D086.md`.

**The preserve directive (D089):** I registered the hook's marker as preceding a compaction; it follows one. POST as written = 0 events. B fixed an amended reading before any number; C ruled it descriptive. Stable across both readings: **falsifiers 3.5% → 6.4% / 8.25%, under the old spread's bar; file names flat at 31%; numbers 9.3% → 22–24%.** And the hook fires before auto compactions too, so nothing after 08-18 is untreated: no rise can be attributed to it. `loop/compaction_survival_remeasure_result_D089.md`.

Both are the same lesson the record already holds twice (run 1 on 08-15; battery run 1 on 09-16), now a fourth and fifth time: **the instrument was not checked against the thing it measures before it was spent** — a prompt that contains its own criteria; a filter written without opening the hook.

## 4 · FOR THE KEEPER — decisions and hands, in the order I would take them

1. **Before tonight's close:** one word to let me probe the stick's directory flush (a 5-second open + fsync on `D:/consonance-L-20260911`). exFAT's answer is unmeasured; if it returns a code outside C's "unsupported" list, the first flushed close would say NOT DONE on a good carry. If that happens anyway: the files themselves were flushed; the message names the directory and the code.
2. **One close-and-reopen of Consonance on D** ships D077 and D078 (refused hand-backs keep their pointer; your chair-does-not-build rule reaches the chair's shell — proof line in `handback/p-chair-rule-in-brief-B_2026-09-19.md` §2).
3. **T1** is READY TO REGISTER at m = 0.2952 (bar r ≥ 0.1476). It needs your word on R8g (polarity will likely read unblinded; the chair ruled the bar stays) and your hands to spawn two new siblings per task.
4. **T2's registration** must choose: cite L039/L045 as arm (a) — the spine's plan, confounded by harness — or re-run (a) by the restricted route (A's default). And arm (c) can only be three tiers of one family: a null will not transfer to the paper's claim.
5. **T3** needs a new registration to mean anything: a task that does not ask for the criteria; a registered list of the room's ideas marked present/absent with cold as the base rate; more than 3 per arm. It is the Third Place's line; you bring it.
6. **Battery run 2:** the chair will not fold E's twelve amendments into a draft that measures the chair, alone. Fold them with a non-chair reader present; then the keys (draft §9 lists what you must see first). Intake alone ≈ 1.6–1.9M tokens.
7. **The preserve hook:** a powered re-measure needs it OFF for a window on one seat. Your machine, your word.
8. **Small, from the panes' morning questions** (defaults were taken; each is in its hand-back): Python on D (no); should `exo_memory/review/` travel (no — it is an answer key); `--carry-dir` lifts and restores the read-only bit on a COPY to flush it (yes); a raised priority on a test's helper process (yes); the brace counter also skips comments (yes); the two non-load-bearing guards kept in the state-sync test (kept).
9. **Carried from this morning:** the stick prune is held; L's six log queries on Sunday (`handback/p-stick-fault-cause-C_2026-09-19.md` §7); the two P-LEAVE-3 live tests need the app closed; the three excluded-but-live hooks on D are yours to name.

## 5 · Found, not fixed — for a later sweep

- Four tracked mutant harnesses still carry the old whole-file check (`close`, `state-sync`, `place-conversations`, `tail-carry` `.mutants.js`); A's new harness parses cargo output only and scores against HEAD's tests (C and A each needed a scratch adapter).
- `forget-rate.js`: `lastBlob` looks at 6 revisions at most; a null blob misclassifies a demotion as DELETED; its stale `FORGOTTEN 0 files` pin needs the pilot file updated first.
- `portable-paths`: the 35-site baseline (27 benign, 6 real path defects B named, 2 review → now 1).
- `actors.js` `NON_PANE` lacks `resume`, `sync`, `trailer-gate`; `LETTER_BIRTH` is L's constant asserted on every machine.
- **Seen while counting turns, NOT verified:** `C:/Consonance/data/precompact.jsonl` gained 16 rows during the run with session ids `s1` and `?` — four per `js-suite` run. If that is the hook's own test writing to the LIVE ledger, then the 1,479 rows B and C counted include test rows, and the ledger C used as "the directive's own record of firing" is polluted by them. A one-packet check.
- **Also seen, not verified:** since 10:23 about 70 one-prompt sessions appeared under the librarian's project directory and about 55 under the chair's, each beginning "You are an overseer judging a single assistant move" — the L2/L3 overseer hooks spawning a session per turn. That is the cost of the three excluded-but-live hooks, and it bears on item 9.

## 6 · This seat's WRONG column for the run

The P-RACE packet specified a readiness signal as the fix on B's inference; C refuted it by measurement (starvation). I adopted B's A4 into T3's rules without checking the prompt asked for it. I registered D089 against a hook I had not opened. A first re-derivation of m printed "0.0000" having matched no field names — caught in the same turn. I typed clock labels ahead of the real time through the afternoon ("13:4x" at 12:5x) in rings and entries; the stamped headings are right, the typed labels are not. Two sealed guesses were wrong in their confident clause (at most one real defect among the six reds; the scorers would disagree on an intake output).

## 7 · What I would do next, if asked — not started

The ledger-pollution check (§5); then the retrospective error-correlation read over L039/L045 and the D06x double reads (plan §4 N7, second candidate) — registered properly, with the instrument opened first.
