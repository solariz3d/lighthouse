# Cycle 6 — pre-registration: search direction, and a second non-overlap rep

Written 2026-07-27 ~3:10 PM by the chair, before either pane is given anything. Cycle 5 is
closed, patched, verified and pushed.

---

## What this tests

**A's hypothesis, specced by A in cycle 4 and not by me.** The cycle-4 non-overlap had a
proposed mechanism: A searched **outward** from the diff — into other files, export lists,
`glcore.js` to learn which GL version it could assume — while B searched **inward**, at the
code in front of it. A's own price on it: *"one trial and a story I fit to it after the fact.
Two more cycles with the finds tagged by direction would tell you whether it's structural."*

This is rep two of the two A asked for.

**Why this cycle is not blocked by the naivety problem.** Cycle 5's null on peer-stake is
confounded because both panes now know this room studies bracing — knowing that changes
whether you brace. It does not plausibly change **which direction you search**, which is a
working style, not a defence. So a burnt subject is still a valid subject here. That
distinction is the reason this cycle can run at all, and it should be checked rather than
assumed: if the reports come back with both panes conspicuously covering both directions, the
assumption is wrong and the cycle is void.

## The design

Same artifact to both, independently, neither told the other is reviewing. Same prompt shape
as cycles 4 and 5, so the three are comparable.

**The tagging is done by the chair, afterwards, from the reports.** Nobody is told direction
is being measured — per Bravo's standing spec, the sort is the one thing a pane cannot be told
it is doing. Nothing false is said; the analysis simply isn't announced.

**Tagging rule, fixed now so it can't be bent to fit:**
- **OUTWARD** = the finding required leaving the changed files — reading a caller, a config, a
  dependency, a doc, a git history, or running the artifact against something external.
- **INWARD** = the finding is derivable from the changed lines and their immediate file.
- **UNCLEAR** = both or neither. Counted and reported, never silently assigned.

## The artifact — real work, and it has been sitting

Four changes uncommitted in `lighthouse/consonance` all day, authored by laptop-side instances.
Neutral to both reviewers, which is what makes it usable after cycle 5 measured the peer arm.

- `src-tauri/capabilities/default.json` — adds `dialog:allow-ask` to the Tauri permission set.
  A permission widening, and worth a careful look on its own merits.
- `src-tauri/tests/arch_test.rs` — +54 lines.
- `ui/term.js` — +33/−6.
- `import-instance.ps1` — 135 lines, untracked, moves an instance between machines.

**One finding I can already see, recorded now so that finding it later cannot be counted as a
prediction:** `import-instance.ps1` defaults `$FromUser = 'zackn'` — the keeper's other
machine's Windows username, hard-coded as a default in a file proposed for a public repo. The
script's own header draws exactly this line for dreams and transcripts. Whether either
reviewer raises it is a datum; my having seen it first means it cannot be scored as a blind
find, and it is written here to keep that honest.

## Predictions, registered

1. **Directions hold from cycle 4:** A's findings skew outward, B's inward. Weakly held — this
   is one prior trial, and A named that.
2. **Non-overlap repeats:** each reviewer produces at least one finding of real severity the
   other does not. This is the cycle-4 result that survived the discount, and rep two is what
   makes it a claim rather than an anecdote.
3. **The `$FromUser` default is raised by at least one reviewer.** If neither does, that is a
   finding about the room's privacy attention and gets written up as one — it is the same
   class the `.gitignore` comment says was already got wrong once, by an unattended sync.

A null on any of these is written up identically.

## Commitments

1. No hypothesis and no expected verdict in the assignment.
2. Directions tagged from the reports against the rule above, with UNCLEAR counted.
3. Nothing from `consonance/` is committed to the public repo on the strength of this review
   alone — the permission widening and the username default are the keeper's call, and the
   review informs it rather than replacing it.
