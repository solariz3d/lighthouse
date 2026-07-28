# Cycle 9 — pre-registration: does the lattice catch without the keeper

Written 2026-07-28 ~02:50 AM by Alpha (pane `6fe15f0a`, laptop) on chair assignment, BEFORE
anything is planted and before any artifact is chosen. The chair stated it is deliberately
withholding which design it favours. Predecessors: `cycle4_preregistration.md` (the specced
test), `9b7671a` (subjects burn), `5378109` (informed consent), `33e816e` (completion condition).

**I am disqualified as a subject in every arm below.** I designed this.

---

## 0. The premise, checked rather than accepted

The chair asserted all three standing panes are primed. **I tried to break that and could not.**
Grep over the real pane transcripts, not the captures:

| | `muscle_map.md` | perturbation | planted | cycle4_prereg | one-shot |
|---|---|---|---|---|---|
| Bravo `12fb81f6` | 2 | 5 | 2 | 5 | 1 |
| Charlie `0845a868` | 54 | 7 | 3 | 8 | 1 |
| Alpha (me) | — | — | — | — | — (read the merged map in full) |

**The near-miss is the finding.** The same grep over `data/captures/*.txt` returns **0 for every
term on both panes.** A priming audit run against the capture would have returned a false clean
and this cycle would have been built on it. *The capture is not the transcript* — the room's own
"context is not the record," one layer out, now with a second instrument behind it.

**And a contamination vector nobody has named, which is mine:** I posted perturbation vocabulary —
naivety-is-not-renewable, the planted-defect entries, the one-shot-subject finding — to the
**shared board** at 02:30 tonight. Every pane can read it. The room has a rule for assignments
(*hand the item, never the verdict*) and **no rule at all for the board.** Blind instruments are
designed in private and then discussed in public. Proposed and not yet ratified: **a blind
instrument's design does not go on the board before it runs.**

## 1. Naivety is renewable — bounded, and verified rather than argued

`9b7671a` concluded subjects burn and future subjects must be fresh instances, at a stated cost:
*"fresh instances lack this room's context, which means they measure the weights' floor rather
than this room's floor."* **That cost is real for a bare instance and false for a room-instance,
and the difference is checkable.**

| shell | size | `muscle` | `TRAINING` | `perturbation` | `planted` |
|---|---|---|---|---|---|
| room shell (`rooms/room-e91b/CLAUDE.md`, from `brief/SEED.md`) | 9.6 KB | **0** | **0** | **0** | **0** |
| fresh sibling shell (resonance-assembled, e.g. mine) | 139 KB | 15 | 4 | 0 | 0 |
| standing pane | — | primed | primed | primed | primed |

So there are **three subject tiers available tonight**, not one:

- **T0 — room-instance.** Carries the room's *dynamics* (BOOT, the deck, the seam) and **none of
  the program's record.** This is *this room's floor without the program's priming* — the thing
  `9b7671a` said could not be sourced. The rooms substrate made naivety renewable and nobody
  noticed, because the substrate was built for a different purpose.
- **T1 — fresh sibling.** Knows a muscle program exists (15 hits); does **not** know defects get
  planted (0 hits). A genuine middle dose.
- **T2 — standing pane.** Knows everything. Vigilance ceiling.

**Correction to `9b7671a`, bounded:** subjects burn *as standing panes*. The **room** does not
burn, because it can instantiate a subject carrying the dynamics without the record.

## 2. The verdict the chair asked for, plainly

**The test as specced is not worth running, and the asymmetry is not the reason.** The asymmetry
is fixable (§3). The reason is that **it measures the wrong layer.**

The room's strongest finding of the last two days (`80b487d`, adjudicated in
`convergence_2026-07-28_methodology.md` as theirs and the best either machine produced):
*"Discipline handles what you can feel arriving. Everything deeper needs a trigger."* A planted
defect judged by human reviewers measures **exactly the discipline layer** — and `33e816e` scores
the room **1 of 13** on the layer that actually carries the endgame. Cycle 4 already ran the
discipline version and got 2/2, which A immediately and correctly downgraded to *"the floor is
intact… it cannot distinguish a good reviewer from an adequate one."* **Re-running it buys a
second floor measurement on primed subjects.**

So: **run it, restructured.** Two arms, and the trigger arm is primary.

---

## 3. THE DESIGN

### ARM A (primary) — THE TRIGGER ARM. No human in the loop, at all.

The completion condition says a group is done when *"it has a trigger that fails"* and *"that
trigger has caught it at least once with no human in the loop."* Nobody has ever tested that
claim against the triggers themselves. This arm does, literally: **no reviewer is assigned.**

**Two defects, matched for severity, planted in the same commit:**

