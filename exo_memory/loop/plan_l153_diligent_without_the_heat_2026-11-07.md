# L153: just as diligent, without cooking the laptop. Librarian, on L, 2026-11-07 03:0x local

**His words, 08:57Z–09:01Z:** "again why does my laptop push to over 100c for the cpu with consonance on" · "had to turn up my fans to max speed, i swear i never noticed consonance before do this until last night, perhaps how we do mutation tests or whatever, or something we changed on desktop before cominbg back to work is what pushes it" · "when i say at home on desktop i meant the month we didnt work on laptop" · "but why, is there a way we can be dilligent and just as efficient without suffering our hardware? Cmon man" · "lets do it"

## What was measured (librarian, 08:57Z–09:00Z)
- **A 5 s CPU sample** at 02:57: about 48% of 32 threads. Two full t180 suites were running at once, A's and B's L152 branches: `node --test --test-concurrency=4 test/*.test.js app/test/*.test.js`, with headless Chrome. One Chrome held 4 GB. The Consonance app itself was 0.7%.
- **The suite grew in the desktop month.** t180 at 280304f (09-30) against fc3cc63 (11-06):
  - test files 124 → 348;
  - files that open a headless browser 21 → 48;
  - frame-timing files 0 → 11 (git grep `performance.now|per-frame|median.*ms`).
- **`npm test` includes the mutation harnesses.** `scripts/test-fast.cjs` :9-14 says they "are most of the full run's tens of minutes" and run weekly on CI (`bc74cfa`). Every pane's full run on L runs them too. **His guess was right.**
- **Two heavy slots since 10-10** (D286, `heavy-run.js:14`). **Done already:** `CONSONANCE_HEAVY_SLOTS=1` was set as a user environment variable on L only (09:00Z). The panes take it when they next start.
- On 10-27, 97 chrome.exe were counted in one touched-test run (`plan_d504_headless_browser_cap_2026-10-27.md`).

## The shape (the rigor stays; the repeats go)
- **AMENDED at his word, 09:05Z:** "code is related to the rest of the base of it … not measuring what is around it as well means we do not understand the related code as much as we could seeing the rest of the base … Even if it is expensive perhaps it is a good thing?"
  - He is right, and the require graph cannot see coupling through data and behaviour, e.g. the panel asking for something other than what the core lays (D642 R2), or geometry read by the renderer.
  - So **every hand-back still runs the whole base once**: test-fast is the entire suite less the mutation harnesses and the timing pages. Touched-only is for the pane's runs WHILE it works, not for its hand-back.
  - What is cut is only (a) the mutation harnesses on every run, (b) two whole-base runs side by side, and (c) four workers on the laptop.
  - The mutation harnesses test whether the tests catch bugs planted in one module. They do not look at the code around it.
- **While a pane works:** it runs only the test files that load a module it touched, plus their mutation harness if it touched core logic. **At its hand-back: test-fast once, the whole base.**
- **At a landing, once, on one tree:**
  - `node scripts/test-fast.cjs`;
  - the three frame-timing files alone, under the lock;
  - the mutation harnesses of the touched modules only.
  - The whole mutation set stays weekly on GitHub's machines.
- **On L:** test concurrency 2 (a laptop-only setting, as heavy slots are); one heavy run at a time (done).
- **Browsers:** the page tests share a few headless Chrome instances instead of one per file, if B's numbers show Chrome is where the cost is.

## AMENDED 11:51Z, his words: "c shell doing it again as soon as i turn my fans off 100c lol, once you get the UI work done, we need to fking fix the tests cracking our shit to max, like we can use our hardware but not maxing it out"
- Runs right after L154. The goal is now stated by him: **use the hardware, never max it.**
- **The cap that does that: CPU affinity on the heavy run.** heavy-run.js starts its child under an affinity mask (a laptop setting, e.g. `CONSONANCE_HEAVY_CPUS=12` of 32 logical; unset on D = today's behaviour). Every child (test workers, headless Chrome, cargo) inherits it, so a whole run can never take more than that share, whatever its concurrency. Measured, not assumed: one test-fast run on L before and after, CPU % and temperature (or package power, if no temperature is readable) every 10 s, and wall time.
- Plus what was already here: test concurrency 2 on L, timing files out of test-fast (core-extra-bank-drag-cost, preview-lod-frame), and the tiers.

## Pieces (after L154 is collated; nothing heavy runs alongside another)
- **C (measure, no new heavy run):**
  - From the TAP and spec output of tonight's L152 full runs (B's and A's), give each test file's duration, and the totals for: mutation harnesses, frame-timing, browser pages, the rest.
  - If the output lacks per-file times, ONE run of the full suite at concurrency 1 under the lock, at BelowNormal, alone, with nothing else running.
  - The answer: what share of a full run each group is.
- **B (build, t180 branch `l153-test-tiers`):**
  - `scripts/test-touched.cjs`: the changed files (git diff against the base) → every test file that requires them, directly or through the require graph, plus their mutation harnesses where the module has one. It prints the list and its reason per file, then runs it.
  - An env setting for test concurrency (`T180_TEST_CONCURRENCY`, default 4, set to 2 on L), read by test-fast and test-touched.
  - Its own tests: a changed panel.js picks the panel tests; a changed core module picks its harness; an unknown file falls back to test-fast.
  - Update the `CLAUDE.md` "Tests" section with the tiers.
- **AMENDED again at his word, 09:08Z:** "dont you ever think we create more work for ourselves constantly planting bugs to fix? Like it was good in the beginning learning to trust ourselves and the process we made ,but now its like just getting in the way". Checked: 22 t180 commits since 10-07 mention mutation; by their subjects they are almost all upkeep of the harnesses (new mutants per feature, re-anchoring after rewording, retiring untestable ones). None of the subjects names a road defect found by a surviving mutant. So: **no new mutation harnesses or mutants with features; the 30 that exist run weekly on CI only; E's proof below plants no bugs.**
- **E (the proof, before anything replaces the full run, NO planted bugs):** register first, then read.
  - For the last landings with a red (L144 drag-frame row 8 and release-frame row 1; the 5 fails of 4,500; any reds in L152), would the new tiers have run the test that went red?
  - Read only what already happened: for every landing hand-back since 10-20 with a red, which test file went red, and was it in the touched set, in test-fast, or only in the mutation or timing groups? Falsifier: a real red caught only by a mutation harness means the weekly run is too rare, and it moves back to landing.
  - **His point about the surrounding code, as a number:** how many of those reds were OUTSIDE the touched set, i.e. caught only by the whole base.
- **Librarian:** the room's rule text (`COMMITTEE.md` / `BUILDING.md`, wherever a lap's "full suite" is named), changed in the same landing as B's script, after E's proof.

**Stop rule:** if E's proof misses a revert, the full run stays the landing check, and only the slot, concurrency and timing changes go in.
**Done when:** a lap's pane run is touched-only, a landing runs the tiers once, and on L one landing's peak is measured again against tonight's 48%.
