# Stall trace: the rebuilder's pull fails after any build, because the build leaves Cargo.toml looking changed. Librarian, on L, 2026-11-11 00:3x

**Seen (checked on L, 2026-11-11):** `git merge --ff-only origin/main` in `Downloads\t180-track-builder` (fc3cc63 → 3b33b38) stopped with
"Your local changes to the following files would be overwritten by merge: src-tauri/Cargo.toml". That is the same fast-forward the
rebuilder's `git pull --ff-only` makes (`consonance/tools/t180-rebuilder/Rebuilder.cs:117`). On failure the rebuilder says so and opens
whatever is installed (`:117-120`). So his click on L tonight would have opened the 11-07 test build, with none of the three fixes
of 11-10, and no build.

**Source, checked:**
- The file is byte-equal to git's copy: blob d2ce5147 in the index, by `git hash-object` with and without filters; 824 bytes, LF.
- Git's record of it is stale: the index entry says size 846 (the CRLF checkout, `core.autocrlf=true`) and an older mtime. The file's
  mtime is 2026-11-04 00:54, the first build on L (the l135 install). inferred: the tauri build rewrites the manifest with LF endings.
- `git update-index --refresh` says "needs update" and leaves it ` M`; `git status` keeps showing ` M`; the merge refuses.
- Upstream changes `src-tauri/Cargo.toml` at every release (the version line), so every release after a machine's first build hits this.
- Seen before and worked round by hand: 11-07 notes ("its Cargo.toml ' M' is line endings only"), `p-l153-install-C` §1.

**Why it is a stall and not a nuisance:** the rebuilder exists so that his click builds whatever main is. After one build on a machine,
the next release's pull fails, and the click silently keeps the old build. Seat installs have hidden it, as with the shortcut (11-07).

**Unblocked on L by the librarian (no content changed):** `git add src-tauri/Cargo.toml` (same blob, nothing staged), then the
fast-forward. The checkout is at 3b33b38, status clean.

**Fix (lap L158):**
1. t180: `.gitattributes` gets `src-tauri/Cargo.toml text eol=lf` (and any other file the build rewrites; the pane lists them from a
   `git status` after a build). Then the working copy is LF and the build's rewrite changes nothing.
2. The rebuilder: before the pull, re-record files whose bytes equal git's copy (`git add -u` only when `git diff --quiet` after
   filters says no content differs; never when a real change exists), so a machine already in this state gets past it. Recompile,
   repo copy and installed copy equal.

**Proving check:** on a scratch clone with `core.autocrlf=true`: build once (or rewrite Cargo.toml with LF as the build does), then
fast-forward across a commit that changes Cargo.toml. Red before the fix (the refusal above), green after. And a real local change to
a tracked file must still stop the pull.
