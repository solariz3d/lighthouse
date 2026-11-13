# p-l202-guard-landing — P's idle-holder guard landed on lighthouse main (O, landing pane), 2026-11-13

Packet: the chair's D675 order of 14:17 (item 1), as reshaped at 14:35, 14:39 and 15:30. Tier: PROVE IT. Seat: O.

## What landed
- **`l202-idle-guard-p` 6c054aa1:** three commits, 901d3c39, f8b69c23 and 6c054aa1, committed AS THEY ARE; nothing edited. Three files: `consonance/tools/heavy-run.js`, `heavy-run.test.js` and `heavy-run.mutants.js` (+252 -3).
- **Merge `0fedf4d3`** on main 7861759e, in the shared checkout (the three files clean there, nothing staged).
  - checked: `heavy-run.js` at 0fedf4d3 is byte-identical to the tested merge 433173bf's.
- **Pushed:**
  - checked: `git push origin 0fedf4d3:main` → `8fd453c6..0fedf4d3`;
  - checked: `C:\Consonance\data\push-gate.jsonl` → decision **allow**, 2026-11-13T21:31:34.833Z, src 0fedf4d3.
  - The push carried the room's 190 unpushed commits with it, all scanned (below).
- **Board row posted** (the chair's wording): IDLE HOLDER is a prompt to look, never grounds to stop; the guard only reports; its open limit is short-lived children.

## The suite on the merged tree (tested BEFORE main moved)
- **Tested as merge `433173bf`** on f29e9eb9, in `worktrees\lh-land-l202-o`. Main moved to 7861759e after that.
  - checked: `git diff --name-only f29e9eb9 7861759e` → exo_memory only, so no code or test changed between the tested tree and the landed one.
- checked: `node consonance/tools/js-suite.js` (BelowNormal, hidden, under the lock; `S\l202\js-suite.out`, 3,604 s mostly waiting for a slot) → **188 green · 2 failed · 2 crashed · 0 silent · 1 canary · 1 not-run** of 194.
- checked: `node --test --test-reporter=tap consonance/tools/heavy-run.test.js` → `S\l202\heavy-run.tap`: **104 of 104**.
- **Every red classified, none the guard's:**
  - **`portable-paths.test.js`, 2 rows: red at the base**, as the chair named it (fixed by `pp-fixture-p`, which lands next).
  - **`carrier-drift.test.js`, 4 failed: red at the base, and NOT named in the order.**
    - checked: run alone on the merged tree and on a detached worktree at the base f29e9eb9 (`S\l202\merged-carrier-drift.test.js.out`, `base-…`) → the same 4 fail on both, "actual true, expected false".
    - It doesn't load `heavy-run.js`. For the librarian to route.
  - **`forget-rate.test.js` and `gen-consumer.test.js` CRASHED in the suite** (timeouts, under the machine's load), and **are green alone on the merged tree.**
    - checked: forget-rate "12 passed, 0 failed" (125 s); gen-consumer "pass 116, fail 0" (211 s). `gen-consumer` reads `heavy-run`, so it was the one that could have been the guard's; alone, it is green.
  - **`landing-train.test.js`:** green in this run. The chair named its rows 3 to 5 red at the base; they did not fail here (the train is load-sensitive; B's fix lands next).
  - The canary `targetless-pull.test.js` is declared expected-red. The not-run `actors.evidence.test.js` is declared machine-bound.

## Scans over the push range (counts only)
- **Range** `origin/main..0fedf4d3`: 191 commits, 107,095 added lines.
- checked: A's `rangescan.js`, with `PRIV_PATTERN` from A's priv.txt read from the environment (`S\l202\rangescan2.out`) → **every credential shape 0/0** (sk-or-, vck_, sk-ant-, ghp_, github_pat_, AKIA, PRIVATE KEY). PRIV_PATTERN alt 1 and alt 2 0/0; the separately named private name 0/0; email local part 0/0. "keeper" and the private home path are this repo's ordinary words, not on the bar (P's D648 note).
- checked: `allterms.js` over the range's added lines and messages (the d528 list, 72 terms) → non-REVIEW hits 34, on terms #23, #51, #52 and #62.
  - checked: `S\l202\onorigin.js` → each is already in origin's tree: in 113, 79, 66 and 108 files; the push makes it 116, 80, 69 and 111. All are in other seats' room commits.
  - The standing ruling for lighthouse (librarian, 2026-11-02 18:29: the term list guards the public t180 repo; in lighthouse privacy means credentials only) covers them, so they did not stop the push.

## What L owes from this landing
- Nothing to install. `heavy-run.js` is run from the repository checkout on each machine, so L takes it with its next `git pull` of lighthouse main.

## Corrections
- The incident earlier in this lap (I killed P's exclusive timing session at about 18:15Z) is in `p-d675-run-frame-O_2026-11-13.md`. This landing is the guard that names IDLE HOLDERs; the board row says never to kill on one.

`S` = `C:\Users\nname\AppData\Local\Temp\claude\e1275915e2cd5544\c88002b1-74d8-4036-8cc0-f64aefbeabff\scratchpad`.

BASE: C:\Users\nname\Desktop\lighthouse 7861759e
SOURCES: S\l202\{js-suite.out, heavy-run.tap, merged-*.out, base-*.out, rangescan2.out, range-added2.txt}; git push output; C:\Consonance\data\push-gate.jsonl
NEXT: librarian checks 0fedf4d3 and routes carrier-drift's base red when this ring is read; O goes on to the four-branch landing now
