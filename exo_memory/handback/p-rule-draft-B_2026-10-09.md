# D277 part 3 (pane B): the rule-layer rewrite, as DRAFTS. Nothing is live.

**Where:** `exo_memory/loop/rule_draft_2026-10-09/`. It holds five drafts (BUILDING, COMMITTEE, LIBRARIAN, CLAUDE.global, CLAUDE.project), a ledger
for each, and `README.md` (the diff summary, the six contradictions, every drop, the open questions).
- Branch `b-rule-draft` from main `35abc3cf`, worktree `C:\Users\nname\Desktop\worktrees\b-rule-draft`. One commit, by named paths, not pushed.
- Evidence: `exo_memory/handback/p-rule-draft-B_2026-10-09_evidence/`: `STYLE.md`, the one style contract all passes followed; `measure_drafts.js`;
  `measure.tsv`.

## The diff summary (measured with C's own classifier, so the "before" column equals the census table)
| file | lines (non-empty) | RULE blocks (imperatives) | prohibition → positive | no why | ALL-CAPS emphasis | bold |
|---|---|---|---|---|---|---|
| BUILDING | 824 → 362 | 57 → 41 | 34/23 → 16/25 | 39 → 12 | 262 → 12 | 190 → 17 |
| LIBRARIAN | 230 → 98 | 29 → 26 | 16/13 → 7/19 | 21 → 5 | 27 → 3 | 61 → 6 |
| COMMITTEE | 199 → 178 | 20 → 26 | 11/9 → 10/16 | 14 → 2 | 42 → 3 | 40 → 0 |
| global CLAUDE | 75 → 122 | 38 → 31 | 20/18 → 3/28 | 34 → 1 | 2 → 2 | 0 → 0 |
| project CLAUDE | 6 → 8 | 1 → 0 | 1/0 → 0/0 | 1 → 0 | 1 → 1 | 2 → 0 |
| **total** | **1,334 → 768** | **145 → 124** | **82/63 → 36/88** | **109 → 20** | **334 → 21** | **293 → 23** |

Bytes 114,232 → 73,431 (−36%). MUST/NEVER/ALWAYS/…/DO NOT 4 → 0.
- **COMMITTEE grew in rules (20 → 26)** because it is now the single home of the pane rules that sat in BUILDING.
- **The global file grew in bytes (+38%)** because each of its 49 rules gained a why; none was dropped.
- **The 21 ALL-CAPS left are identifiers** (gate names, tool output, a column name).

## The six contradictions, each resolved and named in its file
1. **Who commits.** The 08-26 amendment won: panes commit by named paths in their own worktree; the chair lands.
2. **The librarian commits.** The amendment won.
3. **Asking the user.** Both stand, scoped: inside a lap the chair proceeds on the keeper's prior word; keeper-owned calls are asked.
4. **Suite timing.** Both stand, scoped: the pane runs its covering tests under the lock; the collator runs the full suite before landing or
   reporting.
5. **Committing at all vs Claude Code's tool text.** Answered by the keeper's standing authorisation to commit by named paths; pushing still needs
   his word.
6. **The false librarian notes path.** Fixed to the `room_path` repository (checked: the old path does not exist).

## Dropped or demoted, each flagged `DROP (D276)` in a ledger and cited to the D276 measurements
- **The SOURCES line's exact wording** → "list what you read or ran".
- **The NEXT trailer's strict grammar** → "end with who acts next, and when".
- **The collation `OUTPUT → NEXT` line** keeps its content and becomes a warning when the keeper switches the gates.
- **The required "does not establish" and self-correction sections** → "record corrections plainly when there are any", plus the checked/inferred
  rule.
