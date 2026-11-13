# Outside: the cost and benefit of many agents against one agent with a large context

Research reader, 2026-11-13. Read-only. Marks: [read] opened the source text; [summary] abstract or secondary account;
[inferred] my inference; [ours] a proposal. Every outside source below was downloaded with curl (arXiv PDFs converted
with pdftotext; three web posts stripped to text with a short node script) and read in the downloaded text. Places
are given as section, table or figure of the source, because the converted text sits in a session scratchpad.

**Not repeated here (already held).** Chen et al. 2604.18005 on hierarchy, anchoring, personas ~9% and different
models per seat (`exo_memory/third_place/SPINE_diversity_to_retrieval_2026-09-16.md:29-41`); MAST named only as the
nearest source for claims about another agent (`exo_memory/research/claim_base_rate_priors_2026-09-27.md:114-115`);
lost-in-the-middle, prospective memory, continued influence, checklists, CRM and human code inspection
(`exo_memory/research/the_retrieval_problem_outside.md`, §1-§5); OpenRig and the non-Claude seat
(`exo_memory/research/openrig_against_consonance_2026-10-30.md:38`); the agent-map pointers
(`exo_memory/research/outside_reader_agent_maps_2026-10-30.md`). MAST is used below for its failure RATES and its
verification findings, which the room's file did not carry.

---

## 1 · Where coordination overhead goes

**Tokens, first and most.**
- Anthropic's research system: agents use "about 4x more tokens than chat interactions, and multi-agent systems use
  about 15x more tokens than chats". [read] https://www.anthropic.com/engineering/multi-agent-research-system,
  section "Benefits of a multi-agent system", published Jun 13 2025.
- Same source: an Opus-4 lead with Sonnet-4 subagents "outperformed single-agent Claude Opus 4 by 90.2%" on an
  internal research eval; on BrowseComp "token usage by itself explains 80% of the variance", three factors 95%.
  [read] same page, same section. The eval is internal and not published. ~~[read, same place]~~
  second reader: the page says "internal research eval" (§Benefits); "not published" is not stated there. [inferred]
- Same source names where it does NOT pay: "domains that require all agents to share the same context or involve
  many dependencies between agents are not a good fit ... most coding tasks involve fewer truly parallelizable tasks
  than research". [read] same section. Early failure modes: "spawning 50 subagents for simple queries ...
  distracting each other with excessive updates"; without detailed task descriptions "agents duplicate work, leave
  gaps". [read] section "Prompt engineering and evaluations for research agents".
- Google/MIT, matched compute: coordination overhead relative to a single agent is **58% (independent), 263%
  (decentralized), 285% (centralized), 515% (hybrid)**, "1.6-6.2x token budgets" at matched performance. [read]
  Kim et al., "Towards a Science of Scaling Agent Systems", https://arxiv.org/pdf/2512.08296 v3 (8 Apr 2026),
  Table 5 and §4 text.

**Then fragmentation of each agent's budget.** Under a fixed total budget, multi-agent systems "fragment the
per-agent token budget, leaving insufficient capacity for complex tool orchestration". [read] Kim et al., §1
"three scaling patterns". Their worked example lists subagents doing work that is "redundant, since state is
visible to all". [read] same paper, the PlanCraft trace.

**Then a capability ceiling.** Tasks where the single agent already exceeds about **45%** "experience negative
returns from additional agents" (beta = -0.236, p = 0.004). Range across tasks: **+80.8%** (decomposable financial
reasoning, centralized) to **-70.0%** (sequential planning, independent); every multi-agent variant degrades
sequential planning, **-39% to -70%**. 260 configurations, six benchmarks, three model families; the fitted model
picks the best architecture for 87% of held-out configurations; cross-validated R^2 = 0.373. [read] Kim et al.,
abstract and §1.
- A second team: "the benefits of MAS over SAS diminish as LLM capabilities improve"; a cascade between the two
  "improves accuracy by 1.1-12% while reducing deployment costs by up to 20%". [summary] Gao et al.,
  https://arxiv.org/pdf/2505.18286, abstract only.

**Then failures that are about organisation, not the model.**
- MAST, 1,642 annotated traces, 7 frameworks: failure rates **41% to 86.7%**. Failure categories: specification
  issues **44.2%**, inter-agent misalignment **32.3%**, task verification **23.5%** (the three verification modes
  6.2 + 8.2 + 9.1 = 23.5, which checks the reading of the figure). Human agreement kappa = 0.88. [read] Cemri et
  al., https://arxiv.org/pdf/2503.13657 v3, Figure 1 and §1.
