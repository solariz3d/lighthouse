# L243, pane B: other tracks as a shadow layer in the T-180 builder, a first look (2026-11-26, 08:5xZ)

**Branch:** builder `l243-reference-overlay` at **d0e4c78**, on cfa7ad9 (`l238-piece-ghost`), in the worktree `C:\Consonance\t180-wt-l243`. Committed locally, **not pushed** (the order named no push). Nothing merged, built for release or installed.
**Packet:** `exo_memory/loop/packet_t180_reference_overlay_B_2026-11-26.md` with its 02:2x amendment. Tier: check it.
**Names:** no other author's track name is in any file of either repo, in this hand-back, or in a picture. The tracks are "reference track 1, 2, 3". The key is local and gitignored: `C:\Consonance\t180-wt-l243\out\reference-key.json` (`git check-ignore -v` names `.gitignore:2:out/`).
**His AC folder:** read only. Nothing was written there, and no track file was copied into either repo.

## First: `readAiLine` does not do what the packet says on installed tracks (checked), so I did not use it

The order allowed a refusal here. I did not refuse, because the idea holds and the reason is narrow.
- `readAiLine` (`src/export/ailine.js:203`; the packet said :208, which is the version check inside it) reads the builder's OWN lines back. It refuses any grid by design (`HAS_GRID`).
- On L it parsed **0 of 46** installed `fast_lane.ai` files: **44 HAS_GRID, 2 TRUNCATED**. That is 46 AI lines in 61 layouts across 34 folders; 15 layouts have no AI line. Source: `survey.js` in the evidence, run over the AC tracks folder.
- The road's shape all comes BEFORE the grid (points, then 18 floats a point, then the hasGrid int). So the new reader `readAiShape` (`src/reference/ribbon.js`) reads the same layout up to hasGrid and never reads the grid. `readAiLine` is unchanged.
- With it: **44 of 46 read** (`lengths.js`: `"readable": 44, "refused": 2`). The two refused:
  - a 12-byte stub (version 3, 0 points);
  - a 382,736-byte file that is 8 bytes short of the layout for its 4,160 points (an older variant, I infer; not chased).

## What was built (checked by the rows and the pictures)

