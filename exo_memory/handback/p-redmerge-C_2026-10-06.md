# p-redmerge-C — a non-author look at B's 05f0c2c (red merge, D249). Pane C, 2026-10-06

SOURCES: exo_memory/handback/p-redmerge-B_2026-10-06.md · `git show 05f0c2c` · `git merge-tree --write-tree handles-a-d244 b-redmerge`

**Verdict: GREEN to land 05f0c2c.**
- Every red lands in exactly one place, and `g.items` / `g.count` are untouched.
- The real window now reads one line per place, and a click goes to that place's start.
- B's lines and A's handles never touch the same line, and the two branches merge clean.
- One small finding at piece BOUNDARIES (F1, a label and merge quirk, not a blocker) with a one-line fix suggested.

**Where:** a fresh worktree, `C:\Users\nname\Desktop\worktrees\c-redmerge-look-wt`, detached at `05f0c2c`, 0 links, nothing committed. FEEL tier: one probe and one
real window, no harnesses.
- Scratch is in my scratchpad `rm/`:
  - `probe.js` (sha256 `3428431f…`);
  - `probe.log` (`94000d21…`);
  - `rm_window.js` (`c97e6f96…`);
  - `win/report.json` (`a23e82ad…`).

## 1. The 2 m touch rule at piece boundaries: one place or two, and which label?
`node rm/probe.js <tree>`, under the lock. Three 100 m pieces with boundaries at 100 and 200; the reds are `self-intersection` ranges.

| case | result |
|---|---|
| A `[80,100]` + `[100,120]` (exact abutment at the p1/p2 boundary) | **1 place** "at 0.08–0.12 km (p1–p2)" |
| **B `[80,100]` + `[101,120]` (ends ON the boundary; the next starts 1 m into p2)** | **1 place** "(p1–p2)", **although the first red is all on p1 and the second all on p2** |
| C `[80,99]` + `[101,120]` (each 1 m from the boundary) | 2 places, (p1) and (p2): as B states |
| D same piece, a 2 m gap (control) | 1 place |
| E same piece, a 3 m gap (control) | 2 places |
| **F one red `[80,100]`, alone** | labelled **"(p1–p2)"**: it never enters p2 |
| G point reds at 99 and 101 | 2 places, "at 0.10 km (p1)" and "at 0.10 km (p2)" |
| H point reds at 100 and 101 | 1 place (p2) |

**F1 (small):** `pieceAt` puts a boundary s on the NEXT piece (`x < acc + length`), and it reads both a place's END and the touch rule's
"piece the place ends on" with it.
- So a red that ends exactly on a boundary is labelled as spanning both pieces (F).
- Through B's touch branch, it also merges a red that starts within 2 m on the next piece (B).
- Case A merges through the overlap branch (`it.s0 <= last.s1`, with equality).
- All three contradict "reds on different pieces that only touch stay as two places". The F label is older than this commit (the item's
  `pieceEnd` is computed the same way at `groupReds`); B's merge carries it into places.
- **Likely in practice, inferred:** validation samples every 2 m and Extend lengths are round numbers (300, 100, 60 m), so boundaries often
  fall exactly on stations.
- **Suggested fix (not built):**
  - read a place's END piece at `s1 − ε`, i.e. `pieceAt(segments, s1 - 1e-6)` when `s1 > s0`, both for `pieceEnd` and for the touch rule;
  - make the overlap test strict across pieces.

  A, B, F would then read as B intends. One function and its mutant (G7/G9 neighbourhood) would need a row.

## 2. Every red in exactly one place, g.items and g.count unchanged
The same probe: **3,000 random red sets, 9,449 groups, 0 violations** of any of these:
- the sum of `place.reds` equals `g.count`;
- `g.items.length` equals `g.count`;
- the places are disjoint (each starts after the previous one ends);
- every item's `[s0, s1]` lies inside exactly one place.

The sets used five reasons, point reds and ranges, on a 2 m grid. Reading the code agrees: each sorted item either joins the last place or opens a
new one, so none is dropped or counted twice.

