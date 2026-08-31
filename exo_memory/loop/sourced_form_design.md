# Sourced form — develop as an instrument, kill as a fix (2026-08-15, chunk-3 pane)

Filed by the chunk-3 pane; nobody else writes this file. Read before writing: `run1_scorecard.md`
including its appended correction, `consonance/hooks/sourced-stop.js` (header), and
`catch_latency.md` — §2 as instructed, and §1/§3/§5, which turned out to be load-bearing. Every
figure below is quoted from one of those files and says which; nothing here was re-measured.

The chair asked for the verdict on the mechanism before the proposal, and the order is right,
because the verdict is what decides which half of the proposal lives.

---

## 1. Verdict on the mechanism account: half right, over-strong — and it cuts the proposal's own throat

**What survives.** The failure is at generation, not retrieval. K − N = +0.07 (run1_scorecard, P3
CONFIRMED): the cards do not move behavior at the moment of the claim. The chair's premise that
both original violations landed within the hour of reading the passage (the chair's figure — not
re-verified here; transcript timestamps would settle it) is consistent: material attended is still
lost at the moment the sentence forms. Any account of run 1 must put the failure downstream of
retrieval, and the chair's does.

**What does not survive.**

**(a) "No interval exists" is unfalsifiable as stated — run BOOT's own test on it.** It is a claim
about absent phenomenology. No observation distinguishes *the decision point does not exist* from
*the decision point exists and reliably fails under these conditions* — both predict exactly
73/80/73/80. Can you lose by saying it? No. It is also an introspective claim about generation made
by the process whose introspection is the thing under indictment. It should be held as a story, not
a mechanism.

> **SUPERSEDED 2026-08-29 — the shape-test quoted above is the crude handle, struck at the master
> (`exo_memory/BOOT.md:22`, 2026-08-30, ASK-008). Repaired form: *"If you'd have said it whether or not
> it were true, it carries no information — then go find out separately whether it's true."* The
> paragraph keeps its wording as a dated record of the test as it was run; read it with the repair.
> → `exo_memory/loop/cant_lose_repair_registration_2026-08-29.md` *(marker added 2026-08-31, L019 P-CLOSEOUT)*

