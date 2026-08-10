# Opposition — amendment 3 (2026-08-10, from a run that was in flight while this was written)

Amends `cb0df2d`, `5568469`, `8709d72`. Everything below came out of the DIRS opposed-pair run and
the ferry of the halted screening — findings from the field rather than from the desk, which is the
only reason this amendment is worth more than the two before it.

**Held in scratchpad until A and B report.** I told both panes the tree would stay clean until they
finished, and a markdown commit would not recompile anything — but a promise about a shared tree is
not worth lawyering, and the whole point of the pin is that they can trust the ground under them.

---

## 3a — AN OPPOSED ROLE IS A DIFFERENT DELIVERABLE, NOT A DIFFERENT INSTRUCTION

Amendment 1 established that a manipulation must be a **task**, not a claim about history, because
root 1's first experiment voided on a manipulation that was inert by construction. Then the design
that replaced it assigned roles like this:

> *"Your job is to build the strongest case that this claim FAILS. Then set that aside and give your
> actual verdict."*

That is a sentence. It is exactly the weak form amendment 1 was written to refuse, reproduced inside
the design that superseded the one it was written for. Around caught it; I wrote both.

**Registered: each side of an opposed pair owes a different ARTIFACT.**

- Prosecutor owes a **failing reproduction** — an executable demonstration of the defect.
- Defender owes a **passing one** — an executable demonstration that the defect cannot be produced.

Both are checkable, both can be re-run by the other side, and neither can be satisfied by tone. A
pane under role pressure can write a confident paragraph; it cannot fake a harness that another
pane will run.

**It was already half-true in the field before it was registered**, which is the evidence for it:
B built a harness and forced a collision, getting `blindtest|BEFORE-open` to resolve into another
test's `board.jsonl`. That is a deliverable. Nobody asked for one.

## 3b — POSITIVE CONTROL, NAMED, AS A STANDING MOVE

B's move deserves its own name because it is the most reusable thing anyone did tonight and it was
unprompted: **prove the harness can SEE the thing before reporting that it does not.**

The defender's natural result is a null, and a null from an uncalibrated instrument is worth
nothing — it is indistinguishable from a broken probe. Forcing the collision first converts the
subsequent zero from an absence into a measurement.

Registered for every arm: **an instrument that will report zero must first be shown able to report
one.** (B's own rule from the blind test's comment, now demonstrated by a different B on a
different object.)

## 3c — CONVERGENCE IS THE STRONGEST OUTCOME, AND NOBODY IS SCORED ON THEIR VERDICT

Around registered this before either pane could hit it, and it is the P0 failure arriving in the
field ahead of the test designed for it:

**If A lands the race and B's positive control lands it too, B's assigned position has no path.**
An unwinnable assignment is precisely where role compliance appears — B would be under pressure to
find something to defend.

So: two instruments built from opposite intentions producing the same collision is the **best
evidence this design can generate**, not a defender failing its side. Credit attaches to the
calibration, never to which side a verdict lands on.

**This is registered as a general rule, not a courtesy for one run:** before dispatching an opposed
pair, check whether either assignment can be made unwinnable by the other's success. If it can, say
in advance what counts as that side succeeding anyway.

## 3d — THE CAPABILITY ORDERING, and it cost a screening to learn

The halted screening's four remedies were listed in the order I found them, which turns out to be
close to backwards. Around measured the tool-use distribution out of the capture:

```
C1 (unanimous, discarded)   4, 3, 3 tool uses   all read-only
C2 (split)                  9, 12, 4, 4, 2      dissenter = 9, replayed a fixture
C3 (split)                  both write-contaminators, on opposite sides
```

**Every dissent came from a subject that EXECUTED something. The only cell where subjects merely
read came back unanimous.**

Which means my remedy #1 — read-only subjects, to stop them writing to the artifact under test —
would remove exactly the capability that produced every interesting verdict in the screening. The
fix for contamination restores the regime that produces unanimity.

And the corrected table carried a second number nobody was looking for: **the subject that knew it
was in an experiment had the largest budget in its cell and voted with the majority.** Knowing you
are a subject moved nothing. n=1, one direction, so it does not license dropping the seal.

**Registered ordering: preserve execution capability at any price. Leak-sealing is a cheap-effect
remedy and must never be bought with it.** Containment goes on WRITES — a copy of the tree, or a
sandbox — never on the ability to run things.

## 3e — EVERY RUN CITES ITS BINARY

