# Why no pull ran at this morning's launch, and the order of pull and shelf (plan parts W5 and W1)

Reader: one level-two swarm reader, on D, 2026-11-13, read-only except this file. Code cited at HEAD 3f5fa65d (the cited
files have no diff from d41c088e). Marks: [read] opened and seen; [summary] secondary; [inferred] mine; [ours] a proposal.

## Summary (five lines)

1. The desktop shortcut started the app through `launch.ps1` (clicked 08:41:36.4; fuse receipt 08:42:13.0; app 08:42:24.8).
2. Its pull block ran, but its fetch never moved `origin/main`; on 11-11 the same block left a reflog row, today none.
3. Most likely cause: the fetch hit its 20 s ceiling (36.6 s from click to fuse; the other steps take about 0.5 s).
   [2nd reader: not a stall. The fetch was RECEIVING a pack when it ended: 2,138,111 B of the 90,516,246 B it needed.
   85,215,537 B of that is one file, `future_experiments/librarian_0c0c0c0b_2026-11-13_0650L.jsonl.gz.enc`, added on L
   in 3de92e53 at 06:58:16. Every earlier launcher fetch that succeeded carried 11,255,767 B or less. See §4.]
4. ~~Nothing on disk can confirm it, because every exit of the pull block writes only a dialog or a hidden console
   line.~~ [2nd reader: git itself left a trace. `.git/objects/pack/tmp_pack_Hl1ze7`: created 08:41:38.860, last
   written 08:41:57.664, 2,138,111 B. That is index-pack's output from a fetch that did not finish [read] PowerShell
   CreationTime/LastWriteTime. True of the script itself: none of its exits writes a file (`launch.ps1:410-561`).]
5. The app never pulls the repo: the shelf is written from the tree as found, with no line saying the pull failed.

## 1. How the app was started on D this morning

- The desktop shortcut `Consonance.lnk` runs `powershell.exe -NoProfile -ExecutionPolicy Bypass -File
  "...\lighthouse\consonance\launch.ps1"`, WindowStyle 1 (a normal, visible console; not `launch.vbs`). No Start-menu,
  taskbar-pinned or Startup shortcut points at Consonance. [read] WScript.Shell `CreateShortcut(...)`, read-only.
- Explorer's run record for that shortcut: last run **2026-11-13 08:41:36.443** local. [read] HKCU `...\Explorer\
  UserAssist\{...}\Count`, the ROT13 value for `C:\Users\nname\Desktop\Consonance.lnk`, FILETIME at byte offset 60.
- `launch.ps1` ran to its update fuse: `%LOCALAPPDATA%\consonance\claude-update.json` has `"at":
  "2026-11-13T14:42:13.0153733Z"`, outcome `updated` (2.1.322 to 2.1.323), 8,998 ms; file written 08:42:24.621. [read]
  The fuse records `at` before it starts work (`consonance/launch.ps1:135-137`). [read]
- The app process: pid 24164, started **08:42:24.825**, `...\consonance\src-tauri\target\release\consonance.exe`; its
  parent pid 22144 no longer exists. [read] Win32_Process. The exe is dated 2026-11-08 23:56:09. [read] `ls`.
- So the start path was the shortcut, then `launch.ps1`, then the up-to-date branch: `Invoke-FuseOnce; Start-Process
  $exe; exit 0` (`launch.ps1:594-598`). [inferred] from three facts. The fuse ran. The app started 0.2 s after the
  receipt. The parent is gone. The post-build branch would still be alive, waiting in `$proc.WaitForExit()`
  (`:749`), because `dream_on_close` is not set in `~/.consonance.json`. [read] the config keys.
- None of the four paths that `launch.ps1:78-81` names as not covered was used today. None of them runs the fuse.
  [read] `consonance/restore-main.ps1:153`, `dev/TAKE-STICK.ps1:70` (Start-Process, no pull); `dev/ARRIVING.ps1:51-57`
  (it does `git pull --ff-only`); `dev/stick-apply.js:5`, `:16` (relaunch). [inferred] that none ran: the fuse receipt
  belongs to this launch.

## 2. The timeline (all local, -06:00)

