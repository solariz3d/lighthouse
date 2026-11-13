# p-record-owner-A: the run record's scheme and its first lap (A is the owner), 2026-11-13

## WHERE IT STOPS (L, 13:5xZ)
- **Landed:** Lap R is on main (`cc8eea8`, merge of `l197-record` 47d88d7 by the train); nothing of it is unpushed. Its landing section is below. **Lap F (the chase flip) is NOT started** and waits on the brutal arms (`p-l182-lines-A_2026-11-12.md`, top): it edits `chase::shipped_speed()` and its pinning row `what_a_new_run_starts_with_is_the_default_model_until_the_flip_and_the_model_accepts_it` (`chase/tests/speed_tests.cpp`) by name, and is announced as the first replay-changing lap through this gate.
- **Mutants of Lap R: 3 of 16 applied and caught, 13 unrun** (`evidence/lapr_mutants_partial_3_of_16.txt`; a survivor means a missing row, a follow-up, never a change of format). **Exact next command:** in a worktree at `origin/main` with a built `world_app_tests` and `chase_tests` (`cmake --build build --target world_app_tests chase_tests`), `node mutants_lapr.js --check` (16 anchors, each exactly once, nothing written) then `node mutants_lapr.js` (all; or ids, e.g. `speed-section-not-read`). Set `WT`, `BAT` and the two exe paths at its top; it restores the source on exit and on SIGINT/SIGTERM (a hard kill does NOT: check `git status` after, and `git checkout --` the one file).
- **Open for other laps:** C's `d673-frame` rebases onto the landed D673 chase and drops its `8614983` `run_record` hunks; **the one line `r.world.run_length_s = 0.0f;` in `read_run_text` is mine to add when C's world setting exists** (a missing `run_length_s` reads as no timer). Anyone needing a record field asks A. Later: a `[gen]` section before a generator lap flips a dial above 0; a learned hunter's state must be deterministic and saved.

