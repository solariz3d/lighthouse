# P-STICK-APPLIER-ZOMBIE · ALPHA — a windowless consonance.exe ends the applier's wait in 30 s, names its pid, and imports nothing

**Pane A, machine D, 2026-09-16 09:0x–10:0x.** Lap D066, chunk 1. Packet row: `loop/plan_cleanup_chunks_2026-09-16.md`
(19a7463). **Files, both modified and uncommitted, and no others:** `dev/stick-apply.js` (+116 −13 incl. the tightenings),
`dev/stick-apply.test.js` (+165). No rebuild, no relaunch; the keeper's live Consonance (pid 15380) was probed read-only
and never touched.

> **READ THIS BEFORE THE NEXT TRANSFER ON D. THIS CODE IS ALREADY LIVE, UNREAD.** The app starts the applier from the
> CHECKOUT — `main.rs:10768`, `repo_root().join("dev").join("stick-apply.js")` — and the applier is node, so there is no
> build between this file on disk and the process that runs it. **Uncommitted is not held.** If the keeper runs a
> transfer on D before B reads this, my unread wait loop and probe are what run. That is the same exposure the chair
> ruled against for `launch.ps1` on 09-16 (held branch, not main). **The options are the chair's, not mine:** hold the
> diff off the checkout (stash it onto `held/stick-zombie-2026-09-16`) until B reads, or accept it live on the strength
> of §5. I have not moved it either way — moving another decision's files is not in my packet.

---

## 1 · THE CHOICE: REFUSE, NAMING THE PID — NOT "STALE". And it was not a close call.

**"Treat windowless as stale" cannot import even if this file wanted it to.** `dev/tail-carry.js:1137` runs its own
running-app gate (`place.consonanceRunning()`, tasklist) at import time and refuses `APP_RUNNING` while any
`consonance.exe` exists. So a STALE reading in the applier moves the refusal one process down and nothing more — **unless
the applier also told tail-carry the app was closed while a consonance.exe exists**, which is the exact harm the wait
exists to prevent, decided by a process the keeper cannot see. The applier's header already rules on that shape: *"THE
APPLIER DECIDES NOTHING (A-1)"*.

So the rule, as built: **a windowless process shortens the WAIT; it never licenses the IMPORT; this file kills nothing.**

| state the probe sees | before | now |
|---|---|---|
| no consonance.exe | carry at once | **carry at once** (unchanged) |
| a WINDOWED consonance.exe | wait up to 600 s | **wait up to 600 s** (unchanged), result names its pid |
| every consonance.exe WINDOWLESS, continuously, for 30 s | wait the full 600 s | **stop, APP_RUNNING, no import, pids named, app relaunched** |
| windowed AND windowless together | wait 600 s | **wait 600 s** — a window anywhere is the app you can see; both pids named |
| probe cannot tell (null) | wait 600 s | **wait 600 s** (unchanged) — "cannot tell" is never "windowless" |

The result carries `app: { pids, windowless, parentPid }` on every APP_RUNNING, and the pid is in the `why` sentence as
well as the field: *"Consonance (pid 5151) had no window for 30 s — it is not the app you can see, so the transfer stopped
waiting rather than wait 600 s on it. Nothing was imported. End that process (Task Manager, or: taskkill /PID 5151 /F),
then start the transfer again."*

---

## 2 · THE GRACE: 30 s, CONTINUOUS — and the state that would prove it too short

