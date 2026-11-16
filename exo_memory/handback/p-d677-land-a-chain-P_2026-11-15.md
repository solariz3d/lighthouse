# Hand-back: landed dreamzone-3 a-chain bb99b7e (the new animation system, behind its own switch, off by default), and his copy (pane P, D677)

Answers the chair's orders of 23:30:44Z, 23:32:18Z (a newer tip), 23:42:24Z (land bb99b7e by its sha) and 00:03:24Z (the pelvis line). Tier: prove it.

**THE PUSHED SHA: dreamzone-3 main `c662536` → `9a33902308b5e19f1a7b82468756fd8e2b2482a4`** (a merge: parents `c662536`, `bb99b7e`).

    checked: git ls-remote origin refs/heads/main before the push → c662536 (fetched in the landing tree); after → 9a33902308b5e19f1a7b82468756fd8e2b2482a4
    checked: bb99b7e contains b955a90, 939878d and f354afd; does NOT contain 2d95009 (git merge-base --is-ancestor, each)

## 1. The switch

**`new_animation`**, a world setting:
- `game/config/world.txt:46`: `new_animation = 0`;
- `game/world/world_settings.h:70`: default 0.0, range 0 to 1;
- read at launch in `game/world/world_app.cpp:130` and `:458` (`new_anim_ = … > 0.5f`).

With 0 (or no key), every body is drawn by the old pose code. With 1, the runner and the hunter are drawn by the new system. For one launch, `--world new_animation=1`.

## 2. The train, and how it held the known fault

**There is no train config on this machine** (no `landing-train.config.*.json` in the data dir). So this landing ran the train's steps by hand,
as B's landings of today did:
1. merge in a tree of its own on G: (`G:\consonance-worktrees\dz3-land-p`);
2. one suite;
3. the train's own push-gate and privacy scans (`b-scan-any.js`, which calls `landing-train.js` `scanForPush` and `privacyScan`);
4. the push;
5. his copy built with the stamp script.

**The train cannot hold a red row:** its check is the suite's exit code, a red batch is set aside, and it has no known-fault list. The game's
harness (`tests/dz_test.h`) has no known-fault mark either. So **the gate for this landing was row by row:** the cadence row the only red, every
other row green; any other red, or the cadence row passing, would have stopped it. The landing's commit message names it.
**Consequence for the next landing:** main's own `build.bat test` now exits 1 until the cadence is fixed. The next landing must carry the same
named exception, or the train needs a known-fault list.

The merge was clean: "Automatic merge went well", 0 unmerged paths. The settings-pair rule was not needed.

## 3. The full suite, once, in a quiet window

