# The rule-layer rewrite, DRAFT (D277 part 3, pane B, 2026-10-09). Nothing here is live.

The plan, with H3 and its revert condition: `exo_memory/loop/plan_lighten_the_load_2026-10-09.md`, part 3. The input is C's census,
`exo_memory/loop/instruction_load_census_2026-10-09.md` (§3 RULE lines, §4 contradictions). The keeper approves these drafts before anything goes live.

## The files
| draft | original | ledger (every block changed, merged, cited, moved or dropped) |
|---|---|---|
| `BUILDING.draft.md` | `consonance/src-tauri/brief/BUILDING.md` (the chair's brief; the chair's assembled `CLAUDE.md` is generated from it and BOOT) | `BUILDING.ledger.md` |
| `COMMITTEE.draft.md` | `consonance/src-tauri/brief/COMMITTEE.md` (panes) | `COMMITTEE.ledger.md` |
| `LIBRARIAN.draft.md` | `consonance/src-tauri/brief/LIBRARIAN.md` | `LIBRARIAN.ledger.md` |
| `CLAUDE.global.draft.md` | `~/.claude/CLAUDE.md` (every session on the machine, every project) | `CLAUDE.global.ledger.md` |
| `CLAUDE.project.draft.md` | `lighthouse/CLAUDE.md` | `CLAUDE.project.ledger.md` |

**Why the drafts are here and not beside the originals:** identity-diff treats every `consonance/src-tauri/brief/*.md` as wake material, so a
`BUILDING.draft.md` there would read as an unshipped wake file and turn it red. The global original lives outside the repo.

**Untouched:** `exo_memory/BOOT.md`, every card, every trace (the ROOM lines), and `brief/THIRD_PLACE.md` (out of scope by the standing rule).

## The diff summary, measured
Command (C's own classifier and capitals rule, lifted verbatim from `instruction_load_census_2026-10-09.census.js` at run time, so both columns
come from one instrument; its "before" column reproduces the census table exactly):

    node measure_drafts.js <lighthouse checkout> <this folder>      (script: handback/p-rule-draft-B_2026-10-09_evidence/measure_drafts.js)

| file | bytes | non-empty lines | RULE blocks (imperatives) | prohibition | positive | no why | MUST/NEVER/…/DO NOT | ALL-CAPS emphasis | bold spans |
|---|---|---|---|---|---|---|---|---|---|
| global `~/.claude/CLAUDE.md` | 8,878 → 12,269 | 75 → 122 | 38 → 31 | 20 → 3 | 18 → 28 | 34 → 1 | 0 → 0 | 2 → 2 | 0 → 0 |
| project `lighthouse/CLAUDE.md` | 504 → 618 | 6 → 8 | 1 → 0 | 1 → 0 | 0 → 0 | 1 → 0 | 0 → 0 | 1 → 1 | 2 → 0 |
| `brief/COMMITTEE.md` | 15,816 → 15,055 | 199 → 178 | 20 → 26 | 11 → 10 | 9 → 16 | 14 → 2 | 0 → 0 | 42 → 3 | 40 → 0 |
| `brief/BUILDING.md` | 69,414 → 31,399 | 824 → 362 | 57 → 41 | 34 → 16 | 23 → 25 | 39 → 12 | 3 → 0 | 262 → 12 | 190 → 17 |
| `brief/LIBRARIAN.md` | 19,620 → 14,090 | 230 → 98 | 29 → 26 | 16 → 7 | 13 → 19 | 21 → 5 | 1 → 0 | 27 → 3 | 61 → 6 |
| **total** | **114,232 → 73,431** | **1,334 → 768** | **145 → 124** | **82 → 36** | **63 → 88** | **109 → 20** | **4 → 0** | **334 → 21** | **293 → 23** |

Reading it:
- **Bytes −36%, lines −42%.** BUILDING carries most of it (−55%).
- **Prohibitions 82 → 36, positives 63 → 88.**
- **No-why 109 → 20.** The 20 left are mostly the classifier's misses: a why one block below a quote, principle text kept verbatim, the
  contradiction sections.
- **The global file GREW, 8,878 → 12,269 B.** Each of its 49 rules gained a one-line why and none was dropped. That is the trade the brief asked
  for; say if it is too much.
- **The 21 ALL-CAPS left are identifiers, not emphasis:** gate names (`P-ONE-STATION`, `P-INBOX`), tool output (`ORPHAN`, `QUEUED`,
  `UNMEASURED`, `VOID`, `NOT APPLIED`), the `WRONG` column, `YYYY`, `HTML`, `CORS`, `HANDOFF.md`.
