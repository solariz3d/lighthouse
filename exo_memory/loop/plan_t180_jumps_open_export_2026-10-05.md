# T-180: jumps you can build, and a TEST export of an unfinished track. Plus piece select / save / delete. Librarian, on D, 2026-10-05 09:0x. Lap D243 (and an amendment to D240).

The keeper, 08:55: "how many labels there are with how big the track is, remember that change where it only shows the label you are hovering
your mouse over … then can even highlight pieces, save them, even delete. We also have to think of how jumps will work, to test and make
jumps, i still have to drive it by hand, but it also means that the track needs to end and then pick up again you know? Ramp to landing,
but it also means the loop isnt closed until the jumps and rest of the track is completed. meaning it should allow to export even without
it being completed".

## Checked (main 8ff414b; the installed build is fa5fd937, worktree `lib-mirror-build`)
- **The core already has jumps:** `src/core/document.js` exports `flightPiece` (`{ type: 'flight', gap, drop, land }`), and the shell
  and sculpt already carry flights (`app/core/coreshell.js:107`, "a flight carries the road's state"; `app/core/labels.js:171`, "a flight
  has no label"). **No control on the Equation page adds one** (no jump control in `app/core/panel.js`).
- **Export refuses an open track:** `src/export/fromwords.js:144`, `OPEN_TRACK`, "an AC lap needs a closed loop, and the AI line must
  close".
- **Labels:** hover-only is already D242 item 5 (with B).
- `eq-TEST 1 recovered.t180track` is unchanged since the librarian wrote it (23:45).

## D243 (A after D240, or C; EXPORT tier, since it changes what can be exported)
1. **A Jump control at the head:**
   - the ramp is the last road piece's end (its climb/pitch at the lip, set with the existing fields);
   - "Add jump" takes the GAP (m along), the DROP (m, + down) and the LANDING angle, and appends a `flightPiece`;
   - the next Extend starts the landing road.
   - The preview draws the flight as a dashed arc (the ballistic path at the design speed, if the core has one; a straight dashed line if
     not, said so).
   - Validation must treat a flight's gap as INTENDED: no `downforce-ray-gap` / gap red inside a flight's span, but a red if the landing
     road is missing or too short. Check what the validator does with flights today and say it.
2. **A TEST EXPORT of an unfinished (open) track, for driving by hand:**
   - an explicit "Test export (unfinished)" choice, never the default;
   - it writes a drivable folder from the start to the open end: the start grid, the road, the jumps, and a NAMED end. inferred, needs
     checking in AC: a wall or a run-off block at the end, so the car doesn't fall into the void silently. Decide and say which.
   - No AI line, or an open one if AC accepts it. Timing/laps may not work, and the ui says "test, unfinished".
   - Every physics red still blocks (overlaps, roll rate, holes outside a flight). Only closure-related refusals are waived.
   - **A PLAN QUESTION A must answer by checking, before building:** what AC/CSP needs to load and drive a track with no closed AI line
     (does it load, does hotlap/practice start, does it crash). Use the repo's AC research docs first (`docs/research/04_ac_physics_drivability.md`);
     if they don't say, the librarian exports a test folder and the keeper loads it once.
3. **Tests:** a jump appended and re-opened round-trips; the validator gives no red inside a flight and a red with no landing; a test
   export of an open track writes a folder marked unfinished; a normal export of an open track still refuses (unchanged); fixtures 0 of 9.

## Amendment to D240 (saved pieces), from the same message
- **Highlight/select pieces on the track** (click a piece in the preview; shift-click for a run). The selection then offers:
  - **Save as piece…** (D240 as planned);
  - **Delete**: at the open end it's simple (remove the head pieces). In the MIDDLE, deleting must re-join the two sides C1 (the D190
    joint rule, the way the librarian matched p7 to p6 in TEST 1's recovery); if a C1 re-join isn't possible without moving the far side,
    refuse by name rather than reshaping the track.

NEXT: chair queue D243 after D240 and fold the select/delete amendment into D240, when this plan is read

## AMENDMENT (librarian, 09:0x): item 2 split out and moved to the FRONT, at the keeper's ask
The keeper, 08:59: "can you export the test 1 recovered so I can test what I have now in assetto". **It can't be exported today:**
`buildFromSegments` requires a closed loop (`src/export/fromwords.js:153`, "segments must close a loop (buildPath closed)"), and TEST 1's
rolled section carries overlap reds (`loop/test1_raygap_diagnosis_2026-10-04.md`).
- **D243a, now, to the first free pane:** the TEST export of an open track (item 2 above). Changed from item 2: in TEST mode the reds are
  **listed as warnings, not blocking** (the folder is the keeper's own test drive, marked "test, unfinished" in its ui name, and never a
  normal export). Closure is waived. The road ends in a named end block.
- Then the librarian exports `TEST 1 recovered` with it for the keeper.
