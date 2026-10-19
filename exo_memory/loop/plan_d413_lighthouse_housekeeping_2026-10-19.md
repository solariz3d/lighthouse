# D413: lighthouse housekeeping, now (librarian, 2026-10-19 07:5x)

**The keeper (07:52):** "O and P pane found housekeeping to be done asap for lighthouse". Both new panes named the same weight (their transcripts, 13:50-13:51Z): 131 dirty paths, over 100 of them uncommitted hand-backs, the last commit 18 h old, and 45 commits unpushed since 2026-10-13. Under the 07:36 freeze this is work the room owes, not a new feature.

**Pane:** O, while its D412 suite runs. Nothing here needs the heavy-run lock except the one js-suite test in step 3, which queues as usual.

**What is there (checked 07:5x):**
- `git status --short -uall`: 717 paths (124 untracked entries, 7 modified), about 17.6 MB.
- Of that, 16.4 MB is one file: `exo_memory/handback/p-d411-P_2026-10-19_evidence/out/consonance-13b7d3b4.tar`.
- main is 45 ahead of origin/main. The top four are c70d42a4, b431b2d0, 13b7d3b4 (the Ponytail fork, D387, HELD for D411's verdict at the keeper's word) and 37369e08 (D390, on top of them, not Ponytail).

**Steps:**
1. **Credential scan** over every path to be committed: the room's scan, 0 hits required. A hit stops the step and comes to me. Personal details are not a stop (privacy means credentials only).
2. **Hold Ponytail apart, reversibly:**
   - `git branch hold/ponytail-d387 37369e08`.
   - Then move main back to dfe05087 with `git reset --keep dfe05087` in the main checkout. `--keep` refuses if it would touch an uncommitted change, so the 700 uncommitted paths stay as they are. Never use `--hard`. Then cherry-pick 37369e08 (D390, js-suite.js only) onto it.
   - Other seats write into this checkout while you work (notes, hand-backs). Don't stash, clean, or check out over their files.
   - Check: `git diff 37369e08 <new main> -- consonance/tools/js-suite.js` is empty, and the fork's files are absent from main (`git ls-tree` for consonance/src-tauri/brief/ponytail*).
   - Show `git log --oneline origin/main..main` and `git log --oneline main..hold/ponytail-d387` before going on.
3. **Run D390's tests on the new main:** `js-suite.test.js` and `gen-consumer.test.js` under the lock, plus portable-paths.
   - The fork's own tests (consumer-fork-wiring) are not on main now. Show that no test on main names ponytail (grep).
4. **Commit by named paths, in groups, each message in our own words, saying which seat wrote the files:**
   - the hand-backs and their evidence, EXCEPT the live laps' folders (p-d407-*, p-d411-*, p-d412-*, which their panes commit when they hand back) and never any .tar;
   - the panes' maps (each file is its own pane's);
   - the loop plans;
   - `exo_memory/third_place/` (the Third Place seat's own files);
   - `exo_memory/librarian/` (the librarian seat's notes).
5. **Push main to origin** under the standing permission, through the push gate, after the scan. hold/ponytail-d387 stays local.
6. **Hand back** `exo_memory/handback/p-d413-housekeeping-O_2026-10-19.md`:
   - what was committed (counts per group);
   - what was left and why;
   - the scan line;
   - the push-gate line;
   - `git status --short | wc -l` after.

**Not in this lap:** the stale-lap list in the pulse (D277, D333, D334 and 9 more) and the "unreceived" ring row. Those go in the keeper's inventory as decisions, not deletes.

NEXT: chair send D413 to O now; O hands back to the librarian when the push is done.
