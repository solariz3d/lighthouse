# D210 rule census: SCORE. Where MD rules work, and where they fail. Librarian, on D, 2026-10-02 13:2x.

**Inputs (sha256):** tags `loop/rule_census_list_2026-10-02.md` `1f21c3fe…ffa` (C, `892b9747`, fixed before any rate); rates
`loop/rule_census_rates_2026-10-02.md` `7d722d43…375a` (E, `bee74585`, blind to tags). Join by id via node (the command is in the
librarian's 13:2x turn). 38 rules have a rate; R15 and R17 have 0 applicable; R18 and R35 are NOT MEASURABLE.
**R30's rate is E's substitute form** (files with ≥ 1 label, 0.298). The per-claim rate is 0.000–0.036 from the label watch.

| bucket | n | median | range | (without C's 5 exposed ids) |
|---|---|---|---|---|
| **gated** | 6 | **0.979** | 0.940–1.000 | n 5, median 0.973 |
| ungated **slot** (start / end / template) | 23 | **0.527** | 0.000–0.979 | n 21, median 0.443 |
| ungated **inline-per-claim** | 5 | **0.276** | 0.010–0.447 | n 3, median 0.041 |
| judgment-mid-turn (no bar, ruling 1) | 3 | 0.700 | 0.038–1.000 | n 2, 0.850 |

## The registered hypotheses
- **H1 (gated ≥ 90%): PASSES**, both versions. Every gated rule is 0.940 or higher.
- **H2 (slot ≥ 60%): the prediction MISSES** (0.527, or 0.443 without the exposed ids). **Its falsifier (median < 40%) does not fire.**
  Slot rules are not reliably followed. They spread from 0.000 to 0.979.
- **H3 (inline ≤ 20%): the prediction MISSES on 3 of 5** (R30 0.298 in its substitute form, R44 0.276, R38 0.447). **Its falsifier (any ≥ 50%)
  does not fire.** Inline rules are all under 50%, and the two "number with its command" rules are near zero (R04 0.010, R21 0.041).
- **The frame falsifier (inline median ≥ slot median): does not fire** (0.276 < 0.527; 0.041 < 0.443).

## WHAT IT SAYS, plainly
1. **A GATE is the only thing that reliably works.** Gated rules: 94–100%. Everything ungated is a coin flip.
2. **"Slot vs inline" is not the clean line I predicted.** Inline is worse on average, and per-claim number-citation is near zero. But
   ungated slots range from always to never.
3. **Post-hoc, NOT registered (a hypothesis for the next test, not a finding):** the ungated slot rules that ARE followed ride on an
   action the seat takes anyway: R25 0.979 (ring in the same turn), R26 0.952 (map line), R27 0.919 (the ring's trailer, which the
   server flags when missing), R43 0.938, R03 0.826. The ones that fail are things to remember to ADD with nothing triggering them:
   R07 dossier row 0.000, R10 briefer's bias 0.000, R09 falsifier in the dispatch 0.034, **R37 the librarian opens map/M.md first
   0/15**, R39 asks for a refresher after compaction 0.000, R40 notes before ringing 0.052.
4. **R37 and R40 are this seat's rules, broken by this seat:** 0/15 and 0.052. Recorded against the librarian.

## What it means for retrieval
The check that fails, "a number or claim carries its source", is the inline, ungated, nothing-triggers-it kind: R04 0.010, R21 0.041,
R30 per-claim ~0. **The one feature that moves compliance to 94–100% is a gate.** So the build this points to is a **gated slot**: a
"Sources opened" block in each hand-back or ring, refused by the server when empty or when it names nothing the turn actually
read. That is the Third Place's "refuse, don't remind" (SPINE `:72`), applied to claims. The second reader (D203) is the soft,
after-the-fact version of the same idea. A gate is the hard version, at the moment of sending.
