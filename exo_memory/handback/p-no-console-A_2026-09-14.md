# P-NO-CONSOLE · ALPHA — the export window is gone, every child is hidden, and no terminal opened under the watch

**Pane A, machine L, 2026-09-14 ~05:55.** Packet `exo_memory/loop/packet_no_console_windows_2026-09-14.md` @ 158814f.
Nothing committed. Nothing run with `--apply`, against the real stick or anything else. `main.rs` untouched.
The keeper, verbatim: *"either way, there should never be an intrusive terminal windows ever popping up for consonance"*.

## 0 · THE ANSWER

1. **`openWindow` and its `cmd /c start` are gone.** One Windows notification replaces them, raised once at the END of
   an export: DONE, or NOT DONE with the reason and the stopped seats. None is raised on no-stick or stand-down. If the
   notification throws, the status file says so and nothing opens instead.
2. **Every child spawn in the waiter, the applier, the carry and the placement passes `windowsHide: true`, with one
   exception: the relaunch of `consonance.exe`.** That exception is deliberate (§2). A static sweep test pins it.
3. **Measured, §3 ALPHA.** A stand-in parent was started with E's new flags (`CREATE_NO_WINDOW |
   CREATE_NEW_PROCESS_GROUP`). It ran my real children: `pidImage`'s tasklist, the waiter end to end (real WMI volume
   query, real `pidsOf` tasklist, one real notification), and `tail-carry --import --json` without `--apply`.
   **Nothing that could draw a terminal started, and no new visible window appeared.** The live waiter's
   once-a-minute flash, running the code from before this lap, was caught **4 of 4 times in the same watch by both
   instruments**. The notification did not open anything terminal-like, so §5 does not fire. **I did not refuse the
   notification.**
4. **§1's mechanism is partly misattributed, and I found this before E's hand-back existed.** The flashing call was
   `tail-carry.js::pidImage` (`PID eq`), which had no `windowsHide` at HEAD. It was not `stick-waiter.js:131`, which
   had the flag. My checkpoint recorded this at ~05:35. E's §5 stop (`p-no-console-E_2026-09-14.md`, ~05:40) measured
   the same thing independently: E reproduced the flash in a stand-in and showed that the hide flag is enough. Two
   seats reached this finding without reading each other. I did not reproduce the flash myself, because the keeper
   said "never", and E's cell A-nohide already covers it.

## 1 · WHAT CHANGED (uncommitted, my files only)

    dev/stick-waiter.js       openWindow + cmd /c start REMOVED; notify(title, body, statusPath) added — a toast via
                              powershell.exe -NoProfile -NonInteractive -WindowStyle Hidden, stdio 'ignore', windowsHide,
                              30 s timeout. TOAST_PS is a CONSTANT; the XML travels in env CONSONANCE_TOAST_XML, built by
                              toastXml with every value XML-escaped. activationType="protocol" launch="file:///…status.log"
                              so a click opens the log, never the PowerShell app. Header "THE WINDOW" → "THE NOTICE";
                              exportWithWindow → exportWithNotice; tally windows → notices; --view kept, started by nothing.
    dev/stick-apply.js        defaultCarry spawnSync: windowsHide: true. defaultRelaunch: deliberately NOT (§2), commented.
    dev/tail-carry.js         pidImage tasklist: windowsHide: true — the call that flashed.
    dev/place-conversations.js consonanceRunning tasklist: windowsHide: true.
    dev/stick-waiter.test.js  window tests → notice tests; new: notice body DONE/NOT DONE shape, AMBIGUOUS names the
                              folders, a failed notice costs nothing, protocol activation, escaping, TOAST_PS constant,
                              SWEEP every child_process call hidden but the relaunch, SWEEP no cmd.exe/start/openWindow.

## 2 · THE ONE UNHIDDEN SPAWN, AND WHY

`stick-apply.js` `defaultRelaunch` starts `consonance.exe` with `spawn(exe, [], { detached, stdio: 'ignore' })` and no
`windowsHide`. The exe is GUI-subsystem (`main.rs:1`, `windows_subsystem = "windows"` in release), so it allocates no
console and has nothing to hide. `windowsHide` also puts SW_HIDE in its STARTUPINFO, which a GUI program may apply to
its first window. That would mean the app relaunches and the keeper sees nothing, which is worse than a flash.
**Not measured.** I did not relaunch the app to check, because that ends every seat. The sweep test names this as the
only exception, and a mutant that adds the flag goes red (§4).

## 3 · THE MEASUREMENT

**Instruments.** Both ran in one `powershell.exe` for 250 s, from 05:37:09 to 05:41:19 (`scratchpad/nc_watch.ps1`):
- **PROC:** WMI `__InstanceCreationEvent WITHIN 0.1` on `Win32_Process`, logging name, pid, parent pid and command
  line. I am not elevated, so `Win32_ProcessStartTrace` was not available.
- **WIN:** `EnumWindows` + `IsWindowVisible` every 40 ms, logging every top-level window that becomes visible, with its
  pid, class and title. This instrument needs no attribution. A console window shows up here no matter which process
  drew it.

**Stand-in parent.** `scratchpad/nc_standin.ps1` calls `CreateProcessW` with `0x08000000 | 0x00000200`
(CREATE_NO_WINDOW | CREATE_NEW_PROCESS_GROUP), with no handles inherited and a default STARTUPINFO. It starts
`node scratchpad/nc_children.js`, which requires the REAL `dev/tail-carry.js` and `dev/stick-waiter.js` and runs:
1. `carry.pidImage(33816)` returned `consonance`.
2. `runWaiter(['--data', <temp>, '--app-pid', <a dead pid>, '--app-image', 'consonance-standin.exe'])`, injecting
   only two things: the export is a stub (nothing is written to the stick), and `notify` is wrapped to send
   `W.notify('Consonance — TEST by pane A, ignore', …)` through the real function. This ran the real `volumeRoots`,
   `findStick` and `pidsOf`. Result: `{code 0, NOTHING_TO_DO, exports 1 (stubbed), notices 1}`. It found
   `D:\consonance-L-20260911 (older layout)`.
3. `spawnSync(node, [tail-carry.js, --stick, D:\consonance-L-20260911, --import, --json], { windowsHide: true })`.
   These are defaultCarry's exact options, minus `--apply`. Exit 0, NOTHING_TO_DO, 7 × NOTHING_PENDING, and the
   rehearsal banner "nothing will be written".

Stand-in pid 31176 exited 0. It ran from 05:37:31.49 to 05:37:32.51 local, per its own step marks in
`scratchpad/nc_marks.jsonl`.

**Result** (`node scratchpad/nc_analyse.js 31176`):

    PROC rows 356 · visible-window rows 8

    stand-in children seen by PROC:   tasklist PID eq 33816 · powershell (WMI volumes) · powershell -WindowStyle Hidden (the
                                      notice) · tasklist IMAGENAME eq consonance-standin.exe — each with its own conhost 0x4

    OpenConsole.exe / WindowsTerminal.exe starts, whole machine, whole 250 s:   8 — at 05:38:03, 05:39:03, 05:40:04,
                                      05:41:05, one OpenConsole + one WindowsTerminal each, parent 2272 (svchost.exe; command line not readable unelevated — the COM launcher is the likely one, unconfirmed)
      …between 05:37:09 and 05:38:03, the span holding the whole stand-in run:  0

    newly visible windows, whole 250 s:  8 — four CASCADIA_HOSTING_WINDOW_CLASS "Terminal" (WindowsTerminal) and four
                                      PseudoConsoleWindow owned by tasklist/conhost, at the same four minute marks
      …between 05:37:09 and 05:38:03:   0

**The positive control is the live waiter.** Pid 26800 was started by consonance.exe 33816 at 05:14:50. It loaded
`pidImage` before my edit and flashes once a minute until the app relaunches, as E's §1 also says. Its four flashes
fell inside the watch, about 60.6 s apart. Each was caught by BOTH instruments: a host-process pair and two visible
windows. So both instruments can see the thing being ruled out, and the stand-in run produced none of it.

**The notification itself.** `ToastNotificationManager.History.GetHistory(<PowerShell AUMID>)` returned exactly the one
test notice, with the protocol launch intact, and the notifier's setting reads `Enabled`. So Windows accepted it into
the notification centre. I then cleared that one entry (`History.Clear`, count was 1, only mine), because its launch
target was a temp file I had already deleted.

**Corrections to my own instrument, found while scoring it:**
- **My scripted falsifier line reads "did not fire", and that line is not evidence.** It attributes host starts to
  Consonance's tree by pid. WMI's 0.1 s poll never saw the live waiter's `tasklist` start, so the line also stayed
  silent on the positive control. What carries the result is the attribution-free count above: zero host starts and
  zero visible windows anywhere on the machine across the run. A detector that cannot fire on its control does not
  count.
- **PROC missed short starts.** Two stand-in grandchildren were not seen: the dead-pid probe `node -e ''` and the
  `tail-carry --import` node. Their conhosts were missed too. The step marks prove both ran (exit 0, output parsed).
  The terminal hosts outlive the call that raises them, and all 8 control host starts were caught, so a missed host
  is unlikely. It is still a limit, and it is the same one E names for their B cells.
- **Pid reuse mislabelled one row.** A `conhost` at 05:37:31.121 is shown with parent "(OpenConsole.exe)", pid 20880.
  But OpenConsole 20880 started at 05:38:03, 32 s later, so the label comes from a pid reused later. That conhost's
  real parent was never seen starting.
- **"Consonance's tree" includes every seat.** All the `claude.exe -p` panes are children of consonance.exe 33816, so
  "within 1 s of a tree process" matches this pane's own tooling nearly all the time. The packet's attribution rule is
  loose on this machine for that reason.

## 4 · MUTANTS — on a COPY (scratch replica; the shared checkout is never written)

    node scratchpad/ctrl_noconsole.js           13 applied · 13 caught · 0 survived · 0 NOT APPLIED
      windowsHide dropped at: pidImage (THE FLASHER) · place-conversations tasklist · applier carry · waiter WMI ·
                              waiter export · the notice's powershell                              7 × caught by the SWEEP
      the relaunch GAINS windowsHide                                                               caught by the SWEEP
      no protocol launch (a click would open PowerShell)                                           caught (2 red)
      escaping removed                                                                             caught
      notice text spliced into the script                                                          caught
      a notice on no-stick                                                                         caught
      a failed notice costs the export                                                             caught
      a notice at the START of the export as well as the end                                       caught (3 red)

    node dev/tail-carry.mutants.js              69 killed · 0 survived · 0 not applied · 69 total  (its own copy; run
                                                on the final files, 05:35–05:58; no .tail-carry.mutant-* left: ls -a dev → 0)

**Weakness to name:** seven of the thirteen are caught by one test, the static sweep. That is a source-text test. It
shows the flag is present at every call site. It does not show that the flag hides anything; §3 is the evidence for
that.

## 5 · COUNTS

    node dev/stick-waiter.test.js         39 passed, 0 failed
    node dev/stick-apply.test.js          24 passed, 0 failed
    node dev/tail-carry.test.js          108 passed, 0 failed
    node dev/place-conversations.test.js  35 passed, 0 failed
    node consonance/tools/js-suite.js     91 green · 4 failed · 0 crashed · 0 silent · 1 canary (of 96)
                                          the same four as last lap — actors.evidence, carrier-drift, forget-rate,
                                          portable-paths; `portable-paths.test.js` output names none of dev/stick-*,
                                          dev/tail-carry*, dev/place-conversations*

## 6 · FOR THE CHAIR AND THE KEEPER — the notification's warts, so the veto is informed

- **It says "Windows PowerShell".** The notice is attributed to PowerShell's registered app id, because Consonance has
  none of its own. Registering one (a Start-menu shortcut carrying an AUMID, from E's side or the installer) would fix
  it. That is not in my files.
- **One notice, at the end.** A long carry (the first 331 MB one) raises no signal while it runs. The old window's
  "do NOT unplug until DONE" had a visible "in progress" state; the notice does not. The status file still says it,
  but nobody is looking at that file. A second, "copying…" notice at the start would bring the signal back. I did not
  add one, because the packet says "a notification replaces it" and a mutant pins one notice. It is the keeper's call.
- **If notifications are off** (Do Not Disturb, or PowerShell's notifications turned off in Settings), I expect
  `Show()` to succeed silently and nothing to appear. **Not tested.** If that happens, the status file records nothing
  wrong, the export is unaffected, and the keeper gets no DONE. Today the notifier reads `Enabled`.
- **Click-to-open-log is unverified.** Nobody clicked. The XML is right and survived into Windows' history intact, but
  what a click does has not been observed.

## 7 · WHAT I DID NOT VERIFY

- **Nothing ran through the app.** The real waiter and applier were not started by `consonance.exe` under E's new
  flags. That needs E's `main.rs` change, a rebuild and a relaunch. **§4's falsifier as registered** (a launch, three
  minutes idle, and an exit under one watch) belongs to the landing, and it has not been run.
- **The relaunch's SW_HIDE risk** (§2), in either direction.
- **The export with `--apply`** was not run; its spawn options are the stubbed call's options, pinned by the sweep.
- **Under the OLD DETACHED parent, my hidden children.** I did not run them there, by choice. E's cell A-hide covers it.
- **The live waiter keeps flashing once a minute until the app relaunches.** No edit here can stop a running node
  process. That is E's §1 point too, and it bears on the keeper right now.
- **Anything on D.**

## 8 · SCRATCH, FOR RE-RUNNING

    C:\Users\zackn\AppData\Local\Temp\claude\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\scratchpad\
      ctrl_noconsole.js   the 13 mutants on a temp replica
      nc_watch.ps1        PROC + WIN watch          nc_watch.jsonl   its 250 s record
      nc_standin.ps1      CreateProcessW with E's flags
      nc_children.js      the real children          nc_marks.jsonl   their step marks
      nc_analyse.js       the scoring (read §3's corrections before trusting its falsifier line)

---

# §9 · AFTER THE RE-RULE (5190f73, repaired 04bc6b5) — two notices, named Consonance. Built and measured, ~06:20

The chair's §1 block rules my three warts: (1) two notices, START "don't pull it yet" and END DONE / NOT DONE; (2) name
it Consonance if possible without a new dependency, or say it can't be done; (3) click-to-open-the-log stays unverified.
**All three are answered below. Nothing new is installed or required. The keeper's veto is still open.**

## 9.1 · WHAT CHANGED (dev/stick-waiter.js, dev/stick-waiter.test.js — uncommitted)

- **Two notices.** `exportWithNotice` raises `Saving to the stick — don't pull it yet.` with the folder, and the line
  *A second notice will say DONE or NOT DONE*. It is raised ONCE, after the stick is found and before the first
  export attempt, so LEDGER_LOCKED retries do not repeat it. The DONE / NOT DONE notice follows. AMBIGUOUS exports
  nothing, so it raises only the NOT DONE. No-stick and stand-down raise nothing. Both notices go through one `raise()`,
  so a failure of either writes the status file and costs nothing.
