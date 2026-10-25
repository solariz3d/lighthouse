# D458 — the ledger sweep (pane E, machine D), 2026-10-25

Packet: the chair, 2026-10-25T21:38:07Z. Tier: check it. The ledger is `C:\Consonance\data\lap.jsonl`, and the sweep only appended rows to it. Every row went through `node consonance/tools/lap-row.js` run in `C:\Users\nname\Desktop\lighthouse`.

## 0. The premise, checked first: 12 laps were open, not about 80

- checked: newest chain row per lap, for D330–D457 (scratchpad `d458/open.js`, the same rule as `chain-status.js` `openLaps`: newest per lap, then drop `filed`) → **12 laps not filed**: D338 D402 D403 D408 D415 D422 D425 D426 D427 D434 D437 D450. That matches the pulse's "+12 more open" at the start.
- checked: the same pass over the laps that are filed → in D330–D457, 111 laps end on `filed` with `holder: chair`. Their notes are the packet's "landed in 0.4.x", "accepted; rides 0.4.14" and so on. Across the whole ledger, 295 laps end `filed/chair`, 92 `filed/none` and 36 `filed/librarian`.
- inferred: the packet's "about 80" are those `filed/chair` laps. To every reader they are already closed: `chain-status.js:508` drops any lap whose newest row is `filed`, whatever its holder, and `baton-wake.js:183` skips any lap with a filed row.
- **Why I did not write a second `filed` row on them.** `boundary-check.js:120` stores each lap's filed time with `filed.set(r.lap, r.at)`, so the last filed row wins. `coveringLap` (`:128`) then treats a lap as open until that time. Re-filing ~111 laps today would move each one's end to 2026-10-25, and every chair arrival on the board since its real filing would then count as covered by it. That is a corrupted measurement, and the ledger is append-only, so it could not be taken back. So the sweep covered the 12 laps that really were open.

## 1. Backup and line counts

- checked: `cp -p` to `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-07b8a48f\a2122153-a37e-41a6-a86f-534267ec0565\scratchpad\d458\lap.jsonl.20261025T213822Z` before the first row. The sha256 of the original and the copy are equal, `b9c33462…555c`.
- checked: `wc -l` → **5099 before, 5109 after**, so 10 rows were added.
- checked: `head -n 5099 lap.jsonl | cmp - <backup>` → no output. The first 5099 lines are byte-identical to the backup, so nothing was edited or removed.
- checked: the 10 new rows are all `chain: filed, holder: none, by: chair, gate: parked`. The gate refused none of them and no intermediate stage was needed: `holder none` is the parked verdict (`lap-row.js:932`).

## 2. Evidence source

t180: `v0.4.19` is the public release (`gh release list` → "T-180 Track Builder 0.4.19, Latest, 2026-10-25T17:39:16Z"; `git ls-remote --tags origin` → `496c347e…`). The tag is not in the Desktop clone, so I made a scratch bare clone from GitHub at `G:\consonance-scratch\d458-t180.git` (`--filter=blob:none`). Every t180 check below is `git -C G:/consonance-scratch/d458-t180.git merge-base --is-ancestor <sha> v0.4.19` → exit 0.

The shas named in the old ledger notes (704e9e1, ae2b108, c29e53a, 15e4e81, 681727f, 910fd64) exist in neither the public history nor the Desktop clone. Their branches went in the D450 cleanup. I found the work in v0.4.19 through the landing merges, which name those shas in their subjects, and through commits that name the lap.

Lighthouse: `origin/main` = `321c4745` (2026-10-25 11:45). Checks are `git merge-base --is-ancestor <sha> origin/main` in the Desktop checkout.

## 3. Closed (10)

