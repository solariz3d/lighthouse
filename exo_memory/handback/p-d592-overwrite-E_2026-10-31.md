# D592: the overwrite question (pane E): IN PROGRESS

Seat: pane E (machine D), sibling-07b8a48f. Tier: prove it, as the chair raised it. Order: `[chair:MAIN]` D592, 2026-10-31T22:55Z.

**STATUS (2026-10-31 ~23:55Z, at the chair's WIP order):**
- **Branch tip:** t180 d592-e `94f95b6`, off land-0434 a93ae51, in `C:\Users\nname\Downloads\t180-wt-e592`. One commit, not pushed. Its body says "WIP: …".
- **Done:**
  - the decision, the page wiring, the native side, the tests (red, then green), the mutants (JS and Rust), CHANGELOG and MAP.md.
- **Not yet done:**
  1. **The touched tests:** the 108 files that load coreshell.js, install.js or index.html, listed in `p-d592-overwrite-E_2026-10-31_evidence/touched.txt`, plus `app/test/overwrite.test.js`.
  2. **A final whole-lib `cargo test`.** This one is only needed after my comment-only edits to lib.rs; the last whole-lib run, 56/0, was before them.
  3. **The screenshots of both dialogs in all six looks.** The script is written and has not run: `p-d592-overwrite-E_2026-10-31_evidence/shots.js`. It runs headless only.
- **Why they did not run:** the batch waited for `acs.exe` to close (it was up at 23:06Z), took its turn at 23:34Z, and was then refused by the heavy-run lock: "C:\ has 18.6 GB free, under the 20 GB floor". Nothing of mine is running now; checked by tasklist on both PIDs, and the watcher was stopped.
- **Next:** free disk space first (the janitor's dry run frees 0.0 GB, so it is a person's call, not the janitor's). Then, with `acs.exe` closed:
  1. the touched tests;
  2. `cargo test --lib`;
  3. `node shots.js <out>`.

  Then finish this hand-back with the screenshot paths, add the map line, and ring.

## What is in 94f95b6

**The decision is `app/core/overwrite.js`.** It has no DOM.
- `installNeedsAsk(state, geometry)`: no folder, or a folder with no builder marker, asks nothing. The native install already refuses to touch a folder with no marker. The same road asks nothing. A different road, or a marker that records no road, asks.
- `markerGeometry(files)`: the road hash from the export's own marker file.
- `saveQuestion` and `installQuestion`: `askChoice` options naming the track (or folder) and its local date. Cancel is the default, so Enter never replaces. Replace is `value: 'replace'`.

**Save, in `app/core/coreshell.js`: `save(name, { confirmReplace })`.**
- It asks only when a saved track with that name exists and is not the open track. Names are compared case-blind, as Windows does.
- Only a plain `true` replaces. Any other answer, or no `confirmReplace` at all, writes nothing: no track, no undo sidecar, no autosave cleared. The message says "not saved: …".
- Replace keeps the replaced version in track-backups, as every save does.
- There is no separate Save As or rename for tracks in this app. Save writes under whatever name is in the name field, so typing another track's name is the Save As path. App README: "nothing in the app renames or deletes a track".

**Export to Assetto Corsa, in `app/install/install.js`.**
- After the build and before ANY write, it reads `native.installedState(folder)` for each folder and asks through `confirmReplace({ folder, written })`.
- Anything but `true` installs nothing.
- `app/install/index.js` passes the question through.

**The page, `app/index.html`.** `askOverwrite` uses the themed `askChoice`. Save passes `confirmSave`, the installer gets `confirmInstall`, the storage gains `docSavedAt`, and the native side gains `installedState`.

**Native, `src-tauri/src/lib.rs`.**
- `saved_at(path)` and the command `track_saved_at`: the file's modified time, in ms.
- `installed_state_in(tracks, folder)` and the command `installed_state`: `{ exists, marker, geometry, written }`.
- Both are registered in `generate_handler!`.

**Not covered: File ▸ Export into a chosen folder (`write_export`).** The order names Export to AC, and this lap did only that. The chosen-folder export still replaces a builder-made folder without asking.

## Proof so far

**JS tests, red first.** `app/test/overwrite.test.js` has 9 rows.
- Against a stub module, 8 of 9 failed. Row 3, the re-save that asks nothing, passed on the old code, which never asked; mutants O1 and O7 give it teeth.
- After the fix, 9/9 passed.
- Row 2 proves "Cancel writes nothing" on real files in a temp folder: every file's sha256 and mtime is unchanged, the storage gets no call, and nothing is written for the answers `undefined`, `null`, `'replace'` or `1`.

**Rust tests, red first.** `installed_state_tells_…` and `saved_at_is_…` were 0 passed / 2 failed against stubs, then green. Whole lib: 56 passed / 0 failed. That run was before the comment-only edits.

**JS mutants** (`_evidence/mutants.js`, `mut2.out`; each in a copy of app/, src/, src-tauri/src/ and tools/): **applied 21 / caught 21 / NOT APPLIED 0**.
- The worktree files were unchanged (sha256 checked before and after).
- O5 ("any answer but a refusal replaces") survived the first run. Row 2 then gained the non-true answers, and the matching install mutant A9 was added; both are now killed.
- Q3 (local time against UTC) is killed here only because this machine is UTC−6. On a UTC machine it is equivalent.

**Rust mutants** (`_evidence/lib.mutants.js` through lighthouse's `mutant-harness.js`, `libmut.out`): 6 listed, 6 killed, 0 survived, 0 no result, 0 not applied. The live lib.rs was unchanged.

**Existing harness anchors.** S/d577/anchors.js over app/core and app/install against a93ae51 found 24 harnesses and 97 anchors in the touched files. The only counts that changed are `return null;` (20 → 22) and `app/core`; each already occurred more than once, so neither is a mutant's unique anchor.

**Scan of the 396 added lines:** 0 credential prefixes (patterns built split), 0 for the K-word, 0 decision numbers or room paths, 0 of 72 terms.

## Corrections

- **My first mutant copy left out `tools/`.** `src/core/document.js` requires `tools/piecewise.cjs`, so the pre-flight was RED. The pre-flight caught it, and no mutant ran on a broken copy.
- **I first wrote the decision number "D592" into five new comments.** The comment sweep had just taken those out of this repository, so I removed them before the commit.
- **My `sed -i` comment edits turned `app/index.html` and `src-tauri/src/lib.rs` into LF in the working copy.** Git stores LF, and `--numstat` shows only my own lines (12/2 and 73/1). The next checkout restores CRLF.
