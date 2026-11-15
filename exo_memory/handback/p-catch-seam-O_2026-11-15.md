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

## THE LARGER READ: 48 seeds at normal, hard and brutal, with what ended each run (the chair's 19:45Z order; nothing changed)
- **What ran:** the same sweep, `--seeds 48 --levels 1,2,3`, the three bots, shipped and `--move "riser_keeps_speed=0"`, each through heavy-run's lock.
  - checked: `catch48-shipped.out` exit 0 (520 s); `catch48-old.out` exit 0 (305 s); 432 runs each.
  - The CSVs' `move` column confirms each rule.
- **The table:** `catch48table.js` (`G:\consonance-scratch\o-look\catch48table.out`).
  - "Median" is over the caught runs.
  - Each chaser's catches come from the CSV's own `by` column, with the median time of that kind's catches.

| level | | never caught | median to a catch | hunter: catches @ median | sprinter | interceptor | pack |
|---|---|---|---|---|---|---|---|
| normal | **shipped** | **34 of 144** | **34.2 s** | **84 @ 30.9 s** | 22 @ 52.2 | 2 @ 104.0 | 2 @ 277.8 |
| normal | old rule | 29 of 144 | 49.2 s | 84 @ 49.0 s | 29 @ 51.7 | 2 @ 144.3 | 0 |
| hard | **shipped** | **22 of 144** | **45.7 s** | **91 @ 32.8 s** | 14 @ 50.4 | 14 @ 51.3 | 3 @ 160.8 |
| hard | old rule | 17 of 144 | 46.2 s | 87 @ 42.0 s | 15 @ 46.2 | 17 @ 43.5 | 8 @ 185.0 |
| brutal | **shipped** | **8 of 144** | **38.5 s** | **91 @ 42.5 s** | 13 @ 40.6 | 16 @ 33.0 | 16 @ 40.2 |
| brutal | old rule | 7 of 144 | 33.3 s | 98 @ 35.0 s | 7 @ 38.4 | 17 @ 24.9 | 15 @ 64.7 |
| **all three** | **shipped** | **64 of 432** | **40.0 s** | **266 @ 32.5 s** | 49 @ 51.2 | 32 @ 42.3 | 21 @ 54.9 |
| all three | old rule | 53 of 432 | 42.9 s | 269 @ 40.9 s | 51 @ 46.2 | 36 @ 32.3 | 23 @ 140.7 |

- **The bots one at a time** (from `catch48table.out`):
  - **normal:**
    - line: never 2/48 against 0; median 28.5 against 39.7 s; hunter 37 @ 22.5 against 34 @ 29.8.
    - flee: never 32/48 against 29.
    - cutback: never 0 both; median 34.2 against 46.5; hunter 37 @ 31.1 against 37 @ 46.3.
  - **hard:**
    - line: never 1/48 against 0; median 28.7 against 32.5.
    - flee: never 21/48 against 17.
    - cutback: median 39.2 against 33.7.
  - **brutal:**
    - line: never 2/48 against 0; median 21.8 against 22.7.
    - flee: never 6/48 against 7; median 159.4 against 189.8.
    - cutback: median 32.9 against 27.5.
- **What the 48 seeds say:**
  - **The bots are never caught somewhat more often with the fix: 64 of 432 (14.8%) against 53 (12.3%).** It is the same way at every level (normal 34/29, hard 22/17, brutal 8/7), mostly the fleeing bot.
  - **"Caught sooner" holds at NORMAL only:** the median to a catch is 34.2 s against 49.2, about a third sooner, not half.
    - **Its cause is the hunter:** it makes the same number of catches (84 and 84) and makes them sooner (30.9 s against 49.0). That is true for the line and the cutback bots alike. Sprinters make fewer catches (22 against 29).
    - inferred, not traced: a bot that no longer stumbles runs its route faster, and so meets the hunter's line sooner. Nothing here says where on the route.
  - **At HARD the median does not move** (45.7 against 46.2). The hunter's own catches are still sooner (32.8 against 42.0), but its share is balanced by the interceptors' and packs' later and fewer catches.
  - **At BRUTAL the catches come LATER with the fix** (38.5 against 33.3), the hunter's too (42.5 against 35.0). Fewer interceptor catches are early (33.0 against 24.9).
- **CORRECTION to my 12-seed reading above:** "at normal and hard, the median time to a catch about HALVES" was too strong.
  - On 48 seeds: normal comes **about a third sooner** (34.2 against 49.2); hard **does not move** (45.7 against 46.2); brutal comes **later**.
  - The 12-seed hard cell (30.9 against 50.1) was the small sample.
- **Still 48 seeds a cell,** so a few runs in a cell are within what another seed set could move. The two readings that hold at every level are the extra escapes (the flee bot) and the hunter's sooner catches at normal and hard.

## The catch read at the grips (the chair's 20:58Z order): NOT RUN, stopped at his word of 15:03 ("stop working on the old one completely for now")
- **Answered first, as asked:** the sweep DOES take the chase-speed pairs.
  - checked: `git show 3112032:chase/speed.h` → `grip_mu` (:41), `root_law` (:49) and `line_arcs` (:52) are speed-model fields.
  - checked: `dz-chase sweep --speed` sets them (`main.cpp:123`, `:156`).
  - checked: `set_speed` splits on space, `;` and tab (`chase/speed.cpp:13-15`).
- **What happened:**
  - a tree at a-mline 3112032 (`G:\consonance-scratch\dz3-o-mline`) was built: checked: `grip4-build.out` → exit 0 at 15:05:36;
  - the first arm was still waiting on the lock (both slots held: B, A) when the stop came. **It never started.**
  - I stopped the runner by its handle. checked: Win32_Process → nothing of it running or waiting.
- **No table:** nothing was swept, so there is nothing to file. The tree and the runner (`grip4.js`, `grip4table.js`) are left on G: for when it is asked again.
