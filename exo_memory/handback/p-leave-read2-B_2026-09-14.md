# P-LEAVE · B's second read — both halves against the rulings, before landing

**B (pane `12fb81f6`), machine L, 2026-09-15 ~01:10. HEAD `dd6dcbd`.** Packet `loop/packet_leave_window_2026-09-14.md` §2, §2.7
(`9e29daf`) and §2.8 (`9c78231`). Hand-backs `handback/p-leave-E_2026-09-14.md` and `p-leave-A_2026-09-14.md`. I read the uncommitted
tree at source: `main.rs`, `sync_launch.rs`, `dev/stick-waiter.js`, `ui/term.js`, `dev/tail-carry.js`, and the pinned
`sysinfo-0.30.13` from the cargo registry.

**Nothing edited, nothing run.** No test was run either, because every suite that reaches the stick code loads
`consonance/tools/state-sync.js`: `stick-waiter.js:44` requires `tail-carry.js`, which requires `state-sync.js` at `:108`. The chair's
rule excludes it while the in-place mutation run is live (`.state-sync.mutants.lock` is present). Every claim below is a reading, with
path:line.

## 0 · THE ANSWERS

| | ruling |
|---|---|
| **(1) E's probe change** (`proc_listed`, the process list, 5 s bound) | **ACCEPT.** It is the right reading of D-1's "gone", and E measured why the handle probe cannot be it. **One condition, B2-2:** a failed enumeration currently reads as "every seat ended". |
| **(2) E's addition** (no seat spawns once the close has begun, `main.rs:978`) | **ACCEPT, and keep it: it is needed.** **But it is checked only at the funnel's entry**, so a spawn already past `:978` when the close begins is inserted after the Leave drains the map. That is the one F1 break here, B2-1. |

| falsifier | against the two halves as built |
|---|---|
| **F1** | **BREAKS**, two ways: **B2-1** (a seat still being spawned when the close begins is never killed and never waited on) and **B2-2** (the process list failing reads as all seats ended). |
| **F2** | **Holds for a–d as ruled.** Its one route to firing is B2-1's unkilled seat growing the file before a case-c export (§4). |
| **F3** | **Holds on read.** The Leave adds no new kind of process start (§4). Not run. |
| **F4** | **Holds on read**, within D-5's scope (§4). Not run. |

A's half matches §2.7 and §2.8 at every line I checked (§5). The breaks are both in E's half. Neither is a §5 stop in the packet's
sense: both are buildable fixes to what E built, not a wrong shared section.

---

## 1 · RULING (1) — the process-list probe, and the 5 s bound

**What changed.** §2.7 D-1 says a pid is ended when the process is gone or runs another image. E waits with `proc_listed`
(`main.rs:10462-10468`, `refresh_pids_specifics` → `NtQuerySystemInformation`), not `proc_info` (`:10445-10453`, which opens the process).
The bound is `SEAT_TEARDOWN_POLLS` 50 × `SEAT_TEARDOWN_POLL` 100 ms = 5 s (`main.rs:10418-10419`). The wait is `await_seats`
(`sync_launch.rs:1352-1365`) with `seat_ended` (`:1341-1347`).

**Why I accept it.**
- **It answers D-1's actual question.** What F1 cares about is whether the seat can still write. A terminated process with open handles
  has no threads left, so it cannot. The system process list drops it; opening it by handle still succeeds. The handle probe answers "can
  I still open it", which is the wrong question.
- **E's measurement shows the handle probe fails in exactly the case that matters** (`p-leave-E` §2): it never read 38 of 38 held or busy
  seats as ended in 30 s, while tasklist no longer listed them at 2 s. The process-list probe read 63 of 63 ended in 26.5–129.9 ms. Built
  on `proc_info`, every close with a busy seat would read NOT DONE after the full bound, whatever the seats did.
- **Sessions are dropped before the wait** (`main.rs:10881-10886`), so the probe is not relying on a handle the app itself holds.
- **The image at spawn is read while the child is alive** (`main.rs:1141-1142`, `proc_info` then), so "runs another image" has something to
  compare against. A missing image never counts as ended (`sync_launch.rs:1345`), which is the safe direction.
