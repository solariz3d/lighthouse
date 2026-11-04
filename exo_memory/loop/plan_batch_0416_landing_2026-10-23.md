# Landing plan: local-0.4.16 = local-0.4.15 + D440 + D443 + D444 (librarian, 2026-10-23 ~07:30)

Tier: prove it (core geometry: finish.js). One part, one landing pane, which the chair names. Nothing is pushed.

## What lands

- **Base:** local-0.4.15, sha **42d4c2b26b05…**. Use the sha: the name is ambiguous, because a tag and a branch both carry it.
- **Incoming:** t180 **d444-o 9fa000a**, one line of history:
  - c422e8e = D440, from cd3dc42 (a5fa5c0, dd2ae71, c422e8e);
  - da76067 = D443;
  - 9fa000a = D444.

  cd3dc42 is already in 0.4.15 (merge 5, 498e735), so the merge brings exactly these 5 commits.
  Rulings: plan_d438 sections "D440 ruled from O's side", "P's D440 review ruled", "D443 ruled from O's side", "P's D443 review ruled". D444 is accepted on O's hand-back `exo_memory/handback/p-d444-O_2026-10-23.md` (git-blob 70a88785…):
  - checked: n5n6-before-row.out caught 0/2;
  - checked: n5n6-after-row.out caught 2/2;
  - checked: harnesses.tap 0 not ok.
- **Expected conflict:** CHANGELOG.md, where D440's entry (dd2ae71) meets 0.4.15's [Unreleased] entries. Keep both, 0.4.15's first, and edit no text.

## Proof owed before anything is installed

1. `git merge-base --is-ancestor` for 42d4c2b and 9fa000a against the new tip. `git log --first-parent 42d4c2b..` shows the merge (plus any fix).
2. **The full suite**, one heavy-run slot, TAP. EXPO rule for 3221225477 file deaths (solo re-run). sculpt-frame's four timed rows skipped by name inside the suite, as at 0.4.15.
   - release-frame row 4 red ALONE does not block. D442 found that row sits at its 6.0 ms bar on this machine at b6969da too (plan_batch_0415 "D442 ruled"). Report its figures.
   - Any other red is a finding: bisect it, and put it to the librarian before a fix.
3. **Every mutation harness whole** (`tapmut.js` over the suite's TAP): applied / caught / NOT APPLIED for each. Expect 0.4.15's 16 harnesses at 609/609/0.
4. **core_finish_bank rows 9–12 green at the tip.** **His two tracks' figures identical to d444-o's** (`tracks-d444.out`: TEST TRACK 10 RSL R 300, 3,990 m, 4.51 g; TEST 10 LSR R 300, 2,584 m, 4.23 g). Use the uncommitted fixtures copies, and remove them after.
5. No ELYSIUM export re-run is owed: nothing in this batch touches export. inferred from the diffs, which touch only finish.js, the bank test and the CHANGELOG. The pane confirms with `git diff --stat 42d4c2b <tip>`. If any export file shows, the ELYSIUM page export becomes owed, as at 0.4.15.
6. **Credential scan** 42d4c2b..tip. **"keeper" in public text**: 0 in [Unreleased] and in the added lines.
7. **Install, only with the builder closed** (`Get-Process t180-track-builder` → none):
   - build from a clean detached worktree at the tip (`node src-tauri/release.cjs`);
   - `scripts/install-local.ps1 -Tag local-0.4.16`, which makes a backup `.before-local-0.4.16` (the name must be free first);
   - the stamped sha256 compare must print equal;
   - give the sha256s of the backup (expect 38ED8673…EE84, the 0.4.15 install) and of the installed exe.
8. Tag `local-0.4.16` on the tip. No push.

## Still owed before any PUBLIC push (unchanged)

Reword 63bb388, 15e4e81, a519bb9 and 1c640b0 ("keeper" in the messages).

NEXT: landing pane hands back to the librarian; the librarian verifies on disk and gives the keeper the all-clear.

## Landing ruled — ALL-CLEAR (librarian, 2026-10-23 ~07:58)

A's hand-back is `exo_memory/handback/p-d445-landing-A_2026-10-23.md` (git-blob 2cbc418c…, 6,931 B). Tip e8e34d0, tag local-0.4.16.

checked on disk by this seat:
- installed exe sha256 b148bfa3…fee9a, 14,956,544 B;
- backup `.before-local-0.4.16` sha256 38ed8673…6ee84, the 0.4.15 install;
- no t180-track-builder process running;
- `refs/tags/local-0.4.16^{commit}` = HEAD = e8e34d00c3ff…;
- the worktree is clean;
- `git diff --stat 42d4c2b e8e34d0` shows 3 files, +94 −20, and no export file.

The suite had 3,498 tests: 3,481 pass and 1 fail, release-frame row 4 alone at 6.2 / 6.1 ms, which the plan allows. Harnesses: 609/609/0. Rows 9–12 green. His two tracks identical. No fix was needed.

Still owed before any PUBLIC push: reword 63bb388, 15e4e81, a519bb9 and 1c640b0.
