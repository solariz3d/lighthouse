# Registration: the world self-test's "a fall at terminal speed" row (pane B, D, 2026-11-14 00:3xZ, before any code)

Ruling: the chair's D675 order of 00:17Z: "REGISTER WHICH OF TWO, BEFORE ANY CODE: (1) THE ROW READS WHAT IT GUARDS … in COUNTED
CHUNKS AGAINST DISTANCE FALLEN, not in waits by the clock. Red first on a generator made to lag; green on main; and it must still fail
when the generator truly falls behind. (2) OR, IF IT CANNOT BE SAID IN COUNTS: the row is DECLARED MACHINE-BOUND, as actors.evidence is,
with its QUIET READ a NAMED STEP of a landing." Tier: PROVE IT.

**Base:** dreamzone-3 remote main `796c16f` (my `git ls-remote` at 00:2xZ). **Branch:** `fall-row-b`, worktree
`G:\consonance-scratch\b-fall-row`, the build tree on G:.

## 0. Where the row is (a correction to the order's file name)

- The row is in **`game/world/selftest.cpp`, section 4b, lines 490-525**, not in `selftest_run.cpp`.
  - The check is at :520-524: `done && fell > depth - 1.0f && reach_misses == 0 && st.sync_waits == before.sync_waits`.
  - The row is named "a fall at terminal speed outruns nothing: no tick had to wait for a chunk". The fall is 140 m at
    `move.max_fall_speed` (45 m/s), paced in real time at 360 Hz (`Pacer`).
- **The same form, one section up:** :469-470, "no tick had to wait for a chunk at three times sprint speed" (the flight). It is named
  here and NOT changed by this lap. It has not been seen red today; if it is, it is the same class.
- **Its record today** (CORRECTED at the chair's 00:18Z message, from the librarian's corrected count; the order's "three landings,
  none re-read" was loose):
  - **red under load in three RUNS:**
    - A's suite on the kit branch, 15:23 (a branch suite, not a landing);
    - E's stomp landing, 16:04;
    - my yardstick landing, 23:50Z: 1 wait, 86.6 ms over 920 chunks, with C's world self-test running beside.
  - **green in landings between them:**
    - A's landing of the run frame, 15:41 (52 of 52);
    - C's tell-row landing, 16:41 (52 of 52).
  - My kit run (fcf5c43, 22:03Z) also read it green (53 of 53).
  - So the row moves WITH THE MACHINE'S LOAD AND NOT WITH THE CODE. The quiet read owed is for MY landing only (796c16f); section 4's
    first step is that read.

## 1. The choice: (2), MACHINE-BOUND, with the part that CAN be counted kept as a count row

**Why not (1).** The stream keeps two kinds of decision apart, by design (`world/stream.h:9-14`):
- "**What is wanted** is decided at tick boundaries from the player's position alone ... That is the same on every run."
- "**What is ready** depends on how fast the workers are, and differs from run to run."

`sync_waits` counts the second kind: a tick whose collision chunk the workers had not finished. "The workers keep ahead of a fall" is
therefore a race between worker throughput and a fall paced by the wall clock. Any count of chunks READY ahead of the player moves with
the machine's load exactly as the waits do, so it flakes the same way. Any count that is the same on every run (what is WANTED ahead)
comes from position alone, so it cannot see a slow generator. (1) asks for both at once: no flake under load, and red when the generator
truly lags. Counts cannot give both. (Section 4 tests this claim before anything is built on it.)

**What (2) is, concretely** [ours; each piece red first where a row can see it]:

1. **The row splits in two.**
   - **(a) "the wanted block leads the collision block all the way down"**, in COUNTS, the same on every run. At every tick of the
     fall, each chunk in the collision block was WANTED (it entered the loaded block) at least N ticks earlier. N is printed and
     measured on main before any bar is set. This guards what the code controls (`load_radius_v`, `collide_radius_v`, the margins,
     `follow_centre`), whatever the machine. It does NOT claim the workers finish in time.
     - Red first: on a streamer whose loaded block does not lead (`load_radius_v` set equal to `collide_radius_v` in a test-only
       params copy), it must go red.
   - **(b) the existing check, unchanged in what it reads** (`sync_waits == before.sync_waits`), MARKED MACHINE-BOUND.
     - Its line says so ("MACHINE-BOUND: a red under load is re-read quiet before it counts").
     - The self-test's summary counts a machine-bound red apart from the others.
2. **The exit.** When the ONLY reds are machine-bound, `dz-world --selftest` exits **3**, not 1, and prints
   `selftest: machine-bound red only: re-read quiet (…)`. Any other red still exits 1. A green run still exits 0.
3. **The named landing step, the quiet read.**
   - On exit 3, the lander re-runs `dz-world --selftest` ONCE under the EXCLUSIVE hold (a quiet window: no other heavy run, no game, no
     bench), and names it in the hand-back: "quiet read: …".
   - Green there: it lands, with both readings named. Red there: it is the landing's own, as any red.
   - Where it is written: dreamzone-3's own words on its checks (`tools/` or the README section that lists the self-test, whichever
     names `--selftest` today, found before code), and one line in the order to the lander. BUILDING.md and the landing train are not
     my files: the line for them goes to the librarian, to route.
   - The landing train's `failingRows` reads a self-test's FAILED total. Whether it should treat exit 3 as "re-read quiet" is the
     train's owner's call, named in the hand-back, not built here.

