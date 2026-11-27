# The builder batch: four branches merged on landing-1126, two word fixes, suite once, built, NOT installed, pushed (pane P, 2026-11-27)

Seat: pane P (sibling-372c8abc). This answers the chair's BUILDER BATCH packet of 2026-11-27T00:40:39Z (ledger D677). Tier: PROVE IT.
Worktree `Downloads\t180-fresh`'s worktree `t180-wt-p-1126`. Scratch (S): this seat's session scratchpad, folder `d681`.

**Already done before this packet arrived:** the packet orders this batch "before the two room laps and the lighthouse landing". Both were done and
pushed earlier this lap: the room laps in `p-d677-roomlaps-shelf-ch4-P_2026-11-26.md` (c3516bd2), and the lighthouse landing, pushed
fce82d62..51270770, in `p-d677-land-lh-P_2026-11-26.md`. The picture re-take and its ring were done too (045ee0ef).

## 0. The answer first

- **Branch `landing-1126-batch`**, made new from origin/landing-1126 at 62f5b95. **Tip f3cd425.** Pushed: `* [new branch] landing-1126-batch`, origin at **f3cd425a4d49119137340c35de8a1b4dd3786d81**.
- **Merged** (all four shas checked on origin first): reader-downray-e a8e54b7 → f6ee487; l-pitgap-a 7e42f02 → 9d1a59f; d677-sharp-reds-b 2538d8e →
  6c57fef; o-c1-landing-start 44885ef → 844f485. **`src/core/sharp.js` auto-merged**, as A's read predicted for C1's repair. No judgement call was needed.
- **Two fixes, each its own commit:** a2156b9 (C1's CHANGELOG "turning right" → "turning left") and f3cd425 (C's comment nit on the reader).
- **Tests on f3cd425:** the touched rows 110/110; the three mutation harnesses **applied 43 / caught 43 / NOT APPLIED 0**. **The whole suite once:
  tests 4,994 · pass 4,970 · fail 0** · todo 3 · skipped 21. No red; the three todo rows are the known three.
- **Built, NOT installed:** the exe sha256 **d63134c6de297cd3f1e66358f6e76c8b1719623f5fb6aeb51f0464a6f345159c**, the installer sha256 **8358a623a5681c841581fe07d71ae199fd5131493c324d5c97eca53968a52159**. The installed builder is still the 62f5b95 one (3d6b3faa…).
- Nothing went to main, no tag, no release.

## 1. The merges, and how the conflicts were resolved

checked: `git fetch origin`; `git rev-parse --short origin/<branch>` → a8e54b7, 7e42f02, 2538d8e, 44885ef; each 2 commits on merge-base ceb21f5.

Order: reader, pit gap, Sharp, C1 (Sharp before C1, so C1's sharp.js lines meet B's already in place). Every merge is `--no-ff`.

| merge | conflicts | resolution |
|---|---|---|
| reader-downray-e → f6ee487 | none | |
| l-pitgap-a → 9d1a59f | CHANGELOG.md, Fixed | both bullets kept: the menus entry already on landing-1126 first, then the pit-gap entry |
| d677-sharp-reds-b → 6c57fef | none | |
| o-c1-landing-start → 844f485 | CHANGELOG.md, Changed; MAP.md, the `sharp.js` line | CHANGELOG: both entries kept, Sharp's first. MAP: below |

- **sharp.js.** A's merge note is question 5 of `p-sharp-gate-read-A_2026-11-26.md` (§"The five questions", :132-155; there is no heading "§5").
  It says that with C1's repair 44885ef, `sharp.js` auto-merges with B's change and only CHANGELOG.md and MAP.md conflict. That is what happened.
  O's lines (`p-d677-build1-C1-repair-O_2026-11-26.md`: `:20`, the require with `landingKind`; `:96-97`, the probe's kind and `er`) came in untouched.
  checked: `grep -c -E '^(<<<<<<<|=======|>>>>>>>)'` on sharp.js, CHANGELOG.md and MAP.md → 0 each.
- **MAP.md.** Both branches rewrote the parenthesis on the one `sharp.js` line, each adding a clause. The two clauses are joined word for word, B's
  first, with `tightestSharp` kept last, as both sides had it. A script refused to join unless the two lines differed only in that parenthesis.
  checked: `git diff-tree --cc 844f485 | grep -c '^++[^+]'` → 1, that MAP line. The other three merges have 0 lines of their own.
- **CHANGELOG.** checked: after each resolution, against each parent, the resolution removed no line of either side. It only added the other
  side's lines.

## 2. The two fixes

- **a2156b9, CHANGELOG.md:88.** "on a 5° / 30° edge turning right" → "turning left". This is A's finding in `p-c1-landing-reread-A_2026-11-26.md` (:11-17):
  the case was measured at +90°, and + = left (`sharp.js:8`).
- **f3cd425, tools/piecewise.cjs:165.** "a landing is always within its gap of the take-off station" → "a landing is always at least its gap from the
  take-off station". This is C's nit in §3 of the Re-read section of `p-reader-downray-read-C_2026-11-26.md`. C called it a one-word fix ("within" →
  "at least"). I changed "of" to "from" as well, because "at least its gap of" does not read. The meaning is C's. It is a comment only;
  checked: `node --check tools/piecewise.cjs` → ok.

## 3. The tests

