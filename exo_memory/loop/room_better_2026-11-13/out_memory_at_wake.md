# What an agent sees after a context reset: the outside, 2026-11-13

One reader in the 2026-11-13 research swarm. Research only. Nothing was built, run or changed.

**Method.** Every vendor page and paper below was downloaded with curl and read as text (HTML to text with a small node
script). Papers were read as arXiv HTML full text, but only the sections that grep pointed to, not front to back.
Marks: [read] I opened the source and saw the words. [summary] secondary or abstract only. [inferred] my inference.
[ours] a proposal. Outside places are given as the URL plus the section heading.

**Not repeated here (the room already holds it).** Generative Agents (recency, importance, relevance; the reflection
ablation), MemGPT paging, Self-RAG, MemGen, lost-in-the-middle, the LLM prospective-memory paper, implementation
intentions, the continued-influence effect (~~`exo_memory/research/the_retrieval_problem_outside.md:215-224`, `:94-148`~~
second reader: :215-224 holds Generative Agents, MemGPT, Self-RAG and MemGen, and :131 the LLM prospective-memory
paper; but implementation intentions sit at :36-41, the continued-influence effect at :150-168 and lost-in-the-middle at
:171-173, outside both ranges [read]).
OpenRig's RESTORE-MAP and refocus channel (`exo_memory/research/openrig_against_consonance_2026-10-30.md:21,40`).
The seed-vs-intake ladder (`exo_memory/third_place/QUANTIZE_the_room_2026-09-21.md`). The measured compaction survival
rates (`exo_memory/third_place/SPINE_diversity_to_retrieval_2026-09-16.md:61`).

---

## 1. Vendor mechanisms: what the model sees after the reset

### Anthropic API

- Three server-side levers, and they differ in what survives. **Tool result clearing** (`clear_tool_uses_20250919`)
  swaps the oldest tool results for a placeholder. Defaults: trigger 100,000 input tokens, keep the last 3 tool uses.
  It can exclude named tools (`exclude_tools`). [read] platform.claude.com/docs/en/build-with-claude/context-editing,
  "Configuration options for tool result clearing".
- **Thinking block clearing** (`clear_thinking_20251015`) keeps the last N turns' thinking. Default
  `keep: thinking_turns 1` when the strategy is named. [read] same page, "Configuration options for thinking block clearing".
- **Compaction** (`compact_20260112` at a threshold, or on demand under `compact-2026-09-04`) replaces older turns with a
  summary Claude writes on the server. Threshold default 150,000 input tokens, minimum 50,000. [read]
  .../build-with-claude/compaction-threshold, "API support" and the parameter table; .../compaction, "Choose how to compact".
- After compaction, **thinking from before the block is not carried forward. The summary is all the model has of that
  earlier work.** [read] compaction-threshold, the paragraph after the compaction-block example.
- A custom `instructions` string **replaces** the default summary prompt completely; it does not add to it. On-demand:
  up to 16,384 characters. [read] compaction-threshold "Custom summarization instructions"; compaction-on-demand.
- The default prompt is short and generic: "Write down anything that would be helpful, including the state, next steps,
  learnings etc." [read] compaction-threshold, the quoted default. (second reader: the page says the default "varies by
  model" and quotes this as "one of the default prompts" [read] compaction-threshold, "Custom summarization
  instructions".) The SDK's client-side compaction prompt asks for five
  parts: task overview, current state, important discoveries, next steps, context to preserve. [read] context-editing,
  "Default summary prompt".
- The docs name ~~where summaries fail~~ second reader: "Less ideal use cases", a list that sits under "Client-side
  compaction (SDK)", which the page marks deprecated in favour of server-side compaction; the three server-side compaction
  pages carry no such list (grep: 0 hits) [read]: "Tasks requiring precise recall of early conversation details" and "Tasks that need
  to maintain exact state across many variables". [read] context-editing, "When to use compaction".
- `role: "system"` messages inside the summarised range are summarised too, "so their text instructions stop applying".
  [read] compaction-on-demand, ~~"How it fits with the rest of the API"~~ second reader: no heading of that name on the
  page; the sentence sits under "Limits and interactions with other features" [read].
