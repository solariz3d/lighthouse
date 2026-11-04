# What an OPEN (unfinished) track needs to load and drive in AC: research for D243 / D243a (pane E, 2026-10-05, D)

Read-only throughout:
- **The AC install** (`G:\SteamLibrary\steamapps\common\assettocorsa\content\tracks`, 69 tracks) was only read, with no write and no launch.
- **The t180 research docs:** `docs/research/01_ac_export_pipeline.md` and `04_ac_physics_drivability.md` at main `8ff414b`.
- **Instruments:** `survey.js`, `aiends.js`, `ends.js` and `flights.js` in scratchpad `…\scratchpad\openexp\`, each under the heavy-run lock.

## Answers

### 1 · What the folder must contain
- **checked (docs/research/01 §2, a secondary source):** to load it needs `<id>.kn5`, `ui/ui_track.json`, and `data/surfaces.ini` only for custom surfaces. `ai/fast_lane.ai` is listed under **optional**.
- **The export already writes all of those** (`fromwords.js writeFolder`, `trackfiles.writeTrackFiles`), so an open track needs nothing new to LOAD. What changes is closure:
  - (a) the path is built open;
  - (b) the AI line is open;
  - (c) the timing uses point-to-point gates;
  - (d) the road needs an end.

### 2 · fast_lane.ai: open, missing or closed? → **OPEN is what AC ships.** checked
Every point-to-point layout in the install ships a `fast_lane.ai` whose last point is far from its first (`aiends.txt`):

| layout | points | AI length | last ↔ first |
|---|---|---|---|
| `ks_drag` drag1000/drag200 (**Kunos**) | 1,539 | 2,468.8 m | **2,468.8 m (open)** |
| trento-bondone | 11,082 | 17,183.8 m | 5,362.8 m (open) |
| ek_momiji uphill_real / downhill_real | 4,913 / 4,903 | ≈7,570 m | 2,881.6 / 2,876.4 m (open) |
| pk_hakone_touge_pub uphill | 2,889 | 4,445.3 m | 2,465.0 m (open) |
| odawarapikespeak tsubakidownhill | 3,364 | 5,206.8 m | 2,332.4 m (open) |
| redrockvalley IB9 | 810 | 1,269.6 m | 516.7 m (open) |
| control, closed laps: Nordschleife, odawara race, redrock | — | — | 1.5 / 1.2 / 1.6 m |

- **So an open AI line is a format AC itself ships** (Kunos' own drag strip).
- **Missing:** not measured. inferred: it loads, because the research lists it as optional, but practice with AI opponents needs one. **Use OPEN.**

### 3 · Timing → point-to-point gates `AC_AB_START_L/R` and `AC_AB_FINISH_L/R`. checked
- **Marker list:** docs/research/01 §3: "point to point: `AC_AB_START/FINISH_L/R`".
- **On disk:** every open layout's kn5 carries all four (`survey.json`):
  - trento-bondone (with AC_TIME_0 too);
  - 4 ek_momiji, 3 odawara and 2 pk_hakone layouts;
  - redrock IB9/IC6;
  - Kunos' Nordschleife `5.kn5` (touristenfahrten: AB gates and pits, no AC_TIME_n).
- **Kunos' `ks_drag` is the exception:** no AB and no TIME markers, only AC_START/PIT/HOTLAP.
- **inferred:** a drag strip's timing comes from its game mode, not markers.
- **inferred, not measured:** the start/finish lap gate (AC_TIME_0) on an open road is simply never crossed again, so no lap completes. The AB gates are what time a run.

### 4 · The end of the road → **a run-off of road past the finish gate, then a WALL.** checked on disk
`ends.json`: the finish gate's position along each layout's own AI line, and what lies beyond the AI line's end.

| layout | the AI line past the finish gate | drivable road ahead of the AI end | WALL vertices within 60 m of the AI end |
|---|---|---|---|
| pk_hakone uphill | **226 m** | 283 m | 110 |
| odawara tsubaki downhill | **160 m** | 395 m (the road network goes on) | 0 |
| redrock IB9 | **58 m** | 399 m (another layout's road) | 1,526 |
| trento-bondone | 0 m (its line ends at the gate) | 114 m (grass/concrete) | 72 |
| ks_drag | (no gates) its line is 2,469 m against a 2,000 m longest layout, so **~469 m past** | 7 m | 14 |

- **ek_momiji's uphill layout lists an `end_barriers.kn5`** in its models file. checked by name; its kn5 version is not readable by t180's reader.
- **So: no layout ends at the finish line.** Each gives 58–469 m of road after it (or the gate itself is that far before the road's end), and most put walls at the end.
- **Decided for the test export:** the finish gate is **150 m before the road's end** (inside the measured 58–226 m), or a quarter of a short road. The road then ends in a **wall across it** (`1WALL_T180_END`, 4 m tall along the surface normal, both faces), so a car that overruns meets a wall, not the void.
- inferred: a `<digit>WALL` mesh is a built-in physics surface (docs/research/01 §2: "ROAD, GRASS, KERB, SAND and WALL are built in"; the export's surfaces.ini adds only PIT).

### 5 · What the validator does with a core `flightPiece` today. checked (`flights.js`, t180 `fa5fd937`, source `src/validate/index.js`)
- **Every core flight is RED `gap-in-road`** at its take-off:
  - `index.js:280` exempts only a gap whose word is `'jump'`;
  - the core adapter writes its flight gaps with word `'core'` (`src/core/adapter.js:274`);
  - measured on F7 (open, a 30 m gap): reds `{ gap-in-road: [200] }`.
  - **This is the red D243 must fix:** an intended flight is not a hole.
- **The jump check itself runs and passes:** reachable, both landings caught, minimum take-off 425 km/h.
- **"A red with no landing" cannot happen with a core flight.** A `flightPiece` always emits its own landing ramp (40.7 m on F7, `part: 'land'`), so a doc ending on a flight still ends on road. `head-in-the-air` (`index.js:357`) fires only when the last segment is a gap. A missed landing is `landing-misses-zone` (`index.js:363`).
- **A closed lap with a jump cannot be made today:** `close()` refuses `NOT_YET` ("a track with a jump is not closed by this version"). So until close handles flights, a jump track can only be exported as a TEST export.
- **The ray check at a flight's lip and landing: no red.** checked (`flightray.js`): `src/validate/raygap.js` on F7's OPEN export mesh (flight s 200–230.1) gives **0 `downforce-ray-gap` reds**, at the lip, at the landing, and anywhere else. The gap is 30 m against the ray's 1 m reach.

## What this does NOT establish
- **That AC loads and drives the test folder.** Nothing was launched. The loader's acceptance of an open line is inferred from Kunos shipping one, not tried with ours.
- **Whether hotlap/practice starts and times with only AB gates plus our AC_TIME_0.** inferred from the layouts that do exactly that (trento-bondone has both).
- **The car meeting the wall at speed** (it is a plain 4 m wall, not a crash barrier). The keeper's first drive is the check.
