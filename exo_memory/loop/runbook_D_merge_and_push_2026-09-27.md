# Runbook — the desktop merges origin and pushes its 09-26 work. For the next desktop session.

*Written by pane B on L, 2026-09-27 (lap L121), from the plan `loop/plan_label_rule_and_push_2026-09-27.md` (443ae45),
chunk 3. **Nothing here has been run against the desktop's real commits.** Every command is relative to the repo root
of the desktop's checkout. There are no machine paths in this file on purpose.*

**What the situation is.** `origin/main` was `5ced140` when the laptop's night began. The laptop pushes its work on top of
it (chunk 2), including a `.gitattributes` rule that marks three families of append-only notes `merge=union`. The
desktop has its own unpushed commits on top of `5ced140` from 09-26 (at least `4a00947`…`b214e3a` and `cc1135d`; ASK-007,
retrieval). Both machines appended to the same notes. **This runbook merges origin into the desktop's `main`, checks
it, and pushes only at the keeper's word.**

**The one trap to know before starting** (proven in a throwaway repo, `handback/p-l121-merge-B_2026-09-27.md` §3, case P2):
git reads merge attributes from the checkout DOING the merge. The desktop's checkout predates the rule, so a plain
`git pull` still conflicts on every appended note, even though origin carries the rule. Step 3 fixes that locally
before the merge.

**The second trap, found by dry-running this runbook** (hand-back §3, the dry run): in **Git Bash on Windows**, an argument
like `origin/main:.gitattributes` gets rewritten into a Windows path (`origin\main;.gitattributes`) before git sees it.
The `git show` fails, the pipe carries nothing, step 3 adds no rule, and the merge conflicts exactly as if this runbook
had not been followed. So every `<ref>:<path>` command below starts with `MSYS_NO_PATHCONV=1` in Git Bash. In
PowerShell, drop the prefix: the form works there unchanged (checked on L).

## 0 · Before anything

