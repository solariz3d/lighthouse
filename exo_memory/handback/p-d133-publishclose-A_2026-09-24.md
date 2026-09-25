# D133 A — publish at close (the keeper's ruling, 17:18) + close.js:319-321

Pane A, on D, 2026-09-24. **Nothing committed, nothing pushed, no close run for real, no rebuild.**
**LIVE ONLY AFTER A REBUILD** — the running app is yesterday's build; nothing below runs until the keeper rebuilds.

## 1 · What was built (main.rs, the Leave path only)

- `LeaveBounds` gains `publish: Option<Duration>`. **`None` = NEVER PUBLISH.**
  - `NORMAL` (the keeper's close through the Leave window) = `Some(LEAVE_PUBLISH_TIMEOUT)`, which is 900 s.
  - `SHUTDOWN` (the OS ending the session) = `None`.
- `leave_run` step 7 runs AFTER the stick result is written and BEFORE `LEAVE_SHOWN` / the button:
  - `if let Some(bound) = b.publish` → emit `phase:"publishing"` → `run_publish(bound)` → plog the outcome.
  - The final `result` emit now carries `"publish": <outcome>` (`null` on the unattended path) beside `"result"`, with `can_exit: true` either way.
- `run_publish` spawns `node consonance/tools/close.js` with `CONSONANCE_DATA=data_dir()` and `NO_WINDOW`.
  - Both pipes are read on their own threads.
  - It kills the child at the bound.
- `publish_outcome` (pure) turns close.js's exit and lines into one of six outcomes:
  - **PUBLISHED** `{branch, from, to}`, parsed from `published: <branch> <to> -> origin (was <from>)`;
  - **UNCHANGED** `{at}`;
  - **CLOSED**, a clean exit with neither line;
  - **REFUSED** `{code}` with stdout+stderr **verbatim**;
  - **TIMED_OUT**;
  - **FAILED**, meaning node or close.js could not start or be waited on.
- Every outcome is shown. Nothing between `run_publish` and the button returns or exits, so **a refusal or timeout never stops the close.**
- **B's divergence gate:** I call close.js, which calls `state-sync --push` (close.js:186), not cmdPush directly. So the gate B adds inside cmdPush is on my path with no signature coupling on my side.
  - A gate refusal makes cmdPush exit non-zero. close.js then exits non-zero and prints the reason, and that surfaces as **REFUSED with the text verbatim**.
  - NOT verified against B's actual gate: I coded to close.js's current exit contract (0 = published/unchanged; non-zero = refused, reason printed), not to B's diff.
- `worst_case()` adds `publish.unwrap_or(0)`. A shutdown that JOINS the keeper's close therefore waits for the publish too, instead of releasing mid-push.
  - A push killed by the OS is safe: git updates the remote ref last, so the remote stays at the old sha and the next close publishes again.
- **The unattended waiter** (`dev/stick-waiter.js`) is untouched. A test pins its code lines free of `close.js`, `--push`, `git push` and `state-sync`.

**Scope, from evidence.** `C:\Consonance\data\persist.log` has 13 `LEAVE SEATS` and 13 `LEAVE SAVING`, so every recorded D close had a stick and reached the Leave window.
**Limit:** a close with NO stick still exits instantly (`LeaveRun::Exit`, no window), so it does not publish. There is no window to show an outcome in, and adding one is a UI change beyond this packet.

**Owed by E (`consonance/ui/leave.js`, not mine):**
- Render `p.publish` beside the stick result.
- Handle `phase:"publishing"`, which fires while close.js runs for up to 900 s.
- Today leave.js ignores both. The keeper would see the stick result, then a pause, with no line for the publish.

## 2 · close.js:319-321 — what was wrong, and the fix

`finish()` printed `in sync: <each machine's last push>` over ANY heads. That is the same false green D132 fixed in chain-status: after D's close D is at the head and L need not be, but the line still said "in sync".

- The new `syncLine(heads, head)` compares each machine's last push to the state repo's HEAD. For example: `NOT in sync: OTHER behind — last pushed 59a8923 · TESTL d67b5e6 (head)`.
- It returns the old words when all machines are at the head, when no machine has pushed, and when the head is unknown.
- Exported for tests.

## 3 · Tests and counts (commands beside each)

- `node consonance/tools/close.test.js` → **36 passed, 0 failed** (30 existing, unmodified, plus 6 new: 5 syncLine unit tests and 1 real-close e2e test).
  - **Red:** the same test file against the pre-D133 close.js, in a copy → **30 passed, 6 failed**. The e2e test is the true behavioural red; the 5 unit tests fail because `syncLine` did not exist.
  - Own correction: my first e2e assertions were wrong. An unescaped `(head)` made it a regex group, and a stray backspace byte had replaced `\b`. `!/in sync: OTHER/` would also have matched inside `NOT in sync: OTHER`. It is now `!/^\s*in sync:/m`. A control-byte scan of all three files → 0.
- close mutants, `node scratchpad/d133-close-mutants.js` (on copies) → **6 listed · 6 applied · 6 caught · 0 survived · 0 NOT APPLIED · 0 NO RESULT**; the live file is unchanged.
  - C5 (finish() prints the old line) SURVIVED on the first run with the unit tests alone, which is why the e2e test exists.
- Rust: `node scratchpad/heavy-cargo.js test --bin consonance` (through the heavy-run lock) → **NOT RUN. The Rust suite has not compiled or run once with this change.** Twice (bnugs03u4, then bxgk0h9hl, EXIT 3) the lock gave up after 30 min. Both times it was held by B's `D133-B state-sync mutants + js-suite` (seat 12fb81f6, pid 38040, since 23:54:26Z; still alive at 01:03Z). I did not break another seat's lock. **Until cargo runs, main.rs may not even compile**, so treat everything in it as unverified. The baseline to compare against is 944/0/4 (D130), and a pass means +11 tests. The next seat to hold a free lock should run `node scratchpad/heavy-cargo.js test --bin consonance` from pane A's scratchpad, or `cargo test --bin consonance` under `heavy-run.hold()`.
  - New module `publish_at_close_tests`, 11 tests: the outcome parses (published from/to, unchanged, refusal verbatim + code, timeout, failed, closed); `SHUTDOWN.publish == None` and `NORMAL.publish.is_some()`; `worst_case ≥ publish + export`; in leave_run's source, the publish sits under `if let Some(bound) = b.publish`, after the result write and before `LEAVE_SHOWN`; no return/exit between run_publish and the final emit, which carries `"publish": publish` and `"can_exit": true`; and the waiter is free of any publish.
  - **Red-first caveat:** the test module went in before the implementation, but the red cargo build could not run first because the heavy-run lock was held (E's js-suite, then B's mutants). So there is no recorded Rust red. The Rust tests are source-shape and pure-function tests; `run_publish` itself (spawn/kill) is **not exercised by any test**.

## 4 · Not verified

- No real publish or close was run (forbidden), so the PUBLISHED path is proven only on close.js's printed line format, not on a live push.
- B's gate refusal text is not seen; the verbatim pass-through is proven only on synthetic stderr.
- The 900 s bound is a guess sized from D132's 102 MB of changed files; it has not been measured on the keeper's uplink.
- The keeper's real `~/.claude/settings.json` was NOT touched by this lap.
  - Its sha256 is now `2d18e1e1fd996a3c08c2db288cdfa21a12ba79a514476eaad6bb5b46feb671d1`, not the `8e2cf20a…` pinned through D128.
  - It changed at 2026-09-24 23:07:51Z and now carries `DISABLE_AUTOUPDATER: "1"`, which matches D132's "DISABLE_AUTOUPDATER set". The new sha is the pin from here.

Backups: `scratchpad/main.pre-d133.rs`, `scratchpad/close.pre-d133.js`.
