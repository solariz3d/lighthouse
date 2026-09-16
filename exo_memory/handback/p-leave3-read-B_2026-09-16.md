# P-LEAVE-3 ROWS 4 AND 5 — the non-author read, on L, before they land

**B (pane `12fb81f6`), machine L, 2026-09-16 ~01:0x. Branch `held/p-leave3-2026-09-15` at `544ddd1`, read at the sha.**
**Nothing checked out, nothing merged, nothing rebuilt, nothing relaunched. L's tree is untouched: the only file I
wrote is this one and my map line.** All line numbers below are in the blob at `544ddd1` unless marked `(L, live)`.

---

## 0 · VERDICT — NOT AS WRITTEN. Three changes to ROW 4 first; ROW 5 needs one ruling, not a change.

Nothing here is wrong in the way A's first build was wrong. The Win32 shape is right, the documentation A quotes is
quoted correctly, and the reuse of one Leave is real. **What is not safe yet is the interaction with the close that is
already running** — the one path the stake names.

| # | what | where | my call |
|---|---|---|---|
| **B1** | an OS session end **during the keeper's own close** exits the process at 20 s, mid-export | main.rs:11085-11093 + :11101-11109 | **blocking** |
| **B2** | the "bounded" fast Leave contains an **unbounded** retry loop, so the block can be held forever | main.rs:11006-11021 | **blocking** |
| **B3** | `WM_ENDSESSION` is answered without chaining, and tao **does** handle it | main.rs:11133-11138 vs tao-0.35.3 `event_loop.rs:2384-2392` | **land the one-line chain** |
| **B4** | the 20 s export bound has **2 s of headroom** against this machine's newest close, and the trend is up | measured below | **the chair's ruling, with the number** |
| **B5** | ROW 5 stops the idle sleep that `dev/dream/dream_cycle.ps1:2-3` is built on, and **no string tells the keeper** | dream_cycle.ps1:2-3, :111-116 | **the keeper's ruling** |
| **B6** | `SetThreadExecutionState` failure is read as `prev == 0`; if a success can return 0 the hold is never released | main.rs:11185-11196 | **unverified, cheap to make safe** |

ROW 5's code is sound. ROW 4 should not compile into the exe the keeper closes with until B1 and B2 are answered.

---

## 1 · Q1 — CAN IT BE BUILT AS WRITTEN, AND IS THE FAST LEAVE THE SAME LEAVE?

**The fast Leave is the same Leave. Confirmed, not taken on trust:**
- one `fn leave_run(` in the file — `git show 544ddd1:…/main.rs | grep -c "fn leave_run("` → **1**;
- `shutdown_leave` calls `leave_run(&app, LeaveBounds::SHUTDOWN)` at main.rs:11085, `leave_close_requested` calls
  `leave_run(&app, LeaveBounds::NORMAL)` at main.rs:10936;
- the test pins all three (main.rs:16199-16213).

**The bounds are what A says they are. I checked the constants rather than the prose,** because "1 s" is a product of
two numbers that live 500 lines apart:

| | polls | poll | = |
|---|---|---|---|
| `SPAWN_FLIGHT_POLLS` :10449 / `SPAWN_FLIGHT_POLL` :10450 | 100 | 100 ms | 10 s |
| `SHUTDOWN.flight_polls` :10924 | 10 | 100 ms | **1 s** ✓ |
| `SEAT_TEARDOWN_POLLS` :10444 / `SEAT_TEARDOWN_POLL` :10445 | 50 | 100 ms | 5 s |
| `SHUTDOWN.seat_polls` :10924 | 15 | 100 ms | **1.5 s** ✓ |

**Buildable:** the Win32 shape matches the crate in this tree. `SetWindowSubclass` is under `Win32_UI_Shell`
(Cargo.toml:37), `PostMessageW` takes `Option<HWND>` in windows 0.61 and A passes `Some(...)` (main.rs:11096-11101),
and `(lparam.0 as u32) & ENDSESSION_CRITICAL != 0` (main.rs:11115) parses as `(a & B) != 0` in Rust — **I nearly filed
that as a C-precedence bug; see §6.** The subclass is installed inside `.setup(move |app|` (main.rs:11346, install at
:11379), which runs on the thread that created the window, as both Win32 calls require.

