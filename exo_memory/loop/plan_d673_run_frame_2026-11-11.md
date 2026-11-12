# PLAN D673: the run's frame (timer, overtime, the Absolute's save, a won run)

Written by the librarian seat, 2026-11-11 ~23:1x local, from pane E's D669 FINAL rank 1
(`exo_memory/handback/p-d669-sweep-E_2026-11-11.md:238`, lighthouse 936b23df), on dreamzone-3 main **cab3530**.

**Tier: PROVE IT.** The chase is deterministic sim, the run record is a stored data format, and old records must still
replay. Tests first. dreamzone-3 has **no mutation harness** (`git ls-files | grep -i mutat` → 0), so the proof is
red-before-green tests plus the full suite at landing; each pane says so in its hand-back.

## What he said (the master is the brief, `exo_memory/briefs/dreamzone2_the_game.md`)

- **Item 28** (03:46 L): "there will be a time limit, perhaps like 10-15 min runs … when the time runs out … this malevolent
  god entity spawns in … you cannot escape it, its like lighting fast next bot, it is cheating and it is there to devour you,
  even safe zones dont save you, just reroute it, since you cannot escape, what happens is when you get caught, the good god
  entity saves you last second".
- **Item 30** (03:55 L): "the regular entities catch you you lose it all".
- **Item 53** (06:28): "tons of bonus XP for surviving a longer time after the round is over evading the malicious god".
- **Item 66** (08:43 D): "it goes into overtime mode where the evil god then comes to you himself … it will catch you, but you
  can try your best to outrun it for as long as you can … So you can die and lose all your points by losing before the timer,
  the overtime mode is meant to be lost, but good god saves you and sends you back successfully".
- **Item 107** (17:44): the good god is **the Absolute**. The dark one's name is still his to pick (Echo, Hollow, Remainder,
  Undertow, or other), so **player-facing words for it are placeholders**; the code calls it `Kind::Dark`.

## Where it plugs in (read on cab3530)

- Run ends today: `game/world/run_record.h:38` `enum class RunEnd { Caught, Void, Left }`; the record is written in
  `game/world/world_app.cpp:420-460`; `RunResult` at `game/world/world_app.h:63-75` (`counted`, `best`).
- The chase: `chase/run.h:164` `class Run`, `caught_by()` (`run.cpp:279`, set at `:498`), `over()`, `seconds()` (tick/240),
  `score()` = `score_at(tick_)` (`run.cpp:205-264`); kinds at `chase/archetype.h:17-27`; dials in `chase/dials.h` (X-macro;
  `reprieve_hold_s` 20 at `:55`, `head_start_s` 8 at `:20`).
- Phases: E's D666 §3 (`handback/p-d666-entities-E_2026-11-11.md:110-119`) already names **Overtime** as the phase after the
  timer, "1.0, and the lesser ones clear out … the evil god itself". `chase::phase_name(run.phase())` exists (`hud.cpp:234`).
- HUD: the count-up clock `hud.cpp:80`, the score line `:82`, the results card `:118`.

## The shared interface (A writes it FIRST, as its own commit on `d673-chase`, so C builds against it)

- `RunParams::run_length_s` (float). **0 = no timer**: the default for tests and for every old record, so nothing that
  exists changes. The game's own default comes from `world.txt` (C).
- `Run::overtime()` → the timer has passed. `Run::overtime_seconds()`.
- `Run::saved()` → the run was caught **in overtime** (by the dark one): the Absolute's save. `caught_by()` keeps working.
- `Kind::Dark`, appended **before** `Count` and after every existing kind, so no stored kind number moves.
- `Run::score()` includes the overtime bonus (below); `Run::kept_score()` = score if saved, 0 if lost.

## Part A — pane A, `chase/` (branch `d673-chase` off cab3530)

1. **The timer.** At `run_length_s` the phase becomes Overtime. Nothing else changes before it: with the timer at 0 or not
   yet reached, every existing row and fingerprint is **byte-identical** (red-before-green: a test that a timed run equals an
   untimed run, tick for tick, until the timer).
2. **The lesser chasers and the hunter step back.** In Overtime nothing new is sent; every lesser chaser and the hunter leave
   by walking off (they go away from the player, out of sight, then are removed), not by vanishing in view. Dial:
   `overtime_clear_s` (the time by which all are gone).
