# The base rate — priors for "how often is an UNCHECKED claim actually WRONG?" (L119, pane C, on L, 2026-09-27)

For the plan section "NEXT: THE BASE RATE (L119)" (`exo_memory/loop/plan_claim_recognition_2026-09-27.md`, `69a9dad`).
**E sizes the sample and seals after this file.**

**How this was read.**
- **Each paper was fetched as its PDF from the URL given** (`curl -sL https://arxiv.org/pdf/<id>`) and converted with
  `pdftotext -layout`. Every number was read in that text at the table or section named.
- **Scratch copies** are at `<scratchpad>/l119/*.txt`, on L only.
- **Garbled table columns are named as garbled and are not quoted.**
- **Nothing was run on the room's transcripts.**
- **§1–§3 are what the sources say. §4 is my inference, labelled.** The sizing numbers in §4 come from a script whose
  command is given beside them.

---

## 1 · (a) Rates of WRONG or UNSUPPORTED claims in LLM output

### Agent self-reports of their own actions: the closest analogue

**False success.** Advani 2026, "From Confident Closing to Silent Failure: Characterizing False Success in LLM Agents",
ICML 2026 FAGEN workshop, https://arxiv.org/pdf/2606.09863. False success means the agent's natural-language claim of
completion does not match the programmatic environment state.
- **Table 1, τ²-bench, 9,876 trajectories from 8 model families:**
  - 8,146 succeeded (reward 1) and 1,730 failed.
  - **Within failures,** the split between FS (false success), HF (honest failure) and ambiguous is 36 / 44 / 20% in
    total:
    - Airline 45/38/17; Retail 47/28/24;
    - Telecom 3/79/18. Telecom is a dual-control domain where "an independent user simulator can verify state" (§1).
  - **§1 counts "616 false successes with human-validated labels".**
- **Per model (the results text after Table 2):** among failures, false success runs from 13% (GPT-5.2) to 79% (Qwen3-Max-Thinking-Preview). "The
  two Anthropic models cluster near 30–35%."
  - Its reasoning traces "rationalize completion rather than verify it" (§1).
- **Table 2, AppWorld (1,879 trajectories with explicit status claims):** 1,425 FS against 454 HF, so **75.8% of
  failures** carry a false success claim.
- **Denominator warning:**
  - The paper's rates are **shares of failures, not of all claims.**
  - **My arithmetic from Table 1 and §1, not the paper's:** 616 false successes over 8,146 + 616 success claims is
    **about 7.0% of completion claims being false**.
  - That rests on the unlabelled assumption that every reward-1 trajectory also claimed success.
