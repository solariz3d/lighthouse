# p-catch-seam: the catch counts after the seam fix, side by side (pane O), 2026-11-15 — a read; nothing changed

Packet: the chair's D677 order of 19:34Z. Tier: check it. Seat: pane O (sibling-36313935), on D.

## What ran
- **Main c662536,** in a detached tree `G:\consonance-scratch\dz3-o-catch`.
  - checked: `git ls-remote origin refs/heads/main` → c6625363c82d; the tree carries `riser_keeps_speed` (`sim/params.h`, 1 line).
  - checked: built through heavy-run → `dz-chase.exe` linked 13:36 (`G:\consonance-scratch\o-look\catch-build.out`).
- **The standing sweep of the bots** (pane A's, `p-l210-grip-A_2026-11-14.md:14`) at **every difficulty**:
  - `dz-chase sweep --seeds 12 --first 1 --levels 0,1,2,3 --policies line,flee,cutback --max 300 --threads 2`;
  - 144 runs each; arena 2 chunks each way; default dials; today's chase (`turn_law` 0, `sway` 0.30, every L182 dial at its default).
- **Twice, through heavy-run's lock and its own wait:**
  - **shipped**, the seam fix on;
  - **old rule**, `--move "riser_keeps_speed=0"`.
  - checked: each sweep's `--csv` `move` column → shipped `""`, old `" riser_keeps_speed=0"` (`catch-shipped_runs.csv`, `catch-old_runs.csv`).
  - Each exit 0, 121 s and 122 s (`catch-shipped.out`, `catch-old.out`).
- **The table:** `catchtable.js` over the two CSVs (`catchtable.out`).
  - "Never caught" means the run reached its 300 s.
  - **"Median to a catch" is over the CAUGHT runs only.** The sweep's own median column counts an uncaught run as 300 s, so it is not used here.
- **Headless simulation only:** no frame times, so no figure here depends on a game of his running.

## THE TABLE: who is caught, and when (12 seeds each)

| level | bot | shipped: never caught | shipped: median to a catch | old rule: never caught | old rule: median to a catch |
|---|---|---|---|---|---|
| gentle | line | 1 of 12 | 21.6 s | 0 of 12 | 23.6 s |
| gentle | flee | 9 of 12 | 235.6 s | 8 of 12 | 230.6 s |
| gentle | cutback | 0 of 12 | 44.6 s | 0 of 12 | 37.7 s |
| normal | line | 1 of 12 | 20.7 s | 0 of 12 | 38.3 s |
| normal | flee | 9 of 12 | 227.7 s | 9 of 12 | 209.0 s |
| normal | cutback | 0 of 12 | 29.5 s | 0 of 12 | 49.0 s |
| hard | line | 0 of 12 | 21.6 s | 0 of 12 | 43.5 s |
| hard | flee | 7 of 12 | 240.0 s | 4 of 12 | 183.4 s |
| hard | cutback | 0 of 12 | 25.0 s | 0 of 12 | 32.1 s |
| brutal | line | 1 of 12 | 18.6 s | 0 of 12 | 22.1 s |
| brutal | flee | 2 of 12 | 214.2 s | 3 of 12 | 191.4 s |
| brutal | cutback | 0 of 12 | 32.3 s | 0 of 12 | 32.4 s |
| **gentle, all bots** | | **10 of 36** | **44.6 s** | **8 of 36** | **44.9 s** |
| **normal, all bots** | | **10 of 36** | **29.5 s** | **9 of 36** | **51.7 s** |
| **hard, all bots** | | **7 of 36** | **30.9 s** | **4 of 36** | **50.1 s** |
| **brutal, all bots** | | **3 of 36** | **44.7 s** | **3 of 36** | **35.7 s** |
| **all 144** | | **30 never caught** | | **24 never caught** | |

## What it reads as
- **More runs are never caught with the fix: 30 of 144 against 24.**
  - The fleeing bot keeps its speed: at hard, 7 of 12 escape against 4, and its catches come later (240.0 s against 183.4).
  - The line bot, which never escaped under the old rule, now escapes once each at gentle, normal and brutal.
- **But a bot that is caught is caught SOONER in most cells.**
  - The line bot at normal: 20.7 s against 38.3. At hard: 21.6 against 43.5.
  - The cutback bot at normal: 29.5 against 49.0.
  - The level's median to a catch: normal 29.5 against 51.7; hard 30.9 against 50.1.
  - inferred: a runner that no longer stumbles meets what is ahead of it sooner: a dead end, a sprinter or an interceptor cutting across. In the old runs the stumbles also bought distance behind.
  - Not measured here: which chaser made each catch, beyond the sweep's own "what ended the runs" shares (in the `.out` files).
- **Brutal moves least:** 3 of 36 never caught either way. Its median to a catch is 44.7 s shipped against 35.7.
- **How far to read it:** 12 seeds a cell.
  - A difference of one or two runs in a cell is within what another seed set could move. The cells' direction is mixed at gentle and brutal.
  - The clearest effects are the fleeing bot's escapes at hard (7 against 4) and the line bot's faster catches at normal and hard (about half the time). Those are the ones to read again on more seeds before anything is tuned on them.
- **Every catch count before 08:56 today was taken on a runner that stumbled every second or two** (the librarian's ruling, item 4, "for pane A, named"). This table is the first after.

## Not done
- **Nothing changed;** no dial touched. Pane A's catch-rate work reads this.
- **The lock lap is still in hand.** Its gated harness ranges continue; the push gate's rows 49-56 are owed one at a time (that harness's `--only` takes one number, so my range applied none). The lighthouse push is held by the chair's 14:35Z word.

`S` = `G:\consonance-scratch\o-look`.

BASE: G:\consonance-scratch\dz3-o-catch c662536
SOURCES: G:\consonance-scratch\o-look\catch-shipped.out
SOURCES: G:\consonance-scratch\o-look\catch-old.out
SOURCES: G:\consonance-scratch\o-look\catch-shipped_runs.csv
SOURCES: G:\consonance-scratch\o-look\catch-old_runs.csv
SOURCES: G:\consonance-scratch\o-look\catchtable.out
NEXT: librarian route the catch table to pane A's catch-rate work when this is read; O goes back to the lock lap
