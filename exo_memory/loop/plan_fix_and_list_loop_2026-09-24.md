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
