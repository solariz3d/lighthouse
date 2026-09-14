# P-STICK-BUILD · the stick module, built — the setup window after the intro, and the transfer set by name. L059.

**To ECHO and ALPHA, 2026-09-14 ~02:40, on machine L. Two owners again. §2 and §3 are SHARED sections and
they are complete before either of you starts — that is the keeper's rule from tonight, and §6 says what
happens if one of you needs to change them.**

## 0 · WHAT IS ALREADY LANDED, AND WHAT THIS PACKET STANDS ON

    9fc0a71   the carried receipt — the launch KEEPS what the stick placed          (launch-born librarian)
    0783e45   E's L058 half — the in-app import refused; the gate measured; ruling 1 tightened
    59e65f6   A's L058 half — tail-carry --json, exit codes 0/1/2/3, one retirement address (the attic)

    node dev/tail-carry.test.js       71 / 0          node dev/tail-carry.mutants.js    44 killed / 0 survived
    cargo test --bin consonance       543 / 0 / 4     (at 9fc0a71; re-run at your own landing)

**Read at the file, in this order:** `loop/stick_arrival_module_idea_2026-09-14.md` (both of the keeper's
refinements, verbatim), `handback/p-stick-E_2026-09-14.md`, `handback/p-stick-A_2026-09-14.md`,
`loop/packet_stick_module_2026-09-14.md` §2 (the contract as it landed).

## 1 · THE TWO DESIGN CALLS, RULED — with both halves in hand and the keeper's two refinements

### The keeper, verbatim

> **(UX, 02:13)** *"when the user opens consonance, it does the rebuild stuff too, like the shortcut i mean if
> it needs to rebuild, but if it doesnt, it does the intro, but then loads a prior window that shows like a
> setup for tranfering the transcripts from thumbdrive."*
>
> **(the transfer set, 02:13)** *"BUT THE module should also know what to look for certain MDs, and then one
> night end or transfer, the correct things are created that then could be picked up by the module instantly"*

### Call 1 — WHERE THE SETUP LIVES: in the app, after the intro. The one write is handed off.

**My held ruling (L058 §10, struck) put a hidden opener in `launch.ps1`. The keeper's UX supersedes it:** he
wants rebuild-if-needed → intro → a setup window. **The intro is the app's, so the setup window is the app's.**

**It meets E's gate at exactly one point, and E measured it:** the import's WRITE cannot run while
`consonance.exe` exists. **Rehearsal is allowed in the app; the write is not.** So:

    launch.ps1  (unchanged: rebuild if needed, start the exe)
      app: intro -> Arrive finds the stick by its MANIFEST (§3) -> rehearse (--import --json)
        nothing pending                  -> seats spawn, today's behaviour
        something to carry / refused     -> seats WITHHELD; the SETUP WINDOW shows every seat by name:
                                            its verdict, reason, bytes, and the conversation's first timestamp
        keeper confirms                  -> the app starts the APPLIER, waits for its handshake (§2), exits
      applier (A, no window): waits for consonance.exe to exit -> --import --json --apply -> writes the result
                              -> relaunches the app
      app, relaunched: rehearses again. Clean -> seats spawn. Anything left -> the setup window again, by name.

**The principle of the struck ruling survives: the hidden process never tells the keeper anything.** The app
is the only surface. A failed or half-written apply is shown by the relaunched app re-rehearsing, not by a
message from a process nobody can see — `launch.ps1`'s own header records what an invisible reporter cost on
2026-08-09.

**And the failure that shape invites, named so it is built against:** if the app exits and the applier never
starts, the keeper sees nothing at all. **The app does not exit until the applier's handshake exists (§2).**
**Measured tonight, with a positive control: on this machine a process killed from outside runs no handler —
not SIGTERM, not SIGINT, not `exit`.** So "relaunch in a finally" does not survive a hard kill of the applier.
**That is acceptable only because the next launch is correct by construction:** the keeper opens the shortcut
again and the setup window re-rehearses the real state. Say in your hand-back whether you agree.

### Call 2 — WHICH EXPORTER SURVIVES: one exporter, ON-EXIT's model, started at LAUNCH, never on close.

