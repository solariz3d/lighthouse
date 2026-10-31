# D564: housekeeping, the history rewrite and the lighthouse re-land (pane E, machine D), 2026-10-30

On the keeper's word at 18:15–18:16 ("do it as well"); the brief is the librarian's 18:19 ring and the chair's D564. The landing's own tier: the deletes are on his word, safeguarded by the lists, the junction check and the backup ref. This file grows as the three parts finish; (a) is complete.

## (a) Disk

**Free space on C:** (`df -B1 /c`)

    before  42,020,855,808 bytes free (39 GiB)
    after   80,688,361,472 bytes free (75 GiB)
    freed   38,667,505,664 bytes by df

The removed folders sum to 42,622,076,013 bytes by an lstat walk. The two figures differ because other seats write to the disk meanwhile.

**`git worktree prune`** in t180-fresh, `Desktop\t180-track-builder` and lighthouse: nothing to prune before (entries 27, 83, 50, unchanged). After the removals it dropped the 7 t180 and 12 lighthouse entries; t180-fresh now has 21 entries and lighthouse 38.

**How each folder was removed** (`S/d564/del.js`, at BelowNormal):

1. List its reparse points with `dir /AL /S /B`, which does not follow them.
2. Remove each link itself, never what it points to.
3. Check that none is left.
4. Measure the folder by an lstat walk, which does not follow links.
5. Remove it with `rmdir /s /q`.

**Proved before use** on a scratch folder holding a junction to a target with one file:

    checked: del.js on S/d564/jt/victim (with a junction sub\reads -> jt\target) → the junction listed and removed as a link, the folder measured at 5 bytes (its own file only), the folder gone, the target's file intact ("keep-me")

**Every folder was dry-run first**, listing its links and size. **No junction or symlink was found in any of the 97.**

**Kept, as ordered or on inspection:**

- **On the order's do-not-remove list:** t180-archive, t180-handoff, t180-tutorial, `Downloads\t180-track-builder`, the 0.4.23 zip, the review .md, the two renders folders (t180-d490-renders, t180-d495-renders), and `Desktop\t180-track-builder`'s own 82 worktrees.
- **`C:\Users\nname\Downloads\t180-wt-a538` (d538-a), kept on inspection.** Its tip is on origin/main, but it holds two modified tracked files: `app/core/panel.js` and `app/core/valuesoverlay.js`. That is uncommitted work, so it is for its owner to commit or drop.
- **`d534-land`: nothing to remove.** It is a branch with no worktree (`t180-wt-c534` carries `d540-install`).
- **Lighthouse:** the six keep-list worktrees, and every unmerged one.
- **Lighthouse, detached:** seven detached worktrees, which have no branch for "fully merged" to apply to. Three of them hold uncommitted edits: lh-d476p4-rev, rev2 and rev3. The others are lh-base-d476, lh-land-d368, lh-base-d368 and lh-base-dfe05087-e.

### Every removal, by path

**The 78 dangling t180-wt-* folders in Downloads** (78 removed, 18,913,541,108 bytes, 0 links):

