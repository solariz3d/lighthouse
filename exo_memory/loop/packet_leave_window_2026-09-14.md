# P-LEAVE · the close window — Consonance saves to the stick itself and tells you when to unplug it. Lap D063.

**To ECHO and ALPHA, with BRAVO reading §2 FIRST, 2026-09-14 ~11:35, on machine D.**

**Why these three.** The keeper asked for this: "go ahead and have the orch open the leave window lap" (11:16). The
work shape is the librarian's (`librarian/2026-09-14.md`, 06:49 entry, 7f4e61e, §1 "P-LEAVE second", §2–§3).
- **B reads first.** B found the reopen-before-DONE race (`handback/p-stick-preflight-B_2026-09-14.md` §8) and the
  which-code-runs-at-exit question (§6), and B built none of this. A and E start only when the chair re-rings them.
- **E** owns the app, the handshake constants and the window (L059, P-DIVERGED).
- **A** owns the waiter (L059, P-NO-CONSOLE).

## 0 · THE KEEPER, VERBATIM

> *(06:41)* "could we do like an actual tauri window or something that looks like consonance as the terminal window
> that tells you its okay to remove stick after close?"

And the idea file's own Leave paragraph (`loop/stick_arrival_module_idea_2026-09-14.md:21`): *"On app exit, if the
stick is mounted, run the export; show the result and refuse to be dismissed until it is DONE or FAILED by name —
ON-EXIT's behaviour, inside the app."*

**Standing rule, unchanged:** no console or terminal window ever (P-NO-CONSOLE, `packet_no_console_windows_2026-09-14.md`
§2). A Tauri window is not a console. The process-start count must still be zero.

## 1 · WHAT EXISTS TODAY, READ AT SOURCE ON D

- **Nothing handles the window closing:** no `CloseRequested`, no `on_window_event`, no `RunEvent` in `main.rs`.
  `app.exit(0)` appears only in the applier confirm path (`main.rs:10740`, `:10804`).
- **Nothing tears all the seats down.** `pty_kill` (`main.rs:7969`) kills one pane through its `killer`. Nothing ends
  every seat and waits.
- **The exit export is the waiter's** (`dev/stick-waiter.js:14-40`). It starts at launch and runs
  `tail-carry --export --json --apply` after the app is gone.
- **Why exports stop when a seat is still writing:** `tail-carry.js:746` refuses a seat whose source grew while it
  was read ("the source grew while it was being read"). That is B's §8 race: a reopen before DONE makes that seat NOT
  DONE.
- **Single instance:** `claim_single_instance` (`main.rs:6424`), checked first in `main()` (`:10885`). A second copy
  shows "Consonance is already running" and stops (`:6464`).
- **The export runner:** `run_carry_json` (`main.rs:10511`) starts node with no window. Rehearsals use
  `STICK_REHEARSAL_TIMEOUT` = 300 s (`:10392`). The first full carry (348,007,682 B) took 55 s (2f7233c).
- **The existing handshake constants:** `sync_launch.rs:774-781` (`APPLY_STARTED`, `APPLY_RESULT`, `STICK_KEEP`).
  **Liveness:** `holderLive` (`tail-carry.js:226`) says a record is live when its pid runs under the image it names.
  "Cannot tell" counts as live. `pidImage` returns the image lower-case without `.exe` (`:219`).

## 2 · SHARED SECTION — build exactly this. §5 applies to every line.

