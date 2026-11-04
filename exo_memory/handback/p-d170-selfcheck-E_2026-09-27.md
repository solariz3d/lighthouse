# P-D170-SELFCHECK · ECHO: the export tests with the BVH self-check ON

**Pane E, machine D, 2026-09-27 ~16:5x.** For B's combined D169+D170 read. Repo
`C:\Users\nname\Desktop\t180-track-builder`, working tree only; nothing committed.

**Result: every test in `test/export_words.test.js` passes with the self-check on. No finding.**

## The change (`test/export_words.test.js`, sha256 `7f0360c665443e5b…` after the edit)

- **Line 20, removed:** `const OPTS = { selfCheck: false };`, with its two-line comment calling it a workaround for C's
  BVH false crossings. In its place, a note that the workaround is gone because C fixed the crossings at source
  (`src/geom/bvh.js`, p-d170-look-ghost-C §0).
- **All 10 uses of `...OPTS` removed,** so every export in the file runs with the default, `selfCheck` on.
- **One test still turns the check off, by name, on purpose:** "turning the self-check off is said in the warnings".
  It tests the switch itself, so it now makes its own export with `selfCheck: false`. Before, it read the shared
  sample, which was exported with the workaround.
- **The CLI test no longer passes `--no-self-check`,** so the CLI runs its default.

The full diff is 12 hunks: every `, ...OPTS` removal, the comment, the one test, and the CLI arguments. Seen with
`diff` against the pre-edit copy before the run.

## The run

| command | result |
|---|---|
| `node --test --test-reporter=tap test/export_words.test.js` | **20 tests: 20 pass, 0 fail, 0 todo** (44.2 s wall time) |

- **Nothing failed with the check on,** so there is nothing to report as a finding.
- **"with the self-check on (the default), the sample exports"** also asserts that the check ran (no "NOT checked"
  warning) and that no node names repeat, and it passes.

**A slip of mine, caught before it reached a number.** My first edit script aborted on its own guard: my new comment
contains the word "OPTS". It wrote nothing, and the test run that followed was on the UNCHANGED file. A `diff` count of
0 showed it. The edit was re-applied, the diff was checked (above), and the 20/20 is from the edited file.

## Also, in my D171 files (not yet landed)

`test/markers_export.test.js` had the same workaround (`OPTS = { selfCheck: false }`, 4 uses). It is removed there
too: `node --test --test-reporter=tap test/markers_export.test.js` gives **4 tests: 4 pass, 0 fail** (sha256
`9213893b9c971bd4…`). This lands with D171, not in this read.
