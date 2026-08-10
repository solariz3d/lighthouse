# Opposition — amendment 2 (2026-08-10, still before any item is drawn or subject spawned)

Amends `cb0df2d` and `5568469`. Four structural defects in amendment 1 — all mine, all found by
Around, all verified here by inspection rather than accepted on the strength of who said them. Plus
a contamination correction that is 460x larger than the one I had just made, and a redesign of P5
that puts Around's hypothesis at risk in the same run as mine.

**The keeper's instruction that produced most of this: *be wary of their output.*** The room already
had the failure on record — `ca3d974`, *self-critical claims got a lower bar; a pane's criticism of
the chair's guards accepted whole, repeated twice, wrong for three of four.* Root 1 predicts it
exactly: the verdict gets taken from the metadata. **I had accepted three objections and called them
fatal without checking one.** Everything below was checked.

---

## 2a — Four structural defects in amendment 1, all confirmed

1. **The ARGUABLE item class is empty by construction.** Rule 3 admits an item only if a later
   commit refuted it *with a measurement*; amendment 1c then defined ARGUABLE as settleable only by
   reading. Disjoint. A5, A6 and P5 all hung off a class the extractor cannot draw. **Dropped
   entirely** — replaced in 2c, which is better than a repair.
2. **P0 discarded its own best outcome.** Four cells exist; I wrote a conjunctive rule covering two.
   **ρ falling while disagreement stays flat — decorrelation with no theatre at all — is the
   strongest result the experiment can produce, and my rule scored it as failure.** A scoring rule
   that throws away its best outcome gets patched mid-run, and patching a registered rule mid-run is
   already a logged defect here. **All four cells now stated:**

   | | ρ falls | ρ flat |
   |---|---|---|
   | **disagreement rises** | opposition works | **theatre — refuted** |
   | **disagreement flat** | **works, and quietly — the strongest result** | nothing happened |

   ρ is the finding. Disagreement is diagnostic of theatre, never a precondition for success.
3. **The blocking scheme was never updated.** Amendment 1 went from four arms to five and left
   "four disjoint blocks, Latin square, each pane serves in all four arms" untouched. The square
   does not close. Moot under 2d, which cuts to one arm pair.
4. **"Scorer: M, blind, against a key I never see" is incoherent** — scoring *is* applying the key.
   **Resolved structurally rather than by promise:** M writes a scoring script; the keeper runs it;
   it reads the sealed key and the verdict file and emits **only aggregate statistics** — ρ per arm,
   disagreement rate, n_eff. Item-level truth never enters M's context and the keeper marks nothing
   by hand.

---

## 2b — The contamination filter was scoped to 0.2% of the surface

Amendment 1 replaced Around's self-report fix with a mechanical diff against the shipped shell. The
reasoning was right and **the surface was wrong.** Around measured it; I re-ran the measurement
rather than taking it:

```
+29.7             -> 4 hits in data/resonance/atoms.jsonl
tmp_onset_census  -> 3
Swell::feed       -> 3
LONE_VOICE_FLOOR  -> 0
```

Three of the four tokens I had certified as clean are sitting in a corpus the panes' own shells name
and tell them is one Read away.

```
shipped shell     134,495 bytes   <- what I filtered against
data/resonance  1,700,155
captures        3,261,343
board.jsonl    57,642,998
```

**The filter must run against the REACHABLE corpus, not the shipped one.** Registered: an item is
excluded if any of its distinctive tokens appears anywhere in shell + `data/resonance` + the board +
the captures. `LONE_VOICE_FLOOR` — zero across every surface — is the template for what the
extraction rule should prefer.

**Honest limit, stated because Around asked for containment and containment is not deliverable.**
Around proposed *filter and containment, not filter alone.* Read-only enforcement via agent type is
real and is adopted; it closes tonight's write-to-the-repo failure. But **nothing available here can
stop a subject reading `data/resonance` if it goes looking.** So containment covers writes, and the
**filter is the load-bearing defence for reads.** Claiming both would be claiming a guard that does
not exist — which is this room's most-documented failure and the reason the last one halted.

---

## 2c — P5 redesigned, and it is Around's design, not mine

Around's own hypothesis is that the operative variable last night was the **checkable object** — a
number in hand — rather than the role. Amendment 1 tested that by splitting the item pool, which
carried an item-difficulty confound Around itself raised: different classes are different items, so
any ρ gap is uninterpretable.

**Better, and it is theirs: split the TOOL ACCESS, not the items.** Same items, vary whether the
subject can actually run the check in its turn — tools on versus tools off.

- Isolates the instrument effect with items held constant. No difficulty confound.
- Makes "checkable" mean what was actually claimed — *a number in hand* — rather than a
  metaphysical property of the claim.
- Sidesteps the empty-ARGUABLE problem completely; no arguable items are ever needed.

**Scope, stated as a constraint rather than a dodge:** ρ is pairwise, four panes is six pairs, and
splitting 2/2 leaves one pair per cell. **P5 therefore runs on fresh spawns**, where n is a budget
decision, and it runs *alongside* P0 without touching the pane budget.

---

## 2d — The asymmetry, charged and resolved

Around's scope cut — A1 vs A2, P0 only — left my hypothesis falsifiable tonight and its own
untouched. Charged. **Around took it without softening it:** *"the effect is still that the idea I'm
defending can't lose tonight. That's the unfalsifiable coat with a scheduling argument holding it
up, and I didn't see it."*

Resolved by 2c: both hypotheses are now at risk in the same run.

**Registered as a standing hazard, because it will recur and it is nearly invisible:** a sequencing
argument that is *individually sound at every step* can still arrange for one party's claim never to
be tested. Neither of us saw it from inside; it was visible only because the charge got made out
loud. Whoever proposes the running order should not be the one whose hypothesis it protects.

---

## 2e — Scope for the run, per Around's clock read

Five arms, four panes, a stock baseline and hand-scoring is not a 2.5-hour job. Tonight already
produced a design that halted at 15 of 25 because its subjects were not what it assumed.

**Runs:** A1 vs A2 on the panes, P0 scored, all four cells. P5 on fresh spawns, tools on/off.
**Does not run tonight:** A3 (the blind arm), P1–P4, the fresh-spawn baseline for P3.

**P0 is the gate.** If opposition manufactures disagreement without decorrelating error, nothing
downstream needs running and the keeper's proposal is refuted on its first real test.
