# Hand-back: b-settings-line 0500d0a landed (a settings line is never cut), a fast-forward of main, and his copy (pane P, D677)

Answers the chair's order of 16:07:04Z. Tier: prove it (stored data). B's fix and its mutants (3 of 3) are B's. This lap read the fix,
checked his own settings files, ran the full suite, pushed, and built his copy.

**THE PUSHED SHA: dreamzone-3 main `cfc7e15` → `0500d0a652f469c7f3ea79810f2f6f1584927679`**, a fast-forward of one commit.

    checked: cfc7e15 is an ancestor of 0500d0a; the commit changes CHANGELOG.md, world_settings.cpp/.h and world_app_tests.cpp (4 files, +57 -5)
    checked: the fix → write_world_settings no longer formats into char buf[240]; world_setting_line builds the line as a string, with the
             same padding (name to 18, value to 8), " # ", the whole description and a newline
    checked: remote main before → cfc7e15; after the push → 0500d0a652f469c7f3ea79810f2f6f1584927679

## Stored data: his own settings files were never cut

The old writer could cut only a line over 240 bytes. His files, read-only, line lengths and shapes only, no contents printed:
    checked: game\config\world.txt → 49 lines, longest 225 bytes, 0 lines with two assignments; clean in git
    checked: game\config\world.local.txt → 3 lines, longest 115 bytes, 0 lines with two assignments
So nothing of his was glued or lost, and nothing needs repair.

## The full suite (exclusive hold, BelowNormal; no game of his at the start or the end)

**MAIN'S OWN TEST IS GREEN.**
    checked: suite.txt → "100% tests passed, 0 tests failed out of 14", exit 0
    checked: world_app_tests 88 tests, 0 failed; B's row a_world_settings_line_longer_than_any_buffer_is_written_whole_and_the_next_setting_survives_it:
             ok, "read back: no error; anim_idle_shift 0.40 (wrote 0.40), new_animation 1 (wrote 1)"
    checked: game_tests 225/0; view 32/32; gym 26/26; world "selftest: passed (65 of 65 checks passed)"
    checked: the 12-seed md5 05bb5bf30ab84b932f23bf4bc273ee5d on main and on 0500d0a; his 20 kept runs 20 of 20 to the bit, his files unchanged

## The scan, the push, his copy

    checked: b-scan-any.js 0500d0a → push gate allow; privacy scan 0 hits
    checked: his clone fast-forwarded to 0500d0a (on main, 0 dirty, no game of his running); build "needed: game\world\world_settings.h is newer";
             build.bat exit 0 (16:40:45Z to 16:40:57Z); stamp written; launch.ps1 world -Check → "up to date"; dz-world.exe contains the sha (1).
             NOTHING LAUNCHED.

## For him

When the overlay (F1) saves settings, a setting can no longer vanish after a long line. Nothing changes in play.

BASE: G:\consonance-worktrees\dz3-land-p cfc7e15
