# D627 part 1, second-reader slice A (rows 0002 to 0865, 20 rows)

| row | seat | verdict | claim wrong? | acted on? | helped? | citation | note |
|---|---|---|---|---|---|---|---|
| 0002 | librarian | NO-ERROR | no | n/a | n/a | lighthouse `exo_memory/handback/p-d203-A_2026-10-01.md:21,36-38`; `exo_memory/loop/plan_second_reader_d203_2026-10-01.md:51,56,59` | backup name, 29/29, 175/175, 38/38, the log in C:\Consonance\data and scrubbed all match A's file |
| 0016 | librarian | NO-ERROR | no | n/a | n/a | `exo_memory/loop/plan_correction_count_d208_2026-10-02.md:48` | the section "Steps 1–2 collated + scored" exists as named |
| 0083 | sibling-07b8a48f (E) | NO-ERROR | no | n/a | n/a | `exo_memory/map/E.md:2098` (map line present); `exo_memory/handback/p-d217-E-v3_2026-10-03.md:42` (40 units), `map/E.md:2097` (v3 sha256 94955823…) | map line, 40 units and the sha all hold |
| 0098 | librarian | NO-ERROR | no | n/a | n/a | `git show eabd5687:consonance/hooks/reply-slot.js` → `:41 const SHADOW = true`; flipped in 783d5905 | the SHADOW constant existed as named |
| 0120 | librarian | NO-ERROR | no | n/a | n/a | `exo_memory/handback/p-xsec-A-contract_2026-10-03.md:13,15-16,19,21` | readout fields, `t180b.core/4`, 360/−540 no wrap, `first: { e, s, t }` all in A's file |
| 0254 | librarian | NO-ERROR | no | n/a | n/a | `exo_memory/loop/test1_raygap_diagnosis_2026-10-04.md:10,65-67` | the rolled turn really does overlap itself (p20 over p17 and others) |
| 0268 | librarian | NO-ERROR | no | n/a | n/a | `exo_memory/handback/p-close-B_2026-10-04.md:127` (grep for backupNow → nothing); t180 `2a2b187` committed 11:05 −0600, after the ring at 10:07 −0600 | true when sent; backupNow arrived later in 2a2b187 |
| 0305 | librarian | ERROR-MISSED | yes (flag 4) | n/a | n/a | `exo_memory/handback/p-close-rebase-E_2026-10-05.md:9-12,108` (12ab427 = "B's three D243a fixes", written by E; applyClose made async in the rebase); `exo_memory/librarian/2026-10-03.desktop.md` 10-05 23:5x (C7, C17 NOT APPLIED, "E's D243a") | claimed "every part of the bundle is now non-author green"; E's own 12ab427 fixes and the rebase's joined close path had no non-author look. Flags 1–3, 5 and 6 hold (B addendum :113-124; lib-bundle-full at 12ab427; the topology checked with `git log`). Not corrected as a claim; the 6 mutation reds on 20e5711 were found about 3 h later by a harness run |
| 0360 | librarian | NO-ERROR | no | n/a | n/a | t180 `git diff --stat 582d5ac 974e35e` empty; `exo_memory/librarian/2026-10-03.desktop.md:110` (32/32, 0 NOT APPLIED); librarian transcript `fa5fd93..582d5ac -> main` at 2026-10-06T00:02:09Z, before the ring at 00:07Z | duplicate, harness, install and push all true when sent |
| 0369 | librarian | NO-ERROR | no | n/a | n/a | `exo_memory/handback/p-warm-B_2026-10-05.md:88` | `preview-async.test.js` at d7173bf: 10 of 10 |
| 0415 | librarian | NO-ERROR | no | n/a | n/a | `exo_memory/handback/p-jumpui-A_2026-10-06.md:9,17-23,29-30,34`; t180 `d4b31fd` body "Written by pane B"; `exo_memory/loop/plan_t180_keeper_choices_2026-10-06.md:21` | all nine flagged sentences match A's file, the commit and the plan |
| 0493 | librarian | ERROR-CAUGHT-ANYWAY | yes (flag 1) | n/a | n/a | `git show 6a9b07f2:exo_memory/handback/p-freejump-E_2026-10-06.md:1` "STATE: PAUSED (WIP saved), NOT a hand-back"; corrected in row 0499 (2026-10-06T23:42Z, librarian) | the ring presented E's core as landing; it was a paused WIP save, "NOT FOR LANDING". The librarian corrected itself about 94 min later; meanwhile D258 stayed parked during the keeper's nap. Flag 2 holds (`p-maxspeed-E_2026-10-06.md:77`, 7 fail) |
| 0499 | librarian | NO-ERROR | no | n/a | n/a | `exo_memory/librarian/2026-10-06.desktop.md:8,10-15`; librarian transcript contains the tool output `pass 1940` | 455 s, 1,940 pass, the geom_grow flake, 8 harnesses with 0 NOT APPLIED, un-held at 16:08 |
| 0556 | sibling-5bf9d657 (B) | NO-ERROR | no | n/a | n/a | `exo_memory/handback/p-openexport-B_2026-10-07.md:41,47-49` | red: all 4 failures were the new rows; green: 12 files listed, 198/0/2 |
| 0559 | librarian | NO-ERROR | no | n/a | n/a | `exo_memory/loop/plan_t180_big_tube_crash_2026-10-07.md:15`; `exo_memory/handback/p-bigtube-E_2026-10-07.md:9-25` (cause confirmed by E) | the two warm workers do run at once (D240 485c5b6) |
| 0566 | librarian | NO-ERROR | no | n/a | n/a | `gh release view v0.3.0` → target 4afddb2754e4…, asset 2,689,528 B; `exo_memory/librarian/2026-10-06.desktop.md:48-49` | tag, asset, push, .before-030, 7 of 8 clean, TEST 1 red: all hold |
| 0599 | librarian | NO-ERROR | no | n/a | n/a | t180 `git show 6a799cb:package.json` → "0.3.3"; `gh release view v0.3.3` publishedAt 2026-10-09T08:54Z, after the ring | not yet public was true |
| 0762 | sibling-3d57124e (A) | NO-ERROR | no | n/a | n/a | lighthouse `git branch --contains 0794577d` → startdigest-a; "D277 part 5 (A)" | the commit exists on the named branch |
| 0795 | librarian | NO-ERROR | no | n/a | n/a | `node` length of `C:/Consonance/retrieval/remeasure1003/verify/B/claims.json` .claims → 168; B's transcript (sibling-5bf9d657) call_librarian at 2026-10-10T13:55Z = 07:55 −0600 | both figures hold |
| 0865 | librarian | NO-ERROR | no | n/a | n/a | lighthouse `git branch --contains 10966409` → d290-b; the commit adds `loop/h2_registration_2026-10-11.md`, "sealed before any arm runs" | the commit exists as named |

## Counts
- ERROR-MISSED: 1 (0305)
- ERROR-CAUGHT-ANYWAY: 1 (0493)
- NO-ERROR: 18
- UNDECIDABLE: 0
- Total: 20. Flags checked: 50. Flags that pointed at a real error: 2.

## Most valuable catches
1. **0305, flag 4.** The ring said the whole bundle was "non-author green", but E's own 12ab427 fixes and the async-applyClose rebase had no non-author look. The bundle landed and was installed on that basis. Later, a harness run on main found C7 and C17 NOT APPLIED and attributed them to "E's D243a". That is the kind of gap a look would have covered. The confidence that it is a real error is moderate: the ring did name the fixes as E's in its own parenthesis.
2. **0493, flag 1.** A paused WIP save ("NOT FOR LANDING") was relayed as E's core landing. The librarian corrected it itself about 94 minutes later (row 0499), but the run-through the keeper asked for during his nap stood still in the meantime.

Note on what the slice shows: 18 of 20 rows flagged sentences that were accurate. Most of them were procedural "not re-read this turn" flags, where the master agreed.
