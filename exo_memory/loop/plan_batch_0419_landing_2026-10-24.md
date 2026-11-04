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

**Added 2026-10-24 (step 6 ruled (a)):** the 3 D447 comment lines quoting him (app/core/closejob.js, src/core/finish.js, test/core_close_banks_lap.test.js) and the reword of 0c73322.

NEXT: landing pane make local-0.4.19 per this plan when the librarian's 0.4.18 all-clear is out; then the librarian verifies on disk and gives the keeper the all-clear.

## D451 ruled (librarian, 2026-10-24 13:4x)

O's hand-back: `exo_memory/handback/p-d451-O_2026-10-24.md` (git-blob 17156f14…, 6,510 B). t180 d451-o **18d97c1** on 28eb328.
- checked: 28eb328 is an ancestor of 18d97c1. `git diff --stat 28eb328 18d97c1` → 1 file, +12: row 19 in test/core_close_banks_lap.test.js, with no product change. `merge-tree ff88d85 18d97c1` → clean.
- Q8 is now caught (row 19), so O's mutants read 24 / 21 / 0, with survivors Y2, X4 and W1. W1 cannot be reached by construction while the descent check stands (§3). O inferred, and did not search, that a lap that climbs or crests through the gap might reach it; that is noted, not a row.

**P reads D451 now, not after 0.4.19.** Nothing in it waits on the landing.
- **If P clears it before the 0.4.19 landing pane starts:** the landing merges **d451-o 18d97c1** in place of 28eb328. Step 3's D447 figures become 24 / 21 / 0. Everything else in the plan stands.
- **If it is not cleared by then:** 0.4.19 lands 28eb328 as written, and d451-o rides the next batch.

## P cleared D451: the landing takes 18d97c1 (librarian, 2026-10-24 13:4x)

P's review: `exo_memory/handback/p-d451-review-P_2026-10-24.md` (git-blob 4809287b…, 9,145 B). §0: "Cleared. 0.4.19 can merge d451-o 18d97c1 in place of 28eb328."
- Row 19 is green on the clean build and red under Q8 (0.9657 against 0.9338) and under X3.
- All 24 verdicts agree with their TAPs.
- The W1 argument holds on level laps; the crest and climb case is still open and is not a row.

**This section supersedes "What lands" and step 3:**
- **Incoming:** t180 **d451-o 18d97c1**, which is 28eb328 plus row 19. That is 4 files over 2c13316: CHANGELOG.md, src/core/finish.js and test/core_close_banks_lap.test.js.
- **Step 3:** D447's own harness reads 24 / 21 / 0, survivors Y2, X4 and W1 (`d447-mutants-d451.out`); d438 reads 16 / 15 / 1.
- After the merge, remove t180-wt-o24-d451 too if it is clean.

## Step 6's "keeper" ruled: (a) (librarian, 2026-10-24 14:1x)

A's interim: `exo_memory/handback/p-d452-keeper-A_2026-10-24.md` (git-blob 140d7a1e…, 2,071 B). There are 3 added comment lines quoting him, in app/core/closejob.js, src/core/finish.js and test/core_close_banks_lap.test.js, plus 0c73322's commit body. [Unreleased] reads 0, and the credential scan reads 0.
- checked: `git diff ff88d85 7717b81 | grep '^+.*keeper'` → the same 3 lines.

**Ruled (a): land as is.** This is a local build and nothing is pushed. It is the same class as 0.4.15's 23 lines, and the rule exists for public text only. A reword now would put an unreviewed source change into a reviewed landing.
- **Added to "Still owed before any public push":** the 3 comment lines (closejob.js, finish.js, the test file) and the reword of 0c73322's message.
- The install goes ahead once the suite and steps 1–5 pass.

## A's 0.4.19 reds ruled: preview-close-reuse is (i), lap D453 for O; the install holds (librarian, 2026-10-24 15:1x)

A's interim: `exo_memory/handback/p-d452-reds-A_2026-10-24.md` (git-blob a930bd3c…, 4,291 B). The suite at 7717b81: 3578 tests, 7 fail, EXPO 0.

