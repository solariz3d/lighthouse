# P-STICK-BUILD (L059) · ALPHA — §6 STOP: §2 and §3 cannot be built as written. Measured, not argued.

**Pane A, machine L, 2026-09-14 ~02:45. This is the §6 ring, filed BEFORE the rest of the work, because the
other half hinges on what it says. Nothing committed. Nothing with `--apply` against the real stick. No shared
section was edited.**

**What proceeds and what stops:**

    STOPPED   dev/stick-apply.js (§2)            hinges on defect 1 and defect 3
    STOPPED   --verify-set, the MANIFEST, the generated HANDOFF (§3)     hinges on defect 2
    STOPPED   the exit waiter (Call 2)           hinges on defect 3, and on §3 for what it writes
    PROCEEDS  the mutation harness writes into a COPY (§5)     hinges on nothing shared — appended below when done

Every figure below comes from the real `dev/tail-carry.js` at `59e65f6`, run against temp-dir fixtures only.
Scripts, re-runnable: `…\scratchpad\shared_audit.js` and `…\scratchpad\race_audit.js`
(`C:\Users\zackn\AppData\Local\Temp\claude\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\scratchpad\`).

---

## DEFECT 1 · §2 — the applier's command cannot carry what the keeper confirmed

§2 fixes the applier's command: `node dev/tail-carry.js --stick <path> --import --json --apply`. **It has no
way to receive a decision.** Ruling 1 (E §4.3, kept by the chair) retires a pane whose far copy is a different
conversation automatically, and a launch-born fixed seat likewise — and **a retirement only happens when
`--retire-far <sid>` is on the command line.** The window shows it, the keeper confirms it, and the applier
cannot do it.

    rehearsal on the arriving machine:        REFUSED  OTHER_CONVERSATION  retirable=true  kind=pane
    §2's applier command, verbatim:           REFUSED  code 1   written: false
    the relaunched app re-rehearses:          REFUSED  OTHER_CONVERSATION   — the setup window shows the same seat
    the same command with --retire-far <sid>: RETIRE_THEN_FULL  code 0  carried: true

**That is a loop with no exit on the commonest arrival case** — E measured "a fresh wake under the old id" as the
usual cause of exactly this refusal. Confirm → exit → apply refuses → relaunch → the same window → confirm.

**What would make it buildable** (a proposal for the ruling, not an edit): the handshake carries the decision —
`node dev/stick-apply.js --stick <path> --relaunch <exe> [--retire-far <sid>]... [--repair <sid>]...` — and the
applier forwards exactly those names and decides nothing. The alternative, the applier re-deciding Ruling 1 on
its own, puts one rule in two processes and lets the hidden one act on something the window never showed.

## DEFECT 2 · §3 — every successful import breaks the MANIFEST, so the golden path withholds seats

§3: *"A volume IS the stick ⇔ MANIFEST.json exists AND every member it names exists with its bytes and sha256"*,
and the MANIFEST is *"written by Leave"*. **`ledger.json` is a member, and the import rewrites it** — the agreed
state advances and the pending tail clears:

    ledger.json sha256 at export (what Leave records):  f70979ce1f21…
    ledger.json sha256 after a successful import:       fa92030905c3…     CHANGED

So after **every successful arrival**, the relaunched app's Arrive runs `--verify-set` and gets a mismatched
member — and E's bar is *"a stick whose MANIFEST has a missing member withholds seats and names the member."*
**The success path produces the failure screen**, and it stays that way for the whole working session until the
next Leave rewrites the MANIFEST.

**Two smaller holes in the same section, named so a re-rule can close them in one pass:** the verifier's output
has no way to say *"an older stick layout"* (the shape is `{code, stick, missing, mismatched, extra}` and no code
is assigned a meaning); and `extra` is undefined — since tails are kept, never deleted, every tail from every past
carry would be "extra" forever.

**What would make it buildable:** the MANIFEST describes the stick as it IS, not as the last export left it — so
**whichever process writes the ledger rewrites the MANIFEST in the same step**, the import included.

## DEFECT 3 · Call 2 × §2 — the waiter started at launch races the applier on the ledger, and wedges a seat for good

Call 2 starts the exit waiter when the app starts; §2 has the app exit to hand off to the applier. **The waiter
cannot tell that exit from a close,** so it exports on the same machine at the same moment the applier imports —
two read-modify-write writers of one `ledger.json`. Interleaved deterministically through the real module
functions (the waiter plans, the applier imports, the waiter writes):

    waiter plans on L:                 X = REFUSED (unimported tail)   Y = TAIL
    applier imports X:                 ok   — ledger: X pending = false
    waiter writes the ledger it read:  X pending = TRUE again  (the import's advance is lost)
    L re-rehearses the import of X:    ALREADY_APPLIED
    L exports X:                       REFUSED  UNIMPORTED_TAIL

**That is not a transient race; it is a permanent wedge.** `ALREADY_APPLIED` does not clear a pending tail, and
an export refuses over one, so **no later turn in seat X on this machine ever reaches the other machine** — and
every rehearsal reads clean.

**What would make it buildable:** (a) a real lock on the stick's ledger across processes — `wx`-created, held for
read-plan-write — not a convention about who runs when; and (b) the waiter stands down while
`stick-apply.started.json` exists. **Also undefined, and the other half hinges on it:** who starts the waiter, and
with what command. §2 defines one handshake (app ↔ applier); the waiter needs a second, and neither section has it.

**A latent defect in my own file that defect 3 exposed**, carried into the re-rule rather than fixed mid-stop: an
import that finds a tail `ALREADY_APPLIED` should advance the agreed state and clear the pending record. Today it
writes nothing, so **any** lost ledger update wedges the seat, whatever caused it.

## CHECKED AND NOT A DEFECT

**Does a process the app starts outlive the app?** A job object with kill-on-close would take the applier down
with the app it waits on. Measured on L with `IsProcessInJob`: the running `consonance.exe` (pid 23900) is **not in
a job**, so a plain child survives its exit. **Not checked on D.**

**The chair's question in Call 1 — is "the next launch is correct by construction" enough when the applier is
hard-killed?** **Not yet, and defect 3 is why.** It holds only if every state a killed applier can leave behind is
visible to a re-rehearsal. A stale `stick-apply.started.json` with a dead pid is, if the app checks the pid. A
half-written seat is (`INTERRUPTED`). **A lost ledger update is not** — it reads as `ALREADY_APPLIED`, clean. With
the lock in (a) and the ALREADY_APPLIED fix, I would agree.

---

*(The harness fix and the final counts are appended below when done.)*

---
---

# RESUMED at 60e1ccf — the build, against §2 and §3 as re-ruled

**All three of my stop's proposals were adopted as written, and built as written. Nothing committed. Nothing ran with
`--apply` against the real stick. No shared section was edited.** One consequence of the re-ruled §3 is named for the
chair in R6; it is buildable as written and changes nothing E parses, so it is a finding, not a second §6 stop.

    dev/tail-carry.js           A-2 manifest + HANDOFF with the ledger · A-3 ledger lock · --verify-set · E-3 · the settle
    dev/stick-apply.js    new   the applier (§2)
    dev/stick-waiter.js   new   Leave, as a waiter started at launch (Call 2, §3)
    dev/tail-carry.test.js      71 -> 106      dev/stick-apply.test.js  24 (new)      dev/stick-waiter.test.js  16 (new)
    dev/tail-carry.mutants.js   writes into a COPY (§5) · 44 -> 67 mutants

## R1 · THE HARNESS FIX — proven by a kill, with a positive control that fails first

**The defect.** The harness wrote each mutant into `tail-carry.js` and restored it in a `finally` and a SIGINT handler.
A kill runs neither. **Now each mutant goes into `dev/.tail-carry.mutant-<pid>.js`** — beside the real file, so every
relative require and the main.rs lookup resolve exactly as they do for it — and the suite is pointed at the copy through
`TAIL_CARRY_UNDER_TEST`, a named seam that refuses any file outside `dev/`. **There is no restore step, because there is
nothing to restore.**

**The proof — two arms, the same killer (`taskkill /F /T` from another process, mid-mutant):**

    CONTROL  the harness as committed at HEAD, in a throwaway git worktree (the shared checkout never touched)
             killed 46 ms into its first mutant
             tail-carry.js after: sha256 9a1acbbacb1cce01… (HEAD fe1c195df179cd8b…)   git diff: 1 file, +1 −1
             left behind: .tail-carry.mutants.lock        its finally ran: no
    PROOF    the copy-based harness, in the REAL checkout
             killed 14 423 ms in — past its green pre-flight, a mutant live in the copy
             tail-carry.js after: sha256 fe1c195df179cd8b… = HEAD                     git diff: (empty)
             left behind: .tail-carry.mutant-5224.js, .tail-carry.mutants.lock    its finally ran: no

**The control is what makes the proof worth anything:** the same instrument, the same kill, reports a live mutant in the
tracked file when the harness is the old one. Script: `…\scratchpad\killproof.js <checkout> old|new`.

**Recovery, on real runs, four times:** each next run printed *"taking over a lock left by pid N, which is not running
(a killed run)"* and *"swept a copy left by killed run pid N"* — for 5224 (the proof), and for 29116, 4560 and 17612, three
runs I killed on purpose: the first would have outlived its tool timeout, the other two were superseded by changes to the
file they were measuring (the advance, then b258fc2). The three killed runs had reached 8, 24 and 30 mutants, with no
survivor and nothing unapplied in any; none is counted, because each measured a file that no longer exists.
**A lock is taken over only when its pid is dead, and only after the tripwire re-checks the tracked source against every
mutant.**

**Three more fixes rode in, each from a defect that bit this lap:** mutants are applied with a FUNCTION replacement (a
string replacement expands `` $` `` in mutant text — it corrupted my test file in L058); **a green pre-flight against an
UNMUTATED copy runs first** (a suite that is red for any other reason reads every mutant as killed — the worthless 50/50
of 09-09); and the tracked file is compared byte-for-byte at the end of every run, a change reported as another writer
and never "restored".

