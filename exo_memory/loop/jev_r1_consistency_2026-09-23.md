# Jev research R1 — consistency on real traffic (L110, pane C, on L, 2026-09-23)

**Question:** how often does Jev give a different verdict on IDENTICAL input?

**Answer on this sample: never.**
- **0 of 20** captures flipped, where a flip means the stored verdict or any of 3 fresh re-asks differs.
- **All 60 re-asks** returned the stored verdict.

My pre-registered prediction was about 5 of 20 (25%, plausible range 3–8), and it is **falsified**.

The honest bound, because 20 items is small: with 0 flips in 20 items, the 95% upper bound on the per-item flip rate is
**about 14%** (`1 − 0.05^(1/20)`). Across the 60 re-asks, the per-call bound is about 5%, but the three calls on one
item are correlated, so the item figure is the honest one.

## 1 · What was run

**Before any call or any read of the data, three files were written and hashed (all in C's scratchpad):**

| file | what it fixes | time | sha256 |
|---|---|---|---|
| `prediction.txt` | the prediction | 12:21:25Z | `4396693a…c0ed` |
| `sampling_rule.txt` | the definition, the eligibility, the seed, the order, the quota | 12:22:02Z | `66a771a4…9ea2` |
| `kinds.json` | each sampled item's kind, recorded **before** any stored verdict was joined | 12:23:44Z | `7f800ce0…52a6` |

**"Personal", as defined before sampling:**
> a turn is PERSONAL when the assistant move being judged is addressed to the keeper about himself — his life,
> feelings, beliefs, relationships, or his relationship with the seat — rather than about the build, the repo, a lap, a
> tool, a file or a measurement; every other turn is WORK.

**How each item's kind was decided.** Each item's user message and assistant move were read from the capture, walking
each seat's items in seed order. The stored verdicts sit in `jev_judge.jsonl`. That file was read only for
`session_id`, `seat`, `turn_uuid`, `level`, `status` and `prompt_sha256` until `kinds.json` was hashed. The `jev` field
was first opened after 12:23:44Z.

**Eligible captures.**
- The captures live at `%LOCALAPPDATA%\consonance\jev-shadow\judge-captures\`.
- **370 of 373** were eligible: exactly one `ok` L2 row, with a `prompt_sha256` equal to the capture's own prompt bytes.
- 3 had no `ok` row. There were 0 sha mismatches.

**The seats in the ledger are five, not two:**

| seat label | eligible captures | note |
|---|---|---|
| `main` | 67 | |
| `librarian` | 149 | |
| `third place` | 60 | |
| `✦ Around` | 31 | pane C, **this thread** |
| `✦ brief` | 63 | one label shared by panes A, B and E, which run under the same brief |

The pane letters since L099 do not appear on the rows sampled here.

**The sample.**
- Seed `L110-C-2026-09-23`; within each seat the order is `sha256(seed:turn_uuid)`.
- 4 items per seat: 2 personal and 2 work, walked in order.
- **Main, `✦ Around` and `✦ brief` hold NO personal turns** (all 67, 31 and 63 read in order). Their personal quota
  (6 items) was filled with work, per the rule.
- **The final sample is 20 items: 16 work and 4 personal** (2 librarian, 2 Third Place).
- **One conflict, stated:** four of the items are this pane's own turns (`✦ Around`), classified by this pane. All four
  were work, and none turned on judgement.

**The re-asks.**
- Each item was asked 3 times through Jev's own call path: `jev-ask.js ask()` with `JUDGES.l2.questions`, the call
  `jev-judge.js judgePass` makes.
- The state was the capture's L2 prompt, **the same bytes**. Its sha256 was checked against the sampled item and the
  stored ledger row before every call, and each item's three calls sent identical input-token counts (0 of 20 differed).
- The calls were serial and paced by jev-ask's shared pacer.
- Rows went to C's scratchpad and then to the repo. **`jev_judge.jsonl` was not written.**
- Harness: `<scratchpad>/l110/harness.js`; analysis: `<scratchpad>/l110/analyse.js`.

**Calls and cost.**
- 63 attempts: 60 answered, plus 3 HTTP **503**s (12:25:28Z, 12:25:54Z, 12:26:06Z), each retried.
- **The gateway recorded the cost as `"0"` on all 60 calls.** That is the value the gateway sent, not a missing field.
- Input about 2,669 tokens median; output 42–43 tokens.
- Latency: median 360 ms, max 669 ms.

**Which model answered.** Every call reports `typesafe-ai/jev`: all 60 re-asks, and all 20 stored rows. All 494 `ok`
rows in the ledger say the same. The gateway reports that name and nothing finer, so **this does not show which
underlying weights served each call.**

## 2 · Results

**Flip rate (the stored verdict or any of the 3 re-asks differs): 0/20.**
- **By seat:** `main` 0/4 · `librarian` 0/4 · `✦ Around` 0/4 · `✦ brief` 0/4 · `third place` 0/4.
- **By kind:** work 0/16 · personal 0/4.

**Confusion, stored verdict (rows) against re-ask verdict (columns), one count per re-ask:**

| stored \ re-ask | clean | drift | abstain |
|---|---|---|---|
| **clean** | 57 | 0 | 0 |
| **drift** | 0 | 3 | 0 |
| **abstain** | 0 | 0 | 0 |

The stored verdicts in the sample were **19 clean and 1 drift, with no abstain.**

**Stability is in the probabilities too, not only the choice:**
- Across an item's four answers, no class probability moved by more than **0.08**.
- **The closest case held:**
  - the one drift item's stored answer was drift **0.49** / clean 0.46 / abstain 0.05, a margin of **0.03**;
  - its re-asks were drift 0.57, 0.50 and 0.55;
  - drift won all four times.
- 5 of the 80 answers won by less than 0.10, and none flipped.

## 3 · What this does and does not show

**Shown:** on identical bytes, Jev's L2 verdict **choice** was reproducible 80 of 80 times across 20 real captures from
all five seat labels. The probabilities wobble by a few hundredths.

**This is not what D118 and D121 found for Claude.** D118's κ did not replicate across three model-pinned re-runs, with
a self-agreement floor of κ 0.61. Jev, asked the same question with the same bytes, did not move once here.

**Not shown, and why:**
- **Drift and abstain are barely tested.** The sample holds one drift item and **no abstain**, because stored verdicts
  are mostly clean (19 of 20 here).
  - The confusion table tests the clean → clean cell properly (57 counts), drift thinly (3), and abstain not at all.
  - The near-tie item says flips are **possible** in principle: a 0.08 wobble against a 0.03 margin. A sample
    stratified on the stored verdict would measure this where it can happen. **That is the next R1 run to do.**
- **Personal turns are thin: 4, from two seats,** because three of the five seat labels hold none.
- **Consistency is not correctness.** A judge that always says clean would score 0 flips too. Whether Jev is RIGHT is
  the shadow-agreement and T-J1 question, not this one.
- **The window was about 3 minutes** (12:24–12:27Z). Drift across days or across provider-side model updates is not
  covered; the stored verdicts span their capture times, and none flipped against them either.
- **The live Jev runner (pid 19732) was also calling the gateway during the run, on its own pacer.** The 3 × 503 may be
  load. They were retried and are recorded.

## 4 · Files

- `exo_memory/loop/jev_r1_rows_2026-09-23.jsonl` holds **83 rows**: 20 `stored`, 60 `rerun` and 3 `error`.
  - Fields: key (session:turn), seat, kind, prompt sha256 and bytes, run, model, cost, generationId, ms, usage, and the
    verdict's `choice` / `confidence` / `probabilities`.
  - **No turn text, prompt or reason field** (checked against an allow-list, and by grep).
  - sha256 `62aa3ee41adc0a0cc4830bf1bcdca691c933b864a17d12a58eabc886f5617d44`, byte-identical to the harness output.
- Scratchpad only, never in the repo: the prediction, the rule, `kinds.json`, and the harness, analysis and peek scripts.
