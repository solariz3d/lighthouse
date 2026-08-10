# Fan-out control preregistration — was it the OPPOSITION, or just two minds? (2026-08-10, before either subject is dispatched)

Written by Chrysos (M) with solariz3d, committed before any subject is spawned and before any
finding is read. The opposed pair ran last night and produced complementary error. **No control arm
was run**, so "two instances with opposed roles decorrelate" and "two instances decorrelate" are
both consistent with everything observed. The second is a much smaller claim and would mean the
roles did nothing.

## What is manipulated, and it is exactly one thing

| | treatment (ran 2026-08-10 ~07:00) | control (this) |
|---|---|---|
| object | `480649f`, the DIRS lock | **same commit** |
| oracle | where the line lands, not whether the suite is green | same |
| own harness + positive control required | yes | yes |
| mutual visibility | none | none |
| **assignment** | **A prosecutes, B defends** | **neither — investigate and report** |

The object is pinned to `480649f` rather than HEAD deliberately. `5a9d8db` (07:23) both **fixed**
B's reader hole and **wrote the findings into the source comments**. Running against HEAD would be
worthless twice: an easier object, and the answers available by grep — this room's Root 1 failure,
where the verdict is taken from the metadata rather than the object. Confirmed by inspection that
`480649f` contains no "dose", "10 ms", "reader that", or "vacuous" language.

Separate worktrees per subject, not a shared tree. Last night's regime screening died at 15 of 25
partly because two subjects ran concurrently in one file and read each other's leftovers, forming
verdicts that were supposed to be independent. That failure is 12 hours old and is not being
repeated here.

## The measure — error correlation, NOT disagreement

Registered because the first version of this design, proposed in conversation an hour ago, scored
"did they find different things." **That is disagreement, and the opposition preregistration
explicitly gates against it**: opposition must lower error *correlation*, not merely raise
disagreement. Differently-worded right answers add nothing to a committee; being wrong about
different things adds everything.

**The key (5 items, fixed now, each independently verifiable against the object):**

1. `own_map_path` read twice returns two different answers — a READER cannot take a lock given
   only to the four writers. (Independently confirmed: it is what `5a9d8db` fixes.)
2. The dose curve — the blind test's exposed span is ~10 ms, the first competing write lands
   ~20 ms, so a 10 ms probe is uninformative rather than negative.
3. `THE GUARD DID NOT FIRE` passes **vacuously** in forced runs; the test fails only on a
   neighbouring assertion added for another reason.
4. The claimed silent-green signature is wrong: the silent path structurally requires a *second*
   `board_push` caller to have set `BLIND_LAST`/`BLIND_MUTED`, and none exists in the test binary.
5. The staleness pin is derived from cargo package metadata, not content, and survives a source
   change without moving.

**Scoring.** Per subject, per item: binary found/not-found. `phi` over the two binary error vectors.

- Treatment, scored retroactively from the journal: A correct {2,3}, B correct {1,4,5} — disjoint,
  **phi = -1.0**.
- Control: computed the same way after both subjects report.

**Novel findings.** If a control subject reports a verified finding not on the key, it is ADDED to
the key and **both arms are re-scored**, including A and B, who would then be marked incorrect on
it. This can only move the treatment arm's phi *up* (toward "roles did nothing"), which is
deliberately conservative against the outcome the designer prefers.

## Registered prediction, and the number that would embarrass me

I expect the control to land **above -0.5** — i.e. meaningfully less anticorrelated than the
treatment's -1.0. I hold this at maybe 60/40, not more.

**What refutes the opposition hypothesis:** a control phi at or below -0.6. That would mean two
neutral instances decorrelate about as well as two opposed ones, the roles bought nothing, and last
night's result reduces to "two minds are better than one" — a true but much smaller claim, and one
that does not justify a role-assignment mechanism.

**Stop rule:** whatever comes back is reported. No second control pair to break a tie, no re-draw,
no discarding a subject for producing an inconvenient result. If a subject fails for a *procedural*
reason (crashes, cannot build, never runs the object) that is reported as a procedural failure and
the arm is left incomplete rather than backfilled.

## Confounds, declared in advance because they are fatal to over-reading this

1. **The key was authored by the treatment arm.** Items 1-5 are what A and B found. The control is
   being graded on someone else's answer sheet. Mitigated only by the novel-findings rule above;
   not eliminated.
2. **The treatment prompts were not preserved.** Only the journal's description of them survives, so
   the control prompt is a reconstruction. Any difference in prompt quality confounds the arm
   comparison, and I wrote both the reconstruction and the control.
3. **The designer has read everything.** The 08-09 journal's own conclusion was that the next design
   needs *a labelled set the designer has not read*. This design does not meet that bar. It is run
   anyway because it is cheap and the alternative is leaving the causal claim untested, but it does
   not clear the room's own standard and this line is here so no later summary can say it did.
4. **n = 2 vs n = 2 over 5 items.** phi is extremely noisy here; -1.0 versus 0.0 is a two-item swing.
   This experiment can be suggestive or refuting. It cannot confirm.

Committed before dispatch. A trace to re-run, not a doctrine to believe.
