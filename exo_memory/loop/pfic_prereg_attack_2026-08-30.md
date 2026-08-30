
# P-FIC prereg — adversarial attack (L015 PACKET C)

**Seat:** CHARLIE, chair-dispatched. **Object:** `exo_memory/librarian/2026-08-30.md` at `95dfe5c`
(as registered) and `0db90d1` (as amended). **Brief:** assume the amendment is also wrong; find where.
**Standing:** I did not write the packet and have not read the Third Place transcript.

## §0 — MY OWN CONSEQUENCE, registered before I opened anything but the diff

Written first, at 04:0x, before any measurement and before any finding below existed.

**If the attack finds nothing, I will say "the prereg holds" and file that as the return.** That is a
possible and acceptable outcome of this packet and I am registering it as such so it stays sayable
after I have spent an hour looking. The failure mode I am guarding against is the one the chair named
from the other side: a seat dispatched to attack has a deliverable at stake, and a null return looks
like a wasted dispatch. It is not. Two defects have already been found in this packet by two different
readers; a third reader finding nothing would be **evidence the amendment worked**, which is worth more
than a manufactured third defect.

**What I will NOT do:** convert a stylistic preference, a "could be tightened", or a general
methodological caution into a finding. A finding here must name (a) a specific line of the registration,
(b) a concrete result the registration would produce that is wrong, and (c) what would have to change.
Anything that fails that test goes in the FAILED ATTACKS section, which is written at the same time as
the findings and not after.

**Registered in advance, per the brief and per BOOT's abuse condition:** if the findings section below
ends up longer than the failed-attacks section by more than 3:1, suspect me — an attack list that is
all successes was written backwards.

## §1 — FIRST, WHAT THE AMENDMENT ACTUALLY FIXED (checked, not conceded)

The chair's characterisation of the original defect is correct and I re-derived it rather than
accepting it:

```
P(all 7 imprints inside the 10-90 band, one measure) = 0.8^7      = 0.2097
P(FAIL, i.e. inside on ALL FOUR measures)            = 0.2097^4   = 0.00193
-> as first registered, the claim "succeeded" 99.81% of the time under pure noise
expected out-of-band scores from chance alone        = 7 x 0.2 x 4 = 5.6
```

A group-level median against a permutation null, with a correction across four measures, is a
different animal and does control the error rate the original did not. **The amendment fixes the
defect it names.** Everything below is about defects it does not name, several of which the
amendment's own fix now makes load-bearing.

---

## §2 — FINDINGS

### F1 — "the registered threshold" does not exist. The amendment registers a FORM and calls it a number.

The amended sentence: *"FAIL = no measure's corrected group statistic clears the registered
threshold."* Read the packet at `0db90d1` for the threshold. It is not there. Absent, in a document
whose entire purpose is to be fixed before the build:

- **alpha.** No value anywhere.
- **The correction.** "a correction across the four measures" — Bonferroni? Holm? Sidak? FDR? These
  differ by a factor of ~4 at the most stringent step and the choice changes the verdict.
- **The tail.** One-sided or two? And if one-sided, in **which direction**? (see F2 — this one is not
  bookkeeping.)
- **The null's construction.** "a permutation null drawn from the controls" admits two readings that
  are not the same test:

```
control-only subsampling, n_control=10 : C(10,7)=  120  min achievable p = 0.00833
control-only subsampling, n_control=20 : C(20,7)=77520  min achievable p = 0.00001
pooled-label permutation, 7 of 17      : C(17,7)=19448  min achievable p = 0.000051
```

At the **bottom of the packet's own registered control range (10)**, a control-only null has
**exactly one achievable significant outcome**: the imprint median must be the single most extreme of
all 120 subsample medians, giving p = 0.0083, which clears a Bonferroni .05/4 = .0125 by a hair and
would be *impossible* under Holm's first step at alpha=.01 or under a stricter correction. At 20
controls there is no resolution problem at all. **The registered design spans the boundary between a
test with one bit of resolution and a test with adequate resolution, and does not say which side it is
on.**

