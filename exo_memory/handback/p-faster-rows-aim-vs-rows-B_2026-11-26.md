# The aim or the coupled rows? [T3]'s 53 under O4 (D677): pane B, 2026-11-26

The chair's order of 00:58:13Z, on my prediction result (`exo_memory/handback/p-faster-rows-prediction-B_2026-11-26.md`, lighthouse `0546ef2`).
- Under O4 (the turn and climb row law lifted to a 20 m floor), O's `hand.js` laid rows in 51 of the 53 sections and made none.
- Two readings were left open:
  - **the aim:** `hand.js`'s linear-influence solve and 4 retypes miss what a better aim would hit;
  - **the coupled rows:** the other row laws still refuse or distort what the section needs.
- Scratch only. Same instrument; [T3]'s data stays local.

## Registered BEFORE any run (this section was committed before the runs started; see the commit that adds it)

**What the two runs are**, each on the O4 build (`ceb21f5` + E's three env lines, `FR_K=0.001`, the 20 m floor), with NMAX = O's count − 1 as before:
- **(a) the aim given room:** `TRIES` 4 → 12, and the spacing list made finer above the floor: `inf,160,120,100,80,70,60,50,45,40,35,30,25,20` (was `inf,120,80,60,40,30,20,15`; 15 m is under the floor and was always refused). Row laws as in O4.
- **(b) the coupled rows lifted:** the width, cup and edge row floors set to the same 20 m.
  - `CHANGE_FLOOR_M` w 40 → 20, c, e, er 26 → 20, by one env-read line, scratch only.
  - **The climb is already at 20 m under O4:** `minLaw` serves `kh` and `kv` alike, and the O4 run had 0 climb refusals. So (b) adds width, cup and edges.
  - `TRIES` and the spacing list stay at O4's (4; the default list), so that only the laws move.
  - The bank's law (`SECOND_MIN_K`) is not touched by either run.

**The measure:**
- Primary: sections of the 53 made in fewer pieces than O's count, beyond O4's 5 (37, 43, 45, 61, 104, all plain pieces). Sections added by rows are counted separately from any made by plain pieces.
- Secondary: per section, the best (lowest) worst/tol of a laid row attempt; O4's median is 3.25, minimum 1.14.

**What each outcome means, fixed now:**
- **"It is the aim":** (a) adds **5 or more** sections (10% of 53) made with rows, and (b) adds **1 or fewer**.
  - Corroborating: (a) moves the median best worst/tol from 3.25 to 2.0 or less, and (b) leaves it within ±0.5 of 3.25.
- **"It is the coupled rows":** (b) adds **5 or more** sections made with rows, and (a) adds **1 or fewer**.
  - Corroborating: (b) brings the width refusals (377 in O4) near 0, and the misses on width and edge fall.
- **Both:** each adds 5 or more. Then both bind, and I report how far the two sets of sections overlap.
- **Neither (the outcome I would least like, named so it is sayable):** each adds **1 or fewer**. Then the count is held by neither reading as tested. Candidates, untested here:
  - the 20 m floor itself;
  - the bank's law;
  - the coupling between channels that `hand.js`'s per-channel solve does not model;
  - an aim better than 12 retypes of the same solve, which (a) does not exclude.
- **Between (2 to 4 added by either):** not decisive. I report it as that, and do not round it to a reading.

**My bias:** I named the two readings in my last result, so I hold a stake in one of them being the answer. The "neither" outcome is the one against me.

## Results

(to follow the runs)
