# Plan: a tool that follows the shadow track (L259 track 5, pane O, 2026-11-27): a plan, no build

- **The order:** the chair's of 06:35:27Z.
- **The packet:** `loop/packet_t180_class1_next_2026-11-27.md` (room 127cc407), section "Track 5". His word at 00:33 on L, "okay lets do it", in the packet's reading.
- **Base:** builder `landing-1126-batch` **f3cd425**, read only (`git show`, and a `git archive` into my scratchpad). No builder worktree, branch or commit.
- **Names:** [T1] to [T5] as the catalogue has them, and L's installed layouts as "layout N" in `list_layouts` order. No track name, coordinate or file of another author's track is in this plan or its evidence. The mock's shadow is our own shape.
- **Hand-back with the evidence:** `exo_memory/handback/p-l259-follow-plan-O_2026-11-27.md`.

## My bias, stated first

- **I wrote the studies this plan stands on:** the [T3] study, its by-hand count, and the steering method. I also wrote `kn5road.rs`, the reader Road reaches the page through. So I hold a stake in steering being the answer, and in my reader.
- **The registered tests in §7 are for a seat that wrote neither.**
- **The unwelcome outcomes, named before anything is built:**
  - *"The tool lays a script's road, not his: hundreds of steered 8 m pieces no person would change by hand."*
  - *"He does as well by eye (track 4 measures him tonight), and the tool buys time only."*

## The answer, in six lines

1. **Build it, ghost first.** **Follow**, in the reference panel's window, steers short rate pieces onto the shown reference for a stretch he chooses. It joins them into the fewest that stay inside the bars and shows them as a ghost. **Lay** puts them in as ordinary pieces, as one undo step.
2. **It reads both Line and Road.**
   - Line gives the order, the way at every fork, and the corridor. Road gives the centre, the width, the bank, the cup and the edges.
   - Line alone serves on **6 of 44** of L's layouts, by a rule registered before the run (§2).
3. **Pieces:**
   - steered at 8 m, at 4 m where 8 misses, never under 4 m;
   - then joined. The evidence puts the joined count at about a third of the steered count.
4. **It refuses, in words:**
   - a layout with no AI line (15 of 61 on L);
   - a road whose end is off the shadow;
   - a stretch under 40 m;
   - a closed track.

   **It stops** at a jump's lip and at any piece the core refuses.
5. **The classes that stay unmakeable:** it never moves the centreline to fake a shape.
   - **Class 2** is laid at its full width on its centre, and marked.
   - **Class 3** stops where the core refuses.
   - **Class 7** is laid as close as the core allows, and marked.

   Every mark names the metres, the measure, and the class where the tool can tell it.
6. **Cost:**
   - three new source files and three new test files, about 27 rows;
   - one new undo step in `coreshell.js`;
   - `piecewise.cjs`'s ray functions moved to `src/` so the page can load them;
   - a mount in `index.html`, plus CHANGELOG and MAP.

   Tier: prove it. Eight mutation harnesses name `coreshell.js`.

## 1. Would it help a person? (the refusal question, first)

**For it:**
- **Steering is the only route that made class 1's sections at all.**
  - [T3]: 116 of 119.
  - [T4]: 365 of 370, 172 of them only by steering, including 19 of 20 hairpins.
  - [T1]: 75 of 96, 36 only by steering.
  - checked: the catalogue's table; `handback/p-unmakeable-T3-O_2026-11-26.md` (amendment); `handback/p-unmakeable-T4-B_2026-11-26.md` "The count".
- **Class 1's cause is open after two tests** (the catalogue's two amendments):
  - the faster turn row made 0 more of [T3]'s 53;
  - three times the aim's retypes made 1 more;
  - freeing the coupled rows made 0 more.

  A steered follow does not need the cause. It closes the loop on the built road, piece by piece, which is the thing that made the sections.
- **Scripts found the by-hand numbers.** [T3]'s 552 pieces came from:
  - cuts at the read's extremes;
  - steered cuts, pruned;
  - equal plain pieces.

  checked: `handback/p-unmakeable-T3-hand-O_2026-11-26.md`, amendment and method. A person aiming by eye against the shadow was never measured (catalogue amendment 2). Track 4 measures it tonight.

**Against it, kept:**
- **The steered count is not a road a person edits.** [T3]'s 74 sections took 1,767 steered pieces over 15,949 m, 9.0 m a piece. The by-hand forms took 552, 28.9 m a piece (checked: the by-hand hand-back's totals).
  - So the tool is worth building only with its joining step. Without it, it lays a script's road.
