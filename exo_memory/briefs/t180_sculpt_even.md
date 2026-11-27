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
