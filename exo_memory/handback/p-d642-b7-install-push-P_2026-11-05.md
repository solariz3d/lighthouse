# D642: d642-b7 (t180 064ecd5) installed on this desktop, then second-change-additive pushed forward (pane P)

Seat: pane P (sibling-372c8abc). Tier: CHECK IT for the install, PROVE IT for the push. E's correctness re-check of 064ecd5 is
GREEN (the librarian's collation of E's f3f13e12); no tests were re-run here. Not launched. No tag, no release; origin/main
stays d10eacf.
Scratch (S): `C:\Users\nname\AppData\Local\Temp\claude\ec51ccba2d59b61b\fbf98f8e-29da-4fb2-8610-c038d6372249\scratchpad\d642b7\`.

## Build

- checked: `git cat-file -t 064ecd5` → commit, on `d642-b7` (and `d642-b8`); `merge-base --is-ancestor a924f1b 064ecd5` → yes.
- My worktree `Downloads\t180-wt-p641`, detached at 064ecd5 (status 0 lines, `src-tauri/dist` emptied first).
- `node src-tauri/release.cjs`, target `G:\Consonance-tools\cargo-p641`, under the heavy-run lock, BelowNormal, hidden →
  exit 0 in 43 s (S/build.log, S/run.log).
  - "t180-track-builder.exe: 15876096 bytes, no private paths"
  - "T-180 Track Builder_0.4.39_x64-setup.exe: 8169088 bytes, no private paths"
- checked: `cmp` of the 6 non-test app/src/tools files changed since 923e0a3 against `src-tauri/dist` → 0 differing.
- Built exe sha256: `96e4360ef3b66927af6a8200a675da5cef4f3a7ad0475fc51a0ec7aad11b7452`.

## Install (one PowerShell call: check, then install)

- checked, in the same call: processes `acs` 0 and `t180-track-builder` 0 (21:31:14 local).
- installed before: `6f787b5a16951703cca82e2f871cc5c503ae9e504fd66b444e6aa71de48f4df5` (923e0a3).
- `scripts/install-local.ps1 -Tag d642c3-923e0a3 -WaitSec 0` → exit 0.
  - **New backup:** `t180-track-builder.exe.before-d642c3-923e0a3`, sha256 `6f787b5a…48f4df5`.
  - **Earlier backups unchanged:** `.before-l140r2`, `.before-l140r2-round2` and `.before-d641c-df62d6f`.
  - Backups in the folder: 148 before, 149 after.
  - **Installed:** sha256 **`6c265ca317dc69fa12e4ac986f762938f3cbb0a82cb99f036b87df94de9c1543`**, 15,876,096 B,
    ProductVersion 0.4.39.
  - **Stamped compare: equal.** The built exe, with only UNK → NSS at byte 13,435,208, is the installed exe.
- processes after: 0. **Not launched.** `T-180 Rebuilder\built-head.txt` unchanged.

BASE: C:\Users\nname\Downloads\t180-fresh 064ecd5
SOURCES: S/run.log, S/build.log; git cat-file/merge-base; cmp of dist files; install call output

## Push: second-change-additive moved forward one commit

- **The commit.** `git commit-tree '064ecd5^{tree}' -p 5d17a9c` with one plain line, "The extra bank finds its shortest on
  the built road, keeps the edge it found through a drag, and a slid mark walks to where it holds", plus the AI co-author
  trailer → **fb5b91c**. The local branch was moved by `update-ref` from 5d17a9c.
- **Tree equal:** checked: `064ecd5^{tree}` = `fb5b91c^{tree}` = `a954ff5269c313fc2287c0f71a1eff45336b728c`.
- **Scans over 5d17a9c..fb5b91c** (S/allterms.txt, all 72 terms with the file-rule ones included; S/scan.txt):
  - **message:** 0 terms, and 0 lap-id, seat, pane or k-word lines;
  - **added lines:** 0 terms; push-gate `findKeys` 0; loose prefixes 0.
  - Content, as before: the code comments carry 39 lap-id lines and 18 "pane B" lines, and 0 k-word lines. I read the
    order's lap-id and seat-line check as covering messages, as on 5d17a9c.
- **Push:** checked: `git push origin second-change-additive` → `5d17a9c..fb5b91c` (a fast-forward). After a re-fetch,
  origin/second-change-additive is fb5b91c and origin/main is d10eacf.
- push-gate: `{"t":"2026-11-06T03:31:50.970Z","seat":"fbf98f8e-…","decision":"allow","scanned":[{"dir":"C:\Users\nname\Downloads\t180-fresh","remote":"origin","src":"second-change-additive"}]}`
- No tag, no release. The original d642 branches are local and untouched. B's worktree was not touched.
- The lighthouse rewrite of 20:18 was already done and pushed at b31d8343
  (`handback/p-d642-lighthouse-push-P_2026-11-05.md`).

SOURCES: S/run.log, build.log, scan.txt, allterms.txt; install call output; git commit-tree/rev-parse/push in t180-fresh; push-gate.jsonl tail
NEXT: librarian tell the keeper when it has read this: 064ecd5 is installed and waits for his launch, and the branch is pushed at fb5b91c
