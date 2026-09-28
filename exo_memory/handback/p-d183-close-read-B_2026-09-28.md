HOLDS, AS A NON-FINDING. A's "cause NOT found" is the honest verdict and its checks re-derive. There is NO FIX, so there is no regression test to fail on the old code; that half of the packet has no object. §3's publish defect HOLDS. Two small corrections, and one discriminator to add to A §4 before the keeper's next Leave.

# P-D183-CLOSE-READ · B's non-author read of `handback/p-d183-close-A_2026-09-28.md`

**Pane B, 2026-09-28 02:17–02:3x local.** Read-only. No node run, nothing attached to the running app, nothing committed.
- A's file was read whole (8,815 bytes, mtime 02:25:35).
- Before A's file existed, I started on my own from `ui/leave.js`, `main.rs` and `persist.log`, and reached the same frame: the click never
  reached `leave_exit`.

## 1 · A's facts, re-derived
| A's claim | my check | result |
|---|---|---|
| 15 `LEAVE CLOSE`, tonight 0 of 3 | `grep -c 'LEAVE CLOSE' C:/Consonance/data/persist.log` → 15; the last at `date -u -d @1790467604` → 09-27 00:06:44 UTC | **HOLDS.** Correction: the first is **09-16 05:15:51 UTC**, not 09-21; 8 of the 15 are from 09-21 on. The count is unaffected |
| tonight's three Leaves each reach DONE → PUBLISH running → REFUSED ~1 s later, then nothing until the next launch | every line strictly between each REFUSED and the next `STICK FOUND` (`awk '$1>a && $1<b'`) | **HOLDS.** Each window holds only `KEEP AWAKE released`. The windows are 63 s, 8 min 39 s and 4 min 59 s; the keeper waited |
| no Leave between the last success and the crash; "one launch at 09-27 14:32 UTC" | `awk` over that span for `LEAVE\|STICK FOUND` | **HOLDS**, with a correction: **two** launches (14:31:29 and 14:32:36 UTC), neither with a Leave line |
| the exe was rebuilt after the crash | `ls --full-time src-tauri/target/release/consonance.exe` → 2026-09-28 **01:52:24** local; the first failing session launched at 01:52:48 | **HOLDS.** Every failure is on this build, and every success on older ones. The build and the post-crash machine are confounded, as A says |
| `leave_exit` logs before anything else; its one refusal is `!= LEAVE_SHOWN`; nothing moves the phase off SHOWN | `main.rs:13475-13482` read; `grep -n "LEAVE_PHASE"` → stores and CASes only at `:13051`, `:13164` (SHOWN, just before the final emit) and `:13304` | **HOLDS.** A click that reached the command would have left `LEAVE CLOSE` on disk. The command never ran |
| no Leave-path change since the last success; the two app commits are unrelated | `git log --since=2026-09-24` over `consonance/ui`, `tauri.conf.json` and `capabilities`; `git show --stat 37931aa a18a0df` | **HOLDS:** only cc921dc (09-24, before the last success), 37931aa (`index.html` wording) and a18a0df (the Jev start removed) |
| §3: every publish is refused because of the Leave's own result file | `C:/Consonance/data/state-sync.push.json` (02:07:37 local): `REFUSED_UNPLACED`, `paths: ["stick-leave.result.json"]`; `tools/state-sync.js:525-530` is the unplaced refusal; `grep -n "stick-leave" consonance/state-manifest.json` → no rule (manifest last changed bbd56ad, 09-23) | **HOLDS.** It is not the Close bug: the refused publishes on 09-25 and 09-27 still closed. The manifest rule is the keeper's or chair's call, as A says |

I did not re-derive A's Application Hang (1002) search, or the brain-rot session's `Responding=True`.

## 2 · What I add
**(a) IPC reached the backend 39 s before the third Leave.** `persist.log` 1790582760 (08:06:00 UTC):
`set_pane_name REFUSED — 'M' is a seat address`.
- That is `ui/term.js:521`'s `inv('set_pane_name', …)`, a synchronous command (`main.rs:9118`), arriving and logging.
- So in session 3 the page → IPC → command path worked until the Leave began. "This build's invoke never reaches any command" (A §4's
  last line) is **ruled out for session 3 before the Leave**. What is left starts at or after the Leave.

**(b) `leave_exit` is a SYNCHRONOUS command, and Tauri v2 runs those on the MAIN THREAD.**
- The Tauri v2 docs, *Calling Rust from the Frontend*, verbatim: "Commands without the async keyword are executed on the main thread
  unless defined with #[tauri::command(async)]." Tauri is 2.11.3 (`Cargo.lock`).
- *Inferred:* a main thread that is blocked or wedged after the Leave produces exactly tonight's record.
  - The button still renders: the Leave's emits come from the Leave's own thread, and the WebView paints on its own.
  - The click's IPC queues, and nothing is logged.
  - A §2 ruled out only one source of such a block (polled commands, and that by size, not timing). It did not rule out the class.

**(c) So A §4 step 2 does not discriminate the leading case.** Clicking a tab is pure page JavaScript. The tab would change even with the
main thread wedged, and "scripts alive, so the problem is the one call" would be read wrongly. **Add, before step 3:**
- **press the window's X once.** CloseRequested is handled on the main thread; after a Leave it emits `use-button`, which shows "Use
  Close Consonance below." (`leave.js:139`).
  - **If that text appears, the main thread and the event path are alive.** Then the fault is in that one invoke, or in the DOM over the
    button.
  - **If it does not, the main thread is not serving events.** Then the memory dump (step 3) is the decisive evidence, and its main-thread
    stack names the blocker.
- It changes nothing and costs one click.

## 3 · The packet's two questions
- **Does the diagnosis hold against the code and the log?** Yes, as a diagnosis of where the cause is NOT, and of the one fact that
  bounds it (the command never ran). A declined to name a cause or write a fix without evidence; that is right. Its "what is left"
  should read:
  - the main thread not serving (b); or
  - the one invoke lost; or
  - the DOM over the button.
  With (a), IPC broken for the whole session is out.
- **Does the fix's regression test fail on the old code?** **N/A. There is no fix and no new test.** A's `d183/replay.js` is a replay
  through `leave.js`'s own harness: it shows the button and `inv('leave_exit')` are wired. It cannot fail on "old code", because the
  Leave code did not change.

## 4 · Not established
- The cause.
- Whether the 01:52:24 build is from a clean HEAD (`169f2ad`). A's `git status` shows no uncommitted UI or `src-tauri/src` change *now*,
  not at 01:52.
- My (b) is inferred from the docs and the record, not observed.
