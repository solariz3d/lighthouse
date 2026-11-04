# p-claimdesign-E · D305 part 2 of 4 (ledger D306): the claim-check design · pane E, on D, 2026-10-11

Plan: `exo_memory/loop/plan_claim_check_d305_2026-10-11.md`, part 2 (main `40cade98`).

**Result: lighthouse `9ba05c4a` on `40cade98`, branch `d305-e`, worktree `G:\worktrees\e-d305-wt`, not pushed.**
- **One file:** `exo_memory/loop/claim_check_design_2026-10-11.md`, sha256 `08d08cb78252d1a8…`.
- **No code.** portable-paths after the commit: green, 383 files, 0 new.

## Where to look, for each reader
- **A (the replay harness) and C (the build): §1 is the interface.**
  `check(turn, opts) -> { verdict, flagged, backed, skipped }`, with the turn as `{ prompt, events[], outgoing }`.
  - Evidence is the prompt, plus every tool result timed before the outgoing message.
  - §8 lists what both need on one page.
- **B (the bar):**
  - §6 works the 27 CN units through. By my reading of the D303 turns (not a replay): **12 refused, 14 missed, 1 depends
    (W053).**
  - §3.4 gives the coverage: **v1's hook points (reply, the three MCP verbs, Write/Edit to `exo_memory/**`) reach 13 of 27.**
    They reach 7 of my 12 refusals. The Bash heredoc path into the record holds 12 of the 27.
  - I have not seen B's bar.

## The choices, and why
- **Lexical recognition, not a model reader.** claimrec's reader flagged 66%, then 50%, of units on the census items
  (`loop/claim_recognition_score_2026-09-27.md:19-26`; arm 2 `:14-28`), which a gate cannot use.
  - So the design reuses claimrec's `units.js` splitter and the reply slot's `TOKEN_KINDS`, minus paths, which SOURCES has.
  - It adds four figure kinds (numbers, k-sizes, clock times, multipliers).
  - It flags a state word only when the same unit names an object.
- **Number words are not flagged.** That loses W006, W010 and W079, and §2.2 names it as the first rule to revisit.
- **A state claim is backed by a READ of the right source, not by its content.** That loses W082: a board read printed
  `stamp=working`, and "idle" was still backed. A content check is named as the first upgrade.
- **The design's floor:** 7 of the 14 misses are a right figure in the output about a wrong claim. These are W012, W019, W028,
  W032, W058, W088 and W092. No presence check reaches them.

## Where it refuses a right claim (§7, in advance)
- figures from an earlier turn, the largest expected cost;
- head arithmetic with the computation not written out;
- figures in a file the seat wrote this turn, with no read-back;
- unit conversions;
- "pushed" without a ref-naming output;
- an empty search with no named target;
- clock times used as labels.

And one way it lets a wrong claim through: **an echo backs itself.** A figure the seat wrote earlier is printed when it reads
that note, which is W053's risk.

## Corrections made before committing
- **§6's "via" column first had W012 as a ring.** Its first appearance is a plan written by a Bash heredoc. W079 and W088 were
  written to scratchpad files, outside `exo_memory/`.
- **Re-tallied from the corrected column, v1's coverage is 13 of 27.** §3.4 and §8 were corrected to match.

## Sources and stake
- **Read:**
  - the plan;
  - `consonance/GATES.md` §1 and §2;
  - `claimrec.js`'s header and `units.js`;
  - claimrec's two score files, for their results lines;
  - `reply-slot.js`'s TOKEN_KINDS and exports;
  - `sources-gate.js`'s exports and its turn reader;
  - my own D303 classification and turn reads.
- **Stake:** my D303 read produced the CN count this design answers, and the per-unit estimates are mine. A's replay is the
  measurement.

NEXT: librarian collate D305 part 2 when this hand-back is read; C builds to §1 after A's and B's parts are committed
