# Fix what is not working, then the list, in a work loop until all is done. Librarian, on D, 2026-09-24 17:0x.

The keeper, verbatim: *"lets fix what is not working and then 'yourlist' in a work loop till all is done"*.
Strict wait-for-all. One collation ring per batch, and each batch's NEXT comes from its output.

## THE KEEPER'S DECISIONS, 2026-09-24 ~17:05 (AskUserQuestion, the librarian's seat)
- **CH-4: RETIRE** the old slogan in the live design files. Strike in place and keep the old text as a dated trace;
  dated records are untouched; arm the drift check.
- **ASK-002: YES, keep it widened.** The audio interest and the two arXiv feeds (eess.AS, cs.SD) stay. Closed.
- **ASK-007: YES.** Blank instances may read the four sealed UNIV documents once. Stages 1–2 run first, and a stage-1
  failure stops everything. The registration's month ends 2026-09-29.
- **T-J1 v2: YES to the egress.** The chosen turns go through the gateway to Jev; the keeper labels them in one later sitting.

## WHAT IS NOT WORKING (measured at 17:0x)
- **The sync at launch refuses** (`C:\Consonance\data\sync-pull.log`, 8 append-only files DIVERGED; `board.jsonl` alone
  has 21,565+ rows only D holds). **Why:** the state repo's newest snapshot is L's, `9486b30` at 09-22 07:44. **D's last push
  is `f70d50a`, 2026-09-10.** D has not published for 14 days, so both sides have rows the other lacks, and install
  correctly refuses. The union-at-launch watch-list (`loop/union_launch_watchlist_2026-09-22.md`) ASSUMED D's close
  publishes. That publish never landed (`d67a0d3`, 09-22).
- **The union switch is OFF** on D (`CONSONANCE_UNION_AT_LAUNCH`, the watch-list §0).

## BATCH 1 — the fixes plus the quick list items (one writer per file)
| pane | work |
|---|---|
| **A** | **Why has D not published state since 09-10?** Trace D's close and leave-window push: board rows at each D close since 09-10, `state-sync.js --push` logs, and the leave window's code path. Name the cause with evidence; fix it with a test. **No real push to the state repo** without saying so first in the hand-back; a `--dry-run` or a push to a temp remote is fine. |
| **B** | **Union-at-launch readiness ON D.** Take the watch-list §1 `--before` readings on D now (note that the app is open). DRY-RUN the union of D's data with the arriving L snapshot (`9486b30`), per file: +n rows from L, 0 rows lost from D. Prove no row is dropped or duplicated. Write the D-side watch-list addendum (the before readings, the prediction, the `--after` commands for the next launch). **Do not set the switch**; the librarian sets it at collation if the dry run is clean. |
| **C** | **CH-4 retirement.** Strike in place in the live carriers (`WELFARE.md` :32 :36, `dev/SPINE.md`, `dev/PLAN.md`, `exo_memory/cards/lighthouse-dive-buddy-reframe.md`), with the retired wording kept as a dated trace in the room's strike form. Arm the registry entry (`carrier-drift.registry.json`) in the SAME change, as its rule requires; every site gets accounted for. **ASK-002:** mark it closed in `exo_memory/ASK.md` with the keeper's words. carrier-drift must be GREEN. |
| **E** | **The two settings items.** (1) `DISABLE_AUTOUPDATER=1` in `~/.claude/settings.json` `env`: NOT `DISABLE_UPDATES` (L101 §4). Check that it composes with the launch fuse (`launch.ps1` `Invoke-FuseOnce`), so Claude Code still updates at the Consonance launch. (2) **The four unused hooks:** name them from the record, install with `install.ps1 -Only` (a plain install would overwrite `userprompt-submit.js`), and get `install.ps1 -Check` green. **Back up `settings.json` first**, sha256 before and after, with a diff of only the intended keys. |

## BATCH 2 (after batch 1 collates) — the two research runs the keeper said yes to
- **T-J1 v2 run** (`loop/tj1v2_registration_2026-09-22.md`): the egress run through the gateway, ending in a label
  sheet ready for the keeper's sitting.
- **ASK-007 stages 1–2, then the artifact arms**, per its registration, before 09-29.

