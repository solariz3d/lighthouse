# L converges with D through GitHub — the lighthouse merge. Librarian, on L, 2026-11-04 00:5x, at the keeper's "lets do it".

## State, checked
- **t180:** D rewrote t180's history; L's old main 1d68a86 shares no commit with origin/main. Checked: `git merge --ff-only`
  → "refusing to merge unrelated histories".
  - DONE by the librarian at 00:5x: L's checkout is now on origin/main `d10eacf` (v0.4.39). Old main is kept as branch
    `backup/pre-rewrite-main-L`; L's uncommitted 09-29 copies are in `git stash` ("L leftovers 2026-09-29").
  - origin/main already has the readout (`src/core/readout.js`, `app/core/labels.js`) and the camera boost and lens work.
  - The old WIP branches `l130-camera-readout` / `l132-camera-feel` sit on the OLD history and are superseded.
- **lighthouse:** L is 32 ahead / 1,842 behind origin/main (`git rev-list --left-right --count HEAD...origin/main`). They share
  a merge base. A dry merge (`git merge-tree --write-tree --name-only HEAD origin/main`) gives **6 conflicts**:
  `consonance/src-tauri/src/main.rs`, `consonance/src-tauri/src/mcp.rs`, `consonance/src-tauri/src/trailer.rs`,
  `consonance/tools/heavy-run.js`, `consonance/tools/heavy-run.test.js`, `exo_memory/loop/label_rule_watch_registration_2026-09-27.md`.
  - L's commits that touch consonance/ (all 09-27):
    - 88278a11: heavy-run pid reuse;
    - 9e47cb17: call_librarian warned hand-back tells the pane;
    - 3d639782 / 9e7037b0 / f6f44083: label-watch;
    - e3eadda2 / d592269f: intake_reserve.
  - origin's heavy-run.js already handles a REUSED pid (its line 45 comment).
- **The stick:** the 11-03 carry is INCOMPLETE. `node dev/tail-carry.js --stick D:\consonance-L-20260911 --verify-set` →
  code 1, missing 8 (ledger.json among them), extra 5; `ledger.lock` was left at 21:22; pane A's tail is still `.writing`. So it
  is NOT imported (the arrival note's STOP). Seat convergence waits for a complete carry.
- **New panes:** NOT added on L before the carry; they land by session id (c88002b1, fbf98f8e) at the next complete carry.

## L-CONVERGE, the packet (one builder + one non-author reviewer)
**Builder (B):**
1. In a NEW worktree of lighthouse at L's HEAD (no links), make branch `converge-L-2026-11-04` and `git merge origin/main`.
2. Resolve each of the 6 conflicts:
   - **Code:** start from ORIGIN's version (D is a month newer). For each of L's 7 commits above, check whether its behaviour is
     already in origin (by reading the code and its test, not by message). Port only what is missing, with its test. Write each
     decision as one row: file, L commit, "already in origin at <file:line>" or "ported".
   - **The doc:** keep origin's text, and append L's differing lines under a dated "from L, 2026-09-27" marker; never drop either.
3. The 1,800+ non-conflicting files merge as git does. Spot-check that L's 09-29 files arrive unchanged:
   `loop/plan_t180_camera_readout_2026-09-29.md`, `loop/handoff_librarian_2026-09-29_close_L.md`, the 09-29 hand-backs, and
   `loop/sonnet_pane_A_trial_registration_2026-09-29.md`.
4. Checks, under the heavy-run lock, with its own CARGO_TARGET_DIR:
   - `cargo check` in consonance/src-tauri;
   - the JS suite for the touched tools (heavy-run, trailer, label-watch);
   - targeted tests only; no full rebuild.
5. Hand back: the decision rows, the check outputs, and the merge commit sha. Do NOT push.

**Reviewer (E, non-author):** re-derive each conflict decision from the two parents (vary: diff L's commit against origin's file,
not B's summary); run the targeted tests plainly. GREEN or not.

**Then:** the chair pushes `converge-L-2026-11-04` to origin as a fast-forward of main, or as a merge commit onto main. The keeper
said "lets do it" (00:45) to this merge and its push. After the push, L's main checkout fast-forwards. Consonance on L is rebuilt
from it at the keeper's next restart.

NEXT: chair dispatch L-CONVERGE to B (build) and E (review after B) when this file is read

## WHY the 11-03 carry broke (traced at 00:5x, at the keeper's "how did it break?")
- **The limit:** `consonance/src-tauri/src/main.rs:14797` on origin/main: `LEAVE_EXPORT_TIMEOUT = 600 s`. Its own comment: "At the
  bound tail-carry is stopped and the Leave reads NOT DONE". It was sized from the FIRST carry, 348 MB in 55 s (~11× headroom).
- **Tonight's carry was 7.1 GB** (the D 17:51 note: the stick was emptied and a fresh FULL carry written at the close).
- **The stick's own timestamps:**
  - The second attempt took the ledger lock at 21:22:48 and wrote main (21:25:32), the librarian (21:27:52) and the third place
    (21:29:36). It was still writing pane A's 1.26 GB tail (`.writing`, 1,008 MB of 1,260 MB) at 21:32:50.
  - That is ~602 s after the lock, i.e. the 600 s bound.
  - The first attempt also died inside A's tail (`.writing`, 1,040 MB, last written 21:11:18).
  - The ledger (hashes) is written last, so it never was.
  - **inferred:** the first attempt hit the same bound; its start time is not on the stick.
- **Throughput:** main's 897 MB took ~164 s → ~5.5 MB/s, so the whole 7.1 GB needs ~22 min, about 2.2× the bound.
- **Fix candidates (for D, its code):**
  - size the bound from the set (bytes ÷ a measured floor rate, plus margin);
  - or write the big carry by hand without a bound, like the arrival note does;
  - or the keeper's 11-03 17:56 idea, a trimmed or curated carry (A measured the trim in D639 pass 2).

## B's hand-back read (librarian, 01:1x): `handback/p-lconverge-B_2026-11-04.md`
- Merge commit `880f237f` on `converge-L-2026-11-04` (parents L 14f9495d, origin 1809ab39); NOT pushed.
- The 6 decisions:
  - heavy-run.js/test: PORTED. Red-check: origin's file 54/7 → the port 61/61.
  - trailer.rs, mcp.rs: already in origin (D633, which deliberately drops the receiver's note); origin kept.
  - main.rs: intake_reserve PORTED, plus the REAL_* fixture refresh (without it the band test's control fails).
  - The doc: origin byte for byte, plus L's block appended verbatim.
- cargo check exit 0; label-watch 27/27.
- **WRONG (the librarian's, in this plan's State block):** "origin's heavy-run.js already handles a REUSED pid (its line 45
  comment)". The comment says the opposite: a reused pid reads alive and the waiter fails at max wait. B caught it from the code.
OUTPUT → NEXT: unchanged — B is green with rows; E reviews as planned
