# t180 suite profile, D226 (pane E, 2026-10-03, D)

**What:** every t180 test file (138: `test/*.test.js` and `app/test/*.test.js`) at local main `90c1a3e`, worktree `C:/Users/nname/Desktop/worktrees/e-suite-wt`, run ONE AT A TIME under the heavy-run lock with nothing else of mine running.
**How each file ran:** `node --max-old-space-size=4096 --test --test-concurrency=1 --test-reporter=tap <file>`, with B's serial shim preloaded (any child's `--test-concurrency=<n>` becomes 1), the post-crash conditions.
**Measured:** wall time; PEAK working set summed over the file's whole process tree, sampled every ~250 ms (`Get-CimInstance Win32_Process`); whether the test spawns processes of its own (tree depth ≥ 2 below the runner).
**Instrument:** scratchpad `suite/profile.cjs` + `sampler.ps1` (sha256 in the hand-back). Raw rows: `suite/prof/profile.json`.

## Runs, and what was discarded

- **16:18 run: DISCARDED.** It completed 4 files, then ran `app/test/core-mutation.test.js` from 16:18:28 until the PC crashed at 16:22 (reboot 16:29:08). The profiler was the only heavy job. Its shim log was written to a relative path inside the worktree and lost, so whether that harness's inner suite ran at concurrency 1 is NOT checked (inferred yes: the shim loads before the harness destructures `spawnSync`).
- **An earlier 15:4x run: DISCARDED.** My profiler died on a parent-pid cycle (Windows reuses pids) after 4 files; fixed with a visited set.
- **Segment 1, 17:55–19:14:** files 1–17, from the top. Stopped cleanly at a file boundary to yield the lock to B (the chair's request); the 18th file's partial start was killed and re-run.
- **Segment 2, 19:28–19:52:** files 18–138, resumed. The tree walk now also refuses a "child" older than its parent (a reused pid): segment 1's `app/test/mutation.test.js` row lists `Discord.exe` among its children, so its 2.0 GB peak is an UPPER bound.
- **Free RAM never fell below 32 GB** (os.freemem, every 250 ms) over both segments.

## Totals

- **138 files, 6167.0 s serial** (sampler running). Tests: 2086 pass, 0 fail, 6 skipped, 7 todo; every file exited 0.
- **HEAVY: 20 files, 5404.0 s (87.6%).** LIGHT: 118 files, 763.0 s (12.4%).
- The two app mutation harnesses alone: 4597.0 s.
- **Largest LIGHT peak: 967 MB** (app/test/validate-ui-incval.test.js). 22 light files finished between two samples (peak reads 0: under ~0.5 s each, not measured).

## HEAVY (by the plan's rule: spawns children, OR peak > 1 GB, OR a mutation harness)

| file | wall s | peak MB | why |
|---|---|---|---|
| `app/test/core-mutation.test.js` | 2992.9 | 890.6 | mutation harness, spawns children |
| `app/test/mutation.test.js` | 1604.0 | 1999.8 | mutation harness, spawns children, peak > 1 GB |
| `test/core_xsec_mutation.test.js` | 310.9 | 1732.8 | mutation harness, spawns children, peak > 1 GB |
| `test/validate_xsec.test.js` | 120.6 | 1654 | peak > 1 GB |
| `test/core_cup_mutation.test.js` | 104.8 | 968.7 | mutation harness, spawns children |
| `test/core_water_mutation.test.js` | 51.2 | 382.1 | mutation harness |
| `test/roundtrip.test.js` | 39.2 | 685.3 | spawns children |
| `test/texmaker_mutation.test.js` | 33.6 | 271.8 | mutation harness, spawns children |
| `test/export_words.test.js` | 33.4 | 732 | spawns children |
| `app/test/core-xsec-mutation.test.js` | 28.1 | 273.8 | mutation harness, spawns children |
| `test/geom_mutation.test.js` | 27.4 | 1664.6 | mutation harness, spawns children, peak > 1 GB |
| `test/core_chord_mutation.test.js` | 19.3 | 504.1 | mutation harness, spawns children |
| `test/core_cup_fixtures.test.js` | 17.8 | 796.5 | spawns children |
| `test/geom_sculpt.test.js` | 6.4 | 2045.1 | peak > 1 GB |
| `test/core_ramp_mutation.test.js` | 4.8 | 401 | mutation harness, spawns children |
| `test/lookmatch_mutation.test.js` | 3.6 | 226.3 | mutation harness, spawns children |
| `test/prove_render.test.js` | 2.1 | 237.5 | spawns children |
| `test/texmaker.test.js` | 1.9 | 176.6 | spawns children |
| `test/fourier.test.js` | 1.0 | 320.5 | spawns children |
| `test/read_track_hints.test.js` | 0.8 | 158.9 | spawns children |

## LIGHT (every other file)

| file | wall s | peak MB |
|---|---|---|
| `test/core_sculpt_modes.test.js` | 243.2 | 450.6 |
| `app/test/core-shell.test.js` | 45.6 | 560.2 |
| `test/core_cup_export.test.js` | 40.9 | 873.8 |
| `app/test/validate-ui-incval.test.js` | 40.7 | 967 |
| `app/test/shell-close.test.js` | 37.8 | 396.7 |
| `test/doc-e2e.test.js` | 34.8 | 668.8 |
| `app/test/export.test.js` | 31.9 | 469.7 |
| `test/export_acready.test.js` | 28.2 | 400.3 |
| `test/doc-connector.test.js` | 27.3 | 393.1 |
| `test/export_csp.test.js` | 14.2 | 461.2 |
| `app/test/validate-ui-jumpdefault.test.js` | 13.1 | 356.1 |
| `test/core_close.test.js` | 13.0 | 406.1 |
| `app/test/export-csp.test.js` | 12.7 | 410.4 |
| `test/markers_export.test.js` | 12.3 | 404.6 |
| `app/test/sharedpath.test.js` | 12.2 | 407 |
| `app/test/onboarding.test.js` | 11.7 | 459.9 |
| `app/test/palette-dom.test.js` | 11.5 | 327 |
| `app/test/aclook.test.js` | 11.5 | 326.8 |
| `test/export_width.test.js` | 11.1 | 464.2 |
| `test/doc-code.test.js` | 10.4 | 382 |
| `test/core_cup_seam.test.js` | 9.4 | 775.9 |
| `test/core_sculpt.test.js` | 5.0 | 483.8 |
| `app/test/core-readout-display.test.js` | 4.7 | 468.4 |
| `test/m2m3_tools.test.js` | 3.4 | 244 |
| `test/core_cup.test.js` | 3.2 | 409 |
| `app/test/share-install.test.js` | 3.1 | 440.2 |
| `test/export-layouts.test.js` | 2.9 | 414.7 |
| `test/core_chord.test.js` | 2.6 | 357.1 |
| `test/core_water.test.js` | 2.5 | 317.2 |
| `test/core_xsec.test.js` | 2.0 | 341.9 |
| `test/export-textures.test.js` | 2.0 | 359.9 |
| `app/test/palette-grammar.test.js` | 1.9 | 110.9 |
| `test/validate_bounds.test.js` | 1.9 | 597.6 |
| `app/test/shell-autosave.test.js` | 1.9 | 113 |
| `app/test/timers-regression.test.js` | 1.9 | 108.9 |
| `test/geom_bvh.test.js` | 1.8 | 369.7 |
| `test/phrasebook.test.js` | 1.7 | 348.8 |
| `test/geom_grow.test.js` | 1.6 | 373 |
| `test/ailine.test.js` | 1.5 | 532.6 |
| `test/geom_mesh.test.js` | 1.4 | 845 |
| `app/test/handles.test.js` | 1.3 | 432.1 |
| `test/core_water_adapter.test.js` | 1.2 | 196.9 |
| `test/core_ramp.test.js` | 1.1 | 199.5 |
| `test/platform_test.test.js` | 1.0 | 497 |
| `test/geom_fonts.test.js` | 1.0 | 359.6 |
| `app/test/export-selfcheck.test.js` | 0.9 | 113.1 |
| `test/vocab-corpus.test.js` | 0.9 | 254.8 |
| `test/core_knots.test.js` | 0.9 | 343.1 |
| `test/perf_soak.test.js` | 0.9 | 245.5 |
| `test/texture-made.test.js` | 0.8 | 122 |
| `test/geom-pitlane.test.js` | 0.8 | 402.2 |
| `app/test/look.test.js` | 0.8 | 309.4 |
| `test/join.test.js` | 0.8 | 271.2 |
| `app/test/core-xsec.test.js` | 0.7 | 123.9 |
| `app/test/preview.test.js` | 0.6 | 175.3 |
| `test/geom_loop.test.js` | 0.6 | 212.6 |
| `app/test/handles-panel.test.js` | 0.6 | 132.8 |
| `app/test/camera.test.js` | 0.6 | 49.7 |
| `test/core_adapter.test.js` | 0.6 | 205.1 |
| `test/core_offset.test.js` | 0.6 | 171.8 |
| `test/piecewise.test.js` | 0.6 | 119 |
| `app/test/texmaker-panel.test.js` | 0.5 | 41.7 |
| `test/geom_ramp.test.js` | 0.5 | 183.5 |
| `test/texture-mapping.test.js` | 0.5 | 39.4 |
| `test/core_cup_readers.test.js` | 0.5 | 48.8 |
| `test/perf.test.js` | 0.5 | 104.2 |
| `test/core_readout.test.js` | 0.5 | 135.1 |
| `test/core_extend.test.js` | 0.5 | (unsampled) |
| `test/texture-set.test.js` | 0.5 | 38.7 |
| `test/validate_raygap.test.js` | 0.5 | 113.4 |
| `test/markers_track.test.js` | 0.5 | 51.9 |
| `app/test/texture-panel.test.js` | 0.5 | (unsampled) |
| `test/texture-image.test.js` | 0.5 | 37.9 |
| `test/validate_speed.test.js` | 0.5 | 156.2 |
| `test/spectrum.test.js` | 0.5 | (unsampled) |
| `test/doc-packs.test.js` | 0.5 | 112.6 |
| `app/test/validate-ui-panel.test.js` | 0.5 | (unsampled) |
| `test/doc-geom.test.js` | 0.5 | 50.9 |
| `test/core_xsec_math.test.js` | 0.5 | (unsampled) |
| `app/test/closer.test.js` | 0.5 | (unsampled) |
| `test/validate_incremental.test.js` | 0.5 | (unsampled) |
| `app/test/markers-panel.test.js` | 0.5 | 97.7 |
| `app/test/validate-ui.test.js` | 0.5 | 133.9 |
| `app/test/render_proof.test.js` | 0.4 | 92.3 |
| `app/test/validate-ui-jumps.test.js` | 0.4 | 49.3 |
| `test/trackfiles.test.js` | 0.4 | 104.2 |
| `test/geom_pitlane_tilt.test.js` | 0.4 | 106.9 |
| `test/lookmatch.test.js` | 0.4 | (unsampled) |
| `test/validate.test.js` | 0.4 | (unsampled) |
| `test/doc-jump.test.js` | 0.4 | (unsampled) |
| `test/validate_head.test.js` | 0.4 | 53.1 |
| `app/test/aclook_webview.test.js` | 0.4 | (unsampled) |
| `test/validate_jumps.test.js` | 0.4 | 38.6 |
| `test/core_doc.test.js` | 0.4 | (unsampled) |
| `app/test/validate-ui-speed.test.js` | 0.4 | 44.1 |
| `test/doc.test.js` | 0.4 | 93.7 |
| `test/kn5write.test.js` | 0.4 | 85.3 |
| `app/test/shell-loader.test.js` | 0.4 | 103.8 |
| `test/doc-pitlane.test.js` | 0.4 | (unsampled) |
| `test/doc-library.test.js` | 0.4 | 93.6 |
| `test/markers_lane.test.js` | 0.4 | (unsampled) |
| `test/grammar.test.js` | 0.4 | (unsampled) |
| `app/test/shell.test.js` | 0.4 | (unsampled) |
| `test/doc-head.test.js` | 0.4 | 113.1 |
| `test/release.test.js` | 0.4 | (unsampled) |
| `app/test/palette.test.js` | 0.4 | 51.2 |
| `test/doc-textures.test.js` | 0.4 | 38 |
| `test/geom_path.test.js` | 0.4 | (unsampled) |
| `test/vocabgen.test.js` | 0.4 | (unsampled) |
| `app/test/shell-dist.test.js` | 0.4 | 108.6 |
| `app/test/shell-ghost.test.js` | 0.4 | 106.1 |
| `test/markers.test.js` | 0.4 | 112.1 |
| `test/corpus.test.js` | 0.4 | 6.4 |
| `app/test/shell-layout.test.js` | 0.4 | 104.6 |
| `app/test/palette-panels.test.js` | 0.4 | 41.2 |
| `app/test/shell-failed-edit.test.js` | 0.4 | (unsampled) |
| `app/test/shell-keys.test.js` | 0.4 | (unsampled) |
| `app/test/palette-phrasebook.test.js` | 0.4 | (unsampled) |