3. **The dark one comes.** One `Kind::Dark` agent enters from out of the player's sight a dial's distance behind
   (`dark_spawn_m`). It always knows where the player is. **A Park does not hold it** (item 28 "even safe zones dont save you,
   just reroute it"): my reading is that it reaches you by the Park's own way rather than waiting at the mouth. His to
   correct.
4. **Certain, but skill lasts longer.** Its speed starts above the player's sprint peak and rises with overtime seconds
   (dials `dark_speed_start`, `dark_speed_rise`). A picks the values to meet the bands below.
5. **The catch in Overtime is the save.** A catch by the dark one ends the run with `saved()`. **A lesser chaser or the
   hunter can never end a run in Overtime** (they are leaving). **A void in Overtime is also a save**: the run was already
   won at the timer. That last one is my ruling, his to veto.
6. **The overtime bonus** (item 53): score per second in Overtime at `overtime_score_multiple` (default 5) times the rate the
   run had at the timer.

**Registered before the build (the falsifiers; any one firing is reported as fired, not tuned away):**
- **F1, certainty:** on 20 seeds × the three bot policies, with `run_length_s` set so overtime begins, **any** bot survives
  overtime past **90 s**.
- **F2, skill:** the flee policy's median overtime survival is **not** at least 25% longer than the straight-line policy's.
  (A test of "you can try your best to outrun it for as long as you can".)
- **F3, the band:** the flee policy's median overtime survival is outside **15 to 45 s**.
- **F4, the clear:** a lesser chaser or the hunter is within the player's view after `overtime_clear_s`, or ends a run in
  Overtime.
- **F5, nothing before:** any existing chase row, fingerprint or streamed result changes with `run_length_s` = 0.

## Part C — pane C, `game/` (branch `d673-frame` off cab3530, rebased onto A's interface commit)

1. **`RunEnd::Saved`**, appended after `Left`. The record gains `run_length_s` and `kept_score`. **Old records replay
   byte-identically** (a red-before-green test on a record from his real runs in `game/runs/`, read with no
   `run_length_s` → 0 → no timer).
2. **The dial.** `run_length_s` in `game/config/world.txt` at **600** (the bottom of his "10-15 min", so it can be reached in
   play while the length is tuned; his call). For testing, `world.local.txt` can set it short (e.g. 60); the shipped-defaults
   test keeps `world.txt` honest (the 05:2x lesson: a test setting goes in the ignored file, never the tracked one).
3. **The two endings.**
   - **Lost** (caught or void before the timer): the existing cut to dark; the card shows the points and that **none are
     kept**.
   - **Saved** (caught in Overtime): not the cut to dark. A placeholder save, the screen going to white light rather than
     black, then the card: the time, the overtime seconds, the points **kept**, the overtime bonus as its own line.
     Player-facing names for the two gods are placeholders until he names the dark one.
4. **The cue at the timer.** The HUD clock stays as it is (it counts up, `hud.cpp:80`). At the timer, one notice and the
   world's own change (the others leaving) mark it. **Whether a countdown is shown is an open GAP for him**, not built.
5. **Best times.** `best_times.txt` is unchanged in shape; the result gains `won`. A best set by a saved run is marked.

**Registered:** C1, an old record from `game/runs/` does not replay byte-identically; C2, the shipped-defaults test passes
with a non-default `run_length_s` in `world.txt`; C3, a run caught before the timer keeps any points.

## Order and landing

1. A commits the interface header (`d673-chase`, first commit) and rings the librarian with its sha; C rebases onto it.
2. A and C build in parallel. A's bot measures use the ordinary heavy-run lock (deterministic); no timing session is needed.
3. Both hand back to the librarian. The librarian reads both, then names a landing pane (P) to merge A then C onto main,
   run the full suite under the exclusive hold, and push.
4. B's D665 steps 2+3 (the Park kit) are in motion on `gen/`; neither part here touches `gen/`. If B lands first, A and C
   rebase; the Park-holding rule in A.3 must hold on B's new vertical Parks too (A adds one row on a chute Park if it has
   landed).

## Out of this lap, on purpose

- The death as a reveal (D669 rank 9, item 30's "it was always the evil god"): the loss card stays plain.
- The meta loop (rank 3): kept points are recorded, not spent.
- Stress, virtues, Recognition (rank 5); the dark one's model (a stand-in: the hunter's model, darkened and larger, or the box).
- The softer chase and the cutback question (rank 2): his call, put to him when he is back.

## Amendment, 2026-11-11 23:1x (librarian, from C's interim)

- **C1 as first written could not hold:** none of his 11 kept runs in `game/runs/` replays identically even on cab3530 (C, `d673/replays-base.txt`), because the world and chase changed since they were recorded. C1 now reads: a record made at the base, with the new lines removed, replays as before; and his records still read.
- **The interface gains `PlayParams::run_length_s`** (`chase/play.h:14-28`), carried into `RunParams`, so the headless bot harness (`chase::play_streamed`) can reach overtime. A puts it in the first commit.
