# P-STICK · THE STICK AS A LAUNCH VERDICT — Arrive and Leave, inside the app. L058 (the laptop names its laps L; "D062" was typed from the desktop's numbering).

**To ECHO and ALPHA, 2026-09-14 ~01:10, on machine L. One packet, two owners, split at a subprocess
boundary. §2 is the contract you both build to — there is exactly one copy of it, here.**

## 0 · WHERE THIS COMES FROM, AND WHAT IT STANDS ON

**The keeper, verbatim** (`loop/stick_arrival_module_idea_2026-09-14.md`, which carries the design,
the prior art and the falsifiers — **read it at the file first**):

> *"lets create an attachment or module to consonance that opens first, that searches for thumbdrive
> with the certain handoff and transcripts left for the transfer … Something to make sure the transfer
> lands every time through the thumbdrive from laptop to desktop and also from desktop to laptop"*

And 01:01 tonight: *"go ahead and have the orch dispatch the stick module."*

**What it stands on, landed by the chair before this dispatch, at `9fc0a71`:** the carried receipt, built tonight on
L by a launch-born librarian seat and retired by its own restore — `tail-carry.js` writes
`~/.claude/consonance-carried.json` on import; `sync_launch.rs::read_carried` and `apply_retire` keep a
transcript whose first timestamped record matches it. **That fix is why the 00:55 launch printed
`MIGRATE SEAT main|librarian|third place KEPT (the stick placed it)` and every seat on L resumed.**
Re-derived at landing: `cargo test` 543 / 0 / 4. **This module automates the arrival that receipt
made correct. It does not replace the receipt.**

**The round trip is already complete for every seat on both machines, by hand.** `ARRIVING.ps1`,
`LEAVING.ps1` and `ON-EXIT.ps1` on the stick ARE this module, as scripts. **The job is to move them
inside the app, not to invent a new carry.**

## 1 · THE SPLIT

    ALPHA   dev/tail-carry.js      a machine-readable result the app can trust (§2), nothing else
    ECHO    sync_launch.rs, main.rs   the Arrive arm, the stick finder, the subprocess call, Leave on exit

**Why split there:** A owns the carry and its 47 tests and 28 mutants; E owns the launcher's verdicts
and the live-host design. The boundary between them is a process boundary, which is the cleanest
ownership line this repo has. **Neither of you edits the other's files.** If you need the other side
to change, say so in your hand-back.

## 2 · THE CONTRACT — both of you build to this, and only this copy of it

`tail-carry.js` already builds structured rows and throws them away as prose. **The contract is those
rows, serialized.**

