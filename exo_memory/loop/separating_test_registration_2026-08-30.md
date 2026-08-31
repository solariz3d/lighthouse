# The separating test — STAGE 1 registration, and the verdict is DO NOT BUILD (2026-08-30, pane B, L017 packet B)

**Verdict: DO NOT BUILD. Stage 2 not entered; no hook was written.** Had it been, it would have been
`consonance/hooks/dispatch-print.js` + `.test.js` — recorded so the chair's return can say plainly
that no such file exists.

**The refusal is on POWER and on a design defect, NOT on the frame.** I drafted a stronger verdict —
*"the 2x2 is the wrong frame, its positive cell is unobserved"* — registered a falsifier against it,
ran that falsifier myself within the hour, and it fired. **That claim is withdrawn in §2 and the
withdrawal is the most useful thing in this file.**

**Objects opened first:** `git show b0928d4 -- exo_memory/loop/trigger_index_rescore_2026-08-30.md`;
`git show 37c5170`; `git show 4ec5ef5 -- consonance/tools/boundary-reminder.js` (ALPHA's refusal,
read in full before designing anything); `consonance/hooks/dispatch-gate.js` and its `.test.js`;
`C:\Consonance\data\dispatch-gate.jsonl`; the chair's transcript.

---

## 0 · THE CORRECTION I OWE FIRST — the packet is built on my number, and my number was wrong

**In L016 I published: 573 rows, cited-rate 10.8% → 20.1% → 25.3% → 24.5%, "the room's one
focal+asking cue fires and the rate roughly doubled."**

**That was the test suite.** Four `(verb | chars | cited)` tuples appear **exactly 115 times each** —
460 of 584 rows, 78.8% of the ledger:

```
115  chair_inject | 43 | null        115  call_chair   | 22 | null
115  chair_inject | 16 | null        115  chair_inject |  0 | null
```

**Proven by mutation, not inferred from the shape.** `dispatch-gate.test.js` spawns the real hook
(`spawnSync(process.execPath, [HOOK])`) and never sets `CONSONANCE_DATA`, so `dataDir()` resolves to
the live data directory from `~/.consonance.json`. Run once against a temp ledger:

    TMP=$(mktemp -d); CONSONANCE_DATA="$TMP" node --test consonance/hooks/dispatch-gate.test.js

→ **exactly four rows, exactly those four signatures.** The suite has been run 115 times into
production.

With test rows removed (`chars >= 200`; the gap is genuinely bimodal — median test row 22 chars,
smallest real dispatch 829 — and the rate is identical at every cutoff from 100 to 500):

**121 real dispatches, 113 cited = 93.4%**, and *not* the trend I published. The trend was the
changing ratio of test runs to real dispatches per day.

This is the 08-16 error — an instrument's output published as the room's behaviour — committed by me
in the file where I warned about it, one packet later. Standing precedent for the fix:
`precompact.polluted-by-tests-20260818.jsonl`, quarantined under that name rather than deleted.

---

## 1 · The pre-gate baseline, which I ran because I had named it as my own falsifier

`findCitation()` is exported and pure. The chair's transcript holds the dispatch text. So the
counterfactual the ledger cannot contain is recoverable *retrospectively, with no new events* — I
said so in a draft §7, then ran it rather than leaving it for another packet.

Method: stream the chair's transcript, extract every `chair_inject` / `call_chair` `tool_use` block,
run the shipped `findCitation()` over each with real `git cat-file` and `fs.existsSync` against the
repo, split at the gate's install (2026-08-24T11:31:05Z), `chars >= 200` throughout.
**256 dispatches.** The script lives in this pane's session scratchpad (`pregate2.js`) and **that path
dies with the session** — it is not a citation, it is a note. The method above is the citation: it
rebuilds in ten lines from the exported `findCitation`, and anyone re-running it should write their
own rather than hunt for mine. If it is worth keeping, it belongs in `consonance/tools/` as a real
instrument with a test, which is a build I was not authorised for in this packet.

