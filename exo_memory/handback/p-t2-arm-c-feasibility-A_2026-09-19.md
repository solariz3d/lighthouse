# P-T2-ARM-C-FEASIBILITY · ALPHA — five Claude model ids are reachable by C's route, none is silently remapped, and the canary holds on each

**Pane A, machine D, 2026-09-19 13:2x–14:0x.** Lap D087 (unattended N5). **A MEASUREMENT ONLY: no subject of T2 ran.**
- Registration: `exo_memory/third_place/SPINE_diversity_to_retrieval_2026-09-16.md` §6 T2 (:131-139) and §8 item 2
  (:196-197).
- Route: C's, from `handback/p-t3-readiness-C_2026-09-19.md` §Answer.
- `claude --version` → 2.1.278 (Claude Code). HEAD at start: 5c97769.
- **Nothing tracked was edited.** The only files written are this hand-back, one map line, and scratch.

## 0 · THE REGISTRATION, QUOTED (not restated)

`SPINE…:131-139`:

> **T2 · Paths vs architecture** — the three-arm test with BOTH predictions (`2026-09-15.md:209-243`):
> arms (a) same model flat · (b) same model chair-briefed · (c) three models flat; unit: blind distinct arrivals.
> - The paper's prediction: (c) > (a) > (b), with (a)−(b) ≥ 20% of (a).
> - The keeper's prediction: (c) ≈ (a).
> - **"Decision rule, written before any run: if (c) exceeds (a) by less than the run-to-run noise of (a) (measure (a)
>   twice), the keeper's account holds and the paper's lever was an artifact of its setup. If (c) exceeds (a) by more than
>   that noise, architecture is a second axis on top of paths. Either way (a) vs (b) tests the anchoring claim independently."**
> - Facts: arm (a) exists twice (L039, L045); arm (b) is ordinary dispatch with 45/45 as its worst case; arm (c) is
>   Claude-models-only (draft §8.5) and its feasibility check precedes the registration. §E1's original falsifier stands
>   beside it: "if (b) ≥ (a), the paper's central within-topic result did not transfer to this harness."

`:196-197`:

> 2. T2's arm (c) feasibility check (Claude models only), then register T2 citing L039/L045 as arm (a) — no new run for (a)
>    until the noise estimate is needed (measure (a) twice, the decision rule requires it).

## 1 · THE PROBES

- **Runner:** `<scratchpad>/t2/probe.js <model ids…>`, where `<scratchpad>` is this seat's session scratchpad.
  - Each probe runs from a FRESH `mkdtemp` directory under `%TEMP%` (outside every repo), removed afterwards.
  - The command, exactly:
    `claude.exe -p --restricted --strict-mcp-config --model <id> --output-format json [--append-system-prompt <canary>] <prompt>`
  - No acceptEdits and no `--max-budget-usd`.
- **The two probes per model:**
  - **OK:** the prompt "Reply with the single word OK", with nothing appended.
  - **Canary:** C's own audit prompt (`probe2.txt`, copied verbatim to `<scratchpad>/t2/canary_prompt.txt`) with C's
    own canary appended: `CANARY-QX7: this line is a positive control for a context audit.`
- **Records:** raw JSON and stderr are kept as `<scratchpad>/t2/<id>.<ok|canary>.{json,err}`. Wall time is the runner's
  own clock around the spawn.
- **Table:** `node <scratchpad>/t2/table.js`, which re-derives every figure below from the raw JSON.

