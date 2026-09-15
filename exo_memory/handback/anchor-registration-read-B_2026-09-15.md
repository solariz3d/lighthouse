# Anchor-similarity registration DRAFT · B's read, before anything is built or scored

**B (pane `12fb81f6`), machine L, 2026-09-15 ~07:25–07:55. HEAD `9ac16ab`.** Draft:
`loop/anchor_similarity_registration_DRAFT_2026-09-15.md`. Sources: `loop/packet_diversity_c0_2026-09-15.md` §6,
`handback/p-diversity-c0-C_2026-09-15.md` §2, §4 and §6, `third_place/DIVERSITY_COLLAPSE_INSIGHTS_2026-09-14.md:55-56, :91-92`, and
`third_place/2026-09-15.md:209-218`. I wrote none of these.

**No edits. No encoder run and no cosine computed:** the draft says nothing is computed against it before this read. The only
measurements below are plain text operations on existing, already-briefed hand-backs (byte overlap and length). Scripts are in my
scratchpad (`quote_strip.js` plus two inline runs, reproduced in §3 and §2).

## 0 · VERDICT

**Not registrable as written.** The encoder freeze is sound. The claim, the controls and the run design each have a hole that can
produce the registered outcome for a reason other than the one it names.

| asked | ruling |
|---|---|
| **Does the falsifier fire?** | **It fires, but it can fire for the wrong reason, and one clause is undefined.** The 0.10 was inherited from the paper's 0.19 on text-embedding-3-large, which §6 strikes for this encoder. Nothing shows gte can open a 0.10 gap between two texts on the same task. "Overlap on more than half the tasks" has no meaning for one number per arm per task. §1. |
| **Open Q1: one window regime for every text** | **ACCEPT one regime. AMEND the aggregator.** The unweighted L2-normalised centroid lets a short tail window count as much as a full one (an estimated 10 of 29 texts), and renormalising a centroid inflates cosine with window count and spread. Hand-backs average more windows than packets. Score the token-weighted mean of window-to-window cosines instead, and report window counts. §2. |
| **Open Q2: strip quoted lines of 40+ chars** | **The rule as written is inert: it strips 0 bytes on 5 of 5 real pairs.** Replace it with a normalised 40-character span rule, which strips 0.3–3.7% on the same pairs. 40 is the right length. It removes citation, not anchoring. §3. |
| **Do the controls catch a dead instrument?** | **A constant or dead encoder, yes. A coarse live one, no.** Both controls bracket the arms far wider than the effect, so an instrument that only sees topic passes them and still cannot resolve 0.10. There is no control at the effect's size, and none for polarity. The positive control cannot pass through the strip. §4. |
| **Can the run be gamed or confounded?** | **Yes, five ways.** The worst: the packet is committed at dispatch, so the unbriefed pane can open it. The panes' maps and shells already carry the chair's framing of open-queue tasks. Whoever was briefed on task k carries that packet into task k+1. §5. |
| **Is the rival honestly scoped?** | **Mostly.** "Both predict briefed > unbriefed" is right. But a null is not neutral: the keeper's own record reads 45/45 as the brief being the path. The later "input beats model" test is scoped wider than a within-Claude run can support. §6. |

**The one attack underneath the rest (§4.2):** cosine to the brief measures how much of the brief's content the hand-back takes up, not
whether it agrees. A read that refutes every claim in a packet engages every claim, and scores as anchored. The draft's own motivating
case, 45 of 45 CONFIRMED, is a failure of verdict, which this instrument cannot see.

---

## 1 · THE FALSIFIER

**1.1 · The threshold is a struck number's child.** The source says: *"prediction: briefed cosine-to-brief exceeds unbriefed by ≥0.1 (the
paper's gap was 0.19)"* (`DIVERSITY_COLLAPSE_INSIGHTS_2026-09-14.md:91-92`). That 0.19 is 0.627 − 0.441 on text-embedding-3-large. §6 of the
draft strikes "the paper's 0.627/0.441 as a threshold" for gte, and C's own reason applies to 0.10 exactly as much: *"a gap of 0.19 in one
encoder says nothing about the size of the gap in another"* (C §1).

