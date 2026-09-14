# P-LEAVE · §2 read FIRST — B, before A and E build

**B (pane `12fb81f6`), lap D063, machine D, 2026-09-14. Packet `loop/packet_leave_window_2026-09-14.md` (`ed73e76`), read line by line
against source at HEAD `ed73e76` on D: `consonance/src-tauri/src/main.rs` (15,660 lines), `sync_launch.rs` (2,534), `dev/stick-waiter.js`
(411), `dev/tail-carry.js` (1,427), plus the pinned crates `tao-0.35.3` and `portable-pty-0.8.1` from the cargo registry. No edits, no
builds, no process started against the app or the stick.**

## 0 · VERDICT

**§2 cannot be built exactly as written.** Three lines need a ruling before anyone builds on them (§5 of the packet applies):

| # | where | why it cannot be built as written |
|---|---|---|
| **D-1** | 2.2 step 1 "WAIT until every seat's process has exited" | There is nothing to wait on. `PtySession` keeps a killer, not a child or a pid, and the source records that the only other liveness signal does not fire on exit. |
| **D-2** | 2.2 step 1 vs step 4 | Step 1 says a seat alive at the bound is "NOT DONE, never DONE". Step 4 defines DONE so that such a seat can read DONE. |
| **D-3** | 2.3 c + 2.4 vs F2 and §3 | Case c's "today's export path" retries the ledger lock and then writes the ledger after the dead app's tail-carry, so F2 fires by construction. A is not allowed to change that path. |

One more wants a ruling before E builds the launch-time cleanup:

| **D-4** | 2.3 last line (stale cleanup at launch) | Nothing orders it against the OLD waiter reading the files. A relaunch inside the waiter's poll turns a finished Leave into case d and reopens B's §8 race through the fallback. |

The rest (D-5 to D-11) are wording or edge cases that do not stop the build. §3 lists every cited line: 14 are right, 4 have drifted or carry a
wrong number, and none point at the wrong function.

---

## 1 · THE THREE THAT BLOCK

### D-1 · 2.2 step 1: the wait has nothing to wait on

- `PtySession` is `{ writer, master, killer }` (`main.rs:922-926`). No `Child`, no pid.
- The source says so itself, with a measurement (`main.rs:1077-1083`): *"`alive` stayed TRUE and the reader saw no EOF three seconds after
  that exit, 3/3, because this process still holds `pair.master` … `alive` is the ONLY liveness this function keeps — the `Child` is
  dropped at the end of this body and `PtySession` stores a killer, not a child."* So reader EOF cannot stand in for "the process exited"
  either.
- **The killer's return value on Windows is inverted.** `portable-pty-0.8.1/src/win/mod.rs:71-78`: `TerminateProcess` returning non-zero
  (success) yields `Err(last_os_error)`; zero (failure) yields `Ok(())`. `pty_kill` ignores it (`main.rs:7971`, `let _ =`). A step 1 that reads
  `killer.kill()`'s result as "ended" would call every successful kill a failure and every failed kill a success.

**What building it takes, which §2 should say:** keep the child's pid (or the `Child`) in `PtySession` at spawn. `child.process_id()` is
available before the drop at `main.rs:1067-1126`. Then wait on that pid, not on the killer and not on the reader. Every seat goes through
`spawn_claude_pane`, which has 11 call sites that construct or insert sessions: `main.rs:2588, 3212, 3251, 3368, 6248, 6268, 6371, 7426, 7465,
7522, 7984`. All are in E's lane. Without this sentence a builder can satisfy "wait" with nothing and read every seat as ended.

*Checked, and not a hole:* the one `claude` the app starts outside `spawn_claude_pane` is `claude_oneshot` (`main.rs:7857-7872`). It is a
`-p` run with no `--resume`, so it creates its own session and never appends to a seat's transcript. `claude_bin()` resolves to
`~\.local\bin\claude.exe` on D, a 227 MB native exe (`main.rs:916-919`; `ls`), not a `.cmd` shim, so killing the PTY child is killing the
writer.

### D-2 · 2.2 step 1 and step 4 contradict

- Step 1: *"A seat still alive at the bound is named in the Leave screen, and the export still runs; the grow guard (tail-carry.js:746)
  refuses that seat by name. That is NOT DONE, never DONE."*