**2.1 · Two files in `<data_dir>`, named beside `APPLY_STARTED` in `sync_launch.rs`.** Both are written
tmp-then-rename.

    LEAVE_STARTED = "stick-leave.started.json"
        { "pid": <the app's pid>, "image": "consonance", "at": "<ISO>", "stick": "<folder>" }
        written by the APP after every seat has ended and before tail-carry starts

    LEAVE_RESULT  = "stick-leave.result.json"
        { "pid": <the app's pid>, "image": "consonance", "startedAt": "<ISO>", "at": "<ISO>", "stick": "<folder>",
          "outcome": "DONE" | "NOT_DONE", "code": <tail-carry exit code, or null if it never returned>,
          "why": "<text or null>", "rows": [ <tail-carry's rows, or []> ] }
        written by the APP when tail-carry returns, times out, or cannot start. LEAVE_STARTED is removed after it.

    "image" is the literal "consonance", which matches pidImage's shape (tail-carry.js:219) for consonance.exe.

**2.2 · What the Leave does (E).** On the main window's close request, prevent the close, then:

    1  end every seat (each pane's killer), and WAIT until every seat's process has exited, with a bound E measures
       and names. A seat still alive at the bound is named in the Leave screen, and the export still runs; the
       grow guard (tail-carry.js:746) refuses that seat by name. That is NOT DONE, never DONE.
    2  find the stick (the §3 rule, find_stick)
         none         -> exit as today: no Leave screen, no files
         many         -> Leave screen, NOT_DONE naming every folder; write LEAVE_RESULT; nothing exported
         one folder   -> Leave screen "Saving to the stick — don't unplug it yet"; write LEAVE_STARTED;
                         run_carry_json(["--stick", f, "--export", "--json", "--apply"], LEAVE_EXPORT_TIMEOUT)
    3  LEAVE_EXPORT_TIMEOUT = 600 s, named beside STICK_REHEARSAL_TIMEOUT, with the 55 s measurement in its comment
    4  outcome DONE only when tail-carry exits 0 AND no row stops. Every other ending is NOT_DONE with why:
       exit 1 (a seat stopped, named), exit 2 including LEDGER_LOCKED (the holder, named), a timeout, a spawn failure
    5  write LEAVE_RESULT, remove LEAVE_STARTED, then show DONE ("you can unplug it now", with the folder) or NOT DONE
       (by seat and reason)
    6  exit only on the keeper's click, and that button exists only after LEAVE_RESULT is written. A second close
       request while the export runs is prevented, and the screen says the save is still running.

**2.3 · The order at exit, as the WAITER reads it (A).** When the app pid the waiter watched is gone:

    a  APPLY_STARTED live                                  -> stand down (unchanged, stick-waiter.js:22)
    b  LEAVE_RESULT with pid == the watched app pid        -> stand down, whatever its outcome. The keeper saw it by
                                                              name. The waiter never deletes it.
    c  LEAVE_STARTED with pid == the watched app pid,      -> THE APP DIED MID-LEAVE: take over with today's export
       and no such LEAVE_RESULT                               path. The notices say this is the fallback.
    d  neither file for this pid                           -> today's path unchanged (no stick: quiet; a stick: export
                                                              with the fallback notices). That is the hard kill
                                                              before any Leave.
    A LEAVE_* file naming a DIFFERENT pid is stale. The waiter ignores it. The app removes stale LEAVE_* files at
    launch, when the named pid is not live under "consonance".

**2.4 · The two guards.**
- **The applier never runs at exit.**
- **Both the app and the waiter run tail-carry, and the ledger lock (`wx`, L059 A-3) is the second guard.** A
  collision is LEDGER_LOCKED, exit 2, and it must read NOT DONE with the holder named, never silent and never DONE.
  By 2.3 the waiter exports only in cases c and d, and in both the app's Leave did not finish, so a collision needs
  a live tail-carry left by a killed app. The lock rule handles that.

**2.5 · B's §8 race, closed by construction.** The Leave runs inside the still-running app, which holds the single
instance (`main.rs:6424`). A relaunch during the Leave shows "already running" and exits before any seat can wake.
So no seat writes during the export.

**2.6 · The window (E's design call, inside the bar).** Reuse the main window: hide the seats and show the Leave
screen in the `#stick-setup` family (`index.html:22`, `stick.js`, `app.css:607`). No second OS window unless E
measures a reason and says so. Consonance-styled, no console.

**2.7 · RE-RULED ~11:45 after B's first read** (`handback/p-leave-read-B_2026-09-14.md`; re-derived by the librarian).
**§5 fired, and every defect is the chair's.** The chair checked `main.rs:920-926`, `:1077-1084`, `:10423-10427`,
`stick-waiter.js:76-79`, `:270-292`, and portable-pty-0.8.1 `win/mod.rs:71-78` at source. **Where this block
conflicts with §2.1–2.6, build this block.**

    D-1  §2.2 step 1 has nothing to wait on. PtySession is {writer, master, killer} (main.rs:922-925) with no pid; the
         Child is dropped (:1080); reader EOF does not fire on exit (:1077-1079). And portable-pty's
         WinChildKiller::kill returns Err on a SUCCESSFUL TerminateProcess and Ok on failure (win/mod.rs:71-78), so
         nothing may read the killer's result as "ended".
         RULED (E): keep the child's pid in PtySession at spawn (child.process_id(), read before the Child is dropped),
           at every spawn site. Step 1 waits on the pids: a pid is ended when the process is gone or runs another
           image. The killer's return value is never read as evidence.

    D-2  Steps 1 and 4 contradict. The grow guard (tail-carry.js:739-748) catches a write between the plan stat and
         the post-read stat. It does not catch a live seat that writes nothing in that window and writes afterwards.
         So "export anyway, the guard refuses it" can read DONE: F1, as the section is written.
         RULED (E): DONE requires ALL of: every seat's pid ended within the bound, tail-carry exit 0, and no row stops.
           A seat alive at the bound is NOT_DONE and named. The export still runs for the others.

    D-3  Case c plus 2.4 cannot hold with F2. An app killed after LEAVE_STARTED leaves its tail-carry running and
         holding the lock (run_carry_json starts it with NO_WINDOW only). Today's export path retries LEDGER_LOCKED
         every 5 s for 60 s (stick-waiter.js:78-79), so the waiter would write the ledger a second time once the
         orphan finishes.
         RULED, B's option (ii) (A): in case c the waiter reads the holder pid from consonance-tails/ledger.lock, waits
           until that pid is not live, and only then runs today's export. An orphan that finished leaves nothing to
           carry (A's debt (b): an own pending that equals the file carries nothing). An orphan that died leaves the
           export to be done.
           F2 IS RE-WORDED: "A close at which the Leave's tail-carry and the waiter's tail-carry each CHANGE the
           ledger, or change it concurrently."

    D-4  The launch-time cleanup can delete LEAVE_RESULT before the old waiter's next 2,000 ms poll reads it. That
         turns case b into case d, and the fallback exports while the relaunched seats wake (B's §8 through the
         fallback, and F2).
         RULED: THE WAITER OWNS REMOVAL (A). It removes a LEAVE_RESULT or LEAVE_STARTED only after acting on it: case
           b after standing down, case c after its export. The app's launch-time cleanup (E) removes LEAVE_* files
           only when <data_dir>/stick-waiter.lock names no live holder AND the named app pid is not live, and it runs
           after set_dirs (L051). "The waiter never deletes it" in 2.3 b is struck.

    D-7  2.1's "image": "consonance" never matches on the Rust side, whose vocabulary is p.name() (main.rs:10425) and
         APP_IMAGE "consonance.exe" (sync_launch.rs:1219).
         RULED: "image": "consonance.exe" in both files. A's comparison lower-cases and strips ".exe" on BOTH sides
           before comparing (pidImage's shape, tail-carry.js:219). The waiter matches the LEAVE files by pid == the
           watched app pid first; the image is a second check.

    D-9  Case b's stand-down returns before the adoption block (stick-waiter.js:275-277 against :286-289), so a
         relaunch inside one poll leaves the new session with no waiter.
         RULED (A): cases a and b run the adoption check (step 4) before returning. A new app pid means adopt and
           keep waiting.

    D-5  The single-instance mutex fails OPEN on an error (main.rs:6404-6407).
         RULED: 2.5 is scoped. The Leave closes B's §8 race whenever the mutex was claimed. It is not a guarantee
           against a failed claim, and F4 is scored only on a launch whose claim succeeded.

    D-6  A Windows shutdown runs no Leave; tao handles only WM_CLOSE. The waiter dies with it.
         RULED: named, not built. No falsifier is scored by shutting down. The next launch's "the stick does not have
           your last session" notice is what covers it.

    FIGURE: 2.2 step 3's timeout comment cites the first carry as 348,026,190 B written in 55 s (2f7233c;
    librarian/2026-09-12.md:35, :47). The chair's 348,007,682 B was the rehearsal total. WRONG 107 is the
    librarian's, repeated by the chair.

## 3 · THE SPLIT — neither of you edits the other's files

    ECHO    consonance/src-tauri/src/main.rs, sync_launch.rs, consonance/ui/* (+ tests)
            §2.1 constants and writers, §2.2, §2.3's launch-time stale cleanup, §2.6; a test per 2.2 step 2 branch and
            per step 4 ending (LEDGER_LOCKED included); MEASURE the seat teardown bound on real seats and name it.

    ALPHA   dev/stick-waiter.js, dev/stick-waiter.test.js
            §2.3 a-d with fixtures for each case and the stale-pid case; the notice text names "fallback"; nothing
            else about the export changes. Mutants for 2.3 on a COPY.

## 4 · FALSIFIERS — registered before the build

    F1  A close with the stick in after which the Leave says DONE while any seat's pending.toOffset differs from that
        seat's file size at the moment its process ended.
    F2  A close at which both the Leave and the waiter write the ledger.
    F3  Over a process-start watch covering a launch, three minutes idle, and a close with the stick in: any
        OpenConsole.exe or WindowsTerminal.exe -Embedding.
    F4  (positive form of 2.5) A relaunch while the Leave runs wakes a seat, or makes the Leave read NOT DONE by
        the grow guard.

    BOTH  cargo test --bin consonance -- --test-threads=1 (D: 608/1/4 today, the pre-existing composer red) ·
          node dev/stick-waiter.test.js · node consonance/ui/stick.test.js · mutants on a COPY
          · what you did NOT verify · nothing with --apply against the real stick
    BRAVO reads §2 BEFORE the build, every line against source, path:line; then reads both hand-backs.

## 5 · IF A SHARED SECTION IS WRONG — verbatim from L059 §6

**§2 is what the other half builds against.** If either of you finds one of them cannot be built as written, **STOP
building on it, write down why in your hand-back, and ring the librarian then.** Do not change a shared section in
place and keep going, and do not build around it.

## 6 · HAND-BACK

`exo_memory/handback/p-leave-<letter>_2026-09-14.md` (B: `p-leave-read-B_…`), then `call_librarian` with the path in
the same turn. One line to your own map. Do not commit; both halves land together.
