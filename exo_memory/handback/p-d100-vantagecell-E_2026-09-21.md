# P-D100-VANTAGECELL — the blind reader's cell moves out of the data dir (pane E, D100, 2026-09-21)

Packet: the chair's D100 packet E. Evidence read at source: `consonance/tools/second-vantage.js:109, :189`,
`consonance/state-manifest.json:84-85` (the `vantage_cell` rules), and A's D099 record behind them. Started 10:35:22 local
(`date +%T`). **Machine D**, HEAD `6ad176e`. **Nothing committed.** `git diff --numstat`: `second-vantage.js` 33/2 ·
`second-vantage.test.js` 101/0. **`consonance/state-manifest.json` untouched** (A's); the proposal is in §4.

## 0 · Headline

**The default cell is now `<os tmpdir>/consonance/vantage_cell`**, on D `C:\Users\nname\AppData\Local\Temp\consonance\vantage_cell`
(`node consonance/tools/second-vantage.js --where`). No close ever walks it. **The tool empties it before every reader.**
`VANTAGE_CELL` still overrides, exactly, and an overridden cell is **never** emptied.

    node consonance/tools/second-vantage.test.js     RED 21 / 2 → GREEN 24 / 0   (23 before this lap's last two tests)
      node --test … 24/0 · --test-concurrency=4 … 24/0 · --test-name-pattern="D100" … 5/0
    node consonance/tools/close.js --check (plain)   BEFORE: exit 0, "every gate passed"   AFTER: exit 0, the same line
    mutants: node scratchpad/d100/mutants.js         GREEN 5/0 pre-flight · 4 of 4 real rows KILLED · 2 predicted SURVIVORS (§3)

## 1 · Where, and why there

- **Out of the data dir,** because a reader's cwd is its cell. Anything a reader leaves (a scratch tree, a log) lands
  where it runs. Twice that was inside `C:\Consonance\data`, and `close.js --check` refused REFUSED_UNPLACED:
  `vantage_cell/mutants-run.log` (L068, `3d89dfb`) and `vantage_cell/_verify_refuse/` (D099, `6ad176e`).
- **Blindness is unchanged, and was checked, not assumed.** Claude Code loads `CLAUDE.md` from the cwd **and every
  parent**. I checked both chains for `CLAUDE.md`, `CLAUDE.local.md` and `.claude/CLAUDE.md`:
  `C:\Consonance\data → C:\Consonance → C:\` (the old cell), and
  `…\AppData\Local\Temp → …\Local → …\AppData → C:\Users\nname → C:\Users` (the new one). The only hit is the
  user-global `C:\Users\nname\.claude\CLAUDE.md`, which every session loads whatever its cwd, and it is the same for
  both. Neither chain is the repo or holds the room.
- **The name keeps `vantage_cell`, on purpose.** Moving the cwd renames the readers' transcript folder under
  `~/.claude/projects` (from `C--Consonance-data-vantage-cell` to `…-Temp-consonance-vantage-cell`). Things that
  recognise reader sessions by that name are the `main.rs:7407` comment, the session-journal and journal-auditor
  goals' session counts, and A's D093 "machine: vantage-cell verifier" classifier. All of them are descriptive, and all
  still find `vantage-cell` in the new name.

## 2 · Emptied per reader — my call, and the argument

**Yes for the default cell, before every reader.** A shared cell is a leak **between readers**, not only into the data
dir: `_verify_refuse/` held a copy of the state-sync sources, and the next reader launched in that cell could have read
another reader's scratch as if it were the world. So each reader starts in an empty cell.

**A cell that will not empty is a refusal, not a launch.** That is the `_verify_refuse` case exactly: a process whose
cwd was inside the tree held it, "Device or resource busy". `prepareCell` returns `ok:false` with the reason, and
`spawnReaderReal` then returns a failed read with that text, which `processRow` records as READER-FAILED. That path
is never silent (the existing test *reader failure is recorded, never silent*).

**Never for an operator-chosen `VANTAGE_CELL`.** Its contents are not the tool's to delete. It is only created, as
before.

**Not emptied after the reader,** deliberately. The before-launch emptying is the guarantee, and a leftover now sits in
the OS temp dir, which nothing walks, until the next reader's prepare removes it.

## 3 · Tests — red before, green after — and the two survivors named

- *with no VANTAGE_CELL, the resolved cell is NOT under the data dir*: **red**, "the default cell
  …\sv-data-89904S\vantage_cell is inside the data dir"
- *VANTAGE_CELL still overrides, exactly*
- *a leftover from one reader is gone before the next reader launches, and never reached the data dir*: **red**,
  "the next reader must start in an EMPTY cell". It plants the two real leftovers' shapes, `_verify_refuse/consonance/tools/`
  and `mutants-run.log`.
- *a cell held open by a process inside it is a REFUSAL*: added after green. A child sits with its cwd inside the
  cell while another prepares it; on Windows, `ok:false` is asserted.
- *an operator-chosen VANTAGE_CELL is never emptied*: green against the stub, as it must be, since today's code
  never empties anything. It is the guard that the new emptying never reaches an override.

**Every child gets its own temp root** (`TEMP`/`TMP`/`TMPDIR`, a sibling of its data dir), so no test plants in or
empties the **real** cell. That is proven, not assumed: a `SENTINEL.txt` placed in the real cell was still there after
all four run modes.

    mutants (copies in scratchpad/d100/w/; the D100 tests, because the copy sits outside the repo and three older tests need git history in REPO)
      KILLED default cell back inside the data dir · the default cell is no longer emptied
             · an operator-chosen cell is emptied too · the VANTAGE_CELL override is ignored
      SURVIVED, predicted before the run:
        - the "still holds files after emptying" check removed: a recursive rmSync either throws or removes all,
          so no test can reach a return-with-content. It is defence in depth, and the survivor is equivalent.
        - spawnReaderReal ignoring a failed prepare: that function spawns a real `claude`, which no unit test does.
          The refusal it relies on IS pinned (the held-cell test above).

## 4 · PROPOSED for A — `consonance/state-manifest.json` (not edited)

After this move, **nothing new can land in `<data>/vantage_cell`**: the tool no longer creates it. The old directory
still exists on D, holding the three empty `_verify_refuse/` directories (`ls C:\Consonance\data\vantage_cell` →
`_verify_refuse`). So:

1. **Now, while the old directory exists:** the `vantage_cell` rule's `regenerated_by` / `regenerated_when` become false,
   because nothing regenerates it any more. Proposed replacement for the `"glob": "vantage_cell"` rule:

       { "glob": "vantage_cell", "class": "STAYS", "why": "LEGACY since D100 (E): second-vantage.js no longer creates or uses this directory — the reader's cell moved to <os tmpdir>/consonance/vantage_cell, which no close walks. What remains here is the old cell and the leftovers already ruled below. THE RULE IS A SHELF, NOT A FIX: when the keeper deletes the directory, this rule and the three below read 'declared, not present' and should be removed." }

   The two named leftover rules (`vantage_cell/_verify_refuse` and `/**`, `vantage_cell/mutants-run.log`) stay as they
   are until then.
2. **Once the keeper deletes `C:\Consonance\data\vantage_cell`:** remove all four `vantage_cell` rules. If any file
   ever reappears there, it would then be UNPLACED and refuse loudly. That is the right outcome, because nothing is
   supposed to write there any more.

**A's `state-manifest.test.js:313-355` tests** build their own fixtures for those rules. Step 1 changes only the
directory rule's class and reason. **Checked:** no assertion there pins `REGENERATES` for that glob
(`grep -n REGENERATES consonance/tools/state-manifest.test.js | grep -i vantage` → nothing).

## 5 · Corrections, including mine

- **My first red for the "leftover gone" test was for the wrong reason.** The Bash heredoc turned `\\n` into a real
  newline inside the child script's string literal, so the child died on a SyntaxError, not on behaviour. The same fault
  made the override test red, when it should have been green against the stub. It was caught because a test that must
  pass had failed. It was fixed with the Edit tool, and the real red is 21/2.
- **My first mutant runner broke three ways, all mine:**
  - the anchors failed on the file's CRLF endings;
  - the first refusal exited **after** writing a mutation, which left the scratch copy mutated;
  - a pre-flight red at 20/3 came from the copy's location: three tests need git history in REPO.

  Now: CRLF-aware anchors, the file restored before any refusal, scoped to the D100 tests, and pre-flight green 5/0.
- **My first held-cell test planted `_held` in the REAL default cell** the live tool uses, and my first sandbox fix put
  the temp root **inside** the data dir. That would have made the "not under the data dir" test fail for a reason of my
  own making. Both are fixed (a sibling temp root), and I removed the `_held` leftover from the real cell by hand.

## 6 · NOT verified

- **No live reader was run.** `claude -p` in the new cell, and the transcript folder name it produces, are inferred from
  how Claude Code names project folders, not observed.
- **Two concurrent runs** of `second-vantage.js` would share, and empty, one default cell. It fires once a day on a
  clock; I did not guard against a second simultaneous run.
- **The tool's own data-dir default is still a literal**, `VANTAGE_DATA || 'C:\\Consonance\\data'` (`:91`). It is
  outside this packet, and noted, not touched.
- **L.** Its temp dir and its data dir were not checked. The code resolves both at run time.
