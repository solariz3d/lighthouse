# L258 track 1 read, pane E (L): the bank past a full turn, f3cd425..2067c88: NOT CLEAN, on the record only; the code does what he answered

BASE: C:\Users\zackn\Downloads\t180-track-builder 2067c88 (`l-bankcarry-a`, one WIP commit on `landing-1126-batch` f3cd425)

**Verdict: NOT CLEAN, narrowly. The defect is in what the change says about itself, not in what it does.**
- **The CHANGELOG** (`CHANGELOG.md:35`) says "The drags (the ghost's bank handle, the extra bank's, Sculpt's and the bank brush) keep his
  2026-10-06 rule unchanged". So does the rows' header (`app/test/core-bank-carry.test.js:5`). D's hand-back says "The drags are unchanged".
- **Two of those four drags now lay a different road from a head past a turn:**
  - **The ghost's bank handle.** From a head at −392 (shown −32), the handle's write of −42 lays −392 → −402 at 2067c88 (steepest 0.072
    °/m). At f3cd425 it lays −392 → −42, unwinding 350° at 2.508 °/m. Its −432 lays −432 at the tip and −72 at the base. checked,
    `vary_tip.txt` / `vary_base.txt` E1a, E1b; within one turn (E1c) both trees are identical.
  - **The extra bank handle.** D's own row W4 is exactly this change: red at f3cd425 ("the change at −60"), green at the tip (−440). The
    flowing bank's offer does the same (E2a: the base unwinds at 7.04 °/m, the tip rolls on at 0.533).
- **Sculpt's bank handle and the bank brush are unchanged.** They live in `coreshell.js`, which the range does not touch. inferred, from the
  diff: `git diff --stat f3cd425 2067c88` changes `panel.js` and tests only.