- `C:/Users/nname/Downloads/t180-wt-040` 8,329,963 bytes, 532 files
- `C:/Users/nname/Downloads/t180-wt-a29` 13,341,927 bytes, 587 files
- `C:/Users/nname/Downloads/t180-wt-a427` 13,701,460 bytes, 603 files
- `C:/Users/nname/Downloads/t180-wt-a429` 13,762,518 bytes, 605 files
- `C:/Users/nname/Downloads/t180-wt-a462` 15,308,251 bytes, 621 files
- `C:/Users/nname/Downloads/t180-wt-a473` 15,572,129 bytes, 637 files
- `C:/Users/nname/Downloads/t180-wt-a482` 15,593,008 bytes, 638 files
- `C:/Users/nname/Downloads/t180-wt-a484` 15,647,074 bytes, 641 files
- `C:/Users/nname/Downloads/t180-wt-a484base` 15,621,523 bytes, 640 files
- `C:/Users/nname/Downloads/t180-wt-a486` 15,511,317 bytes, 642 files
- `C:/Users/nname/Downloads/t180-wt-b425` 13,730,248 bytes, 604 files
- `C:/Users/nname/Downloads/t180-wt-b437` 13,882,785 bytes, 613 files
- `C:/Users/nname/Downloads/t180-wt-b463` 15,302,192 bytes, 620 files
- `C:/Users/nname/Downloads/t180-wt-c29` 13,704,467 bytes, 603 files
- `C:/Users/nname/Downloads/t180-wt-c460` 15,353,296 bytes, 625 files
- `C:/Users/nname/Downloads/t180-wt-c460base` 15,298,776 bytes, 620 files
- `C:/Users/nname/Downloads/t180-wt-c465` 15,394,050 bytes, 627 files
- `C:/Users/nname/Downloads/t180-wt-c471` 15,572,129 bytes, 637 files
- `C:/Users/nname/Downloads/t180-wt-c483` 15,621,386 bytes, 640 files
- `C:/Users/nname/Downloads/t180-wt-c485` 15,639,268 bytes, 641 files
- `C:/Users/nname/Downloads/t180-wt-c490` 15,713,107 bytes, 649 files
- `C:/Users/nname/Downloads/t180-wt-c495` 15,755,313 bytes, 650 files
- `C:/Users/nname/Downloads/t180-wt-c502` 2,670,641,366 bytes, 7708 files
- `C:/Users/nname/Downloads/t180-wt-c506` 2,670,779,248 bytes, 7709 files
- `C:/Users/nname/Downloads/t180-wt-c509` 15,514,907 bytes, 642 files
- `C:/Users/nname/Downloads/t180-wt-c527` 15,664,161 bytes, 647 files
- `C:/Users/nname/Downloads/t180-wt-e23` 13,137,585 bytes, 573 files
- `C:/Users/nname/Downloads/t180-wt-e26` 1,575,234,034 bytes, 4323 files
- `C:/Users/nname/Downloads/t180-wt-e29` 1,575,815,759 bytes, 4330 files
- `C:/Users/nname/Downloads/t180-wt-e31` 1,575,908,612 bytes, 4333 files
- `C:/Users/nname/Downloads/t180-wt-e32` 13,725,757 bytes, 604 files
- `C:/Users/nname/Downloads/t180-wt-e33` 13,754,981 bytes, 605 files
- `C:/Users/nname/Downloads/t180-wt-e34` 1,576,189,354 bytes, 4335 files
- `C:/Users/nname/Downloads/t180-wt-e35` 13,786,768 bytes, 606 files
- `C:/Users/nname/Downloads/t180-wt-e38` 13,836,292 bytes, 607 files
- `C:/Users/nname/Downloads/t180-wt-e467` 15,540,433 bytes, 637 files
- `C:/Users/nname/Downloads/t180-wt-e473` 15,582,267 bytes, 638 files
- `C:/Users/nname/Downloads/t180-wt-e517` 26,477,679 bytes, 899 files
- `C:/Users/nname/Downloads/t180-wt-e524` 26,442,497 bytes, 897 files
- `C:/Users/nname/Downloads/t180-wt-e528` 15,622,297 bytes, 645 files
- `C:/Users/nname/Downloads/t180-wt-land412` 3,491,231,804 bytes, 4328 files
- `C:/Users/nname/Downloads/t180-wt-land413` 13,756,069 bytes, 605 files
- `C:/Users/nname/Downloads/t180-wt-land414` 14,034,473 bytes, 610 files
- `C:/Users/nname/Downloads/t180-wt-land417` 14,008,965 bytes, 617 files
- `C:/Users/nname/Downloads/t180-wt-land418` 15,245,765 bytes, 619 files
- `C:/Users/nname/Downloads/t180-wt-land419` 15,299,926 bytes, 620 files
- `C:/Users/nname/Downloads/t180-wt-lib510` 15,515,474 bytes, 642 files
- `C:/Users/nname/Downloads/t180-wt-lib512` 15,527,423 bytes, 642 files
- `C:/Users/nname/Downloads/t180-wt-lib527` 15,643,858 bytes, 645 files
- `C:/Users/nname/Downloads/t180-wt-o10-kn5` 13,997,931 bytes, 612 files
- `C:/Users/nname/Downloads/t180-wt-o11-kn5a` 13,974,481 bytes, 611 files
- `C:/Users/nname/Downloads/t180-wt-o13-kn5` 13,983,746 bytes, 611 files
- `C:/Users/nname/Downloads/t180-wt-o15-red` 13,868,870 bytes, 609 files
- `C:/Users/nname/Downloads/t180-wt-o19-before` 14,221,859 bytes, 623 files
- `C:/Users/nname/Downloads/t180-wt-o20-83eaf20` 14,155,155 bytes, 623 files
- `C:/Users/nname/Downloads/t180-wt-o21-2c13316` 14,165,175 bytes, 623 files
- `C:/Users/nname/Downloads/t180-wt-o22-f2459fe` 14,032,076 bytes, 618 files
- `C:/Users/nname/Downloads/t180-wt-o4` 13,984,550 bytes, 609 files
- `C:/Users/nname/Downloads/t180-wt-o5` 14,051,083 bytes, 611 files
- `C:/Users/nname/Downloads/t180-wt-o521` 2,736,357,889 bytes, 7726 files
- `C:/Users/nname/Downloads/t180-wt-o6-scratch` 13,952,394 bytes, 610 files
- `C:/Users/nname/Downloads/t180-wt-o7` 14,071,704 bytes, 612 files
- `C:/Users/nname/Downloads/t180-wt-o8-red` 13,964,340 bytes, 611 files
- `C:/Users/nname/Downloads/t180-wt-o9-d438` 13,971,500 bytes, 611 files
- `C:/Users/nname/Downloads/t180-wt-p402` 15,245,659 bytes, 619 files
- `C:/Users/nname/Downloads/t180-wt-p438` 13,972,514 bytes, 611 files
- `C:/Users/nname/Downloads/t180-wt-p438b` 13,972,286 bytes, 611 files
- `C:/Users/nname/Downloads/t180-wt-p438c` 13,976,601 bytes, 611 files
- `C:/Users/nname/Downloads/t180-wt-p439` 13,985,548 bytes, 611 files
- `C:/Users/nname/Downloads/t180-wt-p440` 13,990,644 bytes, 611 files
- `C:/Users/nname/Downloads/t180-wt-p443` 13,992,721 bytes, 611 files
- `C:/Users/nname/Downloads/t180-wt-p446e` 13,987,682 bytes, 617 files
- `C:/Users/nname/Downloads/t180-wt-p447` 14,004,564 bytes, 618 files
- `C:/Users/nname/Downloads/t180-wt-p447f` 14,013,340 bytes, 618 files
- `C:/Users/nname/Downloads/t180-wt-p459` 15,482,810 bytes, 626 files
- `C:/Users/nname/Downloads/t180-wt-p466` 15,503,608 bytes, 636 files
- `C:/Users/nname/Downloads/t180-wt-p468` 15,653,682 bytes, 638 files
- `C:/Users/nname/Downloads/t180-wt-p477` 15,732,755 bytes, 642 files

