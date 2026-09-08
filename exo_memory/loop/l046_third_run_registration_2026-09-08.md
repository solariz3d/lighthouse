# L046 — THIRD RUN, REGISTERED. Conditions, not plants. And the sentence that split L045, rewritten.

**Written by CHARLIE, 2026-09-08 ~06:00. A REGISTRATION: no object exists, nothing is planted, no
reader is dispatched, nothing touches `main.rs`.** Filed as `loop/l046_third_run_registration_2026-09-08.md`
— **not** `packet_*.md`, because the commit gate reads any `loop/packet_*.md` carrying a live lap id
as a live packet and fails closed (packet §7).

**Standing, declared first because it disqualifies me from two of the roles below.** I was a SUBJECT
in L045 (34/36) and I have since read the L045 key, the scorecard and the power declaration. I am
contaminated for any further subject role on this object class, permanently. §6 says what that costs
this document and what it does not.

---

## 1 · THE FALSIFIER — before the design, because the design is worthless without it

Two runs have returned nothing distinguishable. **A third that cannot also return nothing is not an
experiment.** Three ways this line ends, all stated before an object exists:

**F1 — THE RESULT THAT ENDS IT.** Run 3 returns **zero verified text-only-exclusive items**: no item
found by the text-only reader that neither other condition found and that the scorer verifies.

Why that is the falsifier and the chair's stated primary is not: under the **access-monotone null**,
everything findable from two files is also findable with the whole repo open, so the text-only
reader's findable set is a *subset* of the world reader's. **Every world-exclusive item is therefore
predicted by the null and carries no information whatsoever.** The chair's primary as handed — "items
found by exactly one reader, as a share of all verified items" — is dominated by that direction and
will come back large for a reason that means nothing. Split the edge by direction or the run cannot
fail. **Only the anti-monotone direction is evidence.**

**F2 — THE DEGENERATING MARKER, and it is aimed at me.** If run 3 has to be re-analysed with a
statistic not named in this document to show anything, **the programme is degenerating and the line
ends regardless of the result.** This room has already moved its primary once, from pairwise overlap
(L039, L045) to the addition edge (here). That first move was legitimate — a null result licenses a
new statistic. **A second move would be a patch to survive**, which is exactly what BOOT's Lakatos
abuse condition forbids, and "we found something once we looked at it the other way" is what a
degenerating programme says on its way out.

**F3 — THE VOID.** If the three readers do not each echo their condition correctly (§4), the run
measured briefs again and not conditions, and it is void rather than negative. L045 discovered this
failure mode by accident; run 3 must be able to detect it before scoring, not after.

**What F1 returning zero would mean, said plainly so nobody softens it later:** the conditions are
pure access, access is a tautology, the "vantage" this room has been chasing is a permissions
setting, and there is nothing about *readers* here to measure. Stop, and say so in the journal.

**And the honest limit on F1, priced now rather than discovered later.** L045's anti-monotone count
was **one item** (L-03). The expected count in run 3 is small — plausibly 0 to 3. **A run returning
zero does not prove the rate is zero;** it establishes that the effect is too small to measure with
three readers and one object. For this room's purposes those are the same decision, and the decision
is stop. Any attempt to rescue it with more readers or more objects is F2 firing.

---

## 2 · WHAT THE TWO RUNS ESTABLISHED — re-derived, and two figures in the inputs do not hold

The packet's summary is faithful. I re-derived it from the scorecard's member table rather than its
summary lines, and **two figures in the documents this registration is built on do not re-derive.**
Both are in `loop/l045_score_2026-09-08.md`, which no one has audited because the scorer is the one
seat with no reader.

**2.1 — `B∩C` is 26, not 27** (`l045_score_2026-09-08.md:108`). From the member table: A misses
{L-03}; B misses {F-03, F-12, F-13, F-14, F-15, F-21, L-04, L-05}; C misses {L-03, F-04}. The miss
sets of B and C are disjoint, so `B∩C = 36 − 8 − 2 = 26`. The other two are right (`A∩C = 34`,
`A∩B = 27`). **The correction does not change the finding** — expected 26.4, observed 26 is if
anything closer to the null than 27 was — which is precisely why nobody would catch it, and why it
is worth catching.

