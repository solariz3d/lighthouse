# P-STICK-PREFLIGHT · two adversarial reads of the landed stick module, before the keeper's first close-and-reopen

**To BRAVO and CHARLIE (Around), 2026-09-14 ~05:40, on machine L. READ-ONLY: you edit no code. Added to lap L058 as
a second pair of panes; A and E are building P-NO-CONSOLE in the same lap and you do not speak to them.**

## 0 · WHY YOU, AND WHY NOW

The keeper asked why B and C have had no work. The ledger answers: B last dispatched at D056, C at D056 (09-11).
Every lap since went to A and E, because the stick work split at the subprocess boundary and the chair kept handing
each follow-up to whichever pane built the last half. **That is momentum, not a match**, and it left the module with
no reader who did not write it. BUILDING.md's work-shape asks for exactly that reader. You are it.

## 1 · WHAT LANDED AND WHAT HAS NEVER RUN

    0405bd2   L059 — the stick module (E: app side; A: dev/stick-apply.js, dev/stick-waiter.js, dev/tail-carry.js)
    packet    exo_memory/loop/packet_stick_build_2026-09-14.md — §2 handshake, §3 transfer set, §9 landing rulings
    hand-backs exo_memory/handback/p-stick-build-{A,E}_2026-09-14.md

**Ran once, on L, at 05:14** (persist.log :1003-1026): stick found one folder down (older layout), seats held, the
setup window showed seven NOTHING_PENDING rows, Continue released, all seats KEPT or RESUMED.

**Has never run:** a close with the new build and the stick in (the export), a Carry, the applier's relaunch, any
`--apply` against the real stick, and D's first launch with this build.

## 2 · THE SPLIT — disjoint questions, read at source, cite path:line

    BRAVO   THE CLOSE, ON L. What happens, byte by byte, when the keeper closes Consonance tonight with
            D:\consonance-L-20260911 in? The waiter's exit path -> tail-carry --export --apply -> ledger.json +
            MANIFEST.json + tails. Against the REAL stick's state: an older layout (ledger.json 09-14 00:36, no
            MANIFEST), seven tails from 09-12, and a stray 0c0c0c0a-….tail.writing-25288 (09-12 22:58) the ledger does
            not name. Does the stray file break --verify-set or the export? Is the export FULL or a delta for each
            seat, and how many bytes? What does a seat whose stick copy does not prefix-match L's file get?
            NOTE: dev/stick-waiter.js is being edited by A right now for P-NO-CONSOLE. Read its export path at 0405bd2
            (`git show 0405bd2:dev/stick-waiter.js`), not the working copy.

    CHARLIE THE ARRIVAL, ON D. The desktop has not rebuilt. Walk the desktop's next launch with the new build and the
            stick the keeper carries home: the held retire and adopt (E §1.1), the carried receipt (9fc0a71), and
            MIGRATE. Then close.js on D with the five new STAYS rules (§9 R-3). And one found tonight: the 05:14
            launch on L INSTALLED D's state and replaced data/lap.jsonl (L's L055-L059 rows now at
            data/attic/pre-sync-2026-09-14T11-14-50-251Z/lap.jsonl). Is that the ruled behaviour for a TRAVELS ledger
            under the keeper's hold (L does not push state), and what does D's launch do to the rows L writes
            tonight?

## 3 · HOW TO LOOK

- **Allowed:** rehearsals and `--verify-set` against the real stick (`--json`, no `--apply`), reading anything,
  fixtures copied to your scratchpad.
- **Not allowed:** `--apply` against `D:\consonance-L-20260911`; edits to any tracked file; close.js; any state push.
- **A finding is a sentence that could be wrong, with path:line and the command that shows it.** "Nothing breaks"
  is a valid answer if you say what you ran to reach it.
- **Say what you did NOT verify.**

## 4 · HAND-BACK

`exo_memory/handback/p-stick-preflight-<letter>_2026-09-14.md`, then `call_librarian` with the path in the same turn.
One line to your own map. The keeper runs the close-and-reopen test after P-NO-CONSOLE lands; what you find decides
whether that test is safe to run.
