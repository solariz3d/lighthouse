# P-D099-VERIFYREFUSE · ALPHA — the leftover was not a test's: a blind-verifier READER made scratch in its own cwd, the cell, and its `rm -rf` failed because its shell stood inside the tree; placed STAYS by name, and close --check now exits 0 on D

**Pane A, machine D, 2026-09-21 10:2x–10:4x.** Lap D099 packet A. **Two files, uncommitted:** `consonance/state-manifest.json`
(two rules) and `consonance/tools/state-manifest.test.js` (three tests). **No test file other than mine was touched,
because no test writes the artifact (§0).** Nothing in `C:\Consonance\data` was modified or deleted. **No real close was
run.** The other dirty files in the tree (`dev/shell/install.ps1`, `map/B.md`) are B's, untouched.

## 0 · CAUSE — who wrote `_verify_refuse/`, and when

**Not a test and not a tool.** `grep -rn _verify_refuse` over `consonance/` and `dev/` (.js .rs .ps1) finds nothing, and
`git log --all -S_verify_refuse` finds only today's librarian note. The writer is in a transcript:

    node <scratchpad>/d099/who.js     (read-only over ~/.claude/projects/C--Consonance-data-vantage-cell/*.jsonl)
      == 288d78a5-…jsonl · 99 records · 2026-09-10T15:13:27Z → 15:17:22Z · cwd C:\Consonance\data\vantage_cell
         first prompt: "You are a blind verifier. A shipped sentence claims: … a transform that REFUSES is installed anyway …"
         15:14:23Z  Bash: mkdir -p …/vantage_cell/_verify_refuse && cp …/state-sync.js …/state-manifest.js …/state-sync.test.js …
         15:14:33Z  Bash: cd …/_verify_refuse && mkdir -p consonance/tools && mv state-*.js consonance/tools/ && … && cd consonance/tools && node state-sync.test.js …
         15:17:22Z  Bash: cd /c/Consonance/data/vantage_cell && rm -rf _verify_refuse
                    → "rm: cannot remove '_verify_refuse/consonance/tools': Device or resource busy"
      == 6e17178d-…jsonl · 2026-09-12 · another blind verifier — only LISTED the leftover (15:10:21Z `ls`)

**So:** a blind-verifier reader, launched by `second-vantage.js` with the cell as its working directory
(`second-vantage.js:109` puts the cell under the data dir, `:194` runs readers with `cwd: CELL`), improvised a scratch
copy to mutation-test a claim. It `cd`'d into the copy, and the Bash tool's cwd persists. **Its own shell was still
standing inside `_verify_refuse/consonance/tools` when it ran `rm -rf`**, and Windows will not remove a directory a live
process has as its cwd. The files went and three empty directories stayed. The on-disk stamps agree: the directories
were created 2026-09-10 09:14:24 and 09:17:22 local (15:14Z/15:17Z).

**It is the same writer class as L068's `mutants-run.log`**: a process whose cwd is the cell, leaving output in it. Two in
eleven days. The first blocked every close for about a week before a seat named it.

## 1 · THE FIX, and why this one

**The packet's preferred shape, "the test cleaning up", does not apply: there is no test.** The writer was a model with a
shell, improvising. So:

- **Chosen: a STAYS rule, named by this directory.** `vantage_cell/_verify_refuse` and `vantage_cell/_verify_refuse/**`,
  both STAYS, the first naming the writer, the session, the failed `rm`, and that it is a SHELF: once the tree is deleted
  the rule reads "declared, not present" and should come out. It is named rather than `vantage_cell/**`, as at L068, so
  the next leftover of a different name still refuses loudly (a test pins it). `/**` covers the tree's contents because
  the directory itself is the named thing; a mutant pins `/**` against `/*`.
- **Not chosen, and why:**
  - **Delete the tree.** It is the honest end state: three empty directories nothing reads. But removing things from
    the data dir is not a seat's act (L066: the librarian moved files there at the keeper's word). **Proposed for the
    keeper**; the rule says to remove itself after.
  - **`vantage_cell/**` STAYS.** It would stop every future reader leftover from blocking a close. Nothing in the cell
    should ever travel, so the class would be right. But it is the wildcard shape this manifest refuses in writing, and
    it would silence the one signal that found both leftovers. It is the keeper's choice if the refusals cost more than
    they catch.
- **The class fix belongs to someone else:** readers should not have a working directory **inside the data dir** at all.
  A cell under `os.tmpdir()` (or anywhere outside what `state-manifest.js` walks) would make every reader's scratch
  invisible to the close by construction. `second-vantage.js:109` and `:189` are not mine; named for their owner.

## 2 · RED FIRST, THEN GREEN — the command beside every number

    node consonance/tools/state-manifest.test.js
      BEFORE                        27 passed, 0 failed
      RED (3 new tests)             28 passed, 2 failed
        FAIL D099: the shipped manifest places the empty _verify_refuse tree as STAYS
        FAIL D099: a file a reader leaves inside _verify_refuse is STAYS too
        green at red ON PURPOSE (control): D099: a DIFFERENT scratch directory in the cell is still UNPLACED
      GREEN                         30 passed, 0 failed

    node consonance/tools/state-manifest.js        (live data dir)   exit 0   (before: exit 1, UNPLACED 3 — the three directories)

    node consonance/tools/close.js --check         (run plainly, no pipe)
      BEFORE   NOT CLOSED — REFUSED_UNPLACED · vantage_cell/_verify_refuse, …/consonance, …/consonance/tools · EXIT=1
      AFTER    CHECK ONLY — every gate passed and NOTHING WAS PUBLISHED · 64 files · 77.2 MB · privacy PRIVATE ·
               the remote already holds this tree's HEAD (f70d50a) · EXIT=0

    the manifest's other consumers:   node consonance/tools/state-sync.test.js  78 passed, 0 failed
                                      node consonance/tools/close.test.js       30 passed, 0 failed

## 3 · MUTANTS — on copies; the live files hashed before and after

    node <scratchpad>/d099/mutants.js
      pre-flight 30/0 · 7 listed · 7 killed · 0 survived · 0 NOT APPLIED · live files unchanged: true
        the directory rule removed (28/2) · the contents rule removed (28/2) · the tree classed TRAVELS (29/1) ·
        the contents classed TRAVELS (28/2) · widened to every _verify_* dir (29/1) · widened to the whole cell (28/2) ·
        the contents rule at one level, * not ** (28/2)

## 4 · WHAT I DID NOT VERIFY

- **That the tree can now be deleted.** The busy cwd belonged to a process that ended on 09-10, so it very likely can,
  but I did not try: deleting is not mine (§1).
- **Machine L.** L's cell was not checked. L's close also stays under the chair's HOLD (`bc3f2a1`).
- **The js-suite** was not run; only the three suites above.
- **`state-sync.test.js` 78/0 is D's HEAD copy.** My L070 fast-forward change (89 tests) is on L's disk only, and its
  correction (`ead6e8d`) is still open.

NEXT: librarian re-run §2's close --check and the manifest test, then route §1's delete-the-tree and cell-outside-the-data-dir to the keeper, when this file is read
