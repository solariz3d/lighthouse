# Outside: how to know what a change to a system prompt or persona document changed. Outside reader, 2026-11-13

Research only. One reader, swarm plan `exo_memory/loop/plan_room_better_swarm_2026-11-13.md:14` ("prompt regression tests").
Marks: [read] opened and seen; [summary] abstract or secondary account; [inferred] my inference; [ours] a proposal.
Outside papers were downloaded with curl from arxiv.org/html and read as text; arXiv API abstracts are [summary].
Places in outside sources are section names, not line numbers.

## 0. What the room already holds (not repeated below)

- A sealed-key behavioural battery with counts and Fisher exact tests: K0 65.0% (13/20), K1 72.5% (29/40), K2 82.5%
  (33/40), ~~no pair p<0.20~~ second reader: one pair is below 0.20: K0 v K2 p=0.195 (Fisher two-sided), listed at
  the source's `:67` [read] and re-derived today from the counts [read: node run, 0.422 / 0.564 / 0.195]; none is
  below 0.05. The source's own "p ≥ 0.20 on all four" at `:66` contradicts its `:67` [read]. Cost not recorded.
  [read] `exo_memory/research/the_retrieval_problem_outside.md` ~~:62-63~~ second reader: `:62-67` (rates at
  `:63-64`, p-values at `:66-67`). Its run carried a
  seam defect (`handoff.js` differed between K0 and the cue arms) [read] same file `:92`. Cost not recorded.
- The three-arm recognition test and the intake-size ladder with a "knee" [read]
  `exo_memory/third_place/SPINE_diversity_to_retrieval_2026-09-16.md:141`,
  `exo_memory/third_place/QUANTIZE_the_room_2026-09-21.md:18-25`.
  second reader: that ladder's scorer is "with the keeper as oracle on a sample" [read] QUANTIZE `:23`; §5 below
  cites the later rule that routes judging away from him (MEMORY.md:14, dated 2026-10-01). The two stand side by side.
- A decision rule that measures the same arm twice to get run-to-run noise before comparing [read] SPINE `:134`, `:197`.
- The word-overlap gauge inverted: ONE MIND 0.9162 vs SIX MINDS 0.8201 [read] SPINE `:58`. Cost not recorded.
- The Assistant Axis and persona vectors are already on the shelf [read] `exo_memory/third_place/2026-09-21.md:220`,
  `exo_memory/map/M.md:955`. The map records "NOT found: a model rebuilding an identity from a principles-and-record
  corpus at each wake" [read] `exo_memory/map/M.md:957`.
- Grep over `exo_memory/` and `essay/` `.md` files: "prompt regression" 1 file (the swarm plan), "promptfoo" 0,
  "PersonaGym" 0, "character consistency" 0; "McNemar" 7 files (retriever work) [read] grep counts run today.