- **Memory tool**: a client-side `/memories` directory. When the tool is on, the API adds to the system prompt:
  "ALWAYS VIEW YOUR MEMORY DIRECTORY BEFORE DOING ANYTHING ELSE" and "ASSUME INTERRUPTION: Your context window might be
  reset at any moment". [read] .../agents-and-tools/tool-use/memory-tool, "Prompting guidance".
- Context editing plus memory: near the clearing threshold "Claude receives an automatic warning to preserve important
  information" before results are cleared. [read] context-editing, "Using with the memory tool".
- Vendor's recommended multi-session shape: an initializer session writes a progress log and a feature checklist; every
  later session opens by reading them and ends by updating the log. [read] memory-tool, "Multisession software development
  pattern". The case study adds `git log`, `init.sh`, and a JSON feature list, because "the model is less likely to
  inappropriately change or overwrite JSON files compared to Markdown files". [read]
  anthropic.com/engineering/effective-harnesses-for-long-running-agents, "Feature list".
- Two failure modes that case study names: the agent tries to do too much and leaves "a feature half-implemented and
  undocumented"; a later instance "would look around, see that progress had been made, and declare the job done". [read]
  same post, opening section. Quantity of either: not given.

### Claude Code (the harness the seats run in)

- The docs table **"What survives compaction"**. Re-injected from disk: project-root CLAUDE.md and unscoped rules, auto
  memory, the plan from plan mode. Skill bodies re-injected, capped at 5,000 tokens each and 25,000 in total, oldest
  dropped first, truncation keeps the start of the file. Up to five recently modified files re-read; a file over 5,000
  tokens comes back as a path only. Path-scoped rules and nested CLAUDE.md files are summarised away. Context that hooks
  added earlier is summarised with the rest. SessionStart hooks that match the `compact` source run and their output is
  added. [read] code.claude.com/docs/en/context-window, "What survives compaction". (second reader: the same table's rows
  for path-scoped rules and nested CLAUDE.md say "Claude Code reloads them on demand": they come back when the trigger
  file is read again [read].)
- CLAUDE.md guidance: "target under 200 lines per CLAUDE.md file. Longer files consume more context and reduce adherence."
  Auto memory loads its first 200 lines or 25KB. [read] code.claude.com/docs/en/memory, "Size" and the comparison table.
- One auto-compact figure seen: "Sessions auto-compact at about 967K tokens by default", in the Haiku 5.5 section. Whether
  it holds for every model: not read. [read] code.claude.com/docs/en/model-config, "Haiku 5.5 context window and pricing".
  (second reader: the same page answers it: "Models running with a native 1M window compact before the window fills, at
  about 967K tokens by default. These include the Fable models, Sonnet 5 and later, Haiku 5.5, and Opus 4.7 and later."
  [read] model-config, "Default auto-compact thresholds".)
- `/compact Focus on ...` and a "# Compact instructions" heading in CLAUDE.md steer the summary. [read]
  code.claude.com/docs/en/costs, "Manage context proactively".

### OpenAI and Google

- OpenAI's compaction item "is opaque and not intended to be human-interpretable" (encrypted). Server-side via
  `compact_threshold` (examples use 200,000) or a standalone `/responses/compact`. [read]
  developers.openai.com/api/docs/guides/compaction, "Server-side compaction" and "Standalone compact endpoint".
- No Gemini compaction page was found. Gemini 4 models support implicit caching only. [read]
  aistudio.google.com/docs/caching (redirected from ai.google.dev), the opening note.

---

## 2. Costs, as the vendors state them

