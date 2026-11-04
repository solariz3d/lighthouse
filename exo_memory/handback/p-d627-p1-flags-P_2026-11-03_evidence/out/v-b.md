# D627 part 1, vantage rows v20-v37 (slice v-b)

Repos: L = C:\Users\nname\Desktop\lighthouse; T = C:\Users\nname\Desktop\t180-track-builder (the t180 working repo; `Downloads\t180-fresh` has rewritten shas, e.g. v0.3.4 = 7639668 there vs 2183c4d in T). Seat letter is inferred from the pane's worktree names (c-*, e-*, a-*, b-*). Transcripts are under C:\Users\nname\.claude\projects\C--Consonance-instances-<seat>\.

The main pattern: in 12 of the 17 WRONG rows the reader searched the **lighthouse** repo or app for **t180** shas or releases (v20, v23, v25, v26, v29-v36). In the other 5 it measured live state hours or days after the claim (v21, v22, v24, v28, v37).

| row | seat | verdict | claim wrong? | acted on? | helped? | citation | note |
|---|---|---|---|---|---|---|---|
| v20 | 0845a868 (C) | WRONG | no | yes: pane re-checked in t180 | no (cost only) | transcript 0845a868 L44602: `git check-ignore -q src-tauri/dist` in c-d187-wt → "dist is ignored"; reply L45706 | reader checked L; claim was about T's src-tauri/dist |
| v21 | 3d57124e (A) | WRONG | no | no response found | n/a | transcript 6fe15f0a L55323 `2.1.287 (Claude Code)` at 10:14:26Z; `git show 234eb265:consonance/hooks/reply-slot.test.js` → 27 tests | reader measured 5 h later: 35 tests (later commits 7877aafb, 783d5905), CLI auto-updated to .288 |
| v22 | 3d57124e (A) | WRONG | no | no response found | n/a | reader's own `bak-20261003-043508`; L `git log consonance/hooks` → LIVE at 783d5905 06:02 local, after the claim | the 04:35 install was real; the hook went LIVE later (D220) |
| v23 | 07b8a48f (E) | WRONG | no | yes: pane re-verified | no (cost only) | T `git show 01165a0` → 2026-10-03 20:08 local, tools/suite2.cjs; `git show 01165a0:tools/suite2.cjs \| sha256sum` → da7e19a870bf… | reader searched L for a t180 sha; reply at transcript a2122153 L45576 |
| v24 | 3d57124e (A) | WRONG | no | no response found | n/a | transcript 6fe15f0a L61011: 14:06:19Z background loop over 4 mutation tests (mutation, core-mutation, core-xsec-mutation, core_cup_mutation) | reader looked about 1 h later and saw a different run (sp_mut.js, D235) |
| v25 | 5bf9d657 (B) | WRONG | no | no response found | n/a | T `git log a0a45ba` → 2026-10-05 10:03 local D242; transcript 12fb81f6 ~L42290: base worktree `status --short \| wc -l` → 0 | reader searched L; its "4 untracked" is L's own state |
| v26 | 5bf9d657 (B) | WRONG | no | no response found | n/a | T `git reflog main`: 22c46a0 at 16:50 local, then 2183c4d at 19:19 local (01:19Z), after the 01:08Z claim | true at the time; main took 2183c4d 11 min later |
| v27 | 5bf9d657 (B) | RIGHT-IGNORED | yes (minor) | no: no reply in transcript after L63597; p-fixedtemp-B_2026-10-11.md:16 unchanged | n/a | L `git grep -nE '<reader regex>' 029082e -- 'consonance/*.js' \| grep -v mkdtemp` → 116 lines, 33 files (33 on every main commit 10-11) | claimed 31 files, actual 33; lines 116 were right (reader's 117 is a later +1 at 10376635); census only, nothing acted on it |
| v28 | 07b8a48f (E) | WRONG | no | no response found | n/a | transcript a2122153 L95062: stress1.out "round 0 done" at 05:18:59Z, loop still running | "stress" = repeat-test loop (D351), not a RAM-stress tool; reader checked 10 h later |
| v29 | 07b8a48f (E) | WRONG | no | yes: pane re-verified | no (cost only) | T `git show --shortstat 4ca68a9` → 11 files, +815 −32 | reader searched L; reply at transcript a2122153 ~L101539: "The claim holds" |
| v30 | 07b8a48f (E) | WRONG | no (one minor stale figure) | no response found | n/a | T `git log -1 --format=%P cc17e0d` → 4ca68a9; `git show cc17e0d -- README.md` → hunk `@@ -8,6 +8,16 @@` | the commit exists as claimed; the claimed hunk `+8,14` is really `+8,16` (the reader did not flag this; the conclusion about Install at line 16 still holds) |
| v31 | 0845a868 (C) | WRONG | no | no response found | n/a | T `git log -3 883f681` → 61f2ec7 → dd405a1 → 883f681; `git merge-base --is-ancestor 883f681 v0.4.2` → true | shipped as 0.4.2 as claimed; branch d375-c was deleted later |
| v32 | 0845a868 (C) | WRONG | no | no response found | n/a | T `git merge-base --is-ancestor cbd7a40 4e61acb` → true; `git rev-parse v0.4.3` → cbd7a40; `git show cbd7a40:CHANGELOG.md` → line 8 `## [0.4.3] - 2026-10-17` | reader searched L |
| v33 | 0845a868 (C) | WRONG | no | no response found | n/a | T `git log 6292f78` → 16:56 local D395 icon; `--is-ancestor 6292f78`: v0.4.5 lacks it, v0.4.6 has it | "0.4.6 is the first to embed it" is true |
| v34 | librarian | WRONG | no | no response found | n/a | L exo_memory/librarian/2026-10-18.md:94 (21:53): origin main = tag v0.4.7 = c2d7cb5, installed exe checked | reader checked the Consonance app (0.1.1); the claim was about the T-180 builder |
| v35 | 5bf9d657 (B) | WRONG | no | no response found | n/a | L p-d421-sculptmode-B_2026-10-20.md:5,99 (3a1778f on d421-b, scan → 0); p-d456-reword-C_2026-10-25_evidence/sha-map.txt:4 3a1778f→6650ac2 | sha later rewritten by the D456 reword; reader searched L |
| v36 | librarian | WRONG | no | no response found | n/a | L p-d421c-landing-B_2026-10-21.md:1,49,70 (local-0.4.12; cargo 44 passed; 15 files 596/596/0); T bc35b1f "local-0.4.12" | reader counted harness files and #[test] attributes in L, which is the wrong unit and the wrong repo |
| v37 | librarian | WRONG | no | no response found | n/a | transcript librarian L173691 (23:58:56Z) `du` → "1.3 GB …t180-land-0431/src-tauri/target", "1.3 GB …t180-land-582/src-tauri/target" | targets removed before the reader's 15:07Z run (27M/28M now); the claim was true when sent |

## Counts
- RIGHT-ACTED: 0
- RIGHT-IGNORED: 1 (v27)
- WRONG: 17 (v20-v26, v28-v37)
- UNDECIDABLE: 0

Acted on: 3 of 18 (v20, v23, v29). Each pane re-checked, found the reader had searched the wrong repo, and confirmed its claim. That cost time and found nothing.

## Most valuable catches
1. v27 is the only real error in the slice: 31 files claimed, 33 actual (the 116 lines were right). It was low stakes, since nothing acted on the file count, and it was ignored.
2. There are no others. The slice's real finding is how the reader fails: 12 of 17 WRONG verdicts come from checking the wrong repo (lighthouse instead of t180). The other 5 come from re-measuring live state (CLI version, processes, disk size, hook mode) after it had changed. The reader should resolve the repo from the claim's paths and skip claims about live state.
