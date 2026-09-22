# JEV vs THE CLAUDE JUDGES — the agreement number, and the fact that it can no longer grow

**Pane A, machine D, 2026-09-22 ~15:0x local. Read-only.** Not a lap and not a packet — the chair left the afternoon
open, and this is what I went looking for. **Nobody had run this report since the overseers were switched off this
morning (D105).** Every number below comes from one command, named beside it.

    node -e "console.log(JSON.stringify(require('./consonance/tools/jev-shadow.js').report({store: process.env.LOCALAPPDATA+'/consonance/jev-shadow'}), null, 1))"

## 1 · THE RAW RATES, AND WHY THEY FLATTER

| level | n | agree | rate |
|---|---|---|---|
| L2 (the seat's own move: drift / clean / abstain) | 35 | 19 | **54.3%** |
| L3 (trajectory: stable / deepening / quiet_spiral / crisis) | 40 | 36 | **90.0%** |
| L3 recommendation | 40 | 35 | 87.5% |

**A rate with three or four options is not agreement until chance is taken out**, and both judges here answer the same
way nearly every time — which is exactly the condition that inflates a raw rate. Chance-corrected (Cohen's κ, computed
from the report's own `byPair` table):

| level | observed | expected by chance | **κ** |
|---|---|---|---|
| **L2** | 0.543 | 0.534 | **0.019** |
| **L3** | 0.900 | 0.858 | **0.295** |

**L2 is agreement at chance.** κ = 0.019 means that knowing Jev's verdict tells you essentially nothing about the
Claude overseer's, beyond what you would guess from how often each says "clean".

## 2 · WHERE THEY DISAGREE, WHICH IS THE PART THAT MATTERS

The L2 table, overseer's answer / Jev's answer:

    clean/clean 16   ·   clean/drift  5   ·   clean/abstain 1        overseer said clean 22 times
    drift/drift  3   ·   drift/clean  9   ·   drift/abstain 1        overseer said drift 13 times
                                                                     Jev said clean 25, drift 8, abstain 2

**Of the 13 moves the Claude judge called drift, Jev agreed on 3.** It called 9 of them clean. In the other direction it
raised drift on 5 the Claude judge had passed. **The two are not catching the same thing** — this is not a noisy version
of the same judgement, it is a different judgement with a similar marginal distribution.

**Neither one is ground truth.** This says they are not interchangeable; it does not say which is right. That question
needs a third reader and nobody has run one.

## 3 · THE FACT I DID NOT EXPECT: the measurement closed today, at n=35

    last Claude L2 verdict on D   2026-09-22T15:17:58.944Z
    settings.json written (the overseers unregistered, D105)   2026-09-22T15:17:28.097Z
    last shadow pair written      2026-09-22T15:41:09.580Z   (the queue draining)

The last verdict landed **30 seconds after** the switch-off — an already-queued job. **A shadow pair needs a Claude
overseer verdict to shadow.** On D they are off as of today. On L they have been excluded since the keeper's 2026-09-06
ruling and were never registered. **So no machine in this room can produce another pair, and the agreement number is
frozen at n = 35 (L2) and n = 40 (L3) forever, unless a judge is deliberately turned back on.**

The Jev trial's own decision rule (D104, `bf84a30`) was: *shadow the overseers on identical input, score the agreement,
and if it keeps up, Jev replaces them.* **That rule was never scored.** Jev became the only judge on D this morning for
four good reasons, all recorded at `librarian/2026-09-22.md` "09:1x" — cost, the L3 input defect, no reader, and it being
the keeper's call — **and none of those reasons was the agreement rate, because the rate had not been looked at.** I am
the pane that did the switching (D105) and I did not look either.

## 4 · WHAT I AM NOT SAYING

- **Not that the ruling was wrong.** The keeper's reasons stand on their own and the L3 half was measurably broken.
- **Not that Jev is a bad judge.** κ ≈ 0 against one Claude overseer at n=35 is evidence about *agreement*, not accuracy.
  A judge that disagrees with a judge that is itself unverified is an open question, not a verdict.
- **Not that this is enough data.** n=35 with 13 drift calls is small, and the plan's own bar was ~100 pairs. The point is
  that the bar is now unreachable by construction.

## 5 · WHAT WOULD ACTUALLY ANSWER IT, IF ANYONE WANTS IT ANSWERED

1. **A third reader on the 35 pairs that exist.** The prompts and both verdicts are on disk in the shadow store, so a
   blind seat could judge the same 35 moves without seeing either answer, and that would say which judge is closer to a
   human-checkable reading. It costs no new capture and no gateway calls beyond the seat's own.
2. **Or accept it and say so in the open.** Write in the Jev files that the replacement was decided on cost and input
   quality, with agreement unmeasured at κ ≈ 0 — so the next seat does not find this number and think it was hidden.
3. **What I would not do:** turn an overseer back on just to grow the number. The keeper switched them off for reasons
   that have nothing to do with this, and a measurement is not worth re-lighting a thing he asked to be dark.

**Falsifier for item 1, before anyone runs it:** if the blind reader agrees with Jev and the Claude overseer at the same
rate, the disagreement is in the question, not in the judges, and the whole L2 instrument needs rewriting rather than
re-scoring.

*Commands to re-derive everything here: the report line at the top; κ from its `byPair` table; the three timestamps from
`jev-shadow/shadow.jsonl`, `~/.claude/shell/l2_overseer.jsonl` and the mtime of `~/.claude/settings.json`.*