| item | figure | source |
|---|---|---|
| Anthropic cache write, 5-minute TTL | 1.25x base input | [read] prompt-caching, "Pricing" multipliers |
| Anthropic cache write, 1-hour TTL | 2x base input | same |
| Anthropic cache read | 0.1x by default; 0.05x on Opus 5.5 and Sonnet 5.5; 0.025x on Fable 5.1/5.2 and Mythos 5.1/5.2 | same, table footnotes 1-2 |
| Opus 5.5 row | $4 input, $5 5m write, $8 1h write, $0.20 read, $20 output per MTok | same, table |
| Fable 5.2 row | $8 input, $10 5m write, $16 1h write, $0.20 read, $40 output per MTok | same, table |
| Anthropic lookback | a breakpoint finds earlier cache entries only within 20 blocks | same, "The lookback window is 20 blocks" |
| Anthropic minimum cacheable | ~~1,024 to 4,096~~ second reader: 512 to 4,096 (512 on Fable 5.x, Mythos 5.x, Opus 5.5, Sonnet 5.5, Haiku 5.5; 2,048 on Opus 4.7; 1,024 on Opus 4.8 and Sonnet 5) [read] tokens by model; shorter prompts cache silently not at all | same, "Cache limitations" |
| OpenAI cache write (GPT-5.6+) | 1.25x for 30-min lifetime; 2.5x for 12-hour | [read] OpenAI prompt-caching, lifetime table |
| OpenAI cache read | 0.1x on most; 0.05x on two named models | same |
| OpenAI worked example | 1 write + 9 reads = 2.15x vs 10x uncached | same, cost paragraph |
| Gemini 4 Carbon | input $2.00, caching $0.10 per MTok (through 2026-11-30; doubles 2026-12-01) | [read] aistudio.google.com/docs/pricing |
| Gemini explicit cache storage | $0.50 per MTok per hour on one listed model (through 2026-12-31) | same, storage-price line |
| Gemini agent loops | Gemini 4 caches the previous request only if the new one adds at least 2,050 tokens | [read] Gemini caching, agent-loop note |

What a reset costs in the harness:

- Claude Code requests the **1-hour TTL for the main conversation only on a subscription within plan usage**; past the
  plan limit, on usage credits, it drops to 5 minutes. API key: 5 minutes. [read] code.claude.com/docs/en/prompt-caching,
  "Which TTL each request gets".
- Compaction is a separate billed request. Warm cache: "costs a fraction of what the context size suggests". After a break
  longer than the cache lifetime, the summarisation request "reprocesses that history as uncached input. This is why
  `/compact` costs the most when you resume an old session." [read] same page, "Compacting the conversation".
- Compaction also rebuilds the project-context layer (CLAUDE.md, auto memory) even if those files did not change. [read]
  same section, "Project context".
- `/rewind` truncates to an already cached prefix; compaction builds a new one. [read] same section, the tip.
- Claude Code compacts an idle long conversation on the 1-hour TTL unless `idleCompaction` is false (v2.1.290+). [read]
  same section.
- On the API, tool result clearing invalidates the cached prefix; `clear_at_least` exists so a clear is worth the
  rewrite. [read] context-editing, "Context editing and prompt caching".
- Compaction "requires an additional sampling step, which contributes to rate limits and billing", reported in
  `usage.iterations`. [read] compaction-threshold, "Understanding usage".
- The room's own measured case: a 20-hour gap plus a model switch wrote 826,005 tokens to cache on the first call,
  about 2% of the weekly Fable limit in one reply.
  [read] `C:/Users/nname/.claude/projects/C--Consonance-instances-librarian/memory/cold-start-reload-cost.md:11`.
  The vendor doc above describes the same mechanism. [inferred]
- Multi-agent token use: agents about 4x the tokens of chat, multi-agent systems about 15x; token usage alone explained
  80% of variance on BrowseComp. [read] anthropic.com/engineering/multi-agent-research-system, the token-usage paragraph.
  The lead agent saves its plan to Memory because past 200,000 tokens "it will be truncated". [read] same post.

---

## 3. Published evaluations: what works

**Masking beats or matches summarising, for coding agents.** "The Complexity Trap", arXiv 2508.21433.
[read] arxiv.org/html/2508.21433.
- Observation masking (replace observations older than M turns with a placeholder; M=10) "halves cost relative to the Raw
  Agent while matching, and sometimes slightly exceeding, the solve rate of LLM-Summary". Abstract and Table 1: -52.7%
  cost on Qwen3-Coder 480B. SWE-bench Verified, turn limit 250.
