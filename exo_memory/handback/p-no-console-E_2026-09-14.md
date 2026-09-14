# P-NO-CONSOLE · ECHO — §5 STOP: §1's mechanism is half right, measured. The fix §3 asks for is still right, for a different reason.

**Pane E, machine L, 2026-09-14 ~05:40.** Nothing built, nothing committed, nothing run with `--apply`. §5 says to stop
and ring if the mechanism in §1 does not reproduce. Half of it does not, so I stopped before touching `main.rs`.
Everything below was measured with a stand-in, not the app. The measurements a ruling needs are all here, including
waiter survival under the new flags, so the chair can rule "build as written" in one pass.

## 0 · THE ANSWER IN FOUR LINES

1. **The flash is real and reproduced.** The live waiter's `tasklist`, parent 26800, was followed within 0.1 s by
   `conhost`, then `OpenConsole -Embedding`, then `WindowsTerminal -Embedding`: §1's pattern, caught again at 05:28:57 and 05:30:58.
2. **§1's premise does not hold.** §1 says *"`windowsHide: true` is already set at `stick-waiter.js:131` and the window
   opened anyway, so the hide flag on the child is not enough."* Measured, **the hide flag IS enough**, even under
   `DETACHED_PROCESS`. The flashing call was not `:131`.
3. **The call that flashed** is the one the chair's watch recorded, `tasklist /FI "PID eq <pid>" /FO CSV /NH`. It is
   `tail-carry.js::pidImage`, and **at HEAD it had no `windowsHide` at all.** A added the flag in the working tree
   minutes ago, with a P-NO-CONSOLE comment saying exactly this.
4. **§3's flag change is still right, and measured:** under `CREATE_NO_WINDOW | CREATE_NEW_PROCESS_GROUP` a console
   child **without** `windowsHide` does not flash, and the waiter still outlives the app, hard kill included. So it
   covers every child in the subtree that forgets the flag. That is the reason to build it, not the one §1 gives.

## 1 · THE CALL THAT FLASHED, AT SOURCE

    git show HEAD:dev/tail-carry.js | grep -n "PID eq"
      207: execFileSync('tasklist', ['/FI', `PID eq ${pid}`, '/FO', 'CSV', '/NH'], { encoding: 'utf8' })     <- no windowsHide
    working tree (A, in flight):
      210: ... { encoding: 'utf8', windowsHide: true }

    stick-waiter.js:138   tasklist /FI "IMAGENAME eq ..."  windowsHide: true   — a different filter from the one the chair saw
    stick-waiter.js:125   powershell.exe ...                windowsHide: true

**The live waiter (pid 26800) started at 05:14:50.** HEAD's last change to `tail-carry.js` is `0405bd2`, at 04:51, so the
waiter loaded the unhidden `pidImage`. **It keeps flashing once a minute until the app relaunches, whatever either fix
does**, because a running node process does not reload its modules.

## 2 · THE FOUR CELLS

**Harness.** A **Windows-subsystem** binary: no console, the shape the release app has to the OS. It spawns
`node <stand-in>` with exactly `main.rs`'s creation flags. The stand-in makes the waiter's flashing call —
`tasklist /FI "PID eq <its parent>" /FO CSV /NH` through `spawnSync`, with a **valid** filter — 5 times, 2 s apart.
`windowsHide` is set per cell.

**Watch.** `Win32_Process` polled every ~150 ms, the chair's instrument shape. Each `OpenConsole` or `WindowsTerminal`
`-Embedding` start, and each `conhost` start, is attributed by parent pid to the console programs started within 1 s
before it. The live waiter's once-a-minute flash is a **positive control inside the same watch** whenever it falls in a window.

    cell        flags                                   child windowsHide   terminal hosts attributed to the stand-in
    A-nohide    DETACHED_PROCESS | CREATE_NEW_PROCESS_GROUP   false         15 — conhost + OpenConsole + WindowsTerminal, on 5/5 calls
    A-hide      DETACHED_PROCESS | CREATE_NEW_PROCESS_GROUP   true           0 windows — 5 hidden conhosts only
                                                                              (the LIVE waiter's unhidden call at 05:30:58, in the
                                                                               same window, DID raise OpenConsole + WindowsTerminal)
    B-nohide    CREATE_NO_WINDOW | CREATE_NEW_PROCESS_GROUP   false          0
    B-hide      CREATE_NO_WINDOW | CREATE_NEW_PROCESS_GROUP   true           0

