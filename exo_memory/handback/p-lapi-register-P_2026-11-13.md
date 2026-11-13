# Lap I's build (landed is live), REGISTERED before any code: what I build, in what order, and what would show each part wrong (pane P)

Seat: pane P (sibling-372c8abc), on D. Tier: PROVE IT. No code is written yet; this file is committed first.
Packet: the chair's of 20:33Z, part B. Ruling 8, `exo_memory/loop/plan_room_stretch_2026-11-13.md:174-177`.
Read for it: the ruling (:127-190); the spec `exo_memory/loop/landed_live_2026-11-13/00_lap_i_spec.md`, I1 (:79-190), I2 (:192-231), I7
(:416-461), §6 (:658-697) and its second reader's lists (:836-857); and `00_critic.md` §1, E1 to E5 (:20-80).

## Where

- One branch, **`lap-i-p`, off `lap-w-h-p`'s head c1b9a395**: I7 edits `dev/shell/install.ps1`, which lap-w-h-p changed, and O has not landed it
  yet.
- Worktree `C:\Users\nname\Desktop\worktrees\lh-i-p`.
- Hooks, tools and node tests only. `install.ps1` is edited and tested, never run against the live setup. Its tests copy it into a temp repo with
  a temp USERPROFILE, as `install-only.test.js` does.
- Nothing installed; `settings.json` not touched; no seat restarted.
- Mutants under the ordinary lock, BelowNormal and hidden. Nothing closed: his game is running. I check the locks and the hold in one call before
  any run in another.

## What, in this order, each red first on the recorded case the spec or the critic names

1. **I1, `consonance/tools/landed-live.js`** (+ test, + mutants), with every second-reader change:
   - each `@{…}` table parsed to its closing `}` after dropping `#` lines, never by whole lines. Fixture D's `EXCLUDED BUT LIVE stop.js` row
     catches a per-line parse;
   - every fixture writes its own install.ps1 with `By` on the Lib rows it uses;
   - before I7 lands, the D-disk proof expects `LIB (no By) second-reader-worker.js`;
   - a clock seam, `LANDED_NOW`, for the hold rows;
   - the -Check agreement row runs `install.ps1 -Check` on the fixture only.
   - Recorded cases: fixtures A to E as the spec lists them, with installed bytes taken from `git show <commit>:<path>` of the real history.
2. **E1, a static test:** every literal relative `require` of a `$files` source resolves to a `$files` `To`. Red at `8e85ff11^` (board-digest.js →
   blind.js, "unmet 1"), green at 8e85ff11 and at HEAD. It takes double-quoted requires too: the critic's probe took single quotes only and found
   4 where `installer.md:259-261` lists 5.
3. **E3, a static test:** every non-Lib `$files` row has a `$register` row, or carries a reason.
   - Red today on 6 rows: board-digest.js, userprompt-submit.js, sessionstart-ambient.js, transcript-watch.js, dream-watch.js, ferry-watch.js.
   - **A reason is written only where the record gives one** (a `path:line` that runs or rules the file). I will not invent one.
   - Any row with no reason on disk stays red and is listed for a ruling. So the test may stay red on the branch, said plainly, not loosened.
4. **I7, the dated holds in `dev/shell/install.ps1`** (+ `dev/shell/install-holds.test.js`), with the second reader's changes:
   - `By` on the 7 Lib rows;
   - K3's two holds as data: `dispatch-gate.js` and `carrier-drift-watch.js`, `HoldOn = @('D')`, `HoldUntil = '2026-11-27'`, the ruling
     `exo_memory/loop/plan_room_stretch_2026-11-13.md:167`;
   - the hold tested BEFORE the ABSENT branch;
   - the registration loop skips a held leaf;
   - the -Check report's `$notWired` lines (`:671-687` on main) say HELD in place of DECLARED NOT REGISTERED;
   - a clock seam, `CONSONANCE_INSTALL_NOW`, the only new date read;
   - the tests assert the `HOLD EXPIRED` line, not -Check's exit code (it is 1 on D anyway);
   - **the existing two-way `Hold` key's message changes, and I say so.**
5. **I2, `consonance/tools/whats-live.js`** judged by cargo's dep-info (`consonance.d`, present on D: 12,858 B, 08:48 today) plus Cargo.toml and
   Cargo.lock:
   - `open-items.js` gets a `require.main` guard and exports `bundleResources`;
   - recorded case: today's RED on 53bac6a0 (only `src/MAP.md`);
   - plus the second reader's weak-spot edge: a `ui/` or `build.rs` input newer reads RED.

## Registered before the build: what would show each part wrong

- **I1 is wrong** if, on D's real disk:
  - `--all` disagrees with a bare `install.ps1 -Check` on any file's bytes, line endings aside;
  - or it prints LIVE for an entry that no `settings.json` command runs (the spec's companion clause 3);
  - or `--range 82da03fc..fe69a9fc` does not exit 1 naming the second-reader files.
- **E1 is decorative** if its fixture at 8e85ff11^ is not red.
- **I7 is wrong** if a bare run with `CONSONANCE_MACHINE=D` against the fixture still copies or registers dispatch-gate.js, or if the same run with
  `L` does not.
- **I2 is wrong** if it still reads RED on 53bac6a0's facts, or reads green when a `ui/` file, `build.rs` or Cargo.lock is newer than the exe.

## The unwelcome outcomes, named now so they are sayable

- `landed-live.js --all` and a bare -Check **disagree on D's real disk**, so the parse or the hash is wrong. Then I1 does not ship until they
  agree.
- **E3 stays red** on rows whose reason exists nowhere on disk. Then that is the finding, a list of entries nobody can say why they are installed,
  not a test to weaken.
- **I2's dep-info says the exe IS stale.** `consonance.d` is newer than the exe on D: 08:48 today against Nov 8 23:56. If its inputs are newer than
  the exe too, the RED is true. Then I2 changes the reason printed, not the verdict, and I say so.

## My stake

- I wrote lap-w-h-p's install.ps1 rows, wake-gate.js and sessionstart-body.js. I1 will read my own rows, and I would like them to come out LIVE once
  O installs them.
- Score I1's D-disk run by a seat that is not me.

BASE: C:\Users\nname\Desktop\worktrees\lh-w-p c1b9a395
SOURCES: exo_memory/loop/plan_room_stretch_2026-11-13.md:127-190; exo_memory/loop/landed_live_2026-11-13/00_lap_i_spec.md; exo_memory/loop/landed_live_2026-11-13/00_critic.md; dev/shell/install.ps1 at c1b9a395; ls of consonance/src-tauri/target/release/consonance.d and consonance.exe
NEXT: librarian read this registration when it lands; P starts I1 on lap-i-p after this file is committed and rung
