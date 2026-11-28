# L271, pane C (L): a second-seat read of the grab along the slope, `l271-grab-slope` cc4fa71 (c522ea6..cc4fa71)

Seat: pane C (sibling-0845a868, L). This answers the chair's L271 read (sent 2026-11-28T08:46:20Z). I wrote none of it. Before this section was committed
I had read the packet's "Role 2" (`loop/packet_t180_even_a0_and_slope_grab_on_L_2026-11-28.md:45-63`) and B's record
(`handback/p-l271-grab-slope-B_2026-11-28.md`, whole). I had not read the diff.
**My stake:** none in the grab. Last lap I read the N4a merge's files and page (L270 role 2), the same way this read looks at the page.

## 1. Registered before the diff (committed before I open `git diff c522ea6 cc4fa71`)

**The default is NOT CLEAN.** CLEAN needs every condition below.

| # | condition for CLEAN | what makes it NOT CLEAN |
|---|---|---|
| C1 | the delta is the 4 files B names; in `zonegrab.js` only `follow` changes, by the lines B quotes (and a comment) | any other change to code |
| C2 | **B's claim 1, with a control:** on a flat road with no cup, my own cases (my construction, not B's probe) give the same saved text (sha256 of `serialize`) on cc4fa71 as on c522ea6 in every case. **The control:** the same comparison shows a difference where one is expected (a pull pressed inside the rim of a cupped road, B's R2), so it can see one | any flat no-cup case differs; or the control shows no difference (then the comparison is blind and the 37 of 37 is not checked) |
| C3 | **B's claim 2, with a control:** on a banked turn a horizontal pull leaves the bank within 0.01° of the bank before the grab, every 1 m over the grab's window. **The control:** today's (c522ea6) pull turns it, by about 5° (B and D: 4.9984°) | over 0.01° anywhere; or today's turns it by under 1° (then the case does not exercise the change) |
| C4 | **lifts unchanged:** a straight lift (vertical only) gives today's follow, every channel within 1e-9, on every road I build (flat, cupped, banked, edge piece, tube, half-pipe) | any channel off by over 1e-9 |
| C5 | **the untested three** (an edge piece, a tube, a half-pipe's wall): on each, a horizontal pull and a lift both run, with finite values, and with no refusal today does not also give. I say what the bank, the width and the middle do, today against the branch, and whether it is new behaviour. **On each, the branch's pull turns the bank by no more than today's does** (the change exists to keep the bank) | a throw, NaN, or a refusal only on the branch; or the branch's pull turns the bank MORE than today's on any of the three |
| C6 | **core-pieces-ui row 25, amended by name:** the amendment is true to the mechanism when (a) its expected point is read from the road's own surface, not from `follow`; (b) it is red under c522ea6's `follow`; (c) it is red under a mutant that breaks the slope (the pull whole across, B's M2) and under D's literal form; (d) its tolerance is no looser than the row's old one | (a) false, or any of (b)–(d) passes where it should fail: then the amendment suits the code |
| C7 | the touched rows are green on cc4fa71 (`zonegrab`, `core-pieces-ui`, `handles`) | any `not ok` or cancelled |
| C8 | the CHANGELOG entry states nothing a run of mine contradicts | a contradicted figure or rule |

**Unwelcome outcomes, in words that would make them true:**
- "on an edge piece the slope grab tips the road where today's did not";
- "row 25 was amended to pass, and it would pass a grab that ignores the slope";
- "a flat road is not the same".

Any of these is NOT CLEAN. The answer may also be "do not build this". For him, the point that weighs most is the one B already names: on a bank the edge
leaves the cursor.
