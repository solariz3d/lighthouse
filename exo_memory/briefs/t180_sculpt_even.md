# T-180 track builder: Sculpt cannot make a stretch even (opened 2026-11-27, L, by the librarian)

## His words (verbatim)

- 2026-11-27 01:11 (L), the end of his answer 6 (whole in `briefs/t180_unmakeable_shapes.md`): "we might have to do a refactor on the sculpting feature"
- 2026-11-27 04:59 (L): "how has the sculpt feature changed? It worked before, but was wonky and wouldnt make consistent pieces, it would be like freehanding something that should have some form of snap to a position to make the surfaces even, for an example on the old sculpt, you could grab the edge of a turn to make it wider, but then it would be impossible to smooth out the rest of the turn where you didnt drag, becoming a battle to get it all the same thickness by hand and eye, leaving a scuffed look to the track that isnt completely smooth and seemless, you get what I mean?"
- 2026-11-27 04:59 (L), right after: "its like trying to take a lump of playdough and stretch the edges into a half perfect circle from stretching it with your fingers, you pull the middle of the circle up, then the edges to make a curve but it will be janky"
- 2026-11-27 05:00 (L): "idk how to explain it"
- 2026-11-27 05:06 (L), in answer to the librarian's "Every Sculpt tool adds one bump ... You get a hump, then you add more humps next to it to even it out, and the seams between humps are the scuffed look.": "you got it spot on though about the humps"

## State (05:00, checked by the librarian at builder landing-1127-l263 c522ea6, the build installed on L)

- **Tonight changed nothing of this.** Tonight's Sculpt changes are the bank handle and the bank brush carrying past a full turn and past two.
- **Why it is as he says** (read in the code): every Sculpt brush adds one bump, strongest at its centre and fading to nothing at the edge of its reach (`src/core/sculpt.js:1-2`, "Add Δ·f(|s − s₀|/r)", f a smootherstep falloff). A selected run of pieces only sets where the bump sits and how wide it is (`app/core/coreshell.js` `toolWindow`, :535); a comment there records "a two-piece run landed half the value asked" at a piece's middle (:532).
- **Smooth** (tool 9) is a relax of one setting toward its neighbours (`sculpt.js:336`); it irons a wobble and does not bring a stretch to one value.
- **No tool sets a stretch to one even value.** A grep of `sculpt.js`, `coreshell.js` and `panel.js` for a plateau, a level or a set-over-a-run finds none.
- Evidence for a refactor, from tonight's bank work: `handback/p-l260-sculpt-carry-A_2026-11-27.md`, "For a refactor of Sculpt".
- Next: a plan and a mock, `loop/packet_t180_sculpt_even_2026-11-27.md`. Nothing is built before he has seen it.

## State, 05:13: a plan and a mock exist

- Plan `loop/plan_t180_sculpt_even_2026-11-27.md` (pane A, hand-back `handback/p-l265-sculpt-even-A_2026-11-27.md`): the pick is a LEVEL, bring a selected run to a value (typed, picked from a spot, or dragged with a snapping readout). His nine calls are its section 8. Nothing built.
- The mock pictures do not show the road edge yet; a second render with the camera on the turn is ordered before he is shown.

## State, 05:29: he has been shown the mock

- Sent to him: `handback/p-l265-sculpt-even-A_2026-11-27_evidence/even2_4grabs_far.jpg` (untracked): his turn with one grab per piece, before and after the prototype level, true scale.
- Found by pane A in the second render: a grab also lowers the road's centre by 0.24 m where it pulls, and a level of the width alone leaves those dips (the checker's 5 reds stay). His words were about the SURFACES, so the plan's test gains a surface row and the level has to carry the height too. Ordered as an amendment to the plan.

## State, 05:58: the plan is measured on a flat turn and put to him

- `loop/plan_t180_sculpt_even_2026-11-27.md` (amended 11:43Z, 11:52Z, 11:57Z): the level E5 brings the width, the centre's height and the sideways shift to values. From both flat starts all seven registered rows pass (spreads 0, the held rim 0.0000 m across, 0 reds). The rims rise 0.4353 m (his call 10). A banked turn whose bank changes along the run is NOT evened and not designed (his call 11).
- Why a grab dips the road: it scales the section about the far rim, so on a cupped road the centre drops (0.2403 m on his example); cup 0 gives 0.
- The plan's section 8, eleven calls, put to him with the librarian's leans. No build until his word.
- 2026-11-27 06:01 (L), to the eleven calls with the librarian’s lean on each: "do what you think is best"

## State, 2026-11-27 07:17 (L): the banked direction failed; nothing built

