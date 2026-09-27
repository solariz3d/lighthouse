# Claim recognition — prior art for E's test (L115, pane C, on L, 2026-09-27)

For `loop/plan_claim_recognition_2026-09-27.md` (`c1cedf6`). **E seals its predictions after reading this.** I am the
census-taker of the source data and do not register, run, code or score this test.

**How this was read.**
- **Every paper was fetched as its PDF from the URL given and converted to text with `pdftotext -layout`.** Every
  number below was read from that text at the table or section named beside it.
- **Where a table's columns came out misaligned in the extraction, I say so and quote only what is unambiguous.**
- **No number here is from memory.** Where a paper gives a figure and not a number, I say that and give no number.
- **§1–§3 are what the sources say. §4 is my inference, and it is labelled as such.**

---

## 1 · CHECK-WORTHINESS DETECTION (CLEF CheckThat!)

**Source:** Overview of the CLEF-2024 CheckThat! Lab Task 1 on check-worthiness estimation of multigenre content.
https://ceur-ws.org/Vol-3740/paper-24.pdf

- **The task framing (§2, §3):** each item is "a text item" judged "check-worthy" or not, meaning worth a
  fact-checker's attention.
  - The data are tweets for Arabic and Dutch, and "transcribed sentences from candidates during the US Presidential
    election debates" for English (§2).
  - It is a binary classification task, **evaluated on "the F1-measure on the check-worthiness class (yes) to account
    for class imbalance"** (§3).
- **Class balance (Table 1, the Total row):** English 5,847 yes and 18,344 no, so **24.2% check-worthy** (my
  arithmetic from the totals). The per-split rows came out misaligned in extraction, so they are not quoted.
- **The rates (Table 3, English, F1 on the positive class):**
  - best: FactFinders **0.802**, then OpenFact 0.796 and Fraunhofer SIT 0.780;
  - **Baseline: 0.307**, ranked 27th of 27;
  - Arabic best 0.569 against a baseline of 0.418; Dutch best 0.732 against 0.438.
  - The paper labels the baseline "Baseline" in Table 3, and **its method is not described in the text I extracted.**
- **Approaches (§4):** "Transformers were most popular". FactFinders "fine-tuned Llama2 7b on the original training
  data".

**Zero-shot LLMs on the same task.** "Are Large Language Models Good Fact Checkers: A Preliminary Study",
https://arxiv.org/pdf/2311.17355
- **The setting (§3.2):** CheckThat! 2022, "195 English tweets", F1 on the positive class.
- **Table 1, zero-shot:** SOTA **69.80**. GPT-3.5-turbo falls in **33.56–35.56** across its three prompt variants
  (standard, task definition, chain of thought). The extraction offsets which value belongs to which variant, so the
  range is what I quote.
- **The error pattern (§3.3):** GPT-3.5-turbo in the 3-shot setting "has a high recall score and a comparatively low
  precision score for the positive class". This is shown as a confusion matrix (Figure 4), and **no numbers are given
  in the text.**

**Fit to E's test:** partial. CheckThat!'s "check-worthy" means worth a journalist's public fact-check. E's means
"should be checked against a file, a command or a record before sending". **The constructs differ, so these F1s are
not rates E can borrow.** What transfers is the shape: a skewed class balance, and LLMs that over-predict the positive
class.

## 2 · CLAIM EXTRACTION: the COST side, how much "list what to check" over-flags

**Source:** Metropolitansky & Larson, "Towards Effective Extraction and Evaluation of Factual Claims" (Claimify).
https://arxiv.org/pdf/2502.10855

- **Table 2** gives sentence- and element-level precision and recall for **verifiable (V)** and **unverifiable (UV)**
  content, against a human annotation study (§5.2).
- **Claimify:** sentence-level Recall_V **93.9**, Recall_UV **88.3**. Element-level Precision_V **96.7**, Recall_V
  **87.6**.
- **DnD:** sentence-level Recall_V **99.6**, Recall_UV **2.7**.
- **SAFE:** sentence-level Recall_V **99.5**, Recall_UV **6.5**.
- **VeriScore:** sentence-level Recall_V **67.8**, Recall_UV **97.9**.
- **AFaCTA and Factcheck-GPT** (sentence-level only): Recall_V 94.5 and 96.1; Recall_UV 59.8 and 56.5.
- **What that means as the paper defines the columns:**
  - Recall_UV is the share of unverifiable sentences a method correctly leaves out. **DnD and SAFE therefore mark
    ~93–97% of sentences that humans judged to hold nothing verifiable as containing a claim.**
  - They reach ~99.5% recall on the verifiable ones by flagging nearly everything.
  - VeriScore sits at the other end: it leaves out almost all of the unverifiable sentences, and a third of the
    verifiable ones with them.