- [inferred] The room's guards on brief and card text (carrier drift, frozen sets; `research/openrig_against_consonance_
  2026-10-30.md:23`) check WORDS. Nothing found checks BEHAVIOUR when a brief, BOOT or card changes.
  (second reader: carrier drift is at `:23`, the frozen CH-4 set at `:24` [read].)

## 1. Regression evaluation of prompts, as practised

- Anthropic separates capability evals from regression evals. A regression eval asks "Does the agent still handle all
  the tasks it used to?" and "should have a nearly 100% pass rate"; passed capability tasks "graduate" into the
  regression suite [read] anthropic.com/engineering/demystifying-evals-for-ai-agents (Jan 9 2026), "Capability vs.
  regression evals".
- Same post: "20-50 simple tasks drawn from real failures is a great start", because early changes have large effects;
  "more mature agents may need larger, more difficult evals to detect smaller effects" [read] same, "Step 0. Start early".
- Same post: build balanced sets. "Test both the cases where a behavior should occur and where it shouldn't. One-sided
  evals create one-sided optimization" [read] "Step 3".
- Same post: each trial "isolated" from a clean environment; shared state "can cause correlated failures" [read] "Step 4".
- Same post: pass@k vs pass^k. At 75% per trial and 3 trials, all-three-pass is (0.75)^3 ≈ 42%; "pass^k for agents
  where consistency is essential" [read] "pass@k and pass^k".
- Same post: "You won't know if your graders are working well unless you read the transcripts" [read] "Step 6".
- Claude docs: "Prioritize volume over quality: More questions with slightly lower signal automated grading is better
  than fewer questions with high-quality human hand-graded evals" [read]
  platform.claude.com/docs/en/test-and-evaluate/develop-tests, "Eval design principles".
- Claude docs offer embedding cosine similarity across paraphrased inputs as a CONSISTENCY metric [read] same page,
  "Consistency (FAQ bot): cosine similarity evaluation".
- OpenAI names "vibe-based evals" an anti-pattern and asks that automated scoring be calibrated against human labels
  [read] platform.openai.com/docs/guides/evaluation-best-practices, "Anti-patterns", "LLM-as-a-judge".
- promptfoo runs a test set on every prompt change in CI and fails the build under a threshold; assertions carry a
  weight and a threshold, and an assert-set can pass on a fraction (e.g. 0.25 = 1 of 4) [read]
  promptfoo.dev/docs/integrations/ci-cd/ ("Quality gates"), promptfoo.dev/docs/configuration/expected-outputs/.

## 2. Behavioural test batteries with keys

- CheckList (ACL 2020) splits each capability into three test types: Minimum Functionality (simple keyed cases),
  Invariance (a change that should NOT change the output) and Directional Expectation (a change with a known expected
  direction) [read] arxiv.org/abs/2005.04118, §2.
- In its user study, practitioners with CheckList "created twice as many tests, and found almost three times as many
  bugs" [read] same, abstract and §4.2. A team with an "extensively tested" commercial model found new bugs [read] §4.1.
- Bloom (Anthropic, Dec 19 2025) generates behavioural evals from a seed config; "always cite Bloom metrics together
  with their seed configuration for reproducibility" [read] alignment.anthropic.com/2025/bloom-auto-evals/.
- Bloom's validation is the closest public case to "did this system prompt change behaviour": ten system-prompted
  "model organisms" vs their unprompted baselines, 50 rollouts each, system prompt hidden from the judge; it separated
  them for 9 of 10 quirks, zero-shot; three repetitions per bar [read] same, "Distinguishing Model Organisms".
- Bloom's own caveat: "since model behavior can be sensitive to context and prompt variations (Sclar et al, 2023),
  direct comparisons are unreliable" across benchmarks [read] same section.
- Persona vectors: eight system prompts from trait-suppressing to trait-promoting; activation projection at the last
  prompt token correlates with trait expression r=0.75-0.83, but mostly between prompt types, "more modest" within a
  type, so "less reliable for more subtle behavioral changes" [read] arxiv.org/abs/2507.21509, §3.3.
  [inferred] It needs model activations; the room's seats run on a hosted model, so this is not available here.

## 3. Held-out probes

- Persona vectors split 40 generated questions into 20 for extraction and 20 for evaluation, disjoint [read]
  arxiv.org/abs/2507.21509, appendix on the generation prompt.
- A topic-disjoint study of prompt optimisation (preprint, Oct 2026): held-out reward 0.702 -> 0.781, bootstrap 95% CI
  [0.051, 0.107], three seeds. The validation-minus-held-out gap was "small-sample selection under a noisy judge, not
  memorization"; collapsing per-dimension feedback to one scalar "makes held-out transfer negative"; it concludes
  credible evaluation "requires held-out topics, multiple seeds, and verifier ablations" [read]
  arxiv.org/abs/2610.12601, abstract.
- Evaluation awareness: on 1,000 transcripts from 61 sources, Gemini-2.5-Pro separates evaluation from deployment at
  AUC 0.83; the authors' simple human baseline 0.92 [read] arxiv.org/abs/2505.23836, abstract and §3.
  [inferred] A probe that reads as a test may measure test behaviour, not working behaviour. Probes drawn from real
  record situations (the Anthropic post's "real failures") are less likely to read as tests.
- A sentiment example in Claude docs sets a "held-out test set" of 10,000 posts as the success bar [read]
  platform.claude.com/docs/en/test-and-evaluate/define-success.

## 4. Paired before/after scoring

- "Adding Error Bars to Evals" (Miller, Anthropic, Nov 2024) [read] arxiv.org/abs/2411.00640:
  - §4.2: score the SAME questions under A and B and take per-question differences. Variance falls by 2·Cov/n. With
    correlation 0.5 the variance drops by 1/3. "Paired differences represent a 'free' reduction"; report pairwise
    difference, its SE, a 95% CI and the score correlation (Table 5 format).
    second reader: the paper does say 1/3, "from 1/6 to 1/9" [read] §4.2. [inferred] Its own numbers give
    1/12 + 1/12 - 2·(1/24) = 1/12, a halving, not 1/3. The [inferred] 29 -> 20 below uses the halving; at the paper's
    stated 1/3 it would be about 23. Neither figure is wrong as arithmetic; they rest on different readings.
  - §2.2, Table 4: when questions come in related groups, clustered SEs on real data were "over 3X larger" than naive.
  - §3.1: resample each question K times. K=2 cuts variance by 1/3, K=4 by 1/2, K=6 by 5/9 in their example; the
    ceiling there is 2/3.
  - §5, eq. 9: to detect a 3-point difference at 80% power and alpha 0.05 (their example values) needs about 969
    independent questions; in another example, raising K from 1 to 10 at n=198 cuts the minimum detectable effect from
    13.2% to 7.5%.
- [inferred] Applied to the K battery's shape (binary outcome near 70%, n=40 per arm, unpaired), the normal-approx
  minimum detectable difference at 80% power is about 29 points; pairing at correlation 0.5 brings it to about 20.
  That fits the 17-point gap that read as noise in §0.
  second reader: 29 and 20 re-derived (0.287, 0.203) [read: node run]. But K0 had n=20, not 40, and the 17-point gap
  is K0 v K2 (20 v 40); its unpaired floor is about 35 points [inferred], so "fits" holds with more room.
- Negative flips: after a model update, "previously correct instances are now predicted incorrectly", up to more than
  60% in some update/task pairs, and MORE flips when the overall gain is smaller [read] arxiv.org/abs/2407.09435
  (MUSCLE), §6.1. Negative flip rate (NFR) = share of items correct before and wrong after [read] §3.
  [inferred] An aggregate that rises can hide items that broke; a flip list per item shows them.
- Prompt wording alone moves scores: up to 76 accuracy points between equivalent formats (LLaMA-2-13B), about 10 on
  average over 50+ tasks; not removed by size, few-shot or instruction tuning; format effects "only weakly correlate
  between models" [read] arxiv.org/abs/2310.11324, §1 and §4.2.
- Across 6.5M instances, 20 models and 39 tasks, single-template rankings are brittle; most Kendall's W values across
  paraphrases are below 0.85; the authors call for multi-prompt evaluation [read] arxiv.org/abs/2401.00595, §4.
- Seed-variance study: item analysis and item response theory "struggle to meaningfully reduce variance" [read]
  arxiv.org/abs/2406.10229, §1.

## 5. Judges, when the key cannot be exact

- LLM judges show position, verbosity and self-enhancement bias; a strong judge reached over 80% agreement with humans,
  the human-human level; most judges favour the first position, and GPT-4 was consistent under swap in "more than 60%"
  of cases. Mitigation: judge twice with the order swapped and "only declare a win when an answer is preferred in both
  orders" [read] arxiv.org/abs/2306.05685, §3.3, §3.4, §4.2.
- Bloom: judge-human Spearman 0.86 (Claude Opus 4.1) and 0.75 (Sonnet 4.5) on 40 transcripts over 12 behaviours
  [read] alignment.anthropic.com/2025/bloom-auto-evals/, "Judge Trust and Calibration".
- PersonaScore (an ensemble of LLM judges with rubrics): average Spearman 75.1%, Kendall 62.73% against five expert
  annotators on 1,500 responses [read] arxiv.org/abs/2407.18416, §4 Table 3. (second reader: Table 3 floats inside
  §4 in the HTML; the 75.1% / 62.73%, the five experts and the 1,500 responses are in the text of §5 "Human
  Evaluation" [read].)
- [read] The room's standing rule routes judging to panes or other models, not to the keeper
  (`C:/Users/nname/.claude/projects/C--Consonance-instances-librarian/memory/MEMORY.md:14`). [inferred] So the keyed
  calibration sample has to be written before the run by a seat, not labelled by him afterwards.

## 6. Consistency of an assistant's character across context and resets

- Within one conversation: system-prompt adherence drifts "within eight rounds" (LLaMA2-chat-70B, GPT-3.5); probe
  questions asked at set rounds measure it; 100 system prompts in 5 categories [read] arxiv.org/abs/2402.10962,
  abstract and §3. Attention to the prompt decays with length [read] §4.
- Identity drift in nine models over 36 conversation themes, questionnaires after themes 12, 24 and 36: "larger models
  exhibited greater identity drift"; assigning a persona "may not help" [read] arxiv.org/abs/2412.00804, §3-§4.
  (second reader: setup is §3, snapshots after themes 12/24/36 in §3.5; the quoted "larger models exhibited greater
  identity drift" is in §5 Conclusion, and "may not help" in the abstract [read].)
- PersonaGym: 200 personas, 10,000 questions, 10 models; GPT-4.1 had "the exact same PersonaScore as LLaMA-3-8b";
  size does not predict persona fidelity [read] arxiv.org/abs/2407.18416, abstract.
- Across contexts (the nearest published analogue to a reset: the same persona prompt, a different prior
  conversation each time): value stability measured with psychology's rank-order (between personas) and ipsative
  (within one persona) stability; with personas, rank-order stability is low and "further diminishes with conversation
  length"; model families differ consistently [read] arxiv.org/abs/2402.14846, abstract, §3.
- Assistant Axis (held, §0). One number not on the shelf: first-turn projection correlates with harmful second-turn
  rate r=0.39-0.52 over 275 role prompts [read] arxiv.org/abs/2601.10387, Figure 8 text. (second reader: the r is
  in the body paragraph after Figure 8, not its caption; 275 roles times 10 questions [read]. "Not on the shelf":
  0 files under exo_memory/ carry "0.39-0.52" [read: grep count].) Their conversations used LLM
  users, inspected by humans [read] Limitations.
- Questionnaire-style probes are themselves unstable: 693 questions, 39 instruments, 17 models; option-order and
  negation perturbations "significantly downgrade" answers; most models have "low negation consistency" [summary]
  arxiv.org/abs/2311.09718.
- Against that: 8,000 value questions over 300+ topics; models "relatively consistent across paraphrases, use-cases,
  translations"; less so on controversial topics; base models more consistent than fine-tuned [summary]
  arxiv.org/abs/2407.02996.
- PTCBENCH: 12 situational conditions, 39,240 NEO-FFI records; some scenarios shift personality and reasoning
  [summary] arxiv.org/abs/2602.00016.
- MicroVerse (Aug 2026): an immutable "soul file" vs a revised identity; drift scored by "a paraphrase-aware,
  value-anchored, multi-register diff rather than raw cosine similarity"; n=25 seed run [summary]
  arxiv.org/abs/2608.15844.
- A design paper keeps an agent's identity hash byte-equal across memory consolidation by keeping learned knowledge
  out of the hashed identity manifest [summary] arxiv.org/abs/2607.01988.

## 7. Where the sources disagree

1. How many probes. Anthropic's post: 20-50 tasks suffice early, because effects are large. Miller: about 1,000
   questions for a 3-point difference. [inferred] Both hold; the needed n is set by the effect you must see. Small
   persona edits are likely small effects.
2. Volume vs reading. Claude docs: volume over hand-graded quality. Anthropic's post: read transcripts; a good task is
   one two experts would grade the same. OpenAI: calibrate against humans. [inferred] These differ on stage, not aim.
3. Cosine similarity as a consistency gauge. Claude docs use it. MicroVerse rejects raw cosine for identity drift
   [summary]. The room measured word overlap inverting [read] SPINE `:58`. Surface similarity and character are not
   the same quantity in any source that tested it.
4. Does scale help. Identity drift: larger models drift more. PersonaGym: size does not predict. Value stability:
   family matters more than size. [inferred] Measures differ; no source settles it.
5. Are models consistent at all. 2311.09718: low negation consistency. 2407.02996: relatively consistent. Both
   [summary]. [inferred] The verdict follows the perturbation type chosen.
6. Why held-out scores fall. The usual reading is overfitting; 2610.12601 found the gap was selection noise under a
   noisy judge, not memorization [read]. One preprint.

## 8. What this could mean for the room (options, not decisions) [ours]

- A per-seat battery: 20-50 probes drawn from real record situations, each with a key written before any run;
  balanced (should and should-not cases); typed as CheckList's MFT / INV / DIR. INV probes cover edits meant to change
  nothing; DIR probes cover the intended change.
- Split it: a development half the brief author may see, a sealed held-out half nobody editing the brief sees.
- Before/after on the SAME probes: K≥3 fresh wakes per version, per-probe paired differences with SE, CI and
  correlation (Miller's Table 5 format), plus a flip list (pass->fail, fail->pass).
- A noise floor first: the same version run twice, which is the room's own T2 rule [read] SPINE `:134`. A version
  change smaller than the floor is not reported as a change.
- Each probe in 2-3 paraphrases, scored as one item (multi-prompt).
- Where a judge is needed: swap order, win only if both orders agree; check the judge on a pre-keyed sample.
- For "same character across resets": score ipsative stability across fresh wakes of one intake, then compare intakes.
  This is the ladder's knee with a noise floor under it.
- Cheapest first step [ours]: freeze the K battery's items as the first regression set and re-run them paired.

## 9. Could not obtain

- Any published study of character consistency when a persona is rebuilt from a written record at each fresh session.
  Searches found within-conversation drift and across-context stability only; the room's M.md:957 found the same gap.
- Anthropic's internal practice for testing system-prompt changes to its own products: not found in the pages read.
- promptfoo's repeat or baseline-comparison features: not confirmed in the two pages read.
- Full texts for 2311.09718, 2407.02996, 2602.00016, 2608.15844, 2607.01988: abstracts only, marked [summary].
- Real-world (not fictional) effect sizes for persona-document edits on a hosted model: none found.

## Second reader

Adversarial second reader, 2026-11-13. Read-only except this file. Outside pages fetched with curl and read as text.

**What I checked.** Every [read] mark in §0-§6, and every number, except those listed under "could not check".
- Local, opened at the cited line: the retrieval file `:62-67` and `:92`; SPINE `:58`, `:134`, `:141-142`, `:197`;
  QUANTIZE `:18-25`; third_place 2026-09-21 `:220-221`; M.md `:955`, `:957`; openrig `:23-24`; MEMORY.md `:14`;
  swarm plan `:14`; the SPINE row's own source `consonance/tools/agreement-spread.js:3-12` (0.9162 / 0.8201 match).
- The five grep counts, re-run over `exo_memory/` and `essay/` `.md`, excluding today's swarm folder: 1 / 0 / 0 / 0 / 7.
  All match. The 7 McNemar files are all retriever work (4 in loop/, 2 librarian notes, LEDGER).
- Outside, opened as text: the Anthropic evals post (all six quotes, the step headings, the Jan 9 2026 date, 0.75^3);
  the Claude docs page (volume over quality, the cosine consistency section, the 10,000-post held-out set); OpenAI's
  anti-patterns; both promptfoo pages (quality gates; weight; assert-set threshold 0.25 = 1 of 4); Bloom (Dec 19 2025;
  seed-config quote; ten organisms, 50 rollouts, 9/10, zero-shot, three repetitions; Sclar caveat; Spearman 0.86 /
  0.75, 40 transcripts, 12 behaviours); arXiv HTML of 2005.04118, 2507.21509, 2610.12601, 2505.23836, 2411.00640,
  2407.09435, 2310.11324, 2401.00595, 2406.10229, 2306.05685, 2407.18416, 2402.10962, 2412.00804, 2402.14846,
  2601.10387. Every quoted phrase and number in those lines was found in the source.
- The [summary] lines' numbers, against the arXiv API abstracts: 693 / 39 / 17; 8,000 / 300+; 12 / 39,240; n=25;
  the hash-manifest design. All match.
- Arithmetic, re-run with node: Fisher two-sided K1 v K2 0.422, K0 v K1 0.564, K0 v K2 0.195; MDD 0.287 unpaired and
  0.203 paired at correlation 0.5 (n=40, p=0.7); Miller's 969 and 13.2% -> 7.5% are the paper's own figures.

**What I struck (2).**
1. §0, "no pair p<0.20": K0 v K2 is p=0.195. The file copied the source's summary sentence (`:66`), which its own
   next line (`:67`) contradicts. The conclusion "no arm separated at 0.05" is untouched. Cost not recorded.
2. §0, the citation range `:62-63`: the K1/K2 rates are at `:64` and the p-values at `:66-67`. Corrected to `:62-67`.
   Cost not recorded.

**What I noted but did not strike (under-specified, not wrong).**
- Miller §4.2: the paper's "1/3" does not follow from its own example numbers (a halving does); §4's 29 -> 20 uses the
  halving. Flagged in place so a reader sees both.
- §4: "n=40 per arm" fits K1/K2; K0 had n=20. Flagged in place.
- Places: PersonaGym figures are in §5 text (Table 3 floats in §4); 2412.00804's quote is in §5 and the abstract;
  2601.10387's r is in the paragraph after Figure 8, not the caption; openrig's frozen set is at `:24`.
- §0 vs §5: QUANTIZE `:23` uses the keeper as oracle on a sample; §5 infers he will not label, from the later rule.
  Both are in the record; flagged in place, not resolved.
- Both Claude docs URLs (`develop-tests`, `define-success`) now serve one page, "Define success criteria and build
  evaluations"; every quote cited to either is on it.

**What I could not check.**
- That the first reader fetched each source when it says it did; I can only say the text is there today.
- CheckList's §4.1 and §4.2 placement: the abstract carries both claims; I did not open the §4 body.
- Persona vectors' "more modest" is in §3.3; the within-type figures sit in Appendix C.2, not opened.
- The full texts of the five [summary] papers (abstracts only, as the first reader said).
- The pass@k / pass^k heading name in the Anthropic post (the quotes are under it; the heading text was not grepped).
