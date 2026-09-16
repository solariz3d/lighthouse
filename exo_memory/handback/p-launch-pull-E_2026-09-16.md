# P-LAUNCH-PULL (D066, chunk 1) — built, proven, landed dirty, and ONE line of the bar is not met as written

**ECHO, on D (DESKTOP-EEGVFMT), 2026-09-16 ~09:0x–09:5x.** Packet: `loop/plan_cleanup_chunks_2026-09-16.md` (19a7463),
row E, read at source. Built from A's held hand-back (`handback/p-launch-pull-A_2026-09-16.md`); A's scratch copies
are on L and were not used. **My file only: `consonance/launch.ps1`. Nothing committed.**

## 0 · THE ANSWER FIRST — including the one place I did not do what the bar says

**The pull block is in `consonance/launch.ps1`, uncommitted, 129 lines inserted and 0 removed, placed after the
launcher mutex and immediately before the rebuild check.** It is byte-identical to the text every test below ran
against:

    base I built on   sha256 6f25ad38986e1ae1d791cef2ce6c44b3e0f44f11d3c110def64f80800c34767f   (= HEAD's file)
    landed            sha256 4f3042697a27f926d6973eb6f2b33c30fc0cf80cb0e9f239db21de9ca4f9baec   (= the tested text)

    fixtures   20 of 20 cases pass, on real git repos with a real bare origin, each in its own powershell.exe
    mutants    12 applied: 11 caught · 0 SURVIVED · 1 NOT APPLIED (the control); each names the case that caught it
    on D       real checkout, real https origin: correct on both paths it could reach, HEAD unchanged

**THE DEVIATION, and it needs a ruling rather than a review.** The bar's first line is *"call git DIRECTLY and read
`$LASTEXITCODE`."* Every git call in the block does — **except the fetch**, and a measurement forced it. Against a
local server that accepts TCP and never answers (a hotel network's worst case), on D, git 2.40:

    http  + http.lowSpeedTime=15   git aborted at 15.4 s
    https + http.lowSpeedTime=15   git STILL WAITING at 100 s, killed by the probe
    http  with no config           git STILL WAITING at 100 s, killed by the probe

**Git's low-speed limit does not cover a stalled TLS handshake, and origin is `https://github.com`.** A direct fetch
can hold the launcher — and so the app — closed with no bound I could find. The bar's own stake says *"Prove that no
case can stop the launcher."* **Those two lines conflict here. I kept the stake.** The fetch alone runs as a child
with a hard 20 s ceiling; everything else is direct. §6 says exactly what a "direct only" ruling would cost.

**The same fixture suite, run against all three variants, is the evidence for that choice:**

| variant | cases | what decides it |
|---|---:|---|
| the launcher as it ships (no pull) | 5 / 19 | C3 fails: it never pulls. The 5 passes are the cases that expect a no-op |
| the block with a DIRECT fetch, as the bar reads | 16 / 19 | **F4 (https stall) HUNG** to the 150 s watchdog; F11/F12 dialog states a cause that is false |
| the block with a BOUNDED fetch (landed) | 19 / 19, then 20 / 20 with F13 | F4 stopped at 20.1 s; no git process left behind |

## 1 · A'S DEFECT — explained rather than located, and my first explanation of it was half wrong

A's hand-back named the defect correctly (the wrapper, not git) and could not say why. **Measured on D against
`cmd.exe` with a KNOWN exit code, so git was not a variable:**

    probe 1 - handle touched IMMEDIATELY after Start-Process -PassThru      ExitCode correct (0 and 3)
              handle never touched                                          ExitCode $null   (0 and 3)

**I first read that as "touch the handle and it works", and wrote that into the block's comment.** The mutant
harness disagreed: removing the handle line from my block broke nothing (M1 SURVIVED). So I probed again, this time
giving the child 300 ms to exit before anything touched it, five runs per combination:

    probe 2   Start-Process -PassThru   ExitCode correct 0/5 in EVERY combination (handle touched or not,
                                        second WaitForExit or not) - $null each time
              [Process]::Start          ExitCode correct 5/5 in every combination

**The truth:** `Start-Process -PassThru` returns an object that can only report an exit code if its handle was
obtained while the process was still alive. Probe 1 touched it before `cmd.exe` exited and won a race. **A fast
failure — an unresolvable host exits in well under 100 ms — loses that race.** A never touched it at all, so every
run read `$null`, and `$null -ne 0` is `$true`: the failure branch, every time, while git exited 0.
**`[Process]::Start` holds the handle from creation and has no race to lose. That is the fix, not the handle.** The
dead line is removed and the block's comment states the measured mechanism. The replacement M1 — `Start-Process
-PassThru` put back — is caught by C1, C2, C3 and F8: A's exact symptom, reproduced.

## 2 · WHAT THE BLOCK DOES, and what I ruled where the bar was silent

In order, every path ending in `return`, the whole body in one `try/catch`, no `exit` anywhere:

    Consonance already running   -> touch nothing (console line)
    git not found / not a checkout -> one Notify
    not on main (branch/detached) -> touch nothing (console line)
    tracked files dirty?         -> recorded (git status --porcelain --untracked-files=no)
    fetch                        -> child process, 20 s ceiling, tree-killed on timeout; failure -> one Notify
    origin not ahead             -> nothing to pull; if dirty, a console notice
    origin ahead AND dirty       -> NEVER merge. One Notify: this is the stale build the feature exists to prevent
    origin ahead AND clean       -> merge --ff-only. Anything git refuses -> one Notify QUOTING git's own reason

**Four rulings, each with the line I ruled from:**

1. **"skip with notice" (case 2) is a console line, not a dialog.** The bar separates *"skip with notice"* from *"one
   Notify line on any failure"*. When origin is not ahead nothing was withheld, so there is no failure to report —
   and a dialog on every launch of a dirty machine (A: *"the state L is in most nights"*) would be noise.
2. **Case 4 (ahead + dirty) DOES raise a Notify.** From the keeper's own sentence: the whole ask is not getting the
   old build unknowingly. A skipped pull when there is something to pull is that failure, and he should see why.
3. **The block does nothing if Consonance is already running.** Not in the bar. Ruled from `launch.ps1:147-158`,
   which already refuses to rebuild while the exe is locked: pulling then changes files under a live session's
   seats and buys nothing this launch. **B should say whether that is too cautious.**
4. **The no-prompt variables go on the FETCH CHILD's environment only**, never on this process. `launch.vbs` runs
   the launcher hidden, so a credential prompt would wait forever; but the app is started FROM this process, and
   setting them process-wide would leave every pane with a git that can never ask for a password. Held by M9.

**The F11/F12 dialog fix, found by the suite rather than planned.** The first version said *"this checkout cannot
fast-forward (it has commits of its own)"* for every refusal. An untracked local file in the way (F11) and a stale
`index.lock` (F12) are not that. **The dialog asserted a cause it did not have** — the same class as the forced-hold
row I measured in L062. It now quotes the first line of git's own message. Held by M11.

## 3 · THE FIXTURE SUITE — `scratchpad/pull/fixture.js`, 20 cases

The block is **extracted verbatim** from the `launch.ps1` under test between its BEGIN/END markers and dot-sourced in
a fresh `powershell.exe` per case, under a 150 s watchdog. `Notify` is stubbed to record calls. **Every case asserts**:
the line after the block ran (the launcher continued), no exception escaped, at most one Notify, the expected
Notify count, and the environment restored. Most also assert HEAD and the working files byte-for-byte.

    C1   clean, origin not ahead -> silent no-op                         186 ms  notify 0   HEAD same
    C2   dirty tracked file, origin not ahead -> skip                    175 ms  notify 0   files same
    C3   clean, origin ahead -> fast-forward                             266 ms  notify 0   HEAD = origin
    C4   origin ahead AND the SAME file dirty -> skip, never merge       224 ms  notify 1   files same
    C4b  origin ahead AND a DIFFERENT file dirty -> skip                 236 ms  notify 1   files same
    F1   git not on PATH                                                  87 ms  notify 1
    F2   not a git checkout                                               35 ms  notify 1
    F3   origin host does not resolve                                    129 ms  notify 1
    F4   origin accepts TCP, never answers (HTTPS) - the hang case    20,133 ms  notify 1   no git left running
    F4b  origin accepts TCP, never answers (HTTP)                     15,486 ms  notify 1
    F5   on another branch, origin ahead -> not pulled                    37 ms  notify 0   HEAD same
    F5b  detached HEAD, origin ahead -> not pulled                        37 ms  notify 0   HEAD same
    F6   diverged (local commit + origin commit) -> refused, no merge    249 ms  notify 1   HEAD same
    F7   Consonance running, origin ahead -> checkout untouched           11 ms  notify 0   HEAD same
    F8   caller's ErrorActionPreference = Stop -> still fast-forwards    270 ms  notify 0   HEAD = origin
    F8b  caller's EAP = Stop, fetch writes stderr                        134 ms  notify 1
    F10  no origin remote                                                119 ms  notify 1
    F11  origin adds a file present UNTRACKED locally -> refused         255 ms  notify 1   local file kept
    F12  a stale .git/index.lock -> refused                              246 ms  notify 1
    F13  an exception thrown INSIDE the block body -> contained          269 ms  notify 1   launcher continued
    20 of 20. Hung: 0. The longest normal case is under 300 ms; the two stalls are the ceilings doing their job.

**One more property, measured separately because a pull can rewrite the launcher itself:** a script that overwrites
its own file mid-run still executes the text PowerShell parsed at start (`scratchpad/pull/selfrewrite.ps1`). A pull
that changes `launch.ps1` takes effect on the NEXT launch and cannot corrupt the one in progress. Measured on a toy
script, not on `launch.ps1`.

## 4 · ONCE ON D — real checkout, real `https://github.com` origin

**Consonance is running on D** (pid 15380, it hosts this seat), so the honest run is two runs: `scratchpad/pull/on-d.sh`.
Run 2 has a gate: it refuses if origin is ahead, so it cannot fast-forward the shared checkout under other seats.

    D at the time:  branch main · HEAD d259e21 · behind 0 · 2 local commits unpushed · 4 tracked files dirty

    run 1  REAL process table           "Consonance is running - not touching the checkout."   22 ms  notify 0  HEAD same
    run 2  table stubbed to not-running  real fetch over https, then case 2 ("already current;
                                         tracked files have local changes")                    443 ms  notify 0  HEAD same

Three real fetches from D to GitHub took **376, 375 and 396 ms**, so the 20 s ceiling is about fifty times normal.

**What D did NOT exercise, and why:** case 1 needs a clean tree, and D's four dirty files are three of A's in-flight
chunk-1 files (`dev/stick-apply.js`, `dev/stick-apply.test.js`, `exo_memory/map/A.md`) plus this one. Cases 3 and 4
need origin ahead, and case 3 would fast-forward the shared checkout during a lap. **Those three are proven on the
fixture only.**

## 5 · MUTANTS — `scratchpad/pull/mutants.js`, each on a fresh copy of the landed text, whole suite each time

    caught       M1   Start-Process -PassThru instead of [Process]::Start   by C1, C2, C3, F8
    caught       M2   no fetch ceiling (wait forever)                       by F4
    caught       M3   timeout does not kill the fetch tree                  by F4  (its F4b red is contamination - §7)
    caught       M4   ff-only becomes a real merge                          by F6
    caught       M5   ahead + dirty no longer refused                       by C4b
    caught       M6   no running-app guard                                  by F7
    caught       M7   never pulls                                           by C3, C4, C4b, F6
    caught       M8   pulls on any branch                                   by F5, F5b
    caught       M9   no-prompt env set on THIS process                     by C1, C2, C3, C4 (env not restored)
    caught       M10  the catch no longer catches                           by F13 ONLY
    caught       M11  the dialog guesses a cause instead of quoting git     by F11, F12
    NOT APPLIED  M12  control: an anchor that is not in the file
    11 caught · 0 SURVIVED · 1 NOT APPLIED

**Two things about that table that were not true on the first pass (§7):** M1 survived, and M10 was "caught" by a
syntax error. Both are fixed, and the harness now refuses by name any mutant that does not parse.

**Worth noticing:** M5 is caught by C4b and NOT by C4. With the same file dirty on both sides, git's own `--ff-only`
refuses to overwrite the local change, so C4 stays safe even without the block's check. **Only a dirty file that git
would NOT protect proves the check exists** — which is why C4b is in the suite.

## 6 · IF THE RULING IS "DIRECT ONLY"

The direct-fetch text exists and is tested: `scratchpad/pull/launch.new.ps1`, 16 of 19. **It hangs on an HTTPS
stall** (F4, killed by the watchdog at 150 s; the probe waited 100 s with no exit). If the room wants it anyway, the
honest label is: *the app will not open on a network that accepts a TCP connection to GitHub and then stalls the TLS
handshake, until git gives up by itself*, and I found no git configuration that bounds that. I would not recommend
it. The rest of that text is sound, and its F11/F12 dialog defect is fixed in the landed version.

**Untested alternatives, named so nobody assumes they were ruled out:** `-c http.sslBackend=openssl` (whether the
low-speed limit then covers the handshake); a curl connect timeout, if git exposes one I did not find.

## 7 · CORRECTIONS, INCLUDING SIX TO MYSELF

- **My first fixture run tested nothing it claimed to.** I left the process table real, Consonance was genuinely
  running on D, and the block's running-guard fired in all 19 cases in about 25 ms. **Five "passed" because they
  happened to expect a no-op.** The process table is now stubbed in every case, and the comment in `runcase.ps1`
  says why.
- **F4 and F4b, "the hang cases", first passed in 113 ms without testing a hang.** `console.log` of a number emits ANSI
  colour codes in this environment (`ESC-[33m53792ESC-[39m`), so the blackhole's port parsed as `NaN` and git was
  handed a malformed URL that fails instantly. The server now writes a plain string, and the harness throws if the
  port is not an integer. **Every hang number in this document comes from the corrected run.**
- **My first explanation of A's defect was half wrong** (§1), and I had already written it into the block as a
  comment asserting a false mechanism. M1 surviving is what caught it.
- **The first M10 did not parse**, so it failed every case in 11 s and read as caught. Rewritten as a typed catch
  that parses and catches nothing the block throws; now caught by F13 only. `mutants.js` now reports an unparseable
  mutant as INVALID, verified to read 1 error on the broken file and 0 on the good one before I trusted it.
- **M3's F4b red is not an independent catch.** F4 and F4b share one blackhole port, so the git that M3 fails to
  kill in F4 is still alive when F4b checks for orphans. Attributed to F4.
- **Escape layers bit three times, and one of them landed in this file.** Bash stripped the `$` variables out of the
  mutant harness's parse gate (it would have marked every mutant INVALID); bash turned the two-character newline escape in
  F13's fixture string into a real line break; and the editor tool's own JSON encoding turned a literal `\u001b`
  that I typed into THIS hand-back into two real ESC control bytes. The first two were caught by a syntax check before
  a run relied on them; the third by scanning this file for control bytes after writing it (2 found, now 0). Same class
  as the NUL bytes I wrote into my own hand-backs yesterday: **the escape layer you did not think about is the one
  that bites, and only reading back what landed catches it.**

## 8 · WHAT I DID NOT VERIFY

- **No real bad network.** The blackhole is a local server that accepts and never answers. A captive portal, a DNS
  server that hangs rather than failing, or packet loss mid-transfer were not tested. The 20 s ceiling bounds all of
  them by construction — the child is killed — but that is argued, not observed for those specific shapes.
- **The 20 s ceiling has a cost:** a slow but working network that needs more than 20 s to fetch will open the older
  build with a dialog saying so. The ceiling was chosen against three fetches on D, not tuned.
- **Nothing ran on L**, which is the machine the keeper travels with and is dirty most nights.
- **The whole launcher was not run end to end** — no cargo, no rebuild, no app start. The block was run extracted
  verbatim. Its placement after the mutex and before the rebuild check is argued from reading, not executed.
- **One weak path, read and not tested:** `$LASTEXITCODE` is not reset when a native command fails to START. If
  `git.exe` is found by `Get-Command` and then cannot launch, `$LASTEXITCODE` still holds `cargo metadata`'s code
  from `:92`, and the block takes the "not on main" console path with an empty branch name. It touches nothing, so it
  is safe; the console line would be misworded.
- **No private remote requiring credentials.** The no-prompt variables are set; that git then refuses rather than
  prompting was not exercised.
- **The dialogs were never rendered.** `Notify` was stubbed; their wording was read in the recorded strings only.
- **Concurrent launches were not tested.** The block runs inside the existing mutex, so a second click should wait
  or be refused as today; not exercised.
- **`post-merge` hooks** run on a fast-forward. I did not check whether either machine has one.
- **Found in passing, not this packet:** my own map, `exo_memory/map/E.md` line 988 (an L058b entry), holds one raw
  BACKSPACE byte (0x08), present at HEAD. Same class as chunk 2 (B, P-NUL-REPAIRS); left for that sweep rather than edited
  here. My append today adds no control bytes (checked after writing).