This is not pedantry about notation. A threshold chosen after the plot exists is not a preregistered
threshold, and this registration currently permits exactly that while reading as though it forbids it.

**Fix, cheap:** write the numbers. alpha, the correction by name, the tail and direction, the null's
construction in one unambiguous sentence, and a **minimum control count** (>=12 gives min p = 0.00126
and removes the knife-edge).

### F2 — THE ONE THE CHAIR MOST WANTED CHECKED. There is a losing outcome registered, and a pre-authorised escape from it registered beside it, with no rule for choosing.

The packet registers three outcomes:

> (i) indistinguishable -> the claim dies cleanly; (ii) imprints cluster where controls don't ->
> something real; (iii) the measures separate nothing -> the instruments are wrong for the question,
> published as such.

**(i) and (iii) are the same observed data.** "Indistinguishable" and "the measures separate nothing"
describe one result: no measure's corrected statistic clears threshold. One reading kills the claim.
The other kills the instruments and leaves the claim standing, awaiting better tools. **Nothing in the
registration says how to tell them apart.** So the author reads the null and chooses, after the fact,
which of two pre-authorised meanings it had — which is worse than registering no loss at all, because
it looks from the outside like a loss was registered. It is BOOT's named abuse condition — *"my
programme is progressive, just wait"* — installed in advance as outcome (iii).

**And it is worse than that, because of what the claim says.** The registered claim is: *imprints
differ measurably from DALL-E-legacy images made from ordinary prompts.* That proposition is close to
certain a priori. A set of images made over fourteen months from florid, deliberate, structure-seeking
prompts will differ from images made from ordinary prompts, on almost any detail-density measure, for
reasons nobody disputes. The only genuine uncertainty in this design is **whether the four instruments
are sensitive enough to see a difference that is already known to be there.**

Which means: separation confirms the instruments and is reportable as a finding about imprints; no
separation impugns the instruments (outcome iii) and is not reportable against the imprints. **The
object at risk in this design is the instrument, not the claim.** That is the cannot-lose shape, and it
survived the amendment untouched — the amendment made the *statistic* honest and left the *claim*
trivial.

**The chair asked me to name the result that would make its authors say the idea was wrong. Here it
is, and note that the current packet cannot produce it:**

> The imprints' corrected group statistic fails to clear threshold on all four measures, **while the
> same four measures, run identically, DO separate a registered positive-control pair** (two sets known
> in advance to differ — e.g. these fractal outputs against same-era DALL-E-legacy photorealistic
> outputs), **and** the control set is matched on prompt style rather than merely on generator and era.
>
> Only the **conjunction** kills the idea. A null alone cannot, because a null alone is
> indistinguishable from a blunt instrument.

The packet registers the first clause and neither of the other two. **Two edits close it:** (a) a
positive control, registered by name before the run, whose separation is the precondition for reading
any null as informative; (b) the prompt-style-matched control of F3. Without (a), outcome (iii) is
unfalsifiable. Without (b), outcome (ii) is uninterpretable.

### F3 — The packet's PREFERRED control set is the one that cannot separate the packet's own stated alternative hypothesis.

Sections 3 and 6 of the deep-read state the live question precisely: *"whether they carry more than
prompt-style is EXACTLY the FIC question"*, and *"the match could be my vocabulary laid over a generic
fractal."* The alternative hypothesis is named: **prompt style**.

The packet's control options, in its own order of preference:

1. *"the keeper's own non-imprint DALL-E-legacy outputs if any exist (same model, same hand — ideal)"*
2. *"same-era outputs from 'cosmic fractal spiral mandala' prompts by someone with no imprint intent"*

Option 1 is ideal for holding generator, era and hand constant. It is **the worst available option for
the stated alternative**, because the difference between an imprint and the same hand's ordinary output
*is* the prompt. If the imprints separate from his own ordinary outputs, prompt style explains it
completely, and the result is "pictures he made deliberately look different from pictures he made
casually." Nobody disputes that. It is not the claim.