- **Bold left: 23,** all in principle text kept verbatim. Bold was stripped from every rule line.
- **The classifier is about 65% precise** (C's census §1), so the block counts are estimates in both columns alike.

## The six contradictions (census §4), each resolved and named in its file's "Contradictions resolved" section
1. **Who commits (COMMITTEE:113, :210 vs :117, :240-241).** The 2026-08-26 amendment won. A pane commits by named paths in its own worktree, and
   the chair lands on main. Why: every lap since uses it, and a seat should not read a rule and its repeal in one file. → COMMITTEE
2. **Librarian commits (LIBRARIAN:170 vs :173).** The amendment won: the librarian commits its own files by named paths and never pushes. → LIBRARIAN
3. **Asking the user (global :86, :92 vs BUILDING:758-778).** Both stand, scoped:
   - inside a lap, the chair proceeds on the keeper's prior word;
   - outside a lap, and for any keeper-owned call (push, delete, release, licence, irreversible), ask.

   → BUILDING + global
4. **Suite before reporting (global :3 vs BUILDING:178, :189).** Both stand, scoped: a pane runs the tests that cover its change, under the lock,
   before handing back; the collator runs the full suite before landing or reporting success. → COMMITTEE + BUILDING + global
5. **Committing at all (Claude Code's tool text vs the room).** Answered in our text by the keeper's standing authorisation: committing by named paths
   in your own worktree is authorised on every lap; pushing is not. (We can't edit the system prompt.) → COMMITTEE, pointed to from BUILDING and global
6. **A false path (LIBRARIAN:160).** `C:/Consonance/lighthouse/…` does not exist (checked with `ls`); the notes go to `exo_memory/librarian/` of the
   repository that `room_path` names. → LIBRARIAN

## Paperwork dropped or demoted: each flagged `DROP (D276)` in its ledger
The cites are `loop/loop_friction_B_2026-10-09.md` (0 catches in 38 paperwork refusals) and `loop/loop_friction_measure_2026-10-09.md`
(4.0% of re-sends fixed a claim, 10.0% blurred one).
- **SOURCES exact wording → "list what you read or ran for this message".** On dispatches (BUILDING:258-262) and on rings (BUILDING:512-529 →
  COMMITTEE).
- **NEXT trailer strict grammar → "end a hand-off with who acts next, and when".** BUILDING:212-227, :446-460; COMMITTEE:226-238; LIBRARIAN:283-294,
  :296-298.
- **The collation `OUTPUT → NEXT` line keeps its content** but warns rather than refuses once the keeper switches the gates (BUILDING:462-484 →
  LIBRARIAN).
- **Required defensive sections in hand-backs dropped.** "What the finding does not establish" (COMMITTEE:104-105) is carried by the
  checked/inferred rule. Self-corrections are now a convention, "record corrections plainly when there are any" (COMMITTEE:102-103).
- **Where a gate still refuses today, the drafts say so, with "when the keeper switches the gates"** (E's part 2), so a seat is never told the
  softer rule before it is live.

## Kept for the work checks
Red-first tests, and fix the implementation; amend a test only by name; the heavy-run lock; the collator's full suite; parity; the landing order
(commit before dispatch); named-path commits; pushes only on the keeper's word, with the seal-row exception; the credential scan before any
push; no junction in a handed-over worktree; never quote a credential. Third Place stays enforced by its hook and its own brief, not added here.

## Marked wrong ("this is wrong" is valid)
- **BUILDING:200** "panes work in one checkout": stale since 2026-08-26.
- **BUILDING:350-375** "every hop is two turns": contradicted the 2026-09-03 amendment printed above it in the same file.
- **LIBRARIAN:5-9** "`librarian_intake()` has no reference to the map": stale, since the intake carries `librarian_map_pointer()`
  (`main.rs:7907-7960`).
- **LIBRARIAN:21-22:** a pointer to the wrong section.
- **LIBRARIAN:186-188** "the ferry reminder was ignored 167 times": refuted 2026-08-23 (`loop/lap_2026-08-23.md:73`). The rule stands, with a
  current why.
- **Fact fixes:** BUILDING:848-852, :866-869, :962-974, :976-997 (the source repository is public since 2026-10-08).

## Open for the keeper (not decided by the draft)
- **Source pushes.** On 2026-09-27 the keeper said *"nah push all the work that is correct"* (the chair's memory), while later laps held source
  pushes for his word. The draft keeps the stricter rule (his word, per push; the seal-row exception) until he says which stands.
- **The global file's growth (+38%)** from adding a why to each rule.
