# p-land-five: the five-branch landing, tested and HELD on two reds (O, landing pane), 2026-11-13

Packet: the chair's D675 order, as reshaped at 21:30Z (one landing, one suite, a red bisected by branch) and 21:38Z (cd-refreeze-p makes five). Tier: PROVE IT. Seat: O.

## State: tested, NOT on main, NOT pushed
- **Landing tree** `C:\Users\nname\Desktop\worktrees\lh-land-four-o`, branch `land-four-o` at **da225e0d**, off main a5ea309b:
  - 92647969 merges lap-w-h-p c1b9a395;
  - dc89ba50 merges lap-i-p 764a2d2f;
  - 10e545fd merges pp-fixture-p d8554952;
  - 8553441e merges lt-standin-b 51046c01;
  - 3f4f2d42 is the landing commit (pane H's two MAP.md rows, and the change record);
  - **da225e0d merges cd-refreeze-p 6907fd51.**
- **The fifth branch rode it.** It was merged before any test ran: js-suite was still blocked at its lock call (`js-suite.js:207`), and no `js-suite.out` existed yet.
  - checked: `git diff --stat HEAD~1 HEAD` → only `consonance/tools/carrier-drift.registry.json`, +13 -3.
- **Not merged into the shared main and not pushed, because two reds remain.** Main is now 4da776b6; origin/main is 0fedf4d3.

## The suite (all on da225e0d)
- checked: `landing-train.test.js` alone, as TAP → **17 pass, 0 fail** (`S\land4\landing-train.tap`).
- checked: `node consonance/tools/js-suite.js` (BelowNormal, hidden, under the lock; 1,645 s) → **195 green · 1 failed · 1 crashed · 0 silent · 1 canary · 1 not-run of 199** (`S\land4\js-suite.out`).
- checked: TAP of the 10 touched test files → **124 pass, 0 fail** (`S\land4\touched.tap`).
- **carrier-drift is green.** Its 4-row base red is gone with the fifth branch.
- **forget-rate and gen-consumer** both passed inside the suite this time, so neither needed the solo re-run.
- **The canary** `targetless-pull` is declared expected-red. **The not-run** `actors.evidence` is declared machine-bound.

## Red 1: `universe-print.test.js` CRASHES, and the cause is lap-i-p (764a2d2f)
- **The crash:** its fixture throws at `universe-print.test.js:314`, "the userprompt-submit.js row is not in the live manifest". The fixture's regex `(userprompt-submit\.js';[^\n]*?)\s*\}` needs the row's closing `}` on the same line.
- **The cause:** Lap I (8c8ab3b0, febc3e66 and 1d8f1026, "the four ruled rows carry their reasons") spread that row of `dev/shell/install.ps1` over several lines.
- **Bisected:**
  - checked: `S\land4\uprow.js` (the test's own regex against `git show <sha>:dev/shell/install.ps1`) → matches at a5ea309b and 92647969; no match from dc89ba50 on.
  - checked: universe-print run alone on a detached worktree at 92647969 → **16 passed, 0 failed, exit 0** (`S\land4\universe-print-92647969.out`). On da225e0d → exit 1 (`…-da225e0d.out`). The worktree has since been removed.
- **The fix is not mine to choose.** It is either the fixture's regex or the row's layout; it belongs to lap-i-p's author, or whoever the librarian routes it to.

## Red 2: `portable-paths.test.js`, 2 rows: `consonance/tools/heavy-run.js:404`, from the GUARD I landed
- **The path:** line 404 is the IDLE HOLDER text from 901d3c39 (l202-idle-guard-p). Its prose names a shell started as `` `cmd C:/` ``, and the test reads that as a machine-specific path.
- **On main since 0fedf4d3,** so it is in this landing and on origin alike.
- checked: portable-paths alone on da225e0d → **41 pass, 2 fail**, each naming only `heavy-run.js:404`. pp-fixture-p cleared everything else.
- **A one-line fix is possible** (reword the prose, or add a baseline row). It is P's file and P's call, so I made neither.

## Correction (mine): the guard landing's hand-back misclassified this red
- `p-l202-guard-landing-O_2026-11-13.md:21` says portable-paths' 2 rows were "red at the base, as the chair named it". **That was wrong in part.** The rows were red at the base, but the guard added a path of its own to them, and I never read which paths they named.
- checked: portable-paths alone on the tested guard merge 433173bf (`worktrees\lh-land-l202-o`) → **4** unbaselined paths:
  - `heavy-run.js:404`, the guard's own;
  - `landing-train.test.js:206`, `clean.js:3` and `CLEAN.md:5`, all three already on the base.
- **How I missed it:** a red row that already exists at the base hides a new path added to it, and I classified by row rather than by path.
- **Classify a portable-paths red by its paths from now on.** This is on my map line.

## What L owes from this landing
- **Nothing yet.** Nothing landed. Once it lands, L takes the tools with a `git pull`, and the hook installs are this machine's (the order's step after landing).

## Next
- **When both reds are fixed on their branches,** I re-merge the fixed tips into `land-four-o`.
- **Then I re-run:**
  - universe-print and portable-paths alone first;
  - then the suite;
  - then the scans (credentials and PRIV_PATTERN, plus the d528 list).
- **Then I merge into the shared main, and push.** The installs follow the push.

`S` = `C:\Users\nname\AppData\Local\Temp\claude\e1275915e2cd5544\c88002b1-74d8-4036-8cc0-f64aefbeabff\scratchpad`.

BASE: C:\Users\nname\Desktop\worktrees\lh-land-four-o a5ea309b
SOURCES: S\land4\{js-suite.out, landing-train.tap, touched.tap, uprow.js, universe-print-92647969.out, universe-print-da225e0d.out}; portable-paths.test.js run alone on da225e0d and 433173bf; git blame -L 404,404 consonance/tools/heavy-run.js
NEXT: librarian route red 1 (lap-i-p's author) and red 2 (P, heavy-run.js:404) when this ring is read; O re-runs and lands when the fixed tips are named