- Step 4: *"outcome DONE only when tail-carry exits 0 AND no row stops."*

**The grow guard does not refuse a live seat. It refuses a seat whose file grew inside one window**: from the plan-time stat to the stat
right after the tail is read (`tail-carry.js:739-748`). The plan-time settle gate waits at most 8 × 150 ms for quiet (`state-sync.js:95`,
`:106`). A seat that is alive but writes nothing during that window passes, tail-carry exits 0 with no stop, step 4 says DONE, and the seat
then writes. **That is F1's exact failure, produced by following the section as written.**

**The fix is one clause, and it is a ruling:** step 4's DONE also requires that step 1 ended every seat within the bound. The app already
knows that; it does not need tail-carry to find out.

### D-3 · 2.3 c and 2.4 cannot both hold alongside F2 and §3

1. **A tail-carry outlives a killed app.** `run_carry_json` spawns node with `NO_WINDOW` only (`main.rs:10516-10527`). The survival
   measurement in the source covers both flag sets: *"a clean exit and `taskkill /F` of the parent both left the child running … a TREE kill
   … takes the child down under either flag set"* (`main.rs:10400-10403`). So an app killed after `LEAVE_STARTED` leaves a live tail-carry
   holding `consonance-tails/ledger.lock`. That is the ordinary result of the kill, not a corner case.
2. **Case c runs "today's export path" and it retries the lock.** `stick-waiter.js:346-357`: on `LEDGER_LOCKED` it waits 5 s and tries
   again for up to 60 s (`LOCKED_RETRY_MS = 5000`, `LOCKED_RETRY_FOR_MS = 60 * 1000`, `:78-79`). When the orphan finishes inside the minute,
   the waiter's export takes the lock and writes the ledger a second time.
3. **So** the orphan and the waiter both write the ledger. **F2 ("both the Leave and the waiter write the ledger") fires by construction.**
   2.4's *"a collision is LEDGER_LOCKED … it must read NOT DONE with the holder named"* is not what today's path does: it retries silently for
   up to a minute. §3 tells A that *"nothing else about the export changes,"* so A cannot remove the retry.

It is serialised by the lock, so this is not corruption: the second write re-exports the same spans. But the section asks for three things
that cannot all be true. **One ruling is needed. The options, none chosen here:** (i) in case c, no retry: NOT DONE naming the holder, and
the orphan is left to finish. (ii) In case c, wait for the named holder pid to exit, then export, and reword F2 to "concurrently". (iii) Keep
the retry and strike the NOT DONE sentence from 2.4.

---

## 2 · THE ONE THAT WANTS A RULING BEFORE THE CLEANUP IS BUILT

### D-4 · the launch-time cleanup can delete a file the old waiter has not read yet

2.3's last line: *"The app removes stale LEAVE_* files at launch, when the named pid is not live under "consonance"."* No order is given
against the waiter that watched the previous session.

The sequence: the Leave says DONE, the keeper clicks, the app exits. The old waiter only notices at its next poll, 2,000 ms
(`stick-waiter.js:64`), then reads the files. **If the keeper relaunches inside that gap,** the new app's cleanup sees `LEAVE_RESULT`
naming a dead pid and removes it. The old waiter then finds neither file, which is **case d**, and exports while the relaunched app's seats
wake. That is B's §8 race again, now through the fallback, and F2 as well (the Leave wrote the ledger, and so does the waiter).

- `main()`'s order on D: `claim_single_instance` `:10885` → `set_dirs` `:10943` → `sync_at_launch` `:10951` → `start_exit_waiter`
  `:10953`. The cleanup has no stated place. It must come after `set_dirs`, or `data_dir()` resolves to the default dir: the L051 class,
  documented at `main.rs:10908-10917`.
- **I did not measure** how soon a launch can reach the cleanup (`sync_at_launch` may be fast with no network) or how soon a seat can
  wake. The race is real on the ordering. Its likelihood is unmeasured.

**The shape of a fix, for the ruling:** skip the cleanup while `<data_dir>/stick-waiter.lock` names a live node holder, or let the waiter
own removal of the `LEAVE_*` files it has read.

---

## 3 · DOES NOT BLOCK

