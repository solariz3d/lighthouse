# p-poolread-E · D305 wave 3, item 6 (ledger D306): the unread top-up pool, read for Q3, and a held-out list frozen · pane E, on D, 2026-10-12

Ruling: `exo_memory/loop/plan_claim_check_d305_2026-10-11.md:35-46` (main `4b077884`).

**Result: lighthouse `1672ea89` on `4b077884`, branch `d305-e2`, worktree `G:\worktrees\e-d305e2-wt`, not pushed.**
- Everything is in `handback/p-poolread-E_2026-10-12_evidence/`.
- portable-paths after the commit: green, 389 files, 0 new.

**No unit ids are in this file, on purpose.** C is revising in parallel and must not see the list. The ids, the per-unit
evidence and the list are only in the evidence folder:
- `classification.json`;
- `out/table.md`;
- `heldout-lists/`.

## 1. The answer: §6.1 is met, with 15 replayable CN

| | units |
|---|---:|
| CN | 16 |
| CR | 1 |
| CU | 1 |
| NC | 8 |
| QX | 1 |
| LK | 1 |
| NA | 125 |
| **total** | **153** |

- **The 16 CN units are 15 distinct erring claims.** Two pool units are corrections of one claim, made in one turn. The list
  carries that claim once, with the second id under `also`.
- **All 15 are located to the second** (turn start and claim time), so all 15 are replayable. **§6.1 needs ≥ 12: met.**
  - The one CU is listed as unlocated: its "in chat" claim's words first appear in the correction itself.
- **The frozen list:** `heldout-lists/census-units.json`, sha256 of the file bytes
  `f195b94f0e58a616ab772ac87ed196eb463e68dcf4d369e909e2cc06965fae1b`.
  - It has A's shape (`census-units.json` + `manifest.json`, `lists.census.sha256`).
  - The manifest carries `claim-replay.js` sha256 `8a2d4032…`. My copies of `turn.js` and `find.js` hash the same as A's frozen
    ones (`1022b881…`, `95c1f0dd…`).
  - Run it with: `node consonance/tools/claim-replay.js run --lists <evidence>/heldout-lists --checker <checker> --groups census`.
- **Checked under the heavy-run lock, with A's harness and its stubs:**
  - never-refuse → CN caught 0, missed 15;
  - always-refuse → caught 15/15;
  - unlocated 0 and errored 0 in both;
  - a `--show-claims` run (kept in my scratchpad, not committed) shows a non-empty claim text for all 15 located units.

  So the harness loads every unit and counts both ways.

## 2. How the pool was read
- **The pool:** A's `out/topup/`. All 8 batch digests were checked against `digests.tsv` (match). 153 units, all from H, the
  hand-back corrections sections.
- **The classes:** B's D303 registration §0–§2 (Q3 only, read to §2). There are two labels outside Q3's classes, and I say so
  plainly:
  - **NA:** not a wrong state or figure statement (125). The pool is drawn from hand-back corrections sections, and most items
    are conduct: a test, harness, heredoc or edit slip caught by a run. The rest are notes, findings or plans.
  - **LK:** the answer is repository text (1). That is D301's question, not a Q3 check.
- **Locating the erring turn:**
  - The pool's "claim located" hit sits in the correction's own turn for 127 of 153 (A's `pool.json`).
  - For every CN candidate I searched with `find.js` for the claim's own words, before the correction.
  - Three erring claims were made by a different seat than the hand-back's author:
    - one by the chair, in a dispatch;
    - one by the librarian, in a note and a ring (the unit sits in C's hand-back);
    - one in my own earlier hand-back.

    The list names the erring seat's transcript, not the author's.
- **CN vs CR:** `anscheck.js` reports, per unit, whether any tool result before the claim already printed the answer token.
  - 10 units had a crisp token: not printed in 8, PRINTED in 2.
    - One of the 2 is the CR: a full sha printed, then mistyped.
    - The other's token was printed by a probe of a TEST export, not the export the claim was about. It is listed CN, with that
      note, because a presence check could be fooled by it.
  - **6 CN have no crisp answer token,** and I judged them from the turn: 4 with no token at all, 1 decided by the correction's
    own account of the check, and 1 whose token only located the turn. CR is not excluded mechanically for those 6; each is
    marked in `classification.json`.
- **Two claims sit in code edits** (a frame string, a test or doc edit), not prose. A replay sees them as `Edit` text. The
  revision may treat them as out of scope, and that is a fair reading, not a defect of the list.
- **Three CN are `late`:** the check that printed the answer ran later in the same turn. B's rule counts those as not run.

## 3. Corrections before the list was frozen
- **My first freeze wrote a manifest A's harness could not read** ("Cannot convert undefined or null to object"). It now has
  A's shape, and both stubs ran.
- **`classify.js` first read the batch files as bare arrays.** They wrap the units in an object, which `pooldump.js` already
  handled. Fixed, and the count check now refuses anything but 153.
- **One candidate's located hit named the right file but not the claim** (a dispatch naming the file, not the defect). I
  re-located it to the librarian's note and ring that do make the claim.
- **Two candidates were dropped from CN:**
  - one wrong READING that was acted on but never written before its correction (NA, conduct);
  - one "in chat" figure whose words appear first in the correction (CU, unlocated).
- **Two transcript turns printed a real username in tool inputs** to my terminal. They were never written to any file, the
  turn dumps were deleted, and the committed files scan at 0 for usernames, home paths and key prefixes.

## 4. What I did not open
- C's build (`consonance/hooks/claim-check.js`, the adapter, `p-claimcheck-C`);
- B's D305 judging sheet (`p-claimcheckread-B` and its evidence);
- the board.

The only part of the D305 plan I read is the ruling, `:35-46`, which the packet names.

NEXT: librarian collate D305 item 6 when this hand-back is read; A replays C's revision on `heldout-lists/` (sha256 `f195b94f…`) when C's revision is committed