- **One tag for both** (`Tag 'stick'`, `Group 'consonance'`). The end notice REPLACES the start notice in the
  notification centre, so a stale "don't pull it yet" cannot sit beside a DONE.
- **Named Consonance, with no new dependency.** Before `Show`, `TOAST_PS` writes the per-user registration Windows reads
  for an unpackaged app's toast name and icon: `HKCU\Software\Classes\AppUserModelId\com.solariz3d.consonance`, with
  `DisplayName = Consonance` and `IconUri = <repo>\consonance\src-tauri\icons\128x128.png` (only if the file exists).
  It then shows under that id. The id is `tauri.conf.json`'s `identifier`, and a test pins that match. The mechanism is
  Microsoft's documented one for unpackaged apps
  (https://learn.microsoft.com/en-us/windows/apps/develop/notifications/app-notifications/send-local-toast-other-apps);
  two other apps on this machine (Lenovo, Razer) already use it. **What this adds to the keeper's machine:** two string
  values under HKCU, rewritten idempotently at every notice.
  Removal: `Remove-Item 'HKCU:\Software\Classes\AppUserModelId\com.solariz3d.consonance'`.
- **Header comment corrected.** It claimed "an unregistered Consonance id is silently dropped by Windows". I wrote that
  and never checked it. Measured (9.3), an unregistered id's toast still lands in History, and the difference is
  elsewhere. The comment now states what was measured.
- **Tests.** The old ONE STICK and NOT DONE tests encoded the one-notice rule the chair has now re-ruled, so they were
  updated. They now require the start notice to be up BEFORE the export and the end notice after. The retry test
  requires `['Saving', 'DONE']`. The failed-notice test requires both failures written. New tests cover:
  registration before Show, under tauri.conf's id, with DisplayName Consonance and no PowerShell id; that the icon
  exists; and the tag.

## 9.2 · COUNTS AND MUTANTS

    node dev/stick-waiter.test.js         41 passed, 0 failed
    node dev/stick-apply.test.js          24 passed, 0 failed     (file unchanged since §5)
    node dev/tail-carry.test.js          108 passed, 0 failed     (unchanged since §5; tail-carry.mutants 69/69 stands)
    node dev/place-conversations.test.js  35 passed, 0 failed     (unchanged since §5)
    node consonance/tools/js-suite.js     91 green · 4 failed · 0 crashed · 0 silent · 1 canary (of 96) — the same four.
                                          portable-paths' only mentions of my file names are E's sync_launch.rs:2003/2005

    node scratchpad/ctrl_noconsole.js     pre-flight dev/stick-waiter.test.js: 41 passed, 0 failed
                                          20 applied · 20 caught · 0 survived · 0 NOT APPLIED
      the 12 from §4 that still apply (the "notice at START" mutant is now the rule, so it is inverted below), plus:
      no start notice (4 red) · start notice after the export · a start notice per LEDGER_LOCKED retry · a start notice
      on AMBIGUOUS · back to PowerShell's id · id drifts from tauri.conf.json · registration dropped · no tag

**Correction to my own harness, caught this lap.** The first 20-mutant run reported 20/20, and every kill was false.
The new "sent as Consonance" test was red in EVERY mutant, because the scratch replica had no `tauri.conf.json` and no
icon. The runner had no green pre-flight, so a test that was red anyway counted as a catch. I fixed it: the replica now
carries both files, and the runner refuses to score any mutant unless the unmutated suite is all green. The 20/20 above
comes from the fixed run. **§4's 13/13 ran without a pre-flight.** Every kill it reports names a specific test, and none
of those tests was red on the real files then (39/0), so I have no reason to think it false. But it was unguarded, and
the 20-run supersedes it.

## 9.3 · MEASURED — two real notices under E's flags, no terminal, named Consonance, the second replaces the first

First the probe (`scratchpad/nc_name_probe.ps1`), which answers whether naming is possible at all. I registered the id
and showed one labelled test notice under it, then did the same with an UNREGISTERED id as the control.
- Both ids got `History` count 1, so **History does not discriminate** a named sender from an unnamed one. My §3 use of
  History proved acceptance only.
- The discriminator: `HKCU\…\Notifications\Settings\<id>`, Windows' sender record. It **was created for the registered
  id and NOT for the unregistered one.**
- I took one screenshot of the lower-right screen quarter while the probe notice should have been up. It showed a
  full-screen app and **no banner**, so the banner was suppressed or out of frame. **No visual confirmation of the
  name.** I deleted the image and took no more; this is the keeper's screen.
- Then I removed the probe's registration, sender record and history, so the real run started from nothing.

Then the real run. `scratchpad/nc_watch.ps1` ran 200 s, 06:14:34 → 06:17:54, as PROC + WIN
(`scratchpad/nc_watch2.jsonl`, scored by `nc_analyse2.js 9140`). The same stand-in (`CreateProcessW`,
`CREATE_NO_WINDOW | CREATE_NEW_PROCESS_GROUP`, pid 9140, exit 0) ran the same real children. The waiter now raised BOTH
notices through the real `notify`, bodies relabelled as tests. The step marks show `notify1` ("Saving to the stick —
don't pull it yet.") before the stubbed export and `notify2` (DONE) after.

    stand-in children seen by PROC:  tasklist PID eq 33816 · powershell (WMI) · powershell -WindowStyle Hidden ×2 (the two
                                     notices; the registration script is visible in their argv) · tasklist IMAGENAME
    OpenConsole / WindowsTerminal starts, whole machine, 200 s:  6 = 3 pairs at 06:15:28, 06:16:28, 06:17:29 (parent 2272)
      …between 06:14:34 and 06:15:28 — the span holding the whole stand-in run (06:14:55.06–06:14:56.41):  0
    newly visible windows, 200 s:  6 = the same 3 marks (Terminal + PseudoConsoleWindow)   …in that span:  0
    live waiter 26800 still running (checked at watch start): the positive control, 3 of 3 caught by both instruments

    after the run:
      HKCU\Software\Classes\AppUserModelId\com.solariz3d.consonance   DisplayName "Consonance", IconUri <repo>\consonance\src-tauri\icons\128x128.png
                                                                      — written by the waiter's own TOAST_PS; the key was absent before
      Notifications\Settings\com.solariz3d.consonance                 present (Windows took it as a sender)
      History under the id after TWO shows with one tag               1 — tag=stick group=consonance, "notice 2 of 2"
                                                                      → the end notice REPLACED the start notice

Afterwards I removed the registration, the sender record and the history entry (`reg=False sender=False history=0`),
so the machine is as I found it. The keeper's first real close writes them again.

## 9.4 · STILL NOT VERIFIED

- **That the banner reads "Consonance" with the icon.** The registry and the sender record say Windows has the name. No
  eye has seen a banner, mine included (the screenshot caught none).
- **Click-to-open-the-log**, as the chair ruled. It stays unverified until the keeper's close.
- **With banners suppressed** (full screen, Do Not Disturb), whether either notice still reaches the notification
  centre where the keeper would look. The screenshot suggests banners can be suppressed on this machine right now.
- Everything in §7 still stands: nothing through the app, the relaunch's SW_HIDE, `--apply`, D.