## 3. The coreshell, panel and piecesui lines, and A's handles
- **The lines are as B lists them**:
  - `coreshell.js:47` (the new helper) and `:312`/`:451` (close and delete words);
  - `panel.js:270`;
  - `piecesui.js:67`;
  - `index.html:206/:208`.

  Each switches a count or loop from `g.count`/`g.items` to `placesText(g)`/`g.places`. `placeButton(it, …)` focuses `it.s`, and a
  place's `s` is its `s0`. In `index.html` the button title reads `it.what`, which on a place is the joined descriptions: fine.
- **A's `handles-a-d244` (31d1999) against B's `b-redmerge`:** `git merge-tree --write-tree` → tree `5455fa0`, **exit 0, no conflict**.
  - The shared files are `CHANGELOG.md`, `app/core/coreshell.js` and `app/core/panel.js`.
  - **No line is changed by both.** In coreshell, A's hunks end at `:271` (plus `:690`); B's are `:47`, `:311`, `:450`. In panel, A's
    nearest hunks are `:236+48` and `:281`; B's is `:270`.
  - inferred: the closest pair is panel `:270` (B) and A's `:281`. A rebase moves line numbers, and nothing more.
  - Per the plan default, whichever lands second runs its touched tests on the merged tree first.

## 4. "N places" and the click, in a REAL window on T180_TEST_APP_DATA
- **Setup:** a debug build of 05f0c2c (`cargo tauri build --debug --no-bundle`, my own target dir), on its OWN app data. The driver refuses to start if a builder is running.
- **Run 2:** B's coil (300 m, eight 90° turns at R 180, then 60 m), Close using "whole", then REAL mouse clicks (`Input.dispatchMouseEvent`) on each place.
  - **Status line:** "close preview: … the closed track OVERLAPS ITSELF in **2 places**. Apply or cancel".
  - **Header:** "The closed track OVERLAPS ITSELF (**2 places**):". There are **2 buttons**: "at 1.08–1.16 km (p4–p5)" and "at 1.91–1.99 km (p7)".
  - **Clicks:** place 1 → camera focus s = **1076.54** (its start; B reported the same). Place 2 → s = **1914.80**, inside "1.91–1.99 km".
  - 0 page exceptions. **The keeper's folder: 9 files, `keeperChanged: []`.** The run's own folder holds only `autosave.t180auto`.
- **Before, for contrast, from a VOID run (see corrections; an OLDER exe, from my 10-05 pieces-UI look):**
  - the same coil read "(12)" with 12 buttons;
  - two of them were identical, "at 1.91–1.99 km (p7)" twice. That is E's near-duplicate complaint exactly.
- Not checked in the window: the delete preview's list (`piecesui.js:67`) and the refused-export list (`index.html`). The same function
  feeds them, and B's rows cover them headless.

## Corrections, mine
- **My first window run is VOID.**
  - `cargo tauri build` failed: the CLI wants `src-tauri/dist` to exist before `build.rs` fills it, and a fresh worktree has none.
  - My chain piped the build into `tail`, so the failure did not stop it. The driver then drove the OLD exe left in my target dir.
  - Its "(12)" is that old build, not B's. It is kept as `rm/win-VOID-old-exe/` and used above only as a labelled contrast.
  - The re-run used `set -eo pipefail`, created the empty `dist`, and refused to drive an exe not newer than the build start.
    `src-tauri/dist/app/core/panel.js` contained `placesText` (grep count 1), so it was B's code.
- My probe waited about 26 minutes for the lock behind A's three harnesses. No run was made outside the lock.

## Not verified
- The full suite; any harness (B ran core-close-mutation 37/37).
- The keeper's TEST 1 (B's gap too).
- The closed-lap seam: reds just before L and just after 0 are two places. inferred from the sort by s; not probed.

NEXT: librarian collate this look when read — plan default: it lands, and whichever of it and A's handles lands second is tested on the merged tree first
