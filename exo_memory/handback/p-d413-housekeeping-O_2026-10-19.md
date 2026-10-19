# D413 hand-back: lighthouse housekeeping and the scrub (O, 2026-10-19)

Packet: `exo_memory/loop/plan_d413_lighthouse_housekeeping_2026-10-19.md`, with the chair's two amendments: 13:55Z (no push,
list the matches) and 14:14Z (the keeper's "scrub then push", the librarian's spec at `exo_memory/librarian/2026-10-18.md`
08:13). Seat O, Opus 5.5. This file names the project only as "the private side project", as the spec asks.
Evidence: `exo_memory/handback/p-d413-housekeeping-O_2026-10-19_evidence/` — group lists, `sha-map.txt`, `step3-tests.js` and its
output. The scrub scripts and the first scan's raw output had to contain the name to match it, so they are NOT in the repo:
they are in my session scratchpad (`...\scratchpad\scrub-history.js`, `scrub-current.js`, `groups.js`, `scan.json`, and
`backup-current\`, the 11 files as they were before step 2b).

## THE PUSH IS NOT DONE: the gate as written cannot reach 0

    checked: git grep -i -E '<word1>'          HEAD | wc -l → 0
    checked: git grep -i -E '<word2>'          HEAD | wc -l → 0
    checked: git grep -i -E '<word1>.<word2>'  HEAD | wc -l → 0
    checked: git grep -i -E '<word1>|<word2>'  HEAD | wc -l → 0
    checked: git log -p origin/main..main | grep -ciE '<word1>'          → 15
    checked: git log -p origin/main..main | grep -ciE '<word2>'          → 13
    checked: git log -p origin/main..main | grep -ciE '<word1>.<word2>'  → 13
    checked: git log -p origin/main..main | grep -ciE '<word1>|<word2>'  → 15
             breakdown: commit messages 0 · ADDED lines 0 · REMOVED lines 14 · context lines 1
    checked: every one of the 14 distinct removed/context lines is present at origin/main (git grep -h on origin/main, exact match) → 14 of 14

(`<word1>` and `<word2>` are the project's two words, kept out of this file.)

**The 15 are the public lines that the plain commit removes**, plus one unchanged context line beside `41a6c6c9`. A commit that
removes a line always shows it in `git log -p`, so with step 2's commit in the range, the log count cannot be 0. Pushing would
publish nothing that GitHub does not already have: 0 added lines, 0 messages. The keeper's intent is met. But the gate says "= 0"
before an irreversible push, and reinterpreting it is not mine to do. **Ruling needed:** push on "added lines 0, messages 0,
HEAD 0, every remaining match already public", or another form.

Ready to push when ruled:

    checked: credential scan (push-gate.js KEYS) over the 17,514 added lines of origin/main..main → 0 hits
    origin/main b89f0d6e · main fe5f9951 · 39 ahead (38 rewritten + the plain commit)

## 1. Credential scan, before the commits: 0 hits

    checked: the push gate's KEYS (imported from consonance/hooks/push-gate.js) over all 680 paths in the five groups → 0
             (untracked files whole; modified files their added lines only)
    checked: the same over the staged added lines of each later commit (groups 2–5, the plain commit) → 0 each

## 2. Ponytail held apart

    git branch hold/ponytail-d387 37369e08
    git reset --keep dfe05087     (checked first: none of the 11 paths in dfe05087..37369e08 was dirty)
    git cherry-pick -x 37369e08   → ec054b92, rewritten to d41c9000

    checked: git diff 37369e08 main -- consonance/tools/js-suite.js → empty
    checked: git ls-tree -r --name-only main | grep -ic ponytail → 0
    checked: git log --oneline main..hold/ponytail-d387 → 37369e08 13b7d3b4 b431b2d0 c70d42a4

**hold/ponytail-d387 is still built on the unscrubbed history** (it carries the 9 commits the scrub dropped). It stays local, and
it gets the same scrub before it is ever pushed.

## 3. D390's tests: 151 / 151

    checked: step3-tests.out.txt → node --test js-suite.test.js gen-consumer.test.js portable-paths.test.js:
             tests 151 · pass 151 · fail 0 · cancelled 0 · skipped 0, 141.7 s, exit 0, under the heavy-run lock
    checked: node consonance/tools/portable-paths.js → exit 0 (53 baselined sites exempted, as before)
    checked: grep -rln -i ponytail --include=*.test.js . → empty: no test on main names ponytail

It ran at 5756accf, before the rewrite. The rewrite changed one notes file only (checked: `git diff 5756accf 68040336 --stat` →
`exo_memory/librarian/2026-10-12.desktop.md`, 18 deletions), so the code under test is the same.

## 4. Commits by named paths

| commit (old → new after the rewrite) | group | paths | written by |
|---|---|---|---|
| fc9caec0 → 42485627 | hand-backs and evidence | 654 | A 567, E 41, C 29, B 17 |
| 2466b90d → 02edef9e | maps | 1 | E |
| fec86ffe → d5707346 | loop plans | 6 | the librarian (five headed so; see corrections) |
| 3ba2249a → b5d0db92 | `third_place/` | 9 | the Third Place seat |
| 5756accf → 68040336 | `librarian/` | 2 | the librarian |
| fe5f9951 (new) | the plain scrub commit | 11 | A, B, C maps; C's and B's hand-backs; the librarian's notes; two loop plans |

Left out: the live laps' folders (p-d407-*, p-d411-*, plus this lap's p-d412-* and p-d413-*, which I commit with my
hand-backs); the one .tar, inside p-d411-P's evidence.

## The scrub (steps 0–2 of the 14:14Z amendment)

**0. Backup:** `git branch backup/pre-film-scrub-2026-10-19 main` at 5756accf, before anything moved. Local only, no upstream
(checked: `git config --get branch.backup/pre-film-scrub-2026-10-19.remote` → empty). It holds the lines; never push it.

**1. History, origin/main..main only.** `git filter-repo` is not installed, and `git filter-branch` refuses a dirty working tree,
which this shared checkout always is. So I used the equivalent, plumbing only. For each commit, its tree goes into a TEMPORARY
index (`GIT_INDEX_FILE`). Every line naming the project that is NOT already public at origin/main is dropped, with the blank line
before it. The tree is written and `commit-tree` is called with the original author, committer, dates and message (the name in a
message → "a private side project"). A commit whose tree equals its new parent's is dropped. The working tree and the real index
were never touched; main was moved once, with `git reset --keep 68040336` (checked first: the one changed file was not dirty).

    checked: 38 kept commits vs their originals — diff outside the notes file identical, the notes file's +/- lines identical,
             and the commit object minus tree/parent lines byte-identical → 38 / 38, 0 mismatches
    checked: git diff --stat 5756accf 68040336 → 1 file, 18 deletions (9 entries + their 9 blank lines)

| removed or renamed | where | commits |
|---|---|---|
| 9 dated notes entries about the project (plans, waves, deliveries, the pivot, the pause), dropped | `exo_memory/librarian/2026-10-12.desktop.md` | ba1918d0 223f4c44 d4e751c6 a49e520e c896d200 5ef16488 b9efca2d 84e28c5d 9d3861f2 — each became empty and was DROPPED |
| the same 9 lines, gone from every later commit's copy of that file | same | the 38 kept commits, contents otherwise unchanged |
| commit messages | — | only the 9 dropped commits named it; no kept message changed |

Old → new for all 47: `sha-map.txt` in the evidence folder. Rewritten tip: 5756accf → 68040336.

**2. The current files: one plain commit, fe5f9951.**

| file | dropped (about the project) | renamed to "a private side project" (incidental) |
|---|---|---|
| `exo_memory/librarian/2026-10-12.desktop.md` | 15 lines: the D314 entries and the 15:52 D316 line (public since 10-12/10-13) | — |
| `exo_memory/map/B.md` | 6 lines: B's D316 headings (public since ff3df4a1, 10-13) | — |
| `exo_memory/map/A.md` | — | 8 heading labels "(on …, Sonnet 5.5)", uncommitted lines |
| `exo_memory/map/C.md` | — | 2 grep counts, uncommitted lines |
| `exo_memory/handback/p-d366-C_2026-10-17.md` | — | 2 grep counts |
| `exo_memory/handback/p-d370-C_2026-10-17.md` | — | 1 grep count |
| `exo_memory/handback/p-d380-landing-C_2026-10-17.md` | — | 1 entry in a scan-pattern list |
| `exo_memory/handback/p-d317-close-B_2026-10-13.md` | — | 1 ("from a private side project's laps (D316)"), public |
| `exo_memory/loop/plan_close_confirm_2026-10-13.md` | — | 1 log path, public |
| `exo_memory/loop/plan_t180_handoff_2026-10-15.md` | — | 1 memory name → "the memories on the private side project" |
| `exo_memory/librarian/2026-10-18.md` | — | 4 lines (one incidental reference at :40, and the 07:55, 07:56, 08:13 entries) |

That commit also carries those files' uncommitted lines, which were held out of the earlier D413 commits only for this. The
librarian has appended 4 lines to `2026-10-18.md` since (checked: 0 matches in them); I left them for the librarian.

**Other seats' lighthouse worktrees on rewritten shas** (left as they are, per the amendment):

| worktree | HEAD |
|---|---|
| `C:/Users/nname/Desktop/worktrees/lh-base-dfe05087-e` | dfe05087 (detached) |
| `C:/Users/nname/Desktop/worktrees/lh-d366-c` | baf850cc [d366-c] |
| `C:/Users/nname/Desktop/worktrees/lh-d370-c` | dfe05087 [d370-c] |
| `C:/Users/nname/Desktop/worktrees/lh-d387-e` | 13b7d3b4 [d387-e] |
| `C:/Users/nname/Downloads/lh-base-d368` | baf850cc (detached) |
| `C:/Users/nname/Downloads/lh-d390-b` | 37369e08 [d390-b] |
| `C:/Users/nname/Downloads/lh-land-d368` | dfe05087 (detached) |

(`lh-d338-a` at d83747d2 is off this chain and unaffected.) Each of those shas still carries the 9 dropped commits beneath it.
Nothing pushes them today, but a landing from any of them onto main would bring the lines back.

## After

    checked: git status --short | wc -l → 9 — the live laps' files (p-d407, p-d411, p-d412, p-d413) and the librarian's
             live notes file

## Corrections

- fec86ffe's message (now d5707346) says the librarian wrote all six loop plans. Five carry its header;
  `readme_t180_sections_2026-10-17.md` carries none. Inferred, not checked.
- At step 4 I sent a stray second `git commit -m x`. It failed with "nothing to commit" and changed nothing (checked: reflog, and
  the 17 staged paths still staged).
- My first film scan used a wider pattern and flagged `HANDBACK_` paths and lap ids. Those were T-180 paths, not the project.
- B.md was first held out on a context-only hit. Its tracked lines did name the project, and those 6 are now dropped in fe5f9951.
- My first rebuild added a trailing newline to every message, which the byte check caught. The chain on main is the second build.

SOURCES: plan_d413 · librarian/2026-10-18.md 07:55–08:13 · grep-landings-for-private-projects memory · git as printed · step3-tests.out.txt · sha-map.txt
NEXT: librarian — rule on the push gate's form (above); on a yes I push main and paste the push-gate.jsonl "allow" line.

## Addendum, 14:27Z: pushed, on the librarian's ruling (entry 08:26)

The section "THE PUSH IS NOT DONE" above is superseded. The librarian ruled the gate of record correct (added lines, messages,
HEAD); the chair re-checked and sent the push.

    checked: git fetch; origin/main is an ancestor of main (fast-forward) · 40 ahead at ccbd0d23
    checked: added lines matching either word 0 · messages 0 · git grep HEAD 0 · credential scan of the added lines 0
    checked: git push origin main → b89f0d6e..ccbd0d23  main -> main
    checked: push-gate.jsonl 2026-10-19T14:27:22.902Z, seat c88002b1, decision "allow", scanned lighthouse origin main
    checked: after: origin/main = main = ccbd0d23 · git ls-remote --heads origin | grep -cE 'backup/|hold/' → 0