Every stand-in call succeeded (`status=0`, 49–50 bytes of `tasklist` CSV), so no cell reads clean because the call failed.

**What each cell establishes:**
- **A-nohide** is the stand-in's own positive control: it reproduces §1's flash on every call. The instrument can see
  the flash — 15 of 15 host starts caught, because `OpenConsole` and `WindowsTerminal` outlive the call that raised them.
- **A-hide** refutes §1's premise. The same parent flags and the same call, with the hide flag on the child: no
  window, while the unhidden live waiter flashed in the same window.
- **B-nohide** is why §3's flags are worth having. The parent hands its console children a **hidden** console to
  inherit, so a child that forgets `windowsHide` still opens nothing.

**One limit on B:** the watch saw only 1 of the 5 `tasklist` starts in each B cell — inside an inherited console they
finish faster than one poll. What B's zero rests on is the terminal hosts, which A-nohide shows the watch catches 15/15 when
they occur. **Unattributed `conhost` starts appear in every cell**, with no console program within 1 s. They are not
`OpenConsole`/`WindowsTerminal`, so no window. Their source is unexamined; the likeliest is this pane's own tooling.

## 3 · SURVIVAL UNDER THE NEW FLAGS — §3(a)

Same harness. The "app" goes three ways, and the stand-in logs 8 calls over ~15 s, recording each time whether its parent is alive.

    trial              flags      how the app went                  after the app was gone
    S-nowindow-exit    NO_WINDOW  exits normally at 3 s             SURVIVED — 6 calls after, reached done
    S-nowindow-kill    NO_WINDOW  taskkill /F (no handler runs)     SURVIVED — 6 calls after, reached done
    S-nowindow-tree    NO_WINDOW  taskkill /F /T (the tree kill)    DIED — 0 calls after, never done       <- positive control
    S-detached-kill    DETACHED   taskkill /F                       SURVIVED — 6 calls after, reached done  <- L059's prior

**The tree kill is what shows the survival check can report a death.** Without it, four SURVIVEDs would prove nothing.
A tree kill reaches children under either flag set; that was true before this change too, and nothing in Consonance does one today.

## 4 · WHAT I PROPOSE THE CHAIR RULES, AND WHAT IS READY TO BUILD

**Build §3 as written — with §1's reason replaced:**

    main.rs:10567  start_exit_waiter      DETACHED_PROCESS | CREATE_NEW_PROCESS_GROUP  ->  NO_WINDOW | CREATE_NEW_PROCESS_GROUP
    main.rs:10699  stick_start_applier    DETACHED_PROCESS | CREATE_NEW_PROCESS_GROUP  ->  NO_WINDOW | CREATE_NEW_PROCESS_GROUP
    DETACHED_PROCESS constant             removed — nothing else uses it (grep)

    the reason:  a console-less parent makes every console child it starts allocate a console of its own, and one
                 started without windowsHide is drawn by Windows Terminal (A-nohide). A hidden console for the
                 waiter and the applier to hand down means a forgotten flag anywhere in their subtree — tail-carry,
                 place-conversations, powershell, cmd — no longer opens a window (B-nohide). Survival holds (§3).

**The sweep, done:** `grep -n "Command::new"` over `main.rs` and `sync_launch.rs` gives 8 sites. Six already pass
`NO_WINDOW` (`:6334`, `:6340`, `:7534`, `:7858`, `:9828`, `:10505`). Two do not — the two above, both mine from L059.
No other file in `consonance/src-tauri/src/` calls `Command::new`.

**Planned tests, once ruled:** one that parses every `Command::new` builder in both files and requires `NO_WINDOW` in its
`creation_flags`, and never `DETACHED_PROCESS`, red-first against HEAD (it fails on `:10567` and `:10699`). Plus mutants on
a copy: restore `DETACHED` at each site; drop `NO_WINDOW` from one of the other six.