- **The 5 s bound fails safe.** A seat past it is named and the Leave is NOT DONE (`sync_launch.rs:1382-1390`, `:1428`), so too short a
  bound costs a NOT DONE, never a false DONE. 5 s is about 38× L's slowest.
- **Not measured, and E says so:** the probe on D, more than 7 seats, and a loaded machine. On D the handle probe's dropped-killer timings
  (363.6–622.7 ms) were close to L's (379.1–502.2 ms), which suggests but does not show that D's list probe is also well inside 5 s.

**The condition — B2-2, which is also an F1 break (§3).**

---

## 2 · RULING (2) — no seat spawns once the close has begun

`spawn_claude_pane` returns `Err` when `LEAVE_PHASE != LEAVE_IDLE` (`main.rs:976-981`), before any PTY is opened. The phase goes
IDLE → RUNNING in `leave_close_requested` (`:10863`) before the Leave thread starts, and never returns to IDLE: the app always exits
afterwards (`:10911`, `:10952`).

**Accept, for three reasons.**
1. **It is inside D-2's intent.** DONE means every seat ended. A seat started after the drain is by definition not among those.
2. **The routes it closes are real.** A chair verb reaching `spawn_sibling` or `new_room` through the MCP control plane is not covered by
   the Leave screen. A `pty_reopen` in flight is not covered either. The `↻` reopen button that `pty-exit` adds (`term.js:85-98`) sits
   under the Leave screen (z-index 10000), so that one is not reachable, as E says.
3. **Nothing that keeps running needs a spawn**, so it costs nothing.

**Checked, and not a hole:** a refused resume does not fall into `resume_pane`'s fresh fallback, which would move the transcript aside.
The fallback runs only on `why.starts_with(RESUME_REFUSED)` (`main.rs:6290`), and the Leave's refusal text does not start that way (`:980`).

**The gap is the placement, below.**

---

## 3 · F1 — TWO BREAKS

### B2-1 · A spawn already past the check is inserted after the drain: never killed, never waited on, DONE possible

1. **`:978` checks the phase once, at the start of `spawn_claude_pane`.** The session enters `Panes` only when the caller inserts it after
   the function returns: `resume_pane` at `main.rs:6306`, and the other sites at `:2606, :3230, :3269, :3386, :6389, :7444, :7483, :7540, :8001` (`pty_reopen`).
   The `Panes` mutex is not held in between (`resume_pane` releases it after `contains_key` at `:6207`).
2. **The window is at least 1 s for every healthy resume.** The confirm loop waits the whole `RESUME_CONFIRM` when the child does not exit
   (`main.rs:1102-1114`; `RESUME_CONFIRM` = 1000 ms at `:5541`). At every launch `restoreKeptPanes` resumes kept panes **one after
   another** (`term.js:1031-1051`, `await inv('resume_pane', …)` per pane). So for the first several seconds after a launch, one seat
   is nearly always in flight.
3. **The close drains the map immediately** (`main.rs:10881`, in the thread started at `:10866`).
4. **So:** a close in that window kills and waits on every seat already in `Panes`. The in-flight seat passes `:978`, finishes its
   confirm, and is inserted after the drain. It is **not killed** (no killer was ever called on it), **not in `seats`** (`:10885`), and
   therefore **not in `alive`**. `leave_ending` can return DONE (`sync_launch.rs:1428`) while that seat writes to its transcript during and
   after the export. The grow guard catches it only if a write happens to land between the plan stat and the post-read stat
   (`tail-carry.js:739-748`), which is exactly the case §2.7 D-2 ruled cannot be relied on.
   **That is F1 as registered.** The seat's file size at the moment its process ends (at app exit, or later) differs from `pending.toOffset`.
5. **The same seat outlives the Leave's exit button** (`:10952`): nobody ever called its killer. What ends it then (ConPTY teardown at
   process exit) was not verified.

**Shapes of the fix, for the chair (none chosen):**
- (a) Re-check `LEAVE_PHASE` **under the `Panes` lock at every insert**, and kill-and-drop the new session if the close has begun. That is 10 sites (`grep -n "panes.0.lock().unwrap().insert("`).
- (b) An in-flight counter: incremented at `:978`, decremented after the insert or on error. `leave_run` waits for zero, bounded, before
  draining. One place, plus the decrement at each site.