**The visible-window precondition holds on this app, and it is worth stating because A's whole rebuild rests on it:**
`tauri.conf.json` declares exactly one window, `"label": "main"`, with no `"visible": false`; `grep` for
`WebviewWindowBuilder`, `.hide()` and `set_visible` in main.rs → **nothing found**. So there is one top-level window,
it is visible, and it is the one subclassed.

**I did not compile it.** That would mean checking the branch out on the machine the keeper closes with. A's 670
passed · 1 failed (the known composer red) is A's measurement on D, and it is the only evidence that this typechecks.

---

## 2 · Q2 — WHAT WINDOWS ACTUALLY GUARANTEES

I did not re-read Microsoft's pages; A quotes them and I take the quotes as quotes. What I can rule on is what the
code does with them, and there the answers are:

- **The 5 s is the answer budget.** The proc answers in the same call (main.rs:11121) and the work runs on a spawned
  thread (:11119). Correct use of the rule.
- **The block's time limit is not ours to know.** After a FALSE, Windows decides — with a user present it shows the
  blocking screen; unattended it forces after its own timeout. **Nothing in this repo can establish that number**, and
  A says so. I add only this: the code never relies on it except through B2 below.
- **Does a forced Update restart honour the block at all?** Unknown, and unknowable without a real restart on a built
  exe. A's own table row 6 quotes "applications cannot rely on being able to block shutdown" — so the honest status of
  D-6 after this lands is *the app now tries*, not *the app is covered*.
- **When the fast Leave exceeds the bound**: the export child is **killed**, not abandoned —
  `run_carry_json` does `child.kill(); child.wait()` at main.rs:10620-10623 and returns "the carry did not finish
  within Ns and was stopped". The Leave then writes its record with the export NOT_DONE. That part is clean.
- **What it drops then:** the export, and — because `tail-carry.js` writes through `.writing-<pid>` temporaries — a
  killed carry leaves a stray partial on the stick. That is not hypothetical here: L's stick carried exactly such a
  stray (`.writing-25288`, my `p-stick-preflight-B_2026-09-14.md`). It broke neither `--verify-set` nor the next
  export, so this is a named cost, not a blocker.

**B2 — the bound does not cover the whole Leave, and that is the gap.** `LeaveBounds` bounds the two waits and the
export. **Step 6 is a `loop` with a 2 s sleep and no bound** (main.rs:11006-11021): while the result file cannot be
written, it retries forever. On the shutdown path that loop sits between the save and `PostMessageW`, so:

> a disk that refuses `stick-leave.result.json` means `WM_LEAVE_DONE` is never posted, the block reason is never
> destroyed, and the app never exits — it just holds the shutdown until Windows forces it.