> **AMENDED BY ALPHA, 2026-09-14, before ECHO builds — the block below replaces the chair's first
> draft, which is kept as a trace at the end of this section.** Three things in the draft could not
> honestly carry the contract, each checked against `dev/tail-carry.js` rather than argued:
>
> 1. **The import verdict list was wrong in both directions.** `TAIL` never occurs on import (it is an
>    export verdict), and **six real import verdicts were missing**: `APPEND`, `ALREADY_APPLIED`,
>    `INTERRUPTED`, `REPAIR`, `RETIRE_THEN_FULL`, `DIVERGED`. `DIVERGED` is the fork this whole carry
>    exists to refuse; a switch built on the draft would have met it as an unknown value.
> 2. **`REFUSED` means thirteen different things,** and the one your §3 rule forks on — *a different
>    conversation under this sid* — was only in prose. Worse, the prose could not say whether
>    `--retire-far` would work: on a delta tail it refuses AGAIN, and `ARRIVING.ps1` cannot see that
>    coming. **No new verdicts** — instead every REFUSED row carries a stable `reason`, and the
>    different-conversation one carries `retirable`.
> 3. **"The rows, serialized" cannot be literal.** The internal rows hold the carried bytes as a
>    Buffer (248 MB on the chair's first carry) and the whole ledger record, and several fields exist
>    only on some paths. The contract is a fixed projection: **every field on every row, `null` where
>    it does not apply, never absent.**

    node dev/tail-carry.js --stick <path> (--import|--export) [--apply] [--repair <sid>]... [--retire-far <sid>]... --json

    stdout:  exactly ONE line: one JSON object, then "\n", and nothing else — even on a bad argument
             (code 2) and even on an unanticipated exception (code 3)
    stderr:  everything a human would have seen; the app never parses it
    exit:    equal to "code"

    {
      "tool": "tail-carry", "contract": 1,
      "mode": "import"|"export"|null,   "apply": bool,   "machine": <tag>|null,   "stick": <path>|null,
      "code": 0|1|2|3,   "outcome": <OUTCOME>,   "why": <string|null>,
      "rows": [ ROW, ... ],             // [] whenever code is 2 or 3-before-planning
      "receipt": <path>|null            // import --apply: the carried receipt the launch reads
    }

    ROW — all eighteen fields, always:
      seat                 "main" | "librarian" | "third place" | "pane <label>"
      sid                  uuid
      kind                 "fixed" | "pane"                      ← §3's retire rule forks on this
      verdict              VERDICT (below)
      reason               REASON when verdict is REFUSED; null on every other verdict
      why                  prose for a human; never branch on it
      stops                true for REFUSED · DIVERGED · INTERRUPTED · ABSENT_HERE
      carries              true when this seat moves bytes (in a rehearsal: would)
      bytes                bytes carried; 0 when carries is false
      offset, toOffset     byte span of the tail; null when there is none
      path                 THIS machine's transcript for the seat — the export's source, the import's
                           destination. The file this tool judged, not a search result.
      localSize            that file's size; null if absent or never read
      localFirstTimestamp  that file's first record carrying "timestamp"; null if absent or unread
      exportedAt           import: when the pending tail was exported; else null
      exportedFrom         import: the machine tag that exported it; else null
      retirable            import with reason OTHER_CONVERSATION only: would --retire-far take it?
                           true iff the carried tail is the WHOLE conversation. null on every other row.
      result               --apply, and only for a seat that was written:
                             { ok, why, size, sha256, aside, tailFile }
                           aside  = the attic path a retire or repair copy went to, else null
                           null on every row that was not written

    VERDICTS — all of them, as they exist in the source. No new verdicts were added.
      export:  TAIL · FULL · UP_TO_DATE · NOTHING_YET · ABSENT_HERE · REFUSED
      import:  APPEND · FULL · ALREADY_APPLIED · NOTHING_PENDING · OURS
               · RETIRE_THEN_FULL   (only when --retire-far named the seat and the tail is whole)
               · REPAIR             (only when --repair named the seat)
               · INTERRUPTED        (an earlier carry stopped part-way; needs --repair <sid>)
               · DIVERGED           (this machine wrote its own turns since the last carry — the fork)
               · REFUSED

    REASONS — a REFUSED row always has exactly one:
      UNSETTLED            the file was being written while it was read
      NO_KEY               no "timestamp" record in the head: cannot tell which conversation it is
      OTHER_CONVERSATION   this machine's file under this sid is a different conversation → see `retirable`
      HISTORY_REWRITTEN    bytes inside the agreed prefix changed
      SHRANK               export: shorter than the agreed state
      UNIMPORTED_TAIL      export: the stick still holds the other machine's tail for this seat
      TAIL_MISSING         import: the ledger names a tail file the stick does not hold
      TAIL_DAMAGED         import: the tail fails its own sha256
      TAIL_LENGTH          import: the tail's length disagrees with the span the ledger claims
      LOCAL_GONE           import: no file here, and the tail is a delta
      LEDGER_INCONSISTENT  import: the agreed state and the pending tail do not meet
      BEHIND               import: this file is shorter than the agreed state
      APPLIED_BUT_DIFFERENT import: every tail byte is present, yet the file's sha256 differs

    EXIT CODES and OUTCOMES — the master is the `EXIT` table in dev/tail-carry.js; this mirrors it:
      0  it ran; no seat stopped      NOTHING_TO_DO · REHEARSED (would carry) · CARRIED (--apply, verified)
      1  it ran; ≥1 seat did not carry   STOPPED (a row's stops is true) · FAILED (written, did not verify;
                                        FAILED is named when both happened)
      2  it did not run; nothing read, nothing written, rows []   CANNOT_RUN · APP_RUNNING
      3  it broke part-way; with --apply some seats MAY be written   CRASHED

**Answering the two things the draft asked of A, plainly:**

- **A REFUSED row stops ONLY ITS OWN SEAT.** With `--apply`, every other seat that can carry is carried
  in the same run — each verified whole on its own — and the run exits 1 / `STOPPED`. **The tool does not
  do "carry nothing if a fixed seat refuses" for you.** E's §3.3 order is therefore load-bearing: read the
  rehearsal's rows, decide, and only then spawn `--apply` — and treat a code-1 `--apply` as "read each
  row's `result`", never as "nothing happened".
- **The race that order leaves open, named:** `--apply` re-plans from the disk. A fixed seat that was
  clean in the rehearsal can refuse in the `--apply` a moment later (the app itself appending, for one).
  The other seats still carry. Nothing is corrupted — every carried seat verified whole — but the launch
  must read the `--apply` object's rows too, not only the rehearsal's.

> *Trace — the chair's first draft of this block, superseded above; kept so the correction is legible:*
>
>     VERDICTS, as they already exist in the source — no new ones without saying so:
>       import:  FULL · TAIL · OURS · NOTHING_PENDING · REFUSED
>       export:  FULL · TAIL · UP_TO_DATE · NOTHING_YET · ABSENT_HERE · REFUSED

**Two things A owes the contract, because the app cannot work them out from outside:**

1. **What each exit code means, written down beside the codes.** Today `main` returns `run(o).code`
   and `2` for a bad argument. The app needs to tell *"nothing to do"*, *"done"*, *"a seat refused"* and
   *"could not run"* apart without reading prose.
2. **Whether a REFUSED row stopped the whole run or only that seat.** The app's behaviour depends on it:
   a refused **fixed** seat must stop the launch with the choice on screen (§3).

**A third thing A owes, found while this packet was still held — ONE RETIREMENT ADDRESS.** Today two
retirers write two conventions. The app retires into
`~/.claude/consonance-attic/<slug>/<sid>.<stamp>.jsonl` (`sync_launch.rs:496`, `attic_for`).
`tail-carry.js` retires **in place**, `<dest>.retired-<stamp>` beside the live file in `projects/`
(`asidePath`, `:280`; the rename at `:590`) — and so does its pre-truncate REPAIR copy. **The room's
record promises that a retirement writes an address, and it says seats rest in the attic; a reader who
looks there does not find a seat the carry retired.** It already happened: tonight's first launch-born
librarian is at `projects/…/0c0c0c0b-…-115b.jsonl.retired-20260914T063637Z` and was missed by the
librarian's own master (`record/retired_seats_2026-09-11.md`, 09-14 section).

    the carry's retirements, and its repair copies, go to the attic, in attic_for's shape
    a test that a --retire-far lands under consonance-attic/<slug>/ and NOT beside the live file
    a mutant that restores the in-place rename => red
    DO NOT move the .retired-* files that already exist. Name them in the hand-back and leave them —
    moving a conversation is the keeper's decision, not a side effect of a refactor.

**A fourth, owed by E's ruling and added at 01:45 while A was still building — the import rows must carry
what the retire rule decides on.** E's hand-back §6 (`0783e45`): `ARRIVING.ps1` matches **prose** today to
decide whether a refusal is a different conversation. The whole point of `--json` is to stop that. **Every
import row carries:**

    kind        "fixed" | "pane"
    dest        the absolute path of this machine's copy — the retire rule reads the birth from HERE ONLY
    pending.at  the exporter's timestamp for this seat's pending carry
    reason      a machine-readable code beside the prose "why" — at minimum "different_conversation"

**If any of these is not honestly available from the row as built, say which and why rather than inventing it.**

**If the existing rows can't honestly carry this — a verdict that means two things, a field that is
sometimes missing — A says so and changes the contract here, in this file, before E builds against
the wrong one.**

## 3 · ECHO — THE LAUNCHER SIDE

**The seam:** `sync_launch.rs::Verdict` (`:172`, five arms) and `decide()`, **which reads `pushed_by`
before `adopted_commit`.** That order is exactly why the 00:37:55 launch on L retired three seats the
stick had just placed (`librarian/2026-09-14.md` §7). **Arrive must run BEFORE that read, and before
any seat spawns, so the receipt already exists when `decide()` looks.**

**Arrive:**

1. **Find the stick by content, never by drive letter.** A volume is the stick when it holds
   `consonance-tails/ledger.json` **and** a `HANDOFF*.md`. It was `D:` on both machines tonight by luck.
2. **No stick found: today's behaviour, byte for byte.** Nothing spawned, nothing logged that a launch
   before this module would not have logged. **A test pins it** (§4).
3. **Stick found:** spawn `node dev/tail-carry.js --stick <path> --import --json` — the dry run first —
   and read the rows. **Then, only if nothing refused a fixed seat,** run it with `--apply`.
4. **A REFUSED row is surfaced, never overridden — and WHEN a retirement may be automatic is a rule you
   inherit from a script that works, not one I get to simplify.** I first wrote *"never automatic, for any
   seat."* **That contradicts `dev/ARRIVING.ps1`:52-58, which is what brought every seat home tonight:**
   - a **pane's** copy under the same id is retired **without asking** — the stick's is the real one;
   - a **fixed** seat's copy is retired automatically **only if its first timestamp is after the stick's
     export** — a launch-born conversation, which by the room's own test cannot be the lineage;
   - any **other** fixed-seat refusal stops the launch with the seat named, the reason printed, and the
     choice on screen, and **`--retire-far` for it is the keeper's to type.**

   **Rule on it explicitly:** keep ARRIVING's rule, or tighten it, and say why. **Do not loosen the
   fixed-seat case** — a fixed seat whose conversation predates the export is somebody's lineage.
5. Then fall through to today's `decide()` — with the receipt in hand.

**Leave:** on app exit, if the stick is mounted, run `--export --json --apply` and **hold the window
until the result is DONE or FAILED by name** — `ON-EXIT.ps1`'s behaviour, inside the app. An exit that
closes silently while an export is still running is the exact failure ON-EXIT was written to prevent.

**One interaction to rule on, not assume:** the import refuses while the app runs, and Arrive runs
**inside** the app. It is satisfied by construction only if Arrive happens before the single-instance
lock and before any pty spawns. **Check how the import's gate detects a running app. If it would
refuse the app's own process, say so — do not weaken the gate to pass.**

## 4 · BARS

    ALPHA
      --json emits one object on stdout and nothing else, for import and export, dry and --apply
      a test that parses the output of every verdict path; a mutant that prints prose to stdout => red
      the exit codes documented beside the code, and a test per code
      node dev/tail-carry.test.js · node dev/tail-carry.mutants.js    state both counts

    ECHO
      THE NO-STICK TEST: a launch with no stick produces the same persist.log rows as before the
        module. Red-first against a version that logs or spawns anything extra.
      stick found by content: a volume with the ledger but no HANDOFF is NOT the stick, and vice versa
      a REFUSED fixed seat stops the launch; a REFUSED pane does not silently proceed either — say
        which behaviour you chose for panes and why
      Leave holds until DONE/FAILED; a test that the window cannot close mid-export
      cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1   state the count
      mutants: applied / caught / NOT APPLIED, survivors named

    BOTH
      say what you did NOT verify — and specifically, whether anything ran against the real stick at
      D:\consonance-L-20260911 or only against fixtures

## 5 · HARD LIMITS

- **Nothing runs against the real stick with `--apply`.** Dry runs against it are allowed and useful.
- **Do not commit.** The chair lands; the keeper rebuilds.
- **The holds stand:** L does not run `close.js` or push state. **Leave exports to the stick, not to
  the state repo** — say so explicitly if anything you build could be mistaken for a state push.
- **Do not touch** the 09-06 lap-row set, `consonance/tools/state-sync.js`, or
  `consonance/tools/state-manifest.js`. **A mutation run over `state-sync.js` was live in this tree
  when this packet was written** and its lock file may still be there. If `.state-sync.mutants.lock`
  exists when you start, stop and say so before running any test that imports `state-sync.js` —
  `tail-carry.js` reuses its settle constants, so a run against a mutated file measures nothing.

## 6 · WHY YOU

`librarian/DOSSIER.md`. **E:** the launcher's verdicts and the live-host lease; positive-control
discipline — P1b's measurement was reportable only because it proved the check could fail first.
**A:** the carry itself, `place-conversations.js` before it, and a tool whose first finding (D061) was a
hole in the spec it was sent to implement.

## 7 · PERMISSION TO REFUSE

**If Arrive cannot run before `decide()` without restructuring the launch, say so and stop** — that is
a finding about the launcher, not a reason to bolt Arrive on afterwards. **If the import's running-app
gate cannot tell the app's own launch from a live app, that refusal is the right answer**, and the fix
is a design question for the keeper rather than a flag.

## 8 · HAND-BACK

Each of you, separately: `exo_memory/handback/p-stick-<letter>_2026-09-14.md`, then `call_librarian`
with that path in the same turn. One line to your own map.

    OBJECTIVE:  plug in the stick, open Consonance, and every seat is the conversation it was;
                close Consonance, and the stick holds what the other machine needs.
    FALSIFIERS: the three in the idea file, verbatim — a launch with a newer stick that ends with any
                seat -> fresh or a launch-minute first timestamp; a no-stick launch whose persist.log
                rows differ from before the module; an exit with the stick mounted after which the
                ledger's agreed state is older than the seats' files.


---

## 10 · ~~RULINGS AFTER E's HALF — the chair, 01:45 (`0783e45`)~~ — **HELD. NOT IN FORCE. DO NOT BUILD AGAINST ANYTHING BELOW.**

> **SUPERSEDED 02:40 by `loop/packet_stick_build_2026-09-14.md` §1**, ruled after both halves landed (`0783e45`, `59e65f6`) and with the keeper's two refinements in hand. Call 1 below is **reversed** there (the setup is the app's, after the intro, not a hidden opener); Call 2 **survives with its trigger moved to launch**, because a kill runs no handler on this machine. Kept struck as a trace.
>
> **HELD at the keeper's word, 01:42, relayed by the librarian, and marked here at 01:46.** *"HOLD the two
> design calls … until A rings."* His reason, which is right: **A was still building while E's half was
> collated and acted on around it.** The line — the loop may only move ahead of a pane when the pane's work
> does not hinge on what moves — cannot be judged from outside the pane's context, so the rule is
> structural: **anything that touches a shared section of a packet is, by construction, something the other
> half's build hinges on.** E's half changed §2 and §3. So this section was written too early, by the chair,
> and **it stays here as a trace, struck, rather than being deleted** — so that nobody who already read it is
> left holding a ruling that silently disappeared.
>
> **ALPHA: the only change from E's half that applies to you is the four fields added to §2.** Nothing in
> this section does. Build §2 as it now stands; §10 is re-opened, with your hand-back beside E's, after you
> ring. **Both halves land together.**