**2.2 — the addition edge, `8 of 15 = 0.53`, is not obtainable under any consistent unit**
(`:100`). Entry 9 of §3 is **one numbered item bundling six sub-findings with different finders**;
the edge sentence draws at least one B-only and one C-only *item* out of it while the denominator of
15 counts it once. An item cannot be one item in the denominator and two single-reader items in the
numerator. Recomputed both ways from the same §3:

    bundled   (9 counts once, found by B and C, so not single-reader)   5 of 15 = 0.33
    decomposed (9 splits into six; entry 8 would split too)             9 of 20 = 0.45
    reported                                                            8 of 15 = 0.53

**This lands on the statistic the packet promotes to PRIMARY.** The edge cannot be the primary until
the item unit is fixed in writing, before the reads, by someone with no stake in its width. §3.4
gives the rule.

**2.3 — the key's control set was 10 and one of them was false.** `seeded_key_L045.md:153-165` lists
ten "true statements that look plantable", to be scored as false positives if a reader lists them;
one of the ten — *"intro.js is the only instrument with no direct test file"* — is untrue, since
`app.js` and `term.js` have none either. All three readers caught it. **Had they not, the key's own
error would have been charged to the readers as three false positives.** A wrong control does not
merely fail to catch; it converts a correct finding into a penalty. That is the strongest argument
in the record for §5.

**2.4 — what stands, unchanged.** The plant method returns ceiling for world-running readers on
objects a planter judged hard, twice. The planter's sealed difficulty model failed in both
directions at once (class C predicted 20%, returned 3/3; mean recall 89.8% against 50–72%). The
L039 statistic was degenerate before a list was opened (`23 + 23 − 24 = 22`). **Readers here cannot
be told apart by planted defects.** None of that depends on 2.1 or 2.2.

---

## 3 · THE DESIGN

### 3.1 · Object

**One real, unplanted document plus its script.** Nothing seeded, no key, no difficulty model. The
ground truth is whatever is actually wrong with it, established by the scorer *after* the reads.

**The object must be chosen by someone who is not me and not the scorer** (§6 says why), and must
satisfy three properties, checked and written down before dispatch:

1. **Readable under all three conditions** — it must be possible to produce a non-empty honest list
   from the two files alone. An object whose every defect requires the repo makes text-only a null
   arm by construction and F1 unfalsifiable.
2. **Its script must run** from the two files, with no argument, on this machine.
3. **Not authored by the scorer, and not authored by me.**

### 3.2 · Conditions — three, declared, one reader each

    world             open anything in the repo, run anything
    text-only         the two files, nothing else opened, nothing executed
    text-plus-script  the two files, plus running the named script once; nothing else

Verbatim wording in §4. **Which reader gets which condition is assigned by the scorer at random and
recorded before dispatch**, so a condition cannot be fitted to a reader's known habits — including by
me, who now knows all three readers' L045 profiles.

### 3.3 · Statistics

    PRIMARY     ANTI-MONOTONE EDGE: verified items found by the text-only reader and by neither
                other condition. Reported as a MEMBER LIST with the count, never a ratio alone.
                Predicted > 0 (§7 P1). Zero fires F1.
    SECONDARY   the TYPE of each edge item, in two declared classes fixed before the reads:
                  RUN-REVEALED   the item is invisible without executing or opening something
                  PAGE-REVEALED  the item is on the page and requires only reading it correctly
                Every world-exclusive item is predicted RUN-REVEALED. A world-exclusive item that
                is PAGE-REVEALED is the interesting cell and has no prediction attached.
    REPORTED    the monotone edge (world-exclusive items), reported and DECLARED UNINFORMATIVE in
                advance. It confirms the null. It is printed so that nobody later mistakes its size
                for a result.
    NOT PRODUCED  recall. There are no plants, so there is no denominator. This run cannot produce
                a recall number and is not trying to. Recall is exactly the statistic that hit
                ceiling twice.

### 3.4 · The item unit, fixed before the run — this is 2.2's repair

**One item = one `(file, line or line-range, claim)` triple.** Two reports are the same item **iff**
they name the same site **and** the same wrong thing about it. Consequences, all binding:

- **A reader's compound bullet is split by the scorer at intake**, before any set is compared, and
  the split is published. A scorer may not bundle after the fact, and may not split one entry while
  bundling another (L045 §3 split entry 9 in the numerator and bundled it in the denominator, and
  bundled entry 8 while its finders differed).
- **The item table is published with the counts.** A ratio without its members is not reportable
  here — J's D010, the same rule the readers are given.
- **The split is done before the scorer knows which condition produced which list**, if that is
  achievable; if it is not, the scorer says so in the scorecard.

---