- **It does not reach the shape classes.**
  - [T5] made 21 of 71 sections, the misses mostly class 2 and the reader.
  - On [T2] the close pass refuses the whole lap.
  - The tool does no better on those (§5).
- **What it lays is another author's layout, as his pieces.** His words, 2026-11-26 12:48: *"We arent stealing any of the work or assets of the track maker, we are simply using it as reference to understand how to let our system create the shapes in our own way."*
  - No mesh or file enters a document, a save or an export: only his own piece numbers.
  - But the shape is copied far more closely than by eye.
  - That is his call. This plan names it and does not decide it.

**Verdict: not refused.** Built with the join and the ghost, it turns the one route that made the sections into one click and a road of about 29 m pieces. If track 4 finds he does as well by eye in a sane time, the tool's case shrinks to time saved (§7, D4).

## 2. What it reads: Line and Road

**What each is** (the code at f3cd425, checked):
- **Line** is a racing line, not the centre, but `sideLeft + sideRight` still give the full width (`src/reference/ribbon.js:25-26`). The installed lines carry unit normals (`:22`).
- **Road** is *"every surface the track counts as track: its pit lane, run-off and other layouts' roads"* (`app/reference/panel.js`, `NOTE.road`). It reaches the page through `read_reference_road` (`kn5road.rs`).
- **The studies' read was neither alone.** It took the AI line for the order and the mesh for the centre: `tools/piecewise.cjs` `meshCentreline`, *"at each reader station (used for ORDER only)"*. [T4]'s cross-section came from mesh rays.

**The survey.** Its rule was registered before it ran: `registration.md`, sha256 `30bb4769…c3b45c`, 06:45:33Z.

```
checked: node --expose-gc --max-old-space-size=8192 o_follow_survey.js <f3cd425 tree> <AC content/tracks> survey.json
         → 61 layouts, 46 with an AI line, 44 read (2 lines do not read), 14,345 stations every 20 m, 0 with no road under the line
         → "lineAloneServesOn": "6 of 44", verdict "both"
```

**The rule.** Line alone would serve on a layout if all four held at p95:
- the AI side-midpoint within 1.0 m of the mesh centre;
- the width within 2.0 m;
- the bank within 3.0°;
- no road missing on at most 2% of stations.

It had to hold on at least 90% of layouts.

**Layouts failing each bar:** centre 38, width 38, bank 5, missing road 0.