1. **Export runs after the app has exited**, because the app writes seats on its own — 267 bytes at a launch
   with no turn taken (D061) — and an in-app Leave would export from a process that can still be writing.
2. **It is started when the app starts, not by a close hook — this is the part the measurement decides.** A
   close hook runs only on a graceful close. When Windows kills the app, **no handler runs**, so an on-close
   exporter silently does nothing on exactly the exit that most needs it. A waiter started at launch notices
   the process is gone however it went. **That is what `ON-EXIT.ps1` already does.**
3. **It holds a visible window until DONE or NOT DONE, by name**, because once the app is gone there is no
   other surface and the keeper needs to know when to pull the stick. **Make it unobtrusive while waiting and
   unmissable when it runs** — that is a UX call inside the ruling, not a reason to hide it.
4. **One exporter, one ledger.** E's "two exporters" hazard is settled by there being one.

**And the case no waiter can cover, named rather than implied:** a machine shutdown kills the waiter too. So
**at launch the app also checks the other direction** — if the stick is BEHIND this machine (an export
rehearsal would carry TAIL rows), the setup window says so before seats spawn: *the stick does not have your
last session.*

## 2 · SHARED SECTION — the app ↔ applier handshake. Complete now; changed only per §6.

    the app starts:   node dev/stick-apply.js --stick <path> --relaunch <absolute path of consonance.exe>
    the applier writes, BEFORE doing anything else:
                      <data_dir>/stick-apply.started.json   { "pid": <int>, "at": <ISO>, "stick": <path> }
    the app:          waits up to 10 s for that file with that pid alive; if absent, does NOT exit — it
                      shows "the transfer could not start" in the setup window, by name, and stays open
    the applier:      waits until no consonance.exe is running (the same check the import gate uses)
                      runs  node dev/tail-carry.js --stick <path> --import --json --apply
                      writes <data_dir>/stick-apply.result.json   { "code": <0|1|2|3>, "rows": [...], "at": <ISO> }
                      removes stick-apply.started.json
                      relaunches <consonance.exe>, whatever the code was
    the relaunched app: reads stick-apply.result.json if present, re-rehearses, and shows the result in the
                      setup window if anything is left. It deletes the result file only after showing it.

**Exit code 3 (crashed part-way, seats may be written) relaunches too** — the re-rehearsal is what shows the
keeper which seats are half-carried, using A's `INTERRUPTED` / `--repair` rows.

## 3 · SHARED SECTION — THE TRANSFER SET, by name. One list, one file, both halves read it.

**The keeper's second refinement made exact.** Today the stick carries a de-facto set and no file says which of
those a transfer IS, so "find the stick by content" had nothing exact to find.

    <stick>/consonance-transfer/MANIFEST.json      the one list — written by Leave, read by Arrive
        { "format": 1, "writtenBy": "<machine tag>", "at": <ISO>,
          "members": [ { "path": <relative>, "bytes": <int>, "sha256": <hex> } ... ] }
    the members, every transfer:
        consonance-tails/ledger.json
        consonance-tails/<every .tail file the ledger names>
        HANDOFF-<YYYY-MM-DD>.md        GENERATED from the ledger at export, never typed: which seats, which
                                       sizes, the verdict expected at the far end, and the one-machine-open rule

    A volume IS the stick  <=>  consonance-transfer/MANIFEST.json exists AND every member it names exists with
                                its bytes and sha256.
    A MANIFEST with a missing or mismatched member is NAMED as that, in the setup window, member by member.
    A volume with a ledger and no MANIFEST is NOT the stick — named as "an older stick layout", never guessed.

**One implementation of the verifier, A's, and the app calls it:**

    node dev/tail-carry.js --stick <path> --verify-set --json
        -> { "code": 0|1|2, "stick": <bool>, "missing": [...], "mismatched": [...], "extra": [...] }

**Drive letters are never used.** The app enumerates volumes and asks the verifier.

