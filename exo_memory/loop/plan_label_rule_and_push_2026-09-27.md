# The label rule, and getting both machines' work onto GitHub — in chunks. Librarian, on L, 2026-09-27 04:1x.

*The keeper, 04:11, verbatim: "do 1 and 2 in chunks". Item 1 is to write the label rule into the seats' instructions.
Item 2 is to get the unpushed work onto GitHub.*

## Where things stand, measured

- **The rule's evidence:** `loop/claim_base_rate_score_2026-09-27.md`. Unchecked claims are wrong 8/163 = 0.049
  (bootstrap 0.013–0.093), which lands in the "mark, don't ban" row. Conclusions are 1/41.
- **The keeper's correction at 02:02:** unchecked is not wrong.
- **L:** ahead of origin by 28 commits (`git log --oneline origin/main..HEAD | wc -l`). D's commits after `5ced140` are
  still unpushed, on D only (`git status -sb` on L after the pull: behind 0 at 5ced140).
- **The public repo:** `solariz3d/lighthouse` is PUBLIC, and the private-projects rule applies (memory
  `private-side-projects-off-repo`).
- **The merge risk.** Both machines appended to the same append-only files (`map/*.md`, M.md included) since
  `5ced140`. `.gitattributes` has **no** `merge=union` rule (grep: none), so D's future pull will conflict on those
  files.
- **Where the rule goes:** `consonance/src-tauri/brief/BUILDING.md`, section "WHAT A HAND-BACK OWES" (`:404`). One
  master; other files point to it, never restate it (the carrier rule).

## Chunk 1 — L121, parallel on disjoint files

- **C drafts the LABEL RULE** in the room's plain register, short: a claim says whether it was **checked** (the check
  and its result are shown) or **inferred** (stated as a conclusion, not yet checked). It is allowed either way, and a
  reader who will act on an inferred claim checks it first. It cites the base-rate score. It is **not** a ban, per the
  keeper at 02:02. Proposed placement: a new item under WHAT A HAND-BACK OWES, plus its one-line pointer for replies to
  the keeper. File: `exo_memory/loop/label_rule_draft_2026-09-27.md`. **A draft only; nothing is edited in the brief.**
- **E registers the WATCH**, i.e. how we will know the rule works. Measured on hand-backs and replies after it lands:
  - the share of claims labelled;
  - landed WRONG entries per lap, against the pre-rule baseline, and whether they were labelled inferred.

  It states the falsifier (for example, labelled share stays low after N laps, or landed WRONGs do not fall) and
  names the baseline window. File: `exo_memory/loop/label_rule_watch_registration_2026-09-27.md`.
- **B does the MERGE PREP for item 2:**
  - add `merge=union` in `.gitattributes` for the append-only files: `exo_memory/map/*.md`, `exo_memory/librarian/*.md`,
    and any other append-only file B finds by checking;
  - test it in a throwaway repo, with two branches appending to the same map file, merged with no conflict and both
    lines kept;
  - write a short D-side runbook, `exo_memory/loop/runbook_D_merge_and_push_2026-09-27.md`: pull origin, merge, check
    for conflicts, run the suite, push, for the next desktop session.
- **A does the PRIVACY SCAN** before any push: L's 28 unpushed commits, subjects plus diffs, for private names (the
  side-project names in the memory rule, the keeper's email, tokens `sk-ant`, secrets). Report the findings, and
  whether it is safe to push. File: `exo_memory/handback/p-l121-scan-A_2026-09-27.md`. A does not push.

## Chunk 2 — L122, after chunk 1 is collated

- The librarian reviews C's draft.
- **A lands** the rule into BUILDING.md, adds the pointer lines, regenerates anything generated from the brief, and runs
  the suite.
- **B reads** as the non-author: no contradiction with cite-not-recollect or the numbers rule, and the carriers are
  marked.
- **Then the PUSH from L,** at the keeper's word ("do 2", 04:11). The chair pushes L's main to origin after A's scan
  reads clean and after chunk 2 lands, and posts a board row quoting his words.

## Chunk 3 — on D, the next desktop session

D follows the runbook: pull (origin now has L's night), union-merge the append-only files, run the suite, push D's 09-26
work. **After it, both machines and GitHub agree.** That includes the 09-26 files L recovered from the transcript: the
recovered table yields to D's masters.
