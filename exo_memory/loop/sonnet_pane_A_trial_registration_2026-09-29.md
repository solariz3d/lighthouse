# Pane A on Sonnet 5.5 — the trial, REGISTERED before the switch. Librarian, on L, 2026-09-29 03:3x.

The keeper, 03:30: "So only change A". Only A moves. B (the non-author reviewer), E (registrations and seals), C, the chair and
the librarian stay on Opus 5.5. Why A: the 09-24 census (`loop/specialization_census_2026-09-24.md`, n=78) has A at 71% BUILD,
the well-scoped work Anthropic names as Sonnet 5.5's strength (https://www.anthropic.com/claude-sonnet-5-5, 2026-09-28).

## The switch
- When: at L130's collation, after C rings. A is idle. No lap is interrupted.
- How: `/model claude-sonnet-5-5` in A's pane. Consonance has no per-seat model setting (every seat runs the default;
  `consonance/src-tauri/src/main.rs:8634`). The first hand-back after the switch states its model; if a restart reverts A to
  Opus, the next hand-back says so and the trial pauses until A is switched again.
- Record the switch time and A's first Sonnet hand-back's path here.

## What is measured (per A hand-back, Sonnet laps vs A's Opus record)
1. **Caught-wrong:** claims in A's hand-back that another seat later finds WRONG (the WRONG columns, B's reviews, the keeper).
   Baseline: A's last 10 Opus hand-backs before the switch, counted the same way, BEFORE the first Sonnet one is scored.
2. **Rework:** laps opened only to repair A's landed or reviewed work.
3. **Tokens per hand-back** (the method of `loop/specialization_tokens_2026-09-24.md`; A's Opus figure there: 18.9 M all-tokens).
4. **Reached the keeper broken:** anything of A's the keeper finds failing in his hands.
Scored by a non-author (not A, not the librarian who registered this).

## Stop rules, fixed now
- **Revert A to Opus** if, over the first 5 Sonnet hand-backs: caught-wrong per hand-back is more than 1.5× the baseline, OR
  any A work reaches the keeper broken that B's review passed, OR B's reviews of A's work need a rework lap more than once.
- **Keep, and move C next**, only if all 5 are at or under the baseline on 1, 2 and 4.
- B and E move only after a blind head-to-head (the same packet to a Sonnet pane and an Opus pane, scored by a seat that wrote
  neither). This trial does not license it.
- Usage: the keeper's `/usage` read before the switch and after 5 laps. How plan limits weight models is NOT published
  (inferred cheaper); this is the check.

## Abuse condition
"It's close enough" after the fact is the degenerating move. The thresholds above are the only ones. A miss is reported as a
miss, and the model goes back.

## The switch happened (the keeper did it, before collation)
- The keeper, 03:47: "a is sonnet 5.5 btw". Checked in A's transcript
  (`~/.claude/projects/C--Consonance-instances-sibling-3d57124e/6fe15f0a-….jsonl`): the latest replies carry
  `"model":"claude-sonnet-5-5"`; the first is timestamped 2026-09-29T09:45:06Z (03:45 local).
- **L130 A (`p-l130-readout-A`) ran on Opus** (before the switch), so it is baseline, not trial.
- The first Sonnet hand-back is A's next packet. The baseline (A's last 10 Opus hand-backs) is counted before that one is scored.

## Trial hand-back #1 scored by the non-author (E, `handback/p-l130r-review-E_2026-09-29.md`, 07:3x)
- **Caught-wrong 3**, by E's count:
  - W1: the P3 claim is wrong under real key-repeat.
  - W2: an undisclosed defect: a sideways trackpad swipe zooms ×16.
  - W3: "182 listed mutants" — the file lists 71; 182 is all five mutation files.
- **W2 is a defect, not a claim.** Whether it counts under §"caught-wrong" is open; the registration's words are "claims in A's
  hand-back that another seat later finds WRONG". So it is recorded as 2 certain + 1 open.
- **The baseline is still uncounted.** No verdict until A's last 10 Opus hand-backs are counted by the same rule.