- `handback/p-l267-sculpt-even-build-A_2026-11-27.md`, "Stage 1, measured (13:16Z)" (628f736f): the librarian’s direction for a banked turn (even = the smooth ease between the run’s two end values) fired its registered falsifier. It flattens the designed roll-in (bank 17.4425 degrees off the design). Holding the centre’s height draws new reds on a banked road. Keeping the bank as found keeps the grabs’ 5.0 degrees.
- On a flat road the tool’s rows all pass, as before.
- Stage 2 (the build) not started. A second probe is written: `loop/packet_t180_sculpt_even_banked_probe2_2026-11-27.md`. Its ring is held while the width-hold builder works.
- Found by the planner: the plan’s banked test road banked the turn away from its centre (4 reds of its own); banked into the turn it has none.

**His word, 2026-11-27 07:19 (L):**
> "try to stop new work in motion, when all is done, push the relevant handoffs so we can pick up on desktop, then after, give me a solid run down of tonights work and where its headed"
The second probe is not dispatched; it is queued for D in the handoff.

## State, 2026-11-27 11:2x (D): the second banked probe is in; nothing built

- `handback/p-d678-even-banked-probe2-A_2026-11-27.md` "Results" (3555f20f; registered first at ca7e726d). By the rule its
  planner fixed before the run, none of the three candidates is built.
- **The grab:** pulled along the road's own slope instead of horizontally, it leaves the bank untouched (0.0000 degrees, one grab
  and eight) and is byte-identical to today's grab on a flat road. On a banked road it changes what a pull does: the same 4 m
  pull widens 3.7956 m (today 3.8559), and the centre rises 0.4306 m on a bank into the turn (today it drops 0.2403). Today's
  grab flattens the bank 5.0 degrees each time. Changing the grab is his word; asked 11:2x.
- **The level:** exact on a flat road and on a bank constant over the stretch. Where the design's bank changes inside the
  stretch it draws one red at the change's end, from the untouched road too. Whether that red is a new bump or the checker
  reading a line of the designed surface it did not read before is the third probe:
  `loop/packet_t180_sculpt_even_banked_probe3_2026-11-27.md`.
- Bank given back by arithmetic after the fact (no change to the grab) is exact after one grab only; after eight it leaves
  0.26 to 4.02 degrees.

## State, 2026-11-27 12:4x (D): the third probe is in; the build is ordered

- `handback/p-d678-even-banked-probe3-A_2026-11-27.md` (7a023d12; run 2 registered at 33e7c780). The red at the ends of a bank
  ramp was the level's own: it read the bank from the track file, and the builder builds a rounder roll there (up to 2.4286
  degrees apart; `adapter.js` `bankPlan`). Reading the built roll removes it: no red on a turn banked into its centre, and the
  same bytes as before on a constant bank and a flat road.
- On a road banked AWAY from its turn the new middle runs 2 m to the side, and that line already reads red on the road as it
  stands (down to -8.1 g at the checker's speed) where the old middle read +7 g. The level adds no bump there; the tool will
  say so in words.
- Build ordered: `loop/packet_t180_sculpt_even_build_on_D_2026-11-27.md`. Pictures before any install. The grab is not changed;
  that waits on his word.
- **Two findings for him, changed by nobody:**
  1. The built roll on the ramping test road still accelerates at 0.00055 rad/m2, over the bank's own bar of 0.0001 (the
     planner infers the rounding window cannot cross a piece's joint). The same kind of case as C's 104 of 1,050
     (`loop/handoff_t180_2026-11-26-D.md`, "the smoothness limit").
  2. The checker's side lines leave out the roll rate: they read +6.98 g where a line 2 m off the roll's axis reads -0.66 g.
     A lead for his 05:41 words that clipping is worse on corkscrews (`briefs/t180_unmakeable_shapes.md`): a car off the axis
     of a fast roll takes a load the checker does not count. Inferred, not measured against a replay.

## State, 2026-11-27 15:0x (D): Even is built; pictures put to him; a repair round and a read are running

- Builder branch `d678-even-a` 437590e (on c522ea6), on origin, in no build. `handback/p-d678-even-build-A_2026-11-27.md`.
- Flat turn after eight grabs: width 14.06 to 16.12 m becomes 16.00 to 16.00 m, the inner edge back to the road's own place,
  the checker from 2 red and 6 amber to 0 and 0. Banked into the turn after a Width brush: the inner edge within 6 mm, no new
  red. After today's grab on a banked turn Even keeps the grab's 5 degrees of flattening (the inner edge 0.10 m off, one red
  left that is the grab's).
- Not finished, by the builder's own registration: the release's check takes 35 s on his largest closed lap; 0.077 m where
  the road's own width changes across the stretch; mutants. Repair and read ordered:
  `loop/packet_t180_sculpt_even_build_on_D_2026-11-27.md`, "Amended 14:5x".
- **Pictures put to him:** https://claude.ai/artifact/UYhbuWYjLgM74gWyAY6XcK (four of the nine; the rest untracked in the
  hand-back's evidence folder). His call, still open: the grab along the road's slope.
