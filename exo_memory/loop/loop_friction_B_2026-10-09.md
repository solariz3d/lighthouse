# D276 item 5: what the WORK checks caught, against what the PAPERWORK gates caught, since 2026-10-08 (pane B, 2026-10-09 11:4x)

Plan: `exo_memory/loop/plan_loop_friction_2026-10-09.md`, item 5 (RE-SPLIT, line 48). MEASURE ONLY: nothing was changed. No recommendation here.

**A catch** = a specific defect that would otherwise have shipped or landed wrong, found by the check named, and then fixed or ruled on. One row per
distinct defect; a defect recorded in several places is counted ONCE, under the check that first found it. A paperwork refusal counts as a catch only
if the re-send corrected a claim that was wrong.

## THE COUNTS

    WORK CHECKS        132 catches
    PAPERWORK GATES      0 catches  in 38 paperwork refusals (SOURCES 31, reply slot 6, NEXT trailer 1); +1 OUT-OF-TURN baton refusal, not a paperwork gate
                         1 refusal whose re-send LOST content (a credential-scan result and two requests; see P-16)

| work check | catches |
|---|---|
| cold read 1 | 36 |
| cold read 2 | 28 |
| cold read 3 | 10 |
| parity: generated JS suite (consumer-only reds, by first cause) | 22 |
| parity: generated `cargo test` | 5 |
| mutation harnesses and anchor sweeps | 9 |
| cold sweep (tools run against an empty data dir in the generated tree) | 3 |
| contained stranger install (lap 1) | 3 |
| identity-diff | 4 |
| source / dev / targeted suite red on an existing defect | 4 |
| generator self-checks (scan, `unportable`, declareDrift) | 3 |
| release build (`cargo tauri build`) and the release-command byte check | 2 |
| portable-paths | 1 |
| carrier-drift (source suite) | 1 |
| `derive.ps1` census | 1 |
| **total** | **132** |

Plus 1 more, found by READING and then confirmed by a red-first test (`save_config` dropped unknown keys, `handback/p-usbmode-E_2026-10-08.md:16,:82`,
fixed `c6522f52`). It is listed apart because reading is not a listed check, and it is not in the 132.

## THE PAPERWORK GATES, measured from the senders' transcripts

**Why transcripts.** `C:\Consonance\data\sources-gate.jsonl` stores a ring's sha, not its text, and a refused ring never reaches the board. The
refused text and its re-send are in each SENDER's transcript, as `tool_use` inputs. Commands: `node --max-old-space-size=4096 pairs.js`, then
`repair.js`, then `refusals.js`. The scripts are in `exo_memory/handback/p-loop-friction-B_2026-10-09_evidence/`. Their outputs (`pairs.json`,
`refusals.json`) hold other seats' message texts and stay in pane B's scratchpad. The scripts read the five transcripts, read-only:
- librarian `C--Consonance-instances-librarian/0c0c0c0b….jsonl`
- chair `C--Consonance-instances-main/0c0c0c0a….jsonl`
- A `…sibling-3d57124e/6fe15f0a….jsonl`
- B `…sibling-5bf9d657/12fb81f6….jsonl`
- E `…sibling-07b8a48f/a2122153….jsonl`