**D-5 · 2.5 says more than it closes.** The mechanism is right: the mutex is held for the process's life (`main.rs:6400-6403`), checked
before anything else (`:10885`), and a second copy returns after a dialog (`:10886-10887`). But *"So no seat writes during the export"*
does not follow, for three reasons:
(a) the section itself allows a seat alive past step 1's bound (D-2);
(b) the mutex **fails open**: `CreateMutexW` erroring returns `true` and a second instance starts (`main.rs:6404-6407`);
(c) it covers the Leave only. The §8 race is still open in cases c and d, where the waiter exports after a hard kill while a relaunch wakes
seats (D-4 is one route in). The title *"closed by construction"* should be scoped to the Leave.

**D-6 · the close request does not fire on logoff, shutdown or restart.** In `tao-0.35.3/src/platform_impl/windows/event_loop.rs`, only
`WM_CLOSE` produces `CloseRequested` (`:1061-1065`). `WM_QUERYENDSESSION` is unhandled (`:2382-2383`), and `WM_ENDSESSION` destroys the
loop with no event (`:2384-2391`). Windows going down with Consonance open runs no Leave and writes no `LEAVE_*`. That is today's behaviour,
so not a regression, but no falsifier should be scored by shutting the machine down. `app.exit(0)` (`main.rs:10740`, `:10804`) goes
`request_exit` → `ExitRequested` (`tauri-2.11.3/src/app.rs:574-580`), not `CloseRequested`, so the applier's exit correctly skips the
Leave (2.4's first guard). I did not trace `request_exit` into `tauri-runtime-wry`.

**D-7 · 2.1's `"image": "consonance"` is checked by no JS reader, and the Rust reader uses a different spelling.** 2.3 b/c compare pid
only. The one image check on `LEAVE_*` is the app's launch cleanup, and the Rust vocabulary includes `.exe`: `ProcInfo.name` is sysinfo's
`p.name()` (`main.rs:10425`), and the app's own constant is `APP_IMAGE = "consonance.exe"` (`sync_launch.rs:1219`). A literal
`name == "consonance"` never matches, so every `LEAVE_*` reads stale. 2.1 should say how the Rust side compares.

**D-8 · pid reuse by the relaunched app itself.** "Not live under consonance" is false when the relaunched app has been given the old pid,
because it is live under consonance. Pid reuse is recorded as real (E-1). The stale `LEAVE_RESULT` stays; on this session's next hard kill
the waiter reads case b and stands down, exporting nothing. A `LEAVE_*` naming this process's own pid was written before this process
existed, and is stale by definition.

**D-9 · case b returns before step 4's adoption.** The waiter adopts a relaunched app only after the stick branch (`stick-waiter.js:286-289`).
A stand-down return, like case a's (`:275-277`), skips it. Relaunch inside the poll: the new app's waiter finds the old lock live and exits
`ALREADY_WAITING` (`:253-255`); the old waiter stands down on b and exits without adopting. **The new session has no waiter.** Case b should
still run step 4 before returning.

**D-10 · 2.1's `"stick": "<folder>"` is undefined for 2.2 step 2 "many".** That branch writes `LEAVE_RESULT` with several folders.

**D-11 · 2.2 step 4's named endings leave out two.** tail-carry exit 3 (`CRASHED`), and `run_carry_json`'s own `Err` when stdout is not one
JSON object (`main.rs:10550-10556`). "Every other ending is NOT_DONE" covers both, but no `why` is specified for them.

---

## 4 · THE CITED LINES, CHECKED

| packet line | claim | on D |
|---|---|---|
| §1 | no `CloseRequested` / `on_window_event` / `RunEvent` | **right**: 0 hits; `.run(tauri::generate_context!())` at `main.rs:11326` |
| §1 | `app.exit(0)` only at `:10740`, `:10804` | **right**: the only two `.exit(` in `src/` |
| §1 | `pty_kill` `:7969` kills one pane through its killer | **right** (`:7969-7977`) |
| §1 | `dev/stick-waiter.js:14-40` is the exit export | **right** |
| §1, 2.2 | `tail-carry.js:746` "the source grew while it was being read" | **right**; see D-2 for what it does NOT cover |
| §1, 2.5 | `claim_single_instance` `main.rs:6424` | **right** |
| §1 | checked first in `main()` `:10885` | **right** |
| §1 | "already running" `:6464` | **right**: `fn warn_second_instance` starts there; the text is at `:6467` and `:6477` |
| §1 | `run_carry_json` `:10511`, no window | **right**: `NO_WINDOW` at `:10522` |
| §1, 2.2 | `STICK_REHEARSAL_TIMEOUT` = 300 s `:10392` | **right** |
| §1, 2.2 step 3 | *"The first full carry (348,007,682 B) took 55 s (2f7233c)"* | **wrong number for the cite**: `2f7233c` says **348,026,190 B**, 55 s, 12:46:55→12:47:50. 348,007,682 is the rehearsal total, copied from `librarian/2026-09-14.md:208`; the 18,508 B difference is exactly the librarian's own file growing between rehearsal and write (43,169,402 → 43,187,910, same commit). The `LEAVE_EXPORT_TIMEOUT` comment should carry 348,026,190. |
| §1, 2.1 | `sync_launch.rs:774-781` `APPLY_STARTED`, `APPLY_RESULT`, `STICK_KEEP` | **right** |
| §1 | `holderLive` `tail-carry.js:226` | **drifted**: the function is at `:221`; `:226` is its "cannot tell" line |
| §1, 2.1 | `pidImage` returns lower-case without `.exe` `:219` | **drifted**: the return is at `:214` (function `:204`) |
| 2.2 step 2 | `find_stick` | **right**: `sync_launch.rs:839`; the app's roots come from `volume_roots()` `main.rs:10409` |
| 2.3 a | stand down, `stick-waiter.js:22` | **right as the header comment** (`:22-23`); the code is `:275-277` |
| 2.6 | `index.html:22` | **right**: `<div id="stick-setup" hidden>` |
| 2.6 | `app.css:607` | **right**: `#stick-setup { position: fixed; … }` |

**Checked and clean:** 2.2 step 2 is buildable as written (`find_stick` and `volume_roots` exist). Step 3's `run_carry_json(…, timeout)`
kills node and waits on timeout (`main.rs:10540-10543`), and returns `Ok(Value)` for exit 1, 2 or 3 whenever the JSON arrives, so step 4 can
read `code` and `rows` from the object. Step 6 is buildable: one window, `label: "main"` (`tauri.conf.json:11-22`), so preventing its close
request is the whole of it. 2.3 a's stand-down exists as described. 2.4's first guard holds (D-6).

---

## 5 · WHAT I DID NOT VERIFY

1. **Any timing.** How soon a relaunch reaches `sync_at_launch`, the cleanup or the first seat wake (D-4, D-9). How long a real seat takes to
   exit after `TerminateProcess`, the bound E is to measure.
2. **Whether a seat's `claude.exe` dies when the app is hard-killed** (ConPTY teardown). Cases c and d assume seats are gone or the grow guard
   catches them; neither was run.
3. **That an orphan tail-carry survives a hard kill *mid-export*.** The survival measurement at `main.rs:10400-10403` is for a
   waiter/applier child, not a running carry. D-3 rests on the comment's "under either flag set".
4. **`request_exit` inside `tauri-runtime-wry`.** Read to `app.rs:574-580` only.
5. **The mutex's fail-open path ever firing.** Read, not provoked.
6. **Whether the sysinfo roots and the waiter's WMI roots can disagree** (a folder-mounted volume would appear in one, not the other). D's
   four letters agree on inspection (`Get-CimInstance Win32_LogicalDisk`: C: 3, D: 2, G: 3, Z: 3). Nothing tested.
7. **§4's falsifiers, §3's test lists and the mutants.** Not the read's job. Nothing was built, run against the app, or run against the stick.

## 6 · WRONG — mine

**I nearly passed D-2.** My own §8 on L named the grow guard as what makes a reopened seat NOT DONE, and step 1 cites exactly that. I read
the sentence as confirmed by my earlier finding. It was only when I opened `:739-748` again that the window showed up: the guard catches a
write inside the read, not a live seat. **Class: a finding of mine, cited back to me, accepted on its citation instead of re-read.** The
earlier finding was right about a relaunch that writes; step 1 extended it to a seat that may not write, and I nearly carried the extension
through.
