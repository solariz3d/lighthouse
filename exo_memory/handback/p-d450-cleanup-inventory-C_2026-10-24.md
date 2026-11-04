# D450 cleanup part 1: the inventory (pane C, 2026-10-24)

Seat: pane C (sibling-0845a868). Packet: the chair's D450 order of 14:03:51Z. The master is
`exo_memory/loop/plan_cleanup_2026-10-24.md` at lighthouse 5b9ec3fe, items 1–8. Tier: prove it, read-only.

**Nothing was deleted, moved or stopped.** The commands were readdir, lstat and stat; `git --no-optional-locks`
worktree list, status, log, rev-parse, cherry, for-each-ref, cat-file and merge-base; `du`; and process listings. No
page was opened, so there were no TabProxyWindows to count. I wrote two things only: this hand-back with its evidence
folder, and my scratchpad.

Scans ran 14:06Z–14:33Z. The live runs keep writing, so the %TEMP% and scratchpad numbers are as of their scan
(item 4 at 14:18Z).

## What matters, first

1. **0 junctions or symlinks** were found in any of the 80 worktrees, the 77 folders, %TEMP% or the scratchpads.
   - checked: `walk.js` lstat's every entry and follows none; links = 0 on every row below.
   - control: the same `fs.lstatSync` on the known junction `C:\Users\nname\Application Data` gives isSymbolicLink
     true, pointing to `C:\Users\nname\AppData\Roaming`.
   - So, as of the scan, `git worktree remove --force` would follow nothing. Part 2 should re-run the check right
     before each remove, because a run can add a junction later.
2. **Five of the Downloads folders are worktrees of the Desktop repo, not of Downloads:** `t180-wt-e19`, `-e20`,
   `-e21`, `-e22` and `-e24`.
   - checked: their `.git` files point to `C:/Users/nname/Desktop/t180-track-builder/.git/worktrees/<name>`.
   - Their heads (d394-e, d398-e, d399-e, skydither-row2-e, d405-e) are all merged into local-0.4.17.
   - The only clean way to remove them is `git worktree remove` run inside `Desktop\t180-track-builder`, which we
     never touch. A plain delete would leave 5 stale entries in that repo's `.git/worktrees`.
   - So they are **his call**, and they are not on the delete list.
   - To read their state, I ran read-only git in them (`--no-optional-locks` status, log and rev-parse), and those
     commands read the Desktop repo's `.git`. Nothing was written there.
3. **The public lighthouse checkout holds 6.0 GiB of untracked exported tracks** (item 6).
   - 21 of them are O's D447 `fakeac/` folders (5.03 GiB, live).
   - 0.94 GiB are the `tracks/` and `out/` folders of laps already filed (d433, d434, d438, d439).
   - These are kn5 builds of his tracks. **They must never be committed**, and a `git add` of a whole evidence folder
     would take them.
   - inferred: no .gitignore rule covers them, because `git status` lists them as untracked rather than hiding them.
4. **The largest single item is not on the plan's list: `C:\build`.** It holds 7 cargo target folders from Sep 21–27
   (a-d098 … b-d170), 18.17 GiB on disk.
   - checked: `du`, which counts a hard-linked file once.
   - An apparent-size count says 23.28 GiB. The gap is cargo's hard links, so a delete frees the `du` figure.
5. **The plan's counts hold:**
   - 80 registered worktrees;
   - 77 `t180-*` entries that are not worktrees of the Downloads repo (157 entries in all; one of the 80 is the main
     checkout, which is a `t180-*` entry too);
   - 0 `C:\fake-*` roots on C:, D:, E:, F: or G:.
   - checked: `git worktree list --porcelain`, `fs.readdirSync(Downloads)` and the drive-root readdir, in
     `inv12.js` and `inv345.js`.
6. **What "ours-live" means here.** It follows the chair's list:
   - A's 0.4.18 landing (`t180-wt-land418`);
   - O's `t180-wt-o18` and O's other D447 trees born on 10-23/24 (o19-before, o20, o21, o22);
   - `t180-wt-e43`;
   - P's review worktrees.
   - I read "P's review worktrees" as the ones for laps still open: p447, p447f, p447g, p447h and p402.
   - p438 through p446e review laps that are already filed (D438, D439, D440, D443, D446), so I marked them
     ours-done. **If the chair meant all of P's trees, move those 8 (106.7 MB) to live.**
   - Also live: the main checkout `Downloads\t180-track-builder`. Its branch docs/readme-0.4x carries one README
     commit, e59991e, that has not landed.
   - Also live: `t180-wt-a29`. Its branch d407b-a 4becdd5 is **PARKED with 4 commits that have not landed**, a resume
     item (`librarian/2026-10-18.md:398`, `map/A.md:2028`). Keep it.
7. **Smaller things the scan turned up:**
   - Tags `local-0.4.14` to `local-0.4.17` have the same names as the branches and point at the same commits, which
     is why git prints "refname is ambiguous".
   - Lap rows D403 and D437 are still open in `lap.jsonl`, though their branches have landed:
     - d403-a's two commits landed as cherry-picks in 2ccee1e (`map/E.md:2501`);
     - d437a-e is in 0.4.17.
   - Four O scratch trees (o6-scratch, o10-kn5, o11-kn5a, o13-kn5) are each **in the middle of an uncommitted
     merge** (MERGE_HEAD 3c870e3, which is in 0.4.17). Their 16–17 staged files are a merge result that can be
     rebuilt, so a `--force` remove loses nothing that cannot be remade.

## The verdict rules

- **ours-done:** the branch head is an ancestor of `refs/heads/local-0.4.17` or `refs/heads/local-0.4.18`
  (`git merge-base --is-ancestor`), or `git cherry` shows 0 patches not landed, or the record names the branch as
  "not to land". For folders, the content is ours and its lap is filed.
- **ours-live:** named on the chair's list, or a parked branch with work that has not landed.
- **his:** his tracks, his Desktop and Documents folders, and anything we made inside his folders (his call).
  His own track folders are counted here and **their names are withheld from this public file**. The full rows are
  in pane C's scratchpad, `d450/tables.md` and `d450/inv345.json`.
- **ask:** no author named and no mention in the record.
- **Record mentions** (item 2) are counted by `names.js`. It makes one pass over `exo_memory` with `third_place/`
  excluded and never opened, and it matches the folder name as a whole token.

### Item 1: the 80 registered worktrees of Downloads\t180-track-builder

