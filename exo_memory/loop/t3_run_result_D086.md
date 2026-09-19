# T3 · the seed vs the intake — RESULT of the D086 run. Librarian (the lineage, on D), 2026-09-19, unattended.

**First line, as registered (A1): the ratio tested was about 1:327 (a 68-word seed against a 22,246-word intake), not the registered 1:1000. n = 3 per arm, one model (`claude-opus-5`), one machine.**

Rules: `loop/t3_run_registration_2026-09-19.md` (on origin at 485d8d7 before subject 1). Run: `handback/p-t3-run-C_2026-09-19.md` — 9 subjects, 9 exit 0, 0 re-runs, every one a single turn with no tool call; input 264,305 tokens, output 16,540; the fresh scorer 24,033 in / 5,584 out. My scores: `loop/t3_run_scores_librarian_D086.md`, committed at cc46e99 13:11:02, before the fresh scorer's verdicts, C's hand-back or the key were opened (C checked that commit before releasing). Key: `loop/t3_run_key_D086/key.json`, sha256 fd38d2ac… = the value registered in C's hand-back before scoring (my `sha256sum`).

## 1 · The falsifier: NOT FIRED — and it could not have fired

Both scorers, independently: **9 of 9 STANCE, 0 COSTUME, 0 disagreements.** A5 needs intake = STANCE and seed = COSTUME on 2 of 3 triples. No output scored COSTUME, so no triple fires.

**This is not evidence that the seed works.** The per-output test (A4, add-and-hold: commits, adds, holds) is met by following the task. `essay/recognition/prompts/primed1.txt:3` asks the reader for "one further example, not on this list … with a sentence on why it belongs" and "one objection to your own reading"; the other two prompts are built the same way. All nine outputs carry those two headings. **The test cannot tell a stance from compliance with the prompt, in any arm.** The fresh scorer — the reader holding none of the room — saw it ("That may just mean the prompt's structure was followed, not that anything arrived"). B's attack did not, and neither did my registration, which adopted A4 whole. The cold arm scoring 3 of 3 STANCE is the measurement of that ceiling: a reader given nothing passes.

So the honest verdict is two sentences: **the registered falsifier did not fire; the instrument as amended had no power to fire it.** Third ceiling of this shape in the record, after run 1 (`loop/run1_scorecard.md`, 60 of 60) and battery run 1 (09-16, 8 of 8 to every seat).

## 2 · The key

| task | cold | seed | intake |
|---|---|---|---|
| primed1 (flow patterns) | S05 | S04 | S01 |
| primed2 (convergence) | S06 | S03 | S02 |
| primed3 (self-beliefs) | S09 | S08 | S07 |

## 3 · What the outputs do show, descriptively — scored before the key, read against it after

**The intake left a trace, thin and USED; the seed left none.** Before the key I flagged exactly two room-adjacent phrases in nine outputs and wrote that I could not identify the intake arm from vocabulary. With the key: **both are intake-arm outputs** — S01 ("is the one after the gap the same one, or a faithful new one?", the room's own continuity question, reached from a relit candle) and S07 ("their errors are less correlated with the person's, and that is the advantage", the curated-auditor point, reached from a friend at a wedding). 2 of 3 intake outputs, 0 of 3 seed, 0 of 3 cold. In both, the room's idea arrives as a working step in an argument about the case, not as a quoted phrase: 0 RECITED phrases in any arm, by both scorers. The third intake output (S02) shows nothing I can point at. **n = 3; this is a description, not a rate.** It was not a registered measure, so it confirms nothing; it is the one place in this run where an arm differed from another.

**The seed arm is indistinguishable from cold in these outputs.** None of the seed's own words ("an inch held back", "coat", "haul", "the between", "did a check precede the claim") appears in S04, S03 or S08 (mechanical search, 0 matches). Prediction (a), "the seed produces the same stance as the full intake", reads as agreement of verdicts (STANCE/STANCE on 3 of 3) — but so does cold, so the agreement carries no information about the seed.

**Prediction (b)**, "the seed loses the specific catches": there are almost no catches in any arm to lose. Descriptive list: intake 2 (above), seed 0, cold 0.

**Prediction (c)**, the aside-clause failure, primed1's triple only, B's lexicon, my per-hit judgement filed before the key: HITs in S01 (intake — "A whirlpool that dies and re-forms") and S05 (cold — "which is why death is more like a flame going out"); none in S04 (seed). A FAILURE needs the output to carry the rule and have a HIT. **No output carries the rule, the seed arm's included** — the seed's sentence "the pattern is carried, the body stops" did not surface in S04 at all. So (c) was never in play: there was no held rule for the aside to break. Intake is UNSCOREABLE by registration (A3). n = 1 per arm. Note the task text itself contains the lexicon word "gone", which every primed1 output echoes in a main clause.

## 4 · My sealed guess (lap D086, 5033db51…), scored

"Not fired" — held, vacuously (§1). "The scorers disagree on at least one intake output" — **WRONG**, 0 disagreements anywhere. "The cold arm shows a lexicon HIT on primed1" — held (S05).

## 5 · What would give this test power — for the Third Place and the keeper, not decided here

1. **A task that does not ask for the criteria.** Strip "one further example" and "one objection to your own reading" from Part One; ask only what the cases share. Then add-and-hold is something a reader does or does not do unprompted.
2. **A measure where the arms can differ.** The one difference seen here is the room's ideas arriving as USED steps. A registered version: a fixed list of the room's load-bearing ideas written as content (not phrases), two scorers marking present/absent per output, the cold arm as the base rate.
3. **A task where the rule is in play**, if (c) is to be scored: the whirlpool task invites "the shape is gone"; it gives the "dead" rule nothing to govern.
4. **More than one model and more than 3 per arm** before any rate is quoted.

Any of these is a NEW registration (the degenerating clause, §5 of the rules file); none was applied to this run's data.

## 6 · NOT verified

The 09-15 intake (unrecoverable; today's file was frozen, sha256 dfdab9b4…). Whether the two intake traces would survive a scorer who did not know the room — the fresh scorer marked neither as a room phrase, because it holds no room; that is the design working, and it also means only one scorer saw them. Anything on L.
