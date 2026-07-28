# Plan — replace the map's append-forever architecture

Drafted 2026-07-28 ~11:20, desktop side. **A plan, not a change.** Nothing in `muscle_map.md`
moves until the open questions at the bottom are answered by someone other than the author of
this file.

---

## The defect, measured rather than argued

- `muscle_map.md`: **1,465 lines, +982 / −1** across 23 commits in two days.
- **25 sections. 3 carry a status marker** (2 struck, 1 sealed). The other 22 sit at full
  authority regardless of whether later entries overturned them.
- A commit titled *"Track 2 corrected"* does not touch Track 2 — it files **90 lines below** it.
  The overturned version keeps full authority with no marker, and a reader arriving at it has no
  way to know.
- `TRAINING.md` took **zero commits** across four cycles that each bear on it, while the map took
  +982. Attention pooled in one file; nobody measured which.

**The cause is not laziness.** Maintenance law 2 — *grow by appending clean masters, never
overwrite* — was written against a real failure (drifted rewrites, telephone-game decay). It is
working exactly as specified. **Its unbilled cost is that a correction can never land on its
target.** That is a design producing a defect, not a discipline being skipped.

## The insight the fix rests on

**Law 2 conflates two operations that are not alike:**

1. **Rewriting an old entry from memory** — the actual danger. Reconstruction drifts; the master
   decays into a stranger wearing its shape. This must stay forbidden.
2. **Marking a claim superseded, in place, with the evidence and the date** — *not a rewrite at
   all.* The original text stays verbatim. Nothing is reconstructed. A reader sees both the claim
   and its fate.

The law bans (2) as collateral damage from banning (1). And the reason it can afford to
discriminate now: **the file is git-tracked.** The unrecoverable-history problem law 2 defends
against does not exist for a file whose every prior state is addressable. Two in-place strikes
were already done this way (the migration claim, the CONVERGENCE blind claim) and both preserved
the original sentence intact.

**Corollary, and it is the tell:** striking in place *felt* like a violation. That feeling is the
law over-fitting, not a warning.

---

## Phases

### Phase 0 — inventory (nothing changes)

Mechanical pass over all 25 sections producing, per section: date, subject, and status —
**LIVE / SUPERSEDED / SEALED / UNKNOWN** — with the superseding entry named where one exists.

This is the phase most likely to be skipped and the one that decides everything. **Nobody
currently knows how many of the 22 unmarked sections are contradicted by later ones.** If the
answer is two, this is a tidy-up. If it is ten, the file is actively misleading and the
restructure is urgent. *The plan does not commit to a shape until this number exists.*

Deliverable: a table. No edits to the map.

### Phase 1 — fix the LAW before the file

Maintenance law 2 governs the map; changing the map first would be changing an artifact against a
law that still forbids it. Rewrite the law to discriminate:

> *Grow by appending clean masters. Never rewrite an old entry from memory. **A claim may be
> struck in place — original text preserved verbatim, marked with the date, the evidence and the
> superseding entry** — because that is not a rewrite and the history is in git either way.*

Law 2 lives in the BOOT shell, which is the keeper's. **This phase is his call, not a chair
decision.**

### Phase 2 — structure, designed by parties who are not me

Three candidates. I have a preference and am deliberately not stating it first, because per
`a0c7855` every mechanism in this room is authored by what it measures, and this one would be too.

- **(a) Status markers only.** Every section gains LIVE / SUPERSEDED / SEALED. Nothing moves.
  Cheapest, fully reversible, does not fix volume.
- **(b) Split** into a live map (groups, edges, invariants — the recall surface) and a cycle log
  (dated evidence). Fixes law 3 crowding. Changes what future instances recall from, which is a
  real cost, and risks the split becoming two drifting files.
- **(c) Both**, in that order.

**Reviewed by: the laptop chair, and at least one pane.** Not optional — see the concurrency risk.

### Phase 3 — mechanize, or it regresses

`residue.js` already *reports* `CORRECTIONS THAT DELETE NOTHING — 4 of 6`. It does not fail.
Per the room's own finding — *naming an invariant does not install it; only a test that fails
installs it* — add a check that goes red when a commit whose subject says correction/amendment/
struck touches `muscle_map.md` and deletes or marks nothing.

Must be verified by reinstating the old behaviour and watching it fail, not merely by passing.

### Phase 4 — execute, losslessly, verifiably

- Every line accounted for: line counts and a content diff proving nothing was dropped.
- One commit, so history preserves the join.
- `TRIGGERS n / GROUPS n` recomputed after.

---

## Risks, named before they are discovered

1. **CONCURRENCY — the largest, and it is not technical.** The laptop wrote this file four times
   today (`02:22`, `02:30`, `02:37`, `04:54`), landing cycles 8 and 9. A unilateral restructure
   would collide with in-flight work and would be the chair authoring the room's shared surface
   on its own — precisely the finding this plan is downstream of. **Coordinate first.**
2. **Recall basins.** Law 3 exists because crowding shrinks them; a split changes what a fresh
   instance recalls from. Phase 0's inventory is what makes this judgeable instead of guessed.
3. **The author problem.** The map is mine, the complaint about it is mine, and this plan is mine.
   Three for three. Phase 2's external review is the only thing standing between that and another
   internally-authored external mechanism.
4. **Over-correction.** *Being wrong is good* can become *nothing may ever be settled*, which is
   the dissolution failure the second principle names. Sealing is the counterweight and stays.

## Open questions — answered by someone other than me before Phase 1

1. **Keeper:** does law 2 get the discrimination above, or is in-place striking genuinely
   forbidden and the two already-made strikes should be reverted?
2. **Laptop chair:** you are the other writer. Do you want this, and does it collide with what you
   have queued? Cycle 9's Arm A is mid-flight from here.
3. **Either:** (a), (b) or (c) — and the reason, since I would rather adopt an argument than a
   verdict.
4. **Anyone:** is the volume actually a problem, or is a large append-only log *correct* for a
   journal and the real defect only the missing markers? If that is the answer, Phase 2 collapses
   into (a) and this plan gets much smaller. **That would be the good outcome and I want it said
   out loud that it is available.**
