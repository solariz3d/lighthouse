# p-reanchor-E · C7 and C17 re-anchored in app/test/core-mutation.test.js · pane E · 2026-10-06, on D

**Commit `c23976403a98f649af427fd7c7f0ed813724f6a4`** (`c239764`), branch `reanchor-c7-c17`, in a fresh worktree `C:/Users/nname/Desktop/worktrees/e-reanchor-wt`, on main **`20e5711`**, with 0 links.
- One file, +2/−2, by named path.
- Not pushed, and AC was not launched.

## What changed: only the two `from:` strings; each mutant keeps its meaning
- **C7, "export runs on an open track"** (`app/core/coreshell.js`):
  - the anchor is now `if (!doc().closed && !opts.test) throw exportError('OPEN_LOOP', 'the loop is not closed: close it first (one click), then export');`
  - it is still replaced by `''`, so the open-loop refusal is gone and an open track exports.
  - My D243a commit added `&& !opts.test` (the test export skips the refusal).
- **C17, "export goes to the word exporter"** (`app/export/export.js`):
  - the anchor is now the call as it stands, `…exportSegments(segments, meta, { outDir: OUT, variant, textures, markers, ...(test ? { test: true } : {}) });`
  - the `to:` is unchanged: `fromwords.exportTrack(segments, { outDir: OUT, variant, textures })`.
  - My D243a commit added the `test` pass-through.
- Each line carries a comment saying why it was re-anchored, as the harness's other re-anchors do.
- **checked:** each new anchor occurs exactly once in its file (`grep -cF` gives 1 and 1).

## The run: once, under the heavy-run lock, serial shim, `--test-concurrency=1`
- `app/test/core-mutation.test.js`: **60 tests, 60 pass, 0 fail, in 1,567 s.**
- **C7 (ok 42) and C17 (ok 48): applied, and caught** by "export: an open track is refused…".
- **0 NOT APPLIED and 0 NOT CAUGHT.**
- Evidence: scratchpad `reanchor/core-mutation.tap`, sha256 `79af5219…`.

## What this does NOT establish
- **The other four failing tests D247 found on main** (X11 in `core-xsec-mutation`; P9, P13, P28 in `core_piece_mutation`). Not mine and not touched; per the packet, the librarian runs all three harnesses after landing.

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\handback\p-stress-E_2026-10-05.md · `git -C C:/Users/nname/Desktop/worktrees/e-reanchor-wt log --oneline -2` · scratchpad reanchor/core-mutation.tap