- **The behaviour agrees with his answers of 01:11** (`briefs/t180_unmakeable_shapes.md:68-72`): 5, "literal" (typing as built at 2067c88),
  and 6, "keep rolling" (Sculpt's bank drag carries past a turn). They arrived after this read was ordered (07:06:13Z = 01:06 local).
  - So what needs changing is the sentence: the CHANGELOG line, the rows' header and the hand-backs. A row should also pin the ghost
    handle's roll (none does; see "Rows").
  - The packet his answer 6 opened (`loop/packet_t180_overlay_and_sculpt_carry_2026-11-27.md`) will rewrite that sentence anyway, once
    Sculpt carries too.
- **Should it land?** Yes, as code, with the CHANGELOG line corrected in the same landing. Nothing I measured lays a wrong road.

The NOT CLEAN is the condition I registered before running anything (`evidence/first_pass_E.md`): "a drag the CHANGELOG calls unchanged lays
a different road from f3cd425, unless the hand-back says so". It fired. I do not re-scope it after the fact.

## How I read it

- **Order:** the packet's track 1 and reader sections, D's "Where it stopped", then the diff, and my first pass written
  (`evidence/first_pass_E.md`). Only then A's L258 hand-back whole and D's middle sections (its rows, mutation and "two calls").
- **Trees:** my own detached worktrees `Downloads\t180-wt-e-l258` (2067c88) and `-l258b` (f3cd425), both removed at the end.
- **Harness:** `evidence/e_vary258.test.js`, D's own fake DOM from `core-bank-carry.test.js` spliced in, run by `T180_TREE=<tree> node --test
  e_vary258.test.js` on each tree. **24 of 24 run on both**; every case prints one `VARY` line, and the pairs below are those lines.
- **No browser this lap.** No page script, no Chrome, so no tab-proxy count was needed (none started, none left).
- **His saves:** not opened; A's copies covered them (below). No track name is in this file or its evidence.

## What A fixed, varied (the librarian's leg fe9902a0)

| case | f3cd425 | 2067c88 | reading |
|---|---|---|---|
| **a head past a turn, made on L** (none of his tracks and none of the builder's 17 test tracks is wound: `fixtures_wound.txt`, 0 of 17) | | | heads −392, +392 and −720 laid by the core, and −720 typed through the panel |
| W-style: from −340 a typed −392 | unwinds (D's W1) | rolls on, as the CHANGELOG says | D's rows, green at the tip (row "Rows") |
| E7b: head +392 (shown 32), typed −32 | −32: unwinds 424° | 328: rolls back 64°, through 360 | in the head's turn, as the rule says |
| E6: head −720 (**shown −360**), typed −10 | −10 | **−370**: rolls back 350° | consistent with the rule (the field shows −360, so −10 is 350 back), but see "The whole-turn edge" |
| E7a: upright, typed 400 | 40 | 400 | the CHANGELOG's "a 400 typed from upright now rolls 400" holds |
| E8: −654.70 typed and committed | the field reads −294.7 | the field keeps −654.70 | the CHANGELOG's words hold |
| **an extra bank row** E3b: head −392, field −60, a row −100 at 250 of 600 m | sent −60 / −100: unwinds to −100 | sent −420 / −460, laid −392 → −460, steepest 0.262 °/m | holds |
| E3: rows −100 at 100 and −400 at 200 of 300 m | BAD_SECOND (room) | BAD_SECOND (room), sent −420 / −460 / **−760** | each row is taken in the HEAD's turn, not the previous row's: a row typed −400 adds a second turn. Refused here for room on both trees, so this shows what is sent, not a road |
| **the flowing bank's offer** (D: "caught by no row") E2a: flow, head −392, field −60, the unused offer dragged to −80 | offers −60; laid −392 → −80, unwinding at **7.04 °/m** | offers −60; laid −392 → −440 one way, steepest 0.533 | right at the tip; the mirror E2c (+392, 60 → 80) the same; within one turn (E2b) both trees identical |
| **a closed lap** E9: G6's lap, its bank piece typed in the panel from a head at −360, typed −32 | closes, seam 0, sha `e4c93c68…` | **the same document**, seam 0 | at a head of a whole turn, −32 means −32 on both trees (see the edge below) |
| E9b: the same lap, the whole number −392 typed from −360 | sent −32 (wrapped): closes, seam 0 | sent −392, laid one way (0.169 °/m): closes, **seam −360**, converged | the wound lap typed through the panel closes as G6's core-laid one does |

## The flowing offer's missing row, as a mutant (checked)

- **Mutant F1:** the flow branch's `- headTurns()` removed (`panel.js`, `offersAt`, the line ending `base: Number(last ? last.target / DEG :
  bankTarget()) - headTurns(), ...ST.styleOf(f) });`; anchor found once).
- **Result: applied 1 / caught 0 / NOT APPLIED 0** by D's 7 rows plus `core-bank-flow-panel.test.js`'s 6 (`mutF1_rows.txt`: 13 of 13
  pass). That confirms D's "not caught by any row".
- **What it does:** under F1 the offer reads **−420** (mirror **420**) where the field says −60. That is past the extra handle's ±360 hold.
  What a drag lays stays −440 (`mutF1_vary.txt`).
- **A row to write:** E2a's offered value, −60 from a head at −392 with the flow box ticked. My vary file prints it and asserts nothing, so it
  is not a row yet.

## The whole-turn edge (for his answer 5; not a defect of the rule as written)

- **Where a full turn lands.** A full turn laid by the core lands at **−359.9999999897105** by every route I tried: one piece of 150, 300,
  500 or 777 m; two pieces; three; and the same for +360 (`fullturn_tip.txt`). The frame is deterministic, not float noise. inferred: the
  stored value's rounding.
- **What the field shows there.** `HD.wrapTurn` is `x % 360` (`handles.js:351`), so that head shows **−360** and counts as **turn 0**.
- **What a small typed value does next.** **From a full turn typed (−360), a typed −32 unwinds 328°** on both trees (E10a, E10b, E10e).
  From −720 the field shows −360, and −10 lays −370 (E10d, E6).
- **Why it is not a defect.** It is the rule's own boundary ("within one turn nothing changes"): the field shows −360, so −32 is −32. His
  answer 5 ("literal") keeps it.
- **For his eye.** His 11-26 words were "past a full turn the bank shown resets to 0". At exactly a full turn the field shows −360, not 0,
  and the next small number unwinds. Typing −392 rolls on (E9b).

## Rows (checked, at 2067c88)

- **The six files D677 touched:** `node heavy-run.js --run --priority belownormal --cmd … -- node --test` over `core-bank-carry`,
  `core-bank-carry-mutation`, `core-extra-bank-wind`, `core-pieces-ui`, `core-xsec`, `core-xsec-mutation` → **132 of 132**
  (`touched6_tip.txt`).
- **D's harness:** **applied 6 / caught 6 / NOT APPLIED 0**, each mutant caught by its own row (B1 W1, B2 W3, B3 W1, B4 W2, B5 W4, B6
  D641 (f)).
- **No row pins the ghost's bank handle laying in the head's turn** (E1). D's rows type into the field; W4 is the extra handle. The ghost
  handle writes the field (`panel.js:1089`, `show(HD.wrapTurn(value))`, then the field's `oninput`), so W3 covers its arithmetic, not its
  path.
  - checked: E1 does the handle's own write. It does not go through the handle host, which needs a stage this fake DOM does not have.
  - So E1 is the same write, not a pointer drag.
- **Not run by me:** A's 51 files (A: 797 tests, 791 pass, 0 fail, 5 skipped, 1 todo, at 2067c88). His saved tracks: A's copies, 16 + 11, the
  same in every field on both trees, none wound. I did not repeat either. inferred: unchanged, since the range changes no core file.

## Older than the range (listed apart)

- **A freshly closed lap does not round-trip byte-identical on its first save.** serialize → parse → serialize rounds one value
  (`-0.02666662179008527` → `-0.026666622`), then is stable. It holds wound or not, on both trees (`closed_rt.txt`). It is the same kind as
  A's t02 note. The in-memory closed document is not rounded until a parse.

## A's hand-back, against my reading

- **Holds:**
  - the branch and its one commit;
  - the rules for 34, 36 and 51 (I did not re-run them);
  - "None of L's tracks is wound past a turn", and the same for the builder's 17 test tracks (`fixtures_wound.txt`);
  - the harness figures, reproduced (row "Rows").
- **Carried from D unchecked:** "the drags are unchanged" (A, step 4, as D put it). It is false for the ghost's bank handle and for the extra
  bank handle (the verdict).

## Corrections, mine

- **My first-pass item 1 was wrong.** I predicted the offer's base would read +360 from a head past a turn with an untouched bank field
  (`Number('')` is 0). Offers are made only when the field has a typed target (`secHasTarget`, `offersAt` and `extraHandlesNow`), so that case
  never arises. Refuted by reading, before any run.
- **My first E9 failed on my own harness** (it typed into a "turn °/100m" label that does not exist). It was fixed by not typing the turn.
- **A name-pattern run through `cmd /c` ran 1 test and printed nothing**: the quoting mangled the pattern. The whole file was run instead;
  every figure above is from the whole-file runs.
- **My first run of the vary file under mutant F1 ran nothing**: I launched it from the worktree, where the file is not. It was re-applied
  and re-run by the full path, then reverted (`git status` clean, 0 files).

## The machine

- **heavy-run:** the six-file run went through `--status` and `--run --priority belownormal`, in slot 2; B's whole suite held slot 1
  throughout. Every other run was a single small node file at BelowNormal.
- **Removed:** both my worktrees, `Downloads\t180-wt-e-l258` and `-l258b`.
- **Not done:** no commit in the builder, no landing, build or install.
- **Untouched:** his saves and his AC folder (not opened).

SOURCES: the packet's track 1 and reader sections; handback/p-bankcarry-A_2026-11-26.md (whole); handback/p-l258-bankcarry-A_2026-11-27.md (whole); briefs/t180_unmakeable_shapes.md:60-72; builder git diff f3cd425 2067c88; evidence/ (first_pass_E.md, e_vary258.test.js, vary_tip.txt, vary_base.txt, fullturn_tip.txt, closed_rt.txt, fixtures_wound.txt, mutF1_rows.txt, mutF1_vary.txt, touched6_tip.txt)
NEXT: librarian read the verdict when this is rung; the CHANGELOG's drag sentence and the rows' header are for whoever writes the Sculpt-carry packet (`loop/packet_t180_overlay_and_sculpt_carry_2026-11-27.md`), with a row for the ghost handle's roll and one for the flowing offer's value