| window | pre-gate | post-gate | χ² (Yates) |
|---|---|---|---|
| **all** | **115/178 = 64.6%** | **75/78 = 96.2%** | **26.58, p<.05** |
| last 60 / first 60 | 43/60 = 71.7% | 57/60 = 95.0% | 10.14, p<.05 |
| last 40 / first 40 | 32/40 = 80.0% | 38/40 = 95.0% | 2.86, n.s. |
| last 30 / first 30 | 27/30 = 90.0% | 30/30 = 100% | 1.40, n.s. |
| last 20 / first 20 | 17/20 = 85.0% | 20/20 = 100% | 1.44, n.s. |

08-24 split at the install itself: **before 10/13, after 11/11.**

**Read honestly, this is a real level shift confounded with a pre-existing rise.** The whole-history
contrast is large and significant. It shrinks to non-significance as the window tightens, and
regains significance at n=60 only by reaching back into the July regime. The rate was already
climbing before the gate: 08-23 sits at 86%, and 08-24-before-install at 77%.

So the honest statement is: **the gate is associated with a jump to ceiling, the association is not
attributable to the gate alone on this data, and it is not nothing either.**

---

## 2 · WITHDRAWN: "the positive cell is unobserved"

My draft argued that top-left was empty because the behaviour was at 93.4% *from the ledger's first
row* — day one opening 13/13, no learning curve, no pre-gate baseline possible.

**Every clause of that was an artifact of the ledger beginning when the gate shipped.** The ceiling
was real and it was *post-treatment*. The baseline existed the whole time, in a file I could read,
and it is 64.6%. **The cell is occupied.**

The failure mode is worth naming because it is not the one I was watching for: I checked whether the
instrument's *rows* were trustworthy (§0, and they were not) and did not check whether its *window*
was. **A ledger that starts at the intervention shows you the treated regime and calls it the world.**
That is a distinct error from test pollution and it was sitting underneath it.

**What survives from that draft, unchanged:** bottom-right is still not established — no instrument
measures whether the 17 SOURCE triggers fire, as L016 reported. And the grid still has a fifth cell
nobody named, **NO CUE**, which §1 has now partially supplied for the top-left row.

---

## 3 · Why the build is still refused — on power and on a design defect

### 3.1 Power: the headroom is gone, whatever put it there

Post-gate the channel sits at **96.2%** (transcript) / **93.4%** (ledger, both seats). Eligible
events: **121 real dispatches over 4 active days = 30.3/active day**, from **two subjects**
(`chair_inject` 78, `call_chair` 43).

Two-proportion power, α=.05 two-sided, power=.80, Cohen's h, n/arm = (1.96+0.8416)²/h², p₁ = 0.934:

| PRINT arm drops to | h | n/arm | total | active days |
|---|---|---|---|---|
| 0.90 | 0.124 | 512 | 1024 | **33.8** |
| 0.88 | 0.188 | 223 | 446 | **14.7** |
| 0.85 | 0.276 | 104 | 208 | 6.9 |
| 0.80 | 0.408 | 48 | 96 | 3.2 |
| 0.70 | 0.640 | 20 | 40 | 1.3 |

**6.6 points of headroom.** The design is powered only to detect the printing cue being
*catastrophically worse*. It is structurally unable to show that a printing cue **works**, because
there is no room above 93.4% to work into. **This is run 1's ceiling, visible before the run instead
of after it** — and §1 has now shown the ceiling is a consequence of the treatment, which makes it
worse, not better: you cannot measure a second intervention on a channel the first one has saturated.

### 3.2 The design defect, which is now the primary reason and does not depend on power

**PreToolUse fires AFTER the dispatch text is composed.** A printing cue at that position cannot
influence the composition it is commenting on. ASK can, because it *forces a second composition* —
the call is stopped and the seat writes again.

So ASK and PRINT at PreToolUse are **not two levels of one variable.** They are different kinds of
intervention, and a null between them would carry no information about focality. The 2x2's axes are
not independent at this event, and no amount of n fixes that.

**This is the answer to the packet's actual question, and it is better than a number:** the
focal+prints cell cannot be filled *at this event*. Filling it needs an event that precedes
composition, and §3.3 of L016 already established that no such hook moment is registered here.

---

## 4 · The four things the packet asked for — answered, because that is what makes a refusal checkable