**The 7 t180-fresh worktrees whose tip is on origin/main** (7 removed, 105,864,845 bytes, 0 links):

- `C:/Users/nname/Downloads/t180-wt-a533` 15,048,286 bytes, 583 files
- `C:/Users/nname/Downloads/t180-wt-a536` 15,146,895 bytes, 590 files
- `C:/Users/nname/Downloads/t180-wt-a536c` 15,157,087 bytes, 591 files
- `C:/Users/nname/Downloads/t180-wt-a538b` 15,161,347 bytes, 591 files
- `C:/Users/nname/Downloads/t180-wt-e532` 15,042,546 bytes, 583 files
- `C:/Users/nname/Downloads/t180-wt-e535` 15,147,302 bytes, 591 files
- `C:/Users/nname/Downloads/t180-wt-e543` 15,161,382 bytes, 591 files

**The 12 lighthouse worktrees whose branch is fully merged into main** (12 removed, 23,602,670,060 bytes, 0 links):

- `C:/Users/nname/Desktop/worktrees/lh-o-d476-p4` 186,408,391 bytes, 10412 files
- `C:/Users/nname/Downloads/lh-wt-o-d476` 7,311,169,017 bytes, 20858 files
- `C:/Users/nname/Downloads/lh-d476-a` 184,207,447 bytes, 10181 files
- `C:/Users/nname/Desktop/worktrees/lh-d475-e` 184,230,027 bytes, 10183 files
- `C:/Users/nname/Desktop/worktrees/lh-d457-a` 173,544,339 bytes, 9782 files
- `C:/Users/nname/Desktop/worktrees/lh-d454-land-a` 172,141,853 bytes, 9733 files
- `C:/Users/nname/Desktop/worktrees/lh-d454-c` 171,930,747 bytes, 9730 files
- `C:/Users/nname/Desktop/worktrees/lh-d450-c` 169,668,173 bytes, 9633 files
- `C:/Users/nname/Downloads/lh-d424-a` 6,581,739,780 bytes, 19443 files
- `C:/Users/nname/Downloads/lh-d423-o` 8,162,882,629 bytes, 21310 files
- `C:/Users/nname/Desktop/worktrees/lh-d423-c` 155,127,202 bytes, 8902 files
- `C:/Users/nname/Desktop/worktrees/lh-d415-c` 149,620,455 bytes, 8531 files