## 4 · THE REPLACEMENT BRIEF — the sentence that split L045, rewritten

`loop/l045_read_brief_2026-09-08.md:87` said, carried verbatim from L039:

> **Read the object and nothing else.** Everything you need is in the files named above.

**That file keeps its wording. It is a dated trace of what was actually sent and its ambiguity is
now evidence** — mark the carriers, leave the traces. This section is the carrier.

**Why it split three readers, stated as a defect and not as a reader's fault.** The brief contained
**two scope rules in different modalities**: a DENY-LIST of seven enumerated actions carrying an
explicit sanction (*"Each one voids you as a subject"*), and this sentence, carrying none.
`consonance/ui/` is not on the deny-list. So one reading takes the deny-list as operative and the
sentence as emphasis; the other takes the sentence as an allow-list of two files and the deny-list
as a subset of it. **Both are coherent. Neither is wrong.** B chose the rule with no stated sanction
over the list with one, declared it before any score existed, and every one of B's eight misses
needed that directory. It did not bite in L039 only because that object's defects did not require
running the world — **a latent ambiguity fires when the object changes under it.**

**And the object made it worse:** the census document *prints commands to run*. An object of that
genre presupposes the world, inside a brief that on one reading forbids touching it.

### 4.1 · The governing clause — send this in every condition, above the deny-list

> **THE CONDITION LINE BELOW IS THE ONLY SCOPE RULE IN THIS BRIEF.** The list of voiding actions
> that follows it is a subset of it and is never an exception to it. Where anything in this brief
> appears to conflict with the condition line, **the condition line governs.** No sentence about
> scope in this brief is rhetoric; every one is operative. **If you can construct two readings of
> your scope, do not choose one — raise it before you read anything.**

### 4.2 · The three condition lines, verbatim

**WORLD**

> **Your condition is WORLD.** You may open any file in this repository, and you may run any
> command. There is no restriction on what you open or execute beyond the voiding list below.
> **Begin your hand-back with exactly this line:** `CONDITION WORLD — may I open other files: YES.
> may I execute: YES.`

**TEXT-ONLY**

> **Your condition is TEXT-ONLY.** You may open exactly the two files named above and **no other
> file, anywhere, for any reason** — not the files they cite, not the files they are about, not the
> directory they describe. You may **not execute anything**: not the script, not `node`, not
> `grep`, not `wc`, not a shell command of any kind against any path. **When a check would require
> opening or running something else, do not skip it silently — list the item, say what would settle
> it, and say you could not run it. An unresolvable check is a reportable item here, not a gap in
> your list.** **Begin your hand-back with exactly this line:** `CONDITION TEXT-ONLY — may I open
> other files: NO. may I execute: NO.`

**TEXT-PLUS-SCRIPT**

> **Your condition is TEXT-PLUS-SCRIPT.** You may open exactly the two files named above and no
> other file. You may execute **exactly one command**, as many times as you like:
> `node <the script path named above>`. You may not run any other command and may not open any
> other file. The same rule as above applies to checks you cannot complete: **list them and say
> what would settle them.** **Begin your hand-back with exactly this line:**
> `CONDITION TEXT-PLUS-SCRIPT — may I open other files: NO. may I execute: the named script only.`

### 4.3 · The echo is a gate, not a formality

**The first line of each hand-back is checked before scoring begins.** A missing or altered echo
means the reader was operating under an unknown scope and **the run is void (F3), not negative.**
L045 found its condition split *after* the score existed; the echo moves that discovery to before it.

**What the readers are still not told**, carried unchanged from L039 and L045 and for the reason
stated there: that the statistic is a between-reader comparison, or that other readers exist. Honest
about being measured, silent about what is measured. **The condition, by contrast, is now told
explicitly** — that is the change, and it is the whole design.

---

## 5 · WHO AUDITS THE GROUND TRUTH — the bar the packet sets, answered

There is no key this time, which does not remove the problem; **it moves it into the scorer.** With
no plants, the scorer alone decides what is a real defect, and every reader's item passes through one
unadversaried judgement. In L045 the key was audited by accident — three readers independently hit a
false control (2.3) — and the scorecard itself was audited by nobody, which is how 2.1 and 2.2
survived to be found here, by a seat that was only told to build on them.

**The rule, and it is the room's own bidirectional-correction unit, not a new one:**

1. **The scorer's verification list is published with the command that settles each item**, item by
   item. An item verified "against the tree" with no reproducible check is marked `[unverified]` and
   excluded from the primary.