**The same defect, NOT fixed, named:** `dev/place-conversations.mutants.js` and `consonance/tools/close.mutants.js` are
mine and still write their tracked sources in place. `lap-row` and `state-sync` are not mine to touch.

## R2 · §2 — the applier, built as re-ruled

`node dev/stick-apply.js --stick <FOLDER> --relaunch <absolute consonance.exe> [--retire-far <sid>]... [--repair <sid>]...`

- **Writes `stick-apply.started.json` `{pid, image:"node", script:"stick-apply.js", at, stick}` before anything else** —
  a test has the carry read that file while it runs.
- **Waits for no `consonance.exe`; "cannot tell" is waited out like "running"**, never taken as closed.
- **Forwards the keeper's flags verbatim and in order, and adds nothing** — no rehearsal, no rule, one carry, always with
  `--apply`. Tested on the argv the child process actually received.
- **Writes `stick-apply.result.json`** `{code, outcome, why, rows, at, forwarded, staleHandshake, staleLock}`, removes the
  handshake, and **relaunches on every code** — a test for each of 0, 1, 2, 3, plus a carry that prints no object (code 3),
  the applier itself throwing (code 3), and a relaunch that fails (written into the result for the next launch to read).
- **E-1, the applier's half:** a live applier's handshake refuses a second applier and is left untouched; a dead pid, or a
  pid now running another image, is a stale handshake — taken over and named in the result.
