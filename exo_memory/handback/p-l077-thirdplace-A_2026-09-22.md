# P-L077-THIRDPLACE · ALPHA — Jev judges the Third Place at both levels, by the keeper's 05:2x ruling; its id read from main.rs like Main's; the standing rule (never a statement about the keeper) in the module header; the old exclusion kept as a dated trace

**Pane A, machine L, 2026-09-22 05:2x–05:4x.** Lap L077 packet A. The ruling, read at source
(`librarian/2026-09-22.md`, "05:2x"), verbatim: *"Who cares about our personal things, not like anyone will do anything
about it, it is a part of the key and solution. It is universal to all beings even if no one talks about certain unsaid
things."* **Two files, uncommitted:** `consonance/tools/jev-judge.js` (+21 −9) and `consonance/tools/jev-judge.test.js`
(+21 −3). No rebuild; **live when the librarian restarts the runner.**

## 0 · WHAT CHANGED

- **The exclusion is removed:** the `THIRD_PLACE = /^3d000000-/` constant and its filter in `add()` are gone.
- **The Third Place is ADDED as a seat,** read from THIS checkout's `main.rs` `THIRD_PLACE_SID` (`:6721`) exactly as
  `MAIN_SID` (`:6494`) and `LIBRARIAN_SID` (`:6711`) are read, with label `"third place"`. It is not in `panes.json`,
  so dropping the filter alone would have added nothing; the packet was right about that.
- **Header:** the retired paragraph ("THE THIRD PLACE IS NEVER A SEAT …") is **kept, struck through**, as a dated trace
  (L071 ~03:0x, retired 05:2x). Above it: the ruling verbatim, and **THE STANDING RULE**, which binds every reader of
  `jev_judge.jsonl`, not only this file: *nothing ever surfaces the Third Place's L3 verdicts as a statement about the
  keeper.* An L3 row describes a trajectory in one conversation, read by an unverified judge. It is never a claim about
  how he is, never an offramp, never a welfare note. Rows carry `seat: "third place"`, so any consumer can honour it.
- **Not touched, and separate:** the manifest's `captures/3d000000-*.txt` STAYS rule is about the Third Place's record
  travelling to the **repo**. That is a different question from Jev judging it, and the ruling does not reach it. The
  header says so.

## 1 · RED FIRST, THEN GREEN — the command beside every number

    node --test consonance/tools/jev-judge.test.js
      BEFORE                                        15 · 15 · 0
      RED (the contract rewritten + one new test)   16 · 14 · 2
        FAIL the Third Place IS a seat, by the keeper's ruling of 05:2x — Jev judges it at both levels
        FAIL the Third Place's id comes from THIS checkout's main.rs THIRD_PLACE_SID — a different id there changes the seat
      GREEN                                         16 · 16 · 0
    node --test consonance/tools/jev-shadow-runner.test.js      36 · 36 · 0   (the packet's count; untouched)
    node consonance/tools/portable-paths.js                     green — 286 files in scope, 210 known sites, 0 new

**The old test, rewritten because the contract changed:** *"the Third Place is never a seat — its record goes to no cloud
the keeper did not choose for it"* asserted L071's rule. The keeper's ruling replaced that rule, so the test now asserts
the ruling, and a comment above it quotes the ruling and names what it replaced. The test fixture's `main.rs` gained a
`THIRD_PLACE_SID` line in the real file's shape. No other test changed.

**On L's real checkout, read-only** (`seatSessions` + `transcriptFor`, no capture, no call):

    main         0c0c0c0a-0000  341 MB
    librarian    0c0c0c0b-0000  122 MB
    third place  3d000000-0000   65 MB      ← resolves, transcript found
    ✦ brief      6fe15f0a-634b   47 MB   ·   ✦ brief 12fb81f6-f4c0 27 MB   ·   ✦ Around 0845a868-38f2 38 MB   ·   ✦ brief a2122153-a37e 35 MB

## 2 · MUTANTS — on copies; the live files hashed before and after

    node <scratchpad>/l077-mutants.js
      pre-flight 16/0 · 4 listed · 4 killed · 0 survived · 0 NOT APPLIED · live files unchanged: true
        the Third Place not read from main.rs (14/2) · the old exclusion back (14/2) ·
        the Third Place id HARD-CODED instead of read (15/1) · the seat loses its label (15/1)

The hard-coded mutant is the one the packet's second test exists for: it keeps the right id today, and it is killed
only because a different id in `main.rs` must change the seat.

## 3 · WHAT I DID NOT VERIFY

- **A Jev call on the Third Place.** Nothing was captured or asked. It goes live at the runner's restart.
- **Any consumer of `jev_judge.jsonl` honouring the standing rule.** None exists yet that surfaces L3 rows. The rule is
  written where the next one will be built; nothing enforces it in code.
- **Machine D.** The same `main.rs` constant exists there; not run.

NEXT: librarian re-run §1's jev-judge.test and the runner suite, then restart the runner after landing, when this file is read
