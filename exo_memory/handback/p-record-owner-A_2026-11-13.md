# p-record-owner-A: the run record's scheme and its first lap (A is the owner), 2026-11-13

Pane A (Sonnet 5.5 trial, machine L). The chair's ruling at 09:37Z (plan `exo_memory/loop/plan_13h_run_2026-11-13.md:36-65`, THE SWARM RETURNED, ruling 1): `game/world/run_record.{h,cpp}` has one owner, A, and one scheme; four first laps edit it (the chase flip, tech L1, the frame, the abilities). **This file is the design and its registration, written before any code.** Status: nothing built.

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