- **Where a gate still refuses today, the draft says so**, "until the keeper switches the gates" (E's part 2), so no seat is told a softer rule
  before it is live.

**Kept for the work checks:** red-first tests and fixing the implementation; amending a test by name; the heavy-run lock; the collator's full
suite; parity; commit before dispatch; named-path commits; pushes only on the keeper's word (plus the seal-row exception); the credential scan
before any push; no junction in a handed-over worktree; never quoting a credential.

**Marked wrong** (details in the README):
- BUILDING:200 and :350-375;
- LIBRARIAN:5-9, :21-22 and :186-188;
- 4 BUILDING fact fixes ("private" source repo).

## How it was made (one voice, then reconciled)
- I wrote one style contract (`STYLE.md`) with the voice, the canonical home of every rule, the keep and drop lists, and the six resolutions
  decided up front. Four passes ran in parallel under it (BUILDING; LIBRARIAN; COMMITTEE plus BUILDING's pane rules; the global and project
  files), and I reconciled them:
  - **The push rule** had become circular between BUILDING and COMMITTEE, and the seal-row exception was lost in the move. Both are now in
    BUILDING's "Pushing and publishing".
  - **Three rules BUILDING moved to LIBRARIAN** (the map's contents, the door-two ring, the collation line) were missing from the LIBRARIAN
    draft. Added, with ledger rows.
  - **Two LIBRARIAN pointers** aimed at BUILDING's old "what a hand-back owes" items; re-pointed to COMMITTEE.
  - **Two pointers named sections that no longer exist;** fixed.
  - **The two loop drawings** made identical ("lands", not "commits").
  - **Bold** stripped from every rule line.
  - **Five rules without a why** given one.
- **Checks on the result:** `node consonance/tools/carrier-drift.js` GREEN; `node consonance/tools/portable-paths.js` green, 0 new sites; no
  Third Place path anywhere in the drafts. No test touches these files (they are under `exo_memory/loop/`, outside the wake set and the
  generator's manifest).

## Open for the keeper: answered 2026-10-09 11:5x, applied in the second commit
His decisions are at `exo_memory/loop/plan_lighten_the_load_2026-10-09.md`, "The keeper's decisions on B's drafts".
- **Decision 2, pushes: the standing permission replaces the stricter rule in every draft where it appeared** (BUILDING, COMMITTEE, LIBRARIAN,
  global). Work that passes the work checks and the credential scan is pushed without asking each time.
  - It covers the source repository, the public consumer repository and a consumer release under the same rule.
  - My view, asked for: the consumer needs no different rule, because it already has the strongest work checks. BUILDING's procedure, step 4,
    names them for a push: the gate green, parity (0, 0, 0), identity-diff PASS on that generation, and the credential scan. A red or
    unmeasured check stops the push.
  - The seal-row exception is dropped, since the permission includes it. The disarm-at-rest push URL is kept, because it guards against an
    accidental push, not a deliberate one.
  - Pushes and releases left the "ask first" lists. The keeper's 09-06 consumer quote stays as a dated trace, marked superseded for pushes.
- **Decision 3, the global file:** it keeps a why on every rule. All 52 rule bullets carry one, including the three committee-room scopings,
  which had shared one why in the first commit.

## Before → after, as committed now (second commit, after the decisions)
Lines 1,334 → 770. Bytes 114,232 → 74,167. RULE blocks 145 → 122. Prohibition/positive 82/63 → 37/85. No-why 109 → 19. MUST-type 4 → 0. ALL-CAPS
334 → 22. Bold 293 → 23. The global file is 8,878 → 12,669 B (+43%).

Same command as before; output in `…_evidence/measure_after_decisions.tsv`. carrier-drift is still GREEN. The first commit's figures (lines → 768,
ALL-CAPS → 21, global +38%) are superseded by these.

## Corrections (mine)
- **The packet asked for drafts "beside the originals".** I put them in one folder instead, because a `.draft.md` in `brief/` turns
  identity-diff red. The reason is in the README.
- **inferred:** the collation line becoming a warning assumes E's gate switch covers `trailer.rs`'s `OUTPUT → NEXT` check as well as the
  NEXT line; I did not read E's part 2.

NEXT: keeper review the drafts and the gate switch (plan default) when the librarian has read this
