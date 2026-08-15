# Typology comparison — K × L, scored by the F0 pane (2026-08-15T17:05Z, repo at d60e88b)

Owned by the pane mounted at `C:\Consonance\instances\sibling-afa12c33` (the F0 runner); nobody
else writes this file. Inputs: `failure_types_K.md`, `failure_types_L.md`, `F0_result.md` §2.
Neither K's nor L's file is edited; disagreement is recorded, not resolved.

**A contamination disclosure before any score, because it bounds everything below:** both typers
read `F0_result.md` §2 — which I wrote — and both quote or echo its per-row triage reasons (K
quotes §2 row 5 verbatim at K:110-111; L's Type-H catchability leans on "F0's repo-rooted reader
could not reach," L:90-91). Part of the observed agreement therefore routes through the scorer's
own document. Named, not repaired; it is subtracted where it matters (§5).

Member sets re-derived from the files' own headers, not from memory:
`grep -nE "^## T[0-9]|^\*\*S-#|^### Type" exo_memory/loop/failure_types_K.md exo_memory/loop/failure_types_L.md`

```
K: T1{1,3} T2{7,10} T3{4,8} T4{5,6} T5{12,14,15}  singletons {9} {13} {16}
L: S{1,3,6} H{12,14,15,16} U{5,7,10} C{4,13}      singletons {8} {9}
```

Both corpora are identical (the 16 rows minus R={2,11}; K:6-7, L:7-8) and both applied the same
corrections (E on #7 and #13, C on #8, B on #12 and #16) — so the corrections are SHARED input,
and convergence that merely follows them is not independence (L's own §7 rule, applied
throughout).

---

## 1. Per-row agreement — the number

**Scoring rule, fixed before tallying:** SAME = same co-membership joint and same described
mechanic, whatever the name (both-singleton with the same characterization counts as SAME);
DIFFERENT = genuinely different mechanics assigned; SPLIT = typed by one, left singleton by the
other. Each verdict cites both sources.

| # | K (line) | L (line) | verdict | note |
|---|---|---|---|---|
| 1 | T1 nearest-object substitution (K:29) | S substituted source (L:40) | **SAME** | identical mechanic: proxy read while the authoritative object sat unopened |
| 3 | T1 (K:29) | S (L:40) | **SAME** | co-membered with #1 in both |
| 4 | T3 directional omission (K:75) | C concession w/o discrimination (L:126) | **DIFFERENT** | K reads the evidence-filter; L reads the position-update. Genuinely different theories of the row — see §3 |
| 5 | T4 level substitution (K:98) | U unassailable shape (L:103) | **DIFFERENT** | type differs; catchability verdict identical (§4) |
| 6 | T4 (K:98) | S (L:40) | **DIFFERENT** | but K pre-registered L's exact placement as the defensible alternative (K:221-222, uncertainty 4) |
| 7 | T2 unlosable sentence (K:49) | U (L:103) | **SAME** | co-membered with #10 in both; near-identical language |
| 8 | T3, with #4 (K:75) | singleton (L:153) | **SPLIT** | L names K's exact pairing as the likely future merge ("kin to #4's asymmetric-drop half," L:155-157) — a threshold difference (L requires ≥2 full matches), not a joint difference |
| 9 | singleton (K:153) | singleton (L:163) | **SAME** | same two properties noted by both: self-contradiction in own record; the corpus's only instant self-catch, n=1, declined to build on |
| 10 | T2 (K:49) | U (L:103) | **SAME** | and both moved it OUT of the table's substrate-over-thread to the unassailable class — an agreed departure |
| 12 | T5 self-inventory (K:120) | H hand-made self-accounting (L:70) | **SAME** | same core trio {12,14,15}; the catchability split on this row is a separate axis, §4 |
| 13 | singleton (K:161) | C, with #4 (L:126) | **SPLIT** | both center the same property (the command "could not come back negative") and both cite catch_latency §5's prediction-precedes-output as the remedy (K:163-167, L:146-148); they disagree only on whether the event types by the instrument or by the concession |
| 14 | T5 (K:120) | H (L:70) | **SAME** | |
| 15 | T5 (K:120) | H (L:70) | **SAME** | and both overrode Addendum 2's own gesture ("clean-run confirmation, adjacent") in the same direction — an agreed departure, K explicitly (K:128-131), L silently |
| 16 | singleton (K:173) | H (L:70) | **SPLIT** | but the substantive verdict is identical in both: B's Part 2 kills the class by rule, ex ante (K:176-178, L:85-86). Bookkeeping split only |

**Tally: 8 SAME / 3 DIFFERENT / 3 SPLIT** (re-derive: count the verdict column above;
`grep -c "SAME\*\*" exo_memory/loop/typology_comparison.md` → 8).

Within the 3 SPLITs, 2 (#13, #16) agree substantively and differ only in bookkeeping, and the
third (#8) has L naming K's pairing as the probable merge. Within the 3 DIFFERENTs, 1 (#6) was
pre-registered by K as exactly the alternative L took. **The unhedged, unanticipated
disagreements are two: #4 and #5.**

## 2. The sharpest shared joint — and it was not gestured by the corpus

The table's own provisional shape `ready-instrument` was {1, 2, 3, 11, 12} (+#14 by branch).
Remove R={2,11} and the corpus hands both typers a four-row blob {1,3,12,14}. **Both
independently cut it at the same joint: source-substitution {1,3} versus self-accounting
{12,14,15} — pulling #15 in against the record's own gesture.** No correction, no F0 note, and
no table row suggests that split; it is the strongest decorrelated agreement in the set, and it
is build-relevant: the two halves have different catch conditions (mount an external object vs
mount the claimant's own process record).

## 3. Where the type systems disagree structurally

**Substrate-over-thread (the chair's question 2): the same observation, and the verdicts are
opposite only where it stops mattering — except at #6.** The table filed {5,6,8,10} under
substrate-over-thread. Both typers dismantled it along C's function-over-topic precedent: both
removed #8 (shared input — C's correction), and both moved #10 to the unassailable class (a
shared departure; the table's own row text half-gestures it, "unassailable, always-sayable," so
it is not pure independence). The residue is {5,6}: K keeps a rump two-member type (level
substitution); L scatters (#5→U, #6→S). For #5 the dispute is bookkeeping — their catchability
verdicts are identical (§4). **For #6 it bites:** L types the not-reading and prices #6
conditional-catchable via an authority-map; K types the level error and says the map-remedy fixes
only the T1-half — "the level error itself would remain" (K:117-118). That is the one place the
dissolve-vs-keep decision changes what the build can claim to reach.

**The #4-partner question is the sharpest genuine disagreement.** K pairs #4 with #8
(directional omission: the filter on the field); L pairs #4 with #13 (concession: the update
without a discriminating step). These are different mechanics with different catch stories — K's
is judge-only in principle (the defect is a relation between report and field, K:86-90); L's is
partially positional from transcript inputs (L:144-149). The row supports both readings because
it contains both moves ("accepted a reframe" AND "dropped only the evidence"). Neither file saw
the other's pairing. If a fifth instance of either shape lands, it decides this; until then it is
the live fork in the taxonomy.

## 4. Catchability reconciled — the numbers the build turns on

K's headline: **5 of 14** reader-catchable iff mounted (T1+T5), 6 second-mind, 3 solved on paper
(K:187-203). L's headline: **ceiling 7 of 14** with everything built, most conditional; 5
judge-only (L:178-188). **These are not in contradiction — they count different condition-sets
as satisfiable.** Per-row:

| rows | K | L | reconciled |
|---|---|---|---|
| #14, #15 | catchable, mount the process record | catchable, extended inputs | **AGREED FLOOR — catchable with transcript/ledger inputs; the only two both count unconditionally** |
| #1, #3 | catchable, mount + preserve the object | catchable IFF an authority-map exists, is maintained, and rots into confident wrong catches if not | **agreed direction, complementary conditions**: K names existence/mount, L names identification (the sentence not naming its authority IS the defect, L:63-64). Both needed. And #1's mount can never be supplied retroactively — panes.json's claim-time state is gone (F0 §2 row 1); this class is catchable prospectively only, if snapshots start being taken |
| #12 | catchable with the trio (K:139-141) | **judge-only** — "what counts as an instance" was judge-work that took the whole table to settle (L:92-94) | **GENUINE DISPUTE.** L's split of H (2 mechanical / 1 judge / 1 rule-killed) is the sharper analysis and K's T5 write-up never addresses the unit-definition problem. Recorded, not resolved — but the build should not count #12 until someone answers L |
| #4 | judge-only in principle (T3) | partially positional, detector unbuilt | **GENUINE DISPUTE** — downstream of the §3 partner fork |
| #13 | discipline already written, self-applied (catch_latency §5) | positional detector, partial; until built: judge | agreed substance (same remedy, same foothold, both cite §5); differ on whether "discipline enforced" counts as "mechanically catchable." Naming, not substance |
| #6 | judge after mount — level error remains | conditional via the map | **GENUINE DISPUTE** — the §3 residue |
| #5, #7, #10 | second mind (T2/T4); a naive reader **certifies** #5's error | judge-only, "nothing in the world to check" | **AGREED: zero mechanical reach, ever.** K adds the stronger warning on #5: a reader is worse than useless there |
| #8 | second mind with independent field access | judge — "needs someone who knows the source-set exists" | **AGREED** |
| #9 | Tier-2 surfacing + reader pairing, semantic link | self-caught once; declines to build | roughly agreed: neither claims a mechanical catch |
| #16 | rule ex ante, already written | rule ex ante, already written | **AGREED, verbatim-equivalent** |

**The reconciled bracket: intersection {1,3,14,15} = 4 conditional; union of every optimistic
resolution {1,3,4,6,12,13,14,15} = 8. The build target is [4, 8], and each disputed row names
its own distinct unbuilt precondition:** #12 a settled unit-definition, #6 whether provenance-fix
reaches a level error, #4/#13 the positional concession detector (which mechanizable_checks
already lists as unbuilt with a rule-4 bar). K's 5 and L's 7 are both defensible selections from
this lattice; neither should be quoted alone again.

**What both documents assert with no daylight, and it is the boundary the build lives inside:**
the self-facing rows {5,7,10} plus #8 are reachable by no reader under any extension — K derives
it as "six need a second mind for structural reasons... what the dive-buddy is for" (K:200-202),
L as "the machine's reach ends where the claim stops being about the world and starts being
about the claimant" (L:191-194). Two independent typings, same sentence from below. Combined
with F0: the full pipeline's honest reach over this record is **2 caught (R, demonstrated) + 2
unconditional-with-extended-inputs + 2 conditional-on-retrieval + up to 4 disputed = at most 10
of 16, likely nearer 6-8, and never the self-facing four.**

## 5. Decorrelation — the honest verdict (the chair's question 4)

**Did two independent typings produce more than one would have? Yes, materially — but the
agreement rate is NOT a clean measure of decorrelation, and no number from this comparison
should be quoted as one.** Three reasons, stated flatly:

1. **The corpus arrived pre-annotated.** Rows carry shape-language in their own text ("
   unassailable, always-sayable" in row 10; "manufactured urgency" as a name), and the
   corrections both typers were required to apply are themselves interpretive moves by C, E, and
   B. Convergence on those is the corpus echoing — L's §7 said this in advance and it held.
2. **Both read the scorer's own triage** (F0 §2), which seeded catchability language in both
   files. The scorer of this comparison is a contamination source for the thing scored — the
   curated-auditor shape, one level down.
3. **n=14.** Two typers, one corpus, no third arm.

What survives those subtractions as evidence of real independence:

- **Agreement on ungestured departures** — the strongest kind: the {1,3}|{12,14,15} cut of
  ready-instrument (§2), pulling #15 against the record's gesture, moving #10 to the
  unassailable class, and the boundary sentence (§4) reached by different derivations.
- **Disagreement localized exactly where the documents flagged their own low confidence.** K
  registered four uncertainties (K:212-222); the actual divergences landed on two of them (#6
  precisely as predicted, T1/T5-merge-adjacent questions untouched). L's procedure self-reported
  failing on #8 and #9 (L:34-35) — #8 is where the typed/singleton split landed, #9 both left
  alone. **This is the healthy signature and it is the opposite of the ultrareview's:** six
  adversarial groups produced zero disagreement over a set ~18% wrong; two independent typings
  produced localized disagreement at self-flagged joints plus agreement on non-obvious
  departures. Correlated error announces itself as unanimous confidence; this pair announced its
  own fault lines and then diverged on them.
- **The union is genuinely larger than either half.** Only L has: the blind decision procedure,
  the #12 unit-definition objection, the authority-map rot pricing, the Type-H register
  prediction, the mechanism-reach bound (Attack A types S+H and stops, L:170-176). Only K has:
  the mount-vs-judgment decomposition table, the mount-reasons reading of F0's NOs, the
  #2-shares-#13's-mechanic observation (K:168-171), the naive-reader-certifies-#5 warning, the
  E-genus-test alignment (K:205-210). None of these is derivable from the other file.

**On L's §7 falsifier (iii)** — "K's grouping shares no joints beyond the table's own gestures →
the taxonomy is imposed": **not triggered**; §2's shared ungestured joint defeats it.

**On L's standing offer to be scored (L:196-204):** I looked for a third undisclosed instance of
L's interest operating and did not find one — L's ceiling is stated on the deflationary side
("at most 7, most conditional"). Weak evidence, disclosed as such: I share frame with L through
F0 and may be blind in the same direction.

**One prediction already scored in the confirming direction, outside the corpus:** L registered
that Type H concentrates in reporting acts (L:97-101). Within the hour, the chair filed a new
instance — "dispatching J," said to the keeper, never done — a hand-made status claim about the
chair's own action, inside chair reporting prose. First post-registration instance, consistent
with the prediction. One instance; noted, not banked.

**Pricing for future blind fan-outs, which is what this was for:** on this evidence, a two-arm
blind fan-out over a shared annotated corpus buys (a) complementary analysis (the union), (b) a
fault-line map (where they diverge is where the joints are genuinely underdetermined), and (c)
confirmation only on departures the corpus did not suggest. It does NOT buy a decorrelation
coefficient, and at this n it cannot. Whether independence decorrelates ERROR — the ultrareview
question — remains unmeasured: nothing here had known-wrong ground truth for the typers to
correlate on. Saying this comparison measured decorrelation would be the overclaim; it measured
complementarity and located two real forks (#4's partner, #12's catchability), which is what B,
A, and K can actually use.

---

*Every member set re-derives from the grep at the top; every verdict cell carries its source
lines; the tallies re-derive by counting this file's own table rows. The verdicts SAME/DIFFERENT/
SPLIT are hand-made judgments over quoted text — checkable by reading the two files, not by any
command, and said so.*
