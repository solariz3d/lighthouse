# Why the habit resists a mechanical check: where did each unchecked wrong belief come from? Librarian, on D, 2026-10-12 00:5x. Lap D307.

The keeper, 10-11 21:34: "lets continue work till we figure it out". D305 (ledger D306) ruled **don't build**: a lexical check caught 31.3% of held-out unchecked claims, and half its refusals landed on the wrong sentence (`loop/plan_claim_check_d305_2026-10-11.md`, the two RULING sections). Its §5 says the next lap asks why the habit resists a mechanical check.

## The question
A check at the point of claim tests the CLAIM. It cannot see where the seat's belief came from. For each unchecked wrong claim (CN), **what was the belief's origin?** Candidate origins, to be registered, not assumed:
- a figure or state **carried from an earlier turn** of the same seat;
- **another seat's message** (a ring, a dispatch, a hand-back's summary line) taken as current;
- a **digest or pulse line** (the shelf's state block, the pulse, a board digest) read as live;
- the seat's **own prior note** (its journal, map or plan), read back as fact;
- **inference** from code or a name, with no source at all;
- none of these (the belief appears with no traceable source).
If one origin dominates, the fix goes to that carrier, not to the claim: for example, a carried figure gets its as-of time stamped where it is carried. That is a build no gate has tried.

## Inputs, frozen
The 42 CN units already located to the second: the census's 27 (`handback/p-wcensus-A_2026-10-11_evidence/out/units.json`, sha256 3e910cb0…, classes per `loop/plan_unchecked_claims_d303_2026-10-11.md` SCORE) and E's 15 held-out (`handback/p-poolread-E_2026-10-12_evidence/heldout-lists/census-units.json`, sha256 f195b94f…). Each has its erring turn.

## The parts
**Wave 1, in parallel:**
1. **B: the registration,** sealed before any reading. The origin classes as an ordered procedure (the first that applies), what counts as evidence of each in a transcript (the earlier turn's text, the ring's text, the digest line the seat had in context), the bar, and what each outcome changes. B's guess in its own section.
2. **E: the carriers survey, measure only.** Where in the room is a figure or state carried WITHOUT its as-of time? The pulse, the state block, board digests, ring templates, hand-back summary lines, the shelf. For each, say whether the figure carries when it was true. No change. (E knows the held-out units; this part reads carriers, not units.)

**Wave 2, after B's registration:**
3. **A: the blind read** of all 42 units: the origin of each wrong belief, from the erring turn and what preceded it. A has built the harness and the census but has classified no unit by cause. A does not open this plan or B's guess; B's §0–§N are its only definitions.
4. **C: the non-author read** of A's table, disagreement count.
5. **Librarian: score,** with E's survey beside it.

Worktrees on G:. Every node run under the heavy-run lock. Commit by named paths; do not push. Dispatch rows carry `--parts 4`; the chair writes a `working` row at dispatch.

## SCORE (librarian, 01:3x 10-12)
A `handback/p-originread-A_2026-10-12.md` (git-blob 7fb77c07…; d307-a cc549557), C `handback/p-origincheck-C_2026-10-12.md` (git-blob 55ece135…; d307-c 89da3427 + 10ee330b), E `handback/p-carriers-E_2026-10-12.md` (git-blob f9206d5e…; d307-e 13dfaf31). Bar: `loop/belief_origin_registration_2026-10-12.md` §4.
- **C's 3 class disagreements: all accepted,** each re-read in the transcript: W092 PROXY → RING (A's own report stated the run an hour before the process read; B's order takes the earliest text), W082 RING → INFER (nothing before the ring said "idle"; the seat stepped from "the chair just rang me"), H0159 INFER → NONE. C's W100 as-of yes → no accepted (the digest's age is the pane's last exchange, not the state's).
- **Classes used (n = 42):** PROXY 14 · RING 14 · INFER 5 · DIGEST 4 · CARRY 2 · OWN-NOTE 1 · NONE 1 · NT 1. §5: no condition fires (NT 1; C's disagreement 3 of 42).
- **§4 row: NO DOMINANT ORIGIN, none leading** (PROXY and RING tie at 33.3%). **No carrier fix is supported by this measure, and nothing is built from it.**
- **Beside it, the as-of finding FIRES:** of the 21 carrier-origin units, **19 (90.5%) carried no time** for when the state or figure was true, against B's 2/3 line. E's survey says the same from the carrier side: the state block 33 of 37 figures undated, read for the whole session, its HEADs 61–171 commits behind; rings with no send time and no bound on delay; the pulse the one carrier that stamps every figure.
- **B's guess (§G):** outcome "no dominant": **HOLDS**. As-of ≥ 2/3: **HOLDS**. PROXY 29–36%: **HOLDS** (33.3%). RING 12–17%: **WRONG** (33.3%), and that **fires B's own falsifier** "any carrier class at or above 33% on the low end".

**What the four laps say together (D301, D303, D305, D307):**
1. The largest cause of the room's wrong claims is a check that was at hand and not run (61.4–72.7%); missed lookups are a third of its size.
2. A mechanical check at the point of claim does not stop it (held-out catch 31.3%; don't build).
3. Upstream, the wrong beliefs split two ways, about a third each: the seat looked at the wrong object (PROXY), or it took another seat's message as current (RING). Nine in ten carried beliefs had no as-of time.
4. **No registered bar supports a build from this lap.** The as-of finding is a finding, not a build order.
OUTPUT → NEXT: changed — no origin dominates, so no carrier build follows from this bar; the as-of finding is recorded, and E's survey shows two carriers stating stale facts with no date, which is a defect on its own.
