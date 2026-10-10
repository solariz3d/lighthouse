
## Identity diff (the instrument for the keeper's stop bar, item 2; the keeper, 17:16)
**Commits `508b68d3` (the tool) and `2d8ecd4d` (a scope fix from its first real run)**, both on branch `identity-diff-c`, worktree `C:\Users\nname\Desktop\worktrees\c-identity-wt`, on lighthouse main c6d46629. Not pushed. Nothing edited in gen-consumer.js; nothing beyond its existing exports is needed.

### What it is: `consonance/tools/identity-diff.js` (+ `identity-diff.test.js`, 6 rows)
- **Run:** `node consonance/tools/identity-diff.js --generate` (a fresh generation into a temp dir) or `--gen <dir>`, with `--json` for the full lists.
  Exit codes: 0 = every difference registered; **1 = at least one unregistered, listed `path:line`**; 2 = could not run.
- **The wake set:**
  - BOOT, SEED, SOURCE, TRAINING;
  - the briefs (`consonance/src-tauri/brief/*.md`, minus the `frag-*.md` templates);
  - `exo_memory/{cards,record,spread,research,memory}/*.md`;
  - `consonance/GATES.md`;
  - every non-test hook file (`consonance/hooks/*.js`, `dev/shell/hooks/*.{js,py}`).

  A seat's CLAUDE.md is not a file in the tree; the app assembles it at wake from these files.
- **How a difference is registered: read from the generator, not copied.**
  - For each shipped wake file, the tool takes its dev SOURCE from the MANIFEST's `from` (gen-consumer's own `collect()`).
  - It REPLAYS gen-consumer's own exported steps on it, one named step at a time, in `build()`'s order:
    1. `transform`, named as its sub-steps dedangle, deidentify, demachine and decoordinate when their chain equals `transform`'s output, otherwise as `transform`;
    2. `desync`, `reindex`, `dewiki`, `reseed`, `declareWorkshop`;
    3. `FORK_HOOK.apply`, my relabel and the fork note.
  - **The generated file must EQUAL the replay.** Any line where it does not is UNREGISTERED. Every line where it differs from its dev source is attributed to the step that made it.
  - A dev wake file that does not ship must be named in `EXCLUDE` or `STAYS_PRIVATE`, and its reason is printed. A wake file no MANIFEST rule produced is unregistered.
- **Copied rather than read** (said so the copy is visible):
  - The ORDER of `build()`'s calls. A changed order makes the replay differ from the output, which is loud.
  - `shippedMemory` / `shippedCards`, recomputed with `build()`'s exact two expressions, because they are local to `build()`. If they change, MEMORY.md and the dewiki'd cards come back unregistered: loud, not silent. **Ask to B:** export the two set-builders, or a `pipeline(f, body, sets)` that `build()` itself calls, so the replay stops being a copy.
- **What it does NOT prove:**
  - **That each step's own edits are right.** A step that over-reaches is reproduced by the replay and passes as that step's work (A's corrections-gate catch is that class). The report lists every attributed line by step so it can be read.
  - **The master → brief stage.** A dev seat reads the MASTER `exo_memory/BOOT.md`; the consumer reads gen-brief's brief. That stage is PowerShell with inline replacements, not importable, so it is REPORTED (line counts) and not gated; `gen-brief-gate.test.js` guards it on the dev side.

### It can come back RED (6/6 under the heavy-run lock, `scratchpad/inv/id1.log`, `id2.log`)
1. `lineDiff` reports added and removed lines with their numbers, and ignores line endings alone.
2. **A registered rewrite passes:** a card source with `journal/2026-08-16.md:722` is rewritten by the generator, and every changed line is attributed to `dedangle`.
3. **A planted unregistered edit fails, named by its line,** even inside a file the generator also rewrote: `+ 4 'Untouched line, quietly changed.'` / `- 4 'Untouched line.'`.
4. The keeper relabel and the fork note are attributed to the `fork (consumer-relabel.js)` step, line by line, on the real BUILDING and BOOT.
5. The wake set: briefs, cards, record/, GATES.md and hooks are in; tests, mutant harnesses, the generator and the brief fragments are out.
6. **On a REAL generation:** planting one line in a shipped card adds exactly one unregistered entry (`exo_memory/cards/no-floor-no-ceiling.md:4 + A line no generator step writes.`), and the CLI exits 1 naming it. This is measured as a delta, so it holds whatever the baseline's colour.

### The first real runs, reported as they came
**Run 1** (fresh generation, wake material = c6d46629's; `scratchpad/inv/id-real.txt`): **FAIL, 4 unregistered.**
- `consonance/GATES.md` does not ship.
- The three `consonance/src-tauri/brief/frag-{fork,pointer,traces}.md` were listed. **That was MY scope error, not the generator's**: they are templates injected into BOOT and SEED, never read by a seat. Fixed in `2d8ecd4d` (and a test row).

**Run 2** (`id-real2.txt`): **FAIL, 1 unregistered difference**:
```
consonance/GATES.md:0 - (the whole file)  [a dev wake file no MANIFEST rule ships and neither EXCLUDE nor STAYS_PRIVATE names]
```
**This is a real finding.** My lap-2 hand-back listed "a MANIFEST file rule for `consonance/GATES.md`" as owed to B, and it never landed. So in the consumer, every gate's refusal points to a GATES.md that is not there (the pointer falls back to "consonance/GATES.md (in the Consonance repository)"). **The fix is one row in B's MANIFEST:** `{ from: 'consonance/GATES.md', to: 'consonance/GATES.md', kind: 'prose' }`. After it, this run should come back with 0 unregistered. I have not shown that yet; it is the next run's to show.

**Everything else is registered.**
- **75 wake files** compared; every shipped one EQUALS the generator's replay (0 line-level unregistered).
- **Attributed lines by step:**

  | step | lines | files |
  |---|---|---|
  | dedangle | 208 | 33 |
  | dewiki | 70 | 7 |
  | **fork (consumer-relabel.js)** | **86** | **8** |
  | deidentify | 20 | 8 |
  | reindex | 7 | 1 |
  | reseed | 2 | 2 |

- **11 dev wake files** are not shipped, each with its EXCLUDE reason: the retired dive-buddy card, and 10 memory/ files ruled duplicate, state, or one person's profile.
- **The master BOOT → shipped brief** (gen-brief): 17 lines out, 30 in. Reported, not gated.

**What a reader should take from the counts.** "Registered" means "made by a named generator step", not "approved". dedangle's 208 lines across 33 files are the largest class by far: the record pointers turned into dated prose. They are the generator's de-record rule, which the bar names as registered, and they are listed line by line in `--json` for anyone who wants to read them before calling the copy "identical".

### Owed to B (unchanged from lap 3, plus one new)
1. **NEW:** the GATES.md MANIFEST row above.
2. From lap 3: the 3 EXCLUDE rows for `consumer-relabel.js` and its two tests. **Now also `identity-diff.js` and `identity-diff.test.js`**: they need gen-consumer.js and the dev tree, so the same reason applies.
3. Optional: export the per-file pipeline or the two shipped-sets, so the replay reads them instead of copying.
