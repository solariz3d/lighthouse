# Packet L252 (on L; every builder pane, after L249 and L250 are handed back): the room review, first run

**His words and the design:** `briefs/room_review.md`. In short, 05:04: "We replicate what an ultra review is within
consonance". Finders in parallel over a bounded diff; nothing reported until another seat has reproduced it; and one lens
an outside fleet cannot hold, the rule against what the room is for.

**Target:** the room's code since 2026-11-20. Base d3c79b71, head = main at dispatch, `consonance/` only (53 files,
7,154 insertions and 180 deletions at 9ad12e42). Read the diff, with the whole file around each change open.

## Step 0, before any finder starts: P plants and seals (P only)
- On a branch `l252-review` from main, in its own worktree, plant **one defect per seam** (four in all): each a small
  change to the diff's own lines that breaks a written rule and that no existing test catches (run the seam's tests to
  check). Not in a test file.
- Write the four (file, line, what was changed, the rule it breaks) to a file in P's scratchpad. Ring the librarian with
  that file's sha256 and nothing else. The file is opened only at scoring.
- Finders read `l252-review`, not main, and are not told a defect was planted. P takes no finder seam; P verifies.

## Step 1: finders (one seam each; seams 1 and 2 get two finders, one per lens)

| seam | what | main files |
|---|---|---|
| 1 | cutting and compacting a seat | `src-tauri/src/close_small.rs`, `cut_at_handback.rs`, `bin/compact_probe.rs`, `tools/close-small.js`, `ui/close-small.js`, the cut and floor code in `main.rs` (L218, L235, L237) |
| 2 | starting a seat | `main.rs` spawn path and the run preset (L247), `tools/relaunch.js`, `ui/next-move.js`, `tools/agent-first-call.js`, `hooks/model-switch-note.js` |
| 3 | what a seat carries at wake | the intake and shelf code in `main.rs` (the 145,000 cap rows, the tiers), `tools/state-block.js`, `tools/shelf-tier.test.js` |
| 4 | usage and the machine | `tools/usage-ledger.js`, `hooks/usage-ledger.js`, `tools/heavy-run.js`, `tools/chain-status.js`, `bin/ring_probe.rs`, `hooks/board-digest.js`, `hooks/push-gate.js` |

- **Lens 1, the code against its own written rule.** The rule is a comment, a test's name, a packet or a brief; quote it.
  Look where a written rule and the code part: an order of steps, a missing key, a restart or compact in the middle, two
  seats at once, a value the UI accepts and the spawn refuses.
- **Lens 2, the rule against what the room is for.** His words in `briefs/lighthouse_the_room.md`, BOOT and the seat
  files say what a rule is for. Look where the code keeps its rule and the purpose is still lost. One real case to
  calibrate on, not to report: today's librarian shell carried none of its own notes (456 bytes were left), and the
  code did what it says.
- **A finding is one row:** file and line; the rule, quoted with its path; what happens instead; how to reproduce (a
  test row to write or a command to run); lens 1 or 2. No fix, no edit to the tree.
- Deliberate limits are not findings: the intake cap, who may ring whom, panes not messaging panes, no seat restarting
  the app. If one looks wrong for the purpose, it is a lens-2 row.
- Each finder files `handback/p-l252-find-<seam>-<pane>_2026-11-26.md` and rings the librarian. Zero findings is a
  valid hand-back; say what was read.

## Step 2: verify (each finding goes to a pane that did not find it; P takes the largest share)
- **Lens 1:** reproduce it on `l252-review`: write the red row and show it red, or run the command and show the output.
  Then say REPRODUCED or NOT REPRODUCED. Reading the code and agreeing is not a verification.
- **Lens 2:** build the concrete case from real files on this machine (which seat, which file, what was lost), and cite
  the words that say what the rule is for. Then say HOLDS or DOES NOT HOLD. These go to him as questions.
- Vary what the finder fixed: a different input, the plain command without the finder's flags.
- A NOT REPRODUCED finding stays in the report, in its own list.

## Step 3: the report (the librarian collates)
Verified findings ranked by what a seat would lose; the lens-2 questions for him; the not-reproduced list; and the
score. Fixes are separate laps, by his word. The red rows written in step 2 are kept on `l252-review` for those laps;
the planted defects are reverted by P and never reach main.

## Tier
**Read only** on main: no source edit outside `l252-review`, no build of the app, no install. Touched tests only where
a verifier writes a red row. Before any cargo run: `node consonance/tools/heavy-run.js --status`.

## Registered (before the run)
- **Recall:** of P's four planted defects, the finders report at least three. Fewer, and the run's "nothing found in
  seam N" carries no weight.
- **Worth it:** failed if the run returns no REPRODUCED finding, apart from the planted ones, that the per-landing pane
  reads missed.
- **The dead case:** failed if every finding comes back REPRODUCED or HOLDS and none is NOT REPRODUCED, while at least
  one finding is later shown wrong.
- **Degenerating if:** after two runs the report is mostly lens-1 rows a linter could find, and no lens-2 question has
  changed anything he decided.