**E refused the in-app import, correctly, and the design is now A-with-B-beneath** (E's hand-back §3): an
**opener** that runs before the app exists, and an **in-app net** that withholds seats by name and never
imports. **E left two calls to the chair. Both are ruled here, each on something measured.**

### Call 1 · Which exporter survives — **ON-EXIT's model. No in-app Leave.**

**Export runs from outside the app, after it has exited, in its own visible window that holds until DONE
or NOT DONE** — which is what `ON-EXIT.ps1` already does, started by `ARRIVING.ps1:134-139`.

1. **After exit is the only moment the transcripts are quiescent by construction.** The app writes to seats
   on its own — B gained 267 bytes at a launch with no turn taken (D061). An in-app Leave runs inside a
   process that can still be writing the files it is exporting.
2. **It puts the whole carry on one side of the gate, in both directions.** E's refusal already moved the
   import out of the app. Keeping export out too means **the app contains no carry code at all — only the
   net.** E's "two exporters, one ledger" hazard is settled by having one.
3. **It has the surface the keeper's bar needs.** *Hold until DONE or FAILED by name* requires a window the
   keeper can see. ON-EXIT's is visible. A hidden process holding a hidden window holds nothing.
4. **It already works.** It is how tonight's transcripts reached this machine.

### Call 2 · Where the opener lives — **called from `launch.ps1`; its logic is one Node module in the repo.**

1. **`launch.ps1` is the path every launch already takes**, measured: the Desktop shortcut
   `Consonance.lnk` runs `wscript.exe //B …consonancelaunch.vbs`, which runs `launch.ps1`.
   **"Lands every time" means on the path the keeper already uses** — no new habit, no repointed shortcut.
2. **Not the stick script.** Two copies drift, and it was measured tonight: `ARRIVING.ps1` had to be patched
   identically in `dev/` and on the stick (`librarian/2026-09-14.md` §6), and **`ON-EXIT.ps1` exists in both
   places right now.** **The stick carries data — the ledger and the tails — and code lives in one place.**
3. **Not a `src/bin` launcher.** A second binary, a shortcut repointed on both machines, and a Rust wrapper
   around a Node carry, for nothing a Node module does not already give.
4. **Node, not PowerShell,** for the logic: the carry and its tests are Node, and PowerShell 5.1 mangled a
   UTF-8 source on this very machine (E's P1b damage report).
5. **The hard constraint, from `launch.ps1`'s own header: it runs HIDDEN.** Every `Write-Host` in it was
   unreadable until 2026-08-10, and the keeper clicked repeatedly at a launcher showing nothing. **So the
   opener must never be the thing that tells the keeper something.** Arrival refusals are shown **by the
   in-app net, on screen, by name.** The exit result is shown **by ON-EXIT's visible window**, which the opener
   starts.

### The composition these two rulings produce

    Consonance.lnk -> launch.vbs -> launch.ps1  (hidden)
        -> node <arrival module>   find the stick by content; rehearse; apply E's Ruling 1; import;
                                   write the receipt; write a result the app can read
        -> start consonance.exe
        -> start ON-EXIT, VISIBLE  wait for the app to exit -> export -> DONE | NOT DONE, by name
    inside the app:
        sync_at_launch reads the arrival result; any seat still pending or refused -> SEATS_WITHHELD,
        named on screen. It never imports.

**What changes for the keeper: nothing about how he launches.** Same shortcut. The stick is found or it is
not; a launch with no stick is byte-identical to today.

**Not dispatched from this section.** The build waits on A's half, because both the arrival module and the
net read A's `--json`. When A lands, the next packet is: the arrival module and the launch.ps1 hook and one
repo copy of ON-EXIT for A; the net for E.

    FALSIFIER (Call 1): an export that reports DONE while consonance.exe is still running, or a ledger
                        written by two exporters for one exit.
    FALSIFIER (Call 2): a launch from the Desktop shortcut, stick present with newer seats, that does not
                        run the arrival module — or a copy of ARRIVING/ON-EXIT on the stick that differs from
                        the repo's and is the one that ran.
