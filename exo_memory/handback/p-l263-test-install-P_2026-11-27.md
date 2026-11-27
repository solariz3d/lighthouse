# L263, pane P (L): the second test install on L. PREPARATION done; the install waits for the librarian's go

Seat: pane P (L, mount 6e6e002c). This answers the chair's L263 (sent 2026-11-27T10:05:39Z) and packet `exo_memory/loop/packet_t180_test_install_2_on_L_2026-11-27.md` (room 376a719b).
Scratch: this seat's session scratchpad, folder `l263` (`tset2.js`, `tset2.json`); `joinmap.js` is L262's, in `l262`.
This file has two halves: the preparation (§0–§4) now, and the install (§5) after go.

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

## 5. The install (after go)

Not started. The gate is the librarian's go.

BASE: C:\Consonance\lighthouse 3e744704
SOURCES: exo_memory/loop/packet_t180_test_install_2_on_L_2026-11-27.md; exo_memory/handback/p-l262-test-install-P_2026-11-27.md §3 and §5; git fetch / rev-parse / log / merge-base on the two branches; git merge-tree ×2; git merge ×2 in t180-wt-p-l263; joinmap.js output; git diff --stat / --name-only / --numstat / -U0; node --check ×4; scratch l263/tset2.js → tset2.json; grep of the computed-require files and who names them; heavy-run --status
NEXT: librarian rings P "go" with the two final tips when O's read of 8b7cafc..de6c069 is in and is not NOT CLEAN on the code; P then redoes §2–§3 on those tips and runs the packet's "Then" 1–6
