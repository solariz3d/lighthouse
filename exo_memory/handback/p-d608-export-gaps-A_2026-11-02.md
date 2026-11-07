# D608: what export time does today about the six defect classes (A, 2026-11-02)

Packet: the chair's D608 (12:41Z). READ ONLY, no code. Tree: t180 `d604-o` = `f1f3416` (worktree `t180-wt-o604`, clean). Nothing was run except reads (`git`, `grep`, `sed`).

## The one structural gap under all six

- The export's only route is `buildFromSegments` (`src/export/fromwords.js:209`; the menu exports reach it through `layouts.buildFromSegments`).
- Validation runs at `fromwords.js:237` on **the road mesh and the pit lane only**, before anything the D604 hull adds:
  - `roadMesh` is built at `:235` from `mesh.scene`;
  - the pit lane's checks are at `src/export/pitlane.js:26-34` and `:137-145`.
- The underskin, the edge apron (with the pit's `1ROAD_APRON_PIT_R` plank) and the catch are added later, at `fromwords.js:306-311`.
- After that, export time runs only two things on the scene:
  - `validateScene` (`src/export/scene.js:33`), which checks format only (names, materials, matrices, finite numbers);
  - `findFins` (`src/export/acready.js:102`, refusal FINS at `fromwords.js:333`), which reads only meshes named `…ROAD…seam` (`acready.js:109`).
- So no export-time check reads the skin, the hull bottom or the apron's geometry. Five of the six classes live there.

checked: `grep -n "withApron(withUnderskin\|const roadMesh\|const welded" src/export/fromwords.js` → 310, 235, 329. The full list of refusals is in the header comment at `fromwords.js:12-27`.

## The six classes

| # | class | today | would it have caught today's defect? |
|---|---|---|---|
| 1 | pit-end step | **SAYS NOTHING** | no |
| 2 | lane-end width | **SAYS NOTHING** | no |
| 3 | bottom depth step | **SAYS NOTHING** | no |
| 4 | tube jag folds | **SAYS NOTHING** about the skin; an abrupt opening may be RED for another reason | no |
| 5 | open skin edges at ring joints | **SAYS NOTHING** | no |
| 6 | slivers | **REPAIRS SOME SILENTLY; REFUSES only standing ones, in road seams** | no |

### 1. The pit-end step

**What runs near the lane:**
- the lane against itself and against the road, with the BVH (`src/export/pitlane.js:26`, `:28`);
- the lane's folds (`:34`);
- the downforce-ray gaps over road, lane and infill across the lane's span (`spanGaps`, `:137-145`).

**Why it would have missed today's step:**
- All of these read the drivable meshes from before the apron, and none compares the edge line along the road.
- Today's step was flush and closed: a 0.5 m sideways step, gap 0, open edges 0 (p-d604 §notch part 2, "Correction to my own first read"). So no ray falls through and nothing crosses.
- inferred, from p-d604 §notch part 1: it shipped in 0.4.36's own export of his ELYSIUM (`before-pit-rejoin-above.png`). The step is in `1ROAD_PIT_in_0`, `_out_0`, `_fill_0` and `1ROAD_APRON_PIT_R`, and that export went through without a refusal.
- No warning in the export code names an edge step: checked: `grep -n "warnings.push" src/export/fromwords.js`.

**Held today by:** the test only, export_apron row 22.

### 2. The lane-end width

- The width is a constant, `TAPER_MIN_W` (`src/geom/pitlane.js:54`). Nothing reads it back at export time.
- The pit-lane refusals are NO_PIT_LANE, PIT_ANCHOR_MISSING, PIT_BACKWARDS, PIT_TOO_SHORT, PIT_OVER_GAP and PIT_JOIN_NOT_FLAT (`geom/pitlane.js:87-146`). BAD_PIT_LANE (`src/core/document.js:299`) checks the document. None of them measures the lane's built end.
- Today's defect was 0.50 m at the leave, against 0.1 m.
- **Held today by:** the test only, export_apron row 22 ("the lane is 0.50 m wide at its leave", red on e911792).
- The comment at `geom/pitlane.js:57` speaks of "the 1 cm floor the export's defect count holds". **No such count exists in export code.** The 1 cm floor is a test: export_apron row 18, `overlapsAndSlivers`, `test/export_apron.test.js:420-481`.

### 3. The bottom depth step

- The hull's bottom is the skin and apron geometry, added after validation (`fromwords.js:310`). No export check reads its depth.
- Today's defects:
  - 0.83 m in one 2 m row under the leave;
  - row 26's figure: 0.090 m in one metre.
  - Both are from p-d604 §notch part 2.
- **Held today by:** the test only, export_apron row 26 (at most 0.03 m a metre).

### 4. The tube jag folds

**What claims a related class, and why it misses the jag:**
- The validator's `fold` (`src/validate/index.js:346`) reads the road's own cross-section, not the skin. The jag is in the skin: 29.1° at the abrupt open and 37.0° at the abrupt close, where the road bends 5.2° and 12.5° (p-d607, "The red run").
- `findFins` reads `…ROAD…seam` meshes only (`acready.js:109`). The jag was a wall side's closing face read inside the skin (p-d604 §tube, row 2), so findFins never sees it.
- BAD_TUBE (`document.js:427`) is a rule on the document, not on the built geometry: it refuses a tube HELD inside the slot band. Both of today's jags pass through the band, which that rule allows, so it passes them.

**The incidental RED:**
- On O's tube lap, an abrupt opening is RED on `downforce-ray-gap` (`validate/index.js:444`), so a normal export of that lap is refused (p-d604 line 43).
- C's fixture shows the same at its slot zones (p-d607, "For the chair and O", last bullet).
- That RED is the road's slot under the ray, not the skin's jag. A jag on an opening that clears the ray check would export.
- inferred: whether the gradual opening (its 8.4° tooth) is RED was not checked; I ran no export.

### 5. Open skin edges at ring joints

- **No export check reads boundary edges in any mesh.**
- The ray check (`validate/index.js:444`, `export/pitlane.js:143`) reads drivable road and lane only, so the drawn skin's cracks are outside it.
- Today's defect: 301 to 341 open skin edges at each closed-ring joint, seen as a line of sky (p-d607, "Rows 3 and 4").
- The road's slot-tip open edges (84, 26, 123 and 124 road edges) are in the road mesh.
  - inferred: the ray check may have read some of them as the slot zones' `downforce-ray-gap`, but it does not look for open edges as such.
- **Held today by:** the test only, tube_cases row 3 (cover 2 mm; O says 1.87 mm against it is thin).

### 6. Slivers

**Repairs, all silent:**
- `weldSeams` (`acready.js:135-185`; floor `SLIVER` = 4 mm at `:82`) drops the triangles under 4 mm thick in meshes whose name matches `/seam/i` (`:145`).
- On f1f3416, `underskin.js:216-225` drops the skin's JOIN zipper slivers. The JOIN name never matched weldSeams' regex.
- `apron.js:58` (`PLANK_MIN_M` 0.05 m) leaves out a tapered plank's rows with no width.
- None of these warns.

**The one refusal:**
- `findFins` (refusal FINS) refuses a triangle that is at least SLIVER thick and STANDS, or one that lies off its seam's rows (`acready.js:102-133`).
- A flat sliver is skipped by the standing test (`thick >= SLIVER`, `:123`) and lies on the rows, so it passes.
- It reads `…ROAD…seam` meshes only, so the skin, the apron and the pit lane are never read.

**Would it have caught today's slivers?**
- **No.** C's 441 to 561 skin slivers per case (e.g. 447 strips 0.12 m long at s 180 m) were in JOIN meshes.
- The apron's 2 zero-area slivers per opening were in apron meshes.
- Both kinds were written at e911792 (p-d607 row 4, red there).

**Two floors, not one:**
- The tests hold **1 cm** round the lane (export_apron row 18) and **4 mm** everywhere drawn (tube_cases row 4).
- Export time holds only 4 mm, and only in road seams, by repairing them.

## The gap list (what a later lap would add, by class)

1. **An edge-line step at the lane's ends.** Nothing measures the built outline along the road. Today: the test only.
2. **The lane's built end width.** A constant, never read back. Today: the test only.
3. **The hull bottom's depth change per metre.** Nothing reads the bottom. Today: the test only.
4. **A skin bend against the road's bend.** No check reads the skin's folds. BAD_TUBE and `downforce-ray-gap` cover other things: the slot band, and the road under the ray.
5. **Open boundary edges in drawn meshes (skin, apron, hull).** No check counts open edges anywhere at export time.
6. **Slivers in every drawn mesh, as a count or a refusal.** Today they are repaired in road seams and the skin's JOIN zipper, with no word. Nothing reads apron, lane or other skin triangles. The 1 cm and 4 mm floors differ between the tests.
7. **The common cause of 1 to 6.** Every check that reads geometry runs before the skin, apron and catch are added (`fromwords.js:235-237` against `:306-311`). A check placed beside `findFins` (`:331`), on the scene about to be written, would see all of it. This is a design note for the ruling lap, not a change.

## Not done
- No export or test was run, so the incidental RED in class 4 is quoted from O and C and not re-derived.
- The app's own export wrapper (`app/install`, the page's route) was not traced past `layouts.buildFromSegments`. inferred: it adds no geometry check, because `fromwords.js:12-27` lists every refusal.

SOURCES: `git -C t180-wt-o604 log/status`; `src/export/fromwords.js`, `acready.js`, `scene.js`, `underskin.js`, `apron.js`, `pitlane.js`; `src/geom/pitlane.js`; `src/validate/index.js`; `src/core/document.js` (grep); `test/export_apron.test.js` (grep); `p-d604-slab-O_2026-11-01.md` §notch, §tube, line 43; `p-d607-tube-test-C_2026-11-02.md`.
NEXT: librarian collates the gap list for the chair, when the librarian reads it; the chair rules the lap that adds the checks, after 0.4.37.
