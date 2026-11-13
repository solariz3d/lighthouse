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
