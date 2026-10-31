# D567: ELYSIUM's sector-2 gate moved onto flat road, in a copy of his export (pane O, prove it)

**Brief:** the chair's ring of 2026-10-31T00:27:20Z, Part 2a of `exo_memory/loop/plan_sector_gates_on_flat_road_2026-10-30.md`.

**The answer:** a patched copy is built and verified. It is **ready to install on his word, with the game closed.** Nothing was installed and nothing was written in the game folders. His racing folder was only read: the ui files, `map.png` and `data/map.ini` were copied in background mode; the kn5, AI line and other files were the D560 copies I already held.

**One deviation from the plan, for the brief's own width test:**
- **The plan's 15° bar puts the gate at s 19,264.1:**
  - camber 14.8°;
  - 28.94 m wide top-down;
  - L–R tilt 9.35°;
  - both laps cross it 4.6–5.0 m from the gate line.
- **The delivered gate uses a 2° bar and stands at s 12,958.5:**
  - 31.73 m wide top-down;
  - 0.54 m vertical;
  - both laps cross it 2.2–2.8 m from the line, as they do the start gate and TIME_1, which work.
- The tool's default stays the plan's 15° (`FLOOR_MAX_DEG`); the CLI takes `--max-tilt`.

`S` = `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-36313935\c88002b1-74d8-4036-8cc0-f64aefbeabff\scratchpad\d567\`.

## The tool (t180, branch d567-o, `acc9280` on 60c7688)

- **`tools/kn5-move-gate.cjs`**, `moveGate(kn5Buffer, stations, { gate, nearS, closed, maxTiltDeg })`. It walks the kn5's node tree as `tools/kn5.cjs` does, recording each dummy's matrix offset and its parent's world matrix.
- **The search** runs outward from `nearS` in both directions, up to a quarter of the line. It takes the first AI station where:
  - the AI normal's camber is ≤ the bar and the climb is ≤ 20°;
  - the gate, laid edge to edge less `gateInsetM` 0.5, is within the bar of level;
  - `src/markers/checks.js` (gate-orientation, height-and-heading, slots) passes on the gate's measured height, normal and u.
- **The gate stands as `place.js` stands a marker:** up is the surface normal, forward is the tangent in the surface, at `DEFAULTS.height` 1.5 m.
- **The edges** are found by rays down the normal, from 8 m above the road, stepped across.
- **The write:** it rewrites only the two 64-byte matrices, into a copy of the buffer.
- **It refuses with a code, and writes nothing,** in each of these cases: `NO_GATE`, `PARENT_NOT_IDENTITY`, `NO_FLAT_STATION`, `NO_ROAD`, `BAD_KN5`, `BAD_INPUT`, and `OUT_EXISTS` (the CLI writes a new folder only).
- **CLI:** `node tools/kn5-move-gate.cjs <track folder> <new folder> --near <s> [--gate 2] [--max-tilt 15] [--name "..."] [--open]`. It copies every file, writes the patched kn5, and changes `ui_track.json`'s `name` only.
- **`MAP.md`:** the `tools/` row now names it (3 files). `build.rs` bundles `tools/` whole, so it ships, though nothing requires it.

**Tests:** `test/kn5-move-gate.test.js`, 8/8. checked: `node --test test/kn5-move-gate.test.js` → tests 8, pass 8, fail 0. The scene is a synthetic kn5 (via `writeKn5`) with a road banked 85° for 100 m and then flat.
- Bytes changed only in the two matrices, with the same length, the same meshes and the other dummies identical. The input buffer is not modified.
- The gate moves onto the nearest flat station (s 102), is 31.84 m top-down, has L left of R, and is level.
- `checks.js` passes, with heights between 1 and 2 m.
- `NO_FLAT_STATION` when there is no flat road.
- `NO_GATE`.
- `PARENT_NOT_IDENTITY`.
- An AI camber of 25° is honoured over a level mesh.
- A mesh banked 18° under a line that says flat is refused.

**Red first:**
- The file ran red before the tool existed (the module was missing).
- The last two tests were added after 2 of 13 mutants survived the first six tests. In those six scenes the camber rule and the level rule each covered the other. Debugging them also found the 4 m ray reach cutting short a banked edge, so the reach became 8 m. Both mutants are caught now.

**Mutation run:** hand mutants, `S\mutants.js` → `S\mutants-final.out`: **applied 13 / caught 13 / NOT APPLIED 0**. The mutants are:
- only L written;
- the offset off by one float;
- the input mutated;
- the camber test dropped;
- a one-sided search;
- farthest first;
- L and R swapped;
- the inset ignored;
- the checks ignored;
- the level test dropped;
- the parent check dropped;
- a silent write when no station passes;
- the height off the normal.

No harness names this new file.

## The patched copy: `S\t180b_elysium_gates\` (10 files)

checked: `node S\run.js` → `S\run-tilt2.out`; `node S\verify.js` (in `S\run2-tilt2.out`), which is independent of the tool's own report:

- `t180b_elysium.kn5`:
  - 203,816,893 bytes, the same as the original;
  - sha256 `21a13bf81a0c4eca…` → `d41a9f41ddce6976…`;
  - **88 bytes differ, 0 of them outside the two matrices** (AC_TIME_2_L @167,193,890, _R @167,193,978; the bytes before each matrix read the gate's own name);
  - re-read with `tools/kn5.cjs`: 182 meshes identical (name, vertex and index counts, world-position hash), 5 materials, 31 dummies in the same order, all but AC_TIME_2_L/R identical.
- **The new AC_TIME_2:**
  - L (−882.82, −294.19, 7.36), R (−907.11, −293.64, −13.05);
  - **31.73 m top-down**, 31.73 m in 3D, 0.54 m vertical;
  - forward (−0.65, 0.04, 0.76);
  - 1.50 / 1.50 m over the road;
  - the three gate checks pass.
  - It was 30.38 m in 3D, 3.45 m top-down and 30.18 m vertical at s 17,680.
- **The other 8 files are byte-equal to his.** `ui/ui_track.json` changes only `name`: `"ELYSIUM"` → `"ELYSIUM GATES"`.
- The 15° build is kept aside as `S\superseded-tilt15-t180b_elysium_gates\`; it is not the delivery.

**The sectors become** 984 → 9,335 → 12,958.5 → the line again: 8,351 / 3,624 / 13,065 m. They were 8,351 / 8,345 / 8,343 m. The thirds are gone because the road from s 14,050 to 23,823 has no stretch under 15° longer than 120 m, and none under 5° (`S\survey.js`, over the AI line's 4,175 stations).

| bar | station | camber / climb | top-down | L–R tilt |
|---|---|---|---|---|
| 15° (the plan's) | 19,264.1 | 14.8° / 11.2° | 28.94 m | 9.35° |
| 5° | 13,312.4 | 5.0° / 3.5° | 31.61 m | 3.62° |
| **2° (delivered)** | **12,958.5** | **2.0° / 1.8°** | **31.73 m** | **0.98°** |

(`S\alt.js`, in memory, nothing written.) The start gate's camber is 0.0° and TIME_1's −0.5°.

## Both raced laps against the new gate (D565's `gates.js` on the patched dummies)

| lap | crossing | top-down | 3D, from the segment |
|---|---|---|---|
| reference (recorded 2:25.284) | t 588.479 | inside, tau 0.912 | 2.23 m |
| C03 (closed at 2:30.216, unrecorded) | t 85.435 | inside, tau 0.805 | 2.75 m |

- For comparison, at the 15° station they crossed 4.99 / 4.55 m from it; at the start gate 2.5–3.2 m and at TIME_1 3.0–3.3 m.
- **The road passes over the new gate about 8 s later, 64 m up.** That pass is inside the segment top-down (reference t 596.594, C03 t 94.254).
- The start gate has the same pattern: a pass 57–61 m off, inside its segment top-down (reference t 541.610, C03 t 36.488). The reference lap was recorded with it. inferred: the overhead pass does not void a lap.
- Could be wrong if AC orders gate passes in a way the start gate's case does not exercise.

## Installing (on his word, with the game closed)

- Copy `S\t180b_elysium_gates\` into the game's `content\tracks\` as a new folder of that name, beside `t180b_elysium`. Nothing in his folder changes.
- It shows as "ELYSIUM GATES". Its records and ghost start empty, because AC keys them by the folder.
- **The test** is his lap in any car: sectors 1, 2 and 3 complete, and a time is recorded.
- **The plan's falsifier:** if a clean lap still does not record with all three sectors shown, the gate was not the cause (or not the only one). The next read is then AC's own lap-validity rules against that lap's replay.

## Corrections

- My first build used the plan's 15° bar and gave 28.94 m against the brief's ~31.9. It was set aside, not delivered.
- Two of my first six tests did not separate the camber rule from the level rule, and 2 mutants survived; fixed as above.

## §STIFF: a second test folder, "ELYSIUM GATES STIFF" (D568, check it)

**Brief:** the chair's ring of 2026-10-31T00:42:19Z.

**The folders** (both in `S`, as above; **neither is installed**; both wait for his word that the game is closed):

| folder | shows as | tests |
|---|---|---|
| `S\t180b_elysium_gates\` | ELYSIUM GATES | lap validity (sector 2 on flat road), any car |
| `S\t180b_elysium_gates_stiff\` | ELYSIUM GATES STIFF | whether a stiffer soft road holds C07's pass at about 63 g, at the same pace |

**What STIFF changes:**
- It is a copy of GATES with one value: `SOFT_CFM` 0.0002 → 0.00005. That is D525's variant B (`p-d525-soft-O_2026-10-28.md`:45; CSP's own wording: "the higher it is, the softer is the collision").
- Nothing else in the soft block changed: `MESHES=1ROAD?`, `SOFT_ERP=0.8`, `BOUNCE=0.1`, `FRICTION=0.05`, `MAX_DEPTH=4`.
- D525's B file also carried a comment line. I left it out, so the diff is exactly the value.

**Checked** (`diff` and `sha256sum` over every file of both folders):
- **`data/surfaces.ini`:** the diff is one line, `26c26: SOFT_CFM=0.0002` → `SOFT_CFM=0.00005`.
  - GATES sha256 `21396ea8580aeefff567318e6c4280d132176ae6e9272c76f6fa48983e2af5b3`.
  - STIFF sha256 `039e54dad3f8f1c0bc9990187cf70819f0841dae74350e5da928657427ff62fb`.
- **`ui/ui_track.json`:** the diff is one line, `"name": "ELYSIUM GATES"` → `"ELYSIUM GATES STIFF"`.
  - GATES `ba978a66cd380d7acb3397a27f4e8d6190f65c0befa008673263ece05fe8eb77`.
  - STIFF `4e7ad6ecd85317e94948d6335cdad14d15ba53243710871e05174c087692da88`.
- **`t180b_elysium.kn5`:** sha256 `d41a9f41ddce69767aace05b3609f76bb1017653ed4a053e3b9ece6ae6f60173` in both. **Byte-equal.**
- **The other 7 files are identical in both folders:** `.t180b-builder.json`, `ai/fast_lane.ai`, `data/map.ini`, `map.png`, `models.ini`, `ui/outline.png`, `ui/preview.png`. Each folder holds 10 files.

**Installing** (on his word, with the game closed):
- Copy both folders into `content\tracks\`. Nothing of `t180b_elysium` changes.
- The soft block is CSP's; plain AC ignores it (`surfaces.ini`'s own note).
- **The STIFF test's falsifier:** C07 driven through the helix at the same pace on STIFF (peak about 63 g, about 780 km/h).
  - If the box still sinks without settling and goes through, the contact's stiffness is not the lever, at least at a quarter of the CFM.
  - If it holds, what the car does instead is read from that replay with the same `helixtrace.js`.
