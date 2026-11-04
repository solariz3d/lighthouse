# p-stateblockstamp-C — D309 part 1 (ledger D310): the state block says when its facts were true. Pane C (sibling-0845a868), 2026-10-12.

**2e1722c3** on `d309-c` (`G:/worktrees/c-d309-wt`, from main 6af6d01c; local, not pushed).
- **Files:** `consonance/tools/state-block.js` and `consonance/tools/state-block.test.js`.
- **Evidence:** `exo_memory/handback/p-stateblockstamp-C_2026-10-12_evidence/` (red, red2, green and mutant logs, and the mutant runner).
- **Not changed:** `sessionstart-state.js` did not need to change.

## Consumers, traced first (checked: `git grep` for state-block / state_block / "machine-generated, regenerate" / "room state at session start" / "(check: " over code, tests and records' tools)
- **`consonance/hooks/sessionstart-state.js`** runs the generator and wraps its output in `[room state at session start, source=…]`. It never parses the block. Its test (`sessionstart-state.test.js:44`) matches `/state-block: machine-generated/` on line 1, which is unchanged.
- **`consonance/tools/state-block.test.js`:** the generator's own rows.
  - The CONDITION (a) row matches `check: <cmd>` anywhere in the text, so it still finds it after "as of".
  - The museum-clause rows scan all prose. The new header line passes them: no "you are", "only", "remember" or "in this thread".
  - The D273 row slices `REPO … JOURNAL` by indexOf.
- **`dev/mutation/mutate-sb.js` and `dev/mutation/mutate-name.js`:** older mutation harnesses that anchor on this file's text.
  - checked: `mutate-sb.js`'s four string anchors are still present verbatim (the repo `return`, the `FAILED: git log` line, the first header string, `MARK`). Its truncation-marker line is byte-unchanged (only its line number moved, 296 → 315).
  - `mutate-name.js` anchors only on `nameSection`. checked: the diff touches none of its lines (`git diff 6af6d01c | grep -cE "chair_name|if \(!nm\)|pointer to that record|unreadable"` → 0).
  - Both harnesses hardcode `C:/Consonance/lighthouse/…`, which no longer exists on this machine, so neither runs as written. That predates this build.
- **`dev/shell/hooks/third-place-gate.test.js`** uses its own stub block string, not the generator.
- **`consonance/tools/portable-paths.baseline.json`** pins three LIVE-section lines of `state-block.js` by exact text. They are untouched.
- **Nothing else** reads the block: not main.rs, the shelf, or any other hook.

## The change
- **Header.** A second line, after the unchanged first one:
  `generated 2026-10-12T07:27:36Z (Mon 10/12/2026 1:27 AM local, UTC-06:00); a section marked "as of" states what held then`
  - It gives UTC to the second, then the local time in the pulse's form, with the offset.
- **Sections.** Every section whose figures can go stale says so beside its own command: `REPO  as of 07:27Z  (check: git log -1 …)`.
  - The stamped sections are **REPO, JOURNAL, INSTRUMENTS, TRIGGERS and LIVE**. The plan named REPO and LIVE; the other three carry counts and a newest-file that also go stale within a session.
  - NAME carries no figure and gets no stamp.
- **Clock.** `render(sections, { now })`, and `STATE_BLOCK_NOW` (ISO) for the CLI, beside the existing `STATE_BLOCK_REPO` seam.
- **Text only:** no gate, no refusal, nothing a reader must do differently.
- **Cost against the cap, measured:** the real block is **2,929 of its 3,000-char cap** (2,725 before), not truncated.
  - The remaining 71 characters are thin. One more trigger row in SOURCE.md would bring the loud truncation marker, which falls on the LIVE section at the end.
  - Whether to raise `CAP` is a call I did not make. It is the design's enforced number, not mine to move in a stamp fix.

## Rows (red first)
- **New rows:**
  - the header carries the time in UTC and local with the offset, and both parse to the same instant (an independent parser in the test);
  - a block generated at t says t, through `render` and through the CLI (`STATE_BLOCK_NOW`);
  - REPO, JOURNAL, INSTRUMENTS, TRIGGERS and LIVE say "as of 07:25Z" beside `(check:`, and NAME does not.
- **Red, honestly:**
  - The first red run (`red.log`) had all 3 red, but the third was red for the wrong reason. A heredoc had collapsed `\\(` in its regex string, so it threw "Unterminated group".
  - I fixed the row with the Edit tool and re-ran all three against the UNCHANGED generator (`git stash` of state-block.js, `red2.log`). All 3 were red for the right reasons: no stamp line, a null parse, "REPO does not say as of".
  - Then I restored the change.
- **Green:** state-block.test.js 27/27, plus `sessionstart-state.test.js` and `third-place-gate.test.js`. **46/46** under the heavy-run lock (`mut.log` head).
- **Mutants on the stamp only** (`mut.js`, on a copy tree at 6af6d01c): **applied 10 / caught 10 / NOT APPLIED 0, control clean**, and the copy tree is clean after.
  - The mutants cover: the stamp line dropped; UTC ignoring the clock; AM/PM swapped; the offset sign flipped; no section stamped; the section time local instead of UTC; `opts.now` ignored; `STATE_BLOCK_NOW` ignored; NAME stamped; LIVE not stamped.
- **After committing:** portable-paths green (389 files / 455 known sites / 0 new); carrier-drift GREEN.

## Does the live hook need an installer sync? **No.**
- checked: the installed hook `~/.claude/shell/sessionstart-state.js` is byte-identical to the repo copy (`cmp`), and this build does not change it.
- Installed flat, its first candidate `~/.claude/tools/state-block.js` does not exist. So it runs the generator from `~/.consonance.json`'s `room_path`, which is `C:\Users\nname\Desktop\lighthouse\exo_memory\BOOT.md`, i.e. the main checkout's `consonance/tools/state-block.js`.
- So the stamp takes effect at the first session start after 2e1722c3 is in the main checkout. Nothing is copied by the installer.

**Leftovers, mine:** `G:/worktrees/c-d309-base` (detached, clean) and `scratchpad/d309/`.

NEXT: chair lands 2e1722c3 with the full suite; the stamp is live at the next session start once main's checkout has it.