- MAST's own reading: failures stem from "organizational design and agent coordination rather than the limitations
  of individual" ~~models~~ agents (second reader: the paper's word is "agents"); a role-specification fix alone gave
  ChatDev **+9.4%**. [read] same, ~~§1 and conclusion~~ second reader: the quote is §5.3 "Beyond Model Capabilities:
  The Primacy of System Design", not §1 or §6; +9.4% is in §1 and §4 (Insight 1). In §1 the same +9.4% is credited to
  "a straightforward system workflow adjustment ensuring the CEO had the final say", in §4 to "improving agent role
  specifications alone"; the paper names the fix two ways. [read] 2503.13657v3, §1, §4, §5.3.
- Same source, framing line: MAS "performance gains often remain minimal compared to single-agent frameworks or
  simple baselines like best-of-N sampling". [read] same, §1 (cites others for it).

**Then the cost of finding which agent failed.** Best automated method: **53.5%** right on the responsible agent,
**14.2%** on the failing step. [read] Zhang et al., "Which Agent Causes Task Failures and When?",
https://arxiv.org/pdf/2505.00212, abstract.

**The context argument against splitting.** Cognition: "Share context, and share full agent traces, not just
individual messages"; "Actions carry implicit decisions, and conflicting decisions carry bad results"; the
default is "a single-threaded linear agent", with a compression model added only for very long tasks. No numbers
are given. [read] https://cognition.ai/blog/dont-build-multi-agents (Walden Yan, 2025-06-12), "Principles".

## 2 · When an independent second reader catches what one agent does not

- **Without outside feedback, one agent checking itself does not help and can hurt.** "LLMs struggle to
  self-correct their responses without external feedback, and at times, their performance even degrades";
  improvements reported elsewhere "vanish when oracle labels are not available". [read] Huang et al.,
  https://arxiv.org/pdf/2310.01798, abstract and §1.
- **A verifier helps; a shallow verifier does not.** Systems with explicit verifiers show fewer failures, but
  "many existing verifiers perform only superficial checks, despite being prompted to perform thorough
  verification, such as checking if the code compiles"; adding a high-level objective check to ChatDev gave
  **+15.6%**. [read] Cemri et al., §4 "Insight 3" and Appendix H.
- **A central check point contains error spread.** Independent agents amplify trace-level errors **17.2x**;
  centralized coordination holds it to **4.4x** "by enforcing validation bottlenecks that intercept errors before
  aggregation". [read] Kim et al., §1.
- **The second reader must know something different.** Gains from a weak supervisor to a strong student are higher
  "when the two models are more different". [read] Goel et al., "Great Models Think Alike and this Undermines AI
  Oversight", https://arxiv.org/pdf/2502.04313, Figure 1 caption and §4.
- **Splitting a long input can beat one long context.** Chain of Agents (workers each read a short segment, a
  manager synthesises) beats RAG, full-context and other multi-agent baselines "by up to 10%". [read] Zhang et al.,
  https://arxiv.org/pdf/2406.02818, abstract.
- **Why one large context is not free.** 18 models; "performance grows increasingly unreliable as input length
  grows", non-uniformly, worse with distractors. [read] Chroma, "Context Rot", https://research.trychroma.com/
  context-rot, introduction (July 14 2025). Technical report, not peer reviewed. ~~[read, same page]~~
  second reader: the page carries a "@techreport" citation block; it does not state peer-review status. [inferred]

## 3 · When agents converge on each other's errors

- **Different models share wrong answers.** On HELM, model pairs agree about **60%** of the time when both are
  wrong, against 1/3 by chance; same provider, same base architecture and similar size raise it; and "larger and
  more accurate models have highly correlated errors, even with distinct architectures and providers". 349 models
  on 12,032 items; 71 on 14,042. [read] Kim, Garg, Peng, Garg, https://arxiv.org/pdf/2506.07962, abstract and §1.
  second reader (disambiguation, not a strike): 349 models on 12,032 items is the HuggingFace leaderboard set; HELM,
  where the 60% is measured, is the 71 models on 14,042 items. [read] 2506.07962 v1, §1.
