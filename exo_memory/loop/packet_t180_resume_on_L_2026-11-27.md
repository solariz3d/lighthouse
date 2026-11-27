# Packet (on L; roles, the chair picks the panes): pick up D's two stopped T-180 builds

**His word,** 2026-11-27 00:23 on L: "back, there should be the relevant handoffs and points to start the work back up from
where desktop left off", then "for track builder too". Yesterday 23:00 on D (verbatim in `briefs/t180_unmakeable_shapes.md:45-50`).
Read first: `loop/handoff_t180_2026-11-26-D.md`, then the two hand-backs named below. Plans name roles; the chair picks panes
(`BUILDING.md:137-145`).

**Checked on L at 00:2x** (`git fetch`, `git rev-parse origin/<branch>`): `l-bankcarry-a` 2067c88, `d677-right-width-b`
e41acb1, `landing-1126-batch` f3cd425 (the base of both), `landing-1126` 62f5b95, `o1-turn-share-e` 0eb3448, builder `main`
3b33b38. heavy-run: both slots free. L has no `G:` drive and no `reads/` folder in the builder.

## What did not travel from D (say so in the hand-back; do not guess around it)

- Every scratch script and list under `G:\consonance-scratch\` on D: `panelfiles.txt`, `suite.sh`, `bytes.cjs`, `mnm.js`,
  `lapexport.cjs`, the copies of his 27 saved tracks and 16 undo sidecars.
- The [T5] read and its tooling (the key is local on D, by rule). So **falsifier (b) of the cross-section plan cannot be run
  on L**; it stays owed to D.
- L's installed app is still the 11-26 morning build, 0ab6cc8. D has f3cd425. No build for install on L without his word.

## Track 1, the bank past a full turn (`l-bankcarry-a` 2067c88): a continuing builder

Hand-back: `handback/p-bankcarry-A_2026-11-26.md`, "Where it stopped".
1. Run the app test files that load `panel.js`, whole, through heavy-run. D's list was 34 files and stayed on D. On L a plain
   grep of `panel.js` over `app/test/*.test.js` on the branch finds 49. State the rule your list is made by; if you cannot
   reproduce 34 by a rule, run the 49.
2. Re-run `app/test/core-bank-carry.test.js` (7 rows) and `app/test/core-bank-carry-mutation.test.js` (8) after the
   comment-only edit; report applied / caught / NOT APPLIED.
3. His saved tracks on L: open and round-trip on f3cd425 and on the branch, from COPIES; his folder is never written to.
   L's set may differ from D's 27; give L's count.
4. Do not change the rule for typing or for drags. Two questions are with him (below); the build waits on them only for
   those two behaviours.
Tier: prove it for the touched rows; the whole suite is the landing's, once.

## Track 2, the right side's own width (`d677-right-width-b` e41acb1): a continuing builder

Hand-back: `handback/p-d677-right-width-B_2026-11-27.md`, "Where I stopped".
1. The rows first, on L: `test/core_right_width.test.js` (15) and `app/test/core-right-width-panel.test.js` (5; edited once
   after its last run on D, so its 5/0 is inferred until re-run).
2. The whole suite once on the branch tip, under heavy-run (D's run stopped near 1,160 passes and is not a pass). The
   builder's whole suite took 1,562 s and 2,470 s on earlier landings (`handback/p-d537-landing-C_2026-10-29.md`).
3. The mutation harness `test/core_right_width_mutation.test.js` (30 mutants, never run), and the existing harnesses that
   name `document.js` and `extend.js` (listed in the hand-back, step 3): applied / caught / NOT APPLIED.
4. Old tracks' export hashes, base f3cd425 against the branch: D's `mnm.js` did not travel. Write the comparison again on L
   (the shell's `buildExport` per saved track, a hash per file) over copies of L's saved tracks. Every hash must match.
5. Not on L: falsifier (b) on [T5]. Leave it named as owed.

## Then, each track: a read by a seat that wrote none of it

The reader varies what the author fixed (other heads, other widths, a closed lap, an old track), does not re-run the
author's commands only, and ends CLEAN or NOT CLEAN.

## Not in this packet

- No landing branch, no build, no install, no merge to the builder's `main`, no release: each waits for his word.
- `o1-turn-share-e` stays parked (0 measured gain; C's F5 and F6 open).
- Class 1 of the catalogue (too many pieces) has no known cause; nothing is ordered on it here.

Hand-backs to the librarian, claims marked checked or inferred, by `call_librarian` with the file's path.