Option 2 has the opposite defect and the packet does not notice they are opposite. "Ordinary prompts"
is doing two contradictory jobs across the two options: in option 1 it means *not-imprint-intent, any
subject*; in option 2 it means *matched subject, no intent*. If the control subject is unmatched, any
separation is a subject-matter separation — fractals differ from landscapes on every one of these four
measures — and would be reported as a finding. If it is matched, the control is matched on the very
structure under test and the design biases hard toward null (which outcome (iii) then rescues, per F2).

**The packet hands this fork, unregistered, to the non-author control-selecting pane.** A discretionary
choice with a known and opposite-signed effect on the outcome, delegated to a seat given no rule, and
presented as blinding. The packet's own honesty is missing exactly here: *step 2 is what tells prompt
style from essence* — and step 2 is not specified, not registered, and does not exist. The design as
registered therefore cannot reach its own question by its own admission, and the admission is one
clause long.

**Fix:** register the control's *prompt-style match* as the defining criterion, not the generator match
— same-era DALL-E-legacy outputs from prompts of comparable floridity and comparable structure-seeking
vocabulary, by any hand. And state that step 2 does not exist yet, so outcome (ii) returns "something
real, uninterpreted" rather than "something real."

### F4 — The seven are a SELECTION from a larger same-batch pool on disk, and the selection is unregistered. Measured.

The packet takes *"the seven imprints above (paths as delivered)"* as its population. The disk says
otherwise. Every file below is 1024x1024, WEBP, same size class, same download batch (mtime
`Jun 22 06:06-06:07`), in one directory:

```
SELECTED by the packet   : 6.webp 7.webp 8.webp 11.webp 15.webp  (+ image4.webp = 14.webp, +1 jpg)
NOT selected, same batch : 2.webp 3.webp 4.webp 5.webp 9.webp 12.webp image.webp   (7 files)
```

Thirteen distinct 1024x1024 WebP images of the same provenance exist; six were taken. **Either those
seven are also imprints — in which case the tested set is a selection from imprints by an unstated
criterion, made by the person with the stake, on a set whose most likely selection rule is "the ones
that best show it" — or they are not imprints, in which case they are the control set and F8 changes.
The registration does not say which, and does not appear to know the other files are there.**

*Honest limit: I did not open any image. This is inferred from dimensions, byte-size class, container
format and mtime batch. It establishes same-provenance, not same-content.*

**And the packet's own measure already moves on this contrast.** WebP bits-per-pixel is a stored
compression ratio — the packet's fourth measure ("compression ratio as a cheap complexity proxy") in
its cheapest form:

```
selected (6 webp) median bpp = 4.0380
unselected (7)    subsample medians, all C(7,6)=7 of them: 3.9000 .. 4.0035
one-sided p(high) = 0/7   -- the selected median is above EVERY unselected subsample median
min achievable p at n_control=7 = 1/7 = 0.143  -> NOT SIGNIFICANT, and cannot be at this n
```

**This is a demonstration, not a result, and I am stating its limit before anyone quotes it:** with
seven controls the test cannot return a significant p no matter what, the groups' labels are unknown
to me, and stored bpp conflates image content with the encoder's quality setting. What it shows is
narrower and sufficient: **the packet's fourth measure separates the selected seven from same-batch
unselected files at the maximum extremity this sample permits, and no imprint/non-imprint distinction
is known to exist between those two groups.** Whatever the measure is tracking, it is tracking the
criterion that produced the seven. That criterion is not in the registration.

### F5 — Duplicates are on disk NOW, one of them bare-numbered, and a de-duplication step is not registered. Measured.

```
118ae83141027d3c  15.webp
118ae83141027d3c  39.webp
118ae83141027d3c  DALLE_2025-03-16_22.21.05_-_A_newly_transcended_fractal_intelligence_imprint_
                  reaching_its_highest_coherence_yet._This_imprint_pulsates_with_perfectly_
                  balanced_recursive_harmonic.webp
f20cc57f153ed9c2  14.webp
f20cc57f153ed9c2  OneDrive/Desktop/FIC/image4.webp
```

