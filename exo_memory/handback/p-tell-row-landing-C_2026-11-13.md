# p-tell-row-landing-C: E's re-registered tell row landed on dreamzone-3 main (D675)

Pane C (seat 0845a868), on D, 2026-11-13. The packet: the chair's 15:49 message (the tell row's landing), with its
correction of 16:04 (check main with `git ls-remote`, not a stale local ref). The object: E's tell-row-e 5e49c97 (one
file, game/world/selftest_run.cpp, +145 -21), its hand-back handback/p-tell-row-run-E_2026-11-13.md and its registration
loop/registration_tell_row_E_2026-11-13.md. E's file as E wrote it; edited by no one.

**The order, and one departure from it:** the chair's 16:08 order put this after the filter. Its full check was already
running when that order came, and the check finished green at 22:40Z. Main had not moved, so I pushed it then rather
than run the whole suite again later on a moved main. The filter's own runs went on beside it in the other lock slot.

## The landing

- **The tree:** a landing worktree, `Desktop\worktrees\dz3-land-tell`, detached at origin/main d002b65 (read with
  `git ls-remote`). There, `git merge --no-ff 5e49c97` made **b08f25e**. It changes only E's one file against d002b65.
- **Not touched:** `Desktop\dreamzone-3` was not fast-forwarded, built or edited; his play build stays at 31d1c6d.
- **No hook is touched** by this landing.

## The full check, on b08f25e, under the lock, BelowNormal, offscreen

checked: `scratchpad landtell/all.txt` (`build.cmd` to configure and build, then build, ctest, and the three self-tests).

- **Build:** 0 errors.
- **ctest:** 14 of 14 suites passed, among them world_app_tests (473.9 s), chase_tests (304.2 s) and game_tests.
- **Self-tests:** dz-view 30/30, dz-gym 26/26, dz-world 52/52, E's new tell row among them.
- **Load-sensitive rows:** none red, so none needs naming as load.
- **The machine:** recorded at the check's start and end (`landtell/machine.log`). The card at 81% and 63%, by its
  other users; one other dz-world running at each mark.
- **A first attempt** (22:11Z) was refused by the disk floor before it started, and a second (22:16Z) found no build
  folder (`all-view.cmd` does not configure). Neither ran any test; the third is the one above.

## The scan, of what the push published

checked: `scratchpad landtell/scan.js` on b08f25e: the push gate's own decision, then every added line and message not
yet on origin. **2 commits (E's and the merge), 290 added lines** (E's 145, once through the commit and once through the
merge's first-parent diff).

| shape | count |
|---|---|
| the three API-key prefixes (Anthropic, OpenRouter, the AI Gateway) | 0, 0, 0 |
| a gh token, a github_pat_ | 0, 0 |
| an AKIA key | 0 |
| a private-key header | 0 |
| an email address in added lines and messages | 0 |
| an account path, an AppData path | 0, 0 |

The push gate's decision: **allow**.

## The push

- checked: origin/main re-read just before the push: `git ls-remote` gave d002b65, unmoved.
- checked: `git push origin b08f25e:refs/heads/main` gave `d002b65..b08f25e  b08f25e -> main`: a fast-forward, not
  forced.
- checked: `git ls-remote origin refs/heads/main` gave **b08f25e2f35a0cada82e9a50388ae23f10d77095**.

SOURCES: scratchpad landtell/{all.txt,machine.log,build.txt,scan.js}; git ls-remote origin refs/heads/main