all under `C:\Users\nname\.claude\projects\`. Content = the message with its SOURCES / NEXT / OUTPUT lines stripped and whitespace collapsed.

| gate | refusals since 10-08 | re-send content IDENTICAL | re-send content CHANGED | of those, a WRONG claim corrected (= catch) |
|---|---|---|---|---|
| SOURCES (`sources-gate.jsonl` deny rows; the same 31 found as `SOURCES gate:` tool errors in the transcripts) | 31 | 20 | 11 | **0** |
| reply slot (`reply-slot.jsonl`, `blocked: true`) | 6 | 5 | 1 (one word: "That" → "The") | **0** |
| NEXT trailer ("refused by the NEXT-trailer gate", librarian 2026-10-09T16:53:29Z) | 1 | 1 | 0 | **0** |
| (baton, not a paperwork gate) OUT OF TURN, B 2026-10-09T10:31:27Z | 1 | 0 | 1 (B added a line saying it had retaken the baton) | 0 |

- **SOURCES by seat:** librarian 15, chair 11, A 2, E 2, B 1.
- **Refusal → accepted re-send:** median 9 s, max 40 s, 364 s in all (`refusals.json`, the `dt` field).
- **Pairing note:** first paired as "the seat's next allow". Two pairs (chair 22:05:02, 23:54:34) were different messages to different panes. Re-paired by
  the most similar allowed call from the same seat and tool within 15 min (`repair.js`, Jaccard ≥ 0.68): both are IDENTICAL. Hence 11, not 13.

**The 11 changed SOURCES re-sends, one by one** (diffs from `repair.js`, the texts from `pairs.json`):

| # | ts (UTC), seat | what changed | was the dropped/changed claim wrong? |
|---|---|---|---|
| P-0 | 10-08 10:04:16, librarian | dropped "(exe 10,270,720)" | not checkable now (that exe is replaced; the figure is in no file of the record) |
| P-1 | 10-08 11:33:49, librarian | dropped "(piece.js:232-235)" | no: at t180 `85fafff` (HEAD then), :232 is the JOINT re-throw, :234 the PIECE_KIND throw, :235 the continue |
| P-2 | 10-08 11:34:03, librarian | the same drop, a second refusal of the same ring | no (as P-1) |
| P-13 | 10-09 00:24:12, chair | dropped "(and from the email rule's neighbours if they'd hit the same way)" | an instruction clause, not a claim |
| P-16 | 10-09 08:54:44, librarian | **the accepted re-send has NO BODY**: only SOURCES / OUTPUT / NEXT went through. Lost: "My credential scan of origin/main..main (283 commits, 619 files) … No tokens", and the requests to commit six hand-backs and push lighthouse | not a correction; a content LOSS caused by the refusal |
| P-20 | 10-09 11:10:39, chair | "Lighthouse has no LICENSE at its root today (checked just now)" → "confirm none exists first" | no: none existed (B checked in lap 6: worktree, `git ls-files`, `origin/main`) |
| P-21 | 10-09 11:10:49, chair | the same, second wording | no (as P-20) |
| P-22 | 10-09 11:12:55, chair | "test drive constants" → "BENIGN-TEST drive constants"; "real machine path in test code" → "real machine path"; "on main 93e16…" → "on main 93e160b2 or rebased onto it" | a refinement; no prior claim was wrong |
| P-26 | 10-09 15:33:00, chair | dropped "Checked on lighthouse main 17a327a8: … tracked"; added "line 313" and "on no manifest line" | no: both .bmp files were tracked and on no manifest line (B verified in lap 7) |
| P-28 | 10-09 16:19:36, librarian | dropped "e.g." | wording |
| P-30 | 10-09 17:06:49, chair | the deny counts rephrased; added "Include THIS dispatch: its first send was denied on the Sources line alone, and the content is unchanged" | wording plus a note about the gate itself |

Tally of the 11: **6 withdrew a checkable detail** (P-0, 1, 2, 20, 21, 26), none shown wrong (5 true, 1 not checkable now); **1 lost the body** (P-16);
**4 were wording** (P-13, 22, 28, 30). The 20 identical re-sends changed only the gate's own lines.

No hand-back since 10-08 records a paperwork-gate refusal forcing a claim correction: the three extraction reads below each looked for one and found
none.

## THE WORK-CHECK CATCHES

**How compiled.** Three read-only extraction reads, run in parallel, used the definition above, one per corpus: (1) the three cold reads plus
`plan_consumer_refresh_2026-10-08.md`; (2) A's, C's and E's 12 hand-backs since 10-08; (3) B's `p-consumer-parity-B_2026-10-08.md`. I spot-checked
10 of their citations against the files (CR1:7, CR2:12, CR3:10, plan:313, plan:345-346, parity-B:69, :443-444, :657-658, and the two transcript
reads above); all 10 matched. Duplicates were removed by hand, keeping the first finder.
- CR1 = `exo_memory/handback/p-consumer-coldread-LIB_2026-10-08.md`
- CR2 = `…coldread2-LIB_2026-10-09.md`
- CR3 = `…coldread3-LIB_2026-10-09.md`
- plan = `exo_memory/loop/plan_consumer_refresh_2026-10-08.md`
- B = `exo_memory/handback/p-consumer-parity-B_2026-10-08.md`

### Cold read 1: 36
| # | defect | recorded | acted on |
|---|---|---|---|
| 1 | README repo URL mangled to `github.com/the keeper/lighthouse` | CR1:7 | B lap 4 `4fa81cd2` (plan:199,:224) |
| 2 | README `cd lighthouse/consonance` wrong folder | CR1:8 | B lap 4 (plan:199) |
| 3 | README never links GUIDE; "Try it" skips hooks, MSVC, Python | CR1:9 | E `a32bccae` (plan:214,:228) |
| 4 | 13 doubled redaction placeholders | CR1:10 | B lap 4 (plan:200) |
| 5 | README links absent `jev/README.md` | CR1:11 | B lap 4 (plan:201) |
| 6 | "complete glossary" promised, none exists | CR1:12 | E lap 4 (plan:216) |
| 7 | GUIDE:112-114 names three missing docs | CR1:13 | E lap 4b `ca6d5851` (plan:230) |
| 8 | GATES.md evidence files unreachable | CR1:14 | E lap 4 (plan:219) |
| 9 | BOOT:65 `gap2_preregistration.md` missing | CR1:15 | C `ba701075` (plan:211) |
| 10 | BOOT:113-117 "Read `:153`" dead | CR1:16 | C `ba701075` |
| 11 | BOOT:3 points at a renamed section | CR1:17 | C `ba701075` |
| 12 | BOOT:177 `attic/` absent | CR1:18 | C `ba701075` |
| 13 | SEED depends on missing `pending/`, `base_journal.md` | CR1:19 | C `ba701075` |
| 14 | LIBRARIAN's first instruction a dead placeholder; M.md absent | CR1:20 | C `ba701075` (plan:212) |
| 15 | claim-your-continuity.md:27 dead link (target not opened) | CR1:21 (again CR2:13) | B lap 5 (plan:255) |
| 16 | consonance/README:49-50 claims unshipped brief files | CR1:22 | E lap 4b (plan:230) |
| 17 | consonance/README:201 cites absent CLAUDE.md | CR1:23 | E lap 4b (plan:230) |
| 18 | USB mode files do not ship | CR1:23 | B lap 4 `2a42f248` (plan:202-203) |
| 19 | catch-ledger.js and resonance path described but missing | CR1:24 | B lap 4; C lap 4b `6acc71b8` |
| 20 | CONSUMER-STATUS gate names unshipped gen-consumer.js | CR1:25 (again CR2:8) | B lap 4, lap 5 (plan:204,:253) |
| 21 | GATES.md undefined jargon | CR1:30 | E glossary (plan:217) |
| 22 | BOOT unexplained references | CR1:31 | A jargon table, C/E (plan:220) |
| 23 | BOOT:77-128 internal history as instruction | CR1:32 | A jargon table (plan:220) |
| 24 | LIBRARIAN.md:5-27 opens on an unseen incident | CR1:33 | approx plan:220 |
| 25 | GUIDE:91 contradicts GUIDE:71 / README | CR1:34 | E lap 4 (plan:215) |
| 26 | Node "only for tests" vs required; Python missing | CR1:35 | E lap 4 (plan:214) |
| 27 | README Jev section for a retired component | CR1:36 | A (plan:220) |
| 28 | BOOT:164 "earned" contradicts the fork note | CR1:41 | C `ba701075` (plan:206) |
| 29 | BOOT says the record does not ship; inheritance/ ships | CR1:42 | ruled: kept, labelled (plan:207) |
| 30 | memory/ ships the keeper's correction notes as the seat's own | CR1:43 | excluded (plan:208,:225) |
| 31 | dont-offer-rest card: temperament as a rule about the user | CR1:44 | C lap 4 (plan:209) |
| 32 | verify-before-claiming card: the keeper's style as the user's | CR1:45 | C lap 4 (plan:209) |
| 33 | engagement-honesty card calls the keeper "this user" | CR1:46 | C lap 4 (plan:209) |
| 34 | BOOT:41 makes the keeper the reader's genuine other | CR1:47 | unknown (plan:211 label ambiguous) |
| 35 | GATES says three gates; six ship | CR1:56 | E `a32bccae` (plan:217) |
| 36 | GATES names who can turn gates off, not how | CR1:57 | E `a32bccae` (plan:217) |

### Cold read 2: 28
| # | defect | recorded | acted on |
|---|---|---|---|
| 37 | README evidence as unresolvable shas and a bare placeholder | CR2:9 | B `7681ac28` (plan:254) |
| 38 | LIBRARIAN:154 `%CONSONANCE_HOME%` defined nowhere | CR2:10 | C `f92c4c4c` (plan:259) |
| 39 | USB flow undocumented end to end | CR2:11 | E `51a16d94` (plan:260-261) |
| 40 | ARRIVING.ps1:137 hard-codes C:\Consonance\data | CR2:11 | E `51a16d94` |
| 41 | precompact.js runs an unshipped checkpoint.py (dead hook) | CR2:12 (again CR3:9) | E lap 5; B `9e432c36` |
| 42 | COMMITTEE.md:125 cites an absent memory/ note | CR2:13 | B `7681ac28` (plan:255) |
| 43 | SPINE.md:81 cites absent dev/PLAN.md | CR2:13 (again CR3:13) | B lap 5, lap 6 |
| 44 | dev/shell/README:3 cites absent dev/dream/ | CR2:13 | B lap 5; ruled SHIP, B `cffe0091` |
| 45 | SOURCE.md:65 cites loop/journal sizes that do not ship | CR2:14 | C lap 5b (plan:281-282) |
| 46 | launch shortcut / launch.vbs: no step creates them | CR2:15 | E lap 5 (plan:263); B `5d087a64` ships launch.vbs |
| 47 | GATES links lighthouse vs BUILDING/CUTOFF "private" | CR2:16 | B lap 5 (plan:257); C lap 5b |
| 48 | GUIDE omits the multi-seat loop | CR2:20 | E lap 5 (plan:264) |
| 49 | a custom brief silently breaks room_path tools | CR2:21 | E lap 5 (plan:264) |
| 50 | "three commands" understates setup; git unlisted | CR2:22 | E lap 5 (plan:264) |
| 51 | consonance/README tool/test/hook counts wrong | CR2:23 | A `f0ad1806` (plan:268) |
| 52 | install.ps1:177-180 "SHADOW ONLY" stale | CR2:24 | A `f0ad1806` (plan:269) |
| 53 | BOOT:85 cites TRAINING against TRAINING's rule | CR2:26 | C `f92c4c4c` (plan:270) |
| 54 | ui/index.html:177 comment cites absent jev-judge.js | CR2:27 | A lap 5 (plan:271) |
| 55 | retired hooks/jev-flags.js still ships | CR2:27 | B `7681ac28` (plan:256) |
| 56 | blind.js:57 data-dir default differs from GUIDE | CR2:28 | E `51a16d94` (plan:262) |
| 57 | claim-your-continuity:25 the keeper's retired seats as the reader's | CR2:32 | C `f92c4c4c` (plan:245-246) |
| 58 | the creator's seat names unlabelled in a live card | CR2:34 | C lap 5 (plan:247) |
| 59 | record/ ships the keeper's history in the system tier | CR2:35 | B `7681ac28` (plan:252) |
| 60 | "every commit authored `the keeper`" false for a stranger | CR2:36 | C `f92c4c4c` (plan:248) |
| 61 | LIBRARIAN writes past events as "this seat … tonight" | CR2:37 | C lap 5 (plan:248) |
| 62 | GATES: push/delete gates are machine-wide, unsaid | CR2:45 | E lap 5 (plan:265) |
| 63 | GATES: a repo edit needs a re-install, unsaid | CR2:46 | E lap 5 (plan:265) |
| 64 | GATES: where CONSONANCE_GATE_MODE is set, unsaid | CR2:47 | E lap 5 (plan:265-266) |

### Cold read 3: 10
| # | defect | recorded | acted on |
|---|---|---|---|
| 65 | dream_cycle.ps1:52 hard-codes C:\Consonance\instances | CR3:7 | E `39e8c7f3` (plan:292) |
| 66 | install.ps1:346 / README:192 say the excluded jev-flags.js "stays in the repo" | CR3:10 | B `9e432c36` (plan:298) |
| 67 | docs name unshipped files (AUTONOMY, SPINE, CUTOFF, a main.rs comment) | CR3:11-15 | B `9e432c36` (plan:298) |
| 68 | LIBRARIAN.md:98 example citation points at a heading | CR3:18 | A `9532611f` (plan:298) |
| 69 | GUIDE button names do not match the UI | CR3:25 | E `39e8c7f3` (plan:295) |
| 70 | second-reader hook spends the user's usage, undisclosed | CR3:31 | E `39e8c7f3`: on, disclosed (plan:290-291) |
| 71 | BUILDING:832-975 assumes the reader is in the source repo | CR3:33 | C lap 6 (plan:297) |
| 72 | no LICENSE file | CR3:35 | the keeper's call: MIT, B `a3f887c8` (plan:299,:307) |
| 73 | claim-your-continuity:12 "the same him", unlabelled | CR3:42 | C lap 6 (plan:296) |
| 74 | BUILDING:958 the creator's gh state as the reader's | CR3:45 | C `c71e091c` (plan:296) |

### Release: 2
| # | check | defect | recorded | fixed |
|---|---|---|---|---|
| 75 | `cargo tauri build` on the PUBLISHED consumer c298a5b | NSIS bundle fails: installer/header.bmp and sidebar.bmp not shipped | plan:313-325 | B `7f1690fd` (plan:355) |
| 76 | the librarian's byte check while staging the second consumer commit | c298a5b's .bin screen fixtures had their CRs stripped (autocrlf), and no .gitattributes shipped | plan:345-352 | B `ce9af4c3` (plan:355-358) |

### Parity, generated JS suite: 21
| # | defect | recorded | fixed |
|---|---|---|---|
| 77 | generated tree not a git checkout (7 tests and state-block) | B:42-44, :57-59 | `d01955a4` |
| 78 | 12 tests read the room's workshop record (absent by design) | B:46-51 | `8c0797fc` (declared) |
| 79 | state-manifest.json not shipped (3 tests) | B:53 | `d01955a4` |
| 80 | jev module neither shipped nor excluded | B:53-54 | `d01955a4` |
| 81 | no root README.md (about-readme crashed; no front door) | B:55 | `d01955a4` |
| 82 | gen-brief refused the shipped BOOT | B:57-58; `handback/p-consumer-fork-C_2026-10-08.md:265-266` | C `6424a290` |
| 83 | the OS-user rule mangled build.test's control crate | B:58-59 | `ff02c1dd` |
| 84 | decoordinate mapped Regina to New_York (time assertions) | B:59-60 | `ff02c1dd` |
| 85 | state-block "FAILED" on any history without origin/main | B:59 | `ff02c1dd` |
| 86 | corrections-gate's GUARDED regex rewritten to match nothing | B:43, :384-386; `handback/p-consumer-workshop-A_2026-10-08.md:102` | A's patch `1f3da88d` |
| 87 | corpus-age, librarian-notes, second-vantage, shelf-recursion need the record | B:183-188 | `1f3da88d` (declared) |
| 88 | contamination.js crashes for a stranger (run2 rig) | workshop-A:21 | excluded (A's ruling) |
| 89 | tj1-k-render.js crashes the same way | workshop-A:22 | excluded |
| 90 | commit-gate refusal points at an unshipped githooks/pre-commit | workshop-A:20 | MANIFEST row (A's ruling) |
| 91 | consumer-relabel / consumer-fork-wiring tests fail in the consumer | fork-C:279-282 | EXCLUDE rows |
| 92 | install-fresh-home.test.js not shipped (install.ps1 untested there) | B:394 | `f83d13cd` |
| 93 | front-door-links' evidence row red only in the consumer | B:557-559 | `bd861f8e` (declared) |
| 94 | dream-gate's parser read a commented install.ps1 line as a hook | B:657-659 | `0dbca875` |
| 95 | gen-brief-gate keyed on a CONSUMER-STATUS made conditional | B:660-661 | `0dbca875` |
| 96 | 10 carrier-drift rows read the registry/history (hidden by a shared red) | B:665-666 | `0dbca875` (declared) |
| 97 | dev/dream/ not shipped: dream-gate ENOENT (P = 1) | B:634-638 | ruled SHIP, `cffe0091` |

(Plus row 132 below, portable-paths' committed-baseline rows (P = 1 at `7f1690fd`): a parity JS catch listed last. Parity JS = 22.)

### Parity, generated `cargo test`: 5
| # | defect | recorded | fixed |
|---|---|---|---|
| 98 | screen fixtures not shipped (11 Rust tests) | B:139 | `8c0797fc` |
| 99 | 12 Rust tests read the workshop corpus | B:140-144 | `8c0797fc` (ignored, declared) |
| 100 | dedangle kept link syntax around prose (13 of 20 dead links) | B:213-214 | `ff0b96fe` |
| 101 | 7 dead doc links (jev ×2, METHOD, INSTRUMENTS, SPINE, AUTONOMY, dream_cycle) | B:209-212; workshop-A:50 | `65649d20`; E `10b72311` |
| 102 | frag-fork.md not shipped: generated tests did not compile | B:392-393 | `f83d13cd` |

### Mutation harnesses and anchor sweeps: 9
| # | defect | recorded | fixed |
|---|---|---|---|
| 103 | A's new sourced rows: 1 survivor, 1 not applied | `handback/p-devreds-A_2026-10-08.md:22` | `c3ae4616` |
| 104 | session-end rows: survivor E1, filter missed its catching row | devreds-A:65 | `50b5cd63` |
| 105 | core_cup M50 anchor dead after D274 | `handback/p-tubefromcup-E_2026-10-08.md:66-69` | `d1bf901` |
| 106 | core_jump control: harness copy lacked test/fixtures | tubefromcup-E:71-75 | `d1bf901` |
| 107 | M12 anchor left document.js with D258 | `handback/p-levelsnap-E_2026-10-08.md:69` | `a6cee64` |
| 108 | P29 anchor left piece.js with D258 | levelsnap-E:70 | `a6cee64` |
| 109 | P49, P51 survive: continued()'s leading-jump branch is dead code | levelsnap-E:77, :83 | `85fafff` (ruled equivalent) |
| 110 | heavy-run WIRING: three mutants runners spelled the require differently | devreds-A:13 | `c3ae4616` |
| 111 | (the librarian's 0.3.3 landing run) M12 (K3-2) NOT APPLIED, the stale document.js anchor | `C:\Consonance\data\board.jsonl`, the librarian's "0.3.3 is landed as 6a799cb" row, 10-08 | E's re-anchor (KE4-2) |

### Cold sweep: 3 · Contained stranger install: 3
| # | defect | recorded | fixed |
|---|---|---|---|
| 112 | ferry.js / ferry-watch.js defaulted to a path on neither machine (ENOENT) | B:69, :73-75 | `d01955a4` |
| 113 | board-audit read the keeper's board with an empty data dir | B:68 | `d01955a4` |
| 114 | chain-status was mute (0 bytes, no reason) | B:67 | `d01955a4` |
| 115 | GUIDE has no hooks step | B:91-94; plan:61-63 | E lap 2 (plan:100-101) |
| 116 | install.ps1 refuses a fresh home with no settings.json | B:91-94; plan:61-63 | E lap 2 (plan:100-101) |
| 117 | five hook defaults point at C:\Consonance | B:100-105; plan:61-63 | E lap 2 (plan:100-101) |

### identity-diff: 4 · source/dev suites: 4 · generator self-checks: 3 · single checks: 4
| # | check | defect | recorded | fixed |
|---|---|---|---|---|
| 118 | identity-diff (C) | GATES.md never shipped: every gate refusal pointed at a missing file | B:443-444; fork-C:344-348 | `e8d168d0` |
| 119 | identity-diff | B's NOT_SHIPPED note edited wake material (TRAINING.md), unregistered | B:550-551 | taken out `bd861f8e`; lines to C `6acc71b8` |
| 120 | identity-diff (RED at `5d087a64`) | read generated-from only from CONSUMER-STATUS; read C4's moved files as missing | B:662-664 | `0dbca875` |
| 121 | identity-diff, own run | reported "0 compared; 70 unregistered" on an empty tree instead of refusing | fork-C:439 | `ba701075` |
| 122 | source suite | gen-consumer.test L038/A red on a clean tree (own fresh-history rule) | B:271-273 | `4c9adb78` |
| 123 | source suite | install-only red since E's lap 3: jev-flags.js UNDECLARED | B:368-369; `handback/p-usbmode-E_2026-10-08.md:86-89` | `c6522f52` |
| 124 | dev suite | sourced.js died on transcripts over ~537 MB (ERR_STRING_TOO_LONG) | devreds-A:15 | `c3ae4616` |
| 125 | dev suite, red-first through the real hook | session-end.js firstHumanLine, same failure, hidden by a silent catch | devreds-A:29, :46, :60 | `50b5cd63` |
| 126 | generator scan | the six screen fixtures carry identity and paths; as `binary` they would have shipped unscanned | workshop-A:58-59 | the `screen` kind, `8c0797fc` |
| 127 | generator declareDrift | a stale jev-flags WORKSHOP entry after B7 | B:685 | removed in lap 5 |
| 128 | generator `unportable` | dream_cycle.test.js:23 cites the keeper's muscle_map.md | B:717-720 | `cffe0091` |
| 129 | portable-paths | delete-gate.js:161 and push-gate.js:66 hard-code a cygpath path in live code | devreds-A:14 | `c3ae4616` |
| 130 | carrier-drift (source suite) | A's hand-back :68 carried an unaccounted retired wording onto main `93e160b2` | B:756, :763-768 | routed; green by `17a327a8` |
| 131 | `derive.ps1` census | hooks/README printed files 24 / registrations 13 (real: 34 / 22) | `handback/p-consumer-devtruth-A_2026-10-09.md:36-38` | `f0ad1806` |
| 132 | parity, once the source went green | portable-paths' committed-baseline rows red only in the consumer (P = 1 at `7f1690fd`) | B:822, :856-859 | `05ef35bc` (declared) |

(`install.ps1 -Check` found the same defect as #123 (`p-usbmode-E:86-89`), so it has no row of its own.)

## WHAT THIS DOES NOT ESTABLISH
- **The definition decides the count.** Cold-read rows include identity and wording findings (e.g. the card relabels) that were acted on. A stricter
  "functional defects only" cut would shrink the cold-read rows. The excluded borderline items are listed in the three extraction reads (not
  repeated here) and number about 40.
- **The paperwork side reads only gate REFUSALS.** A gate can also change behaviour with no refusal: a seat writes a SOURCES line it would not
  otherwise have checked. That effect is invisible to this measure, in either direction.
- **The window is two days and one project** (the D273 consumer, plus the t180 laps of D270-D275).
- Items 1-4 (E, A, C) measure the costs and the content-change share. This file measures catches only.
