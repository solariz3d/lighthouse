# P-LEAVE-2 §1 · B's read before landing — appStartedAt, the two kill-on-failure hardenings, and the NOT CONFIRMED wording

**B (pane `12fb81f6`), machine D, 2026-09-15. HEAD `e945bd3`, working tree.** Packet
`loop/packet_diversity_c1_and_leave2_2026-09-15.md` PACKET 2 and its RULINGS (`ed0d60a`). A's hand-back
`handback/p-leave2-A_2026-09-15.md` §1–§6. I raised D-8 and both hardenings, and wrote none of this code. The uncommitted
`main.rs`, `sync_launch.rs`, `dev/stick-waiter.js` and `dev/stick-waiter.test.js` were read at source.

**Run, no rebuild, no relaunch:**

    cargo test --bin consonance -- --test-threads=1     664 passed · 1 failed · 4 ignored
                                                         the 1: ready_signal_tests::a_slash_command_in_the_composer_reads_empty…
                                                         (panics at src\main.rs:15366, D's standing red, as the rulings say)
    node dev/stick-waiter.test.js                        74 passed · 0 failed
    node dev/stick-apply.test.js                         27 passed · 0 failed

*(My first cargo run printed nothing: `cargo` is not on this bash PATH, so `timeout` exited 127 and the grep had nothing to match.
Re-run by the full path `~/.cargo/bin/cargo.exe`; the counts above are that run.)*

## 0 · THE ANSWERS

| asked | answer |
|---|---|
| **Does `appStartedAt` close pid reuse in every case the waiter reads?** | **Yes for b, c and d, and for a legacy file.** Adoption is closed in the safe direction, at the cost R-1 accepted. Case a is not keyed on the app session at all, before or after this lap. §1. |
| **Do the two hardenings do what I asked, and break anything?** | **Yes, and nothing found.** Both kill through the process handle, so a reused pid cannot be hit. Neither kill is awaited, which A names. §2. |
| **Is NOT CONFIRMED true in every branch that reaches it?** | **Yes, in all five branches I traced.** **But the wording A kept, "stopped before its close window could run", is false in two reachable branches** that A's §6 counts as true. §3. |
| **Anything that makes a close say DONE while a seat writes?** | **Nothing this lap adds.** `leave_ending` is unchanged. The hardenings remove writers that used to sit outside `Panes` unkilled. §4. |
| **Anything that takes the fallback when it should not?** | **R-1 and R-2, as ruled. Plus one path this lap did not create:** if the applier finishes its import and relaunches inside the waiter's 2 s poll, the waiter misses case a. It then runs the fallback against the relaunched app with the false "stopped" notice, and adopts that session with an unknown start time. §5. |

**Nothing here blocks landing.** §3 and §5 are pre-existing wrong wording plus a pre-existing race, and this lap's new field makes both fixable. I'd file
them with P-LEAVE-3.

---

## 1 · DOES `appStartedAt` CLOSE PID REUSE?

**The source is one string everywhere.** `APP_STARTED_AT: OnceLock<String>`, recorded at the top of `main` right after the single-instance
claim (`main.rs`, `let _ = app_started_at();`), reaches three places:
- the waiter's argv, through `waiter_args(&data, std::process::id(), app_started_at())`;
- `LEAVE_STARTED`;
- `LEAVE_RESULT`, through `run_leave(…, find, app_started_at(), …)`, with `"appStartedAt": app_started_at` in both JSON bodies.

It is written as a JSON string, and it is ISO UTC to the millisecond, so it has no spaces and is safe on a Windows command line. A pid cannot be
reused by a process that started in the same millisecond as the one that held it. A refused second instance returns before recording.

**`leaveFor`** (`stick-waiter.js`) matches on pid, then image, then requires `typeof app.startedAt === 'string'`,
`typeof rec.appStartedAt === 'string'` and equality. **`removeLeave`** requires the pid AND the start time to be equal.

| case | the D-8 scenario (session 1's file survives into session 2, same pid) | result |
|---|---|---|
| **b** | session-1 `LEAVE_RESULT(P, t1)`; session 2 (P, t2) hard-killed | `t1 ≠ t2` → no match → case d, with the "stopped" wording, which is **true** here: session 2 wrote no record. **Closed.** |
| **c** | session-1 `LEAVE_STARTED(P, t1)` | no match → case c is not taken, so **no wait on a lock that belongs to nobody live**. **Closed.** |
| **d** | reached exactly when b and c do not match | unchanged except the wording (§3). |
| **legacy** | a file with no `appStartedAt` | `typeof rec.appStartedAt !== 'string'` → never a match, and "record carries no start time" → NOT CONFIRMED. **Stale, as ruled.** |
| **adoption** | a close and reopen inside one poll | `app.startedAt = null` after `app.pid = Math.max(...again)`. Every file for the adopted pid is stale, so **a reused pid can never stand this waiter down.** The cost is R-1's: a DONE Leave is followed by a fallback export and a NOT CONFIRMED notice. **Closed, in the safe direction.** |
| **a** | `stick-apply.started.json` names a live applier | unchanged: keyed on the **applier's** liveness, not the app session. D-8 does not reach it. **But a is where §5's race lives.** |

**`leave_cleanup` still ignores the field** (kept by the rulings). A session-1 file naming a pid that session 2 reused is kept at session 2's
launch as a "live Consonance". Session 2's waiter reads it as stale and never removes it, so it sits until a launch under a different pid
removes it. **Harmless under the new matching:** a mismatched start time is always stale.

## 2 · THE TWO HARDENINGS

**(b) 1 — `or_kill` in `spawn_claude_pane`.** `try_clone_reader()` and `take_writer()` now go through
`sync_launch::or_kill(r, &mut || { let _ = child.kill(); })`.
- **What I asked for, done:** on `Err` the child is killed and the error returned; on `Ok` nothing happens (pure test, both arms).
- **Nothing else can still leave a live child:** these are still the only two `?` between `spawn_command` and `Ok(PtySession …)`. The P1b
  `return Err(row)` runs only after the child has exited.
- **The kill is safe:** portable-pty's `Child::kill` is `TerminateProcess` on the child's handle, so there is no pid-reuse risk. Its
  inverted result is not read.
- **Named residual:** the killed child is not awaited, and its `flight` drops on return, so the B2-1 count no longer holds for it. It is a
  process a few milliseconds old, being terminated.

**(b) 2 — `kill_replaced` in `insert_pane`.** `kill_replaced(map.insert(id, session), &mut |old| { let _ = old.killer.kill(); })`.
- **What I asked for, done:** only the **replaced** value is killed, never the new one (pure test).
- **E's B2-1 order holds:** take the flight, insert, release the lock, then drop the flight (pin still passes).
- **Which sites can replace:** the ten `insert_pane` sites break down as
  - new UUIDs: `pty_spawn`, `spawn_sibling`, `spawn_fresh`, `new_room`, the body spawn;
  - guarded: `resume_pane` (`contains_key` first);
  - can replace: the three fixed seats and `pty_reopen`.
- **The normal `pty_reopen` is a dead pane:** `TerminateProcess` on an exited process's handle fails and is ignored. Nothing breaks.
- **A double wake of a fixed seat** used to leave the first `claude.exe` running unkilled beside the second. It is now killed. That is
  better, not a regression.
- **Named residuals, as A and the rulings keep them:**
  - the kill runs after the new spawn, so `pty_reopen` briefly has two resumes of one conversation;
  - the kill runs under the `Panes` lock;
  - it is not awaited.

**Both wiring pins are text pins** (A says so). The behaviour is proven on the pure helpers. A real failed `take_writer` or a real replaced
live session has not been seen.

## 3 · THE WORDING

**NOT CONFIRMED is true in every branch that reaches it.** `startTimeUnknown(p, app)` returns a reason only for a record with this pid and
this image when either side's start time is not a string. Case d asks it of `LEAVE_RESULT`, then `LEAVE_STARTED`.

| branch into NOT CONFIRMED | reason printed | true? |
|---|---|---|
| an adopted session, its own finished Leave | "this waiter does not know the session's start time (an adopted session, or an app that did not pass it)" | yes |
| an adopted session killed mid-Leave | same | yes: nothing mid-save is claimed |
| a legacy file under this pid | "the record carries no start time (written by an older build)" | yes |
| an app that passed no `--app-started-at` (R-2's window) | "this waiter does not know …" | yes |
| an adopted pid carrying an older session's file with a known start time | "this waiter does not know …" | yes: it cannot tell |

**The wording A kept is false in two reachable branches.** A's §6 says two cases keep *"it was stopped before its close window could
run"*, and that *"in both … the old wording is true"*. The first of those, **"No LEAVE file for this pid"**, is not always a stop:

1. **The close window ran and found no stick.** The Leave finds the stick after the seats end. With no stick it takes `StickFind::None =>
   LeaveRun::Exit` (`sync_launch.rs:1595`) and exits with no files, by design (`main.rs:10968-10971`). If the keeper plugs the stick in
   during the close, the waiter's own find, seconds later, sees it. That is case d with no file: the fallback export, notice *"stopped before
   its close window could run"*. **False: the close window ran.** The export itself is fine here, because the seats had ended. Only the
   sentence is wrong.
2. **The applier hand-off, when the waiter misses case a** (§5). The app exited through `app.exit(0)` for the applier. No Leave ran and
   nothing stopped it. Same false sentence.

Both predate this lap: the old text covered every case d. But §6 pins that sentence as true for the no-file case, so the pin makes a claim
the code does not support. **Suggested wording for the no-file case:** *"Consonance closed without a close record for this session, so this
is the fallback save"*. It is true in all of them. A crash or a kill can still say "stopped" when the waiter has evidence of one, and today
it has none.

## 4 · DONE WHILE A SEAT WRITES

**Nothing in this lap reaches `leave_ending`, `await_seats` or the in-flight count.** The two hardenings only remove `claude.exe` processes
that would otherwise have lived outside `Panes` (a failed spawn step, a replaced session). Before this lap both were live and unkilled;
after it both are killed.

**What is left:** neither kill is awaited, so a process in its last milliseconds after `TerminateProcess` is outside every wait. That is a
narrower gap than the one it replaces, and it is named in both A's §2.3 and the rulings' KEPT.

## 5 · THE FALLBACK WHEN IT SHOULD NOT RUN

**Ruled and correct as written:**
- **R-1, adoption:** a redundant export plus NOT CONFIRMED, which is true (§3).
- **R-2, L's mixed build:** pull, then rebuild.

**One path this lap did not create, but touches: the applier's relaunch can beat the waiter's poll.**
- **The waiter polls the app every 2,000 ms** (`stick-waiter.js:81`). It reads `stick-apply.started.json` only after it sees the app gone,
  and takes case a only while that file exists and names a live applier (`:304`, `:309`).
- **The applier polls the app every 1,000 ms** (`stick-apply.js:51`, `:161`). It runs the import, writes its result, **removes
  `stick-apply.started.json`** (`:188`) and relaunches the app **at once** (`:189`).
- **If that import finishes inside the waiter's detection gap** (up to 2 s after the app exits, against the applier's up to 1 s plus the
  import):
  - the waiter finds no handshake;
  - it finds no LEAVE file, because the app exited through `app.exit`, not a close;
  - so it takes **case d**: a fallback export aimed at a stick the relaunched app has just imported from, with *"stopped before its close
    window could run"* in the notice;
  - its adoption check then finds the relaunched pid and adopts it with `startedAt = null`, so **that whole session's own DONE close is
    also followed by a NOT CONFIRMED fallback.**
- **The race predates this lap** (D-9 made case a adopt). The part this lap adds is the unknown start time on the adopted session.
- **Likelihood is unmeasured.** It depends on the import's duration. A seven-seat export rehearsal on L finished within one second on
  2026-09-14, so a short import is not far-fetched.

**Why this does not block, and what fixes it.**
- **Data:** after an import, the arrival machine's files equal the ledger's agreed state, so the fallback export should read UP_TO_DATE and
  write nothing. I did not verify that, nor whether any seat wakes before the setup window is dismissed.
- **Cost:** a false notice, a redundant export, and a session whose closes all read NOT CONFIRMED.
- **The fix is newly possible because of this lap:** the waiter could also stand down in case a when `stick-apply.result.json` exists with
  an `at` later than the watched session's `appStartedAt`. That is a hand-off the file proves even after the handshake is gone. It belongs
  with P-LEAVE-3's start-time file, which also cures the adoption.

## 6 · WHAT I DID NOT VERIFY

- **No app ran any of this.** No rebuild and no relaunch, as ruled.
- **§5's race was not provoked.** Its timing and whether the relaunched app's seats write before the fallback export ends are both
  unmeasured.
- **§3 branch 1 was not run** (a stick plugged in between the Leave's find and the waiter's). It is read at source.
- **A killed child or replaced session actually ending** is not seen, on either hardening.
- **No mutants re-run.** A's J1–J13 and R1–R11 are A's.
- **Nothing on L.** R-2 is from the record.

## 7 · WRONG — mine

**My first cargo run reported nothing, and I nearly read the quiet as a pass.** The background command exited 0 with an empty output. That
0 was `tail`'s, not cargo's: `cargo` was not on that shell's PATH, `timeout` returned 127, and my grep for results matched nothing. I
re-ran by full path and got 664/1/4. **Class: a filter over an empty stream, read as a clean result.** It is the third time this week a
check reported clean because it never looked.
