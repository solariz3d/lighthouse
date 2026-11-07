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
- **During a lap:** a pane runs only the test files that load a module it touched, plus their mutation harness if it touched core logic.
- **At a landing, once, on one tree:**
  - `node scripts/test-fast.cjs`;
  - the three frame-timing files alone, under the lock;
  - the mutation harnesses of the touched modules only.
  - The whole mutation set stays weekly on GitHub's machines.
- **On L:** test concurrency 2 (a laptop-only setting, as heavy slots are); one heavy run at a time (done).
- **Browsers:** the page tests share a few headless Chrome instances instead of one per file, if B's numbers show Chrome is where the cost is.

## Pieces (after L152 is collated; nothing heavy runs alongside another)
- **C (measure, no new heavy run):**
  - From the TAP and spec output of tonight's L152 full runs (B's and A's), give each test file's duration, and the totals for: mutation harnesses, frame-timing, browser pages, the rest.
  - If the output lacks per-file times, ONE run of the full suite at concurrency 1 under the lock, at BelowNormal, alone, with nothing else running.
  - The answer: what share of a full run each group is.
- **B (build, t180 branch `l153-test-tiers`):**
  - `scripts/test-touched.cjs`: the changed files (git diff against the base) → every test file that requires them, directly or through the require graph, plus their mutation harnesses where the module has one. It prints the list and its reason per file, then runs it.
  - An env setting for test concurrency (`T180_TEST_CONCURRENCY`, default 4, set to 2 on L), read by test-fast and test-touched.
  - Its own tests: a changed panel.js picks the panel tests; a changed core module picks its harness; an unknown file falls back to test-fast.
  - Update the `CLAUDE.md` "Tests" section with the tiers.
- **E (the proof, before anything replaces the full run):** register first, then run.
  - For the last landings with a red (L144 drag-frame row 8 and release-frame row 1; the 5 fails of 4,500; any reds in L152), would the new tiers have run the test that went red?
  - Also, by mutation: take 10 recent real fixes from git log, revert each on a scratch tree, and check that test-touched picks a file that fails.
  - Falsifier: any revert whose failing test the tiers do not run means the tiers are not as diligent, and the plan stops.
- **Librarian:** the room's rule text (`COMMITTEE.md` / `BUILDING.md`, wherever a lap's "full suite" is named), changed in the same landing as B's script, after E's proof.

**Stop rule:** if E's proof misses a revert, the full run stays the landing check, and only the slot, concurrency and timing changes go in.
**Done when:** a lap's pane run is touched-only, a landing runs the tiers once, and on L one landing's peak is measured again against tonight's 48%.