## 5 · FOR ALPHA — the same finding bears on A's half

A's §3 asks for `windowsHide: true` on every child spawn, which A-hide shows is sufficient per child. A's `pidImage`
edit is the fix for the call that actually flashed. **§2's replacement for the export window (a notification) does not
rest on §1's premise** — it rests on the keeper's "ever", which stands. Nothing here tells A to stop. It tells A which
of its edits removed the flash the keeper saw.

## 6 · WHAT I DID NOT VERIFY

- **Nothing ran through the app itself.** The real waiter and applier were not started under the new flags. That
  needs a rebuild and relaunch, which ends every seat, so it belongs to the landing. The stand-in makes the flashing
  call; it is not the waiter.
- **The notification** (A's) — whether showing one opens anything. Not measured by me.
- **§4's falsifier as written** — a launch, three minutes idle, and an exit under one watch — belongs to the landing.
- **A tree kill** takes the waiter down under either flag set. Nothing in Consonance does one, but a keeper or a
  script running `taskkill /T` on the app would stop the export too.
- **Anything on D.**

## 7 · SCRATCH, FOR RE-RUNNING

    C:\Users\zackn\AppData\Local\Temp\claude\C--Consonance-instances-sibling-07b8a48f\a2122153-a37e-41a6-a86f-534267ec0565\scratchpad\noconsole\
      harness\          the Windows-subsystem spawner (built into scratch\target — NOT the shared C:\build\lighthouse-target;
                        a first build landed there through the global CARGO_TARGET_DIR, and exactly those conharness* files
                        were removed: `find /c/build/lighthouse-target -iname "*conharness*"` -> 0)
      standin.js · watch.ps1 · score.js · cells.sh · survive.sh · cells.out · *.watch.jsonl · *.standin.log

---

# BUILD — §3 ECHO as written, after the re-rule (5190f73, repaired at 04bc6b5)

**Built. Nothing committed. Nothing ran with `--apply`.** One file changed: `consonance/src-tauri/src/main.rs`.

## What changed

    start_exit_waiter      .creation_flags(DETACHED_PROCESS | CREATE_NEW_PROCESS_GROUP)  ->  NO_WINDOW | CREATE_NEW_PROCESS_GROUP
    stick_start_applier    .creation_flags(DETACHED_PROCESS | CREATE_NEW_PROCESS_GROUP)  ->  NO_WINDOW | CREATE_NEW_PROCESS_GROUP
    const DETACHED_PROCESS removed; nothing else used it
    the reason, carried at CREATE_NEW_PROCESS_GROUP and pointed to from both spawns: §4 of this hand-back's stop, not
    §1's original reading — a console-less parent makes its console children allocate their own, and a hidden
    console for them to inherit makes a forgotten windowsHide anywhere in the subtree open nothing

## The tree-kill exception, named

A **tree kill of the app** (`taskkill /F /T`, or anything that ends the whole process tree) takes the waiter and the
applier down with it, under **either** flag set — measured, S-nowindow-tree: 0 calls after the parent was gone, never
done. Nothing in Consonance kills a tree today. A keeper or a script that does, however, stops the export the waiter
exists to run, and a Carry that is waiting on the applier. The exception is written into the source beside the flag, so
the next reader of `CREATE_NEW_PROCESS_GROUP` meets it without opening this file.

## Red first — shown on the tree before the change

    no_console_tests::every_process_the_app_starts_is_started_with_no_window          FAILED
      "these spawns carry no NO_WINDOW and can open a terminal window: [src/main.rs:10563, src/main.rs:10687]"
    no_console_tests::no_process_is_started_detached                                  FAILED
    no_console_tests::the_waiter_and_the_applier_get_a_hidden_console_and_their_own…   FAILED
      "fn start_exit_waiter( does not start its child with NO_WINDOW | CREATE_NEW_PROCESS_GROUP"

**The sweep named exactly the two sites §3 names and no others** — without being told which.

**One test I narrowed after writing it, and why.** The first `no_process_is_started_detached` forbade the token
`DETACHED_PROCESS` anywhere in the file, comments included. That would have forbidden the source from saying why the
flag is gone. It now forbids **defining** the constant and **passing** it to any spawn's `creation_flags`, and D5 below
still catches the constant coming back.

## The sweep — every `Command::new` in main.rs and sync_launch.rs

    main.rs:6334   git rev-parse           NO_WINDOW   (unchanged)
    main.rs:6340   git worktree add        NO_WINDOW   (unchanged)
    main.rs:7534   git worktree remove     NO_WINDOW   (unchanged)
    main.rs:7858   claude -p               NO_WINDOW   (unchanged)
    main.rs:9828   node state-sync --pull  NO_WINDOW   (unchanged)
    main.rs:10505  node tail-carry --json  NO_WINDOW   (unchanged)
    start_exit_waiter                      NO_WINDOW | CREATE_NEW_PROCESS_GROUP   (was DETACHED_PROCESS | …)
    stick_start_applier                    NO_WINDOW | CREATE_NEW_PROCESS_GROUP   (was DETACHED_PROCESS | …)
    sync_launch.rs                         none — it starts no process, and a test pins that (L059)

**None could not carry `NO_WINDOW`.** No other file under `consonance/src-tauri/src/` calls `Command::new`. The
panes' own processes are spawned through portable-pty into a ConPTY, not `Command::new`, and draw no window by
construction; they are not in this sweep and are not claimed by it.

The test reads each builder from `Command::new` to its first `.spawn()`, `.status()` or `.output()`, so a
`let mut cmd = …; …; cmd.creation_flags(…)` split across statements (the applier) is read whole. It requires at least
**8** sites: that floor is the test's own positive control, since a pattern that matched nothing would pass vacuously.

## The bars

    cargo test --bin consonance -- --test-threads=1        593 passed · 0 failed · 4 ignored   (590 + 3)
    node dev/tail-carry.test.js                            108 passed · 0 failed
    node dev/stick-apply.test.js                            24 passed · 0 failed
    node dev/stick-waiter.test.js                           39 passed · 0 failed
      (A's files, read-only. A's mutation run held .tail-carry.mutants.lock throughout, pid 23920; its harness writes
       mutants into .tail-carry.mutant-23920.js, and the tracked tail-carry.js differed from HEAD only by A's
       4+/1- windowsHide edit — so these suites read the real file, not a mutant.)

    MUTANTS — a scratch copy of the crate, a baseline run of the unmutated copy first (2 copy-only failures, both
    repo-path tests, subtracted), tracked files hashed before and after
      D1  the waiter started detached again (flag by value)          CAUGHT  every_process… · the_waiter_and_the_applier…
      D2  the applier loses NO_WINDOW                                CAUGHT  every_process… · the_waiter_and_the_applier…
      D3  one of the six older spawns loses NO_WINDOW                CAUGHT  every_process_the_app_starts_is_started_with_no_window
      D4  a new spawn with no flags at all                           CAUGHT  every_process_the_app_starts_is_started_with_no_window
      D5  the detached-process constant defined again                CAUGHT  no_process_is_started_detached
      D6  the waiter loses its own process group                     CAUGHT  the_waiter_and_the_applier_get_a_hidden_console…
      SURVIVE-CONTROL  reword the rationale comment                  SURVIVED
      SKIP-CONTROL     an anchor that does not exist                 NOT APPLIED
      6 applied · 6 caught · controls behaved · tracked source untouched: true

**Each test carries weight no other test does:** D3 and D4 only the sweep catches, D5 only the detached test, D6 only
the waiter/applier pin.

## What I did NOT verify

- **The real app under the new flags.** No rebuild, no relaunch: that ends every seat and belongs to the landing. The
  §4 falsifier — a launch, three minutes idle, and an exit under one process-start watch — is the landing's to run,
  and the one that will show whether the real waiter and applier stay windowless end to end.
- **The live waiter (pid 26800) keeps flashing until that relaunch**, whatever lands. It loaded HEAD's unhidden
  `pidImage` at 05:14:50 and does not reload modules.
- **A's notification.** Whether showing one opens anything is A's measurement.
- **A tree kill** takes the waiter down, as named above. Nothing measured whether any keeper path does one.
- **Anything on D.**
