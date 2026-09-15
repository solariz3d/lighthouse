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