## (b) History: the rewrite of `9f2ef50d`

**Ringed before and after.** Before: the librarian, at the start of (b); it was queued, so a commit landing mid-rewrite was left to the `update-ref` guard below.

**The backup:** `git branch backup/main-before-rewrite-2026-10-30 main` → `44e9406a` (main had moved one commit since the order was sent; 211 ahead of origin/main).

**The method:** plumbing only, `S/d564/rewrite.js`. No checkout and no worktree, so `Desktop\lighthouse`'s index and working tree were never touched.

- History over origin/main is linear (0 merges), and only `main` contains `9f2ef50d`. None of the five branches for (c) does, so a merge cannot bring it back.
- Each of the 23 commits from `9f2ef50d` to the old head is recreated in order with `commit-tree`, with its own message, author and committer (names, emails, dates) and its own tree.
- The only change: the hand-back's blob is replaced by `3200a41f`'s (`92cf77bf`) wherever it was `9f2ef50d`'s (`fd028ef7`). That was in one commit only.
- `3200a41f`'s replay therefore changes nothing, and it is kept so that the count is unchanged.

**Checked before main moved:**

    checked: new head a8c069f1's tree == old head 44e9406a's tree → true (the old head already held the clean file)
    checked: S/d564/verify.js, every pair's raw commit object with its tree and parent lines removed → 23 of 23 identical; the first new commit's parent is 9f2ef50d's (b3e58955)
    checked: git log -p origin/main..<head> | grep -c, for each of the five strings → old history 2, 2, 2, 2, 2 lines; new history 0, 0, 0, 0, 0
    checked: git rev-list --count origin/main..<head> → old 211, new 211; origin/main is an ancestor of the new head

**Moved:** `git update-ref refs/heads/main a8c069f1… 44e9406a…` → main is now `a8c069f1`. The old-sha argument would have refused the move if anyone had committed meanwhile.

    checked: git status --porcelain in Desktop\lighthouse, before and after → 87 entries, sha256 907e1ff0b3d44138 both times: IDENTICAL

**Old → new, for anyone holding an old sha:**

| old | new |
|---|---|
| `9f2ef50d` (the rewritten one) | `5edf3181` |
| `3200a41f` | `ba6efacf` |
| `94d36f07` | `33668510` |
| `44e9406a` (the old head) | `a8c069f1` |

The full map is in `S/d564/rewrite.json`. The backup ref keeps the old history until the push succeeds.

**Correction, mine:** the first build (`e73e7914`, never on main) lost the final newline of every commit message. My helper trimmed the raw object it read. `verify.js` caught it (23 of 23 differing, one byte each), I rebuilt, and main moved only to the second build.

## (c) The re-land: pushed

**Pushed:** lighthouse `310077dd..97fe6280` (235 commits, a fast-forward of origin/main).

    checked: C:\Consonance\data\push-gate.jsonl, this push's line:
    {"t":"2026-10-31T01:09:19.204Z","seat":"a2122153-a37e-41a6-a86f-534267ec0565","session":"a2122153-a37e-41a6-a86f-534267ec0565","cwd":"C:\Consonance\instances\sibling-07b8a48f","decision":"allow","scanned":[{"dir":"C:\Users\nname\Desktop\worktrees\lh-d559-land","remote":"origin","src":"97fe6280"}]}