The fast Leave is not bounded end to end, which is the one property it exists to have. **Cheap fix:** give
`LeaveBounds` a deadline for step 6 too (NORMAL keeps today's forever), or break the loop when `b.label == "shutdown"`.

---

## 3 · Q3 — DOES ANYTHING CHANGE THE ORDINARY CLOSE PATH?

**On a close with no OS shutdown in it: no. Verified line by line.**
- `on_window_event` / `CloseRequested` (main.rs:11756-11757) is untouched by the diff.
- `NORMAL` carries the measured constants, and A added three assertions that say so
  (main.rs:16345, :16358, :16414) beside E's re-pointed pins.
- The only changed behaviour on that path is one log line — `LEAVE SPAWNS …` now prints ms and a label
  (main.rs:10959). It fires only when `in_flight > 0`. **Nothing parses it:** `grep -rn "LEAVE SPAWNS\|LEAVE SEATS\|LEAVE
  SAVING"` over every `.js`, `.mjs`, `.ps1` and `.json` in the repo → **nothing found**.
- Tonight's close on this machine, re-derived from `C:\Consonance\data\persist.log:1506-1509` (L, live): 7 seats killed,
  0 still running after **225 ms**, `LEAVE DONE code=0 — saved`. Nothing in this diff touches any of it.

**B1 — but there is a close-path change, and it is the blocking one: an OS session end that arrives WHILE the keeper's
close is running.** That is not exotic. The keeper closes with the stick in at the end of every shift, and Update
restarts at night; a restart chosen by hand during a close does the same thing.

The sequence, at source:

1. `session_end_proc` takes the block and spawns `shutdown_leave` (main.rs:11116-11120).
2. `shutdown_leave`'s CAS fails, because the keeper's Leave owns `LEAVE_PHASE` — the `Err(_)` arm waits for
   `LEAVE_SHOWN` **for at most `SHUTDOWN_EXPORT_TIMEOUT`, 20 s** (main.rs:11087-11092).
3. At 20 s it posts `WM_LEAVE_DONE` unconditionally (main.rs:11096-11103).
4. The proc destroys the block and calls **`std::process::exit(0)`** (main.rs:11127-11131).

The keeper's export was running on the **600 s** bound. So:

- **the running export is orphaned, not stopped** — `exit(0)` kills the Rust process, and `run_carry_json`'s kill path
  (main.rs:10620) is never reached, so the `node` child goes on writing to the stick with nothing left to record it;
- **no `LEAVE_RESULT` is written.** `stick-leave.started.json` stays, so the next launch reads **case c**, "died
  mid-save" — and may start a second export against a stick the orphan is still writing. That is the ledger-lock
  collision I filed as D-3 (`stick-waiter.js:346-357`, LEDGER_LOCKED retried 5 s × 60 s);
- **we release the very extension we asked for.** We took a block to buy the save time, then gave it back at 20 s on
  the one path where the app was already saving.

**What I would do instead, stated as a choice for the chair and not as a patch:** on the `Err(_)` arm, release the
block **without exiting** — let Windows end the session on its own schedule, and let the keeper's Leave keep writing if
the shutdown is cancelled. That needs a second message (or a flag on `WM_LEAVE_DONE`), because today every path through
that arm exits. Failing that, kill the export child before exiting, so the stick is not left with a live writer and no
record.

**One more, smaller (B3).** The `WM_ENDSESSION` arm returns `LRESULT(0)` without `DefSubclassProc` (main.rs:11133-11138).
A's subclass is installed after tao's, so it runs first, and tao **does** handle that message:
`tao-0.35.3/src/platform_impl/windows/event_loop.rs:2384-2392` calls `event_loop_runner.loop_destroyed()` when
`wParam` is TRUE. Swallowing it skips tao's teardown. The cost today is small — this app runs
`.run(tauri::generate_context!())` (main.rs:11769) with no `RunEvent` handler anywhere (`grep -n "RunEvent::"` →
nothing found) — but the fix is one line and the dependency's behaviour is not ours to assume twice.

**Checked and clean:** `WM_LEAVE_DONE = WM_APP + 0x51` (main.rs:11048) collides with nothing. tao registers all of its
own messages through `RegisterWindowMessageA` (`event_loop.rs:594-625`), which allocates in 0xC000–0xFFFF, and
`grep -rn "WM_APP"` over `wry-0.55.1/src` and `tauri-runtime-wry/src` → **nothing found**.

---

## 4 · Q4 — DOES ANY STRING IMPLY KEEP-AWAKE CAN STOP AN UPDATE RESTART?

**Nothing found, measured over a superset of what A's own test sweeps.** I reimplemented `claim_in` and
`shown_strings` (main.rs:16247-16307) in node and ran them over **every** `.rs`, `.js`, `.html` and `.css` file under
`consonance/src-tauri/src/` and `consonance/ui/` at `544ddd1` — 42 files, **8,700 shown strings, 0 hits.** A's own
`claim_sources` (main.rs:16232-16245) reads four of those places: main.rs, sync_launch.rs, and `ui/*.{js,html}`. So the
other 12 `.rs` files and the `.css` are unswept by the test and clean today; if the test is to keep its promise —
*"every string the app can show"* — those belong in `claim_sources`. Not blocking.

**The flip side is worth more than the sweep, and it is B5.** A grep for `idle sleep`, `keep.awake`, `stays awake`
across the same 42 files returns matches **only inside ROW 5's own comments and `plog` lines.** The UI says nothing.
So the app will stop the machine from sleeping and **tell the keeper nowhere he looks** — only `persist.log`. The sweep
guards against a false claim; there is currently no true one.

---

## 5 · B5 · ROW 5 COLLIDES WITH THE DREAM CYCLE, AND A'S HAND-BACK DOES NOT NAME IT

`dev/dream/dream_cycle.ps1:2-3` states its premise in its own first lines:

> *"Fired by a wake timer while the machine sleeps (AC only); the machine wakes, dreams once, and **Windows returns it
> to sleep on its idle timer**."*

and :111-116 names the keeper's habit the whole guard was rewritten around: *"The keeper leaves the app open and puts
the machine to sleep — the normal way to use it."*

`ES_CONTINUOUS | ES_SYSTEM_REQUIRED` is exactly a hold on that idle timer, and `work` counts a live seat
(main.rs:11175-11181). Seats are restored KEPT at every launch, so in practice **the hold is on for the whole session**.
Two consequences, neither of them a code defect:

1. **After a dream, the machine no longer returns to sleep** while Consonance is open with seats — which is always.
   The 04:30 task still runs and its idle guard still passes, so dreaming is not lost; what is lost is the sleeping.
2. **On L this runs on battery too.** `ES_SYSTEM_REQUIRED` is a hold on idle sleep, not a hold conditioned on AC —
   dream_cycle's battery guard (`:100-105`) protects the dream, not the battery. An unplugged laptop left with seats
   open now stays awake.

**An explicit sleep — the lid, or choosing Sleep — is unaffected**, so the keeper's own habit still works. This is a
ruling the keeper should make with those two sentences in front of him, not a defect to fix. **A's §5 says the hold
"would not have saved tonight" and names the two clean sleeps at 20:12 and 21:39; it does not mention that those
sleeps are what the dream cycle runs on.**

---

## 6 · B4 · THE 20 s EXPORT BOUND, AGAINST THIS MACHINE'S OWN NUMBERS

A calls the 20 s bound *"a judgment, not a measurement"* and cites the 55 s first carry. **L's ledger has three real
closes, and they are the right comparison** — every one an ordinary close with a tail, not a first carry.
Re-derived from `C:\Consonance\data\persist.log` (L, live), as the interval between `LEAVE SAVING` and `LEAVE DONE`:

| close (UTC) | export |
|---|---|
| 2026-09-15T11:12:24 | **10 s** |
| 2026-09-15T13:54:37 | **11 s** |
| 2026-09-16T06:51:56 (tonight's, :1506-1509) | **18 s** |

*(command: the node one-liner in my scratchpad over `persist.log`, pairing each `LEAVE SAVING` with the next
`LEAVE DONE`; 3 pairs found, max 18 s.)*

**The newest close used 90% of the shutdown bound, and the three are rising.** So on this machine, as of tonight, a
shutdown-time save is about one ordinary tail away from being cut. That does not make 20 s wrong — a cut export still
writes NOT_DONE and keeps LEAVE_STARTED, which is the guarantee A designed for — but the bound should be ruled with
this number beside it, and the "20 s" comment at main.rs:10918-10922 should carry it rather than the 55 s first carry.

---

## 7 · Q5 — WHAT IS UNTESTED, AND WHAT A TEST OF (a) WOULD LOOK LIKE HERE

A's §7 is accurate and I found nothing it hides. The short form: **no part of ROW 4's runtime behaviour has ever
executed.** Every one of A's 23 mutants is scored against tests that read the SOURCE TEXT (`fn src()`,
main.rs:15907) or a pure function. They prove the code says what it should say. They cannot prove Windows does
anything.

**A real test of (a) on this machine, without a restart, in three rungs:**

1. **The proc's own logic — safe, scriptable, and the one that should exist before this lands.** From another process,
   `SendMessageTimeoutW(hwnd, WM_QUERYENDSESSION, 0, 0, SMTO_ABORTIFHUNG, 8000)` against Consonance's main window
   (found by title "Consonance"), in PowerShell with `Add-Type`. That exercises: the block reason is taken, the Leave
   starts on another thread, FALSE comes back inside 5 s, `WM_LEAVE_DONE` is posted and the process exits. Read the
   result in `persist.log` — `SHUTDOWN WM_QUERYENDSESSION …`, then the LEAVE lines, then `SHUTDOWN block released`.
   **It costs one app exit, not a restart.** It also directly exercises B1: send it while a close is running and watch
   whether the export is orphaned.
2. **A logoff** — `shutdown /l` — is a genuine OS session end that Windows drives, and is far cheaper than a restart.
   It tests the 5 s rule and whether a block on this machine is honoured, without rebooting.
3. **The registered falsifier itself** — `shutdown /r /t 0` with the stick in, then look for a LEAVE record. Needs a
   rebuild, and only the keeper can spend it.

**What none of the three can test:** whether a *Windows Update* restart honours the block, because that is Update's
policy and it is not reproducible on demand.

---

## 8 · WHAT I DID NOT VERIFY

1. **I did not compile anything.** No `cargo`, no checkout, no rebuild, no relaunch. "It typechecks" is A's on D.
2. **I did not re-read Microsoft's documentation.** A's quotes are treated as quotes; my ruling is on the code's use of
   them.
3. **B6 is unverified.** `keep_awake_thread` reads failure as `prev == EXECUTION_STATE(0)` (main.rs:11191). That matches
   the documented NULL-on-failure. **I did not establish what a SUCCESSFUL first call returns for a thread with no
   previous state.** If that can be 0, `held` never becomes true: the hold is re-requested every 2 s, the release
   branch is unreachable, and `persist.log` takes a line every 2 s forever. Cheap insurance: log the refusal once, and
   take `held` from the intent.
4. **I did not run A's mutation harness or any cargo test**, so the 23/23 and the two controls are A's.
5. **The 2 s poll's lock on `Panes`** (main.rs:11174) — I traced no deadlock, since the thread holds nothing else, but I
   did not measure contention against a spawn or a drain.
6. **Whether other top-level windows ever exist** — I found one in config and no runtime builder, but I did not run the
   app and enumerate its windows.
7. **The three export durations are L's only.** D's ledger is on D, and D is where the restart happened.

---

## 9 · WRONG (mine, this lap)

- **W1. I had `(lparam.0 as u32) & ENDSESSION_CRITICAL != 0` drafted as a precedence bug** — C's rule, where `!=` binds
  tighter than `&`. Rust's is the opposite: `&` is above the comparisons, so it parses as intended. Caught by checking
  the table instead of the habit. **Class: importing another language's rule into a read of this one.**
- **W2. I nearly filed A's "1 s for flights" as wrong**, on the assumption that `SHUTDOWN.flight_polls = 10` meant ten
  one-second polls. `SPAWN_FLIGHT_POLL` is 100 ms (main.rs:10450), so 10 polls is 1 s and A is right. **Class: reading a
  bound off one of the two numbers that make it.** Both figures now sit in §1's table for the next reader.

---

## 10 · THE ONE LINE

**ROW 4 makes the OS's end of session run the save, and that is worth having — but as written it also lets an OS
shutdown end a close that is already saving, at 20 s, with the export still running and no record written.** Fix that
and the unbounded retry, chain `WM_ENDSESSION`, and it can land.
