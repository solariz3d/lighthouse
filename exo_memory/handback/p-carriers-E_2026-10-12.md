# p-carriers-E · D307 part 2 of 4 (ledger D308): the carriers survey · pane E, on D, 2026-10-12

Plan: `exo_memory/loop/plan_belief_origin_d307_2026-10-12.md`, part 2 (main `bba1352d`). MEASURE ONLY.

**Result: lighthouse `13dfaf31` on `bba1352d`, branch `d307-e`, worktree `G:\worktrees\e-d307-wt`, not pushed.**
- **The survey:** `exo_memory/loop/carriers_survey_2026-10-12.md` (sha256 `df71a2f52798…`).
- **Evidence:** `exo_memory/handback/p-carriers-E_2026-10-12_evidence/` (`samples/`, `count.js`, `lastblock.js`).
- **Re-derive the counts:** `node count.js samples/*.txt --blocks`.
- **Nothing in the room was changed.** portable-paths after the commit: green, 389 files, 0 new.

## The counts (figures in real samples; "with" = a time, a sha or a day says when)

| carrier | figures | without an as-of | refreshed | read until |
|---|---:|---:|---|---|
| pulse | 42 | **0** | every prompt | that turn |
| state block | 37 | **33 (89%)** | session start / compaction | the session |
| board digest `[panes]` | 10 | **10 (100%)** | every prompt, when registered | that turn |
| rings and dispatches | 27 | **10 (37%)** | each send | the receiving turn |
| hand-back summary lines | 29 | **0**, but 21 are day-only | once | indefinitely |
| the shelf (a seat's CLAUDE.md) | 213 | **54 (25%)** | spawn / restore | the session |
| session digests | 19 | **0** | session start | the session |

## What stands out (each at its § in the survey)
- **The state block (§2) is the longest-lived carrier with the most undated figures.**
  - Its header has no generation time, and its wrapper says only "at session start".
  - The three seats' latest blocks state HEADs that main has since passed by **61, 69 and 171 commits**
    (`git rev-list --count <head>..bba1352d`).
  - The chair's is from 10-10 16:33Z, and nothing in it says so.
- **The shelf (§6) has no generation stamp,** and its own counts are undated ("718 still live", "(41 live)", card and map
  sizes). Pane E's was written 10-10 18:31 local and read about 31 hours later. Its live-edge lines, by contrast, carry a code
  stamp on every line.
- **Rings and dispatches (§4):**
  - The app adds provenance but **no send time** (`main.rs:12309`, `:12398`, `:12473`).
  - Delivery to a working seat is held **without a bound** (`main.rs:10748-10755`), so a ring's figures can arrive long after
    they were true.
  - All 10 undated figures are hand-back figures carried into a dispatch's prose ("CN 27 against 9 missed lookups … compute 10,
    fs 8 …").
- **The pulse (§1) is the counter-example.**
  - Every figure sits under its own stamp, and it is rewritten every prompt.
  - The one remote fact carries a second as-of ("as of 30h ago").
  - **Copied out, it loses its stamp:** `handback/p-stalelaps-A_2026-10-11.md:7` quotes "STALE D275 52h …" with no pulse time.
- **`[panes]` (§3) is not running on D.** It is not in `settings.json`, and its installed copy differs from the repo's. The
  last real block in the chair, the librarian and pane E is 2026-09-29T13:50Z. Its figures are all relative ages with no
  stamp.

## Corrections before the counts were kept
- **`count.js`'s first run:**
  - read instance folder names (`sibling-5bf9d657`) as shas;
  - split a 64-hex digest into digit "figures";
  - lacked section-heading anchors.
- **My first samples were cut by a character limit:** the state blocks before LIVE, `[panes]` after four panes, and a digest
  timestamp mid-way, which became 3 false "undated" figures. All were re-extracted whole.
- **Two sentences were removed from the survey before commit:**
  - one citing census units (this lap maps carriers, not units);
  - one claiming the `findings-return` and `ask-surface` hooks "carried nothing today that I sampled", when I had not sampled
    them.

## Limits
- Samples, not populations: 2–3 blocks per carrier.
- The counter is a heuristic. Its rules are in its header and in the survey's §8.
- A sha counts as "with", though it says which state, not when. §8 gives the counts with shas as undated.
- **Not opened:**
  - B's new registration and its guess;
  - any census or held-out unit;
  - the board.

NEXT: librarian collate D307 part 2 when this hand-back and the other wave-1 parts are in
