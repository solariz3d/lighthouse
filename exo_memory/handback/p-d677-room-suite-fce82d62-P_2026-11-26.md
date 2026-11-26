# The room's js-suite + TAP at lighthouse main fce82d62, owed from L257 (pane P, 2026-11-26)

Seat: pane P (sibling-372c8abc). The chair's packet of 2026-11-26T18:02:52Z ("THEN … the room's js-suite + TAP at lighthouse main fce82d62. It is owed from L257"),
ledger D677. Tier: PROVE IT (a full run). L257's debt: `exo_memory/handback/p-l257-push-A_2026-11-26.md:12` ("The full js-suite and TAP were **not run** on ab3ed333,
ecb1a69b or d8c98105"). checked: `git merge-base --is-ancestor d8c98105 fce82d62` → yes, so this run covers them.

## 0. The answer first

**No new red.** The three red files are the three that were red at the 11-25 landing's base, for the same causes (`p-d677-land-lh-P_2026-11-25.md` §3). The cargo test was
not run; the packet asks js-suite + TAP.

## 1. The run

The run used a clean worktree, `G:\consonance-worktrees\lh-suite-p26`, detached at fce82d62. The runner is `G:\consonance-scratch\p-gate\suite-lh26\run.js`, the 11-25 runner
with the cargo step removed. It ran as `heavy-run --run --exclusive --priority belownormal`, behind `--wait-game` (wait.txt: "no game of his running"). The tree was clean
before and after each part (run.log).

| check | result | source |
|---|---|---|
| js-suite.js | 205 green · **2 failed** · 0 crashed · 1 canary · 1 not-run, of 209; 1,565 s | js-suite.out:211 |
| node --test TAP, the same files one at a time | tests 3,483 · pass 3,467 · **fail 8** · skipped 8; 3 files not exit 0; 1,407 s | run.log, tap-failed.txt |

## 2. Every red, read

- **carrier-drift.test.js** (js-suite, and TAP 3 rows: 17, 22, 37). checked: `node consonance/tools/carrier-drift.js` in the worktree → 5 × CH4-DRIFT-ADDED, all under
  `exo_memory/research/`:
  - from 11-25 (the same three as at the 11-25 base): `fable_vs_opus_use_2026-11-25.md`, `intake_carry_cost_and_use_2026-11-25.md`, `same_shape_elsewhere_2026-11-25.md`;
  - from 11-26 (two more): `clean_ui_design_sources_2026-11-26.md`, `jev_state_and_updates_2026-11-26.md`.

  The same cause as before: research notes not yet frozen into the CH-4 list. Freezing them means reading them whole, which is not part of a suite run.
- **shelf-recursion.test.js** (js-suite, and TAP row 9): "git unavailable; cannot cross-check the corpus set" (tap.out:19660). checked: `git ls-files exo_memory | wc -c` →
  **1,115,339 B** (1,070,534 at fb12e24a on 11-25). That is still over node's default 1 MiB maxBuffer, so the test's own probe throws, as on 11-25.
  - The fix is still a `maxBuffer` on that probe: a separate packet, still unrouted.
  - inferred: the listing grows about 45 KB a day, so the failure will not clear by itself.
- **targetless-pull.test.js** (TAP rows 4–7): the declared canary, red on purpose; js-suite counts it as canary, not as a failure.
- **actors.evidence.test.js**: NOT-RUN, declared machine-bound (js-suite's own reason). Not claimed either way.

BASE: the lighthouse checkout (Desktop\lighthouse) fce82d62
SOURCES: G:\consonance-scratch\p-gate\suite-lh26\{wait.txt, run.log, go.txt, js-suite.out, tap.out, tap-failed.txt}; carrier-drift.js; git ls-files exo_memory | wc -c; git merge-base --is-ancestor d8c98105 fce82d62; heavy-run.js --status
NEXT: chair closes L257's owed suite on this, and routes shelf-recursion's maxBuffer and the CH-4 freeze of the five notes when it plans the next lap.
