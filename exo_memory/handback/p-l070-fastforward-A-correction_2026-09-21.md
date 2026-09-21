# P-L070-FASTFORWARD · ALPHA — CORRECTION, written on D, before collation: "skip, not stop" makes the launch's verdict FALSE, and my uncommitted change is what L's next launch will run

**Pane A, machine D, 2026-09-21 ~08:5x.** A correction to `exo_memory/handback/p-l070-fastforward-A_2026-09-21.md`,
which exists **only on L's disk, uncommitted** (chair's restore point `bc3f2a1`). I cannot edit that file from D, so
this file carries the correction. **Nothing edited on D except this file.** Read-only on the code below, at D's HEAD
`06bf966`. `sync_launch.rs` and `main.rs` are committed, so L runs the same lines; L's tree differs only in the seats'
dirty files.

## 0 · THE DEFECT, in my own design

My L070 §1 chose **"a refused file is SKIPPED, not a stop"**: every other file in the set still lands, and the install
returns rc 1. I argued it from inside `installTree` (what arrives must not depend on sort order). **I did not trace the
consumer.** The consumer says the opposite of what now happens:

| step | code (D @ 06bf966) | what happens on L's next MIGRATE launch, with my dirty state-sync.js |
|---|---|---|
| the launch runs the CHECKOUT's tool | `main.rs:11055` — `repo_root()…join("state-sync.js")` | the dirty L070 file runs, not HEAD's |
| with `--install` on MIGRATE | `main.rs:10961` | `--pull --install` |
| my change | `installTree` (L070) | `lap.jsonl`, `board.jsonl` REFUSED and kept (LOCAL-AHEAD, 74 and 1,003 local rows in my L dry run); **every other TRAVELS file installed as before**, including `panes.json` through the roster transform and the capture tails |
| exit code | `cmdPull` | 1 |
| the verdict | `sync_launch.rs:257-264`, `Pull::Failed` → `LocalHouse` | *"the pull did not complete … **The data dir was not promoted**, so this is THIS MACHINE's house, not the synced one"* |

**That sentence would be false.** Most of the data dir *was* promoted: D's roster was adopted and D's tails installed.
The keeper would be told they are in L's own house while sitting in a roster adopted from D. And because L's head stays
D's until L publishes (C §6 step 5), this is not a one-off. **It happens on every L launch.**

**What it is NOT:** data loss. Before L070, the install replaced lap/board and moved L's rows to the attic (recoverable).
After, the rows stay in place and the other files install as they did before. The regression is the **verdict**, not
the data.

**And the chair's note has the timing wrong in a way that matters:** `bc3f2a1` says L's next launch replaces `lap.jsonl`
*"unless A's state-sync fix has landed first."* **Uncommitted is not dormant.** The launch runs the working tree, so my
unreviewed change is already the one L's next launch will run.

## 1 · THE CHOICE — named, not taken (it changes what L receives)

- **(a) STOP, before writing anything (my recommendation).** Pre-scan every `install: fast-forward` file first. If any
  would be refused, refuse the WHOLE install before the first byte lands. Then *"the data dir was not promoted"* is
  true, `installed: false` is exact, and the pre-L070 refusal wording *"nothing further was written"* is true again.
  It is still order-independent, which was my reason for skip; it gets there by checking first rather than by
  skipping. **Cost:** until L publishes an L-authored head, L receives nothing from the state set on launch — no
  roster, no D tails. That is C §6's order anyway: publish from L, then D pulls under the guard.
- **(b) keep skip, and make the launch say what happened.** It would need a new completion field and a new verdict in
  `sync_launch.rs` (not mine), naming "partly promoted: these files kept". It is more machinery, in two owners' files,
  to describe a state (a) never produces.

## 2 · BEFORE L'S NEXT LAUNCH — the keeper's call, not a seat's

With my L070 change on L's disk, L's next launch will print a false verdict (§0). Without it, the launch replaces
lap/board again and attics L's rows, as C documented. **Neither destroys data.** The choice between them, or landing (a)
first, is the keeper's or the chair's. The chair's HOLD covers `close.js` only; **a launch is not held**, and this is why
it may need to be.

## 3 · STILL OWED FROM ME ON L — not done, and cannot be done from D

1. **`TRACKED_RESULT`** is still a placeholder in the L070 hand-back §3. `node consonance/tools/state-sync.mutants.js`
   was started twice on L. The first run was killed by my own `timeout 580`. The second (task `bxkk3lr1e`) was stopped
   when the session ended, with no summary line. **The tracked harness has not completed against the L070 change.**
   Run it with no timeout.
2. **No map line** for L070 was written, and **the librarian was never rung for L070**. I was waiting on (1).
3. Whether (a) or (b), the change needs its tests re-run (`state-sync.test.js` was 89/0 on L) and its mutants
   re-scored.

## 4 · NOT VERIFIED

- **No launch was run** on either machine. §0 is read from the code, not observed.
- That L's `sync_launch.rs`/`main.rs` equal D's `06bf966` copies is inferred from both being committed, not diffed on L.
- Whether anything downstream of `LocalHouse` undoes a partial install — I found nothing in `sync_launch.rs:240-275`; I
  did not read further.

NEXT: librarian route §2 to the keeper before L's next launch, and carry this file into L070's collation with the hand-back on L, when this file is read