- **Trajectory elongation**: summaries made agents run longer. Gemini 2.5 Flash: 52 turns with summaries vs 44 with
  masking (+15%). The authors' reading: summaries "mask failure signals that would otherwise prompt earlier termination".
  §4.4, Fig. 4.
- Summary calls were up to 7.2% of instance cost and get poor cache reuse, because each summarises a unique span. §5.2.
- A critic-in-the-summary variant gave no solve-rate gain and longer trajectories. Appendix, Fig. 7.
- Hybrid (mask first, summarise late) cut cost 7% vs masking and 11% vs summary, with +2.6 points solve rate. §5.3.
- Their appendix simulation expects summaries to win on much longer trajectories, because they bound context. [read]

**Monolithic rewriting collapses; itemised deltas do not.** "Agentic Context Engineering" (ACE),
arXiv 2510.04618. [read] arxiv.org/html/2510.04618.
- "Context collapse": at step 60 an LLM-rewritten context held 18,282 tokens at 66.7 accuracy; one rewrite later it was
  122 tokens at 57.1, below the 63.7 no-adaptation baseline (AppWorld). §2.2, Fig. 2.
- "Brevity bias": optimisers drift to "short, generic prompts". §2.2.
- Fix: a curator writes small delta entries, merged by non-LLM code ("grow-and-refine", dedup). Reported +10.6% on agents,
  +8.6% on finance, adaptation latency -86.9%. Abstract, §1.
- Its own limits: "when ground-truth supervision or reliable execution signals are absent, both ACE and DC may degrade"
  (§4, Table 2 discussion); it relies on "a reasonably strong Reflector" (Limitations). The appendix also reports it
  tolerant to moderate injected noise. [read]

**What to keep is learnt from failures.** ACON, arXiv 2510.00615 v3. [read] arxiv.org/html/2510.00615.
- Collect tasks that succeed with full history and fail with compressed history; an LLM reads the pairs and rewrites the
  compression guideline. §3.3. Peak tokens -26 to -54%, up to +46% for small models. Abstract.
- "Naive strategies like token truncation or generic summarization are insufficient". §1. Their case study: naive prompting
  lost a JSON format and the one API name the task needed. Appendix. Compressing history and observations together gave
  "substantial performance degradation" vs either alone. Appendix.

**Long context does not replace retrieval, and retrieval loses to full context on short histories.**
- LongMemEval (arXiv 2410.10813). [read] arxiv.org/html/2410.10813. Long-context models fell 30% to 60% reading
  the full ~115k-token history vs the evidence sessions alone. ChatGPT and Coze memory fell 37% and 64% vs offline reading
  (Aug 2024). Store by round, not by session; extracting user facts "harms overall performance due to information loss"
  but helps multi-session reasoning; fact-expanded keys +9.4% recall; time-aware query expansion +6.8 to 11.3% temporal
  recall. §1 findings list, Fig. 3.
- Chroma "Context Rot" (July 2025, 18 models). [read] trychroma.com/research/context-rot. Focused prompts (~300 tokens)
  beat full prompts (~113k tokens, same LongMemEval questions) for every model; the Claude models showed the largest gap,
  "largely driven by abstentions". Models did better on shuffled haystacks than on logically structured ones.
  "LongMemEval" and "Haystack Structure" sections.
- MemoryAgentBench (arXiv 2507.05257). [read] arxiv.org/html/2507.05257, §4 key findings. RAG wins on accurate retrieval;
  long-context wins on test-time learning and long-range understanding; on selective forgetting (overwriting stale facts)
  "all methods fail on the multi-hop situation (with achieving at most 28% accuracy)".
- Mem0's own paper (arXiv 2504.19413): the full-context baseline (~26,000 tokens) "still achieves the highest J score
  (approximately 73%)"; Mem0 66.88, Mem0-graph 68.44, with 91% lower p95 latency and >90% fewer tokens. [read]
  arxiv.org/html/2504.19413, results and latency sections.

