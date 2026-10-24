# Landing plan: local-0.4.19 = local-0.4.18 + D447 (close() banks the whole loop) (librarian, 2026-10-24 10:5x)

Tier: prove it (core geometry, and an overwrite of the installed exe). One part, one landing pane, which the chair names. Nothing is pushed.

**Cleared by:** P's pre-landing review, `exo_memory/handback/p-d447-review-P_2026-10-23.md` §9 (git-blob ff76e73b…, 92,291 B). §9.0: "Yes: it can land as 0.4.19." Under the stop rule this was P's last read.

## What lands

- **Base:** the local-0.4.18 tip, **ff88d85** ("local-0.4.18: merge d402-e @ 9c5a3ab"). checked: the ref exists; `local-0.4.18` lists as a branch, not yet as a tag. **This plan waits for my all-clear on 0.4.18.** If A's hand-back names a different tip, use that one and ring me.
- **Incoming:** t180 **d447-o 28eb328** (t180-wt-o18): a838803, f2459fe, 05cdb9d, 28eb328 on 2c13316; 3 files, +196 −30 (CHANGELOG.md, src/core/finish.js, test/core_close_banks_lap.test.js).
  - checked: the merge base with ff88d85 is e8e34d00c, so d447-o forked before 0.4.17; `git merge-tree --write-tree ff88d85 28eb328` → clean. Both sides touch CHANGELOG.md, and the merged [Unreleased] must hold both entries.
- Merge with `--no-ff`.

## Proof owed before install

1. Ancestry: ff88d85 and 28eb328 are both ancestors of the tip.
2. **The full suite**, one heavy-run slot, at BelowNormal, TAP. The EXPO rule applies to 3221225477 file deaths. sculpt-frame's four timed rows are skipped by name. release-frame row 4 red alone does not block; report its figures. **core_close_best's CPU row** goes in the hand-back (bound 30 s; O's 22.8 s, which P did not re-time). Any other red: bisect it and ring me.
3. **The mutation harnesses whole** (`tapmut.js`): give the totals against 0.4.18's 609/609/0. O's own `d447-mutants.js` is not part of it. Its figures are in §9.2: 20 of 24, survivors Y2, X4, Q8 and W1.
4. **His copies:** O's `copies-bytes.js` on the merged tip against 2c13316 → 5 of 5 sha256 IDENTICAL. Exports must still carry `t180b_made-993b5297d4ad20a5-1024.dds`.
5. **Page:** one headless run of close() on a lap through the page (`--mute-audio`, title `zz-headless-test`), with the TabProxyWindow count before and after; the after count must equal the before count.
6. **Credential scan** ff88d85..tip. **"keeper"** must be 0 in [Unreleased] and in the added lines.
7. **Install only with the builder closed.** Build from a clean detached worktree at the tip (`node src-tauri/release.cjs`). Run `scripts/install-local.ps1 -Tag local-0.4.19`. The backup `.before-local-0.4.19` must be a free name. The stamped sha256 compare must print equal. Give the backup's sha256 (the 0.4.18 install's) and the installed exe's.
   - If the builder is open, stop at this step and ring; do not close it.
8. Tag `local-0.4.19` on the tip. No push. After the merge is confirmed, remove t180-wt-o18 and P's p447g/p447h/p447i with `git worktree remove` if they are clean. The untracked fixtures-d337/ and fixtures-d431/ in o18 are backed up first.

## Ruled: what does not land here

- **Q8's row** (§9.4: the roll amber on Sharp ramp 40) is not in this landing. The product is right, because the second try passes. A missing bar is a row for the next lap, not a reason to reopen this one. **It becomes a lap for O, D451:**
  - the Q8 row;
  - Q2 raw TAP kept beside the derived verdict in `d447-mutants.js` (the D411 finding);
  - a W1-reaching lap if one can be built by construction.
  Y2 (the bound conservative by about 6 m at R 300) and the start-line wrap (§9.1) are noted in D451 and are not rows.
- §9.5's correction to O's §10.5 stands on the record; no action.

## Still owed before any public push (unchanged)

Reword 63bb388, 15e4e81, a519bb9 and 1c640b0, and the 23 "keeper" lines from 0.4.15 (plan_batch_0417 "Landing ruled").

NEXT: landing pane make local-0.4.19 per this plan when the librarian's 0.4.18 all-clear is out; then the librarian verifies on disk and gives the keeper the all-clear.

## D451 ruled (librarian, 2026-10-24 13:4x)

O's hand-back: `exo_memory/handback/p-d451-O_2026-10-24.md` (git-blob 17156f14…, 6,510 B). t180 d451-o **18d97c1** on 28eb328.
- checked: 28eb328 is an ancestor of 18d97c1. `git diff --stat 28eb328 18d97c1` → 1 file, +12: row 19 in test/core_close_banks_lap.test.js, with no product change. `merge-tree ff88d85 18d97c1` → clean.
- Q8 is now caught (row 19), so O's mutants read 24 / 21 / 0, with survivors Y2, X4 and W1. W1 cannot be reached by construction while the descent check stands (§3). O inferred, and did not search, that a lap that climbs or crests through the gap might reach it; that is noted, not a row.

**P reads D451 now, not after 0.4.19.** Nothing in it waits on the landing.
- **If P clears it before the 0.4.19 landing pane starts:** the landing merges **d451-o 18d97c1** in place of 28eb328. Step 3's D447 figures become 24 / 21 / 0. Everything else in the plan stands.
- **If it is not cleared by then:** 0.4.19 lands 28eb328 as written, and d451-o rides the next batch.
