# Plan: clean up after ourselves (librarian, 2026-10-24 08:0x)

Opened at the keeper's 07:59: "need to journal to make that never happen again, also there have been other areas we
havent been diligent cleaner". Journal: `exo_memory/journal/2026-10-24.md`. Rule: BUILDING.md, "Leave the machine as you
found it".

Tier: prove it (it deletes). Two parts. Nothing is deleted until the keeper has said yes to the list.

## Part 1 — the inventory (one pane, read-only; the chair names it, not O, P or the landing pane)

For each item, give a path, its size, its last write, and a verdict: **ours-done**, **ours-live** (a branch or lap still
open, naming it) or **his** (anything of his: his tracks, saves, AC folder, a private side project, his own folders).
1. Every registered t180 worktree (80 at 08:0x). For each: its branch, whether that branch is merged into local-0.4.17
   (1e436f6) or later, and whether the tree is clean.
2. Every `t180-*` entry in Downloads that is not a worktree (77). For each: is it a clone (`.git`), what it holds,
   and whether anything in the record still names it (`grep -rl` over exo_memory).
3. The scratchpads under `%LOCALAPPDATA%\Temp\claude\`: size per instance.
4. `%TEMP%`: Chrome or puppeteer profiles, `scoped_dir*`, and other leftovers from our runs.
5. Fake AC roots at drive roots (`C:\fake-*`) and exported test tracks anywhere outside a scratchpad.
6. Untracked files in the shared lighthouse checkout (the dirty count was 62 at 07:59), sorted into "hand-backs to
   commit" and "other".
7. Long-running processes started by us that are not infrastructure (the stick-waiter, world-sense and Consonance itself
   are infrastructure).
8. The git branches in t180 that are merged and have no worktree.

Output: a table per item and the totals, in the pane's hand-back, plus a proposed delete list with the bytes it frees.
**Delete nothing in part 1.**

## Part 2 — the clean (after the keeper's one yes to the list)

- Back up anything not already in git to one dated folder (list plus sha256), then delete it. Worktrees go through
  `git worktree remove`, never `rm`; then `git worktree prune`.
- Never touch `Desktop\t180-track-builder`, his tracks, his saves, or his AC folder.
- Afterwards: the counts again, and the bytes freed.

## Part 3 — so it stays clean

A pane builds `consonance/tools/leftovers.js`, an instrument that prints the counts above (tab proxies, worktrees,
non-worktree `t180-*` folders, `C:\fake-*`, our long-running processes). The landing hand-back carries its output, and
the pulse can read it.

NEXT: chair name an inventory pane for part 1 when this ring lands; then the librarian brings the keeper one delete list
to say yes to.

## The keeper's yes, and part 2 ruled (librarian, 2026-10-24 08:4x)

C's inventory: `exo_memory/handback/p-d450-cleanup-inventory-C_2026-10-24.md` (git-blob e0fbfcab…, 43,483 B).

**The keeper, 08:4x:** to G1–G6 and the 3 merged branches, "1 but please make sure everything that is deleted is meant to be so". On his own folders he said yes to all four: `Documents\t180b_untitled`, the AC track `t180b_test_oval`, the 2 Desktop `ELYSIUM (T-180 track).before-*.zip`, and the 5 Desktop-repo worktrees t180-wt-e19, e20, e21, e22 and e24.

**Kept, by my ruling:** `Downloads\t180-tutorial` (the tutorial video treatment, draft 1, 10-22) and `Downloads\t180-handoff` (the Third Place's catch-up of 10-15). Both are documents, not leftovers. Also kept: everything ours-live, his tracks, and the Third Place's scratchpad.

**"Meant to be so" becomes a second pair of eyes. Part 2 runs in two seats:**
1. **The verifier (not C, and not the deleter).** It reads every path in g1.paths, g2.paths, g4.names, G5, g6.paths, the 3 branches and the 9 items of his, and re-derives each verdict from scratch at the time of its read:
   - a worktree: clean, with its head an ancestor of local-0.4.17/0.4.18 or 0 patches not landed in `git cherry`, and no lap open naming it;
   - a folder: what it holds, and that no open lap or plan names it;
   - a TEMP entry: not open by any running process;
   - his items:
     - t180b_untitled and t180b_test_oval are builder-made (the t180b_ prefix and their files);
     - his own ELYSIUM zip is present and unchanged beside the two .before zips;
     - e19–e24 are clean and merged.
   Output: one list of the paths that pass and one of those that do not, each with its reason. A path that fails is not deleted, and the librarian rules on it.
2. **The deleter**, after the librarian has read the verifier's lists:
   - back up every non-git text file and his 4 items to one dated folder outside Downloads, with a sha256 list;
   - re-check links right before each remove;
   - remove worktrees with `git worktree remove` in their own repo (e19–e24 inside `Desktop\t180-track-builder`, by his yes; that is the only write there), then `git worktree prune`;
   - delete branches with `git branch -d` only;
   - afterwards, the counts again and the bytes freed by `du`.
- Also owed, separately: a `.gitignore` rule in lighthouse for exported tracks (`**/fakeac/`, `**/tracks/*.kn5`, `**/out/`), so 6.0 GiB of kn5 can never be committed by a whole-folder add.
- The live items (D447's fakeac, o18–o22, land418, e43, P's open trees, a29's parked d407b-a) wait for their laps to file.

NEXT: chair name a verifier pane for part 2 step 1 when this ring lands; then the librarian reads its lists and names the deleter.

## B's lists ruled; the deleter named (librarian, 2026-10-24 14:0x)

B's verify: `exo_memory/handback/p-d450-verify-B_2026-10-24.md` (49,764 B). **PASS 156 (38.75 GiB apparent), FAIL 94 (12.43 GiB).**
- Every entry of C's 250 is in exactly one list, and none of the 21 kept items is in PASS.
- The walk found 0 links and 0 read errors; nothing is held open.
- His zips are present and unchanged (§6). The `.before-scifi` zip matches its recorded prefix only.

**Delete: B's PASS list, all 156, and nothing else.** It includes:
- his 7 items: t180b_untitled, t180b_test_oval, and e19, e20, e21, e22, e24 in the Desktop repo;
- branch land-0.4.8.
His zips are confirmed and stay.

**FAIL stays.** Each class is ruled:
- **Open lap, named by a plan, live tool, held tree, patches not landed, merge in progress** (o6-scratch, o10/o11/o13-kn5): kept until their laps file. Several of those laps have in fact landed while their rows still read open (D403, D437, at least). Fixing the stale rows is its own small lap. It is not done by widening this list.
- **The 11 trees dirty only with untracked test copies** (a34–a37, e27, e28, o2, o12, o14, o16, o17): **released.** Back up each untracked file first, with sha256 in the list, then `git worktree remove`. Their only content is one stray test copy, and the backup keeps it.
- **t180-d358, t180-d364:** released once B's file, which now records his zip digests, is committed in lighthouse. Re-check that commit before removing them.
- **G4's 25 not-ours entries** (24 Chrome `Cr24` uuid `.tmp` files and `node-compile-cache`): **struck from the list.** They are not ours, and the keeper did not say yes to them. Correction to C's inventory: inv345.js's `d\d{3}` pattern caught them by accident.
- **Branches d427-a, d446-e:** kept. `-d` refuses them against HEAD docs/readme-0.4x, and `-D` is not ours to use. Their content is in local-0.4.17.

**The deleter: pane E.** E is neither C (inventory) nor B (verifier).
- **Start after A's 0.4.18 hand-back is in**, so no worktree remove or prune runs in the t180 repo while A builds there.
- **Run under B's `lowio.ps1`** (BelowNormal, I/O priority very low, background mode), in small batches with pauses, as B did.
- **Before each remove:** re-check that the path is a clean registered tree, has no junction inside, and that no process holds it (B §5). If anything has changed since B's run, skip the path and list it.
- **Backup** to one dated folder `C:\Users\nname\t180-cleanup-backup-2026-10-24\`, with a sha256 list:
  - every file not in git that is text or under 5 MB;
  - his 4 items whole.
  - C:\build's target dirs and exported kn5/dds are rebuildable and are not backed up.
- **Worktrees:** `git worktree remove` without `--force`, then `git worktree prune`. e19–e24 are removed in `Desktop\t180-track-builder` by his yes of 08:4x; that is the only write in that repo. t180b_test_oval is removed in his AC folder by his own item, after its backup.
- **Branch:** land-0.4.8 with `git branch -d` only.
- **Hand-back:** the counts again (worktrees, `t180-*` in Downloads, TEMP, C:\build), the bytes freed by `du`, and every skipped path with its reason.

**Also owed (unchanged):** the `.gitignore` rule for `**/fakeac/`, `**/tracks/*.kn5`, `**/out/`, and part 3's leftovers.js. Both go to C after the clean.

NEXT: chair dispatch E as the deleter per this section when A's 0.4.18 hand-back is in; then the librarian reads E's counts and gives the keeper the all-clear.

## E's delete verified; one error of mine about his zips (librarian, 2026-10-24 16:1x)

E's hand-back: `exo_memory/handback/p-d450-delete-E_2026-10-24.md` (git-blob 7f7ed683…, 8,239 B). 168 of 169 removed, 0 errors. du freed 35.07 GiB, and the backup holds 5.47 GB.
- checked on disk by the librarian:
  - `/c/build` is absent;
  - `t180-*` in Downloads → 75;
  - Downloads repo worktrees → 51;
  - Desktop repo → 86;
  - `Documents\t180b_untitled` is absent;
  - the backup's SHA256SUMS.txt has 54,560 lines;
  - C: has 115G free.
- **Skipped, rightly:** t180-wt-e21. E's D402 audition tools read it live, outside exo_memory, where B could not see them. It goes when D402 is filed; D402's row is stale, since D402 landed in 0.4.18.

**My error.**
- The keeper's 08:4x yes included **the two `ELYSIUM (T-180 track).before-*.zip`**. This plan's own line 49 says so.
- The verifier's job for them was to confirm that his own ELYSIUM zip is present and unchanged *beside* them, before they go.
- B read that as "confirm, keep" (§5), and my ruling repeated it ("His zips are confirmed and stay"). I then told the keeper they "stay, you'd asked that they be confirmed, not deleted". That was wrong.
- They are still on the Desktop: before-d364 108,528,781 B and before-scifi 101,621,352 B. His master zip is unchanged (765f20de…), re-hashed by E after the delete.
- **Because I told him the opposite, I am asking him again before anyone deletes them.**

Still owed to C: the `.gitignore` rule and part 3's leftovers.js, with a positive control for the proxy count.

## Part 3 read; D450 closes once his zips are answered (librarian, 2026-10-24 16:3x)

C's hand-back: `exo_memory/handback/p-d450-part3-C_2026-10-24.md` (git-blob 458c73e5…, 16,053 B). Lighthouse branch d450-c: 1a2245f8 (.gitignore) and fe247273 (leftovers.js, its test, the BUILDING.md "The count." bullet).
- checked: `node --test consonance/tools/leftovers.test.js` in lh-d450-c → 4 pass, 0 fail.
- checked: the .gitignore diff adds `*.kn5`, `**/fakeac/` and `exo_memory/handback/**/tracks/`. I accept C's ruling against `**/out/`: 691 tracked files sit in 12 `out/` folders.
- C's mutants (13/13/0) are as reported; I did not re-run them.

**The proxy count stays UNCALIBRATED.**
- C tried seven ways to make a control proxy, and Explorer made none.
- C's timing (A's 0 at 13:58:11.346Z, the very second Explorer restarted) makes the "blind counter" reading of A §5 unlikely. Inferred: it was a race, and A's later 0s on `--headless=new` runs may be real.
- The journal's falsifier ("the tab-proxy count after a page run is in some hand-back") is now met only as UNCALIBRATED until a real proxy is seen.

**C's finding, acted on:**
- Five `tail -F` processes from 10-14 (seat sibling-07b8a48f, watching its old task output) had parents that are all gone.
- checked: the parents of 23480, 24920, 18332, 26792 and 15860 are not alive. I stopped all five; `Get-Process tail` → 0. They were readers, so no file changed.

**To land:** d450-c into lighthouse, by the chair as for any tool commit. C's hand-back, its evidence and map/C.md go by named paths.

**D450 closes** when his answer on the two ELYSIUM .before zips is in and acted on, and t180-wt-e21 is noted as waiting on D402's filing.

## The push refusal ruled: rewrite the unpushed range, as at D413 (librarian, 2026-10-24 16:4x)

C's refusal: `exo_memory/handback/p-d450-part3-C_2026-10-24.md` § "The lighthouse push: REFUSED" (git-blob 41d1d9a3…).
- The one line is mine: this plan's :12 named the private side project by name, in commit 5b9ec3fe. C was right to stop.
- At HEAD it now reads "a private side project", in the working file (this commit).

**Ruled: rewrite origin/main..HEAD, as D413 did** (`exo_memory/handback/p-d413-housekeeping-O_2026-10-19.md` § "The scrub"). That incidental mention was renamed "a private side project" through the unpushed history, so the same is done here. Allowing it would undo the 10-19 scrub's purpose. **Pane C, tier prove it:**
0. Announce a commit freeze on lighthouse main through the chair, and wait until every seat has acknowledged it.
   - Make the backup branch `backup/pre-scrub-2026-10-24` at the current tip. It is local only, with no upstream, and is never pushed.
1. Plumbing only, as O did: give each commit 5b9ec3fe..HEAD a temporary index.
   - Rename the name to "a private side project" wherever it appears in an added line.
   - Keep author, committer, dates and messages. The working tree and the real index are not touched.
   - Move main once, with `git reset --keep`.
2. **Checks:**
   - Every rewritten commit against its original: the diff is identical except for that one phrase, and the commit object minus tree/parent is byte-identical.
   - `git log -p origin/main..main` → 0 lines naming the project.
   - The sha-map goes in the evidence.
3. **Rebase the open lighthouse worktree branches** that sit on the old shas, or list them.
   - A landing from an old sha would bring the line back; D413's risk note (librarian/2026-10-18.md:271) applies.
4. Lift the freeze. Then push, after push-gate's own scans.

A seat that committed after 5b9ec3fe still has its commit, under a new sha; nothing it wrote is lost. **The keeper is told and may veto before step 1.**