- **Why this is E's cost ceiling, in the literature's own numbers:** a plain "extract the claims" instruction can buy
  near-total recall by near-total flagging. The distinguishing methods were the ones with an explicit, strict
  **selection** step (Claimify's Selection → Disambiguation → Decomposition, described in the paper's method).

## 3 · LLM SELF-VERIFICATION: how often models spot their OWN wrong claims

**Chain-of-Verification (CoVe).** Dhuliawala et al. 2023, https://arxiv.org/pdf/2309.11495
- **Method (§3):** draft, plan verification questions, answer them, then revise.
- **The key design finding (§3.3):** verification done *jointly*, in the draft's own context, "might hallucinate
  similarly to the original baseline response". The *factored* variant answers each question "as separate prompts
  [that] do not contain the original baseline response and are hence not prone to simply copying or repeating it".
- **Table 1, Wikidata, precision (Llama 65B):** few-shot **0.17**; CoVe joint **0.29**; two-step **0.36**; factored
  **0.32**. Llama 2 70B Chat zero-shot is 0.12. The other columns came out misaligned and are not quoted.
- **§4.3:**
  - "only 17% of the Llama few-shot baseline answer entities are correct in list-based questions. However, when
    querying each individual entity via a verification question, we find 70% are correctly answered."
  - "yes/no type questions perform worse", and ChatGPT "tends to agree with facts in a yes/no question format whether
    they are right or wrong."

**"Large Language Models Cannot Self-Correct Reasoning Yet."** Huang et al., ICLR 2024,
https://arxiv.org/pdf/2310.01798
- **Table 3, intrinsic self-correction with no oracle labels:**
  - GPT-4 on GSM8K: **95.5 → 91.5 → 89.0** (standard, then round 1, then round 2);
  - GPT-4 on CommonSenseQA: 82.0 → 79.5 → 80.0;
  - GPT-3.5 on CommonSenseQA: 75.8 → 38.1 → 41.8.
- **§3.3:** "For GSM8K, 74.7% of the time, GPT-3.5 retains its initial answer … the model is more likely to modify a
  correct answer to an incorrect one than to revise an incorrect answer to a correct one. The fundamental issue is
  that LLMs cannot properly judge the correctness of their reasoning."

**"LLMs cannot find reasoning errors, but can correct them given the error location."** Tyen et al. 2024,
https://arxiv.org/pdf/2311.08516
- **This is the closest published analogue to E's HIT:** find the one wrong step in a trace.
- **§3.1:** "All five models appear to struggle with our mistake finding dataset. GPT-4 attains the best results but
  only reaches an overall accuracy of **52.87** with direct step-level prompting." Per-task figures are in Table 4.
- **Footnote 7:** the traces are "sampled to contain more incorrect … traces than correct", "so the overall mistake
  location accuracy appears higher for per-step prompting in Table 4, **despite the poor accuracy for correct …
  traces**". That is, per-step checking over-flags correct steps.
- **§3.1 also says:** "humans can identify mistakes without specific expertise, and have a high degree of agreement"
  (Table 3).

**Self-Refine.** Madaan et al. 2023, https://arxiv.org/pdf/2303.17651
- **§3.3:** math gains are modest because "a consistent-looking reasoning chain can deceive LLMs to think that
  'everything looks good' (e.g., ChatGPT feedback for **94%** instances is 'everything looks good')". Gains are "much
  bigger (5%+) if an external source can identify if the current math answer is incorrect".
- **§4, qualitative:** in failed refinements, "33% of unsuccessful cases were due to feedback inaccurately pinpointing
  the error's location, while 61% were a result of feedback suggesting an inappropriate fix". This is from 70
  manually analysed samples.

**SelfCheckGPT.** Manakul et al. 2023, https://arxiv.org/pdf/2303.08896
- **Base rate (§5):** of 1,908 annotated GPT-3 WikiBio sentences, 39.9% were major-inaccurate, 33.1% minor-inaccurate
  and 27.0% accurate.
- **Table 2, sentence-level NonFact AUC-PR:** Random **72.96**, SelfCheckGPT-Prompt **93.42**, NLI 92.50. On the
  stricter NonFact* column: Random 29.72, Prompt 53.19.
