# Hand-back: b-writers-line a810578 landed (no line of the four other written files is cut), the tools named, and his copy (pane P, D677)

Answers the chair's order of 17:22:26Z. Tier: prove it (stored data). B's fix, rows and mutants (4 of 4) are B's: `p-n1-legs-B_2026-11-15.md` section 25.

**THE PUSHED SHA: dreamzone-3 main `0500d0a` → `c2af9d9b7894321dca4c9529ef31238c940048a0`**, a merge: parents 0500d0a and a810578.
a810578 was a fast-forward. I landed it as a `--no-ff` merge so that the landing has a message to name the tools in, as ordered.
    checked: the merge's tree equals a810578's ("tree equals a810578's: yes"); the suite ran on a810578's tree
    checked: remote main before → 0500d0a; after the push → c2af9d9b7894321dca4c9529ef31238c940048a0

## Which tools wrote a params file with the glued line: ONE, `dz-sim params`

    checked: the callers of the four writers on main (git grep): write_params → tools/dz-sim/main.cpp:164 (`dz-sim params`, to stdout) and
             sim/tests only; write_changed_params → game/app.cpp:91 (the gym's saved parameters, params.txt); write_settings → game/shell.cpp:143
             (gym.txt) and `dz-gym --print-settings`; write_bindings → the bindings save and `dz-gym --print-bindings`
    checked: the long line arrived with riser_keeps_speed at 59d4a22 (O's seam fix), on main in c662536 (2026-11-15)
    checked: dz-sim params from main's build (0500d0a) → 98 lines with '=', 1 glued (a parameter after a comment), walk_speed on its own line: 0;
             from the landing's build → 99, 0 glued, 1
    checked: his gym.txt (39 lines, longest 114 bytes) and bindings.txt (23 lines, longest 130) → no line near 240 bytes and none glued. The three
             lines with two '=' are comments ("count = sensitivity x 0.022", "a second = this x …", "sprint_toggle = 1 in the parameter file").
             He has no params.txt.
    checked: grep -rl "bewalk_speed" (the glued line's signature) in his clone (no build, no .git) → none; on G:\consonance-scratch → only B's
             evidence file b-writers-full\params_old.txt

**In the landing's message:** `dz-sim params` in builds of main from c662536 (2026-11-15) through 0500d0a cut riser_keeps_speed's line and glued
walk_speed onto it. A params file written from that output has no line of its own for walk_speed, which reads back as its default. Write it again
with a build from c2af9d9 on. No other tool wrote a cut line, and the text does not travel in kept runs (B, 25.3).
inferred: the gym's saved-parameters line for riser_keeps_speed is about the 163 bytes of params_line's form, under its 240. Not measured, because
he has no params.txt to read it from.

## The full suite (exclusive hold, BelowNormal; no game of his at the start or the end)

**MAIN'S OWN TEST IS GREEN.**
    checked: suite.txt → "100% tests passed, 0 tests failed out of 14", exit 0 (sim_tests among them, "Passed")
    checked: game_tests 228/0; world_app_tests 88/0; view 32/32; gym 26/26; world "selftest: passed (65 of 65 checks passed)"
    checked: the 12-seed md5 05bb5bf30ab84b932f23bf4bc273ee5d on main and on a810578; his 20 kept runs 20 of 20 to the bit, his files unchanged

## The scan, the push, his copy

    checked: b-scan-any.js on the merge → push gate allow; privacy scan 0 hits
    checked: his clone fast-forwarded to c2af9d9 (on main, 0 dirty, no game of his running); "build needed: sim\tests\params_tests.cpp is newer";
             build.bat exit 0 (17:57:28Z to 17:57:55Z); stamp written; launch.ps1 world -Check → "up to date"; dz-world.exe contains the sha (1).
             NOTHING LAUNCHED.

**A correction, mine:** my first try at the merge used `git merge -F -`, which git does not accept ("could not read file '-'"). Nothing was merged:
HEAD stayed at 0500d0a and I checked it. The second try read the message from a file.

BASE: G:\consonance-worktrees\dz3-land-p 0500d0a
