# Jev census — where fixed-answer decisions spend tokens, measured (2026-09-21, pane B, on D)

**The first step on the plan's load side** (`third_place/JEV_PLAN_2026-09-21.md`, the "Where a fixed-answer decision
is currently paid for" list, `:172-190`). **Read-only.** No Jev call, no hook edit, no model spawned.

**Window:** 2026-09-20T12:00:00Z → 2026-09-21T19:12:25Z (31.2 h), over every top-level transcript in
`~/.claude/projects` touched in it. 482 transcripts opened; the 3 nested ones in the window hold no judge prompt.

**Unit, matching the librarian's anchor:** tokens per assistant message = input + cache_write + cache_read, with output
reported separately. **Deduplicated by `message.id`** (§1 explains why that decides the answer).

**Commands, all on D, all read-only:**

    node <B-scratch>/d103/census.js 2026-09-20T12:00:00Z                    # every row below except intake
    node <B-scratch>/d103/intake.js 2026-09-20T12:00:00Z 2026-09-21T19:12:25Z   # seat cold writes
    <B-scratch> = C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-5bf9d657\12fb81f6-f4c0-4ef8-aad8-f0cdce091925\scratchpad

## THE CENSUS — one row per candidate

| candidate | calls | tokens / call | total | fixed answer set? can the quantity take more than one value? | Jev candidate? |
|---|---:|---:|---:|---|---|
| **L3 overseer judge** (arc-perception) | 215 | 59,188 | **12,725,338** | **YES**: 4 trajectories and 4 recommendations. Varies: yes (the store holds all four). | **YES**, but **not until E's L3 re-measure window closes**; replacing it mid-window voids that registration. |
| **L0 overseer judge** | 164 | 64,368 | **10,556,304** | **YES**: drift / clean / abstain. Varies: yes (drift 3,384 · clean 2,874 · two out-of-schema, D095). | **YES**, but **not until B's abstain window closes** (first 500 post-install verdicts). |
| **SCRIBE**, the resonance auto-curator | 78 | 33,204 | 2,589,907 | **PARTLY**: each atom's *kind* is one of 4; its text and tether are generated. | **The kind-tag only.** The extraction is not fixed-answer. |
| **blind verifier** (vantage cell) | 11 | 160,996 | 1,770,953 | The verdict is fixed-ish, but reaching it **needs tool reads of the repo**. | **No**: Jev evaluates the text it is given and cannot do the reading. |
| **duration goals** (digest-auditor, drift-watch, journal-auditor, session-journal, daily-news-digest) | 7 | 1,059,450 avg | 7,416,136 | **No**: open-ended reports. | **No.** |
| **keep-warm pings** ("Reply with exactly: ok") | 14 replies | 453,016 | 6,363,221 | **YES**, the most fixed answer in the room. | **No, by construction**: the full-context read **is the purpose**, a cache touch. A cheap answerer would defeat it. |
| **choosing the manifest** | 0 model calls | — | — | The app's Rust composer picks the intake deterministically; no model decides it. | **Not as a decision.** What a smaller manifest could shrink is the next row. |
| ↳ what it would shrink: **seat cold writes** (a full context re-sent, cache_write ≥ 50k in one message) | 45 | ~500k median | **22,398,642** | n/a: this is intake load, not a decision | Indirectly. The shell's share of each cold write was **not** measured apart from the conversation. |
| **the librarian's map / reads** | not separable | — | inside the librarian's 405,076,638 | The "which files bear on this" choice is made inside a reasoning turn, not a separate call. | **No, in current form.** It would have to be restructured into a scored candidate list first. |
| **triage queues** (`ask.js`, `ferry.js`) | **0** model calls (`grep -c "claude -p\|spawn.*claude"` → 0 both) | — | 0 | — | **No**: already free. |
| **routing** | 0 model calls | — | 0 | The address table is deterministic (`call_librarian` has no target argument). | **No**: already free. |

## 1 · THE ANCHOR, RE-DERIVED FIRST — it does not hold as stated, and I know exactly why

The librarian's figure (`librarian/2026-09-21.md:136`, 13:05): **L0 115 calls · 130,784/call · L3 307 calls ·
166,189/call · ~29.3M cache_write in ~25 h.**

