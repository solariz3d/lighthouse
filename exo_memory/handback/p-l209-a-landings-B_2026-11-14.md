# p-l209-a-landings-B: pane A's three branches through the landing train on L (L209)

Packet: `[chair:MAIN]` 2026-11-14 10:43:20Z, "LAND PANE A's THREE FINISHED BRANCHES ON THE GAME, BY THE TRAIN, ON L"; his word of 04:39 local,
"okay, so back to dreamzone". Tier: prove it. Machine: L. Long output is in my scratchpad under `l209/`.

## WHERE IT STOPS (L, 11:1xZ)

- **Landed: one of three.** dreamzone-3 main **99b6045 → c205622**, A's `a-d673-close`, by the train. It is pushed and read back,
  promoted to his clone byte-identical, and both launcher checks read "up to date".
- **Stopped: `a-gen-record`**, on code conflicts (below). A's to merge; I edited none of A's code.
- **Stopped: `a-kit-told`**, red alone on main in two rows (below), neither one of the four load-sensitive rows.
- **My `gen-lap2-kit` fcf5c43: not run,** by the packet's condition. The sprinter row is not green in both worlds: kit off 85 of 96
  (green, D), kit on 70 of 96 (red, measured today on L in a-kit-told's world, and on D at my branch's 28c6879).
- **His clone:** `Downloads\dreamzone-3` at c205622, clean, equal to origin. `game\config\world.local.txt` sha256 e065fdad…, unchanged.
  No game ran during the lap: the guard read clear at 10:43Z, 11:01Z and at promotion.
- **Nothing running and no lock:** the ready list is empty, and the scratch worktree `Downloads\dz3-wt-l209` is removed.
- **Room repo:** main pushed with this file's branch (the section at the end).
- **Next, for A:**
  - `a-gen-record` needs its two record commits merged against O's run frame by their owner;
  - `a-kit-told` needs the two rows' rulings, which are already named in `p-gen-lap2-kit-B_2026-11-13.md`: the sprinter row as "an
    owner's ruling", and the nav row re-registered on my branch at 28c6879, which a-kit-told does not carry.

## 1. a-d673-close: landed (main c205622)

- **The train dropped it once,** at 10:44:06Z: a conflict in `CHANGELOG.md` only, which the packet does not count as a stop. A's
  branch was 49 commits behind main, so both sides had added entries at the top of "Added".
- **The resolution** (branch `l209-a-d673-close`, 16d7ce6, mine): a merge of `origin/a-d673-close` onto 99b6045 with the
  changelog as a union. Main's D675 entries come first and A's entry follows; nothing on either side changed.
  - checked: against main +7 -0, against A's branch +135 -0.
  - **A's code is A's exactly.** The patch-id of what the merge adds to main outside the changelog is a49b78b2… and so is A's own
    patch (`git diff origin/main...origin/a-d673-close | git patch-id --stable`).
- **The landing:** the train merged `l209-a-d673-close` onto 99b6045, ran the check under the exclusive hold (10:45:25Z to
  11:00:13Z), fast-forwarded and pushed main to **c205622**, and promoted 2 files byte-identical.
  - The launch check read "up to date".
  - The push gate's row: `push-gate.jsonl` `t` 2026-11-14T11:00:08.557Z, `by` landing-train, decision **allow**, sha c205622.
  - The train's own ledger: `landing-train.jsonl` rows `landed` at 11:00:13.772Z and `promoted` at 11:00:15.124Z.
- **Its suite's totals were not kept. That is mine:** I ran the train without `--log-dir`, so no check log was written.
  - What is on disk is the verdict alone. The train lands only when the check exits 0, and the check exits 0 only when every
    ctest suite, the gym self-test and the world self-test exit 0 (`landing-train-dz3-check.cmd`).
  - So all 14 suites and both self-tests passed, and no row needed a re-run (there was one attempt and no reread). The per-suite
    counts and times are not recorded.
  - The later run kept its log.

## 2. a-gen-record b311709: STOPPED, code conflicts

- **What conflicts** (a trial merge onto c205622 in a scratch worktree, then aborted):
  - `CHANGELOG.md`;
  - `game/world/run_record.cpp`: 1 conflict, at line 279;
  - `game/tests/run_record_tests.cpp`: 3 conflicts, at lines 469, 536 and 548.