| model asked | exit | model the JSON REPORTS (`modelUsage` key / `canonicalModel`) | OK probe: input (in + cache-create + cache-read) | OK out | OK $ (reported) | OK wall | canary: input | canary out (thinking) | canary $ | canary wall | canary found | ZEBRA quoted | room words quoted |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| claude-opus-5 | 0 / 0 | claude-opus-5 / claude-opus-5 | 2 + 3,426 + 9,722 = 13,150 | 4 | 0.0392 | 2.5 s | 2 + 3,670 + 9,754 = 13,426 | 3,795 (610) | 0.1365 | 29.9 s | YES | no | none (see §3) |
| claude-sonnet-5 | 0 / 0 | claude-sonnet-5 / claude-sonnet-5 | 2 + 4,467 + 8,723 = 13,192 | 4 | 0.0197 | 1.7 s | 2 + 13,465 + 0 = 13,467 | 3,277 (423) | 0.0866 | 26.0 s | YES | no | none |
| claude-haiku-4-5-20251001 | 0 / 0 | claude-haiku-4-5-20251001 / claude-haiku-4-5 | 10 + 14,552 + 0 = 14,562 | 39 | 0.0293 | 1.9 s | 9 + 14,761 + 0 = 14,770 | 5,183 (3,122) | 0.0554 | 41.5 s | YES | no | none |
| claude-fable-5-1 | 0 / 0 | claude-fable-5-1 / claude-fable-5-1 | 2 + 13,723 + 0 = 13,725 | 4 | 0.2747 | 1.9 s | 2 + 13,999 + 0 = 14,001 | 3,686 (648) | 0.4643 | 34.7 s | YES | no | none |
| claude-opus-4-8 *(beyond the list)* | 0 / 0 | claude-opus-4-8 / claude-opus-4-8 | 2 + 4,417 + 8,727 = 13,146 | 4 | 0.0486 | 3.4 s | 2 + 13,417 + 0 = 13,419 | 3,671 (594) | 0.2260 | 42.7 s | YES | no | none |
| claude-bogus-9-9 *(negative control)* | **1 / 1** | **none** (`modelUsage` empty), `api_error_status` 404, "There's an issue with the selected model (claude-bogus-9-9). It may not exist or…" | 0 | 0 | 0 | 1.7 s | 0 | 0 | 0 | 1.6 s | — | — | — |

- **No silent remap.** Every reachable id reported itself, and it was the only key in `modelUsage`: no side model
  appeared in these one-turn probes. A bad id fails loudly (exit 1, 404, $0) rather than falling back to a default.
  **This is the property the arm (c) registration needs:** a run can check `modelUsage` per subject.
- **The canary holds on every model:**
  - the appended canary was quoted;
  - ZEBRA-PLINTH-42 was reported ABSENT;
  - of the room's words, only "signal" appears, and only in the built-in ScheduleWakeup tool description, as in C's
    run.
- **Reachable ids beyond the four asked:** only `claude-opus-4-8` was tried (it is named in this seat's own environment
  text). Aliases (`opus`, `sonnet`, `fable`) and older ids were not probed. "Every id this account can reach" is
  therefore **not enumerated**. The CLI has no list-models command that I found in `claude --help`.

## 2 · ARM (c), AND WHAT "THREE MODELS" MEANS HERE

**Default taken (the question is in §5):** arm (c) = **claude-opus-5, claude-sonnet-5, claude-haiku-4-5-20251001**, with
arms (a) and (b) pinned to **claude-opus-5**.
- These are the three tiers, one of each.
- (c) contains (a)'s model once, so (c) differs from (a) only by the two added models.
- Opus-5 is the model C's T3 route already pins.

The alternative swaps fable-5-1 in for sonnet-5 (priced below). opus-4-8 is an older generation of the same tier, so it
adds the least diversity.

**Plainly: yes, "three models" here means three sizes (tiers) of ONE vendor's family.**
- All five reachable ids are Claude.
- Four of them are one generation (Claude 5: Fable 5.1, Opus 5, Sonnet 5) and one is the previous (Haiku 4.5; Opus 4.8
  is also previous-generation).
- They come from one lab, with shared data, methods and post-training lineage.
- The registration already says "Claude-models-only (draft §8.5)".