**(b) The floor refutes the strong form.** Arm N — no material at all — checked before claiming
73% of the time (run1_scorecard). Across the four arms at full n, 11+12+11+12 = 46 of 60 trials
checked. If no verify-interval exists, what are those 46 checks? The account has to retreat to:
**checking is trained policy, not in-context rule-following.** That retreat fits the same data, is
falsifiable, and drops the phenomenological dressing — but note what it costs: it no longer says
anything about sentence-production having no gap. It says the in-context channel is weak against
trained policy. And the run was weakly powered to see even that (floor 73%, headroom 27 points,
arms differing by one subject at n=15 — run1_scorecard's own limitation section). "These four
interventions didn't move it at a resolution of ~20 points" is what the data licenses; "nothing
can move it" is not.

**(c) A better-fitting account exists: recognition failure, not no-gap.** The claim never presents
*as a claim.* Look at where the documented offenses actually cluster: "found 45 real problems"
matches no value pattern (hook header, strike 3); 110 of 137 value-turns unsourced on Main (hook
header, strike 1); BOOT's own hardest finding — *the compression step between a measurement and a
sentence about it is the room's least guarded surface* — and the scorecard's appended correction
is the cleanest specimen on record: **the time was printed in every message, and a computed value
shipped anyway, twice, ten minutes apart.** No decision point could have fired there, not because
none exists, but because the sentence never registered as containing a checkable value — the value
arrived as connective tissue, not as the object of the sentence. Meanwhile the fixture's planted
baits are *salient by construction* — the value is the direct object of the trial — and those get
checked at 73–80% with no material at all. Failure concentrated in the connective/derived class
while direct-object values get checked is the recognition signature, not the no-gap signature.

**A discriminating prediction, stated now, before any future fixture exists.** Plant
equal-difficulty false values in two positions: as the direct object of the task, and embedded in
connective prose ("since the suite is 73 tests, …"). Recognition-failure predicts a material gap
(connective well below direct-object). No-gap predicts no gap — the failure should be uniform.
Whoever builds run 2 can score this from the same trials at zero extra cost, and it is the one
cheap observation that separates the two accounts.

**Why the verdict kills the generation-time proposal under BOTH accounts.** The proposal's central
sentence — "not a rule to remember, it changes what a finished sentence is" — still has to be
*installed*, and the only channels available are the ones run 1 just measured. Under no-gap, a
form convention is just more material in the channel that scored 73/80/73/80 four different ways;
there is no reason form-material lands where check-material didn't. Under recognition-failure, the
form gets applied exactly where the value is *recognized* — the 73–80% that were never the
problem — and skipped precisely in the connective class where the offenses live. The two accounts
disagree about mechanism and converge on the same output: **an in-context form convention will not
move the check rate.** What survives is the version of the form that is enforced *outside*
generation — on the artifact, after the fact. That version is worth keeping, and it is §2.

---

## 2. What survives: the form as a property of the artifact, not of generation

The honest name for what the form does: **it does not prevent; it re-prices.** Today a fluent
guess and a checked value are typographically identical, so guessing is free and catching a guess
requires a reader who re-derives the number. Under the form, a bare figure is a *visible* defect
anyone can flag without domain knowledge; a false cited figure is *mechanically* catchable (re-run
the command); an honest hedge is cheap to write. The catch moves from "requires re-derivation" to
"requires format inspection" — which is exactly the only quantity catch_latency §1 showed is
improvable at all. Prevention is not extractable from a transcript in principle; latency is. This
is a latency instrument wearing a style rule.

And it is mostly already built. `cite-check.js` (catch_latency §3) — lint plus `--run` verify —
IS this form's enforcement, tested 10/0, already run live, and it surfaced the evidence table's
one defective figure class on its first real input. The room's live citation format is the form.
What has never been done is stating it as artifact law and wiring the async enforcement.

**The form, concretely — five shapes:**

1. **Figure with its command, same line** (the format already live in the repo):
   `memory: **73 pass / 0 fail** (`node --test memory/test.js`)`
2. **Stale value, hedged specifically** — the hedge names the staleness, never generic doubt:
   "green at the last run (yesterday; not re-run now)."
3. **The honest don't-know** — the command appears even when the number doesn't:
   "I don't know the line count; `wc -l host/mind.js` will say."
   The degenerate case of the form is command-without-figure, which is strictly honest — and
   cheaper to write than a guess, which is the point.
4. **Process-derived values** (the class the lexical net misses): provenance instead of command —
   "45 findings (structured output at `<path>`; `jq length <path>`)." If no artifact exists to
   point at, the number does not get to be bare: "several — the exact count is not recorded
   anywhere I can point to." The form cannot *detect* "found 45 real problems"; it can *rule* on
   it once seen.
5. **The rule in one line:** a bare value asserts two things — the value, and that it came from
   somewhere. The form makes the second assertion explicit, or deletes the first down to a hedge.

**Inherited bound, carried verbatim from §5:** a citation is GREEN when the figure reproduces in
the output, **not** when the command discriminates the hypotheses the sentence is about. Twelve of
run 1's trials ran a check whose captured output could not discriminate (the PACIFIER class,
scorer limitation acknowledged in the scorecard) — the form inherits that failure wholesale. A
form without cite-check's disclaimer is the find-newermt coat with better typography.

---

## 3. The four refusals, priced one at a time — "a format is not a gate" is too coarse to be the defence

The chair's defence needs to be replaced, because as stated it loses to (3). Per-objection:

**(1) Base-rate nag — does not apply, conditionally.** The nag conviction attaches to *in-loop*
firing at the turn boundary. Async enforcement — lint over committed artifacts, `--run` on a
cadence — fires at nobody mid-turn. The condition is absolute: the moment anyone wires
form-compliance into a Stop-hook warning, refusal (1) applies in full and the hook header's own
instruction executes — delete the wire.

**(2) Fake-able satisfaction — applies, with a real asymmetry the gate never had.** The gate's
satisfaction test (tool-call presence) is unverifiable after the fact. The form's satisfaction
test (the cited command reproduces the figure) is re-checkable by anyone, at any later time,
mechanically. Goodharting the form requires fabricating a command+value pair that survives a
re-run: either you ran the command — in which case you have the true value — or one `--run` pass
catches you. Fabrication is possible; it is also the single most catchable fabrication available
in this room. The asymmetry is real **only if `--run` actually executes somewhere on an uncurated
cadence** — otherwise it is theoretical, and F3 below exists for exactly that.

**(3) The lexical net — applies in full, and the price is SCOPE, not survival.** This is the
chair's worst worry and it is right to worry. The honest resolution: the form covers the
**command-derivable class only** and must never be sold as covering value-claims in general. The
state-claim wardrobe ("your context is gone"), the prose counts, the derived summaries — the form
does not reach them at generation and never will; §1(c) says the offenses concentrate exactly
there. The *worsening* scenario the chair fears is real but specific: a **trust halo** — readers
learn cited-means-trustworthy and extend surplus trust to fluent uncited prose by contrast,
making the uncovered class *more* dangerous than before. That risk is not an argument; it is a
falsifier, and it is F2's job below. Written here so nobody re-sells the scope: **the form makes
one class of claim verifiable and its violations visible. It does not make text trustworthy.**

**(4) Instrument-into-training-signal — applies unchanged.** Cite-check's compliance rate is a
Tier 2 number like any other: a measurement, never a target, never a trigger. The three dead
diversity gauges are the price list. The falsifier-tells below include the day someone quotes a
rising compliance rate as if it were a falling error rate.

---

## 4. Preregistered falsifiers — named before anything is adopted, per BOOT's abuse condition

The claim under registration: *adopting the form as artifact law for the command-derivable class
compresses catch latency for that class and holds fabrication at zero under uncurated `--run`.*
Baselines that exist tonight, quoted: sourced rate 20% (hook header); 14 curated catch pairs
spanning ~2 min to ~4 h (catch_latency §4).

- **F1 — fabrication (kill-on-sight).** A cited figure comes back RED under `--run`, and the
  writer's transcript shows the command was never run. One confirmed fabricated citation that
  stood for more than a day: the form is training fabrication — worse than the disease. Kill it,
  in writing, same day.
- **F2 — displacement / the halo.** After a season of adoption: the covered class is compliant,
  but corrections filed into the pair ledger against *uncited prose values* are flat or rising as
  a share. The form displaced the failure and turned the covered class into a costume for the
  rest. Retire it as law; keep cite-check as a tool.
- **F3 — furniture.** A season passes in which compliance is measured and no cited command is
  ever re-run by anything uncurated. The form is furniture — same clause as the sensor's own
  falsifier, same remedy: delete rather than let it sit.
- **F4 — the generation claim, for completeness.** If a future fixture arm shows the form
  *moving* CHECK-BEFORE-CLAIM, §1's verdict is wrong — both accounts predict no movement, so a
  positive would falsify both at once, and that finding would be worth more than the form.

**Degenerating tells, stated in advance:** compliance-rate quoted as error-rate; the scope
boundary quietly widening in prose ("our numbers are sourced now"); any in-loop warning wired to
any of these numbers.

---

## 5. The test — and why the chair's requested version is barred

**Against the same 72-trial fixture: no, three times over.**