| time | event | source |
|---|---|---|
| 11-12 05:33:20Z | last row of the previous session: `CLOSE X — asked: 1 working (A=stale)` | [read] `C:/Consonance/data/persist.log:4581` |
| 11-11 23:33:30 to 11-13 08:42:20 | 0 files written anywhere in the data dir (maxdepth 3) | [read] `find -newermt` count |
| 11-12 18:13:16 | the clock's last value before sleep | [read] System log, Kernel-General id 1 at 08:37:19 |
| 08:37:21.8 | resumed from a low power state; network connected 08:37:20 and 08:37:22 | [read] System log Power-Troubleshooter id 1; NetworkProfile id 10000 |
| 08:41:36.4 | the shortcut is clicked | [read] UserAssist |
| 08:41:36 to 08:42:13 | `launch.ps1`: mutex, `cargo metadata`, **the pull block**, the rebuild check | [read] `launch.ps1:189-599` |
| 08:42:13.0 | the update fuse starts (so the pull block has returned) | [read] receipt `at` |
| 08:42:24.8 | consonance.exe starts | [read] Win32_Process |
| 08:42:27.3 | the app's `state-sync.js --pull` fetches the STATE repo over https from github.com: `stage: done` | [read] `C:/Consonance/data/sync-completion.json:4`, `:11` |
| 08:42:28 | `SYNC AT LAUNCH RESUME`; seats resume from 08:42:30 | [read] `persist.log:4583`, `:4587` |
| 08:42:42.7 | the librarian's instance `CLAUDE.md` is written (108,857 B) | [read] `ls --full-time` |
| 08:43:26.9 | first user message in the librarian transcript | [read] streamed timestamps only |
| 08:43:32.6 | that seat's first tool call is a Bash call containing a git pull | [read] tool name and a pattern match only |
| 08:43:39 | `origin/main` moves 0b85fead to 8fd453c6, reflog `fetch -q: fast-forward` | [read] `git reflog refs/remotes/origin/main` |
| 08:43:40 | HEAD moves, reflog `pull -q --ff-only: Fast-forward`, 307 commits | [read] `git reflog HEAD`; `git rev-list --count` |

## 3. Where the pull block can end, and what each end leaves behind

`Update-FromOrigin` (`launch.ps1:410-561`) has these exits. **Not one writes a file**, except the park path's
`consonance-parked.jsonl`. The rest write `Write-Host` to a console that closes on `exit 0`, or a `WScript.Shell.Popup`
that closes itself after 8 to 15 s (`:52-56`). [read]

| exit | lines | trace | ruled in or out today |
|---|---|---|---|
| holder `ghost` | `:414-418` | dialog, 15 s | OUT: no consonance.exe at 08:42:13, or the fuse would read `skipped` (`:145-146`) [read]; persist.log and the data dir are silent for 33 h [read] |
| holder `unknown` | `:419-422` | dialog, 8 s | unlikely: `Get-Process -ErrorAction Stop` took 20 ms here and did not throw [read] |
| holder `windowed` or `starting` | `:423-426` | console only | OUT: same evidence as `ghost` |
| git not on PATH | `:427-431` | dialog | unlikely: `-NoProfile` resolves `C:\Program Files\Git\cmd\git.exe` today [read]; the shortcut pulled on 11-11 [read] |
| not a checkout / status failed | `:435-439`, `:445-449` | dialog | unlikely: the seat's pull in the same tree worked 87 s later [read] |
| not on main | `:440-443` | console only | OUT: the HEAD reflog has no checkout between 11-11 23:32:49 and 11-13 08:43:40 [read] |
| **fetch over 20 s, killed** | `:459-462` | dialog, 8 s | **IN** (§4) |
| **fetch exit not 0** | `:465-468` | dialog, 8 s | **IN, weaker** (§4) |
| origin not ahead | `:477-480` | console only | OUT: ~~no fetch row today at all (below);~~ [2nd reader: a fetch that finds nothing new leaves no row either, so that proves nothing here. The real evidence: the server was sending a pack (tmp_pack_Hl1ze7, 2,138,111 B at 08:41:57), so origin was ahead [read]] L's note says the laptop pushed before it left [summary] `librarian/2026-11-13.md:385` |
| dirty, parked or refused | `:481-549` | park record, or dialog | not reached: the fetch is before this test (`:451` before `:481`) [read] |
| fast-forward done | `:551-557` | console only, and **two reflog rows** | OUT: no rows today [read] |

**The reflog is the one durable trace, and it says the fetch did not succeed.** The launcher fetches with `fetch
--quiet origin main` (`:453`) [read]. A successful fetch that moves `origin/main` leaves a reflog row with exactly that
text: 10 such rows exist, the newest `2026-11-11 08:32:47 fetch --quiet origin main: fast-forward`, with its HEAD row
`merge origin/main: Fast-forward` at the same second ~~(20 such rows)~~ [2nd reader: 14 rows read exactly
`merge origin/main: Fast-forward`. 20 rows contain `merge origin/main`, but 5 are `Merge made by the 'ort'
strategy` and 1 is a D570 merge [read] `git reflog HEAD | grep -c`] [read] `git reflog`. `core.logallrefupdates` is
`true` (`.git/config`) [read]. Today has no such row [read]. Origin was ahead: the 307 commits are dated 11-12 00:44:50
to 11-13 08:06:10 [read] `git log`, and L's 08:0x entry says "Pushed by me, since he is leaving" [summary]
`librarian/2026-11-13.md:385`.

## 4. The cause, ranked

