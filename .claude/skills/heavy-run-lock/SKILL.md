---
name: heavy-run-lock
description: Load before starting any run that could take over about two minutes or load the machine (a full js-suite, cargo test, a mutant harness, a sweep, a headless browser run, a disk walk), and whenever a packet says "under the lock" or "BelowNormal". Points at the heavy-run lock, the priority rule and the leave-the-machine-clean rules; it holds no rules itself.
---

# The heavy-run lock and BelowNormal: where the rules live

This skill is a set of pointers. The rules are in the files below. Read them there, because they change and this file does not copy them.

## The masters (open these)

- **When a run needs the lock at all, by tier:** `consonance/src-tauri/brief/COMMITTEE.md`, the bullet starting "Run what your packet's tier asks". Its sub-bullet "A run of 3 test files or fewer needs no heavy-run lock" holds the timing-session exception.
- **Turns, background runs and who runs the whole suite:** `consonance/src-tauri/brief/BUILDING.md`, section `## Turns, heavy runs and the suite`.
- **Priority, headless browsers, processes, worktrees, the leftovers count:** `consonance/src-tauri/brief/BUILDING.md`, section `## Leave the machine as you found it`; bullets **Priority.**, **Headless browsers.**, **Processes.**, **The count.**
- **The lock itself** (slots per tree, waiting, the 30-minute give-up, stale takeover): the header of `consonance/tools/heavy-run.js`, the paragraphs starting `// THE LOCK`, `// D286`, `// A SECOND RUNNER WAITS`, `// THE MAX WAIT`, `// A STALE LOCK`.

## The commands

- **Take the lock from a node script.** It is held until the process exits, and it exits loudly on a timeout:

  ```js
  require('<lighthouse>/consonance/tools/heavy-run.js').hold({ cmd: '<seat> <what this run is>' });
  ```

  `hold` is at `consonance/tools/heavy-run.js` (`function hold`). The mutant harnesses take it themselves; their headers say "holds the heavy-run lock itself".
- **Slot count and wait:** the environment variables `CONSONANCE_HEAVY_SLOTS` and `CONSONANCE_HEAVY_WAIT_MS` (read in `function acquire`).
- **BelowNormal:**
  - node: `os.setPriority(os.constants.priority.PRIORITY_BELOW_NORMAL)`.
  - PowerShell: `$p = Start-Process … -PassThru; $p.PriorityClass = 'BelowNormal'`.
  - A disk-heavy walk also needs low I/O priority: see the **Priority.** bullet.
- **The count after a run** (paste its output as printed): `node consonance/tools/leftovers.js`. An unknown flag makes it print its flag list.