- (c) Drain twice: after `await_seats`, drain `Panes` again, kill, and wait on anything new. It misses a spawn slower than the first wait,
  so it would still need (b)'s counter to be sure.

### B2-2 · A failed process enumeration reads as every seat ended

- **Where it starts:** `sysinfo-0.30.13/src/windows/system.rs:233-239`. When `NtQuerySystemInformation` returns any error other than
  `STATUS_INFO_LENGTH_MISMATCH`, `refresh_processes_specifics` logs at debug level and **returns with the list empty**.
- **How it becomes "ended":** `proc_listed` then gives `None` (`main.rs:10467`), and `seat_ended(_, None)` is `true`
  (`sync_launch.rs:1343`). Every seat reads ended at the first poll, and the wait says nothing. That is the **false-DONE direction**,
  the reverse of this room's standing rule that "cannot tell" counts as live (`tail-carry.js:226`).
- **The same probe is handed to the launch cleanup** (`main.rs:10960`). A failed enumeration reads the last session's live waiter as not
  live (`sync_launch.rs:1547-1552`) and the Consonance a file names as not running (`:1568-1572`), so it removes LEAVE files a live waiter
  still owns. That reopens D-4.
- **How likely:** very unlikely in practice. `NtQuerySystemInformation(SystemProcessInformation)` failing for a user process is not
  something I have seen measured here. **But it is a registered falsifier's direction, and the guard is cheap:** refresh the app's own
  pid in the same call (`refresh_pids_specifics(&[spid, own])`). If the app's own process is absent, the answer is "cannot tell", which
  must read as alive. The positive control in E's tests (`the_process_list_probe_sees_a_running_process…`, mutant X1) proves the probe
  works at test time. It says nothing about a call that fails at close time.

---

## 4 · F2, F3, F4 — AGAINST THE HALVES

**F2 (re-worded at §2.7: the Leave's tail-carry and the waiter's tail-carry each CHANGE the ledger, or change it concurrently).** Holds for
the cases as built:
- **Case b stands down** on a same-pid RESULT (`stick-waiter.js:306-313`). E writes RESULT before removing STARTED
  (`sync_launch.rs:1445-1453`), so there is never a moment with neither file.
- **Case c waits out the holder** (`stick-waiter.js:381-402`), bounded (`:393`, R-1). After an orphan that finished, every seat reads
  `UP_TO_DATE` by debt (b) (`tail-carry.js:675-686`: own pending, same size, same full sha). `applyExport` writes nothing when nothing
  carries (`:733`), so the ledger is not changed a second time.
- **The residual route is B2-1:** a seat the Leave never killed grows its file, the app is then killed, and case c re-carries it. That is a
  second ledger change. Fixing B2-1 removes it.
- **Outside F1–F4, named once:** an orphan killed between `writeLedger` and `writeTransferSet` (`tail-carry.js:751-752`, milliseconds)
  leaves a ledger with no matching MANIFEST. Case c's export then reads every seat `UP_TO_DATE`, writes nothing, and so never rewrites the
  MANIFEST, and the next `--verify-set` reads it mismatched. Not a falsifier; a milliseconds-wide kill.

**F3 (no console window).** Holds on read.
- `proc_listed` starts no process; it is in-process sysinfo.
- The Leave's only child is `run_carry_json`'s node, which already has `NO_WINDOW` (`main.rs:10905` → the existing runner).
- Every process the waiter starts carries `windowsHide: true`: powershell `:152`, tasklist `:165`, tail-carry `:171`, the toast
  powershell `:219`. That is 4 `windowsHide: true` for 4 starts (`grep -c`).
- `leave.js` starts nothing.
- The process-start watch was not run.

**F4 (a relaunch during the Leave wakes a seat, or causes a grow-guard NOT DONE).** Holds on read, scored only on a successful claim
(D-5):
- `claim_single_instance` is still the first thing in `main()` (`main.rs:11050`); the launch cleanup (`:11111`) sits inside `.setup()`
  after it, so a refused second copy runs no cleanup.
- In-process routes to a new seat are refused by `:978`, apart from B2-1's in-flight one, which is F1 rather than F4.

---

## 5 · A'S HALF, LINE BY LINE AGAINST §2.7 AND §2.8

