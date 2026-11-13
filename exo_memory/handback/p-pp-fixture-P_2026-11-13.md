# portable-paths at the base: landing-train.test.js:206 fixed on its own branch; the two rows are still red, now on a newer file that is not mine (pane P)

Seat: pane P (sibling-372c8abc), on D. Tier: CHECK IT. Nothing merged or pushed; pane O lands it with the rest.
Branch **`pp-fixture-p` at 57dd10ec** (one commit on main's 7edcc07a), worktree `C:\Users\nname\Desktop\worktrees\lh-ppfix-p`.

## The fix

- `consonance/tools/landing-train.test.js:206` wrote the account path `see C:\Users\someone\Downloads\x` as a literal, on purpose: the train's
  privacy scan must refuse it. `portable-paths.js` flags every literal drive path.
- The string is now **built at run time**: ``see ${['C:', 'Users', 'someone', 'Downloads', 'x'].join('\\')}``. That is the same move as
  push-gate.test.js's fake secrets.
  - checked: node, built string against the literal → "same string".
- **It still tests what it tested.** checked: `node --test consonance/tools/landing-train.test.js` → row 8, "the privacy scan refuses an email
  address or an account path …", **ok**.
- `portable-paths.js` and its baseline are unchanged; nothing was loosened.

## The two rows: no longer on :206, still red

- At 7edcc07a before the fix (S/lapw/pp-red.txt): rows 35 and 36 not ok, on `consonance/tools/landing-train.test.js:206` only.
- After (S/lapw/pp-green.tap): `landing-train.test.js:206` is **gone from the list**. The same two rows are red on **two new sites**:
  `exo_memory/research/stomp_recordings_and_sonniss_licence_read_2026-11-13.md:6` and `:12`, class `DRIVE FATAL-SHIPPED-INSTRUCTION`.
  - That file was committed after 8ed1f697, by another seat. Its lines name an account path on L. I did not open past those two flagged lines,
    I do not repeat the path here, and I did not touch the file.
  - It is a brief-shaped note in the public repository. The fix is its author's: a repo-relative location, or a baseline verdict if it is
    benign.
- **Also seen, not mine:** `landing-train.test.js` rows 3, 4 and 5 (a stand-in game, promotion waiting) fail identically on main's own copy at
  f6ca56b8.
  - checked: run in `C:\Users\nname\Desktop\lighthouse` with `git diff --quiet HEAD -- consonance/tools/landing-train.test.js` true → 3 not ok
    of 17.
  - No dz-world.exe was running at that moment (tasklist). I did not look for the cause.

BASE: C:\Users\nname\Desktop\lighthouse 7edcc07a
SOURCES: consonance/tools/landing-train.test.js:196-214; consonance/tools/portable-paths.js:203; S/lapw/pp-red.txt, pp-green.tap; node --test consonance/tools/landing-train.test.js on main (f6ca56b8); tasklist
NEXT: librarian route pp-fixture-p (57dd10ec) to pane O with lap-w-h-p, and the research note's two lines to its author, when this file is read; P registers Lap I next