- **Refusing to start writes no handshake** (bad arguments, no data dir, a live applier), so the app's 10-second wait
  sees nothing and says the transfer could not start — which is then true.

**One choice §2 does not spell out, named:** the wait for the app to exit is bounded at **10 minutes**. Past it nothing
is imported, the result says `APP_RUNNING`, and **the app is still relaunched, as §2 says for every code** — which, with
the app still up, meets its single-instance guard and its message box.

**Call 1's question — is "the next launch is correct by construction" enough when the applier is hard-killed?** **Yes —
but only with the settle fix in R3, which is why it is built.** A killed applier leaves a handshake naming a dead pid (the
app names it STALE); a half-written seat reads `INTERRUPTED`; the concurrent lost update cannot happen (the ledger lock);
and **a kill after the append but before the ledger write**, which read clean and wedged the seat at the stop, is now
settled by the next `--apply`.

## R3 · §3 — the transfer set, the verifier, the lock — and the settle

**A-2 — the one writer rewrites the manifest with the ledger.** `writeTransferSet` runs after `writeLedger` in BOTH the
export and the import, inside the lock: the ledger, then the generated `HANDOFF-<YYYY-MM-DD>.md`, then
`consonance-transfer/MANIFEST.json` **last**, so a manifest only ever names files that already hold the bytes it records.
**The defect measured at the stop, now a test:** after a successful import the manifest's sha256 for the ledger moved
with the ledger, and `--verify-set` returns code 0.