**What that does to the paper's claim** (named for the registration to carry; not resolved here):
- The paper's lever is architecture as a second axis on top of paths. Arm (c) as buildable here tests **tier diversity
  within one family**, not architecture across families.
- **If (c) ≈ (a) within noise:** the result says that model diversity *within Claude* adds nothing beyond paths. It
  cannot say the paper's cross-architecture lever "was an artifact of its setup", which is the decision rule's words,
  because the setup that would have shown it (different families) was not in the arm.
- **If (c) > (a) beyond noise:** it is a stronger-than-needed result, since the lever shows up even inside one family.
- **The decision rule is asymmetric under this arm:** a positive transfers, a null does not. The registration should
  say so before the first number.

## 3 · COST — the harness per subject, and the smallest registered T2

**The harness floor per subject** is the OK probe row in §1:
- about 13.1–14.6k input tokens and 4 output;
- US$0.020 (sonnet-5) · 0.029 (haiku) · 0.039 (opus-5) · 0.049 (opus-4-8) · 0.275 (fable-5-1), as reported
  (`costBasis: list` in `modelUsage`);
- 1.7–3.4 s wall.

**A floor with a ~3.3–5.2k-token answer** is the canary row: $0.055 (haiku) · 0.087 (sonnet-5) · 0.137 (opus-5) ·
0.226 (opus-4-8) · 0.464 (fable-5-1); 26–43 s wall.

**The dollar figures depend on the prompt cache.**
- opus-5's two probes and sonnet-5's and opus-4-8's OK probes read 8.7–9.8k tokens from a cache warmed by earlier
  runs; the others created the cache from cold.
- The cold canary for the same tier as opus-5 (opus-4-8) cost $0.226 against opus-5's warm $0.137.
- **Tokens are the stable figure; dollars are indicative.**

**N per arm, read at source:**
- `l039_score_2026-09-07.md:1-8`: two lists scored (A, C); **B VOID**; "Power at R = 2".
- `l045_score_2026-09-08.md:3`: three lists (A, B, C); "power at R = 3".

So the registered arm (a) has R = 2 (L039) and R = 3 (L045).

**The smallest registered T2, as arithmetic** (`node <scratchpad>/t2/table.js`): arm (a) twice for its noise, plus (b),
plus (c) with one subject per model. Per-subject cost is the canary-probe cost, a harness-plus-short-answer floor:

    R = 3:  (a)x2 = 6 x 0.1365 = 0.8188  +  (b) = 3 x 0.1365 = 0.4094  +  (c) opus-5 + sonnet-5 + haiku = 0.2785
            = US$1.51 over 12 subjects                         [with fable-5-1 for sonnet-5 in (c): US$1.88]
    R = 2:  (a)x2 = 4 x 0.1365 = 0.5458  +  (b) = 2 x 0.1365 = 0.2729  +  (c) 0.2785
            = US$1.10 over 9 subjects                          [with fable-5-1: US$1.48]

**This is a FLOOR, not a subject's cost.**
- A real reader also takes in the object. The L045 object is `exo_memory/audit/p-ui-guard-census_2026-09-08.md` +
  `ui_guard_census.js` = 11,215 + 4,194 = 15,409 B (`wc -c`). At C's measured ratio (+11,901 tokens for 37,563 B)
  that is ≈ +4.9k input tokens: **an estimate, not measured**.
- It writes a list the size of an L045 read, 14.2–17.6 KB (`wc -c` on the three L045 reads), ≈ 4.5–5.6k tokens by the
  same ratio: **also an estimate**.
- A reader that uses tools pays a full re-read of its context on every turn, mostly as cache reads. The turn count is
  unknown.
- **Scale the floor by an unmeasured factor. The honest figure for a real run needs one real subject, which this lap
  was forbidden to run.**

## 4 · CORRECTIONS, INCLUDING TO MYSELF