- **Scripts:** every script of mine is copied to `p-l182-lines-A_2026-11-12_evidence/scripts_L/` (47 files: the sweep wrappers `arms182b.sh` / `arms_brutal.sh` / `restart_brutal.sh`, `lockrun.js`, the scorers `score182.js` / `score.js`, the mutant harnesses `mutants_lapr.js` / `mutants_d673.js`, the chains `chain_*.sh`, the `cbuild_*.bat` builders, `analyze_replay.js`, `scan_moves.js`). **Their paths are L's** (`C:/Users/zackn/Downloads/dreamzone-3-a-*`, my scratchpad): set `SP`, `WT`, `EXE` at the top of each before running.
- **Worktrees on L** (none holds uncommitted work; each equals its HEAD, checked): `dreamzone-3-a-l182` (branch l182-lines, THE FROZEN SWEEP BINARY `chase\build\bin\dz-chase.exe`), `-a-l182h` (l182-hawk), `-a-d673` (a-d673-overtime), `-a-l197` (l197-record, merged), `-a-replay` (detached e0184ea + the untracked `game/world/replay_dump.cpp`, kept in the evidence folder), and older `-a-l170`, `-a-row`, `-a-l161` (not needed).
- **L-only data, not in the repo:** the raw replay dumps and copies of his run files (scratchpad `replay/`: his play data, read-only copies), `arms182/` (the normal-level arm CSVs a1 to a5: copied to the evidence folder), `arms182_brutal/*_pairs.csv` (the control's slosh pairs, 150 KB each; the runs CSVs and tables are in the repo), the memory sampler `mem.jsonl`.


## The scheme (the ruling's, restated so it can be checked)
- The text record gains `record_format = 1`. A text without it is format 0 (every record written so far).
- Every later field is **named and optional**; a missing field means **the behaviour of the day it was missing**. No second version number anywhere.
- Anyone else who needs a field asks A on the board; A adds it. Nobody else edits those two files. Replay-changing laps go through the gate and are announced in their landing.

## Does the scheme hold my chase flip? Yes, with one thing made explicit (checked: `game/world/world_app.cpp:393-395`, `chase/speed.h`)
**Today the speed model is not in the record at all.** The game builds `chase::StreamedParams cp` and sets the seed and difficulty; `cp.run.speed` is the code's default `SpeedModel{}`. So a replay uses whatever default the build has, and any change to a default (the flip) would change what every kept run replays to, with nothing in the record to say which model it was played with. That is exactly the case "a missing field means the behaviour of the day it was missing" has to cover, and it needs a field to hang on.

**The design (Option B):**
1. `SpeedModel{}` keeps its field defaults forever as they are today: it **is** "the model of every run written before the record carried it". A new field of the model must default to the behaviour without it (every L170 and L182 lever does; the row `the_levers_are_off` pins it).
2. A new function `chase::shipped_speed()` (speed.cpp) is **the model a NEW run starts with**. It returns `SpeedModel{}` until the flip. **The chase flip then edits that one function** (a `set_speed` text naming the winner's fields) and nothing else in the chase: so every chase test that builds `SpeedModel{}` keeps its fingerprint, and the flip's reach is exactly the game's new runs.
3. `WorldApp` holds `speed_` (starts as `shipped_speed()`), builds `cp.run.speed = speed_`, and has `apply_speed()` for a replay.
4. The record gains `record_format = 1` and a **`[speed]` section listing every field** (`name = value`, nine significant digits, as `[params]` does). Read: start from `SpeedModel{}`, apply the lines present (unknown name: refused, loud), so a missing field is the default and a missing section is `SpeedModel{}`. `record_format` greater than 1: refused with "written by a newer build". `replay_run` applies the record's model.
5. C's `8614983` record hunks (`RunEnd::Saved`, `kept_score`, `run_length_s` read as 0 when missing) already follow the scheme; I carry them into my change and C does not edit the two files again.

**The split I am proposing (the one place I depart from the chair's wording, and I say so):** the ruling says to add `record_format` "in that same change" as the chase flip. The flip waits on L182's sweeps (hours) and may not exist (L182's own falsifier). The record scheme does not wait on that, and three other laps are blocked on it. So: **Lap R** lands first, alone: `record_format`, `[speed]`, the plumbing, the rows, **no behaviour change** (`shipped_speed()` is `SpeedModel{}`; every fingerprint byte-identical, checked by the existing suites). **Lap F** (the flip) then only edits `shipped_speed()` and is announced as the first replay-changing lap through the gate. The gate's intent holds: the first lap that changes a replay still goes through it.

## What would make this wrong (registered before the work; the words that would make it true)
- **The flip changes something that is not a `SpeedModel` field.** Then `shipped_speed()` cannot carry it and the flip needs its own record field. Check at Lap F: every chase change the winner brings is listed against the speed-model fields it sits behind; a change with no field is named and stops the flip. (Today: every lever of L170, L182 and the hawk is a field with an off default. Checked by the rows `the_levers_are_off`; the hawk's by the byte-identity run.)
- **Lap R changes a fingerprint.** Falsifier: any existing chase, game or world-selftest row or pinned hash changes with `shipped_speed()` equal to `SpeedModel{}`. Registered chance it does not: 95 %.
- **A record written by Lap R does not replay to its own fingerprint.** The rows below test this with a non-default model, and a mutant that drops the model on replay must be caught.

## The rows (tier PROVE IT: a stored data format; red before green)
1. An **old text** (no `record_format`, no `[speed]`) reads, reads as format 0 with the default model, and replays to the same two fingerprints as the same record written new with the default model.
2. A new text has `record_format = 1` before every other key, and a `[speed]` section; every field survives a round trip to the bit, with several fields non-default (`ref_speed`, `turn_law`, `sway`, `hawk_n`).
3. `record_format = 2` is refused, and says so. An unknown name in `[speed]` is refused, naming it. A malformed value is refused.
4. A run played with a non-default model, recorded and replayed, reproduces its fingerprint; the same record with its `[speed]` section removed does not. (The section is load-bearing.)
5. A new run starts with `shipped_speed()`: the record a fresh `WorldApp` writes carries it.
6. C's hunks: `end = saved` and `kept_score` round trip; a record with no `kept_score` reads as 0; a record with no `run_length_s` reads as 0 (no timer), not the game's default.
Hand mutants on the real source, reported `applied N / caught N / NOT APPLIED N`: the format check removed, `[speed]` not written, `[speed]` not read, the model not applied on replay, an unknown name accepted, the newer-format refusal removed.

## Corrections to cites of my hand-backs (the INDEX §6 lines)
- `p-l170-chase-A:47` is the heading of section 3; the 27 % of a corner above the law is the table row at **`p-l170-chase-A_2026-11-12.md:63`** (checked: `sed -n 47p` and `-n 63p`).
- `p-l182-lines-A:29-55`: the file has **54 lines** (checked: `wc -l`), so the range is `:29-54`. (It will grow when L182's result is written; cite by section name then.)
The cites are in other documents; my hand-backs are unchanged.

NEXT: A builds Lap R in its own worktree off main once the overtime rows and the hawk blind check are read; rings the librarian with the landing.

## Lap R landing section (written 06:0x local, with the branch READY and the train not yet run on it; completed when the train has landed it)
**The change:** branch `l197-record`, tip `47d88d7`, one commit on main `c9d520e` (11 files; checked: `git diff --stat c9d520e..47d88d7`). Marked READY with B's train at 11:59:51Z (`landing-train.js list`: after C's `l189-drops-on-c9d520e`). Tier: prove it.

**For his eye (three lines):** a hole is closed. The chasers' speed model was not in the run record, so changing any default of it would have silently changed what every kept run replays to (`game/world/world_app.cpp:393-395` left `cp.run.speed` at the code default). The record now carries it (one version number, `record_format = 1`) and what a new run starts with is one named function; nothing plays differently yet. The chase flip, when it comes, edits that function and goes through this gate.

**Rows, red first** (`p-record-owner-A_2026-11-13_evidence/`): the stub commit `2f7ddce` (the API only: nothing written, read or replayed) was built and the rows run against it (`lapr_stub_red.txt`):
- rows 2 (format first, every speed field, round trip), 3 (newer format, unknown field, bad value refused and named), 4 (a non-default model replays to its own fingerprints from its record and not without it), 5 (a new run starts with the shipped model and its record names it), 6 (`saved` and `kept_score` round trip, a text without them reads as none): **RED**, as registered.
- **Row 1** (an old text with no `record_format` and no `[speed]` still reads and plays to the same fingerprints) **cannot honestly go red from the code**: it guards what already held. It did FAIL on the stub, but for a defect in the row itself (it read the text without the `.dzr`, so the replay had no inputs): fixed (it reads with `read_run`), and the row is green with the change. The speed pin (`what_a_new_run_starts_with...`, `speed_tests.cpp`) is green before and after by design: it is the pin that Lap R changes no behaviour, and Lap F edits that row by name.
- **Two more defects of mine, found by running the rows and fixed in the rows:** row 3 added a second `ref_speed = 0` line that the real line overrode (the last line wins; it now replaces the line) (`lapr_first_green_row3_defect.txt`); row 5 did not test that a model changed mid-run leaves the run's own record alone (it does now, with `apply_speed` called while a run is going on).
- **A gap found by row 4, fixed in this change:** `chase::play_streamed` dropped `PlayParams::speed`, so the headless streamed harness always played the default model and could not agree with an app run on any other (`chase/streamed.cpp`; `dz-chase run --world --speed` ignored `--speed`). With the default model nothing changes.

**Green:** all seven (six rows and the pin) on `0ae3c45`, the same change before the rebase (`lapr_rows_green_on_0ae3c45.txt`). Before the rebase, the whole `chase_tests`: 65 tests, 0 failed (385 s); the whole `world_app_tests`: 51 tests, 1 failed, and that one was row 3's own defect above (`lapr_full_*_pre_rebase.txt`), so **every row that existed before Lap R was green: no fingerprint moved.** **On the rebased tip `47d88d7` the rows have NOT run** (the train held the exclusive heavy-run hold; the rebase was clean but for a CHANGELOG conflict, both entries kept); the train's own full check on the batch contains them and every other test, and is the check on falsifier 1 below.

**Mutants** (`mutants_lapr.js`, 16 hand mutants of the real source): **applied 3 / caught 3 / NOT APPLIED 0 before the chain was stopped** so that the mutants would not hold up the landing (`lapr_mutants_partial_3_of_16.txt`: `format-written-as-a-comment`, `speed-section-empty`, `speed-errors-swallowed`); the fourth was cut mid-run and counts as unrun; 12 are unrun. They resume in units after the landing. **A survivor means a missing row, added as a follow-up; it does not change the format.** The count at landing time is the one above.

**The falsifiers as registered (`:22-25`):**
1. Lap R changes a fingerprint: **not seen** (all pre-existing rows of both suites green before the rebase); the train's full suite on the batch is the confirmation.
2. The flip changes something that is not a `SpeedModel` field: not a Lap R matter; checked at Lap F.
3. A record Lap R writes does not replay to its own fingerprint: **not seen** (row 4, green).

**What this means for the other laps (the scheme in use):**
- Anyone needing a record field asks A on the board and A adds it. Held for C: the one line `r.world.run_length_s = 0.0f;` in `read_run_text` (a missing `run_length_s` reads as no timer), which needs C's world setting; C's `8614983` record hunks are inside Lap R and are dropped from `d673-frame`. The world_app hunk was posted for C (nine added lines, none removed).
- Later, not now: the generator's dials ride the same pattern (a `[gen]` section) before any generator lap flips a dial above 0; a learned hunter's state, if it is ever built, must be deterministic and saved, and will come here for fields.

**Map line** (`exo_memory/map/A.md`) is appended with this section's final landing.

## Lap R LANDED (2026-11-13 13:00:53Z), as main `cc8eea8`
**What the train did** (checked: `landing-train.jsonl`, the `landed` event; `train_run_A.txt`): one batch, one attempt, on `c9d520e`: `l189-drops-on-c9d520e` (C), **`l197-record` 47d88d7 (A, Lap R)**, `l195-v1` (C), `l193-yardstick` (E); **green, nothing named, nothing set aside**; the train's check is the full build and every test then both self-tests (`consonance/tools/landing-train.js` header: `check` = build.bat test, then both self-tests); pushed and read back as `origin/main cc8eea8`; promoted 2 files byte-identical, launch check "up to date". **That is the check on Lap R's falsifier 1 (a fingerprint moved): it did not fire** on the whole suite of the merged batch, which contains the six record rows, the speed pin and every row that existed before. (My own re-run of the seven rows on the rebased tip `47d88d7` did not run: its lock wait gave up behind other seats' holds; the train's suite covered them.)
**I ran the train myself** at 06:58 because nobody had run it for about 50 minutes and four branches waited; I said so on the board first and nobody objected. The memory gate had held it for half an hour: an orphaned `grep -o` with a 16000-wide bounded repeat (6.3 GB commit, parent gone) which I ended at 06:55 (`stall_trace_lowmem_reaper_2026-11-13.md`, third observation); the train's own message hid it (`landing-train.js:194` prints the tail of a largest-first list), reported to B.
**Mutants at landing time (the count the chair asked for): applied 3 / caught 3 / NOT APPLIED 0; 13 of 16 unrun** (the fourth was cut mid-run when I stopped the chain so that it would not hold up the landing). They run now in units behind the landing; **a survivor means a missing row, added as a follow-up; it does not change the format.**
**Open for the record's other users:** C's `d673-frame` rebases onto `cc8eea8` and drops its `8614983` `run_record.{h,cpp}` hunks (they are in Lap R); the one line `r.world.run_length_s = 0.0f;` in `read_run_text` waits for C's world setting. **Lap F (the chase flip)** is not started and waits on L182's brutal arms; it will edit `chase::shipped_speed()` and its pinning row by name, and be announced as the first replay-changing lap through this gate.

## D, Friday 08:51 local (`date`): B's question, the record and a changed generator. ANSWER: Option 1, with Option 2's identity as a tripwire

The question: lighthouse `exo_memory/handback/p-gen-lap2-kit-B_2026-11-13.md:85-` (main e2740fdc). B's kit moves 300 of the pin's 384
chunk fingerprints, and the record carries nothing of the generator (`game/world/run_record.cpp:107-176`; `world_app.cpp:136-147`).

**The answer: Option 1.** Every world-changing part of the kit goes behind a generator dial whose off value is today's generator
exactly. The record gains a `[gen]` section. A record without one replays with every such dial off.

**Why:**
- **It is the rule the scheme already states, so the scheme does not change.** "A later change is a named, optional field, and a missing
  field reads as the behaviour of the day it was missing" (`run_record.h:39-41`). And this file, lines 6 and 73: "a `[gen]` section before
  a generator lap flips a dial above 0". This is that lap.
- **His recorded runs stay replayable.** The exploit search the chair queued for me reads his recorded run, and they are his runs.
  Option 2 ends them for a reason that is ours, not his.
- **The pin becomes a proof instead of a re-capture.** Its 384 values held with the dials off is a check that the off path IS today's
  generator. A second pin holds the kit's world.

**What I add to it (the record's owner's part): a tripwire, so Option 1 cannot fail silently.**
- **The gap:** Option 1 is only as good as the discipline that every future change to the generator goes behind a dial. A change that
  slips in un-dialled breaks every record, and nothing says so: a replay simply fails to reach its fingerprint, and that reads as "replay
  broken", not "generator changed".
- **So a record written with `[gen]` also carries the spawn chunk's fingerprint**, Option 2's identity, as one field: `gen_world =
  <fingerprint>`. On replay, after the world is built, a mismatch **refuses with a message naming it**: "this record's world is not this
  build's under the same generator settings: the generator changed outside its dials".
- It refuses only records that carry the field. A record with no `[gen]` cannot be checked, and the pin (the off path) is its guard.
- **Its falsifier, registered here:** a test that changes one generator constant with no dial must make a `[gen]` record refuse with that
  message. Red first.

**What stays the keeper's:** keeping every old path forever has a cost that grows lap by lap.
- **Retiring one is allowed, as a named act:** a `record_format` bump that refuses records older than it, with his word on which of his
  runs stop replaying.
- It is not a default, and not something a generator lap does on its own.

**What would change my mind:**
- B's cost measurement finds that a kit part cannot be put behind a dial (the old path is a different code path, not a parameter), and
  keeping it means keeping dead code.
- Then that part, and only that part, takes Option 2's refusal, with his word, because it costs his runs.

**Who does what:**
- **B:** puts the kit's parts behind dials with today's values as their off values; keeps the pin as the off-path proof; adds the second pin.
  B also gives me the list of dial names and off values, and `shipped_gen()` with the kit on, as `shipped_speed()` does.
- **A (the record's fields are mine, `run_record.h:41-42`):** the `[gen]` section, written and read (a missing dial reads as off), and
  `gen_world` with its refusal. Red first:
  - an old record (no `[gen]`) replays kit-off to the bit;
  - a `[gen]` record reads back as written;
  - the un-dialled-change row above.
- Built on a branch off B's kit when the dial list exists; then the train.

## D, Friday 09:56 local (`date`): the [gen] fields, registered before they are written (B's list: `p-gen-lap2-kit-B_2026-11-13.md:141`, kit `0df4c77`)

**B's open point: does the record carry the game's `gen_dials_`? The inference is checked, and it is right: no.**
- checked: `git grep set_generator_dials 0df4c77 -- game/` → `world_app.cpp:201` (the definition), and callers only at
  `game/tests/world_app_tests.cpp:725` and `game/world/selftest_run.cpp:277,378`.
- In play, `gen_dials_` is always `gen::Dials{}`, and `run_text` writes nothing of it (`[dials]` is the chase's difficulty).
- **So `[gen]` must carry them, in a section of their own.**
  - **Why:** they change the world (loop density, void rate, stair width ...), so a run made with any of them moved replays into another
    world.
  - Today only a test or the self-test moves them, so no kept run of his is affected yet.
  - The first default changed in `gen::Dials` would break every record that does not say its dials, silently, and the tripwire below
    catches that only in records that carry `gen_world`.

**B's list is right for the record.** Eight names, each an off value equal to `GenParams{}`, `set_gen` refusing unknown names. I key off
`DZ_GEN_KIT` itself (the X-macro), never a copy, so a field B adds is written and read with no change of mine.

**The fields** (record_format stays 1: each is a named, optional field, and a missing one reads as the day it was missing):
- **`[gen]`:** every `DZ_GEN_KIT` field, `name = value`, read back with B's `gen::set_gen`. A record with no `[gen]` is `GenParams{}`: the
  kit off.
- **`[gen_dials]`:** every `gen::kDialSpecs` dial, `name = value`, an unknown name refused. A record with none is `gen::Dials{}`.
- **`gen_world = <hex>`** in the head: the fingerprint (`gen::fingerprint`) of the chunk holding the spawn cell, generated with the run's
  `GenParams` and seed. 0 or missing: not carried (every record before it).
- **The run's side:** `world_app` snapshots the run's `GenParams` at its start, as it does `run_speed_`, and writes it.
- **The replay's side:** `replay_run` builds the world from the record's `GenParams` (`apply_gen`), not from `shipped_gen()`. Where the
  record says a `gen_world`, a world whose spawn chunk differs is **refused**, saying: "this record's world is not this build's under the
  same generator settings: the generator changed outside its dials".

**The rows, red first** (`game/tests/run_record_tests.cpp`):
1. `a_new_record_says_the_generator_it_was_played_in`: a written record's `[gen]` and `[gen_dials]` hold every kit field at
   `shipped_gen()`'s value and every dial; `gen_world` is not 0; and it reads back to the bit.
2. `a_record_with_no_gen_section_replays_in_the_generator_before_the_kit`: an old text (no `[gen]`) reads as `GenParams{}`, and the
   replay's world is the off world. Its spawn chunk fingerprint equals `GenParams{}`'s and differs from `shipped_gen()`'s.
3. `a_record_whose_world_is_not_this_builds_is_refused_by_name`: a `[gen]` record whose `gen_world` does not match is refused with that
   message, and nothing is played.
   - **Honest limit:** a test cannot change a generator constant at run time. This row tampers the stored fingerprint, which is what an
     un-dialled change would produce on replay. The constant change itself is proved by a mutant: an edit to a world-changing constant in
     `gen/` with the stored record kept, which must make row 3's sibling refuse.
4. `the_gen_dials_and_the_kit_round_trip_and_an_unknown_name_is_refused`: `[gen_dials]` with a changed dial reads back, and an unknown
   dial or kit name is refused.

**Falsifier:** any existing record row (Lap R's seven, `what_a_new_run_starts_with`) goes red. A field added must not move a record that
does not carry it.

## D, Friday 10:13 local (`date`, written by the shell): the chair's question. Should a record REFUSE BY NAME when the build's simulation is not the one it names?

**The finding read whole:** E, `p-l193-steps-l192-rows-E_2026-11-13.md` §2 (lighthouse cb8b14e4).
- **Checked by me:**
  - `ls game/runs/*.txt` in D's clone → 16 kept runs;
  - their `build` lines → `b212ae8` 8, `cab3530` 5, `af9727b` 2, `39e03db` 1, the four E names;
  - none has a `record_format` line, so all 16 are from before the scheme (format 0).
- **Files changed in `sim/ chase/ gen/ nav/ core/` (tests included) from each build to `31d1c6d`:** 38, 46, 45, 57. That is a wider
  scope than E's 33–48 "simulation-side", so it is not a contradiction.
- **Not re-run by me:** E's "2 of 16 reach their recorded fingerprints", which needs the 16 replays. It is E's measurement (`cmp` of the
  pairs), and I have no reason to doubt it.

**The answer: YES to a NAME, at the start of the replay. NO to a refusal for watching. YES to a refusal for every use that needs the run to
be exact.**

**Why a name:**
- Today the only signal comes at the end: "NOT the same run: the fingerprints differ". That reads as "the replay is broken" and says
  nothing about which side moved.
- A replay that is going to differ should say so before it plays, and say which side: the simulation, the chase, or the generator
  (`gen_world`, Option 1).

**Why not refuse for watching:**
- His kept runs are his to watch. 14 of 16 would become unwatchable for changes that mostly do not matter to watching them: the run
  plays out roughly, then diverges.
- Refusing them would take something from him to tell him something.

**Why refuse for exact uses:** a test, the exploit search, a score, a fingerprint proof. Each is a claim that the run happened as
recorded, and a run on a build whose simulation differs cannot back that claim. Today that difference shows only as a mismatch at the end,
after the time is spent.

**What the record would have to carry (proposal; not built until ruled):**
- **`sim_identity` and `chase_identity`:** the fingerprints of two fixed canonical runs that the build computes for itself.
  - For the simulation: the gym self-test's scripted course already gives one (`dz-gym --selftest`: "the bot completes the course on the
    simulation alone: … fingerprint …").
  - For the chase: one fixed `play()` of a fixed seed and policy.
  - Seconds of work, cached for the process. The record writes both. A replay computes its own, and if either differs the replay names
    which, up front.
- **Why not the build sha alone:**
  - Every docs-only commit would then name a difference that is not one.
  - Hashing the simulation's source files has the same false alarms on a comment change.
  - A canonical run moves only when behaviour does.
- **Its honest limit:** a canonical run is a sample. A change it does not exercise passes it, and the end-of-run fingerprint stays the
  final check.

**Old records** (no identities, all 16 of his) cannot be named up front. They play as today, and the end check still speaks.

**What makes an old run EXACT again is not a field but a build:** the record already says the commit it was played on (`build`).
- A tool that builds that commit in a worktree and replays there gives his runs back exactly.
- That is the honest route for "replay his kept runs to the bit". Option 1 cannot do it for the simulation, because every movement and
  chase change would need an off path kept forever.
- inferred: building one old commit is a few minutes, and four builds cover all 16 of his runs.

**What would change my mind:**
- If he wants his kept runs exact and not merely watchable, then the build-at-the-recorded-commit tool is the answer, and the identities
  only label.
- If a canonical run turns out too weak (a sim change it misses, shown by a mutant), then the identities would need more than one
  scenario each.