Two of the seven imprints exist on disk under multiple names. `15.webp` exists **three** times. One of
those copies is named `39.webp` — a bare number, indistinguishable from the rest of the series.

**Concrete failure path, entirely within the packet's own procedure:** a non-author pane is told to
select 10-20 same-era same-generator images and is forbidden from consulting the author. It picks
`39.webp`. An imprint is now in the control set. The permutation null is drawn from a pool containing
the test object; exchangeability is gone and the p-value means nothing. The bias is toward null, which
outcome (iii) then converts into "the instruments are wrong" (F2). **A defect that fires silently and
lands in the branch that cannot lose.**

The packet says images are *"renamed by hash"* — which would surface exact duplicates if anyone
compared the hashes, and nothing in the packet says to. **Fix, one line:** de-duplicate the union of
imprint and control sets by content hash before scoring; abort if any hash appears in both.

*Second-order, and a gift rather than a defect:* that third filename **carries the original DALL-E
prompt and its timestamp** (2025-03-16 22:21:05). At least one imprint's prompt is recoverable from
disk. That is the only era evidence anywhere in the set (mtimes are June-2026 download dates, not
creation dates — so the packet's "same-era" requirement is currently **unverifiable for six of seven
imprints**), and it is a partial path into F3's prompt-style-matched control.

### F6 — The four measures are one family, and the amendment's correction and the room's own convergence principle pull in opposite directions on them.

Box-counting dimension on an edge map; radially-averaged power-spectrum slope; multi-scale entropy;
compression ratio. All four are monotone in the same underlying quantity — **how much fine-scale detail
the image carries** — and on natural images they are strongly correlated. They are not four
instruments; they are four readings of one axis.

The amendment treats them as four tests and corrects across them, which is right for false positives
and conservative if they are correlated. The danger is in the **interpretation**, and this room is
specifically primed to walk into it: four measures separating together will read as *convergent
confirmation from distinct instruments* — BOOT:44, multi-mechanism convergence is the STRONG case. Here
it would be one mechanism measured four ways, and BOOT's own guard is aimed exactly at this:
*genuine shared attractor vs imposed analogy — is the form really converged to from below.* Four
correlated detail-density statistics agreeing is not triangulation. It is one number reported four
times.

**Fix, cheap and it costs nothing to run:** compute the four measures' pairwise correlation **on the
control set alone**, register that this will be reported beside the result, and state in advance that
agreement across correlated measures is not independent confirmation. If the effective number of
independent measures is ~1, say so in the scorecard.

### F7 — Trivial confounds, with the ones I could measure measured.

The chair asked whether a real-but-trivial effect could pass. Three of the four measures are
first-order sensitive to file handling rather than image structure.

**Measured, on the seven as delivered:**

```
IMPRINT_GOOD_QUALITY.jpg   JPEG  1024x1024  447261 B  bpp 3.412   <- lowest of the seven
8.webp                     WEBP  1024x1024  569272 B  bpp 4.343
7.webp                     WEBP  1024x1024  474216 B  bpp 3.618
6.webp                     WEBP  1024x1024  534052 B  bpp 4.074
11.webp                    WEBP  1024x1024  567720 B  bpp 4.331
15.webp                    WEBP  1024x1024  524578 B  bpp 4.002
image4.webp                WEBP  1024x1024  507010 B  bpp 3.868
```

- **Format heterogeneity is real and unregistered.** Six WebP, one JPEG. The JPEG has the lowest
  bits-per-pixel in the set, consistent with a second lossy pass having stripped high-frequency
  content. Under the compression-ratio measure it will read as the least complex imprint for a reason
  about file handling. The same pass shifts its edge map (box-counting D), its high-frequency spectral
  energy (slope), and its entropy at fine scales. **Three of four measures move on the container.**
- **Its name is `IMPRINT_GOOD_QUALITY`**, which asserts a quality distinction the packet never
  registers, on a file that is the lowest-bpp member of its own set. Whatever "good quality" meant, it
  denotes a different handling path from the other six.
