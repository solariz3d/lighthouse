# P-LEAVE-3 R4-1 and R4-2 — the re-read, on A's fixes

**B (pane `12fb81f6`), machine L, 2026-09-16 ~02:1x.** Code read in the worktree `C:/Consonance/wt-p-leave3`
(branch `held/p-leave3-2026-09-15` at 544ddd1 + A's uncommitted fixes). A's hand-back at 5755cce
(`handback/p-leave3-fixes-A_2026-09-16.md`); my first read at bd5348d; rulings at f1179bf, R5-2 at 3cc6324.

**Scope kept: R4-1 and R4-2 only.** I did not read R4-3, R4-4, R4-5 or R5-2 this pass — the librarian re-derived
those and the chair's summary of that work is not re-litigated here.

**`C:/Consonance/lighthouse` was not checked out, nothing was rebuilt, relaunched, merged or committed.** I ran no
cargo. The only files I wrote are this one and my map line. *(Note for the record: 5755cce carries A's hand-back and
map line only — the code is uncommitted in the worktree, which is where I read it.)*

---

## 0 · VERDICT

**B1 is CLOSED. B2 is CLOSED for the failure I named.** Both fixes are better than sound — R4-1 in particular is a
better shape than the one I sketched, and I say so in §4.

**One new item, B7, found in this pass:** the same consequence B2 named — *the block held forever, the app never
exiting* — is still reachable through a panic in the Leave thread, which skips the `PostMessageW` entirely. It is
second-order (it needs a prior panic to poison the lock), the fix has precedent in this file, and **I do not think it
should hold the lap** — but the code's own words "bounded END TO END" (main.rs:10957-10959) are not yet true, and one
of those two should change.

| | ruling |
|---|---|
| **R4-2 / B2** | **YES for a disk that refuses.** Bounded at 6 s, line named in §1. Not bounded against a blocking syscall, and not against a panic (B7). |
| **R4-1 / B1** | **YES. The export is no longer cut, and the block's span is right.** Two residuals named in §2, neither blocking. |

---

## 1 · R4-2 — IS THE FAST LEAVE BOUNDED END TO END?

**For the failure I filed, yes, and the loop now ends.**

**The line that ends it: main.rs:11044.**

```rust
Err(e) if b.result_deadline.is_some_and(|d| t6.elapsed() >= d) => {
    plog(&format!("LEAVE RESULT still not written ({e}) after {} s — the {} bound ends the retry", …));
    break;
}
```

**What happens after it, traced to the exit:**

1. `break` leaves the loop with the record still missing.
2. `LEAVE_PHASE.store(LEAVE_SHOWN, …)` — main.rs:11061 — so a joining shutdown reads this Leave as finished.
3. `leave_run` returns to `shutdown_leave`, which posts `WM_LEAVE_DONE` with `exit_after` in the wparam
   (main.rs:11139-11145).
4. The proc destroys the block (main.rs:11179), then exits (main.rs:11185).

**The arithmetic is right and the arm is in the right place.** `t6` starts before the loop (main.rs:11038); the
deadline arm sits *above* the retry arm, so the check happens before each sleep, not after — three tries at the 2 s
retry, then the cut at 6 s. A's test pins that ordering explicitly (main.rs:16319-16321: *"the deadline is checked
after the sleep, so one more retry always runs"*). **NORMAL keeps `None`** (main.rs:10926), so the keeper's own close
still retries for as long as its disk needs. That is the right split.

**The cost is named where it happens** (main.rs:11042-11043): the record is missing, `LEAVE_STARTED` stays, the next
launch reads case c. Correct, and it is the trade B2 asked for.

### What "END TO END" still is not — and B7

Three things sit outside every bound in this Leave. The first two are syscalls and I raise them only so the phrase is
not read as a guarantee. **The third is B7 and is worth fixing.**

1. **The deadline is evaluated between attempts, not during one.** `write_leave_result` is a filesystem write; a disk
   that *refuses* returns `Err` and is now bounded, but a disk that *blocks inside the call* is not. Same for the
   `is_file()` stat in the retry guard.
2. **Steps 2 and 5 were never in `LeaveBounds` and still are not** — `find_stick(&volume_roots())` at main.rs:11011
   enumerates volumes, which is exactly the call that stalls on a removable drive being pulled, and the LEAVE_STARTED
   write inside `run_leave` has no bound either.
3. **B7 — a panic in the Leave thread never posts `WM_LEAVE_DONE`, so the block is never released and the app never
   exits.** `shutdown_leave` reaches `PostMessageW` on every *return* path, including the `else`, so A closed the
   ordinary holes. It does not reach it on an *unwind*. There is one panic site in `leave_run`'s own body:

   ```
   main.rs:10994   let sessions: … = app.state::<Panes>().0.lock().unwrap().drain().collect();
   ```

   A poisoned `Panes` mutex panics there. **That the lock can be poisoned is not my speculation — ROW 5 already
   handles it deliberately** (main.rs:11176-11178, *"a poisoned lock reads 0 seats and releases"*). So the same
   mutex is treated as poisonable in one place and unwrapped in the other, and the unwrap is on the shutdown path.
   `Cargo.toml` sets no `panic = "abort"` (no `[profile.release]` at all), so the default is unwind: **the thread
   dies, the process lives, the block stays, and the shutdown hangs until Windows forces it** — the exact sentence
   B2 was filed about.

   **Cheap, with precedent in this file:** wrap the `match` in `shutdown_leave` in `std::panic::catch_unwind`
   (main.rs already uses it three times, e.g. :4550), or post `WM_LEAVE_DONE` from a `Drop` guard so it fires on
   every exit from the function including an unwind. Either makes the property the comment claims true.

   **Checked and clean:** the Leave's pure callees hold no panic sites — `run_leave`, `write_leave_result` and
   `find_stick` in `sync_launch.rs` have no `unwrap()`, `expect(` or `panic!` (one `unwrap_or(false)` on a
   `file_type()`). I did not audit deeper than those three.

---

## 2 · R4-1 — RULING ON WHAT A BUILT

**A did not build what I sketched, and A's is better. Both of my questions come back clean.**

### Does a session end mid-close still cut the keeper's export?

**No. Nothing in the join touches the export.** The `Err(_)` arm (main.rs:11122-11134) waits and observes; the running
Leave keeps `b.export = LEAVE_EXPORT_TIMEOUT`, its 600 s. The exit is no longer a timer expiring — it is a fact:

```
main.rs:11128   exit_after = LEAVE_PHASE.load(Ordering::SeqCst) == LEAVE_SHOWN;
main.rs:11143   …WPARAM(u32::from(exit_after) as usize)…
main.rs:11183   if wparam.0 != 0 { … std::process::exit(0); }
```

So `exit(0)` is now reachable only *after* `LEAVE_PHASE` reached `LEAVE_SHOWN` — which happens at main.rs:11061,
after step 6, which is after `run_carry_json` has either reaped or killed the node child (main.rs:10620-10623).
**The orphaned export and the missing record are both structurally gone**, not merely made less likely.

**The join's own hole was found and closed by A, and it was a real one.** `SHUTDOWN_LEAVING` is a latch; a release
that does not exit clears it at main.rs:11189, so a later session end can ask again. Without that line the app would
have answered FALSE to every subsequent shutdown with no block and no path out. A found it by re-reading its own
patch after the tests were green, and says so.

### Is the block held for the right span?

**Yes, and the span is now always finite in both directions.**

| case | held for at most | = |
|---|---|---|
| this Leave does the work | `SHUTDOWN.worst_case()` = 1 + 1.5 + 30 + 6 | **38.5 s** |
| it joins the keeper's close | `NORMAL.worst_case()` = 10 + 5 + 600 + 60 | **675 s** |

Arithmetic checked against the constants, not the prose: `SPAWN_FLIGHT_POLL` and `SEAT_TEARDOWN_POLL` are 100 ms
(main.rs:10450, :10445), `LEAVE_EXPORT_TIMEOUT` 600 s, `JOIN_RESULT_GRACE` 60 s (main.rs:10965). `worst_case()` at
main.rs:10939-10944 sums exactly those four terms.

**Three things make this the right span rather than merely a bounded one:**

- **The release is unconditional and precedes the decision** — `ShutdownBlockReasonDestroy` at main.rs:11179 runs
  before the `if wparam.0 != 0` at :11183. There is no path that exits while still holding the block, and none that
  keeps the block after deciding not to exit. A's test pins the order (main.rs:16336).
- **The reason string is true for the whole span.** During a join the app really is saving — it is the keeper's own
  close doing it — so *"Consonance is saving this session to the stick."* is accurate for all 675 s.
- **The estimate fails in the safe direction.** `JOIN_RESULT_GRACE` is the one guess in this design, and the two
  unbounded terms in §1 can make a real close outlive `worst_case()`. When that happens the join times out,
  `exit_after` is false, and the block is released **without** exiting — the export is not orphaned. An underestimate
  costs a released block, never a cut save. That is the right way round, and it is worth stating because it is what
  makes the guess affordable.

### Two residuals, neither blocking

- **A second shutdown attempt arriving mid-join is answered FALSE with nothing pending for it.** The
  `WM_QUERYENDSESSION` arm answers FALSE on every non-critical query (main.rs:11173), whether or not it started
  anything; if the latch is still set, no new block is taken and no thread spawned. If the in-flight join then ends
  without exiting, the block is destroyed *under that second attempt* — a blocking screen with no reason on it. The
  attempt after that re-arms correctly, because the latch was cleared. Low harm, one narrow window.
- **The no-stick path never sets `LEAVE_SHOWN`.** `LeaveRun::Exit` returns at main.rs:11022-11026 after
  `app.exit(0)`, leaving `LEAVE_PHASE` at `LEAVE_RUNNING`, so a join against that close can only end by timeout. In
  practice the process is already exiting, so it is saved by `app.exit(0)` rather than by the logic.
- **A's named tradeoff stands and I accept it:** a joined Leave that finishes exits even if the keeper cancelled at
  the blocking screen. He had already started that close himself and its seats are already killed, so exiting is what
  he asked for. The sharper form is unchanged from before this lap and is the honest cost of the whole feature: **a
  shutdown that is aborted after we answered still costs the session**, because we killed the seats to save.

---

## 3 · A LIVE CHECK, BEFORE THIS REACHES THE EXE HE CLOSES WITH

Both answers are yes, so this is owed. **Everything below runs against a build in the worktree with its own target
dir and its own `CONSONANCE_DATA`, never the keeper's exe and never his stick.**

**One constraint that decides the scheduling:** the app claims a `Local\` named mutex and refuses a second instance
(`claim_named_singleton`, main.rs:6436-6450). So the test copy can only run **while the keeper's Consonance is
closed** — these checks belong in the gap between a close and the next launch, not alongside a live session.

1. **R4-1, the one that matters — the join (about 60 seconds of work).** Point the test build at a scratch data dir
   and a folder standing in for the stick. Click X to start an ordinary close; while `LEAVE SAVING` is in
   `persist.log` — the real window is 10-18 s on this machine — send the message from another PowerShell:
   `SendMessageTimeoutW(hwnd, WM_QUERYENDSESSION, 0, 0, SMTO_ABORTIFHUNG, 8000)` against the window titled
   *Consonance*.
   **Expect:** `SHUTDOWN a Leave was already running — joined it for N s; it finished, so this exits`, then a normal
   `LEAVE DONE code=0`, `stick-leave.result.json` on disk, and no `node` process left behind (`Get-Process node`).
   **Falsifier, stated before the run:** any `NOT exiting` line paired with a truncated export, a missing result
   file, or a surviving node child. That is B1 reopening.
2. **R4-2, the deadline (about 30 seconds).** No close running. Make the result unwritable — create
   `stick-leave.result.json` as a *directory* in the scratch data dir — then send the same message.
   **Expect:** three `trying again in 2 s` lines, then `the shutdown bound ends the retry` at ~6 s, then
   `SHUTDOWN block released — exiting so the session can end`.
   **Falsifier:** retries continuing past 6 s, or no exit.
3. **B7, if the guard lands:** the same as (2) with the `Panes` mutex poisoned first. There is no clean way to poison
   it from outside, so this one is a unit test with a deliberately poisoned lock, not a live check.
4. **The genuine OS session end, once (1) and (2) pass:** `shutdown /l`. A logoff is a real WM_QUERYENDSESSION driven
   by Windows, it exercises the 5 s rule and whether a block is honoured on this machine, and it costs a logoff
   rather than a reboot. The registered falsifier — a restart with the stick in — stays the keeper's to spend.

**What none of these can show:** whether a *Windows Update* restart honours the block. That is Update's policy, it is
not reproducible on demand, and after this lands D-6's honest status is still *the app now tries*.

---

## 4 · WRONG (mine)

- **W1. My proposed fix for B1 was worse than A's, and taken literally it was broken.** I wrote: *"release the block
  without exiting — let Windows end the session on its own schedule."* Unconditionally. That would have meant the app
  never exits on the session-end path at all, including when the joined Leave finishes with the record written and
  nothing left to protect — leaving the shutdown to be forced every time. **A's version carries the decision in the
  message (main.rs:11143, :11183), so "do not exit" applies only to the case that earned it.** Class: proposing a
  remedy at the level of the symptom, when the defect was that a *timer* was standing in for a *fact*.
- **W2. I nearly filed the deadline arm as ineffective**, on the assumption that a guard added to a loop that sleeps
  would be evaluated after the sleep. The arm is above the retry arm (main.rs:11044 before :11048) and A's test pins
  that exact ordering. Checked the order rather than assuming it.

---

## 5 · WHAT I DID NOT VERIFY, THIS PASS

1. **I ran nothing.** No cargo, no mutants, no app. The 677/1/4, the waiter 74/0 and `--only G1` are the librarian's
   re-derivation, not mine.
2. **R4-3, R4-4, R4-5 and R5-2 were not read** — out of scope by the packet.
3. **B7's reachability is argued, not demonstrated.** I established the panic site, the unwind default and that the
   codebase treats `Panes` as poisonable. I did not construct a run in which it poisons.
4. **Panic auditing stopped at three callees** (`run_leave`, `find_stick`, `write_leave_result`). Anything they call
   is unexamined.
5. **Nothing about the 675 s span has been observed on a real blocking screen** — including whether Windows shows the
   reason for that long, or forces first. It almost certainly forces first.
6. **I did not diff the worktree against 5755cce line by line**; I confirmed instead that 5755cce contains no code at
   all, so the worktree is the only copy of what would land.

---

## 6 · THE ONE LINE

**B1 is closed by a better fix than the one I proposed, and B2 is closed for the disk that refuses — but the sentence
"bounded END TO END" is still one unwind away from being false, and that door is three lines from being shut.**