**The touched rows** (one `node --test --test-concurrency=1` run, under the lock, BelowNormal, S/batch-rows.cmd → S/batch-rows-f3cd425.tap):
core_sharp, core_sharp_mutation, core_landing_xsec, core_landing_xsec_mutation, core-landing-xsec-panel, core-pitgap, core-pitgap-mutation, piecewise.
- checked: tests 110 · pass 110 · fail 0 · exit 0.
- checked, by counting the TAP rows whose name says "mutation": **applied 43 / caught 43 / NOT APPLIED 0**; pit (P) 16, landing (X) 11, Sharp (S) 16.

**The whole suite once** (`npm test`'s command, `--test-concurrency=4`, TAP; S/batch-suite.js under the lock, BelowNormal, behind `--wait-game`;
S/batch-suite.log, S/batch-suite-1.tap):
- checked: tests **4,994** · pass **4,970** · fail **0** · cancelled 0 · todo 3 · skipped 21 · exit 0 · 2,062 s.
- **The reds, against the known reds:** none failed. The three `not ok … # TODO` rows are the three known todo rows:
  - 24, the preview's material list against the kn5's;
  - 299, D642's extra-bank drag cost (p95). The log prints its "not ok", but it is a todo row;
  - 2195, the built bank on a straight road. It was 2168 at ceb21f5 (S/suite-1.tap) and moved because the batch added rows before it.
  - The load-timing reds named before (core-extra-bank-drag-cost, release-frame) did not fire.
- TabProxyWindow count before and after: 0 and 0.

## 4. The build: NOT installed

S/batch-build.js is the landing-1126 build script, retargeted to f3cd425. It runs `src-tauri/release.cjs` (version 0.4.40, `src-tauri/tauri.conf.json:4`) into
`G:Consonance-toolscargo-p641`, under the lock in slot 2, BelowNormal, behind `--wait-game` ("no game of his running").

| output | bytes | sha256 |
|---|---|---|
| `release	180-track-builder.exe` | 16,178,176 | d63134c6de297cd3f1e66358f6e76c8b1719623f5fb6aeb51f0464a6f345159c |
| `releaseundle
sisT-180 Track Builder_0.4.40_x64-setup.exe` | 8,303,437 | 8358a623a5681c841581fe07d71ae199fd5131493c324d5c97eca53968a52159 |

- checked: S/batch-build-run.log → release.cjs exit 0, 31 s. Its own scan prints "no private paths" for both files (S/batch-build.log).
- **The installer has the same file name as 62f5b95's, so this build overwrote that one in the target folder.** The batch build is also kept as
  `…undle
sisT-180 Track Builder_0.4.40_x64-setup.batch-f3cd425.exe` and `…
sis	180-track-builder.batch-f3cd425.exe`, made with `cp -n`.
  checked: sha256 of both copies → 8358a623… and d63134c6…, the same as above.
- **NOT INSTALLED**, per the packet: these are shape changes, and his word decides in the morning. checked: sha256 of
  `%LOCALAPPDATA%T-180 Track Builder	180-track-builder.exe` → 3d6b3faa…, the 62f5b95 install of 2026-11-26, unchanged (16,174,080 B). The
  backups `.before-d681-cfa7ad9` and `.before-d681i-62f5b95` are as they were.
- After the build: `git checkout -- src-tauri/Cargo.toml` (the Tauri CLI rewrites its line endings). checked: `git status --porcelain` → 0 lines.

## 5. The scan and the push

- What origin lacked: 6 commits, the four merges and the two fixes (`git rev-list HEAD --not --remotes=origin`). The four branches were already on origin.
- checked: their messages and added lines, grep for account paths, `AppData`, an email or the account name → **0**. They name no track and no handle.
- checked: the merges' own lines (`git diff-tree --cc`) → 1 line, the joined MAP line in §1. The push gate does not diff a merge's resolution, so
  that line was read by eye: it holds code names only.
- `git push origin landing-1126-batch` → `* [new branch]`. The push gate: `"t":"2026-11-27T02:02:36.952Z"`, `"decision":"allow"`.
- checked: `git ls-remote origin` → landing-1126-batch **f3cd425a4d49119137340c35de8a1b4dd3786d81**; landing-1126 still 62f5b95290035…;
  main still 3b33b38bfd85…. Nothing went to main, and there is no tag and no release.

## Corrections

- My first start of the build waited 30 minutes and gave up (exit 3), building nothing. B's prediction run held slot 1 in the shared bucket
  "(not in a git tree)", and my build script also ran from the scratch folder, so it landed in that bucket too. The run's real tree is the t180 worktree.
  The second start names it (`hold({ tree: resolveTree(WT), … })`, the D286 rule) and took slot 2. The first try's log is kept as
  S/batch-build-run.try1-timeout.log.

BASE: Downloads\t180-wt-p-1126 62f5b95
SOURCES: git fetch / rev-parse on the four branches; p-sharp-gate-read-A_2026-11-26.md:132-155; p-d677-build1-C1-repair-O_2026-11-26.md; p-c1-landing-reread-A_2026-11-26.md:10-17; p-reader-downray-read-C_2026-11-26.md (Re-read §3); git merge ×4; grep -c conflict markers; git diff-tree --cc ×4; S/batch-rows-f3cd425.tap; S/batch-suite.log; S/batch-suite-1.tap; S/suite-1.tap; heavy-run.js --status; S/batch-build-run.try1-timeout.log; S/batch-build-run.log; git push / ls-remote; push-gate.jsonl last row
NEXT: librarian reads this and tells the chair the batch is pushed and built but not installed; the keeper decides the install in the morning; O1 joins only if the chair sends it.
