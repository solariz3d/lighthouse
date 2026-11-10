# D647 release 0.4.40: released and installed; CI still running (pane P)

Seat: pane P (sibling-372c8abc). Tier: PROVE IT. Continues `exo_memory/handback/p-d647-release-P_2026-11-09.md` (the stop) after the
chair's 22:48Z ruling: PROCEED with no re-run; row 4b stays out of the release notes. Steps 4–6 done. Not launched.
Scratch (S): `C:\Users\nname\AppData\Local\Temp\claude\ec51ccba2d59b61b\fbf98f8e-29da-4fb2-8610-c038d6372249\scratchpad\d647\`.
Worktree `C:\Users\nname\Downloads\t180-wt-p647`, detached at b977eeb.

## Step 4: the release commit

- b977eeb "Release 0.4.40" on 5cb76b5, made as v0.4.39's were (e2d5a0f + 6509bc0) by S/bump.js: version 0.4.39 → 0.4.40 in
  src-tauri/tauri.conf.json, Cargo.toml, Cargo.lock; CHANGELOG `## [0.4.40] - 2026-11-09` under an empty [Unreleased]; README's
  installer line and the version list.
- Two changelog lines the batch lacked, added to 0.4.40 (wording in S/bump.js:18-19): Added, "The mark where an extra change starts
  now explains itself." (the labels, 890c2a7/82ae771); Fixed, "A bank change refused for rolling too fast now names a limit that is
  true." (273e28d). Each ends by saying the road built is unchanged.
- checked: the 6 test files that read the changelog, README or version files, at b977eeb → 88 tests, 87 pass, 1 skipped (S/docs.tap).
- correction: that was 6 files run WITHOUT the heavy-run lock; the rule allows 3 or fewer lockless. Small and short, but over the line.
- Release notes = the 0.4.40 section only (S/notes.md, 4,371 B): no scan figures, no row 4b.

## Scan (9aab3ce..b977eeb)

- checked: S/d625 scan over the range and allterms over its outputs → messages clean, 0 of the 72 terms, credential keys 0, loose
  prefixes 0. One lap id remains, carried forward from main: MAP.md "since L140" (pre-existing, noted in the D646 hand-back).

## Step 5: build, push, tag, release

- Build of b977eeb under the heavy-run lock, BelowNormal, hidden (S/../d647b/build.js, ~100 s, CARGO_TARGET_DIR G:/Consonance-tools/cargo-p641):
  exe sha256 f45ca2ee21e05dfdcc341594f12fa147aff5ad13e18d363dcc7d8548e9a9f4d6, 15,889,920 B, ProductVersion 0.4.40;
  installer `T-180 Track Builder_0.4.40_x64-setup.exe` sha256 6feeb9317c4c31f04877ff36b3901baf56ab3523be441717d599cb00fcbb0c26,
  8,182,105 B. The 4 changed shipped files cmp equal to the build's dist.
- Push (separate turn from the suite, per the order): main 9aab3ce..b977eeb fast-forward, plus lightweight tag v0.4.40, one command.
  checked: push-gate log, one entry, allow, 2026-11-09T22:54:32.942Z.
- checked: `git ls-remote origin refs/heads/main refs/tags/v0.4.40` (23:52Z) → both b977eebbc70fef8e4b4c60f51806b732a9396a18.
- checked: `gh release view v0.4.40` (23:52Z) → not draft, not prerelease, https://github.com/solariz3d/t180-track-builder/releases/tag/v0.4.40;
  one asset T-180.Track.Builder_0.4.40_x64-setup.exe, digest sha256:6feeb931…0c26, 8,182,105 B = the local installer above.

## Step 6: install

- checked (one PowerShell call, 16:55:02 local): Get-Process acs, t180-track-builder → 0 and 0, before and after.
- Backup `t180-track-builder.exe.before-d647-9aab3ce` = sha256 F4B632EF… (the 9aab3ce install, as ordered); backups 153 → 154.
- Installed from the release asset's installer (same sha256 as the asset digest). checked (23:52Z): installed exe sha256
  **5e6dea7428b1ae7693a48f0fc96d6a5ee3d9e8733a01dbee1aaac44ae54d71fb**, 15,889,920 B, 0.4.40. install-local.ps1's stamped compare:
  equal to the built exe but for 3 bytes; `cmp -l` → offsets 13,449,016–18, U→N N→S K→S (the UNK→NSS install stamp). built-head unchanged.
  Not launched.

## CI: NOT YET CONCLUDED

- checked (`gh run list` / `gh run view --json jobs`, 23:51Z): 42716005200 (main, b977eeb) and 42716009551 (tag v0.4.40) both
  in_progress since 22:54:4xZ, job "fast" on step "Fast subset"; job "mutation" skipped on both (as configured for push).
  The last run on 9aab3ce (42681217789) succeeded in ~49 min; these are at ~57.
- inferred: slower, not hung; no conclusion claimed. ci.yml publishes nothing, so the release does not depend on it.
- A watch is running (`gh run watch --exit-status` on both); I re-ring with the two conclusions when it returns.

BASE: C:\Users\nname\Downloads\t180-fresh 5cb76b5

## CI concluded (appended 00:05Z 11-10)

- checked: `gh run watch --exit-status` then `gh run list` → **42716005200 (main, b977eeb): success**, completed 2026-11-10T00:02:09Z.
  **42716009551 (tag v0.4.40, same commit b977eeb): failure**, completed 2026-11-09T23:55:47Z; job "fast" failed, "mutation" skipped.
- checked: `gh run view 42716009551 --log-failed` (saved S/ci-tag-failed.log, 3,712 lines) → TAP tests 3539, pass 3480, fail 1, skipped 56,
  todo 2. The one failure: `app/test/core-extra-bank-drag-cost.test.js:94`, "dragging the extra bank back toward level … within 2 × …
  (p95)": "the rolling drag's p95 is 51.6 ms a move, the early drag's 25.1 ms: 2.06 ×, over 2 ×". The other two listed rows (aclook :219,
  drag-cost :111) are todo rows.
- inferred: the known drag-cost timing row (red on main in D646 at 2.27×, green in D647's local suite at 1.85×), flaking on a shared runner;
  the same commit passed in the main run. Nothing changed, nothing re-run; the release and install stand. A re-run of the tag run is the
  chair's call.