1. **The fetch ran past its 20 s ceiling and was killed** (`:459-462`). The dialog read "not updated - network too slow".
   - For: 36.6 s passed from the click (08:41:36.4) to the fuse (08:42:13.0) [read]. The other steps, timed here
     read-only: `cargo metadata` 275 ms, the source scan 7 ms, `git status` 67 ms, `Get-Process` 20 ms, a
     `-NoProfile` start 135 ms [read]. Timeout plus dialog is 20 s + 8 s = 28 s, which leaves about 8 s for a cold
     start 4 minutes after resume. That fits [inferred].
     [2nd reader: tighter now. index-pack opened its file at 08:41:38.860, so the fetch child started at or just before
     then. The ceiling then fires at about 08:41:58 to :59; the last byte was written at 08:41:57.664. So data was
     still arriving about a second before the kill [inferred from the two times]. The first Notify also pays
     `Use-RealPixels`, an `Add-Type` C# compile (`launch.ps1:34-36`, `:54`) [read], so kill + compile + 8 s dialog
     reaches the fuse's 08:42:13.0 with a few seconds to spare [inferred]. If he closed the dialog early, the gap grows.]
   - For: `launch.ps1:257-264` records that, on this machine's git 2.40, `http.lowSpeedTime` does not bound a stalled
     https handshake (D066) [read]. Git here is 2.40.0.windows.1 [read].
   - Against: at 08:42:13 to :22 the CLI update reached its server, and at 08:42:27 the app's git fetch of another
     github.com repo over https finished [read]. ~~So any stall was short, or specific to this fetch.~~
     [2nd reader: it was not a stall, and nothing specific is needed. The state repo's `.git/FETCH_HEAD` was written
     08:42:26.796, so its fetch worked [read]. The launcher's fetch had to carry 2,157 objects, 90,516,246 B
     (`git rev-list --objects --disk-usage 0b85fead..8fd453c6`) [read]. The seat's fetch carried the same set:
     pack-442f6c48… is 91,510,947 B, file created 08:43:34.220, idx 08:43:39.016, about 4.8 s [read]. The launcher's got
     2,138,111 B in about 18.8 s, about 114 KB/s average [inferred from size and times]. Why the first transfer was slow
     is not on disk (a slow first minute of the network, or a server side cost on the first request) [inferred]. The
     size settles the outcome: at 20 s total, the fetch fits only if it averages over 4.5 MB/s from its first second.]
   - What could make it specific (open): the launcher's fetch is the only one of the three made with
     `GIT_TERMINAL_PROMPT=0` and `GCM_INTERACTIVE=never` (`:456-457`) [read]. The credential helper is `manager`
     (`C:/Program Files/Git/etc/gitconfig`) [read]. ~~A credential step that cannot ask could wait out the ceiling. Not
     tested: it needs a request to the remote, and this reader makes none (rule 6) [inferred].~~ [2nd reader: ruled
     out. index-pack only runs after the server answers and the negotiation is done, and it received 2.1 MB. So no
     credential step and no TLS stall held this fetch (tmp_pack_Hl1ze7) [read]. D066's handshake case did not happen
     today.]
   - Something else was waking the network too: a VPN service took a power event at 08:37:20 (Application log, nssm
     id 1040). It left no log for today [read]. Its state at 08:41 is not known [inferred].
2. **The fetch exited non-zero quickly** (`:465-468`). The dialog read "not updated". Same reflog evidence. But a fast
   failure plus an 8 s dialog is about 10 s, and leaves about 25 s of the 36.6 s unexplained [inferred]. It could fit
   if git took about 20 s to fail on its own.
   [2nd reader: DOWNGRADED to unlikely. index-pack was still writing 18.8 s after it opened its file, so this was not
   a quick failure. A network error at second 19 that ends git just before the ceiling would leave the same file. The
   disk cannot tell those two apart. The low-speed abort (`:453`, 1,000 B/s for 15 s) did not fire at about 114 KB/s
   [inferred]. Either way the dialog said "not updated", and the outcome is the same: a cut transfer.]
3. **An earlier exit with a dialog** (git missing, not a checkout, status failed, holder unknown). Not excluded by a
   record, but each one contradicts a check above [read].
4. **A quiet skip** (another app running, not on main, origin not ahead). Excluded [read], §3.

What would settle 1 against 2 today: which dialog title he saw. His words as the note records them, "back, rebuild
didnt succeed" (`librarian/2026-11-13.md:387`) [read], do not say. The swarm already found a second candidate for that
line (`loop/room_better_2026-11-13/00_critic.md:196-197`) [summary]. So it is not evidence either way.
[2nd reader: the dialog title is no longer needed: the tmp_pack settles it. One more reading of his line, [inferred]:
the 307 commits changed `consonance/src-tauri/src/MAP.md` (`git diff --name-only 0b85fead..8fd453c6`, 1 file under
the scanned source paths) [read]. `launch.ps1:566-590` scans every file under `src-tauri\src`, so a pull that worked
would have made this launch rebuild. The rebuild he expected may be the one the cut fetch prevented.]

## 5. The start sequence in the app: where the shelf is written, against any pull (W1)

- **The app never pulls the lighthouse checkout.** The only repo pull on the shortcut path is `launch.ps1:562`, before
  `Start-Process` [read]. In the Rust, `"--pull"` occurs once: `run_state_pull` (`main.rs:14431-14475`, the argument at
  `:14439`) starts `node consonance/tools/state-sync.js --pull` [read]. That script fetches and fast-forwards the STATE
  tree, `stateDir()` (`state-sync.js:836`, `:841`, `:852`) [read]. Here that is `C:\Consonance\state`, whose origin is a
  different repository from the lighthouse checkout [read] `git config` compared. **"Sync at launch" is about the data
  dir's state, not the repo.**
  [2nd reader: holds. One more git fetch exists in the app, `mcp.rs:2440` (`git fetch --quiet <remote>`), inside
  `seal_declared` (`mcp.rs:2339`), a verb run on demand, not at start [read]. `sync_launch.rs` contains no `git` at all
  (count 0) [read]. And a W1 limit: the brief half of the intake is not read from the tree. `room_brief_at`
  (`main.rs:4067`) takes the data-dir copy, then the bundled copy beside the exe, then the repo [read]. So a pull before
  the shelf refreshes the cards, notes and BOOT, but not LIBRARIAN.md. Only a rebuild does (`launch.ps1:569-579`) [read].]
- **Order inside the app** [read]:
  1. In `.setup()`: `set_dirs` (`main.rs:16392`), `leave_cleanup_at_launch` (`:16395`), `sync_at_launch()` (`:16403`,
     defined `:14529`, state repo only), `plog("SYNC AT LAUNCH ...")` (`:16414`).
  2. The UI then calls `inv('spawn_librarian')` (`consonance/ui/term.js:680`).
  3. `spawn_librarian` (`main.rs:9477`) builds `librarian_intake()` (`:9488`). In light mode that is the brief, BOOT,
     the map pointer and `librarian_shelf_light()` (`:9317-9322`, `:9334-9343`). The shelf reads `cards/` and
     `librarian/` from the working tree as it stands (`:8950-8979`), capped at `LIGHT_NOTES_CAP` 24,000 (`:8928`).
  4. It writes the file with `let _ = fs::write(...CLAUDE.md, intake)` (`:9502`): a failed write is dropped silently.
  5. Then `spawn_claude_pane(..., resume, true)` (`:9504`).
  6. The main seat and the Third Place do the same (`:9559`, `:9460`).
- So the shelf comes after the launcher's pull **when that pull happens**, and after nothing when it does not. No header
  says which. The live file still has 0 lines matching `built from` (108,857 B, mtime 08:42:42) [read].
- **Nothing rewrites the file during a session.** The app writes it only at spawn [read] grep. No hook or tool writes an
  instance `CLAUDE.md` (one test fixture only, `consonance/tools/label-watch.test.js:164`) [read]. Claude Code loads it
  at launch, and "after `/compact`, Claude re-reads it from disk and re-injects it". Downloaded and read:
  `https://code.claude.com/docs/en/memory.md`, lines 64 and 656 [read]. So the seat's 08:43:40 pull did not reach the
  shelf. A compaction would re-inject the 08:42:42 file, not a fresh one [inferred]. There has been no compaction since
  14:42Z (0 `compact_boundary` rows) [read].
- At 08:42:42 the light shelf carried the 460-byte `librarian/2026-11-12.md` (instance file `:826-830`). It named
  `librarian/2026-11-11.md` and `loop/handoff_dreamzone3_2026-11-11-D.md` as the newest written (`:372`, `:377`). It
  named `LEDGER.md` as not fitting (`:364-365`) [read]. Today's note did not exist on D yet [summary] `in_wake.md:96-98`.

## 6. The smallest fixes

**F1 (W5): the launcher says what its pull did, on disk** [ours]. In `Update-FromOrigin`, every return writes
`%LOCALAPPDATA%\consonance\launch-pull.json`, beside the fuse receipt and for the same reason: the data dir would make
`close.js --check` refuse (`launch.ps1:118-122`). Fields:
- `at`, `machine`;
- `outcome`, one per exit in §3: `pulled`, `current`, `skipped-running`, `skipped-branch`, `fetch-timeout`,
  `fetch-failed`, `refused-dirty`, `parked`, `ff-refused`, `error`;
- `head_before`, `head_after`, `behind`, `fetch_ms`;
- `why`: git's first stderr line. To have it, the fetch child must redirect stderr, as `Invoke-Bounded` does
  (`:95-98`). Today the fetch's stderr goes nowhere.
  [2nd reader: on today's exit, a kill at the ceiling, git prints no error line, so `why` would be empty for exactly
  the recorded case. Add `--progress` and keep its LAST line ("Receiving objects: n% … MiB | KiB/s"). Also add
  `bytes_received`, the size of the newest `tmp_pack_*` in `<git dir>\objects\pack` at the kill. Today that would read
  2,138,111 [ours].]

The exits stay as they are: same dialogs, same fail-safe `return`s. One write, in a `try`, like `:170-175`.
- Needs: no rebuild, no hook install. It is `launch.ps1`, which runs on every launch on both machines. Tier: check it
  (the behaviour is additive; a write that throws is caught). Tests: extend `consonance/launch.park.test.js`. That file
  already runs the real `Update-FromOrigin` against a scripted origin with `Notify` stubbed (`:5-6`, `:22-27`) [read].
  Lap W is parked at his word (`plan_room_stretch_2026-11-13.md:33`) [read], so his word starts it.
- ~~Optional, behaviour change, his call: when the fetch is killed at the ceiling, retry it once (10 s). A normal fetch
  takes 375 to 396 ms (`:264`) [read], so a one-off stall would be absorbed.~~ [2nd reader: a 10 s retry would also
  have been cut today: 90.5 MB needed, about 114 KB/s seen. The 375 to 396 ms figure is a fetch with nothing to carry.
  F1 alone reports the failure and leaves it in place. **F1b, the fix for the recorded case** [ours]: bound the wait
  for SILENCE, not the total. Keep 20 s until index-pack opens its file (D066's handshake case stays covered). After
  that, keep waiting while the newest `tmp_pack_*` grows (poll each 1 s; kill after 15 s with no growth), up to the
  fuse's own cap of 120 s (`:69-72`). On the cap, kill as today. No rebuild, no hook install. Tier: prove it, not check
  it, because it gates every launch on both machines and moves the tree by fast-forward. The same size question is a
  call for his word, not this lap: an 85 MB encrypted transcript per day makes every catch-up large.]

**F2 (W1): the shelf says what it was built from** [ours]. Add one line at the top of the light shelf (`main.rs:8980`,
and the strict path at `:9324-9326`):
"Built <time> from HEAD <sha> (<commit time>). The launch's pull: <outcome> at <time>, <why>."
- Read the outcome from F1's receipt.
- Use the receipt only if it belongs to this launch. The exact form: the launcher adds `app_pid` after
  `Start-Process -PassThru`, and the app compares it with `std::process::id()`.
  [2nd reader: a race. The up-to-date branch is `Start-Process $exe` with no `-PassThru` (`:597`). Writing `app_pid`
  AFTER the start races the app's own read, which comes about 18 s later today (08:42:24.8 to 08:42:42.7), but with no
  bound. Smaller and race-free [ours]: accept the receipt when its `at` falls within 300 s before the app's own start
  time. Or set a launch id in `$env:` before `Start-Process`, which the child inherits.]
- With no receipt from this launch, the line says **"origin was not checked at this launch"**. That covers the four
  uncovered start paths too.
- **Do not** compute "ahead" from the local `origin/main` without a fetch. At 08:42:42 that ref was still 0b85fead,
  unchanged since 11-11 23:32:51 [read] reflog. So "0 behind" would have printed: a false green on this very case.
- Needs: Rust, so one rebuild and one restart. The restart resumes each seat's transcript; it cuts no context.
- Smaller still and safer than a pull in the app (also Rust): a bounded `git fetch origin main` in setup beside
  `sync_at_launch`. It moves only the remote-tracking ref, so it hands the close no newer `dev/tail-carry.js`
  (`launch.ps1:284-286`). The line could then say "origin is N ahead" truthfully.
  [2nd reader: a bounded fetch in setup would have been cut today for the same reason as the launcher's. It moves the
  ref only if it finishes. It would print "N ahead" truthfully only if it runs without a total ceiling, off the
  setup thread, and the line says "still checking" when it has not finished by spawn time [inferred].]
- **Not proposed:** a full pull inside the app. Pulled Rust sources would need a rebuild the running exe cannot do, and
  the tail-carry skew applies.

**F3 (housekeeping, just do it)** [ours]: `launch.ps1:78-81` cites `main.rs:12549` and `main.rs:13253`. Those lines
drifted: `sync_at_launch()` is now called at `main.rs:16403`, and the stick-apply start at `:15387-15389` [read].
[2nd reader: one more drift in the same comment. `dev\ARRIVING.ps1:132` is the import step now. The app starts at
`dev/ARRIVING.ps1:146` [read]. Its pull at `:52` has no ceiling at all [read].]

## 7. Checks that fail today on the recorded case and pass after

- **W5, on D's own disk (red now).** A read-only checker over this launch's facts:
  - the shortcut click (UserAssist 08:41:36.443);
  - the fuse receipt (`at` 14:42:13.0153733Z);
  - the app start (08:42:24.825).
  It requires `launch-pull.json` with `at` between the click and the fuse's `at`, and an `outcome`. Today the file
  does not exist: RED [read] `ls %LOCALAPPDATA%\consonance`. After F1, the next launch makes it GREEN.
  [2nd reader: confirmed red, for the reason given (the folder holds 8 files and no `launch-pull.json`) [read]. But
  F1 makes it green on a launch that opens 307 behind, with `outcome: fetch-timeout`. It checks the report, not the
  pull. **The check for the cause, on this morning's own disk (red now)** [ours]: the newest `tmp_pack_*` in
  `.git/objects/pack` was created between the click and the fuse's `at`. Its size (2,138,111) is below what the
  catch-up needed (`git rev-list --objects --disk-usage 0b85fead..8fd453c6` = 90,516,246), so the launch cut a
  transfer. Probe run read-only: RED today. After F1b, a launch on a large catch-up leaves no such file and two
  reflog rows (`fetch --quiet origin main`, `merge origin/main`).]
- **W5, as a unit test (red now).** In `launch.park.test.js`'s world, set origin to a missing `file://` path. Expect a
  receipt with `outcome: fetch-failed` and a non-empty `why`. Today `Update-FromOrigin` writes no receipt: RED.
  - For the 20 s stall, the D066 never-answering local server (`launch.ps1:257-261`) gives `fetch-timeout`.
  - Make the ceiling a script variable, so the test does not wait 20 s.
    [2nd reader: a script-scope variable will not reach the test. The harness lifts only the four named FUNCTIONS
    out of the parsed file (`launch.park.test.js:20-24`) [read]. Make it a parameter of `Update-FromOrigin` with a
    default of 20. **And the test that is red for the recorded cause** [ours]: give the scripted origin one commit
    with a large incompressible blob (the recorded case is 85,215,537 B; 20 MB of random bytes is enough), set the
    total ceiling, in ms, below that local fetch's own time (first measure it; 100 ms is a guess [inferred]) and the
    silence bound to 15 s, and expect `pulled` with HEAD at origin. Today the real
    function kills the fetch at the ceiling while bytes still arrive: RED. After F1b: GREEN. The way to pass it
    without the fix is to raise the ceiling; a second case with a server that never answers (D066) must still end
    in about 20 s.]
- **W1, as a Rust test (red now).** Make a temp room that is a git repo at a known HEAD. Add a receipt with
  `outcome: fetch-timeout` and a matching pid; separately, no receipt. Call `librarian_shelf_light_at`. Assert:
  - the output names that HEAD;
  - it names the outcome, or "origin was not checked at this launch";
  - it never says current or 0 behind.
  Seed the second case with today's values: HEAD = local `origin/main` = 0b85fead, no receipt. A fix built from local
  refs alone fails it, as it should. The pattern for temp rooms is in the existing tests (`main.rs:9262`) [read].
- **W1, on the live file (red now).** `grep -c "built from" C:/Consonance/instances/librarian/CLAUDE.md` is 0 [read].
  After F2 and a restart, it is 1, and the HEAD it names is the HEAD `git reflog` shows at that minute.
- **W5's own falsifier** [ours]: if the next launch on either machine opens behind origin, and `launch-pull.json`
  cannot say why, F1 failed.

## What I did not open

- L's disk: its push time for 6ff2d95d and 8fd453c6 is known only from L's note (`librarian/2026-11-13.md:385`).
- The remote. No request was made to it (rule 6). So whether the launcher's exact fetch environment fails today
  (credential helper, no prompt) is untested. A pane can test it with `git fetch --dry-run` under the same two
  variables.
- Windows' PowerShell event logs for 08:41 had rolled (oldest records 09:56 and 11:02) [read]. The Prefetch folder is
  not readable without admin [read].
- No log from the VPN service for today [read]. Its state at 08:41 is not known.
- What "rebuild didnt succeed" refers to.
- The dialog he saw, if any.
- `launch.fuse.test.js` beyond its stub lines; `dev/stick-apply.js` beyond its header; the strict-shelf path
  (`librarian_shelf`) in full; the UI's start order in `term.js` beyond line 680.
- The notes-cap half of W1 (the first screen and the pinned file), which is another reader's.
- `loop/room_better_2026-11-13/in_stalls.md` (the T-180 Rebuilder lead), cited here only through `00_critic.md`.

## Second reader

Second reader, on D, 2026-11-13 about 11:20 local, read-only except this file. HEAD 3f5fa65d; the cited code files have
no diff from d41c088e [read] `git diff --quiet`. Line numbers in the table are the first reader's, before my inserts.

**The finding that changes the cause.** `.git/objects/pack/tmp_pack_Hl1ze7` [read]: created 08:41:38.860, last written
08:41:57.664, 2,138,111 B. The launcher's fetch reached the server, negotiated, and was receiving a pack. It was cut
at the 20 s ceiling, or by an error in the same second. The catch-up was 90,516,246 B; 85,215,537 B of it is one
encrypted transcript added on L at 06:58:16 (3de92e53). The ten launcher fetches that ever succeeded carried 257,658 to
11,255,767 B [read] `git rev-list --objects --disk-usage` per reflog row. So the fault is a total-time ceiling sized
from an empty fetch (375 to 396 ms, `launch.ps1:264`) meeting the first large catch-up. It was not a stall or a
credential prompt.

| line | claim (short) | primary opened | verdict | evidence |
|---|---|---|---|---|
| :8 | click, fuse and app times | UserAssist, receipt, Win32_Process | OK | 08:41:36.443; 14:42:13.0153733Z; 08:42:24.825 |
| :16-18 | shortcut runs launch.ps1, visible, sole | CreateShortcut on 259 .lnk | OK | one match, WindowStyle 1, `-NoProfile … -File …launch.ps1` |
| :19-20 | last run 08:41:36.443 | UserAssist Count, FILETIME at 60 | OK | runs 4, last 2026-11-13 08:41:36.443 |
| :21-23 | fuse updated, 8,998 ms; `at` set first | claude-update.json; `launch.ps1:135-137` | OK | as stated; file written 08:42:24.621 |
| :24-25 | pid, start, parent gone, exe date | Win32_Process; Get-Item | OK | 24164, ppid 22144 not alive, exe 11-08 23:56:09 |
| :26-29 | up-to-date branch; post-build would wait | `launch.ps1:594-598`, `:744-749`; config keys | OK | no `dream_on_close` key; dream log has no `retry` row today |
| :30-33 | the four paths at cited lines | restore-main, TAKE-STICK, ARRIVING, stick-apply | OK | `:153`, `:70`, `:51-57`, `:5`/`:16` as quoted |
| :39 | last row `CLOSE X` 05:33:20Z | persist.log:4581 | OK | epoch 1794461600 |
| :40 | 0 data-dir writes in the gap | `find -newermt`, maxdepth 3 | OK | 0 |
| :41-42 | sleep 18:13:16; resume 08:37:21.8; network | System log, NetworkProfile/Operational | OK | Kernel-General 1; Power-Troubleshooter 1; 10000 at :20.121, :22.190 |
| :47 | state repo fetched, done 08:42:27.3 | sync-completion.json:4, :11; state `.git/FETCH_HEAD` | OK | FETCH_HEAD 08:42:26.796 |
| :48 | SYNC AT LAUNCH, resumes from 08:42:30 | persist.log:4583, :4586-4587 | OK | epochs 1794580948, 1794580950 |
| :49 | instance file 108,857 B at 08:42:42.7 | Get-Item | OK | 08:42:42.701 |
| :50-51 | first user 08:43:26.9; first tool Bash with pull | transcript, streamed, timestamps and names only | OK | 14:43:26.864Z; 14:43:32.554Z Bash, pull pattern true |
| :52-53 | reflog 08:43:39 / :40; 307 commits | `git reflog`; `rev-list --count` | OK | as stated; 307 |
| :11 | nothing on disk can confirm it | `.git/objects/pack` | WRONG | tmp_pack_Hl1ze7, 2,138,111 B, 08:41:38.860 to :57.664 |
| :57-59 | no exit of the block writes a file | `launch.ps1:410-561` | OK | true of the script; git's own leftover is not the script's |
| :63-73 | exit line ranges | launch.ps1 | OK | each range opens on the cited branch |
| :71 | origin-not-ahead out: no fetch row | reflog logic; tmp_pack | DOWNGRADED | a no-op fetch leaves no row; the pack proves origin was ahead |
| :77 | 10 launcher fetch rows, newest 11-11 08:32:47 | `refs/remotes/origin/main` reflog | OK | 10 |
| :78 | 20 `merge origin/main: Fast-forward` rows | `git reflog HEAD` | WRONG | 14 exact; 20 contain `merge origin/main` |
| :78 | `core.logallrefupdates` true | `git config` | OK | true |
| :79 | 307 commits dated 11-12 00:44:50 to 11-13 08:06:10 | `git log --format=%ci` | OK | as stated |
| :80 | "Pushed by me, since he is leaving" | `librarian/2026-11-13.md:385` | OK | verbatim; written on L |
| :86 | 36.6 s click to fuse | the two times | OK | 36.57 s |
| :90-91 | D066 lines; git 2.40 | `launch.ps1:257-264`; `git --version` | OK | 2.40.0.windows.1; but the case did not happen today |
| :92-93 | any stall short or specific | pack sizes and times | WRONG | not a stall: 90.5 MB needed, 2.1 MB received |
| :95-96 | GCM `manager`; env at `:456-457` | Program Files gitconfig; launch.ps1 | OK | as stated |
| :96-97 | a credential step could wait out the ceiling | tmp_pack | WRONG | index-pack ran and received data; negotiation was done |
| :98 | VPN service power event 08:37:20 | Application log | OK | nssm 1040 at 08:37:20.758 (1041 at :20.650) |
| :100-102 | candidate 2, a quick non-zero exit | tmp_pack times | DOWNGRADED | still writing 18.8 s in; an error at second 19 cannot be excluded |
| :108 | his words "back, rebuild didnt succeed" | `librarian/2026-11-13.md:387` | OK | verbatim |
| :113-118 | app never pulls the repo; state-sync lines | main.rs:14431-14445; state-sync.js:836-852; both remotes | OK | only `mcp.rs:2440`, on demand in `seal_declared` |
| :120-128 | setup and spawn order | main.rs:16392-16414, 9477-9504, 9460, 9559; term.js:680 | OK | each line as cited |
| :125 | `LIGHT_NOTES_CAP` 24,000 | main.rs:8928 | OK | 24_000 |
| :130 | 0 lines "built from" | grep -c, -ci | OK | 0, 0 |
| :131-132 | only a fixture writes an instance CLAUDE.md | label-watch.test.js:164; main.rs writes | OK | 3 `fs::write` sites, all at spawn |
| :133-134 | docs lines 64 and 656 | memory.md fetched with curl, 667 lines | OK | both sentences present |
| :136 | 0 compactions since 14:42Z | transcript, streamed | OK | 0 `compact_boundary` in 1,218 rows |
| :137-139 | shelf lines and the 460-byte note | instance file; `cat-file -s 0b85fead:` | OK | `:826`, `:372`, `:377`, `:365`; 460 |
| :156 | park test runs the real function | launch.park.test.js:1-27 | OK | parser lifts functions; Notify stubbed |
| :157 | Lap W parked | plan_room_stretch:33 | OK | as quoted |
| :158-159 | a 10 s retry absorbs a stall | pack size | WRONG | today's case was a transfer, and 10 s carries about 1.1 MB |
| :165-166 | `app_pid` after `-PassThru` | `launch.ps1:597` | DOWNGRADED | no `-PassThru` on that branch; a write after the start races the app |
| :169-170 | origin/main 0b85fead since 11-11 23:32:51 | reflog | OK | `update by push` at 23:32:51 |
| :172-174 | a bounded setup fetch makes "N ahead" true | pack size | DOWNGRADED | a bounded fetch would have been cut today |
| :178-179 | F3: two drifted main.rs lines | main.rs:16403, :15387-15389 | DOWNGRADED | right, but ARRIVING `:132` also drifted, to `:146` |
| :188 | `launch-pull.json` absent: RED | `ls` of the folder | OK | 8 files, none of that name; but it tests the report, not the pull |
| :192 | ceiling as a script variable for the test | launch.park.test.js:20-24 | DOWNGRADED | harness lifts functions only; use a parameter |
| :199 | temp-room test pattern | main.rs:9262 | OK | as cited |
| :200 | live file red today | grep | OK | 0 |

**Tally: 51 checked. 40 OK, 5 WRONG, 6 DOWNGRADED, 0 UNSUPPORTED.**

**Probes run for the proposed checks, all read-only:**
- W5 receipt check: red today, for the reason given (no file). It passes after F1 on a launch that is still behind, so
  it is a check of the report. The cause check added in §7 (tmp_pack in the launch window, smaller than the catch-up)
  is red today for the cause: 2,138,111 < 90,516,246.
- W5 unit test with a missing origin: not run (no tests, rule 1). With F1 alone it goes green for `fetch-failed`. It
  never exercises a large transfer, so it would not have caught today. The large-blob case added in §7 would.
- W1 Rust test and live-file check: the live grep is red today (0). The Rust test's third assertion ("never says
  current or 0 behind" on HEAD = local origin/main = 0b85fead) is the one that blocks the local-refs shortcut. Kept.
- Where each fires wrongly: the cause check fires on any tmp_pack left by a seat's own killed fetch inside the launch
  window, so it must match the window to the click. F2's 300 s window would accept a receipt for a relaunch by
  stick-apply within 5 minutes of a shortcut launch; the line would then name the earlier pull.

**Needs:** F1 and F1b are `launch.ps1` only: no rebuild, no hook install, prove it for F1b. F2 is Rust: one rebuild
and one restart. A restart resumes each seat and cuts no context. Lap W starts only at his word
(`plan_room_stretch_2026-11-13.md:33`). Whether daily encrypted transcripts belong in the repo is his call too.

**Could not check:**
- The step timings at `:87-88` (275, 7, 67, 20, 135 ms): not re-run, because `cargo metadata` and a timed fetch are
  outside a read-only pass.
- Whether the fetch was killed at the ceiling or failed on its own in the same second. The disk cannot tell.
- Why throughput at 08:41:38 to :58 was about 160 times lower than at 08:43:34 to :39. No network or server log exists.
- Whether git cleans a `tmp_pack_*` after a die() as against a kill. That would be one more way to tell the two apart.

### What I did not open (second reader)

- L's disk, and the push time of 8fd453c6 there.
- The remote. No request was made to it; the one outside fetch was the public docs page.
- `cargo metadata` timing and any test or build (rule 1).
- Event logs beyond System, Application, NetworkProfile, WLAN and BITS for 08:36 to 08:46. A BITS burst at 08:44:42
  came after the launch and was not read further.
- `dev/stick-apply.js` beyond its lines 5 and 16; `restore-main.ps1` and `TAKE-STICK.ps1` beyond the start lines.
- The strict shelf (`librarian_shelf`) and `corpus_shelf_at` beyond their signatures.
