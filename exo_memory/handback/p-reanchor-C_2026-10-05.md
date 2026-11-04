# p-reanchor-C — four mutants failing on main 20e5711 (P9, P13, P28, X11). Pane C, 2026-10-05/06

SOURCES: exo_memory/handback/p-stress-E_2026-10-05.md:56-62 · E's `stress/c/results.json` (read only) · A's and C's D240 core hand-backs

**Commit `9480307`**, branch `reanchor-c`, off main **`20e5711`**. It is in a fresh worktree, `C:\Users\nname\Desktop\worktrees\c-reanchor-wt` (copy-only, 0 links).
- 3 named paths, all test files; no source changed.
- Not pushed, no AC.

## Verdict: 1 NOT APPLIED, 2 EQUIVALENT, 1 SURVIVED. All four are fixed, and each harness was run once at the end, clean.

| mutant | class | why (how checked) | fix |
|---|---|---|---|
| **P28** "the document's own check of the run is skipped" | **NOT APPLIED** | Its anchor `for (const P of absolute(out).slice(i0)) scratch = D.appendPiece(scratch, P);` is gone (`grep -nF` → 0). `git log -S` shows it left in **`c775694`**, my own D240 F1 (one `checkDoc` per parse), **not `dd795e1`** as E inferred. dd795e1 only added a line beside it. My F1 did not re-anchor the harness: my slip. | Re-anchored on `D.checkDoc({ ...D.createDoc('piece check'), nextId: run.length + 1, pieces: run });` → `''`. Same meaning: the run's own document check is skipped. **Caught by "row 8".** |
| **P9** "the saved change is not rounded" | **EQUIVALENT** | The anchor is still there (1 occurrence), so E's failure was "not caught". Read: `saveRun` returns `checkPiece`'s OUTPUT, which quantises every channel by `D.DEC` as it enters, so the dropped `q` is applied there anyway. A's b08c3c7 hand-back and my D240 look both called it equivalent, but it was never taken out of the list. It has failed every full run since D240 landed. | Marked the harness's way: a comment with the one-line why, not run (as X26 and J10 are). |
| **P13** "a state is also shifted for a rate" | **EQUIVALENT** | Applied (anchor present). Read: `continued()` builds `shifts` from `STATE` channels only, so a rate's base is always 0. `q(v + 0)` of an already-quantised rate is `v`. `mirrored()` writes 0, never −0 (`neg`), so even `Object.is` cannot tell. | Marked the same way. |
| **X11** "the new fields do not redraw the readout" | **SURVIVED** (a real gap) | Applied (anchor present, 1 occurrence in `app/core/panel.js:171`). inferred, from reading and confirmed by the new row catching it: the undo guard (**`8926789`**) wraps every Extend field's `oninput` (`panel.js:184`). So an edge or edge-start field with no handler no longer throws when typed. The catching row types the **tube last**, and the tube's own handler (`:172-173`, re-assigned anyway) redraws every cell, which hides a field that redraws nothing. | New row in `app/test/core-xsec.test.js`: "the edge angle and the edge start each redraw the readout on their own, with no other field typed after them". X11's `caughtBy` now names it. |

## Runs (each under the heavy-run lock, `--test-concurrency=1`; E's core-mutation held the lock first, taken in turn)
- **Targeted:** `node --test app/test/core-xsec.test.js test/core_piece.test.js` → **58 / 58** (my scratchpad `ra/targeted.out`, sha256 `34ce7662…`).
- **`test/core_piece_mutation.test.js`, once** → **67 / 67** = control + 66 mutants (68 − P9 − P13). P28 applied and caught. **0 NOT APPLIED**, 430.8 s (`ra/pm.out`, `fa0d926d…`).
- **`app/test/core-xsec-mutation.test.js`, once** → **31 / 31**, control green. X11 is applied and caught by the new row. 0 NOT APPLIED (`ra/xm.out`, `51b9f333…`).
- **0 unexplained survivors:** the only ones not run are P9 and P13, each with its why in the file.

## Not established
- I did not run X11 against the OLD row on 20e5711. "Survived" rests on three things: E's fail, the anchor being present (so not NOT APPLIED), and the reading above.
- The new row's red-on-base IS shown, by the harness: with X11 applied, it fails.
- C7/C17 (`core-mutation`) are E's, not here. The full suite was not run.

## Corrections, mine
- P28's stale anchor is my own: c775694 changed the line it pointed at, and I did not run or re-anchor the piece harness then.
- In the D240 look I wrote that P9 and P13 were equivalent, and I did not flag that they would keep failing in the list. This commit closes that.

NEXT: librarian collate this when read — plan default: the chair lands 9480307 with E's, and the librarian runs all three harnesses on main