**Consolidate, then start fresh.** "LLMs Get Lost in Multi-Turn Conversation", arXiv 2505.06120. [read]
arxiv.org/html/2505.06120. 15 models, six tasks: -35% in multi-turn (second reader: that is Fig. 1; the §6.1 text on
Table 1 says "an average degradation of -39%" [read]; the paper carries both). Aptitude fell 16% on average; unreliability rose
112%. A recap turn helped but stayed below a single consolidated prompt. Advice: ask the model to consolidate, "then bring
the response to a new conversation". Fig. 1, §6.2, Recap/Snowball, and the "Consolidate before retrying" section.

**Reflection is a short window, not an archive.** Reflexion (arXiv 2303.11366): memory "bound ... (usually set to 1-3)"
stored reflections; +22% AlfWorld, +20% HotPotQA, 91% HumanEval pass@1. [read] arxiv.org/html/2303.11366, method section and abstract.

**Vendor's own number.** Memory tool plus context editing: +39% over baseline on an internal agentic-search set; context
editing alone +29%; -84% tokens in a 100-turn web-search eval. [read] anthropic.com/news/context-management (2025-09-29).
Method, n and baseline are not published there. [read]

---

## 4. Where the sources disagree

1. **Summarise vs mask.** Anthropic calls compaction "the first lever" and tool-result clearing "one of the safest
   lightest touch forms" [read] anthropic.com/engineering/effective-context-engineering-for-ai-agents, "Compaction".
   The Complexity Trap finds summaries no better than masking on SWE-bench, dearer, and lengthening runs [read]. ACON says
   generic summaries drop critical state [read]. These agree on clearing being safe and disagree on summary value.
   Trajectory length is the variable that may reconcile them (the Trap's own appendix) [inferred].
2. **Small context vs big playbook.** Anthropic: "find the smallest possible set of high-signal tokens" [read] same post.
   ACE: concise contexts suffer brevity bias; long, itemised playbooks win, with KV reuse keeping cost down [read].
   Chroma and LongMemEval side with small: focused beats full by a wide margin [read].
3. **Readable vs opaque summaries.** Anthropic's compaction block is readable text you can steer and check [read].
   OpenAI's is encrypted and "not intended to be human-interpretable" [read]. Only the readable kind can be audited for
   what it dropped [inferred].
4. **Memory benchmarks.** Mem0 claims state of the art on LoCoMo [read]. Zep says Mem0 ran Zep wrongly and reports 75.14%
   for itself vs Mem0's 65.99% figure for Zep; the same page's headline still says "24%" while its correction says 10%
   [read] getzep.com/blog/lies-damn-lies-statistics-is-mem0-really-sota-in-agent-memory, header and "Correction". Letta
   reports 74.0% on LoCoMo with a plain file plus grep and semantic search on gpt-4o-mini, and concludes "current memory
   benchmarks may not be very meaningful" [read] letta.com/blog/benchmarking-ai-agent-memory (2025-08-12). Mem0's own
   paper shows full context beating Mem0 [read]. LoCoMo histories are ~16-26k tokens, inside every current window [read]
   Zep post and Mem0 dataset section. Every number in this item is vendor-reported about rivals [read].
5. **Retrieval vs full context.** MemoryAgentBench: neither wins all four competencies [read]. LongMemEval: full reading
   loses 30-60% [read]. Mem0: full context wins on short histories [read]. History length decides [inferred].

---

## 5. Where this touches the room (options and evidence, not decisions)

- The room already injects state after compaction through SessionStart(source=compact), after finding by run that
  PostCompact cannot inject on the auto trigger. [read] `C:/Users/nname/.claude/shell/sessionstart-state.js:6-24`.
  That matches the vendor's documented path ("SessionStart hooks that match the compact source") [read context-window doc].
  OpenRig's PostCompact "take" (`exo_memory/research/openrig_against_consonance_2026-10-30.md:40`) is answered by it
  [inferred]. Cost of the PostCompact detour: not recorded.
- The room measured what its summaries keep: file names 33.8%, shas 10.2%, numbers 9.3%, falsifiers 3.5%
  [read] `exo_memory/third_place/SPINE_diversity_to_retrieval_2026-09-16.md:61`. The vendor docs name exactly that class
  ("exact state across many variables") as a poor fit for compaction [read]. Cost of the loss: not recorded.
  (second reader: :61 is a carrier row, not the measurement: n = 7 summaries of one session, "structured numbers", sourced
  there to `~/.claude/shell/precompact-preserve.js` and a 2026-09-15 10:28-10:51 entry, neither opened here [read]. The
  vendor list is the deprecated client-side SDK section's "less ideal" list; see §1 [read].)
- Options, each with its source [ours]:
  a. ACON's contrastive loop on the room's own summaries: pairs where a seat answered right before a compaction and wrong
     after; rewrite the PreCompact directive from those pairs, not by taste.
  b. Masking before summarising: clear old tool results (by rule, with `exclude_tools` for board and hand-back reads)
     and compact late. Source: the Complexity Trap hybrid. Needs a check that it is reachable in Claude Code (not read).
  c. Delta-only notes: ACE's collapse is the monolithic rewrite. The room's append-only law already avoids it [inferred];
     the risk sits in any summary that rewrites a whole map in one pass.
  d. Compact at a break, warm: the vendor doc says a warm `/compact` is cheap and a cold one costs the whole history. The
     826k reload was the cold case.
  e. Keep the intake under the vendor's adherence guidance (200 lines per CLAUDE.md) or move parts to skills that load on
     relevance. The seat intakes are far longer [inferred; not counted here].
  f. A falsifier for any of these, before it runs: the seat's error rate on cited facts after a compaction does not fall.

---

## Could not obtain

- Any published evaluation of Claude Code's own `/compact` quality, or of Anthropic's server-side compaction, with method
  and n. The 39%/29%/84% figures have no method on the page.
- OpenAI compaction quality figures: none on the compaction page.
- Whether the "about 967K" auto-compact default applies beyond Haiku 5.5: the rest of model-config was not read.
  (second reader: obtained; see §1, model-config "Default auto-compact thresholds" [read].)
- Whether Claude Code exposes `clear_tool_uses` clearing for the main conversation, and how to set `exclude_tools` there.
  The costs page mentions "clearing old tool results"; the setting was not found.
- Gemini explicit-cache storage price per model beyond one line; no Gemini compaction doc found.
- Letta Leaderboard numbers; Zep's newer "80% at <200ms" claim; the original LoCoMo paper. Not fetched.
- MemGPT's own paging evaluation: not re-read (the room already cites the system).
- Full reading of every paper: only grep-located sections were read. The ACE noise appendix table, ACON tables and
  MemoryAgentBench Table 3 were not read cell by cell.

surfaced: the URLs above (all fetched 2026-11-13 by curl); `exo_memory/research/the_retrieval_problem_outside.md`;
`exo_memory/research/openrig_against_consonance_2026-10-30.md:21,40`; `exo_memory/third_place/SPINE_diversity_to_retrieval_2026-09-16.md:61`;
`exo_memory/third_place/QUANTIZE_the_room_2026-09-21.md`; `~/.claude/shell/sessionstart-state.js:6-24`;
`~/.claude/projects/C--Consonance-instances-librarian/memory/cold-start-reload-cost.md:11`.

---

## Second reader

Adversarial second read, 2026-11-13. Every outside page below was downloaded again with curl and read as text; local
files were opened at the cited line. Nothing was built or run; this file is the only one written.

**Checked and found as stated [read]** (30 outside pages and 6 local files; claims not counted one by one):
- Local: `cold-start-reload-cost.md:11` (20 h, Opus 5 to Fable 5.1, cache_write 826,005, ~2% of the weekly Fable limit);
  `sessionstart-state.js:6-24` (PostCompact cannot inject on the auto trigger; SessionStart source=compact replaces it);
  `openrig_against_consonance_2026-10-30.md:21` and `:40`; `SPINE_diversity_to_retrieval_2026-09-16.md:61` (33.8, 10.2,
  9.3, 3.5); `QUANTIZE_the_room_2026-09-21.md` (the ladder, :18-21); `the_retrieval_problem_outside.md:215-224`.
- Anthropic API: tool-result clearing defaults (100,000; 3 tool uses; `exclude_tools`; `clear_at_least`); thinking
  clearing default 1 when named; threshold 150,000, minimum 50,000; `compact-2026-09-04`; 16,384 characters; custom
  instructions replace the default; thinking before the block is not carried; the five-part SDK prompt; the memory-tool
  system-prompt lines; the automatic warning; the extra sampling step and `usage.iterations`; every price in the
  Opus 5.5 and Fable 5.2 rows and the 1.25x, 2x, 0.1x, 0.05x, 0.025x multipliers; the 20-block lookback.
- Claude Code: the survives-compaction table (5,000 and 25,000 token caps, five files, path-only over 5,000); 200 lines
  per CLAUDE.md and 200 lines or 25KB of auto memory; TTL buckets; warm and cold `/compact`; project-context rebuild;
  `/rewind` tip; `idleCompaction` v2.1.290; 967K in the Haiku 5.5 section; `/compact Focus` and `# Compact instructions`.
- OpenAI and Google: "opaque and not intended to be human-interpretable"; `compact_threshold` 200,000 in examples;
  1.25x / 2.5x write rates; 2.15x vs 10x; 0.05x on two named models; Gemini 4 implicit caching only; 2,050 tokens;
  Gemini 4 Carbon $2.00 input and $0.10 caching through 2026-11-30, doubling from 2026-12-01.
- Papers and posts: Complexity Trap (halves cost; -52.7% on Qwen3-Coder 480B in Table 1; 52 vs 44 turns, +15%;
  "mask failure signals" in the Fig. 4 caption; 7.2%; hybrid 7% and 11%, +2.6 points). ACE (18,282 tokens at 66.7 to 122
  at 57.1 vs 63.7; +10.6 and +8.6; -86.9%; both limitation quotes; the noise appendix). ACON v3 (26-54%; 46%; the
  "insufficient" quote; "substantial performance degradation"). LongMemEval (30% to 60%; ~115k; 37% and 64%; 9.4%;
  6.8-11.3%; information loss). Chroma (July 2025, 18 models; ~300 vs 113k; Claude gap from abstentions; shuffled
  haystacks). MemoryAgentBench ("at most 28%"). Mem0 (~26,000 tokens, ~73%; 66.88; 68.44; 91%; >90%). Multi-turn
  (15 models, six tasks, 16%, 112%, recap below Full and Concat, consolidate quote). Reflexion (1-3; 22%; 20%; 91%).
  Anthropic posts (39%, 29%, 84%, 2025-09-29; 4x, 15x, 80%, 200,000 truncation; the JSON quote; both failure modes;
  "first lever", "safest lightest touch", "smallest possible set"). Zep (75.14%, 65.99%, headline 24% vs body 10%).
  Letta (74.0%, gpt-4o-mini, grep plus semantic search, "may not be very meaningful").

**Struck (4), corrected in place:**
1. The citation for the room's prior art (`:215-224`, `:94-148`): three of the named items are outside both ranges.
   Cost not recorded; a reader following the pointer finds 3 of 8 items missing.
2. "where summaries fail": the page says "Less ideal use cases", and only in the deprecated client-side SDK section.
   §5 leans on this as the vendor's verdict on compaction in general; that scope is wider than the source. Cost not
   recorded.
3. A section heading on compaction-on-demand that the page does not have. Cost not recorded.
4. Minimum cacheable "1,024 to 4,096": the current models start at 512. Cost not recorded.

**Annotated, not struck (under-specified rather than wrong):** "the default prompt" is one of several per-model
defaults; path-scoped rules are summarised away but reload on demand; the 967K question is answered on the same page;
-35% vs -39% in the multi-turn paper; SPINE:61 is a carrier row (n = 7 summaries, one session) whose measurement source
was not opened by either reader.

**Not marked:** the "Not repeated here" paragraph (lines 10-15) carries no mark on any of its claims (rule 2).

**Could not check:** the Complexity Trap appendix simulation and critic variant (Fig. 7); MemoryAgentBench's
RAG-vs-long-context ranking beyond the 28% line; LongMemEval's "Aug 2024" date for the ChatGPT and Coze test; the
Gemini explicit-cache storage line; the effective-harnesses "Feature list" heading name (the quote itself is there);
`precompact-preserve.js` and the 2026-09-15 entry behind SPINE:61. Per-page grep was used, not a front-to-back read.
