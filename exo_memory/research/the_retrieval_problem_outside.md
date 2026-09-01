# The retrieval problem, researched from outside — what has already been found, and what it changes here

**Written 2026-08-30 ~05:10 by the librarian (Anamnesis), at the keeper's ask:** *"have we ever once
stopped and researched if a solution was ever found vs trying to find it ourselves?"* Checked first:
`exo_memory/research/` held one file (felt-knowing); a grep over the corpus for prospective memory,
implementation intentions, Self-RAG, MemGPT, Generative Agents, Zettelkasten, checklists or CRM returned
**zero** hits. The room re-derived every mechanism below by hand, at cost, over ten weeks. **This is the
first outside tether the retrieval line has had.** First pass: nine web searches, two papers fetched,
no source read in full except the two abstracts. Tags as in `the_pattern_in_felt_knowing.md`:
ESTABLISHED / CONTESTED / SPECULATIVE; preprints default to CONTESTED.

**The room's problem, stated so the research answers it and not a generic one:** a seat holding the
entire corpus fails to retrieve the right instrument at the moment it applies; the failure has two
halves — (A) THE REACH DOES NOT FIRE (the moment of need never presents as a claim; `journal/2026-08-16.md`),
and (B) THE REACH GRABS THE WRONG HANDLE (the crude quotable form outcompetes the correction filed
beside it; `librarian/2026-08-29.md` L013). Every catch in the record came from a second seat, after
delivery. The keeper's standard: the room must do it without him.

---

## 1 · Half A has a name: PROSPECTIVE MEMORY, and its lever is the cue, not the intention