**preview-close-reuse.test.js:24 is real, and it blocks.**
- It is deterministic: ok at ff88d85, not ok at 7717b81, and the first bad commit is 0c73322.
- After Close, "every placed segment kept, not remade: 0 of 950". Not even the straights are reused.
- The row guards a freeze he reported on 2026-10-15: Close froze the window white on a 24 km track, with 6.4 s and 6.7 s full rebuilds (`plan_t180_handoff_2026-10-15.md`; the row's header).
- D447 banks the placed curves, so part of the row's premise ("moves nothing placed") is now false by design. Nothing moves the straights, though, and 0 of 950 means the reuse broke wholesale, not just where banks changed.
- Nobody's D447 run included this file. Only the landing's full suite reached it, which is what the full suite at landing is for.

**Ruled (i), as lap D453 for O, tier prove it:**
1. **Measure first.** Time Close's preview rebuild on a 24 km closed-by-new-road track at ff88d85 and at 7717b81, in Node, through createTrackModel as the row does.
2. **Fix:** after a banking Close, the track model reuses every placed segment whose own resolved geometry is unchanged, and remakes only the segments whose bank changed, plus the new road and the joint. Find why the straights are not reused (0 of 950) and fix that cause.
3. **The row is amended by name, not weakened.**
   - Its premise changes from "every placed segment kept" to "every placed segment whose geometry Close did not change is kept, and the ones it did change are remade". The test counts both from the two resolved states, not from a fixed number.
   - The vertex-for-vertex check against a full build stays as it is.
   - A row on the step 1 figure: Close's rebuild on the 24 km track within a bound that O states from ff88d85's figure.
4. **core_close_best row 12** (34.8 s against 30, with D447's bankLap on every route): this goes in D453 as well, if A's base-against-tip comparison confirms it is the tip's work. Either bring the press under 30 s, or state the work added and propose the bound to me with figures. The bound is not moved silently.
5. Red first on 7717b81, green after. Run D447's harness, the touched files' tests, and preview-close-reuse.
6. **P reviews D453.** Then A re-merges and re-runs steps 2–8.

**"The handle was not held" (drag-frame rows 1 and 2):** it has recurred, so the bisect is owed, as ruled at 0.4.18.
- **It is A's, in this landing, while D453 runs:** ff88d85 against 1e436f6, drag-frame alone, under the other slot's load and without it, on the WAV preload hypothesis.
- It does not block D452 on its own if it stays a load-only flake. If it is D402's, it is a fix lap.

**The other reds:** drag-frame row 3 and release-frame rows 1 and 4 are load, as at 0.4.18. A logs the other slot's holders on the next suite.

## D453 read: to P for review (librarian, 2026-10-24 18:0x)

O's hand-back: `exo_memory/handback/p-d453-O_2026-10-24.md` (git-blob 7ee875bd…, 8,305 B; lighthouse 782569fe). t180 **d453-o 56c99aa** on d451-o 18d97c1.
- checked: 18d97c1 is an ancestor of 56c99aa; `git diff --stat 18d97c1 56c99aa` → 3 files, +36 −6 (CHANGELOG.md, app/preview/trackmodel.js, app/test/preview-close-reuse.test.js); `merge-tree ff88d85 56c99aa` → clean.
- **The cause:** trackmodel.js kept the placed mesh only by a prefix rule (`grownFrom`), so one banked curve sent every segment to `buildMesh`. The fix counts the unchanged segments at their index (`keptFrom`) and lets `reuseMesh`'s per-segment flags do the rest.
- **The straights:** on the row's lap only p1 is truly straight (200 of 950); p3 and p5 are run-out curves that Close banks by design.
- **24 km rectangle:** Close's rebuild 196–373 ms at d453-o (share 0.27–0.38), against 231–281 ms at ff88d85 and 1,065–1,114 ms at 7717b81. On the all-bends lap B the share stays near 0.7, because Close banks 64% of the road by design.
- **Row 12:** back to back, ff88d85 25,890 / 26,046 ms and 7717b81 25,906 / 25,844 ms; A's 34,781 ms was load. The 30 s bound stays.
- Red first on 7717b81 (2 of 2 fail), green at 56c99aa; harnesses 222/222, D447's 24/21/0 as at D451.

**For P's review, the three points I would have read:**
1. M2 and M3 survive. O argues they are equivalent in output (the count only picks the path; `reuseMesh` with every flag false equals `buildMesh`). Check that argument against the code, including `reuseMesh`'s pitch-and-bank check.
2. Row 2 is a timing row inside the full suite (bound share 0.5; d453-o measured up to 0.38). Say whether its margin holds under the suite's load, since A's runs share the machine.
3. Row 1's amendment: the counts come from the two resolved states by `keyOf`, with a control that Close changed some and left some. Confirm it is not weaker than the row it replaces.

**After P clears it:** A re-merges ff88d85 + d453-o 56c99aa (which carries 18d97c1) as the 0.4.19 tip and re-runs steps 2–8. O's trees t180-wt-o25-d453, o26-ff88d85 and o26-7717b81 are removed once merged, if clean.

## A's "not held" bisect ruled: no separate heavy run; the re-landing suite is the test (librarian, 2026-10-24 18:1x)

A's section "The 'handle was not held' bisect" in `exo_memory/handback/p-d452-reds-A_2026-10-24.md` (git-blob 5175b247…, 8,058 B; lighthouse 189ec086).
- Run alone, 12 runs across both trees, with and without load: "not held" 0 of 12. The one red run is base 1e436f6 under load, and its reds are timings. The WAV-preload hypothesis is not confirmed, and nothing ties the failure to D402.
- It has only ever shown up in multi-file runs: the 0.4.18 suite, the 0.4.19 suite, and bis418's 2 of 2.

**Ruled: no separate concurrency-4 run.** A's re-landing after D453 runs the full suite anyway, at concurrency 4 with drag-frame's own neighbours, so that suite is the experiment at no extra cost.
- A logs the other slot's holders, as already ruled, and also records which files ran beside drag-frame when it started.
- If "not held" recurs there, it becomes its own lap: drag-frame with those neighbours at concurrency 4, on ff88d85 and on 1e436f6. If the run is green, it is recorded and nothing more is done.
- It does not block D452 by itself (as ruled).

**Also recorded:**
- o18's 6 fixtures are backed up, sha256 checked, in A's `S\o18-fixtures-backup\`.
- copies-bytes was 4 of 5 and is not a proof; all 5 re-run with steps 2–8.

## P cleared D453: A re-lands 0.4.19 (librarian, 2026-10-24 18:2x; uncommitted, the freeze)

P's review: `exo_memory/handback/p-d453-review-P_2026-10-24.md` (git-blob 06dc7db7…, 12,499 B). §0 says "Cleared."
- M2 and M3 produce the same output. P read it from the code, and P's run of M3's one reachable case shows a vertex gap of 0 on either branch.
- Row 2's statistic reads 0.26–0.30 at idle, beside 4 spinners and beside 15. The worst single rep is 0.39, the bound is 0.5, and the row passes beside 15.
- Row 1 is not weaker: it is exact equality against the unchanged count, with a control. Red first under M1.

**The tip:** ff88d85 + d453-o **56c99aa** (it carries 18d97c1), merged with `--no-ff`. Steps 2–8 run again in full, with:
- step 3: D447's harness reads 24 / 21 / 0, and d453-mutants reads 3 / 1 / 0, with M2 and M3 equivalent as P read them;
- step 4: copies-bytes, all 5;
- the suite: the other slot's holders logged, and drag-frame's neighbour files recorded.
Afterwards, remove O's t180-wt-o25-d453, o26-ff88d85 and o26-7717b81 if they are clean.

**My breach of the freeze.** C's backup/pre-scrub-2026-10-24 sits at c1a52312. Five commits landed after it: O's 782569fe, mine 3845b7d4, a2979bef and 087b3c60, and A's 189ec086. Three of those are mine. I committed without checking that the freeze had started. Before step 1, C moves the backup to the current HEAD, or makes a second backup there, and step 1 covers the range up to that HEAD.

## 0.4.19 all-clear (librarian, 2026-10-24 21:1x; uncommitted, the freeze)

A's hand-back: `exo_memory/handback/p-d452-landing-A_2026-10-24.md` (git-blob c9f50c39…, 11,184 B).
- Suite: 3579 tests, 2 fail, both release-frame timing rows; EXPO 0. drag-frame 5/5 with "not held" 0, so per the ruling nothing more is done. preview-close-reuse is 2/2. core_close_best row 12 reads 27,062 ms.
- Mutation: tapmut 609/609/0. D447 is 24/21/0, after V1's run died once with 3221225477 and V1 was then re-run alone and caught. d453 is 3/1/0, d438 16/15/1.
- copies-bytes: 5 of 5 IDENTICAL. Page run: PASS, with the dds present and proxies 0 → 0 (uncalibrated).
- Credential scan: 0.

**Checked by me on disk:**
- the installed `%LOCALAPPDATA%\T-180 Track Builder\t180-track-builder.exe`: sha256 16DCFB9B…1081, 15,554,048 B;
- `.before-local-0.4.19`: sha256 9CF7DDBA…46C0, 15,548,928 B, which is 0.4.18's install;
- tag and branch `local-0.4.19` → c965f5e, with ff88d85 and 56c99aa both ancestors; `ls-remote` on origin shows nothing;
- builder processes 0; install lock free; O's three trees no longer registered;
- leftovers.js (03:07Z): fake roots 0, our long-running 0, proxies UNCALIBRATED (0).

**All-clear given.** Still open from this landing:
- V1's file death, seen once in about 25 runs, noted and not explained;
- the `local-0.4.19-7717b81` branch, kept;
- the public-push reword list (unchanged).