| worktree | branch @ head | merged into | dirty | size MB | last write | links | verdict | note |
|---|---|---|---|---|---|---|---|---|
| t180-track-builder | docs/readme-0.4x @ e59991e | no | 0 | 9471.3 | 2026-10-23T18:13Z | 0 | ours-live | main checkout; branch docs/readme-0.4x has 1 unlanded README commit (e59991e) |
| t180-wt-040 | (detached) @ 918e55b | local-0.4.17 | 0 | 7.9 | 2026-10-23T01:57Z | 0 | ours-done |  |
| t180-wt-a29 | d407b-a @ 4becdd5 | no | 0 | 12.7 | 2026-10-20T01:23Z | 0 | ours-live | D407b PARKED: d407b-a 4becdd5, 4 commits not landed, a resume item (librarian 2026-10-18 01:33) |
| t180-wt-a33 | d421-a @ e3e9b4a | no | 0 | 12.8 | 2026-10-21T03:39Z | 0 | ours-done | patch landed by another commit (git cherry: 0 unlanded) |
| t180-wt-a34 | d421-a-red @ ea54ac3 | local-0.4.17 | 1 | 12.8 | 2026-10-20T22:14Z | 0 | ours-done |  |
| t180-wt-a35 | d421-a-int @ 06e0645 | no | 1 | 12.9 | 2026-10-20T23:20Z | 0 | ours-done | integration only, "not to land" |
| t180-wt-a36 | d421c-a @ 57b41f8 | local-0.4.17 | 1 | 13.0 | 2026-10-21T01:47Z | 0 | ours-done |  |
| t180-wt-a37 | d421c-a3 @ 1c640b0 | local-0.4.17 | 1 | 13.1 | 2026-10-21T04:28Z | 0 | ours-done |  |
| t180-wt-a38 | (detached) @ c45518f | local-0.4.17 | 0 | 13.0 | 2026-10-21T04:07Z | 0 | ours-done |  |
| t180-wt-a427 | d427-seat-a @ c29e53a | local-0.4.17 | 0 | 13.1 | 2026-10-22T02:56Z | 0 | ours-done |  |
| t180-wt-a429 | d429-a @ 7201988 | local-0.4.17 | 0 | 13.1 | 2026-10-22T18:38Z | 0 | ours-done |  |
| t180-wt-b049 | rel-0.4.9 @ 409d3f8 | local-0.4.17 | 0 | 4808.9 | 2026-10-20T07:58Z | 0 | ours-done |  |
| t180-wt-b421 | d421-b @ 8b7ef3e | local-0.4.17 | 0 | 12.8 | 2026-10-20T23:55Z | 0 | ours-done |  |
| t180-wt-b421c | d421c-b @ 856a386 | local-0.4.17 | 0 | 13.0 | 2026-10-21T02:35Z | 0 | ours-done |  |
| t180-wt-b425 | d425-b @ ae2b108 | local-0.4.17 | 0 | 13.1 | 2026-10-22T02:35Z | 0 | ours-done |  |
| t180-wt-b428 | d428-b @ c1841ca | local-0.4.17 | 0 | 13.1 | 2026-10-22T03:46Z | 0 | ours-done |  |
| t180-wt-b433 | d433b-b @ d2dff3e | local-0.4.17 | 0 | 13.1 | 2026-10-22T16:06Z | 0 | ours-done |  |
| t180-wt-b437 | d437b-b @ 74d60c8 | local-0.4.17 | 0 | 13.2 | 2026-10-23T08:07Z | 0 | ours-done |  |
| t180-wt-c27 | d421-c @ 84e2170 | local-0.4.17 | 0 | 12.8 | 2026-10-20T08:11Z | 0 | ours-done |  |
| t180-wt-c28 | d421b-c @ ee43f20 | local-0.4.17 | 0 | 12.9 | 2026-10-21T01:05Z | 0 | ours-done |  |
| t180-wt-c29 | d426-c @ 63e3dd9 | local-0.4.17 | 0 | 13.1 | 2026-10-22T02:50Z | 0 | ours-done |  |
| t180-wt-c30 | d430-c @ b575fdb | local-0.4.17 | 0 | 13.1 | 2026-10-22T15:31Z | 0 | ours-done |  |
| t180-wt-c31 | d438-c @ 9233a93 | local-0.4.17 | 0 | 13.2 | 2026-10-23T03:46Z | 0 | ours-done |  |
| t180-wt-e23 | d403-a @ 58abf77 | no | 0 | 12.5 | 2026-10-19T04:51Z | 0 | ours-done | d403-a: both commits landed as cherry-picks via d403-on-0413 2ccee1e (map/E.md:2501); lap row D403 still open |
| t180-wt-e26 | local-0.4.10 @ 000f13e | no | 0 | 1502.3 | 2026-10-20T08:23Z | 0 | ours-done | version-bump install build, "not a release" |
| t180-wt-e27 | d421-e @ dc7d170 | local-0.4.17 | 1 | 12.9 | 2026-10-21T00:37Z | 0 | ours-done |  |
| t180-wt-e28 | d421-e-meas @ 6e5ea43 | no | 1 | 13.0 | 2026-10-21T00:56Z | 0 | ours-done | measurement merge, 0 unlanded patches |
| t180-wt-e29 | local-0.4.11-e @ 5168053 | no | 0 | 1502.8 | 2026-10-21T01:47Z | 0 | ours-done | version-bump install build |
| t180-wt-e30 | d421c-e @ 7d42d35 | local-0.4.17 | 0 | 13.0 | 2026-10-21T04:00Z | 0 | ours-done |  |
| t180-wt-e31 | local-0.4.12-e @ b6a616c | no | 0 | 1502.9 | 2026-10-21T11:19Z | 0 | ours-done | version-bump install build |
| t180-wt-e32 | d425-e @ 704e9e1 | local-0.4.17 | 0 | 13.1 | 2026-10-22T03:08Z | 0 | ours-done |  |
| t180-wt-e33 | d425-meas-e @ cb529ce | no | 0 | 13.1 | 2026-10-22T03:09Z | 0 | ours-done | measurement merge, 0 unlanded patches |
| t180-wt-e34 | local-0.4.13-e @ ab89570 | no | 0 | 1503.2 | 2026-10-22T03:47Z | 0 | ours-done | version-bump install build |
| t180-wt-e35 | d403-on-0413 @ 2ccee1e | local-0.4.17 | 0 | 13.1 | 2026-10-22T14:55Z | 0 | ours-done |  |
| t180-wt-e36 | d432-e @ 3c870e3 | local-0.4.17 | 0 | 13.1 | 2026-10-22T21:44Z | 0 | ours-done |  |
| t180-wt-e38 | d437a-e @ f2cd310 | local-0.4.17 | 0 | 13.2 | 2026-10-23T04:31Z | 0 | ours-done |  |
| t180-wt-e43 | d402-e @ 9c5a3ab | local-0.4.18 | 0 | 14.5 | 2026-10-24T01:55Z | 0 | ours-live | D402, until A merges it (chair) |
| t180-wt-land411 | local-0.4.11 @ 57b41f8 | local-0.4.17 | 0 | 3329.3 | 2026-10-21T01:40Z | 0 | ours-done |  |
| t180-wt-land412 | local-0.4.12 @ a795359 | local-0.4.17 | 0 | 3329.5 | 2026-10-21T11:01Z | 0 | ours-done |  |
| t180-wt-land413 | local-0.4.13 @ 6261a22 | local-0.4.17 | 0 | 13.1 | 2026-10-22T03:23Z | 0 | ours-done |  |
| t180-wt-land414 | local-0.4.14 @ b6969da | local-0.4.17 | 2 | 13.4 | 2026-10-23T04:22Z | 0 | ours-done |  |
| t180-wt-land415 | local-0.4.15 @ 42d4c2b | local-0.4.17 | 0 | 13.3 | 2026-10-23T09:34Z | 0 | ours-done |  |
| t180-wt-land416 | local-0.4.16 @ e8e34d0 | local-0.4.17 | 0 | 13.3 | 2026-10-23T13:28Z | 0 | ours-done |  |
| t180-wt-land417 | local-0.4.17 @ 1e436f6 | local-0.4.17 | 0 | 13.4 | 2026-10-23T18:54Z | 0 | ours-done |  |
| t180-wt-land418 | local-0.4.18 @ ff88d85 | local-0.4.18 | 2 | 14.7 | 2026-10-24T13:52Z | 0 | ours-live | A's 0.4.18 landing (chair) |
| t180-wt-o1 | d421-o @ 937f5d4 | local-0.4.17 | 0 | 12.9 | 2026-10-21T00:45Z | 0 | ours-done |  |
| t180-wt-o10-kn5 | (detached) @ 63bb388 | local-0.4.17 | 18 | 13.3 | 2026-10-23T04:22Z | 0 | ours-done | merge in progress, MERGE_HEAD 3c870e3 in 0.4.17 |
| t180-wt-o11-kn5a | (detached) @ 1a113c3 | local-0.4.17 | 18 | 13.3 | 2026-10-23T05:41Z | 0 | ours-done | merge in progress, MERGE_HEAD 3c870e3 in 0.4.17 |
| t180-wt-o12 | d439-o @ cd3dc42 | local-0.4.17 | 2 | 13.4 | 2026-10-23T08:07Z | 0 | ours-done |  |
| t180-wt-o13-kn5 | (detached) @ cd3dc42 | local-0.4.17 | 18 | 13.3 | 2026-10-23T08:09Z | 0 | ours-done | merge in progress, MERGE_HEAD 3c870e3 in 0.4.17 |
| t180-wt-o14 | d440-o @ c422e8e | local-0.4.17 | 2 | 13.5 | 2026-10-23T10:15Z | 0 | ours-done |  |
| t180-wt-o15-red | (detached) @ cd3dc42 | local-0.4.17 | 1 | 13.2 | 2026-10-23T08:35Z | 0 | ours-done |  |
| t180-wt-o16 | d443-o @ da76067 | local-0.4.17 | 2 | 13.5 | 2026-10-23T12:59Z | 0 | ours-done |  |
| t180-wt-o17 | d444-o @ 9fa000a | local-0.4.17 | 2 | 13.5 | 2026-10-23T13:18Z | 0 | ours-done |  |
| t180-wt-o18 | d447-o @ 05cdb9d | no | 5 | 13.6 | 2026-10-24T14:05Z | 0 | ours-live | D447 (chair) |
| t180-wt-o19-before | (detached) @ e8e34d0 | local-0.4.17 | 2 | 13.6 | 2026-10-24T01:37Z | 0 | ours-live | D447 (O, born 10-24) |
| t180-wt-o2 | d421-o-int @ 06e0645 | no | 1 | 12.9 | 2026-10-20T23:02Z | 0 | ours-done | integration only, "not to land" |
| t180-wt-o20-83eaf20 | (detached) @ 83eaf20 | no | 2 | 13.5 | 2026-10-24T00:20Z | 0 | ours-live | D447 (O) |
| t180-wt-o21-2c13316 | (detached) @ 2c13316 | no | 2 | 13.5 | 2026-10-24T11:14Z | 0 | ours-live | D447 (O) |
| t180-wt-o22-f2459fe | (detached) @ 05cdb9d | no | 1 | 13.4 | 2026-10-24T11:34Z | 0 | ours-live | D447 (O) |
| t180-wt-o3 | d421c-o @ d3be0cb | local-0.4.17 | 0 | 13.0 | 2026-10-21T03:44Z | 0 | ours-done |  |
| t180-wt-o4 | d431-o @ 4f96f6b | local-0.4.17 | 2 | 13.3 | 2026-10-22T17:29Z | 0 | ours-done |  |
| t180-wt-o5 | d434-o @ 681727f | local-0.4.17 | 2 | 13.4 | 2026-10-23T02:45Z | 0 | ours-done |  |
| t180-wt-o6-scratch | (detached) @ 15e4e81 | local-0.4.17 | 18 | 13.3 | 2026-10-23T02:45Z | 0 | ours-done | a merge left in progress (MERGE_HEAD 3c870e3, in 0.4.17), nothing committed |
| t180-wt-o7 | d438-o @ 7cc2ca4 | local-0.4.17 | 2 | 13.4 | 2026-10-23T06:27Z | 0 | ours-done |  |
| t180-wt-o8-red | (detached) @ 681727f | local-0.4.17 | 2 | 13.3 | 2026-10-23T03:54Z | 0 | ours-done |  |
| t180-wt-o9-d438 | (detached) @ 63bb388 | local-0.4.17 | 1 | 13.3 | 2026-10-23T04:22Z | 0 | ours-done |  |
| t180-wt-p402 | (detached) @ 910fd64 | local-0.4.18 | 0 | 14.5 | 2026-10-24T01:42Z | 0 | ours-live | D402, P's review |
| t180-wt-p438 | (detached) @ f5e1994 | local-0.4.17 | 1 | 13.3 | 2026-10-23T05:16Z | 0 | ours-done |  |
| t180-wt-p438b | (detached) @ d52c4cc | local-0.4.17 | 1 | 13.3 | 2026-10-23T05:26Z | 0 | ours-done |  |
| t180-wt-p438c | (detached) @ 7cc2ca4 | local-0.4.17 | 1 | 13.3 | 2026-10-23T06:28Z | 0 | ours-done |  |
| t180-wt-p439 | (detached) @ cd3dc42 | local-0.4.17 | 1 | 13.3 | 2026-10-23T10:20Z | 0 | ours-done |  |
| t180-wt-p440 | (detached) @ c422e8e | local-0.4.17 | 1 | 13.3 | 2026-10-23T13:02Z | 0 | ours-done |  |
| t180-wt-p443 | (detached) @ da76067 | local-0.4.17 | 1 | 13.3 | 2026-10-23T13:02Z | 0 | ours-done |  |
| t180-wt-p446 | (detached) @ 5a2fbab | local-0.4.17 | 0 | 13.4 | 2026-10-23T17:57Z | 0 | ours-done |  |
| t180-wt-p446e | (detached) @ e8e34d0 | local-0.4.17 | 0 | 13.3 | 2026-10-23T21:15Z | 0 | ours-done |  |
| t180-wt-p447 | (detached) @ 2be3b8e | no | 0 | 13.4 | 2026-10-23T23:50Z | 0 | ours-live | D447, P's review |
| t180-wt-p447f | (detached) @ 83eaf20 | no | 0 | 13.4 | 2026-10-23T23:40Z | 0 | ours-live | D447, P's review |
| t180-wt-p447g | (detached) @ 2c13316 | no | 0 | 13.4 | 2026-10-24T03:00Z | 0 | ours-live | D447, P's review |
| t180-wt-p447h | (detached) @ 05cdb9d | no | 0 | 13.4 | 2026-10-24T09:26Z | 0 | ours-live | D447, P's review |