**4.1 Outcome measure and where it is read from disk.** `data/dispatch-gate.jsonl`, field `cited` ∈
{`sha`,`path`,`interrupt`,`null`}, computed by `findCitation()` against repo and git. Machine-derived,
no say-so, mine or the chair's — that part is sound and is why this was the right channel to try. Its
defect is timing, not derivation: it measures the text *as submitted*.

**4.2 n and power before the build.** §3.1. 30.3 eligible/active day, two subjects, 14.7 active days
for a realistic effect, and a ceiling that caps the informative direction regardless.

**4.3 Falsifier and void rule — and the P-FIC defect, which I could not remove.** The expected result
is *no detectable difference*, and that single observation is equally consistent with **(a)** focality
suffices and printing works, and **(b)** neither cue does anything and 96.2% rides underneath both.
**No rule separates (a) from (b) using ASK and PRINT alone.** The separating datum is a NO-CUE arm —
which §1 has now supplied *retrospectively and for free*, and which is exactly why the retrospective
measurement was worth more than the prospective build. Registering a void rule that cannot fire on
the outcome I expect is the defect the packet told me not to reproduce, so **I am not registering
one; I am refusing the run.**

For the record, the rule that would have applied: **INSTRUMENT-FAILED, not hypothesis-failed**, if
the ASK arm's own rate falls outside the 87.5%–100% daily band already observed.

**4.4 What a null CANNOT distinguish** — registered in advance, five things, none excluded by the design:

