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

    node dev/tail-carry.js --stick <path> (--import|--export) [--apply] --json

    stdout:  exactly one JSON object, and nothing else on stdout
             { "mode": "import"|"export", "apply": bool, "code": <int>,
               "rows": [ { "seat": <name>, "sid": <uuid>, "verdict": <VERDICT>, "why": <string|null>, ... } ] }
    stderr:  free text, for humans; the app never parses it
    exit:    equal to "code"

    VERDICTS, as they already exist in the source — no new ones without saying so:
      import:  FULL · TAIL · OURS · NOTHING_PENDING · REFUSED
      export:  FULL · TAIL · UP_TO_DATE · NOTHING_YET · ABSENT_HERE · REFUSED

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