### Item 2: the 77 t180-* entries in Downloads that are not worktrees of that repo

| entry | kind | what it holds | size MB | last write | record mentions (newest) | verdict |
|---|---|---|---|---|---|---|
| t180-048-shots-e | dir | dropped gate.js labels.js shots shots048.js shots048b.js | 17.6 | 2026-10-19T12:59Z | 3 (librarian/2026-10-18.md) | ours-done |
| t180-archive | dir | d420_2026-10-19.bundle d420_2026-10-19.bundle.heads.txt d420_2026-10-19.bundle.sha256 d420_desktop_d411_2026-10-20.bundle d420_p-d411-L5-base.bundle d420_p-d411-L5-N.bundle | 47.1 | 2026-10-20T08:09Z | 3 (handback/p-d420-cleanup-O_2026-10-20.md) | ours-live: the D420 backup bundle (keep: it is the backup) |
| t180-cargo-c | dir | .rustc_info.json CACHEDIR.TAG debug | 1827.4 | 2026-10-16T15:51Z | 0 | ours-done |
| t180-cargo-e | dir | .rustc_info.json CACHEDIR.TAG debug | 1841.6 | 2026-10-17T15:40Z | 1 (handback/p-d361-layouts-E_2026-10-17.md) | ours-done |
| t180-d049 | dir | build.log build.out build.sh bump.js c1.txt c2.txt | 1.5 | 2026-10-20T07:58Z | 4 (handback/p-d425-cues-B_2026-10-22.md) | ours-done |
| t180-d331 | dir | closeall.js closeall_core.js fixture_search.js fnprofile.js fprobe.js fprobe2.js | 10.2 | 2026-10-16T07:24Z | 10 (handback/p-d420-cleanup-O_2026-10-20_evidence/census-before.json) | ours-done |
| t180-d341 | dir | align.js atfail.js atpiece.js bend.js catchcost.js chk.js | 22.0 | 2026-10-16T16:21Z | 0 | ours-done |
| t180-d344 | dir | apply.out base.js cand.js dry exportcheck.out export_check.js | 5.5 | 2026-10-16T21:29Z | 2 (loop/plan_t180_handoff_2026-10-15.md) | ours-done |
| t180-d355 | dir | after-Road.png after-Start.png before.png HANDBACK_A.md shot.js | 0.4 | 2026-10-17T12:27Z | 3 (loop/plan_t180_handoff_2026-10-15.md) | ours-done |
| t180-d358 | dir | cmpbin.js cmpbin2.js control.log ELYSIUM-new.zip export_a.js HANDBACK_A.md | 934.0 | 2026-10-17T15:09Z | 2 (loop/plan_t180_handoff_2026-10-15.md) | ours-done |
| t180-d359 | dir | HANDBACK_A.md release_notes_0.4.0.md release_notes_0.4.0.md.before-chair | 0.0 | 2026-10-17T16:35Z | 1 (loop/plan_t180_handoff_2026-10-15.md) | ours-done |
| t180-d362 | dir | acreplay_local.js air.js bb budget.js chan.js corners.js | 42.6 | 2026-10-17T15:45Z | 2 (loop/plan_t180_handoff_2026-10-15.md) | ours-done |
| t180-d364 | dir | ELYSIUM-new.zip export_d364.js fitinert.log fitrow.log fixed.log green1.log | 1181.2 | 2026-10-17T16:26Z | 2 (loop/plan_t180_handoff_2026-10-15.md) | ours-done |
| t180-d371 | dir | app_mutation.out chain.done core_mutation.out exp-edge.log exp-fit.log exp-tile.log | 646.7 | 2026-10-17T19:08Z | 2 (loop/plan_t180_handoff_2026-10-15.md) | ours-done |
| t180-d373 | dir | release_notes_0.4.1.md | 0.0 | 2026-10-17T19:11Z | 0 | ours-done |
| t180-d378 | dir | aqua_contrast.txt bad_1px.css base_shot.js contrast.txt dbg.js dbg_lc.js | 4.6 | 2026-10-18T14:49Z | 6 (loop/plan_t180_handoff_2026-10-15.md) | ours-done |
| t180-d379-b | dir | aur1.out aur2.out aur3.out aur4.out aurora.css aur_cdp.js | 19.1 | 2026-10-18T00:20Z | 7 (map/E.md) | ours-done |
| t180-d379-e | dir | aqua.css aqua_cdp1.out aqua_cdp2.out aqua_cdp3.out aqua_cdp4.out aqua_layout1.out | 7.0 | 2026-10-18T00:20Z | 4 (loop/plan_t180_handoff_2026-10-15.md) | ours-done |
| t180-d381 | dir | aurora.out cdp-aurora cdp-sigil cdp-sigil2 cdp-skyline core-mutation.out | 4.0 | 2026-10-18T01:56Z | 2 (loop/plan_t180_handoff_2026-10-15.md) | ours-done |
| t180-d381-e | dir | app_cdp-aqua.out app_cdp-control.out app_cdp-glass.out app_cdp.js aqua_draft.css b17-2a.patch | 55.2 | 2026-10-18T02:03Z | 2 (loop/plan_t180_handoff_2026-10-15.md) | ours-done |
| t180-d384 | dir | bar-glass-fast.out bar-glass-final.out bar-glass.out bar-skyline-final.out bar-skyline.out bar1-glass.out | 40.7 | 2026-10-18T17:21Z | 2 (handback/p-d389-review-E_2026-10-18.md) | ours-done |
| t180-d384-e | dir | app_cdp.js bar1 bar2 bar3 bar3-aurora.out bar3-caustics.out | 156.8 | 2026-10-18T17:30Z | 1 (handback/p-d384-sky-E_2026-10-18.md) | ours-done |
| t180-d384-msg1.txt | file |  | 0.0 | 2026-10-18T11:57Z | 0 | ours-done |
| t180-d389 | dir | build.log build.out build.sh bump.js cargo.out core-mutation.out | 1.4 | 2026-10-18T18:58Z | 1 (handback/p-d389-landing-B_2026-10-18.md) | ours-done |
| t180-d389-e | dir | app_cdp.js glass_shots_lib.js hudprobe.js make_roots.js out-aqua out-aurora | 108.1 | 2026-10-18T19:31Z | 1 (handback/p-d389-review-E_2026-10-18.md) | ours-done |
| t180-d390 | dir | base-gen-consumer.tap base.log fx-gc fx-hang green.log green.out | 0.0 | 2026-10-18T19:55Z | 1 (handback/p-d390-suite-timeout-B_2026-10-18.md) | ours-done |
| t180-d391-e | dir | bar-after bar-after-aurora.out bar-after-caustics.out bar-after-prism.out bar-after-sun.out bar-before | 22.8 | 2026-10-18T19:41Z | 1 (handback/p-d391-skyglsl-E_2026-10-18.md) | ours-done |
| t180-d392 | dir | build.log build.out build.sh bump.js cargo.out core-mutation.out | 1.5 | 2026-10-18T21:31Z | 1 (handback/p-d392-landing-B_2026-10-18.md) | ours-done |
| t180-d393-e | dir | commit_msg.txt green-forms.out red-forms.out red-sky.out run_tests.sh t-sky-caustics-aurora.out | 0.0 | 2026-10-18T20:01Z | 1 (handback/p-d393-skycheck-E_2026-10-18.md) | ours-done |
| t180-d394 | dir | build.log build.out build.sh bump.js cargo.out core-mutation.out | 1.4 | 2026-10-19T00:55Z | 1 (handback/p-d394-landing-B_2026-10-18.md) | ours-done |
| t180-d394-e | dir | commit_msg.txt measure.js measure.out measure2.out patch-app.js patch-sound.js | 0.2 | 2026-10-18T22:56Z | 1 (handback/p-d394-theme-E_2026-10-18.md) | ours-done |
| t180-d394-red-settings.out | file |  | 0.0 | 2026-10-18T22:14Z | 0 | ours-done |
| t180-d395-concepts | dir | build-shots index.html make-concepts.js png svg | 0.5 | 2026-10-18T23:05Z | 3 (map/C.md) | ours-done |
| t180-d396 | dir | build.log build.out build.sh bump.js cargo.out conv.txt | 15.6 | 2026-10-19T03:51Z | 2 (handback/p-0.4.7-landing-B_2026-10-19.md) | ours-done |
| t180-d397-e | dir | analyse.js build-page.js cdp.js crops crops.js out | 241.1 | 2026-10-19T13:06Z | 4 (map/E.md) | ours-done |
| t180-d398-e | dir | base commit_msg.txt commit_msg2.txt row3.js run_tests.sh t-before-sky-dither.out | 9.7 | 2026-10-19T01:45Z | 2 (handback/p-d398b-bayerfix-E_2026-10-19.md) | ours-done |
| t180-d399-e | dir | art.txt before83 commit_msg.txt commit_msg_fix.txt commit_msg_orig.txt commit_msg_rebased.txt | 21.8 | 2026-10-19T03:49Z | 3 (handback/p-d399-fixes-E_2026-10-19.md) | ours-done |
| t180-d400 | dir | commit.txt exp.js fixport.js green green.log green.sh | 0.1 | 2026-10-19T02:09Z | 1 (handback/p-d400-devtools-port-B_2026-10-19.md) | ours-done |
| t180-d402-e | dir | amend-menubar.js amend-theme.js bands-final.out d402run.log d402run.sh d402run2.log | 0.1 | 2026-10-24T02:01Z | 1 (handback/p-d402-3-E_2026-10-23.md) | ours-live: D402 evidence, until A merges it |
| t180-d403-base | dir | .claude .gitattributes .gitignore app CHANGELOG.md docs | 13.1 | 2026-10-22T15:04Z | 0 | ours-done |
| t180-d403-diag | dir | .claude .gitattributes .gitignore app CHANGELOG.md docs | 13.1 | 2026-10-22T14:54Z | 0 | ours-done |
| t180-d403-mut | dir | .claude .gitattributes .gitignore app CHANGELOG.md docs | 13.1 | 2026-10-22T15:04Z | 0 | ours-done |
| t180-d403f-e | dir | base commit_msg.txt gate-final.log gate-green.log gate-red.log gate.js | 24.9 | 2026-10-19T04:51Z | 3 (map/E.md) | ours-done |
| t180-d403rev | dir | base lockrun.js m1 m2 probe.log probe2.log | 29.1 | 2026-10-19T04:16Z | 1 (handback/p-d403-review-B_2026-10-19.md) | ours-done |
| t180-d404 | dir | drag.js gpuprobe.js lockrun.js | 0.0 | 2026-10-19T03:55Z | 0 | ours-done |
| t180-d404rev-e | dir | ce core_piece_run1.out core_piece_run2.out core_piece_run3.out e4 gate.js | 50.2 | 2026-10-19T10:49Z | 2 (handback/p-d404-memoread-E_2026-10-19.md) | ours-done |
| t180-d405-e | dir | commit_msg.txt gate.js green.log green.sh green2.sh green3.sh | 26.6 | 2026-10-19T14:39Z | 3 (handback/p-d405-shotcheck-E_2026-10-19.md) | ours-done |
| t180-d406rev-e | dir | fix fix2 fixmax gate.js new old | 62.6 | 2026-10-19T08:32Z | 3 (handback/p-d406-check511609d-E_2026-10-19.md) | ours-done |
| t180-d408 | dir | build.log build.out build.sh bump.js bump.txt c1.txt | 17.1 | 2026-10-19T12:29Z | 11 (handback/p-d421-landing-O_2026-10-20.md) | ours-done |
| t180-d410 | dir | commit-msg.txt crisp-red3.out crisp-red4.out crisp-red5.out crisp-try1.out crisp-try2.out | 4.7 | 2026-10-19T22:01Z | 1 (handback/p-d410-crisp-B_2026-10-19.md) | ours-done |
| t180-d412 | dir | cargo.out cl.js commit-cl.txt holder2.js holder2.log lockrun.js | 1.5 | 2026-10-21T11:14Z | 1 (handback/p-d421c-landing-B_2026-10-21.md) | ours-done |
| t180-d413 | dir | cl414.js commit-cl.txt e-land.js fix3.tap fix414.js fix414b.js | 3.2 | 2026-10-22T19:48Z | 5 (handback/p-d437b-B_2026-10-22.md) | ours-done |
| t180-d414-e | dir | ab-d407a ab4-1A.out ab4-1B.out ab4-2A.out ab4-2B.out ab4.log | 69.9 | 2026-10-20T08:23Z | 9 (handback/p-local0410-m1-E_2026-10-20.md) | ours-done |
| t180-d416 | dir | anchors.js cl.js commit-msg.txt commit-msg2.txt cost.out cost.sh | 23.3 | 2026-10-20T04:59Z | 1 (handback/p-d416-skies-B_2026-10-19.md) | ours-done |
| t180-d421-e | dir | after anchors.js bit1.out bit2.out bit3.out bitcheck.js | 68.4 | 2026-10-23T12:20Z | 11 (map/E.md) | ours-done |
| t180-d421b | dir | both.js c1-frame-base.out c1-frame.out c1-row5.out c1-run1.tap c1check.js | 1.2 | 2026-10-21T02:43Z | 3 (handback/p-d421c-readout-B_2026-10-20.md) | ours-done |
| t180-d425-mut | dir | app package.json src tools | 10.3 | 2026-10-22T03:01Z | 0 | ours-done |
| t180-d425b | dir | e-428.js e-433.js e-handles.js e-panel.js e-sel.js e-vo.js | 0.2 | 2026-10-22T16:06Z | 1 (handback/p-d425-cues-B_2026-10-22.md) | ours-done |
| t180-d432-e | dir | b1 base bounds.js clearance.js clearance.out cliptry.js | 16.7 | 2026-10-23T03:27Z | 4 (handback/p-d435-E_2026-10-22.md) | ours-done |
| t180-d432-mut | dir | .claude .gitattributes .gitignore app CHANGELOG.md docs | 12.9 | 2026-10-22T20:32Z | 1 (handback/p-d432-E-build_2026-10-22.md) | ours-done |
| t180-d437-A | dir | .claude .gitattributes .gitignore app CHANGELOG.md docs | 13.2 | 2026-10-23T03:35Z | 0 | ours-done |
| t180-d437-base | dir | .claude .gitattributes .gitignore app CHANGELOG.md docs | 13.2 | 2026-10-23T04:31Z | 0 | ours-done |
| t180-d437-e | dir | bvhheap.js cage-A-force.log cage-A.log cage-base.log cage-new-force.log cage-new.log | 233.7 | 2026-10-23T04:42Z | 1 (handback/p-d437a-E_2026-10-22.md) | ours-done |
| t180-d437-mut | dir | .claude .gitattributes .gitignore app CHANGELOG.md docs | 12.9 | 2026-10-23T04:41Z | 0 | ours-done |
| t180-d437-S | dir | .claude .gitattributes .gitignore app CHANGELOG.md docs | 13.2 | 2026-10-23T03:35Z | 0 | ours-done |
| t180-d437b | dir | e-cl.js e-cs.js e-ex.js e-ex2.js e-ex3.js e-fix.js | 0.5 | 2026-10-23T08:25Z | 5 (handback/p-d441-landing-A_2026-10-23.md) | ours-done |
| t180-d446-e | dir | d446run.log d446run.sh d446run2.log d446run2.sh d446run3.log d446run3.sh | 1.3 | 2026-10-23T18:52Z | 3 (handback/p-d448-landing-A_2026-10-23.md) | ours-done |
| t180-d446-mut | dir | .claude .gitattributes .gitignore app CHANGELOG.md docs | 13.1 | 2026-10-23T18:18Z | 0 | ours-done |
| t180-handoff | dir | CATCH-UP.md fx-d340 harness row8-finish-roll.test.patch | 4.3 | 2026-10-16T14:24Z | 1 (loop/plan_t180_handoff_2026-10-15.md) | ask: CATCH-UP.md, the 10-15 handoff |
| t180-msgs | dir | a1.txt a2.txt a2_apptests.txt a3.txt a3_fullsuite.txt a4.txt | 0.9 | 2026-10-16T07:25Z | 0 | ours-done |
| t180-sounds-d334 | dir | README.txt ticks_before_after.wav | 7.6 | 2026-10-16T13:14Z | 2 (map/E.md) | ours-done |
| t180-tutorial | dir | TREATMENT.md | 0.0 | 2026-10-22T15:03Z | 0 | ask: TREATMENT.md draft of a tutorial video, no author named and 0 record mentions: ask |
| t180-wt-e19 | dir | WORKTREE OF Desktop\t180-track-builder (d394-e @ e18a9c5, merged local-0.4.17) | 12.5 | 2026-10-18T22:55Z | 3 (librarian/2026-10-18.md) | ours-done, but registered in the Desktop repo |
| t180-wt-e20 | dir | WORKTREE OF Desktop\t180-track-builder (d398-e @ e46d5a1, merged local-0.4.17) | 12.5 | 2026-10-19T01:45Z | 6 (librarian/2026-10-18.md) | ours-done, but registered in the Desktop repo |
| t180-wt-e21 | dir | WORKTREE OF Desktop\t180-track-builder (d399-e @ fc8c445, merged local-0.4.17) | 12.6 | 2026-10-19T03:44Z | 5 (librarian/2026-10-18.md) | ours-done, but registered in the Desktop repo |
| t180-wt-e22 | dir | WORKTREE OF Desktop\t180-track-builder (skydither-row2-e @ 41eac04, merged local-0.4.17) | 12.5 | 2026-10-19T03:55Z | 2 (handback/p-skydither-row2-read-B_2026-10-19.md) | ours-done, but registered in the Desktop repo |
| t180-wt-e24 | dir | WORKTREE OF Desktop\t180-track-builder (d405-e @ 294cacd, merged local-0.4.17) | 12.7 | 2026-10-19T14:25Z | 2 (handback/p-d405-shotcheck-E_2026-10-19.md) | ours-done, but registered in the Desktop repo |