## 2. Its tests, registered red before the code

- **(a) leads:** green on main; red on the test-only streamer whose loaded block does not lead (above).
- **(b) marked:** with `worker_delay_ms` (the stream's own "slow machine" seam, `stream.h`) set so the workers lag, the fall row is red
  AND marked machine-bound, and the self-test exits 3, not 1, when it is the only red.
- **Any other red still exits 1:** a deliberately failed ordinary check alongside gives 1.
- **The marking cannot hide a non-timing failure:** with `reach_misses > 0` or `fell` short, the fall row is NOT machine-bound (only the
  `sync_waits` clause is), so it exits 1.
- **Hand mutants**, each must turn a row red:
  - the machine-bound mark applied to the whole fall row, not the waits clause alone;
  - exit 3 returned whenever any machine-bound row is red, even with an ordinary red beside it;
  - (a)'s lead read from what is READY, not what is WANTED.

## 3. What would show the choice wrong (falsifiers, before the run)

1. **"It could be said in counts."** (2) is wrong if a count exists that is the same on every run AND goes red when the workers truly
   lag. Section 4's experiment is the test.
2. **"The quiet read is red on main."** If the quiet read on main at `796c16f`, made before any code, shows waits > 0, then the
   generator truly falls behind a terminal fall on D. The row is right to be red, and (2) would only hide it. Then I stop, and the
   finding goes to the librarian as the unwelcome outcome below.
3. **Degenerating, registered in advance:** if three landings on, a landing reports a fall-row red WITHOUT a named quiet read, the
   declaration is "owed and none made" in a new coat. It is then the wrong fix, and the step must become a gate (the train's), not a line.

## 4. The experiment, before code (on main `796c16f`, the build tree on G:)

- **Quiet read now:** `dz-world --selftest` once under the exclusive hold → the fall row's waits on a quiet D. (Falsifier 2.)
- **Counts against a lagging generator:** the same fall at `worker_delay_ms` 0 and at a delay that produces waits, in a throwaway
  harness on the branch.
  - Printed for each: the waits; the WANTED lead in ticks (min over the fall); the READY lead in storeys (min over the fall).
  - Expected [ours]: WANTED lead equal at both, READY lead and waits moving together.
  - If the READY lead moved while the waits did NOT (or the reverse), a count would be telling something the clock does not, and
    falsifier 1 is in play.

## 5. The unwelcome outcome, in the words that would make it true

"**The generator cannot keep ahead of a terminal fall on this machine even when it is quiet**": the quiet read on main shows waits.
Then there is nothing machine-bound to declare. The fall is faster than the workers, and that is a finding about the game, for him and
C, not a test to soften.

## 6. My bias

I landed the run whose red I named as load, on an inference that the overlap was real (`p-land-yardstick-B_2026-11-13.md`, "inferred").
I would like (2) to be right, because it agrees with that call. Falsifier 2 and the quiet read are the guard, and they run first.

## 7. Not in this lap

- The flight row (:469-470), unless section 4 shows it is the same thing.
- Any change to the stream's radii, the generator or the fall speed.
- The landing train and BUILDING.md (routed, not edited).

## 8. Changed from the registration, by name, before the first run (00:5xZ)

The quiet read ran first (section 4): **green**, 52 of 52, the fall 0 waits over 921 chunks, on a quiet D (ring of 00:3xZ). Falsifier 2
does not fire. Then, before any code:

1. **(a)'s red is shown by feeding its counter a loaded block that does not lead** (the collision block itself, so nothing is wanted
   before it is needed), not by a params copy with `load_radius_v` = `collide_radius_v`.
   - A self-test frame is not one tick: ticks run at 240 Hz (`core/time.h:9`) and frames at 360 Hz.
   - The streamer steps its blocks before each tick (`world/stream.cpp:337-354`), so a side model stepped by frames would drift from
     it, and a params copy would need a second streamer and a second world.
   - The counter reads the REAL streamer's `load_box()` and `collide_box()` each frame (`stream.h`), and the red is the same counter
     on a block pair with no lead.
2. **(a)'s bar, now that N can be stated without guessing:**
   - every chunk that enters the collision block during the fall was in the loaded block at least ONE frame before;
   - no chunk enters unwanted;
   - at least one chunk enters.
   - N (the least lead, in frames and in metres) is printed beside it. A tighter bar would pin the radii, which the row does not own.
3. **The exit rule is proven inside the self-test, on a pure function** (`selftest_exit_code(failed, machine_bound_failed)`: 0, 3 or 1),
   with the hand mutants of section 2.
   - End to end it cannot be shown with the one seam the app can take (`--slow-workers MS`, below): slowing every worker also reddens
     the FLIGHT row (:469-470), which this lap leaves ordinary, so that run exits 1.
   - That run still proves two registered things: the fall's waits clause is red and marked machine-bound under a true lag, and any
     other red still exits 1.
4. **The seam:** `dz-world --slow-workers MS`, a test-only flag. It rebuilds the world with `StreamParams::worker_delay_ms` = MS
   (the stream's own "slow machine" seam), through a `WorldApp` setter applied in `make_world`. It is said as a test seam in its help
   line, and it is not a world setting.
