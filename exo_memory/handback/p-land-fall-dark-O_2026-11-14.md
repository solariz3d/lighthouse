# p-land-fall-dark: fall-row-b and dark-figure-e landed on the game's main as e0fcdec, pushed (O, landing pane), 2026-11-14

Packet: the chair's D675 orders of 02:30Z, 02:33Z, 02:34Z (twice), 02:35Z and 02:42Z ("GO: one tree, one suite, editing nothing"). Tier: PROVE IT. Seat: O.
The objects, read whole:
- `exo_memory/handback/p-fall-row-B_2026-11-14.md`, with its registration;
- `exo_memory/handback/p-d675-dark-figure-E_2026-11-13.md` (collated).

## THE PUSHED SHA: dreamzone-3 main = **e0fcdec40a7029965889b4e269cef13b41e9a7a6** (`81eb524..e0fcdec`)
Three things wait on it, per the chair: E re-films the Dark's clip from this main; P branches its timer control from it; B's BUILDING.md line rides its lighthouse branch.

- **Read on the remote before each merge:**
  - checked: `git ls-remote origin` → main 81eb524, fall-row-b 0a277863, dark-figure-e 7bc9f3c.
  - Each commit was fetched from origin, never from a seat's folder.
- **Landing tree:** `G:\consonance-scratch\dz3-land-fall-o`, branch `land-fall-o`, built on G:. The merge chain on 81eb524:
  - **27fcd17** merges fall-row-b 0525c64;
  - **ba27554** merges fall-row-b **0a277863** (B's CHANGELOG entry, on 0525c64);
  - **e0fcdec** merges dark-figure-e **7bc9f3c** (E's tip, with main 81eb524 already merged in by E).
- **Edited nothing. Every merge was clean:** CHANGELOG.md auto-merged. Both entries are in it as written: E's ("The Dark is drawn, in the hunter's shape") and B's ("`dz-world --selftest` exits 3 when its only reds are machine-bound").
- checked: `git diff --name-only 81eb524 e0fcdec` → 9 files, +261 -19: CHANGELOG.md, and under game/world/ main.cpp, modes.h, selftest.cpp, selftest_run.cpp, stage.cpp, stage.h, world_app.cpp, world_app.h.
- **The pop fix is intact:** checked: `git diff --quiet 81eb524 e0fcdec -- game/model_rig.cpp game/tests/model_rig_tests.cpp` → unchanged from main. The pop row stands at `model_rig_tests.cpp:1485-1524`.

## The suite on e0fcdec (each step through `heavy-run.js --run`, the ordinary lock; BelowNormal, hidden; `S\d675\fall.js`; outputs `G:\consonance-scratch\o-fall-out\`)
- checked: `build.bat test` → exit 0, 561 s: **100% tests passed, 0 tests failed out of 14**.
- checked: `dz-world --selftest` → **exit 0, "selftest: passed (57 of 57 checks passed)"**, 176 s. This is the MERGED count, with both branches' rows.
  - Fall row, counted half: 180 chunks taken in, 0 not wanted first, least lead 19 frames (2.38 m).
  - Fall row, `[machine-bound]` waits: 904 chunks, 0 waits.
  - The exit rule: (0,0) 0, (1,1) 3, (2,2) 3, (2,1) 1, (1,0) 1.
  - The Dark, while out: 0 poses and 0 palette sets before the timer.
  - The Dark, in overtime: 3,689 frames, a Dark posed in 3,688, every pose drawn.
- **Exit 0, so no exclusive re-read was owed;** there is only one reading. B's load-sensitive rows (gen, audio, nav) all passed, so none is named as load.
- checked: `dz-gym --selftest` → exit 0, **26 of 26**.
- **Binaries built:** sha256 `ef56be04876fbbfd…` (dz-world.exe) and `fb43e4eca1e9d57a…` (dz-gym.exe). These come from the landing tree's build and were not installed anywhere.

## Scan over the push range `81eb524..e0fcdec` (12 commits, 2,087 added lines)
- checked: A's `rangescan.js` (`S\d675\fall-rangescan2.out`):
  - every credential shape 0;
  - PRIV_PATTERN alt 1 and alt 2: 0;
  - the email local part: 0;
  - "keeper" 7, which is the room's ordinary word, not on the bar.
- checked: `S\land6\credwhere.js` → 0 prefixes followed by a token.
- checked: the d528 list → non-REVIEW hits 0.
- checked: my own three private terms → 0.
- **Pushed:**
  - checked: `git push origin e0fcdec:main` from the landing tree → `81eb524..e0fcdec`;
  - checked: `git ls-remote origin refs/heads/main` → e0fcdec40a70;
  - checked: `push-gate.jsonl` → **allow**, 2026-11-14T02:56:16.523Z, src e0fcdec.
- **No hook is touched by either branch.**
- **His play clone is untouched:** checked: `git -C Desktop\dreamzone-3 rev-parse --short HEAD` → 31d1c6d, status clean.
  - I fetched `fall-row-b` and `dark-figure-e` into that repository's remote refs, to have the objects. Its working tree and its main were not moved, built or edited.

## Two stops, said plainly
- **First stop (02:34Z), at the chair's "do not land 0525c64":** I stopped my first queued runner by its handle. It had spawned nothing yet and was waiting on P's hold.
- **Second stop (02:43Z), at the GO for both:** I stopped the second runner by its handle. P's hold had just ended, and its build step HAD begun: CMake and ninja wrote `build\` from 20:41:42 to 20:41:57 local.
  - Nothing else of it survived. checked: a process search by the tree and the label → none.
  - Its lock entry named pid 31980, which by then had been reused by a cmd.exe of my own, created 20:43:06. I killed nothing; heavy-run reads a holder by its image and start time.
  - The suite above rebuilt over the merged tree from that cut build.

## What L owes (for the handoff)
- **Nothing to install.** The game is built where it is played.
- **His play build (Desktop\dreamzone-3, 31d1c6d) is not updated.** The update is his word.

## Left in place (no deletes until his yes)
- `G:\consonance-scratch\dz3-land-fall-o` (303 MB, with its build);
- `G:\consonance-scratch\o-fall-out` (20 KB).
- **Nothing written to C:** for this landing, apart from my scratchpad's scripts and logs.

`S` = `C:\Users\nname\AppData\Local\Temp\claude\e1275915e2cd5544\c88002b1-74d8-4036-8cc0-f64aefbeabff\scratchpad`.

BASE: G:\consonance-scratch\dz3-land-fall-o 81eb524
SOURCES: G:\consonance-scratch\o-fall-out\build-test.out
SOURCES: G:\consonance-scratch\o-fall-out\world-selftest.out
SOURCES: G:\consonance-scratch\o-fall-out\gym-selftest.out
SOURCES: S\d675\fall-rangescan2.out
SOURCES: C:\Consonance\data\push-gate.jsonl
NEXT: librarian check e0fcdec and pass the sha to E, P and B when this ring is read; O waits for the chair's next landing
