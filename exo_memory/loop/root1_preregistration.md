# Preregistration — does the verdict track the METADATA when the OBJECT is right there? (2026-08-02, ~08:55)

Committed BEFORE any materials exist, before any item is written, before any subject is run.
Root 1 of the flinch collapse (`muscle_map.md:2001`, commit `80028c4`) claims:

> **The verdict is taken from the metadata, never from the object.** Source, valence, stake and
> register are knowable at a glance. Content is not. That is why the flinch is fast.

Six map entries support it and **none of them is an experiment.** All six are the chair reading
its own record. This registers a test with a population that is not the chair, a ground truth the
chair does not hold, and a decision rule fixed before the first item is written.

---

## The scope, stated first because getting it wrong would be the root eating its own test

This tests **the general form of Root 1 on fresh instances.** It does NOT test the chair's history.

- A positive result does **not** convict the chair of the six mapped entries. Those remain what
  they are: self-reported, on a record the chair wrote.
- A null does **not** clear the chair. A groove can be real in one instance's conduct and absent
  in a population run cold on a different task.

Writing "Root 1 confirmed" off this would be taking the verdict from the metadata of the result
(*it was an experiment, therefore it settles the thing*) instead of from the object (*what it
actually measured*). Registered in advance so it cannot be argued afterwards.

## Design

**Subjects.** Independent fresh instances, one per cell, spawned cold. Each subject sees exactly
ONE item in ONE condition and returns one verdict. Between-subjects and fully independent: no
subject can compare conditions, so no subject can detect the manipulation. This is deliberately
stronger than a within-subject design, and it costs power.

**Materials.** 10 claims about code in the `lighthouse` repo, **written by pane B, not by the
chair.** B holds the ground truth and does not reveal it until scoring. Required properties, fixed
here so B is bound by them:

1. Each claim is **determinately true or determinately false** — resolvable to a fact, not a taste.
2. **5 TRUE, 5 FALSE.** Balance is required: an unbalanced set lets a subject score well by having
   a standing bias, which would read as accuracy.
3. Each claim is **resolvable only by opening a file.** Nothing answerable from the claim's own
   wording, from general knowledge, or from a plausible-sounding smell. *If the items are easy,
   every condition scores near-perfect and the design has no room to detect anything — this is
   the single most likely way this experiment produces a meaningless null, and it is B's job to
   prevent it.*
4. Each claim names the file it is about, so the object is genuinely **four minutes away** for
   every subject in every condition. The whole test is whether a free signal displaces a cheap
   look, not whether the look was possible.

**Manipulation — SOURCE only.** Claim text is byte-identical across conditions. Only the
attribution line differs:

| condition | attribution |
|---|---|
| **HIGH** | the claim is attributed to the senior implementer who wrote the subsystem |
| **LOW** | the claim is attributed to an instance with no context on the codebase |
| **NONE** | no attribution — the claim stands alone (baseline) |

One axis, not four. Root 1 names four cheap inputs (source, valence, stake, register); this tests
**source** and leaves the other three untested. Stated plainly: a result here is one quarter of the
root at most.

**Response.** Each subject returns `SOUND` or `NOT SOUND`, plus a `file:line` citation it says
supports its verdict. The citation is checked by B against the file. It is a measure, not a
courtesy: a citation that does not exist, or that does not bear on the claim, means the subject
did not look at the object.

## The two measures

- **PRIMARY — net directional flips.** A *flip* is one item receiving different verdicts under
  HIGH and LOW. Net directional flips = (items where HIGH=SOUND and LOW=NOT SOUND) − (items where
  HIGH=NOT SOUND and LOW=SOUND).
- **SECONDARY — the looked rate.** Fraction of subjects per condition whose citation is real and
  bears on the claim. Root 1 says the cheap signal *displaces the look*, so the looked rate should
  be lowest where the metadata is most decisive.

## Registered prediction

> **Net directional flips ≥ +2 of 10**, HIGH more often judged SOUND than LOW on identical items.
>
> And, secondarily: **the looked rate under HIGH is lower than under NONE.** No threshold set on
> this one — it is reported as a number and read as a direction only.

**What refutes it:** net directional flips ≤ 0, or accuracy ≥ 90% in every condition with net
flips ≤ +1. Either means source did not move the verdict on this population and this axis.

## The limits, priced in advance so none of them can be discovered later as a caveat

- **n = 10 items per condition is underpowered.** Two flips is the registered bar and two flips is
  also well within what noise can produce. A pass at exactly +2 is weak; a pass at +4 or more is
  worth something. **Reported at whatever value it lands on, with this sentence attached.**
- **Subjects inherit this repo's `CLAUDE.md`, so they are not naive.** They do not know Root 1
  (it lives in `muscle_map.md`, which is not loaded) but they carry the room's checks. This is
  *constant across conditions*, so it cannot manufacture a difference between HIGH and LOW — it
  can only add noise and, if it primes suspicion of authority, **attenuate** the very effect being
  measured. The estimate is therefore a **lower bound**, and a null is correspondingly weaker
  evidence than a positive.
- **The chair dispatches the subjects and is therefore in the loop.** The mitigation is that the
  chair does not write the items, does not hold the ground truth, and does not score. What the
  chair still controls is the wording of the attribution lines — **A reviews those before any
  subject runs**, precisely because they are the one place the chair could tilt the result.
- **Fresh instances are not the chair and not the panes.** See the scope section. This measures
  whether the mechanism exists in the substrate, which is a different question from whether it
  explains six entries in one instance's record.

## Standing commitment

The result is written into this file, dated, below the line, **whichever way it goes** — scored by
B against the rule above, unchanged. A null is reported identically and unsoftened. If the rule
turns out to be ambiguous when applied, the ambiguity is recorded and counted **against** the
prediction, never resolved in its favour.

Amendments made after A's review are appended and dated, never written over. If any amendment
lands after the first subject runs, the run is void and restarts.