- **The trend is upward.** "Model mistakes are becoming more similar with increasing capabilities". A judge's scores
  correlate with the judged model's similarity to it (average Pearson **r = 0.84**, raw; still significant after
  controlling for accuracy, their Table 2). [read] Goel et al., abstract and §3 Q1.
- **A model prefers its own output.** Self-preference strength is "linearly correlated" with self-recognition;
  three models tell their own outputs apart at over 50% out of the box. [read] Panickssery, Bowman, Feng,
  https://arxiv.org/pdf/2404.13076, §1 contributions 2 and 4.
- **Debate flips right answers to wrong.** "Models frequently shift from correct to incorrect answers in response to
  peer reasoning, favoring agreement over challenging flawed reasoning", even when stronger models outnumber
  weaker ones; sycophancy and social conformity examined. [read] Wynn, Satija, Hadfield,
  https://arxiv.org/pdf/2509.05396, abstract and §3 (Figures 2-4). No single headline rate was extracted.
- **The original debate paper saw it too.** Du et al. report gains (Table 1, 3 agents, 2 rounds: arithmetic 67.0 to
  81.8, GSM8K 77.0 to 85.0) and in their limitations: "Despite answers being incorrect, language models would
  confidently affirm" them; in GSM8K "sometimes answers would converge to the incorrect value". [read]
  https://arxiv.org/pdf/2305.14325, Table 1 and §5 and appendix.
- **Debate adds little over voting.** "Majority Voting alone accounts for most of the performance gains typically
  attributed to MAD"; debate "induces a martingale over agents' belief trajectories, implying that debate alone does
  not improve expected correctness". [read] Choi, Zhu, Li, https://arxiv.org/pdf/2508.17536, abstract. Huang et al.:
  debate is "no better than self-consistency" at an equal number of responses. [read] 2310.01798, §1. Smit et al.:
  debate systems "do not reliably outperform" self-consistency and multi-path ensembling, though tuned
  Multi-Persona does better. [read] https://arxiv.org/pdf/2311.17371, abstract. Wang et al.: "a single-agent LLM
  with strong prompts can achieve almost the same performance as the best existing discussion approach"; discussion
  wins only "when there is no demonstration in the prompt". [read] https://arxiv.org/pdf/2402.18272, abstract.
- **Plain sampling scales.** Sampling-and-voting accuracy "scales with the number of agents"; at ensemble size 15,
  Llama2-13B matches Llama2-70B on GSM8K. [read] Li et al., https://arxiv.org/pdf/2402.05120, abstract and Fig. 1.

## 4 · Where the sources disagree

1. **Is the gain from the architecture or from the tokens?** Anthropic: 90.2% better, but tokens alone explain 80%
   of variance and the system spends ~15x a chat. Kim et al. match total compute and find
   ~~gains only on decomposable tasks~~, losses on sequential ones. [read, both above] Read together: much of the
   published gain may be extra spend. [inferred]
   second reader: large gains on decomposable financial reasoning (+57% to +80.8%), but also +9.2% on dynamic web
   navigation (decentralized), up to +6% on Workbench and +2% on Terminal-Bench (independent); "only" overstates it.
   [read] 2512.08296v3, §1 and the Figure 2 caption (a)-(f).
2. **Different models: help or harm?** Chen et al. (held): different models per seat is the one large diversity
   lever. Self-MoA: mixing different LLMs "often lowers the average quality"; aggregating one top model's samples
   beats mixed MoA by **6.6%** on AlpacaEval 2.0 and **3.8%** on average. [read] Li et al.,
   https://arxiv.org/pdf/2502.00674, abstract. Correlated-errors and Goel: cross-provider errors still correlate,
   more so for stronger models. [read, above] So diversity of models buys less as models improve, and costs quality
   when the second model is weaker. [inferred] Wynn: mixed-capability debate can still lose accuracy. [read]
3. **Does talking help?** Du et al. yes (Table 1); Choi, Huang, Smit, Wang: mostly no, once voting or a strong
   prompt is the baseline. [read, above] The disagreement is about the baseline, not the data. [inferred]
4. **Split the context or keep it whole?** Cognition: keep one thread, share full traces. Chain of Agents and Chroma:
   one long context degrades; short contexts per worker win up to 10%. Anthropic: subagents fit "information that
   exceeds single context windows" but not shared-context, dependency-heavy work. [read, above] They agree once the
   task shape is named: parallel reading splits well, dependent decisions do not. [inferred]