- The keeper is present. This ends in a push, which is outward and his call (COMMITTEE.md, "Nothing is pushed by a
  seat"). The seal-row exception does not cover it.
- No seat is writing into this checkout. Close Consonance, or at least confirm no pane is mid-edit. A merge that runs
  under a live writer is the collision the commit rule exists for.

## 1 · Record where the desktop stands

    git status --short                      # expect nothing, or only files you can name
    git log --oneline origin/main..HEAD     # the desktop's own unpushed commits; expect 4a00947…b214e3a, cc1135d among them
    git rev-parse HEAD                      # write this sha down: it is the way back

If `git status` shows changes you did not make, stop and find out whose they are before merging.

## 2 · Fetch, and check that origin carries the laptop's push

    git fetch origin
    git log --oneline HEAD..origin/main | wc -l            # the laptop's commits (about 29, more if chunk 2 added some)
    git merge-base HEAD origin/main                        # expect 5ced140…
    MSYS_NO_PATHCONV=1 git show origin/main:.gitattributes | grep -c "merge=union$"   # expect 3

If the last count is 0, the laptop's push has not landed yet. **Stop.** Merging now gives the conflicts this runbook
exists to avoid.

## 3 · Put the union rule in THIS checkout before merging

    MSYS_NO_PATHCONV=1 git show origin/main:.gitattributes | grep "merge=union$" >> .git/info/attributes
    git check-attr merge -- exo_memory/map/M.md exo_memory/librarian/LEDGER.md
    #   expect:  exo_memory/map/M.md: merge: union
    #            exo_memory/librarian/LEDGER.md: merge: unspecified

`.git/info/attributes` is local and untracked. It is removed again in step 8, once the merged tree carries the same lines.

## 4 · A way back that costs nothing

    git branch backup/D-before-merge-<today> HEAD

## 5 · Merge (a merge, not a rebase: the desktop's commit shas are already named in the record)

    git merge --no-ff origin/main

Put in the merge commit body who ran it (the seat, not the model). Name the two sides: the desktop's 09-26 commits and
the laptop's night.

## 6 · The conflict check

    git diff --name-only --diff-filter=U        # every file still in conflict

- **A union file listed here** (`exo_memory/map/?.md`, `exo_memory/librarian/2026-*.md`,
  `exo_memory/third_place/2026-*.md`) means step 3 did not take. `git merge --abort`, re-check step 3, and start again.
- **A dated note that is not union** (`exo_memory/journal/…`, a `loop/` document, a hand-back): open it. If both sides
  only added sections, keep both **in time order**, remove the markers, and `git add <that path>`. If both sides changed
  the same existing sentence, that is a real disagreement: keep the one the record's master supports, and say which in
  the merge body.
- **`exo_memory/librarian/LEDGER.md`** is edited in place (4 tail appends, 36 mid-file inserts and 26 in-place edits in
  its history). Resolve it by hand, row by row. Never union it.
- **Code, JSON, JSONL, `.gitattributes` itself, or the brief (`consonance/src-tauri/brief/…`)**: do not guess.
  `git merge --abort` returns the tree to step 4 exactly. Bring the file to the librarian.
- Then confirm nothing is left:

      git diff --name-only --diff-filter=U        # expect nothing
      git grep -n -e "^<<<<<<< " -e "^>>>>>>> " -- exo_memory consonance   # expect nothing

## 7 · Read what union did (it never tells you)

Union keeps both sides' lines and raises no conflict, even when both machines edited the same line. The throwaway
repo's case N1 shows both versions of a corrected line surviving side by side. So read the merged notes:

    git diff backup/D-before-merge-<today>..HEAD --stat -- exo_memory/map exo_memory/librarian exo_memory/third_place
    git diff backup/D-before-merge-<today>..HEAD -- exo_memory/map exo_memory/librarian exo_memory/third_place

Look for two near-identical lines next to each other (an in-place edit on both sides) and fix them by hand. **Expect
one cosmetic effect:** where both sides began an entry with the same blank line, union keeps one shared blank line, so
two new entries can sit with no blank line between them (case P1). That loses nothing.

**The laptop's recovered table** (`loop/retrieval_located_rows_recovered_2026-09-27.md`) was rebuilt from a
transcript while the desktop's 09-26 masters were out of reach. Its name is unique, so it merges without conflict, but
**where it and the desktop's masters disagree, the masters win** (plan, chunk 3). Say so in the merge body, or in a dated
note beside it. Do not rewrite it.

## 8 · Tidy, then the suite

    MSYS_NO_PATHCONV=1 git show HEAD:.gitattributes | grep -c "merge=union$"     # expect 3; the tree now carries the rule itself
    # then delete the three lines step 3 added from .git/info/attributes

    node consonance/tools/js-suite.js          # in the background; it takes minutes, and it names its canary
    node consonance/tools/carrier-drift.js     # compare with the desktop's count before the merge, not with zero
    node consonance/tools/portable-paths.js
    node consonance/tools/text-census.js

If the merge touched `consonance/src-tauri/src/`, also run `cargo test --bin consonance` in `consonance/src-tauri`,
with its own target dir, and do not rebuild the running app. Compare each red with the same tool on
`backup/D-before-merge-<today>`. A red that exists on both sides is not the merge's.

## 9 · Push, at the keeper's word only

Ask him in plain words, and quote his answer on the board before pushing.

    git push origin main
    git rev-list --count origin/main..HEAD      # expect 0
    git log --oneline -1 origin/main            # the merge commit

Then both machines and GitHub agree. The laptop pulls it at its next launch.

## If it goes wrong

- **During the merge:** `git merge --abort`. The tree is exactly as in step 4.
- **After the merge, before the push:** the backup branch holds the old `main`. Moving `main` back discards the merge
  (`git reset --hard backup/D-before-merge-<today>`), so ask the keeper first. Nothing has left the machine.
- **After the push:** do not force-push. Fix forward with a new commit, and tell the laptop.
