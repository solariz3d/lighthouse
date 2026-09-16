# Handoff — the librarian seat, 2026-09-15 ~23:00, DESKTOP, for the laptop shift that pulls this at work

*One lineage. The day is in `librarian/2026-09-15.md` (08:40 → 22:2x) and the night before it in `librarian/2026-09-14.md` from 05:25. The keeper, 22:58: "save all that as work on the repo for laptop to pull later at work. We dont have time tonight to work more."*

## Read first on L, in this order

1. **Pull, then REBUILD, then close with the stick in — never close first.** L's exe (built 02:29 09-15) writes LEAVE files without `appStartedAt`; the waiter that pulls in with this repo matches on it, so a close on the old exe takes the fallback and shows a NOT CONFIRMED notice once. Rule R-2, `packet_diversity_c1_and_leave2_2026-09-15.md` (P-LEAVE-2 rulings, ed0d60a).
2. **The machine restarted itself this evening.** Windows Update (event 1074 by MoUsoCoreWorker at 19:58:51, three reboots, the 2026-09 security update at 20:02:20) killed Consonance and its waiter with no Leave and no fallback. Nothing was lost; all seven seats resumed at 22:16. This is D-6 (`packet_leave_window_2026-09-14.md:159`), and it is now P-LEAVE-3 rows 4 and 5.

## Open, and who holds it

- **P-LEAVE-3 rows 4 and 5 — BUILT by A, NOT READ, NOT LANDED.** `handback/p-leave3-A_2026-09-15.md` (22:49): the OS end-of-session runs a fast Leave (ShutdownBlockReasonCreate on the app's visible window, WM_QUERYENDSESSION via SetWindowSubclass), and a keep-awake hold (SetThreadExecutionState) while there is work — at the keeper's word of 22:17. `main.rs` +394, `sync_launch.rs` +21, `Cargo.toml` three features on the already-compiled `windows` crate, no new dependency. A says its first ROW 4 build was wrong and was rebuilt after the docs. **B's read is owed before landing; the librarian re-derives after B.** Where these files are when you pull is in the last commit's subject: either a `held/p-leave3-…` branch or a WIP CARRY on main at the keeper's word.
- **The anchor-similarity registration** (`loop/anchor_similarity_registration_DRAFT_2026-09-15.md`, still DRAFT): step 0's instruments landed at 13:14 (`dev/diversity/redact.js` cb3f3ea1…, `redact.test.js` 1d5b0a20…, `arm-words.txt` 59579593…, `phase-window.js` ba98d635…, `phase-window.test.js` 2950fbd4…; the strip 73917f67… since 5a2d3c0). Owed, in order: §8.11 records the shas; E's scorer lands in the repo as `dev/diversity/score.mjs` with its control gate reading the six-phase U (my review, 13:1x entry); step 1's m from the committed scorer under R8c/R8e/R8f; then REGISTERED. Then the run: four tasks, two new siblings each, spawned by the keeper's hands (§8.9), two fresh scorers, seat no arm at A or I. The keeper's ruling on A's expectation that polarity reads UNBLINDED is still open.
- **F3 and F4** for the 08:00 close on 09-15 are L-side reads: A's watch log (`…6fe15f0a…/scratchpad/nc_watch*` on L, if it was armed) and L's `persist.log`.
- **The Third Place's bet** (07:46 09-15): the seed test and the three-arm run by 2026-10-31; the second room by 2026-12-31.
- **Twelve open asks** addressed to the keeper (`node consonance/tools/ask.js`), oldest 51 days.
- **The push.** At 22:5x D was 22 commits ahead of origin with nothing pushed since before the reboots; the chair was rung to push first.

## The WRONG column this day, mine

108 (E): "428,177 B with nothing typed" included my own first turns. 109 (E): "the gauge measures content uptake, not anchoring" and "reads engage as much as builds" said more than the numbers carry. Two misses filed at the keeper's word (the Third Place sitting read as method; the point was creation, not retrieval, confirmed in his words at 10:07). Two near-misses filed and published nowhere (a clean tree read as a discard before checking the reflog; an empty cargo stream nearly read as a pass — the class that caught A and B the same morning, now a P-LEAVE-3 row).

## For the keeper, when he is back at a keyboard

The Windows 11 Pro policy that stops a scheduled restart while he is logged in: `gpedit.msc` → Computer Configuration → Administrative Templates → Windows Components → Windows Update → Manage end user experience → "No auto-restart with logged on users for scheduled automatic updates installations" → Enabled. Active hours on D are 23:00–17:00; the restart fell in the 17:00–23:00 gap.
