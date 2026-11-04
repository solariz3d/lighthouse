# p-d620 — the open laps, one line each, and the "delivery-unconfirmed" dispatches (O), 2026-11-02

Packet: the chair's D620 (23:38Z), ROOM AUDIT item 3 of `exo_memory/loop/plan_room_audit_2026-11-02.md`. READ ONLY: nothing was written to `lap.jsonl` or `board.jsonl`. Seat: O.

## How the list was made
checked: `S\d620\laps620.js` → `S\d620\laps620.json`.
- The open set is the pulse's own: `consonance/tools/chain-status.js` `openLaps` and `staleLaps` over `C:\Consonance\data\lap.jsonl`. It gives **85 open, 44 of them stale**, which is the pulse's "STALE … +41" and "+84 more open" plus the head lap.
- For each lap, the evidence is:
  - its own rows;
  - the hand-back files that name it;
  - lighthouse and t180 commits that name it;
  - for t180 work, the first release tag holding it.
- Landings re-commit the work, so branch shas are not on main. The tag is found through the main commit with the same subject (`S\d620\landed.sh`), or through the release notes.
- "Released vX" below means a tag of the public repo holds the work. 0.4.31 to 0.4.34 were installed for his look but never tagged; their work went out in **v0.4.35** (0.4.36's notes hold 0.4.31–0.4.35).

**Proposed close, in three words.**
- **filed**: the work was done and delivered, landed or released.
- **dropped**: stopped by the keeper or never started at his word.
- **superseded by Dxxx**: another lap took the work.
- **keep open**: work still owed.

## The table (85)

| lap | what happened | evidence | proposed close |
|---|---|---|---|
| D408 | D407's release-hitch line; its last part, D407b (release-frame row 4), shipped | main `0dedf9d` "Release-frame row 4 scores a Turn change by its longest frame", v0.4.23; `p-d458-ledger-sweep-E_2026-10-25.md` §4 | filed |
| D461 | The stranger's-first-hour report delivered; its fix became D463 | `p-d461-stranger-E_2026-10-25.md`; lighthouse `db5ac737` | filed (fix: D463) |
| D478 | Watch/desktop capture, queued by the keeper behind the Third Place work; never started (E did nothing at his word) | `p-d478-watch-E_2026-10-26.md`; plan `loop/plan_d478_watch_2026-10-26.md` | dropped (queued plan, never dispatched); re-open if he asks |
| D480 | D476 part 4, the batched keep-warm visit: built, swapped in at his word, running | lighthouse `5eb71d27` (swap armed), `8bccc753` (swapped in and running), `ebaa5352` (first visit letter seen) | filed |
| D501 | The stick carry: test done (Parts 1, 2, 2b), the waiter armed; the carry itself moved to Wednesday | `p-d501-2b-A_2026-10-28.md`; lighthouse `c9d172de`, `5328eb32` "stick carry moved to Wednesday" | keep open (the carry has not run) |
| D525 | The four soft-road variants copied into the game and compared | `p-d525-soft-O_2026-10-28.md`; lighthouse `7bd959b2`, `09448eba` | filed |
| D526 | D517's checker (25 g stops, load-on-chassis, wall-swerve), built and installed, parked on his look | main `687c09a`, v0.4.30 | filed (released v0.4.30) |
| D542 | The 3D picture and bars centred; reversed on his drawing, then restored | branch `98e3d81` = main `6667141`, v0.4.35; `p-d545-restore-C_2026-10-29.md` | filed (released v0.4.35) |
| D543 | Texture lines on a closed tube's walls: the fix | branch `38afa0f` = main `1a9cd20`, v0.4.35; `p-d543-part2-A_2026-10-29.md` | filed (released v0.4.35) |
| D544 | The active car against the regular one on CRAZY TEST: the active one needs its own checker profile; parked on his word | `p-d544-active-O_2026-10-29.md`; lighthouse `193c23da` | filed (the report); the profile is his call, a new lap if he wants it |
| D546 | The UI slop audit delivered (8 proposals); his picks became D547 | `p-d546-slop-audit-C_2026-10-29.md`; lighthouse `0f8a76e0` | superseded by D547 |
| D547 | The first set of UI fixes: built, graded, landed | branch `27116e0` "Three sizes of type" = main `97a6422`, v0.4.35; `p-d547-regrade-C_2026-10-30.md` | filed (released v0.4.35) |
| D548 | File ▸ Export for Blender (glTF, FBX) | branch `61a4e2a` = main `991cfbe`, v0.4.35 | filed (released v0.4.35) |
| D549 | A jump from a lip raised with the brush | branch `92a36ef` = main `c2ae654`, v0.4.35 | filed (released v0.4.35) |
| D550 | The at-start ramp: candidates rendered, F picked, F made the default (D573) | `p-d550-ramp-E_2026-10-30.md`, `p-d573-f-default-C_2026-10-30.md`; main `0492df4` (width as F), v0.4.35 | filed (released v0.4.35) |
| D551 | Every installed T-180 against the checker's car profile: the fleet page | `p-d551-cars-O_2026-10-30.md`; lighthouse `48526796` | filed |
| D552 | Candidate G refused as F by another name; render cancelled | `p-d552-ramp-E_2026-10-30.md`; lighthouse `62761c2c`, `a26ff99e` ("D552 filing confirmed") | filed |
| D553 | Code map of consonance/src-tauri/src, accepted | `p-d553-codemap-C_2026-10-30.md`; landed with D559/D570 | filed |
| D554 | Duplicate-block scan; its fix (1) became D557 | `p-d554-dupes-E_2026-10-30.md`; lighthouse `4eff4a11` | filed (fix: D557) |
| D555 | t180 code map and CLAUDE.md, accepted and landed | `p-d555-t180map-C_2026-10-30.md`; t180 main `60c7688`, v0.4.35 | filed (released v0.4.35) |
| D556 | Five pointer skills and the code-map habit | `p-d556-skills-O_2026-10-30.md`; lighthouse `0ca3eccd`, `53811469` | filed |
| D557 | Lift test: the t180 half refused correctly (it already exercises the adapter); the tools half landed | `p-d557-lift-test-E_2026-10-30.md`; lighthouse `b1d3351d` | filed |
| D558 | track-equations restored as a local skill (parts 1, 2) | `p-d558b-trackeq-tools-C_2026-10-30.md`; lighthouse `11195760` | filed |
| D559 | Four-branch landing: t180 pushed; the lighthouse push, refused, was re-landed by D564 | `p-d559-landing-E_2026-10-30.md`; t180 `60c7688`; lighthouse `97fe6280` | filed (lighthouse half: D564) |
| D560 | Every T-180 on ELYSIUM, from his replays | `p-d560-fleet-elysium-O_2026-10-30.md`; lighthouse `caa4024c` | filed |
| D561 | read-before-edit.js, the instrument, landed by D570 | `p-d561-readbeforeedit-C_2026-10-30.md`; lighthouse `e80b2af7` | filed |
| D562 | Outside critique measured before it is answered (BUILDING.md) | `p-d562-critique-rule-A_2026-10-30.md`; lighthouse `020c4776`, landed `97fe6280` | filed |
| D563 | The Demo wheel under the road past the helix: Part 1 measured; Part 2 (the apron) became D572 | `p-d563-wheel-under-O_2026-10-30.md` | superseded by D572 |
| D564 | Housekeeping, the history rewrite, lighthouse re-landed and pushed | `p-d564-housekeeping-E_2026-10-30.md`; lighthouse `8014d0b0` | filed |
| D565 | ELYSIUM's sector-2 gate: no loader bug; the fix went to D566/D567 | `p-d565-gates-O_2026-10-30.md` | superseded by D566 and D567 |
| D566 | The sector-gate rule, accepted; its changelog line released | branch `2408191` = main `de456f6`, v0.4.35; `p-d566-gates-A_2026-10-30.md` | filed (released v0.4.35) |
| D567 | ELYSIUM's gate moved onto flat road in a copy; tools/kn5-move-gate | branch `acc9280` = main `34a2155`, v0.4.35 | filed (released v0.4.35) |
| D568 | ELYSIUM GATES STIFF folder built | lighthouse `e508c714`, `0e876dd1` | filed |
| D569 | GATES and STIFF installed as new folders | `p-d569-install-C_2026-10-30.md` | filed |
| D570 | Landing: d561-c, origin/main merged into local main | `p-d570-landing-E_2026-10-30.md`; lighthouse `b680cca2` | filed |
| D571 | Soft block CFM default, at his yes | branch `c456efe` = main `c456efe`, v0.4.35; `p-d571-cfm-C_2026-10-30.md` | filed (released v0.4.35) |
| D572 | Edge apron Part A (and B, C) | branch `af2aa0f` = main `f3b84a3`, v0.4.35; `p-d572-apron-E_2026-10-30.md` | filed (released v0.4.35) |
| D573 | F as the at-start default; 0.4.31 built and installed | branch `492a264` = main `125eff8`, v0.4.35; `p-d573-build-0431-C_2026-10-30.md` | filed (released v0.4.35) |
| D574 | Width at start eases in like F | branch `e3bdf48` = main `0492df4`, v0.4.35; `p-d574-width-f-C_2026-10-30.md` | filed (released v0.4.35) |
| D575 | Aqua's dialog buttons readable | branch `7bff687` = main `258e8e4`, v0.4.35; `p-d575-dialogs-A_2026-10-30.md` | filed (released v0.4.35) |
| D576 | Outside review items 4–7 (descriptions, screenshot, test config, CSP) | main `98e0772` (CSP), `c9680f8` (README), v0.4.35; `p-d576-review-fixes-A_2026-10-30.md` | filed (released v0.4.35) |
| D577 | Comment sweep pass E | `p-d577-sweep-E_2026-10-30.md`; main `b4761da`, v0.4.35 | filed (released v0.4.35) |
| D578 | Comment sweep pass C | branch `2fc54a9` = main `b83bd2f`, v0.4.35 | filed (released v0.4.35) |
| D579 | CI on GitHub's Windows runners | branch `94b5092` = main `bc74cfa`, v0.4.35 | filed (released v0.4.35) |
| D580 | Comment sweep last pass A | `p-d580-sweep-A_2026-10-30.md`; landed in the D582 batch; main `b4761da`, v0.4.35 | filed (released v0.4.35) |
| D581 | Extend panel start boxes, hover card, view tag | branch `88e642e` = main `46c2c6c`, v0.4.35 | filed (released v0.4.35) |
| D582 | Batch landing; 0.4.32 installed for his look | `p-d582-batch-C_2026-10-31.md`; its work in v0.4.35 | superseded by D598 (0.4.35) |
| D583 | Long tracks: the heap crash and the load; 0.4.33 installed | branch `931e580` = main `b9df1a0`, v0.4.35; `p-d583-long-tracks-C_2026-10-31.md` | filed (released v0.4.35) |
| D584 | Coarse preview road far from the camera | main `91eccc8`, v0.4.35; `p-d584-preview-lod-A_2026-10-31.md` | filed (released v0.4.35) |
| D585 | Consonance: the map travels in the pane's intake | `p-d585-map-intake-O_2026-10-31.md`; landed by D588 (`fdec4a77`) | filed |
| D586 | Consonance: the map gate on call_librarian | `p-d586-map-gate-E_2026-10-31.md`; landed by D588 | filed |
| D587 | The validator's heap, measured and cut | branch `b6fa925` = main `1eb9d24`, v0.4.35 | filed (released v0.4.35) |
| D588 | Consonance Parts 2+3 landed; the exe swap waits on his word | `p-d588-landing-E_2026-10-31.md`; lighthouse `16d2f67e` (all-clear) | filed (the swap is his) |
| D589 | The hover pick culled by box | main `ee23446`, v0.4.35; `p-d589-hover-cull-A_2026-10-31.md` | filed (released v0.4.35) |
| D590 | The 0.4.34 landing, voided: 0.4.33 final carried d589-a | its own note "superseded: 0.4.33 final 7373f150 carries d589-a; no 0.4.34" | superseded by D583 (0.4.33 final) |
| D591 | One export banner while it runs and when it ends | `p-d591-export-banner-A_2026-10-31.md`; v0.4.36 notes ("Every export now says it is running") | filed (released v0.4.36) |
| D592 | Save and Export ask before writing over another track | `p-d592-overwrite-E_2026-10-31.md`; v0.4.36 notes | filed (released v0.4.36) |
| D593 | The apron's shape, texture and pit ends; the overnight apron | branch `8dd5029` = main `8fb6ecc`, v0.4.36; `p-d593-apron-shape-O_2026-10-31.md` | filed (released v0.4.36) |
| D594 | Before he closed: lighthouse synced, WIP committed | `p-d594-close-E_2026-10-31.md`; lighthouse `0b6cbb46` pushed | filed |
| D595 | The smooth bank ramp, dropped by the keeper (18:11) | its own note "dropped by the keeper 18:11"; lighthouse `cc93c15e` | dropped |
| D596 | The pit taper: A stopped for good, O took the pit (D593) | its own note "A stopped for good; O owns the pit" | superseded by D593 |
| D597 | 0.4.35 early merge (d591-a, d592-e) | `p-d597-merge-0435-E_2026-10-31.md`; the work released in v0.4.36 | superseded by D598/D600 |
| D598 | 0.4.35 landed and installed | `p-d598-land-0435-E_2026-10-31.md`; tag v0.4.35 | filed (released v0.4.35) |
| D599 | Sci-fi road texture onto ELYSIUM 0435, a new save | `p-d599-scifi-C_2026-10-31.md`; lighthouse `e0bf07ae` | filed |
| D600 | 0.4.36 landed and published | `p-d600-release-0436-E_2026-11-01.md`; tag v0.4.36 on `f44f76e` | filed |
| D601 | "Which apron is first": the same apron in all three; replaced by the slab | `p-d601-first-apron-O_2026-11-01.md`; its own note | superseded by D604 |
| D602 | CI red on the public repo: fixed, green on main | `p-d602-ci-E_2026-11-01.md`; lighthouse `943b8445` (run 41430606728) | filed |
| D603 | LANIAKEA: the sector gate and the AI line's vertical tangent | `p-d603-laniakea-C_2026-11-01.md`; main `8c4541e`, `1341bbb`, v0.4.37 | filed (released v0.4.37) |
| D604 | The road as a hull; the pit notch; the tube joints and openings | `p-d604-slab-O_2026-11-01.md`; main `7ecb0fc`, `6f35f7c`, v0.4.37 (the joints' line in v0.4.38) | filed (released v0.4.37) |
| D605 | LANIAKEA's bump before the banked turn: the cause found; the bank's code held at his word ("0.4.37 without the bank") | `p-d605-bump-A_2026-11-01.md`; lighthouse `0bc657be`; D606's own title | keep open (the bank change is held) |
| D606 | 0.4.37 released | `p-d606-release-0437-E_2026-11-02.md`; tag v0.4.37 `b497c5d` | filed |
| D607 | The dedicated tube test | `p-d607-tube-test-C_2026-11-02.md`; `test/tube_cases.test.js` in v0.4.37 and v0.4.38 | filed (released v0.4.37) |
| D608 | Survey: which defect classes export refuses (5 of 6 silent); it fed D609 | `p-d608-export-gaps-A_2026-11-02.md`; lighthouse `7e622638` | filed |
| D609 | The final-scene export check, with his yes after the preview | `p-d609-final-scene-A_2026-11-02.md`; branch `6f0969e` = main `dbe05ed`, v0.4.38 | filed (released v0.4.38) |
| D610 | A lighter underside | `p-d610-light-underside-C_2026-11-02.md`; branch `81b8b25` = main `86a2a66`, v0.4.38 | filed (released v0.4.38) |
| D611 | The preview's banding: fixed (`f835410`), rides 0.4.39 | `p-d611-banding-E_2026-11-02.md`; `f835410` not on main | keep open (lands in 0.4.39) |
| D612 | The mirror-on-insert box | `p-d612-mirror-checkbox-O_2026-11-02.md`; branch `c2d3880` = main `b5524ff`, v0.4.38 | filed (released v0.4.38) |
| D613 | The TEST 10 preview installed and driven ("drives alright") | `p-d613-test10-preview-O_2026-11-02.md` | filed |
| D614 | The final-scene check's memory, 3413 → 1106 MB | `p-d614-check-memory-A_2026-11-02.md`; branch `71a8556` = main `f2489a2`, v0.4.38 | filed (released v0.4.38) |
| D615 | 0.4.38 released, CI green | `p-d615-release-0438-C_2026-11-02.md`; tag v0.4.38 | filed |
| D616 | The helix clipping: the drawn hull cuts another pass's apron (visual only); the fix asked as D617 | `p-d616-helix-clearance-A_2026-11-02.md`; lighthouse `9a5c7124` | superseded by D617 |
| D617 | The hull keeps clear of other passes, in work now (A) | lighthouse `9a5c7124` | keep open (live) |
| D618 | Room audit 1, in work now | the chair's dispatch 23:38 | keep open (live) |
| D619 | Room audit 2, in work now | the chair's dispatch 23:38 | keep open (live) |
| D620 | Room audit 3, this hand-back | this file | filed when this is read |

**Tally:**
- **85 rows** in all.
- filed: **68**, counting D620 itself; **36** of them name a release tag. D461, D554 and D559 are filed with their follow-up lap named.
- superseded: **9** (D546, D563, D565, D582, D590, D596, D597, D601, D616).
- dropped: **2** (D478, D595).
- keep open: **6** (D501, D605, D611, D617, D618, D619).
- checked: the table's own rows counted by their last column (a node one-liner over this file).

## Why so many laps stayed open: two findings, for the chair (no row needed)
- **A "retake" baton row is written to every lap that is in `working`, not only the lap it dispatches.**
  - D408 and D575 each carry the same rows, e.g. "retake to start the room audit" at 2026-11-02 23:37 and "retake to dispatch A (D617)" at 23:07.
  - A lap in `working` therefore never ages past 24 h, so the stale list misses it: 41 of the 85 sit in `working` (`laps620.json`, `stages`).
- **Most of the rest stop at `handbacks-in` or `return-leg` with the chair as holder.** The chair accepted the work, but no `filed` row followed.

## The "delivery-unconfirmed" dispatches (the pulse counts 31; this read finds 32)
- **All 32 were received.** The count is from the last `filed` lap (anchor 2026-10-30 00:24), as `chain-status.js` `collation` counts it. Each dispatch's opening words are in that pane's own user row on the board.
  - checked: `laps620.json` `unconfirmed[].nextRowFromPane`, 32 of 32.
  - The 32nd is the D620 dispatch to O at 23:38, sent after the pulse's count.
- **Why each reads "unconfirmed":** the dispatch row says "WRITTEN BUT UNCONFIRMED — no render (or echo) in the pane's capture within 1800ms". The pane's user row carrying the message is seconds EARLIER than the chair's row (for D612: the pane's row at …667348, the chair's at …669393).
  - The chair writes its row after the delivery attempt, and its 1800 ms render window is shorter than the pane's render.
  - So every "unconfirmed" here was delivered. *inferred:* the confirmation reads the wrong signal; checked on all 32, not on any other period.

| sent (local) | to | dispatch (its first words) | received |
|---|---|---|---|
| 10-30 22:37 | E | D552 Part 1: candidate G | yes |
| 10-31 00:19 | E | Ledger D564: HOUSEKEEPING | yes |
| 10-31 02:32 | C | Ledger D573, two packets | yes |
| 10-31 23:12 | O | Ledger D593: the apron reads as part of the road | yes |
| 11-01 00:03 | C | Lighthouse sync accepted (fdec4a77) | yes |
| 11-01 00:04 | A | Ledger D596: the PIT LANE GROWS OUT | yes |
| 11-01 03:56 | O | D593, the edges | yes |
| 11-01 05:23 | O | OVERNIGHT. The keeper, 23:22 | yes |
| 11-01 06:09 | E | Ledger D600: LAND AND PUBLISH 0.4.36 | yes |
| 11-01 14:30 | O | Ledger D601, RENDERS ONLY | yes |
| 11-01 14:30 | E | D600 verified (librarian 01:34) | yes |
| 11-01 14:38 | C | Ledger D603: LANIAKEA's two export faults | yes |
| 11-01 14:52 | O | D601 checked (librarian 08:51) | yes |
| 11-01 14:57 | A | Ledger D605: a bump on LANIAKEA | yes |
| 11-01 15:04 | A | D605 step 1 ACCEPTED | yes |
| 11-01 16:33 | O | D604 REDO, in the keeper's words | yes |
| 11-01 16:34 | A | D605 REDO | yes |
| 11-01 16:50 | A | D605: HOLD THE CODE | yes |
| 11-02 10:39 | E | D602: LAND THE CI FIX ON MAIN NOW | yes |
| 11-02 10:53 | E | QUEUED for when your CI-on-main run is back | yes |
| 11-02 10:57 | C | Ledger D607: a DEDICATED TUBE TEST | yes |
| 11-02 12:41 | A | Ledger D608: a READ-ONLY survey | yes |
| 11-02 12:48 | E | D606 GO: LAND AND RELEASE 0.4.37 | yes |
| 11-02 13:03 | C | Ledger D610: A LIGHTER UNDERSIDE | yes |
| 11-02 16:24 | E | D606 verified (librarian 08:21) | yes |
| 11-02 16:24 | O | Ledger D612: a small UI bug | yes |
| 11-02 18:31 | A | D609 is final | yes |
| 11-02 19:54 | C | D610 checked (librarian 12:30) | yes |
| 11-02 22:45 | A | D614 shipped inside 0.4.38 | yes |
| 11-02 23:38 | E | D611 passed (librarian 14:17) | yes |
| 11-02 23:38 | C | D615 closed: 0.4.38 is out | yes |
| 11-02 23:38 | O | D613 closed: he drove the preview | yes |

## Corrections (mine, in this lap)
- My first receipt check matched nothing (0 of 32), from four faults in turn:
  - the wrong row fields;
  - a sid looked up by letter (letters.json maps several past sessions to one letter);
  - a search that started at the chair's row, after the pane's;
  - a regex my shell edit had mis-escaped.
  - Each was found by tracing D612, which I know arrived, and the final check reads 32 of 32. No figure above comes from the earlier runs.

`S` = `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-36313935\c88002b1-74d8-4036-8cc0-f64aefbeabff\scratchpad`.

SOURCES: `S\d620\laps620.js`, `S\d620\laps620.json`, `S\d620\landed.sh`, `C:\Consonance\data\lap.jsonl`, `C:\Consonance\data\board.jsonl`, `C:\Consonance\data\letters.json`, `consonance/tools/chain-status.js`, the hand-backs and commits named in the table, t180 `git tag --contains`
NEXT: the chair writes the close rows from this table when the librarian rings it