5. **Is failure the model or the organisation?** MAST: organisation (fixes of +9.4% and +15.6% without changing the
   model). Gao et al. and Kim et al.: the advantage shrinks as the single model gets stronger. [read / summary]
   Both can hold: organisation decides whether a team works; model strength decides whether it is needed.
   [inferred]

## 5 · What this bears on in the room (options, not decisions)

- The room's 45/45 CONFIRMED over a set ~18% wrong (`exo_memory/third_place/SPINE_diversity_to_retrieval_2026-09-16.md:51`,
  citing `journal/2026-08-11.md:90-93`, not reopened here) has the shape the outside reports for ~~same-model~~
  agreement: ~60% shared wrong answers (2506.07962) and agreement-favouring flips (2509.05396). [inferred]
  second reader: both sources measure DIFFERENT models. The 60% is averaged over pairs of distinct models on HELM;
  Wynn et al. study groups mixed by capability ("whereas we explore how diversity in model capabilities influences
  the dynamics"). Neither measures same-model agreement. [read] 2506.07962 §1; 2509.05396 abstract. The journal
  lines were reopened by the second reader: "8 hold / 1 unverified / 2 defective of 11 — roughly 18%" and "six
  adversarial groups produced zero disagreement". [read] `exo_memory/journal/2026-08-11.md:90-94`. Cost per
  the record cited there: not recorded in this file's sources.
- Kim et al.'s 17.2x vs 4.4x supports a validation point before aggregation; the room's librarian collation sits
  where their "centralized verification" sits. [inferred] Whether the room's collation checks the objective, or
  only that a hand-back is well-formed (MAST's "superficial checks"), is not measured. Option: count, over N past
  collations, how many reopened a cited file versus checked form only. [ours]
- Kim et al.'s 45% ceiling and the -39% to -70% on sequential planning bear on whether to split a dependent build
  across panes. Option: classify each lap as decomposable or sequential before dispatch and compare outcomes. [ours]
- Anthropic's "subagent output to a filesystem to minimize the 'game of telephone'" (section "Appendix") matches the
  room's pointer-not-content hand-back. [read for the source; inferred for the match]
- A non-Claude second reader (already proposed, `openrig_against_consonance_2026-10-30.md:38`) is supported by Goel
  (difference matters) and limited by 2506.07962 and Goel (strong models converge across providers) and Self-MoA
  (a weaker second model costs quality). Option: score a cross-vendor reader against a same-model reader on a
  seeded-defect object, both at matched tokens. [ours]
- Matched-token comparison is the control almost every critique paper above uses and the room's single-vs-many
  question does not yet have. [inferred]

## Could not obtain

- No published study compares long-lived, persistent seats (sessions resumed for weeks, with a shared written
  record) against fresh subagents or one long-context agent. Everything above is per-task. [inferred, from the
  sources read]
- No public numbers for Anthropic's 90.2% eval (internal); no numbers at all in Cognition's post. [read]
- No headline correct-to-incorrect rate extracted from Wynn et al. (figures only in the converted text). [read]
- Gao et al. 2505.18286 read at abstract only. [summary]
- No source found on second-reader catch rates for LLM code review across vendors at matched cost. Not searched with
  a search engine; candidates came from known literature, so the list may miss 2026 work. [inferred]
- Earlier versions of 2512.08296 may report different configuration counts; only v3 was read. [inferred]

## Sources fetched (all curl, public URLs, no room text sent)

arXiv PDFs: 2503.13657, 2512.08296, 2506.07962, 2502.04313, 2404.13076, 2305.14325, 2402.18272, 2311.17371,
2508.17536, 2509.05396, 2310.01798, 2402.05120, 2502.00674, 2406.02818, 2505.00212, 2505.18286.
Web: anthropic.com/engineering/multi-agent-research-system; cognition.ai/blog/dont-build-multi-agents;
research.trychroma.com/context-rot.

## Second reader

Adversarial second read, 2026-11-13. Read-only except this file. Every source re-downloaded with curl into a fresh
scratch folder (16 arXiv PDFs through pdftotext; the Anthropic, Cognition and Chroma pages stripped to text with a
short node script) and read there. None of the first reader's downloads were reused.

**Checked and holding (opened myself, number by number).** [read] for each, at the place given above unless noted.
- Local: SPINE `:29-41` (Chen items at :33-37, caveats to :44) and `:51` (the 45/45 row); `claim_base_rate_priors`
  `:114-115` (MAST as nearest source); `openrig_against_consonance` `:38` (non-Claude seat); `journal/2026-08-11.md`
  `:90-93` (45/45, 8/1/2 of 11, ~18%: 2/11 = 18.2%); `the_retrieval_problem_outside.md` §4 carries
  lost-in-the-middle (:171), §5 carries CRM and checklists (:195-198) and Fagan inspection (:200).
- Anthropic: 4x and 15x; 90.2%; 80% and 95% on BrowseComp; "not a good fit"; 50 subagents; "duplicate work, leave
  gaps"; the Appendix "game of telephone" line; published Jun 13 2025.
- Kim et al. 2512.08296v3 (8 Apr 2026): 58 / 263 / 285 / 515% and 1.6-6.2x (§4 text, Table 5 cited); matched compute
  (§1); beta -0.236, p 0.004, 45%; +80.8% to -70.0%; -39% to -70%; 260 configurations, six benchmarks, three LLM
  families; 87%; R^2 0.373; 17.2x vs 4.4x; the PlanCraft "redundant, since state is visible to all" trace.
- MAST 2503.13657v3: 1,642 traces, 7 frameworks, 41% to 86.7%, kappa 0.88. Category sums recomputed from Figure 1:
  11.8+1.5+15.7+2.8+12.4 = 44.2; 2.2+6.8+7.4+0.8+1.9+13.2 = 32.3; 6.2+8.2+9.1 = 23.5. +15.6% and the "superficial
  checks" sentence are in §4 Insight 3; "best-of-N" in §1.
- Zhang et al. 2505.00212: 53.5% and 14.2%. Kim, Garg et al. 2506.07962: 60%, 1/3, similar sizes named (§1).
  Goel et al. 2502.04313: r = 0.84 (§3 Q1), Table 2 in Q2, "more different" (Figure 1 caption).
- Du et al. 2305.14325: Table 1, 67.0 to 81.8 and 77.0 to 85.0, 3 agents and two rounds; both limitation quotes.
  Note: the same Table 1 carries a majority-vote row (69.0, 81.0) that debate beats; it bears on §4 point 3.
- Self-MoA 2502.00674: 6.6% and 3.8%. Chain of Agents 2406.02818: "up to 10%". Li et al. 2402.05120: ensemble 15,
  13B comparable to 70B (Figure 1 caption). Huang 2310.01798, Choi 2508.17536, Smit 2311.17371, Wang 2402.18272,
  Panickssery 2404.13076, Wynn 2509.05396: every quote found as given; author names match the title pages.
- Gao 2505.18286: abstract matches; the first reader's [summary] mark is correct by this file's own definition.
- Cognition: both principle quotes, "single-threaded linear agent", compression model for long tasks, no
  percentages anywhere in the text (count 0).

**Struck (5) and one disambiguation.** Cost of each: not recorded.
1. §1 Anthropic: "not published" marked [read]; the page does not say it. Now [inferred].
2. §1 MAST: the quote ends "individual agents", not models; its place is §5.3, not §1 or the conclusion.
3. §2 Chroma: "not peer reviewed" marked [read]; the page shows only a techreport citation. Now [inferred].
4. §4 point 1: "gains only on decomposable tasks" overstates Kim et al.; they report +9.2% on web navigation and
   marginal gains on two more benchmarks.
5. §5 first bullet: the two outside sources are about DIFFERENT models, not same-model agreement. The inference that
   the room's 45/45 resembles them still stands as an inference, but the room's case (one substrate) is the one
   neither paper measures; by Kim, Garg et al.'s own factor list (shared provider, architecture, size raise agreement)
   the same-model rate would be expected higher than 60%. [inferred]
- Disambiguation, not a strike: 349 models / 12,032 items is the HuggingFace set; HELM is 71 / 14,042.

**Could not check.** Chen et al. 2604.18005 (held, not re-fetched). Kim et al. Table 5 cells themselves (pdftotext
scrambles the table; the four overhead figures were checked in the §4 running text instead). Earlier versions of
2512.08296. Wynn et al.'s flip rates (in figures only, as the first reader said). Whether a search engine would turn
up 2026 work the list misses: no search was run here either.
