# Look: E's 6047714, D250 item 2: a jump the car may fly past is a WARNING (pane B, non-author; EXPORT tier, TARGETED)

**Verdict: GREEN. Land 6047714.** My refusal rows ride with it as `7be2bfb`. There are 2 small notes, both owned by E, and neither blocks the land.

## The landing tree
Temp worktree `C:\Users\nname\Desktop\worktrees\b-jumpwarn-wt`: main `8b15ee9` with **6047714 cherry-picked alone**. It applied clean as `51e2949`. Its parents (A's 539c120 and earlier) are already in main.

My rows are on top, on branch `b-jumpwarn-rows`, commit `7be2bfb` (test only, 1 file). Not pushed.

## 1. Only the jump-reach reasons left the failing list: YES
Checked by reading `proveLap` (`src/validate/index.js:398-414`) and `core` (`:362-372`) on the landing tree, then a grep for every producer and reader of these reasons in `src/` and `app/`:
- **`core`:** only `landing-misses-zone` moves, from `red.push` to `amber.push`. Its SRC line now says it is a warning.
- **`proveLap`:** only `jump-not-caught-<g>g` and `landing-unreachable` move, from `where` to the new `warn`.
- **Unchanged and still failing:**
  - in `proveLap`'s `where`: `stall`, `leaves-surface`, `jump-gap-not-forward` (`:404/:406/:409`);
  - in `core`'s red: `jump-gap-not-forward` (`:350`), `gap-in-road` (`:256/:284`) and `head-in-the-air`.
- `ok` is still decided by `where` alone. The export still turns `lap.ok === false` into the `lap-proof` red (`fromwords.js:202`).
- `fromwords.js` only ADDS warnings: one `jump:` line per `landing-misses-zone` amber, plus one for `lap.warn`'s `landing-unreachable`. It removes no red.

Row 1 of my new file pins this split as a test.

## 2. A no-landing gap, a landing behind its take-off and every non-jump lap failure still refuse
Already pinned at export level before this lap:
- a plain red: `export_words` row 98, the 60° bowl walls;
- a failed lap proof: `app/test/export.test.js` row 51, now an inversion failing on `leaves-surface`. E's change, honest.

**New rows** (`test/jumpwarn_refusals.test.js`, 5 rows, `7be2bfb`):
- **1a:** a lap proof whose ONLY findings are a jump's reach passes (`ok`, `where` empty). The reasons are in `warn`: `jump-not-caught-6.3g`, `landing-unreachable`.
- **1b** (×3): a **stall**, the car **leaving the surface** and a **jump whose landing is not ahead** each still FAIL the lap proof. Each lands in `where`, never only in `warn`. These go through the exported `lapOf`. With the export's `lap.ok === false` → refused rule (row 51), that means they refuse.
- **2:** a real **hole**, a road segment of the landing road made a gap with no ramp, in E's closed 60 m jump lap. It is **RED `gap-in-road` and refused** by `buildFromSegments`, while the same lap without the hole exports. This was pinned before only in TEST mode, where it is listed and not blocking. A normal export of an open track refuses earlier (`NOT_CLOSED`), so this needed a closed lap.

`jump-gap-not-forward`'s export refusal is covered by composition: it is a red (`validate_jumps:141`, unchanged), and any red refuses (row 98). I did not build a closed core lap with a backward landing, because a core flight always carries its ramp ahead.

## 3. The CHANGED D250 tests are honest restatements, not loosenings
Read diff by diff on the landing tree. Each one keeps its subject: the miss is detected, the fall named, the source cited. Each moves the severity to amber or `lap.warn`, and **each adds an assertion that it is NOT red or not in `where`**. Most also add a no-warning control.

| test | what changed |
|---|---|
| core_jump row 3 | the miss is now read from amber, plus "not red", plus a both-caught control with no landing warning. |
| validate_head (×2) | `worst` 3.2 / 6.3 and the source are still asserted, now from amber; plus "not red"; the second adds a clean control. |
| validate_jumps | the uncaught jump is in `lap.warn`, and no `jump-not-caught` is in `where`. (It no longer asserts `lap.ok === false`, which is the ruling itself.) |
| vocab-corpus | the median jump misses: amber plus "not red". |
| export_words | "a lap the proof fails is refused" becomes "the same lap EXPORTS with the plain `jump:` warning naming the 6.3 g fall". This is the ruling stated directly. The refusal subject moved to row 51 and to my rows. |
| validate-ui-jumpdefault (×2) | "red, and only that" becomes "nothing red, and the miss is amber"; the sculpted-past jump keeps its count and fall, from amber. |
| core-pieces-ui row 14 | A's note words only. |
| export.test row 51 | the red track is now an inversion (leaves-surface), so the row still tests a refusal with sources. |

**Note 1 (E, small): preview-async row 3b's control is weaker.** It now checks `jp.check.amber > 0` plus "landing-misses-zone not in others". A count does not say WHICH amber. It would pass with any other amber on that track. A tighter control would assert the merged result carries a `landing-misses-zone` amber, if the check exposes the list; if it exposes only a count, compare against the one-piece check's amber count. The row's main assertion (merged equals one-piece) is untouched.

## Numbers (targeted, under the heavy-run lock, on the landing tree; logs `jumpwarn/run.out`, `run2.out` in my scratchpad)
E's 17 files plus my new file: **267 passed, 0 failed, 1 skipped** (the long-standing vocab-corpus one).

| file | passing |
|---|---|
| jumpwarn_refusals (new) | 5 |
| core_jump | 15 |
| validate_head | 9 |
| validate_jumps | 17 |
| vocab-corpus | 24 (+1 skip) |
| export_words | 20 |
| export_test_unfinished | 6 |
| validate | 25 |
| core_cup_fixtures | 8 |
| doc-jump | 16 |
| validate-ui-jumpdefault | 8 |
| validate-ui | 21 |
| share-install | 13 |
| preview-async | 10 |
| core-shell | 28 |
| export | 18 |
| jump-ui | 4 |
| core-pieces-ui | 20 |

**Note 2 (E, small, a side effect): `landing-unreachable` is no longer shown in the validation panel.** `app/validate-ui/index.js:61` lists only `lap.where`. `landing-unreachable` has no amber of its own, so after this change it appears only in the export warnings and the install line, never in the panel. Before, it showed there as a lap failure on a closed lap. A one-line fix would list `lap.warn` in the panel, amber-coloured (`lapWhereText` already has words for it, `labels.js:53`). This is the chair's call; it is not a blocker for the ruling.

## Not established
- No harness was run (per the packet). E flags that `core_jump_mutation`'s patterns target row 3 by name.
- No real window, and no AC.
- My row 1 drives `proveLap` through `lapOf` with a hand-made deferred result. Its 3 failure kinds are built directly, not reached from geometry.
- E's count was 262 on its own tree (539c120 base). Mine is 263 for the same 17 files on `8b15ee9`, which also carries fe6ad5a. I did not chase the difference of one row.

## My slips
- My first run had `doc-jump` at the wrong path (`app/test/` instead of `test/`), which ran 0 tests. It was re-run at the right path: 16/16.