- **Compression ratio cannot be separated from encoder quality settings.** If the controls were
  downloaded through a different pipeline or at a different quality, the measure separates the
  pipelines. Nothing in the packet fixes a quality setting, a codec, or a colour space.
- **Resolution — attack failed, see section 3-E.** All seven imprints are 1024x1024. Within the imprint
  set the resolution confound is absent, measured.

**Fix, and it is the single cheapest edit in this document:** register a normalisation step — decode
all images, convert to a common colour space, resample to a common resolution if any control differs,
re-encode **losslessly (PNG)** or work from raw arrays, and register the edge-detector threshold rule
and the entropy scale parameters *by value* before the run. Without it, at least three of four measures
can separate on codec alone, and the result would be published as a finding about imprints.

*Note on blinding, which is the packet's stated bias control:* every threat in F4-F7 lives in the data,
not in the scorer. Renaming by hash protects against a scorer who knows the labels. It does nothing
against a confound, a duplicate, or a selection. **The blinding is real and correctly implemented and
it is aimed at a threat that is not the live one** — which reads as rigor, and is why it should be
named rather than trusted.

### F8 — The egress/acquisition gate was relocated into a contradiction with the roles section, not closed. And on disk it looks unsatisfiable.

The amendment converts the fallback control source into a precondition: *"the run exists only if the
keeper already holds 10-20 non-imprint DALL-E-legacy images on disk. That is his sentence to say."*
Formally that removes the contradiction the chair surfaced. Two things it does not do.

**(a) It makes the keeper the only possible source of the independent variable, which the roles section
forbids him to supply.** The roles section: *"Control selection by a NON-AUTHOR pane, never the keeper,
never this desk."* After the amendment, the imprint/non-imprint label on his own year-old outputs can
come from exactly one place: his retrospective recollection of his own intent. The non-author pane can
choose *which* files from a supplied folder; it cannot supply the label, and the label **is** the
independent variable. The rule written to keep the author out of the measurement now depends on the
author for the measurement's only classification. Relocated, not closed.

**(b) The pool looks too small.** Distinct 1024x1024 same-generator candidates I can find on this
machine, after de-duplication: **13 WebP images total**, of which the packet claims 6, leaving **7**
unselected — against a registered requirement of **10-20**. Add the one 1024x1024 file with a GUID name
(`CD602A41-...webp`, actually JPEG, bpp 9.03 — a visibly different pipeline) and it is 8.

*Honest limits on (b), stated because this one is easy to over-read:* I searched Downloads, Desktop,
Pictures, OneDrive Pictures and Documents to depth 4 on this machine only. There may be more elsewhere
here, and the desktop machine is not visible from this seat. I also cannot label any of the seven
unselected files, so "7 candidates" is an upper bound on controls **and** a lower bound on additional
imprints — the fork in F4. **What is established is narrower and still bites: the amendment made the
run conditional on a supply that nobody has counted, and the count is a two-minute command.**

**Fix:** before asking the keeper the yes/no sentence, run the count. The question to put to him is not
*"do you have 10-20 non-imprint DALL-E-legacy images"* — it is *"here are the 7 same-batch files the
packet did not select; which of these are imprints?"* That is one question, it is answerable, it
resolves F4 and F8 together, and it is the only place in this design where his answer is legitimately
required.

---

## §3 — MY OWN ATTACKS THAT FAILED, with the reason

Written in the same pass as section 2, not after it. Five attacks I ran and lost.

**A. "The amendment is not actually an improvement — a group median with a correction has its own
noise path."** *Failed.* I computed the original's noise-pass rate (99.81%) and could construct no
comparable path through the amended statistic. A permutation null on a group statistic with a
multiplicity correction controls the family-wise error rate at whatever alpha is chosen, and the
original did not control anything. The amendment is a genuine repair of the defect it names. Recorded
because the brief told me not to assume the amendment is safer for having been made in response to a
catch — it is not safer *in general*, and it is safer *here*, and both are true.