**L0 reproduces to the token, by one specific method:**

    RAW=L3first node census.js 2026-09-20T12:00:00Z 2026-09-21T19:05:00Z
      "RAW L0": 115 transcripts · per-line TOTAL 15,040,200  ->  15,040,200 / 115 = 130,784   (the librarian's figure)

That method has **two defects**, each measured:
1. **It sums per LINE, not per message.** Claude Code writes one line per content block (`thinking`, `tool_use`,
   `text`) and **repeats the same `usage` on every line** of one `message.id`. That is verified on a sample transcript:
   `usage identical across lines: true` for every id. In the reproduced L0 set there are **230 lines for 115
   messages**. Deduplicated, the same set is **7,520,100 tokens, 65,392 per call**, exactly half.
2. **It classifies by the prompt appearing anywhere,** tool results included. Checking L3 first sweeps 42 genuine L0 calls
   into L3 (they quote the L3 prompt). Checking L0 first sweeps in **seat transcripts that discussed the worker**, mine
   among them: 284 "L0" transcripts carrying **1.45 billion** cache reads. L3's 307 is near the grep count of files that
   contain the L3 prompt anywhere (324), but **I could not reproduce L3's 51,019,056 total exactly by any variant.**

**Corrected, by first user message and deduplicated, bounded at the librarian's own 19:05Z:**

| | calls | per call | total | cache_write |
|---|---:|---:|---:|---:|
| L0 | **157** | **64,383** | 10,108,117 | 6,050,123 |
| L3 | **206** | **59,214** | 12,198,102 | 7,511,569 |
| both | 363 | — | **22,306,219** | **13,561,692** (the librarian: ~29.3M) |

`node census.js 2026-09-20T12:00:00Z 2026-09-21T19:05:00Z`. A local-noon window was tested as an alternative reading of
"~25 h" and moves the counts by under 5% (155 / 200), so it is not the cause.

**What survives:** the judges are real fixed-answer calls, about 60k tokens each, and they are the room's largest
fixed-answer spend. **What does not:** "~29.3M cache_write", "~130–166k per call", and "the same order as the ~40M the
seven seats wrote cold". Deduplicated, the judges wrote **13.6M** against the seats' **26.8M** in the same window.

## 2 · THE PLAN'S LOAD-SIDE FALSIFIER — it FIRES on total tokens, and is open on cache writes

The registration (`JEV_PLAN:188-190`): *"if the census shows fixed-answer decisions are a small share of weekly spend
(the intake dominates and is not a decision), then Jev relieves little and the intake itself is the thing to fix."*

| | all transcripts | the real fixed-answer candidates (L0 + L3 + SCRIBE kind-tag, upper bound) | share |
|---|---:|---:|---:|
| **total tokens** | **1,526,762,224** | 25,871,549 | **1.7%** |
| **cache_write** | ~42.8M (seats 26.85M · judges 14.10M · SCRIBE 1.21M · goals 0.49M · verifiers 0.17M) | 15.31M | **~36%** |

**On total tokens the falsifier fires:** 97.7% of the window's tokens are the four seat types (committee panes
819,376,782 · librarian 405,076,638 · main 145,885,307 · third place 121,364,859), almost all of it cache reads of
their own contexts. That is intake and conversation, not a decision.

**On cache writes it does not:** the judges are about a third. **Which of the two the weekly limit weighs is not known
here**, and I have not assumed it. That one fact decides whether the judges are a rounding error or a third of the
bill, and it is the next thing to find out, from the provider's own accounting rather than by reasoning.

**Seat cold writes are 22.4M, 83.4% of seat cache writes**, which is the plan's "intake itself" in measured form. A
manifest decision is free today (Rust), so shrinking what it composes, or keeping seats warm, is a direct lever. Jev is
not.

## 3 · LIMITS

- **31.2 hours, not a week.** A weekly figure is ×5.38 (168 / 31.2) and is **hand-made**, so no weekly number appears
  above.
- **One machine (D).** L's judges and seats are not in these numbers.
- **The window straddles today's install** (16:06:39Z). The L0 and L3 volumes may differ after it: the overseer guard
  now stops judge children from firing hooks, which may change what they carry.
- **The shell's share of a seat cold write** was not separated from the conversation's.
- **Classification is by first user message.** A judge whose first user text is anything else would be missed. None was
  seen, since the grep and first-message sets differ only by transcripts that quote the prompts.