**The legitimate windowless consonance.exe is not only a slow painter, and this is the case the packet did not name.**
The applier is started by the app, which then calls `app.exit(0)` (`main.rs`, `stick_start_applier`, "exiting so it can
import"). **The applier's own parent is windowless while it tears down.** P-LEAVE bounds the seats' kill at 5 s. **30 s
is six times that**, and it has to cover the parent, not only a fresh launch.

**A slow-to-paint app is handled by continuity, not by length.** The grace counts one unbroken windowless stretch per pid;
a window resets it. An app that paints at 25 s is never refused; one that paints and then loses its window starts a new
30 s. Pinned by the SLOW TO PAINT and CONTINUOUS fixtures, and mutant #4 (cumulative grace) is caught.

**The asymmetry that makes a short grace safe:** too short costs a refused transfer the keeper retries. **It cannot cost
an import under a live app** — mutant #1 (refuse becomes stale) and tail-carry's own gate both stand in the way.

**WHAT WOULD PROVE 30 s TOO SHORT, checkable from one file:** a `stick-apply.result.json` whose `app.windowless`
contains `app.parentPid` — the applier refused its own parent while that parent was still exiting normally. The result
records both for exactly this. **Verified that `parentPid` means what it says on D:** `node` resolves to
`C:\Program Files\nodejs\node.exe`, not a shim, and a child spawned as `node` reads its spawner's pid as `ppid` (6736 =
6736). **Not verified on L.**

**What would prove it too long:** nothing this morning's case can show, because the grace is 30 s against an observed
wait of 600 s. The keeper would feel a too-long grace as a 30-s delay before a refusal they already know is coming.

---

## 3 · WHAT THIS MORNING ACTUALLY WAS, re-derived from D's `persist.log` rather than the brief

    08:38:11  STICK APPLIER started pid=9864 · 08:38:12 handshake — exiting so it can import
    08:40:29  a NEW launch: STICK APPLIER WAITING pid=9864 — the keeper opened Consonance while 9864 waited
    08:40:40  STICK CLOSE — the keeper closed it so the transfer could run
    08:48:14  next launch: STICK RESULT present — 9864 ended ~08:48:12, i.e. the FULL 600 s from 08:38:12
    08:48:45  STICK APPLIER started pid=8784 · handshake — exiting
    08:52:28  next launch: RESULT present, rehearsed quiet=true import=0 export=0 — 8784 ended early; the ghost was killed

**A correction to the packet's framing:** the chair's "WAITING 08:40:29, RESULT 08:48:14 and 08:52:28" reads as three
applier events. **08:48:14 and 08:52:28 are LAUNCHES that found a result file**, not the results' write times; the first
wait was the full 600 s and the second was cut short by the kill, not by a second 600 s.

**Three things this timeline establishes that the design depends on:**

1. **The ghost did not hold the single-instance mutex.** The keeper's launches at 08:40:29 and 08:48:14 both ran while it
   lived. So a relaunch after this refusal opens normally, for a ghost of this morning's kind. (A ghost that DID hold it
   would meet `warn_second_instance` — see §6.)
2. **Under the new code, 08:40:29–08:40:40 would still have waited**, correctly: the keeper's own windowed app sat beside
   the ghost, and a window anywhere holds the wait. From 08:40:40 the ghost alone is windowless → refused at ~08:41:10
   instead of 08:48:12. **About 7 minutes of this morning's first wait, and the whole second one.**
3. **The ghost cannot be identified now.** tasklist returned a yes/no, and nothing recorded a pid. This morning is itself
   the evidence for "name the pid either way".

---

## 4 · THE PROBE — measured on the real machine before a line was written against it

`probeConsonance()` runs one PowerShell query: every process, `-ErrorAction Stop`, filtered to `consonance`, printing
`OK <n>` then `<pid> <MainWindowHandle>` rows. Measured on D, read-only (`scratchpad/probe_measure.js`):

    consonance            exit 0, 164 ms    OK 1  ·  15380 1507894      the keeper's live app — WINDOWED
    no-such-process-zz    exit 0, 158 ms    OK 0                        absent — GONE
    node                  exit 0, 160 ms    OK 4  ·  3424 0 · 8116 0 · 14728 0 · 22560 0     real windowless processes

    node -e "require('./dev/stick-apply.js').probeConsonance()"   ->   [{"pid":15380,"alive":true,"hasWindow":true}]  167 ms

