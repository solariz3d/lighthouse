# D462: a warning when bank, cup and edge stack in a turn (librarian, 2026-10-25 16:0x)

## The ask (the keeper, 15:56, verbatim)
"One thing that is urking me, is the side flip ups of the track, on turns TEST 10, the car clips and becomes unstable at higher speeds and Gs into the curve, without the side flip ups it didnt happen, so i guess keep em, but it has to be used with discernment. Maybe add a warning, that banking, plus cupping, plus extra banking with the side values which i mean the edge start left edge right edge, should be a warning that this could cause turns to ride rough"

So:
- the edges (edge start, edge left, edge right: the "side flip ups") stay as a feature;
- the builder warns when a turn stacks bank + cup + edge, because that combination rode rough and unstable for him on TEST 10 at speed and load.

## Prior art
- D436 (`handback/p-d436-P_2026-10-22.md`). On TEST 10, the "sudden rises" were at his own bank and edge joints, s 3300–3750: 2.0–2.5 g at 300 km/h and 3.9–4.8 g at 415, from the vertical curvature under the outer wheels where a bank, lip or cup starts or ends. This is likely the same place.
- D459 (running) may add a C2 ease at joints. That would soften the joint part of this, not the stacking itself. The two are kept separate, and D462 lands after D459.
- The existing amber family in `src/validate/index.js`: the 90 g, 55 g-held and low-overhead warnings. A new amber follows that pattern, with a SRC entry and the hover title.

## Parts

**Part 1, pane A: the measure, and its tests. Tier: check it (validator logic nobody can see by looking).**
- Find TEST 10's turns that stack all three. `eq-TEST 10.t180track` lives in `%APPDATA%\com.solariz3d.t180-track-builder\tracks`; copy it and record its sha256 first. Name them by s range.
- Pick a measure tied to what he felt, not just "all three are set". It should be read across the wheel track at the outer wheel line, for example:
  - the roll the car sits in (bank + cup slope + edge angle where the wheels run);
  - or the cross-slope change over the car's width;
  - or the vertical curvature there.
  It has to fire on the stacked turns and stay quiet on the same turns with the edges set to 0. He reports those were fine.
- Wording, in his terms: "amber: bank, cup and edge stack here and the turn may ride rough at speed, at A–B m". Never "keeper".
- Tests:
  - fires on the stacked case;
  - silent with any one of the three removed;
  - empty or flat track;
  - edge values only on one side.
- It's a warning only. Nothing is refused and nothing is changed for him.

**Part 2: the same pane lands it** after D459's landing, by the batch rule (not a release of its own). It joins the next T-180 release batch.

## Out
The edges are not changed or capped. He keeps them; the warning is for discernment.
