# p-lapi-rows: Lap I's I6 rows 1-8, 10 and 11 installed on D, each red before and green after (O, landing pane), 2026-11-13

Packet: the chair's D675 order of 20:17Z, items 2 to 5, as reshaped at 21:30Z (rows driven by landed-live's OWED lines, after the landing and pane H's five installs). Tier: PROVE IT. Seat: O. Machine: D.

## How each row ran (the spec's :369-374, built from the I6 table at `00_lap_i_spec.md:378-390`)
- **The driver:** `S\inst\row.js <n>`, one leaf a run, from the shared checkout at main (code equal to fab53587).
  1. **Refusal checks first:** it refuses while acs.exe is up or the hold file exists.
  2. **The hook's own test at main:** `node --test`. Row 4 has no test of its own; `second-reader.test.js` covers the pair.
  3. **The red probe, which must be red today, else REFUSED.**
  4. **The run:** `powershell.exe -NoProfile -ExecutionPolicy Bypass -File dev/shell/install.ps1 -NoRegister -Only <leaf>`. Row 11 uses `-Only`, because it must register.
  5. **The green probe;** the installed blob must equal the repo's.
  6. **The .bak** must be kept.
  7. **settings.json:** sha256 unchanged (all rows but 11).
  8. **A bare `-Check`:** must show the entry `ok`.
- **At the first error** it copies the .bak back and stops. No row reached it.
- **The settings baseline is the one after pane H's step 2e** (`p-install-H-O_2026-11-13.md`): **12,332 B, sha256 8a32afa53882d3ba…**. The spec's 4,942 B and 4266711b… is the state before those five installs.
- **Each row's whole output** is in `S\inst\rows\row<n>.txt`, and the installer's output in `install-row<n>.txt`.

| # | leaf | own test at main | red before (spec's) | green after | installed = repo blob | .bak | settings | -Check | DRIFT lines after |
|---|---|---|---|---|---|---|---|---|---|
| 1 | l2-overseer-worker.js | pass 1 / fail 0 | "carries no information" 0 | 1 | 3f01baa9 | -164935 | unchanged | ok | 8 |
| 2 | board-digest.js | 38 / 0 | sealedGate 0 | 2 | 8b504225 | -164949 | unchanged | ok | 7 |
| 3 | userprompt_pulse.py | 13 / 0 | D454 0 | 1 | e9be1eaa | -164958 | unchanged | ok | 6 |
| 4 | second-reader-worker.js | 33 / 0 (second-reader.test.js) | toolUseId 2 lines | 3 lines | b79bbafe | -165039 | unchanged | ok | 5 |
| 5 | ask-ending.js | 7 / 0 | blob 05e6b613 | f66ef873 | f66ef873 | -165048 | unchanged | ok | 4 |
| 6 | release-chime.js | 13 / 0 | defaultRepos 0 | 3 | 905d76e1 | -165105 | unchanged | ok | 3 |
| 10 | second-reader.js | 33 / 0 | relayed 0 | 1 | 2d161fbd | -165126 | unchanged | ok | 2 |
| 7 | delete-gate.js | 14 / 0 | blob 50c5f477 | 4b8a60ce | 4b8a60ce | -165141 | unchanged | ok | 1 |
| 8 | sources-gate.js | 68 / 0 | blob 198710bb | 56f28cf7 | 56f28cf7 | -165201 | unchanged | ok | **0** |
| 11 | second-reader-note.js | 11 / 0 | absent | present | 3427cbbd | none (absent before) | **+1 group, below** | ok | 0 |

- **Order as ordered:** rows 1-6, then row 10 (after row 4), then rows 7 and 8 last of the eight, then row 11.
  - checked: a board row went up BEFORE row 7 (~22:51Z) and another AFTER row 8 (~22:53Z), so a seat that sees a gate error knows whose it is.
