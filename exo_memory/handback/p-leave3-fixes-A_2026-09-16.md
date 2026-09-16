# P-LEAVE-3 R4-1..R4-5 · ALPHA — the fixes on B's read, built in a worktree on L

**Pane A, machine L, 2026-09-16 ~01:2x–0?:??.** Rulings at `loop/packet_diversity_c1_and_leave2_2026-09-15.md`
(f1179bf); B's read at `handback/p-leave3-read-B_2026-09-16.md` (bd5348d). **All five built. No stop.**
**B re-reads R4-1 and R4-2 before this lands.**

**Where this was built, because it is the part that had to be right:**
- `git worktree add C:/Consonance/wt-p-leave3 held/p-leave3-2026-09-15`, from 544ddd1.
- **`C:\Consonance\lighthouse` was never checked out onto the branch, the live exe was never rebuilt, and nothing was
  relaunched.** The keeper's seven seats and tonight's stick are untouched by this lap.
- Every cargo run below is `cd C:/Consonance/wt-p-leave3/consonance/src-tauri`, with its own target dir.

**Files changed (in the worktree, uncommitted):** `consonance/src-tauri/src/main.rs` only.

---

## 1 · WHAT EACH RULING BECAME

### R4-2 (B2) — bounded end to end
- `LeaveBounds` gains `result_deadline: Option<Duration>`. **NORMAL is `None`** — the keeper's disk gets as long as it
  needs. **SHUTDOWN is `Some(SHUTDOWN_RESULT_DEADLINE)`, 6 s**: three tries at step 6's 2 s retry.
- The step-6 loop gets a new arm BEFORE the retry arm, so the deadline cuts instead of sleeping again. When it cuts,
  the Leave goes on: `LEAVE_SHOWN`, `WM_LEAVE_DONE`, block released.
- **What that costs, named:** when the deadline cuts, the record is still missing. `LEAVE_STARTED` stays on disk, so
  the next launch reads case c. The alternative was holding a shutdown open forever, which is what B found.

