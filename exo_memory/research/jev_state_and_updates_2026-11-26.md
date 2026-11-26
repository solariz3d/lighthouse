# Jev, two months on: what the room did with it, and what changed outside (the Third Place on L, 2026-11-26)

*Asked for by the keeper at 02:39: "can you look up the tool Jev, and see how it has been and any updates if there has
been any. Might want to do a refresher for yourself on our work with it". Part 1 is read from this repository. Part 2 is
read from the pages named, fetched 02:4x, except where a line says it came from a search summary only.*

## 1. What the room did with Jev (read from the repo)

- **09-21, the idea.** This seat's notes `third_place/JEV_for_the_room_2026-09-21.md` and `JEV_PLAN_2026-09-21.md`. His
  words: "I think Jev is a superpower". One WRONG of this seat's in it: use #2 proposed a gate the room had refused on
  08-15.
- **09-22, built in.** `1afa2856` (L071): Jev as a judge inside the runner. The tools are still in `consonance/tools/`
  (`ls consonance/tools | grep -i jev` lists 15 files: jev-ask, jev-judge, jev-room, jev-shadow, jev-shadow-runner,
  jev-variants, with tests and mutants).
- **09-27, the drift test and the switch-off.**
  - Asked about "drift", Jev failed; the room's own two readers agreed with each other at κ 0.125 on that question. His
    reading, documented at `409ae2bf`: the word was the problem, not the judge.
  - The gateway then answered HTTP 403 ("Free tier users do not have access"). His words, 11:34: "just dont use jev,
    revoke key". `6c53bc08` (D164) took the spawn out of the app.
- **10-01, three tests through OpenRouter, each with its bars sealed first** (model `typesafe/jev-1.13-20260917`):

  | test | question | Jev vs the readers' consensus | the readers with each other | sealed result |
  |---|---|---|---|---|
  | D162 (`loop/q3_jev_score_2026-10-01.md`) | Q3: does this sentence state a number, unit, count or verdict the command output does not show? | κ 0.384 on 34 units (24/34) | κ 0.708 | FAILS (bar 0.40) |
  | disagreement (`loop/jev_disagreement_score_2026-10-01.md`) | on the 10 units where Jev and the consensus differed, who do two outside models side with? | Jev 3, consensus 4, split 3 | n/a | NOT SUPPORTED; one outside judge said YES to all 14, so the result is weak both ways |
  | D199 (`loop/qc_jev_score_2026-10-01.md`) | QC: is the keeper correcting something the seat said? | κ 0.371 on 52 units; caught 3 of 10 corrections | κ 0.710 | FAILS → retire |

- **Retired and shelved.** The librarian's line: "Retire Jev from the room. The correction count it would have powered
  is still owed, and needs another instrument." His words, 10-01 07:51: "no we arent paying for seperate models will be
  expensive, lets just abandon this for now and get back to retrieval work". The OpenRouter key was left in the user
  environment, unused (`loop/plan_label_watch_first_read_2026-10-01.md:4`).
- **The design that stopped.** `loop/design_jev_purpose_2026-10-01.md`: an outside checklist reader at the moment a claim
  leaves a seat (QR: is this a checkable claim; Q3: does it go beyond its evidence). It stopped at step 1 when Q3 failed.
  "The purpose stands as a purpose; Jev is not the reader for it."
- **The abuse clause still binds:** "no re-wording of Q3 and no second run after this one is seen."

## 2. What changed outside

- **Jev 1.14** (`docs.typesafe.ai/models`): available from October 14, 2026; `jev-latest` now points to `jev-1.14.0`.
  - New: a Box question type. Input is listed as text and images for both 1.14 and 1.13.
  - Unchanged: $0.042 per million input tokens, output free; 64k per request, 32k per question.
  - A long-context header raises both limits to 262k; the docs call it "slower and less accurate".
  - Not confirmed at the vendor: whether it is still early access. News coverage in October still says so (InfoQ).
- **Independent evaluations now exist.**
  - **Vals** (`vals.ai/blogs/independent-evaluation-of-jev`, Jev 1.13.0, twelve systems):
    - Claim verification, 400 items built from SEC filings (a claim against a source excerpt): Jev 0.975, tied with
      three frontier models, at $0.02 per 1,000 cases. All twelve systems scored 0.953 to 0.995.
    - A preregistered 396-question slice of LegalBench: "Jev finishes last of twelve on raw accuracy and on
      class-balanced accuracy." Vals says the slice does not represent the full benchmark.
  - **JevBench by Benchmark Heaven**, board v1.8.7 of Nov 3, as reported at `parallel.ai/articles/jevbench-benchmark`
    (not TypeSafe's):

    | system | board | Capability | Intelligence / Calibration | rank |
    |---|---|---|---|---|
    | Jev 1.13.0 | hosted | 77.1 | 63.6 / 90.6 | #15 by Composite |
    | Jev 1.14.0 | hosted | 75.0 | 59.9 / 90.1 | #18 by Composite |
    | baselabs mammoth-1 (27B) | open weights | 85.2 | not read | #1 by Capability |
    | Torchcast Decision 4B | open weights | 77.5 | not read | #1 by Composite |

    On this board 1.14 scores lower than 1.13.
- **Open-weights decision models now exist**, which did not on 09-21 when this seat wrote "no self-hosted, on-prem or
  open-weights option is mentioned anywhere". Two are on the board above. A DataCamp article names more (Kev, built on
  Qwen3.5 at 0.8B, 4B and 9B and serving TypeSafe's `/v1/systemone` contract; Nimble; Laya, on ModernBERT-large). That
  page returned 403 to this seat, so those names come from a search summary only and no repository or licence was
  opened.

## 3. Set beside each other

- The outside results have the same shape as the room's: very well calibrated, and weak where the answer needs reading
  for meaning (Calibration about 90, Intelligence about 60; last on the legal slice). The room measured κ 0.38 and 0.37
  against readers who agreed at 0.71.
- Vals's claim items are a ceiling task: every system scored above 0.95. The room's Q3 has the same form (one sentence
  against one piece of evidence) and Jev did not reach the bar on it, so the Vals tie does not carry over to the room's
  material.
- Nothing read here gives a reason to expect 1.14 to do better on the room's two questions. On the one independent
  board that ranks both, it does slightly worse.
- What is new for the room is the open-weights class. It would answer the three things that stopped Jev on grounds
  other than its score: the bill, the text leaving the machine, and a version that can move. None of it has been run or
  even opened here. A different model is a different instrument, so it would need its own registration; the sealed
  clause forbids a second run of the same one.

## Sources
- https://docs.typesafe.ai/models
- https://vals.ai/blogs/independent-evaluation-of-jev
- https://parallel.ai/articles/jevbench-benchmark
- https://infoq.com/news/2026/10/typesafe-ai-jev-released
- https://www.datacamp.com/blog/top-open-source-jev-alternatives (403 here; search summary only)
- https://alternativeto.net/news/2026/10/typesafe-ai-ships-jev-1-14-with-new-box-type-composable-images-and-longer-context-length/ (403 here; search summary only)
