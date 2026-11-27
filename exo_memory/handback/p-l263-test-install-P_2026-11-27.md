# L263, pane P (L): the second test install on L. Merged by the named shas, tier green, built, pushed, and INSTALLED (not launched)

Seat: pane P (L, mount 6e6e002c). This answers the chair's L263 (sent 2026-11-27T10:05:39Z) and packet `exo_memory/loop/packet_t180_test_install_2_on_L_2026-11-27.md` (room 376a719b).
Scratch: this seat's session scratchpad, folder `l263` (`tset2.js`, `tset2.json`); `joinmap.js` is L262's, in `l262`.
This file has two halves. §A, the run after go, is directly below. The preparation (§0–§4) follows it unchanged.

## §A. After go: the answer first

- **INSTALLED at 10:22:44Z, not launched.** The installed exe is now **839ca4766b98bcd775be2f166987953a3653ca47734bd67e85478cc4ef7494a9**, 16,091,136 B; the stamped compare against the build (6b22d096…) is equal.
- **Backup:** `.before-l263-537a0c9`, sha256 **69462996bfa3602f20e1a358aec017af727adef1da24238bc60d2d1445de2cd7**, the first test install, made and `cmp`-checked first. `.before-l262-f3cd425` is kept.
- **What is in it:** `landing-1127-l263` **c522ea6** = 537a0c9 + `l-bankcarry-a` **e7b9128** (Sculpt's bank handle past ±720) + `d677-right-width-b` **de6c069** (SPLIT_HEAD words and the way back to the width), merged by the named shas.
- **What is not in it:** B's F3 commit c66b503, which `d677-right-width-b` points to now.
- **Tier green by verdict:** 165 of 165 plain rows; 370 of 370 harness rows, with mutant rows applied 345 / caught 345 / NOT APPLIED 0.
- **His files:** each of 16 tracks and 121 undo steps saves the same on this build as on 537a0c9.
- **Pushed** (the landing branch, and the two sources at the named shas; no main) and read back.


## 0. The answer first (preparation)

- **Tips, from the branch refs** (checked at 10:05:47Z, after `git fetch origin`):
  - `l-bankcarry-a` **e7b9128**, one commit on 7b3926e (origin is 7b3926e);
  - `d677-right-width-b` **de6c069**, 8b7cafc and de6c069 on e4e7ecc (origin is e4e7ecc).
- **The packet's expectation is confirmed:**
  - `git merge-tree` of 537a0c9 with e7b9128: no conflict (CHANGELOG.md and app/core/panel.js auto-merge).
  - 537a0c9 with de6c069: **`MAP.md` is the only conflict** (CHANGELOG.md and app/core/panel.js auto-merge).
- **The trial merge** is in my own worktree, `C:\Consonance\t180-wt-p-l263`. The L262 worktree holds the whole suite now running, so I did not touch it.
  - 537a0c9 + e7b9128 → 9faa657, clean.
  - Then + de6c069 → the MAP.md conflict is the `app/core/panel.js` entry again: two pure insertions against their merge base e4e7ecc. `joinmap.js` joined them; it refuses anything else. The result is 94901de (trial, detached, not pushed).
- **Touched set: 13 files** by the rule in §3. **9 mutation harnesses** name the one code file both sides of a merge changed, `app/core/panel.js`.
- Nothing was built, installed or pushed. The gate is the librarian's go.
- **The L262 whole suite on 537a0c9 is still running** in slot 1 (since 09:26:43Z). It is not cut short, and it goes into the L262 hand-back when it ends.

## 1. The tips (from the branch refs, not from A's or B's worktrees)

- checked: `git rev-parse` → l-bankcarry-a e7b9128, d677-right-width-b de6c069; origin/l-bankcarry-a 7b3926e, origin/d677-right-width-b e4e7ecc, origin/landing-1127-l262 537a0c9.
- checked: `git log --oneline 537a0c9..<tip>`:
  - A: `e7b9128 D677 (2), completed: Sculpt's bank handle carries past ±720 too`.
  - B: `8b7cafc D677 (b) L258 B, F1: a saved piece added at a split head is refused in his words (SPLIT_HEAD)` and `de6c069 … F2: a right width typed as the width is shown is back to the width`.
- checked: `git merge-base 537a0c9 <tip>` → 7b3926e for A and e4e7ecc for B. Each tip is a descendant of the half already installed.
- What the new commits change (checked: `git diff --stat`):
  - A (7b3926e..e7b9128): CHANGELOG.md, `app/core/handles.js`, `app/core/panel.js` (1 line, `:1018`), and the tests `core-bank-carry-mutation` and `core-pieces-ui`.
  - B (e4e7ecc..de6c069): CHANGELOG.md, MAP.md, `app/core/panel.js` (`:227`–`:293`, in `extendOptions`), `src/core/document.js`, `src/core/piece.js`, src/core/README.md, and the tests `core-right-width-panel`, `core_right_width` and `core_right_width_mutation`.
  - Both change only CHANGELOG.md and `panel.js`. In the trial tree, A's `panel.js` line is at :1028 (in `mount`) and B's hunks are at :227–:293 (in `extendOptions`); checked: `git diff -U0` of each merge in 94901de.

## 2. The trial merge

| step | result (checked) |
|---|---|
| `git merge-tree --write-tree --name-only --messages 537a0c9 e7b9128` | exit 0, tree 071ea478; auto-merging CHANGELOG.md, app/core/panel.js |
| `git merge-tree … 537a0c9 de6c069` | exit 1; auto-merging CHANGELOG.md, MAP.md, app/core/panel.js; **CONFLICT (content) MAP.md**, the only one |
| `git merge --no-ff e7b9128` on 537a0c9 (worktree `t180-wt-p-l263`) | 9faa657, clean |
| `git merge --no-ff de6c069` on that | CONFLICT in MAP.md only; merge base e4e7ecc |
| `joinmap.js . e4e7ecc 9faa657 de6c069` | exit 0. B's new text goes at char 202 of the base line: ", and as wd 0 when typed as the width is shown with the width left as shown, `backToWidth`, L258 F2". A's goes at char 325: the same insertion as L262. Joined line 2,930 chars, CRLF kept |
| committed detached as **94901de** (trial only) | its tree differs from merge-tree's (9faa657 + de6c069) only in MAP.md. MAP.md is +1/−1 against de6c069 and +2/−2 against 9faa657 (B's two lines: the piece.js line and the panel.js line). 0 conflict markers |
| `node --check` | ok for `panel.js`, `handles.js`, `src/core/piece.js`, `src/core/document.js` |

