# P-BLIND-WRITE-PATH (L064) — both states now reach the board, and `main.rs` is untouched

**ECHO, on D, 2026-09-16 ~07:4x. Two minutes past the 07:38 mark; I would rather be late than hand back a record
I had not finished checking.** Object, owed by the record: `handback/p-blind-rows-C_2026-09-16.md` §4.1 and §4.2
(landed d27ec19), read at source.

**THE REPAIR NEEDS NO `main.rs` CHANGE, AND THAT IS THE FINDING, NOT A CONVENIENCE.** Nothing was built, nothing
relaunched, no Rust touched. Two JS files changed, both already covered by their own suite.

    consonance/hooks/blind.js        +36 lines   (the toggle now records the window)
    consonance/hooks/blind.test.js   +70 lines   (8 new tests, red first) and one NUL fixture escaped

    tests   9/9 before  ->  17/17 after, in place
    mutants 8 applied: 7 caught · 0 SURVIVED · 1 NOT APPLIED (the intended control)

## 1 · WHY IT IS NOT A `main.rs` FIX, ruled from the record

C's §4.1 names the mechanism exactly: *"The mute is a property of the lock; the RECORD of it is a property of
traffic."* Both defects are that one sentence:

- **§4.1** — the edge is detected inside `board_push`, so a window that opens and closes while nothing pushes
  leaves no row at all. The record depends on **traffic**.
- **§4.2** — `BLIND_LAST` is a process-global starting at 0 (`main.rs:2018`), so a lock removed while the app is
  down never writes CLOSED and `boundary-check.js` reads UNMEASURED forever. The record depends on **process life**.

**Both dependencies disappear if the record is written by the thing that changes the lock.** `blind.js`'s
`setBlind` and `clearBlind` are the only two places the lock is ever toggled (`:120`, `:127`), and they run exactly
when a window changes — with no traffic required and no process state to lose. **That is strictly better than a
Rust fix, and it is why: a `main.rs` repair would still be recording an edge it observes, and would still need
somewhere that survives process death to remember the previous state. The toggle does not have to remember
anything. It IS the event.**

**It also does not replace the app's rows, and it does not have to.** `boundary-check.js`'s `blindOverlaps` ignores
a second OPEN while one is open, and a CLOSED with nothing open. **Read at source before relying on it** — the two
writers coexist and the guard reads one span either way. If the app later writes its own rows for the same window,
nothing double-counts.

**The producer and the reader already agree on the path**, which C established and I did not re-derive: `blind.js`
writes `DATA/blind.lock` and `blind_lock()` reads the same file. I added `BOARD = path.join(DATA, 'board.jsonl')`
on the same `DATA`, so a `CONSONANCE_DATA` override moves lock and board together.

## 2 · WHAT CHANGED

    blind.js  NEW   markBoard(text, boardPath)  — appends one {pane:'blind', role, text, ts, ts_source}
                    line. Best-effort: on failure it writes to stderr and returns false, and NEVER throws.
              setBlind(...)   writes  "blind window OPEN — by <by>, until <until> — <why>"
              clearBlind(lockPath, boardPath)  writes "blind window CLOSED — muted count unknown to the
                    lock's producer", and ONLY when a lock was actually removed.

**Three decisions worth naming:**

1. **The CLOSED row does not carry a muted count.** Only the muting process counts; this writer cannot know it.
   It says `count unknown to the lock's producer` rather than inventing a `0`. `blindOverlaps` needs the phrase
   and the timestamp, not the count — verified at source. **Mutant M4 turns that into `0 entries muted` and a test
   catches it.**
2. **A close that removed nothing writes nothing.** `clearBlind` returns `false` on a missing lock and records
   no row — a phantom CLOSED would fabricate a window boundary, which is worse than the gap being fixed.
3. **Recording is best-effort; blinding is not.** The lock is the safety mechanism, so a failed board append must
   never stop a window from opening. But a silent swallow is exactly the defect one level up, so it prints to
   stderr. Both halves are pinned (M6, M7).

**One thing I fixed that was not in the packet**, because I was already editing the file and it is tonight's class:
`blind.test.js:74` held **two raw NUL bytes** in a fixture (`fs.writeFileSync(damaged, '\0\0garbage')`) — deliberate
content, written as bytes rather than escapes, which made the whole test file read as **binary to grep**. Rewritten
as `\u0000` escapes; identical runtime value, and the file is text again (`indexOf(0)` now -1). **It is pre-existing
and not caused by this lap** — flagged for A's P-NUL-GUARD lane rather than claimed as mine.

## 3 · THE TESTS, RED FIRST

    before the change: 17 tests · 9 pass · 8 fail   (the 8 new ones)
    after:             17 tests · 17 pass · 0 fail

Two map directly onto C's §2 findings, and are named after them so the next reader finds the origin:

    C's §4.1: a window with NO traffic at all is still visible afterwards
    C's §4.2: a lock removed with no app process writes CLOSED anyway

The other six: the OPEN row exists and matches the phrase the guard greps; the CLOSED row exists; no phantom close;
no invented count; appends never overwrite an existing board; an unwritable board neither throws nor goes quiet.

## 4 · MUTANTS, on fresh copies

    caught  M1 never write OPEN            caught  M5 overwrite instead of append
    caught  M2 never write CLOSED          caught  M6 let a board failure throw
    caught  M3 record a close that closed nothing     caught  M7 swallow the failure silently
    caught  M4 invent a muted count        NOT APPLIED  M8 control, anchor absent
    7 caught · 0 SURVIVED · 1 NOT APPLIED

**M6 is the weak one and I am saying so:** it was caught, but by a parse failure rather than by an assertion, so it
proves the tests run and not that they hold that behaviour. **M7 is the one that actually pins the stderr rule.**

## 5 · WHAT I DID NOT VERIFY

- **Nothing was built and nothing relaunched**, per the constraint. No `main.rs` change exists to build.
- **The installed copy at `~/.claude/shell/blind.js` is UNCHANGED.** It was byte-identical to the repo's before
  this lap and is now one version behind. **The fix does not take effect on this machine until the install step
  runs**, which is the keeper's, and I did not run it. A window toggled before then still records nothing.
- **I did not exercise the real board.** Every test uses a temp dir; `C:\Consonance\data\board.jsonl` was read
  during L062 and not written here.
- **Concurrent append is untested.** The app appends to the same file from another process. Each row is written
  with one `appendFileSync` of a complete line, which is what the app does, but I have not tested interleaving and
  cannot say it is atomic on this filesystem.
- **`blindState` and `declareLine` are untouched**, and the mute path in `board_push` is untouched — this only
  adds rows, it changes nothing about what gets muted.
- **The 8 new tests failed in my scratchpad copy for one unrelated reason**, and I checked rather than assumed: the
  pre-existing test `the gate is actually wired into the pane broadcast` reads `board-digest.js` from `__dirname`,
  which a two-file copy does not have. **Repo baseline re-run in place: 9/9 before my change.** The copy artefact
  was not a regression, and I would have reported it as one if I had trusted the copy.
- **I have not confirmed the app's own rows and these rows interleave correctly in a REAL window**, only that the
  consumer's logic tolerates it by inspection.
