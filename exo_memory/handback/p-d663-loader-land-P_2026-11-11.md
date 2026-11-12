# D663 model loader landed: dreamzone-3 main d638463, the kid and the hunter in Git LFS, green under the exclusive hold (pane P)

Seat: pane P (sibling-372c8abc), the landing pane. Tier: PROVE IT. Nothing launched by me but headless Blender (textures.py, inside
my hold). Scratch (S): `C:\Users\nname\AppData\Local\Temp\claude\ec51ccba2d59b61b\fbf98f8e-29da-4fb2-8610-c038d6372249\scratchpad\d663loader\`.
The watcher log is beside this file: `p-d663-loader-land-P_2026-11-11_watch.log`.

## 1. Git LFS on this desktop

- `git lfs install`, run in Desktop/dreamzone-3: "Updated Git hooks. Git LFS initialized."
  - checked: `git config --global filter.lfs.clean` → `git-lfs clean -- %f`.
  - The clone now has LFS's pre-push, post-checkout, post-commit and post-merge hooks. git-lfs 3.3.0.

## 2. The merge, and one conflict

- `git merge --no-ff 766a934` (d663-loader-c: fd24602 vendors cgltf v1.15 and DirectXTex may2026 as submodules; 766a934 is the
  loader, 33 files) on main 955c4e1.
- **Conflict: CHANGELOG.md, one hunk.** Both sides only added to the top of "### Added": main's `start_biome` entry (5 lines) and C's
  model-loader entry (18 lines). Resolved by keeping both, main's first, line endings kept (CRLF), using S/d663loader/resolve.js.
  It refuses unless there is exactly one hunk.
  - checked: 0 marker lines after; `git diff 955c4e1 -- CHANGELOG.md` removes 0 lines. Merge → **456f39c**.
- `git submodule update --init third_party/cgltf third_party/DirectXTex` → 360db1a9 (v1.15) and 4feb3e11 (may2026).
  - checked: `git ls-remote <upstream>` finds each sha at its upstream repository.

## 3. The models, in LFS

- `git lfs track "content/models/*.glb"` → `.gitattributes` gains `content/models/*.glb filter=lfs diff=lfs merge=lfs -text`.
- The three files, matched by sha256 against C's §8 and A's `d659\out\`:
  - kid.glb d38901dd73e3…, 25,634,852 bytes;
  - hunter.glb 6487b9cb2902…, 21,871,340 bytes;
  - kid.joint_map.json 8395226817be…, 5,850 bytes, from A's `joint_map.json`.
  - All copied from C's `worktrees/dz3-loader-c/content/models/`, which has the same hashes as A's.
- Commit **d638463**, by named paths: .gitattributes and the three files. `git lfs status` showed the GLBs as "LFS" and the joint
  map as Git.
  - checked: `git show HEAD:content/models/kid.glb` → the pointer text (`version https://git-lfs.github.com/spec/v1`, `oid
    sha256:d38901dd…`, `size 25634852`).

## 4. textures.py and the suite at d638463 (S/d663loader/run.js, in Desktop/dreamzone-3)

- `hold({ cmd, exclusive: true })` queued behind B's D665 step 2 hold. **Taken at 02:36:13Z, "other locks now: none".**
- textures.py ran inside the hold, before the build: "4 maps written", exit 0, 1 s. The DDS hashes are as at D660 (81c33203…,
  fc3acaa2…, 4f59f443…, 67489595…).

| step | exit | time | as read |
|---|---|---|---|
| textures.py (headless Blender 5.2.3) | 0 | 1 s | 4 maps written into assets/textures/apartment |
| `build.bat` | 0 | 25 s | cgltf compiled in; dz-world.exe 20:36:39, dz-gym.exe 20:36:38 local |
| `build.bat test` | 0 | 424 s | **ctest: 100% tests passed, 0 tests failed out of 11** (model_tests is the new eleventh, 0.23 s) |
| `dz-gym --selftest` | 0 | 3 s | **26 of 26** |
| `dz-world --selftest` | 0 | 155 s | **52 of 52**; "models: kid: 139125 vertices, 205050 triangles, posed through its joint map …; hunter: 127116 vertices, 138048 triangles, posed from its bones"; fall row 0 waits |

- The watcher, 02:36:13-02:46:21Z: all 302 ticks show only my hold and my lock, and only my own processes. textures.py's 1 s fell
  between ticks.
- No game was running after; the tree is clean.

## 5. Scan, push, and the LFS check

- Scan origin/main..d638463, 4 commits (S/d663loader/scan-dz.txt):
  - credentials: push-gate findKeys 0, loose prefixes 0;
  - terms: non-REVIEW 0;
  - priv.txt (d457, sha256 c6c793f9…, not printed): total 0.
- Pushed **955c4e1..d638463**: "Uploading LFS objects: 100% (2/2), 48 MB", then `main -> main`. push-gate allow at
  2026-11-12T02:46:51.759Z.
  - checked: `git ls-remote` → d63846356d3c0228498d5f0154b4fc085a2d8a09.
- **The GLBs went up as LFS pointers:** checked with `gh api repos/…/contents/content/models/<f>?ref=d638463`. The stored content
  decodes to the pointer for both:
  - kid.glb: `oid sha256:d38901dd…`, `size 25634852`;
  - hunter.glb: `oid sha256:6487b9cb…`, `size 21871340`.
  - `git lfs ls-files -l` lists the same two oids. `git lfs push --dry-run origin main` → 0 lines (nothing left to upload).

## 6. lighthouse

- `git merge --no-ff d664-a` (A's final D664 hand-back, text only) → c3cf00c8. The scan and push follow this file's commit, and are
  in the ring.

BASE: C:\Users\nname\Desktop\dreamzone-3 955c4e1
SOURCES: S/d663loader/run.log, watch.log, textures.log, build.log, build-test.log, world-selftest.log, scan-dz.txt, rangescan-dz.out, resolve.js; git lfs install/track/status/ls-files/push --dry-run; gh api contents; git ls-remote (origin and the two upstreams); sha256sum of the models and DDS; push-gate.jsonl
NEXT: librarian collate the loader as landed when this file is read; P lands D664 next