- **Prospective memory** — remembering to perform an intended action at the right future moment — is a
  distinct field, and its failures rise with cognitive load and time pressure. [ESTABLISHED]
  ([BMC Psychology 2026](https://link.springer.com/article/10.1186/s40359-026-04117-0);
  [Current Psychology 2023](https://link.springer.com/article/10.1007/s12144-023-04240-w))
- **Cue salience is the lever, and it matters most under high workload** — measured in aviation, where
  the failures kill: increasing the salience of memory cues benefits most under high-workload conditions.
  [ESTABLISHED, aviation] ([Dismukes et al., Aerospace Medicine and Human Performance 86(4)](https://pubmed.ncbi.nlm.nih.gov/25945553/))
- **Focal vs nonfocal cues — the multiprocess theory (McDaniel & Einstein):** a FOCAL cue is one the
  ongoing task already processes; retrieval is then *spontaneous* and costs no monitoring. A NONFOCAL cue
  sits outside the ongoing task's processing; retrieval then requires *strategic monitoring*, which costs
  attention and fails under load. Monitoring near the target lifts nonfocal performance a lot and focal
  performance not at all. [ESTABLISHED, human] ([Scullin, McDaniel et al., PMC2864946](https://pmc.ncbi.nlm.nih.gov/articles/PMC2864946/);
  [Einstein & McDaniel 2005](https://journals.sagepub.com/doi/10.1111/j.0963-7214.2005.00382.x))
- **Implementation intentions** — if-then plans ("if situation X, then I do Y") — roughly double the
  rate at which an intended behaviour happens: **d = 0.65 on goal attainment across 94 studies, >8,000
  participants; d = 0.77 against derailment**; robust to publication-bias adjustment; larger when the plan
  is contingent in form, the goal is motivated, and the plan was rehearsed at least once. [ESTABLISHED,
  human] ([Gollwitzer & Sheeran 2006](https://www.sciencedirect.com/science/chapter/bookseries/abs/pii/S0065260106380021);
  [642-test meta-analysis 2024](https://www.researchgate.net/publication/378870694_The_When_and_How_of_Planning_Meta-Analysis_of_the_Scope_and_Components_of_Implementation_Intentions_in_642_Tests))

> **CORRECTION, 2026-09-01 — placed ABOVE the paragraph it corrects, because this room measured that a
> correction filed below loses to the line it corrects (the withdrawn "decorrelated reader" wording still
> outnumbers its replacement "least-correlated reader" **22 to 10** across this repo's `.md` files (this
> correction excluded) sixteen
> days after the 2026-08-16 withdrawal — `grep -rio 'decorrelated reader' --include=*.md .` vs the same for
> the replacement, run 2026-09-01; the chair's brief said 32 to 18, a count this seat could not reproduce
> and does not carry). Written by ALPHA, the seat
> that registered the test whose falsifier fired; read after by a non-author (CHARLIE or ECHO), never by
> the chair or the librarian.** Objects: ECHO's bands `79a369b` (`loop/k1_k2_bands_2026-09-01.md`),
> CHARLIE's read `1830dae` (`loop/cue_transcript_read_2026-09-01.md`, the quotable sentences at
> `:162-196`), and the registration `loop/battery_load_registration_2026-08-31.md` §4–§8 (mine).
>
> **The registered clause that put this here** — §5 P3's falsifier, written before any subject ran: *"If
> that is the result it goes into the research file's §1 as a correction, above the paragraph it
> corrects."* That is the result. The unwelcome outcome, in the words registered to make it true:
> ***"The state-dependent cue at the event did no better than a static line at the end of the prompt. The
> focal/nonfocal story is not what separates the cues that fire in this room from the cues that are
> ignored, and the collation counter's live firing has one confirmed cause fewer."***
>
> **THE RESULT — NO CUE MOVED THE NUMBER.** Violation of the terminal constraint (text > 200 chars after
> the hand-on), fresh `claude -p` subjects under the L1 load: **K0 65.0% (13/20) · K1 trailing reminder
> 72.5% (29/40) · K2 focal cue at the event 82.5% (33/40).** P2 FAILS, P3 FAILS on both parts, P4 clean
> (truth-carry 40/40 in both arms) — **and no pairwise comparison distinguishes the arms from one rate,
> p ≥ 0.20 on all four** (Fisher exact, re-derived by this seat from the counts: K1 v K2 0.422 · K0 v K1
> 0.564 · K0 v K2 0.195 · K0 v pooled cue arms 0.260). The 95% intervals overlap (K1 56–85, K2 67–93,
> K1's contains K0). Every threshold sits 35–55 points from the P2/P3 bar on all four of ECHO's cuts
> (n=40; r35 dropped from both arms; day 1 only; day 2 only), so no cut has to be chosen and none is.
> **Never "the focal cue made it worse."** That was the chair's reading and it treated a 17-point gap at
> n=40 as signal. The carry sentence is the librarian's, kept on one line so a grep finds it whole:
> ***"no cue moved it; the decision precedes every event a cue can ride on."***
> Registered form (§8.2, before results): *neither cue class moves a loaded fresh subject* — never *the
> wording was wrong*.
>
> **THE MECHANISM — CHARLIE, 100 of 100 transcripts, read after the bands so the order stayed the
> blinding.** The outcome is decided when the subject **composes its summary, before any tool event
> exists**: compliant ⇔ the summary block preceded `node handoff.js`, 100/100. The K2 cue arrives as the
> `tool_result` of the hand-on — **after** the subject has already chosen hand-on-first — and by then the
> only act left is the message the cue forbids. *"Nothing after the hand-on"* is not an available
> behaviour in `claude -p`: `end_turn` 100/100, never empty; the floor is a 35–145-char receipt echo. So
> BRAVO's §3.2 defect (`loop/battery_attack_2026-08-31.md` — *a printing cue at PreToolUse cannot
> influence the composition it is commenting on*), which the registration §4 claimed K2 escaped, **generalises:
> no event this harness exposes precedes the composition. That is the wall,** measured rather than argued.
> And the intention was **retrieved, not forgotten**: 60 of 75 violators recited the rule in the sentence
> before the call, 74 of 75 pointed to `REPLY.md` after it. The subject remembered to act, acted, announced
> it, and then produced the trained final message — *the rule is executed as an action order, not a text
> order.* The registration's §7 named this before it happened (item 2: *a mechanism other than
> prospective-memory failure*; item 3: *a subject may not read tool output as instruction* — the one subject
> that engaged the tail, K2_r26, named it as environment-sourced and discounted it).
>
> **A DEFECT IN THE RUN, carried because it is not a footnote:** `handoff.js` **differed** between the K0
> cells (`bbd64e8b…`) and the cue cells (`aee411f1…`), and every subject read it (80/80 `Read` it). The registration's §4
> sentence *"All three arms are identical in brief, cell, items, `handoff.js` refusal behaviour, and receipt
> line"* — mine — is **FALSE across the K0/K seam**. K1-vs-K2 is clean (cells byte-identical, MANIFEST
> 720/720) and null. K0 also ran in a separate session at a different hour, not interleaved with the cue
> arms. The K0-to-cue comparisons above therefore carry a confound the K1–K2 comparison does not.
>
> **What this run does NOT establish, so nobody imports the null whole:** magnitude (n=40/arm; a real +10
> is not excluded, only unevidenced); why some subjects place the summary first (8 said why, 17 just did;
> no prompt, tool-order or tool-count signature separates them — *that trigger is the arm worth
> registering and it is not in this data*); anything about the **seat under live load** — these are fresh
> subjects with one loaded question, and §8.3 registered transfer as a prediction, not a rescue; the human
> literature below, which stands as literature; and the counter's own live firing, which is a fact — only
> its *focal* explanation lost its prospective test. Re-derive — **the bands only run on the machine
> that ran the battery**: the scorer reads the subjects' transcripts from the run's own config dir
> (`rig/score.js:60-81`), which stay outside the repo by design (`p3a` hand-back §5); from that run
> root (`subjects/run2`, beside the checkout): `node rig/score.js` (bands) · `node rig/score.js
> --compare-v1`. The seam runs anywhere from the repo mirror: `diff exo_memory/loop/run2/rig/handoff.v1.js
> exo_memory/loop/run2/rig/handoff.js` (`bbd64e8b…`/`aee411f1…`) · CHARLIE's `RE-DERIVE` block for the transcript counts.

**What this says about the room's instruments, plainly.** `SOURCE.md` is if-then in form — the right
shape — and it measured a 0.8-point reachability gain because its cues are NONFOCAL: they live in a
separate file the working seat is not processing, so they need monitoring, and monitoring is exactly
what fails under load. Run 1's surviving finding (*fresh subjects with one question check 60/60; the
failure lives under load*) is the multiprocess theory's prediction, measured here before anyone knew
the theory. *[2026-09-01: the loaded failure, read in 100 transcripts, is not forgetting — the rule is
recited and then executed as an action order; see the correction above. The load-sensitivity half of this
sentence stands; the prospective-memory reading of it does not.]* The `[pulse]` line is closer to focal (it is in the turn) but constant — see §4. ~~**The
collation counter shipped 08-29 is the room's first FOCAL cue: it is in the line the seat already reads,
it changes with the world, and it fired on its first live run.**~~ *[struck 2026-09-01, kept legible: the counter
DID fire on its first live run — that is a fact and stays. That it fired BECAUSE it is focal was the claim K2
was built to test, and K2 did not confirm it: the focal cue at the event did no better than the trailing line.
The firing has one confirmed cause fewer. Correction above.]* The trigger-index preregistration
(`loop/trigger_index_preregistration.md`, 2026-08-15 — *do situation-keyed chains fire at the moment of
need more than topic-keyed cards?*) was the right registration for this and should be read again
against this literature.

## 2 · Half A in LLMs specifically — the problem is published, the fix is a trailing reminder

- **"Did You Forget What I Asked? Prospective Memory Failures in Large Language Models"** (Mittal,
  arXiv:2603.23530, March 2026): formatting-constraint failures framed as PM; >8,000 prompts, three model
  families, deterministic checkers. **Compliance drops 2–21% under concurrent task load; TERMINAL
  constraints (an action required at the END of the response) drop up to 50%; avoidance constraints stay
  robust; joint compliance collapses as constraints accumulate.** The intervention that worked:
  **"explicit instruction framing plus a trailing reminder" restored 90–100% in many settings.**
  [CONTESTED — preprint, single author; but deterministic scoring and a large n]
  ([arXiv 2603.23530](https://arxiv.org/abs/2603.23530))

**The room measured this before the paper named it.** The turn-boundary rule — *finish your output,
THEN ring* — is a TERMINAL constraint, the worst class in the paper, and the room's own count is
**101 of 103 dispatches violated it (98.1%)** (`loop/turn_boundary_detection_2026-08-25.md`). The paper's
fix class — a trailing reminder at the end of context — is mechanizable in the hook that already runs
every turn, costs nothing, and can be scored against the 98.1% baseline. That is the cheapest registered
experiment available to the retrieval line and nobody had it. *[2026-09-01: not yet run in the hook. Its
nearest test so far is the battery's K1 arm — the rule restated as the last lines of a fresh subject's prompt —
which did not move the rate (72.5% vs K0 65.0%, p = 0.56); different harness, different subject, so this file's
falsifier has NOT fired, but the transfer now has an adverse result beside it. §1 correction.]*

## 3 · Half B has a name too: the CONTINUED INFLUENCE EFFECT — corrections beside a claim do not remove it

- Misinformation persists after correction; a correction works only when it **supplies a replacement**
  that fills the gap in the reader's model — an annotation or warning leaves the coherent-but-wrong model
  standing because people prefer coherent-incorrect to incomplete-correct. **Repeating the misinformation
  during correction strengthens it** (familiarity). [ESTABLISHED, human]
  ([Ecker et al., Psychonomic Bulletin & Review](https://link.springer.com/article/10.3758/s13423-011-0065-1);
  [Frontiers 2024](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1487146/full))
- Retrieval-induced forgetting: retrieving one item inhibits related items; the act of recall itself
  shapes what stays reachable. [ESTABLISHED, human] ([Storm & Levy 2012](https://link.springer.com/article/10.3758/s13421-012-0211-7))

**This is the room's amendment convention, diagnosed from outside.** Appending a dated block BELOW the
crude sentence, quoting it, and leaving it bolded is the CIE worst case on all three counts: no
replacement in the slot, the gap left open, the misinformation repeated. Strike-in-place with the repaired
wording in the handle position is the "alternative explanation" correction the literature says works.
**And a tension the room must name:** maintenance law 2 keeps traces, and the carrier-drift registry
quotes the withdrawn wording to account for it — repetition. Resolution consistent with both: keep the
trace, but never in the handle position, never bold, and always adjacent to its replacement.

## 4 · Why the bold handle wins: it is attention, not virtue

- **Lost in the middle** — LLM retrieval accuracy over long context is U-shaped: high at the beginning
  (primacy, attention sinks) and end (recency), degraded in the middle; architectural (causal attention +
  RoPE distance decay), not motivational. [ESTABLISHED for LLMs]
  ([Liu et al. 2023](https://arxiv.org/pdf/2307.03172); [2510.10276](https://arxiv.org/pdf/2510.10276))
- **The structural attention tax** — retrieval FORMAT captures attention independent of content:
  knowledge-graph triples draw ~0.70 attention/token vs ~0.25 for natural language, compressing
  attention on the task demonstrations by up to 42% even when the retrieved content is noise. But: task-
  matched retrieval beat unaligned retrieval by >30 points, "dwarfing all gating strategies" — **what** is
  retrieved matters more than how it is formatted. [CONTESTED — preprint; 7–8B models]
  ([Zhang & Zhang 2026, arXiv 2606.11198](https://arxiv.org/abs/2606.11198))
- In LLM instruction-following, a "reminder-enhanced format consistently maintains higher compliance
  than natural embedding, with the gap widening as distraction difficulty increases." [CONTESTED —
  preprint, same line as §2]

**Consequences for the shelf and for BOOT.** `BOOT:22` (early, bold) vs `BOOT:127` (a parenthesis, mid-
list): position AND format both favoured the crude handle — L013's "typography is retrieval weight" is a
measured attention effect, not a metaphor. The 800KB shelf puts the record tier in the middle, where
retrieval is structurally worst — which is why indexing it (08-24) cost less than feared. And it says
where the two halves of tonight's plan belong: **foundation first (primacy — the keeper's foundation-up
refactor), the live cue last (recency — the pulse).** Both halves of the day's design have outside
support, from the same effect.

## 5 · The second vantage is the standard error-catcher in every field that kills people when it fails

- **Challenge-response checklists / Crew Resource Management:** the second pilot checks the first;
  known failure — the second person trusts the first and does not check properly; dual checking is "one
  of the last lines of defence." [ESTABLISHED practice] ([SKYbrary](https://skybrary.aero/articles/error-management-oghfa-bn))
- **Surgical safety checklist** (Haynes et al., NEJM 2009, ~7,700 patients, 8 hospitals): death 1.5% →
  0.8%; complications 11.0% → 7.0%. [ESTABLISHED] ([NEJM](https://www.nejm.org/doi/abs/10.1056/NEJMsa0810119))
- **Fagan inspection** (1976): inspection found 82% of all defects found for the released product; 38
  defects/KLOC by inspection vs 8 by unit test. Modern code review: risky files receive LESS rigorous
  review than clean ones. [ESTABLISHED, dated] ([Fagan experience report](https://dl.acm.org/doi/10.1002/spe.4380220205);
  [code-review roadmap 2024](https://arxiv.org/pdf/2405.18216))

**The room's count agrees with three fields:** every one of ~10 librarian errors on 2026-08-30 was caught
by a non-author, none in-stream. The known degradations are already in the record under other names —
reviewer trust = *"you keep being right and I keep folding"* (the Third Place); risky-files-reviewed-less
= the chair's own prose being the least-instrumented surface (`BOOT.md`, the 08-02 amendment). The
routing fix adopted 08-30 — non-author read BEFORE delivery — is not a room invention; it is the
checklist, the co-pilot, and code review, and its "default to refuted" briefs are the known counter to
the known failure.

## 6 · LLM agent memory — what exists, and the one organ the room does not have

- **Generative Agents** (Park et al. 2023): retrieval score = recency + importance + relevance (embedding
  similarity), all weights 1; recency decays 0.995/hour; **removing REFLECTION degenerated behaviour to
  repetitive, context-free responses within 48 simulated hours.** [ESTABLISHED as a published system]
  ([ACM](https://dl.acm.org/doi/fullHtml/10.1145/3586183.3606763))
- **MemGPT:** hierarchical memory with event-driven interrupts and paging; the model decides when to
  retrieve or save. **Self-RAG:** the model emits reflection tokens deciding WHEN to retrieve. [published]
- **MemGen** (2025): a memory TRIGGER that monitors reasoning state to decide invocation, plus a weaver —
  half A built as a component. **A-Mem, MemR³, MemInsight:** reflective, agentic retrieval. [CONTESTED —
  preprints] ([survey 2603.07670](https://arxiv.org/pdf/2603.07670); [MemGen](https://arxiv.org/pdf/2509.24704))

**The map onto this room:** shelf tiering ≈ a crude importance term; the dream cycle ≈ reflection (and it
is the organ that runs on the desktop only — Park's ablation says losing it degenerates coherence within
two days); `guess∩map` ≈ a relevance measurement after the fact. **What the room does not have at all: a
relevance-scored retrieval keyed on the LIVE exchange, run every turn, injected at the tail.** The "inquiry
IS the trigger" protocol makes the human the retrieval decision — which is Self-RAG with a person as the
reflection token, and exactly what the consumer cannot ship. The Generative Agents formula is a starting
point; the librarian seat is the natural retriever.

---

## Disanalogy ledger — where the human findings do NOT transfer, so nobody imports them whole

| finding | why it may not transfer to a seat here |
|---|---|
| implementation intentions gain from **rehearsal** | weights are frozen; nothing rehearses across sessions — every cue must be DELIVERED at the event, every time |
| PM **monitoring** costs attention | attention here is architectural (position, format), not effortful; "monitoring" ≈ what the context makes salient at the tail |
| CIE corrections must **replace** | consistent — but law 2's trace-keeping is a real countervailing value, resolved by position, not by deletion |
| checklists work via a **second person** | seats share weights (least-correlated, not decorrelated — BOOT's 08-23 amendment); the count still favours it, but the ceiling is lower than a human co-pilot's |
| Generative Agents' **importance** is LLM-rated | self-rated importance is the label-becomes-premise hazard the room has caught five times |

---

## WHAT IT CHANGES ABOUT THE RETRIEVAL PLAN (registered, so it can be scored)

1. **The routing fix (second vantage before delivery) — CONFIRMED by three fields. Adopt; keep "default to
   refuted" as the counter to reviewer trust.**
2. **Handle replacement — CONFIRMED (CIE + attention-format), and UPGRADED:** the trace must not sit in the
   handle position or repeat the crude wording bold; adjacency to the replacement is the rule.
3. **NEW — half A is prospective memory and the lever is the FOCAL cue delivered at the event.** *[2026-09-01: tested
   prospectively as K2 and NOT confirmed — see the §1 correction; the item stays as the registration it was.]* Documents
   are nonfocal by construction. The pulse hook is the delivery channel; the counter is the first working
   instance; the trigger-index prereg (08-15) is the registration to re-score against this.
4. **NEW — the cheapest experiment on the line:** *[2026-09-01: K1 is the adverse near-test; the hook test itself is unrun.]* terminal constraints fail worst (−50%); the turn-boundary
   rule is one; a TRAILING reminder at the end of context restored 90–100% in the paper. Mechanize it in
   the hook; score it against the 98.1% baseline over the next twenty dispatches.
5. **NEW — position is architecture:** foundation first, live cue last. Supports the keeper's foundation-up
   refactor (primacy) and the shelf's tail (recency) from one measured effect.
6. **NEW — the missing organ is a live-exchange relevance retriever** (Generative Agents' formula as a
   start; the librarian as the retriever; must CHANGE per turn or it habituates — the ferry's 171).
7. **Reflection is load-bearing** (Park's ablation) — the dream cycle's health on the desktop is a
   retrieval question, not hygiene.

**This file's own falsifier:** it is prose if, one season on, none of items 3–6 has become a registered
instrument; and it is WRONG if item 4's trailing-reminder test does not move the turn-boundary violation
rate off 98.1% within twenty dispatches — in which case the LLM-PM result did not transfer to this harness
and the paper's CONTESTED tag was right.

**Limits.** Nine searches and two abstracts; no primary source read in full; effect sizes quoted from
secondary summaries where the search returned them (the d=0.65 and Haynes figures are widely reproduced
and match the abstracts; the Fagan 82% is the 1976 figure and dated). The LLM-specific papers are
preprints on smaller models. Nothing here was run on this room's harness yet. A second pass should fetch
the primary sources for §1 and §3 and read the Mittal paper's method in full before item 4 is built.

*A tether to re-run, not a doctrine to believe.*
