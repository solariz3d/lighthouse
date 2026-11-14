# Registration: the Rust red `shelf_tests::the_index_window_is_newest_first_by_date_not_by_path` (pane B, D, 2026-11-14, before any code)

Ruling: the chair's D675 order of 00:45Z: "CAUSE FIRST, AND REGISTER WHICH BEFORE CODE, with today's folders as the recorded case: (1) the
shelf's index SHOULD carry a dated subfolder's newest file; or (2) the test should NOT walk into subfolders. Say what would show your
choice wrong. A test that reads the live room goes red when the room grows; say in the registration whether it should read a fixture
instead, and why or why not." Tier: PROVE IT. Base: lighthouse main `c5311e1b`.

## 0. The cause, read from the code (main.rs at `c5311e1b`)

- **The window** orders the index tier by date, newest first, then by LABEL ASCENDING within one date (`:8874-8878`, groups 1 and 2), and
  stops at `LIBRARIAN_INDEX_BUDGET` = 30,000 B (`:8249`, `:8880-8887`).
- **The test** takes "the newest dated index entry" as the MAXIMUM `(date, label)` pair (`newest_dated_index_label`, `:8538-8551`): the
  newest date, and among that date's entries the alphabetically LAST label. It asserts that label is on the shelf (`:19617-19632`).
- **The two tie-breaks are opposite.** While one date's entries all fit, both agree. Once one date has more entries than the window holds,
  the window carries that date's entries from "a" upward and runs out before the label the test picked.
- **The recorded case:** today's seven `loop/*_2026-11-13/` folders hold 152 files (22 + 28 + 12 + 17 + 9 + 52 + 12, `ls`). Each is dated
  2026-11-13 by its folder, because `label_date` takes the LAST date in the label, by design (`loop/2026-08-18/README.md` → 2026-08-18,
  pinned at `:19583`). The test's pick, `loop/wake_level2_2026-11-13/shelf_builder.md` ("w"), is last of them. inferred: the window at
  30,000 B is full before it; the experiment below prints it.
- **So the window is newest-first; the test's claim that it is not is false.** The red is a tie-break the test chose differently from the
  code it checks, exposed when one day's entries outgrew the window.

## 1. The choice: neither (1) nor (2) as framed; (3), the test asks for the window's own first entry, on a fixture

- **(1) already holds:** the index carries a dated subfolder's files, dated by the folder (`label_date`, `:8270-8296`, the pinned case
  at `:19583`). Nothing in it needs to change for this red.
- **(2) would hide real entries:** today's swarm output IS the newest work in the room, and an index that skipped subfolders would drop
  152 of today's paths from the librarian's shelf to make a test pass. It would also change the strict walk, which `newest_first` and
  the window's header counters read.
- **(3), the change:** "the newest dated entry" in the test becomes the FIRST entry of the newest date in the WINDOW'S OWN order (date
  descending, label ascending). It is then the entry the window must carry first. And the test reads a FIXTURE room (below), not the live
  one, with a recorded case built in: one date with more entries than the window holds, spread over dated subfolders, with labels on both
  sides of the alphabet.

## 2. The live room or a fixture: a fixture, and why

- The test's claim is about the RULE (newest first, by date, not by path). On the live room it holds or fails with how many files one day
  produced: green this morning, red tonight with no code changed. That is the same shape as the fall row: a row that moves with something
  other than the code.
- The rule is pure over (label, date) and a budget. A fixture states the case it means, every time: an old file named to sort high
  (`loop/wire_run_2026-08-15.md`, the original bug's shape), a newest date with more entries than the budget, and dated subfolders.
- **What the live room still gets:** nothing is lost. The intake tests that read the live room for size (`light_the_librarian_intake…`,
  the cap row at `:20066`) keep reading it; this row is about order.
- The fixture is built the way `light_the_shelf_carries_a_fixed_set_and_never_backfills` builds its room: a scratch dir. The walk reads
  `room_master_path()`, so the fixture is pointed at through `DirsGuard`, as the 31 DIRS tests do.

## 3. Its rows, red first

1. **The recorded case, red at HEAD:** on the fixture, with one date holding more entries than an index budget of a few lines, the CURRENT
   test logic (max label) is red. It is the same red as on the live room tonight, made deterministic.
2. **Green after:** the window's first entry of the newest date is on the shelf and comes before the old `wire_run` file.
3. **Still red when the window is NOT newest-first:** a hand mutant that sorts the window by path again (the 2026-09-01 bug) must turn
   the row red on the fixture.
4. **A hand mutant on the tie-break** (label descending within a date) must turn it red too, so the row pins both the date order and the
   tie order the window uses.

## 4. What would show the choice wrong (falsifiers, before the run)

1. **The cause is not the tie-break.** If, on the live room, the window's first entry of the newest date is ALSO missing from the shelf at
   30,000 B, then the window is not newest-first and the red is real. Checked first, before any code (the experiment).
2. **A fixture hides a live-only failure.** If, after the change, a later landing shows the live room's shelf NOT starting its index with
   the newest date, the fixture missed something the live room has. The landing's cargo run prints the shelf's first index line beside
   the row, so this is readable without a new instrument.

## 5. The experiment, before code (on lighthouse main, under the ordinary lock)

The existing test on the live room, plus one throwaway print: the newest date's entry count and bytes against 30,000; the window's first and
last carried labels of that date; and the test's pick. Expected: the window full of 2026-11-13 entries, "a…" to some letter before "w"; the
pick past the cut. If the window's first entry of the newest date is absent, falsifier 1 fires and I stop.

## 6. My bias

None strong: I did not write this test (D277 repair names it); I did write the Lap W shelf code that moved the light shelf, which this
strict-walk row does not read.