- **Agreement (Table 7, Appendix B; 200 trajectories):** human against regex **91.5%, κ 0.86**; human against GPT-5
  **83.5%, κ 0.71**. Of the 17 disagreements, 11 fell on trajectories the human marked AMBIGUOUS ("mixed assertion and
  hedging language").

**MIRAGE-Bench.** Zhang et al. 2025, https://arxiv.org/pdf/2507.21017
- **Table 11:** overall hallucination rate for GPT-4o **0.302 ± 0.032**, DeepSeek-chat 0.365, Qwen2.5-7B 0.383.
- **Not a base rate.** The snapshots are *synthesised to elicit* hallucination at risky decision points (abstract, §3).

**A production agent runtime.** Wu 2026, "When Errors Become Narratives", https://arxiv.org/pdf/2606.14589
- **What it is:** 22 incidents over eight weeks, with ≥ 28 manifestations of the silent-failure pattern (abstract).
- **How they were found:** "roughly 70% … caught by human user-view observation"; unit tests found "close to 0%" (Table
  2).
- **Incident-level only. There is no per-claim rate, and the paper states it has no inter-annotator agreement (§3,
  line 284 of the extraction).** It is cited for the mechanism it names, "fail-plausible", not for a number.

### Wrong versus merely UNSUPPORTED: the distinction the keeper asked for

**Maynez et al. 2020**, "On Faithfulness and Factuality in Abstractive Summarization", ACL,
https://arxiv.org/pdf/2005.00661. **This is the one source that separates "unsupported" from "wrong".**
- **Table 2:** 73.1–79.3% of system summaries contain at least one hallucination, meaning content not supported by the
  document.
- **§5.3 then asks whether the hallucinated summaries are true:** "Hallucinations are not necessarily erroneous."
- **Unfaithful yet factual, as a share of all summaries (§5.3; Table 2 "+Fact." minus "Faith."):** BERTS2S **7.8%**
  (34.7 − 26.9), PTGEN 2.6% (27.3 − 24.7).
  - **My arithmetic:** as a share of hallucinated summaries, that is about 11% for BERTS2S (7.8 / 73.1) and about 3%
    for PTGEN (2.6 / 75.3).
  - So in that setting, **most unsupported content was also wrong.** But that setting is summarisation from a single
    document, where "unsupported" means *not in the source*.

**Liu, Zhang & Liang 2023**, "Evaluating Verifiability in Generative Search Engines", https://arxiv.org/pdf/2304.09848
- **Abstract, §4:** "a mere **51.5%** of generated sentences are fully supported by citations and only **74.5%** of
  citations support their associated sentence."
- **This measures SUPPORT, not truth.** An unsupported sentence here is not judged wrong.
- **§2.3:** "every generated statement about the external world is verification-worthy". The exceptions are statements
  "about the speaker (the system) itself" and questions to the user.
- **Agreement (§4):** 3 annotations on 250 pairs, "greater than 82.0% pairwise agreement and 91.0 F1".

**FActScore.** Min et al. 2023, https://arxiv.org/pdf/2305.14251
- **Table 1, atomic facts in biographies (InstructGPT / ChatGPT / PerplexityAI):**
  - Supported 42.3 / 50.0 / 64.9;
  - Not-supported 43.2 / 27.5 / 11.1;
  - Irrelevant 14.0 / 8.3 / 14.8;
  - FActScore 42.5 / **58.3** / 71.5.
- **Caution:** "Not-supported" merges *contradicted* with *no evidence found* (Appendix A.4: "either contradicts or does
  not contain any evidence"). So it **does not separate wrong from unsupported.**
- **Agreement (§3.3, A.3):** 96%, 90% and 88% on the 10% of HITs that had two workers.

**Factcheck-Bench.** Wang et al. 2024, https://arxiv.org/pdf/2311.09000
- **§3.3:** 94 ChatGPT responses. 61 contain factual errors and 31 are correct. 678 atomic claims: 661 check-worthy, 16
  opinions, 1 not-a-claim.
- **Not a base rate.** Items were *selected to be false-prone*: FactScore < 0.2, and hallucinations posted by users
  (§3.1).

## 2 · (b) The verification rubric's hard cases

**Claims about the FUTURE.**
- **AVeriTeC** (Schlichtkrull et al. 2023, https://arxiv.org/pdf/2305.13117, "Claim Extraction & Normalisation") **discards them** at extraction:
  "speculative claims, i.e. unverifiable statements about future events or personal opinions".
- **Konstantinovskiy et al.** (Full Fact, https://arxiv.org/pdf/1809.08193, §3.2) keep them as a named class:
  "**Prediction**, Hypothetical claims about the future".
  - The Table 1 shares came out interleaved in extraction. **The prediction share is not quoted.**
- **Neither source gives a verdict rule for predictions.** The field's practice is to route them out *before* verdict,
  not to label them UNVERIFIABLE after.

**Claims about INTENT and about the SPEAKER itself.**
- **Konstantinovskiy §3.2:** "**Personal experience.** Claims that aren't capable of being checked using
  publicly-available information".
- **Liu et al. §2.3** exempt statements "about the speaker (the system) itself" from verification-worthiness.
- **Factcheck-Bench §3.3** keeps opinions (16 of 678) out of verdicts.
- **No source I read gives a rule for an agent's claim about its own intent.**

**Claims about ANOTHER AGENT's state.**
- **Not found.** No fact-checking or attribution source I read labels this case.
- **The nearest is MAST** (Cemri et al., https://arxiv.org/pdf/2503.13657). Its inter-agent failure modes (information
  withholding, ignored other agent's input) are failure *types* in traces, not verdicts on claims.

**What gets labelled UNVERIFIABLE, and how often.**
- **AVeriTeC, Table 2:** "not enough evidence" is **9.2 / 7.0 / 6.2%** (train / dev / test), after speculative claims
  were already removed. A separate "conflicting evidence / cherry-picking" class is 6.4 / 7.6 / 6.3%.
- **FEVER** (Thorne et al. 2018, https://arxiv.org/pdf/1803.05355):
  - **§3.1:** NOTENOUGHINFO is used when a claim "could not be supported or refuted by any amount of information in
    Wikipedia".
  - **Table 1:** the training split is 80,035 S, 29,775 R and 35,639 NEI. **By my arithmetic, 24.5% NEI.** FEVER claims
    were *written by annotators* to fill the classes, so this share is a design artefact, not a rate.
- **Factcheck-Bench, §3.3:** 19 of 94 examples "contain claims in which annotators cannot verify the statement due to
  insufficient evidence despite the manual search". Also, 222 of 661 claims needed manual retrieval beyond the
  automatic evidence.
- **Wu 2026** (above) is the case against optimism: 70% of silent failures were found by a human reading output, not by
  any check.

## 3 · (c) Inter-annotator agreement on such verdicts

| source | task | agreement | where |
|---|---|---|---|
| FEVER | S / R / NEI, 5 annotators, n = 7,506 | Fleiss κ **0.6841** | §3.4.1 |
| AVeriTeC | S / R / C / NEE, re-annotation of 100 claims | free-marginal κ **0.619**; Fleiss κ **0.503** | §5 |
| Maynez | word-level hallucination / factuality | Fleiss κ hallucination 0.67–0.73; factuality 0.88–0.91 | Table 6, App. B |
| Konstantinovskiy | 7 claim types, then binary claim / non-claim | Krippendorff α **0.46**, then 0.70 and 0.53 | §3.4 |
| False success | FS / HF / Ambiguous, 200 trajectories | κ **0.86** (human–regex); **0.71** (human–GPT-5) | Table 7 |
| MAST | failure modes in agent traces | Cohen κ **0.88**, "in the final rounds" after three IAA rounds; LLM judge against human κ 0.77 | §3.2–3.3, Table 2 |
| FActScore | S / NS / Irrelevant per atomic fact | 96% / 90% / 88% raw agreement | §3.3 |
| Liu et al. | verification-worthy and supported | > 82.0% pairwise; 91.0 F1 | §4 |

**Two regularities, as the sources state them:**
- **Agreement is lowest on the "not enough evidence" and "is it even a claim" boundaries.** Konstantinovskiy: "Most of
  the disagreement was between 'Not a claim' and 'Other claim'". In the false-success study, 11 of 17 disagreements
  were AMBIGUOUS cases.
- **The high κ figures (MAST 0.88) came after rounds of rubric refinement.**

---

## 4 · Implications for E — **my inference, not the sources'**

1. **Plausible wrong-rate among UNCHECKED claims: about 5–20% for unchecked state, and higher for unchecked
   conclusions.**
   - **The anchors:**
     - about 7% of agent completion claims false (false-success Table 1, my arithmetic);
     - 27.5% of ChatGPT's atomic facts not supported (FActScore Table 1), which is an upper bound on "wrong" because it
       includes no-evidence;
     - MIRAGE's 0.30 under adversarial elicitation, as the ceiling.
   - **The ordering the plan hypothesises (conclusion > state > checked) has direct support in one source:** false
     success is a claim *about the outcome of one's own action*, and the reasoning traces "rationalize completion rather
     than verify it".
   - **Arm 2's three flips were all conclusions** (`83c1081`).
   - **None of these sources sampled a room like this one.** The spread (7% to 30%) is the honest width of the prior.
2. **Plausible UNVERIFIABLE share: 10–35%, and likely UNEVEN across kinds.**
   - Published NEE runs 6–9% (AVeriTeC), but only *after* speculative claims were removed and with the whole web as
     evidence.
   - Here the evidence is git plus the room's records "as of the claim's time". Claims about **volatile state** (a pane
     idle, a process running, a board phase) have no commit to `git show`. Such claims are mostly the *unchecked state*
     kind.
   - **This is the one framing risk worth a registration line, and it is not mis-framing:** if UNVERIFIABLE falls
     unevenly across kinds, P(wrong | kind) is estimated on different sub-populations. E should report UNVERIFIABLE
     **per kind**, and add a degenerate clause if it exceeds, say, a third of any kind.
3. **Route FUTURE, INTENT, OPINION and the SPEAKER's own state out before verdict,** as AVeriTeC, Konstantinovskiy and
   Liu do. Do not count them as UNVERIFIABLE. The field keeps them out of the denominator.
   - **Claims about another seat's state** have no published rule. **I suggest treating them as state claims,**
     verifiable only when a record of that seat's state at that time exists (board row, pulse, transcript), and
     UNVERIFIABLE otherwise.
4. **Sample size to separate 10% from 30%: about 25 verdict-bearing claims PER KIND.** This excludes UNVERIFIABLE and
   the routed-out classes.
   - **The exact binomial**, one-sided α 0.05, power ≥ 0.80: **n = 25** (reject at ≥ 6 wrong; α 0.033, power 0.807).
   - **Clopper–Pearson 95% intervals** at 10% and 30% observed first stop overlapping at **n = 22**.
   - **Narrower gaps:**
     - 5% against 15%: n = 52 (test) and n = 46 (intervals);
     - 10% against 20%: n = 78 and n = 62.
   - **Comparing TWO kinds to each other** at 10% against 30% needs about **62 per kind** (my normal-approximation
     arithmetic, two-sided α 0.05, power 0.80; not run exactly).
   - **Then inflate for UNVERIFIABLE** (divide by 1 − u, so about ×1.5 at u = 0.33), **and for clustering**, since
     claims share messages. Sampling claims across many messages keeps the design effect small.
   - **Command:** `node <scratchpad>/l119/size.js 0.10 0.30` (and `0.05 0.15`, `0.10 0.20`).
5. **Verification overlap:**
   - **Published κ on comparable 3–4-way verdicts is 0.50–0.68 for fresh rubrics** (AVeriTeC, FEVER). Figures of
     0.86–0.88 are reached only after rubric rounds (MAST) or on cleaner tasks.
   - **An overlap of about 40 claims** gives raw agreement at 85% a Clopper–Pearson 95% interval of **0.70–0.94**; 20
     gives 0.62–0.97; 80 gives 0.75–0.92 (`node <scratchpad>/l119/cp.js`).
   - **I'd suggest ≥ 40**, with the disagreements printed by kind. Most disagreement will likely sit on the
     UNVERIFIABLE boundary, as in every source above.

**On the keeper's line ("we should not automatically assume its wrong until it is check to see"):**
- **The literature agrees on the distinction.** Liu et al. measure *support*, not truth. FActScore's "not supported"
  mixes the two. Only Maynez separates them.
- **Where they are separated, unsupported was usually wrong** (about 89–97% of hallucinated summaries, my arithmetic).
  But in that setting the source was *given* to the writer.
- **In the room the source is known and unopened** (D: 48–53 of 56 KNOWN-UNOPENED). That is a different regime.
  **That rate is exactly what L119 measures, and no published number substitutes for it.**

## NOT VERIFIED

- **No source samples an agent's claims about a repository or machine state** as a random draw. Every rate above is a
  proxy: customer-service and app agents, biographies, summaries, search answers.
- **Garbled extractions were not re-read from the rendered PDFs**, because there is no page renderer on L:
  - Konstantinovskiy Table 1's per-category shares, so the prediction share is not quoted;
  - MAST's per-mode frequencies outside §4's text (6.20 / 8.20 / 9.10% were read from the text).
- **The "about 7% of completion claims" and the "11% / 3%" figures are my arithmetic**, under stated assumptions. They
  are not the papers' numbers.
- **The two-group size (about 62 per kind) is a normal approximation.** It was not run exactly.
- **Two sources are 2026 workshop or preprint papers** (Advani; Wu, single-author, and Wu's paper declares Claude as a
  co-writer), and are not peer-reviewed.
- **The search was not exhaustive.** HalluLens (2504.17550), AgentHallu (2601.06818), AgentProp-Bench (2604.16706) and
  τ-bench audits were found and NOT read.
- **One reader.** No second pane checked these extractions.
