# Landing plan: local-0.4.17 = local-0.4.16 + D446 (librarian, 2026-10-23 12:5x)

Tier: prove it (the export gate). One part, one landing pane, which the chair names. Nothing is pushed.
D447 (O, banking the whole loop on close) is NOT in this batch: it is still building, and the keeper's TEST 10 banked export should not wait on it. It lands as 0.4.18.

## Why a05e487 is accepted (librarian, checked)

- E's hand-back `exo_memory/handback/p-d446-E_2026-10-23.md` §7–13 (git-blob e8a7cda2…, 25,495 B). P's review `p-d446-review-P_2026-10-23.md`: can land, two findings. Both were fixed in §13:
  - the seam pair (`alongM` = `Math.min(d, lapM - d)`), with row 16 red at 5a2fbab and green after;
  - Install's note carries `near-touch:`, with share-install row 9 red at 5a2fbab and green after. The page run on his copy shows the words in Install's note (`page-fix2.log`).
- checked: t180-wt-e40 `git log -3` → a05e487, 5a2fbab, bad1bb3; tree clean; `git diff --stat 5a2fbab a05e487` → 4 files, +48 −2.
- Own mutants 9/8/0 (M7 survives, accepted). Touched tests and 7 harnesses whole, all exit 0 (`d446run3.log`).
- Rulings: plan_d446 sections "E's D446 hand-back ruled", "E's D446 build ruled", "E's row 15 ruled", "P's D446 review ruled".

## What lands

- **Base:** local-0.4.16, sha **e8e34d00c3ff…** (use the sha; the name is both a tag and a branch).
- **Incoming:** t180 **d446-e a05e487**, branched from e8e34d0: bad1bb3, 5a2fbab, a05e487. Merge it with `--no-ff`, as the earlier batches did. No conflict is expected (inferred: nothing else landed since e8e34d0).

## Proof owed before anything is installed

1. `git merge-base --is-ancestor` for e8e34d0 and a05e487 against the new tip.
2. **The full suite**, one heavy-run slot, TAP. EXPO rule for 3221225477 file deaths (solo re-run). sculpt-frame's four timed rows skipped by name, as before.
   - release-frame row 4 red ALONE does not block (plan_batch_0415 "D442 ruled"). Report its figures.
   - Any other red is a finding: bisect it, and put it to the librarian before a fix.
3. **Every mutation harness whole** (`tapmut.js` over the suite's TAP). Expect 16 harnesses at 609/609/0.
4. **The export is touched** (fromwords.js, install.js), so:
   - ELYSIUM exports through the page (headless, `--mute-audio`, a fake AC root), no red, as at 0.4.15;
   - **his TEST 10 banked copy** (sha256 d1550e7e…72de72, E's `save\eq-TEST-10-banked.t180track`, not his folder: the original was deleted at his word today) installs through the page, no red, with the near-touch line in Install's note.
5. **Credential scan** e8e34d0..tip. **"keeper" in public text**: 0 in [Unreleased] and in the added lines.
6. **Install, only with the builder closed** (`Get-Process t180-track-builder` → none):
   - build from a clean detached worktree at the tip (`node src-tauri/release.cjs`);
   - `scripts/install-local.ps1 -Tag local-0.4.17`, which makes a backup `.before-local-0.4.17` (the name must be free first);
   - the stamped sha256 compare must print equal;
   - give the sha256s of the backup (expect B148BFA3…EE9A, the 0.4.16 install) and of the installed exe.
7. Tag `local-0.4.17` on the tip. No push. Remove t180-wt-e40 only after E's branch is merged and the tree is clean (E's hand-back keeps it for this).

## Still owed before any PUBLIC push (unchanged)

Reword 63bb388, 15e4e81, a519bb9 and 1c640b0 ("keeper" in the messages).

NEXT: landing pane make local-0.4.17 per this plan when the chair names it; then the librarian verifies on disk and gives the keeper the all-clear.

## Landing ruled — ALL-CLEAR (librarian, 2026-10-23 15:1x)

A's hand-back `exo_memory/handback/p-d448-landing-A_2026-10-23.md` (git-blob d8abcf45…, 9,675 B). Tip 1e436f6, tag local-0.4.17.

Checked on disk by this seat:
- installed exe sha256 53e58757…995add, 14,959,104 B;
- backup `.before-local-0.4.17` sha256 b148bfa3…fee9a, the 0.4.16 install;
- no t180-track-builder process running;
- `local-0.4.17^{commit}` = HEAD = 1e436f6e1008…; worktree clean;
- e8e34d0 and a05e487 both ancestors; first-parent log e8e34d0.. shows the one merge; `git diff --stat` 11 files, +230 −17.

From A's figures: the suite had 3,505 tests, 3,488 pass and 1 fail, release-frame row 4 alone at 12.5 / 10.5 ms. A's base-against-tip run had the two the same within noise (both red under that hour's shared slot), so it is load, not D446. Harnesses 609/609/0. Both page exports clean; Install's note on his TEST 10 banked copy carries the near-touch line.

**New for the public-push list (A §5):** 0.4.15's batch added 23 lines with "keeper" in code comments and docs (exportjob.js, the D434 and D438 comments). Owed before any public push, beside rewording 63bb388, 15e4e81, a519bb9 and 1c640b0.