**Why that exact query:** `Get-Process -Name consonance` reports "not found" as an ERROR, and silencing it with
`SilentlyContinue` would silence a real failure into an empty list — into **gone**, the reading that lets an import run.
So no name, `-ErrorAction Stop`, filter afterwards, and the parser demands positive evidence: `OK <n>` plus exactly n
well-formed rows, or it returns null. **Gone requires proof; anything unaccounted for is "cannot tell".**

---

## 5 · BARS

    RED FIRST — the new fixtures against HEAD's applier (a temporary shim fed HEAD the same fixture world, so it never
    called the real tasklist and spun on the keeper's live app; the shim was removed before green):
      node dev/stick-apply.test.js      32 passed · 13 failed
        the 13: WINDOWLESS refused early · WINDOWED names its pid · MIXED names both · parentPid · the default grace ·
                and the 8 parser cases (those 8 are non-discriminating — the function did not exist at HEAD)
        the 5 NEW fixtures HEAD already passes are the NEGATIVE CONTROLS, green by construction: gone at first probe ·
                torn down inside the grace · SLOW TO PAINT · CONTINUOUS grace · "cannot tell". They exist to fail the new
                code if it refuses too eagerly, which is the risk the packet named.

    GREEN, after the build (every suite that loads the applier):
      node dev/stick-apply.test.js          48 passed · 0 failed      (27 at HEAD + 21 new)
      node dev/stick-waiter.test.js         74 passed · 0 failed      (it requires stick-apply.js — see §7)
      node dev/tail-carry.test.js          129 passed · 0 failed
      node dev/place-conversations.test.js  35 passed · 0 failed
      node consonance/tools/js-suite.js     95 green · 6 failed · 0 crashed · 0 silent · 1 canary (of 102) — §9

    MUTANTS, on a copy beside the source via STICK_APPLY_UNDER_TEST (scratchpad/stick-apply.mutants.js):
      13 applied · 12 killed · 1 survived · 0 NOT APPLIED · tracked files unchanged: true · copies left in dev/: 0
        killed  #1  REFUSE BECOMES STALE: a windowless ghost is read as gone, and the import runs underneath it
        killed  #2  the early refusal never fires
        killed  #3  a WINDOWED app beside a windowless one no longer holds the wait
        killed  #4  the grace becomes CUMULATIVE
        killed  #5  "cannot tell" (null) is taken as gone
        killed  #6  the pid is not named in the sentence
        killed  #7  the parent pid is not recorded
        killed  #8  the default grace shrinks to 1 s
        killed  #9  the default grace grows to the whole 600 s
        killed  #10 the parser stops checking rows against the count
        killed  #11 the parser reads every process as windowed
        killed  #12 the default probe FAILS OPEN: a runner that throws reads as gone
        SURVIVED #13 the PowerShell query silences its errors (-ErrorAction SilentlyContinue)
                     anchor: "Get-Process -ErrorAction Stop |"   became: "Get-Process -ErrorAction SilentlyContinue |"

    **#13 was planted to survive, and it is a real gap.** The fail-closed property of the PowerShell text rests on the
    measurement in §4, not on a test: proving it would mean making Get-Process itself fail on a live machine. A text
    pin on "-ErrorAction Stop" would be a TOKEN pin (L061 R1) and I did not write one. Named rather than hidden.

    The harness carries the L061 order: shape (R3) → the dirty-source check → the anchor audit (R2), so a crashed run is
    never diagnosed as an edit; a survivor prints what it became.

---

## 6 · WHAT THIS DOES NOT FIX — two findings outside my files, both from reading the path end to end

**(a) THE KEEPER NEVER SEES THE `why`. `consonance/ui/stick.js:61-72`, `renderResult`, prints `code` and `rows` — and
neither `result.why` nor `result.outcome`.** An APP_RUNNING result reaches the keeper as *"The last transfer — exit 2
(could not run)"* over an empty table. **That is what this morning's two refusals looked like**, and it is what this
change will look like too: 30 s instead of 600 s, and the pid **on disk only**. The bar "the result names the pid" is met
at the file; it does not reach the eyes until `renderResult` renders `why`. **One line in a file that is not mine, and
it is the difference between this change being visible and not.** Filed for whoever holds `consonance/ui/stick.js`.