- **NOT done, as ordered:** row 9 (push-gate.js; it was installed instead as pane H's step 2e, from Lap W's merge, as the table's own row 9 waits for), and rows 12-13 (dispatch-gate.js and carrier-drift-watch.js stay HELD to 2026-11-27; -Check and landed-live both read HELD).
- **The spec predicted 2 DRIFT after rows 1-8** (second-reader.js, push-gate.js). Both are now synced too (row 10 and step 2e), so **0 DRIFT** is the expected count.
  - checked: the last -Check → 0 DRIFT lines.

## Row 11's settings diff (the order's "exactly ONE added PostToolUse group")
- checked: `S\land4\semdiff.js` of the copy taken before row 11 against settings.json → 10 groups became 11; **ADDED 1:** `hooks.PostToolUse [mcp__consonance__call_chair]`, `hooks\second-reader-note.js`, t=30; **REMOVED 0** (`S\inst\semdiff-row11.txt`).
- **New settings:** 13,069 B, sha256 cacf6209c4a352ef….
- **No restart was done or asked for.** The table's own probe for row 11, `note-shown` rows going from 0 to more than 0, is "picked up at Lap W's restart", so it is NOT read here.

## The live probes (the table's behavioural column)
- **Row 4, GREEN.**
  - checked: `C:\Consonance\data\second-reader.jsonl` → 0 of 4,125 rows carried `toolUseId` before.
  - The first row after row 4's stamp (22:51:06.480Z, a `call_librarian`, status `ok`) carries one.
- **Row 5, GREEN.**
  - checked: `ask-ending.jsonl` → 1,583,779 B before, 1,584,643 B after; it keeps growing.
- **Row 7, GREEN for the call I made.**
  - checked: my next shell call after row 7 ran with no "PreToolUse:Bash hook error". Other seats' calls are not read here.
- **Rows 8 and 10: the ring that carries THIS hand-back is their probe.** No ring had come from any seat since rows 8 and 10 when this was written (22:52:50Z).
  - Row 8: the next ring delivered, with its row, and no gate error in `reply-slot.jsonl`.
  - Row 10: the first `skipped-class` row after its .bak stamp, and 0 `call_librarian` `ok` rows after it.
  - I read both ledgers after this ring and put the result on the board, and in the "After the ring" section below.

## What L owes from these rows (for the handoff)
- **Nothing from this table** ("Machine L: not this table (section 4)", spec `:405`). L's drift is its own, and landed-live run on L names it.
- **What L does owe** is pane H's five installs (`p-install-H-O_2026-11-13.md`).

## Corrections
- **My driver refused row 4 once, wrongly.** It counted occurrences ("toolUseId" occurs 5 times) where the spec's probes are `grep -c`, which counts lines (2). Nothing was installed by the refused run.
  - I fixed the driver to count lines, re-checked rows 1-3 the same way (1, 2, 1; unchanged), then ran row 4.

`S` = `C:\Users\nname\AppData\Local\Temp\claude\e1275915e2cd5544\c88002b1-74d8-4036-8cc0-f64aefbeabff\scratchpad`.

SOURCES: S\inst\rows\{row1..row11}.txt and install-row*.txt; S\inst\semdiff-row11.txt; C:\Consonance\data\{second-reader.jsonl, reply-slot.jsonl, ask-ending.jsonl}; sed of 00_lap_i_spec.md :367-414
NEXT: librarian read the install table when this ring is read; O reads rows 8 and 10's ledgers right after this ring and posts the result on the board

## After the ring (appended 22:54Z, after the ring that carried this file)
- **Row 10, GREEN.**
  - checked: `second-reader.jsonl` → the first row after its stamp (22:53:34.130Z, my `call_librarian`) has status `skipped-class`, and it carries `toolUseId`.
  - No `ok` row follows it.
- **Row 8, GREEN.**
  - checked: `sources-gate.jsonl` → the new gate ran on that ring (22:53:34.148Z) and wrote its row. Its decision was `warn` (mode light), and the ring was queued for delivery, not refused.
  - `reply-slot.jsonl` has had no row since 22:50:26Z, so it holds no gate error.
- **The warn was my formatting, not the gate's error.** It read my whole SOURCES line as one item, because I joined the items with `;` and `{a,b}` braces. Separate items would have matched.
