# p-evidenceskip-A — D287 follow-up: js-suite skips the evidence copies; seat A, 2026-10-10

Worktree `G:\consonance-worktrees\a-d287b-wt`, branch `d287-a2` from main `8b09b16e`. **One commit, local, named paths, not pushed: `3ef25252`** (`consonance/tools/js-suite.js`, `consonance/tools/js-suite.test.js`; +39 −1).

## What changed
- `discover()` skips any directory whose name **ends in** `_evidence` (beside `attic` in the skip rule). It counts the `*.test.js` files inside (`countTests`) so the skip is printed. The copies' bytes and names are untouched.
- `--list` ends `N test files (M test files skipped under *_evidence)`; the universe print adds `M test files skipped under *_evidence directories (copies kept as records, not run).`

## Checks (all run this turn)
- **Red first:** two new rows in `js-suite.test.js` run against the old `js-suite.js` → `js-suite-self: 43 passed, 2 failed` (the old runner listed and ran `foo_evidence/old.test.js`, a FAIL fixture). After the change → `45 passed, 0 failed`.
  - Row 1: a failing `x.test.js` under `foo_evidence/` (and one nested deeper) is not listed; `foo_evidencex/b.test.js` still is; 2 files total.
  - Row 2: a run over a tree with only failing evidence copies exits 0, prints `2 test files skipped under *_evidence` and `1 test files discovered`.
- **Mutants (2 applied / 2 caught / 0 NOT APPLIED):** `endsWith` → `includes` (row 1 red); drop the `countTests` count so the skip is silent (row 2 red). File restored byte-for-byte from a saved copy, `git diff --stat` shows only my two files.
- **Real tree:** `node consonance/tools/js-suite.js --list | tail -2` → `174 test files (922 test files skipped under *_evidence)`. 922 matches the chair's figure (`git ls-files | grep _evidence/ | grep -c '\.test\.js$'` → 922).
- Not run: the full js-suite (the change is discovery only, and a full run is the collator's), cargo.

## Which other walkers see the 922 (reported, nothing fixed)
- **portable-paths.js: does not.** Its universe is `git ls-files` under SCOPE_IN (`consonance/…`, `dev/…`, `jev/`), and `exo_memory/handback` is not in it; `git ls-files | grep _evidence/ | grep -c '^consonance\|^dev'` → 0. `portable-paths` prints `universe: 337 code`.
- **carrier-drift.js: sees the evidence folders' prose, not the tests.** It walks the filesystem for `.md`/`.html` and skips only `.git node_modules target gen __pycache__`; `git ls-files | grep _evidence/ | grep -c '\.\(md\|html\)$'` → 195 files. It is GREEN with them present, so nothing breaks; whether it *should* read copied prose is a separate call. (Its JS test files are not read, `SCAN_EXTS = ['.md', '.html']`.)
- **gen-consumer staging: does not.** `--dry --json` → staged 406, leaks [], same count as before the follow-up (evidence is not in the consumer).
- **Mutants harnesses:** the five that walk directories (`close`, `heavy-run`, `state-sync`, `trip-check`, `union-at-launch`) have 0 mentions of `handback` / `exo_memory`; I did not run them.
- **Not checked:** other tools that call `readdirSync` over the repo root, any `.ps1` walker, the Rust side.

## On the ruling
I looked for a reason to argue it wrong and did not find one: the copies are records of what was run at the time, names must stay, and a suffix test is the cheapest rule that leaves `foo_evidencex` alone. One limit worth knowing: a *new* hand-back evidence folder named differently (say `_evidence2` or `evidence/`) would be walked again; the rule is the suffix and nothing else.

NEXT: chair cherry-pick 3ef25252 onto main and run the full js-suite once (the 922 should no longer appear in its universe line)
