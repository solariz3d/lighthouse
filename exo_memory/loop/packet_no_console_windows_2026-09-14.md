# P-NO-CONSOLE · no terminal window ever pops up for Consonance. Lap L058 (second use of the id; see §0).

**To ECHO and ALPHA, 2026-09-14 ~05:30, on machine L. Disjoint files, no shared section to build against.**

## 0 · THE KEEPER, VERBATIM, AND THE LAP ID

> *(05:20)* "also there are a bunch of random windows or something that pop up and disapear fast"
> *(05:23)* **"either way, there should never be an intrusive terminal windows ever popping up for consonance"**

**The lap id is L058 a second time.** The first L059 launch installed D's state (`SYNC AT LAUNCH — the record's head is
not this machine's; installing`, persist.log :1003), which replaced `data/lap.jsonl`. L's rows for L055–L059 were
retired, not lost: `data/attic/pre-sync-2026-09-14T11-14-50-251Z/lap.jsonl`. `lap-row.js` numbered from the installed
ledger. That is a separate finding and not this packet's work.

## 1 · MEASURED BY THE CHAIR — the flash, caught twice, one minute apart

A process-start watch (`Get-CimInstance Win32_Process`, polled every 200–300 ms) caught this pattern twice:

    05:21:53    tasklist.exe  parent=26800  tasklist /FI "PID eq 33816" /FO CSV /NH
                OpenConsole.exe -Embedding, WindowsTerminal.exe -Embedding   (same second, parent svchost)
    05:22:53.8  tasklist.exe  parent=26800  (the same)
                OpenConsole.exe pid=16784 -Embedding, WindowsTerminal.exe pid=14576 -Embedding   (same 0.1 s)

pid 26800 is `node dev/stick-waiter.js --data C:\Consonance\data --app-pid 33816 --app-image consonance.exe`, and its
`tasklist` is the once-a-minute image check (`IMAGE_EVERY_POLLS = 30` x `POLL_MS = 2000`). In the 60 s watch nothing
else in Consonance's tree opened a terminal. The keeper reported a flash "5 seconds ago" at 05:21:58.

**The mechanism — the chair's reading, which you should measure rather than accept:**
- The app starts the waiter with `DETACHED_PROCESS | CREATE_NEW_PROCESS_GROUP` (`main.rs:10567`), so the waiter has
  **no console at all**.
- Every console program it starts (`tasklist`, `powershell`) must allocate a console of its own.
- Windows 11's default terminal is Windows Terminal, which takes that console over in a real window.
- `windowsHide: true` is already set at `stick-waiter.js:131` **and the window opened anyway**, so the hide flag on the
  child is not enough.
- The applier gets the same flags (`main.rs:10699`), and it starts `node tail-carry.js` through `spawnSync` with no
  hide at all (`stick-apply.js:91`), so a Carry would flash too.

## 2 · RULED

    NO CONSOLE OR TERMINAL WINDOW APPEARS FOR ANY PROCESS IN CONSONANCE'S TREE — at launch, while waiting, on Carry,
    on relaunch, at exit, with or without a stick. The keeper's word is "ever"; there is no exception for a status
    window.

**This strikes part of L059 §3.** "a VISIBLE window until DONE or NOT DONE" (the waiter's export console, A's
`openWindow`, `stick-waiter.js:150`) is a terminal window. It goes. **What replaces it — the chair's ruling, open to
the keeper's veto:** the keeper still needs to know when the stick can be pulled.
- At export the waiter raises a **Windows notification** — not a console, no window. It names DONE or NOT DONE and
  the reason, and it is started so that nothing flashes.
- If a notification cannot be shown, `stick-waiter.status.log` still says it, and nothing opens instead.

## 3 · THE SPLIT — no shared section; neither of you edits the other's files

    ECHO   consonance/src-tauri/src/main.rs (and sync_launch.rs if a test belongs there)
           - the waiter and applier spawns (:10567, :10699): no DETACHED_PROCESS. Give each a console with no window
             (CREATE_NO_WINDOW | CREATE_NEW_PROCESS_GROUP) so the console children they start inherit it.
           - MEASURE, don't assume:
               (a) the waiter still outlives the app's exit under the new flags. L059's survival check was
                   measured with DETACHED_PROCESS.
               (b) a process-start watch over the app's real spawns shows no OpenConsole.exe /
                   WindowsTerminal.exe -Embedding.
           - a test that pins the flags, and a sweep: every Command::new in main.rs and sync_launch.rs carries
             NO_WINDOW or CREATE_NO_WINDOW. Name any that cannot, and why.

    ALPHA  dev/stick-waiter.js, dev/stick-apply.js, dev/*.test.js
           - openWindow (:150) goes; replace it with the notification in §2. The --view mode may stay as a command
             the keeper can run by hand, but nothing starts it.
           - every child spawn carries windowsHide: true (stick-apply.js:91 has none).
           - MEASURE: with a stand-in parent started the way E's new flags start you, run your real children
             (tasklist, powershell, node tail-carry --import without --apply) under a process-start watch. Show no
             terminal opened. If the notification opens anything that looks like a terminal, say so and stop (§5).

## 4 · BARS AND FALSIFIER

    FALSIFIER:  over a process-start watch covering a launch, three minutes idle, and an exit, any OpenConsole.exe or
                WindowsTerminal.exe -Embedding (or any visible conhost) started within 1 s of a process in
                Consonance's tree. The keeper's own eyes are the second instrument, and they found this one first.

    BOTH   cargo test --bin consonance -- --test-threads=1 · node dev/tail-carry.test.js ·
           node dev/stick-apply.test.js · node dev/stick-waiter.test.js — state the counts
           mutants for what you change, on a COPY — applied / caught / NOT APPLIED
           what you did NOT verify; nothing with --apply against the real stick D:\consonance-L-20260911

## 5 · IF THIS PACKET IS WRONG

If the mechanism in §1 does not reproduce, or the flags cannot do what §3 asks (a CREATE_NO_WINDOW waiter that dies
with the app, say), **stop and write why in your hand-back, then ring the librarian.** Do not build around it.
Permission to refuse stands: "the notification is the wrong replacement" is a valid answer.

## 6 · HAND-BACK

`exo_memory/handback/p-no-console-<letter>_2026-09-14.md`, then `call_librarian` with the path in the same turn. One
line to your own map. Do not commit; the chair lands both together.