**What does NOT change:** `ARRIVING.ps1`, `LEAVING.ps1` and `ON-EXIT.ps1` on the stick and in `dev/` **keep
working until this module is built into BOTH machines' binaries** — the next trip to D has to land. Retiring
the stick scripts is a later step, and it is the keeper's.

## 4 · THE SPLIT

    ECHO    consonance/src-tauri/src/main.rs, sync_launch.rs, consonance/ui/*
            Arrive in sync_at_launch (verify-set, rehearse, withhold); the SETUP WINDOW after the intro;
            the handoff (§2) and the relaunch read; the "stick is behind this machine" notice;
            THE NO-STICK TEST — a launch with no stick is byte-identical to today, red-first

    ALPHA   dev/stick-apply.js (new), dev/tail-carry.js, dev/ON-EXIT absorbed into the repo, dev/*.test.js
            the applier (§2); --verify-set (§3); Leave writes the transfer set and the generated HANDOFF;
            the exit waiter started at launch (Call 2);
            AND the mutation harness mutates a COPY, never the tracked source — see §5

**Neither of you edits the other's files.**

## 5 · BARS

    ECHO
      the no-stick test, red-first: a launch with no stick produces the same persist.log rows and spawns the
        same seats as before the module
      a stick whose MANIFEST has a missing member withholds seats and names the member
      the app does not exit when the handshake file never appears
      the setup window shows the conversation's first timestamp per seat — that is the room's identity test,
        and the keeper should be able to see it
      cargo test, state the count; mutants applied / caught / NOT APPLIED

    ALPHA
      --verify-set: a test per outcome (stick / missing / mismatched / older layout)
      the generated HANDOFF is deterministic from the ledger — same ledger, same bytes
      the applier relaunches on every exit code, 0 through 3 — a test per code
      THE HARNESS FIX. Tonight a timed-out mutation run left a live mutant in tail-carry.js, and on this machine
        a kill runs no handler — so no restore-on-signal can protect the tracked file. The harness must write
        its mutants into a COPY and point the suite at the copy. Proof: kill a run mid-mutant and show
        `git diff` on tail-carry.js is empty. Third instance of this defect: lap-row.js 09-06, state-sync.js
        and tail-carry.js tonight.
      node dev/tail-carry.test.js · node dev/tail-carry.mutants.js    state both

    BOTH
      say what you did NOT verify — and specifically whether anything ran with --apply against the real stick

## 6 · IF A SHARED SECTION IS WRONG — the keeper's rule, made operational

**§2 and §3 are what the other half builds against.** If either of you finds one of them cannot be built as
written, **STOP building on it, write down why in your hand-back, and ring the librarian then.** Do not change
a shared section in place and keep going, and do not build around it. **The loop does not move ahead of a pane
whose work hinges on what moves** — and a shared section is, by construction, something the other pane hinges on.

## 7 · HARD LIMITS

- **Nothing with `--apply` against the real stick at `D:\consonance-L-20260911`.** Rehearsals and
  `--verify-set` against it are allowed and useful — and the real stick has no MANIFEST.json yet, so
  "an older stick layout" is the answer to expect.
- **Do not commit.** The chair lands both halves together; the keeper rebuilds.
- **Holds stand:** no `close.js`, no state push. Leave writes to the stick, never the state repo.
- **Do not touch:** the 09-06 lap-row set, `consonance/tools/state-sync.js`, `consonance/tools/state-manifest.js`.
- **If a `*.mutants.lock` exists when you start, stop and check the source against its mutant list before
  anything else.**

## 8 · HAND-BACK

Each of you: `exo_memory/handback/p-stick-build-<letter>_2026-09-14.md`, then `call_librarian` with the path in
the same turn. One line to your own map.

    OBJECTIVE:  open Consonance with the stick in: the intro, then a window that shows exactly what will carry,
                seat by seat; confirm, and every seat is the conversation it was. Close it: the stick holds a
                named, verified set the other machine picks up instantly.
    FALSIFIERS: a launch with a stick carrying newer seats that ends with any seat -> fresh or a launch-minute
                first timestamp; a no-stick launch whose persist.log rows differ from before the module; an exit
                after which the stick's MANIFEST is older than the seats' files; an app that exits with no applier
                running.