| lap | evidence (in the row's note) |
|---|---|
| D425 | landing merges `678c349` (d425-e 704e9e1), `053f309` (d425-b ae2b108), `e3fb103` (d427-seat-a c29e53a) are ancestors of t180 v0.4.19 |
| D426 | `98a8909` "D426: the ghost of the next piece no longer vanishes…" is an ancestor of v0.4.19 |
| D427 | `dcc9e2b` "D427: Aqua's sky no longer paints a second Snell's window at the nadir" is an ancestor of v0.4.19 |
| D434 | `b782064` (Finish banks the curves, 0.75 of the balance bank) and `9ecfc09` (row 13) via `9f586f8` (local-0.4.15 merge 5) are ancestors of v0.4.19. The keeper's drive of the banked closer is not recorded anywhere I read; the code is public anyway |
| D403 | `378ef3e` (aurora) and `542f0ae` (follow-up) are ancestors of v0.4.19. plan_cleanup_2026-10-24.md:87 already said this lap had landed while its row still read open |
| D402 | `d9f24c4` (SIGIL melody) and `4253bda` (band row) via `686c770` (local-0.4.18 merge d402-e @ 9c5a3ab) are ancestors of v0.4.19. librarian/2026-10-18.md:656 records "D402 done" |
| D437 | `2917b02` (D437a soup/BVH) and `70bec77` via `e4141fb` (D437b, local-0.4.15 merge 3) are ancestors of v0.4.19 |
| D338 | lighthouse `81189f20` and `9976b795` in merge `60a0345c`, ancestors of origin/main. It was installed by the D423 swap, verified at librarian/2026-10-18.md:426 (running exe priority 13, High). librarian :380 had ruled it "owed" until that rebuild |
| D415 | lighthouse `143e1612` via `0747277b` is an ancestor of origin/main and of `60a0345c`, the tree the D423 swap built. The swap is verified at librarian :426 |
| D422 | ALL-CLEAR recorded at librarian/2026-10-18.md:410 (02:10). The push 29260ad9..613b0c9d is recorded at :412, and `613b0c9d` is an ancestor of origin/main |

## 4. Left open (2)

| lap | reason, checked |
|---|---|
| D408 | The D407 timing line. Its last part, D407b (release-frame row 4, the last few ms), was PARKED by the librarian at librarian/2026-10-18.md:392/:398 (`d407b-a` 4becdd5, unpushed, "ships in a later release"). `git log --grep=D407b v0.4.19` → 0 commits. D407's own fix (`6d7df84`, `18b8fd8`) did ship. The remainder has not |
| D450 | Open on the keeper's answer about the two ELYSIUM `.before` zips: librarian :698 asks him again and :712 says "open only on the zips and e21". I found no later answer. `C:\Users\nname\Downloads\t180-wt-e21` still exists. **Changed by this sweep:** e21 was kept for D402's filing (plan_cleanup :149, :184), and D402 is now filed, so e21's reason to stay is gone. Deleting it is still D450's step, with its own ask |

## 5. The packet's expected-open list, confirmed one by one

- D338, D402, D403, D415, D422, D437: expected open; found proven shipped (§3), so closed under the packet's own rule.
- D408, D450: open, confirmed (§4).
- D411: already `filed` (note: "keeper-accepted 'yes to ponytail': reviewer-only; c70d42a4 b431b2d0 …"), so no row was written. Its commits being unpushed does not reopen it.
- D412: already `filed` (empty note), so no row was written.
- D436: already `filed`, and not waiting on him. librarian/2026-10-18.md:548 records the keeper at 19:35, "ITs all goods", and "D436 CLOSED, no fix lap".

## 6. After

- checked: `node consonance/tools/chain-status.js` → `STALE D408 134h … chain: D458 WORKING … +2 more open`. The two are D408 and D450, the rest of the open set is D458, and the 11-lap stale list is gone.

## 7. Corrections, mine

- My first ancestry pass used the shas from the ledger notes and got "Not a valid object name" for all six. They were never in the public history under those names. I re-checked them through the merges that name them rather than reading the failure as "not shipped".
- The ~80 figure was the packet's; I did not act on it (§0).

## 8. Not done

- No `filed` rows were written on the 111 already-filed `filed/chair` laps (§0). If "closed" is meant to be `holder none`, that needs a decision on boundary-check's last-filed-wins first, and a change to that tool, not a ledger fill.
- The scratch clone `G:\consonance-scratch\d458-t180.git` is left so the checks can be re-run. It is my own scratch and can be removed whenever wanted.