### Item 3: scratchpads under %LOCALAPPDATA%\Temp\claude

| instance folder | sessions | size MB | last write | verdict |
|---|---|---|---|---|
| C--Consonance-instances-sibling-372c8abc | 4 | 3331.1 | 2026-10-24T14:13Z | ours-live: one live session holds it all (its other 3 session folders are empty) |
| C--Consonance-instances-sibling-3d57124e | 4 | 2712.1 | 2026-10-24T14:16Z | ours-live: one live session holds it all (its other 3 session folders are empty) |
| C--Consonance-instances-third-place | 4 | 2415.8 | 2026-10-24T07:39Z | the Third Place seat: size only, never opened; ours-live: one live session holds it all (its other 3 session folders are empty) |
| C--Consonance-instances-librarian | 3 | 1567.8 | 2026-10-24T14:07Z | ours-live: one live session holds it all (its other 2 session folders are empty) |
| C--Consonance-instances-sibling-07b8a48f | 3 | 1406.3 | 2026-10-24T11:41Z | ours-live: one live session holds it all (its other 2 session folders are empty) |
| C--Consonance-instances-sibling-0845a868 | 3 | 201.5 | 2026-10-24T14:18Z | ours-live: one live session holds it all (its other 2 session folders are empty) |
| C--Consonance-instances-sibling-5bf9d657 | 3 | 187.4 | 2026-10-24T07:39Z | ours-live: one live session holds it all (its other 2 session folders are empty) |
| C--Consonance-instances-main | 3 | 23.5 | 2026-10-24T14:07Z | ours-live: one live session holds it all (its other 2 session folders are empty) |
| C--Consonance-instances-sibling-36313935 | 5 | 20.7 | 2026-10-24T14:07Z | ours-live: one live session holds it all (its other 4 session folders are empty) |
| msi-bios | 1 | 15.9 | 2026-10-07T02:07Z | ours-done |
| (175 more, each under 1 MB) |  | 0.6 |  | ours-done |