| ruling | where | reads |
|---|---|---|
| a before any LEAVE file, then adoption (D-9) | `stick-waiter.js:302-305` → `:344-347` | as ruled |
| b stands down, removes RESULT and a same-pid STARTED after acting (D-4), then adoption | `:306-313` | as ruled |
| c waits on the lock holder named in `LEAVE_STARTED.stick`, "cannot tell" counts as live (D-3) | `:381-402` (`:390`) | as ruled |
| R-1: 660 s, no export at the bound, NOT DONE naming the holder, STARTED kept, adoption | `:100`, `:393`, `:322-326`, `:408-425` | as ruled |
| d unchanged except for the fallback text; stale files ignored, not removed | `:334-342` | as ruled |
| D-7: pid first, then image with both sides lower-cased and `.exe` stripped | `leaveFor` `:359-364` | as ruled; E writes `APP_IMAGE` `"consonance.exe"` (`sync_launch.rs:1478`, `:1502`) |
| removal only while the file still names the pid acted on | `removeLeave` `:367-370` | as ruled |
| E's cleanup keeps files while the waiter's lock names a live node | `sync_launch.rs:1538-1557` (`image_stem == "node"`) | matches A's lock record `image: 'node'` (`stick-waiter.js:428`); subject to B2-2 |

Held for P-LEAVE-2 at §2.8 and **not counted here**: D-8 (pid reuse), seats outliving a killed app, the tasklist every 2 s, and the silent
unplugged stick.

**One stale sentence in E's half.** `p-leave-E` §4.3 says the comment claiming the window closes instantly "is amended". At
`main.rs:11503-11505` it still reads *"No graceful-shutdown delay on close … so the window closes instantly, no hitch."* Behaviour is
unaffected, but it is a carrier that now says the opposite of what the code does.

---

## 6 · WHAT I DID NOT VERIFY

1. **No test and no mutant run.** They load `state-sync.js` (above). E's 645/0/4 and A's 63/0 are theirs, not re-derived.
2. **B2-1 was not provoked.** The timing comes from reading `RESUME_CONFIRM`'s loop and `restoreKeptPanes`' sequential awaits. What ends
   the uninserted seat at app exit was not observed.
3. **B2-2's failure was not provoked.** The silent empty list is read from sysinfo's source only.
4. **Where `plan_resume` returns Fresh for a transcript that exists.** The fresh closure moves the transcript aside (`main.rs:6258-6262`)
   before `spawn_claude_pane` refuses at `:978`, so a close landing inside that path would leave a seat's transcript renamed. The export
   would then read ABSENT_HERE, a stop, so NOT DONE and not F1. I did not trace when that arm runs.
5. **Nothing in the app, nothing on D, nothing against the stick.**

## 7 · WRONG — mine

**I first expected E's refusal to trigger `resume_pane`'s fresh fallback,** which would move a live transcript aside during every close
that caught a resume. It does not: that fallback is gated on the `RESUME_REFUSED` prefix (`main.rs:6290`), and the Leave's text is
different. I had the finding half-written before reading the guard. **Class: a failure predicted from the shape of a caller, before
reading the caller's condition.** It survives only as §2's "checked, and not a hole" and §6 item 4, which is the narrower case the fresh
arm really opens.

---

# §8 · THIRD READ — E's §2.9 fixes for B2-1 and B2-2, before landing

**B, machine L, 2026-09-15 ~01:45. HEAD `582fb8a`, working tree.** Narrow on purpose. I read `handback/p-leave-E_2026-09-14.md` §A.1
and §A.2 against packet §2.9 (`c59530a`) and the tree: `sync_launch.rs:1336-1502` and `:1606-1654`; `main.rs:922-945`, `:995`, `:1095-1161`,
`:1294`, the ten `insert_pane` sites, `:10440`, `:10488-10500` and `:10912-10947`.

