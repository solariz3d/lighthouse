# p-d584-preview-lod-A, 2026-10-31: long tracks, part 3 (the coarse preview road, ELYSIUM's load and the preview's heap)

Seat A. Branch d584-a off land-582 (d08feea), worktree C:\Users\nname\Downloads\t180-wt-a584. Not pushed. Tier PROVE IT.
Shas: see §8 (filled at commit). Scratch: S = C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\scratchpad\d584.
All page runs were headless Chromium (title zz-headless-test, --mute-audio, BelowNormal, no window), with the native side stood in for by a page script that answers the open. Nothing was launched visibly, and no real-window run is parked.

## 1. What the measurement named first (before any change)

**The preview's heap is the mesh's change key, not its vertices.**
- checked: `node S/heap3.js <wt> eq-ELYSIUM.t180track` (a copy of his save, sha256 3452907a…) → one full buildMesh: +898 MB heap. After the mesh is dropped, +844 MB stays.
  - The same segments with unfrozen profile copies: +1080 MB while the mesh lives, then +1 MB.
  - Vertex arrays are 118 MB (`heapparts.js`).
- ELYSIUM has 13,798 segments (25 km), each with its own frozen 137-knot profile.
  - mesh.js `handleKey` kept each piece's whole JSON text: 167.8 M characters.
  - `PART_TEXT`, `SEALED_BY` (profile.js) and `SHAPES` kept a memo per profile for as long as the segments live.
- checked: share per memo (`S/share2.js`, each memo turned off in turn on a copy of src/geom):

  | memo off | kept after drop | memo's share |
  |---|---|---|
  | none | 844 MB | |
  | PART_TEXT | 462 MB | ~382 MB |
  | SEALED_BY | 423 MB | ~421 MB (SHAPES and the sums hang off its copies) |
  | SHAPES | 718 MB | ~126 MB |

- `lean: true` does not help: +880 MB, then +824 MB after the drop.
- This was posted to the board for C at once (the board, A d584, 09:4x). C's branch (d583-c) does not touch src/geom.

**ELYSIUM's open, in the page**
- checked: `S/page.js`, base tree, eq-ELYSIUM → the track shows 9.6–10.3 s after the Open click (three runs), and the page is quiet at 24.9–55.8 s.
- Heap: peak 923–1,151 MB, 802–803 MB after the open (three runs).
- checked: CPU profile `S/prof2.open.cpuprofile`, `callers.js` → 0–14 s is the mesh build (handleKey/partText 1.5–3 s, profile maths), then lines and tangents. The steady frames after that are GPU-bound in the opening overview.

**The 100 km synthetic** (`prof.js synth:100`: 133 pieces, 100.7 km, bowl font)
- 50,395 segments, 6.35 M vertices, 6.25 M triangles; buildMesh 2.5 s; +288 MB.
- checked: base frames timed with gl.finish() (`page.js --frames --finish`):
  - idle, opening view: p95 13.3 ms, 92 of 1,026 frames over 6.9.
  - idle, near the road: p95 1.9 ms.

## 2. The changes

