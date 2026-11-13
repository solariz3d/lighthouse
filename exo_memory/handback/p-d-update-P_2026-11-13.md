# D brought current: Desktop/dreamzone-3 at 31d1c6d, built and green (14 of 14); the room's hooks on D checked, nothing installed (pane P)

Seat: pane P (sibling-372c8abc), on D. Tier: CHECK IT. Nothing launched, nothing installed.
Scratch (S): `C:\Users\nname\AppData\Local\Temp\claude\ec51ccba2d59b61b\fbf98f8e-29da-4fb2-8610-c038d6372249\scratchpad\d13update\`.

## 1. Before

- checked: no dz-world, dz-gym or acs.exe running (tasklist); no heavy-run hold or lock (both slots and `heavy-run.hold` absent).
- Desktop/dreamzone-3 was at cab3530 on `main`, with a clean tree. `git fetch` → origin/main 31d1c6d, 91 commits ahead. None of them
  touch `.gitmodules` or `third_party`.

## 2. The update

- `git pull --ff-only` → **31d1c6d** ("Merge a-d673-overtime (A, L203) by the landing train").
- `git submodule update --init --recursive`: the four submodules are as before (DirectXTex may2026, Jolt v5.6.0, cgltf v1.15,
  recast v1.6.0).
- `git lfs pull`: `git lfs ls-files` shows both models present as files (`*`): hunter.glb 6487b9cb29…, kid.glb d38901dd73….
- The tree is clean after.

## 3. Build and test (S/run.js: an ordinary heavy-run hold as ordered, slot 1, 14:47:46Z to 14:59:09Z, BelowNormal, windowsHide)

| step | exit | time | as read |
|---|---|---|---|
| `build.bat` | 0 | 82 s | "[104/104] Linking CXX executable bin\dz-world.exe"; dz-world.exe 08:49:08, dz-gym.exe 08:49:05 local |
| `build.bat test` | 0 | 601 s | **ctest: 100% tests passed, 0 tests failed out of 14** |

The 14 suites (S/build-test.log): core, sim, yardstick, model, gen, gen_walk, gen_drop, world, nav, chase (444.9 s), audio, game,
ragdoll, world_app (596.7 s). The selftests were not asked for and not run.

## 4. The room's hooks on D: `dev/shell/install.ps1 -Check` (report only)

- Read first: every write in the script is in a non-Check branch (:404-405, :437-446, :453-469), and the Check path exits at :757,
  before the settings.json registration at :833.
- Run with `powershell.exe -NoProfile -ExecutionPolicy Bypass -File dev/shell/install.ps1 -Check` → exit 1 (drift found). The full
  output is in S/install-check.txt (5,031 lines).
  - inferred: it compared against the lighthouse checkout as it stood at about 08:50 local (a081de4f, or a later librarian commit;
    the checkout moved to 7208245d while I worked).
- **23 ok.**
- **10 DRIFT** (installed copy differs): hooks\l2-overseer-worker.js, userprompt_pulse.py, board-digest.js, hooks\second-reader.js,
  hooks\second-reader-worker.js, hooks\sources-gate.js, hooks\push-gate.js, hooks\delete-gate.js, hooks\ask-ending.js,
  hooks\release-chime.js.
- **3 ABSENT** (never installed): dispatch-gate.js, carrier-drift-watch.js, hooks\second-reader-note.js. The script warns that
  installing them registers their hooks.
- **Registration** (settings.json: 19 hooks across 7 events; the repo's $register: 24 entries):
  - 4 DECLARED, NOT REGISTERED:
    - UserPromptSubmit userprompt_pulse.py;
    - PreToolUse dispatch-gate.js;
    - Stop carrier-drift-watch.js;
    - PostToolUse hooks\second-reader-note.js.
  - 1 REGISTERED, NOT DECLARED: UserPromptSubmit `~\.claude\shell\hooks\userprompt-submit.js`.
  - 3 EXCLUDED BY RULING, correctly absent: jev-flags.js, l2-overseer.js, l3-overseer.js.
  - **1 EXCLUDED BUT LIVE: Stop `hooks\stop.js`** (the ruling "keeper 2026-09-06 06:55 - ready pair only"). The script does not
    unregister; this needs a hand decision.
- The destination also holds 4,950 UNCLAIMED code files under `~\.claude\shell` (duration and drift-watch scratch, `_tmp_*` files),
  and 5 hooks declared unmanaged with their reasons (ask-surface, baton-wake-stop, claim-check, jev-flags, live-mirror-stop).

BASE: C:\Users\nname\Desktop\dreamzone-3 cab3530
SOURCES: tasklist; heavy-run lock files; dreamzone-3 git fetch/pull/submodule/lfs; S/run.log, build.log, build-test.log; ls -l build/bin; dev/shell/install.ps1 (read :370-470, :586-757) and its -Check output S/install-check.txt
NEXT: librarian route the hook drift for a keeper call when this file is read; the panes build on D's 31d1c6d now
