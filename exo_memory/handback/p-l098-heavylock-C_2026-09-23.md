# P-L098-HEAVYLOCK — C (L098, stall fix 3, ON L, 2026-09-23) — ONE HEAVY RUNNER PER TREE · BUILT, WIRED, TESTED BY LIVE USE · UNCOMMITTED

**The first reading taken through the lock, which was also its first real test.** My full js-suite started at 10:34:12Z:
- **It waited, printing three times:** `heavy-run: waiting on 12fb81f6 pid 1240 (js-suite, since 2026-09-23T10:29:04.003Z)`
  (another seat, which picked up the wiring from the shared tree seconds after I wrote it).
- **Then it ran:** **124 green · 0 failed · 0 crashed · 0 silent · 1 canary · of 125** (125 = 124 + the new
  `heavy-run.test.js`; the canary is `targetless-pull`, declared EXPECTED-RED).
- **It released at 10:44:13.** One second later a third seat, `6fe15f0a`, took the lock for its own js-suite.

No live lock was written by a test, and there was no restart, rebuild or settings edit.

## The helper: `consonance/tools/heavy-run.js` (new; sha256 `a1c26b4e7e5b50eb`)

**`<data>/heavy-run.lock` holds `{pid, seat, cmd, started, token}`.** It is resolved through `state-manifest.js`
`dataDir()`, the one state-sync already uses: `CONSONANCE_DATA`, then `~/.consonance.json`. There is no new path logic.
- `seat` = the first 8 characters of `CONSONANCE_PANE` (each pane's session id), or `terminal`.
- `hold({cmd})` takes the lock and installs the releases; `acquire()` is the testable core.

| rule | how |
|---|---|
| one holder | `openSync(lock, 'wx')`: exclusive create, so two runners can never both hold it |
| a second runner WAITS and names the holder | `heavy-run: waiting on <seat> pid <pid> (<cmd>, since <t>)`, printed at once and then every minute, polling every 2 s |
| **max wait: 30 minutes, then FAIL LOUDLY, exit 3** | `heavy-run: gave up after 30m — <holder> still holds <lock>. Not running anyway …`. **It never runs anyway.** |
| a stale lock (dead pid) is taken over and LOGGED | stderr: `heavy-run: took over a stale lock — <seat> pid <pid> (<cmd>, since <t>) is not running; it was <N>m old`, and the new lock records `took_over: {holder, age_ms}` |
| pid liveness | the codebase's own idiom (`ledger-union.js:293`, `head-watch.js`, `close.mutants.js`): `process.kill(pid, 0)`, with EPERM counted as alive |
| released on normal exit, on a thrown error, and on a signal | the `'exit'` handler (which fires on `process.exit` and on an uncaught error). SIGINT/SIGTERM/SIGBREAK/SIGHUP exit 130, which releases through the same handler. |
| a release frees only its OWN lock | the token is checked before `unlink` |
| **a nested run is the same run** | the holder exports `CONSONANCE_HEAVY_RUN_TOKEN` to its children. A runner carrying the token of the *current* lock does not wait and does not release; any other token waits like anyone else. |

**Why 30 minutes.**
- A full js-suite on L takes several minutes (mine ran about 5 once it had the lock), and a single `--only` mutant takes
  a few more. So a waiter behind ordinary work gets through.
- A whole-harness run (state-sync's 54 mutants, each a full suite) takes far longer than 30 minutes. A seat parked
  silently behind it for hours is this lap's stall in another costume.
- At 30 minutes the waiting seat is told who holds the tree, and it decides what to do next.
- `CONSONANCE_HEAVY_WAIT_MS` overrides the wait.

**Why re-entrancy is needed, not optional.** js-suite runs `mutant-harness.test.js`, which spawns
`mutant-harness.js --audit`. Without the token, any nested runner would wait on its own parent for 30 minutes.

**Takeover races.** The stale file is moved aside with an atomic rename. If a race moved a LIVE lock instead, it is put
back with `linkSync`, which fails rather than overwrite, and the waiter keeps waiting.

**A reused pid reads alive.** The waiter then waits and, at 30 minutes, fails loudly naming it. That is the safe
direction.

**The takeover log is stderr plus the lock's `took_over`, not a log file.** Every new data-dir file is UNPLACED at
close until the manifest names it (next section).

## Wiring: 8 runners, every one listed

| runner | where the lock is taken | note |
|---|---|---|
| `js-suite.js` | before the run, after `--list` and the empty-tree refusal | **only when `JS_SUITE_ROOT` is unset.** A fixture run (`js-suite.test.js`) is not a heavy run. |
| `mutant-harness.js` | in `main`, after the usage check | **not under `--audit`**, which runs gates only (no worktree, no build) |
| `close.mutants.js`, `state-sync.mutants.js` | right after `--only` parsing | so a bad argument still refuses without waiting. Their own per-harness locks are kept. |
| `jev-ask.mutants.js`, `jev-shadow.mutants.js`, `trip-check.mutants.js`, `union-at-launch.mutants.js` | first line of `main()` | |

That covers the chair's 6 `*.mutants.js` files plus **`mutant-harness.js`, a seventh heavy runner** (it builds cargo
worktrees) that the glob does not match. It is 15 lines added across the 8 files, and no copies of the logic.

## Tests: `consonance/tools/heavy-run.test.js` (new; sha256 `7c042afd3bb7bc6e`)

**12/0.** Every test uses a temp data dir, and every child environment has the live run's token removed.

**The chair's three:**
- **Two runs started together:** real processes. The second waits, names the first's seat, pid and command, and runs
  after it.
- **A stale lock (dead pid):** taken over, logged with holder and age, and the stale file is not left behind.
- **Release on a thrown error:** a real child throws, and no lock remains.

**Also covered:**
- a live holder is never taken over, and at the max wait the runner fails loudly (holder named, lock untouched);
- release on SIGINT, with the handler run by `process.emit`. Windows does not deliver an outside SIGINT to a child, so
  this tests the handler, not the OS;
- release on normal exit, and release frees only its own lock;
- a nested run is re-entrant, and a non-matching token is not;
- no data dir is a refusal;
- the lock's four fields plus the token;
- `pidAlive`;
- **the WIRING SWEEP:** all 8 runners carry the `hold({ cmd: … })` call, js-suite only without `JS_SUITE_ROOT`, and
  mutant-harness only without `--audit`.

**RED:** the module did not exist, so the file failed to load. **GREEN:** 12/0.

**Mutants** (`node <scratchpad>/l098/hr_mutants.js`, run in temp copies of `tools/`, scored against the unmutated
copy, which failed 0, with a 90 s hang timeout): **13 applied / 13 caught / 0 NOT APPLIED.**
- H1 non-exclusive create; H2 a dead holder is never taken over (caught by hanging); H3 no takeover log; **H4 runs
  anyway at the max wait**; H5 a release frees someone else's lock; H6 no release on exit or error; H7 a signal does
  not exit; H8 the token is not exported; H9 any token passes as the holder; H10 the seat is not named; H11 no data dir
  runs unlocked; H12 the takeover is not recorded; H13 the stale file is left behind.
- **Two survivors on the first run, both fixed before this line:**
  - **H7:** a `release()` inside the signal handler was redundant, because `process.exit` fires `'exit'`, which
    releases. The mutant couldn't be told apart, so I removed the line; the handler now only exits.
  - **H9:** re-entrancy on *any* token was untested. I added the "a token that is not the holder's waits" test.

## OWED, and not mine: the lock needs a manifest row

`<data>/heavy-run.lock` is a new data-dir file. `close.js` refuses UNPLACED files, and the manifest names every lock
explicitly (`head-watch.lock`, `stick-waiter.lock`).
- It exists only while a heavy run is live, so a close taken between runs sees nothing.
- **A close taken DURING a run, or after a killed run, would refuse as UNPLACED.** The next heavy run clears a killed
  run's lock by takeover.
- **The row, for the owner of `consonance/state-manifest.json`** (and `close.js:78`'s list if it mirrors it):
  `{ "glob": "heavy-run.lock", "class": "STAYS", "why": "DECLARED WITH THE CODE THAT WRITES IT (consonance/tools/heavy-run.js, L098). {pid, seat, cmd, started, token} of the ONE heavy run (js-suite, a mutant harness) this machine's tree is running. Per-machine and per-process: a travelled copy would make the other machine wait on a pid that is not its own." }`
- The full js-suite is green with the lock present during the run, so no existing test sweeps placement at run time.

## NOT verified

- **Machine D.**
- **A real OS SIGINT** (Ctrl-C in a terminal); only the handler was exercised.
- **Each harness run end to end through the lock.** The wiring is proven by the source sweep and `node --check` on all 8
  files. I ran none of the harnesses under the lock, to avoid holding the tree for an hour.
- **Contention** is now real: heavy runs across seats queue. That is the intent, but tonight's seats will see
  `waiting on …` where they used to see interleaved, meaningless readings.

NOT COMMITTED.

NEXT: librarian call_librarian with the hand-back pointer when the lock, its wiring and the tests are written — plan default after it: batch 2's usage instrument, unless the output says otherwise. OUTPUT adds: `heavy-run.lock` needs its STAYS row in state-manifest.json (row text above) before a close is taken mid-run.
