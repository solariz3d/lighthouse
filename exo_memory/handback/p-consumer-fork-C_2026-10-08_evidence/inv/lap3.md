
## Lap 3 (the librarian's rulings 4 and 6)
**Commit `6424a290`** on branch `consumer-fork3-c`, worktree `C:\Users\nname\Desktop\worktrees\c-consumer-fork3-wt`, on lighthouse main ab25d588. Not pushed.

### Item 6: FORK_HOOK wired
- **My one line in B's file:** `consonance/tools/gen-consumer.js:435`, directly after `const FORK_HOOK = { apply: null };`:
  `FORK_HOOK.apply = require('./consumer-relabel.js').forkHook({ repo: REPO });   // D273 lap 3 (C): the keeper split and the fork note`.
  `git diff --stat` on that file shows exactly 1 insertion.
- **`consumer-relabel.js` additions:**
  - `applyFork({ fork })` is pure and is FORK_HOOK's contract `(body, to, kind) -> { body, n }`. It relabels the registered files and passes every other file through with `n: 0`.
  - `forkHook({ repo })` is LAZY: it reads the template and HEAD's `%h %cs` (`git log -1`) on the first file it is given, not when gen-consumer.js loads. Many tests require that file and generate nothing.
- **A design change from lap 2, and why.** B's hook rewrites shipped files and cannot CREATE one. So `brief/FORK.md` and the tauri.conf patch (`FORK_OUT`, `patchTauriConf`) are dropped. Instead:
  - the template gains an end line, `<!-- end of the fork note -->` (`FORK_END`, the same bytes in JS and Rust);
  - `main.rs` `fork_section` cuts the note, from marker to end marker, out of the **bundled brief BOOT.md** (`room_brief("BOOT.md")`), which in the consumer already carries it;
  - it still adds the note after a seat's header only when the room does not already carry it;
  - a dev brief has no marker, so dev seats are unchanged.

  5 Rust tests in `fork_note_tests`, which now include "a note with no end is not guessed at" and "the cut takes nothing past the end marker". Both markers are tied to `frag-fork.md` by `include_str!`.
- **The hook runs AFTER gen-consumer's own transforms** (B's contract). My lap-2 hand-back recommended BEFORE. The wiring test shows the anchors survive `transform`, `reseed` and `dedangle` anyway: every row applied, `forked = 28`.
- **`consonance/tools/consumer-fork-wiring.test.js` (new) generates a real tree** (`G.build`, `allowDirty`) and checks:
  - `FORK_HOOK.apply` is set;
  - the note appears once, with its end marker once, at `exo_memory/BOOT.md`, `consonance/src-tauri/brief/BOOT.md`, `exo_memory/SEED.md` and `consonance/src-tauri/brief/SEED.md`, naming HEAD's sha and date;
  - site 3: `brief/BOOT.md` is in `bundle.resources`, which is where the app's header cuts the note from;
  - every relabel row reads its new wording in the output, and the old wording is gone;
  - `report.forked` equals the table's count (28);
  - leaks 0.

  **Red first:** before the line, its 2 rows failed with "FORK_HOOK.apply is not set" and "exo_memory/BOOT.md: the fork note should appear once" (`scratchpad/inv/l3red.log`). With the line it passes (`l3green.log`).
- **A defect in my own lap-2 note, found this lap:** the note quoted a card's "*he has earned…*". That puts a gendered pronoun in the shipped brief, the very property gen-brief and its gate guard. It is reworded ("or that the keeper *has earned* the hard, honest version"), and a scan of the template for he/him/his/she/her finds 0.

### Item 4: "gen-brief refuses the shipped BOOT": neither the BOOT nor gen-brief is wrong; the gate test was
- **Measured on a generated tree** (`scratchpad/inv/gen3.sh`, `l3final.log`): `consonance/src-tauri/gen-brief.ps1` **does not ship**; no MANIFEST rule reaches it, and none should. In that tree the old gate test (ab25d588's) failed 4 rows, and its "gen-brief REFUSED against the current exo_memory/BOOT.md — the installer build will fail" was, in full, **"The argument '…\gen-brief.ps1' to the -File parameter does not exist"**. Nothing refused anything; a missing script was reported as a refusal.
- **gen-brief's rule is right for what it does and has no job in a consumer tree.** It turns the keeper's MASTER BOOT into the shipped brief, stripping the record before it reaches strangers. A consumer tree IS that shipped side:
  - it has no master: its `exo_memory/BOOT.md` is the shipped brief, relabelled and carrying the fork note;
  - its anchors are gone by construction;
  - the planted-leak probes in the gate test WRITE to `exo_memory/BOOT.md`, which there is the person's own room.

  So I did not change gen-brief or the BOOT. I changed **the gate test** (`consonance/tools/gen-brief-gate.test.js`):
  - in a consumer tree (`CONSUMER-STATUS.md` at the root, which only gen-consumer writes), its 7 generator rows are skipped BY NAME, with the reason given;
  - a new row checks, directly on both shipped briefs, the properties the generator guards: no dated journal citation, no SELF_TRACE or living-wave outside `inheritance/`, exactly one `Latest entry:** none yet`, and no gendered pronoun;
  - in the dev tree that row is skipped and every old row runs exactly as before.
- **Result inside the generated tree: 8 tests, 1 pass, 7 skipped, 0 fail.**
- **A correction inside this item:** my first draft of the new row also checked for the handle with a literal pattern. gen-consumer's de-identify pass rewrote the shipped test's `/solariz3d/i` into `/the keeper/i`, which matched every brief and failed the row. I removed that check, with a comment: the generator's own scan already refuses any output carrying the handle.

### Owed to B (EXCLUDE is B's table): three rows, shown to break in a generated tree
`consumer-relabel.js` is a dev-side generator module like `gen-consumer.js`, and its two tests can only run against the dev briefs or the generator. In the generated tree:
- `consumer-relabel.test.js` fails, because its anchors are already relabelled away;
- `consumer-fork-wiring.test.js` fails with "Cannot find module './gen-consumer.js'".

Proposed rows, in B's format:
```
  'consonance/tools/consumer-relabel.js':
    'the keeper split and the fork note are a property of the generator, as gen-consumer.js is; the consumer receives their output, not the rule',
  'consonance/tools/consumer-relabel.test.js':
    'tests the rule against the dev briefs, which a consumer tree only has already relabelled',
  'consonance/tools/consumer-fork-wiring.test.js':
    'generates a tree with gen-consumer.js, which does not ship',
```
`frag-fork.md` does not ship (no rule reaches it). Its content ships injected in BOOT and SEED.

### Tests, all under the heavy-run lock, `--test-concurrency=1`
- **Generated tree** (`l3final.log`): build not refused, staged 371, **forked 28**, **leaks 0**; the markers 1/1 at all four paths; the new gate test 1 pass / 7 skipped / 0 fail.
- **Dev:**
  - wiring + relabel + `gen-consumer.test.js` + `gen-consumer.fixture-scope.test.js`: **91/91** (`l3green.log`). B's generator tests pass with the hook live.
  - `cargo test`: all green, **988 passed** in the main binary, 0 failed.
  - the whole consonance node suite: **2,171 tests, 2,152 pass, 12 fail, 7 skipped** (`l3node.tap`). The 12 are the same 12 names that failed at ea4f5bcf in lap 2 (dream-gate, carrier-drift ×3, heavy-run WIRING, portable-paths ×2, sourced, targetless-pull ×4). The 7th skip is my consumer-only row. *inferred: the 12 also fail on ab25d588 itself; I compared names against lap 2's clean-base run and did not re-run ab25d588.*