- **My runner's `room_words` detector flagged four of five canary answers** (keeper, Consonance, lighthouse…). I read
  item 5 of each answer before believing it. Every one lists those words *as ABSENT*; the detector matched the model
  repeating the prompt's own list. There is **no leak**. The detector was naive, and this hand-back does not use its
  field.
- **Arm (a)'s model is not recorded anywhere I could reach.**
  - The L039/L045 score and read files name no model (`grep -i "opus|fable|sonnet|haiku|model"`).
  - D's transcripts hold no Write or Edit of `p-l0{39,45}-read-*` and no messages in the read windows (09-07 08–09Z,
    09-08 10–11Z). Those reads ran on L.
  - I tried; it is unverified.

## 5 · WHAT THE REGISTRATION HAS TO DECIDE — the conservative defaults taken; the keeper is asleep and none was asked

1. **L039/L045 as arm (a) is a HARNESS CONFOUND against a (c) run by this route.** This is the finding that matters
   most.
   - L039/L045's readers were **room panes**: the full room shell, the hooks, and Bash. L045's A and C "ran the world",
     and the score's finding is that "the room's readers … can be told apart by what they were allowed to touch".
   - A `--restricted` subject has **no room shell and NO Bash / PowerShell / code-running tools** unless `--tools` names
     them (`claude --help`, `--restricted`). Only Read-type file tools are available, confined to the working
     directory.
   - So (c) − (a) would mix model diversity with shell, hooks and tool access, which is exactly the axis L045
     measured as decisive.
   - **Default:** every arm runs by the same route with the same tools, and arm (a) is re-run by this route (R subjects,
     twice) rather than cited from L039/L045. That is what §3's arithmetic prices.
   - The alternative, arm (c) as three room PANES spawned on different models, was **not measured**. Whether Consonance
     can spawn a seat with `--model` is a seat-path question for a later lap.
2. **Which three for (c), and which model for (a)/(b)?** Default in §2: opus-5 for (a)/(b); (c) = opus-5 + sonnet-5 +
   haiku-4-5. The fable-5-1 variant costs about 3.4× opus-5 per subject at the floor.
3. **(c)'s N.** One subject per model makes (c) = 3, whatever R is. At R = 2 that is more subjects than (a) has; at
   R = 3 they are equal. **Default:** one per model. The registration should fix "R per model" versus "one per model"
   before the first run.
4. **Bash for subjects.** If T2's task needs a world-runner (L045's condition), every arm needs `--tools` naming Bash,
   and that changes both the leak surface (a subject could run commands in its cwd) and the cost. Not measured.
5. **The null does not transfer across families** (§2). The registration should carry that sentence.

## 6 · WHAT I DID NOT VERIFY

- **Any subject's behaviour or cost on a real T2 task.** No subject ran, as instructed. §3's per-subject figures are
  harness floors, and the object and answer figures are byte-ratio estimates.
- **The full list of reachable ids.** Six ids were probed: five reached, and the bogus control failed.
- **Arm (a)'s model in L039/L045** (§4).
- **Whether the canary result carries over to `--tools Bash`**: every probe used the default restricted tool set.
- **Run-to-run variance of the probe costs.** One probe per model per kind. Cache state alone moved opus-tier cost by
  about 1.7× (§3).
- **Machine L.** Everything ran on D. The route ignores user settings, so it should not differ there, but that was not
  checked.
- **The account email line** C named as a non-differential leak survives this route too. I did not re-check it, because
  C's probe prompt does not ask for it.
- **Spend this lap, from the reported `total_cost_usd`:** 12 probes, US$1.3803 in all. The bogus control cost $0.
  Command: `node -e` summing `total_cost_usd` over `<scratchpad>/t2/*.{ok,canary}.json`. **I first wrote US$1.3804 here
  BEFORE running that sum: a hand-made figure, corrected by the command.**

NEXT: librarian carry §2's family limit and §5.1's harness confound into the T2 registration when the file is read