- **Against what:** O's `7500a26` ("The run's frame on screen…") is the one main commit since the merge base that touched those
  files.
- **The conflicting commits:** A's two record commits, `f978ce8` (the run record says the generator it was played in, and refuses a
  replay…) and `b311709` (its CHANGELOG).
- **Not resolved:** these are code, not the changelog, so main stays as it was and the branch goes back to A.

## 3. a-kit-told dcbfd3c: STOPPED, red alone on main

**What it is.** 9 of its 11 commits are my Park kit (`151aead` … `0df4c77`: the kit behind dials, the drop harness's crash fix, the
door rate 0.15). Only `9150ddf` and `dcbfd3c` are A's own. So landing it would have landed the kit, and its suite judges the kit's world.
It merged onto c205622 with no conflict.

**The run:** 11:01:46Z to 11:10:51Z, one attempt. The log is `scratchpad/l209/run3-logs/attempt-1.log`.
- 12 of 14 suites passed in 515.42 s. The check stops at a red suite, so the self-tests did not run.
- **nav_tests** `the_way_there_is_about_as_quick_as_the_way_back` (`nav/tests/path_tests.cpp:234`, `worst < 0.20`):
  - 2,943 pairs walked both ways; the slower way is 0.96% slower on average, more than 2% slower in 471, more than 5% in 104, and
    **22.9% at the worst**.
  - This is the row my branch re-registered by name at 28c6879, which a-kit-told does not carry.
- **chase_tests** `a_sprinter_that_does_not_brake_for_corners_meets_the_walls_and_one_that_does_gets_there_sooner`
  (`chase/tests/body_tests.cpp:190`, `careful_sooner * 4 >= tried * 3`):
  - 96 routes with three corners or more over seeds 1-8. The careful body was sooner on **70**; the row needs 72.
  - The never-braking body met the mesh's edge for longer on 88 routes and hit a wall head-on 123 times against 50.
- **Neither is one of the four load-sensitive rows** (`librarian/2026-11-13.md:694`). Both reproduce D's numbers exactly (22.9%, 70
  of 96), so no re-run was owed: they are the code, not the machine.

## 4. My gen-lap2-kit fcf5c43: not run (the packet's condition)

It holds all of a-kit-told (merge `cac177b`) plus five commits: `c05e074`, `e2a7ed8`, `28c6879`, `6d445e6`, and `fcf5c43` (E's tell
row). The sprinter row in both worlds:

| world | careful sooner of 96 (bar 72) | where measured |
|---|---|---|
| kit off (`GenParams{}`, main's world) | **85** | D, `p-gen-lap2-kit-B_2026-11-13.md:199` |
| kit on (`shipped_gen()`) | **70** | today on L in a-kit-told's world; on D at my 28c6879, which already holds c05e074 |

- **Where the red comes from:** D's splits put it in the chutes kept by the true buy rule together with the kit's hunter. Take any one
  of those out and the row is back to 80-85. His door rate plays no part (same table).
- **So:** green off, red on. By the packet, stop here with the numbers.

## What a player will see that is new (c205622 against 99b6045)

**In overtime, the Dark no longer circles a player who jukes close to it.**
- Within 10 m of where it knows he is, on his storey and with a clear line, it now comes straight at him, renewed every tick.
- Before, it followed a re-planned path whose end lay a metre or two behind a juking player. In A's sweep it circled the juke bot
  at 1 to 4 m for six minutes; now it catches it after 13.6 s of overtime.
- Every other kind of chaser is unchanged.

Nothing else in the game changed in this lap.

## The room repo

- **Room main pushed:** main **acfb591a** (14 of the librarian's commits ahead of origin's 7ab9f260 when this branch was cut; the
  packet's c98107db plus five later ones), by its literal name.
- **This branch:** `l209-a-landings`, cut from that main and pushed by its literal name.
- The untracked `exo_memory/third_place/2026-11-14.laptop.md` is the Third Place's and was not staged.

## Could be wrong

- **That landing 1's suite was 14 of 14:** inferred from the train's green verdict and the check script's exit rules. No count was
  logged.
- **That my kit branch reads 70 of 96 on c205622:** it was measured on a-kit-told's world today and on my branch on D, not on my
  branch on L today.
