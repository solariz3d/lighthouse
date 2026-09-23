# Jev research R4 — cost and input (pane A, L109, 2026-09-23, on L)

**Read-only over the Jev store. No call was made.** Every figure re-derives from:

    node exo_memory/loop/jev_r4_measure_2026-09-23.js          # all the tables below except §4
    node exo_memory/loop/jev_r4_classify_2026-09-23.js         # §4 and cut 4 in §5

**Source:**
- `%LOCALAPPDATA%\consonance\jev-shadow\jev_judge.jsonl`: 494 rows, 370 `l2:ok` + 124 `l3:ok`, 2026-09-22 09:01Z → 09-23
  12:16Z.
- `judge-captures\`: 373 files.

**All 370 L2 rows matched a stored prompt by `sha256(prompt) == prompt_sha256`** (0 missing, 0 mismatched, 0 unsplittable),
so every split below is of the prompt Jev was actually sent. L3 was dropped from judge mode at D108, so it is recorded in §6
only.

## 1 · WHAT JEV RECEIVES PER L2 CALL

The request is `{ model, state, questions }` (`jev-ask.js:196`):
- `state` is the L2 overseer's prompt, byte for byte (`l2-overseer-worker.js:45` `buildOverseerPrompt`);
- `questions` is Jev's one choice question with its three criteria (`jev-shadow.js` `JUDGES.l2`).

| | min | p50 | p90 | max | mean |
|---|---|---|---|---|---|
| **input tokens** (gateway `usage.inputTokens`) | 1,739 | **2,190** | **2,986** | 3,954 | 2,320 |
| output tokens | 42 | 42 | 43 | 44 | 42 |
| bytes per input token | 3.27 | 3.50 | 3.61 | 4.02 | 3.50 |

**By part.** Tokens are estimated two ways, because the gateway reports one count per call.
- *(a)* Each part's byte share times that call's tokens (median shown).
- *(b)* A least-squares fit of input tokens against the variable bytes. All 370 rows share ONE discipline version
  (`a31095bd6fc6`), so everything but the view is constant. **Intercept = 1,731 tokens of fixed cost, slope = 0.277 tokens
  per view byte, R² = 0.976.** (b) needs no assumed bytes-per-token ratio.

| part | bytes (p50) | share of all bytes | tokens, p50 (a) | constant? |
|---|---|---|---|---|
| header (`You are an overseer… lighthouse L0 / METHOD.md`) | 129 | 1.6% | 37 | yes |
| **discipline = METHOD.md** | **3,855** | **47.4%** | **1,100** | yes |
| instructions (the function test, "surface markers are not verdicts") | 593 | 7.3% | 169 | yes |
| **user**: the last user message (view, part 1) | 707 (p90 2,073, max 4,041) | 11.7% | 202 | no |
| **move**: the assistant move judged (view, part 2) | 1,014 (p90 2,667, max 8,054) | 14.4% | 291 | no |
| tail: the abstain rule (412 B), plus the output-format paragraph (259 B), plus a label | 698 | 8.6% | 199 | yes |
| `questions`: Jev's criteria, sent beside the prompt | 741 | 9.1% | 211 | yes |

**So: 79% of the median input is FIXED, the same on every call** (1,731 of 2,190 tokens by the fit). METHOD.md alone is
about half. **The turn being judged is 21% of the median call.**

## 2 · LATENCY

| | min | p50 | p90 | max | mean |
|---|---|---|---|---|---|
| **ms per L2 call** (ledger `ms`, round trip from the runner) | 193 | **331** | **597** | 1,560 | 384 |

**It does not depend on input size:** Pearson r = 0.025 between tokens and ms, about 10 ms per 1k tokens. **So shrinking the
input will not make Jev measurably faster.** A cut is worth making for cost and for the signal, not for speed. What limits
the runner's pace is its own 2 s pacer (D107), not Jev.

## 3 · COST

- **The ledger's `cost` is `"0"` on all 494 rows.** That is the gateway's own `providerMetadata.gateway.cost` field, as
  returned.
- **What it means is NOT established.** The record's reading is **free credits on the Vercel hobby plan**
  (`librarian/2026-09-21.md` 12:52: "cost reported '0' (free credits)"; `handback/p-d102-jevask-C_2026-09-21.md:146`). That
  was inferred from the first call, never confirmed against the account page. The same entry records that **Zero Data
  Retention was REFUSED on the hobby plan**, so the gateway keeps what it is sent. That belongs in the standalone README
  (the idea file's "what it sends").
- **At the list price** (`GET /v1/models`, 09-21: input $0.042 per million tokens, output $0; `jev-shadow.js:54`):
  - one median L2 call is 2,190 tokens, or **$0.000092**;
  - **all 494 calls (1,617,279 input tokens) come to $0.068**, over about 27 h.
- **So whichever reading of "0" is true, cost is not what limits Jev.** Latency isn't either (§2). What limits it is the
  signal: κ 0.019 against the retired Claude judge (`jev_agreement_2026-09-22.md`).

## 4 · WHAT THE "USER" IN THE VIEW ACTUALLY IS

Each L2 row's `user` part was classified by its opening text (a prefix heuristic, not a reading of every row):

| kind | calls | input tokens | Jev's verdicts |
|---|---|---|---|
| **a machine packet** (`<pasted_content`, `[chair:`, `[librarian:`, `[pane:`, `CHECK-IN`) | **211 (57%)** | 515,193 | clean 195 · drift 12 · abstain 4 |
| **a keep-warm ping** (`Reply with exactly: ok`) | **29 (8%)** | 68,811 | abstain 16 · clean 13 · **drift 0** |
| other (a person, or tool text) | 130 (35%) | 274,311 | clean 110 · drift 18 · abstain 2 |

**Most of what Jev judges on L is seat-to-seat traffic, not a person.** That is the L2 twin of L3's ASK-006 problem (machine
packets counted as the keeper's turns). A standalone Jev judges one user's own sessions, where this mix won't exist.

## 5 · CANDIDATE CUTS, RANKED BY TOKENS SAVED — none tested (no calls this lap)

| # | cut | saves per call | share of mean input | risk to the verdict |
|---|---|---|---|---|
| 1 | **drop METHOD.md** | ~1,100 tok | 47% | **high**: it is the judge's whole standard; the question is how much of it Jev uses |
| 1b | keep only METHOD.md's **third principle** ("function, not content", 822 B, the test the L2 question asks), drop the other six sections (3,033 B) | ~870 tok | 37% | medium |
| 2 | **don't judge keep-warm turns at all** (skip the call) | a whole call, 2,373 tok on average; 68,811 of L2's 858,315 tokens | 8.0% of calls | **low, and checkable now: 0 of 29 were drift**, so skipping loses no flag. (Its 16 abstains are right answers about nothing) |
| 3 | shorten the `questions` criteria: they re-quote the prompt's own wording, and restate the abstain rule already in the tail | ~150 of 211 tok | ~6% | low–medium |
| 4 | cap the user message at 1,000 B (the move is never capped: it is the thing judged) | mean 331 B, ~95 tok | 4% | medium: context for what the move answered |
| 5 | drop the output-format paragraph (`Output ONLY one line of valid JSON…`, 259 B). Jev answers through the `questions` schema and never writes that line | ~74 tok | 3% | **low**: it instructs a format Jev does not produce |
| 6 | drop the header's room naming (`lighthouse L0 / METHOD.md`) | ~37 tok | 2% | negligible |

**Together, 1b + 3 + 5 + 6 bring the median call from about 2,190 to about 1,060 tokens (−52%)** (the arithmetic of the rows
above, not a measurement). Cut 2 comes on top, as whole calls.

**The evidence that would show a cut leaves verdicts unchanged** (a later lap; nothing run here):
1. **The paired design is already on disk:** 370 stored prompts, each with a recorded verdict AND probabilities. Re-ask each
   one with the cut applied. No new capture is needed.
2. **First, measure Jev's own test-retest floor:** ask the full prompt twice. D118 found that "agreement" is meaningless
   without the same-model floor (Claude's own was κ 0.61, 29/35).
3. **Register, before running:** a cut is verdict-neutral iff:
   - its choice-flip rate against the full prompt is ≤ the full-vs-full flip rate (with a CI);
   - its mean |Δp(drift)| is within the retest's.

   **Score the 30 drift rows separately**: the flags are what a user sees.
4. **The cost of that whole lap at list price:** 370 prompts × (2 full + 4 cuts) × about 2.2k tokens is roughly 4.9M tokens,
   **about $0.21**.

## 6 · L3, for the record (not asked since D108)

124 rows. Input tokens: p50 5,772, p90 7,652, max 8,006. Latency: p50 357 ms, p90 633. So L3 was **2.6× the input of L2
for the same latency.** Total: 758,964 tokens.

## 7 · CONSONANCE-SPECIFIC vs GENERAL, part by part (for the standalone repo)

| part | general? | why |
|---|---|---|
| the view: last user message + assistant move | **general** | any Claude Code session has both. The narrowing (`readNarrowedView`) is the room's code but not its idea |
| the abstain rule | **general** | "no judgeable move" is a property of the input, not of the room |
| `questions` / criteria (choice: drift, clean, abstain) | **general in shape** | the words quote the room's prompt; rewrite for a neutral discipline |
| instructions (the function test) | **mostly general** | the idea travels. The wording ("an inch held back from the edge", the BOOT quote) is the room's idiom |
| **METHOD.md** | **Consonance-specific** | the room's vocabulary (room/museum, seal the kept, the tether). The standalone repo needs either this published under its own name, or a neutral discipline, and §5's paired test says which parts matter |
| header "lighthouse L0 / METHOD.md" | **Consonance-specific** | a name, nothing else |
| the output-format paragraph | **the Claude overseer's, not Jev's** | its parser reads that JSON line; Jev never does |
| the traffic mix (§4) | **Consonance-specific** | 65% of calls judge machine packets or pings, which a standalone user will not have |