## THEN
Pane specialization (`loop/pane_battery_idea_2026-09-11.md`, `loop/pane_archetypes_idea_2026-09-16.md`), planned from
the record, when the list is empty.

## 2026-09-24 17:1x — A's cause (D132), and the keeper's ruling
- **The cause** (`handback/p-d132-publish-A_2026-09-24.md` §1): no close path publishes, BY RULE. Leave writes to the stick
  only (`main.rs` `leave_run`; `dev/stick-waiter.js:61`), under the L059 hold (`packet_stick_build_2026-09-14.md:309`).
  Only a hand-run `close.js` pushes, and D ran it once (`f70d50a`, 09-10). A fixed the pulse's false "in sync".
- **The keeper, 17:1x (AskUserQuestion): "Publish at close."** When he closes through the Leave window (present), the
  state publish runs too and its result shows beside the stick result. The unattended waiter still never publishes. This
  REVERSES the L059 hold for the attended close only.
- **Precondition, same batch:** `state-sync.js` `cmdPush` gets the divergence gate first. It refuses when a travelling
  append-only file's state copy holds rows the local copy lacks, and names the file and the count (A §4). The two other
  false "in sync" carriers are fixed with it (`close.js:319-321`, `state-sync.js --status :1748-1749`).

## 2026-09-24 17:3x — BATCH 1 (D132) COLLATED
- **A:** the cause is a HOLD (above). The pulse's false "in sync" is fixed (`chain-status.js` + test).
- **B: the union dry run is CLEAN (8 of 8 merge, +0 rows, 0 lost), and B's catch changes the plan: DO NOT set
  `CONSONANCE_UNION_AT_LAUNCH` on D now.** With it on, the install that the refusals now block would SUCCEED. It would install
  L's 09-22 set and `decide()` would return MIGRATE, putting D's fixed seats onto L's 09-22 conversations
  (`handback/p-d132-union-B_2026-09-24.md` §3; `sync_launch.rs:350-359`). The +0 is because D already holds every row of
  `9486b30` (D106's union, 09-22). **So the order is: D publishes (with the gate), then the head is D-authored, then D
  RESUMEs; the union switch belongs on L, whose next launch merges D's rows.** B's D addendum is in the watch-list.
- **C:** CH-4 strikes are done in the 4 owned files, and ASK-002 is closed. **NOT armed:** 13 sites in 6 other live files
  would turn it red. **RULED (librarian): the keeper's decision was "the live design files", and those 6 are live design
  files, so C applies its §3 patch (proven GREEN armed in a temp tree) and arms in the same change.**
- **E:** `DISABLE_AUTOUPDATER=1` is set (the only settings change, backup kept, `claude doctor` confirms), and it composes
  with the launch fuse. userprompt-submit.js and stop.js are refreshed with `-Only`. **"The four unused hooks" was L's install
  proposal** (`install_proposal_L_2026-09-23.md:7,44-55`): the ruling says do not install the four, and L's `-Only` six are
  L's. Nothing is owed on D; it is carried to L's list.

## BATCH 2 (one writer per file)
| pane | work |
|---|---|
| **B** | `state-sync.js` `cmdPush` DIVERGENCE GATE: refuse when a travelling append-only file's state copy holds rows the local copy lacks, naming the file and the count (A §4), with tests. Also fix the `--status` false "in sync" (`:1748-1749`). |
| **A** | **Publish at close** (the keeper's ruling): in the Leave window (attended close) run the publish (`close.js`), after B's gate exists, and show its outcome beside the stick result. The unattended waiter still never publishes. Rust tests. Fix the `close.js:319-321` false "in sync". **Live after a rebuild.** |
| **C** | Apply the §3 patch to the 6 files and ARM CH-4, carrier-drift GREEN armed. Mark ASK-007 answered YES in `ASK.md`. Then **ASK-007 stages 1–2** per its registration (a stage-1 failure stops everything), and the artifact arms only if stage 1 passes, before 09-29. |
| **E** | **T-J1 v2 run** (`loop/tj1v2_registration_2026-09-22.md`), the egress the keeper approved, ending in a label sheet ready for his sitting. The key stays env-only; count the calls. |
**After batch 2, the librarian runs ONE hand publish from D** (`close.js`, through B's gate), so the state head becomes
D-authored today without waiting for the rebuild. It is reported to the keeper before and after.
