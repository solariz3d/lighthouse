# P-SMOOTH-BANK, LAP 3: the panel's "flow" box (pane O, 2026-11-24)

Tiers as dispatched: the panel's mapping rows were written as tests first; the box's look and wording are CHECK IT and were checked in a headless render (§4); the core
(PROVE IT) is **not touched**: `git diff 57e4b1c 15b1306 --stat -- src/` is empty.
Branch `o-smooth-bank` in t180-fresh, base `57e4b1c`, tip **`15b1306`** (one commit; pushed after the scan, §6). Nothing landed, nothing installed, nothing
launched. The straights (Part 3, item e) stay HELD.
Answers: the chair's LAP 3 dispatch; the plan's Part 5 (`exo_memory/loop/plan_t180_smooth_banked_turns_2026-11-24.md` :158-171) and its Part 2 contract; the
brief's section "Added 2026-11-24 06:5x" (`exo_memory/briefs/t180_banked_s_and_wall_hairpin.md` :189).

## 1. The tip

`15b1306` "Panel: a "flow" box on the bank field, so the flowing bank can be laid by hand". Files: `app/core/panel.js`, `app/index.html` (three CSS lines),
`app/test/core-bank-flow-panel.test.js` and `.pins.json` (new), `CHANGELOG.md`, `MAP.md`.

What the box does:
- **Ticked:**
  - the bank field gains "at m" for the first mark;
  - each extra bank row reads "bank 2 ° … at m";
  - `extendOptions` gives `bankShape: 'flow'`, the first mark as `transition.phi`, and the rows as `through.phi` in radians, which is the Part 2 contract exactly.
- **A blank at** is spread evenly between the marks either side of it (`flowAts`). With none typed, three marks on 300 m land at 100, 200 and 300.
- **The first mark's at,** when blank, is the early ramp's end if "early" is ticked.
- **On the road:**
  - the ghost marks each mark as "Bank 2 · passes X° at Y m";
  - the first mark's handle drags its at;
  - a row's mark drags in order only. The panel copies no core number: the core names the 5 m gap itself.
- **Unticked,** the bank field and its rows are today's, word for word and call for call.

## 2. The rows, red then green (`app/test/core-bank-flow-panel.test.js`)

| row | what it holds | 57e4b1c | 15b1306 |
|---|---|---|---|
| 1 | the flow box with three marks gives the contract's call exactly; blank ats are spread evenly | ✖ | ✔ |
| 2 | unticked, every call lays today's document to the byte: 52 combinations (L 300/1000 × bank '', 30, −41.38 × early × 0/1/2 rows × a 90° corner), sha256 of `D.serialize` pinned on 57e4b1c before the box existed, 11 of them today's refusals, checked with the option left out and with `bankFlow:false` plus a stale at | ✔ (a guard) | ✔ |
| 3 | survives: Undo gives back the box, its at and the rows, and Extend again gives the same bytes; the piece saved, the shell closed, a fresh shell opened gives the same bytes and passes each mark | ✖ | ✔ |
| 4 | mirror negates the marks: saved and inserted mirrored, the bank is the exact negative every 0.5 m and passes each mark's negative | ✖ | ✔ |
| 5 | a refusal reaches the panel in the core's own words, naming the mark and the room it needs (two lists: one refused at the first target, "needs at least … m after the joint (it has 80 m)"; one at a row's mark, "the bank's mark 1 at 70 m needs at least … m after the mark before it (it has 10 m)"); the ghost says it, Extend says it, and nothing is placed | ✖ | ✔ |

Notes on the rows:
- **Red on 57e4b1c:** this final test file run on an export of 57e4b1c (`evidence/rows_lap3_red.txt`); green on the tip (`rows_lap3_green.txt`).
- **Row 2 can see its faults:** it is red under P1, P2 and P4 below, the three mutants that touch only the unticked call.

**Panel mutants: 10 of 10 caught** (`evidence/mut_panel.js`, `mutants_and_panel_tests.txt`):
- P1, the box ticked by default;
- P2, a stale at flowing unticked;
- P3, rows sent as changes too;
- P4, rows dropped unticked;
- P5, blank ats one place early;
- P6, a typed first at ignored;
- P7, targets in degrees;
- P8, Undo without the box;
- P9, the box not sent;
- P10, the refusal rewritten.

