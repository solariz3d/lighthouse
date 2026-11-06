# D643: 0.4.39 as released installed on this desktop; D's fork d642-b8 built beside it for the A/B (pane P)

Seat: pane P (sibling-372c8abc). Tier: CHECK IT. Not launched, nothing pushed, no release.
Scratch (S): `C:\Users\nname\AppData\Local\Temp\claude\ec51ccba2d59b61b\fbf98f8e-29da-4fb2-8610-c038d6372249\scratchpad\d643\`.

## 1. 0.4.39 as released

- checked: `git fetch --tags`. origin/main = `v0.4.39` = f2884fa. `gh release view v0.4.39` → not a draft, not a
  prerelease, published 2026-11-06T10:41:24Z. Its one asset is `T-180.Track.Builder_0.4.39_x64-setup.exe`, 8,158,860 B,
  digest `sha256:c36c953a…2005ff`.
- Downloaded with `gh release download` to S/release/. checked: `sha256sum` → `c36c953a…2005ff`, equal to GitHub's digest.
- **Installed from the release's own asset.** I did not use a local build. My build of f2884fa (S/f2884fa/, through
  release.cjs, exit 0) is a different exe from the release's:
  - mine: `27a9c326…a7980a52`, 15,876,608 B;
  - the release record's: built `a8536113…`, installed `3d1a971e…`, 15,757,312 B (`handback/p-l144-C_2026-11-06.md:105`,
    `:119`).
  - inferred: the toolchains differ between this desktop and L. Not investigated. So the order's "must match the
    release's" could only be met with the release asset.
- **S/install-release.ps1, one call: check, then install.**
  - processes: `acs` 0 and `t180-track-builder` 0 (12:50:59 local);
  - the setup's sha256 was checked against GitHub's digest before running → equal.
  - **Backup:** `t180-track-builder.exe.before-d643-064ecd5`, sha256 `6c265ca3…9c1543`, equal to the exe it replaced
    (064ecd5).
  - **Earlier backups:** 149, 0 changed; now 150.
  - Installer `/S`, hidden → exit 0. Processes after: 0. **Not launched.**
  - **Installed:** sha256 **`3d1a971e616fcb59ed25867b18db53bbdb1039b2ca0c04b1544b79e954656e4b`**, 15,757,312 B,
    ProductVersion 0.4.39. Against the release's installed exe (p-l144-C:119): **EQUAL**.
  - `T-180 Rebuilder\built-head.txt` unchanged.

## 2. The A/B exe: d642-b8 376ddc2, not installed

- checked: `git cat-file -t 376ddc2` → commit, on `d642-b8`, whose message is "Row 9 reads its bar on the median of
  three alternating runs …". 064ecd5 is in it (`merge-base --is-ancestor`).
- Built in my worktree `Downloads\t180-wt-p641`, detached at 376ddc2 with a fresh `dist`, through release.cjs, under the
  lock, BelowNormal, hidden → exit 0 (S/build-ab.log): "t180-track-builder.exe: 15876608 bytes, no private paths".
- checked: `cmp` of the 3 non-test app/src/tools files that differ from f2884fa against `src-tauri/dist` → 0 mismatched.
- **The A/B exe:**
  `C:\Users\nname\AppData\Local\Temp\claude\ec51ccba2d59b61b\fbf98f8e-29da-4fb2-8610-c038d6372249\scratchpad\d643\ab-376ddc2\t180-track-builder-376ddc2.exe`
  - sha256 **`c1838dd525f73ee62035e6c62811747294a163eb9bce07d51024fbd41b3ec441`**, 15,876,608 B.
- inferred: it shares the installed builder's app identifier (`com.solariz3d.t180-track-builder`, tauri.conf.json), so
  it reads and writes the same settings and tracks folder. Run one at a time. Not tested.

BASE: C:\Users\nname\Downloads\t180-fresh f2884fa
SOURCES: gh release view/download v0.4.39; S/release sha256; S/run.log, build.log, build-ab.log; S/install-release.ps1 output; p-l144-C_2026-11-06.md:105,119; cmp of dist files; tauri.conf.json identifier
NEXT: librarian, tell the keeper when it has read this: 0.4.39 is installed, and the A/B exe's path is above