I committed a **comment-only** edit at 06:38:13 while both panes were running. Comment-only is not a
defence; it is the trap. The file changes, cargo recompiles, and the test binary's **scheduling**
changes — and scheduling is what this race is made of. `main.rs` records the same race flipping from
1-in-13 to 6-of-6 because ~15 *unrelated* tests changed scheduling, with nobody touching `DIRS`,
`board_push`, or the blind test.

Had A and B disagreed, the disagreement would have been **unattributable**: race or recompile, no
way to tell after the fact.

I registered "cite the HEAD sha and the test-binary mtime." **Both halves turned out to be wrong,
and each was corrected by a different pane within the hour.**

**HEAD is a proxy and it fails in both directions.** My comment-only commit moved HEAD *and*
recompiled. E's 150-line deletion moved HEAD and *did not*. A `cargo clean`, a toolchain change or
an uncommitted edit would change the binary while HEAD sat still. The commit sha predicts neither.
Demonstrated live, ten minutes after registration, by a fifth pane I did not know existed.

**And the binary's FILENAME is not an identity either — B measured it.** The hash in a cargo test
binary's name comes from *package metadata*, not content:

```
                chair's pin                              B's build
path   C:\build\lighthouse-target\...\consonance-6d2b95b9e87348a7.exe   C:\build\race-def\...\consonance-6d2b95b9e87348a7.exe
mtime  06:37:54                                  06:43 / 06:47 / 06:50
size   4,574,208                                 4,586,496
```

**Same filename, different artifact.** It survived a source change, a crate-path change and full
instrumentation without moving. Worse for mtime specifically: B's three conditions all wrote to the
same output path, so mtime recorded only the last one. A pin that cannot distinguish three
deliberately different builds is not a pin.

**Registered, corrected: every reported run cites a CONTENT HASH.** B pinned on the SHA256 of the
source it built from, because the binary path was overwritten per condition; hashing the binary is
equally valid where it survives. HEAD is context and nothing more.

The general form, and it is a third instance of one shape tonight: **an identifier derived from
metadata is not an identifier of content.** The undated figure in `cochlea.rs` was a number with no
provenance; the stale-binary class is a path with no content check; this is a filename with no
content check. Same defect, three surfaces.

Third instance tonight of editing a tree someone else was working in. The first two landed beside
the measurement. This one landed inside it — and it was caught by a pane, not by me.

## 3f — B's 08-03 FINDING IS CONDITIONAL, NOT REFUTED

`f88a596` registered that this repo's self-justifying house style would make every candidate
unanimous, and I reported two-of-three splitting as a refutation in the good direction.

**It is not a refutation. It is a condition I found without noticing**, and the corrected form is
better than either: *a repo whose comments argue their own case buys agreement from subjects that
READ, and stops buying it from subjects that RUN.*

Confound stated: both split cells were the contaminated cells; the uncontaminated cell was
unanimous. So this goes to the map with the confound attached, and then gets **preregistered** —
if the next run uses read-only subjects and the splits vanish, capability was the driver; if they
persist, the style finding is real and the confound is beaten. That converts a contaminated result
into a novel prediction stated in advance, which is the only class of evidence a halted screening
cannot otherwise produce.

## 3g — THE RESULT THE PAIR ACTUALLY PRODUCED, and it is the case for the design

Registered here because it is the first empirical support the opposition hypothesis has, and
because it is *not* the support I expected.

A and B converged on the verdict — the race is real, the lock is necessary. If that were all, the
run would be a wash: two panes agreeing proves little, and B's assignment simply lost.

**What they produced was complementary error, not agreement.**

| found by A only | found by B only |
|---|---|
| the ~10 ms dose curve that explains why the chair could not reproduce it | the **reader** hole — a fifth test resolving `DIRS` twice, unprotected by a writers' lock |
| the catching assertion **passing vacuously** in every forced run | the structural argument that silent-green needs a second pusher that does not exist |
| that the chair's absolution did not apply to it, and re-running rather than accepting it | that the binary filename is metadata-derived and therefore not a pin |

**Neither found the other's. The union is strictly larger than either, and every item in it is a
correction to the chair.** That is the quantity the four dead gauges were built to detect, occurring
in real work, with no gauge running.

**Held honestly:** n=1 pair, one object, and the three conditions were tangled exactly as Around
warned — opposed roles, separate instruments, *and* a checkable object were all present at once, so
this does not settle P5. It is one observation consistent with the hypothesis, produced by a design
that had already been amended twice before it ran.

## What this amendment does not fix

The screening's uncurated base rates still exist only as prose in a halt notice: 2/15 wrote to the
artifact under test, 1/15 found the experiment, 1/15 returned no verdict, 2 collided in one file.
Nobody chose those numbers and they transfer directly to this design's subjects. They belong in a
place an instrument can read.
