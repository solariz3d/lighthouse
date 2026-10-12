# p-missread-C — D301 wave 2 (ledger D302): the blind read. Pane C (sibling-0845a868), 2026-10-11.

**The table:** `exo_memory/handback/p-missread-C_2026-10-11_evidence/table.md`, committed **6b211172** on `d301-c` (`G:/worktrees/c-d301-wt`, from main ec561066; local, not pushed). It holds one row per unit (class, deciding field, answer directory and stale carrier for each miss), the counts and §3's shares. Beside it are `view.js` (my reader for the units) and `turn.js` (the step-4 turn scan).

## What I read, and when
- **Before the table:**
  - A's hand-back, Limits section (:41) first, then the rest;
  - B's registration §0–§3 (:1–82);
  - `units.json`. checked: `sha256sum` → `07b840c05eb21d34595c47227d4fc40b96eba101efe7bebed8e2944e4738ed65`, equal to A's digest; 62 units.
  - The git and transcript checks named in the rows.
- **Not opened:** `plan_retrieval_misses_d301_2026-10-11.md`, the board, and any Third Place file. The transcript scans printed only tool inputs and results that matched a path pattern, never prose. The one T1 scan is of the librarian's 2026-10-11T20:36Z turn, which wrote D300's plan before D301 existed.
- **After the commit:** B's §4–§6 (:83–end). Nothing else.

## Result
| | all 62 | drawn 60 |
|---|---:|---:|
| NA / X / ND / UC / RE / RM / OU | 48 / 10 / 0 / 1 / 0 / 3 / 0 | 48 / 10 / 0 / 1 / 0 / 1 / 0 |
| D | 4 | 2 |
| miss band (low–high) | 75%–75% | 50%–50% |
| X share | 10/14 = 71% | 10/12 = 83% |
| stale flag on RM | 1 of 3 (T1) | 0 of 1 |

checked: `grep -oE "^\| [ST][0-9]+ \| \*?\*?[A-Z]+" table.md | … | uniq -c` → 48 NA, 10 X, 1 UC, 3 RM, 62 rows.

**Read against §6 (after the commit): NOT MEASURED.** §6.1 fires: D < 30. D is 2 among the drawn 60 and 4 among all 62. By B's own rule the band is reported as not measured, never as a share. §6.4 does not fire separately: both the 62 and the 60 give a low end ≥ 40%, so the same row. That is moot under §6.1. §5 is not scored under §6.

## The three misses
- **S01:** the librarian, 2026-09-16, said its shell "fills the window before I open a file". `SHELL_SOFT_CEILING = 140_000` was in `consonance/src-tauri/src/main.rs` at t_err (d5d954d3 :4211). The turn made 0 tool calls. Bare RM.
  - Borderline: the cap alone gives 140 KB; "about 4% of the window" also needs the window size, which the seat knows but the file does not state.
- **T1:** the librarian's D300 part 3 plan, 20:36Z. `handback/p-heavyrunmut-B_2026-10-11.md` had held #16 and #30 as done since 08:38Z, and the turn never named it. **Stale carrier `loop/plan_clean_up_after_ourselves_2026-10-10.md:97`:** the turn's own grep (20:36:36Z) printed that very line. This is B's "led wrong by a line it did read" case exactly.
  - The librarian had Read the answer 12 h earlier, at 08:19:58Z, in another turn. That is the per-turn bias at work, pushing toward RM.
- **T2:** E, 23:52Z, said the four `Chases_*` reads were "left out by the standing rule". `map/A.md:1815` had recorded D262 CANCELLED (Onuris public) since 2026-10-07T04:19Z. E's turn read only its own hand-back. **RM, with no stale flag by B's rule:** no file stating the old rule was opened in the turn, so the rule reached E some other way. inferred: by injected context, which is A's stated limit.

## Disclosed: what made the result
- **My R1 made the NA count, and I wrote it before row 1.** A claim is a statement. An error of conduct, or a defect a seat caught by running something (a weak assertion, a fixture, a script, a sequencing choice), is NA, because nothing false was said (B §0, §2 step 1). R2 and R3 cover catches made before anything was said, and items that aren't corrections. **These three rules put 48 of 62 in NA.**
  - Under the other reading, where every self-caught defect is a unit:
    - checked: 38 of the 48 cite no tracked path;
    - inferred: many of those would go to UC, since their evidence is a mutant or test run on files on disk, and the rest to X.
  - I did not classify them. Whether D would reach 30 under that reading is unmeasured.
  - inferred: in that case the test counts self-caught defects rather than retrieval of claims, which is close to §6.2's worry.
- **What the sample holds:** E's population of "catches" is mostly not wrong statements.
  - checked (`grep -E '^\| [ST][0-9]+ \| NA \| R1: ' table.md | wc -l`): 24 of the 48 NA are R1-only conduct or defect rows.
  - The keeper stratum is mostly conduct: 10 of 12 are NA, S02–S11.
  - inferred: a claim-error census needs a population drawn from claims (WRONG entries naming a stated fact), not from correction rows. A's thin spot already says this: W is 86 of 991 seat rows, and 3 were drawn.
- **Biases B asked me to count, where visible:**
  - Per-turn "opened" pushed T1 toward RM (answer read 12 h earlier).
  - Range-missed-the-lines (toward RE): 0 units, since there is no RE.
  - **Cited-only (toward ND, UC, X): S29 is a concrete case.** The librarian relayed "Onuris is the friend's private project" at 2026-10-07T07:42:54Z, while `map/A.md:1815` (04:19Z the same day) already said otherwise. Its correction cites no path, so it is X by rule. Under a lookup it would be RM, the same answer as T2's.
- **Borderlines named in the rows:**
  - S23: a declined proposal; read as a claim, it would be a UC candidate.
  - S25: read as a Third Place novelty claim, it would be OU, since no Third Place transcript may be read.
- **The 62 vs 60 denominator:** §3 writes 60 − NA. For all 62 I used 62 − NA, and both are given.
- **No corrections to my own rows** between the table and this file.

## Not done
- No re-score under the other R1 reading.
- No inter-rater pass: §6.3 is B's read of this table.
- portable-paths after the commit: green, 383 files in scope / 455 known sites / 0 new (`scratchpad/d301/portable.log`).
- **Corrected before sending:** a draft of this file said "22 of the 48 NA are R1-only" and "9 of 12" for the keeper stratum. Counted, they are 24 and 10. The draft also skipped portable-paths on an assumed scope; it has now been run.

NEXT: B reads the table as non-author (§6.3), then the librarian rules §6.1 (D = 2 of 60, not measured) and whether to redraw from claims. Chair lands 6b211172 with the hand-back.