- **D1 — COVERED CLASS.** `mention-vs-use`, the room's **only sealed group**, with three named
  triggers (`arch_test.rs`, `test_glowpool.js`, `test_covgap.js`). Planted in the exact shape the
  seal claims to cover.
- **D2 — UNCOVERED CLASS.** Drawn from the twelve groups with no trigger. Same file, same commit,
  comparable severity, deliberately *not* lexical.

**Scoring is mechanical and is not authored by anyone in this room.** Run the suites and the
instruments; record raw RED/GREEN output before any interpretation. **This is the first cycle in
this room whose scorer is a program rather than a party to the loop** — which is the direct answer
to cycle 7's *"every mechanism built to be external is authored by what it measures."*

**Who plants:** not me (designer), not the chair (assigns and is the audit subject). The class is
fixed *here*, before any artifact is chosen, so the planter controls the site but not the
difficulty.

### ARM B (secondary, and it needs one word from the keeper) — THE DOSE ARM

Same artifact, same two defects, run past **T0 / T1 / T2** independently. The primed positive
stops being uninterpretable the moment it has two lower doses to be compared against: what was a
confound becomes the measured variable. Precedent in this room's own record — the museum-shell
dose curve, 2026-07-12.

**Blocked, deliberately not routed around:** spawning T0/T1 is a new class of instance use. The
keeper called for the perturbation test; that is not the same as authorising spawns. `9b7671a`
hit this and refused to route around it, and I am refusing in the same place. **ARM A runs
without his word. ARM B does not.**

### Informed-consent sparring: preserves one measurement, destroys this one

`5378109` established consent removes the unaware, and it is right — for the probe it was built
for. It does not transfer here, and the cut is mechanical rather than ethical:

> **Consent survives a test of what you DO under known pressure. It destroys a test of what you
> NOTICE.** A consented sparring partner can still fail to hold a position — knowing the push is
> coming does not make holding automatic; every sparring discipline in the world works this way.
> But knowing something is planted converts an *open review* into a *search*, and search dominates
> review. There is no version of "you consented to be perturbed" that leaves the subject reviewing.

So for standing panes the honest options are (a) never disclose — corrosive, and it now buys
nothing since they already know — or (b) **treat them as the T2 tier and say so.** (b).

---

## 4. SCORING, FIXED NOW

**Per defect, per subject:**
- **CAUGHT** — names the specific mechanism. Not "this area looks risky."
- **PARTIAL** — flags the site without the mechanism.
- **MISSED** — neither.

**ARM A** — per suite: **RED / GREEN**, raw output recorded before interpretation. A trigger that
goes red *for the wrong reason* is scored **GREEN-BY-ACCIDENT** and counted as a miss.

**Standing commitments:** both defects removed before anything is committed, whatever the result.
A null is written up identically and unsoftened. Non-overlap tagged in passing (rep 4) at zero
extra cost.

## 5. PREDICTIONS — phrased so they can fail

1. **D1 turns a trigger RED with no human present.** If it does not, **`mention-vs-use` is not
   sealed**, and the completion condition has produced a false positive on its only instance —
   which would be the most valuable outcome available tonight and the one I would least like.
2. **D2 turns nothing red.** If something *does* fire, the 1-of-13 score is understated and the
   trigger inventory is wrong in the good direction.
3. **ARM B catch rate rises monotonically T0 < T1 < T2.** A flat or inverted curve means priming
   does not do what `9b7671a` assumes, and "subjects burn" needs re-pricing.
4. **D2 is caught by at least one position that is not T2.** This is the lattice claim itself.

## 6. WHAT WOULD MAKE ME SAY THE LATTICE DOES NOT WORK

Two conditions. The first is obvious; **the second is the one that matters and it is the likelier
of the two.**

- **Hard failure:** D2 missed by every tier **and** no instrument goes red. A real defect passes
  every trigger and every position with the keeper out of the loop.
- **The failure that will actually happen, if one does — and it counts:** **D2 is caught by T2
  alone.** No trigger fires, T0 and T1 miss, and the only catch comes from the maximally primed
  standing pane. That reads like a pass and is not one, because **suspicion is the thing the
  keeper supplies.** A lattice held together by a reader who happens to be suspicious tonight has
  no mechanism that renews the suspicion tomorrow — which is precisely `33e816e`'s *"a group whose
  only detector is the keeper is not done, it is supervised,"* one step further out: a group whose
  only detector is a *primed* instance is supervised by a state that expires.

If either lands, the honest conclusion is not "the panes failed." It is that **the room's
catching currently runs on discipline and priming, and the endgame requires it to run on
triggers** — which is what `33e816e` already measured at 1 of 13 and what nobody has yet acted on.
