# D635 — the landing of room fixes 1–5, and the vantage clones (pane C, 2026-11-03)

Packets: the chair's D635 (15:19Z), its P-tip ring (16:07Z, `bd576735`) and its ADD (16:10Z, the vantage clones, at the
keeper's yes 10:10, his veto open). Landing worktree `Desktop/worktrees/lh-d635-c`, branch `d635-c`. **Not pushed, nothing
installed, swapped or restarted.** Standing guard kept: no seat's conversation, CLAUDE.md, memory or shelf was touched.

EV = `exo_memory/handback/p-d635-room-landing-C_2026-11-03_evidence/`. S = my scratchpad `d635/` (copied into EV).

## 1. The merges (onto `d628-o` 82da03fc, fix 1)

| order | branch | tip | merge commit | conflicts |
|---|---|---|---|---|
| 1 | d630-e | `ca4cd85c` | `f5b8b922` | none |
| 2 | d633-o | `3aed0c72` | `3546222b` | none |
| 3 | d629-c | `7271a29c` | `2b45c2f9` | none |
| 4 | d632-a | `b2d29a2f` | `993ace6a` | none |
| 5 | d631-p (amended) | `bd576735` | **`bcc5a26e`** | none |

checked: each tip descends from 82da03fc (`git merge-base --is-ancestor`); no file is touched by two of the five branches
(`git diff --name-only 82da03fc <tip>` for each, `uniq -d` → empty). `5faa4014` (P's first tip) was not merged.
P's tip touches no Rust: `git diff --quiet 993ace6a bcc5a26e -- consonance/src-tauri` → identical.

**The landing head is `bcc5a26e`.**

## 2. The checks

Everything under the heavy-run lock (one slot), at BelowNormal, one test file at a time (`--test-concurrency=1`); cargo
with `--test-threads=1` and its own target dir `G:\Consonance-tools\cargo-c635`.

| check | at | result | evidence |
|---|---|---|---|
| cargo test (all 11 targets) | `993ace6a` | **1,422 passed, 0 failed, 12 ignored** | EV/cargo-test.993ace6a.summary |
| cargo test (all 11 targets) | `bcc5a26e` | **1,422 passed, 0 failed, 12 ignored** | EV/cargo-test.bcc5a26e.summary |
| touched tools' and hooks' tests, 16 files | `993ace6a` | 488 pass / 0 fail | EV/touched.993ace6a.out |
| the same 16 + 16 more that reach P's files, **32 files** | `bcc5a26e` | 870 pass / **2 fail** (portable-paths) | EV/touched.bcc5a26e.out |
| portable-paths.test.js, after the fix below | `fe69a9fc` | **43 pass / 0 fail** | EV/portable-paths.fe69a9fc.summary |
| second-reader mutants (`consonance/tools/second-reader.mutants.js`) | `bcc5a26e` | **applied 56 / caught 56 / NOT APPLIED 0** | EV/second-reader-mutants.out |
| vantage mutants (A's `mutants.js` via `mutant-harness.js`) | `993ace6a` | **applied 22 / caught 22 / NOT APPLIED 0** | EV/mut632.out |
| chain-status mutants, D628 (O's `mut628.js`) | `993ace6a` | **applied 13 / caught 13 / NOT APPLIED 0** | EV/mut628.out |
| chain-status mutants, D633 (O's `mut633.js`, T2 re-anchored) | `993ace6a` | **applied 13 / caught 13 / NOT APPLIED 0** | EV/mut633b.summary (and mut633.summary, the first run; both cut to name and verdict, as the raw failing-test names carried a private term) |

The vantage and chain-status mutants ran on `993ace6a` because P's tip touches none of their files (second-vantage.js,
chain-status.js, mcp.rs); `git diff --name-only 993ace6a bcc5a26e` lists only P's 10 files. text-census.test.js counts
as 1 in the TAP totals because it has its own runner; inside it is 27/0.

**The one red, and its fix (`fe69a9fc`).** portable-paths read "RED — 4 machine-specific path(s) not in the baseline": a
pulse regex at `chain-status.test.js:1830` (D633) and three fake-drive fixtures at `second-vantage.test.js:617-619`
(D632, `X:/a`, `Y:/c`). The tool itself classed all four BENIGN-TEST. It was green at the base (checked: a detached
worktree at 82da03fc → exit 0, 41 baselined sites). Neither branch ran this guard. Its own remedy for a fixture is
`--update`, which added exactly those 4 rows (BENIGN-TEST 422 → 426) and changed nothing else (29+/1−, the count line).
The baseline is not bundled (`grep -c portable-paths tauri.conf.json` → 0), so the exe built at `bcc5a26e` is the landing's.

**O's D633 harness had one stale anchor.** Its T2 row quoted `'waiting', 'handbacks', 'unconfirmed']`, but O's own final
commit `3aed0c72` has `'waiting', 'handbacks']);` (0 occurrences of the old text in 3aed0c72 or in the merge). So the first
run read applied 12 / caught 12 / NOT APPLIED 1. I re-anchored T2 to the committed line (same mutant: drop 'handbacks'),
and it was caught (5 tests red). Not a merge fault.

**The landing head is `fe69a9fc`** (bcc5a26e plus the baseline).

## 3. The staged exe

`cargo build --release` at `bcc5a26e` (src-tauri identical at fe69a9fc), target `G:\Consonance-tools\cargo-c635`, under
the lock, BelowNormal: finished in 1 m 57 s, exit 0, 12 warnings (EV/build.tail).

**Staged at `G:\Consonance-tools\stage-d635\`**: `consonance.exe` plus the resource copies the build wrote beside it (the
10 briefs, `room-settings.json`, `cards/`, `record/`, `research/`, `spread/`), 43 files, `MANIFEST.sha256` beside them
(EV/stage-MANIFEST.sha256; `sha256sum -c` → all verify).

    consonance.exe   15,989,760 B   sha256 1a33d8b3008a6e34a198c8cd2f73e3cdd597d0271ef95c96b4d042b33cab69ca

checked: equal to the build copy's sha256. open-items against that build: "CLOSED the documents a fresh room reads match
the repo, 42 shipped file(s) byte-identical" (D629 (a)'s drift closes with this exe).

**For the swap, at his "restart" (not done):** the running app is `Desktop\lighthouse\consonance\src-tauri\target\release\
consonance.exe`, and its briefs are the copies beside it. Swapping means the exe **and** those resource copies, each after a
`.before-d635` backup and a sha256 compare against this manifest. P's hook (`second-reader-note.js`) and install.ps1 change
the installed hook copies, which install.ps1 places, so the restart step should run P's installer path as P's hand-back
states. I have not read P's install steps for that; the landing pane at the restart should.

## 4. The vantage clones (the ADD)

**Paths.** `G:\Consonance-tools\vantage-repos\` (made; it did not exist):
- `t180` — `git clone C:\Users\nname\Downloads\t180-fresh` (HEAD 60c7688, main).
- `t180-track-builder-history` — `git clone C:\Users\nname\Downloads\t180-track-builder` (the old history, for pre-rewrite shas).

His working copies were only read (`git clone` from them, `rev-list`, `for-each-ref`, `status`); `git status --short` of
each is what it was (t180-fresh 1 line, the old clone 0, both before my clone and after; I wrote nothing to either).

**The push-URL check** (EV/vantage-remotes.out), set immediately after each clone:

    t180                        origin  C:/Users/nname/Downloads/t180-fresh (fetch)   origin  no_push (push)
    t180-track-builder-history  origin  C:/Users/nname/Downloads/t180-track-builder (fetch)   origin  no_push (push)
    git push --dry-run origin HEAD  → fatal: 'no_push' does not appear to be a git repository   (both)

Neither clone has been fetched or pushed since. Their fetch URLs are the local source paths (no network remote).

**What the clones carry, and the gap** (checked: `rev-list --all` and `for-each-ref` in source and clone):
- t180: 1178 of the source's 1181 commits. Missing: `refs/original/…/land-0437c-e` (a filter-branch backup ref) and one
  more ref (121 → 120 refs), 3 commits in all.
- the old history: 846 of 847. Missing: the source's remote-tracking `l130-camera-readout` and `l132-camera-feel`, 1 commit.
- A plain clone copies branches and tags only. Adding these needs one local `git fetch` from the source, and the order says
  never fetch, so it is left for the chair's word. A claim naming one of those 4 commits would fall back to lighthouse.

**The config diff** (`~/.consonance.json`; backup `~/.consonance.json.before-d635`, sha256 `a7caeac0…4723962f`, equal to the
original before the edit; EV/config.diff):

    31c31,35
    <   "scratch_dir": "G:\\consonance-scratch"
    ---
    >   "scratch_dir": "G:\\consonance-scratch",
    >   "vantage_repos": [
    >     "G:\\Consonance-tools\\vantage-repos\\t180",
    >     "G:\\Consonance-tools\\vantage-repos\\t180-track-builder-history"
    >   ]

Written by `scripts/setvantage.js`, which refuses unless the backup is byte-identical and re-serialising changes no other
byte. A Settings save keeps a key the app does not own (`main.rs:24452`, `a_save_keeps_every_key_it_does_not_own`).

**Vantage once, on one claim** (EV/vantage-once.out, `scripts/vantage-once.js`). second-vantage's real `processRow` at
`bcc5a26e`, with the real config, real `resolveRepo` and real `worldCheck` (its own `git worktree add`/`remove`), but a
**stub reader** that answers DISAGREE. So: no model call, and no ledger, findings or watermark file written. I chose the stub
because the world check, the step that adds the worktree, runs only after a DISAGREE; a real reader would usually stop
before it. The claim: "t180 commit d84d40df7 changed the builder" (a t180 commit absent from lighthouse), claim-time head
0cbe078f.
- Result: `repo.root G:\Consonance-tools\vantage-repos\t180, by commit`; world checked at 0cbe078f vs 60c76888; status SURFACE.
- `git worktree list` counts, before / during the claim-time reader / after:
  clone t180 1 / **2** / 1; old-history clone 1 / 1 / 1; t180-fresh 75 / 75 / 75; Downloads\t180-track-builder 79 / 79 / 79;
  lighthouse 47 / 47 / 47.
- The worktree's **files** were at `G:\consonance-scratch\vantage-wt-…` (the configured `scratch_dir`), and its
  **registration** in the clone's `.git`. Both were gone afterwards (no `vantage-wt-*` left, no `.git/worktrees` in the clone).
  So the vantage check registers worktrees in the clone and nowhere else; it does not put their files under vantage-repos.

**A limit of D632's resolution, noted, not changed (A's code).** `resolveRepo` matches a claim's absolute paths against the
candidate repos' own paths (`second-vantage.js:176-179`). A t180 claim names `C:\Users\nname\Downloads\t180-fresh\…`, which
is not under `G:\…\vantage-repos\t180`, so a path-only t180 claim resolves to lighthouse. Only claims naming t180
commits reach the clone.

## Corrections (mine)

1. My first config write was an inline `node -e` with nested escapes, against my own rule. It failed at parse, before any
   write (checked: `diff -q` config vs backup → identical); redone with a script file.

## Not done

- No install, swap, restart or push. The exe is staged only.
- The 4 commits the clones lack (above), pending the chair's word.

## Sources

The five tips and `git diff`/`merge-base` as cited; the hand-backs p-d628, p-d630, p-d631, p-d632, p-d633 (for the
mutant harnesses); `second-vantage.js` :80-147, :161-216, :422-500; `main.rs` :190-240, :24452; `portable-paths.js`
--update; the release dir; both source repos (read only); `~/.consonance.json` (backed up, one key added).
`exo_memory/third_place/` was not read.

## 5. The push (the chair's 17:07Z order: the keeper, 11:07, "no desktop exe swap; the laptop takes the fixes from main")

**Pushed: `fe69a9fc41ab0b129226712d8a7c0758f4813b16` to origin/main**, `21819167..fe69a9fc`, a fast-forward
(`git push origin fe69a9fc:refs/heads/main`). checked: `git fetch; git rev-parse origin/main` → fe69a9fc41ab….

- **What it published:** 17 commits (origin/main..fe69a9fc), the five fix branches, their merges and the baseline commit.
  **Not** local main's 58 unpushed commits (notes and hand-backs since 21819167). fe69a9fc contains origin/main but not
  local main, so "merge into main, then push main" would have published those too. That is outside this order, and
  hand-backs wait for a sync order.
- **Credential scan:** push-gate's decision `allow` at 2026-11-03T17:09:36Z, scanned `{dir: Desktop\lighthouse, remote: origin,
  src: fe69a9fc}` (`C:\Consonance\data\push-gate.jsonl`, last line). My own pre-check of the same range: 0 key shapes.
- **The private-name grep, counts only:** my sweep (`sweep.js` in my scratchpad, d555; counts only) over the range's added lines (1,545, from
  `git log -p origin/main..fe69a9fc`, NULs stripped) and its 17 messages: **term hits 0 and 0**.
  - Correction, mine, before the push: my first extraction gave 500 lines. The B.md commit's removed line carries the
    NULs, so `grep` read the whole stream as binary and dropped the rest, the class D629 fixed. Redone with `tr -d '\000' |
    grep -a`; 1,545 per-commit added lines against 1,416 net (numstat), consistent.
- **push-gate failed open once, earlier:** at 16:11:52Z it logged `allow-error, not a git repo` for my vantage-clone
  `git -C $C push --dry-run`, a shell variable it cannot resolve (its header says so). That push target was `no_push`, so
  nothing could leave.
- **Local main:** fe69a9fc merged in as `94ba13a8` (no-ff; checked first: no dirty file of the checkout's 36 is touched,
  `git merge-tree` clean). Local main is 59 ahead of origin, 0 behind, and **not pushed**.
- **Not done, per the order:** no exe swap or install; the staged copy stays in `G:\Consonance-tools\stage-d635`; Consonance
  not closed.