### R4-1 (B1) — a session end during the keeper's close JOINS it
- `shutdown_leave` keeps one `exit_after` decision:
  - **CAS won** (no Leave running): it runs the fast Leave itself, `exit_after = true`.
  - **CAS lost** (the keeper's close owns `LEAVE_PHASE`): it waits for `LEAVE_SHOWN` on
    **`LeaveBounds::NORMAL.worst_case()`**, not on the shutdown export bound. `exit_after` is then whether that Leave
    actually finished.
- `WM_LEAVE_DONE` carries the decision in its `wparam`. The proc **always** releases the block; it exits only when
  `wparam != 0`.
- So the 20 s mid-export exit B found is gone: if the running Leave has not finished, **the block is released and the
  process stays**. Windows ends the session on its own schedule, the export is never orphaned, and a cancelled
  shutdown leaves the keeper's save running.
- **A second hole, found by re-reading my own patch after the tests were green:** `SHUTDOWN_LEAVING` is a latch, so
  after a release that does NOT exit, every later WM_QUERYENDSESSION would have been answered FALSE with no block
  taken and no path out — the app would have blocked the keeper's next restart silently and forever. The non-exit
  branch now clears the latch, so a later session end asks again (and by then the joined Leave has usually finished,
  so it exits at once). Pinned, and mutated as F17.
- **The tradeoff I am naming rather than burying:** when the joined Leave DOES finish, the process exits — even if the
  keeper cancelled the shutdown at the blocking screen. That is the same choice the ordinary shutdown path already
  makes, and it is the one I would revisit first if it bites.
- **`worst_case()`** = flights + seats + export + step 6. NORMAL's step 6 is unbounded, so the join contributes
  `JOIN_RESULT_GRACE` (60 s) for that term — **the one estimate in this design, named in the code rather than hidden.**
  NORMAL's worst case is therefore 10 + 5 + 600 + 60 = 675 s.

### R4-3 (B3) — one line
`WM_ENDSESSION` now ends in `DefSubclassProc(hwnd, msg, wparam, lparam)`, so tao's `loop_destroyed` still runs.

### R4-4 (B4) — 30 s, against measured closes
- `SHUTDOWN_EXPORT_TIMEOUT` is 30 s.
- **I re-derived L's three closes myself rather than quoting the ruling**: `persist.log` lines 1384-1385, 1440-1441,
  1507-1508, `LEAVE SAVING` → `LEAVE DONE`: **1789470754−1789470744 = 10 s**, **1789480488−1789480477 = 11 s**,
  **1789541534−1789541516 = 18 s**. They agree with the chair's figures.
- The comment carries those three, drops the 55 s first carry, says a cut export writes NOT_DONE and keeps
  LEAVE_STARTED, and carries the re-read rule.
- **The re-read rule fires on the next close of tonight's size, not later:** 18 s is *exactly* 60% of 30 s. The rule is
  live from the first close after this lands, and I would rather say that than let "60%" read as headroom.

### R4-5 (B6) — the hold is released on the path that set it
`held = hold` now runs from the CALL, before the answer is looked at. A 0 answer is logged as "treated as taken so the
release still runs" instead of being read as failure. The release is therefore unconditional on the path that set it.

### ROW 5 — full session hold, now AC-ONLY (R5-2)

**This section replaces what I first wrote here, and the amendment arrived after that pass.** R5-2 (3cc6324) was
committed at 01:21:18 and did not reach me until after the R4 mutants had finished; my first ROW 5 section said the
hold was "not conditioned on AC", because that is what the dispatch I held said. **That sentence is withdrawn.** The
chair has stated the miss is the chair's; I am recording it here because the hand-back is the record, and a reader a
month from now should see why the two texts disagree.

**What R5-2 became:**
- **`sync_launch::keep_awake_work(seats, leave_running, on_ac)` — pure, and it is where the gate lives.** It returns
  `seats + the running Leave` **only when `on_ac == Some(true)`**, and 0 otherwise.
- **`ac_line_status()` is Windows' own answer**: `GetSystemPowerStatus`, `ACLineStatus` — 1 is AC, 0 is battery,
  and anything else (255, or a failed call) is `None`.
- **`None` IS NOT AC.** An answer nobody gave does not earn a hold on someone's battery. It fails toward the OS's own
  policy, the same direction as the poisoned-lock case above.
- **Read EVERY POLL**, so unplugging releases the hold and plugging back in re-takes it while seats are live. The
  re-evaluation latency is one `KEEP_AWAKE_POLL` — **2 s** — and that is the mechanism: there is no power-broadcast
  handler, and a message-based one was not built.
- **Everything else in row 5 stands as the keeper ruled it:** full session hold while there is work, not softened, not
  conditioned on anything else, and the string sweep
  (`no_string_the_app_can_show_claims_it_stops_a_restart`) still passes over the Rust literals and the UI.
- On D this costs nothing (a desktop reads AC). On L it is the difference between a laptop that sleeps on battery and
  one held awake until it dies.

---

## 2 · MEASURED

Every bar runs through `scratchpad/bar_cargo.sh`, which **exits 9 on an empty stream** (no `test result:` line),
because cargo is not on bash's PATH here and a broken pipe must read as a failed bar.

    BASELINE, the branch as B read it (worktree, 544ddd1)
      cargo test --bin consonance -- --test-threads=1     670 passed · 1 failed · 4 ignored
        the 1: ready_signal_tests::a_slash_command… — D's known composer red, which travels with the branch

    RED FIRST (the five tests, against stubs: result_deadline None on both, worst_case = export only)
      cargo test                                          671 passed · 5 failed
        step_six_is_bounded_on_the_shutdown_path_and_unbounded_on_the_keepers_close   no deadline
        a_session_end_during_the_keepers_close_joins_it_and_does_not_exit…            joins on the wrong bound
        the_end_of_session_message_is_chained_to_tao                                  tao never sees it
        the_shutdown_export_bound_is_thirty_seconds_and_says_what_it_was_measured…    20 s, and the 55 s comment
        plus the known composer red

    GREEN
      cargo test                                          675 passed · 1 failed · 4 ignored   (670 + 5; the 1 is the known red)
      node dev/stick-waiter.test.js                       74 passed · 0 failed

    MUTANTS — on a COPY of the worktree's crate (scratchpad/fix_mutants.js), its own target dir, the worktree's
    src/ hashed before and after and refreshed into the copy on every run
      BASELINE of the unmutated copy: 673 passed · 3 failed (the known composer red + 2 copy-only repo-path tests),
      subtracted from every row
      R4-2, step 6
        F1  no deadline arm at all                        CAUGHT  step_six_is_bounded…
        F2  the deadline is checked only after a retry    CAUGHT  same        (survived the first run — see §3)
        F3  the shutdown path loses its deadline          CAUGHT  same
        F4  the keeper's close gains one                  CAUGHT  2 tests
      R4-1, the join
        F5  the join cuts at the shutdown bound again     CAUGHT  a_session_end_during_the_keepers_close…
        F6  the post always says exit                     CAUGHT  same
        F7  the proc exits whatever the Leave said        CAUGHT  same
        F8  the join never asks whether it finished       CAUGHT  same        (survived the first run — see §3)
        F15 worst_case forgets step 6                     CAUGHT  same
        F16 worst_case is the export alone                CAUGHT  same
        F17 the guard stays latched after a non-exit      CAUGHT  same
      R4-3 / R4-4 / R4-5
        F9  WM_ENDSESSION is swallowed again              CAUGHT  the_end_of_session_message_is_chained_to_tao
        F10 the export bound goes back to 20 s            CAUGHT  the_shutdown_export_bound_is_thirty_seconds…
        F11 the comment drops the newest measured close   CAUGHT  same        (survived the first run — see §3)
        F12 the comment drops the re-read rule            CAUGHT  same
        F13 the comment cites the first carry again       CAUGHT  same
        F14 the hold is recorded only on a non-zero answer CAUGHT the_keep_awake_hold_is_recorded_from_the_call… (survived the first run)
      SURVIVE-CONTROL  reword a comment                   SURVIVED
      SKIP-CONTROL     an anchor that does not exist      NOT APPLIED
      17 applied · 17 caught · controls behaved · worktree src unchanged: true

    MUTANTS — R5-2, scored after the amendment landed (same harness, --only)
        G1  the AC gate is gone: work counts on battery   CAUGHT  work_counts_only_while_the_machine_is_on_mains_power
        G2  unknown power is treated as AC                CAUGHT  same
        G3  battery is treated as AC                      CAUGHT  same
        G4  the Leave no longer counts as work            CAUGHT  same
        G5  the probe calls unknown power AC              CAUGHT  the_keep_awake_hold_is_taken_on_mains_power_only
                                                                  (survived once: my pin looked for "None", which the
                                                                  probe's error path still supplied — see §3)
        G6  the power source is not read at all           CAUGHT  same
      6 applied · 6 caught · worktree src unchanged: true

    AFTER R5-2
      cargo test --bin consonance -- --test-threads=1     677 passed · 1 failed · 4 ignored   (675 + 2; the 1 is the known red)
      node dev/stick-waiter.test.js                       74 passed · 0 failed

---

## 3 · CORRECTIONS, INCLUDING TO MYSELF

- **One of my five tests passed against the code it existed to change.** R4-5's first form looked for a specific
  `if prev == … { held = hold;` shape that the old code did not have (the assignment was in the `else`), so it was
  green before the fix — a test that could not fail. Replaced with an ORDER assertion: `held = hold` must come
  *before* the answer is examined. That version is red on the old code and green on the new.
- **One test was re-pointed at the implementation, and I say so because it is the weaker kind of change.** The step-6
  test looked for `result_deadline {`; the guard I wrote reads `b.result_deadline.is_some_and(|d| …)`. The guarantee
  it checks is unchanged — the deadline arm must come BEFORE the retry arm — and the mutant that moves the check after
  the retry (F2) is caught.
- **Four of seventeen mutants SURVIVED the first full run, and every one of them was a bad pin of mine, not a hole in
  the code.** Each matched text the mutant had left behind:
  - **F2** disabled the step-6 deadline with `&& false`; my pin only asked whether the guard's text was *present*. It
    now pins the arm's shape (`… => {`), so a disabled arm is not a passing one.
  - **F8** set `exit_after = true` in the join; my pin only asked that the POST carried `exit_after`. It now also
    pins that the value is computed from `LEAVE_PHASE`.
  - **F11** dropped "18 s" from the measured list — and passed, because "18 s" also appears in the re-read sentence
    below it. The pin now requires the three figures as one string, "10 s, 11 s, 18 s", plus the persist.log lines.
  - **F14** moved `held = hold` inside `if prev != 0`; my ordering assertion still held because `find` located the
    moved copy. It now also counts the occurrences and forbids an `if prev` between the call and the record.
  **This is the same class as the survivor I hit on D (M10): a pin that reads for a string rather than for the shape
  the string is in.**
- **My own harness scored those four wrongly the first time I re-ran them.** `--only` reuses the crate copy instead of
  re-making it, so the four ran against the tests as they were BEFORE I tightened them, and all four read SURVIVED a
  second time. The runner now refreshes `src/` from the worktree on every run, in both modes. **A stale copy is a
  harness that answers about the wrong source**, and nothing in its output said so — I caught it only because
  "unchanged after a fix" was not a believable answer.
- **R5-2's own survivor, G5, was the same class again.** The probe pin asserted the body contained "None" — which its
  error path supplies whatever the 255 branch does. It now pins the battery branch (`ACLineStatus == 0`) and the
  fall-through, and G5 is caught. **Three survivors in one lap, all "the string is still there" pins.** The rule I am
  taking from it: pin the SHAPE a value sits in (an arm, an order, a count), never the fact that a token appears.
- **B's B1 fix is not the one B sketched, and the difference is worth stating.** B offered "release without exiting"
  as the shape. I built that, but only for the join-timed-out case; when the joined Leave *finishes*, the process does
  exit, because the record is written and the session should be allowed to end. B re-reads this.

## 4 · WHAT I DID NOT VERIFY

- **Still nothing has run against a real Windows shutdown.** No rebuild, no relaunch, as ruled. The row-4 falsifier —
  a restart with the stick in, after which no LEAVE record exists — remains unscored, and D-6 stays "the app now
  tries", not "the app is covered".
- **The join has never been exercised.** No test drives two Leaves at once: `LEAVE_PHASE` transitions are pinned by
  source text, not by a run. A concurrency test would need the real Panes state and a spawned Leave, which is a
  bigger instrument than this lap.
- **`JOIN_RESULT_GRACE` (60 s) is a choice, not a measurement.** Nothing has measured how long step 6 takes when a
  disk refuses the record, because that case has never been observed here.
- **6 s for the shutdown step-6 deadline is likewise reasoned, not measured** (three tries at the 2 s retry).
- **30 s is measured against three closes on ONE machine**, all of which succeeded; no failing or slow close has been
  observed. A stick slower than L's is unmeasured.
- **The `.writing-<pid>` stray a cut carry leaves** is B's named cost, carried forward; I did not re-observe it.
- **tao's teardown after chaining WM_ENDSESSION was not run**, only read (B's citation, `event_loop.rs:2384-2392`).
- **The latch path has never run either.** F17 proves the store is there and that a test sees it; nothing has driven a second WM_QUERYENDSESSION after a non-exiting release.
- **No test drives the join with a real second Leave** (see above); the latch pin and the join pin are both source pins.
- **The AC gate has never been watched on a real unplug.** `GetSystemPowerStatus` is never called in a test; the pure
  half is tested with `Some(true)` / `Some(false)` / `None` by hand, and the probe itself is a source pin.
  **Nobody has pulled the plug on L with seats live and watched the hold drop within 2 s.**
- **The 2 s re-evaluation latency is a consequence of the poll, not a measurement**, and no power-broadcast handler
  was built.
- **The live exe on L is unchanged**, so none of this is in the binary the keeper closes with tonight unless the
  launcher rebuilds after this lands.