## 3. The touched set

**The rule** (`tset2.js`) is L262's rule with the new commits as its subject. Both branches' older halves are already in the build installed now, so only A0..A (7b3926e..e7b9128) and B0..B (e4e7ecc..de6c069) are new.
- **executes:** the same definition as L262. It counts `require()` calls whose argument is a string literal starting `./` or `../`, transitively, plus the `*.test.js` files a spawning harness names, transitively.
- **A row is in the touched set** when either:
  1. it is a test file the NEW commits of one branch changed, and it executes a code file the OTHER branch changed anywhere since f3cd425; or
  2. it is a test file the OTHER branch changed anywhere since f3cd425, and it executes a code file this branch's NEW commits changed.

Code files (checked: `git diff --name-only`):
- A new: `handles.js`, `panel.js`.
- A whole: `coreshell.js`, `handles.js`, `panel.js`.
- B new: `panel.js`, `src/core/document.js`, `src/core/piece.js`.
- B whole: the nine of L262 (coreshell, panel, secondtick, and src/core adapter, close, document, extend, piece, sharp).

| part | rows | IN |
|---|---|---|
| (1) A's new rows × B's whole code | 2 | 2: `core-bank-carry-mutation`, `core-pieces-ui` |
| (1) B's new rows × A's whole code | 3 | 3: `core-right-width-panel`, `core_right_width` (coreshell only), `core_right_width_mutation` |
| (2) B's rows since f3cd425 × A's new code | 11 | 6: `core-right-width-panel`, `core-xsec-mutation`, `drag-ghost` (handles only), `core_edgeneg`, `core_ramp_mutation`, `core_right_width_mutation`. Out: `core_cup_mutation`, `core_extend`, `core_right_width`, `core_xsec`, `core_xsec_mutation` |
| (2) A's rows since f3cd425 × B's new code | 7 | 7: all of A's rows (`core-sculpt` through document and piece only) |