**The landing.** The old `lh-wt-e559` (D559's merges only, clean) was removed with the junction check (193,540,850 bytes, 0 links). `d559-land` was re-cut with `git worktree add -B` at `Desktop\worktrees\lh-d559-land` from the rewritten main, and the order's five branches merged in order, all clean.

**First suite run, on `a823f1d8` (main `a8c069f1` + five branches):**

    checked: S/d564/out-1/land564.log + js-suite.out → 187 green · 1 failed · 0 crashed (of 190); 00:30:38Z → 00:50:06Z (1,168 s)

- D559's two environment reds are gone: heavy-run (C: was over 50 GB) and leftovers (the tree is under `Desktop\worktrees`).
- carrier-drift is green: its owner re-froze the set on main.
- The one red is `portable-paths.test.js`: **10 new sites, all in `consonance/tools/read-before-edit.test.js`**, the new test that `d561-c` brings. Nine are DRIVE BENIGN-TEST. One, at `:97`, is **FATAL-TEST-READ**: a fixture carrying a real `C:\Consonance\instances\…` path.

**`d561-c` (`ce4b77ab`, C's read-before-edit instrument) is REFUSED**, as the order allows for a branch whose tests go red.

- Baselining a FATAL site, or fixing C's test, is C's call, not a landing's. The tool's own advice: `--update` the baseline only for a site that is genuinely benign, and fix the FATAL one in code.
- `d562-a` does not contain it (checked), so the other four land without it.

**Second, the landing actually pushed.** `d559-land` was reset to main as it then stood (`3d150f56`; the tree was clean). Then `d553-c` (`098ac83c`), `d556-o` (`0ca3eccd`), `d557-e-tools` (`4eff4a11`) and `d562-a` (`020c4776`) were merged, all clean, giving `97fe6280`. No Rust file changed, so cargo test was not re-run, as ordered. Two briefs under `src-tauri` changed: `cargo test` last passed on D559's merge (1,371 / 0), not on `d562-a`'s brief edit.

    checked: node consonance/tools/portable-paths.js (on 97fe6280, before the suite) → green, 0 new
    checked: S/d564/out/land564.log + js-suite.out → js-suite: 187 green · 0 failed · 0 crashed · 0 silent · 1 canary · 0 sang · 1 not-run · 0 class-error  (of 189); 00:51:11Z → 01:08:38Z (1,047 s), at BelowNormal with CONSONANCE_HEAVY_SLOTS=1, from Desktop\worktrees

The canary is declared EXPECTED-RED and the not-run declared MACHINE-BOUND, as in D559.

**Before the push, over `origin/main..97fe6280`** (counts only):

    checked: git log -p | grep -cE for six key shapes (each prefix followed by a key body) → 0, 0, 0, 0, 0, 0
    checked: the private-name grep → 0 lines; each of the five strings → 0 lines (including the 11 commits other seats made on top of the rewritten head)

**After:**

- **The backup ref is deleted** (`backup/main-before-rewrite-2026-10-30`, was `44e9406a`), only after the push.

      checked: git merge-base --is-ancestor 44e9406a origin/main → no: the old history is not in origin

- **Local `main` was NOT moved.** It is 13 behind origin/main (the landing's merges) and 10 ahead (other seats' commits since `3d150f56`), and `Desktop\lighthouse` holds 90 uncommitted entries. The next landing merges `origin/main`. Fast-forwarding a shared checkout with its own new commits is what D496 warned against.
- **The two landed worktrees, removed with the junction check:** `C:/Users/nname/Downloads/lh-wt-e557` (193,164,785 bytes, 10,758 files) and `C:/Users/nname/Desktop/worktrees/lh-d559-land` (193,759,753 bytes, 10,784 files), 0 links. Then `git worktree prune`.

      checked: df → C: 78,574,301,184 bytes free (73 GiB) at the end

- **Processes:** none left running. No exe was rebuilt or swapped.

## Still open, for their owners

- **`d561-c`**: the read-before-edit test's 10 path sites, one of them FATAL. Fix it, then the next landing takes it.
- **`C:\Users\nname\Downloads\t180-wt-a538` (`d538-a`)**: two uncommitted source edits.
- **The seven detached lighthouse worktrees** named in (a).
- **Local `main`** awaits a merge of origin/main by the next landing.

SOURCES: the librarian's 18:19 ring (board), the chair's D564, git worktree list/merge-base/rev-list as quoted, S/d564/*.jsonl (dry and real), S/d564/rewrite.json, S/d564/verify.js, S/d564/out-1 and out (land564.log, js-suite.out), portable-paths.js run, push-gate.jsonl last line, df before and after