- **The mechanism is sampling-based consistency** (several samples checked against each other), not a model reading
  one reply and naming what to check.

**"Language Models (Mostly) Know What They Know."** Kadavath et al. 2022, https://arxiv.org/pdf/2207.05221
- **§4.1:** self-evaluation of the model's own samples "may be considerably more difficult" than evaluating options
  "presented to the model by a third party [which] may be easier to categorize". "Zero-shot, P(True) is poorly
  calibrated, and typically it lies close to 50% for typical samples."
- **§4.2:** showing the model five of its own samples for comparison makes performance improve "significantly on all
  of the short-form answer tasks".
- **Results are given as figures (Figures 1 and 11), and no single rate is stated in the text, so none is quoted
  here.**

---

## 4 · WHAT THIS IMPLIES FOR E'S PREDICTIONS — **my inference, not the sources'**

1. **The HIT rate: likely high.** E's ask is a *recognition* task: "list every statement … that should be checked".
   It is not a *truth* task. On recognition the closest numbers are Claimify Table 2's: LLM extractors reach 94–99.6%
   sentence-level recall on verifiable content. By that anchor, most of the known wrong claims will be quoted.
   **A plausible range is 15–21 of 22** (the run is over 22 by the ruling at `a6d1a28`, W123 held out). That range is my extrapolation, since no source measured this item type
   (assistant replies about a repo's state). **The poor self-verification rates in §3** (Tyen 52.87; Self-Refine's 94%
   "looks good"; Huang's decline) **measure judging TRUTH, which E's ask does not require**, and should not be used as
   the hit prior.
2. **The FLAG SHARE: likely high, and the result turns on it.**
   - In the same table, the high-recall extractors let ~93–97% of unverifiable sentences through (Recall_UV 2.7 and
     6.5). The better-calibrated ones still pass 40–44% (AFaCTA, Factcheck-GPT).
   - The replies in E's pool are dense with statements about state.
   - **A plausible flagged share is 50–80% of a reply's sentences under the plain ask.**
   - **So "flags most of every reply" is a likely outcome, not an edge case.** E's degenerate clause and cost ceiling
     will probably decide the verdict, more than the hit bar will.
3. **Which framing is likely to work:** a strict selection criterion, and a separated context.
   - Claimify's precision came from an explicit selection-then-disambiguation step.
   - CoVe's factored variant beat joint verification because it did not condition on the draft.
   - Both point to asking for statements **whose truth depends on the current state of a named file, command or record,
     and that the reply does not already show a check for**, over "every statement of fact".
   - Per CoVe §4.3, avoid yes/no framing ("is this right?"). It invites agreement.
4. **A DESIGN RISK E should weigh, not a claim that the test is mis-framed.**
   - The readers are fresh third-party instances.
   - Kadavath §4.1 says third-party options "may be easier to categorize" than a model's own samples. CoVe §3.3 and
     Huang §3.3 both locate the failure in the model conditioning on its own output.
   - **So a PASS by fresh readers would show that the claims ARE recognisable from outside. It would not show that the
     authoring seat recognises them in-turn.** That is the plan's own falsifier sentence ("recognition is not the
     failing step; the seats simply don't run the check"), but read one level narrower.
   - **Worth one sentence in the registration:** fresh-reader recognition is an upper bound on in-turn recognition.

## NOT VERIFIED

- **Nothing was run against E's actual pool.** Every rate here is from other item types: debate sentences and tweets,
  Wikidata lists, GSM8K and word-sorting traces, WikiBio passages, and Claimify's annotated sentences.
- **The misaligned table columns** (CheckThat! Table 1 per-split rows, CoVe Table 1 beyond precision, the
  fact-checking study's Table 1 per-prompt mapping, Tyen Appendix E) were not re-read from the rendered PDFs. PDF
  page rendering is not installed on L.
- **The CheckThat! baseline's method** and **Kadavath's numeric rates** are not stated in the text I extracted.
- **The search was not exhaustive.** Self-critique work after 2024, and any study of claim-flagging over agent or
  coding transcripts, may exist and was not found. Two very recent search hits
  (https://arxiv.org/pdf/2606.05976, "The Self-Correction Illusion: Role Relabeling Gates Explicit Error Flagging";
  https://arxiv.org/pdf/2503.18293, "Can LLMs catch their own lies?") look relevant to point 4 and **were NOT read.**
