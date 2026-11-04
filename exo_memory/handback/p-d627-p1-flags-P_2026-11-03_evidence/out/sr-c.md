# D627 part 1, slice sr-c (second-reader rows): adjudicated against the record

Repos: lighthouse = C:\Users\nname\Desktop\lighthouse; t180 = C:\Users\nname\Downloads\t180-track-builder (the main t180 repo; t180-fresh lacks these shas). Librarian log times are local (Z-6). "A tx" = C:\Users\nname\.claude\projects\C--Consonance-instances-sibling-3d57124e\6fe15f0a-….jsonl.

| row | seat | verdict | claim wrong? | acted on? | helped? | citation | note |
|---|---|---|---|---|---|---|---|
| 1967 | librarian | NO-ERROR | no (all 3 flags) | n/a | n/a | A tx tool_result 2026-10-19T12:34:57Z (`upMs` 103.9 @1000, 372.8 @5000); A's ring 13:04Z ("66 unmuted cases"); handback/p-d407-measure-A_2026-10-19.md §1 (nearest window 10:09:50) | flag 3: ~104/~373 are a real pilot run's upMs, labelled not of record; the later quiet-judged run read 60–63/292 (session407-unmuted.log), but no wrong figure was claimed |
| 2042 | librarian | NO-ERROR | no | n/a | n/a | t180 `git log -1 68e505c` (D410, on b306309); `git merge-base --is-ancestor 68e505c b8ee2b4` → not an ancestor; librarian/2026-10-18.md:328 (install 4 = 7c70d946 from b8ee2b4) | install 4 lacks D410, as claimed |
| 2052 | sibling-36313935 (O) | NO-ERROR | no | n/a | n/a | O tx: "test result: ok. 1072 passed; 0 failed; 6 ignored"; librarian/2026-10-18.md:344 | adjacent (not flagged): O later self-corrected "pushed 7a1cf49b before cargo was run on it" in its own transcript |
| 2075 | librarian | NO-ERROR | no (all 3 flags) | n/a | n/a | librarian/2026-10-18.md:388 (23:13 note); t180 `git show 52558e3:CHANGELOG.md` line 16 "as reported: …"; `52558e3:app/test/theme-mutation.test.js` line 3 names sky-prism-crisp; E handback m6 §4 :55-59 | |
| 2133 | sibling-36313935 (O) | NO-ERROR | no (all 3 flags) | n/a | n/a | p-d421-shell-O_2026-10-20_evidence: d335-run.before/after.json (two-piece landed 0.1 → 0.2); final-harnesses.tap 244 "applied, and caught" lines, 0 NOT APPLIED; final-touched.tap + final-harnesses.tap:9 exit 3221225477 | control red in core-close-mutation is disclosed in the same message |
| 2139 | librarian | NO-ERROR | no | n/a | n/a | lighthouse a3f10577: blob ad211833, `git cat-file -s` 9172 | the only version of the file |
| 2219 | sibling-07b8a48f (E) | NO-ERROR | no | n/a | n/a | `ls` t180-d421-e\shots403 → after3-up-t0.png + 6 base0413-*.png; t180 `rev-parse d403-on-0413` = 2ccee1e | |
| 2272 | sibling-372c8abc (P) | NO-ERROR | no (both flags) | n/a | n/a | scratchpad d434/tests-681727f.log (21 tests, two files' rows, exit 0); lighthouse 7fd934e3:p-d437-P_2026-10-22.md:57-59 "§3 … (filled in from the second headless pass)"; §3 filled at 18864355 (23:24 local) | "no lock" not checkable from disk; inferred true |
| 2306 | sibling-3d57124e (A) | NO-ERROR | no (both flags) | n/a | n/a | t180 `rev-parse --short local-0.4.15` → 42d4c2b; handback/p-d441-landing-A_2026-10-23.md:9, :60-73 (b6969da 7.0/6.6 red, row at bar) | |
| 2375 | librarian | NO-ERROR | no | n/a | n/a | lighthouse 01521129 (10:54:17 local): blob ff76e73b, size 92291 | §9.0 quote present at :421 |
| 2377 | librarian | NO-ERROR | no (both flags) | n/a | n/a | d67f420f: blob 17156f14, 6510 B; `git log -S"## 13:39 — 2026-10-24, D451 read"` → 567e056b at 13:39:03 local, 5 s before the message | flag 2: the note was appended (by a route the reader didn't see) |
| 2402 | sibling-3d57124e (A) | NO-ERROR | no | n/a | n/a | lighthouse 189ec086 handback lines 63-66; A tx "git worktree remove … t180-wt-o18 …, t180-wt-o24-d451, p447g, p447h and p447i"; dirs absent | 4/5 is A's own stopped run; the d452/copies-bytes.out on disk is the later 5/5 rerun (18:53), interim not re-derivable |
| 2424 | sibling-5bf9d657 (B) | NO-ERROR | no | n/a | n/a | lighthouse `git log -1 --format=%p`: 6606832a ← 73304fd7 ← daae452e; handback p-d454-gen-B :8-9 | not on any remote branch |
| 2431 | sibling-07b8a48f (E) | NO-ERROR | no | n/a | n/a | `grep -c scratch_dir ~/.consonance.json.before-d454` → 0 (backup of the pre-change file); live file gained it 2026-10-25 08:01 local | value not printed |
| 2444 | librarian | NO-ERROR | no | n/a | n/a | cdae802e:handback/p-d454-landing-A_2026-10-25.md:72-84; dir scratchpad\d454\c-dirty-backup exists | "restored" = checkout of 2 byte-identical/prefix files after backup; nothing lost |
| 2446 | librarian | NO-ERROR | no | n/a | n/a | handback/p-d454-install-E_2026-10-24_evidence/scripts/config-keys.js:12,33 (mtime 10-24 23:23, before the message) | backup + existsSync refusal as stated |
| 2459 | sibling-0845a868 (C) | NO-ERROR | no | n/a | n/a | t180 `git reflog pub-0.4.19`: dfe16d3 at 10:25:09 local (16:25Z), next move 11:08; `git log -1 --format="%H %P" dfe16d3` → full hash matches, parent fc75629 | |
| 2475 | librarian | ERROR-CAUGHT-ANYWAY | yes | n/a | n/a | B tx call_librarian 2026-10-25T21:46:39Z "The three deletes are done"; correction librarian/2026-10-18.md:752 (15:49 local = 21:49Z, "D450 CLOSED") | claimed "D450's deletes still run" at 21:48:47Z; they had finished 2 min earlier. Caught by the librarian itself ~1 min later; mattered: no (a parenthetical, the dispatch to P/C unaffected) |
| 2515 | librarian | NO-ERROR | no (all 5 flags) | n/a | n/a | lighthouse 675304ac (21:15:10 local): blob d97df72c; its §6: 8919cc9d…, cmp -l 24 bytes (2+6+16), 189/189, 123/123/0, rangescan total 0 | flag 5 is an instruction for the notes; notes later checked keeper 0 (§7) |
| 2553 | librarian | NO-ERROR | no | n/a | n/a | lighthouse `merge-base --is-ancestor d30a1de7 main` → not in main; handback/p-d471-install-A_2026-10-26.md §9 (a471 and G:\…\a-d471 removed only at 16:20Z, after this message) | |

## Counts

- NO-ERROR: 19
- ERROR-CAUGHT-ANYWAY: 1 (2475)
- ERROR-MISSED: 0
- UNDECIDABLE: 0

Flags in the slice: 33 across 20 rows; 1 found a real error.

## Most valuable catches

1. 2475: the only real error, a status claim 2 minutes stale. It was caught within a minute and nothing acted on it, so its value was low.
2. No other row in this slice found an error. One flag looked like a hit and was not: 1967 flag 3, where ~104/~373 do not match A's later table but do match A's own pilot `upMs`. Two flags fired only because a fact came by a route the reader did not see: 2377 flag 2 (a note committed 5 s before) and 2446 (a script file the turn never opened).