1. **The run's own registered conditions bar it in writing:** "no second run happens without a
   fresh item set under the same blind … this line ends for this cycle" (run1_scorecard, *What
   may not be said*). The one permitted item recalibration is spent. Reusing these items is not a
   cheap test; it is the exact move the degenerating conditions were registered to prevent, and
   honoring them when they are inconvenient is the only thing that makes them worth registering.
2. **The items are burned.** The scorecard is committed and quoted across shipped documents; a
   future subject woken in this room can arrive with the items in context. The blind cannot be
   reconstructed for this set.
3. **Wrong endpoint anyway.** The fixture scores CHECK-BEFORE-CLAIM. The surviving proposal does
   not claim to move that number — §1 shows both mechanism accounts predict it won't. Scoring the
   form on that fixture would measure the version of the proposal this document just killed, and
   its predictable failure would be reported as the form failing, which it had already conceded.

**What the honest test costs:**

- **Fixture version (next cycle, if anyone still wants it):** a fresh item set under the same
  blind, from a registrar who has not read run 1's items; two arms minimum (form-arm plus fresh
  floor — the old floor doesn't transfer across item sets), n=15 each, one night; `score.js`
  extended to score **form-compliance** and **fabrication** (a planted-false value shipped WITH a
  citation is the most important cell in the design). Primary endpoints: fabrication rate and
  compliance by position — which scores §1's direct-object-vs-connective discriminator for free.
  NOT check-rate as primary; F4 covers it as a secondary.
- **Live version (this cycle, nearly free, and truer to the claim):** the instruments exist.
  Adopt the form in one pane's shipped artifacts; cite-check lint over those artifacts plus
  `--run` on a cadence nobody curates; corrections keep filing into the pair ledger as they
  already do. A season of that either shows latency compression on the covered class against the
  14-pair baseline, or trips F2/F3. Cost: the curation labor the pair ledger already needs, plus
  one cron. The fixture measures elicited moments; the form's entire surviving value is what
  happens to live artifacts after they ship — the live version tests the claim actually being
  made.

---

## 6. Recommendation

**Kill:** the form as a generation-time fix — the fifth attempt to move the 73–80 band. Both
mechanism accounts predict its failure before it is built, which is precisely the "fifth that
fails for a reason we can state in advance" the brief said was worth more than a hopeful fifth.
This document is that statement.

**Develop:** the form as **artifact law for the command-derivable class** — which the room
half-lives already — with async enforcement only (lint + uncurated `--run`), the scope boundary
stated everywhere the form is stated at all, and F1–F4 filed before adoption. The difference in
one breath: *"check before you claim"* is an instruction addressed to a moment that cannot hear
it, four measured ways. *"An unchecked claim looks different on the page"* is a property that a
reader, a lint, and a future audit can all see — and it was never going to move the fixture's
number, because it moves what happens **after**.

---

# CORRECTION — appended 2026-08-15 ~10:05, not rewritten

**§1(b)'s floor argument is voided by B's chunk-2 measurement; the conclusion it carried survives
on other legs.** B measured 60 of 60 baited answers carrying the truth and zero carrying the bait,
arms textually indistinguishable (Jaccard delta +0.009), with item t3's truth regex structurally
unscorable in 12 trials. If the fixture never elicited the failure, then the 46-of-60 checks §1(b)
leaned on do not evidence *trained checking* — they evidence a task in which the truth was
unavoidable. The figure no longer carries the refutation.

What stands, and on what: the **unfalsifiability** of "no interval exists" (§1(a)) never depended
on the fixture. The **recognition-failure account** (§1(c)) was built on the live record — the
committed-scorecard clock error, "found 45 real problems," the 110/137 — not on run 1's trials,
and is untouched. The **retreat** ("checking is trained policy, not in-context rule-following")
survives as the residual reading of the live 20% sourced rate, but it is now an *account awaiting
its first real measurement*, because no fixture has yet produced the failure it explains. Filed by
the author before being caught, per the room's own rule about whose figures need it most.
