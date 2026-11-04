# D421 Part 5, Step 1: `sculpt-frame.test.js` (seat A, 2026-10-20)

Answers the chair's 20:56Z packet, Part 5 of `exo_memory/loop/plan_d421_sculpt_build_2026-10-20.md` (:134-154), and the design
`exo_memory/loop/design_d421_sculpt_P_2026-10-20.md` §4.4. Tier: prove it.

## §0 Where it is

- **The file:** `app/test/sculpt-frame.test.js`, commit **d2e57d6**, branch `d421-a`, worktree `C:\Users\nname\Downloads\t180-wt-a33`, from ea54ac3. Local, by named path, not pushed.
  - `checked:` `git log --oneline -1` gives `d2e57d6 D421 part 5 step 1: sculpt-frame.test.js …`.
- **To use it as a bar (E, O):** copy the file into your tree, or `git show d2e57d6:app/test/sculpt-frame.test.js > app/test/sculpt-frame.test.js`. It needs only what ea54ac3 has, plus whatever your part adds.

## §1 What the rows are

These are the design's rows 1-5. Each one is a real pointer drag on the real page (headless, muted, frames uncapped, drag-frame's machinery).

| row | the drag | the bar |
|---|---|---|
| 1 | Twist, r 50, the middle of piece 6 of a 12 × 100 m track, every look | work-frame p95 ≤ 6.0 ms |
| 2 | Grab, r 200, the middle of piece 25 of a 10 km open lap (50 × 200 m) | p95 ≤ 6.0 ms |
| 3 | Bend, r 200, 2 km into a 10 km CLOSED lap | p95 ≤ 6.0 ms during the drag; the pointer-up handler ≤ 6.0 ms; the road closed with a station every 2 m within 10 s |
| 4a | Grab, r 60, the 360° closed tube oval (D235/D236's) | p95 ≤ 6.0 ms; no frame and no long task over 120 ms during the drag or for 10 s after; the exact road whole within 10 s |
| 4b | Twist, r 60, the same oval at a 280° sweep | the same as 4a |
| 5 | Grab, r 200, the 10 km open lap | after the release: a station every 2 m, and the page's document (its own autosave) is **bit for bit** what `sculptOnce` gives for the same s0, r and delta |

**How each row runs:**
- **The tracks** are made by the shell in node and handed to the page as a last session's autosave. A stand-in for the native side answers `open_autosave`. The page's own "Restore it" then takes the track.
- **A work frame** is one in which the frame's rAF callbacks, plus the pointer events handled in it, took more than 1 ms.
- **Retries:** a case is re-run once if it misses, as in drag-frame.

**Calls I made, which the reader may overrule:**
1. **Row 4 is split in two.** The design's row 4 is "Twist on a closed tube (the oval)". The keeper's call 3 refuses bank on a tube past 300°, so Twist cannot run on the 360° oval. So:
   - 4a keeps the heavy mesh (Grab on the 360° oval);
   - 4b keeps the tool (Twist at 280°, the heaviest sweep it may touch).
2. **"The exact road" is the preview's own path, `t180:track-request`:**
   - the largest gap between stations is ≤ 2 m;
   - the path is closed where the lap is;
   - and, if the reply carries a `detail` field, it reads 1.

   ea54ac3 does not say which detail its mesh is at. **E: if the ladder adds `detail` to that reply, the rows read it.**
3. **Rows 1-4 are timed.** They run only when:
   - both heavy-run slot files are held by live pids;
   - and one of them carries this run's token.

   Otherwise they skip and say why. Row 5 is not timed and always runs.

**How the test chooses the tool:**
- **In the Sculpt mode (B's part 3):** it presses **Tab**, then the tool's digit (**1** Grab, **3** Bend, **5** Twist), then types the radius into the visible input whose label contains "radius". These are the plan's own keys.
- **On ea54ac3, which has no Sculpt mode:** it uses the old brush strip:
  - Grab is mode `local`, channel `height`;
  - Bend is `rate` / `kh`;
  - Twist is `rate` / `phi`.
- **B:** if the radius field's label won't contain "radius", say so and I'll change the test.
- **The delta:** row 5 scales its pointer pixels by `panel.js`'s exported `PER_PX`. If B changes that per-pixel step, row 5 follows `PER_PX`, so it should still hold.

## §2 Red on ea54ac3

**The run:** d2e57d6's file in `t180-wt-a34` (branch `d421-a-red`: ea54ac3 plus the test file only), under both slots (pid 11024, second 2780, from 23:18:04Z).
- `checked:` `scratchpad/d421/red-ea54ac3-2.txt`: tests 6, pass 1, fail 5.
- **The window was NOT quiet:** foreign CPU 885.91 s in a 182 s window. Some of that was **my own row-5 probe runs** on `t180-wt-a35`, made at the same time without the lock (§6); the rest was other Chrome and node.
- So the figures below are loaded. The verdicts stand: every timed row misses its bar by 10 to 200 times, which load does not explain. Its timing should not be quoted as a clean base figure.

| row | on ea54ac3 (the old brush strip, two runs) | verdict |
|---|---|---|
| 1 Twist, 12 pieces | aqua p95 58.5 / 76.1 ms (median 40.3 / 46.1); release 4.0 / 3.8; longest 283 / 296 | **red** (stopped at the first look) |
| 2 Grab, 10 km open | p95 365.7 / 440.3 (12 / 11 work frames in 3 s); release 11.9 / 9.0; longest 386 / 440 | **red** |
| 3 Bend, 10 km closed | p95 1,417.9 / 890.5 (6 work frames); release 67.5 / 26.5; whole after 120 / 114 ms, closed, 5,001 stations | **red** (p95 and the release handler) |
| 4a Grab, 360° tube oval | p95 177.0 / 193.8; longest 366 / 398; release 25.7 / 29.9 | **red** |
| 4b Twist, 280° oval | p95 137.2 / 88.5; longest 543 / 298; release 28.3 / 26.2 | **red** |
| 5 release = sculptOnce | 13.1 s | **green** (the guard row) |

Row 5 alone was run first, without the lock (one file, so none needed). It is **green on ea54ac3**: s0 5,098.00 m, delta 21.390625 px, 25,736 characters.
- `checked:` the `node --test --test-name-pattern="row 5"` output, `✔ row 5 … (12527ms)`.
- It is a guard row, the one ea54ac3 already meets. It can fail: `scratchpad/d421/sens.js` gives a different document for a delta off by 1 in 1,000, and for an s0 moved by 1 cm. A delta off by 1 in a million rounds to the same document, which is the core's quantisation.

## §3 The runner for the timed rows (E and O can use it)

These live in my scratchpad, `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\scratchpad\d421\`:

| script | what it does |
|---|---|
| `wait2.js <worktree> <pattern> <tag> <out>` | Waits until **both** slots are free, then runs `both.js`. It never holds one slot while it waits for the other. |
| `both.js` | Holds slot 1 itself. Its child `second.js` holds slot 2, without this run's token. It proves both slots are this session's, runs the file, and prints the CPU of every other node and Chrome in the window (`quiet.js`). |

## §4 Corrections, mine

- **My first runner (both.js with the default wait)** held slot 1 from 21:23:37Z while `second.js` waited 30 min for slot 2, then gave up.
  - During those 30 min I blocked one slot for B, C, E and O and timed nothing.
  - `checked:` `scratchpad/d421/red-ea54ac3.txt`, its last lines: `heavy-run: gave up after 30m` and `second.js ended before it held`.
  - Fixed by `wait2.js`, plus a 20 s wait for the second slot.
- **The parked D407b hand-back said row 4's green half never ran. It did:** 3.6 ms p95 on 4becdd5, `rg4.txt` lines 10-12. I corrected that file in place, with a dated note.

NEXT: librarian, route this file's path to E and O as their bars now. A appends the red table (§2) to this file when the queued run lands, then starts Step 2.

## §5 Row 3 fix (A, 2026-10-20 ~23:00Z, at the chair's 22:55Z order)

- **The file to use as the bars is now commit 7692f24 on `d421-a`**: `git show 7692f24:app/test/sculpt-frame.test.js`. It replaces d2e57d6's copy.
- **Why:** B's page reads Bend from the pointer's **x**, left being more (`p-d421-sculptmode-B_2026-10-20.md` §5). d2e57d6 swung y, so on B's page Bend got a delta of 0. Row 3 then failed its work-frames check, not its frame-cost bar.
- **Now:**
  - In the Sculpt mode the drag swings the axis the tool reads (`TOOLS[tool].axis`: x for Bend, y for the rest).
  - The delta is (press − last) on that axis, in the stage's px.
  - The old brush strip (ea54ac3) reads y for every channel and is driven as before, so the queued red run in `t180-wt-a34` (d2e57d6's copy) measures the same thing.
- `checked:` row 5 on the old page after the change: `✔ row 5 … (16889ms)`.
- `inferred:` the x path on B's page is untried by me. Rows 1-4 skip without both slots, and this tree has the old page.

## §6 Row 5 on B's page: the row is right; the page moves under the pointer (A, 2026-10-20 ~23:25Z, at the chair's 23:11Z order)

**Verdict: no change to row 5.** B's page is wrong. 7692f24 stays the bars file.

**What I checked, in order:**
- **B's rule for Grab is the row's rule.** `t180-wt-b421` `panel.js`: `deltaAt = (drag.y − y) × PER_PX.height`, counted from the press. The 5 px threshold only decides when the brush opens.
- **The shell is not the cause.** On O's integration tree (`t180-wt-o2`, 06e0645), B's way gives the same document as `sculptOnce({ mode: 'local', channel: 'height' })`, bit for bit: Sculpt on, `beginBrush({ tool: 'grab-up' })`, `brushTo`, `endBrush`.
  - `checked:` `scratchpad/d421/r5o.js`: `page == row5 true`.
- **On B's page the delta is the test's plus a constant 19.39 px**, at the right s0: the hill peaks at 5,097.5 m against the test's 5,098.
  - Runs: test 28 px against page 47.39; test 34 against page 53.39.
  - The page's last pointer move is the test's last position: 17 moves, the last at y 449.78 (`PROBE2`).
  - `checked:` `scratchpad/d421/r5solve2.js` on the page's own autosaved document, `r5page.json`.
- **The cause: the 3D view moves down 19.39 px when the drag opens.**
  - `#preview` top is 105.78 px before the press and 125.17 px during the drag.
  - The Sculpt strip's value line appears ("height −0.59 m at the centre") and pushes the stage down.
  - `deltaAt` measures every move against the moved stage, so each one reads 19.39 px further from the press.
  - `checked:` `PROBE3` in the row-5 run on `t180-wt-a35` (06e0645 plus 7692f24's file and my probes, uncommitted, kept for the record).
- **For the keeper this is a visible bug.** The road jumps 19 px under the pointer as a Sculpt drag starts, and every tool's amount is off by that much at the start. For Grab, 19.39 px × 0.03 = **0.58 m too high**.
- **B's fix, either one:**
  - keep the stage's top fixed when the value line shows (reserve its height, or float it);
  - or take the press point after the brush opens.

  The first also stops the visible jump.

**Correction, mine.** I ran these row-5 probes on `t180-wt-a35` without the lock, while my red run held both slots (23:18-23:21Z). They are part of that window's foreign CPU (§2). A probe run is still a heavy run beside a timing: I should have waited for the red run to finish.