**The HANDOFF is a pure function of the ledger** — its name and every byte come from the ledger's own `at` fields, never
the clock. A test renders it twice and compares, and checks that the file on the stick equals `renderHandoff(the ledger on
the stick)`. **A guard §3 did not ask for, because the real stick needs it:** the stick holds a hand-written
`HANDOFF-2026-09-12.md`. A carry whose generated name would land on a file without the generated first line **refuses
before any seat is written** (tested: no tail, no ledger, no manifest, the typed file untouched).

**A-3 — the lock.** `consonance-tails/ledger.lock`, `wx`, `{pid, image, script, at}`, held from the ledger read that plans
an `--apply` to the last write. **Rehearsals take none.**

    a live holder of the named image                -> exit 2, outcome LEDGER_LOCKED, rows [] — nothing read, nothing written
    tasklist cannot answer about the holder         -> treated as LIVE: it never lets a second writer through
    a dead pid, or a pid now running another image  -> taken over; top-level "staleLock" names whose it was
    released on CARRIED, STOPPED and CRASHED alike  -> tested all three

**THE ADVANCE — the second half of the fix my stop named; built before the chair's b258fc2 ring ruled it, then brought
to the ruling's letter.** An import that finds a seat `ALREADY_APPLIED` under `--apply` now re-verifies the file whole and,
if it still hashes to the exporter's record, **advances the ledger under the lock exactly as a successful apply does:
pending cleared, agreed state recorded, MANIFEST rewritten in the same step — and the seat goes on the carried receipt.**
Until now it wrote nothing, so an import hard-killed between its append and its ledger write left that seat's later turns
unable to leave the machine for good (`UNIMPORTED_TAIL` on every export) while every rehearsal read clean — **and the
launch's receipt never named the seat, so a MIGRATE could retire it.**

**b258fc2, point by point:** the row says it advanced — `result.advanced: true` (and the plan's `why` no longer says
*"nothing to do"*, which was false under `--apply`); **`APPLIED_BUT_DIFFERENT` stays a refusal** — tested under `--apply`:
`REFUSED`, no result, pending kept, exit 1; **a test builds the wedged ledger, confirms a rehearsal reads it clean, and
shows ONE import heals it** — and that this machine can export the seat again afterwards; **mutants:** removing the advance
(`THE WEDGE`), advancing without re-verifying, and a row that stops saying it advanced. Eight tests on this path; a file
that changed between the plan and the apply is not advanced.

**Additive to the L058 contract:** an advanced `ALREADY_APPLIED` row now carries a `result`, and every `result` carries
`advanced` (import: true exactly when this run recorded the agreed state; export: always false).