| piece | where | what |
|---|---|---|
| reader and ribbon | `src/reference/ribbon.js` (new) | `readAiShape` (works from a Buffer, Uint8Array or ArrayBuffer: the page has no Buffer). `ribbonOf`: two vertices a point at sideLeft / sideRight along the surface. Across is laid by the stored normal, else the camber, else flat. Uint16 batches. `placeAt`: start on his start facing his way, a nudge of x, z, up and turn, **no scale**. |
| the shadow pass | `app/preview/renderer.js` | `extras.reference` → `drawReference`. Teal, alpha 0.45, edges opaque. Depth-tested with no depth written, so his road is always in front where nearer. No fog, because from 2–3 km up the fog left about 5% of its colour (seen in the first pictures). |
| the preview | `app/preview/preview.js`, `app/preview/index.js` | `setReference` / `reference()`, the doc events `t180:reference` and `t180:reference-request`. **Never picked:** `pick` reads only his path. Not in the document, a save or an export: it lives only in the preview's state. |
| the picker | `app/reference/panel.js` (new), `app/menubar/items.js`, `app/index.html` (+7 lines, at the native `call`, away from A's L242 lines at :44) | View ▸ Reference track…: every track and layout, a layout with no AI line listed greyed "(no AI line)", and the nudge boxes. The readout gives length, width and read/build ms. |
| the native side | `src-tauri/src/reference.rs` (new), `src-tauri/src/lib.rs` | `list_reference_tracks` and `read_reference_line`. Read only, under the AC folder `get_ac_root` gives. One plain folder name each, checked inside `content\tracks` after links. Only the bytes up to hasGrid are sent, as raw bytes (`tauri::ipc::Response`): the grid is up to 21 MB on L. |
| docs | `MAP.md` (+5 lines, none next to A's MAP line), `CHANGELOG.md` (one Added line) | |

Files A's L242/L244 touch (`markwindow.js`, `handles.js`, `secondtick.js`, `app/themes/*.css`) are **untouched** (`git diff --stat cfa7ad9`). `app/index.html` is shared with L242, at a different place.

## Rows

- **JS, `node --test test/reference_ribbon.test.js`: 11 passed, 0 failed.** A known file built with the builder's own `encodeAiLine`, with a grid appended, gives:
  - its known length (circle chord loop) and width (10 m);
  - sideLeft on the left;
  - the camber lean, and the stored normal's lean with camber 0;
  - flat when neither;
  - an open line with no closing span;
  - Uint16 batches covering every span once;
  - placement on the anchor with scale 1, and the nudge's move and turn;
  - refusals by name.
- **Red first: not run against a stub.** One row went red for real on its first run: the nudge's turn had the wrong sign, so a +90° turn went right. I fixed the code; the row is unchanged.
- **Mutants, `mutate.js`: 10 of 10 caught, restored byte for byte.** The first run caught 8 of 10. "a batch drops its last span" and "stored normal ignored" survived, so I added the row that counts real triangles and the stored-normal row.
- **Native, `cargo test --lib reference`: 4 passed, 0 failed.** Exit 0, 55 s, at BelowNormal, in its own target dir `C:\build\t180-l243-target` (the global `CARGO_TARGET_DIR` is the Consonance app's). The rows: every layout listed with a no-AI one saying so; the shape read up to hasGrid and not the grid; non-plain names refused before opening; short or nonsense lines refused.
- **The builder's fast subset, `node scripts/test-fast.cjs`, run once at BelowNormal:** `tests 3697 · pass 3669 · fail 2 · skipped 23 · todo 3`, exit 1, in 19.4 min (`fast_suite_summary.txt`).
  - The failure list names four files. I reran each ALONE once, on the branch and at the base cfa7ad9 (the clean `t180-wt-piece` worktree). Both results are recorded (`reds_alone.txt`):

    | file | branch alone | base alone | reading |
    |---|---|---|---|
    | `texture-page.test.js` row 7 (D417) | 10/1 | 10/1 | **Red at the base.** It expects Extend… as the first action row and finds L238's "Place piece, Cancel piece". Not mine. |
    | `core-extra-bank-drag-cost.test.js` (p95 timing) | 3/0 | 2/1 | A timing row: red at the base, green on the branch. Not mine. |
    | `aclook.test.js` | 32/0 | 32/0 | Green alone at both; red only in the full parallel run. |
    | `core_bank_flow.test.js` | 17/0 | 17/0 | The same. |

  - **A fault of mine, during the suite:** I re-ran `mutate.js`, which rewrites `ribbon.js` in place for a few seconds, while the suite was running. A suite file that loaded the preview in that window could have read a mutant. `ribbon.js` was restored byte for byte. `aclook` (which loads the preview) was red in the full run and is green alone, so this may be why; inferred, not shown.
  - The first alone-rerun kept no output (my `findstr` filter could not match the `ℹ` line), so the reruns were run a second time with full output kept.

## The registered line, scored (checked unless marked)

"Failed as a first look if the overlaid road's width or length is off from the installed track's own by more than 5% (checked against ui_track.json's length where it has one), or if he cannot tell his road from the shadow in the pictures."

**Length, the ribbon against `ui_track.json` (`lengths.js`).**
- The three pictured are all within 5%:

  | | ribbon | `ui_track.json` | off |
  |---|---|---|---|
  | reference 1 (tight) | 1,720 m | 1,746 | −1.5% |
  | reference 2 (fast) | 5,755 m | 5,793 | −0.7% |
  | reference 3 (banked) | 10,014 m | 10,000 | +0.1% |

- Over every readable line: **37 of 44 within 5%**. The 7 off:
  - five are ONE point-to-point line shared by five layouts whose ui lengths say 200 to 2,000 m (the line is 2,469 m);
  - one layout reuses a longer layout's line (+8.4%);
  - one layout's line is 18.6% short of its ui length.

  So the ribbon is right; for those 7 layouts the AI line is not the layout's own.

**Width: the "installed track's own" width is its road mesh, read from its kn5 (`kn5road.js`).** At every 25th AI point I measured the run of road under a line across. `ui_track.json`'s `width` is an author's round number (15 m against an AI width of 10.5 m on one), so I did not use it.

Each mode measures only the points that lie on its road, so the AI medians differ by mode. Ratio = AI width ÷ kn5 width, as the median of the per-point ratios.

| | main road key: AI / kn5 (median) | ratio | within 5% | every valid-track surface: AI / kn5 | ratio | within 5% |
|---|---|---|---|---|---|---|
| reference 1 | 12.13 / 12.25 m (ROAD) | 1.005 | 24 of 44 | 12.13 / 13.75 m | 0.927 | 13 of 44 |
| reference 2 | 9.59 / 9.25 m (a custom key) | 1.025 | 123 of 150 | 9.59 / 9.50 m | 1.016 | 123 of 150 |
| reference 3 | 9.61 / 9.50 m (a custom key; 87 of 260 points lie on another key) | 1.021 | 122 of 173 | 10.73 / 10.75 m | 1.028 | 151 of 260 |

- **At the median, within 5% for all three on the main road key.** Point by point, from about half to about 80% of the points are within 5%: 24/44, 123/150 and 122/173.
- Counting kerbs and pits (every valid surface), reference 1 is 7.3% narrower than its paved width.

**Telling his road from the shadow: his call, from the pictures.** His road is grey with white edges; the shadow is teal. Where they overlap, his road is in front. Inferred: they read apart in every Free picture. In `2_overhead.png` his 500 m road is small beside a 5.7 km reference and partly under the readout labels.

## The pictures (local, not committed: other authors' shapes stay out of the public repo)

`C:\Consonance\t180-wt-l243\out\l243-pictures\`, from the real page (`app/index.html` of the branch) in headless Chrome, 1500 × 900. Coast Esses was shown from his pieces folder (read only) and laid with Place piece after two Extends. His track is 500 m with its start at the origin.
- `0_overhead_no_reference.png`: the control, with no reference.
- `1_overhead.png`, `1_free.png`: reference 1 (tight): 1,720 m, 532° of turning a km, 12.1 m wide.
- `2_overhead.png`, `2_free.png`: reference 2 (fast): 5,755 m, 95°/km, 9.6 m.
- `3_overhead.png`, `3_free.png`: reference 3 (banked): 10,014 m, camber 29.1° at the 95th percentile. Its Free view uses the panel's own nudge (x −984, z −91, up 7, turn −133.5°) to bring its most-banked point (30.9°) 35 m to the left of his road, 120 m on, running his way. **The tilt reads weakly in that picture** (inferred by eye); a camera across the bank would show it better.
- `kn5_overhead.png`, `kn5_free.png`: reference 1's road from its kn5, every valid-track surface (204 meshes, 152,397 triangles), through the same shadow pass and placement.

Picked by the numbers (`pick3.js`): tight = the most turning a km of 37 distinct closed lines; banked = the highest 95th-percentile camber; fast = the least turning a km of the rest. Free views look from his start (`t180-camera-focus` s 0, then up and back). The overheads are the app's own camera zoomed out by the wheel; **the overhead frames his track, not the reference** (a gap, if this is built). Harness: `ref_screens.js` in the evidence. Page errors in every run: none.

## How long a read and draw take (checked)

- The shape bytes up to the grid, read in node: 0.6–0.8 ms for the three.
- In the page (stand-in native side), the panel's own readout:

  | | read | build | next frame |
  |---|---|---|---|
  | reference 1 | 1 ms | 4 ms | 2.6–2.8 ms |
  | reference 2 | 2 ms | 7 ms | 2.6–2.8 ms |
  | reference 3 | 3 ms | 17 ms | 2.6–2.8 ms |

- All 44 lines read and built in node: median 4.2 ms, most 28.3 ms.
- **Not measured: the real native read through Tauri IPC.** The headless page uses a stand-in.

## What the ribbon gets wrong (checked unless marked)

- **A racing line, not the centre.** The line swings to the apexes. Its sides still reach the road's edges: the median width is within 5% of the kn5 road.
- **No pit lane.** It is in `pit_lane.ai`, not read.
- **Run-off only where the author widened the sides:** two lines reach 104–111 m wide at some points (`stats.txt`).
- **A layout can carry another layout's line** (the 7 above). Six of the 44 are open, point to point.
- Height and bank come from the file (the y and the normal). **The reference sits at his start's height and is not dropped to his ground** (inferred to be right, not asked).

## "The total shape": the kn5 road instead (checked for three; cost inferred)

- **It reads.** `tools/kn5.cjs readKn5` parsed **20 of 20** kn5 files of the three (`kn5road.js`): 449.5, 529.2 and 634.2 MB per track, 326–488 ms each, warm (the OS cache; cold not measured).
- **The picture shows the whole paved area** (`kn5_*.png`): pit lane, run-off, paddock, and other layouts' and service roads. Wider than the layout picked.
- **Which meshes are road is not one name.** Reference 1's road is AC's own `ROAD`; references 2 and 3 use a custom key from their `surfaces.ini`. Road = AC's ROAD and KERB plus every key the track marks `IS_VALID_TRACK=1`.
- **Cost, inferred:**
  - The page cannot be sent 450–634 MB.
  - The native side has no kn5 reader; `tools/kn5.cjs` is node-only, run from the export side.
  - So the kn5 road needs a Rust reader that walks the node tree, keeps the valid-track meshes (`surfaces.ini` plus AC's defaults), and sends only those triangles: 152,397 for reference 1, about 1.8 MB of positions.
  - About one lap, with rows. The ribbon cost this lap's first half.
  - Not measured: the frame time with the kn5 road drawn (it drew; no figure taken).

## Leaving the machine

- **Removed:** my build dir `C:\build\t180-l243-target` (1.7 GB, made by this lap; `ls` no longer finds it).
- **Kept:** the worktree, which holds the branch, the pictures and the key. `src-tauri/dist` and `gen` were made inside the worktree by the build, gitignored.
- His T-180 app was not touched.
- **Left running: no process of mine.** `tasklist` shows no cargo.exe, rustc.exe or chrome.exe, and no node process names the worktree.

**Corrections in this lap:** the nudge's turn sign (caught by its row); the AI medians in the width table first mixed the two modes (fixed before ringing); and the mutant run during the suite (above).

## Evidence

`p-l243-reference-overlay-B_2026-11-26_evidence/`: the scripts (`survey.js`, `stats.js`, `pick3.js`, `lengths.js`, `kn5road.js`, `kn5mesh.js`, `ref_screens.js`, `mutate.js`) and their name-free outputs (`stats.txt`, `lengths.json`, `kn5road_main.json`, `kn5road_all.json`, `shots7.json`, `kn5shots_summary.json`, `mutants.txt`, `cargotest_tail.txt`, `fast_suite_summary.txt`, `reds_alone.txt`), and `namecheck.js` (every installed folder and layout name against both repos' additions: 15 hits at the last run, all on three common words that are layout names elsewhere (road, full, normal) or on one folder name that occurs only inside "Coast Esses", his own piece; no other author's track name). `survey.json` holds names and stays local.

NEXT: librarian route the pictures in C:\Consonance\t180-wt-l243\out\l243-pictures to him, with the kn5 road's one-lap cost, when this is read