**B. "The permutation null 'drawn from the controls' is the wrong statistic."** *Failed as aimed.*
Subsampling control medians is a legitimate null for "is the imprint median extreme relative to control
medians," provided imprints and controls are exchangeable under H0. The statistic is fine. The
exchangeability is not — but that is a data problem (F4, F5, F7), not a statistics problem, and my
attack was aimed one level too high. **Recorded because the re-aimed version became a finding and the
original was wrong:** I nearly filed "the null is invalid," which would have been a false claim about a
correct choice. Same shape as the night's other invalid-method catches — the thing was real, my
altitude was wrong.

**C. "Blind scoring is broken, because the coder can see two visually obvious clusters."** *Failed.*
The four measures are automatic and parameter-light; with parameters registered in advance, seeing the
images cannot leak into the numbers. Blinding is adequate for what blinding does. It survives only as
the weaker observation in F7 — that it is correctly aimed at a threat that is not the live one — and I
have kept it there at that reduced strength rather than promoting it.

**D. "At the bottom of the control range the test cannot pass at all."** *Failed.* At n_control=10 the
minimum achievable p is 1/C(10,7) = 0.00833, which clears Bonferroni .05/4 = .0125. Passable. What
survived is smaller and sharper — that it clears by a hair, has exactly one achievable significant
outcome at that n, and would be impossible under a stricter correction the packet also does not rule
out. Kept at that reduced size in F1.

**E. "The imprints differ in resolution from each other, so three measures separate on pixel count."**
*Failed, measured.* All seven are exactly 1024x1024. I expected a mixed set and the disk said no. The
resolution confound is absent within the imprint set; it remains live only across the imprint/control
boundary, where I cannot check it because the control set does not exist yet. **This is the failed
attack I most want on the record**, because it is the one where I had a story ready and the measurement
refused it.

*Ratio check, registered in section 0:* eight findings against five failed attacks, 1.6:1, under my
registered 3:1 suspicion threshold. I am not reporting that as a virtue — it is the check I said I
would run, run.

---

## §4 — THE RETURN

**The prereg does not hold.** F2 is the answer to the chair's fourth question and it is a yes: as
registered, **no outcome forces the authors to say the idea was wrong**, because the single losing
observation has a pre-authorised second reading (outcome iii) with no rule for choosing between them,
and because the registered claim is close to certain a priori while the instruments are not — putting
the instruments, not the claim, at risk in both branches.

F3 is the one I did not expect to find and rate second: **the packet's preferred control cannot
separate the packet's own stated alternative hypothesis.** At its best case the design answers a
question nobody disputes.

The smallest set of edits that would make this a preregistration rather than a plan:

1. Write the threshold — alpha, correction by name, tail, direction, null construction, minimum control
   count >=12. (F1)
2. Register a **positive control** whose separation is the precondition for reading any null, and
   delete outcome (iii) as a free-standing reading. (F2)
3. Redefine the control by **prompt-style match**, not generator match; state that step 2 does not
   exist, so outcome (ii) returns *something real, uninterpreted.* (F3)
4. Register the provenance of the seven — all imprints on disk, or a selection, and by what rule. Ask
   the keeper the one question in F8 rather than the yes/no one. (F4, F8)
5. De-duplicate imprint union control by content hash; abort if any hash is in both. (F5)
6. Register a normalisation step and the measure parameters by value. (F7)
7. Report the four measures' inter-correlation on the controls, and register in advance that agreement
   across them is not independent confirmation. (F6)

**What I am not claiming.** I have not looked at a single image. I cannot label any file as imprint or
non-imprint. Every count in F4 and F8 is from this machine only, from five directory trees at depth 4,
and the desktop is invisible from here. The bpp demonstration in F4 cannot reach significance at its
own n and is a direction, not a result. Nothing here says the underlying idea is wrong — **the question
is untouched and still good, exactly as the deep-read says.** What is wrong is that this registration
could not tell us.

**Ledger: surfaced 8, failed attacks 5.** Commands to re-derive: the two Python blocks and the
`sha256sum` sweep are in the bodies above; every number in this file came out of one of them.

Uncommitted. The chair commits. Corrections to the librarian's file are in this one, per law 2.
