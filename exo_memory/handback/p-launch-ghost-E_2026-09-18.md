# P-LAUNCH-GHOST (D072, chunk 1) — a windowless Consonance now gets one dialog; a windowed one is still skipped quietly

**ECHO, on D (DESKTOP-EEGVFMT), 2026-09-18 ~22:4x–23:xx.** Packet: `loop/plan_small_fixes_2026-09-18.md` @7d0ced2,
row E of chunk 1, read at source; finding `handback/p-nul-repairs-B_2026-09-16.md` §3, read at source. **My files:
`consonance/launch.ps1` and its fixture and mutants. `chain-status.*` is C's and I did not open it. Nothing committed.**

## 0 · THE ANSWER FIRST

**Built as specified, landed dirty, and the bar is met.** `consonance/launch.ps1`, +101 / -2, byte-identical to the
text every test below ran against:

    base (= d5a4622, the file B read)   sha256 4f3042697a27f926d6973eb6f2b33c30fc0cf80cb0e9f239db21de9ca4f9baec
    landed                              sha256 a1a27193a2247baadf3a3f52890edc2d4728e7f2d8cd2da4729a5f63eb43608a

    fixture   31 of 31 on the change (D066's 20 re-run + 11 new); 24 of 31 on the launcher as it stood - red first
    mutants   22 applied: 21 caught · 0 SURVIVED · 1 NOT APPLIED (the control) · 0 INVALID - D066's eleven re-run
    on D      the new probe reads the live app as windowed (pid 18840, tasklist agrees); whole block: quiet skip, 56 ms

**What the keeper now sees:** a Consonance WITH a window -> exactly what he saw before (a quiet skip). A Consonance with
NO window, older than 30 s, still windowless 10 s later -> **one dialog naming the pid**, saying the update check was
skipped and why, and to end consonance.exe in Task Manager. A Consonance that is just CLOSING -> it gets up to 10 s to
go, and then **the pull runs after all**. The launcher continues in every case.

**The rule itself is unchanged: no pull while ANY consonance.exe runs, windowed or not** - B's reason, which I now carry
in the file: the running exe reads the repo's `dev/tail-carry.js` on its close path, so a pull under it is version skew
on the one path that writes the stick.

**Two things found that the plan did not name**, both in §3 and §4: the old probe **pulled under a failing
Get-Process** (G7 - a second defect, now closed), and **the app's own single-instance dialog tells a ghost's keeper to
"use the window you already have"** (`main.rs:6507` - not mine, not fixed).

## 1 · WHAT WAS WRONG, re-derived at source

B's §3, confirmed against the file as it stood (`launch.ps1` sha256 4f3042697a27…baec, = d5a4622):

    launch.ps1:159   if (Get-Process -Name 'consonance' -ErrorAction SilentlyContinue) {
    launch.ps1:160     Write-Host '  pull: Consonance is running - not touching the checkout.' -ForegroundColor DarkGray

`Get-Process -Name` is true for ANY `consonance.exe`, windowed or not, and `launch.vbs:20` starts the launcher with
`-WindowStyle Hidden`, so that one line of explanation is printed where nobody can see it. **A windowless
`consonance.exe` left by a crash therefore skips every pull, silently, launch after launch** — the exact stale-build
failure the pull exists to prevent, reached through the rule's quiet branch. `dev/stick-apply.js:56` records such a
process on D on 2026-09-16 08:40–08:52, so the case is observed, not hypothetical.

**B's recommendation is what I built, and I kept both of B's constraints:** the rule stays (no pull while ANY
Consonance runs — B's stronger reason: the running exe reads the repo's `dev/tail-carry.js` on its close path,
`main.rs` `fn run_carry_json` - B cited `:10596`; it is `:10597` tonight, one line of drift, so cited here by symbol -
so a pull under it is version skew on the one path that writes the stick), and the grace is
`dev/stick-apply.js`'s `WINDOWLESS_GRACE_MS` = 30 s, reused rather than a second number invented.

## 2 · WHAT CHANGED

All inside the marked pull block, so the fixture extracts and tests every line of it:

    Get-ConsonanceProcesses   every consonance.exe as { pid, has a window, age }; @() for none; $null for CANNOT TELL.
                              Get-Process with NO name, filtered afterwards - dev/stick-apply.js probeConsonance's
                              shape and reason: a named Get-Process reports "not found" as an error, and silencing that
                              error also silences a real failure into an empty list, i.e. into "none".
    Test-GhostOnly            true only when there are holders, NONE has a window, and all are past the 30 s grace.
                              An age that cannot be read counts as PAST the grace: doubt resolves loud.
    Resolve-ConsonanceHolder  none | windowed | starting | ghost | unknown. A holder that looks like a ghost gets up to
                              10 s to EXIT or PAINT before it is called one (probing once a second).
    Get-RunningNotice         what the rebuild branch's dialog should say, or $null to say nothing.

The skip at the top of Update-FromOrigin now reads:

    none                        -> pull, as before
    windowed / starting         -> console line, as before (quiet)
    ghost                       -> ONE Notify: the pid(s), that the update check was skipped, why, and what to do
    unknown (the probe failed)  -> ONE Notify: could not tell, so skipped

**Why the 10 s re-look, which neither B nor the plan asked for.** A just-CLOSED app loses its window first and tears
down after (dev/stick-apply.js:66-68: app.exit(0) destroys the window, the seats' kill is bounded at 5 s). Without a
re-look, "close Consonance, click the shortcut" - the keeper's ordinary way to pick up new code - would put a false
"no window" dialog in front of him every time. With it, an app that exits inside the window is treated as gone and
**the pull runs after all** (G4). 10 s is twice the 5 s bound. It costs nothing unless the holder is windowless and
past the grace; measured below at 10.2 s when it runs to the end.

**Why age is the grace and not a 30 s wait.** stick-apply.js waits and watches for 30 s continuously windowless; the
launcher cannot spend 30 s on every click. Process age answers the same question from one snapshot - "is this a
process that has just started?" - and the re-look covers the case age cannot: an old process that has JUST lost its
window. Same number, different mechanism, and §8 says what that difference leaves open.

## 3 · `:276` AND `:418`, READ AT SOURCE — one brought under the rule, one deliberately not

**:276, the rebuild branch (now :369) - BROUGHT UNDER THE RULE.** When sources are newer than the exe and any consonance.exe
runs, it raised: *"The window you have is running the OLD build. Close it completely..."* For a ghost there is no
window, so the dialog stated a fact it did not have - the class I measured in L062 and fixed in D066's F11/F12 dialog.
It now asks Get-RunningNotice: a ghost gets *"a Consonance with NO WINDOW (pid N) ... There is no window to close. End
consonance.exe in Task Manager"*, a windowed app gets its original dialog word for word (R2), and **a ghost the pull
already named is not named a second time in the same click** (R1). The branch's own decision - do not build, do not
open a second copy, exit - is unchanged. Its gate is still `Get-Process -Name`; only the dialog moved.

**:418, dream-at-close (now :517) - DELIBERATELY NOT under the rule**, and the file now says why at the line: any consonance.exe,
windowless or not, trips the dream runner's own live-session guard, so standing down is what the runner would do
anyway; and a dialog after the keeper has closed the app is noise nobody is watching for.

**Found while reading, NOT fixed, not mine:** the up-to-date branch (`launch.ps1:358-362` in the changed file, "open immediately") starts
the exe without asking whether a Consonance runs. The app's own single-instance guard (`main.rs:6467`
claim_single_instance) refuses the second copy - correctly - with `warn_second_instance` (`main.rs:6507`), whose
text says *"Use the window you already have."* **For a ghost that is false in the same way :276 was.** With a ghost
and an up-to-date exe, the keeper now sees my dialog naming the pid, then the app's dialog telling him to use a window
that does not exist. The fix is one text change in main.rs, outside this packet; it needs a rebuild to reach anyone.

## 4 · THE FIXTURE — D066's 20 cases re-run, 11 new ones

node scratchpad/pull/fixture.js <launch.ps1 under test>        31 cases, each in its own powershell.exe

Every case asserts the launcher continued, nothing escaped, at most one Notify, the expected Notify count, the
environment restored; most also assert HEAD and the working files byte-for-byte. **Every new case has origin AHEAD
and a clean tree, so a pull WOULD happen if the guard let it: HEAD moving proves the guard failed.**

    G1  a WINDOWED app                                       skip quietly            notify 0   HEAD same
    G2  WINDOWLESS, past the grace, stays windowless         ONE Notify naming 5102  notify 1   10,160 ms
    G3  WINDOWLESS, under the grace (just started)           skip quietly, no wait   notify 0       47 ms
    G4  windowless past the grace, EXITS during the wait     the pull runs after all notify 0   HEAD = origin
    G5  windowless past the grace, PAINTS during the wait    skip quietly            notify 0    3,081 ms
    G6  one windowed + one windowless                        skip quietly            notify 0
    G7  the process probe itself fails                       ONE Notify "Could not tell"   HEAD same
    G8  windowless, age UNREADABLE                           ONE Notify naming 5108  notify 1   10,168 ms
    R1  rebuild dialog after the pull named the ghost        says nothing (not twice)
    R2  rebuild dialog, windowed app                         the original dialog, unchanged
    R3  rebuild dialog, ghost not yet named                  "a Consonance with no window is running"

**RED FIRST, on the launcher as it stands** (base = the repo file, 4f3042697a27...), and on the change:

    base    24 of 31   fails G2 G4 G7 G8 R1 R2 R3
    ghost   31 of 31   (D066's 20 all still pass)

What the base's reds are, in words: G2 and G8 skip the pull **silently** - the defect; G4 never pulls after a ghost
exits; R1-R3 have no notion of a ghost. **And G7 is a second defect the old probe had and nobody had named:** a named,
silenced `Get-Process` that fails reads as "nothing running", and the base **pulled under it** - HEAD moved. That red
rests on a modelled failure (§7), not an observed one.

**The process table is a stub, and it is stubbed as a TABLE** - every call shape sees the same processes, a
`notepad` is always present so a probe that forgets to filter by name is caught, ages come from `StartTime`, and an
unreadable age is a property that throws. Processes can exit or paint after N probes.

## 5 · MUTANTS

node scratchpad/pull/mutants-ghost.js <launch.ps1>     each on a FRESH copy, the WHOLE 31-case suite each time;
                                                           an unparseable mutant is INVALID, never caught

    D066's eleven, re-run on the new text
    caught  M1   Start-Process -PassThru instead of [Process]::Start       by C1 C2 C3 F8
    caught  M2   no fetch ceiling                                          by F4
    caught  M3   timeout does not kill the fetch tree                      by F4 (F4b's red is F4's orphan - shared port)
    caught  M4   ff-only becomes a real merge                              by F6
    caught  M5   ahead + dirty no longer refused                           by C4b
    caught  M6   no running-app guard (holder always "none")               by F7 G1 G2 G5 ...
    caught  M7   never pulls                                               by C3 C4 C4b F6
    caught  M8   pulls on any branch                                       by F5 F5b
    caught  M9   no-prompt env on THIS process                             by C1 C2 C3 C4
    caught  M10  the catch no longer catches                               by F13 only
    caught  M11  the dialog guesses a cause                                by F11 F12

    D072, the ghost
    caught  X1   THE ORIGINAL DEFECT: a ghost is skipped silently          by G2 G8 R1 R3
    caught  X2   no startup grace                                          by G3
    caught  X3   no wait: a closing app reads as a ghost                   by G2 G4 G5 G8
    caught  X4   "cannot tell" becomes "none"                              by G7
    caught  X5   the probe goes back to a named, silenced Get-Process      by G7
    caught  X6   the probe forgets to filter by name                       by C3 C4 C4b F1
    caught  X7   a window no longer counts                                 by F7 G1 G5 G6
    caught  X8   the rebuild dialog names a ghost twice                    by R1
    caught  X9   the rebuild dialog tells a ghost "the window you have"    by R1 R3
    caught  X10  an unreadable age resolves quiet                          by G8
    NOT APPLIED  X11  control: an anchor that is not in the file

    22 mutants: 21 caught, 0 SURVIVED, 1 NOT APPLIED, 0 INVALID

**M6's anchor had to move**: D066's M6 attacked `if (Get-Process -Name 'consonance' ...)`, which no longer exists in the
block; the new M6 attacks the same property ("no running-app guard") at the new seam, and every anchor was checked to
match exactly once before the run (21 of 21, and the control 0). **X3 is the one I would keep if I could keep one:**
removing the 10 s re-look breaks G4 as well as G2, so the wait is load-bearing, not decoration - without it, closing
the app and clicking the shortcut would never pull.

## 6 · ONCE ON D

**The probe against D's real process table** (`scratchpad/ghost/probe-real.ps1`, the block's own functions
extracted from the ghost text):

    consonance.exe processes: 1
      pid 18840  window True  age 47,523 s      -> holder state: windowed
    cross-check: tasklist lists exactly one consonance.exe, pid 18840

**The whole block, once, on D's real checkout** (`scratchpad/pull/on-d.sh`; its second run refuses if origin is
ahead, so it cannot fast-forward the shared tree under other seats):

    D:  main · HEAD 7d0ced2 · behind 0 · 3 tracked files dirty - all C's (chain-status.js, chain-status.test.js, map/C.md)
    run 1  REAL process table        "windowed" -> console line, quiet     56 ms  notify 0  HEAD same
    run 2  table stubbed to empty    real https fetch, then "already current; tracked files have local changes"
                                                                          455 ms  notify 0  HEAD same

**Cost on every launch**, measured on D with 299 processes running, 10 runs each:

    old  Get-Process -Name 'consonance' -ErrorAction SilentlyContinue              median 1.8 ms  max 23.5 ms
    new  @(Get-Process -ErrorAction Stop | Where-Object { ProcessName -eq ... })   median 3.8 ms  max 19.5 ms

**The ghost path was not exercised on D** - there is no ghost here, and I did not make one (§8).

## 7 · CORRECTIONS, INCLUDING TO MYSELF

- **The fixture's process stub lied twice more before it told the truth.** (1) It answered only `Get-Process -Name
  consonance`; the new probe asks with no name, the stub returned nothing, and F7 - "Consonance is running" - **pulled**.
  The fixture caught it; the stub was wrong. It now models a table. (2) PowerShell 5.1's `ConvertFrom-Json` emits a JSON
  array as ONE object; my `@(...)` then held one element that WAS the array. One process worked by accident (`[int]` of a
  one-element array succeeds); two processes (G6) threw inside the stub - **on both variants**, which I first read as a
  real red on the base. Unrolled with `ForEach-Object`, both variants re-run from scratch; **every number above is from
  the corrected harness.** (The ghost version turned the stub's throw into "cannot tell" + one Notify - its fail-loud
  path working, on my error.)
- **G7's base red rests on a modelled failure.** A real `Get-Process` failure is rare and I could not produce one, so
  the stub models PowerShell's semantics: a caller that asked `-ErrorAction SilentlyContinue` gets an empty list, one
  that did not gets the error. That is what makes X5 (the old named, silenced call) catchable at all. **If a real
  failure behaves differently, G7 and X5 prove less than they appear to.**
- **My first X1 mutant opened a brace it never closed** - it would not have parsed, and would have read as caught, which
  is D066's M10 mistake exactly. Caught by reading the list before running it; X1 now comments the dialog out.
- **A `§` got into the launcher** through my comment text. `launch.ps1` is pure ASCII (PowerShell 5.1 reads a BOM-less
  file as ANSI), so it is now "section 3". The landed file is re-checked below: 0 non-ASCII, 0 control bytes.
- **Bash ate escapes in my scratch scripts twice more** (a JS string, a PowerShell parse call). Each was caught by a
  syntax check before a run relied on it, and fixed through the editor.

## 8 · WHAT I DID NOT VERIFY

- **No real ghost.** I did not create a windowless consonance.exe on D: Consonance is live here and hosts the seats,
  and the only honest way to make one is to crash it. Every ghost case is the stubbed table. The live check above
  covers the windowed path and the probe's real shape, not the ghost path.
- **A MINIMIZED window.** .NET's `MainWindowHandle` sees visible top-level windows; a minimized window is still visible in
  that sense, so it should read as windowed. **Not measured** - it would mean minimizing the keeper's live app. The app
  never hides its own window: no tray, no `hide()` or `set_visible(false)` in main.rs or the UI, and tauri.conf.json's one
  window has the default `visible: true`.
- **The 10 s re-look against a real close.** It is sized from stick-apply.js's measured 5 s seat-kill bound, not from a
  close I timed. An app still tearing down after 10 s would get a false "no window" dialog.
- **Age vs continuity.** stick-apply.js measures 30 s of CONTINUOUS windowlessness; I use age plus windowless-now plus the
  re-look. An app past 30 s old that loses its window and then gets it back after more than 10 s would be called a
  ghost; stick-apply's rule would wait longer.
- **Two dialogs with a ghost and an up-to-date exe** (§3): mine, then main.rs's false "use the window you already have".
  Not fixed; main.rs is not mine and needs a rebuild.
- **Nothing ran on L.** The whole launcher was not run end to end; the block was extracted verbatim.
- **The dialogs were never rendered** - Notify is stubbed and read as strings.