**1.2 · The range this encoder has in this genre is too narrow for 0.10 to be safe.** C's trial table (C §6.3), gte q8:
- a hand-back against its own chunk mean: **0.9184**
- the same hand-back against three *different-task* hand-backs: **0.6728 · 0.7494 · 0.7730**

So the whole distance from "a different room hand-back on a different task" to "the same document" is **about 0.15–0.25**. An unbriefed
hand-back on the **same task**, citing **the same file paths** (the draft hands it the packet's path list), sits well inside that band,
above the different-task floor. A 0.10 gap between two same-task texts may simply be more than the instrument can open. **If it is, the
falsifier fires because of the instrument's range, whether or not anyone anchored.** That is a result that could be produced without the
thing it names being true.

**What would fix it, and when:** calibrate the scale before the header says REGISTERED, on existing data (every hand-back on disk is
briefed, which is enough for scale). Two options, the chair to pick:
- (a) Replace the absolute 0.10 with a scale-free statistic per task: `(briefed − unbriefed) / (positive control − negative control)`,
  registered with its own threshold.
- (b) Measure `cosine(hand-back, its own packet) − cosine(hand-back, another packet from the same week)` across the landed pairs, and set the
  effect as a stated fraction of that.

**Either calibration must be named in the draft as an instrument step taken before registration.** Otherwise DEGENERATING ("any change to …
the threshold after the first number is seen") reads it as a post-hoc change and voids the run.

**1.3 · "The briefed and unbriefed cosines overlap on more than half the tasks" is undefined.** Each task produces one briefed cosine and one
unbriefed cosine: two numbers, not two distributions. The wording is carried over from the source's distributional form ("show the same
distribution", `:55-56`). Say what counts. Suggested: **falsified if the mean difference is below the threshold, OR briefed ≤ unbriefed on 2 or
more of the 4 tasks.** "More than half" read literally is 3 of 4, which lets a design pass with half its tasks reversed.

**1.4 · The stated consequence says more than a fire can show.** *"Then anchoring to the brief is not where this room's collapse lives."* A
fire is a verdict on a bundle: this encoder's range (1.2), the text policy (§2, §3), contamination of the unbriefed arm (§5) and the construct
(§4.2). Scope the consequence to what the run can show: **this instrument, on this design, did not detect briefed panes carrying the brief
back.** The room's BOOT names this exact error (Duhem–Quine).

**1.5 · With n = 4 and one sample per arm, chance is 1 in 16** that all four signs agree with no effect at all. That is acceptable if stated.
It is one more reason the threshold has to be calibrated rather than borrowed.

## 2 · OPEN QUESTION 1 — one window regime for every text

**Ruling: ACCEPT one regime for all texts.** C's figure is the reason: gte whole-document against the centroid of its windows is 0.9184,
and the whole 1,800-token span against its two halves is 0.9443. A gap that size between two regimes would sit inside a 0.10 effect. Mixing
the regimes by length could manufacture or hide the effect, exactly as the draft says.

**AMEND the aggregator. The proposed unweighted, renormalised centroid adds two length effects of its own:**

1. **Tail windows count as full ones.** Estimated over the 30 hand-backs and packets dated 09-14 and 09-15, at C's measured 3.04 B/token
   (`ls -l … | node`, inline): 29 are multi-window, and **10 of those 29 end in a window under 450 tokens**. Under the proposal that tail
   weighs the same as an 1,800-token window.
2. **Renormalising a centroid inflates cosine with window count and spread.** For unit window vectors `vᵢ` with mean `m`,
   `cos(m/|m|, p) = mean(vᵢ·p) / |m|`, and `|m|` shrinks as the windows differ. A longer, more varied text is lifted by `1/|m|` more.
   Estimated window counts: **hand-backs 3.95 on average, packets 3.13.** Briefed panes are told a hand-back shape, so briefed and unbriefed
   hand-backs may well differ in length. **A length difference between the arms becomes a cosine difference.**

**The rule to freeze instead:**
- **score = the token-weighted mean, over every pair (hand-back window, brief window), of their cosine.** No renormalised centroid on
  either side, so no `1/|m|` factor.
- **Windows are formed on token ids**, 1,800 per window with no overlap, **each re-wrapped as its own sequence with CLS and SEP**. How the
  window is built changes the number, so it has to be frozen.
- **Report, for every text,** its token count, its window count and `|m|`. Also report the centroid cosine as a registered secondary, so the
  two can be compared without choosing after the fact.

**Worth stating in the draft:** C validated that the centroid agrees with the whole document on one text (C §6.3). C did not validate the
centroid as a score for anchoring. The pairwise mean asks less of that single measurement.

## 3 · OPEN QUESTION 2 — stripping quotations

**Measured on five real briefed pairs**, each brief at its dispatch sha and each hand-back as on disk
(`node scratchpad/quote_strip.js`, plus a variant at other lengths):

| hand-back | brief @ sha | L1: line of 40+ equal to a brief line | L2: line of 40+ found anywhere in the brief | **S40: normalised 40-char spans** | S25 | S60 | S100 |
|---|---|---|---|---|---|---|---|
| p-leave-read-B | packet_leave_window @ed73e76 | 0 B | 0 B | **3.7%** | 6.1% | 1.8% | 1.2% |
| p-leave-E | same | 0 B | 0 B | **1.7%** | 2.8% | 0.3% | 0.0% |
| p-stick-preflight-B | packet_stick_preflight_read @9c88a11 | 0 B | 0 B | **0.3%** | 0.5% | 0.0% | 0.0% |
| p-harness-read-B | packet_harness_and_lib @1bc3299 | 0 B | 0 B | **0.4%** | 2.3% | 0.0% | 0.0% |
| p-harness-A | same | 0 B | 0 B | **0.5%** | 4.1% | 0.0% | 0.0% |

S40 collapses whitespace and drops the markdown markers `> * \` _ #` on both sides, then marks every hand-back character inside a
40-character run that also occurs in the brief.

**Ruling:**
1. **The rule as written is inert.** Read either way (L1 or L2), it strips **0 bytes from all five**. Hand-backs quote inside sentences, in
   backticks, in italics, re-wrapped, so a whole-line match never fires. **A strip that removes nothing, and reports "0 B removed" each time,
   is a check that cannot fail**, and it would read as though quotation had been handled.
2. **Replace it with S40.** On the same pairs it strips 0.3–3.7%.
3. **40 is right.**
   - **What 40 catches** in the pair that quotes most (p-leave-read-B) is 8 spans, all verbatim packet lines quoted in order to refute them:
     *"WAIT until every seat's process has exited"*, *"outcome DONE only when tail-carry exits 0 AND no row stops."*, *"The first full carry
     (348,007,682 B) took 55 s (2f7233c)"*, and five more.
   - **At 25** the share runs 1.5 to 8 times higher, because shared idiom and path fragments start matching.
   - **At 60 and above** short real quotes are missed.
4. **Does stripping remove real anchoring? No.** A verbatim span of 40+ characters is citation. The anchoring the claim is after, taking up
   the brief's frame in the pane's own words, is paraphrase, and paraphrase survives S40. The span above shows the danger runs the other way:
   unstripped, a refutation's own quotations would count as anchoring.
5. **Apply S40 to both arms and to the negative control.** Report the stripped share for every text. Register the unstripped cosine as a
   secondary, so the size of the quotation effect is visible rather than argued.
6. **A void condition:** any hand-back whose stripped share exceeds a registered bound (for example 25%) voids its task. Otherwise a
   stripping bug that empties a hand-back scores as a result.
7. **Residual, named:** edited or elided quotes still get through. That leftover can only favour the briefed arm, since only it saw
   packet-only lines. At 0.3–3.7% measured quoting it is small, but it leans the same way the claim does.

## 4 · THE CONTROLS

**4.1 · What they catch and what they don't.**
- **A dead or constant encoder is caught**, provided "scores above both arms" is strict: every cosine equal, or near a constant, fails it.
- **A coarse, live encoder is not caught.** The positive control (packet against packet minus its first section) will sit near the top of
  the scale. The negative control (an unrelated lap's hand-back) will sit near C's different-task floor, 0.67–0.77. Both arms, on the same
  task with the same paths, land between them. An encoder that separates only topics passes both controls, as C's trial already showed with a
  0.145 margin, and still cannot resolve 0.10 between two same-task texts. **The run then reports a falsification with both controls
  PASSED.** Nothing in the design tests resolution at the size of the effect.
- **The positive control cannot pass through the strip.** A near-copy of the packet stripped with S40 against the packet is empty. So it
  tests the encoder, not the pipeline the arms go through, and a stripping or windowing bug that affects only hand-backs gets past it. §3.6's
  void bound covers part of that; say it in the draft.
- **Pre-name the negative control's file by path.** A scorer who picks it afterwards is picking a number.

**4.2 · The control that is missing, and it is the most important point in this read: a polarity check.**
Cosine to the brief measures how much of the brief's content the hand-back takes up. It cannot tell a hand-back that agrees from one that
contests. On this week's disk:
- `handback/p-leave-read-B_2026-09-14.md` contested the packet line by line and found §2 unbuildable on three lines.
- `handback/p-leave-E_2026-09-14.md` built the packet's §2 as ruled.

Both engage the same concepts, so both would score as taking up the brief. **The draft's own motivating case is a failure of verdict:
45 of 45 CONFIRMED over a set about 18% wrong.** Anchoring in that case is agreeing, not discussing.

**What that requires before registration:**
- **(a) A validity check on existing data, run before REGISTERED.** Compare a contesting read with a compliant build against the *same*
  packet. For `packet_leave_window` @ed73e76 that is B's read against A's and E's builds. If the contesting read scores as high as the builds
  or higher, the instrument measures uptake of content, not anchoring. Then the claim has to be renamed "content uptake", or given a second
  measure.
- **(b) A second, polarity-aware measure,** registered beside cosine. For example, the count of the brief's claims the hand-back marks
  wrong or contested, scored blind to arm by a non-dispatching seat.

**4.3 · A control at the effect's size.** One option: before scoring, build a planted "anchored" variant of each UNBRIEFED hand-back
mechanically, by appending S40-surviving paraphrase from the brief. That needs a paraphraser, which is its own instrument, so it may not be
worth it. The cheaper form is (a) above, done with pairs whose polarity is already known.

## 5 · THE RUN DESIGN — gaming and confounds

1. **The unbriefed pane can read the brief.**
   - The brief is scored "as committed at its dispatch sha", so the packet is in the shared checkout before the unbriefed pane starts.
   - Panes routinely read `exo_memory/loop/` and `git log`, and the unbriefed arm is handed the packet's cited paths. Nothing in the draft
     stops it opening the packet itself.
   - **Required:** run the unbriefed arm before the packet is committed (or from a worktree without it), with the board in QUIET. Add a
     registered transcript check: grep the unbriefed pane's JSONL for the packet's filename and for its first distinctive line. **Any hit
     voids that task.**
2. **Carry-over between tasks.**
   - With the same two panes alternating, whoever was BRIEFED on task k holds that packet in its context when UNBRIEFED on task k+1.
   - The contamination grows task by task and pushes toward null.
   - **Required:** a fresh session for each pane on each task, recorded, or the task is void.
3. **The pane maps and shells are a prior brief on exactly these tasks.**
   - Every pane's shell carries its own map and the live edge's "open" items, written by the chair and librarian (my own shell's live edge
     lists open items with their framings).
   - Tasks "from the open queue" are the ones those carriers have already framed. The unbriefed pane has been briefed, in part, by the
     chair's framing of the task, long before the run.
   - **Required:**
     - Before registering, grep both panes' maps and the live-edge block of their current intake for each task.
     - Exclude a task that appears, or record the overlap per task.
     - Note the direction: toward null, which makes the falsifier easier to fire.
4. **"The keeper's verbatim ask for that task" often does not exist.**
   - Many queue items were raised by the chair or the librarian.
   - If someone writes the ask, the unbriefed arm has a brief from the room.
   - **Required:** only tasks with an on-disk keeper quote, cited by path:line in the REGISTERED version.
5. **The briefer holds a stake and controls the effect's size.**
   - The chair writes four packets knowing they will be scored. A long, distinctive packet opens a bigger gap than a spare one.
   - **Required** (the room's rule on stating your bias):
     - the chair says so in the registration;
     - the librarian checks each packet's length against the chair's last ten packets before dispatch;
     - an outlier is rewritten before the run, never after.

**Also:**
- **Re-rules mid-task.** This week's packets grew by appended re-rules (§2.7, §2.8 and §2.9 on the leave packet). A briefed pane answers the
  version it last received, not "the dispatch sha". Freeze the brief as the version the pane last received before its hand-back, or void a
  task that was re-ruled.
- **Hand-back shape.** A packet dictates headings (its question list), so part of the briefed arm's cosine is structure, not frame. Both arms
  already get COMMITTEE.md's hand-back shape through the shell. The packet's question list is the difference. Name it as part of what the
  score includes.
- **Model.** "Both panes' last model at the run" misses a swap partway through (the 2026-07-05 swap is on record). Take the model from every
  assistant record of each hand-back's session.
- **Pane by task.** With two panes, each briefed twice, pane style (B's reads lean adversarial) and task cannot be separated at n = 4. State
  it.

## 6 · THE RIVAL

- **Right as far as it goes.** Both the keeper's thesis and the paper's hierarchy-anchoring finding predict briefed > unbriefed, so a positive
  result does not discriminate between them. The draft says so.
- **A null is not neutral, and the draft should say that too.**
  - The keeper's own appended record reads the room's worst case as the path: *"45/45 CONFIRMED was same weights on the same path (same
    brief). The variable that moved was the path."* (`third_place/2026-09-15.md:217-218`).
  - His thesis predicts that the brief moves a same-model pane's output. A null from this run, if §1.2 and §4 are fixed so it can be trusted,
    weighs against that reading of 45/45.
  - It says nothing about the paper's model-diversity result, which this run does not vary.
- **The later discriminating test is scoped too wide.**
  - *"If input diversity beats model diversity, the keeper's thesis holds; if model diversity beats input diversity, the paper's holds"* is
    not a dichotomy. Both can matter, and "beats" needs a registered magnitude.
  - E found only Claude models reachable through the spawn funnel. Varying Claude models is within-family variation, and a within-family
    result cannot refute a cross-family claim.
  - Scope it now, as "within-Claude model variation against input variation", so the later registration does not inherit the wider claim.

## 7 · WHAT I DID NOT VERIFY

- **Every range argument here comes from C's four-document table** (§1.2, §4.1). I computed no cosine for this read. The shape rests on that
  table: same-task texts inside a 0.15–0.25 band, and a contesting read scoring like a compliant one. It is the thing to measure first, not a
  result.
- **The window counts are estimates** at 3.04 B/token, not tokenized.
- **The `1/|m|` inflation is algebra.** Its size on real hand-backs is not measured.
- **The quotation measure** covers five pairs, all from this week, three of them my own hand-backs, which lean adversarial and may quote more
  than most.
- **I did not check which open-queue tasks the chair has in mind,** or grep the panes' maps for them (§5.3).
- **I did not read the paper** beyond what the source and C's hand-back quote.

## 8 · WRONG — mine

**None filed.** One near-miss worth recording: I first took "strip quoted lines" as the risky direction, that it would remove real
anchoring. The measurement turned that around. The rule as written removes nothing, and what a working rule removes is refutation citations.
**Class: a worry about a rule's side effect, before measuring whether the rule does anything at all.**