**(a) src/geom/mesh.js: the handle key is a key, not the text.**
- A plain object or array is written as JSON's text would be, but each plain part inside it is replaced by that part's own key. The result is hashed to 128 bits (cyrb128, '#' and 26 base-36 characters).
- A frozen part's key is kept by identity, as its text was.
- A part's key is a function of its text alone, frozen or not, and a key never contains JSON's separators. So two segments share a key when their texts are the same, and otherwise only by a 128-bit collision. (The track model's segkey.js makes the same decision with 64 bits.)

**(b) Two by-object memos are bounded to the newest 1,024 profiles (a Map in recency order):** mesh.js `SHAPES` and profile.js `SEALED_BY`.
- They returned the same numbers before and still do.
- Only the mesher calls sealedNormal (grep).

**(c) app/preview/renderer.js: the far road is drawn from thinned index lists.**
- With `lod` asked for, a chunk of the placed road is drawn by its distance from the eye:
  - nearer than LOD_NEAR (200 m): its own index list;
  - from 200 to 800 m: every 2nd row and every 3rd column of each cell;
  - past 800 m: every 4th row and every 6th column.
- The first and last row and column of each cell are always kept.
- Seams and anything that is not a quad grid keep their own triangles.
- A moved chunk (a drag's window) and the ghost are always whole.
- The ties are not drawn for a chunk wholly past TIE_FADE[1] (250 m), where they are fully faded already.
- The vertices, the mesh, the path, the checker and the readouts are the same objects as before.
- preview.js passes `lod: true`, and its placed-road draw is the only caller.
- Stats gain `coarse` and `triangles`.

**What I did not build: a coarse-first load.**
- checked: `prof.js` on ELYSIUM in fresh processes → full detail 5.5 s; the row grid thinned sixfold (coarse.js) 4.1 s.
- Most of the cost is per-profile setup on 13,798 distinct profiles, not vertices. A coarse-first open would save about a quarter of the mesh time at a real cost in complexity.

## 3. Proof: the checker, the overlap check and the export are byte-equal

`S/proof.js` was run on the base tree (detached worktree t180-wt-a584base at d08feea) and on d584-a:
- The checker is the page's own check job (`checkjob.js`, given the document as the page posts it).
- The overlap job is app/core/overlapjob.js.
- The export is the shell's `buildExport` with the real exporter. Every file was compared except `.t180b-builder.json`, which carries the time it was made.

| track | checker answer | overlap | export |
|---|---|---|---|
| ELYSIUM | sha256 0aac4fe1… equal (470,992 B; 0 red, 28 amber, lap checked) | c003ea98… equal (93 B) | 9 of 9 files equal, 0 differ; kn5 474d0a90… |
| 100 km synthetic | sha256 044ce91f… equal (1,819,676 B; 33 red, 1 amber) | not run (open track) | not run (open track: the export refuses an open loop) |

- CORRECTION, mine: my first checker run on ELYSIUM gave a 235-byte answer, because I passed the document as `JSON.parse(D.serialize(doc))` and the job read it as unresolvable (a JOINT refusal). The page posts the document itself (`checkrunner.js:25`), so I re-ran with `structuredClone(doc)`, and the table is that run.
- The 93-byte overlap answer is the same on both trees; I did not read what it says.
- The near-camera road is the export's own triangles: within LOD_NEAR the draw uses the chunk's own index list (app/test/preview-lod.test.js row 1, content-equal). So the 1 cm bar holds at 0.

## 4. Tests (red first)

**test/geom_mesh_handlekey.test.js (new, 3 rows)**
- On the base: 2 red.
  - "key … is 9834 characters";
  - "638.6 MB stayed after the mesh was dropped".
- The comparison row passes on both trees, as it should: the comparison did not change.
- On d584-a: 3/3 green. With geom_mesh_stalekey, 10/10.

**app/test/preview-lod.test.js (new, 4 rows)**
- On the base: 0/4.
- On d584-a: 4/4.

**app/test/preview-lod-frame.test.js (new, headless, 3 rows; the 100 km track opened through File ▸ Open; gl.finish() inside each frame)**
- base: row 1 red once (p95 8.3 / 8.1 ms, 112 of 1,204 over), then green once (5.1 ms, 0 of 2,072) after the quiet-wait was added. So on this RTX 5080 the base's overview reads 5.1–13.3 ms by load: a frame row alone is not a dependable red.
- Row 3 is the dependable one: "the opening view draws at most 40% of the full mesh's triangles".
  - It is red on the base. Plainly, the base has no triangle count to read, so the row fails there for that reason; the base draws every triangle by construction.
  - d584-a: 1,114,890 of 6,248,980 triangles drawn (17.8%), 97 of 97 chunks thinned.
- d584-a: rows 1–3 green. Row 1 p95 1.4 ms, 0 of 3,313 over; row 2 p95 0.6 ms.

**Mutation (geom, prove it)**
- checked: `S/mut1.tap` (geom_mutation, core_chord, core_cup, core_water and core_xsec mutation harnesses) → tests 206, pass 206.
- applied 195 / caught 195 / NOT APPLIED 0.
- That includes the four new mutants:
  - M-D584a: the key is the text again;
  - M-D584b: the hash reads only 64 characters;
  - M-D584c: SEALED_BY unbounded;
  - M-D584d: SHAPES unbounded.
- Two anchors were amended by name, with a comment: M-D483a follows PART_TEXT → PART_KEY, and M-D483c follows the bounded SEALED_BY line. Their rule is unchanged.

**The touched tests and the app harnesses that name renderer.js / preview.js:** §8.

## 5. Before and after (headless, gl.finish() per frame: CPU and GPU together)

- checked: `S/fin-{base,new}-{synth100,eq-ELYSIUM}.json`, from `fin.sh`, the same window.

| | base | d584-a |
|---|---|---|
| 100 km, idle, opening view, p95 / over 6.9 | 13.3 ms / 92 of 1,026 | 1.4 ms / 0 of 3,097 |
| 100 km, idle, near the road | 1.9 ms | 0.5 ms |
| 100 km, heap after the open | 463 MB | 420 MB |
| ELYSIUM, track shown after the Open click | 10.1 s | 9.0 s |
| ELYSIUM, quiet | 24.9 s | 23.3 s |
| ELYSIUM, heap peak during the open / after it | 1,081 / 802 MB | 724 / 461 MB |
| ELYSIUM, idle, opening view | p95 2.2 ms | 2.1 ms |

checked in node (`S/share2.js`): ELYSIUM's mesh, base → d584-a:
- live: +898 → +409 MB;
- kept after the drop: +844 → +78 MB.

## 6. Not fixed, named: the hover pick misses the bar on long tracks

- A frame that answers a pointer move runs the readout's pick, `preview.js pickAcross`. It projects every station: 50,396 on the 100 km track, about 35 ms (profile `S/prof-synth.look.cpuprofile`: pickAcross 3.7 s under labels.js `sharedPick`).
- On ELYSIUM's overview, the pick refines each kept candidate on 41 points of its own cross-section, which is profile maths at about 300 ms.
- Looking around with the pointer moving: the 100 km track reads p95 50.3 → 26.1 ms in the opening view and 30.1 → 12.5 ms near the road; ELYSIUM's overview 380 → 295 ms. Near ELYSIUM's road it is within the bar: 2.0 → 3.5 ms (a run-to-run spread).
- The pick is a readout: the order says readouts stay on full geometry and that I change only the drawn mesh. A pick that culls stations by box before projecting would give the same answer. That is a packet of its own.

## 7. Overlap with C (export path)

- **src/geom/mesh.js and profile.js are on the export path too** (export → buildMesh). The export bytes are equal on ELYSIUM (§3), so the change reaches C's side only as memory: one export's mesh holds less.
- C's d583-c touches app/index.html, app/lib/nativefiles.js, app/validate-ui/checkjob.js, src-tauri and CHANGELOG.md.
  - CHANGELOG.md is the one file we share: both add bullets under [Unreleased], so expect a text conflict.
  - Otherwise no file in common.

## 8. Commits, the touched tests, the map

**Commits on d584-a** (by named paths; not pushed):
- 1e6bd81 "A long track's preview mesh keeps a short key per piece and bounded shape memos, so its memory stays small": src/geom/mesh.js, src/geom/profile.js, test/geom_mesh_handlekey.test.js, test/geom_mutation.test.js.
- 82c629e "The preview draws the road coarser far from the camera; the export, the checker and the readouts still read the full road": app/preview/renderer.js, app/preview/preview.js, app/test/preview-lod.test.js, app/test/preview-lod-frame.test.js, MAP.md (the 3D preview row), CHANGELOG.md.

**The touched tests and the app harnesses** (checked: `S/touched.tap`, 37 files under the lock)
- The files:
  - 22 app tests: preview*, look, aclook, sky*, theme, sculpt-drag-model, sculpt-wash, cheap-ghost, drag-ghost, guides;
  - 11 geometry tests;
  - 4 app harnesses: mutation, theme-mutation, core-mutation, core-xsec-mutation.
- Result: tests 656, pass 654, fail 1. The one more row is aside from both counts: preview.test.js's list row is an existing TODO.
- The one fail was theme-mutation S12, NOT APPLIED: I had put `lod: true` after `time: skyTime(t)`, so its anchor `", time: skyTime(t) });"` occurred 0 times.
  - Fixed in the code, not the harness: `lod: true` now sits before `time:`.
  - Re-run (`S/touched2.tap`, theme-mutation + sky + preview-lod): 69/69, and S12 applied and caught.
- App harnesses: applied 247 / caught 247 / NOT APPLIED 0, counting S12 from the re-run.

**The map**
- MAP.md: the 3D preview row now names renderer.js `coarseIndices` and `LOD_NEAR`.
- exo_memory/map/A.md: one line.

**leftovers.js at 17:08:30Z, as it prints:**
```
leftovers · 2026-10-31T17:08:30.267Z · read-only
tab proxies          UNCALIBRATED (read 0, and the control made none (0 → 0 → 0))
worktrees            Desktop/lighthouse 38 linked + main
strays               not scanned (give --strays <folder> --prefix <name>-)
fake roots           0
orphan browsers      0 headless roots whose parent is gone
our long-running     0 (older than 120 min, infrastructure left out)
```

**Worktrees**
- The base worktree t180-wt-a584base was removed. It held only my copy of the frame test (untracked).
- t180-wt-a584 stays until the landing takes d584-a.

**Falsifier (the plan's), as it stands**
- A 100 km track that still crashes the page: not seen.
  - checked: heap after the open is 420 MB on the 100 km synthetic, and the page ran 3 rows plus the open with 0 page errors.
  - The export of 100 km is C's (an open track does not export).
- ELYSIUM's export changing bytes: not seen (§3).