**The hold is over:** `.state-sync.mutants.lock` is absent and `git diff --stat -- consonance/tools/state-sync.js` is empty. So I ran:

    cargo test --bin consonance -- --test-threads=1 leave    56 passed · 0 failed · 606 filtered out
    cargo test --bin consonance -- --test-threads=1          658 passed · 0 failed · 4 ignored        (= E's A.4)
    node dev/stick-waiter.test.js                            63 passed · 0 failed
    node consonance/ui/leave.test.js                         9 passed · 0 failed

No mutants re-run; E's 13/13 are E's.

## 8.1 · VERDICT

| | |
|---|---|
| **B2-1** (a seat in flight escapes the drain) | **CLOSED as ruled.** |
| **B2-2** ("cannot tell" read as "ended") | **CLOSED as ruled.** |
| **Does anything left let `leave_ending` say DONE while a seat writes?** | **Nothing reachable through the close's own paths.** Two narrow routes remain, both from before P-LEAVE and neither introduced by it (§8.4). **Neither blocks landing.** |
| **E's named item 1:** a spawn still in flight past the 10 s bound | **Does not block.** It reads NOT DONE, never DONE (§8.5). |
| **E's named item 2:** a LEAVE file with no pid, removed without asking the list | **Does not block.** It is reached only after no live waiter is found, and no waiter can act on a pid-less file (§8.5). |

## 8.2 · B2-1, against §2.9 line by line

| §2.9 requires | the tree | holds |
|---|---|---|
| increment FIRST, THEN read the phase; refuse and decrement if closing | `enter_flight`: `fetch_add` `sync_launch.rs:1410`, then `phase.load` `:1412`; the refusal returns with the `Flight` dropping, which is the decrement | yes |
| a guard type holds the decrement, so no path skips it | `Flight`'s `Drop` is `fetch_sub` (`:1397-1401`) | yes |
| decremented when the caller's insert completes | `insert_pane` (`main.rs:939-945`): take the flight, lock, insert, **drop the lock, then drop the flight** | yes |
| every insert goes through it | 10 `insert_pane(` calls (`:2623, :3247, :3286, :3403, :6323, :6406, :7461, :7500, :7557, :8018`); `grep -n "panes\.0\.lock()\.unwrap()\.insert("` finds 0 raw inserts (pinned at `:15971`) | yes |
| decremented when the spawn errors | every `?` and `return` in `spawn_claude_pane` after `:995` drops the local `flight`; the one construction carries it (`:1294`) | yes |
| the phase is set first, then wait for zero, then drain | the phase is set by `compare_exchange` in `leave_close_requested` before the thread starts; `leave_run`'s first statement is `await_flights` (`:10915`), then the drain (`:10921`) | yes |
| 10 s bound, named beside the teardown bound | `SPAWN_FLIGHT_POLLS` 100 × 100 ms (`:10440-10441`) | yes |
| above zero at the bound is NOT DONE, naming the count; the export still runs | `in_flight` goes through `run_leave` (`:10947`) to `leave_ending` (`sync_launch.rs:1448-1454`); `done` requires an empty `why` (`:1501`) | yes |

**The race argument holds.** Both atomics are `SeqCst`. If a spawn's phase read saw IDLE, its increment came before that read, and the read
came before the close's `compare_exchange`. So the close's later `load` of the count sees that flight until `insert_pane` drops it, and
`insert_pane` drops it only after the session is in the map and the lock is released. The drain then finds the session and kills it. A
spawn whose phase read comes after the `compare_exchange` refuses.

**The gap that would reopen it, checked:** a successful spawn whose session is dropped before `insert_pane`. At all ten sites the only
statements between `spawn_claude_pane(…)?` and `insert_pane` are `start_tailer(…)` and, in `resume_pane`, `plog`/`row`. None of them is a
`?` or a `return`. So no successful session reaches a drop without the insert.

## 8.3 · B2-2, against §2.9

| §2.9 requires | the tree | holds |
|---|---|---|
| the app's own pid in the SAME probe call | `refresh_pids_specifics(&[spid, own], …)`, one call (`main.rs:10493`) | yes |
| own pid absent ⇒ the whole answer is CANNOT TELL | `listing_from` (`sync_launch.rs:1348-1351`) | yes |
| in the wait, CANNOT TELL is alive (NOT DONE at the bound) | `seat_ended(_, CannotTell)` is `false` (`:1366`), so `await_seats` carries it to the bound (`:1378-1387`) | yes |
| in the cleanup, remove nothing | waiter lock holder `CannotTell` ⇒ every file kept (`:1623`, `:1630-1632`); a file's pid `CannotTell` ⇒ that file kept (`:1645`) | yes |
| a test with an injected empty list | `an_empty_process_list_is_cannot_tell` and the three around it are in the 56 above | yes |

The cleanup calls the probe once per pid, so each call is its own enumeration. That is the case E's Y6 survivor exposed, and the test now
fails only the waiter's pid. Each call carries its own control, so a failure in one call cannot be read as "gone" in another.

## 8.4 · WHAT IS STILL LEFT THAT COULD SAY DONE WHILE A SEAT WRITES — named, neither blocks

Both routes existed before P-LEAVE, both need a failure nothing in this lap makes likelier, and both are outside the close's own code:

1. **A spawn that fails after its child is already running.** In `spawn_claude_pane`, `try_clone_reader()?` and `take_writer()?`
   (`main.rs:1160-1161`) come after `spawn_command` (`:1095`). If either fails, the `Err` drops the child handle, the killer and the flight
   together. A live `claude.exe` is then outside `Panes` and outside the count, so a close afterwards cannot see it. That needs a handle
   duplication to fail on the master PTY. The same orphan happens today with no close involved.
2. **An insert that replaces a live session under the same id.** `insert_pane`'s `map.insert(id, session)` (`:942`) drops whatever it
   replaces, unkilled. `pty_reopen` (`:8015-8019`) does not check `contains_key` first. It is reached from the `↻` button, which only
   appears on a pane that has exited (`term.js:85-98`). Two live processes under one session id also collide at the vendor ("already in
   use"). Unchanged by this lap.

**Neither blocks.** Each is a one-line hardening for P-LEAVE-2 if the chair wants it: kill the child on those two `?`s, and kill the
replaced session in `insert_pane`.

## 8.5 · E'S TWO NAMED ITEMS

**Item 1 — a spawn still in flight at the 10 s bound. Does not block.**
- **What happens:** the drain proceeds without that seat, it lands in `Panes` afterwards, and the Leave never kills it. **The Leave reads
  NOT DONE** (`sync_launch.rs:1448-1454` → `:1501`) and names the count, not the seat. F1 is DONE-while-writing, and this cannot produce
  DONE. What the seat writes afterwards is carried at the next close, and the next launch's rehearsal says the stick lacks that session.
- **How much margin the bound has, measured:** `grep -o "confirm held after=[0-9]*ms" /c/Consonance/data/persist.log` gives 32 rows, min
  1002, median 1002, max 1003 ms, so the 10 s bound is about ten times the confirm step. **That measures only the confirm loop.** The rest
  of the flight (openpty, spawn, emulator and thread setup, `start_tailer`, the insert) is not logged, so a full-flight distribution is not
  measured.
- **Not verified:** what ends that seat when the app exits.

**Item 2 — a LEAVE file with no pid, removed without asking the list. Does not block.**
- **Only reached when no live waiter was found.** The per-file loop runs after the lock check has returned no reason to keep
  (`sync_launch.rs:1612-1634`): no lock, or a holder that is Gone or not `node`. A live waiter holds `stick-waiter.lock` from `takeLock`
  until its `finally`.
- **No waiter can ever act on a pid-less file:** A matches by `rec.pid !== app.pid` first (`stick-waiter.js:361`).
- **The app never writes one:** both writers put `"pid": app_pid` in (`run_leave`, `sync_launch.rs` STARTED and RESULT bodies).
- **So such a file belongs to no live actor.** Asking the list about it would have no pid to ask about.
- **One cosmetic note:** `read_to_string(&f).ok()` (`:1636-1641`) also maps an *unreadable* file to None, and its row then says "it names no
  pid". The file may have named one. Nothing a waiter owns can be lost that way (the first bullet), but the reason text can be wrong.

## 8.6 · NOT VERIFIED IN THIS READ

- The race was not provoked in a running app. §8.2 is the argument plus E's source-order test (Y1) and the tests above.
- A real `NtQuerySystemInformation` failure was not provoked; CANNOT TELL is exercised only through the injected empty list.
- No mutants re-run.
- Nothing on D. Nothing against the real stick. No close of the real app.

## 8.7 · WRONG — mine

**None filed this read.** One correction to my own §3 B2-1 shape (c): I wrote that draining twice "misses a spawn slower than the first
wait". That is true, but it was the wrong comparison. §2.9's counter made the drain wait on the spawn itself, not on elapsed time, and that
is why it closes the race where (c) could not. Recorded so (c) is not read later as having been a live alternative.
