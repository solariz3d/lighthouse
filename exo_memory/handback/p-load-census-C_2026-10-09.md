# D277 part 1 (C): the instruction-load census, measured

**The census:** `exo_memory/loop/instruction_load_census_2026-10-09.md`. Beside it are the address files for B, `…rules.tsv` (145 RULE blocks, `path:start-end`) and `…blocks.tsv` (every block with its class), and the instrument `…census.js`. Measure only; nothing was changed.

- **Rule (stated in §1):**
  - the unit is a paragraph or list-item block;
  - a block is RULE if a sentence starts with an imperative or the block carries a strong modal; BOOT and cards are ROOM by the plan's definition;
  - one revision (v1 → v3) after a spot-check, named.
- **Measured error:** a hand-labelled seeded sample (20 + 20) gives **RULE precision 65%**, with **20% of ROOM blocks being missed rules**. The counts are estimates, and the address list is a candidate list.
- **Headline:**
  - **Rule-type sources:** 114,240 B (~28.6k tokens), 145 RULE blocks.
  - **Prohibitions vs positive instructions:** 82 to 63.
  - **No stated why:** 109 of 145 (75%), and 34 of 38 in the global file.
  - **Capitals:** canonical capital words are nearly absent (2 MUST / 2 NEVER / 2 REFUSE). The emphasis is ALL-CAPS phrases (BUILDING 262) and bold (BUILDING 190, BOOT 126).
  - **BUILDING** is 61% of the rule-type bytes.
- **Assembled wake files:** main 110 KB, librarian 141 KB and this pane 109 KB (~27-35k tokens). The SessionStart hook adds 12-13 KB per start, mostly session-timestamp digests.
- **Contradictions, with both sides' `path:line` in §4:**
  1. who commits (COMMITTEE:113/:210 against their own amendments :117/:240);
  2. LIBRARIAN:170 against :173;
  3. global:86/:92 "ask" against BUILDING:758/:764 "no questions inside a lap";
  4. global:3 "run the suite before reporting" against BUILDING:178/:189;
  5. Claude Code's "commit only when the user asks" against COMMITTEE:131-147;
  6. LIBRARIAN:160's notes path, false on this machine.
- **Gaps, stated:**
  - **Hook texts this transcript never received** (gate refusals, the reply slot) are not measured, and **the precompact directive** wasn't captured (it prints a different JSON shape).
  - **The Claude Code system prompt** is out of scope.
  - **The labelled sample is one reader's judgment** (mine).
- **A slip:** one read-only `node -e` (listing settings.json hooks) ran outside the heavy-run lock. Every other measurement ran inside it.