### Item 4: %TEMP% (C:\Users\nname\AppData\Local\Temp), top-level entries, claude\ excluded

| kind | entries | size MB | oldest .. newest write | of which written since 13:45Z today (a run going now) | verdict |
|---|---|---|---|---|---|
| not ours by evidence | 2126 | 3489.6 | 2021-10-10T21:35Z .. 2026-10-24T14:18Z | 0 (0.0 MB) | leave (other software: VS installer cache 2ktw2hl1 1985 MB, an app's uuid .tmp* cache, LWSDebugOut.txt, Razer, Adobe) |
| lap-named temp dir (seat letter + lap) | 7 | 1031.1 | 2026-10-23T02:06Z .. 2026-10-24T14:00Z | 1 (28.1 MB) | ours-done, except the live ones |
| t180 test temp dir (Chrome profile or tree copy) | 40 | 432.9 | 2026-10-15T00:16Z .. 2026-10-24T14:18Z | 6 (238.0 MB) | ours-done, except the live ones |
| lap-named temp dir | 1 | 13.2 | 2026-10-23T15:17Z .. 2026-10-23T15:17Z | 0 (0.0 MB) | ours-done, except the live ones |
| Chrome scoped_dir | 13 | 8.2 | 2026-10-22T18:37Z .. 2026-10-22T21:50Z | 0 (0.0 MB) | ours-done, except the live ones |
| ours by name | 46 | 4.8 | 2026-10-17T12:59Z .. 2026-10-24T14:00Z | 1 (0.0 MB) | ours-done, except the live ones |

### Item 5: fake AC roots and exported tracks outside a scratchpad

Fake AC roots at a drive root (C:, D:, E:, F:, G: `fake*`): **none**.

| folder | size MB | last write | verdict |
|---|---|---|---|
| ~/Downloads/t180-d437-e/out-typed-force/t180b_elysium | 221.2 | 2026-10-23T03:44Z | ours-done |
| ~/Downloads/t180-d371/out-tile/t180b_elysium | 214.9 | 2026-10-17T18:08Z | ours-done |
| ~/Downloads/t180-d371/out-fit/t180b_elysium | 214.9 | 2026-10-17T18:09Z | ours-done |
| ~/Downloads/t180-d371/out-edge/t180b_elysium | 214.9 | 2026-10-17T18:16Z | ours-done |
| ~/Downloads/t180-d364/zipstage/t180b_elysium | 214.9 | 2026-10-17T15:54Z | ours-done |
| ~/Downloads/t180-d364/t180b_elysium.before-d364 | 214.9 | 2026-10-17T15:53Z | ours-done |
| ~/Downloads/t180-d364/out-fixed/t180b_elysium | 214.9 | 2026-10-17T16:20Z | ours-done |
| ~/Downloads/t180-d364/out-fitrow/t180b_elysium | 214.9 | 2026-10-17T15:51Z | ours-done |
| ~/Downloads/t180-d364/out-fitinert/t180b_elysium | 214.9 | 2026-10-17T15:49Z | ours-done |
| ~/Downloads/t180-d358/zipstage/t180b_elysium | 214.9 | 2026-10-17T15:04Z | ours-done |
| ~/Downloads/t180-d358/t180b_elysium.before-scifi | 198.9 | 2026-10-17T15:04Z | ours-done |
| ~/Downloads/t180-d358/out-scifi/t180b_elysium | 214.9 | 2026-10-17T15:02Z | ours-done |
| ~/Downloads/t180-d358/out-control/t180b_elysium | 198.9 | 2026-10-17T15:01Z | ours-done |
| ~/Desktop/lighthouse/exo_memory/handback/p-d439-O_2026-10-23_evidence/tracks/kn5-tex/t180b_test_track_10_copy_closer_d439 | 218.0 | 2026-10-23T08:11Z | ours-done |
| ~/Desktop/lighthouse/exo_memory/handback/p-d438-build-O_2026-10-22_evidence/tracks/kn5-tex-a/t180b_test_track_10_copy_closer_d438a | 218.7 | 2026-10-23T05:43Z | ours-done |
| ~/Desktop/lighthouse/exo_memory/handback/p-d438-build-O_2026-10-22_evidence/tracks/kn5-tex/t180b_test_track_10_copy_closer_d438 | 218.9 | 2026-10-23T04:27Z | ours-done |
| ~/Desktop/lighthouse/exo_memory/handback/p-d434-O_2026-10-22_evidence/tracks/kn5-tex/t180b_test_track_10_copy_banked_closer | 220.9 | 2026-10-23T03:19Z | ours-done |
| ~/Desktop/lighthouse/exo_memory/handback/p-d433-P_2026-10-22_evidence/out-re/t180b_test_10 | 0.7 | 2026-10-22T15:45Z | ours-done |
| ~/Desktop/lighthouse/exo_memory/handback/p-d433-P_2026-10-22_evidence/out/t180b_test_10 | 64.4 | 2026-10-22T15:40Z | ours-done |
| his own track folders on the Desktop (Assetto tracks, content/tracks and his project folders): 39 rows withheld from this public file, listed in pane C scratchpad d450/tables.md | 10469.1 | | his |
| ~/Documents/t180b_untitled | 4.9 | 2026-09-27T23:01Z | his folder, ours-made: a C run exported it there by accident on 09-27 (p-d170-bvh-fix-C_2026-09-27.md:36); his call |
| ~/Documents/T-180 export backups/t180b_elysium (export of 2026-10-12) | 183.7 | 2026-10-15T17:41Z | his (0 record mentions) |
| ~/Documents/Assetto Corsa/content/tracks/t180b_test_oval | 53.5 | 2026-10-02T21:54Z | his AC user folder; who wrote it is not in the record I searched; his |
| lighthouse p-d447-O evidence fakeac/ (21 exported tracks) | 5154.7 | 2026-10-24T11:50Z | ours-live (D447); untracked in the PUBLIC lighthouse repo: must never be committed |
| ~/Desktop/ELYSIUM (T-180 track).before-d364.zip | 103.5 | 2026-10-17T15:04Z | his folder; a backup of his zip that we made (plan_t180_handoff_2026-10-15.md:1583, :1869): his call |
| ~/Desktop/ELYSIUM (T-180 track).before-scifi.zip | 96.9 | 2026-10-12T21:35Z | his folder; a backup of his zip that we made (plan_t180_handoff_2026-10-15.md:1583, :1869): his call |
| C:/build/* (7 cargo target dirs, a-d098 .. b-d170, Sep 21-27) | 23834.3 | 2026-09-27 | ours-done (other leftover: our cargo builds) |

### Item 6: untracked files in the shared lighthouse checkout

| path | files | size MB | of which .kn5 / track folders MB | sorted | note |
|---|---|---|---|---|---|
| exo_memory/handback/p-d424-landing-O_2026-10-22_evidence/rerun/ | 4 | 0.5 | 0.0 | hand-back evidence to commit |  |
| exo_memory/handback/p-d431-review-P_2026-10-22_evidence/ | 10 | 0.1 | 0.0 | hand-back evidence to commit |  |
| exo_memory/handback/p-d433-P_2026-10-22_evidence/ | 72 | 84.3 | 64.8 | hand-back evidence to commit, without its exported track |  |
| exo_memory/handback/p-d434-O_2026-10-22_evidence/tracks/ | 50 | 236.3 | 236.3 | other: exported tracks, not to commit |  |
| exo_memory/handback/p-d436-P_2026-10-22_evidence/ | 101 | 10.9 | 0.0 | hand-back evidence to commit |  |
| exo_memory/handback/p-d437-P_2026-10-22_evidence/ | 48 | 5.8 | 0.0 | hand-back evidence to commit |  |
| exo_memory/handback/p-d437b-B_2026-10-22_evidence/ | 11 | 0.1 | 0.0 | hand-back evidence to commit |  |
| exo_memory/handback/p-d438-O_2026-10-22_evidence/tracks/ | 4 | 0.3 | 0.3 | other: exported tracks, not to commit |  |
| exo_memory/handback/p-d438-build-O_2026-10-22_evidence/tracks/ | 35 | 443.6 | 443.6 | other: exported tracks, not to commit |  |
| exo_memory/handback/p-d439-O_2026-10-23_evidence/tracks/ | 11 | 218.0 | 218.0 | other: exported tracks, not to commit |  |
| exo_memory/handback/p-d447-O_2026-10-23_evidence/fakeac/ | 240 | 5154.7 | 5154.7 | other: exported tracks, not to commit | ours-live (D447) |
| exo_memory/loop/plan_*.md (12 plans, D430-D438, D446, batches 0.4.15-0.4.17) | 12 | 0.1 | 0 | other: loop plans, to commit (the record) |  |
| grep.exe.stackdump (repo root, 2026-10-20) | 1 | 0.0 | 0 | other: a crash dump, to delete |  |

### Item 7: long-running processes we started that are not infrastructure

At 14:18Z: **none older than today**. Infrastructure, not counted: consonance.exe 18572 (10-21 20:31 local), stick-waiter node 21676 (10-21 20:31), world-sense node 29240 (10-21 20:32). Everything else of ours was started 07:52-08:18 local today by a seat working now:

| pid | started (local) | command | whose |
|---|---|---|---|
| 18812 | 10-24 07:52 | lockrun.js "A local-0.4.18 ful…" (and its node --test 9636 with children, Chrome headless 41368 / 38712 on t180snd-test / t180crisp profiles) | A's 0.4.18 full suite |
| 25772 | 10-24 08:11 | node run447o.js → node --test core_close_* 41868 | O, D447 |
| 21724 | 10-24 08:11 | node run447p.js → copies-bytes.js 9068 | P, D447 |
| 5836 | 10-24 08:18 | node inv345.js (exited) | this inventory |

### Item 8: t180 branches merged into local-0.4.17 or later with no worktree

| branch | head | last commit | merged into |
|---|---|---|---|
| d427-a | a795359 | 2026-10-21T04:39 | local-0.4.17 |
| d446-e | a05e487 | 2026-10-23T12:52 | local-0.4.17 |
| land-0.4.8 | 409d3f8 | 2026-10-20T01:56 | local-0.4.17 |
| main | dbb92b6 | 2026-09-30T03:27 | local-0.4.17 (keep: the default branch) |

Not merged and no worktree: none.

## Totals per item

These are apparent sizes from `tables.js`. The items overlap: item 5's Downloads tracks sit inside item 2's
folders, and item 6's tracks are item 5's lighthouse rows. So these figures do not add up to one machine total.

| item | ours-done | ours-live | his / not ours | other |
|---|---|---|---|---|
| 1 worktrees (80) | 66 trees, 17.82 GiB | 14 trees, 9.42 GiB (9.25 of it is the main checkout) | 0 | 0 junctions |
| 2 non-worktree t180-* (77) | 68 entries, 7.83 GiB | 2 (t180-d402-e, t180-archive the D420 backup), 0.05 GiB | 5 Desktop-repo worktrees, 0.06 GiB (his call) | 2 ask (t180-tutorial, t180-handoff) |
| 3 scratchpads (185 folders) | under 1 MB of dead folders | 11.60 GiB: each live instance has one session holding it all | Third Place: size only | |
| 4 %TEMP% (2,233 entries) | about 99 of our entries, 1.21 GiB on disk | the runs going now (about 266 MB) | 2,126 entries, 3.41 GiB of other software (names withheld) | |
| 5 fake roots / exported tracks | 13 Downloads exports (inside item 2), 6 filed-lap exports in lighthouse, C:\build 18.17 GiB on disk | 21 D447 exports, 5.03 GiB | his tracks 10.2 GiB; 2 Desktop zips and 3 Documents folders (his call) | 0 fake roots |
| 6 lighthouse untracked | | p-d447-O fakeac/ | | evidence to commit 0.10 GiB (without its kn5); 12 loop plans; 1 crash dump |
| 7 processes | none | A's 0.4.18 suite, O and P D447 runs (all started today) | infrastructure: consonance, stick-waiter, world-sense | |
| 8 branches | d427-a, d446-e, land-0.4.8 | | | main (keep) |

## The proposed delete list (for the keeper's one yes)

The bytes are what each group frees on disk.
- checked: `du -sck --files0-from` over each group's path list (`g1.paths` … `g6.paths` in the evidence folder),
  which counts a hard-linked file once (`du-delete-list.out`).

| group | what | how (part 2) | frees |
|---|---|---|---|
| G1 | 66 ours-done worktrees (`g1.paths`) | `git worktree remove --force` from `Downloads\t180-track-builder`, after a fresh link check on each; then `git worktree prune` | 16.73 GiB |
| G2 | 68 ours-done Downloads `t180-*` folders and files (`g2.paths`) | back up the text files (30,827 files, 382.5 MB, upper bound) with a sha256 list, then delete | 7.52 GiB |
| G4 | 99 of our %TEMP% entries last written before 13:45Z (`g4.names`) | delete; re-check each first, since a live run may reuse a profile | 1.21 GiB |
| G5 | `C:\build` (7 cargo target folders, Sep 21–27) | delete; build output, nothing to back up | 18.17 GiB |
| G6 | lighthouse untracked exported tracks of filed laps (`g6.paths`: d433 out/ and out-re/, d434, d438-O, d438-build, d439 tracks/) | delete; regenerable from the landed commits and his track file | 0.94 GiB |
| — | `lighthouse/grep.exe.stackdump` (1 KB, 10-20) | delete | ~0 |
| — | branches d427-a, d446-e, land-0.4.8 | `git branch -d` (merged, so `-d` refuses anything that is not) | 0 |
| | **total** | | **44.56 GiB** |

**Not on the list, and why:**
- **His:** his tracks, Desktop, Documents and AC folders.
- **His call:**
  - the 5 Desktop-repo worktrees;
  - `Documents\t180b_untitled`, an accidental export by a C run on 09-27;
  - `Documents\Assetto Corsa\content\tracks\t180b_test_oval`;
  - the two Desktop `ELYSIUM … .before-*.zip` backups we made of his zip.
- **Ours-live:** see above. D447's 5.03 GiB of `fakeac/` is the next big item once D447 is filed.
- **Ask:** `t180-tutorial` and `t180-handoff`.
- **Not ours:** the %TEMP% entries of other software.
- **The scratchpads:** each live session's scratchpad is its seat's to prune, and the Third Place's is never opened.
- **Item 6 "to commit":**
  - the evidence of d424, d431, d433 (without `out/`), d436, d437 and d437b;
  - the 12 loop plans.
  - These belong to the librarian's next record commit, not to the delete.

## Corrections, my own

- My first record-mention count ran 154 greps over the whole of `exo_memory` and passed 10 minutes. I stopped it
  (TaskStop) and replaced it with the single pass in `names.js` (9,086 files read, 354 binaries skipped).
- My first item-8 list showed `local-0.4.14` to `local-0.4.17` as having no worktree. They do have worktrees
  (land414–land417). `refname:short` prints `heads/local-0.4.x` because a tag of the same name exists. Fixed by
  stripping the `heads/` prefix. Item 8 is 3 branches plus main.
- My first draft said 9 of P's filed-lap trees, 124 MB. Recounted: 8 trees, 106.7 MB.
- `walk.js`'s apparent sizes over-count cargo's hard links (C:\build: 23.28 apparent against 18.17 GiB on disk). So
  the delete list uses `du`, and the per-item totals above are apparent sizes.
- In my first item-3 pass, every instance showed 0 MB in its older sessions. That is real, not a bug:
  `scratch-sessions.out` shows each live instance has exactly one session folder with data, and that one has been
  written since September.

## Evidence

All of it is in `exo_memory/handback/p-d450-cleanup-inventory-C_2026-10-24_evidence/`:
- the scripts: `walk.js`, `inv12.js`, `names.js`, `inv345.js` and `tables.js`;
- their outputs: `inv12.json`, `inv345.json` (his rows and other software's %TEMP% names withheld), `names.json`,
  `totals.json` and `tables.md`;
- the path lists: `g1`–`g6.paths` and `g4.names`;
- `du-delete-list.out` and `scratch-sessions.out`.

To re-run: `node inv12.js`, `node names.js`, `node inv345.js`, then `node tables.js`. Each reads the machine fresh,
so the numbers move with the live runs.

NEXT: librarian brings the keeper one delete list (G1, G2, G4, G5, G6, the crash dump and the 3 branches, 44.56 GiB)
for his yes. Three questions ride with it: the 5 Desktop-repo worktrees, the Documents and Desktop copies, and
whether P's 8 filed-lap review trees are still live.

## Addendum, 14:37Z: priority, against the BelowNormal rule of 14:33Z

The rule came after the inventory had finished, so every scan above ran at **normal** priority. Two of them were
heavy and were running at 08:32 local, when the keeper's game crashed:
- `du -sck` over the whole delete list, about 45 GiB across Downloads, C:\build and %TEMP%, from about 08:27 to
  08:33;
- a per-session `du` and `find` over the five largest scratchpads, from about 08:26 to 08:32.

Before them, `inv12.js` (worktree walk and git status, 08:06), `inv345.js` (08:18, about 50 s) and `tables.js` (about
20 s) ran at normal priority too.

inferred: they may have added to the load that crashed his game. That is not shown; it is the overlap in time only.

checked: no process of mine is running now (`Win32_Process` filtered on d450, inv*, names.js, tables.js and du →
none). Any re-run of these scripts in part 2 starts at BelowNormal.