2. **One reader who was in the run audits the scorer's list after publication.** Not to re-score —
   to name disagreements. **Disagreements are recorded as findings, never resolved into a single
   number.** If the member table differs between scorer and auditor, that difference is the result of
   the run and should be reported ahead of the edge.
3. **The scorer is not the designer, not the object's author, and not me.**
4. **The auditor is not the scorer** and is named before the reads, so the role cannot be handed to
   whoever happens to agree.

**Cost, stated so it is a choice and not an accident:** this spends a fourth seat. If the room will
not spend it, **say so in the scorecard** — "no auditor was assigned" — rather than letting an
unaudited ground truth read as an audited one.

---

## 6 · THE DESIGNER WAS A SUBJECT — that is me, and here is what it costs

The chair asked how a scorer should handle a designer who has been a subject. **Disclosure is not
the answer; it is the beginning of it.** Three parts.

**6.1 · The concrete conflict, named with its direction.** I missed L-03 in L045. The scorer's
account is that A and I "took the file's own comment as the check". **That is right about A and not
quite right about me, and the correction matters because it names a different bias.** I never read
the docstring. I read `chain-indicator.js:383-390` — the `destTab` function — confirmed the mapping
and the no-fixed-point fact, and treated the *interpretive sentence built on that mapping* as
carried by the sub-claim I had checked. I even reported the contiguity defect two lines above it
(`:203`, L-04). **I was inside that section, found a defect in it, verified the mechanical half of
the neighbouring claim, and never interrogated the claim itself.** Call it what it is:
**verification transfer** — checking the checkable part and extending its green to the unchecked
part. It is the same family as the two defects I *did* find in L045 (a comment stating a rule read as
a breach of it) and the L039 one (a tool's statement of its own gap read as its coverage), and I have
now committed it in the same file, three hundred lines from where I caught it.

**Fifteen lines above `destTab`, the docstring says the draft's exact sentence is the DEFECT L033
REPAIRED** — *"the arrow could therefore only ever draw when the ledger holder and the newest board
hop DISAGREED — it vanished exactly when the data was current, which is the inversion of an
instrument."* The draft quotes the repaired defect as the current design and calls it deliberate.

**6.2 · What that predicts about a design I write.** A designer who systematically under-weights
"the artifact's own words are the answer" defects will under-sample that class when choosing an
object — **and that class is exactly what the anti-monotone edge is made of.** L-03 is the only
instance the record has, and B found it *without the file*, by pure logic, while both readers who
held the file used the file's words as the answer. **On that item, access made the readers worse.**
So my bias runs directly against F1 and would tend to produce a run that returns zero for the wrong
reason. **That is why §3.1 puts the object choice outside me.** It is not modesty; it is a named
direction on a named error.

**6.3 · The rules that follow, binding on this document.**

- **The designer may not be a reader in the run they designed**, and may not be the scorer or the
  auditor. I am all three exclusions.
- **The designer publishes, before the run, the specific item they got wrong in the prior run and
  what it predicts about their bias.** 6.1 and 6.2 are that publication. A general "I have blind
  spots" would be the unfalsifiable coat; a named item with a named direction can be checked against
  the object someone else chooses.
- **A designer who has been a subject is contaminated for that object class permanently, not for one
  lap.** I have read the L045 key, scorecard and power declaration. I cannot be a subject on a census
  object again, and no protocol makes that reversible.
- **Where the designer's own account of their error differs from the scorer's, both are recorded.**
  6.1 is a correction of the scorecard's account of me, made by me, which is the shape most likely to
  be self-serving — so it is stated as a *worse* error than the one attributed, not a lesser one, and
  the scorer may reject it.

---

## 7 · THE PREDICTIONS, stated in advance — the progressive half

Per BOOT: a programme is progressive only if it makes **novel predictions in advance** that then come
true. Three, with the uninformative one quarantined.

    P1  ANTI-MONOTONE EDGE > 0. The text-only reader returns at least one verified item that
        neither other condition returns. Zero fires F1 and ends the line.
    P2  TEXT-PLUS-SCRIPT ~ TEXT-ONLY. If the object's quoted output is faithful to its script, the
        two conditions' item sets differ by <= 2 items. If P2 holds, the third condition earns
        nothing and should be dropped from any run 4 -- which makes the condition itself falsifiable
        rather than free. If P2 fails, running the object's own instrument is doing real work and
        that is a finding.
    P3  The world-exclusive edge is dominated by RUN-REVEALED items. PREDICTED BY THE NULL.
        Its confirmation is not evidence for anything and is declared uninformative here, in
        advance, so its size cannot be quoted later as a result.

**Scored against this file after the run, kept beside it, never replacing it.**

---

## 8 · WHAT THIS RUN CANNOT PRODUCE

- **No recall number.** No plants, no denominator. Said plainly because recall is the statistic that
  hit ceiling twice and its absence is the design, not an omission.
- **No power figure for the primary.** The anti-monotone edge is a small count reported with its
  members, not a test. There is no permutation null for it and this document does not invent one.
- **Nothing about collapse or decorrelation.** That was the L039/L045 statistic and it is retired
  here, not paused. Reviving it would be F2.
- **Nothing about arrangement.** One arm, as before.
- **Nothing generalisable from one object.** Whatever run 3 returns is about *this object under these
  conditions*. A second object is a second run and needs its own registration.

---

## 9 · RECOMMENDATION — run it, with the amendment, and here is the cheaper thing first

**I do not refuse.** The refusal was genuinely open and I considered it, because most of the
"conditions" result is a tautology: a reader forbidden to open `consonance/ui/` cannot find defects
that need `consonance/ui/`, and confirming that costs a night to learn arithmetic. **The line is
worth one more run only because of the half that is not tautological** — the anti-monotone edge —
and that half has never been tested deliberately. It exists in the record exactly once, by accident,
because a brief was ambiguous.

**Both outcomes change what the room does**, which is my test for whether a run is worth its night:

    edge > 0   at least one seat on any important read should be run BLIND, deliberately, because
               holding the artifact can substitute for reasoning about it
    edge = 0   the vantage is a permissions setting; stop paying for reader-diversity experiments
               and say so in the journal

**And the cheaper alternative, priced honestly rather than buried.** The practice change is already
available at n = 1: L-03 is one confirmed instance **with its mechanism understood** — both readers
who held the file took the file's words as the answer, and the reader without it had only the
argument. The room could adopt *"run one seat blind on any read that matters"* tonight, on that
single case, and never run this experiment. **Run 3's job would then be to price the practice, not to
license it.** That is a legitimate choice and it is the chair's, not mine. I recommend the run
because a rate of zero would retire a practice the room would otherwise carry on one anecdote — but I
would rather the practice be adopted on one case than the line be continued on none.

**What I would not spend a night on:** any fourth run, any second object, or any revival of the
overlap statistic. F2 covers all three.

---

## 10 · WHAT I DID NOT VERIFY

- **I did not read the other readers' L045 hand-backs.** Every claim about A's and B's lists comes
  from the scorecard's member table. If the scorer mis-transcribed a reader, 2.1 and 2.2 move.
- **I did not re-derive the L039 figures from the L039 lists** — 23/24, 23/24 and the degeneracy are
  taken from the packet and the L045 scorecard's summary of them. The arithmetic `23 + 23 − 24 = 22`
  I did check; the set sizes I did not.
- **I did not re-run `l039-power.js`.** The power table in `l045_power_at_R3_2026-09-08.md` is taken
  as given; my design has no permutation statistic, so nothing here rests on it.
- **One small figure I could not make hold, reported because I looked:** that declaration's void
  clause is "set sizes differ by more than 25 %", and its appendix says the third reader's does.
  35 vs 28 is 20 % measured against 35 and exactly 25 % measured against 28 — "more than 25 %" is
  not reached on either denominator. The clause fired for the right reason and the scorer said so, so
  this changes nothing; it is one more hand-made figure beside a computed one.
- **I did not choose an object, and deliberately did not look for one.** §3.1 and §6.2 put that
  outside me, and browsing candidates would be choosing one in everything but name.
- **I have not tested the replacement brief on a reader.** Its three condition lines are written to
  be unambiguous; the only instrument that can show they are is a run, and the echo gate in §4.3 is
  what makes a failure visible early rather than after the score.
- **I did not verify the commit-gate behaviour on `loop/packet_*.md`.** I took the packet's word and
  named the file accordingly, which costs nothing if the warning is wrong.

    OBJECTIVE:  a third run that can fail — or the written case against one. Delivered: it can fail,
                by F1, F2 or F3, and the case for running it is in §9 with the cheaper option beside.
    FALSIFIER:  a registration whose stated design cannot produce a result that ends the line.
                Unfired: F1 returning zero ends it, and zero is a likely outcome.