**In the middle of the distribution, Line and Road agree** (the median over layouts of each layout's p50):
- the side-midpoint is **0.38 m** from the mesh centre;
- the width differs by **0.60 m**;
- the racing line itself sits 3.15 m from the centre.

**Per side** (a second run, descriptive only, not a decision):

```
checked: o_follow_survey_sides.js → survey_sides.json: of 28,690 side readings, the mesh runs more than 2 m PAST the AI side on 5,398 (18.8%),
         and stops more than 2 m SHORT of it on 102 (0.4%); the median per-layout difference is 0.078 m; 33 of 44 layouts run past on more than 5% of sides
```

So where Line and Road disagree, it is the mesh running on past the AI's road into what Road also counts as track. inferred: pit mouths, run-off, and other layouts' roads, which Road draws by design.

**What the tool reads, then** (a design inferred from the survey; the rows in §6 hold it):
- **Line:** the stations, every 4 m along the line; the way through every fork; the corridor (each side's reach).
- **Road**, at each station:
  - the mesh walked across from the line's point, with `piecewise.cjs` `crossSection`;
  - `downBand` where that walk reads under half the line's width, as `meshCentreline` does;
  - each side cut at the line's side where the mesh runs more than 2 m past it;
  - the centre is the cut section's arc midpoint;
  - the bank comes from the mesh normal there;
  - the cup and edges come from the cut section's slopes. [T4]'s fit: a bowl with cup C rises about C × (0.17, 0.55, 1.0) at the quarters.
- **Smoothing:** both roads smoothed alike before steering, Gaussian σ 8 m on position and up, ±12 m median on width ([T3]'s registered amendment 1).
- **In his frame:** by the reference panel's own placement (`placeAt`: its start on his start, plus the nudge).
- **No new native command.** `read_reference_line` and `read_reference_road` exist; the tool asks for both.
- **Cost in the page** (checked: `survey.json` `summary.cost`; node at BelowNormal while two heavy runs held both slots):
  - the ray index is built once per pick: median 137 ms, max 1,149 ms;
  - a cross-section takes 0.91 ms a station (median; max 2.76);
  - the largest of the 44 roads has 1,330,225 triangles. The largest installed road, 3.2 M, has no AI line.
- **A layout with no AI line is refused** (15 of 61 on L). Road alone cannot say which road is the layout's where roads meet. The start Road takes from its kn5 (`AC_START_0`) gives a place, not a way.

## 3. The steering, from the hand-backs (the scripts did not travel; §8)

**Per piece:**
- **The piece:** an 8 m rate piece, through the panel's own `extendOptions`, `turnAs: 'rate'`.
- **The steer:** its turn and climb at the end are retyped up to 4 times, until the built heading and pitch at its end are within 0.15° of the reference's. That is [T4]'s ghost8 criterion, and the same loop as [T3]'s G8.
- **The rest at its end:** bank, width, cup and edges are typed at its end from the reference ([T4] ghost8).
- **A window check every 40 m,** against every bar.
  - A window that fails at 8 m is laid again at 4 m, once. [T3]'s G4W and K4 made the tight bends that 8 m missed.
  - If it still fails, it is marked and the follow goes on.
- **Hairpins:** a second pass takes the smoothing's own heading shift off the targets. [T4] window8-2pass: *"Typing the read's smoothed heading as a true heading bends a hairpin entry by about 2°"*.
- **Chained** over the whole stretch, as [T4]'s chain8 laid whole runs between jumps. The road before each piece is the one laid, not a lay-in.
- **A refusal by the core** stops the follow at that piece, with its words in the readout.

**The bars:**
- **[T4]'s by default, the tighter set:**
  - 2.0 m across and 1.0 m up;
  - heading 1.0°, bank 3.0°, pitch 1.5°;
  - width 2.0 m;
  - rims 5.0° and cross-section 5.0°;
  - peak heading rate 15%;
  - roll peak rate max(0.15°/m, 25%).
- **The prediction (§7) uses each study's own set.**

**The join** (what makes it his road):
1. **Interior joints are removed, shortest join first.**
   - The two pieces become one rate piece, steered to the second piece's end pose (heading and pitch within 0.15°), carrying its end values.
   - The join is kept if the merged piece and the 40 m after it stay inside every bar.
   - This repeats to a fixed point.
2. **The whole stretch is measured once more,** and the last joins are undone until it passes.
   - [T3] by hand, method step 3, "from the steered cuts, pruned", made 23 sections the first route did not.
3. **Equal plain pieces** are then tried for each run between kept joints, from 1 up.
   - [T3] by hand, amendment: plain equal pieces beat seven of the counts.
4. **Expected:** about a third of the steered count. [T3] hand ÷ steered: p10 0.18, median 0.36, p90 0.60 (the by-hand hand-back's totals).

**What it lays is cuts, not rows.** E found a cut never refused, and only about 1.3× smoother than the row it replaces (`loop/plan_t180_faster_turn_rows_2026-11-26.md` §2e). So a followed road changes its turn as fast as the reference does. It is unguarded by the rows' bar, as hand-typed cuts already are. The checker shows it as ever.

**Cost in time.** checked: `o_lay_time.js`, our own synthetic shape, 3 tries a piece, BelowNormal, under the same two heavy runs.
- **A try** (`extendCorner`, then the built road's end) costs more as the track grows, because the end is read by building the whole path again. Median per 25 pieces:

  | track length | ms a try |
  |---|---|
  | 300 m | 2.5 |
  | 2.1 km | 21.6 |
  | 8.1 km | 107.7 |

  1,000 pieces took 150.4 s. The fixed re-run, to 250 pieces: 2.8 → 15.9 ms.
- **So the build reads only the tail:** the new piece's segments, built from the last pose (`buildPath` takes a start pose).
  - inferred: a try then stays near the short track's 2.5-2.8 ms at any length. A row holds it (§6).
- **Estimate** (inferred from those figures):
  - 1 km is 125 pieces × at most 4 tries, about 500 tries, and the join about four times that;
  - at about 3 ms a try, that is under 10 s a kilometre;
  - plus the index (at most 1.2 s) and the cross-sections (about 0.25 s a kilometre at 4 m).

## 4. Piece lengths, and what it refuses

| | |
|---|---|
| steered | 8 m; 4 m in a window 8 m missed; **never under 4 m** (the shortest either study laid) |
| joined | as long as the bars hold; **a join never spans** a jump, a core refusal or a marked miss |
| the stretch | from his road's end to a point he types (metres along the shadow) or picks on it. **At least 40 m**, [T4]'s shortest section (anything shorter is one piece to type). No longest: a progress line, and Cancel keeps nothing |

**Refused in words; nothing changes:**
- nothing is shown, or Show is off;
- **a layout with no AI line** (15 of 61 on L): *"Follow needs its AI line: where roads meet, only the line says which road is this layout's."*;
- a line or road that does not read, in the panel's own words (`ribbon.js` `refusalWords`);
- **his road's end is off the shadow:** more than 2.0 m across or 1.0 m up, or its heading more than 1.0° off.
  - The refusal gives the numbers, and says *"move the shadow with its nudge, or start the follow from a point on it"*.
  - A start further off cannot finish inside [T4]'s bars.
- a closed track, which has no end to extend;
- a track whose end is a flight with no landing yet: *"lay the landing first"*;
- an end before the start, or past an open line's end.

**Allowed, and said: an empty track.** The follow starts at the shadow's start, which sits on his (`placeAt`).
- Its first piece is a 40 m lead, not measured, that brings bank, width and rate to the shadow's, as [T3]'s lay-in did.

**It stops** (the ghost runs to there):
- **at a jump's lip** (the line's gap): *"Jump here; its six landing boxes take the shadow's pose."*
  - A second build could type them. [T3]'s built flight ends matched to 0.00 m and 0.00°. On [T4], the pose typed equals the pose got on 7 of 7.
- **at a core refusal**, with its words.

## 5. The classes that stay unmakeable

**The rule:**
- never move the centreline to fake a shape (B's cross-section plan: a sideways shift *"puts a false corner into the line the checker reads"*);
- lay as close as the core allows;
- mark every stretch outside a bar, in the ghost and the readout, with its metres, its measure and, where the tool can tell, its class.

**Class 2, a road not the same on both sides,** until the right width lands. That is B's `d677-right-width-b`: the `wd` channel and its "right width m" field. This plan does not touch it.
- Each side's width is measured.
- The road is laid at its full width on its centre.
- Where a side is off by more than 1.0 m (half the 2.0 m width bar), it is marked *"not the same on both sides here (left X m, right Y m from its centre)"*.
- **When `wd` lands,** the tool types the right width at each piece's end, and the width steps close (the [T5] kind).
- **Still outside it:** [T4]'s level shelf (B's plan (a): the pit lane's shape) and [T2]'s off-centre floor (a one-sided cup). Right width splits the width, not the cup.

**Class 3, a road passing close over itself:**
- The core refuses the piece (`PASS_CLEARANCE`, `app/core/coreshell.js:475`), and the follow stops there with the core's words.
- The readout names **Track ▸ Edge apron**, at whose 0 or 1 m [T3]'s helix was laid. The tool never changes the apron.
- His answer of 11-26 23:00: *"our track has the underside thickness and side aprons, so it has to be different in that way than the study tracks, it cant get as close as some of them"*.

**Class 7, a bank reversal inside a short bend:** there is no route. The catalogue: *"lowering them makes a short bank row ring to −100°"*. The tool lays the bank the core allows and marks the stretch's bank miss in degrees.

**Class 6, a bank past −360°:** the tool sends the bank through `extendOptions`, which does not wrap (`app/core/panel.js`: *"NOT wrapped to ±180"*). So it lays the winding, and the panel shows it as D259 does.

**Class 1** is what the tool is for. **Sharp (class 5)** is not used.

## 6. Its cost, in files and rows (inferred: a plan of the build; tier PROVE IT, because it is geometry and it writes into the document)

| file | what |
|---|---|
| `src/reference/mesh.js` (new) | `rayIndex`, `crossSection` and `downBand`, moved out of `tools/piecewise.cjs`, which requires `fs` and `kn5.cjs` at load so the page cannot load it; plus the side cut at the line |
| `tools/piecewise.cjs` | requires them from `src/reference/mesh.js`; `test/piecewise.test.js` (17 rows) stays green, unchanged |
| `src/reference/follow.js` (new) | the stations (Line and Road, in his frame by the panel's placement), the steer, the join and the measure; pure and node-testable |
| `app/reference/follow.js` (new) | the control: From, To, Pick, Follow, the progress, Lay and Discard. It is given the shell; the reference panel stays read only and its test unchanged |
| `app/core/coreshell.js` | one op, `follow(list)`: the pieces as ONE undo step, each with its recipe (as Extend's `made`), through the pass clearance guard as `commit` does |
| `app/index.html` | the mount (a few lines) |
| `CHANGELOG.md`, `MAP.md` | the entry, and the three new files' lines |

**Rows, red first, on our own test shapes only:**
- **`test/follow_read.test.js` (about 8 rows):**
  - a reference made from OUR OWN built road reads back its centre, width and bank within 0.1 m and 0.1°. Its AI line comes from `encodeAiLine`, its road from its own mesh;
  - a second road joined beside it (a junction) is cut at the line's side;
  - a layout with no AI line is refused;
  - a line that does not read is refused;
  - a station with no road under it is counted;
  - the placement follows the nudge.
- **`test/follow_steer.test.js` (about 12 rows):**
  - our own road, followed back, lies inside every bar;
  - the joined count is no more than the road's own piece count plus 2;
  - the tail read equals the whole-path read;
  - no piece is under 4 m;
  - a jump stops at the lip;
  - a pass under the clearance stops, with the core's words;
  - a one-sided width is marked, not shifted;
  - a bank reversal is marked;
  - Lay is one undo step, and each piece carries its recipe;
  - Cancel keeps nothing;
  - a bank past −360° is laid.
- **`app/test/follow-panel.test.js` (about 7 rows):**
  - each refusal comes in words, and the off-shadow refusal gives its numbers;
  - Lay is one undo step, and Undo takes it whole;
  - Discard changes nothing;
  - nothing of the reference beyond piece numbers reaches a save or an export: the four proofs `reference-panel.test.js` makes, run on a followed track;
  - `reference-panel.test.js` stays green, unchanged.
- **About 27 rows in all.**
- **Harnesses:**
  - the eight that name `coreshell.js`, whole: `app/test/core-close-`, `core-`, `core-pitgap-`, `core-xsec-` and `export-isolated-mutation`; `test/core_chord_`, `core_cup_` and `gltf_mutation`;
  - a new one for `src/reference/follow.js`;
  - none names `piecewise.cjs` or the reference files. checked: grep over the 36 mutation test files at f3cd425.

## 7. The prediction, registered before any build

**Who scores it:** a seat that wrote neither this plan nor the build.

**What and how:**
- on the study tracks installed on L: three of the five, the packet says, told apart by lap length with names kept out;
- section by section, by the hand-backs' metres along the lap;
- each study against its own bars.

- **P1, reach:** on each scored track the tool makes **at least 95%** of the sections its study made: [T3] at least 111 of 116, [T4] at least 347 of 365, [T1] at least 72 of 75.
- **P2, count:** on [T3]'s 74 steered sections the joined count is **at most 690**, 1.25 × the by-hand 552, and **at most 884**, half the steered 1,767. If [T3] is not installed on L, use the scored track's steered sections against its own counts.
- **P3, time:** a 1 km stretch is followed (steer, join and ghost) in **under 30 s** on L.

**Degenerating, said now:**
- **D1:** fewer than 90% of a study's made sections are made (fewer than 105 of [T3]'s 116). Then the tool's read or steer is not the studies', and it does not carry the evidence it was planned on.
- **D2:** the joined count is above half the steered (more than 884 on [T3]'s 74). Then the join fails: the tool lays a script's road, not one he edits, and **it should not ship**.
  - This is the outcome I would most like to be told. It would mean the 552 came from the routes chosen per section, not from a mechanical join.
- **D3:** a 1 km follow takes more than 2 minutes on L. Then it does not help a person sitting at it.
- **D4** (from track 4): he makes all three of track 4's sections by eye in no more pieces than the script's by-hand counts. Then the tool's reason shrinks to time saved, and the plan's case for building rests on whether he wants that time.

**A known gap in the scoring.** The studies' reads are on D only: `read_track.cjs` and the [T1] to [T5] reads (§8).
- On L the scorer measures with the tool's own read, Line and Road. So "made" is measured by a new instrument against old section metres.
- A tool that agrees with its own read can still differ from the study's. Where a section misses, the scorer should report how far the new read itself departs from the study's numbers there (inferred risk).

## 8. What is missing: D's scripts did not travel (checked on L)

- **The steering scripts.** All of them were under D's `G:\consonance-scratch`, and L has no G: drive (checked: `ls /g/` → no such directory):
  - mine, `o-t3-work`: `geo.js`, `profile.js`, `sections.js`, `lay.js`, `steer.js`, `hand.js`, `hand2.js`, `run.js`;
  - B's `b-t4-work`: `sections.cjs`, `probe.cjs`, `lay.cjs`, `fit.cjs`, `fitrun.cjs`, `fitwin.cjs`, `jumps.cjs`;
  - B's `b-fr-work` copies;
  - E's `fr_probe.cjs`.
- **The reader that made the studies' reads.**
  - `tools/read_track.cjs` left the builder at 8868531 (D182) for the skill folder. At f3cd425, `tools/` holds only `bank-ramp-candidates.cjs`, `kn5-move-gate.cjs`, `kn5.cjs` and `piecewise.cjs` (checked: `git ls-tree`).
  - The track-equations skill is not on L. checked:
    - there is no `.claude/` in the builder checkout;
    - `~/.claude/skills` holds only the synced bundle;
    - a `find` under the user folder (depth 6) found no `fit-pieces.cjs`.
  - Copies of the skill's wrappers from September and October sit in room evidence (e.g. `handback/p-verify-B_2026-10-10_evidence/d277v/ff428/.claude/skills/track-equations/`), without `read_track.cjs`.
- **D's note of 15:50** (`librarian/2026-11-26.md`) says the skill's `fit-pieces.cjs` and evals call the reader module.
  - checked, the evidence copy: `fit-pieces.cjs` is a 13-line wrapper that runs `tools/piecewise.cjs`.
  - It fits B-spline curves in space to the mesh, not builder pieces. Its header: *"the pieces are curves in space, checked against the mesh centreline directly, not rebuilt through buildPath"*.
  - **So it is prior art for the read, not for the steer.**
- **The reads themselves,** the cuts, and the registered tolerance files with their hashes: on D only.
- **What follows:**
  - the build writes the steer and the join new, from §3's descriptions;
  - it builds its read from `piecewise.cjs`'s functions plus the line;
  - nothing of D's is needed to build. The prediction is scored with the new read (§7's gap).

## 9. The mock, for his eye

In the hand-back's evidence: `mock_0_window.png` to `mock_5_sketch.png`.
- The real page at f3cd425, headless, with a stand-in native side.
- The Follow block is injected into the real reference panel, wears its classes and the look's tokens, and is marked "mock · not built".
- **The shadow is our own shape:** his road (three Extends, as the page lays them) continued by our own corners, made into an AI line by the builder's own `encodeAiLine`.

| picture | what |
|---|---|
| `mock_0_window.png` | the whole window, Overhead: his road on the shadow, the shadow going on, the panel with Follow ready |
| `mock_1_ready.png` | From (his road's end, on the shadow), To (typed, or Pick on the shadow), the bars in words, Follow |
| `mock_2_ghost.png` | after Follow: the ghost's piece count (steered as N, joined to M), the closest measure, Lay N pieces or Discard |
| `mock_3_marked.png` | a class 2 stretch marked inside the ghost: its metres, each side's width, why, and what would make it |
| `mock_4_stopped.png` | a class 3 stop: the core's words, Track ▸ Edge apron named, the ghost to there |
| `mock_5_sketch.png` | a top-down sketch of what the preview would draw: the shadow see-through, his road solid, the ghost dashed with its joints, the not-made stretch red |

The figures in the mock's words are made up for the picture; only the words' shape is the plan's.

## 10. His calls

1. **Build it or not,** after the mock. The packet: the build is his word.
2. **The copy question:** his 12:48 words against a tool that lays another author's layout as his pieces.
3. **The bars:** [T4]'s by default, or a looser follow.
4. **Where it sits:** in the reference panel's window, as in the mock, or beside Extend.

## Corrections made while writing

- **The lay-time probe first read the end sample from the wrong field.** `buildPath` returns `{ samples }`, not an array, so the end read read nothing.
  - `buildPath` still ran whole on every try, so the times are the build's.
  - Fixed and re-run to 250 pieces: 2.8 → 15.9 ms a try (`laytime250_fixed.txt`), against the first run's 2.5 → 21.6 ms over the same lengths. Both ran under the other seats' load.
- **The side survey's first draft paired the mesh's left edge with the line's left side.** But `crossSection`'s side(+1) walks along cross(f, n), which is the line's right. Fixed before it ran.
- **The mock's first run failed on the same samples field.** Its second ran but drew the shadow 12 m wide against his road's 31 m, and its sketch was unreadable. Both were fixed, and the third run's pictures are the ones kept.