**How it ran:** `G:\consonance-scratch\p-land.cmd`, under the EXCLUSIVE heavy-run hold (both slots were free), BelowNormal, on G:'s trees.
No game of his was running at the start or the end (`tasks_start.txt`, `tasks_end.txt`). Outputs: `G:\consonance-scratch\p-land-out\`.

    checked: head.txt → cfea52e (the merge as first committed; the amend below changed only its message: the tree 4511a530… is the same in 9a33902)
    checked: suite.txt → "93% tests passed, 1 tests failed out of 14"; the one: "12 - game_tests (Failed)"; suite exit 1
    checked: game_tests.txt → "214 tests, 1 failed"; the one FAIL: the_new_systems_runner_steps_as_often_as_the_measured_runners; exit 1
             its figures: "at 2.5 m/s: 3.50 steps a second (the runners' 2.69, sd 0.15): OUTSIDE"; 3.5 m/s: 3.50 (2.86, sd 0.18); 4.5 m/s: 3.50 (3.06, sd 0.22)
    checked: world_app_tests.txt → "87 tests, 0 failed", exit 0
    checked: view.txt → 32 of 32, exit 0; gym.txt → 26 of 26, exit 0; world.txt → "selftest: passed (65 of 65 checks passed)", exit 0
             (no clock row red; the 12:31Z ruling was not needed)

## 4. Off means off

    checked: node G:\consonance-scratch\p-land-md5.js main-sweep.txt land-sweep.txt →
             main c662536 (its own build in G:\consonance-worktrees\dz3-main-p): 22 lines, md5 05bb5bf30ab84b932f23bf4bc273ee5d
             the merge, switch at its default:                                       22 lines, md5 05bb5bf30ab84b932f23bf4bc273ee5d
    The sweep: `dz-chase sweep --seeds 12 --first 1 --levels 1 --policies line,flee,cutback --max 300 --threads 2`, cut from "survival, seconds"
    through the "where chasers caught" header. That cut reproduces A's registered fa938de45995bd2d13b98ba28fae0c34 from A's own file
    (p-l210-grip-A_2026-11-14_evidence/chain_l210_s2/base_equiv.txt). Main's value differs from A's because O's seam fix (c662536) changed the simulation.

## 5. His kept runs, with it off

**All 20 of his kept runs**, not B's seven: his runs folder `Desktop\dreamzone-3\game\runs` holds 20 (40 files, each a .txt with its .dzr), five of them from today.
Copied to `G:\consonance-scratch\p-land-runs`.

    checked: replays.txt → 20 of 20 "exit 0", 20 "the same run to the bit"
    checked: sha256 of his 40 run files before (p-land-runs.before.sha) and after → identical: his records unchanged

## 6. The scan, the push, his clone, his copy

    checked: b-scan-any.js 9a33902 → "push gate decision: allow"; "privacy scan: 0 hits"
    checked: no dz-world or dz-gym of his running from his clone; his clone on main, 0 dirty tracked files; git merge --ff-only origin/main → HEAD 9a33902…; submodules in step
    checked: G:\consonance-scratch\p-his-build-out.txt → "before: build needed: tools\yardstick\yardstick_tests.cpp is newer than the last build";
             "build.bat exit 0, started 2026-11-16T00:25:20Z, ended …00:25:34Z"; "stamp written"; launch.ps1 world -Check → "up to date", exit 0
    checked: build\bin\dz-world.exe contains "9a33902308b5e19f1a7b82468756fd8e2b2482a4" (1 match). NOTHING LAUNCHED.

## 7. THE ONE LINE, for him to add himself (no tool writes world.local.txt)

In `Desktop\dreamzone-3\game\config\world.local.txt` (he has the file; it is read over world.txt), add:

    new_animation = 1

Remove it, or set it to 0, to go back. **What to expect with it on:**
- the runner looks sped up: it steps 3.50 times a second at every speed, against the measured runners' 2.69 to 3.06 (the cadence row, red);
- no idle beyond the breath;
- the runner's sprint arm is too high;
- the backwards step is still wrong;
- the pelvis's stride turn is about half its size (1.7 / 2.7 / 3.6 degrees each way, where it should be 3.1 / 5.3 / 7.1).
  Pane B found it: a frame interval was read from two rounded times. It is fixed at b-chain-down 2d95009 and comes in the next landing.

## Corrections and what went sideways

- **A first run on 939878d was STOPPED** at the chair's 23:32Z newer-tip order, while main's build was compiling. I killed it by checked ids, not
  /T (`G:\consonance-scratch\p-gate\kill-tree.js`: the one node root matched by command line and process name; descendants taken only when they
  started after their parent; each killed by id). My first try at that refused, correctly: four processes matched the text, three of them my own shells.
- **One orphan of that stop:** the script had already reached the landing tree's `build.bat`, which started `git submodule update --init` at 17:34:58,
  after my process list was read. I let it finish (the landing needed that submodule) rather than leave a half-made module. Its outputs were set aside:
  `G:\consonance-scratch\p-land-out-939878d-stopped`.
- **The merge message was amended before the push** (unpushed, tree unchanged) to carry both known faults with figures, the pelvis line at the
  chair's 00:03Z order. Its first form claimed "the only red row" before the suite had run. The suite then confirmed it.

BASE: G:\consonance-worktrees\dz3-land-p c662536
