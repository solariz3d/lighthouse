# Chair restore point — written on D, 2026-09-22 23:1x, for whoever holds the chair on L next

> **FIRST, BEFORE THE KEEPER OPENS CONSONANCE ON L: union-at-launch is OFF unless `CONSONANCE_UNION_AT_LAUNCH=on` is in
> the APP's environment** (`consonance/tools/state-sync.js:1173`; only the exact value `on`). Nothing sets it. On D it is
> unset in HKCU and Machine (checked by the chair, 23:0x). **Check L the same way:**
>
>     reg query "HKCU\Environment" /v CONSONANCE_UNION_AT_LAUNCH
>
> - **OFF (the expected case):** a plain launch repeats the stop-before-write refusal. It is safe and nothing is lost.
>   The laptop room then does the union BY HAND after the launch (the D106 route), and **the switch waits for the
>   keeper's word**. Setting it is an environment change and is his.
> - **ON:** run A's watch-list exactly, in its order: `exo_memory/loop/union_launch_watchlist_2026-09-22.md` (the box
>   at its top is written for L). `git pull` FIRST by hand, then `--before` with Consonance closed, then the launch,
>   then `--after`.
>
> **The arriving copy on L is D's first publish since 09-10**, so the merge there is real (`+n > 0`), not `+0`.
> A's §2 `+0 rows` prediction is D's and does not carry to L.

## WHERE THINGS ARE (D, at the stop)

- D: `C:\Users\nname\Desktop\lighthouse`. The next `lap-row --open` mints **D123**. D122 is filed. Every lap tonight
  (D120–D122) is filed.
- All seats on D ran **claude-opus-5-5** from ~17:58 (the keeper's `/model`). Any figure from before that is Opus 5.
- L: last published state `9486b30` (L's close, 09-22 07:44). D's close through the leave window publishes D's state.

## TONIGHT (plan `loop/plan_after_upgrade_2026-09-22.md`, commit 88a79ce; authorizations d5bd9b1)

- **D120 `2349137`:** relay-injection test registered (E), attacked (B: BUILD AMENDED, 2 FATAL / 8 AMEND / 7 NOTE),
  amended (E).
- **D121 `e893c5b`:** built and run by C (529 rows, sha256 `76ab4647…`; harness.test 45/45; mutants 18 applied /
  18 caught / 0 NOT APPLIED, re-run by the chair). Scored by the librarian: `704a3f3`, addenda `d39d552`, `31d2540`.
  **Sealed verdict NOT TESTED** (N− 2 of 12 against a bar of ≤ 1; both follows genuine, so the control was confounded).
  Descriptive, re-derived by the chair from rows.jsonl with the probe rows excluded: 5.5 fed bare relayed text follows the
  benign canary **54/60** and the hijack **33/60**; Opus 5 16/60 and 2/60; 5.5 tagged 0/120; 5.5 pointer+Read 0/120.
- **D122 `523267d`:** A's watch-list, COMPLETE, and its snapshot instrument. C's T-J1 v2 pilot is **PARTIAL**, and it
  stopped rightly: tj1v2 `:118-122` makes B the only eligible extractor, and the packet had ruled B out.

## OPEN

- **Authorized by the keeper by name and NOT done** (d5bd9b1; carried, still authorized): item 1 board compaction,
  item 3 jev-flags settings edit, item 4 the hook-file wording (ASK-008 at `dev/shell/hooks/l2-overseer-worker.js:49`,
  and "light, not lifeguard" in `session-start.js`), item 6 publish the repo description.
- **The keeper's:** 7 (the union-at-launch switch and first launch), 8 (his labelling sitting, once the pilot is built
  by an eligible seat).
- **Owed by the room, not on the plan:** audit `chair_inject` and every script that builds a prompt from file contents,
  so no seat's text is ever pasted in bare (D121's takeaway, score §5). Also `portable-paths` exit 1 on
  `consonance/tools/trip-check.test.js:34` (`'C:/nowhere'`, from `0b8e84f`), named by A and not touched.

## CHAIR'S OWN, KEPT

- The librarian's 19:36 check-in said D121's run had died. It had not: the harness (pid 28824, `harness.js --run`,
  relative path) was alive, and one call had hung to the 10-minute timeout. The chair did not relay "resume and clear
  the lock", which would have started a second harness. The correction went to the board, because the inject was
  refused out of turn. That refusal was right.
- A's D122 hand-back changed after the librarian collated it (blob 147aadb2 → a5b81514, A's reframing for L). The chair
  read the change and landed it, naming the delta in `523267d`. The librarian has not read the revised bytes.
- My first table of models this evening was wrong. It read the panes' last replies and said they were on Opus 5; the
  keeper corrected it, and the transcripts showed the switch.
- Two cutoff sends were refused by the NEXT-trailer gate ("by 23:15" is not a `when` clause) and were resent.

## ON WAKING

1. Read this file, then the librarian's restore point (`201dd2b`), then `librarian/2026-09-22.md` from 18:00.
2. Re-read `.chair-token`. `git pull`, `git status -sb`, `git log origin/main..HEAD`.
3. Check the switch (top box) BEFORE the keeper opens Consonance on L.