**(b) A ghost that DOES hold the single-instance mutex meets a wrong message.** This morning's did not (§3.1). But if one
does, the applier's relaunch hits `warn_second_instance()` (`main.rs:6506`): *"Consonance is already running … Use the
window you already have."* — **there is no window.** Not reached by today's case; reachable in principle.

---

## 7 · CORRECTIONS, INCLUDING TO MYSELF

- **My first green broke another seat's guard, and my first repair of that broke it again with a comment.**
  `stick-waiter.test.js`'s SWEEP is a text scan for any call spelled `exec`+paren and demands `windowsHide: true` on
  each. My parser's two `RegExp#exec` calls tripped it (73/1). I reshaped them to `String#match` — identical for a
  non-global regex — rather than edit a test that is not mine. **The next run still failed, on my own explanatory
  comment**, which quoted the token the sweep scans for. Reworded; 74/0. **The sweep is a TEXT pin and will flag any
  regex `exec` in the four files it reads** — worth a sentence to its owner; I did not change it.
- **The windowed-anywhere guard was doubled, and would have survived its own mutant.** My first grace check ran `every()`
  over ALL pids, so for a windowed pid it compared against an `undefined` start time — `NaN >= 30000`, false — and the
  explicit "no window anywhere" guard carried nothing. Rewritten to read the grace over the windowless pids only, so the
  guard is the thing that holds. **Found by designing the mutant, before running it.** Mutant #3 is now caught.
- **The default probe's fail-closed `catch` had no test.** Added a runner seam at the boundary (`probeConsonance(run)`,
  the applier passes nothing) and three tests; mutant #12 is caught.
- **My shell patch lost its backslashes** (a `\d` became `d`) and the anchor check refused it before it wrote anything —
  the gate I built for exactly this, working on me. Redone with the edit tool.

---

## 8 · WHAT I DID NOT VERIFY

- **No end-to-end run.** No applier was started against a real ghost; a windowless consonance.exe was not manufactured on
  this machine, because the keeper's app is live on it and a stray instance is the thing being fixed.
- **The grace is argued, not measured.** Nothing on disk records how long a consonance.exe lingers after `app.exit(0)`.
  30 s rests on the 5-s seat-kill bound and on the falsifier in §2 — the first refusal naming its own parent says it was
  wrong.
- **Nothing on L.** Neither the probe's timing nor `parentPid`'s meaning was measured there.
- **`MainWindowHandle` has one known blind spot I cannot rule out from here:** a process whose only window is
  cloaked or owned rather than top-level may read 0. Consonance's main window read non-zero; a Leave screen, a dialog,
  or the setup window were not probed.
- **The PowerShell text's fail-closed property** is survivor #13 — measured once, not tested.
- **Not committed, not pushed, not rebuilt** (the applier is node; no rebuild is needed for it to take effect — the next
  transfer on D runs this file as it stands on disk).

---

## 9 · THE FULL JS SUITE — six red, and none of them is this diff

    node consonance/tools/js-suite.js
      js-suite: 95 green · 6 failed · 0 crashed · 0 silent · 1 canary · 0 sang · 0 not-run · 0 class-error  (of 102)
       ok    dev\stick-apply.test.js
       ok    dev\stick-waiter.test.js

    the 6 red:  actors.evidence · carrier-drift · forget-rate · gen-consumer · portable-paths · userprompt_pulse

**"Pre-existing" is checked, not assumed.** Each of the six was run in a clean `git worktree` at HEAD (19a7463), which
carries none of my diff: **all six exit 1 there too.** The worktree was removed afterwards (`git worktree list` shows
only the checkout). The suite's whole output mentions `stick-apply` once — its own `ok` line — and portable-paths' hits
are drive-letter literals in `sync_launch.rs` test fixtures, not in either of my files.

**What this does not say:** why those six are red. I did not open them; they are not this packet.