**Two of my own test faults,** found while making the rows green and fixed in the test, not in the code:
- **Row 4** first compared 0 with −0, a level bank's two zeros. It now compares `+ 0` on both sides and says so in a comment.
- **Row 5** first used a list that the core refuses at its first target, not at a row's mark. It now holds one list of each kind, and the second names the row's mark.

**The mutant runner** first read every mutant as "survived" because its copy lacked `tools/`. It now copies `tools/` and treats a run that does not reach all five rows as an ERROR, never as a result.

## 3. The touched files' tests

- **`app/core/panel.js`:** every test that loads it, 47 files less the mutation harnesses of other targets, run under the exclusive heavy-run lock.
  - Result: **569 tests: 562 pass, 0 fail, 6 skipped, 1 todo** (`evidence/panel_tests_summary.txt`).
  - The todo (D642, "into the hold") fails as a todo with the same assertion on 57e4b1c, so it was there before this lap.
  - The first D642 ratio row, the timing row LAP 2 named, failed once on 57e4b1c in an unlocked single run and passed on the tip. That is noise, not a result of this lap.
- **`app/index.html`:** the 24 further test files that read it: **217 of 217 pass** (`index_tests_summary.txt`).
- **Three existing layout rows went red on the way, and the fix went in my code:**
  - The rows: L135 C1 and L139 S1 ("a field's list of changes sits right after its row") and the cup row after bank.
  - The cause: a separate "at m" row that I had put between the bank field and its changes.
  - The fix: the at is now the bank row's last child, laid on a second line by CSS (`:has(> .flow-at)`).

## 4. What the box looks like (headless render, CHECK IT)

`evidence/box_A.png` and `box_B.png`. The real `panel.js` `mount` is driven in the tests' fake DOM, written out under the app's own `<style>` and theme sheets, in
the 260 px `#left > #palette` column, and shot by headless Edge (`render_box.js`).
- **A, unticked:** bank 30, one extra bank. The bank row reads "bank ° [30] ☐ flow ☐ early", and the extra row is today's ("extra bank ° [0] –" / "from m [60]").
- **B, ticked:** bank −20 at 80, then 27 at 150 and −28 at 230. It reads:
  - "bank ° [−20] ☑ flow ☐ early";
  - "at m [80]";
  - "bank 2 ° [27] –" / "at m [150]";
  - "bank 3 ° [−28] –" / "at m [230]".
- **The first render of B was broken:** the at beside "flow" and "early" widened the row past the column, squeezing out the bank's value and pushing the rows' remove buttons off the edge. That is why the at sits on its own line now. Seen, not tested, as dispatched.

## 5. Choices made, for the chair to overrule

- **"Survives save, close and reopen":**
  - The tick is kept from piece to piece, like "early", and comes back with Undo.
  - It is **not** a saved setting: the panel's settings hold six keys, and a seventh is a contract change I left to the chair.
  - The piece itself survives save, close and reopen to the byte (row 3).
- **"Three marks"** reads as the first target plus two rows.
- **The CHANGELOG and the code** say the flowing bank was the better of the two, driven side by side. His words stay out of the game repo; they are in the brief.

## 6. Pushed

**Branch `o-smooth-bank` only:** `57e4b1c..15b1306`. `git ls-remote` reads `15b13061…` at `refs/heads/o-smooth-bank`. The push-gate row is
`2026-11-24T13:23:20.871Z`, seat c88002b1, `decision: allow`, scanned `G:\consonance-scratch\o-smooth-t180` → origin `o-smooth-bank`.
- **Before the push,** the added lines were scanned for credentials, his words and track names, and none was found.
- **Not pushed:** nothing on main; lighthouse main stays on HOLD.

**A process slip, mine:** one command carried a stray `mut_panel.js` run outside the lock for under a minute. It collided with the locked run's mutant pass, which stopped at once and was not counted. I stopped the stray and its child by PID (no `/T`) and ran the whole mutant pass again under the lock; §2's 10 of 10 is that run.

## 7. The code map's line for panel.js (MAP.md, in 15b1306)

"…the bank field's "flow" box (`bankFlow`, with the first mark's own "at m", `bankAtF`) makes the extra bank rows marks the bank passes through, "bank … ° at … m":
`extendOptions` then gives `bankShape: 'flow'`, the first mark as `transition.phi` and the rows as `through.phi`, a blank at spread evenly between its neighbours
(`flowAts`), and the core's refusal shows in its own words; unticked, the call is today's to the byte (`test/core-bank-flow-panel.test.js`, pinned in its
`.pins.json`)."

NEXT: librarian call_librarian with this pointer.