1. Printing is weak (the room's question-vs-reminder story survives).
2. Focality suffices and the ceiling hid it.
3. This particular cue is bad — wording, length, content.
4. **The hook fires at the wrong event** — §3.2, and fatal on its own.
5. **Two subjects, not 121 trials** — clustering, plus carryover within one accumulating context
   window that per-event randomisation does not fix.

---

## 5 · What this design cannot blind, stated rather than claimed away

- **The subject is us, and it has read the packet.** The chair now knows its citation behaviour is
  watched. ALPHA registered the same contamination for its subject; it is not fixable by
  randomisation, only shared between arms.
- **I am the designer and a subject** — I dispatch through `call_chair`, and nothing here blinds me
  to arm assignment.
- **The cue is not new information to anyone.** Every seat that has read `dispatch-gate.js` or my
  L016 file already holds the citation rule.
- **What IS blind, and it is why §1 is trustworthy:** `findCitation()` is a pure function over text,
  written 2026-08-24 for a different purpose, run retrospectively over a transcript nobody wrote with
  this test in mind. Nobody scored it. The pre-gate subjects could not have been performing for it,
  because it did not exist.

---

## 6 · What survives, cheapest first, each with its number

1. **Fix the ledger pollution.** One line — set `CONSONANCE_DATA` to a temp dir in
   `dispatch-gate.test.js`. Quarantine the existing file rather than delete it; 121 real rows are the
   only record of this channel. *(Not done: I do not own that file this packet.)*
2. **The outcome column** (L016's ask, still unbuilt): what the human returned to an ask, and whether
   the next attempt on the same logical dispatch carried a citation. Four of the eight uncited real
   dispatches are followed by a cited one within ten minutes and four are not, and **the ledger cannot
   distinguish a re-attempt from an unrelated next dispatch.**
3. **~~Extend §1 to the librarian's transcript.~~ RUN, AND IT CANNOT FIRE — see §9.** I filed this as
   the cheap next step, then ran it in the same turn rather than leaving a named falsifier unrun. The
   librarian seat has **2 pre-gate dispatches**. There is no before/after to be had, and the
   replication is unavailable rather than negative.
4. **The only channel with headroom is the ferry, and it is not affordable either.** Miss rate 77.4%
   (`node consonance/tools/ferry.js --report`), a real focal event exists (PreToolUse on Bash matching
   `git commit`), and at ~9 artifact commits/active day:

   | miss drops to | n/arm | total | active days |
   |---|---|---|---|
   | 0.70 | 277 | 554 | **61.6** |
   | 0.65 | 104 | 208 | **23.1** |
   | 0.60 | 55 | 110 | 12.2 |

   **Registered so nobody proposes it later without the arithmetic.** Its outcome is also worse than
   `cited`: a ferry is recorded only when a seat runs `--record`, so the measure is effort-dependent.
5. **ALPHA's survivor, with one condition added.** Buy n with tokens rather than days — three cue
   conditions on a fixed battery with fresh subjects, on the 08-15 rig. **The condition: the task must
   carry LOAD.** Run 1's surviving finding is that fresh subjects with one question check 60 of 60; a
   single-question battery reproduces the ceiling that voided it.

---

## 7 · Correction carried to the chair's framing, in both directions

**Against the room's claim:** `BUILDING.md:273` / `dispatch-gate.js:8` say the question-channel is
*"acted on 60 of 60 times."* L016 showed that number is a void run's ceiling result re-described.
**Nothing in §1 rescues it** — a 64.6% → 96.2% shift is not 60 of 60, is not a measurement of
question-vs-reminder, and does not separate the two axes. **The sentence still has no support on disk
and should stop being cited.**

**For the room's claim:** the gate is nonetheless associated with the largest single behaviour shift
this channel has recorded, and it is the *only* cue in the room with a before/after at all. My draft
said the cell was empty; it is not. **A guard that moves a real class from 64.6% to ceiling is worth
keeping whether or not the mechanism is settled** — and the mechanism is not settled, which is the
whole finding.

---

## 8 · What I did not verify

- **That all 121 `chars >= 200` ledger rows are genuine dispatches.** The bimodal gap is clean and
  the four test signatures reproduce exactly, but I did not match individual rows to transcript events.
- **That 115 suite runs is the whole pollution.** An ad-hoc `node dispatch-gate.js` during development
  would also have written rows; I can separate those only by size.
- **The librarian's side.** §1 covers the chair's transcript only. The ledger's 121 rows include both
  seats; the transcript's 78 post-gate rows are the chair alone. That is the arithmetic gap between
  96.2% and 93.4%, and I have not run the librarian's transcript — see §6.3.
- **Whether the pre-gate rise is practice, packet-reading, or the chain maturing.** Three candidate
  causes, none excluded, and this is why §1 says *associated* rather than *caused*.
- **ALPHA's power figures.** Read in full, framing reused; I ran my own arithmetic on my own channel
  and did not re-derive its 26-day or 95-day numbers.

---

## 9 · Falsifier for this refusal, registered before it lands

**Registered, then run in the same turn — and it CANNOT FIRE.** The falsifier was: if the librarian's
transcript shows no pre/post shift at its own gate boundary, §1's jump is the chair's practice rather
than the gate. Run:

    node scratchpad/pregate2.js <librarian transcript>
    →  PRE 1/2 = 50.0%   POST 39/43 = 90.7%   chi2 = 0.41  n.s.

**The librarian seat has two pre-gate dispatches.** Every window returns n.s. because every window is
the same n=2. This is not a refutation and not a confirmation — **it is a falsifier with no data
behind it**, which is the defect `build_ruling.md`'s condition C4 exists to catch, found here in my
own file within an hour of my writing it.

**So §1 rests on exactly one subject, one before/after, with a rising pre-trend I cannot subtract.**
That is weaker than §1's chi-square makes it look, and the weakness is structural rather than fixable
by more days: the second subject has no history to compare.

*One thing the run did verify:* the librarian's 43 post-gate dispatches match the ledger's 43 real
`call_chair` rows **exactly**, which independently confirms the `chars >= 200` filter in §0 and the
ledger↔transcript correspondence the rest of this file depends on.

**The remaining WRONG condition:** if anyone subtracts the pre-existing trend from §1 — by modelling
the chair's rate over July–August and testing the gate as a step against it — and the step does not
survive, §1 goes with it and my withdrawn §2 was right for the wrong reason.

**PROSE** if, thirty days on, the ledger is still taking test writes. The pollution is a one-line fix
and it invalidated a published number within twenty-four hours of that number being published.

*A trace to re-run, not a doctrine to believe.*

---

## Appended 2026-08-31 ~01:25 — the power line RE-RUN at the corrected figure (L019 P-CLOSEOUT, pane Around)

*BRAVO's file; appended, not rewritten. The chair's brief: ALPHA could not re-derive §0's 121/113 = 93.4%
and got 123/136 = 90.4% (`handoff_chair_2026-08-30.md:48`); re-run the power line at the corrected figure
and say plainly whether the refusal's power ground moves or holds. Every number below is printed by
`scratchpad/power_append.js` from `C:\Consonance\data\dispatch-gate.jsonl` (147 rows, 5 UTC days,
last 2026-08-31T07:11:06.808Z); the script refuses to write if 123/136 stops reproducing or if §3.1's own
table stops reproducing from the same formula.*

### Both figures re-derived, and why they differ

- **123/136 = 90.4% reproduces EXACTLY** as: every ledger row before ALPHA's own disclosed stray (row
  137, `target:"B", chars:11`), cited = `sha` **or** `path`, the two `[interrupt]` rows counted as uncited.
- **§0's cut (`chars >= 200`) over the SAME window gives 123/133 = 92.5%.** The whole difference is the
  denominator: `>= 200` drops **three real 2026-08-24 rows (13, 80, 11 chars), all `outcome:"asked"`, all uncited.**
  §0's "smallest real dispatch 829" is false — the smallest real rows are dispatches the gate REFUSED,
  too short to have cited anything, and they are precisely the behaviour this rate exists to count.
  Excluding them biases the rate up by about two points. **90.4% is the better of the two figures.**
- Live tonight, ALPHA's definition: **131/146 = 89.7%**; §0's definition: 131/143 = 91.6%.

### The table at p₁ = 0.904

Same formula as §3.1 — α = .05 two-sided, power = .80, Cohen's h, n/arm = (1.96 + 0.8416)² / h² — and §3.1's
table at 0.934 reproduces from this code row for row (512 / 223 / 104 / 48 / 20), so the two tables differ
in p₁ and nothing else. Days at 34.0/active day (ALPHA's 136 over §3.1's four active days).

**Harm side — a PRINT arm that is WORSE:**

| PRINT arm drops to | h | n/arm | total | active days |
|---|---|---|---|---|
| 0.90 | 0.013 | 43,360 | 86,720 | **2550.6** |
| 0.88 | 0.077 | 1,309 | 2,618 | **77.0** |
| 0.85 | 0.165 | 288 | 576 | **16.9** |
| 0.80 | 0.297 | 89 | 178 | **5.2** |
| 0.70 | 0.529 | 29 | 58 | **1.7** |

**Headroom side — a PRINT arm that WORKS (the question the headroom is about):**

| PRINT arm rises to | h | n/arm | total | active days |
|---|---|---|---|---|
| 0.95 | 0.179 | 245 | 490 | **14.4** |
| 0.97 | 0.282 | 99 | 198 | **5.8** |
| 0.99 | 0.430 | 43 | 86 | **2.5** |

### Verdict: **the refusal's power ground HOLDS.** The corrected figure moves it in both directions at once, and neither helps the build.

1. **The headroom widens, 6.6 → 9.6 points — and does not reach affordable.** Showing a cue *works* means
   detecting a rise: 0.904 → 0.97 needs **99/arm (5.8 active days)**; → 0.95 needs
   245/arm (14.4 days); only a rise to ~0.99 (43/arm, 2.5 days) is within a fortnight, and
   0.99 is the ceiling run 1 already hit natively (60/60). So the test can still only see a cue that
   takes a 90% channel to *perfect* — the same shape as §3.1's conclusion, three points lower.
2. **The harm side gets WEAKER, not stronger.** A drop to 0.90 is now undetectable in practice
   (h = 0.013, 43,360/arm); a drop to 0.85 goes from 6.9 to 16.9 active days. Lowering
   p₁ moves the harm thresholds closer to the baseline, so each one costs more to see.
3. **§3.2 is untouched by any rate.** The PreToolUse defect — the hook fires before the dispatch lands,
   so the design cannot observe the outcome it is about — was the primary ground and remains it.
4. **What WOULD move this** is a channel whose baseline sits well under 0.90. §4 item 4 already names
   the only one (the ferry, 77.4% miss) and prices it unaffordable for a different reason.

*Its own WRONG condition, registered with it:* if the three 2026-08-24 short `asked` rows turn out to be
hook probes rather than dispatches (the hook was hours old that morning; the chair can say), then
92.5% is the right figure and the headroom is 7.5 points — and every sentence above holds with
smaller numbers. **The verdict does not depend on which cut is right, which is why it can be stated.**

*A trace to re-run, not a doctrine to believe.*