**`--verify-set`** — `node dev/tail-carry.js --stick <FOLDER> --verify-set --json`, the ruled object plus
`tool, contract, mode, stick, why`:

    code 0  layout "manifest", every member present with its bytes and sha256      tested
    code 0  layout "older": a ledger and no MANIFEST — it IS a stick                tested, and on the real stick
    code 1  a missing member, named                                                 tested
    code 1  a mismatched member — same size, different bytes                        tested
    code 1  a member path that escapes the stick: mismatched, never followed        tested
    code 2  no marker at all; an unreadable MANIFEST                                tested
    extra   informational — an old kept tail is listed and the code stays 0          tested

**E-3.** `carriedFirstTimestamp` on every row: recorded in the ledger at a full (offset 0) export, kept across later
deltas, `null` where the ledger never recorded it. The contract gains `carriedFirstTimestamp` (row) and `staleLock` (top
level) — additive; the contract version stays 1 by the rule written beside it.

## R4 · THE WAITER — built to §3 "WHAT THE WAITER RUNS" (11d9eb5, ddf5a76), replacing my first cut

**My first cut took `--stick` and exited 2 on anything else — which, as E read it, is a failing process on every launch.
Rewritten to the ruled argv.** `ON-EXIT.ps1` is absorbed; the stick scripts are untouched and keep working.

    node dev/stick-waiter.js --data <data_dir> --app-pid <pid> --app-image consonance.exe      the app, every launch
    node dev/stick-waiter.js --view <status file>                                             the window it opens

- **No `--stick`, and `--stick` is refused** (tested). The stick is found **at the app's exit**, by §3's rule — tested
  with a stick that appears mid-session and is exported.
- **One waiter per data dir** by `<data_dir>/stick-waiter.lock`: a live holder (node) means exit at once — no probe, no
  find; a dead holder's lock is taken over and released at exit.