**The touched set, 13 files:**
- app/test: `core-bank-carry`, `core-bank-carry-mutation`, `core-extra-bank-wind`, `core-pieces-ui`, `core-right-width-panel`, `core-sculpt`, `core-xsec`, `core-xsec-mutation`, `drag-ghost`;
- test: `core_edgeneg`, `core_ramp_mutation`, `core_right_width`, `core_right_width_mutation`.

**Mutation harnesses that name a merged file.** The code file both sides of either merge changed is only `app/core/panel.js` (checked: `git diff --name-only` from each merge's base). 9 harnesses name it:
- app/test: `core-bank-carry-mutation`, `core-close-mutation`, `core-mutation`, `core-xsec-mutation`;
- test: `core_early_turn_climb_mutation`, `core_landing_xsec_mutation`, `core_ramp_mutation`, `core_right_width_mutation`, `core_sharp_mutation`.

L262's 14 also counted harnesses naming `coreshell.js`. Neither new range changes `coreshell.js`, so those 5 drop out by the packet's words, "every mutation harness that names a merged file". The packet's other part of the tier, "the bank-carry and right-width harnesses", is in the set already.

**The limits** (checked):
- 4 files reached have computed `require` paths: `core_xsec_shared` 4, `core_fit_banded` 3, `core_joint_c2` 7, `tools/bank-ramp-candidates.cjs` 5. None changes a verdict.
  - The only one inside an "out" row is `core_xsec_shared.test.js`, inside `core_xsec_mutation`. Its computed requires are `src/core/document.js`, `extend.js`, `adapter.js` and `src/geom/profile.js`, and none of them reaches `app/`.
  - `bank-ramp-candidates.cjs:17` does load `panel.js` by a computed path. Only `test/core_bank_ramp.test.js` names it, and that file is an inner run of `core_ramp_mutation`, which is IN.
- No row drives a browser. checked: `grep launchChrome|puppeteer|webSocketDebuggerUrl` over the 13 in the trial tree → 0 in each.

## 4. Registered before go (so it can fire)

- **Predictions:**
  - the merge on the final tips conflicts in `MAP.md` alone, and `joinmap.js` applies with each merge's own base;
  - every tier row is green, by VERDICT: 0 `not ok`, 0 cancelled, and 0 mutant rows that are not "applied, and caught";
  - his saved files each parse and save the same on the new build as on 537a0c9, the build installed now;
  - none of his tracks has a right width, so none is written as core/7.
- **I stop and say so, installing nothing, if:**
  - any tier row's verdict is `not ok` or cancelled, or any mutant row is not "applied, and caught" (I read rows, not text: my L262 correction);
  - the merge conflicts outside `MAP.md`, or `joinmap.js` refuses;
  - any of his files saves differently on the new build than on 537a0c9 (the comparison is against the installed build: the packet's step 5);
  - his T-180 app is running (I check, and never close it; he is testing tonight, so this is the likeliest stop);
  - a final tip is not the one the go names.
- **Unwelcome outcome, in words that would make it true:** "core-pieces-ui is red only on the merged tree." A's new rows in it and B's SPLIT_HEAD refusal both touch saved pieces at the head. If they meet, green on each branch alone proved nothing about the pair.

## 5. The run after go (checked unless marked; scratch `l263/run/`: `pipeline.json`, `tier-*.tap`, `tset2-final.json`, `build.log`, `install.txt`, `bytes263.json`)

**The go:** the chair's of 10:06:14Z (delivered 10:08:44Z), on the packet's "GO, 04:10" (`:47`, c0ed578b): the tips are NAMED, e7b9128 and de6c069, merged by sha.

**heavy-run:** `--status && --wait-game && --run --priority belownormal`, from the worktree. It took slot 1 at 10:09:53Z, after my L262 suite had ended (10:09:34Z), so the two did not overlap. B's L258 F3 mutation run held slot 2 meanwhile.
- **Said plainly:** I started the chain with a stray `&`, so its background task reported done at once. The run itself went on in its slot. I waited on its holder's pid with `Wait-Process` (no polling) and read its result when it exited (Corrections).

**His builder:** not running at 10:08Z, at the merge's start, before the build (inside the pipeline), before the backup, and after the install (`tasklist`). heavy-run `gamesIn` gave `[]` before the backup.

### 5.1 The merge (`pipeline263.js`)

- The refs at the merge's start (10:09:54Z): l-bankcarry-a e7b9128 and d677-right-width-b de6c069, the named ones. B's c66b503 came later.
- `git switch -c landing-1127-l263 537a0c9`.
- `git merge --no-ff e7b9128` → 26a595f, clean.
- `git merge --no-ff de6c069` → unmerged `MAP.md` only. `joinmap.js` against the merge's base e4e7ecc, exit 0 (the same two insertions as §2) → **c522ea6**.
- 0 conflict markers; `node --check` 9 of 9 changed JS files.
- The touched set was recomputed on c522ea6: the same 13 files. The one merged code file is `app/core/panel.js`, with the same 9 harnesses.

### 5.2 The tier, by verdict (my L262 correction)

18 files: the 13, the bank-carry and right-width files, and the 9 harnesses.

| run | files | result |
|---|---|---|
| plain rows, `--test-concurrency=1` | 9 | tests **165**, pass **165**, fail 0, cancelled 0, 0 rows `not ok`, 61 s |
| harnesses, `--test-concurrency=2` | 9 | tests **370**, pass **370**, fail 0, cancelled 0, 0 rows `not ok`, 585 s. **Mutant rows: applied 345 / caught 345 / NOT APPLIED 0** (every row named mutation/mutant is `ok` and reads "applied, and caught by") |

- The unwelcome outcome registered in §4 ("core-pieces-ui is red only on the merged tree") did not happen. core-pieces-ui is in the plain run, green.

### 5.3 The build (inside the same run, 10:20:42–10:22:16Z)

- `release.cjs` exit 0 in 93 s; "no private paths" for both files.
- `Cargo.toml` line endings only, put back; the tree is clean.

| output (in `C:\build\lighthouse-target\release\`) | bytes | sha256 |
|---|---|---|
| `t180-track-builder.p-l263-c522ea6.exe` (= the default-named exe at build time) | 16,091,136 | 6b22d0964c8ae9d958f089161b735452b9dbc40d10d791dab8c78b69dbdadf54 |
| `bundle\nsis\T-180 Track Builder_0.4.40_x64-setup.p-l263-c522ea6.exe` | 8,300,596 | c05d37d720c4a01d82912d81888cf9f2332bc8f5f56e5b170268aa7eb99d2d14 |

- The exe holds `__TAURI_BUNDLE_TYPE_VAR_UNK` once, at byte 13,614,874.

### 5.4 The backup, the install, the hashes

1. **Before:** the installed exe was 69462996…2cd7, the 537a0c9 install. No `.before-l263*` name existed.
2. **Backup, first:** `cp -n` to `%LOCALAPPDATA%\T-180 Track Builder\t180-track-builder.exe.before-l263-537a0c9`. checked: `cmp` identical; sha256 69462996…2cd7; 16,089,600 B.
3. **Install:** `install-local.ps1 -Tag l263i-c522ea6 -Installer <setup .p-l263-c522ea6> -Built <exe .p-l263-c522ea6> -WaitSec 5`, exit 0 (`install.txt`):
   - builder processes 0 before and 0 after;
   - the script's own backup is `.before-l263i-c522ea6`, 69462996…;
   - installed **839CA476…94A9**, ProductVersion 0.4.40, 16,091,136 B;
   - **stamped compare: equal** ("the built exe with UNK -> NSS at byte 13614874 is the installed exe").
4. **Re-hashed after, by my own `sha256sum`:**
   - installed 839ca476…94a9;
   - `.before-l263-537a0c9` and `.before-l263i-c522ea6` are both 69462996…2cd7, and `cmp` says they are identical;
   - `.before-l262-f3cd425` is still 2820e5f8…7576.
   - The install lock file is gone. `uninstall.exe` was written 04:22:44 local (10:22:44Z).
5. checked: no builder running; **nothing launched**. `find -newermt 10:05Z` on his two app-data folders → 0 files.
6. **To undo**, with the builder closed, copy `.before-l263-537a0c9` over `t180-track-builder.exe` (back to the first test build, 69462996…). Or copy `.before-l262-f3cd425` to go back to f3cd425 (2820e5f8…).

### 5.5 His saved files: the new build against 537a0c9, the build installed before (the packet's step 5)

- Copies were taken at 10:11:44Z (`l263/copies.taken`): 16 tracks and 13 undo sidecars, checked by `sha256sum -c` against his folder. 0 of the 29 had changed since L262's copies of 09:24Z.
- `bytes.js` (L262's) puts each file through `D.serialize(D.parse(text))` on the merged tree (`t180-wt-p-l263` at c522ea6) and on the L262 worktree at 537a0c9.
- **The same on both: 16 of 16 tracks, 121 of 121 undo steps.** The 2 old piece-builder files are refused BAD_DOC by both. 0 of his tracks is written as core/7.
- A core/7 text made on the new build (one of his tracks, copied, with a right-width step) is read by 537a0c9 too: "READ IT (no refusal)". Both builds know core/7.

### 5.6 The pushes (the packet's step 1)

- **What the landing branch publishes** (commits origin lacked): 5, namely 8b7cafc, de6c069, e7b9128 and my two merges, 26a595f and c522ea6.
  - Their added lines naming the account, a home path, AppData or an email: **0**.
  - His track names (5 characters or more) in them: **0**.
  - The merges' own resolution line: 1, the joined MAP.md line (code names only).
- **The source branches are pushed at the NAMED shas, not their refs.** `d677-right-width-b` points to c66b503 (F3, not in this install), so I used `git push origin <sha>:refs/heads/<branch>`. Both were fast-forwards (checked: `merge-base --is-ancestor`).
- push-gate: allow ×3 (10:23:07.335Z, 10:23:10.225Z, 10:23:12.596Z).
- The pushes printed `* [new branch] landing-1127-l263`, `7b3926e..e7b9128 … -> l-bankcarry-a` and `e4e7ecc..de6c069 … -> d677-right-width-b`.
- `git ls-remote origin`:
  - landing-1127-l263 **c522ea635285acf02379e5293cef08e02c0fbd50**;
  - l-bankcarry-a **e7b91287d8e2b8b6d3e6c55bf72c2d5f4a548c63**;
  - d677-right-width-b **de6c06923302e251f60b60db1bf7e34d7a83b836**;
  - landing-1127-l262 537a0c9…;
  - **main 3b33b38bfd85…, unchanged**.
- No tag, no release. B's c66b503 is B's to push.

### 5.7 What is new for him to try (one line each)

- Drag Sculpt's bank handle round past two full turns: it carries on. The mouse wheel and the arrow keys on it carry on past two turns too.
- At a track's head that has its own right width, add a saved piece: it is refused, and the message says why in plain words (the new words).
- Brush the width, then type the right width back to the width that is shown: the right side comes back to the width.
- inferred, from the packet's "GO" note: a track keeps the new file kind while any piece with a right-width step is in it. Setting the right width back does not change the file kind, so a track saved with one still needs this build to open.

## Corrections

- I started the L263 run with a stray `&` inside a background call, so the task reported done at once while the run went on in its slot. Nothing was lost or run twice (the run's own log has one start). I waited on the holder's pid with `Wait-Process` instead.

BASE: C:\Consonance\t180-wt-p-l263 537a0c9
BASE: C:\Consonance\lighthouse cff4bea2
SOURCES: exo_memory/loop/packet_t180_test_install_2_on_L_2026-11-27.md; exo_memory/handback/p-l262-test-install-P_2026-11-27.md §3 and §5; git fetch / rev-parse / log / merge-base on the two branches; git merge-tree ×2; git merge ×2 in t180-wt-p-l263; joinmap.js output; git diff --stat / --name-only / --numstat / -U0; node --check ×4; scratch l263/tset2.js → tset2.json; grep of the computed-require files and who names them; heavy-run --status; the chair's GO of 10:06:14Z and the packet's "GO, 04:10" (:47); scratch l263/pipeline.log, run/pipeline.json, run/tier-plain.tap, run/tier-harness.tap, run/tset2-final.json, run/build.log, run/install.txt, run/bytes263.json, copies.taken, src.sha; tasklist ×5; gamesIn; sha256sum and cmp of the installed exe and the backups; find -newermt; git rev-list / log -p / diff-tree --cc; git push ×3; git ls-remote; push-gate.jsonl last 3 rows
NEXT: librarian tells him the second test build is on the laptop, with §5.7, when it has read §A; nothing more is owed on L263