- **GONE = the pid is dead, or alive under another image** (E-1's pid-reuse rule, tested).
- **The wait starts no process — found by re-reading the restated bar's "EXACTLY ONE added process" against my first
  cut, which asked `tasklist` about the app every 2 s for the whole session.** Each poll now asks only whether the pid
  answers (`kill(pid, 0)`, no signal, no process). **A pid that does not answer is gone on the kernel's word alone** — a
  first version still asked `tasklist` then, which would have let a broken `tasklist` keep the waiter waiting for ever over
  a process that no longer exists (tested). While the pid answers, its image is confirmed once a minute to catch reuse;
  an image that cannot be told keeps waiting. Tested: 46 polls, one image lookup.

**At the app's exit, the ruled rules, one test each:**

    stick-apply.started.json live (node, stick-apply.js)  -> STAND DOWN: exit quietly — no find, no window, no export
    a handshake naming a dead applier                     -> not a hand-off; the exit is real
    no stick found                                        -> NO WINDOW, no export, NO STATUS FILE, no row; the data dir is
                                                             exactly as it was before the waiter started
    one stick                                             -> a window; tail-carry --export --json --apply on THAT FOLDER
                                                             (the ledger lock and the MANIFEST rewrite are inside it);
                                                             DONE / NOT DONE by name, the stopped seats listed
    more than one                                         -> a window, NOT DONE naming every folder; nothing exported
                                                             (the table's AMBIGUOUS; at exit there is no chooser, so the
                                                             keeper is told, not guessed for)

**§3's six-case table, pinned exactly** — the same six fixtures E's Rust tests, no seventh: no marker → none; MANIFEST at
the root → the root; `consonance-L-20260911/consonance-tails/ledger.json` → that folder; two first-level folders →
ambiguous, both named; root and a first-level folder → ambiguous, both named; two levels down → none. The Node finder
mirrors `sync_launch::find_stick` line for line: either marker by is-a-file, the root and its first-level directories only,
a junction or symlink not followed, unreadable entries skipped, children sorted.

**The volume list** is fixed and removable only, never a network share — E's `volume_roots` filter — asked of WMI **once, at
exit, never at launch**, so it costs the no-stick launch nothing. **Measured on L, read-only:** `C: 3 | D: 2` →
roots `C:\ D:\` in 321 ms → `findStick` → exactly one, `D:\consonance-L-20260911`, older layout, no false hit in C:\'s first
level. **Named divergence:** `sysinfo` lists mount points, WMI lists drive letters — a volume mounted into a folder with no
letter is seen by E's finder and not by mine.

**THE WINDOW — my call, as the ring left it.** The app starts the waiter detached, with no console, and a process cannot give
itself one. So at export time the waiter opens a console with `cmd /c start`, running this same file in `--view` mode on
`<data_dir>/stick-waiter.status.log`, and writes every line there; the window follows it, prints DONE or NOT DONE by name,
and **holds for Enter**. **The export never depends on the window:** if the console cannot be opened, the export runs and
the status file records why (tested). A path `cmd.exe` could misread (`" & | < > ^ %`) is refused rather than quoted around.
The window never prints a half-written line (tested).

**One thing inside my file the ruling does not say, built and named — the quick reopen.** If the keeper closes and reopens
the app inside one poll, the new launch's waiter finds this one's lock live and starts none (as ruled) — and this one, having
watched the OLD pid, would exit with the new session unwatched. So before exiting, a waiter whose app is already running
again under a new pid **adopts that pid and keeps waiting** (tested: two exports, one per session). No argv, lock rule or
exit rule changes.

## R4b · A LANDING BLOCKER THE STICK MODULE BRINGS TO D — not my file, named for the chair

**Every data-dir file the stick module creates is UNPLACED in `consonance/state-manifest.json`**, checked with that module's
own `globToRe`:

    stick-waiter.lock          UNPLACED      exists for the WHOLE of every session, stick or no stick
    stick-waiter.status.log    UNPLACED
    stick-apply.started.json   UNPLACED
    stick-apply.result.json    UNPLACED
    stick-keep.json            UNPLACED      (E's)

**`close.js` refuses `REFUSED_UNPLACED` on any such file** — that is exactly what blocked D's return leg on 09-10
(`frames.jsonl`, `grep.exe.stackdump`, …). With the waiter's lock present all session, **D's close would refuse every time
the app is open.** The holds keep L from running `close.js`, so this bites on D first. **Proposed, not applied:** five
`STAYS` rules — every one is per-machine transient state (a lock, a handshake, a result the relaunched app consumes, a status
the window follows, this machine's keep choices). The manifest is a shared carrier and not in my list.

## R5 · THE NUMBERS

    node dev/tail-carry.test.js       106 passed, 0 failed
    node dev/stick-apply.test.js       24 passed, 0 failed
    node dev/stick-waiter.test.js      33 passed, 0 failed
    node dev/tail-carry.mutants.js    67 killed · 0 survived · 0 not applied · 67 total   (final file; exit 0; the
                                      run's own end check found tail-carry.js unchanged; `ls -a dev/` after: no copy, no lock)
    node consonance/tools/js-suite.js  89 green · 6 failed · 0 crashed · 0 silent · 1 canary (of 96)   — on L, final files

**js-suite:** all four of my test files are green (`place-conversations`, `tail-carry`, `stick-apply`, `stick-waiter`).
96 files, not 93: my two new suites and E's `consonance/ui/stick.test.js`. **The two reds new since L058 are not mine** —
`gen-consumer` and `gen-consumer.fixture-scope`, whose failure names a leak in `consonance/src-tauri/src/sync_launch.rs`,
E's file, in flight this lap. The other four reds are the same four as at L058.

**Positive controls for the two new suites, on their FINAL files**, in a scratch replica so no shared file was written —
**19 mutants · 19 killed · 0 survived · 0 not applied**, each by the tests meant to own it. Applier: relaunch only on code 0
(6 red), a decision of its own (3), no handshake (1), "cannot tell" read as closed (1). Waiter: the first-level folders not
looked in (13 red — tables 3, 4, 5 and every exit test built on tonight's layout), the root not looked at (3), ambiguity
collapsed to the first folder (3), pid reuse never checked (2), the image looked up on every poll (2), a dead pid
second-guessed by tasklist (2), no stand-down (1), no stick still exporting (1), an
ambiguous stick exported (1), a failed window costing the export (1), a quick reopen not adopted (1), `LEDGER_LOCKED` not
retried (1), a live waiter's lock ignored (1), half-written lines shown (1), non-drive lines in the volume list (1). **These
two files have no committed mutation harness; the controls are the evidence, stated as that.** (An earlier control set of 8
ran against the first-cut waiter and the pre-rename applier tests; it is superseded, not counted.)

**portable-paths:** my test fixtures first used drive-letter literals. The guard fails on ANY site not in its baseline,
whatever the verdict, so 12 `BENIGN-TEST` sites would have turned it redder at landing. **Rewritten to temp-dir paths; the
guard's own classifier now finds 0 sites in my seven files.** The baseline was not touched.

**The real stick, reads only** (`D:\consonance-L-20260911`) — taken before the settle fix and **re-taken on the final file
with the same codes and 0 changed** (the byte figure below is from the first run; live seats grow between runs):

    marker at D:\                        MANIFEST no · ledger no
    marker at D:\consonance-L-20260911   MANIFEST no · ledger YES              — E-5, measured
    --verify-set D:\                     code 2 · no stick marker
    --verify-set the folder              code 0 · layout "older"
    --import rehearsal                   code 0 · NOTHING_TO_DO · 7 NOTHING_PENDING · carriedFirstTimestamp null ×7
    --export rehearsal                   code 0 · REHEARSED · 7 TAIL · 11,833,561 B would go on the stick
    40 paths watched (all of D:\, the attic, the carried receipt) · 0 changed

## R6 · FOR THE CHAIR — a consequence of the re-ruled §3, not a stop

**`carriedFirstTimestamp` will be `null` for all seven seats on the real stick, permanently.** Its ledger was written before
E-3, and every future carry of those seats is a tail, never offset 0 — so under *"taken at export when the tail starts at
offset 0"* it is never recorded, and the window's identity bar reads *unknown* for every seat for as long as this stick is
used. **The one-line alternative, not applied:** also record it at a delta export when the entry lacks it — exact, not a
guess, because by then the export has proved the source IS the agreed conversation (same key, same prefix sha). It changes
nothing E parses.

## R7 · WHAT I DID NOT VERIFY

- **Nothing ran with `--apply` against the real stick.** Every write path — the lock, the manifest, the HANDOFF, the
  settle, the applier's carry, the waiter's export — ran against fixtures. The real stick was read and snapshotted, never
  written.
- **No end-to-end run with the real app:** the handshake, the relaunch and the waiter's stand-down are tested against
  injected probes and real files, not against a live `consonance.exe` exiting and coming back.
- **The waiter's window has never been opened for real.** `cmd /c start … --view` is tested only through injection, and
  `--view` itself against a real file. Opening a console on the keeper's screen at 03:40, unasked, was not mine to do — the
  first real export is where the bar "the keeper can see it and it holds" gets its first real reading.
- **`pidImage`'s real `tasklist` parse is exercised only through injection** in these suites.
- **The job-object check (a child outliving the app) was measured on L only.** D has run none of this.
- **The transient `dev/.tail-carry.mutant-<pid>.js` and `dev/.tail-carry.mutants.lock`** show in `git status` during a run
  and after a killed one. **They must not be staged.** A `.gitignore` line would settle it; that file is not mine.
- **A correction to my own reading:** one background check reported "no leftovers" after a deliberate kill. It was wrong —
  `ls dev/ | grep` hides dotfiles; the copy and the lock were there, and the next run swept them. The clean reading after
  the first full run used an explicit dot glob and was genuine.

---
---

# §9 LANDING RULINGS (9dda062) — R-3 and R-4, both mine, both built as written

**No §6 stop: both were buildable exactly as ruled.** Nothing committed; nothing with `--apply` against the real stick.
The `.gitignore` line for the harness's transient files is the chair's at landing, as ruled.

## R-3 · five STAYS rules in `consonance/state-manifest.json` — my R4b, adopted as a blocker

The manifest was ruled into my files for these five rules only. **`state-manifest.js` and `state-sync.js` are untouched —
`git diff --stat` on all three shows `consonance/state-manifest.json | 5 +++++` and nothing else.**

Five rules, each named IN FULL rather than by a `stick-*` glob (the manifest's own history: a wildcard is what put the Third
Place tail on GitHub), each with its why, placed beside `state-sync.status.json` with the other per-machine STAYS state:

    stick-waiter.lock          STAYS  rule #64   the exit waiter's pid, present all session — the blocker itself
    stick-waiter.status.log    STAYS  rule #65   this machine's DONE / NOT DONE
    stick-apply.started.json   STAYS  rule #66   the applier's handshake: a pid on THIS machine
    stick-apply.result.json    STAYS  rule #67   this machine's import result, consumed by its relaunched app
    stick-keep.json            STAYS  rule #68   this machine's KEEP choices (E's file, placed because it lands here)

**Checked by the module's own `globToRe`, first match wins** (`…\scratchpad\placed.js`, read-only):

    BEFORE the rules   all five   UNPLACED                                      (measured in the first half of this lap)
    AFTER              all five   STAYS, at rules #64–68
    near-miss          stick-waiter.lock.bak   UNPLACED — the check can still fail; nothing wider was introduced
    classErrorsFor(the shipped manifest)       none

    node consonance/tools/state-manifest.test.js     25 passed, 0 failed     (25 / 0 before the rules)
    node consonance/tools/state-sync.test.js         75 passed, 0 failed     (75 / 0 before the rules)

**One precedent, named so the choice is visible:** `head-watch.lock` — also a lock carrying a pid — is classed REGENERATES.
The waiter's lock is STAYS as ruled, and the difference is real rather than cosmetic: the waiter takes over a dead
holder's lock itself, so there is nothing for another process to regenerate.

## R-4 · `carriedFirstTimestamp` at a DELTA export — my R6, adopted

    offset 0   the stick carries this WHOLE file  -> its first timestamp is recorded, always (unchanged)
    a delta    recorded ONLY when the entry lacks one, and never over one that is set                        (new)

**Exact, not a guess, and the code says why beside the line:** a TAIL row exists only after that export has proved the
source IS the agreed conversation — the same key, which is the sha256 of that very first timestamped record, and the same
prefix sha. **Effect on the real stick:** its ledger predates E-3, so every seat's entry lacks a first timestamp; the first
real delta export from either machine now fills all seven, and the window's identity bar stops reading *unknown*.

    test  a DELTA export fills a first timestamp the entry lacks (ledger stripped to the pre-E-3 shape; the import row carries it)
    test  a DELTA export never overwrites one that is set (a deliberately wrong set value survives the export)
    mutant  R-4 UNDONE — the delta path removed, i.e. the exact line before this change      -> must die
    mutant  R-4 broken the other way — a delta overwrites a set value                        -> must die

    node dev/tail-carry.test.js       108 passed, 0 failed
    node dev/tail-carry.mutants.js    69 killed · 0 survived · 0 not applied · 69 total   (on a COPY; exit 0; both R-4
                                      mutants and the E-3 mutant killed; stderr empty; `ls -a dev/` after: nothing left)
    node consonance/tools/js-suite.js 91 green · 4 failed · 0 crashed · 0 silent · 1 canary (of 96)   — on L, after R-3 + R-4

**js-suite moved from 89 / 6 to 91 / 4:** the two `gen-consumer` reds that named `sync_launch.rs` are gone (E's R-2), and
`state-manifest.test.js`, `state-sync.test.js` and all four of my suites are green. The four left are the long-standing
`actors.evidence`, `carrier-drift`, `forget-rate` and `portable-paths` — the same four as at L058, none naming my files.

**Not verified:** the fill on the REAL stick. It happens at the first real `--export --apply`, which is the keeper's; a
rehearsal against the real stick still shows `carriedFirstTimestamp: null` ×7, correctly, because a rehearsal writes nothing.
